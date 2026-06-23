<?php
declare(strict_types=1);

require_once __DIR__ . '/conexionDB.php';

// Verificar que se haya pasado el ISBN por la URL (GET)
if (isset($_GET['ISBN'])) {
    $isbn = intval($_GET['ISBN']);
    
    if ($isbn > 0) {
        // Ejecutar eliminación segura mediante consulta preparada
        $query = "DELETE FROM libros WHERE ISBN = ?";
        $stmt = mysqli_prepare($conn, $query);
        
        if ($stmt) {
            mysqli_stmt_bind_param($stmt, "i", $isbn);
            
            if (mysqli_stmt_execute($stmt)) {
                mysqli_stmt_close($stmt);
                // Éxito al eliminar
                header("Location: ../index.php?status=success_delete");
                exit;
            }
            mysqli_stmt_close($stmt);
        }
    }
}

// Redireccionar con error si falla
header("Location: ../index.php?status=error_delete");
exit;
