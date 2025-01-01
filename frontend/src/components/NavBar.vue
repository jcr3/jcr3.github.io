<script setup lang="ts">
    import { Icon } from '@iconify/vue';

    const emit = defineEmits(['close']);

    function scrollToASection(id: string) {
        document.getElementById(id)?.scrollIntoView({behavior: 'smooth'});
    }
</script>

<template>
    <div class="container">
        <div style="display: flex; height: 100%; background-color: var(--bg-color); transition: all 3s;">
            <div class="border"></div>
            <div style="display: flex; flex: 1 1 auto; flex-direction: column; gap: 2em; padding: 1em;">
                <p class="link"
                    @click="() => scrollToASection('about')"
                >About</p>
                <p class="link">Some</p>
                <p class="link">Fake</p>
                <p class="link">Links</p>
                <p class="link">Resume</p>
            </div>
            <Icon
                icon="material-symbols:close"
                class="icon"
                width="2em"
                style="padding: 1em;"
                @click="emit('close')"
            />
        </div>
            
    </div>
</template>

<style scoped>
    .container {
        position: fixed;
        width: 15vw;
        height: 100vh;
        min-width: 12.5em;
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

</style>