

class QuantitySelect extends HTMLElement {
    constructor() {
      super();
      this.querySelector('select').addEventListener('change', (event) => {
        console.log( parseInt(event.currentTarget.value)); 
        console.log(parseInt(this.dataset.index)); 
      }); 
    }
}

customElements.define('quantity-select', QuantitySelect);



class CartItems extends HTMLElement {
  constructor() {

    super();

    this.lineItemStatusElement = document.getElementById('shopping-cart-line-item-status');

    this.currentItemCount = Array.from(this.querySelectorAll('[name="updates[]"]'))
      .reduce((total, quantityInput) => total + parseInt(quantityInput.value), 0);

    this.debouncedOnChange = debounce((event) => {
      this.onChange(event);
    }, 300);

    this.addEventListener('change', this.debouncedOnChange.bind(this));
  }

  onChange(event) {
    this.updateQuantity(event.target.dataset.index, event.target.value, document.activeElement.getAttribute('name'));
  }

  getSectionsToRender() {
    return [
      {
        id: 'main-cart-items',
        section: document.getElementById('main-cart-items').dataset.id,
        selector: '.js-contents',
      },
      {
        id: 'cart-icon-bubble',
        section: 'cart-icon-bubble',
        selector: '.shopify-section'
      },
      {
        id: 'cart-live-region-text',
        section: 'cart-live-region-text',
        selector: '.shopify-section'
      },
      {
        id: 'main-cart-footer',
        section: document.getElementById('main-cart-footer').dataset.id,
        selector: '.js-contents',
      }
    ];
  }

  updateQuantity(line, quantity, name) {
    this.enableLoading(line);

    const body = JSON.stringify({
      line,
      quantity,
      sections: this.getSectionsToRender().map((section) => section.section),
      sections_url: window.location.pathname
    });

    fetch(`${routes.cart_change_url}`, {...fetchConfig(), ...{ body }})
      .then((response) => {
        return response.text();
      })
      .then((state) => {
        const parsedState = JSON.parse(state);
        this.classList.toggle('is-empty', parsedState.item_count === 0);
        document.getElementById('main-cart-footer')?.classList.toggle('is-empty', parsedState.item_count === 0);
        this.renderCart(parsedState);
        this.updateLiveRegions(line, parsedState.item_count);

           // document.getElementById(`CartItem-${line}`)?.querySelector(`[name="${name}"]`)?.focus();
           this.disableLoading();

        // this.getSectionsToRender().forEach((section => {

        //   console.log(section); 

        //   // const elementToReplace =
        //   //   document.getElementById(section.id).querySelector(section.selector) || document.getElementById(section.id);

        //   //   console.log(parsedState); 

        //   // elementToReplace.innerHTML =  this.getSectionInnerHTML(parsedState.sections[section.section], section.selector);
        // }));

     

      }).catch((err) => {
        console.log(err); 
        this.querySelectorAll('.loading-overlay').forEach((overlay) => overlay.classList.add('hidden'));
        document.getElementById('cart-errors').textContent = window.cartStrings.error;
        this.disableLoading();
      });
  }

