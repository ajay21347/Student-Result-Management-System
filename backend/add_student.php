<?php
include "db.php";

$data = json_decode(file_get_contents("php://input"));

$name = $data->name;
$roll = $data->roll;

$conn->query("INSERT INTO students (name, roll_no)
VALUES ('$name', '$roll')");

echo json_encode(["message" => "Student added"]);
?>