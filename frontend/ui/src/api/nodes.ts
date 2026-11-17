import { ApiError, getJson, isRecord } from './client';
export interface NodeCard {
  id: string; title: string; description: string; category: string; aliases: string[];
  inputs: [string, string][]; outputs: [string, string][];
}
export function nodeCatalog(value: unknown): NodeCard[] {
  if (!isRecord(value)) throw new ApiError('schema');
  return Object.entries(value).filter(([id, def]) => isRecord(def) &&
    (def.python_module === 'custom_nodes.ComfyUI_AstroPhoto' ||
      (id === 'vue-basic' && def.python_module === undefined)))
    .map(([id, unknownDef]) => {
      const def = unknownDef as Record<string, unknown>;
      if (typeof def.name !== 'string' || !Array.isArray(def.output) ||
        !def.output.every(o => typeof o === 'string') || !isRecord(def.input)) throw new ApiError('schema');
      const inputs: [string, string][] = [];
      for (const group of ['required', 'optional']) {
        const fields = def.input[group];
        if (fields === undefined) continue;
        if (!isRecord(fields)) throw new ApiError('schema');
        for (const [name, spec] of Object.entries(fields)) {
          if (!Array.isArray(spec) || !(typeof spec[0] === 'string' || Array.isArray(spec[0]))) throw new ApiError('schema');
          inputs.push([name, Array.isArray(spec[0]) ? 'COMBO' : spec[0]]);
        }
      }
      return { id, title: typeof def.display_name === 'string' ? def.display_name : id,
        description: typeof def.description === 'string' ? def.description : '',
        category: typeof def.category === 'string' ? def.category : '',
        aliases: Array.isArray(def.search_aliases) ? def.search_aliases.filter((s): s is string => typeof s === 'string') : [],
        inputs, outputs: def.output.map((type, index) => [Array.isArray(def.output_name) && typeof def.output_name[index] === 'string' ? def.output_name[index] : String(index), type] as [string, string]) };
    });
}
export async function fetchNodes(signal?: AbortSignal) { return nodeCatalog(await getJson('/object_info', signal)); }
