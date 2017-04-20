/**
 * Constructor Scrawler(args)
 *
 * @param {object} [args] (default: {})
 * @param {int} [args.fps] (default: 0) Currently not implemented.
 *		  Frames per second.
 *		  0: auto fps
 * @param {int|string} [args.baseline] (default: 0)
 *		  Scrawler's baseline position. All units will reference this baseline.
 *		  Available values:
 *		  - integer: pixel distance from the top of the viewport.
 *		  - string: 'top', 'center', 'bottom', or '0%' to '100%' as a string
 * @param {int} [idling] (default: 0)
 *		  Number of rounds that Engine runs after scroll stops.
 * 		  Usually, there is no need to run Engine after scroll stops.
 * 		  If this value is -1, Engine will be always running regardless of scroll.
 *		  Engine running === requestAnimationFrame()
 */
function Scrawler(args = {}) {

	const _this_ = this;

	// Frames per second
	_this_.fps = args.fps || 0;

	// Variable to store original baseline value from args
	_this_._original_baseline_ = args.baseline.toString() || 'center';

	// Baseline value converted to Scrawler.Position() === {px:N, f:N}
	_this_.baseline = Common.calcBaseline(_this_._original_baseline_);

	// Number of idle Engine rounds
	_this_.idling = parseInt(args.idling)||0;

	/** Under the hood */

	// Current direction of scroll
	_this_._dir_ = '';

	// Logics array. Scrawler.add() will push Logics in this array.
	_this_._logics_ = [];

	// rAF holder variable
	_this_._raf_ = null;

	// Previous scroll position by window.pageYOffset. Updates with every scroll.
	_this_._prev_px_position_ = 0;

	// Idle engine round counter
	_this_._idle_rounds_ = 0;

	_this_._scroll_event_initialized_ = false;

	window.addEventListener('resize', _this_.refresh);
};

/**
 * Public Function Scrawler.add(args, callback, callbackArgs)
 *
 * Add a Logic to Scrawler.
 * A Logic contains code how designated DOM element(s)
 * will react based on scrolls.
 * Once a Logic is registered by Scrawler.add(),
 * Scrawler will automatically run each
 * registered Logic when scroll events happen.
 *
 * @param {object} args
 * @param {string} args.el
 *		  Query selector for DOM elements.
 * @param {array(2)} [args.range] (default: null)
 *		  Range where this Logic will be executed.
 *		  If null, the callback function will run regardless of scroll position.
 *		  Range can be either percentage or pixel.
 *		  i.e.) ['0%','100%'] or [0, 5000]
 * @param {int|string} [args.baseline] (default: 0)
 *		  The DOM element's baseline position. Scrawler measures the distance between viewport baseline and this baseline.
 *		  Available values:
 *		  - integer: pixel distance from the top of the viewport.
 *		  - string: 'top', 'center', 'bottom', or '0%' to '100%' as a string
 * @param {string} [args.id] (default: random)
 *		  Logic ID. Required if this Logic is expected to be removed later.
 * @param {int} args.order (default: 0)
 *		  Running order of Logic
 *		  Bigger order number will run later.
 * @param {function} callback
 *		  This function will run and apply on DOM elements
 *		  selected by args.el when scroll events happen.
 * @param {array} [callbackArgs]
 *		  args for callback function
 *
 * @return {Scrawler} Scrawler object
 */
Scrawler.prototype.add = function(args, callback, callbackArgs){
	const _this_ = this;
	args.id = args.id || 'lid_'+_this_._logics_.length;
	_this_._logics_.push(new Scrawler.Logic(args, callback, callbackArgs));
	return _this_;
};

/**
 * Public Function Scrawler.remove(lid)
 *
 * Remove a Logic from Scrawler.
 *
 * @param {string} lid
 *		  ID for Logic to remove
 *
 * @return {Scrawler} Scrawler object
 */
Scrawler.prototype.remove = function(lid){
	const _this_ = this;
	for (let i = 0; i < _this_._logics_.length; i++) {
		if (_this_._logics_[i].id === lid) {
			_this_._logics_.splice(i, 1);
			return _this_;
		}
	}
	return _this_;
};

/**
 * Public Function Scrawler.sort()
 *
 * Sort Scrawler Logics.
 *
 * @return {Scrawler} Scrawler object
 */
Scrawler.prototype.sort = function(){
	const _this_ = this;
	_this_._logics_.sort((a, b)=>{
		return a.order - b.order;
	});
	return _this_;
};

/**
 * Public Function Scrawler.run()
 *
 * Start/resume Scrawler to run added logics.
 * To run Scrawler in an already existing rAF, refer to Scrawler.watch().
 *
 * @return {Scrawler} Scrawler object
 */
Scrawler.prototype.run = function(){
	const _this_ = this;
	if (!_this_._scroll_event_initialized_) {
		_this_._scroll_event_initialized_ = true;
		window.addEventListener('scroll', _this_.run.bind(_this_));
	}
	_this_._raf_ = window.requestAnimationFrame(engine.bind(_this_));
	return _this_;
};

/**
 * Public Function Scrawler.pause()
 *
 * Pause Scrawler.
 * Usually useful only when `idling` setting is `-1` or big enough.
 * Scrawler automatically pauses after reaching the assigned idling number.
 *
 * @return {Scrawler} Scrawler object
 */
Scrawler.prototype.pause = function(){
	const _this_ = this;
	window.cancelAnimationFrame(_this_._raf_);
	_this_._raf_ = null;
	return _this_;
};

