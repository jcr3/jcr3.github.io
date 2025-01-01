<script setup lang="ts">
    import { ref, onMounted, onUnmounted } from 'vue';
    import { Icon } from '@iconify/vue';

    import Spes3D from '@/components/Spes3D.vue';
    import NavBar from '@/components/NavBar.vue';

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
        if ( logo ) logo.style.transform = "rotate(15deg) translateY(-1em)";
    }
    function unWiggleLogo() {
        let logo = document.getElementById("logo");
        if ( logo ) logo.style.transform = "rotate(0deg) translateY(-1em)";
    }

    onMounted(() => {
        let role = document.getElementById("role");
            
        setInterval(() => {
            if (role && !pauseRole.value) role.textContent = roleList[Math.floor(Math.random()*roleList.length)];
        }, 1/6 * 1000);
    });
    
</script>

<template>
    <div style="color: var(--fg-color); background-color: var(--bg-color); position: relative; overflow: hidden; min-height: 100vh;">

        <div style="width: calc(100% - 2em); height: calc(100% - 2em); display: flex; justify-content: end; padding: 1em; overflow: hidden;">
            <div style="display: flex; flex: 1 1 auto; justify-content: center; padding-left: 2em;">
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

            <Icon
                icon="streamline:interface-setting-menu-1-button-parallel-horizontal-lines-menu-navigation-three-hamburger"
                width="2em"
                class="icon"
                style="flex: 0 1 auto; display: flex; cursor: pointer; transform: rotate(45deg);"
                @click="showNavBar=true"
            />

            <Transition name="slide-in-from-left">
                <NavBar
                    v-if="showNavBar"
                    @close="showNavBar = false"
                />
            </Transition>
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
    
        <Spes3D />
    </div>

    <!-- add a nav bar to see resume and contact -->
</template>

<style scoped>
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
        -webkit-text-stroke: var(--bg-color) 0.0025em;
        filter: blur(0.025em);
    }
    .overlay:hover {
        filter: blur(0.015em);
    }

    #logo {
        transition: 0.15s;
        filter: blur(0.05em);
        transform: rotate(0deg) translateY(-1em);
    }
</style>