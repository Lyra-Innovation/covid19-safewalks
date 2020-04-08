<?php

use Safewalks\Helpers\Database;

// safe check, we are an api only accepting post methods
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    die();
}

//libs
require_once('vendor/autoload.php');
require_once("config/autoload.php");

global $DB;
global $CNF;

header('Content-Type: application/json');

$inputJSON = file_get_contents('php://input');
$input = json_decode($inputJSON, TRUE);

Database::connect();

try {
    $class = "Safewalks\Controllers\\" . $input["classname"];
    $func = $input["func"];
    $data = $class::$func($input["params"]);
}
catch(Exception $e) {
    print_r($e);
}

Database::disconnect();

echo json_encode($data);