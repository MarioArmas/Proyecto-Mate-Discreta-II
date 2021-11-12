function agregarSitio() {
    const name_place = document.getElementById('place_name').value;

    // validar que no hayan campos vacios
    if (name_place == "") {
        window.alert("Debe ingresar un sitio")
        return;
    }

    async function Leer()
    {
        const users = []
        const currentUser = await db.collection("current_user").get();
    
        currentUser.forEach((item) =>{
            users.push(item.data());
        })
        await agregarSite();

    }
    Leer()
}

function eliminarSitio() {
    const name_place = document.getElementById('place_name').value;

    // validar que no hayan campos vacios

    if (name_place == "") {
        window.alert("Debe ingresar un sitio")
        return;
    }

    async function Leer()
    {
        var users = []
        const currentUser = await db.collection("current_user").get();
    
        currentUser.forEach((item) =>{
            users.push(item.data());
        })

        borrarSite();
    }
    Leer()
}

async function borrarSite() {
    var name_place = document.getElementById('place_name').value;
    var places = []
    var id;
    var id2;

    const datos = await db.collection("SitiosTT").where("name", "==", name_place).get();

    //Obteniendo todos los datos de la colección
    datos.forEach((item) => {
        places.push(item.data());
    })

    if(places.length < 1)
    {
        window.alert("El lugar que desea eliminar no existe registrado");
        
    }
    else
    {
        async function obtener()
        {   
            var newUser = []
            var datasSet = []
            var visitas = []
            var k = 0;
            
            //Se obtiene al user logueado
            const userr = await db.collection("current_user").get();

            userr.forEach((item) =>{
                datasSet.push(item.data());
            })

            var arrInfo = datasSet[0];
            var buscar = arrInfo["name"];
    
            //Se busca la colección entre los usuarios donde se encuentra el current user y se obtiene su id
            const Nombreref = await db.collection('persona').where("name", "==", buscar).get()
    
            Nombreref.forEach((item) =>{
                newUser.push(item.data());
                id = item.id;
            })
            
            //obtener el id del sitio que se está agregando para aumentar en 1 sus visitas si es posible agregarlo
            const SitioVisita = await db.collection('stats').where("name","==", name_place).get();

            SitioVisita.forEach((item) =>{
                visitas.push(item.data());
                id2 = item.id;
            })
            
            cant_visitas = visitas[0];
            var contador = cant_visitas["visitantes"];

            //Proceso para comprobar la cantidad de lugares
            var SitioL = newUser[0];
            for(var m = 0; m < SitioL["places"].length; m++)
            {
                if(SitioL["places"][m] == name_place)
                {
                    k++
                }
            }

            if(k < 1)
            {
                window.alert("Este sitio no está disponible para aliminarse")
            }
            else
            {
                contador--;

                const personaRef = db.collection('persona');
                personaRef
                .doc(id)
                .update({
                    places : firebase.firestore.FieldValue.arrayRemove(name_place)
                })

                //se reduce un visitante al sitio
                const visitaRef = db.collection('stats');
                visitaRef
                .doc(id2)
                .update({
                    visitantes: contador
                })                  
            }
        }
        await obtener();
    }
}

async function agregarSite() {
    const name_place = document.getElementById('place_name').value;
    var places = []
    var id;
    var id2;

    const datos = await db.collection("SitiosTT").where("name", "==", name_place).get();

    //Obteniendo todos los datos de la colección
    datos.forEach((item) => {
        places.push(item.data());
    })

    if(places.length < 1) {
        window.alert("El lugar que desea agregar no existe en la base de datos");
        
    }
    else {
        // validar que el sitio esté disponible
        for (var i = 0; i < places.length; i++) {
            if (name_place == places[i]['name'] & !places[i]['disponible']) {
                alert('El sitio no se encuentra disponible')
                return
            }
        }

        // realizar funcion
        async function obtener() {   
            var newUser = []
            var datasSet = []
            var visitas = []
            var k = 0;
    
            //Se obtiene al user logueado
            const userr = await db.collection("current_user").get();

            userr.forEach((item) => {
                datasSet.push(item.data());
            })
            var arrInfo = datasSet[0];
            var buscar = arrInfo["name"];
    
            //Se busca la colección entre los usuarios donde se encuentra el current user y se obtiene su id
            const Nombreref = await db.collection('persona').where("name", "==", buscar).get()

            Nombreref.forEach((item) =>{
                newUser.push(item.data());
                id = item.id;
            })

            //obtener el id del sitio que se está agregando para aumentar en 1 sus visitas si es posible agregarlo
            const SitioVisita = await db.collection('stats').where("name","==", name_place).get();

            SitioVisita.forEach((item) =>{
                visitas.push(item.data());
                id2 = item.id;
            })
            
            cant_visitas = visitas[0];
            var contador = cant_visitas["visitantes"];            
    
            //Proceso para comprobar la cantidad de lugares
            var SitioL = newUser[0];
            for(var m = 0; m < SitioL["places"].length; m++)
            {
                if(SitioL["places"][m] == name_place)
                {
                    k++
                }
            }
            
            if(k > 0)
            {
                window.alert("Este lugar ya existe en sus sitios a visitar")
            }
            else
            {
                contador++

                const personaRef = db.collection('persona');
                personaRef
                .doc(id)
                .update({
                    places : firebase.firestore.FieldValue.arrayUnion(name_place)
                })
                
                //se aumenta un visitante al sitio
                const visitaRef = db.collection('stats');
                visitaRef
                .doc(id2)
                .update({
                    visitantes: contador
                })                
            }
        }
        await obtener();
    }
    
}


async function mostrarSitios() {
    const etiqueta_html = document.getElementById('mis_sitios_text');
    
   //recorremos la columna de current
    var currref = db.collection('current_user').onSnapshot(query =>{
        query.forEach(docCurrentUser => {
            //recorremos la columna de persona 
            var personaref = db.collection('persona')
            .onSnapshot(quer => {
                quer.forEach(docUserData => {
                    const sitios = docUserData.data().places;
                    //buscamos el nombre del current en el de persona
                    if (docCurrentUser.data().name === docUserData.data().name) {
                        if (sitios.length < 1) {//verificamos si tiene sitios agregados
                            etiqueta_html.innerHTML = "No tiene sitios"
                            return;
                        }
                        else {
                            etiqueta_html.innerHTML = sitios.sort().join(', ')
                       }
                    }
                })
            });
        })
    });
}


mostrarSitios();