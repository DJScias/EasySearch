/*
 * Heroes of the Storm Easy Search - HotSES
 *
 * jQuery Heroes of the Storm Fast Search 2.0
 *
 * HotSES - https://github.com/DJScias/HotSES
 * Copyright 2014, HotSES
 *
 * DJScias - https://github.com/DJScias
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
				"name": 'HotS_Font_Heroes',
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
	var Hero_Font_array = new Array(
								'http://www.heroesfire.com/hots/guides?fHeroes=&hero&',                     //HeroesFire
                                'http://www.ign.com/wikis/heroes-of-the-storm/&hero&',                      //IGN Wiki
								'http://stormable.com/heroes/&hero&'                                        //Stormable
							);

//**************************************************************************************************//
//																									//
//								Search Champion by name on extension								//
//																									//
//**************************************************************************************************//

//search the champions on extension
	$(document).on('keyup', '#search_hero', function(e){
		var searchText = $(this).val().toLowerCase();
		$('.heroes_menu>li').each(function(){                
			var currentliID = $(this).attr('id').toLowerCase();
			(currentliID.indexOf(searchText) == 0) ? $(this).show(500) : $(this).hide(500);              
		});
	});

//**************************************************************************************************//
//																									//
//									Basic Search Champion selected									//
//																									//
//**************************************************************************************************//

//Open the hero in the choosen site
	$('.hero-tab').on('click', function(e){
        var font = $("#showFont").attr('data-font');
        if (font === "0") { //HeroesFire
            var hero = $(this).attr('hero-id');
        } else if (font === "1") { //IGN Wiki
            var hero = $(this).attr('data-title');
        } else { //Stormable (atm)
            var hero = $(this).attr('data-hero');
        }
		//Replace "link" on array with the chosen site
		var live = Hero_Font_array[font];
		//Replace "&hero&" on array with the chosen champions name
		var link_final = live.replace(/&hero&/g, hero);
		chrome.tabs.create({url:link_final});
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

//Choose the font of search of the champion and set on a cookie to be remembered later
	$(document).on('click', '.showFont', function(e){
		var font_text = $(this).text();
		var font = $(this).attr('data-font');
		$('#showFont').attr('data-font', font).text(font_text);
		var cookies_base = font + '&' + font_text;

		chrome.cookies.remove({
			"name": "HotS_Font_Heroes",
			"url":"http://developer.chrome.com/extensions/cookies.html"
		},function (cookie){
			console.log(JSON.stringify(cookie));
		});

		chrome.cookies.set({
			"name": "HotS_Font_Heroes",
			"url":"http://developer.chrome.com/extensions/cookies.html",
			"value": cookies_base
		},function (cookie){
			console.log(JSON.stringify(cookie));
		});
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