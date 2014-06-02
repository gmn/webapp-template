
// takes db object, and attaches application-logic methods to it

exports.setup = function(db,done) 
{
  function query_callback(err, result, callback)
  {
    //done();

    if (err) {
      var m = 'db.query: error running query: "'+ err + '"';
      console.log( m );
      return callback( m );
    }

    callback(null,result.rows);
  }

  db.findById = function( id, callback ) {
    db.query( "select * from users where id = " + id, function(e,r) { query_callback(e,r,callback); } );
  };

  db.removeById = function( id, callback ) {
    db.query( "delete from users where id = " + id + ' limit 1;', function(e,r) { query_callback(e,r,callback); } );
  };

  db.findByName = function( name, callback ) {
    db.query( "select * from users where username = '"+name+"'", function(e,r) { query_callback(e,r,callback); } );
  };

  db.findByEmail = function( email, callback ) {
    db.query( "select * from users where email = '"+email+"'", function(e,r) { query_callback(e,r,callback); } );
  };

  db.userSignup = function( form, callback ) {
    if ( !callback )
      callback = function(){};

    db.findByName( form.username, function(err,rows) {

      if ( rows && rows.length > 0 )
        return callback( "name already taken" );

      db.findByEmail( form.email, function(err,erows) {

        if ( erows && erows.length > 0 )
          return callback( "email already taken" );

        // no matching name or email, go ahead and create user, and redirect
        db.query( "INSERT INTO users(username,password,email,date_added) VALUES ('"+form.username+"','"+form.password+"','"+form.email+"',NOW());", function(e,r) { query_callback(e,r,callback); } );

      });
    });
  };
}
