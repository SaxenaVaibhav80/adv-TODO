const express = require("express")
const app = express()
const http = require('http')
const ejs = require("ejs")
const userModel = require("./models/user.js")
const taskModel = require("./models/tasks.js")
const mongoose=require("mongoose")
const tasks = require("./tasks/task.js")
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
const { info } = require("console")
// const { Socket } = require("dgram")
dotenv.config()
const secret_key=process.env.SECRET_KEY
app.use(bodyParser.urlencoded({extended:true}))
app.use(cookiParser())
const PORT = process.env.PORT





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
    // console.log("tokennnnnnn :", token)
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
        res.redirect("/logout")
    }
}

app.get("/",checkLoginState,(req,res)=>
{
    console.log("enter")
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

    const currentDate = new Date(); 
    const formattedDate = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(currentDate.getDate()).padStart(2, "0")}`;

    const task = await taskModel.create({
       userid:user._id,
       current:{
        id:user._id,
        name:user.firstname,
        date:formattedDate
       },
       history:[]
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
            res.send(roomid)
        }else if(joinid!=null){
            res.send(joinid)
        }else{
            res.send(false)
        }
        
    }
})



//--------------------------- adding data to the db ----------------------------------------->


app.post('/TODO',authenticated,async(req, res) => {
   
    const {imgUrl,title, priority, data,created_at} = req.body;
    const user = await userby_id(req,res)
    const id = user._id

    const newTask = {
        _id: new mongoose.Types.ObjectId(),
        title:title,
        data:data,
        imgUrl: imgUrl,
        created_at: created_at,
        status: "Complete", 
        priority:priority,
    };

    const current= await taskModel.findOneAndUpdate(
        {userid:id},
        {
            $push: { 'current.tasks': newTask }, 
            $set: { 'current.name':user.firstname},
        },
        { new: true } 
    )
 
    const taskId = newTask._id;

    if(user.mode=="Solo Mode" || user.mode=="Dual Mode" && user.roomId==null && user.joinId==null)
    {
        res.json({ status: 'added', mode:"solo",taskid:taskId});
    }
    if(user.mode =="Dual Mode" && (user.roomId)!=null)
    {
        res.json({ status: 'added',mode:"dual",id:user.roomId,taskid:taskId});
    }
    if(user.mode =="Dual Mode" && (user.joinId)!=null)
    {
        res.json({ status:'added',mode:"dual",id:user.joinId,taskid:taskId});
    }
    
});


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

// serving history page ------------------------------------>

app.get("/history",authenticated,async(req,res)=>
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
                res.render("history",{firstname:name})
            }catch(err){
                res.redirect("/logout")
            }
        }else{
            res.render("history")
        }
    })


// sendHistoryDataToClinet

app.post("/taskHistory", authenticated, async (req, res) => {
    const token = req.cookies.token;
    const date = req.body.date;

    if (token) {
        try {
            const verification = jwt.verify(token, secret_key);
            const id = verification.id;
            const task = await taskModel.findOne({ userid: id });

            if (!task) {
                return res.status(404).json({ error: "No task found" });
            }
            const reqTask = task.history.find(entry => entry.date === date);

            if (!reqTask) {
                return res.status(404).json({ error: "No tasks found for this date" });
            }

            res.json({ history: reqTask.data });

        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    } else {
        res.status(401).json({ error: "Unauthorized" });
    }
});



// handling join room handler----------------------------------->

app.post("/joined",authenticated,async(req,res)=>
{
    const user =  await userby_id(req,res)
    const id = user._id
    const roomid = req.body.id
    const isroomAvailable = await userModel.find({roomId:roomid})

    if(roomid!="" && isroomAvailable.length!=0)
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
            res.json({ redirectTo: "/TODO",countuser:false,alert:false});
        }
        else if(user.length>=1)
        {
            res.json({ redirectTo: "/TODO",countuser:true,alert:false});
        }    
    
    }else{
        res.json({ redirectTo: "/TODO",alert:"no room found"});
    }
    
})
// ----------------------------- sending users-------------------------------->

// app.get("/usersname",authenticated,async(req,res)=>
// {
//     const users= await userby_id(req,res)
//     console.log("user",users)
//     const roomid= users.roomId
//     const joinid= users.joinId

//     console.log(roomid,joinid)

//     if(roomid)
//     {
//        const other = await userModel.findOne({joinId:roomid})
//        console.log(other)
//        if(other!=null || other!=undefined)
//        {
//         res.status(200).json({selfname:users.firstname,selfid:users._id,othername:other.firstname,otherid:other._id,mode:"dual"})
//        }else{
//         res.status(200).json({selfname:users.firstname,selfid:users._id,othername:null,otherid:null,mode:"dual"})
//        }
       
//     }
//     else if(joinid)
//     {
//        console.log(roomid)
//        const other = await userModel.findOne({roomId:joinid})
//        console.log("other",other)
//        res.status(200).json({selfname:users.firstname,selfid:users._id,othername:other.firstname,otherid:other._id,mode:"dual"})
//     }
//     else{

//         res.status(200).json({name:users.firstname,id:users._id,mode:"solo"})
//     }
// })

// about page handler ------------------------------------->

app.get("/about",(req,res)=>
{
    res.render("aboutus")
})

// app.get("/getVerify", (req, res) => {
//     const token = req.cookies.token;
//     if (!token) return res.status(401).json({ status: "logout", message: "No token found" });

//     try {
//         const verification = jwt.verify(token, secret_key);
//         return res.status(200).json({ status: "ok", message: "Token is valid" });
//     } catch (err) {
//         return res.status(401).json({ status: "logout", message: "Invalid token" });
//     }
// });


// socket connection--------------------------------------------->
io.on("connection", async(socket) => {

    // console.log(socket)
    // const socketsInRoom = await io.fetchSockets();
    // console.log(`Active Sockets: ${socketsInRoom.length}`);
    // socketsInRoom.forEach((s) => {
    //     console.log(`Socket ID: ${s.id}`);
    // });

    // socket.on("connect", () => {
    //     console.log("Socket reconnected!");
    // })

    // console.log(socket.id)

    
 
    
    socket.on("token",async(token)=>
    {
      if(token)
      {
        try{
            const verify=jwt.verify(token,secret_key)
            const id = verify.id
            const user = await userModel.findOne({_id:id})
      
            if(user.roomId!=null)
            {
              await join(user.roomId) 
            }
            if(user.joinId!=null)
            {
              await join(user.joinId) 
            }
        }catch(err)
        {
          console.log("error")
        }
        
      }
      
    })


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
        
        const socketsInRoom = await io.in(id).fetchSockets();
        console.log(`Active Sockets: ${socketsInRoom.length}`);
        socketsInRoom.forEach((s) => {
            console.log(`Socket ID: ${s.id}`);
        });

        // const rooms = Array.from(io.sockets.adapter.rooms.keys());
        // console.log("Active rooms:", rooms);
    }
    socket.on("ijoined",(data)=>
    {
        console.log("joinid",data.id)
        const name = data.name
        const userid=data.userid
        io.to(data.id).emit("joineduser",{name,userid})
    })
    socket.on("add",(id,data)=>
    {
        // console.log(id)
        // console.log(data)
        io.to(id).emit("data",data)
    })
    socket.on("todisconnect",(data)=>
    {
        console.log("to disconnect chala")
       
        io.to(data).emit("force_leave",data);
        socket.leave(data);
        socket.disconnect(true);
    })
    socket.on("leaveme",(id)=>
    {
        socket.leave(id);
    })

    socket.on("message",(data)=>
    {
        // console.log(data[0],data[1])
        io.to(data[1]).emit("dualtask",[data[0],data[2],data[3]])
    })

    socket.on("otherProgress",(information)=>
    { 
        const name = information.name
        const progress=information.progress
        io.to(information.room).emit("setOtherProgress",{name,progress})
    })

    socket.on("setStatus",(data)=>
    {
        const taskid= data.id
        const status= data.status
        io.to(data.room).emit("dataToSet",{taskid,status})
    })
    socket.on("deleteFromEveryone",(data)=>
    {
        const room= data.room
        const taskid = data.taskid
        io.to(room).emit("deleteTask",taskid)
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
        const name = isvalid.name
        const id =isvalid.id
        return res.status(200).json({ token,id,name});
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
            )
            const options={
                // expires:new Date(Date.now()+24*60*60*1000),
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

// -------------------------------------------modeStatemanager--------------------->

app.post("/modeState",authenticated, async (req, res) => {
    const token = req.cookies.token;

    if (token) {
        try {
            const verify = jwt.verify(token,secret_key)
            const id = verify.id
            const user =  await userModel.findOne({_id:id})
            const mode = user.mode
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
// ----------------------------------handle theme state-------------------------------------->


app.get("/api/themeState",authenticated, async (req, res) => {
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

// --------------------- for dual mode having join id---------------->

async function handleDualModeWithJoinId(users, joinId, date, res, firstname) {

    console.log("joinid task manager wala chla");

    for (const user of users) {
        const userid = user._id;

      
        const taskData = await taskModel.findOne({ userid });

        if (!taskData) {
            console.log(`No tasks found for user: ${userid}`);
            continue;
        }

        
        if (taskData.current.date !== date) {
            if (taskData.current.tasks.length > 0) {
               
                const historyUpdate = {
                    date: taskData.current.date,
                    data: taskData.current.tasks,
                };

                if (taskData.history.length >= 30) {
                    await taskModel.findOneAndUpdate(
                        { userid },
                        { $pop: { history: -1 } },
                        { new: true }
                    );
                }

        
                await taskModel.findOneAndUpdate(
                    { userid },
                    {
                        $push: { history: historyUpdate },
                        $set: {
                            "current.tasks": [],
                            "current.date": date,
                            "current.name": firstname,
                        },
                    },
                    { new: true }
                );
            } else {
                
                await taskModel.findOneAndUpdate(
                    { userid },
                    {
                        $set: {
                            "current.date": date,
                            "current.tasks": [],
                            "current.name": firstname,
                        },
                    },
                    { new: true }
                );
            }
        }
    }


    // const updatedData = await taskModel.find({
    //     userid: { $in: users.map((user) => user._id) },
    // });

    // console.log(updatedData);

    res.render("main", {
        mode: "Dual Mode",
        firstname: firstname,
    });
}

// -----------------------------------------function to manage task------------------------------------------------->

async function handleSoloOrUnlinkedDualMode(currentData, userId, date, mode, name, res) {

    console.log("solo manager wala chala ")

    if (currentData.current.date !== date) {
        if (currentData.current.tasks.length > 0) {
            if (currentData.history.length >= 30) {
        
                await taskModel.findOneAndUpdate(
                    { userid: userId },
                    { $pop: { history: -1 } },
                    { new: true }
                );

           
                await taskModel.findOneAndUpdate(
                    { userid: userId },
                    {
                        $push: {
                            history: {
                                date: currentData.current.date,
                                data: currentData.current.tasks,
                            },
                        },
                        $set: {
                            "current.tasks": [],
                            "current.date": date,
                            "current.name": name,
                        },
                    },
                    { new: true }
                );
            } else {
              
                await taskModel.findOneAndUpdate(
                    { userid: userId },
                    {
                        $push: {
                            history: {
                                date: currentData.current.date,
                                data: currentData.current.tasks,
                            },
                        },
                        $set: {
                            "current.tasks": [],
                            "current.date": date,
                            "current.name": name,
                        },
                    },
                    { new: true }
                );
            }
        } else {
            
            await taskModel.findOneAndUpdate(
                { userid: userId },
                {
                    $set: {
                        "current.date": date,
                        "current.tasks": [],
                        "current.name": name,
                    },
                },
                { new: true }
            );
        }
    }

    // const updatedData = await taskModel.findOne({ userid: userId });
    res.render("main", { mode: mode, firstname: name});
}

// ---------------------------------------------for dual mode having room id ------------------------------------------>

async function handleDualModeWithRoomId(users, roomId, date, res, firstname) {
    console.log("roomid task manager wala chla");

    for (const user of users) {
        const userid = user._id;

        const taskData = await taskModel.findOne({ userid });

        if (!taskData) {
            console.log(`No tasks found for user: ${userid}`);
            continue;
        }

        if (taskData.current.date !== date) {
            if (taskData.current.tasks.length > 0) {
                const historyEntry = {
                    date: taskData.current.date,
                    data: taskData.current.tasks,
                };

                if (taskData.history.length >= 30) {
                    await taskModel.findOneAndUpdate(
                        { userid },
                        { $pop: { history: -1 } },
                        { new: true }
                    );
                }

                await taskModel.findOneAndUpdate(
                    { userid },
                    {
                        $push: { history: historyEntry },
                        $set: {
                            "current.tasks": [],
                            "current.date": date,
                            "current.name": firstname,
                        },
                    },
                    { new: true }
                );
            } else {
                await taskModel.findOneAndUpdate(
                    { userid },
                    {
                        $set: {
                            "current.date": date,
                            "current.tasks": [],
                            "current.name": firstname,
                        },
                    },
                    { new: true }
                );
            }
        }
    }

    // // Fetch only `current` data for each user
    // const currentData = await Promise.all(
    //     users.map(async (user) => {
    //         const taskData = await taskModel.findOne(
    //             { userid: user._id },
    //             { current: 1, _id: 0 } // Project only `current` field
    //         );
    //         return { userid: user._id, current: taskData?.current || null };
    //     })
    // );

    // console.log("Current Data of Users:", currentData);

    // // Render response
    res.render("main", {
        mode: "Dual Mode",
        firstname: firstname,
    });
}


// ------------------------------------------------------main page routing------------------------------------------------>

app.get("/TODO", authenticated, async (req, res) => {
    const token = req.cookies.token;
    console.log("called")
    if (token) {
        try {
            const verification= jwt.verify(token,secret_key)
            const userid= verification.id
            const user = await userModel.findOne({_id:userid})
            // console.log(user)
            const name = user.firstname;
            const id = user._id;
            const currentDate = new Date();
            const date = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(currentDate.getDate()).padStart(2, "0")}`;
            const mode = user.mode;
            // console.log(mode)
            const currentData = await taskModel.findOne({ userid: id });

            if (!currentData) {
                return res.status(404).json({ error: "No data found for this user." });
            }

            if (mode === "Solo Mode" || (mode === "Dual Mode" && user.roomId == null && user.joinId == null)) {
                // console.log("solo wla chala")
                await handleSoloOrUnlinkedDualMode(currentData, id, date, mode, name, res);
            }
            
            else if (mode === "Dual Mode" && user.roomId) {
                const relatedUsers = await userModel.find({ 
                    $or: [{ roomId: user.roomId }, { joinId: user.roomId }] 
                });
                // console.log(relatedUsers)
                await handleDualModeWithRoomId(relatedUsers, user.roomId, date, res,name);
            }
            
            else if (mode === "Dual Mode" && user.joinId) {
                const relatedUsers = await userModel.find({ 
                    $or: [{ roomId: user.joinId }, { joinId: user.joinId }] 
                });
                
                // console.log(date)
                await handleDualModeWithJoinId(relatedUsers, user.joinId, date, res,name);
            }
        } catch (err) {
            console.error(err);
            res.redirect("/");
        }
    } else {
        res.render("main");
    }
});


