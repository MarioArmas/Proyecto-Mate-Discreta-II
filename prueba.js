//Obtener Ruta más corta, le envío los puntos example (Guatemala, Jutiapa) y revisa en la tabla su camino 
var arreglo=["Escuintla","Chiquimula","Jutiapa","Guatemala","Jalapa"];
              // 0           1           2        3             4
var arreglo_pasos=[];
void Ruta_Corta(arreglo,point1,point2);{
    var auxiliar1= arreglo.length;
    var arreglo_aux=[auxiliar1][auxiliar1];   //
    var aux1,aux2;
    for(var i=0; i<arreglo.length;i++){
        for(var j=0; arreglo.length;j++){    //Digamos que quiero el 1 al 3
            arreglo_aux[point1][point2]=aux1;
            if(arreglo_aux[aux1][point2]==arreglo_aux[point2][point2]){ //o igual a cero por la diagonal de ceros                
               // return point2;
               arreglo_pasos[i]=point2;
            }
            else{             
                arreglo_aux[aux1][point2]=aux2;
                arreglo_pasos[i]=aux2;
                Ruta_Corta(arreglo,aux1,aux2);               
                
            }

        }
    }



}