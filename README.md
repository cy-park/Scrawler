# Scrawler v1.1.0

### A javascript library for monitoring vertical scroll events.

Scrawler is a simple library to help react users’ scroll events. As it is for people who want a super-simple, barebone library for scroll events, it only provides position data for baselines and DOM elements. All the fancy animations, parallax effect, and/or any other visual effects should be coded manually. However, if you don’t like any magic and do want to keep full control of your code, this is the right library for you. To see how Scrawler works in production, please refer to [this list](https://github.com/cy-park/Scrawler#live-links).

<br>

## Download

- [minified](https://raw.githubusercontent.com/cy-park/Scrawler/master/dist/Scrawler.min.js)
- [unminified](https://raw.githubusercontent.com/cy-park/Scrawler/master/dist/Scrawler.js)

<br>

## Installation

#### Option 1: HTML

```html
<script src="Scrawler.min.js"></script>
```

#### Option 2: Node.js & npm

In terminal, execute:

```shell
$ npm i scrawler --save
```

and import in JS:

```js
var Scrawler = require('scrawler'); // CommonJS
```

or alternatively:

```js
import Scrawler from 'scrawler'; // ES6
```

<br>

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

<br>

## Architecture

`Scrawler` consists of two main objects, `Logic` and `Unit`.

```
Scrawler
|
+-- Logic
|   |
|   +-- Unit
|
+-- Logic
|   |
|   +-- Unit
|   +-- Unit
|
+-- Logic 
|   |
|   +-- Unit
|   +-- Unit
|   +-- Unit
.
```

### Logic

`Logic` is a coded logic that explains how certain DOM elements should react based on scroll events. Therefore, when creating `Logic` (`.add()`), it is required to assign at least one DOM element (`args.el`) and define what to do with it (`callback`).  The created `Logic` will be added and stored in the `Scrawler` instance.

### Unit

When a `Logic` is created, `Unit` objects are automatically created based on `Logic`’s assigned DOM element (`args.el`) info. The number of created `Unit`s is identical to the number of DOM elements selected by the `args.el`. The created `Unit`s will be added and stored in the `Logic` instance.

`Unit` is a piece of information about a single DOM element and its baseline, current position, etc. Its position data is constantly updated by the `Logic` that the `Unit` belongs to.

<br>

## APIs

### Scrawler()

Scrawler constructor. Initialization of Scrawler is required to begin.

**Syntax:**

<pre>
<b>new Scrawler( [settings] )</b>
</pre>

**Arguments:**

- `settings` *{object}* (optional) `Scrawler` settings for initialization.

	Parameters for `settings`:

	| Parameter    | Type                | Default      | Description |
	| ------------ | ------------------- | ------------ | ----------- |
	| `baseline`   | *integer or string* | 'center'     | `Scrawler`'s baseline position. All `Units` will reference this `baseline`. If an integer value is used, it means pixel distance from the top of the viewport. Percentage values (i.e. `'50%'`) or f values (i.e. `'0.5f'`) in strings mean relative position from viewport. Alternatively, `'top'`/`'center'`/`'bottom'` can be also used instead of `'0%'`/`'50%'`/`'100%'` or `'0f'`/`'0.5f'`/`'1f'`,  respectively. |
	| `idling`     | *integer*           | 0            | Number of additional rounds that `window.requestAnimationFrame()` is called after scroll stops. If this value is `-1`, it will be always running regardless of scroll. Usually, there is no need to render additional frames after scroll stops. |

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
var scrawler = new Scrawler({ baseline: '0.5f' });
```

**Example 4:**

```JS
var scrawler = new Scrawler({ baseline: '50%' });
```

**Example 5:**

```JS
var scrawler = new Scrawler({ baseline: 'center' });
```

<br>

### .add()

Add a `Logic` to `Scrawler`. 

**Syntax:**

<pre>
<b>.add( settings, callback, [callback_arguments] )</b>
</pre>

**Arguments:**

- `settings` *{object}* Settings for a Logic.

	Parameters for `settings`:

	| Parameter    | Type                | Default        | Description |
	| ------------ | ------------------- | -------------- | ----------- |
	| `el`         | *string*            | -              | **[REQUIRED]** Query selector string for target DOM elements. |
	| `range`      | *Array(2)*          | -              | Range where the `Logic` will be executed. The first and the second array value stand for the starting position and the ending position of the `Logic` respectively. <br>Both array values can have either integer or string. Integer stands for pixel value. String value should be a specific format such as `0%` to `100%` (percentage values), or `0f` to `100f` (float/decimal values). <br>If `range` is not assigned, the `Logic` will be executed at any range, from `-INFINITY` to `+INFINITY`. To run the `Logic` only when the DOM meets the viewport baseline, assign `['0%', '100%']` or `['0f', '1f']` for this range value. |
	| `id`         | *string*            | (random value) | (optional) ID for the `Logic`. Required to remove this `Logic` later with `Scrawler.remove()` method. |
	| `baseline`   | *integer or string* | 0              | The DOM element's baseline position. `Scrawler` measures the distance between the viewport baseline and this baseline. <br>If an integer value is used, it means pixel distance from the top of the viewport. Percentage (i.e. `'50%'`) or f values (i.e. `'0.5f'`) in strings mean relative position from viewport. Alternatively, `'top'`/`'center'`/`'bottom'` can be also used instead of `'0%'`/`'50%'`/`'100%'` or `'0f'`/`'0.5f'`/`'1f'`,  respectively. |
	| `order`      | *integer*           | 0              | Running order of `Logic` objects. Bigger order number will run later. |

- `callback` *{function}* This function is called on each DOM element selected by `args.el` when scroll events happen. In this callback function, `this` is a current `Unit` object that Scrawler is rendering on.
- `callback_arguments ` *{Array}* (optional) parameters for callback function.

**Return:** *{Scrawler}* `Scrawler` object

**Example 1:**

```JS
scrawler.add({
  el: '.scrawler-unit'
}, function(){
  console.log(this.progress.px); // prints current progress in pixel value.
});
```

**Example 2:**

```JS
scrawler.add({
  el: '.scrawler-unit',
  range: ['0f', '1f'],
  baseline: 'center'
}, function(arg1, arg2){
  console.log(arg1 + this.progress.px + arg2); // prints "progress: [...]px"
}, ['progress: ', 'px']);
```

**Example 3:**

```JS
scrawler.add({
  el: '.scrawler-unit',
  range: ['0%', '100%'],
  baseline: 'center'
}, function(arg1, arg2){
  console.log(arg1 + this.progress.px + arg2); // prints "progress: [...]px"
}, ['progress: ', 'px']);
```

<br>

### .remove()

Remove a `Logic` from `Scrawler`.

**Syntax:**

<pre>
<b>.remove( logic_id )</b>
</pre>

**Arguments:**

- `logic_id` *{string}* ID for the target `Logic` to remove. Only `Logics` with IDs can be removed. An ID can be assigned when a `Logic` is created.

**Return:** *{Scrawler}* `Scrawler` object

**Example:**

```JS
scrawler.add({
  id: 'myLogicID',
  el: '.scrawler-unit'
}, function(){...});

...

scrawler.remove('myLogicID');
```

<br>

### .sort()

Sort `Logics` based on `order` value. `order` values can be set up when creating each `Logic` with `.add()`. The bigger `order` value a `Logic` has, the later it runs.

**Syntax:**

<pre>
<b>.sort()</b>
</pre>

**Return:** *{Scrawler}* `Scrawler` object

**Example:**

```JS
scrawler
.add({
  id: 'paintRed', 
  el: '.scrawler-unit',
  order: 1 
  }, function(){
    document.body.style.background = 'red';
  })
.add({
  id: 'paintBlue', 
  el: '.scrawler-unit',
  order: 0 
  }, function(){
    document.body.style.background = 'blue';
  })
.sort() // by sorting Logics, `paintRed` will be called after `paintBlue`.
.run(); // `paintBlue` will always be overwritten by `paintRed`.
```

<br>

### .run()

Start/resume `Scrawler` to run added logics.

This function creates a `requestAnimationFrame` loop and call assigned `Logics` internally. To run `Scrawler` in an already existing rAF, use `.watch()` method instead.

**Syntax:**

<pre>
<b>.run()</b>
</pre>

**Return:** *{Scrawler}* `Scrawler` object

**Example 1:**

```JS
scrawler
.add({ el: '.scrawler-unit' }, function(){...})
.run();
```

**Example 2:**

```JS
scrawler
.add({ el: '.scrawler-unit' }, function(){...});

...

scrawler.run();
```

<br>

### .pause()

Pause `Scrawler`. Only works to `.run()`, not `watch()`.

Usually useful only when `idling` setting is `-1` or big enough. `Scrawler` automatically pauses after reaching the assigned `idling` number. Scrawler will automatically resume when the user starts scrolling again. To stop `Scrawler` permanently after calling `.run()`, it is required to remove `Scrawler` instance (i.e. `scrawler = null;`).

**Syntax:**

<pre>
<b>.pause()</b>
</pre>

**Return:** *{Scrawler}* `Scrawler` object

**Example:**

```JS
scrawler
.add({ el: '.scrawler-unit' }, function(){...})
.run();

...

scrawler.pause();
```

<br>

### .watch()

Initialize and run `Scrawler` in an existing `requestAnimationFrame`. Works as same as `run()`, but calling `watch()` in an existing rAF will run `Scrawler` without creating another rAF.

This method is for advanced use cases. `run()` method would work for most circumstances.

**Syntax:**

<pre>
<b>.watch()</b>
</pre>

**Return:** *{Scrawler}* `Scrawler` object

**Example:**

```JS
scrawler.add({ el: '.scrawler-unit' }, function(){...});

...

window.requestAnimationFrame(raf_worker);

function raf_worker() {
  scrawler.watch();
  window.requestAnimationFrame(raf_worker);
}
```

<br>

### .refresh()

Refresh all `baseline` and `position` values. Automatically called when resizing browsers.

**Syntax:**

<pre>
<b>.refresh()</b>
</pre>

**Return:** *{Scrawler}* `Scrawler` object

**Example:**

```JS
scrawler.refresh();

```

<br>

***

### Scrawler.Logic()

A `Logic` contains information about how targeted DOM elements interact in accordance with the browser’s scroll positions. A `Scrawler` instance usually carries multiple `Logics` and call each `Logic` every time when a scroll event occurs.

**Syntax:**

<pre>
<b>new Scrawler.Logic( args, callback, [callbackArgs] )</b>
</pre>

*Note: `Logic` is usually created by `Scrawler.add()`. Creating `Logic` directly using `new Scrawler.Logic()` is a very rare use case which is not recommended.*

**Arguments:**

*Refer to `Scrawler.add()`.*

<br>

***

### Scrawler.Unit()

`Unit` objects are automatically created by `Scrawler` while adding a `Logic` to `Scrawler`. Each `Unit` indicates actual DOM elements monitored by `Scrawler`. 

`Unit` objects are accessible by calling `this` instance in `Scrawler.add()` methods’ `callback` functions.

<br>

### .el

DOM `Element` of the `Unit` that `Scrawler` is currently handling

**Example:**

```JS
scrawler
.add({ el: '#scrawler-elm' }, function(){
  console.log( this.el ); // document.getElementById('scrawler-elm')
});
```

<br>

### .progress

Progress of the `Unit` in decimal value (unit interval, 0 to 1 range) and pixel value.

**Example:**

```JS
scrawler
.add({ el: '.scrawler-unit' }, function(){
  console.log(
    this.progress.f, // progress in decimal value
    this.progress.px // progress in pixel value
  );
});
```

<br>

### .f()

Shorthand of `Scrawler.Unit.progress.f`.

**Syntax:**

<pre>
<b>.f()</b>
</pre>

**Return:** *{float}* `Unit` progress value in decimal.

**Example:**

```JS
scrawler
.add({ el: '.scrawler-unit' }, function(){
  console.log( this.f() );
});
```

<br>

### .px()

Shorthand of `Scrawler.Unit.progress.px`.

**Syntax:**

<pre>
<b>.px()</b>
</pre>

**Return:** *{integer}* `Unit` progress value in pixel.

**Example:**

```JS
scrawler
.add({ el: '.scrawler-unit' }, function(){
  console.log( this.px() );
});
```

<br>

### .scale()

Linear interpolate a range of values to another.

**Syntax:**

<pre>
<b>.scale( scale_id, scale_values, callback, [callbackArgs] )</b>
</pre>

**Arguments:**

- `scale_id ` *{string}* Unique ID for this `.scale()` call. Must assign an ID to use `.scale()`. Any unique string works.
- `scale_values` *{object}* Scale range values to interpolate. 

	Parameters for `scale_values `:

	| Parameter    | Type                      | Default        | Description |
	| ------------ | ---------- | -------------- | ----------- |
	| `from`       | *Array(2)* | -              | **[REQUIRED]** Source range of interpolation. <br>Both array values can have either integer or string. Integer stands for pixel value. String value should be a specific format such as `0%` to `100%` (percentage values), or `0f` to `1f` (float/decimal values). |
	| `to   `      | *Array(2)* | `[0, 1]`       | Target range of interpolation. Both array values should have integers. |

- `callback` *{function(interpolated_value)}* This function is called  when current `Unit`’s `progress` is in source range (`scale_values.from`). The first argument of the `callback` is the interpolated value of current `Unit`’s `progress`.
- `callback_arguments ` *{Array}* (optional) parameters for callback function.

**Return:** *void*

**Example 1:**

```JS
scrawler
.add({ el: '.scrawler-unit' }, function(){
  this.scale('myScale', {
    from: [123, 456]
  }, function(val){
    console.log(val); // interpolated to [0, 1] scale
  });
});
```

**Example 2:**

```JS
scrawler
.add({ el: '.scrawler-unit' }, function(){
  this.scale('myScale', {
    from: [123, 456],
    to:   [7.89, 10]
  }, function(val){
    console.log(val); // interpolated value
  });
});
```

**Example 3:**

```JS
scrawler
.add({ el: '.scrawler-unit' }, function(){
  this.scale('myScale', {
    from: ['0.12f', '0.34f'],
    to:   [5, 6.78]
  }, function(val){
    console.log(val); // interpolated value
  });
});
```

**Example 4:**

```JS
scrawler
.add({ el: '.scrawler-unit' }, function(){
  this.scale('myScale', {
    from: ['12%', '34.5%'],
    to:   [60, 78]
  }, function(val){
    console.log(val); // interpolated value
  });
});
```

<br>

***

### Scrawler.Position()

`Position` object contains a pixel value and a unit interval (decimal) value. It is a standard format for any position values used in this library.

### .f

Position value in unit interval (decimal).

### .px

Position value in unit interval (integer).

<br>

## Live Links

- [Hiking the Grand Canyon: 800 Miles of Magic and Misery](http://www.nationalgeographic.com/adventure/2016/11/grand-canyon-national-parks-interactive-map/)
- [12 Perfect Moments in Ireland](http://www.nationalgeographic.com/travel/destinations/europe/ireland/12-perfect-moments-places-destinations/)
- [Around the World in 12 Books](http://www.nationalgeographic.com/travel/features/12-books-read-around-world/)
- [Around the World in 24 Hours](http://www.nationalgeographic.com/travel/features/around-the-world-in-24-hours/)

<br>

## Browser Support

Scarawler supports all major modern browsers including IE 10+.

## License

MIT