app.get("/getCurrent", authenticated, async (req, res) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ error: "User not authenticated" });
    }

    try {
    
        const user = await userby_id(req, res);
        const { mode, roomId, joinId, _id: userId } = user;

 
        const currentData = await taskModel.findOne({ userid: userId });
        const filter = roomId ? { roomId } : { joinId };
        if (!currentData) {
            return res.status(404).json({ error: "No data found for this user." });
        }

        if (mode === "Solo Mode"|| (mode === "Dual Mode" && user.roomId == null && user.joinId == null)) {
            return res.json({
                mode: "solo",
                user: {
                    tasks: currentData.current,
                    progress: currentData.progress
                }
            });
        }
        else if(mode==="Dual Mode" && filter!=null){
            // console.log("filtterrrrrrrrrrrrrrrrrrrr",filter)
    
            if(filter.roomId!=null)
            {
                const relatedUsers = await userModel.find({ $or: [{ roomId: filter.roomId }, { joinId: filter.roomId }] });
                // console.log("userssssssss", relatedUsers)
                const relatedTasks = await Promise.all(
                relatedUsers.map(async (relatedUser) => {
                    const tasksData = await taskModel.findOne({ userid: relatedUser._id });
                    return {
                        tasks: tasksData ? tasksData.current : [],
                        progress: tasksData ? tasksData.progress : null
                    };
                })
            );
            // console.log("taskkkkkkkkkkkkkkkkkkkkk", relatedTasks)
            return res.json({ mode: "dual", users: relatedTasks });
            }else if(filter.joinId!=null)
            {
    
                const relatedUsers = await userModel.find({ $or: [{ roomId: filter.joinId }, { joinId: filter.joinId }] });
                // console.log("userssssssss", relatedUsers)
                const relatedTasks = await Promise.all(
                relatedUsers.map(async (relatedUser) => {
                    const tasksData = await taskModel.findOne({ userid: relatedUser._id });
                    return {
                        tasks: tasksData ? tasksData.current : [],
                        progress: tasksData ? tasksData.progress : null
                    };
                })
            );
            // console.log("taskkkkkkkkkkkkkkkkkkkkk", relatedTasks)
            return res.json({ mode: "dual", users: relatedTasks });
            }
        }
        return res.json({ mode: "dual", users: null });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Server error" });
    }
});





