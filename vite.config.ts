import preact from '@preact/preset-vite';
import { defineConfig, PluginOption } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    preact(),
    // disable hmr to apply game changes
    {
      handleHotUpdate({ server }) {
        server.ws.send({ type: 'full-reload' });
      },
    } as PluginOption,
  ],
});
