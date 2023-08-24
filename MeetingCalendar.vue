<script setup lang="ts">
import {ref} from "@vue/reactivity"
import {
  format,
  subMonths,
  addMonths,
  startOfWeek,
  getYear,
  addDays,
  endOfMonth,
  startOfMonth,
  endOfWeek,
  isWeekend,
  isSameDay,
} from "date-fns"

import Icon from "../core/Icon.vue"
// todo: should refactor this calendar
const activeDate = ref(new Date())
const selectedDate = ref(new Date())
const setSelectedDate = (date: Date) => {
  selectedDate.value = date
}
const setActiveDate = (date: Date) => {
  activeDate.value = date
}

const getWeekDaysNames = () => {
  const weekStartDate = startOfWeek(activeDate.value)
  const weekDays = []
  for (let day = 0; day < 7; day++) {
    weekDays.push(format(addDays(weekStartDate, day), "E"))
  }
  return weekDays
}

const generateDatesForCurrentWeek = (date: Date, selectedDate: Date) => {
  let currentDate = date
  const week = []
  for (let day = 0; day < 7; day++) {
    const cloneDate = currentDate
    week.push({
      day: format(currentDate, "d"),
      isWeekend: isWeekend(currentDate),
      isSelectedDay: isSameDay(currentDate, selectedDate),
      isToday: isSameDay(currentDate, new Date()),
      cloneDate,
    })
    currentDate = addDays(currentDate, 1)
  }
  return week
}
const getDates = () => {
  const startOfTheSelectedMonth = startOfMonth(activeDate.value)
  const endOfTheSelectedMonth = endOfMonth(activeDate.value)
  const startDate = startOfWeek(startOfTheSelectedMonth)
  const endDate = endOfWeek(endOfTheSelectedMonth)
  let currentDate = startDate
  const allWeeks = []
  while (currentDate <= endDate) {
    allWeeks.push(generateDatesForCurrentWeek(currentDate, selectedDate.value))
    currentDate = addDays(currentDate, 7)
  }
  return allWeeks
}
</script>
<template>
  <div class="rounded-2xl bg-white p-8">
    <div class="mb-6 flex items-center justify-between">
      <p class="text-sm font-bold text-branding-space-blue">
        {{ format(activeDate, "LLLL") }} {{ getYear(activeDate) }}
      </p>
      <div class="flex gap-x-4">
        <Icon
          @click="() => setActiveDate(subMonths(activeDate, 1))"
          class="cursor-pointer"
          width="16px"
          height="14px"
          name="arrow-dark-left"
        />
        <Icon
          @click="() => setActiveDate(addMonths(activeDate, 1))"
          class="cursor-pointer"
          width="16px"
          height="14px"
          name="arrow-dark-right"
        />
      </div>
    </div>
    <div class="grid grid-cols-7 gap-1">
      <p
        :class="`${
          index >= 5
            ? 'text-neutrals-dark-blue-grey'
            : 'text-branding-space-blue'
        } p-2 text-center text-xs font-semibold`"
        v-for="(weekDays, index) in getWeekDaysNames()"
      >
        {{ weekDays }}
      </p>
    </div>
    <div class="grid gap-1">
      <div class="grid grid-cols-7 gap-1" v-for="weekDays in getDates()">
        <div
          class="flex h-8 w-8 flex-col items-center justify-center"
          v-for="weekDay in weekDays"
        >
          <p
            @click="() => setSelectedDate(weekDay.cloneDate)"
            :class="`
                            ${
                              weekDay.isWeekend
                                ? 'weekend font-medium text-neutrals-dark-blue-grey'
                                : ''
                            } 
                            ${
                              weekDay.isSelectedDay || weekDay.isToday
                                ? 'selected bg-branding-space-blue font-bold text-branding-mint-green'
                                : ''
                            } 
                            ${
                              weekDay.isToday ? 'today' : ''
                            } flex h-7 w-7 cursor-pointer flex-col items-center justify-center rounded-full text-center text-xs font-medium`"
          >
            {{ weekDay.day }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
