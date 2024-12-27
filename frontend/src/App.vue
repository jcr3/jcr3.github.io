<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
import TheWelcome from './components/TheWelcome.vue';
</script>

<template>
    <div class="layout">
        <div class="welcome">
            <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />

            <HelloWorld msg="You did it!" />
        </div>

        <div>
            <TheWelcome />
        </div>
    </div>
</template>

<style scoped>
    .layout {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        gap: 32px;
        width: 80vw;
    }

    .welcome {
        display: flex;
        flex-direction: column;
        align-items: start;
    }

    @media only screen and (max-width: 1024px) {
        .layout {
            flex-direction: column;
        }

        .welcome {
            align-items: center;
        }
    }
</style>
