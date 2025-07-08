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
                          v-model.number="item.qty" :disabled="item.id === status.loadingItem">
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
              <button class="btn btn-outline-secondary" type="button" @click="addCouponCode">
                套用優惠碼
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 結帳表單 -->
    <div class="my-5 row justify-content-center">
      <Form class="col-md-6" v-slot="{ errors }"
            @submit="createOrder">
        <div class="mb-3">
          <label for="email" class="form-label">Email</label>
          <Field id="email" name="email" type="email" class="form-control"
                   :class="{ 'is-invalid': errors['email'] }"
                   placeholder="請輸入 Email" rules="email|required"
                   v-model="form.user.email"></Field>
          <ErrorMessage name="email" class="invalid-feedback"></ErrorMessage>
        </div>

        <div class="mb-3">
          <label for="name" class="form-label">收件人姓名</label>
          <Field id="name" name="姓名" type="text" class="form-control"
                   :class="{ 'is-invalid': errors['姓名'] }"
                   placeholder="請輸入姓名" rules="required"
                   v-model="form.user.name"></Field>
          <ErrorMessage name="姓名" class="invalid-feedback"></ErrorMessage>
        </div>

        <div class="mb-3">
          <label for="tel" class="form-label">收件人電話</label>
          <Field id="tel" name="電話" type="tel" class="form-control"
                   :class="{ 'is-invalid': errors['電話'] }"
                   placeholder="請輸入電話" rules="required"
                   v-model="form.user.tel"></Field>
          <ErrorMessage name="電話" class="invalid-feedback"></ErrorMessage>
        </div>

        <div class="mb-3">
          <label for="address" class="form-label">收件人地址</label>
          <Field id="address" name="地址" type="text" class="form-control"
                   :class="{ 'is-invalid': errors['地址'] }"
                   placeholder="請輸入地址" rules="required"
                   v-model="form.user.address"></Field>
          <ErrorMessage name="地址" class="invalid-feedback"></ErrorMessage>
        </div>

        <div class="mb-3">
          <label for="message" class="form-label">留言</label>
          <textarea name="" id="message" class="form-control" cols="30" rows="10"
                    v-model="form.message"></textarea>
        </div>
        <div class="text-end">
          <button class="btn btn-danger">送出訂單</button>
        </div>
      </Form>
    </div>
  </div>
</template>

<script>
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
      perPage: 9, // 每頁顯示幾筆
      // 表單元件
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
    updateCart (item) { // 更新購物車商品數量
      const api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/cart/${item.id}`
      this.isLoading = true
      this.status.loadingItem = item.id
      const cart = {
        product_id: item.product_id,
        qty: item.qty
      }
      this.$http.put(api, { data: cart })
        .then(res => {
          console.log(res)
          this.status.loadingItem = ''
          this.isLoading = false
          this.getCart()
        })
    },
    delCartItem (id) {
      const api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/cart/${id}`
      this.isLoading = true
      this.status.loadingItem = id
      this.$http.delete(api, id)
        .then(res => {
          console.log(res)
          this.showToast('success', '商品已刪除')
          this.status.loadingItem = ''
          this.getCart()
          this.isLoading = false
        })
    },
    delAllCart () {
      const api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/carts`
      this.isLoading = true
      this.$http.delete(api)
        .then(res => {
          console.log(res)
          this.showToast('success', '已清空購物車')
          this.getCart()
          this.isLoading = false
        })
    },
    addCouponCode () {
      const api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/coupon`
      const coupon = { code: this.coupon_code }
      this.isLoading = true
      this.$http.post(api, { data: coupon })
        .then(res => {
          console.log(res)
          this.showToast('success', '已成功加入優惠券')
          this.getCart()
          this.isLoading = false
        })
        .catch((err) => {
          console.log(err)
          this.showToast('error', '該優惠券不存在')
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
    },
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
    this.getProducts()
    this.getCart()
  }
}
</script>
