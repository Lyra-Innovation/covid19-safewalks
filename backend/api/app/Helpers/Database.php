<?php

namespace Safewalks\Helpers;

class Database {

    static function connect(){
        global $DB, $CNF;
    
        $DB = new \mysqli($CNF["db_host"], $CNF["db_user"], $CNF["db_password"], $CNF["db_database"]);
        
        if($DB->connect_errno){
            throw new \Exception("Error failed to connect to MySQL: " . $DB->connect_error, 1);
        } 
    }
    
    static function disconnect() {
        global $DB;
        $DB->close();
    }

}

