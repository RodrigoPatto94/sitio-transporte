/* =====================================================================
   config.js  |  DATOS DE LA EMPRESA
   ---------------------------------------------------------------------
   Este es el ÚNICO archivo que tenés que editar para cambiar el nombre,
   los datos de contacto y los textos principales de la página.

   Reglas simples:
   - Cambiá solo lo que está entre comillas "".
   - No borres las comas al final de cada línea.
   - Todo lo que diga [A COMPLETAR] es un dato pendiente.
   ===================================================================== */

const CONFIG = {

  /* ---------- 1. IDENTIDAD ---------- */
  nombreEmpresa: "ABLog",            // NOMBRE PROVISORIO: reemplazar cuando se defina el definitivo
  eslogan: "Tu tranquilidad en nuestras manos",
  anioFundacion: "2026",

  /* ---------- 2. CONTACTO ---------- */
  // WhatsApp: solo números, con código de país. Ejemplo Argentina: 5493810000000
  // (54 = país, 9 = celular, luego código de área sin 0 y número sin 15)
  whatsappNumero: "5491141776628",
  whatsappMensaje: "Hola, quisiera solicitar una cotización de transporte de cargas, por favor.",
  email: "pr.bridgeto@gmail.com",
  telefono: "[A COMPLETAR]",
  direccion: "Tucuman, Argentina",
  horarios: "De 09:00hs a 19:00hs",

  /* ---------- 3. FORMULARIO ---------- */
  // Dirección donde se envían las consultas. Se obtiene al crear el formulario
  // en formspree.io y tiene este aspecto: "https://formspree.io/f/xxxxxxxx"
  // (No muestra el correo de la empresa; ese se configura dentro de Formspree.)
  formularioEndpoint: "https://formspree.io/f/mqppyqoj",

  /* ---------- 4. RUTAS Y COBERTURA ---------- */
  rutaOrigen: "Córdoba",
  rutaDestino: "Tucumán",
  localidadesCobertura: [
    "Concepcion, Tucuman, Arg.",
    "[A COMPLETAR: localidad 2]",
    "[A COMPLETAR: localidad 3]",
  ],

  /* ---------- 5. DATOS LEGALES (pie de página) ---------- */
  cuit: "[A COMPLETAR]",
  razonSocial: "[A COMPLETAR]",
  habilitaciones: "[A COMPLETAR]",

  /* ---------- 6. REDES SOCIALES (opcional) ---------- */
  redes: {
    instagram: "",   // dejar vacío "" si no existe: no se mostrará
    facebook: "",
    linkedin: "",
  },
};
