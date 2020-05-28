function displayItem(event) {
    event.preventDefault();

    itemSku = event.target.className;

    let itemsArrayTags = document.querySelectorAll('.items');

    for(let i = 0; i < itemsArrayTags.length; i++) {
        if( itemsArrayTags[i].id !== itemSku ){
            itemsArrayTags[i].remove();
        } 
    }




}

function addToCart(email, itemid) {
    let url = "/api/carts/Add";

    let data = {
        email: email,
        itemid: itemid
    }

    console.log(email, itemid);
    
    let settings = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            sessiontoken: localStorage.getItem('token')
        },
        body: JSON.stringify(data)
    }

    let results = document.querySelector('.greeting');
    results.innerHTML = "";

    fetch(url, settings)
        .then(response => {
            if(response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJSON => {
            results.innerHTML = "Item added to the cart successfully.";
        })
        .catch(err => {
            results.innerHTML = err.message;
        });
}

function fetchEmail(event) {
    let url = "/api/users/email";
    
    sku = event.target.id;

    console.log(event.target);

    console.log(sku);

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
            fetchItemInfo(event, email, sku);
        })
        .catch(err => {
            results.innerHTML = `<div> ${err.message} </div>`;
        });
}

function fetchItemInfo(event, email, sku) {
    event.preventDefault();
    console.log("entro boton");

    let url = `/api/items/getBySKU/${sku}`;

    let settings = {
        method : 'GET',
        headers : {
            sessiontoken : localStorage.getItem('token')
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
            let itemid = responseJSON._id;

            addToCart(email, itemid);
        })
        .catch(err => {
            results.innerHTML = err.message;
        });
}

function fetchItemsByName(name) {
    let url = `/api/items/getitemsbyname/${name}`;

    let settings = {
        method: 'GET',
        headers: {
            sessiontoken: localStorage.getItem('token')
        }
    }

    let results = document.querySelector('.results');
    results.innerHTML = "These are the items currently available by the search criteria:";

    fetch(url, settings)
        .then(response => {
            if(response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJSON => {
            for(let i = 0; i<responseJSON.length; i++) {
                let sku = responseJSON[i].sku;
                results.innerHTML +=
                `<div class="items" id="${responseJSON[i].sku}">
                    <ul>
                        <li> Name : ${responseJSON[i].name} </li>
                            <ul>
                                <li> SKU : ${responseJSON[i].sku} </li>
                                <li> Description : ${responseJSON[i].description} </li>
                                <li> Price : ${responseJSON[i].price} </li>
                                <li> Category : ${responseJSON[i].category} </li>
                                <li> Keywords : ${responseJSON[i].keywords.toString()} </li>
                                <li> Img Path : ${responseJSON[i].imgpath} </li>
                            </ul>
                        <button id="${responseJSON[i].sku}" onclick="fetchEmail(event); return false;">
                            Add item to cart
                        </button>
                        <button class="${responseJSON[i].sku}" onclick="displayItem(event); return false;">
                            View item details
                        </button>
                    </ul>
                </div>`;
            }
        })
        .catch( err => {
            results.innerHTML = err.message;
        })
}

function fetchItemsByCategory(category) {
    let url = `/api/items/getitemsbycategory/${category}`;

    let settings = {
        method: 'GET',
        headers: {
            sessiontoken: localStorage.getItem('token')
        }
    }

    let results = document.querySelector('.results');
    results.innerHTML = "These are the items currently available by the search criteria:";

    fetch(url, settings)
        .then(response => {
            if(response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJSON => {
            for(let i = 0; i<responseJSON.length; i++) {
                let sku = responseJSON[i].sku;
                results.innerHTML +=
                `<div class="items" id="${responseJSON[i].sku}">
                    <ul>
                        <li> Name : ${responseJSON[i].name} </li>
                            <ul>
                                <li> SKU : ${responseJSON[i].sku} </li>
                                <li> Description : ${responseJSON[i].description} </li>
                                <li> Price : ${responseJSON[i].price} </li>
                                <li> Category : ${responseJSON[i].category} </li>
                                <li> Keywords : ${responseJSON[i].keywords.toString()} </li>
                                <li> Img Path : ${responseJSON[i].imgpath} </li>
                            </ul>
                        <button id="${responseJSON[i].sku}" onclick="fetchEmail(event); return false;">
                            Add item to cart
                        </button>
                        <button class="${responseJSON[i].sku}" onclick="displayItem(event); return false;">
                            View item details
                        </button>
                    </ul>
                </div>`;
            }
        })
        .catch( err => {
            results.innerHTML = err.message;
        })
}

function watchSearchItem(event) {

    let searchItemForm = document.querySelector( '.searchBar' );

    let results = document.querySelector( '.results' );
    let greeting = document.querySelector( '.greeting' );

    results.innerHTML = "";
    greeting.innerHTML = "";
    

    searchItemForm.addEventListener( 'submit' , ( event ) => {
        event.preventDefault();

        let searchTerm = document.getElementById( 'myInput' ).value;

        console.log("clickeaste search!");
        console.log(searchTerm);

        let searchOption = document.getElementById( 'options' ).value;

        if( searchOption === 'Name' ){
            fetchItemsByName(searchTerm);
        }
        if( searchOption === 'Category' ){
            fetchItemsByCategory(searchTerm);
        }


    })
}

function redirectProfile() {
    window.location.href = "/pages/profile.html";
}

function redirectAdminPage() {
    window.location.href = "/pages/adminPage.html";
}

function redirectCheckout() {
    window.location.href = "/pages/checkout.html";
}

function init() {
    watchSearchItem();
}

init();