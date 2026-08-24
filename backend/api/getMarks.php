<?php

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");

include "db.php";

$sql = "SELECT m.*, s.name AS student_name, sub.code AS subject_code, sub.name AS subject_name
        FROM marks m
        JOIN students s ON s.id = m.student_id
        JOIN subjects sub ON sub.id = m.subject_id";

$result = mysqli_query($conn, $sql);

$marks = [];

while ($row = mysqli_fetch_assoc($result)) {
    $marks[] = $row;
}

echo json_encode($marks);

?>
