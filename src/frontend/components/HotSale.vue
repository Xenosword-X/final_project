<template>
    <h2 class="fw-bold mb-4 text-center title">熱門商品</h2>
    <div class="row g-4">
        <div class="col-md-4" v-for="product in filterProducts" :key="product.id">
            <!-- 這裡放商品卡片呈現 -->
            <div class="card h-100">
                <img :src="product.imageUrl" class="card-img-top" alt="..." />
                <div class="card-body">
                    <h5 class="card-title">{{ product.title }}</h5>
                    <p class="card-text text-danger fw-bold">${{ product.price }}</p>
                    <div class="mt-auto d-flex justify-content-end">
                        <button type="button" @click="getProduct(product.id)"
                        class="btn btn-outline-primary btn-sm">選購去</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { useProductStore } from '@/stores/productStore'
import { useStatusStore } from '@/stores/statusStore'
import { mapState, mapActions } from 'pinia'
export default {
  data () {
    return {
      filterProducts: []
    }
  },
  computed: {
    ...mapState(useProductStore, ['products']),
    ...mapState(useStatusStore, ['isLoading'])
  },
  methods: {
    ...mapActions(useProductStore, ['getProducts']),
    pickHotSaleProducts () {
      const shuffled = [...this.products].sort(() => 0.5 - Math.random())
      this.filterProducts = shuffled.slice(0, 3)
    },
    getProduct (id) {
      this.$router.push(`/product/${id}`)
    }
  },
  mounted () {
    this.getProducts().then(() => {
      this.pickHotSaleProducts()
    })
  }
}
</script>

<style lang="scss" scoped>
.title {
  @include custom-title-style
}
.card.h-100 {
  min-height: 500px;
}
.card-img-top {
  max-height: 400px;
  object-fit: cover;
  object-position: top;
}
</style>
