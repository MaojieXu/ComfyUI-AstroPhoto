import { app } from './host/comfy';
import { registerSidebar } from './host/sidebar';
import './styles/theme.css';
// Shared entry retains the existing Vue CSS loader and bundles this CSS with it.
app.registerExtension({ name: 'AstroPhoto.Sidebar', setup() { registerSidebar(app); } });
