<template>
    <div class="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
        <h1 class="text-xl font-semibold text-zinc-900 dark:text-white">Dashboard do plugin</h1>
        <p class="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Página carregada via <code class="text-xs">frontend.pages</code> e bundle <code class="text-xs">dist/</code>.
        </p>
        <p v-if="pluginSlug" class="mt-4 text-xs text-zinc-500">Plugin: {{ pluginSlug }}</p>
    </div>
</template>

<script setup>
defineProps({
    pluginSlug: { type: String, default: '' },
    pluginPage: { type: String, default: '' },
});
</script>
