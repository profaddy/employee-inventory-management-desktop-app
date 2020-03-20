const express = require("express");
const router = express.Router();
const Entry = require("../models/entry");
const moment = require("moment");
const Stock = require("../models/stock");
const User = require("../models/user");
const Product = require("../models/product");
const mongoose = require("mongoose");
const formatResponse = require("../utils/formatResponse");

getBagValue = (payload, currentBagValue) => {
    try {
        let remaining = 0;
        let taken = 0;
        let consumed = 0;
        let returned = 0;
        if (payload.entry_type === "taken") {
            remaining = Number(currentBagValue) + Number(payload.entry_value);
            taken = Number(payload.entry_value)
        } else if (payload.entry_type === "consumed") {
            remaining = Number(currentBagValue) - Number(payload.entry_value);
            consumed = Number(payload.entry_value)
        } else if (payload.entry_type === "returned") {
            remaining = Number(currentBagValue) - Number(payload.entry_value);
            returned = Number(payload.entry_value)
        } else {
            remaining = Number(currentBagValue)
        }
        if (remaining < 0) {
            throw ("problem while calculating remaining value")
        }
        return {
            remaining: remaining,
            consumed: consumed,
            taken: taken,
            returned: returned
        }
    } catch (error) {
        throw ("Bag value cannot go negative")
    }
}

const addEntry = async (payload, res, next) => {
    try {
        let remaining = 0;
        let product = await Product.findById(payload.product_id)
        let user = await User.findById(payload.user_id);
        let stock = await Stock.findOne({ product_id: payload.product_id, user_id: payload.user_id });
        const calculatedBagValues = getBagValue(payload, stock.bag_value, res);
        stock.bag_value = calculatedBagValues.remaining;
        let stockSave = await stock.save();
        const entry = new Entry({
            _id: new mongoose.Types.ObjectId(),
            user_id: payload.user_id,
            product_id: payload.product_id,
            product_name: product.name,
            user_name: user.name,
            entry_type: payload.entry_type,
            entry_value: payload.entry_value,
            taken: calculatedBagValues.taken || 0,
            consumed: calculatedBagValues.consumed || 0,
            returned: calculatedBagValues.returned || 0,
            remaining: Number(calculatedBagValues.remaining),
            created_date: moment().utc().toISOString(),
            created_timestamp: moment().utc().format("X")
        });
        return { remaining: remaining, entry: entry };
    } catch (error) {
        res.status(400).json(formatResponse(false, `${error}`));
    }
}

router.get(("/"), async (req, res, next) => {
    try {
        const entries = await Entry.find().sort({ created_date: 'asc' }).exec();
        res.status(200).json(formatResponse(true, "entries retrieved successfully", { entries: entries }));
    } catch (error) {
        res.status(500).json(formatResponse(false, `error occured while retrieving entries: ${error}`))
    }
});

router.get(("/:id"), async (req, res, next) => {
    try {
        const { id } = req.params;
        const entry = await Entry.findById(id);
        res.status(200).json(formatResponse(true, "entries retrieved successfully", { entry: entry }));
    } catch (error) {
        res.status(500).json(formatResponse(false, `error occured while retrieving entries: ${error}`))
    }
});

router.post(("/"), async (req, res, next) => {
    try {
        const result = await addEntry(req.body, res, next)
        const saveEntry = await result.entry.save()
        res.status(201).json(formatResponse(true, "entry created successfully", { createdEntry: saveEntry }));
    } catch (error) {
        res.status(500).json(formatResponse(false, `error while creating entry: ${error}`));
    }
});

