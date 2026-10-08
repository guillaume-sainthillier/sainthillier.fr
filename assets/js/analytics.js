/**
 * Umami custom events, used as goals in the Umami dashboard (Reports → Goals, type "Event").
 *
 * Links are classified from their href by a single delegated listener, so links written in Markdown content
 * (the email shortcode, the landing pages) are tracked too without adding data-umami-event to every template.
 * Buttons that only exist in templates (portfolio filters) use the declarative data-umami-event attributes instead.
 */

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
    return null
}

export default function initAnalytics() {
    document.addEventListener('click', (e) => {
        const link = e.target.closest('a[href]')
        const event = link && classifyLink(link)
        if (event) {
            track(event.name, event.data)
        }
    })
}
