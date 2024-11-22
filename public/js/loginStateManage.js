window.addEventListener("pageshow", (event) => {
    if (event.persisted || performance.getEntriesByType("navigation")[0].type === "back_forward") {
        checkLoginState();
    }
});

function checkLoginState() {
        fetch('/api/login', { method: 'POST' })
            .then(response => response.json())
            .then(data => {
                if (data.token === 'undefined') {
                    window.location.href = '/login';
                } else {
                    location.reload();
                }
            });
    }
