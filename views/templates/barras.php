<div class="barra">
  <p>Hola: <?php
  echo $nombre ?? ''; ?> </p>
  <a class="boton" href="/logout">Cerrar Sesión</a>
</div>

<?php
if (isset($_SESSION['admin'])) { ?>
  <div class="barra-servicio">
    <a class="boton" href="/admin">Ver servicios</a>
    <a class="boton" href="/servicios">Ver Citas</a>
    <a class="boton" href="/servicios/crear">Nuevo Servicio</a>
  </div>
<?php }

?>