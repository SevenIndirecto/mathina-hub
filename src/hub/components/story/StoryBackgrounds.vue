<template>
  <div class="backgrounds">
    <div class="backgrounds__images">
      <img
        v-for="bg in backgrounds"
        :key="bg.src"
        :src="bg.src"
        :style="bg.style"
        alt="bg"
      >
    </div>
  </div>
</template>

<script>
export default {
  name: 'StoryBackgrounds',
  props: {
    backgrounds: {
      type: Array,
      default: () => [],
    },
  },
};
</script>

<style scoped>
.backgrounds {
  position: absolute;
  z-index: 1;
  width: 100%;
  height: 100%;

  &__images {
    position: relative;
    width: 100%;
    height: 100%;
  }
}
</style>