// ------------------------------------------sending tasks as suggestions------------------------------------------------>

app.get('/api/random-task', authenticated,(req, res) => {
    const randomNumber = Math.floor(Math.random() * tasks.length); 
    res.send(tasks[randomNumber]);
  });


// ---------------------------------------------------add user page---------------------------->

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

// ---------------------------------------------------contact us route--------------------------->

app.get("/contactus",authenticated,async(req,res)=>
{

    const user =  await userby_id(req,res)
    res.render("contactus",{firstname:user.firstname})
})



// ----------------------------------------------------signup get req---------------------------->

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

app.post("/deleteTask",authenticated,async(req,res)=>
{
   const token = req.cookies.token
   const taskid= req.body.taskid
   if(token)
   {
    try{
       const verification= jwt.verify(token,secret_key)
       const id = verification.id
       const userTask = await taskModel.findOneAndUpdate(
        { userid: id }, 
        { $pull: { "current.tasks": { _id: taskid } } },
        { new: true }
      );
    //    console.log(userTask)
       res.status(200).json({message:"deleted",id:taskid})

    }catch(err)
    {
        res.status(200).send("error")
    }
   }
})


app.post("/setstatus",authenticated,async(req,res)=>
{
    const token = req.cookies.token
    const taskid= req.body.taskid
    const status= req.body.status
 
   if(token)
   {
    try{
       const verification= jwt.verify(token,secret_key)
       const id = verification.id
       const updatedStatus = await taskModel.findOneAndUpdate(
        { userid: id, "current.tasks._id": taskid }, 
        { $set: { "current.tasks.$.status": status } },
        { new: true } 
    );
        res.status(200).json({ update:"done" }); 

    }catch(err)
    {
        res.send("error")
    }
   }
})

