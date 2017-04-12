(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{"./Position":3}],2:[function(require,module,exports){
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

	self._range_unit;

	if (self.range) {
		if (typeof self.range[0] === 'string') {
			if (self.range[0].indexOf('%') !== -1) {
				// percent
				self.range[0] = parseFloat(self.range[0].replace('%', '')) / 100;
				self.range[1] = parseFloat(self.range[1].replace('%', '')) / 100;
				self._range_unit = 'f';
			} else {
				self._range_unit = 'px';
			}
		} else {
			self._range_unit = 'px';
		}
	}
};

module.exports = Logic;

},{"./Common":1,"./Position":3,"./Unit":4}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
'use strict';

var Unit = function Unit(args) {

	var self = this;

	self.el = args.el;
	self.baseline = args.baseline;
	self.progress = args.progress;
	self._top_edge_rendered = false;
	self._bot_edge_rendered = false;
	self.maps = args.maps || {};
};

Unit.prototype.map = function (mid, args, callback, callbackArgs) {

	var self = this;

	mid = mid.toString();
	args.to = args.to || [0, 1];
	callbackArgs = callbackArgs || [];
	self.maps[mid] = self.maps[mid] || { _top_edge_rendered: false, _bot_edge_rendered: false };

	var f0 = args.from[0],
	    f1 = args.from[1],
	    t0 = args.to[0],
	    t1 = args.to[1],
	    range_unit,
	    val;

	if (typeof f0 === 'string') {
		if (f0.indexOf('%') !== -1) {
			// percent
			range_unit = 'f';
			f0 = parseFloat(f0.replace('%', '')) / 100;
			f1 = parseFloat(f1.replace('%', '')) / 100;
		} else {
			range_unit = 'px';
		}
	} else {
		range_unit = 'px';
	}

	var prg = self.progress[range_unit];
	var _m = self.maps[mid];

	if (f0 <= prg && prg <= f1) {

		_m._top_edge_rendered = false;
		_m._bot_edge_rendered = false;
		val = (prg - f0) / (f1 - f0) * (t1 - t0) + t0;
		callbackArgs.unshift(val);
		callback.apply(self, callbackArgs);
	} else {

		if (prg < f0) {

			_m._bot_edge_rendered = false;

			if (!_m._top_edge_rendered) {
				_m._top_edge_rendered = true;
				prg = f0;
				val = (prg - f0) / (f1 - f0) * (t1 - t0) + t0;
				callbackArgs.unshift(val);
				callback.apply(self, callbackArgs);
			}
		} else {

			_m._top_edge_rendered = false;

			if (!_m._bot_edge_rendered) {
				_m._bot_edge_rendered = true;
				prg = f1;
				val = (prg - f0) / (f1 - f0) * (t1 - t0) + t0;
				callbackArgs.unshift(val);
				callback.apply(self, callbackArgs);
			}
		}
	}
};

module.exports = Unit;

},{}],5:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; /*! Scrawler.js v0.3.0 | (c) 2016-2017 Chan Young Park | MIT License */

var _Common = require('./Common');

var _Common2 = _interopRequireDefault(_Common);

var _Logic = require('./Logic');

var _Logic2 = _interopRequireDefault(_Logic);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

