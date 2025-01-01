<script setup lang="ts">
    import { ref, onMounted } from 'vue';
    import { Icon } from '@iconify/vue';
    
    import NavBar from '@/components/NavBar.vue';
    import Spes3D from '@/components/Spes3D.vue';
    import MetaBalls from '@/components/MetaBalls.vue';

    const roleList = [
        'Designer',
        'Maker',
        'Software Developer',
        'Clothing Designer',
        'Painter',
        'Video Editor',
        'Actor/Director',
        'Toy Designer',
        'Engineer',
        'Hobbiest',
        'Graphic Designer',
        'Homelabber'
    ]

    const pauseRole = ref(false);
    const showNavBar = ref(false);

    function wiggleLogo() {
        // can't use ':hover' so doing it manually
        let logo = document.getElementById("logo");
        if (logo == null) { console.log("No logo"); return; }
        
        logo.style.transform = "rotate(15deg) translateY(-1em)";
    }
    function unWiggleLogo() {
        let logo = document.getElementById("logo");
        if (logo == null) { console.log("No logo"); return; }

        logo.style.transform = "rotate(0deg) translateY(-1em)";
    }

    onMounted(() => {
        let role = document.getElementById("role");
        const landingPage = document.getElementById('landing-page');
        const noiseContainer = document.getElementById('noise-container');

        window.onscroll = () => {
            if (landingPage && window.scrollY > landingPage.getBoundingClientRect().height/2) {
                if (noiseContainer) noiseContainer.style.opacity = "1";
                document.documentElement.style.setProperty('--fg-color', '#ffffff');
                document.documentElement.style.setProperty('--bg-color', '#020202');
                document.documentElement.style.setProperty('--accent-color', '#ff00ff');
            }
            else {
                if (noiseContainer) noiseContainer.style.opacity = "0";
                document.documentElement.style.setProperty('--fg-color', '#ffffff');
                document.documentElement.style.setProperty('--bg-color', '#842806');
                document.documentElement.style.setProperty('--accent-color', '#f5be09');
            }
        }
            
        setInterval(() => {
            if (role && !pauseRole.value) role.textContent = roleList[Math.floor(Math.random()*roleList.length)];
        }, 1000/6); // 6 per seconds
    });
    
</script>

<template>
    <div id="home-page">

        <!-- FIXED ELEMENTS -->

        <Icon
            id="navBarIcon"
            icon="streamline:interface-setting-menu-1-button-parallel-horizontal-lines-menu-navigation-three-hamburger"
            width="2em"
            class="icon"
            style="flex: 0 1 auto; display: flex; transform: rotate(45deg);"
            @click="showNavBar=true"
        />

        <Transition name="slide-in-from-left">
            <NavBar
                v-if="showNavBar"
                @close="showNavBar = false"
            />
        </Transition>

        <div id="noise-container">
            <div id="noise-texture"></div>
        </div>


        <!-- LANDING PAGE -->

        <div class="section" id="landing-page" style="height: 100vh;">
            <div style="width: calc(100% - 2em); display: flex; justify-content: end; padding: 1em;">
                <div style="display: flex; flex: 1 1 auto; justify-content: center;">
                    <object
                        id="logo"
                        type="image/svg+xml"
                        data="spes_logo.svg"
                        width="64px"
                        @mouseover="wiggleLogo"
                        @mouseout="unWiggleLogo"
                    >
                    </object>
                </div>
            </div>
            
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; margin-top: 30vh;">
                <p class="overlay">
                    Hello, my name is JC and I am a
                </p>
                <p
                    id="role"
                    class="overlay"
                    style="font-style: italic; text-align: right;"
                    @mouseover="() => {pauseRole = true}"
                    @mouseout="() => {pauseRole = false}"
                >
                    Designer
                </p>
            </div>

            <Icon
                icon="material-symbols:line-end-arrow-notch"
                class="overlay"
                style="transform: rotate(90deg); width: 1em; position: absolute; bottom: 1em; right: 20%;"
            />
        
            <Spes3D />
        </div>


        <!-- ABOUT SECTION -->

        <div class="section" id="about" style="height: 100vh;">
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding-top: 3em;">
                <p class="overlay">
                    About
                </p>
                <p class="overlay" style="padding-top: 3em; text-align: right; font-size: 2em;">
                    Some example text about me would go here, but for now I'm leaving it like this.
                    <br>
                    I'll even put this second filler paragraph for now.
                </p>
            </div>
            
            <MetaBalls v-motion-fade-visible :duration="2000"/>
        </div>
    </div>

    <!-- add a nav bar to see resume and contact -->
</template>

<style scoped>

    #home-page {
        color: var(--fg-color);
        background-color: var(--bg-color);
        overflow: hidden;
        
        position: relative;
        transition: all 3s;
    }

    .section {
        width: 100%;
        position: relative;
    }

    .overlay {
        font-family: monospace;
        font-weight: bolder;
        font-size: 3em;
        letter-spacing: -0.05em;
        word-spacing: -0.2em;
        text-align: left;
        padding: 0.25em;
        width: calc(100% - 2 * 0.25em);
        max-width: 30em;
        -webkit-text-stroke: var(--accent-color) 0.005em;
        filter: blur(0.025em);
    }
    .overlay:hover {
        filter: blur(0.015em);
    }

    #navBarIcon {
        position: fixed;
        z-index: 1;
        right: 1em;
        top: 1em;
    }

    #noise-container {
        opacity: 0;
        transition: opacity 3s;
    }

    #noise-texture:after{
        animation: grain 1s steps(2) infinite;
        background-image: url("noise_texture.jpg");
        position: fixed;
        content: "";
        width: 200%;
        height: 200%;
        top: -50%;
        left: -50%;
        opacity: 0.2;
    }

    #logo {
        transition: transform 0.15s;
        filter: blur(0.05em);
        transform: rotate(0deg) translateY(-1em);
    }

    @keyframes grain {
        0%, 100% { transform:translate(0, 0) }
        10% { transform:translate(-5%, -10%) }
        20% { transform:translate(-15%, 5%) }
        30% { transform:translate(-7%, -25%) }
        40% { transform:translate(12%, 25%) }
        50% { transform:translate(-15%, 10%) }
        60% { transform:translate(15%, 0%) }
        70% { transform:translate(0%, 15%) }
        80% { transform:translate(3%, 25%) }
        90% { transform:translate(-10%, 10%) }
    }
</style>