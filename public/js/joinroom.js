const joinbtn = document.getElementById("joinbtn")

joinbtn.addEventListener("click",()=>
{   
    const id = document.getElementById("join-id").innerHTML
    console.log(id)
    document.getElementById("join-id").innerHTML=""
    fetch("/joined",{
        method:'POST',
        headers:{
            "Content-Type": "application/json",
        },
        body:JSON.stringify({id:id})
    })
})