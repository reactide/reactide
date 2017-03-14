const https = require('https');
const request = require('request');
const fs = require('fs');

request('https://atom.io/download/electron/index.json', function(error, response, body) {
  if (!error && response.statusCode == 200) {
    const allElectronVersions = JSON.parse(body);
    const versions = {};
    const fullVersions = {};

    const makePrintable = mapping => JSON.stringify(mapping)
                                      .replace(/,/g, ",\n\t")
                                      .replace(/{/g, "{\n\t")
                                      .replace(/}/g, "\n}");

    allElectronVersions.forEach(electron => {
      // simple list
      const simpleVersion = electron.version.split(".")[0] + "." + electron.version.split(".")[1];
      versions[simpleVersion] = electron.chrome.split(".")[0];

      // explicit list
      fullVersions[electron.version] = electron.chrome;
    });

    fs.writeFile("versions.js", `module.exports = ${makePrintable(versions)};`, function (error) {
      if (error) {
        throw error;
      }
    });

    fs.writeFile("full-versions.js", `module.exports = ${makePrintable(fullVersions)};`, function (error) {
      if (error) {
        throw error;
      }
    });
  } else {
    throw error;
  }
})
