const fs = require('fs');
var path = require('path')

console.log(__dirname+'/config.json')
var config;
fs.readFile(__dirname+'/config.json', 'utf-8', (err, data) => {
  if (err) {
      throw err;
  }
  // parse JSON object
  const config = JSON.parse(data.toString());
  console.log(config.mumbai_url);
});

console.log(config)