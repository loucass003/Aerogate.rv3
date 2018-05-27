import Slider from './Slider';
import Vivus from 'vivus'

const slider = new Slider();
let currSlide = null;

const animations = [
    new Vivus('use_case', { duration: 100, file: 'img/Utilisations.svg' }),
    new Vivus('exigences', { duration: 100, file: 'img/Exigence_short.svg' })
]

slider.init();
resetAnimations()

document.addEventListener('slider.step.enter', ({ detail: { slide, inst } }) => {
    console.log('step.enter', slide, inst);
    currSlide = slide;
    
})

document.addEventListener('slider.animation.end', (event) => {
    console.log('end', event, currSlide);
    if(currSlide.name === 'use_case') {
        const a = getAnimation('use_case');
        a.play();
        console.log('play')
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