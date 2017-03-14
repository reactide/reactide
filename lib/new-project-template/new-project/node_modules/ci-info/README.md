# ci-info

Get details about the current Continuous Integration environment.

Please [open an issue](https://github.com/watson/ci-info/issues) if your
CI server isn't properly detected :)

[![Build status](https://travis-ci.org/watson/ci-info.svg?branch=master)](https://travis-ci.org/watson/ci-info)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)

## Installation

```
npm install ci-info --save
```

## Usage

```js
var ci = require('ci-info')

if (ci.isCI) {
  console.log('The name of the CI server is:', ci.name)
} else {
  console.log('This program is not running on a CI server')
}
```

## Supported CI tools

Officially supported CI servers:

- [Travis CI](http://travis-ci.org)
- [CircleCI](http://circleci.com)
- [Jenkins CI](https://jenkins-ci.org)
- [Hudson](http://hudson-ci.org)
- [Bamboo](https://www.atlassian.com/software/bamboo) by Atlassian
- [TeamCity](https://www.jetbrains.com/teamcity/) by JetBrains
- [Team Foundation Server](https://www.visualstudio.com/en-us/products/tfs-overview-vs.aspx) by Microsoft
- [GitLab CI](https://about.gitlab.com/gitlab-ci/)
- [Codeship](https://codeship.com)
- [Drone](https://drone.io)
- [Magnum CI](https://magnum-ci.com)
- [Semaphore](https://semaphoreci.com)
- [AppVeyor](http://www.appveyor.com)
- [Buildkite](https://buildkite.com)
- [TaskCluster](http://docs.taskcluster.net)
- [GoCD](https://www.go.cd/)
- [Bitbucket Pipelines](https://bitbucket.org/product/features/pipelines)

## API

### `ci.name`

A string. Will contain the name of the CI server the code is running on.
If not CI server is detected, it will be `null`.

Don't depend on the value of this string not to change for a specific
vendor. If you find your self writing `ci.name === 'Travis CI'`, you
most likely want to use `ci.TRAVIS` instead.

### `ci.isCI`

A boolean. Will be `true` if the code is running on a CI server.
Otherwise `false`.

Some CI servers not listed here might still trigger the `ci.isCI`
boolean to be set to `true` if they use certain vendor neutral
environment variables. In those cases `ci.name` will be `null` and no
vendor specific boolean will be set to `true`.

### `ci.<VENDOR-CONSTANT>`

The following vendor specific boolean constants are exposed. A constant
will be `true` if the code is determined to run on the given CI server.
Otherwise `false`.

- `ci.TRAVIS`
- `ci.CIRCLE`
- `ci.GITLAB`
- `ci.APPVEYOR`
- `ci.CODESHIP`
- `ci.DRONE`
- `ci.MAGNUM`
- `ci.SEMAPHORE`
- `ci.JENKINS`
- `ci.BAMBOO`
- `ci.TFS` (Team Foundation Server)
- `ci.TEAMCITY`
- `ci.BUILDKITE`
- `ci.HUDSON`
- `ci.TASKCLUSTER`
- `ci.GOCD`
- `ci.BITBUCKET`

## License

MIT
