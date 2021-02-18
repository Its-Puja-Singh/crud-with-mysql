const bcrypt = require('bcrypt');
const db = require('../db/db');
const jwt = require('jsonwebtoken');
module.exports={
    createEmployee:(req, res, next) => {
        try {
            const {EmployeeCode, EmployeeName,EmployeeEmail}=req.body;

            //sql query
            let sql = "INSERT INTO `employee`(`EmployeeCode`, `EmployeeName`, `EmployeeEmail`) values('"+EmployeeCode +"', '"+ EmployeeName +"', '"+ EmployeeEmail+"')";

            db.query(sql, (err, result)=>{
                if(err) {
                    console.log(err);
                    res.status(400).json({err});
                }
                res.status(200).json({ 
                    message:'Employee created successfully', 
                    EmployeeName, 
                    EmployeeEmail
                });
            });
        } catch (e) {
            next(e);
        }
    },

    signUp: (req, res, next) => {
        try {
            const { name, email, password, repeatPassword}=req.body;
            let check ="select * from user where email = '"+email+"' ";
            db.query(check, (error, result)=>{
                if(error) {
                    return res.render('signUp', { message:'', err:'Some error occured!' });
                }
                else if(result.length>0){
                    return res.render('signUp', {message:'', err:'User already exists!'});
                }
                else{
                    const Hash_password = bcrypt.hashSync(password, 10);
    
                    //sql query
                    let sql = "INSERT INTO `user`(`name`, `email`, `Hash_password`) values('"+name +"', '"+ email +"', '"+Hash_password+"')";
        
                    db.query(sql, (error, result)=>{
                        if(error) {
                            return res.render('signUp', {message:'', err:'Some error occured!'});
                        }
                        return res.render('signUp', { message:'Signed up successfully', err:''});
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
            let sql = "select * from user where email = '"+email+"' ";
            db.query(sql, (err, result, fields)=>{
                console.log(result);
                if(err) {
                    console.log(err);
                    res.status(400).json({err});
                }
                else if(result.length>0) {
                    const user=result[0];
                    if(bcrypt.compareSync(password, user.Hash_password)){
                        const token =jwt.sign({id: user.id, name:user.name}, process.env.JWT_SECRET, {expiresIn :'1h'});
                        res.status(200).json({token:token, name:user.name, email:user.email});
                    }
                    else{
                        res.status(400).json({message:"Email or passowrd Incorrect"});
                    }
                }
                else{
                    res.status(400).json({"message":"User doesnot exist"});
                }
            });
        } catch (e) {
            next(e);
        }
    },
    updateEmployee: (req, res, next) => {
        try {
            const {id} =req.params; 
            const {EmployeeCode, EmployeeName, EmployeeEmail, IsActive} = req.body;

            let sql = "UPDATE employee SET EmployeeCode = '" + EmployeeCode + "', EmployeeName = '" + EmployeeName + "', EmployeeEmail = '" + EmployeeEmail+"', IsActive = '" + IsActive + "' where id='"+id+"' ";

            db.query(sql, (err, result)=>{
                if(err) {
                    console.log(err);
                    res.status(400).json({err});
                }
                res.status(200).json({ 
                    message:'Employee updated successfully',
                    EmployeeCode, 
                    EmployeeName, 
                    EmployeeEmail,
                    IsActive
                });
            });
            
        } catch (e) {
            next(e);
        }
    },
    deleteEmployee :(req, res, next) =>{
        try {
          const{id} = req.params;  
          
          let sql ="DELETE FROM employee WHERE id='"+id+"' ";
          db.query(sql, (err, result)=>{
            if(err) {
                console.log(err);
                res.status(400).json({err});
            }
            res.status(200).json({ 
                message:'Employee deleted successfully',
            });
        });
        } catch (e) {
            next(e);
        }
    },
    viewAllEmployee: (req, res, next) => {
        try {
            let sql = "SELECT * FROM employee";
            db.query(sql, (err, result, fields)=>{
                if(err) {
                    console.log(err);
                    return res.render('employee', { message:'Some error occured!', data:''});
                }
                return res.render('employee', { message:'', result: result });
            });
        } catch (e) {
            next(e);
        }
    }
}