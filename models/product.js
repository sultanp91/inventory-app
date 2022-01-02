const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  name: { type: String, required: true, minlength: 2 },
  quantity: { type: Number, required: true },
  category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
});

ProductSchema.virtual('url').get(function () {
  return '/products/' + this._id;
});
