var gulp = require('gulp'),
    g = require('gulp-load-plugins')({lazy: false}),

    r = require('request'),
    rp = require('request-promise'),
    Promise = require("bluebird"),
    fs = require('fs'),
    beautify = require('js-beautify').js_beautify,
    imagecolors = require('imagecolors-stream'),
    API_URL = 'https://api.import.io/store/connector/89b3fdcc-e171-4132-b3b1-eecd343db5dc/_query?input=webpage/url:https%3A%2F%2Fen.wikipedia.org%2Fwiki%2FGallery_of_sovereign_state_flags&&_apikey=14e350964c104e2c83431f736f26d88132e298f3b06bf9eb20645142e26b5318922c9b62f2e709735504d251579d24ba509c51d0addc46eca43e1bc042819255f7b7ebffb2634144f8080e5aa901534a';

function parseJSON(response){
  console.log('Parsing json..');
  return JSON.parse(response);
}

function generateImageArray(json){
  console.log('Generating Iimage array..');
  if (!json.results) throw new Error('Malformed response');

  return Promise.map(json.results, function(object) {

    var image = {
      name:   object.name.replace('\'', '').replace('(', '').replace(')', '').replace('.','').replace('.',''),
      url:  object.image
    }

    //Bug with import.io
    if(image.name  === "Nepal") image.url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Flag_of_Nepal.svg/164px-Flag_of_Nepal.svg.png';

    return image;
  });
}

function saveImages(imageArray){
  console.log('Saving images data to disk..');

  return Promise.map(imageArray, function(image){

    return new Promise(function (resolve, reject) {
      var ws = fs.createWriteStream('./data/flags/' + image.name + '.png', { overwrite: true, flags: 'w' });

      ws.on("finish", function(){
        resolve(image);
      });

      ws.on("error", function(err){
        reject(err);
      });

      r(image.url).pipe(ws);
    });
  });
};

function parseImageColors(imageArray){

  console.log('Calculating image palettes..');
  return Promise.map(imageArray, function(image){

    return new Promise(function (resolve, reject) {
      imagecolors.extract('./data/flags/' + image.name + '.png', 6, function(err, palette){
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
    .then(saveImages)
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