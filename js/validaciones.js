function mostrarError(input, mensaje) {
  input.classList.add("is-invalid");
  input.classList.remove("is-valid");
  const contenedorError = input.closest(".mb-3") || input.parentElement;
  const feedback = contenedorError.querySelector(".invalid-feedback");
  if (feedback) feedback.textContent = mensaje;
}

function marcarValido(input) {
  input.classList.remove("is-invalid");
  input.classList.add("is-valid");
}

function validarCorreo(input, { requerido = true } = {}) {
  const valor = input.value.trim();

  if (valor === "") {
    if (requerido) {
      mostrarError(input, "El correo es obligatorio.");
      return false;
    }
    input.classList.remove("is-invalid", "is-valid");
    return true;
  }
  if (valor.length > 100) {
    mostrarError(input, "El correo no puede superar los 100 caracteres.");
    return false;
  }
  const formatoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor);
  if (!formatoValido) {
    mostrarError(input, "Ingresa un correo electrónico válido.");
    return false;
  }
  marcarValido(input);
  return true;
}

function validarContrasena(input) {
  const valor = input.value;
  if (valor === "") {
    mostrarError(input, "La contraseña es obligatoria.");
    return false;
  }
  if (valor.length < 4 || valor.length > 10) {
    mostrarError(input, "La contraseña debe tener entre 4 y 10 caracteres.");
    return false;
  }
  marcarValido(input);
  return true;
}

function calcularDigitoVerificadorRUT(cuerpoRUT) {
  let suma = 0;
  let multiplo = 2;
  for (let i = cuerpoRUT.length - 1; i >= 0; i--) {
    suma += Number(cuerpoRUT[i]) * multiplo;
    multiplo = multiplo === 7 ? 2 : multiplo + 1;
  }
  const resto = 11 - (suma % 11);
  if (resto === 11) return "0";
  if (resto === 10) return "K";
  return String(resto);
}

function validarRUN(input) {
  const valor = input.value.trim().toUpperCase();

  if (valor === "") {
    mostrarError(input, "El RUN es obligatorio.");
    return false;
  }
  if (/[.-]/.test(valor)) {
    mostrarError(input, "Ingresa el RUN sin puntos ni guion. Ej: 761920839.");
    return false;
  }
  if (valor.length < 7 || valor.length > 9) {
    mostrarError(input, "El RUN debe tener entre 7 y 9 caracteres.");
    return false;
  }
  const cuerpo = valor.slice(0, -1);
  const dv = valor.slice(-1);
  if (!/^\d+$/.test(cuerpo) || !/^[0-9K]$/.test(dv)) {
    mostrarError(input, "El RUN solo puede contener numeros y, al final, un digito verificador.");
    return false;
  }
  if (calcularDigitoVerificadorRUT(cuerpo) !== dv) {
    mostrarError(input, "El digito verificador del RUN no es valido.");
    return false;
  }
  marcarValido(input);
  return true;
}

function validarTexto(input, { maximo, minimo = 1, etiqueta, requerido = true }) {
  const valor = input.value.trim();
  if (valor === "") {
    if (requerido) {
      mostrarError(input, etiqueta + " es obligatorio.");
      return false;
    }
    input.classList.remove("is-invalid", "is-valid");
    return true;
  }
  if (valor.length < minimo) {
    mostrarError(input, etiqueta + " debe tener al menos " + minimo + " caracteres.");
    return false;
  }
  if (valor.length > maximo) {
    mostrarError(input, etiqueta + " no puede superar los " + maximo + " caracteres.");
    return false;
  }
  marcarValido(input);
  return true;
}

/* ---------------------------------------------------
   Formulario: Registro de paciente (registro.html)
   --------------------------------------------------- */
