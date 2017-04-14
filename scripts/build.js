import fs from 'fs';
import concat from 'concat';
import {js_beautify} from 'js-beautify';
import * as babel from 'babel-core';
import UglifyJS from 'uglify-js';

try {

	//TODO: CLEAN UP BUILD CODE

	const ts = Date.now();
	console.log('[build.js] compiling...')

	concat(['src/main.js', 'src/Common.js', 'src/Logic.js', 'src/Position.js', 'src/Unit.js']).then((result)=>{

		result = babel.transform(result, {presets: ['es2015']}).code;

		const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
		const license = 
			  `/*! ${pkg.metadata.class_name}.js v${pkg.version} | ` + 
			  `(c) ${pkg.metadata.year_launched}-${new Date().getFullYear()} ${pkg.author} | ` +
			  `${pkg.license} License */ \r\n`;

		const wrapper = fs.readFileSync('src/wrapper.js', 'utf8');
		const wrapped = wrapper.replace(/\/\@source_code\//g, result).replace(/\/\@class_name\//g, pkg.metadata.class_name);

		if (process.argv[2] === '--draft') {

			fs.writeFile('dist/Scrawler.js', license+wrapped, {flag:'w'}, (err)=>{
				if (err) throw err;
				console.log(`[build.js] compiled after ${Date.now() - ts}ms`);
			});

		} else {
			const beauty = license + js_beautify(wrapped, { indent_size: 2 });
			const ugly = license + UglifyJS.minify(wrapped, {
				fromString: true,
				mangleProperties: {
					regex: /_$/
				}
			}).code;

			fs.writeFile('dist/Scrawler.js', beauty, {flag:'w'}, (err)=>{
				if (err) throw err;
				console.log(`[build.js] Scrawler.js compiled after ${Date.now() - ts}ms`);
			});

			fs.writeFile('dist/Scrawler.min.js', ugly, {flag:'w'}, (err)=>{
				if (err) throw err;
				console.log(`[build.js] Scrawler.min.js compiled after ${Date.now() - ts}ms`);
			});
		}
	});

} catch (error) {
	console.error('Error occurred:', error);
}
