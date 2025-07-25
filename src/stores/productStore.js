import axios from 'axios'
import { defineStore } from 'pinia'
import { useStatusStore } from './statusStore'

export const useProductStore = defineStore('productStore', {
  state: () => {
    return {
      products: []
    }
  },
  actions: {
    getProducts () {
      const status = useStatusStore()
      const api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/products/all`
      status.isLoading = true
      return axios.get(api)
        .then(res => {
          this.products = res.data.products
          status.isLoading = false
        })
        .catch((err) => {
          console.error('API 錯誤：', err)
          this.showToast('error', '資料載入失敗')
        })
    }
  }
})
