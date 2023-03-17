import { sendMessage, onMessage } from 'webext-bridge'

chrome.runtime.onInstalled.addListener((): void => {
  // eslint-disable-next-line no-console
  console.log('Extension installed')
})
let currentTabId = 0
const sendCurrentTab = async (tabId: number) => {
  const currentTab = await chrome.tabs.get(tabId)
  currentTabId = tabId
  if (!currentTab) return
  console.log('current tab', currentTab)
  chrome.storage.local.set({ currentTab })
  sendMessage('tab-prev', { title: currentTab.title }, { context: 'content-script', tabId: currentTabId })
}

// communication example: send previous tab title from background page
// see shim.d.ts for type decleration
chrome.tabs.onActivated.addListener(async ({ tabId }) => {
  sendCurrentTab(tabId)
})

// chrome.tabs.onCreated.addListener(async (tabId) => {
//   console.log(tabId, 'onCreated')
//   sendCurrentTab(tabId.id!)
// })

onMessage('get-current-tab', async () => {
  try {
    const tab = await chrome.tabs.get(currentTabId)
    return {
      title: tab?.id,
    }
  } catch {
    return {
      title: undefined,
    }
  }
})

onMessage('close-popup', () => {
  console.log('background接受')
})

chrome.runtime.onMessage.addListener((message, sender) => {
  console.log('background接受', message, sender)
})
