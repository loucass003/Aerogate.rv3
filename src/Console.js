export default class Console {

    constructor(inst) {
        this.inst = inst;
        this.display = localStorage.getItem("console") === "true" || false;
        this.toggleDisplay(this.display);
        this.pos = document.getElementById("position");
        this.lookAt = document.getElementById("lookAt");
        this.camera = document.getElementById("camera");
    }

    toggleDisplay(force = !this.display) {
        const c = document.getElementById('console');
        c.style.display = force ? 'block' : 'none';
        localStorage.setItem("console", force);
        return this.display = force;
    }

    render(inst) {
        this.inst = inst;
        if(!this.display)
            return;
        this.pos.innerHTML = JSON.stringify(this.inst.camera.position.clone().round());
        this.lookAt.innerHTML = JSON.stringify(this.inst.controls.target.clone().round());
        this.camera.innerHTML = this.inst.controls.enabled ? 'Free' : 'Locked' ;
    }

}