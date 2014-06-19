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
//							Fecth cookies that can be already exist									//
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
					console.info("%s versao atualizada",version);
					$(".version_about").children('span').css('color', 'green').text(manifestData.version);
				} else {
					console.warn("Versao instalada %s",manifestData.version,", versao disponivel ",version);
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
								'http://www.mobafire.com/league-of-legends/toplist/top-10-&champ&-guides',	//Mobafire
								'http://www.championselect.net/champions/&champ&',							//ChampionSelect
								'http://www.probuilds.net/champions/&champ&',								//Probuilds
								'http://www.solomid.net/guide?champ=&champ&&featured=0&submitted=0&sort=2',	//Solomid
								'http://www.lolpro.com/guides/&champ&',										//LolPro
								'http://www.lolbuilder.net/&champ&',										//LolBuilder
								'http://www.lolking.net/champions/&champ&',									//LolKing
								'http://www.lolskill.net/champion/&champ&',									//LolSkill
								'http://leagueoflegends.wikia.com/wiki/&champ&',							//Lol Wiki
								'http://www.elophant.com/league-of-legends/champion/&champ&/builds'			//Elophant
							);
		var Live_Font_array = new Array( 
								'http://www.lolking.net/search?name=nickname&region=server',					//lolKing
								'http://www.lolking.net/now/server/nickname',									//lolKing now
								'http://www.lolnexus.com/server/search?name=nickname&region=server',			//LolNexus
								'http://server.op.gg/summoner/userName=nickname',								//OP GG
								'http://www.elophant.com/league-of-legends/search?query=nickname&region=server'	//Elophant
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

//open the advanced search for mobafire in a new tab
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

//open the champion in the choosen site
	$('.champion-tab').on('click', function(e){
		var champ = $(this).attr('data-champion');
		var font = $("#showFont").attr('data-font');
		//Replace "link" on array with the choosen site
		var live = Champion_Font_array[font];
		//Replace "&champ&" on array with the choosen champions name
		var link_final = live.replace(/&champ&/g, champ);
		if (font === "0") {
			$('#search_img').attr('src', $(this).children('img').attr('src'));
			$('#search_name').html($(this).attr('data-title')).attr('data-id', $(this).attr('champion-id'));

			$('#myModal').reveal({
				animation: 'fadeAndPop',				//fade, fadeAndPop, none
				animationspeed: 100,					//how fast animtions are
				closeonbackgroundclick: false,			//if you click background will modal close?
				dismissmodalclass: 'close-modal'		//the class of a button or element that will close an open modal
			});
		} else{
			chrome.tabs.create({url:link_final});
		}
	});


//**************************************************************************************************//
//																									//
//								Open a Tab with the links from about modal							//
//																									//
//**************************************************************************************************//

//open the champion in the choosen site
	$('.font-tab').on('click', function(e){
		var font = $(this).attr('data-link');
		//Replace "link" on array with the choosen site
		var live = Site_Font_array[font];
		
		chrome.tabs.create({url:live});
	});


//**************************************************************************************************//
//																									//
//								Modal Search definition of variables								//
//																									//
//**************************************************************************************************//


//define variables for modal advanced search
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


//choose the font of search of the server of the summoner and set on a cookie to be remembered late
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

//choose the font of search of the champion and set on a cookie to be remembered late
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

//choose the font of search of the summoner and set on a cookie to be remembered late
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

//when the users search the summoners name and then click "enter" the extension opens
// a tab in the selected site and with the name searched
	$(document).on('keyup', '#search_summoners', function(e){
		var code = e.keyCode || e.which; // recommended to use e.which, it's normalized across browsers
		if(code == 13) { //Enter keycode
			var Server = $("#showServer").attr('data-server');
			var font = $("#showLive").attr('data-live');
			var live = Live_Font_array[font];
			if ((font === "1") || (font === "4")) {
				Server = Server.toLowerCase();
			};
			//Replace "server" on array with the choosen server
			var Server_base = live.replace(/server/g, Server);

			if ((font === "1") || (font === "4")) {
				//Replace spaces with "+"
				var summoners = $("#search_summoners").val().replace(" ", "%20");
			} else {
				//Replace spaces with "+"
				var summoners = $("#search_summoners").val().replace(" ", "+");
			}

			//Replace "nickname" on array with the choosen summoners name
			var Server_final = Server_base.replace("nickname", summoners);

			chrome.tabs.create({url:Server_final});
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

//start the event of the tooltip
	$('.tooltip').tooltipster();
	$('.tooltip_modal').tooltipster({
		position: 'top'
	});
	$(document).on('click', '.open-about', function(e){
		$('#aboutModal').reveal({
					animation: 'fade',						//fade, fadeAndPop, none
					animationspeed: 300,					//how fast animtions are
					closeonbackgroundclick: false,			//if you click background will modal close?
				});
	});
});