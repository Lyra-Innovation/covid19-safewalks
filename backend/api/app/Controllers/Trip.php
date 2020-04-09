<?php

namespace Safewalks\Controllers;

use \Safewalks\Repository\User;
use \Safewalks\Repository\Trip as TripRepository;
use \Safewalks\Repository\TripCell as TripCellRepository;



class Trip extends BaseController {
    static function createTrip($params) {
        $ret = [];
        
        return $ret;
    }
    

    static function getTrips($params) {
        global $ME;

        $ret = [];
        $ret["trips"] = TripRepository::select(['id_user' =>  $ME], false, ['order' => 'start_date DESC']);

        foreach($ret["trips"] as &$trip) {
            $trip["trip_cells"] = TripCellRepository::select(['id_trip' =>  $trip['id']]);
        }

        return $ret;
    }

    static function deleteTrip($params) {
        global $ME;
        // TODO
        return $ret;
    }

}