<?php

namespace Classes;

use PHPMailer\PHPMailer\PHPMailer;

class Email
{

  public $nombre;
  public $email;
  public $token;

  public function __construct($nombre, $email, $token)
  {
    $this->email = $email;
    $this->nombre = $nombre;
    $this->token = $token;
  }

  public function enviarConfirmacion()
  {
    //crear el objeto email
    $mail = new PHPMailer();
    $mail->isSMTP();
    $mail->Host = $_ENV['EMAIL_HOST'];
    $mail->SMTPAuth = true;
    $mail->Port = $_ENV['EMAIL_PORT'];
    $mail->Username = $_ENV['EMAIL_USER'];
    $mail->Password = $_ENV['EMAIL_PASS'];

    $mail->setFrom('cuentas@appsalon.com');
    $mail->addAddress('cuentas@appsalon.com', 'AppSalon.com');
    $mail->Subject = 'Confirma tu cuenta';

    $mail->isHTML(TRUE);
    $mail->CharSet = 'UTF-8';

    $contenido = '<html>';
    $contenido .= "<p><strong>Hola " . $this->nombre . "</strong> Has Creado tu cuenta en App Salón, solo debes confirmarla presionando el siguiente enlace</p>";
    $contenido .= "<p>Presiona aquí: <a href='" . $_ENV['APP_URL'] . "/confirmar-cuenta?token=" . $this->token . "'> Confirmar Cuenta</a>";
    $contenido .= "<p>Si tu no solicitaste este cambio, puedes ignorar el mensaje</p>";
    $contenido .= '</html>';
    $mail->Body = $contenido;

    //Enviar el mail
    $mail->send();
  }

  public function enviarInstrucciones()
  {
    //crear el objeto email
    $mail = new PHPMailer();
    $mail->isSMTP();
    $mail->Host = $_ENV['EMAIL_HOST'];
    $mail->SMTPAuth = true;
    $mail->Port = $_ENV['EMAIL_PORT'];
    $mail->Username = $_ENV['EMAIL_USER'];
    $mail->Password = $_ENV['EMAIL_PASS'];

    $mail->setFrom('cuentas@appsalon.com');
    $mail->addAddress('cuentas@appsalon.com', 'AppSalon.com');
    $mail->Subject = 'Restablece tu password';

    $mail->isHTML(TRUE);
    $mail->CharSet = 'UTF-8';

    $contenido = '<html>';
    $contenido .= "<p><strong>Hola " . $this->nombre . "</strong> Has solicitado restablecer tu password, sigue el siguiente enlace para hacerlo </p>";
    $contenido .= "<p>Presiona aquí: <a href='" . $_ENV['APP_URL'] . "/recuperar?token=" . $this->token . "'>Restablecer Password</a>";
    $contenido .= "<p>Si tu no solicitaste este cambio, puedes ignorar el mensaje</p>";
    $contenido .= '</html>';
    $mail->Body = $contenido;

    //Enviar el mail
    $mail->send();
  }
}

