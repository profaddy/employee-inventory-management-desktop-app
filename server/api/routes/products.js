const express = require("express");
const router = express.Router();
const Product = require("../models/product");
const User  =require("../models/user");
const Stock = require("../models/stock")
const mongoose = require("mongoose");
const formatResponse = require("../utils/formatResponse");

router.get(("/"),(req, res, next) => {
    Product.find().exec().then(result => {
        res.status(200).json(formatResponse(true,"product retrieved successfully",{products:result}));
    }).catch(error => {
        res.status(500).json(formatResponse(false,`error occured while retrieving product: ${error}`))
    });
});

router.post(("/"),async (req, res, next) => {
    try{
    const findRecordWithReqName = await Product.findOne({name:req.body.name});
    if(findRecordWithReqName !== null){
        throw("Product already exists");
    }
    const product = new Product({
        _id:new mongoose.Types.ObjectId(),
        name:req.body.name
    });
    let users = await User.find();
    const savedProduct = await product.save()
    const stock = await users.map((user) => {
            return {
                product_id:product._id,
                user_id:user._id,
                user_name:user.name,
                product_name:product.name,
                bag_value:0
            }
        })
        const createdStock = await Stock.collection.insert(stock);
        res.status(201).json(formatResponse(true,"product created successfully",{createdProduct:savedProduct}));
}catch(error){
    res.status(500).json(formatResponse(false,`${error}`));        

}
});

router.delete(("/:productId"),(req, res, next) => {
    const id = req.params.productId;
    Product.findByIdAndRemove(id).exec().then(response => {
        res.status(200).json({
            message:"product deleted successsfully",
            id: response.id
        });
    }).catch(error => {
        res.status(500).json(formatResponse(false,`error while deleting product: ${error}`));
    })
});

module.exports = router;
