console.table(productos);
let carrito = [];
let contenedor = document.getElementById("misprods");

function renderizarProductos() {
    for (const producto of productos) {
        contenedor.innerHTML += `
            <div class="card col-sm-2">
                <img src=${producto.foto} class="card-img-top" alt="...">
                <div class="card-body">
                    <h5 class="card-title">${producto.id}</h5>
                    <p class="card-text">${producto.nombre}</p>
                    <p class="card-text">US$ ${producto.precio}</p>
                    <button id='btn${producto.id}' class="btn btn-primary align-bottom">Comprar</button>
                </div>
            </div>   
        `;
    }

    productos.forEach((producto) => {
        document.getElementById(`btn${producto.id}`).addEventListener('click', () => {
            agregarAlCarrito(producto);
        });
    });
}
renderizarProductos();
obtenerDolar();

function agregarAlCarrito(prodAAgregar) {
    carrito.push(prodAAgregar);
    console.table(carrito);
    const mensaje = `Agregaste ${prodAAgregar.nombre} al carrito !`;
    // Mostrar mensaje emergente
    const mensajeDiv = document.createElement("div");
    mensajeDiv.classList.add("mensaje-emergente");
    const mensajeTexto = document.createElement("p");
    mensajeTexto.textContent = mensaje;
    const botonOK = document.createElement("button");
    botonOK.textContent = "OK";
    botonOK.addEventListener("click", function () {
        mensajeDiv.style.display = "none";
    });
    mensajeDiv.appendChild(mensajeTexto);
    mensajeDiv.appendChild(botonOK);
    document.body.appendChild(mensajeDiv);

    //agregar fila a la tabla de carrito
    document.getElementById('tablabody').innerHTML += `
        <tr>
            <td>${prodAAgregar.id}</td>
            <td>${prodAAgregar.nombre}</td>
            <td>${prodAAgregar.precio}</td>
        </tr>
    `;
    //incrementar el total
    let totalCarrito = carrito.reduce((acumulador, producto) => acumulador + producto.precio, 0);
    document.getElementById('total').innerText = 'Total a pagar US$: ' + totalCarrito + '   Total a pagar $' +totalCarrito * dolarventa;

    // Guardar el carrito en el LocalStorage
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

const btnCompra = document.getElementById("btn-compra");
btnCompra.addEventListener("click", function () {
    // Elimina el contenido del carrito
    carrito = [];
    document.getElementById("tablabody").innerHTML = "";
    document.getElementById("total").innerHTML = "Total a pagar US$: 0";

    // Elimina el carrito del LocalStorage
    localStorage.removeItem("carrito");

    // Mostrar mensaje de confirmación de compra
    const mensajeDiv = document.createElement("div");
    mensajeDiv.classList.add("mensaje-emergente");
    const mensajeTexto = document.createElement("p");
    mensajeTexto.textContent = "Gracias por su compra!";
    const botonOK = document.createElement("button");
    botonOK.textContent = "OK";
    botonOK.addEventListener("click", function () {
        mensajeDiv.style.display = "none";
    });
    mensajeDiv.appendChild(mensajeTexto);
    mensajeDiv.appendChild(botonOK);
    document.body.appendChild(mensajeDiv);
});


//Metodo para filtrar precios por debajo de 100000
let productosFiltrados = productos.filter(producto => producto.precio < 100000);
console.table(productosFiltrados);

// Agregar evento de escucha al botón de búsqueda
const botonBuscar = document.getElementById("buscar");

botonBuscar.addEventListener("click", function () {
    let terminoBusqueda = document.getElementById("busqueda").value.trim();
    let resultados = [];

    // Metodo para realizar una busqueda
    for (let i = 0; i < productos.length; i++) {
        if (productos[i].nombre.toLowerCase().includes(terminoBusqueda.toLowerCase())) {
            resultados.push(productos[i]);
        }
    }

    // Mostrar los resultados en la página
    const resultadosDiv = document.createElement("div");
    resultadosDiv.classList.add("row");

    if (resultados.length > 0) {
        for (let i = 0; i < resultados.length; i++) {
            const producto = resultados[i];

            const productoDiv = document.createElement("div");
            productoDiv.classList.add("col-md-4");

            const nombre = document.createElement("h3");
            nombre.textContent = producto.nombre;

            const descripcion = document.createElement("p");
            descripcion.textContent = producto.descripcion;

            const precio = document.createElement("h4");
            precio.textContent = `$${producto.precio}`;

            const botonAgregar = document.createElement("button");
            botonAgregar.textContent = "Agregar al carrito";
            botonAgregar.addEventListener("click", function () {
                agregarAlCarrito(producto);
            });

            productoDiv.appendChild(nombre);
            productoDiv.appendChild(descripcion);
            productoDiv.appendChild(precio);
            productoDiv.appendChild(botonAgregar);
            resultadosDiv.appendChild(productoDiv);
        }

        // Remover cualquier resultado anterior
        const misProds = document.getElementById("misprods");
        while (misProds.firstChild) {
            misProds.removeChild(misProds.firstChild);
        }

        misProds.appendChild(resultadosDiv);
    } else {
        // Remover cualquier resultado anterior
        const misProds = document.getElementById("misprods");
        while (misProds.firstChild) {
            misProds.removeChild(misProds.firstChild);
        }

        // Mostrar un mensaje de "no se encontraron resultados"
        const mensaje = document.createElement("p");
        mensaje.textContent = `No se encontraron resultados para la búsqueda: ${terminoBusqueda}`;
        resultadosDiv.appendChild(mensaje);
        misProds.appendChild(resultadosDiv);
    }
});

//API para mostrar dolar
function obtenerDolar() {
    const URLDOLAR = "https://api.bluelytics.com.ar/v2/latest";
    fetch(URLDOLAR)
        .then((respuesta) => respuesta.json())
        .then((datos) => {
            const dolarBlue = datos.blue;
            const mensaje = document.createElement("p");
            mensaje.textContent = `Cotización del dólar: $${dolarBlue.value_sell}`;
            document.getElementById("mensajeDolar").appendChild(mensaje);
            dolarventa = dolarBlue.value_sell;
        })
        .catch((error) => {
            console.error("Error al obtener la cotización del dólar:", error);
        });
}