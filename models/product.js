const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  image: { mimetype: { type: String }, imageBuffer: { type: Buffer } },
});

ProductSchema.virtual('url').get(function () {
  return '/products/' + this._id;
});

ProductSchema.virtual('imageurl').get(function () {
  return `data:${
    this.image.mimetype
  };base64,${Buffer.from(this.image.imageBuffer).toString('base64')}`;
});

module.exports = mongoose.model('Product', ProductSchema);
