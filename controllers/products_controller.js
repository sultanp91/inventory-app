const Category = require('../models/category');
const Product = require('../models/product');

exports.getProducts = function (req, res, next) {
  res.send('all Products');
};

exports.getProductsForm = function (req, res, next) {
  Category.find()
    .then((categories) => {
      res.render('products_form', {
        title: 'Add new products',
        categories: categories,
        name: '',
        description: '',
        category: null,
        price: '',
        quantity: '',
      });
    })
    .catch((err) => {
      console.log(err);
    });
};
