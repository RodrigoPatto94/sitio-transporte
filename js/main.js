/* =====================================================================
   main.js  |  INTERACTIVIDAD DE LA PÁGINA
   ---------------------------------------------------------------------
   Lee los datos de config.js (objeto CONFIG) y hace funcionar:
   1. Datos de la empresa en la página (nombre, contacto, cobertura)
   2. Enlaces de WhatsApp y correo
   3. Menú desplegable del celular
   4. Formulario: validación, envío online y envío por WhatsApp

   No hace falta editar este archivo para cambiar datos: eso se hace
   en config.js.
   ===================================================================== */

(function () {
  "use strict";

  /* ---------------------------------------------------------------
     UTILIDADES
     --------------------------------------------------------------- */

  // ¿El dato sigue pendiente? (vacío o con la marca [A COMPLETAR])
  function estaPendiente(valor) {
    return !valor || String(valor).indexOf("[A COMPLETAR") === 0;
  }

  // Deja solo los números de un texto: "+54 9 381 000-0000" -> "5493810000000"
  function soloNumeros(texto) {
    return String(texto || "").replace(/\D/g, "");
  }

  // Devuelve el número de WhatsApp limpio, o "" si no está configurado
  function numeroWhatsapp() {
    if (estaPendiente(CONFIG.whatsappNumero)) return "";
    var n = soloNumeros(CONFIG.whatsappNumero);
    return n.length >= 10 ? n : "";
  }

  // Arma el enlace de WhatsApp con un mensaje ya escrito
  function enlaceWhatsapp(mensaje) {
    return "https://wa.me/" + numeroWhatsapp() + "?text=" + encodeURIComponent(mensaje);
  }


  /* ---------------------------------------------------------------
     1. DATOS DE LA EMPRESA
     Busca todo lo que tenga data-config="algo" y le pone el valor
     que figura en config.js.
     --------------------------------------------------------------- */
  document.querySelectorAll("[data-config]").forEach(function (el) {
    var clave = el.getAttribute("data-config");
    var valor = CONFIG[clave];
    if (typeof valor === "string" && valor) {
      el.textContent = valor;
    }
  });

  // El título de la pestaña también usa el nombre configurado.
  // OJO: las etiquetas SEO del <head> se editan a mano (ver explicación del Paso 4).
  if (CONFIG.nombreEmpresa) {
    document.title = document.title.replace("LOS MELLIS", CONFIG.nombreEmpresa);
  }

  // Año actual en el pie de página
  var anio = document.getElementById("anioActual");
  if (anio) anio.textContent = new Date().getFullYear();

  // Lista de localidades de cobertura
  var lista = document.getElementById("listaCobertura");
  if (lista && Array.isArray(CONFIG.localidadesCobertura)) {
    lista.innerHTML = "";
    CONFIG.localidadesCobertura.forEach(function (localidad) {
      var li = document.createElement("li");
      li.textContent = localidad;
      lista.appendChild(li);
    });
  }


  /* ---------------------------------------------------------------
     2. BOTONES DE WHATSAPP Y CORREO
     --------------------------------------------------------------- */
  var whatsappListo = numeroWhatsapp() !== "";

  document.querySelectorAll("[data-whatsapp]").forEach(function (a) {
    if (whatsappListo) {
      a.href = enlaceWhatsapp(CONFIG.whatsappMensaje);
      a.target = "_blank";
      a.rel = "noopener";
    } else {
      // Mientras no haya número, el botón lleva al formulario
      a.href = "#cotizar";
    }
  });

  document.querySelectorAll("[data-email]").forEach(function (a) {
    if (!estaPendiente(CONFIG.email)) {
      a.href = "mailto:" + CONFIG.email +
        "?subject=" + encodeURIComponent("Consulta de cotización");
    } else {
      a.href = "#cotizar";
    }
  });

  if (!whatsappListo) {
    console.warn("[main.js] WhatsApp sin configurar: completá whatsappNumero en config.js");
  }


  /* ---------------------------------------------------------------
     3. MENÚ DEL CELULAR
     --------------------------------------------------------------- */
  var botonMenu = document.getElementById("menuToggle");
  var menu = document.getElementById("menu");

  function cerrarMenu() {
    menu.classList.remove("is-open");
    botonMenu.setAttribute("aria-expanded", "false");
    botonMenu.setAttribute("aria-label", "Abrir menú");
  }

  if (botonMenu && menu) {
    botonMenu.addEventListener("click", function () {
      var abierto = menu.classList.toggle("is-open");
      botonMenu.setAttribute("aria-expanded", String(abierto));
      botonMenu.setAttribute("aria-label", abierto ? "Cerrar menú" : "Abrir menú");
    });

    // Se cierra al elegir una sección, al apretar Escape o al agrandar la ventana
    menu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", cerrarMenu);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") cerrarMenu();
    });
    window.addEventListener("resize", function () {
      if (window.innerWidth > 760) cerrarMenu();
    });
  }


  /* ---------------------------------------------------------------
     4. FORMULARIO DE COTIZACIÓN
     --------------------------------------------------------------- */
  var form = document.getElementById("formCotizacion");
  var estado = document.getElementById("formStatus");
  var botonEnviar = form ? form.querySelector('button[type="submit"]') : null;
  var botonFormWhatsapp = document.getElementById("btnFormWhatsapp");

  // No se puede pedir retiro en una fecha pasada
  var campoFecha = document.getElementById("fecha");
  if (campoFecha) {
    var hoy = new Date();
    var mm = String(hoy.getMonth() + 1).padStart(2, "0");
    var dd = String(hoy.getDate()).padStart(2, "0");
    campoFecha.min = hoy.getFullYear() + "-" + mm + "-" + dd;
  }

  function mostrarEstado(texto, tipo) {
    estado.textContent = texto;
    estado.className = "form__status" + (tipo ? " is-" + tipo : "");
  }

  // Revisa los campos obligatorios. Devuelve true si todo está bien.
  function validarFormulario() {
    var hayError = false;
    var primerError = null;

    form.querySelectorAll("[required]").forEach(function (campo) {
      var valor = campo.type === "checkbox" ? campo.checked : campo.value.trim();
      var valido = Boolean(valor);

      if (valido && campo.type === "email") {
        valido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(campo.value.trim());
      }
      if (valido && campo.type === "tel") {
        valido = soloNumeros(campo.value).length >= 8;
      }

      campo.classList.toggle("is-invalid", !valido);
      campo.setAttribute("aria-invalid", String(!valido));

      if (!valido) {
        hayError = true;
        if (!primerError) primerError = campo;
      }
    });

    if (hayError) {
      mostrarEstado("Revisá los campos marcados en rojo.", "error");
      primerError.focus();
    }
    return !hayError;
  }

  // Al corregir un campo, se le quita la marca roja
  if (form) {
    form.addEventListener("input", function (e) {
      e.target.classList.remove("is-invalid");
      e.target.removeAttribute("aria-invalid");
    });
    form.addEventListener("change", function (e) {
      e.target.classList.remove("is-invalid");
      e.target.removeAttribute("aria-invalid");
    });
  }

  // El action del HTML se sincroniza con config.js (única fuente del dato)
  if (form && !estaPendiente(CONFIG.formularioEndpoint)) {
    form.action = CONFIG.formularioEndpoint;
  }

  // Asunto del correo que llega a la empresa: "Nueva solicitud de cotización - NOMBRE"
  if (form && form.elements["_subject"]) {
    form.elements["_subject"].value = "Nueva solicitud de cotización - " + CONFIG.nombreEmpresa;
  }

  // Junta lo que escribió la persona en un texto prolijo
  function resumenConsulta() {
    function v(id) {
      var campo = document.getElementById(id);
      return campo && campo.value.trim() ? campo.value.trim() : "-";
    }
    return [
      "Hola, quisiera solicitar una cotización de transporte:",
      "",
      "Nombre: " + v("nombre"),
      "Empresa: " + v("empresa"),
      "Teléfono: " + v("telefono"),
      "Email: " + v("email"),
      "Origen: " + v("origen"),
      "Destino: " + v("destino"),
      "Tipo de carga: " + v("tipoCarga"),
      "Cantidad aprox.: " + v("cantidad"),
      "Fecha de retiro: " + v("fecha"),
      "Detalles: " + v("detalles")
    ].join("\n");
  }

  if (form) {
    // --- Envío online (llega al correo de la empresa) ---
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      mostrarEstado("", "");

      if (!validarFormulario()) return;

      // Anti-spam: si el campo trampa tiene texto, es un robot. Simulamos éxito y no enviamos.
      if (form.elements["_gotcha"].value) {
        mostrarEstado("¡Gracias! Recibimos tu solicitud.", "success");
        return;
      }

      // Si todavía no está configurado el servicio de recepción (Paso 5)
      if (estaPendiente(CONFIG.formularioEndpoint)) {
        mostrarEstado(
          "El envío online aún no está disponible. Podés enviar tu consulta por WhatsApp o correo.",
          "error"
        );
        console.warn("[main.js] Falta formularioEndpoint en config.js (Paso 5)");
        return;
      }

      botonEnviar.disabled = true;
      var textoOriginal = botonEnviar.textContent;
      botonEnviar.textContent = "Enviando...";

      fetch(CONFIG.formularioEndpoint, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" }
      })
        .then(function (respuesta) {
          if (!respuesta.ok) throw new Error("Respuesta " + respuesta.status);
          form.reset();
          mostrarEstado("¡Gracias! Recibimos tu solicitud y te vamos a contactar.", "success");
        })
        .catch(function (error) {
          console.error("[main.js] Error al enviar:", error);
          mostrarEstado(
            "No pudimos enviar la solicitud. Probá de nuevo o escribinos por WhatsApp.",
            "error"
          );
        })
        .finally(function () {
          botonEnviar.disabled = false;
          botonEnviar.textContent = textoOriginal;
        });
    });

    // --- Envío por WhatsApp (abre el chat con la consulta ya escrita) ---
    if (botonFormWhatsapp) {
      botonFormWhatsapp.addEventListener("click", function () {
        mostrarEstado("", "");
        if (!validarFormulario()) return;

        if (!whatsappListo) {
          mostrarEstado("WhatsApp aún no está disponible. Usá el botón de enviar solicitud.", "error");
          return;
        }
        window.open(enlaceWhatsapp(resumenConsulta()), "_blank", "noopener");
        mostrarEstado("Se abrió WhatsApp con tu consulta. Solo falta enviar el mensaje.", "success");
      });
    }
  }

})();
