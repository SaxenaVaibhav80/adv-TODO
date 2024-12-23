
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
            if (data.redirectTo) {
                // Redirect to the received URL
                window.location.href = data.redirectTo;
            }
            if(data.countuser==true)
            {
                alert("room full")
            }
            if(data.msg=="noRoom")
            {
                alert("No room Found")
            }
        } catch (error) {
            console.error("Error:", error);
        }
    }
    
});
