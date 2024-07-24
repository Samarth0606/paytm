const express = require('express');
const { authMiddleware } = require('../middleware');
const User = require('../models/User');
const mongoose = require('mongoose');
const Transaction = require('../models/Transaction');
const router = express.Router();

// getting balance
router.get('/balance' , authMiddleware,  async(req,res)=>{
    // console.log(req.user , "id")
    let founduser = await User.findById(req.user);
    // console.log(founduser , "user")
    res.status(200).json({balance:founduser.balance})
})

// transaction toan account
router.post('/transfer' ,authMiddleware, async(req,res)=>{
    try{
        const session = await mongoose.startSession();
        session.startTransaction();
        const { amount, to } = req.body;
        let userAccount = await User.findById(req.user).session(session);

        if(!userAccount && userAccount.balance < amount){
            await session.abortTransaction();
            return res.status(400).json({
                message: "Insufficient balance"
            });
        }
        const toAccount = await User.findOne({ _id: to }).session(session);
    
        if (!toAccount || toAccount.id === userAccount.id) {
            console.log("lolipop")
            await session.abortTransaction();
            return res.status(400).json({
                message: "Invalid account"
            });
        }

        // Perform the transfer
        await User.findByIdAndUpdate(req.user ,{ $inc: { balance: -amount } }).session(session);
        await User.findByIdAndUpdate(to ,{ $inc: { balance: +amount } }).session(session);
        await Transaction.create([{amount, senders_id:req.user , receiver_id: to } ], { session: session })
    
        // Commit the transaction
        await session.commitTransaction();
        res.json({
            message: "Amount transferred successfully"
        });

    }
    catch(err){
        return res.status(500).json({
            message: err
        });
    }
    

})

module.exports = router;