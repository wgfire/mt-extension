(function() {
	// 声明构造函数
	function Drag(elId, title, content) {
		// 创建拖拽box(默认id为helpDocBox)
		if ($('#' + elId).length > 0) {
			alert(3, "此元素已存在，请更换id！");
			return false;
		} else {
			$('body').append('<div id="' + elId + '"></div>');
			this.el = $('#' + elId)[0];
		}
		// 拖拽对象的标题
		this.title = title;
		// 开始拖动时,鼠标的位置
		this.startX = 0;
		this.startY = 0;
		// 开始拖动时,拖动元素的tanslate
		this.sourceX = 0;
		this.sourceY = 0;
		// 开始拖拽时,元素的宽和高以及drager
		this.width = 0;
		this.height = 0;
		this.drager = "";
		// 拖拽过程中上一次鼠标的位置
		this.dragX = 0;
		this.dragY = 0;
		this.init(content);
	}
	
	// 添加原型方法
	Drag.prototype = {
		constructor: Drag,
		init: function(content) {
			// 构建必要的html结构
			this.buildHtml(content);
			this.setDrag();
			// 默认隐藏
//			$(this.el).css('display', 'none');
		},
		buildHtml: function(content) {
			$(this.el).addClass('custom-drag-control');
			var html = `<span class="drager top-left angle" data-direct="topLeft"></span>
						<span class="drager top-right angle" data-direct="topRight"></span>
						<span class="drager bottom-left angle" data-direct="bottomLeft"></span>
						<span class="drager bottom-right angle" data-direct="bottomRight"></span>
						<span class="drager top border" data-direct="top"></span>
						<span class="drager right border" data-direct="right"></span>
						<span class="drager bottom border" data-direct="bottom"></span>
						<span class="drager left border" data-direct="left"></span>
						<div class="head">` + this.title + `<span>x</span></div>
						<div class="body">` + content + `</div>`;
			$(this.el).html(html);
		},
		setDrag: function() {
			var self = this;
			// 绑定点击关闭事件
			$(self.el).find('.head span').on('click', function(event) {
				event.stopPropagation();
				$(self.el).css('display', 'none');
			});
			// 给head绑定拖拽位置监听
			self.el.getElementsByClassName("head")[0].addEventListener('mousedown', start, false);
			function start(event) {
				
				$(self.el).attr('onselectstart', "return false;");
				
				self.startX = event.pageX;
				self.startY = event.pageY;
					
				var pos = self.getPosition();
					
				self.sourceX = pos.x;
				self.sourceY = pos.y;

				document.addEventListener('mousemove', move, false);
				document.addEventListener('mouseup', end, false);
			}

			function move(event) {
				var currentX = event.pageX;
				var currentY = event.pageY;

				var distanceX = currentX - self.startX;
				var distanceY = currentY - self.startY;

				self.setPosition({
					x: (self.sourceX + distanceX).toFixed(),
					y: (self.sourceY + distanceY).toFixed()
				})
			}

			function end(event) {
				$(self.el).removeAttr('onselectstart');
				document.removeEventListener('mousemove', move);
				document.removeEventListener('mouseup', end);
			}
			
			// 给八个拖拽点绑定拖拽尺寸监听
			$(self.el).find('.drager').on('mousedown', resizeStart);
			function resizeStart() {
				$(self.el).attr('onselectstart', "return false;");
				self.startX = event.pageX;
				self.startY = event.pageY;
				
				self.dragX = event.pageX;
				self.dragY = event.pageY;	
				
				var pos = self.getPosition();
					
				self.sourceX = pos.x;
				self.sourceY = pos.y;
				
				self.width = self.getSize().w;
				self.height = self.getSize().h;
				
				document.addEventListener('mousemove', resizeMove, false);
				document.addEventListener('mouseup', resizeEnd, false);
			}
			
			function resizeMove(event) {
				var distanceX = event.pageX - self.dragX;
				var distanceY = event.pageY - self.dragY;
				
				self.drager = $(event.target).data("direct") ? $(event.target).data("direct") : self.drager;
				self.setSize({
					x: distanceX.toFixed(),
					y: distanceY.toFixed()
				});
				// 更新上一次拖拽鼠标的位置
				self.dragX = event.pageX;
				self.dragY = event.pageY;
			}
			
			function resizeEnd() {
				$(self.el).removeAttr('onselectstart');
				document.removeEventListener('mousemove', resizeMove);
				document.removeEventListener('mouseup', resizeEnd);
			}
		},
		getPosition: function() {
			var transformValue = document.defaultView.getComputedStyle(this.el, false)["transform"];
			if(transformValue == 'none') {
				return {x: 0, y: 0};
			} else {
				var temp = transformValue.match(/-?\d+/g);
				return {
					x: parseInt(temp[4].trim()),
					y: parseInt(temp[5].trim())
				}
			}
		},
		getSize: function() {
			var widthValue = document.defaultView.getComputedStyle(this.el, false)["width"];
			var heightValue = document.defaultView.getComputedStyle(this.el, false)["height"];
			return {w: parseInt(widthValue), h: parseInt(heightValue)};
		},
		setPosition: function(pos) {
			this.el.style["transform"] = 'translate('+ pos.x +'px, '+ pos.y +'px)';
		},
		setSize: function(pos) { // className: 拖拽类型(四边拖拽或者四角拖拽)
			var self = this;
			var pos = {x: parseInt(pos.x), y: parseInt(pos.y)};
			// 当前的拖拽位置
			var translateX = self.getPosition().x;
			var translateY = self.getPosition().y;
			switch (self.drager) {
				case "top":
					if ((self.height - pos.y) >= 100) {
						self.height -= pos.y;
						this.el.style["height"] = self.height + 'px';
					}
					break;
				case "right":
					if ((self.width + pos.x) >= 100) {
						self.width += pos.x;
						this.el.style["width"] = self.width + 'px';
						this.el.style["transform"] = 'translate('+ (translateX + pos.x) +'px, '+ translateY +'px)';
					}
					break;
				case "bottom":
					if ((self.height + pos.y) >= 100) {
						self.height += pos.y;
						this.el.style["height"] = self.height + 'px';
						this.el.style["transform"] = 'translate('+ translateX + 'px, ' + (translateY + pos.y) +'px)';
					}
					break;
				case "left":
					if ((self.width - pos.x) >= 100) {
						self.width -= pos.x;
						this.el.style["width"] = self.width + 'px';
					}
					break;
				case "topLeft":
					if ((self.width - pos.x) >= 100) {
						self.width -= pos.x;
						this.el.style["width"] = self.width + 'px';
					}
					if ((self.height - pos.y) >= 100) {
						self.height -= pos.y;
						this.el.style["height"] = self.height + 'px';
					}
					break;
				case "topRight":
					if ((self.height - pos.y) >= 100) {
						self.height -= pos.y;
						this.el.style["height"] = self.height + 'px';
					}
					if ((self.width + pos.x) >= 100) {
						self.width += pos.x;
						this.el.style["width"] = self.width + 'px';
						this.el.style["transform"] = 'translate('+ (translateX + pos.x) +'px, '+ translateY +'px)';
					}
					break;
				case "bottomLeft":
					if ((self.width - pos.x) >= 100) {
						self.width -= pos.x;
						this.el.style["width"] = self.width + 'px';
					}
					if ((self.height + pos.y) >= 100) {
						self.height += pos.y;
						this.el.style["height"] = self.height + 'px';
						this.el.style["transform"] = 'translate('+ translateX + 'px, ' + (translateY + pos.y) +'px)';
					}
					break;
				case "bottomRight":
					if ((self.width + pos.x) >= 100) {
						self.width += pos.x;
						this.el.style["width"] = self.width + 'px';
						this.el.style["transform"] = 'translate('+ (translateX + pos.x) +'px, '+ translateY +'px)';
					}
					if ((self.height + pos.y) >= 100) {
						self.height += pos.y;
						this.el.style["height"] = self.height + 'px';
						this.el.style["transform"] = 'translate('+ translateX + 'px, ' + (translateY + pos.y) +'px)';
					}
					if ((self.height + pos.y) >= 100 && (self.width + pos.x) >= 100) {
						this.el.style["transform"] = 'translate('+ (translateX + pos.x) + 'px, ' + (translateY + pos.y) +'px)';
					}
					break;
				default:
					break;
			}
		}
	}
	// 暴露Drag类
	window.Drag = Drag;
})();