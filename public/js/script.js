const socket = io()
// window.onload = startCountdown;

fetch('/api/login', {
    method: 'POST',
})
.then(response => response.json()) 
.then(data => {
    localStorage.setItem("token", data.token); 
    localStorage.setItem("id",data.id);
    localStorage.setItem("name",data.name);
    // const extracted_token = localStorage.getItem('token');
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
    const thirdChild = nav.children[3]; 
    const adduserbtn = document.createElement("a")
    adduserbtn.textContent="Add user"
    adduserbtn.classList.add("adduserbtn")
    adduserbtn.setAttribute("href","/AddUser")
    adduserbtn.classList.remove("hide")
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
    console.log(nav)
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
                // document.getElementById("mode").innerHTML='Dual Mode'   
               
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
                // document.getElementById("mode").innerHTML='Solo Mode'   
        }
    })
}

fetch("/usersname",{
    method:"GET",
}).then((res)=>res.json())
.then((data)=>
{
    console.log(data)
})


// function themestate(){
//     fetch("/themeState", {
//         method: "POST"
//     }).then(res=>res.text())
//     .then(async(modes)=>{
        
//         if(modes=="Dark mode")
//             {
                
//                 document.getElementById("lightouter").classList.remove("shift-left")
//                 document.getElementById("lightouter").classList.add("shift-right") 
//                 document.getElementById("light").setAttribute("src","/img/dark-mode.png")
//                 document.getElementById("lmode").innerHTML='Dark mode'    
//             }
//         else{
//             document.getElementById("lightouter").classList.remove("shift-right")
//             document.getElementById("lightouter").classList.add("shift-left")  
//             document.getElementById("light").setAttribute("src","/img/lightmode.png")
//             document.getElementById("lmode").innerHTML='Light mode'   
//         }
//     })
// }

function themestate() {
    fetch("/themeState", {
        method: "POST"
    }).then(res => res.text())
    .then((modes) => {
        const body = document.body;
        const lightOuter = document.getElementById("lightouter");
        const light = document.getElementById("light");
        const lmode = document.getElementById("lmode");

        if (modes === "Dark mode") {
            body.classList.add("dark-mode");

            lightOuter.classList.remove("shift-left");
            lightOuter.classList.add("shift-right");
            light.setAttribute("src", "/img/dark-mode.png");
            lmode.innerHTML = "Dark mode";
        } else {
            body.classList.remove("dark-mode");

            lightOuter.classList.remove("shift-right");
            lightOuter.classList.add("shift-left");
            light.setAttribute("src", "/img/lightmode.png");
            lmode.innerHTML = "Light mode";
        }
    });
}



outer.addEventListener("click",async(event)=>
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
                        console.log(joinbtn,btn)
                        if(btn == undefined && joinbtn== undefined)
                        {
                            console.log("join function call hua")
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
    
        fetch("/getCurrent", { method: "GET" })
        .then((res) => {
            if (!res.ok) {
                throw new Error("Failed to fetch data");
            }
            return res.json();
        })
        .then((data) => {
    
            console.log("data",data)
            if (data.mode === "solo") {
                console.log("Mode: Solo");
                displaySoloMode(data.user);
            } else if (data.mode === "dual") {
                console.log("Mode: Dual");
                displayDualMode(data.users);
            }
        })
        .catch((error) => console.error("Error fetching current tasks:", error));
    
        event.stopPropagation();
    
})
    
    

fetch("/getCurrent", { method: "GET" })
    .then((res) => {
        if (!res.ok) {
            throw new Error("Failed to fetch data");
        }
        return res.json();
    })
    .then((data) => {

        console.log("data",data)
        if (data.mode === "solo") {
            console.log("Mode: Solo");
            displaySoloMode(data.user);
        } else if (data.mode === "dual") {
            console.log("Mode: Dual");
            displayDualMode(data.users);
        }
    })
.catch((error) => console.error("Error fetching current tasks:", error));

