
// Renderizado de la vista Detalle de servicio (producto-detalle.html)
// Lee el parametro ?codigo= de la URL y busca en catalogoServicios.


document.addEventListener("DOMContentLoaded", function () {
  const contenedor = document.getElementById("detalle-servicio");
  if (!contenedor) return;

  const parametros = new URLSearchParams(window.location.search);
  const codigo = parametros.get("codigo");
  const servicio = catalogoServicios.find(function (item) {
    return item.codigo === codigo;
  });

  if (!servicio) {
    contenedor.innerHTML =
      '<div class="alert alert-warning">No encontramos ese servicio. ' +
      '<a href="productos.html">Vuelve al listado completo</a>.</div>';
    return;
  }

  document.title = servicio.nombre + " · NutriVida";

  contenedor.innerHTML =
    '<span class="franja-tipo">' + servicio.tipo + "</span>" +
    "<h1 class='mt-3'>" + servicio.nombre + "</h1>" +
    '<p class="meta-servicio fs-6 mb-3">' + servicio.duracion + " · " + servicio.modalidad + " · Atiende: " + servicio.profesional + "</p>" +
    "<p>" + servicio.descripcion + "</p>" +
    '<p class="precio-servicio fs-3">' + formatearPrecioCLP(servicio.precio) + "</p>" +
    '<div class="d-flex gap-2 flex-wrap">' +
      '<a href="agendar.html?codigo=' + servicio.codigo + '" class="btn btn-nv-primario">Agendar esta hora</a>' +
      '<a href="productos.html" class="btn btn-nv-secundario">Ver otros servicios</a>' +
    "</div>";
});
