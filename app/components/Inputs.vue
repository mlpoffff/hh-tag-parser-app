<template>
  <div class="flex flex-col gap-3">
    <p class="text-lg">
      Параметры парсинга
    </p>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
      <div class="flex flex-col">
        <label for="">Название должности</label>
        <UInput
          v-model="query"
        />
      </div>
      <div class="flex flex-col">
        <label for="">Кол-во страниц парсинга</label>
        <UInputNumber
          v-model="pages"
          :min="1"
        />
      </div>
    </div>
    <UButton
      class="w-fit"
      label="Начать парсинг"
      :loading="vacancies.loading"
      :disabled="!query"
      loading-icon="i-lucide-loader"
      @click="fetchData"
    />
  </div>
</template>

<script setup lang="ts">
import { useVacanciesStore } from '~/stores/vacancies'

const vacancies = useVacanciesStore()

const pages = ref(5)
const query = ref('')

const fetchData = async () => {
  try {
    await vacancies.parse(query.value, pages.value)
  } catch (error) {
    console.log(error)
  }
}
</script>