app.get("/getProgress", authenticated, async (req, res) => {
    const token = req.cookies.token;

    if (token) {
        try {
            const verification = jwt.verify(token, secret_key);
            const id = verification.id;

            const tasks = await taskModel.findOne({ userid: id });
            if (tasks && tasks.current.tasks.length > 0) {
                const completedTasksCount = tasks.current.tasks.filter(
                    (task) => task.status === "Completed"
                ).length;

                const totaltask = tasks.current.tasks.length;
                const percent = (completedTasksCount / totaltask) * 100;

                console.log(percent);
                res.status(200).json({ progress: percent.toFixed(0) }); 
            } else {
                res.status(200).json({ progress: 0 }); 
            }
        } catch (err) {
            console.error(err);
            res.status(500).send("Error calculating progress");
        }
    } else {
        res.status(401).send("Unauthorized");
    }
});


app.post("/otherProgress",authenticated,async(req,res)=>
{
    console.log("otherprogress")
    const id = req.body.id

    const tasks = await taskModel.findOne({ userid: id });
    if (tasks && tasks.current.tasks.length > 0) {

        const completedTasksCount = tasks.current.tasks.filter(
            (task) => task.status === "Completed"
        ).length;

        const totaltask = tasks.current.tasks.length;
        const percent = (completedTasksCount / totaltask) * 100;
        console.log(percent);
        res.status(200).json({ progress: percent.toFixed(0) }); 
    } else {
        res.status(200).json({ progress: 0 }); 
    }
    
})

