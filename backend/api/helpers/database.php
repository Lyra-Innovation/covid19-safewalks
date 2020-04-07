<?php

function db_connect(){
    global $DB, $CNF;

    $DB = mysqli_connect($CNF["host"], $CNF["user"], $CNF["password"], $CNF["database"]);
    
    if(!$DB){
        throw new Exception("Error failed to connect to MySQL: " . mysqli_connect_error());
    } 

    return $DB;
}

function db_disconnect() {
    global $DB;
    mysqli_close($DB);
}