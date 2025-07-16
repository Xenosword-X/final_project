import { defineStore } from 'pinia'

export const useStatusStore = defineStore('status', {
  state: () => {
    return {
      isLoading: false,
      cartLoadingItem: ''
    }
  },
  actions: {

  }
})
