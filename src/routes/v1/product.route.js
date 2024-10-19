const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const productValidation = require('../../validations/product.validation');
const productController = require('../../controllers/product.controller');

const router = express.Router();

router
    .route('/')
    // .get(validate(productValidation.getProducts), productController.getProducts);
    .get(validate(productValidation.getProducts), productController.getProducts);


module.exports = router;