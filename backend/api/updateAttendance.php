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
$total_classes = $data->total_classes;
$present_classes = $data->present_classes;

$sql = "UPDATE attendance SET student_id='$student_id', subject_id='$subject_id', total_classes='$total_classes', present_classes='$present_classes' WHERE id=$id";

if (mysqli_query($conn, $sql)) {

    echo "Data Updated Successfully";

} else {

    echo "Database Error: " . mysqli_error($conn);

}

?>
