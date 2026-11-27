export default class SimpleCollapse {
    readonly element: Element
    isOpen: boolean

    constructor(element: Element) {
        this.element = element
        this.isOpen = element.classList.contains('show')
    }

    static instances = new Map<Element, SimpleCollapse>()

    static getInstance(element: Element): SimpleCollapse | undefined {
        return SimpleCollapse.instances.get(element)
    }

    static getOrCreateInstance(element: Element): SimpleCollapse {
        let instance = SimpleCollapse.instances.get(element)
        if (!instance) {
            instance = new SimpleCollapse(element)
            SimpleCollapse.instances.set(element, instance)
        }
        return instance
    }

    show(): void {
        this.element.classList.add('show')
        this.isOpen = true
    }

    hide(): void {
        this.element.classList.remove('show')
        this.isOpen = false
    }

    toggle(): void {
        if (this.isOpen) {
            this.hide()
        } else {
            this.show()
        }
    }
}
