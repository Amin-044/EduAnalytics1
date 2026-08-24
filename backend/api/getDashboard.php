<?php

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");

include "db.php";

$students = [];
$result = mysqli_query($conn, "SELECT * FROM students");
while ($row = mysqli_fetch_assoc($result)) {
    $students[] = $row;
}

$subjects = [];
$result = mysqli_query($conn, "SELECT * FROM subjects");
while ($row = mysqli_fetch_assoc($result)) {
    $subjects[] = $row;
}

$marks = [];
$result = mysqli_query($conn, "SELECT * FROM marks");
while ($row = mysqli_fetch_assoc($result)) {
    $marks[] = $row;
}

$attendance = [];
$result = mysqli_query($conn, "SELECT * FROM attendance");
while ($row = mysqli_fetch_assoc($result)) {
    $attendance[] = $row;
}

// average marks of one marks row = (internal_1 + internal_2 + assignment) / 3
function calcAverage($m)
{
    return ($m['internal_1'] + $m['internal_2'] + $m['assignment']) / 3;
}

// attendance % = present / total * 100
function calcPercentage($a)
{
    if ($a['total_classes'] == 0) return 0;
    return ($a['present_classes'] / $a['total_classes']) * 100;
}

// average marks per subject (for chart 1)
$subjectAverages = [];
foreach ($subjects as $sub) {
    $sum = 0;
    $count = 0;
    foreach ($marks as $m) {
        if ($m['subject_id'] == $sub['id']) {
            $sum += calcAverage($m);
            $count++;
        }
    }
    $avg = $count > 0 ? $sum / $count : 0;
    $subjectAverages[] = [
        "subject" => $sub['code'],
        "average" => round($avg, 2)
    ];
}

// good vs low attendance count (for chart 2), >=75% is Good
$goodCount = 0;
$lowCount = 0;
foreach ($attendance as $a) {
    if (calcPercentage($a) >= 75) {
        $goodCount++;
    } else {
        $lowCount++;
    }
}
$attendanceDist = ["good" => $goodCount, "low" => $lowCount];

// average marks per student (for chart 3)
$studentAverages = [];
foreach ($students as $s) {
    $sum = 0;
    $count = 0;
    foreach ($marks as $m) {
        if ($m['student_id'] == $s['id']) {
            $sum += calcAverage($m);
            $count++;
        }
    }
    $avg = $count > 0 ? $sum / $count : 0;
    $namePart = explode(" ", $s['name'])[0];
    $studentAverages[] = [
        "name" => $namePart,
        "average" => round($avg, 2)
    ];
}

// overall averages for stat cards
$totalMarksSum = 0;
foreach ($marks as $m) {
    $totalMarksSum += calcAverage($m);
}
$overallAvgMarks = count($marks) > 0 ? $totalMarksSum / count($marks) : 0;

$totalAttSum = 0;
foreach ($attendance as $a) {
    $totalAttSum += calcPercentage($a);
}
$overallAvgAtt = count($attendance) > 0 ? $totalAttSum / count($attendance) : 0;

echo json_encode([
    "totalStudents" => count($students),
    "totalSubjects" => count($subjects),
    "averageMarks" => round($overallAvgMarks, 2),
    "averageAttendance" => round($overallAvgAtt, 2),
    "subjectAverages" => $subjectAverages,
    "attendanceDist" => $attendanceDist,
    "studentAverages" => $studentAverages
]);

?>
