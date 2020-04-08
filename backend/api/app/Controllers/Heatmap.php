<?php

namespace Safewalks\Controllers;

class Heatmap extends BaseController {

    static function getHeat($cell, $start_time, $end_time) {
        $ret = Safewalks\Repository\TripCell::select([
            'coord_x' =>  $cell['x'], 
            'coord_y' =>  $cell['y'], 
            'timestamp' => ['value' => $start_time, 'op' => '>='],
            'timestamp' => ['value' => $end_time, 'op' => '<=']
        ]);

        return min(count($ret) / $CNF['map_max_heat'], 1);
    }

}