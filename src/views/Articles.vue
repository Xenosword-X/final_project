<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <Loading :active="isLoading" />
  <div class="d-flex justify-content-between align-items-center my-4">
    <h2 class="h4 fw-bold mb-0">消息更新</h2>
    <button class="btn btn-primary d-flex align-items-center gap-1" @click="openModal(true)">
      <i class="bi bi-plus-circle"></i> 新增消息
    </button>
  </div>
  <div class="table-responsive">
    <table class="table table-hover align-middle text-nowrap">
  <thead class="table-light">
    <tr>
      <th>標題</th>
      <th width="120">作者</th>
      <th width="160">標籤</th>
      <th width="160">建立時間</th>
      <th width="100" class="text-center">狀態</th>
      <th width="200" class="text-center">操作</th>
    </tr>
  </thead>
  <tbody>
    <tr v-for="item in articles" :key="item.id">
      <td>{{ item.title }}</td>
      <td>{{ item.author }}</td>
      <td>
        <span v-for="t in item.tag" :key="t" class="badge bg-info me-1">{{ t }}</span>
      </td>
      <td>{{ new Date(item.create_at).toLocaleString() }}</td>
      <td class="text-center">
        <span class="badge" :class="item.isPublic ? 'bg-success' : 'bg-secondary'">
          {{ item.isPublic ? '已發布' : '未發布' }}
        </span>
      </td>
      <td class="text-center">
        <div class="btn-group">
          <button class="btn btn-outline-primary btn-sm" @click="openModal(false, item)">
            <i class="bi bi-pencil-square"></i> 編輯
          </button>
          <button class="btn btn-outline-danger btn-sm" @click="openDelArticleModal(item)">
            <i class="bi bi-trash"></i> 刪除
          </button>
        </div>
      </td>
    </tr>
  </tbody>
</table>
  </div>
  <pagination :pages="pagination" @emit-pages="getArticles" />
  <ArticleModal ref="articleModal" :article="tempArticle" :isNew="isNew"
    @update-article="updateArticle"
  />
  <DelModal :item="tempArticle" ref="delModal" @del-item="delArticle"/>
</template>

<script>
import ArticleModal from '@/components/ArticleModal.vue'
import DelModal from '@/components/DelModal.vue'
import Pagination from '@/components/Pagination.vue'
export default {
  data () {
    return {
      articles: [],
      pagination: {},
      tempArticle: {},
      isNew: false, /* 判斷資料是否為新增型態，預設為否 */
      isLoading: false /* 判斷網頁是否為讀取中，預設為否 */
    }
  },
  components: {
    // eslint-disable-next-line vue/no-unused-components
    ArticleModal,
    DelModal,
    Pagination
  },
  methods: {
    getArticles (page = 1) {
      const api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/admin/articles?page=${page}`
      this.isLoading = true /* 讀取時顯示Loading效果 */
      this.$http.get(api).then(res => {
        if (res.data.success) {
          this.isLoading = false /* 讀取完畢時關閉Loading效果 */
          console.log(res.data)
          this.articles = res.data.articles
          this.pagination = res.data.pagination
        }
      })
    },
    openModal (isNew, item) {
      if (isNew) {
        this.tempArticle = {
          title: '',
          author: '',
          image: '',
          tag: [],
          description: '',
          content: '',
          isPublic: false,
          create_at: Date.now()
        }
      } else {
        this.tempArticle = { ...item }
      }
      this.isNew = isNew
      const articleComponent = this.$refs.articleModal
      articleComponent.showModal()
    },
    updateArticle (item) {
      this.tempArticle = item
      /* 新增狀態 */
      let api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/admin/article`
      let httpMethod = 'post'
      /* 編輯狀態 */
      if (!this.isNew) {
        api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/admin/article/${item.id}`
        httpMethod = 'put'
      }
      const articleComponent = this.$refs.articleModal
      this.$http[httpMethod](api, { data: this.tempArticle })
        .then((res) => {
          console.log(res)
          articleComponent.hideModal()
          if (res.data.success) {
            this.getArticles()
            this.showToast('success', '更新成功')
          } else {
            this.showToast('error', '更新失敗，請確認是否有欄位未填寫')
          }
        })
        .catch((err) => {
          this.showToast('error', '更新失敗，請確認是否有欄位未填寫')
          console.error('更新錯誤：', err.message)
        })
    },
    openDelArticleModal (item) {
      this.tempArticle = { ...item }
      const delComponent = this.$refs.delModal
      delComponent.showModal()
    },
    delArticle () {
      const url = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/admin/article/${this.tempArticle.id}`
      this.$http.delete(url).then((res) => {
        console.log(res.data)
        const delComponent = this.$refs.delModal
        delComponent.hideModal()
        this.getArticles()
      })
    }
  },
  created () {
    this.getArticles()
  }
}
</script>
