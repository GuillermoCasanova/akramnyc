



class ProductHelp extends HTMLElement {
    constructor() {
        super() 
        this.init(); 
    }

    init() {
        this.setUpEvents(); 
    }

    openModal(pId) {
        this.querySelector('aside').classList.toggle('is-visible');
    }   

    closeModal() {
        this.querySelector('aside').classList.remove('is-visible');
    }

    setUpEvents() { 
        this.querySelectorAll('[data-help-toggle]').forEach((elem) => {
            console.log(elem);
            elem.addEventListener('click', () =>  {
                document.querySelector('.product__info-wrapper').style.zIndex = 100; 
                this.openModal(this.dataset.id);
            }); 
        })

        this.querySelectorAll('[data-help-close]').forEach((elem) => {
            elem.addEventListener('click', (event) =>  {
                document.querySelector('.product__info-wrapper').style.zIndex = 0;
                this.closeModal(event);
            }); 
        })
    }

}

customElements.define('product-help', ProductHelp);