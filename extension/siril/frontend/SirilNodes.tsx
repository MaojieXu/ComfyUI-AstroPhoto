import { notifyHost } from '../../../frontend/src/host/notify';
import { computed, defineComponent, ref, shallowRef, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import type { ComfyApp } from '../../../frontend/src/host/comfy';
import type { FrontendBundle } from '../../../frontend/src/bundles/types';
import { mountWidget } from '../../../frontend/src/host/mountWidget';
import { normalizeLocale } from '../../../frontend/src/i18n';
import { watchLocale } from '../../../frontend/src/host/locale';
import { commandDescription, commandTitle, SirilCommandDetails } from './SirilCommandDetails';
import { trackDomWidget } from '../../../frontend/src/host/domWidgetMounts';
import { ApiError } from '../../../frontend/src/api/client';
import { canvasPreviewWidth, previewResolutionEvents } from '../../../frontend/src/api/previewSettings';
import { useStorageAction } from '../../../frontend/src/features/storage/useStorageAction';
import {
    collectFormalOutput,
    getCommands,
    type SirilCommand,
    renderCandidate,
    validatePreview,
    type Parameters as SirilParameters,
    type Preview,
} from './api';
import { InfoTip, Inspector } from '../../../frontend/src/features/nodes/preview/Inspector';
import { NodePreview } from '../../../frontend/src/features/nodes/preview/NodePreview';

const SOURCE = 'AstroPhotoFITSSource';
const ASSET_SOURCE = 'AstroPhotoAssetSource';
const IMAGE_PATH = 'AstroPhotoImagePath';
type Extension = Parameters<ComfyApp['registerExtension']>[0];
type Node = Parameters<NonNullable<Extension['nodeCreated']>>[0];
type Formal = { asset: string; key: string; receiptSource: string; observedSource: string; verifiedSource?: string; mono?: boolean };
const executionResults = new WeakMap<Node, Formal>();
const formalOutputs = new WeakMap<Node, string[]>();
const descriptors = new WeakMap<Node, SirilCommand>();
const cliOutputs = new WeakMap<Node, { path: string; widgetKey: string; inputs: (Node | null)[] }>();
function cliState(node: Node) {
    return {
        widgetKey: JSON.stringify(node.widgets?.filter(widget => !widget.name.startsWith('astrophoto_'))
            .map(widget => [widget.name, widget.value])),
        inputs: (node.inputs ?? []).map((_, index) => node.getInputNode(index)),
    };
}

function previewOwner() {
    const values = crypto.getRandomValues(new Uint8Array(16));
    values[6] = (values[6] & 15) | 64;
    values[8] = (values[8] & 63) | 128;
    const hex = Array.from(values, (byte) => byte.toString(16).padStart(2, '0')).join('');
    return [hex.slice(0, 8), hex.slice(8, 12), hex.slice(12, 16), hex.slice(16, 20), hex.slice(20)].join('-');
}

function values(node: Node, command: SirilCommand): SirilParameters {
    return Object.fromEntries(command.parameters.map(parameter => {
        const value = node.widgets?.find(widget => widget.name === parameter.name)?.value;
        const typedValue = typeof parameter.default === 'boolean'
            ? (typeof value === 'boolean' ? value : parameter.default)
            : (typeof value === 'number' ? value : parameter.default);
        return [parameter.name, typedValue] as const;
    }));
}

function parameterKey(command: SirilCommand, parameters: SirilParameters, mono = false) {
    return JSON.stringify(Object.fromEntries(command.parameters.map(parameter => [
        parameter.name, mono && parameter.rgb_only ? false : parameters[parameter.name],
    ])));
}

function sourceId(node: Node, visited = new Set<Node>()): string {
    if (visited.has(node)) return '';
    visited.add(node);
    const input = node.getInputNode(0);
    if (input && (input.comfyClass === SOURCE || input.comfyClass === ASSET_SOURCE))
        return String(input.widgets?.find((widget) => widget.name === 'asset_id')?.value || '');
    if (input?.comfyClass === IMAGE_PATH)
        return String(input.widgets?.find((widget) => widget.name === 'image_path')?.value || '');
    const cliOutput = input && cliOutputs.get(input);
    if (cliOutput) {
        const current = cliState(input);
        if (current.widgetKey === cliOutput.widgetKey && current.inputs.length === cliOutput.inputs.length &&
            current.inputs.every((node, index) => node === cliOutput.inputs[index])) return cliOutput.path;
    }
    const command = input && descriptors.get(input);
    if (input && command?.preview) {
        const result = executionResults.get(input);
        if (
            result?.verifiedSource &&
            result.key === parameterKey(command, values(input, command), result.mono) &&
            result.verifiedSource === sourceId(input, visited)
        )
            return result.asset;
    }
    return '';
}

function release(preview?: Preview) {
    if (preview?.before) URL.revokeObjectURL(preview.before);
    if (preview?.after) URL.revokeObjectURL(preview.after);
}

type PreviewProps = { node: Node; command: SirilCommand; execution: EventTarget; canvas: () => ComfyApp['canvas'] };
const SirilPreview = defineComponent(
    (props: PreviewProps) => {
        const { locale, t } = useI18n();
        const { node, command, execution, canvas } = props;
        const defaults = Object.fromEntries(command.parameters.map(parameter => [parameter.name, parameter.default]));
        const reset = command.parameters.length ? () => updateParameters(defaults) : undefined;
        const owner = previewOwner();
        const expanded = ref(true);
        const inspector = ref(false);
        const refresh = ref(0);
        const data = shallowRef({
            asset: '',
            key: parameterKey(command, values(node, command)),
            formal: '',
            connected: false,
        });
        const preview = shallowRef<Preview>();
        watch(() => preview.value?.error, code => { if (code) notifyHost('error', t('siril.states.' + code, code)); });
        const frameInfo = shallowRef<{ asset: string; channels?: number }>();
        const previewKey = ref('');
        const pending = ref(false);
        const outputs = shallowRef<string[]>();
        const collected = shallowRef(new Set<string>());
        const collect = useStorageAction();
        watch(collect.error, code => { if (code) notifyHost('error', t('siril.states.' + code, code)); });
        const reload = () => {
            refresh.value += 1;
        };

        watch(
            () => props.node,
            (_, __, onCleanup) => {
                const scan = () => {
                    // nodeCreated can run before LiteGraph attaches a new node to a graph.
                    if (!node.graph) return;
                    const asset = sourceId(node);
                    outputs.value = formalOutputs.get(node);
                    const key = parameterKey(command, values(node, command));
                    const result = executionResults.get(node);
                    const monoSource = frameInfo.value?.asset === asset && frameInfo.value?.channels === 1;
                    const formalKey = monoSource ? parameterKey(command, values(node, command), true) : key;
                    const formal = asset && (result?.key === key || result?.key === formalKey) &&
                        (result.receiptSource === asset || result.observedSource === asset)
                        ? result.asset
                        : '';
                    const connected = node.isInputConnected(0);
                    const previous = data.value;
                    if (
                        previous.asset !== asset ||
                        previous.key !== key ||
                        previous.formal !== formal ||
                        previous.connected !== connected
                    ) {
                        data.value = { asset, key, formal, connected };
                    }
                };
                const timer = window.setInterval(scan, 200);
                previewResolutionEvents.addEventListener('change', reload);
                execution.addEventListener('changed', scan);
                scan();
                onCleanup(() => {
                    clearInterval(timer);
                    previewResolutionEvents.removeEventListener('change', reload);
                    execution.removeEventListener('changed', scan);
                });
            },
            { immediate: true },
        );

        const requestKey = computed(() => {
            const { asset, key, formal } = data.value;
            return JSON.stringify([asset, key, formal, refresh.value]);
        });
        const shown = computed(() => (previewKey.value === requestKey.value ? preview.value : undefined));
        watch(
            requestKey,
            (nextKey, _, onCleanup) => {
                const { asset, key, formal } = data.value;
                preview.value = undefined;
                pending.value = Boolean(asset);
                if (!asset) return;
                const controller = new AbortController();
                let owned: Preview | undefined;
                const timer = window.setTimeout(() => {
                    void renderCandidate(
                        command.id,
                        asset,
                        owner,
                        JSON.parse(key) as SirilParameters,
                        controller.signal,
                        formal || undefined,
                    ).then(
                        (result) => {
                            if (controller.signal.aborted) {
                                release(result);
                                return;
                            }
                            const receipt = executionResults.get(node);
                            if (formal && receipt?.asset === formal) {
                                // Only a server-verified formal result can feed a chained preview.
                                if (result.formal) {
                                    receipt.verifiedSource = asset;
                                    receipt.mono = result.channels === 1;
                                    receipt.key = parameterKey(command, JSON.parse(key) as SirilParameters, receipt.mono);
                                }
                                else if (result.error === 'PREVIEW_STALE') {
                                    release(result);
                                    executionResults.delete(node);
                                    execution.dispatchEvent(new Event('changed'));
                                    return;
                                }
                            }
                            owned = result;
                            preview.value = result;
                            previewKey.value = nextKey;
                            pending.value = false;
                            frameInfo.value = { asset, channels: result.channels };
                        },
                        (error) => {
                            if (controller.signal.aborted) return;
                            preview.value = {
                                state: 'failed',
                                error: error instanceof ApiError ? error.code : 'network',
                            };
                            previewKey.value = nextKey;
                            pending.value = false;
                        },
                    );
                }, 400);
                onCleanup(() => {
                    clearTimeout(timer);
                    controller.abort();
                    release(owned);
                });
            },
            { immediate: true },
        );

        watch([shown, () => expanded.value || inspector.value], ([current, active], _, onCleanup) => {
            if (!current?.jobId || !current.before || !active) return;
            const id = current.jobId;
            const controller = new AbortController();
            const interval = window.setInterval(() => {
                if (document.hidden) return;
                void validatePreview(id, controller.signal).catch((error) => {
                    if (controller.signal.aborted || preview.value?.jobId !== id) return;
                    release(current);
                    preview.value = {
                        state: 'failed',
                        error: error instanceof ApiError ? error.code : 'PREVIEW_STALE',
                    };
                });
            }, 8000);
            onCleanup(() => {
                clearInterval(interval);
                controller.abort();
            });
        });

        const mono = computed(
            () => frameInfo.value?.asset === data.value.asset && frameInfo.value?.channels === 1,
        );
        watch(
            mono,
            (disabled, _, onCleanup) => {
                const rgb = command.parameters.find(parameter => parameter.rgb_only);
                const linked = rgb && node.widgets?.find(widget => widget.name === rgb.name);
                if (!linked) return;
                const previous = linked.disabled;
                linked.disabled = disabled;
                if (node.graph) node.setDirtyCanvas(true, true);
                onCleanup(() => {
                    linked.disabled = previous;
                });
            },
            { immediate: true },
        );

        function updateParameters(changes: Partial<SirilParameters>) {
            const graph = node.graph;
            const activeCanvas = canvas();
            if (!graph || activeCanvas?.read_only || activeCanvas?.selectOnly) return;
            const updates = Object.entries(changes).flatMap(([name, value]) => {
                const widget = node.widgets?.find((entry) => entry.name === name);
                return widget && widget.value !== value ? [{ name, value, widget }] : [];
            });
            if (!updates.length) return;
            graph.beforeChange(node);
            activeCanvas?.emitBeforeChange();
            try {
                for (const { name, value, widget } of updates) {
                    const previous = widget.value;
                    widget.value = value;
                    node.onWidgetChanged?.(name, value, previous, widget);
                }
                graph.change();
                node.setDirtyCanvas(true, true);
            } finally {
                graph.afterChange(node);
                activeCanvas?.emitAfterChange();
            }
        }

        function addToAssets(id: string) {
            void collect.run(async (signal) => {
                await collectFormalOutput(id, signal);
                if (!signal.aborted) collected.value = new Set([...collected.value, id]);
            });
        }

        return () => {
            const { asset, key, connected } = data.value;
            const receipts = outputs.value ?? [];
            const result = shown.value;
            const status = !asset
                ? t(connected ? 'siril.upstream' : 'siril.noInput')
                : pending.value || !result
                  ? t('siril.rendering')
                  : result.error
                    ? t('siril.states.' + result.error, result.error)
                    : t(result.formal ? 'siril.formal' : 'siril.candidate');
            const params = JSON.parse(key) as SirilParameters;
            return (
                <>
                    <SirilCommandDetails command={command} disclose />
                    <NodePreview
                        expanded={expanded.value}
                        images={result}
                        status={status}
                        imageClassName="ap-siril-main"
                        badge={result ? t(result.formal ? 'siril.formal' : 'siril.candidate') : undefined}
                        onToggle={() => {
                            expanded.value = !expanded.value;
                        }}
                        onCompare={() => {
                            inspector.value = true;
                        }}
                        onRefresh={asset ? reload : undefined}
                        onReset={reset}
                    />
                    {inspector.value && (
                        <Inspector
                            preview={result}
                            title={node.title || command.title}
                            description={commandDescription(command, locale.value)}
                            onRefresh={asset ? reload : undefined}
                            onReset={reset}
                            parameters={
                                <div class="ap-inspector-fields">
                                    {command.parameters.map(parameter => {
                                        const key = 'siril.commands.' + command.id + '.' + parameter.name;
                                        const label = t(key, parameter.label);
                                        const help = t(key + 'Help', parameter.help);
                                        const disabled = parameter.rgb_only && mono.value;
                                        return typeof parameter.default === 'number' ? (
                                            <NumberParameter key={parameter.name} label={label} help={help}
                                                value={Number(params[parameter.name])}
                                                min={parameter.min ?? undefined} max={parameter.max ?? undefined}
                                                onChange={value => updateParameters({ [parameter.name]: value })} />
                                        ) : (
                                            <label key={parameter.name} class="ap-inspector-toggle">
                                                <span>{label} <InfoTip text={help} /></span>
                                                <input type="checkbox" role="switch"
                                                    checked={Boolean(params[parameter.name]) && !disabled}
                                                    disabled={disabled}
                                                    title={disabled ? t('siril.mono') : help}
                                                    onChange={event => updateParameters({
                                                        [parameter.name]: (event.currentTarget as HTMLInputElement).checked,
                                                    })} />
                                            </label>
                                        );
                                    })}
                                    {receipts.map((id) => (
                                        <button type="button" key={id} class="ap-storage-button"
                                            title={id} disabled={collect.pending.value || collected.value.has(id)}
                                            onClick={() => addToAssets(id)}>
                                            {collected.value.has(id) ? t('siril.addedToAssets') : t('siril.addToAssets')}
                                            {receipts.length > 1 && ' · ' + id.slice(0, 8)}
                                        </button>
                                    ))}
                                    {collect.error.value && (
                                        <small role="alert">{t('siril.states.' + collect.error.value, collect.error.value)}</small>
                                    )}
                                </div>
                            }
                            onClose={() => {
                                inspector.value = false;
                            }}
                        />
                    )}
                </>
            );
        };
    },
    { props: ['node', 'command', 'execution', 'canvas'] },
);

type NumberProps = {
    label: string;
    help: string;
    value: number;
    min?: number;
    max?: number;
    onChange: (value: number) => void;
};
const NumberParameter = defineComponent(
    (props: NumberProps) => {
        const draft = ref<string>();
        return () => (
            <label>
                <span>
                    {props.label} <InfoTip text={props.help} />
                </span>
                <input
                    type="number"
                    value={draft.value ?? props.value}
                    min={props.min}
                    max={props.max}
                    step={0.01}
                    onBlur={() => {
                        draft.value = undefined;
                    }}
                    onInput={(event) => {
                        const input = event.currentTarget as HTMLInputElement;
                        const number = input.valueAsNumber;
                        draft.value = input.value;
                        if (
                            Number.isFinite(number) &&
                            (props.min === undefined || number >= props.min) &&
                            (props.max === undefined || number <= props.max)
                        ) {
                            props.onChange(number);
                        }
                    }}
                />
            </label>
        );
    },
    { props: ['label', 'help', 'value', 'min', 'max', 'onChange'] },
);

function mountPreview(host: ComfyApp, bundles: readonly FrontendBundle[], node: Node, command: SirilCommand) {
    const element = document.createElement('div');
    element.className = 'astrophoto-ui ap-siril-widget ap-siril-preview-widget';
    const content = document.createElement('div');
    content.className = 'ap-siril-preview-content';
    element.append(content);
    let height = 264;
    const widget = node.addDOMWidget('astrophoto_preview', 'astrophoto-scientific-preview', element, {
        serialize: false,
        hideOnZoom: false,
        getMinHeight: () => height,
        getMaxHeight: () => height,
    });
    widget.serialize = false;
    trackDomWidget(widget);
    // Measure the inner content, independent of the height allocated by the host.
    const resize = new ResizeObserver(() => {
        if (!node.graph) return;
        const measured = content.offsetHeight;
        if (!measured || measured === height) return;
        height = measured;
        node.setSize([node.size[0], node.computeSize()[1]]);
        node.setDirtyCanvas(true, true);
    });
    const events = new EventTarget();
    const previous = node.onExecuted;
    const onExecuted: NonNullable<Node['onExecuted']> = function (this: Node, output) {
        previous?.call(this, output);
        const result = output as unknown as {
            astrophoto_asset?: string[];
            astrophoto_output?: string[];
            astrophoto_source?: string[];
            astrophoto_parameters?: SirilParameters[];
        };
        if (result.astrophoto_output?.length) formalOutputs.set(node, result.astrophoto_output);
        const ids = result.astrophoto_output ?? result.astrophoto_asset;
        executionResults.delete(node);
        if (
            ids?.length === 1 && ids[0] &&
            result.astrophoto_source?.[0] &&
            result.astrophoto_parameters?.[0]
        ) {
            executionResults.set(node, {
                asset: ids[0],
                receiptSource: result.astrophoto_source[0],
                observedSource: sourceId(node),
                key: parameterKey(command, result.astrophoto_parameters[0]),
            });
        }
        events.dispatchEvent(new Event('changed'));
    };
    node.onExecuted = onExecuted;
    const dispose = mountWidget(
        host,
        content,
        SirilPreview,
        { node, command, execution: events, canvas: () => host.canvas },
        bundles,
    );
    resize.observe(content, { box: 'border-box' });
    const remove = widget.onRemove;
    widget.onRemove = () => {
        resize.disconnect();
        if (node.onExecuted === onExecuted) node.onExecuted = previous;
        dispose();
        executionResults.delete(node);
        formalOutputs.delete(node);
        remove?.call(widget);
    };
    // Leave room for the configured preview width, content padding, and host widget margins.
    const defaultWidth = canvasPreviewWidth() + 8 + 2 * widget.margin;
    node.setSize([Math.max(node.size[0], defaultWidth), Math.max(node.size[1], 395)]);
}

function mountCommandDetails(host: ComfyApp, bundles: readonly FrontendBundle[], node: Node, command: SirilCommand) {
    const element = document.createElement('div');
    element.className = 'astrophoto-ui ap-siril-widget';
    const content = document.createElement('div');
    element.append(content);
    let height = 52;
    const widget = node.addDOMWidget('astrophoto_command_details', 'astrophoto-siril-details', element, {
        serialize: false,
        hideOnZoom: false,
        getMinHeight: () => height,
        getMaxHeight: () => height,
    });
    widget.serialize = false;
    trackDomWidget(widget);
    const stop = mountWidget(host, content, SirilCommandDetails, { command, disclose: true }, bundles);
    const resize = new ResizeObserver(() => {
        const size = content.offsetHeight;
        if (!node.graph || !size || height === size) return;
        height = size;
        node.setSize([node.size[0], node.computeSize()[1]]);
        node.setDirtyCanvas(true, true);
    });
    resize.observe(content, { box: 'border-box' });
    const remove = widget.onRemove;
    widget.onRemove = () => {
        resize.disconnect();
        stop();
        remove?.call(widget);
    };
    node.setSize([node.size[0], node.computeSize()[1]]);
}

function mountLog(host: ComfyApp, node: Node) {
    const previous = node.onExecuted;
    let widget: ReturnType<Node['addDOMWidget']> | undefined;
    const log = document.createElement('textarea');
    log.readOnly = true;
    log.className = 'astrophoto-ui ap-siril-log';
    node.onExecuted = function (this: Node, output) {
        previous?.call(this, output);
        const result = output as unknown as { astrophoto_siril_log?: string[]; astrophoto_siril_path?: string[] };
        const path = result.astrophoto_siril_path?.[0];
        if (path) cliOutputs.set(node, { path, ...cliState(node) });
        else cliOutputs.delete(node);
        if (!result.astrophoto_siril_log?.[0]) return;
        log.value = result.astrophoto_siril_log[0];
        if (!widget) {
            widget = node.addDOMWidget('astrophoto_siril_log', 'astrophoto-siril-log', log, {
                serialize: false, getMinHeight: () => 120, getMaxHeight: () => 120,
            });
            widget.serialize = false;
            trackDomWidget(widget);
            const stop = watchLocale(host, log, locale => {
                log.setAttribute('aria-label', locale === 'zh' ? 'CLI 日志' : 'CLI log');
            });
            const remove = widget.onRemove;
            widget.onRemove = () => {
                stop();
                remove?.call(widget);
            };
            node.setSize(node.computeSize());
        }
        node.setDirtyCanvas(true, true);
    };
}

export function registerSirilNodes(host: ComfyApp, bundles: readonly FrontendBundle[]) {
    host.registerExtension({
        name: 'AstroPhoto.Siril',
        async nodeCreated(node) {
            if (!node.comfyClass?.startsWith('AstroPhotoSiril')) return;
            // The host already displays and executes the native Schema if the optional UI is unavailable.
            const previous = node.onRemoved;
            let removed = false;
            const onRemoved = function (this: Node) {
                removed = true;
                previous?.call(this);
            };
            node.onRemoved = onRemoved;
            const command = await getCommands().then(rows => rows.find(row => row.node_id === node.comfyClass),
                () => undefined);
            if (node.onRemoved === onRemoved) node.onRemoved = previous;
            if (!command || removed) return;
            descriptors.set(node, command);
            // Saved workflows can carry the old generated caption as a title.
            const legacyTitles = [command.id, command.title, command.title_zh].map(name => 'Siril · ' + name);
            if (legacyTitles.includes(node.title)) {
                node.title = commandTitle(command, normalizeLocale(host.extensionManager.setting.get('Comfy.Locale')));
            }
            if (command.preview) mountPreview(host, bundles, node, command);
            else {
                mountCommandDetails(host, bundles, node, command);
                mountLog(host, node);
            }
        },
    });
}
