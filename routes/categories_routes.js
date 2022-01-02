const express = require('express');
const router = express.Router();
const categoriesController = require('../controllers/categories_controller');

router.get('/', categoriesController.getCategories);

router.get('/form', categoriesController.getCategoriesForm);

router.get('/:id', function (req, res, next) {
  res.send('category: ' + req.params.id);
});

module.exports = router;
