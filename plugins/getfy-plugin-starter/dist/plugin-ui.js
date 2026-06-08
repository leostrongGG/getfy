import { openBlock as d, createElementBlock as _, createElementVNode as e, createTextVNode as i, toDisplayString as l, createCommentVNode as c } from "vue";
const r = "getfy-plugin-starter";
typeof globalThis.process > "u" && (globalThis.process = { env: { NODE_ENV: "production" } });
const g = { class: "rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900" }, u = {
  __name: "SettingsTab",
  props: {
    settings: { type: Object, default: () => ({}) }
  },
  setup(n) {
    return (s, t) => (d(), _("div", g, [...t[0] || (t[0] = [
      e("h2", { class: "text-lg font-semibold text-zinc-900 dark:text-white" }, "Plugin Starter", -1),
      e("p", { class: "mt-2 text-sm text-zinc-600 dark:text-zinc-400" }, [
        i(" UI carregada do bundle "),
        e("code", { class: "text-xs" }, "dist/plugin-ui.js"),
        i(" (sem rebuild do core). ")
      ], -1)
    ])]));
  }
}, p = { class: "rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900" }, x = {
  key: 0,
  class: "mt-4 text-xs text-zinc-500"
}, b = {
  __name: "DashboardPage",
  props: {
    pluginSlug: { type: String, default: "" },
    pluginPage: { type: String, default: "" }
  },
  setup(n) {
    return (s, t) => (d(), _("div", p, [
      t[0] || (t[0] = e("h1", { class: "text-xl font-semibold text-zinc-900 dark:text-white" }, "Dashboard do plugin", -1)),
      t[1] || (t[1] = e("p", { class: "mt-2 text-sm text-zinc-600 dark:text-zinc-400" }, [
        i(" Página carregada via "),
        e("code", { class: "text-xs" }, "frontend.pages"),
        i(" e bundle "),
        e("code", { class: "text-xs" }, "dist/"),
        i(". ")
      ], -1)),
      n.pluginSlug ? (d(), _("p", x, "Plugin: " + l(n.pluginSlug), 1)) : c("", !0)
    ]));
  }
}, o = typeof r < "u" ? r : "getfy-plugin-starter";
function a(n, s) {
  typeof window < "u" && typeof window.__GETFY_REGISTER_PLUGIN_UI__ == "function" && window.__GETFY_REGISTER_PLUGIN_UI__(o, n, s), typeof window < "u" && (window.__GETFY_PLUGIN_UI__ = window.__GETFY_PLUGIN_UI__ || {}, window.__GETFY_PLUGIN_UI__[o] = window.__GETFY_PLUGIN_UI__[o] || {}, window.__GETFY_PLUGIN_UI__[o][n] = s);
}
a("SettingsTab", u);
a("DashboardPage", b);
export {
  b as DashboardPage,
  u as SettingsTab
};
