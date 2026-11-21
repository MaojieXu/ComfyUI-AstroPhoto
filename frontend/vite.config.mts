import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
    // Library mode otherwise leaves Vue's environment checks for the consumer.
    define: { 'process.env.NODE_ENV': JSON.stringify('production') },
    plugins: [vue(), vueJsx(), tailwindcss()],
    resolve: {
        dedupe: ['vue', 'vue-i18n'],
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        },
    },
    build: {
        lib: {
            entry: fileURLToPath(new URL('../extension/frontend-entry.ts', import.meta.url)),
            formats: ['es'],
            fileName: 'main',
            cssFileName: 'main',
        },
        rolldownOptions: {
            external: [
                'comfy:app', 'comfy:api',
            ],
            output: {
                codeSplitting: false,
                paths: { 'comfy:app': '../../scripts/app.js', 'comfy:api': '../../scripts/api.js' },
                assetFileNames: 'assets/[name].[ext]',
                entryFileNames: 'main.js'
            }
        },
        outDir: '../js',
        emptyOutDir: false,
        sourcemap: false,
        assetsInlineLimit: 0,
        cssCodeSplit: false
    }
})
