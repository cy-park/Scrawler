# Scrawler v1.2.2

### A javascript library for monitoring vertical scroll events.

Scrawler is a simple library to help react to scroll events. As it is for people who want a super-simple, barebones library, it only provides position data for baselines and DOM elements. Fancy animations, parallax effects, and/or any other visual effects should be coded manually according to position data. So if you don’t like magic and want to keep full control of your code, this is the right library for you. To see how Scrawler works in production, please refer to [this list](#live-links).

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

## Introduction

In a nutshell, Scrawler tells **how far a DOM element is away from the center of the browser viewport**. Take a look at the visualization below to get a better grasp of the concept.

![](https://raw.githubusercontent.com/cy-park/Scrawler/master/docs/assets/what_scrawler_tells.png)

The distance from the viewport center to the top of the `<div>` element is called `progress`. Every time users scroll, the value of the `progress` for that `<div>` changes. If the `<div>` stays under the viewport center, the `progress` has negative value. If it is above the viewport center, the `progress` has positive value. If the top part of the `<div>` contancts the viewport center, the value is `0`. Below visualization explains each condition.

![](https://raw.githubusercontent.com/cy-park/Scrawler/master/docs/assets/progress_values.png)

The `progress` value is everything Scrawler offers. Here are a few example situations that Scrawler can be useful:

- Show photos with 100% opacity when they are in the center of viewport. Fade out gradually as they move away from the center. 
- Play videos when they are in viewport, and pause when they are out.
- Update the progress bar based on the amount of page scroll.
- Use page scroll position to update data visualization.
- Any parallax effects.

## Basic Instructions

Now let’s build a simple example. The minimum settings to experiment with Scrawler are:

- `<body>` that is long enough to scroll.
- At least one DOM element (i.e. `<div>`) for Scrawler to monitor.
- `Scralwer.js` file.

In addition to above, we will add CSS styles to make the DOM actually visible. So the simplest HTML can be written as below:

```html
<body style="height:200vh;padding-top:80vh">
  <style>
    .unit-to-monitor {
      width:  100px;
      height: 100px;
      margin: 20px auto;
      color:  #fff;
      background: #00f;
    }
  </style>
  <div class="unit-to-monitor">Unit to monitor</div>
  <script src="Scrawler.js"></script>
</body>
```

Now, we will initialize Scrawler, ask to monitor `<div class="unit-to-monitor">`, and run it. We can add DOM elements we want to monitor to the `scrawler` element as below:

```js
var scrawler = new Scrawler();
scrawler
  .add({el: '.unit-to-monitor'}, function(){})
  .run();
```

The first parameter `{el: '.unit-to-monitor'}` is to inform which element to monitor. You can use standard `querySelector`. If the `el` parameter picks multiple DOM elements, the callback function will be applied to each DOM elements respectively. The second parameter `function(){}` is a callback function for `scrawler`’s scroll detection. It is a designated space to write in whatever you want to do with the `<div>`’s `progress` value. Finally, you need to chain `run()` method to activate `scrawler` to work.

In this example, I will simply change the `<div>` color to red when the `progress` value is bigger than `0px`. So the code now will look as below:

```js
var scrawler = new Scrawler();
scrawler
  .add({el: '.unit-to-monitor'}, function(){
    if (this.progress.px > 0)
      this.el.style.background = 'red';
    else
      this.el.style.background = '';
  })
  .run();
```

`this` instance is the DOM element unit that `scrawler` is currently handling. It contains the DOM object in `this.el` and `progress` values in `this.progress`.

### _progress.px_

`this.progress` has a following unit `px` at the end, and it reads `this.progress.px`. This is how you get the actual pixel value of the distance.

As a variation, if you want to change to red 10px below the center (-10px), you can change the `if` condition to `if (this.progress.px > -10)`.

As you see above example, `progress.px` provides `px` unit values. In other words, it tells **how many pixels away** the DOM element is from the viewport center.

But Scrawler provides not only pixel values but also two relative `progress` values in fraction:

- `progress.f`
- `progress.vf`

### _progress.f_

`progress.f` is a distance expressed by **the ratio of the DOM element’s height**. In other words, the unit of `progress.f` is the DOM element’s height, which validates below formular:

**`(progress.f) = (progress.px) / (DOM height)`**

For example, imagine a DOM element whose height is 100px. If it is 50px below the viewport center, `progress.f` is `-0.5`, which means the distance is -50% (-0.5) of DOM height.

### _progress.vf_

`progress.vf` is a distance expressed by **the ratio of the browser viewport’s height**, which validates the following:

**`(progress.vf) = (progress.px) / (Browser Viewport Height)`**

For example, if the browser viewport height is 1000px and the DOM is 50px below the viewport center, `progress.vf` is `-0.05`.

Following illustration explains the relationship among all progress values.

![](https://raw.githubusercontent.com/cy-park/Scrawler/master/docs/assets/progress_all.png)

This is the end of the basic instruction! You can find the live demo of the above code [here](https://codepen.io/cypark/pen/GEpjKx).

<br>

## Documents

### [Advanced Usages](https://github.com/cy-park/Scrawler/blob/master/docs/ADVANCED.md)

- [Moving Viewport Baseline at Center](https://github.com/cy-park/Scrawler/blob/master/docs/ADVANCED.md#moving-viewport-baseline-at-center)
- [Setting DOM Element Baselines](https://github.com/cy-park/Scrawler/blob/master/docs/ADVANCED.md#setting-dom-element-baselines)
- [Interpolating `progress` Values](https://github.com/cy-park/Scrawler/blob/master/docs/ADVANCED.md#interpolating-progress-values)

### [Architecture and APIs](https://github.com/cy-park/Scrawler/blob/master/docs/API.md)

<br>

## Demos

TK

<br>

## Live Links

- [Hiking the Grand Canyon: 800 Miles of Magic and Misery](http://www.nationalgeographic.com/adventure/2016/11/grand-canyon-national-parks-interactive-map/)
- [12 Perfect Moments in Ireland](http://www.nationalgeographic.com/travel/destinations/europe/ireland/12-perfect-moments-places-destinations/)
- [Around the World in 12 Books](http://www.nationalgeographic.com/travel/features/12-books-read-around-world/)
- [Around the World in 24 Hours](http://www.nationalgeographic.com/travel/features/around-the-world-in-24-hours/)
- [Artemis Ward](http://artemisward.com/)

<br>

## Browser Support

Scrawler supports all major modern browsers including IE 10+.

## License

MIT
