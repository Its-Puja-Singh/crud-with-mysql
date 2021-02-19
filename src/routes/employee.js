const express = require('express');

const router = express.Router();

const {requireSignin} = require('../middleware/auth');
const {signUp, signIn, signOut, createEmployee, updateEmployee, deleteEmployee, viewAllEmployee} = require('../controller/employee');
const db = require('../db/db');

//require localStorage
if(typeof localStorage === 'undefined'|| localStorage == null) {
    const LocalStorage = require('node-localstorage').LocalStorage;
    localstorage = new LocalStorage('./scratch');
}



//for signin
router.get('/signIn', (req,res)=>{
    const loginUser=localstorage.getItem('loginUser');
    res.render('signIn', {message:'', loginUser:loginUser});
});
router.post('/signIn', signIn);



//for signup
router.get('/signUp', (req,res)=>{
    const loginUser=localstorage.getItem('loginUser');
    res.render('signUp', {message:'', err:'', loginUser:loginUser});
});
router.post('/signUp', signUp);



//for signout
router.get('/signOut', signOut);



// for creating an employee
router.get('/createEmployee', requireSignin, (req,res)=>{
    const loginUser=localstorage.getItem('loginUser');
    res.render('createEmployee', {message:'', err:'',loginUser:loginUser});
})
router.post('/createEmployee', createEmployee);




// for updating an employee
router.get('/updateEmployee', requireSignin, (req,res)=>{
    const loginUser=localstorage.getItem('loginUser');
    const id = req.query.id;
    let sql="SELECT * FROM employee WHERE id = '"+id+"'";
    db.query(sql, (err, result)=>{
        if(err) throw err;
        res.render('updateEmployee', {message:'', result:result, loginUser:loginUser});
    });
});
router.post('/updateEmployee', requireSignin, updateEmployee);



//to view the list of employees
router.get('/employee', requireSignin, viewAllEmployee);



//for deleting an employee
router.get('/deleteEmployee', requireSignin, deleteEmployee);



module.exports = router;
