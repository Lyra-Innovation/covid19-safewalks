<?php

namespace Safewalks\Helpers;

class Database {

    static function connect(){
        global $DB, $CNF;
    
        $DB = mysqli_connect($CNF["db_host"], $CNF["db_user"], $CNF["db_password"], $CNF["db_database"]);
        
        if(!$DB){
            throw new Exception("Error failed to connect to MySQL: " . mysqli_connect_error());
        } 
    
        return $DB;
    }
    
    static function disconnect() {
        global $DB;
        mysqli_close($DB);
    }

}

