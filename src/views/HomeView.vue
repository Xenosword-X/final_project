<template>
  <Loading :active="isLoading" />
  <!-- banner區域 -->
  <div class="min-vh-100 position-relative">
    <div class="position-absolute w-100 h-100"
      :style="{
        backgroundImage: `url(${require('@/assets/header.jpg')})`,
        backgroundAttachment: 'fixed',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        zIndex: -1
      }"
    ></div>
    <div class="position-absolute top-50 start-50 translate-middle text-center text-light">
        <h1 class="display-1 fw-bold title">電玩領域</h1>
        <hr class="mb-1 mx-n3">
        <h2>歡迎光臨我們的商城</h2>
        <p>您想要的主機遊戲我們都有</p>
    </div>
  </div>
  <div class="main-section">
  <div class="container py-5">
    <!-- 最新公告區域 -->
    <div id="newsCarousel" class="carousel slide" data-bs-ride="carousel">
      <div class="carousel-inner">
        <h2 class="carousel-title text-center title mb-3">最新消息</h2>
        <!-- 每組包三張卡片 -->
        <div class="carousel-item" v-for="(group, groupIdx) in groupedArticles"
          :class="{ active: groupIdx === 0 }" :key="groupIdx"
        >
          <div class="row">
            <div class="col-12 col-md-4 mb-3 mb-md-0" v-for="(article) in group"
            :key="article.title">
              <div class="card h-100 mx-1">
                <img v-if="article.image" :src="article.image"
                  class="card-img-top" :alt="article.title"
                >
                <div class="card-body d-flex flex-column">
                  <h5 class="card-title">{{ article.title }}</h5>
                  <p class="card-text text-secondary small mb-1">
                    {{ formatDate(article.create_at) }}｜{{ article.author }}
                  </p>
                  <p class="card-text card-limit mb-2">{{ article.description }}</p>
                  <div>
                    <span class="badge bg-primary me-1" v-for="tag in article.tag" :key="tag">
                      {{ tag }}
                    </span>
                  </div>
                  <div class="mt-auto d-flex justify-content-end">
                    <button type="button" class="btn btn-outline-primary btn-sm"
                    @click="openModal(article)">
                      詳細資訊
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 輪播控制箭頭 -->
      <button class="carousel-control-prev" type="button" data-bs-target="#newsCarousel" data-bs-slide="prev">
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">上一則</span>
      </button>
      <button class="carousel-control-next" type="button" data-bs-target="#newsCarousel" data-bs-slide="next">
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="visually-hidden">下一則</span>
      </button>
    </div>
    <!-- 輪播區域 -->
    <div id="carouselExampleCaptions" class="carousel slide carousel-fade mt-5" data-bs-ride="carousel">
      <div class="carousel-inner">
        <h2 class="carousel-title text-center title mb-3">我們的服務</h2>
        <div class="carousel-item active" data-bs-interval="3000">
          <img src="../assets/Carousel1.jpg" class="d-block w-100" alt="遊戲商城">
          <div class="carousel-caption p-3 rounded">
            <h5>遊戲商城</h5>
            <p>各式各樣的遊戲主機與軟體我們都有</p>
          </div>
        </div>
        <div class="carousel-item" data-bs-interval="3000">
          <img src="../assets/Carousel2.png" class="d-block w-100" alt="客製服務">
          <div class="carousel-caption p-3 rounded">
            <h5>客製服務</h5>
            <p>想要讓主機能更加繽紛嗎?我們為您打造專屬的外觀</p>
          </div>
        </div>
        <div class="carousel-item" data-bs-interval="3000">
          <img src="../assets/Carousel3.png" class="d-block w-100" alt="抽獎活動">
          <div class="carousel-caption p-3 rounded">
            <h5>抽獎活動</h5>
            <p>我們不定期舉辦抽獎活動，答對8題以上者即可獲得抽獎資格</p>
          </div>
        </div>
      </div>
      <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="prev">
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Previous</span>
      </button>
      <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="next">
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Next</span>
      </button>
    </div>
  </div>
  </div>
  <NewsModal ref="newsmodal" :article="article" :is-loading="isLoading"/>
</template>

<script>
import NewsModal from '@/components/NewsModal.vue'
export default {
  name: 'HomeView',
  data () {
    return {
      articles: [],
      article: {},
      isLoading: false
    }
  },
  components: {
    NewsModal
  },
  computed: {
    groupedArticles () {
      const groupSize = window.innerWidth < 768 ? 1 : 3
      const groups = []
      for (let i = 0; i < this.articles.length; i += groupSize) {
        groups.push(this.articles.slice(i, i + groupSize))
      }
      return groups
    }
  },
  methods: {
    getArticles () {
      const api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/articles`
      this.$http.get(api)
        .then(res => {
          this.articles = res.data.articles
        })
    },
    getArticle (item) {
      this.isLoading = true
      const api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/article/${item.id}`
      this.$http.get(api)
        .then(res => {
          this.article = res.data.article
          this.isLoading = false
        })
    },
    formatDate (ts) {
      const date = new Date(Number(ts))
      return date.toLocaleDateString('zh-TW', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      })
    },
    openModal (article) {
      this.getArticle(article)
      const newsComponent = this.$refs.newsmodal
      newsComponent.showModal()
    }
  },
  mounted () {
    this.getArticles()
  }
}
</script>

<style lang="scss" scoped>
// 縮小輪播間距，不穰卡片按鈕被擋住
.carousel-control-prev,
.carousel-control-next {
  width: 3rem;
}
.carousel-caption {
  background-color: rgba(0, 0, 0, 0.5);
  /* 避免文字太靠邊 */
  max-width: 50%;
  margin: 0 auto;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.7);
}
.carousel-item .card {
  min-width: 0; /* 保持響應式，避免溢出 */
}
//卡片內容進行限制，讓樣式統一
.card-limit {
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  max-height: 3.2em;
  white-space: normal;
}
.card.h-100 {
  min-height: 400px;
}
.card-img-top {
  max-height: 200px;
  object-fit: cover;
}
.title{
  @include custom-title-style
}
.main-section{
  @include background-color
}
</style>
