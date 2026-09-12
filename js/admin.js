/* Panel administrativo frontend para la Evaluación 1. */

const regionesComunas = {
  "Arica y Parinacota": ["Arica", "Putre"],
  "Tarapacá": ["Iquique", "Alto Hospicio"],
  "Antofagasta": ["Antofagasta", "Calama"],
  "Atacama": ["Copiapó", "Vallenar"],
  "Coquimbo": ["La Serena", "Coquimbo", "Ovalle"],
  "Valparaíso": ["Valparaíso", "Viña del Mar", "Quilpué"],
  "Metropolitana": ["Santiago", "Maipú", "Puente Alto"],
  "O'Higgins": ["Rancagua", "San Fernando"],
  "Maule": ["Talca", "Curicó", "Linares"],
  "Ñuble": ["Chillán", "San Carlos"],
  "Biobío": ["Concepción", "Los Ángeles", "Talcahuano"],
  "La Araucanía": ["Temuco", "Villarrica", "Angol"],
  "Los Ríos": ["Valdivia", "La Unión"],
  "Los Lagos": ["Puerto Montt", "Osorno", "Castro"],
  "Aysén": ["Coyhaique", "Puerto Aysén"],
  "Magallanes": ["Punta Arenas", "Puerto Natales"]
};

function mostrarMensajeAdmin(id, mensaje, tipo) {
  const contenedor = document.getElementById(id);
  if (!contenedor) return;
  contenedor.textContent = mensaje;
  contenedor.className = "alert alert-" + (tipo || "success") + " mensaje-resultado-formulario mt-3";
}

function protegerVistaAdministrador() {
  const sesion = obtenerSesion();
  if (!sesion || sesion.tipoUsuario !== "Administrador") {
    window.location.href = "login.html?desde=admin";
    return false;
  }

  document.querySelectorAll("[data-usuario-sesion]").forEach(function (elemento) {
    elemento.textContent = sesion.nombre + " · " + sesion.tipoUsuario;
  });
  return true;
}

function cerrarSesionAdmin() {
  cerrarSesion();
  window.location.href = "login.html";
}

function crearCelda(texto) {
  const celda = document.createElement("td");
  celda.textContent = texto;
  return celda;
}

function inicializarPanelAdmin() {
  const totalProductos = document.getElementById("total-productos-admin");
  const totalUsuarios = document.getElementById("total-usuarios-admin");
  if (!totalProductos && !totalUsuarios) return;

  if (totalProductos) totalProductos.textContent = obtenerProductos().length;
  if (totalUsuarios) totalUsuarios.textContent = obtenerUsuarios().length;

}

function llenarSelectRegiones(select) {
  if (!select) return;
  select.innerHTML = '<option value="">Selecciona una región</option>';
  Object.keys(regionesComunas).forEach(function (region) {
    const opcion = document.createElement("option");
    opcion.value = region;
    opcion.textContent = region;
    select.appendChild(opcion);
  });
}

function llenarSelectComunas(select, region, comunaSeleccionada) {
  if (!select) return;
  select.innerHTML = '<option value="">Selecciona una comuna</option>';
  (regionesComunas[region] || []).forEach(function (comuna) {
    const opcion = document.createElement("option");
    opcion.value = comuna;
    opcion.textContent = comuna;
    opcion.selected = comuna === comunaSeleccionada;
    select.appendChild(opcion);
  });
  select.disabled = !region;
}

