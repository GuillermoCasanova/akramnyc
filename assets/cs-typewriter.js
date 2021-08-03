

export function TypeWriter(pElement) {

    let textContainer = document.querySelector('[data-type-writer]').querySelector('[data-text-container]');
    let i = 0; 
    let text =  document.querySelector('[data-type-writer]').querySelector('p').dataset.text; 
    let speed = 60; 
    let writingFunction = null;

    textContainer.textContent = ""; 

    return {
        type:  function type(pStop) {

            if(pStop) {
                i = 0;
                textContainer.textContent = "";
                clearTimeout(writingFunction);
                document.querySelector('[data-type-writer]').classList.remove('is-typing');
                return 
            }
            if(i < text.length) {
                document.querySelector('[data-type-writer]').classList.add('is-typing');
                textContainer.textContent += text.charAt(i);
                i++
                writingFunction = setTimeout(type, speed)
            } else {
                document.querySelector('[data-type-writer]').classList.remove('is-typing');
            }
        }

    }

}