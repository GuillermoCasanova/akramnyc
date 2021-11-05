

import Swiper from './swiper.module.js'



class ProductImagesSlideshow extends HTMLElement {
    constructor() {
        super(); 
        this.selectors = {
            slideshow: '[data-product-images-slideshow]', 
            slideshowWrapper: '[data-product-images-slideshow-wrapper]',
            slides: '[data-product-images-slideshow-slide]',
            pagination: '[data-product-images-slideshow-pagination]',
            paginationWrapper: '[data-product-images-slideshow-pagination-wrapper]',
            paginationThumbs: '[data-product-images-slideshow-pagination-thumb]'
        }

        this.mediaQueries = {
            mediumDown: window.matchMedia('(max-width: 974px)'),
            largeUp: window.matchMedia('(min-width: 975px)')
        }

        this.init(); 

        console.log(this.selectors);
    }
       
    handleMediumDown(pEvent) {

            if(pEvent.matches) {
                
                const slideshowElem = document.querySelector(this.selectors.slideshow); 
                const that = this; 
                slideshowElem.classList.add('swiper'); 
                slideshowElem.querySelector(this.selectors.slideshowWrapper).classList.add('swiper-wrapper');
                slideshowElem.querySelectorAll(this.selectors.slides).forEach(element => {
                    element.classList.add('swiper-slide');
                });

                this.slideshow = new Swiper(this.selectors.slideshow, {
                    direction: 'horizontal', 
                    loop: true,
                    loopedSlides: 6,
                    preventInteractionOnTransition: true,
                    pagination: {
                        el: this.selectors.pagination,
                        clickable: true,
                        renderBullet: function (index, className) {
                            return '<button aria-label="Slide to product image ' + (index + 1) + '" class="' + className + '"><span class="visually-hidden">' + 'Slide to product image ' + (index + 1) + "</span></button>";
                        }
                    },
                    zoom: {
                        maxRatio: 1.5
                    },
                    thumbs: {
                        swiper:  that.pagination
                    },
                    breakpoints: {
                        1000: {
                            enabled: false
                        }
                    }
                });
            } else {
                this.destroy(); 
                return 
            }
        } 
    
    init() {
        this.mediaQueries.mediumDown.addEventListener("change", this.handleMediumDown.bind(this)); 
        this.handleMediumDown(this.mediaQueries.mediumDown); 
        console.log('init!!'); 
    } 
    initPagination() {
        const paginationElem = document.querySelector(this.selectors.pagination); 
        // paginationElem.classList.add('swiper'); 
        // paginationElem.querySelector(this.selectors.paginationWrapper).classList.add('swiper-wrapper');
        // paginationElem.querySelectorAll(this.selectors.paginationThumbs).forEach(element => {
        //     element.classList.add('swiper-slide');
        // });

        // let className = "swiper-bullet"; 

        // this.pagination = new Swiper(this.selectors.slideshow, {
           
        //     breakpoints: {
        //         1000: {
        //             enabled: false
        //         }
        //     }
        // });

    }
    destroy() {
        if(this.slideshow) {
            document.querySelector(this.selectors.slideshow).classList.remove('swiper');
            document.querySelector(this.selectors.slideshowWrapper).classList.remove('swiper-wrapper');
            this.slideshow.detachEvents(); 
            this.slideshow.destroy(true, true); 
        }
        if(this.pagination) {
            document.querySelector(this.selectors.pagination).classList.remove('swiper');
            document.querySelector(this.selectors.paginationWrapper).classList.remove('swiper-wrapper');
            this.pagination.detachEvents(); 
            this.pagination.destroy(true, true); 
        }
    }
}


customElements.define('product-images-slideshow', ProductImagesSlideshow);


class ProductImagesScroller extends HTMLElement {
    constructor() {
        super(); 
        this.selectors = {
            thumbnails: '[data-images-scroller-thumb]',
            images: '[data-images-scroller-image]',
            container: '[data-images-scroller-thumbs]'
        }
        this.mediaQueries = {
            mediumDown: window.matchMedia('(max-width: 974px)'),
            largeUp: window.matchMedia('(min-width: 975px)')
        }
        this.init(); 

        console.log(this.selectors);
    }
        
    handleLargeUp(pEvent) {

        if(pEvent.matches) {
            let that = this; 
            this.querySelectorAll(this.selectors.thumbnails).forEach(function(element) {
                
                console.log(element); 
                if(element.dataset.id === '1' ||  element.dataset.id === 1) {
                    element.classList.add('is-active');
                }

                element.addEventListener('click', that.goToImage.bind(this, [that])); 
            });


            function callback(entries, observer) {
            entries.forEach(entry => {
                if(entry.isIntersecting) {

                    let id = entry.target.dataset.id

                    that.querySelectorAll(that.selectors.thumbnails).forEach(function(element) {
                        element.classList.remove('is-active');

                        if(parseInt(element.dataset.id) === parseInt(id)) {
                            element.classList.add('is-active');
                        }
                    });
        
                }
                });
            }

            let options = {
                root: document,
                rootMargin: '0px',
                threshold: .9
            }
            
            this.observer = new IntersectionObserver(callback, options); 

            document.querySelectorAll(this.selectors.images).forEach(function(element) {
                let target = element; 
                that.observer.observe(target); 
            }); 


        } else {
            this.destroy(); 
            return 
        }

    }


    goToImage(pThis, pEvent) {
        
        let that = pThis[0]; 
        let pImageId = pEvent.target.closest('[data-images-scroller-thumb]').dataset.id; 
        let scrollDistance = null; 

        that.querySelectorAll(that.selectors.thumbnails).forEach(function(element) {
            element.classList.remove('is-active');
        });

        that.querySelectorAll(that.selectors.images).forEach(function(element){
            if(element.dataset.id === pImageId) {
                scrollDistance =  element.offsetTop 
                //scrollDistance -= (document.querySelector('.product__info-wrapper').getBoundingClientRect().top  / 2); 
            }
        });
        
        window.scrollTo({ top: scrollDistance, behavior: 'smooth' })
    }

    destroy() {
        let that = this; 
        if(this.container) {
            this.container.querySelectorAll(this.selectors.thumbnails).forEach(function(element) {
                element.removeEventListener("click", that.goToImage)
                element.classList.remove('is-active');
            });
        }

        if(this.observer) {
            this.observer = null; 
        }
    }

    init() {  
        this.mediaQueries.largeUp.addEventListener("change", this.handleLargeUp.bind(this)); 
        this.handleLargeUp(this.mediaQueries.largeUp); 
    }
}

customElements.define('product-images-scroller', ProductImagesScroller); 