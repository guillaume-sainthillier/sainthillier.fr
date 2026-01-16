import WordCloud from 'wordcloud';
import 'lazysizes';
import '@webcomponents/custom-elements';
import 'lite-youtube-embed';
import 'lite-youtube-embed/src/lite-yt-embed.css';

import '../css/app.css';

import SimpleModal from './SimpleModal';
import SimpleCollapse from './SimpleCollapse';
import initNavbar from './navbar';

function initCollapseTogglers() {
    document.addEventListener('click', (e) => {
        const toggler = e.target.closest('[data-bs-toggle="collapse"]');
        if (toggler) {
            e.preventDefault();
            const targetSelector = toggler.getAttribute('data-bs-target');
            const target = document.querySelector(targetSelector);
            if (target) {
                const instance = SimpleCollapse.getOrCreateInstance(target);
                instance.toggle();
            }
        }
    });

    // Close responsive menu when a scroll trigger link is clicked
    document.body.querySelectorAll('.js-scroll-trigger').forEach((link) => {
        link.addEventListener('click', () => {
            document.body.querySelectorAll('.navbar-collapse').forEach((collapse) => {
                const instance = SimpleCollapse.getInstance(collapse);
                if (instance && instance.isOpen) {
                    instance.hide();
                }
            });
        });
    });
}

function initModals() {
    // Initialize modal triggers
    document.querySelectorAll('[data-bs-toggle="modal"]').forEach((trigger) => {
        const targetSelector = trigger.getAttribute('href') || trigger.getAttribute('data-bs-target');
        const target = document.querySelector(targetSelector);
        if (target) {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                const modal = SimpleModal.getOrCreateInstance(target);
                modal.show();
            });
        }
    });

    // Initialize modal dismiss buttons
    document.querySelectorAll('[data-bs-dismiss="modal"]').forEach((button) => {
        const modal = button.closest('.modal');
        if (modal) {
            button.addEventListener('click', () => {
                const instance = SimpleModal.getInstance(modal);
                if (instance) {
                    instance.hide();
                }
            });
        }
    });
}

function initAlerts() {
    document.addEventListener('click', (e) => {
        if (e.target.matches('[data-bs-dismiss="alert"]') || e.target.closest('[data-bs-dismiss="alert"]')) {
            const button = e.target.matches('[data-bs-dismiss="alert"]')
                ? e.target
                : e.target.closest('[data-bs-dismiss="alert"]');
            const alert = button.closest('.alert');
            if (alert) {
                alert.classList.remove('show');
                setTimeout(() => alert.remove(), 150);
            }
        }
    });
}

function initWordCloud() {
    const skills = document.body.querySelector('#skills');
    if (!skills) return;

    const skillsData = JSON.parse(skills.dataset.skills);
    const list = [];
    Object.values(skillsData).forEach((item) => {
        list.push([item.name, item.weight]);
    });

    const { width } = skills.getBoundingClientRect();
    WordCloud(skills, {
        list,
        weightFactor(size) {
            return (size ** 2 * width) / 1024;
        },
        gridSize: 16,
        drawOutOfBound: false,
        shrinkToFit: true,
        fontFamily: '"Google Sans", sans-serif',
        fontWeight: 700,
        color: null,
        classes(word, weight) {
            return `weight-${parseInt(weight, 10)}`;
        },
    });
}

function initContactForm() {
    const contactForm = document.body.querySelector('#contactForm');
    if (!contactForm) return;

    contactForm.addEventListener(
        'submit',
        (event) => {
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
            const originalButtonText = sendMessageButton.innerHTML;

            // Show loading state
            sendMessageButton.setAttribute('disabled', 'disabled');
            sendMessageButton.innerHTML = `
                    <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    Envoi en cours...
                `;

            // Clear any previous server validation errors
            contactForm.querySelectorAll('.server-invalid').forEach((el) => {
                el.classList.remove('server-invalid', 'is-invalid');
            });
            contactForm.querySelectorAll('.server-feedback').forEach((el) => {
                el.remove();
            });

            fetch(contactForm.getAttribute('action'), {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
            })
                .then(async (response) => {
                    if (response.ok) {
                        success.innerHTML = `
                                <div class="alert alert-success alert-dismissible fade show">
                                    <strong>Votre message a bien été envoyé.</strong>
                                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Fermer"></button>
                                </div>
                            `;
                        contactForm.classList.remove('was-validated');
                        contactForm.reset();
                    } else if (response.status === 422) {
                        // Handle Formspree validation errors
                        const errorData = await response.json();
                        if (errorData.errors && Array.isArray(errorData.errors)) {
                            const fieldMessages = {
                                email: "L'adresse email n'est pas valide.",
                                phone: 'Le numéro de téléphone est invalide.',
                                name: 'Le nom est invalide.',
                                message: 'Le message est invalide.',
                            };

                            errorData.errors.forEach((err) => {
                                const fieldName = err.field === '_replyto' ? 'email' : err.field;
                                const field = contactForm.querySelector(`#${fieldName}`);
                                if (field) {
                                    field.classList.add('is-invalid', 'server-invalid');
                                    const feedback = document.createElement('div');
                                    feedback.className = 'invalid-feedback server-feedback';
                                    feedback.style.display = 'block';
                                    feedback.textContent = fieldMessages[fieldName] || err.message;
                                    field.parentNode.appendChild(feedback);
                                }
                            });

                            success.innerHTML = `
                                    <div class="alert alert-danger alert-dismissible fade show">
                                        <strong>Merci de corriger les erreurs dans le formulaire.</strong>
                                        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Fermer"></button>
                                    </div>
                                `;
                        }
                    } else {
                        throw new Error('Server error');
                    }
                })
                .catch(() => {
                    success.innerHTML = `
                            <div class="alert alert-danger alert-dismissible fade show">
                                <strong>Désolé ${firstName}, on dirait que le message n'a pas pu être envoyé. Merci d'essayer un peu plus tard ou de me contacter directement par téléphone !</strong>
                                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Fermer"></button>
                            </div>
                        `;
                    contactForm.classList.remove('was-validated');
                })
                .finally(() => {
                    sendMessageButton.removeAttribute('disabled');
                    sendMessageButton.innerHTML = originalButtonText;
                });
        },
        false
    );
}

function initPortfolioDeepLink() {
    const { hash } = window.location;
    if (!hash) return;

    const matches = hash.match('portfolio/(.+)');
    if (matches && matches.length > 1) {
        const portfolioId = matches[1];
        const element = document.body.querySelector(`#portfolio-modal-${portfolioId}`);
        const elementSelector = document.body.querySelector(`.portfolio-link[href="#portfolio-modal-${portfolioId}"]`);

        if (element) {
            SimpleModal.getOrCreateInstance(element).show();
        }

        if (elementSelector) {
            elementSelector.scrollIntoView({
                behavior: 'smooth',
            });
        }
    }
}

window.addEventListener('DOMContentLoaded', () => {
    initCollapseTogglers();
    initNavbar();
    initModals();
    initAlerts();

    if (document.body.id === 'page-home') {
        initWordCloud();
        initContactForm();
        initPortfolioDeepLink();
    }
});
