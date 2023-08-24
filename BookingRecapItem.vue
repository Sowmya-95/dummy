<script setup lang="ts">
import Icon from "../core/Icon.vue"
interface Props {
  itemStyles?: string
  bgColor?: string
  text?: string
  textStyles?: string
  bubbleText?: string
  bubbleStyles?: string
  bubbleTextStyles?: string
  buttonStyles?: string
  buttonText?: string
}
const props = withDefaults(defineProps<Props>(), {
  itemStyles: "justify-start",
  bgColor: "bg-branding-medium-lemon",
  bubbleText: "12",
  bubbleStyles:
    "w-[128px] h-[128px] top-[146px] left-[32px] bg-branding-light-sky-15",
  bubbleTextStyles: "text-branding-medium-lavender-3",
  text: "Sie haben aktuell <span class='text-branding-light-sky'>12 laufende Bewerbungsprozesse.</span> Respekt!",
  textStyles: "text-[20px] text-branding-space-blue",
  buttonStyles: "top-8 right-5",
})
</script>
<template>
  <div
    :class="`${bgColor} ${itemStyles} relative flex flex-col overflow-hidden rounded-[20px] p-8`"
  >
    <button
      v-if="buttonText"
      :class="`${buttonStyles} absolute flex items-center gap-x-2 rounded-[22px] bg-white px-4 py-2 text-base font-semibold text-branding-space-blue`"
    >
      <span>Button</span>
      <Icon name="chevron-down" width="12px" height="8px" />
    </button>
    <div
      :class="`${bubbleStyles} absolute flex flex-col items-center justify-center rounded-full`"
    >
      <p
        :class="`${bubbleTextStyles} text-center text-[80px] font-extrabold leading-[64px]`"
      >
        {{ bubbleText }}
      </p>
    </div>
    <p :class="`${textStyles} font-extrabold`" v-html="text"></p>
  </div>
</template>
