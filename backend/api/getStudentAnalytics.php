<?php

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");

include "db.php";

$id = (int)$_GET['id'];

$sql = "SELECT * FROM students WHERE id=$id";
$student = mysqli_fetch_assoc(mysqli_query($conn, $sql));

if (!$student) {
    http_response_code(404);
    echo json_encode(["message" => "Student not found"]);
    exit;
}

// one query fetches every subject plus this student's marks and attendance (null if not entered yet)
$sql = "SELECT sub.id, sub.code, sub.name,
               m.internal_1, m.internal_2, m.assignment,
               a.total_classes, a.present_classes
        FROM subjects sub
        LEFT JOIN marks m ON m.subject_id = sub.id AND m.student_id = $id
        LEFT JOIN attendance a ON a.subject_id = sub.id AND a.student_id = $id
        ORDER BY sub.id";

$subjects = [];

$result = mysqli_query($conn, $sql);
while ($row = mysqli_fetch_assoc($result)) {

    $avgMarks = null;
    if ($row['internal_1'] !== null) {
        $avgMarks = round(($row['internal_1'] + $row['internal_2'] + $row['assignment']) / 3, 2);
    }

    $attendancePct = null;
    if ($row['total_classes'] !== null && $row['total_classes'] > 0) {
        $attendancePct = round(($row['present_classes'] / $row['total_classes']) * 100, 2);
    }

    $subjects[] = [
        "id" => $row['id'],
        "code" => $row['code'],
        "name" => $row['name'],
        "marks" => $avgMarks,
        "attendance" => $attendancePct
    ];
}

// overall averages (only count subjects that have data)
$averageMarks = 0;
$row = mysqli_fetch_row(mysqli_query($conn, "SELECT AVG((internal_1 + internal_2 + assignment) / 3) FROM marks WHERE student_id = $id"));
if ($row[0] !== null) {
    $averageMarks = round((float)$row[0], 2);
}

$averageAttendance = 0;
$row = mysqli_fetch_row(mysqli_query($conn, "SELECT AVG(present_classes / total_classes * 100) FROM attendance WHERE student_id = $id AND total_classes > 0"));
if ($row[0] !== null) {
    $averageAttendance = round((float)$row[0], 2);
}

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