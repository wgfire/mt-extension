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
      // 设置left right top bottom 等拖拽元素
      this.createControlDom()
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

  // 创建8个大小控制器
  createControlDom() {
    const leftControl = $('<div class="drag drag-left-control"></div>')
    const rightControl = $('<div class="drag drag-right-control"></div>')
    const topControl = $('<div class="drag drag-top-control"></div>')
    const bottomControl = $('<div class="drag drag-bottom-control"></div>')

    this.element.append(rightControl)
    this.element.append(leftControl)
    this.element.append(topControl)
    this.element.append(bottomControl)
    this.setBarControl(leftControl, 'left')
    this.setBarControl(rightControl, 'right')
    this.setBarControl(topControl, 'top')
    this.setBarControl(bottomControl, 'bottom')
  }
  // left添加控制器
  setBarControl(barElement, type) {
    barElement.mouseenter((e) => $(document).unbind('mousemove'))
    barElement.mouseleave((e) => $(document).unbind('mousemove'))
    barElement.mousedown((e) => {
      console.log(e)
      this.startX = e.pageX
      this.startY = e.pageY
      setTimeout(() => {
        $(document).mousemove((e) => {
          if (type === 'left' || type === 'right') {
            this.setElementWidth(e, type)
          } else {
            this.setElementHeight(e, type)
          }
        })
      }, 100)
    })
    $(document).mouseup((e) => {
      console.log(e, '取消')
      $(document).unbind('mousemove')
    })
  }
  //设置元素的宽度
  setElementWidth(e, type) {
    const step = type == 'left' ? this.startX - e.pageX : e.pageX - this.startX
    const elementWidth = this.element.width()
    const setWidth = elementWidth + step
    const offsetLeft = this.element.offset().left
    if (type === 'left') {
      const right = window.screen.width - offsetLeft - elementWidth
      // this.element.attr('style', `width:${setWidth}px;right:${right}px`)
      this.element.css('width', setWidth)
      this.element.css('right', right)
    } else {
      this.element.css('width', setWidth)
      this.element.css('left', offsetLeft)
      // this.element.attr('style', `width:${setWidth}px;left:${offsetLeft}px`)
    }
    this.startX = e.pageX
  }
  // 设置元素的高度
  setElementHeight(e, type) {
    const step = type == 'top' ? this.startY - e.pageY : e.pageY - this.startY
    const elementHeight = this.element.height()
    const setHeight = elementHeight + step
    const offsetTop = this.element.offset().top
    if (type === 'top') {
      const bottom = window.screen.height - offsetTop - elementHeight
      this.element.attr('style', `height:${setHeight}px;bottom:${bottom}px`)
    } else {
      this.element.attr('style', `height:${setHeight}px;top:${offsetTop}px`)
    }
    this.startY = e.pageY
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
