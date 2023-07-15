/* eslint-disable no-console */
// 配置  "typescript.validate.enable": false(这个文件将不会有类型提示) 或则 不写后缀文件可解决 不支持导入ts结尾得报错

import { XMLHttpRequestSelf } from './proxyXhr/index'


window.addEventListener('message', (data) => {
  console.log('script接受消息', data)
})

const currentXhr = {
  status: 200,
  switch: true,
  originStatus: 200,
  id: 'xx',
  url: '',
  responseData: {
    showReality: false,
    mock: {
      responseText: '',
    },
    reality: {
      responseText: '',
    },
  },
  requestHeader: {},
  requestData: {},
}
const xhr = new XMLHttpRequestSelf()

xhr.setProxy()

/**
 *
 * @param target
 * @description 修改代理可读属性
 */
xhr.onBeforeProxy = function (target: XMLHttpRequest) {
  target.timeout = 2000
}

/**
 *
 * @param target
 * @param key
 * @returns
 * @description 返回数据前的回调函数，可使用模拟数据返回给客户端渲染
 */
xhr.onBeforeGetAttr = function (target: XMLHttpRequests, key: string) {
  if (key === 'status') return currentXhr.status
  return target[key]
}

xhr.onload = function () {
  console.log('加载完成,上报')
  //  sendMessage('xhr-upload', { data: currentXhr }, { context: 'background', tabId: 0 })
}
xhr.onerror = function () {
  console.log('加载失败')
}
