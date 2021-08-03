
    //new LocalTime().init(); 

import {TypeWriter} from './cs-typewriter.js'

export default class Navigation  {

    constructor() {
        console.log(this); 
        this.navButtons = document.querySelectorAll('[data-nav-button]');
        this.splashLogo = document.querySelector('[data-page-splash]')
        this.camera = null; 
    }
    init(options) {
        let that  = this; 
        this.camera = options.world.getCamera(); 
        this.cameraControls = options.world.getControls();
        this.animateNavigation();
        this.TypeWriter = TypeWriter(); 
    }

    animateNavigation() {

        let that = this; 
        let navButtons = this.navButtons; 
        let splash = this.splashLogo; 
        let camera  = this.camera; 

        let navigationAnimation = gsap.timeline({onComplete: function() {
            that.setUpNavigation(camera); 
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
        }, '+=0.2').to(navButtons[1], {
            backgroundColor: '#ffffff', 
            boxShadow: '0 0 12px #fff, 0 0 2px #fff, 0 0 1.5px #fff, 0 0 20px #ffffff, 0 0 4px #f8f8f8, 0 0 4px #ffffff, 0 0 15px #ffffff',
            duration: .1
        }).to(navButtons[1], {
            backgroundColor: 'transparent', 
            boxShadow: '0 0 5px rgba(255, 255, 255, 0)'
        }, '+=0.2').to(navButtons[2], {
            backgroundColor: '#ffffff', 
            boxShadow: '0 0 12px #fff, 0 0 2px #fff, 0 0 1.5px #fff, 0 0 20px #ffffff, 0 0 4px #f8f8f8, 0 0 4px #ffffff, 0 0 15px #ffffff',
            duration: .1
        }).to(navButtons[2], {
            backgroundColor: 'transparent', 
            boxShadow: '0 0 5px rgba(255, 255, 255, 0)'
        }, '+=0.2').to(navButtons[3], {
            backgroundColor: '#ffffff', 
            boxShadow: '0 0 12px #fff, 0 0 2px #fff, 0 0 1.5px #fff, 0 0 20px #ffffff, 0 0 4px #f8f8f8, 0 0 4px #ffffff, 0 0 15px #ffffff',
            duration: .1
        }).to(navButtons[3], {
            backgroundColor: 'transparent', 
            boxShadow: '0 0 5px rgba(255, 255, 255, 0)'
        }, '+=0.2')

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

    

    initPageBehavior(pPageId) {
      console.log(pPageId); 

   
    }

   setUpNavigation(pCamera, pControls) {
    let controls = document.querySelectorAll('[data-nav-button]');
    let pages = document.querySelectorAll('[data-page]');
    let pagesContainer = document.querySelector('[data-pages]');
    let closeToggles = document.querySelectorAll('[data-close-page]');
    let heroSplash = document.querySelector('[data-page-splash]');
    let scene = document.querySelector('.scene');
    let isAnimating = false;
    let that = this; 

    let camera = pCamera; 
    let cameraControls = this.cameraControls;

    let pageLoaded = function (pPageId) {
      document.dispatchEvent(new CustomEvent('page-loaded', {'detail':  {"pageId": pPageId}}));
      if(pPageId === 'about') {
        setTimeout(function() {
          that.TypeWriter.type();
        }, 1000); 
      }
    };

    let pageClosed = function (pPageId) {
      document.dispatchEvent(new Event('page-closed'));
      cameraControls.setLookAtSpeed(0.06);
    };

    let getCameraPos = this.getCameraPosition; 
    let showingPage = false;
    let activePage = null;

    let closePage = function (pPageId) {

      pagesContainer.classList.add('is-hidden');
      pagesContainer.classList.remove('is-visible');

      let showSplashAnimation = new gsap.timeline({
        onComplete: function () {
          isAnimating = false;
          if(pPageId === 'about') {
            that.TypeWriter.type(true);
          }
          scene.classList.remove('no-pointer');
        }});

      pages.forEach((element) => {
        if (pPageId === element.dataset.pageId) {
          element.classList.remove('is-visible');
          element.classList.add('is-hidden');
          let cameraNewPlace = getCameraPos('splash');
            showSplashAnimation
            .to(cameraControls.object.position, {
              x: cameraNewPlace.pos.x,
              y: cameraNewPlace.pos.y,
              z:  cameraNewPlace.pos.z,
              duration: 1.9,  
              ease: 'power2.inOut',
              onStart: function() {
              },
            })
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
        }

        showingPage = false;
        activePage = null;
      });
    };


    let showPage = function (pPageId) {
      pagesContainer.classList.remove('is-hidden');
      pagesContainer.classList.add('is-visible');
      scene.classList.add('no-pointer');
      cameraControls.setLookAtSpeed(0.001);


      let showPageAnimation = new gsap.timeline({
        onStart: function() {
        },
        onComplete: function (pPageId) {
          isAnimating = false;
          pageLoaded(pPageId);

        },
        onCompleteParams: [pPageId]
      });
      

      if (isAnimating) {
        return;
      }

      
      if(activePage !== null && pPageId === activePage.dataset.pageId) {
        closePage(pPageId); 
        return
      }

      isAnimating = true;

      pages.forEach((element) => {
        element.classList.add('is-hidden');
        element.classList.remove('is-visible');
        
        if (pPageId === element.dataset.pageId) {
          element.classList.add('is-visible');
          element.classList.remove('is-hidden');
          let cameraNewPlace = getCameraPos(pPageId); 

          that.initPageBehavior(pPageId);

          if (!showingPage) {

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
            showPageAnimation
              .fromTo(
                activePage,
                { opacity: 1 },
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
              );
              
          }

          showingPage = true;
          activePage = element;
        }
      });

    };



    controls.forEach((element) => {
      element.addEventListener('click', function () {
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

//   setUpNavigation(perspectiveCamera);