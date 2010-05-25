// Create a CSV object only if one does not already exist.
if (!this.CSV) {
    CSV = {};
}

// split based parser
// uses 'forEach' loops
// passes all tests
CSV.splitOld = function(input, options) {
  options = options || {};
  
  var output = [],
    undefined,
    currLine = null,
    currCol,
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
      currCol = 0;
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
            currLine[header[currCol++]] = _currEl;
           
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

// Split based parser
// uses 'while' loops
// passes main tests
CSV.splitSimple = function(input, options) {
  var output = [],
    undefined,
    currLine = null,
    currCol,
    currEl,
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
    lines = input.split(EOL),
    rows,
    ll = lines.length, li = -1, rl, ri,
    quoted, length, trailingQuote;
  
  // Get rid of last line if it is empty
  if(lines[ll -1] == '') {
    lines.pop();
    ll--;
  }
  
  while(++li < ll) {
    // add the current line to the output if not in the middle of an element
    if(!currEl) {
      if(currLine) {
        li == 0 && header === true?
          header = currLine :
          output.push(currLine);
      }
      currLine = [];
      currCol = 0;
    }
    
    rows = lines[li].split(',');
    rl = rows.length;
    ri = -1;
    while(++ri < rl) {
      // restore the delimiter or line break if it was inside an element (_currEl == true) 
      currEl = currEl? currEl + (ri? ',' : EOL ) + rows[ri] : rows[ri];
      
      // Does the string ends the current element?
      quoted = currEl[0] == '"';
      length = currEl.length;
      if(!quoted || (currEl[length -1] == '"' && length > 1)) {
        if(quoted) {
          currEl = currEl.slice(1,-1);
          length -= 2;
          // We still need to make sure that _currEl doesn't end with an odd number of quotes (since "a"""" is an incomplete string)
          trailingQuote = 0;
          while(currEl[--length] == '"') {
            trailingQuote++;
          }
          trailingQuote %2?
            // Restore the quotes
            currEl = '"' + currEl + '"' :
            quoted = false;
        }
        // _currEl is a complete element
        if(!quoted) {
          // undouble quotes
          currEl = currEl.split('""').join('"');
          currLine.push(currEl);
           
          currEl = undefined;
        }
      }
    }
  }
  output.push(currLine);
  return output;
};

// Split based parser
// uses 'while' loops
// passes all tests
// version 1
CSV.split1 = function(input, options) {
  options = options || {};
  
  var output = [],
    undefined,
    currLine = null,
    currCol,
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
    lines = input.split(EOL),
    rows,
    ll = lines.length, li = -1, rl, ri,
    quoted, length, trailingQuote;
  
  // Get rid of last line if it is empty
  if(lines[ll -1] == '') {
    lines.pop();
    ll--;
  }
  
  while(++li < ll) {
    // add the current line to the output if not in the middle of an element
    if(!currEl) {
      if(currLine) {
        li == 0 && header === true?
          header = currLine :
          output.push(currLine);
      }
      currLine = header instanceof Array? {} : [];
      currCol = 0;
    }
    
    rows = lines[li].split(delimiter);
    rl = rows.length;
    ri = -1;
    while(++ri < rl) {
      // restore the delimiter or line break if it was inside an element (_currEl == true) 
      currEl = currEl? currEl + (ri? delimiter : EOL ) + rows[ri] : rows[ri];
      
      // Does the string ends the current element?
      quoted = currEl[0] == '"';
      length = currEl.length;
      if(!quoted || (currEl[length -1] == '"' && length > 1)) {
        if(quoted) {
          currEl = currEl.slice(1,-1);
          length -= 2;
          // We still need to make sure that _currEl doesn't end with an odd number of quotes (since "a"""" is an incomplete string)
          trailingQuote = 0;
          while(currEl[--length] == '"') {
            trailingQuote++;
          }
          trailingQuote %2?
            // Restore the quotes
            currEl = '"' + currEl + '"' :
            quoted = false;
        }
        // _currEl is a complete element
        if(!quoted) {
          // undouble quotes
          currEl = currEl.split('""').join('"');
          header instanceof Array?
            currLine[header[currCol++]] = currEl :
            currLine.push(currEl);
           
          currEl = undefined;
        }
      }
    }
  }
  output.push(currLine);
  return output;
};

// Split based parser
// uses 'while' loops
// passes all tests
// version 2
CSV.split2 = function(input, options) {
  options = options || {};
  
  var output = [],
    undefined,
    currLine = null,
    currCol,
    currEl,
    delimiter = options.delimiter || ',',
    header = options.header,
    headerIsArray = header instanceof Array,
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
    lines = input.split(EOL),
    rows,
    ll = lines.length, li = -1, rl, ri,
    quoted, length, trailingQuote;
  
  // Get rid of last line if it is empty
  if(lines[ll -1] == '') {
    lines.pop();
    ll--;
  }
  
  while(++li < ll) {
    // add the current line to the output if not in the middle of an element
    if(!currEl) {
      if(currLine) {
        if(li == 0 && header === true) {
          header = currLine;
          headerIsArray = true;
        } else {
          output.push(currLine);
        }          
      }
      currLine = headerIsArray? {} : [];
      currCol = 0;
    }
    
    rows = lines[li].split(delimiter);
    rl = rows.length;
    ri = -1;
    while(++ri < rl) {
      // restore the delimiter or line break if it was inside an element (_currEl == true) 
      currEl = currEl? currEl + (ri? delimiter : EOL ) + rows[ri] : rows[ri];
      
      // Does the string ends the current element?
      quoted = currEl[0] == '"';
      length = currEl.length;
      if(!quoted || (currEl[length -1] == '"' && length > 1)) {
        if(quoted) {
          currEl = currEl.slice(1,-1);
          length -= 2;
          // We still need to make sure that _currEl doesn't end with an odd number of quotes (since "a"""" is an incomplete string)
          trailingQuote = 0;
          while(currEl[--length] == '"') {
            trailingQuote++;
          }
          trailingQuote %2?
            // Restore the quotes
            currEl = '"' + currEl + '"' :
            quoted = false;
        }
        // _currEl is a complete element
        if(!quoted) {
          // undouble quotes
          currEl = currEl.split('""').join('"');
          headerIsArray?
            currLine[header[currCol++]] = currEl :
            currLine.push(currEl);
           
          currEl = undefined;
        }
      }
    }
  }
  output.push(currLine);
  return output;
};

// regex based parser
// passes main tests
CSV.regexSimple = function(input) {
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
}

// regex based parser
// passes most tests
// version 1
CSV.regex1 = function(input, options) {
  options = options || {};
  
  var output = [], 
    header = options.header,
    matches, lastMatches,
    currLine = (header instanceof Array? {} : []), currCol = 0, currEl;
  while(matches = /(,|\r?\n|^)([^",\r\n]+|"((?:[^"]|"")*)")?/g.exec( input )) {
    if(matches[1] != ',' && matches[1] != '') {
      output.push(currLine);
      currLine = header instanceof Array? {} : [];
      currCol = 0;
    }
    lastMatches = matches;
    currEl = typeof matches[3] === 'string'? matches[3].split('""').join('"') : matches[2];
    header instanceof Array?
      currLine[header[currCol++]] = currEl :
      currLine.push(currEl);
  }
  // push last line only if not empty
  if(lastMatches[2] || currLine.length > 1 || currLine[0]) {
    output.push(currLine); 
  }
  return output;
};

// regex based parser
// passes most tests
// version 2
CSV.regex2 = function(input, options) {
  options = options || {};
  
  var output = [], 
    header = options.header,
    delimiter = options.delimiter || ',',
    matches, lastMatches,
    headerIsArray = header instanceof Array,
    currLine = (headerIsArray? {} : []), currCol = 0, currEl,
    re = new RegExp('('+delimiter+'|\\r?\\n|^)([^"'+delimiter+'\\r\\n]+|"((?:[^"]|"")*)")?', "g");
  while(matches = re.exec( input )) {
    if(matches[1] != ',' && matches[1] != '') {
      output.push(currLine);
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

// regex based parser
// passes most tests
// version 3
CSV.regex3 = function(input, options) {
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