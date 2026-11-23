export type ModuleId = 'storage' | 'software' | 'equipment' | 'knowledge' | 'memory' | 'agent' | 'system';
export const modules: readonly ModuleId[] = ['equipment', 'software', 'storage'];
export const capabilityFor: Partial<Record<ModuleId, string>> = {
  software: 'software', equipment: 'equipment', knowledge: 'knowledge', memory: 'memory'
};
