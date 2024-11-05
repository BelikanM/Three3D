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

        this.objects = []; // Tableau pour garder une trace des objets
        this.animationRequestId = null;

        // Écoute des événements de redimensionnement
        window.addEventListener('resize', () => this.onWindowResize(), false);
    }

    // Fonction pour créer des objets à partir d'un script JSON
    createObjectsFromJSON(jsonData) {
        // Effacer les objets existants
        this.objects.forEach(obj => this.scene.remove(obj));
        this.objects = [];

        // Parcourir les objets définis dans le JSON
        jsonData.objects.forEach(objData => {
            let geometry;
            const material = new THREE.MeshBasicMaterial({ color: objData.color || 0x0077ff });

            // Créer une sphère si spécifié
            if (objData.type === 'sphere') {
                geometry = new THREE.SphereGeometry(objData.size || 1, 32, 32);
            }

            if (geometry) {
                const mesh = new THREE.Mesh(geometry, material);
                mesh.position.set(objData.position.x || 0, objData.position.y || 0, objData.position.z || 0);
                this.scene.add(mesh);
                this.objects.push(mesh);
            }
        });

        this.camera.position.z = 5;
        this.animate(jsonData.animations);
    }

    animate(animations) {
        const animate = () => {
            this.objects.forEach((obj, index) => {
                const animation = animations[index];

                // Appliquer les rotations si définies
                if (animation && animation.rotationSpeed) {
                    obj.rotation.x += animation.rotationSpeed.x || 0;
                    obj.rotation.y += animation.rotationSpeed.y || 0;
                    obj.rotation.z += animation.rotationSpeed.z || 0;
                }
            });

            this.renderer.render(this.scene, this.camera);
            this.animationRequestId = requestAnimationFrame(animate);
        };
        animate();
    }

    stopAnimation() {
        if (this.animationRequestId) {
            cancelAnimationFrame(this.animationRequestId);
            this.animationRequestId = null;
        }
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
}

// Exportez la classe pour l'utiliser ailleurs
export default Editor;
