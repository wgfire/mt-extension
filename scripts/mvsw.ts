import { resolve } from 'path'
import fs from 'fs-extra'
import { logger, ENV } from './utils'
;(async () => {
  try {
    // copy icon files
    await fs.copy(resolve('public'), resolve(`extension/${ENV}/assets`), {
      overwrite: true,
    })
    await fs.move(resolve(`extension/${ENV}/dist/background/index.global.js`), resolve(`extension/${ENV}/background.js`), { overwrite: true })
    await fs.move(resolve(`extension/${ENV}/dist/content`), resolve(`extension/${ENV}/content`), { overwrite: true })
    await fs.move(resolve(`extension/${ENV}/dist/pageScript`), resolve(`extension/${ENV}/pageScript`), { overwrite: true })
    await fs.remove(resolve(`extension/${ENV}/dist`))
    logger('BUILD:SW', 'Moved service-worker success!')
  } catch (err) {
    console.error('移动文件失败', err)
  }
})()
