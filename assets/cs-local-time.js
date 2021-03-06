



class LocalTime extends HTMLElement {

    constructor() {
        super(); 
        this.coordinates = {}; 
    }

    startTime() {
        let that = this; 
        let currentDate = new Date().toLocaleDateString(); 
        let curentTime = new Date().toLocaleTimeString("en", {timeStyle: "medium"}); 
        let timeZone = Intl.DateTimeFormat('en', {timeZoneName: 'short'}).format(new Date()).split(" ");
    
        this.dateElement.textContent = currentDate;
        this.timeElement.textContent = curentTime;
        this.timeZoneElement.textContent = timeZone[timeZone.length - 1];  

        this.timeRunning = setInterval(function() {
            that.timeElement.textContent  = new Date().toLocaleTimeString("en", {timeStyle: "medium"}); 
        }, 1000); 
    }

    stopTime() {
      clearInterval(this.timeRunning); 
      this.timeElement.textContent = ''; 
    }

    init() {
        this.dateElement = document.querySelector('[data-current-date]'); 
        this.timeElement = document.querySelector('[data-current-time]'); 
        this.timeZoneElement = document.querySelector('[data-current-timezone]'); 
        this.coordinatesElement = document.querySelector('[data-current-coordinates]'); 
        this.startTime(); 
    }
}


customElements.define('local-time', LocalTime);
