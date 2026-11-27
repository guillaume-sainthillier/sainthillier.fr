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
 * @param elements elements to follow, in any order
 * @param offset distance from the top of the viewport, in pixels, past which an element is current; a function is
 *     read again with the positions, for an offset that depends on the viewport
 * @param onChange called with the current element
 */
export default function observeScrollSpy(
    elements: HTMLElement[],
    offset: number | (() => number),
    onChange: (element: HTMLElement | null) => void
): void {
    if (elements.length === 0) return

    const readOffset = typeof offset === 'function' ? offset : () => offset
    let positions: { element: HTMLElement; top: number }[] = []
    let currentOffset = 0
    // undefined until the first update, so that onChange runs once at start, even with null
    let current: HTMLElement | null | undefined

    const update = () => {
        const line = window.scrollY + currentOffset
        let next: HTMLElement | null = null
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
        currentOffset = readOffset()
        positions = elements
            .map((element) => ({ element, top: element.getBoundingClientRect().top + window.scrollY }))
            .sort((a, b) => a.top - b.top)
        update()
    }

    // Also calls back once observation starts, after the first layout
    new ResizeObserver(measure).observe(document.documentElement)
    document.addEventListener('scroll', update, { passive: true })
}
