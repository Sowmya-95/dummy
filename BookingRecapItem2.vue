<script setup lang="ts">
import {computed} from "vue"
import Icon from "../core/Icon.vue"
import {StatisticProps, StatisticNumberPosition} from "./booking-types"

const props = withDefaults(defineProps<StatisticProps>(), {
  bgColor: "bg-branding-medium-lemon",
  statNumberPosition: StatisticNumberPosition.topLeft,
})

const statNumberPositionClass = computed(() => {
  switch (props.statNumberPosition) {
    case StatisticNumberPosition.topLeft:
      return "left-8 top-8 h-32 w-32"
    case StatisticNumberPosition.topRight:
      return "right-8 top-8 h-32 w-32"
    case StatisticNumberPosition.bottomLeft:
      return "left-8 bottom-8 h-32 w-32"
    case StatisticNumberPosition.bottomRight:
      return "right-8 bottom-8 h-32 w-32"
    case StatisticNumberPosition.topLeftOverlapping:
      return "-left-6 -top-6 h-44 w-44"
    case StatisticNumberPosition.topRightOverlapping:
      return "-right-6 -top-6 h-44 w-44"
    case StatisticNumberPosition.bottomLeftOverlapping:
      return "-left-6 -bottom-6 h-44 w-44"
    case StatisticNumberPosition.bottomRightOverlapping:
      return "-right-6 -bottom-6 h-44 w-44"
  }
})

const buttonPositionClass = computed(() => {
  switch (props.statNumberPosition) {
    case StatisticNumberPosition.topLeft:
    case StatisticNumberPosition.topLeftOverlapping:
      return "right-8 top-8"
    case StatisticNumberPosition.topRight:
    case StatisticNumberPosition.topRightOverlapping:
      return "left-8 top-8"
    case StatisticNumberPosition.bottomLeft:
    case StatisticNumberPosition.bottomLeftOverlapping:
      return "right-8 bottom-8"
    case StatisticNumberPosition.bottomRight:
    case StatisticNumberPosition.bottomRightOverlapping:
      return "left-8 bottom-8"
  }
})

const verticalTextAlign = computed(() => {
  switch (props.statNumberPosition) {
    case StatisticNumberPosition.topLeft:
    case StatisticNumberPosition.topLeftOverlapping:
    case StatisticNumberPosition.topRight:
    case StatisticNumberPosition.topRightOverlapping:
      return "justify-end"
    case StatisticNumberPosition.bottomLeft:
    case StatisticNumberPosition.bottomLeftOverlapping:
    case StatisticNumberPosition.bottomRight:
    case StatisticNumberPosition.bottomRightOverlapping:
      return "justify-start"
  }
})
</script>

<template>
  <div
    :class="`relative flex h-full flex-col overflow-hidden rounded-[20px] p-8 ${bgColor} ${verticalTextAlign}`"
  >
    <!--
    <div class="h-10 w-10">
      <Icon :name="iconName" width="100%" height="100%" />
    </div>
  -->
    <button
      v-if="buttonEmit"
      @click="$emit('clickedButton', props.buttonEmit)"
      :class="`${buttonPositionClass} absolute flex items-center gap-x-2 rounded-[22px] bg-white px-4 py-2 text-base font-semibold text-branding-space-blue transition-all ease-in-out hover:bg-branding-space-blue hover:text-white`"
    >
      <span>Ansehen</span>
      <!--
        <Icon name="chevron-down" width="12px" height="8px" />
      -->
    </button>

    <p
      :class="isSmallText ? 'text-[20px]' : 'text-[28px]/[38px]'"
      class="z-10 font-extrabold text-branding-space-blue"
      v-html="statText"
    ></p>

    <div
      :class="`absolute z-0 flex items-center justify-center overflow-hidden rounded-full bg-neutral-500/10 text-[80px] font-extrabold ${statNumberPositionClass} ${statNumberColor}`"
    >
      {{ statNumber }}
    </div>
  </div>
</template>
