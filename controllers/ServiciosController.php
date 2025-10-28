<?php

namespace Controllers;

use MVC\Router;
use Model\Servicio;

class ServiciosController
{
  public static function index(Router $router)
  {
    session_start();

    isAdmin();

    $servicios = Servicio::all();

    $router->render('/servicios/index', [
      'nombre' => $_SESSION['nombre'],
      'servicios' => $servicios
    ]);
  }

  public static function crear(Router $router)
  {
    session_start();
        isAdmin();
    $servicio = new Servicio;
    $alertas = [];

    if ($_SERVER['REQUEST_METHOD'] == 'POST') {
      $servicio->sincronizar($_POST);

      $alertas = $servicio->validar();

      if (empty($alertas)) {
        $servicio->guardar();
        header('Location: /servicios');
      }
    }

    $router->render('/servicios/crear', [
      'nombre' => $_SESSION['nombre'],
      'servicio' => $servicio,
      'alertas' => $alertas
    ]);
  }

  public static function actualizar(Router $router)
  {
    session_start();

      isAdmin();

    if (!is_numeric($_GET['id'])) return; // Valida que el ID sea un número

    $servicio = Servicio::find($_GET['id']);
    $alertas = [];

    if (!$servicio) {
      header('Location: /servicios'); // Si el servicio no existe, redirige
    }

    if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $servicio->sincronizar($_POST);

    $alertas = $servicio->validar();

    if(empty($alertas)){
      $servicio->guardar();
      header('Location:/servicios');
    }
    }

    $router->render('/servicios/actualizar', [
      'nombre' => $_SESSION['nombre'],
      'servicio' => $servicio,
      'alertas' => $alertas
    ]);
  }

  public static function eliminar()
  {
    session_start();
        isAdmin();

    if ($_SERVER['REQUEST_METHOD'] == 'POST') {
      $id = $_POST['id'];
      $servicio = Servicio::find($id);
      $servicio->eliminar();
      header('location:/servicios');
    }
  }
}
