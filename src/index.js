import Slider from './Slider';
import Vivus from 'vivus'

const slider = new Slider();
let currSlide = null;

const animations = [
    new Vivus('use_case', { duration: 100, file: 'img/Utilisations.svg' }),
    new Vivus('exigences', { duration: 100, file: 'img/Exigence_short.svg' }),
    new Vivus('wire', { duration: 100, file: 'img/Grid_wire.svg' })
]
slider.init();
resetAnimations()

document.addEventListener('slider.step.enter', ({ detail: { slide } }) => {
    console.log('step.enter', slide);
    currSlide = slide;
    
})

document.addEventListener('slider.substep.enter', ({ detail: { slide, substep: { elem: substep } } }) => {
    console.log('substep.enter', slide, substep);
    const name = substep.attributes.name && substep.attributes.name.value || '';
    if(slide.name === "system_grid" && name === "wire") {
        console.log("ok")
        const a = getAnimation('wire').play();
    } 
})

document.addEventListener('slider.animation.end', (event) => {
    console.log('end', event, currSlide);
    if(currSlide.name === 'use_case') {
        const a = getAnimation('use_case').play();
    } if(currSlide.name === 'exigences') {
        const a = getAnimation('exigences').play();
    } else {
        resetAnimations();
    }
})

function getAnimation(name) {
    return animations.filter(({ parentEl : { id } }) => id == name)[0];
}

function resetAnimations() {
    animations.forEach(v => v.reset());
}