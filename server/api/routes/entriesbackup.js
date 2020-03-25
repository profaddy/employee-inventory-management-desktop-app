const express = require("express");
const router = express.Router();
const Entry = require("../models/entry");
const moment = require("moment");
const Stock = require("../models/stock");
const User = require("../models/user");
const Product = require("../models/product");
const mongoose = require("mongoose");
const isEmpty = require("lodash/isEmpty");
const formatResponse = require("../utils/formatResponse");

getBagValue = (payload, currentBagValue) => {
    try {
        console.log(payload, currentBagValue);
        let remaining = 0;
        let taken = 0;
        let consumed = 0;
        let returned = 0;
        if (payload.entry_type === "taken") {
            remaining = Number(currentBagValue) + Number(payload.entry_value);
            taken = Number(payload.taken) + Number(payload.entry_value);
            consumed = Number(payload.consumed);
            returned = Number(payload.returned);
        } else if (payload.entry_type === "consumed") {
            remaining = Number(currentBagValue) - Number(payload.entry_value);
            consumed = Number(payload.consumed) + Number(payload.entry_value);
            taken = Number(payload.taken);
            returned = Number(payload.returned);
        } else if (payload.entry_type === "returned") {
            remaining = Number(currentBagValue) - Number(payload.entry_value);
            returned = Number(payload.returned) + Number(payload.entry_value);
            taken = Number(payload.taken);
            consumed = Number(payload.consumed);
        } else {
            throw ("Invalid entry type")
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
        throw (`${error}`)
    }
}

const addEntry = async (payload, res, next) => {
    try {
        let remaining = 0;
        let product = await Product.findById(payload.product_id)
        let user = await User.findById(payload.user_id);
        let stock = await Stock.findOne({ product_id: payload.product_id, user_id: payload.user_id });
        console.log(stock, "stock>>>>>>>>>>>")
        const calculatedBagValues = getBagValue(payload, stock.bag_value, res);
        console.log(calculatedBagValues, "calculatedBagValues>>>")
        stock.bag_value = calculatedBagValues.remaining;
        let stockSave = await stock.save();
        console.log(moment(payload.created_at, "DD-MM-YYYY").utc().toISOString())

        const entry = new Entry({
            _id: new mongoose.Types.ObjectId(),
            user_id: payload.user_id,
            product_id: payload.product_id,
            product_name: product.name,
            user_name: user.name,
            entry_type: payload.entry_type,
            entry_value: payload.entry_value,
            taken: calculatedBagValues.taken,
            consumed: calculatedBagValues.consumed,
            returned: calculatedBagValues.returned,
            remaining: Number(calculatedBagValues.remaining),
            created_date: moment().utc().toISOString(),
            created_at: moment(payload.created_at, "DD-MM-YYYY").utc().toISOString(),
            created_timestamp: moment().utc().format("X")
        });
        return { remaining: calculatedBagValues.remaining, entry: entry };
    } catch (error) {
        res.status(400).json(formatResponse(false, `${error}`));
    }
}

router.get(("/"), async (req, res, next) => {
    try {
        const entries = await Entry.find({ product_name: "p4", user_name: "t2" }).sort({ created_at: 'asc' }).exec();
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
        // console.log(moment(req.body.created_at,"DD-MM-YYYY").utc().toISOString())
        let entryPayload = {}
        const payload = req.body;
        let currentEntry = await Entry.findOne({
            user_id: payload.user_id,
            product_id: payload.product_id,
            created_at: moment(payload.created_at, "DD-MM-YYYY").utc().toISOString()
        })

        const futureEntries = await Entry.find({
            user_id: payload.user_id,
            product_id: payload.product_id,
            created_at: { $gt: moment(payload.created_at, "DD-MM-YYYY").utc().toISOString() }
        })

        let previousEntries = await Entry.find({
            user_id: payload.user_id,
            product_id: payload.product_id,
            created_at: { $lt: moment(payload.created_at, "DD-MM-YYYY").utc().toISOString() }
        }).sort({ created_at: "asc" }).exec();

        let prevBagValue = null;
        if (!(isEmpty(futureEntries))) {
            let stock = await Stock.find({ user_id: payload.user_id, product_id: payload.product_id });
            stock.bag_value = previousEntries.slice(-1)[0].remaining;
            prevBagValue = previousEntries.slice(-1)[0].remaining;
            const saveStock = await stock.save();
        }
        console.log(prevBagValue,"prevBagValue>>>>>>>>>>");
        let isCurrentEntryEmpty = isEmpty(currentEntry)
        if (!(isEmpty(currentEntry))) {
            entryPayload = {
                ...payload,
                taken: currentEntry.taken,
                consumed: currentEntry.consumed,
                returned: currentEntry.returned,
                remaining: currentEntry.remaining
            }
        } else {
            entryPayload = {
                ...payload,
                taken: 0,
                consumed: 0,
                remaining: 0,
                returned: 0
            }
            // currentEntry = [];
            // currentEntry.push(entryPayload);
        }
        // console.log(currentEntry,"current")
        const totalEntries = [entryPayload, ...futureEntries];
        console.log(totalEntries, "total");
        let rowsToBeInserted = totalEntries.reduce((acc, item, index) => {
            let updatedItem = [];
            console.log(item, "item>>>>>>>>>>.")
            if (index === 0) {
                // item["entry_type"] = payload.entry_type;
                // item["entry_value"] = payload.entry_value;
                updatedItem = {
                    ...item._doc,
                    ...getBagValue(entryPayload, prevBagValue || 0),
                }
            } else {
                updatedItem = {
                    ...item._doc,
                    ...getBagValue(item._doc, acc[index - 1].remaining),
                }
            }
            console.log(updatedItem, "update")
            acc.push(updatedItem);
            return acc;
        }, []);

        let offsetToBeAdded = rowsToBeInserted[0].remaining - entryPayload.remaining;
        // if(isCurrentEntryEmpty){
        //     currentEntry.pop();
        // }
        // currentEntry.splice(1,1);
        console.log(rowsToBeInserted, "rowsToBeInserted>>>>>>>>>.");
        console.log(currentEntry);
        const entriesToBeInserted = rowsToBeInserted.filter((item, index) => index !== 0);
        const entriesToBeDeleted = entriesToBeInserted.map((item) => item._id);

        const entriesToBeUpdated = rowsToBeInserted.filter((item, index) => index !== 0).map((item) => item._id);
        console.log(entriesToBeUpdated);
        // return false
        if (!(isCurrentEntryEmpty)) {
            entryPayload = {
                ...req.body,
                taken: currentEntry.taken,
                consumed: currentEntry.consumed,
                returned: currentEntry.returned,
                remaining: currentEntry.remaining
            }
            const result = await addEntry(entryPayload, res, next);
            console.log(result,"result>>>>>.")
            const updateEntry = await Entry.updateOne({ _id: currentEntry._id }, {
                $set: {
                    remaining: result.remaining,
                    taken: result.entry.taken,
                    consumed: result.entry.consumed,
                    returned: result.entry.returned
                }
            });
            console.log(entriesToBeInserted);
            return false;
            const deletedEntries = await Entry.deleteMany({ _id: { $in: entriesToBeDeleted } });
            const insertedRows = await Entry.insertMany(entriesToBeInserted);
            console.log(result, "result>>>>>>>>>>>>>>>>>>>>.")
            // let stock = await Stock.findOne({ product_id: payload.product_id, user_id: payload.user_id });
            // stock.remaining =  result.remaining;
            // let saveStock = await stock.save();
            res.status(201).json(formatResponse(true, "entry updated successfully", { updatedEntry: updateEntry }));
        } else {
            entryPayload = {
                ...req.body,
                taken: 0,
                consumed: 0,
                remaining: 0,
                returned: 0
            }
            const result = await addEntry(entryPayload, res, next)
            const saveEntry = await result.entry.save();
            console.log(entriesToBeInserted,"resul>>>>>>>>.");
            return false
            const deletedEntries = await Entry.deleteMany({ _id: { $in: entriesToBeDeleted } });
            const insertedRows = await Entry.insertMany(entriesToBeInserted);
            // await Entry.find({ _id: { $in: entriesToBeUpdated } }).forEach((doc) => {
            //     Entry.update({ _id: doc._id }, { set: { remaining: doc.remaining + offsetToBeAdded } })
            // })
            // Entry.aggregate([
            //     { $match: { _id: { $in: entriesToBeUpdated } } },
            //     {
            //         $set: { remaining: { $add: ["$remaining", "7"] } }
            //     }
            // ]);

        //             let test = await Entry.aggregate(
        //     [
        //                      { $match: { _id: { $in: entriesToBeUpdated } } },

        //         { $project: {
        //             total: { $sum: ["$remaining", 7] }
        //         }}
        //     ]
        // )
        // console.log(test,"dekh bhai");
            // const updateFutureEntries = await Entry.updateMany({ _id: { $in: entriesToBeUpdated } },{$set: { 
            //     remaining: $this.remaining + Number(offsetToBeAdded)
            // }});

            //test
            // console.log(SortedEntries);
            // if(!(isEmpty(SortedEntries))){
            //    const test = SortedEntries.reduce((acc,item,index) =>{
            //        updatedItem = {...item,remaining:result.remaining}
            //    },[]);
            //    console.log(test,"test>>>>>>>>>>>>>");
            // }

            res.status(201).json(formatResponse(true, "entry created successfully", { createdEntry: saveEntry }));
        }

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
            const recordsTobeDeleted = rowsToBeInserted.map((item) => {
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