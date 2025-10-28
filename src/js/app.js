let paso = 1;
const pasoIncial = 1;
const pasoFinal = 3;
const cita = {
  id: "",
  nombre: "",
  fecha: "",
  hora: "",
  servicios: [],
};

document.addEventListener("DOMContentLoaded", function () {
  inicarApp();
});

function inicarApp() {
  mostarSeccion();
  tabs();
  botonesPaginador(); //Agrega o quita los botnes del paginador
  paginaSiguiente();
  paginaAnterior();

  idCliente();
  nombreCliente();
  seleccionaFecha();
  seleccionaHora();

  mostraResumen();

  consultarApi(); //Consultar api del backen en php
}

function mostarSeccion() {
  const seccionAnterior = document.querySelector(".mostrar");
  if (seccionAnterior) {
    seccionAnterior.classList.remove("mostrar");
  }
  const pasoSelector = `#paso-${paso}`;
  const seccion = document.querySelector(pasoSelector);
  seccion.classList.add("mostrar");

  const tabAnterior = document.querySelector(".actual");
  if (tabAnterior) {
    tabAnterior.classList.remove("actual");
  }

  const tab = document.querySelector(`[data-paso="${paso}"`);
  tab.classList.add("actual");
}

function tabs() {
  const botones = document.querySelectorAll(".tabs button");
  botones.forEach((boton) => {
    boton.addEventListener("click", function (e) {
      paso = parseInt(e.target.dataset.paso);
      mostarSeccion();

      botonesPaginador();
    });
  });
}

function botonesPaginador() {
  const paginaAnterior = document.querySelector("#anterior");
  const paginaSiguiente = document.querySelector("#siguiente");

  if (paso === 1) {
    paginaSiguiente.classList.remove("ocultar");
    paginaAnterior.classList.add("ocultar");
  } else if (paso === 3) {
    paginaAnterior.classList.remove("ocultar");
    paginaSiguiente.classList.add("ocultar");

    mostraResumen();
  } else {
    paginaAnterior.classList.remove("ocultar");
    paginaSiguiente.classList.remove("ocultar");
  }
  mostarSeccion();
}

function paginaAnterior() {
  const paginaAnterior = document.querySelector("#anterior");
  paginaAnterior.addEventListener("click", function () {
    if (paso <= pasoIncial) return;
    paso--;
    botonesPaginador();
  });
}

function paginaSiguiente() {
  const paginaSiguiente = document.querySelector("#siguiente");
  paginaSiguiente.addEventListener("click", function () {
    if (paso >= pasoFinal) return;
    paso++;
    botonesPaginador();
  });
}

async function consultarApi() {
  try {
    const url = "/api/servicios";
    const resultado = await fetch(url);
    const servicios = await resultado.json();

    mostrarServicios(servicios);
  } catch (error) {
    console.log(error);
  }
}

function mostrarServicios(servicios) {
  servicios.forEach((servicio) => {
    const { id, nombre, precio } = servicio;

    const nombreServicio = document.createElement("P");
    nombreServicio.classList.add("nombre-servicio");
    nombreServicio.textContent = nombre;

    const precioServicio = document.createElement("P");
    precioServicio.classList.add("precio-servicio");
    precioServicio.textContent = `$${precio} `;

    const servicioDiv = document.createElement("DIV");
    servicioDiv.classList.add("servicio");
    servicioDiv.dataset.idServicio = id;
    servicioDiv.onclick = function () {
      seleccionarServicio(servicio);
    };

    servicioDiv.appendChild(nombreServicio);
    servicioDiv.appendChild(precioServicio);
    document.querySelector("#servicios").appendChild(servicioDiv);
  });
}

function seleccionarServicio(servicio) {
  const { id } = servicio;
  const { servicios } = cita;
  const divServicio = document.querySelector(`[data-id-servicio="${id}"] `);

  if (servicios.some((agregado) => agregado.id === id)) {
    cita.servicios = servicios.filter((agregado) => agregado.id !== id);
    divServicio.classList.remove("seleccionado");
  } else {
    cita.servicios = [...servicios, servicio];
    divServicio.classList.add("seleccionado");
  }

  // console.log(cita);
}

function idCliente() {
  cita.id = document.querySelector("#id").value;
}

function nombreCliente() {
  cita.nombre = document.querySelector("#nombre").value;
}

function seleccionaFecha() {
  const inputFecha = document.querySelector("#fecha");
  inputFecha.addEventListener("input", function (e) {
    const dia = new Date(e.target.value).getUTCDay();

    if ([6, 0].includes(dia)) {
      e.target.value = "";
      mostrarAlerta("Fines de semana no laborables", "error", ".formulario");
    } else {
      cita.fecha = e.target.value;
    }
  });
}

