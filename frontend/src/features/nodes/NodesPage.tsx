import { computed, defineComponent, nextTick, onScopeDispose, ref, shallowRef, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import type { NodeCard } from '../../api/nodes';
import { ApiError } from '../../api/client';
import type { Resource } from '../../shared/useResource';
import { SearchField } from '../../shared/SearchField';
import { SearchOptions } from '../../shared/SearchOptions';
import { useStoredChoice } from '../../shared/useStoredChoice';
import { Feedback } from '../../shared/Feedback';
import { createCanvasNode } from '../../host/canvas';
import { notifyHost } from '../../host/notify';
import { attachCanvasDrop } from '../../host/dragDrop';
import { buildNodeTree, NodeTree } from './NodeTree';
import { readNodeBookmarks, setNodeBookmark } from '../../host/nodeBookmarks';

import { localizeNodeCard, nodeCategoryLabel } from '../../i18n/nodeDefinitions';

const sortOrders = ['original', 'alphabetical'] as const;

type Props = { active: boolean; resource: Resource<NodeCard[]>; refresh: () => void; homeActivation?: number };

export const NodesPage = defineComponent(
    (props: Props) => {
        const { t, locale } = useI18n();
        const query = ref('');
        const expanded = shallowRef(new Set<string>());
        const collapsedMatches = shallowRef(new Set<string>());
        const selectedCategories = shallowRef<string[]>([]);
        const [order, setOrder] = useStoredChoice('AstroPhoto.Nodes.Sort', sortOrders);
        const selected = ref<string | null>(null);
        const bookmarks = shallowRef(readNodeBookmarks());
        const bookmarkPending = ref(false);
        const bookmarkError = ref<'bookmark' | 'bookmarkUnsupported'>();
        const feedback = shallowRef<{ error: unknown | null } | null>(null);
        const nodes = computed(() => props.resource.state === 'ready' ? props.resource.data.map(node => localizeNodeCard(node, locale.value)) : []);
        const byId = computed(() => new Map(nodes.value.map(node => [node.id, node])));
        let disposed = false;
        const allows = (id: string) => !disposed && props.active && byId.value.has(id);
        const showNodeFeedback = (error: unknown | null) => {
            const text = error instanceof Error && error.message === 'CANVAS_UNSUPPORTED' ? t('nodes.canvasUnsupported')
                : error ? t('errors.unknown') : t('nodes.created');
            feedback.value = notifyHost(error ? 'error' : 'success', text) ? null : { error };
        };
        const drag = attachCanvasDrop(allows, showNodeFeedback);
        onScopeDispose(() => { disposed = true; drag.dispose(); });
        const detailBack = shallowRef<HTMLButtonElement | null>(null);
        const toolbar = shallowRef<HTMLElement | null>(null);
        let detailTrigger: HTMLButtonElement | undefined;
        let listScroll = 0;
        watch(() => props.homeActivation, () => {
            selected.value = null;
            detailTrigger = undefined;
        });
        const handleSearch = (value: string) => {
            query.value = value;
            collapsedMatches.value = new Set();
        };
        watch(
            () => props.active,
            (active, _, onCleanup) => {
                if (!active) return;
                const sync = () => {
                    if (bookmarkPending.value) return;
                    const next = readNodeBookmarks();
                    const current = bookmarks.value;
                    if (
                        current.length !== next.length ||
                        !current.every((item, index) => item === next[index])
                    )
                        bookmarks.value = next;
                };
                sync();
                const timer = window.setInterval(sync, 500);
                onCleanup(() => window.clearInterval(timer));
            },
            { immediate: true },
        );
        watch(
            [() => props.active, () => props.resource],
            ([active, resource]) => {
                drag.cancel();
                feedback.value = null;
                if (!active || resource.state !== 'ready') bookmarkError.value = undefined;
                if (resource.state === 'ready' && selected.value && !byId.value.has(selected.value)) {
                    selected.value = null;
                    detailTrigger = undefined;
                }
            },
            { flush: 'sync' },
        );
        async function selectNode(id: string, trigger: HTMLButtonElement) {
            if (!allows(id)) return;
            detailTrigger = trigger;
            selected.value = id;
            await nextTick();
            if (allows(id) && selected.value === id) detailBack.value?.focus();
        }
        async function closeDetail() {
            selected.value = null;
            await nextTick();
            if (disposed || !props.active || selected.value) return;
            if (detailTrigger?.isConnected) detailTrigger.focus({ preventScroll: true });
            else toolbar.value?.querySelector<HTMLInputElement>('input[type=search]')?.focus();
            detailTrigger = undefined;
        }
        async function toggleBookmark(id: string, path: string) {
            if (!allows(id) || bookmarkPending.value) return;
            bookmarkError.value = undefined;
            bookmarkPending.value = true;
            const authorizedResource = props.resource;
            try {
                await setNodeBookmark(path, !bookmarks.value.includes(path),
                    () => props.resource === authorizedResource && allows(id));
            } catch (error) {
                const code = error instanceof ApiError && error.code === 'bookmarkUnsupported' ? 'bookmarkUnsupported' : 'bookmark';
                bookmarkError.value = notifyHost('error', t(`errors.${code}`)) ? undefined : code;
            } finally {
                bookmarks.value = readNodeBookmarks();
                bookmarkPending.value = false;
            }
        }

        return () => {
            const { active, resource, refresh } = props;
            const categories = [...new Set(nodes.value.map((node) => node.category))];
            const enabledCategories = categories.filter((category) =>
                selectedCategories.value.includes(category),
            );
            const categorySegment = (segment: string) => (segment === 'Assets' ? t('nav.assets') : nodeCategoryLabel(segment, locale.value));
            const categoryLabel = (category: string) =>
                category
                    .split('/')
                    .filter((segment, index) => segment && (index !== 0 || segment !== 'AstroPhoto'))
                    .map(categorySegment)
                    .join(' / ') || t('nodes.uncategorized');
            const search = query.value.trim().toLocaleLowerCase();
            const filtered = nodes.value.filter(
                (node) =>
                    (enabledCategories.length === 0 || enabledCategories.includes(node.category)) &&
                    [
                        node.id,
                        node.title,
                        node.category,
                        categoryLabel(node.category),
                        ...node.aliases,
                        node.description,
                    ]
                        .join(' ')
                        .toLocaleLowerCase()
                        .includes(search),
            );
            const entries = buildNodeTree(
                filtered,
                order.value === 'alphabetical' ? (a, b) => a.localeCompare(b, locale.value) : undefined,
                categorySegment,
            );
            const filteredIds = new Set(filtered.map(node => node.id));
            const favoriteNodes = [...new Set(bookmarks.value)].flatMap((path) => {
                if (path.endsWith('/')) return [];
                const node = byId.value.get(path.slice(path.lastIndexOf('/') + 1));
                return node && filteredIds.has(node.id) ? [{ ...node, bookmarkPath: path }] : [];
            });
            const updateExpansion = (path: string, open: boolean) => {
                const target = search ? collapsedMatches : expanded;
                const next = new Set(target.value);
                if (search ? !open : open) next.add(path);
                else next.delete(path);
                target.value = next;
            };
            const detail = selected.value ? byId.value.get(selected.value) : undefined;
            const add = (id: string) => {
                if (!allows(id)) return;
                try {
                    createCanvasNode(id);
                    showNodeFeedback(null);
                } catch (error) {
                    showNodeFeedback(error);
                }
            };
            const treeActions = {
                isExpanded: (path: string) => search ? !collapsedMatches.value.has(path) : expanded.value.has(path),
                setExpanded: updateExpansion,
                selectNode,
                startDrag: drag.start,
                previewEnabled: active && !detail,
                isBookmarked: (path: string) => bookmarks.value.includes(path),
                toggleBookmark,
                bookmarkPending: bookmarkPending.value,
                bookmarkLabel: (bookmarked: boolean) => t(bookmarked ? 'nodes.removeBookmark' : 'nodes.addBookmark'),
            };
            return (
                <>
                    <div class="ap-search-toolbar" ref={toolbar} hidden={resource.state !== 'ready'}>
                        <SearchField
                            label={t('nodes.search')}
                            clearLabel={t('browse.clear')}
                            onSearch={handleSearch}
                        />
                        <SearchOptions
                            icon="filter"
                            label={t('browse.filter')}
                            multiple
                            disabled={categories.length === 0}
                            options={[
                                {
                                    id: 'all',
                                    label: t('browse.allCategories'),
                                    checked: enabledCategories.length === 0,
                                    select: () => (selectedCategories.value = []),
                                },
                                ...categories.map((category) => ({
                                    id: `category:${category}`,
                                    label: categoryLabel(category),
                                    checked: enabledCategories.includes(category),
                                    select: () => {
                                        selectedCategories.value = enabledCategories.includes(category)
                                            ? enabledCategories.filter((value) => value !== category)
                                            : [...enabledCategories, category];
                                    },
                                })),
                            ]}
                        />
                        <SearchOptions
                            icon="sort"
                            label={t('browse.sort')}
                            options={sortOrders.map((value) => ({
                                id: value,
                                label: t(`browse.${value}`),
                                checked: order.value === value,
                                select: () => setOrder(value),
                            }))}
                        />
                    </div>
                    {resource.state === 'loading' && <p role="status">{t('states.loading')}</p>}
                    {resource.state === 'error' && <Feedback error={resource.error} retry={refresh} />}
                    {resource.state === 'ready' && (
                        <>
                            <div hidden={!!detail} class="ap-scroll"
                                ref={element => {
                                    if (element instanceof HTMLElement && !detail && active) element.scrollTop = listScroll;
                                }}
                                onScroll={event => {
                                    if (active && !detail) listScroll = (event.currentTarget as HTMLElement).scrollTop;
                                }}>
                                <h3 class="ap-bookmarks-heading">{t('nodes.bookmarks')}</h3>
                                {favoriteNodes.length === 0 ? (
                                    <div class="ap-bookmarks-empty">{t('nodes.noBookmarks')}</div>
                                ) : (
                                    <NodeTree
                                        entries={buildNodeTree(favoriteNodes)}
                                        {...treeActions}
                                    />
                                )}
                                {nodes.value.length === 0 ? (
                                    <p>{t('nodes.empty')}</p>
                                ) : filtered.length === 0 ? (
                                    <p>{t('nodes.noResults')}</p>
                                ) : (
                                    <NodeTree
                                        entries={entries}
                                        {...treeActions}
                                    />
                                )}
                            </div>
                            {detail && (
                                <div class="ap-scroll">
                                    <button ref={detailBack} onClick={closeDetail}>{t('actions.back')}</button>
                                    <h2>{detail.title}</h2>
                                    <code>{detail.id}</code>
                                    <p>{detail.description || t('nodes.noDescription')}</p>
                                    <p>{t('nodes.registered')}</p>
                                    <h3>{t('nodes.inputs')}</h3>
                                    <dl>
                                        {detail.inputs.map(([name, type]) => (
                                            <div key={name}>
                                                <dt>{name}</dt>
                                                <dd>{type}</dd>
                                            </div>
                                        ))}
                                    </dl>
                                    <h3>{t('nodes.outputs')}</h3>
                                    <dl>
                                        {detail.outputs.map(([name, type]) => (
                                            <div key={name}>
                                                <dt>{name}</dt>
                                                <dd>{type}</dd>
                                            </div>
                                        ))}
                                    </dl>
                                    <p>{t('nodes.dependencies')}</p>
                                    <p>{t('nodes.helpUnavailable')}</p>
                                    <button onClick={() => add(detail.id)}>{t('nodes.add')}</button>
                                </div>
                            )}
                        </>
                    )}
                    {resource.state === 'ready' && bookmarkError.value && <p role="alert">{t(`errors.${bookmarkError.value}`)}</p>}
                    {resource.state === 'ready' && feedback.value &&
                        (feedback.value.error instanceof Error && feedback.value.error.message === 'CANVAS_UNSUPPORTED' ? (
                            <p role="alert">{t('nodes.canvasUnsupported')}</p>
                        ) : feedback.value.error ? (
                            <Feedback error={feedback.value.error} />
                        ) : (
                            <p role="status">{t('nodes.created')}</p>
                        ))}
                </>
            );
        };
    },
    { props: ['active', 'resource', 'refresh', 'homeActivation'] },
);
