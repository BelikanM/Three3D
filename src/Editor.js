// editor.js
import * as THREE from 'three';

class Editor {
    constructor(container) {
        // Initialisation de la scène, de la caméra et du rendu
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        container.appendChild(this.renderer.domElement);

        // Écoute des événements de redimensionnement
        window.addEventListener('resize', () => this.onWindowResize(), false);
        
        // Créer un modèle de base
        this.createBasicModel();
    }

    createBasicModel() {
        // Créez un cube de base pour les démonstrations
        const geometry = new THREE.BoxGeometry();
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        this.cube = new THREE.Mesh(geometry, material);
        this.scene.add(this.cube);
        
        this.camera.position.z = 5;
    }

    loadJsonAnimation(jsonUrl) {
        // Charger le fichier JSON contenant les scripts d'animation
        fetch(jsonUrl)
            .then(response => response.json())
            .then(data => this.applyAnimation(data))
            .catch(error => console.error('Error loading JSON:', error));
    }

    applyAnimation(animationData) {
        // Appliquez les animations à l'objet ici
        // Cela dépendra de la structure de votre JSON
        // Exemple simple : rotation du cube
        const { rotationSpeed } = animationData;
        this.animate(rotationSpeed);
    }

    animate(rotationSpeed) {
        const animate = () => {
            requestAnimationFrame(animate);
            this.cube.rotation.x += rotationSpeed.x;
            this.cube.rotation.y += rotationSpeed.y;
            this.renderer.render(this.scene, this.camera);
        };
        animate();
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
}

// Exportez la classe pour l'utiliser ailleurs
export default Editor;
