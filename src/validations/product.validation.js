const Joi = require('joi');
const { password, objectId } = require('./custom.validation');


const getProducts = {
    query: Joi.object().keys({
        availability: Joi.boolean(),
        minPrice: Joi.number().integer(),
        maxPrice: Joi.number().integer(),
        category: Joi.string(),
        brand: Joi.string(),
        // sortBy: Joi.string(),
        // limit: Joi.number().integer(),
        // page: Joi.number().integer(),
    }),
};





module.exports = {

    getProducts,

};