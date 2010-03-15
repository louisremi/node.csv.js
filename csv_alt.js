// Create a CSV object only if one does not already exist.
if (!this.CSV) {
    CSV = {};
}

CSV.parseOld = function(input, options) {
  options = options || {};
  
  var output = [],
    undefined,
    currLine = null,
    currRow,
    currEl,
    delimiter = options.delimiter || ',',
    header = options.header,
    EOLi = input.indexOf('\n'),
    // Choose wether to split Windows style, Unix style or Mac OS classic style
    EOL =
      // Mac OS Classic?
      EOLi == -1 && input.indexOf('\r') != -1?
        '\r' :
        // Unix?
        (input[EOLi -1] != '\r'? 
          '\n' :
          // Windows!
          '\r\n'
        ),
    lines = input.split(EOL);
  
  // Get rid of last line if it is empty
  if(lines[lines.length -1] == '') {
    lines.pop();
  }
  
  lines.forEach(function(line, i) {
    // Cache currLine
    var _currLine = currLine;
    
    // add the current line to the output if not in the middle of an element
    if(!currEl) {
      if(_currLine) {
        i == 0 && header === true?
          header = currLine :
          output.push(currLine);
      }
      currLine = header instanceof Array? {} : [];
      currRow = 0;
    }
    
    line.split(delimiter).forEach(function(el, i) {
      // Cache currEl
      var _currEl = currEl,
        quoted, length, trailingQuote = 0;
      
      // restore the delimiter or line break if it was inside an element (_currEl == true) 
      _currEl = _currEl? _currEl + (i? delimiter : EOL ) + el : el;
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
            // Restore the quotes
            currEl = '"' + _currEl + '"' :
            quoted = false;
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
  output.push(currLine);
  return output;
};

CSV.regex = function(input) {
  var output = [], matches, currLine = [];
  while(matches = /(,|\r?\n|^)([^",\r\n]+|"((?:[^"]|"")*)")?/g.exec( input )) {
    if(matches[1] != ',' && matches[1] != '') {
      output.push(currLine);
      currLine = [];
    }
    currLine.push(matches[3]? matches[3].split('""').join('"') : matches[2]);
  }
  // push last line only if not empty
  if(currLine.length > 1 || currLine[0]) {
    output.push(currLine); 
  }
  return output;
};

if(typeof module != 'undefined' && typeof module.exports != 'undefined') {
  module.exports = CSV;
};