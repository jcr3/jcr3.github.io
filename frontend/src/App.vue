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

    // parallax layers
    let farBackground = 1/8;
    let background = 1/4;
    let midground = 1/2;
    let foreground = 5/4;

    const pauseRole = ref(false);

    const showNavBar = ref(false);
    const showMetaBalls = ref(false);

    const slideDuration = ref(500);

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
        const metaballContainer = document.getElementById('metaball-container');

        const mascotContainer = document.getElementById('mascot-container');
        const arrowIcon = document.getElementById('arrow-icon');
        const aboutheader = document.getElementById('about-header');
        const aboutText = document.getElementById('about-text');

        window.onscroll = () => {
            if (landingPage && window.scrollY < landingPage.getBoundingClientRect().height/2) {
                if (noiseContainer) noiseContainer.style.opacity = "0";
                if (metaballContainer) metaballContainer.style.opacity = "0";
                showMetaBalls.value = false;
                document.documentElement.style.setProperty('--fg-color', '#ffffff');
                document.documentElement.style.setProperty('--bg-color', '#842806');
                document.documentElement.style.setProperty('--accent-color', '#f5be09');
            }
            else {
                if (noiseContainer) noiseContainer.style.opacity = "1";
                if (metaballContainer) metaballContainer.style.opacity = "1";
                showMetaBalls.value = true;
                document.documentElement.style.setProperty('--fg-color', '#ffffff');
                document.documentElement.style.setProperty('--bg-color', '#020202');
                document.documentElement.style.setProperty('--accent-color', '#ff00ff');
            }

            // Parallax effects
            farBackground = - window.scrollY * 5/4;
            background = - window.scrollY * 1/2;
            midground = - window.scrollY * 1/4;
            foreground = - window.scrollY * 1/8;

            if (metaballContainer) metaballContainer.style.transform = `translateY(${background}px)`;
            if (mascotContainer) mascotContainer.style.transform = `translateY(${background}px)`;
            if (arrowIcon) arrowIcon.style.transform = `translateY(${midground}px)`;
            if (aboutheader) aboutheader.style.transform = `translateY(${midground}px)`;
            if (aboutText) aboutText.style.transform = `translateY(${foreground}px)`;
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

        <div id="metaball-container">
            <MetaBalls v-motion-fade-visible :duration="slideDuration*2"/>
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

            <Icon v-motion-slide-visible-once-bottom
                :duration="slideDuration"
                icon="material-symbols:arrow-circle-down"
                id="arrow-icon"
                class="overlay"
                style="width: 1em; position: absolute; bottom: 1.5em; right: 20%;"
            />
            
            <div id="mascot-container">
                <Spes3D />
            </div>
        </div>


        <!-- ABOUT SECTION -->

        <div class="section" id="about" style="height: 100vh;">
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding-top: 3em;">
                <p v-motion-slide-visible-once-bottom
                    :duration="slideDuration"
                    class="overlay"
                    id="about-header"
                >
                    About
                </p>
                <p v-motion-slide-visible-once-bottom
                    :duration="slideDuration"
                    class="overlay"
                    id="about-text"
                    style="padding-top: 3em; text-align: right; font-size: 2em;"
                >
                    Some example text about me would go here, but for now I'm leaving it like this.
                    <br><br>
                    I'll even put this second filler paragraph for now.
                </p>
            </div>
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

    #mascot-container {
        position: absolute;
        top: 0;
        left: 0;

        mix-blend-mode: screen;
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

    #noise-texture:after {
        animation: grain 1s steps(2) infinite;
        background-image: url("/noise_texture.jpg");
        position: fixed;
        content: "";
        width: 200%;
        height: 200%;
        top: -50%;
        left: -50%;
        opacity: 0.2;
    }

    #metaball-container {
        position: fixed;
        width: 100%;
        height: 100%;
        top: 50%;
        opacity: 0;
        transition: opacity 1.5s;
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