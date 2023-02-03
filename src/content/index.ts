/* eslint-disable no-new */
/* eslint-disable no-console */
import { onMessage, sendMessage } from 'webext-bridge'
import { createScript, createPopup, createStyle } from './createUtils'
import './index.css'
import './message'
// communication example: send previous tab title from background page
onMessage('tab-prev', ({ data }) => {
  console.log(`[vitesse-modernized-chrome-ext] Navigate from page "${data.title}"`)
})

document.addEventListener('readystatechange', () => {
  if (document.readyState === 'interactive') console.log(Date.now(), document.body)
})

const start = async () => {
  await createScript('pageScript/index.global.js')
  await createScript('assets/lib/jquery.min.js')
  await createStyle('assets/lib/drag.css')
  createPopup() // 创建交互界面
  await createScript('assets/lib/dragx.js')
  const title = await sendMessage('get-current-tab', { tabId: 0 }, { context: 'background', tabId: 0 })
  console.log(title, 'title')
}
start()
