// Renderizado dinámico del catálogo (productos.html).
// Requiere catalogo.js, almacenamiento.js y carrito.js.

document.addEventListener("DOMContentLoaded", function () {
  const contenedor = document.getElementById("grilla-servicios");
  const filtros = document.querySelectorAll(".filtro-categoria");
  if (!contenedor) return;

  function crearTarjeta(servicio) {
    return (
      '<li class="servicio-columna">' +
        '<article class="tarjeta-servicio">' +
          '<span class="franja-tipo">' + escaparHTML(servicio.tipo) + "</span>" +
          '<img class="imagen-servicio" src="' + escaparHTML(servicio.imagen && !servicio.imagen.includes("assets/") ? servicio.imagen : "imagenes/servicio-placeholder.svg") + '" alt="Ilustración del servicio ' + escaparHTML(servicio.nombre) + '">' +
          '<div class="cuerpo-servicio">' +
            "<h3>" + escaparHTML(servicio.nombre) + "</h3>" +
            '<p class="meta-servicio">' + escaparHTML(servicio.duracion) + " · " + escaparHTML(servicio.modalidad) + "</p>" +
            '<p class="descripcion-servicio">' + escaparHTML(servicio.descripcion) + "</p>" +
            '<p class="precio-servicio">' + formatearPrecioCLP(Number(servicio.precio) || 0) + "</p>" +
            '<div class="acciones-servicio">' +
              '<a href="producto-detalle.html?codigo=' + encodeURIComponent(servicio.codigo) + '" class="btn btn-nv-secundario boton-servicio">Ver detalle</a>' +
              '<button type="button" data-agregar-carrito="' + escaparHTML(servicio.codigo) + '" class="btn btn-nv-primario boton-servicio">Añadir</button>' +
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
      contenedor.innerHTML = '<li class="servicio-columna servicio-columna-vacio"><div class="mensaje-sin-servicios">No hay servicios disponibles en esta categoría.</div></li>';
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
