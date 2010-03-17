var assert = require('assert');
var CSV = require('./csv_alt');

assert.deepEqual(CSV.parseOld("a,really,simple,csv,string\nfor,a,really,simple,example"), [
  ['a','really','simple','csv','string'],
  ['for', 'a', 'really', 'simple', 'example']
]);

assert.deepEqual(CSV.parseOld("a,really,simple,csv,string\nfor,a,really,simple,example\n"), [
  ['a','really','simple','csv','string'],
  ['for', 'a', 'really', 'simple', 'example']
]);

assert.deepEqual(CSV.parseSimple("a,really,simple,csv,string\nfor,a,really,simple,example"), [
  ['a','really','simple','csv','string'],
  ['for', 'a', 'really', 'simple', 'example']
]);

assert.deepEqual(CSV.parseSimple("a,really,simple,csv,string\nfor,a,really,simple,example\n"), [
  ['a','really','simple','csv','string'],
  ['for', 'a', 'really', 'simple', 'example']
]);

assert.deepEqual(CSV.regex("a,really,simple,csv,string\nfor,a,really,simple,example"), [
  ['a','really','simple','csv','string'],
  ['for', 'a', 'really', 'simple', 'example']
]);

assert.deepEqual(CSV.regex("a,really,simple,csv,string\nfor,a,really,simple,example\n"), [
  ['a','really','simple','csv','string'],
  ['for', 'a', 'really', 'simple', 'example']
]);