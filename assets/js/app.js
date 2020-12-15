import $ from 'jquery';
import 'bootstrap/js/src/collapse';
import 'bootstrap/js/src/modal';
import 'bootstrap/js/src/scrollspy';
import 'jqcloud2';
import 'jquery.easing';
import 'lazysizes';
import './contact_me';

import '../scss/app.scss';

$(document).ready(function () {
    // Smooth scrolling using jQuery easing
    $('a.js-scroll-trigger[href*="#"]:not([href="#"])').click(function (e) {
        e.preventDefault();
        if (
            location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') &&
            location.hostname == this.hostname
        ) {
            var target = $(this.hash);
            target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
            if (target.length) {
                $('html, body').animate(
                    {
                        scrollTop: target.offset().top - 55,
                    },
                    1000,
                    'easeInOutExpo'
                );
            }
        }
    });

    // Closes responsive menu when a scroll trigger link is clicked
    $('.js-scroll-trigger').click(function () {
        $('.navbar-collapse').collapse('hide');
    });

    // Activate scrollspy to add active class to navbar items on scroll
    $(document.body).scrollspy({
        target: '#mainNav',
        offset: 56,
    });

    // Collapse Navbar
    var navbar = $('#mainNav');
    var navbarCollapse = function () {
        if (navbar.offset().top > 100) {
            navbar.addClass('navbar-shrink');
        } else {
            navbar.removeClass('navbar-shrink');
        }
    };

    // Collapse now if page is not at top
    navbarCollapse();
    // Collapse the navbar when page is scrolled
    $(window).scroll(navbarCollapse);

    // Hide navbar when modals trigger
    $('.portfolio-modal')
        .on('show.bs.modal', function (e) {
            navbar.addClass('d-none');
        })
        .on('hidden.bs.modal', function (e) {
            navbar.removeClass('d-none');
        });

    $('.skills').each(function () {
        var datas = $(this).data('skills');
        var words = [];

        $.each(datas, function (key, data) {
            words.push({ text: data.name, weight: data.weight });
        });

        $(this).jQCloud(words);
    });
});
