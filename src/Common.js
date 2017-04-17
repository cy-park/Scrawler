const Common = {};

Common.calcBaseline = (baseline, el)=>{

	const _b = new Position();
	const _h = el ? el.getBoundingClientRect().height : window.innerHeight;

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
				} else {
					_px();
				}
			} else {
				_px();
			}
			break;
	}

	return _b;
};
