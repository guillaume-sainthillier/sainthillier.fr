export default class SimpleModal {
    constructor(element) {
        this.element = element;
        this.isOpen = false;
        this.bindEvents();
    }

    static instances = new Map();

    static getOrCreateInstance(element) {
        if (!SimpleModal.instances.has(element)) {
            SimpleModal.instances.set(element, new SimpleModal(element));
        }
        return SimpleModal.instances.get(element);
    }

    static getInstance(element) {
        return SimpleModal.instances.get(element);
    }

    bindEvents() {
        // Close on backdrop click
        this.element.addEventListener('click', (e) => {
            if (e.target === this.element) {
                this.hide();
            }
        });

        // Close on escape key
        this.handleKeydown = (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.hide();
            }
        };
    }

    show() {
        this.element.style.display = 'block';
        document.body.style.overflow = 'hidden';
        document.addEventListener('keydown', this.handleKeydown);
        this.isOpen = true;

        // Trigger fade in after display:block is applied
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                this.element.classList.add('show');
            });
        });
    }

    hide() {
        this.element.classList.remove('show');
        document.body.style.overflow = '';
        document.removeEventListener('keydown', this.handleKeydown);
        this.isOpen = false;

        // Wait for transition then hide
        setTimeout(() => {
            this.element.style.display = 'none';
        }, 150);
    }
}
