<script setup lang="ts">
    import { ref, onMounted, onUnmounted } from 'vue';
    import { Icon } from '@iconify/vue';

    import Spes3D from '@/components/Spes3D.vue';

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
        'Hobbiest'
    ]

    const pauseRole = ref(false);

    onMounted(() => {
        let role = document.getElementById("role");
            
        setInterval(() => {
            if (role && !pauseRole.value) role.textContent = roleList[Math.floor(Math.random()*roleList.length)];
        }, 1/6 * 1000);
    });
    
</script>

<template>
    <div style="color: var(--fg-color); background-color: var(--bg-color);">

        <div style="width: calc(100% - 2em); display: flex; justify-content: end; padding: 1em;">
            <div style="display: flex; flex: 1 1 auto; justify-content: center;">
                <object
                    class="logo"
                    type="image/svg+xml"
                    data="spes_logo.svg"
                    width="64"
                    style="transform: translateY(-1em);"
                >
                </object>
            </div>

            <Icon
                icon="streamline:interface-setting-menu-1-button-parallel-horizontal-lines-menu-navigation-three-hamburger"
                width="32"
                class="icon"
                style="flex: 0 1 auto; display: flex; cursor: pointer; transform: rotate(45deg);"
            />
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
        font-weight: bold;
        font-size: 3em;
        text-align: left;
        padding: 0.25em;
        width: calc(100% - 2 * 0.25em);
        -webkit-text-stroke: var(--bg-color) 0.0025em;
    }

    .logo {
        transition: 0.5s;
    }
    .logo:hover {
        transform: rotate(30deg);
    }
</style>