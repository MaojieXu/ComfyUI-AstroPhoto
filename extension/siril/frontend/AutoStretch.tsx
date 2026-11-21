import { computed, defineComponent, ref, shallowRef, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import type { ComfyApp } from '../../../frontend/src/host/comfy';
import type { FrontendBundle } from '../../../frontend/src/bundles/types';
import { mountWidget } from '../../../frontend/src/host/mountWidget';
import { trackDomWidget } from '../../../frontend/src/host/domWidgetMounts';
import { ApiError } from '../../../frontend/src/api/client';
import { canvasPreviewWidth, previewResolutionEvents } from '../../../frontend/src/api/previewSettings';
import {
    defaults,
    renderCandidate,
    validatePreview,
    type Parameters as SirilParameters,
    type Preview,
} from './api';
import { InfoTip, Inspector } from '../../../frontend/src/features/nodes/preview/Inspector';
import { NodePreview } from '../../../frontend/src/features/nodes/preview/NodePreview';

const SOURCE = 'AstroPhotoFITSSource';
const IMAGE_PATH = 'AstroPhotoImagePath';
const STRETCH = 'AstroPhotoSirilAutoStretch';
type Extension = Parameters<ComfyApp['registerExtension']>[0];
type Node = Parameters<NonNullable<Extension['nodeCreated']>>[0];
type Formal = { asset: string; key: string; receiptSource: string; observedSource: string; verifiedSource?: string };
const executionResults = new WeakMap<Node, Formal>();
function previewOwner() {
    const values = crypto.getRandomValues(new Uint8Array(16));
    values[6] = (values[6] & 15) | 64;
    values[8] = (values[8] & 63) | 128;
    const hex = Array.from(values, (byte) => byte.toString(16).padStart(2, '0')).join('');
    return [hex.slice(0, 8), hex.slice(8, 12), hex.slice(12, 16), hex.slice(16, 20), hex.slice(20)].join('-');
}

function values(node: Node): SirilParameters {
    const widget = (name: string) => node.widgets?.find((entry) => entry.name === name);
    return {
        shadowsclip: Number(widget('shadowsclip')?.value ?? defaults.shadowsclip),
        targetbg: Number(widget('targetbg')?.value ?? defaults.targetbg),
        linked: widget('linked')?.value !== false,
    };
}

function sourceId(node: Node, visited = new Set<Node>()): string {
    if (visited.has(node)) return '';
    visited.add(node);
    const input = node.getInputNode(0);
    if (input?.comfyClass === SOURCE)
        return String(input.widgets?.find((widget) => widget.name === 'asset_id')?.value || '');
    if (input?.comfyClass === IMAGE_PATH)
        return String(input.widgets?.find((widget) => widget.name === 'image_path')?.value || '');
    if (input?.comfyClass === STRETCH) {
        const result = executionResults.get(input);
        if (
            result?.verifiedSource &&
            result.key === JSON.stringify(values(input)) &&
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

type PreviewProps = { node: Node; execution: EventTarget; canvas: () => ComfyApp['canvas'] };
const AutoStretch = defineComponent(
    (props: PreviewProps) => {
        const { t } = useI18n();
        const { node, execution, canvas } = props;
        const owner = previewOwner();
        const expanded = ref(true);
        const inspector = ref(false);
        const refresh = ref(0);
        const data = shallowRef({
            asset: '',
            key: JSON.stringify(values(node)),
            formal: '',
            connected: false,
        });
        const preview = shallowRef<Preview>();
        const frameInfo = shallowRef<{ asset: string; channels?: number }>();
        const previewKey = ref('');
        const pending = ref(false);
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
                    const key = JSON.stringify(values(node));
                    const result = executionResults.get(node);
                    const formal = asset && result?.key === key && (result.receiptSource === asset || result.observedSource === asset)
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
                                if (result.formal) receipt.verifiedSource = asset;
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
                const linked = node.widgets?.find((widget) => widget.name === 'linked');
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

        return () => {
            const { asset, key, connected } = data.value;
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
                        onReset={() => updateParameters(defaults)}
                    />
                    {inspector.value && (
                        <Inspector
                            preview={result}
                            title={node.title || 'Siril · AutoStretch'}
                            description={t('siril.nodeHelp')}
                            onRefresh={asset ? reload : undefined}
                            onReset={() => updateParameters(defaults)}
                            parameters={
                                <div class="ap-inspector-fields">
                                    <NumberParameter
                                        label={t('siril.shadows') + ' (σ)'}
                                        help={t('siril.shadowsHelp')}
                                        value={params.shadowsclip}
                                        onChange={(shadowsclip) => updateParameters({ shadowsclip })}
                                    />
                                    <NumberParameter
                                        label={t('siril.target')}
                                        help={t('siril.targetHelp')}
                                        value={params.targetbg}
                                        min={0}
                                        max={1}
                                        onChange={(targetbg) => updateParameters({ targetbg })}
                                    />
                                    <label class="ap-inspector-toggle">
                                        <span>
                                            {t('siril.linked')} <InfoTip text={t('siril.linkedHelp')} />
                                        </span>
                                        <input
                                            type="checkbox"
                                            role="switch"
                                            checked={params.linked && !mono.value}
                                            disabled={mono.value}
                                            title={t(mono.value ? 'siril.mono' : 'siril.rgbRisk')}
                                            onChange={(event) =>
                                                updateParameters({
                                                    linked: (event.currentTarget as HTMLInputElement).checked,
                                                })
                                            }
                                        />
                                    </label>
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
    { props: ['node', 'execution', 'canvas'] },
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

export function registerAutoStretch(host: ComfyApp, bundles: readonly FrontendBundle[]) {
    host.registerExtension({
        name: 'AstroPhoto.Siril',
        nodeCreated(node) {
            if (node.comfyClass !== STRETCH) return;
            const element = document.createElement('div');
            element.className = 'astrophoto-ui ap-siril-widget ap-siril-preview-widget';
            const content = document.createElement('div');
            content.className = 'ap-siril-preview-content';
            element.append(content);
            let height = 264;
            const widget = node.addDOMWidget('astrophoto_preview', 'astrophoto-scientific-preview', element, {
                serialize: false,
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
                    astrophoto_source?: string[];
                    astrophoto_parameters?: SirilParameters[];
                };
                if (
                    result.astrophoto_asset?.[0] &&
                    result.astrophoto_source?.[0] &&
                    result.astrophoto_parameters?.[0]
                ) {
                    executionResults.set(node, {
                        asset: result.astrophoto_asset[0],
                        receiptSource: result.astrophoto_source[0],
                        observedSource: sourceId(node),
                        key: JSON.stringify(result.astrophoto_parameters[0]),
                    });
                    events.dispatchEvent(new Event('changed'));
                }
            };
            node.onExecuted = onExecuted;
            const dispose = mountWidget(
                host,
                content,
                AutoStretch,
                { node, execution: events, canvas: () => host.canvas },
                bundles,
            );
            resize.observe(content, { box: 'border-box' });
            const remove = widget.onRemove;
            widget.onRemove = () => {
                resize.disconnect();
                if (node.onExecuted === onExecuted) node.onExecuted = previous;
                dispose();
                executionResults.delete(node);
                remove?.call(widget);
            };
            // Leave room for the configured preview width, content padding, and host widget margins.
            const defaultWidth = canvasPreviewWidth() + 8 + 2 * widget.margin;
            node.setSize([Math.max(node.size[0], defaultWidth), Math.max(node.size[1], 395)]);
        },
    });
}
