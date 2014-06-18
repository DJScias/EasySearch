$(function(){
	//set the variables to the initial value
	$(document).ready(function() {
		$("body").css('margin', 1);
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

//array with the links to the search
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
								'http://www.lolking.net/search?name=nickname&region=server',
								'http://www.lolking.net/now/server/nickname',
								'http://www.lolnexus.com/server/search?name=nickname&region=server',
								'http://server.op.gg/summoner/userName=nickname',
								'http://www.elophant.com/league-of-legends/search?query=nickname&region=server'
							);

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
		if (font === "0") {
			$('#myModal').reveal({
				animation: 'fade',						//fade, fadeAndPop, none
				animationspeed: 300,					//how fast animtions are
				closeonbackgroundclick: false,			//if you click background will modal close?
				dismissmodalclass: 'close-reveal-modal'	//the class of a button or element that will close an open modal
			});
		} else{
			chrome.tabs.create({url:link_final});
		}
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

//start the event of the tooltip
	$('.tooltip').tooltipster();

	$(document).on('click', '.open-about', function(e){
		$('#aboutModal').reveal({
					animation: 'fade',						//fade, fadeAndPop, none
					animationspeed: 300,					//how fast animtions are
					closeonbackgroundclick: false,			//if you click background will modal close?
					dismissmodalclass: 'close-reveal-modal'	//the class of a button or element that will close an open modal
				});
	});
});

// options to full search
	function DropDown(el) {
		this.dd = el;
		this.placeholder = this.dd.children('span');
		this.opts = this.dd.find('ul.dropdown > li');
		this.val = '';
		this.index = -1;
		this.initEvents();
	}
	DropDown.prototype = {
		initEvents : function() {
			var obj = this;

			obj.dd.on('click', function(event){
				$(this).toggleClass('active');
				return false;
			});

			obj.opts.on('click',function(){
				var opt = $(this);
				obj.val = opt.text();
				obj.index = opt.index();
				obj.placeholder.text(obj.val);
			});
		},
		getValue : function() {
			return this.val;
		},
		getIndex : function() {
			return this.index;
		}
	}
	$(function() {
		var dd = new DropDown($('#dd_lane'));
		var dd = new DropDown($('#dd_role'));
		var dd = new DropDown($('#dd_map'));
		$(document).click(function() {
			// all dropdowns
			$('.fullSearch-dropdown').removeClass('active');
		});
	});
//mobafire
																														  //champion-id 		  //lane  	 //role		 //map
	var full_search = new Array("http://www.mobafire.com/league-of-legends/browse?sort_type=score_weighted&sort_order=desc&champion_id=&&CHAMP_ID&&lane=&LANE&&role=&ROLE&&map=&MAPS&&guide_type=Champion&threshold=guides&freshness=All&author=");