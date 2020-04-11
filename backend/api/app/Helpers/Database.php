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

    static function toTime($timestamp) {
        return date("Y-m-d H:i:s", $timestamp);
    }

    static function toTimestamp($date) {
        $date = \DateTime::createFromFormat("Y-m-d H:i:s", $date);
        return $date->getTimestamp();
    }

}

