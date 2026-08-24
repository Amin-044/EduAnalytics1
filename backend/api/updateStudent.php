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
$student_id = $data->student_id;
$name = $data->name;
$email = $data->email;
$phone = $data->phone;
$course = $data->course;
$semester = $data->semester;

$sql = "UPDATE students SET student_id='$student_id', name='$name', email='$email', phone='$phone', course='$course', semester='$semester' WHERE id=$id";

if (mysqli_query($conn, $sql)) {

    echo "Data Updated Successfully";

} else {

    echo "Database Error: " . mysqli_error($conn);

}

?>
