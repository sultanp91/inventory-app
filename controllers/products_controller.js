exports.getProducts = function (req, res, next) {
  res.send('all Products');
};

exports.getProductsForm = function (req, res, next) {
  res.render('products_form', { title: 'Add new products' });
};
