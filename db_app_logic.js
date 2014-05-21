
// takes db object, and attaches application-logic methods to it
exports = function(db) {
    db.findById = function( id, callback ) {
        db.query( "select * from users where id = " + id, callback );
    }

    db.removeById = function( id, callback ) {
        db.query( "delete from users where id = " + id + ' limit 1;', callback );
    }
}
