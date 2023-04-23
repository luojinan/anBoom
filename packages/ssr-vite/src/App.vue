<script setup lang="ts">
import { ref } from 'vue'
const message = ref('vue3 ref value')
</script>

<template>
  <h1>SSR Vite</h1>
  <p>{{ message }}</p>
</template>
