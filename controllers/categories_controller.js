const Category = require('../models/category');
const { body, validationResult } = require('express-validator');

exports.getCategories = function (req, res, next) {
  Category.find()
    .then((categories) => {
      res.render('category_index', {
        title: 'categories',
        categories: categories,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getCategoriesForm = function (req, res, next) {
  res.render('category_form', {
    title: 'Add new category',
    name: '',
    description: '',
    errors: null,
  });
};

exports.postCategoriesForm = [
  body('name', 'Invalid name: minimum length of 2 character')
    .trim()
    .isLength({ min: 2 })
    .escape(),
  body('description', 'Invalid description: minimum length of 2 characters')
    .trim()
    .isLength({ min: 2 })
    .escape(),
  function (req, res, next) {
    const errors = validationResult(req);
    const name = req.body.name;
    const description = req.body.description;
    if (!errors.isEmpty()) {
      res.render('category_form', {
        title: 'Add new category',
        name,
        description,
        errors: errors.array(),
      });
    } else {
      const category = new Category({ name, description });
      category.save().then(res.redirect('/categories'));
    }
  },
];
