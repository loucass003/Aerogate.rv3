class Step {

    constructor(name, pos) {
        this.name = name;
        this.pos = pos;
        this.step = -1;
    }

    hasSteps() {
        return this.steps && this.steps.length > 0;
    }

    hasNextStep() {
        return this.hasSteps && !!this.steps[this.step + 1]
    }

    nextStep() {
        this.step++;
    }

    currentStep() {
        return this.steps[this.step];
    }
}

export default Step;