const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('./models/User.js')
const multer = require('multer')
const path = require('path')
const Item = require('./models/Item.js')
require('dotenv').config()

const app = express()

app.use(cors())
app.use(express.json())
app.use('/uploads', express.static('uploads'))

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

// --- GET ALL ITEMS ROUTE ---
app.get('/api/items', async (req, res) => {
    try {
        // .find() with no arguments returns every item in the collection
        const items = await Item.find(); 
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Save files to the uploads folder
    },
    filename: (req, file, cb) => {
        // Give the file a unique name using the current timestamp
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

app.post('/api/items', upload.single('image'), async (req, res) => {
    try {
        // The text data comes in req.body
        const { title, category } = req.body;
        
        // The uploaded file data comes in req.file
        if (!req.file) {
            return res.status(400).json({ message: 'Please upload an image' });
        }

        // Create the URL path (e.g., "http://localhost:5000/uploads/167890.jpg")
        const imageUrl = `http://localhost:5000/uploads/${req.file.filename}`;

        // Save everything to MongoDB
        const newItem = new Item({
            title: title,
            category: category,
            imageUrl: imageUrl
        });

        await newItem.save();

        res.status(201).json({ message: 'Item added successfully', item: newItem });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

//registration user
app.post('/api/register', async(req, res) => {
    try{
        const { email, password } = req.body
        const existingUser = await User.findOne({email})
        if(existingUser){
            return res.status(400).json({message: 'User already exists'})
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new User({
            email,
            password: hashedPassword
        })
        await newUser.save()

        res.status(201).json({message: 'User created successfully!'})
    }
    catch(error)
    {
        res.status(500).json({message: 'server error', error: error.message})
    }
})

app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { userId: user._id }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1h' }
        );

        res.json({ token, userId: user._id });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

const PORT = process.env.PORT || 5000

app.listen(PORT, ()=>{
    console.log('SERVER IS RUNNING ON PORT', PORT)
})