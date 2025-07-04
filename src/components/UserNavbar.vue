<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top">
    <div class="container">
      <router-link class="navbar-brand fw-bold text-primary" to="/">
        GameZone
      </router-link>
      <!-- 手機版漢堡選單按鈕 -->
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <!-- 導覽項目靠右 -->
      <div class="collapse navbar-collapse justify-content-end" id="navbarNav">
        <ul class="navbar-nav align-items-center">
          <li class="nav-item mx-2">
            <router-link to="/" class="nav-link">
              首頁 <i class="bi bi-house-fill"></i>
            </router-link>
          </li>
          <li class="nav-item mx-2">
            <router-link to="/customize" class="nav-link">
              客製服務 <i class="bi bi-wrench-adjustable"></i>
            </router-link>
          </li>
          <li class="nav-item mx-2">
            <router-link to="/questions" class="nav-link">
              問答抽獎 <i class="bi bi-question-circle"></i>
            </router-link>
          </li>
          <li class="nav-item mx-2">
            <router-link to="/user/cart" class="nav-link">
              遊戲商城 <i class="bi bi-bag"></i>
            </router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.navbar-nav .nav-link {
  transition: color 0.2s;
}
.navbar-nav .nav-link:hover {
  color: white;
  background-color: #003971
}

/* 當前頁面樣式 */
.navbar-nav .nav-link.active {
  color: white !important;
  background-color: #003971;
}
</style>
