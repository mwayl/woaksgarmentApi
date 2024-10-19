const mongoose = require('mongoose');


const productSchema = mongoose.Schema({
    src: { type: String, required: true },
    alt: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    rating: { type: Number },
    sku: { type: String, required: true },
    brand: { type: String, required: true },
    category: { type: String, required: true },
    quantity: { type: Number, required: true }
});

// Create a model from the schema
const Product = mongoose.model('Product', productSchema);

module.exports = Product;