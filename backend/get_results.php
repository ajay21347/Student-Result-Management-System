<?php
include "db.php";

$sql = "SELECT students.name, students.roll_no,
        marks.subject1, marks.subject2, marks.subject3,
        marks.total, marks.percentage
        FROM students
        JOIN marks ON students.id = marks.student_id";

$result = $conn->query($sql);

$data = [];

while ($row = $result->fetch_assoc()) {
  $data[] = $row;
}

echo json_encode($data);
