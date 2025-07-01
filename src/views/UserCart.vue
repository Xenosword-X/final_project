<template>
  <Loading :active="isLoading"></Loading>
  <div class="container">
    <div class="mt-4">
        <div class="row row-cols-1 row-cols-md-3 g-4">
          <div class="col" v-for="item in paginatedProducts" :key="item.id">
            <div class="card h-100">
              <div
                class="card-img-top"
                :style="{
                  height: '400px',
                  backgroundImage: `url(${item.imageUrl})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }"
              ></div>
              <div class="card-body">
                <h5 class="card-title">{{ item.title }}</h5>
                <p class="card-text">
                  <span v-if="!item.price">{{ item.origin_price }} 元</span>
                  <span v-else>
                    <del class="text-muted">原價 {{ item.origin_price }} 元</del><br>
                    <strong class="text-danger">現在只要 {{ item.price }} 元</strong>
                  </span>
                </p>
                <div class="d-flex justify-content-between">
                  <button class="btn btn-sm btn-outline-secondary" @click="getProduct(item.id)">
                    查看更多
                  </button>
                  <button class="btn btn-sm btn-outline-danger">
                    加到購物車
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 商品分頁 -->
        <nav class="mt-4">
          <ul class="pagination justify-content-center">
            <li class="page-item" :class="{ disabled: currentPage === 1 }">
              <a class="page-link" href="#" @click.prevent="currentPage--">上一頁</a>
            </li>
            <li
              class="page-item"
              v-for="page in totalPages"
              :key="page"
              :class="{ active: currentPage === page }"
            >
              <a class="page-link" href="#" @click.prevent="currentPage = page">{{ page }}</a>
            </li>
            <li class="page-item" :class="{ disabled: currentPage === totalPages }">
              <a class="page-link" href="#" @click.prevent="currentPage++">下一頁</a>
            </li>
          </ul>
        </nav>
      <!-- 購物車列表 -->
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      products: [],
      product: {},
      status: {
        loadingItem: ''
      },
      currentPage: 1, // 當前頁碼
      perPage: 9 // 每頁顯示幾筆
    }
  },
  computed: {
    paginatedProducts () {
      const start = (this.currentPage - 1) * this.perPage
      const end = start + this.perPage
      return this.products.slice(start, end)
    },
    totalPages () {
      return Math.ceil(this.products.length / this.perPage)
    }
  },
  methods: {
    getProducts () {
      const api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/products/all`
      this.isLoading = true
      this.$http.get(api)
        .then(res => {
          this.products = res.data.products
          this.isLoading = false
        })
    },
    getProduct (id) {
      this.$router.push(`/user/product/${id}`)
    }
  },
  created () {
    this.getProducts()
  }
}
</script>
