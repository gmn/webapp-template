
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

exports.staticFileMiddleware = function( static_dir )
{
  // determine fully-qualified directory name
  var path_resolved = path.resolve( static_dir );

  // calls next() if file not found, else streams file to client
  return function( req, res, next ) 
  {
    if ( !req ) {
      return console.log('no req!');
    }
    if ( !req.url ) {
      return console.log('no req.url!');
    }

    // attach req.url to path_resolved, 
    var file = path_resolved;
    if ( path_resolved[path_resolved.length-1] !== '/' && req.url[0] !== '/' ) 
      file += '/';
    file += req.url; 

    // check if file exists, 
    fs.exists( file, function(found) {
      if ( !found ) {
        console.log( "failed to locate static file: \"" + file + '"' );
        return next();
      }

      var mimetype = _mime_from_suffix(file);
      var rs = fs.createReadStream(file);
      //rs.on('error', reportError.bind(null,res) );
      res.writeHead(200, {"Content-Type": mimetype });
      rs.pipe(res);
    });
  }

};

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

