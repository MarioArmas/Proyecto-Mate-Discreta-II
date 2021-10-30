function ingresarSitio() {
    // validar que no hayan sitios repetidos
    // añadir sitio a la base de datos con TODAS sus variables
    var name = document.getElementById('nombre_sitio').value;
    var latitud = document.getElementById('latitud').value;
    var longitud = document.getElementById('longitud').value;
    var disponible = true;
    var carreteras = []
    
    // verificar que no hayan campos vacios
    if (name == "" || latitud == "" || longitud == "") {
        return;
    }

    // codigo
}

function ingresarCarretera() {
    // añadir carreteras al vector del objeto "lugar" en la base de datos
    // validar que no hayan carreteras repetidas
    // validar que ambos vértices existan (lugares)
    // las carreteras se van a añadir colocando el nombre del lugar destino en el objeto del lugar de inicio
    var carretera_origen = document.getElementById('new_road_origen').value;
    var carretera_destino = document.getElementById('new_road_destino').value;

    // validar que no hayan campos vacios
    if (carretera_origen == "" || carretera_destino == "") {
        return;
    }

    // codigo
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
    if (lugar == "") {
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