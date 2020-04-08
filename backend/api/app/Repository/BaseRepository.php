<?php

namespace Safewalks\Repository;

abstract class BaseRepository {

    protected static $tablename = null;

    static function execute($sql) {
        global $DB;
        return $DB->query($sql);
    }

    static function select($arrayFields) {
        global $DB;
        
        $sql = "SELECT * FROM " . $self::$tablename;

        if(count($arrayFields) > 0) {
            $sql .= " WHERE ";
            $first = true;
            foreach ($arrayFields as $key => $value) {
                
                if(!$first) {
                    $sql .= " AND ";
                }
                $first = false;

                $sql .= $key . " = " . $value;
            }
            
        }

        return self::execute($sql);

    }

    static function selectFirst($arrayFields) {
        global $DB;

        return self::execute($sql)[0];
    }

    static function insert($arrayFields) {
        global $DB;
    }

    static function update($arrayFields) {
        global $DB;
    }

    static function delete($arrayFields) {
        global $DB;
    }
}