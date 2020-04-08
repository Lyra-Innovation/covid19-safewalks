<?php

namespace Safewalks\Helpers;

use ReallySimpleJWT\Token;

class AuthToken {

    static function verify() {
        global $CNF, $ME;

        $headers = getallheaders();
        if(!isset($headers['Authorization'])) throw new \Exception("Unauthorized", 401);

        $bearerHeader = $headers['Authorization'];
        $token = explode(' ', $bearerHeader)[1];

        $result = Token::validate($token, $CNF["auth_secret"]);
        if(!$result) throw new \Exception("Unauthorized", 401);;
        
        $ME = Token::getPayload($token, $CNF["auth_secret"])["user_id"];
    }
}