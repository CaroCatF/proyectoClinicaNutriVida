// Renderizado dinámico del catálogo (productos.html).
// Requiere catalogo.js, almacenamiento.js y carrito.js.

document.addEventListener("DOMContentLoaded", function () {
  const contenedor = document.getElementById("grilla-servicios");
  const filtros = document.querySelectorAll(".filtro-categoria");
  if (!contenedor) return;

  function crearTarjeta(servicio) {
    return (
      '<li class="col-sm-6 col-lg-4">' +
        '<article class="tarjeta-servicio">' +
          '<span class="franja-tipo">' + escaparHTML(servicio.tipo) + "</span>" +
          '<img class="imagen-servicio" src="' + escaparHTML(servicio.imagen || "assets/servicio-placeholder.svg") + '" alt="Ilustración del servicio ' + escaparHTML(servicio.nombre) + '">' +
          '<div class="cuerpo-servicio">' +
            "<h3>" + escaparHTML(servicio.nombre) + "</h3>" +
            '<p class="meta-servicio">' + escaparHTML(servicio.duracion) + " · " + escaparHTML(servicio.modalidad) + "</p>" +
            '<p class="descripcion-servicio">' + escaparHTML(servicio.descripcion) + "</p>" +
            '<p class="precio-servicio">' + formatearPrecioCLP(Number(servicio.precio) || 0) + "</p>" +
            '<div class="d-flex gap-2 mt-auto flex-wrap">' +
              '<a href="producto-detalle.html?codigo=' + encodeURIComponent(servicio.codigo) + '" class="btn btn-nv-secundario btn-sm flex-grow-1">Ver detalle</a>' +
              '<button type="button" data-agregar-carrito="' + escaparHTML(servicio.codigo) + '" class="btn btn-nv-primario btn-sm flex-grow-1">Añadir</button>' +
            "</div>" +
            '<a href="agendar.html?codigo=' + encodeURIComponent(servicio.codigo) + '" class="enlace-agenda-servicio">Agendar este servicio</a>' +
          "</div>" +
        "</article>" +
      "</li>"
    );
  }

  function renderizar(tipoSeleccionado) {
    const productos = obtenerProductos();
    const listaFiltrada = tipoSeleccionado === "Todos"
      ? productos
      : productos.filter(function (servicio) {
          return servicio.tipo === tipoSeleccionado;
        });

    if (listaFiltrada.length === 0) {
      contenedor.innerHTML = '<li class="col-12"><div class="alert alert-info">No hay servicios disponibles en esta categoría.</div></li>';
      return;
    }
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
