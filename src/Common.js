const Common = {};

Common.calcBaseline = (baseline, el)=>{

	const wh = window.innerHeight;
	const _b = new Scrawler.Position();
	const _h = el ? el.getBoundingClientRect().height : wh;

	switch (baseline) {

		case 'top':
			_b.px = 0;
			_b.f  = 0;
			break;

		case 'center':
			_b.px = _h/2;
			_b.f  = .5;
			break;

		case 'bottom':
			_b.px = _h;
			_b.f  = 1;
			break;

		default:
			const _px = function(){
				// px
				_b.px = parseFloat(baseline);
				_b.f  = baseline/_h;
			};
			if (typeof baseline === 'string') {
				if (baseline.indexOf('%') !== -1) {
					// percent
					_b.f  = parseFloat(baseline.replace('%','')) / 100;
					_b.px = _h*_b.f;
				} else if (baseline.indexOf('f') !== -1) {
					if (baseline.indexOf('v') !== -1) {
						// viewport decimal
						_b.px = wh * parseFloat(baseline.replace('vf',''));
						_b.f = _b.px/_h;
					} else {
						// decimal
						_b.f  = parseFloat(baseline.replace('f',''));
						_b.px = _h*_b.f;
					}
				} else {
					_px();
				}
			} else {
				_px();
			}
			break;
	}

	// TODO: create setF() and calculate f here. All initially should have px value.

	_b.vf = _b.px/wh;

	return _b;
};
