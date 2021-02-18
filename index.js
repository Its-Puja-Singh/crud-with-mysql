const express = require('express');

const env = require('dotenv').config()
const app = express();

const path = require('path');

// //bodyparser
// var bodyParser = require('body-parser');
// app.use(bodyParser.urlencoded({ extended:false }));

app.use(express.json())

//setting up template engine
app.set('views', path.join(__dirname, 'src/views'));
app.set('view engine', 'ejs');


app.get('/api/home', (req,res)=>{
    res.render('index', {message:''});
});
app.get('/api/signup', (req,res)=>{
    res.render('signUp', {message:''});
});
app.get('/api/signin', (req,res)=>{
    res.render('signIn', {message:''});
});

//require routes
const employeRoutes = require('./src/routes/employee');

//using routes
app.use('/api',employeRoutes ),



app.listen(process.env.PORT, ()=>{
    console.log('Server listening on port 3000');
});
