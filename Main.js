// Funcion para pintar los productos
async function pintarProductos() {
    try {
        const response = await fetch(`/productos.json`);
        const productos = await response.json();
        // Capturar elementos del DOM
        const menuMeat = document.getElementById("menuMeat");
        const menuFish = document.getElementById("menuFish");
        const menuVegan = document.getElementById("menuVegan");
        // Funcion para crear las card
        productos.forEach((producto) => {
            const productoDiv = document.createElement("div");
            productoDiv.classList.add("producto");
            productoDiv.innerHTML = `
                    <div class="card text-center text-white" style="width: 18rem;">
                        <div class="id">${producto.id}</div>
                        <img src="../img/${producto.imagen}" class="card-img-top" alt="Food example">
                        <div class="card-body">
                          <h4 class="card-title">${producto.plato}</h4>
                          <p class="card-text">${producto.descripcion}</p>
                          <h4 class="font-weight-bold text-underline">$${producto.precio}</h4>
                          <button class="btn text-white" id="añadirPedido" type="submit">Add to Order</button>
                        </div>
                    </div>`;
            // Separar los productos por tipo de plato
            if (producto.tipo === "meat") {
                menuMeat.appendChild(productoDiv);
            } else if (producto.tipo === "fish") {
                menuFish.appendChild(productoDiv);
            } else if (producto.tipo === "vegan") {
                menuVegan.appendChild(productoDiv)
            };
        });
    } catch (error) {
        console.error("Error al cargar los productos:", error);
    }
} document.addEventListener("DOMContentLoaded", () => {
    pintarProductos();
});

// Funcionalidad Pedido a realizar.
let pedido = [];

// Capturar eventos de los botones "Añadir al pedido"
document.addEventListener("click", function (e) {
    if (e.target && e.target.id === "añadirPedido") {
        let card = e.target.closest(".card");
        let productoId = card.querySelector(".id").textContent;
        let productoNombre = card.querySelector(".card-title").textContent;
        let productoPrecio = parseFloat(card.querySelector(".font-weight-bold").textContent.replace("$", "").replace(/\./g, ""));;

        let producto = { id: productoId, nombre: productoNombre, precio: productoPrecio };
        pedido.push(producto);

        actualizarPedido();
    }
});

// Función para actualizar la sección del pedido
function actualizarPedido() {
    let listaPedido = document.getElementById("listaPedido");
    let totalPedido = document.getElementById("totalPedido");

    listaPedido.innerHTML = "";
    let total = 0;

    pedido.forEach((producto, index) => {
        total += producto.precio;
        let items = document.createElement("li");
        items.innerHTML = `${producto.nombre} - $${producto.precio} 
            <button class="btn btn-danger btn-sm" onclick="eliminarDelPedido(${index})">X</button>`;
        listaPedido.appendChild(items);
        Toastify({
            text: "Added to order",
            duration: 1000,
            backgroundColor: `#AD4000`,
        }).showToast();
    });

    totalPedido.textContent = `${total.toFixed(2)}`;
}

// Función para eliminar un producto del pedido
function eliminarDelPedido(index) {
    pedido.splice(index, 1);
    actualizarPedido();
}

// Funcion para enviar pedido
document.getElementById("enviarPedido").addEventListener("click", function () {
    if (pedido.length === 0) {
        Swal.fire({
            title: "Ups!",
            text: "The order is empty. Add the dishes you want before submitting the order.",
            icon: "error",
            customClass: {
                popup: 'my-swal-background'
            }
        })
    } else {
        Swal.fire({
            title: "Ready!",
            text: "The order was placed successfully.",
            icon: "success",
            customClass: {
                popup: 'my-swal-background'
            }
        })
        // Vaciar pedido después del pedido
        pedido = [];
        actualizarPedido();
    }
});

// Funcion para realizar las reservas
// Capturar elementos del DOM
console.log("ejecutando")
document.getElementById("formRes").addEventListener("submit", function (e) {
    e.preventDefault();

    const nombreReserva = document.getElementById("nombreRes").value;
    const comensalesReserva = document.getElementById("comensalesRes").value;
    const horarioReserva = document.getElementById("horarioRes").value;
    const telefonoReserva = document.getElementById("telefonoRes").value;

    const datosForm = {
        nombre: nombreReserva,
        comensales:comensalesReserva,
        horario: horarioReserva,
        telefono: telefonoReserva
    }; 
    // Fetch para el envio de los datos 
    fetch("https://coderhouse.com/api/enviar", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(datosForm)
    })
    .then(response => response.json())
    .then(data => {
        console.log("Respuesta del servidor:", data);
        Swal.fire({
            title: "Reservation made successfull!",
            text: `We are waiting for you at ${horarioReserva}`,
            icon: "success",
            customClass: {
                popup: 'my-swal-background'
            }
        })
    })
    .catch(error => {
        console.error("Error al enviar:", error);

        Swal.fire({
            title: "Error!",
            text: "There was a problem submitting your reservation. Please try again later.",
            icon: "error",
            confirmButtonText: "OK",
            customClass: {
                popup: 'my-swal-background'
            }
        });
});
})