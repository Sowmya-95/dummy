<script setup lang="ts">
import BookingProcessItem from "./BookingProcessItem/BookingProcessItem.vue"
import BookingProcessFeedbackItem from "./BookingProcessItem/BookingProcessFeedbackItem.vue"
import BookingProcessCard from "./BookingProcessItem/BookingProcessCard.vue"
import BookingProcessTimeline from "./BookingProcessItem/BookingProcessTimeline.vue"
import BookingProcessDetails from "./BookingProcessItem/BookingProcessDetails.vue"
import {FeedbackProps} from "./booking-types"
import {computed} from "vue"
import {
  ApplicationsStatusOptions,
  MeetupsResponse,
} from "../../pocketbase-types"
import {format, parseISO} from "date-fns"
import {ExpandedApplication, ExpandedSchoolVisit} from "../../types"
import client from "../../client"
import {getFileURL} from "../../util"

interface Props {
  application: ExpandedApplication
  meetup?: MeetupsResponse
  schoolVisit?: ExpandedSchoolVisit
}

const props = defineProps<Props>()

const backgroundColor = computed(() => {
  return {
    applied: "bg-branding-light-lemon",
    proposed: "bg-branding-light-matcha-50",
    scheduled: "bg-branding-light-blue-50",
    accepted: "bg-branding-light-lavender-50",
    declined: "bg-branding-light-lavender-50",
    withdrawn: "",
  }[props.application.status]
})

const process = computed(() => {
  return {
    applied: 1,
    proposed: 2,
    scheduled: 3,
    accepted: 4,
    declined: 4,
    withdrawn: 0,
  }[props.application.status]
})

const bottomText = computed(() => {
  return {
    applied: client.isApplicant()
      ? "Bewerbung abgeschickt"
      : "Bewerbung erhalten",
    proposed: client.isApplicant()
      ? "Einladung erhalten"
      : "Einladung verschickt",
    scheduled: "Bewerbungsgespräch",
    accepted: "Zusage",
    declined: "Absage",
    withdrawn: "",
  }[props.application.status]
})

const topText = computed(() => {
  return {
    applied: client.isApplicant()
      ? ""
      : "Ausbildung zum Industriemechaniker:in",
    proposed: client.isApplicant()
      ? ""
      : "Ausbildung zum Industriemechaniker:in",
    scheduled: client.isApplicant()
      ? ""
      : "Ausbildung zum Industriemechaniker:in",
    accepted: "",
    declined: "",
    withdrawn: "",
  }[props.application.status]
})

const cardImage = computed(() => {
  if (client.isApplicant()) {
    const business = props.application.expand.vacancy.expand.business
    if (business.logo) {
      return getFileURL(business, business.logo)
    }
  } else {
    const applicant = props.application.expand.applicant
    if (applicant.image) {
      return getFileURL(applicant, applicant.image)
    }
  }
})

const startDateText = computed(() => {
  const vacancyStartDate = props.application.expand.vacancy.startDate
  if (vacancyStartDate) {
    try {
      return "Start: " + format(parseISO(vacancyStartDate), "MM/yyyy")
    } catch (exception) {
      console.log("failed to parse start date", exception)
      return ""
    }
  }
})

const emit = defineEmits(["accept", "makeProposal", "deny"])

function accept() {
  emit("accept")
}
function makeProposal() {
  emit("makeProposal")
}
function deny() {
  emit("deny")
}

const applicantFeedbackProps: Map<ApplicationsStatusOptions, FeedbackProps> =
  new Map([
    [
      ApplicationsStatusOptions.applied,
      {
        isVertical: true,
        bgColor: "bg-branding-dark-lemon",
        iconName: "hourglass",
        title: "Bewerbung verschickt",
        clickable: false,
      },
    ],
    [
      ApplicationsStatusOptions.scheduled,
      {
        isVertical: true,
        bgColor: "bg-branding-medium-sky",
        iconName: "calendar",
        title: props.meetup
          ? "Dein Bewerbungsgespräch findet am " +
            format(parseISO(props.meetup.date), "dd.MM.yyyy") +
            " statt"
          : "",
        clickable: false,
      },
    ],
    [
      ApplicationsStatusOptions.accepted,
      {
        isVertical: true,
        bgColor: "bg-branding-dark-lavender",
        iconName: "trophy",
        title: "Glückwunsch, du hast eine Zusage erhalten!",
        clickable: false,
      },
    ],
    [
      ApplicationsStatusOptions.declined,
      {
        isVertical: true,
        bgColor: "bg-branding-dark-lavender",
        iconName: "smiley",
        title: "Bleib dran, du bist klasse!",
        clickable: false,
      },
    ],
  ])

