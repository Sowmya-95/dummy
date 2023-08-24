<script setup lang="ts">
import {ref} from "vue"
import BookingRecapItem2 from "./BookingRecapItem2.vue"
import {
  ApplicationsStatusOptions,
  VacanciesTypeOptions,
} from "../../pocketbase-types"
import {ExpandedApplication, ExpandedEmployee} from "../../types"
import {convertNumberToGermanWord} from "../../composable/misc"
import client from "../../client"
import {StatisticProps, StatisticNumberPosition} from "./booking-types"

interface Props {
  appliedApplications: ExpandedApplication[]
  proposedApplications: ExpandedApplication[]
  scheduledApplications: ExpandedApplication[]
  acceptedAndDeclinedApplications: ExpandedApplication[]
}
const props = withDefaults(defineProps<Props>(), {
})

const init = ref(false)
const userID = client.getAuthenticatedUser().id
const isApplicant = client.isApplicant()
// for debugging
const showAllCards = true

let statistics: StatisticProps[] = []

/** All applications for an apprenticeship (Ausbildung) and dual-study (Duales Studium) (b2,a2)*/
let countAllApprenticeships = 0
/** All applications for an apprenticeship (Ausbildung) and dual-study (Duales Studium) except accepted or declined applications. (b1,a1) */
let countRunningApprenticeships = 0
/** All applications for an apprenticeship (Ausbildung) and dual-study (Duales Studium) that are accepted. (b4) */
let countAcceptedApprenticeships = 0
/** TODO: NOT POSSIBLE YET, WAIT TILL BOOKING PROCESS UPDATE | All invitations for an an apprenticeship (Ausbildung) and dual-study (Duales Studium) (b9,a6) */
let countInvitedApprenticeships = 0
/** TODO: NOT POSSIBLE YET, WAIT TILL BOOKING PROCESS UPDATE | All invitations for an internship (Praktikum) (b5,a4) */
let countInvitedInternships: number = 0
/** All applications for an internship (Praktikum) that are accepted (b3,a3) */
let countAcceptedInternships: number = 0
/** From business view: All applicants that favorised your business | From applicant view: All businesses you favorised (b6,a7) */
let countFavoriteApplicantBusiness: number = 0
/** TODO: NOT POSSIBLE YET, EVENTS CAN'T BE FAVORISED AT THE MOMENT | From business view: All applicants that favorised your events | From applicant view: All events you favorised (b7,a5) */
let countFavoriteApplicantEvent: number = 0
/** From business view: All applicants you favorised (b8) */
let countFavoriteBusinessApplicant: number = 0

initData()

async function initData() {
  calcStatisticsForBoth()

  if (!isApplicant) {
    await calcStatisticsForBusinesses()
    fillCardsForBusinesses()
  }

  if (isApplicant) {
    await calcStatisticsForApplicants()
    fillCardsForApplicants()
  }

  init.value = true
}

function calcStatisticsForBoth() {
  countAllApprenticeships = [
    ...props.appliedApplications,
    ...props.proposedApplications,
    ...props.scheduledApplications,
    ...props.acceptedAndDeclinedApplications,
  ].filter((application: ExpandedApplication) => {
    return (
      application.expand.vacancy.type === VacanciesTypeOptions.Ausbildung ||
      application.expand.vacancy.type === VacanciesTypeOptions["Duales Studium"]
    )
  }).length

  countRunningApprenticeships = [
    ...props.appliedApplications,
    ...props.proposedApplications,
    ...props.scheduledApplications,
  ].filter((application: ExpandedApplication) => {
    return (
      application.expand.vacancy.type === VacanciesTypeOptions.Ausbildung ||
      application.expand.vacancy.type === VacanciesTypeOptions["Duales Studium"]
    )
  }).length

  countAcceptedApprenticeships = props.acceptedAndDeclinedApplications.filter(
    (application: ExpandedApplication) => {
      return (
        application.status === ApplicationsStatusOptions.accepted &&
        (application.expand.vacancy.type === VacanciesTypeOptions.Ausbildung ||
          application.expand.vacancy.type ===
            VacanciesTypeOptions["Duales Studium"])
      )
    }
  ).length

  //countInvitedApprenticeships = 0

  //countInvitedInternships = 0

  countAcceptedInternships = props.acceptedAndDeclinedApplications.filter(
    (application: ExpandedApplication) => {
      return (
        application.status === ApplicationsStatusOptions.accepted &&
        application.expand.vacancy.type === VacanciesTypeOptions.Praktikum
      )
    }
  ).length
}

