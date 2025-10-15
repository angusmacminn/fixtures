"use client";

import { useRef, useEffect } from "react";
import vertexShader from '../shaders/vertex.glsl';
import fragmentShader from '../shaders/fragment.glsl';

export default function MatchVis({ matchStats }) {
    const mountRef = useRef(null);
    const rendererRef = useRef(null);

    useEffect(() => {
        // Only runs in browser
        if (typeof window === 'undefined') return;

        let isMounted = true;

        // Dynamic imports - client-side only
        Promise.all([
            import('three'),
            import('three/addons/controls/OrbitControls.js')
        ]).then(([THREE, { OrbitControls }]) => {
            
            // Check if component is still mounted
            if (!isMounted || !mountRef.current) return;

            const scene = new THREE.Scene();

            const camera = new THREE.PerspectiveCamera(
                75,
                window.innerWidth / window.innerHeight,
                0.1,
                10
            );
            camera.position.z = 1;

            const renderer = new THREE.WebGLRenderer({ antialias: true });
            rendererRef.current = renderer;
            renderer.setSize(800, 400);
            mountRef.current.appendChild(renderer.domElement);
            
            const controls = new OrbitControls(camera, renderer.domElement);
            controls.enableDamping = true;

            const material = new THREE.ShaderMaterial({
                vertexShader: vertexShader,
                fragmentShader: fragmentShader,
            });

            const mesh = new THREE.Mesh(new THREE.PlaneGeometry(), material);
            scene.add(mesh);

            function animate() {
                controls.update();
                renderer.render(scene, camera);
            }
            
            renderer.setAnimationLoop(animate);
        });

        // Cleanup function at the useEffect level
        return () => {
            isMounted = false;
            if (rendererRef.current) {
                rendererRef.current.setAnimationLoop(null);
                rendererRef.current.dispose();
                rendererRef.current = null;
            }
            if (mountRef.current) {
                mountRef.current.innerHTML = '';
            }
        };

    }, []);

    return <div ref={mountRef} />;
}