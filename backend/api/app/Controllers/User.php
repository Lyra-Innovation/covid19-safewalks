<?php

namespace Safewalks\Controllers;

use \Safewalks\Repository\User as UserRepository;

class User extends BaseController {

    static function getUser($params) {
        global $ME;

        $ret = UserRepository::selectFirst(['id' => $ME]);
        return $ret;
    }

    static function updateUser($params) {
        global $ME;
        // TODO
        return $ret;
    }

}