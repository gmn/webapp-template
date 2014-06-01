
var fs = require('fs');
var mime = require( './mime' );
var path = require('path');

function _mime_from_suffix( file ) {
  var suf = file.slice( file.lastIndexOf('.') );
  return mime.find( suf );
}

/*
method  "GET"
url "/inspect/?q=soft"
path  "/inspect/"
query {"q":"soft"}
*/

function staticFileMiddleware( str_or_array )
{
  var that = this;
  this.paths = [];

  this.addPaths = function(p) {
    if (p instanceof Array) {
      this.paths = this.paths.concat(p);
    } else {
      this.paths.push(p);  
    }
    // convert to fully qualified paths
    this.paths = this.paths.map(function(e){return path.resolve(e);});
  };

  if ( arguments.length > 0 )
    this.addPaths(str_or_array);


  this.getMiddleware = function() 
  {
    // calls next() if file not found, else streams file to client
    return function( req, res, next ) 
    {
      for ( var i = 0, l = that.paths.length; i < l; i++ )
      {
        // attach req.url to path_resolved, 
        var file = that.paths[i];
        if ( file[file.length-1] !== '/' && req.url[0] !== '/' ) 
          file += '/';
        file += req.url; 

        console.log("trying: \""+file+'"');

        // check if file exists
        // send the first one that matches
        if ( fs.existsSync( file ) )
        {
          var mimetype = _mime_from_suffix(file);
          var rs = fs.createReadStream(file);
          //rs.on('error', reportError.bind(null,res) );
          res.writeHead(200, {"Content-Type": mimetype });
          rs.pipe(res);
          return;
        }
      } // for

      // didn't find it
      return next();
    }; // return function
  } // getMiddleware
};

exports.staticFileMiddleware = staticFileMiddleware;

exports.static_file = function( file, res ) {
  fs.readFile( file, 'utf-8', function (error, data) {
    var mimetype = _mime_from_suffix(file);
    res.writeHead( 200, {"Content-Type": mimetype} );
    res.write(data);
    res.end();
  });
};

exports.inspect = function inspect(req,res) {
  var s = '<style type="text/css">body{font-family:courier;}</style>';
  s += '<table class="a">';
  ['host','method','url','path','params','body','query','route','cookies',function(x){res.send(x)}].forEach(function(elt){
    if ( !(elt instanceof Function) )
      s += '<tr><td><b>'+elt+'</b></td><td>' + JSON.stringify(req[elt]) + '</td></tr>';
    else
      elt(s+'</table>');
  });
}

