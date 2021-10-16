function showMap(){
    var coordenadas = {lat: 14.5947755, lng: -90.485321};
    var map = new google.maps.Map(document.getElementById('map'),{
        zoom: 10,
        center: coordenadas
    });
    var marker = new google.maps.Marker({
        position: coordenadas,
        map: map,
        draggable: true
    });

    // cambiar campos "latitud" y "longitud" por las coordenadas del mapa al soltar el marcador
    /* marcador.addListener('dragend', function(event){
        document.getElementById("latitud").value = this.getPosition().lat();
        document.getElementById("longitud").value = this.getPosition().lng();
    }) */
}