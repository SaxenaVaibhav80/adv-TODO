const socket = io()


fetch('/api/login', {
    method: 'POST',
})
.then(response => response.json()) 
.then(data => {
    localStorage.setItem("token", data.token); 
    localStorage.setItem("id",data.id);
    const extracted_token = localStorage.getItem('token');
    // socket.emit("token",extracted_token)
})

checkAdduserState();
themestate()

window.addEventListener("pageshow", (event) => {
    if (event.persisted || performance.getEntriesByType("navigation")[0].type === "back_forward") {
        checkLoginState();
    }
});

function appendAddUser()
{
    const nav = document.getElementsByClassName("navbar")[0]
    const thirdChild = nav.children[1]; 
    const adduserbtn = document.createElement("a")
    adduserbtn.textContent="Add user"
    adduserbtn.classList.add("adduserbtn")
    adduserbtn.setAttribute("href","/AddUser")
    nav.insertBefore(adduserbtn, thirdChild.nextSibling);

}
function joinroom()
{
    const nav = document.getElementsByClassName("navbar")[0]
    const fifthChild = nav.children[2]; 
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


const outer= document.getElementById("outer")
const louter= document.getElementById("lightouter")
const ball =document.getElementById("ball")
const lball =document.getElementById("lightball")


function  checkAdduserState(){
    fetch("/modeState", {
        method: "POST"
    }).then(res=>res.text())
    .then(async(modes)=>{
        
        
        if(modes=="Dual Mode")
            {
                console.log("modes =", modes)
                document.getElementById("outer").classList.remove("shift-left")
                document.getElementById("outer").classList.add("shift-right") 
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
                document.getElementById("outer").classList.remove("shift-right")
                document.getElementById("outer").classList.add("shift-left")  
                document.getElementById("mode").innerHTML='Solo Mode'   
        }
    })
}


function themestate(){
    fetch("/themeState", {
        method: "POST"
    }).then(res=>res.text())
    .then(async(modes)=>{
        
        if(modes=="Dark mode")
            {
                
                document.getElementById("lightouter").classList.remove("shift-left")
                document.getElementById("lightouter").classList.add("shift-right") 
                document.getElementById("light").setAttribute("src","/img/dark-mode.png")
                document.getElementById("lmode").innerHTML='Dark mode'    
            }
        else{
            document.getElementById("lightouter").classList.remove("shift-right")
            document.getElementById("lightouter").classList.add("shift-left")  
                document.getElementById("light").setAttribute("src","/img/lightmode.png")
                document.getElementById("lmode").innerHTML='Light mode'   
        }
    })
}





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
                   if(modes.joinid!=null)
                   {
                    socket.emit("todisconnect",modes.joinid)
                   }else{
                    socket.emit("todisconnect",modes.roomid)
                   }
                    
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




louter.addEventListener("click",async()=>
    {   const lmode= document.getElementById("lmode").innerHTML
        
        if(lmode==='Light mode')
        {
            await fetch("/handlelightMode", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ mode: "Dark mode" }),
            }).then(res=>res.json())
            .then(modes=>{
            
                if(modes.mode =="Dark mode")
                    {  

                        louter.classList.remove("shift-left")
                        louter.classList.add("shift-right")
                        document.getElementById("light").setAttribute("src","/img/dark-mode.png")
                        document.getElementById("lmode").innerHTML='Dark mode'   
                    }
            })
        
        }else{
            await fetch("/handlelightMode", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ mode: "Light mode" }),
            }).then(res=>res.json())
            .then(modes=>
            {   
            
                if(modes.mode=="Light mode")
                    {   
                        louter.classList.remove("shift-right")
                        louter.classList.add("shift-left")
                        document.getElementById("light").setAttribute("src","/img/lightmode.png")
                        document.getElementById("lmode").innerHTML='Light mode'           
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

// const add= document.getElementById("btn")

// add.addEventListener("click",()=>
// {
//     fetch("/accessUid",{
//         method:"POST"
//     }).then(res=>res.text())
//     .then(id=>
//     {
//         if(id!=null)
//         {
//             const input= document.getElementById("inputtask")
//             const data = input.value
//             socket.emit("add",id,data)
//         }
      
//     }
//     )
    
    
// })

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
    
const progressstyle= document.getElementsByClassName("progressstyle")[0]
const timestyle= document.getElementsByClassName("timestyle")[0]
const slidericon = document.getElementById("slidericon");
const slider = document.getElementById("slider");
const navbar = document.querySelector(".navbar");
const list=document.getElementById("lists")

let isSliderExpanded = false; 

slidericon.addEventListener("click", () => {
    if (isSliderExpanded) {
        // Collapse slider
        slider.style.width = "0";
        navbar.style.width = "calc(100% - 50px)";
        list.style.width = "1450px";
    } else {
        // Expand slider
        slider.style.width = "250px"; 
        navbar.style.width = "calc(100% - 300px)";
        list.style.width = "1200px";
    }
    isSliderExpanded = !isSliderExpanded; 
});

progressstyle.addEventListener("click", () => {
    if (isSliderExpanded) {
        // Collapse slider
        slider.style.width = "0";
        navbar.style.width = "calc(100% - 50px)";
    } else {
        // Expand slider
        slider.style.width = "250px"; 
        navbar.style.width = "calc(100% - 300px)";
    }
    isSliderExpanded = !isSliderExpanded; 
});

timestyle.addEventListener("click", () => {
    if (isSliderExpanded) {
        // Collapse slider
        slider.style.width = "0";
        navbar.style.width = "calc(100% - 40px)";
    } else {
        // Expand slider
        slider.style.width = "250px"; 
        navbar.style.width = "calc(100% - 300px)";
    }
    isSliderExpanded = !isSliderExpanded; 
});

function startCountdown() {
    const progressFill = document.querySelector("#progress-fill");
    const timerElement = document.getElementById("timer");
    const totalDaySeconds = 24 * 60 * 60; 

    function updateTimer() {

       
        const now = new Date();
        const currentSeconds = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
        const secondsLeft = totalDaySeconds - currentSeconds;
        const hours = Math.floor(secondsLeft / 3600);
        const minutes = Math.floor((secondsLeft % 3600) / 60);
        const seconds = secondsLeft % 60;
        timerElement.textContent = `Time left: ${hours}:${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        const progressPercentage = (currentSeconds / totalDaySeconds) * 100;
        progressFill.style.width = `${progressPercentage}%`;
    }
    setInterval(updateTimer, 1000);
    
    updateTimer();
}

window.onload = startCountdown;


function updateProgress(value) {
    const progressCircle = document.querySelector('.progress-circle');
    const progressValue = document.getElementById('progressValue');

    const radius = 70; 
    const circumference = 2 * Math.PI * radius; 
    const offset = circumference - (value / 100) * circumference;
    progressCircle.style.strokeDashoffset = offset;  
    progressValue.textContent = `${value}%`;
}


setTimeout(() => updateProgress(70), 1000); 
