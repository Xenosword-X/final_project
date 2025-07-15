import { defineStore } from 'pinia'
import axios from 'axios'
import { showToast } from '@/methods/Toast'
import { useStatusStore } from './statusStore'

export const useCartStore = defineStore('cartStore', {
  state: () => {
    return {
      cart: {
        carts: []
      }
    }
  },
  actions: {
    addCart (id) {
      const status = useStatusStore()
      const api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/cart`
      status.cartLoadingItem = id
      const cart = {
        product_id: id,
        qty: 1
      }
      axios.post(api, { data: cart })
        .then(res => {
          status.cartLoadingItem = ''
          showToast('success', '已加入購物車')
          this.getCart()
          console.log(res)
        })
        .catch(err => {
          showToast('error', '商品已無庫存')
          console.log(err)
        })
    },
    updateCart (item) { // 更新購物車商品數量
      const status = useStatusStore()
      const api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/cart/${item.id}`
      status.isLoading = true
      status.cartLoadingItem = item.id
      const cart = {
        product_id: item.product_id,
        qty: item.qty
      }
      axios.put(api, { data: cart })
        .then(res => {
          console.log(res)
          status.cartLoadingItem = ''
          status.isLoading = false
          this.getCart()
        })
    },
    delCartItem (id) {
      const status = useStatusStore()
      const api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/cart/${id}`
      status.isLoading = true
      status.cartLoadingItem = id
      axios.delete(api, id)
        .then(res => {
          console.log(res)
          showToast('success', '商品已刪除')
          status.cartLoadingItem = ''
          this.getCart()
          status.isLoading = false
        })
    },
    delAllCart () {
      const status = useStatusStore()
      const api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/carts`
      status.isLoading = true
      axios.delete(api)
        .then(res => {
          console.log(res)
          showToast('success', '已清空購物車')
          this.getCart()
          status.isLoading = false
        })
    },
    addCouponCode (code) {
      const status = useStatusStore()
      const api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/coupon`
      const coupon = { code: code }
      status.isLoading = true
      axios.post(api, { data: coupon })
        .then(res => {
          console.log(res)
          showToast('success', '已成功加入優惠券')
          this.getCart()
          this.coupon_code = ''
          status.isLoading = false
        })
        .catch((err) => {
          console.log(err)
          status.isLoading = false
          showToast('error', '該優惠券不存在')
        })
    },
    getCart () {
      const status = useStatusStore()
      const api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/cart`
      status.isLoading = true
      axios.get(api).then((res) => {
        console.log(res)
        this.cart = res.data.data
        status.isLoading = false
      })
    }
  }
})
