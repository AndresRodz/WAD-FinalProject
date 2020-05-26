function fetchProfile(email) {
    let url = `/api/users/profile?email=${email}`;

    let settings = {
        method: 'GET',
        headers: {
            sessiontoken : localStorage.getItem('token')
        }
    };

    let greeting = document.querySelector('.greeting');

    fetch(url, settings)
        .then(response => {
            if(response.ok){
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJSON => {
            console.log(responseJSON.admin);
            greeting.innerHTML = `Hi ${responseJSON.firstName} ${responseJSON.lastName}! Welcome to the administration page.`;
        })
        .catch(err => {
            results.innerHTML = `<div> ${err.message} </div>`;
        });
}

function fetchEmail() {
    let url = "/api/users/email";

    let settings = {
        method: 'GET',
        headers: {
            sessiontoken : localStorage.getItem('token')
        }
    };

    let results = document.querySelector('.results');

    fetch(url, settings)
        .then(response => {
            if(response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJSON => {
            console.log(responseJSON);
            let email = responseJSON.email;
            console.log(email);
            fetchProfile(email);
        })
        .catch(err => {
            results.innerHTML = `<div> ${err.message} </div>`;
        });
}

function init() {
    fetchEmail();
}

function redirectHome() {
    window.location.href = "/pages/home.html";
}

function redirectProfile() {
    window.location.href = "/pages/profile.html";
}

init();