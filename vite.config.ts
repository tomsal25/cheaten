import preact from '@preact/preset-vite';
import { defineConfig, PluginOption } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    preact(),
    {
      handleHotUpdate({ server, modules }) {
        // disable hmr in scene folder
        if (/\/src\/scenes/.test(modules[0]?.url))
          server.ws.send({ type: 'full-reload' });
      },
    } as PluginOption,
  ],

  build: {
    rollupOptions: {
      output: {
        manualChunks: id => {
          if (id.includes('node_modules')) {
            if (id.includes('phaser')) {
              return 'phaser';
            }
            return 'vendor';
          }
        },
      },
    },
  },
});
