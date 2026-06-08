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
let pendingResolve = null;
let pendingReject = null;
let pendingTimer = null;

function clearPending() {
    if (pendingTimer) {
        clearTimeout(pendingTimer);
        pendingTimer = null;
    }
    pendingResolve = null;
    pendingReject = null;
}

function resolvePending(token) {
    if (!pendingResolve) {
        return;
    }
    const resolve = pendingResolve;
    clearPending();
    resolve(token);
}

function rejectPending(error) {
    if (!pendingReject) {
        return;
    }
    const reject = pendingReject;
    clearPending();
    reject(error);
}

function onTurnstileToken(token) {
    emit('update:modelValue', token);
    if (token) {
        resolvePending(token);
    }
}

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
        size: 'invisible',
        callback: (token) => onTurnstileToken(token),
        'expired-callback': () => emit('update:modelValue', ''),
        'error-callback': () => {
            emit('update:modelValue', '');
            rejectPending(new Error('turnstile_error'));
        },
    });
}

async function obtainToken(timeoutMs = 15000) {
    await loadTurnstileScript();
    if (!props.siteKey) {
        throw new Error('turnstile_no_site_key');
    }
    if (String(props.modelValue || '').trim() !== '') {
        return props.modelValue;
    }
    if (widgetId === null) {
        renderWidget();
    }
    return new Promise((resolve, reject) => {
        pendingResolve = resolve;
        pendingReject = reject;
        pendingTimer = setTimeout(() => {
            rejectPending(new Error('turnstile_timeout'));
        }, timeoutMs);
        try {
            window.turnstile.reset(widgetId);
        } catch (_) {
            renderWidget();
        }
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
    clearPending();
    if (widgetId !== null && window.turnstile) {
        try {
            window.turnstile.remove(widgetId);
        } catch (_) {
            /* ignore */
        }
    }
});

function reset() {
    clearPending();
    if (widgetId !== null && window.turnstile) {
        window.turnstile.reset(widgetId);
    }
    emit('update:modelValue', '');
}

defineExpose({ reset, obtainToken });
</script>

<template>
    <div
        ref="containerRef"
        class="pointer-events-none absolute -left-[9999px] h-0 w-0 overflow-hidden opacity-0"
        data-checkout="turnstile"
        aria-hidden="true"
    />
</template>
