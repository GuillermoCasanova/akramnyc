
import Swiper from './swiper.module.js'


class ProductHelp extends HTMLElement {
    constructor() {
        super() 

        this.selectors = {
            supportLinksContainer: '[data-support-links]',
            supportLink: '[data-support-link]',
            supportSection: '[data-support-section]',
            supportSectionsContainer: '[data-support-sections]',
            supportSectionsWrapper: '[data-support-sections-inner]',
            overlay: '[data-support-overlay]'
        }


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
            console.log('so this goes?');
            this.handleMediumDown(this.mediaQueries.mediumDown); 
        }

        if(this.mediaQueries.largeUp.matches) {
            this.handleLargeUp(this.mediaQueries.largeUp); 
        }
    }

    openModal(pId) {
        this.querySelector('aside').classList.toggle('is-visible');
        this.querySelector(this.selectors.overlay).classList.add('is-visible');
    }   

    closeModal() {
        this.querySelector('aside').classList.remove('is-visible');
        this.querySelector(this.selectors.overlay).classList.remove('is-visible');
    }

    handleMediumDown(pEvent) {

        if(pEvent.matches) {
                
            const slideshowElem = document.querySelector(this.selectors.supportSectionsContainer); 
            const that = this; 
            slideshowElem.classList.add('swiper'); 
            slideshowElem.querySelector(this.selectors.supportSectionsWrapper).classList.add('swiper-wrapper');
            slideshowElem.querySelectorAll(this.selectors.supportSection).forEach(element => {
                element.classList.add('swiper-slide');
            });

            this.slideshow = new Swiper(this.selectors.supportSectionsContainer, {
                direction: 'horizontal', 
                loop: false,
                allowTouchMove: false, 
                navigation: false,
                preventInteractionOnTransition: true,
                breakpoints: {
                    1000: {
                        enabled: false
                    }
                }
                
            });

            this.querySelectorAll(this.selectors.supportLink).forEach((element, index) => {
                element.addEventListener('click', () => {
                    this.slideshow.slideTo(element.dataset.id); 
                }); 
            }); 

        } else {
            this.destroy(); 
            return 
        }

    }   

    handleLargeUp(pEvent) {

        if(pEvent.matches) {
        
            const slideshowElem = document.querySelector(this.selectors.supportSectionsContainer); 
            const that = this; 
            slideshowElem.classList.add('swiper'); 
            slideshowElem.querySelector(this.selectors.supportSectionsWrapper).classList.add('swiper-wrapper');
            slideshowElem.querySelectorAll(this.selectors.supportSection).forEach(element => {
                element.classList.add('swiper-slide');
            });

            this.slideshow = new Swiper(this.selectors.supportSectionsContainer, {
                direction: 'horizontal', 
                loop: false,
                allowTouchMove: false, 
                navigation: false,
                preventInteractionOnTransition: true
                
            });

            this.querySelectorAll(this.selectors.supportLink).forEach((element, index) => {
                element.addEventListener('click', () => {
                    this.slideshow.slideTo(element.dataset.id); 
                }); 
            }); 

            this.querySelectorAll(this.selectors.supportLink).forEach((elem) => {
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
        } else {

        }
    }   

    setUpEvents() { 
    
    }

}

customElements.define('product-help', ProductHelp);