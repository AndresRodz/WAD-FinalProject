function fetchOrders(email) {
    let url = `/api/orders/viewByID/${email}`;

    let settings = {
        method: 'GET',
        headers: {
            sessiontoken: localStorage.getItem('token')
        }
    }

    let results = document.querySelector('.results');

    fetch(url, settings)
        .then(response => {
            if(response.ok) {
                return response.json();
            }
            throw new Error(respons.statusText);
        })
        .then(responseJSON => {
            for(let i = 0; i < responseJSON.length; i++) {

                results.innerHTML +=
                `<div>
                    <ul>
                        <li>Order id: ${responseJSON[i]._id}</li>
                            <ul class="orderItems${i}">
                                
                            </ul>
                    </ul>
                </div>`;

                for(let j = 0; j < responseJSON[i].items.length; j++) {
                    document.querySelector(`.orderItems${i}`).innerHTML +=
                    `<li>
                        ${responseJSON[i].items[j]}
                        <button id="${responseJSON[i].items[j]}"onclick="writeReview(event); return false;">
                            Write review
                        </button>
                    </li>`;
                }
            }
        })
        .catch(err => {
            results.innerHTML = `<div> ${err.message} </div>`;
        });

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
            fetchOrders(email);
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