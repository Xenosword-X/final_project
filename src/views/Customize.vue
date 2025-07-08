<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="container py-5">
    <div class="d-flex flex-column flex-md-row">
      <div class="mb-5 me-md-5">
        <ul class="nav flex-row flex-md-column justify-content-center customUl sticky-top">
          <li class="nav-item">
            <router-link to="/customize/CInfo" class="nav-link text-dark">
              服務簡介
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/customize/CPrice" class="nav-link text-dark">
              報價一覽
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/customize/CForm" class="nav-link text-dark">
              了解更多
            </router-link>
          </li>
        </ul>
      </div>
      <router-view />
    </div>
  </div>
</template>

<style scoped>
.sticky-top {
  top: 70px; /* 根據你的 navbar 高度調整，例如 70px 或 80px */
}
.customUl .nav-link {
  white-space: nowrap;/* 避免連結文字換行*/
  transition: color 0.2s;
}
.customUl .nav-link:hover {
  color: white;
  background-color: #e60012
}
/* 當前頁面樣式 */
.customUl .nav-link.active {
  color: white !important;
  background-color: #e60012;
}
</style>
