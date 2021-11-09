// const db = firebase.firestore();
async function bestRoad() {
    const data = await collectData()
    const sitios_user_names = data[0]
    const sitios_data = data[1]

    // validar que hayan al menos 2 sitios
    if (sitios_user_names.length < 2) {
        alert("No posee sitios para calcular una ruta")
        return
    }

    // make all possible roads
    const posibleRoads = []
    const iterations = sitios_user_names.length
    for (var i = 0; i < iterations; i++) {
        for (var j = 0; j < iterations; j++) {
            if (i == j) continue
            const newRoad = (numStart, numEnd) => {
                const array = []
                // create new posible road
                array.push(sitios_user_names[numStart])
                for (var k = 0; k < iterations; k++) {
                    if (k != numStart & k != numEnd) array.push(sitios_user_names[k])
                }
                array.push(sitios_user_names[numEnd])

                // push the new road to the posible roads to evaluate
                posibleRoads.push(array)
            }
            newRoad(i, j)
        }
    }

    const matrix_adyacencias = []
    const matrix_recorridos = []
    // make matrix and execute algorithm for each possible road
    for (var i = 0; i < posibleRoads.length; i++) {
        const matrix = makeMatrix(posibleRoads[i], sitios_data)
        const results = algorithm(matrix[0], matrix[1])
        if (results[1] != Infinity) {
            matrix_adyacencias.push(results[0])
            matrix_recorridos.push(results[1])
        }
    }

    const roads = []
    const distances_from_roads = []
    // get final road and distance from each possible road
    for (var i = 0; i < matrix_adyacencias.length; i++) {
        const readedResults = readResults(posibleRoads[i], matrix_adyacencias[i], matrix_recorridos[i])
        if (readedResults[1] != Infinity) {
            roads.push(readedResults[0])
            distances_from_roads.push(readedResults[1])
        }
    }

    // validet if there is no posible results
    if (roads.length < 1) {
        alert('No se ha podido calcular ninguna ruta')
        return
    }
    
    // get index from the shortest road
    const shortestDistance = (list) => {
        for (var i = 0; i < list.length; i++) {
            if (list[i] == Math.min(...list)) return i
        }
    }
    const index = shortestDistance(distances_from_roads)

    // get array with road
    const mejor_ruta = roads[index]
    // get distance
    const distancia = distances_from_roads[index]

    // add data to DOM
    document.getElementById('best_road_text').innerHTML = mejor_ruta
    document.getElementById('km_best').innerHTML = distancia + 'km'
}

async function shortestRoad() {
    const lugar_origen = document.getElementById('lugar_origen_short').value;
    const lugar_destino = document.getElementById('lugar_destino_short').value;

    // validar que no hayan campos vacios
    if (lugar_origen == "" || lugar_destino == "") {
        alert("Hacen falta campos por rellenar")
        return;
    }

    var sitios_user = []
    const data = await collectData()
    const sitios_user_names = data[0]
    const sitios_data = data[1]

    // PENDIENTE validar que se utilicen caminos que pasen unicamente por los lugares del usuario

    // validar que el usuario tenga añadidos los sitios
    const isLugarOrigenInUser = () => {
        for (var i = 0; i < sitios_data.length; i++) {
            if (lugar_origen == sitios_data[i]["name"]) return true
        }
        return false
    } 
    const isLugarDestinoInUser = () => {
        for (var i = 0; i < sitios_data.length; i++) {
            if (lugar_destino == sitios_data[i]["name"]) return true
        }
        return false
    }
    // the user does not have the places added yet
    if (!isLugarOrigenInUser() || !isLugarDestinoInUser()) {
        alert("Debe agregar esos lugares a sus sitios primero")
        return
    }

    // create array being index 0 the starting place and last index the end place
    // add first item
    sitios_user.push(lugar_origen)
    // add items
    for (var i = 0; i < sitios_user_names.length; i++) {
        if (sitios_user_names[i] != lugar_origen & sitios_user_names[i] != lugar_destino) {
            sitios_user.push(sitios_user_names[i])
        }
    }
    // add last item
    sitios_user.push(lugar_destino)

    // make matrix
    const matrices = makeMatrix(sitios_user, sitios_data)
    const matrix_adyacencia = matrices[0]
    const matrix_recorridos = matrices[1]

    // algorithm
    const matrix_results = algorithm(matrix_adyacencia, matrix_recorridos);
    const matrix_adyacencia_results = matrix_results[0]
    const matrix_recorridos_results = matrix_results[1]

    // read results
    const results = readResults(sitios_user, matrix_adyacencia_results, matrix_recorridos_results)
    // array with shortest road in order
    const ruta_corta = results[0]
    // distance from start point to end point
    const distancia = results[1]

    // validar que la distancia no sea infinito
    if (distancia == Infinity) {
        alert("No es posible realizar un camino hacia ese destino, hacen falta carreteras")
        return
    }

    // show results as an array
    document.getElementById('shortest_road_text').innerHTML = ruta_corta;
    document.getElementById('km_short').innerHTML = distancia + 'km'
}

