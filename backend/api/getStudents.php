<?php

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");

include "db.php";

$sql = "SELECT * FROM students";

if (isset($_GET['search'])) {
    $search = $_GET['search'];
    $sql .= " WHERE name LIKE '%$search%' OR student_id LIKE '%$search%' OR email LIKE '%$search%' OR course LIKE '%$search%'";
}

$result = mysqli_query($conn, $sql);

$students = [];

while ($row = mysqli_fetch_assoc($result)) {
    $students[] = $row;
}

echo json_encode($students);

?>
