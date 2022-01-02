const express = require('express');
const router = express.Router();

router.get('/', function (req, res, next) {
  res.send('all products');
});

router.get('/form', (req, res, next) => {
  res.send('products form');
});

router.get('/:id', (req, res, next) => {
  res.send('product item ' + req.params.id);
});

module.exports = router;
