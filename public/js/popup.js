/*
 * Heroes of the Storm Easy Search - HotSES
 *
 * jQuery Heroes of the Storm Easy Search 0.3.0
 *
 * HotSES - https://github.com/DJScias/HotSES
 * Copyright 2014-2018, HotSES
 *
 * DJScias - https://github.com/DJScias
 *
 * Free to use under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 */

/* Startup check
Storage + Setting Values
-----------------*/
function startupCheck() {
    storageCheck();
    siteCheck();
    bTagPlayerCheck();
    regionCheck();
}

function storageCheck() {
    universeCheck();
}

function universeCheck() {
    var universe;

    chrome.storage.sync.get({
            chosenUniverse: ["0", "All"] // Default Value
        },
        function (data) {
            //console.log(data.chosenUniverse);
            universe = data.chosenUniverse;
            $('#showUniverse').attr('data-universe', universe[0]).text(universe[1]);
            classCheck(universe);
        }
    );
}

function classCheck(givenUniverse) {
    var heroClass;

    chrome.storage.sync.get({
            chosenClass: ["0", "All"] // Default Value
        },
        function (data) {
            //console.log(data.chosenClass);
            heroClass = data.chosenClass;
            $('#showClass').attr('data-class', heroClass[0]).text(heroClass[1]);
            sortLists(givenUniverse, heroClass);
        }
    );
}

function sortLists(givenUniverse, givenHeroClass) {
    var chosenUniverse = givenUniverse; // 0 = ID, 1 = TEXT
    var chosenClass = givenHeroClass; // // 0 = ID, 1 = TEXT
    $('.hero').each(function () {
        var heroClass = $('a', this).data('class');
        var heroUniverse = $('a', this).data('universe');
        var multiClass = false;
        if (heroClass == 5)
            multiClass = true;

        if (multiClass) {
            var classOne = $('a', this).data('multiclass1');
            var classTwo = $('a', this).data('multiclass2');
            if (chosenUniverse[0] > 0) // if an universe is also given, filter on that too!
                (chosenUniverse[0] == heroUniverse && (chosenClass[0] == heroClass || chosenClass[0] == classOne || chosenClass[0] == classTwo)) ? $(this).show(500) : $(this).hide(500);
            else
                (chosenClass[0] == heroClass || chosenClass[0] == classOne || chosenClass[0] == classTwo) ? $(this).show(500) : $(this).hide(500);
        } else if (!multiClass) { // if not multi-class
            if (chosenClass[0] > 0 && chosenUniverse[0] > 0) { // if class AND universe is chosen
                (chosenClass[0] == heroClass && chosenUniverse[0] == heroUniverse) ? $(this).show(500): $(this).hide(500);
            } else if (chosenClass[0] > 0 && chosenUniverse[0] == 0) { // if a class is chosen
                (chosenClass[0] == heroClass) ? $(this).show(500): $(this).hide(500);
            } else if (chosenUniverse[0] > 0 && chosenClass[0] == 0) { // if a universe is chosen
                (chosenUniverse[0] == heroUniverse) ? $(this).show(500): $(this).hide(500);
            } else {
                $('.hero').show(500);
            }
        }
    });
}

function siteCheck() {
    chrome.storage.sync.get({
            chosenSite: ["0", "Gamepedia Wiki"] // Default Value
        },
        function (data) {
            chosenSite = data.chosenSite;
            //console.log(chosenSite);
            $('#showSite').attr('data-site', chosenSite[0]).text(chosenSite[1]);
        }
    );
}

function bTagPlayerCheck() {
    chrome.storage.sync.get({
            chosenBnetPlayer: "" // Default Value
        },
        function (data) {
            chosenBnetPlayer = data.chosenBnetPlayer;
            //console.log(chosenSite);
            $('#search_players').val(chosenBnetPlayer);
        }
    );
}

function regionCheck() {
    chrome.storage.sync.get({
            chosenRegion: ["1", "US"] // Default Value
        },
        function (data) {
            chosenRegion = data.chosenRegion;
            //console.log(chosenSite);
            $('#showRegion').attr('data-region', chosenRegion[0]).text(chosenRegion[1]);
        }
    );
}

