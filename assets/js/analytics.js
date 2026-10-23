/**
 * Umami custom events, used as goals in the Umami dashboard (Reports → Goals, type "Event").
 *
 * A single delegated click listener handles two cases:
 * - elements marked in the templates (portfolio filters, footer social links, the landing page CTA shortcode) carry
 *   data-analytics-event="<name>" and one data-analytics-<prop>="<value>" per event property;
 * - links are also classified from their href, so links written in Markdown content (the email shortcode, the landing
 *   pages) are tracked without any attribute.
 * Only this module knows about Umami: the markup never names the analytics tool.
 */

const ATTRIBUTE_PREFIX = 'data-analytics-'

/**
 * Sends an event to Umami. The tracker is deferred and may be blocked or skipped (ad blocker, other domain):
 * events are then silently dropped.
 *
 * @param {string} name event name, as configured in the Umami goal
 * @param {Record<string, string>} [data] event properties, shown in the event breakdown
 */
export function track(name, data) {
    window.umami?.track(name, data)
}

/**
 * Decides whether a clicked link is a goal, and which one.
 *
 * @param {HTMLAnchorElement} link the clicked link (link.protocol, link.hostname, link.pathname are parsed)
 * @returns {{ name: string, data?: Record<string, string> } | null} the event to send, or null to ignore the click
 */
function classifyLink(link) {
    if (link.protocol === 'tel:' || link.protocol === 'mailto:') {
        return { name: 'contact-direct', data: { channel: link.protocol === 'tel:' ? 'phone' : 'email' } }
    }
    if (link.hostname === 'calendly.com') {
        return { name: 'booking' }
    }
    if (link.pathname.includes('/CV-') && link.pathname.endsWith('.pdf')) {
        return { name: 'cv-download' }
    }
    if (link.pathname.endsWith('/CGV.pdf')) {
        return { name: 'cgv-download' }
    }
    return null
}

/**
 * Reads the event declared on an element: data-analytics-event is the name, every other data-analytics-* attribute is
 * a property (key = the part after data-analytics-).
 *
 * @param {Element} element an element carrying data-analytics-event
 * @returns {{ name: string, data?: Record<string, string> }} the event to send
 */
function readMarkedEvent(element) {
    const data = {}
    for (const { name, value } of element.attributes) {
        if (name.startsWith(ATTRIBUTE_PREFIX) && name !== `${ATTRIBUTE_PREFIX}event`) {
            data[name.slice(ATTRIBUTE_PREFIX.length)] = value
        }
    }
    return { name: element.getAttribute(`${ATTRIBUTE_PREFIX}event`), data: Object.keys(data).length ? data : undefined }
}

export default function initAnalytics() {
    document.addEventListener('click', (e) => {
        const marked = e.target.closest(`[${ATTRIBUTE_PREFIX}event]`)
        if (marked) {
            const event = readMarkedEvent(marked)
            track(event.name, event.data)
        }

        const link = e.target.closest('a[href]')
        const event = link && classifyLink(link)
        if (event) {
            track(event.name, event.data)
        }
    })
}
