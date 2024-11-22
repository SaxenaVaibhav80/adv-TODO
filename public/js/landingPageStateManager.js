window.addEventListener("pageshow", (event) => {
    if (event.persisted || performance.getEntriesByType("navigation")[0].type === "back_forward") {
        checkLoginState();
    }
});

function checkLoginState() {
       console.log("hello")
       window.location.href = '/TODO';
    }