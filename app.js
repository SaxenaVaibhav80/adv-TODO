const express = require("express")
const app = express()
const http = require('http')
const ejs = require("ejs")
const server=http.createServer(app)
app.set("view engine","ejs")
app.use(express.static('public'))
app.use(express.json());
const bodyParser= require("body-parser")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const dotenv = require("dotenv")

app.use(bodyParser.urlencoded({extended:true}))



app.get("/",(req,res)=>
{
    res.send("hello its begining")
})

// --------------signup----------------

app.post("/signup",async(req,res)=>
{

 const username= req.body.username
 const password= req.body.password
 const email=req.body.email
 const gender = req.body.gender
 const age = req.body.age

console.log(username,password,email)
 if(!(username && email && password))
 {
     res.status(400).send("all field are required")
 }
 const exist = await userModel.findOne({email:email})
 const userexist = await userModel.findOne({username:username})
 if(exist || userexist){
     res.status(401).send("user already exist")
 }
 else{
    const encpass= await bcrypt.hash(password,10)
    const user = await userModel.create({
       
        username:username,
        password:encpass,
        email:email
    })
  
 }
 res.redirect("/")

})


app.post("/api/login",(req,res)=>
{
    const token = req.cookies.token
    if(token)
    {   
        const isvalid = jwt.verify(token, secret_key);
        const id =isvalid.id
        return res.status(200).json({ token,id });
    }
    else{
        return res.status(200).json({undefined})    
    }
    
})

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
            res.redirect("/chats")
        }
        else{
            res.status(400).send("password incorrect")
        }
    }
    else{
        res.status(400).send("user not  Available")
    }
})



app.get("/login",(req,res)=>
{
  res.render("login")
})

app.get("/signup",(req,res)=>
{
    res.render("signup")
})
server.listen(1000)


