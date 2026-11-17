import { useEffect, useRef, useState } from 'react';
import type { NodeCard } from '../../api/nodes';
import { writeNodeDrag } from '../../host/dragDrop';
import { NodeHoverPreview } from './NodeHoverPreview';

type Folder = { kind: 'folder'; key: string; label: string; children: Entry[] };
type Leaf = { kind: 'node'; key: string; label: string; node: NodeCard };
type Entry = Folder | Leaf;

// ComfyUI's category organization treats each slash-separated segment as a folder.
export function buildNodeTree(nodes: NodeCard[], compare?: (a: string, b: string) => number) {
  const root: Entry[] = [];
  const folders = new Map<string, Folder>();
  for (const node of nodes) {
    let children = root;
    let path = '';
    for (const label of node.category.split('/').filter(Boolean)) {
      path += `/${label}`;
      let folder = folders.get(path);
      if (!folder) {
        folder = { kind: 'folder', key: path, label, children: [] };
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
  addNode: (id: string) => void;
  addLabel: (name: string) => string;
  previewEnabled: boolean;
}

function NodeLeaf({ node, level, selectNode, addNode, addLabel, previewEnabled }: Pick<TreeProps,
  'selectNode' | 'addNode' | 'addLabel' | 'previewEnabled'> & { node: NodeCard; level: number }) {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const dragging = useRef(false);
  useEffect(() => {
    if (!previewEnabled) setAnchor(null);
  }, [previewEnabled]);
  const label = addLabel(node.title);

  return <li>
    <div className="ap-tree-row ap-tree-leaf"
      onPointerEnter={event => {
        if (event.pointerType === 'mouse' && previewEnabled && !dragging.current) setAnchor(event.currentTarget);
      }}
      onPointerLeave={() => setAnchor(null)}>
      <button type="button" className="ap-resource" style={{ paddingInlineStart: 8 + level * 24 }} draggable
        onDragStart={event => {
          dragging.current = true;
          setAnchor(null);
          writeNodeDrag(event.dataTransfer, node.id);
        }}
        onDragEnd={() => { dragging.current = false; }}
        onClick={() => { setAnchor(null); selectNode(node.id); }}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path stroke="currentColor" strokeLinecap="round" strokeWidth="1.3"
            d="m11.2667 10.45-.0842.3156c-.143.5363-.6286.9094-1.18362.9094H4.6945c-.80486 0-1.39102-.7629-1.18364-1.5406l1.30667-4.90002c.143-.53625.62865-.90937 1.18364-.90937h5.46393c.7243 0 1.2518.68663 1.0652 1.38652l-.0301.11275M15.35 8.00001h-4.9m-6.73748 0H.65002" />
        </svg>
        <span>{node.title}</span>
      </button>
      <button type="button" className="ap-tree-add" aria-label={label} title={label}
        onClick={() => { setAnchor(null); addNode(node.id); }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>
      </button>
    </div>
    {previewEnabled && anchor && <NodeHoverPreview anchor={anchor} node={node} />}
  </li>;
}

export function NodeTree({ entries, level = 0, ...actions }: TreeProps) {
  const indent = { paddingInlineStart: 8 + level * 24 };
  return <ul className="ap-node-tree" role="list">
    {entries.map(entry => {
      if (entry.kind === 'folder') {
        const open = actions.isExpanded(entry.key);
        return <li key={`folder:${entry.key}`}>
          <button type="button" className="ap-tree-row ap-tree-folder" style={indent}
            aria-expanded={open} title={entry.label}
            onClick={() => actions.setExpanded(entry.key, !open)} onKeyDown={event => {
              if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
              event.preventDefault();
              event.stopPropagation();
              actions.setExpanded(entry.key, event.key === 'ArrowRight');
            }}>
            <svg className="ap-tree-chevron" width="16" height="16" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="m6 9 6 6 6-6" />
            </svg>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-8a2 2 0 0 1-1.6-.8l-.8-1.1A2 2 0 0 0 8 3.3H4a2 2 0 0 0-2 2V18a2 2 0 0 0 2 2Z" />
            </svg>
            <span>{entry.label}</span>
          </button>
          {open && <NodeTree entries={entry.children} level={level + 1} {...actions} />}
        </li>;
      }
      return <NodeLeaf key={`node:${entry.key}`} node={entry.node} level={level} {...actions} />;
    })}
  </ul>;
}
