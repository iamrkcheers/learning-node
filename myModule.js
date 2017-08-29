/*var fs = require('fs');
var path = require('path');
var fnc = function(folder,extension,callback) {
    fs.readdir(folder,function(error,list){
      if (error)
          callback(error);
      else {
          var ext = '.' + extension;
          var arr = list.filter(function(item){
              return path.extname(item) === ext;
          });
          callback(null,arr);
      }
    });
};
module.exports = fnc;*/ // I

