import fs from 'fs';
import concat from 'concat';
import {js_beautify} from 'js-beautify';
import * as babel from 'babel-core';
import UglifyJS from 'uglify-js';

try {

	//TODO: CLEAN UP BUILD CODE

	concat(['src/main.js', 'src/Common.js', 'src/Logic.js', 'src/Position.js', 'src/Unit.js']).then((result)=>{

		result = babel.transform(result, {presets: ['es2015']}).code;

		const wrapper = fs.readFileSync('src/wrapper.js', 'utf8');
		const wrapped = wrapper.replace(/\/\/\@source_code/g, result);

		const beauty = js_beautify(wrapped, { indent_size: 2 });
		const ugly = UglifyJS.minify(wrapped, {
			fromString: true,
			mangleProperties: {
				regex: /_$/
			}
		}).code;

		fs.writeFile('dist/Scrawler.min.js', ugly, {flag:'w'}, (err)=>{
			if (err) throw err;
		});

		fs.writeFile('dist/Scrawler.js', beauty, {flag:'w'}, (err)=>{
			if (err) throw err;
		});
	});

} catch (error) {
	console.error('Error occurred:', error);
}
