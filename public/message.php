<?php

require_once __DIR__ . '/../required/init.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(404);
    echo "Page not Found.";
    die();
}

// Check for empty fields
if (empty($_POST['name']) ||
    empty($_POST['email']) ||
    empty($_POST['phone']) ||
    empty($_POST['message']) ||
    !filter_var($_POST['email'], FILTER_VALIDATE_EMAIL)) {
    http_response_code(500);
    echo "No arguments provided.";
    die;
}

$name = $_POST['name'];
$from = $_POST['email'];
$phone = $_POST['phone'];
$message = $_POST['message'];

$body = sprintf(
    '%s a fait une demande de contact :
    <p>%s</p>
    <br />Email : <a href="mailto:%s">%s</a>
    <br />Tel : <a href="tel:%s">%s</a>',
    htmlentities($name),
    htmlentities($message),
    htmlentities($from),
    htmlentities($from),
    htmlentities($phone),
    htmlentities($phone)
);

try {
    $success = sendMail($name, EMAIL_TO, 'Demande de contact', $body);
    if($success) {
        echo "Mail was successfully sent";
        die;
    }
}catch (Exception $e) {

}
http_response_code(500);
echo "No mail was sent";