import express from 'express';
import path from 'path';
import mongoose from 'mongoose';
import cookieParser from "cookie-parser"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt";

mongoose
    .connect("mongodb://127.0.0.1:27017", {
        dbName: "backend",
})
    .then(() =>console.log("Database Connected"))
    .catch((e) => console.log(e));

    const userSchema = new mongoose.Schema({
        name: String,
        email: String,
        password: String
    });

    const User = mongoose.model("User", userSchema)


const app = express();

// Using Middlewares
app.use(express.static(path.join(path.resolve(), "public")));
app.use(express.urlencoded({extended: true}))
app.use(cookieParser());

// // Setting up View Engine
app.set("view engine", "ejs");

const isAuthenticated = async (req, res, next)=>{
    const {token} = req.cookies;
    // if(token){
    //     const decoded = jwt.verify(token, "sojfsajfasjdfipa");
    //     console.log(decoded);
    //     next();
    // }
    // else{
    //     res.render("login");
    // }
    
    //const decoded = jwt.verify(token, "sojfsajfasjdfipa");
    //console.log(decoded);
    //req.user = await User.findById(decoded._id);

    res.render("logout", {name: req.user.name});
}

app.get("/home", (req, res) =>{
    // res.send("Hi")
    
    // res.statusCode(404);
    
    // res.json({
    //     success: "not",
    //     product: []
    // })
    // res.status(400).send("Meri marzi");
    
    // res.status(400).json({
    //          success: "not",
    //          product: []
    //      });


    // const pathLocation = path.resolve();
    // console.log(path.join(pathLocation, "./index.html"));
    // res.sendFile(path.join(pathLocation, "./index.html"));

    
    res.render("login");

    // res.sendFile("index.html");
})

app.get("/forlogin", isAuthenticated, (req,res) =>{
    // console.log(req.cookies.token);
    // const { token } = req.cookies;
    // if(token){
    //     res.render("logout");
    // }
    // else{
    //     res.render("login");
    // }
    // // res.redirect("/login");
})

app.get("/login", (req, res) =>{
    res.render("login");
})

app.get("/register", (req,res) =>{
    res.render("register");
    
})

app.post("/login", async(req,res)=>{

    const { email, password} = req.body;

    let user = await User.findOne({email})

    if(!user){
        return redirect("/register")
    }

    const isMatch = await bcrypt.compare(password, user.password());

    if(!isMatch){
        return res.render("login", {email,  message: "Incorrect passwored"});
    }

    const token = jwt.sign({ _id: user._id}, "sdljfslfjosfsfsf");

    res.cookie("token", token, {
        httpOnly: true,
        expires: new Date(Date.now() + 60 * 1000),
    })
    res.redirect("/");
})

app.post("/register", async(req,res)=>{

    const { name, email, password} = req.body;
    // console.log(req.body);

    let user = await User.findOne({email})    
    if(user){
       return res.redirect("/login");
    }

    const hashedPassword = await bcrypt.hash(password,10);

    user = await User.create({
        name,
        email,
        hashedPassword
    });

    const token = jwt.sign({ _id: user._id}, "sdljfslfjosfsfsf");

    res.cookie("token", token, {
        httpOnly: true,
        expires: new Date(Date.now() + 60 * 1000),
    })
    res.redirect("/");
})

app.get("/logout", (req,res)=>{
    res.cookie("token", "null", {
        httpOnly: true,
        expires: new Date(Date.now(Date.now()))
    }),
    console.log("hello");
    res.redirect("/forlogin");
})

app.get("/add", async (req, res) =>{
    // res.render("index", {name: "abhishekh"});

    await Message.create({name: "Abhi2", email: "sample2@gmail.co,"})
    res.send("Nice");
})


app.listen(5000, ()=>{
    console.log('Server is running on port 5000');
});

