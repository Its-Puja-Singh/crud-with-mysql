const express = require('express');

const router = express.Router();

const {requireSignin} = require('../middleware/auth');
const {signUp, signIn, createEmployee, updateEmployee, deleteEmployee, viewAllEmployee} = require('../controller/employee');


router.get('/', (req,res)=>{
    res.render('index', {message:''});
});

//for signin
router.get('/api/signin', (req,res)=>{
    res.render('signIn', {message:''});
});
router.post('/signIn', signIn);

//for signup
router.get('/api/signup', (req,res)=>{
    res.render('signUp', {message:'', err:''});
});
router.post('/signUp', signUp);

// for creating an employee
router.post('/createEmployee', requireSignin, createEmployee);

// for updating an employee
router.post('/updateEmployee/:id', requireSignin, updateEmployee);

//to view the list of employees
router.get('/employee',requireSignin, viewAllEmployee);

//for deleting an employee
router.delete('/deleteEmployee/:id', requireSignin, deleteEmployee);

module.exports = router;
