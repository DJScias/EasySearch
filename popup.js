$(function(){
	var Champion_Font_array = new Array( 'http://www.mobafire.com/league-of-legends/toplist/top-10-', 'http://www.championselect.net/champions/', 'http://www.probuilds.net/champions/');
	var Live_Font_array = new Array( 'http://www.lolnexus.com/server/search?name=nickname&region=server', 'http://www.lolking.net/search?name=nickname&region=server' );

	$('#search_champion').on('keypress', function() {
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
	});
	$(document).on('click', '.showLive', function(e){
		var live_text = $(this).text();
		var live = $(this).attr('data-live');
		$('#showLive').attr('data-live', live).text(live_text);
	});
	$(document).on('click', '.showServer', function(e){
		//var Server_text = $(this).text();
		var Server = $(this).attr('data-server');
		$('#showServer').attr('data-server', Server).text(Server);
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
			alert(Server_final);
			//chrome.tabs.create({url:Server_final});
		};
	});
});