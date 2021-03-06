class StickyHeader extends HTMLElement {
    constructor() {
      super();
    }

    connectedCallback() {
      this.header = document.getElementById('shopify-section-header');
      this.headerBounds = {};
      this.currentScrollTop = 0;
      const that = this; 

      this.onScrollHandler = this.onScroll.bind(this);

      window.addEventListener('scroll', this.onScrollHandler, false);

      this.createObserver();


      let activeDropDown = null; 

      function checkIfOpen() {
        that.header.querySelectorAll('details[open]').forEach(function() {
          console.log('is open!');
          return true
        })
      }

      document.querySelectorAll('details-disclosure').forEach(function(elem) {


        elem.querySelector('details').addEventListener("toggle", event => {
          if(elem.querySelector('details').open) {
            console.log(activeDropDown); 

            if(activeDropDown !== elem.querySelector('span').textContent) {
              console.log('TRANSFORM');
            }

            activeDropDown = elem.querySelector('span').textContent; 
            console.log(activeDropDown); 

          } else if(!checkIfOpen()) {
            that.header.classList.remove('has-dropdown-open');
          }
        });
      });
    }

    disconnectedCallback() {
      window.removeEventListener('scroll', this.onScrollHandler);
    }

    onKeyUp(event) {
      console.log(event); 
    }

    createObserver() {
      let observer = new IntersectionObserver((entries, observer) => {
        this.headerBounds = entries[0].intersectionRect;
        observer.disconnect();
      });

      observer.observe(this.header);
    }

    onScroll() {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

      if (scrollTop > this.currentScrollTop && scrollTop > this.headerBounds.bottom) {
        requestAnimationFrame(this.hide.bind(this));
      } else if (scrollTop < this.currentScrollTop && scrollTop > this.headerBounds.bottom) {
        requestAnimationFrame(this.reveal.bind(this));
      } else if (scrollTop <= this.headerBounds.top) {
        requestAnimationFrame(this.reset.bind(this));
      }

      this.currentScrollTop = scrollTop;
    }

    hide() {
      this.header.classList.add('shopify-section-header-hidden', 'shopify-section-header-sticky');
    }

    reveal() {
      this.header.classList.add('shopify-section-header-sticky', 'animate');
      this.header.classList.remove('shopify-section-header-hidden');
    }

    reset() {
      this.header.classList.remove('shopify-section-header-hidden', 'shopify-section-header-sticky', 'animate');
    }

    closeMenuDisclosure() {
      this.disclosures = this.disclosures || this.header.querySelectorAll('details-disclosure');
      this.disclosures.forEach(disclosure => disclosure.close());
    }

    closeSearchModal() {
      this.searchModal = this.searchModal || this.header.querySelector('details-modal');
      this.searchModal.close(false);
    }
  }

  customElements.define('sticky-header', StickyHeader);
  


class HeaderDrawer  extends HTMLElement {
    constructor() {
      super();
      this.setUpEvents(); 
    }
    
    close() {
        this.text = this.offCanvasToggle.querySelector('[data-text]');
        this.text.textContent = 'Open Menu'; 
        this.offCanvasToggle.setAttribute('aria-expanded', false);
        this.offCanvasToggle.setAttribute('aria-label', 'Open Menu');
        this.offCanvasToggle.classList.remove('is-close'); 
        this.querySelector('[data-off-canvas-menu]').classList.remove('is-open');
        document.body.classList.remove(`overflow-hidden-${this.dataset.breakpoint}`);
        document.querySelector('header').classList.remove('menu-is-open'); 
    }

    changeToggleText() {

    }
    
    openMenu() {
        this.header = this.header || document.getElementById('shopify-section-header');
        this.borderOffset = this.borderOffset || this.closest('.header-wrapper').classList.contains('header-wrapper--border-bottom') ? 1 : 0;
         document.documentElement.style.setProperty('--header-bottom-position', `${parseInt(this.header.getBoundingClientRect().bottom - this.borderOffset)}px`);
       
         this.offCanvasToggle.setAttribute('aria-expanded', true);
         this.offCanvasToggle.setAttribute('aria-label', 'Close Menu');
         this.offCanvasToggle.classList.add('is-close'); 


         this.querySelector('[data-off-canvas-menu]').classList.add('is-open');

        trapFocus(this, this.offCanvasToggle);
        document.body.classList.add(`overflow-hidden-${this.dataset.breakpoint}`);
        document.querySelector('header').classList.add('menu-is-open'); 
    }

