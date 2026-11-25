import { ApiError, getJson, isRecord } from './client';
export interface NodeCard {
  id: string; title: string; description: string; category: string; aliases: string[];
  inputLabels?: Record<string, string>;
  inputs: [string, string][]; outputs: [string, string][];
}
export function nodeCatalog(value: unknown, moduleName: string): NodeCard[] {
  if (!isRecord(value)) throw new ApiError('schema');
  const nodes: NodeCard[] = [];
  for (const [id, def] of Object.entries(value)) {
    if (!isRecord(def) || !id || def.name !== id) continue;
    const category = typeof def.category === 'string' ? def.category : '';
    if (id === 'vue-basic' || category.split('/')[0] === 'examples') continue;
    if (def.python_module !== moduleName) continue;

    const inputs: NodeCard['inputs'] = [];
    const inputLabels: Record<string, string> = {};
    for (const group of ['required', 'optional']) {
      const fields = isRecord(def.input) ? def.input[group] : undefined;
      if (!isRecord(fields)) continue;
      for (const [name, spec] of Object.entries(fields)) {
        if (!Array.isArray(spec)) continue;
        const type: unknown = spec[0];
        if (isRecord(spec[1]) && typeof spec[1].display_name === 'string') inputLabels[name] = spec[1].display_name;
        if (Array.isArray(type)) inputs.push([name, 'COMBO']);
        else if (typeof type === 'string') inputs.push([name, type]);
      }
    }
    const outputs: NodeCard['outputs'] = [];
    if (Array.isArray(def.output)) {
      def.output.forEach((type: unknown, index: number) => {
        if (typeof type !== 'string') return;
        const name: unknown = Array.isArray(def.output_name) ? def.output_name[index] : undefined;
        outputs.push([typeof name === 'string' ? name : String(index), type]);
      });
    }
    nodes.push({
      id,
      title: typeof def.display_name === 'string' && def.display_name.trim() ? def.display_name : id,
      description: typeof def.description === 'string' ? def.description : '',
      category,
      aliases: Array.isArray(def.search_aliases) ? def.search_aliases.filter((s): s is string => typeof s === 'string') : [],
      ...(Object.keys(inputLabels).length > 0 ? { inputLabels } : {}),
      inputs,
      outputs,
    });
  }
  return nodes;
}

export async function fetchNodes(signal?: AbortSignal) {
  // V3 object_info identifies a custom-node pack by its installed directory.
  const pack = new URL(import.meta.url).pathname.match(/\/extensions\/([^/]+)\/main\.js$/)?.[1];
  if (!pack) throw new ApiError('schema');
  const moduleName = `custom_nodes.${decodeURIComponent(pack)}`;
  return nodeCatalog(await getJson('/object_info', signal, 'no-store'), moduleName);
}
