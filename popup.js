$(function(){
	var Champion_Font_array = new Array( 'http://www.mobafire.com/league-of-legends/toplist/top-10-', 'ChampionSelect', 'Probuild');
	var Live_Font_array = new Array( 'hello', 'world' );

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
});