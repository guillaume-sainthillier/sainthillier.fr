/**
 * Portfolio filters and "Afficher tous les projets" button.
 *
 * Every project is in the HTML, so the full portfolio stays readable without JavaScript and by search engines:
 * this script only hides cards, depending on the active filter and on the number of projects shown at first
 * (data-visible on the grid, from portfolio_visible in content/_index.md). The limit applies to every filter.
 *
 * The active filter is kept in the URL (#portfolio/<filter id>) so that a filtered list can be shared; old links to a
 * project use the same form with the project id (filter and project ids never overlap).
 */

/**
 * Decides which of the cards matching the active filter are shown.
 *
 * @param {HTMLElement[]} matching cards matching the active filter, in page order
 * @param {number} limit number of cards shown before the visitor clicks "Afficher tous les projets"
 * @param {boolean} expanded whether the visitor clicked "Afficher tous les projets"
 * @returns {HTMLElement[]} the cards to show
 */
function selectVisibleCards(matching, limit, expanded) {
    return expanded ? matching : matching.slice(0, limit)
}

function matchesFilter(card, filter) {
    return filter === 'all' || card.dataset.categories.split(' ').includes(filter)
}

export default function initPortfolio() {
    const grid = document.querySelector('[data-portfolio-grid]')
    if (!grid) return

    const cards = [...grid.querySelectorAll('article')]
    const filterButtons = [...document.querySelectorAll('[data-portfolio-filter]')]
    const moreButton = document.querySelector('[data-portfolio-more]')
    const moreLabel = moreButton.querySelector('[data-portfolio-more-label]')
    const emptyMessage = document.querySelector('[data-portfolio-empty]')
    const status = document.querySelector('[data-portfolio-status]')
    const limit = Number(grid.dataset.visible) || cards.length
    const state = { filter: 'all', expanded: false }

    const render = () => {
        const matching = cards.filter((card) => matchesFilter(card, state.filter))
        const visible = selectVisibleCards(matching, limit, state.expanded)

        for (const card of cards) {
            card.hidden = !visible.includes(card)
        }
        for (const button of filterButtons) {
            button.setAttribute('aria-pressed', String(button.dataset.portfolioFilter === state.filter))
        }
        moreButton.hidden = visible.length >= matching.length
        moreLabel.textContent = `Afficher tous les projets (${matching.length})`
        emptyMessage.hidden = matching.length > 0
    }

    // Screen readers hear how many projects the filter leaves, which sighted visitors see at a glance
    const announce = (button) => {
        const count = cards.filter((card) => matchesFilter(card, state.filter)).length
        const label = state.filter === 'all' ? '' : ` : ${button.textContent.trim()}`
        status.textContent = `${count} projet${count > 1 ? 's' : ''}${label}`
    }

    for (const button of filterButtons) {
        button.addEventListener('click', () => {
            state.filter = button.dataset.portfolioFilter
            // Each filter starts limited again, with its own "Afficher tous les projets" button
            state.expanded = false
            render()
            announce(button)
            // replaceState: a filter is not a page of its own in the history, and the page must not jump to the hash
            const hash = state.filter === 'all' ? '#portfolio' : `#portfolio/${state.filter}`
            window.history.replaceState(null, '', hash)
        })
    }

    moreButton.addEventListener('click', () => {
        state.expanded = true
        render()
    })

    // #portfolio/<id>: a shared filter opens the list filtered, an old link to a project opens the full list on its card
    const target = window.location.hash.match(/^#portfolio\/(.+)$/)?.[1]
    const targetFilter = target ? filterButtons.find((button) => button.dataset.portfolioFilter === target) : null
    const targetCard = target && !targetFilter ? document.getElementById(`project-${target}`) : null
    if (targetFilter) {
        state.filter = target
    } else if (targetCard) {
        state.expanded = true
    }

    render()
    if (targetFilter) {
        document.getElementById('portfolio').scrollIntoView({ behavior: 'smooth' })
    }
    targetCard?.scrollIntoView({ behavior: 'smooth' })
}
