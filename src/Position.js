'use strict';

/**
 * Class Position(args)
 *
 * Contains Scrawler Position value 
 * 
 * @param {object} args (default: {})
 *		  {int} args.f
 *		  		- unit interval (fraction/float)
 *  	  {int} args.px
 *		  		- pixel value
 */
const Position = function(args = {}){
	this.f  = args.f  || undefined; // unit interval (fraction/float)
	this.px = args.px || undefined; // pixel
};

module.exports = Position;
