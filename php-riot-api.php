<?php
// --------------------------------------------------------------------------------------------------------
// PHP Riot API
// Queries the Riot API to obtain information back in JSON
// Created for Scias.net by DJScias
// Dependencies used from https://github.com/kevinohashi/php-riot-api (credit given where credit due)
// Example url
// http://www.scias.net/riotapi/php-riot-api.php?r=<region>&n=<username>
// <region> = na/euw/...
// <username> = username without spaces
// --------------------------------------------------------------------------------------------------------

include('dependencies/php-riot-api.php');
$unformatted_region = $_GET['r'];
$region = strtolower($unformatted_region);
$unformatted_name = $_GET['n'];
$summoner_name = strtolower($unformatted_name);

$request = new riotapi($region);
$r = $request->getSummonerId($summoner_name);
$t = $request->getStats($r);
$t = $request->getSummoner($r);

print_r($t);
?>