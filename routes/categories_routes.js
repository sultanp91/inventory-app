const express = require('express');
const router = express.Router();

router.get('/', function (req, res, next) {
  res.send('all categories');
});

router.get('/form', (req, res, next) => {
  res.send('category form');
});

router.get('/:id', function (req, res, next) {
  res.send('category: ' + req.params.id);
});

module.exports = router;
