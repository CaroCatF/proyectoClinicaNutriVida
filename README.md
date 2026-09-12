# NutriVida — Clínica Nutricional

Sitio web para la Clínica Nutricional NutriVida (Temuco, Región de La Araucanía). Proyecto académico desarrollado para el curso **DSY1104 – Desarrollo FullStack II**.

Permite a los pacientes conocer los servicios y planes nutricionales, agregarlos a un carrito, solicitar horas de atención y crear una cuenta. Incluye además un panel de administración para gestionar el catálogo de servicios y los usuarios del sistema.

## Tabla de contenidos

- [Stack tecnológico](#stack-tecnológico)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Funcionalidades](#funcionalidades)
- [Roles y credenciales de demostración](#roles-y-credenciales-de-demostración)
- [Cómo ejecutar el proyecto](#cómo-ejecutar-el-proyecto)
- [Persistencia de datos](#persistencia-de-datos)
- [Diseño y estilos](#diseño-y-estilos)
- [Alcance de esta entrega](#alcance-de-esta-entrega)
- [Próximos pasos](#próximos-pasos)

## Stack tecnológico

- **HTML5** semántico para la estructura de cada vista.
- **CSS3** propio, organizado por página, más [Bootstrap 5.3.8](https://getbootstrap.com/) (vía CDN) para grid, formularios y utilidades.
- **JavaScript** (Vanilla, sin frameworks) para renderizado dinámico, validaciones y persistencia.
- **`localStorage`** como capa de persistencia del lado del cliente (carrito, catálogo editable, usuarios y sesión).

No requiere backend, base de datos ni proceso de build: es un sitio estático que puede abrirse directamente en el navegador o servirse con cualquier servidor HTTP simple.

## Estructura del proyecto

```
NutriVida-V1/
├── index.html                  # Página de inicio
├── nosotros.html                # Quiénes somos / equipo de nutricionistas
├── productos.html               # Catálogo de servicios y planes
├── producto-detalle.html        # Detalle de un servicio (?codigo=)
├── carrito.html                 # Carrito de servicios seleccionados
├── agendar.html                 # Formulario para solicitar una hora
├── contacto.html                # Formulario de contacto
├── blog.html                    # Índice de artículos
├── blog-habitos-trabajo.html    # Artículo del blog
├── blog-mitos-dietas.html       # Artículo del blog
├── login.html                   # Inicio de sesión
├── registro.html                # Registro de pacientes
├── admin.html                   # Panel de administración (resumen)
├── admin-productos.html         # Mantenedor de servicios/planes
├── admin-usuarios.html          # Mantenedor de usuarios y roles
├── css/
│   ├── estilos.css              # Hoja de estilos principal (design system)
│   └── ...                      # Hojas de estilos específicas por página
├── js/
│   ├── catalogo.js              # Catálogo base de servicios (seed)
│   ├── almacenamiento.js        # Capa de persistencia en localStorage
│   ├── carrito.js               # Lógica del carrito de servicios
│   ├── productos.js             # Renderizado del catálogo y filtros
│   ├── producto-detalle.js      # Renderizado del detalle de un servicio
│   ├── agendar.js               # Lógica del formulario de agendamiento
│   ├── validaciones.js          # Validaciones de formularios (registro, login, contacto)
│   └── admin.js                 # Lógica del panel administrativo (CRUD)
└── imagenes/                    # Recursos gráficos (SVG)
```

## Funcionalidades

### Tienda / sitio público

- Catálogo de servicios y planes filtrable por categoría (consultas, planes especializados, evaluaciones, talleres grupales).
- Vista de detalle por servicio, accesible mediante `producto-detalle.html?codigo=`.
- **Carrito de servicios** con persistencia en `localStorage`:
  - Agregar desde el catálogo o desde el detalle.
  - Modificar cantidades.
  - Eliminar servicios individuales.
  - Vaciar el carrito.
  - Cálculo automático del total.
  - Contador visible en la barra de navegación.
- Formulario de **agendamiento de hora**, con selección de servicio, nutricionista, fecha y horario, y validación en tiempo real.
- Formulario de **contacto** con validación de nombre, correo y comentario.
- **Registro** y **login** de pacientes, con creación de cuentas y sesión persistida en `localStorage`.
- Blog institucional con artículos de ejemplo.

### Panel de administración

Acceso protegido, disponible solo para el rol **Administrador**:

- Resumen con métricas básicas (cantidad de servicios y usuarios).
- **Mantenedor de productos/servicios**: crear, editar y eliminar servicios del catálogo (código, categoría, nombre, duración, modalidad, profesional, precio, stock, stock crítico, imagen y descripción).
- **Mantenedor de usuarios**: crear, editar y desactivar usuarios, con asignación de rol (Administrador, Cliente, Vendedor), validación de RUN chileno, correo institucional y selección de región/comuna.
- Alerta visual cuando el stock de un servicio es igual o inferior a su stock crítico.

## Roles y credenciales de demostración

| Rol | Correo | Contraseña |
|---|---|---|
| Administrador | `admin@gmail.com` | `admin123` |
| Vendedor | `vendedor@gmail.com` | `vendedor` |

Los pacientes pueden crear su propia cuenta desde `registro.html`.

> Estas credenciales son solo para fines de demostración académica. La autenticación se resuelve íntegramente en el navegador (sin backend), por lo que **no debe usarse como mecanismo de seguridad real**.

## Cómo ejecutar el proyecto

No requiere instalación de dependencias. Basta con servir los archivos estáticos:

**Opción 1: abrir directamente**

Abre `index.html` en tu navegador.

**Opción 2: con un servidor local (recomendado)**

```bash
# Con Python
python3 -m http.server 8080

# Con Node (http-server)
npx http-server -p 8080
```

Luego visita `http://localhost:8080`.

## Persistencia de datos

Toda la información editable (carrito, catálogo, usuarios y sesión) se guarda en el `localStorage` del navegador mediante `js/almacenamiento.js`, bajo las siguientes claves:

- `nutrivida_carrito`
- `nutrivida_productos`
- `nutrivida_usuarios`
- `nutrivida_sesion`

Si no hay datos guardados, el catálogo se inicializa con el arreglo semilla definido en `js/catalogo.js`. Esto significa que los cambios realizados desde el panel de administración son locales a cada navegador y se pierden si se limpia el almacenamiento del sitio.

## Diseño y estilos

El diseño sigue un design system propio basado en tonos teal/turquesa:

- Tipografía: **Instrument Sans**.
- Color principal: escala `primary` (de `#F0FDFA` a `#0F766E`), usada en botones, enlaces, estados activos y encabezados.
- Componentes: tarjetas con bordes suaves y sombra sutil, formularios con foco en teal, footer y encabezado administrativo en teal oscuro.
- Diseño responsive: probado para móvil (≥360px), tablet (≥768px) y escritorio (≥1280px), usando el grid de Bootstrap y media queries propias en `css/estilos.css`.

## Alcance de esta entrega

Este proyecto corresponde a la **primera evaluación** del curso, cuyo foco es:

- Estructura semántica en HTML.
- Diseño responsive con CSS externo propio.
- Validación de formularios con JavaScript (mensajes de error y sugerencias en tiempo real).
- Flujo de carrito de compras con persistencia en `localStorage`.
- Mantenedores (CRUD) de productos y usuarios en el panel de administración.
- Uso de control de versiones con GitHub.

No incluye backend, base de datos en servidor, autenticación segura del lado servidor ni integración con mapas o pagos: esos componentes corresponden a etapas posteriores del proyecto.

## Próximos pasos

De cara a las siguientes evaluaciones del curso, el proyecto está pensado para evolucionar hacia:

- Backend con microservicios en **Spring Boot**, expuestos como API REST.
- Persistencia en una base de datos relacional (**MySQL**, PostgreSQL u Oracle).
- Frontend migrado a **React (SPA)**.
- Autenticación real con roles (**Administrador, Nutricionista, Paciente**).
- Integración de mapa interactivo (Leaflet o Google Maps) para ubicar la clínica.
- Despliegue en **AWS** utilizando contenedores Docker.
