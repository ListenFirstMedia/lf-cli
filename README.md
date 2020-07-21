lf-cli
==

The ListenFirst API Command Line Interface

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/ls.svg)](https://npmjs.org/package/ls)
[![Downloads/week](https://img.shields.io/npm/dw/ls.svg)](https://npmjs.org/package/ls)
[![License](https://img.shields.io/npm/l/ls.svg)](https://github.com/ListenFirstMedia/lf-cli/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g lf-cli
$ lf-cli COMMAND
running command...
$ lf-cli (-v|--version|version)
lf-cli/0.0.0 darwin-x64 node-v12.16.3
$ lf-cli --help [COMMAND]
USAGE
  $ lf-cli COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`lf-cli analytics [FILE]`](#lf-cli-analytics-file)
* [`lf-cli analytics:fetch [FILE]`](#lf-cli-analyticsfetch-file)
* [`lf-cli auth [FILE]`](#lf-cli-auth-file)
* [`lf-cli auth:token [FILE]`](#lf-cli-authtoken-file)
* [`lf-cli brand_view_sets [FILE]`](#lf-cli-brand_view_sets-file)
* [`lf-cli brand_view_sets:get [FILE]`](#lf-cli-brand_view_setsget-file)
* [`lf-cli brand_view_sets:list [FILE]`](#lf-cli-brand_view_setslist-file)
* [`lf-cli brand_views [FILE]`](#lf-cli-brand_views-file)
* [`lf-cli brand_views:get [FILE]`](#lf-cli-brand_viewsget-file)
* [`lf-cli brand_views:list [FILE]`](#lf-cli-brand_viewslist-file)
* [`lf-cli config`](#lf-cli-config)
* [`lf-cli config:create`](#lf-cli-configcreate)
* [`lf-cli config:show`](#lf-cli-configshow)
* [`lf-cli config:verify`](#lf-cli-configverify)
* [`lf-cli datasets [FILE]`](#lf-cli-datasets-file)
* [`lf-cli datasets:field-values [FILE]`](#lf-cli-datasetsfield-values-file)
* [`lf-cli datasets:get [FILE]`](#lf-cli-datasetsget-file)
* [`lf-cli datasets:list [FILE]`](#lf-cli-datasetslist-file)
* [`lf-cli help [COMMAND]`](#lf-cli-help-command)

## `lf-cli analytics [FILE]`

describe the command here

```
USAGE
  $ lf-cli analytics [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print
```

_See code: [src/commands/analytics/index.ts](https://github.com/ListenFirstMedia/lf-cli/blob/v0.0.0/src/commands/analytics/index.ts)_

## `lf-cli analytics:fetch [FILE]`

describe the command here

```
USAGE
  $ lf-cli analytics:fetch [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print
```

_See code: [src/commands/analytics/fetch.ts](https://github.com/ListenFirstMedia/lf-cli/blob/v0.0.0/src/commands/analytics/fetch.ts)_

## `lf-cli auth [FILE]`

describe the command here

```
USAGE
  $ lf-cli auth [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print
```

_See code: [src/commands/auth/index.ts](https://github.com/ListenFirstMedia/lf-cli/blob/v0.0.0/src/commands/auth/index.ts)_

## `lf-cli auth:token [FILE]`

describe the command here

```
USAGE
  $ lf-cli auth:token [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print
```

_See code: [src/commands/auth/token.ts](https://github.com/ListenFirstMedia/lf-cli/blob/v0.0.0/src/commands/auth/token.ts)_

## `lf-cli brand_view_sets [FILE]`

describe the command here

```
USAGE
  $ lf-cli brand_view_sets [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print
```

_See code: [src/commands/brand_view_sets/index.ts](https://github.com/ListenFirstMedia/lf-cli/blob/v0.0.0/src/commands/brand_view_sets/index.ts)_

## `lf-cli brand_view_sets:get [FILE]`

describe the command here

```
USAGE
  $ lf-cli brand_view_sets:get [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print
```

_See code: [src/commands/brand_view_sets/get.ts](https://github.com/ListenFirstMedia/lf-cli/blob/v0.0.0/src/commands/brand_view_sets/get.ts)_

## `lf-cli brand_view_sets:list [FILE]`

describe the command here

```
USAGE
  $ lf-cli brand_view_sets:list [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print
```

_See code: [src/commands/brand_view_sets/list.ts](https://github.com/ListenFirstMedia/lf-cli/blob/v0.0.0/src/commands/brand_view_sets/list.ts)_

## `lf-cli brand_views [FILE]`

describe the command here

```
USAGE
  $ lf-cli brand_views [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print
```

_See code: [src/commands/brand_views/index.ts](https://github.com/ListenFirstMedia/lf-cli/blob/v0.0.0/src/commands/brand_views/index.ts)_

## `lf-cli brand_views:get [FILE]`

describe the command here

```
USAGE
  $ lf-cli brand_views:get [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print
```

_See code: [src/commands/brand_views/get.ts](https://github.com/ListenFirstMedia/lf-cli/blob/v0.0.0/src/commands/brand_views/get.ts)_

## `lf-cli brand_views:list [FILE]`

describe the command here

```
USAGE
  $ lf-cli brand_views:list [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print
```

_See code: [src/commands/brand_views/list.ts](https://github.com/ListenFirstMedia/lf-cli/blob/v0.0.0/src/commands/brand_views/list.ts)_

## `lf-cli config`

List configuration profiles

```
USAGE
  $ lf-cli config

OPTIONS
  -h, --help  show CLI help

ALIASES
  $ lf-cli config:index
  $ lf-cli config:list
```

_See code: [src/commands/config/index.ts](https://github.com/ListenFirstMedia/lf-cli/blob/v0.0.0/src/commands/config/index.ts)_

## `lf-cli config:create`

Create or update a configuration profile

```
USAGE
  $ lf-cli config:create

OPTIONS
  -h, --help             show CLI help
  -p, --profile=profile  [default: default] the name of the profile

ALIASES
  $ lf-cli config:index
  $ lf-cli config:create
```

_See code: [src/commands/config/create.ts](https://github.com/ListenFirstMedia/lf-cli/blob/v0.0.0/src/commands/config/create.ts)_

## `lf-cli config:show`

Show the configuration profile

```
USAGE
  $ lf-cli config:show

OPTIONS
  -h, --help             show CLI help
  -p, --profile=profile  [default: default] the name of the profile
```

_See code: [src/commands/config/show.ts](https://github.com/ListenFirstMedia/lf-cli/blob/v0.0.0/src/commands/config/show.ts)_

## `lf-cli config:verify`

Verify the profile

```
USAGE
  $ lf-cli config:verify

OPTIONS
  -h, --help             show CLI help
  -p, --profile=profile  [default: default] the name of the profile
```

_See code: [src/commands/config/verify.ts](https://github.com/ListenFirstMedia/lf-cli/blob/v0.0.0/src/commands/config/verify.ts)_

## `lf-cli datasets [FILE]`

describe the command here

```
USAGE
  $ lf-cli datasets [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print
```

_See code: [src/commands/datasets/index.ts](https://github.com/ListenFirstMedia/lf-cli/blob/v0.0.0/src/commands/datasets/index.ts)_

## `lf-cli datasets:field-values [FILE]`

describe the command here

```
USAGE
  $ lf-cli datasets:field-values [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print
```

_See code: [src/commands/datasets/field-values.ts](https://github.com/ListenFirstMedia/lf-cli/blob/v0.0.0/src/commands/datasets/field-values.ts)_

## `lf-cli datasets:get [FILE]`

describe the command here

```
USAGE
  $ lf-cli datasets:get [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print
```

_See code: [src/commands/datasets/get.ts](https://github.com/ListenFirstMedia/lf-cli/blob/v0.0.0/src/commands/datasets/get.ts)_

## `lf-cli datasets:list [FILE]`

describe the command here

```
USAGE
  $ lf-cli datasets:list [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print
```

_See code: [src/commands/datasets/list.ts](https://github.com/ListenFirstMedia/lf-cli/blob/v0.0.0/src/commands/datasets/list.ts)_

## `lf-cli help [COMMAND]`

display help for lf-cli

```
USAGE
  $ lf-cli help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.1.0/src/commands/help.ts)_
<!-- commandsstop -->
