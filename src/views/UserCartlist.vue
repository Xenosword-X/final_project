<template>
  <Loading :active="isLoading"></Loading>
  <div class="container">
    <div class="row mt-4">
      <div class="col-md-8">
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
      <!-- 購物車列表 -->
      <div class="col-md-4">
        <div class="sticky-top">
          <table class="table align-middle">
            <thead>
              <tr>
                <th></th>
                <th>品名</th>
                <th style="width: 110px">數量</th>
                <th>單價</th>
              </tr>
            </thead>
            <tbody>
            <template v-if="cart.carts">
              <tr v-for="item in cart.carts" :key="item.id">
                <td>
                  <button type="button" class="btn btn-outline-danger btn-sm"
                          :disabled="cartLoadingItem === item.id"
                          @click="delCartItem(item.id)">
                    <i class="bi bi-x"></i>
                  </button>
                </td>
                <td>
                  {{ item.product.title }}
                  <div class="text-success" v-if="item.coupon">
                    已套用優惠券
                  </div>
                </td>
                <td>
                  <div class="input-group input-group-sm">
                    <input type="number" class="form-control" min="1" @change="updateCart(item)"
                          v-model.number="item.qty" :disabled="item.id === cartLoadingItem">
                    <div class="input-group-text">/ {{ item.product.unit }}</div>
                  </div>
                </td>
                <td class="text-end">
                  <small v-if="cart.final_total !== cart.total" class="text-success">折扣價：</small>
                  {{ $filters.currency(item.final_total) }}
                </td>
              </tr>
            </template>
            </tbody>
            <tfoot>
            <tr>
              <td v-if="cart.carts && cart.carts.length" class="text-start">
                <button class="btn btn-outline-danger text-nowrap" type="button"
                @click="delAllCart()">清空購物車</button>
              </td>
              <td :colspan="cart.carts && cart.carts.length ? 2 : 3" class="text-end">總計</td>
              <td class="text-end">{{ $filters.currency(cart.total) }}</td>
            </tr>
            <tr v-if="cart.final_total !== cart.total">
              <td colspan="3" class="text-end text-success">折扣價</td>
              <td class="text-end text-success">{{ $filters.currency(cart.final_total) }}</td>
            </tr>
            </tfoot>
          </table>
          <div class="input-group mb-3 input-group-sm">
            <input type="text" class="form-control" v-model="coupon_code" placeholder="請輸入優惠碼">
            <div class="input-group-append">
              <button class="btn btn-outline-secondary" type="button" @click="applyCoupon">
                套用優惠碼
              </button>
            </div>
          </div>
          <div class="text-end">
            <button class="btn btn-outline-primary" type="button" @click="cartSubmit">填寫寄送資料</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import productStore from '@/stores/productStore'
import cartStore from '@/stores/cartStore'
import statusStore from '@/stores/statusStore'
import { mapState, mapActions } from 'pinia'
export default {
  data () {
    return {
      product: {},
      selectedCategory: '', // 選擇的商品種類
      coupon_code: '',
      currentPage: 1, // 當前頁碼
      perPage: 9 // 每頁顯示幾筆
    }
  },
  computed: {
    ...mapState(productStore, ['products']),
    ...mapState(cartStore, ['cart']),
    ...mapState(statusStore, ['isLoading', 'cartLoadingItem']),
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
    ...mapActions(productStore, ['getProducts']),
    ...mapActions(cartStore, ['addCart', 'updateCart', 'delCartItem', 'delAllCart', 'addCouponCode', 'getCart']),
    getProduct (id) {
      this.$router.push(`/user/product/${id}`)
    },
    applyCoupon () {
      cartStore().addCouponCode(this.coupon_code)
    },
    cartSubmit () {
      if (!this.cart.final_total) { // 判斷購物車金額為零代表無商品
        this.showToast('error', '購物車無商品')
      } else {
        this.$router.push('/user/form')
      }
    }
  },
  created () {
    this.getProducts()
    this.getCart()
  }
}
</script>
