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

    static function executeInsert($sql) {
        global $DB; 

        self::execute($sql);
        
        return $DB->insert_id;
    }

    static function executeSelect($sql, $excludes = true) {
        global $DB;

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

    static function privateWhere($arrayFields, $extra = []) {

        $sql = "";

        if(count($arrayFields) > 0) {
            $sql .= self::constructString($arrayFields, " WHERE  ", "", " AND ", function($key, $value) {
                if(gettype($value) == "array") return $value["key"] . " " . $value["op"] . " " . self::sqlType($value["value"]);
                return $key . " = " . self::sqlType($value);
            });
        }

        if(isset($extra["order"])) {
            $sql .= "ORDER BY " . $extra["order"];
        }

        return $sql;
    }

    static function select($arrayFields, $excludes = true, $extra = []) {
        $sql = "SELECT * FROM " . static::$tablename;
        
        $sql .= self::privateWhere($arrayFields, $extra);
        
        $result = self::executeSelect($sql, $excludes, $extra);
       
        if($result === false) return [];
        return $result;
    }

    static function selectCount($arrayFields, $excludes = true, $extra = []) {
        $sql = "SELECT COUNT(*) as cnt FROM " . static::$tablename;
        
        $sql .= self::privateWhere($arrayFields, $extra);

        $result = self::executeSelect($sql, $excludes, $extra);

        return (int)($result)[0]["cnt"];
    }

    static function selectFirst($arrayFields, $excludes = true, $extra = []) {        
        $result = self::select($arrayFields, $excludes);

        if(!$result) return false;
        return $result[0];
    }

    static function insert($arrayFields) {
        $sql = "INSERT INTO " . static::$tablename;

        if(count($arrayFields) > 0) {

            $sql .= self::constructString($arrayFields, " (", ")", ", ", function($key, $value) {
                return $key;
            });

            $sql .= self::constructString($arrayFields, " VALUES (", ")", ", ", function($key, $value) {
                return self::sqlType($value);
            });
        }

        return self::executeInsert($sql);
    }

    static function update($toUpdate, $arrayFields) {
        $sql = "UPDATE " . static::$tablename;

        $sql .= self::constructString($toUpdate, " SET ", "", ", ", function($key, $value) {
            return $key . " = " . $value;
        });

        $sql .= self::privateWhere($arrayFields, $extra);

        return self::execute($sql);
    }

    static function delete($arrayFields) {
        $sql = "DELETE FROM " . static::$tablename;

        $sql .= self::privateWhere($arrayFields, $extra);

        return self::execute($sql);
    }
}