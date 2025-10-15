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

            // Replace the PerspectiveCamera with:
            const camera = new THREE.OrthographicCamera(
                -1,  // left
                1,   // right
                1,   // top
                -1,  // bottom
                0.1, // near
                10   // far
            );
            camera.position.z = 1;

            const renderer = new THREE.WebGLRenderer({ antialias: true });
            rendererRef.current = renderer;
            renderer.setSize(800, 400);
            mountRef.current.appendChild(renderer.domElement);
            
            // const controls = new OrbitControls(camera, renderer.domElement);
            // controls.enableDamping = true;

            // uniforms
            const resolution = new THREE.Vector2(800, 400);
            const time = { value: 0 };
            const mouse = new THREE.Vector2();

            const material = new THREE.ShaderMaterial({
                vertexShader: vertexShader,
                fragmentShader: fragmentShader,
                uniforms: {
                    u_resolution: { value: resolution },
                    u_mouse: { value: new THREE.Vector2(0, 0) },
                    u_time: { value: 0 }
                }
            });

            const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
            scene.add(mesh);

            function animate() {
                // controls.update();
                renderer.render(scene, camera);
                time.value += 1.00;
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