<template>
  <div :class="$style.month">

    <DayOfWeekNames
      v-if="showDayNames"
      :dayNames="dayNames"
    />

    <div :class="$style['month__navigation']">
      <button
        v-if="showPreviousMonth"
        :class="$style['month__navigation-left']"
        :disabled="disablePrevious"
        @click="changeMonth(offsetAmount * -1)"
      >
        Prev
      </button>

      <p
        :class="[
          $style['month__navigation-name'], {[
          $style['align-right']]: monthAlignRight
        }]"
      >
        {{ selectedMonth }} {{ selectedYear }}
      </p>

      <button
        v-if="showNextMonth"
        :class="$style['month__navigation-right']"
        :disabled="disableNext"
        @click="changeMonth(offsetAmount)"
      >
        Next
      </button>
    </div>

    <div :class="[$style['month__days'], {[$style['month__days-wrapper']]: !isInfinite}]">
      <Day
        v-for="date in dates"
        :key="`${selectedYear}-${selectingMonth}-${date.date}`"
        :firstSaturdayDate="firstSaturdayDate"
        :date="date"
        @click="selectDate"
      />
    </div>

  </div>
</template>

<script lang="ts">
import { DateTime, Interval } from 'luxon'
import { Component, Vue, Prop, Inject } from 'vue-property-decorator'

import DayOfWeekNames from '@/components/DayOfWeekNames.vue'
import Day from '@/components/Day.vue'
import CalendarDate from '@/services/CalendarDate'

@Component({
  name: 'Month',
  components: {
    Day,
    DayOfWeekNames
  }
})
export default class Month extends Vue {
  @Inject() readonly currentDate!: DateTime

  /**
   * Show/Hide day names; Used when day names are external and sticky
   */
  @Prop({ default: true })
  readonly showDayNames!: boolean

  /**
   * Current range selection
   */
  @Prop()
  readonly currentSelectionRange: Interval | undefined

  /**
   * Maximum range selection
   */
  @Prop({ required: true })
  readonly maximumSelectionRange!: Interval

  /**
   * Show previous month button
   */
  @Prop({ required: true })
  readonly showPreviousMonth!: boolean

  /**
   * Show next month button
   */
  @Prop({ required: true })
  readonly showNextMonth!: boolean

  /**
   * Amount of offset emitted when a month changes
   */
  @Prop({ default: 1 })
  readonly offsetAmount!: number

  /**
   * The offset base on the month from the current date that the calendar will display
   */
  @Prop({ required: true })
  readonly monthOffset!: number

  /**
   * Sets the month name alignment to the right
   */
  @Prop({ default: false })
  readonly monthAlignRight!: boolean

  /**
   * Name of months
   */
  @Prop({ required: true })
  readonly monthNames!: string[]

  /**
   * Name of days
   */
  @Prop({ required: true })
  readonly dayNames!: string[]

  /**
   * If it is infinite scroll
   */
  @Prop({ default: false })
  readonly isInfinite!: boolean

  $style: any

  monthChange = 0

  get offSetMonth () {
    return this.monthChange + this.monthOffset
  }

  get viewingDate () {
    return this.currentDate.plus({ months: this.offSetMonth })
  }

  get selectingMonth () {
    return this.viewingDate.month - 1
  }

  get selectedYear () {
    return this.viewingDate.year
  }

  get selectedMonth () {
    return this.monthNames[this.selectingMonth]
  }

  get selectingMonthOneOffset () {
    return this.selectingMonth + 1
  }

  // date + 1 is required as date starts from 0 when we want a calendar date
  get dates () {
    return new Array(this.viewingDate.daysInMonth).fill({}).map((key, date) => {
      return new CalendarDate(
        date + 1,
        this.selectingMonthOneOffset,
        this.selectedYear,
        this.currentSelectionRange,
        this.maximumSelectionRange
      )
    })
  }

  get firstSaturdayDate () {
    return 8 - this.dates[0].weekDay()
  }

  get disablePrevious () {
    return this.maximumSelectionRange.isAfter(this.viewingDate.plus({ months: -1 }))
  }

  get disableNext () {
    const monthDifference = this.maximumSelectionRange.end.day > this.viewingDate.day
      ? 1
      : 0
    return this.maximumSelectionRange.isBefore(this.viewingDate.plus({ months: monthDifference }))
  }

  /**
   * Emits the amount of month to change by
   * @type {number}
   */
  private changeMonth (value: number) {
    this.$emit('changeMonth', value)
  }

  /**
   * Emits selected date
   * @type {CalendarDate}
   */
  private selectDate (date: CalendarDate) {
    this.$emit('selectDate', date)
  }
}
</script>

<style lang="scss" module>
  $month-font-size: 20px;

  .month {
    box-sizing: border-box;
    padding: 1px;
    width: 100%;

    p {
      justify-self: center;
    }

    &__navigation {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      padding: 8px 0 4px 0;
    }

    &__navigation-left {
      grid-column: 1 / 2;
      align-self: center;
      justify-self: center;
      cursor: pointer;
    }

    &__navigation-right {
      grid-column: 7 / 8;
      align-self: center;
      justify-self: center;
      cursor: pointer;
    }

    &__navigation-name {
      font-size: $month-font-size;
      color: black;
      grid-column: 2 / 7;

      &.align-right {
        grid-column: 1 / 8;
        justify-self: end;
        margin-right: 5%
      }
    }

    &__days {
      display: grid;
      grid-row-gap: 0.5rem;
    }

    &__days-wrapper {
      grid-template-rows: repeat(6, 1fr)
    }
  }

</style>
