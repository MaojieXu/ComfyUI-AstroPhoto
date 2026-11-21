export const status = {
  extension: { id: 'ComfyUI_AstroPhoto', version: '0.0.1' }, api_version: 'v1', status: 'ok',
  runtime: { node_registered: true, routes_registered: true },
  capabilities: { assets: { available: false, reason: 'not_implemented' }, status_api: { available: true, reason: null } }
};
export const definitions = {
  'vue-basic': { name: 'vue-basic', display_name: 'Vue Basic', category: 'examples', python_module: 'custom_nodes.ComfyUI_AstroPhoto',
    input: { required: { custom_vue_component_basic: ['CUSTOM_VUE_COMPONENT_BASIC', {}] } }, output: ['IMAGE'], output_name: ['image'], search_aliases: ['画板'] },
  Fake: { name: 'Fake', python_module: 'custom_nodes.other', category: 'AstroPhoto', input: {}, output: [] }
};
