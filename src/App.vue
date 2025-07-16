<template>
  <UserNavbar
  v-if="
    $route.path.startsWith('/product') ||
    $route.path.startsWith('/user') ||
    $route.path === '/' ||
    $route.path.startsWith('/customize') ||
    $route.path === '/questions' ||
    $route.path === '/cart'
  "
  />
  <router-view/>
  <Floating-Cart
  v-if="
    $route.path.startsWith('/product') ||
    $route.path.startsWith('/user') ||
    $route.path === '/' ||
    $route.path.startsWith('/customize') ||
    $route.path === '/questions' ||
    $route.path === '/cart'
  "
  />
  <Footer
  v-if="
    $route.path.startsWith('/product') ||
    $route.path.startsWith('/user') ||
    $route.path === '/' ||
    $route.path.startsWith('/customize') ||
    $route.path === '/questions' ||
    $route.path === '/cart'
  "
  />
</template>

<script>
import UserNavbar from './components/UserNavbar.vue'
import Footer from './components/Footer.vue'
import FloatingCart from './components/FloatingCart.vue'
export default {
  components: {
    UserNavbar,
    Footer,
    FloatingCart
  }
}
</script>

<style lang="scss">
@import "./assets/all.scss";
</style>
