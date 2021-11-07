



class CustomInputWrapper extends HTMLElement {
    constructor() {
      super(); 
      this.init(); 
    }
  
    init() {
  
      let textFieldWrapper = this; 
  
      console.log(this);
      
      if(this.querySelector('input') !== null) {
  
        this.querySelector('input').addEventListener('change', function(event) {
            let input = event.currentTarget; 
  
            console.log('change');
            if(input.value.length > 0) {
                textFieldWrapper.classList.add('is-active'); 
            } else {
                textFieldWrapper.classList.remove('is-active'); 
            }
  
        }); 
      
      let changeEvent = new Event("change"); 
      
      this.querySelector('input').dispatchEvent(changeEvent); 
      
      this.querySelector('input').addEventListener('focus', function() {
            textFieldWrapper.classList.add('is-active'); 
      }); 
      
      
      this.querySelector('input').addEventListener('blur', function(event) {
          let input = event.currentTarget; 
            if(input.value.length > 0) {
                textFieldWrapper.classList.add('is-active'); 
            } else {
                textFieldWrapper.classList.remove('is-active'); 
            }
      }); 
  }
    }
  
  }
  
  customElements.define('custom-input-wrapper', CustomInputWrapper);
  
  