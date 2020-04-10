<?php

namespace Safewalks\Controllers;

use \Safewalks\Repository\User;
use \Safewalks\Repository\Trip as TripRepository;
use \Safewalks\Repository\TripCell as TripCellRepository;
use \Safewalks\Helpers\Trip as TripHelper;
use Safewalks\Helpers\Database;
use Safewalks\Helpers\Cells;


class Trip extends BaseController {
    static function createTrip($params) {
        global $ME;

        $newTrip = [
            "start_date" => Database::toTime($params["start_date"]),
            "enforced" => $params["enforced"],
            "id_user" => $ME,
            "vehicle" => $params["vehicle"]
        ];

        $speed = TripHelper::vehicleToSpeed($newTrip["vehicle"]);

        $newTrip["duration"] = 0;
        $newTrip["speed"] = $speed;

        $trip_id = TripRepository::insert($newTrip);

        $previousPosInfo = null;
        $first = true;

        $duration = 0;
        $currentTime = $params["start_date"];

        foreach($params["points"] as $posInfo) {
            $timeToAdd = 0;

            if(!$first) {
                $distance = TripHelper::distanceBetween($previousPosInfo, $posInfo);
                $timeToAdd = $distance / $speed / 2;

                $previousCell = Cells::posToCell($previousPosInfo);
                $previousCell['lon'] = $previousPosInfo['lon'];
                $previousCell['lat'] = $previousPosInfo['lat'];
                $previousCell["id_trip"] = $trip_id;
                $previousCell["duration"] = $timeToAdd + $previousPosInfo["duration"];
                
                $currentTime += (int) $previousCell["duration"];
                $previousCell["cell_time"] = Database::toTime($currentTime);
                TripCellRepository::insert($previousCell);
            }

            $duration += $timeToAdd * 2;

            $previousPosInfo = $posInfo;
            $previousPosInfo["duration"] = $timeToAdd;
            $first = false;

        }

        TripRepository::update(['duration' => $duration], ['id' => $trip_id]);

        $newTrip["id"] = $trip_id;
        $newTrip["duration"] = $duration;
        
        return ["success" => true, "trip" => $newTrip];
    }

    static function getTrips($params) {
        global $ME;

        $ret = [];
        $ret["trips"] = TripRepository::select(['id_user' =>  $ME], true, ['order' => 'start_date DESC']);

        foreach($ret["trips"] as &$trip) {
            $tripCell = TripCellRepository::select(['id_trip' =>  $trip['id']]);
            $lonLat = [$tripCell['x'], $tripCell['y']];
            $tripCell["lat"] = $lonLat["y"];
            $tripCell["lon"] = $lonLat["x"];
        }

        return $ret;
    }

    static function deleteTrip($params) {
        global $ME;
        $ret = TripRepository::delete(['id_user' =>  $ME, 'id' => $params['id_trip']]);
        return $ret;
    }

}