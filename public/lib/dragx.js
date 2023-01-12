class DragElement {
  constructor(selector) {
    const element = $(selector)
    if (element) {
      this.element = element
      this.startX = 0 // 移动元素的初始x坐标，用于上下文取值方便
      this.startY = 0
      this.setHeaderListener()
    } else {
      throw new Error('未找到元素，请检查选择器')
    }
  }

  // 给头部加上拖拽监听器,不能直接获取iframe里元素，只能在外部创建控制元素
  setHeaderListener() {
    const header = $('<div class="drag-header"></div>')
    this.element.append(header)
    header.mouseenter(() => header.unbind('mousemove'))
    header.mouseenter(() => header.unbind('mousemove'))
    header.mousedown((e) => {
      this.startX = e.offsetX
      this.startY = e.offsetY
      setTimeout(() => {
        header.mousemove(this.moveBody.bind(this))
      }, 100)
    })
    header.mouseup(() => {
      header.unbind('mousemove')
    })
  }

  // 移动整个div
  moveBody(e) {
    const { top, left } = this.element.offset()
    const distanceX = left - (this.startX - e.offsetX)
    const distanceY = top - (this.startY - e.offsetY)
    this.element.css('left', distanceX)
    this.element.css('top', distanceY)
  }

  //
  // 创建8个大小控制器
  createControlDom() {}
  // 设置监听器
  setDomListener(dom, eventName, type, callback) {
    return type === 'add' ? dom.addEventListener(eventName, callback.bind(this)) : dom.removeEventListener(eventName, callback.bind(this))
  }
}

setTimeout(() => {
  new DragElement('.mt-iframe-large')
}, 16)
