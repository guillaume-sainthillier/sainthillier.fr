import observeScrollSpy from './scroll-spy'

// The html scroll-padding-top (base.css): the height of the fixed header, where an anchor link lands its section
const headerOffset = () => Number.parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0

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
    observeScrollSpy(
        [...sections],
        () => headerOffset() + 1,
        (currentSection) => {
            for (const link of scrollLinks) {
                const isActive = currentSection !== null && link.getAttribute('href') === `/#${currentSection.id}`
                link.classList.toggle('active', isActive)
                if (isActive) {
                    link.setAttribute('aria-current', 'true')
                } else {
                    link.removeAttribute('aria-current')
                }
            }
        }
    )
}
