<?php

namespace Safewalks\Controllers;

use \Safewalks\Repository\User as UserRepository;
use ReallySimpleJWT\Token;

class Auth extends BaseController {

    static public $public = ["register", "login"];

    static function register($params) {
        global $CNF;
        
        $params['password'] = password_hash($params['password'], PASSWORD_DEFAULT);
        $params['country'] = "Spain";

        UserRepository::insert($params);
        
        return "registered";
    }
    
    static function login($params) {
        global $CNF;

        $ret = [];
    
        $user = UserRepository::selectFirst(['nif' => $params['nif']], false);

        if(!password_verify($params["password"], $user["password"])) {
            throw new \Exception("Unauthorized", 401);
        }

        $ret["token"] = Token::create($user["id"], $CNF["auth_secret"], $CNF["auth_expiration"], $CNF["auth_issuer"]);
        return $ret;
    }

}