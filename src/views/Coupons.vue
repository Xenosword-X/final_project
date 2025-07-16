<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div>
    <Loading :active="isLoading" />
    <div class="d-flex justify-content-between align-items-center my-4">
      <h2 class="h4 fw-bold">優惠券管理</h2>
      <button class="btn btn-primary d-flex align-items-center gap-1" @click="openCouponModal(true)">
        <i class="bi bi-plus-circle"></i> 建立新的優惠券
      </button>
    </div>
    <div class="table-responsive">
      <table class="table table-hover align-middle text-nowrap">
        <thead class="table-light">
          <tr>
            <th>名稱</th>
            <th class="text-center">折扣百分比</th>
            <th class="text-center">到期日</th>
            <th class="text-center">狀態</th>
            <th class="text-center">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, key) in coupons" :key="key">
            <td>{{ item.title }}</td>
            <td class="text-center">{{ item.percent }}%</td>
            <td class="text-center">{{ formatDate(item.due_date) }}</td>
            <td class="text-center">
              <span class="badge" :class="item.is_enabled === 1 ? 'bg-success' : 'bg-secondary'">
                {{ item.is_enabled === 1 ? '啟用' : '未啟用' }}
              </span>
            </td>
            <td class="text-center">
              <div class="btn-group">
                <button class="btn btn-outline-primary btn-sm" @click="openCouponModal(false, item)">
                  <i class="bi bi-pencil-square"></i> 編輯
                </button>
                <button class="btn btn-outline-danger btn-sm" @click="openDelCouponModal(item)">
                  <i class="bi bi-trash"></i> 刪除
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <CouponModal :coupon="tempCoupon" ref="couponModal" :isNew="isNew"
      @update-coupon="updateCoupon"
    />
    <DelModal :item="tempCoupon" ref="delModal" @del-item="delCoupon"/>
    <Pagination :pages="pagination" @emit-pages="getCoupons"/>
  </div>
</template>

<script>
import CouponModal from '@/components/CouponModal.vue'
import DelModal from '@/components/DelModal.vue'
import Pagination from '@/components/Pagination.vue'
export default {
  components: {
    CouponModal,
    DelModal,
    Pagination
  },
  /* props: {
    config: Object
  }, */
  data () {
    return {
      coupons: {},
      pagination: {},
      tempCoupon: {
        title: '',
        is_enabled: 0,
        percent: 100,
        code: ''
      },
      isLoading: false,
      isNew: false
    }
  },
  methods: {
    getCoupons (page = 1) {
      const api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/admin/coupons`
      this.isLoading = true
      this.$http.get(api)
        .then((res) => {
          this.coupons = res.data.coupons
          this.pagination = res.data.pagination
          this.isLoading = false
        })
    },
    openCouponModal (isNew, item) {
      this.isNew = isNew
      if (this.isNew) {
        this.tempCoupon = {
          due_date: new Date().getTime() / 1000
        }
      } else {
        this.tempCoupon = { ...item }
      }
      this.$refs.couponModal.showModal()
    },
    openDelCouponModal (item) {
      this.tempCoupon = { ...item }
      const delComponent = this.$refs.delModal
      delComponent.showModal()
    },
    updateCoupon (tempCoupon) {
      this.tempCoupon = tempCoupon
      let api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/admin/coupon`
      let httpMethod = 'post'
      // 如果不是新增，改用 put 並補上 id
      if (!this.isNew) {
        api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/admin/coupon/${this.tempCoupon.id}`
        httpMethod = 'put'
      }
      this.isLoading = true
      this.$http[httpMethod](api, { data: this.tempCoupon })
        .then((res) => {
          this.isLoading = false
          if (res.data.success) {
            this.$refs.couponModal.hideModal()
            this.getCoupons()
            this.showToast(
              'success',
              this.isNew ? '新增優惠券成功' : '更新優惠券成功'
            )
          } else {
            this.showToast(
              'error',
              this.isNew ? '新增優惠券失敗' : '更新優惠券失敗'
            )
          }
        })
    },
    delCoupon () {
      const url = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/admin/coupon/${this.tempCoupon.id}`
      this.isLoading = true
      this.$http.delete(url).then((response) => {
        console.log(response, this.tempCoupon)
        const delComponent = this.$refs.delModal
        delComponent.hideModal()
        this.getCoupons()
      })
    },
    formatDate (timestamp) {
      const date = new Date(timestamp * 1000)
      return date.toISOString().split('T')[0]
    }
  },
  created () {
    this.getCoupons()
  }
}
</script>
