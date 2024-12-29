<script setup lang="ts">
    import Spes3D from '@/components/Spes3D.vue';
</script>

<template>
    <div style="min-height: 100vh;">
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh;">
            <h1 class="overlay">Hello, my name is JC and I am a</h1>
            <h1 class="overlay" style="font-style: italic;">Designer</h1>
        </div>
    
        <Spes3D />
    </div>
    
</template>

<style scoped>
    .overlay {
        pointer-events: none;
        z-index: 1;
    }
</style>
