const express = require('express');
const router = express.Router();
const productsController = require('../controllers/products_controller');

router.get('/', productsController.getProducts);

router.get('/form', productsController.getProductsForm);

router.post('/form', productsController.postProductsForm);

router.get('/:id', productsController.getProductPage);

router.get('/:id/update', productsController.getProductUpdatePage);

router.post('/:id/update', productsController.postProductUpdatePage);

router.get('/:id/delete', productsController.getProductDeletePage);

router.post('/:id/delete', productsController.postProductDelete);

module.exports = router;
