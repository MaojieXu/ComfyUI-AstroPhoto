import { defineComponent, ref, shallowRef, watch } from 'vue';
import { useI18n } from 'vue-i18n';
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

type Props = { active: boolean; resource: Resource<NodeCard[]>; refresh: () => void };

export const NodesPage = defineComponent(
    (props: Props) => {
        const { t, locale } = useI18n();
        const query = ref('');
        const expanded = shallowRef(new Set<string>());
        const collapsedMatches = shallowRef(new Set<string>());
        const selectedCategories = shallowRef<string[]>([]);
        const [order, setOrder] = useStoredChoice('AstroPhoto.Nodes.Sort', sortOrders);
        const selected = ref<string | null>(null);
        const bookmarks = shallowRef(readBookmarks());
        const bookmarkFailed = ref(false);
        const feedback = shallowRef<{ error: unknown | null } | null>(null);
        const handleSearch = (value: string) => {
            query.value = value;
            collapsedMatches.value = new Set();
        };
        watch(
            () => props.active,
            (active, _, onCleanup) => {
                if (!active) return;
                const sync = () => {
                    const next = readBookmarks();
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
            () => props.resource,
            (resource, _, onCleanup) => {
                const allowed = new Set(
                    resource.state === 'ready' ? resource.data.map((node) => node.id) : [],
                );
                onCleanup(
                    attachCanvasDrop(allowed, (error) => {
                        feedback.value = { error };
                    }),
                );
            },
            { immediate: true },
        );
        const setSelected = (value: string | null) => {
            selected.value = value;
        };

        return () => {
            const { active, resource, refresh } = props;
            const nodes =
                resource.state === 'ready'
                    ? resource.data.filter((node) => node.category.split('/')[0] !== 'examples')
                    : [];
            const categories = [...new Set(nodes.map((node) => node.category))];
            const enabledCategories = categories.filter((category) =>
                selectedCategories.value.includes(category),
            );
            const categorySegment = (segment: string) => (segment === 'Assets' ? t('nav.assets') : segment);
            const categoryLabel = (category: string) =>
                category
                    .split('/')
                    .filter((segment, index) => segment && (index !== 0 || segment !== 'AstroPhoto'))
                    .map(categorySegment)
                    .join(' / ') || t('nodes.uncategorized');
            const search = query.value.trim().toLocaleLowerCase();
            const filtered = nodes.filter(
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
            const isBookmarked = (node: NodeCard) =>
                bookmarks.value.includes(node.id) || bookmarks.value.includes(`${node.category}/${node.id}`);
            const toggleBookmark = (node: NodeCard) => {
                bookmarkFailed.value = false;
                const current = readBookmarks();
                const nodePath = `${node.category}/${node.id}`;
                const next =
                    current.includes(node.id) || current.includes(nodePath)
                        ? current.filter((item) => item !== node.id && item !== nodePath)
                        : [...current, node.id];
                try {
                    const result = app.extensionManager.setting.set(bookmarkSetting, next);
                    bookmarks.value = next;
                    void Promise.resolve(result).catch(() => {
                        bookmarks.value = readBookmarks();
                        bookmarkFailed.value = true;
                    });
                } catch {
                    bookmarkFailed.value = true;
                }
            };
            const favoriteNodes = bookmarks.value.flatMap((path) => {
                if (path.endsWith('/')) return [];
                const parts = path.split('/');
                const node = filtered.find((item) => item.id === parts[parts.length - 1]);
                return node ? [{ ...node, category: parts.slice(0, -1).join('/') }] : [];
            });
            const updateExpansion = (path: string, open: boolean) => {
                const target = search ? collapsedMatches : expanded;
                const next = new Set(target.value);
                if (search ? !open : open) next.add(path);
                else next.delete(path);
                target.value = next;
            };
            const detail = nodes.find((n) => n.id === selected.value);
            const add = (id: string) => {
                try {
                    createCanvasNode(id);
                    feedback.value = { error: null };
                } catch (error) {
                    feedback.value = { error };
                }
            };
            return (
                <>
                    <div class="ap-search-toolbar">
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
                            <div hidden={!!detail} class="ap-scroll">
                                <h3 class="ap-bookmarks-heading">{t('nodes.bookmarks')}</h3>
                                {favoriteNodes.length === 0 ? (
                                    <div class="ap-bookmarks-empty">{t('nodes.noBookmarks')}</div>
                                ) : (
                                    <NodeTree
                                        entries={buildNodeTree(favoriteNodes)}
                                        isExpanded={(path) =>
                                            search
                                                ? !collapsedMatches.value.has(path)
                                                : expanded.value.has(path)
                                        }
                                        setExpanded={updateExpansion}
                                        selectNode={setSelected}
                                        previewEnabled={active && !detail}
                                        isBookmarked={isBookmarked}
                                        toggleBookmark={toggleBookmark}
                                        bookmarkLabel={(bookmarked) =>
                                            t(bookmarked ? 'nodes.removeBookmark' : 'nodes.addBookmark')
                                        }
                                    />
                                )}
                                {nodes.length === 0 ? (
                                    <p>{t('nodes.empty')}</p>
                                ) : filtered.length === 0 ? (
                                    <p>{t('nodes.noResults')}</p>
                                ) : (
                                    <NodeTree
                                        entries={entries}
                                        isExpanded={(path) =>
                                            search
                                                ? !collapsedMatches.value.has(path)
                                                : expanded.value.has(path)
                                        }
                                        setExpanded={updateExpansion}
                                        selectNode={setSelected}
                                        previewEnabled={active && !detail}
                                        isBookmarked={isBookmarked}
                                        toggleBookmark={toggleBookmark}
                                        bookmarkLabel={(bookmarked) =>
                                            t(bookmarked ? 'nodes.removeBookmark' : 'nodes.addBookmark')
                                        }
                                    />
                                )}
                            </div>
                            {detail && (
                                <div class="ap-scroll">
                                    <button onClick={() => setSelected(null)}>{t('actions.back')}</button>
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
                    {bookmarkFailed.value && <p role="alert">{t('errors.bookmark')}</p>}
                    {feedback.value &&
                        (feedback.value.error ? (
                            <Feedback error={feedback.value.error} />
                        ) : (
                            <p role="status">{t('nodes.created')}</p>
                        ))}
                </>
            );
        };
    },
    { props: ['active', 'resource', 'refresh'] },
);
