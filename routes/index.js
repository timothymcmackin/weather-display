const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', async function(req, res, next) {

  const pages = [
    {
      title: 'Weather',
      description: 'Live data from the Oak House weather station',
      path: './weather',
    },
    {
      title: 'Home page',
      description: 'Tim\'s personal site, resume, and portfolio',
      path: 'https://timothymcmack.in',
    },
  ];

  res.render('index', {
    title: 'Oak House server',
    pages,
  });
});

module.exports = router;
