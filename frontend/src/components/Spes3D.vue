<script setup lang="ts">
    import { onMounted } from 'vue';
    
    import { makeNoise2D } from 'fast-simplex-noise';

    import * as THREE from 'three';
    import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
	import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
	import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
	import { HalftonePass } from 'three/addons/postprocessing/HalftonePass.js';
    import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
    import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';


    // VARIABLES 
    
    var canvasWidth = window.innerWidth;
    var canvasHeight = window.innerHeight;

    var mousePosScreen = new THREE.Vector3();
    var mousePos3D = new THREE.Vector3(0, -1.25, 1);

    const halftoneParams = {
		shape: 1,
		radius: 9 * Math.min(canvasWidth, canvasHeight) / 1200,
		rotateR: Math.PI / 12,
		rotateB: Math.PI / 12 * 2,
		rotateG: Math.PI / 12 * 3,
		scatter: 0.5,
		blending: 1,
		blendingMode: 1,
		greyscale: false,
		disable: false
	};

    let dampingFactor = 0.008;
    const rotationFactor = 0.1;
    const autoMoveSpeed = 2;
    
    const maxMascotRotation = 0.5;

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
        resizeMascot(window.innerWidth);
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
        if (canvasWidth < 500) spesGeo.scale.set(width / 500, width / 500, width / 500);
        else spesGeo.scale.set(1, 1, 1);
    }

    function autoMoveMascot(t: number, positionNoise: (x: number, y: number) => number) {
        // use simplex noise to move mascot and show off 3d on touch devices

        let horizontalScale = 1;
        let verticalScale = 1;

        if (canvasWidth < 800) horizontalScale = 2;
        if (canvasHeight < 800) verticalScale = 2;

        mousePosScreen.set(
            horizontalScale * positionNoise(t * autoMoveSpeed, 0),
            verticalScale * positionNoise(0, t * autoMoveSpeed),
            0.5,
        );

        mousePos3D = screenTo3D(mousePosScreen, mousePos3D);
    }
    

    // INPUT

    if ( matchMedia('(pointer:fine)').matches ) {
        // has a mouse
        document.addEventListener('mousemove', (e: MouseEvent) => {
            mousePosScreen.set(
                ( e.clientX / canvasWidth ) * 2 - 1,
                - ( e.clientY / canvasHeight ) * 2 + 1,
                0.5,
            );
            mousePos3D = screenTo3D(mousePosScreen, mousePos3D);
        }, false);
    }
    else {
        // touch screen
        dampingFactor = 0;
        let t = 0;
        const positionNoise = makeNoise2D();
        setInterval(() => {
            autoMoveMascot(t, positionNoise);
            t += 12/1000;
        }, 1000/12);
    }


    // LOGIC

    onMounted(() => {

        // can only do this once the div exists
        const container = document.getElementById("mascot-container");
        if (container == null) { console.log("No mascot-container"); return; }

        container.appendChild( renderer.domElement );

        THREE.DefaultLoadingManager.onLoad = function ( ) {
            // fade in the canvas once loaded
            container.style.filter = "opacity(100)";
        };
        
        window.addEventListener('resize', () => {
            // dynamically resize
            
            canvasWidth = container.getBoundingClientRect().width;
            canvasHeight = container.getBoundingClientRect().height;

            resizeMascot(window.innerWidth);

            halftonePass.uniforms.radius.value = 9 * Math.min(canvasWidth, canvasHeight) / 1200;
            unrealBloomPass.resolution.set(canvasWidth, canvasHeight);

            renderer.setSize( canvasWidth, canvasHeight );
            composer.setSize( canvasWidth, canvasHeight );
            camera.aspect = canvasWidth / canvasHeight;
            camera.updateProjectionMatrix();
        });

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

            // cap rotation to prevent glitches
            if (meshRotation.x > maxMascotRotation) meshRotation.x = maxMascotRotation;
            if (meshRotation.x < -maxMascotRotation) meshRotation.x = -maxMascotRotation;
            if (meshRotation.y > maxMascotRotation) meshRotation.y = maxMascotRotation;
            if (meshRotation.y < -maxMascotRotation) meshRotation.y = -maxMascotRotation;

            // not exactly sure why but flipping like this makes it rotate towards the mouse
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
    <div id="mascot-container">
        <!-- three canvas rendered here -->
    </div>
</template>

<style scoped>
    #mascot-container {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;

        mix-blend-mode: screen;

        pointer-events: none;

        transition: color background-color var(--transition-time);
        filter: opacity(0); /* bring to 100 once loaded */
    }
</style>