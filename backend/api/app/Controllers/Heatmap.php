<?php

namespace Safewalks\Controllers;

use Safewalks\Helpers\Cells;
use Safewalks\Repository\TripCell;
use Safewalks\Helpers\Database;

class Heatmap extends BaseController {

    static function getHeat($params) {
        global $CNF;

        $cell = Cells::posToCell($params["cell"]);

        $startTime = Database::toTime($params["start_time"]);
        $endTime = Database::toTime($params["end_time"]);

        $ret = TripCell::selectCount([
            'x' =>  $cell['x'], 
            'y' =>  $cell['y'],
            'timestamp1' => ['key' => 'cell_time',  'op' => '<=', 'value' => $endTime],
            'timestamp2' => ['key' => 'cell_end_time', 'op' => '>=', 'value' => $startTime]
        ]);

        return min($ret / $CNF['map_max_heat'], 1);
    }

    static function getHeatMapZoom($params) {
        global $CNF;

        $leftBotCell = Cells::posToCell($params["left_bot_cell"]);
        $rightTopCell =  Cells::posToCell($params["right_top_cell"]);

        $startTime = date("Y-m-d H:i:s", $params["time"] - $CNF["interval_seconds"]);
        $endTime = date("Y-m-d H:i:s", $params["time"] + $CNF["interval_seconds"]);

        $ret = [];

        $x = $leftBotCell['x'];
        $y = $leftBotCell['y'];

        while($x <= $rightTopCell['x']) {
            $y = $leftBotCell['y'];
            while($y >= $rightTopCell['y']) {
                
                $value = TripCell::selectCount([
                    'x' =>  $x, 
                    'y' =>  $y,
                    'timestamp1' => ['key' => 'cell_time',  'op' => '<=', 'value' => $endTime],
                    'timestamp2' => ['key' => 'cell_end_time', 'op' => '>=', 'value' => $startTime]
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