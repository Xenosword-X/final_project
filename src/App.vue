<template>
  <UserNavbar
  v-if="
    $route.path.startsWith('/user') ||
    $route.path === '/' ||
    $route.path.startsWith('/customize') ||
    $route.path === '/questions'
  "
  />
  <router-view/>
  <Footer
  v-if="
    $route.path.startsWith('/user') ||
    $route.path === '/' ||
    $route.path.startsWith('/customize') ||
    $route.path === '/questions'
  "
  />
</template>

<script>
import UserNavbar from './components/UserNavbar.vue'
import Footer from './components/Footer.vue'
export default {
  components: {
    UserNavbar,
    Footer
  }
}
</script>

<style lang="scss">
@import "./assets/all.scss";
</style>
