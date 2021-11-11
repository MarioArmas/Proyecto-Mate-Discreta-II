function ingresarSitio() {
    // validar que no hayan sitios repetidos
    // añadir sitio a la base de datos con TODAS sus variables
    const name = document.getElementById('nombre_sitio').value;
    const latitud = document.getElementById('latitud').value;
    const longitud = document.getElementById('longitud').value;
    const roads = [];

    // verificar que no hayan campos vacios
    if (name == "" || latitud == "" || longitud == "") {
        alert ("Debes ingresar todos los campos.");
        return;
    }
    async function Add()
    {
        try
        {
        var sitios = [];

        // validar que no hayan sitios repetidos
        const data = await db.collection("SitiosTT").where("name", "==", name).get(); //Con base de datos correcta SitiosTT
       
        // obtener cada dato
        data.forEach((item) => {
            sitios.push(item.data());
        })
       
        if(sitios.length>0) //Si el arreglo donde los elementos son iguales tiene elementos
        {
            alert("Sitio ya existe en la base de datos.");
            return;
               
        }

        const coords = [parseFloat(latitud, 10), parseFloat(longitud, 10)];
        
        db.collection("SitiosTT").doc().set({   //Si el sitio no existe en la colección, entonces se agrega a la base de datos
            name: name,
            coords: coords,
            roads: roads,
            disponible: true,
        })
        alert ("Sitio ingresado correctamente");

        
    }
    catch (error)
    {
        alert ("Ha ocurrido un error.");
    }
        
    }
    
    Add();
}

