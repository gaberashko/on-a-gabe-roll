<template>
  <SearchBar placeholder="Enter a recipe URL:" />
</template>

<script setup lang="ts">
useHead({
  title: 'On A Gabe Roll',
  htmlAttrs: {
    lang: 'en'
  },
  bodyAttrs: {
    class: 'bg-orange-200'
  },
  link: [
    {
      rel: 'icon',
      href: '/favicon.ico'
    }
  ]
})
</script>
