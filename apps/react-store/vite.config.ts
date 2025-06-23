/// <reference types='vitest' />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin';

export default defineConfig({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/apps/react-store',
  server: {
    port: 4300,
    host: 'localhost',
  },
  preview: {
    port: 4300,
    host: 'localhost',
  },
  plugins: [react(), nxViteTsPaths(), nxCopyAssetsPlugin(['*.md'])],
  build: {
    // 👇   Configure Vite to build the React component as a web component
    // use the UMD, ES format so it can be embedded and used inside the Angular app.
    // The output file will be placed in the `dist` folder and later copied into Angular's assets.

    lib: {
      entry: 'src/app/web-component.tsx', // <-- Update to match your file
      name: 'ReactComponent',
      fileName: 'react-component',
      formats: ['es', 'umd'], // ✅ Valid formats (no TypeScript casting)
    },
    outDir: '../../dist/apps/react-store',
    emptyOutDir: true,
    reportCompressedSize: true,
  },

  //👇 Define global constants for the build.
  // This replaces occurrences of process.env.NODE_ENV with "production" in the final bundle.
  // Useful for React and other libraries that optimize for production.

  // ** This helps ensure compatibility and prevents runtime process is not defined errors when embedding React components.
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
  },

  test: {
    watch: false,
    globals: true,
    environment: 'jsdom',
    include: ['{src,tests}/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    reporters: ['default'],
    coverage: {
      reportsDirectory: '../../coverage/apps/react-store',
      provider: 'v8',
    },
  },
});
