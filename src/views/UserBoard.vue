<template>
  <div class="container-fluid mt-3 position-relative">
    <router-view/>
  </div>
</template>

<script>
import emitter from '@/methods/emitter'

export default {
  components: {

  },
  provide () {
    return {
      emitter
    }
  },
  created () {
  }
}
</script>
