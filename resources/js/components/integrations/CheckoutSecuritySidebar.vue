<script setup>
import { ref, watch } from 'vue';
import axios from 'axios';
import Button from '@/components/ui/Button.vue';
import { X, Shield, Loader2 } from 'lucide-vue-next';

const props = defineProps({
    open: { type: Boolean, default: false },
    settings: { type: Object, default: () => ({}) },
});

const emit = defineEmits(['close', 'saved']);

const form = ref({
    checkout_turnstile_enabled: '0',
    checkout_turnstile_site_key: '',
    checkout_turnstile_secret_key: '',
    checkout_turnstile_mode: 'pix_boleto',
    checkout_turnstile_secret_configured: false,
});

const saving = ref(false);
const errorMessage = ref(null);

watch(
    () => [props.open, props.settings],
    () => {
        if (props.open) {
            form.value = {
                checkout_turnstile_enabled: props.settings.checkout_turnstile_enabled ?? '0',
                checkout_turnstile_site_key: props.settings.checkout_turnstile_site_key ?? '',
                checkout_turnstile_secret_key: '',
                checkout_turnstile_mode: props.settings.checkout_turnstile_mode ?? 'pix_boleto',
                checkout_turnstile_secret_configured: Boolean(props.settings.checkout_turnstile_secret_configured),
            };
            errorMessage.value = null;
        }
    },
    { immediate: true }
);

async function save() {
    saving.value = true;
    errorMessage.value = null;
    try {
        await axios.put('/integracoes/checkout-security', {
            checkout_turnstile_enabled: form.value.checkout_turnstile_enabled === '1',
            checkout_turnstile_site_key: form.value.checkout_turnstile_site_key,
            checkout_turnstile_secret_key: form.value.checkout_turnstile_secret_key || undefined,
            checkout_turnstile_mode: form.value.checkout_turnstile_mode,
        });
        emit('saved');
        emit('close');
    } catch (err) {
        errorMessage.value = err.response?.data?.message || 'Não foi possível salvar. Tente novamente.';
    } finally {
        saving.value = false;
    }
}
</script>

<template>
    <Teleport to="body">
        <Transition
            enter-active-class="transition-opacity duration-200"
            enter-from-class="opacity-0"
            enter-to-class="opacity-100"
            leave-active-class="transition-opacity duration-200"
            leave-from-class="opacity-100"
            leave-to-class="opacity-0"
        >
            <div
                v-if="open"
                class="fixed inset-0 z-[100000] bg-black/30"
                aria-hidden="true"
                @click="emit('close')"
            />
        </Transition>
        <Transition
            enter-active-class="transition-transform duration-300 ease-out"
            enter-from-class="translate-x-full"
            enter-to-class="translate-x-0"
            leave-active-class="transition-transform duration-300 ease-in"
            leave-from-class="translate-x-0"
            leave-to-class="translate-x-full"
        >
            <aside
                v-if="open"
                class="fixed top-0 right-0 z-[100001] flex h-full w-full max-w-md flex-col bg-white shadow-2xl dark:bg-zinc-900"
                role="dialog"
                aria-label="Segurança do checkout"
                @click.stop
            >
                <div class="flex shrink-0 items-center justify-between border-b border-zinc-200 px-4 py-3 dark:border-zinc-700">
                    <div class="flex items-center gap-2 text-lg font-semibold text-zinc-900 dark:text-white">
                        <Shield class="h-5 w-5 text-violet-600" />
                        Segurança do checkout
                    </div>
                    <button
                        type="button"
                        class="rounded-lg p-2 text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white"
                        aria-label="Fechar"
                        @click="emit('close')"
                    >
                        <X class="h-5 w-5" />
                    </button>
                </div>

                <div class="flex-1 overflow-y-auto p-4">
                    <p class="mb-4 text-sm text-zinc-600 dark:text-zinc-400">
                        Proteção contra bots e flood no checkout. Rate limits do servidor já estão ativos;
                        o Cloudflare Turnstile é uma camada extra opcional e invisível para a maioria dos compradores.
                    </p>

                    <div
                        class="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-700 dark:bg-zinc-900"
                    >
                        <label class="flex cursor-pointer items-center gap-3">
                            <input
                                v-model="form.checkout_turnstile_enabled"
                                type="checkbox"
                                class="h-4 w-4 rounded border-zinc-300 text-violet-600 focus:ring-violet-500"
                                true-value="1"
                                false-value="0"
                            />
                            <span class="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                                Ativar Cloudflare Turnstile
                            </span>
                        </label>

                        <div class="mt-5 space-y-4">
                            <div>
                                <label class="mb-1 block text-xs font-medium text-zinc-600 dark:text-zinc-400">
                                    Site key (pública)
                                </label>
                                <input
                                    v-model="form.checkout_turnstile_site_key"
                                    type="text"
                                    class="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-800"
                                    placeholder="0x4AAAAAAA..."
                                    autocomplete="off"
                                />
                            </div>
                            <div>
                                <label class="mb-1 block text-xs font-medium text-zinc-600 dark:text-zinc-400">
                                    Secret key
                                    <span
                                        v-if="form.checkout_turnstile_secret_configured"
                                        class="ml-1 text-emerald-600 dark:text-emerald-400"
                                    >(configurada — deixe em branco para manter)</span>
                                </label>
                                <input
                                    v-model="form.checkout_turnstile_secret_key"
                                    type="password"
                                    class="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-800"
                                    placeholder="••••••••"
                                    autocomplete="new-password"
                                />
                            </div>
                            <div>
                                <label class="mb-1 block text-xs font-medium text-zinc-600 dark:text-zinc-400">
                                    Modo no checkout
                                </label>
                                <select
                                    v-model="form.checkout_turnstile_mode"
                                    class="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-800"
                                >
                                    <option value="disabled">Desativado (mesmo com toggle ligado)</option>
                                    <option value="pix_boleto">PIX e boleto (recomendado)</option>
                                    <option value="all_payments">Todos os métodos de pagamento</option>
                                </select>
                                <p class="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
                                    No painel Cloudflare, crie o widget como Managed. No checkout usamos modo
                                    invisível — só tráfego suspeito vê desafio.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div
                        class="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-100"
                    >
                        <p class="font-medium">Proteções automáticas (sempre ativas)</p>
                        <ul class="mt-2 list-inside list-disc space-y-1 text-xs">
                            <li>Honeypot anti-bot no formulário</li>
                            <li>Rate limit por IP e e-mail</li>
                            <li>Reuso de PIX pendente em flood (mesmo e-mail + produto)</li>
                        </ul>
                    </div>

                    <p v-if="errorMessage" class="mt-4 text-sm text-red-600 dark:text-red-400">
                        {{ errorMessage }}
                    </p>
                </div>

                <div class="shrink-0 border-t border-zinc-200 p-4 dark:border-zinc-700">
                    <Button class="w-full" :disabled="saving" @click="save">
                        <Loader2 v-if="saving" class="mr-2 h-4 w-4 animate-spin" />
                        Salvar
                    </Button>
                </div>
            </aside>
        </Transition>
    </Teleport>
</template>
