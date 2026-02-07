import express from 'express'
import axios from 'axios'
import { load } from 'cheerio'

export function createExpressApp() {
  const app = express()

  app.use(express.json())

  const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9'
  }

  const parseVacancy = async (url) => {
    try {
      const response = await axios.get(url, {
        headers: headers
      })

      const $ = load(response.data)

      const tags = $('li[data-qa]')
        .map((_, li) => $(li).text().trim())
        .get()

      return tags
    } catch (e) {
      console.error(e.message)
    }
  }

  app.get('/parse-vacancies', async (req, res) => {
    const query = req.query.query || 'Простофиля'
    const lastPage = parseInt(req.query.lastPage) || 5

    try {
      const allTags = []
      for (let page = 0; page <= lastPage; page++) {
        const targetUrl = `https://hh.ru/search/vacancy?text=${query}&page=${page}`
        const response = await axios.get(targetUrl, { headers: headers })

        const $ = load(response.data)

        const vacancies = $('a[data-qa="serp-item__title"]')
          .map((_, el) => ({
            title: $(el).text().trim(),
            link: $(el).attr('href')
          }))
          .get()

        const results = await Promise.all(
          vacancies.map(v => parseVacancy(v.link))
        )

        allTags.push(...results.flat())
      }

      const counter = allTags.reduce((acc, tag) => {
        acc[tag] = (acc[tag] || 0) + 1
        return acc
      }, {})

      const sorted = Object.entries(counter)
        .sort((a, b) => b[1] - a[1])

      res.json(Object.fromEntries(sorted))
    } catch (e) {
      res.status(500).send(e.message)
    }
  })

  return app
}
