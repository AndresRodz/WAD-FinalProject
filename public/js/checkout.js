function fetchCart(email) {
    let url = `/api/checkout/${email}`;

    let settings = {
        method: 'GET',
        headers: {
            sessiontoken: localStorage.getItem('token')
        }
    };

    let results = document.querySelector('.results');
    results.innerHTML = "";

    fetch(url, settings)
        .then(response => {
            if(response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJSON => {
            console.log(responseJSON);
            console.log(responseJSON[0].items[0]);

            for(let i = 0; i < responseJSON[0].items.length; i++) {
                results.innerHTML +=
                `<div class="items" id="${responseJSON[0].items[i]._id}">
                    <ul>
                        <li> Item: ${responseJSON[0].items[i].name} </li>
                            <ul>
                                <li> Description: ${responseJSON[0].items[i].description} </li>
                                <li> Price: ${responseJSON[0].items[i].price} </li>
                            </ul>
                    </ul>
                </div>`;
            }
        })
        .catch(err => {
            results.innerHTML = err.message;
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
            fetchCart(email);
        })
        .catch(err => {
            results.innerHTML = `<div> ${err.message} </div>`;
        });
}

function redirectHome() {
    window.location.href = "/pages/home.html";
}

function redirectProfile() {
    window.location.href = "/pages/profile.html";
}

function init() {
    fetchEmail();
}

init();