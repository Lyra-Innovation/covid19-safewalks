<?php

use Safewalks\Helpers\Database;
use Safewalks\Helpers\AuthToken;
use Safewalks\Controllers\Auth;

// safe check, we are an api only accepting post methods
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    die();
}

//libs
require_once('vendor/autoload.php');
require_once("config/autoload.php");

global $DB;
global $CNF;
global $ME;

header('Content-Type: application/json');

$inputJSON = file_get_contents('php://input');
$input = json_decode($inputJSON, TRUE);

Database::connect();

try {

    if(!ctype_alnum($input["classname"])) throw new Exception("Bad request", 400);
    if(!ctype_alnum($input["func"])) throw new Exception("Bad request", 400);

    $class = "Safewalks\Controllers\\" . $input["classname"];
    $func = $input["func"];
    $data = [];

    if(in_array($func, $class::$public)) {
        $data = $class::$func($input["params"]);
    }
    else {
        AuthToken::verify();
        $data = $class::$func($input["params"]);
    }
    
    $response = ["code" => 0, "data" => $data];
}
catch(Exception $e) {
    http_response_code($e->getCode());
    $response = [ "code" =>  $e->getCode(), "data" => $e->getMessage()];
    if( $CNF["debug"]) $response["stacktrace"] = $e->getTraceAsString();
}

Database::disconnect();

echo json_encode($response);