<template>
  <div class="demo">
    <div class="demo__wrapper">
      <div class="demo__options">
        <h3>Calendar Type</h3>
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

        <h3>Selection Type</h3>
        <input
          type="radio"
          id="rangeSelectionTypeTrue"
          name="rangeSelectionTypeTrue"
          :value="true"
          v-model="isRange"
        >
        <label for="rangeSelectionTypeTrue">Range</label>

        <input
          type="radio"
          id="rangeSelectionTypeFalse"
          name="rangeSelectionTypeFalse"
          :value="false"
          v-model="isRange"
        >
        <label for="rangeSelectionTypeFalse">Single</label>

        <h3>Max Date</h3>
        <p>{{ formattedEndDate }}</p>

        <h3>Selection</h3>
        <p>{{ selectedDate.label }}</p>
      </div>

      <div class="demo__calendar-wrapper">
        <Calendar
          class="demo__calendar"
          :class="selectedViewType"
          :maxDate="maxEndDate"
          :viewType="selectedViewType"
          :isRangeSelection="isRange"
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
  $default-padding: 25px;
  $dual-view-max-height: 800px;
  $single-view-max-width: 500px;
  $infinite-view-height: 700px;
  $infinite-view-width: 400px;

  .demo {
    &__wrapper {
      padding: $default-padding;
      display: flex;
    }

    &__options {
      text-align: left;
      padding: $default-padding;
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
      border-radius: $default-padding;
      width: 70vw;

      &.dual {
        padding: $default-padding;
        max-height: $dual-view-max-height;
      }

      &.single {
        padding: $default-padding;
        max-width: $single-view-max-width;
      }

      &.infinite {
        padding: 0 $default-padding;
        width: $infinite-view-width;
        height: $infinite-view-height;
        overflow: scroll;
      }
    }
  }
</style>
