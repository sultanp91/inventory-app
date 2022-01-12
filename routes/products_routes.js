const express = require('express');
const router = express.Router();
const productsController = require('../controllers/products_controller');

router.get('/', productsController.getProducts);

router.get('/form', productsController.getProductsForm);

router.post('/form', productsController.postProductsForm);

router.get('/:id', productsController.getProductPage);

module.exports = router;
