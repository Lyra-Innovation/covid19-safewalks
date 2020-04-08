<?php

namespace Safewalks\Repository;

class User extends BaseRepository {
    static protected $tablename = "User";
    
    static protected $excludes = ["password"];
}