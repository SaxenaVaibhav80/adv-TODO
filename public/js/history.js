alert("hii")

// document.addEventListener("DOMContentLoaded", function () {
//     flatpickr("#date", {
//         dateFormat: "d-m-Y",  // Custom format DD-MM-YYYY
//     });
// });


function themestate() {
    fetch("/themeState", {
        method: "POST"
    }).then(res => res.text())
    .then((modes) => {
        const body = document.body;
        const lightOuter = document.getElementById("lightouter");
        const light = document.getElementById("light");
        const lmode = document.getElementById("lmode");

        if (modes === "Dark mode") {
            body.classList.add("dark-mode");

            lightOuter.classList.remove("shift-left");
            lightOuter.classList.add("shift-right");
            light.setAttribute("src", "/img/dark-mode.png");
            lmode.innerHTML = "Dark mode";
        } else {
            body.classList.remove("dark-mode");

            lightOuter.classList.remove("shift-right");
            lightOuter.classList.add("shift-left");
            light.setAttribute("src", "/img/lightmode.png");
            lmode.innerHTML = "Light mode";
        }
    }); 
}




function generateLast30Dates() {
    const today = new Date();
    const dates = [];
    
    for (let i = 0; i < 30; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        dates.push(date.toLocaleDateString("en-US"));
    }
    
    return dates;
}

// Function to handle slider change and update selected date
function updateSelectedDate(dates) {
    const slider = document.getElementById("date-slider");
    const selectedDateSpan = document.getElementById("selected-date");
    
    const selectedDate = dates[slider.value];
    selectedDateSpan.textContent = `Selected Date: ${selectedDate}`;
}

// Initialize slider with last 30 dates
const dates = generateLast30Dates();
updateSelectedDate(dates); 


const slider = document.getElementById("date-slider");
slider.addEventListener("input", () => updateSelectedDate(dates));


const searchBtn = document.getElementById("search-btn");
searchBtn.addEventListener("click", () => {
    const selectedDate = dates[slider.value];
    alert(`Search for tasks on: ${selectedDate}`);
    // Implement your search logic here
});

// search btn pr click krne pr date jyegi backend me or task lake degi 

// const searchbtn = document.getElementById("getdate");

// searchbtn.addEventListener("click", () => {

//     const date = document.getElementById("date");
//     const acceptedDate = date.value;



    //    fetch("/taskHistory",{
    //     method:POST,
    //     headers:{
    //        'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({date:acceptedDate}),
    //    }).then(response => response.json())
    //    .then(data => {

            // yhn array ayega tasks ka 


    //    })

   
// });