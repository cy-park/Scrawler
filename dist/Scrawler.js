(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

(function e(r, n, t) {
  function i(s, a) {
    if (!n[s]) {
      if (!r[s]) {
        var l = typeof require == "function" && require;if (!a && l) return l(s, !0);if (o) return o(s, !0);var f = new Error("Cannot find module '" + s + "'");throw f.code = "MODULE_NOT_FOUND", f;
      }var p = n[s] = { exports: {} };r[s][0].call(p.exports, function (e) {
        var n = r[s][1][e];return i(n ? n : e);
      }, p, p.exports, e, r, n, t);
    }return n[s].exports;
  }var o = typeof require == "function" && require;for (var s = 0; s < t.length; s++) {
    i(t[s]);
  }return i;
})({ 1: [function (e, r, n) {
    "use strict";
    var t = typeof Symbol === "function" && _typeof(Symbol.iterator) === "symbol" ? function (e) {
      return typeof e === "undefined" ? "undefined" : _typeof(e);
    } : function (e) {
      return e && typeof Symbol === "function" && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e === "undefined" ? "undefined" : _typeof(e);
    };(function r(n, t, i) {
      function o(a, l) {
        if (!t[a]) {
          if (!n[a]) {
            var f = typeof e == "function" && e;if (!l && f) return f(a, !0);if (s) return s(a, !0);var p = new Error("Cannot find module '" + a + "'");throw p.code = "MODULE_NOT_FOUND", p;
          }var u = t[a] = { exports: {} };n[a][0].call(u.exports, function (e) {
            var r = n[a][1][e];return o(r ? r : e);
          }, u, u.exports, r, n, t, i);
        }return t[a].exports;
      }var s = typeof e == "function" && e;for (var a = 0; a < i.length; a++) {
        o(i[a]);
      }return o;
    })({ 1: [function (e, r, n) {
        "use strict";
        var i = typeof Symbol === "function" && t(Symbol.iterator) === "symbol" ? function (e) {
          return typeof e === "undefined" ? "undefined" : t(e);
        } : function (e) {
          return e && typeof Symbol === "function" && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e === "undefined" ? "undefined" : t(e);
        };(function r(n, t, i) {
          function o(a, l) {
            if (!t[a]) {
              if (!n[a]) {
                var f = typeof e == "function" && e;if (!l && f) return f(a, !0);if (s) return s(a, !0);var p = new Error("Cannot find module '" + a + "'");throw p.code = "MODULE_NOT_FOUND", p;
              }var u = t[a] = { exports: {} };n[a][0].call(u.exports, function (e) {
                var r = n[a][1][e];return o(r ? r : e);
              }, u, u.exports, r, n, t, i);
            }return t[a].exports;
          }var s = typeof e == "function" && e;for (var a = 0; a < i.length; a++) {
            o(i[a]);
          }return o;
        })({ 1: [function (e, r, n) {
            "use strict";
            var t = e("./Position");var i = o(t);function o(e) {
              return e && e.__esModule ? e : { default: e };
            }var s = {};s.calcBaseline = function (e, r) {
              var n = new i.default();var t = r ? r.getBoundingClientRect().height : window.innerHeight;switch (e) {case "top":
                  n.px = 0;n.f = 0;break;case "center":
                  n.px = t / 2;n.f = .5;break;case "bottom":
                  n.px = t;n.f = 1;break;default:
                  var o = function r() {
                    n.px = parseFloat(e);n.f = e / t;
                  };if (typeof e === "string") {
                    if (e.indexOf("%") !== -1) {
                      n.f = parseFloat(e.replace("%", "")) / 100;n.px = t * n.f;
                    } else {
                      o();
                    }
                  } else {
                    o();
                  }break;}return n;
            };r.exports = s;
          }, { "./Position": 3 }], 2: [function (e, r, n) {
            "use strict";
            var t = e("./Common");var i = f(t);var o = e("./Unit");var s = f(o);var a = e("./Position");var l = f(a);function f(e) {
              return e && e.__esModule ? e : { default: e };
            }var p = function e(r, n, t) {
              var o = this;o.id = r.id;o.el = r.el;o.order = r.order || 0;o.callback = n;o.callbackArgs = t || [];o.range = r.range || null;o.baseline = r.baseline || 0;o.nodelist = document.querySelectorAll(r.el);o.units = [];for (var a = 0; a < o.nodelist.length; a++) {
                o.units[a] = new s.default({ el: o.nodelist[a], baseline: i.default.calcBaseline(o.baseline, o.nodelist[a]), progress: new l.default() });
              }o.a;if (o.range) {
                if (typeof o.range[0] === "string") {
                  if (o.range[0].indexOf("%") !== -1) {
                    o.range[0] = parseFloat(o.range[0].replace("%", "")) / 100;o.range[1] = parseFloat(o.range[1].replace("%", "")) / 100;o.a = "f";
                  } else {
                    o.a = "px";
                  }
                } else {
                  o.a = "px";
                }
              }
            };r.exports = p;
          }, { "./Common": 1, "./Position": 3, "./Unit": 4 }], 3: [function (e, r, n) {
            "use strict";
            var t = function e() {
              var r = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};this.f = r.f || undefined;this.px = r.px || undefined;
            };r.exports = t;
          }, {}], 4: [function (e, r, n) {
            "use strict";
            var t = function e(r) {
              var n = this;n.el = r.el;n.baseline = r.baseline;n.progress = r.progress;n.b = false;n.c = false;n.maps = r.maps || {};
            };t.prototype.map = function (e, r, n, t) {
              var i = this;e = e.toString();r.to = r.to || [0, 1];t = t || [];i.maps[e] = i.maps[e] || { b: false, c: false };var o = r.from[0],
                  s = r.from[1],
                  a = r.to[0],
                  l = r.to[1],
                  f,
                  p;if (typeof o === "string") {
                if (o.indexOf("%") !== -1 || o.indexOf("f") !== -1) {
                  f = "f";o = parseFloat(o.replace("%", "").replace("f", "")) / 100;s = parseFloat(s.replace("%", "").replace("f", "")) / 100;
                } else {
                  f = "px";
                }
              } else {
                f = "px";
              }var u = i.progress[f];var c = i.maps[e];if (o <= u && u <= s) {
                c.b = false;c.c = false;p = (u - o) / (s - o) * (l - a) + a;t.unshift(p);n.apply(i, t);
              } else {
                if (u < o) {
                  c.c = false;if (!c.b) {
                    c.b = true;u = o;p = (u - o) / (s - o) * (l - a) + a;t.unshift(p);n.apply(i, t);
                  }
                } else {
                  c.b = false;if (!c.c) {
                    c.c = true;u = s;p = (u - o) / (s - o) * (l - a) + a;t.unshift(p);n.apply(i, t);
                  }
                }
              }
            };r.exports = t;
          }, {}], 5: [function (e, r, n) {
            "use strict";
            var t = typeof Symbol === "function" && i(Symbol.iterator) === "symbol" ? function (e) {
              return typeof e === "undefined" ? "undefined" : i(e);
            } : function (e) {
              return e && typeof Symbol === "function" && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e === "undefined" ? "undefined" : i(e);
            };var o = e("./Common");var s = f(o);var a = e("./Logic");var l = f(a);function f(e) {
              return e && e.__esModule ? e : { default: e };
            }(function (e, n) {
              "use strict";
              if (typeof define === "function" && define.amd) {
                define(Scrawler);
              } else if ((typeof r === "undefined" ? "undefined" : t(r)) === "object" && r.exports) {
                r.exports = e.Scrawler = n();
              } else {
                e.Scrawler = n();
              }
            })(typeof window !== "undefined" ? window : undefined, function () {
              "use strict";
              var e = void 0;var r = function r(n) {
                e = this;n = n || {};e.fps = n.fps || 0;e.d = n.baseline || "center";e.baseline = s.default.calcBaseline(e.d);e.idling = parseInt(n.idling) || 0;e.e = "";e.g = [];e.h = null;e.i = 0;e.j = 0;e.k = false;window.addEventListener("resize", e.refresh);
              };r.prototype.add = function (r, n, t) {
                r.id = r.id || "lid_" + e.g.length;e.g.push(new l.default(r, n, t));return e;
              };r.prototype.remove = function (r) {
                for (var n = 0; n < e.g.length; n++) {
                  if (e.g[n].id === r) {
                    e.g.splice(n, 1);return e;
                  }
                }return e;
              };r.prototype.sort = function () {
                e.g.sort(function (e, r) {
                  return e.order - r.order;
                });return e;
              };r.prototype.run = function () {
                if (!e.k) {
                  e.k = true;window.addEventListener("scroll", e.run);
                }e.h = window.requestAnimationFrame(n);return e;
              };r.prototype.pause = function () {
                window.cancelAnimationFrame(e.h);e.h = null;return e;
              };r.prototype.watch = function () {
                t();i();e.i = window.pageYOffset;return e;
              };r.prototype.refresh = function (r) {
                t(true);e.baseline = s.default.calcBaseline(e.d);for (var n = 0; n < e.g.length; n++) {
                  var o = e.g[n];for (var a = 0; a < o.units.length; a++) {
                    var l = o.units[a];l.baseline = s.default.calcBaseline(o.baseline, l.el);
                  }
                }i();e.i = window.pageYOffset;return e;
              };function n() {
                t();if (e.idling < 0 || e.idling === 0 && e.e !== "stay" || e.j < e.idling) {
                  i();e.i = window.pageYOffset;e.h = window.requestAnimationFrame(n);
                } else {
                  if (e.h) e.pause();
                }
              }function t(r) {
                if (r) {
                  e.e = "resizing";
                } else {
                  if (e.i === window.pageYOffset) {
                    if (e.e === "stay") {
                      if (e.idling >= 0) e.j++;
                    } else if (e.e === "") {
                      e.e = "initialized";
                    } else {
                      e.e = "stay";
                    }
                  } else {
                    e.j = 0;if (e.i < window.pageYOffset) e.e = "down";else e.e = "up";
                  }
                }
              }function i() {
                for (var r = 0; r < e.g.length; r++) {
                  var n = e.g[r];for (var t = 0; t < n.units.length; t++) {
                    var i = n.units[t];var o = i.el.getBoundingClientRect();i.progress.px = e.baseline.px - (o.top + i.baseline.px);i.progress.f = o.height === 0 ? 0 : i.progress.px / o.height;if (n.range) {
                      if (n.range[0] <= i.progress[n.a] && i.progress[n.a] <= n.range[1]) {
                        i.b = n.range[0] === i.progress[n.a] ? true : false;i.c = n.range[1] === i.progress[n.a] ? true : false;n.callback.apply(i, n.callbackArgs);
                      } else {
                        if (i.progress[n.a] < n.range[0]) {
                          i.c = false;if (n.a === "px") {
                            i.progress.px = n.range[0];i.progress.f = o.height === 0 ? 0 : i.progress.px / o.height;
                          } else {
                            i.progress.f = n.range[0];i.progress.px = o.height * i.progress.f;
                          }if (!i.b) {
                            i.b = true;n.callback.apply(i, n.callbackArgs);
                          } else {}
                        } else {
                          i.b = false;if (n.a === "px") {
                            i.progress.px = n.range[1];i.progress.f = o.height === 0 ? 0 : i.progress.px / o.height;
                          } else {
                            i.progress.f = n.range[1];i.progress.px = o.height * i.progress.f;
                          }if (!i.c) {
                            i.c = true;n.callback.apply(i, n.callbackArgs);
                          } else {}
                        }
                      }
                    } else {
                      n.callback.apply(i, n.callbackArgs);
                    }
                  }
                }
              }return r;
            });
          }, { "./Common": 1, "./Logic": 2 }] }, {}, [5]);
      }, {}], 2: [function (e, r, n) {
        "use strict";
        var t = e("./Position");var i = o(t);function o(e) {
          return e && e.__esModule ? e : { default: e };
        }var s = {};s.calcBaseline = function (e, r) {
          var n = new i.default();var t = r ? r.getBoundingClientRect().height : window.innerHeight;switch (e) {case "top":
              n.px = 0;n.f = 0;break;case "center":
              n.px = t / 2;n.f = .5;break;case "bottom":
              n.px = t;n.f = 1;break;default:
              var o = function r() {
                n.px = parseFloat(e);n.f = e / t;
              };if (typeof e === "string") {
                if (e.indexOf("%") !== -1) {
                  n.f = parseFloat(e.replace("%", "")) / 100;n.px = t * n.f;
                } else {
                  o();
                }
              } else {
                o();
              }break;}return n;
        };r.exports = s;
      }, { "./Position": 4 }], 3: [function (e, r, n) {
        "use strict";
        var t = e("./Common");var i = f(t);var o = e("./Unit");var s = f(o);var a = e("./Position");var l = f(a);function f(e) {
          return e && e.__esModule ? e : { default: e };
        }var p = function e(r, n, t) {
          var o = this;o.id = r.id;o.el = r.el;o.order = r.order || 0;o.callback = n;o.callbackArgs = t || [];o.range = r.range || null;o.baseline = r.baseline || 0;o.nodelist = document.querySelectorAll(r.el);o.units = [];for (var a = 0; a < o.nodelist.length; a++) {
            o.units[a] = new s.default({ el: o.nodelist[a], baseline: i.default.calcBaseline(o.baseline, o.nodelist[a]), progress: new l.default() });
          }o.l;if (o.range) {
            if (typeof o.range[0] === "string") {
              if (o.range[0].indexOf("%") !== -1) {
                o.range[0] = parseFloat(o.range[0].replace("%", "")) / 100;o.range[1] = parseFloat(o.range[1].replace("%", "")) / 100;o.l = "f";
              } else {
                o.l = "px";
              }
            } else {
              o.l = "px";
            }
          }
        };r.exports = p;
      }, { "./Common": 2, "./Position": 4, "./Unit": 5 }], 4: [function (e, r, n) {
        "use strict";
        var t = function e() {
          var r = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};this.f = r.f || undefined;this.px = r.px || undefined;
        };r.exports = t;
      }, {}], 5: [function (e, r, n) {
        "use strict";
        var t = function e(r) {
          var n = this;n.el = r.el;n.baseline = r.baseline;n.progress = r.progress;n.m = false;n.n = false;n.maps = r.maps || {};
        };t.prototype.map = function (e, r, n, t) {
          var i = this;e = e.toString();r.to = r.to || [0, 1];t = t || [];i.maps[e] = i.maps[e] || { m: false, n: false };var o = r.from[0],
              s = r.from[1],
              a = r.to[0],
              l = r.to[1],
              f,
              p;if (typeof o === "string") {
            if (o.indexOf("%") !== -1 || o.indexOf("f") !== -1) {
              f = "f";o = parseFloat(o.replace("%", "").replace("f", "")) / 100;s = parseFloat(s.replace("%", "").replace("f", "")) / 100;
            } else {
              f = "px";
            }
          } else {
            f = "px";
          }var u = i.progress[f];var c = i.maps[e];if (o <= u && u <= s) {
            c.m = false;c.n = false;p = (u - o) / (s - o) * (l - a) + a;t.unshift(p);n.apply(i, t);
          } else {
            if (u < o) {
              c.n = false;if (!c.m) {
                c.m = true;u = o;p = (u - o) / (s - o) * (l - a) + a;t.unshift(p);n.apply(i, t);
              }
            } else {
              c.m = false;if (!c.n) {
                c.n = true;u = s;p = (u - o) / (s - o) * (l - a) + a;t.unshift(p);n.apply(i, t);
              }
            }
          }
        };r.exports = t;
      }, {}], 6: [function (e, r, n) {
        "use strict";
        var i = typeof Symbol === "function" && t(Symbol.iterator) === "symbol" ? function (e) {
          return typeof e === "undefined" ? "undefined" : t(e);
        } : function (e) {
          return e && typeof Symbol === "function" && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e === "undefined" ? "undefined" : t(e);
        };var o = e("./Common");var s = u(o);var a = e("./Logic");var l = u(a);var f = e("../dist/Scrawler.min");var p = u(f);function u(e) {
          return e && e.__esModule ? e : { default: e };
        }(function (e, n) {
          "use strict";
          if (typeof define === "function" && define.amd) {
            define(Scrawler);
          } else if ((typeof r === "undefined" ? "undefined" : i(r)) === "object" && r.exports) {
            r.exports = e.Scrawler = n();
          } else {
            e.Scrawler = n();
          }
        })(typeof window !== "undefined" ? window : undefined, function () {
          "use strict";
          var e = void 0;var r = new p.default();console.log(r);var n = function r(n) {
            e = this;n = n || {};e.fps = n.fps || 0;e.o = n.baseline || "center";e.baseline = s.default.calcBaseline(e.o);e.idling = parseInt(n.idling) || 0;e.p = "";e.q = [];e.r = null;e.s = 0;e.t = 0;e.u = false;window.addEventListener("resize", e.refresh);
          };n.prototype.add = function (r, n, t) {
            r.id = r.id || "lid_" + e.q.length;e.q.push(new l.default(r, n, t));return e;
          };n.prototype.remove = function (r) {
            for (var n = 0; n < e.q.length; n++) {
              if (e.q[n].id === r) {
                e.q.splice(n, 1);return e;
              }
            }return e;
          };n.prototype.sort = function () {
            e.q.sort(function (e, r) {
              return e.order - r.order;
            });return e;
          };n.prototype.run = function () {
            if (!e.u) {
              e.u = true;window.addEventListener("scroll", e.run);
            }e.r = window.requestAnimationFrame(t);return e;
          };n.prototype.pause = function () {
            window.cancelAnimationFrame(e.r);e.r = null;return e;
          };n.prototype.watch = function () {
            i();o();e.s = window.pageYOffset;return e;
          };n.prototype.refresh = function (r) {
            i(true);e.baseline = s.default.calcBaseline(e.o);for (var n = 0; n < e.q.length; n++) {
              var t = e.q[n];for (var a = 0; a < t.units.length; a++) {
                var l = t.units[a];l.baseline = s.default.calcBaseline(t.baseline, l.el);
              }
            }o();e.s = window.pageYOffset;return e;
          };function t() {
            i();if (e.idling < 0 || e.idling === 0 && e.p !== "stay" || e.t < e.idling) {
              o();e.s = window.pageYOffset;e.r = window.requestAnimationFrame(t);
            } else {
              if (e.r) e.pause();
            }
          }function i(r) {
            if (r) {
              e.p = "resizing";
            } else {
              if (e.s === window.pageYOffset) {
                if (e.p === "stay") {
                  if (e.idling >= 0) e.t++;
                } else if (e.p === "") {
                  e.p = "initialized";
                } else {
                  e.p = "stay";
                }
              } else {
                e.t = 0;if (e.s < window.pageYOffset) e.p = "down";else e.p = "up";
              }
            }
          }function o() {
            for (var r = 0; r < e.q.length; r++) {
              var n = e.q[r];for (var t = 0; t < n.units.length; t++) {
                var i = n.units[t];var o = i.el.getBoundingClientRect();i.progress.px = e.baseline.px - (o.top + i.baseline.px);i.progress.f = o.height === 0 ? 0 : i.progress.px / o.height;if (n.range) {
                  if (n.range[0] <= i.progress[n.l] && i.progress[n.l] <= n.range[1]) {
                    i.m = n.range[0] === i.progress[n.l] ? true : false;i.n = n.range[1] === i.progress[n.l] ? true : false;n.callback.apply(i, n.callbackArgs);
                  } else {
                    if (i.progress[n.l] < n.range[0]) {
                      i.n = false;if (n.l === "px") {
                        i.progress.px = n.range[0];i.progress.f = o.height === 0 ? 0 : i.progress.px / o.height;
                      } else {
                        i.progress.f = n.range[0];i.progress.px = o.height * i.progress.f;
                      }if (!i.m) {
                        i.m = true;n.callback.apply(i, n.callbackArgs);
                      } else {}
                    } else {
                      i.m = false;if (n.l === "px") {
                        i.progress.px = n.range[1];i.progress.f = o.height === 0 ? 0 : i.progress.px / o.height;
                      } else {
                        i.progress.f = n.range[1];i.progress.px = o.height * i.progress.f;
                      }if (!i.n) {
                        i.n = true;n.callback.apply(i, n.callbackArgs);
                      } else {}
                    }
                  }
                } else {
                  n.callback.apply(i, n.callbackArgs);
                }
              }
            }
          }return n;
        });
      }, { "../dist/Scrawler.min": 1, "./Common": 2, "./Logic": 3 }] }, {}, [6]);
  }, {}], 2: [function (e, r, n) {
    "use strict";
    var t = e("./Position");var i = o(t);function o(e) {
      return e && e.__esModule ? e : { default: e };
    }var s = {};s.calcBaseline = function (e, r) {
      var n = new i.default();var t = r ? r.getBoundingClientRect().height : window.innerHeight;switch (e) {case "top":
          n.px = 0;n.f = 0;break;case "center":
          n.px = t / 2;n.f = .5;break;case "bottom":
          n.px = t;n.f = 1;break;default:
          var o = function r() {
            n.px = parseFloat(e);n.f = e / t;
          };if (typeof e === "string") {
            if (e.indexOf("%") !== -1) {
              n.f = parseFloat(e.replace("%", "")) / 100;n.px = t * n.f;
            } else {
              o();
            }
          } else {
            o();
          }break;}return n;
    };r.exports = s;
  }, { "./Position": 4 }], 3: [function (e, r, n) {
    "use strict";
    var t = e("./Common");var i = f(t);var o = e("./Unit");var s = f(o);var a = e("./Position");var l = f(a);function f(e) {
      return e && e.__esModule ? e : { default: e };
    }var p = function e(r, n, t) {
      var o = this;o.id = r.id;o.el = r.el;o.order = r.order || 0;o.callback = n;o.callbackArgs = t || [];o.range = r.range || null;o.baseline = r.baseline || 0;o.nodelist = document.querySelectorAll(r.el);o.units = [];for (var a = 0; a < o.nodelist.length; a++) {
        o.units[a] = new s.default({ el: o.nodelist[a], baseline: i.default.calcBaseline(o.baseline, o.nodelist[a]), progress: new l.default() });
      }o.v;if (o.range) {
        if (typeof o.range[0] === "string") {
          if (o.range[0].indexOf("%") !== -1) {
            o.range[0] = parseFloat(o.range[0].replace("%", "")) / 100;o.range[1] = parseFloat(o.range[1].replace("%", "")) / 100;o.v = "f";
          } else {
            o.v = "px";
          }
        } else {
          o.v = "px";
        }
      }
    };r.exports = p;
  }, { "./Common": 2, "./Position": 4, "./Unit": 5 }], 4: [function (e, r, n) {
    "use strict";
    var t = function e() {
      var r = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};this.f = r.f || undefined;this.px = r.px || undefined;
    };r.exports = t;
  }, {}], 5: [function (e, r, n) {
    "use strict";
    var t = function e(r) {
      var n = this;n.el = r.el;n.baseline = r.baseline;n.progress = r.progress;n.w = false;n.x = false;n.maps = r.maps || {};
    };t.prototype.map = function (e, r, n, t) {
      var i = this;e = e.toString();r.to = r.to || [0, 1];t = t || [];i.maps[e] = i.maps[e] || { w: false, x: false };var o = r.from[0],
          s = r.from[1],
          a = r.to[0],
          l = r.to[1],
          f,
          p;if (typeof o === "string") {
        if (o.indexOf("%") !== -1 || o.indexOf("f") !== -1) {
          f = "f";o = parseFloat(o.replace("%", "").replace("f", "")) / 100;s = parseFloat(s.replace("%", "").replace("f", "")) / 100;
        } else {
          f = "px";
        }
      } else {
        f = "px";
      }var u = i.progress[f];var c = i.maps[e];if (o <= u && u <= s) {
        c.w = false;c.x = false;p = (u - o) / (s - o) * (l - a) + a;t.unshift(p);n.apply(i, t);
      } else {
        if (u < o) {
          c.x = false;if (!c.w) {
            c.w = true;u = o;p = (u - o) / (s - o) * (l - a) + a;t.unshift(p);n.apply(i, t);
          }
        } else {
          c.w = false;if (!c.x) {
            c.x = true;u = s;p = (u - o) / (s - o) * (l - a) + a;t.unshift(p);n.apply(i, t);
          }
        }
      }
    };r.exports = t;
  }, {}], 6: [function (e, r, n) {
    "use strict";
    var t = typeof Symbol === "function" && _typeof(Symbol.iterator) === "symbol" ? function (e) {
      return typeof e === "undefined" ? "undefined" : _typeof(e);
    } : function (e) {
      return e && typeof Symbol === "function" && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e === "undefined" ? "undefined" : _typeof(e);
    };var i = e("./Common");var o = p(i);var s = e("./Logic");var a = p(s);var l = e("../dist/Scrawler.min");var f = p(l);function p(e) {
      return e && e.__esModule ? e : { default: e };
    }(function (e, n) {
      "use strict";
      if (typeof define === "function" && define.amd) {
        define(Scrawler);
      } else if ((typeof r === "undefined" ? "undefined" : t(r)) === "object" && r.exports) {
        r.exports = n();
      } else {
        e.Scrawler = n();
      }
    })(typeof window !== "undefined" ? window : undefined, function () {
      "use strict";
      var e = void 0;var r = new f.default();console.log(r);var n = function r(n) {
        e = this;n = n || {};e.fps = n.fps || 0;e.y = n.baseline || "center";e.baseline = o.default.calcBaseline(e.y);e.idling = parseInt(n.idling) || 0;e.z = "";e.A = [];e.B = null;e.C = 0;e.D = 0;e.F = false;window.addEventListener("resize", e.refresh);
      };n.prototype.add = function (r, n, t) {
        r.id = r.id || "lid_" + e.A.length;e.A.push(new a.default(r, n, t));return e;
      };n.prototype.remove = function (r) {
        for (var n = 0; n < e.A.length; n++) {
          if (e.A[n].id === r) {
            e.A.splice(n, 1);return e;
          }
        }return e;
      };n.prototype.sort = function () {
        e.A.sort(function (e, r) {
          return e.order - r.order;
        });return e;
      };n.prototype.run = function () {
        if (!e.F) {
          e.F = true;window.addEventListener("scroll", e.run);
        }e.B = window.requestAnimationFrame(t);return e;
      };n.prototype.pause = function () {
        window.cancelAnimationFrame(e.B);e.B = null;return e;
      };n.prototype.watch = function () {
        i();s();e.C = window.pageYOffset;return e;
      };n.prototype.refresh = function (r) {
        i(true);e.baseline = o.default.calcBaseline(e.y);for (var n = 0; n < e.A.length; n++) {
          var t = e.A[n];for (var a = 0; a < t.units.length; a++) {
            var l = t.units[a];l.baseline = o.default.calcBaseline(t.baseline, l.el);
          }
        }s();e.C = window.pageYOffset;return e;
      };function t() {
        i();if (e.idling < 0 || e.idling === 0 && e.z !== "stay" || e.D < e.idling) {
          s();e.C = window.pageYOffset;e.B = window.requestAnimationFrame(t);
        } else {
          if (e.B) e.pause();
        }
      }function i(r) {
        if (r) {
          e.z = "resizing";
        } else {
          if (e.C === window.pageYOffset) {
            if (e.z === "stay") {
              if (e.idling >= 0) e.D++;
            } else if (e.z === "") {
              e.z = "initialized";
            } else {
              e.z = "stay";
            }
          } else {
            e.D = 0;if (e.C < window.pageYOffset) e.z = "down";else e.z = "up";
          }
        }
      }function s() {
        for (var r = 0; r < e.A.length; r++) {
          var n = e.A[r];for (var t = 0; t < n.units.length; t++) {
            var i = n.units[t];var o = i.el.getBoundingClientRect();i.progress.px = e.baseline.px - (o.top + i.baseline.px);i.progress.f = o.height === 0 ? 0 : i.progress.px / o.height;if (n.range) {
              if (n.range[0] <= i.progress[n.v] && i.progress[n.v] <= n.range[1]) {
                i.w = n.range[0] === i.progress[n.v] ? true : false;i.x = n.range[1] === i.progress[n.v] ? true : false;n.callback.apply(i, n.callbackArgs);
              } else {
                if (i.progress[n.v] < n.range[0]) {
                  i.x = false;if (n.v === "px") {
                    i.progress.px = n.range[0];i.progress.f = o.height === 0 ? 0 : i.progress.px / o.height;
                  } else {
                    i.progress.f = n.range[0];i.progress.px = o.height * i.progress.f;
                  }if (!i.w) {
                    i.w = true;n.callback.apply(i, n.callbackArgs);
                  } else {}
                } else {
                  i.w = false;if (n.v === "px") {
                    i.progress.px = n.range[1];i.progress.f = o.height === 0 ? 0 : i.progress.px / o.height;
                  } else {
                    i.progress.f = n.range[1];i.progress.px = o.height * i.progress.f;
                  }if (!i.x) {
                    i.x = true;n.callback.apply(i, n.callbackArgs);
                  } else {}
                }
              }
            } else {
              n.callback.apply(i, n.callbackArgs);
            }
          }
        }
      }return n;
    });
  }, { "../dist/Scrawler.min": 1, "./Common": 2, "./Logic": 3 }] }, {}, [6]);

},{}],2:[function(require,module,exports){
'use strict';

var _Position = require('./Position');

var _Position2 = _interopRequireDefault(_Position);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Common = {};

Common.calcBaseline = function (baseline, el) {

	var _b = new _Position2.default();
	var _h = el ? el.getBoundingClientRect().height : window.innerHeight;

	switch (baseline) {

		case 'top':
			_b.px = 0;
			_b.f = 0;
			break;

		case 'center':
			_b.px = _h / 2;
			_b.f = .5;
			break;

		case 'bottom':
			_b.px = _h;
			_b.f = 1;
			break;

		default:
			var _px = function _px() {
				// px
				_b.px = parseFloat(baseline);
				_b.f = baseline / _h;
			};
			if (typeof baseline === 'string') {
				if (baseline.indexOf('%') !== -1) {
					// percent
					_b.f = parseFloat(baseline.replace('%', '')) / 100;
					_b.px = _h * _b.f;
				} else {
					_px();
				}
			} else {
				_px();
			}
			break;
	}

	return _b;
};

module.exports = Common;

},{"./Position":4}],3:[function(require,module,exports){
'use strict';

var _Common = require('./Common');

var _Common2 = _interopRequireDefault(_Common);

var _Unit = require('./Unit');

var _Unit2 = _interopRequireDefault(_Unit);

var _Position = require('./Position');

var _Position2 = _interopRequireDefault(_Position);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Class Logic(args, callback, callbackArgs)
 * 
 * @param {object} args
 * 		  - refer to Scrawler.prototype.add() for more info.
 * @param {function} callback
 * @param {array} callbackArgs
 */
var Logic = function Logic(args, callback, callbackArgs) {

	var self = this;

	self.id = args.id;
	self.el = args.el;
	self.order = args.order || 0;
	self.callback = callback;
	self.callbackArgs = callbackArgs || [];
	self.range = args.range || null; // Array(2) with From and To values. 
	self.baseline = args.baseline || 0;
	self.nodelist = document.querySelectorAll(args.el);
	self.units = [];
	for (var i = 0; i < self.nodelist.length; i++) {
		self.units[i] = new _Unit2.default({
			el: self.nodelist[i],
			baseline: _Common2.default.calcBaseline(self.baseline, self.nodelist[i]),
			progress: new _Position2.default()
		});
	}

	self._range_unit_;

	if (self.range) {
		if (typeof self.range[0] === 'string') {
			if (self.range[0].indexOf('%') !== -1) {
				// percent
				self.range[0] = parseFloat(self.range[0].replace('%', '')) / 100;
				self.range[1] = parseFloat(self.range[1].replace('%', '')) / 100;
				self._range_unit_ = 'f';
			} else {
				self._range_unit_ = 'px';
			}
		} else {
			self._range_unit_ = 'px';
		}
	}
};

module.exports = Logic;

},{"./Common":2,"./Position":4,"./Unit":5}],4:[function(require,module,exports){
'use strict';

/**
 * Class Position(args)
 *
 * Contains Scrawler Position value 
 * 
 * @param {object} args (default: {})
 *		  {int} args.f
 *		  		- unit interval (fraction/float)
 *  	  {int} args.px
 *		  		- pixel value
 */

var Position = function Position() {
  var args = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  this.f = args.f || undefined; // unit interval (fraction/float)
  this.px = args.px || undefined; // pixel
};

module.exports = Position;

},{}],5:[function(require,module,exports){
'use strict';

var Unit = function Unit(args) {

	var self = this;

	self.el = args.el;
	self.baseline = args.baseline;
	self.progress = args.progress;
	self._top_edge_rendered_ = false;
	self._bot_edge_rendered_ = false;
	self.maps = args.maps || {};
};

Unit.prototype.map = function (mid, args, callback, callbackArgs) {

	var self = this;

	mid = mid.toString();
	args.to = args.to || [0, 1];
	callbackArgs = callbackArgs || [];
	self.maps[mid] = self.maps[mid] || { _top_edge_rendered_: false, _bot_edge_rendered_: false };

	var f0 = args.from[0],
	    f1 = args.from[1],
	    t0 = args.to[0],
	    t1 = args.to[1],
	    range_unit,
	    val;

	if (typeof f0 === 'string') {
		if (f0.indexOf('%') !== -1 || f0.indexOf('f') !== -1) {
			// percent
			range_unit = 'f';
			f0 = parseFloat(f0.replace('%', '').replace('f', '')) / 100;
			f1 = parseFloat(f1.replace('%', '').replace('f', '')) / 100;
		} else {
			range_unit = 'px';
		}
	} else {
		range_unit = 'px';
	}

	var prg = self.progress[range_unit];
	var _m = self.maps[mid];

	if (f0 <= prg && prg <= f1) {

		_m._top_edge_rendered_ = false;
		_m._bot_edge_rendered_ = false;
		val = (prg - f0) / (f1 - f0) * (t1 - t0) + t0;
		callbackArgs.unshift(val);
		callback.apply(self, callbackArgs);
	} else {

		if (prg < f0) {

			_m._bot_edge_rendered_ = false;

			if (!_m._top_edge_rendered_) {
				_m._top_edge_rendered_ = true;
				prg = f0;
				val = (prg - f0) / (f1 - f0) * (t1 - t0) + t0;
				callbackArgs.unshift(val);
				callback.apply(self, callbackArgs);
			}
		} else {

			_m._top_edge_rendered_ = false;

			if (!_m._bot_edge_rendered_) {
				_m._bot_edge_rendered_ = true;
				prg = f1;
				val = (prg - f0) / (f1 - f0) * (t1 - t0) + t0;
				callbackArgs.unshift(val);
				callback.apply(self, callbackArgs);
			}
		}
	}
};

module.exports = Unit;

},{}],6:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/*! Scrawler.js v0.3.0 | (c) 2016-2017 Chan Young Park | MIT License */