    toggleHeaderMenus() {
        if(this.offCanvasCart.querySelector('[data-cart]').classList.contains('is-active')) {
            this.offCanvasCart.close();
            document.querySelector('[data-cart-toggle]').classList.remove('is-open');
            return
        }

        if(this.querySelector('[data-off-canvas-menu]').classList.contains('is-open')) {
            this.close();
        } else {
            this.openMenu();
        }

    }

    switchToCartToggle() {  
        this.text = this.querySelector('[data-menu-toggle]').querySelector('[data-text]');
        this.text.textContent = 'Close Cart'; 
        this.offCanvasToggle.setAttribute('aria-expanded', true);
        this.offCanvasToggle.setAttribute('aria-label', 'Close Cart');
        this.offCanvasToggle.classList.add('is-close'); 
    }


    setUpEvents() {
        this.offCanvasCart = document.querySelector('cart-notification');
        this.offCanvasToggle = this.querySelector('[data-menu-toggle]'); 
        this.querySelector('[data-menu-toggle]').addEventListener('click', () => {
            this.toggleHeaderMenus(); 
        }); 
    }
  }
  
  customElements.define('header-drawer', HeaderDrawer);
  

  

class CartToggle extends HTMLElement {
  constructor() {
    super(); 
    this.cartNotification = document.querySelector('cart-notification');
    this.cartCount = this.querySelector('[data-cart-count]');
    this.cartCountAria = this.querySelector('[data-cart-count-aria]');
    this.setUpEvents(); 
  }
  
  updateToggleQty(pCart) {
   this.cartCount.textContent = pCart.item_count; 
   this.cartCountAria.textContent = pCart.item_count > 1 ? `${pCart.item_count} Items` : `${pCart.item_count} Item`;
  }

  setUpEvents() {
    this.querySelector('[data-cart-toggle]').addEventListener('click', (event) => {
      event.preventDefault();

      if(this.getAttribute('aria-expanded') == 'false') {
        this.setAttribute('aria-expanded', true); 
      } else {
        this.setAttribute('aria-expanded', false); 
      }

      event.currentTarget.classList.add('is-open');
      
        this.cartNotification.open(); 
        document.querySelector('header-drawer').switchToCartToggle(); 
    
        // fetch('/cart.js', { 
        //   method: 'GET',
        //   headers: {
        //   'Content-Type': 'application/json'
        //   }
        //   })
        //   .then((response) => response.json())
        //   .then((parsedState) => {
        //     this.cartNotification.renderContents(parsedState);
        //   })
        //   .catch((e) => {
        //     console.error(e);
        //   });

    })
  }
}

customElements.define('cart-toggle', CartToggle);



class MenuDropdown extends HTMLElement {
  constructor() {
    super(); 
  
    this.dropDownToggle = this.querySelector('button');
    this.dropDownContent = this.querySelector('.header__submenu');

    this.addEventListener('keyup', this.onKeyUp);
    this.addEventListener('focusout', this.onFocusOut.bind(this));  
    this.addEventListener('click', (e) => {
      if(e.target.hasAttribute('href')) {
        this.close(); 
      }
    }); 

    this.setUpEvents(); 
  }

  onKeyUp(event) {
    if(event.code.toUpperCase() !== 'ESCAPE') return;


    const toggleElement = this.querySelector("button[aria-expanded='true']");
    if (!toggleElement) return;

    // const summaryElement = toggleElement.querySelector('summary');
    // toggleElement.removeAttribute('open');

    this.close(); 
    toggleElement.focus();
  }

  onFocusOut() {
    setTimeout(() => {
      if (!this.contains(document.activeElement)) this.close();
    })
  }

  close() {
    this.dropDownContent.setAttribute('aria-hidden', true); 
    this.dropDownToggle.setAttribute('aria-expanded', false); 
  }

  setUpEvents() {
    if(this.dropDownToggle) {
      this.dropDownToggle.addEventListener('click', () => {
    
          if(this.dropDownContent.getAttribute('aria-hidden') == 'false') {
            this.dropDownContent.setAttribute('aria-hidden', true); 
            this.dropDownToggle.setAttribute('aria-expanded', false); 
          } else {
            this.dropDownContent.setAttribute('aria-hidden', false); 
            this.dropDownToggle.setAttribute('aria-expanded', true); 
          }
      }); 
    }
  }
}

customElements.define('menu-dropdown', MenuDropdown);

