import { defineComponent, h, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { BackButton } from '../../shared/BackButton';
import type { FrontendBundle } from '../../bundles/types';
import './software.css';

type Props = { bundles: readonly FrontendBundle[] };

export const SoftwarePage = defineComponent(
    (props: Props) => {
        const { t } = useI18n();
        const selected = ref<string>();
        return () => {
            const bundle = props.bundles.find((entry) => entry.id === selected.value);
            if (selected.value)
                return (
                    <div class="ap-software">
                        <BackButton
                            onBack={() => {
                                selected.value = undefined;
                            }}
                        />
                        {bundle ? (
                            h(bundle.settings)
                        ) : (
                            <section class="ap-software-section">
                                <h3>PixInsight</h3>
                                <p>{t('software.plannedDetails')}</p>
                            </section>
                        )}
                    </div>
                );

            return (
                <div class="ap-software-list">
                    {props.bundles.map((entry) =>
                        h(entry.summary, {
                            key: entry.id,
                            onOpen: () => {
                                selected.value = entry.id;
                            },
                        }),
                    )}
                    <div class="ap-software-item">
                        <button
                            type="button"
                            class="ap-software-open"
                            onClick={() => {
                                selected.value = 'pixinsight';
                            }}
                        >
                            <span class="ap-software-item-icon" aria-hidden="true">
                                ▣
                            </span>
                            <span class="ap-software-item-copy">
                                <strong>PixInsight</strong>
                                <small>{t('software.pixinsightPurpose')}</small>
                                <small class="ap-software-status">
                                    <span class="ap-software-dot" data-state="planned" />
                                    {t('states.planned')}
                                </small>
                            </span>
                        </button>
                        <label class="ap-software-switch">
                            <span class="ap-software-switch-label">{t('software.enabled')}</span>
                            <input
                                type="checkbox"
                                role="switch"
                                aria-label={t('software.enableNamed', { name: 'PixInsight' })}
                                disabled
                            />
                            <span class="ap-software-switch-track" aria-hidden="true">
                                <span />
                            </span>
                        </label>
                    </div>
                </div>
            );
        };
    },
    { props: ['bundles'] },
);
