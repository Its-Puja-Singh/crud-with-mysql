const bcrypt = require('bcrypt');
const db = require('../db/db');
const jwt = require('jsonwebtoken');

//require localStorage
if(typeof localStorage === 'undefined'|| localStorage == null) {
    const LocalStorage = require('node-localstorage').LocalStorage;
    localstorage = new LocalStorage('./scratch');
}

module.exports={
    createEmployee:(req, res, next) => {
        try {
            const {EmployeeCode, EmployeeName,EmployeeEmail}=req.body;

            const loginUser=localstorage.getItem('loginUser');

            let check = "select * from employee where employeeCode='"+EmployeeCode+"'";
            db.query(check, (err, result)=>{
                if(err) throw err;
                else if(result.length>0){
                    res.render('createEmployee', {message:'Employee already exists', err:'', loginUser:loginUser});
                }
                else{
                    //sql query
                    let sql = "INSERT INTO `employee`(`EmployeeCode`, `EmployeeName`, `EmployeeEmail`) values('"+EmployeeCode +"', '"+ EmployeeName +"', '"+ EmployeeEmail+"')";

                    db.query(sql, (err, result)=>{
                        if(err) throw err;
                        res.render('createEmployee', {message:'Employee created successfully', err:'', loginUser:loginUser});
                    });
                }
            });
        } catch (e) {
            next(e);
        }
    },

    signUp: (req, res, next) => {
        try {
            const { name, email, password, repeatPassword}=req.body;

            const loginUser=localstorage.getItem('loginUser');

            if(password != repeatPassword){
                res.render('signUp', {message:'', err:'Passowrd doesnot match!',loginUser:loginUser});
            }

            //query to check if the employee is already registered
            let check ="select * from user where email = '"+email+"' ";
            
            db.query(check, (error, record)=>{
                if(error) throw error;

                else if(record.length>0){
                    res.render('signUp', {message:'', err:'User already exists!', loginUser:loginUser});
                }

                else{
                    const Hash_password = bcrypt.hashSync(password, 10);
    
                    //sql query to register the user
                    let sql = "INSERT INTO `user`(`name`, `email`, `Hash_password`) values('"+name +"', '"+ email +"', '"+Hash_password+"')";
        
                    db.query(sql, (error, result)=>{
                        if(error) throw error;

                        res.render('signUp', { message:'Signed up successfully', err:'', loginUser:loginUser});
                    });
                }
            });
        } catch (e) {
            next(e);
        }
    },
    
    signIn: (req, res, next) => {
        try {
            const {email, password} = req.body;
            
            const loginUser=localstorage.getItem('loginUser');

            let sql = "select * from user where email = '"+email+"' ";
            db.query(sql, (err, result)=>{
                if(err) throw error;
                else if(result.length>0) {
                    const user=result[0];
                    if(bcrypt.compareSync(password, user.Hash_password)){
                        const token =jwt.sign({id: user.id, name:user.name}, process.env.JWT_SECRET, {expiresIn :'1h'});
                        localstorage.setItem('authorization', token);
                        localstorage.setItem('loginUser', user.name);
                        res.redirect('/api/employee');
                    }
                    else{
                        res.render('signIn',{message:"Email or passowrd Incorrect", loginUser:loginUser});
                    }
                }
                else{
                    res.render('signIn',{message:"User doesnot exist", loginUser:loginUser});
                }
            });
        } catch (e) {
            next(e);
        }
    },
    signOut: (req, res, next) => {
        localstorage.removeItem('authorization');
        localstorage.removeItem('loginUser');
        res.redirect('/api/home');
    },
    updateEmployee: (req, res, next) => {
        try {
            const id = req.query.id; 
            const loginUser=localstorage.getItem('loginUser');
            const {EmployeeCode, EmployeeName, EmployeeEmail, isActive} = req.body;
            var IsActive = 0;
            if(isActive=="on") {
                IsActive = 1;
            }
            let sql = "UPDATE employee SET EmployeeCode = '" + EmployeeCode + "', EmployeeName = '" + EmployeeName + "', EmployeeEmail = '" + EmployeeEmail+"', IsActive = '" + IsActive + "' where id='"+id+"' ";

            db.query(sql, (err, record)=>{
                const result = [{
                    id:id,
                    EmployeeCode:EmployeeCode,
                    EmployeeName:EmployeeName,
                    EmployeeEmail:EmployeeEmail,
                }];
                if(err) throw err;
                res.render('updateEmployee',{message:'Employee updated successfully', result:result, loginUser:loginUser});
            });
            
        } catch (e) {
            next(e);
        }
    },
    deleteEmployee :(req, res, next) =>{
        try {
            const loginUser=localstorage.getItem('loginUser');
            const id = req.query.id;  
          
            let sql ="DELETE FROM employee WHERE id='"+id+"' ";
            db.query(sql, (err, record)=>{
                if(err) throw err;
                 
                let selectSql = "SELECT * from employee";
                db.query(selectSql, (err, result)=>{
                    if (err) throw err;
                    res.render('employee',{ message:'Employee deleted successfully', result: result, loginUser:loginUser});
                });
                
            });
        } catch (e) {
            next(e);
        }
    },
    viewAllEmployee: (req, res, next) => {
        try {
            const loginUser=localstorage.getItem('loginUser');
            
            let sql = "SELECT * FROM employee";
            db.query(sql, (err, result)=>{
                if(err) throw err;
                return res.render('employee', { message:'', result: result, loginUser:loginUser});
            });
        } catch (e) {
            next(e);
        }
    }
}