$(function () {
    //**************************************************************************************************//
    //																									//
    //							Functions to do on the beginning of extension							//
    //																									//
    //**************************************************************************************************//
    $("body").css('margin', 1);
    startupCheck();

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

    chrome.storage.sync.set({
        "chosenBnetPlayer": battleTag
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
    'http://hotscounters.com/#/hero/&hero&', // HotSCounters
    'https://www.heroescounters.com/hero/&hero&', // Heroescounters
    'https://heroeshearth.com/hero/&hero&/', // HeroesHearth
    'https://psionic-storm.com/en/heros/&hero&/', // Psionic Storm
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
    let site = $("#showSite").attr('data-site');
    let hero = "";
    let strip_most = false;
    let strip_all = false;
    let choose_lower = false;
    let choose_id = false;
    switch (site) {
    case "1":
        choose_lower = true;
        strip_most = true;
        break;
    case "2":
        choose_lower = true;
        break;
    case "3":
        choose_id = true;
        break;
    case "4":
        break;
    case "5":
        break;
    case "6":
        choose_lower = true;
        strip_all = true;
        break;
    case "7":
        choose_lower = true;
        strip_all = true;
        break;
    case "8":
    case "9":
        choose_lower = true;
        strip_most = true;
        break;
    }

    if (choose_lower) {
        hero = $(this).data('lower'); // Lower is used by HeroesFire and Icy-Veins
        // Special characters changed to nothing (not including dash)
        if (strip_most || strip_all) {
            hero = hero.replace(/\./g, "");
            hero = hero.replace(/\'/g, "");
            if (strip_all) // get rid of dash too
                hero = hero.replace(/\-/g, "");
        }
        // Icy is inconsistent, if we find a data-icy, we use that
        if (site === "2" && $(this).data('icy')) {
            hero = $(this).data('icy');
        }
    } else if (choose_id) {
        hero = $(this).data('id');
    } else { //Gamepedia Wiki
        hero = $(this).data('title');
    }

    //Replace "link" on array with the chosen site
    let live = Hero_Font_array[site];
    //Replace "&hero&" on array with the chosen champions name
    let link_final = live.replace(/&hero&/g, hero);
    chrome.tabs.create({
        url: link_final
    });
});

//**************************************************************************************************//
//																									//
//						Server definition of variables and save it as sync storge						//
//																									//
//**************************************************************************************************//

$(document).on('click', '.showRegion', function (e) {
    //var Server_text = $(this).text();
    var regionId = $(this).data('region');
    var regionName = $(this).text();
    $('#showRegion').attr('data-region', regionId).text(regionName);
    var cookies_base = regionId + '&' + regionName;
    var storage = [regionId, regionName];

    chrome.storage.sync.set({
        "chosenRegion": storage
    });
});

$(document).on('click', '.showClass', function (e) {
    //var Server_text = $(this).text();
    var classId = $(this).data('class');
    var className = $(this).text();
    $('#showClass').attr('data-class', classId).text(className);
    var cookies_base = classId + '&' + className;
    var storage = [classId, className];

    chrome.storage.sync.set({
        "chosenClass": storage
    }, function () {
        storageCheck();
    });
});

$(document).on('click', '.showUniverse', function (e) {
    //var Server_text = $(this).text();
    var universeId = $(this).data('universe');
    var universeName = $(this).text();
    $('#showUniverse').attr('data-universe', universeId).text(universeName);
    var cookies_base = universeId + '&' + universeName;
    var storage = [universeId, universeName];

    chrome.storage.sync.set({
        "chosenUniverse": storage
    }, function () {
        storageCheck();
    });
});

$(document).on('click', '.showSite', function (e) {
    var site_text = $(this).text();
    var site = $(this).attr('data-site');
    $('#showSite').attr('data-site', site).text(site_text);
    var cookies_base = site + '&' + site_text;
    var storage = [site, site_text];

    chrome.storage.sync.set({
        "chosenSite": storage
    });
});

$(document).on('click', '.new_link', function (e) {
    e.preventDefault();
    chrome.tabs.create({
        url: $(this).attr('data-href')
    });
});
