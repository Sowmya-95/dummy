<script setup lang="ts">
import BookingHeader from "../Booking/BookingHeader.vue"
import BookingSide from "./BookingSide.vue"
import BookingContent from "./BookingContent.vue"
import {useNavigationStore} from "../../store/navigation"

const navigationStore = useNavigationStore()
navigationStore.updateNavLabel("Booking")
</script>

<template>
  <div
    class="relative h-full bg-neutrals-very-light-purple sm:h-auto sm:min-h-screen sm:pl-24 sm:pt-14 lg:pr-[380px]"
  >
    <!-- TODO: standardize header -->
    <BookingHeader class="hidden sm:flex" />
    <BookingSide class="hidden lg:block" />
    <BookingContent />
  </div>
</template>
