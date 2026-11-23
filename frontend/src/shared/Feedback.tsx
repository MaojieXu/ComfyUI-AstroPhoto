import { defineComponent, watch } from 'vue';
import { notifyHost } from '../host/notify';
import { useI18n } from 'vue-i18n';
import { ApiError } from '../api/client';

type Props = { error: unknown; retry?: () => void };

export const Feedback = defineComponent(
    (props: Props) => {
        const { t } = useI18n();
        watch(() => props.error, error => {
            if (!error) return;
            const code = error instanceof ApiError ? error.code : 'canvas';
            notifyHost('error', t(`errors.${code}`, { status: error instanceof ApiError ? error.status : '' }, t('errors.unknown')));
        }, { immediate: true });
        return () => {
            const { error, retry } = props;
            const code = error instanceof ApiError ? error.code : 'canvas';
            return (
                <div role="alert">
                    <p>
                        {t(
                            `errors.${code}`,
                            { status: error instanceof ApiError ? error.status : '' },
                            t('errors.unknown'),
                        )}
                    </p>
                    {retry && <button onClick={retry}>{t('actions.retry')}</button>}
                </div>
            );
        };
    },
    { props: ['error', 'retry'] },
);
