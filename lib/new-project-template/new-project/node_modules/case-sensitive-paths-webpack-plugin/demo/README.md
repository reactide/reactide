# Just a Demo

### Purpose
This demo provides a working example of the Case Sensitive Paths - Webpack Plugin in action. The demo source is just a basic React app compiled with Webpack. The unit-tests show that attempting to `import` modules that are spelled correctly - but with incorrect cases in the filename or path - will result in a Webpack build error.

### Use
To run the demo project:

* clone the full plugin repo
* `cd /demo`
* `npm install`
* `npm start`

To run the demo tests:
* (everything above)
* `npm test`

You should see 3 passed tests and 2 errors: `Module not found: Error: CaseSensitivePathsPlugin:`. In those examples, we've deliberately misspelled the cases of a module name or path, and the plugin has caused Webpack to throw an error during build. 


Note the following:

* If you want to test the plugin like this in your own project, and you have a separate webpack config for testing (this one is in karma.conf.js), you'll need to also include the plugin there.
* This demo is based on patterns borrowed from a host of React/Webpack seed projects, but it's impossible to say which parts from where. Many thanks to the robust React community for providing such excellent tooling!