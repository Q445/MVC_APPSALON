<h1 class="nombre-pagina">Login</h1>
<p class="descripcion-pagina">Inicia sesión con tus datos</p>

<?php
include_once __DIR__ . "/../templates/alertas.php";
?>

<form class="fomulario" method="POST" action="/">
  <div class="campo">
    <label for="email">Email</label>
    <input
      type="email"
      id="email"
      placeholder="Escribe tu email por favor"
      name="email"
      value="<?php echo s($auth->email); ?>" />
  </div>

  <div class="campo">
    <label for="password">Password</label>
    <input
      type="password"
      id="password"
      placeholder="Escribe tu contraseña por favor"
      name="password" />
  </div>

  <input type="submit" class="boton" value="Iniciar Sesión">
</form>

<div class="acciones">
  <a href="/crear-cuenta">¿Aun no tienes una cuenta? Crear una</a>
  <a href="/olvide">¿Olvidaste el Password?</a>
</div>
