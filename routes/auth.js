const router = require('express').Router()
const User = require('../models/userModel')
const bcrypt = require('bcrypt')

//Register
router.post('/register', async (req,res) =>{
     try{
        //generating hashed password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password,salt);
        
        const newUser = new User({
            username: req.body.username,
            email:req.body.email,
            password: hashedPassword
        })
        
        //save user and respond
        const user = await newUser.save();
        res.status(200).json(user)

    }catch(error)
    {
       res.status(500).json(error)
    }
})

//Login
router.post('/login',async(req,res)=>{
    try{
        const user = await User.findOne({email : req.body.email})
        !user && res.status(404).json("user not found")
       
        const validPass = await bcrypt.compare(req.body.password,user.password)
        !validPass && res.status(400).json("wrong password")
        res.status(200).json(user)
    }catch(error)
    {
        res.status(500).json(error)
    }
    

})


module.exports = router