function displaySoloMode(user) {
    const name = user.tasks.name; 
    const progress = user.tasks.progress; 
    const tasks = user.tasks.tasks;

    console.log("Tasks:", tasks); // Debugging

    const lists = document.getElementById("lists"); 
    lists.innerHTML = ""; 

    // Add "My Day" and the date dynamically
    const myDayDiv = document.createElement("div");
    myDayDiv.classList.add("my-day");

    const title = document.createElement("h2");
    title.textContent = "My Day";

    const date = document.createElement("p");
    const today = new Date();
    const options = { weekday: "long", day: "numeric", month: "long" };
    date.textContent = today.toLocaleDateString("en-US", options);

    myDayDiv.appendChild(title);
    myDayDiv.appendChild(date);

    lists.appendChild(myDayDiv);

    if (tasks.length === 0) {
        if (!document.querySelector(".emptymsg")) {
            const div = document.createElement("div");
            div.classList.add("emptymsg");

            const img = document.createElement("img");
            img.setAttribute("src", "/img/notasks.png");
            img.classList.add("empty");

            const btn = document.createElement("div");
            btn.textContent = "Add items to lists";
            btn.id = "addTODO";
            btn.addEventListener('click', () => {
                document.getElementById('overlay').classList.add('show');
            });
            document.getElementById("progressValue").innerHTML = 0;
            div.appendChild(img);
            div.appendChild(btn);
            
            lists.appendChild(div);
        }
    } else {
        const flexContainer = document.createElement("div");
        flexContainer.classList.add("flex-container");

        tasks.forEach((task) => {
            console.log("Task:", task); // Debugging

            const main = document.createElement("div");
            main.classList.add("main");

            // First part: Image (icon section)
            const icon = document.createElement("div");
            icon.classList.add("icon");

            const skills = document.createElement("img");
            skills.classList.add("skills");
            skills.setAttribute("src", task.imgUrl || "/img/default.png"); // Fallback image

            icon.appendChild(skills);
            main.appendChild(icon);

            // Second part: Written content
            const writtenPart = document.createElement("div");
            writtenPart.classList.add("written-part");

            const title = document.createElement("h3");
            title.classList.add("title");
            title.textContent = task.title || "Untitled Task";

            const data = document.createElement("div");
            data.classList.add("data");
            data.textContent = task.data || "No details provided";

            const createdOn = document.createElement("div");
            createdOn.classList.add("created-on");
            createdOn.textContent = `Created on: ${task.created_at || "Unknown date"}`;

            writtenPart.appendChild(title);
            writtenPart.appendChild(data);
            writtenPart.appendChild(createdOn);
            main.appendChild(writtenPart);

            // Third part: Status and options
            const statusOptions = document.createElement("div");
            statusOptions.classList.add("status-options");

            // Status Button
            const statusButton = document.createElement("button");
            statusButton.classList.add("status-button", "pending"); // Set the initial class to 'pending'
            statusButton.textContent = "Pending..."; // Default text

            // Add click event to toggle status
            statusButton.addEventListener("click", () => {
                if (statusButton.classList.contains("pending")) {
                    statusButton.textContent = "Complete";
                    statusButton.classList.remove("pending");
                    statusButton.classList.add("complete");
                } else {
                    statusButton.textContent = "Pending...";
                    statusButton.classList.remove("complete");
                    statusButton.classList.add("pending");
                }
            });

            statusOptions.appendChild(statusButton);

            const options = document.createElement("div");
            options.classList.add("options");

            const edit = document.createElement("img");
            edit.setAttribute("src", "/img/editing.png");
            edit.classList.add("footer-icon");

            const del = document.createElement("img");
            del.setAttribute("src", "/img/bin.png");
            del.classList.add("footer-icon");

            const refresh = document.createElement("img");
            refresh.setAttribute("src", "/img/sync.png");
            refresh.classList.add("footer-icon");

            options.appendChild(edit);
            options.appendChild(del);
            options.appendChild(refresh);

            statusOptions.appendChild(options);
            main.appendChild(statusOptions);

                    flexContainer.appendChild(main);
        });

        lists.appendChild(flexContainer);
    }
}
        
//                 const moreElement = document.createElement("div");
//                 moreElement.classList.add("moreinfo")
//                 const created = document.createElement("div");
//                 const priority = document.createElement("div");
//                 const status = document.createElement("div");
        
//                 created.classList.add("more-element");
//                 status.classList.add("more-element");
//                 priority.classList.add("more-element");

        
//                 status.textContent = `Status: ${task.status}`;
//                 priority.textContent = `Priority: ${task.priority}`;
//                 created.textContent = `Created at: ${task.created_at}`;
        
//                 moreElement.appendChild(priority);
//                 moreElement.appendChild(created);
//                 moreElement.appendChild(status);
        
//                 icon.appendChild(more);
//                 icon.appendChild(moreElement);
//                 icon.appendChild(skills);
//                 main.appendChild(icon);
        
//                 // Title
//                 const title = document.createElement("h3");
//                 title.classList.add("title");
//                 title.textContent = task.title;
//                 main.appendChild(title);
        
