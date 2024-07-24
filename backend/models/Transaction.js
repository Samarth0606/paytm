
const mongoose = require('mongoose');


const transactionSchema = new mongoose.Schema({
    amount:{
        type:Number,
        min:0,
        max:10000,
        required:true,
    },
    receiver_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    senders_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }
})

const Transaction = mongoose.model('Transaction',transactionSchema);
module.exports = Transaction;


