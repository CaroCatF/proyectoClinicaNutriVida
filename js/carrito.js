/* Carrito de servicios y planes de NutriVida. */

function mostrarAvisoCarrito(mensaje, tipo) {
  const aviso = document.getElementById("mensaje-carrito");
  if (!aviso) return;
  aviso.textContent = mensaje;
  aviso.className = "alert alert-" + (tipo || "success") + " mensaje-resultado-formulario";
  window.setTimeout(function () {
    aviso.textContent = "";
    aviso.className = "";
  }, 2800);
}

function agregarCodigoAlCarrito(codigo) {
  const producto = buscarProductoPorCodigo(codigo);
  if (!producto) return false;
  agregarAlCarrito(producto);
  mostrarAvisoCarrito("Servicio agregado al carrito.", "success");
  return true;
}

function construirItemCarrito(item) {
  const fila = document.createElement("article");
  fila.className = "item-carrito";

  const informacion = document.createElement("div");
  informacion.className = "item-carrito-info";

  const titulo = document.createElement("h2");
  titulo.className = "h5 mb-1";
  titulo.textContent = item.nombre;

  const codigo = document.createElement("p");
  codigo.className = "texto-ayuda mb-0";
  codigo.textContent = "Código: " + item.codigo;
  informacion.append(titulo, codigo);

  const controles = document.createElement("div");
  controles.className = "item-carrito-controles";

  const cantidad = document.createElement("input");
  cantidad.type = "number";
  cantidad.min = "1";
  cantidad.max = "99";
  cantidad.value = item.cantidad;
  cantidad.className = "form-control cantidad-carrito";
  cantidad.setAttribute("aria-label", "Cantidad de " + item.nombre);
  cantidad.addEventListener("change", function () {
    actualizarCantidadCarrito(item.codigo, cantidad.value);
    renderizarCarrito();
  });

  const precio = document.createElement("strong");
  precio.className = "precio-carrito";
  precio.textContent = formatearPrecioCLP(item.precio * item.cantidad);

  const eliminar = document.createElement("button");
  eliminar.type = "button";
  eliminar.className = "btn btn-sm btn-outline-danger";
  eliminar.textContent = "Eliminar";
  eliminar.addEventListener("click", function () {
    eliminarDelCarrito(item.codigo);
    renderizarCarrito();
    mostrarAvisoCarrito("Servicio eliminado del carrito.", "warning");
  });

  controles.append(cantidad, precio, eliminar);
  fila.append(informacion, controles);
  return fila;
}

function renderizarCarrito() {
  const contenedor = document.getElementById("lista-carrito");
  const resumen = document.getElementById("resumen-carrito");
  const vacio = document.getElementById("carrito-vacio");
  if (!contenedor || !resumen || !vacio) return;

  const carrito = obtenerCarrito();
  contenedor.replaceChildren();
  vacio.classList.toggle("d-none", carrito.length > 0);
  resumen.classList.toggle("d-none", carrito.length === 0);

  carrito.forEach(function (item) {
    contenedor.appendChild(construirItemCarrito(item));
  });

  document.getElementById("total-carrito").textContent = formatearPrecioCLP(totalCarrito());
  document.getElementById("cantidad-resumen-carrito").textContent = cantidadTotalCarrito();
  actualizarContadorCarrito();
}

document.addEventListener("DOMContentLoaded", function () {
  const contenedor = document.getElementById("lista-carrito");
  if (contenedor) {
    renderizarCarrito();

    const botonVaciar = document.getElementById("vaciar-carrito");
    if (botonVaciar) {
      botonVaciar.addEventListener("click", function () {
        vaciarCarrito();
        renderizarCarrito();
        mostrarAvisoCarrito("El carrito está vacío.", "info");
      });
    }
  }

  document.addEventListener("click", function (evento) {
    const boton = evento.target.closest("[data-agregar-carrito]");
    if (!boton) return;

    const agregado = agregarCodigoAlCarrito(boton.dataset.agregarCarrito);
    if (!agregado) return;

    const textoOriginal = boton.textContent;
    boton.textContent = "Agregado";
    boton.disabled = true;
    window.setTimeout(function () {
      boton.textContent = textoOriginal;
      boton.disabled = false;
    }, 1200);
  });
});