//                 // Data
//                 const data = document.createElement("div");
//                 data.classList.add("data");
//                 data.textContent = task.data;
//                 main.appendChild(data);
        
//                 // Footer
//                 const footer = document.createElement("div");
//                 footer.classList.add("footer");
        
//                 const updationDiv = document.createElement("div");
//                 updationDiv.classList.add("updation-div");
        
//                 const del = document.createElement("img");
//                 const edit = document.createElement("img");
//                 const recycle = document.createElement("img");
        
//                 del.setAttribute("src", "/img/bin.png");
//                 del.classList.add("bin", "footer-icon");
        
//                 edit.setAttribute("src", "/img/editing.png");
//                 edit.classList.add("edit", "footer-icon");
        
//                 recycle.setAttribute("src", "/img/sync.png");
//                 recycle.classList.add("recycle", "footer-icon");
        
//                 updationDiv.appendChild(del);
//                 updationDiv.appendChild(edit);
//                 updationDiv.appendChild(recycle);
        
//                 footer.appendChild(updationDiv);
        
//                 const statusFooter = document.createElement("div");
//                 statusFooter.classList.add("status");
//                 statusFooter.textContent = "Complete";
        
//                 footer.appendChild(statusFooter);
        
//                 main.appendChild(footer);
        
//                 flexContainer.appendChild(main); // Corrected this line
//             });
        
//             lists.appendChild(flexContainer);
//         }
        
//     }
// }

// Function to display Dual Mode data
function displayDualMode(users) {
    console.log("Users:", users);
}

louter.addEventListener("click",async(event)=>
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

        event.stopPropagation();

    })
    


window.addEventListener("pageshow", (event) => {
    if (event.persisted || performance.getEntriesByType("navigation")[0].type === "back_forward") {
        checkAdduserState();
    }
});



