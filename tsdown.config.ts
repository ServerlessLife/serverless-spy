import { defineConfig } from 'tsdown';

export default defineConfig({
  outDir: './lib',
  entry: [
    './index.ts',
    'src/**/*.ts',
    'common/**/*.ts',
    'listener/**/*.ts',
    'cli/**/*.ts',
    '!cli/**/webServerlessSpy.ts',
    'functions/**/*.ts',
  ],
  unbundle: true,
  outputOptions: {
    banner: (chunk) =>
      chunk.fileName.endsWith('.mjs')
        ? 'const __dirname = import.meta.dirname;'
        : '',
  },
});
