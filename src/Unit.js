'use strict';

const Unit = function(args){
	
	var self = this;

	self.el = args.el;
	self.baseline = args.baseline;
	self.progress = args.progress;
	self._top_edge_rendered = false;
	self._bot_edge_rendered = false;
	self.maps = args.maps || {};
};

Unit.prototype.map = function(mid, args, callback, callbackArgs){

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

module.exports = Unit;
