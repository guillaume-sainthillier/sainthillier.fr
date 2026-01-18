const SCROLL_OFFSET = 54;
const SHRINK_THRESHOLD = 100;

export default function initNavbar() {
    const navbar = document.body.querySelector('#mainNav');
    if (!navbar) return;

    initNavbarShrink(navbar);
    initScrollSpy(navbar);
}

function initNavbarShrink(navbar) {
    const navbarShrink = () => {
        if (window.scrollY <= SHRINK_THRESHOLD) {
            navbar.classList.remove('navbar-shrink');
        } else {
            navbar.classList.add('navbar-shrink');
        }
    };

    navbarShrink();
    document.addEventListener('scroll', navbarShrink);
}

function initScrollSpy(navbar) {
    const scrollLinks = navbar.querySelectorAll('.js-scroll-trigger[href^="/#"]');
    const sections = [];

    scrollLinks.forEach((link) => {
        const href = link.getAttribute('href');
        const sectionId = href.replace('/#', '');
        const section = document.getElementById(sectionId);
        if (section) {
            sections.push({ element: section, link });
        }
    });

    const updateActiveLink = () => {
        const scrollPosition = window.scrollY + SCROLL_OFFSET + 1;

        let currentSection = null;
        sections.forEach(({ element }) => {
            if (element.offsetTop <= scrollPosition) {
                currentSection = element;
            }
        });

        scrollLinks.forEach((link) => {
            const isActive = currentSection && link.getAttribute('href') === `/#${currentSection.id}`;
            if (link.classList.contains('btn')) {
                // Handle button style toggle
                if (isActive) {
                    link.classList.remove('btn-outline-primary');
                    link.classList.add('btn-primary');
                } else {
                    link.classList.remove('btn-primary');
                    link.classList.add('btn-outline-primary');
                }
            } else {
                // Handle nav-link active class
                link.classList.toggle('active', isActive);
            }
        });
    };

    document.addEventListener('scroll', updateActiveLink);
    updateActiveLink();
}
