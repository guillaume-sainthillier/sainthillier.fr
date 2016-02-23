window.lastH = 0;
window.lastW = 0;

$(document).ready(function()
{
    init_anti_spam(); //Anti Spam Handler
    init_navigation(); //Smooth scroll + scrollspy
    init_quicksand(); //Portfolio
    init_caption();
    init_contact(); //Contact form
    init_modals(); //Portfolio details réalisations
    init_back_top(); //Back To Top
});

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
    var feedback = $("#feedback");
    var contact_btn = $("#contact");
    $("#form_contact").submit(function()
    {
        contact_btn.attr('disabled', true);
        var self = $(this);
        $.post(
            self.attr("action"),
            self.serialize()
        ).success(function(retour)
        {
            if(retour.success) {
                feedback.removeClass('alert-danger').addClass('alert-success');
                self.hide();
            }else {
                feedback.removeClass('alert-success').addClass('alert-danger');
            }
            feedback.removeClass('hidden').html(retour.msg || '');
        }).always(function() {
            contact_btn.attr('disabled', false);
        });
        return false;
    });
}