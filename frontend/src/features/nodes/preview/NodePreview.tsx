import { defineComponent, useId } from 'vue';
import { useI18n } from 'vue-i18n';
import type { ComparisonImages } from './Inspector';
import './nodePreview.css';

type Props = {
    expanded: boolean;
    images?: ComparisonImages;
    status: string;
    badge?: string;
    imageClassName?: string;
    onToggle: () => void;
    onCompare: () => void;
    onRefresh?: () => void;
    onReset?: () => void;
};

export const NodePreview = defineComponent(
    (props: Props) => {
        const { t } = useI18n();
        const panelId = useId();
        return () => {
            const {
                expanded,
                images,
                status,
                badge,
                imageClassName = '',
                onToggle,
                onCompare,
                onRefresh,
                onReset,
            } = props;
            const refresh = t('actions.refresh');
            const reset = t('nodePreview.reset');

            return (
                <>
                    <div class="ap-node-preview-toolbar">
                        <button
                            type="button"
                            aria-controls={panelId}
                            aria-expanded={expanded}
                            onClick={onToggle}
                        >
                            <svg viewBox="0 0 24 24" aria-hidden="true">
                                <path d="m9 6 6 6-6 6" />
                            </svg>
                            {t('nodePreview.preview')}
                        </button>
                        <button
                            class="ap-node-compare"
                            type="button"
                            aria-haspopup="dialog"
                            aria-label={t('nodePreview.openImage')}
                            title={t('nodePreview.openImage')}
                            onClick={onCompare}
                        >
                            <svg viewBox="0 0 24 24" aria-hidden="true">
                                <path d="M3 4h18v16H3z M3 16l5-5 4 4 3-3 6 5" />
                            </svg>
                        </button>
                        {onRefresh && (
                            <button type="button" title={refresh} aria-label={refresh} onClick={onRefresh}>
                                <svg viewBox="0 0 24 24" aria-hidden="true">
                                    <path d="M20 7v5h-5M4 17v-5h5M5.5 8a7 7 0 0 1 11-2l3.5 6m-16 0 3.5 6a7 7 0 0 0 11-2" />
                                </svg>
                            </button>
                        )}
                        {onReset && (
                            <button type="button" title={reset} aria-label={reset} onClick={onReset}>
                                <svg viewBox="0 0 24 24" aria-hidden="true">
                                    <path d="M3 11h5M3 11V6m0 5 4-4a7 7 0 1 1-1 10" />
                                </svg>
                            </button>
                        )}
                    </div>
                    <div id={panelId} class={`ap-canvas-preview ${imageClassName}`} hidden={!expanded}>
                        {expanded &&
                            (images?.after ? (
                                <>
                                    <img
                                        src={images.after}
                                        width={images.width}
                                        height={images.height}
                                        alt={t('nodePreview.after')}
                                        draggable={false}
                                    />
                                    {badge && <small class="ap-node-preview-badge">{badge}</small>}
                                </>
                            ) : (
                                <span role="status">{status}</span>
                            ))}
                    </div>
                </>
            );
        };
    },
    {
        props: [
            'expanded',
            'images',
            'status',
            'badge',
            'imageClassName',
            'onToggle',
            'onCompare',
            'onRefresh',
            'onReset',
        ],
    },
);
