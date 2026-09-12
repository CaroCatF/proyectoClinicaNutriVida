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
      '<div class="alert alert-warning">No encontramos ese servicio. ' +
      '<a href="productos.html">Vuelve al listado completo</a>.</div>';
    return;
  }

  document.title = servicio.nombre + " · NutriVida";

  contenedor.innerHTML =
    '<span class="franja-tipo">' + escaparHTML(servicio.tipo) + "</span>" +
    '<img class="imagen-servicio imagen-detalle" src="' + escaparHTML(servicio.imagen || "assets/servicio-placeholder.svg") + '" alt="Ilustración del servicio ' + escaparHTML(servicio.nombre) + '">' +
    "<h1 class='mt-3'>" + escaparHTML(servicio.nombre) + "</h1>" +
    '<p class="meta-servicio fs-6 mb-3">' + escaparHTML(servicio.duracion) + " · " + escaparHTML(servicio.modalidad) + " · Atiende: " + escaparHTML(servicio.profesional) + "</p>" +
    "<p>" + escaparHTML(servicio.descripcion) + "</p>" +
    '<p class="precio-servicio fs-3">' + formatearPrecioCLP(Number(servicio.precio) || 0) + "</p>" +
    '<div class="d-flex gap-2 flex-wrap">' +
      '<button type="button" data-agregar-carrito="' + escaparHTML(servicio.codigo) + '" class="btn btn-nv-primario">Añadir al carrito</button>' +
      '<a href="agendar.html?codigo=' + encodeURIComponent(servicio.codigo) + '" class="btn btn-nv-secundario">Agendar esta hora</a>' +
      '<a href="productos.html" class="btn btn-nv-secundario">Ver otros servicios</a>' +
    "</div>" +
    '<div id="mensaje-carrito" role="status" aria-live="polite" class="mt-3"></div>';
});
