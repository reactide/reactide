# 1.16.0 (2016-09-17)

- Backport a few more fixes from v2:
    - Add `clientLogLevel` (`--client-log-level` for CLI) option. It controls the log messages shown in the browser. Available levels are `error`, `warning`, `info` or `none` ([#579](https://github.com/webpack/webpack-dev-server/issues/579)).
    - Limit websocket retries when the server can't be reached ([#589](https://github.com/webpack/webpack-dev-server/issues/589)).

# 1.15.2 (2016-09-14)

- Backport a few fixes from v2 ([#604](https://github.com/webpack/webpack-dev-server/pull/604)):
    - Using https and manually including the client script resulted in a wrong url for the websocket.
    - Manually including the client script didn't work resulted in a wrong url for the websocket in some cases.
    - Compatibility with platforms that don't use a hostname (Electron / Ionic).

# 1.15.1 (2016-08-31)

- Fix the `bypass` config option for proxies (#563).
- Reverted a change that prevented clicks from registering in the iframe.
- Fix using `*` as a proxy wildcard.
- Avoid accessing `document` when using inline modus (#577).

# 1.15.0 (2016-08-23)

- Use http-proxy-middleware instead of http-proxy. This fixes compatibility with native web sockets (#359).
- Properly close the server, which fixes issues with the port not freeing up (#357).
- Add `--stdin` flag, to close the dev server on process exit (#352).
- Fix issues with incorrect socket urls (#338, #443, #447).
- Add `--open` flag to open a browser pointing to the server (#329).
- Add `--public` flag to override the url used for connecting to the web socket (#368).
- Allow array for `options.contentBase`, so multiple sources are allowed (#374).
- Add `options.staticOptions` to allow passing through Express static options (#385).
- Update self-signed certs (#436).
- Don't reload the app upon proxy errors (#478).
- Allow running dev-server behind https proxy (#470).
- Set headers on all requests to support e.g. CORS (#499).
- Fix `--cacert` flag not doing anything (#532).
- Allow using Express middleware (#537).
