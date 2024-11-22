let extracted_token
fetch('/api/login', {
    method: 'POST',
})
.then(response => response.json()) 
.then(data => {

    localStorage.setItem("token", data.token); 
    localStorage.setItem("id",data.id);
    extracted_token = localStorage.getItem('token');
})

window.addEventListener("pageshow", (event) => {
    if (event.persisted || performance.getEntriesByType("navigation")[0].type === "back_forward") {
        checkLoginState();
    }
});

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


const outer= document.getElementById("outer")
const ball =document.getElementById("ball")


fetch("/modeState", {
    method: "POST"
}).then(res=>res.text())
.then(modes=>{
    if(modes=="Dual Mode")
        {
            outer.classList.remove("shift-left")
            outer.classList.add("shift-right")   
        }
    else{
            outer.classList.remove("shift-right")
            outer.classList.add("shift-left")  
    }
})

outer.addEventListener("click",async()=>
{   const mode= document.getElementById("mode").innerHTML
    console.log(mode)
    
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
                    outer.classList.remove("shift-left")
                    outer.classList.add("shift-right")
                    document.getElementById("mode").innerHTML='Dual Mode'   
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
                {
                    outer.classList.remove("shift-right")
                    outer.classList.add("shift-left")
                    document.getElementById("mode").innerHTML='Solo Mode'           
                }
        }
        )
    }
})