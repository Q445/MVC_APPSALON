<h1 class="nombre-pagina">Actualizar Servicios</h1>
<p class="descripcion-pagina">Modificar los valores del formulario</p>

<?php
include_once __DIR__ . '/../templates/barras.php';
include_once __DIR__ . '/../templates/alertas.php';
?>


<form method="POST" class="formulario">

  <?php
  include_once __DIR__ . '/formulario.php';
  ?>

  <input type="submit" class="boton" value="Guardar servicios">
</form>
