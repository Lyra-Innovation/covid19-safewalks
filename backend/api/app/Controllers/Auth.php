<?php

namespace Safewalks\Controllers;

use ReallySimpleJWT\Token;

class Auth {

    static function register($params) {
        $ret = [];
        
        return $ret;
    }
    
    static function login($params) {
        $ret = [];
    
        
    
        $token = Token::create($userId, $CNF["auth_secret"], $CNF["auth_expiration"], $CNF["auth_issuer"]);
        return $ret;
    }

}