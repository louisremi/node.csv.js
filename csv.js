/*
 * A simple CSV API à la JSON.
 * node.csv.js has been originally designed for node but can 
 * be used client-side too, following json2.js's principles.
 * 
 * Example of usage:
 * 
 * csv = require('./csv');
 * 
 * var csvArray = csv.parse("a,really,simple,csv,string\nfor,a,really,simple,example");
 * var csvString = csv.stringify(csvArray);
 * 
 * Options:
 * Both methods can take options as a second argument. 
 * This argument must be a hash with the following possible keys:
 * - delimiter: The character used to delimit the string elements
 * - header: An array of words used to manipulate the data
 * 
 * Example of advanced usage:
 * 
 * var csvArray = csv.parse("a,really,simple,csv,string\nfor,a,really,simple,example", {header: ['first', 'second', 'third', 'fourth', 'last']});
 * assert.deepEqual(csvArray[0], {
 *   first: "a",
 *   second: "really",
 *   third: "simple",
 *   fourth: "csv",
 *   last: "string"
 * });
 * 
 * var csvString = csv.stringify(csvArray, {header: ['last', 'fourth', 'third', 'second', 'first']});
 * assert.equal(csvString, "string,csv,simple,really,a\nexample,simple,really,a,for");
 */

sys = require('sys');

// Create a CSV object only if one does not already exist.
if (!this.CSV) {
    CSV = {};
}

if(typeof CSV.parse !== "function") {
  CSV.parse = function(input, options) {
    options = options || {};
    
    var output = [],
      undefined,
      currLine,
      currRow,
      currEl,
      delimiter = options.delimiter || ',',
      header = options.header,
      lineBreak = input.indexOf('\n'),
      // Choose wether to split Windows style or Unix style (and pray for it to be consistent)
      breakStr = (lineBreak < 1 || input[lineBreak -1] != '\r')? '\n' : '\r\n';
    
    input.split(breakStr).forEach(function(line) {
      // Cache currLine
      var _currLine = currLine;
      
      // add the current line to the output if not in the middle of an element
      if(!currEl) {
        // Get rid of empty lines
        if(_currLine && (_currLine.length > 1 || currLine[0] != '')) {
          output.push(currLine);
        }
        currLine = header? {} : [];
        currRow = 0;
      }
      
      line.split(delimiter).forEach(function(el, i) {
        // Cache currEl
        var _currEl = currEl,
          quoted, length, trailingQuote = 0;
        
        // restore the delimiter or line break if it was inside an element (_currEl == true) 
        _currEl = _currEl? _currEl + (i? delimiter : "\n" ) + el : el;
        // Does the string ends the current element?
        quoted = _currEl[0] == '"';
        length = _currEl.length;
        if(!quoted || (_currEl[length -1] == '"' && length > 1)) {
          if(quoted) {
            _currEl = _currEl.slice(1,-1);
            length -= 2;
            // We still need to make sure that _currEl doesn't end with an odd number of quotes (since "a"""" is an incomplete string)
            while(_currEl[--length] == '"') {
              trailingQuote++;
            }
            trailingQuote %2?
              quoted = false :
              // Restore the quotes
              currEl = '"' + _currEl + '"';
          }
          // _currEl is a complete element
          if(!quoted) {
            // undouble quotes
            _currEl = _currEl.split('""').join('"');
            currLine instanceof Array?
              currLine.push(_currEl) :
              currLine[header[currRow++]] = _currEl;
             
            currEl = undefined;
          }
        } else {
          currEl = _currEl;
        }
      });
    });
    // Push the last line and return
    return output.push(currLine);
  };
}
 
if(typeof CSV.stringify !== "function") {
  CSV.stringify = function(data, options) {
     return
  };
}

if(module && module.exports) {
  module.exports = CSV;
};

//(?:,|\r?\n|^)([^",\r\n]+|"(?:[^"]|"")*")?/
// if(l && el[l - 1] == '"' && (l==1 || el[l - 2] != '"' || (l)))
// && (length == 2 || (_currEl[length -2] != '"' || _currEl[length -3] == '"')))) {

/*
 * if(el = /^(?:([^"]+)|"((?:[^"]|"")*)")?$/.exec(_currEl)) {
           _currEl = el[1] || el[2] || el[0];
           
           currLine instanceof Array?
             currLine.push(_currEl) :
             currLine[header[currRow++]] = _currEl;
             
           currEl = undefined;
        } else {
          
        }
 */