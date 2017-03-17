//**********************************
// Commons build script
//**********************************
'use strict';

var fs  = require('fs');

//*****************************************************************
// Commons
//*****************************************************************

exports.rmdirp = function(path) {
    rmdirRecursive(path);
}

var rmdirRecursive = function(path) {
  if( fs.existsSync(path) ) {
    fs.readdirSync(path).forEach(function(file,index){
      var curPath = path + "/" + file;
      if(fs.lstatSync(curPath).isDirectory()) { // recurse
        rmdirRecursive(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
};
