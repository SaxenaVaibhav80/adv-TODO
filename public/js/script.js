const socket = io();

console.log("hiiii")

// const token = localStorage.getItem("token")

localStorage.setItem("reload","0")

socket.on("connect", () => {
    console.log("Connected to server. My socket ID:", socket.id);


    if (localStorage.getItem("reload") === "0") {
        localStorage.setItem("reload", "1");
    } else {
        localStorage.setItem("reload", "0");
        location.reload();  // Refresh page
    }
});


// window.addEventListener('online', () => {
//     window.location.href="/TODO"
// });


fetch('/api/login', {
    method: 'POST',
})
.then(response => response.json()) 
.then(data => {
    localStorage.setItem("token", data.token); 
    localStorage.setItem("id",data.id);
    localStorage.setItem("name",data.name);
    socket.emit("token",data.token)
    // const extracted_token = localStorage.getItem('token');
    // socket.emit("token",extracted_token)
})

checkAdduserState();
themestate()
getProgress()




window.addEventListener("pageshow", (event) => {
    if (event.persisted || performance.getEntriesByType("navigation")[0].type === "back_forward") {
        checkLoginState();
        themestate()
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
async function checktheme() {
    try {
        const response = await fetch("/api/themeState", {
            method: "GET"
        });
        const modes = await response.text();
        // console.log("modes : ", modes);
        return modes; 
    } catch (error) {
        console.error("Error fetching theme state:", error);
    }
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


function updateProgress(value) {
    console.log("progress1 value",value)
    const progressCircle = document.querySelector('.progress-circle');
    const progressValue = document.getElementById('progressValue');



    const radius = 70; 
    const circumference = 2 * Math.PI * radius; 
    const offset = circumference - (value / 100) * circumference;
    progressCircle.style.strokeDashoffset = offset;  
    progressValue.textContent = `${value}%`;

    const room = localStorage.getItem("room")
    const name = localStorage.getItem("name")
    if(localStorage.getItem("otheruserid")!=""){
        const progress=value
        // console.log("ab if ke ander ghussaaaa proress ke")
        socket.emit("otherProgress",{room,progress,name})
    }
}

function updateProgress2(value) {
    console.log("progress2 value",value)
    const progressCircle = document.querySelector('.progress-circle2');
    const progressValue = document.getElementById('progressValue2');

    const radius = 70; 
    const circumference = 2 * Math.PI * radius; 
    const offset = circumference - (value / 100) * circumference;
    progressCircle.style.strokeDashoffset = offset;  
    progressValue.textContent = `${value}%`;
}

async function deletetask(id)
{
    fetch("/deleteTask",{
        method:"POST",
        headers:{
            "Content-Type": "application/json",
        },
        body:JSON.stringify({taskid:id})
    }).then(res=>res.json())
    .then(async(response)=>
    {  
        getProgress()
        if(response.message=="deleted")
        {
           
            const taskElement = document.getElementById(response.id);
            const flexContainer = document.querySelector(".flex-container");
            // console.log(taskElement)
            if (taskElement) {
                console.log(taskElement)
                taskElement.remove()
            }
            console.log(flexContainer.children.length)
            if (flexContainer.children.length==0 || !flexContainer) {
                const emptyMessage = document.querySelector(".emptymsg");
                if (emptyMessage) {
                    emptyMessage.style.display = "block";
                }else{
                    const lists= document.getElementById("lists")
                    const div = document.createElement("div");
                    div.classList.add("emptymsg");
        
                    const img = document.createElement("img");
                    const theme = await checktheme()
                    if(theme =="Dark mode")
                    {
                        img.setAttribute("src", "/img/empty (1).png");
                    }else{
                        img.setAttribute("src", "/img/empty (2).png");
                    }
                    
                    img.classList.add("emptytwo");
        
                    const btn = document.createElement("div");
                    btn.textContent = "Add items to lists";
                    if(theme =="Dark mode")
                    {
                        btn.id = "addTODO";
                    }else{
                        btn.id = "addTODOLight";
                    }
                    
                    btn.classList.add("emptybtn")
                    btn.addEventListener('click', () => {
                        document.getElementById('overlay').classList.add('show');
                    });
                    document.getElementById("progressValue").innerHTML = "0%";
                    div.appendChild(img);
                    div.appendChild(btn);
                    
                    lists.appendChild(div);
                }
            }
    
        }
    }
    )
}

async function setstatus(id, status) {
    fetch("/setStatus", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ taskid: id, status: status })
    }).then(() => {
        // Task ka parent div dhoondo
        const taskDiv = document.getElementById(id);

        if (taskDiv) {
            if(status === "Completed"){
                const statusButton = taskDiv.querySelector(".status-option button");

                if (statusButton) {
                    statusButton.textContent = "Completed";
                    statusButton.classList.remove("pending");
                    statusButton.classList.add("complete");
                }
            }
            if(status==="Complete")
            {
                const statusButton = taskDiv.querySelector(".status-option button");

                if (statusButton) {
                    statusButton.textContent = "Complete";
                    statusButton.classList.add("pending");
                    statusButton.classList.remove("complete");
                }
            }
        }

        // Progress update karna
        getProgress();
    });
}


function addingRing2 ()
{
    const rightDiv = document.getElementById("right-slider");
                        
                          
    const progressRingWrapper = document.createElement("div");
    progressRingWrapper.id = "progress-ring2"; 


    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "150");
    svg.setAttribute("height", "150");
    svg.setAttribute("viewBox", "0 0 150 150");

    
    const backgroundCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    backgroundCircle.classList.add("progress-ring-circle2", "background-circle2");
    backgroundCircle.setAttribute("cx", "75");
    backgroundCircle.setAttribute("cy", "75");
    backgroundCircle.setAttribute("r", "65");
    backgroundCircle.setAttribute("stroke-width", "6");

    
    const progressCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    progressCircle.classList.add("progress-ring-circle2", "progress-circle2");
    progressCircle.setAttribute("cx", "75");
    progressCircle.setAttribute("cy", "75");
    progressCircle.setAttribute("r", "65");
    progressCircle.setAttribute("stroke-width", "6");

    
    svg.appendChild(backgroundCircle);
    svg.appendChild(progressCircle);

   
    const progressValue = document.createElement("div");
    progressValue.classList.add("progress-value");
    progressValue.id = "progressValue2"; 
    progressValue.textContent = "0%";

    const other = document.createElement("p")
    other.classList.add("other")
    other.textContent="other"
  
    progressRingWrapper.appendChild(svg);
    progressRingWrapper.appendChild(progressValue);
    progressRingWrapper.appendChild(other);

   
    const children = rightDiv.children; 
    if (children.length >= 3) {
        rightDiv.insertBefore(progressRingWrapper, children[3]); 
    } else {
        rightDiv.appendChild(progressRingWrapper); 
    }
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
    console.log("chala")
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
                localStorage.setItem("room","")
                localStorage.setItem("otheruserid","")
                document.getElementById("outer").classList.remove("shift-right")
                document.getElementById("outer").classList.add("shift-left")  
                document.getElementById("mode").innerHTML='Solo Mode'   
        }
    })
}

