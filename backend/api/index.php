<?php

global $DB;
global $CNF;

require_once("config/autoload.php");
require_once("helpers/database.php");
require_once("controllers/autoload.php");

header('Content-Type: application/json');

$inputJSON = file_get_contents('php://input');
$input = json_decode($inputJSON, TRUE);

db_connect();

try {
    $data = $input["func"]($input["params"]);
}
catch(Exception $e) {
    print_r($e);
}

db_disconnect();

echo json_encode($data);