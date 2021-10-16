// algoritmo
var array = []
var matrix_adyacencia = []
var matrix_recorridos = [[]]

function llenar_matrices() {
    // matriz de adyacencia

    // matriz de recorridos
    for (var row = 0; row < array.length(); row++) {
        for (var column = 0; column < array.length(); column++) {
            if (column == row) {
                matriz_recorridos[row][column] = 0
            }
            else {
                matriz_recorridos[row][column] = String.fromCharCode(column + 97)
            }
        }
    }
}


function algorithm(num) {
    for (var vertice = 0; vertice < array.length(); vertice++) {
        for (var row = 0; row < array.length(); row++) {
                for (var column = 0; column < array.length(); column++) {
                if (matrix_adyacencia[row][vertice] + matrix_adyacencia[vertice][column] < matrix_adyacencia[row][column]) {
                    matrix_adyacencia[row][column] = matrix_adyacencia[row][vertice] + matrix_adyacencia[vertice][column]
                    var ascii_value = vertice + 97
                    matriz_recorridos[row][column] = String.fromCharCode(ascii_value)
                }
            }
        }
    }
}