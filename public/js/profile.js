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
                    <li>Password: ${responseJSON.password} </li>
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

    //ESTE FETCH SE ESTA HACIENDO MAL PORQUE EL SERVER RECIBE EL HEADER COMO UNDEFINED
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
            //window.location.href = "./../index.html";
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