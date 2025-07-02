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
                    <del class="text-muted">原價 {{ $filters.currency(item.origin_price) }} 元</del><br>
                    <strong class="text-danger">特價 {{ $filters.currency(item.price) }} 元</strong>
                  </span><br />
                  <span>
                    <template v-if="item.num < 5">
                      ⚠️ 庫存僅剩 {{ item.num }} 個，欲購從速！
                    </template>
                    <template v-else-if="item.num >= 10">
                      ✅ 庫存充足（>=10）
                    </template>
                    <template v-else>
                      庫存 (>=5)
                    </template>
                  </span>
                </p>
                <div class="d-flex justify-content-between">
                  <button class="btn btn-sm btn-outline-secondary" @click="getProduct(item.id)">
                    查看更多
                  </button>
                  <button class="btn btn-sm btn-outline-danger" @click="addCart(item.id)"
                  :disabled="this.status.loadingItem === item.id">
                    <div v-if="this.status.loadingItem === item.id"
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
                          :disabled="status.loadingItem === item.id"
                          @click="removeCartItem(item.id)">
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
                    <input type="number" class="form-control"
                          v-model.number="item.qty">
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
              <td colspan="3" class="text-end">總計</td>
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
              <button class="btn btn-outline-secondary" type="button" @click="addCouponCode">
                套用優惠碼
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ToastMessage from '@/mixins/ToastMessage'
export default {
  data () {
    return {
      products: [],
      product: {},
      selectedCategory: '', // 選擇的商品種類
      status: {
        loadingItem: '' // 對應品項id
      },
      cart: {},
      coupon_code: '',
      currentPage: 1, // 當前頁碼
      perPage: 9 // 每頁顯示幾筆
    }
  },
  computed: {
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
    },
    addCart (id) {
      const api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/cart`
      this.status.loadingItem = id
      const cart = {
        product_id: id,
        qty: 1
      }
      this.$http.post(api, { data: cart })
        .then(res => {
          this.status.loadingItem = ''
          this.showToast('success', '已加入購物車')
          this.getCart()
          console.log(res)
        })
        .catch(err => {
          this.showToast('error', '商品已無庫存')
          console.log(err)
        })
    },
    getCart () {
      const api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/cart`
      this.isLoading = true
      this.$http.get(api).then((res) => {
        console.log(res)
        this.cart = res.data.data
        this.isLoading = false
      })
    }
  },
  created () {
    this.getProducts()
    this.getCart()
  },
  mixins: [ToastMessage]
}
</script>
