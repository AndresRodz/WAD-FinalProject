function fetchModifyItem(skuToModify, nameToModify, descToModify, priceToModify, categoryToModify, imgPathToModify, itemKeywordsToModify) {
    let url = "/api/items/modify";

    let data = {
        name : nameToModify,
        sku : skuToModify,
        description : descToModify,
        price : priceToModify,
        category : categoryToModify,
        keywords : itemKeywordsToModify,
        imgpath : imgPathToModify
    }
    
    let settings = {
        method : 'PATCH',
        headers : {
            'Content-Type' : 'application/json',
            sessiontoken : localStorage.getItem( 'token' )
        },
        body : JSON.stringify(data)
    }

    let results = document.querySelector( '.results' );
    let modifySection = document.querySelector( '.modifyItem' );

    fetch( url, settings )
        .then( response => {
            if( response.ok ){
                return response.json();
            }
        })
        .then( responseJSON => {
            console.log(responseJSON);
            modifySection.style.display = "none";
            results.innerHTML = "Item modified successfully.";
        })
        .catch( err => {
            results.innerHTML = err.message;
        })
}

function fetchGetAllItemsInfo() {
    let url = "/api/items/get";

    let settings = {
        method : 'GET',
        headers : {
            sessiontoken : localStorage.getItem( 'token' )
        }
    }

    let results = document.querySelector( '.modifyItem' );
    results.innerHTML = "";

    fetch( url, settings)
        .then( response => {
            if(response.ok){
                return response.json();
            }

            throw new Error( response.statusText );
        })
        .then( responseJSON => {
            for( let i = 0; i<responseJSON.length; i++){
                results.innerHTML += `
                <div id="${responseJSON[i].sku}">
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
                    </ul> 
                </div>`;
            }
            results.innerHTML += `
                <label for="modifyItemSku">
                    Sku of item to modify : 
                </label>
                <input type="text" id="modifyItemSku" />
                <label for="modifyItemName">
                    Name to update :
                </label>
                <input type="text" id="modifyItemName" />
                <label for="modifyItemDesc">
                    Description to update :
                </label>
                <input type="text" id="modifyItemDesc" />
                <label for="modifyItemPrice">
                    Price to update :
                </label>
                <input type="number" id="modifyItemPrice" />
                <label for="modifyItemCategory">
                    Category to update :
                </label>
                <input type="text" id="modifyItemCategory" />
                <label for="modifyItemKeywords">
                    Keywords to update : 
                </label>
                <input type="text" id="modifyItemKeywords" />
                <label for="modifyItemImgPath">
                    Img Path to update :
                </label>
                <input type="text" id="modifyItemImgPath" />
                <button onclick="watchModifyItem(event); return false;">
                    Modify Item
                </button>`;
        })
        .catch( err => {
            results.innerHTML = err.message;
        })
}

function watchModifyItem(event) {
    event.preventDefault();

    let skuToModify = document.getElementById('modifyItemSku').value;
    let nameToModify = document.getElementById('modifyItemName').value;
    let descToModify = document.getElementById('modifyItemDesc').value;
    let priceToModify = document.getElementById('modifyItemPrice').value;
    let categoryToModify = document.getElementById('modifyItemCategory').value;
    let imgPathToModify = document.getElementById('modifyItemImgPath').value;
    let keywords = document.getElementById('modifyItemKeywords').value;
    let itemKeywordsToModify = keywords.trim();
    itemKeywordsToModify = keywords.split(',');

    fetchModifyItem(skuToModify, nameToModify, descToModify, priceToModify, categoryToModify, imgPathToModify, itemKeywordsToModify);
}

function fetchDeleteItem(sku) {
    let url = `/api/items/delete/${sku}`;

    let settings = {
        method : 'DELETE',
        headers : {
            sessiontoken : localStorage.getItem( 'token' )
        }
    }

    let results = document.querySelector( '.results' );
    let deleteSection = document.querySelector( '.deleteItem' );

    fetch( url, settings )
        .then( response => {
            if(response.ok){
                return response.json();
            }

            throw new Error(response.statusText);
        })
        .then( responseJSON => {
            deleteSection.style.display = "none";
            results.innerHTML = "Item deleted successfully.";
        })
        .catch( err => {
            results.innerHTML = err.message;
        })
}

