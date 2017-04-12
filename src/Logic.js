'use strict';

import Common from './Common';
import Unit from './Unit';
import Position from './Position';

/**
 * Class Logic(args, callback, callbackArgs)
 * 
 * @param {object} args
 * 		  - refer to Scrawler.prototype.add() for more info.
 * @param {function} callback
 * @param {array} callbackArgs
 */
const Logic = function(args, callback, callbackArgs){

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
		self.units[i] = new Unit({
			el: self.nodelist[i],
			baseline: Common.calcBaseline(self.baseline, self.nodelist[i]),
			progress: new Position()
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

module.exports = Logic;
