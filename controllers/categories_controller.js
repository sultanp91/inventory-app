const Category = require('../models/category');

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
  res.render('category_form', { title: 'Add new category' });
};

exports.postCategoriesForm = function (req, res, next) {
  const name = req.body.name;
  const description = req.body.description;
  const category = new Category({ name, description });
  category.save().then(res.redirect('/'));
};
