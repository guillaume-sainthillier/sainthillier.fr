import observeScrollSpy from './scroll-spy'

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
    const linkByHeading = new Map()
    for (const link of links) {
        const heading = document.getElementById(decodeURIComponent(link.hash.slice(1)))
        if (heading) {
            linkByHeading.set(heading, link)
        }
    }

    let previous = null

    // Above the first heading, the first entry stays current
    observeScrollSpy([...linkByHeading.keys()], SCROLL_OFFSET, (heading) => {
        const current = heading ? linkByHeading.get(heading) : links[0]

        previous?.removeAttribute('aria-current')
        current.setAttribute('aria-current', 'true')

        // A long table of contents scrolls on its own (desktop): keep the current entry visible, instantly on
        // load and for reduced motion
        if (
            current.offsetTop < toc.scrollTop ||
            current.offsetTop + current.offsetHeight > toc.scrollTop + toc.clientHeight
        ) {
            toc.scrollTo({
                top: current.offsetTop - toc.clientHeight / 2,
                behavior: previous === null || reducedMotion.matches ? 'instant' : 'smooth',
            })
        }
        previous = current
    })
}
