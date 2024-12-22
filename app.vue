<script setup>
const isLoading = useState('loading', () => false)
</script>

<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <ClientOnly>
      <Loading
        :active="isLoading"
      ></Loading>
    </ClientOnly>
  </div>
</template>
