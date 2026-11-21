import { defineComponent, shallowRef, watch } from 'vue';
import type { NodeCard } from '../../api/nodes';
import { writeNodeDrag } from '../../host/dragDrop';
import { DisclosureChevron } from '../../shared/DisclosureChevron';
import { NodeHoverPreview } from './NodeHoverPreview';

type Folder = { kind: 'folder'; key: string; label: string; children: Entry[] };
type Leaf = { kind: 'node'; key: string; label: string; node: NodeCard };
type Entry = Folder | Leaf;

// ComfyUI's category organization treats each slash-separated segment as a folder.
export function buildNodeTree(
    nodes: NodeCard[],
    compare?: (a: string, b: string) => number,
    categoryLabel: (label: string) => string = (label) => label,
) {
    const root: Entry[] = [];
    const folders = new Map<string, Folder>();
    for (const node of nodes) {
        let children = root;
        let path = '';
        const segments = node.category.split('/').filter(Boolean);
        if (segments[0] === 'AstroPhoto') segments.shift();
        for (const label of segments) {
            path += `/${label}`;
            let folder = folders.get(path);
            if (!folder) {
                folder = { kind: 'folder', key: path, label: categoryLabel(label), children: [] };
                folders.set(path, folder);
                children.push(folder);
            }
            children = folder.children;
        }
        children.push({ kind: 'node', key: node.id, label: node.title, node });
    }
    if (compare) {
        const sortEntries = (entries: Entry[]) => entries.sort((a, b) => compare(a.label, b.label));
        sortEntries(root);
        for (const folder of folders.values()) sortEntries(folder.children);
    }
    return root;
}

interface TreeProps {
    entries: Entry[];
    level?: number;
    isExpanded: (path: string) => boolean;
    setExpanded: (path: string, open: boolean) => void;
    selectNode: (id: string) => void;
    previewEnabled: boolean;
    isBookmarked: (node: NodeCard) => boolean;
    toggleBookmark: (node: NodeCard) => void;
    bookmarkLabel: (bookmarked: boolean) => string;
}

type LeafProps = Pick<
    TreeProps,
    'selectNode' | 'previewEnabled' | 'isBookmarked' | 'toggleBookmark' | 'bookmarkLabel'
> & { node: NodeCard; level: number };
const NodeLeaf = defineComponent(
    (props: LeafProps) => {
        const anchor = shallowRef<HTMLElement | null>(null);
        let dragging = false;
        watch(
            () => props.previewEnabled,
            (enabled) => {
                if (!enabled) anchor.value = null;
            },
        );

        return () => {
            const { node, level, selectNode, previewEnabled, isBookmarked, toggleBookmark, bookmarkLabel } =
                props;
            return (
                <li>
                    <div
                        class="ap-tree-row ap-tree-leaf"
                        onPointerenter={(event) => {
                            if (event.pointerType === 'mouse' && previewEnabled && !dragging)
                                anchor.value = event.currentTarget as HTMLElement;
                        }}
                        onPointerleave={() => (anchor.value = null)}
                    >
                        <button
                            type="button"
                            class="ap-resource"
                            style={{ paddingInlineStart: `${8 + level * 24}px` }}
                            draggable
                            onDragstart={(event) => {
                                dragging = true;
                                anchor.value = null;
                                if (event.dataTransfer) writeNodeDrag(event.dataTransfer, node.id);
                            }}
                            onDragend={() => {
                                dragging = false;
                            }}
                            onClick={() => {
                                anchor.value = null;
                                selectNode(node.id);
                            }}
                        >
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                                <path
                                    stroke="currentColor"
                                    stroke-linecap="round"
                                    stroke-width="1.3"
                                    d="m11.2667 10.45-.0842.3156c-.143.5363-.6286.9094-1.18362.9094H4.6945c-.80486 0-1.39102-.7629-1.18364-1.5406l1.30667-4.90002c.143-.53625.62865-.90937 1.18364-.90937h5.46393c.7243 0 1.2518.68663 1.0652 1.38652l-.0301.11275M15.35 8.00001h-4.9m-6.73748 0H.65002"
                                />
                            </svg>
                            <span>{node.title}</span>
                        </button>
                        <button
                            type="button"
                            class="ap-tree-bookmark"
                            aria-label={bookmarkLabel(isBookmarked(node))}
                            title={bookmarkLabel(isBookmarked(node))}
                            aria-pressed={isBookmarked(node)}
                            onClick={() => {
                                anchor.value = null;
                                toggleBookmark(node);
                            }}
                        >
                            <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill={isBookmarked(node) ? 'currentColor' : 'none'}
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                aria-hidden="true"
                            >
                                <path d="M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16l-6-4-6 4Z" />
                            </svg>
                        </button>
                    </div>
                    {previewEnabled && anchor.value && <NodeHoverPreview anchor={anchor.value} node={node} />}
                </li>
            );
        };
    },
    {
        props: [
            'node',
            'level',
            'selectNode',
            'previewEnabled',
            'isBookmarked',
            'toggleBookmark',
            'bookmarkLabel',
        ],
    },
);

export function NodeTree({ entries, level = 0, ...actions }: TreeProps) {
    const indent = { paddingInlineStart: `${8 + level * 24}px` };
    return (
        <ul class="ap-node-tree" role="list">
            {entries.map((entry) => {
                if (entry.kind === 'folder') {
                    const open = actions.isExpanded(entry.key);
                    return (
                        <li key={`folder:${entry.key}`}>
                            <button
                                type="button"
                                class="ap-tree-row ap-tree-folder"
                                style={indent}
                                aria-expanded={open}
                                title={entry.label}
                                onClick={() => actions.setExpanded(entry.key, !open)}
                                onKeydown={(event) => {
                                    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
                                    event.preventDefault();
                                    event.stopPropagation();
                                    actions.setExpanded(entry.key, event.key === 'ArrowRight');
                                }}
                            >
                                <DisclosureChevron />
                                <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    aria-hidden="true"
                                >
                                    <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-8a2 2 0 0 1-1.6-.8l-.8-1.1A2 2 0 0 0 8 3.3H4a2 2 0 0 0-2 2V18a2 2 0 0 0 2 2Z" />
                                </svg>
                                <span>{entry.label}</span>
                            </button>
                            {open && <NodeTree entries={entry.children} level={level + 1} {...actions} />}
                        </li>
                    );
                }
                return <NodeLeaf key={`node:${entry.key}`} node={entry.node} level={level} {...actions} />;
            })}
        </ul>
    );
}

NodeTree.inheritAttrs = false;