function inicializarProductosAdmin() {
  const tabla = document.getElementById("tabla-productos-admin");
  const formulario = document.getElementById("formulario-producto-admin");
  if (!tabla || !formulario) return;

  const campoCodigo = document.getElementById("admin-producto-codigo");
  const campoTipo = document.getElementById("admin-producto-tipo");
  const campoNombre = document.getElementById("admin-producto-nombre");
  const campoDuracion = document.getElementById("admin-producto-duracion");
  const campoModalidad = document.getElementById("admin-producto-modalidad");
  const campoProfesional = document.getElementById("admin-producto-profesional");
  const campoPrecio = document.getElementById("admin-producto-precio");
  const campoStock = document.getElementById("admin-producto-stock");
  const campoStockCritico = document.getElementById("admin-producto-stock-critico");
  const campoImagen = document.getElementById("admin-producto-imagen");
  const campoDescripcion = document.getElementById("admin-producto-descripcion");
  const botonCancelar = document.getElementById("cancelar-edicion-producto");
  let codigoEnEdicion = null;

  function limpiarFormulario() {
    formulario.reset();
    codigoEnEdicion = null;
    campoCodigo.readOnly = false;
    botonCancelar.classList.add("d-none");
    document.getElementById("titulo-formulario-producto").textContent = "Nuevo servicio o plan";
    formulario.querySelectorAll(".is-valid, .is-invalid").forEach(function (campo) {
      campo.classList.remove("is-valid", "is-invalid");
    });
  }

  function renderizarTabla() {
    const productos = obtenerProductos();
    tabla.replaceChildren();
    productos.forEach(function (producto) {
      const fila = document.createElement("tr");
      fila.appendChild(crearCelda(producto.codigo));
      fila.appendChild(crearCelda(producto.nombre));
      fila.appendChild(crearCelda(producto.tipo));
      fila.appendChild(crearCelda(formatearPrecioCLP(Number(producto.precio) || 0)));
      const stock = Number(producto.stock);
      const stockCritico = Number(producto.stockCritico);
      const celdaStock = crearCelda(Number.isFinite(stock) ? String(stock) : "—");
      if (Number.isFinite(stock) && Number.isFinite(stockCritico) && stock <= stockCritico) {
        celdaStock.classList.add("stock-critico");
        celdaStock.textContent += " · Stock crítico";
      }
      fila.appendChild(celdaStock);

      const acciones = document.createElement("td");
      acciones.className = "d-flex gap-2 flex-wrap";
      const editar = document.createElement("button");
      editar.type = "button";
      editar.className = "btn btn-sm btn-nv-secundario";
      editar.textContent = "Editar";
      editar.addEventListener("click", function () { cargarProducto(producto.codigo); });
      const eliminar = document.createElement("button");
      eliminar.type = "button";
      eliminar.className = "btn btn-sm btn-outline-danger";
      eliminar.textContent = "Eliminar";
      eliminar.addEventListener("click", function () {
        if (!window.confirm("¿Eliminar este servicio del catálogo?")) return;
        guardarProductos(obtenerProductos().filter(function (item) { return item.codigo !== producto.codigo; }));
        renderizarTabla();
        limpiarFormulario();
        mostrarMensajeAdmin("mensaje-producto-admin", "Servicio eliminado correctamente.", "success");
      });
      acciones.append(editar, eliminar);
      fila.appendChild(acciones);
      tabla.appendChild(fila);
    });
  }

  function cargarProducto(codigo) {
    const producto = buscarProductoPorCodigo(codigo);
    if (!producto) return;
    codigoEnEdicion = codigo;
    campoCodigo.value = producto.codigo;
    campoCodigo.readOnly = true;
    campoTipo.value = producto.tipo;
    campoNombre.value = producto.nombre;
    campoDuracion.value = producto.duracion || "";
    campoModalidad.value = producto.modalidad || "";
    campoProfesional.value = producto.profesional || "Nutricionista";
    campoPrecio.value = producto.precio;
    campoStock.value = producto.stock ?? 0;
    campoStockCritico.value = producto.stockCritico ?? 0;
    campoImagen.value = producto.imagen || "";
    campoDescripcion.value = producto.descripcion || "";
    botonCancelar.classList.remove("d-none");
    document.getElementById("titulo-formulario-producto").textContent = "Editar servicio o plan";
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  formulario.addEventListener("submit", function (evento) {
    evento.preventDefault();
    const codigoValido = validarTexto(campoCodigo, { minimo: 3, etiqueta: "El código" });
    const tipoValido = validarTexto(campoTipo, { maximo: 50, etiqueta: "La categoría" });
    const nombreValido = validarTexto(campoNombre, { maximo: 100, etiqueta: "El nombre" });
    const duracionValida = validarTexto(campoDuracion, { maximo: 30, etiqueta: "La duración", requerido: false });
    const modalidadValida = validarTexto(campoModalidad, { maximo: 80, etiqueta: "La modalidad" });
    const profesionalValido = validarTexto(campoProfesional, { maximo: 100, etiqueta: "El profesional" });
    const descripcionValida = validarTexto(campoDescripcion, { maximo: 500, etiqueta: "La descripción", requerido: false });
    const precio = Number(campoPrecio.value);
    const stock = Number(campoStock.value);
    const stockCritico = campoStockCritico.value === "" ? 0 : Number(campoStockCritico.value);
    const precioValido = Number.isFinite(precio) && precio >= 0;
    const stockValido = Number.isInteger(stock) && stock >= 0;
    const stockCriticoValido = Number.isInteger(stockCritico) && stockCritico >= 0;

    if (!precioValido) mostrarError(campoPrecio, "El precio debe ser un número igual o superior a 0."); else marcarValido(campoPrecio);
    if (!stockValido) mostrarError(campoStock, "El stock debe ser un número entero igual o superior a 0."); else marcarValido(campoStock);
    if (!stockCriticoValido) mostrarError(campoStockCritico, "El stock crítico debe ser un entero igual o superior a 0."); else marcarValido(campoStockCritico);

    const valido = codigoValido && tipoValido && nombreValido && duracionValida && modalidadValida && profesionalValido && descripcionValida && precioValido && stockValido && stockCriticoValido;
    if (!valido) {
      mostrarMensajeAdmin("mensaje-producto-admin", "Revisa los campos marcados antes de guardar.", "danger");
      return;
    }

    const productos = obtenerProductos();
    const codigo = campoCodigo.value.trim();
    const indice = productos.findIndex(function (producto) { return producto.codigo === (codigoEnEdicion || codigo); });
    const codigoDuplicado = productos.some(function (producto, posicion) { return producto.codigo === codigo && posicion !== indice; });
    if (codigoDuplicado) {
      mostrarError(campoCodigo, "Ya existe un servicio con ese código.");
      mostrarMensajeAdmin("mensaje-producto-admin", "No se puede guardar un código repetido.", "danger");
      return;
    }

    const producto = {
      codigo: codigo,
      tipo: campoTipo.value.trim(),
      nombre: campoNombre.value.trim(),
      duracion: campoDuracion.value.trim() || "—",
      modalidad: campoModalidad.value.trim(),
      profesional: campoProfesional.value.trim(),
      precio: precio,
      stock: stock,
      stockCritico: stockCritico,
      imagen: campoImagen.value.trim(),
      descripcion: campoDescripcion.value.trim()
    };

    if (indice >= 0) productos[indice] = producto; else productos.push(producto);
    guardarProductos(productos);
    renderizarTabla();
    limpiarFormulario();
    mostrarMensajeAdmin("mensaje-producto-admin", "Servicio guardado correctamente.", "success");
  });

  botonCancelar.addEventListener("click", limpiarFormulario);
  renderizarTabla();
}

function inicializarUsuariosAdmin() {
  const tabla = document.getElementById("tabla-usuarios-admin");
  const formulario = document.getElementById("formulario-usuario-admin");
  if (!tabla || !formulario) return;

  const campoRun = document.getElementById("admin-usuario-run");
  const campoNombre = document.getElementById("admin-usuario-nombre");
  const campoApellidos = document.getElementById("admin-usuario-apellidos");
  const campoCorreo = document.getElementById("admin-usuario-correo");
  const campoFecha = document.getElementById("admin-usuario-fecha");
  const campoTipo = document.getElementById("admin-usuario-tipo");
  const campoRegion = document.getElementById("admin-usuario-region");
  const campoComuna = document.getElementById("admin-usuario-comuna");
  const campoDireccion = document.getElementById("admin-usuario-direccion");
  const campoContrasena = document.getElementById("admin-usuario-contrasena");
  const botonCancelar = document.getElementById("cancelar-edicion-usuario");
  let runEnEdicion = null;

  llenarSelectRegiones(campoRegion);
  campoRegion.addEventListener("change", function () { llenarSelectComunas(campoComuna, campoRegion.value, ""); });

  function limpiarFormulario() {
    formulario.reset();
    runEnEdicion = null;
    campoRun.readOnly = false;
    llenarSelectComunas(campoComuna, "", "");
    botonCancelar.classList.add("d-none");
    document.getElementById("titulo-formulario-usuario").textContent = "Nuevo usuario";
    formulario.querySelectorAll(".is-valid, .is-invalid").forEach(function (campo) { campo.classList.remove("is-valid", "is-invalid"); });
  }

  function renderizarTabla() {
    tabla.replaceChildren();
    obtenerUsuarios().forEach(function (usuario) {
      const fila = document.createElement("tr");
      fila.appendChild(crearCelda(usuario.run));
      fila.appendChild(crearCelda(usuario.nombre + " " + usuario.apellidos));
      fila.appendChild(crearCelda(usuario.correo));
      fila.appendChild(crearCelda(usuario.tipoUsuario));
      fila.appendChild(crearCelda(usuario.region + " · " + usuario.comuna));
      const acciones = document.createElement("td");
      acciones.className = "d-flex gap-2 flex-wrap";
      const editar = document.createElement("button");
      editar.type = "button";
      editar.className = "btn btn-sm btn-nv-secundario";
      editar.textContent = "Editar";
      editar.addEventListener("click", function () { cargarUsuario(usuario.run); });
      const eliminar = document.createElement("button");
      eliminar.type = "button";
      eliminar.className = "btn btn-sm btn-outline-danger";
      eliminar.textContent = "Desactivar";
      eliminar.addEventListener("click", function () {
        if (!window.confirm("¿Desactivar este usuario?")) return;
        guardarUsuarios(obtenerUsuarios().filter(function (item) { return item.run !== usuario.run; }));
        renderizarTabla();
        limpiarFormulario();
        mostrarMensajeAdmin("mensaje-usuario-admin", "Usuario desactivado correctamente.", "success");
      });
      acciones.append(editar, eliminar);
      fila.appendChild(acciones);
      tabla.appendChild(fila);
    });
  }

  function cargarUsuario(run) {
    const usuario = obtenerUsuarios().find(function (item) { return item.run === run; });
    if (!usuario) return;
    runEnEdicion = run;
    campoRun.value = usuario.run;
    campoRun.readOnly = true;
    campoNombre.value = usuario.nombre;
    campoApellidos.value = usuario.apellidos;
    campoCorreo.value = usuario.correo;
    campoFecha.value = usuario.fechaNacimiento || "";
    campoTipo.value = usuario.tipoUsuario;
    campoRegion.value = usuario.region || "";
    llenarSelectComunas(campoComuna, campoRegion.value, usuario.comuna || "");
    campoDireccion.value = usuario.direccion || "";
    campoContrasena.value = "";
    botonCancelar.classList.remove("d-none");
    document.getElementById("titulo-formulario-usuario").textContent = "Editar usuario";
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  formulario.addEventListener("submit", function (evento) {
    evento.preventDefault();
    const runValido = validarRUN(campoRun);
    const nombreValido = validarTexto(campoNombre, { maximo: 50, etiqueta: "El nombre" });
    const apellidosValidos = validarTexto(campoApellidos, { maximo: 100, etiqueta: "Los apellidos" });
    const correoValido = validarCorreo(campoCorreo);
    const direccionValida = validarTexto(campoDireccion, { maximo: 300, etiqueta: "La dirección" });
    const contrasenaValida = runEnEdicion && campoContrasena.value === "" ? true : validarContrasena(campoContrasena);
    const seleccionValida = Boolean(campoTipo.value && campoRegion.value && campoComuna.value);
    if (!seleccionValida) mostrarMensajeAdmin("mensaje-usuario-admin", "Selecciona tipo de usuario, región y comuna.", "danger");

    if (!runValido || !nombreValido || !apellidosValidos || !correoValido || !direccionValida || !contrasenaValida || !seleccionValida) {
      if (!seleccionValida) return;
      mostrarMensajeAdmin("mensaje-usuario-admin", "Revisa los campos marcados antes de guardar.", "danger");
      return;
    }

    const usuarios = obtenerUsuarios();
    const indice = usuarios.findIndex(function (usuario) { return usuario.run === (runEnEdicion || campoRun.value.trim().toUpperCase()); });
    const run = campoRun.value.trim().toUpperCase();
    const duplicado = usuarios.some(function (usuario, posicion) { return (usuario.run === run || usuario.correo.toLowerCase() === campoCorreo.value.trim().toLowerCase()) && posicion !== indice; });
    if (duplicado) {
      mostrarMensajeAdmin("mensaje-usuario-admin", "El RUN o correo ya está registrado.", "danger");
      return;
    }

    const usuarioAnterior = indice >= 0 ? usuarios[indice] : {};
    const usuario = {
      run: run,
      nombre: campoNombre.value.trim(),
      apellidos: campoApellidos.value.trim(),
      correo: campoCorreo.value.trim().toLowerCase(),
      contrasena: campoContrasena.value || usuarioAnterior.contrasena || "cliente",
      fechaNacimiento: campoFecha.value,
      tipoUsuario: campoTipo.value,
      region: campoRegion.value,
      comuna: campoComuna.value,
      direccion: campoDireccion.value.trim()
    };

    if (indice >= 0) usuarios[indice] = usuario; else usuarios.push(usuario);
    guardarUsuarios(usuarios);
    renderizarTabla();
    limpiarFormulario();
    mostrarMensajeAdmin("mensaje-usuario-admin", "Usuario guardado correctamente.", "success");
  });

  botonCancelar.addEventListener("click", limpiarFormulario);
  renderizarTabla();
}

document.addEventListener("DOMContentLoaded", function () {
  if (!protegerVistaAdministrador()) return;
  inicializarPanelAdmin();
  inicializarProductosAdmin();
  inicializarUsuariosAdmin();
  document.querySelectorAll("[data-cerrar-sesion]").forEach(function (boton) {
    boton.addEventListener("click", cerrarSesionAdmin);
  });
});
