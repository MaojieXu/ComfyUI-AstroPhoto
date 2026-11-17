import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SearchField } from '../../shared/SearchField';
import { SearchOptions } from '../../shared/SearchOptions';
import { useStoredChoice } from '../../shared/useStoredChoice';
import type { AstroStatus } from '../../api/status';
import type { Resource } from '../../shared/useResource';
import { Feedback } from '../../shared/Feedback';

const frameTypes = ['all', 'light', 'dark', 'flat', 'bias', 'darkFlat'] as const;
const sortOrders = ['newest', 'oldest', 'name'] as const;

export function AssetsPage({ status, refresh }: { status: Resource<AstroStatus>; refresh: () => void }) {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const [frame, setFrame] = useState<typeof frameTypes[number]>('all');
  const [order, setOrder] = useStoredChoice('AstroPhoto.Assets.Sort', sortOrders);
  return <>
    <div className="ap-search-toolbar">
      <SearchField label={t('assets.search')} clearLabel={t('browse.clear')} onSearch={setQuery} />
      <SearchOptions icon="filter" label={t('assets.frameType')} options={frameTypes.map(value => ({
        id: value, label: t(`assets.${value}`), checked: frame === value, select: () => setFrame(value)
      }))} />
      <SearchOptions icon="sort" label={t('browse.sort')} options={sortOrders.map(value => ({
        id: value, label: t(`browse.${value}`), checked: order === value, select: () => setOrder(value)
      }))} />
    </div>
    <div className="ap-scroll">
      <button disabled aria-describedby="ap-asset-reason">{t('assets.import')}</button>
      {status.state === 'loading' && <p role="status">{t('states.loading')}</p>}
      {status.state === 'error' && <Feedback error={status.error} retry={refresh} />}
      <h2>{t('assets.sessions')}</h2><p>{t('assets.noSessions')}</p>
      <h2>{t('assets.library')}</h2>
      <p id="ap-asset-reason">{t('assets.unavailable')}</p>
      {status.state === 'ready' && <p>{t(status.data.capabilities.assets?.available ? 'assets.adapterMissing' : 'assets.serviceMissing')}</p>}
      {query && <p>{t('assets.searchPending', { query })}</p>}
    </div>
  </>;
}
