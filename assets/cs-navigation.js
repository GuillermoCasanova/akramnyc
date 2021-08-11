

class ComingSoonNav extends HTMLElement {

    constructor() {
      super();
        this.camera = null; 
        let ComingSoonNavClass = this; 
        document.addEventListener('loading-animation-done', function(event) {
          ComingSoonNavClass.init({world: event.detail});
        }, {once: true})
    }
    init(options) {
        let that  = this; 
        this.camera = options.world.getCamera(); 
        this.cameraControls = options.world.getControls();
        this.navButtons = this.querySelectorAll('[data-nav-button]');
        this.splashLogo = this.querySelector('[data-page-splash]');
        this.animateNavigation();
    }

    animateNavigation() {

        let that = this; 
        let navButtons = this.navButtons; 
        let splash = this.splashLogo; 
        let camera  = this.camera; 

        let navigationAnimation = gsap.timeline({onComplete: function() {
            that.setUpNavigation(camera); 
            that.loadScript("https://static.klaviyo.com/onsite/js/klaviyo.js?company_id=RSpZfU")
            .then((data) => {
            })
            .catch((err) => {
                console.error(err);
            });
        }}); 

        navigationAnimation.fromTo('.navigation__links', {
          opacity: 0
        }, {opacity: 1, duration: .9}, '+=0.2').fromTo(splash, {
            opacity: 0
        }, {opacity: 1, duration: .9}, '-=1').to(navButtons[0], {
            backgroundColor: '#ffffff', 
            boxShadow: '0 0 12px #fff, 0 0 2px #fff, 0 0 1.5px #fff, 0 0 20px #ffffff, 0 0 4px #f8f8f8, 0 0 4px #ffffff, 0 0 15px #ffffff',
            duration: .1
        }, '-=0.2').to(navButtons[0], {
            backgroundColor: 'transparent', 
            boxShadow: '0 0 5px rgba(255, 255, 255, 0)'
        }, '+=0.1').to(navButtons[1], {
            backgroundColor: '#ffffff', 
            boxShadow: '0 0 12px #fff, 0 0 2px #fff, 0 0 1.5px #fff, 0 0 20px #ffffff, 0 0 4px #f8f8f8, 0 0 4px #ffffff, 0 0 15px #ffffff',
            duration: .1
        }).to(navButtons[1], {
            backgroundColor: 'transparent', 
            boxShadow: '0 0 5px rgba(255, 255, 255, 0)'
        }, '+=0.1').to(navButtons[2], {
            backgroundColor: '#ffffff', 
            boxShadow: '0 0 12px #fff, 0 0 2px #fff, 0 0 1.5px #fff, 0 0 20px #ffffff, 0 0 4px #f8f8f8, 0 0 4px #ffffff, 0 0 15px #ffffff',
            duration: .1
        }).to(navButtons[2], {
            backgroundColor: 'transparent', 
            boxShadow: '0 0 5px rgba(255, 255, 255, 0)'
        }, '+=0.1').to(navButtons[3], {
            backgroundColor: '#ffffff', 
            boxShadow: '0 0 12px #fff, 0 0 2px #fff, 0 0 1.5px #fff, 0 0 20px #ffffff, 0 0 4px #f8f8f8, 0 0 4px #ffffff, 0 0 15px #ffffff',
            duration: .1
        }).to(navButtons[3], {
            backgroundColor: 'transparent', 
            boxShadow: '0 0 5px rgba(255, 255, 255, 0)'
        }, '+=0.1')

    }

    getCameraPosition(pPageId) {

      let pageId = pPageId; 

      let camera = {
        pos: {
          x: 0,
          y: 0,
          z: 0
        }, 
        rotation: {
          x: 0,
          y: 0,
          z: 0
        }
      }


      switch (pageId) {
        case 'about':
        camera.pos = {
          x: -60,
          y: 50,
          z: -10
        }
        camera.rotation = {
          x: Math.PI * .15,
          y: Math.PI * .10,
          z: 0
        }
        break; 
        case 'current-time': 
        camera.pos = {
          x: -60,
          y: -50,
          z: -10
        }
        camera.rotation = {
          x: Math.PI * -.15,
          y: Math.PI * .10,
          z: 0
        }
        break; 
        case 'newsletter': 
        camera.pos = {
          x: 60,
          y: 50,
          z: -10
        }
        camera.rotation = {
          x: Math.PI * .15,
          y: Math.PI * -.10,
          z: 0
        }
        break; 
        case 'social': 
        camera.pos = {
          x: 60,
          y: -50,
          z: -10
        }
        camera.rotation = {
          x: Math.PI * -.15,
          y: Math.PI * -.10,
          z: 0
        }
        break; 
        default:
        camera.pos = {
          x: 0,
          y: 0,
          z: 110
        }
        camera.rotation = {
          x: 0,
          y: 0,
          z: 0
        }
        break; 
      }
      return camera; 
    }

