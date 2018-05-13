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
    console.log('substep.enter', slide, inst);
    
  
    if(slide.name == 'slide1') {
        const { model: { model : object } } = inst.globalModels.filter(({ model : { name }}) => name === "theroom")[0];
        const TOP = object.scene.children[0].children[78].children[0];
        TOP.position.y = 5000;
    }
})
