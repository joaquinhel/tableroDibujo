//Al cargarse la página, llamamos a la función inicializar(sin paréntesis)
window.onload = inicializar;

/*Función para inicializar la página, las variables y eventos que actuan sobre ella.
 * Dentro de ellas creamos variables globales, es decir, sin "var" */
function inicializar() {
    // Creamos la tabla usando la función declarada más abajo
    crearTabla(30, 30, "tablaceldas", "tablerodibujo", "1em inset");

    /*Creamoas un array llamado colores que contendrá los colores disponibles.
     Dentro de la div "paleta", accedemos a la primera "tr" y dentro de esta a todas sus "td". Estos
     objetos del DOM los ponemos a la escucha de eventos.*/
    var colores = document.getElementById("paleta").getElementsByTagName("tr")[0].getElementsByTagName("td");

    // Comprobamos usando la primera columna de los colores los tipos de sistemas 
    // que se pueden usar para enlazar elementos y los almacenamos en una variables 
    // globales para poder usar en la función crearEvento
    if (colores[0].addEventListener) {
        soportaEventListener = true;
    } else {
        soportaEventListener = false;
    }

    if (colores[0].attachEvent) {
        soportaAttachEvent = true;
    } else {
        soportaAttachEvent = false;
    }

    //Al hacer click(evento), sobre el td colores (elemento oyente), llamamos a la función seleccionarColor
    for (i = 0; i < colores.length; i++) {
        crearEvento(colores[i], "click", seleccionarColor);
    }

    colorSel = "color1"; //Variable global que almacena el color seleccionado, color1 al iniciar la aplicación.
    pincelActivo = false; //Variable global que define el estado del pincel.

    /*Modificamos el "div pincel" que almacena el texto que indica al usuario el estado del pincel.
     Al iniciar la aplicación está desactivado*/
    document.getElementById("pincel").innerHTML = "PINCEL DESACTIVADO";

    // Recuperamos todas las celdas que hay en la tabla. 
    celdas = document.getElementById("tablaceldas").getElementsByTagName("td");
//alert(celdas);
    // Recorremos todas las celdas para asignarles los eventos necesarios
    for (i = 0; i < celdas.length; i++) {
        /* Asignamos a todas las celdas la función activarPincel en el 
             evento click, para poder activar el pincel y pintar sobre ellas*/
        crearEvento(celdas[i], "mousedown", activarPincel);
        /*Asignamos la función pintar en el evento mouse para pintar las celdas 
         del color seleccionado al pasar el ratón sobre ellas*/
        crearEvento(celdas[i], "mouseover", pintar);
    }

    // Asignamos la función reiniciar(limpiar tabla) al botón en el evento click
    crearEvento(document.getElementById("reiniciar"), "click", reiniciar);
}

/* Función que nos permite crear una tabla sobre la que dibujar:
 Definimos las celdas de alto y de ancho que tendrá la tabla, así como algunos atributos
 de la misma.*/
function crearTabla(celdasAncho, celdasAlto, id, clase, borde) {
    var tabla = document.createElement("table"); //Creamos el elemento "table"
    //Añadimos atributos a la tabla que pasaremos por parámetro, su "id" la "class" y el "border"
    tabla.setAttribute("id", id);
    tabla.setAttribute("class", clase);
    tabla.setAttribute("border", borde);

    for (var i = 0; i < celdasAlto; i++) {
        var fila = document.createElement("tr"); //Por cada ciclo del bucle creamos un objeto fila
        for (var j = 0; j < celdasAncho; j++) {
            var columna = document.createElement("td");// Por cada ciclo del bucle creamos una columna 
            fila.appendChild(columna);// Añadimos la columa generada a la fila
        }
        tabla.appendChild(fila);// Cuando la fila tenga todas las columnas necesarias la añadimos a la tabla
    }

    //Guardamos en una variable "tipo objeto" la div donde queremos guardar la tabla
    var divSelecionado = document.getElementById("zonadibujo");
    // Añadimos una leyenda al div antes de incluir la tabla generada
    divSelecionado.appendChild(document.createTextNode("Haga CLICK en cualquier celda para activar/desactivar el Pincel"));
    // Metemos la tabla en el objeto que contiene el div
    divSelecionado.appendChild(tabla);
}

