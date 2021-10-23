//
//*agregar la interacción con el usuario con la página
//

//
//writeFile reemplaza el archivo ingresado por el usuario si el archivo existe
//Si el archivo no existe, se crea uno con el contenido que el usuario establezca (borrar, fuera de la funcionalidad)
//https://www.w3schools.com/nodejs/nodejs_filesystem.asp
//**Terminar de arreglar
//


var lugares = [];
var estado = false;
var fs = require('fs');
void Verificar()
{ 
    const { estado } = require("./Sitios");

    var filePath = 'file.json';
    fs.access(filePath, fs.constants.F_OK, accessCallback);
    function accessCallback(error) {
        if (error) {
            console.log(`${filePath} does not exist`);
        } else {
            console.log(`${filePath} exist`);
            estado = true;
        }
    }
}
    

void AgregarSitio()
{
    var posicion = 0;
    fs.writeFile('file.json',JSON.stringify(data),function(err)
    {
        if(err) throw err;
        console.log('completado');
    });
    Verificar();

    //Interacción con el usuario
    if(estado == true)
    {
        while(lugares[posicion]==null)
        {
            posición++;
        }
        lugares[posicion] = data;
    }
}
 
void EliminarSitio()
{
    fs.unlink('file.json', function(err)
    {
        if(err) throw err;
        console.log('File deleted');
    });
}