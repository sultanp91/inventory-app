const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
});

ProductSchema.virtual('url').get(function () {
  return '/products/' + this._id;
});

exports = mongoose.model('Product', ProductSchema);
