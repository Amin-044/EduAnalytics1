<?php

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit;
}

include "db.php";

$data = json_decode(file_get_contents("php://input"));

$name = trim($data->name ?? '');
$email = trim($data->email ?? '');
$password = $data->password ?? '';

if ($name == '' || $email == '' || $password == '') {
    echo "All fields are required";
    exit;
}

// check if the email is already used
$check = mysqli_query($conn, "SELECT * FROM users WHERE email='$email'");
if (mysqli_num_rows($check) > 0) {
    echo "Email already registered";
    exit;
}

$hash = password_hash($password, PASSWORD_BCRYPT);

// every new signup becomes a normal user by default
$sql = "INSERT INTO users (name, email, password, role)
        VALUES ('$name', '$email', '$hash', 'user')";

if (mysqli_query($conn, $sql)) {

    echo "Signup Successful";

} else {

    echo "Database Error: " . mysqli_error($conn);

}

?>
