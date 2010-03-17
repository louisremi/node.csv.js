var assert = require('assert');
var CSV = require('./../csv');

// Ambiguous CSV string, doesn't have to pass
//assert.deepEqual(CSV.parse(''), [null]);
//assert.deepEqual(CSV.parse('"'), [['"']]);

// String starts with empty element
/*assert.deepEqual(CSV.parse(','), [['','']]);
assert.deepEqual(CSV.parse(',,'), [['','','']]);
assert.deepEqual(CSV.parse('\n'), [['']]);
assert.deepEqual(CSV.parse('\nab'), [[''],['ab']]);
assert.deepEqual(CSV.parse('\r\n'), [['']]);*/

// Single string parsing
assert.deepEqual(CSV.parse('a'), [['a']]);
assert.deepEqual(CSV.parse('abc'), [['abc']]);
assert.deepEqual(CSV.parse('a,b'), [['a','b']]);
assert.deepEqual(CSV.parse('a\nb'), [['a'],['b']]);
assert.deepEqual(CSV.parse('a\r\nb'), [['a'],['b']]);
assert.deepEqual(CSV.parse('abc,def'), [['abc','def']]);
assert.deepEqual(CSV.parse('abc\ndef'), [['abc'],['def']]);
assert.deepEqual(CSV.parse('abc\r\ndef'), [['abc'],['def']]);

// Quoted string parsing
assert.deepEqual(CSV.parse('""'), [['']]);
assert.deepEqual(CSV.parse('"a"'), [['a']]);
assert.deepEqual(CSV.parse('"abc"'), [['abc']]);
assert.deepEqual(CSV.parse('","'), [[',']]);
assert.deepEqual(CSV.parse('"",""'), [['','']]);
assert.deepEqual(CSV.parse('"a,b"'), [['a,b']]);
assert.deepEqual(CSV.parse('"a","b"'), [['a','b']]);
assert.deepEqual(CSV.parse('"\n"'), [['\n']]);
assert.deepEqual(CSV.parse('""\n""'), [[''], ['']]);
assert.deepEqual(CSV.parse('""\n""\n'), [[''], ['']]);
assert.deepEqual(CSV.parse('"a\nb"'), [['a\nb']]);
assert.deepEqual(CSV.parse('"a"\n"b"'), [['a'],['b']]);
assert.deepEqual(CSV.parse('"\r\n"'), [['\r\n']]);
assert.deepEqual(CSV.parse('""\r\n""'), [[''], ['']]);
assert.deepEqual(CSV.parse('"a\r\nb"'), [['a\r\nb']]);
assert.deepEqual(CSV.parse('"a"\r\n"b"'), [['a'],['b']]);
assert.deepEqual(CSV.parse('"abc,def"'), [['abc,def']]);
assert.deepEqual(CSV.parse('"abc","def"'), [['abc','def']]);
assert.deepEqual(CSV.parse('"abc\ndef"'), [['abc\ndef']]);
assert.deepEqual(CSV.parse('"abc"\n"def"'), [['abc'],['def']]);
assert.deepEqual(CSV.parse('"abc\r\ndef"'), [['abc\r\ndef']]);
assert.deepEqual(CSV.parse('"abc"\r\n"def"'), [['abc'],['def']]);

// Quotes inside quotes
assert.deepEqual(CSV.parse('""""'), [['"']]);
assert.deepEqual(CSV.parse('""""""'), [['""']]);
assert.deepEqual(CSV.parse('""","""'), [['","']]);
assert.deepEqual(CSV.parse('""","""""'), [['",""']]);
assert.deepEqual(CSV.parse('"""\n"""'), [['"\n"']]);
assert.deepEqual(CSV.parse('"""\n"""""'), [['"\n""']]);
assert.deepEqual(CSV.parse('"""",""""'), [['"','"']]);
assert.deepEqual(CSV.parse('""""\n""""'), [['"'],['"']]);
assert.deepEqual(CSV.parse('"a"""'), [['a"']]);
assert.deepEqual(CSV.parse('"a"""""'), [['a""']]);
assert.deepEqual(CSV.parse('"abc"""'), [['abc"']]);
assert.deepEqual(CSV.parse('"abc"""""'), [['abc""']]);
assert.deepEqual(CSV.parse('"a""b""c"'), [['a"b"c']]);
assert.deepEqual(CSV.parse('"a""","""b"'), [['a"', '"b']]);
assert.deepEqual(CSV.parse('"a"",""b"'), [['a","b']]);
assert.deepEqual(CSV.parse('"a""""","""b"'), [['a""', '"b']]);
assert.deepEqual(CSV.parse('"a"""\n"""b"'), [['a"'], ['"b']]);
assert.deepEqual(CSV.parse('"a""\n""b"'), [['a"\n"b']]);

assert.deepEqual(CSV.parse("a,really,simple,csv,string\nfor,a,really,simple,example"), [
  ['a','really','simple','csv','string'],
  ['for', 'a', 'really', 'simple', 'example']
]);

assert.deepEqual(CSV.parse("a,really,simple,csv,string\nfor,a,really,simple,example\n"), [
  ['a','really','simple','csv','string'],
  ['for', 'a', 'really', 'simple', 'example']
]);

var CSVArray = CSV.parse("a,really,simple,csv,string\nfor,a,really,simple,example", {header: ['first', 'second', 'third', 'fourth', 'last']});
assert.deepEqual(CSVArray[0], {
  first: "a",
  second: "really",
  third: "simple",
  fourth: "csv",
  last: "string"
});

/*
assert.deepEqual(CSV.stringify([
  ['a', 'really', 'simple', 'csv', 'string'],
  ['for', 'a', 'really', 'simple', 'example']
]), "a,really,simple,csv,string\nfor,a,really,simple,example");

var CSVArray = CSV.parse("a,really,simple,csv,string\nfor,a,really,simple,example", {header: ['first', 'second', 'third', 'fourth', 'last']});
assert.deepEqual(CSVArray[0], {
  first: "a",
  second: "really",
  third: "simple",
  fourth: "csv",
  last: "string"
});

var CSVString = CSV.stringify(CSVArray, {header: ['last', 'fourth', 'third', 'second', 'first']});
assert.equal(CSVString, "string,csv,simple,really,a\nexample,simple,really,a,for");*/