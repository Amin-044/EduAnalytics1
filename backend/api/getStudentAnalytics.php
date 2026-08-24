<?php

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");

include "db.php";

$id = $_GET['id'];

$sql = "SELECT * FROM students WHERE id=$id";
$student = mysqli_fetch_assoc(mysqli_query($conn, $sql));

if (!$student) {
    http_response_code(404);
    echo json_encode(["message" => "Student not found"]);
    exit;
}

// all subjects with this student's marks and attendance (null if not entered yet)
$subjects = [];
$result = mysqli_query($conn, "SELECT * FROM subjects ORDER BY id");

while ($sub = mysqli_fetch_assoc($result)) {

    $marksSql = "SELECT * FROM marks WHERE student_id=$id AND subject_id=" . $sub['id'];
    $mark = mysqli_fetch_assoc(mysqli_query($conn, $marksSql));

    $attSql = "SELECT * FROM attendance WHERE student_id=$id AND subject_id=" . $sub['id'];
    $att = mysqli_fetch_assoc(mysqli_query($conn, $attSql));

    $avgMarks = null;
    if ($mark) {
        $avgMarks = round(($mark['internal_1'] + $mark['internal_2'] + $mark['assignment']) / 3, 2);
    }

    $attendancePct = null;
    if ($att && $att['total_classes'] > 0) {
        $attendancePct = round(($att['present_classes'] / $att['total_classes']) * 100, 2);
    }

    $subjects[] = [
        "id" => $sub['id'],
        "code" => $sub['code'],
        "name" => $sub['name'],
        "marks" => $avgMarks,
        "attendance" => $attendancePct
    ];
}

// overall averages (only count subjects that have data)
$marksSum = 0;
$marksCount = 0;
$attSum = 0;
$attCount = 0;

foreach ($subjects as $row) {
    if ($row['marks'] !== null) {
        $marksSum += $row['marks'];
        $marksCount++;
    }
    if ($row['attendance'] !== null) {
        $attSum += $row['attendance'];
        $attCount++;
    }
}

$averageMarks = $marksCount > 0 ? round($marksSum / $marksCount, 2) : 0;
$averageAttendance = $attCount > 0 ? round($attSum / $attCount, 2) : 0;

echo json_encode([
    "student" => [
        "id" => (int)$student['id'],
        "student_id" => $student['student_id'],
        "name" => $student['name'],
        "email" => $student['email'],
        "phone" => $student['phone'],
        "course" => $student['course'],
        "semester" => (int)$student['semester']
    ],
    "averageMarks" => $averageMarks,
    "performance" => $averageMarks >= 75 ? "Excellent" : ($averageMarks >= 60 ? "Good" : ($averageMarks >= 40 ? "Needs Improvement" : "Poor")),
    "averageAttendance" => $averageAttendance,
    "attendanceStatus" => $averageAttendance >= 75 ? "Good" : "Low",
    "subjects" => $subjects
]);

?>
