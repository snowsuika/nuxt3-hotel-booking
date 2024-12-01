<script setup>
definePageMeta({
  layout: false
});

const router = useRouter();
const route = useRoute();

const event = useRequestEvent();
setResponseStatus(event, 404);

setTimeout(() => {
  router.push('/');
}, 2000);
</script>

<template>
  <h1>404 - {{ route.fullPath }} 找不到頁面</h1>
</template>
