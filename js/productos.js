// Renderizado dinamico del listado de servicios (productos.html)
// Requiere que catalogo.js este cargado antes.

document.addEventListener("DOMContentLoaded", function () {
  const contenedor = document.getElementById("grilla-servicios");
  const filtros = document.querySelectorAll(".filtro-categoria");
  if (!contenedor) return;

  function crearTarjeta(servicio) {
    return (
      '<li class="col-sm-6 col-lg-4">' +
        '<article class="tarjeta-servicio">' +
          '<span class="franja-tipo">' + servicio.tipo + "</span>" +
          '<div class="cuerpo-servicio">' +
            "<h3>" + servicio.nombre + "</h3>" +
            '<p class="meta-servicio">' + servicio.duracion + " · " + servicio.modalidad + "</p>" +
            '<p class="descripcion-servicio">' + servicio.descripcion + "</p>" +
            '<p class="precio-servicio">' + formatearPrecioCLP(servicio.precio) + "</p>" +
            '<div class="d-flex gap-2 mt-auto">' +
              '<a href="producto-detalle.html?codigo=' + servicio.codigo + '" class="btn btn-nv-secundario btn-sm flex-grow-1">Ver detalle</a>' +
              '<a href="agendar.html?codigo=' + servicio.codigo + '" class="btn btn-nv-primario btn-sm flex-grow-1">Agendar</a>' +
            "</div>" +
          "</div>" +
        "</article>" +
      "</li>"
    );
  }

  function renderizar(tipoSeleccionado) {
    const listaFiltrada = tipoSeleccionado === "Todos"
      ? catalogoServicios
      : catalogoServicios.filter(function (servicio) {
          return servicio.tipo === tipoSeleccionado;
        });

    contenedor.innerHTML = listaFiltrada.map(crearTarjeta).join("");
  }

  filtros.forEach(function (boton) {
    boton.addEventListener("click", function () {
      filtros.forEach(function (b) { b.classList.remove("activo"); });
      boton.classList.add("activo");
      renderizar(boton.dataset.tipo);
    });
  });

  renderizar("Todos");
});
