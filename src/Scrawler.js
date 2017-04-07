/*! Scrawler.js v0.3.0 | (c) 2016-2017 Chan Young Park | MIT License */

;(function(){

'use strict';

var root;

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
 * @param {boolean} [args.sortLogics] (default: false) Currently not implemented.
 *		  If true, it will prioritize Logics based on Logic.order.
 * @param {int} [idling] (default: 0)
 *		  Number of rounds that Engine runs after scroll stops. 
 * 		  Usually, there is no need to run Engine after scroll stops.
 * 		  If this value is -1, Engine will be always running regardless of scroll.
 *		  Engine running === requestAnimationFrame()
 */
var Scrawler = function(args) {

	root = this;

	args = args || {};

	// Frames per second
	root.fps = args.fps || 0;

	// Variable to store original baseline value from args
	root._original_baseline = args.baseline || 'center';

	// Baseline value converted to Scrawler.Position() === {px:N, f:N}
	root.baseline = Scrawler.calcBaseline(root._original_baseline);

	// Are we gonna sort Logics?
	root.sortLogics = args.sortLogics || false;

	// Number of idle Engine rounds
	root.idling = parseInt(args.idling)||0;

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
Scrawler.prototype.add = function(args, callback, callbackArgs){
	args.id = args.id || 'lid_'+root._logics.length;
	root._logics.push(new Scrawler.Logic(args, callback, callbackArgs));
	return root;
};

/**
 * Public Function Scrawler.Remove(lid)
 *
 * Remove a Logic from Scrawler.
 *
 * @param {string} lid
 *		  ID for Logic to remove
 *
 * @return {Scrawler} Scrawler object
 */
Scrawler.prototype.remove = function(lid){
	for (var i = 0; i < root._logics.length; i++) {
		if (root._logics[i].id === lid) {
			root._logics.splice(i, 1);
			return root;
		}
	}
	return root;
};

Scrawler.prototype.sort = function(){
	root._logics.sort(function(a, b){
		return a.order - b.order;
	});
	return root;
};

/**
 * Class Scrawler.Logic(args, callback, callbackArgs)
 * 
 * @param {object} args
 * 		  - refer to Scrawler.prototype.add() for more info.
 * @param {function} callback
 * @param {array} callbackArgs
 */
Scrawler.Logic = function(args, callback, callbackArgs){

	var self = this;

	self.id = args.id;
	self.el = args.el;
	self.order = args.order || 0;
	self.callback = callback;
	self.callbackArgs = callbackArgs || [];
	self.range = args.range || null; // Array(2) with From and To values. 
	self.baseline = args.baseline||0;
	self.nodelist = document.querySelectorAll(args.el);
	self.units = [];
	for (var i = 0; i < self.nodelist.length; i++) {
		self.units[i] = new Scrawler.Unit({
			el: self.nodelist[i],
			baseline: Scrawler.calcBaseline(self.baseline, self.nodelist[i]),
			progress: new Scrawler.Position()
		});
	}

	self._range_unit;

	if (self.range) {
		if (typeof self.range[0] === 'string') {
			if (self.range[0].indexOf('%') !== -1) {
				// percent
				self.range[0] = parseFloat(self.range[0].replace('%','')) / 100;
				self.range[1] = parseFloat(self.range[1].replace('%','')) / 100;
				self._range_unit = 'f';
			} else {
				self._range_unit = 'px';
			}
		} else {
			self._range_unit = 'px';
		}
	}
};

Scrawler.Unit = function(args){
	
	var self = this;

	self.el = args.el;
	self.baseline = args.baseline;
	self.progress = args.progress;
	self._top_edge_rendered = false;
	self._bot_edge_rendered = false;
	self.maps = args.maps || {};
};

Scrawler.Unit.prototype.map = function(mid, args, callback, callbackArgs){

	var self = this;

	mid = mid.toString();
	args.to = args.to || [0,1];
	callbackArgs = callbackArgs || [];
	self.maps[mid] = self.maps[mid] || {_top_edge_rendered: false, _bot_edge_rendered: false};

	var f0 = args.from[0],
		f1 = args.from[1],
		t0 = args.to[0],
		t1 = args.to[1],
		range_unit,
		val;
	
	if (typeof f0 === 'string') {
		if (f0.indexOf('%') !== -1) {
			// percent
			range_unit = 'f'
			f0 = parseFloat(f0.replace('%','')) / 100;
			f1 = parseFloat(f1.replace('%','')) / 100;
		} else {
			range_unit = 'px'
		}
	} else {
		range_unit = 'px'
	}

	var prg = self.progress[range_unit];
	var _m = self.maps[mid];

	if (f0 <= prg && prg <= f1) {

		_m._top_edge_rendered = false;
		_m._bot_edge_rendered = false;
		val = (prg - f0) / (f1-f0) * (t1-t0) + t0;
		callbackArgs.unshift(val);
		callback.apply(self, callbackArgs);

	} else {

		if (prg < f0) {

			_m._bot_edge_rendered = false;

			if (!_m._top_edge_rendered) {
				_m._top_edge_rendered = true;
				prg = f0;
				val = (prg - f0) / (f1-f0) * (t1-t0) + t0;
				callbackArgs.unshift(val);
				callback.apply(self, callbackArgs);
			}

		} else {

			_m._top_edge_rendered = false;

			if (!_m._bot_edge_rendered) {
				_m._bot_edge_rendered = true;
				prg = f1;
				val = (prg - f0) / (f1-f0) * (t1-t0) + t0;
				callbackArgs.unshift(val);
				callback.apply(self, callbackArgs);
			}
		}
	}
};

Scrawler.Position = function(args){
	var self = this;
	args = args || {};
	self.px = args.px || undefined; // pixel
	self.f  = args.f  || undefined; // unit interval (fraction/float)
}

Scrawler.prototype.watch = function(pause){
	if (!pause) {
		updateScrawlerDirection();
		updateUnitPositions();
		root._prev_px_position = window.pageYOffset;
	}
	return root;
};

Scrawler.prototype.run = function(){
	if (!root._scroll_event_initialized) {
		root._scroll_event_initialized = true;
		window.addEventListener('scroll', root.run);
	}
	root._raf = window.requestAnimationFrame(engine);
	return root;
};

Scrawler.prototype.pause = function(){
	window.cancelAnimationFrame(root._raf);
	root._raf = null;
	return root;
};

function engine() {

	updateScrawlerDirection();

	if (root.idling < 0 ||
		(root.idling === 0 && root._dir !== 'stay') ||
		root._idle_rounds < root.idling) {
 
		updateUnitPositions();

		root._prev_px_position = window.pageYOffset;
		root._raf = window.requestAnimationFrame(engine);

	} else { if (root._raf) root.pause(); }
}

function updateScrawlerDirection(resizing){
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
			if (root._prev_px_position < window.pageYOffset) root._dir = 'down';
			else root._dir = 'up';
		}
	}
}

function updateUnitPositions(){
	for (var i = 0; i < root._logics.length; i++) {
		var _l  = root._logics[i];
		for (var j = 0; j < _l.units.length; j++) {
			var _u = _l.units[j];
			var _bcr = _u.el.getBoundingClientRect();
			// Update progress of each unit in a logic.
			_u.progress.px = root.baseline.px - (_bcr.top+_u.baseline.px);
			_u.progress.f  = _bcr.height === 0 ? 0 : _u.progress.px / _bcr.height;

			if (_l.range) {

				if (_l.range[0] <= _u.progress[_l._range_unit] && _u.progress[_l._range_unit] <= _l.range[1]) {
					// In range

					_u._top_edge_rendered = false;
					_u._bot_edge_rendered = false;
					_l.callback.apply(_u, _l.callbackArgs);

				} else {
					// Out of range

					if (_u.progress[_l._range_unit] < _l.range[0]) {
						// Unit locates lower than Scrawler Baseline.

						_u._bot_edge_rendered = false;

						if (_l._range_unit === 'px') {
							_u.progress.px = _l.range[0];
							_u.progress.f  = _bcr.height === 0 ? 0 : _u.progress.px / _bcr.height;
						} else { // === 'f'
							_u.progress.f  = _l.range[0];
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
							_u.progress.f  = _bcr.height === 0 ? 0 : _u.progress.px / _bcr.height;
						} else { // === 'f'
							_u.progress.f  = _l.range[1];
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

Scrawler.prototype.refresh = function(e){

	updateScrawlerDirection(true);

	root.baseline = Scrawler.calcBaseline(root._original_baseline);

	for (var i = 0; i < root._logics.length; i++) {
		var _l  = root._logics[i];
		for (var j = 0; j < _l.units.length; j++) {
			var _u = _l.units[j];
			_u.baseline = Scrawler.calcBaseline(_l.baseline, _u.el);
		}
	}

	updateUnitPositions();
	root._prev_px_position = window.pageYOffset;
};

Scrawler.calcBaseline = function(baseline, el){

	var _b = new Scrawler.Position();
	var _h = el ? el.getBoundingClientRect().height : window.innerHeight;

	switch (baseline) {

		case 'top':
			_b.px = 0;
			_b.f  = 0;
			break;

		case 'center':
			_b.px = _h/2;
			_b.f  = .5;
			break;

		case 'bottom':
			_b.px = _h;
			_b.f  = 1;
			break;

		default:
			var _px = function(){
				// px
				_b.px = parseFloat(baseline);
				_b.f  = baseline/_h;
			};
			if (typeof baseline === 'string') {
				if (baseline.indexOf('%') !== -1) {
					// percent
					_b.f  = parseFloat(baseline.replace('%','')) / 100;
					_b.px = _h*_b.f;
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

Scrawler.Util = {
	// TODO: Add unit converter and/or range converter.
};

if (typeof define === 'function' && define.amd) define(Scrawler);
else if (typeof module === 'object' && module.exports) module.exports = Scrawler;
else this.Scrawler = Scrawler;
}).call(this);
