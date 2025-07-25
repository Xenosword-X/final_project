<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <Navbar/>
  <div class="container-fluid mt-3 position-relative">
    <router-view/>
  </div>
</template>

<script>
import Navbar from '@/backend/components/Navbar.vue'
export default {
  components: {
    Navbar
  },
  created () {
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/, '$1')
    this.$http.defaults.headers.common.Authorization = token
    const api = `${process.env.VUE_APP_API}api/user/check`
    this.$http.post(api, this.user)
      .then(res => {
        if (!res.data.success) {
          this.$router.push('/login')
        }
      })
      .catch((err) => {
        console.error('API 錯誤：', err)
        this.showToast('error', '資料載入失敗')
      })
  }
}
</script>
