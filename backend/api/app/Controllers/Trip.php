<?php

namespace Safewalks\Controllers;

use \Safewalks\Repository\User;

class Trip {
    static function create_trip($params) {
        $ret = [];

        $ret["user"] = User::selectFirst(['nif' =>  'adi']);
        
        return $ret;
    }

}