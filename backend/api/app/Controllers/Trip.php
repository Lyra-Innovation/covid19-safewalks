<?php

namespace Safewalks\Controllers;

use \Safewalks\Repository\User;

class Trip {
    static function createTrip($params) {
        $ret = [];

        $ret["user"] = User::selectFirst(['nif' =>  'adi']);
        
        return $ret;
    }

}