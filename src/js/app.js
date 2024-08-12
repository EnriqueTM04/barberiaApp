let paso = 1;
const pasoInicial = 1;
const pasoFinal = 3;

const cita = {
    id: '',
    nombre: '',
    fecha: '',
    hora: '',
    servicios: []
}


document.addEventListener('DOMContentLoaded', function() {
    iniciarApp();
});

function iniciarApp() {
    mostrarSeccion();   //Muestra y oculta las secciones
    tabs(); //Cambia la seccion cuando se preciona tabs
    botonesPaginador(); //Agrega o quita botones del paginador
    paginaSiguiente();
    paginaAnterior();

    consultarAPI(); // Consulta la API en el backend de php

    idCliente();
    nombreCliente(); // Agrega nombre del cliente al objeto cita
    seleccionarFecha();
    seleccionarHora();

    mostrarResumen();
}

function mostrarSeccion() {

    // Ocultar la seccion que tenga la clase mostrar
    const seccionAnterior = document.querySelector('.mostrar');
    if(seccionAnterior) {
        seccionAnterior.classList.remove('mostrar');
    }

    // Seleccionar seccion con el paso
    const seccion = document.querySelector(`#paso-${paso}`);
    seccion.classList.add('mostrar');

    // Quitar tab anterior
    const tabAnterior = document.querySelector('.actual');
    if(tabAnterior) {
        tabAnterior.classList.remove('actual');
    }

    // Resaltar tab actual
    const tab = document.querySelector(`[data-paso="${paso}"]`);
    tab.classList.add('actual');
}

function tabs() {
    const botones = document.querySelectorAll('.tabs button');

    botones.forEach(boton => {
        boton.addEventListener('click', function(e) {
            paso = parseInt(e.target.dataset.paso);
            botonesPaginador();
        })
    });
}

function botonesPaginador() {
    const paginaAnterior = document.querySelector('#anterior');
    const paginaSiguiente = document.querySelector('#siguiente');

    if(paso === 1) {
        paginaAnterior.classList.add('ocultar');
        paginaSiguiente.classList.remove('ocultar');
    } else if(paso === 3) {
        paginaAnterior.classList.remove('ocultar');
        paginaSiguiente.classList.add('ocultar');
        mostrarResumen();
    } else {
        paginaAnterior.classList.remove('ocultar');
        paginaSiguiente.classList.remove('ocultar');
    }

    mostrarSeccion();
}

function paginaSiguiente() {
    const paginaAnterior = document.querySelector('#anterior');
    paginaAnterior.addEventListener('click', function() {
        
        if(paso <= pasoInicial) return;

        paso --;

        botonesPaginador();
    });
}

function paginaAnterior() {

    const paginaSiguiente = document.querySelector('#siguiente');
    paginaSiguiente.addEventListener('click', function() {
        
        if(paso >= pasoFinal) return;

        paso ++;

        botonesPaginador();
    });

}

async function consultarAPI() {

    try {
        const url = `${location.origin}/api/servicios`;
        const resultado = await fetch(url);
        const servicios = await resultado.json();

        mostrarServicios(servicios);
        
    } catch (error) {
        console.log(error);
    }
}

function mostrarServicios(servicios) {

    servicios.forEach(servicio => {
        const {id, nombre, precio} = servicio;
        
        const nombreServicio = document.createElement('P');
        nombreServicio.classList.add('nombre-servicio');
        nombreServicio.textContent = nombre;

        const precioServicio = document.createElement('P');
        precioServicio.classList.add('precio-servicio');
        precioServicio.textContent = `$ ${precio}`;

        const servicioDiv =  document.createElement('DIV');
        servicioDiv.classList.add('servicio');
        servicioDiv.dataset.idServicio = id;
        
        servicioDiv.onclick = function () {
            seleccionarServicio(servicio);
        };

        servicioDiv.appendChild(nombreServicio);
        servicioDiv.appendChild(precioServicio);

        document.querySelector('#servicios').appendChild(servicioDiv);
    });
}

function seleccionarServicio(servicio) {
    const {id} =  servicio;
    const {servicios} = cita;

    // Identificar elemnto al que se da click
    const divServicio = document.querySelector(`[data-id-servicio="${id}"]`);

    // comprobar si un servicio fue agregado o quitado
    if( servicios.some(agregado => agregado.id === id) ) {
        // Eliminarlo
        cita.servicios = servicios.filter(agregado => agregado.id !== id);
        divServicio.classList.remove('seleccionado');

    } else {
        // Agregarlo
        cita.servicios = [...servicios, servicio];
        divServicio.classList.add('seleccionado');
    }
}

function idCliente() {
    cita.id = document.querySelector('#idCliente').value;
}

function nombreCliente() {
    const nombre = document.querySelector('#nombre').value;

    cita.nombre = nombre;
}

