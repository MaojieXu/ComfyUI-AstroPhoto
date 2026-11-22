import type { Asset, Collection, Folder, Master, Placement } from '../../api/assets';

export type Entry = {
  id: string;
  label: string;
  children?: Entry[];
  folder?: Folder;
  placement?: Placement;
  master?: Master;
  collection?: Collection;
};

export function libraryTree(folders: Folder[], placements: Placement[], masters: Master[],
    assets: ReadonlyMap<string, Asset>, collections: ReadonlyMap<string, Collection>, calibration: Collection[] = []) {
  const roots: Entry[] = [];
  const byId = new Map<string, Entry & { children: Entry[]; folder: Folder }>();
  for (const folder of folders) byId.set(folder.id, { id: folder.id, label: folder.name, children: [], folder });
  for (const entry of byId.values()) {
    const owner = entry.folder.parent_id && byId.get(entry.folder.parent_id);
    if (owner) owner.children.push(entry);
    else roots.push(entry);
  }
  function insert(item: Entry, folderId: string | null) {
    const children = folderId ? byId.get(folderId)?.children : roots;
    (children ?? roots).push(item);
  }
  for (const placement of placements) {
    const label = placement.asset_id ? assets.get(placement.asset_id)?.name ?? placement.asset_id
      : placement.collection_id ? collections.get(placement.collection_id)?.name ?? placement.collection_id : placement.id;
    insert({ id: placement.id, label, placement }, placement.folder_id);
  }
  for (const master of masters)
    insert({ id: master.id, label: assets.get(master.asset_id)?.name ?? master.asset_id, master }, master.folder_id);
  for (const collection of calibration)
    insert({ id: collection.id, label: collection.name, collection }, collection.calibration_folder_id ?? null);
  return roots;
}
