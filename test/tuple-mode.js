// foo.ini contains two rockos, AND WITH TUPLES WE CAN HANDLE THEM
// ALL HAIL TO THE TUPLE GODS!
// rocko=artischocko
// rocko=unqueso

'use strict'

const tulips = require('../')
const tap = require('tap')
const test = tap.test
const fs = require('fs')
const path = require('path')
const fixture = path.resolve(__dirname, './fixtures/tuple.ini')
const data = fs.readFileSync(fixture, 'utf8')
const expectE = 'o=p\n' +
              'a with spaces=b  c\n' +
              '" xa  n          p "="\\"\\r\\nyoyoyo\\r\\r\\n"\n' +
              '"[disturbing]"=hey you never know\n' +
              's=something\n' +
              's1=\"something\'\n' +
              's2=something else\n' +
              'zr[]=deedee\n' +
              'ar[]=one\n' +
              'ar[]=three\n' +
              'ar[]=this is included\n' +
              'br=cold\n' +
              'br=warm\n' +
              'eq=\"eq=eq\"\n' +
              '\n' +
              '[a]\n' +
              'av=a val\n' +
              'e={ o: p, a: ' +
              '{ av: a val, b: { c: { e: "this [value]" ' +
              '} } } }\nj="\\"{ o: \\"p\\", a: { av:' +
              ' \\"a val\\", b: { c: { e: \\"this [value]' +
              '\\" } } } }\\""\n"[]"=a square?\n' +
              'cr[]=four\ncr[]=eight\n' +
              'nocomment=this\\; this is not a comment\n' +
              'noHashComment=this\\# this is not a comment\n' +
              'rocko=artischocko\n' +
              'rocko=unqueso\n'

const expectT = [
    {o: 'p'},
    {'a with spaces': 'b  c'},
    {' xa  n          p ': '"\r\nyoyoyo\r\r\n'},
    {'[disturbing]': 'hey you never know'},
    {'s': 'something'},
    {'s1': '\"something\''},
    {'s2': 'something else'},
    {'zr': ['deedee']},
    {'ar': ['one', 'three', 'this is included']},
    {'br': 'cold'},
    {'br': 'warm'},
    {'eq': 'eq=eq'},
    {'a': [
      {av: 'a val'},
      {'e': '{ o: p, a: { av: a val, b: { c: { e: "this [value]" } } } }'},
      {'j': '"{ o: "p", a: { av: "a val", b: { c: { e: "this [value]" } } } }"'},
      {'[]': 'a square?'},
      {'cr': ['four', 'eight']},
      {'nocomment': 'this\; this is not a comment'},
      {noHashComment: 'this\# this is not a comment'},
      {rocko: 'artischocko'},
      {rocko: 'unqueso'}
    ]}
  ]

const expectF = '[prefix.log]\n' +
              'type=file\n\n' +
              '[prefix.log.level]\n' +
              'label=debug\n' +
              'value=10\n'
const expectG = '[log]\n' +
              'type = file\n\n' +
              '[log.level]\n' +
              'label = debug\n' +
              'value = 10\n'

test('decode from file', t => {
  const d = tulips.offeringTable(data)
  t.deepEqual(d, expectT)
  t.end()
})

test('encode from data', t => {
  let e = tulips.encode(expectT)
  t.deepEqual(e, expectE)

  const obj = [
    {log: [
      {type: 'file'},
      {level: [
        {label: 'debug'},
        {value: 10}
      ]}
    ]}
  ]

  e = tulips.encode(obj)
  t.notEqual(e.slice(0, 1), '\n', 'Never a blank first line')
  t.notEqual(e.slice(-2), '\n\n', 'Never a blank final line')

  t.end()
})

test('encode with option', t => {
  const obj = [
    {log: [
      {type: 'file'},
      {level: [
        {label: 'debug'},
        {value: 10}
      ]}
    ]}
  ]

  const e = tulips.encode(obj, {section: 'prefix'})

  t.equal(e, expectF)
  t.end()
})

test('encode with whitespace', t => {
  const obj = [
    {log: [
      {type: 'file'},
      {level: [
        {label: 'debug'},
        {value: 10}
      ]}
    ]}
  ]
  const e = tulips.encode(obj, {whitespace: true})

  t.equal(e, expectG)
  t.end()
})
