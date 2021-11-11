function showMap() {
    const lat = parseFloat(document.getElementById("latitud").value)
    const lng = parseFloat(document.getElementById("longitud").value)
    const coordenadas = {lat, lng};

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