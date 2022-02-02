const express = require('express');
const router = express.Router();
const categoriesController = require('../controllers/categories_controller');

router.get('/', categoriesController.getCategories);

router.get('/form', categoriesController.getCategoriesForm);

router.post('/form', categoriesController.postCategoriesForm);

router.get('/:id', categoriesController.getCategoryPage);

router.get('/:id/update', categoriesController.getCategoryUpdateForm);

router.post('/:id/update', categoriesController.postCategoryUpdateForm);

router.get('/:id/delete', categoriesController.getCategoryDelete);

router.post('/:id/delete', categoriesController.getCategoryPage);

module.exports = router;
