function PhotoGridBox (insertPoint, imgs, imgOnClick, panelHTMLSetter, rowGap, colGap) {
  this.insertPoint = insertPoint
  this.imgLoader = new Image()
  this.dom = null
  this.imgs = []
  this.rowHeight = this._getRowHeight()
  this.rowGap = rowGap ? rowGap : 3
  this.colGap = colGap ? colGap : 3
  this.rowLength = 0
  this.showUnCompeleteRow = false
  this.compeleteIndex = -1
  this.lastRenderedWindowOffsetWidth = window.innerWidth
  this.minImgWidth = this._getMinImgWidth()

  this._initDOM()
  if (imgOnClick) {
    this.imgOnClick = imgOnClick
  }
  if (panelHTMLSetter) {
    this.panelHTMLSetter = panelHTMLSetter
  }
  if (imgs) {
    this.appendImgs(imgs)
  }
}
PhotoGridBox.prototype._initDOM = function () {
  try {
    var uniqueClassName = 'photo-grid-box-' + +new Date()
    var className = 'photo-grid-box ' + uniqueClassName
    this.insertPoint.innerHTML = '<div class="'+ className +'"></div>'
    this.dom = document.querySelector('.' + uniqueClassName)
    this.dom.style.width = this.dom.offsetWidth + 'px'
  } catch (e) {
    console.error(e)
  }
}
PhotoGridBox.prototype._getRowHeight = function () {
  if (window.innerWidth <= 350) {
    return 200
  } else if (window.innerWidth <= 550) {
    return 250
  } else if (window.innerWidth <= 768) {
    return 270
  }
  return 280
}
PhotoGridBox.prototype._getMinImgWidth = function () {
  if (window.innerWidth <= 350) {
    return 130
  } else if (window.innerWidth <= 550) {
    return 150
  } else if (window.innerWidth <= 768) {
    return 180
  }
  return 200
}
PhotoGridBox.prototype.appendImgs = function (imgs) {
  if (Array.isArray(imgs) && imgs.length > 0) {
    var self = this
    imgs.map(function(img, index) {
      self.imgs.push(img)
    })
    this._render()
  } else {
    console.error('imgs should be an array with the elements of the src of the images(String).')
  }
}
PhotoGridBox.prototype._render = function () {
  var self = this
  if (!self.dom) self._initDOM()
  self._addWindowResizeEvent()
  var imgDOMs = document.querySelectorAll('.photo-block')
  var imgIndex = self.compeleteIndex + 1
  var imgsLength = self.imgs.length
  var imgLoader = self.imgLoader
  var tempRow = []
  var tempAccumulateWidth = 0
  imgLoader.onload = function () {
    var imgWidth = calcWidthByRowHeight(this.width, this.height)
    var imgAndGapWidth = imgWidth + self.colGap
    var element = createBlockElement(this.src, self.imgs[imgIndex], imgWidth, self.rowHeight, self.rowLength)
    var buffer = self.minImgWidth
    addElementToTempRow(element, imgAndGapWidth)
    if (tempAccumulateWidth + buffer >= self.dom.offsetWidth) {
      adjustImagesInTheRow()
      handleCompleteRow()
    }
    loadImage(++imgIndex, imgsLength)
  }
  imgLoader.onerror = function (e) {
    loadImage(++imgIndex, imgsLength)
  }
  loadImage(imgIndex, imgsLength)

  function loadImage(imgIndex, imgsLength) {
    removeIfImgBlockExist(imgIndex)
    if (imgIndex === imgsLength) {
      if (tempAccumulateWidth) {
        handleUnCompleteRow()
      }
      return
    }
    var imgSrc = self.imgs[imgIndex]
    if (imgSrc && typeof imgSrc === 'object') {
      if (imgSrc.src) {
        imgSrc = imgSrc.src
      } else {
        console.error('Invalid format: elements in imgs should be a string or an object with src attribute. Picture in index: ' + imgIndex + ' will not be shown.')
      }
    }
    imgLoader.src = imgSrc
  }
  function removeIfImgBlockExist(imgIndex) {
    if(imgDOMs[imgIndex]) {
      imgDOMs[imgIndex].remove()
    }
  }
  function calcWidthByRowHeight(width, height) {
    var ratio = self.rowHeight / height
    var result = Math.round(width * ratio)
    var buffer = 100
    if (result < self.minImgWidth + buffer) {
      result = self.minImgWidth
    }
    return result
  }
  function createBlockElement(imgSrc, imgConfig, imgWidth, imgHeight, rowIndex) {
    var element = document.createElement('div')
    var rowGap = self.rowGap * rowIndex
    var top = self.rowHeight * rowIndex + rowGap
    var left = tempAccumulateWidth
    element.style.backgroundImage = 'url('+ imgSrc +')'
    element.style.backgroundColor = 'rgba(0,0,0,0.3)';
    element.style.backgroundSize = '100%'
    element.style.borderRadius = '10px'
    element.style.fontSize = '12px'
    if(/svg$/i.test(imgSrc)) {
      element.style.backgroundSize = 'contain'
      element.style.boxShadow = '0 0 20px #342056'
      element.style.transform = 'scale(0.85)'
      element.style.border = '1px solid #342056'
      element.style.fontSize = '14px'
    }
    element.className = 'photo-block'
    element.style.width = imgWidth + 'px'
    element.style.height = imgHeight + 'px'
    element.style.top = top + 'px'
    element.style.left = left + 'px'
    if (self.imgOnClick) {
      element.onclick = function (e) {
        self.imgOnClick(e, imgConfig)
      }
      element.className += ' photo-block--clickable'
    }
    element.innerHTML = createBlockElementChildren(imgConfig)
    return element
  }
  function createBlockElementChildren(imgConfig) {
    var htmlString = '<div class="photo-block__panel">'
    if (self.panelHTMLSetter) {
      htmlString += self.panelHTMLSetter(imgConfig)
    }
    htmlString += '</div>'
    return htmlString
  }
  function addElementToTempRow(element, imgAndGapWidth) {
    tempAccumulateWidth += imgAndGapWidth
    tempRow.push(element)
  }
  function adjustImagesInTheRow() {
    var pad = self.dom.offsetWidth - (tempAccumulateWidth - self.colGap)
    var adjustElementsIndex = []
    for (var i = 0; i < tempRow.length; i++) {
      if (pad > 0) {
        adjustElementsIndex.push(i)
      } else {
        var element = tempRow[i]
        var elementWidth = parseFloat(element.style.width.replace('px', ''))
        if (elementWidth > self.minImgWidth) {
          adjustElementsIndex.push(i)
        }
      }
    }
    var padPerBlock = pad / adjustElementsIndex.length
    var accumulateWidth = 0
    for (var i = 0; i < tempRow.length; i++) {
      var element = tempRow[i]
      var width = parseFloat(element.style.width.replace('px', ''))
      if (adjustElementsIndex.includes(i)) {
        width += padPerBlock
        element.style.width = width + 'px'
      }
      element.style.left = accumulateWidth + 'px'
      accumulateWidth += width + self.colGap
    }
  }
  function handleCompleteRow() {
    renderRow()
    resetTempForNextRow()
  }
  function handleUnCompleteRow() {
    if (self.showUnCompeleteRow || self.rowLength === 0) {
      renderRow(true)
    }
    resetTempForNextRow()
  }
  function renderRow(isRowUnComplete) {
    var rowLength = 0
    if (!isRowUnComplete) {
      self.rowLength += 1
    } else {
      rowLength += 1
    }
    rowLength += self.rowLength
    var accumulateBlockHeight = self.rowHeight * rowLength + self.rowGap * (rowLength - 1)
    self.dom.style.height = parseFloat(accumulateBlockHeight) + 'px'
    tempRow.map(function(element) {
      self.dom.append(element)
      if (!isRowUnComplete) self.compeleteIndex += 1
    })
  }
  function resetTempForNextRow() {
    tempRow = []
    tempAccumulateWidth = 0
  }
}
PhotoGridBox.prototype.setImgOnClick = function (imgOnClick) {
  if (imgOnClick) {
    this.imgOnClick = imgOnClick
  }
  this._rerender(this)
}
PhotoGridBox.prototype.setPanelHTMLSetter = function (panelHTMLSetter) {
  if (panelHTMLSetter) {
    this.panelHTMLSetter = panelHTMLSetter
  }
  this._rerender(this)
}
PhotoGridBox.prototype.setShowUnCompleteRow = function (value) {
  if (typeof value === 'boolean') this.showUnCompeleteRow = value
}
PhotoGridBox.prototype._rerender = function (self) {
  this.rowLength = 0
  this.rowHeight = this._getRowHeight()
  this.minImgWidth = this._getMinImgWidth()
  this.compeleteIndex = -1
  self.dom.style.width = null
  this._render()
}
PhotoGridBox.prototype._addWindowResizeEvent = function () {
  if (this.isResizeEventAdded) return
  var self = this
  var delay = 300
  var timeout
  this._resizeEvent = function () {
    clearTimeout(timeout)
    timeout = setTimeout(function() {
      if (self.lastRenderedWindowOffsetWidth !== window.innerWidth) {
        self._rerender(self)
        self.lastRenderedWindowOffsetWidth = window.innerWidth
      }
    }, delay)
  }
  window.addEventListener('resize', this._resizeEvent)
  this.isResizeEventAdded = true
}
PhotoGridBox.prototype._removeWindowResizeEvent = function () {
  window.removeEventListener('resize', this._resizeEvent)
  this.isResizeEventAdded = false
}
PhotoGridBox.prototype.destroy = function () {
  this._removeWindowResizeEvent()
  this.rowLength = 0
  this.compeleteIndex = -1
  this.dom.remove()
  this.dom = null
  this.imgs = []
}


