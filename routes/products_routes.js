const express = require('express');
const router = express.Router();
const productsController = require('../controllers/products_controller');

router.get('/', productsController.getProducts);

router.get('/form', productsController.getProductsForm);

router.get('/:id', (req, res, next) => {
  res.send('product item ' + req.params.id);
});

module.exports = router;
