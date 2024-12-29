<script setup lang="ts">
    import { onMounted } from 'vue';
    import * as THREE from 'three';
    import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
    import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

    var mouseX = 0;
    var mouseY = 0;
        
    document.addEventListener('mousemove', (e: MouseEvent) => {
        mouseX = e.pageX;
        mouseY = e.pageY;
    }, false);

    const scene = new THREE.Scene();
    const bgColor = window.getComputedStyle(document.body).getPropertyValue('--bg-color');
    scene.background = new THREE.Color( bgColor );
    const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );

    const loader = new GLTFLoader();

    var spesGeo = new THREE.Group;

    loader.load( '@/../public/spes3d.glb', function ( gltf ) {
        spesGeo = gltf.scene;
	    scene.add( spesGeo );
        }, undefined, function ( error ) {
            console.error( error );
        }
    );

    const hemiLight = new THREE.HemisphereLight( 0xffffff, 0x000000);
    scene.add( hemiLight );

    onMounted(() => {
        const container = document.getElementById("logo-container");
        if (container) container.appendChild( renderer.domElement );

        const controls = new OrbitControls( camera, renderer.domElement );
        controls.enableDamping = true;

        camera.position.z = 5;
        controls.update();

        function animate() {
            spesGeo.rotation.z -= 0.01;
            controls.update();
            renderer.render( scene, camera );
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