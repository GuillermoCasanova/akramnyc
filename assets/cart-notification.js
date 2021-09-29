
   



class CartNotification extends HTMLElement {
  constructor() {
    super();

    this.notification = document.getElementById('cart-notification');
    this.header = document.querySelector('sticky-header');
    this.onBodyClick = this.handleBodyClick.bind(this);
    
    this.notification.addEventListener('keyup', (evt) => evt.code === 'Escape' && this.close());
    this.querySelectorAll('button[type="button"]').forEach((closeButton) =>
      closeButton.addEventListener('click', this.close.bind(this))
    );
  }

  open() {
    this.notification.classList.add('animate', 'active');

    this.notification.addEventListener('transitionend', () => {
      this.notification.focus();
      trapFocus(this.notification);
    }, { once: true });

    document.body.addEventListener('click', this.onBodyClick);
  }

  close() {
    this.notification.classList.remove('active');

    document.body.removeEventListener('click', this.onBodyClick);

    removeTrapFocus(this.activeElement);
  }

  renderContents(parsedState) {

    console.log(parsedState); 

    let cartContents = {
      items: parsedState.items, 
      originl_total_price: parsedState.originl_total_price,
      currency: parsedState.currency, 
      requires_shipping: parsedState.requires_shipping
    };

    console.log(cartContents); 
    
    document.querySelector('.cart-notification-product').innerHTML = ""; 

    cartContents.items.forEach(function(element, index) { 
      let html = `
        <h1> hello</h1>
      `;

      let cartItem = element; 
      let item = null; 

     /* Hack to get product image thumbnail
       *   - If image is not null
       *     - Remove file extension, add _small, and re-add extension
       *     - Create server relative link
       *   - A hard-coded url of no-image
      */
     var prodImg;
     if (cartItem.image !== null) {
       prodImg = cartItem.image
         .replace(/(\.[^.]*)$/, '_small$1')
         .replace('http:', '');
     } else {
       prodImg =
         '//cdn.shopify.com/s/assets/admin/no-image-medium-cc9732cb976dd349a0df1d39816fbcc7.gif';
     }

    //  if (cartItem.properties !== null) {
    //    $.each(cartItem.properties, function(key, value) {
    //      if (key.charAt(0) === '_' || !value) {
    //        delete cartItem.properties[key];
    //      }
    //    });
    //  }


     // Create item's data object and add to 'items' array
     item = {
       key: cartItem.key,
       line: index + 1, // Shopify uses a 1+ index in the API
       url: cartItem.url,
       img: prodImg,
       name: cartItem.product_title,
       options: cartItem.options_with_values,
       variation: cartItem.variant_title,
       properties: cartItem.properties,
       itemAdd: cartItem.quantity + 1,
       itemMinus: cartItem.quantity - 1,
       itemQty: cartItem.quantity,
      //  price: new Currency().formatMoney(cartItem.price,window.moneyFormat),
      //  subtotal: new Currency().formatMoney(cartItem.final_line_price,window.moneyFormat),
      //  discountedPrice: new Currency().formatMoney(
      //    cartItem.price - cartItem.total_discount / cartItem.quantity,
      //   window.moneyFormat
      //  ),
       discounts: cartItem.discounts,
       discountsApplied:
         cartItem.price === cartItem.price - cartItem.total_discount
           ? false
           : true,
       vendor: cartItem.vendor
     };

     console.log(item); 
     
      document.querySelector('.cart-notification-product').insertAdjacentHTML('beforeend', `
      <li>
          <div class="product-line-item">

            <a href="${item.url}" class="product-line-item__inner">
            
              <img src="${item.img}" class="product-line-item__image"/>

              <div cass="product-line-item__info">
                <h3>
                  ${item.name}
                <h3>
                <div>
                  <p>
                      $100
                  </p>
                </div>

              </div>
            </a>
          </div>
      <li>
      `); 

    }); 

      // this.productId = parsedState.id;
      // parsedState.sections && this.getSectionsToRender().forEach((section => {
      //   document.getElementById(section.id).innerHTML =
      //     this.getSectionInnerHTML(parsedState.sections[section.id], section.selector);
      // }));

      this.header?.reveal();
      this.open();
  }

  getSectionsToRender() {
    return [
      {
        id: 'cart-notification-product',
        selector: `#cart-notification-product-${this.productId}`,
      },
      {
        id: 'cart-notification-button'
      },
      {
        id: 'cart-icon-bubble'
      }
    ];
  }

  getSectionInnerHTML(html, selector = '.shopify-section') {
    return new DOMParser()
      .parseFromString(html, 'text/html')
      .querySelector(selector).innerHTML;
  }

  handleBodyClick(evt) {
    const target = evt.target;
    if (target !== this.notification && !target.closest('cart-notification')) {
      const disclosure = target.closest('details-disclosure');
      this.activeElement = disclosure ? disclosure.querySelector('summary') : null;
      this.close();
    }
  }

  setActiveElement(element) {
    this.activeElement = element;
  }
}

customElements.define('cart-notification', CartNotification);
