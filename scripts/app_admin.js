function ingresarSitio() {
    // validar que no hayan sitios repetidos
    // añadir sitio a la base de datos con TODAS sus variables
    const name = document.getElementById('nombre_sitio').value
    const latitud = document.getElementById('latitud').value
    const longitud = document.getElementById('longitud').value

    // verificar que no hayan campos vacios
    if (name == "" || latitud == "" || longitud == "") {
        alert ("Debes ingresar todos los campos.")
        return
    }

    db.collection("SitiosTT").where("name", "==", name).get()
    .then((data) => {
        const sitios = []
        
        // obtener cada dato
        data.forEach((item) => {
            sitios.push(item.data())
        })
    
        //Si el arreglo donde los elementos son iguales tiene elementos
        if(sitios.length > 0) {
            alert("Sitio ya existe en la base de datos.")
            return
        }

        const coords = [parseFloat(latitud, 10), parseFloat(longitud, 10)]
        
        //Si el sitio no existe en la colección, entonces se agrega a la base de datos
        db.collection("SitiosTT").doc().set({
            name,
            coords,
            roads: [],
            disponible: true
        })

        //Se agrega el sitio a la colección stats para mantener el conteo de visitantes
        db.collection("stats").doc().set({
            name,
            visitantes: 0
        }) 

        alert("Sitio ingresado correctamente")
    })
    .catch(err => console.log('Error obteniendo los datos', err))
}

async function ingresarCarretera() {
    // añadir carreteras al vector del objeto "lugar" en la base de datos
    // validar que no hayan carreteras repetidas
    // validar que ambos vértices existan (lugares)
    // las carreteras se van a añadir colocando el nombre del lugar destino en el objeto del lugar de inicio
    const carretera_origen = await document.getElementById('new_road_origen').value
    const carretera_destino = await document.getElementById('new_road_destino').value

    // validar que no hayan campos vacios
    if (carretera_origen == "" || carretera_destino == "") {
        window.alert("Hacen falta campos por completar")
        return
    }
    
    if(carretera_origen == carretera_destino){
        window.alert("Destino y origen son iguales")
        return
    }

    // CAMBIAR A CAMPOS REALES , SITIOS .. NOMBRES ETC...
    //Agregar sobre su disponibiidad si su Disponibilidad es False , decir que no
    const ruteOrigenRef = await db.collection('SitiosTT').where("name", "==", carretera_origen)
    const ruteDestinoRef = await db.collection('SitiosTT').where("name", "==", carretera_destino)
    const alertaValue = "!" + carretera_destino
    const origenRoad = []
    const destinoRoad = []

    //SI EXISTE ALERTA! 
    const responseOrigen = await db.collection('SitiosTT').where('name', '==', carretera_origen).get()
    responseOrigen.forEach((item) => {
        origenRoad.push(item.data())
    })

    if (origenRoad.length < 1) {
        alert("No existe Sitio de Origen")
        return
    }
    
    const responseDestino = await db.collection('SitiosTT').where('name', '==', carretera_destino).get()
    responseDestino.forEach((item) => {
        destinoRoad.push(item.data())
    })

    if (destinoRoad.length < 1) {
        alert("No existe Sitio de Destino")
        return
    }

    try {
        await db.collection('SitiosTT').where('name', '==', carretera_origen).get()
        .then(snapshotalerta => {
            snapshotalerta.docs.forEach(doc => {
                const alertaArray = doc.data().roads
                for (var i = 0; i < alertaArray.length; i++) {
                    if (alertaArray[i] == alertaValue) {
                        alert("Existe una Carretera Dañada ")
                        return
                    }
                }
            })
        })
    } catch (error) {
        console.log(error)
    }


    //TryCatch de Origen
    try {
        ruteOrigenRef.onSnapshot(origenRoadDocs => {
            origenRoadDocs.forEach((doc) => {
                const idRutaOrigen = doc.id
                ruteDestinoRef.onSnapshot(destinoRoadDocs => {
                    destinoRoadDocs.forEach(async(snaphijo) => {
                        await AddCarretera(idRutaOrigen, carretera_destino)
                    })
                })
            })   
        })
        alert("Se ingresó la carretera correctamente")
    } catch (error) {
        console.log(error)
    }
    //TryCatch de Destino
}

