import { defineConfig } from 'vite';

export default defineConfig({
  root: 'src', // Set the root to 'src'
  build: {
	  target: 'es6',
    outDir: '../build', // Output directory (relative to the root)
    emptyOutDir: true, // Clean the output directory before building
  },
});
