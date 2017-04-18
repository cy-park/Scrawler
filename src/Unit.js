Scrawler.Unit = function(args){
	
	const _this_ = this;

	_this_.el = args.el;
	_this_.baseline = args.baseline;
	_this_.progress = args.progress;
	_this_._top_edge_rendered_ = false;
	_this_._bot_edge_rendered_ = false;
	_this_.scales = args.scales || {};
};

Scrawler.Unit.prototype.f = function(){
	return this.progress.f;
};

Scrawler.Unit.prototype.px = function(){
	return this.progress.px;
};

Scrawler.Unit.prototype.scale = function(sid, args, callback, callbackArgs = []){

	const _this_ = this;

	sid = sid.toString();
	args.to = args.to || [0,1];
	_this_.scales[sid] = _this_.scales[sid] || {_top_edge_rendered_: false, _bot_edge_rendered_: false};

	let f0 = args.from[0],
		f1 = args.from[1],
		t0 = args.to[0],
		t1 = args.to[1],
		_m = _this_.scales[sid],
		range_unit,
		val;
	
	if (typeof f1 === 'string') {
		if (f1.indexOf('%') !== -1) {
			// percent
			f0 = parseFloat(f0.replace('%','')) / 100;
			f1 = parseFloat(f1.replace('%','')) / 100;
			range_unit = 'f'
		} else if (f1.indexOf('f') !== -1) {
			// decimal
			f0 = parseFloat(f0.replace('f',''));
			f1 = parseFloat(f1.replace('f',''));
			range_unit = 'f'
		} else {
			range_unit = 'px'
		}
	} else {
		range_unit = 'px'
	}

	let prg = _this_.progress[range_unit];

	if (f0 <= prg && prg <= f1) {

		_m._top_edge_rendered_ = false;
		_m._bot_edge_rendered_ = false;
		val = (prg - f0) / (f1-f0) * (t1-t0) + t0;
		callbackArgs.unshift(val);
		callback.apply(_this_, callbackArgs);

	} else {

		if (prg < f0) {

			_m._bot_edge_rendered_ = false;

			if (!_m._top_edge_rendered_) {
				_m._top_edge_rendered_ = true;
				prg = f0;
				val = (prg - f0) / (f1-f0) * (t1-t0) + t0;
				callbackArgs.unshift(val);
				callback.apply(_this_, callbackArgs);
			}

		} else {

			_m._top_edge_rendered_ = false;

			if (!_m._bot_edge_rendered_) {
				_m._bot_edge_rendered_ = true;
				prg = f1;
				val = (prg - f0) / (f1-f0) * (t1-t0) + t0;
				callbackArgs.unshift(val);
				callback.apply(_this_, callbackArgs);
			}
		}
	}
};
