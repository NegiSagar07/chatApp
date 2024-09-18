const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const SignUp = require('./models/signup.models');

const app = express();
app.use(cors());
app.use(express.json());

const dburi = "mongodb+srv://sagarnegi926:UuDO4kMGzVffjD0u@cluster0.4lefr.mongodb.net/";
const connectDb = async () => {
    try {
        await mongoose.connect(dburi);
        console.log("connected successfully");
    } catch (error) {
        console.error("Error : ",error)
    }
} 

connectDb();

app.post('/signup', async(req, res) => {
    const { name , email , password} = req.body;
    try {
        const newuser = new SignUp({ name , email, password});
        await newuser.save();
        res.status(201).json({message : "user created successfully"})
        console.log({ name,email,password})
    } catch (error) {
        console.error("Error : ",error);
    }
})

const port = 5000;
app.listen(port, () => {
    console.log(`app running on ${port}`);
})

