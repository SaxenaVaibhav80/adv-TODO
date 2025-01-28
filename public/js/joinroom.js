const socket=io()

const joinbtn = document.getElementById("joinbtn");
joinbtn.addEventListener("click", async () => {   
    const id = document.getElementById("join-id").value;
    console.log(id)
    if(id=="")
    {
        alert("enter id please")
    }
    else{
        try {

            document.getElementById("join-id").value = "";
            const response = await fetch("/joined", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id: id }),
            });
            
            const data = await response.json();
            if(data.alert)
                {
                    alert("no room found")
                }
            
            if(data.countuser==true)
            {
                alert("room full")
                window.location.href = "/TODO";
            }
            if (data.redirectTo && data.countuser!=true) {
                const name = localStorage.getItem("name")
                const userid = localStorage.getItem("id")
                await socket.emit("ijoined",{id,name,userid})  // message pehle phuchega or joining baad me hogi room ki  
                window.location.href = data.redirectTo;

            }
        } catch (error) {
            console.error("Error:", error);
        }
    }
    
});
