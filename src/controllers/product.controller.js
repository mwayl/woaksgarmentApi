const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { productService } = require('../services');


const getProducts = catchAsync(async(req, res) => {
    // console.log("in product controller ", req.query)
    // const { availability, minPrice, maxPrice } = req.query;
    // console.log("the availability", availability, "the min price", minPrice, "the max price", maxPrice)
    
 const products = await productService.getProducts(req);
  
    res.status(200).send({
        message: 'Products retrieved successfully',
       products
    });

})



module.exports = {
    getProducts
}
