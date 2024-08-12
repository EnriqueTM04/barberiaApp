<h1 class="nombre-pagina">Login</h1>

<p class="descripcion-pagina">Inicia sesión con tus datos</p>

<?php include_once __DIR__ . '/../templates/alertas.php'; ?>

<form class="formulario" action="/" method="POST">
    <div class="campo">
        <label for="email">Correo</label>
        <input 
            type="email"
            id="email"        
            placeholder="Tu email"
            name="email"
        >
    </div>

    <div class="campo">
        <label for="password">Contraseña</label>
        <input 
            type="password"
            id="password"
            placeholder="Contraseña de 8 caracteres"
            name="password"
        >
    </div>

    <input type="submit" class="boton" value="Iniciar Sesión">
</form>

<div class="acciones">
    <a href="/crear-cuenta">¿Aún no tienes una cuenta? Crear una</a>
    <a href="/forgot">¿Olvidaste tu contraseña?</a>
</div>