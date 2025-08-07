<template>
  <div class="main-section">
  <Loading :active="isLoading"></Loading>
  <div class="container pt-3">
    <nav aria-label="breadcrumb">
      <ol class="breadcrumb">
        <li class="breadcrumb-item"><router-link to="/cart">購物車</router-link></li>
        <li class="breadcrumb-item active" aria-current="page">{{ product.title }}</li>
      </ol>
    </nav>
    <div class="row justify-content-center">
      <article class="col-md-6">
        <img :src="product.imageUrl" alt="" class="img-fluid mb-3">
      </article>
      <div class="col-md-4">
        <!-- 商品內容說明 -->
        <div class="mb-3">
          <p class="text-muted h2">{{ product.title }}</p>
          <p class="mt-1">{{ product.content }}</p>
        </div>
        <!-- 價格資訊 -->
        <div class="h5" v-if="!product.price">{{ $filters.currency(product.origin_price) }} 元</div>
        <del class="h6" v-if="product.price">原價 {{ $filters.currency(product.origin_price) }} 元</del>
        <div class="h5 text-danger" v-if="product.price">特價 {{ $filters.currency(product.price) }} 元</div>
        <hr>
        <p class="mb-3 fw-bold">付款方式: 信用卡</p>
        <p class="mb-1 fw-bold">運送方式：</p>
        <ul class="list-unstyled mb-3">
          <li>📦 7-11 門市取貨：<span class="text-muted">NT$60</span></li>
          <li>📦 全家 門市取貨：<span class="text-muted">NT$60</span></li>
          <li>🚚 宅配 / 快遞：<span class="text-muted">NT$100</span></li>
          <li>🏬 門市取貨：<span class="text-success">免費</span></li>
        </ul>
        <p class="text-success">滿 NT$2,000 享免運優惠</p>
        <hr>
        <button type="button" class="btn btn-outline-primary"
                @click="addToCart(product.id)">
          加到購物車 <i class="bi bi-bag-fill"></i>
        </button>
      </div>
    </div>
    <ProductTab :youtubeUrl="product.description" />
  </div>
  </div>
</template>

<script>
import ProductTab from '@/frontend/components/ProductTab.vue'
export default {
  data () {
    return {
      product: {},
      id: '',
      isLoading: false
    }
  },
  components: {
    ProductTab
  },
  methods: {
    getProduct () {
      this.isLoading = true
      const api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/product/${this.id}`
      this.$http.get(api)
        .then(res => {
          this.isLoading = false
          if (res.data.success) {
            this.product = res.data.product
          }
        })
        .catch((err) => {
          console.error('API 錯誤：', err)
          this.showToast('error', '資料載入失敗')
        })
    },
    addToCart (id, qty = 1) {
      this.isLoading = true
      const api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/cart`
      const cart = {
        product_id: id,
        qty
      }
      this.$http.post(api, { data: cart })
        .then(res => {
          this.isLoading = false
          this.showToast('success', '已加入購物車')
          this.$router.push('/cart')
        })
        .catch((err) => {
          console.error('API 錯誤：', err)
          this.showToast('error', '資料新增失敗')
        })
    }
  },
  created () {
    this.id = this.$route.params.productId
    this.getProduct()
  }
}
</script>

<style lang="scss" scoped>
.main-section{
  @include background-color
}
</style>
