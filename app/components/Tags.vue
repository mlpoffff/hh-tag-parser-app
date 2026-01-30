<template>
  <div
    class="flex flex-col gap-3"
  >
    <p class="text-lg">
      Теги
    </p>
    <div class="flex flex-wrap gap-2 overflow-y-auto h-96 max-h-96">
      <Tag
        v-for="(count, tagName) in vacancies.tags"
        :key="tagName"
        :tag="String(tagName)"
        :count="count"
        class="cursor-copy"
        @click="copyToClipboard(String(tagName))"
      />
      <div
        v-if="!vacancies.tags"
        class="flex items-center justify-center w-full select-none"
      >
        <Loader
          v-if="vacancies.loading"
        />
        <p
          v-else
          class="text-2xl opacity-35"
        >
          Нет доступных тегов
        </p>
      </div>
    </div>
    <UButton
      class="w-fit"
      :class="!vacancies.tags ? 'opacity-0' : 'opacity-100'"
      label="Экспорт"
      icon="i-lucide-download"
      @click="saveToExcel(vacancies.tags)"
    />
  </div>
</template>

<script setup lang="ts">
import { useVacanciesStore } from '~/stores/vacancies'
import { useToastStore } from '~/stores/toast'
import { saveToExcel } from '~/composables/excel'

const toast = useToastStore()

const vacancies = useVacanciesStore()

const copyToClipboard = async (text: string) => {
  try {
    await window.navigator.clipboard.writeText(text)
    toast.addSuccess('Успех!', 'Тег был скопирован')
  } catch (e) {
    console.error(e)
  }
}
</script>
