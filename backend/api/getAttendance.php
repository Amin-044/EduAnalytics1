<?php

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");

include "db.php";

$sql = "SELECT a.*, s.name AS student_name, sub.code AS subject_code, sub.name AS subject_name
        FROM attendance a
        JOIN students s ON s.id = a.student_id
        JOIN subjects sub ON sub.id = a.subject_id";

$result = mysqli_query($conn, $sql);

$attendance = [];

while ($row = mysqli_fetch_assoc($result)) {
    $attendance[] = $row;
}

echo json_encode($attendance);

?>
