import { app } from 'comfy:app';
import { initializeFrontend } from '../frontend/src/main';
import { sirilBundle } from './siril/frontend';

initializeFrontend(app, [sirilBundle]);
