/**
 * Follows the element being read while the page scrolls: the lowest of `elements` whose top has gone past the
 * line `offset` pixels below the top of the viewport, or null while the page is above the first one.
 *
 * Scrolling only reads window.scrollY, which never forces a layout: the elements' positions are measured once,
 * then again whenever the page changes size (ResizeObserver on the root element: viewport width, fonts swapped,
 * portfolio expanded or filtered...). The observer calls back after layout, so measuring there is free too.
 * onChange runs once at start and then only when the current element changes, so the DOM is written only then.
 *
 * ResizeObserver ships in every browser that runs this bundle (optional chaining already needs Safari 13.1).
 *
 * @param {HTMLElement[]} elements elements to follow, in any order
 * @param {number} offset distance from the top of the viewport, in pixels, past which an element is current
 * @param {(element: HTMLElement|null) => void} onChange called with the current element
 */
export default function observeScrollSpy(elements, offset, onChange) {
    if (elements.length === 0) return

    let positions = []
    let current

    const update = () => {
        const line = window.scrollY + offset
        let next = null
        for (const { element, top } of positions) {
            if (top > line) break
            next = element
        }

        if (next !== current) {
            current = next
            onChange(next)
        }
    }

    const measure = () => {
        positions = elements
            .map((element) => ({ element, top: element.getBoundingClientRect().top + window.scrollY }))
            .sort((a, b) => a.top - b.top)
        update()
    }

    // Also calls back once observation starts, after the first layout
    new ResizeObserver(measure).observe(document.documentElement)
    document.addEventListener('scroll', update, { passive: true })
}