async function calcStatisticsForBusinesses() {
  const employee = await client.viewEmployee<ExpandedEmployee>(userID, {
    expand: "business",
  })
  const businessId = employee.expand.business.id

  const favoriteApplicantBusiness = await client.listFavoriteApplicantBusiness({
    filter: `business="${businessId}"`,
  })
  countFavoriteApplicantBusiness = favoriteApplicantBusiness.length

  const favoriteBusinessApplicant = await client.listFavoriteBusinessApplicant({
    filter: `business="${businessId}"`,
  })
  countFavoriteBusinessApplicant = favoriteBusinessApplicant.length
}

function fillCardsForBusinesses() {
  if (countRunningApprenticeships || showAllCards) {
    statistics.push({
      statText:
        countRunningApprenticeships === 1
          ? "Sie haben aktuell <span class='text-branding-light-sky'>einen laufenden Bewerbungsprozess</span>."
          : "Sie haben aktuell <span class='text-branding-light-sky'>" +
            convertNumberToGermanWord(countRunningApprenticeships, false) +
            "  laufende Bewerbungsprozesse</span>. Respekt!",
      isSmallText: true,
      statNumber: countRunningApprenticeships,
      statNumberPosition: StatisticNumberPosition.bottomLeft,
      statNumberColor: "text-branding-light-sky",
      bgColor: "bg-branding-medium-lemon",
    })
  }
  if (countAllApprenticeships || showAllCards) {
    statistics.push({
      statText:
        countAllApprenticeships === 1
          ? "Sie haben bereits <span class='text-neutrals-green-1'>eine Bewerbung</span> über JoBooking erhalten."
          : "Sie haben bereits <span class='text-neutrals-green-1'> " +
            convertNumberToGermanWord(countAllApprenticeships, false) +
            "  Bewerbungen</span> über JoBooking erhalten.",
      isSmallText: true,
      statNumber: countAllApprenticeships,
      statNumberPosition: StatisticNumberPosition.topLeft,
      statNumberColor: "text-neutrals-green-1",
      bgColor: "bg-branding-medium-matcha",
    })
  }

  if (countAcceptedInternships || showAllCards) {
    statistics.push({
      statText:
        countAcceptedInternships === 1
          ? "Sie haben <span class='text-neutrals-green-2'>einen</span>Praktikumsplatz über JoBooking besetzt."
          : "Sie haben <span class='text-neutrals-green-2'> " +
            convertNumberToGermanWord(countAcceptedInternships, false) +
            "</span> Praktikumsplätze über JoBooking besetzt.",
      statNumber: countAcceptedInternships,
      statNumberPosition: StatisticNumberPosition.bottomRightOverlapping,
      statNumberColor: "text-neutrals-green-2",
      bgColor: "bg-branding-medium-lavender-2",
    })
  }

  if (countAcceptedApprenticeships || showAllCards) {
    statistics.push({
      statText:
        countAcceptedApprenticeships === 1
          ? "Sie haben <span class='text-neutrals-green-2'>einen</span> Ausbildungsplatz über JoBooking besetzt."
          : "Sie haben <span class='text-neutrals-green-2'> " +
            convertNumberToGermanWord(countAcceptedApprenticeships, false) +
            "</span> Ausbildungsplätze über JoBooking besetzt.",
      statNumber: countAcceptedApprenticeships,
      statNumberPosition: StatisticNumberPosition.topLeftOverlapping,
      statNumberColor: "text-neutrals-green-2",
      bgColor: "bg-branding-medium-lavender-2",
    })
  }

  if (countInvitedInternships || showAllCards) {
    statistics.push({
      statText:
        countInvitedInternships === 1
          ? "Sie haben <span class='text-branding-medium-lavender-1'>ein Ticket</span> für ein Praktikum vergeben!"
          : "Sie haben <span class='text-branding-medium-lavender-1'> " +
            convertNumberToGermanWord(countInvitedInternships, false) +
            "  Tickets</span> für ein Praktikum vergeben!",
      isSmallText: true,
      statNumber: countInvitedInternships,
      statNumberPosition: StatisticNumberPosition.topLeft,
      statNumberColor: "text-branding-medium-lavender-1",
      bgColor: "bg-branding-medium-lavender",
    })
  }

  if (countFavoriteApplicantBusiness || showAllCards) {
    statistics.push({
      statText:
        countFavoriteApplicantBusiness === 1
          ? "<span class='text-branding-medium-peach-1'>Ein Schüler:in</span> hat sich ihr Unternehmen gemerkt."
          : "Bereits <span class='text-branding-medium-peach-1'> " +
            convertNumberToGermanWord(countFavoriteApplicantBusiness, false) +
            "  Schüler:innen</span> haben sich ihr Unternehmen gemerkt.",
      isSmallText: true,
      statNumber: countFavoriteApplicantBusiness,
      statNumberPosition: StatisticNumberPosition.bottomLeftOverlapping,
      statNumberColor: "text-branding-medium-peach-1",
      bgColor: "bg-branding-medium-peach",
      buttonEmit: "favoriteApplicantBusiness",
    })
  }

  if (countFavoriteApplicantEvent || showAllCards) {
    statistics.push({
      statText:
        countFavoriteApplicantEvent === 1
          ? "<span class='text-neutrals-green-1'> Ein Schüler:in</span> interessiert sich für ihre Events."
          : "<span class='text-neutrals-green-1'> " +
            convertNumberToGermanWord(countFavoriteApplicantEvent, true) +
            "  Schüler:innen</span> interessieren sich für ihre Events. Wow!",
      isSmallText: true,
      statNumber: countFavoriteApplicantEvent,
      statNumberPosition: StatisticNumberPosition.topRightOverlapping,
      statNumberColor: "text-neutrals-green-1",
      bgColor: "bg-branding-medium-matcha",
      buttonEmit: "favoriteApplicantEvent",
    })
  }

  if (countFavoriteBusinessApplicant || showAllCards) {
    statistics.push({
      statText:
        countFavoriteBusinessApplicant === 1
          ? "Sie haben sich<span class='text-branding-light-sky'> ein Schüler:in</span> gemerkt."
          : "Sie haben sich<span class='text-branding-light-sky'> " +
            convertNumberToGermanWord(countFavoriteBusinessApplicant, false) +
            "  Schüler:innen</span> gemerkt.",
      statNumber: countFavoriteBusinessApplicant,
      statNumberPosition: StatisticNumberPosition.topLeft,
      statNumberColor: "text-branding-light-sky",
      bgColor: "bg-branding-medium-lemon",
      buttonEmit: "favoriteBusinessApplicant",
    })
  }

  if (countInvitedApprenticeships || showAllCards) {
    statistics.push({
      statText:
        countInvitedApprenticeships === 1
          ? "Sie haben bereits <span class='text-branding-medium-lavender-1'>eine Einladung zum Bewerben</span> verschickt."
          : "Sie haben bereits <span class='text-branding-medium-lavender-1'> " +
            convertNumberToGermanWord(countInvitedApprenticeships, false) +
            "  Einladungen zum Bewerben</span> verschickt.",
      isSmallText: true,
      statNumber: countInvitedApprenticeships,
      statNumberPosition: StatisticNumberPosition.bottomLeft,
      statNumberColor: "text-branding-medium-lavender-1",
      bgColor: "bg-branding-medium-lavender",
    })
  }
}