function watchDeleteItem(event) {
    event.preventDefault();

    let skuToDelete = document.getElementById( 'deleteItemInput' ).value;

    fetchDeleteItem(skuToDelete);
}

function fetchGetAllItems() {
    let url = "/api/items/get";

    let settings = {
        method : 'GET',
        headers : {
            sessiontoken : localStorage.getItem( 'token' )
        }
    }

    let results = document.querySelector( '.deleteItem' );
    results.innerHTML = "";

    fetch( url, settings)
        .then( response => {
            if(response.ok){
                return response.json();
            }

            throw new Error( response.statusText );
        })
        .then( responseJSON => {
            for( let i = 0; i<responseJSON.length; i++){
                results.innerHTML += `
                <div id="${responseJSON[i].sku}">
                    ${responseJSON[i].name} : ${responseJSON[i].sku} 
                </div>`;
            }
            results.innerHTML += `
                <label for="deleteItemInput">
                    Sku of item to delete : 
                </label>
                <input type="text" id="deleteItemInput" />
                <button onclick="watchDeleteItem(event); return false;">
                    Delete Item
                </button>`;
        })
        .catch( err => {
            results.innerHTML = err.message;
        })
}

function fetchAddItem(name, desc, price, category, keywords, imgpath) {
    let url = "/api/items/create";
    console.log(keywords);
    let data = {
        name : name,
        description : desc,
        price : price,
        category : category,
        keywords : keywords,
        imgpath : imgpath
    };
    let settings = {
        method : 'POST',
        headers : {
            'Content-Type' : 'application/json',
            sessiontoken : localStorage.getItem('token')
        },
        body : JSON.stringify( data )
    }

    let results = document.querySelector( '.results');

    fetch( url, settings )
        .then( response =>{
            if(response.ok){
                return response.json();
            }

            throw new Error( response.statusText );
        })
        .then( responseJSON => {
            results.innerHTML="Item created successfully";
            console.log(responseJSON);
            document.querySelector('.addItem').style.display = "none";
        })
        .catch( err => {
            results.innerHTML = err.message;
        })
}

function watchAddItem() {
    let addItemForm = document.querySelector( '.addItemForm' );
    document.querySelector('.results').innerHTML = "";
    addItemForm.addEventListener( 'submit' , (event) => {
        event.preventDefault();
        console.log("clickeaste add item");

        let itemName = document.getElementById( 'itemName' ).value;
        let itemDesc = document.getElementById( 'itemDesc' ).value;
        let itemPrice = document.getElementById('itemPrice').value;
        let itemCategory = document.getElementById( 'itemCategory' ).value;
        let keywords = document.getElementById('itemKeywords').value;
        let itemKeywords = keywords.trim();
        itemKeywords = keywords.split(',');
        let itemImgPath = document.getElementById('itemImgPath').value;

        fetchAddItem(itemName, itemDesc, itemPrice, itemCategory, itemKeywords, itemImgPath);
    })
}

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
    watchAddItem();
}

function redirectHome() {
    window.location.href = "/pages/home.html";
}

function redirectProfile() {
    window.location.href = "/pages/profile.html";
}

function displayAdd() {
    document.querySelector('.addItem').style.display = "";
    document.querySelector('.modifyItem').style.display = "none";
    document.querySelector('.deleteItem').style.display = "none";
    document.querySelector('.results').innerHTML = "";
}

function displayModify() {
    document.querySelector('.addItem').style.display = "none";
    document.querySelector('.modifyItem').style.display = "";
    document.querySelector('.deleteItem').style.display = "none";
    document.querySelector('.results').innerHTML = "";
    fetchGetAllItemsInfo();
}

function displayDelete() {
    document.querySelector('.addItem').style.display = "none";
    document.querySelector('.modifyItem').style.display = "none";
    document.querySelector('.deleteItem').style.display = "";
    document.querySelector('.results').innerHTML = "";
    fetchGetAllItems();
}

init();