const joinbtn = document.getElementById("joinbtn");

joinbtn.addEventListener("click", async () => {   
    const id = document.getElementById("join-id").value;
    console.log(id)
    if(id=="")
    {
        alert("enter id please")
    }
    document.getElementById("join-id").value = "";
    
    try {
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
    } catch (error) {
        console.error("Error:", error);
    }
});
