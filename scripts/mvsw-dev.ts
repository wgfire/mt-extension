import { resolve } from 'path'
import fs from 'fs-extra'
import { logger } from './utils'
;(async () => {
  try {
    // eslint-disable-next-line no-console
    console.log('开始移动', process.argv[2])
    await fs.copy(resolve('public'), resolve('extension/dev/assets'), {
      overwrite: true,
    })
    await fs.move(resolve('extension/dev/dist/background/index.js'), resolve('extension/dev/background.js'), { overwrite: true })
    await fs.move(resolve('extension/dev/dist/content'), resolve('extension/dev/content'), { overwrite: true })
    await fs.move(resolve('extension/dev/dist/pageScript'), resolve('extension/dev/pageScript'), { overwrite: true })
    await fs.remove(resolve('extension/dev/dist'))

    // eslint-disable-next-line no-console
    logger('BUILD:SW', 'Moved service-worker success!')
  } catch (err) {
    console.error('移动文件失败', err)
  }
})()
