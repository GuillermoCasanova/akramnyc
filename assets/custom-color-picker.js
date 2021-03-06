



class CustomColorPicker extends HTMLElement {
    constructor() {
        super();
        this.addEventListener('change', this.onVariantChange);

        if(this.querySelector("[data-color-container]") !== null ) {
            this.init(); 
        }
    }

    onVariantChange() {
        
        this.updateActiveColorLabel(this.getSelectedColor().dataset.colorName); 
        this.updateURL(); 
        this.updateImages();
        this.updateProductId(); 
        this.updateDescription() 
    }

    updateURL() {
        let url = this.currentColor.dataset.productUrl; 
        window.history.replaceState({ }, '', `${url}`);
    }

    updateActiveColorLabel(pColorName) {
        this.querySelector("[data-color-container]").textContent = pColorName;
    }

    setCurrentColor() {
        let currentColorName =  this.querySelector("[data-color-container]").textContent.toLocaleLowerCase().replace(/[\n\r]+|[\s]{2,}/g, '');
        this.querySelectorAll('[data-color-option]').forEach((elem) => {
            if(elem.dataset.colorName.toLocaleLowerCase() === currentColorName ) {
                elem.checked = true; 
            }
        });  
    }

    getSelectedColor() { 
        let that = this; 
        this.querySelectorAll('[data-color-option]').forEach((elem) => {
            if(elem.checked) {
                this.currentColor = elem; 
            }
        }); 

        return this.currentColor; 
        
        // .find((variant) => {
        //     return !variant.options.map((option, index) => {
        //       return this.options[index] === option;
        //     }).includes(false);
        //   });
    }; 

    updateProductId() {
        document.querySelector('[data-active-product-id]').value = JSON.parse(this.currentColor.dataset.product).variants[0].id; 

        document.querySelectorAll('variant-radios').forEach((elem) => {
             elem.dataset.url = this.getSelectedColor().dataset.productUrl;

                if( elem.querySelector('[type="application/json"]')) {
                    let e = elem.querySelector('[type="application/json"]');
                    e.parentElement.removeChild(e); 
                }

            let newScript = document.createElement('script');
            newScript.innerHTML  = ` ` + JSON.stringify(JSON.parse(this.currentColor.dataset.product).variants);  
            newScript.type = "application/json";
            elem.appendChild(newScript); 
            elem.onVariantChange(true);
        }); 


    }

    updateImages() {
        let productObj = JSON.parse(this.currentColor.dataset.product); 
        let images = productObj.media; 
        let imagesTemplate = ``;

        
        function createImageObj(pSource, pAlt, pIndex) {
            let imageTemplate = ``; 
            let index = pIndex + 1;

            function processImageSrc(pImageSrc, pSize) {
                let imageSrc = '';
                imageSrc = pImageSrc.replace(/(\.[^.]*)$/, `_${pSize}$1`)
                .replace('http:', '');
                return imageSrc;
            }


            imageTemplate = `
               <li class="slide  swiper-slide"  data-product-images-slideshow-slide data-images-scroller-image data-product-images-modal-open data-id="${index}">
                    <div class="product-images-slideshow__image-container">
                    <picture>
                        <source srcset="${processImageSrc(pSource, '1050x')}"  media="(min-width: 1300px)">
                          <source srcset="${processImageSrc(pSource, '1000x')}"  media="(min-width: 975px)">
                        <source srcset="${processImageSrc(pSource, '900x')}"  media="(min-width: 750px)">
                        <img src="${processImageSrc(pSource, '800x')}" alt=""${pAlt}" height="1000" loading="lazy">
                        </picture>
                    </div>
              </li> 
            `; 

            document.querySelector('product-images-slideshow').appendSlide(imageTemplate); 
            document.querySelector('product-images-scroller').appendSlide(imageTemplate, index); 

         }
                
        function clearImages() {
            document.querySelector('product-images-slideshow').removeSlides();
            document.querySelector('product-images-scroller').removeSlides(); 
        }

        clearImages() 

        images.forEach((image, index)=> {
            if(image.alt === null || image.alt.indexOf('swatch_') == -1) {
                createImageObj(image.src, '', index);
            }
        });

        let updateEvent = new Event("images-updated", {
            bubbles: true
        }); 

        document.dispatchEvent(updateEvent); 

    }
    
    updateDescription() {
        let productObj = JSON.parse(this.currentColor.dataset.product); 
        let descriptionContainer = document.querySelector('[data-product-description-container]'); 
        descriptionContainer.innerHTML = productObj.description; 
    }

    setUpEvents() {
        if(this.querySelectorAll("[data-color-container]").length > 0) {
            let colorContainer = this.querySelector('[data-color-container]');
            let currentColor = this.querySelector("[data-color-container]").textContent; 
    
            function showColor(pColor) {
                colorContainer.textContent = pColor; 
            }
        
            this.querySelectorAll('[data-color-label]').forEach((element) => {
                element.addEventListener('mouseenter', function(event) {
                    let name = this.dataset.colorName; 
                    showColor(name)
                })
                element.addEventListener('mouseleave', (event) => {
                    showColor(this.getSelectedColor().dataset.colorName)
                })
            }); 
        
        }
    }

    init() {
        this.setUpEvents(); 
        this.setCurrentColor(); 
    }
}

customElements.define('custom-color-picker', CustomColorPicker); 