/*
* @preserve flag-colors {{ version }}
* http://reimertz.github.io/flag-colors
* (c) 2016 Pierre Reimertz
* may be freely distributed under the MIT license.
*/

var _flagColors = require('./flagColors.json');

var flagColors = _flagColors.map(function(flag){
  return flag.colors.map(function(color, index){
    //filter out anything less than 3%
    if(color.percent < 3) return null;

    return {
        image: flag.url,
        name: flag.name.toLowerCase().replace(/\s/g,'-')  + ((index > 0) ? ('-' + (index+1)) : ''),
        hex: color.hex
      }
  })
});

flagColors = [].concat.apply([], flagColors);
flagColors = flagColors.filter(function(n){ return n != undefined });

flagColors.sort(function(a,b){
  if(a.name < b.name) return -1;
  if(a.name > b.name) return 1;
  return 0;
});

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
