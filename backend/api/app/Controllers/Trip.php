<?php

namespace Safewalks\Controllers;

class Trip {
    static function create_trip($params) {
        $ret = [];

        Safewalks\Repository\User::insert(['id' =>  1]);
    
        $ret["test"] = "Hello world";
        
        return $ret;
    }

}