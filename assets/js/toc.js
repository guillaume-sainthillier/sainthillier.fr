// Height of the fixed header plus some room, so a section counts as current once its title is well in view
const SCROLL_OFFSET = 120

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

/**
 * Highlights the table of contents entry ([data-toc] links) of the section being read.
 */
export default function initToc() {
    const toc = document.body.querySelector('[data-toc]')
    if (!toc) return

    const links = [...toc.querySelectorAll('a[href^="#"]')]
    const headings = links.map((link) => document.getElementById(decodeURIComponent(link.hash.slice(1))))

    let previous = null

    const update = () => {
        let current = 0
        headings.forEach((heading, index) => {
            if (heading && heading.getBoundingClientRect().top <= SCROLL_OFFSET) {
                current = index
            }
        })

        links.forEach((link, index) => {
            if (index === current) {
                link.setAttribute('aria-current', 'true')
            } else {
                link.removeAttribute('aria-current')
            }
        })

        // A long table of contents scrolls on its own (desktop): keep the current entry visible. Only when it
        // changes, so the page's scroll events don't restart the animation; instant on load and for reduced motion
        if (current === previous) return
        const link = links[current]
        if (link.offsetTop < toc.scrollTop || link.offsetTop + link.offsetHeight > toc.scrollTop + toc.clientHeight) {
            toc.scrollTo({
                top: link.offsetTop - toc.clientHeight / 2,
                behavior: previous === null || reducedMotion.matches ? 'instant' : 'smooth',
            })
        }
        previous = current
    }

    document.addEventListener('scroll', update, { passive: true })
    update()
}
