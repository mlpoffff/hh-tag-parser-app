import { defineStore } from 'pinia'

export const useVacanciesStore = defineStore('vacancies', {
  state: () => ({
    tags: null,
    loading: false
  }),

  actions: {
    async parse(query: string, lastPage: number) {
      this.loading = true
      this.tags = null
      console.error(query)
      try {
        const tags = await $fetch('/api/parse-vacancies', {
          query: {
            query,
            lastPage
          }
        })
        this.tags = tags
      } catch (e) {
        console.error(e)
      } finally {
        this.loading = false
      }
    }
  }
})
