function agregarSitio() {
    
    var name_place = document.getElementById('place_name').value;

    // validar que no hayan campos vacios
    if (name_place == "") {
        window.alert("Debe ingresar un sitio")
        return;
    }

    async function Leer()
    {
        var users = []
        const currentuser = await db.collection("current_user").get();
    
        currentuser.forEach((item) =>{
            users.push(item.data());
        })
        var valor = users[0];
        console.log(valor["name"])
    
        var NewUserRef = await db.collection('persona').where("name", "==", valor["name"])
        NewUserRef
        .onSnapshot(snapshot=>{
            snapshot.forEach( (snaphijo)=>{
            agregarSite(snaphijo.id);
            })
        })
    }
    Leer()
}

function eliminarSitio() {
    var name_place = document.getElementById('place_name').value;

    // validar que no hayan campos vacios

    if (name_place == "") {
        window.alert("Debe ingresar un sitio")
        return;
    }

    async function Leer()
    {
        var users = []
        const currentuser = await db.collection("current_user").get();
    
        currentuser.forEach((item) =>{
            users.push(item.data());
        })
        var valor = users[0];
        console.log(valor["name"])
    
        var NewUserRef = await db.collection('persona').where("name", "==", valor["name"])
        NewUserRef
        .onSnapshot(snapshot=>{
            snapshot.forEach( (snaphijo)=>{
            borrarSite(snaphijo.id);
            })
        })
    }
    Leer()
}

async function borrarSite(id)
{
    var name_place = document.getElementById('place_name').value;
    
    var places = []

    //colección de sitios en admin (aún no existe), mientras tanto se utiliza la provisional de SitiosTT (test)
    const datos = await db.collection("SitiosTT").where("name", "==", name_place).get();

    //Obteniendo todos los datos de la colección
    datos.forEach((item) => {
        places.push(item.data());
    })

    //Comprobar que el elemento exista
    for(var i = 0; i < places.length; i++)
    {
        var site = places[i];
        if(site["name"] == name_place)
        {

            const personaRef = db.collection('persona');
            personaRef
            .doc(id)
            .update({
                places : firebase.firestore.FieldValue.arrayRemove(name_place)
            }).then(() => {
                location.reload();
            })
        }
        else
        {
            error_btn.innerHTML = "No existe este sitio";
        }
    }
}

async function agregarSite(id)
{
    var name_place = document.getElementById('place_name').value;
    var places = []

    const datos = await db.collection("SitiosTT").where("name", "==", name_place).get();

    //Obteniendo todos los datos de la colección
    datos.forEach((item) => {
        places.push(item.data());
    })
    if(places.length<1)
    {
        window.alert("El lugar que desea agregar no existe en la base de datos");
        
    }

    //Comprobar que el elemento exista
    for(var i = 0; i < places.length; i++)
    {
        var site = places[i];
        if(site["name"] == name_place)
        {

            const personaRef = db.collection('persona');
            personaRef
            .doc(id)
            .update({
                places : firebase.firestore.FieldValue.arrayUnion(name_place)
            }).then(() => {
                location.reload();
            })

        }
    }
}


async function mostrarSitios(){
    var etiqueta_html = document.getElementById('mis_sitios_text');
    var texto_vector = "No tiene sitios";
    var sit =[];
    var j = 0
    
    // codigo
   //recorremos la columna de current
    var currref = db.collection('current_user').onSnapshot(query =>{
        query.forEach(doc => {
            console.log(doc.data()) //sacamos los datos de la columna
            //recorremos la columna de persona 
            var personaref = db.collection('persona')
            .onSnapshot(quer =>{
                quer.forEach(docp =>{
                    console.log(docp.data())
                   sit =  docp.data().places;
                    //buscamos el nombre del current en el de persona
                    if (doc.data().name === docp.data().name) {
                        if (docp.data().places == "") {//verificamos si tiene sitios agregados
                            etiqueta_html.innerHTML = "No tiene sitios";    
                            return;              
                        }
                        else
                        {
                  
                          for(var i = 0; i < sit.length ; i++)  //recorremos la matriz de la base de datos 
                            {
                      //mostramos los sitios               
                          etiqueta_html.innerHTML += sit[i]+ " , "  ;
                          i++;
                            }
                                    
                       }
                }
                   
                })
            });
        })
    }); 
}


mostrarSitios();