const socket = io()


fetch('/api/login', {
    method: 'POST',
})
.then(response => response.json()) 
.then(data => {
    localStorage.setItem("token", data.token); 
    localStorage.setItem("id",data.id);
    const extracted_token = localStorage.getItem('token');
    socket.emit("token",extracted_token)
})

checkAdduserState();

window.addEventListener("pageshow", (event) => {
    if (event.persisted || performance.getEntriesByType("navigation")[0].type === "back_forward") {
        checkLoginState();
    }
});

function appendAddUser()
{
    const nav = document.getElementsByClassName("navbar")[0]
    const thirdChild = nav.children[3]; 
    const adduserbtn = document.createElement("a")
    adduserbtn.textContent="Add user"
    adduserbtn.classList.add("adduserbtn")
    adduserbtn.setAttribute("href","/AddUser")
    nav.insertBefore(adduserbtn, thirdChild.nextSibling);

}
function joinroom()
{
    const nav = document.getElementsByClassName("navbar")[0]
    const fifthChild = nav.children[4]; 
    const joinroombtn = document.createElement("a")
    joinroombtn.textContent="Join room"
    joinroombtn.classList.add("joinroombtn")
    joinroombtn.setAttribute("href","/join-room")
    nav.insertBefore(joinroombtn, fifthChild.nextSibling);
}


function checkLoginState(){
    
    fetch('/api/login', {
        method: 'POST',
    })
    .then(response => response.json()) 
    .then(data => {
    
        localStorage.setItem("token", data.token); 
        localStorage.setItem("id",data.id);    
    })
    const extracted_token=localStorage.getItem('token');
    if(extracted_token ===  undefined)
    {   
      location.reload()
    }
}


function  checkAdduserState(){
    fetch("/modeState", {
        method: "POST"
    }).then(res=>res.text())
    .then(async(modes)=>{
        
        console.log("modes =", modes)
        if(modes=="Dual Mode")
            {
                console.log(modes)
                outer.classList.remove("shift-left")
                outer.classList.add("shift-right") 
                const joinbtn = document.getElementsByClassName("joinroombtn")[0]
                const btn = document.getElementsByClassName("adduserbtn")[0]
                document.getElementById("mode").innerHTML='Dual Mode'   
               
                if(btn == undefined && joinbtn == undefined)
                {
                    appendAddUser()
                    joinroom()
                }  
                
                 sendroomID()
                

            }
        else{
            console.log(modes)
                outer.classList.remove("shift-right")
                outer.classList.add("shift-left")  
                document.getElementById("mode").innerHTML='Solo Mode'   
        }
    })
}



const outer= document.getElementById("outer")
const ball =document.getElementById("ball")


outer.addEventListener("click",async()=>
{   const mode= document.getElementById("mode").innerHTML
//    console.log(mode)
    
    if(mode==='Solo Mode')
    {
        await fetch("/handleMode", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ mode: "Dual Mode" }),
        }).then(res=>res.json())
        .then(modes=>{
        
            if(modes.mode =="Dual Mode")
                {  
                   
                    const btn = document.getElementsByClassName("adduserbtn")[0]
                    outer.classList.remove("shift-left")
                    outer.classList.add("shift-right")
                    const joinbtn = document.getElementsByClassName("joinroombtn")[0]
                    document.getElementById("mode").innerHTML='Dual Mode'   
                    if(btn == undefined && joinbtn== undefined)
                    {
                        appendAddUser()
                        joinroom()
                    }

                    sendroomID()
                }


        })
    
    }else{
       
        await fetch("/handleMode", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ mode: "Solo Mode" }),
        }).then(res=>res.json())
        .then(modes=>
        {   
        
            if(modes.mode=="Solo Mode")
                {   
                   
                    socket.emit("todisconnect",modes.roomid)
                    const adduserbtn = document.getElementsByClassName("adduserbtn")[0]
                    const joinbtn = document.getElementsByClassName("joinroombtn")[0]
                    const nav = document.getElementsByClassName("navbar")[0]
                    if(adduserbtn)
                    {
                       nav.removeChild(adduserbtn)
                       nav.removeChild(joinbtn)
                    }
                    outer.classList.remove("shift-right")
                    outer.classList.add("shift-left")
                    document.getElementById("mode").innerHTML='Solo Mode'           
                }
        }
        )
    }
})



window.addEventListener("pageshow", (event) => {
    if (event.persisted || performance.getEntriesByType("navigation")[0].type === "back_forward") {
        checkAdduserState();
    }
});



function sendroomID()
{
    fetch("/accessUid",{
        method:"POST"
    }).then(res=>res.text())
    .then(data=>
    {   
        const joinbtn = document.getElementsByClassName("joinroombtn")[0]
        const addbtn = document.getElementsByClassName("adduserbtn")[0]
    
        if(data.length!=0)
        {
            
            socket.emit("roomid",data)
    
            if(addbtn != undefined && joinbtn!= undefined)
            {
                joinbtn.classList.add("hide")
                addbtn.classList.add("hide")
            }
        }else{
            joinbtn.classList.remove("hide")
            addbtn.classList.remove("hide")
        }
        
    }
    )
    
    
}

const add= document.getElementById("btn")

add.addEventListener("click",()=>
{
    fetch("/accessUid",{
        method:"POST"
    }).then(res=>res.text())
    .then(id=>
    {
        if(id!=null)
        {
            const input= document.getElementById("inputtask")
            const data = input.value
            socket.emit("add",id,data)
        }
      
    }
    )
    
    
})

socket.on("data",(info)=>
{
    console.log(info)
})

socket.on("force_leave",(id)=>
{  
    console.log("i got leave message ")
    // fech krk db me roomid ki value null karwao 

    fetch("/makeMyRoomidEmpty",{
        method:"POST",
        headers:{
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ roomid:id,mode:"Solo Mode"}),
    })
    // mode single krwao 

    const outer= document.getElementById("outer")
    const adduserbtn = document.getElementsByClassName("adduserbtn")[0]
    const joinbtn = document.getElementsByClassName("joinroombtn")[0]
    const nav = document.getElementsByClassName("navbar")[0]
    if(adduserbtn)
    {
       nav.removeChild(adduserbtn)
       nav.removeChild(joinbtn)
    }
    outer.classList.remove("shift-right")
    outer.classList.add("shift-left")
    document.getElementById("mode").innerHTML='Solo Mode'      
    // ui change kre (dual to single)
    socket.emit("leaveme",(id))
})


fetch("/accessUid",{
    method:"POST"
}).then(res=>res.text())
.then(id=>
{
   if(id!=null)
   {
    fetch("/remove",{
        method:"POST",
        headers:{
           "Content-Type": "application/json",
        },
        body:JSON.stringify({id:id})
    }).then(()=>
    {
        checkAdduserState()
    })
   }
})
    




