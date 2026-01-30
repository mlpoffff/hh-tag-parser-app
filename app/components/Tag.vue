<template>
  <UTooltip text="Скопировать содержимое">
    <div class="flex bg-gray-100 px-2 py-1 w-fit rounded-xl">
      <p>{{ tag }} ({{ count }})</p>
    </div>
  </UTooltip>
</template>

<script setup lang="ts">
defineProps({
  tag: {
    required: true,
    type: String
  },
  count: {
    required: true,
    type: Number
  }
})
</script>