// import Common from './Common';
// import Logic from './Logic';

// import test from '../dist/Scrawler.min';

;(function (global, factory) {
	'use strict';

	if (typeof define === 'function' && define.amd) {
		// AMD
		define(Scrawler);
	} else if ((typeof module === 'undefined' ? 'undefined' : _typeof(module)) === 'object' && module.exports) {
		// CommonJS
		// module.exports = (global.Scrawler = factory());
		module.exports = factory();
	} else {
		// Browser global
		global.Scrawler = factory();
	}
})(typeof window !== 'undefined' ? window : undefined, function () {
	'use strict';

	var Common = require('./Common');
	var Logic = require('./Logic');
	var test = require('../dist/Scrawler.min');

	var root = void 0;

	var a = new test();console.log(a);

	/**
  * Constructor Scrawler(args)
  * 
  * @param {object} [args] (default: {})
  * @param {int} [args.fps] (default: 0) Currently not implemented.
  *		  Frames per second.
  *		  0: auto fps
  * @param {int|string} [args.baseline] (default: 0)
  *		  Scrawler's baseline position. All units will reference this baseline.
  *		  Available values:
  *		  - integer: pixel distance from the top of the viewport.
  *		  - string: 'top', 'center', 'bottom', or '0%' to '100%' as a string
  * @param {int} [idling] (default: 0)
  *		  Number of rounds that Engine runs after scroll stops. 
  * 		  Usually, there is no need to run Engine after scroll stops.
  * 		  If this value is -1, Engine will be always running regardless of scroll.
  *		  Engine running === requestAnimationFrame()
  */
	var Scrawler = function Scrawler(args) {

		root = this;

		args = args || {};

		// Frames per second
		root.fps = args.fps || 0;

		// Variable to store original baseline value from args
		root._original_baseline_ = args.baseline || 'center';

		// Baseline value converted to Scrawler.Position() === {px:N, f:N}
		root.baseline = Common.calcBaseline(root._original_baseline_);

		// Number of idle Engine rounds
		root.idling = parseInt(args.idling) || 0;

		/** Under the hood */

		// Current direction of scroll
		root._dir_ = '';

		// Logics array. Scrawler.add() will push Logics in this array.
		root._logics_ = [];

		// rAF holder variable
		root._raf_ = null;

		// Previous scroll position by window.pageYOffset. Updates with every scroll.
		root._prev_px_position_ = 0;

		// Idle engine round counter
		root._idle_rounds_ = 0;

		root._scroll_event_initialized_ = false;

		window.addEventListener('resize', root.refresh);
	};

	/**
  * Public Function Scrawler.add(args, callback, callbackArgs)
  *
  * Add a Logic to Scrawler.
  * A Logic contains code how designated DOM element(s)
  * will react based on scrolls.
  * Once a Logic is registered by Scrawler.add(), 
  * Scrawler will automatically run each 
  * registered Logic when scroll events happen.
  *
  * @param {object} args
  * @param {string} args.el
  *		  Query selector for DOM elements.
  * @param {array(2)} [args.range] (default: null)
  *		  Range where this Logic will be executed.
  *		  If null, the callback function will run regardless of scroll position.
  *		  Range can be either percentage or pixel. 
  *		  i.e.) ['0%','100%'] or [0, 5000]
  * @param {int|string} [args.baseline] (default: 0)
  *		  The DOM element's baseline position. Scrawler measures the distance between viewport baseline and this baseline.
  *		  Available values:
  *		  - integer: pixel distance from the top of the viewport.
  *		  - string: 'top', 'center', 'bottom', or '0%' to '100%' as a string
  * @param {string} [args.id] (default: random)
  *		  Logic ID. Required if this Logic is expected to be removed later.
  * @param {int} args.order (default: 0)
  *		  // TODO: Not implemented yet. Not sure when to run sort().
  *		  Running order of Logic
  *		  Bigger order number will run later.
  * @param {function} callback
  *		  This function will run and apply on DOM elements
  *		  selected by args.el when scroll events happen.
  * @param {array} [callbackArgs]
  *		  args for callback function
  *
  * @return {Scrawler} Scrawler object
  */
	Scrawler.prototype.add = function (args, callback, callbackArgs) {
		args.id = args.id || 'lid_' + root._logics_.length;
		root._logics_.push(new Logic(args, callback, callbackArgs));
		return root;
	};

	/**
  * Public Function Scrawler.remove(lid)
  *
  * Remove a Logic from Scrawler.
  *
  * @param {string} lid
  *		  ID for Logic to remove
  *
  * @return {Scrawler} Scrawler object
  */
	Scrawler.prototype.remove = function (lid) {
		for (var i = 0; i < root._logics_.length; i++) {
			if (root._logics_[i].id === lid) {
				root._logics_.splice(i, 1);
				return root;
			}
		}
		return root;
	};

	/**
  * Public Function Scrawler.sort()
  *
  * Sort Scrawler Logics.
  *
  * @return {Scrawler} Scrawler object
  */
	Scrawler.prototype.sort = function () {
		root._logics_.sort(function (a, b) {
			return a.order - b.order;
		});
		return root;
	};

	/**
  * Public Function Scrawler.run()
  *
  * Start/resume Scrawler to run added logics.
  * To run Scrawler in an already existing rAF, refer to Scrawler.watch().
  *
  * @return {Scrawler} Scrawler object
  */
	Scrawler.prototype.run = function () {
		if (!root._scroll_event_initialized_) {
			root._scroll_event_initialized_ = true;
			window.addEventListener('scroll', root.run);
		}
		root._raf_ = window.requestAnimationFrame(engine);
		return root;
	};

	/**
  * Public Function Scrawler.pause()
  *
  * Pause Scrawler.
  * Usually useful only when `idling` setting is `-1` or bign enough.
  * Scrawler automatically pauses after reaching the assigned idling number.
  *
  * @return {Scrawler} Scrawler object
  */
	Scrawler.prototype.pause = function () {
		window.cancelAnimationFrame(root._raf_);
		root._raf_ = null;
		return root;
	};

	/**
  * Public Function Scrawler.watch()
  *
  * Pause Scrawler.
  *
  * @return {Scrawler} Scrawler object
  */
	Scrawler.prototype.watch = function () {
		updateScrawlerDirection();
		updateUnitPositions();
		root._prev_px_position_ = window.pageYOffset;
		return root;
	};

	/**
  * Public Function Scrawler.refresh()
  *
  * Refresh all baseline and position data
  *
  * @return {Scrawler} Scrawler object
  */
	Scrawler.prototype.refresh = function (e) {

		updateScrawlerDirection(true);

		root.baseline = Common.calcBaseline(root._original_baseline_);

		for (var i = 0; i < root._logics_.length; i++) {
			var _l = root._logics_[i];
			for (var j = 0; j < _l.units.length; j++) {
				var _u = _l.units[j];
				_u.baseline = Common.calcBaseline(_l.baseline, _u.el);
			}
		}

		updateUnitPositions();
		root._prev_px_position_ = window.pageYOffset;

		return root;
	};

	function engine() {

		updateScrawlerDirection();

		if (root.idling < 0 || root.idling === 0 && root._dir_ !== 'stay' || root._idle_rounds_ < root.idling) {

			updateUnitPositions();

			root._prev_px_position_ = window.pageYOffset;
			root._raf_ = window.requestAnimationFrame(engine);
		} else {
			if (root._raf_) root.pause();
		}
	}

	/**
  * Private Function updateScrawlerDirection(resizing)
  *
  * Update Scrawler direction.
  *
  * @param {boolean} resizing
  *		  If true, Scrawler direction will temporarily have `resizing` as its value.
  *
  * @return void
  */
	function updateScrawlerDirection(resizing) {
		if (resizing) {
			root._dir_ = 'resizing';
		} else {
			if (root._prev_px_position_ === window.pageYOffset) {
				if (root._dir_ === 'stay') {
					if (root.idling >= 0) root._idle_rounds_++;
				} else if (root._dir_ === '') {
					root._dir_ = 'initialized';
				} else {
					root._dir_ = 'stay';
				}
			} else {
				root._idle_rounds_ = 0;
				if (root._prev_px_position_ < window.pageYOffset) root._dir_ = 'down';else root._dir_ = 'up';
			}
		}
	}

	/**
  * Private Function updateUnitPositions()
  *
  * Update all Unit Positions from all Logics.
  *
  * @return void
  */
	function updateUnitPositions() {
		for (var i = 0; i < root._logics_.length; i++) {
			var _l = root._logics_[i];
			for (var j = 0; j < _l.units.length; j++) {
				var _u = _l.units[j];
				var _bcr = _u.el.getBoundingClientRect();
				// Update progress of each unit in a logic.
				_u.progress.px = root.baseline.px - (_bcr.top + _u.baseline.px);
				_u.progress.f = _bcr.height === 0 ? 0 : _u.progress.px / _bcr.height;

				if (_l.range) {

					if (_l.range[0] <= _u.progress[_l._range_unit_] && _u.progress[_l._range_unit_] <= _l.range[1]) {
						// In range

						// TODO: Review & test required.
						// Editing this part as it should change the flags in edge cases.
						// Not completely removing legacy code as not yet tested.
						// _u._top_edge_rendered_ = false;
						// _u._bot_edge_rendered_ = false;
						_u._top_edge_rendered_ = _l.range[0] === _u.progress[_l._range_unit_] ? true : false;
						_u._bot_edge_rendered_ = _l.range[1] === _u.progress[_l._range_unit_] ? true : false;
						_l.callback.apply(_u, _l.callbackArgs);
					} else {
						// Out of range

						if (_u.progress[_l._range_unit_] < _l.range[0]) {
							// Unit locates lower than Scrawler Baseline.

							_u._bot_edge_rendered_ = false;

							if (_l._range_unit_ === 'px') {
								_u.progress.px = _l.range[0];
								_u.progress.f = _bcr.height === 0 ? 0 : _u.progress.px / _bcr.height;
							} else {
								// === 'f'
								_u.progress.f = _l.range[0];
								_u.progress.px = _bcr.height * _u.progress.f;
							}

							if (!_u._top_edge_rendered_) {
								_u._top_edge_rendered_ = true;
								_l.callback.apply(_u, _l.callbackArgs);
							} else {}
						} else {
							// Unit locates higher than Scrawler Baseline.

							_u._top_edge_rendered_ = false;

							if (_l._range_unit_ === 'px') {
								_u.progress.px = _l.range[1];
								_u.progress.f = _bcr.height === 0 ? 0 : _u.progress.px / _bcr.height;
							} else {
								// === 'f'
								_u.progress.f = _l.range[1];
								_u.progress.px = _bcr.height * _u.progress.f;
							}

							if (!_u._bot_edge_rendered_) {
								_u._bot_edge_rendered_ = true;
								_l.callback.apply(_u, _l.callbackArgs);
							} else {}
						}
					}
				} else {
					_l.callback.apply(_u, _l.callbackArgs);
				}
			}
		}
	}

	return Scrawler;
});

},{"../dist/Scrawler.min":1,"./Common":2,"./Logic":3}]},{},[6]);