async function ingresarCarretera() {
    // añadir carreteras al vector del objeto "lugar" en la base de datos
    // validar que no hayan carreteras repetidas
    // validar que ambos vértices existan (lugares)
    // las carreteras se van a añadir colocando el nombre del lugar destino en el objeto del lugar de inicio
    var carretera_origen = await document.getElementById('new_road_origen').value;
    var carretera_destino = await document.getElementById('new_road_destino').value;

    // validar que no hayan campos vacios
    if (carretera_origen == "" || carretera_destino == "") {
        window.alert("Hacen falta campos por completar")
        return;
    }
    
    if(carretera_origen == carretera_destino){
        window.alert("Destino y origen son iguales")
        return;
    }

    // codigo
    // CAMBIAR A CAMPOS REALES , SITIOS .. NOMBRES ETC...
    //Agregar sobre su disponibiidad si su Disponibilidad es False , decir que no
    var ruteOrigenRef= await db.collection('SitiosTT').where("name","==",carretera_origen);   //Cambiar Campos a Sitio
    var ruteDestinoRef=await db.collection('SitiosTT').where("name","==",carretera_destino);
    var IdRutaOrigen;
    var ToFOrigen, ToFDestino;
    var alertaValue = "!" + carretera_destino;
    var alertaArray = [];
    var ExistRoad=[];
    var ExistRoad2=[];
    //SI EXISTE ALERTA! 
    const NoneValue=await db.collection('SitiosTT').where('name','==',carretera_origen).get();
    NoneValue.forEach((item)=>{
        ExistRoad.push(item.data());
    })
    if(ExistRoad.length<1){
        window.alert("Alerta! No existe Sitio de Origen");
        return;

    }
    const NoneValue2=await db.collection('SitiosTT').where('name','==',carretera_destino).get();
    NoneValue2.forEach((item)=>{
        ExistRoad2.push(item.data());

    })
    if(ExistRoad2.length<1){
        window.alert("Alerta! No existe Sitio de Destino");
        return;
    }

    try {
        const Origen2Alerta=db.collection('SitiosTT');
        const typeQuery= Origen2Alerta.where('name','==',carretera_origen);
            typeQuery.get().then(snapshotalerta =>{
                snapshotalerta.docs.forEach(doc=>{
                    alertaArray=doc.data().roads;
                    for(var i=0;i<alertaArray.length;i++){
                        if(alertaArray[i]==alertaValue){
                            window.alert("Existe una Carretera Dañada ")
                            location.reload();
                        }
                    }
                })
            })
        
    } catch (error) {
    }


    //TryCatch de Origen
    try {
        ruteOrigenRef.onSnapshot(snapshot1 => {
            snapshot1.forEach((snaphijo1) => {
                IdRutaOrigen=snaphijo1.id      
                ruteDestinoRef.onSnapshot(snapshot2 => {
                    snapshot2.forEach(async(snaphijo2) => {
                        await AddCarretera(IdRutaOrigen,carretera_destino);
                    })
                })
            })   
        }), window.alert("SE Ingreso Correctamente");
        
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
    const carretera_origen = document.getElementById('damage_road_origen').value;
    const carretera_destino = document.getElementById('damage_road_destino').value;

    if (carretera_origen == "")//verificamos que los campos no esten vacios
    {
        window.alert("No ingreso sitio de origen")
        return;
    }
    else if (carretera_destino == "")//verificamos que los campos no esten vacios
    {
        window.alert("No ingreso sitio de Destino")
        return;
    }
    try {
    const sitiosref = await db.collection("SitiosTT") 
    const query = sitiosref.where('name', '==', carretera_origen); //Buscamos en la coleccion del nombre de origen
        query.get().then(snapshot => {
            snapshot.docs.forEach(doc => {  
                const carretera = doc.data().roads;   //obtenemos el valor de la matriz en el arreglo
                if (carretera.length < 1) {
                    alert('La carretera ingresada no existe')
                    return
                }
                for(var i = 0; i < carretera.length ; i++)  //recorremos la matriz de la base de datos 
                {
                    if (carretera[i]==carretera_destino)//verificamos que la carretera exista en la base de datos
                    {
                        Carreteradañada(doc.id,carretera_destino);  //mandamos los datos para la funcion
                    
                        alert("La alerta fue añadida con exito ")
                        /* mostrara.innerHTML = "La alerta fue añadida con exito "    */
                    }
                    else if(carretera[i]!=carretera_destino || '!' + carretera[i] == carretera_destino)
                    {
                        window.alert("La carretera ingresada no existe o ya se encuentra con una alerta")
                    }
                }
            })     
        })
    }
    catch {
        alert("el origen no se encuentra en la base de datos")
    }
}

async function removeAlertaCarretera(){
    const carretera_origen = document.getElementById('damage_road_origen').value;
    const carretera_destino = document.getElementById('damage_road_destino').value;
    const concatenar = "!"+ carretera_destino;
   
    if (carretera_origen == "")//verificamos que los campos no esten vacios
    {
        window.alert("No ingreso sitio de origen")
        return;
    }
    else if (carretera_destino == "")//verificamos que los campos no esten vacios
    {
        window.alert("No ingreso sitio de Destino")
        return;
    }
    try {
    const sitios = await db.collection("SitiosTT") //buscamos en una base de datos TEST ya que Aun no esta creada la verdadera CAMBIAR
    const query = sitios.where('name', '==', carretera_origen); //Buscamos en la coleccion del nombre de origen
        query.get().then(snapshot => {
            snapshot.docs.forEach(doc => {  
                const carretera = doc.data().roads;
                if (carretera.length < 1) {
                    alert('La carretera ingresada no existe')
                    return
                }
                const validarExistentRoad = () => {
                    for (var i = 0; i < carretera.length; i++) {
                        if (carretera[i] == carretera_destino || carretera[i] != '!' + carretera_destino) {
                            return true
                        }
                    }
                    return false
                }

                if (validarExistentRoad()) {
                    alert('La carretera ingresada no existe o ya se encuentra sin una alerta')
                    return
                }
                for(var i = 0; i < carretera.length ; i++)  //recorremos la matriz de la base de datos 
                {
                    if (carretera[i] == concatenar)//verificamos que la carretera exista en la base de datos
                    {
                        RetirarCarretera(doc.id, concatenar);  //mandamos los datos para la funcion
                        retirarupdate(doc.id, carretera_destino);//le damos los datos a la funcion de atualizar
                        alert('Alerta retirada con éxito')
                    }
                }
            })     
        })
    }
    catch (error) {
        alert("el origen no se encuentra en la base de datos")
    }
}


function RetirarCarretera(id,destino) {//borramos la carretera para despues actualizarla con la alerta     
    const test1 = db.collection('SitiosTT');
    test1
    .doc(id)
        .update({
             roads: firebase.firestore.FieldValue.arrayRemove(destino)//borramos la carretera de destino 
    })
}

function retirarupdate(id,cambio) { // actualizamos la base de datos con la alerta
    const testt1 = db.collection('SitiosTT');
    testt1
        .doc(id)
        .update({
            roads: firebase.firestore.FieldValue.arrayUnion(cambio)//agregamos una carretera ya con la alerta
    })     
}


function Carreteradañada(id,destino) {//borramos la carretera para despues actualizarla con la alerta
    const alerta = "!"+ destino;
     
    const test = db.collection('SitiosTT');
    test
    .doc(id)
        .update({
             roads: firebase.firestore.FieldValue.arrayRemove(destino)//borramos la carretera de destino 
    })
    updatecarretera(id, alerta);//le damos los datos a la funcion de atualizar

}

function updatecarretera(id,cambio) { // actualizamos la base de datos con la alerta
    const test = db.collection('SitiosTT');
    test
        .doc(id)
        .update({
            roads: firebase.firestore.FieldValue.arrayUnion(cambio)//agregamos una carretera ya con la alerta
    })     
}

async function deshabilitarSitio() { 
    // verificar que el sitio exista
    // cambiar la variable bool a false en la base de datos del sitio ingresado
    const lugar = document.getElementById('site_disabled').value;

    // validar que no hayan campos vacios
    if (lugar == "") {
        alert("Hacen falta campos por completar")
        return;
    }

    // codigo
    try {
        const setDesHabiRef = await db.collection('SitiosTT').where("name","==",lugar).get();  //Cambiar 'Persona' por Sitios Turisticos *no added yet
        setDesHabiRef.forEach((item)=>{
            const elidxd=item.id;
            Ddeshabilitar(elidxd);
            window.alert("Se deshabilitó " + lugar);
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
    const lugar = document.getElementById('site_disabled').value;
    
    // validar que no hayan campos vacios
    if (lugar == "") {
        alert("Alerta! Campo Vacío")
        return;
    }

    // codigo
    try {
        const setHabiRef = await db.collection('SitiosTT').where("name","==",lugar).get();  //Cambiar 'Persona' por Sitios Turisticos *no added yet
        setHabiRef.forEach((item)=>{
            const elidxd2=item.id;
            Dhabilitar(elidxd2);
            window.alert("Se habilitó " + lugar);
        })
        
    } catch (error) {
        console.log("Error: "+error)
        return;     
    }

}

async function showStats() {
    // recoger todas las estadisticas que pide el doc de word y añadirlas al html
    const etiqueta_html = document.getElementById('estadisticas');
    const datos = await db.collection("persona").get();
    const users = [];

    datos.forEach((item) => {
        users.push(item.data());
    })
    console.log(users.length);
    const cantidad_visitantes = parseInt(users.length);
    console.log(cantidad_visitantes);

    const texto_estadisticas = "Cantidad de visitantes en Guatemala: " + cantidad_visitantes.toString();

    //Solo para comprobar almacenamiento del valor
    const visitantesRef = await db.collection('stats');
    visitantesRef
        .doc('x8zkVSG84qFQG6VQPctT')   
        .update({
            visitantes: cantidad_visitantes           
        })

    // añadir datos al html
    etiqueta_html.innerHTML = texto_estadisticas;
}
showStats();

async function Dhabilitar(id){
    const setEstadoRef = await db.collection('SitiosTT'); //Cambiar A SITIOS TURISTICOS (Aun no creados) 
    setEstadoRef
        .doc(id)
        .update({
            disponible: true
        })
}

async function Ddeshabilitar(id){
    const setEstadoRef = await db.collection('SitiosTT'); //Cambiar A SITIOS TURISTICOS (Aun no creados) 
    setEstadoRef
        .doc(id)
        .update({
            disponible: false
        })
}

async function AddCarretera(id,DestinoValue){
    const setCarreteraRef = await db.collection('SitiosTT'); //Cambiar A SITIOS
    setCarreteraRef
        .doc(id)
        .update({
            roads: firebase.firestore.FieldValue.arrayUnion(DestinoValue)
        })
        

}
