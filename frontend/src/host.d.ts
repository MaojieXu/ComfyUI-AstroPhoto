// Runtime URLs served by ComfyUI. Types pinned to the target Frontend release.
declare module 'comfy:app' {
  export const app: import('@comfyorg/comfyui-frontend-types').ComfyApp;
}
declare module 'comfy:api' {
  export const api: import('@comfyorg/comfyui-frontend-types').ComfyApi;
}