function fillCardsForApplicants() {
  if (countRunningApprenticeships || showAllCards) {
    statistics.push({
      statText:
        countRunningApprenticeships === 1
          ? "<span class='text-branding-light-sky'>Eine laufende Bewerbung</span>."
          : "<span class='text-branding-light-sky'>" +
            convertNumberToGermanWord(countRunningApprenticeships, true) +
            "  laufende Bewerbungen</span>. Respekt!",
      statNumber: countRunningApprenticeships,
      statNumberPosition: StatisticNumberPosition.topLeft,
      statNumberColor: "text-branding-light-sky",
      bgColor: "bg-branding-medium-lemon",
    })
  }
  if (countAllApprenticeships || showAllCards) {
    statistics.push({
      statText:
        countAllApprenticeships === 1
          ? "Du hast bereits <span class='text-neutrals-green-1'>eine Bewerbung</span> über JoBooking versendet."
          : "Du hast bereits <span class='text-neutrals-green-1'> " +
            convertNumberToGermanWord(countAllApprenticeships, false) +
            "  Bewerbungen</span> über JoBooking versendet.",
      isSmallText: true,
      statNumber: countAllApprenticeships,
      statNumberPosition: StatisticNumberPosition.topLeft,
      statNumberColor: "text-neutrals-green-1",
      bgColor: "bg-branding-medium-matcha",
    })
  }

  if (countAcceptedInternships || showAllCards) {
    statistics.push({
      statText:
        countAcceptedInternships === 1
          ? "Du hast <span class='text-neutrals-green-2'>ein Praktikum</span> gebucht! Wow!"
          : "Du hast <span class='text-neutrals-green-2'> " +
            convertNumberToGermanWord(countAcceptedInternships, false) +
            " Praktika </span> gebucht. Wow!",
      statNumber: countAcceptedInternships,
      statNumberPosition: StatisticNumberPosition.bottomRightOverlapping,
      statNumberColor: "text-neutrals-green-2",
      bgColor: "bg-branding-medium-lavender-2",
    })
  }

  if (countInvitedInternships || showAllCards) {
    statistics.push({
      statText:
        countInvitedInternships === 1
          ? "Du hast <span class='text-branding-medium-lavender-1'>ein Ticket</span> für ein Praktikum erhalten."
          : "Du hast <span class='text-branding-medium-lavender-1'> " +
            convertNumberToGermanWord(countInvitedInternships, false) +
            "  Tickets</span> für ein Praktikum erhalten.",
      statNumber: countInvitedInternships,
      statNumberPosition: StatisticNumberPosition.topLeft,
      statNumberColor: "text-branding-medium-lavender-1",
      bgColor: "bg-branding-medium-lavender",
    })
  }

  if (countFavoriteApplicantEvent || showAllCards) {
    statistics.push({
      statText:
        countFavoriteApplicantEvent === 1
          ? "Du interessierst dich für <span class='text-neutrals-green-1'>zwei Events</span>!"
          : "Du interessierst dich für <span class='text-neutrals-green-1'> " +
            convertNumberToGermanWord(countFavoriteApplicantEvent, false) +
            "  Events</span>!",
      statNumber: countFavoriteApplicantEvent,
      statNumberPosition: StatisticNumberPosition.topRightOverlapping,
      statNumberColor: "text-neutrals-green-1",
      bgColor: "bg-branding-medium-matcha",
    })
  }

  if (countInvitedApprenticeships || showAllCards) {
    statistics.push({
      statText:
        countInvitedApprenticeships === 1
          ? "Eine <span class='text-neutrals-green-2'>Einladung zum Bewerben</span> erhalten. Wow!"
          : convertNumberToGermanWord(countInvitedApprenticeships, true) +
            "<span class='text-neutrals-green-2'> Einladungen zum Bewerben</span> erhalten. Wow!",
      statNumber: countInvitedApprenticeships,
      statNumberPosition: StatisticNumberPosition.bottomLeft,
      statNumberColor: "text-neutrals-green-2",
      bgColor: "bg-branding-medium-lavender-2",
    })
  }

  if (countFavoriteBusinessApplicant || showAllCards) {
    statistics.push({
      statText:
        countFavoriteBusinessApplicant === 1
          ? "Du folgst<span class='text-branding-medium-peach-1''>einem</span> Unternehmen."
          : "Du folgst<span class='text-branding-medium-peach-1''> " +
            convertNumberToGermanWord(countFavoriteBusinessApplicant, false) +
            "</span> Unternehmen.",
      statNumber: countFavoriteBusinessApplicant,
      statNumberPosition: StatisticNumberPosition.topLeft,
      statNumberColor: "text-branding-medium-peach-1",
      bgColor: "bg-branding-medium-peach",
      buttonEmit: "favoriteBusinessApplicant",
    })
  }
}

