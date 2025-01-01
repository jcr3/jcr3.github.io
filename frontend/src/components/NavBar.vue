<script setup lang="ts">
    import { Icon } from '@iconify/vue';

    const emit = defineEmits(['close']);
</script>

<template>
    <div class="container">
        <div style="display: flex; height: 100%; background-color: var(--bg-color);">
            <div class="border"></div>
            <div style="display: flex; flex: 1 1 auto; flex-direction: column; gap: 2em; padding: 1em;">
                <p class="link">Some</p>
                <p class="link">Fake</p>
                <p class="link">Links</p>
                <p class="link">Resume</p>
            </div>
            <Icon
                icon="material-symbols:close"
                class="icon"
                width="2em"
                @click="emit('close')"
            />
        </div>
            
    </div>
</template>

<style scoped>
    .container {
        position: absolute;
        width: 15vw;
        height: 100vh;
        min-width: 10em;
        right: 0;
        top: 0;
        z-index: 1;
    }

    .border {
        filter: blur(0.1em);
        width: 0.2em;
        height: 100%;

        flex: 0 1 auto;

        background-color: var(--fg-color);
    }

    .link {
        font-size: 2em;
        font-weight: bolder;
        letter-spacing: -0.05em;
        word-spacing: -0.2em;
        cursor: pointer;
        
        filter: blur(0.025em) opacity(0.9);
    }
    .link:hover {
        filter: blur(0.015em) opacity(1);
    }
</style>