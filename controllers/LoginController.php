<?php

namespace Controllers;

use Classes\Email;
use Model\Usuario;
use MVC\Router;

class LoginController {

    public static function login(Router $router) {

        $alertas = [];
        
        if($_SERVER['REQUEST_METHOD'] === 'POST') {
            $auth = new Usuario($_POST);
            
            $alertas = $auth->validarLogin();

            if(empty($alertas)) {
                // Comprobar si existe
                $usuario = Usuario::where('email', $auth->email);

                if($usuario) {
                    // Verificar password
                    if($usuario->comprobarPassword($auth->password)) {
                        $_SESSION['id'] = $usuario->id;
                        $_SESSION['nombre'] = $usuario->nombre . " " . $usuario->apellido;
                        $_SESSION['email'] = $usuario->email;
                        $_SESSION['login'] = true;

                        // Redireccionamiento
                        if($usuario->admin === '1') {
                            $_SESSION['admin'] = $usuario->admin ?? null;
                            header('Location: /admin');
                        } else {
                            header('Location: /cita');
                        }
                    }


                } else {
                    Usuario::setAlerta('error', 'Usuario no encontrado');
                }

                $alertas = Usuario::getAlertas();
            }
        }

        $router->render('auth/login', [
            'alertas' => $alertas
        ]);
    }

    public static function logout() {
        $_SESSION = [];

        header('Location: /');
    }

    public static function forgot(Router $router) {

        $alertas = [];

        if($_SERVER['REQUEST_METHOD'] === 'POST') {
            $auth = new Usuario($_POST);

            $alertas = $auth->validarEmail();

            if(empty($alertas)) {
                $usuario = Usuario::where('email', $auth->email);

                if($usuario && $usuario->confirmado === '1') {

                    // Generar token
                    $usuario->crearToken();
                    $usuario->guardar();

                    $email = new Email($usuario->email, $usuario->nombre, $usuario->token);

                    $email->enviarInstrucciones();

                    Usuario::setAlerta('exito', 'Las intrucciones se enviaron a tu correo');

                } else {
                    Usuario::setAlerta('error', 'El usuario no existe o no esta confirmado');
                }
            }

            $alertas = Usuario::getAlertas();
        }
        
        $router->render('auth/forgot-password', [
            'alertas' => $alertas
        ]);
    }

    public static function recuperar(Router $router) {
        
        $alertas = [];
        $error = false;

        $token = s($_GET['token']);

        // Buscar usuario por token
        $usuario = Usuario::where('token', $token);

        if(empty($usuario)) {
            Usuario::setAlerta('error', 'Token no valido');
            $error = true;
        }

        if($_SERVER['REQUEST_METHOD'] === 'POST') {
            // Leer password y guardar
            $password = new Usuario($_POST);

            $alertas = $password->validarPassword();


            if(empty($alertas)) {
                $usuario->password = null;
                $usuario->password = $password->password;
                $usuario->hashPassword();
                $usuario->token = null;

                $resultado = $usuario->guardar();
                if($resultado) {
                    header('Location: /');
                }
            }
        }

        $alertas = Usuario::getAlertas();
        
        $router->render('auth/recuperar-password', [
            'alertas' => $alertas,
            'error' => $error
        ]);
    }

    public static function crear(Router $router) {
        $usuario = new Usuario;

        $alertas = [];

        if($_SERVER['REQUEST_METHOD']  === 'POST') {
            
            $usuario->sincronizar($_POST);
            $alertas = $usuario->validarNuevaCuenta();

            // Revisar que alertas este vacio
            if(empty($alertas)) {
                $resultado = $usuario->existeUsuario();

                if($resultado->num_rows) {
                    $alertas = Usuario::getAlertas();
                }
                else {
                    // Hashear password
                    $usuario->hashPassword();

                    // Generar token unico
                    $usuario->crearToken();

                    // Enviar email
                    $email = new Email($usuario->email, $usuario->nombre, $usuario->token);

                    $email->enviarConfirmacion();

                    // Crear el Usuario
                    $resultado =  $usuario->guardar();

                    if($resultado) {
                        header('Location: /mensaje');
                    }

                }
            }
        }
        
        $router->render('auth/crear-cuenta', [
            'usuario' => $usuario,
            'alertas' => $alertas
        ]);
    }

    public static function mensaje(Router $router) {
        $router->render('auth/mensaje');
    }

    public static function confirmar(Router $router) {
        $alertas = [];

        $token = s($_GET['token']);

        $usuario = Usuario::where('token', $token);

        if(empty($usuario)) {
            // Mostrar mensaje de error
            Usuario::setAlerta('error', 'Token no válido');

        }

        else {
            // Modificar usuario confirmado

            $usuario->confirmado = "1";
            $usuario->token = null;
            
            $usuario->guardar();
            
            Usuario::setAlerta('exito', 'Cuenta activada exitosamente');
        }

        $alertas = Usuario::getAlertas();

        $router->render('auth/confirmar-cuenta', [
            'alertas' => $alertas
        ]);
    }

}

?>