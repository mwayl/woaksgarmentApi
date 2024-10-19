const httpStatus = require('http-status');
const { Product } = require('../models');
const ApiError = require('../utils/ApiError');



const getProducts = async(req) => {
    const { availability, minPrice, maxPrice, category, brand } = req.query
    console.log("the availability", availability, "the min price", minPrice, "the max price", maxPrice, "the category", category, "the brand", brand)
    const query = {}
    try{
    if (availability !== null && availability !== undefined && availability === true) query.quantity = { $gt: 0 }
    if (minPrice !== null && minPrice !== undefined) query.price = { $gte: minPrice }
    if (maxPrice !== null && maxPrice !== undefined) query.price = {...query.price, $lte: maxPrice }
    if (category !== null && category !== undefined) query.category = { $eq: category }
    if (brand !== null && brand !== undefined) query.brand = { $eq: brand }
    console.log("the query", query)
    const products = await Product.find(query)
    console.log("the products", products)
    console.log("in the product service")
    return products
    }
    catch(error){
        resizeBy.status(400).send(error);
    }
}




module.exports = {
    getProducts
}