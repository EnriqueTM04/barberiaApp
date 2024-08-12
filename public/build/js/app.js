let paso=1;const pasoInicial=1,pasoFinal=3,cita={id:"",nombre:"",fecha:"",hora:"",servicios:[]};function iniciarApp(){mostrarSeccion(),tabs(),botonesPaginador(),paginaSiguiente(),paginaAnterior(),consultarAPI(),idCliente(),nombreCliente(),seleccionarFecha(),seleccionarHora(),mostrarResumen()}function mostrarSeccion(){const e=document.querySelector(".mostrar");e&&e.classList.remove("mostrar");document.querySelector(`#paso-${paso}`).classList.add("mostrar");const t=document.querySelector(".actual");t&&t.classList.remove("actual");document.querySelector(`[data-paso="${paso}"]`).classList.add("actual")}function tabs(){document.querySelectorAll(".tabs button").forEach((e=>{e.addEventListener("click",(function(e){paso=parseInt(e.target.dataset.paso),botonesPaginador()}))}))}function botonesPaginador(){const e=document.querySelector("#anterior"),t=document.querySelector("#siguiente");1===paso?(e.classList.add("ocultar"),t.classList.remove("ocultar")):3===paso?(e.classList.remove("ocultar"),t.classList.add("ocultar"),mostrarResumen()):(e.classList.remove("ocultar"),t.classList.remove("ocultar")),mostrarSeccion()}function paginaSiguiente(){document.querySelector("#anterior").addEventListener("click",(function(){paso<=pasoInicial||(paso--,botonesPaginador())}))}function paginaAnterior(){document.querySelector("#siguiente").addEventListener("click",(function(){paso>=pasoFinal||(paso++,botonesPaginador())}))}async function consultarAPI(){try{const e=`${location.origin}/api/servicios`,t=await fetch(e);mostrarServicios(await t.json())}catch(e){console.log(e)}}function mostrarServicios(e){e.forEach((e=>{const{id:t,nombre:o,precio:a}=e,n=document.createElement("P");n.classList.add("nombre-servicio"),n.textContent=o;const c=document.createElement("P");c.classList.add("precio-servicio"),c.textContent=`$ ${a}`;const i=document.createElement("DIV");i.classList.add("servicio"),i.dataset.idServicio=t,i.onclick=function(){seleccionarServicio(e)},i.appendChild(n),i.appendChild(c),document.querySelector("#servicios").appendChild(i)}))}function seleccionarServicio(e){const{id:t}=e,{servicios:o}=cita,a=document.querySelector(`[data-id-servicio="${t}"]`);o.some((e=>e.id===t))?(cita.servicios=o.filter((e=>e.id!==t)),a.classList.remove("seleccionado")):(cita.servicios=[...o,e],a.classList.add("seleccionado"))}function idCliente(){cita.id=document.querySelector("#idCliente").value}function nombreCliente(){const e=document.querySelector("#nombre").value;cita.nombre=e}function seleccionarFecha(){document.querySelector("#fecha").addEventListener("input",(function(e){const t=new Date(e.target.value).getUTCDay();[6,0].includes(t)?(e.target.value="",mostrarAlerta("Fines de semanas no abierto","error",".formulario")):cita.fecha=e.target.value}))}function seleccionarHora(){document.querySelector("#hora").addEventListener("input",(function(e){const t=e.target.value.split(":")[0];t<8||t>20?mostrarAlerta("Hora no valida","error",".formulario"):cita.hora=e.target.value}))}function mostrarAlerta(e,t,o,a=!0){const n=document.querySelector(".alerta");n&&n.remove();const c=document.createElement("DIV");c.textContent=e,c.classList.add("alerta"),c.classList.add(t);document.querySelector(o).appendChild(c),a&&setTimeout((()=>{c.remove()}),3e3)}function mostrarResumen(){const e=document.querySelector(".contenido-resumen");for(;e.firstChild;)e.removeChild(e.firstChild);if(Object.values(cita).includes("")||0===cita.servicios.length)return void mostrarAlerta("Faltan datos de servicios, fecha u hora","error",".contenido-resumen",!1);const{nombre:t,fecha:o,hora:a,servicios:n}=cita,c=document.createElement("H3");c.textContent="Resumen de Servicios",e.appendChild(c),n.forEach((t=>{const{id:o,precio:a,nombre:n}=t,c=document.createElement("DIV");c.classList.add("contenedor-servicio");const i=document.createElement("P");i.textContent=n;const r=document.createElement("P");r.innerHTML=`<span>Precio: </span>$ ${a}`,c.appendChild(i),c.appendChild(r),e.appendChild(c)}));const i=document.createElement("H3");i.textContent="Resumen de cita",e.appendChild(i);const r=document.createElement("P");r.innerHTML=`<span>Nombre: </span> ${t}`;const s=new Date(o),d=s.getMonth(),l=s.getDate()+2,u=s.getFullYear(),m=new Date(Date.UTC(u,d,l)).toLocaleDateString("es-MX",{weekday:"long",year:"numeric",month:"long",day:"numeric"}),p=document.createElement("P");p.innerHTML=`<span>Fecha: </span> ${m}`;const v=document.createElement("P");v.innerHTML=`<span>Hora: </span> ${a} hrs`;const h=document.createElement("BUTTON");h.classList.add("boton"),h.textContent="Reservar Cita",h.onclick=reservarCita,e.appendChild(r),e.appendChild(p),e.appendChild(v),e.appendChild(h)}async function reservarCita(){const{id:e,fecha:t,hora:o,servicios:a}=cita,n=a.map((e=>e.id)),c=new FormData;c.append("usuarioId",e),c.append("fecha",t),c.append("hora",o),c.append("servicios",n);try{const e=`${location.origin}/api/citas`,t=await fetch(e,{method:"POST",body:c});await t.json()&&Swal.fire({icon:"success",title:"Cita Creada",text:"Tu cita fue creada correctamente"}).then((()=>{window.location.reload()}))}catch(e){Swal.fire({icon:"error",title:"Oops...",text:"No se pudo crear la cita!"})}}document.addEventListener("DOMContentLoaded",(function(){iniciarApp()}));