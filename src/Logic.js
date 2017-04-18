/**
 * Class Scrawler.Logic(args, callback, callbackArgs)
 * 
 * @param {object} args
 * 		  - refer to Scrawler.prototype.add() for more info.
 * @param {function} callback
 * @param {array} callbackArgs
 */
Scrawler.Logic = function(args, callback, callbackArgs = []){

	const _this_ = this;

	_this_.id = args.id;
	_this_.el = args.el;
	_this_.order = args.order || 0;
	_this_.range = args.range || null; // Array(2) with From and To values. 
	_this_.baseline = args.baseline||0;
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
				_this_.range[0] = parseFloat(_this_.range[0].replace('%','')) / 100;
				_this_.range[1] = parseFloat(_this_.range[1].replace('%','')) / 100;
				_this_._range_unit_ = 'f';
			} else if (_this_.range[1].indexOf('f') !== -1) {
				_this_.range[0] = parseFloat(_this_.range[0].replace('f',''));
				_this_.range[1] = parseFloat(_this_.range[1].replace('f',''));
				_this_._range_unit_ = 'f';
			} else {
				_this_._range_unit_ = 'px';
			}
		} else {
			_this_._range_unit_ = 'px';
		}
	}
};
