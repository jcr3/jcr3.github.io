<script setup lang="ts">
    import { onMounted } from 'vue';
    import * as THREE from 'three';
    import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

    // 0,0 at center of screen
    var mousePosScreen = new THREE.Vector3();
    var mousePos3D = new THREE.Vector3(-2.5, 3, 1);

    const scene = new THREE.Scene();
    const bgColor = window.getComputedStyle(document.body).getPropertyValue('--bg-color');
    scene.background = new THREE.Color( bgColor );
    const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

    const renderer = new THREE.WebGLRenderer();
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
    const light = new THREE.DirectionalLight()
    const rimLight = new THREE.DirectionalLight();
    light.position.set(-2.5, 3, 1);
    rimLight.position.set(0, 0, -1);
    scene.add( light );
    scene.add( rimLight );

    document.addEventListener('mousemove', (e: MouseEvent) => {
        // convert screen mouse position to 3d space
        mousePosScreen.set(
            ( e.clientX / window.innerWidth ) * 2 - 1,
            - ( e.clientY / window.innerHeight ) * 2 + 1,
            0.5,
        );

        mousePosScreen.unproject( camera );
        mousePosScreen.sub( camera.position ).normalize();

        var distance = ( 1 - camera.position.z ) / mousePosScreen.z;
        mousePos3D.copy( camera.position ).add( mousePosScreen.multiplyScalar(distance));
    }, false);

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
        clock.start();

        function animate() {
            const deltaTime = clock.getDelta();

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

            console.log(lightPos);
            light.position.set( lightPos.x, lightPos.y, lightPos.z );

            renderer.render( scene, camera );
            
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
    }
</style>