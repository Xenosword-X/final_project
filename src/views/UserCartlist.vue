<template>
  <Loading :active="isLoading"></Loading>
  <div class="container">
    <div class="row mt-4">
      <div class="col-md-12">
        <select class="form-select mb-3" aria-label="product-category"
        v-model="selectedCategory">
            <option value="" disabled>請選擇類別</option>
            <option value="">全部</option>
            <option value="主機">主機</option>
            <option value="遊戲">遊戲</option>
            <option value="配件">配件</option>
        </select>
        <div class="row row-cols-1 row-cols-md-3 g-4">
          <div class="col" v-for="item in paginatedProducts" :key="item.id">
            <div class="card h-100">
              <div class="card-img-top"
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
                    <del class="text-muted">原價 {{ $filters.currency(item.origin_price) }} 元</del><br>
                    <strong class="text-danger">特價 {{ $filters.currency(item.price) }} 元</strong>
                  </span>
                </p>
                <div class="d-flex justify-content-between">
                  <button class="btn btn-sm btn-outline-secondary" @click="getProduct(item.id)">
                    查看更多
                  </button>
                  <button class="btn btn-sm btn-outline-danger" @click="addCart(item.id)"
                  :disabled="cartLoadingItem === item.id">
                    <div v-if="cartLoadingItem === item.id"
                      class="spinner-grow text-danger spinner-grow-sm" role="status">
                      <span class="visually-hidden">Loading...</span>
                    </div>
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
      </div>
    </div>
  </div>
</template>

<script>
import { useProductStore } from '@/stores/productStore'
import { useCartStore } from '@/stores/cartStore'
import { useStatusStore } from '@/stores/statusStore'
import { mapState, mapActions } from 'pinia'
export default {
  data () {
    return {
      /* product: {}, */
      selectedCategory: '', // 選擇的商品種類
      coupon_code: '',
      currentPage: 1, // 當前頁碼
      perPage: 9 // 每頁顯示幾筆
    }
  },
  computed: {
    ...mapState(useProductStore, ['products']),
    ...mapState(useCartStore, ['cart']),
    ...mapState(useStatusStore, ['isLoading', 'cartLoadingItem']),
    filteredProducts () { // 商品分類
      if (this.selectedCategory) {
        return this.products.filter(product => product.category === this.selectedCategory)
      }
      return this.products // 如果沒選分類，就顯示全部
    },
    paginatedProducts () { // 規劃出每頁要選染的商品
      const start = (this.currentPage - 1) * this.perPage
      const end = start + this.perPage
      return this.filteredProducts.slice(start, end)
    },
    totalPages () { // 計算總頁數
      return Math.ceil(this.filteredProducts.length / this.perPage)
    }
  },
  methods: {
    ...mapActions(useProductStore, ['getProducts']),
    ...mapActions(useCartStore, ['addCart', 'getCart']),
    getProduct (id) {
      this.$router.push(`/product/${id}`)
    }
  },
  created () {
    this.getProducts()
    this.getCart()
  }
}
</script>