  renderCart(pCart) {

    let productsHTML = ""; 

    console.log(pCart)

    function priceTemplate(pItem) {

      let priceTemplate = ''; 

      if(pItem.discountsApplied) {

        let discountActive = `
            <dl class="cart-item__discounted-prices">
            <dt class="visually-hidden">
              ${pItem.regular_price}
            </dt>
            <dd>
              <s class="cart-item__old-price price price--end">
                ${pItem.price}
              </s>
            </dd>
            <dt class="visually-hidden">
              ${pItem.discountedPrice}
            </dt>
            <dd class="price price--end">
              ${pItem.final_price}
            </dd>
          </dl>
        `; 

        priceTemplate = priceTemplate + discountActive; 
         
      } else {
        priceTemplate = `
         <span class="price price--end">
          ${pItem.price}
         </span>
        ` 
      }
      return priceTemplate;
    }

    function variantTemplate(pItem) {

    let product_contents = pItem; 
    let template = ''; 

    console.log(product_contents); 

      if(product_contents.originalObject.has_only_default_variant == false || product_contents.originalObject.properties.size != 0 || pItem.originalObject.selling_plan_allocation !== nil ) {

        function getOptionHtml() {
           if(pItem.originalObject.product_has_only_default_variant == false) {

             let productOptionTemplate ='';
              pItem.originalObject.options_with_values.forEach(function(element) {
                let template = `
                  <div class="product-option">
                    <dt>${element.name}: </dt>
                    <dd>${element.value}</dd>
                  </div>
                `;
                productOptionTemplate =  productOptionTemplate + template; 
              }); 

              if( Object.keys(pItem.originalObject.properties).legth > 0) {
                  pItem.originalObject.properties.forEach(function(element) {
                    let property_first_char = element.first.slide(0, 1); 
                    if(element.last !== '' && property_first_char !== "_") {
                      let template = `
                      <div class="product-option">
                      <dt>${element.first}: </dt>
                      <dd>

                            {%- if property.last contains '/uploads/' -%}
                            <a href="{{ property.last }}" target="_blank">
                              {{ property.last | split: '/' | last }}
                            </a>
                          {%- else -%}
                            {{ property.last }}
                          {%- endif -%}
                          
                          ${element.last}
                      </dd>
                    </div>
                      
                      `;
                    }
                    productOptionTemplate = productOptionTemplate + template; 
                  }); 
              }
              
              console.log(product_contents); 

              if(product_contents.discounts.length > 0 ) {

                let discounts = `
                  <ul class="discounts list-unstyled" role="list" aria-label="Discount">
                    ${(() => {
                      
                        let discounts = ''; 

                        product_contents.discounts.forEach(function(discount) {
                          discounts = discounts + `<li>${discount.title}</li>`; 
                          console.log(discounts); 
                        }); 
                        
                        return discounts;
                      })()}
                  </ul>
                `;
                productOptionTemplate = productOptionTemplate + discounts; 
              }

              return productOptionTemplate; 
              
            } else {
              return ' '
            }
        }

        return getOptionHtml(); 

      } else {
        return ""
      }
    }

    function productTemplate(pProduct, pProductIndex, pCart) {
      let productIndex =  pProduct.line; 
      let prod_contents = pProduct; 
      let that = this; 

      return  `
      <tr class="cart-item" id="CartItem-${productIndex}">
        <td class="cart-item__media">
            <img class="cart-item__image"
              src="${prod_contents.img}"
              alt="${prod_contents.name}"
              loading="lazy"
            >
        </td>

        <td class="cart-item__details">
          <a href="${prod_contents.url}" class="cart-item__name break">${prod_contents.name}</a>
            <p class="cart-item__error" id="Line-item-error-${productIndex}">
              <span class="cart-item__error-text">
              </span>
              <svg aria-hidden="true" focusable="false" role="presentation" class="icon icon-error" viewBox="0 0 13 13">
                <circle cx="6.5" cy="6.50049" r="5.5" stroke="white" stroke-width="2"/>
                <circle cx="6.5" cy="6.5" r="5.5" fill="#EB001B" stroke="#EB001B" stroke-width="0.7"/>
                <path d="M5.87413 3.52832L5.97439 7.57216H7.02713L7.12739 3.52832H5.87413ZM6.50076 9.66091C6.88091 9.66091 7.18169 9.37267 7.18169 9.00504C7.18169 8.63742 6.88091 8.34917 6.50076 8.34917C6.12061 8.34917 5.81982 8.63742 5.81982 9.00504C5.81982 9.37267 6.12061 9.66091 6.50076 9.66091Z" fill="white"/>
                <path d="M5.87413 3.17832H5.51535L5.52424 3.537L5.6245 7.58083L5.63296 7.92216H5.97439H7.02713H7.36856L7.37702 7.58083L7.47728 3.537L7.48617 3.17832H7.12739H5.87413ZM6.50076 10.0109C7.06121 10.0109 7.5317 9.57872 7.5317 9.00504C7.5317 8.43137 7.06121 7.99918 6.50076 7.99918C5.94031 7.99918 5.46982 8.43137 5.46982 9.00504C5.46982 9.57872 5.94031 10.0109 6.50076 10.0109Z" fill="white" stroke="#EB001B" stroke-width="0.7">
              </svg>
            </p>
        </td>
      
        <td class="cart-item__prices right">
          <div class="cart-item__price-wrapper">
            ${priceTemplate(prod_contents)}
          </div>
        </td>

        <td>
            ${variantTemplate(prod_contents)}
        </td>

        <td class="cart-item__quantity">
          <quantity-select data-index="${productIndex}">
                <span >
                Quantity: 
                </span>
                <select  
                  class="quantity__input"
                  name="updates[]"
                  data-quantity-update
                  value="${prod_contents.itemQty}"
                  aria-label="Quantity: ${prod_contents.title}"   
                  id="Quantity-${productIndex}" tabindex="-1"   data-index="${productIndex}">
                  {% for currency in shop.enabled_currencies %}
                    <option value="0" ${prod_contents.itemQty === 0 ? 'selected' : '' }>
                        0
                    </option>
                    <option value="1"  ${prod_contents.itemQty === 1? 'selected' : '' }>
                        1
                    </option>
                    <option value="2"  ${prod_contents.itemQty === 2 ? 'selected' : '' }>
                        2
                    </option>
                    <option value="3"  ${prod_contents.itemQty === 3 ? 'selected' : '' }>
                        3
                    </option>
                    <option value="4"  ${prod_contents.itemQty === 0 ? 'selected' : '' }>
                        4
                    </option>
                    <option value="5"  ${prod_contents.itemQty === 0 ? 'selected' : '' }>
                      5
                    </option>
                    <option value="6"  ${prod_contents.itemQty === 0 ? 'selected' : '' }>
                      6
                    </option>
                    <option value="7"  ${prod_contents.itemQty === 0 ? 'selected' : '' }>
                      7
                    </option>
                    <option value="8"  ${prod_contents.itemQty === 0 ? 'selected' : '' }>
                      8
                    </option>
                    <option value="9"  ${prod_contents.itemQty === 0 ? 'selected' : '' }>
                      9
                    </option>
                  {% endfor %}
                </select>
          </quantity-select>
      

          <cart-remove-button id="Remove-${productIndex}" data-index="${productIndex}">
            <a href="${pProduct.url}" class="button button--tertiary" aria-label="Remove ${prod_contents.title}">
              Remove
            </a>
          </cart-remove-button>
          
          <div class="loading-overlay  hidden">
            <div class="loading-overlay__spinner">
              <svg aria-hidden="true" focusable="false" role="presentation" class="spinner" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
                <circle class="path" fill="none" stroke-width="6" cx="33" cy="33" r="30"></circle>
              </svg>
            </div>
          </div>
          
      </td>
     </tr>`; 
    }

    function updatedSubtotal(pCart) {
      let subTotal = document.querySelector('[data-cart-subtotal]'); 
      subTotal.textContent = new Shopify.currency().formatMoney(pCart.total_price) + pCart.currency; 
    }

    let allProducts = []; 

    pCart.items.forEach(function(element, index) { 

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
       originalObject: cartItem, 
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
       original_price: cartItem.original_price,
       final_price: new Shopify.currency().formatMoney(cartItem.final_price,window.moneyFormat),
       variant: cartItem.variant,
       regular_price: new Shopify.currency().formatMoney(cartItem.price.regular_price,window.moneyFormat), 
       price: new Shopify.currency().formatMoney(cartItem.price,window.moneyFormat),
       subtotal: new Shopify.currency().formatMoney(cartItem.final_line_price,window.moneyFormat),
       discountedPrice: new Shopify.currency().formatMoney(
         cartItem.price - cartItem.total_discount / cartItem.quantity,
        window.moneyFormat
       ),
       discounts: cartItem.discounts,
       discountsApplied:
         cartItem.price === cartItem.price - cartItem.total_discount
           ? false
           : true,
       vendor: cartItem.vendor
     };

     allProducts.push(item); 

    }); 


