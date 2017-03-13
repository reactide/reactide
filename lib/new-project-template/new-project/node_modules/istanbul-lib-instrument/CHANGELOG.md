# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

<a name="1.4.2"></a>
## [1.4.2](https://github.com/istanbuljs/istanbul-lib-instrument/compare/v1.4.1...v1.4.2) (2017-01-04)


### Bug Fixes

* only hoist counter for a smaller subset of function declarations ([9f8931e](https://github.com/istanbuljs/istanbul-lib-instrument/commit/9f8931e))



<a name="1.4.1"></a>
## [1.4.1](https://github.com/istanbuljs/istanbul-lib-instrument/compare/v1.4.0...v1.4.1) (2017-01-04)


### Bug Fixes

* address regression discussed in https://github.com/istanbuljs/babel-plugin-istanbul/issues/78 ([#40](https://github.com/istanbuljs/istanbul-lib-instrument/issues/40)) ([7f458a3](https://github.com/istanbuljs/istanbul-lib-instrument/commit/7f458a3))



<a name="1.4.0"></a>
# [1.4.0](https://github.com/istanbuljs/istanbul-lib-instrument/compare/v1.3.1...v1.4.0) (2017-01-02)


### Features

* preserve inferred function names ([#38](https://github.com/istanbuljs/istanbul-lib-instrument/issues/38)) ([312666e](https://github.com/istanbuljs/istanbul-lib-instrument/commit/312666e))



<a name="1.3.1"></a>
## [1.3.1](https://github.com/istanbuljs/istanbul-lib-instrument/compare/v1.3.0...v1.3.1) (2016-12-27)


### Bug Fixes

* function declaration assignment now retains function name ([#33](https://github.com/istanbuljs/istanbul-lib-instrument/issues/33)) ([2d781da](https://github.com/istanbuljs/istanbul-lib-instrument/commit/2d781da))



<a name="1.3.0"></a>
# [1.3.0](https://github.com/istanbuljs/istanbul-lib-instrument/compare/v1.2.0...v1.3.0) (2016-11-10)


### Features

* allow an input source-map to be passed to instrumentSync()  ([#23](https://github.com/istanbuljs/istanbul-lib-instrument/issues/23)) ([b08e4f5](https://github.com/istanbuljs/istanbul-lib-instrument/commit/b08e4f5))



<a name="1.2.0"></a>
# [1.2.0](https://github.com/istanbuljs/istanbul-lib-instrument/compare/v1.1.4...v1.2.0) (2016-10-25)


### Features

* implement function to extract empty coverage data from an instrumented file ([#28](https://github.com/istanbuljs/istanbul-lib-instrument/issues/28)) ([06d0ef6](https://github.com/istanbuljs/istanbul-lib-instrument/commit/06d0ef6))



<a name="1.1.4"></a>
## [1.1.4](https://github.com/istanbuljs/istanbul-lib-instrument/compare/v1.1.3...v1.1.4) (2016-10-17)


### Bug Fixes

* hoist coverage variable to very top of file ([#26](https://github.com/istanbuljs/istanbul-lib-instrument/issues/26)) ([0225e8c](https://github.com/istanbuljs/istanbul-lib-instrument/commit/0225e8c))



<a name="1.1.3"></a>
## [1.1.3](https://github.com/istanbuljs/istanbul-lib-instrument/compare/v1.1.2...v1.1.3) (2016-09-13)


### Performance Improvements

* simplify coverage variable naming https://github.com/istanbuljs/istanbul-lib-instrument/pull/24 ([7252aae](https://github.com/istanbuljs/istanbul-lib-instrument/commit/7252aae))



<a name="1.1.2"></a>
## [1.1.2](https://github.com/istanbuljs/istanbul-lib-instrument/compare/v1.1.1...v1.1.2) (2016-09-08)


### Performance Improvements

* use zero-based numeric indices for much faster instrumented code ([#22](https://github.com/istanbuljs/istanbul-lib-instrument/issues/22)) ([5b401f5](https://github.com/istanbuljs/istanbul-lib-instrument/commit/5b401f5))



<a name="1.1.1"></a>
## [1.1.1](https://github.com/istanbuljs/istanbul-lib-instrument/compare/v1.1.0...v1.1.1) (2016-08-30)


### Bug Fixes

* upgrade istanbul-lib-coverage ([eb9b1f6](https://github.com/istanbuljs/istanbul-lib-instrument/commit/eb9b1f6))



<a name="1.1.0"></a>
# [1.1.0](https://github.com/istanbuljs/istanbul-lib-instrument/compare/v1.1.0-alpha.4...v1.1.0) (2016-08-11)


### Bug Fixes

* guard against invalid loc ([#16](https://github.com/istanbuljs/istanbul-lib-instrument/issues/16)) ([23ebfc3](https://github.com/istanbuljs/istanbul-lib-instrument/commit/23ebfc3))



<a name="1.1.0-alpha.4"></a>
# [1.1.0-alpha.4](https://github.com/istanbuljs/istanbul-lib-instrument/compare/v1.0.0-alpha.5...v1.1.0-alpha.4) (2016-07-20)


### Bug Fixes

* require more performant babel-generator ([#15](https://github.com/istanbuljs/istanbul-lib-instrument/issues/15)) ([21b2563](https://github.com/istanbuljs/istanbul-lib-instrument/commit/21b2563))
