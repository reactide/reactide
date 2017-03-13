# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

<a name="3.1.2"></a>
## [3.1.2](https://github.com/istanbuljs/babel-plugin-istanbul/compare/v3.1.1...v3.1.2) (2017-01-04)


### Bug Fixes

* address regression related to export const foo = () => {} ([#79](https://github.com/istanbuljs/babel-plugin-istanbul/issues/79)) ([f870a8f](https://github.com/istanbuljs/babel-plugin-istanbul/commit/f870a8f))



<a name="3.1.1"></a>
## [3.1.1](https://github.com/istanbuljs/babel-plugin-istanbul/compare/v3.1.0...v3.1.1) (2017-01-02)



<a name="3.1.0"></a>
# [3.1.0](https://github.com/istanbuljs/babel-plugin-istanbul/compare/v3.0.0...v3.1.0) (2016-12-27)


### Bug Fixes

* upgrade a bunch of core dependencies ([#77](https://github.com/istanbuljs/babel-plugin-istanbul/issues/77)) ([e764330](https://github.com/istanbuljs/babel-plugin-istanbul/commit/e764330))


### Features

* accept source map input for the visitor ([#75](https://github.com/istanbuljs/babel-plugin-istanbul/issues/75)) ([437e90b](https://github.com/istanbuljs/babel-plugin-istanbul/commit/437e90b))



<a name="3.0.0"></a>
# [3.0.0](https://github.com/istanbuljs/babel-plugin-istanbul/compare/v2.0.3...v3.0.0) (2016-11-14)


### Chores

* **package:** update test-exclude to version 3.0.0 ([#68](https://github.com/istanbuljs/babel-plugin-istanbul/issues/68)) ([0396385](https://github.com/istanbuljs/babel-plugin-istanbul/commit/0396385))


### BREAKING CHANGES

* package: test-exclude now adds `**/node_modules/**` as exclude rule by default.



<a name="2.0.3"></a>
## [2.0.3](https://github.com/istanbuljs/babel-plugin-istanbul/compare/v2.0.2...v2.0.3) (2016-10-17)


### Bug Fixes

* force istanbul-lib-instrument with variable hoisting fix ([#64](https://github.com/istanbuljs/babel-plugin-istanbul/issues/64)) ([209a0cf](https://github.com/istanbuljs/babel-plugin-istanbul/commit/209a0cf))
* switch deprecated lodash.assign for object-assign ([#58](https://github.com/istanbuljs/babel-plugin-istanbul/issues/58)) ([6e051fc](https://github.com/istanbuljs/babel-plugin-istanbul/commit/6e051fc))



<a name="2.0.2"></a>
## [2.0.2](https://github.com/istanbuljs/babel-plugin-istanbul/compare/v2.0.1...v2.0.2) (2016-09-08)


### Bug Fixes

* take realpath of cwd, whether or not set in env ([#37](https://github.com/istanbuljs/babel-plugin-istanbul/issues/37)) ([6274d83](https://github.com/istanbuljs/babel-plugin-istanbul/commit/6274d83))



<a name="2.0.1"></a>
## [2.0.1](https://github.com/istanbuljs/babel-plugin-istanbul/compare/v2.0.0...v2.0.1) (2016-09-02)


### Bug Fixes

* update istanbul-lib-instrument ([573e0d4](https://github.com/istanbuljs/babel-plugin-istanbul/commit/573e0d4))



<a name="2.0.0"></a>
# [2.0.0](https://github.com/istanbuljs/babel-plugin-istanbul/compare/v1.1.0...v2.0.0) (2016-08-14)


### Chores

* upgrade to version of test-exclude with new exclude rules ([#35](https://github.com/istanbuljs/babel-plugin-istanbul/issues/35)) ([220ce2b](https://github.com/istanbuljs/babel-plugin-istanbul/commit/220ce2b))


### BREAKING CHANGES

* see https://github.com/istanbuljs/test-exclude/blob/master/CHANGELOG.md#breaking-changes



<a name="1.1.0"></a>
# [1.1.0](https://github.com/istanbuljs/babel-plugin-istanbul/compare/v1.0.3...v1.1.0) (2016-07-21)


### Bug Fixes

* upgrade to istanbul-lib-instrument with faster babel-generator ([#18](https://github.com/istanbuljs/babel-plugin-istanbul/issues/18)) ([d33263c](https://github.com/istanbuljs/babel-plugin-istanbul/commit/d33263c))


### Features

* allow exclude/include options to be passed as Babel plugin config ([#16](https://github.com/istanbuljs/babel-plugin-istanbul/issues/16)) ([cf68421](https://github.com/istanbuljs/babel-plugin-istanbul/commit/cf68421))



<a name="1.0.3"></a>
## [1.0.3](https://github.com/istanbuljs/babel-plugin-istanbul/compare/v1.0.2...v1.0.3) (2016-07-09)


### Bug Fixes

* keep using NYC_CWD if available ([#10](https://github.com/istanbuljs/babel-plugin-istanbul/issues/10)) ([db0352b](https://github.com/istanbuljs/babel-plugin-istanbul/commit/db0352b))



<a name="1.0.2"></a>
## [1.0.2](https://github.com/istanbuljs/babel-plugin-istanbul/compare/v1.0.1...v1.0.2) (2016-07-03)


### Bug Fixes

* take realpath of process.cwd(), fixes [#7](https://github.com/istanbuljs/babel-plugin-istanbul/issues/7) ([#8](https://github.com/istanbuljs/babel-plugin-istanbul/issues/8)) ([e8d3785](https://github.com/istanbuljs/babel-plugin-istanbul/commit/e8d3785)), closes [#7](https://github.com/istanbuljs/babel-plugin-istanbul/issues/7) [#8](https://github.com/istanbuljs/babel-plugin-istanbul/issues/8)



<a name="1.0.1"></a>
## [1.0.1](https://github.com/istanbuljs/babel-plugin-istanbul/compare/v1.0.0...v1.0.1) (2016-06-30)


### Bug Fixes

* upgrade to version of istanbul-lib-instrument that fixes some out of bounds issues ([#6](https://github.com/istanbuljs/babel-plugin-istanbul/issues/6)) ([a949065](https://github.com/istanbuljs/babel-plugin-istanbul/commit/a949065)), closes [#6](https://github.com/istanbuljs/babel-plugin-istanbul/issues/6)


<a name="1.0.0"></a>
# 1.0.0 (2016-06-26)


### Features

* port functionality from __coverage__, get ready for first release ([#2](https://github.com/istanbuljs/babel-plugin-istanbul/issues/2)) ([2a8ee44](https://github.com/istanbuljs/babel-plugin-istanbul/commit/2a8ee44))
