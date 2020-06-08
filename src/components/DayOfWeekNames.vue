<template>
  <div :class="[$style.weekday, { [$style.sticky]: sticky }]">
    <p
      v-for="dayName in dayNames"
      :key="dayName"
      :class="$style['weekday__names']"
    >
      {{ dayName }}
    </p>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component({ name: 'DayOfWeekNames' })
export default class DayOfWeekNames extends Vue {
  /**
   * Name of days
   */
  @Prop({ required: true })
  readonly dayNames!: string[]

  /**
   * Make the names sticky
   */
  @Prop({ default: false })
  readonly sticky!: boolean

  $style: any
}
</script>

<style lang="scss" module>
  .weekday {
    padding-top: 10px;
    background-color: white;
    display: grid;
    grid-template-columns: repeat(7, 1fr);

    &.sticky {
      position: sticky;
      top: 0;
      z-index: 1000;
    }

    &__names {
      color: gray;
      justify-self: center;
      padding: 4px 0;
    }
  }

</style>
