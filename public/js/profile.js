function fetchProfile(email) {
    let url = `/api/users/profile?email=${email}`;

    let settings = {
        method: 'GET',
        headers: {
            sessiontoken : localStorage.getItem('token')
        }
    };

    let results = document.querySelector('.results');

    fetch(url, settings)
        .then(response => {
            if(response.ok){
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJSON => {
            results.innerHTML =
            `<div id="${responseJSON.firstName}"> 
                <ul>
                    <li>First name: ${responseJSON.firstName} </li>  
                    <li>Last name: ${responseJSON.lastName} </li>
                    <li>Email: ${responseJSON.email} </li>
                </ul>
            </div>`;
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
            let email = responseJSON.email;
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

function redirectEditProfile() {
    window.location.href = "/pages/editProfile.html";
}

init();