/* eslint-disable no-console */
import { onMessage } from 'webext-bridge'
import { createScript, createiframe } from './createUtils'
import './index.css'
// communication example: send previous tab title from background page
onMessage('tab-prev', ({ data }) => {
  console.log(`[vitesse-modernized-chrome-ext] Navigate from page "${data.title}"`)
})

document.addEventListener('readystatechange', () => {
  if (document.readyState === 'interactive') console.log(Date.now(), document.body)
})

const start = async () => {
  await createScript('pageScript/index.global.js')
  //  createiframe()
}
start()
