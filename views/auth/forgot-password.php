<h1 class="nombre-pagina">Olvide la Contraseña</h1>

<p class="descripcion-pagina">Reestablece tu contraseña escribiendo tu email</p>

<?php
include_once __DIR__ . "/../templates/alertas.php";
?>

<form action="/forgot" class="formulario" method="POST">
    <div class="campo">
        <label for="email">Correo</label>
        <input 
            type="email"
            id="email"
            name="email"
            placeholder="Tu correo"
        >
    </div>

    <input type="submit" class="boton" value="Enviar Instrucciones">
</form>

<div class="acciones">
    <a href="/crear-cuenta">¿Aún no tienes una cuenta? Crear una</a>
    <a href="/">Inicia Sesión</a>
</div>