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
* [`lf-cli analytics:fetch QUERY_FILE`](#lf-cli-analyticsfetch-query_file)
* [`lf-cli analytics:generate`](#lf-cli-analyticsgenerate)
* [`lf-cli auth:me`](#lf-cli-authme)
* [`lf-cli auth:token`](#lf-cli-authtoken)
* [`lf-cli brand_view_sets:get ID`](#lf-cli-brand_view_setsget-id)
* [`lf-cli brand_view_sets:list`](#lf-cli-brand_view_setslist)
* [`lf-cli brand_views:get ID`](#lf-cli-brand_viewsget-id)
* [`lf-cli brand_views:list`](#lf-cli-brand_viewslist)
* [`lf-cli config:create`](#lf-cli-configcreate)
* [`lf-cli config:list`](#lf-cli-configlist)
* [`lf-cli config:show`](#lf-cli-configshow)
* [`lf-cli config:verify`](#lf-cli-configverify)
* [`lf-cli datasets:field-values FIELD`](#lf-cli-datasetsfield-values-field)
* [`lf-cli datasets:get ID`](#lf-cli-datasetsget-id)
* [`lf-cli datasets:list`](#lf-cli-datasetslist)
* [`lf-cli help [COMMAND]`](#lf-cli-help-command)

## `lf-cli analytics:fetch QUERY_FILE`

Perform an analytical query

```
USAGE
  $ lf-cli analytics:fetch QUERY_FILE

ARGUMENTS
  QUERY_FILE  [default: -] a file containing the query json document

OPTIONS
  -h, --help              show CLI help
  -p, --profile=profile   the name of the configuration profile
  --columns=columns       only show provided columns (comma-separated)
  --csv                   output is csv format [alias: --output=csv]
  --[no-]fields           list fields in output
  --filter=filter         filter property by partial string matching, ex: name=foo
  --format=raw|table|doc  [default: raw] output format of the results
  --no-header             hide table header from output
  --no-truncate           do not truncate output to fit screen
  --pretty                pretty print json responses (applies to raw or doc formats)
  --sort=sort             property to sort by (prepend '-' for descending)

DESCRIPTION
  Submit a multi-dimensional, aggregate, time series analytical query. 
  Start and End time parameters are used to specify the time window of 
  the query. The Dataset ID determines the scope of dimensions and 
  metrics available in the query for selection, filtering, grouping, 
  and sorting. Consult the Data Dictionary for available Datasets, 
  Fields and their capabilities.
```

_See code: [src/commands/analytics/fetch.ts](https://github.com/ListenFirstMedia/lf-cli/blob/v0.0.0/src/commands/analytics/fetch.ts)_

## `lf-cli analytics:generate`

Generate a query template

```
USAGE
  $ lf-cli analytics:generate

OPTIONS
  -h, --help             show CLI help
  -p, --profile=profile  the name of the configuration profile
```

_See code: [src/commands/analytics/generate.ts](https://github.com/ListenFirstMedia/lf-cli/blob/v0.0.0/src/commands/analytics/generate.ts)_

## `lf-cli auth:me`

Show currently authenticated user.

```
USAGE
  $ lf-cli auth:me

OPTIONS
  -h, --help              show CLI help
  -p, --profile=profile   the name of the configuration profile
  --columns=columns       only show provided columns (comma-separated)
  --csv                   output is csv format [alias: --output=csv]
  --filter=filter         filter property by partial string matching, ex: name=foo
  --format=raw|table|doc  [default: raw] output format of the results
  --no-header             hide table header from output
  --no-truncate           do not truncate output to fit screen
  --pretty                pretty print json responses (applies to raw or doc formats)
  --sort=sort             property to sort by (prepend '-' for descending)

DESCRIPTION
  Retrieve metadata for the currently authenticated ListenFirst
  platform user and associated, active ListenFirst Account
```

_See code: [src/commands/auth/me.ts](https://github.com/ListenFirstMedia/lf-cli/blob/v0.0.0/src/commands/auth/me.ts)_

## `lf-cli auth:token`

Obtain an access token

```
USAGE
  $ lf-cli auth:token

OPTIONS
  -h, --help             show CLI help
  -p, --profile=profile  the name of the configuration profile

DESCRIPTION
  This command provides the ability to obtain an access
  token via the OAuth 2.0 client credentials workflow.  
  The process authenticates using the Client ID and 
  Client Secret found in the lf-cli configuration profile.
  The access token will be written to stdout.

EXAMPLES
  $ lf-cli auth
  $ lf-cli auth > access-token.json
```

_See code: [src/commands/auth/token.ts](https://github.com/ListenFirstMedia/lf-cli/blob/v0.0.0/src/commands/auth/token.ts)_

## `lf-cli brand_view_sets:get ID`

Get a Brand View Aet

```
USAGE
  $ lf-cli brand_view_sets:get ID

ARGUMENTS
  ID  the ID of the Brand View Set to retrieve

OPTIONS
  -h, --help              show CLI help
  -p, --profile=profile   the name of the configuration profile
  --columns=columns       only show provided columns (comma-separated)
  --csv                   output is csv format [alias: --output=csv]
  --filter=filter         filter property by partial string matching, ex: name=foo
  --format=raw|table|doc  [default: raw] output format of the results
  --no-header             hide table header from output
  --no-truncate           do not truncate output to fit screen
  --pretty                pretty print json responses (applies to raw or doc formats)
  --sort=sort             property to sort by (prepend '-' for descending)

DESCRIPTION
  Retrieve a Brand View Set by id.
```

_See code: [src/commands/brand_view_sets/get.ts](https://github.com/ListenFirstMedia/lf-cli/blob/v0.0.0/src/commands/brand_view_sets/get.ts)_

## `lf-cli brand_view_sets:list`

List Brand View Sets

```
USAGE
  $ lf-cli brand_view_sets:list

OPTIONS
  -h, --help              show CLI help
  -p, --profile=profile   the name of the configuration profile
  --columns=columns       only show provided columns (comma-separated)
  --csv                   output is csv format [alias: --output=csv]
  --filter=filter         filter property by partial string matching, ex: name=foo
  --format=raw|table|doc  [default: raw] output format of the results
  --no-header             hide table header from output
  --no-truncate           do not truncate output to fit screen
  --pretty                pretty print json responses (applies to raw or doc formats)
  --sort=sort             property to sort by (prepend '-' for descending)

DESCRIPTION
  Retrieve the list of a Brand View Sets available to the ListenFirst 
  Account associated with the access token.
```

_See code: [src/commands/brand_view_sets/list.ts](https://github.com/ListenFirstMedia/lf-cli/blob/v0.0.0/src/commands/brand_view_sets/list.ts)_

## `lf-cli brand_views:get ID`

Get a Brand View

```
USAGE
  $ lf-cli brand_views:get ID

ARGUMENTS
  ID  the ID of the Brand View to retrieve

OPTIONS
  -h, --help              show CLI help
  -p, --profile=profile   the name of the configuration profile
  --columns=columns       only show provided columns (comma-separated)
  --csv                   output is csv format [alias: --output=csv]
  --fields=fields         Comma seperated list of fields to include
  --filter=filter         filter property by partial string matching, ex: name=foo
  --format=raw|table|doc  [default: raw] output format of the results
  --no-header             hide table header from output
  --no-truncate           do not truncate output to fit screen
  --pretty                pretty print json responses (applies to raw or doc formats)
  --sort=sort             property to sort by (prepend '-' for descending)

DESCRIPTION
  Retrieve a Brand View by id.
```

_See code: [src/commands/brand_views/get.ts](https://github.com/ListenFirstMedia/lf-cli/blob/v0.0.0/src/commands/brand_views/get.ts)_

## `lf-cli brand_views:list`

List Brand Views

```
USAGE
  $ lf-cli brand_views:list

OPTIONS
  -h, --help              show CLI help
  -p, --profile=profile   the name of the configuration profile
  --columns=columns       only show provided columns (comma-separated)
  --csv                   output is csv format [alias: --output=csv]
  --fields=fields         Comma seperated list of fields to include
  --filter=filter         filter property by partial string matching, ex: name=foo
  --format=raw|table|doc  [default: raw] output format of the results
  --max-page=max-page     [default: 1] the max page number to fetch (-1 for all pages)
  --no-header             hide table header from output
  --no-truncate           do not truncate output to fit screen
  --page=page             [default: 1] starting page number
  --per-page=per-page     [default: 1000] number of results per page
  --pretty                pretty print json responses (applies to raw or doc formats)
  --sort=sort             property to sort by (prepend '-' for descending)

DESCRIPTION
  Returns an array of all Brand Views available to the ListenFirst 
  Account associated with the access token. Results may be filtered 
  and sorted by Brand Metadata Dimensions.
```

_See code: [src/commands/brand_views/list.ts](https://github.com/ListenFirstMedia/lf-cli/blob/v0.0.0/src/commands/brand_views/list.ts)_

## `lf-cli config:create`

Create or update a configuration profile

```
USAGE
  $ lf-cli config:create

OPTIONS
  -h, --help             show CLI help
  -p, --profile=profile  the name of the configuration profile
```

_See code: [src/commands/config/create.ts](https://github.com/ListenFirstMedia/lf-cli/blob/v0.0.0/src/commands/config/create.ts)_

## `lf-cli config:list`

List configuration profiles

```
USAGE
  $ lf-cli config:list

OPTIONS
  -h, --help             show CLI help
  -p, --profile=profile  the name of the configuration profile
```

_See code: [src/commands/config/list.ts](https://github.com/ListenFirstMedia/lf-cli/blob/v0.0.0/src/commands/config/list.ts)_

## `lf-cli config:show`

Show the configuration profile

```
USAGE
  $ lf-cli config:show

OPTIONS
  -h, --help             show CLI help
  -p, --profile=profile  the name of the configuration profile
```

_See code: [src/commands/config/show.ts](https://github.com/ListenFirstMedia/lf-cli/blob/v0.0.0/src/commands/config/show.ts)_

## `lf-cli config:verify`

Verify the profile

```
USAGE
  $ lf-cli config:verify

OPTIONS
  -h, --help             show CLI help
  -p, --profile=profile  the name of the configuration profile
```

_See code: [src/commands/config/verify.ts](https://github.com/ListenFirstMedia/lf-cli/blob/v0.0.0/src/commands/config/verify.ts)_

## `lf-cli datasets:field-values FIELD`

Retrieve all distinct values for a given Field

```
USAGE
  $ lf-cli datasets:field-values FIELD

ARGUMENTS
  FIELD  the ID of the Field to retrieve

OPTIONS
  -h, --help              show CLI help
  -p, --profile=profile   the name of the configuration profile
  --columns=columns       only show provided columns (comma-separated)
  --csv                   output is csv format [alias: --output=csv]
  --filter=filter         filter property by partial string matching, ex: name=foo
  --format=raw|table|doc  [default: raw] output format of the results
  --no-header             hide table header from output
  --no-truncate           do not truncate output to fit screen
  --pretty                pretty print json responses (applies to raw or doc formats)
  --sort=sort             property to sort by (prepend '-' for descending)
```

_See code: [src/commands/datasets/field-values.ts](https://github.com/ListenFirstMedia/lf-cli/blob/v0.0.0/src/commands/datasets/field-values.ts)_

## `lf-cli datasets:get ID`

Show a single dataset

```
USAGE
  $ lf-cli datasets:get ID

ARGUMENTS
  ID  the Dataset ID to retrieve

OPTIONS
  -h, --help              show CLI help
  -p, --profile=profile   the name of the configuration profile
  --columns=columns       only show provided columns (comma-separated)
  --csv                   output is csv format [alias: --output=csv]
  --[no-]fields           list fields in output
  --filter=filter         filter property by partial string matching, ex: name=foo
  --format=raw|table|doc  [default: raw] output format of the results
  --no-header             hide table header from output
  --no-truncate           do not truncate output to fit screen
  --pretty                pretty print json responses (applies to raw or doc formats)
  --sort=sort             property to sort by (prepend '-' for descending)

DESCRIPTION
  Retrieve a single Dataset by its unique identifier. All the 
  dataset's attributes and fields will be returned.
```

_See code: [src/commands/datasets/get.ts](https://github.com/ListenFirstMedia/lf-cli/blob/v0.0.0/src/commands/datasets/get.ts)_

## `lf-cli datasets:list`

List Datasets

```
USAGE
  $ lf-cli datasets:list

OPTIONS
  -h, --help              show CLI help
  -p, --profile=profile   the name of the configuration profile
  --columns=columns       only show provided columns (comma-separated)
  --csv                   output is csv format [alias: --output=csv]
  --filter=filter         filter property by partial string matching, ex: name=foo
  --format=raw|table|doc  [default: raw] output format of the results
  --no-header             hide table header from output
  --no-truncate           do not truncate output to fit screen
  --pretty                pretty print json responses (applies to raw or doc formats)
  --sort=sort             property to sort by (prepend '-' for descending)

DESCRIPTION
  Retrieves all Datasets available. See the Data Dictionary 
  for available Datasets. A subset of the dataset attributes 
  will be returned in the response.

ALIASES
  $ lf-cli datasets:list
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
