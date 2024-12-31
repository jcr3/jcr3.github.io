<script setup lang="ts">
    import { onMounted } from 'vue';
    import * as THREE from 'three';
    import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
	import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
	import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
	import { HalftonePass } from 'three/addons/postprocessing/HalftonePass.js';
    import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
    import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { constrainedMemory } from 'process';
import { contain } from 'three/src/extras/TextureUtils.js';


    // VARIABLES 
    
    var canvasWidth = window.innerWidth;
    var canvasHeight = window.innerHeight;

    var mousePosScreen = new THREE.Vector3();
    var mousePos3D = new THREE.Vector3(0, -1.25, 1);

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

    const dampingFactor = 0.008;
    const rotationFactor = 0.1;

    let delta = 0;
    let interval = 1/12; // restrict to 12 fps

    let lastFrameData = {
        // store last frame data so can have damping if mouse reenters page at different point
        lightPos: mousePos3D,
        meshRotation: new THREE.Vector2(0,0)
    }

    // THREE JS SETUP

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera( 75, canvasWidth / canvasHeight, 0.1, 1000 );
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    const clock = new THREE.Clock();

    renderer.setSize( canvasWidth, canvasHeight );
    camera.position.z = 5;

    // LOAD MODEL

    const loader = new GLTFLoader();
    var spesGeo = new THREE.Group;

    loader.load( '/spes3d.glb', function ( gltf ) {
        spesGeo = gltf.scene;
        const scaleFactor = resizeMascot(window.innerWidth);
        spesGeo.scale.set(scaleFactor, scaleFactor, scaleFactor);
	    scene.add( spesGeo );
        }, undefined, function ( error ) {
            console.error( error );
        }
    );
    

    // LIGHTING

    const light = new THREE.DirectionalLight(0xffeedd, 2); // main light
    const rimLight = new THREE.DirectionalLight(0xffddaa, 0.1); // rim light
    light.position.set(0, 0, 1);
    rimLight.position.set(0, 0, -1);
    scene.add( light );
    scene.add( rimLight );


    // POST PROCESSING
    
    const composer = new EffectComposer( renderer );

	const renderPass = new RenderPass( scene, camera );

	const halftonePass = new HalftonePass( canvasWidth, canvasHeight, halftoneParams );

    const unrealBloomPass = new UnrealBloomPass( new THREE.Vector2(canvasWidth, canvasHeight), 0.9, 1, 0.3);

    const outputPass = new OutputPass();
    
	composer.addPass( renderPass );
    composer.addPass( unrealBloomPass );
	composer.addPass( halftonePass );
    composer.addPass( outputPass );


    // FUNCTIONS

    function screenTo3D(posScreen: THREE.Vector3, pos3D: THREE.Vector3): THREE.Vector3 {
        // convert screen position to 3D position
        posScreen.unproject( camera );
        posScreen.sub( camera.position ).normalize();

        var distance = ( 1 - camera.position.z ) / posScreen.z;
        
        pos3D.copy( camera.position ).add( posScreen.multiplyScalar(distance));
        return pos3D;
    }

    
    function resizeMascot(width: number) {
        if (canvasWidth < 800) return width / 400;
        else return 1;
    }

    function changeMascotPosition() {
        // randomly click a spot on the screen to show off the 3d on touch screen devices
        // i.e. when the mouse effects don't show up

        let horizontalScale = 1;
        let verticalScale = 1;

        if (canvasWidth < 800) horizontalScale = 2;
        if (canvasHeight < 800) verticalScale = 2;

        mousePosScreen.set(
            horizontalScale * ( Math.random() * 2 - 1 ),
            verticalScale * ( Math.random() * 2 - 1 ),
            0.5,
        );

        mousePos3D = screenTo3D(mousePosScreen, mousePos3D);
    }
    

    // EVENT LISTENERS

    document.addEventListener('mousemove', (e: MouseEvent) => {
        // desktop event
        mousePosScreen.set(
            ( e.clientX / canvasWidth ) * 2 - 1,
            - ( e.clientY / canvasHeight ) * 2 + 1,
            0.5,
        );
        mousePos3D = screenTo3D(mousePosScreen, mousePos3D);
    }, false);

    window.onresize = function () {
        // dynamically resize
        canvasWidth = window.innerWidth;
        canvasHeight = window.innerHeight;
        const scaleFactor = resizeMascot(window.innerWidth);
        spesGeo.scale.set(scaleFactor, scaleFactor, scaleFactor);
        renderer.setSize( canvasWidth, canvasHeight );
        composer.setSize( canvasWidth, canvasHeight );
        camera.aspect = canvasWidth / canvasHeight;
        camera.updateProjectionMatrix();

    };


    // LOGIC

    onMounted(() => {

        // can only do this once the div exists
        const container = document.getElementById("logo-container");
        if (container) container.appendChild( renderer.domElement );

        if ( !(matchMedia('(pointer:fine)').matches) ) {
            // doesn't have a mouse so animate manually
            setInterval(changeMascotPosition, 1000);
        }

        clock.start();

        function animate() {
            const deltaTime = clock.getDelta();
            delta += deltaTime;

            // need to approximate derivatives to add damping
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

            if ( delta > interval ) { // restrict frame rate to 'interval'

                renderer.render( scene, camera );
                composer.render( deltaTime );
                // add some noise
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
        mix-blend-mode: screen;
        pointer-events: none;
    }
</style>