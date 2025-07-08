<!-- eslint-disable vue/multi-word-component-names -->
<template>
<footer class="bg-dark text-white py-5">
  <div class="container">
    <div class="row">
      <!-- 左側 Logo + Info -->
      <div class="col-md-4 mb-4 mb-md-0">
        <h5 class="mb-3">
          <img :src="require('@/assets/LOGO.svg')" alt="GameZone Logo"
          style="width: 300px; width: 200px"/>
        </h5>
        <p class="mb-1">公司信箱：service@example.com</p>
        <p>電話：02-1234-5678</p>
      </div>

      <!-- 中間改為地圖區 -->
      <div class="col-md-4 mb-4 mb-md-0">
          <h5 class="mb-3">我們的位置</h5>
          <div class="ratio ratio-4x3 rounded overflow-hidden">
              <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3621.9984823905696!2d121.51310467601761!3d25.0477621378904!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3442a97279d6db13%3A0x42fe4b2ed0a23972!2z5Y-w54Gj5YyX6Lev5LiA!5e0!3m2!1szh-TW!2stw!4v1720150243742!5m2!1szh-TW!2stw"
              width="100%" height="100%" style="border:0;" loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
              ></iframe>
          </div>
          <p class="mt-2 text-white small">台北市中正區北平西路3號（台北車站）</p>
      </div>

      <!-- 右側訂閱欄位 -->
      <div class="col-md-4 d-flex flex-column justify-content-end">
        <div class="socialLink d-flex justify-content-end mb-3">
          <a href="https://www.facebook.com/"><i class="bi bi-facebook"></i></a>
          <a href="https://x.com/home"><i class="bi bi-twitter-x"></i></a>
          <a href="https://www.instagram.com/"><i class="bi bi-instagram"></i></a>
        </div>
        <p class="text-end">© 練習用作品，不得轉載</p>
      </div>
    </div>
  </div>
</footer>
</template>

<script>
</script>

<style scoped>
  .socialLink{
    gap: 30px
  }
  .socialLink i {
    font-size: 1.25rem;
    color: #fff;
    transition: 0.3s;
  }
</style>
