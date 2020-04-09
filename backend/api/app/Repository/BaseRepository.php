<?php

namespace Safewalks\Repository;

abstract class BaseRepository {

    static protected $tablename = "";
    static protected $excludes = [];

    static function execute($sql) {
        global $DB, $CNF;
        
        $result = $DB->query($sql);
        if(!$result) {

            $errorText = $CNF['debug'] ? $DB->error : "Invalid query";

            throw new \Exception($errorText, 400);
        }

        return $result;
    }

    static function executeSelect($sql, $excludes = true) {
        global $DB;

        print($sql);

        $result = $DB->query($sql);

        if(!$result) return false;

        $ret = [];
        while ($row = $result->fetch_assoc()) {
            if($excludes) {
                foreach(static::$excludes as $exclude) {
                    unset($row[$exclude]);
                }
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

    static function sqlType($value) {
        global $DB;

        if(gettype($value) == "string") return "'" . $DB->real_escape_string($value) . "'";
        return $value;
    }

    static function select($arrayFields, $excludes = true, $orderBy = '') {
        $sql = "SELECT * FROM " . static::$tablename;

        if(count($arrayFields) > 0) {
            $sql .= BaseRepository::constructString($arrayFields, " WHERE  ", ";", " AND ", function($key, $value) {
                if(gettype($value) == "array") return $key . " " . $value["op"] . " '" . self::sqlType($value["value"]) ."'";
                return $key . " = '" . $value ."'";
            });
        }

        return self::executeSelect($sql, $excludes);
    }

    static function selectFirst($arrayFields, $excludes = true) {        
        $result = self::select($arrayFields, $excludes);

        if(!$result) return false;
        return $result[0];
    }

    static function insert($arrayFields) {
        $sql = "INSERT INTO " . static::$tablename;

        if(count($arrayFields) > 0) {

            $sql .= BaseRepository::constructString($arrayFields, " (", ")", ", ", function($key, $value) {
                return $key;
            });

            $sql .= BaseRepository::constructString($arrayFields, " VALUES (", ")", ", ", function($key, $value) {
                return self::sqlType($value);
            });
        }

        return self::execute($sql, $excludes);
    }

    static function update($arrayFields) {
    }

    static function delete($arrayFields) {

    }
}