/* eslint-disable no-console */
/**
 * 创建dom
 */

export function createElement(attrs: Record<string, any>, elementName: keyof Pick<HTMLElementTagNameMap, 'iframe' | 'script' | 'div' | 'link'>) {
  const element = document.createElement(elementName)
  setAttribute(element, attrs)
  const root = document.documentElement
  root.append(element)
  return element
}

export function setAttribute(dom: HTMLElement, attrs: Record<string, any>) {
  Object.keys(attrs).forEach((key) => {
    dom.setAttribute(key, attrs[key])
  })
  return dom
}

export function createPopup() {
  const src = chrome.runtime.getURL('popup/index.html')
  const element = createElement(
    {
      class: 'mt-iframe-large',
      id: 'mt-iframe-large',
    },
    'div',
  )
  const elementIframe = createElement(
    {
      src,
      height: '100%',
      width: '100%',
      frameborder: 'none',
    },
    'iframe',
  )
  element.appendChild(elementIframe)
  return element
}
export async function createScript(src: string) {
  return new Promise((resolve, reject) => {
    const runtimeUrl = chrome.runtime.getURL(src)
    const element = createElement({ src: runtimeUrl, type: 'text/javascript', async: 'async' }, 'script')
    element.onload = function () {
      resolve(true)
    }
    element.onerror = function () {
      reject(new Error('加载失败'))
    }
  })
}
export async function createStyle(src: string) {
  return new Promise((resolve, reject) => {
    const runtimeUrl = chrome.runtime.getURL(src)
    const element = createElement({ href: runtimeUrl, type: 'text/css', rel: 'stylesheet' }, 'link')
    element.onload = function () {
      resolve(true)
    }
    element.onerror = function () {
      reject(new Error('加载失败'))
    }
  })
}

// document.addEventListener(
//   'DOMContentLoaded',
//   () => {
//     console.log('页面加载body', Date.now()) 后触发
//   },
//   false,
// )
