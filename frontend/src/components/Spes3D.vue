<script setup lang="ts">
    import { onMounted } from 'vue';
    import * as THREE from 'three';
    import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
	import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
	import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
	import { HalftonePass } from 'three/addons/postprocessing/HalftonePass.js';
    import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
    import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

    // 0,0 at center of screen
    var mousePosScreen = new THREE.Vector3();
    var mousePos3D = new THREE.Vector3(-2.5, 3, 1);

    const scene = new THREE.Scene();
    // const bgColor = window.getComputedStyle(document.body).getPropertyValue('--bg-color');
    // scene.background = new THREE.Color( bgColor );
    const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize( window.innerWidth, window.innerHeight );

    const loader = new GLTFLoader();

    var spesGeo = new THREE.Group;

    loader.load( '/spes3d.glb', function ( gltf ) {
        spesGeo = gltf.scene;
	    scene.add( spesGeo );
        }, undefined, function ( error ) {
            console.error( error );
        }
    );
    
    // add lighting
    const light = new THREE.DirectionalLight(0xffeedd, 2);
    const rimLight = new THREE.DirectionalLight(0xffddaa, 0.1);
    light.position.set(-2.5, 3, 1);
    rimLight.position.set(0, 0, -1);
    scene.add( light );
    scene.add( rimLight );

    // post-processing
    let composer = new EffectComposer( renderer );

	const renderPass = new RenderPass( scene, camera );

	const halftoneParams = {
		shape: 1,
		radius: 9,
		rotateR: Math.PI / 12,
		rotateB: Math.PI / 12 * 2,
		rotateG: Math.PI / 12 * 3,
		scatter: 0.5,
		blending: 1,
		blendingMode: 1,
		greyscale: false,
		disable: false
	};
	const halftonePass = new HalftonePass( window.innerWidth, window.innerHeight, halftoneParams );

    const unrealBloomPass = new UnrealBloomPass( new THREE.Vector2(window.innerWidth, window.innerHeight), 0.9, 1, 0.3);

    const outputPass = new OutputPass();
    
	composer.addPass( renderPass );
    composer.addPass( unrealBloomPass );
	composer.addPass( halftonePass );
    composer.addPass( outputPass );

    function screenTo3D(posScreen: THREE.Vector3, pos3D: THREE.Vector3): THREE.Vector3 {
        // convert screen position to 3D position
        posScreen.unproject( camera );
        posScreen.sub( camera.position ).normalize();

        var distance = ( 1 - camera.position.z ) / posScreen.z;
        
        pos3D.copy( camera.position ).add( posScreen.multiplyScalar(distance));
        return pos3D;
    }
    
    document.addEventListener('mousemove', (e: MouseEvent) => {
        // desktop event
        mousePosScreen.set(
            ( e.clientX / window.innerWidth ) * 2 - 1,
            - ( e.clientY / window.innerHeight ) * 2 + 1,
            0.5,
        );
        mousePos3D = screenTo3D(mousePosScreen, mousePos3D);
    }, false);
    document.addEventListener('touchmove', (e: TouchEvent) => {
        // mobile event
        mousePosScreen.set(
            ( e.touches[0].clientX / window.innerWidth ) * 2 - 1,
            - ( e.touches[0].clientY / window.innerHeight ) * 2 + 1,
            0.5,
        );
        mousePos3D = screenTo3D(mousePosScreen, mousePos3D);
    }, false);

    window.onresize = function () {
        // dynamically resize
        renderer.setSize( window.innerWidth, window.innerHeight );
        composer.setSize( window.innerWidth, window.innerHeight );
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

    };

    onMounted(() => {
        const container = document.getElementById("logo-container");
        if (container) container.appendChild( renderer.domElement );

        camera.position.z = 5;
        const dampingFactor = 0.0075;
        const rotationFactor = 0.1;

        // store last frame data so can have damping if mouse reenters page at different point
        let lastFrameData = {
            lightPos: light.position,
            meshRotation: new THREE.Vector2(0,0)
        }

        const clock = new THREE.Clock();
        let delta = 0;
        let interval = 1/12; // restrict to 12 fps
        clock.start();

        function animate() {
            const deltaTime = clock.getDelta();
            delta += deltaTime;

            const meshDerivative = new THREE.Vector2(
                (mousePos3D.x * rotationFactor - lastFrameData.meshRotation.x) / deltaTime,
                (mousePos3D.y * rotationFactor - lastFrameData.meshRotation.y) / deltaTime
            );
            const meshRotation = new THREE.Vector2(
                mousePos3D.x * rotationFactor - dampingFactor * meshDerivative.x,
                mousePos3D.y * rotationFactor - dampingFactor * meshDerivative.y
            );

            spesGeo.rotation.z -= deltaTime * 1;
            spesGeo.rotation.x = meshRotation.y;
            spesGeo.rotation.y = - meshRotation.x;

            const lightDerivative = new THREE.Vector3(
                (mousePos3D.x - lastFrameData.lightPos.x) / deltaTime,
                (mousePos3D.y - lastFrameData.lightPos.y) / deltaTime,
                (mousePos3D.z - lastFrameData.lightPos.z) / deltaTime
            );
            const lightPos = new THREE.Vector3(
                // damper
                mousePos3D.x - dampingFactor * lightDerivative.x,
                mousePos3D.y - dampingFactor * lightDerivative.y,
                mousePos3D.z - dampingFactor * lightDerivative.z,
            );

            light.position.set( lightPos.x, lightPos.y, lightPos.z );

            if ( delta > interval ) { // restrict frame rate

                renderer.render( scene, camera );
                composer.render( deltaTime );
                halftonePass.uniforms.scatter.value = Math.random() * 0.5 + 0.25;

                delta = delta % interval;
            }
            
            lastFrameData = {
                lightPos: lightPos,
                meshRotation: meshRotation
            };
        }
        
        renderer.setAnimationLoop( animate );
            
    });
</script>

<template>
    <div id="logo-container">
        <!-- three canvas rendered here -->
    </div>
</template>

<style scoped>
    #logo-container {
        position: absolute;
        left: 0;
        top: 0;
        width: 100vw;
        height: 100vh;
        mix-blend-mode: screen;
    }
</style>