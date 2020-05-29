function userSignupFetch(firstName, lastName, email, password, token) {
    let url = '/api/users/signup';

    let data = {
        firstName,
        lastName,
        email,
        password,
        token
    };

    let settings = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
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
            window.location.href = "./../index.html";
        })
        .catch(err => {
            results.innerHTML = `<div> ${err.message} </div>`;
        });
}

function watchSignupForm(){
    let signupForm = document.querySelector('.signupForm');

    signupForm.addEventListener('submit', (event) => {
        event.preventDefault();

        let firstName = document.getElementById('userFirstName').value;
        let lastName = document.getElementById('userLastName').value;
        let email = document.getElementById('userEmail').value;
        let password = document.getElementById('userPassword').value;
        let token = document.getElementById('adminToken').value;

        userSignupFetch(firstName, lastName, email, password, token);
    });
}

function init(){
    watchSignupForm();
}

init();