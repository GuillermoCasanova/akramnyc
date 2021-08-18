

import * as THREE from './three.module.js';


const _lookDirection = new THREE.Vector3();

const _spherical = new THREE.Spherical();

const _target = new THREE.Vector3();

export default class FirstPersonControls {

	constructor( object, domElement ) {


		if ( domElement === undefined ) {

			console.warn( 'THREE.FirstPersonControls: The second parameter "domElement" is now mandatory.' );
			domElement = document;

		}

		this.object = object;
		this.domElement = domElement; // API

		this.enabled = true;
		this.movementSpeed = 30.0;
		this.lookSpeed = 10;
		this.lookVertical = true;
		this.autoForward = false;
		this.activeLook = true;
		this.heightSpeed = false;
		this.heightCoef = 1.0;
		this.heightMin = 0.0;
		this.heightMax = 1.0;
		this.constrainVertical = false;
		this.verticalMin = 0;
		this.verticalMax = Math.PI;
		this.mouseDragOn = false; // internals
		this.autoAnimate = false; 
		this.overrideDrag = false; 
		this.noFly = false;
		this.actualMoveSpeed = 11; 

		this.autoSpeedFactor = 0.0;
		this.mouseX = 0;
		this.mouseY = 0;
		this.moveForward = false;
		this.moveBackward = false;
		this.moveLeft = false;
		this.moveRight = false;
		this.viewHalfX = 0;
		this.viewHalfY = 0; // private variables

		this.stoppedTimer = null; 

		//touch variables 
		this.deltaX = 0; 
		this.deltaY = 0; 
		this.manager = null; 


		let lat = 0;
		let lon = 0; //

		this.handleResize = function () {

			if ( this.domElement === document ) {

				this.viewHalfX = window.innerWidth / 2;
				this.viewHalfY = window.innerHeight / 2;

			} else {

				this.viewHalfX = this.domElement.offsetWidth / 2;
				this.viewHalfY = this.domElement.offsetHeight / 2;

			}

		};

		this.onMouseDown = function ( event ) {
			let that = this; 

			if ( this.domElement !== document ) {

				this.domElement.focus();

			}

			event.preventDefault();

			// if ( this.activeLook ) {

			// 	switch ( event.button ) {

			// 		case 0:
			// 			this.moveForward = true;
			// 			break;

			// 		case 2:
			// 			this.moveBackward = false;
			// 			break;

			// 	}

			// }

			//this.mouseDragOn = true;
			that.mouseDown = true;

			// clearTimeout(this.stoppedTimer);
			// 	this.stoppedTimer = setTimeout(function() {
			// 	that.moveForward = true;
			// }, 150) ; 
		};


		this.onMouseUp = function ( event ) {

			event.preventDefault();
			let that = this; 

			if ( this.activeLook ) {

				switch ( event.button ) {

					case 0:
						let that = this; 
						setTimeout(function() {
							that.moveForward = false;
						}, 210) ; 
						break;

					case 2:
						this.moveBackward = false;
						break;

				}

			}
			if ( this.domElement === document ) {
				this.mouseX = event.pageX - this.viewHalfX;
				this.mouseY = event.pageY - this.viewHalfY;
			} else {
				this.mouseX = event.pageX - this.domElement.offsetLeft - this.viewHalfX;
				this.mouseY = event.pageY - this.domElement.offsetTop - this.viewHalfY;
			}

				that.mouseDragOn = false;
				that.mouseDown = false;

				// setTimeout(function() {
				// 	that.moveForward = false;
				// }, 1000) ; 

		};
      

		this.onMouseMove = function ( event ) {

			if(this.mouseDown) {
				this.moveForward = false;
				this.mouseDragOn = true;
				if ( this.domElement === document ) {
					this.mouseX = event.pageX - this.viewHalfX;
					this.mouseY = event.pageY - this.viewHalfY;
				} else {
					this.mouseX = event.pageX - this.domElement.offsetLeft - this.viewHalfX;
					this.mouseY = event.pageY - this.domElement.offsetTop - this.viewHalfY;
				}

				clearTimeout(this.stoppedTimer); 
				let that = this; 
				this.stoppedTimer = setTimeout(function() {
					that.mouseDragOn = false;
				}, 200)
			} 

		};

		this.onMouseWheel = function( event ) {
			this.object.translateZ( (event.deltaY * 0.0010) *  ( this.actualMoveSpeed + this.autoSpeedFactor ) )
		}


		this.enableDrag =  function() {
			this.overrideDrag = false;
		};

		this.enableControls = function() {
			this.enabled = true;
		}

		this.disableControls = function() {
			this.enabled = false;
		}
	
		this.disableDrag =  function() {
			this.overrideDrag = true;
			this.mouseDragOn = false; 
		}

		this.setLookAtSpeed = function(pSpeed) {
			this.lookSpeed = pSpeed;
		}

		// this.setLookAt = function(x,y,z, pos) {
		// 	const position = this.object.position;
		// 	const targetPosition = new THREE.Vector3();
		// 	targetPosition.set(x, y, z).add(position);
		// 	this.object.lookAt( targetPosition );
		// 	console.log(this.object); 
		// }

		this.lookAt = function ( x, y, z ) {

			if ( x.isVector3 ) {

				_target.copy( x );

			} else {

				_target.set( x, y, z );

			}

			this.object.lookAt( _target );
			setOrientation( this );
			return this;

		};	

		this.update = function () {

			const targetPosition = new THREE.Vector3();
			return function update( delta ) {

				if ( this.enabled === false ) return;

				if ( this.heightSpeed ) {

					const y = THREE.MathUtils.clamp( this.object.position.y, this.heightMin, this.heightMax );
					const heightDelta = y - this.heightMin;
					this.autoSpeedFactor = delta * ( heightDelta * this.heightCoef );

				} else {

					this.autoSpeedFactor = 0.0;

				}

				const actualMoveSpeed = delta * this.movementSpeed;
				if ( this.moveForward  ) this.object.translateZ( - ( actualMoveSpeed + this.autoSpeedFactor ) );
				if ( this.moveBackward ) this.object.translateZ( actualMoveSpeed );
				if ( this.moveLeft ) this.object.translateX( - actualMoveSpeed );
				if ( this.moveRight ) this.object.translateX( actualMoveSpeed );
				if ( this.moveUp ) this.object.translateY( actualMoveSpeed );
				if ( this.moveDown ) this.object.translateY( - actualMoveSpeed );
			
				let actualLookSpeed = delta * this.lookSpeed;


				if ( ! this.activeLook ) {

					actualLookSpeed = 0;

				}

				let verticalLookRatio = 1;

				if ( this.constrainVertical ) {

					verticalLookRatio = Math.PI / ( this.verticalMax - this.verticalMin );

				}

				if(this.mouseDragOn || this.overrideDrag && !this.mouseDragOn) {

					lon -= this.mouseX * actualLookSpeed;
					if ( this.lookVertical ) lat -= this.mouseY * actualLookSpeed * verticalLookRatio;
					lat = Math.max( - 85, Math.min( 85, lat ) );
					let phi = THREE.MathUtils.degToRad( 90 - lat );
					const theta = THREE.MathUtils.degToRad( lon );

					if ( this.constrainVertical ) {
						phi = THREE.MathUtils.mapLinear( phi, 0, Math.PI, this.verticalMin, this.verticalMax );
					}

					const position = this.object.position;
					targetPosition.setFromSphericalCoords( 1, phi, theta ).add( position );
					this.object.lookAt( targetPosition );
				}

			};

		}();

		this.dispose = function () {

			this.domElement.removeEventListener( 'mousedown', _onMouseDown );
			this.domElement.removeEventListener( 'mousemove', _onMouseMove );
			this.domElement.removeEventListener( 'mousemove', _onMouseMove );
			this.domElement.removeEventListener( 'mouseup', _onMouseUp );

		};

		this.setUpTouchEvents = function(pDomElement) {

			this.manager = null; 
			const that  = this; 
			const friction = -0.03;

			import( './hammer.min.js')
			.then(module =>  {

				that.manager = new Hammer.Manager(pDomElement); 
				const Pan = new Hammer.Pan(); 

				function applyVelocity(v,dir) {
					var dist = v*16;

					if(dir=== 16) {
						dist*=-1;
					} 
					
					if(v>0) {
						v+=friction;
						that.object.translateZ( (dist * 0.0025) *  ( that.actualMoveSpeed + that.autoSpeedFactor ) )
						window.requestAnimationFrame(function(){
							applyVelocity(v,dir);
						});
					}
				}

				that.manager.add(Pan); 


				that.manager.on('panstart', function(e) {
					that.deltaY = that.deltaY + e.deltaY;
					var direction = e.offsetDirection;

					if (direction === 16 || direction === 8) {
						that.object.translateZ( (-1 * e.deltaY * 0.0025) *  ( that.actualMoveSpeed + that.autoSpeedFactor ) )
					}

				});

				that.manager.on('panend', function(event) {
					let velocity = Math.abs(event.velocityY); 
					applyVelocity(velocity, event.direction)
				})

			}); 


		}

		this.setUpEvents = function() {

			function isTouchDevice() {
				return (('ontouchstart' in window) ||
				   (navigator.maxTouchPoints > 0) ||
				   (navigator.msMaxTouchPoints > 0));
			  }

			if(!isTouchDevice()) {
				this.domElement.addEventListener( 'mousemove', _onMouseMove );
				this.domElement.addEventListener( 'mousedown', _onMouseDown );
				this.domElement.addEventListener( 'mouseup', _onMouseUp );
				this.domElement.addEventListener( 'wheel', _onMouseWheel, { passive: false } );
			} else {
				document.addEventListener('touchstart', () => {
					this.setUpTouchEvents(this.domElement); 
				}, {once: true});
			}
	
		}
		
		const _onMouseMove = this.onMouseMove.bind( this );

		const _onMouseDown = this.onMouseDown.bind( this );

		const _onMouseUp = this.onMouseUp.bind( this );

		const _onMouseWheel = this.onMouseWheel.bind(this);

		const _onResize = this.handleResize.bind(this); 

		function setOrientation( controls ) {

			const quaternion = controls.object.quaternion;

			_lookDirection.set( 0, 0, - 1 ).applyQuaternion( quaternion );

			_spherical.setFromVector3( _lookDirection );

			lat = 90 - THREE.MathUtils.radToDeg( _spherical.phi );
			lon = THREE.MathUtils.radToDeg( _spherical.theta );

		}

		window.addEventListener('resize', _onResize); 
		
		this.handleResize();
		this.setUpEvents(); 
		setOrientation( this );

	}

}