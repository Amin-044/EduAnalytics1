<?php

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit;
}

include "db.php";

$data = json_decode(file_get_contents("php://input"));

$id = $data->id;
$code = $data->code;
$name = $data->name;

$sql = "UPDATE subjects SET code='$code', name='$name' WHERE id=$id";

if (mysqli_query($conn, $sql)) {

    echo "Data Updated Successfully";

} else {

    echo "Database Error: " . mysqli_error($conn);

}

?>
