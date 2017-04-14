/*! Scrawler.js v0.3.0 | (c) 2016-2017 Chan Young Park | MIT License */

(function(global, factory){
	'use strict';
	if(typeof define === 'function' && define.amd) {
		// AMD
		define(Scrawler);
	} else if(typeof module === 'object' && module.exports) {
		// CommonJS
		module.exports = factory();
	} else {
		// Browser global
		global.Scrawler = factory();
	}
})(typeof window !== 'undefined' ? window : this, function(){

	//@source_code

	return Scrawler;
});

