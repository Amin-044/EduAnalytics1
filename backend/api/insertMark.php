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
$subject_id = $data->subject_id;
$internal_1 = $data->internal_1;
$internal_2 = $data->internal_2;
$assignment = $data->assignment;

$sql = "INSERT INTO marks (student_id, subject_id, internal_1, internal_2, assignment)
        VALUES ('$student_id', '$subject_id', '$internal_1', '$internal_2', '$assignment')";

if (mysqli_query($conn, $sql)) {

    echo "Data Inserted Successfully";

} else {

    echo "Database Error: " . mysqli_error($conn);

}

?>
