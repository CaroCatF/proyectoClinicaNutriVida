/* Persistencia local para la Evaluación 1.
   En una versión productiva estas operaciones serían reemplazadas por una API. */

const CLAVES_NUTRIVIDA = {
  carrito: "nutrivida_carrito",
  productos: "nutrivida_productos",
  usuarios: "nutrivida_usuarios",
  sesion: "nutrivida_sesion"
};

function leerAlmacenamiento(clave, valorPorDefecto) {
  try {
    const valor = localStorage.getItem(clave);
    return valor ? JSON.parse(valor) : valorPorDefecto;
  } catch (error) {
    return valorPorDefecto;
  }
}

function guardarAlmacenamiento(clave, valor) {
  localStorage.setItem(clave, JSON.stringify(valor));
}

function escaparHTML(valor) {
  return String(valor ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function obtenerProductos() {
  const productosGuardados = leerAlmacenamiento(CLAVES_NUTRIVIDA.productos, null);
  if (Array.isArray(productosGuardados) && productosGuardados.length > 0) {
    return productosGuardados;
  }
  return typeof catalogoServicios !== "undefined" ? catalogoServicios.slice() : [];
}

function guardarProductos(productos) {
  guardarAlmacenamiento(CLAVES_NUTRIVIDA.productos, productos);
}

function buscarProductoPorCodigo(codigo) {
  return obtenerProductos().find(function (producto) {
    return producto.codigo === codigo;
  });
}

function obtenerCarrito() {
  const carrito = leerAlmacenamiento(CLAVES_NUTRIVIDA.carrito, []);
  return Array.isArray(carrito) ? carrito : [];
}

function guardarCarrito(carrito) {
  guardarAlmacenamiento(CLAVES_NUTRIVIDA.carrito, carrito);
  actualizarContadorCarrito();
}

function agregarAlCarrito(producto) {
  const carrito = obtenerCarrito();
  const existente = carrito.find(function (item) {
    return item.codigo === producto.codigo;
  });

  if (existente) {
    existente.cantidad += 1;
  } else {
    carrito.push({
      codigo: producto.codigo,
      nombre: producto.nombre,
      precio: Number(producto.precio) || 0,
      cantidad: 1
    });
  }

  guardarCarrito(carrito);
  return carrito;
}

function actualizarCantidadCarrito(codigo, cantidad) {
  const carrito = obtenerCarrito();
  const item = carrito.find(function (producto) {
    return producto.codigo === codigo;
  });

  if (!item) return;
  item.cantidad = Math.max(1, Number.parseInt(cantidad, 10) || 1);
  guardarCarrito(carrito);
}

function eliminarDelCarrito(codigo) {
  guardarCarrito(obtenerCarrito().filter(function (item) {
    return item.codigo !== codigo;
  }));
}

function vaciarCarrito() {
  guardarCarrito([]);
}

function cantidadTotalCarrito() {
  return obtenerCarrito().reduce(function (total, item) {
    return total + (Number(item.cantidad) || 0);
  }, 0);
}

function totalCarrito() {
  return obtenerCarrito().reduce(function (total, item) {
    return total + ((Number(item.precio) || 0) * (Number(item.cantidad) || 0));
  }, 0);
}

function actualizarContadorCarrito() {
  document.querySelectorAll("[data-contador-carrito]").forEach(function (contador) {
    const cantidad = cantidadTotalCarrito();
    contador.textContent = cantidad;
    contador.classList.toggle("d-none", cantidad === 0);
    contador.setAttribute("aria-label", cantidad + " servicio(s) en el carrito");
  });
}

function obtenerUsuarios() {
  const usuarios = leerAlmacenamiento(CLAVES_NUTRIVIDA.usuarios, null);
  if (Array.isArray(usuarios) && usuarios.length > 0) return usuarios;

  return [
    {
      run: "761920839",
      nombre: "Administrador",
      apellidos: "NutriVida",
      correo: "admin@gmail.com",
      contrasena: "admin123",
      fechaNacimiento: "",
      tipoUsuario: "Administrador",
      region: "La Araucanía",
      comuna: "Temuco",
      direccion: "Av. Alemania 0671"
    },
    {
      run: "123456785",
      nombre: "Vendedor",
      apellidos: "NutriVida",
      correo: "vendedor@gmail.com",
      contrasena: "vendedor",
      fechaNacimiento: "",
      tipoUsuario: "Vendedor",
      region: "La Araucanía",
      comuna: "Temuco",
      direccion: "Av. Alemania 0671"
    }
  ];
}

function guardarUsuarios(usuarios) {
  guardarAlmacenamiento(CLAVES_NUTRIVIDA.usuarios, usuarios);
}

function obtenerSesion() {
  return leerAlmacenamiento(CLAVES_NUTRIVIDA.sesion, null);
}

function guardarSesion(usuario) {
  guardarAlmacenamiento(CLAVES_NUTRIVIDA.sesion, {
    correo: usuario.correo,
    nombre: usuario.nombre,
    tipoUsuario: usuario.tipoUsuario
  });
}

function cerrarSesion() {
  localStorage.removeItem(CLAVES_NUTRIVIDA.sesion);
}

document.addEventListener("DOMContentLoaded", actualizarContadorCarrito);
