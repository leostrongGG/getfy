<template>
    <div class="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
        <h2 class="text-lg font-semibold text-zinc-900 dark:text-white">Plugin Starter</h2>
        <p class="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            UI carregada do bundle <code class="text-xs">dist/plugin-ui.js</code> (sem rebuild do core).
        </p>
    </div>
</template>

<script setup>
defineProps({
    settings: { type: Object, default: () => ({}) },
});
</script>
