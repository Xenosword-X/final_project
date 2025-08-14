<template>
  <div class="login-page d-flex align-items-center justify-content-center vh-100 bg-light">
    <div class="card shadow-lg p-4" style="width: 100%; max-width: 420px; border-radius: 1rem;">
      <div class="card-body">
        <div class="text-center mb-4">
          <div class="display-6 mb-2">🔐 管理員登入</div>
          <p class="text-muted">請輸入帳號與密碼</p>
        </div>
        <form @submit.prevent="signIn">
          <div class="mb-3">
            <label for="inputEmail" class="form-label">Email 信箱</label>
            <input type="email" id="inputEmail" class="form-control"
              placeholder="admin@example.com" required autofocus v-model="user.username"
            />
          </div>
          <div class="mb-3">
            <label for="inputPassword" class="form-label">密碼</label>
            <input type="password" id="inputPassword" class="form-control"
              placeholder="請輸入密碼" required v-model="user.password"
            />
          </div>
          <div class="mt-4">
            <router-link to="/" class="btn btn-secondary btn-lg w-100" type="submit">回到首頁</router-link>
          </div>
          <div class="mt-4">
            <button class="btn btn-primary btn-lg w-100" type="submit">登入</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      user: {
        username: '',
        password: ''
      }
    }
  },
  methods: {
    signIn () {
      const api = `${process.env.VUE_APP_API}admin/signin`
      this.$http.post(api, this.user)
        .then((res) => {
          if (res.data.success) {
            const { token, expired } = res.data
            document.cookie = `hexToken=${token}; expires=${new Date(expired)}`
            this.$router.push('/dashboard/products')
          }
        })
        .catch(() => {
          this.showToast('error', '登入失敗，請確認帳號密碼是否正確')
        })
    }
  }
}
</script>

<style scoped>
.login-page {
  background: linear-gradient(135deg, #e0eafc, #cfdef3);
}
</style>
