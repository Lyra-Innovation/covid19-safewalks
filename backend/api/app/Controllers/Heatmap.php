<?php

namespace Safewalks\Controllers;

use Safewalks\Helpers\Cells;
use Safewalks\Repository\TripCell;

class Heatmap extends BaseController {

    static function getHeat($params) {
        global $CNF;

        $cell = Cells::posToCell($params["cell"]);

        print_r($cell);

        $start_time = $params["start_time"];
        $celend_time = $params["end_time"];

        $ret = TripCell::select([
            'coord_x' =>  $cell['x'], 
            'coord_y' =>  $cell['y'], 
            'timestamp1' => ['key' => 'timestamp', 'value' => $start_time, 'op' => '>='],
            'timestamp2' => ['key' => 'timestamp', 'value' => $end_time, 'op' => '<=']
        ]);

        return min(count($ret) / $CNF['map_max_heat'], 1);
    }

    static function getHeatMapZoom() {

    }

}