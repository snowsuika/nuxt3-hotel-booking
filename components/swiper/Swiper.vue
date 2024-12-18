<script setup>
import Swiper from 'swiper';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const props = defineProps({
  loop: true,
  loop: Boolean,
  slidesPerView: Number,
  breakpoints: Object,
  pagination: Object,
  autoplay: Object,
  navigation: Object,
  modules: Array
});

const swiperRef = ref(null);

onMounted(() => {
  new Swiper(swiperRef.value, props);
});
</script>

<template>
  <div
    class="swiper"
    ref="swiperRef"
  >
    <div class="swiper-wrapper">
      <slot />
    </div>
    <div class="swiper-pagination"></div>

    <div class="swiper-button-next"></div>
    <div class="swiper-button-prev"></div>
  </div>
</template>

<style scoped></style>
