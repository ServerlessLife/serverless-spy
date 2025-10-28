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
  shims: true,
});
