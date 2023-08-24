<script setup lang="ts">
import Icon from "../core/Icon.vue"
</script>
<template>
  <div
    class="absolute left-0 top-0 flex h-14 w-full items-center border-b border-b-neutrals-white-20 bg-white pl-24 shadow-[0_1px_2px_rgba(2,17,37,0.12)] lg:pr-[380px]"
  >
    <div class="flex w-full items-center pl-6 pr-24">
      <div class="mr-4 h-6 w-6">
        <Icon name="job" width="100%" height="100%" />
      </div>
      <div class="text-xl font-semibold leading-8 text-branding-space-blue">
        Mein Berufsmanagement
      </div>
      <div class="ml-auto hidden h-7 w-28 sm:block">
        <Icon name="jobooking-icon-5" width="100%" height="100%" />
      </div>
    </div>
  </div>
</template>
<style scoped></style>
