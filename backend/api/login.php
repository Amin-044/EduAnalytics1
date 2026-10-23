<?php

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit;
}

include "db.php";

$data = json_decode(file_get_contents("php://input"));

$email = $data->email;
$password = $data->password;

$sql = "SELECT * FROM users WHERE email='$email'";

$result = mysqli_query($conn, $sql);
$user = mysqli_fetch_assoc($result);

if ($user && $password === $user['password']) {

    $token = md5(uniqid());

    echo json_encode([
        "token" => $token,
        "user" => [
            "id" => (int)$user['id'],
            "name" => $user['name'],
            "email" => $user['email'],
            "role" => $user['role'],
        ]
    ]);

} else {

    http_response_code(401);
    echo json_encode(["message" => "Invalid credentials"]);

}

?>
