const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()

const app = express()

app.use(cors())
app.use(express.json())

const uri = process.env.MONGO_URI

mongoose.connect(uri)
.then(()=>{
    console.log('MONGODB CONNECTED!')
})
.catch((error)=>{
    console.error('MONGODB CONNECTION FAILED!', error.message)
})

app.get('/api/welcome', (req, res)=>{
    res.json({message: 'hello world!'})
})

const PORT = process.env.PORT || 5000

app.listen(PORT, ()=>{
    console.log('SERVER IS RUNNING ON PORT', PORT)
})