const User = require('../models/userModel')
const router = require('express').Router()
const bcrypt = require('bcrypt')


//update user

router.put("/:id",async (req,res) =>{
        if(req.body.password){
            try{
                const salt =  await bcrypt.genSalt(10)
                req.body.password  = await bcrypt.hash(req.body.password,salt)

            }catch(err)
            {
                return res.status(500).json(err)
            }
        }
       
        try{
            const prev = await User.findById(req.params.id)
            const userData = {
                ...prev._doc,
                ...req.body
            }
           
            const user = await User.findByIdAndUpdate(req.params.id,{
                $set: userData
            }, {
                new: true, // Return the updated document
              })
            res.status(200).json(user)
        }catch(err)
        {
            return res.status(500).json(err)
        }

})

//delete user

router.delete("/:id",async (req,res) =>{
    if(req.body.userId === req.params.id ||req.body.isAdmin)
    {
       
        try{
            await User.deleteOne({_id: req.params.id})
            res.status(200).json("Account has been deleted successfully")
        }catch(err)
        {
            return res.status(500).json(err)
        }

    }else {
        return res.status(403).json("You can delete only your account")
    }
})

// get a user
//localhost:8800/users?userId=4444
//localhost:8800/users?username=sree
router.get('/',async (req,res)=>{
    const userId = req.query.userId;
    const username = req.query.username;
    try{
        const user = userId
        ? await User.findById(userId) 
        : await User.findOne({username : username})
        const {password,updatedAt,...otherDetails} = user._doc
        res.status(200).json(otherDetails)
    }catch(err)
    {
        res.status(500).json(err)
    }
})


//get friends
router.get("/friends/:userId",async(req,res)=>{
    try{
        const user = await User.findById(req.params.userId);
        const friends = await Promise.all(
            user.following.map(friendId => User.findById(friendId))
        )
        let friendList = [];
        friends.map(friend => {
            const {_id,username,profilePicture} = friend;
            friendList.push({_id,username,profilePicture})
        })
        res.status(200).json(friendList)
    }catch(err)
    {

    }
})



//follow a user

router.put("/:id/follow",async (req,res)=>{
    if(req.body.userId !== req.params.id){
        try{
            console.log('accessed follow request')
            const user = await User.findById(req.params.id)
            const currentUser = await User.findById(req.body.userId);
            if(!user.followers.includes(req.body.userId))
            {
                await user.updateOne({$push: {followers: req.body.userId}})
                await currentUser.updateOne({ $push : {following: req.params.id}})
                res.status(200).json(req.params.id)
            }else{
                res.status(403).json("you already follow this user")
            }
        }catch(err)
        {
            res.status(500).json(err)
        }
    }else {
        res.status(403).json("you cant follow yourself")
    }
})

//unfollow a user
router.put("/:id/unfollow",async (req,res)=>{
    if(req.body.userId !== req.params.id){
        try{
            const user = await User.findById(req.params.id)
            const currentUser = await User.findById(req.body.userId);
            if(user.followers.includes(req.body.userId))
            {
                await user.updateOne({$pull: {followers: req.body.userId}})
                await currentUser.updateOne({ $pull : {following: req.params.id}})
                res.status(200).json(req.params.id)
            }else{
                res.status(403).json("you were'nt following this user")
            }
        }catch(err)
        {
            res.status(500).json(err)
        }
    }else {
        res.status(403).json("you cant follow yourself")
    }
})


module.exports = router