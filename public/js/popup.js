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

$(function () {


    //**************************************************************************************************//
    //																									//
    //							Functions to do on the beginning of extension							//
    //																									//
    //**************************************************************************************************//

    //set the variables to the initial value
    $(document).ready(function () {
        $("body").css('margin', 1);


        //**************************************************************************************************//
        //																									//
        //							Fetch cookies that already exist        								//
        //																									//
        //**************************************************************************************************//

        chrome.cookies.get({
            "name": 'HotS_Font_Heroes',
            "url": "http://developer.chrome.com/extensions/cookies.html",
        }, function (cookie) {
            if (cookie) {
                var value_cookie = cookie.value;
                var split_cookie = value_cookie.split('&');

                $('#showFont').attr('data-font', split_cookie[0]).text(split_cookie[1]);
            }
        });
        chrome.cookies.get({
            "name": 'HotS_Btag_Players',
            "url": "http://developer.chrome.com/extensions/cookies.html",
        }, function (cookie) {
            if (cookie) {
                $('#search_players').val(cookie.value);
            }
        });
        chrome.cookies.get({
            "name": 'HotS_Font_Class',
            "url": "http://developer.chrome.com/extensions/cookies.html",
        }, function (cookie) {
            if (cookie) {
                var value_cookie = cookie.value;
                var split_cookie = value_cookie.split('&');

                $('#showClass').attr('data-class', split_cookie[0]).text(split_cookie[1]);

                $('.hero').each(function () {
                    var heroClass = $('a', this).data('class');

                    if (split_cookie[0] == 5 && Object.prototype.toString.call(heroClass) == '[object String]') { // multi-class is 5 and always string
                        (Object.prototype.toString.call(heroClass) == '[object String]') ? $(this).show(): $(this).hide();
                    } else if (split_cookie[0] > 0) {
                        // if multi-class, it's a string and we check on that
                        if (Object.prototype.toString.call(heroClass) == '[object String]')
                            (heroClass.indexOf(split_cookie[0]) > -1) ? $(this).show() : $(this).hide();
                        else
                            (heroClass == split_cookie[0]) ? $(this).show() : $(this).hide();
                    } else
                        $('.hero').show();
                });
            }
        });
        chrome.cookies.get({
            "name": 'HotS_Font_Universe',
            "url": "http://developer.chrome.com/extensions/cookies.html",
        }, function (cookie) {
            if (cookie) {
                var value_cookie = cookie.value;
                var split_cookie = value_cookie.split('&');

                $('#showUniverse').attr('data-universe', split_cookie[0]).text(split_cookie[1]);

                $('.hero').each(function () {
                    var heroUniverse = $('a', this).data('universe');

                    if (split_cookie[0] == 5 && Object.prototype.toString.call(heroUniverse) == '[object String]') { // multi-class is 5 and always string
                        (Object.prototype.toString.call(heroUniverse) == '[object String]') ? $(this).show(): $(this).hide();
                    } else if (split_cookie[0] > 0) {
                        // if multi-class, it's a string and we check on that
                        if (Object.prototype.toString.call(heroUniverse) == '[object String]')
                            (heroUniverse.indexOf(split_cookie[0]) > -1) ? $(this).show() : $(this).hide();
                        else
                            (heroUniverse == split_cookie[0]) ? $(this).show() : $(this).hide();
                    } else
                        $('.hero').show();
                });
            }
        });
        chrome.cookies.get({
            "name": 'HotS_Font_Region',
            "url": "http://developer.chrome.com/extensions/cookies.html",
        }, function (cookie) {
            if (cookie) {
                var value_cookie = cookie.value;
                var split_cookie = value_cookie.split('&');

                $('#showRegion').attr('data-region', split_cookie[0]).text(split_cookie[1]);
            }
        });

        //**************************************************************************************************//
        //																									//
        //							Get Version of current app and check updates 							//
        //																									//
        //**************************************************************************************************//

        var manifestData = chrome.app.getDetails();
        var localVersion = manifestData.version;
        var remoteData = 'http://scias.net/hotses/info.json';

        $.getJSON(remoteData, function (data) {
            var remoteVersion = data.version;

            if (localVersion === remoteVersion) {
                $(".version_about").children('b').css('color', 'green').text(localVersion);
                $(".version_about").attr('title', chrome.i18n.getMessage("latest_version"));
            } else {
                $(".version_about").children('b').css('color', 'red').text(localVersion);
                $(".version_about").attr('title', chrome.i18n.getMessage("new_version", remoteVersion));
            }
            $(".version_about").addClass("tooltip");
            $(".version_about").tooltipster();

        });
    });

    //**************************************************************************************************//
    //																									//
    //										Array with links to search									//
    //																									//
    //**************************************************************************************************//

    var Player_info_array = new Array(
        'https://www.hotslogs.com/Player/Profile?PlayerID=&playerId&' // HOTSLogs
    );

    $('#search_players').keypress(function (e) {
        if (e.which === 32)
            return false;
    });

    $(document).on('keyup', '#search_players', function (e) {
        var code = e.keyCode || e.which; // Recommended to use e.which, it's normalized across browsers
        var battleTag = $("#search_players").val();

        chrome.cookies.remove({
            "name": "HotS_Btag_Players",
            "url": "http://developer.chrome.com/extensions/cookies.html"
        }, function (cookie) {
            console.log(JSON.stringify(cookie));
        });

        chrome.cookies.set({
            "name": "HotS_Btag_Players",
            "url": "http://developer.chrome.com/extensions/cookies.html",
            "value": battleTag
        }, function (cookie) {
            console.log(JSON.stringify(cookie));
        });

        if (code == 13) {
            var region = $("#showRegion").data('region');
            var showInfo = $("#showPlayers").data('info');
            battleTag = $("#search_players").val();

            // HOTSLogs requires # to be replaced to _
            battleTag = battleTag.replace(/#/g, "_");

            var hotslogsAPI = 'https://api.hotslogs.com/Public/Players/&region&/&battletag&';

            var apiLink = hotslogsAPI.replace(/&region&/g, region);

            var apiLink_final = apiLink.replace(/&battletag&/g, battleTag);

            $.getJSON(apiLink_final, function (data) {
                //Grab the region and accountId from the JSON object array and stores them into variables
                var jsonPlayerId = data.PlayerID;

                //Prepare the final URL
                var playerLink = Player_info_array[showInfo];
                var History_final = playerLink.replace(/&playerId&/g, jsonPlayerId);

                chrome.tabs.create({
                    url: History_final
                });
            });
        }
    });

    //array with the links to the search
    //basic search for champions
    var Hero_Font_array = [
        'https://heroesofthestorm.gamepedia.com/&hero&', //Gamepedia Wiki
        'https://www.heroesfire.com/hots/wiki/heroes/&hero&', //HeroesFire
        'https://www.icy-veins.com/heroes/&hero&-build-guide', //Icy Veins
        'https://stormspy.net/builds?hero=&hero&', //StormSpy
		'https://www.hotslogs.com/Sitewide/HeroDetails?Hero=&hero&', //HotSlogs
		'http://www.hotsbuilds.info/&hero&', //HotSbuilds
    ];

    //**************************************************************************************************//
    //																									//
    //								Search Champion by name on extension								//
    //																									//
    //**************************************************************************************************//

    //search the champions on extension
    $(document).on('keyup', '#search_hero', function (e) {
        var searchText = $(this).val().toLowerCase();
        // Replace lu with lú for Lúcio typing
        searchText = searchText.replace(/\lu/g, "lú");

        $('.hero').each(function () {
            var heroName = $('a', this).attr('i18n_title');
            var i18nName = chrome.i18n.getMessage(heroName).toLowerCase();

            (i18nName.indexOf(searchText) >= 0) ? $(this).show(500): $(this).hide(500);
        });
    });

    //**************************************************************************************************//
    //																									//
    //									Basic Search Champion selected									//
    //																									//
    //**************************************************************************************************//

    //Open the hero in the chosen site
    $('.hero-tab').on('click', function (e) {
        let font = $("#showFont").attr('data-font');
        let hero = "";
        if (font === "1" || font === "2") {
            hero = $(this).data('lower'); // Lower is used by HeroesFire and Icy-Veins
            // Special characters on heroesFire get changed to nothing
            if (font === "1") {
                hero = hero.replace(/\./g, "");
                hero = hero.replace(/\'/g, "");
            }
            // Icy is inconsistent, if we find a data-icy, we use that
            if (font === "2" && $(this).data('icy')) {
                hero = $(this).data('icy');
            }
        } else if (font === "3") {
            hero = $(this).data('id');
        } else { //Gamepedia Wiki
            hero = $(this).data('title');
        }

        //Replace "link" on array with the chosen site
        let live = Hero_Font_array[font];
        //Replace "&hero&" on array with the chosen champions name
        let link_final = live.replace(/&hero&/g, hero);
        chrome.tabs.create({
            url: link_final
        });
    });

    //**************************************************************************************************//
    //																									//
    //								Modal Search definition of variables								//
    //																									//
    //**************************************************************************************************//

    //Define variables for modal advanced search
    $(document).on('click', '.showMap', function (e) {
        var search = $(this).attr('data-search');
        $('#map_search_base').attr('data-search', search).text($(this).text());
    });
    $(document).on('click', '.showRole', function (e) {
        var search = $(this).attr('data-search');
        $('#role_search_base').attr('data-search', search).text($(this).text());
    });
    $(document).on('click', '.showLane', function (e) {
        var search = $(this).attr('data-search');
        $('#lane_search_base').attr('data-search', search).text($(this).text());
    });

    //**************************************************************************************************//
    //																									//
    //						Server definition of variables and save it on cookies						//
    //																									//
    //**************************************************************************************************//

    //Choose the font of search of the server of the summoner and set on a cookie to be remembered later
    $(document).on('click', '.showRegion', function (e) {
        //var Server_text = $(this).text();
        var regionId = $(this).data('region');
        var regionName = $(this).text();
        $('#showRegion').attr('data-region', regionId).text(regionName);
        var cookies_base = regionId + '&' + regionName;

        chrome.cookies.remove({
            "name": "HotS_Font_Region",
            "url": "http://developer.chrome.com/extensions/cookies.html"
        }, function (cookie) {
            console.log(JSON.stringify(cookie));
        });

        chrome.cookies.set({
            "name": "HotS_Font_Region",
            "url": "http://developer.chrome.com/extensions/cookies.html",
            "value": cookies_base
        }, function (cookie) {
            console.log(JSON.stringify(cookie));
        });
    });

    //Choose the font of search of the server of the summoner and set on a cookie to be remembered later
    $(document).on('click', '.showClass', function (e) {
        //var Server_text = $(this).text();
        var classId = $(this).data('class');
        var className = $(this).text();
        $('#showClass').attr('data-class', classId).text(className);
        var cookies_base = classId + '&' + className;

        $('.hero').each(function () {
            var heroClass = $('a', this).data('class');

            if (classId == 5 && Object.prototype.toString.call(heroClass) == '[object String]') { // multi-class is 5 and always string
                (Object.prototype.toString.call(heroClass) == '[object String]') ? $(this).show(500): $(this).hide(500);
            } else if (classId > 0) {
                // if multi-class, it's a string and we check on that
                if (Object.prototype.toString.call(heroClass) == '[object String]')
                    (heroClass.indexOf(classId) > -1) ? $(this).show(500) : $(this).hide(500);
                else
                    (heroClass == classId) ? $(this).show(500) : $(this).hide(500);
            } else
                $('.hero').show(500);
        });

        chrome.cookies.remove({
            "name": "HotS_Font_Class",
            "url": "http://developer.chrome.com/extensions/cookies.html"
        }, function (cookie) {
            console.log(JSON.stringify(cookie));
        });

        chrome.cookies.set({
            "name": "HotS_Font_Class",
            "url": "http://developer.chrome.com/extensions/cookies.html",
            "value": cookies_base
        }, function (cookie) {
            console.log(JSON.stringify(cookie));
        });
    });

    $(document).on('click', '.showUniverse', function (e) {
        //var Server_text = $(this).text();
        var universeId = $(this).data('universe');
        var universeName = $(this).text();
        $('#showUniverse').attr('data-universe', universeId).text(universeName);
        var cookies_base = universeId + '&' + universeName;

        $('.hero').each(function () {
            var heroUniverse = $('a', this).data('universe');

            if (universeId == 5 && Object.prototype.toString.call(heroUniverse) == '[object String]') { // multi-class is 5 and always string
                (Object.prototype.toString.call(heroUniverse) == '[object String]') ? $(this).show(500): $(this).hide(500);
            } else if (universeId > 0) {
                // if multi-class, it's a string and we check on that
                if (Object.prototype.toString.call(heroUniverse) == '[object String]')
                    (heroUniverse.indexOf(universeId) > -1) ? $(this).show(500) : $(this).hide(500);
                else
                    (heroUniverse == universeId) ? $(this).show(500) : $(this).hide(500);
            } else
                $('.hero').show(500);
        });

        chrome.cookies.remove({
            "name": "HotS_Font_Universe",
            "url": "http://developer.chrome.com/extensions/cookies.html"
        }, function (cookie) {
            console.log(JSON.stringify(cookie));
        });

        chrome.cookies.set({
            "name": "HotS_Font_Universe",
            "url": "http://developer.chrome.com/extensions/cookies.html",
            "value": cookies_base
        }, function (cookie) {
            console.log(JSON.stringify(cookie));
        });
    });

    //Choose the font of search of the champion and set on a cookie to be remembered later
    $(document).on('click', '.showFont', function (e) {
        var font_text = $(this).text();
        var font = $(this).attr('data-font');
        $('#showFont').attr('data-font', font).text(font_text);
        var cookies_base = font + '&' + font_text;

        chrome.cookies.remove({
            "name": "HotS_Font_Heroes",
            "url": "http://developer.chrome.com/extensions/cookies.html"
        }, function (cookie) {
            console.log(JSON.stringify(cookie));
        });

        chrome.cookies.set({
            "name": "HotS_Font_Heroes",
            "url": "http://developer.chrome.com/extensions/cookies.html",
            "value": cookies_base
        }, function (cookie) {
            console.log(JSON.stringify(cookie));
        });
    });

    $(document).on('click', '.new_link', function (e) {
        e.preventDefault();
        chrome.tabs.create({
            url: $(this).attr('data-href')
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
    $(document).on('click', '.open-about', function (e) {
        $('#aboutModal').reveal({
            animation: 'fade', //Fade, fadeAndPop, none
            animationspeed: 300, //How fast animtions are
            closeonbackgroundclick: false, //If you click background, will modal close?
        });
    });
});
