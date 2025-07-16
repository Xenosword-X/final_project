<template>
  <div class="background">
    <div class="checkout-layout container py-5">
      <div class="text-center mb-4">
        <!-- <h2 class="fw-bold title">結帳流程</h2> -->
        <div class="checkout-steps mt-3">
          <img src="../assets/fillForm.png" alt="fillForm" style="width:200px"
          class="img-fluid" v-if="$route.path.includes('/form')">
          <img src="../assets/comfirmOrder.png" alt="comfirmOrder" style="width:200px"
          class="img-fluid" v-if="$route.path.includes('/checkout')">
        </div>
      </div>
      <router-view />
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserBoard'
}
</script>

<style scoped lang="scss">
.checkout-steps {
  font-size: 1rem;
  font-weight: 500;
  display: flex;
  justify-content: center;
  gap: 0.5rem;

  span.active {
    color: #dc3545;
    font-weight: bold;
  }
}
.title{
  @include custom-title-style
}
.background{
  @include background-color
}
</style>
