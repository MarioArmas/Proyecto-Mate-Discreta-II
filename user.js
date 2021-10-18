// algoritmo
var array = []
var matrix_adyacencia = []
var matrix_recorridos = []

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

function llenar_matrices() {
    // matriz de adyacencia

    // matriz de recorridos
    for (var row = 0; row < array.length; row++) {
        for (var column = 0; column < array.length; column++) {
            if (column == row) {
                matrix_recorridos[row][column] = 0;
            }
            else {
                matrix_recorridos[row][column] = String.fromCharCode(column + 97)
            }
        }
    }
}


function algorithm() {
    for (var vertice = 0; vertice < array.length; vertice++) {
        for (var row = 0; row < array.length; row++) {
            for (var column = 0; column < array.length; column++) {
                if (matrix_adyacencia[row][vertice] + matrix_adyacencia[vertice][column] < matrix_adyacencia[row][column]) {
                    matrix_adyacencia[row][column] = matrix_adyacencia[row][vertice] + matrix_adyacencia[vertice][column]
                    var ascii_value = vertice + 97
                    matrix_recorridos[row][column] = String.fromCharCode(ascii_value)
                }
            }
        }
    }
}