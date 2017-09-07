CHANGELOG
=========

## 1.2.3 (pre-release)

## 1.2.2 (2017-09-07)

#### fixes:
- fixed importing error in ES6 environment with Webpack; prioritized CommonJS module.

## 1.2.1 (2017-05-01)

#### fixes:
- fixed an error occurring when no `Scralwer.baseline` is entered (finally!).

## 1.2.0 (2017-05-01)

#### new features:
- added `progress.vf` value and `Scrawler.Unit.vf()`, which is a relative progress value based on the viewport height.

#### updates:
- updated to automatically run engine after resize.

#### fixes:
- fixed an error occurring when no `Scralwer.baseline` is entered.
- fixed typo in README.md

## 1.1.2 (2017-04-21)

#### fixes:
- fixed missing `this` instance while refreshing

## 1.1.1 (2017-04-20)

#### fixes:
- fixed interpreting `baseline:0` to `baseline:false` when creating `Scralwer`.

## 1.1.0 (2017-04-18)

#### features:
- supports multiple Scrawler objects

## 1.0.0 (2017-04-18)

#### breaking changes:
- renamed `Unit.map()` to `Unit.scale()`.

#### updates:
- combined all classes under `Scrawler`.
- updated to handle `f` values in options/settings.
- completed README.md draft.

## 0.3.0 (2017-04-17, beta release)

#### breaking changes:
- replaced `Scrawler.Position.dc` with `Scrawler.Position.f`, meaning unit interval (fraction/float). same usage, only name changed.
- removed `Scrawler.Position.pc`. No percentage value provided any more.
- removed `pause` parameter from `Scrawler.watch()`. if pausing is required, it should be done by not executing `Scrawler.watch()`.

#### updates:
- updated examples for breaking changes above
- changed name in License
- added compile process
- added es6
- enhanced code legibility
- added mangle for object parameters, replaced uglifyify with uglify-js

#### notes:
- won't add `sortLogics` parameter for Scrawler instance. `Scrawler.sort()` will exist, but users need to execute `Scrawler.sort()` to sort Logics.

## 0.2.1 (2017-03-06, beta release)

#### fixes:
- fixed baseline calc fn to run on ES5 strict mode

## 0.2.0 (2017-03-02, beta release)

#### features:
- added Scrawler.watch() (for externa rAF use cases)
- added Scrawler.refresh()

#### updates:
- minor performance enhancement

## 0.1.1 (2017-02-28, beta release)

#### updates:
- removed console.logs

## 0.1.0 (2017-02-28, beta release)

#### features:
- added onResize recalculation

#### updates:
- minor changes in code arrangement

## 0.0.2 (2016-12-14, alpha release)

#### updates:
- added edge detection in mapped ranges
- updated examples
- added default Unit baseline value = 0 (top)
- removed rounding of baseline.px values
- cleaned up AMD/commonJS modular code
- removed unnecessary npm packages and updated package.json

#### fixes:
- fixed watch script in package.json
- added default args value of Scrawler constructor

## 0.0.1 (2016-12-13, alpha release)

#### features:
- introduced basic Scrawler functions: add, remove, sort, run, pause
- introduced a position mapping function: map

## Initial Commit (2016-11-29)

#### features:
- added bolierplate files



