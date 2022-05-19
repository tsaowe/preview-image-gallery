!(function(e, t) {
  if ("object" == typeof exports && "object" == typeof module)
    module.exports = t();
  else if ("function" == typeof define && define.amd) define([], t);
  else {
    var i = t();
    for (var n in i) ("object" == typeof exports ? exports : e)[n] = i[n];
  }
})(self, function() {
  return (function() {
    "use strict";
    var e = {
        d: function(t, i) {
          for (var n in i)
            e.o(i, n) &&
              !e.o(t, n) &&
              Object.defineProperty(t, n, { enumerable: !0, get: i[n] });
        },
        o: function(e, t) {
          return Object.prototype.hasOwnProperty.call(e, t);
        },
        r: function(e) {
          "undefined" != typeof Symbol &&
            Symbol.toStringTag &&
            Object.defineProperty(e, Symbol.toStringTag, { value: "Module" }),
            Object.defineProperty(e, "__esModule", { value: !0 });
        }
      },
      t = {};
    function i(e, t, i, n, o, r) {
      (this.insertPoint = e),
        (this.imgLoader = new Image()),
        (this.dom = null),
        (this.imgs = []),
        (this.rowHeight = this._getRowHeight()),
        (this.rowGap = o || 3),
        (this.colGap = r || 3),
        (this.rowLength = 0),
        (this.showUnCompeleteRow = !1),
        (this.compeleteIndex = -1),
        (this.lastRenderedWindowOffsetWidth = window.innerWidth),
        (this.minImgWidth = this._getMinImgWidth()),
        this._initDOM(),
        i && (this.imgOnClick = i),
        n && (this.panelHTMLSetter = n),
        t && this.appendImgs(t);
    }
    e.r(t),
      e.d(t, {
        PhotoGridBox: function() {
          return n;
        }
      }),
      (i.prototype._initDOM = function() {
        try {
          var e = "photo-grid-box-" + +new Date(),
            t = "photo-grid-box " + e;
          (this.insertPoint.innerHTML = '<div class="' + t + '"></div>'),
            (this.dom = document.querySelector("." + e)),
            (this.dom.style.width = this.dom.offsetWidth + "px");
        } catch (e) {
          console.error(e);
        }
      }),
      (i.prototype._getRowHeight = function() {
        return 50;
        // return window.innerWidth <= 350
        //   ? 200
        //   : window.innerWidth <= 550
        //   ? 250
        //   : window.innerWidth <= 768
        //   ? 270
        //   : 280;
      }),
      (i.prototype._getMinImgWidth = function() {
        return 50;
        // return window.innerWidth <= 350
        //   ? 130
        //   : window.innerWidth <= 550
        //   ? 150
        //   : window.innerWidth <= 768
        //   ? 180
        //   : 200;
      }),
      (i.prototype.appendImgs = function(e) {
        if (Array.isArray(e) && e.length > 0) {
          var t = this;
          e.map(function(e, i) {
            t.imgs.push(e);
          }),
            this._render();
        } else
          console.error(
            "imgs should be an array with the elements of the src of the images(String)."
          );
      }),
      (i.prototype._render = function() {
        var e = this;
        e.dom || e._initDOM(), e._addWindowResizeEvent();
        var t = document.querySelectorAll(".photo-block"),
          i = e.compeleteIndex + 1,
          n = e.imgs.length,
          o = e.imgLoader,
          r = [],
          s = 0;
        function h(i, n) {
          if (
            ((function(e) {
              t[e] && t[e].remove();
            })(i),
            i !== n)
          ) {
            var r = e.imgs[i];
            r &&
              "object" == typeof r &&
              (r.src
                ? (r = r.src)
                : console.error(
                    "Invalid format: elements in imgs should be a string or an object with src attribute. Picture in index: " +
                      i +
                      " will not be shown."
                  )),
              (o.src = r);
          } else
            s && ((e.showUnCompeleteRow || 0 === e.rowLength) && d(!0), l());
        }
        function d(t) {
          var i = 0;
          t ? (i += 1) : (e.rowLength += 1), (i += e.rowLength);
          var n = e.rowHeight * i + e.rowGap * (i - 1);
          (e.dom.style.height = parseFloat(n) + "px"),
            r.map(function(i) {
              e.dom.append(i), t || (e.compeleteIndex += 1);
            });
        }
        function l() {
          (r = []), (s = 0);
        }
        (o.onload = function() {
          var t,
            o,
            c,
            p,
            a =
              ((t = this.width),
              (o = this.height),
              (c = e.rowHeight / o),
              (p = Math.round(t * c)) < e.minImgWidth + 100 &&
                (p = e.minImgWidth),
              p),
            m = a + e.colGap,
            f = (function(t, i, n, o, r) {
              var h = document.createElement("div"),
                d = e.rowGap * r,
                l = e.rowHeight * r + d,
                c = s;
              return (
                (h.style.backgroundImage = "url(" + t + ")"),
                (h.className = "photo-block"),
                (h.style.width = n + "px"),
                (h.style.height = o + "px"),
                (h.style.top = l + "px"),
                (h.style.left = c + "px"),
                e.imgOnClick &&
                  ((h.onclick = function(t) {
                    e.imgOnClick(t, i);
                  }),
                  (h.className += " photo-block--clickable")),
                (h.innerHTML = (function(t) {
                  var i = '<div class="photo-block__panel">';
                  return (
                    e.panelHTMLSetter && (i += e.panelHTMLSetter(t)),
                    i + "</div>"
                  );
                })(i)),
                h
              );
            })(this.src, e.imgs[i], a, e.rowHeight, e.rowLength),
            u = e.minImgWidth;
          !(function(e, t) {
            (s += t), r.push(e);
          })(f, m),
            s + u >= e.dom.offsetWidth &&
              ((function() {
                for (
                  var t = e.dom.offsetWidth - (s - e.colGap), i = [], n = 0;
                  n < r.length;
                  n++
                )
                  if (t > 0) i.push(n);
                  else {
                    var o = r[n];
                    parseFloat(o.style.width.replace("px", "")) >
                      e.minImgWidth && i.push(n);
                  }
                var h = t / i.length,
                  d = 0;
                for (n = 0; n < r.length; n++) {
                  o = r[n];
                  var l = parseFloat(o.style.width.replace("px", ""));
                  i.includes(n) && ((l += h), (o.style.width = l + "px")),
                    (o.style.left = d + "px"),
                    (d += l + e.colGap);
                }
              })(),
              d(),
              l()),
            h(++i, n);
        }),
          (o.onerror = function(e) {
            h(++i, n);
          }),
          h(i, n);
      }),
      (i.prototype.setImgOnClick = function(e) {
        e && (this.imgOnClick = e), this._rerender(this);
      }),
      (i.prototype.setPanelHTMLSetter = function(e) {
        e && (this.panelHTMLSetter = e), this._rerender(this);
      }),
      (i.prototype.setShowUnCompleteRow = function(e) {
        "boolean" == typeof e && (this.showUnCompeleteRow = e);
      }),
      (i.prototype._rerender = function(e) {
        (this.rowLength = 0),
          (this.rowHeight = this._getRowHeight()),
          (this.minImgWidth = this._getMinImgWidth()),
          (this.compeleteIndex = -1),
          (e.dom.style.width = null),
          this._render();
      }),
      (i.prototype._addWindowResizeEvent = function() {
        if (!this.isResizeEventAdded) {
          var e,
            t = this;
          (this._resizeEvent = function() {
            clearTimeout(e),
              (e = setTimeout(function() {
                t.lastRenderedWindowOffsetWidth !== window.innerWidth &&
                  (t._rerender(t),
                  (t.lastRenderedWindowOffsetWidth = window.innerWidth));
              }, 300));
          }),
            window.addEventListener("resize", this._resizeEvent),
            (this.isResizeEventAdded = !0);
        }
      }),
      (i.prototype._removeWindowResizeEvent = function() {
        window.removeEventListener("resize", this._resizeEvent),
          (this.isResizeEventAdded = !1);
      }),
      (i.prototype.destroy = function() {
        this._removeWindowResizeEvent(),
          (this.rowLength = 0),
          (this.compeleteIndex = -1),
          this.dom.remove(),
          (this.dom = null),
          (this.imgs = []);
      });
    var n = i;
    return t;
  })();
});


