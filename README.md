# Scrawler v0.2.1 (beta)

### A simple javascript vertical parallax library.

Scrawler is a simple library to help react users’ scroll events. As it is for people who want a super-simple, barebone library for scroll events, it only provides position data for baselines and DOM elements. All the fancy animations, parallax effect, and/or any other visual effects should be coded manually. However, if you don’t like any magic and do want to keep full control of your code, this is the right library for you.

## Download

 * [minified](https://raw.githubusercontent.com/cy-park/Scrawler/master/dist/Scrawler.min.js)
 * [unminified](https://raw.githubusercontent.com/cy-park/Scrawler/master/src/Scrawler.js)

## Installation

#### Option 1: HTML

```html
<script src="Scrawler.js"></script>
```

#### Option 2: Node.js & npm

In terminal, execute:

```shell
$ npm i scrawler --save
```

and import in JS:

```js
var Scrawler = require('scrawler');
```

## Quick Start

After downloading Scrawler.js, use below code to quick-start:

```html
<!DOCTYPE html>
<html>
  <body style="height:200vh">
  	<style>.unit-to-track {height:25vh;margin:20px;border:4px solid #000}</style>
    <div class="unit-to-track"></div>
    <div class="unit-to-track"></div>
    <div class="unit-to-track"></div>
    <div class="unit-to-track"></div>
    <script src="Scrawler.js"></script>
    <script>
      var scrawler = new Scrawler();
      scrawler.add({el: '.unit-to-track'}, function(){
        this.el.innerHTML = this.progress.px + 'px apart from viewport center.';
      }).run();
    </script>
  </body>
</html>
```

## APIs

### Initialization

To begin, initialization of Scrawler is required.

**Syntax:**

<pre>
<b>new Scrawler( [settings] );</b>
</pre>

**Arguments:**

- `settings` *{object}* (optional) Scrawler settings for initialization.

	Parameters for `settings`:

	Parameter    | Type                | Default      | Description
	------------ | ------------------- | ------------ | ------------
	`baseline`   | *integer or string* | 'center'     | Scrawler's baseline position. All units will reference this baseline. If an integer value is used, it means pixel distance from the top of the viewport. For percentage values as strings (i.e. `'50%'`), it means relative position from viewport. Alternatively, `'top'`, `'center'`, `'bottom'` can be also used instead of `'0%'`, `'50%'`, `'100%'` respectively.
	`idling`     | *integer*           | 0            | Number of rounds that additional `window.requestAnimationFrame()` is called after scroll stops. If this value is -1, it will be always running regardless of scroll. Usually, there is no need to render additional frames after scroll stops. 
	`sortLogics` | boolean             | false        | **NOT IMPLEMENTED YET AS OF v0.2.1**

**Example 1:**

```JS
var scrawler = new Scrawler();
```

**Example 2:**

```JS
var scrawler = new Scrawler({ baseline: 500 });
```

**Example 3:**

```JS
var scrawler = new Scrawler({ baseline: '50%' });
```

**Example 4:**

```JS
var scrawler = new Scrawler({ baseline: 'center' });
```

<br>

### .add()


Add a Logic to Scrawler.

**Syntax:**

<pre>
<b>.add( settings, callback, [callback_arguments] )</b>
</pre>

**Arguments:**

- `settings` *{object}* Settings for a Logic.

	Parameters for `settings`:

	Parameter    | Type                | Default        | Description
	------------ | ------------------- | -------------- | ------------
	`el`         | *string*            | -              | **[REQUIRED]** Query selector string for target DOM elements. The logic will affect the elements that are selected by this query string.
	`range`      | *Array(2)*          | -              | Range where the Logic will be executed. The first and the second array value stand for the starting position and the ending position of the Logic respectively. <br>Both array values can have either integer or string. Integer stands for pixel value. String value should be a specific format such as `0%` to `100%`, which means percentage value. <br>If `range` is not assigned, the Logic will be executed at any range, from `-INFINITY` to `+INFINITY`. To run the Logic only when the DOM meets the viewport baseline, assign `['0%', '100%']` for this rawnge value.
	`id`         | *string*            | (random value) | (optional) ID for the logic. Required to remove this logic later with Scrawler.remove() method.
	`baseline`   | *integer or string* | 0              | The DOM element's baseline position. Scrawler measures the distance between the viewport baseline and this baseline. <br>If an integer value is used, it means pixel distance from the top of the viewport. For percentage values as strings (i.e. `'50%'`), it means relative position from viewport. Alternatively, `'top'`, `'center'`, `'bottom'` can be also used instead of `'0%'`, `'50%'`, `'100%'` respectively.
	`order`      | *integer*           | 0              | **NOT IMPLEMENTED YET AS OF v0.2.1**<br>Running order of Logic. Bigger order number will run later.

- `callback` *{function}* This functio runs and applies on DOM elements selected by args.el when scroll events happen.
- `callback_arguments ` *{Array}* (optional) parameters for callback function.

**Example 1:**

```JS
scrawler.add({
  el: '.scrawler-unit'
}, function(){
  console.log(this.progress.px); // prints current progress in pixel value.
})
```

**Example 2:**

```JS
scrawler.add({
  el: '.scrawler-unit',
  range: ['0%', '100%'],
  baseline: 'center'
}, function(arg1, arg2){
  console.log(arg1 + this.progress.px + arg2); // prints "progress: [...]px"
}, ['progress: ', 'px'])
```

<br>

### .remove()

<br>

### .sort()

<br>

### .run()

<br>

### .watch()

<br>

### .pause()

<br>

## Browser Support

Scarawler supports all major modern browsers including IE 10+.

## License

MIT
