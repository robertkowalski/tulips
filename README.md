# tulips

An ini format parser and serializer for node which can handle
multiple keys. Based on [ini](https://github.com/npm/ini)
tulips has a data model based on tuples which can handle multiple keys.
tulips is needed for ini files with multiple keys that have the same,
e.g. to handle multiple fetch sources in a `.git/config` file.


## Usage

Consider an ini-file `.git/config` that looks like this:

```ini
[remote "origin"]
    fetch = +refs/heads/*:refs/remotes/origin/*
    url = git@github.com:joyent/node.git
```

You can read, manipulate and write the ini-file like so:

```js
const tulips = require('tulips')

const parsed = tulips.parse(initialFile)
const changed = parsed.map(el => {
  const section = Object.keys(el)[0]

  if (section !== 'remote "origin"') return el

  const hasPrRelatedRemote = el[section].some(
    el => el.fetch && el.fetch === '+refs/pull/*/head:refs/remotes/origin/pr/*'
  )

  if (hasPrRelatedRemote) return el

  el[section].push({fetch: '+refs/pull/*/head:refs/remotes/origin/pr/*'})

  return el
})

console.log(tulips.stringify(changed, {whitespace: true}))
```

This will print this modified content:

```ini
[remote "origin"]
fetch = +refs/heads/*:refs/remotes/origin/*
url = git@github.com:joyent/node.git
fetch = +refs/pull/*/head:refs/remotes/origin/pr/*
```

## Todo

 - Parsing of nested sections, e.g. `[section.database.user]`


## API

### decode(inistring)

Decode the ini-style formatted `inistring` into a nested object.

### parse(inistring)

Alias for `decode(inistring)`

### encode(object, [options])

Encode the object `object` into an ini-style formatted string. If the
optional parameter `section` is given, then all top-level properties
of the object are put into this section and the `section`-string is
prepended to all sub-sections, see the usage example above.

The `options` object may contain the following:

* `section` A string which will be the first `section` in the encoded
  ini data.  Defaults to none.
* `whitespace` Boolean to specify whether to put whitespace around the
  `=` character.  By default, whitespace is omitted, to be friendly to
  some persnickety old parsers that don't tolerate it well.  But some
  find that it's more human-readable and pretty with the whitespace.

For backwards compatibility reasons, if a `string` options is passed
in, then it is assumed to be the `section` value.

### stringify(object, [options])

Alias for `encode(object, [options])`

### safe(val)

Escapes the string `val` such that it is safe to be used as a key or
value in an ini-file. Basically escapes quotes. For example

    ini.safe('"unsafe string"')

would result in

    "\"unsafe string\""

### unsafe(val)

Unescapes the string `val`