router.delete(("/:entryId"), async (req, res, next) => {
    try {
        const getSelectedItem = await Entry.findOne({ _id: req.params.entryId });
        let sortedEntries = await Entry.find({
            user_id: getSelectedItem.user_id,
            product_id: getSelectedItem.product_id,
            created_date: { $gte: getSelectedItem.created_date }
        }).sort({ created_date: 'asc' }).exec()
        if (sortedEntries.length !== 0) {
            let prevBagValue = null;
            if (sortedEntries.length !== 0 && sortedEntries[0].entry_type === "taken") {
                prevBagValue = sortedEntries[0].remaining - sortedEntries[0].taken
            } else {
                prevBagValue = sortedEntries[0].remaining + sortedEntries[0][sortedEntries[0]["entry_type"]]
            }
            if (prevBagValue < 0) {
                throw ("Negative stock")
            }
            const rowsToBeInserted = sortedEntries.reduce((acc, item, index) => {
                let updatedItem = [];
                if (index === 0) {
                    item["entry_type"] = 0
                    item["entry_value"] = 0
                    updatedItem = {
                        ...item._doc,
                        ...getBagValue(item._doc, prevBagValue),
                    }
                } else {
                    updatedItem = {
                        ...item._doc,
                        ...getBagValue(item._doc, acc[index - 1].remaining),
                    }
                }
                acc.push(updatedItem);
                return acc;
            }, []);
            const stock = await Stock.findOne({ product_id: sortedEntries[0].product_id, user_id: sortedEntries[0].user_id })
            const lastRecord = rowsToBeInserted.slice()[0];
            stock.bag_value = lastRecord.remaining;
            const saveStock = await stock.save();
            const recordsTobeDeleted = await rowsToBeInserted.map((item) => {
                return item._id
            });
            const deletedEntries = await Entry.deleteMany({ _id: { $in: recordsTobeDeleted } });
            const insertedRows = await Entry.insertMany(rowsToBeInserted);
            res.status(201).json(formatResponse(true, `entrr deleted successfully`));
        } else {
            res.status(400).json(formatResponse(false, "no matching records found"))
        }
    } catch (error) {
        res.status(400).json(formatResponse(false, `${error}`))
    }
});

router.put(("/"), async (req, res, next) => {
    try {
        const getSelectedItem = await Entry.findOne({ _id: req.body._id });
        let sortedEntries = await Entry.find({
            user_id: req.body.user_id,
            product_id: req.body.product_id,
            created_date: { $gte: getSelectedItem.created_date }
        }).sort({ created_date: 'asc' }).exec()
        // let sortedEntries = await Entry.aggregate(
        //     [{
        //         $match: {
        //             user_id: req.body.user_id,
        //             product_id: req.body.product_id,
        //             created_at: { $gte: getSelectedItem.created_at }
        //         }
        //     },
        //         // {$group:{
        //         //     _id:"$_id",total:{$sum:{$add: ["$consumed", "$returned"]}}
        //         // }},

        //         // { $project: {
        //         //     total: { $add: ["$consumed", "$returned"] }
        //         // }}
        //     ]
        // )
        if (sortedEntries.length !== 0) {
            let prevBagValue = null;
            if (sortedEntries.length !== 0 && sortedEntries[0].entry_type === "taken") {
                prevBagValue = sortedEntries[0].remaining - sortedEntries[0].taken
            } else {
                prevBagValue = sortedEntries[0].remaining + sortedEntries[0][sortedEntries[0]["entry_type"]]
            }
            if (prevBagValue < 0) {
                throw ("Negative stock")
            }
            const rowsToBeInserted = sortedEntries.reduce((acc, item, index) => {
                let updatedItem = [];
                if (index === 0) {
                    item["entry_type"] = req.body.entry_type;
                    item["entry_value"] = req.body.entry_value;
                    updatedItem = {
                        ...item._doc,
                        ...getBagValue(item._doc, prevBagValue),
                    }
                } else {
                    updatedItem = {
                        ...item._doc,
                        ...getBagValue(item._doc, acc[index - 1].remaining),
                    }
                }
                acc.push(updatedItem);
                return acc;
            }, []);
            const stock = await Stock.findOne({ product_id: sortedEntries[0].product_id, user_id: sortedEntries[0].user_id })
            const lastRecord = rowsToBeInserted.slice()[0];
            stock.bag_value = lastRecord.remaining;
            const saveStock = await stock.save();
            const recordsTobeDeleted = await rowsToBeInserted.map((item) => {
                return item._id
            });
            const deletedEntries = await Entry.deleteMany({ _id: { $in: recordsTobeDeleted } });
            const insertedRows = await Entry.insertMany(rowsToBeInserted);
            res.status(201).json(formatResponse(true, `entries created successfully`));
        } else {
            res.status(400).json(formatResponse(false, "no matching records found"))
        }
    } catch (error) {
        res.status(400).json(formatResponse(false, `${error}`))
    }
})

module.exports = router;