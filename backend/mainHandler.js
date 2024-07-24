const express = require('express');
const router = express.Router();
const user = require('./routes/user')
const account = require('./routes/transaction')

router.use('/user' , user);
router.use('/transaction' , account);


module.exports = router;