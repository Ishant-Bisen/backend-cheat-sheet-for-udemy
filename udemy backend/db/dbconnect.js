const mongoose = require('mongoose');

// Connection URI provided by MongoDB Atlas
const uri = "mongodb+srv://ishant2022bisen:sbTky2dZQU8rmJXm@cluster0.hpqlfkg.mongodb.net/";

// Connect to MongoDB Atlas

async function connectdb(){
    try{
        await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Connected to MongoDB Atlas')
    }catch(err){
        console.error(err);
    }
}

module.exports = connectdb