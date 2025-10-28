<?php

namespace Controllers;

use Model\Cita;
use Model\CitaServicio;
use Model\Servicio;

class ApiController
{
  public static function index()
  {
    $servicios = Servicio::all();
    echo json_encode($servicios);
  }

  public static function guardar()
  {
    //Almacena la cita y devuelve el ID
    $cita = new Cita($_POST);
    $resultado = $cita->guardar();

    $id = $resultado['id'];


    //Almacena los servicios con el iD de la cita
    $idServicios = explode(",", $_POST['servicios']);
    foreach ($idServicios as $idServicio) {
      $args = [
        'citadId' => $id,
        'servicioId' => $idServicio
      ];
      $citaServicio = new CitaServicio($args);
      $citaServicio->guardar();
    }
    //retornamos una respuesta:
    $respuesta = [
      'resultado' => $idServicios
    ];

    echo json_encode(['resultado' => $resultado]);
  }

  public static function eliminar()
  {
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
      $id = $_POST['id'];
      $cita = Cita::find($id);
      $cita->eliminar();

      header('Location:' . $_SERVER['HTTP_REFERER']);
    }
  }
}
