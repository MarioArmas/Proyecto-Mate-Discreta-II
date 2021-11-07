function ingresarSitio() {
    // validar que no hayan sitios repetidos
    var name = document.getElementById('nombre_sitio').value;
    var latitud = document.getElementById('latitud').value;
    var longitud = document.getElementById('longitud').value;
    var disponible = true;

    var repetido = false; //Esta variable servirá para determinar si se agrega a la base de datos la info o no.

    // verificar que no hayan campos vacios
    if (name == "" || latitud == "" || longitud == "") {
        return;
    }

    async function getItems()
    {
        try {
            var carreteras = [];
            const response = await db.collection("sitios").where("name", "==", name).get();
            
            response.forEach((item) => {
                carreteras.push(item.data());
            })

            // verificar que sitio no esté repetido
            db.collection("sitios").get().then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    // doc.data() is never undefined for query doc snapshots

                    if(name == doc.data().name)
                    {
                        repetido = true; //Si el nombre es igual, entonces está repetido
                    }
                    else if(latitud == doc.data().latitud && longitud == doc.data.longitud)
                    {
                        repetido = true;    //Si la latitud y la longitud son iguales a la info, entonces está repetido
                    }
                });
            });
    
    //INGRESO A BASE DE DATOS CON TODAS LAS VARIABLES SI NO ESTÁ REPETIDO

        if (repetido == false) //Si la informacion no está repetida
        {
            db.collection("Sitios").doc().set()({   //Entonces se agrega la información a la base de datos
                name,
                latitud,
                longitud,
                disponible,
            })

        }
       
        }
        catch (error) {
            console.log("Error al ingresar sitio")
        }
        
    }  
}       

function ingresarCarretera() {
    // añadir carreteras al vector del objeto "lugar" en la base de datos
    // validar que no hayan carreteras repetidas
    // validar que ambos vértices existan (lugares)
    // las carreteras se van a añadir colocando el nombre del lugar destino en el objeto del lugar de inicio
    var carretera_origen = document.getElementById('new_road_origen').value;
    var carretera_destino = document.getElementById('new_road_destino').value;
    
    var error = true, repetido = false;

    // validar que no hayan campos vacios
    if (carretera_origen == "" || carretera_destino == "") {
        return;
    } 

    //validamos si existe el SITIO de origen (vértice)
    db.collection("sitios").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots

            if(carretera_origen == doc.data().name)
            {
                error = false; //Si el nombre de la carretera es igual, entonces no habrá error
                return;
            }
            
            if(carretera_destino == doc.data().name)
            {
                error = false;   //Si el nombre de la carretera es igual, entonces no habrá error
                return;
            }
        });
    });

    //validar si CARRETERA no está repetida
    db.collection("sitios").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots

            if(carretera_origen == doc.data().name)
            {
                repetido = true; //Si el nombre de la carretera es igual, entonces no habrá error
                return;
            }
            
            if(carretera_destino == doc.data().name)
            {
                repetido = true;   //Si el nombre de la carretera es igual, entonces no habrá error
                return;
            }
        });
    });




}

function alertaCarretera() {
    // añadir alerta a carreteras
    // verificar que exista el lugar en la base de datos
    // verificar que exista la carretera en la base de datos
    // modificar el vector de carreteras del objeto "lugar" en la base de datos
    // el modo en que lo vamos a hacer es añadiendo un "!" antes del nombre de la carretera
    var carretera_origen = document.getElementById('damage_road_origen').value;
    var carretera_destino = document.getElementById('damage_road_destino').value;

    // validar que no hayan campos vacios
    if (carretera_origen == "" || carretera_destino == "") {
        return;
    }

    // codigo
}

function deshabilitarSitio() {
    // verificar que el sitio exista
    // cambiar la variable bool a false en la base de datos del sitio ingresado
    var lugar = document.getElementById('site_disabled').value;
    // validar que no hayan campos vacios
    if (lugar == ""){
        return;
    }
    // codigo  
}

function habilitarSitio() {
    // verificar que el sitio exista
    // cambiar la variable bool a true en la base de datos del sitio ingresado
    var lugar = document.getElementById('site_disabled').value;
    
    // validar que no hayan campos vacios
    if (lugar == "") {
        return;
    }

    // codigo
}

function showStats() {
    // recoger todas las estadisticas que pide el doc de word y añadirlas al html
    var etiqueta_html = document.getElementById('estadisticas');
    var texto_estadisticas = "";

    // codigo

    // añadir datos al html
    etiqueta_html.innerHTML = texto_estadisticas;
}