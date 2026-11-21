import type { FrontendBundle } from '../../../frontend/src/bundles/types';
import { registerAutoStretch } from './AutoStretch';
import { SirilSettings, SirilSummary } from './SirilSettings';
import en from './locales/en/siril.json';
import zh from './locales/zh/siril.json';
import './siril.css';

export const sirilBundle: FrontendBundle = {
  id: 'siril',
  summary: SirilSummary,
  settings: SirilSettings,
  messages: { en: { siril: en }, zh: { siril: zh } },
  registerNodes: registerAutoStretch,
};
