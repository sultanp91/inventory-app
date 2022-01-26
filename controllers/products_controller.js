const Category = require('../models/category');
const product = require('../models/product');
const Product = require('../models/product');
const fs = require('fs');
const path = require('path');
const root = require('../root');
const multer = require('multer');
const { body, validationResult } = require('express-validator');

const storage = multer.diskStorage({
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
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
        errors: null,
      });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postProductsForm = [
  upload.single('image'),
  body('name', 'Invalid name: must be at least one alphanumeric characters')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body(
    'description',
    'Invalid description: must be at least one alphanumeric characters'
  )
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body(
    'price',
    'Price must be more than zero and to two decimal places'
  ).isDecimal({ decimal_digits: '2' }),
  body('quantity', 'Quantity must be an integer greater than 0').isInt({
    min: 0,
  }),
  function (req, res, next) {
    const name = req.body.name;
    const description = req.body.description;
    const price = req.body.price;
    const stock = req.body.quantity;
    const category = req.body.category;
    console.log(req.file);
    const img = fs.readFileSync(req.file.path);
    const encoded_image = img.toString('base64');
    const image = {
      mimetype: req.file.mimetype,
      imageBuffer: Buffer.from(encoded_image, 'base64'),
    };
    const errors = validationResult(req);
    console.log(errors);
    if (!errors.isEmpty()) {
      Category.find()
        .then((categories) => {
          res.render('products_form', {
            title: 'Add new products',
            categories: categories,
            name: name,
            description: description,
            category: category,
            price: price,
            quantity: stock,
            errors: errors.array(),
          });
        })
        .catch((err) => {
          next(err);
        });
    } else {
      const product = new Product({
        name,
        description,
        price,
        stock,
        category,
        image,
      });

      product.save().then(res.redirect('/products'));
    }
  },
];

exports.getProductPage = function (req, res, next) {
  Product.findById(req.params.id).then(function (product) {
    res.render('product_page', { title: product.name, product: product });
  });
};

exports.getProductUpdatePage = function (req, res, next) {
  res.send('product update page');
};

exports.postProductUpdatePage = function (req, res, next) {
  res.send('product delete page');
};

exports.getPoductDeletePage = function (req, res, next) {
  res.send('product delete page');
};

exports.postProuctDeleteOage = function (req, res, next) {
  res.send('post product delete page');
};
