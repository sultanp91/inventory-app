const express = require('express');
const router = express.Router();
const producrsController = require('../controllers/products_controller');

router.get('/', producrsController.getProducts);

router.get('/form', producrsController.getProductsForm);

router.get('/:id', (req, res, next) => {
  res.send('product item ' + req.params.id);
});

module.exports = router;
