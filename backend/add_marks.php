<?php
include "db.php";

$data = json_decode(file_get_contents("php://input"));

$id = $data->student_id;
$s1 = $data->s1;
$s2 = $data->s2;
$s3 = $data->s3;

$total = $s1 + $s2 + $s3;
$percentage = $total / 3;

$conn->query("INSERT INTO marks 
(student_id, subject1, subject2, subject3, total, percentage)
VALUES ('$id', '$s1', '$s2', '$s3', '$total', '$percentage')");

echo json_encode(["message" => "Marks added"]);
?>