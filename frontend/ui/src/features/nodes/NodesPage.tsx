import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { NodeCard } from '../../api/nodes';
import type { Resource } from '../../shared/useResource';
import { SearchField } from '../../shared/SearchField';
import { SearchOptions } from '../../shared/SearchOptions';
import { useStoredChoice } from '../../shared/useStoredChoice';
import { Feedback } from '../../shared/Feedback';
import { createCanvasNode } from '../../host/canvas';
import { attachCanvasDrop } from '../../host/dragDrop';
import { buildNodeTree, NodeTree } from './NodeTree';
import { app } from '../../host/comfy';

const sortOrders = ['original', 'alphabetical'] as const;
// ComfyUI frontend v1.59.1, stores/nodeBookmarkStore.ts.
const bookmarkSetting = 'Comfy.NodeLibrary.Bookmarks.V2';
function readBookmarks(): string[] {
  const value = app.extensionManager.setting.get<unknown>(bookmarkSetting);
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : [];
}

export function NodesPage({ active, resource, refresh }: { active: boolean; resource: Resource<NodeCard[]>; refresh: () => void }) {
  const { t, i18n } = useTranslation();
  const [query, setQuery] = useState('');
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set());
  const [collapsedMatches, setCollapsedMatches] = useState<Set<string>>(() => new Set());
  const handleSearch = useCallback((value: string) => {
    setQuery(value);
    setCollapsedMatches(new Set());
  }, []);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [order, setOrder] = useStoredChoice('AstroPhoto.Nodes.Sort', sortOrders);
  const [selected, setSelected] = useState<string | null>(null);
  const [bookmarks, setBookmarks] = useState<string[]>(readBookmarks);
  useEffect(() => {
    if (!active) return;
    const sync = () => setBookmarks(current => {
      const next = readBookmarks();
      return current.length === next.length && current.every((item, index) => item === next[index]) ? current : next;
    });
    sync();
    const timer = window.setInterval(sync, 500);
    return () => window.clearInterval(timer);
  }, [active]);
  const [feedback, setFeedback] = useState<{ error: unknown | null } | null>(null);
  const allowed = useMemo(() => new Set(resource.state === 'ready' ? resource.data.map(n => n.id) : []), [resource]);
  useEffect(() => attachCanvasDrop(allowed, error => setFeedback({ error })), [allowed]);
  const nodes = resource.state === 'ready' ? resource.data.filter(node => node.category.split('/')[0] !== 'examples') : [];
  const categories = [...new Set(nodes.map(node => node.category))];
  const enabledCategories = categories.filter(category => selectedCategories.includes(category));
  const categorySegment = (segment: string) => segment === 'Assets' ? t('nav.assets') : segment;
  const categoryLabel = (category: string) => category.split('/').filter((segment, index) => segment && (index !== 0 || segment !== 'AstroPhoto'))
    .map(categorySegment).join(' / ') || t('nodes.uncategorized');
  const search = query.trim().toLocaleLowerCase();
  const filtered = nodes.filter(node => (
    (enabledCategories.length === 0 || enabledCategories.includes(node.category)) &&
    [node.id, node.title, node.category, categoryLabel(node.category), ...node.aliases, node.description].join(' ').toLocaleLowerCase().includes(search)
  ));
  const entries = buildNodeTree(filtered, order === 'alphabetical'
    ? (a, b) => a.localeCompare(b, i18n.resolvedLanguage)
    : undefined, categorySegment);
  const isBookmarked = (node: NodeCard) => bookmarks.includes(node.id) || bookmarks.includes(`${node.category}/${node.id}`);
  const toggleBookmark = (node: NodeCard) => {
    const current = readBookmarks();
    const nodePath = `${node.category}/${node.id}`;
    const next = current.includes(node.id) || current.includes(nodePath)
      ? current.filter(item => item !== node.id && item !== nodePath)
      : [...current, node.id];
    try {
      const result = app.extensionManager.setting.set(bookmarkSetting, next);
      setBookmarks(next);
      void Promise.resolve(result).catch(error => { setBookmarks(readBookmarks()); setFeedback({ error }); });
    } catch (error) { setFeedback({ error }); }
  };
  const favoriteNodes = bookmarks.flatMap(path => {
    if (path.endsWith('/')) return [];
    const parts = path.split('/');
    const node = filtered.find(item => item.id === parts[parts.length - 1]);
    return node ? [{ ...node, category: parts.slice(0, -1).join('/') }] : [];
  });
  const updateExpansion = (path: string, open: boolean) => {
    const update = search ? setCollapsedMatches : setExpanded;
    update(current => {
      const next = new Set(current);
      if (search ? !open : open) next.add(path);
      else next.delete(path);
      return next;
    });
  };
  const detail = nodes.find(n => n.id === selected);
  const add = (id: string) => {
    try { createCanvasNode(id); setFeedback({ error: null }); }
    catch (error) { setFeedback({ error }); }
  };
  return <>
    <div className="ap-search-toolbar">
      <SearchField label={t('nodes.search')} clearLabel={t('browse.clear')} onSearch={handleSearch} />
      <SearchOptions icon="filter" label={t('browse.filter')} multiple disabled={categories.length === 0} options={[
        { id: 'all', label: t('browse.allCategories'), checked: enabledCategories.length === 0, select: () => setSelectedCategories([]) },
        ...categories.map(category => ({
          id: `category:${category}`,
          label: categoryLabel(category),
          checked: enabledCategories.includes(category),
          select: () => setSelectedCategories(enabledCategories.includes(category)
            ? enabledCategories.filter(value => value !== category) : [...enabledCategories, category])
        }))
      ]} />
      <SearchOptions icon="sort" label={t('browse.sort')} options={sortOrders.map(value => ({
        id: value, label: t(`browse.${value}`), checked: order === value, select: () => setOrder(value)
      }))} />
    </div>
    {resource.state === 'loading' && <p role="status">{t('states.loading')}</p>}
    {resource.state === 'error' && <Feedback error={resource.error} retry={refresh} />}
    {resource.state === 'ready' && <>
      <div hidden={!!detail} className="ap-scroll">
        <h3 className="ap-bookmarks-heading">{t('nodes.bookmarks')}</h3>
        {favoriteNodes.length === 0 ? <div className="ap-bookmarks-empty">{t('nodes.noBookmarks')}</div> :
          <NodeTree entries={buildNodeTree(favoriteNodes)}
            isExpanded={path => search ? !collapsedMatches.has(path) : expanded.has(path)} setExpanded={updateExpansion} selectNode={setSelected}
            previewEnabled={active && !detail}
            isBookmarked={isBookmarked} toggleBookmark={toggleBookmark} bookmarkLabel={bookmarked => t(bookmarked ? 'nodes.removeBookmark' : 'nodes.addBookmark')} />}
        {nodes.length === 0 ? <p>{t('nodes.empty')}</p> : filtered.length === 0 ? <p>{t('nodes.noResults')}</p> :
          <NodeTree entries={entries} isExpanded={path => search ? !collapsedMatches.has(path) : expanded.has(path)}
            setExpanded={updateExpansion} selectNode={setSelected} previewEnabled={active && !detail}
            isBookmarked={isBookmarked} toggleBookmark={toggleBookmark} bookmarkLabel={bookmarked => t(bookmarked ? 'nodes.removeBookmark' : 'nodes.addBookmark')} />}
      </div>
      {detail && <div className="ap-scroll"><button onClick={() => setSelected(null)}>{t('actions.back')}</button>
        <h2>{detail.title}</h2><code>{detail.id}</code><p>{detail.description || t('nodes.noDescription')}</p>
        <p>{t('nodes.registered')}</p><h3>{t('nodes.inputs')}</h3>
        <dl>{detail.inputs.map(([name, type]) => <div key={name}><dt>{name}</dt><dd>{type}</dd></div>)}</dl>
        <h3>{t('nodes.outputs')}</h3><dl>{detail.outputs.map(([name, type]) => <div key={name}><dt>{name}</dt><dd>{type}</dd></div>)}</dl>
        <p>{t('nodes.dependencies')}</p><p>{t('nodes.helpUnavailable')}</p>
        <button onClick={() => add(detail.id)}>{t('nodes.add')}</button></div>}
    </>}
    {feedback && (feedback.error ? <Feedback error={feedback.error} /> : <p role="status">{t('nodes.created')}</p>)}
  </>;
}
