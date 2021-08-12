

class LoadingScreen  extends HTMLElement{

    constructor() {
        super(); 
        this.loadingScreen = document.querySelector('[data-loading-screen]'); 
        this.camera = null; 
        this.cameraControls = null; 
        this.world = null; 
        this.init({});
    }   

    loadGSAP(src, async = true, type="text/javascript") {
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

    playLoadingAnimation() {

        let that = this; 

        let loadingTween =  gsap.timeline({delay: 1, onComplete: function() {
            setTimeout(function() {
                that.playDotsAnimation();
            }, 100); 
        }});

        
        let initWorld = function() {
            setTimeout(function() {
                document.querySelector('world-scene').init();
            });
        }

        let loadingScreen = this; 
        
        loadingTween
        .call(initWorld,[], 0)
        .to(loadingScreen.querySelectorAll('[data-loading-dot]')[0].querySelector('[data-dot-progress]'), {
            opacity: 1,
            duration: .4, 
            ease: 'power2.out'
        })
        .to(loadingScreen.querySelectorAll('[data-loading-dot]')[1].querySelector('[data-dot-progress]'), {
            opacity: 1,
            duration: .4, 
            ease: 'power2.out'
        })
        .to(loadingScreen.querySelectorAll('[data-loading-dot]')[2].querySelector('[data-dot-progress]'), {
            opacity: 1,
            duration: .4, 
            ease: 'power2.out'
        })
        .to(loadingScreen.querySelectorAll('[data-loading-dot]')[3].querySelector('[data-dot-progress]'), {
            opacity: 1,
            duration: .4, 
            ease: 'power2.out'
        });



    }

    announceIntroAnimDone() {   
        document.dispatchEvent(new CustomEvent('loading-animation-done', {"detail": this.world})); 
    }

    playDotsAnimation() {

        let loadingScreen = this; 
        let that = this; 
        let dots = loadingScreen.querySelectorAll('[data-loading-dot]');
        let cameraControls = this.cameraControls;
        
        function setupDots(pDots) {
            pDots.forEach((element, index) => {

                switch (index) {
                    case 0:
                        element.dataset.destX = 3.5;
                        element.dataset.destY = 4;
                        break;
                    case 1: 
                        element.dataset.destX = 3.5;
                        element.dataset.destY = 4; 
                        break;
                    case 2: 
                        element.dataset.destX = 3.5; 
                        element.dataset.destY = 4; 
                        break;
                    case 3:
                        element.dataset.destX = 3.5; 
                        element.dataset.destY = 4; 
                        break;
                    default: 
                }
            })
        }

            
        function showPageAnimation(pDots) {
            let animation = gsap.timeline({onComplete: function() {
                that.announceIntroAnimDone();
            }}); 
            let dots = pDots; 

            animation
            .to(dots[0], {left: dots[0].dataset.destX + "%", top: dots[0].dataset.destY + "%", duration: 1,   ease: 'power2.inOut'})
            .to(dots[1], {left: dots[1].dataset.destX + "%", bottom: dots[1].dataset.destY + "%", duration: 1,   ease: 'power2.inOut'}, '-=1')
            .to(dots[2], {right: dots[2].dataset.destX + "%", top: dots[2].dataset.destY + "%", duration: 1,   ease: 'power2.inOut'}, '-=1')
            .to(dots[3], {right: dots[3].dataset.destX + "%", bottom: dots[3].dataset.destY + "%", duration: 1,   ease: 'power2.inOut'}, '-=1')
            .to(cameraControls.object.position, {z: 100, duration: 1.5,   ease: 'power2.inOut', onComplete: function() {
                cameraControls.enableDrag(); 
            }}, '-=.7')
            .to(loadingScreen, {backgroundColor: 'rgba(0,0,0,0)', duration: 1, ease: 'circ.out'}, '-=1');
        
        }

        function resetDots(pDots) {
           // let audio = that.audio; 
            let animation = gsap.timeline({onComplete: function() {
                showPageAnimation(dots); 
                //audio.init();
            }}); 

            let dots = pDots;

            animation.to(dots[0], {x:0, y: 0, duration: .7,   ease: 'power2.out'})
            .to(dots[0].querySelector('[data-dot-progress]'), {opacity: 0, duration: .2,   ease: 'power2.out'}, '-=0.3')
            animation.to(dots[1], {x: 0, y: 0, duration: .7,  ease: 'power2.out'}, '-=0.7')
            .to(dots[1].querySelector('[data-dot-progress]'), {opacity: 0, duration: .2,   ease: 'power2.out'}, '-=0.3')
            animation.to(dots[2], {x: 0, y: 0, duration: .7,  ease: 'power2.out'}, '-=0.7')
            .to(dots[2].querySelector('[data-dot-progress]'), {opacity: 0, duration: .2,   ease: 'power2.out'}, '-=0.3')
            animation.to(dots[3], {x: 0, y: 0, duration: .7,  ease: 'power2.out'}, '-=0.7')
            .to(dots[3].querySelector('[data-dot-progress]'), {opacity: 0, duration: .2,   ease: 'power2.out'}, '-=0.3')

        }   

        setupDots(dots); 
        resetDots(dots)

    }

    init(pOptions) {
       let that = this; 
                
        document.addEventListener('world-created', function(event) {
            that.cameraControls = event.detail.getControls();
            that.cameraControls.disableDrag();
            that.world = event.detail; 
        }); 

        if(pOptions.skip  === true) {
                this.announceIntroAnimDone(); 
                this.loadingScreen.style.display = 'none';
                let animation = gsap.timeline({onComplete: function() {
                    cameraControls.enableDrag(); 
                }}); 
                animation
                .to(cameraControls.object.position, {z: 100, duration: 1.5,   ease: 'power2.inOut'}, '-=.7')
                return
       }

       setTimeout(function() {
        that.loadGSAP("https://cdnjs.cloudflare.com/ajax/libs/gsap/3.6.0/gsap.min.js")
            .then((data) => {
                 that.playLoadingAnimation();
            })
            .catch((err) => {
                console.error(err);
            });
       }, 600);

    }
}


customElements.define('coming-soon-loading-screen', LoadingScreen);
