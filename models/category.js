const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ItemSchema = new Schema({
  name: { type: String, required: true, minlength: 2 },
});

ItemSchema.virtual('url').get(function () {
  return '/category/' + this._id;
});
