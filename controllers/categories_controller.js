const Category = require('../models/category');
const Product = require('../models/product');
const ObjectId = require('mongoose').Types.ObjectId;
const async = require('async');

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

exports.getCategoryPage = function (req, res, next) {
  async.parallel(
    {
      products: function (cb) {
        Product.find({ category: ObjectId(req.params.id) }).exec(cb);
      },
      category: function (cb) {
        Category.findById(req.params.id).exec(cb);
      },
    },
    function (err, results) {
      if (err) {
        next(err);
      }
      res.render('category_page', {
        title: results.category.name,
        description: results.category.description,
        url: results.category.url,
        products: results.products,
      });
    }
  );
};

exports.getCategoryUpdateForm = async function (req, res, next) {
  const category = await Category.findById(req.params.id);

  res.render('category_form', {
    title: 'Update Category',
    name: category.name,
    description: category.description,
    errors: null,
  });
};

exports.postCategoryUpdateForm = [
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
        title: 'Update Category',
        name,
        description,
        errors: errors.array(),
      });
    } else {
      Category.findByIdAndUpdate(
        req.params.id,
        { name, description },
        {},
        function (err, result) {
          if (err) {
            next(err);
          } else {
            res.redirect(result.url);
          }
        }
      );
    }
  },
];
