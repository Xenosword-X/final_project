<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <Loading :active="isLoading" />
  <div class="d-flex justify-content-between align-items-center my-4">
    <h2 class="h4 fw-bold mb-0">產品管理</h2>
    <button class="btn btn-primary d-flex align-items-center gap-1" @click="openModal(true)">
      <i class="bi bi-plus-circle"></i> 增加產品
    </button>
  </div>
  <div class="table-responsive">
    <table class="table table-hover align-middle text-nowrap">
      <thead class="table-light">
        <tr>
          <th width="120">分類</th>
          <th>產品名稱</th>
          <th width="120" class="text-start">原價</th>
          <th width="120" class="text-start">售價</th>
          <th width="100" class="text-center">狀態</th>
          <th width="200" class="text-center">操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in products" :key="item.id">
          <td>{{ item.category }}</td>
          <td>{{ item.title }}</td>
          <td class="text-start">{{ $filters.currency(item.origin_price) }}</td>
          <td class="text-start">{{ $filters.currency(item.price) }}</td>
          <td class="text-center">
            <span class="badge" :class="item.is_enabled ? 'bg-success' : 'bg-secondary'">
              {{ item.is_enabled ? '啟用' : '未啟用' }}
            </span>
          </td>
          <td class="text-center">
            <div class="btn-group">
              <button class="btn btn-outline-primary btn-sm" @click="openModal(false, item)">
                <i class="bi bi-pencil-square"></i> 編輯
              </button>
              <button class="btn btn-outline-danger btn-sm" @click="openDelProductModal(item)">
                <i class="bi bi-trash"></i> 刪除
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <pagination :pages="pagination" @emit-pages="getProducts" />
  <ProductModal ref="productModal" :product="tempProduct" :isNew="isNew"
    @update-product="updateProduct"
  />
  <DelModal :item="tempProduct" ref="delModal" @del-item="delProduct"/>
</template>

<script>
import ProductModal from '@/components/ProductModal.vue'
import DelModal from '@/components/DelModal.vue'
import Pagination from '@/components/Pagination.vue'
import ToastMessage from '@/mixins/ToastMessage'
export default {
  data () {
    return {
      products: [],
      pagination: {},
      tempProduct: {},
      isNew: false, /* 判斷資料是否為新增型態，預設為否 */
      isLoading: false /* 判斷網頁是否為讀取中，預設為否 */
    }
  },
  components: {
    // eslint-disable-next-line vue/no-unused-components
    ProductModal,
    DelModal,
    Pagination
  },
  methods: {
    getProducts (page = 1) {
      const api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/admin/products?page=${page}`
      this.isLoading = true /* 讀取時顯示Loading效果 */
      this.$http.get(api).then(res => {
        if (res.data.success) {
          this.isLoading = false /* 讀取完畢時關閉Loading效果 */
          console.log(res.data)
          this.products = res.data.products
          this.pagination = res.data.pagination
        }
      })
    },
    openModal (isNew, item) {
      if (isNew) {
        this.tempProduct = {}
      } else {
        this.tempProduct = { ...item }
      }
      this.isNew = isNew
      const productComponent = this.$refs.productModal
      productComponent.showModal()
    },
    updateProduct (item) {
      this.tempProduct = item
      /* 新增狀態 */
      let api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/admin/product`
      let httpMethod = 'post'
      /* 編輯狀態 */
      if (!this.isNew) {
        api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/admin/product/${item.id}`
        httpMethod = 'put'
      }
      const productComponent = this.$refs.productModal
      this.$http[httpMethod](api, { data: this.tempProduct })
        .then((res) => {
          console.log(res)
          productComponent.hideModal()
          if (res.data.success) {
            this.getProducts()
            this.showToast('success', '更新成功')
          } else {
            this.showToast('error', '更新失敗，請確認是否有欄位未填寫')
          }
        })
        .catch((err) => {
          this.showToast('error', '更新失敗，請確認是否有欄位未填寫')
          console.error('更新錯誤：', err)
        })
    },
    // 開啟刪除 ModalAdd commentMore actions
    openDelProductModal (item) {
      this.tempProduct = { ...item }
      const delComponent = this.$refs.delModal
      delComponent.showModal()
    },
    delProduct () {
      const url = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/admin/product/${this.tempProduct.id}`
      this.$http.delete(url).then((response) => {
        console.log(response.data)
        const delComponent = this.$refs.delModal
        delComponent.hideModal()
        this.getProducts()
      })
    }
  },
  created () {
    this.getProducts()
  },
  mixins: [ToastMessage]
}
</script>
