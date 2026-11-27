import initAnalytics, { track } from './analytics'
import initNavbar from './navbar'
import initPortfolio from './portfolio'
import SimpleCollapse from './SimpleCollapse'
import initToc from './toc'

function initCollapseTogglers() {
    document.addEventListener('click', (e) => {
        const toggler = e.target.closest('[data-bs-toggle="collapse"]')
        if (toggler) {
            e.preventDefault()
            const targetSelector = toggler.getAttribute('data-bs-target')
            const target = document.querySelector(targetSelector)
            if (target) {
                const instance = SimpleCollapse.getOrCreateInstance(target)
                instance.toggle()
                toggler.setAttribute('aria-expanded', String(instance.isOpen))
            }
        }
    })

    // Close responsive menu when a scroll trigger link is clicked
    document.body.querySelectorAll('.js-scroll-trigger').forEach((link) => {
        link.addEventListener('click', () => {
            document.body.querySelectorAll('.navbar-collapse').forEach((collapse) => {
                const instance = SimpleCollapse.getInstance(collapse)
                if (instance?.isOpen) {
                    instance.hide()
                    document.body
                        .querySelector(`[data-bs-target="#${collapse.id}"]`)
                        ?.setAttribute('aria-expanded', 'false')
                }
            })
        })
    })
}

function initAlerts() {
    document.addEventListener('click', (e) => {
        if (e.target.matches('[data-bs-dismiss="alert"]') || e.target.closest('[data-bs-dismiss="alert"]')) {
            const button = e.target.matches('[data-bs-dismiss="alert"]')
                ? e.target
                : e.target.closest('[data-bs-dismiss="alert"]')
            const alert = button.closest('.alert')
            if (alert) {
                alert.classList.remove('show')
                setTimeout(() => alert.remove(), 150)
            }
        }
    })
}

/**
 * Shows a dismissible alert (the data-bs-dismiss="alert" button is handled by initAlerts) in place of the
 * container's content. Built with DOM nodes, never HTML strings: the messages may include what the visitor typed.
 *
 * @param {HTMLElement} container element receiving the alert
 * @param {'success'|'danger'} type alert style
 * @param {string} title text in bold
 * @param {string} [text] text after the title
 */
function showAlert(container, type, title, text = '') {
    const alert = document.createElement('div')
    alert.className = `alert alert-${type} alert-dismissible fade show`

    const strong = document.createElement('strong')
    strong.textContent = title
    alert.append(strong)
    if (text) {
        alert.append(` ${text}`)
    }

    const close = document.createElement('button')
    close.type = 'button'
    close.className = 'btn-close'
    close.dataset.bsDismiss = 'alert'
    close.setAttribute('aria-label', 'Fermer')
    alert.append(close)

    container.replaceChildren(alert)
}

function initContactForm() {
    const contactForm = document.body.querySelector('#contactForm')
    if (!contactForm) return

    contactForm.addEventListener(
        'submit',
        (event) => {
            event.preventDefault()
            event.stopPropagation()
            contactForm.classList.add('was-validated')
            if (!contactForm.checkValidity()) {
                return
            }

            const name = contactForm.querySelector('#name').value
            const email = contactForm.querySelector('#email').value
            const phone = contactForm.querySelector('#phone').value
            const message = contactForm.querySelector('#message').value
            const need = contactForm.querySelector('input[name="need"]:checked')?.value ?? 'Non précisé'
            const timeline = contactForm.querySelector('#timeline').value

            const data = {
                _replyto: email,
                _subject: `Demande de contact : ${need}`,
                message: `${name} a fait une demande de contact :
                        Besoin : ${need}
                        Calendrier : ${timeline}
                        ${message}
                        Téléphone : ${phone || 'Non renseigné'}
                        Email : ${email}
                    `,
            }

            const success = document.body.querySelector('#success')
            const sendMessageButton = document.body.querySelector('#sendMessageButton')
            const originalButtonContent = [...sendMessageButton.childNodes]

            // Show loading state
            sendMessageButton.setAttribute('disabled', 'disabled')
            sendMessageButton.textContent = 'Envoi en cours…'

            // Clear any previous server validation errors
            contactForm.querySelectorAll('.server-invalid').forEach((el) => {
                el.classList.remove('server-invalid', 'is-invalid')
            })
            contactForm.querySelectorAll('.server-feedback').forEach((el) => {
                el.remove()
            })

            fetch(contactForm.getAttribute('action'), {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
            })
                .then(async (response) => {
                    if (response.ok) {
                        track('contact-form', { need, timeline })
                        showAlert(
                            success,
                            'success',
                            'Votre message a bien été envoyé.',
                            'Je vous réponds sous 24h ouvrées.'
                        )
                        contactForm.classList.remove('was-validated')
                        contactForm.reset()
                    } else if (response.status === 422) {
                        // Handle Formspree validation errors
                        const errorData = await response.json()
                        if (errorData.errors && Array.isArray(errorData.errors)) {
                            const fieldMessages = {
                                email: "L'adresse email n'est pas valide.",
                                phone: 'Le numéro de téléphone est invalide.',
                                name: 'Le nom est invalide.',
                                message: 'Le message est invalide.',
                            }

                            errorData.errors.forEach((err) => {
                                const fieldName = err.field === '_replyto' ? 'email' : err.field
                                const field = contactForm.querySelector(`#${fieldName}`)
                                if (field) {
                                    field.classList.add('is-invalid', 'server-invalid')
                                    const feedback = document.createElement('div')
                                    feedback.className = 'invalid-feedback server-feedback'
                                    feedback.style.display = 'block'
                                    feedback.textContent = fieldMessages[fieldName] || err.message
                                    field.parentNode.appendChild(feedback)
                                }
                            })

                            showAlert(success, 'danger', 'Merci de corriger les erreurs dans le formulaire.')
                        }
                    } else {
                        throw new Error('Server error')
                    }
                })
                .catch(() => {
                    track('contact-form-error', { need })
                    showAlert(
                        success,
                        'danger',
                        `Désolé ${name}, on dirait que le message n'a pas pu être envoyé. Merci d'essayer un peu plus tard ou de me contacter directement par téléphone !`
                    )
                    contactForm.classList.remove('was-validated')
                })
                .finally(() => {
                    sendMessageButton.removeAttribute('disabled')
                    sendMessageButton.replaceChildren(...originalButtonContent)
                })
        },
        false
    )
}

// The selected need adapts the message placeholder and help text (data-placeholder / data-help on each radio)
function initContactNeeds() {
    const message = document.body.querySelector('#message')
    const indicator = document.body.querySelector('#needIndicator')
    const help = document.body.querySelector('#needHelp')
    if (!message) return

    document.body.querySelectorAll('input[name="need"]').forEach((radio) => {
        radio.addEventListener('change', () => {
            message.placeholder = radio.dataset.placeholder
            indicator.textContent = radio.value
            help.textContent = radio.dataset.help
        })
    })
}

window.addEventListener('DOMContentLoaded', () => {
    initAnalytics()
    initCollapseTogglers()
    initNavbar()
    initToc()
    initAlerts()

    if (document.body.id === 'page-home') {
        initContactForm()
        initContactNeeds()
        initPortfolio()
    }
})
