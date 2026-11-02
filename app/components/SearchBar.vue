<template>
    <div class="container width-full bg-orange-100 border-2 border-red-950 rounded-2xl" :id="id">
        <div class="container flex justify-between p-2 border-red-950 focus-within:bg-orange-200/10">
            <input type="search" name="recipeUrl"
                class="w-full h-100 bg-transparent text-xl placeholder-red-950 focus:outline-none"
                id="recipe-url-searchbar" :placeholder="placeholder" v-model="searchString" />
            <button v-if="searchString.length > 0" type="button" class="ml-2" @click="clearInput">
                X
            </button>
            <button type="button" id="searchbar-button" class="relative p-2">
                <img src="/icons/search.svg" class="absolute h-7 w-7" alt="Search icon" />
                <img src="/icons/cinnamon-roll.svg" class="absolute h-7 w-7" alt="Search icon" />
            </button>
        </div>
        <Transition name="expand">
            <div v-show="searchString.length > 0" class="results">
                <div class="overflow-hidden p-2">
                    <a href="" class="text-lg block" v-for="result in results">{{ result }}</a>
                    {{ !results ? 'No results found' : '' }}
                </div>
            </div>
        </Transition>
    </div>
    <slot />
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

defineProps<{ id?: string; placeholder?: string; results?: string[] }>();

const searchString = ref("");
const results = computed(() => { })

function clearInput(): void {
    searchString.value = "";
}
</script>

<style scoped>
.expand-enter-active,
.expand-leave-active {
    overflow: hidden;
    display: grid;
    transition: all 250ms ease-in-out;
}

.expand-enter-from,
.expand-leave-to {
    grid-template-rows: 0fr;
}

.expand-enter-to,
.expand-leave-from {
    grid-template-rows: 1fr;
}
</style>
