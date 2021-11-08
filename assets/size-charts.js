/**
 * Product Template Script
 * ------------------------------------------------------------------------------
 * A file that contains scripts highly couple code to the Product template.
 *
 * @namespace product
 * @file vendors@template.product.js
 * @file template.product.js
 *
 */



class SizeChartModal  extends HTMLElement {
    constructor() {
        super(); 
        this.sectionContainer = document.querySelector('#shopify-section-product-size-charts'); 
        this.modal = document.querySelector('size-chart-modal');
        this.modalToggle = document.querySelector('size-chart-modal-toggle');
        this.setUpEvents(); 
    }

    openModal() {
      this.modal.classList.remove('is-hidden'); 
      this.modal.classList.add('is-visible'); 
      this.modal.removeAttribute('hidden');
    }

    closeModal() {
      this.modal.classList.remove('is-visible'); 
      this.modal.classList.add('is-hidden'); 
      this.modal.setAttribute('hidden', true);
    }

    setUpEvents() {

      document.addEventListener('click', (e) => {
      
        if(e.target && e.target.hasAttribute('size-chart-modal-open')) {
          console.log('prevent'); 
           e.preventDefault(); 
          this.openModal(); 
        }

        if(e.target && e.target.hasAttribute('size-chart-modal-close')) {
          e.preventDefault(); 
          this.closeModal(); 
        }
      });
    
    }
}

customElements.define('size-chart-modal', SizeChartModal);