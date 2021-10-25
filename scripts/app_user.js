// IMPORTANTE
// En la base de datos debe haber un colection con el "current user" del cual se deben gestionar los datos ya que ese seria el usuario actual


function agregarSitio() {
    // añadir sitios al vector del objeto "user" en la base de datos
    // al vector de le irán añadiendo el nombre del sitio (todo minúscula y separado con espacios)
    // validar que hayan datos en los campos (frontend)
    // validar que no hayan repetidos
    var name_place = document.getElementById('place_name').value;

    // validar que no hayan campos vacios
    if (name_place == "") {
        return;
    }
}

function elminiarSitio() {
    // verificar que no hayan campos vacios
    // eliminar el sitio del vector de sitios del objeto "user" en la base de datos si es que existe
    var name_place = document.getElementById('place_name').value;

    // validar que no hayan campos vacios
    if (name_place == "") {
        return;
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
