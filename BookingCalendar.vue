<script setup lang="ts">
import MeetingSection from "./MeetingSection.vue"
import MeetingCalendar from "./MeetingCalendar.vue"
import Icon from "../core/Icon.vue"
import {Ref, ref, computed} from "vue"
import {format, parseISO, compareDesc} from "date-fns"
import manageTimeBg from "../../assets/images/manage-time.svg"
import {ExpandedMeetup} from "../../types"
import client from "../../client"

let meetups: Ref<ExpandedMeetup[]> = ref([])

async function init() {
  meetups.value = await client.listMeetups<ExpandedMeetup>({
    expand: "application.vacancy.business, application.applicant",
  })

  // TODO move this sorting to pocketbase or client
  meetups.value.sort((a: ExpandedMeetup, b: ExpandedMeetup) => {
    return compareDesc(parseISO(a.date), parseISO(b.date))
  })
}

function sameDay(firstDate: string, secondDate: string): boolean {
  return (
    format(parseISO(firstDate), "yy:MM:dd") ===
    format(parseISO(secondDate), "yy:MM:dd")
  )
}

const meetupsGroupedByDate = computed(() => {
  let currentDate = "1958-08-18T00:00:00+001"
  let groupedMeetups: ExpandedMeetup[] = []
  let result: ExpandedMeetup[][] = []
  for (let i = 0; i < meetups.value.length; i++) {
    let meetup = meetups.value[i]
    if (meetup.date === "") {
      continue
    }

    if (!sameDay(currentDate, meetup.date)) {
      if (groupedMeetups && groupedMeetups.length > 0) {
        result.push(groupedMeetups)
      }
      groupedMeetups = [meetup]
    } else {
      groupedMeetups.push(meetup)
    }
    if (i === meetups.value.length - 1) {
      result.push(groupedMeetups)
    }
    currentDate = meetup.date
  }

  return result
})

init()
</script>

<template>
  <div
    :style="
      client.isApplicant() ? {backgroundImage: `url(${manageTimeBg})`} : {}
    "
    class="h-full bg-branding-space-blue bg-[80%_56px] bg-no-repeat shadow-r-panel"
  >
    <div class="flex h-14 items-center justify-end pr-6">
      <div class="h-10 w-10 rounded-[10px] bg-branding-mint-green p-2">
        <Icon name="jobooking-icon-1" width="100%" height="100%" />
      </div>
    </div>
    <div class="p-6 pt-10">
      <p class="mb-4 text-base font-bold text-white">Anstehende Termine</p>
      <div class="space-y-8">
        <MeetingCalendar />
        <div class="flex flex-col gap-6">
          <MeetingSection
            v-for="meetups in meetupsGroupedByDate"
            :meetups="meetups"
          />
        </div>
      </div>
    </div>
  </div>
</template>
