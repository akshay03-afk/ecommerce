const admin = require("../firebase/index");
const User = require("../models/userModel");   

exports.authCheck = async (req, res, next) => {
    //console.log(req.headers); 
    try {
        const firebaseUser = await admin
        .auth()
        .verifyIdToken(req.headers.authtoken);
        //console.log("Firebase user in authcheck", firebaseUser);     
        req.user = firebaseUser;
        next();
    } catch (err) {
        res.status(401).json({
            err: "invalid or expired token",
        })    
    } 
}

exports.adminCheck  = async (req, res, next ) => {
    const { email } = req.user;
    const admimUser = await User.findOne({
        email
    }).exec()

    if(admimUser.role !== "admin"){
        res.status(403).json({
            err: "Admin Resource. Access Denied"
        })
    }else{
        next();
    }
}