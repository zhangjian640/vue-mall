const mongoose = require('mongoose')
const Schema = mongoose.Schema;

let productionSchema = new Schema({
  "productId": String,
  "productName": String,
  "salePrice": Number,
  "checked": String,
  "productNum": Number,
  "productImage": String
})

module.exports = mongoose.model('good', productionSchema)
