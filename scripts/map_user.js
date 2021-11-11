function showSimpleMap() {
    const coordenadas = {lat: 14.5947755, lng: -90.485321}
    var map = new google.maps.Map(document.getElementById('map_short'),{
        zoom: 10,
        center: coordenadas
    });
    var map = new google.maps.Map(document.getElementById('map_best'),{
        zoom: 10,
        center: coordenadas
    });
}