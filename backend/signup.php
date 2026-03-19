<?php
include "db.php";

$data = json_decode(file_get_contents("php://input"));

$username = $data->username;
$password = $data->password;

// check if user exists
$check = $conn->query("SELECT * FROM users WHERE username='$username'");

if ($check->num_rows > 0) {
    echo json_encode(["success" => false, "message" => "User exists"]);
    exit();
}

// insert user
$conn->query("INSERT INTO users (username, password)
VALUES ('$username', '$password')");

echo json_encode(["success" => true]);
?>