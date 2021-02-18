const mysql = require('mysql');
const env = require('dotenv').config();

//create connection 
const db=mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: 'SoftAge',
});

//connecting to the databse
db.connect((err)=>{
    if(err){
        console.log(err);
    }
    console.log("Mysql connected");
});

module.exports = db;