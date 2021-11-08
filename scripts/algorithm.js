// const db = firebase.firestore();
async function shortestRoad() {
    var lugar_origen = document.getElementById('lugar_origen_short').value;
    var lugar_destino = document.getElementById('lugar_destino_short').value;
    var etiqueta_html = document.getElementById('shortest_road_text');
    var ruta_corta;

    // validar que no hayan campos vacios
    if (lugar_origen == "" || lugar_destino == "") {
        return;
    }

    var sitios_user_names = []
    var sitios_user = []
    var sitios_data = []
    const data = await collectData()
    sitios_user_names = data[0]
    sitios_data = data[1]

    // PENDIENTE validar que se utilicen caminos que pasen unicamente por los lugares del usuario

    // validar que el usuario tenga añadidos los sitios
    var isLugarOrigenInUser = false
    var isLugarDestinoInUser = false
    for (var i = 0; i < sitios_data.length; i++) {
        if (lugar_origen == sitios_data[i]) isLugarOrigenInUser = true
        if (lugar_destino == sitios_data[i]) isLugarDestinoInUser = true
    }
    // the user does not have the places added yet
    if (!isLugarOrigenInUser || !isLugarDestinoInUser) {
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
    var matrix_adyacencia = matrices[0]
    var matrix_recorridos = matrices[1]

    // algorithm
    const matrix_results = algorithm(matrix_adyacencia, matrix_recorridos);
    matrix_adyacencia = matrix_results[0]
    matrix_recorridos = matrix_results[1]

    // read results
    const results = readResults(sitios_user, matrix_adyacencia, matrix_recorridos)
    // array with shortest road in order
    ruta_corta = results[0]
    // distance from start point to end point
    var distancia = results[1]

    // show results as an array
    etiqueta_html.innerHTML = ruta_corta + ", " + distancia;
}

async function collectData() {
    var sitios_user = []
    var sitios_objects = []

    async function getData() {
        try {
            // get current user name
            const responseCurrentUser = await db.collection("current_user").where("name", "==", "123").get()
            
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