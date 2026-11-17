import { useTranslation } from 'react-i18next';
import { ApiError } from '../api/client';
export function Feedback({ error, retry }: { error: unknown; retry?: () => void }) {
  const { t } = useTranslation();
  const code = error instanceof ApiError ? error.code : 'canvas';
  return <div role="alert"><p>{t(`errors.${code}`, { defaultValue: t('errors.unknown'), status: error instanceof ApiError ? error.status : '' })}</p>
    {retry && <button onClick={retry}>{t('actions.retry')}</button>}</div>;
}
