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
 * - header: true to use the first line of the file as the haeder, or an array of words used to manipulate the data.
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
 * 
 */

// Create a CSV object only if one does not already exist.
if (!this.CSV) {
    CSV = {};
}

if(typeof CSV.parse !== "function") {
  CSV.parse = function(input, options) {
    options = options || {};
    
    var output = [], 
      header = options.header,
      delimiter = options.delimiter || ',',
      matches, lastMatches,
      headerIsArray = header instanceof Array,
      currLine = (headerIsArray? {} : []), currCol = 0, currEl,
      // It is always slower to compile a new regex, use pre-built ones as much as possible (they will be cached)
      re = delimiter == ','? /(,|\r?\n|^)([^",\r\n]+|"((?:[^"]|"")*)")?/g :
        (delimiter == ';'? /(;|\r?\n|^)([^";\r\n]+|"((?:[^"]|"")*)")?/g : 
        (delimiter == '\t'? /(\t|\r?\n|^)([^"\t\r\n]+|"((?:[^"]|"")*)")?/g :
        new RegExp('('+delimiter+'|\\r?\\n|^)([^"'+delimiter+'\\r\\n]+|"((?:[^"]|"")*)")?', "g")));
    while(matches = re.exec( input )) {
      if(matches[1] != delimiter && matches[1] != '') {
        if(header === true) {
          header = currLine;
          headerIsArray = true;
        } else {
          output.push(currLine);
        }
        currLine = headerIsArray? {} : [];
        currCol = 0;
      }
      lastMatches = matches;
      currEl = typeof matches[3] === 'string'? matches[3].split('""').join('"') : matches[2];
      headerIsArray?
        currLine[header[currCol++]] = currEl :
        currLine.push(currEl);
    }
    // push last line only if not empty
    if(lastMatches[2] || currLine.length > 1 || currLine[0]) {
      output.push(currLine); 
    }
    return output;
  };
}

if(typeof CSV.stringify !== "function") {
  CSV.stringify = function(input, options) {
     var data, head, 
       delimiter = options? options.delimiter || "," : ",",
       dataInArrays,
       length, i = -1, row,
       l, j = -1,
       output = "";
     if(input) {
       data = input.data || input;
       head = input.head;
     } else {
       data = head = false;
     }
     
     dataInArrays = data[0] instanceof Array
     
     if(!head && !dataInArrays) {
       throw new Error("Header required for unordered rows");
     } else if(head) {
       l = head.length;
       while(++j < l) {
         output += JSON.stringify(head[j])+delimiter;
       }
       output += '\r\n';
     }
     
     length = data.length;
     while(++i < length) {
       row = data[i];       
       j = -1;
       if(dataInArrays) {
         l = row.length;
       }
       while(++j < l) {
         output += JSON.stringify(row[dataInArrays? j : head[j]])+delimiter;
       }
       output += '\r\n';
     }
     return output;
  };
}

if(typeof module != 'undefined' && typeof module.exports != 'undefined') {
  module.exports = CSV;
};