const ue = "getfy-plugin-starter";
/**
* @vue/shared v3.5.35
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
const q = process.env.NODE_ENV !== "production" ? Object.freeze({}) : {}, $e = process.env.NODE_ENV !== "production" ? Object.freeze([]) : [], de = () => {
}, ze = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && // uppercase letter
(e.charCodeAt(2) > 122 || e.charCodeAt(2) < 97), Ae = (e) => e.startsWith("onUpdate:"), j = Object.assign, p = Array.isArray, Me = (e) => ne(e) === "[object Map]", Ge = (e) => ne(e) === "[object Set]", w = (e) => typeof e == "function", N = (e) => typeof e == "string", te = (e) => typeof e == "symbol", b = (e) => e !== null && typeof e == "object", pe = Object.prototype.toString, ne = (e) => pe.call(e), Le = (e) => ne(e) === "[object Object]";
let ae;
const H = () => ae || (ae = typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : {});
function oe(e) {
  if (p(e)) {
    const t = {};
    for (let n = 0; n < e.length; n++) {
      const o = e[n], s = N(o) ? Je(o) : oe(o);
      if (s)
        for (const r in s)
          t[r] = s[r];
    }
    return t;
  } else if (N(e) || b(e))
    return e;
}
const je = /;(?![^(]*\))/g, He = /:([^]+)/, Ye = /\/\*[^]*?\*\//g;
function Je(e) {
  const t = {};
  return e.replace(Ye, "").split(je).forEach((n) => {
    if (n) {
      const o = n.split(He);
      o.length > 1 && (t[o[0].trim()] = o[1].trim());
    }
  }), t;
}
function re(e) {
  let t = "";
  if (N(e))
    t = e;
  else if (p(e))
    for (let n = 0; n < e.length; n++) {
      const o = re(e[n]);
      o && (t += o + " ");
    }
  else if (b(e))
    for (const n in e)
      e[n] && (t += n + " ");
  return t.trim();
}
const _e = (e) => !!(e && e.__v_isRef === !0), ge = (e) => N(e) ? e : e == null ? "" : p(e) || b(e) && (e.toString === pe || !w(e.toString)) ? _e(e) ? ge(e.value) : JSON.stringify(e, he, 2) : String(e), he = (e, t) => _e(t) ? he(e, t.value) : Me(t) ? {
  [`Map(${t.size})`]: [...t.entries()].reduce(
    (n, [o, s], r) => (n[Y(o, r) + " =>"] = s, n),
    {}
  )
} : Ge(t) ? {
  [`Set(${t.size})`]: [...t.values()].map((n) => Y(n))
} : te(t) ? Y(t) : b(t) && !p(t) && !Le(t) ? String(t) : t, Y = (e, t = "") => {
  var n;
  return (
    // Symbol.description in es2019+ so we need to cast here to pass
    // the lib: es2016 check
    te(e) ? `Symbol(${(n = e.description) != null ? n : t})` : e
  );
};
/**
* @vue/reactivity v3.5.35
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
process.env.NODE_ENV;
process.env.NODE_ENV;
process.env.NODE_ENV;
new Set(
  /* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((e) => e !== "arguments" && e !== "caller").map((e) => Symbol[e]).filter(te)
);
// @__NO_SIDE_EFFECTS__
function me(e) {
  return /* @__PURE__ */ Q(e) ? /* @__PURE__ */ me(e.__v_raw) : !!(e && e.__v_isReactive);
}
// @__NO_SIDE_EFFECTS__
function Q(e) {
  return !!(e && e.__v_isReadonly);
}
// @__NO_SIDE_EFFECTS__
function J(e) {
  return !!(e && e.__v_isShallow);
}
// @__NO_SIDE_EFFECTS__
function X(e) {
  return e ? !!e.__v_raw : !1;
}
// @__NO_SIDE_EFFECTS__
function O(e) {
  const t = e && e.__v_raw;
  return t ? /* @__PURE__ */ O(t) : e;
}
// @__NO_SIDE_EFFECTS__
function se(e) {
  return e ? e.__v_isRef === !0 : !1;
}
/**
* @vue/runtime-core v3.5.35
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
const x = [];
function Be(e) {
  x.push(e);
}
function Ke() {
  x.pop();
}
let B = !1;
function T(e, ...t) {
  if (B) return;
  B = !0;
  const n = x.length ? x[x.length - 1].component : null, o = n && n.appContext.config.warnHandler, s = We();
  if (o)
    ie(
      o,
      n,
      11,
      [
        // eslint-disable-next-line no-restricted-syntax
        e + t.map((r) => {
          var c, l;
          return (l = (c = r.toString) == null ? void 0 : c.call(r)) != null ? l : JSON.stringify(r);
        }).join(""),
        n && n.proxy,
        s.map(
          ({ vnode: r }) => `at <${De(n, r.type)}>`
        ).join(`
`),
        s
      ]
    );
  else {
    const r = [`[Vue warn]: ${e}`, ...t];
    s.length && r.push(`
`, ...qe(s)), console.warn(...r);
  }
  B = !1;
}
function We() {
  let e = x[x.length - 1];
  if (!e)
    return [];
  const t = [];
  for (; e; ) {
    const n = t[0];
    n && n.vnode === e ? n.recurseCount++ : t.push({
      vnode: e,
      recurseCount: 0
    });
    const o = e.component && e.component.parent;
    e = o && o.vnode;
  }
  return t;
}
function qe(e) {
  const t = [];
  return e.forEach((n, o) => {
    t.push(...o === 0 ? [] : [`
`], ...Qe(n));
  }), t;
}
function Qe({ vnode: e, recurseCount: t }) {
  const n = t > 0 ? `... (${t} recursive calls)` : "", o = e.component ? e.component.parent == null : !1, s = ` at <${De(
    e.component,
    e.type,
    o
  )}`, r = ">" + n;
  return e.props ? [s, ...Xe(e.props), r] : [s + r];
}
function Xe(e) {
  const t = [], n = Object.keys(e);
  return n.slice(0, 3).forEach((o) => {
    t.push(...ye(o, e[o]));
  }), n.length > 3 && t.push(" ..."), t;
}
function ye(e, t, n) {
  return N(t) ? (t = JSON.stringify(t), n ? t : [`${e}=${t}`]) : typeof t == "number" || typeof t == "boolean" || t == null ? n ? t : [`${e}=${t}`] : /* @__PURE__ */ se(t) ? (t = ye(e, /* @__PURE__ */ O(t.value), !0), n ? t : [`${e}=Ref<`, t, ">"]) : w(t) ? [`${e}=fn${t.name ? `<${t.name}>` : ""}`] : (t = /* @__PURE__ */ O(t), n ? t : [`${e}=`, t]);
}
const Ee = {
  sp: "serverPrefetch hook",
  bc: "beforeCreate hook",
  c: "created hook",
  bm: "beforeMount hook",
  m: "mounted hook",
  bu: "beforeUpdate hook",
  u: "updated",
  bum: "beforeUnmount hook",
  um: "unmounted hook",
  a: "activated hook",
  da: "deactivated hook",
  ec: "errorCaptured hook",
  rtc: "renderTracked hook",
  rtg: "renderTriggered hook",
  0: "setup function",
  1: "render function",
  2: "watcher getter",
  3: "watcher callback",
  4: "watcher cleanup function",
  5: "native event handler",
  6: "component event handler",
  7: "vnode hook",
  8: "directive hook",
  9: "transition hook",
  10: "app errorHandler",
  11: "app warnHandler",
  12: "ref function",
  13: "async component loader",
  14: "scheduler flush",
  15: "component update",
  16: "app unmount cleanup function"
};
function ie(e, t, n, o) {
  try {
    return o ? e(...o) : e();
  } catch (s) {
    be(s, t, n);
  }
}
function be(e, t, n, o = !0) {
  const s = t ? t.vnode : null, { errorHandler: r, throwUnhandledErrorInProduction: c } = t && t.appContext.config || q;
  if (t) {
    let l = t.parent;
    const u = t.proxy, g = process.env.NODE_ENV !== "production" ? Ee[n] : `https://vuejs.org/error-reference/#runtime-${n}`;
    for (; l; ) {
      const m = l.ec;
      if (m) {
        for (let i = 0; i < m.length; i++)
          if (m[i](e, u, g) === !1)
            return;
      }
      l = l.parent;
    }
    if (r) {
      ie(r, null, 10, [
        e,
        u,
        g
      ]);
      return;
    }
  }
  Ze(e, n, s, o, c);
}
function Ze(e, t, n, o = !0, s = !1) {
  if (process.env.NODE_ENV !== "production") {
    const r = Ee[t];
    if (n && Be(n), T(`Unhandled error${r ? ` during execution of ${r}` : ""}`), n && Ke(), o)
      throw e;
    console.error(e);
  } else {
    if (s)
      throw e;
    console.error(e);
  }
}
const d = [];
let y = -1;
const C = [];
let S = null, k = 0;
const ve = /* @__PURE__ */ Promise.resolve();
let Z = null;
const et = 100;
function tt(e) {
  let t = y + 1, n = d.length;
  for (; t < n; ) {
    const o = t + n >>> 1, s = d[o], r = F(s);
    r < e || r === e && s.flags & 2 ? t = o + 1 : n = o;
  }
  return t;
}
function nt(e) {
  if (!(e.flags & 1)) {
    const t = F(e), n = d[d.length - 1];
    !n || // fast path when the job id is larger than the tail
    !(e.flags & 2) && t >= F(n) ? d.push(e) : d.splice(tt(t), 0, e), e.flags |= 1, Ne();
  }
}
function Ne() {
  Z || (Z = ve.then(Se));
}
function ot(e) {
  p(e) ? C.push(...e) : S && e.id === -1 ? S.splice(k + 1, 0, e) : e.flags & 1 || (C.push(e), e.flags |= 1), Ne();
}
function rt(e) {
  if (C.length) {
    const t = [...new Set(C)].sort(
      (n, o) => F(n) - F(o)
    );
    if (C.length = 0, S) {
      S.push(...t);
      return;
    }
    for (S = t, process.env.NODE_ENV !== "production" && (e = e || /* @__PURE__ */ new Map()), k = 0; k < S.length; k++) {
      const n = S[k];
      process.env.NODE_ENV !== "production" && we(e, n) || (n.flags & 4 && (n.flags &= -2), n.flags & 8 || n(), n.flags &= -2);
    }
    S = null, k = 0;
  }
}
const F = (e) => e.id == null ? e.flags & 2 ? -1 : 1 / 0 : e.id;
function Se(e) {
  process.env.NODE_ENV !== "production" && (e = e || /* @__PURE__ */ new Map());
  const t = process.env.NODE_ENV !== "production" ? (n) => we(e, n) : de;
  try {
    for (y = 0; y < d.length; y++) {
      const n = d[y];
      if (n && !(n.flags & 8)) {
        if (process.env.NODE_ENV !== "production" && t(n))
          continue;
        n.flags & 4 && (n.flags &= -2), ie(
          n,
          n.i,
          n.i ? 15 : 14
        ), n.flags & 4 || (n.flags &= -2);
      }
    }
  } finally {
    for (; y < d.length; y++) {
      const n = d[y];
      n && (n.flags &= -2);
    }
    y = -1, d.length = 0, rt(e), Z = null, (d.length || C.length) && Se(e);
  }
}
function we(e, t) {
  const n = e.get(t) || 0;
  if (n > et) {
    const o = t.i, s = o && Fe(o.type);
    return be(
      `Maximum recursive updates exceeded${s ? ` in component <${s}>` : ""}. This means you have a reactive effect that is mutating its own dependencies and thus recursively triggering itself. Possible sources include component template, render function, updated hook or watcher source function.`,
      null,
      10
    ), !0;
  }
  return e.set(t, n + 1), !1;
}
const K = /* @__PURE__ */ new Map();
process.env.NODE_ENV !== "production" && (H().__VUE_HMR_RUNTIME__ = {
  createRecord: W(st),
  rerender: W(it),
  reload: W(ct)
});
const z = /* @__PURE__ */ new Map();
function st(e, t) {
  return z.has(e) ? !1 : (z.set(e, {
    initialDef: A(t),
    instances: /* @__PURE__ */ new Set()
  }), !0);
}
function A(e) {
  return Pe(e) ? e.__vccOpts : e;
}
function it(e, t) {
  const n = z.get(e);
  n && (n.initialDef.render = t, [...n.instances].forEach((o) => {
    t && (o.render = t, A(o.type).render = t), o.renderCache = [], o.job.flags & 8 || o.update();
  }));
}
function ct(e, t) {
  const n = z.get(e);
  if (!n) return;
  t = A(t), fe(n.initialDef, t);
  const o = [...n.instances];
  for (let s = 0; s < o.length; s++) {
    const r = o[s], c = A(r.type);
    let l = K.get(c);
    l || (c !== n.initialDef && fe(c, t), K.set(c, l = /* @__PURE__ */ new Set())), l.add(r), r.appContext.propsCache.delete(r.type), r.appContext.emitsCache.delete(r.type), r.appContext.optionsCache.delete(r.type), r.ceReload ? (l.add(r), r.ceReload(t.styles), l.delete(r)) : r.parent ? nt(() => {
      r.job.flags & 8 || (r.parent.update(), l.delete(r));
    }) : r.appContext.reload ? r.appContext.reload() : typeof window < "u" ? window.location.reload() : console.warn(
      "[HMR] Root or manually mounted instance modified. Full reload required."
    ), r.root.ce && r !== r.root && r.root.ce._removeChildStyle(c);
  }
  ot(() => {
    K.clear();
  });
}
function fe(e, t) {
  j(e, t);
  for (const n in e)
    n !== "__file" && !(n in t) && delete e[n];
}
function W(e) {
  return (t, n) => {
    try {
      return e(t, n);
    } catch (o) {
      console.error(o), console.warn(
        "[HMR] Something went wrong during Vue component hot-reload. Full reload required."
      );
    }
  };
}
let V, D = [];
function Oe(e, t) {
  var n, o;
  V = e, V ? (V.enabled = !0, D.forEach(({ event: s, args: r }) => V.emit(s, ...r)), D = []) : /* handle late devtools injection - only do this if we are in an actual */ /* browser environment to avoid the timer handle stalling test runner exit */ /* (#4815) */ typeof window < "u" && // some envs mock window but not fully
  window.HTMLElement && // also exclude jsdom
  // eslint-disable-next-line no-restricted-syntax
  !((o = (n = window.navigator) == null ? void 0 : n.userAgent) != null && o.includes("jsdom")) ? ((t.__VUE_DEVTOOLS_HOOK_REPLAY__ = t.__VUE_DEVTOOLS_HOOK_REPLAY__ || []).push((r) => {
    Oe(r, t);
  }), setTimeout(() => {
    V || (t.__VUE_DEVTOOLS_HOOK_REPLAY__ = null, D = []);
  }, 3e3)) : D = [];
}
let M = null, lt = null;
const ut = (e) => e.__isTeleport;
function xe(e, t) {
  e.shapeFlag & 6 && e.component ? (e.transition = t, xe(e.component.subTree, t)) : e.shapeFlag & 128 ? (e.ssContent.transition = t.clone(e.ssContent), e.ssFallback.transition = t.clone(e.ssFallback)) : e.transition = t;
}
H().requestIdleCallback;
H().cancelIdleCallback;
const at = /* @__PURE__ */ Symbol.for("v-ndc"), ft = {};
process.env.NODE_ENV !== "production" && (ft.ownKeys = (e) => (T(
  "Avoid app logic that relies on enumerating keys on a component instance. The keys will be empty in production mode to avoid performance overhead."
), Reflect.ownKeys(e)));
const dt = {}, ke = (e) => Object.getPrototypeOf(e) === dt, pt = (e) => e.__isSuspense, Ve = /* @__PURE__ */ Symbol.for("v-fgt"), _t = /* @__PURE__ */ Symbol.for("v-txt"), v = /* @__PURE__ */ Symbol.for("v-cmt"), U = [];
let _ = null;
function G(e = !1) {
  U.push(_ = e ? null : []);
}
function gt() {
  U.pop(), _ = U[U.length - 1] || null;
}
function Ce(e) {
  return e.dynamicChildren = _ || $e, gt(), _ && _.push(e), e;
}
function ee(e, t, n, o, s, r) {
  return Ce(
    E(
      e,
      t,
      n,
      o,
      s,
      r,
      !0
    )
  );
}
function ht(e, t, n, o, s) {
  return Ce(
    ce(
      e,
      t,
      n,
      o,
      s,
      !0
    )
  );
}
function mt(e) {
  return e ? e.__v_isVNode === !0 : !1;
}
const yt = (...e) => Te(
  ...e
), Ie = ({ key: e }) => e ?? null, $ = ({
  ref: e,
  ref_key: t,
  ref_for: n
}) => (typeof e == "number" && (e = "" + e), e != null ? N(e) || /* @__PURE__ */ se(e) || w(e) ? { i: M, r: e, k: t, f: !!n } : e : null);
function E(e, t = null, n = null, o = 0, s = null, r = e === Ve ? 0 : 1, c = !1, l = !1) {
  const u = {
    __v_isVNode: !0,
    __v_skip: !0,
    type: e,
    props: t,
    key: t && Ie(t),
    ref: t && $(t),
    scopeId: lt,
    slotScopeIds: null,
    children: n,
    component: null,
    suspense: null,
    ssContent: null,
    ssFallback: null,
    dirs: null,
    transition: null,
    el: null,
    anchor: null,
    target: null,
    targetStart: null,
    targetAnchor: null,
    staticCount: 0,
    shapeFlag: r,
    patchFlag: o,
    dynamicProps: s,
    dynamicChildren: null,
    appContext: null,
    ctx: M
  };
  return l ? (le(u, n), r & 128 && e.normalize(u)) : n && (u.shapeFlag |= N(n) ? 8 : 16), process.env.NODE_ENV !== "production" && u.key !== u.key && T("VNode created with invalid key (NaN). VNode type:", u.type), // avoid a block node from tracking itself
  !c && // has current parent block
  _ && // presence of a patch flag indicates this node needs patching on updates.
  // component nodes also should always be patched, because even if the
  // component doesn't need to update, it needs to persist the instance on to
  // the next vnode so that it can be properly unmounted later.
  (u.patchFlag > 0 || r & 6) && // the EVENTS flag is only for hydration and if it is the only flag, the
  // vnode should not be considered dynamic due to handler caching.
  u.patchFlag !== 32 && _.push(u), u;
}
const ce = process.env.NODE_ENV !== "production" ? yt : Te;
function Te(e, t = null, n = null, o = 0, s = null, r = !1) {
  if ((!e || e === at) && (process.env.NODE_ENV !== "production" && !e && T(`Invalid vnode type when creating vnode: ${e}.`), e = v), mt(e)) {
    const l = L(
      e,
      t,
      !0
      /* mergeRef: true */
    );
    return n && le(l, n), !r && _ && (l.shapeFlag & 6 ? _[_.indexOf(e)] = l : _.push(l)), l.patchFlag = -2, l;
  }
  if (Pe(e) && (e = e.__vccOpts), t) {
    t = Et(t);
    let { class: l, style: u } = t;
    l && !N(l) && (t.class = re(l)), b(u) && (/* @__PURE__ */ X(u) && !p(u) && (u = j({}, u)), t.style = oe(u));
  }
  const c = N(e) ? 1 : pt(e) ? 128 : ut(e) ? 64 : b(e) ? 4 : w(e) ? 2 : 0;
  return process.env.NODE_ENV !== "production" && c & 4 && /* @__PURE__ */ X(e) && (e = /* @__PURE__ */ O(e), T(
    "Vue received a Component that was made a reactive object. This can lead to unnecessary performance overhead and should be avoided by marking the component with `markRaw` or using `shallowRef` instead of `ref`.",
    `
Component that was made reactive: `,
    e
  )), E(
    e,
    t,
    n,
    o,
    s,
    c,
    r,
    !0
  );
}
function Et(e) {
  return e ? /* @__PURE__ */ X(e) || ke(e) ? j({}, e) : e : null;
}
function L(e, t, n = !1, o = !1) {
  const { props: s, ref: r, patchFlag: c, children: l, transition: u } = e, g = t ? Nt(s || {}, t) : s, m = {
    __v_isVNode: !0,
    __v_skip: !0,
    type: e.type,
    props: g,
    key: g && Ie(g),
    ref: t && t.ref ? (
      // #2078 in the case of <component :is="vnode" ref="extra"/>
      // if the vnode itself already has a ref, cloneVNode will need to merge
      // the refs so the single vnode can be set on multiple refs
      n && r ? p(r) ? r.concat($(t)) : [r, $(t)] : $(t)
    ) : r,
    scopeId: e.scopeId,
    slotScopeIds: e.slotScopeIds,
    children: process.env.NODE_ENV !== "production" && c === -1 && p(l) ? l.map(Re) : l,
    target: e.target,
    targetStart: e.targetStart,
    targetAnchor: e.targetAnchor,
    staticCount: e.staticCount,
    shapeFlag: e.shapeFlag,
    // if the vnode is cloned with extra props, we can no longer assume its
    // existing patch flag to be reliable and need to add the FULL_PROPS flag.
    // note: preserve flag for fragments since they use the flag for children
    // fast paths only.
    patchFlag: t && e.type !== Ve ? c === -1 ? 16 : c | 16 : c,
    dynamicProps: e.dynamicProps,
    dynamicChildren: e.dynamicChildren,
    appContext: e.appContext,
    dirs: e.dirs,
    transition: u,
    // These should technically only be non-null on mounted VNodes. However,
    // they *should* be copied for kept-alive vnodes. So we just always copy
    // them since them being non-null during a mount doesn't affect the logic as
    // they will simply be overwritten.
    component: e.component,
    suspense: e.suspense,
    ssContent: e.ssContent && L(e.ssContent),
    ssFallback: e.ssFallback && L(e.ssFallback),
    placeholder: e.placeholder,
    el: e.el,
    anchor: e.anchor,
    ctx: e.ctx,
    ce: e.ce
  };
  return u && o && xe(
    m,
    u.clone(m)
  ), m;
}
function Re(e) {
  const t = L(e);
  return p(e.children) && (t.children = e.children.map(Re)), t;
}
function I(e = " ", t = 0) {
  return ce(_t, null, e, t);
}
function bt(e = "", t = !1) {
  return t ? (G(), ht(v, null, e)) : ce(v, null, e);
}
function le(e, t) {
  let n = 0;
  const { shapeFlag: o } = e;
  if (t == null)
    t = null;
  else if (p(t))
    n = 16;
  else if (typeof t == "object")
    if (o & 65) {
      const s = t.default;
      s && (s._c && (s._d = !1), le(e, s()), s._c && (s._d = !0));
      return;
    } else
      n = 32, !t._ && !ke(t) && (t._ctx = M);
  else w(t) ? (t = { default: t, _ctx: M }, n = 32) : (t = String(t), o & 64 ? (n = 16, t = [I(t)]) : n = 8);
  e.children = t, e.shapeFlag |= n;
}
function Nt(...e) {
  const t = {};
  for (let n = 0; n < e.length; n++) {
    const o = e[n];
    for (const s in o)
      if (s === "class")
        t.class !== o.class && (t.class = re([t.class, o.class]));
      else if (s === "style")
        t.style = oe([t.style, o.style]);
      else if (ze(s)) {
        const r = t[s], c = o[s];
        c && r !== c && !(p(r) && r.includes(c)) ? t[s] = r ? [].concat(r, c) : c : c == null && r == null && // mergeProps({ 'onUpdate:modelValue': undefined }) should not retain
        // the model listener.
        !Ae(s) && (t[s] = c);
      } else s !== "" && (t[s] = o[s]);
  }
  return t;
}
{
  const e = H(), t = (n, o) => {
    let s;
    return (s = e[n]) || (s = e[n] = []), s.push(o), (r) => {
      s.length > 1 ? s.forEach((c) => c(r)) : s[0](r);
    };
  };
  t(
    "__VUE_INSTANCE_SETTERS__",
    (n) => n
  ), t(
    "__VUE_SSR_SETTERS__",
    (n) => n
  );
}
process.env.NODE_ENV;
const St = /(?:^|[-_])\w/g, wt = (e) => e.replace(St, (t) => t.toUpperCase()).replace(/[-_]/g, "");
function Fe(e, t = !0) {
  return w(e) ? e.displayName || e.name : e.name || t && e.__name;
}
function De(e, t, n = !1) {
  let o = Fe(t);
  if (!o && t.__file) {
    const s = t.__file.match(/([^/\\]+)\.\w+$/);
    s && (o = s[1]);
  }
  if (!o && e) {
    const s = (r) => {
      for (const c in r)
        if (r[c] === t)
          return c;
    };
    o = s(e.components) || e.parent && s(
      e.parent.type.components
    ) || s(e.appContext.components);
  }
  return o ? wt(o) : n ? "App" : "Anonymous";
}
function Pe(e) {
  return w(e) && "__vccOpts" in e;
}
function Ot() {
  if (process.env.NODE_ENV === "production" || typeof window > "u")
    return;
  const e = { style: "color:#3ba776" }, t = { style: "color:#1677ff" }, n = { style: "color:#f5222d" }, o = { style: "color:#eb2f96" }, s = {
    __vue_custom_formatter: !0,
    header(i) {
      if (!b(i))
        return null;
      if (i.__isVue)
        return ["div", e, "VueInstance"];
      if (/* @__PURE__ */ se(i)) {
        const a = i.value;
        return [
          "div",
          {},
          ["span", e, m(i)],
          "<",
          l(a),
          ">"
        ];
      } else {
        if (/* @__PURE__ */ me(i))
          return [
            "div",
            {},
            ["span", e, /* @__PURE__ */ J(i) ? "ShallowReactive" : "Reactive"],
            "<",
            l(i),
            `>${/* @__PURE__ */ Q(i) ? " (readonly)" : ""}`
          ];
        if (/* @__PURE__ */ Q(i))
          return [
            "div",
            {},
            ["span", e, /* @__PURE__ */ J(i) ? "ShallowReadonly" : "Readonly"],
            "<",
            l(i),
            ">"
          ];
      }
      return null;
    },
    hasBody(i) {
      return i && i.__isVue;
    },
    body(i) {
      if (i && i.__isVue)
        return [
          "div",
          {},
          ...r(i.$)
        ];
    }
  };
  function r(i) {
    const a = [];
    i.type.props && i.props && a.push(c("props", /* @__PURE__ */ O(i.props))), i.setupState !== q && a.push(c("setup", i.setupState)), i.data !== q && a.push(c("data", /* @__PURE__ */ O(i.data)));
    const f = u(i, "computed");
    f && a.push(c("computed", f));
    const h = u(i, "inject");
    return h && a.push(c("injected", h)), a.push([
      "div",
      {},
      [
        "span",
        {
          style: o.style + ";opacity:0.66"
        },
        "$ (internal): "
      ],
      ["object", { object: i }]
    ]), a;
  }
  function c(i, a) {
    return a = j({}, a), Object.keys(a).length ? [
      "div",
      { style: "line-height:1.25em;margin-bottom:0.6em" },
      [
        "div",
        {
          style: "color:#476582"
        },
        i
      ],
      [
        "div",
        {
          style: "padding-left:1.25em"
        },
        ...Object.keys(a).map((f) => [
          "div",
          {},
          ["span", o, f + ": "],
          l(a[f], !1)
        ])
      ]
    ] : ["span", {}];
  }
  function l(i, a = !0) {
    return typeof i == "number" ? ["span", t, i] : typeof i == "string" ? ["span", n, JSON.stringify(i)] : typeof i == "boolean" ? ["span", o, i] : b(i) ? ["object", { object: a ? /* @__PURE__ */ O(i) : i }] : ["span", n, String(i)];
  }
  function u(i, a) {
    const f = i.type;
    if (w(f))
      return;
    const h = {};
    for (const R in i.ctx)
      g(f, R, a) && (h[R] = i.ctx[R]);
    return h;
  }
  function g(i, a, f) {
    const h = i[f];
    if (p(h) && h.includes(a) || b(h) && a in h || i.extends && g(i.extends, a, f) || i.mixins && i.mixins.some((R) => g(R, a, f)))
      return !0;
  }
  function m(i) {
    return /* @__PURE__ */ J(i) ? "ShallowRef" : i.effect ? "ComputedRef" : "Ref";
  }
  window.devtoolsFormatters ? window.devtoolsFormatters.push(s) : window.devtoolsFormatters = [s];
}
process.env.NODE_ENV;
process.env.NODE_ENV;
process.env.NODE_ENV;
/**
* vue v3.5.35
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
function xt() {
  Ot();
}
process.env.NODE_ENV !== "production" && xt();
const kt = { class: "rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900" }, Vt = {
  __name: "SettingsTab",
  props: {
    settings: { type: Object, default: () => ({}) }
  },
  setup(e) {
    return (t, n) => (G(), ee("div", kt, [...n[0] || (n[0] = [
      E("h2", { class: "text-lg font-semibold text-zinc-900 dark:text-white" }, "Plugin Starter", -1),
      E("p", { class: "mt-2 text-sm text-zinc-600 dark:text-zinc-400" }, [
        I(" UI carregada do bundle "),
        E("code", { class: "text-xs" }, "dist/plugin-ui.js"),
        I(" (sem rebuild do core). ")
      ], -1)
    ])]));
  }
}, Ct = { class: "rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900" }, It = {
  key: 0,
  class: "mt-4 text-xs text-zinc-500"
}, Tt = {
  __name: "DashboardPage",
  props: {
    pluginSlug: { type: String, default: "" },
    pluginPage: { type: String, default: "" }
  },
  setup(e) {
    return (t, n) => (G(), ee("div", Ct, [
      n[0] || (n[0] = E("h1", { class: "text-xl font-semibold text-zinc-900 dark:text-white" }, "Dashboard do plugin", -1)),
      n[1] || (n[1] = E("p", { class: "mt-2 text-sm text-zinc-600 dark:text-zinc-400" }, [
        I(" Página carregada via "),
        E("code", { class: "text-xs" }, "frontend.pages"),
        I(" e bundle "),
        E("code", { class: "text-xs" }, "dist/"),
        I(". ")
      ], -1)),
      e.pluginSlug ? (G(), ee("p", It, "Plugin: " + ge(e.pluginSlug), 1)) : bt("", !0)
    ]));
  }
}, P = typeof ue < "u" ? ue : "getfy-plugin-starter";
function Ue(e, t) {
  typeof window < "u" && typeof window.__GETFY_REGISTER_PLUGIN_UI__ == "function" && window.__GETFY_REGISTER_PLUGIN_UI__(P, e, t), typeof window < "u" && (window.__GETFY_PLUGIN_UI__ = window.__GETFY_PLUGIN_UI__ || {}, window.__GETFY_PLUGIN_UI__[P] = window.__GETFY_PLUGIN_UI__[P] || {}, window.__GETFY_PLUGIN_UI__[P][e] = t);
}
Ue("SettingsTab", Vt);
Ue("DashboardPage", Tt);
export {
  Tt as DashboardPage,
  Vt as SettingsTab
};
