# dynamo-tools

CLI tools for dynamodb

[![Build Status](https://travis-ci.org/theBenForce/dynamo-tools.svg?branch=master)](https://travis-ci.org/theBenForce/dynamo-tools)
[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/dynamo-tools.svg)](https://npmjs.org/package/dynamo-tools)
[![Downloads/week](https://img.shields.io/npm/dw/dynamo-tools.svg)](https://npmjs.org/package/dynamo-tools)
[![Maintainability](https://api.codeclimate.com/v1/badges/94c18ce4c845c77847bb/maintainability)](https://codeclimate.com/github/theBenForce/dynamo-tools/maintainability)
[![License](https://img.shields.io/npm/l/dynamo-tools.svg)](https://github.com/theBenForce/dynamo-tools/blob/master/package.json)

<!-- toc -->
* [dynamo-tools](#dynamo-tools)
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->

# Usage

<!-- usage -->
```sh-session
$ npm install -g dynamo-tools
$ ddb COMMAND
running command...
$ ddb (-v|--version|version)
dynamo-tools/0.0.0 darwin-x64 node-v12.13.1
$ ddb --help [COMMAND]
USAGE
  $ ddb COMMAND
...
```
<!-- usagestop -->

# Commands

<!-- commands -->
* [`ddb backup [FILE]`](#ddb-backup-file)
* [`ddb copy`](#ddb-copy)
* [`ddb help [COMMAND]`](#ddb-help-command)

## `ddb backup [FILE]`

Backup all entries in a dynamodb table to a file

```
USAGE
  $ ddb backup [FILE]

ARGUMENTS
  FILE  Path to write the backup to.

OPTIONS
  -h, --help             show CLI help
  --batchSize=batchSize  [default: 100] The number of items to copy at a time
  --region=region        (required) AWS region that the DynamoDB is hosted in
  --source=source        (required) Name of the DynamoDB to copy entries from
```

_See code: [src/commands/backup.ts](https://github.com/theBenForce/dynamo-tools/blob/v0.0.0/src/commands/backup.ts)_

## `ddb copy`

Copy the contents of one dynamodb table to another

```
USAGE
  $ ddb copy

OPTIONS
  -h, --help                             show CLI help
  --batchSize=batchSize                  [default: 25] The number of items to copy at a time
  --destination=destination              (required) Destination table name
  --destinationRegion=destinationRegion  Region of destination table
  --region=region                        Region for both source and destination tables
  --source=source                        (required) Source table name
  --sourceRegion=sourceRegion            Region of source table
```

_See code: [src/commands/copy.ts](https://github.com/theBenForce/dynamo-tools/blob/v0.0.0/src/commands/copy.ts)_

## `ddb help [COMMAND]`

display help for ddb

```
USAGE
  $ ddb help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.2.3/src/commands/help.ts)_
<!-- commandsstop -->