/*********************************************************************************************************************
 *
 * notification
 *
 */
!function (t) {
  function n(i) {
    if (e[i]) return e[i].exports;
    var o = e[i] = { i: i, l: !1, exports: {} };
    return t[i].call(o.exports, o, o.exports, n), o.l = !0, o.exports
  }

  var e = {};
  n.m = t, n.c = e, n.d = function (t, e, i) {
    n.o(t, e) || Object.defineProperty(t, e, { configurable: !1, enumerable: !0, get: i })
  }, n.n = function (t) {
    var e = t && t.__esModule ? function () {
      return t.default
    } : function () {
      return t
    };
    return n.d(e, "a", e), e
  }, n.o = function (t, n) {
    return Object.prototype.hasOwnProperty.call(t, n)
  }, n.p = "", n(n.s = 0)
}([function (t, n, e) {
  e(1), t.exports = e(4)
}, function (t, n, e) {
  "use strict";
  var i = Object.assign || function (t) {
    for (var n = 1; n < arguments.length; n++) {
      var e = arguments[n];
      for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i])
    }
    return t
  };
  e(2);
  var o = e(3);
  !function (t) {
    function n(t) {
      return t = i({}, c, t), function (t) {
        return ["nfc-top-left", "nfc-top-right", "nfc-bottom-left", "nfc-bottom-right"].indexOf(t) > -1
      }(t.positionClass) || (console.warn("An invalid notification position class has been specified."), t.positionClass = c.positionClass), t.onclick && "function" != typeof t.onclick && (console.warn("Notification on click must be a function."), t.onclick = c.onclick), "number" != typeof t.showDuration && (t.showDuration = c.showDuration), (0, o.isString)(t.theme) && 0 !== t.theme.length || (console.warn("Notification theme must be a string with length"), t.theme = c.theme), t
    }

    function e(t) {
      return t = n(t), function () {
        var n = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}, e = n.title, i = n.message,
          c = r(t.positionClass);
        if (!e && !i) return console.warn("Notification must contain a title or a message!");
        var a = (0, o.createElement)("div", "ncf", t.theme);
        if (!0 === t.closeOnClick && a.addEventListener("click", function () {
          return c.removeChild(a)
        }), t.onclick && a.addEventListener("click", function (n) {
          return t.onclick(n)
        }), t.displayCloseButton) {
          var s = (0, o.createElement)("button");
          s.innerText = "X", !1 === t.closeOnClick && s.addEventListener("click", function () {
            return c.removeChild(a)
          }), (0, o.append)(a, s)
        }
        if ((0, o.isString)(e) && e.length && (0, o.append)(a, (0, o.createParagraph)("ncf-title")(e)), (0, o.isString)(i) && i.length && (0, o.append)(a, (0, o.createParagraph)("nfc-message")(i)), (0, o.append)(c, a), t.showDuration && t.showDuration > 0) {
          var l = setTimeout(function () {
            c.removeChild(a), 0 === c.querySelectorAll(".ncf").length && document.body.removeChild(c)
          }, t.showDuration);
          (t.closeOnClick || t.displayCloseButton) && a.addEventListener("click", function () {
            return clearTimeout(l)
          })
        }
      }
    }

    function r(t) {
      var n = document.querySelector("." + t);
      return n || (n = (0, o.createElement)("div", "ncf-container", t), (0, o.append)(document.body, n)), n
    }

    var c = {
      closeOnClick: !0,
      displayCloseButton: !1,
      positionClass: "nfc-top-right",
      onclick: !1,
      showDuration: 3500,
      theme: "success"
    };
    t.createNotification ? console.warn("Window already contains a create notification function. Have you included the script twice?") : t.createNotification = e
  }(window)
}, function (t, n, e) {
  "use strict";
  !function () {
    function t(t) {
      this.el = t;
      for (var n = t.className.replace(/^\s+|\s+$/g, "").split(/\s+/), i = 0; i < n.length; i++) e.call(this, n[i])
    }

    if (!(void 0 === window.Element || "classList" in document.documentElement)) {
      var n = Array.prototype, e = n.push, i = n.splice, o = n.join;
      t.prototype = {
        add: function (t) {
          this.contains(t) || (e.call(this, t), this.el.className = this.toString())
        }, contains: function (t) {
          return -1 != this.el.className.indexOf(t)
        }, item: function (t) {
          return this[t] || null
        }, remove: function (t) {
          if (this.contains(t)) {
            for (var n = 0; n < this.length && this[n] != t; n++) ;
            i.call(this, n, 1), this.el.className = this.toString()
          }
        }, toString: function () {
          return o.call(this, " ")
        }, toggle: function (t) {
          return this.contains(t) ? this.remove(t) : this.add(t), this.contains(t)
        }
      }, window.DOMTokenList = t, function (t, n, e) {
        Object.defineProperty ? Object.defineProperty(t, n, { get: e }) : t.__defineGetter__(n, e)
      }(Element.prototype, "classList", function () {
        return new t(this)
      })
    }
  }()
}, function (t, n, e) {
  "use strict";
  Object.defineProperty(n, "__esModule", { value: !0 });
  var i = n.partial = function (t) {
    for (var n = arguments.length, e = Array(n > 1 ? n - 1 : 0), i = 1; i < n; i++) e[i - 1] = arguments[i];
    return function () {
      for (var n = arguments.length, i = Array(n), o = 0; o < n; o++) i[o] = arguments[o];
      return t.apply(void 0, e.concat(i))
    }
  }, o = (n.append = function (t) {
    for (var n = arguments.length, e = Array(n > 1 ? n - 1 : 0), i = 1; i < n; i++) e[i - 1] = arguments[i];
    return e.forEach(function (n) {
      return t.appendChild(n)
    })
  }, n.isString = function (t) {
    return "string" == typeof t
  }, n.createElement = function (t) {
    for (var n = arguments.length, e = Array(n > 1 ? n - 1 : 0), i = 1; i < n; i++) e[i - 1] = arguments[i];
    var o = document.createElement(t);
    return e.length && e.forEach(function (t) {
      return o.classList.add(t)
    }), o
  }), r = function (t, n) {
    return t.innerText = n, t
  }, c = function (t) {
    for (var n = arguments.length, e = Array(n > 1 ? n - 1 : 0), c = 1; c < n; c++) e[c - 1] = arguments[c];
    return i(r, o.apply(void 0, [t].concat(e)))
  };
  n.createParagraph = function () {
    for (var t = arguments.length, n = Array(t), e = 0; e < t; e++) n[e] = arguments[e];
    return c.apply(void 0, ["p"].concat(n))
  }
}, function (t, n) {
}]);


