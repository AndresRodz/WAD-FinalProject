function userUpdateFetch(firstName, lastName, email, password) {
    let url = '/api/users/update';

    let data = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password
    };

    let settings = {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            sessiontoken : localStorage.getItem('token')
        },
        body: JSON.stringify(data)
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
            window.location.href = "/pages/profile.html";
        })
        .catch(err => {
            results.innerHTML = `<div> ${err.message} </div>`;
        });
}

function watchUpdateForm(event){
    event.preventDefault();

    let firstName = document.getElementById('userFirstName').value;
    let lastName = document.getElementById('userLastName').value;
    let email = document.getElementById('userEmail').value;
    let password = document.getElementById('userPassword').value;

    userUpdateFetch(firstName, lastName, email, password);
}

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
                <form class="updateForm">
                    <label for="userFirstName">
                        First name:
                    </label>
                    <input type="text" id="userFirstName" value="${responseJSON.firstName}"/>

                    <label for="userLastName">
                        Last name:
                    </label>
                    <input type="text" id="userLastName" value="${responseJSON.lastName}"/>

                    <label for="userEmail">
                        Email:
                    </label>
                    <input type="text" id="userEmail" value="${responseJSON.email}"/>

                    <label for="userPassword">
                        Password:
                    </label>
                    <input type="password" id="userPassword"/>
                </form>
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

function redirectProfile() {
    window.location.href = "/pages/profile.html";
}

init();