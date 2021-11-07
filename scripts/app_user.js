// IMPORTANTE
// En la base de datos debe haber un colection con el "current user" del cual se deben gestionar los datos ya que ese seria el usuario actual

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

async function mostrarSitios(){

    var etiqueta_html = document.getElementById('mis_sitios_text');
    var texto_vector = "No tiene sitios";
    

    // codigo
   //recorremos la columna de current
    var currref =    db.collection('current_user')
    .onSnapshot(query =>{
    
        query.forEach(doc =>{
            console.log(doc.data()) //sacamos los datos de la columna
//recorremos la columna de persona 
            var personaref =    db.collection('persona')
            .onSnapshot(quer =>{    
                quer.forEach(docp =>{
                    console.log(docp.data())
                    //buscamos el nombre del current en el de persona
                    if (doc.data().name === docp.data().name)
                    {
                        if (docp.data().places == ""){//verificamos si tiene sitios agregados
                            etiqueta_html.innerHTML = "No tiene sitios";
            return;
                        }
                        else
                        {
                            //mostramos los sitios
                        etiqueta_html.innerHTML = docp.data().places;
                        return; 
                        }
                    }
                    
                })
            });
            
        })
    });
            
   
    
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


mostrarSitios();