const {Router} = require("express")
const UserModel = require("../db/schema/user")
const router = Router();
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken")


router.post('/signup', async(req, res) => {

    const email = req.body.email;
    const password = req.body.password;
    const username = req.body.username;

    try {
        const user = await UserModel.findOne(
            { email: email  } || {username :username}
        );
        console.log(user);
        if (user) {
          throw new Error('Email already exit');
        }

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(req.body.password, salt);

        const token = jwt.sign({email:email ,username:username} ,process.env.SCT)
        
        const newUser = await UserModel.create({
            email:email,
            username:username,
            password:hash,
            token : token
        })
        const { password, ...userData } = newUser._doc;
        res.status(200).send(userData);

      } catch (error) {
        
        console.error('Error finding user:', error.message);
        throw error;
      }

});

router.post('/signin', async(req, res) => {

    
    
    try {
        const email = req.body.email;
        const originalpassword = req.body.password;
        const user = await UserModel.findOne(
            {email :email} 
        );
        if (!user) {
          throw new Error('Email not found');
        }
       
        
        const verify = await bcrypt.compare(originalpassword,user.password)
        !verify && res.status(500).send("Password is incorrect");

        const userId = user._id
        const token = jwt.sign({id : userId} ,process.env.SCT)
        res.send(token)

      } catch (error) {
        
        console.error('Error finding user:', error.message);
        throw error;
      }

});

module.exports = router