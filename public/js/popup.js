$(document).ready(function() {
	// chrome.cookies.get({ name: 'LoL_Font_Champions' },
	// 	function (cookie) {
	// 		if (cookie) {
	// 			console.log(cookie.value);
	// 			var value_cookie = cookie.value;
	// 			var split_cookie = value_cookie.split('-');

	// 			$('#showFont').attr('data-font', split_cookie[0]).text(split_cookie[1]);
	// 		} else {
	// 			console.log('Can\'t get cookie! Check the name!');
	// 		}
	// 	}
	// );
	// chrome.cookies.get({ name: 'LoL_Font_Summoners' },
	// 	function (cookie) {
	// 		if (cookie) {
	// 			console.log(cookie.value);
	// 			var value_cookie = cookie.value;
	// 			var split_cookie = value_cookie.split('-');

	// 			$('#showLive').attr('data-live', split_cookie[0]).text(split_cookie[1]);
	// 		} else {
	// 			console.log('Can\'t get cookie! Check the name!');
	// 		}
	// 	}
	// );
	// chrome.cookies.get({ name: 'LoL_Font_Server' },
	// 	function (cookie) {
	// 		if (cookie) {
	// 			console.log(cookie.value);
	// 			$('#showServer').attr('data-server', cookie.value).text(cookie.value);
	// 		} else {
	// 			console.log('Can\'t get cookie! Check the name!');
	// 		}
	// 	}
	// );
});

$(function(){
	var Champion_Font_array = new Array( 'http://www.mobafire.com/league-of-legends/toplist/top-10-', 'http://www.championselect.net/champions/', 'http://www.probuilds.net/champions/');
	var Live_Font_array = new Array( 'http://www.lolnexus.com/server/search?name=nickname&region=server', 'http://www.lolking.net/search?name=nickname&region=server' );

	$(document).on('keyup', '#search_champion', function(e){
		var searchText = $(this).val().toLowerCase();
		$('.champions_menu>li').each(function(){                
			var currentliID = $(this).attr('id').toLowerCase();
			(currentliID.indexOf(searchText) == 0) ? $(this).show(500) : $(this).hide(500);              
		});
	});
	$('.champion-tab').on('click', function(e){
		var champ = $(this).attr('data-champion');
		chrome.tabs.create({url:'http://www.mobafire.com/league-of-legends/toplist/top-10-'+champ+'-guides'});
	});
	$(document).on('click', '.showFont', function(e){
		var font_text = $(this).text();
		var font = $(this).attr('data-font');
		$('#showFont').attr('data-font', font).text(font_text);
		var cookies_base = font + '&' + font_text;

		// chrome.cookies.remove({
		// 	"name": "LoL_Font_Champions",
		// 	"url" : "chrome-extension://fggndoonclbljilidplhgnbaljdbjeog/*",
		// 	"value": ""
		// });
		chrome.cookies.set({
			"name": "LoL_Font_Champions",
			"url" : "chrome-extension://fggndoonclbljilidplhgnbaljdbjeog/*",
			"value": cookies_base
		});
	});
	$(document).on('click', '.showLive', function(e){
		var live_text = $(this).text();
		var live = $(this).attr('data-live');
		$('#showLive').attr('data-live', live).text(live_text);
		var cookies_base = live + '&' + live_text;

		// chrome.cookies.remove({
		// 	"name": "LoL_Font_Summoners",
		// 	"url" : "chrome-extension://fggndoonclbljilidplhgnbaljdbjeog/*",
		// 	"value": ""
		// });
		chrome.cookies.set({
			"name": "LoL_Font_Summoners",
			"url" : "chrome-extension://fggndoonclbljilidplhgnbaljdbjeog/*",
			"value": cookies_base
		});
	});
	$(document).on('click', '.showServer', function(e){
		//var Server_text = $(this).text();
		var Server = $(this).attr('data-server');
		$('#showServer').attr('data-server', Server).text(Server);

		// chrome.cookies.remove({
		// 	"name": "LoL_Font_Server",
		// 	"url" : "chrome-extension://fggndoonclbljilidplhgnbaljdbjeog/*",
		// 	"value": ""
		// });
		chrome.cookies.set({
			"name": "LoL_Font_Server",
			"url" : "chrome-extension://fggndoonclbljilidplhgnbaljdbjeog/*",
			"value": Server
		});
	});

	$(document).on('keyup', '#search_summoners', function(e){
		var code = e.keyCode || e.which; // recommended to use e.which, it's normalized across browsers
		if(code == 13) { //Enter keycode
			var Server = $("#showServer").attr('data-server');
			var font = $("#showLive").attr('data-live');
			var live = Live_Font_array[font];
			//Replace "server" on array with the choosen server
			var Server_base = live.replace(/server/g, Server);
			//Replace spaces with "+"
			var summoners = $("#search_summoners").val().replace(" ", "+");
			//Replace "nickname" on array with the choosen summoners name
			var Server_final = Server_base.replace("nickname", summoners);
			//alert(Server_final);
			chrome.tabs.create({url:Server_final});
		};
	});

	$('.tooltip').tooltipster();
});