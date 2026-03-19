<?php
include "db.php";

$data = json_decode(file_get_contents("php://input"));
$roll = $data->roll;

// delete marks first
$conn->query("
DELETE marks FROM marks
JOIN students ON marks.student_id = students.id
WHERE students.roll_no='$roll'
");

// delete student
$conn->query("DELETE FROM students WHERE roll_no='$roll'");

echo json_encode(["message" => "Deleted"]);
