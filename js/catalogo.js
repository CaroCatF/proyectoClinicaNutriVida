//  Catalogo de servicios — Clinica Nutricional NutriVida
//  Arreglo de productos usado por productos.js y producto-detalle.js

const catalogoServicios = [
  { codigo: "CN001", tipo: "Consulta", nombre: "Primera consulta nutricional", duracion: "50 min", modalidad: "Presencial", profesional: "Nutricionista", precio: 35000, descripcion: "Evaluacion inicial: anamnesis, antropometria completa y diseno del primer plan alimenticio." },
  { codigo: "CN002", tipo: "Consulta", nombre: "Control nutricional (seguimiento)", duracion: "30 min", modalidad: "Presencial", profesional: "Nutricionista", precio: 25000, descripcion: "Seguimiento mensual: medicion de indicadores y ajuste del plan vigente." },
  { codigo: "CN003", tipo: "Consulta", nombre: "Control nutricional quincenal", duracion: "30 min", modalidad: "Presencial", profesional: "Nutricionista", precio: 22000, descripcion: "Seguimiento intensivo cada 15 dias. Recomendado en los primeros 2 meses." },
  { codigo: "CN004", tipo: "Consulta", nombre: "Teleconsulta nutricional", duracion: "30 min", modalidad: "Online (video)", profesional: "Nutricionista", precio: 20000, descripcion: "Consulta de seguimiento via videollamada. Requiere contar con consulta presencial previa." },
  { codigo: "CN005", tipo: "Consulta", nombre: "Consulta de urgencia / reagendada", duracion: "30 min", modalidad: "Presencial", profesional: "Nutricionista", precio: 28000, descripcion: "Para pacientes que requieren atencion fuera de su control habitual." },
  { codigo: "PL001", tipo: "Plan especializado", nombre: "Plan perdida de peso (1 mes)", duracion: "—", modalidad: "Presencial", profesional: "Nutricionista", precio: 65000, descripcion: "Incluye primera consulta + 1 control quincenal + plan alimenticio personalizado + seguimiento por WhatsApp." },
  { codigo: "PL002", tipo: "Plan especializado", nombre: "Plan perdida de peso (3 meses)", duracion: "—", modalidad: "Presencial", profesional: "Nutricionista", precio: 170000, descripcion: "Incluye primera consulta + 5 controles + 3 planes mensuales + seguimiento continuo." },
  { codigo: "PL003", tipo: "Plan especializado", nombre: "Plan nutricion deportiva (1 mes)", duracion: "—", modalidad: "Presencial", profesional: "Nutricionista", precio: 70000, descripcion: "Para deportistas y personas con actividad fisica frecuente. Calculo de requerimientos energeticos y proteicos." },
  { codigo: "PL004", tipo: "Plan especializado", nombre: "Plan control diabetes / hipertension", duracion: "—", modalidad: "Presencial", profesional: "Nutricionista", precio: 75000, descripcion: "Plan adaptado para patologias metabolicas. Coordinacion con medico tratante si aplica." },
  { codigo: "PL005", tipo: "Plan especializado", nombre: "Plan alimentacion vegetariana/vegana", duracion: "—", modalidad: "Presencial", profesional: "Nutricionista", precio: 68000, descripcion: "Disenado para garantizar aporte adecuado de proteinas, hierro, vitamina B12 y calcio sin productos animales." },
  { codigo: "PL006", tipo: "Plan especializado", nombre: "Plan alimentacion infantil (2-12 anos)", duracion: "—", modalidad: "Presencial", profesional: "Nutricionista", precio: 65000, descripcion: "Evaluacion nutricional pediatrica y diseno de plan adaptado a la etapa de desarrollo del nino." },
  { codigo: "EV001", tipo: "Evaluacion", nombre: "Antropometria completa", duracion: "20 min", modalidad: "Presencial", profesional: "Nutricionista", precio: 18000, descripcion: "Peso, talla, IMC, circunferencia de cintura, cadera, brazo y % de grasa corporal con bioimpedanciometria." },
  { codigo: "EV002", tipo: "Evaluacion", nombre: "Bioimpedanciometria", duracion: "15 min", modalidad: "Presencial", profesional: "Nutricionista", precio: 12000, descripcion: "Medicion de composicion corporal: masa grasa, masa muscular, agua corporal y edad metabolica." },
  { codigo: "EV003", tipo: "Evaluacion", nombre: "Encuesta de habitos alimentarios", duracion: "20 min", modalidad: "Presencial", profesional: "Nutricionista", precio: 10000, descripcion: "Analisis del patron alimentario actual. Identificacion de deficit y excesos nutricionales." },
  { codigo: "EV004", tipo: "Evaluacion", nombre: "Analisis de examenes de laboratorio", duracion: "20 min", modalidad: "Presencial", profesional: "Nutricionista", precio: 15000, descripcion: "Interpretacion de hemograma, perfil bioquimico y lipidico en contexto nutricional." },
  { codigo: "TG001", tipo: "Taller grupal", nombre: "Taller de alimentacion saludable", duracion: "90 min", modalidad: "Presencial (grupo)", profesional: "Nutricionista", precio: 15000, descripcion: "Max. 10 personas. Conceptos basicos de alimentacion equilibrada y lectura de etiquetas." },
  { codigo: "TG002", tipo: "Taller grupal", nombre: "Taller de cocina nutritiva", duracion: "120 min", modalidad: "Presencial (grupo)", profesional: "Nutricionista", precio: 20000, descripcion: "Preparacion de recetas saludables. Incluye degustacion. Max. 8 personas." },
  { codigo: "TG003", tipo: "Taller grupal", nombre: "Taller nutricion para deportistas", duracion: "90 min", modalidad: "Presencial (grupo)", profesional: "Nutricionista", precio: 18000, descripcion: "Hidratacion, nutricion pre y post entrenamiento, suplementacion basica. Max. 12 personas." }
];

// Utilidad compartida para formatear precios en pesos chilenos
function formatearPrecioCLP(valor) {
  return "$" + valor.toLocaleString("es-CL");
}
