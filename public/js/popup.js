$(function(){
	//set the variables to the initial value
	$(document).ready(function() {
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
	});

//array with the links to the search
	var Champion_Font_array = new Array('http://www.mobafire.com/league-of-legends/toplist/top-10-&champ&-guides', 'http://www.championselect.net/champions/&champ&', 'http://www.probuilds.net/champions/&champ&', 'http://www.solomid.net/guide?champ=&champ&&featured=0&submitted=0&sort=2' );
	var Live_Font_array = new Array('http://www.lolnexus.com/server/search?name=nickname&region=server', 'http://www.lolking.net/search?name=nickname&region=server');

//search the champions on extension
	$(document).on('keyup', '#search_champion', function(e){
		var searchText = $(this).val().toLowerCase();
		$('.champions_menu>li').each(function(){                
			var currentliID = $(this).attr('id').toLowerCase();
			(currentliID.indexOf(searchText) == 0) ? $(this).show(500) : $(this).hide(500);              
		});
	});

//open the champion in the choosen site
	$('.champion-tab').on('click', function(e){
		var champ = $(this).attr('data-champion');
		var font = $("#showFont").attr('data-font');
		//Replace "link" on array with the choosen site
		var live = Champion_Font_array[font];
		//Replace "&champ&" on array with the choosen champions name
		var link_final = live.replace(/&champ&/g, champ);

		chrome.tabs.create({url:link_final});
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

//when the users search the summoners name and then click "enter" the extension opens
// a tab in the selected site and with the name searched
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

			chrome.tabs.create({url:Server_final});
		};
	});

//start the event of the tooltip
	$('.tooltip').tooltipster();
});