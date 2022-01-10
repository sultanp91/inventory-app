const Category = require('../models/category');
const product = require('../models/product');
const Product = require('../models/product');
const fs = require('fs');
const path = require('path');
const root = require('../root');
const multer = require('multer');
const { body, validationResult } = require('express-validator');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(root + '/public/uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname);
  },
});

const upload = multer({ storage: storage });

exports.getProducts = function (req, res, next) {
  Product.find()
    .populate('category')
    .then((products) => {
      res.render('products_index', { title: 'all products', products });
    });
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
      next(err);
    });
};

exports.postProductsForm = [
  upload.single('image'),
  function (req, res, next) {
    const name = req.body.name;
    const description = req.body.description;
    const price = req.body.price;
    const stock = req.body.quantity;
    const category = req.body.category;
    const image = req.file.filename;
    console.log(image);
    console.log(req.file);
    const product = new Product({
      name,
      description,
      price,
      stock,
      category,
    });

    product.save().then(res.redirect('/products'));
  },
];
