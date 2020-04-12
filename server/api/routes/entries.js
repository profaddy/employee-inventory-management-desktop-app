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
        let remaining = 0;
        let taken = 0;
        let consumed = 0;
        let returned = 0;
        if (payload.entry_type === "taken") {
            remaining = Number(currentBagValue) + Number(payload.taken) + Number(payload.entry_value) - Number(payload.consumed) - Number(payload.returned);
            taken = Number(payload.taken) + Number(payload.entry_value);
            consumed = Number(payload.consumed);
            returned = Number(payload.returned);
        } else if (payload.entry_type === "consumed") {
            remaining = Number(currentBagValue) + Number(payload.taken) - (Number(payload.consumed) + Number(payload.entry_value)) - Number(payload.returned);
            consumed = Number(payload.consumed) + Number(payload.entry_value);
            taken = Number(payload.taken);
            returned = Number(payload.returned);
        } else if (payload.entry_type === "returned") {
            remaining = Number(currentBagValue) + Number(payload.taken) - Number(payload.consumed) - (Number(payload.entry_value) + Number(payload.returned));
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

getEditBagValue = (payload, currentBagValue) => {
    try {
        let remaining = 0;
        let taken = 0;
        let consumed = 0;
        let returned = 0;
        remaining = Number(currentBagValue) + Number(payload.taken) - Number(payload.consumed) - Number(payload.returned);
        taken = Number(payload.taken)
        consumed = Number(payload.consumed);
        returned = Number(payload.returned);
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
        let calculatedBagValues = {};
        let product = await Product.findById(payload.product_id)
        let user = await User.findById(payload.user_id);
        let stock = await Stock.findOne({ product_id: payload.product_id, user_id: payload.user_id });
        if (payload.entry_mode === "edit") {
            calculatedBagValues = getEditBagValue(payload, stock.bag_value, res);
        } else if (payload.entry_mode === "add") {
            calculatedBagValues = getBagValue(payload, stock.bag_value, res);
        } else {
            throw ("Invalid entry mode")
        }
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

router.get(("/:user_id/:created_at"), async(req,res,next) => {
    try{
        const { user_id,created_at } = req.params;
        const created_value = moment(created_at, "DD-MM-YYYY").utc().toISOString();
        const agregateEntries = await Entry.aggregate([
            {$match:{
                user_id:user_id,
                created_at: {$lte:new Date(created_value)}
            }
        },
        {$sort: {created_at: 1}},
            {$group:{
                _id:"$product_id",
                taken:{$sum: "$taken"},
                consumed:{$sum:"$consumed"},
                returned:{$sum:"$returned"},
                remaining:{"$last":"$remaining"}
            }},
       ])
        const getAggregate = (id) => {
        const filteredentries = agregateEntries.filter((item) => {
            return id == item._id
        })
           return filteredentries;
        }

        const products = await Product.find();
        const filteredEntries = products.reduce( (acc,item,index) => {
            const data = getAggregate((item._id));
            let updated_item = {}
            if(isEmpty(data)){
                updated_item = {
                    product_name:item.name,
                    taken:0,
                    consumed:0,
                    returned:0,
                    remaining:0
                }
            }else{
                updated_item = {
                    product_name:item.name,
                    taken:data[0].taken,
                    consumed:data[0].consumed,
                    returned:data[0].returned,
                    remaining:data[0].remaining
                }
            }
            acc.push(updated_item);
            return acc;
        },[]);        
        res.status(200).json(formatResponse(true, "entries retrieved successfully", { filteredEntries: filteredEntries }));
    } catch (error) {
        res.status(500).json(formatResponse(false, `error occured while retrieving entries: ${error}`))
    }
})
router.get(("/"), async (req, res, next) => {
    try {
        const entries = await Entry.find().sort({ created_at: 'asc' }).exec();
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
        let prevBagValue = null;
        let entryPayload = {}
        let isFutureEntriesPresent = !(isEmpty(futureEntries));
        let isCurrentEntryPresent = !(isEmpty(currentEntry));
        if (isCurrentEntryPresent) {
            entryPayload = {
                ...payload,
                taken: currentEntry.taken,
                consumed: currentEntry.consumed,
                remaining: currentEntry.remaining,
                returned: currentEntry.returned
            }
        } else {
            entryPayload = {
                ...payload,
                taken: 0,
                consumed: 0,
                remaining: 0,
                returned: 0
            }
        }

        let previousEntries = await Entry.find({
            user_id: payload.user_id,
            product_id: payload.product_id,
            created_at: { $lt: moment(payload.created_at, "DD-MM-YYYY").utc().toISOString() }
        }).sort({ created_at: "asc" }).exec();
        let stock = await Stock.findOne({ user_id: payload.user_id, product_id: payload.product_id });
        if (!(isEmpty(previousEntries))) {
            stock.bag_value = previousEntries.slice(-1)[0].remaining;
            prevBagValue = previousEntries.slice(-1)[0].remaining;
            const saveStock = await stock.save();
        } else {
            prevBagValue = 0;
            stock.bag_value = prevBagValue
            const saveStock = await stock.save();
        }
        if (isFutureEntriesPresent) {
            const result = await addEntry(entryPayload, res, next);
            const getAndValidateRemainingValue = (offset, currentValue) => {
                remaining = currentValue + offset
                if (remaining < 0) {
                    throw ("unable to update future entries")
                } else {
                    return remaining;
                }
            }
            const rowsToBeInserted = futureEntries.reduce((acc, item, index) => {
                let updatedItem = [];
                const offset = result.remaining - entryPayload.remaining
                if (index === 0) {
                    updatedItem = {
                        ...item._doc,
                        remaining: getAndValidateRemainingValue(offset, item._doc.remaining)
                    }
                } else {
                    updatedItem = {
                        ...item._doc,
                        remaining: getAndValidateRemainingValue(offset, item._doc.remaining)
                    }
                }
                acc.push(updatedItem);
                return acc;
            }, []);
            if (isCurrentEntryPresent) {
                const updateEntry = await Entry.updateOne({ _id: currentEntry._id }, {
                    $set: {
                        remaining: result.remaining,
                        taken: result.entry.taken,
                        consumed: result.entry.consumed,
                        returned: result.entry.returned
                    }
                });
            } else {
                const saveEntry = await result.entry.save();
            }
            stock.bag_value = Number(rowsToBeInserted.slice(-1)[0].remaining);
            stock.save();
            const entriesToBeDeleted = rowsToBeInserted.map((item) => item._id);
            const deletedEntries = await Entry.deleteMany({ _id: { $in: entriesToBeDeleted } });
            const insertedRows = await Entry.insertMany(rowsToBeInserted);
            res.status(201).json(formatResponse(true, "entry updated successfully", { insertedEntries: insertedRows }));
        } else {
            const result = await addEntry(entryPayload, res, next);
            if (isCurrentEntryPresent) {
                const updateEntry = await Entry.updateOne({ _id: currentEntry._id }, {
                    $set: {
                        remaining: result.remaining,
                        taken: result.entry.taken,
                        consumed: result.entry.consumed,
                        returned: result.entry.returned
                    }
                });
                res.status(201).json(formatResponse(true, "entry updated successfully", { createdEntry: updateEntry }));
            } else {
                const saveEntry = await result.entry.save();
                res.status(201).json(formatResponse(true, "entry created successfully", { createdEntry: saveEntry }));

            }
        }

    } catch (error) {
        res.status(500).json(formatResponse(false, `error while creating entry: ${error}`));
    }
});

router.put(("/"), async (req, res, next) => {
    try {
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
        let prevBagValue = null;
        let entryPayload = {}
        let isFutureEntriesPresent = !(isEmpty(futureEntries));
        let isCurrentEntryPresent = !(isEmpty(currentEntry));
        if (isCurrentEntryPresent) {
            entryPayload = {
                ...payload,
                taken: payload.taken,
                consumed: payload.consumed,
                remaining: payload.remaining,
                returned: payload.returned
            }
        } else {
            throw ("entry not present")
        }

        let previousEntries = await Entry.find({
            user_id: payload.user_id,
            product_id: payload.product_id,
            created_at: { $lt: moment(payload.created_at, "DD-MM-YYYY").utc().toISOString() }
        }).sort({ created_at: "asc" }).exec();
        let stock = await Stock.findOne({ user_id: payload.user_id, product_id: payload.product_id });
        if (!(isEmpty(previousEntries))) {
            stock.bag_value = previousEntries.slice(-1)[0].remaining;
            prevBagValue = previousEntries.slice(-1)[0].remaining;
            const saveStock = await stock.save();
        } else {
            prevBagValue = 0;
            prevBagValue = 0;
            stock.bag_value = prevBagValue
            // stock.bag_value =  previousEntries.slice(-1)[0].remaining;
            const saveStock = await stock.save();
        }

        if (isFutureEntriesPresent) {
            const result = await addEntry(entryPayload, res, next);
            const getAndValidateRemainingValue = (offset, currentValue) => {
                remaining = currentValue + offset
                if (remaining < 0) {
                    throw ("unable to update future entries")
                } else {
                    return remaining;
                }
            }
            const rowsToBeInserted = futureEntries.reduce((acc, item, index) => {
                let updatedItem = [];
                const offset = result.remaining - entryPayload.remaining
                if (index === 0) {
                    updatedItem = {
                        ...item._doc,
                        remaining: getAndValidateRemainingValue(offset, item._doc.remaining)
                    }
                } else {
                    updatedItem = {
                        ...item._doc,
                        remaining: getAndValidateRemainingValue(offset, item._doc.remaining)
                    }
                }
                acc.push(updatedItem);
                return acc;
            }, []);
            if (isCurrentEntryPresent) {
                const updateEntry = await Entry.updateOne({ _id: currentEntry._id }, {
                    $set: {
                        remaining: result.remaining,
                        taken: result.entry.taken,
                        consumed: result.entry.consumed,
                        returned: result.entry.returned
                    }
                });
            } else {
                const saveEntry = await result.entry.save();

            }
            stock.bag_value = Number(rowsToBeInserted.slice(-1)[0].remaining);
            stock.save();
            const entriesToBeDeleted = rowsToBeInserted.map((item) => item._id);
            const deletedEntries = await Entry.deleteMany({ _id: { $in: entriesToBeDeleted } });
            const insertedRows = await Entry.insertMany(rowsToBeInserted);
            res.status(201).json(formatResponse(true, "entry updated successfully", { insertedEntries: insertedRows }));
        } else {
            const result = await addEntry(entryPayload, res, next);
            if (isCurrentEntryPresent) {
                const updateEntry = await Entry.updateOne({ _id: currentEntry._id }, {
                    $set: {
                        remaining: result.remaining,
                        taken: result.entry.taken,
                        consumed: result.entry.consumed,
                        returned: result.entry.returned
                    }
                });
                res.status(201).json(formatResponse(true, "entry updated successfully", { createdEntry: updateEntry }));
            } else {
                const saveEntry = await result.entry.save();
                res.status(201).json(formatResponse(true, "entry created successfully", { createdEntry: saveEntry }));

            }
        }

    } catch (error) {
        res.status(500).json(formatResponse(false, `error while creating entry: ${error}`));
    }
});

router.delete(("/"), async (req, res, next) => {
    try {
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
        let prevBagValue = null;
        let entryPayload = {}
        let isFutureEntriesPresent = !(isEmpty(futureEntries));
        let isCurrentEntryPresent = !(isEmpty(currentEntry));
        if (isCurrentEntryPresent) {
            entryPayload = {
                ...payload,
                taken: 0,
                consumed: 0,
                remaining: payload.remaining,
                returned: 0
            }
        } else {
            throw ("entry not present")
        }

        let previousEntries = await Entry.find({
            user_id: payload.user_id,
            product_id: payload.product_id,
            created_at: { $lt: moment(payload.created_at, "DD-MM-YYYY").utc().toISOString() }
        }).sort({ created_at: "asc" }).exec();
        let stock = await Stock.findOne({ user_id: payload.user_id, product_id: payload.product_id });
        if (!(isEmpty(previousEntries))) {
            stock.bag_value = previousEntries.slice(-1)[0].remaining;
            prevBagValue = previousEntries.slice(-1)[0].remaining;
            const saveStock = await stock.save();
        } else {
            prevBagValue = 0;
            stock.bag_value = prevBagValue
            // stock.bag_value =  previousEntries.slice(-1)[0].remaining;
            const saveStock = await stock.save();
        }

        if (isFutureEntriesPresent) {
            const result = await addEntry(entryPayload, res, next);
            const getAndValidateRemainingValue = (offset, currentValue) => {
                remaining = currentValue + offset
                if (remaining < 0) {
                    throw ("unable to update future entries")
                } else {
                    return remaining;
                }
            }
            const rowsToBeInserted = futureEntries.reduce((acc, item, index) => {
                let updatedItem = [];
                const offset = result.remaining - entryPayload.remaining
                if (index === 0) {
                    updatedItem = {
                        ...item._doc,
                        remaining: getAndValidateRemainingValue(offset, item._doc.remaining)
                    }
                } else {
                    updatedItem = {
                        ...item._doc,
                        remaining: getAndValidateRemainingValue(offset, item._doc.remaining)
                    }
                }
                acc.push(updatedItem);
                return acc;
            }, []);
            if (isCurrentEntryPresent) {
                const updateEntry = await Entry.updateOne({ _id: currentEntry._id }, {
                    $set: {
                        remaining: result.remaining,
                        taken: result.entry.taken,
                        consumed: result.entry.consumed,
                        returned: result.entry.returned
                    }
                });
            } else {
                const saveEntry = await result.entry.save();

            }
            stock.bag_value = Number(rowsToBeInserted.slice(-1)[0].remaining);
            stock.save();
            const entriesToBeDeleted = rowsToBeInserted.map((item) => item._id);
            const deletedEntries = await Entry.deleteMany({ _id: { $in: entriesToBeDeleted } });
            const insertedRows = await Entry.insertMany(rowsToBeInserted);
            const deletedEntry = await Entry.deleteOne({_id:payload._id})
            res.status(201).json(formatResponse(true, "entry updated successfully", { insertedEntries: deletedEntry }));
        } else {
            const result = await addEntry(entryPayload, res, next);
            if (isCurrentEntryPresent) {
                const updateEntry = await Entry.updateOne({ _id: currentEntry._id }, {
                    $set: {
                        remaining: result.remaining,
                        taken: result.entry.taken,
                        consumed: result.entry.consumed,
                        returned: result.entry.returned
                    }
                });
                const deletedEntry = await Entry.deleteOne({_id:payload._id})
                res.status(201).json(formatResponse(true, "entry deleted successfully", { createdEntry: deletedEntry }));
            } else {
                const saveEntry = await result.entry.save();
                const deletedEntry = await Entry.deleteOne({_id:payload._id})
                res.status(201).json(formatResponse(true, "entry deleted successfully", { createdEntry: deletedEntry }));

            }
        }

    } catch (error) {
        res.status(500).json(formatResponse(false, `error while creating entry: ${error}`));
    }
});



// router.delete(("/:entryId"), async (req, res, next) => {
//     try {
//         throw("work in progress");
//         return false;
//         const getSelectedItem = await Entry.findOne({ _id: req.params.entryId });
//         let sortedEntries = await Entry.find({
//             user_id: getSelectedItem.user_id,
//             product_id: getSelectedItem.product_id,
//             created_date: { $gte: getSelectedItem.created_date }
//         }).sort({ created_date: 'asc' }).exec()
//         if (sortedEntries.length !== 0) {
//             let prevBagValue = null;
//             if (sortedEntries.length !== 0 && sortedEntries[0].entry_type === "taken") {
//                 prevBagValue = sortedEntries[0].remaining - sortedEntries[0].taken
//             } else {
//                 prevBagValue = sortedEntries[0].remaining + sortedEntries[0][sortedEntries[0]["entry_type"]]
//             }
//             if (prevBagValue < 0) {
//                 throw ("Negative stock")
//             }
//             const rowsToBeInserted = sortedEntries.reduce((acc, item, index) => {
//                 let updatedItem = [];
//                 if (index === 0) {
//                     item["entry_type"] = 0
//                     item["entry_value"] = 0
//                     updatedItem = {
//                         ...item._doc,
//                         ...getBagValue(item._doc, prevBagValue),
//                     }
//                 } else {
//                     updatedItem = {
//                         ...item._doc,
//                         ...getBagValue(item._doc, acc[index - 1].remaining),
//                     }
//                 }
//                 acc.push(updatedItem);
//                 return acc;
//             }, []);
//             const stock = await Stock.findOne({ product_id: sortedEntries[0].product_id, user_id: sortedEntries[0].user_id })
//             const lastRecord = rowsToBeInserted.slice()[0];
//             stock.bag_value = lastRecord.remaining;
//             const saveStock = await stock.save();
//             const recordsTobeDeleted = rowsToBeInserted.map((item) => {
//                 return item._id
//             });
//             const deletedEntries = await Entry.deleteMany({ _id: { $in: recordsTobeDeleted } });
//             const insertedRows = await Entry.insertMany(rowsToBeInserted);
//             res.status(201).json(formatResponse(true, `entrr deleted successfully`));
//         } else {
//             res.status(400).json(formatResponse(false, "no matching records found"))
//         }
//     } catch (error) {
//         res.status(400).json(formatResponse(false, `${error}`))
//     }
// });
module.exports = router;