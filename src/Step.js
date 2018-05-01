import { parseCameras } from './Utils.js';

class Step {

    constructor(elem, name, pos, cameras, duration) {
        this.elem = elem;
        this.name = name;
        this.pos = pos;
        this.cameras = cameras;
        this.duration = duration;
        this.step = -1;

        const steps = elem.getElementsByClassName("substep");
        this.steps = Array.from(steps).map(({
            attributes: {
                camera: { value: camera } = { camera: { value: null } },
                duration: { value: duration } = { duration: { value: null } },
                'data-name': { value: name },
                'data-pos': { value: pos },
            }
        }, i) => new Step(steps[i], name, pos, parseCameras(camera), duration));
    }

    hasSteps() {
        return this.steps && this.steps.length > 0;
    }

    hasNextStep() {
        if(this.hasSteps && !!this.steps[this.step + 1])
            return true;
        this.step = -1;
        return false;
    }

    nextStep() {
        console.log('step', this.step);
        const currStep = this.steps[this.step];
        if(currStep && currStep.hasNextStep())
            return currStep.nextStep();
        else if (++this.step == this.steps.length)
            this.step = 0;
        return this.steps[this.step];
    }

    currentStep() {
        return this.steps[this.step];
    }
}

export default Step;