(function inicializarFormularioRegistro() {
  const formulario = document.getElementById("formulario-registro");
  if (!formulario) return;

  const campoRun = document.getElementById("registro-run");
  const campoNombre = document.getElementById("registro-nombre");
  const campoApellidos = document.getElementById("registro-apellidos");
  const campoCorreo = document.getElementById("registro-correo");
  const campoFechaNacimiento = document.getElementById("registro-fecha-nacimiento");
  const campoDireccion = document.getElementById("registro-direccion");
  const campoContrasena = document.getElementById("registro-contrasena");
  const mensajeResultado = document.getElementById("mensaje-resultado-registro");

  formulario.addEventListener("submit", function (evento) {
    evento.preventDefault();

    const runValido = validarRUN(campoRun);
    const nombreValido = validarTexto(campoNombre, { maximo: 50, etiqueta: "El nombre" });
    const apellidosValidos = validarTexto(campoApellidos, { maximo: 100, etiqueta: "Los apellidos" });
    const correoValido = validarCorreo(campoCorreo);
    const direccionValida = validarTexto(campoDireccion, { maximo: 300, etiqueta: "La dirección" });
    const contrasenaValida = validarContrasena(campoContrasena);
    campoFechaNacimiento.classList.remove("is-invalid");

    const formularioValido =
      runValido && nombreValido && apellidosValidos && correoValido && direccionValida && contrasenaValida;

    if (!formularioValido) {
      mensajeResultado.textContent = "Revisa los campos marcados en rojo antes de continuar.";
      mensajeResultado.className = "alert alert-danger mensaje-resultado-formulario mt-4";
      return;
    }

    mensajeResultado.textContent =
      "¡Listo, " + campoNombre.value.trim() + "! Tu cuenta quedó registrada. Ya puedes iniciar sesión.";
    mensajeResultado.className = "alert alert-success mensaje-resultado-formulario mt-4";
    formulario.reset();
    formulario.querySelectorAll(".is-valid").forEach(function (el) {
      el.classList.remove("is-valid");
    });
  });
})();

/* ---------------------------------------------------
   Formulario: Inicio de sesion (login.html)
   --------------------------------------------------- */
(function inicializarFormularioLogin() {
  const formulario = document.getElementById("formulario-login");
  if (!formulario) return;

  const campoCorreo = document.getElementById("login-correo");
  const campoContrasena = document.getElementById("login-contrasena");
  const mensajeResultado = document.getElementById("mensaje-resultado-login");

  formulario.addEventListener("submit", function (evento) {
    evento.preventDefault();

    const correoValido = validarCorreo(campoCorreo);
    const contrasenaValida = validarContrasena(campoContrasena);

    if (!correoValido || !contrasenaValida) {
      mensajeResultado.textContent = "Revisa tu correo y contraseña e inténtalo nuevamente.";
      mensajeResultado.className = "alert alert-danger mensaje-resultado-formulario mt-4";
      return;
    }

    mensajeResultado.textContent =
      "Sesión simulada correctamente. En esta entrega el inicio de sesión aún no está conectado a un servidor.";
    mensajeResultado.className = "alert alert-success mensaje-resultado-formulario mt-4";
  });
})();

/* ---------------------------------------------------
   Formulario: Contacto (contacto.html)
   --------------------------------------------------- */
(function inicializarFormularioContacto() {
  const formulario = document.getElementById("formulario-contacto");
  if (!formulario) return;

  const campoNombre = document.getElementById("contacto-nombre");
  const campoCorreo = document.getElementById("contacto-correo");
  const campoComentario = document.getElementById("contacto-comentario");
  const contadorComentario = document.getElementById("contador-comentario");
  const mensajeResultado = document.getElementById("mensaje-resultado-contacto");

  if (campoComentario && contadorComentario) {
    campoComentario.addEventListener("input", function () {
      contadorComentario.textContent = campoComentario.value.length + " / 500";
    });
  }

  formulario.addEventListener("submit", function (evento) {
    evento.preventDefault();

    const nombreValido = validarTexto(campoNombre, { maximo: 100, etiqueta: "El nombre" });
    const correoValido = validarCorreo(campoCorreo);
    const comentarioValido = validarTexto(campoComentario, { maximo: 500, etiqueta: "El comentario" });

    if (!nombreValido || !correoValido || !comentarioValido) {
      mensajeResultado.textContent = "Revisa los campos marcados en rojo antes de enviar tu mensaje.";
      mensajeResultado.className = "alert alert-danger mensaje-resultado-formulario mt-4";
      return;
    }

    mensajeResultado.textContent =
      "¡Gracias, " + campoNombre.value.trim() + "! Recibimos tu mensaje y te responderemos a la brevedad.";
    mensajeResultado.className = "alert alert-success mensaje-resultado-formulario mt-4";
    formulario.reset();
    if (contadorComentario) contadorComentario.textContent = "0 / 500";
    formulario.querySelectorAll(".is-valid").forEach(function (el) {
      el.classList.remove("is-valid");
    });
  });
})();
