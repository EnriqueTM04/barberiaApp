<?php

namespace Model;

class Usuario extends ActiveRecord {
    // Base de datos
    protected static $tabla = 'usuarios';
    protected static $columnasDB = ['id', 'nombre', 'apellido', 'email', 'password', 'telefono', 'admin', 'confirmado', 'token'];
    
    public $nombre;
    public $apellido;
    public $email;
    public $password;
    public $password2;
    public $telefono;
    public $admin;
    public $confirmado;
    public $token;

    public function __construct($args = []) {
        $this->id = $args['id'] ?? null;
        $this->nombre = $args['nombre'] ?? '';
        $this->apellido = $args['apellido'] ?? '';
        $this->email = $args['email'] ?? '';
        $this->password = $args['password'] ?? '';
        $this->telefono = $args['telefono'] ?? '';
        $this->admin = $args['admin'] ?? 0;
        $this->confirmado = $args['confirmado'] ?? 0;
        $this->token = $args['token'] ?? '';
    }

    // Mensajes de validacion de creacion de errores
    public function validarNuevaCuenta(): array {
        if(!$this->nombre) {
            self::$alertas['error'][] = 'El nombre es Obligatorio';
        }

        if(!$this->apellido) {
            self::$alertas['error'][] = 'El apellido es Obligatorio';
        }

        if(!$this->email) {
            self::$alertas['error'][] = 'El correo es Obligatorio';
        }

        if(!$this->password) {
            self::$alertas['error'][] = 'Escriba una contraseña';
        }

        if(strlen($this->password) < 6 && strlen($this->password) >0) {
            self::$alertas['error'][] = 'La contraseña debe contener al menos 6 caracteres';
        }

        if($this->password !== $this->password2) {
            self::$alertas['error'][] = 'Las contraseñas deben coincidir';
        }

        return self::$alertas;
    }

    public function existeUsuario() {
        $query = "SELECT * FROM " . self::$tabla . " WHERE email = '" . $this->email . "' LIMIT 1";

        $resultado = self::$db->query($query);

        if($resultado->num_rows) {
            self::$alertas['error'][] = 'El usuario ya esta registrado';
        }

        return $resultado;
    }

    public function hashPassword() {
        $this->password = password_hash($this->password, PASSWORD_BCRYPT);
    }

    public function crearToken() {
        $this->token = uniqid();
    }

    public function validarLogin(): array {
        if(!$this->email) {
            self::$alertas['error'][] = 'El email es Obligatorio';
        }

        if(!$this->password) {
            self::$alertas['error'][] = 'La contraseña es Obligatoria';
        }

        return self::$alertas;
    }

    public function validarEmail() {
        if(!$this->email) {
            self::$alertas['error'][] = 'El correo es obligatorio';
        }

        return self::$alertas;
    }

    public function validarPassword() {
        if(!$this->password) {
            self::$alertas['error'][] = 'La contraseña es obligatoria';
        }

        if(strlen($this->password) < 6) {
            self::$alertas['error'][] = 'La contraseña debe contener al menos 6 caracteres';
        }

        return self::$alertas;
    }

    public function comprobarPassword($password) {
        $resultado = password_verify($password, $this->password);

        if(!$resultado || !$this->confirmado) {
            self::$alertas['error'][] = 'Password incorrecto o cuenta no confirmada';
            
        } else {
            return true;
        }
    }
}

?>