/*
 * Heroes of the Storm Easy Search - HotSES
 *
 * jQuery Heroes of the Storm Easy Search 0.5.0
 *
 * HotSES - https://github.com/DJScias/EasySearch/tree/HoTSES
 * Copyright 2014-2021, HotSES
 *
 * DJScias - https://github.com/DJScias
 *
 * Free to use under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 */

/* Functions
-----------------*/
function startupCheck() {
    storageCheck();
    siteCheck();
    bTagPlayerCheck();
    regionCheck();
    playerSiteCheck();
}

function storageCheck() {
    universeCheck();
}

function universeCheck() {
    chrome.storage.sync.get({
            chosenUniverse: ["0", "All"] // Default Value
        },
        function (data) {
            //console.log(data.chosenUniverse);
            let universe = data.chosenUniverse;
            $('#showUniverse').attr('data-universe', universe[0]).text(universe[1]);
            classCheck(universe);
        }
    );
}

function classCheck(givenUniverse) {
    chrome.storage.sync.get({
            chosenClass: ["0", "All"] // Default Value
        },
        function (data) {
            //console.log(data.chosenClass);
            let heroClass = data.chosenClass;
            $('#showClass').attr('data-class', heroClass[0]).text(heroClass[1]);
            sortLists(givenUniverse, heroClass);
        }
    );
}

function sortLists(givenUniverse, givenHeroClass) {
    let chosenUniverse = givenUniverse; // 0 = ID, 1 = TEXT
    let chosenClass = givenHeroClass; // // 0 = ID, 1 = TEXT
    $('.hero').each(function () {
        let heroClass = $('a', this).data('class');
        let heroUniverse = $('a', this).data('universe');
              
        if (chosenClass[0] > 0 && chosenUniverse[0] > 0) { // if class AND universe is chosen
            (chosenClass[0] == heroClass && chosenUniverse[0] == heroUniverse) ? $(this).show(500): $(this).hide(500);
            return;
        }
        if (chosenClass[0] > 0) { // if a class is chosen
            (chosenClass[0] == heroClass) ? $(this).show(500): $(this).hide(500);
            return;
        }
        if (chosenUniverse[0] > 0) { // if a universe is chosen
            (chosenUniverse[0] == heroUniverse) ? $(this).show(500): $(this).hide(500);
            return;
        }
        $(this).show(500);
        return;
    });
}

function siteCheck() {
    chrome.storage.sync.get({
            chosenSite: ["0", "Gamepedia Wiki"] // Default Value
        },
        function (data) {
            let chosenSite = data.chosenSite;
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
            let chosenBnetPlayer = data.chosenBnetPlayer;
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
            let chosenRegion = data.chosenRegion;
            //console.log(chosenSite);
            $('#showRegion').attr('data-region', chosenRegion[0]).text(chosenRegion[1]);
        }
    );
}

function playerSiteCheck() {
    chrome.storage.sync.get({
            chosenPlayersSite: ["0", "HoTSLogs"] // Default Value
        },
        function (data) {
            let chosenPlayersSite = data.chosenPlayersSite;
            //console.log(chosenSite);
            $('#showPlayers').attr('data-info', chosenPlayersSite[0]).text(chosenPlayersSite[1]);
        }
    );
}

/* B.Net Player Searching
-----------------*/

var Player_api_array = [
    'https://www.hotslogs.com/api/Players/&region&/&battletag&'
];

var Player_info_array = [
    'https://www.hotslogs.com/Player/Profile?PlayerID=&playerId&' // HOTSLogs
];

$('#search_players').keypress(function (e) {
    if (e.which === 32)
        return false;
});

/* Array with build sites
-----------------*/
var Hero_Font_array = [
    'https://heroesofthestorm.fandom.com/wiki/&hero&', //Gamepedia Wiki
    'https://www.heroesfire.com/hots/wiki/heroes/&hero&', //HeroesFire
    'https://www.icy-veins.com/heroes/&hero&-build-guide', //Icy Veins
    'https://www.hotslogs.com/Sitewide/TalentDetails?Hero=&hero&', //HotSlogs
    'http://www.hotsbuilds.info/&hero&', //HotSbuilds
    'https://www.heroescounters.com/hero/&hero&', // Heroescounters
    'https://heroeshearth.com/hero/&hero&/', // HeroesHearth
    'https://psionic-storm.com/en/heroes/&hero&/', // Psionic Storm
];

