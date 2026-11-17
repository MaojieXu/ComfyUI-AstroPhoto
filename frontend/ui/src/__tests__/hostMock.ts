export const preferences: Record<string, unknown> = { 'Comfy.Locale': 'en' };
export const tabs: { id: string; render: (container: HTMLElement) => void; destroy: () => void }[] = [];
export const app = {
  api: { fetchApi: jest.fn() },
  extensionManager: {
    setting: { get: jest.fn((id: string) => preferences[id]), set: jest.fn((id: string, value: unknown) => { preferences[id] = value; }) },
    getSidebarTabs: () => tabs,
    registerSidebarTab: jest.fn(tab => tabs.push(tab))
  },
  canvas: { canvas: document.createElement('canvas') }
};
