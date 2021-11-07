const db = firebase.firestore();

function agregarSitio() {
    
    var name_place = document.getElementById('place_name').value;

    // validar que no hayan campos vacios
    if (name_place == "") {
        error_btn.innerHTML = "Debe agregar el nombre de un sitio";
        error_btn.style.display = 'block';
        return;
    }

    async function Leer()
    {
        var users = []
        const currentuser = await db.collection("current_user").get();
    
        currentuser.forEach((item) =>{
            users.push(item.data());
        })
        var valor = users[0];
        console.log(valor["name"])
    
        var NewUserRef = await db.collection('persona').where("name", "==", valor["name"])
        NewUserRef
        .onSnapshot(snapshot=>{
            snapshot.forEach( (snaphijo)=>{
            agregarSite(snaphijo.id);
            })
        })
    }
    Leer()
}

function eliminarSitio() {
    var name_place = document.getElementById('place_name').value;

    // validar que no hayan campos vacios

    if (name_place == "") {
        return;
        //Falta agregar un bloque de texto para mostrar el error
    }

    async function Leer()
    {
        var users = []
        const currentuser = await db.collection("current_user").get();
    
        currentuser.forEach((item) =>{
            users.push(item.data());
        })
        var valor = users[0];
        console.log(valor["name"])
    
        var NewUserRef = await db.collection('persona').where("name", "==", valor["name"])
        NewUserRef
        .onSnapshot(snapshot=>{
            snapshot.forEach( (snaphijo)=>{
            borrarSite(snaphijo.id);
            })
        })
    }
    Leer()
}

async function borrarSite(id)
{
    var name_place = document.getElementById('place_name').value;
    
    var places = []

    //colección de sitios en admin (aún no existe), mientras tanto se utiliza la provisional de SitiosTT (test)
    const datos = await db.collection("SitiosTT").where("name", "==", name_place).get();

    //Obteniendo todos los datos de la colección
    datos.forEach((item) => {
        places.push(item.data());
    })

    //Comprobar que el elemento exista
    for(var i = 0; i < places.length; i++)
    {
        var site = places[i];
        if(site["name"] == name_place)
        {
            //console.log(site["name"])
            //console.log(name_place)

            const personaRef = db.collection('persona');
            personaRef
            .doc(id)
            .update({
                places : firebase.firestore.FieldValue.arrayRemove(name_place)
            }).then(() => {
                location.reload();
            })
        }
        else
        {
            error_btn.innerHTML = "No existe este sitio";
        }
    }
}

async function agregarSite(id)
{
    var name_place = document.getElementById('place_name').value;
    
    var places = []

    //colección de sitios en admin (aún no existe), mientras tanto se utiliza la provisional de SitiosTT (test)
    const datos = await db.collection("SitiosTT").where("name", "==", name_place).get();

    //Obteniendo todos los datos de la colección
    datos.forEach((item) => {
        places.push(item.data());
    })

    //Comprobar que el elemento exista
    for(var i = 0; i < places.length; i++)
    {
        var site = places[i];
        if(site["name"] == name_place)
        {
            //console.log(site["name"])
            //console.log(name_place)

            const personaRef = db.collection('persona');
            personaRef
            .doc(id)
            .update({
                places : firebase.firestore.FieldValue.arrayUnion(name_place)
            }).then(() => {
                location.reload();
            })
        }
        else
        {
            error_btn.innerHTML = "No existe este sitio";
        }
    }
}

function mostrarSitios() {
    // obtener vector con los sitios del usuario
    // mostrar sitios en un string
    var etiqueta_html = document.getElementById('mis_sitios_text');
    var texto_vector = "";

    // codigo

    // añadir datos al html
    etiqueta_html.innerHTML = texto_vector;
}

function shortestRoad () {
    // buscar ruta mas corta entre los puntos dados por el usuario
    // validar que no hayan campos vacios (frontend)
    // mostrar ruta
    var lugar_origen = document.getElementById('lugar_origen_short').value;
    var lugar_destino = document.getElementById('lugar_destino_short').value;
    var ruta_corta;

    // validar que no hayan campos vacios
    if (lugar_origen == "" || lugar_destino == "") {
        return;
    }

    // codigo

    // añadir datos al html
    etiqueta_html.innerHTML = ruta_corta;
}

function bestRoad () {
    // buscar la ruta mas corta de manera automática
    // mostrar la ruta
    var etiqueta_html = document.getElementById('best_road_text');
    var mejor_ruta;

    // codigo

    // añadir datos al html
    etiqueta_html.innerHTML = mejor_ruta;
}

function kmTiempo() {
    // calcular distancia total y tiempo recorrido
    // pendiente añadir al frontend
}
