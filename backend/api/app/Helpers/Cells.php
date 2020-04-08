<?php

namespace Safewalks\Helpers;

class Cells {

    static function pos_to_cell($pos) {
        global $CNF;

        $cell = [];
        $cell['x'] = $CNF["map_constant"] * ($pos['lon'] / 360.0 + 0.5);
        $a = $pos['lat'] * pi() / 180.0;
        $cell['y'] = $CNF["map_constant"] * (1 - (log(tan($a) + 1.0/cos($a)) / pi())) * 0.5;

        return $cell;
    }

    static function cell_to_pos($cell) {
        global $CNF;

        $pos = [];
        $pos['lon'] = $cell['x'] * 360.0 / $CNF["map_constant"] - 180.0;
        $lat_rad = atan(sinh(pi() * (1.0 - 2.0 * $cell['y'] / $CNF["map_constant"])));
        $pos['lat'] = $lat_rad * 180.0 / pi();

        return $pos;
    }
}
