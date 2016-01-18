/*
* @preserve flag-colors {{ version }}
* http://reimertz.github.io/flag-colors
* (c) 2016 Pierre Reimertz
* may be freely distributed under the MIT license.
*/

var _flagColors = require('./flagColors.json');

var flagColors = _flagColors.map(function(flag){

  return flag.colors.map(function(color, index){
    return {
        name: flag.name.toLowerCase().replace(/\s/g,'-')  + ((index > 0) ? ('-' + (index+1)) : ''),
        hex: color.hex
      }
  })
});

flagColors.sort(function(a,b){return a.name - b.name});

function getAll() {
  return flagColors;
}

function find(name) {
  return flagColors.filter(function(brand){
    return brand.name === name;
  });
}

exports.getAll = getAll;
exports.find = find;
