import {
    defineComponent,
    onMounted,
    onUnmounted,
    ref,
    Teleport,
    useId,
    type CSSProperties,
    type VNodeChild,
} from 'vue';
import { useI18n } from 'vue-i18n';
import { PanelDivider } from './PanelDivider';
import './inspector.css';

export type ComparisonImages = {
    before?: string;
    after?: string;
    aligned?: boolean;
    width?: number;
    height?: number;
};

type Mode = 'side' | 'wipe' | 'single';
const modes: Mode[] = ['side', 'wipe', 'single'];
const paths: Record<Mode, string> = {
    side: 'M3 5h18v14H3z M12 5v14',
    wipe: 'M3 5h18v14H3z M12 2v20 M8 12h8',
    single: 'M3 5h18v14H3z M7 9h10v6H7z',
};
const clamp = (number: number, min: number, max: number) => Math.max(min, Math.min(max, number));

type Props = {
    preview?: ComparisonImages;
    title: string;
    description?: string;
    details?: { label: string; value: string }[];
    parameters?: VNodeChild;
    status?: string;
    onRefresh?: () => void;
    onReset?: () => void;
    onClose: () => void;
};

export const Inspector = defineComponent(
    (props: Props) => {
        const { t } = useI18n();
        const dialog = ref<HTMLDialogElement | null>(null);
        const close = ref<HTMLButtonElement | null>(null);
        const panelId = useId();
        const viewShare = ref(73);
        const setViewShare = (next: typeof viewShare.value) => {
            viewShare.value = next;
        };
        const analysisShare = ref(50);
        const setAnalysisShare = (next: typeof analysisShare.value) => {
            analysisShare.value = next;
        };
        const mode = ref<Mode>('side');
        const setMode = (next: typeof mode.value) => {
            mode.value = next;
        };
        const single = ref<'before' | 'after'>('after');
        const setSingle = (next: typeof single.value) => {
            single.value = next;
        };
        const divider = ref(50);
        const setDivider = (next: typeof divider.value) => {
            divider.value = next;
        };
        const zoom = ref(1);
        const setZoom = (next: typeof zoom.value) => {
            zoom.value = next;
        };
        const native = ref(false);
        const setNative = (next: typeof native.value) => {
            native.value = next;
        };
        const pan = ref({ x: 0, y: 0 });
        const setPan = (next: typeof pan.value) => {
            pan.value = next;
        };
        let drag: { id: number; x: number; y: number; ox: number; oy: number } | undefined;
        let previous: HTMLElement | null;
        onMounted(() => {
            previous = document.activeElement as HTMLElement | null;
            const element = dialog.value;
            if (element && !element.open) {
                element.show();
            }
            close.value?.focus();
        });
        onUnmounted(() => {
            if (previous?.isConnected) previous.focus();
        });
        return () => {
            const { preview, title, description, details, parameters, status, onRefresh, onReset, onClose } =
                props;
            const canWipe = Boolean(preview?.before && preview.after && preview.aligned);
            const activeMode = mode.value === 'wipe' && !canWipe ? 'side' : mode.value;

            function pointerDown(event: PointerEvent) {
                if (event.button !== 0 || !event.isPrimary) return;
                event.preventDefault();
                (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
                drag = {
                    id: event.pointerId,
                    x: event.clientX,
                    y: event.clientY,
                    ox: pan.value.x,
                    oy: pan.value.y,
                };
            }

            function pointerMove(event: PointerEvent) {
                const start = drag;
                if (start?.id === event.pointerId)
                    setPan({ x: start.ox + event.clientX - start.x, y: start.oy + event.clientY - start.y });
            }

            function moveDivider(event: PointerEvent) {
                const bounds = (event.currentTarget as HTMLElement).parentElement?.getBoundingClientRect();
                if (bounds?.width)
                    setDivider(clamp(((event.clientX - bounds.left) * 100) / bounds.width, 0, 100));
            }

            const fit = () => {
                setNative(false);
                setPan({ x: 0, y: 0 });
                setZoom(1);
            };
            const pixels = () => {
                fit();
                setNative(true);
            };
            const scale = (factor: number) => setZoom(clamp(zoom.value * factor, 0.1, 16));
            function layer(side: 'before' | 'after', clip?: string) {
                const url = preview?.[side];
                const transform = {
                    '--ap-img-zoom': zoom.value,
                    '--ap-img-x': pan.value.x + 'px',
                    '--ap-img-y': pan.value.y + 'px',
                    '--ap-native-width': preview?.width + 'px',
                    '--ap-native-height': preview?.height + 'px',
                    clipPath: clip,
                } as CSSProperties;
                return (
                    <div class="ap-inspector-layer" style={transform} data-native={native.value}>
                        {url ? (
                            <img src={url} alt={t('nodePreview.' + side)} draggable={false} />
                        ) : (
                            <span>{t('nodePreview.noImage')}</span>
                        )}
                    </div>
                );
            }
            function panel(side: 'before' | 'after') {
                return (
                    <div
                        class="ap-inspector-pane"
                        key={side}
                        onPointerdown={pointerDown}
                        onPointermove={pointerMove}
                        {...{
                            onLostpointercapture: () => {
                                drag = undefined;
                            },
                        }}
                    >
                        {layer(side)}
                        <span class="ap-inspector-label">{t('nodePreview.' + side)}</span>
                    </div>
                );
            }
            return (
                <Teleport to="body">
                    <dialog
                        ref={dialog}
                        class="astrophoto-ui ap-inspector"
                        aria-label={t('nodePreview.compare')}
                        {...{ onCancel: onClose }}
                        onKeydown={(event) => {
                            event.stopPropagation();
                            if (event.key === 'Escape') {
                                event.preventDefault();
                                onClose();
                            }
                        }}
                    >
                        <header>
                            <div class="ap-inspector-title">
                                <strong>{title}</strong>
                                {description && <InfoTip text={description} />}
                            </div>
                            <button
                                ref={close}
                                type="button"
                                title={t('nodePreview.close')}
                                aria-label={t('nodePreview.close')}
                                onClick={onClose}
                            >
                                <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    aria-hidden="true"
                                >
                                    <path d="m6 6 12 12M18 6 6 18" />
                                </svg>
                            </button>
                        </header>
                        <div
                            class="ap-inspector-layout"
                            style={{ '--ap-view-share': viewShare.value + '%' } as CSSProperties}
                        >
                            <section id={panelId + '-view'} class="ap-inspector-view">
                                <div class="ap-inspector-toolbar">
                                    <div class="ap-inspector-modes">
                                        {modes.map((item) => (
                                            <button
                                                key={item}
                                                type="button"
                                                title={t('nodePreview.' + item)}
                                                aria-label={t('nodePreview.' + item)}
                                                aria-pressed={activeMode === item}
                                                disabled={item === 'wipe' && !canWipe}
                                                onClick={() => setMode(item)}
                                            >
                                                <svg
                                                    width="16"
                                                    height="16"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    aria-hidden="true"
                                                >
                                                    <path d={paths[item]} />
                                                </svg>
                                            </button>
                                        ))}
                                    </div>
                                    <div class="ap-inspector-zoom">
                                        {onRefresh && (
                                            <button
                                                type="button"
                                                aria-label={t('actions.refresh')}
                                                title={t('actions.refresh')}
                                                onClick={onRefresh}
                                            >
                                                <span aria-hidden="true">↻</span>
                                            </button>
                                        )}
                                        {activeMode === 'single' && (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setSingle(single.value === 'before' ? 'after' : 'before')
                                                }
                                            >
                                                {t(
                                                    single.value === 'before'
                                                        ? 'nodePreview.after'
                                                        : 'nodePreview.before',
                                                )}
                                            </button>
                                        )}
                                        <button
                                            type="button"
                                            title={t('nodePreview.zoomOut')}
                                            aria-label={t('nodePreview.zoomOut')}
                                            onClick={() => scale(0.8)}
                                        >
                                            −
                                        </button>
                                        <button type="button" onClick={pixels} aria-pressed={native.value}>
                                            {native.value ? Math.round(zoom.value * 100) + '%' : '100%'}
                                        </button>
                                        <button
                                            type="button"
                                            title={t('nodePreview.zoomIn')}
                                            aria-label={t('nodePreview.zoomIn')}
                                            onClick={() => scale(1.25)}
                                        >
                                            +
                                        </button>
                                        <button type="button" onClick={fit}>
                                            {t('nodePreview.fit')}
                                        </button>
                                    </div>
                                </div>
                                <div
                                    class="ap-inspector-images"
                                    data-mode={activeMode}
                                    onDragstart={(event) => event.preventDefault()}
                                    onWheel={(event) => {
                                        event.stopPropagation();
                                        scale(event.deltaY < 0 ? 1.12 : 1 / 1.12);
                                    }}
                                >
                                    {activeMode === 'side' && (
                                        <>
                                            {panel('before')}
                                            {panel('after')}
                                        </>
                                    )}
                                    {activeMode === 'single' && panel(single.value)}
                                    {activeMode === 'wipe' && (
                                        <div
                                            class="ap-inspector-pane"
                                            onPointerdown={pointerDown}
                                            onPointermove={pointerMove}
                                            {...{
                                                onLostpointercapture: () => {
                                                    drag = undefined;
                                                },
                                            }}
                                        >
                                            {layer('after')}
                                            {layer('before', `inset(0 ${100 - divider.value}% 0 0)`)}
                                            <span class="ap-inspector-label">{t('nodePreview.before')}</span>
                                            <span class="ap-inspector-label ap-inspector-end">
                                                {t('nodePreview.after')}
                                            </span>
                                            {/* Pointer capture and keyboard behavior adapted from ComfyUI_frontend
                v1.59.1 src/components/common/VideoCompareSlider.vue (GPL-3.0). */}
                                            <div
                                                class="ap-inspector-divider"
                                                style={{ left: divider.value + '%' }}
                                                tabindex={0}
                                                role="slider"
                                                aria-label={t('nodePreview.wipe')}
                                                aria-valuemin={0}
                                                aria-valuemax={100}
                                                aria-valuenow={Math.round(divider.value)}
                                                onPointerdown={(event) => {
                                                    event.stopPropagation();
                                                    if (event.button !== 0 || !event.isPrimary) return;
                                                    event.preventDefault();
                                                    (event.currentTarget as HTMLElement).focus();
                                                    (event.currentTarget as HTMLElement).setPointerCapture(
                                                        event.pointerId,
                                                    );
                                                    moveDivider(event);
                                                }}
                                                onPointermove={(event) => {
                                                    event.stopPropagation();
                                                    if (
                                                        (
                                                            event.currentTarget as HTMLElement
                                                        ).hasPointerCapture(event.pointerId)
                                                    )
                                                        moveDivider(event);
                                                }}
                                                onPointerup={(event) => {
                                                    if (
                                                        (
                                                            event.currentTarget as HTMLElement
                                                        ).hasPointerCapture(event.pointerId)
                                                    )
                                                        (
                                                            event.currentTarget as HTMLElement
                                                        ).releasePointerCapture(event.pointerId);
                                                }}
                                                onKeydown={(event) => {
                                                    const values: Record<string, number> = {
                                                        ArrowLeft: divider.value - 2,
                                                        ArrowRight: divider.value + 2,
                                                        Home: 0,
                                                        End: 100,
                                                    };
                                                    if (!(event.key in values)) return;
                                                    event.preventDefault();
                                                    event.stopPropagation();
                                                    setDivider(clamp(values[event.key], 0, 100));
                                                }}
                                            />
                                        </div>
                                    )}
                                </div>
                                {!canWipe && preview?.before && preview.after && (
                                    <small>{t('nodePreview.unaligned')}</small>
                                )}
                            </section>
                            <PanelDivider
                                axis="x"
                                label={t('nodePreview.adjustWidth')}
                                controls={panelId + '-view'}
                                value={viewShare.value}
                                min={40}
                                max={80}
                                onChange={setViewShare}
                            />
                            <aside
                                class="ap-inspector-info"
                                style={{ '--ap-analysis-share': analysisShare.value + '%' } as CSSProperties}
                            >
                                <section id={panelId + '-analysis'}>
                                    <h3>{t('nodePreview.analysis')}</h3>
                                    <p>{t('nodePreview.analysisEmpty')}</p>
                                </section>
                                <PanelDivider
                                    axis="y"
                                    label={t('nodePreview.adjustHeight')}
                                    controls={panelId + '-analysis'}
                                    value={analysisShare.value}
                                    min={15}
                                    max={75}
                                    onChange={setAnalysisShare}
                                />
                                <section>
                                    <div class="ap-inspector-parameters-header">
                                        <h3>
                                            {t(
                                                parameters
                                                    ? 'nodePreview.parameters'
                                                    : 'nodePreview.readonly',
                                            )}
                                        </h3>
                                        {onReset && (
                                            <button
                                                type="button"
                                                title={t('nodePreview.reset')}
                                                aria-label={t('nodePreview.reset')}
                                                onClick={onReset}
                                            >
                                                <span aria-hidden="true">↶</span>
                                            </button>
                                        )}
                                    </div>
                                    {parameters}
                                    {(Boolean(details?.length) || status) && (
                                        <dl>
                                            {details?.map(({ label, value }) => (
                                                <div class="ap-inspector-value" key={label}>
                                                    <dt>{label}</dt>
                                                    <dd>{value}</dd>
                                                </div>
                                            ))}
                                            {status && (
                                                <>
                                                    <dt>{t('nodePreview.status')}</dt>
                                                    <dd role="status">{status}</dd>
                                                </>
                                            )}
                                        </dl>
                                    )}
                                </section>
                            </aside>
                        </div>
                    </dialog>
                </Teleport>
            );
        };
    },
    {
        props: [
            'preview',
            'title',
            'description',
            'details',
            'parameters',
            'status',
            'onRefresh',
            'onReset',
            'onClose',
        ],
    },
);

export function InfoTip({ text }: { text: string }) {
    return (
        <span class="ap-inspector-help" role="img" tabindex={0} aria-label={text} title={text}>
            <span aria-hidden="true">ⓘ</span>
        </span>
    );
}
