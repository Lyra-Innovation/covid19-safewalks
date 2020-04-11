<?php

namespace Safewalks\Helpers;

class Trip {

    static function vehicleToSpeed($vehicle) {
        global $CNF;

        return $CNF[$vehicle]/3.6;
    }

    static function speedToVehicle($speed) {
        global $CNF;

        $kmh = $speed * 3.6;

        if($kmh <= $CNF["walk"]) return "walk";
        if($kmh * 3.6 <= $CNF["run"]) return "run";
        return "bicycle";
    }

    static function distanceBetween($cell1, $cell2) {

        $lat1 = $cell1["lat"];
        $lon1 = $cell1["lon"];
        $lat2 = $cell2["lat"];
        $lon2 = $cell2["lon"];

        if (($lat1 == $lat2) && ($lon1 == $lon2)) {
            return 0;
        }
        else {
            $theta = $lon1 - $lon2;
            $dist = sin(deg2rad($lat1)) * sin(deg2rad($lat2)) +  cos(deg2rad($lat1)) * cos(deg2rad($lat2)) * cos(deg2rad($theta));
            $dist = acos($dist);
            $dist = rad2deg($dist);
            return $dist * 60 * 1.1515 * 1609.344;
        }
    }
}