import observeScrollSpy from './scroll-spy'

// Height of the fixed header, so a section counts as current once it reaches the bottom of the header
const SCROLL_OFFSET = 80

export default function initNavbar() {
    // Header navigation and mobile tab bar
    const scrollLinks = [...document.body.querySelectorAll('.nav-link[href^="/#"], .tab-link[href^="/#"]')]
    // Both navigations list the sections in their own order: keep each section once
    const sections = new Set()

    for (const link of scrollLinks) {
        const section = document.getElementById(link.getAttribute('href').replace('/#', ''))
        if (section) {
            sections.add(section)
        }
    }

    // One pixel past the header, so the section an anchor link lands on is already current
    observeScrollSpy([...sections], SCROLL_OFFSET + 1, (currentSection) => {
        for (const link of scrollLinks) {
            const isActive = currentSection !== null && link.getAttribute('href') === `/#${currentSection.id}`
            link.classList.toggle('active', isActive)
            if (isActive) {
                link.setAttribute('aria-current', 'true')
            } else {
                link.removeAttribute('aria-current')
            }
        }
    })
}
