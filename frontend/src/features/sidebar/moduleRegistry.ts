export const modules = ['storage', 'environment', 'software', 'equipment', 'knowledge', 'memory', 'agent', 'system'] as const;
export type ModuleId = typeof modules[number];
export const capabilityFor: Partial<Record<ModuleId, string>> = {
  software: 'software', equipment: 'equipment', knowledge: 'knowledge', memory: 'memory'
};
