<script setup lang="ts">
import TabWithDropdown from "./../core/Filters/TabWithDropdown.vue"
import {optionGroup} from "./../core/Filters/filterTypes"

interface Props {
  currentTabId: number
  isDarkMode?: boolean
}
const props = defineProps<Props>()

const tabs = [
  {tabId: 0, title: "Dashboard"},
  {tabId: 1, title: "Aktive Bewerbungen"},
  {tabId: 2, title: "Statistik"},
  {tabId: 3, title: "Kalender", class: "lg:hidden"},
]

const dummyOptionGroup: optionGroup = {
  title: "dummy",
  options: [
    {value: 1, label: "dummy1"},
    {value: 2, label: "dummy2"},
    {value: 3, label: "dummy3"},
    {value: 4, label: "dummy4"},
  ],
  isMultiSelect: true,
}

const dummyOptionGroup2: optionGroup = {
  title: "dummy2",
  options: [
    {value: 1, label: "dummy1"},
    {value: 2, label: "dummy2"},
    {value: 3, label: "dummy3"},
    {value: 4, label: "dummy4"},
  ],
}
</script>
<template>
  <div>
    <div class="gap-2 flex flex-wrap">
      <div v-for="tab in tabs">
        <TabWithDropdown
          :class="tab.class"
          :is-dark-mode="isDarkMode"
          :is-active="currentTabId === tab.tabId"
          :title="tab.title"
          :option-groups="[dummyOptionGroup, dummyOptionGroup2]"
          @click="$emit('tab-action', tab.tabId)"
        />
      </div>
    </div>
  </div>
</template>
