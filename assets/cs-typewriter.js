
 // if(this.i < this.text.length) {
        //     // this.classList.add('is-typing');
        //     // let parsedText = new DOMParser().parseFromString()
            
        //     // this.textContainer.innerHTML += ; 
        //     // this.textContainer.textContent += this.text.charAt(this.i);
        //     // this.i++
        //     // this.writingFunction = setTimeout(this.typeWrite.bind(this), speed)


        // } else {
        //     this.classList.remove('is-typing');
        // }lass TypeWriter extends HTMLElement {


            class TypeWriter extends HTMLElement {

                constructor() {
                    super(); 
                }
            
                typeWrite(pStop) {
                    if(this.i < this.str.length) {
                        console.log('typing');
                        this.classList.add('is-typing');
                        let speed = this.speed; 
                        this.text = this.str.slice(0, ++this.i);
                        if (this.text === this.str) return;
                    
                        this.textContainer.innerHTML = this.text;
                    
                        var char = this.text.slice(-1);
                        if( char === '<' ) this.isTag = true;
                        if( char === '>' ) this.isTag = false;
                    
                        if (this.isTag) return this.typeWrite();
                        this.writingFunction  = setTimeout(this.typeWrite.bind(this), speed);
                    } else {
                        console.log('DONE');
                        this.classList.remove('is-typing');
                    }
                }
            
                stopWriting() {
                    this.textContainer = this.querySelector('[data-text-container]');
                    if(this.textContainer.innerHTML == "") {
                        return 
                    }
                    this.i = 0;
                    this.textContainer.innerHTML = "";
                    clearTimeout(this.writingFunction);
                    this.classList.remove('is-typing');
                    return 
                }
            
                init() {
                    this.i = 0; 
                    this.str =  this.querySelector('p').dataset.text; 
                    this.speed = 60; 
                    this.writingFunction = null;
                    this.isTag = ''; 
                    this.text = ''; 
                    this.textContainer = this.querySelector('[data-text-container]');
                }
            }
            
            customElements.define('type-writer', TypeWriter);
            