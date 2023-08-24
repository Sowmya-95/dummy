<script setup lang="ts">
import {format, parseISO, add} from "date-fns"
import {computed} from "vue"
import client from "../../client"
import {ExpandedMeetup} from "../../types"
import Icon from "../core/Icon.vue"

interface Props {
  meetup: ExpandedMeetup
}

const props = defineProps<Props>()

const parsedDate = parseISO(props.meetup.date)

const businessOrApplicant = computed(() => {
  if (client.isApplicant()) {
    return props.meetup.expand.application.expand.vacancy.expand.business.name
  } else {
    return props.meetup.expand.application.expand.applicant.firstName
  }
})
</script>
<template>
  <div class="relative rounded-2xl bg-branding-dark-space-blue-2">
    <p
      class="absolute left-0 top-0 -translate-y-1/2 rounded-[14px] bg-branding-mint-green px-2 py-1 text-xs font-medium text-branding-space-blue"
    >
      {{ format(parsedDate, "HH:mm") }} -
      {{ format(add(parsedDate, {minutes: meetup.duration}), "HH:mm") }}
      Uhr
    </p>
    <div class="flex items-center justify-center gap-4 overflow-hidden p-6">
      <div class="flex-auto space-y-1 overflow-hidden">
        <p class="truncate text-xs font-semibold text-white">
          {{ meetup.type }}
        </p>
        <p class="truncate text-xs font-medium text-white">
          {{ businessOrApplicant }}
        </p>
      </div>
      <div class="flex-none">
        <p
          class="flex items-center gap-1 text-xs font-semibold text-neutrals-white-60"
        >
          <Icon name="clock" width="16px" height="16px" />
          <span>{{ meetup.duration }} Min.</span>
        </p>
      </div>
    </div>
  </div>
</template>