async function collectData() {
    var sitios_user = []
    var sitios_objects = []

    async function getData() {
        try {
            // get current user name
            const responseCurrentUser = await db.collection("current_user").where("name", "!=", "").get()
            
            var response_name = []
            responseCurrentUser.forEach((item) => {
                response_name.push(item.data())
            })
            
            // find current user and get full object
            var response_user = []
            const current_user_name = response_name[0]["name"]
            const responseUser = await db.collection("persona").where("name", "==", current_user_name).get()

            responseUser.forEach((item) => {
                response_user.push(item.data())
            })

            // make an array with the names of the places from the user
            response_user[0]["places"].forEach((sitio) => {
                sitios_user.push(sitio)
            })

        }
        catch (error) {
            console.log("error getting items" + error)
        }
    }
    await getData()
    
    async function getPlacesData() {
        try {
            // find the places from the user in database and make an array with those objects
            for (var i = 0; i < sitios_user.length; i++) {
                const response = await db.collection("SitiosTT").where("name", "==", sitios_user[i]).get();
                
                response.forEach((item) => {
                    sitios_objects.push(item.data())
                })
            }
        }
        catch (error) {
            console.log("error getting items")
        }
    }    
    await getPlacesData()

    return [sitios_user, sitios_objects];
}

function roadExists(sitios_data, sitio_origen, sitio_destino) {
    var exists = false
    sitios_data.forEach((item) => {
        if (item["name"] == sitio_origen) {
            try {
                item["roads"].forEach((road) => {
                    if (road == sitio_destino) {
                        exists = true;
                    }
                })
            }
            catch (error) {
                // do nothing
                // this makes an error if roads are empty
            }
        }
    })

    return exists;
}

function makeMatrix(sitios_user, sitios_data) {
    // matriz de adyacencia
    var matrix_adyacencia = []
    var matrix_recorridos = []
    const LENGTH = sitios_user.length
    for (var row = 0; row < LENGTH; row++) {
        var aux_array = []
        for (var column = 0; column < LENGTH; column++) {
            const sitio_origen = sitios_user[row];
            const sitio_destino = sitios_user[column];

            if (row == column) {
                aux_array.push(0)
            }
            else if (roadExists(sitios_data, sitio_origen, sitio_destino)) {
                // get coords
                var lat1, lng1, lat2, lng2;
                sitios_data.forEach((sitio) => {
                    if (sitio["name"] == sitio_origen) {
                        lat1 = sitio["coords"][0];
                        lng1 = sitio["coords"][1];
                    }
                    if (sitio["name"] == sitio_destino) {
                        lat2 = sitio["coords"][0];
                        lng2 = sitio["coords"][1];
                    }
                })
                
                // get distance between both places
                aux_array.push(Math.round(haversine(lat1, lng1, lat2, lng2)))
            }
            else {
                aux_array.push(Infinity)
            }
        }
        matrix_adyacencia.push(aux_array)
    }

    // matriz de recorridos
    for (var row = 0; row < LENGTH; row++) {
        var aux_array = []
        for (var column = 0; column < LENGTH; column++) {
            if (column == row) {
                aux_array.push(0)
            }
            else {
                aux_array.push(column)
            }
        }
        matrix_recorridos.push(aux_array)
    }

    return [matrix_adyacencia, matrix_recorridos]
}

function readResults(sitios_user, matrix_adyacencia, matrix_recorridos) {
    const distancia = matrix_adyacencia[0][matrix_adyacencia.length - 1]
    var recorrido = []

    // add last place
    recorrido.push(sitios_user.length - 1)
    // read data from algorithm results
    var num = sitios_user.length - 1;
    while (num != matrix_recorridos[0][num]) {
        recorrido.push(matrix_recorridos[0][num]);
        var aux = matrix_recorridos[0][num];
        num = aux;
    }
    recorrido.push(0)

    // invertir array
    var recorrido_data = []
    for (var i = recorrido.length - 1; i >= 0; i--) {
        recorrido_data.push(recorrido[i])
    }

    // change num to string (name of the place)
    for (var i = 0; i < recorrido_data.length; i++) {
        recorrido_data[i] = sitios_user[recorrido_data[i]]
    }

    return [recorrido_data, distancia]
}

function haversine(lat1, lng1, lat2, lng2) {
    // calcula la distancia en km entre 2 puntos geográficos (distancia en linea recta, no toma en cuenta carreteras)
    // !!puede fallar con distancias menores a 20km
    // retorna la distancia entre las posiciones ingresadas
    // referencia: https://www.genbeta.com/desarrollo/como-calcular-la-distancia-entre-dos-puntos-geograficos-en-c-formula-de-haversine
    const RADIO_TIERRA = 6371
    lat1 = (lat1 * Math.PI) / 180
    lat2 = (lat2 * Math.PI) / 180
    lng1 = (lng1 * Math.PI) / 180
    lng2 = (lng2 * Math.PI) / 180
    var lat_promedio = lat2 - lat1
    var lng_promedio = lng2 - lng1
    a = Math.pow(Math.sin(lat_promedio/2),2) + Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(lng_promedio/2),2)
    c = 2* Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    distancia = RADIO_TIERRA * c
    return distancia
}

function algorithm(matrix_adyacencia, matrix_recorridos) {
    for (var vertice = 0; vertice < matrix_adyacencia.length; vertice++) {
        for (var row = 0; row < matrix_adyacencia.length; row++) {
            for (var column = 0; column < matrix_adyacencia.length; column++) {
                if (matrix_adyacencia[row][vertice] + matrix_adyacencia[vertice][column] < matrix_adyacencia[row][column]) {
                    matrix_adyacencia[row][column] = matrix_adyacencia[row][vertice] + matrix_adyacencia[vertice][column]
                    matrix_recorridos[row][column] = vertice
                    // var ascii_value = vertice + 97
                    // matrix_recorridos[row][column] = String.fromCharCode(ascii_value)
                }
            }
        }
    }

    return [matrix_adyacencia, matrix_recorridos];
}