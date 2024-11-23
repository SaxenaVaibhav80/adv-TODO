const generatebtn = document.getElementById("generate-url-btn")
const btns= document.getElementById("btns")



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
        btns.appendChild(newbtn)
    }
})