fetch('/api/login', {
    method: 'POST',
})
.then(response => response.json()) 
.then(data => {

    localStorage.setItem("token", data.token); 
    localStorage.setItem("id",data.id);
    extracted_token = localStorage.getItem('token');
})