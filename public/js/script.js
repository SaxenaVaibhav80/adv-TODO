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
