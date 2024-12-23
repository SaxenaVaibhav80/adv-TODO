
const token = localStorage.getItem('token')
const generatebtn = document.getElementById("generate-url-btn")
const btns= document.getElementById("btns")
const uidDiv = document.getElementById("uid")
const userid= localStorage.getItem("id")

function getuid ()
{

    fetch("/getuid",{
        method:'POST'
    }).then(res=>res.text())
    .then(id=>
    {
        uidDiv.innerHTML=id
        fetch("/setuid",{
            method:'POST',
            headers:{
                "Content-Type": "application/json",
            },
            body:JSON.stringify({uid:id,userid:userid})
        })
    }
    )
}


generatebtn.addEventListener("click",()=>
{   
    const copybtn=document.getElementsByClassName("copy")[0]
    if(copybtn==undefined)
    {
        generatebtn.classList.add("hide")
        const newbtn = document.createElement("div")
        newbtn.classList.add("copy")
        newbtn.textContent="Copy ID and Create room"
        getuid ()
        newbtn.addEventListener("click", () => {
        const uidText = uidDiv.textContent;
        navigator.clipboard.writeText(uidText).then(() => {
            window.location.href="/TODO"
        }).catch(err => {
            console.error("Failed to copy text: ", err);
        });

        });

        btns.appendChild(newbtn)

    }
   
})



