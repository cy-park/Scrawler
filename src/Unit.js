function Unit(args){
	
	const self = this;

	self.el = args.el;
	self.baseline = args.baseline;
	self.progress = args.progress;
	self._top_edge_rendered_ = false;
	self._bot_edge_rendered_ = false;
	self.scales = args.scales || {};
};

Unit.prototype.f = function(){
	return this.progress.f;
};

Unit.prototype.px = function(){
	return this.progress.px;
};

Unit.prototype.scale = function(sid, args, callback, callbackArgs = []){

	const self = this;

	sid = sid.toString();
	args.to = args.to || [0,1];
	self.scales[sid] = self.scales[sid] || {_top_edge_rendered_: false, _bot_edge_rendered_: false};

	let f0 = args.from[0],
		f1 = args.from[1],
		t0 = args.to[0],
		t1 = args.to[1],
		_m = self.scales[sid],
		range_unit,
		val;
	
	if (typeof f0 === 'string') {
		if (f0.indexOf('%') !== -1 || f0.indexOf('f') !== -1) {
			// percent
			range_unit = 'f'
			f0 = parseFloat(f0.replace('%','').replace('f','')) / 100;
			f1 = parseFloat(f1.replace('%','').replace('f','')) / 100;
		} else {
			range_unit = 'px'
		}
	} else {
		range_unit = 'px'
	}

	let prg = self.progress[range_unit];

	if (f0 <= prg && prg <= f1) {

		_m._top_edge_rendered_ = false;
		_m._bot_edge_rendered_ = false;
		val = (prg - f0) / (f1-f0) * (t1-t0) + t0;
		callbackArgs.unshift(val);
		callback.apply(self, callbackArgs);

	} else {

		if (prg < f0) {

			_m._bot_edge_rendered_ = false;

			if (!_m._top_edge_rendered_) {
				_m._top_edge_rendered_ = true;
				prg = f0;
				val = (prg - f0) / (f1-f0) * (t1-t0) + t0;
				callbackArgs.unshift(val);
				callback.apply(self, callbackArgs);
			}

		} else {

			_m._top_edge_rendered_ = false;

			if (!_m._bot_edge_rendered_) {
				_m._bot_edge_rendered_ = true;
				prg = f1;
				val = (prg - f0) / (f1-f0) * (t1-t0) + t0;
				callbackArgs.unshift(val);
				callback.apply(self, callbackArgs);
			}
		}
	}
};
