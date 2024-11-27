const express = require("express")
const app = express()
const http = require('http')
const ejs = require("ejs")
const userModel = require("./models/user.js")
const db = require("./config/config.js")
const server=http.createServer(app)
app.set("view engine","ejs")
app.use(express.static('public'))
app.use(express.json());
const bodyParser= require("body-parser")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const dotenv = require("dotenv")
const socketio=require('socket.io');
const io=socketio(server)
const { v4: uuidv4 } = require('uuid');
const cookiParser= require("cookie-parser")
dotenv.config()
const secret_key=process.env.SECRET_KEY
app.use(bodyParser.urlencoded({extended:true}))
app.use(cookiParser())

// function for user get user by _id------>


async function userby_id(req)
{ 
    const token = req.cookies.token
    if(token)
    {
        try{
            const verification = jwt.verify(token,secret_key)
            const id = verification.id
            const  user = await userModel.findOne({_id:id})
            return user
        }catch(err){
            res.redirect("/logout")
        }
    }else{
        res.redirect("/logout")
    }
  
}

// ----------------manage state----------------------->

const manageState = async(req,res,next)=>
{
    const token = req.cookies.token
    if(token)
    {
        try{
            const verification = jwt.verify(token,secret_key)
            const id = verification.id
            res.redirect("/TODO")
        }catch(err){
            res.redirect("/logout")
        }
    }else{
        next()
    }
}

// -------------------login Status---------------->

const checkLoginState = (req, res, next) => {
    let loggedIn=false;
    try{
    const token = req.cookies.token;
    if (token) {
        try {
            jwt.verify(token, secret_key);
            loggedIn = true;
        } catch (err) {
            if (err.name === 'TokenExpiredError') {
                 res.redirect("/logout")
                } 
            else {
                res.redirect("/logout")
            }
        }
    }
    }catch(err)
    {
       res.redirect("/logout")
    }
    res.locals.loggedIn = loggedIn; // Set the loggedIn state in res.locals
    next(); 
};

// ------- middleware to check is authentication------->

const authenticated = async(req,res,next)=>
{
    const token = req.cookies.token
    if(token)
    {
        try{
            const verification = jwt.verify(token,secret_key)
            const id = verification.id
            next()
        }catch(err){
            res.redirect("/logout")
        }
    }else{
        res.redirect("/")
    }
}

app.get("/",checkLoginState,(req,res)=>
{
    res.render("landingPage")
})

// --------------signup----------------

app.post("/signup",async(req,res)=>
{

 const firstname= req.body.firstname
 const lastname= req.body.lastname
 const password= req.body.password
 const email=req.body.email
 const gender = req.body.gender
 const age = req.body.age

 if(!(firstname&&lastname && email && password))
 {
     res.status(400).send("all field are required")
 }
 const exist = await userModel.findOne({email:email})
 
 if(exist){
     res.status(409).send("user already exist")
 }
 else{
    const encpass= await bcrypt.hash(password,10)
    const user = await userModel.create({
       
        firstname:firstname,
        lastname:lastname,
        gender:gender,
        age:age,
        password:encpass,
        email:email
    })
    res.redirect("/")
 }


})



  //------------get uid post req handle---------------------------->
  app.post("/getuid",authenticated,(req,res)=>
    {
        res.status(200).send(uuidv4())
    })
    
    // settin the uid into the database------------------------------>
    app.post("/setuid",authenticated,async(req,res)=>
    {
        const id = req.body.userid
        const uid=req.body.uid
    
        const user=await userModel.findOneAndUpdate(
            {_id:id},
            {roomId:uid}
        )
    })

// getting join room handler ------------------------------------>

app.get("/join-room",authenticated,async(req,res)=>
{
    const token = req.cookies.token
    if(token)
    {
        try{
            const verification = jwt.verify(token,secret_key)
            const id = verification.id
            const user = await userModel.findOne({_id:id})
            const name = user.firstname
            const mode=user.mode
            res.render("joinroom",{firstname:name})
        }catch(err){
            res.redirect("/")
        }
    }else{
        res.render("joinroom")
    }
})


// handling join room handler----------------------------------->

