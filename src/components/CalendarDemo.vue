<template>
  <div class="demo">
    <div class="demo__wrapper">
      <div class="demo__options">
        <h2>Calendar Type</h2>

        <div
          v-for="(viewType, key) in viewTypes"
          :key="key"
        >
          <input
            type="radio"
            :id="`viewType${key}`"
            :name="`viewType${key}`"
            :value="viewType"
            v-model="selectedViewType"
          >
          <label :for="`viewType${key}`">
            {{ key }}
          </label>
        </div>

        <h2>Selection Type</h2>
        <input
          type="radio"
          id="rangeSelectionTypeTrue"
          name="rangeSelectionTypeTrue"
          :value="true"
          v-model="isRange"
        >
        <label for="rangeSelectionTypeTrue">
          Range
        </label>
        <input
          type="radio"
          id="rangeSelectionTypeFalse"
          name="rangeSelectionTypeFalse"
          :value="false"
          v-model="isRange"
        >
        <label for="rangeSelectionTypeFalse">
          Single
        </label>

        <h2>Max Date</h2>
        <p>{{ formattedEndDate }}</p>

        <h2>Selection</h2>
        <p>{{ selectedDate.label }}</p>
      </div>

      <div class="demo__calendar-wrapper">

        <Calendar
          class="demo__calendar"
          :class="selectedViewType"
          :maxDate="maxEndDate"
          :viewType="selectedViewType"
          :isRangeSelection="isRange"
          dateFormat="yyyy-MM-dd"
          @dateSelection="handleDateSelection"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { DateTime } from 'luxon'
import { Component, Vue } from 'vue-property-decorator'
import Calendar from '@/components/Calendar.vue'
import { SelectedDate } from '@/helpers/types'

import { ViewType } from '@/helpers'

@Component({
  components: {
    Calendar
  }
})
export default class CalendarDemo extends Vue {
  $style: any
  selectedViewType = ViewType.Dual
  isRange = true
  selectedDate = {}

  get maxEndDate () {
    const dt = DateTime.local()
    return dt.plus({ years: 1 })
  }

  get formattedEndDate () {
    return this.maxEndDate.toFormat('dd LLL yyyy')
  }

  get viewTypes () {
    return ViewType
  }

  handleDateSelection (date: SelectedDate) {
    this.selectedDate = date
  }
}
</script>

<style lang="scss">
  .demo {
    &__wrapper {
      padding: 25px;
      display: flex;
    }

    &__options {
      text-align: left;
      padding: 25px;
      box-sizing: border-box;
      width: 20vw;
    }

    &__calendar-wrapper {
      width: 100%;
      display: flex;
      justify-content: center;
    }

    &__calendar {
      box-shadow: 0px 10px 1px #ddd, 0 10px 20px #ccc;
      box-sizing: border-box;
      border: 1px solid lightgray;
      border-radius: 25px;
      width: 70vw;
    }
  }

  .dual {
    padding: 25px;
    max-height: 800px;
  }

  .single {
    padding: 25px;
    max-width: 500px;
  }

  .infinite {
    padding: 0 25px;
    width: 400px;
    height: 700px;
    overflow: scroll;
  }
</style>
