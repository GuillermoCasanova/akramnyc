



class ProductHelp extends HTMLElement {
    constructor() {
        super() 
        this.mediaQueries = {
            mediumDown: window.matchMedia('(max-width: 974px)'),
            largeUp: window.matchMedia('(min-width: 975px)')
        }
        
        this.init(); 
    }

    init() {
        this.mediaQueries.largeUp.addEventListener("change", this.handleLargeUp.bind(this)); 
        this.mediaQueries.mediumDown.addEventListener("change", this.handleMediumDown.bind(this)); 

        if(this.mediaQueries.mediumDown.matches) {
            console.log('DOWN');
            this.handleMediumDown(this.mediaQueries.mediumDown); 
        }

        if(this.mediaQueries.largeUp.matches) {
            this.handleLargeUp(this.mediaQueries.largeUp); 
        }
    }

    openModal(pId) {
        this.querySelector('aside').classList.toggle('is-visible');
    }   

    closeModal() {
        this.querySelector('aside').classList.remove('is-visible');
    }

    handleMediumDown(pEvent) {

    }   

    handleMediumDown(pEvent) {
        if(pEvent.matches) {



        }
    }
    
    handleLargeUp(pEvent) {

        if(pEvent.matches) {
            this.querySelectorAll('[data-help-toggle]').forEach((elem) => {
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

    setUpEvents() { 
    
    }

}

customElements.define('product-help', ProductHelp);