async function alertaCarretera() {
    // añadir alerta a carreteras
    // verificar que exista el lugar en la base de datos
    // verificar que exista la carretera en la base de datos
    // modificar el vector de carreteras del objeto "lugar" en la base de datos
    // el modo en que lo vamos a hacer es añadiendo un "!" antes del nombre de la carretera
    const carretera_origen = document.getElementById('damage_road_origen').value
    const carretera_destino = document.getElementById('damage_road_destino').value

    //verificamos que los campos no esten vacios
    if (carretera_origen == "") {
        window.alert("No ingreso sitio de origen")
        return
    }
    
    // verificamos que los campos no esten vacios
    if (carretera_destino == "") {
        window.alert("No ingreso sitio de Destino")
        return
    }

    try {
        db.collection("SitiosTT").where('name', '==', carretera_origen).get()
        .then(snapshot => {
            if (snapshot.docs.length < 1) {
                alert('La carretera ingresada no existe')
                return
            }

            snapshot.docs.forEach(doc => {
                //obtenemos el valor de la matriz en el arreglo
                const carretera = doc.data().roads
                if (carretera.length < 1) {
                    alert('La carretera ingresada no existe')
                    return
                }

                //recorremos la matriz de la base de datos
                for (var i = 0; i < carretera.length; i++) {
                    //verificamos que la carretera exista en la base de datos
                    if (carretera[i] == carretera_destino) {
                        addAlertaInDB(doc.id, carretera_destino)
                        alert("La alerta fue añadida con exito ")
                        return
                    }
                }
                alert("La carretera ingresada no existe o ya se encuentra con una alerta")
            })     
        })
    }
    catch {
        alert("el origen no se encuentra en la base de datos")
    }
}

function removeAlertaCarretera() {
    const carretera_origen = document.getElementById('damage_road_origen').value
    const carretera_destino = document.getElementById('damage_road_destino').value
    const concatenar = "!" + carretera_destino

    // verificamos que los campos no esten vacios
    if (carretera_origen == "") {
        alert("No ingreso sitio de origen")
        return
    }

    // verificamos que los campos no esten vacios
    if (carretera_destino == "") {
        alert("No ingreso sitio de Destino")
        return
    }

    try {
        db.collection("SitiosTT").where('name', '==', carretera_origen).get()
        .then(snapshot => {
            if (snapshot.docs.length < 1) {
                alert('La carretera ingresada no existe')
                return
            }

            snapshot.docs.forEach(doc => {  
                const carretera = doc.data().roads
                if (carretera.length < 1) {
                    alert('La carretera ingresada no existe')
                    return
                }

                const validarExistentRoad = () => {
                    for (var i = 0; i < carretera.length; i++) {
                        if (carretera[i] == carretera_destino) {
                            return true
                        }
                    }
                    return false
                }

                if (validarExistentRoad()) {
                    alert('La carretera ingresada no existe o ya se encuentra sin una alerta')
                    return
                }

                for(var i = 0; i < carretera.length ; i++) {
                    // verificamos que la carretera exista en la base de datos
                    if (carretera[i] == concatenar) {
                        retirarAlertaInDB(doc.id, carretera_destino)
                        alert('Alerta retirada con éxito')
                        return
                    }
                }
            })     
        })
    }
    catch (error) {
        alert("el origen no se encuentra en la base de datos")
    }
}

function retirarAlertaInDB(id, carretera) {
    db.collection('SitiosTT')
    .doc(id)
    .update({
        roads: firebase.firestore.FieldValue.arrayRemove('!' + carretera), 
        roads: firebase.firestore.FieldValue.arrayUnion(carretera)
    })
}

