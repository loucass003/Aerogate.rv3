import Slider from './Slider';

const slider = new Slider();
slider.init();

/*document.addEventListener('slider.animation.start', (event) => {
    console.log('start', event);
})

document.addEventListener('slider.animation.point', (event) => {
    console.log('point', event);
})

document.addEventListener('slider.animation.end', (event) => {
    console.log('end', event);
})*/

document.addEventListener('slider.step.enter', ({ detail: { slide, inst } }) => {
    console.log('step.enter', slide, inst);
    
})