/**************************
 *  End of File
 **************************/
const formatDateToYYYYMMDDHHMMSS = (date)=>{
    let d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    let year = d.getFullYear();
    let hour = '' + d.getHours();
    let minute = '' + d.getMinutes();
    let second = '' + d.getSeconds();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    if (hour.length < 2) hour = '0' + hour;
    if (minute.length < 2) minute = '0' + minute;
    if (second.length < 2) second = '0' + second;

    return [year, month, day].join('-') + ' ' + [hour, minute, second].join(':');
}
const element = document.querySelector('#container');
new PhotoGridBox(element, window.sortedFiles, (e, item) => {
    const classname = e.target.className;
    switch (classname) {
      case 'new':
        open(item.src);
        break;
      case 'copy':
        navigator.clipboard.writeText(JSON.stringify(item, '', 2));
        window.createNotification({
          closeOnClick: false,
          displayCloseButton: true,
          positionClass: 'nfc-top-right',
          showDuration: 5000,
          theme: 'success',
        })({
          title: 'Copy Success',
          message: JSON.stringify(item, '', 2),
        });
        break;
      default:
        break;
    }
  }, (item) => `
<div class="panel">
  <div>
    <span class="new">open</span>
    <span class="copy">copy</span>
  </div>
  <div>
    <span>${item.type || 'svg'}</span>
    <span>${item.sizeSummary}</span>
    <span>${item.width} x ${item.height}</span>
    <span>${item.fileName}</span>
    <span>${formatDateToYYYYMMDDHHMMSS(item.modifyDate)}</span>
  </div>
</div>`,
  10, 10);
