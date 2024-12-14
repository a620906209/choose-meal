<template>
  <div class="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
    <RestaurantSwiper />
  </div>
</template>

<script>
import RestaurantSwiper from './components/RestaurantSwiper.vue'

export default {
  name: 'App',
  components: {
    RestaurantSwiper
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
