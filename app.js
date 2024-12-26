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
const { Socket } = require("dgram")
dotenv.config()
const secret_key=process.env.SECRET_KEY
app.use(bodyParser.urlencoded({extended:true}))
app.use(cookiParser())



// function for user get user by _id------>

async function userby_id(req,res)
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
           console.log(err)
        }
    }else{
        console.log("err")
    }
  
}

// --------------- updation in user function----------------->

async function userUpdate(req, prop, value) {
    console.log("wokring")
    const token = req.cookies.token;
    if (token) {
        try {
            const verification = jwt.verify(token, secret_key);
            const id = verification.id;


            const user = await userModel.findOneAndUpdate(
                { _id: id }, 
                { [prop]: value },
                { new: true } 
            );

            return user;
        } catch (err) {
            console.log(err);
        }
    } else {
        console.log("No token found");
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

// ------------accessing the stored room id to send it to socket so that i will join as room with that id------------------->

app.post("/accessUid",authenticated,async(req,res)=>
{   
    
    const user = await userby_id(req,res)
    if(user || user!=null)
    {
        const roomid=user.roomId
        const joinid=user.joinId
        if(roomid!=null)
        {
            console.log(roomid)
            res.send(roomid)
        }else{
            console.log(joinid)
            res.send(joinid)
        }
        
    }
   
    
    
})

// --------------------remove user--------------------------------->

// app.post("/remove",authenticated,async(req,res)=>

// {   
//     // console.log("remove call hua")
//     const user = await userby_id(req,res)
//     const userid=user._id
//     const id = req.body.id
//     const joinid = await userModel.find({joinId:id})
//     const roomid= await userModel.find({roomId:id})
//     // console.log(joinid.length,roomid.length)
//     if(roomid.length==0 && joinid.length==1)
//     {
//         // console.log("else me gayi")
//         const update= await userModel.findOneAndUpdate(
//             {_id:userid},
//             {mode:"Solo Mode",joinId:null},
//             {new:true}
//         )

//         // console.log("user",update)
        
//         res.redirect("/TODO")
//     }
//     else{
//         res.redirect("/TODO")
//     }

// })

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
            res.redirect("/logout")
        }
    }else{
        res.render("joinroom")
    }
})


// handling join room handler----------------------------------->

app.post("/joined",authenticated,async(req,res)=>
{
    const user =  await userby_id(req,res)
    const id = user._id
    const roomid = req.body.id
   
    if(roomid!="")
    {   
        const user= await userModel.find({joinId:roomid})
        // console.log(user)
        if(user.length==0)
        {
            const updateduser= await userModel.findOneAndUpdate(
                {_id:id},
                {joinId:roomid},
                { new: true }
            )
            res.json({ redirectTo: "/TODO",countuser:false});
        }
        else if(user.length>=1)
        {
            res.json({ redirectTo: "/TODO",countuser:true});
        }    
    
    }
    
})

// about page handler ------------------------------------->

app.get("/about",(req,res)=>
{
    res.render("aboutus")
})

// socket connection--------------------------------------------->

io.on("connection", async(socket) => {

                // console.log(socket)

                // const socketsInRoom = await io.fetchSockets();
                // console.log(`Active Sockets: ${socketsInRoom.length}`);
                // socketsInRoom.forEach((s) => {
                //     console.log(`Socket ID: ${s.id}`);
                // });

                socket.on("roomid",async(id)=>
                {
                  await join(id) 
                  console.log("join call")
        
                })
                async function join(id)
                {
                    
                    await socket.join(id)
                    // console.log(socket)
                    // console.log("joined",id)
                    
                    // const socketsInRoom = await io.in(id).fetchSockets();
                    // console.log(`Active Sockets: ${socketsInRoom.length}`);
                    // socketsInRoom.forEach((s) => {
                    //     console.log(`Socket ID: ${s.id}`);
                    // });
                }

                socket.on("add",(id,data)=>
                {
                    // console.log(id)
                    // console.log(data)
                    io.to(id).emit("data",data)

                })

                socket.on("todisconnect",(data)=>
                {
                    // console.log(data)
                   
                    io.to(data).emit("force_leave",data);
                    socket.leave(data);
                    socket.disconnect(true);
                })

                socket.on("leaveme",(id)=>
                {
                    socket.leave(id);
                })
            
                // -------- checks how many sockets are active----------->
                // const socketsInRoom = await io.in(id).fetchSockets(); checks for rooms available for particular id 

    });



    
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

// ------------------------updateuserroomid---------------------->

app.post("/makeMyRoomidEmpty", authenticated, async (req, res) => {
    const { roomid, mode } = req.body;

    const users = await userModel.updateMany(
        {
            $or: [
                { joinId: roomid },
                { roomId: roomid },
            ],
        },
        {
            $set: { joinId: null, roomId: null, mode: mode },
        }
    );

    res.redirect("/TODO");
});



// acception mode from frontend-------------------->

app.post("/handleMode", async (req, res) => {

    const mode = req.body.mode;
    const token = req.cookies.token;

    if (token) {
        try {
            const verification = jwt.verify(token, secret_key);
            const id = verification.id;
            const user =await userby_id(req,res)
            const roomid= user.roomId
            const joinid = user.joinId

            // if(mode==="Solo Mode")
            // {
            //     await userModel.findOneAndUpdate(
            //         { _id: id },
            //         { mode: mode,roomId:null,joinId:null }
            //     );
            // }else{
            //     await userModel.findOneAndUpdate(
            //         { _id: id },
            //         { mode: mode }
            //     );
            // }

            await userModel.findOneAndUpdate(
                { _id: id },
                { mode: mode }
            );
            
            res.status(200).json({mode,roomid,joinid});
        } catch (err) {
            res.status(500).send("Error verifying token");
        }
    } else {
        res.status(401).send("Login please, session expired");
    }
});


app.post("/handlelightMode",authenticated,async(req,res)=>
{
    const mode = req.body.mode;
    const token = req.cookies.token;

    if (token) {
        try {
            const verification = jwt.verify(token, secret_key);
            const id = verification.id;
            await userModel.findOneAndUpdate(
                { _id: id },
                { theme: mode }
            );
            res.status(200).json({mode});
        } catch (err) {
            res.status(500).send("Error verifying token");
        }
    } else {
        res.status(401).send("Login please, session expired");
    }
})

// modeStatemanager--------------------->

app.post("/modeState",authenticated, async (req, res) => {
    const token = req.cookies.token;

    if (token) {
        try {
            const verify = jwt.verify(token,secret_key)
            const id = verify.id
            const user =  await userModel.findOne({_id:id})
            const mode = user.mode
            console.log(mode)
            if(mode==="Solo Mode")
            {

                const user=await userModel.findOneAndUpdate(
                    {_id:id},
                    {roomId:null}
                )

            }
            res.status(200).send(mode);
        } catch (err) {
            res.status(500).send("Error verifying token");
        }
    } else {
        res.status(401).send("Login please, session expired");
    }
});
app.post("/themeState",authenticated, async (req, res) => {
    const token = req.cookies.token;

    if (token) {
        try {
            const verify = jwt.verify(token,secret_key)
            const id = verify.id
            const user =  await userModel.findOne({_id:id})
            const mode = user.theme
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

            const user = await userby_id(req,res)
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
            const user =  await userby_id(req,res)
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

    const user =  await userby_id(req,res)

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