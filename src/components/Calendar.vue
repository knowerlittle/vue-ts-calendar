<template>
  <div :class="$style.calendar">
    <div
      v-if="isInfiniteScroll"
      :class="$style['calendar--infinite']"
    >
      <DayOfWeekNames
        :dayNames="dayNames"
        :sticky="true"
      />
      <Month
        v-for="(_, index) in monthsTillMaxDate"
        :key="index"
        :dayNames="dayNames"
        :monthNames="monthNames"
        :monthOffset="monthOffset + index"
        :showDayNames="false"
        :showPreviousMonth="false"
        :showNextMonth="false"
        :monthAlignRight="true"
        :currentSelectionRange="currentSelectionRange"
        :maximumSelectionRange="maximumSelectionRange"
        :isInfinite="isInfiniteScroll"
        @selectDate="selectDate"
        @changeMonth="updateMonth"
      />
    </div>

    <div
      v-else
      :class="{ [$style['calendar__flex']]: isDualView }"
    >
      <Month
        :dayNames="dayNames"
        :monthNames="monthNames"
        :offsetAmount="monthOffsetAmount"
        :monthOffset="monthOffset"
        :showPreviousMonth="true"
        :showNextMonth="isSingleView"
        :currentSelectionRange="currentSelectionRange"
        :maximumSelectionRange="maximumSelectionRange"
        @selectDate="selectDate"
        @changeMonth="updateMonth"
      />

      <template v-if="isDualView">
        <div :class="$style['calendar__divider']" />

        <Month
          :dayNames="dayNames"
          :monthNames="monthNames"
          :offsetAmount="2"
          :monthOffset="monthOffset + 1"
          :showPreviousMonth="false"
          :showNextMonth="true"
          :currentSelectionRange="currentSelectionRange"
          :maximumSelectionRange="maximumSelectionRange"
          @selectDate="selectDate"
          @changeMonth="updateMonth"
        />
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { DateTime, Interval } from 'luxon'
import { Component, Vue, Prop, Provide, Watch } from 'vue-property-decorator'

import Month from '@/components/Month.vue'
import DayOfWeekNames from '@/components/DayOfWeekNames.vue'
import CalendarDate from '@/services/CalendarDate'

import { ViewType, monthNamesFallback, dayNamesFallback } from '@/helpers'

const currentDate = DateTime.local()

  @Component({
    name: 'Calendar',
    components: {
      Month,
      DayOfWeekNames
    }
  })
export default class Calendar extends Vue {
    /**
     * Provides current date to all child components
     * @private
     */
    @Provide() currentDate = currentDate

    /**
     * Name of months
     */
    @Prop({
      default: () => monthNamesFallback
    })
    readonly monthNames!: string[]

    /**
     * Name of days
     */
    @Prop({
      default: () => dayNamesFallback
    })
    readonly dayNames!: string[]

    /**
     * Calendar display
     */
    @Prop({
      required: true,
      validator: value => Object.values(ViewType).includes(value)
    })
    readonly viewType!: string

    /**
     * Single or Range selection
     */
    @Prop({ default: true })
    readonly isRangeSelection!: boolean

    /**
     * Maximum Date for calendar
     */
    @Prop({ required: true })
    readonly maxDate!: string

    /**
     * Format date is emitted
     */
    @Prop({ default: '' })
    readonly dateFormat!: string

    $style: any

    startDate: DateTime | null = null
    endDate: DateTime | null = null
    monthOffset = 0

    get isSingleView () {
      return this.viewType === ViewType.Single
    }

    get isDualView () {
      return this.viewType === ViewType.Dual
    }

    get isInfiniteScroll () {
      return this.viewType === ViewType.Infinite
    }

    get monthOffsetAmount () {
      return this.isSingleView
        ? 1
        : 2
    }

    get maximumDate () {
      return DateTime.fromISO(this.maxDate)
    }

    get currentSelectionRange () {
      if (this.startDate && this.endDate) {
        return Interval.fromDateTimes(this.startDate, this.endDate)
      }
      return null
    }

    // Creates the range that is selectable
    get maximumSelectionRange () {
      return Interval.fromDateTimes(
        currentDate.plus({ days: -1 }),
        this.maximumDate.plus({ days: 1 })
      )
    }

    get monthsTillMaxDate () {
      return Math.ceil(this.maximumDate.diff(currentDate, 'months').months)
    }

    @Watch('endDate')
    onEndDateChange () {
      this.emitDate()
    }

    @Watch('viewType')
    onViewTypeChange () {
      this.monthOffset = 0
    }

    /**
     * Emits selected date
     * @type {Object}
     */
    private emitDate () {
      if (this.startDate && this.endDate) {
        const selectedDates = {
          fromDate: this.dateFormat
            ? this.startDate.toFormat(this.dateFormat)
            : this.startDate.toISO(),
          toDate: this.dateFormat
            ? this.endDate.toFormat(this.dateFormat)
            : this.endDate.toISO(),
          label: this.getSimpleDate()
        }

        this.$emit('dateSelection', selectedDates)
      }
    }

    getSimpleDate () {
      if (this.startDate && this.endDate) {
        const startDate = `${this.startDate.toFormat('dd LLL')}`
        const endDate = `${this.endDate.toFormat('dd LLL yyyy')}`

        return this.startDate.hasSame(this.endDate, 'day')
          ? endDate
          : `${startDate} - ${endDate}`
      }
    }

    selectDate (date: CalendarDate) {
      // User hasn't selected any dates
      // or it's a single date selection
      // if the date picked is before the range then set both dates as the new date
      // if both dates are selected in a range then reset date selection process
      if (this.startDate === null && this.endDate === null ||
        !this.isRangeSelection ||
        this.currentSelectionRange && this.currentSelectionRange.isAfter(date.luxon) ||
        this.startDate && this.endDate && !this.startDate.hasSame(this.endDate, 'day')
      ) {
        this.startDate = date.luxon
      }
      this.endDate = date.luxon
    }

    updateMonth (value: number) {
      this.monthOffset = this.monthOffset + value
    }
}
</script>

<style lang="scss" module>
  $infinite-view-margin-bottom: 50px;

  .calendar {
    &__flex {
      display: flex;
    }

    &__divider {
      height: 100%;
      border-left: 8px solid white;
      border-right: 4px solid white;
    }

    &--infinite {
      margin-bottom: $infinite-view-margin-bottom;
    }
  }
</style>
