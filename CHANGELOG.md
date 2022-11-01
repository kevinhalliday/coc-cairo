# Change Log

## 0.0.5

- fix server module discovery bug
- update coc.nvim to 0.0.82

## 0.0.4

- upgrades cairols to v0.0.9

## 0.0.3

- fixes broken completion after `from <module> import`, to allow for completion of module members
- implements missing commands: `nile.compile`, `nile.compile.all`, `nile.clean`, and `pytest`
- adds `cairols.serverModule` config, to allow for user specification of the language server implementation

## 0.0.2

- remove `cairo` configuration namespace (`cairo.enabled`) was the only option
- add `cairols` configuration namespace, copied from https://github.com/ericglau/cairo-ls/blob/main/package.json, to allow users to fully configure cairo-ls

## 0.0.1

- initial version
- supports `cairo.enabled` configuration
