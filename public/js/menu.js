$(function () {
    var activeElement = $('.cssmenu>ul>li:first');

    $('.cssmenu>ul>li').each(function () {
        if ($(this).hasClass('active')) {
            activeElement = $(this);
        }
    });


    var posLeft = activeElement.position().left;
    var elementWidth = activeElement.width();
    posLeft = posLeft + elementWidth / 2 - 6;
    if (activeElement.hasClass('has-sub')) {
        posLeft -= 6;
    }

    $('.cssmenu .pIndicator').css('left', posLeft);
    var element, leftPos, indicator = $('.cssmenu pIndicator');

    $(".cssmenu>ul>li").hover(function () {
        element = $(this);
        var w = element.width();
        if ($(this).hasClass('has-sub')) {
            leftPos = element.position().left + w / 2 - 12;
        } else {
            leftPos = element.position().left + w / 2 - 6;
        }

        $('.cssmenu .pIndicator').css('left', leftPos);
    }, function () {
        $('.cssmenu .pIndicator').css('left', posLeft);
    });


    $('.cssmenu>ul>.has-sub>ul').append('<div class="submenuArrow"></div>');
    $('.cssmenu>ul').children('.has-sub').each(function () {
        var posLeftArrow = $(this).width();
        posLeftArrow /= 2;
        posLeftArrow -= 12;
        $(this).find('.submenuArrow').css('left', posLeftArrow);
    });

    //menu modal
    activeElement = $('.menu_modal>ul>li:first');

    $('.menu_modal>ul>li').each(function () {
        if ($(this).hasClass('active')) {
            activeElement = $(this);
        }
    });


    var posRight = posLeft + elementWidth;
    elementWidth = activeElement.width();
    posRight = posRight + elementWidth / 2 + 15;
    if (activeElement.hasClass('has-sub')) {
        posRight += 6;
    }

    $('.menu_modal .pIndicator_modal').css('right', posRight);
    element, indicator = $('.menu_modal pIndicator_modal');
    var RightPos;

    $(".menu_modal>ul>li").hover(function () {
        element = $(this);
        var w = element.width();
        if ($(this).hasClass('has-sub')) {
            RightPos = element.position().right + w / 2 + 12;
        } else {
            RightPos = element.position().right + w / 2 + 6;
        }

        $('.menu_modal .pIndicator_modal').css('right', RightPos);
    }, function () {
        $('.menu_modal .pIndicator_modal').css('right', posRight);
    });


    $('.menu_modal>ul>.has-sub>ul').append('<div class="submenuArrow_modal"></div>');
    $('.menu_modal>ul').children('.has-sub').each(function () {
        var posRightArrow = $(this).width();
        posRightArrow /= 2;
        posRightArrow += 12;
        $(this).find('.submenuArrow_modal').css('right', posRightArrow);
    });
});