// fetch("/usersname",{
//     method:"GET",
// }).then((res)=>res.json())
// .then((data)=>
// {
//     console.log(data)
// })


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
    fetch("/api/themeState", {
        method: "GET"
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
                       if(document.getElementById("progress-ring2"))
                       {
                        
                       }
                       localStorage.setItem("otheruserid","")
                       localStorage.setItem("room","")
                       if(document.getElementById("users"))
                       {
                        const nav = document.getElementsByClassName("navbar")[0]
                        const users= document.getElementById("users")
                        nav.removeChild(users)
                       }
                       if(modes.joinid!=null)
                       {
                        socket.emit("todisconnect",modes.joinid)
                        fetch("/makeMyRoomidEmpty",{
                            method:"POST",
                            headers:{
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({ roomid:modes.joinid,mode:"Solo Mode"}),
                        })
                       }else if(modes.roomid!=null){
                        socket.emit("todisconnect",modes.roomid)
                        fetch("/makeMyRoomidEmpty",{
                            method:"POST",
                            headers:{
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({ roomid:modes.roomid,mode:"Solo Mode"}),
                        })
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

        // console.log("data",data.users)
        if (data.mode === "solo") {
            console.log("Mode: Solo");
            displaySoloMode(data.user);
        } else if (data.mode === "dual") {
            console.log("Mode: Dual");
            console.log(data)
            displayDualMode(data.users);
        }
    })
.catch((error) => console.error("Error fetching current tasks:", error));


async function displaySoloMode(user) {

    const name = user.tasks.name; 
    const progress = user.tasks.progress; 
    const tasks = user.tasks.tasks;

    const lists = document.getElementById("lists"); 
    lists.innerHTML = ""; 


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
            const theme = await checktheme()
            console.log(theme)
            if(theme =="Dark mode")
            {
                img.setAttribute("src", "/img/empty (1).png");
            }else{
                img.setAttribute("src", "/img/empty (2).png");
            }
            
            img.classList.add("empty");

            const btn = document.createElement("div");
            btn.textContent = "Add items to lists";
            btn.classList.add("emptybtn")
            if(theme=="Dark mode")
            {
                btn.id = "addTODO";
            }else{
                btn.id="addTODOLight"
            }
            
            btn.addEventListener('click', () => {
                document.getElementById('overlay').classList.add('show');
            });
            document.getElementById("progressValue").innerHTML = `${0}%`;
            div.appendChild(img);
            div.appendChild(btn);
            
            lists.appendChild(div);
        }
    } else {
        const flexContainer = document.createElement("div");
        flexContainer.classList.add("flex-container");

        tasks.forEach((task) => {

            const main = document.createElement("div");
            main.classList.add("main");
            main.id=`${task._id}` 

            const icon = document.createElement("div");
            icon.classList.add("icon");

            const skills = document.createElement("img");
            skills.classList.add("skills");
            skills.setAttribute("src", task.imgUrl || "/img/default.png");

            icon.appendChild(skills);
            main.appendChild(icon);

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
            createdOn.innerHTML = `<strong>Created on:</strong> ${task.created_at || "Unknown date"}`;
            writtenPart.appendChild(title);
            writtenPart.appendChild(data);
            writtenPart.appendChild(createdOn);
            main.appendChild(writtenPart);

           
            const statusOptions = document.createElement("div");
            statusOptions.classList.add("status-options");

            const statusButton = document.createElement("button");
            statusButton.classList.add("status-button", "pending");
            statusButton.textContent = task.status;

            statusButton.addEventListener("click", async() => {
                if (statusButton.classList.contains("pending")) {
                    await setstatus(task._id,"Completed")
                    // statusButton.textContent = "Completed";
                    // statusButton.classList.remove("pending");
                    // statusButton.classList.add("complete");
                } 
            });

            statusOptions.appendChild(statusButton);

            const options = document.createElement("div");
            options.classList.add("options");

            const edit = document.createElement("img");
            edit.setAttribute("src", "/img/editing.png");
            edit.classList.add("footer-icon");
            edit.classList.add("edit");
    

            const del = document.createElement("img");
            del.setAttribute("src", "/img/bin.png");
            del.classList.add("footer-icon");
            del.classList.add("delete");
            del.addEventListener("click",()=>
            {
               deletetask(task._id)

            })
    
            const refresh = document.createElement("img");
            refresh.setAttribute("src", "/img/sync.png");
            refresh.classList.add("footer-icon");
            refresh.classList.add("refresh");

            refresh.addEventListener("click",async()=>{
            
               await setstatus(task._id,"Complete") 
            })
    

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

function clickUser1()
{
        console.log("1")
        const user1=document.getElementById("user1")
        const user2 = document.getElementById("user2")
        if(user2)
        {
          user2.style.backgroundColor=" #a7a7b4"
          user2.style.padding = "2px 10px";
          user2.style.cursor = "pointer";
          user2.style.borderRadius = "5px";
          user2.style.color="white"
          user2.style.marginLeft = "20px";
        }
        
        if(user1)
        {
            user1.style.backgroundColor=" #80808b"
            user1.style.padding = "2px 10px";
            user1.style.color="white"
            user1.style.cursor = "pointer";
            user1.style.borderRadius = "5px";
            user1.style.marginLeft = "20px";
        }
        const storedName = localStorage.getItem("name")
        fetch("/getCurrent", { method: "GET" })
        .then((res) => {
            if (!res.ok) {
                throw new Error("Failed to fetch data");
            }
            return res.json();
        })
        .then((data) => {
    
        const users= data.users
        const lists = document.getElementById("lists"); 
        lists.innerHTML = ""; 
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
        if(users!=null)
        {
            users.forEach(async(user) => {
                if (user.tasks.name === storedName) {
                    localStorage.setItem("selected",user.tasks.name)
                    if(user.tasks.tasks.length===0)
                    {
                        if (!document.querySelector(".emptymsg")) {
                            const div = document.createElement("div");
                            div.classList.add("emptymsg");
                
                            const img = document.createElement("img");
                            const theme = await checktheme()
                            // console.log(theme)
                            if(theme =="Dark mode")
                            {
                                img.setAttribute("src", "/img/empty (1).png");
                            }else{
                                img.setAttribute("src", "/img/empty (2).png");
                            }
                            
                            img.classList.add("empty");
                
                            const btn = document.createElement("div");
                            btn.textContent = "Add items to lists";
                            btn.classList.add("emptybtn")
                            if(theme=="Dark mode")
                            {
                                btn.id = "addTODO";
                            }else{
                                btn.id="addTODOLight"
                            }
                            
                            btn.addEventListener('click', () => {
                                document.getElementById('overlay').classList.add('show');
                            });
                            document.getElementById("progressValue").innerHTML =  `${0}%`;
                            div.appendChild(img);
                            div.appendChild(btn);
                            
                            lists.appendChild(div);
                        }
                    }
                    else{
                        localStorage.setItem("selected",user.tasks.name)
                        const flexContainer = document.createElement("div");
                    flexContainer.classList.add("flex-container");
                    user.tasks.tasks.forEach(task=>
                    {
                        const main = document.createElement("div");
                        main.classList.add("main");
                        main.id=`${task._id}` 
            
                        const icon = document.createElement("div");
                        icon.classList.add("icon");
            
                        const skills = document.createElement("img");
                        skills.classList.add("skills");
                        skills.setAttribute("src", task.imgUrl || "/img/default.png");
            
                        icon.appendChild(skills);
                        main.appendChild(icon);
            
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
                        createdOn.innerHTML = `<strong>Created on:</strong> ${task.created_at || "Unknown date"}`;
    
                        writtenPart.appendChild(title);
                        writtenPart.appendChild(data);
                        writtenPart.appendChild(createdOn);
                        main.appendChild(writtenPart);
            
                       
                        const statusOptions = document.createElement("div");
                        statusOptions.classList.add("status-options");
            
                        const statusButton = document.createElement("button");
                        statusButton.classList.add("status-button", "pending");
                        statusButton.textContent = task.status;
            
                        statusButton.addEventListener("click", async() => {
                            if (statusButton.classList.contains("pending")) {
                                await setstatus(task._id,"Completed")
                                // statusButton.textContent = "Completed";
                                // statusButton.classList.remove("pending");
                                // statusButton.classList.add("complete");
                            } 
                        });
            
                        statusOptions.appendChild(statusButton);
            
                        const options = document.createElement("div");
                        options.classList.add("options");
            
                        const edit = document.createElement("img");
                        edit.setAttribute("src", "/img/editing.png");
                        edit.classList.add("footer-icon");
                        edit.classList.add("edit");
                
            
                        const del = document.createElement("img");
                        del.setAttribute("src", "/img/bin.png");
                        del.classList.add("footer-icon");
                        del.classList.add("delete");
                        del.addEventListener("click",()=>
                        {
                           deletetask(task._id)
            
                        })
                
                        const refresh = document.createElement("img");
                        refresh.setAttribute("src", "/img/sync.png");
                        refresh.classList.add("footer-icon");
                        refresh.classList.add("refresh");
            
                        refresh.addEventListener("click",async()=>{
                        
                           await setstatus(task._id,"Complete")
                        //    statusButton.textContent = "Complete";
                        //    statusButton.classList.add("pending");
                        //    statusButton.classList.remove("complete");
                           
                        })
                
            
                        options.appendChild(edit);
                        options.appendChild(del);
                        options.appendChild(refresh);
            
                        statusOptions.appendChild(options);
                        main.appendChild(statusOptions);
            
                        flexContainer.appendChild(main);
                    })
                    lists.appendChild(flexContainer);
                    }
                }
            });
        }
        
        })
        .catch((error) => console.error("Error fetching current tasks:", error));
}


function clickUser2()
{
    console.log("user22222")
    const user1=document.getElementById("user1")
    const user2 = document.getElementById("user2")
    if(user1)
    {
      user1.style.backgroundColor=" #a7a7b4"
      user1.style.padding = "2px 10px";
      user1.style.cursor = "pointer";
      user1.style.color="white"
      user1.style.borderRadius = "5px";
      user1.style.marginLeft = "20px";
    }
    
    if(user2)
    {
        user2.style.backgroundColor=" #80808b"
        user2.style.padding = "2px 10px";
        user2.style.cursor = "pointer";
        user2.style.color="white"
        user2.style.borderRadius = "5px";
        user2.style.marginLeft = "20px";
    }
  
    const storedName = localStorage.getItem("name")
    fetch("/getCurrent", { method: "GET" })
    .then((res) => {
        if (!res.ok) {
            throw new Error("Failed to fetch data");
        }
        return res.json();
    })
    .then((data) => {

    const users = data.users
    console.log(users)
    const lists = document.getElementById("lists"); 
    lists.innerHTML = ""; 
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
    if(users!=null)
    {
        users.forEach(async(user) => {
            if (user.tasks.name != storedName) {
                localStorage.setItem("selected",user.tasks.name)
                if(user.tasks.tasks.length===0)
                    {
                        if (!document.getElementsByClassName("emptymsg")[0]) {
                            const div = document.createElement("div");
                            div.classList.add("emptymsg");
                
                            const img = document.createElement("img");
                            const theme = await checktheme()
                            console.log(theme)
                            if(theme =="Dark mode")
                            {
                                img.setAttribute("src", "/img/empty (1).png");
                            }else{
                                img.setAttribute("src", "/img/empty (2).png");
                            }
                            
                            img.classList.add("empty");
                
                            const btn = document.createElement("div");
                            btn.textContent = "Add items to lists";
                            btn.classList.add("emptybtn")
                            if(theme=="Dark mode")
                            {
                                btn.id = "addTODO";
                            }else{
                                btn.id="addTODOLight"
                            }
                            
                            btn.addEventListener('click', () => {
                                document.getElementById('overlay').classList.add('show');
                            });
                            // -------------------------------------------------------------------------->
                            
                            div.appendChild(img);
                            div.appendChild(btn);
                            
                            lists.appendChild(div);
                        } 
                    }
                    else{
                        localStorage.setItem("selected",user.tasks.name)
                        const flexContainer = document.createElement("div");
                        flexContainer.classList.add("flex-container");
                user.tasks.tasks.forEach(task=>
                {
                    const main = document.createElement("div");
                    main.classList.add("main");
                    main.id=`${task._id}` 
        
                    const icon = document.createElement("div");
                    icon.classList.add("icon");
        
                    const skills = document.createElement("img");
                    skills.classList.add("skills");
                    skills.setAttribute("src", task.imgUrl || "/img/default.png");
        
                    icon.appendChild(skills);
                    main.appendChild(icon);
        
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
                    createdOn.innerHTML = `<strong>Created on:</strong> ${task.created_at || "Unknown date"}`;
                    const strong = document.createElement("strong")
                    strong.appendChild(createdOn)
    
                    writtenPart.appendChild(title);
                    writtenPart.appendChild(data);
                    writtenPart.appendChild(createdOn);
                    main.appendChild(writtenPart);
        
                   
                    const statusOptions = document.createElement("div");
                    statusOptions.classList.add("status-options");
        
                    const statusButton = document.createElement("button");
                    statusButton.classList.add("status-button", "pending");
                    statusButton.textContent = task.status;
    
                    statusOptions.appendChild(statusButton);
        
                    // const options = document.createElement("div");
                    // options.classList.add("options");
        
                    // const edit = document.createElement("img");
                    // edit.setAttribute("src", "/img/editing.png");
                    // edit.classList.add("footer-icon");
                    // edit.classList.add("edit");
            
        
                    // const del = document.createElement("img");
                    // del.setAttribute("src", "/img/bin.png");
                    // del.classList.add("footer-icon");
                    // del.classList.add("delete");
                    // del.addEventListener("click",()=>
                    // {
                    //     console.log(task._id)
                    //    deletetask(task._id)
        
                    // })
            
                    // const refresh = document.createElement("img");
                    // refresh.setAttribute("src", "/img/sync.png");
                    // refresh.classList.add("footer-icon");
                    // refresh.classList.add("refresh");
        
                    // refresh.addEventListener("click",async()=>{
                    
                    //    await setstatus(task._id,"Complete")
                    //    statusButton.textContent = "Complete";
                    //    statusButton.classList.add("pending");
                    //    statusButton.classList.remove("complete");
                       
                    // })
            
        
                    // options.appendChild(edit);
                    // options.appendChild(del);
                    // options.appendChild(refresh);
        
                    // statusOptions.appendChild(options);
                    main.appendChild(statusOptions);
        
                    flexContainer.appendChild(main);
                })
                lists.appendChild(flexContainer);
                }
            }
        });
    }
    }).catch((error) => console.error("Error fetching current tasks:", error)); 
}


function displayDualMode(users) {
    console.log("Users:", users);
    const lists = document.getElementById("lists"); 
    lists.innerHTML = ""; 


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

    if (!document.getElementById("users")) {
        console.log("users.length", users.length)
        if(users.length==2)
        {
            if (!document.getElementById("progress-ring2")) {
                addingRing2()
                document.getElementsByClassName("progress-ring")[0].classList.add("progress-ring-shift")
                document.getElementsByClassName("progress-ring")[0].classList.remove("progress-ring")

                document.getElementById("timer").id="timer-shift"
                document.getElementById("progress-bar").id="progress-bar-shift"
             }
            const div = document.createElement("div");
            div.id = "users";
            const user1 = document.createElement("p");
            user1.id = "user1";
            const user2 = document.createElement("p");
            user2.id = "user2";
            div.appendChild(user1);
            div.appendChild(user2);
            user1.style.backgroundColor=" #80808b"
            user1.style.padding = "2px 10px";
            user1.style.cursor = "pointer";
            user1.style.borderRadius = "5px";
            user1.style.marginLeft = "20px";
            const nav = document.getElementsByClassName("navbar")[0]
            nav.prepend(div);
        }
        if(users.length===1)
        {

            const div = document.createElement("div");
            div.id = "users";
            const user1 = document.createElement("p");
            user1.id="user1"
            user1.style.backgroundColor=" #80808b"
            user1.style.padding = "2px 10px";
            user1.style.cursor = "pointer";
            user1.style.borderRadius = "5px";
            user1.style.marginLeft = "20px";
            div.appendChild(user1);
            const nav = document.getElementsByClassName("navbar")[0]
            nav.prepend(div);
        }
        
    }
    const storedName = localStorage.getItem("name");
    localStorage.setItem("selected",storedName)
    const user1Element = document.getElementById("user1");
    const user2Element = document.getElementById("user2");

    clickUser1()

    if(user1Element || user1Element!=null){

        user1Element.addEventListener("click",()=>
            {
                clickUser1()
            })
    }
    
 if(user2Element || user2Element!=null)
    {
        user2Element.removeEventListener("click", clickUser2); // Works only if `clickUser2` was previously added
        user2Element.addEventListener("click", clickUser2);
    }

    users.forEach(user => {
        if (user.tasks.name === storedName) {
            user1Element.textContent = user.tasks.name
        } else {
            user2Element.textContent = user.tasks.name
            localStorage.setItem("otheruserid",user.tasks.id)
            const otherid = localStorage.getItem("otheruserid")
            // console.log("oyherid :" , otherid)
            getProgress2(otherid)

        }
    });

    
}

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
                        const addtaskbtn= document.getElementsByClassName("emptybtn")[0]
                        if(addtaskbtn || addtaskbtn!=undefined)
                        {
                            addtaskbtn.id="addTODO"
                        }   
                        const body = document.body;
                        const emptybox = document.getElementsByClassName("empty")[0]
                        if(emptybox)
                        {
                            emptybox.setAttribute("src", "/img/empty (1).png");
                        }
                        body.classList.add("dark-mode");
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
                        const body = document.body;
                        const addtaskbtn= document.getElementsByClassName("emptybtn")[0]
                        if(addtaskbtn || addtaskbtn!=undefined)
                        {
                            addtaskbtn.id="addTODOLight"
                        }     
                        body.classList.remove("dark-mode");
                        const emptybox = document.getElementsByClassName("empty")[0]
                        if(emptybox)
                        {
                            emptybox.setAttribute("src", "/img/empty (2).png");
                        }
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
            localStorage.setItem("room",data)
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

socket.on("joineduser", (data) => {
    console.log("I joined");
    const name = data.name
    console.log(name,"outer")
    const userid = data.userid
    if (localStorage.getItem("name") !== name) {
        // console.log("@@@@@@@@@@@@@@@@@@-----@@@@@@@@@@@@@@@");
        const user2 = document.getElementById("user2")
        localStorage.setItem("otheruserid",userid)

        if (!user2 || user2.innerHTML.length === 0) {
            const user= document.createElement("p")
            user.id="user2"
            console.log(name,"inner")
            user.textContent = name;
            const users= document.getElementById("users")
            users.append(user)
            
            const div = document.createElement("div");
            div.textContent = `${name} added`;
            div.id = "notify";
            const mid= document.getElementById("mid")
            mid.prepend(div)


            setTimeout(() => {
                div.classList.add("hidden");
                div.id=""
            }, 2000);
        }
        const other = document.getElementById("user2")
        if(other)
        {    
            // console.log("kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk")
            other.addEventListener("click",()=>
                {
                    clickUser2()
                })
        }
    }


        if (!document.getElementById("progress-ring2")) {
            addingRing2()
            const otherid = localStorage.getItem("otheruserid")
            const selfid = localStorage.getItem("id")

            // console.log("otherid",otherid)
            // console.log("selfid",selfid)
            if(otherid)
            {
                getProgress2(otherid)
            }
            if(selfid)
            {
                getProgress()
            }
            
           
            document.getElementsByClassName("progress-ring")[0].classList.add("progress-ring-shift")
            document.getElementsByClassName("progress-ring")[0].classList.remove("progress-ring")
            document.getElementById("timer").id="timer-shift"
            document.getElementById("progress-bar").id="progress-bar-shift"
        }
        
});


// socket.on("data",(info)=>
// {
//     console.log(info)
// })

socket.on("force_leave",(id)=>
{  
    // console.log("i got leave message ")
    // fech krk db me roomid ki value null karwao 
    const usersList = document.getElementById("users")
    if (usersList) {
        // console.log("userList", usersList);
    
       
        const userNames = usersList.querySelectorAll("p"); 
    
        userNames.forEach((name) => {
            const self = localStorage.getItem("name")
            if(name.textContent!==self)
            {
                localStorage.setItem("otheruserid","")

        fetch("/getCurrent", { method: "GET" })
        .then((res) => {
            if (!res.ok) {
                throw new Error("Failed to fetch data");
            }
            return res.json();
        })
        .then((data) => {
    
            // console.log("data",data)
            if (data.mode === "solo") {
                // console.log("Mode: Solo");
                displaySoloMode(data.user);
            } else if (data.mode === "dual") {
                // console.log("Mode: Dual");
                displayDualMode(data.users);
            }
        })
        .catch((error) => console.error("Error fetching current tasks:", error));

       

            }
        });
    }

    if(document.getElementById("progress-ring2"))
        {

           
            const rightDiv = document.getElementById("right-slider");
            const ring = document.getElementById("progress-ring2")
            const mainRing=document.getElementsByClassName("progress-ring-shift")[0]
            mainRing.classList.add("progress-ring")
            mainRing.classList.remove("progress-ring-shift")
            document.getElementById("timer-shift").id="timer"
            document.getElementById("progress-bar-shift").id="progress-bar"
            rightDiv.removeChild(ring)

        }
   
    if(document.getElementById("users"))
        {
         const nav = document.getElementsByClassName("navbar")[0]
         const users= document.getElementById("users")
         nav.removeChild(users)
        }
   
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
   
    if ( `${hours < 10 ? '0' : ''}${hours}:${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`=== "23:57:55") {

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



socket.on("setOtherProgress",(data)=>
{
    console.log("data :",data)
    if(localStorage.getItem("name")!=data.name)
    {   console.log("two")
        updateProgress2(data.progress);
    }
})

function getProgress() {
    console.log("Fetching progress...");
    fetch("/getProgress", {
        method: "GET",
    })
        .then((res) => res.json()) 
        .then((data) => {


            if (data.progress !== undefined) {
                // console.log("getprogresschalaaaa")
                // const progress= data.progress
                // const room = localStorage.getItem("room")
                // const name = localStorage.getItem("name")
                // if(localStorage.getItem("otheruserid")!=""){
                //     // console.log("ab if ke ander ghussaaaa proress ke")
                //     socket.emit("otherProgress",{room,progress,name})
                // }
                setTimeout(() => {
                    updateProgress(data.progress); 
                }, 1000);
            } else {
                console.error("Progress value not found in response");
            }
        })
        .catch((err) => {
            alert("No internet")
        });
}


function getProgress2(id) {

    // console.log("getProgress2 chala")
    fetch("/otherProgress", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }), // Sending data in the body
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.progress !== undefined) {
                setTimeout(() => {
                    updateProgress2(data.progress); 
                }, 1000);
            } else {
                console.error("Progress value not found in response");
            }
        })
        .catch((error) =>  alert("No internet"));
}


// const selfid= localStorage.getItem("id")
// console.log(selfid)
// if(selfid)
// {
//     getProgress(selfid)
// }





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
        status: "Complete", 
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
        getProgress()
        const lists = document.getElementById("lists")
        document.getElementById('title').value=""
        document.getElementById('data').value="";
     
        if (data.status === 'added' && data.mode=="solo") {
            if(document.getElementsByClassName("emptymsg")[0]){
                document.getElementsByClassName("emptymsg")[0].style.display="none"
            }
            if (!document.getElementsByClassName("flex-container")[0]) {
                const flexContainer = document.createElement("div");
                flexContainer.classList.add("flex-container");
                const taskDiv = document.createElement("div");
                taskDiv.classList.add("main")
                taskDiv.id=`${data.taskid}` 
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
                            <img src="/img/editing.png" class="footer-icon edit ${data.taskid}" alt="edit" />
                            <img src="/img/bin.png" class="footer-icon delete ${data.taskid}" alt="delete" />
                            <img src="/img/sync.png" class="footer-icon refresh ${data.taskid}" alt="refresh" />
                        </div>
                    </div>
                `;
          
                flexContainer.appendChild(taskDiv);
                lists.appendChild(flexContainer);

                taskDiv.querySelector(".delete").addEventListener("click",()=>
                    {
                        deletetask(data.taskid)
                    })
    

                taskDiv.querySelector(".status-button").addEventListener("click",async()=>
                {   
                    const statusButton=taskDiv.querySelector(".status-button")
                    if (statusButton.innerHTML=="Complete") {
                        await setstatus(data.taskid,"Completed")
                        // statusButton.textContent = "Completed";
                        // statusButton.classList.remove("pending");
                        // statusButton.classList.add("complete");
                    } 
                })

                taskDiv.querySelector(".refresh").addEventListener("click",async()=>
                {   const statusButton=taskDiv.querySelector(".status-button")
                    if (taskDiv.querySelector(".status-button").innerHTML=="Completed") {
                        await setstatus(data.taskid,"Complete")
                        // statusButton.textContent = "Complete";
                        // statusButton.classList.add("pending");
                        // statusButton.classList.remove("complete");
    
                    } 
                })


            }else{

                getProgress()
                const taskDiv = document.createElement("div");
                taskDiv.classList.add("main")
                taskDiv.id=`${data.taskid}`
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
                                <img src="/img/editing.png" class="footer-icon edit" alt="edit" />
                                <img src="/img/bin.png" class="footer-icon delete" alt="delete" />
                                <img src="/img/sync.png" class="footer-icon refresh" alt="refresh" />
                        </div>
                    </div>
                `;
                taskDiv.querySelector(".status-button").addEventListener("click",async()=>
                {   const statusButton=taskDiv.querySelector(".status-button")
                    if (taskDiv.querySelector(".status-button").innerHTML=="Complete") {
                        await setstatus(data.taskid,"Completed")
                        // statusButton.textContent = "Completed";
                        // statusButton.classList.remove("pending");
                        // statusButton.classList.add("complete");
    
                    } 
                })
    
                taskDiv.querySelector(".refresh").addEventListener("click",async()=>
                {   const statusButton=taskDiv.querySelector(".status-button")
                    if (taskDiv.querySelector(".status-button").innerHTML=="Completed") {
                        await setstatus(data.taskid,"Complete")
                    // statusButton.textContent = "Complete";
                    // statusButton.classList.add("pending");
                    // statusButton.classList.remove("complete");

                } 
                })
                const container = document.getElementsByClassName("flex-container")[0];
                container.appendChild(taskDiv);


            
                taskDiv.querySelector(".delete").addEventListener("click",()=>
                    {
                        deletetask(data.taskid)
                    })
    
            
            }

            document.getElementById('overlay').classList.remove('show');

        }

        
        if(data.mode == "dual" && data.status==="added") {
            // console.log("message wala chala");
            // console.log(task)
            const sender = localStorage.getItem("name")
            console.log("sala sender",sender)
            socket.emit("message", [task, data.id,sender,data.taskid]);

            document.getElementById('overlay').classList.remove('show');
        }

        
    })
    .catch(error => {
        console.error('Error:', error);
        alert('No internet');
    });
});





