<template>
  <div
    :class="dateClass"
    :style="style"
  >
    <div
      tabindex="0"
      :class="$style['innerDate']"
      @click="emitClickDate"
      @keydown.enter="emitClickDate"
    >
      <p>
        {{ date.date }}
      </p>
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Vue, Prop } from "vue-property-decorator"
  import CalendarDate from "@/services/CalendarDate"

  @Component({ name: "Day" })

  export default class Day extends Vue {

    /**
     * Luxon date object
     */
    @Prop({ required: true })
    readonly date!: CalendarDate

    /**
     * First Saturday date of the month, used for calculation of date placement
     */
    @Prop({ required: true })
    readonly firstSaturdayDate !: number

    $style: any

    get dateClass () {
      return `${this.$style.date}
      ${this.date.isDisabled() && this.$style.disabled}
      ${this.date.isStartDate() && this.$style.isStartDate}
      ${this.date.isEndDate() && this.$style.isEndDate}
      ${this.date.isBetween() && this.$style.isBetween}
      `
    }

    get style (): string {
      return `grid-area: ${this.rowLineNumber} / ${this.date.weekDay()}`
    }

    get rowLineNumber (): number {
      return this.date.date > this.firstSaturdayDate
        ? Math.ceil((this.date.date - this.firstSaturdayDate) / 7 ) + 1
        : 1
    }

    emitClickDate () {
      if (this.date.isDisabled()) return

      this.$emit('click', this.date)
    }
  }
</script>

<style lang="scss" module>
  $default-border: 1px solid black;

  .date {
    position: relative;
    padding-bottom: 100%;
    z-index: 2;

    p {
      color: pink;
    }

    &:hover,
    &:focus {
      outline: none;
      cursor: pointer;
      background-color: yellow;
      z-index: 20;

      p {
        color: black;
      }
    }
  }

  .innerDate {
    position: absolute;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .disabled {
    &:hover {
      color: gray;
      background-color: unset;
      cursor: not-allowed;

      p {
        color: gray;
      }
    }

    p {
      color: gray;
    }
  }

  .isBetween {
    margin-top: -1px;
    margin-bottom: -1px;
    border-top: $default-border;
    border-bottom: $default-border;
  }

  .isStartDate {
    margin: -1px 0 -1px -1px;
    border-radius: 100% 0 0 100%;
    border-left: $default-border;
    border-top: $default-border;
    border-bottom: $default-border;
  }

  .isEndDate {
    margin: -1px -1px -1px 0;
    border-radius: 0 100% 100% 0;
    border-top: $default-border;
    border-bottom: $default-border;
    border-right: $default-border;
  }

  .isStartDate.isEndDate {
    margin: -1px;
    border-radius: 100%;
  }
</style>
