<?php

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit;
}

include "db.php";

$data = json_decode(file_get_contents("php://input"));

$student_id = $data->student_id;
$name = $data->name;
$email = $data->email;
$phone = $data->phone;
$course = $data->course;
$semester = $data->semester;

$sql = "INSERT INTO students (student_id, name, email, phone, course, semester)
        VALUES ('$student_id', '$name', '$email', '$phone', '$course', '$semester')";

if (mysqli_query($conn, $sql)) {

    echo "Data Inserted Successfully";

} else {

    echo "Database Error: " . mysqli_error($conn);

}

?>
