<script setup lang="ts">
    import Spes3D from '@/components/Spes3D.vue';
import { onUnmounted } from 'vue';
    import { onMounted } from 'vue';

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

    onMounted(() => {
        let role = document.getElementById("role");
            
        setInterval(() => {
            if (role) role.textContent = roleList[Math.floor(Math.random()*roleList.length)];
        }, 1/6 * 1000);
    });
    
</script>

<template>
    <div style="color: var(--fg-color); background-color: var(--bg-color);">

        <div style="width: 100%; display: flex; justify-content: end;">
            <object
                class="logo"
                type="image/svg+xml"
                data="spes_logo.svg"
                width="64"
            >
            </object>
        </div>
        

        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; margin-top: 30vh;">
            <h1 class="overlay">Hello, my name is JC and I am a</h1>
            <h1 id="role" class="overlay" style="font-style: italic; text-align: right;">Designer</h1>
        </div>
    
        <Spes3D />
    </div>

    <!-- add a nav bar to see resume and contact -->
</template>

<style scoped>
    .overlay {
        pointer-events: none;
        z-index: 1;
        font-family: monospace;
        font-weight: bold;
        font-size: 3em;
        text-align: left;
        padding: 0.25em;
        width: calc(100% - 2 * 0.25em);
        -webkit-text-stroke: var(--bg-color) 0.0025em;
    }

    .logo:hover {
        transform: rotate(30deg);
    }
</style>
