// Height of the fixed header, so a section counts as current once it reaches the bottom of the header
const SCROLL_OFFSET = 80

export default function initNavbar() {
    initScrollSpy()
}

function initScrollSpy() {
    // Header navigation and mobile tab bar
    const scrollLinks = document.body.querySelectorAll('.nav-link[href^="/#"], .tab-link[href^="/#"]')
    // Both navigations list the sections in their own order: keep each section once
    const sections = new Set()

    scrollLinks.forEach((link) => {
        const section = document.getElementById(link.getAttribute('href').replace('/#', ''))
        if (section) {
            sections.add(section)
        }
    })

    const updateActiveLink = () => {
        const scrollPosition = window.scrollY + SCROLL_OFFSET + 1

        // The current section is the lowest one on the page whose top has been scrolled past
        let currentSection = null
        sections.forEach((section) => {
            if (
                section.offsetTop <= scrollPosition &&
                (!currentSection || section.offsetTop > currentSection.offsetTop)
            ) {
                currentSection = section
            }
        })

        scrollLinks.forEach((link) => {
            const isActive = currentSection !== null && link.getAttribute('href') === `/#${currentSection.id}`
            link.classList.toggle('active', isActive)
            if (isActive) {
                link.setAttribute('aria-current', 'true')
            } else {
                link.removeAttribute('aria-current')
            }
        })
    }

    document.addEventListener('scroll', updateActiveLink, { passive: true })
    updateActiveLink()
}
