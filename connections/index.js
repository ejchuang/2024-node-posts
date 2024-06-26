const mongoose = require('mongoose');
const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" })
//console.log(process.env.PORT)
const DB = process.env.DATABASE.replace(
    '<password>', process.env.DATABASE_PASSWORD
)
// 連接資料庫 
mongoose.connect(DB)
    .then(() => {
        console.log('資料庫連線成功')
    })
    .catch((error) => {
        console.log(error);
    });

module.exports;