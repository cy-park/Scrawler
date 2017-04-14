(function(global, factory){
	'use strict';
	if(typeof define === 'function' && define.amd) {
		// AMD
		define(/@class_name/);
	} else if(typeof module === 'object' && module.exports) {
		// CommonJS
		module.exports = factory();
	} else {
		// Browser global
		global./@class_name/ = factory();
	}
})(typeof window !== 'undefined' ? window : this, function(){

	/@source_code/

	return /@class_name/;
});

