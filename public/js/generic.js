/*let url = "/api/users/validate";

let settings = {
    method: 'GET',
    headers: {
        sessiontoken: localStorage.getItem('token')
    }
    //Make the validation synchronous so the header is not displayed in case the session expired, before redirecting
    //async : false
};

fetch(url, settings)
    .then(response => {
        if(response.ok) {
            return response.json();
        }
        throw new Error(response.statusText);
    })
    .then(responseJSON => {
        console.log("Session is still valid");
    })
    .catch(err => {
        console.log("Not a valid session");
        console.log(err.message);
        window.location.href = "./../index.html";
    });*/