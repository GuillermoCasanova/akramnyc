



class TypeWriter extends HTMLElement {

    constructor() {
        super(); 
        this.textContainer = this.querySelector('[data-text-container]');
    }

    type(pStop) {

        if(pStop) {
            i = 0;
            textContainer.textContent = "";
            clearTimeout(writingFunction);
            this.classList.remove('is-typing');
            return 
        }
        if(i < text.length) {
            this.classList.add('is-typing');
            textContainer.textContent += text.charAt(i);
            i++
            writingFunction = setTimeout(type, speed)
        } else {
            this.classList.remove('is-typing');
        }
    }
    init() {
        this.i = 0; 
        this.text =  this.querySelector('p').dataset.text; 
        this.speed = 60; 
        this.writingFunction = null;
    }
}

customElements.define('type-writer', TypeWriter);
