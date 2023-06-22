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
  ];

  res.render('index', {
    title: 'Oak House server',
    pages,
  });
});

module.exports = router;
