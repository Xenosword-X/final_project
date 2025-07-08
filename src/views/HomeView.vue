<template>
  <!-- banner區域 -->
  <div class="min-vh-100 position-relative">
    <div class="position-absolute w-100 h-100"
      :style="{
        backgroundImage: `url(${require('@/assets/header.jpg')})`,
        backgroundAttachment: 'fixed',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        zIndex: -1
      }"
    ></div>
    <div class="position-absolute top-50 start-50 translate-middle text-center text-light">
        <h1 class="display-1 fw-bold title">電玩領域</h1>
        <hr class="mb-1 mx-n3">
        <h2>歡迎光臨我們的商城</h2>
        <p>您想要的主機遊戲我們都有</p>
    </div>
  </div>
  <div class="home container py-5">
    <!-- 輪播區域 -->
    <div id="carouselExampleCaptions" class="carousel slide carousel-fade" data-bs-ride="carousel">
      <div class="carousel-inner">
        <h2 class="carousel-title text-center title mb-3">我們的服務</h2>
        <div class="carousel-item active" data-bs-interval="3000">
          <img src="../assets/Carousel1.jpg" class="d-block w-100" alt="遊戲商城">
          <div class="carousel-caption p-3 rounded">
            <h5>遊戲商城</h5>
            <p>各式各樣的遊戲主機與軟體我們都有</p>
          </div>
        </div>
        <div class="carousel-item" data-bs-interval="3000">
          <img src="../assets/Carousel2.png" class="d-block w-100" alt="客製服務">
          <div class="carousel-caption p-3 rounded">
            <h5>客製服務</h5>
            <p>想要讓主機能更加繽紛嗎?我們為您打造專屬的外觀</p>
          </div>
        </div>
        <div class="carousel-item" data-bs-interval="3000">
          <img src="../assets/Carousel3.png" class="d-block w-100" alt="抽獎活動">
          <div class="carousel-caption p-3 rounded">
            <h5>抽獎活動</h5>
            <p>我們不定期舉辦抽獎活動，答對8題以上者即可獲得抽獎資格</p>
          </div>
        </div>
      </div>
      <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="prev">
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Previous</span>
      </button>
      <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="next">
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Next</span>
      </button>
    </div>
    <div class="mb-3 text-end">
      <router-link to="/login" class="btn btn-outline-secondary">管理員登入</router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomeView'
}
</script>

<style lang="scss" scoped>
.carousel-caption {
  background-color: rgba(0, 0, 0, 0.5);
  /* 避免文字太靠邊 */
  max-width: 50%;
  margin: 0 auto;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.7);
}
.title{
  @include custom-title-style
}
</style>
