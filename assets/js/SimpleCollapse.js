export default class SimpleCollapse {
    constructor(element) {
        this.element = element;
        this.isOpen = element.classList.contains('show');
    }

    static instances = new Map();

    static getInstance(element) {
        return SimpleCollapse.instances.get(element);
    }

    static getOrCreateInstance(element) {
        if (!SimpleCollapse.instances.has(element)) {
            SimpleCollapse.instances.set(element, new SimpleCollapse(element));
        }
        return SimpleCollapse.instances.get(element);
    }

    show() {
        this.element.classList.add('show');
        this.isOpen = true;
    }

    hide() {
        this.element.classList.remove('show');
        this.isOpen = false;
    }

    toggle() {
        if (this.isOpen) {
            this.hide();
        } else {
            this.show();
        }
    }
}
