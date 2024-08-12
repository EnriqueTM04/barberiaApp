<?php

function debuguear($variable) : string {
    echo "<pre>";
    var_dump($variable);
    echo "</pre>";
    exit;
}

// Escapa / Sanitizar el HTML
function s($html) : string {
    $s = htmlspecialchars($html);
    return $s;
}

function esUltimo(string $actual, string $proximo): bool {
    if($actual !== $proximo) {
        $resultado = true;
    } else {
        $resultado = false;
    }

    return $resultado;
}

// Funcion que revisa que el usuario este autenticado
function isAuth(): void {
    if(!isset($_SESSION['login'])) {
        header('Location: /');
    }
}

// Funcion que revisa si el usuario es admin
function isAdmin(): void {
    if(!isset($_SESSION['admin'])) {
        header('Location: /');
    }
}