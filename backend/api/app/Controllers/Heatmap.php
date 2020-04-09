<?php

namespace Safewalks\Controllers;

use Safewalks\Helpers\Cells;
use Safewalks\Repository\TripCell;

class Heatmap extends BaseController {

    static function getHeat($params) {
        global $CNF;

        $cell = Cells::posToCell($params["cell"]);

        $start_time = date("Y-m-d H:i:s", $params["start_time"]);
        $end_time = date("Y-m-d H:i:s", $params["end_time"]);

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