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

    var sitios_user = []
    var sitios_user_names = []
    async function continue1() {
        const data = await collectData()
        console.log(data)
        // array with names of the places
        sitios_user_names = data[0]
        // array with data from the places (objects)
        sitios_data = data[1]
    
        console.log(data[0] + ", " + data[1])
    
    
        // PENDIENTE validar que el usuario tenga agregados los sitios y que existan en la base de datos
        // es posible omitir que los tenga agregados mientras estos estén en la base de datos
    
        // create array being index 0 the starting place and last index the end place
        // add first item
        sitios_user_names.forEach((item) => {
            if (item == lugar_origen) {
                sitios_user.append(item) 
            }
        })
        // add items
        sitios_user_names.forEach((item) => {
            if (item == lugar_origen && item != lugar_destino) {
                sitios_user.push(item) 
            }
        })
        // add last item
        sitios_user.push(lugar_destino)
    
        // crear matrices vacias
        matrix_adyacencia = []
        matrix_recorridos = []
        for (var i = 0; i < sitios_user.length; i++) {
            var arr = [];
            for (var j = 0; j < sitios_user.length; j++) {
                arr.push(null);
            }
            matrix_adyacencia.push(arr);
            matrix_recorridos.push(arr);
        }
    
        // llenar matrices
        makeMatrix(sitios_user, sitios_data, matrix_adyacencia, matrix_recorridos)
    
        // algorithm
        var matrices = algorithm(matrix_adyacencia, matrix_recorridos);
        matrix_adyacencia = matrices[0]
        matrix_recorridos = matrices[1]
    
        // read results
        var results = readResults(sitios_user, matrix_adyacencia, matrix_recorridos)
        // array with shortest road in order
        ruta_corta = results[0]
        // distance from start point to end point
        var distancia = results[1]
    
        // show results as an array
        etiqueta_html.innerHTML = ruta_corta + ", " + distancia;

    }
    continue1()
}

async function collectData() {
    var sitios_user = []
    var sitios_objects = []

    async function getData() {
        try {
            // get current user name
            const responseCurrentUser = await db.collection("current_user").where("name", "==", "123").get()
            console.log(responseCurrentUser)
            
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

            //var sitios_user_data = []
            // make an array with the names of the places from the user
            response_user[0]["places"].forEach((sitio) => {
                sitios_user.push(sitio)
            })

            getPlacesData()
        }
        catch (error) {
            console.log("error getting items" + error)
        }
    }
    getData()

    async function getPlacesData() {
        try {
            // find the places from the user in database and make an array with those objects
            for (var i = 0; i < sitios_user.length; i++) {
                const response = await db.collection("SitiosTT").where("name", "==", sitios_user[i]).get();

                response.forEach((item) => {
                    sitios_objects.push(item.data())
                })
            }

            return await [sitios_user, sitios_objects];
        }
        catch (error) {
            console.log("error getting items")
        }
    }
}

function roadExists(sitios_data, sitio_origen, sitio_destino) {
    sitios_data.forEach((item) => {
        if (item["name"] == sitio_origen) {
            item["places"].forEach((road) => {
                if (road == sitio_destino) return true;
            })
        }
    })
    return false;
}

function makeMatrix(sitios_user, sitios_data, matrix_adyacencia, matrix_recorridos) {
    // matriz de adyacencia
    for (var row = 0; row < matrix_adyacencia.length; row++) {
        for (var column = 0; column < matrix_adyacencia; column++) {
            var sitio_origen = sitios_user[row];
            var sitio_destino = sitios_user[column];

            if (row == column) matrix_adyacencia[row][column] = 0;
            else if (roadExists(sitios_data, sitio_origen, sitio_destino)) {
                // get coords
                var lat1, lng1, lat2, lng2;
                sitios_data.forEach((sitio) => {
                    if (sitio["name"] == sitio_origen) {
                        lat1, lng1 = sitio["coords"];
                    }
                    if (sitio["name"] == sitio_destino) {
                        lat2, lng2 = sitio["coords"];
                    }
                })
                
                // get distance between both places
                matrix_adyacencia[row][column] = haversine(lat1, lng1, lat2, lng2);
            }
            else matrix_adyacencia[row][column] = Infinity;
        }
    }

    // matriz de recorridos
    for (var row = 0; row < matrix_recorridos.length; row++) {
        for (var column = 0; column < matrix_recorridos.length; column++) {
            if (column == row) {
                matrix_recorridos[row][column] = 0;
            }
            else {
                matrix_recorridos[row][column] = column;
                // matrix_recorridos[row][column] = String.fromCharCode(column + 97)
            }
        }
    }
}

function readResults(sitios_user, matrix_adyacencia, matrix_recorridos) {
    const distancia = matrix_adyacencia[0][matrix_adyacencia.length]
    var recorrido = []

    // read data from algorithm results
    var num = matrix_recorridos.length;
    while (num != matrix_recorridos[0][num]) {
        recorrido.push(matrix_recorridos[0][num]);
        var aux = matrix_recorridos[0][num];
        num = aux;
    }
    recorrido.push(0)

    // invertir array
    var recorrido_data
    for (var i = recorrido.length - 1; i >= 0; i++) {
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