/**
 * Public Function Scrawler.watch()
 *
 * Initialize and run Scrawler in an existing rAF
 *
 * @return {Scrawler} Scrawler object
 */
Scrawler.prototype.watch = function(){
	const _this_ = this;
	updateScrawlerDirection.call(_this_);
	updateUnitPositions.call(_this_);
	_this_._prev_px_position_ = window.pageYOffset;
	return _this_;
};

/**
 * Public Function Scrawler.refresh()
 *
 * Refresh all baseline and position data
 *
 * @return {Scrawler} Scrawler object
 */
Scrawler.prototype.refresh = function(e){
	const _this_ = this;

	updateScrawlerDirection.call(_this_, true);

	_this_.baseline = Common.calcBaseline(_this_._original_baseline_);

	for (let i = 0; i < _this_._logics_.length; i++) {
		const _l  = _this_._logics_[i];
		for (let j = 0; j < _l.units.length; j++) {
			const _u = _l.units[j];
			_u.baseline = Common.calcBaseline(_l.baseline, _u.el);
		}
	}

	updateUnitPositions();
	_this_._prev_px_position_ = window.pageYOffset;

	return _this_;
};

function engine(){
	const _this_ = this;

	updateScrawlerDirection.call(_this_);

	if (_this_.idling < 0 ||
		(_this_.idling === 0 && _this_._dir_ !== 'stay') ||
		_this_._idle_rounds_ < _this_.idling) {

		updateUnitPositions.call(_this_);

		_this_._prev_px_position_ = window.pageYOffset;
		_this_._raf_ = window.requestAnimationFrame(engine.bind(_this_));

	} else { if (_this_._raf_) _this_.pause(); }
}

/**
 * Private Function updateScrawlerDirection(resizing)
 *
 * Update Scrawler direction.
 *
 * @param {boolean} resizing
 *		  If true, Scrawler direction will temporarily have `resizing` as its value.
 *
 * @return void
 */
function updateScrawlerDirection(resizing){
	const _this_ = this;
	if (resizing) {
		_this_._dir_ = 'resizing';
	} else {
		if (_this_._prev_px_position_ === window.pageYOffset) {
			if (_this_._dir_ === 'stay') {
				if (_this_.idling >= 0) _this_._idle_rounds_++;
			} else if (_this_._dir_ === '') {
				_this_._dir_ = 'initialized';
			} else {
				_this_._dir_ = 'stay';
			}
		} else {
			_this_._idle_rounds_ = 0;
			if (_this_._prev_px_position_ < window.pageYOffset) _this_._dir_ = 'down';
			else _this_._dir_ = 'up';
		}
	}
}

/**
 * Private Function updateUnitPositions()
 *
 * Update all Unit Positions from all Logics.
 *
 * @return void
 */
function updateUnitPositions(){
	const _this_ = this;
	for (let i = 0; i < _this_._logics_.length; i++) {
		const _l  = _this_._logics_[i];
		for (let j = 0; j < _l.units.length; j++) {
			const _u = _l.units[j];
			const _bcr = _u.el.getBoundingClientRect();
			// Update progress of each unit in a logic.
			_u.progress.px = _this_.baseline.px - (_bcr.top+_u.baseline.px);
			_u.progress.f  = _bcr.height === 0 ? 0 : _u.progress.px / _bcr.height;

			if (_l.range) {

				if (_l.range[0] <= _u.progress[_l._range_unit_] && _u.progress[_l._range_unit_] <= _l.range[1]) {
					// In range

					// NOTE: Review & test required.
					// Editing this part as it should change the flags in edge cases.
					// Not completely removing legacy code as not yet tested.
					// _u._top_edge_rendered_ = false;
					// _u._bot_edge_rendered_ = false;
					_u._top_edge_rendered_ = (_l.range[0] === _u.progress[_l._range_unit_]) ? true : false;
					_u._bot_edge_rendered_ = (_l.range[1] === _u.progress[_l._range_unit_]) ? true : false;
					_l.callback.apply(_u, _l.callbackArgs);

				} else {
					// Out of range

					if (_u.progress[_l._range_unit_] < _l.range[0]) {
						// Unit locates lower than Scrawler Baseline.

						_u._bot_edge_rendered_ = false;

						if (_l._range_unit_ === 'px') {
							_u.progress.px = _l.range[0];
							_u.progress.f  = _bcr.height === 0 ? 0 : _u.progress.px / _bcr.height;
						} else { // === 'f'
							_u.progress.f  = _l.range[0];
							_u.progress.px = _bcr.height * _u.progress.f;
						}

						if (!_u._top_edge_rendered_) {
							_u._top_edge_rendered_ = true;
							_l.callback.apply(_u, _l.callbackArgs);
						} else {}

					} else {
						// Unit locates higher than Scrawler Baseline.

						_u._top_edge_rendered_ = false;

						if (_l._range_unit_ === 'px') {
							_u.progress.px = _l.range[1];
							_u.progress.f  = _bcr.height === 0 ? 0 : _u.progress.px / _bcr.height;
						} else { // === 'f'
							_u.progress.f  = _l.range[1];
							_u.progress.px = _bcr.height * _u.progress.f;
						}

						if (!_u._bot_edge_rendered_) {
							_u._bot_edge_rendered_ = true;
							_l.callback.apply(_u, _l.callbackArgs);
						} else {}
					}
				}

			} else {
				_l.callback.apply(_u, _l.callbackArgs);
			}
		}
	}
}