function addAlertaInDB(id, carretera) {
    db.collection('SitiosTT')
    .doc(id)
    .update({
        roads: firebase.firestore.FieldValue.arrayRemove(carretera),
        roads: firebase.firestore.FieldValue.arrayUnion('!' + carretera)
    })
}

async function deshabilitarSitio() { 
    // verificar que el sitio exista
    // cambiar la variable bool a false en la base de datos del sitio ingresado
    const lugar = document.getElementById('site_disabled').value

    // validar que no hayan campos vacios
    if (lugar == "") {
        alert("Hacen falta campos por completar")
        return
    }

    try {
        const response = await db.collection('SitiosTT').where("name", "==", lugar).get()
        response.forEach(async(item) => {
            const itemId = item.id
            changeDisponibilidadSitio(itemId, false)
            await deletePlaces(lugar)
            alert("Se deshabilitó " + lugar)
        }) 
    }
    catch (error) {
        console.log("Error " + error)
        return
    }
}

async function habilitarSitio() {
    // verificar que el sitio exista
    const lugar = document.getElementById('site_disabled').value
    
    // validar que no hayan campos vacios
    if (lugar == "") {
        alert("Campo Vacío")
        return
    }

    try {
        const response = await db.collection('SitiosTT').where("name", "==", lugar).get()
        response.forEach((item) => {
            const itemId = item.id
            changeDisponibilidadSitio(itemId, true)
            alert("Se habilitó " + lugar)
        })
    }
    catch (error) {
        console.log("Error: " + error)
        return
    }
}

async function showStats() {
    visitantesGuatemala()
    visitantesSitios()
}
showStats()

async function visitantesGuatemala() {
    const etiqueta_html = document.getElementById('estadisticas')
    const users = []

    /** Cantidad de visitantes en Guatemala */
    const datos = await db.collection('persona').get()

    datos.forEach((item) => {
        users.push(item.data())
    })

    const cantidad_visitantes = users.length
    const texto_estadisticas = "Cantidad de visitantes en Guatemala: " + cantidad_visitantes

    // añadir datos al html
    etiqueta_html.innerHTML = texto_estadisticas
}

function visitantesSitios() {
    const data_places = []
    const tabla = document.getElementById('tabla')
    
    db.collection("stats").get()
    .then((querySnapshot) => {
        tabla.innerHTML = ''
        querySnapshot.forEach((doc) => {
            data_places.push({
                name: doc.data().name,
                visitantes: doc.data().visitantes
            })
        })
    })
    .then(() => {
        data_places.sort((a, b) => b.visitantes - a.visitantes)
        data_places.forEach((item) => {
            tabla.innerHTML += `
            <tr>
            <td>${item.name}</td>
            <td>${item.visitantes}</td>
            </tr>
            `
        })
    })
}

async function changeDisponibilidadSitio(id, newBoolValue) {
    await db.collection('SitiosTT')
    .doc(id)
    .update({
        disponible: newBoolValue
    })
}

async function AddCarretera(id, DestinoValue) {
    await db.collection('SitiosTT')
    .doc(id)
    .update({
        roads: firebase.firestore.FieldValue.arrayUnion(DestinoValue)
    })
}

async function deletePlaces(nombredelSite) {
    const place = []
    const responsePlace = await db.collection('SitiosTT').where('name', '==', nombredelSite).get()
    responsePlace.forEach((item) => {
        place.push(item.data())
    })

    const deleteName = await db.collection('persona').where('places','array-contains', nombredelSite)
    deleteName.onSnapshot(docs => {
        docs.forEach((doc) => {
            if (!place[0]['disponible']) {
                borrarHelper(doc.id, nombredelSite)
            }
        })
    })
}

async function borrarHelper(id, nombreSite){
    await db.collection('persona')
    .doc(id)
    .update({
        places: firebase.firestore.FieldValue.arrayRemove(nombreSite)
    })
}