function seleccionarFecha() {
    const inputFecha = document.querySelector('#fecha');
    inputFecha.addEventListener('input', function(e) {

        const dia = new Date(e.target.value).getUTCDay();

        if([6, 0].includes(dia)) {
            e.target.value = '';
            mostrarAlerta('Fines de semanas no abierto', 'error', '.formulario');
        } else {
            cita.fecha = e.target.value;
        }
    })
}

function seleccionarHora() {
    const inputHora = document.querySelector('#hora');
    inputHora.addEventListener('input', function(e) {

        const horaCita =  e.target.value;
        const hora = horaCita.split(":")[0];
        if(hora < 8 || hora > 20) {
            mostrarAlerta('Hora no valida', 'error', '.formulario');
        } else {
            cita.hora = e.target.value;
        }
    });
}

function mostrarAlerta(mensaje, tipo, elemento, desaparece = true) {

    const alertaPrevia = document.querySelector('.alerta');

    if(alertaPrevia) {
        alertaPrevia.remove();
    }

    const alerta = document.createElement('DIV');
    alerta.textContent= mensaje;
    alerta.classList.add('alerta');
    alerta.classList.add(tipo);

    const referencia = document.querySelector(elemento);
    referencia.appendChild(alerta);

    if(desaparece) {
        setTimeout(() => {
            alerta.remove();
        }, 3000);
    }
    
}

function mostrarResumen() {
    const resumen = document.querySelector('.contenido-resumen');

    while(resumen.firstChild) {
        resumen.removeChild(resumen.firstChild);
    }

    if(Object.values(cita).includes('') || cita.servicios.length === 0) {
        mostrarAlerta('Faltan datos de servicios, fecha u hora', 'error', '.contenido-resumen', false);
        return;
    } 

    // Formatear el div de resumen
    const {nombre, fecha, hora, servicios} = cita;

    // Heading para servicios
    const headingServicios = document.createElement('H3');
    headingServicios.textContent = 'Resumen de Servicios';
    resumen.appendChild(headingServicios);

    // Iterando y mostrando los servicios
    servicios.forEach(servicio => {
        const { id, precio, nombre } = servicio;

        const contenedorServicios = document.createElement('DIV');
        contenedorServicios.classList.add('contenedor-servicio');

        const textoServicio = document.createElement('P');
        textoServicio.textContent = nombre;

        const precioServicio = document.createElement('P');
        precioServicio.innerHTML = `<span>Precio: </span>$ ${precio}`;

        contenedorServicios.appendChild(textoServicio);
        contenedorServicios.appendChild(precioServicio);

        resumen.appendChild(contenedorServicios);
    });

    // Heading para cita
    const headingCita = document.createElement('H3');
    headingCita.textContent = 'Resumen de cita';
    resumen.appendChild(headingCita);

    const nombreCliente = document.createElement('P');
    nombreCliente.innerHTML = `<span>Nombre: </span> ${nombre}`;

    // Formateo de fecha
    const fechaObj = new Date(fecha);
    const mes = fechaObj.getMonth();
    const dia = fechaObj.getDate() + 2;
    const year = fechaObj.getFullYear();

    const fechaUTC = new Date(Date.UTC(year, mes, dia));

    const opciones = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };
    const fechaFormateada = fechaUTC.toLocaleDateString('es-MX', opciones);

    const fechaCita = document.createElement('P');
    fechaCita.innerHTML = `<span>Fecha: </span> ${fechaFormateada}`;

    const horaCita = document.createElement('P');
    horaCita.innerHTML = `<span>Hora: </span> ${hora} hrs`;

    // Boton finalizar cita
    const botonReservar = document.createElement('BUTTON');
    botonReservar.classList.add('boton');
    botonReservar.textContent = 'Reservar Cita';
    botonReservar.onclick = reservarCita;

    resumen.appendChild(nombreCliente);
    resumen.appendChild(fechaCita);
    resumen.appendChild(horaCita);

    resumen.appendChild(botonReservar);
}

async function reservarCita() {

    const { id, fecha, hora, servicios } = cita;

    const idServicios = servicios.map( servicio => servicio.id );

    const datos = new FormData();
    datos.append('usuarioId', id);
    datos.append('fecha', fecha);
    datos.append('hora', hora);
    datos.append('servicios', idServicios);

    // console.log[...datos];

    try {
        // Peticion hacia la api
        const url = `${location.origin}/api/citas`;
        const respuesta = await fetch(url, {
            method: 'POST',
            body: datos
        });

        // .json es lo que esta en prototype de respuesta
        const resultado = await respuesta.json();
        
        if(resultado) {
            Swal.fire({
                icon: "success",
                title: "Cita Creada",
                text: 'Tu cita fue creada correctamente'
            }).then( () => {
                window.location.reload();
            } );;
        }
    } catch (error) {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "No se pudo crear la cita!",
          });
    }

    
}

