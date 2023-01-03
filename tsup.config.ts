import { exec } from 'child_process'

import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/background', 'src/content', 'src/pageScript'],
  splitting: true,
  format: 'iife',
  sourcemap: false,
  treeshake: true,
  clean: true,
  loader: {
    '.css': 'css',
  },
  onSuccess: async () => {
    exec(`esno scripts/mvsw.ts ${process.env.NODE_ENV}`, (_error, stdout, stderr) => {
      // eslint-disable-next-line no-console
      console.log('信息', stderr, stdout)
      exec(`esno scripts/prepare.ts ${process.env.NODE_ENV}`)
    })
  },
  outDir: `extension/${process.env.NODE_ENV}/dist`,
})
