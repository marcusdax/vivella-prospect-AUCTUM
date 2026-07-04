// src/components/ThreeSceneGraph.js
import * as THREE from 'three';

export class SceneGraphVisualizer {
    constructor(canvasContainer) {
        this.container = canvasContainer;
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        
        this.renderer.setSize(canvasContainer.clientWidth, canvasContainer.clientHeight);
        this.container.appendChild(this.renderer.domElement);
        
        // Add ambient lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);
        
        this.camera.position.set(0, 5, 10);
        this.camera.lookAt(0, 0, 0);
    }

    addBoundingBoxNode(nodeId, position, dimensions, label, color = 0x00f0ff) {
        // Renders visual bounding box representing a scene graph object (e.g. damaged chimney)
        const geometry = new THREE.BoxGeometry(dimensions.x, dimensions.y, dimensions.z);
        const material = new THREE.MeshBasicMaterial({
            color: color,
            wireframe: true,
            transparent: true,
            opacity: 0.85
        });
        const box = new THREE.Mesh(geometry, material);
        box.position.set(position.x, position.y, position.z);
        box.name = nodeId;
        
        this.scene.add(box);
        console.log(`[Three.js Visualizer] Added Scene Graph Node: ${label} (${nodeId})`);
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        this.renderer.render(this.scene, this.camera);
    }
}
