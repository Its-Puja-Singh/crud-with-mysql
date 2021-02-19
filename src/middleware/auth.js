const jwt = require('jsonwebtoken');

//require localStorage
if(typeof localStorage === 'undefined'|| localStorage == null) {
    const LocalStorage = require('node-localstorage').LocalStorage;
    localstorage = new LocalStorage('./scratch');
}


exports.requireSignin = (req, res,next) => {
    try {
        const token=localstorage.getItem('authorization');
        if(token){
            const user = jwt.verify(token, process.env.JWT_SECRET);
            next();
        }
        else{
             res.render('index', {alert:'Login required', loginUser:''});
        }
    } catch (e) {
        next(e);
    }
}