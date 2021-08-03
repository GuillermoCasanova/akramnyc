


import LoadingScreen from './cs-loading-screen.js'
import World from './cs-world.js'; 
import Navigation from './cs-navigation.js';

let starWorld = new World();
starWorld.init(); 


document.addEventListener('loading-animation-done', function() {
    new Navigation().init({world:  starWorld}); 
  }, {once: true})


new LoadingScreen().init({skip: true, world:  starWorld}); 


