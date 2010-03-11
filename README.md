node.csv.js
===========

A simple CSV API à la JSON.
node.csv.js has been originally designed for node but can 
be used client-side too, following json2.js's principles.
 
Example of usage:
-----------------

csv = require('./csv');

var csvArray = csv.parse("a,really,simple,csv,string\nfor,a,really,simple,example");
var csvString = csv.stringify(csvArray);

Options:
--------

Both methods can take options as a second argument. 
This argument must be a hash with the following possible keys:
- delimiter: The character used to delimit the string elements
- header: An array of words used to manipulate the data

Example of advanced usage:
--------------------------

var csvArray = csv.parse("a,really,simple,csv,string\nfor,a,really,simple,example", {header: ['first', 'second', 'third', 'fourth', 'last']});
assert.deepEqual(csvArray[0], {
  first: "a",
  second: "really",
  third: "simple",
  fourth: "csv",
  last: "string"
});

var csvString = csv.stringify(csvArray, {header: ['last', 'fourth', 'third', 'second', 'first']});
assert.equal(csvString, "string,csv,simple,really,a\nexample,simple,really,a,for");