import Collapse from 'bootstrap/js/src/collapse';
import 'bootstrap/js/src/alert';
import 'bootstrap/js/src/modal';
import ScrollSpy from 'bootstrap/js/src/scrollspy';
import WordCloud from 'wordcloud';
import 'lazysizes';
import 'lite-youtube-embed';
import 'lite-youtube-embed/src/lite-yt-embed.css';
import './_icons';

import '../scss/app.scss';

window.addEventListener('DOMContentLoaded', () => {
    // Closes responsive menu when a scroll trigger link is clicked
    document.body.querySelectorAll('.js-scroll-trigger').forEach((link) => {
        link.addEventListener('click', () => {
            document.body.querySelectorAll('.navbar-collapse').forEach((collapse) => {
                const instance = Collapse.getInstance(collapse);
                if (instance) {
                    instance.hide();
                }
            });
        });
    });

    // Activate Bootstrap scrollspy on the main nav element
    const navbar = document.body.querySelector('#mainNav');
    if (navbar) {
        new ScrollSpy(document.body, {
            target: `#${navbar.id}`,
            offset: 56,
        });

        // Navbar shrink function
        var navbarShrink = function () {
            if (window.scrollY <= 100) {
                navbar.classList.remove('navbar-shrink');
            } else {
                navbar.classList.add('navbar-shrink');
            }
        };

        // Shrink the navbar
        navbarShrink();

        // Shrink the navbar when page is scrolled
        document.addEventListener('scroll', navbarShrink);
    }

    //Word Cloud
    const skills = document.body.querySelector('#skills');
    const skillsData = JSON.parse(skills.dataset.skills);
    let list = [];
    for (const item of skillsData) {
        list.push([item.name, item.weight]);
    }

    const width = skills.getBoundingClientRect().width;
    WordCloud(skills, {
        list: list,
        weightFactor: function (size) {
            return (Math.pow(size, 2) * width) / 1024;
        },
        gridSize: 16,
        drawOutOfBound: false,
        shrinkToFit: true,
        fontFamily: '"Google Sans", sans-serif',
        fontWeight: 700,
        color: null,
        classes: function (word, weight) {
            return 'weight-' + parseInt(weight);
        },
    });

    //Contact form
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var contactForm = document.body.querySelector('#contactForm');
    contactForm.addEventListener(
        'submit',
        function (event) {
            event.preventDefault();
            event.stopPropagation();
            contactForm.classList.add('was-validated');
            if (!contactForm.checkValidity()) {
                return;
            }

            const name = contactForm.querySelector('#name', contactForm).value;
            const email = contactForm.querySelector('#email', contactForm).value;
            const phone = contactForm.querySelector('#phone', contactForm).value;
            const message = contactForm.querySelector('#message', contactForm).value;
            const firstName = name; // For Success/Failure Message

            const data = {
                _replyto: email,
                message: `${name} a fait une demande de contact :
                        ${message}
                        Téléphone : ${phone}
                        Email : ${email}
                    `,
            };

            const success = document.body.querySelector('#success');
            const sendMessageButton = document.body.querySelector('#sendMessageButton');
            sendMessageButton.setAttribute('disabled', 'disabled');
            fetch(contactForm.getAttribute('action'), {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
            }).then(
                () => {
                    success.innerHTML = `
                        <div class="alert alert-success alert-dismissible fade show">
                            <strong>Votre message a bien été envoyé.</strong>
                            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Fermer"></button>
                        </div>
                    `;

                    sendMessageButton.removeAttribute('disabled');
                    contactForm.classList.remove('was-validated');
                    contactForm.reset();
                },
                () => {
                    success.innerHTML = `
                        <div class="alert alert-danger alert-dismissible fade show">
                            <strong>Désolé ${firstName}, on dirait que le message n'a pas pu être envoyé. Merci d'essayer un peu plus tard ou de me contacter directement par téléphone !</strong>
                            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Fermer"></button>
                        </div>
                    `;

                    sendMessageButton.removeAttribute('disabled');
                    contactForm.classList.remove('was-validated');
                }
            );
        },
        false
    );
});
