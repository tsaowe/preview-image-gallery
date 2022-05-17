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
        return window.innerWidth <= 350
          ? 200
          : window.innerWidth <= 550
          ? 250
          : window.innerWidth <= 768
          ? 270
          : 280;
      }),
      (i.prototype._getMinImgWidth = function() {
        return window.innerWidth <= 350
          ? 130
          : window.innerWidth <= 550
          ? 150
          : window.innerWidth <= 768
          ? 180
          : 200;
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
