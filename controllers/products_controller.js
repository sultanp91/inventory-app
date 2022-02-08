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
      res.render('products_index', { title: 'All Products', products });
    });
};

exports.getProductsForm = function (req, res, next) {
  Category.find()
    .then((categories) => {
      res.render('products_form', {
        title: 'Add New Product',
        categories: categories,
        name: '',
        description: '',
        category: null,
        price: '',
        stock: '',
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
  body('price', 'Price must be more than zero and to two decimal places')
    .trim()
    .escape()
    .isDecimal({ decimal_digits: '2' }),
  body('stock', 'Quantity must be an integer greater than 0')
    .trim()
    .escape()
    .isInt({
      min: 0,
    }),
  function (req, res, next) {
    const name = req.body.name;
    const description = req.body.description;
    const price = req.body.price;
    const stock = req.body.stock;
    const category = req.body.category;
    const img = fs.readFileSync(req.file.path);
    const encoded_image = img.toString('base64');
    const image = {
      mimetype: req.file.mimetype,
      imageBuffer: Buffer.from(encoded_image, 'base64'),
    };
    const errors = validationResult(req);
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
            stock: stock,
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

exports.getProductUpdatePage = async function (req, res, next) {
  const { name, description, price, stock, category } = await Product.findById(
    req.params.id
  );
  const categories = await Category.find();
  res.render('products_update_form', {
    title: name,
    name,
    description,
    price,
    stock,
    category,
    categories,
    errors: null,
  });
};

exports.postProductUpdatePage = [
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
  body('price', 'Price must be more than zero and to two decimal places')
    .trim()
    .escape()
    .isDecimal({ decimal_digits: '2' }),
  body('stock', 'Quantity must be an integer greater than 0')
    .trim()
    .escape()
    .isInt({
      min: 0,
    }),
  async function (req, res, next) {
    const name = req.body.name;
    const description = req.body.description;
    const price = req.body.price;
    const stock = req.body.stock;
    const category = req.body.category;
    const errors = validationResult(req);

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
            stock: stock,
            errors: errors.array(),
          });
        })
        .catch((err) => {
          next(err);
        });
    }

    if (!req.file) {
      console.log('test');
      const { image } = await Product.findById(req.params.id);
      await Product.findByIdAndUpdate(req.params.id, {
        name,
        description,
        price,
        stock,
        category,
        image,
      });
    } else {
      const img = fs.readFileSync(req.file.path);
      const encoded_image = img.toString('base64');
      const image = {
        mimetype: req.file.mimetype,
        imageBuffer: Buffer.from(encoded_image, 'base64'),
      };
      await Product.findByIdAndUpdate(req.params.id, {
        name,
        description,
        price,
        stock,
        category,
        image,
      });
    }
    res.redirect('/products/' + req.params.id);
  },
];

exports.getProductDeletePage = async function (req, res, next) {
  const product = await Product.findById(req.params.id);
  res.render('product_delete', {
    title: product.name,
    id: req.params.id,
    correctPassword: true,
    errors: null,
  });
};

exports.postProductDelete = [
  body('password', 'No html characters allowed').trim().escape(),
  async function (req, res, next) {
    const errors = validationResult(req);
    const product = await Product.findById(req.params.id);
    if (!errors.isEmpty()) {
      res.render('product_delete', {
        title: product.name,
        id: product._id,
        errors: errors.array(),
        correctPassword: false,
      });
    } else if (req.body.password !== 'securepw') {
      res.render('product_delete', {
        title: product.name,
        id: product._id,
        errors: null,
        correctPassword: false,
      });
    } else if (req.body.password === 'securepw') {
      await Product.findByIdAndRemove(req.body.id);
      res.redirect('/products');
    }
  },
];
