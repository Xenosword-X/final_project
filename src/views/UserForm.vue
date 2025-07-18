<template>
<Loading :active="isLoading"></Loading>
<div class="my-5 row justify-content-center">
  <div class="col-md-6 mb-4" v-if="cart.carts.length !== 0">
    <h5 class="fw-bold mb-3">
      <i class="bi bi-bag-check-fill me-2 text-primary"></i> 購買明細
    </h5>
    <table class="table table-hover align-middle border rounded shadow-sm">
      <thead class="table-light">
        <tr>
          <th>品名</th>
          <th class="text-center">數量</th>
          <th class="text-end">單價</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in cart.carts" :key="item.id">
          <td>
            <div class="fw-semibold">{{ item.product.title }}</div>
            <span v-if="item.coupon" class="badge bg-success mt-1">已套用優惠券</span>
          </td>
          <td class="text-center">
            <span class="text-dark">{{ item.qty }}</span>
          </td>
          <td class="text-end text-nowrap">
            {{ $filters.currency(item.final_total) }}
          </td>
        </tr>
      </tbody>
      <tfoot class="border-top">
        <tr>
          <td colspan="2" class="text-end fw-bold">總計</td>
          <td class="text-end text-primary fw-semibold">{{ $filters.currency(cart.total) }}</td>
        </tr>
        <tr v-if="cart.final_total !== cart.total">
          <td colspan="2" class="text-end text-success fw-bold">折扣價</td>
          <td class="text-end text-success fw-semibold">{{ $filters.currency(cart.final_total) }}</td>
        </tr>
      </tfoot>
    </table>
    <div class="text-end">
      <router-link to="/cart" type="button" class="btn btn-secondary">返回商品頁</router-link>
    </div>
  </div>
  <div class="col-md-6 mb-4 text-center display-5 title" v-else>
    購物車為空，請返回商品頁選購
    <div class="text-end">
      <router-link to="/cart" type="button" class="btn btn-secondary">返回商品頁</router-link>
    </div>
  </div>
</div>
<div class="my-5 row justify-content-center" v-if="cart.carts.length !== 0">
  <div class="col-lg-8 col-md-10 col-sm-12">
    <div class="card shadow-sm">
      <div class="card-header bg-danger text-white fw-bold fs-5 d-flex align-items-center">
        <i class="bi bi-pencil-square me-2"></i> 填寫寄送資料
      </div>
      <div class="card-body">
        <Form v-slot="{ errors }" @submit="createOrder">
          <!-- Email -->
          <div class="mb-3">
            <label for="email" class="form-label fw-semibold">Email</label>
            <Field id="email" name="email" type="email" class="form-control"
              :class="{ 'is-invalid': errors['email'] }" placeholder="請輸入 Email"
              rules="email|required" v-model="form.user.email"
            />
            <ErrorMessage name="email" class="invalid-feedback" />
          </div>
          <!-- 姓名 -->
          <div class="mb-3">
            <label for="name" class="form-label fw-semibold">收件人姓名</label>
            <Field id="name" name="姓名" type="text" class="form-control"
              :class="{ 'is-invalid': errors['姓名'] }" placeholder="請輸入姓名"
              rules="required" v-model="form.user.name"
            />
            <ErrorMessage name="姓名" class="invalid-feedback" />
          </div>
          <!-- 電話 -->
          <div class="mb-3">
            <label for="tel" class="form-label fw-semibold">收件人電話</label>
            <Field id="tel" name="電話" type="tel" class="form-control"
              :class="{ 'is-invalid': errors['電話'] }" placeholder="請輸入電話"
              rules="required" v-model="form.user.tel"
            />
            <ErrorMessage name="電話" class="invalid-feedback" />
          </div>
          <!-- 地址 -->
          <div class="mb-3">
            <label for="address" class="form-label fw-semibold">收件人地址</label>
            <Field id="address" name="地址" type="text" class="form-control"
              :class="{ 'is-invalid': errors['地址'] }" placeholder="請輸入地址"
              rules="required" v-model="form.user.address"
            />
            <ErrorMessage name="地址" class="invalid-feedback" />
          </div>
          <!-- 留言 -->
          <div class="mb-3">
            <label for="message" class="form-label fw-semibold">留言</label>
            <textarea id="message" class="form-control" rows="4"
              placeholder="可輸入備註或希望的配送時間" v-model="form.message"></textarea>
          </div>
          <!-- 送出按鈕 -->
          <div class="text-end">
            <button class="btn btn-danger px-4 py-2">
              <i class="bi bi-send-fill me-1"></i> 送出訂單
            </button>
          </div>
        </Form>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import { useCartStore } from '@/stores/cartStore'
import { useStatusStore } from '@/stores/statusStore'
import { mapState, mapActions } from 'pinia'
export default {
  data () {
    return {
      form: {
        user: {
          name: '',
          email: '',
          tel: '',
          address: ''
        },
        message: ''
      }
    }
  },
  computed: {
    ...mapState(useCartStore, ['cart']),
    ...mapState(useStatusStore, ['isLoading', 'cartLoadingItem'])
  },
  methods: {
    ...mapActions(useCartStore, ['getCart']),
    createOrder () {
      const api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/order`
      const order = this.form
      this.isLoading = true
      this.$http.post(api, { data: order })
        .then(res => {
          console.log(res)
          this.showToast('success', '已送出訂單')
          const orderId = res.data.orderId
          this.$router.push(`/user/checkout/${orderId}`)
        })
    }
  },
  created () {
    this.getCart()
  }
}
</script>

<style lang="scss" scoped>
.title{
  @include custom-title-style
}
</style>
