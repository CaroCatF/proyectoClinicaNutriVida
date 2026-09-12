
  //  Pagina Agendar hora (agendar.html)
  //  Requiere que catalogo.js y validaciones.js esten cargados antes.

document.addEventListener("DOMContentLoaded", function () {
  const selectServicio = document.getElementById("agendar-servicio");
  const campoFecha = document.getElementById("agendar-fecha");

  if (selectServicio) {
    catalogoServicios.forEach(function (servicio) {
      const opcion = document.createElement("option");
      opcion.value = servicio.codigo;
      opcion.textContent = servicio.nombre + " — " + formatearPrecioCLP(servicio.precio);
      selectServicio.appendChild(opcion);
    });

    const parametros = new URLSearchParams(window.location.search);
    const codigoPreseleccionado = parametros.get("codigo");
    if (codigoPreseleccionado) {
      selectServicio.value = codigoPreseleccionado;
    }
  }

  if (campoFecha) {
    const hoy = new Date();
    const hoyTexto = hoy.getFullYear() + "-" +
      String(hoy.getMonth() + 1).padStart(2, "0") + "-" +
      String(hoy.getDate()).padStart(2, "0");
    campoFecha.setAttribute("min", hoyTexto);
  }
});

function validarSeleccion(select, mensaje) {
  if (select.value === "") {
    mostrarError(select, mensaje);
    return false;
  }
  marcarValido(select);
  return true;
}

// Regla de negocio propia del formulario de Agendar hora: el correo de
// confirmacion solo se acepta desde estos dominios.
const DOMINIOS_PERMITIDOS_AGENDA = ["duoc.cl", "profesor.duoc.cl", "gmail.com"];

function validarCorreoAgenda(input) {
  const valor = input.value.trim();

  if (valor === "") {
    mostrarError(input, "El correo es obligatorio.");
    return false;
  }
  if (valor.length > 100) {
    mostrarError(input, "El correo no puede superar los 100 caracteres.");
    return false;
  }
  const formatoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor);
  const partes = valor.split("@");
  const dominioValido = partes.length === 2 && DOMINIOS_PERMITIDOS_AGENDA.includes(partes[1].toLowerCase());
  if (!formatoValido || !dominioValido) {
    mostrarError(input, "Usa un correo @duoc.cl, @profesor.duoc.cl o @gmail.com.");
    return false;
  }
  marcarValido(input);
  return true;
}

function validarFechaAgenda(input) {
  const valor = input.value;
  if (valor === "") {
    mostrarError(input, "La fecha es obligatoria.");
    return false;
  }
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const fechaElegida = new Date(valor + "T00:00:00");
  if (fechaElegida < hoy) {
    mostrarError(input, "Elige una fecha de hoy en adelante.");
    return false;
  }
  marcarValido(input);
  return true;
}

(function inicializarFormularioAgendar() {
  const formulario = document.getElementById("formulario-agendar");
  if (!formulario) return;

  const campoNombre = document.getElementById("agendar-nombre");
  const campoCorreo = document.getElementById("agendar-correo");
  const selectServicio = document.getElementById("agendar-servicio");
  const selectNutricionista = document.getElementById("agendar-nutricionista");
  const campoFecha = document.getElementById("agendar-fecha");
  const selectHorario = document.getElementById("agendar-horario");
  const campoMotivo = document.getElementById("agendar-motivo");
  const contadorMotivo = document.getElementById("contador-motivo");
  const mensajeResultado = document.getElementById("mensaje-resultado-agendar");

  if (campoMotivo && contadorMotivo) {
    campoMotivo.addEventListener("input", function () {
      contadorMotivo.textContent = campoMotivo.value.length + " / 300";
    });
  }

  formulario.addEventListener("submit", function (evento) {
    evento.preventDefault();

    const nombreValido = validarTexto(campoNombre, { maximo: 100, etiqueta: "El nombre" });
    const correoValido = validarCorreoAgenda(campoCorreo);
    const servicioValido = validarSeleccion(selectServicio, "Selecciona el servicio que necesitas.");
    // El nutricionista es opcional (el paciente puede indicar "sin preferencia").
    selectNutricionista.classList.remove("is-invalid");
    const fechaValida = validarFechaAgenda(campoFecha);
    const horarioValido = validarSeleccion(selectHorario, "Selecciona un horario disponible.");
    const motivoValido = validarTexto(campoMotivo, { maximo: 300, etiqueta: "El motivo", requerido: false });

    const formularioValido =
      nombreValido && correoValido && servicioValido && fechaValida && horarioValido && motivoValido;

    if (!formularioValido) {
      mensajeResultado.textContent = "Revisa los campos marcados en rojo antes de continuar.";
      mensajeResultado.className = "alert alert-danger mensaje-resultado-formulario mt-4";
      return;
    }

    const nombreServicio = selectServicio.options[selectServicio.selectedIndex].text;
    mensajeResultado.textContent =
      "¡Listo, " + campoNombre.value.trim() + "! Tu hora para \"" + nombreServicio + "\" quedo solicitada para el " +
      campoFecha.value + " a las " + selectHorario.value + ". Te confirmaremos por correo.";
    mensajeResultado.className = "alert alert-success mensaje-resultado-formulario mt-4";
    formulario.reset();
    if (contadorMotivo) contadorMotivo.textContent = "0 / 300";
    formulario.querySelectorAll(".is-valid").forEach(function (el) {
      el.classList.remove("is-valid");
    });
  });
})();
