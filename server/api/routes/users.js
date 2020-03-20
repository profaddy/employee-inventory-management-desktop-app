const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Product = require("../models/product");
const Stock = require("../models/stock")
const mongoose = require("mongoose");
const formatResponse = require("../utils/formatResponse");

router.get(("/"),(req, res, next) => {
    User.find().exec().then(result => {
        res.status(200).json(formatResponse(true,"user retrieved successfully",{users:result}));
    }).catch(error => {
        res.status(500).json(formatResponse(false,`error occured while retrieving user: ${error}`))
    });
});

router.post(("/"),async (req, res, next) => {
    try{
    const findRecordWithReqName = await User.findOne({name:req.body.name});
    if(findRecordWithReqName !== null){
        throw("User already exists");
    }
    const user = new User({
        _id:new mongoose.Types.ObjectId(),
        name:req.body.name
    })

    let products = await Product.find();
    const savedUser = await  user.save();
        const stock = await products.map((product) => {
            return {
                product_id:product._id,
                user_id:user._id,
                user_name:user.name,
                product_name:product.name,
                bag_value:0
            }
        })
        const createdStock = Stock.collection.insert(stock);
        res.status(201).json(formatResponse(true,"user created successfully",{createduser:savedUser}));
}catch(error){
    res.status(500).json(formatResponse(false,`${error}`));        
}
});

router.delete(("/:userId"),(req, res, next) => {
    const id = req.params.userId;
    User.findByIdAndRemove(id).exec().then(response => {
        res.status(200).json({
            message:"user deleted successsfully",
            id: response.id
        });
    }).catch(error => {
        res.status(500).json(formatResponse(false,`error while deleting user: ${error}`));
    })
});


module.exports = router;