function showMap(){
    const lat = parseFloat(document.getElementById("latitud").value)
    const lng = parseFloat(document.getElementById("longitud").value)
    var coordenadas = {lat, lng};
    console.log('test')

    var map = new google.maps.Map(document.getElementById('map'),{
        zoom: 10,
        center: coordenadas
    });
    var marker = new google.maps.Marker({
        position: coordenadas,
        map: map,
        draggable: true
    });
    /* if (isNaN(lat) || isNaN(lng)) {
    }
    else {
        const coords = {lat: 14.5947755, lng: -90.485321}
        var map = new google.maps.Map(document.getElementById('map'),{
            zoom: 10,
            center: coords
        });
        var marker = new google.maps.Marker({
            position: coords,
            map: map,
            draggable: true
        });
    } */

    // cambiar campos "latitud" y "longitud" por las coordenadas del mapa al soltar el marcador
    marker.addListener('dragend', function(event){
        document.getElementById("latitud").value = this.getPosition().lat();
        document.getElementById("longitud").value = this.getPosition().lng();
    })

}

function addShowMapToInput(inputID) {
    const input = document.getElementById(inputID)
    
    input.addEventListener("input", (e) =>{
        const value = parseFloat(input.value)
        if (input.value != "" & !isNaN(value)) {
            showMap()
        }
    })
}
addShowMapToInput('latitud')
addShowMapToInput('longitud')