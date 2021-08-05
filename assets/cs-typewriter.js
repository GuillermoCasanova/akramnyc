
class TypeWriter extends HTMLElement {

    constructor() {
        super(); 
    }

    typeWrite(pStop) {
        let speed = this.speed; 

        if(this.i < this.text.length) {
            this.classList.add('is-typing');
            this.textContainer.textContent += this.text.charAt(this.i);
            this.i++
            this.writingFunction = setTimeout(this.typeWrite.bind(this), speed)
        } else {
            this.classList.remove('is-typing');
        }

    }

    stopWriting() {
        this.i = 0;
        this.textContainer.textContent = "";
        clearTimeout(this.writingFunction);
        this.classList.remove('is-typing');
        return 
    }

    init() {
        this.i = 0; 
        this.text =  this.querySelector('p').dataset.text; 
        this.speed = 60; 
        this.writingFunction = null;
        this.textContainer = this.querySelector('[data-text-container]');

        console.log(this.text); 
    }
}

customElements.define('type-writer', TypeWriter);
