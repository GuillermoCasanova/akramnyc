import * as THREE from './three.module.js';
import FirstPersonControls  from './cs-first-person-controls-custom.js';

let glow = './assets/glow.png';
let starSprite = './assets/glow_small.png';
let starmap = './assets/stars.png';

export default class World {

    constructor() {
        //let perspectiveCamera, orthographicCamera, controls, scene, renderer, stats;
        this.perspectiveCamera = null; 
        this.orthographicCamera = null; 
        this.controls = null; 
        this.scene = null; 
        this.renderer = null; 
        this.stats = null; 
        this.loadingAnimDone = false; 
    }


    createWorld() {
        let WorldClass = this; 


        WorldClass.scene = new THREE.Scene();
        const aspect = window.innerWidth / window.innerHeight;
        WorldClass.perspectiveCamera = new THREE.PerspectiveCamera(60, aspect, 4, 480);
        WorldClass.perspectiveCamera.position.z = 300;
        WorldClass.scene.background = new THREE.Color(0x000000);
        WorldClass.scene.fog = new THREE.FogExp2(0xcccccc, 0.0002);


        let numberOfStars = 2000; 
        let numberOfClusters = 6; 
        let spaceBetweenStars = 200; 
        let clock = new THREE.Clock(); 


        //positions
        let clusters = numberOfClusters;
        let startPos = [];
        for (let i = 0; i < clusters; i++) {
          let pos = {};
          pos.x = (Math.random() - 0.5) * i * 50;
          pos.y = (Math.random() - 0.5) * i * 50;
          pos.z = (Math.random() - 0.5) * i * 50;
          startPos.push(pos);
        }
        let pIndex = 0;
        let stars = [];
        let twinklers = [];
        
        //meshes
        for (let i = 0; i < numberOfStars; i++) {
          // glow sprites
          let spriteMaterials = [];
          var spriteMaterial1 = new THREE.SpriteMaterial({
            map: new THREE.TextureLoader().load(glow),
            color: 0xaddaff,
            transparent: true,
            blending: THREE.AdditiveBlending,
          });
          var spriteMaterial2 = new THREE.SpriteMaterial({
            map: new THREE.TextureLoader().load(glow),
            color: 0xfffffff,
            transparent: true,
            blending: THREE.AdditiveBlending,
          });
          var spriteMaterial3 = new THREE.SpriteMaterial({
            map: new THREE.TextureLoader().load(glow),
            color: 0xfffffff,
            transparent: true,
            blending: THREE.AdditiveBlending,
          });
          spriteMaterials.push(spriteMaterial1, spriteMaterial2, spriteMaterial3);
      
          var starMaterial = new THREE.SpriteMaterial({
            map: new THREE.TextureLoader().load(starSprite),
            color: 0xfffffff,
            transparent: true,
            blending: THREE.AdditiveBlending,
          });
          
          let star = new THREE.Sprite(starMaterial);
          let sprite;
      
          if (pIndex < clusters) {
            let meshPos = randomSpherePoint(
              startPos[pIndex].x,
              startPos[pIndex].y,
              startPos[pIndex].z,
              Math.random() * 10
            );
            star.position.x = meshPos[0];
            star.position.y = meshPos[1];
            star.position.z = meshPos[2];
      
            sprite = new THREE.Sprite(
              spriteMaterials[Math.floor(Math.random() * spriteMaterials.length)]
            );
          } else {
            star.position.x = (Math.random() - 0.5) * spaceBetweenStars;
            star.position.y = (Math.random() - 0.5) * spaceBetweenStars;
            star.position.z = (Math.random() - 0.5) * spaceBetweenStars;
            sprite = new THREE.Sprite(
              spriteMaterials[Math.floor(Math.random() * spriteMaterials.length)]
            );
          }
          
          let scale = Math.random() * 0.4;
          star.scale.set(scale, scale, scale);
      
          sprite.scale.set(scale * 3, scale * 3, scale * 3);
          star.updateMatrix();
          star.matrixAutoUpdate = false;
          sprite.position.copy(star.position);
          WorldClass.scene.add(sprite);
          WorldClass.scene.add(star);
          stars.push({sprite: sprite, star: star});
          
          if (i % 50 === 0) {
           // twinklers.push(star.position);
            pIndex++;
          }


          setTwinkle(sprite, i);
        }
      
      
        WorldClass.renderer = new THREE.WebGL1Renderer({ alpha: true, antialias: true });
        WorldClass.renderer.setPixelRatio(window.devicePixelRatio);
        WorldClass.renderer.setSize(window.innerWidth, window.innerHeight);
      
        document
          .querySelector('.scene')
          .appendChild(WorldClass.renderer.domElement);
      
        window.addEventListener('resize', onWindowResize);
      
        
        function createControls(camera, domElement) {
            WorldClass.controls = new FirstPersonControls(camera, domElement);
            WorldClass.controls.lookSpeed = .065;
            WorldClass.controls.movementSpeed = 250;
            WorldClass.controls.noFly = false;
            WorldClass.controls.lookVertical = true;
            WorldClass.controls.constrainVertical = true;
            WorldClass.controls.verticalMin = 1;
            WorldClass.controls.verticalMax = 2.6;
            WorldClass.controls.lon = -.1;
            WorldClass.controls.lat = 40;
        } 

        createControls(WorldClass.perspectiveCamera, WorldClass.renderer.domElement )

        function randomSpherePoint(x0, y0, z0, radius) {
          var u = Math.random();
          var v = Math.random();
          var theta = 2 * Math.PI * u;
          var phi = Math.acos(2 * v - 1);
          var x = x0 + radius * Math.sin(phi) * Math.cos(theta);
          var y = y0 + radius * Math.sin(phi) * Math.sin(theta);
          var z = z0 + radius * Math.cos(phi);
          return [x, y, z];
        }
      
        function onWindowResize() {
          const aspect = window.innerWidth / window.innerHeight;
          WorldClass.perspectiveCamera.aspect = aspect;
          WorldClass.perspectiveCamera.updateProjectionMatrix();
          WorldClass.renderer.setSize(window.innerWidth, window.innerHeight);
        } 


        function resetStarPositions(stars, controls) {
          //positions
          if(controls) {
            let center = controls.object.position.clone();
            //meshes
            for (let i in stars) {
              let starObject = stars[i];
              var distance = controls.object.position.distanceTo(starObject.star.position);
              if (distance > 212) {
                starObject.star.position.x = center.x + (Math.random() - 0.5) * 200;
                starObject.star.position.y = center.y + (Math.random() - 0.5) * 200;
                starObject.star.position.z = center.z + (Math.random() - 0.5) * 200;
                starObject.star.updateMatrix();
                starObject.star.matrixAutoUpdate = false;
                starObject.sprite.position.copy(starObject.star.position);
              }
            }
          }

        }

        function render() {
          let delta = clock.getDelta(); 
          WorldClass.controls.update(delta); 
          WorldClass.renderer.render(WorldClass.scene, WorldClass.perspectiveCamera);
        }
      
        function animate() {
          requestAnimationFrame(animate);
          // WorldClass.perspectiveCamera.position.y -= 0.003;
            WorldClass.perspectiveCamera.position.z -= 0.008;

            if(WorldClass.loadingAnimDone) {
              resetStarPositions(stars, WorldClass.controls, WorldClass.boundingBox); 
            }
           
          render();
        }


        animate();

      
        function twinkle(twinkler, cameraPos) {
          const map = new THREE.TextureLoader().load(starmap);
          const material = new THREE.SpriteMaterial({
            map: map,
            sizeAttenuation: true,
          });
          const sprite = new THREE.Sprite(material);
      
          sprite.scale.set(5, 5, 5);
      
          sprite.position.copy(twinkler);
          var distance = cameraPos.distanceTo(sprite.position);
          if (distance > 50) {
            WorldClass.scene.add(sprite);
            setTimeout(function () {
              WorldClass.scene.remove(sprite);
            }, 1000);
          }
        }

        
        function setTwinkle(sprite, index) {
          let twinkleAnimation = gsap.timeline({ repeat: -1, yoyo: true });
          twinkleAnimation.fromTo(
            sprite.material,
            { opacity: .2 },
            { opacity: .9, duration: 1.2, ease: "ease.inOut" },
            '-=' + index * 2 * Math.random()
          );
        }
      
      
        function randomIntFromInterval(min, max) {
          // min and max included
          return Math.floor(Math.random() * (max - min + 1) + min);
        }
        
    }

    getCamera() {
        return this.perspectiveCamera;
    }

    getControls() {
      return this.controls;
    }

    init() {
       let that = this; 
        document.addEventListener('loading-animation-done', function() {
          that.loadingAnimDone = true; 
        });
        this.createWorld(); 
    }

}