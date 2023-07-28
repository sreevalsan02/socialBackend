const express = require('express')
const dotenv = require('dotenv').config()
const mongoose = require('mongoose')
const colors = require('colors')
const cors = require('cors')
const helmet = require('helmet')
const app = express()
const PORT = process.env.PORT || 8800
const MONGO_URL = process.env.MONGO_URL

const connectDb = async() => {
    try{
        const conn = await mongoose.connect(MONGO_URL)
        console.log(`MongoDB connected  ${conn.connection.host}`
        .cyan.underline)
    }catch(err)
    {
        console.log(err)
    }
}
connectDb()

//middlewares
app.use(express.json())
app.use(cors())
app.use(helmet())

//routes
app.use("/api/auth",require('./routes/auth'))
app.use("/api/users",require("./routes/users"))
app.use("/api/posts",require("./routes/posts"))


app.get('/',(req,res)=>{
    res.json('hello guys')
})

app.listen(PORT,()=>{
    console.log(`server started on port ${PORT}`)
})