window.lastH = 0;
window.lastW = 0;

$(document).ready(function()
{    
    init_resize(); //Caption update on resize
    init_anti_spam(); //Anti Spam Handler
    init_gmap(); //GMaps div
    init_navigation(); //Smooth scroll + scrollspy
    init_quicksand(); //Portfolio
    init_caption();
    init_contact(); //Contact form
    init_modals(); //Portfolio details réalisations    
    init_back_top(); //Back To Top
});

function init_resize()
{
    $(window).resize(function()
    {
        var img = $(".thumb:first img"); //Une seule image comme référence
        var currentH = img.height();
        var currentW = img.width();
        
        if(window.lastH !== currentH || window.lastW !== currentW)
        {
            init_caption();
        }
        
        if(window.lastW !== currentW)
        {
            window.lastW = currentW;
        }
        
        if(window.lastH !== currentH)
        {
            window.lastH = currentH;
        }        
    });    
}

function init_anti_spam(selector)
{
    var email = username + "@" + host;
    $(".email-nospam", selector || document).text(email);
    $("a.mailto", selector || document).each(function()
    {
        var mailto = "mailto:" + email;
        if($(this).data("subject"))
        {
            mailto += "?Subject=" + encodeURIComponent($(this).data("subject"));
        }
        
        $(this).attr("href", mailto);
    });
    
    //var tels = telephone;
    $(".tel-nospam", selector || document).html(telephone.join("."));
}

function init_gmap()
{
    var map = new GMaps({
        div: '#map',
        lat: 43.613731,
        lng: 1.458853,
        scrollwheel: false
    });

    map.addMarker({
        lat: 43.613731,
        lng: 1.458853,
        color: 'blue',
        title: 'Guillaume Sainthillier',
        infoWindow: {
            content: '<p>' + $('.about_links').text().trim().replace(/(\n|\s)+/g, '<br />') + '</p>'
        }
    });
}

function init_back_top()
{
    var duration = 500;
    $(window).scroll(function() {
        var scrolltop = $(this).scrollTop();
        if (scrolltop >= 300) {
            $("#elevator_item").show(duration / 2);
        } else {
            $("#elevator_item").hide(duration / 2);
        }
    });
    
    $("#elevator").click(function() {
        $("html,body").stop().animate({
            scrollTop: 0
        }, duration);
        
        return false;
    });
}

function init_navigation()
{
    $("body").scrollspy({
        target: '#navbar',
        offset: 80
    });


    var offset = $(window).width() > 940 ? 80 : 140,
            topMenu = $("#site_nav"),
            topMenuHeight = topMenu.outerHeight() + offset;


    $("#navbar a").click(function(e)
    {
        var href = $(this).attr("href"),
                offsetTop = href === "#" ? 0 : $(href).offset().top - topMenuHeight + 1;
        $('html, body').stop().animate({
            scrollTop: offsetTop
        }, 400);
        e.preventDefault();
    });
}

function init_quicksand()
{
    var $holder = $('.portfolio');
    var $data = $holder.clone();
    
    $('.filter a').click(function() {
        $(this).closest("ul").find('.active').removeClass('active');
        $(this).closest("li").addClass('active');

        var $filteredData;
        var $filterType = $(this).data('tag');
        if ($filterType === 'all') {
            $filteredData = $data.find('div.item');
        }
        else {
            $filteredData = $data.find('div.item[data-tag~=' + $filterType + ']');
        }

        $holder.quicksand($filteredData, {
            duration: 800,
            easing: 'easeInOutQuad',
            enhancement: function() {
                init_caption();
                init_modals();
            }
        });

        return false;
    });
}

function init_caption()
{
    $('.thumb').hcaptions();
    
    $(".drop-panel .drop-panel").each(function()
    {
        $(this).replaceWith($(this).contents());
    });
}

function init_modals()
{
    $("a.thumb_link").unbind("click").click(function()
    {
        $.get($(this).attr("href"))
                .done(function(html)
                {
                    $("body").find(".modal").remove();
                    $("body").prepend(html).find(".modal").modal("show");
                });
        return false;
    });
}

function init_contact()
{
    $("#form_contact").submit(function()
    {
        var oldForm = $(this);

        oldForm.find("button:submit").attr("disabled", true).html($("<i>").addClass("fa fa-2x fa-spinner fa-spin"));
        $.post(
                oldForm.attr("action"),
                oldForm.serialize()
                ).done(function(form)
        {
            oldForm.replaceWith($(form));
            init_anti_spam();
            init_contact();            
        });
        return false;
    });
}