app.post("/joined",authenticated,async(req,res)=>
{
    const user =  await userby_id(req)
    const id = user._id
    const roomid = req.body.id
   
    if(roomid!="")
    {   
        const user= await userModel.find({roomId:roomid})
        console.log(user)
        if(user.length==1)
        {
            const updateduser= await userModel.findOneAndUpdate(
                {_id:id},
                {roomId:roomid},
                { new: true }
            )
            res.json({ redirectTo: "/TODO",countuser:false});
        }
        else if(user.length>=2)
        {
            res.json({ redirectTo: "/TODO",countuser:true});
        }
        else if(user.length<=0)
        {
            res.json({msg:"noRoom"})
        }
        
    
    }
    
})

// about page handler ------------------------------------->

app.get("/about",(req,res)=>
{
    res.render("aboutus")
})

// socket connection--------------------------------------------->

io.on("connection",(socket)=>
{  
    socket.on("token",async(token)=>
    {

        if(token)
        {
            try{
                const verification= jwt.verify(token,secret_key)
                const id = verification.id
                socket.join(id)
                
            }catch(err)
            {
               io.to(id).emit("redirectToMain","/")
            }
        }
    })
})


// --------------  sending token to the client side--------------->

app.post("/api/login",(req,res)=>
{
    const token = req.cookies.token
    if(token)
    {   try{
        const isvalid = jwt.verify(token, secret_key);
        const id =isvalid.id
        return res.status(200).json({ token,id });
        }catch(err)
        {
            res.redirect("/")
        }
    }
    else{
        return res.status(200).json({undefined})    
    }
    
})


// -----------------------login post req---------------------------->

app.post("/login",async(req,res)=>
{
    const email= req.body.email
    const password= req.body.password
    const user = await userModel.findOne({email:email})
    console.log(email,password)
    if(user)
    {
        const passverify= await bcrypt.compare(password,user.password)
        if(passverify){
            const token = jwt.sign(
                {id:user._id,name:user.firstname},
                secret_key,
                {
                 expiresIn:'24h'
                }
            )
            const options={
                expires:new Date(Date.now()+24*60*60*1000),
                httpOnly:true
            };
            res.status(200).cookie("token",token,options)
            res.redirect("/TODO")
        }
        else{
            res.status(400).send("password incorrect")
        }
    }
    else{
        res.status(400).send("user not  Available")
    }
})


// -----------------------login get req---------------------------->
app.get("/login",manageState,(req,res)=>
{
  res.render("login")
})


// acception mode from frontend-------------------->

app.post("/handleMode", async (req, res) => {

    const {mode} = req.body;
    const token = req.cookies.token;

    if (token) {
        try {
            const verification = jwt.verify(token, secret_key);
            const id = verification.id;
            await userModel.findOneAndUpdate(
                { _id: id },
                { mode: mode }
            );
            res.status(200).send(mode);
        } catch (err) {
            res.status(500).send("Error verifying token");
        }
    } else {
        res.status(401).send("Login please, session expired");
    }
});


// modeStatemanager--------------------->

app.post("/modeState",authenticated, async (req, res) => {
    const token = req.cookies.token;

    if (token) {
        try {
            const user =  await userby_id(req)
            const mode = user.mode
            res.status(200).send(mode);
        } catch (err) {
            res.status(500).send("Error verifying token");
        }
    } else {
        res.status(401).send("Login please, session expired");
    }
});

// --------------main page routing----------->

app.get("/TODO",authenticated,async(req,res)=>
{
    const token = req.cookies.token
    if(token)
    {
        try{

            const user = await userby_id(req)
            const name = user.firstname
            const mode=user.mode
            res.render("main",{firstname:name,mode:mode})
        }catch(err){
            res.redirect("/")
        }
    }else{
        res.render("main")
    }
})


// add user page---------------------------->

app.get("/addUser",authenticated,async(req,res)=>
{
    const token = req.cookies.token
    if(token)
    {
        try{
            const user =  await userby_id(req)
            res.render("addUser",{firstname:user.firstname})
        }catch(err){
            res.redirect("/")
        }
    }else{
        res.render("addUser")
    }
   
})

// ---------------------contact us route--------------------------->

app.get("/contactus",authenticated,async(req,res)=>
{

    const user =  await userby_id(req)

    res.render("contactus",{firstname:user.firstname})
})



// -----------------------signup get req---------------------------->

app.get("/signup",manageState,(req,res)=>
{
    res.render("signup")
})


// -------------------- logout route--------------------->

app.get("/logout",(req,res)=>
{
    const token = req.cookies.token
    if(token)
    {
        res.cookie('token', token, { expires: new Date(0), httpOnly: true });
    }
    res.redirect("/")  
})


server.listen(1000)