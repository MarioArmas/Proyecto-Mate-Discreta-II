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
    
    async function Add()
    {
        var sitios = [];

        // validar que no hayan sitios repetidos
        const data = await db.collection("sitios").where("name", "==", name).get(); 

        // obtener cada dato
        data.forEach((item) => {
            sitios.push(item.data());
        })

        for (var i = 0; i < sitios.length; i++)
        {
            var x = site[i];
            if(x["name"] == name_place)
            {
                alert("Sitio ya existe");
                console.log ("Sitio ya existe");
                i = sitios.length;  //romper ciclo for
            }
            else
            {
                db.collection("sitios").doc().set()({   //Si el sitio no existe en la colección, entonces se agrega a la base de datos
                    name,
                    latitud,
                    longitud,
                    disponible,
                })
            }
        }
        
    }
    Add();
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
    }else if(carretera_origen == carretera_destino){
        console.warn('Same-Value');
        return;
    }

    // codigo
    // CAMBIAR A CAMPOS REALES , SITIOS .. NOMBRES ETC...
    //Agregar sobre su disponibiidad si su Disponibilidad es False , decir que no
    var ruteOrigenRef= db.collection('SitiosTT').where("name","==",carretera_origen);   //Cambiar Campos a Sitio
    var ruteDestinoRef= db.collection('SitiosTT').where("name","==",carretera_destino);
    var IdRutaOrigen;
    var ToFOrigen,ToFDestino;


    //TryCatch de Origen
    try {
        ruteOrigenRef.onSnapshot(snapshot1 => {
            snapshot1.forEach((snaphijo1) => {
                IdRutaOrigen=snaphijo1.id
                ToFOrigen=snaphijo1.data().disponible;
                
                ruteDestinoRef.onSnapshot(snapshot2 => {
                    snapshot2.forEach((snaphijo2) => {
                        ToFDestino=snaphijo2.data().disponible;
                        if(ToFDestino && ToFOrigen ==true){
                            AddCarretera(IdRutaOrigen,carretera_destino)
                        }
                    })
                })
            })
        })
        
    } catch (error) {       //Enviar mensaje que la ruta origen no existe
        return;
    }
    //TryCatch de Destino


}

async function alertaCarretera() {
    // añadir alerta a carreteras
    // verificar que exista el lugar en la base de datos
    // verificar que exista la carretera en la base de datos
    // modificar el vector de carreteras del objeto "lugar" en la base de datos
    // el modo en que lo vamos a hacer es añadiendo un "!" antes del nombre de la carretera
    var carretera_origen = document.getElementById('damage_road_origen').value;
    var carretera_destino = document.getElementById('damage_road_destino').value;
    var carretera = [];                   //arreglo donde se busca en la matriz

    if (carretera_origen == "")//verificamos que los campos no esten vacios
    {
        return;
    }

    try {
    const sitiosref = await db.collection("TestSitios") //buscamos en una base de datos TEST ya que Aun no esta creada la verdadera CAMBIAR
    const queryy = sitiosref.where('name', '==', carretera_origen); //Buscamos en la coleccion del nombre de origen
        queryy.get().then(snapshot => {
            snapshot.docs.forEach(doc => {  
                carretera = doc.data().places;   //obtenemos el valor de la matriz en el arreglo
                for(var i = 0; i < carretera.length ; i++)  //recorremos la matriz de la base de datos 
                {
                    if (carretera[i]==carretera_destino)//verificamos que la carretera exista en la base de datos
                    {
                        Carreteradañada(doc.id,carretera_destino);  //mandamos los datos para la funcion
                    
                        mostrara.innerHTML = "La alerta fue añadida con exito "   
                    }
                    else if(carretera[i]!=carretera_destino)
                    {
                        
                    }
                }
            })     
        })
    }
   catch {
       console.log("Error")
   }
}

function Carreteradañada(id,destino) {//borramos la carretera para despues actualizarla con la alerta
    var alerta = "!"+ destino;
     
    const test = db.collection('TestSitios');
    test
    .doc(id)
        .update({
             places: firebase.firestore.FieldValue.arrayRemove(destino)//borramos la carretera de destino 
    })
    updatecarretera(id,alerta);//le damos los datos a la funcion de atualizar

}

function updatecarretera(id,cambio) { // actualizamos la base de datos con la alerta
    const testt = db.collection('TestSitios');
    testt
        .doc(id)
        .update({
            places: firebase.firestore.FieldValue.arrayUnion(cambio)//agregamos una carretera ya con la alerta
    })     
}

async function deshabilitarSitio() { 
    // verificar que el sitio exista
    // cambiar la variable bool a false en la base de datos del sitio ingresado
    var lugar = document.getElementById('site_disabled').value;

    // validar que no hayan campos vacios
    if (lugar == "") {
        return;
    }

    // codigo
    try {
        var setDesHabiRef= await db.collection('SitiosTT').where("name","==",lugar);  //Cambiar 'Persona' por Sitios Turisticos *no added yet
        setDesHabiRef
            .onSnapshot(snapshot=>{
                snapshot.forEach( (snaphijo)=>{
                    Ddeshabilitar(snaphijo.id);
                })
            })
            
    }
    catch (error) {
        console.log("Error"+error)
        return;
    }
}

async function habilitarSitio() {
    // verificar que el sitio exista
    // cambiar la variable bool a true en la base de datos del sitio ingresado
    var lugar = document.getElementById('site_disabled').value;
    
    // validar que no hayan campos vacios
    if (lugar == "") {
        return;
    }

    // codigo
    try {
        var setHabiRef= await db.collection('SitiosTT').where("name","==",lugar);  //Cambiar 'Persona' por Sitios Turisticos *no added yet
        setHabiRef
            .onSnapshot(snapshot=>{
                snapshot.forEach( (snaphijo)=>{
                    Dhabilitar(snaphijo.id);
                })
            })
        
    } catch (error) {
        console.log("Error: "+error)
        return;     
    }

}

function showStats() {
    // recoger todas las estadisticas que pide el doc de word y añadirlas al html
    var etiqueta_html = document.getElementById('estadisticas');
    var texto_estadisticas = "";

    // codigo

    // añadir datos al html
    etiqueta_html.innerHTML = texto_estadisticas;
}

function Dhabilitar(id){
    const setEstadoRef=db.collection('SitiosTT'); //Cambiar A SITIOS TURISTICOS (Aun no creados) 
    setEstadoRef
        .doc(id)
        .update({
            disponible: true
        }).then(() => {
            location.reload();  //Refrescar Pantalla, Para evitar Bug de disponibilidades
        })
}

function Ddeshabilitar(id){
    const setEstadoRef=db.collection('SitiosTT'); //Cambiar A SITIOS TURISTICOS (Aun no creados) 
    setEstadoRef
        .doc(id)
        .update({
            disponible: false
        }).then(() => {
            location.reload();    //Refrescar Pantalla, Para evitar Bug de disponibilidades
        })
}

function AddCarretera(id,DestinoValue){
    const setCarreteraRef=db.collection('SitiosTT'); //Cambiar A SITIOS
    setCarreteraRef
        .doc(id)
        .update({
            roads: firebase.firestore.FieldValue.arrayUnion(DestinoValue)
        }).then(()=>{
            location.reload();
        })
}
