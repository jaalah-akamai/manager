import { federation } from '@module-federation/vite';
import react from '@vitejs/plugin-react-swc';
import { URL } from 'url';
import svgr from 'vite-plugin-svgr';
import { defineConfig } from 'vitest/config';

import { sharedFederationDependencies } from '../shared/federation.config';
import { sharedViteConfig } from '../shared/vite.config';

// ESM-friendly alternative to `__dirname`.
const DIRNAME = new URL('.', import.meta.url).pathname;

export default defineConfig({
  ...sharedViteConfig,
  build: {
    outDir: 'build',
    ...sharedViteConfig.build,
    modulePreload: {
      polyfill: true,
    },
  },
  envPrefix: 'REACT_APP_',
  esbuild: {
    supported: {
      'top-level-await': true,
    },
    target: 'es2022',
  },
  optimizeDeps: {
    esbuildOptions: {
      supported: {
        'top-level-await': true,
      },
      target: 'es2022',
    },
  },
  plugins: [
    react(),
    svgr({ exportAsDefault: true }),
    federation({
      name: 'cloud',
      remotes: {
        '@remote/VolumesCreate':
          'http://localhost:4001/build/assets/volumesCreate.js',
      },
      shared: ['react', 'react-dom'],
    }),
  ],
  resolve: {
    alias: {
      src: `${DIRNAME}/src`,
    },
  },
  server: {
    port: 3000,
  },
  test: {
    coverage: {
      exclude: [
        'src/**/*.constants.{js,jsx,ts,tsx}',
        'src/**/*.stories.{js,jsx,ts,tsx}',
        'src/**/index.{js,jsx,ts,tsx}',
        'src/**/*.styles.{js,jsx,ts,tsx}',
      ],
      include: [
        'src/components/**/*.{js,jsx,ts,tsx}',
        'src/hooks/*{js,jsx,ts,tsx}',
        'src/utilities/**/*.{js,jsx,ts,tsx}',
        'src/**/*.utils.{js,jsx,ts,tsx}',
      ],
    },
    environment: 'jsdom',
    globals: true,
    pool: 'forks',
    setupFiles: './src/testSetup.ts',
  },
});
