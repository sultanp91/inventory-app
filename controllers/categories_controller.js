exports.getCategories = function (req, res, next) {
  res.send('all categories');
};

exports.getCategoriesForm = function (req, res, next) {
  res.render('category_form', { title: 'Add new category' });
};
