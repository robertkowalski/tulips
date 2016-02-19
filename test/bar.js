'use strict'

const tulips = require('../')
const test = require('tap').test

const data = {
  'number': [{count: 10}],
  'string': [{drink: 'white russian'}],
  'boolean': [{isTrue: true}],
  'nested boolean': [{theDude: [{abides: true}, {rugCount: 1}]}]
}

test('parse(stringify(x)) deepEqual x', function (t) {
  for (let k in data) {
    const s = tulips.stringify(data[k])
    t.deepEqual(tulips.parse(s), data[k])
  }

  t.end()
})
