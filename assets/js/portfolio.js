/**
 * Portfolio filters and "Afficher tous les projets" button.
 *
 * Every project is in the HTML, so the full portfolio stays readable without JavaScript and by search engines:
 * this script only hides cards, depending on the active filter and on the number of projects shown at first
 * (data-visible on the grid, from portfolio_visible in content/_index.md). The limit applies to every filter.
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

    for (const button of filterButtons) {
        button.addEventListener('click', () => {
            state.filter = button.dataset.portfolioFilter
            // Each filter starts limited again, with its own "Afficher tous les projets" button
            state.expanded = false
            render()
        })
    }

    moreButton.addEventListener('click', () => {
        state.expanded = true
        render()
    })

    // Old links to a project (#portfolio/<id>) open the full list and scroll to its card
    const target = window.location.hash.match(/^#portfolio\/(.+)$/)
    const targetCard = target && document.getElementById(`project-${target[1]}`)
    if (targetCard) {
        state.expanded = true
    }

    render()
    targetCard?.scrollIntoView({ behavior: 'smooth' })
}
