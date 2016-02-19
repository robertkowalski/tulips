'use strict'

const tulips = require('../')
const test = require('tap').test

const initialFile = `
[core]
  repositoryformatversion = 0
  filemode = true
  bare = false
  logallrefupdates = true
  ignorecase = true
  precomposeunicode = true

[remote "origin"]
    fetch = +refs/heads/*:refs/remotes/origin/*
    url = git@github.com:joyent/node.git

[remote "robert"]
  url = git@github.com:robertkowalski/git-apply-pr.git
  fetch = +refs/heads/*:refs/remotes/robert/*
`

const expected = `[core]
repositoryformatversion = 0
filemode = true
bare = false
logallrefupdates = true
ignorecase = true
precomposeunicode = true

[remote "origin"]
fetch = +refs/heads/*:refs/remotes/origin/*
url = git@github.com:joyent/node.git
fetch = +refs/pull/*/head:refs/remotes/origin/pr/*

[remote "robert"]
url = git@github.com:robertkowalski/git-apply-pr.git
fetch = +refs/heads/*:refs/remotes/robert/*
`

test('gitfile integration test', function (t) {
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

  const res = tulips.stringify(changed, {whitespace: true})

  t.equal(res, expected)
  t.end()
})