server.listen(PORT)




//  socket explaination---->


// Acha, jab socket.join(uuid) call hota hai, toh kya hota hai step-by-step samajhte hain:

// Step-by-Step Explanation

// 1️⃣ Connection Establishment
// Jab koi naya client connect hota hai, uske liye ek unique socket.id generate hota hai.


// ✅ Example:

// socket.id = "abcd1234"
// By default, har socket apne khud ke ek room mein hota hai (jo socket.id hota hai).

// 2️⃣ socket.join(uuid) Call
// Agar tum socket.join(uuid) call karte ho, toh:

// A new room (uuid) is created if it doesn’t exist.
// Tumhara socket is room mein add ho jata hai.

// ✅ Example:

// socket.join("room1"); 

// Ab tum "room1" ka part ho, lekin tumhara socket.id room bhi exist karega.
// 💡 Ek socket ek se zyada rooms ka member ho sakta hai.
// Agar dusra client bhi "room1" join karega, toh dono ek hi room mein honge.

// 3️⃣ Room Mein Kitne Log Hain?
// Agar check karna hai ki ek room mein kitne sockets hain, toh yeh kar sakte ho:


// const socketsInRoom = await io.in("room1").fetchSockets();
// console.log(`Sockets in room1: ${socketsInRoom.length}`);
// 🔹 Yeh jitne sockets "room1" mein honge, unka count bata dega.

