import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import vue2 from '@vitejs/plugin-vue2';
 
export default defineConfig({
    plugins: [
        laravel({
            input: [
                'resources/js/statamic-element-picker.js',
                'resources/css/statamic-element-picker.css',
            ],
            hotFile: 'dist/vite.hot',
            publicDirectory: 'dist',
        }),
        vue2(),
    ],
});