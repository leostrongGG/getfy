<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue';

const props = defineProps({
    siteKey: { type: String, required: true },
    modelValue: { type: String, default: '' },
});

const emit = defineEmits(['update:modelValue']);

const containerRef = ref(null);
let widgetId = null;
let scriptLoading = null;

function loadTurnstileScript() {
    if (typeof window === 'undefined') return Promise.resolve();
    if (window.turnstile) return Promise.resolve();
    if (scriptLoading) return scriptLoading;
    if (document.querySelector('script[data-getfy-turnstile]')) {
        return new Promise((resolve) => {
            const check = () => (window.turnstile ? resolve() : setTimeout(check, 50));
            check();
        });
    }
    scriptLoading = new Promise((resolve, reject) => {
        const scriptEl = document.createElement('script');
        scriptEl.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
        scriptEl.async = true;
        scriptEl.defer = true;
        scriptEl.setAttribute('data-getfy-turnstile', '1');
        scriptEl.onload = () => resolve();
        scriptEl.onerror = () => reject(new Error('turnstile_load_failed'));
        document.head.appendChild(scriptEl);
    });

    return scriptLoading;
}

function renderWidget() {
    if (!containerRef.value || !window.turnstile || !props.siteKey) return;
    if (widgetId !== null) {
        try {
            window.turnstile.remove(widgetId);
        } catch (_) {
            /* ignore */
        }
        widgetId = null;
    }
    widgetId = window.turnstile.render(containerRef.value, {
        sitekey: props.siteKey,
        appearance: 'interaction-only',
        size: 'flexible',
        callback: (token) => emit('update:modelValue', token),
        'expired-callback': () => emit('update:modelValue', ''),
        'error-callback': () => emit('update:modelValue', ''),
    });
}

onMounted(async () => {
    try {
        await loadTurnstileScript();
        renderWidget();
    } catch (_) {
        /* parent may show error on submit */
    }
});

watch(() => props.siteKey, async () => {
    try {
        await loadTurnstileScript();
        renderWidget();
    } catch (_) {
        /* ignore */
    }
});

onBeforeUnmount(() => {
    if (widgetId !== null && window.turnstile) {
        try {
            window.turnstile.remove(widgetId);
        } catch (_) {
            /* ignore */
        }
    }
});

function reset() {
    if (widgetId !== null && window.turnstile) {
        window.turnstile.reset(widgetId);
    }
    emit('update:modelValue', '');
}

defineExpose({ reset });
</script>

<template>
    <div
        ref="containerRef"
        class="min-h-[65px] w-full"
        data-checkout="turnstile"
        aria-label="Verificação de segurança"
    />
</template>
