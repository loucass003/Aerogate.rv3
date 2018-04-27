class Loader {

    async init() {
        this.loaderText = document.getElementById("loading-text");
        this.loaderText.innerHTML = "Loading Init";

        this.collada = require('three-collada-loader');
        this.models = [];

        const resourcesContainer = document.getElementById('ressources');
        const resourcesElements = resourcesContainer.getElementsByTagName('ressource');

        this.ressourcesToLoad = Array.from(resourcesElements).map(({ 
            attributes: { 
                src: { value: src }, 
                loader: { value : loader }, 
                'data-name': { value: name } 
            }
        }) => ({ src, loader, name }));
        
        await Promise.all(this.ressourcesToLoad.map(({ src, loader, name }) => this.loadRessource(src, loader, name)))
        console.log("Loaded");
        document.getElementById('loader').style.display = 'none';
    }

    loadRessource(file, type, name) {
        return new Promise((resolve, reject) => {
            let loader;
            if(type == 'collada') 
                loader = new (this.collada)();
            else resolve();
            loader.load(
                file,
                (model) => this.models.push({ name, type, model }) && resolve(),
                ({ loaded, total }) => {
                    this.loaderText.innerHTML = `Loading ${this.models.length}/${this.ressourcesToLoad.length}: ${Math.round(loaded / total) * 100}%`
                },
                () => reject()
            )
        })
    }

    model(name) {
        const results = this.models.filter(({ name : n }) => n == name);
        return results && results[0];
    }
}

export default Loader;