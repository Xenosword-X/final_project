<template>
  <div>
    <!-- 浮動購物車按鈕 -->
    <button
      class="floating-cart-btn"
      type="button"
      data-bs-toggle="offcanvas"
      data-bs-target="#cartOffcanvas"
      aria-controls="cartOffcanvas"
    >
      <i class="bi bi-cart3 fs-3"></i>
      <span class="badge cart-badge bg-danger">{{ cart.carts?.length || 0 }}</span>
    </button>

    <!-- Offcanvas 購物車 -->
    <div
      class="offcanvas offcanvas-end"
      tabindex="-1"
      id="cartOffcanvas"
      aria-labelledby="cartOffcanvasLabel"
      style="width: 400px;"
    >
      <div class="offcanvas-header">
        <h5 class="offcanvas-title" id="cartOffcanvasLabel">購物車 <i class="bi bi-cart"></i></h5>
        <button
          type="button"
          class="btn-close"
          data-bs-dismiss="offcanvas"
          aria-label="Close"
        ></button>
      </div>
      <div class="offcanvas-body">
        <!-- 你可以放購物車清單、結帳按鈕等等 -->
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
                @click="delAllCart()">
                <i class="bi bi-trash me-1"></i> 清空購物車</button>
              </td>
              <td :colspan="cart.carts && cart.carts.length ? 2 : 3" class="text-end">總計</td>
              <td class="text-end">{{ $filters.currency(cart.total) }}</td>
            </tr>
            <tr v-if="cart.final_total !== cart.total">
              <td colspan="3" class="text-end text-success fw-bold">折扣價</td>
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
            <button class="btn btn-primary" type="button" @click="cartSubmit">填寫寄送資料</button>
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
      coupon_code: ''
    }
  },
  name: 'FloatingCart',
  computed: {
    ...mapState(useCartStore, ['cart']),
    ...mapState(useStatusStore, ['isLoading', 'cartLoadingItem'])
  },
  methods: {
    ...mapActions(useCartStore, ['addCart', 'updateCart', 'delCartItem', 'delAllCart', 'addCouponCode', 'getCart']),
    applyCoupon () {
      this.addCouponCode(this.coupon_code)
    },
    cartSubmit () {
      if (!this.cart.final_total) { // 判斷購物車金額為零代表無商品
        this.showToast('error', '購物車無商品')
      } else {
        this.$router.push('/user/form')
      }
    }
  },
  mounted () {
    this.getCart()
  }
}
</script>

<style scoped>
/* 購物車按鈕樣式 */
.floating-cart-btn {
  position: fixed;
  right: 32px;
  bottom: 32px;
  z-index: 1055;
  background: #fff;
  border-radius: 50%;
  box-shadow: 0 4px 12px rgba(0,0,0,0.12);
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
}

/* Badge 樣式 */
.cart-badge {
  position: absolute;
  bottom: 2px;
  right: 2px;
  transform: translate(20%, 20%);
  font-size: 0.7rem;
  padding: 4px 6px;
  border-radius: 50%;
}
/* 購物車表格微調 */
.offcanvas .table th,
.offcanvas .table td {
  vertical-align: middle;
}

/* 輸入框寬度統一 */
.input-group input[type="number"] {
  max-width: 60px;
}

</style>
