import type { Component } from 'vue';
import type { ComfyApp } from '@comfyorg/comfyui-frontend-types';

export interface FrontendBundle {
  readonly id: string;
  readonly summary: Component<{ onOpen: () => void }>;
  readonly settings: Component;
  readonly messages: Readonly<Record<'en' | 'zh', Record<string, unknown>>>;
  registerNodes(host: ComfyApp, bundles: readonly FrontendBundle[]): void;
}
