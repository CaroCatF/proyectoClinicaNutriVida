// Renderizado de la vista detalle de servicio (producto-detalle.html).
// Requiere catalogo.js, almacenamiento.js y carrito.js.

document.addEventListener("DOMContentLoaded", function () {
  const contenedor = document.getElementById("detalle-servicio");
  if (!contenedor) return;

  const parametros = new URLSearchParams(window.location.search);
  const codigo = parametros.get("codigo");
  const servicio = buscarProductoPorCodigo(codigo);

  if (!servicio) {
    contenedor.innerHTML =
      '<div class="mensaje-detalle-error">No encontramos ese servicio. ' +
      '<a href="productos.html">Vuelve al listado completo</a>.</div>';
    return;
  }

  document.title = servicio.nombre + " · NutriVida";

  contenedor.innerHTML =
    '<span class="franja-tipo">' + escaparHTML(servicio.tipo) + "</span>" +
    '<img class="imagen-servicio imagen-detalle" src="' + escaparHTML(servicio.imagen && !servicio.imagen.includes("assets/") ? servicio.imagen : "imagenes/servicio-placeholder.svg") + '" alt="Ilustración del servicio ' + escaparHTML(servicio.nombre) + '">' +
    "<h1 class='titulo-detalle-servicio'>" + escaparHTML(servicio.nombre) + "</h1>" +
    '<p class="meta-detalle-servicio">' + escaparHTML(servicio.duracion) + " · " + escaparHTML(servicio.modalidad) + " · Atiende: " + escaparHTML(servicio.profesional) + "</p>" +
    "<p>" + escaparHTML(servicio.descripcion) + "</p>" +
    '<p class="precio-detalle-servicio">' + formatearPrecioCLP(Number(servicio.precio) || 0) + "</p>" +
    '<div class="acciones-detalle-servicio">' +
      '<button type="button" data-agregar-carrito="' + escaparHTML(servicio.codigo) + '" class="btn btn-nv-primario boton-detalle">Añadir al carrito</button>' +
      '<a href="agendar.html?codigo=' + encodeURIComponent(servicio.codigo) + '" class="btn btn-nv-secundario boton-detalle">Agendar esta hora</a>' +
      '<a href="productos.html" class="btn btn-nv-secundario boton-detalle">Ver otros servicios</a>' +
    "</div>" +
    '<div id="mensaje-carrito" role="status" aria-live="polite" class="mensaje-carrito-detalle"></div>';
});