;(function (global, factory) {
	'use strict';

	if (typeof define === 'function' && define.amd) {
		// AMD
		define(Scrawler);
	} else if ((typeof module === 'undefined' ? 'undefined' : _typeof(module)) === 'object' && module.exports) {
		// CommonJS
		module.exports = global.Scrawler = factory();
	} else {
		// Browser global
		global.Scrawler = factory();
	}
})(typeof window !== 'undefined' ? window : undefined, function () {
	'use strict';

	var root = void 0;

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
		root._original_baseline = args.baseline || 'center';

		// Baseline value converted to Scrawler.Position() === {px:N, f:N}
		root.baseline = _Common2.default.calcBaseline(root._original_baseline);

		// Number of idle Engine rounds
		root.idling = parseInt(args.idling) || 0;

		/** Under the hood */

		// Current direction of scroll
		root._dir = '';

		// Logics array. Scrawler.add() will push Logics in this array.
		root._logics = [];

		// rAF holder variable
		root._raf = null;

		// Previous scroll position by window.pageYOffset. Updates with every scroll.
		root._prev_px_position = 0;

		// Idle engine round counter
		root._idle_rounds = 0;

		root._scroll_event_initialized = false;

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
		args.id = args.id || 'lid_' + root._logics.length;
		root._logics.push(new _Logic2.default(args, callback, callbackArgs));
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
		for (var i = 0; i < root._logics.length; i++) {
			if (root._logics[i].id === lid) {
				root._logics.splice(i, 1);
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
		root._logics.sort(function (a, b) {
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
		if (!root._scroll_event_initialized) {
			root._scroll_event_initialized = true;
			window.addEventListener('scroll', root.run);
		}
		root._raf = window.requestAnimationFrame(engine);
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
		window.cancelAnimationFrame(root._raf);
		root._raf = null;
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
		root._prev_px_position = window.pageYOffset;
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

		root.baseline = _Common2.default.calcBaseline(root._original_baseline);

		for (var i = 0; i < root._logics.length; i++) {
			var _l = root._logics[i];
			for (var j = 0; j < _l.units.length; j++) {
				var _u = _l.units[j];
				_u.baseline = _Common2.default.calcBaseline(_l.baseline, _u.el);
			}
		}

		updateUnitPositions();
		root._prev_px_position = window.pageYOffset;

		return root;
	};

	function engine() {

		updateScrawlerDirection();

		if (root.idling < 0 || root.idling === 0 && root._dir !== 'stay' || root._idle_rounds < root.idling) {

			updateUnitPositions();

			root._prev_px_position = window.pageYOffset;
			root._raf = window.requestAnimationFrame(engine);
		} else {
			if (root._raf) root.pause();
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
			root._dir = 'resizing';
		} else {
			if (root._prev_px_position === window.pageYOffset) {
				if (root._dir === 'stay') {
					if (root.idling >= 0) root._idle_rounds++;
				} else if (root._dir === '') {
					root._dir = 'initialized';
				} else {
					root._dir = 'stay';
				}
			} else {
				root._idle_rounds = 0;
				if (root._prev_px_position < window.pageYOffset) root._dir = 'down';else root._dir = 'up';
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
		for (var i = 0; i < root._logics.length; i++) {
			var _l = root._logics[i];
			for (var j = 0; j < _l.units.length; j++) {
				var _u = _l.units[j];
				var _bcr = _u.el.getBoundingClientRect();
				// Update progress of each unit in a logic.
				_u.progress.px = root.baseline.px - (_bcr.top + _u.baseline.px);
				_u.progress.f = _bcr.height === 0 ? 0 : _u.progress.px / _bcr.height;

				if (_l.range) {

					if (_l.range[0] <= _u.progress[_l._range_unit] && _u.progress[_l._range_unit] <= _l.range[1]) {
						// In range

						// TODO: Review & test required.
						// Editing this part as it should change the flags in edge cases.
						// Not completely removing legacy code as not yet tested.
						// _u._top_edge_rendered = false;
						// _u._bot_edge_rendered = false;
						_u._top_edge_rendered = _l.range[0] === _u.progress[_l._range_unit] ? true : false;
						_u._bot_edge_rendered = _l.range[1] === _u.progress[_l._range_unit] ? true : false;
						_l.callback.apply(_u, _l.callbackArgs);
					} else {
						// Out of range

						if (_u.progress[_l._range_unit] < _l.range[0]) {
							// Unit locates lower than Scrawler Baseline.

							_u._bot_edge_rendered = false;

							if (_l._range_unit === 'px') {
								_u.progress.px = _l.range[0];
								_u.progress.f = _bcr.height === 0 ? 0 : _u.progress.px / _bcr.height;
							} else {
								// === 'f'
								_u.progress.f = _l.range[0];
								_u.progress.px = _bcr.height * _u.progress.f;
							}

							if (!_u._top_edge_rendered) {
								_u._top_edge_rendered = true;
								_l.callback.apply(_u, _l.callbackArgs);
							} else {}
						} else {
							// Unit locates higher than Scrawler Baseline.

							_u._top_edge_rendered = false;

							if (_l._range_unit === 'px') {
								_u.progress.px = _l.range[1];
								_u.progress.f = _bcr.height === 0 ? 0 : _u.progress.px / _bcr.height;
							} else {
								// === 'f'
								_u.progress.f = _l.range[1];
								_u.progress.px = _bcr.height * _u.progress.f;
							}

							if (!_u._bot_edge_rendered) {
								_u._bot_edge_rendered = true;
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

},{"./Common":1,"./Logic":2}]},{},[5])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvQ29tbW9uLmpzIiwic3JjL0xvZ2ljLmpzIiwic3JjL1Bvc2l0aW9uLmpzIiwic3JjL1VuaXQuanMiLCJzcmMvbWFpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBOztBQUVBOzs7Ozs7QUFFQSxJQUFNLFNBQVMsRUFBZjs7QUFFQSxPQUFPLFlBQVAsR0FBc0IsVUFBUyxRQUFULEVBQW1CLEVBQW5CLEVBQXNCOztBQUUzQyxLQUFJLEtBQUssd0JBQVQ7QUFDQSxLQUFJLEtBQUssS0FBSyxHQUFHLHFCQUFILEdBQTJCLE1BQWhDLEdBQXlDLE9BQU8sV0FBekQ7O0FBRUEsU0FBUSxRQUFSOztBQUVDLE9BQUssS0FBTDtBQUNDLE1BQUcsRUFBSCxHQUFRLENBQVI7QUFDQSxNQUFHLENBQUgsR0FBUSxDQUFSO0FBQ0E7O0FBRUQsT0FBSyxRQUFMO0FBQ0MsTUFBRyxFQUFILEdBQVEsS0FBRyxDQUFYO0FBQ0EsTUFBRyxDQUFILEdBQVEsRUFBUjtBQUNBOztBQUVELE9BQUssUUFBTDtBQUNDLE1BQUcsRUFBSCxHQUFRLEVBQVI7QUFDQSxNQUFHLENBQUgsR0FBUSxDQUFSO0FBQ0E7O0FBRUQ7QUFDQyxPQUFJLE1BQU0sU0FBTixHQUFNLEdBQVU7QUFDbkI7QUFDQSxPQUFHLEVBQUgsR0FBUSxXQUFXLFFBQVgsQ0FBUjtBQUNBLE9BQUcsQ0FBSCxHQUFRLFdBQVMsRUFBakI7QUFDQSxJQUpEO0FBS0EsT0FBSSxPQUFPLFFBQVAsS0FBb0IsUUFBeEIsRUFBa0M7QUFDakMsUUFBSSxTQUFTLE9BQVQsQ0FBaUIsR0FBakIsTUFBMEIsQ0FBQyxDQUEvQixFQUFrQztBQUNqQztBQUNBLFFBQUcsQ0FBSCxHQUFRLFdBQVcsU0FBUyxPQUFULENBQWlCLEdBQWpCLEVBQXFCLEVBQXJCLENBQVgsSUFBdUMsR0FBL0M7QUFDQSxRQUFHLEVBQUgsR0FBUSxLQUFHLEdBQUcsQ0FB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QixHQUF3QixHQUFHLFFBQUgsQ0FBWSxFQUFaLEdBQWlCLEtBQUssTUFBL0Q7QUFDQSxRQUhELE1BR087QUFBRTtBQUNSLFdBQUcsUUFBSCxDQUFZLENBQVosR0FBaUIsR0FBRyxLQUFILENBQVMsQ0FBVCxDQUFqQjtBQUNBLFdBQUcsUUFBSCxDQUFZLEVBQVosR0FBaUIsS0FBSyxNQUFMLEdBQWMsR0FBRyxRQUFILENBQVksQ0FBM0M7QUFDQTs7QUFFRCxXQUFJLENBQUMsR0FBRyxrQkFBUixFQUE0QjtBQUMzQixXQUFHLGtCQUFILEdBQXdCLElBQXhCO0FBQ0EsV0FBRyxRQUFILENBQVksS0FBWixDQUFrQixFQUFsQixFQUFzQixHQUFHLFlBQXpCO0FBQ0EsUUFIRCxNQUdPLENBQUU7QUFDVDtBQUNEO0FBRUQsS0F2REQsTUF1RE87QUFDTixRQUFHLFFBQUgsQ0FBWSxLQUFaLENBQWtCLEVBQWxCLEVBQXNCLEdBQUcsWUFBekI7QUFDQTtBQUNEO0FBQ0Q7QUFDRDs7QUFFRCxRQUFPLFFBQVA7QUFDQSxDQS9WQyxDQUFEIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IFBvc2l0aW9uIGZyb20gJy4vUG9zaXRpb24nO1xuXG5jb25zdCBDb21tb24gPSB7fTtcblxuQ29tbW9uLmNhbGNCYXNlbGluZSA9IGZ1bmN0aW9uKGJhc2VsaW5lLCBlbCl7XG5cblx0dmFyIF9iID0gbmV3IFBvc2l0aW9uKCk7XG5cdHZhciBfaCA9IGVsID8gZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkuaGVpZ2h0IDogd2luZG93LmlubmVySGVpZ2h0O1xuXG5cdHN3aXRjaCAoYmFzZWxpbmUpIHtcblxuXHRcdGNhc2UgJ3RvcCc6XG5cdFx0XHRfYi5weCA9IDA7XG5cdFx0XHRfYi5mICA9IDA7XG5cdFx0XHRicmVhaztcblxuXHRcdGNhc2UgJ2NlbnRlcic6XG5cdFx0XHRfYi5weCA9IF9oLzI7XG5cdFx0XHRfYi5mICA9IC41O1xuXHRcdFx0YnJlYWs7XG5cblx0XHRjYXNlICdib3R0b20nOlxuXHRcdFx0X2IucHggPSBfaDtcblx0XHRcdF9iLmYgID0gMTtcblx0XHRcdGJyZWFrO1xuXG5cdFx0ZGVmYXVsdDpcblx0XHRcdHZhciBfcHggPSBmdW5jdGlvbigpe1xuXHRcdFx0XHQvLyBweFxuXHRcdFx0XHRfYi5weCA9IHBhcnNlRmxvYXQoYmFzZWxpbmUpO1xuXHRcdFx0XHRfYi5mICA9IGJhc2VsaW5lL19oO1xuXHRcdFx0fTtcblx0XHRcdGlmICh0eXBlb2YgYmFzZWxpbmUgPT09ICdzdHJpbmcnKSB7XG5cdFx0XHRcdGlmIChiYXNlbGluZS5pbmRleE9mKCclJykgIT09IC0xKSB7XG5cdFx0XHRcdFx0Ly8gcGVyY2VudFxuXHRcdFx0XHRcdF9iLmYgID0gcGFyc2VGbG9hdChiYXNlbGluZS5yZXBsYWNlKCclJywnJykpIC8gMTAwO1xuXHRcdFx0XHRcdF9iLnB4ID0gX2gqX2IuZjtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRfcHgoKTtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0X3B4KCk7XG5cdFx0XHR9XG5cdFx0XHRicmVhaztcblx0fVxuXG5cdHJldHVybiBfYjtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQ29tbW9uO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgQ29tbW9uIGZyb20gJy4vQ29tbW9uJztcbmltcG9ydCBVbml0IGZyb20gJy4vVW5pdCc7XG5pbXBvcnQgUG9zaXRpb24gZnJvbSAnLi9Qb3NpdGlvbic7XG5cbi8qKlxuICogQ2xhc3MgTG9naWMoYXJncywgY2FsbGJhY2ssIGNhbGxiYWNrQXJncylcbiAqIFxuICogQHBhcmFtIHtvYmplY3R9IGFyZ3NcbiAqIFx0XHQgIC0gcmVmZXIgdG8gU2NyYXdsZXIucHJvdG90eXBlLmFkZCgpIGZvciBtb3JlIGluZm8uXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFja1xuICogQHBhcmFtIHthcnJheX0gY2FsbGJhY2tBcmdzXG4gKi9cbmNvbnN0IExvZ2ljID0gZnVuY3Rpb24oYXJncywgY2FsbGJhY2ssIGNhbGxiYWNrQXJncyl7XG5cblx0dmFyIHNlbGYgPSB0aGlzO1xuXG5cdHNlbGYuaWQgPSBhcmdzLmlkO1xuXHRzZWxmLmVsID0gYXJncy5lbDtcblx0c2VsZi5vcmRlciA9IGFyZ3Mub3JkZXIgfHwgMDtcblx0c2VsZi5jYWxsYmFjayA9IGNhbGxiYWNrO1xuXHRzZWxmLmNhbGxiYWNrQXJncyA9IGNhbGxiYWNrQXJncyB8fCBbXTtcblx0c2VsZi5yYW5nZSA9IGFyZ3MucmFuZ2UgfHwgbnVsbDsgLy8gQXJyYXkoMikgd2l0aCBGcm9tIGFuZCBUbyB2YWx1ZXMuIFxuXHRzZWxmLmJhc2VsaW5lID0gYXJncy5iYXNlbGluZXx8MDtcblx0c2VsZi5ub2RlbGlzdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoYXJncy5lbCk7XG5cdHNlbGYudW5pdHMgPSBbXTtcblx0Zm9yICh2YXIgaSA9IDA7IGkgPCBzZWxmLm5vZGVsaXN0Lmxlbmd0aDsgaSsrKSB7XG5cdFx0c2VsZi51bml0c1tpXSA9IG5ldyBVbml0KHtcblx0XHRcdGVsOiBzZWxmLm5vZGVsaXN0W2ldLFxuXHRcdFx0YmFzZWxpbmU6IENvbW1vbi5jYWxjQmFzZWxpbmUoc2VsZi5iYXNlbGluZSwgc2VsZi5ub2RlbGlzdFtpXSksXG5cdFx0XHRwcm9ncmVzczogbmV3IFBvc2l0aW9uKClcblx0XHR9KTtcblx0fVxuXG5cdHNlbGYuX3JhbmdlX3VuaXQ7XG5cblx0aWYgKHNlbGYucmFuZ2UpIHtcblx0XHRpZiAodHlwZW9mIHNlbGYucmFuZ2VbMF0gPT09ICdzdHJpbmcnKSB7XG5cdFx0XHRpZiAoc2VsZi5yYW5nZVswXS5pbmRleE9mKCclJykgIT09IC0xKSB7XG5cdFx0XHRcdC8vIHBlcmNlbnRcblx0XHRcdFx0c2VsZi5yYW5nZVswXSA9IHBhcnNlRmxvYXQoc2VsZi5yYW5nZVswXS5yZXBsYWNlKCclJywnJykpIC8gMTAwO1xuXHRcdFx0XHRzZWxmLnJhbmdlWzFdID0gcGFyc2VGbG9hdChzZWxmLnJhbmdlWzFdLnJlcGxhY2UoJyUnLCcnKSkgLyAxMDA7XG5cdFx0XHRcdHNlbGYuX3JhbmdlX3VuaXQgPSAnZic7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRzZWxmLl9yYW5nZV91bml0ID0gJ3B4Jztcblx0XHRcdH1cblx0XHR9IGVsc2Uge1xuXHRcdFx0c2VsZi5fcmFuZ2VfdW5pdCA9ICdweCc7XG5cdFx0fVxuXHR9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IExvZ2ljO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIENsYXNzIFBvc2l0aW9uKGFyZ3MpXG4gKlxuICogQ29udGFpbnMgU2NyYXdsZXIgUG9zaXRpb24gdmFsdWUgXG4gKiBcbiAqIEBwYXJhbSB7b2JqZWN0fSBhcmdzIChkZWZhdWx0OiB7fSlcbiAqXHRcdCAge2ludH0gYXJncy5mXG4gKlx0XHQgIFx0XHQtIHVuaXQgaW50ZXJ2YWwgKGZyYWN0aW9uL2Zsb2F0KVxuICogIFx0ICB7aW50fSBhcmdzLnB4XG4gKlx0XHQgIFx0XHQtIHBpeGVsIHZhbHVlXG4gKi9cbmNvbnN0IFBvc2l0aW9uID0gZnVuY3Rpb24oYXJncyA9IHt9KXtcblx0dGhpcy5mICA9IGFyZ3MuZiAgfHwgdW5kZWZpbmVkOyAvLyB1bml0IGludGVydmFsIChmcmFjdGlvbi9mbG9hdClcblx0dGhpcy5weCA9IGFyZ3MucHggfHwgdW5kZWZpbmVkOyAvLyBwaXhlbFxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBQb3NpdGlvbjtcbiIsIid1c2Ugc3RyaWN0JztcblxuY29uc3QgVW5pdCA9IGZ1bmN0aW9uKGFyZ3Mpe1xuXHRcblx0dmFyIHNlbGYgPSB0aGlzO1xuXG5cdHNlbGYuZWwgPSBhcmdzLmVsO1xuXHRzZWxmLmJhc2VsaW5lID0gYXJncy5iYXNlbGluZTtcblx0c2VsZi5wcm9ncmVzcyA9IGFyZ3MucHJvZ3Jlc3M7XG5cdHNlbGYuX3RvcF9lZGdlX3JlbmRlcmVkID0gZmFsc2U7XG5cdHNlbGYuX2JvdF9lZGdlX3JlbmRlcmVkID0gZmFsc2U7XG5cdHNlbGYubWFwcyA9IGFyZ3MubWFwcyB8fCB7fTtcbn07XG5cblVuaXQucHJvdG90eXBlLm1hcCA9IGZ1bmN0aW9uKG1pZCwgYXJncywgY2FsbGJhY2ssIGNhbGxiYWNrQXJncyl7XG5cblx0dmFyIHNlbGYgPSB0aGlzO1xuXG5cdG1pZCA9IG1pZC50b1N0cmluZygpO1xuXHRhcmdzLnRvID0gYXJncy50byB8fCBbMCwxXTtcblx0Y2FsbGJhY2tBcmdzID0gY2FsbGJhY2tBcmdzIHx8IFtdO1xuXHRzZWxmLm1hcHNbbWlkXSA9IHNlbGYubWFwc1ttaWRdIHx8IHtfdG9wX2VkZ2VfcmVuZGVyZWQ6IGZhbHNlLCBfYm90X2VkZ2VfcmVuZGVyZWQ6IGZhbHNlfTtcblxuXHR2YXIgZjAgPSBhcmdzLmZyb21bMF0sXG5cdFx0ZjEgPSBhcmdzLmZyb21bMV0sXG5cdFx0dDAgPSBhcmdzLnRvWzBdLFxuXHRcdHQxID0gYXJncy50b1sxXSxcblx0XHRyYW5nZV91bml0LFxuXHRcdHZhbDtcblx0XG5cdGlmICh0eXBlb2YgZjAgPT09ICdzdHJpbmcnKSB7XG5cdFx0aWYgKGYwLmluZGV4T2YoJyUnKSAhPT0gLTEpIHtcblx0XHRcdC8vIHBlcmNlbnRcblx0XHRcdHJhbmdlX3VuaXQgPSAnZidcblx0XHRcdGYwID0gcGFyc2VGbG9hdChmMC5yZXBsYWNlKCclJywnJykpIC8gMTAwO1xuXHRcdFx0ZjEgPSBwYXJzZUZsb2F0KGYxLnJlcGxhY2UoJyUnLCcnKSkgLyAxMDA7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJhbmdlX3VuaXQgPSAncHgnXG5cdFx0fVxuXHR9IGVsc2Uge1xuXHRcdHJhbmdlX3VuaXQgPSAncHgnXG5cdH1cblxuXHR2YXIgcHJnID0gc2VsZi5wcm9ncmVzc1tyYW5nZV91bml0XTtcblx0dmFyIF9tID0gc2VsZi5tYXBzW21pZF07XG5cblx0aWYgKGYwIDw9IHByZyAmJiBwcmcgPD0gZjEpIHtcblxuXHRcdF9tLl90b3BfZWRnZV9yZW5kZXJlZCA9IGZhbHNlO1xuXHRcdF9tLl9ib3RfZWRnZV9yZW5kZXJlZCA9IGZhbHNlO1xuXHRcdHZhbCA9IChwcmcgLSBmMCkgLyAoZjEtZjApICogKHQxLXQwKSArIHQwO1xuXHRcdGNhbGxiYWNrQXJncy51bnNoaWZ0KHZhbCk7XG5cdFx0Y2FsbGJhY2suYXBwbHkoc2VsZiwgY2FsbGJhY2tBcmdzKTtcblxuXHR9IGVsc2Uge1xuXG5cdFx0aWYgKHByZyA8IGYwKSB7XG5cblx0XHRcdF9tLl9ib3RfZWRnZV9yZW5kZXJlZCA9IGZhbHNlO1xuXG5cdFx0XHRpZiAoIV9tLl90b3BfZWRnZV9yZW5kZXJlZCkge1xuXHRcdFx0XHRfbS5fdG9wX2VkZ2VfcmVuZGVyZWQgPSB0cnVlO1xuXHRcdFx0XHRwcmcgPSBmMDtcblx0XHRcdFx0dmFsID0gKHByZyAtIGYwKSAvIChmMS1mMCkgKiAodDEtdDApICsgdDA7XG5cdFx0XHRcdGNhbGxiYWNrQXJncy51bnNoaWZ0KHZhbCk7XG5cdFx0XHRcdGNhbGxiYWNrLmFwcGx5KHNlbGYsIGNhbGxiYWNrQXJncyk7XG5cdFx0XHR9XG5cblx0XHR9IGVsc2Uge1xuXG5cdFx0XHRfbS5fdG9wX2VkZ2VfcmVuZGVyZWQgPSBmYWxzZTtcblxuXHRcdFx0aWYgKCFfbS5fYm90X2VkZ2VfcmVuZGVyZWQpIHtcblx0XHRcdFx0X20uX2JvdF9lZGdlX3JlbmRlcmVkID0gdHJ1ZTtcblx0XHRcdFx0cHJnID0gZjE7XG5cdFx0XHRcdHZhbCA9IChwcmcgLSBmMCkgLyAoZjEtZjApICogKHQxLXQwKSArIHQwO1xuXHRcdFx0XHRjYWxsYmFja0FyZ3MudW5zaGlmdCh2YWwpO1xuXHRcdFx0XHRjYWxsYmFjay5hcHBseShzZWxmLCBjYWxsYmFja0FyZ3MpO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBVbml0O1xuIiwiLyohIFNjcmF3bGVyLmpzIHYwLjMuMCB8IChjKSAyMDE2LTIwMTcgQ2hhbiBZb3VuZyBQYXJrIHwgTUlUIExpY2Vuc2UgKi9cblxuaW1wb3J0IENvbW1vbiBmcm9tICcuL0NvbW1vbic7XG5pbXBvcnQgTG9naWMgZnJvbSAnLi9Mb2dpYyc7XG5cbjsoZnVuY3Rpb24gKGdsb2JhbCwgZmFjdG9yeSkge1xuXHQndXNlIHN0cmljdCc7XG5cdGlmKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuXHRcdC8vIEFNRFxuXHRcdGRlZmluZShTY3Jhd2xlcik7XG5cdH0gZWxzZSBpZih0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0JyAmJiBtb2R1bGUuZXhwb3J0cykge1xuXHRcdC8vIENvbW1vbkpTXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSAoZ2xvYmFsLlNjcmF3bGVyID0gZmFjdG9yeSgpKTtcblx0fSBlbHNlIHtcblx0XHQvLyBCcm93c2VyIGdsb2JhbFxuXHRcdGdsb2JhbC5TY3Jhd2xlciA9IGZhY3RvcnkoKTtcblx0fVxufSh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyA/IHdpbmRvdyA6IHRoaXMsIGZ1bmN0aW9uKCkge1xuXHQndXNlIHN0cmljdCc7XG5cblx0bGV0IHJvb3Q7XG5cblx0LyoqXG5cdCAqIENvbnN0cnVjdG9yIFNjcmF3bGVyKGFyZ3MpXG5cdCAqIFxuXHQgKiBAcGFyYW0ge29iamVjdH0gW2FyZ3NdIChkZWZhdWx0OiB7fSlcblx0ICogQHBhcmFtIHtpbnR9IFthcmdzLmZwc10gKGRlZmF1bHQ6IDApIEN1cnJlbnRseSBub3QgaW1wbGVtZW50ZWQuXG5cdCAqXHRcdCAgRnJhbWVzIHBlciBzZWNvbmQuXG5cdCAqXHRcdCAgMDogYXV0byBmcHNcblx0ICogQHBhcmFtIHtpbnR8c3RyaW5nfSBbYXJncy5iYXNlbGluZV0gKGRlZmF1bHQ6IDApXG5cdCAqXHRcdCAgU2NyYXdsZXIncyBiYXNlbGluZSBwb3NpdGlvbi4gQWxsIHVuaXRzIHdpbGwgcmVmZXJlbmNlIHRoaXMgYmFzZWxpbmUuXG5cdCAqXHRcdCAgQXZhaWxhYmxlIHZhbHVlczpcblx0ICpcdFx0ICAtIGludGVnZXI6IHBpeGVsIGRpc3RhbmNlIGZyb20gdGhlIHRvcCBvZiB0aGUgdmlld3BvcnQuXG5cdCAqXHRcdCAgLSBzdHJpbmc6ICd0b3AnLCAnY2VudGVyJywgJ2JvdHRvbScsIG9yICcwJScgdG8gJzEwMCUnIGFzIGEgc3RyaW5nXG5cdCAqIEBwYXJhbSB7aW50fSBbaWRsaW5nXSAoZGVmYXVsdDogMClcblx0ICpcdFx0ICBOdW1iZXIgb2Ygcm91bmRzIHRoYXQgRW5naW5lIHJ1bnMgYWZ0ZXIgc2Nyb2xsIHN0b3BzLiBcblx0ICogXHRcdCAgVXN1YWxseSwgdGhlcmUgaXMgbm8gbmVlZCB0byBydW4gRW5naW5lIGFmdGVyIHNjcm9sbCBzdG9wcy5cblx0ICogXHRcdCAgSWYgdGhpcyB2YWx1ZSBpcyAtMSwgRW5naW5lIHdpbGwgYmUgYWx3YXlzIHJ1bm5pbmcgcmVnYXJkbGVzcyBvZiBzY3JvbGwuXG5cdCAqXHRcdCAgRW5naW5lIHJ1bm5pbmcgPT09IHJlcXVlc3RBbmltYXRpb25GcmFtZSgpXG5cdCAqL1xuXHR2YXIgU2NyYXdsZXIgPSBmdW5jdGlvbihhcmdzKSB7XG5cblx0XHRyb290ID0gdGhpcztcblxuXHRcdGFyZ3MgPSBhcmdzIHx8IHt9O1xuXG5cdFx0Ly8gRnJhbWVzIHBlciBzZWNvbmRcblx0XHRyb290LmZwcyA9IGFyZ3MuZnBzIHx8IDA7XG5cblx0XHQvLyBWYXJpYWJsZSB0byBzdG9yZSBvcmlnaW5hbCBiYXNlbGluZSB2YWx1ZSBmcm9tIGFyZ3Ncblx0XHRyb290Ll9vcmlnaW5hbF9iYXNlbGluZSA9IGFyZ3MuYmFzZWxpbmUgfHwgJ2NlbnRlcic7XG5cblx0XHQvLyBCYXNlbGluZSB2YWx1ZSBjb252ZXJ0ZWQgdG8gU2NyYXdsZXIuUG9zaXRpb24oKSA9PT0ge3B4Ok4sIGY6Tn1cblx0XHRyb290LmJhc2VsaW5lID0gQ29tbW9uLmNhbGNCYXNlbGluZShyb290Ll9vcmlnaW5hbF9iYXNlbGluZSk7XG5cblx0XHQvLyBOdW1iZXIgb2YgaWRsZSBFbmdpbmUgcm91bmRzXG5cdFx0cm9vdC5pZGxpbmcgPSBwYXJzZUludChhcmdzLmlkbGluZyl8fDA7XG5cblx0XHQvKiogVW5kZXIgdGhlIGhvb2QgKi9cblxuXHRcdC8vIEN1cnJlbnQgZGlyZWN0aW9uIG9mIHNjcm9sbFxuXHRcdHJvb3QuX2RpciA9ICcnO1xuXG5cdFx0Ly8gTG9naWNzIGFycmF5LiBTY3Jhd2xlci5hZGQoKSB3aWxsIHB1c2ggTG9naWNzIGluIHRoaXMgYXJyYXkuXG5cdFx0cm9vdC5fbG9naWNzID0gW107XG5cblx0XHQvLyByQUYgaG9sZGVyIHZhcmlhYmxlXG5cdFx0cm9vdC5fcmFmID0gbnVsbDtcblxuXHRcdC8vIFByZXZpb3VzIHNjcm9sbCBwb3NpdGlvbiBieSB3aW5kb3cucGFnZVlPZmZzZXQuIFVwZGF0ZXMgd2l0aCBldmVyeSBzY3JvbGwuXG5cdFx0cm9vdC5fcHJldl9weF9wb3NpdGlvbiA9IDA7XG5cblx0XHQvLyBJZGxlIGVuZ2luZSByb3VuZCBjb3VudGVyXG5cdFx0cm9vdC5faWRsZV9yb3VuZHMgPSAwO1xuXG5cdFx0cm9vdC5fc2Nyb2xsX2V2ZW50X2luaXRpYWxpemVkID0gZmFsc2U7XG5cblx0XHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgcm9vdC5yZWZyZXNoKTtcblx0fTtcblxuXHQvKipcblx0ICogUHVibGljIEZ1bmN0aW9uIFNjcmF3bGVyLmFkZChhcmdzLCBjYWxsYmFjaywgY2FsbGJhY2tBcmdzKVxuXHQgKlxuXHQgKiBBZGQgYSBMb2dpYyB0byBTY3Jhd2xlci5cblx0ICogQSBMb2dpYyBjb250YWlucyBjb2RlIGhvdyBkZXNpZ25hdGVkIERPTSBlbGVtZW50KHMpXG5cdCAqIHdpbGwgcmVhY3QgYmFzZWQgb24gc2Nyb2xscy5cblx0ICogT25jZSBhIExvZ2ljIGlzIHJlZ2lzdGVyZWQgYnkgU2NyYXdsZXIuYWRkKCksIFxuXHQgKiBTY3Jhd2xlciB3aWxsIGF1dG9tYXRpY2FsbHkgcnVuIGVhY2ggXG5cdCAqIHJlZ2lzdGVyZWQgTG9naWMgd2hlbiBzY3JvbGwgZXZlbnRzIGhhcHBlbi5cblx0ICpcblx0ICogQHBhcmFtIHtvYmplY3R9IGFyZ3Ncblx0ICogQHBhcmFtIHtzdHJpbmd9IGFyZ3MuZWxcblx0ICpcdFx0ICBRdWVyeSBzZWxlY3RvciBmb3IgRE9NIGVsZW1lbnRzLlxuXHQgKiBAcGFyYW0ge2FycmF5KDIpfSBbYXJncy5yYW5nZV0gKGRlZmF1bHQ6IG51bGwpXG5cdCAqXHRcdCAgUmFuZ2Ugd2hlcmUgdGhpcyBMb2dpYyB3aWxsIGJlIGV4ZWN1dGVkLlxuXHQgKlx0XHQgIElmIG51bGwsIHRoZSBjYWxsYmFjayBmdW5jdGlvbiB3aWxsIHJ1biByZWdhcmRsZXNzIG9mIHNjcm9sbCBwb3NpdGlvbi5cblx0ICpcdFx0ICBSYW5nZSBjYW4gYmUgZWl0aGVyIHBlcmNlbnRhZ2Ugb3IgcGl4ZWwuIFxuXHQgKlx0XHQgIGkuZS4pIFsnMCUnLCcxMDAlJ10gb3IgWzAsIDUwMDBdXG5cdCAqIEBwYXJhbSB7aW50fHN0cmluZ30gW2FyZ3MuYmFzZWxpbmVdIChkZWZhdWx0OiAwKVxuXHQgKlx0XHQgIFRoZSBET00gZWxlbWVudCdzIGJhc2VsaW5lIHBvc2l0aW9uLiBTY3Jhd2xlciBtZWFzdXJlcyB0aGUgZGlzdGFuY2UgYmV0d2VlbiB2aWV3cG9ydCBiYXNlbGluZSBhbmQgdGhpcyBiYXNlbGluZS5cblx0ICpcdFx0ICBBdmFpbGFibGUgdmFsdWVzOlxuXHQgKlx0XHQgIC0gaW50ZWdlcjogcGl4ZWwgZGlzdGFuY2UgZnJvbSB0aGUgdG9wIG9mIHRoZSB2aWV3cG9ydC5cblx0ICpcdFx0ICAtIHN0cmluZzogJ3RvcCcsICdjZW50ZXInLCAnYm90dG9tJywgb3IgJzAlJyB0byAnMTAwJScgYXMgYSBzdHJpbmdcblx0ICogQHBhcmFtIHtzdHJpbmd9IFthcmdzLmlkXSAoZGVmYXVsdDogcmFuZG9tKVxuXHQgKlx0XHQgIExvZ2ljIElELiBSZXF1aXJlZCBpZiB0aGlzIExvZ2ljIGlzIGV4cGVjdGVkIHRvIGJlIHJlbW92ZWQgbGF0ZXIuXG5cdCAqIEBwYXJhbSB7aW50fSBhcmdzLm9yZGVyIChkZWZhdWx0OiAwKVxuXHQgKlx0XHQgIC8vIFRPRE86IE5vdCBpbXBsZW1lbnRlZCB5ZXQuIE5vdCBzdXJlIHdoZW4gdG8gcnVuIHNvcnQoKS5cblx0ICpcdFx0ICBSdW5uaW5nIG9yZGVyIG9mIExvZ2ljXG5cdCAqXHRcdCAgQmlnZ2VyIG9yZGVyIG51bWJlciB3aWxsIHJ1biBsYXRlci5cblx0ICogQHBhcmFtIHtmdW5jdGlvbn0gY2FsbGJhY2tcblx0ICpcdFx0ICBUaGlzIGZ1bmN0aW9uIHdpbGwgcnVuIGFuZCBhcHBseSBvbiBET00gZWxlbWVudHNcblx0ICpcdFx0ICBzZWxlY3RlZCBieSBhcmdzLmVsIHdoZW4gc2Nyb2xsIGV2ZW50cyBoYXBwZW4uXG5cdCAqIEBwYXJhbSB7YXJyYXl9IFtjYWxsYmFja0FyZ3NdXG5cdCAqXHRcdCAgYXJncyBmb3IgY2FsbGJhY2sgZnVuY3Rpb25cblx0ICpcblx0ICogQHJldHVybiB7U2NyYXdsZXJ9IFNjcmF3bGVyIG9iamVjdFxuXHQgKi9cblx0U2NyYXdsZXIucHJvdG90eXBlLmFkZCA9IGZ1bmN0aW9uKGFyZ3MsIGNhbGxiYWNrLCBjYWxsYmFja0FyZ3Mpe1xuXHRcdGFyZ3MuaWQgPSBhcmdzLmlkIHx8ICdsaWRfJytyb290Ll9sb2dpY3MubGVuZ3RoO1xuXHRcdHJvb3QuX2xvZ2ljcy5wdXNoKG5ldyBMb2dpYyhhcmdzLCBjYWxsYmFjaywgY2FsbGJhY2tBcmdzKSk7XG5cdFx0cmV0dXJuIHJvb3Q7XG5cdH07XG5cblx0LyoqXG5cdCAqIFB1YmxpYyBGdW5jdGlvbiBTY3Jhd2xlci5yZW1vdmUobGlkKVxuXHQgKlxuXHQgKiBSZW1vdmUgYSBMb2dpYyBmcm9tIFNjcmF3bGVyLlxuXHQgKlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gbGlkXG5cdCAqXHRcdCAgSUQgZm9yIExvZ2ljIHRvIHJlbW92ZVxuXHQgKlxuXHQgKiBAcmV0dXJuIHtTY3Jhd2xlcn0gU2NyYXdsZXIgb2JqZWN0XG5cdCAqL1xuXHRTY3Jhd2xlci5wcm90b3R5cGUucmVtb3ZlID0gZnVuY3Rpb24obGlkKXtcblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHJvb3QuX2xvZ2ljcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0aWYgKHJvb3QuX2xvZ2ljc1tpXS5pZCA9PT0gbGlkKSB7XG5cdFx0XHRcdHJvb3QuX2xvZ2ljcy5zcGxpY2UoaSwgMSk7XG5cdFx0XHRcdHJldHVybiByb290O1xuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4gcm9vdDtcblx0fTtcblxuXHQvKipcblx0ICogUHVibGljIEZ1bmN0aW9uIFNjcmF3bGVyLnNvcnQoKVxuXHQgKlxuXHQgKiBTb3J0IFNjcmF3bGVyIExvZ2ljcy5cblx0ICpcblx0ICogQHJldHVybiB7U2NyYXdsZXJ9IFNjcmF3bGVyIG9iamVjdFxuXHQgKi9cblx0U2NyYXdsZXIucHJvdG90eXBlLnNvcnQgPSBmdW5jdGlvbigpe1xuXHRcdHJvb3QuX2xvZ2ljcy5zb3J0KGZ1bmN0aW9uKGEsIGIpe1xuXHRcdFx0cmV0dXJuIGEub3JkZXIgLSBiLm9yZGVyO1xuXHRcdH0pO1xuXHRcdHJldHVybiByb290O1xuXHR9O1xuXG5cdC8qKlxuXHQgKiBQdWJsaWMgRnVuY3Rpb24gU2NyYXdsZXIucnVuKClcblx0ICpcblx0ICogU3RhcnQvcmVzdW1lIFNjcmF3bGVyIHRvIHJ1biBhZGRlZCBsb2dpY3MuXG5cdCAqIFRvIHJ1biBTY3Jhd2xlciBpbiBhbiBhbHJlYWR5IGV4aXN0aW5nIHJBRiwgcmVmZXIgdG8gU2NyYXdsZXIud2F0Y2goKS5cblx0ICpcblx0ICogQHJldHVybiB7U2NyYXdsZXJ9IFNjcmF3bGVyIG9iamVjdFxuXHQgKi9cblx0U2NyYXdsZXIucHJvdG90eXBlLnJ1biA9IGZ1bmN0aW9uKCl7XG5cdFx0aWYgKCFyb290Ll9zY3JvbGxfZXZlbnRfaW5pdGlhbGl6ZWQpIHtcblx0XHRcdHJvb3QuX3Njcm9sbF9ldmVudF9pbml0aWFsaXplZCA9IHRydWU7XG5cdFx0XHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgcm9vdC5ydW4pO1xuXHRcdH1cblx0XHRyb290Ll9yYWYgPSB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKGVuZ2luZSk7XG5cdFx0cmV0dXJuIHJvb3Q7XG5cdH07XG5cblx0LyoqXG5cdCAqIFB1YmxpYyBGdW5jdGlvbiBTY3Jhd2xlci5wYXVzZSgpXG5cdCAqXG5cdCAqIFBhdXNlIFNjcmF3bGVyLlxuXHQgKiBVc3VhbGx5IHVzZWZ1bCBvbmx5IHdoZW4gYGlkbGluZ2Agc2V0dGluZyBpcyBgLTFgIG9yIGJpZ24gZW5vdWdoLlxuXHQgKiBTY3Jhd2xlciBhdXRvbWF0aWNhbGx5IHBhdXNlcyBhZnRlciByZWFjaGluZyB0aGUgYXNzaWduZWQgaWRsaW5nIG51bWJlci5cblx0ICpcblx0ICogQHJldHVybiB7U2NyYXdsZXJ9IFNjcmF3bGVyIG9iamVjdFxuXHQgKi9cblx0U2NyYXdsZXIucHJvdG90eXBlLnBhdXNlID0gZnVuY3Rpb24oKXtcblx0XHR3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUocm9vdC5fcmFmKTtcblx0XHRyb290Ll9yYWYgPSBudWxsO1xuXHRcdHJldHVybiByb290O1xuXHR9O1xuXG5cdC8qKlxuXHQgKiBQdWJsaWMgRnVuY3Rpb24gU2NyYXdsZXIud2F0Y2goKVxuXHQgKlxuXHQgKiBQYXVzZSBTY3Jhd2xlci5cblx0ICpcblx0ICogQHJldHVybiB7U2NyYXdsZXJ9IFNjcmF3bGVyIG9iamVjdFxuXHQgKi9cblx0U2NyYXdsZXIucHJvdG90eXBlLndhdGNoID0gZnVuY3Rpb24oKXtcblx0XHR1cGRhdGVTY3Jhd2xlckRpcmVjdGlvbigpO1xuXHRcdHVwZGF0ZVVuaXRQb3NpdGlvbnMoKTtcblx0XHRyb290Ll9wcmV2X3B4X3Bvc2l0aW9uID0gd2luZG93LnBhZ2VZT2Zmc2V0O1xuXHRcdHJldHVybiByb290O1xuXHR9O1xuXG5cdC8qKlxuXHQgKiBQdWJsaWMgRnVuY3Rpb24gU2NyYXdsZXIucmVmcmVzaCgpXG5cdCAqXG5cdCAqIFJlZnJlc2ggYWxsIGJhc2VsaW5lIGFuZCBwb3NpdGlvbiBkYXRhXG5cdCAqXG5cdCAqIEByZXR1cm4ge1NjcmF3bGVyfSBTY3Jhd2xlciBvYmplY3Rcblx0ICovXG5cdFNjcmF3bGVyLnByb3RvdHlwZS5yZWZyZXNoID0gZnVuY3Rpb24oZSl7XG5cblx0XHR1cGRhdGVTY3Jhd2xlckRpcmVjdGlvbih0cnVlKTtcblxuXHRcdHJvb3QuYmFzZWxpbmUgPSBDb21tb24uY2FsY0Jhc2VsaW5lKHJvb3QuX29yaWdpbmFsX2Jhc2VsaW5lKTtcblxuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgcm9vdC5fbG9naWNzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHR2YXIgX2wgID0gcm9vdC5fbG9naWNzW2ldO1xuXHRcdFx0Zm9yICh2YXIgaiA9IDA7IGogPCBfbC51bml0cy5sZW5ndGg7IGorKykge1xuXHRcdFx0XHR2YXIgX3UgPSBfbC51bml0c1tqXTtcblx0XHRcdFx0X3UuYmFzZWxpbmUgPSBDb21tb24uY2FsY0Jhc2VsaW5lKF9sLmJhc2VsaW5lLCBfdS5lbCk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0dXBkYXRlVW5pdFBvc2l0aW9ucygpO1xuXHRcdHJvb3QuX3ByZXZfcHhfcG9zaXRpb24gPSB3aW5kb3cucGFnZVlPZmZzZXQ7XG5cblx0XHRyZXR1cm4gcm9vdDtcblx0fTtcblxuXHRmdW5jdGlvbiBlbmdpbmUoKSB7XG5cblx0XHR1cGRhdGVTY3Jhd2xlckRpcmVjdGlvbigpO1xuXG5cdFx0aWYgKHJvb3QuaWRsaW5nIDwgMCB8fFxuXHRcdFx0KHJvb3QuaWRsaW5nID09PSAwICYmIHJvb3QuX2RpciAhPT0gJ3N0YXknKSB8fFxuXHRcdFx0cm9vdC5faWRsZV9yb3VuZHMgPCByb290LmlkbGluZykge1xuXHQgXG5cdFx0XHR1cGRhdGVVbml0UG9zaXRpb25zKCk7XG5cblx0XHRcdHJvb3QuX3ByZXZfcHhfcG9zaXRpb24gPSB3aW5kb3cucGFnZVlPZmZzZXQ7XG5cdFx0XHRyb290Ll9yYWYgPSB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKGVuZ2luZSk7XG5cblx0XHR9IGVsc2UgeyBpZiAocm9vdC5fcmFmKSByb290LnBhdXNlKCk7IH1cblx0fVxuXG5cdC8qKlxuXHQgKiBQcml2YXRlIEZ1bmN0aW9uIHVwZGF0ZVNjcmF3bGVyRGlyZWN0aW9uKHJlc2l6aW5nKVxuXHQgKlxuXHQgKiBVcGRhdGUgU2NyYXdsZXIgZGlyZWN0aW9uLlxuXHQgKlxuXHQgKiBAcGFyYW0ge2Jvb2xlYW59IHJlc2l6aW5nXG5cdCAqXHRcdCAgSWYgdHJ1ZSwgU2NyYXdsZXIgZGlyZWN0aW9uIHdpbGwgdGVtcG9yYXJpbHkgaGF2ZSBgcmVzaXppbmdgIGFzIGl0cyB2YWx1ZS5cblx0ICpcblx0ICogQHJldHVybiB2b2lkXG5cdCAqL1xuXHRmdW5jdGlvbiB1cGRhdGVTY3Jhd2xlckRpcmVjdGlvbihyZXNpemluZyl7XG5cdFx0aWYgKHJlc2l6aW5nKSB7XG5cdFx0XHRyb290Ll9kaXIgPSAncmVzaXppbmcnO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRpZiAocm9vdC5fcHJldl9weF9wb3NpdGlvbiA9PT0gd2luZG93LnBhZ2VZT2Zmc2V0KSB7XG5cdFx0XHRcdGlmIChyb290Ll9kaXIgPT09ICdzdGF5Jykge1xuXHRcdFx0XHRcdGlmIChyb290LmlkbGluZyA+PSAwKSByb290Ll9pZGxlX3JvdW5kcysrO1xuXHRcdFx0XHR9IGVsc2UgaWYgKHJvb3QuX2RpciA9PT0gJycpIHtcblx0XHRcdFx0XHRyb290Ll9kaXIgPSAnaW5pdGlhbGl6ZWQnO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHJvb3QuX2RpciA9ICdzdGF5Jztcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cm9vdC5faWRsZV9yb3VuZHMgPSAwO1xuXHRcdFx0XHRpZiAocm9vdC5fcHJldl9weF9wb3NpdGlvbiA8IHdpbmRvdy5wYWdlWU9mZnNldCkgcm9vdC5fZGlyID0gJ2Rvd24nO1xuXHRcdFx0XHRlbHNlIHJvb3QuX2RpciA9ICd1cCc7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIFByaXZhdGUgRnVuY3Rpb24gdXBkYXRlVW5pdFBvc2l0aW9ucygpXG5cdCAqXG5cdCAqIFVwZGF0ZSBhbGwgVW5pdCBQb3NpdGlvbnMgZnJvbSBhbGwgTG9naWNzLlxuXHQgKlxuXHQgKiBAcmV0dXJuIHZvaWRcblx0ICovXG5cdGZ1bmN0aW9uIHVwZGF0ZVVuaXRQb3NpdGlvbnMoKXtcblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHJvb3QuX2xvZ2ljcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0dmFyIF9sICA9IHJvb3QuX2xvZ2ljc1tpXTtcblx0XHRcdGZvciAodmFyIGogPSAwOyBqIDwgX2wudW5pdHMubGVuZ3RoOyBqKyspIHtcblx0XHRcdFx0dmFyIF91ID0gX2wudW5pdHNbal07XG5cdFx0XHRcdHZhciBfYmNyID0gX3UuZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cdFx0XHRcdC8vIFVwZGF0ZSBwcm9ncmVzcyBvZiBlYWNoIHVuaXQgaW4gYSBsb2dpYy5cblx0XHRcdFx0X3UucHJvZ3Jlc3MucHggPSByb290LmJhc2VsaW5lLnB4IC0gKF9iY3IudG9wK191LmJhc2VsaW5lLnB4KTtcblx0XHRcdFx0X3UucHJvZ3Jlc3MuZiAgPSBfYmNyLmhlaWdodCA9PT0gMCA/IDAgOiBfdS5wcm9ncmVzcy5weCAvIF9iY3IuaGVpZ2h0O1xuXG5cdFx0XHRcdGlmIChfbC5yYW5nZSkge1xuXG5cdFx0XHRcdFx0aWYgKF9sLnJhbmdlWzBdIDw9IF91LnByb2dyZXNzW19sLl9yYW5nZV91bml0XSAmJiBfdS5wcm9ncmVzc1tfbC5fcmFuZ2VfdW5pdF0gPD0gX2wucmFuZ2VbMV0pIHtcblx0XHRcdFx0XHRcdC8vIEluIHJhbmdlXG5cblx0XHRcdFx0XHRcdC8vIFRPRE86IFJldmlldyAmIHRlc3QgcmVxdWlyZWQuXG5cdFx0XHRcdFx0XHQvLyBFZGl0aW5nIHRoaXMgcGFydCBhcyBpdCBzaG91bGQgY2hhbmdlIHRoZSBmbGFncyBpbiBlZGdlIGNhc2VzLlxuXHRcdFx0XHRcdFx0Ly8gTm90IGNvbXBsZXRlbHkgcmVtb3ZpbmcgbGVnYWN5IGNvZGUgYXMgbm90IHlldCB0ZXN0ZWQuXG5cdFx0XHRcdFx0XHQvLyBfdS5fdG9wX2VkZ2VfcmVuZGVyZWQgPSBmYWxzZTtcblx0XHRcdFx0XHRcdC8vIF91Ll9ib3RfZWRnZV9yZW5kZXJlZCA9IGZhbHNlO1xuXHRcdFx0XHRcdFx0X3UuX3RvcF9lZGdlX3JlbmRlcmVkID0gKF9sLnJhbmdlWzBdID09PSBfdS5wcm9ncmVzc1tfbC5fcmFuZ2VfdW5pdF0pID8gdHJ1ZSA6IGZhbHNlO1xuXHRcdFx0XHRcdFx0X3UuX2JvdF9lZGdlX3JlbmRlcmVkID0gKF9sLnJhbmdlWzFdID09PSBfdS5wcm9ncmVzc1tfbC5fcmFuZ2VfdW5pdF0pID8gdHJ1ZSA6IGZhbHNlO1xuXHRcdFx0XHRcdFx0X2wuY2FsbGJhY2suYXBwbHkoX3UsIF9sLmNhbGxiYWNrQXJncyk7XG5cblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0Ly8gT3V0IG9mIHJhbmdlXG5cblx0XHRcdFx0XHRcdGlmIChfdS5wcm9ncmVzc1tfbC5fcmFuZ2VfdW5pdF0gPCBfbC5yYW5nZVswXSkge1xuXHRcdFx0XHRcdFx0XHQvLyBVbml0IGxvY2F0ZXMgbG93ZXIgdGhhbiBTY3Jhd2xlciBCYXNlbGluZS5cblxuXHRcdFx0XHRcdFx0XHRfdS5fYm90X2VkZ2VfcmVuZGVyZWQgPSBmYWxzZTtcblxuXHRcdFx0XHRcdFx0XHRpZiAoX2wuX3JhbmdlX3VuaXQgPT09ICdweCcpIHtcblx0XHRcdFx0XHRcdFx0XHRfdS5wcm9ncmVzcy5weCA9IF9sLnJhbmdlWzBdO1xuXHRcdFx0XHRcdFx0XHRcdF91LnByb2dyZXNzLmYgID0gX2Jjci5oZWlnaHQgPT09IDAgPyAwIDogX3UucHJvZ3Jlc3MucHggLyBfYmNyLmhlaWdodDtcblx0XHRcdFx0XHRcdFx0fSBlbHNlIHsgLy8gPT09ICdmJ1xuXHRcdFx0XHRcdFx0XHRcdF91LnByb2dyZXNzLmYgID0gX2wucmFuZ2VbMF07XG5cdFx0XHRcdFx0XHRcdFx0X3UucHJvZ3Jlc3MucHggPSBfYmNyLmhlaWdodCAqIF91LnByb2dyZXNzLmY7XG5cdFx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0XHRpZiAoIV91Ll90b3BfZWRnZV9yZW5kZXJlZCkge1xuXHRcdFx0XHRcdFx0XHRcdF91Ll90b3BfZWRnZV9yZW5kZXJlZCA9IHRydWU7XG5cdFx0XHRcdFx0XHRcdFx0X2wuY2FsbGJhY2suYXBwbHkoX3UsIF9sLmNhbGxiYWNrQXJncyk7XG5cdFx0XHRcdFx0XHRcdH0gZWxzZSB7fVxuXG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHQvLyBVbml0IGxvY2F0ZXMgaGlnaGVyIHRoYW4gU2NyYXdsZXIgQmFzZWxpbmUuXG5cblx0XHRcdFx0XHRcdFx0X3UuX3RvcF9lZGdlX3JlbmRlcmVkID0gZmFsc2U7XG5cblx0XHRcdFx0XHRcdFx0aWYgKF9sLl9yYW5nZV91bml0ID09PSAncHgnKSB7XG5cdFx0XHRcdFx0XHRcdFx0X3UucHJvZ3Jlc3MucHggPSBfbC5yYW5nZVsxXTtcblx0XHRcdFx0XHRcdFx0XHRfdS5wcm9ncmVzcy5mICA9IF9iY3IuaGVpZ2h0ID09PSAwID8gMCA6IF91LnByb2dyZXNzLnB4IC8gX2Jjci5oZWlnaHQ7XG5cdFx0XHRcdFx0XHRcdH0gZWxzZSB7IC8vID09PSAnZidcblx0XHRcdFx0XHRcdFx0XHRfdS5wcm9ncmVzcy5mICA9IF9sLnJhbmdlWzFdO1xuXHRcdFx0XHRcdFx0XHRcdF91LnByb2dyZXNzLnB4ID0gX2Jjci5oZWlnaHQgKiBfdS5wcm9ncmVzcy5mO1xuXHRcdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdFx0aWYgKCFfdS5fYm90X2VkZ2VfcmVuZGVyZWQpIHtcblx0XHRcdFx0XHRcdFx0XHRfdS5fYm90X2VkZ2VfcmVuZGVyZWQgPSB0cnVlO1xuXHRcdFx0XHRcdFx0XHRcdF9sLmNhbGxiYWNrLmFwcGx5KF91LCBfbC5jYWxsYmFja0FyZ3MpO1xuXHRcdFx0XHRcdFx0XHR9IGVsc2Uge31cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRfbC5jYWxsYmFjay5hcHBseShfdSwgX2wuY2FsbGJhY2tBcmdzKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdHJldHVybiBTY3Jhd2xlcjtcbn0pKTtcblxuIl19
