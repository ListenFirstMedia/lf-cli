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
* [`lf-cli brand-view-sets:get ID`](#lf-cli-brand-view-setsget-id)
* [`lf-cli brand-view-sets:list`](#lf-cli-brand-view-setslist)
* [`lf-cli brand-views:by-brand-set-name BRAND_SET_NAME`](#lf-cli-brand-viewsby-brand-set-name-brand_set_name)
* [`lf-cli brand-views:generate`](#lf-cli-brand-viewsgenerate)
* [`lf-cli brand-views:get ID`](#lf-cli-brand-viewsget-id)
* [`lf-cli brand-views:list [PARAMS_FILE]`](#lf-cli-brand-viewslist-params_file)
* [`lf-cli brand-views:my-brands`](#lf-cli-brand-viewsmy-brands)
* [`lf-cli brand_view_sets:get ID`](#lf-cli-brand_view_setsget-id)
* [`lf-cli config:create`](#lf-cli-configcreate)
* [`lf-cli config:edit`](#lf-cli-configedit)
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
  -A, --account-id=account-id  swith accounts (overrides profile setting)
  -h, --help                   show CLI help
  -p, --profile=profile        the name of the configuration profile
  --columns=columns            only show provided columns (comma-separated)
  --csv                        output is csv format [alias: --output=csv]
  --format=raw|table|doc       [default: raw] output format of the results
  --max-page=max-page          [default: 1] the max page number to fetch (-1 for all pages)
  --no-header                  hide table header from output
  --no-truncate                do not truncate output to fit screen
  --page=page                  [default: 1] starting page number
  --per-page=per-page          number of results per page
  --pretty                     pretty print json responses (applies to raw or doc formats)
  --silent                     hide spinners and other log output

DESCRIPTION
  Submit a multi-dimensional, aggregate, time series analytical query. 
  Start and End time parameters are used to specify the time window of 
  the query. The Dataset ID determines the scope of dimensions and 
  metrics available in the query for selection, filtering, grouping, 
  and sorting. Consult the Data Dictionary for available Datasets, 
  Fields and their capabilities.

EXAMPLES
  $ lf-cli analytics:fetch my-request.json
  $ cat my-request.json | lf-cli analytics:fetch
  $ lf-cli analytics:fetch --pretty my-request.json
  $ cat my-request.json | lf-cli analytics:fetch --max-page -1 --format doc --silent
  $ lf-cli analytics:fetch --max-page 2 --per-page 5 --format table my-request.json 
  $ lf-cli analytics:fetch --per-page 1000 --max-page -1 --format table --csv my-request.json >| my-response.csv
  $ lf-cli analytics:fetch --per-page 1000 --max-page -1 --format doc my-request.json >| my-response-docs.json
  $ lf-cli analytics:fetch --per-page 1000 --max-page -1 --format doc my-request.json >| my-response-docs.json
  $ lf-cli analytics:fetch --format table --csv --no-header my-request.json >| my-response-data.csv
```

_See code: [src/commands/analytics/fetch.ts](https://github.com/ListenFirstMedia/lf-cli/blob/v0.0.0/src/commands/analytics/fetch.ts)_

## `lf-cli analytics:generate`

Generate a query template

```
USAGE
  $ lf-cli analytics:generate

OPTIONS
  -A, --account-id=account-id  swith accounts (overrides profile setting)
  -h, --help                   show CLI help
  -p, --profile=profile        the name of the configuration profile
  --silent                     hide spinners and other log output

EXAMPLES
  $ lf-cli analytics:generate
  $ lf-cli analytics:generate > analytics-requets.json
```

_See code: [src/commands/analytics/generate.ts](https://github.com/ListenFirstMedia/lf-cli/blob/v0.0.0/src/commands/analytics/generate.ts)_

## `lf-cli auth:me`

Show currently authenticated user.

```
USAGE
  $ lf-cli auth:me

OPTIONS
  -A, --account-id=account-id  swith accounts (overrides profile setting)
  -h, --help                   show CLI help
  -p, --profile=profile        the name of the configuration profile
  --columns=columns            only show provided columns (comma-separated)
  --csv                        output is csv format [alias: --output=csv]
  --format=raw|table|doc       [default: raw] output format of the results
  --no-header                  hide table header from output
  --no-truncate                do not truncate output to fit screen
  --pretty                     pretty print json responses (applies to raw or doc formats)
  --silent                     hide spinners and other log output

DESCRIPTION
  Retrieve metadata for the currently authenticated ListenFirst
  platform user and associated, active ListenFirst Account

EXAMPLES
  $ lf-cli auth:me
  $ lf-cli auth:me --pretty
  $ lf-cli auth:me --pretty --format doc
  $ lf-cli auth:me --pretty --account-id <ACCOUNT_ID>
```

_See code: [src/commands/auth/me.ts](https://github.com/ListenFirstMedia/lf-cli/blob/v0.0.0/src/commands/auth/me.ts)_

## `lf-cli auth:token`

Obtain an access token

```
USAGE
  $ lf-cli auth:token

OPTIONS
  -A, --account-id=account-id  swith accounts (overrides profile setting)
  -h, --help                   show CLI help
  -p, --profile=profile        the name of the configuration profile
  --silent                     hide spinners and other log output

DESCRIPTION
  This command provides the ability to obtain an access
  token via the OAuth 2.0 client credentials workflow.  
  The process authenticates using the Client ID and 
  Client Secret found in the lf-cli configuration profile.
  The access token will be written to stdout.

EXAMPLES
  $ lf-cli auth:token
  $ lf-cli auth:token >| access-token.json
```

_See code: [src/commands/auth/token.ts](https://github.com/ListenFirstMedia/lf-cli/blob/v0.0.0/src/commands/auth/token.ts)_

## `lf-cli brand-view-sets:get ID`

Get a Brand View Aet

```
USAGE
  $ lf-cli brand-view-sets:get ID

ARGUMENTS
  ID  the ID of the Brand View Set to retrieve

OPTIONS
  -A, --account-id=account-id  swith accounts (overrides profile setting)
  -h, --help                   show CLI help
  -p, --profile=profile        the name of the configuration profile
  --columns=columns            only show provided columns (comma-separated)
  --csv                        output is csv format [alias: --output=csv]
  --format=raw|table|doc       [default: raw] output format of the results
  --no-header                  hide table header from output
  --no-truncate                do not truncate output to fit screen
  --pretty                     pretty print json responses (applies to raw or doc formats)
  --silent                     hide spinners and other log output

DESCRIPTION
  Retrieve a Brand View Set by id.

EXAMPLES
  $ lf-cli brand-view-sets:get 4626
  $ lf-cli brand-view-sets:get 4626 --pretty
```

_See code: [src/commands/brand-view-sets/get.ts](https://github.com/ListenFirstMedia/lf-cli/blob/v0.0.0/src/commands/brand-view-sets/get.ts)_

## `lf-cli brand-view-sets:list`

List Brand View Sets

```
USAGE
  $ lf-cli brand-view-sets:list

OPTIONS
  -A, --account-id=account-id  swith accounts (overrides profile setting)
  -h, --help                   show CLI help
  -p, --profile=profile        the name of the configuration profile
  --columns=columns            only show provided columns (comma-separated)
  --csv                        output is csv format [alias: --output=csv]
  --format=raw|table|doc       [default: raw] output format of the results
  --max-page=max-page          [default: 1] the max page number to fetch (-1 for all pages)
  --no-header                  hide table header from output
  --no-truncate                do not truncate output to fit screen
  --page=page                  [default: 1] starting page number
  --per-page=per-page          number of results per page
  --pretty                     pretty print json responses (applies to raw or doc formats)
  --silent                     hide spinners and other log output

DESCRIPTION
  Retrieve the list of a Brand View Sets available to the ListenFirst 
  Account associated with the access token.

EXAMPLES
  $ lf-cli brand-view-sets:list --per-page 1000 --pretty
  $ lf-cli brand-view-sets:list --format table --max-page -1 --silent
  $ lf-cli brand-view-sets:list --max-page -1 --silent --format table --csv > all-brand-sets.csv
  $ lf-cli brand-view-sets:list --max-page -1 --format doc > all-brand-sets.jsonl
```

_See code: [src/commands/brand-view-sets/list.ts](https://github.com/ListenFirstMedia/lf-cli/blob/v0.0.0/src/commands/brand-view-sets/list.ts)_

## `lf-cli brand-views:by-brand-set-name BRAND_SET_NAME`

List Brands from the specified Brand View Set

```
USAGE
  $ lf-cli brand-views:by-brand-set-name BRAND_SET_NAME

ARGUMENTS
  BRAND_SET_NAME  a brand set to fetch

OPTIONS
  -A, --account-id=account-id  swith accounts (overrides profile setting)
  -h, --help                   show CLI help
  -p, --profile=profile        the name of the configuration profile
  --columns=columns            only show provided columns (comma-separated)
  --csv                        output is csv format [alias: --output=csv]
  --fields=fields              Comma seperated list of fields to include
  --format=raw|table|doc       [default: raw] output format of the results
  --max-page=max-page          [default: 1] the max page number to fetch (-1 for all pages)
  --no-header                  hide table header from output
  --no-truncate                do not truncate output to fit screen
  --page=page                  [default: 1] starting page number
  --per-page=per-page          number of results per page
  --pretty                     pretty print json responses (applies to raw or doc formats)
  --silent                     hide spinners and other log output

DESCRIPTION
  Convenience command to fetch the Brand Views associated with the specified (by name)
  Brand View Set

EXAMPLES
  $ lf-cli brand-views:by-brand-set-name --pretty --fields lfm.brand.primary_genre My Brands
  $ lf-cli brand-views:by-brand-set-name --max-page -1 --format table LF // TV Universe
  $ lf-cli brand-views:by-brand-set-name --max-page -1 --format table LF // TV Universe
```

_See code: [src/commands/brand-views/by-brand-set-name.ts](https://github.com/ListenFirstMedia/lf-cli/blob/v0.0.0/src/commands/brand-views/by-brand-set-name.ts)_

## `lf-cli brand-views:generate`

Generate a list parameters object example

```
USAGE
  $ lf-cli brand-views:generate

OPTIONS
  -A, --account-id=account-id  swith accounts (overrides profile setting)
  -h, --help                   show CLI help
  -p, --profile=profile        the name of the configuration profile
  --silent                     hide spinners and other log output

DESCRIPTION
  The /brand_views endpoint allows filters, fields, and sort options
  passed in as parameters.  The endpoint can be a little tricky as
  parameter values are complex objects that need to be serialized
  as a JSON string.   The cli's brand_views:list command provides
  a convenience option to pass in the options as a JSON document.  
  The command will prepare the request query for you making it
  easier to use for complex queries.   This command produces
  a complex example that can be used as a template.

EXAMPLES
  $ lf-cli brand-views:generate
  $ lf-cli brand-views:generate >| my-params.json
```

_See code: [src/commands/brand-views/generate.ts](https://github.com/ListenFirstMedia/lf-cli/blob/v0.0.0/src/commands/brand-views/generate.ts)_

## `lf-cli brand-views:get ID`

Get a Brand View

```
USAGE
  $ lf-cli brand-views:get ID

ARGUMENTS
  ID  the ID of the Brand View to retrieve

OPTIONS
  -A, --account-id=account-id  swith accounts (overrides profile setting)
  -h, --help                   show CLI help
  -p, --profile=profile        the name of the configuration profile
  --columns=columns            only show provided columns (comma-separated)
  --csv                        output is csv format [alias: --output=csv]
  --fields=fields              Comma seperated list of fields to include
  --format=raw|table|doc       [default: raw] output format of the results
  --no-header                  hide table header from output
  --no-truncate                do not truncate output to fit screen
  --pretty                     pretty print json responses (applies to raw or doc formats)
  --silent                     hide spinners and other log output

DESCRIPTION
  Retrieve a Brand View by id.

EXAMPLES
  $ lf-cli brand-views:get 31711
  $ lf-cli brand-views:get 31711 --pretty
  $ lf-cli brand-views:get 31711 --format table --fields lfm.brand.primary_genre,lfm.brand.programmers
  $ lf-cli brand-views:get --format doc --fields lfm.brand.primary_genre --pretty 31711
```

_See code: [src/commands/brand-views/get.ts](https://github.com/ListenFirstMedia/lf-cli/blob/v0.0.0/src/commands/brand-views/get.ts)_

## `lf-cli brand-views:list [PARAMS_FILE]`

List Brand Views

```
USAGE
  $ lf-cli brand-views:list [PARAMS_FILE]

ARGUMENTS
  PARAMS_FILE  [default: -] a file containing optional filter, field, and sort parameters

OPTIONS
  -A, --account-id=account-id  swith accounts (overrides profile setting)
  -h, --help                   show CLI help
  -p, --profile=profile        the name of the configuration profile
  --columns=columns            only show provided columns (comma-separated)
  --csv                        output is csv format [alias: --output=csv]
  --fields=fields              Comma seperated list of fields to include
  --format=raw|table|doc       [default: raw] output format of the results
  --max-page=max-page          [default: 1] the max page number to fetch (-1 for all pages)
  --no-header                  hide table header from output
  --no-truncate                do not truncate output to fit screen
  --page=page                  [default: 1] starting page number
  --per-page=per-page          number of results per page
  --pretty                     pretty print json responses (applies to raw or doc formats)
  --silent                     hide spinners and other log output

DESCRIPTION
  Returns an array of all Brand Views available to the ListenFirst 
  Account associated with the access token. Results may be filtered 
  and sorted by Brand Metadata Dimensions.

EXAMPLES
  $ lf-cli brand-views:list --pretty my-params.json
  $ lf-cli brand-views:generate | lf-cli brand-views:list --format table --max-page -1 --per-page 1000
  $ cat my-params.json | lf-cli brand-views:list --format table --max-page -1 --no-header --csv
  $ cat my-params.json | lf-cli brand-views:list --format doc --max-page -1 --per-page 1000 > results.jsonl
  $ lf-cli brand-views:list --pretty --fields lfm.brand.primary_genre,lfm.brand.programmers my-other-params.json
```

_See code: [src/commands/brand-views/list.ts](https://github.com/ListenFirstMedia/lf-cli/blob/v0.0.0/src/commands/brand-views/list.ts)_

## `lf-cli brand-views:my-brands`

List My Brands

```
USAGE
  $ lf-cli brand-views:my-brands

OPTIONS
  -A, --account-id=account-id  swith accounts (overrides profile setting)
  -h, --help                   show CLI help
  -p, --profile=profile        the name of the configuration profile
  --columns=columns            only show provided columns (comma-separated)
  --csv                        output is csv format [alias: --output=csv]
  --fields=fields              Comma seperated list of fields to include
  --format=raw|table|doc       [default: raw] output format of the results
  --max-page=max-page          [default: 1] the max page number to fetch (-1 for all pages)
  --no-header                  hide table header from output
  --no-truncate                do not truncate output to fit screen
  --page=page                  [default: 1] starting page number
  --per-page=per-page          number of results per page
  --pretty                     pretty print json responses (applies to raw or doc formats)
  --silent                     hide spinners and other log output

DESCRIPTION
  Convenience command to fetch the Brand Views associated with the "My Brands"
  Brand View Set

EXAMPLES
  $ lf-cli brand-views:my-brands --pretty --fields lfm.brand.primary_genre
  $ lf-cli brand-views:my-brands --max-page -1 --format table
```

_See code: [src/commands/brand-views/my-brands.ts](https://github.com/ListenFirstMedia/lf-cli/blob/v0.0.0/src/commands/brand-views/my-brands.ts)_

## `lf-cli brand_view_sets:get ID`

Get a Brand View Aet

```
USAGE
  $ lf-cli brand_view_sets:get ID

ARGUMENTS
  ID  the ID of the Brand View Set to retrieve

OPTIONS
  -A, --account-id=account-id  swith accounts (overrides profile setting)
  -h, --help                   show CLI help
  -p, --profile=profile        the name of the configuration profile
  --columns=columns            only show provided columns (comma-separated)
  --csv                        output is csv format [alias: --output=csv]
  --fields=fields              Comma seperated list of fields to include
  --format=raw|table|doc       [default: raw] output format of the results
  --no-header                  hide table header from output
  --no-truncate                do not truncate output to fit screen
  --pretty                     pretty print json responses (applies to raw or doc formats)
  --silent                     hide spinners and other log output

DESCRIPTION
  Retrieve a Brand View Set by id.
```

_See code: [src/commands/brand_view_sets/get.ts](https://github.com/ListenFirstMedia/lf-cli/blob/v0.0.0/src/commands/brand_view_sets/get.ts)_

## `lf-cli config:create`

Create or update a configuration profile

```
USAGE
  $ lf-cli config:create

OPTIONS
  -A, --account-id=account-id  swith accounts (overrides profile setting)
  -h, --help                   show CLI help
  -p, --profile=profile        the name of the configuration profile
  --silent                     hide spinners and other log output

EXAMPLE
  $ lf-cli config:create
```

_See code: [src/commands/config/create.ts](https://github.com/ListenFirstMedia/lf-cli/blob/v0.0.0/src/commands/config/create.ts)_

## `lf-cli config:edit`

Open the configuration profiles with system editor

```
USAGE
  $ lf-cli config:edit

OPTIONS
  -A, --account-id=account-id  swith accounts (overrides profile setting)
  -h, --help                   show CLI help
  -p, --profile=profile        the name of the configuration profile
  --silent                     hide spinners and other log output

EXAMPLES
  $ lf-cli config:edit
  $ EDITOR=emacs lf-cli config:edit
```

_See code: [src/commands/config/edit.ts](https://github.com/ListenFirstMedia/lf-cli/blob/v0.0.0/src/commands/config/edit.ts)_

## `lf-cli config:list`

List configuration profiles

```
USAGE
  $ lf-cli config:list

OPTIONS
  -A, --account-id=account-id  swith accounts (overrides profile setting)
  -h, --help                   show CLI help
  -p, --profile=profile        the name of the configuration profile
  --silent                     hide spinners and other log output

EXAMPLE
  $ lf-cli config:list
```

_See code: [src/commands/config/list.ts](https://github.com/ListenFirstMedia/lf-cli/blob/v0.0.0/src/commands/config/list.ts)_

## `lf-cli config:show`

Show the configuration profile

```
USAGE
  $ lf-cli config:show

OPTIONS
  -A, --account-id=account-id  swith accounts (overrides profile setting)
  -h, --help                   show CLI help
  -p, --profile=profile        the name of the configuration profile
  --silent                     hide spinners and other log output

EXAMPLES
  $ lf-cli config:show
  $ lf-cli config:show -p my-other-profile
```

_See code: [src/commands/config/show.ts](https://github.com/ListenFirstMedia/lf-cli/blob/v0.0.0/src/commands/config/show.ts)_

## `lf-cli config:verify`

Verify the profile

```
USAGE
  $ lf-cli config:verify

OPTIONS
  -A, --account-id=account-id  swith accounts (overrides profile setting)
  -h, --help                   show CLI help
  -p, --profile=profile        the name of the configuration profile
  --silent                     hide spinners and other log output

EXAMPLES
  $ lf-cli config:verify
  $ lf-cli config:verify -p my-other-profile
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
  -A, --account-id=account-id  swith accounts (overrides profile setting)
  -h, --help                   show CLI help
  -p, --profile=profile        the name of the configuration profile
  --columns=columns            only show provided columns (comma-separated)
  --csv                        output is csv format [alias: --output=csv]
  --format=raw|table|doc       [default: raw] output format of the results
  --no-header                  hide table header from output
  --no-truncate                do not truncate output to fit screen
  --pretty                     pretty print json responses (applies to raw or doc formats)
  --silent                     hide spinners and other log output

EXAMPLES
  $ lf-cli datasets:field-values lfm.brand.genres
  $ lf-cli datasets:field-values --pretty lfm.brand.genres
  $ lf-cli datasets:field-values --format table --no-header lfm.brand.genres
  $ lf-cli datasets:field-values --format table --no-header --silent lfm.brand.genres | sort
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
  -A, --account-id=account-id  swith accounts (overrides profile setting)
  -h, --help                   show CLI help
  -p, --profile=profile        the name of the configuration profile
  --columns=columns            only show provided columns (comma-separated)
  --csv                        output is csv format [alias: --output=csv]
  --format=raw|table|doc       [default: raw] output format of the results
  --no-header                  hide table header from output
  --no-truncate                do not truncate output to fit screen
  --pretty                     pretty print json responses (applies to raw or doc formats)
  --[no-]show-fields           list fields in output
  --silent                     hide spinners and other log output

DESCRIPTION
  Retrieve a single Dataset by its unique identifier. All the 
  dataset's attributes and fields will be returned.

EXAMPLES
  $ lf-cli datasets:get dataset_brand_metadata --pretty
  $ lf-cli datasets:get dataset_content_instagram --format table
  $ lf-cli datasets:get dataset_content_metadata --pretty --no-show-fields
  $ lf-cli datasets:get dataset_brand_facebook --format table --show-fields
```

_See code: [src/commands/datasets/get.ts](https://github.com/ListenFirstMedia/lf-cli/blob/v0.0.0/src/commands/datasets/get.ts)_

## `lf-cli datasets:list`

List Datasets

```
USAGE
  $ lf-cli datasets:list

OPTIONS
  -A, --account-id=account-id  swith accounts (overrides profile setting)
  -h, --help                   show CLI help
  -p, --profile=profile        the name of the configuration profile
  --columns=columns            only show provided columns (comma-separated)
  --csv                        output is csv format [alias: --output=csv]
  --format=raw|table|doc       [default: raw] output format of the results
  --no-header                  hide table header from output
  --no-truncate                do not truncate output to fit screen
  --pretty                     pretty print json responses (applies to raw or doc formats)
  --silent                     hide spinners and other log output

DESCRIPTION
  Retrieves all Datasets available. See the Data Dictionary 
  for available Datasets. A subset of the dataset attributes 
  will be returned in the response.

ALIASES
  $ lf-cli datasets:list

EXAMPLES
  $ lf-cli datasets:list --pretty
  $ lf-cli datasets:list --format table
  $ lf-cli datasets:list --format table --csv > datasets.csv
  $ lf-cli datasets:list --format doc > datasets.jsonl
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
