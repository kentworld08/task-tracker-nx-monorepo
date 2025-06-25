// apps/react-store/vite.config.ts
/// <reference types='vitest' />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin';

export default defineConfig({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/apps/react-store',
  server: {
    port: 4201, // Changed to 4201 for consistency with local serving
    host: 'localhost',
  },
  preview: {
    port: 4201, // Changed to 4201 for consistency with local serving
    host: 'localhost',
  },
  plugins: [react(), nxViteTsPaths(), nxCopyAssetsPlugin(['*.md'])],
  build: {
    // ⭐ IMPORTANT CHANGE: Removed the 'lib' option.
    // Removing 'lib' tells Vite to build a standard application (SPA)
    // instead of a JavaScript library or web component.
    // This will ensure an index.html and associated assets are generated.
    outDir: '../../dist/apps/react-store', // This remains correct for Nx setup
    emptyOutDir: true,
    reportCompressedSize: true,
  },

  // 👇 Define global constants for the build.
  // This replaces occurrences of process.env.NODE_ENV with "production" in the final bundle.
  // Useful for React and other libraries that optimize for production.
  // This helps ensure compatibility and prevents runtime process is not defined errors.
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