function seleccionaHora() {
  const inputHora = document.querySelector("#hora");
  inputHora.addEventListener("input", function (e) {
    console.log(e.target.value);

    const horaCicta = e.target.value;
    const hora = horaCicta.split(":")[0];

    if (hora < 10 || hora > 18) {
      e.target.value = "";
      mostrarAlerta("Hora no valida", "error", ".formulario");
    } else {
      cita.hora = e.target.value;
      console.log(cita);
    }
  });
}

function mostrarAlerta(mensaje, tipo, elemento, desaparece = true) {
  const alertaPrevia = document.querySelector(".alerta");
  if (alertaPrevia) {
    alertaPrevia.remove();
  }

  const alerta = document.createElement("DIV");
  alerta.textContent = mensaje;
  alerta.classList.add("alerta");
  alerta.classList.add(tipo);

  const referencia = document.querySelector(elemento);
  referencia.appendChild(alerta);

  if (desaparece) {
    setTimeout(() => {
      alerta.remove();
    }, 3000);
  }
}

function mostraResumen() {
  const resumen = document.querySelector(".contenido-resumen");

  while (resumen.firstChild) {
    resumen.removeChild(resumen.firstChild);
  }
  if (Object.values(cita).includes("") || cita.servicios.length === 0) {
    mostrarAlerta(
      "Faltan datos de servicios, Fecha u Hora",
      "error",
      ".contenido-resumen",
      false
    );
    return;
  }

  const { nombre, fecha, hora, servicios } = cita;

  const headingServicios = document.createElement("H3");
  headingServicios.textContent = "Resumen de Servicios";
  resumen.appendChild(headingServicios);

  servicios.forEach((servicio) => {
    const { id, precio, nombre } = servicio;
    const contenedorServicio = document.createElement("Div");
    contenedorServicio.classList.add("contenedor-servicio");

    const textoServicio = document.createElement("P");
    textoServicio.textContent = nombre;

    const precioServicio = document.createElement("P");
    precioServicio.innerHTML = `<span>Precio:</span> ${precio}`;

    contenedorServicio.appendChild(textoServicio);
    contenedorServicio.appendChild(precioServicio);

    resumen.appendChild(contenedorServicio);
  });

  const headingCita = document.createElement("H3");
  headingCita.textContent = "Resumen de Cita";
  resumen.appendChild(headingCita);

  const nombreCliente = document.createElement("P");
  nombreCliente.innerHTML = `<span>Nombre:</span> ${nombre}`;

  //formatear fecha:
  const fechaObj = new Date(fecha);
  const mes = fechaObj.getMonth();
  const dia = fechaObj.getDate() + 2;
  const year = fechaObj.getFullYear();

  const opciones = {
    weekday: "long",
    year: "numeric",
    month: "long",
    month: "long",
    day: "numeric",
  };
  const fechaUTC = new Date(Date.UTC(year, mes, dia));
  const fechaFormateada = fechaUTC.toLocaleDateString("es-MX", opciones);
  console.log(fechaFormateada);

  const fechaCita = document.createElement("P");
  fechaCita.innerHTML = `<span>Fecha:</span> ${fechaFormateada}`;

  const horaCita = document.createElement("P");
  horaCita.innerHTML = `<span>Hora:</span> ${hora}`;

  const botonReservar = document.createElement("BUTTON");
  botonReservar.classList.add("boton");
  botonReservar.textContent = "Resevar Cita";
  botonReservar.onclick = reservaCita;

  resumen.appendChild(nombreCliente);
  resumen.appendChild(fechaCita);
  resumen.appendChild(horaCita);
  resumen.appendChild(botonReservar);
}

async function reservaCita() {
  const { nombre, fecha, hora, servicios, id } = cita;
  const idServicios = servicios.map((servicio) => servicio.id);
  // console.log(idServicios);

  const datos = new FormData();
  datos.append("usuarioId", id);
  datos.append("fecha", fecha);
  1;
  datos.append("hora", hora);
  datos.append("servicios", idServicios);

  // console.log([...datos]); -> Observar datos de FormData()
  //peticion hacia la api

  try {

    const url = "/api/citas";

    const respuesta = await fetch(url, {
      method: "POST",
      body: datos,
    });

    const resultado = await respuesta.json();
    console.log(resultado.resultado);

    if (resultado.resultado) {
      Swal.fire({
        icon: "success",
        title: "Cita Creada",
        text: "Tu cita fue creada correctamente",
        button: 'Ok'
      }).then(() => {
        setTimeout(() => {
          window.location.reload();

        }, 3000);
      })
    }

  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Hubo un error al guardar la informacion",
    });
  }
}
