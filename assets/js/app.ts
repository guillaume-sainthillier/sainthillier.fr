import initAnalytics, { track } from './analytics'
import initNavbar from './navbar'
import initPortfolio from './portfolio'
import SimpleCollapse from './SimpleCollapse'
import initToc from './toc'

type FormField = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement

// Body of a Formspree 422 answer
type FormspreeErrors = {
    errors?: { field?: string; message: string }[]
}

function initCollapseTogglers(): void {
    document.addEventListener('click', (e) => {
        if (!(e.target instanceof Element)) return

        const toggler = e.target.closest('[data-bs-toggle="collapse"]')
        if (toggler) {
            e.preventDefault()
            const targetSelector = toggler.getAttribute('data-bs-target')
            const target = targetSelector ? document.querySelector(targetSelector) : null
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

function initAlerts(): void {
    document.addEventListener('click', (e) => {
        if (!(e.target instanceof Element)) return

        const alert = e.target.closest('[data-bs-dismiss="alert"]')?.closest('.alert')
        if (alert) {
            alert.classList.remove('show')
            setTimeout(() => alert.remove(), 150)
        }
    })
}

/**
 * Shows a dismissible alert (the data-bs-dismiss="alert" button is handled by initAlerts) in place of the
 * container's content. Built with DOM nodes, never HTML strings: the messages may include what the visitor typed.
 *
 * @param container element receiving the alert
 * @param type alert style
 * @param title text in bold
 * @param text text after the title
 */
function showAlert(container: HTMLElement, type: 'success' | 'danger', title: string, text = ''): void {
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

function initContactForm(): void {
    const contactForm = document.body.querySelector<HTMLFormElement>('#contactForm')
    if (!contactForm) return

    // Rendered with the form (homepage.html)
    const formStep = document.body.querySelector<HTMLElement>('#contactFormStep')!
    const sent = document.body.querySelector<HTMLElement>('#contactSent')!

    // Once sent, the form gives way to what happens next; the focus follows so that screen readers announce it
    const showContactSent = (isSent: boolean) => {
        formStep.hidden = isSent
        sent.hidden = !isSent
        if (isSent) {
            sent.focus({ preventScroll: true })
            sent.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
        } else {
            contactForm.querySelector<HTMLInputElement>('input[name="need"]:checked')?.focus()
        }
    }

    sent.querySelector('[data-contact-reset]')?.addEventListener('click', () => showContactSent(false))

    // The red border and message come from :invalid in CSS; aria-invalid tells assistive technologies the same
    const fields = [...contactForm.querySelectorAll<FormField>('input, select, textarea')]
    const markInvalidFields = () => {
        for (const field of fields) {
            field.setAttribute('aria-invalid', String(!field.validity.valid))
        }
    }

    // Brings the visitor to the first field to fix, which may be off-screen on a phone
    const focusFirstInvalidField = () => {
        const field = fields.find((element) => !element.validity.valid || element.classList.contains('is-invalid'))
        if (!field) return

        field.focus({ preventScroll: true })
        field.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }

    // Once the visitor tried to send, each field says whether it is fixed as they type
    contactForm.addEventListener('input', () => {
        if (contactForm.classList.contains('was-validated')) {
            markInvalidFields()
        }
    })

    contactForm.addEventListener(
        'submit',
        (event) => {
            event.preventDefault()
            event.stopPropagation()
            contactForm.classList.add('was-validated')
            markInvalidFields()
            if (!contactForm.checkValidity()) {
                focusFirstInvalidField()
                return
            }

            const name = contactForm.querySelector<HTMLInputElement>('#name')!.value
            const email = contactForm.querySelector<HTMLInputElement>('#email')!.value
            const phone = contactForm.querySelector<HTMLInputElement>('#phone')!.value
            const message = contactForm.querySelector<HTMLTextAreaElement>('#message')!.value
            const need =
                contactForm.querySelector<HTMLInputElement>('input[name="need"]:checked')?.value ?? 'Non précisé'
            const timeline = contactForm.querySelector<HTMLSelectElement>('#timeline')!.value

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

            const success = document.body.querySelector<HTMLElement>('#success')!
            const sendMessageButton = document.body.querySelector<HTMLButtonElement>('#sendMessageButton')!
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

            fetch(contactForm.getAttribute('action') ?? '', {
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
                        contactForm.classList.remove('was-validated')
                        contactForm.reset()
                        // The reset checks the first need again: its placeholder and help text follow
                        contactForm.querySelector('input[name="need"]:checked')?.dispatchEvent(new Event('change'))
                        success.replaceChildren()
                        showContactSent(true)
                    } else if (response.status === 422) {
                        // Handle Formspree validation errors
                        const errorData: FormspreeErrors = await response.json()
                        if (errorData.errors && Array.isArray(errorData.errors)) {
                            const fieldMessages: Record<string, string> = {
                                email: "L'adresse email n'est pas valide.",
                                phone: 'Le numéro de téléphone est invalide.',
                                name: 'Le nom est invalide.',
                                message: 'Le message est invalide.',
                            }

                            errorData.errors.forEach((err) => {
                                const fieldName = err.field === '_replyto' ? 'email' : err.field
                                const field = fieldName ? contactForm.querySelector(`#${fieldName}`) : null
                                if (fieldName && field) {
                                    field.classList.add('is-invalid', 'server-invalid')
                                    field.setAttribute('aria-invalid', 'true')
                                    const feedback = document.createElement('div')
                                    feedback.className = 'invalid-feedback server-feedback'
                                    feedback.style.display = 'block'
                                    feedback.textContent = fieldMessages[fieldName] || err.message
                                    field.parentNode?.appendChild(feedback)
                                }
                            })

                            showAlert(success, 'danger', 'Merci de corriger les erreurs dans le formulaire.')
                            focusFirstInvalidField()
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
function initContactNeeds(): void {
    const message = document.body.querySelector<HTMLTextAreaElement>('#message')
    const indicator = document.body.querySelector('#needIndicator')
    const help = document.body.querySelector('#needHelp')
    if (!message || !indicator || !help) return

    document.body.querySelectorAll<HTMLInputElement>('input[name="need"]').forEach((radio) => {
        radio.addEventListener('change', () => {
            message.placeholder = radio.dataset.placeholder ?? ''
            indicator.textContent = radio.value
            help.textContent = radio.dataset.help ?? ''
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
