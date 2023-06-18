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

  const weatherData = rows.map(({
    datestamp,
    temp_f_from_hum,
    humidity,
    temp_f_from_bar,
    pressure,
  }) => ({
    day: formatDay(datestamp),
    time: formatTime(datestamp),
    dayOfWeek: datestamp.getDay(),
    temp_f_from_hum,
    temp_f_from_bar,
    humidity,
    pressure,
  }))

  weatherDB.close();
  res.render('index', {
    title: 'Oak House Weather Station',
    weatherData,
  });
});

const daysOfWeek = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday',
];

const months = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec',
];

const formatDay = (date) => {
  const dayOfWeek = daysOfWeek[date.getDay()];
  const month = months[date.getMonth()];
  return `${dayOfWeek}, ${month} ${date.getDate()}`;
}

const formatTime = (datestamp) => {
  const hour = datestamp.getHours() == 0 ? '00' : datestamp.getHours().toString();
  const minuteAsString = datestamp.getMinutes().toString();
  const minute = minuteAsString.length === 1 ? '0' + minuteAsString : minuteAsString;
  return hour + ':' + minute;
}

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
