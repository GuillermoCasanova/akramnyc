



class CustomColorPicker extends HTMLElement {
    constructor() {
        super();
        this.addEventListener('change', this.onVariantChange);
        this.init(); 
    }

    onVariantChange() {
        
        this.getSelectedColor(); 
        this.updateURL(); 
        this.updateImages();
        this.updateProductId(); 
    }

    updateURL() {
        let url = this.currentColor.dataset.productUrl; 
        window.history.replaceState({ }, '', `${url}`);
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
        elem.onVariantChange();
    }); 


    }

    updateImages() {
        let productObj = JSON.parse(this.currentColor.dataset.product); 
        let images = productObj.media; 
        let imagesTemplate = ``;

        
        function createImageObj(pSource, pAlt) {
            let newImage = new Image(); 
            let imageTemplate = ``; 
            newImage.src = pSource;
            newImage.alt = pAlt;

            imageTemplate = `

            <li class="slide"  data-product-images-slideshow-slide data-images-scroller-image data-product-images-modal-open>
                <div class="product-images-slideshow__image-container">
                  <picture>
                      <source srcset="${newImage.src}"  media="(min-width: 975px)">
                      <img src="${newImage.src}" alt=""${newImage.alt}" width="100" height="500" loading="lazy">
                    </picture>
                </div>
              </li> 
            `; 

            document.querySelectorAll('[data-product-images-slideshow-wrapper]').forEach((element) => {
                element.insertAdjacentHTML("beforeend", imageTemplate);
            });

         }
                
        function clearImages() {
            document.querySelectorAll('[data-product-images-slideshow-wrapper]').forEach((element) => {
                element.innerHTML = ''; 
            }); 
        }

        clearImages() 

        images.forEach((image)=> {
            if(image.alt === null || image.alt.indexOf('swatch_') == -1) {
                createImageObj(image.src, '');
            }
        });

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
                    console.log('hello');
                    let name = this.dataset.colorName; 
                    showColor(name)
                })
                element.addEventListener('mouseleave', (event) => {
                    showColor(currentColor)
                })
            }); 
        
        }
    }

    init() {
        this.setUpEvents(); 
    }
}

customElements.define('custom-color-picker', CustomColorPicker); 