// 4️⃣ Message Send to Room
// Ab koi bhi user jo "room1" join kar chuka hai, agar kuch send karega, toh sirf "room1" ke users ko message milega.


// socket.on("message", (msg) => {
//     io.to("room1").emit("message", msg);
// });

// ✅ Sirf "room1" wale clients ko yeh message milega, baaki ko nahi.

// 5️⃣ Room Leave Karna
// Agar tum socket.leave(uuid) call karte ho, toh tum uss room se nikal jaoge:


// socket.leave("room1");

// Agar room empty ho jaye, toh wo automatically delete ho jayega.

// 🔴 Summary
// Har socket apne default room (socket.id) mein hota hai.
// socket.join(uuid) se ek naye ya existing room mein add ho jate ho.
// io.in(uuid).fetchSockets() se check kar sakte ho ki room mein kitne log hain.
// io.to(uuid).emit("message", msg) se sirf room ke andar message send hoga.
// socket.leave(uuid) se room leave kar sakte ho.




// const rooms = Array.from(io.sockets.adapter.rooms.keys());
// console.log("Active rooms:", rooms);

// Each socket ID is a room->
// When a client connects, it is automatically added to a "room" with its own socket.id.

// Example: If a client has socket.id = "abcd1234", there will be a room "abcd1234" with only that socket inside it.
// Custom rooms can contain multiple sockets->
// When you use socket.join("room123"), that socket joins "room123", and many other sockets can also join it.