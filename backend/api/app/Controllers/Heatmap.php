<?php

namespace Safewalks\Controllers;

use Safewalks\Helpers\Cells;
use Safewalks\Repository\TripCell;

class Heatmap extends BaseController {

    static function getHeat($params) {
        global $CNF;

        $cell = Cells::posToCell($params["cell"]);

        $startTime = date("Y-m-d H:i:s", $params["start_time"]);
        $endTime = date("Y-m-d H:i:s", $params["end_time"]);

        $ret = TripCell::selectCount([
            'coord_x' =>  $cell['x'], 
            'coord_y' =>  $cell['y'],
            'timestamp1' => ['key' => 'timestamp', 'value' => $startTime, 'op' => '>='],
            'timestamp2' => ['key' => 'timestamp', 'value' => $endTime, 'op' => '<=']
        ]);

        return min($ret / $CNF['map_max_heat'], 1);
    }

    static function getHeatMapZoom($params) {
        $leftBotCell = Cells::posToCell($params["left_bot_cell"]);
        $rightTopCell =  Cells::posToCell($params["right_top_cell"]);

        $startTime = date("Y-m-d H:i:s", $params["time"] - 60*60);
        $endTime = date("Y-m-d H:i:s", $params["end_time"] + 60*60);

        $ret = [];

        $x = $leftBotCell['x'];
        $y = $leftBotCell['y'];

        while($x <= $rightTopCell['x']) {
            while($y >= $rightTopCell['y']) {
                
                $value = TripCell::selectCount([
                    'coord_x' =>  $x, 
                    'coord_y' =>  $y,
                    'timestamp1' => ['key' => 'timestamp', 'value' => $startTime, 'op' => '>='],
                    'timestamp2' => ['key' => 'timestamp', 'value' => $endTime, 'op' => '<=']
                ]);

                $y--;

                $newCell = Cells::cellToPos(['x' => $x, 'y' => $y]);
                $newCell["value"] = $value;

                $ret[] = $newCell;
            }

            $x++;
        }

        return $ret;

    }

}