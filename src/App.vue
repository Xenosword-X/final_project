<template>
  <UserNavbar
  v-if="
    $route.path.startsWith('/user') ||
    $route.path === '/' ||
    $route.path === '/customize' ||
    $route.path === '/questions'
  "
  />
  <router-view/>
</template>

<script>
import UserNavbar from './components/UserNavbar.vue'
export default {
  components: {
    UserNavbar
  }
}
</script>

<style lang="scss">
@import "./assets/all.scss";
</style>
