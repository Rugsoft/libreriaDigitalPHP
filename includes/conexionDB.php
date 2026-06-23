<?php

// Parámetros de configuración de la conexión (locales de XAMPP)
$servidor   = "localhost";  // Servidor local
$usuario    = "root";       // Usuario administrador por defecto en XAMPP
$password   = "";           // Contraseña por defecto vacía en XAMPP
$base_datos = "biblioteca"; // Nombre de la base de datos

// Intentar establecer la conexión
$conn = mysqli_connect($servidor, $usuario, $password, $base_datos);

// Validar la conexión
if (!$conn) {
    // Si falla, detiene el script mostrando un mensaje personalizado
    die("Error crítico: No se pudo conectar a la base de datos: " . mysqli_connect_error());
}

?>