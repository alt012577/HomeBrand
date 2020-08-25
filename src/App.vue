<template>
  <div id="app">
    <homeBrand/>
  </div>
</template>

<script>
import homeBrand from './components/homeBrand'
export default {
  name: 'App',
  components: {
    homeBrand
  },
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
