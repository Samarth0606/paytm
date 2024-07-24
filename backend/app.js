require('dotenv').config(); 
const express = require('express');
const app = express();
const mainHandler = require('./mainHandler');
const cors = require('cors'); 


app.use(cors({
    origin:["http://localhost:5050"]
}))
app.use(express.json()); 
//jsonwebtoken is left


const mongoose = require('mongoose');
mongoose.connect(process.env.DB_URI)
.then(()=>{
    console.log("DB CONNECTED")
})
.catch((err)=>{
    console.log("DB NOT CONNECTED" , err)
})


app.use('/api/v1',mainHandler);


let PORT = process.env.PORT || 8080;
app.listen(PORT , ()=>{
    console.log(`SERVER CONNECTED AT PORT: ${PORT}`);
})