//
//*agregar la interacción con el usuario con la página 
//y enlazar la base de datos
//recuperado de https://firebase.google.com/docs/firestore/query-data/queries?hl=es-419#web-version-8_2

var visitar; //desde el html
var estado = false;


void Verificar()
{ 
    var LugaresTuristicos = db.collection("Sitios");
    var query = LugaresTuristicos.where("name", "==", visitar);
    if(query)
    {
        estado = true;
    }
}

void AgregarSitio()
{
    if(estado == true)
    {
        //Se agrega a la base de datos el valor que está contenido en la variable sitio
        /*
        .get() para obtener los datos recolectados
                .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        // doc.data() is never undefined for query doc snapshots
                        console.log(doc.id, " => ", doc.data());
                    });
                })
                .catch((error) => {
                    console.log("Error getting documents: ", error);
                });
        */
    }
    else
    {
        console.log("El sitio turístico seleccionado no existe");
    }
}

void EliminarSitio()
{
    if(estado == true)
    {
        //Se elimina de la base de datos del usuario el contenido de la variable
    }
    else
    {
        console.log("Seleccione otro sitio turístico");
    }
    //acualización
}