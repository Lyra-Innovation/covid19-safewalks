<?php

namespace Safewalks\Repository;

abstract class BaseRepository {

    static protected $tablename = "";
    static protected $excludes = [];

    static function executeSelect($sql) {
        global $DB;

        $result = $DB->query($sql);

        if(!$result) return false;

        $ret = [];
        while ($row = $result->fetch_assoc()) {
            foreach(self::$excludes as $exclude) {
                unset($row[$exclude]);
            }
            $ret[] = $row;
        }

        
        return $ret;
    }

    static function constructString($arrayFields, $start, $end, $middleNotFirst, $keyValueFunction) {
        $sql = $start;

        $first = true;
        foreach ($arrayFields as $key => $value) {
            
            if(!$first) {
                $sql .= $middleNotFirst;
            }
            $first = false;

            $sql .= $keyValueFunction($key, $value);
        }

        $sql .= $end;

        return $sql;
    }

    static function select($arrayFields) {
        $sql = "SELECT * FROM " . static::$tablename;

        if(count($arrayFields) > 0) {
            $sql .= BaseRepository::constructString($arrayFields, " WHERE  ", ";", " AND ", function($key, $value) {
                return $key . " = '" . $value ."'";
            });
        }

        return self::executeSelect($sql);
    }

    static function selectFirst($arrayFields) {        
        $result = self::select($arrayFields);

        if(!$result) return false;
        return $result[0];
    }

    static function insert($arrayFields) {
        $sql = "INSERT INTO " . static::$tablename;

        if(count($arrayFields) > 0) {

            $sql .= BaseRepository::constructString($arrayFields, " (", ")", ", ", function($key, $value) {
                return $key;
            });

            $sql .= BaseRepository::constructString(" VALUES (", ")", ", ", function($key, $value) {
                return $value;
            });
        }
    }

    static function update($arrayFields) {
    }

    static function delete($arrayFields) {
    }
}