    let products =  allProducts.reduce((prevValue, currentVal) => prevValue + productTemplate(currentVal), "");

    productsHTML = `
     <ul class="cart-notification-products__inner">
         ${products}
     </ul>
     `;

     document.querySelector('[data-products-container]').innerHTML = productsHTML; 
     updatedSubtotal(pCart); 
  }

   updateLiveRegions(line, itemCount) {
     console.log(line)
      if (this.currentItemCount === itemCount) {
        document.getElementById(`Line-item-error-${line}`)
          .querySelector('.cart-item__error-text')
          .innerHTML = window.cartStrings.quantityError.replace(
            '[quantity]',
            document.getElementById(`Quantity-${line}`).value
          );
        
          document.getElementById(`Line-item-error-${line}`).classList.add('is-visible');
      }

      this.currentItemCount = itemCount;
      this.lineItemStatusElement.setAttribute('aria-hidden', true);

      const cartStatus = document.getElementById('cart-live-region-text');
      cartStatus.setAttribute('aria-hidden', false);

      setTimeout(() => {
        cartStatus.setAttribute('aria-hidden', true);
      }, 1000);
   }

  getSectionInnerHTML(html, selector) {
    return new DOMParser()
      .parseFromString(html, 'text/html')
      .querySelector(selector).innerHTML;
  }

  enableLoading(line) {
    document.getElementById('main-cart-items').classList.add('cart__items--disabled');
    console.log( this.querySelectorAll('.loading-overlay')[line - 1]); 
    this.querySelectorAll('.loading-overlay')[line - 1].classList.remove('hidden');

    document.activeElement.blur();
    this.lineItemStatusElement.setAttribute('aria-hidden', false);
  }

  disableLoading() {
    document.getElementById('main-cart-items').classList.remove('cart__items--disabled');
  }
}

customElements.define('cart-items', CartItems);
