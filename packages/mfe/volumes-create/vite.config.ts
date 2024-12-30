import { federation } from '@module-federation/vite';
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react-swc';
import { URL } from 'url';
import svgr from 'vite-plugin-svgr';
import { sharedFederationDependencies } from '../../shared/federation.config';
import { sharedViteConfig } from '../../shared/vite.config';


// ESM-friendly alternative to `__dirname`.
const DIRNAME = new URL('.', import.meta.url).pathname;

export default defineConfig({
  ...sharedViteConfig,
  build: {
    outDir: 'build',
    target: 'es2022',
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        entryFileNames: 'assets/volumesCreate.js',
        manualChunks(id: string) {
          if (id.includes('node_modules')) {
            if (id.includes('@mui')) {
              return 'vendor-mui';
            }
            if (id.includes('@emotion')) {
              return 'vendor-emotion';
            }
            if (id.includes('@tanstack')) {
              return 'vendor-tanstack';
            }
            return 'vendor';
          }
        }
      }
    }
  },
  esbuild: {
    target: 'es2022'
  },
  optimizeDeps: {
    esbuildOptions: {
      target: 'es2022'
    }
  },
  envPrefix: 'REACT_APP_',
  plugins: [
    react(),
    svgr({ exportAsDefault: true }),
    federation({
      exposes: {
        './VolumesCreate': './src/App.tsx',
      },
      filename: 'volumesCreate.js',
      name: 'volumes',
      shared: ['react', 'react-dom'],
    }),
  ],
  resolve: {
    alias: {
      src: `${DIRNAME}/src`,
    },
  },
  server: {
    port: 3001,
  },
  test: {
    environment: 'jsdom',
    setupFiles: './testSetup.ts',
  },
});