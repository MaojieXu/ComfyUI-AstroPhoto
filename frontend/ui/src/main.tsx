import './features/settings/equipment/equipment.css';
import { app } from './host/comfy';
import { registerSidebar } from './host/sidebar';
import './styles/theme.css';
import './features/settings/storage.css';
import './features/siril/siril.css';
import { registerScientific } from './host/scientific';
import { getPreviewSettings } from './api/previewSettings';
// Shared entry retains the existing Vue CSS loader and bundles this CSS with it.
app.registerExtension({ name: 'AstroPhoto.Sidebar', setup() {
  registerSidebar(app);
  void getPreviewSettings().catch(() => { /* Keep layout defaults until settings become available. */ });
} });
registerScientific(app);