socket.on("dualtask",async(data)=>
{




    // const verifyResponse = await fetch("/getVerify");
    // const verifyData = await verifyResponse.json();

    // if (verifyData.status !== "ok") {
    //     alert("Session expired, please log in again.");
    //     window.location.href="/logout"
    //     return;
    // }

    const task = data[0]
    const taskid = data[2]
    // console.log(taskid)

    // console.log("name",localStorage.getItem("name"))
    // console.log("selected",localStorage.getItem("selected"))
    // console.log("sender",data[1])

    if(localStorage.getItem("selected")===data[1] && localStorage.getItem("name")==data[1])
    {
        if(document.getElementsByClassName("emptymsg")[0]){
            document.getElementsByClassName("emptymsg")[0].style.display="none"
        } 

        const lists = document.getElementById("lists"); 

     // ------------------------------------------------------------------------------------------------------------------------------------------------->>

        if (!document.getElementsByClassName("flex-container")[0]) {
            const flexContainer = document.createElement("div");
            flexContainer.classList.add("flex-container");
            const taskDiv = document.createElement("div");
            taskDiv.classList.add("main")
            taskDiv.id=`${taskid}` 
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
                        <img src="/img/editing.png" class="footer-icon edit ${taskid}" alt="edit" />
                        <img src="/img/bin.png" class="footer-icon delete ${taskid}" alt="delete" />
                        <img src="/img/sync.png" class="footer-icon refresh ${taskid}" alt="refresh" />
                    </div>
                </div>
            `;
        
            flexContainer.appendChild(taskDiv);
            lists.appendChild(flexContainer);
        
            taskDiv.querySelector(".delete").addEventListener("click",()=>
                {
                    deletetask(taskid)
                })
        
        
            taskDiv.querySelector(".status-button").addEventListener("click",async()=>
            {   
                const statusButton=taskDiv.querySelector(".status-button")
                console.log(statusButton)
                if (statusButton.innerHTML=="Complete") {
                    console.log("completed")
                    await setstatus(taskid,"Completed")
                    // statusButton.textContent = "Completed";
                    // statusButton.classList.remove("pending");
                    // statusButton.classList.add("complete");
                } 
            })
        
            taskDiv.querySelector(".refresh").addEventListener("click",async()=>
            {   const statusButton=taskDiv.querySelector(".status-button")
                console.log("refresssss")
                if (taskDiv.querySelector(".status-button").innerHTML=="Completed") {
                    await setstatus(taskid,"Complete")
                    // statusButton.textContent = "Complete";
                    // statusButton.classList.add("pending");
                    // statusButton.classList.remove("complete");
        
                } 
            })
        
        
        }else{
        
            getProgress()
            const taskDiv = document.createElement("div");
            taskDiv.classList.add("main")
            taskDiv.id=`${taskid}`
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
                            <img src="/img/editing.png" class="footer-icon edit" alt="edit" />
                            <img src="/img/bin.png" class="footer-icon delete" alt="delete" />
                            <img src="/img/sync.png" class="footer-icon refresh" alt="refresh" />
                    </div>
                </div>
            `;
            taskDiv.querySelector(".status-button").addEventListener("click",async()=>
            {   const statusButton=taskDiv.querySelector(".status-button")
                if (taskDiv.querySelector(".status-button").innerHTML=="Complete") {
                    await setstatus(taskid,"Completed")
                    // statusButton.textContent = "Completed";
                    // statusButton.classList.remove("pending");
                    // statusButton.classList.add("complete");
        
                } 
            })
        
            taskDiv.querySelector(".refresh").addEventListener("click",async()=>
            {   const statusButton=taskDiv.querySelector(".status-button")
                if (taskDiv.querySelector(".status-button").innerHTML=="Completed") {
                    await setstatus(taskid,"Complete")
                // statusButton.textContent = "Complete";
                // statusButton.classList.add("pending");
                // statusButton.classList.remove("complete");
        
            } 
            })
            const container = document.getElementsByClassName("flex-container")[0];
            container.appendChild(taskDiv);
        
        
        
            taskDiv.querySelector(".delete").addEventListener("click",()=>
                {
                    deletetask(taskid)
                })
        
        
        }
    
    }
    else if(localStorage.getItem("selected")===data[1] && localStorage.getItem("name")!=data[1])
    {

        // console.log("del ni rhega")
         // isme jo tag bnaogi , usme delete , reload or edit ke feature  nahi honge 
         if(document.getElementsByClassName("emptymsg")[0]){
            document.getElementsByClassName("emptymsg")[0].style.display="none"
        } 
    
        // isme jo tag bnaogi , usme delete , reload or edit ke feature honge 
        const lists = document.getElementById("lists"); 
    
        // ------------------------------------------------------------------------------------------------------------------------------------------------->>
    
        if (!document.getElementsByClassName("flex-container")[0]) {

            console.log("receiver , not")
            const flexContainer = document.createElement("div");
            flexContainer.classList.add("flex-container");
            const taskDiv = document.createElement("div");
            taskDiv.classList.add("main")
            taskDiv.id=`${taskid}` 
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
                </div>
            `;
        
            flexContainer.appendChild(taskDiv);
            lists.appendChild(flexContainer);
        }else{
        
            getProgress()
            const taskDiv = document.createElement("div");
            taskDiv.classList.add("main")
            taskDiv.id=`${taskid}`
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
                </div>
            `;
            const container = document.getElementsByClassName("flex-container")[0];
            container.appendChild(taskDiv);        
        }      
    }

    document.getElementById('overlay').classList.remove('show');
})




document.getElementById("plus").addEventListener("click",()=>
{
    document.getElementById('overlay').classList.add('show');
})


