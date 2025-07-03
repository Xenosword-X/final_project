/* eslint-disable vue/multi-word-component-names */
import { createApp } from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import Loading from 'vue3-loading-overlay' // 導入loading元件
import 'vue3-loading-overlay/dist/vue3-loading-overlay.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
// 導入表單驗證
import {
  Form, Field, ErrorMessage, defineRule, configure
} from 'vee-validate'
import * as AllRules from '@vee-validate/rules'
import { localize, setLocale } from '@vee-validate/i18n'
import zhTW from '@vee-validate/i18n/dist/locale/zh_TW.json'

import App from './App.vue'
import router from './router'
import { currency } from './methods/filter'

const app = createApp(App)
app.config.globalProperties.$filters = {
  currency
}

Object.entries(AllRules).forEach(([ruleName, ruleFn]) => {
  if (typeof ruleFn === 'function') {
    defineRule(ruleName, ruleFn)
  }
})
configure({
  generateMessage: localize({ zh_TW: zhTW }), // 載入繁體中文語系
  validateOnInput: true // 當輸入任何內容直接進行驗證
})
// 設定預設語系
setLocale('zh_TW')

app.use(VueAxios, axios)
app.use(router)
// eslint-disable-next-line vue/multi-word-component-names
app.component('Loading', Loading)
app.component('Form', Form)
app.component('Field', Field)
app.component('ErrorMessage', ErrorMessage)
app.mount('#app')
