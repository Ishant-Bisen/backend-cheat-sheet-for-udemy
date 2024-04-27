const jwt = require("jsonwebtoken")

const getAdmin = async(req ,res ,next)=>{
    const token = req.headers.token
    !token && res.status(400).send("login first to get the token")

    try{
        const admin = jwt.verify(token , process.env.SCT)
        !admin && res.status(400).send("token invalid")
        req.admin = admin;
        next();

    }catch(error){
        res.status(500).send(error)
    }
    
}
module.exports = getAdmin
