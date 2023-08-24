<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue"
import useApplications from "../../composable/useApplications"
import BookingTabs from "./BookingTabs.vue"
import BookingRecapItem2 from "./BookingRecapItem2.vue"
import {
  ApplicationsResponse,
  ApplicationsStatusOptions,
} from "../../pocketbase-types"
import BookingApplication from "./BookingApplication.vue"
import BookingCalendar from "./BookingCalendar.vue"
import client from "../../client"

const currentTabId = ref(0)
const tabAction = (tabId: number) => {
  currentTabId.value = tabId
}

const displayName = computed(() => {
  return client.getAuthenticatedUser().firstName
})

const {
  appliedApplications,
  proposedApplications,
  scheduledApplications,
  acceptedAndDeclinedApplications,
  getMeetupForApplication,
  getSchoolVisitForApplicant,
  init,
} = useApplications()

async function accept(application: ApplicationsResponse) {
  if (application.status === ApplicationsStatusOptions.proposed) {
    if (!client.isApplicant()) {
      return
    }
    await client.updateApplication(application.id, {
      status: ApplicationsStatusOptions.scheduled,
    })

    application.status = ApplicationsStatusOptions.scheduled
  }

  if (application.status === ApplicationsStatusOptions.applied) {
    if (client.isApplicant()) {
      return
    }
    await client.updateApplication(application.id, {
      status: ApplicationsStatusOptions.accepted,
    })

    application.status = ApplicationsStatusOptions.accepted
  }
}

async function makeProposal(application: ApplicationsResponse) {
  // TODO
}

async function deny(application: ApplicationsResponse) {
  if (application.status === ApplicationsStatusOptions.proposed) {
    if (!client.isApplicant()) {
      return
    }
    await client.updateApplication(application.id, {
      status: ApplicationsStatusOptions.withdrawn,
    })

    application.status = ApplicationsStatusOptions.withdrawn
  }

  if (application.status === ApplicationsStatusOptions.applied) {
    if (client.isApplicant()) {
      return
    }
    await client.updateApplication(application.id, {
      status: ApplicationsStatusOptions.declined,
    })

    application.status = ApplicationsStatusOptions.declined
  }
}

init()

const dashboardApplications = computed(() => {
  if (client.isApplicant()) {
    return proposedApplications.value
  } else {
    return appliedApplications.value
  }
})

onMounted(() => {
  window.addEventListener("resize", switchTabIfCalendarButtonGetsHidden)
})
onUnmounted(() => {
  window.removeEventListener("resize", switchTabIfCalendarButtonGetsHidden)
})

/** Switches to the first tab when on lg-breakpoint the calender-button gets hidden and the calender is moved to the side*/
function switchTabIfCalendarButtonGetsHidden() {
  if (window.innerWidth >= 1024 && currentTabId.value === 3) {
    currentTabId.value = 0
  }
}
</script>
<template>
  <div class="p-10">
    <BookingTabs class="mb-12" :is-dark-mode="client.isApplicant()" @tab-action="tabAction"
      :currentTabId="currentTabId" />

    <!-- Dashboard-->

    <template v-if="currentTabId === 0">
      <div v-if="dashboardApplications.length > 0">
        <p class="mb-10 text-base font-extrabold text-branding-dark-space-blue">
          Hey {{ displayName }}, es gibt Neuigkeiten:
        </p>
      </div>
      <div v-else>
        <p class="mb-10 text-base font-extrabold text-branding-dark-space-blue">
          Hey {{ displayName }} du hast alles abgearbeitet. Super!
        </p>
      </div>
      <div class="grid gap-6">
        <BookingApplication v-for="application in dashboardApplications" :application="application"
          :meetup="getMeetupForApplication(application.id)" :school-visit="getSchoolVisitForApplicant(application.expand.applicant.id)
            " @accept="accept(application)" @makeProposal="makeProposal(application)" @deny="deny(application)" />
      </div>
    </template>

    <!-- Aktive Bewerbungen-->
    <template v-if="currentTabId === 1">
      <div class="grid gap-6">
        <div v-for="{ title, applications, bgColor } in [
          {
            title: 'Bewerbung verschickt',
            applications: appliedApplications,
            bgColor: 'bg-branding-dark-lemon',
          },
          {
            title: 'Termin annehmen oder ablehnen',
            applications: proposedApplications,
            bgColor: 'bg-branding-dark-matcha',
          },
          {
            title: 'Bewerbungsgespräch',
            applications: scheduledApplications,
            bgColor: 'bg-branding-dark-lavender-2',
          },
          {
            title: 'Zusage/Absage',
            applications: acceptedAndDeclinedApplications,
            bgColor: 'bg-branding-dark-lavender',
          },
        ]" class="grid gap-y-3">
          <div class="grid grid-cols-[28px_1fr] gap-x-4">
            <div :class="`${bgColor} h-7 w-7 rounded-full`"></div>
            <p class="text-base font-extrabold text-branding-dark-space-blue">
              {{ title }}
            </p>
          </div>
          <div class="grid grid-cols-[28px_1fr] gap-x-4">
            <div class="mx-auto h-[95%] w-1 rounded-sm bg-branding-space-blue-10"></div>
            <div class="ml-3 mt-6 flex flex-col gap-y-6">
              <BookingApplication v-for="application in applications" :application="application"
                :meetup="getMeetupForApplication(application.id)" :school-visit="getSchoolVisitForApplicant(application.expand.applicant.id)
                  " @accept="accept(application)" @makeProposal="makeProposal(application)"
                @deny="deny(application)" />
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- Statistik-->
    <template v-if="currentTabId === 2">
      <div
        class="grid auto-rows-[306px] grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-10 [&>*:nth-child(even)]:row-span-1 [&>*:nth-child(odd)]:row-span-2">
        <BookingRecapItem2 text="<span class='text-branding-light-sky'>Sieben laufende Bewerbungen.</span> Respekt!"
          bgColor="bg-branding-medium-lemon" />
        <BookingRecapItem2 buttonText="Button"
          text="Du hast bereits <span class='text-neutrals-green-1'>37 Bewerbungen</span> über JoBooking versendet."
          bgColor="bg-branding-medium-matcha" />
        <BookingRecapItem2 buttonText="Button"
          text="Sie haben <span class='text-neutrals-green-2'>Vier</span> erfolgreich absolvierte Praktika. Wow!"
          bgColor="bg-branding-medium-lavender-2" />
        <BookingRecapItem2
          text="Du hast <span class='text-branding-medium-lavender-1'>11 Tickets</span> für ein Praktikum erhalten."
          bgColor="bg-branding-medium-lavender" />
        <BookingRecapItem2 buttonText="Button"
          text="Du hast bereits an <span class='text-neutrals-green-1'>zwei Events</span> teilgenommen!"
          bgColor="bg-branding-medium-matcha" />
        <BookingRecapItem2 text="Neun <span class='text-neutrals-green-2'>Einladungen zum Bewerben</span> erhalten. Wow!"
          bgColor="bg-branding-medium-lavender-2" />
        <BookingRecapItem2 text="Du folgst <span class='text-branding-medium-peach-1'>vier</span> Unternehmen."
          bgColor="bg-branding-medium-peach" />
      </div>
    </template>

    <!-- Kalender (only shown on mobile)-->
    <template v-if="currentTabId === 3">
      <div class="flex justify-center">
        <BookingCalendar class="max-w-sm rounded-2xl" />
      </div>
    </template>
  </div>
</template>
