const db = firebase.firestore();

// ADMINS
function signInAdmin() {
    var name = document.getElementById('signInAdminName').value;
    var password = document.getElementById('signInAdminPassword').value;
    var confirmPassword = document.getElementById('signInAdminConfirmPassword').value;
    var error_btn = document.getElementById('error_message_signin_admin');

    error_btn.innerHTML = "";
    error_btn.style.display = "none";

    // evitar campos en blanco
    if (name == "" || password == "" || confirmPassword == "") {
        error_btn.innerHTML = "Hacen falta campos por completar";
        error_btn.style.display = 'block';
        return;
    }
    
    // contraseña y confirmar contraseña iguales
    if (password != confirmPassword) {
        error_btn.innerHTML = "La contraseña no coincide";
        error_btn.style.display = 'block';
        return;
    }

    // obtener lista de admins
    async function getItems() {
        try {
            var items = []
            const response = await db.collection("AdminCredenciales").where("name", "==", name).get();
            
            response.forEach((item) => {
                items.push(item.data());
            })

            // verificar que sea un admin nuevo
            if (items.length > 0) {
                error_btn.innerHTML = "Ese nombre de usuario ya está seleccionado";
                error_btn.style.display = 'block';
                return;
            }

            // crear credenciales
            db.collection("AdminCredenciales").doc().set({
                name,
                password
            });
        }
        catch (error) {
            console.log("error getting items")
        }
    }
    getItems()
}

function logInAdmin() {
    var name =  document.getElementById('logInAdminName').value;
    var password =  document.getElementById('logInAdminPassword').value;
    var error_btn = document.getElementById('error_message_login_admin');

    error_btn.innerHTML = "";
    error_btn.style.display = "none";

    // evitar campos en blanco
    if (name == "" || password == "") {
        error_btn.innerHTML = "Hacen falta campos por completar";
        error_btn.style.display = 'block'
        return;
    }

    // obtener lista de admins
    async function getItems() {
        try {
            var items = []
            const response = await db.collection("AdminCredenciales").where("name", "==", name).get();
            
            response.forEach((item) => {
                items.push(item.data());
            })

            // verificar credenciales
            for (var i = 0; i < items.length; i++) {
                var admin = items[i];
                if (admin["name"] == name & admin["password"] == password) {
                    window.open("admin.html");
                    return;
                }
            }
            
            error_btn.innerHTML = "El usuario no coincide con la contraseña";
            error_btn.style.display = 'block'
            return;
        }
        catch (error) {
            console.log("error getting items")
            return;
        }
    }
    getItems()
}


// USERS
function signInUser() {
    // fix bug
    // it reloads the page when click on sign in a user
    var name =  document.getElementById('signInUserName').value;
    var password =  document.getElementById('signInUserPassword').value;
    var confirmPassword =  document.getElementById('signInUserConfirmPassword').value;
    var error_btn = document.getElementById('error_message_signin_user');

    error_btn.innerHTML = "";
    error_btn.style.display = "none";

    // evitar campos en blanco
    if (name == "" || password == "" || confirmPassword == "") {
        error_btn.innerHTML = "Hacen falta campos por completar";
        error_btn.style.display = 'block';
        return;
    }
    
    // contraseña y confirmar contraseña iguales
    if (password != confirmPassword) {
        error_btn.innerHTML = "La contraseña no coincide";
        error_btn.style.display = 'block';
        return;
    }

    // obtener lista de users
    async function getItems() {
        try {
            var items = []
            const response = await db.collection("persona").where("name", "==", name).get();
            
            response.forEach((item) => {
                items.push(item.data());
            })

            /* for (var i = 0; i < items.length; i++) {
                console.log(items[i])
            } */

            // verificar que sea un user nuevo
            if (items.length > 0) {
                error_btn.innerHTML = "Ese nombre de usuario ya está seleccionado";
                error_btn.style.display = 'block';
                return;
            }

            // crear credenciales
            places = []
            db.collection("persona").doc().set({
                name,
                password,
                places
            });
        }
        catch (error) {
            console.log("error getting items")
        }
    }
    getItems()
}

function logInUser() {
    var name =  document.getElementById('logInUserName').value;
    var password =  document.getElementById('logInUserPassword').value;
    var error_btn = document.getElementById('error_message_login_user');

    error_btn.innerHTML = "";
    error_btn.style.display = "none";

    // evitar campos en blanco
    if (name == "" || password == "") {
        error_btn.innerHTML = "Hacen falta campos por completar";
        error_btn.style.display = 'block'
        return;
    }

    // obtener lista de users
    async function getItems() {
        try {
            var items = []
            const response = await db.collection("persona").where("name", "==", name).get();
            
            response.forEach((item) => {
                items.push(item.data());
            })

            // verificar credenciales
            for (var i = 0; i < items.length; i++) {
                //console.log(items[i])
                
                var user = items[i];
                if (user["name"] == name & user["password"] == password) {
                    console.log("works")
                    window.open("user.html");
                    return;
                }
            }
            
            error_btn.innerHTML = "El usuario no coincide con la contraseña";
            error_btn.style.display = 'block'
            return;
        }
        catch (error) {
            console.log("error getting items")
            return;
        }
    }
    getItems()
}