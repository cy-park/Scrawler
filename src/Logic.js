/**
 * Class Scrawler.Logic(args, callback, callbackArgs)
 * 
 * @param {object} args
 * 		  - refer to Scrawler.prototype.add() for more info.
 * @param {function} callback
 * @param {array} callbackArgs
 */
Scrawler.Logic = function(args, callback, callbackArgs = []){

	const self = this;

	self.id = args.id;
	self.el = args.el;
	self.order = args.order || 0;
	self.range = args.range || null; // Array(2) with From and To values. 
	self.baseline = args.baseline||0;
	self.callback = callback;
	self.callbackArgs = callbackArgs;
	self.nodelist = document.querySelectorAll(args.el);
	self.units = [];
	for (var i = 0; i < self.nodelist.length; i++) {
		self.units[i] = new Scrawler.Unit({
			el: self.nodelist[i],
			baseline: Common.calcBaseline(self.baseline, self.nodelist[i]),
			progress: new Scrawler.Position()
		});
	}

	self._range_unit_;

	if (self.range) {
		if (typeof self.range[1] === 'string') {
			if (self.range[1].indexOf('%') !== -1) {
				// percent
				self.range[0] = parseFloat(self.range[0].replace('%','')) / 100;
				self.range[1] = parseFloat(self.range[1].replace('%','')) / 100;
				self._range_unit_ = 'f';
			} else if (self.range[1].indexOf('f') !== -1) {
				self.range[0] = parseFloat(self.range[0].replace('f',''));
				self.range[1] = parseFloat(self.range[1].replace('f',''));
				self._range_unit_ = 'f';
			} else {
				self._range_unit_ = 'px';
			}
		} else {
			self._range_unit_ = 'px';
		}
	}
};
