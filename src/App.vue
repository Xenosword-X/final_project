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
  <Footer
  v-if="
    $route.path.startsWith('/user') ||
    $route.path === '/' ||
    $route.path === '/customize' ||
    $route.path === '/questions'
  "
  ></Footer>
</template>

<script>
import UserNavbar from './components/UserNavbar.vue'
import Footer from './views/Footer.vue'
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
