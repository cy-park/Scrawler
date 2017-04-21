/**
 * Class Scrawler.Position(args)
 *
 * Contains Scrawler Position value
 *
 * @param {object} args (default: {})
 *		  {int} args.f
 *		  		- unit interval based on unit height (fraction/float)
 *		  {int} args.vf
 *		  		- unit interval based on viewport height (fraction/float)
 *				- only exists for Unit Positions, not baseline Positions.
 *  	  {int} args.px
 *		  		- pixel value
 */
Scrawler.Position = function(args = {}){
	this.f  = args.f  || undefined; // unit interval based on unit height (fraction/float)
	this.vf = args.vf || undefined; // unit interval based on viewport height (fraction/float)
	this.px = args.px || undefined; // pixel
};
