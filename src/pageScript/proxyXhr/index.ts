/* eslint-disable no-console */
// /**
//  * xhr代理类
//  * @class XhrProxy
//  * 能够代理xhr的所有属性方法，并且拦截了on开头的属性

import { XMLHttpRequestOnly } from './type'

//  */
const OriginXhr = window.XMLHttpRequest
export class XMLHttpRequestSelf extends XMLHttpRequest {
  private OriginXhr = window.XMLHttpRequest
  private originXhr = new OriginXhr()
  public defaultStatus = 200
  public proxyAttr = ['status', 'response', 'responseText']

  public onBeforeGetAttr: ((target: XMLHttpRequest, key: string) => void) | undefined
  public onBeforeProxy: ((target: XMLHttpRequest) => void) | undefined

  constructor() {
    super()
    console.log(this, '用户的实例')
    return this
  }

  open(method: string, url: string | URL): void {
    console.log(this, '打开链接', url)

    this.open(method, url)
  }

  send(body?: Document | XMLHttpRequestBodyInit | null): void {
    try {
      this.send(body)
      console.log(body, '发送数据')
    } catch (error) {
      console.log(error, '发送失败')
    }
  }

  setRequestHeader(key: string, value: string): void {
    console.log(this, 'setRequestHeader执行', key, value)
    this.setRequestHeader(key, value)
  }

  getAllResponseHeaders(): string {
    console.log(this, 'getAllResponseHeaders')
    return this.getAllResponseHeaders()
  }

  // onload: (this: XMLHttpRequest, ev: ProgressEvent<EventTarget>) => any = function () {
  //   console.log(this, '加载完成')
  // }

  // onreadystatechange: (this: XMLHttpRequest, ev: Event) => any = function (ev) {
  //   console.log('监听链接', ev)
  // }

  // onerror: (this: XMLHttpRequest, ev: Event) => any = function () {
  //   console.log(this, '加载失败')
  // }

  addEventListeners(): void {
    this.onload && this.originXhr.addEventListener('load', this.onload)
    this.onreadystatechange && this.originXhr.addEventListener('readystatechange', this.onreadystatechange)
    this.onerror && this.originXhr.addEventListener('error', this.onerror)
  }

  // 代理event事件
  proxyEvent(event: Event, proxy: XMLHttpRequest): Event {
    return new Proxy(event, {
      get: (targetEvent: Event, key: keyof Event) => {
        if (key === 'currentTarget' || key === 'target' || key === 'srcElement') {
          console.log('访问事件的代理currentTaget', proxy)
          return proxy
        }
        return targetEvent
      },
    })
  }

  setProxy() {
    console.log(this, 'setProxy', this.originXhr)
    const proxy = new Proxy(this.OriginXhr, {
      // construct方法用于拦截new命令，
      construct: (T) => {
        // 每次都要实例一个新的代理对象，不然有些接口会被取消掉
        this.originXhr = new T()

        console.log('开始代理', T)
        // 添加监听事件到当前的this.originXhr
        this.onBeforeProxy && this.onBeforeProxy(this.originXhr)
        this.addEventListeners()
        return new Proxy(this.originXhr, {
          get: (target: XMLHttpRequest, key: keyof XMLHttpRequest) => {
            const type = typeof target[key]
            console.log(target, key, 'get')
            // 开启代理默认状态设置为两百
            if (type === 'function' && this[key]) {
              // 绑定send 和open方法 用于修改这个方法的参数
              return this[key].bind(this.originXhr)
            } else if (this.proxyAttr.includes(key)) {
              // 当读取 status response responseText 返回模拟数据
              return this.onBeforeGetAttr && this.onBeforeGetAttr(target, key)
            }

            return target[key]
          },
          set: (target: XMLHttpRequests, key: keyof XMLHttpRequestOnly, value, receiver) => {
            // 绑定用户设置的监听方法 比如 onreadystatechange (先会执行代理上onreadystatechange )
            console.log(target, key, value, 'set')
            try {
              if (typeof value === 'function') {
                target[key as string] = (arg: any) => {
                  const isEvent = arg instanceof Event
                  console.log(isEvent, '是否是事件')
                  // 事件里的currentTarget 还是指向的是原生origin,在进行事件的代理
                  if (isEvent) arg = this.proxyEvent(arg, receiver)
                  value.call(receiver, arg)
                }
              } else {
                return Reflect.set(target, key, value)
              }
            } catch (error) {
              console.log(error, key, value, 'set error')
            }
            return true
          },
        })
      },
    })

    window.XMLHttpRequest = proxy
  }

  createPorxy() {
    window.XMLHttpRequest = OriginXhr
  }
}
