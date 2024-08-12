<h1 class="nombre-pagina">Crear Cuenta</h1>

<p class="descripcion-pagina">Llena el siguiente formulario para crear una cuenta</p>

<?php
include_once __DIR__ . "/../templates/alertas.php";
?>

<form action="/crear-cuenta" class="formulario" method="POST">
    <div class="campo">
        <label for="nombre">Nombre</label>
        <input 
            type="text" 
            name="nombre" 
            id="nombre"
            placeholder="Tu nombre"
            value="<?php echo s($usuario->nombre); ?>"
        >
    </div>

    <div class="campo">
        <label for="apellido">Apellido</label>
        <input 
            type="text" 
            name="apellido" 
            id="apellido"
            placeholder="Tu apellido"
            value="<?php echo s($usuario->apellido); ?>"
        >
    </div>

    <div class="campo">
        <label for="apellido">Teléfono</label>
        <input 
            type="tel" 
            name="telefono" 
            id="telefono"
            placeholder="Tu teléfono de contacto"
            value="<?php echo s($usuario->telefono); ?>"
        >
    </div>

    <div class="campo">
        <label for="email">Correo</label>
        <input 
            type="email" 
            name="email" 
            id="email"
            placeholder="Tu E-mail"
            value="<?php echo s($usuario->email); ?>"
        >
    </div>

    <div class="campo">
        <label for="password">Contraseña</label>
        <input 
            type="password" 
            name="password" 
            id="password"
            placeholder="Tu contraseña"
        >
    </div>

    <div class="campo">
        <label for="password">Repite la contraseña</label>
        <input 
            type="password" 
            name="password2" 
            id="password2"
            placeholder="Repite la contraseña"
        >
    </div>

    <input type="submit" value="Crear Cuenta" class="boton">
</form>

<div class="acciones">
    <a href="/">¿Ya tienes una cuenta? INICIA SESION</a>
    <a href="/forgot">¿Olvidaste tu contraseña?</a>
</div>