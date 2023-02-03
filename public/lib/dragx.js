class DragElement {
  constructor(selector) {
    console.log(window.$, '$')
    const element = $(selector)
    this.keyWords = 'ShiftA'
    if (element) {
      this.element = element
      this.startX = 0 // 移动元素的初始x坐标，用于上下文取值方便
      this.startY = 0
      // 设置头部拖拽
      this.setHeaderListener()
      // 设置left right top bottom 等拖拽元素 //resize both 代替
    } else {
      new Error('未找到元素，请检查选择器')
    }
  }
  // 给头部加上拖拽监听器,不能直接获取iframe里元素，只能在外部创建控制元素
  setHeaderListener() {
    console.log(this.element)
    const header = $("<div class='drag drag-header'></div>")
    this.element.append(header)
    console.log(header, '头部')
    header.mouseenter((e) => header.unbind('mousemove'))
    header.mouseenter((e) => header.unbind('mousemove'))
    header.mousedown((e) => {
      console.log(e, '点击')
      this.startX = e.offsetX
      this.startY = e.offsetY
      setTimeout(() => {
        header.mousemove(this.moveBody.bind(this))
      }, 100)
    })
    header.mouseup((e) => {
      console.log('松开', e)
      header.unbind('mousemove')
    })
  }
  //移动整个div
  moveBody(e) {
    const { top, left } = this.element.offset()
    const distanceX = left - (this.startX - e.offsetX)
    const distanceY = top - (this.startY - e.offsetY)
    this.element.css('left', distanceX)
    this.element.css('top', distanceY)
  }
  // 监听键盘事件 shift a 关闭弹窗
  listenerKeydown() {
    let keys = []
    document.onkeydown = (e) => {
      keys.push(e.key)
    }
    document.onkeyup = (e) => {
      const keywords = keys.slice(-2).join('')
      if (keywords === this.keyWords) {
        this.element.fadeToggle()
      }
      keys = []
    }
  }
}

setTimeout(() => {
  new DragElement('.mt-iframe-large').listenerKeydown()
}, 16)

window.addEventListener('message', (e) => {
  console.log(e, 'darg')
})
