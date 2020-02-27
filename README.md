dynamo-tools
============

CLI tools for dynamodb

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/dynamo-tools.svg)](https://npmjs.org/package/dynamo-tools)
[![Downloads/week](https://img.shields.io/npm/dw/dynamo-tools.svg)](https://npmjs.org/package/dynamo-tools)
[![License](https://img.shields.io/npm/l/dynamo-tools.svg)](https://github.com/theBenForce/dynamo-tools/blob/master/package.json)

<!-- toc -->
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
dynamo-tools/0.0.1 darwin-x64 node-v12.13.1
$ ddb --help [COMMAND]
USAGE
  $ ddb COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`ddb copy [FILE]`](#ddb-copy-file)
* [`ddb hello [FILE]`](#ddb-hello-file)
* [`ddb help [COMMAND]`](#ddb-help-command)

## `ddb copy [FILE]`

describe the command here

```
USAGE
  $ ddb copy [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print
```

_See code: [src/commands/copy.ts](https://github.com/theBenForce/dynamo-tools/blob/v0.0.1/src/commands/copy.ts)_

## `ddb hello [FILE]`

describe the command here

```
USAGE
  $ ddb hello [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print

EXAMPLE
  $ ddb hello
  hello world from ./src/hello.ts!
```

_See code: [src/commands/hello.ts](https://github.com/theBenForce/dynamo-tools/blob/v0.0.1/src/commands/hello.ts)_

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
