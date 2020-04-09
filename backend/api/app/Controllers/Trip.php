<?php

namespace Safewalks\Controllers;

use \Safewalks\Repository\User;
use \Safewalks\Repository\Trip as TripRepository;


class Trip extends BaseController {
    static function createTrip($params) {
        $ret = [];

        $ret["user"] = User::selectFirst(['nif' =>  'adi']);
        
        return $ret;
    }
    

    static function getTrips($params) {
        global $ME;

        $ret = [];
        $ret["trips"] = TripRepository::select(['nif' =>  $ME]);
        return $ret;
    }

}