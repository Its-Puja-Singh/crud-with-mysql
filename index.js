const express = require('express');

const env = require('dotenv').config()
const app = express();

const path = require('path');

//bodyparser
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended:false }));

app.use(express.json())

//require localStorage
if(typeof localStorage === 'undefined'|| localStorage == null) {
    const LocalStorage = require('node-localstorage').LocalStorage;
    localstorage = new LocalStorage('./scratch');
}

//setting up template engine
app.set('views', path.join(__dirname, 'src/views'));
app.set('view engine', 'ejs');

// rendering the home page
app.get('/api/home', (req,res)=>{
    const loginUser=localstorage.getItem('loginUser');
    res.render('index', {alert:'', loginUser: loginUser});
});

//require routes
const employeRoutes = require('./src/routes/employee');

//using routes
app.use('/api',employeRoutes ),



app.listen(process.env.PORT, ()=>{
    console.log('Server listening on port 3000');
});
