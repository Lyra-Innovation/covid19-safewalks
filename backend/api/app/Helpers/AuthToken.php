<?php

namespace Safewalks\Helpers;

use ReallySimpleJWT\Token;

class AuthToken {

    static function verify() {
        global $CNF, $ME;

        $headers = getallheaders();
        if(!isset($headers['Authorization'])) throw new \Exception("Unauthorized", 401);

        $bearerHeader =  explode(' ', $headers['Authorization']);
        $token = count($bearerHeader) > 1 ? $token = $bearerHeader[1] : $bearerHeader[0];
        

        $result = Token::validate($token, $CNF["auth_secret"]);
        if(!$result) throw new \Exception("Unauthorized", 401);;
        
        $ME = Token::getPayload($token, $CNF["auth_secret"])["user_id"];
    }
}