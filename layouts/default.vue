<script setup>
import AppHeader from '@/components/layouts/AppHeader.vue';
import AppFooter from '@/components/layouts/AppFooter.vue';
</script>

<template>
  <AppHeader />
  <slot />
  <AppFooter />
</template>