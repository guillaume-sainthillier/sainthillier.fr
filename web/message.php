<?php
require_once '../required/init.php';

if($_SERVER['REQUEST_METHOD'] !== 'POST') {
	header($_SERVER["SERVER_PROTOCOL"]." 404 Not Found");
	die();
}

function inArray(array $array, $key, $default = null) {
    return isset($array[$key]) ? $array[$key] : $default;
}

function post($key, $default = null) {
	return inArray($_POST, $key, $default);
}

function retour($message, $success = false) {
    $retour = [
       'success' => $success,
        'msg' => $message
    ];

    echo json_encode($retour);
    die();
}

header('Content-Type: application/json');
$contactForm = array_map('trim', post('contact', []));
$web = inArray($contactForm, 'web');
$mail = inArray($contactForm, 'mail');
$nom = inArray($contactForm, 'nom');
$message = inArray($contactForm, 'message');

if(! $message) {
    retour('Le champs message est obligatoire');
}

if(! $nom) {
    retour('Le champs nom est obligatoire');
}

$body = sprintf('<strong>%s</strong> a fait une demande de contact :<br />
<p>%s</p>
',
    htmlentities($nom),
    htmlentities($message)
);

if($mail) {
    $body .= sprintf("<br/>Email : %s", $mail);
}

if($web) {
    $body .= sprintf("<br/>Site : %s", $web);
}

try {
    $retour = sendMail(NAME, 'guillaume.sainthillier@gmail.com', 'Demande de contact', $body);
    if($retour) {
        retour(sprintf('Merci pour votre message, %s !', $nom), true);
    }
} catch(Exception $e) {}
retour('Un problème est survenu lors de l\'envoi du mail.');
