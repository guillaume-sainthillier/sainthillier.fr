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
    empty($_POST['token']) ||
    !filter_var($_POST['email'], FILTER_VALIDATE_EMAIL)) {
    http_response_code(500);
    echo "No arguments provided.";
    die;
}

$recaptcha = new \ReCaptcha\ReCaptcha(RECAPTCHA_SECRET_KEY);
$resp = $recaptcha
    ->setExpectedHostname($_SERVER['SERVER_NAME'])
    ->verify($_POST['token'], $_SERVER['REMOTE_ADDR']);

if (!$resp->isSuccess()) {
    http_response_code(500);
    echo "No mail was sent : " . implode('<br />', $resp->getErrorCodes());
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
    sendMail($name, EMAIL_TO, 'Demande de contact', $body);
    echo "Mail was successfully sent";
    return;
} catch (\Symfony\Component\Mailer\Exception\ExceptionInterface $e) {
}
http_response_code(500);
echo "No mail was sent";