/* Función para la gestión de eventos. 
 * Le pasamos como parámentro el elemento al que asociaremos  el evento, el tipo de evento 
 * que escuchará el elemento y la función que se ejecutará cuando* el elemento reciba el evento */
function  crearEvento(elemento, tipoEvento, funcion) {
    // Si al elemento se le puede añadir un Eventlistener es compatible con los standards W3C
    if (soportaEventListener) {
        elemento.addEventListener(tipoEvento, funcion, false); // Asignamos el evento
        // Sino se cumple este primer if, comprobamos si es compatible con internet explorer
    } else if (soportaAttachEvent) {
        /* Al usar attachEvent perdemos la capacidad de acceder al objeto this dentro de la función 
         * que asignamos al evento. Por ello usamos el método call() con el elemento 
         * como parámetro y asignarlo al objeto this de la función*/
        elemento.attachEvent("on" + tipoEvento, function () {
            funcion.call(elemento);
        });
    }
}

/*Función para seleccionar los distintos colores de la paleta,
 la he probado con todos los navegadores y ClassName Funciona de forma adecuada*/
function seleccionarColor() {
    // El color seleccionado es el elemento que tenga de nombre de la clase "seleccionado".
    var colorSeleccionado = document.getElementsByClassName("seleccionado")[0];
    // Modicamos el valor de la clase del elemento y quitamos el texto seleccionado.
    colorSeleccionado.className = colorSeleccionado.className.replace(/\bseleccionado\b/, "");
    // Almacenamos el valor del color seleccionado en la variable global definida para ello
    colorSel = this.className;
    //Incluimos seleccionado en el nombre de la clase del elemento en el que se ha lanzado el evento
    this.className = this.className + " seleccionado";
}

//Función para activar el uso del pincel
function activarPincel() {
    // En la variable texto guardamos el texto de la Div pincel
    var texto = document.getElementById("pincel");

    if (!pincelActivo) { //Si el pincel no está activo lo activamos
        pincelActivo = true;
        texto.innerHTML = "PINCEL ACTIVADO"; //Cambimos el texto avisando del nuevo estado del pincel

        // Asignamos al objeto que ha lanzado el evento la clase del 
        // color seleccionado actualmente, sobreescribiendo cualquier otra que 
        // pudiese poseer anteriormente
        this.className = colorSel;
    } else {
        // Si está activado, lo desactivamos
        pincelActivo = false;

        // Y cambiamos el texto de aviso al usuario en consonancia al nuevo estado
        texto.innerHTML = "PINCEL DESACTIVADO";
    }
}

//Función para pintar las celdasPaleta al pasar el ratón sobre ellas
function pintar() {
    if (pincelActivo) {  // Si el pincel está activo
        /* Asignamos al objeto que ha lanzado el evento la clase del color seleccionado
         actualmente, sobreescribiendo la que hubiera anteriormente*/
        this.className = colorSel;
    }
}

//Función para limpiar el lienzo de dibujo y volver a seleccionar el color inicial.
function reiniciar() {
    // Recuperamos las celdas que hay en la tabla de colorear
    celdas = document.getElementById("tablaceldas").getElementsByTagName("td");

    // Recorremos todas las celdas 
    for (i = 0; i < celdas.length; i++) {
        // Limpiamos las clases que puedan tener usando la propiedad className
        celdas[i].className = "";
    }

    // Recuperamos las celdas que contienen los colores para pintar
    colores = document.getElementById("paleta").getElementsByTagName("tr")[0].getElementsByTagName("td");
    //Recorremos las celdas
    for (i = 0; i < colores.length; i++) {
        // Eliminamos la clase "seleccionado" si estuviese en alguna de las celdas
        colores[i].className = colores[i].className.replace(/\bseleccionado\b/, "");
    }
    // Asignamos la clase seleccionado al primer color
    colores[0].className += " seleccionado";

    colorSel = "color1";  // Seleccionamos el primer color
    pincelActivo = false; // Deshabilitamos el pincel
    document.getElementById("pincel").innerHTML = "PINCEL DESACTIVADO"; // Modificamos el texto de ayuda al usuario
}