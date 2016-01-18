var gulp = require('gulp'),
    g = require('gulp-load-plugins')({lazy: false}),

    rp = require('request-promise'),
    Promise = require("bluebird"),
    fs = require('fs'),
    beautify = require('js-beautify').js_beautify,
    imagecolors = require('imagecolors-stream'),
    API_URL = 'https://api.import.io/store/connector/f2420128-23f0-42cc-8954-db34f21c8906/_query?input=webpage/url:http%3A%2F%2Fhewgill.com%2Fflags%2F&&_apikey=14e350964c104e2c83431f736f26d88132e298f3b06bf9eb20645142e26b5318922c9b62f2e709735504d251579d24ba509c51d0addc46eca43e1bc042819255f7b7ebffb2634144f8080e5aa901534a';

function parseJSON(response){
  console.log('Parsing json..');
  return JSON.parse(response);
}

function generateImageArray(json){
  console.log('Generating Iimage array..');
  if (!json.results) throw new Error('Malformed response');

  return Promise.map(json.results, function(object) {

    var image = {
      name:   object['link_4/_text'].replace('\'', '').replace('(', '').replace(')', '').replace('.','').replace('.',''),
      url:  object['image_2']
    }

    // 'moldivia, republic of' -> republic of moldivia
    if(image.name.indexOf(',') > -1) {
      image.name = image.name.split(',')[1].substring(1) + ' ' + image.name.split(',')[0];
    }

    return image;
  });
}

function parseImageColors(imageArray){
  console.log('Calculating image palettes..');
  return Promise.map(imageArray, function(image){

    return new Promise(function (resolve, reject) {
      imagecolors.extract(image.url, 6, function(err, palette){
        if(err) return resolve();

        image.colors = palette.map(function(color){
          return {
            hex: color.hex,
            percent: color.percent
          }
        });

        image.colors.sort(function(a,b){
          return a.percent - b.percent;
        });

        image.colors.reverse();

        resolve(image);
      });

    });
  })
};

function filterFaultyImages(array) {
  return array.filter(function(n){ return n != undefined });
}

function streamToPromise(stream) {
    return new Promise(function(resolve, reject) {
        stream.on("end", resolve);
        stream.on("error", reject);
    });
}

function saveDataToFile(colorData) {
  console.log('Saving data to disk..');
  var writeStream = fs.createWriteStream('./data/flagColors.json');

  writeStream.write(beautify(JSON.stringify(colorData),  { indent_size: 2 }));
  return streamToPromise(writeStream);
}

console.log('Fetching latest flag data');
gulp.task('fetch-flag-colors', function () {
  rp(API_URL)
    .then(parseJSON)
    .then(generateImageArray)
    .then(parseImageColors)
    .then(filterFaultyImages)
    .then(saveDataToFile)
    .then(function(){
      console.log('Done! :D');
    })
    .catch(function (err) {
        console.log(err)
    });
});