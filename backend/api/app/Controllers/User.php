<?php

namespace Safewalks\Controllers;

use \Safewalks\Repository\User as UserRepository;

class User {
    static function createUser($params) {

        $params["password"] = password_hash($params["password"]);

        $ret = UserRepository::selectFirst(['nif' =>  'adi']);
        return $ret;
    }

    static function getUser($params) {
        $ret = UserRepository::selectFirst(['nif' => $params['nif']]);
        return $ret;
    }

}