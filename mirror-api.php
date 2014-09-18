<?php
// ----------------------------------------------------------------------------------------------
// Riot API Mirror
// Mirrors the acs.leagueoflegends.com website for JSON requests
// Created for Scias.net by DJScias
// Example url
// http://www.scias.net/riotapi/mirror-api.php?r=<region>&n=<username>
// <region> = na/euw/...
// <username> = username without spaces
// ----------------------------------------------------------------------------------------------

$unformatted_region = $_GET['r'];
$region = strtoupper($unformatted_region);
$unformatted_name = $_GET['n'];
$summoner_name = strtolower($unformatted_name);
$website = "https://acs.leagueoflegends.com/v1/players?name=" . $summoner_name . "&region=" . $region;
$homepage = file_get_contents($website);
echo $homepage;
?>