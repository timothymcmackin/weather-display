const express = require('express');
const router = express.Router();
const mysql = require('mysql');

/* GET home page. */
router.get('/', async function(req, res, next) {

  const weatherDB = new Database({
    host     : '127.0.0.1', // Needs to be the IP and not 'localhost'
    user     : 'python',
    password : process.env.PYTHON_MYSQL_PASSWORD,
    database : 'weather',
  });

  weatherDB.connect();

  const rows = await weatherDB.query('SELECT * from records limit 10;')
    .catch(console.error);

  weatherDB.close();
  res.render('index', {
    title: 'Oak House Weather Station',
    weatherData: rows,
  });
});

// https://codeburst.io/node-js-mysql-and-promises-4c3be599909b
class Database {
  constructor( config ) {
      this.connection = mysql.createConnection( config );
  }
  query( sql, args ) {
      return new Promise( ( resolve, reject ) => {
          this.connection.query( sql, args, ( err, rows ) => {
              if ( err )
                  reject( err );
              resolve( rows );
          } );
      } );
  }
  connect() {
    this.connection.connect()
  }
  close() {
      return new Promise( ( resolve, reject ) => {
          this.connection.end( err => {
              if ( err )
                  reject( err );
              resolve();
          } );
      } );
  }
}

module.exports = router;
