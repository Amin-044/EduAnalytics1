<?php

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");

include "db.php";

// stat card counts
$totalStudents = (int)mysqli_fetch_row(mysqli_query($conn, "SELECT COUNT(*) FROM students"))[0];
$totalSubjects = (int)mysqli_fetch_row(mysqli_query($conn, "SELECT COUNT(*) FROM subjects"))[0];

// overall averages for stat cards
$row = mysqli_fetch_row(mysqli_query($conn, "SELECT COALESCE(AVG((internal_1 + internal_2 + assignment) / 3), 0) FROM marks"));
$averageMarks = round((float)$row[0], 2);

$row = mysqli_fetch_row(mysqli_query($conn, "SELECT COALESCE(AVG(CASE WHEN total_classes = 0 THEN 0 ELSE present_classes / total_classes * 100 END), 0) FROM attendance"));
$averageAttendance = round((float)$row[0], 2);

// average marks per subject (for chart 1)
$subjectAverages = [];
$result = mysqli_query($conn, "SELECT sub.code, AVG((m.internal_1 + m.internal_2 + m.assignment) / 3) AS average
                               FROM subjects sub
                               LEFT JOIN marks m ON m.subject_id = sub.id
                               GROUP BY sub.id, sub.code
                               ORDER BY sub.id");

while ($row = mysqli_fetch_assoc($result)) {
    $subjectAverages[] = [
        "subject" => $row['code'],
        "average" => round((float)$row['average'], 2)
    ];
}

// good vs low attendance count (for chart 2), >=75% is Good
$row = mysqli_fetch_assoc(mysqli_query($conn, "SELECT
    SUM(CASE WHEN total_classes > 0 AND present_classes / total_classes * 100 >= 75 THEN 1 ELSE 0 END) AS good,
    SUM(CASE WHEN total_classes = 0 OR present_classes / total_classes * 100 < 75 THEN 1 ELSE 0 END) AS low
    FROM attendance"));

$attendanceDist = ["good" => (int)$row['good'], "low" => (int)$row['low']];

// average marks per student (for chart 3)
$studentAverages = [];
$result = mysqli_query($conn, "SELECT SUBSTRING_INDEX(s.name, ' ', 1) AS name, AVG((m.internal_1 + m.internal_2 + m.assignment) / 3) AS average
                               FROM students s
                               LEFT JOIN marks m ON m.student_id = s.id
                               GROUP BY s.id, s.name
                               ORDER BY s.id");

while ($row = mysqli_fetch_assoc($result)) {
    $studentAverages[] = [
        "name" => $row['name'],
        "average" => round((float)$row['average'], 2)
    ];
}

echo json_encode([
    "totalStudents" => $totalStudents,
    "totalSubjects" => $totalSubjects,
    "averageMarks" => $averageMarks,
    "averageAttendance" => $averageAttendance,
    "subjectAverages" => $subjectAverages,
    "attendanceDist" => $attendanceDist,
    "studentAverages" => $studentAverages
]);

?>