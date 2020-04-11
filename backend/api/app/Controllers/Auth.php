<?php

namespace Safewalks\Controllers;

use \Safewalks\Repository\User as UserRepository;
use ReallySimpleJWT\Token;
use Safewalks\Helpers\Validator;

class Auth extends BaseController {

    static public $public = ["register", "login", "validate"];

    static function register($params) {
        global $CNF;

        $newUser = ['hash' => $params['hash'], 'dni_hash' => $params['dni_hash'], 
            'country' => Validator::string($params['country']), 'data' => $params['data']];
        
        UserRepository::insert($newUser);
        
        return true;
    }
    
    static function login($params) {
        global $CNF;

        $ret = [];
    
        $user = UserRepository::selectFirst(['hash' => $params['hash']], false);

        if(!$user) {
            throw new \Exception("Unauthorized", 401);
        }

        /*if(!password_verify($params["password"], $user["password"])) {
            throw new \Exception("Unauthorized", 401);
        }*/

        $ret["token"] = Token::create($user["id"], $CNF["auth_secret"], $CNF["auth_expiration"], $CNF["auth_issuer"]);
        return $ret;
    }

    static function validate($params) {
        global $CNF;

        return ["token" => Token::validate($params["token"], $CNF["auth_secret"])];
    }

}