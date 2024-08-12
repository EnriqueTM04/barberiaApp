<?php

namespace Controllers;

use Model\Servicio;
use MVC\Router;

class ServicioController {

    public static function index(Router $router) {

        isAdmin();

        $alertas = [];

        if(isset($_GET['exito'])) {
            if($_GET['exito'] == 1) {
                $alertas['exito'][] = 'Se guardo el servicio correctamente';
            }
            else if($_GET['exito'] == 2) {
                $alertas['exito'][] = 'Se actualizo el servicio correctamente';
            }
            else if($_GET['exito'] == 3) {
                $alertas['exito'][] = 'Se elimino el servicio exitosamente';
            }
        }

        $servicios = Servicio::all();

        $router->render('services/index', [
            'nombre' => $_SESSION['nombre'],
            'alertas' => $alertas,
            'servicios' =>$servicios
        ]);
    }

    public static function crear(Router $router) {

        isAdmin();

        $servicio = new Servicio;
        $alertas = [];        

        if($_SERVER['REQUEST_METHOD'] === 'POST') {
            $servicio->sincronizar($_POST);
            $alertas =  $servicio->validar();

            $alertas = Servicio::getAlertas();

            if(empty($alertas)) {
                $servicio->guardar();
                header('Location: /servicios?exito=1');
            }
        }

        $router->render('services/crear', [
            'nombre' => $_SESSION['nombre'],
            'servicio' => $servicio,
            'alertas' => $alertas
        ]);
    }

    public static function actualizar(Router $router) {

        isAdmin();

        $id = is_numeric($_GET['id']);
        if(!$id) return;
        $servicio = Servicio::find($_GET['id']);
        $alertas = [];   

        if($_SERVER['REQUEST_METHOD'] === 'POST') {
            $servicio->sincronizar($_POST);
            $alertas = $servicio->validar();

            if(empty($alertas)) {
                $servicio->guardar();
                header('Location: /servicios?exito=2');
            }
        }

        $router->render('services/actualizar', [
            'nombre' => $_SESSION['nombre'],
            'servicio' => $servicio,
            'alertas' => $alertas
        ]);
    }

    public static function eliminar() {

        isAdmin();
        
        if($_SERVER['REQUEST_METHOD'] === 'POST') {
            
            if(is_numeric($_POST['id'])) {
                $id = $_POST['id'];
                $servicio = Servicio::find($id);
                $servicio->eliminar();
                header('Location: /servicios?exito=3');
            }
        }
    }
}

?>