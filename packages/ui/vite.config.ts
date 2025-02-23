import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import dts from 'vite-plugin-dts';
import path from 'path';

export default defineConfig({
  plugins: [
    vue(),
    dts({
      entryRoot: './src',
      outDir: ['../ak/es/src', '../ak/lib/src'],
      tsconfigPath: '../../tsconfig.json',
      include: ['./src/**/*.ts', './src/**/*.vue']
    }),
  ],

  build: {
    outDir: 'ak',
    minify: true,
    cssMinify: true,

    rollupOptions: {
      external: ['vue'],
      output: [
        {
          format: 'es',
          entryFileNames: '[name].mjs',
          preserveModules: true,
          exports: 'named',
          dir: '../ak/es',
        },
        {
          format: 'cjs',
          entryFileNames: '[name].js',
          preserveModules: true,
          exports: 'named',
          dir: '../ak/lib',
        },
      ],
    },

    lib: {
      entry: './index.ts',
      name: 'ak',
      fileName: 'ak',
      formats: ['es', 'cjs', 'umd'],
    },
  },

  resolve: {
    alias: {
      '~': path.resolve(__dirname),
    },
    extensions: ['css', 'scss', 'ts', 'vue'],
  },

  css: {
    preprocessorOptions: {
      css: {
        additionalData: '@import "~/index.css";',
      },
      scss: {
        additionalData: '@import "~/index.scss";',
      },
    },
  },
});
