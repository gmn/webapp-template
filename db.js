var conString = "postgres://rssdude:password@localhost/rsstool";

var pg = null;
exports.db = exports.pg = pg = require('pg');

//disconnect client when all queries are finished
//client.on('drain', client.end.bind(client)); 
//process.on('exit',function() { console.log("STOPPING PSQL CLIENT"); client.end(); });

/*
function get_users(callback) 
{
  var client = new pg.Client( conString );

  client.connect( function(err) 
  {
    if (err) {
      return console.error('error fetching client from pool', err);
    }
    client.query( 'select * from users', function(err, result) {
      if (err) {
        return console.error('error running query', err);
      }

      if ( callback )
        callback(null,result.rows);

      client.end();
    });
  });
}
exports.get_users = get_users;

function query( qstring, callback ) 
{
  if ( arguments.length < 1 ) 
    return console.error( "not enough arguments to db.query" );

  var client = new pg.Client( conString );

  client.connect( function(err) 
  {
    if (err) {
      return console.error('error fetching client from pool', err);
    }

    client.query( qstring, function(err, result) 
    {
      if (err) {
        return console.error('error running query', err);
      }

      if ( callback )
        callback(null,result.rows);

      client.end();
    });
  });
}
exports.query = query;
*/

/*
function get_users2(callback) 
{
  pg.connect(conString, function(err,client,done) 
  {
    if (err) {
      return console.error('error fetching client from pool', err);
    }
    client.query( 'select * from users', function(err, result)
    {
      done();

      if (err) {
        return console.error('error running query', err);
      }

      if ( callback )
        callback(null,result.rows);
    });
  });
}
exports.get_users = get_users2;
*/

function query( qstring, callback ) 
{
  if ( arguments.length < 1 ) 
    return console.log( "db.query: not enough arguments to db.query" );

  if ( arguments.length < 2 ) 
    callback = function(){};

  pg.connect(conString, function(err,client,done) 
  {
    if (err) {
      console.log('db.query: error fetching client from pool', err);
      return callback('db.query: error fetching client from pool: '+ err);
    }

    client.query( qstring, function(err, result) 
    {
      done();

      if (err) {
        console.log('db.query: error running query', err);
        return callback('db.query: error running query: '+ err);
      }

console.log("in query: \""+qstring+"\" -> \"" + JSON.stringify(result) + '"' );

      callback(null,result.rows);
    });
  });
}
exports.query = query;


/* TEST
query( "INSERT INTO users(username,password,email,date_added) VALUES ('gnaughto','paperplate','greg@naughton.org', NOW() );" , function() {
    get_users(function(s){
      console.log(JSON.stringify(s,null,'  '));
    });
  }
); 
get_users2(function(s,c){
  console.log(JSON.stringify(s,null,'  '));
});
*/
