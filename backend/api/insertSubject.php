<?php

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit;
}

include "db.php";

$data = json_decode(file_get_contents("php://input"));

$code = $data->code;
$name = $data->name;

$sql = "INSERT INTO subjects (code, name)
        VALUES ('$code', '$name')";

if (mysqli_query($conn, $sql)) {

    echo "Data Inserted Successfully";

} else {

    echo "Database Error: " . mysqli_error($conn);

}

?>
