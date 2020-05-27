function addToCart(name, sku, description, price, category, keywords, imgpath) {
    let url = "/api/carts/Add";

    let data = {
        name: name,
        sku: sku,
        description: description,
        price: price,
        category: category,
        keywords: keywords,
        imgpath: imgpath
    }
    
    let settings = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            sessiontoken: localStorage.getItem('token')
        },
        body: JSON.stringify(data)
    }

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
            results.innerHTML = "Item added to the cart successfully.";
        })
        .catch(err => {

        });
}

function fetchItemInfo(event, sku) {
    event.preventDefault();
    console.log("entro boton");
    console.log(sku);

    let url = `/api/items/getBySKU/${sku}`;

    let settings = {
        method : 'GET',
        headers : {
            sessiontoken : localStorage.getItem('token')
        }
    }

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
            let name = responseJSON.name;
            let sku = responseJSON.sku;
            let description = responseJSON.description;
            let price = responseJSON.price;
            let category = responseJSON.category;
            let keywords = responseJSON.keywords;
            let imgpath = responseJSON.imgpath;

            addToCart(name, sku, description, price, category, keywords, imgpath);
        })
        .catch(err => {
            results.innerHTML = err.message;
        });
}

function fetchItems() {
    let url = "/api/items/get";

    let settings = {
        method: 'GET',
        headers: {
            sessiontoken: localStorage.getItem('token')
        }
    }

    let results = document.querySelector('.results');
    results.innerHTML = "These are the items currently available:";

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
                `<div id="${responseJSON[i].sku}">
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
                        <button onclick="fetchItemInfo(event, _${sku}); return false;">
                            Add item to cart
                        </button>
                    </ul>
                </div>`;
            }
        })
        .catch( err => {
            results.innerHTML = err.message;
        })
        console.log("termino fetch");
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
    fetchItems();
}

init();