const fs = require("fs");

exports.getRandomInteger = function(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

exports.getRandomPort = function() {
  return exports.getRandomInteger(1024, 65535);
};

exports.readFileAsString = function(filePath) {
  return fs.readFileSync(filePath, "utf8");
};