!function(t){function n(i){if(e[i])return e[i].exports;var o=e[i]={i:i,l:!1,exports:{}};return t[i].call(o.exports,o,o.exports,n),o.l=!0,o.exports}var e={};n.m=t,n.c=e,n.d=function(t,e,i){n.o(t,e)||Object.defineProperty(t,e,{configurable:!1,enumerable:!0,get:i})},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,n){return Object.prototype.hasOwnProperty.call(t,n)},n.p="",n(n.s=0)}([function(t,n,e){e(1),t.exports=e(4)},function(t,n,e){"use strict";var i=Object.assign||function(t){for(var n=1;n<arguments.length;n++){var e=arguments[n];for(var i in e)Object.prototype.hasOwnProperty.call(e,i)&&(t[i]=e[i])}return t};e(2);var o=e(3);!function(t){function n(t){return t=i({},c,t),function(t){return["nfc-top-left","nfc-top-right","nfc-bottom-left","nfc-bottom-right"].indexOf(t)>-1}(t.positionClass)||(console.warn("An invalid notification position class has been specified."),t.positionClass=c.positionClass),t.onclick&&"function"!=typeof t.onclick&&(console.warn("Notification on click must be a function."),t.onclick=c.onclick),"number"!=typeof t.showDuration&&(t.showDuration=c.showDuration),(0,o.isString)(t.theme)&&0!==t.theme.length||(console.warn("Notification theme must be a string with length"),t.theme=c.theme),t}function e(t){return t=n(t),function(){var n=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},e=n.title,i=n.message,c=r(t.positionClass);if(!e&&!i)return console.warn("Notification must contain a title or a message!");var a=(0,o.createElement)("div","ncf",t.theme);if(!0===t.closeOnClick&&a.addEventListener("click",function(){return c.removeChild(a)}),t.onclick&&a.addEventListener("click",function(n){return t.onclick(n)}),t.displayCloseButton){var s=(0,o.createElement)("button");s.innerText="X",!1===t.closeOnClick&&s.addEventListener("click",function(){return c.removeChild(a)}),(0,o.append)(a,s)}if((0,o.isString)(e)&&e.length&&(0,o.append)(a,(0,o.createParagraph)("ncf-title")(e)),(0,o.isString)(i)&&i.length&&(0,o.append)(a,(0,o.createParagraph)("nfc-message")(i)),(0,o.append)(c,a),t.showDuration&&t.showDuration>0){var l=setTimeout(function(){c.removeChild(a),0===c.querySelectorAll(".ncf").length&&document.body.removeChild(c)},t.showDuration);(t.closeOnClick||t.displayCloseButton)&&a.addEventListener("click",function(){return clearTimeout(l)})}}}function r(t){var n=document.querySelector("."+t);return n||(n=(0,o.createElement)("div","ncf-container",t),(0,o.append)(document.body,n)),n}var c={closeOnClick:!0,displayCloseButton:!1,positionClass:"nfc-top-right",onclick:!1,showDuration:3500,theme:"success"};t.createNotification?console.warn("Window already contains a create notification function. Have you included the script twice?"):t.createNotification=e}(window)},function(t,n,e){"use strict";!function(){function t(t){this.el=t;for(var n=t.className.replace(/^\s+|\s+$/g,"").split(/\s+/),i=0;i<n.length;i++)e.call(this,n[i])}if(!(void 0===window.Element||"classList"in document.documentElement)){var n=Array.prototype,e=n.push,i=n.splice,o=n.join;t.prototype={add:function(t){this.contains(t)||(e.call(this,t),this.el.className=this.toString())},contains:function(t){return-1!=this.el.className.indexOf(t)},item:function(t){return this[t]||null},remove:function(t){if(this.contains(t)){for(var n=0;n<this.length&&this[n]!=t;n++);i.call(this,n,1),this.el.className=this.toString()}},toString:function(){return o.call(this," ")},toggle:function(t){return this.contains(t)?this.remove(t):this.add(t),this.contains(t)}},window.DOMTokenList=t,function(t,n,e){Object.defineProperty?Object.defineProperty(t,n,{get:e}):t.__defineGetter__(n,e)}(Element.prototype,"classList",function(){return new t(this)})}}()},function(t,n,e){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var i=n.partial=function(t){for(var n=arguments.length,e=Array(n>1?n-1:0),i=1;i<n;i++)e[i-1]=arguments[i];return function(){for(var n=arguments.length,i=Array(n),o=0;o<n;o++)i[o]=arguments[o];return t.apply(void 0,e.concat(i))}},o=(n.append=function(t){for(var n=arguments.length,e=Array(n>1?n-1:0),i=1;i<n;i++)e[i-1]=arguments[i];return e.forEach(function(n){return t.appendChild(n)})},n.isString=function(t){return"string"==typeof t},n.createElement=function(t){for(var n=arguments.length,e=Array(n>1?n-1:0),i=1;i<n;i++)e[i-1]=arguments[i];var o=document.createElement(t);return e.length&&e.forEach(function(t){return o.classList.add(t)}),o}),r=function(t,n){return t.innerText=n,t},c=function(t){for(var n=arguments.length,e=Array(n>1?n-1:0),c=1;c<n;c++)e[c-1]=arguments[c];return i(r,o.apply(void 0,[t].concat(e)))};n.createParagraph=function(){for(var t=arguments.length,n=Array(t),e=0;e<t;e++)n[e]=arguments[e];return c.apply(void 0,["p"].concat(n))}},function(t,n){}]);
