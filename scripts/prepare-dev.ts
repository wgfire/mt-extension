// generate stub index.html files for dev entry
// import { resolve } from 'path'
import fs from 'fs-extra'
import chokidar from 'chokidar'
import { getManifest } from '../src/manifest'
import { r, PORT, IS_DEV, logger } from './utils'
/**
 * Stub index.html to use Vite in development
 */

async function stubIndexHtml() {
  const views = ['options', 'popup', 'devtools']

  for (const view of views) {
    await fs.ensureDir(r(`extension/dev/${view}`))
    let data = await fs.readFile(r(`src/${view}/index.html`), 'utf-8')
    data = data
      .replace('"./main.ts"', `"http://localhost:${PORT}/${view}/main.ts"`)
      .replace('<div id="app"></div>', '<div id="app">Vite server did not start</div>')
    await fs.writeFile(r(`extension/dev/${view}/index.html`), data, 'utf-8')
    logger('PRE', `stub ${view}`)
  }
}

export async function writeFiles() {
  await fs.ensureFile(r('extension/dev/manifest.json'))
  await fs.writeJSON(r('extension/dev/manifest.json'), await getManifest(), { spaces: 2 })

  logger('PRE', 'write manifest.json')
}

writeFiles()

if (IS_DEV) {
  stubIndexHtml()
  chokidar.watch(r('src/**/*.html')).on('change', () => {
    stubIndexHtml()
  })
  chokidar.watch([r('src/manifest.ts'), r('package.json')]).on('change', () => {
    writeFiles()
  })
}
