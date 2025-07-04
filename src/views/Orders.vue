<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <Loading :active="isLoading" />

  <h2 class="h4 fw-bold mt-4 mb-3">訂單管理</h2>

  <div class="table-responsive">
    <table class="table table-hover align-middle text-nowrap">
      <thead class="table-light">
        <tr>
          <th>購買時間</th>
          <th>Email</th>
          <th>購買項目</th>
          <th class="text-end">應付金額</th>
          <th class="text-center">付款狀態</th>
          <th class="text-center">操作</th>
        </tr>
      </thead>
      <tbody v-if="orders.length">
        <tr v-for="(item, key) in orders" :key="key" :class="{ 'text-muted': !item.is_paid }">
          <td>{{ formatDate(item.create_at) }}</td>
          <td>{{ item.user?.email || '無資料' }}</td>
          <td>
            <ul class="list-unstyled mb-0">
              <li v-for="(product, i) in item.products" :key="i">
                {{ product.product.title }} × {{ product.qty }} {{ product.product.unit }}
              </li>
            </ul>
          </td>
          <td class="text-end">{{ $filters.currency(item.total) }}</td>
          <td class="text-center">
            <div class="d-flex flex-column align-items-center">
              <span
                class="badge mb-1"
                :class="item.is_paid ? 'bg-success' : 'bg-secondary'">
                {{ item.is_paid ? '已付款' : '未付款' }}
              </span>
              <div class="form-check form-switch">
                <input
                  class="form-check-input"
                  type="checkbox"
                  :id="`paidSwitch${item.id}`"
                  v-model="item.is_paid"
                  @change="updatePaid(item)"
                />
              </div>
            </div>
          </td>
          <td class="text-center">
            <div class="btn-group">
              <button class="btn btn-outline-primary btn-sm" @click="openModal(item)">
                <i class="bi bi-eye"></i> 檢視
              </button>
              <button class="btn btn-outline-danger btn-sm" @click="openDelOrderModal(item)">
                <i class="bi bi-trash"></i> 刪除
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <OrderModal :order="tempOrder" ref="orderModal" @update-paid="updatePaid"/>
  <DelModal :item="tempOrder" ref="delModal" @del-item="delOrder"/>
  <Pagination :pages="pagination" @emit-pages="getOrders"/>
</template>

<script>
import DelModal from '@/components/DelModal.vue'
import OrderModal from '@/components/OrderModal.vue'
import Pagination from '@/components/Pagination.vue'
export default {
  data () {
    return {
      orders: [],
      pagination: {},
      isLoading: false,
      tempOrder: {}
    }
  },
  components: {
    DelModal,
    OrderModal,
    Pagination
  },
  methods: {
    getOrders (page = 1) {
      const api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/admin/orders?page=${page}`
      this.isLoading = true
      this.$http.get(api)
        .then(res => {
          if (res.data.success) {
            this.isLoading = false
            this.orders = res.data.orders
            this.pagination = res.data.pagination
          }
        })
    },
    openModal (item) {
      this.tempOrder = { ...item }
      const orderComponent = this.$refs.orderModal
      orderComponent.showModal()
    },
    openDelOrderModal (item) {
      this.tempProduct = { ...item }
      const delComponent = this.$refs.delModal
      delComponent.showModal()
    },
    updatePaid (item) {
      this.isLoading = true
      const api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/admin/order/${item.id}`
      const paid = {
        is_paid: item.is_paid
      }
      this.$http.put(api, { data: paid })
        .then(res => {
          this.isLoading = false
          this.getOrders()
        })
    },
    delOrder () {
      const api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/admin/order/${this.tempOrder.id}`
      this.$http.delete(api)
        .then(res => {
          const delComponent = this.$refs.delModal
          delComponent.hideModal()
          this.getOrders()
        })
    },
    formatDate (timestamp) {
      const num = Number(timestamp)
      if (!num || isNaN(num)) {
        return '無效時間'
      }
      const date = new Date(num * 1000)
      return date.toISOString().split('T')[0]
    }
  },
  created () {
    this.getOrders()
  }
}
</script>