async function sendroomID()
{
    await fetch("/accessUid",{
        method:"POST"
    }).then(res=>res.text())
    .then(async(data)=>
    {   
    
        const joinbtn = document.getElementsByClassName("joinroombtn")[0]
        const addbtn  = document.getElementsByClassName("adduserbtn")[0]

    
        if(data.length!=0 && data!="false")
        {
            await socket.emit("roomid",data)
    
            if(addbtn!=undefined && joinbtn!= undefined)
            {
                joinbtn.classList.add("hide")
                addbtn.classList.add("hide")
            }
        }else if(data=="false"){
               joinbtn.classList.remove("hide")
               addbtn.classList.remove("hide")
        }
        
    }
    )
    
    // fetch("/usersname",{
    //     method:"GET",
    // }).then((res)=>res.json())
    // .then((data)=>
    // {
    //     console.log(data)
    // })
    
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

socket.on("joineduser",()=>{
    console.log("i joined")

    fetch("/usersname",{
        method:"GET",
    }).then((res)=>res.json())
    .then((data)=>
    {
        console.log(data)
    })
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
    socket.emit("leaveme",(id))



})


// fetch("/accessUid",{
//     method:"POST"
// }).then(res=>res.text())
// .then(id=>
// {
//    if(id!=null)
//    {
//     fetch("/remove",{
//         method:"POST",
//         headers:{
//            "Content-Type": "application/json",
//         },
//         body:JSON.stringify({id:id})
//     }).then(()=>
//     {
//         checkAdduserState()
//     })
//    }
// })
    
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
    timerElement.textContent = `Time left: ${hours < 10 ? '0' : ''}${hours}:${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
   
    if ( `${hours < 10 ? '0' : ''}${hours}:${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`=== "23:56:55") {

     location.reload()

    }
    const progressPercentage = (currentSeconds / totalDaySeconds) * 100;
    progressFill.style.width = `${progressPercentage}%`;
}

const timer=setInterval(updateTimer, 1000);

// function startCountdown() {
   
    
    
//     timer.close()
    
//     updateTimer();
// }



function updateProgress(value) {
    const progressCircle = document.querySelector('.progress-circle');
    const progressValue = document.getElementById('progressValue');

    const radius = 70; 
    const circumference = 2 * Math.PI * radius; 
    const offset = circumference - (value / 100) * circumference;
    progressCircle.style.strokeDashoffset = offset;  
    progressValue.textContent = `${value}%`;
}


// make event listner when click on (task done) then fetch req krenge whn pr calculate hoke progress db me save ho jyegi or response me whi progress mil jyegi jo ki hum js se dom manipulate krk set krlenge  !!!!! 

setTimeout(() => updateProgress(0), 1000); 


const suggestedbtn=document.getElementById("suggestedbtn")

suggestedbtn.addEventListener("click",()=>
{
    fetch("/api/random-task",{
        method:"GET"
    }).then(res=>res.text())
    .then(task=>
    {
        document.getElementById("suggestedPara").innerHTML=task
    }
    )
})

document.getElementById('close').addEventListener('click', () => {
    document.getElementById('overlay').classList.remove('show');
});

document.getElementById("addit").addEventListener("click", (e) => {

    const category = document.getElementById('category').value;
    const title = document.getElementById('title').value;
    const priority = document.getElementById('priority').value;
    const data = document.getElementById('data').value;
   

    if(priority==="")
    {
        alert("Please select some Priority")
        return;
    }
    if(category==="")
    {
        alert("Please select some category")
        return;
    }
    
    const created_at = new Date().toLocaleString('en-IN', { 
        timeZone: 'Asia/Kolkata',
        hour12: true 
    }).slice(10,);
  
    console.log(created_at)
   
    const imgUrl = '/img/users.png';

    const task = {
        title: title,
        data: data,
        imgUrl: imgUrl,
        created_at: created_at,
        status: "pending", 
        priority: priority
    };

    
    fetch('/TODO', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            title: task.title,
            priority: task.priority,
            data: task.data,
            imgUrl: task.imgUrl,
            created_at: task.created_at
        })
    })
    .then(response => response.json())
    .then(data => {
        const lists = document.getElementById("lists")
        document.getElementById('title').value=""
        document.getElementById('data').value="";
     
        if (data.status === 'added') {
            if(document.getElementsByClassName("emptymsg")[0]){
                document.getElementsByClassName("emptymsg")[0].style.display="none"
            }
            if (!document.getElementsByClassName("flex-container")[0]) {
                const flexContainer = document.createElement("div");
                flexContainer.classList.add("flex-container");
                const taskDiv = document.createElement("div");
                taskDiv.classList.add("main")
                // taskDiv.style.border = "1px solid #ccc";
                // taskDiv.style.borderRadius = "8px";
                // taskDiv.style.padding = "10px";
                // taskDiv.style.width = "calc(33.33% - 1rem)";

                taskDiv.innerHTML = `
                    <div class="icon">
                        <img src="${task.imgUrl}" alt="${task.title}" class="skills"/>
                    </div>
                    <div class="written-part">
                        <h3 class="title">${task.title}</h3>
                        <p class="data">${task.data}</p>
                        <p class="created-on"><strong>Created on:</strong> ${task.created_at}</p>
                    </div>
                    <div class="status-options">
                        <button class="status-button ${task.status.toLowerCase()}">${task.status}</button>
                        <div class="options">
                            <img src="/img/editing.png" class="footer-icon" alt="edit" />
                            <img src="/img/bin.png" class="footer-icon" alt="delete" />
                            <img src="/img/sync.png" class="footer-icon" alt="refresh" />
                        </div>
                    </div>
                `;
          
                flexContainer.appendChild(taskDiv);
                lists.appendChild(flexContainer);
            }else{
            const taskDiv = document.createElement("div");
            taskDiv.classList.add("main")
            taskDiv.innerHTML = `
                <div class="icon">
                    <img src="${task.imgUrl}" alt="${task.title}" class="skills"/>
                </div>
                <div class="written-part">
                    <h3 class="title">${task.title}</h3>
                    <p class="data">${task.data}</p>
                    <p class="created-on"><strong>Created on:</strong> ${task.created_at}</p>
                </div>
                <div class="status-options">
                    <button class="status-button ${task.status.toLowerCase()}">${task.status}</button>
                    <div class="options">
                            <img src="/img/editing.png" class="footer-icon" alt="edit" />
                            <img src="/img/bin.png" class="footer-icon" alt="delete" />
                            <img src="/img/sync.png" class="footer-icon" alt="refresh" />
                        </div>
                </div>
            `;
          
            const container = document.getElementsByClassName("flex-container")[0];
            container.appendChild(taskDiv);
        }
            document.getElementById('overlay').classList.remove('show');

        }else {
            alert('Error adding task!');
        }

        
        if(data.mode == "dual") {
            console.log("message wala chala");
            socket.emit("message", (task, data.id));
        }

        
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while adding the task!');
    });
});

document.getElementById("plus").addEventListener("click",()=>
    {
        document.getElementById('overlay').classList.add('show');
    })