async function calcStatisticsForApplicants() {
  const favoriteApplicantBusiness = await client.listFavoriteApplicantBusiness({
    filter: `applicant="${userID}"`,
  })
  countFavoriteApplicantBusiness = favoriteApplicantBusiness.length
}

function handleBookingItemClick(emitString: string) {
  console.log(emitString)
}
</script>
<template>
  <div v-if="showAllCards" class="mb-3">
    Entwicklungsmodus: Alle Karten werden angezeigt.
  </div>
  <div
    v-if="init && isApplicant"
    class="grid auto-rows-[30vh] grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-10 [&>*:nth-child(even)]:row-span-1 [&>*:nth-child(odd)]:row-span-2"
  >
    <div v-for="statistic in statistics">
      <BookingRecapItem2
        :stat-text="statistic.statText"
        :is-small-text="statistic.isSmallText"
        :stat-number="statistic.statNumber"
        :stat-number-position="statistic.statNumberPosition"
        :stat-number-color="statistic.statNumberColor"
        :bg-color="statistic.bgColor"
        :button-emit="statistic.buttonEmit"
        @clickedButton="handleBookingItemClick($event)"
      />
    </div>
  </div>
  <div
    v-if="init && !isApplicant"
    class="grid auto-rows-[40vh] grid-cols-[repeat(auto-fill,minmax(40vh,1fr))] gap-10"
  >
    <div v-for="statistic in statistics">
      <BookingRecapItem2
        :stat-text="statistic.statText"
        :is-small-text="statistic.isSmallText"
        :stat-number="statistic.statNumber"
        :stat-number-position="statistic.statNumberPosition"
        :stat-number-color="statistic.statNumberColor"
        :bg-color="statistic.bgColor"
        :button-emit="statistic.buttonEmit"
        @clickedButton="handleBookingItemClick($event)"
      />
    </div>
  </div>
</template>
