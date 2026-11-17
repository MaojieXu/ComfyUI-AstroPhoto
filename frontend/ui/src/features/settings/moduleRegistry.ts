export const modules = ['software', 'equipment', 'observing-site', 'knowledge', 'memory', 'agent', 'system'] as const;
export type ModuleId = typeof modules[number];
export const capabilityFor: Partial<Record<ModuleId, string>> = {
  software: 'software', equipment: 'assets', 'observing-site': 'assets', knowledge: 'knowledge', memory: 'memory'
};
