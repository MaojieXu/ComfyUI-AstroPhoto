import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import react from '@vitejs/plugin-react'

export default defineConfig({
    define: { 'process.env.NODE_ENV': JSON.stringify('production') },
    plugins: [
        vue(), react(),
        vueDevTools()
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        },
    },
    build: {
        lib: {
            entry: './entry.ts',
            formats: ['es'],
            fileName: 'main'
        },
        rollupOptions: {
            external: [
                'comfy:app', 'comfy:api',
            ],
            output: {
                inlineDynamicImports: true,
                paths: { 'comfy:app': '../../scripts/app.js', 'comfy:api': '../../scripts/api.js' },
                dir: '../js',
                assetFileNames: 'assets/[name].[ext]',
                entryFileNames: 'main.js'
            }
        },
        outDir: '../js',
        emptyOutDir: true,
        sourcemap: false,
        assetsInlineLimit: 0,
        cssCodeSplit: false
    }
})
