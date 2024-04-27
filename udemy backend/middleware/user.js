const jwt = require("jsonwebtoken")

const getUser = async(req ,res ,next)=>{
    const token = req.headers.token
    !token && res.status(400).send("login first to get the token")

    try{
        console.log(token);
        const verify = jwt.verify(token , process.env.SCT)
        req.user = verify;
        console.log(req.user);
        next();

    }catch(error){
        res.status(500).send(error)
    }
  
}
module.exports = getUser