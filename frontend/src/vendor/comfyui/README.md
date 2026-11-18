# ComfyUI Frontend SingleSelect

The Vue components, types and composables come from ComfyUI Frontend v1.59.1
(`cded88fdffbb78f191fc8e454e7f2cfa5016ee43`). The component templates and behavior
follow the upstream source. Imports for vendored modules use relative paths.
The single-select item also accepts a disabled flag for unavailable equipment.
The multi-select components use the same upstream source with unused clear-button
markup removed and local import paths adjusted.

| Local source | Upstream source |
|---|---|
| `single-select/` | `src/components/ui/single-select/` |
| `select/` | `src/components/ui/select/` |
| `composables/` | `src/composables/` |
| `tailwind-utils.ts` | `packages/tailwind-utils/src/index.ts` |
| `select.variants.ts` | `packages/design-system/src/select.variants.ts` |

See the upstream repository GPL-3.0 license. The upstream design-system
package declares MIT and credits Comfy Org. ComfyUI supplies the theme and utility CSS.
