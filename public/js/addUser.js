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
     getuid()
})


generatebtn.addEventListener("click",()=>
{   
    const copybtn=document.getElementsByClassName("copy")[0]
    console.log(copybtn)
    if(copybtn==undefined)
    {
        generatebtn.innerHTML='Regenerate'
        const newbtn = document.createElement("div")
        newbtn.classList.add("copy")
        newbtn.textContent="Copy"

        newbtn.addEventListener("click", () => {
        const uidText = uidDiv.textContent;
        navigator.clipboard.writeText(uidText).then(() => {
            alert("UID copied to clipboard!");
        }).catch(err => {
            console.error("Failed to copy text: ", err);
        });
        });

        btns.appendChild(newbtn)

    }

})

