function submitReview(email, title, content, itemid, orderItemID) {
    let url = `/api/reviews/submit/${email}`;

    let data = {
        title: title,
        content: content,
        item: orderItemID
    }

    let settings = {
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json',
            sessiontoken: localStorage.getItem('token')
        },
        body: JSON.stringify(data)
    };

    let reviewForm = document.querySelector(`.reviewForm${itemid}`);

    fetch(url, settings)
        .then(response => {
            if(response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJSON => {
            reviewForm.innerHTML = "Thank you for adding the review, we appreciate your feedback";
        })
        .catch(err => {
            reviewForm.innerHTML = err;
        });
}

function watchReviewForm(email, itemid, orderItemID) {
    let reviewForm = document.querySelector(`.reviewForm${itemid}`);

    reviewForm.addEventListener('submit', (event) => {
        event.preventDefault();

        let title = document.getElementById(`reviewTitle${itemid}`).value;
        let content = document.getElementById(`reviewContent${itemid}`).value;

        submitReview(email, title, content, itemid, orderItemID);
    });
}

function writeReview(event) {
    let itemid = event.target.id;
    console.log(itemid);
    let orderItemID = event.target.className;

    document.getElementById(`${itemid}`).disabled = true;

    document.querySelector(`.${itemid}`).innerHTML +=
    `<form class="reviewForm${itemid}">
        <label for="reviewTitle${itemid}">
            Title:
        </label>
        <input type="text" id="reviewTitle${itemid}"/>

        <label for="reviewContent${itemid}">
            Content:
        </label>
        <input type="text" id="reviewContent${itemid}"/>

        <button type="submit">
            Submit item review
        </button>
    </form>`;

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
            watchReviewForm(email, itemid, orderItemID);
        })
        .catch(err => {
            results.innerHTML = `<div> ${err.message} </div>`;
        });
}

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
            throw new Error(response.statusText);
        })
        .then(responseJSON => {
            results.innerHTML += "These are your past orders:";
            for(let i = 0; i < responseJSON.length; i++) {

                results.innerHTML +=
                `<div>
                    <ul>
                        <li>Order id: ${responseJSON[i]._id}</li>
                            <ul class="itemsOrder${i}">
                                
                            </ul>
                    </ul>
                </div>`;

                for(let j = 0; j < responseJSON[i].items.length; j++) {
                    document.querySelector(`.itemsOrder${i}`).innerHTML +=
                    `<li>
                        <div class="item${i}_${j}">
                            Item name : ${responseJSON[i].items[j].name}
                            <button id="item${i}_${j}" class="${responseJSON[i].items[j]._id}" onclick="writeReview(event); return false;">
                                Write review
                            </button>
                        </div>
                    </li>
                    <ul> 
                        <li> SKU : ${responseJSON[i].items[j]._id} </li>
                        <li> Item Price : ${responseJSON[i].items[j].price} </li>
                    </ul>`;
                }
            }
        })
        .catch(err => {
            results.innerHTML += `<div> You do not have any past orders </div>`;
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
            `These are your profile details:
            <div id="${responseJSON.firstName}"> 
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