const businessFeedbackProps: Map<ApplicationsStatusOptions, FeedbackProps> =
  new Map([
    [
      ApplicationsStatusOptions.proposed,
      {
        isVertical: true,
        bgColor: "bg-branding-dark-matcha",
        iconName: "check2",
        title: "Termin vorgeschlagen",
        clickable: false,
      },
    ],
    [
      ApplicationsStatusOptions.scheduled,
      {
        isVertical: true,
        bgColor: "bg-branding-medium-sky",
        iconName: "calendar",
        title: props.meetup
          ? "Dein Bewerbungsgespräch findet am " +
            format(parseISO(props.meetup.date), "dd.MM.yyyy") +
            " statt"
          : "",
        clickable: false,
      },
    ],
    [
      ApplicationsStatusOptions.accepted,
      {
        isVertical: true,
        bgColor: "bg-branding-dark-lavender",
        iconName: "check2",
        title: "Zusage erteilt",
        clickable: false,
      },
    ],
    [
      ApplicationsStatusOptions.declined,
      {
        isVertical: true,
        bgColor: "bg-branding-dark-lavender",
        iconName: "close",
        title: "Absage erteilt",
        clickable: false,
      },
    ],
  ])
</script>

<template>
  <BookingProcessItem :bgColor="backgroundColor">
    <template v-slot:section-card>
      <BookingProcessCard
        :firstText="
          client.isApplicant()
            ? application.expand.vacancy.expand.business.name
            : application.expand.applicant.firstName
        "
        :secondText="
          client.isApplicant()
            ? application.expand.vacancy.title
            : schoolVisit?.expand.school.name
        "
        :thirdText="
          client.isApplicant()
            ? startDateText
            : schoolVisit?.class +
              `.
        Klasse`
        "
        :imageURL="cardImage"
      />
    </template>
    <template v-slot:section-timeline>
      <BookingProcessTimeline
        :process="process"
        :bottomText="bottomText"
        :topText="topText"
      />
    </template>
    <template v-slot:section-feedback>
      <BookingProcessFeedbackItem
        v-if="
          (client.isApplicant() &&
            application.status !== ApplicationsStatusOptions.proposed) ||
          (!client.isApplicant() &&
            application.status !== ApplicationsStatusOptions.applied)
        "
        :feedback-props="client.isApplicant() ?
        applicantFeedbackProps.get(application.status)! :
        businessFeedbackProps.get(application.status)!"
      />
      <div v-else class="flex h-full flex-col">
        <BookingProcessFeedbackItem
          @click="accept()"
          :feedback-props="{
            isVertical: false,
            clickable: true,
            title: 'Annehmen',
            iconName: 'check2',
            bgColor: 'bg-branding-dark-matcha',
          }"
        />
        <BookingProcessFeedbackItem
          @click="makeProposal()"
          :feedback-props="{
            isVertical: false,
            clickable: true,
            title: 'Terminvorschlag',
            iconName: 'proposal',
            bgColor: 'bg-branding-dark-lemon',
          }"
        />
        <BookingProcessFeedbackItem
          @click="deny()"
          :feedback-props="{
            isVertical: false,
            clickable: true,
            title: 'Ablehnen',
            iconName: 'close',
            bgColor: 'bg-branding-dark-peach',
          }"
        />
      </div>
    </template>
    <template
      v-if="
        meetup &&
        (application.status === ApplicationsStatusOptions.proposed ||
          application.status === ApplicationsStatusOptions.scheduled)
      "
      v-slot:section-details
    >
      <BookingProcessDetails :meetup="meetup!" />
    </template>
  </BookingProcessItem>
</template>
