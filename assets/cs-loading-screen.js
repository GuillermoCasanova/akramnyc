

export default class LoadingScreen  {

    constructor() {
        this.loadingScreen = document.querySelector('[data-loading-screen]'); 
        this.camera = null; 
        this.cameraControls = null; 
       // this.audio = new Audio(); 

        console.log('loading screen');
        
    }   

    playLoadingAnimation() {
        let that = this; 
        var loadingTween =  gsap.timeline({delay: 1, onComplete: function() {
           that.playDotsAnimation();
        }});
        var loadingScreen = this.loadingScreen; 
        
        loadingTween
        .from(loadingScreen.querySelector('[data-loading-progress]'), {
            opacity: 0, 
            duration: .8,
            ease: 'power2.out'
        })
        .fromTo(loadingScreen.querySelectorAll('[data-loading-dot]')[0], {
            x: '-4.5rem',
            opacity: 0, 
            ease: 'power2.inOut'
        }, {
            x: '-4.5rem',
            opacity: 1, 
            duration: .9,  
            ease: 'power2.inOut'
        }, '-=0.9')
        .fromTo(loadingScreen.querySelectorAll('[data-loading-dot]')[1], {
            x: '-1.5rem',
            opacity: 0, 
            ease: 'power2.inOut'
        }, {
            x: '-1.5rem',
            opacity: 1, 
            duration: .9, 
            ease: 'power2.inOut'
        }, '-=0.9')
        .fromTo(loadingScreen.querySelectorAll('[data-loading-dot]')[2],  {
            x: '1.5rem',
            opacity: 0, 
            ease: 'power2.inOut'
        },  {
            x: '1.5rem',
            opacity: 1, 
            duration: .9, 
            ease: 'power2.inOut'
        }, '-=0.9')
        .fromTo(loadingScreen.querySelectorAll('[data-loading-dot]')[3], {
            x: '4.5rem',
            opacity: 0,
            ease: 'power2.inOut'
        }, {
            x: '4.5rem',
            opacity: 1, 
            duration: .9, 
            ease: 'power2.inOut'
        }, '-=0.9')
        .to(loadingScreen.querySelectorAll('[data-loading-dot]')[0].querySelector('[data-dot-progress]'), {
            opacity: 1,
            duration: .5, 
            ease: 'power2.out'
        }).to(loadingScreen.querySelectorAll('[data-loading-dot]')[1].querySelector('[data-dot-progress]'), {
            opacity: 1,
            duration: .5, 
            ease: 'power2.out'
        })
        .to(loadingScreen.querySelectorAll('[data-loading-dot]')[2].querySelector('[data-dot-progress]'), {
            opacity: 1,
            duration: .5, 
            ease: 'power2.out'
        })
        .to(loadingScreen.querySelectorAll('[data-loading-dot]')[3].querySelector('[data-dot-progress]'), {
            opacity: 1,
            duration: .5, 
            ease: 'power2.out'
        });

    }

    announceIntroAnimDone() {
        document.dispatchEvent(new Event('loading-animation-done')); 
    }

    playDotsAnimation() {
        let windowWidth = window.innerWidth; 
        let windowHeight = window.innerHeight;
        let loadingScreen = this.loadingScreen; 
        let that = this; 
        let dots = loadingScreen.querySelectorAll('[data-loading-dot]');
        let camera = this.camera; 
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
            console.log(dots[0].dataset.destY);


            animation
            .to(dots[0], {left: dots[0].dataset.destX + "%", top: dots[0].dataset.destY + "%", duration: 1,   ease: 'power2.inOut', strictUnits:true})
            .to(dots[1], {left: dots[1].dataset.destX + "%", bottom: dots[1].dataset.destY + "%", duration: 1,   ease: 'power2.inOut', strictUnits:true}, '-=1')
            .to(dots[2], {right: dots[2].dataset.destX + "%", top: dots[2].dataset.destY + "%", duration: 1,   ease: 'power2.inOut', strictUnits:true}, '-=1')
            .to(dots[3], {right: dots[3].dataset.destX + "%", bottom: dots[3].dataset.destY + "%", duration: 1,   ease: 'power2.inOut', strictUnits:true}, '-=1')
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

            console.log('reset dots');

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

        this.cameraControls = pOptions.world.getControls();
        let cameraControls = this.cameraControls; 
        this.cameraControls.disableDrag();

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

        this.playLoadingAnimation();

    }
}