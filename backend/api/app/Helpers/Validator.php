<?php

namespace Safewalks\Helpers;

class Validator {

    static function validate($input, $filter) {
        if(!filter_var($input, $filter)) {
            throw new \Exception("Bad request", 400);
        }

        return $input;
    }

    static function sanitize($input, $filter) {
        $newVar = filter_var($input, $filter);

        if($newVar != $input) {
            throw new \Exception("Bad request", 400);
        }

        return $newVar;
    }

    static function int($input) {
        return self::sanitize($input, FILTER_SANITIZE_NUMBER_INT);
    }

    static function string($input) {
        return self::sanitize($input, FILTER_SANITIZE_STRING);
    }

    static function cell($cell) {
        self::validate($cell['lat'], FILTER_VALIDATE_FLOAT);
        self::validate($cell['lon'], FILTER_VALIDATE_FLOAT);
        return $cell;
    }

    static function vehicle($vehicle) {
        return in_array($vehicle, ["walk", "run", "bicycle"]);
    }
}