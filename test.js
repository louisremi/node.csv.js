var assert = require('assert');
var CSV = require('./csv');

// Single string parsing
assert.deepEqual(CSV.parse(''), []);
assert.deepEqual(CSV.parse('a'), [['a']]);
assert.deepEqual(CSV.parse('abc'), [['abc']]);
//assert.deepEqual(CSV.parse('"'), [['"']]);
assert.deepEqual(CSV.parse(','), [['','']]);
assert.deepEqual(CSV.parse('a,b'), [['a','b']]);
assert.deepEqual(CSV.parse('\n'), []);
assert.deepEqual(CSV.parse('a\nb'), [['a'],['b']]);
assert.deepEqual(CSV.parse('\r\n'), []);
assert.deepEqual(CSV.parse('a\r\nb'), [['a'],['b']]);
assert.deepEqual(CSV.parse('abc,def'), [['abc','def']]);
assert.deepEqual(CSV.parse('abc\ndef'), [['abc'],['def']]);
assert.deepEqual(CSV.parse('abc\r\ndef'), [['abc'],['def']]);

// Quoted string parsing
assert.deepEqual(CSV.parse('""'), []);
assert.deepEqual(CSV.parse('"a"'), [['a']]);
assert.deepEqual(CSV.parse('"abc"'), [['abc']]);
assert.deepEqual(CSV.parse('","'), [[',']]);
assert.deepEqual(CSV.parse('"",""'), [['','']]);
assert.deepEqual(CSV.parse('"a,b"'), [['a,b']]);
assert.deepEqual(CSV.parse('"a","b"'), [['a','b']]);
assert.deepEqual(CSV.parse('"\n"'), [['\n']]);
assert.deepEqual(CSV.parse('""\n""'), []);
assert.deepEqual(CSV.parse('"a\nb"'), [['a\nb']]);
assert.deepEqual(CSV.parse('"a"\n"b"'), [['a'],['b']]);
assert.deepEqual(CSV.parse('"\r\n"'), [['\r\n']]);
assert.deepEqual(CSV.parse('""\r\n""'), []);
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

/*
assert.equal(typeof CSV.parse, "function", "CSV.parse is a function");
assert.equal(typeof CSV.stringify, "function", "CSV.stringify is a function");

assert.deepEqual(CSV.parse("a,really,simple,csv,string\nfor,a,really,simple,example"), [
  ['a', 'really', 'simple', 'csv', 'string'],
  ['for', 'a', 'really', 'simple', 'example']
], "Parses a simple csv");

assert.deepEqual(CSV.parse('a')[0][0], 'a', "Parses a csv containing a single caracter");
assert.deepEqual(CSV.parse('"ab"')[0][0], 'ab', "Remove both quotes wrapping an element");
assert.deepEqual(CSV.parse('""')[0][0], '', "Remove both quotes wrapping an element, with an empty element");
assert.deepEqual(CSV.parse('"a,b"')[0][0], 'a,b', "Don't break on delimiter inside an element");
assert.deepEqual(CSV.parse('"a\nb"')[0][0], 'a\nb', "Don't break on line break inside an element");
assert.deepEqual(CSV.parse('"a\n,\n,b"')[0][0], 'a\nb', "Don't break on mixed line break and delimiter inside an element");
assert.deepEqual(CSV.parse('"a,"')[0][0], 'a,', "Don't break on line break inside an element, with delimiter as last character");
assert.deepEqual(CSV.parse('"a\n"')[0][0], 'a\n', "Don't break on line break inside an element, with line break as last character");
assert.deepEqual(CSV.parse('"a,b,"",c"')[0][0], 'a,b,",c', "Don't break on double quotes");
assert.deepEqual(CSV.parse('"a,b,""",c')[0][0], 'a,b,"', "Break on tripple quotes");

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