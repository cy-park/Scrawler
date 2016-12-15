// Supports modern browsers & IE10+

;(function(){

'use strict';

var Scrawler = function(args) {

	args = args || {};

	/** Frame per second. Input 0 for auto fps. */
	this.fps = args.fps || 0;

	this.baseline = Scrawler.calcBaseline(args.baseline||'center');

	this.sortLogics = args.sortLogics || false;

	this.logics = args.logics || [];

	this.idling = parseInt(args.idling)||0;

	this.direction = '';

	/** Under the hood */

	this._raf = null;

	this._prev_px_position = 0;

	this._idle_rounds = 0;

	window.addEventListener('resize', this.onResize.bind(this));
	window.addEventListener('scroll', this.onScroll.bind(this));
};

Scrawler.Logic = function(args, callback, callbackArgs){

	this.lid = args.lid;
	this.el = args.el;
	this.order = args.order || 0;
	this.callback = callback;
	this.callbackArgs = callbackArgs || [];
	this.range = args.range || null; // Array(2) with From and To values. 
	this.baseline = args.baseline||0;
	this.nodelist = document.querySelectorAll(args.el);
	this.units = [];
	for (var i = 0; i < this.nodelist.length; i++) {
		this.units[i] = new Scrawler.Unit({
			el: this.nodelist[i],
			baseline: Scrawler.calcBaseline(this.baseline, this.nodelist[i]),
			progress: new Scrawler.Position()
		});
	}

	this._range_unit;

	if (this.range) {
		if (typeof this.range[0] === 'string') {
			if (this.range[0].indexOf('%') !== -1) {
				// percent
				this.range[0] = parseFloat(this.range[0].replace('%','')) / 100;
				this.range[1] = parseFloat(this.range[1].replace('%','')) / 100;
				this._range_unit = 'dc';
			} else {
				this._range_unit = 'px';
			}
		} else {
			this._range_unit = 'px';
		}
	}

	// TODO: Feature to override Scrawler Viewport Baseline.
};

Scrawler.Unit = function(args){
	this.el = args.el;
	this.baseline = args.baseline;
	this.progress = args.progress;
	this._top_edge_rendered = false;
	this._bot_edge_rendered = false;
	this.maps = args.maps || {};
};

Scrawler.Unit.prototype.map = function(mid, args, callback, callbackArgs){

	mid = mid.toString();
	args.to = args.to || [0,1];
	callbackArgs = callbackArgs || [];
	this.maps[mid] = this.maps[mid] || {_top_edge_rendered: false, _bot_edge_rendered: false};

	var f0 = args.from[0],
		f1 = args.from[1],
		t0 = args.to[0],
		t1 = args.to[1],
		range_unit,
		val;
	
	if (typeof f0 === 'string') {
		if (f0.indexOf('%') !== -1) {
			// percent
			range_unit = 'pc'
			f0 = parseFloat(f0.replace('%',''));
			f1 = parseFloat(f1.replace('%',''));
		} else {
			range_unit = 'px'
		}
	} else {
		range_unit = 'px'
	}

	var prg = this.progress[range_unit];
	var _m = this.maps[mid];

	if (f0 <= prg && prg <= f1) {

		_m._top_edge_rendered = false;
		_m._bot_edge_rendered = false;
		val = (prg - f0) / (f1-f0) * (t1-t0) + t0;
		callbackArgs.unshift(val);
		callback.apply(this, callbackArgs);

	} else {

		if (prg < f0) {

			_m._bot_edge_rendered = false;

			if (!_m._top_edge_rendered) {
				_m._top_edge_rendered = true;
				prg = f0;
				val = (prg - f0) / (f1-f0) * (t1-t0) + t0;
				callbackArgs.unshift(val);
				callback.apply(this, callbackArgs);
			}

		} else {

			_m._top_edge_rendered = false;

			if (!_m._bot_edge_rendered) {
				_m._bot_edge_rendered = true;
				prg = f1;
				val = (prg - f0) / (f1-f0) * (t1-t0) + t0;
				callbackArgs.unshift(val);
				callback.apply(this, callbackArgs);
			}
		}
	}
};

Scrawler.Position = function(args){
	args = args || {};
	this.px = args.px || undefined; // pixel
	this.dc = args.dc || undefined; // decimal
	this.pc = args.pc || undefined; // percent
}

Scrawler.Position.prototype.compareTo = function(position){
	// TODO: Develop compareTo method.
	return new Scrawler.Position();
};

/**
 * Add a Logic
 */
Scrawler.prototype.add = function(args, callback, callbackArgs){
	args.lid = args.lid || 'lid_'+this.logics.length;
	this.logics.push(new Scrawler.Logic(args, callback, callbackArgs));
	return this;
};

Scrawler.prototype.remove = function(lid){
	for (var i = 0; i < this.logics.length; i++) {
		if (this.logics[i].lid === lid) {
			this.logics.splice(i, 1);
			return this;
		}
	}
	return this;
};

Scrawler.prototype.sort = function(){
	this.logics.sort(function(a, b){
		return a.order - b.order;
	});
	return this;
};

Scrawler.prototype.run = function(){
	this._raf = window.requestAnimationFrame(this._engine.bind(this));
	return this;
};

Scrawler.prototype.pause = function(){
	window.cancelAnimationFrame(this._raf);
	this._raf = null;
	return this;
};

Scrawler.prototype._engine = function(){

	if (this._prev_px_position === window.pageYOffset) {
		if (this.direction === 'stay') {
			if (this.idling >= 0) this._idle_rounds++;
		} else if (this.direction === '') {
			this.direction = 'initialized';
		} else {
			this.direction = 'stay';
		}
	} else {
		this._idle_rounds = 0;
		if (this._prev_px_position < window.pageYOffset) this.direction = 'down';
		else this.direction = 'up';
	}

	if (this.idling < 0 ||
		(this.idling === 0 && this.direction !== 'stay') ||
		this._idle_rounds < this.idling) {

		for (var i = 0; i < this.logics.length; i++) {
			var _l  = this.logics[i];
			for (var j = 0; j < _l.units.length; j++) {
				var _u = _l.units[j];
				var _bcr = _u.el.getBoundingClientRect();
				// Update progress of each unit in a logic.
				_u.progress.px = this.baseline.px - (_bcr.top+_u.baseline.px);
				_u.progress.dc = _bcr.height === 0 ? 0 : _u.progress.px / _bcr.height;
				_u.progress.pc = _u.progress.dc * 100;

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
								_u.progress.dc = _bcr.height === 0 ? 0 : _u.progress.px / _bcr.height;
								_u.progress.pc = _u.progress.dc * 100;
							} else { // === 'dc'
								_u.progress.dc = _l.range[0];
								_u.progress.px = _bcr.height * _u.progress.dc;
								_u.progress.pc = _u.progress.dc * 100;
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
								_u.progress.dc = _bcr.height === 0 ? 0 : _u.progress.px / _bcr.height;
								_u.progress.pc = _u.progress.dc * 100;
							} else { // === 'dc'
								_u.progress.dc = _l.range[1];
								_u.progress.px = _bcr.height * _u.progress.dc;
								_u.progress.pc = _u.progress.dc * 100;
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

		this._prev_px_position = window.pageYOffset;
		this.run();

	} else { if (this._raf) this.pause(); }
};

Scrawler.prototype.onResize = function(e){
	// Update this._prev_px_position
	// Update baseline
};

Scrawler.prototype.onScroll = function(e){
	this.run();
};

Scrawler.calcBaseline = function(baseline, el){

	var _b = new Scrawler.Position();
	var _h = el ? el.getBoundingClientRect().height : window.innerHeight;

	switch (baseline) {

		case 'top':
			_b.px = 0;
			_b.dc = 0;
			_b.pc = 0;
			break;

		case 'center':
			_b.px = _h/2;
			_b.dc = .5;
			_b.pc = 50;
			break;

		case 'bottom':
			_b.px = _h;
			_b.dc = 1;
			_b.pc = 100;
			break;

		default:
			if (typeof baseline === 'string') {
				if (baseline.indexOf('%') !== -1) {
					// percent
					_b.pc = parseFloat(baseline.replace('%',''));
					_b.dc = _b.pc / 100;
					_b.px = _h*_b.dc;
				} else {
					_px();
				}
			} else {
				_px();
			}
			function _px() {
				// px
				_b.px = parseFloat(baseline);
				_b.dc = baseline/_h;
				_b.pc = baseline/_h*100;
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
