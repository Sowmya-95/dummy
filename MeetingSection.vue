<script setup lang="ts">
import {ExpandedMeetup} from "../../types"
import MeetingItem from "./MeetingItem.vue"

interface Props {
  meetups: ExpandedMeetup[]
}

const props = defineProps<Props>()
</script>
<template>
  <div class="space-y-8">
    <p class="text-base font-bold text-white">Heute, 23. Dezember 2022</p>
    <MeetingItem v-for="meetup in meetups" :meetup="meetup" />
  </div>
</template>
