<?php

namespace Model;

class Servicio extends ActiveRecord
{
  //base de datos 
  protected static $tabla = 'servicios';
  protected static $columnasDB = ['id', 'nombre', 'precio'];

  public $id;
  public $nombre;
  public $precio;

  public function __construct($args = [])
  {
    $this->id = $args['id'] ?? null;
    $this->nombre = $args['nombre'] ?? '';
    $this->precio = $args['precio'] ?? '';
  }

  public function validar()
  {
    if (!$this->nombre) {
      self::$alertas['error'][] = 'El nombre del servicio es obligatorio';
    }

    // Asumiendo que 'precio' es un DECIMAL(5,2) en la base de datos
    if (!is_numeric($this->precio)) {
      self::$alertas['error'][] = 'El precio no es válido y debe ser un número positivo';
    }
    return self::$alertas;
  }
}