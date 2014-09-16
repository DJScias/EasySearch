/*
 * League of Legends Easy Search - LoLES
 *
 * jQuery League of Legends Fast Search 2.0
 *
 * LoLES - https://github.com/DJScias/LoLES
 * Copyright 2014, LoLES
 *
 * DJScias - https://github.com/DJScias
 * SrPatinhas - https://github.com/SrPatinhas
 *
 * Free to use under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 */

$(function(){


//**************************************************************************************************//
//																									//
//							Functions to do on the beginning of extension							//
//																									//
//**************************************************************************************************//

	//set the variables to the initial value
	$(document).ready(function() {
		$("body").css('margin', 1);


//**************************************************************************************************//
//																									//
//							Fetch cookies that already exist        								//
//																									//
//**************************************************************************************************//

		chrome.cookies.get({ 
				"name": 'LoL_Font_Champions',
				"url":"http://developer.chrome.com/extensions/cookies.html",
			},function (cookie) {
				if (cookie) {
					console.log(cookie.value);
					var value_cookie = cookie.value;
					var split_cookie = value_cookie.split('&');

					$('#showFont').attr('data-font', split_cookie[0]).text(split_cookie[1]);
				} else {
					console.log('Can\'t get cookie! Check the name!');
				}
			}
		);
		chrome.cookies.get({ 
				"name": 'LoL_Font_Summoners',
				"url":"http://developer.chrome.com/extensions/cookies.html",
			},function (cookie) {
				if (cookie) {
					console.log(cookie.value);
					var value_cookie = cookie.value;
					var split_cookie = value_cookie.split('&');

					$('#showLive').attr('data-live', split_cookie[0]).text(split_cookie[1]);
				} else {
					console.log('Can\'t get cookie! Check the name!');
				}
			}
		);
		chrome.cookies.get({ 
				"name": 'LoL_Font_Server',
				"url":"http://developer.chrome.com/extensions/cookies.html",
			},function (cookie) {
				if (cookie) {
					console.log(cookie.value);
					$('#showServer').attr('data-server', cookie.value).text(cookie.value);
				} else {
					console.log('Can\'t get cookie! Check the name!');
				}
			}
		);


//**************************************************************************************************//
//																									//
//							Get Version of current app and check updates 							//
//																									//
//**************************************************************************************************//

		var manifestData = chrome.app.getDetails();

		$.get('update.xml', function(xml){
			$(xml).find('updatecheck').each(function(){
				var $app = $(this); 
				var version = $app.attr("version");
				if (version === manifestData.version) {
					console.info("%s latest version",version);
					$(".version_about").children('span').css('color', 'green').text(manifestData.version);
				} else {
					console.warn("Installed version %s",manifestData.version,", latest version ",version);
					$(".version_about").children('span').css('color', 'red').text(version);
				}
			});
		});
	});


//**************************************************************************************************//
//																									//
//										Array with links to search									//
//																									//
//**************************************************************************************************//

	//array with the links to the search 
	//basic search for champions
	var Champion_Font_array = new Array(
								'http://www.championselect.net/champions/&champ&',                          //ChampionSelect
								'http://www.elophant.com/league-of-legends/champion/&champ&/builds',        //Elophant
								'http://www.lolcounter.com/champions/&champ&',                              //Lol Counter
								'http://leagueoflegends.wikia.com/wiki/&champ&',                            //Lol Wiki
								'http://www.lolbuilder.net/&champ&',                                        //LolBuilder
								'http://www.lolking.net/champions/&champ&',                                 //LolKing
								'http://www.lolpro.com/guides/&champ&',                                     //LolPro
								'http://www.lolskill.net/champion/&champ&',                                 //LolSkill
								'http://www.mobafire.com/league-of-legends/toplist/top-10-&champ&-guides',  //Mobafire
								'http://www.probuilds.net/champions/&champ&',                               //Probuilds
								'http://www.solomid.net/guide?champ=&champ&&featured=0&submitted=0&sort=2'  //Solomid
							);
		var Live_Font_array = new Array( 
								'http://www.elophant.com/league-of-legends/search?query=nickname&region=server',    //Elophant
								'http://www.lolsummoners.com/search?utf8=%E2%9C%93&region=server&name=nickname',    //LoL Summoners
								'http://www.lolking.net/search?name=nickname&region=server',                        //lolKing
								'http://www.lolking.net/now/server/nickname',                                       //lolKing Now
								'http://www.lolnexus.com/server/search?name=nickname&region=server',                //LolNexus
								'http://matchhistory.server.leagueoflegends.com/en/#match-history/region/accountid',//Match History
								'http://server.op.gg/summoner/userName=nickname',                                   //OP GG
								'http://quickfind.kassad.in/profile/server/nickname/'                               //Quickfind
							);

//mobafire - Full / Advanced Search
//example of search link on advanced search
//http://www.mobafire.com/league-of-legends/browse?sort_type=modify_ts&sort_order=desc&champion_id=114&lane=Top&role=AP+Carry&map=Summoner%27s+Rift&guide_type=&threshold=guides&freshness=All&author=

	var full_search = new Array(
								'http://www.mobafire.com/league-of-legends/browse?sort_type=modify_ts&sort_order=desc'+
								'&champion_id=CHAMP_ID_f'+			//champion-id
								'&lane=LANE_f'+						//lane
								'&role=ROLE_f'+						//role
								'&map=MAPS_f'+						//map
								'&guide_type=Champion&threshold=guides&freshness=All&author='
							);


//**************************************************************************************************//
//																									//
//								Search Champion by name on extension								//
//																									//
//**************************************************************************************************//

//search the champions on extension
	$(document).on('keyup', '#search_champion', function(e){
		var searchText = $(this).val().toLowerCase();
		$('.champions_menu>li').each(function(){                
			var currentliID = $(this).attr('id').toLowerCase();
			(currentliID.indexOf(searchText) == 0) ? $(this).show(500) : $(this).hide(500);              
		});
	});


//**************************************************************************************************//
//																									//
//									Full Search Champion selected									//
//																									//
//**************************************************************************************************//

    $('.basic_search').on('click', function(e){
        //Grab the champion's name from the span detailing it
		var champ = $('#search_name').text();
        //Format the champion name to be compatible with Mobafire
        champ = champ.replace(/\./g, ""); // periods
        champ = champ.replace(/'/g,""); // apostrophes
        champ = champ.replace(/\s+/g, '-'); // spaces (replaced with hyphen (-) for mobafire)
		//Replace "link" on array with the chosen site
		var live = Champion_Font_array[0];
		//Replace "&champ&" on array with the chosen champions name
		var link_final = live.replace(/&champ&/g, champ);
        chrome.tabs.create({url:link_final});
	});

//Open the advanced search for mobafire in a new tab
	$('.advanced_search').on('click', function(e){
		var champ = $('#search_name').attr('data-id');
		//Replace "link" on array with the choosen site
		var live = full_search[0];

		var lane = $('#lane_search_base').attr('data-search');
		var role = $('#role_search_base').attr('data-search');
		var map  = $('#map_search_base').attr('data-search');

		//Replace "CHAMP_ID_f", "LANE_f", "ROLE_f", "MAPS_f" on array with the choosen options
		var link_final = live.replace(/CHAMP_ID_f/g, champ);
		link_final = link_final.replace(/LANE_f/g, lane);
		link_final = link_final.replace(/ROLE_f/g, role);
		link_final = link_final.replace(/MAPS_f/g, map);
		console.log(link_final);

		chrome.tabs.create({url:link_final});
	});

//**************************************************************************************************//
//																									//
//									Basic Search Champion selected									//
//																									//
//**************************************************************************************************//

//Open the champion in the choosen site
	$('.champion-tab').on('click', function(e){
		var champ = $(this).attr('data-champion');
		var font = $("#showFont").attr('data-font');
		//Replace "link" on array with the chosen site
		var live = Champion_Font_array[font];
		//Replace "&champ&" on array with the chosen champions name
		var link_final = live.replace(/&champ&/g, champ);
		if (font === "8") {
			$('#search_img').attr('src', $(this).children('img').attr('src'));
			$('#search_name').html($(this).attr('data-title')).attr('data-id', $(this).attr('champion-id'));

			$('#myModal').reveal({
				animation: 'fadeAndPop',				//Fade, fadeAndPop, none
				animationspeed: 100,					//How fast animations are
				closeonbackgroundclick: false,			//If you click background, will modal close?
				dismissmodalclass: 'close-modal'		//The class of a button or element that will close an open modal
			});
		} else{
			chrome.tabs.create({url:link_final});
		}
	});


//**************************************************************************************************//
//																									//
//								Modal Search definition of variables								//
//																									//
//**************************************************************************************************//


//Define variables for modal advanced search
	$(document).on('click', '.showMap', function(e){
		var search = $(this).attr('data-search');
		$('#map_search_base').attr('data-search', search).text($(this).text());
	});
	$(document).on('click', '.showRole', function(e){
		var search = $(this).attr('data-search');
		$('#role_search_base').attr('data-search', search).text($(this).text());
	});
	$(document).on('click', '.showLane', function(e){
		var search = $(this).attr('data-search');
		$('#lane_search_base').attr('data-search', search).text($(this).text());
	});


//**************************************************************************************************//
//																									//
//						Server definition of variables and save it on cookies						//
//																									//
//**************************************************************************************************//


//Choose the font of search of the server of the summoner and set on a cookie to be remembered later
	$(document).on('click', '.showServer', function(e){
		//var Server_text = $(this).text();
		var Server = $(this).attr('data-server');
		$('#showServer').attr('data-server', Server).text(Server);

		chrome.cookies.remove({
			"name": "LoL_Font_Server",
			"url":"http://developer.chrome.com/extensions/cookies.html"
		},function (cookie){
			console.log(JSON.stringify(cookie));
		});

		chrome.cookies.set({
			"name": "LoL_Font_Server",
			"url":"http://developer.chrome.com/extensions/cookies.html",
			"value": Server
		},function (cookie){
			console.log(JSON.stringify(cookie));
		});
	});

//Choose the font of search of the champion and set on a cookie to be remembered later
	$(document).on('click', '.showFont', function(e){
		var font_text = $(this).text();
		var font = $(this).attr('data-font');
		$('#showFont').attr('data-font', font).text(font_text);
		var cookies_base = font + '&' + font_text;

		chrome.cookies.remove({
			"name": "LoL_Font_Champions",
			"url":"http://developer.chrome.com/extensions/cookies.html"
		},function (cookie){
			console.log(JSON.stringify(cookie));
		});

		chrome.cookies.set({
			"name": "LoL_Font_Champions",
			"url":"http://developer.chrome.com/extensions/cookies.html",
			"value": cookies_base
		},function (cookie){
			console.log(JSON.stringify(cookie));
		});
	});

//Choose the font of search of the summoner and set on a cookie to be remembered later
	$(document).on('click', '.showLive', function(e){
		var live_text = $(this).text();
		var live = $(this).attr('data-live');
		$('#showLive').attr('data-live', live).text(live_text);
		var cookies_base = live + '&' + live_text;

		chrome.cookies.remove({
			"name": "LoL_Font_Summoners",
			"url":"http://developer.chrome.com/extensions/cookies.html"
		},function (cookie){
			console.log(JSON.stringify(cookie));
		});

		chrome.cookies.set({
			"name": "LoL_Font_Summoners",
			"url":"http://developer.chrome.com/extensions/cookies.html",
			"value": cookies_base
		},function (cookie){
			console.log(JSON.stringify(cookie));
		});
	});


//**************************************************************************************************//
//																									//
//										Search for the summoners 									//
//																									//
//**************************************************************************************************//

//When the users search the summoners name and then click "enter" the extension opens
// a tab in the selected site with the selected name
	$(document).on('keyup', '#search_summoners', function(e){
		var code = e.keyCode || e.which; // Recommended to use e.which, it's normalized across browsers
		if(code == 13) { //Enter keycode
			var Server = $("#showServer").attr('data-server');
			var font = $("#showLive").attr('data-live');
			var live = Live_Font_array[font];
			if ((font === "0") || (font === "3")) {
				Server = Server.toLowerCase();
			};
			//Replace "server" on array with the choosen server
			var Server_base = live.replace(/server/g, Server);

			if ((font === "0") || (font === "3")) {
				//Replace spaces with "+"
				var summoners = $("#search_summoners").val().replace(" ", "%20");
			} else if (font === "5") {
				//Strip spaces for Match History
				var summoners = $("#search_summoners").val().replace(" ", "");
			} else {
				//Replace spaces with "+"
				var summoners = $("#search_summoners").val().replace(" ", "+");
			}

			//Replace "nickname" on array with the choosen summoners name
			var Server_final = Server_base.replace("nickname", summoners);

			//Extras that need to be done to acquire JSON information for Match History
			if (font === "5") {
				//I have to pass my own site here, as the api from acs.leagueoflegends.com does not allow getJSON from other URLs
				//My own site mirrors the acs.leagueoflegends.com site in this case, making getJSON possible
				var site = 'http://www.scias.net/riotapi/index.php?r=' + Server + '&n=' + summoners;
				$.getJSON(site, function(data){
					//Grab the region and accountId from the JSON object array and stores them into variables
					var region = data.platformId;
					var accountId = data.accountId;

					//Prepare the final URL http://matchhistory.server.leagueoflegends.com/en/#match-history/region/accountid
					var History_prepare = Server_base.replace("region", region);
					var History_final = History_prepare.replace("accountid", accountId);

					chrome.tabs.create({url:History_final});
				}
				);
			} else {
			chrome.tabs.create({url:Server_final});
			}
		};
	});
	$(document).on('click', '.new_link', function(e){
		e.preventDefault();
		chrome.tabs.create({url:$(this).attr('data-href')});
	});


//**************************************************************************************************//
//																									//
//								Basic functions for tooltip and about modal 						//
//																									//
//**************************************************************************************************//

//Start the event of the tooltip
	$('.tooltip').tooltipster();
	$('.tooltip_modal').tooltipster({
		position: 'top'
	});
	$(document).on('click', '.open-about', function(e){
		$('#aboutModal').reveal({
					animation: 'fade',						//Fade, fadeAndPop, none
					animationspeed: 300,					//How fast animtions are
					closeonbackgroundclick: false,			//If you click background, will modal close?
				});
	});
});