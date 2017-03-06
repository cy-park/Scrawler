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

**Example:**

```JS
var scrawler = new Scrawler();
```

```JS
var scrawler = new Scrawler({ baseline: 500 });
```

```JS
var scrawler = new Scrawler({ baseline: '50%' });
```

```JS
var scrawler = new Scrawler({ baseline: 'center' });
```

### .add()

Add a Logic to Scrawler.

**Syntax:**

<pre>
<b>.add( settings, callback, [callback_arguments] )</b>
</pre>

**Arguments:**

- `settings` *{object}* Settings for a Logic.

	Parameters for `settings`:

	Parameter    | Type                | Default      | Description
	------------ | ------------------- | ------------ | ------------


**Example:**

## Browser Support

Scarawler supports all major modern browsers including IE 10+.

## License

MIT
