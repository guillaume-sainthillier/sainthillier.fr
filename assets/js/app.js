import WordCloud from 'wordcloud';
import 'lazysizes';
import '@webcomponents/custom-elements';
import 'lite-youtube-embed';
import 'lite-youtube-embed/src/lite-yt-embed.css';

import '../scss/app.scss';

// Custom Collapse implementation
class Collapse {
    constructor(element) {
        this.element = element;
        this.isOpen = !element.classList.contains('hidden');
    }

    toggle() {
        if (this.isOpen) {
            this.hide();
        } else {
            this.show();
        }
    }

    show() {
        this.element.classList.remove('hidden');
        this.element.classList.add('active');
        this.isOpen = true;
    }

    hide() {
        this.element.classList.add('hidden');
        this.element.classList.remove('active');
        this.isOpen = false;
    }

    static getInstance(element) {
        if (!element._collapseInstance) {
            element._collapseInstance = new Collapse(element);
        }
        return element._collapseInstance;
    }
}

// Custom Modal implementation
class Modal {
    constructor(element) {
        this.element = element;
        this.isOpen = false;
    }

    show() {
        this.element.classList.remove('hidden');
        this.element.classList.add('flex');
        this.element.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        this.isOpen = true;
    }

    hide() {
        this.element.classList.add('hidden');
        this.element.classList.remove('flex');
        this.element.style.display = 'none';
        document.body.style.overflow = '';
        this.isOpen = false;
    }

    static getOrCreateInstance(element) {
        if (!element._modalInstance) {
            element._modalInstance = new Modal(element);
        }
        return element._modalInstance;
    }
}

// Custom ScrollSpy implementation
class ScrollSpy {
    constructor(root, options) {
        this.root = root;
        this.target = document.querySelector(options.target);
        this.rootMargin = options.rootMargin || '0px';
        this.sections = [];
        this.observerOptions = {
            root: null,
            rootMargin: this.rootMargin,
            threshold: 0.15,
        };

        this.init();
    }

    init() {
        // Find all sections that have IDs
        const sectionElements = this.root.querySelectorAll('section[id], header[id]');
        sectionElements.forEach((section) => {
            this.sections.push({
                id: section.id,
                element: section,
                link: this.target.querySelector(`a[href="#${section.id}"]`),
            });
        });

        // Create Intersection Observer
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    this.setActiveLink(entry.target.id);
                }
            });
        }, this.observerOptions);

        // Observe all sections
        this.sections.forEach(({ element }) => observer.observe(element));
    }

    setActiveLink(sectionId) {
        this.sections.forEach(({ id, link }) => {
            if (link) {
                if (id === sectionId) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            }
        });
    }
}

window.addEventListener('DOMContentLoaded', () => {
    // Initialize navbar toggler
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');

    if (navbarToggler && navbarCollapse) {
        const collapseInstance = Collapse.getInstance(navbarCollapse);

        navbarToggler.addEventListener('click', () => {
            collapseInstance.toggle();
        });
    }

    // Closes responsive menu when a scroll trigger link is clicked
    document.body.querySelectorAll('.js-scroll-trigger').forEach((link) => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }

            // Close the navbar collapse if open
            document.body.querySelectorAll('.navbar-collapse').forEach((collapse) => {
                const instance = Collapse.getInstance(collapse);
                if (instance && instance.isOpen) {
                    instance.hide();
                }
            });
        });
    });

    // Activate ScrollSpy on the main nav element
    const navbar = document.body.querySelector('#mainNav');
    if (navbar) {
        new ScrollSpy(document.body.querySelector('main'), {
            target: `#${navbar.id}`,
            rootMargin: '-30% 0px -70% 0px',
        });

        // Navbar shrink function
        const navbarShrink = function () {
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

    if (document.body.id === 'page-home') {
        // Word Cloud
        const skills = document.body.querySelector('#skills');
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

        // Contact form
        // Fetch all the forms we want to apply custom Bootstrap validation styles to
        const contactForm = document.body.querySelector('#contactForm');
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
                        <div class="alert-success">
                            <strong>Votre message a bien été envoyé.</strong>
                            <button type="button" class="alert-close" aria-label="Fermer">&times;</button>
                        </div>
                    `;

                        // Add dismiss functionality
                        success.querySelector('.alert-close').addEventListener('click', function () {
                            this.parentElement.remove();
                        });

                        sendMessageButton.removeAttribute('disabled');
                        contactForm.classList.remove('was-validated');
                        contactForm.reset();
                    },
                    () => {
                        success.innerHTML = `
                        <div class="alert-danger">
                            <strong>Désolé ${firstName}, on dirait que le message n'a pas pu être envoyé. Merci d'essayer un peu plus tard ou de me contacter directement par téléphone !</strong>
                            <button type="button" class="alert-close" aria-label="Fermer">&times;</button>
                        </div>
                    `;

                        // Add dismiss functionality
                        success.querySelector('.alert-close').addEventListener('click', function () {
                            this.parentElement.remove();
                        });

                        sendMessageButton.removeAttribute('disabled');
                        contactForm.classList.remove('was-validated');
                    }
                );
            },
            false
        );

        // Initialize modals
        document.querySelectorAll('[data-toggle="modal"]').forEach((trigger) => {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                const targetSelector = trigger.getAttribute('href') || trigger.getAttribute('data-target');
                const targetModal = document.querySelector(targetSelector);
                if (targetModal) {
                    Modal.getOrCreateInstance(targetModal).show();
                }
            });
        });

        // Modal close buttons
        document.querySelectorAll('[data-dismiss="modal"]').forEach((closeBtn) => {
            closeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const modal = closeBtn.closest('.portfolio-modal, .modal');
                if (modal) {
                    Modal.getOrCreateInstance(modal).hide();
                }
            });
        });

        const { hash } = window.location;
        if (hash) {
            const matches = hash.match('portfolio/(.+)');
            if (matches && matches.length > 1) {
                const portfolioId = matches[1];
                const element = document.body.querySelector(`#portfolio-modal-${portfolioId}`);
                const elementSelector = document.body.querySelector(
                    `.portfolio-link[href="#portfolio-modal-${portfolioId}"]`
                );
                if (element) {
                    Modal.getOrCreateInstance(element).show();
                }

                if (elementSelector) {
                    elementSelector.scrollIntoView({
                        behavior: 'smooth',
                    });
                }
            }
        }
    }
});
