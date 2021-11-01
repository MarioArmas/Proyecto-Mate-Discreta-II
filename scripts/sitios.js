//recuperado de https://firebase.google.com/docs/firestore/query-data/queries?hl=es-419#web-version-8_2

const db = firebase.firestore();

var id = 'XOdGSQLC3oZ5jMZHpqzs';
var estado = false;
var setplace = document.getElementById('place_name').value
var error = document.getElementById('error_message_agregarsitio_user');

function agregarSitio()
{
    if(setplace == "")
    {
        error.innerHTML = "Debe agregar el nombre de un sitio";
        return;
    }

    //Para comprobar los datos dentro de la base de datos

    async function Leer()
    {
        var places = []
        var users = []
        //colección de sitios en admin (aún no existe)
        const datos = await db.collection("sitios").where("place", "==", setplace).get();

        var name = db.collection("current_user").where("name").get();
        const user = await db.collection("persona").where("name", "==", name).get();
        
        datos.forEach((doc) => {
            places.push(doc.data());
        })
        user.forEach((doc)=> {
            users.push(doc.data());
        })

        for(var i = 0; i < places.length; i++)
        {
            var query = places[i];
            if(query["place"] == setplace)
            {
                for(var j = 0; j <users.length; j++)
                {
                    var nombre = users[i];
                    if(nombre["name"] == name)
                    {
                        function setPlace(setplace){
                            const PlaceRef=db.collection('persona');
                            PlaceRef
                                .doc(id)
                                .update({
                                    place: setplace           
                                })
                        }
                        setPlace()
                    }
                }
            }
            else
            {
                error.innerHTML = "No existe este sitio";
            }
        }
    }

    Leer()
}

//Obtiene los datos de los lugares en la base de datos
function eliminarSitio(id)
{
    db.collection("persona").doc(id).then(function(){
        console.log("Document deleted!");
    }).catch(function(error){
        console.error("error", error);
    })
}