   getPageById(pPageId) {
    let pages = document.querySelectorAll('[data-page]');
    let page = null; 

     pages.forEach((element) => {
      if (pPageId === element.dataset.pageId) {
        page = element
      }
    });
    
    return page;
   }

   loadScript(src, async = true, type="text/javascript") {
    return new Promise((resolve, reject) => {
        try {
            const el = document.createElement("script");
            const container = document.head || document.body;

            el.type = type;
            el.async = async;
            el.src = src;

            el.addEventListener("load", () => {
                resolve({ status: true });
            });

            el.addEventListener("error", () => {
                reject({
                    status: false,
                    message: `Failed to load the script ${src}`
                });
            });

            container.appendChild(el);
        } catch (err) {
            reject(err);
        }
    });
   }


   setUpNavigation(pCamera, pControls) {
    let controls = document.querySelectorAll('[data-nav-button]');
    let pages = document.querySelectorAll('[data-page]');
    let pagesContainer = document.querySelector('[data-pages]');
    let closeToggles = document.querySelectorAll('[data-close-page]');
    let heroSplash = document.querySelector('[data-page-splash]');
    let scene = document.querySelector('.scene');
    let isAnimating = false;
    let cameraControls = this.cameraControls;
    let getCameraPos = this.getCameraPosition; 
    let activePage = null;
    let activeAnimation = null; 
    let that = this; 

    let pageLoaded = function (pPage) {
      activePage = pPage;
      document.dispatchEvent(new CustomEvent('page-loaded', {'detail':  {"pageId": pPage.dataset.pageId}}));
      if(pPage.dataset.pageId === 'about') {
        setTimeout(function() {
          document.querySelector('type-writer').init();
          document.querySelector('type-writer').typeWrite();
        }, 500); 
      }
    };

    let pageClosed = function (pPageId) {
      document.dispatchEvent(new Event('page-closed'));
      cameraControls.setLookAtSpeed(0.06);
    };


    let closePage = function (pPageId) {
      pagesContainer.classList.add('is-hidden');
      pagesContainer.classList.remove('is-visible');
      scene.classList.add('no-pointer');

      resetActiveButton(activePage); 
      activePage = null; 

      pages.forEach((element) => {
        if (pPageId === element.dataset.pageId) {
          closePageAnimation(element); 
        }
      });
    };


    let showPage = function (pPageId) {
      pagesContainer.classList.remove('is-hidden');
      pagesContainer.classList.add('is-visible');
      scene.classList.add('no-pointer');
      cameraControls.setLookAtSpeed(0.001);

      if(pPageId === 'current-time') {
        document.querySelector('local-time').init(); 
      }


      if(activePage !== null && pPageId === activePage.dataset.pageId) {
        closePage(pPageId); 
        return
      }

      if(activeAnimation) {
        activeAnimation.pause(); 
        activeAnimation = null; 
      }

      pages.forEach((element) => {
        element.classList.add('is-hidden');
        element.classList.remove('is-visible');
        
        if (pPageId === element.dataset.pageId) {
          element.classList.add('is-visible');
          element.classList.remove('is-hidden');
          let cameraNewPlace = getCameraPos(pPageId); 
          openPageAnimation(element, cameraNewPlace); 
        }
      });

    };



    function resetActiveButton(pActivePage) {
      if(pActivePage !== null) {
        let activePageId = pActivePage.dataset.pageId; 
        controls.forEach((element) => {
          let name = element.dataset.buttonId;
          if(name === activePageId) {
            element.blur(); 
            element.classList.remove('is-active');
          }
        });
      }
    }


    function openPageAnimation(pPageElem, pCameraPosition) {

      let showPageAnimation = new gsap.timeline({paused: true,
        onStart: function() {
          activePage = pPageElem
        },
        onComplete: function (pPage) {
          activeAnimation = null; 
          pageLoaded(pPage);
        },
        onCompleteParams: [that.getPageById(pPageElem.dataset.pageId)]
      });
      
      let cameraNewPlace = pCameraPosition; 
      let element = pPageElem;

      if(activeAnimation) {
        activeAnimation.pause();
      }

      if (activePage === null) {


        showPageAnimation
         .to(
            heroSplash,
            { opacity: 0, duration: .4, ease: 'power2.out' }
          )
          .to(cameraControls.object.position, {
            x: cameraControls.object.position.x + cameraNewPlace.pos.x,
            y: cameraControls.object.position.y + cameraNewPlace.pos.y,
            z: cameraControls.object.position.z + cameraNewPlace.pos.z,
            duration: 2.2,  
            ease: 'power2.inOut',
          }, '-=0.2')
          .to(cameraControls.object.rotation, {
            y: cameraNewPlace.rotation.y,
            x: cameraNewPlace.rotation.x,
            duration: 2.2,  
            ease: 'power2.inOut',
          }, '-=2')
          .fromTo(
            element,
            { opacity: 0 },
            { opacity: 1, duration: 1.2, ease: 'power2.out' }, '-=0.2'
          );

      } else {


        resetActiveButton(activePage); 

        if(pPageElem.dataset.pageId === 'about') {
          document.querySelector('type-writer').stopWriting();
        }


        showPageAnimation
          .to(
            activePage,
            { opacity: 0, duration: 0.2, ease: 'power2.out' }
          ).to(cameraControls.object.position, {
            x: cameraControls.object.position.x + cameraNewPlace.pos.x,
            y: cameraControls.object.position.y + cameraNewPlace.pos.y,
            z: cameraControls.object.position.z + cameraNewPlace.pos.z,
            duration: 2.2,  
            ease: 'power2.inOut',
          }, '-=0.2')
          .to(cameraControls.object.rotation, {
            y: cameraNewPlace.rotation.y,
            x: cameraNewPlace.rotation.x,
            duration: 2.2,  
            ease: 'power2.inOut',
          }, '-=2')
          .fromTo(
            element,
            { opacity: 0 },
            { opacity: 1, duration: 1.2, ease: 'power2.out' }, '-=0.2'
          )
      }
      
      activeAnimation = showPageAnimation;
      activeAnimation.play(); 

    }

    function closePageAnimation(pPageElem) {

      let element = pPageElem; 
  
      let showSplashAnimation = new gsap.timeline({
        paused: true,
        onStart: function() {
          activePage = null
        },
        onComplete: function () {
          scene.classList.remove('no-pointer');
          activeAnimation = null; 
          activePage = null; 
        }});

      if(pPageElem.dataset.pageId === 'about') {
        document.querySelector('type-writer').stopWriting();
      }
      
      resetActiveButton(activePage);    
           
      element.classList.remove('is-visible');
      element.classList.add('is-hidden');
    
      if(activeAnimation) {
        activeAnimation.pause();
      }
      
      let cameraNewPlace = getCameraPos('splash');
        showSplashAnimation
        .to(
          '[data-page]',
          { opacity: 0, duration: 1.2, ease: 'power2.out' }
        )
        .to(cameraControls.object.position, {
          x: cameraNewPlace.pos.x,
          y: cameraNewPlace.pos.y,
          z:  cameraNewPlace.pos.z,
          duration: 1.9,  
          ease: 'power2.inOut',
          onStart: function() {
          },
        }, '-=1.2')
        .to(cameraControls.object.rotation, {
          y: cameraNewPlace.rotation.y,
          x: cameraNewPlace.rotation.x,
          z: cameraNewPlace.rotation.z,
          duration: 2,  
          ease: 'power2.inOut',
          onComplete: function() {
            cameraControls.lookAt(cameraNewPlace.rotation.x, cameraNewPlace.rotation.y, cameraNewPlace.rotation.z);
          }
        }, '-=1.9')
        .fromTo(
          element,
          { opacity: 1 },
          {
            opacity: 0,
            duration: 0.2,
            ease: 'power2.out',
            onComplete: pageClosed,
          }).to(
            heroSplash,
            { opacity: 1, duration: .8, ease: 'power2.out' }, '-=0.2'
        );

        activeAnimation = showSplashAnimation;
        activeAnimation.play(); 

  
      }

      
    controls.forEach((element) => {
      element.addEventListener('click', function (event) {
        let name = this.dataset.buttonId;
        this.classList.add('is-active');
        showPage(name);
      });
    });

    closeToggles.forEach((element) => {
      element.addEventListener('click', function (event) {
        let name = event.currentTarget.closest('[data-page]').dataset.pageId;
        document.querySelectorAll('[data-nav-button]').forEach((element) => {
          element.classList.remove('is-active');
        });
        closePage(name);
      });
    });
    }
}


customElements.define('coming-soon-nav', ComingSoonNav);

//   setUpNavigation(perspectiveCamera);