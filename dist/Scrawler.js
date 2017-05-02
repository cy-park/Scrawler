/*! Scrawler.js v1.2.1 | (c) 2016-2017 Chan Young Park | MIT License */ 
(function(global, factory) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    // AMD
    define(Scrawler);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS
    module.exports = factory();
  } else {
    // Browser global
    global.Scrawler = factory();
  }
})(typeof window !== 'undefined' ? window : this, function() {

  'use strict';

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
  function Scrawler() {
    var args = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};


    var _this_ = this;

    // Frames per second
    _this_.fps = args.fps || 0;

    // Variable to store original baseline value from args
    _this_._original_baseline_ = typeof args.baseline === 'number' ? args.baseline : args.baseline || 'center';

    // Baseline value converted to Scrawler.Position() === {px:N, f:N, vf:N}
    _this_.baseline = Common.calcBaseline(_this_._original_baseline_);

    // Number of idle Engine rounds
    _this_.idling = parseInt(args.idling) || 0;

    /** Under the hood */

    // Current direction of scroll
    _this_._dir_ = '';

    // Logics array. Scrawler.add() will push Logics in this array.
    _this_._logics_ = [];

    // rAF holder variable
    _this_._raf_ = null;

    // Previous scroll position by window.pageYOffset. Updates with every scroll.
    _this_._prev_px_position_ = 0;

    // Idle engine round counter
    _this_._idle_rounds_ = 0;

    _this_._scroll_event_initialized_ = false;

    window.addEventListener('resize', function() {
      _this_.refresh().run();
    });
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
  Scrawler.prototype.add = function(args, callback, callbackArgs) {
    var _this_ = this;
    args.id = args.id || 'lid_' + _this_._logics_.length;
    _this_._logics_.push(new Scrawler.Logic(args, callback, callbackArgs));
    return _this_;
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
  Scrawler.prototype.remove = function(lid) {
    var _this_ = this;
    for (var i = 0; i < _this_._logics_.length; i++) {
      if (_this_._logics_[i].id === lid) {
        _this_._logics_.splice(i, 1);
        return _this_;
      }
    }
    return _this_;
  };

  /**
   * Public Function Scrawler.sort()
   *
   * Sort Scrawler Logics.
   *
   * @return {Scrawler} Scrawler object
   */
  Scrawler.prototype.sort = function() {
    var _this_ = this;
    _this_._logics_.sort(function(a, b) {
      return a.order - b.order;
    });
    return _this_;
  };

  /**
   * Public Function Scrawler.run()
   *
   * Start/resume Scrawler to run added logics.
   * To run Scrawler in an already existing rAF, refer to Scrawler.watch().
   *
   * @return {Scrawler} Scrawler object
   */
  Scrawler.prototype.run = function() {
    var _this_ = this;
    if (!_this_._scroll_event_initialized_) {
      _this_._scroll_event_initialized_ = true;
      window.addEventListener('scroll', _this_.run.bind(_this_));
    }
    _this_._raf_ = window.requestAnimationFrame(engine.bind(_this_));
    return _this_;
  };

  /**
   * Public Function Scrawler.pause()
   *
   * Pause Scrawler.
   * Usually useful only when `idling` setting is `-1` or big enough.
   * Scrawler automatically pauses after reaching the assigned idling number.
   *
   * @return {Scrawler} Scrawler object
   */
  Scrawler.prototype.pause = function() {
    var _this_ = this;
    window.cancelAnimationFrame(_this_._raf_);
    _this_._raf_ = null;
    return _this_;
  };

  /**
   * Public Function Scrawler.watch()
   *
   * Initialize and run Scrawler in an existing rAF
   *
   * @return {Scrawler} Scrawler object
   */
  Scrawler.prototype.watch = function() {
    var _this_ = this;
    updateScrawlerDirection.call(_this_);
    updateUnitPositions.call(_this_);
    _this_._prev_px_position_ = window.pageYOffset;
    return _this_;
  };

  /**
   * Public Function Scrawler.refresh()
   *
   * Refresh all baseline and position data
   *
   * @return {Scrawler} Scrawler object
   */
  Scrawler.prototype.refresh = function() {
    var _this_ = this;

    updateScrawlerDirection.call(_this_, true);

    _this_.baseline = Common.calcBaseline(_this_._original_baseline_);

    for (var i = 0; i < _this_._logics_.length; i++) {
      var _l = _this_._logics_[i];
      for (var j = 0; j < _l.units.length; j++) {
        var _u = _l.units[j];
        _u.baseline = Common.calcBaseline(_l.baseline, _u.el);
      }
    }

    updateUnitPositions.call(_this_);
    _this_._prev_px_position_ = window.pageYOffset;

    return _this_;
  };

  function engine() {
    var _this_ = this;

    updateScrawlerDirection.call(_this_);

    if (_this_.idling < 0 || _this_.idling === 0 && _this_._dir_ !== 'stay' || _this_._idle_rounds_ < _this_.idling) {

      updateUnitPositions.call(_this_);

      _this_._prev_px_position_ = window.pageYOffset;
      _this_._raf_ = window.requestAnimationFrame(engine.bind(_this_));
    } else {
      if (_this_._raf_) _this_.pause();
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
    var _this_ = this;
    if (resizing) {
      _this_._dir_ = 'resizing';
    } else {
      if (_this_._prev_px_position_ === window.pageYOffset) {
        if (_this_._dir_ === 'stay') {
          if (_this_.idling >= 0) _this_._idle_rounds_++;
        } else if (_this_._dir_ === '') {
          _this_._dir_ = 'initialized';
        } else {
          _this_._dir_ = 'stay';
        }
      } else {
        _this_._idle_rounds_ = 0;
        if (_this_._prev_px_position_ < window.pageYOffset) _this_._dir_ = 'down';
        else _this_._dir_ = 'up';
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
    var _this_ = this;
    var wh = window.innerHeight;
    for (var i = 0; i < _this_._logics_.length; i++) {
      var _l = _this_._logics_[i];
      for (var j = 0; j < _l.units.length; j++) {
        var _u = _l.units[j];
        var _bcr = _u.el.getBoundingClientRect();
        // Update progress of each unit in a logic.
        _u.progress.px = _this_.baseline.px - (_bcr.top + _u.baseline.px);
        _u.progress.vf = _u.progress.px / wh;
        _u.progress.f = _bcr.height === 0 ? 0 : _u.progress.px / _bcr.height;

        if (_l.range) {

          if (_l.range[0] <= _u.progress[_l._range_unit_] && _u.progress[_l._range_unit_] <= _l.range[1]) {
            // In range

            // NOTE: Review & test required.
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

              _u.progress.vf = _u.progress.px / wh;

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

              _u.progress.vf = _u.progress.px / wh;

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

  var Common = {};

  Common.calcBaseline = function(baseline, el) {

    var wh = window.innerHeight;
    var _b = new Scrawler.Position();
    var _h = el ? el.getBoundingClientRect().height : wh;

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
          } else if (baseline.indexOf('f') !== -1) {
            if (baseline.indexOf('v') !== -1) {
              // viewport decimal
              _b.px = wh * parseFloat(baseline.replace('vf', ''));
              _b.f = _b.px / _h;
            } else {
              // decimal
              _b.f = parseFloat(baseline.replace('f', ''));
              _b.px = _h * _b.f;
            }
          } else {
            _px();
          }
        } else {
          _px();
        }
        break;
    }

    // TODO: create setF() and calculate f here. All initially should have px value.

    _b.vf = _b.px / wh;

    return _b;
  };

  /**
   * Class Scrawler.Logic(args, callback, callbackArgs)
   *
   * @param {object} args
   * 		  - refer to Scrawler.prototype.add() for more info.
   * @param {function} callback
   * @param {array} callbackArgs
   */
  Scrawler.Logic = function(args, callback) {
    var callbackArgs = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];


    var _this_ = this;

    _this_.id = args.id;
    _this_.el = args.el;
    _this_.order = args.order || 0;
    _this_.range = args.range || null; // Array(2) with From and To values.
    _this_.baseline = args.baseline || 0;
    _this_.callback = callback;
    _this_.callbackArgs = callbackArgs;
    _this_.nodelist = document.querySelectorAll(args.el);
    _this_.units = [];
    for (var i = 0; i < _this_.nodelist.length; i++) {
      _this_.units[i] = new Scrawler.Unit({
        el: _this_.nodelist[i],
        baseline: Common.calcBaseline(_this_.baseline, _this_.nodelist[i]),
        progress: new Scrawler.Position()
      });
    }

    _this_._range_unit_;

    if (_this_.range) {
      if (typeof _this_.range[1] === 'string') {
        if (_this_.range[1].indexOf('%') !== -1) {
          // percent
          _this_.range[0] = parseFloat(_this_.range[0].replace('%', '')) / 100;
          _this_.range[1] = parseFloat(_this_.range[1].replace('%', '')) / 100;
          _this_._range_unit_ = 'f';
        } else if (_this_.range[1].indexOf('f') !== -1) {
          if (_this_.range[1].indexOf('v') !== -1) {
            _this_.range[0] = parseFloat(_this_.range[0].replace('vf', ''));
            _this_.range[1] = parseFloat(_this_.range[1].replace('vf', ''));
            _this_._range_unit_ = 'vf';
          } else {
            _this_.range[0] = parseFloat(_this_.range[0].replace('f', ''));
            _this_.range[1] = parseFloat(_this_.range[1].replace('f', ''));
            _this_._range_unit_ = 'f';
          }
        } else {
          _this_._range_unit_ = 'px';
        }
      } else {
        _this_._range_unit_ = 'px';
      }
    }
  };

  /**
   * Class Scrawler.Position(args)
   *
   * Contains Scrawler Position value
   *
   * @param {object} args (default: {})
   *		  {int} args.f
   *		  		- unit interval based on unit height (fraction/float)
   *		  {int} args.vf
   *		  		- unit interval based on viewport height (fraction/float)
   *				- only exists for Unit Positions, not baseline Positions.
   *  	  {int} args.px
   *		  		- pixel value
   */
  Scrawler.Position = function() {
    var args = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    this.f = args.f || undefined; // unit interval based on unit height (fraction/float)
    this.vf = args.vf || undefined; // unit interval based on viewport height (fraction/float)
    this.px = args.px || undefined; // pixel
  };

  Scrawler.Unit = function(args) {

    var _this_ = this;

    _this_.el = args.el;
    _this_.baseline = args.baseline;
    _this_.progress = args.progress;
    _this_._top_edge_rendered_ = false;
    _this_._bot_edge_rendered_ = false;
    _this_.scales = args.scales || {};
  };

  Scrawler.Unit.prototype.f = function() {
    return this.progress.f;
  };

  Scrawler.Unit.prototype.px = function() {
    return this.progress.px;
  };

  Scrawler.Unit.prototype.vf = function() {
    return this.progress.vf;
  };

  Scrawler.Unit.prototype.scale = function(sid, args, callback) {
    var callbackArgs = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];


    var _this_ = this;

    sid = sid.toString();
    args.to = args.to || [0, 1];
    _this_.scales[sid] = _this_.scales[sid] || {
      _top_edge_rendered_: false,
      _bot_edge_rendered_: false
    };

    var f0 = args.from[0],
      f1 = args.from[1],
      t0 = args.to[0],
      t1 = args.to[1],
      _m = _this_.scales[sid],
      range_unit = void 0,
      val = void 0;

    if (typeof f1 === 'string') {
      if (f1.indexOf('%') !== -1) {
        // percent
        f0 = parseFloat(f0.replace('%', '')) / 100;
        f1 = parseFloat(f1.replace('%', '')) / 100;
        range_unit = 'f';
      } else if (f1.indexOf('f') !== -1) {
        if (f1.indexOf('v') !== -1) {
          // viewport decimal
          f0 = parseFloat(f0.replace('vf', ''));
          f1 = parseFloat(f1.replace('vf', ''));
          range_unit = 'vf';
        } else {
          // decimal
          f0 = parseFloat(f0.replace('f', ''));
          f1 = parseFloat(f1.replace('f', ''));
          range_unit = 'f';
        }
      } else {
        range_unit = 'px';
      }
    } else {
      range_unit = 'px';
    }

    var prg = _this_.progress[range_unit];

    if (f0 <= prg && prg <= f1) {

      _m._top_edge_rendered_ = false;
      _m._bot_edge_rendered_ = false;
      val = (prg - f0) / (f1 - f0) * (t1 - t0) + t0;
      callbackArgs.unshift(val);
      callback.apply(_this_, callbackArgs);
    } else {

      if (prg < f0) {

        _m._bot_edge_rendered_ = false;

        if (!_m._top_edge_rendered_) {
          _m._top_edge_rendered_ = true;
          prg = f0;
          val = (prg - f0) / (f1 - f0) * (t1 - t0) + t0;
          callbackArgs.unshift(val);
          callback.apply(_this_, callbackArgs);
        }
      } else {

        _m._top_edge_rendered_ = false;

        if (!_m._bot_edge_rendered_) {
          _m._bot_edge_rendered_ = true;
          prg = f1;
          val = (prg - f0) / (f1 - f0) * (t1 - t0) + t0;
          callbackArgs.unshift(val);
          callback.apply(_this_, callbackArgs);
        }
      }
    }
  };

  return Scrawler;
});