import type { Component } from 'vue';
import type { ComfyApp } from '@comfyorg/comfyui-frontend-types';

type HostNode = Parameters<NonNullable<Parameters<ComfyApp['registerExtension']>[0]['nodeCreated']>>[0];
export type PreviewInspection = {
  source: string;
  parameters: Record<string, number | boolean>;
  formal_id?: string;
  provenance: { sources: Record<string, number[]>; sourceRefs: string[] }[];
};

export interface FrontendBundle {
  readonly id: string;
  readonly summary: Component<{ onOpen: () => void }>;
  readonly settings: Component;
  readonly messages: Readonly<Record<'en' | 'zh', Record<string, unknown>>>;
  registerNodes(host: ComfyApp, bundles: readonly FrontendBundle[]): void;
  supportsNodePreview?(nodeType: string): boolean;
  inspectNode?(node: HostNode): PreviewInspection | undefined;
}
