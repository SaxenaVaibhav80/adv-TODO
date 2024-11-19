const express = require("express")
const app = express()
const http = require('http')
const ejs = require("ejs")
const server=http.createServer(app)
app.set("view engine","ejs")
app.use(express.static('public'))
app.use(express.json());


app.get("/",(req,res)=>
{
    res.send("hello its begining")
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


