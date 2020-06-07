<template>
  <div id="app">
    <h1>vue-ts-calendar</h1>
    <CalendarDemo />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import CalendarDemo from './components/CalendarDemo.vue'

@Component({
  components: {
    CalendarDemo
  }
})
export default class App extends Vue {}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}

h1 {
  font: 50px Helvetica, Sans-Serif;
  letter-spacing: -4px;
}
</style>
