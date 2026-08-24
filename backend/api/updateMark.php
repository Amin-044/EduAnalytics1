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
$subject_id = $data->subject_id;
$internal_1 = $data->internal_1;
$internal_2 = $data->internal_2;
$assignment = $data->assignment;

$sql = "UPDATE marks SET student_id='$student_id', subject_id='$subject_id', internal_1='$internal_1', internal_2='$internal_2', assignment='$assignment' WHERE id=$id";

if (mysqli_query($conn, $sql)) {

    echo "Data Updated Successfully";

} else {

    echo "Database Error: " . mysqli_error($conn);

}

?>
