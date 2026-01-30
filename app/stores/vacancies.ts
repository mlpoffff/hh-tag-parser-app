import { defineStore } from 'pinia'
import axios from 'axios'

export const useVacanciesStore = defineStore('vacancies', {
  state: () => ({
    tags: null,
    loading: false
  }),

  actions: {
    async parse(query: string, lastPage: number) {
      this.loading = true
      this.tags = null
      try {
        const tags = await axios.get('http://localhost:3001/parse-vacancies', {
          params: {
            query: query,
            lastPage: lastPage
          }
        })
        this.tags = tags.data
      } catch (e) {
        console.error(e)
      } finally {
        this.loading = false
      }
    }
  }
})
