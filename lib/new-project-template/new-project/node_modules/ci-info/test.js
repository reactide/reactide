'use strict'

var assert = require('assert')
var clearRequire = require('clear-require')

// Known CI
process.env.TRAVIS = 'true'
var ci = require('./')

assert.equal(ci.isCI, true)
assert.equal(ci.name, 'Travis CI')
assert.equal(ci.TRAVIS, true)
assert.equal(ci.CIRCLE, false)
assert.equal(ci.GITLAB, false)
assert.equal(ci.APPVEYOR, false)
assert.equal(ci.CODESHIP, false)
assert.equal(ci.DRONE, false)
assert.equal(ci.MAGNUM, false)
assert.equal(ci.SEMAPHORE, false)
assert.equal(ci.JENKINS, false)
assert.equal(ci.BAMBOO, false)
assert.equal(ci.TFS, false)
assert.equal(ci.TEAMCITY, false)
assert.equal(ci.BUILDKITE, false)
assert.equal(ci.HUDSON, false)
assert.equal(ci.TASKCLUSTER, false)
assert.equal(ci.GOCD, false)
assert.equal(ci.BITBUCKET, false)

// Not CI
delete process.env.CI
delete process.env.CONTINUOUS_INTEGRATION
delete process.env.BUILD_NUMBER
delete process.env.TRAVIS
clearRequire('./')
ci = require('./')

assert.equal(ci.isCI, false)
assert.equal(ci.name, undefined)
assert.equal(ci.TRAVIS, false)
assert.equal(ci.CIRCLE, false)
assert.equal(ci.GITLAB, false)
assert.equal(ci.APPVEYOR, false)
assert.equal(ci.CODESHIP, false)
assert.equal(ci.DRONE, false)
assert.equal(ci.MAGNUM, false)
assert.equal(ci.SEMAPHORE, false)
assert.equal(ci.JENKINS, false)
assert.equal(ci.BAMBOO, false)
assert.equal(ci.TFS, false)
assert.equal(ci.TEAMCITY, false)
assert.equal(ci.BUILDKITE, false)
assert.equal(ci.HUDSON, false)
assert.equal(ci.TASKCLUSTER, false)
assert.equal(ci.GOCD, false)
assert.equal(ci.BITBUCKET, false)

// Unknown CI
process.env.CI = 'true'
clearRequire('./')
ci = require('./')

assert.equal(ci.isCI, true)
assert.equal(ci.name, undefined)
assert.equal(ci.TRAVIS, false)
assert.equal(ci.CIRCLE, false)
assert.equal(ci.GITLAB, false)
assert.equal(ci.APPVEYOR, false)
assert.equal(ci.CODESHIP, false)
assert.equal(ci.DRONE, false)
assert.equal(ci.MAGNUM, false)
assert.equal(ci.SEMAPHORE, false)
assert.equal(ci.JENKINS, false)
assert.equal(ci.BAMBOO, false)
assert.equal(ci.TFS, false)
assert.equal(ci.TEAMCITY, false)
assert.equal(ci.BUILDKITE, false)
assert.equal(ci.HUDSON, false)
assert.equal(ci.TASKCLUSTER, false)
assert.equal(ci.GOCD, false)
assert.equal(ci.BITBUCKET, false)
