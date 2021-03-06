<?php

namespace Safewalks\Controllers;

use \Safewalks\Repository\User;
use \Safewalks\Repository\Trip as TripRepository;
use \Safewalks\Repository\TripCell as TripCellRepository;
use \Safewalks\Helpers\Trip as TripHelper;
use Safewalks\Helpers\Database;
use Safewalks\Helpers\Cells;
use Safewalks\Helpers\Validator;


class Trip extends BaseController {
    static function createTrip($params) {
        global $ME, $CNF;

        $success = true;

        $newTrip = [
            "enforced" => Validator::int($params["enforced"]),
            "id_user" => $ME,
            "id_reason" => Validator::int($params['id_reason']),
            "vehicle" => Validator::vehicle($params["vehicle"])
        ];

        $speed = TripHelper::vehicleToSpeed($newTrip["vehicle"]);
        $startCurrentTime = Validator::int($params["start_date"]);

        $points = self::correctPoints($params['points']);

        $newTrip["speed"] = $speed;

        [$valid, $duration, $cells] = self::isTripValid($startCurrentTime, $speed, $points);

        $maxTries = $CNF["max_iterations"];
        $tries = $startMaxTries;

        while(!$newTrip["enforced"] && !$valid && $tries < $maxTries) {
            $success = false;
            $tries++;

            $startCurrentTime += $CNF["interval_seconds"];

            [$valid, $duration, $cells] = self::isTripValid($startCurrentTime, $speed, $points);
        }

        if($tries >= $maxTries) {
            $newTrip = [];
            return ["success" => false, "found" => false, "time" => 0, "trip" => $newTrip];
        }
        
        $newTrip["start_date"] = Database::toTime($startCurrentTime);
        $newTrip["duration"] = $duration;

        if($success) {
            $id_trip = self::saveTrip($newTrip, $cells);
            $newTrip["id"] = $id_trip;
        }

        return ["success" => $success, "found" => true, "time" => Database::toTimestamp($newTrip['start_date']), "trip" => $newTrip];
    }

    static function getTrip($params) {
        global $ME;

        $ret = TripRepository::selectFirst(['id' => $params['id'], 'id_user' => $ME]);

        if ($ret) {
            $ret['points'] = TripcellRepository::select(['id_trip' => $params['id'], 'original' => 1]);
        }

        return $ret;
    }

    static function getTrips($params) {
        global $ME;

        $ret = [];
        $ret["trips"] = TripRepository::select(['id_user' =>  $ME], true, ['order' => 'start_date DESC']);

        foreach($ret["trips"] as &$trip) {
            $trip['start_date'] = Database::toTimestamp($trip['start_date']);
        }

        return $ret;
    }

    static function deleteTrip($params) {
        global $ME;
        $ret = TripRepository::delete(['id_user' =>  $ME, 'id' => $params['id_trip']]);
        return $ret;
    }

    private static function correctPoints($points) {
        global $CNF;

        $newPoints = [];

        $first = true;
        $previousPosInfo = null;
        foreach($points as $posInfo) {
            $posInfo = Validator::cell($posInfo);

            if(!$first) {

                $newPoint = ['lat' => $previousPosInfo['lat'], 'lon' => $previousPosInfo['lon']];
                $newPoint["original"] = 1;
                $newPoints[] = $newPoint;

                $distanceToPoint = TripHelper::distanceBetween($newPoint, $posInfo);
            
                while($distanceToPoint > $CNF["max_distance_points"]) {

                    $newLat = $newPoint['lat'] + ($posInfo['lat'] - $newPoint['lat'])*$CNF['max_distance_points']/$distanceToPoint;
                    $newLon = $newPoint['lon'] + ($posInfo['lon'] - $newPoint['lon'])*$CNF['max_distance_points']/$distanceToPoint;

                    $newPoint = ['lat' => $newLat, 'lon' => $newLon];
                    $newPoint["original"] = 0;
                    $newPoints[] = $newPoint;

                    $distanceToPoint = TripHelper::distanceBetween($newPoint, $posInfo);
                }
                
            }

            $previousPosInfo = $posInfo;

            $first = false;
        }

        $newPoint = ['lat' => $previousPosInfo['lat'], 'lon' => $previousPosInfo['lon']];
        $newPoint["original"] = 1;
        
        // added to times to simplify last point skip in next bucle
        $newPoints[] = $newPoint;
        $newPoints[] = $newPoint;

        return $newPoints;
    }


    private static function isTripValid($currentTime, $speed, $points) {
        global $CNF;

        $previousPosInfo = null;
        $first = true;

        $valid = true;

        $duration = 0;

        $cells = [];

        foreach($points as $posInfo) {

            $timeToAdd = 0;

            if(!$first) {
                $distance = TripHelper::distanceBetween($previousPosInfo, $posInfo);
                $timeToAdd = $distance / $speed / 2;

                $previousCell = Cells::posToCell($previousPosInfo);
                $previousCell['lon'] = $previousPosInfo['lon'];
                $previousCell['lat'] = $previousPosInfo['lat'];
                $previousCell['original'] = $previousPosInfo['original'];

                $previousCell["duration"] = $timeToAdd + $previousPosInfo["duration"];
                
                $previousCell["cell_time"] = Database::toTime($currentTime);
                $currentTime += (int) $previousCell["duration"];
                $previousCell["cell_end_time"] = Database::toTime($currentTime);

                $alreadyThere = TripCellRepository::selectCount([
                    'x' =>  $previousCell['x'], 
                    'y' =>  $previousCell['y'],
                    'timestamp1' => ['key' => 'cell_time',  'op' => '<=', 'value' => $previousCell["cell_end_time"]],
                    'timestamp2' => ['key' => 'cell_end_time', 'op' => '>=', 'value' => $previousCell["cell_time"]]
                ]);

                if($alreadyThere >= $CNF['map_max_heat']) {
                    $valid = false;
                }

                $cells[] = $previousCell;
            }

            $duration += $timeToAdd * 2;

            $previousPosInfo = $posInfo;
            $previousPosInfo["starting_time"] = $currentTime;
            $previousPosInfo["duration"] = $timeToAdd;
            $first = false;
        }

        return [$valid, $duration, $cells];
    }

    private static function saveTrip($trip, $cells) {

        $trip_id = TripRepository::insert($trip);
        foreach($cells as $cell) {
            $cell["id_trip"] = $trip_id;
            TripCellRepository::insert($cell);
        }

        return $trip_id;
    }
}