/* When DOM is ready
-----------------*/
$(function () {
    /* Startup
    -----------------*/
    $("body").css('margin', 1);
    startupCheck();
    $('#search_hero').focus();

    /* Get current version and check for newer
    -----------------*/

    let manifestData = chrome.app.getDetails();
    let localVersion = manifestData.version;
    let remoteData = 'https://scias.net/hotses/info.json';

    $.getJSON(remoteData, function (data) {
        let remoteVersion = data.version;

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

    /* Click handlers for buttons
    -----------------*/

    $('.showRegion').on('click', function () {
        let regionId = $(this).data('region');
        let regionName = $(this).text();
        $('#showRegion').attr('data-region', regionId).text(regionName);
        let storage = [regionId, regionName];

        chrome.storage.sync.set({
            "chosenRegion": storage
        });
    });

    $('.showPlayers').on('click', function () {
        let playerSiteId = $(this).data('info');
        let playerSiteName = $(this).text();
        $('#showPlayers').attr('data-info', playerSiteId).text(playerSiteName);
        let storage = [playerSiteId, playerSiteName];

        chrome.storage.sync.set({
            "chosenPlayersSite": storage
        });
    });

    $('.showClass').on('click', function () {
        let classId = $(this).data('class');
        let className = $(this).attr('title');
        $('#showClass').attr('data-class', classId).text(className);
        let storage = [classId, className];

        chrome.storage.sync.set({
            "chosenClass": storage
        }, function () {
            storageCheck();
        });
    });

    $('.showUniverse').on('click', function () {
        let universeId = $(this).data('universe');
        let universeName = $(this).attr('title');
        $('#showUniverse').attr('data-universe', universeId).text(universeName);
        let storage = [universeId, universeName];

        chrome.storage.sync.set({
            "chosenUniverse": storage
        }, function () {
            storageCheck();
        });
    });

    $('.showSite').on('click', function () {
        let site_text = $(this).text();
        let site = $(this).attr('data-site');
        $('#showSite').attr('data-site', site).text(site_text);
        let storage = [site, site_text];

        chrome.storage.sync.set({
            "chosenSite": storage
        });
    });

    $('.new_link').on('click', function (e) {
        e.preventDefault();
        chrome.tabs.create({
            url: $(this).attr('data-href')
        });
    });

    /* Search hero by name
    -----------------*/
    $('#search_hero').on('keyup', function () {
        let searchText = $(this).val().toLowerCase();
        // Replace lu with lú for Lúcio typing
        searchText = searchText.replace(/\lu/g, "lú");

        $('.hero').each(function () {
            let heroName = $('a', this).attr('i18n_title');
            let i18nName = chrome.i18n.getMessage(heroName).toLowerCase();

            (i18nName.indexOf(searchText) >= 0) ? $(this).show(500): $(this).hide(500);
        });
    });

    /* Search player info in HoTSLogs
    -----------------*/
    $('#search_players').on('keyup', function (e) {
        let code = e.keyCode || e.which; // Recommended to use e.which, it's normalized across browsers
        if (code == 13) {
            let region = $("#showRegion").data('region');
            let site = $("#showPlayers").attr('data-info');
            let battleTag = $("#search_players").val();

            chrome.storage.sync.set({
                "chosenBnetPlayer": battleTag
            });

            switch (site) {
            case "0": // HoTSLogs
                // requires # to be replaced to _
                battleTag = battleTag.replace(/#/g, "_");
                break;
            case "1": // HeroesProfile
                // requires # to be encoded to %23
                battleTag = battleTag.replace(/#/g, "%23");
                break;
            }

            let siteAPILink = Player_api_array[site];
            let apiLink = siteAPILink.replace(/&region&/g, region);
            let apiLink_final = apiLink.replace(/&battletag&/g, battleTag);

            $.getJSON(apiLink_final, function (data) {
                //Grab the region and accountId from the JSON object array and stores them into variables
                let jsonPlayerId = data.PlayerID;
                let playerLink = Player_info_array[site];
                if (typeof jsonPlayerId == 'undefined') {
                    jsonPlayerId = data[0].blizz_id;
                    playerLink = playerLink.replace(/&region&/g, region);
                    battleTag = battleTag.substring(0, battleTag.indexOf('%23'));
                    playerLink = playerLink.replace(/&battletag&/g, battleTag);
                }

                //Prepare the final URL
                let History_final = playerLink.replace(/&playerId&/g, jsonPlayerId);

                chrome.tabs.create({
                    url: History_final
                });
            });
        }
    });


    /* On hero icon click
    -----------------*/

    $('.hero-tab').on('click', function () {
        let site = $("#showSite").attr('data-site');
        let hero = $(this).data('title');
        let strip = false;
        
        switch (site) {
          case "1":
          case "5":
          case "7":
            strip = true;
            break;
          case "2":
            if ($(this).data('icy')) {
                hero = $(this).data('icy');
            } else {
              strip = true;
              hero = hero.toLowerCase();
            }
            break;
        }
        
        if (strip) {
            hero = hero.replace(/\./g, "").replace(/\'/g, "").replace(/\-/g, "");
        }

        //Replace "link" on array with the chosen site
        let live = Hero_Font_array[site];
        //Replace "&hero&" on array with the chosen champions name
        let link_final = live.replace(/&hero&/g, hero);
        chrome.tabs.create({
            url: link_final
        });
    });

    /* Set information for tooltipster
    -----------------*/

    //Start the event of the tooltip
    $('.tooltip').tooltipster();
    $('.tooltip_modal').tooltipster({
        position: 'top'
    });
    $(document).on('click', '.open-about', function () {
        $('#aboutModal').reveal({
            animation: 'fade', //Fade, fadeAndPop, none
            animationspeed: 300, //How fast animtions are
            closeonbackgroundclick: false, //If you click background, will modal close?
        });
    });
});
