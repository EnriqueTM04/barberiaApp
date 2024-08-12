<h1 class="nombre-pagina">Nuevo Servicio</h1>
<p class="descripcion-pagina">Llena los campos para agregar servicios</p>

<?php 
    include_once __DIR__ . '/../templates/barra.php'; 
    include_once __DIR__ . '/../templates/alertas.php'; 
?>

<form action="/servicios/crear" class="formulario" method="POST">
    <?php include_once __DIR__ . '/formulario.php'; ?>

    <input type="submit" class="boton" value="Guardar Servicio">
</form>