<template>
  <Loading :active="isLoading"></Loading>
  <div class="container">
    <nav aria-label="breadcrumb">
      <ol class="breadcrumb">
        <li class="breadcrumb-item"><router-link to="/user/cart">購物車</router-link></li>
        <li class="breadcrumb-item active" aria-current="page">{{ product.title }}</li>
      </ol>
    </nav>
    <div class="row justify-content-center">
      <article class="col-8">
        <!-- <h2>{{ product.title }}</h2> -->
        <img :src="product.imageUrl" alt="" class="img-fluid mb-3">
      </article>
      <div class="col-4">
        <!-- 商品內容說明 -->
        <div class="mb-3">
          <p class="text-muted h2">{{ product.title }}</p>
          <p class="mt-1">{{ product.content }}</p>
        </div>
        <!-- 價格資訊 -->
        <div class="h5" v-if="!product.price">{{ $filters.currency(product.origin_price) }} 元</div>
        <del class="h6" v-if="product.price">原價 {{ $filters.currency(product.origin_price) }} 元</del>
        <div class="h5 text-danger" v-if="product.price">特價 {{ $filters.currency(product.price) }} 元</div>
        <!-- 庫存提示 -->
        <div>
          <template v-if="product.num < 5">
            ⚠️ 庫存僅剩 {{ product.num }} 個，欲購從速！
          </template>
          <template v-else-if="product.num >= 10">
            ✅ 庫存充足（>=10）
          </template>
          <template v-else>
            庫存 (>=5)
          </template>
        </div>
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
        <button type="button" class="btn btn-outline-danger"
                @click="addToCart(product.id)">
          加到購物車
        </button>
      </div>
    </div>
    <div v-if="isYouTubeUrl(product.description)" class="ratio ratio-16x9 my-3">
      <iframe
        :src="embedYouTubeUrl(product.description)"
        title="YouTube video"
        allowfullscreen
      ></iframe>
    </div>
    <p v-else>{{ product.description }}</p>
  </div>
</template>

<script>
import ToastMessage from '@/mixins/ToastMessage'
export default {
  data () {
    return {
      product: {},
      id: '',
      isLoading: false
    }
  },
  methods: {
    getProduct () {
      this.isLoading = true
      const api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/product/${this.id}`
      this.$http.get(api)
        .then(res => {
          console.log(res)
          this.isLoading = false
          if (res.data.success) {
            this.product = res.data.product
          }
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
          this.$router.push('/user/cart')
        })
    },
    // 判斷是否為 YouTube 網址
    isYouTubeUrl (url) {
      if (typeof url !== 'string') return false
      return url.includes('youtube.com/watch') || url.includes('youtu.be/')
    },
    // 將網址轉換為 YouTube 嵌入網址
    embedYouTubeUrl (url) {
      let videoId = ''
      if (url.includes('youtube.com/watch')) {
        const urlParams = new URLSearchParams(url.split('?')[1])
        videoId = urlParams.get('v')
      } else if (url.includes('youtu.be/')) {
        videoId = url.split('youtu.be/')[1]
      }
      return `https://www.youtube.com/embed/${videoId}`
    }
  },
  created () {
    this.id = this.$route.params.productId
    this.getProduct()
  },
  mixins: [ToastMessage]
}
</script>
