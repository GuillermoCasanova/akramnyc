
import Swiper from './swiper.module.js'


class ProductHelp extends HTMLElement {
    constructor() {
        super() 

        this.selectors = {
            supportLinksContainer: '[data-support-links]',
            supportLink: '[data-support-link]',
            supportModal: '[data-support-sections]',
            supportSection: '[data-support-section]',
            supportSectionsContainer: '[data-support-sections]',
            supportSectionsWrapper: '[data-support-sections-inner]',
            overlay: '[data-support-overlay]'
        }


        this.mediaQueries = {
            mediumDown: window.matchMedia('(max-width: 974px)'),
            largeUp: window.matchMedia('(min-width: 975px)')
        }

        this.currentLink = null; 
        
        this.init(); 
    }

    init() {
        this.mediaQueries.largeUp.addEventListener("change", this.handleLargeUp.bind(this)); 
        this.mediaQueries.mediumDown.addEventListener("change", this.handleMediumDown.bind(this)); 

        
        if(this.mediaQueries.mediumDown.matches) {
            this.handleMediumDown(this.mediaQueries.mediumDown); 
        }

        if(this.mediaQueries.largeUp.matches) {
            this.handleLargeUp(this.mediaQueries.largeUp); 
        }
    }

    open(pId) {
        this.querySelector(this.selectors.supportModal).setAttribute('aria-hidden', false);
        this.querySelector(this.selectors.overlay).classList.add('is-visible');

         this.querySelector(this.selectors.supportModal).addEventListener('transitionend', () => {
            this.querySelector(this.selectors.supportModal).querySelector('[data-help-close]').focus(); 
          }, { once: true });
     
        trapFocus(this.querySelector(this.selectors.supportModal));
    }   

    close() {
        this.querySelector(this.selectors.supportModal).setAttribute('aria-hidden', true);
        this.querySelector(this.selectors.overlay).classList.remove('is-visible');

        this.querySelectorAll(this.selectors.supportLink).forEach((elem) => {
            elem.setAttribute('aria-expanded', false);
        }); 
        
        this.querySelector(this.selectors.supportModal).addEventListener('transitionend', () => {
            this.currentLink.focus();
          }, { once: true });
          
        removeTrapFocus(this.querySelector(this.selectors.supportModal)); 
    }

    updateModalName() { 
        let activeModalName = this.currentLink.innerText.toLowerCase(); 
        this.querySelector(this.selectors.supportModal).setAttribute('aria-label', activeModalName); 
        this.querySelector(this.selectors.supportModal).querySelector('[data-help-close]').setAttribute('aria-label', "Close " +  activeModalName + " Modal"); 
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

                if(index === 0) {
                    element.classList.add('is-active');
                    this.slideshow.slideTo(0); 
                }

                element.addEventListener('click', () => {
                    this.querySelectorAll(this.selectors.supportLink).forEach((element) => {
                        element.classList.remove('is-active');
                    }); 
                    element.classList.add('is-active');
                    this.slideshow.slideTo(element.dataset.id); 
                }); 
            }); 

        } else {
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
                preventInteractionOnTransition: true,
                fade: true
                
            });

            this.querySelectorAll(this.selectors.supportLink).forEach((element, index) => {
                element.addEventListener('click', () => {
                    this.slideshow.slideTo(element.dataset.id); 
                }); 
            }); 

            this.querySelectorAll(this.selectors.supportLink).forEach((elem) => {
                elem.addEventListener('click', (event) =>  {

                    this.querySelectorAll(this.selectors.supportLink).forEach((elem) => {
                        elem.setAttribute('aria-expanded', false);
                    }); 
                    
                    this.currentLink = elem; 
                    this.updateModalName();
                    this.open();
                    elem.setAttribute('aria-expanded', true);
                    document.querySelector('.product__info-wrapper').style.zIndex = 100; 
                    this.setActive(event);
                }); 
            })

            this.querySelectorAll('[data-help-close]').forEach((elem) => {
                elem.addEventListener('click', (event) =>  {
                    document.querySelector('.product__info-wrapper').style.zIndex = 0;
                    this.close(event);
                    this.setInactiveAll(); 
                }); 
            })

            this.addEventListener('keyup', (evt) => evt.code === 'Escape' && this.close());

        } 
    }   

    setActive(pEvent) {
        document.querySelectorAll(this.selectors.supportLink).forEach((elem) => {
            elem.classList.remove('is-active');
        }); 
        pEvent.target.classList.add('is-active');
    }

    setInactiveAll() {
        document.querySelectorAll(this.selectors.supportLink).forEach((elem) => {
            elem.classList.remove('is-active');
        }); 
    }
}

customElements.define('product-help', ProductHelp);