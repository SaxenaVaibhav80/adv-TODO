const socket = io()

let extracted_token
fetch('/api/login', {
    method: 'POST',
})
.then(response => response.json()) 
.then(data => {
    localStorage.setItem("token", data.token); 
    localStorage.setItem("id",data.id);
    extracted_token = localStorage.getItem('token');
    socket.emit("token",extracted_token)
})


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
    let token
    fetch('/api/login', {
        method: 'POST',
    })
    .then(response => response.json()) 
    .then(data => {
    
        localStorage.setItem("token", data.token); 
        localStorage.setItem("id",data.id);
        token = localStorage.getItem('token');
    
    })
    const extracted_token=token
    if(extracted_token ===  undefined)
    {   
      location.reload()
    }
}


function  checkAdduserState(){
    fetch("/modeState", {
        method: "POST"
    }).then(res=>res.text())
    .then(modes=>{
        if(modes=="Dual Mode")
            {
                outer.classList.remove("shift-left")
                outer.classList.add("shift-right") 
                const joinbtn = document.getElementsByClassName("joinroombtn")[0]
                const btn = document.getElementsByClassName("adduserbtn")[0]
                
               
                if(btn == undefined && joinbtn == undefined)
                {
                    appendAddUser()
                    joinroom()
                }  
            }
        else{
                outer.classList.remove("shift-right")
                outer.classList.add("shift-left")  
        }
    })
}

checkAdduserState();

const outer= document.getElementById("outer")
const ball =document.getElementById("ball")


outer.addEventListener("click",async()=>
{   const mode= document.getElementById("mode").innerHTML
   
    
    if(mode==='Solo Mode')
    {
        await fetch("/handleMode", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ mode: "Dual Mode" }),
        }).then(res=>res.text())
        .then(modes=>{
            console.log(modes)
            if(modes=="Dual Mode")
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
                }
        })
    
    }else{
       
        await fetch("/handleMode", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ mode: "Solo Mode" }),
        }).then(res=>res.text())
        .then(modes=>
        {
            if(modes=="Solo Mode")
                {   const adduserbtn = document.getElementsByClassName("adduserbtn")[0]
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




socket.on("join",(msg)=>
{
    alert(msg)
})

socket.on("redirectToMain",()=>
{
    window.location.href="/"
})