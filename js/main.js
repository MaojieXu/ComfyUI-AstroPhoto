var q1 = Object.defineProperty;
var Z1 = (e, t, n) => t in e ? q1(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
var Eh = (e, t, n) => Z1(e, typeof t != "symbol" ? t + "" : t, n);
import { app as Dn } from "../../scripts/app.js";
import { api as e_ } from "../../scripts/api.js";
/**
* @vue/shared v3.5.13
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
/*! #__NO_SIDE_EFFECTS__ */
// @__NO_SIDE_EFFECTS__
function cf(e) {
  const t = /* @__PURE__ */ Object.create(null);
  for (const n of e.split(",")) t[n] = 1;
  return (n) => n in t;
}
const it = {}, Li = [], pn = () => {
}, t_ = () => !1, iu = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && // uppercase letter
(e.charCodeAt(2) > 122 || e.charCodeAt(2) < 97), df = (e) => e.startsWith("onUpdate:"), Jt = Object.assign, ff = (e, t) => {
  const n = e.indexOf(t);
  n > -1 && e.splice(n, 1);
}, r_ = Object.prototype.hasOwnProperty, qe = (e, t) => r_.call(e, t), Ie = Array.isArray, Pi = (e) => lu(e) === "[object Map]", F0 = (e) => lu(e) === "[object Set]", Be = (e) => typeof e == "function", St = (e) => typeof e == "string", jn = (e) => typeof e == "symbol", ht = (e) => e !== null && typeof e == "object", z0 = (e) => (ht(e) || Be(e)) && Be(e.then) && Be(e.catch), U0 = Object.prototype.toString, lu = (e) => U0.call(e), n_ = (e) => lu(e).slice(8, -1), W0 = (e) => lu(e) === "[object Object]", pf = (e) => St(e) && e !== "NaN" && e[0] !== "-" && "" + parseInt(e, 10) === e, Rl = /* @__PURE__ */ cf(
  // the leading comma is intentional so empty string "" is also included
  ",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"
), au = (e) => {
  const t = /* @__PURE__ */ Object.create(null);
  return (n) => t[n] || (t[n] = e(n));
}, o_ = /-(\w)/g, Dr = au(
  (e) => e.replace(o_, (t, n) => n ? n.toUpperCase() : "")
), i_ = /\B([A-Z])/g, Yo = au(
  (e) => e.replace(i_, "-$1").toLowerCase()
), su = au((e) => e.charAt(0).toUpperCase() + e.slice(1)), ud = au(
  (e) => e ? `on${su(e)}` : ""
), po = (e, t) => !Object.is(e, t), cd = (e, ...t) => {
  for (let n = 0; n < e.length; n++)
    e[n](...t);
}, V0 = (e, t, n, i = !1) => {
  Object.defineProperty(e, t, {
    configurable: !0,
    enumerable: !1,
    writable: i,
    value: n
  });
}, l_ = (e) => {
  const t = parseFloat(e);
  return isNaN(t) ? e : t;
};
let Th;
const uu = () => Th || (Th = typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : {});
function cu(e) {
  if (Ie(e)) {
    const t = {};
    for (let n = 0; n < e.length; n++) {
      const i = e[n], a = St(i) ? c_(i) : cu(i);
      if (a)
        for (const s in a)
          t[s] = a[s];
    }
    return t;
  } else if (St(e) || ht(e))
    return e;
}
const a_ = /;(?![^(]*\))/g, s_ = /:([^]+)/, u_ = /\/\*[^]*?\*\//g;
function c_(e) {
  const t = {};
  return e.replace(u_, "").split(a_).forEach((n) => {
    if (n) {
      const i = n.split(s_);
      i.length > 1 && (t[i[0].trim()] = i[1].trim());
    }
  }), t;
}
function Ho(e) {
  let t = "";
  if (St(e))
    t = e;
  else if (Ie(e))
    for (let n = 0; n < e.length; n++) {
      const i = Ho(e[n]);
      i && (t += i + " ");
    }
  else if (ht(e))
    for (const n in e)
      e[n] && (t += n + " ");
  return t.trim();
}
const d_ = "itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly", f_ = /* @__PURE__ */ cf(d_);
function H0(e) {
  return !!e || e === "";
}
const K0 = (e) => !!(e && e.__v_isRef === !0), An = (e) => St(e) ? e : e == null ? "" : Ie(e) || ht(e) && (e.toString === U0 || !Be(e.toString)) ? K0(e) ? An(e.value) : JSON.stringify(e, Y0, 2) : String(e), Y0 = (e, t) => K0(t) ? Y0(e, t.value) : Pi(t) ? {
  [`Map(${t.size})`]: [...t.entries()].reduce(
    (n, [i, a], s) => (n[dd(i, s) + " =>"] = a, n),
    {}
  )
} : F0(t) ? {
  [`Set(${t.size})`]: [...t.values()].map((n) => dd(n))
} : jn(t) ? dd(t) : ht(t) && !Ie(t) && !W0(t) ? String(t) : t, dd = (e, t = "") => {
  var n;
  return (
    // Symbol.description in es2019+ so we need to cast here to pass
    // the lib: es2016 check
    jn(e) ? `Symbol(${(n = e.description) != null ? n : t})` : e
  );
};
/**
* @vue/reactivity v3.5.13
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
let Sr;
class G0 {
  constructor(t = !1) {
    this.detached = t, this._active = !0, this.effects = [], this.cleanups = [], this._isPaused = !1, this.parent = Sr, !t && Sr && (this.index = (Sr.scopes || (Sr.scopes = [])).push(
      this
    ) - 1);
  }
  get active() {
    return this._active;
  }
  pause() {
    if (this._active) {
      this._isPaused = !0;
      let t, n;
      if (this.scopes)
        for (t = 0, n = this.scopes.length; t < n; t++)
          this.scopes[t].pause();
      for (t = 0, n = this.effects.length; t < n; t++)
        this.effects[t].pause();
    }
  }
  /**
   * Resumes the effect scope, including all child scopes and effects.
   */
  resume() {
    if (this._active && this._isPaused) {
      this._isPaused = !1;
      let t, n;
      if (this.scopes)
        for (t = 0, n = this.scopes.length; t < n; t++)
          this.scopes[t].resume();
      for (t = 0, n = this.effects.length; t < n; t++)
        this.effects[t].resume();
    }
  }
  run(t) {
    if (this._active) {
      const n = Sr;
      try {
        return Sr = this, t();
      } finally {
        Sr = n;
      }
    }
  }
  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  on() {
    Sr = this;
  }
  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  off() {
    Sr = this.parent;
  }
  stop(t) {
    if (this._active) {
      this._active = !1;
      let n, i;
      for (n = 0, i = this.effects.length; n < i; n++)
        this.effects[n].stop();
      for (this.effects.length = 0, n = 0, i = this.cleanups.length; n < i; n++)
        this.cleanups[n]();
      if (this.cleanups.length = 0, this.scopes) {
        for (n = 0, i = this.scopes.length; n < i; n++)
          this.scopes[n].stop(!0);
        this.scopes.length = 0;
      }
      if (!this.detached && this.parent && !t) {
        const a = this.parent.scopes.pop();
        a && a !== this && (this.parent.scopes[this.index] = a, a.index = this.index);
      }
      this.parent = void 0;
    }
  }
}
function p_(e) {
  return new G0(e);
}
function g_() {
  return Sr;
}
let at;
const fd = /* @__PURE__ */ new WeakSet();
class X0 {
  constructor(t) {
    this.fn = t, this.deps = void 0, this.depsTail = void 0, this.flags = 5, this.next = void 0, this.cleanup = void 0, this.scheduler = void 0, Sr && Sr.active && Sr.effects.push(this);
  }
  pause() {
    this.flags |= 64;
  }
  resume() {
    this.flags & 64 && (this.flags &= -65, fd.has(this) && (fd.delete(this), this.trigger()));
  }
  /**
   * @internal
   */
  notify() {
    this.flags & 2 && !(this.flags & 32) || this.flags & 8 || J0(this);
  }
  run() {
    if (!(this.flags & 1))
      return this.fn();
    this.flags |= 2, Oh(this), q0(this);
    const t = at, n = Jr;
    at = this, Jr = !0;
    try {
      return this.fn();
    } finally {
      Z0(this), at = t, Jr = n, this.flags &= -3;
    }
  }
  stop() {
    if (this.flags & 1) {
      for (let t = this.deps; t; t = t.nextDep)
        mf(t);
      this.deps = this.depsTail = void 0, Oh(this), this.onStop && this.onStop(), this.flags &= -2;
    }
  }
  trigger() {
    this.flags & 64 ? fd.add(this) : this.scheduler ? this.scheduler() : this.runIfDirty();
  }
  /**
   * @internal
   */
  runIfDirty() {
    Id(this) && this.run();
  }
  get dirty() {
    return Id(this);
  }
}
let Q0 = 0, Il, Al;
function J0(e, t = !1) {
  if (e.flags |= 8, t) {
    e.next = Al, Al = e;
    return;
  }
  e.next = Il, Il = e;
}
function gf() {
  Q0++;
}
function hf() {
  if (--Q0 > 0)
    return;
  if (Al) {
    let t = Al;
    for (Al = void 0; t; ) {
      const n = t.next;
      t.next = void 0, t.flags &= -9, t = n;
    }
  }
  let e;
  for (; Il; ) {
    let t = Il;
    for (Il = void 0; t; ) {
      const n = t.next;
      if (t.next = void 0, t.flags &= -9, t.flags & 1)
        try {
          t.trigger();
        } catch (i) {
          e || (e = i);
        }
      t = n;
    }
  }
  if (e) throw e;
}
function q0(e) {
  for (let t = e.deps; t; t = t.nextDep)
    t.version = -1, t.prevActiveLink = t.dep.activeLink, t.dep.activeLink = t;
}
function Z0(e) {
  let t, n = e.depsTail, i = n;
  for (; i; ) {
    const a = i.prevDep;
    i.version === -1 ? (i === n && (n = a), mf(i), h_(i)) : t = i, i.dep.activeLink = i.prevActiveLink, i.prevActiveLink = void 0, i = a;
  }
  e.deps = t, e.depsTail = n;
}
function Id(e) {
  for (let t = e.deps; t; t = t.nextDep)
    if (t.dep.version !== t.version || t.dep.computed && (ev(t.dep.computed) || t.dep.version !== t.version))
      return !0;
  return !!e._dirty;
}
function ev(e) {
  if (e.flags & 4 && !(e.flags & 16) || (e.flags &= -17, e.globalVersion === Vl))
    return;
  e.globalVersion = Vl;
  const t = e.dep;
  if (e.flags |= 2, t.version > 0 && !e.isSSR && e.deps && !Id(e)) {
    e.flags &= -3;
    return;
  }
  const n = at, i = Jr;
  at = e, Jr = !0;
  try {
    q0(e);
    const a = e.fn(e._value);
    (t.version === 0 || po(a, e._value)) && (e._value = a, t.version++);
  } catch (a) {
    throw t.version++, a;
  } finally {
    at = n, Jr = i, Z0(e), e.flags &= -3;
  }
}
function mf(e, t = !1) {
  const { dep: n, prevSub: i, nextSub: a } = e;
  if (i && (i.nextSub = a, e.prevSub = void 0), a && (a.prevSub = i, e.nextSub = void 0), n.subs === e && (n.subs = i, !i && n.computed)) {
    n.computed.flags &= -5;
    for (let s = n.computed.deps; s; s = s.nextDep)
      mf(s, !0);
  }
  !t && !--n.sc && n.map && n.map.delete(n.key);
}
function h_(e) {
  const { prevDep: t, nextDep: n } = e;
  t && (t.nextDep = n, e.prevDep = void 0), n && (n.prevDep = t, e.nextDep = void 0);
}
let Jr = !0;
const tv = [];
function yo() {
  tv.push(Jr), Jr = !1;
}
function _o() {
  const e = tv.pop();
  Jr = e === void 0 ? !0 : e;
}
function Oh(e) {
  const { cleanup: t } = e;
  if (e.cleanup = void 0, t) {
    const n = at;
    at = void 0;
    try {
      t();
    } finally {
      at = n;
    }
  }
}
let Vl = 0;
class m_ {
  constructor(t, n) {
    this.sub = t, this.dep = n, this.version = n.version, this.nextDep = this.prevDep = this.nextSub = this.prevSub = this.prevActiveLink = void 0;
  }
}
class vf {
  constructor(t) {
    this.computed = t, this.version = 0, this.activeLink = void 0, this.subs = void 0, this.map = void 0, this.key = void 0, this.sc = 0;
  }
  track(t) {
    if (!at || !Jr || at === this.computed)
      return;
    let n = this.activeLink;
    if (n === void 0 || n.sub !== at)
      n = this.activeLink = new m_(at, this), at.deps ? (n.prevDep = at.depsTail, at.depsTail.nextDep = n, at.depsTail = n) : at.deps = at.depsTail = n, rv(n);
    else if (n.version === -1 && (n.version = this.version, n.nextDep)) {
      const i = n.nextDep;
      i.prevDep = n.prevDep, n.prevDep && (n.prevDep.nextDep = i), n.prevDep = at.depsTail, n.nextDep = void 0, at.depsTail.nextDep = n, at.depsTail = n, at.deps === n && (at.deps = i);
    }
    return n;
  }
  trigger(t) {
    this.version++, Vl++, this.notify(t);
  }
  notify(t) {
    gf();
    try {
      for (let n = this.subs; n; n = n.prevSub)
        n.sub.notify() && n.sub.dep.notify();
    } finally {
      hf();
    }
  }
}
function rv(e) {
  if (e.dep.sc++, e.sub.flags & 4) {
    const t = e.dep.computed;
    if (t && !e.dep.subs) {
      t.flags |= 20;
      for (let i = t.deps; i; i = i.nextDep)
        rv(i);
    }
    const n = e.dep.subs;
    n !== e && (e.prevSub = n, n && (n.nextSub = e)), e.dep.subs = e;
  }
}
const Ad = /* @__PURE__ */ new WeakMap(), Wo = Symbol(
  ""
), Bd = Symbol(
  ""
), Hl = Symbol(
  ""
);
function Gt(e, t, n) {
  if (Jr && at) {
    let i = Ad.get(e);
    i || Ad.set(e, i = /* @__PURE__ */ new Map());
    let a = i.get(n);
    a || (i.set(n, a = new vf()), a.map = i, a.key = n), a.track();
  }
}
function Pn(e, t, n, i, a, s) {
  const c = Ad.get(e);
  if (!c) {
    Vl++;
    return;
  }
  const f = (d) => {
    d && d.trigger();
  };
  if (gf(), t === "clear")
    c.forEach(f);
  else {
    const d = Ie(e), h = d && pf(n);
    if (d && n === "length") {
      const m = Number(i);
      c.forEach((b, v) => {
        (v === "length" || v === Hl || !jn(v) && v >= m) && f(b);
      });
    } else
      switch ((n !== void 0 || c.has(void 0)) && f(c.get(n)), h && f(c.get(Hl)), t) {
        case "add":
          d ? h && f(c.get("length")) : (f(c.get(Wo)), Pi(e) && f(c.get(Bd)));
          break;
        case "delete":
          d || (f(c.get(Wo)), Pi(e) && f(c.get(Bd)));
          break;
        case "set":
          Pi(e) && f(c.get(Wo));
          break;
      }
  }
  hf();
}
function ki(e) {
  const t = Je(e);
  return t === e ? t : (Gt(t, "iterate", Hl), Br(e) ? t : t.map(Xt));
}
function du(e) {
  return Gt(e = Je(e), "iterate", Hl), e;
}
const v_ = {
  __proto__: null,
  [Symbol.iterator]() {
    return pd(this, Symbol.iterator, Xt);
  },
  concat(...e) {
    return ki(this).concat(
      ...e.map((t) => Ie(t) ? ki(t) : t)
    );
  },
  entries() {
    return pd(this, "entries", (e) => (e[1] = Xt(e[1]), e));
  },
  every(e, t) {
    return $n(this, "every", e, t, void 0, arguments);
  },
  filter(e, t) {
    return $n(this, "filter", e, t, (n) => n.map(Xt), arguments);
  },
  find(e, t) {
    return $n(this, "find", e, t, Xt, arguments);
  },
  findIndex(e, t) {
    return $n(this, "findIndex", e, t, void 0, arguments);
  },
  findLast(e, t) {
    return $n(this, "findLast", e, t, Xt, arguments);
  },
  findLastIndex(e, t) {
    return $n(this, "findLastIndex", e, t, void 0, arguments);
  },
  // flat, flatMap could benefit from ARRAY_ITERATE but are not straight-forward to implement
  forEach(e, t) {
    return $n(this, "forEach", e, t, void 0, arguments);
  },
  includes(...e) {
    return gd(this, "includes", e);
  },
  indexOf(...e) {
    return gd(this, "indexOf", e);
  },
  join(e) {
    return ki(this).join(e);
  },
  // keys() iterator only reads `length`, no optimisation required
  lastIndexOf(...e) {
    return gd(this, "lastIndexOf", e);
  },
  map(e, t) {
    return $n(this, "map", e, t, void 0, arguments);
  },
  pop() {
    return Sl(this, "pop");
  },
  push(...e) {
    return Sl(this, "push", e);
  },
  reduce(e, ...t) {
    return Lh(this, "reduce", e, t);
  },
  reduceRight(e, ...t) {
    return Lh(this, "reduceRight", e, t);
  },
  shift() {
    return Sl(this, "shift");
  },
  // slice could use ARRAY_ITERATE but also seems to beg for range tracking
  some(e, t) {
    return $n(this, "some", e, t, void 0, arguments);
  },
  splice(...e) {
    return Sl(this, "splice", e);
  },
  toReversed() {
    return ki(this).toReversed();
  },
  toSorted(e) {
    return ki(this).toSorted(e);
  },
  toSpliced(...e) {
    return ki(this).toSpliced(...e);
  },
  unshift(...e) {
    return Sl(this, "unshift", e);
  },
  values() {
    return pd(this, "values", Xt);
  }
};
function pd(e, t, n) {
  const i = du(e), a = i[t]();
  return i !== e && !Br(e) && (a._next = a.next, a.next = () => {
    const s = a._next();
    return s.value && (s.value = n(s.value)), s;
  }), a;
}
const b_ = Array.prototype;
function $n(e, t, n, i, a, s) {
  const c = du(e), f = c !== e && !Br(e), d = c[t];
  if (d !== b_[t]) {
    const b = d.apply(e, s);
    return f ? Xt(b) : b;
  }
  let h = n;
  c !== e && (f ? h = function(b, v) {
    return n.call(this, Xt(b), v, e);
  } : n.length > 2 && (h = function(b, v) {
    return n.call(this, b, v, e);
  }));
  const m = d.call(c, h, i);
  return f && a ? a(m) : m;
}
function Lh(e, t, n, i) {
  const a = du(e);
  let s = n;
  return a !== e && (Br(e) ? n.length > 3 && (s = function(c, f, d) {
    return n.call(this, c, f, d, e);
  }) : s = function(c, f, d) {
    return n.call(this, c, Xt(f), d, e);
  }), a[t](s, ...i);
}
function gd(e, t, n) {
  const i = Je(e);
  Gt(i, "iterate", Hl);
  const a = i[t](...n);
  return (a === -1 || a === !1) && kf(n[0]) ? (n[0] = Je(n[0]), i[t](...n)) : a;
}
function Sl(e, t, n = []) {
  yo(), gf();
  const i = Je(e)[t].apply(e, n);
  return hf(), _o(), i;
}
const y_ = /* @__PURE__ */ cf("__proto__,__v_isRef,__isVue"), nv = new Set(
  /* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((e) => e !== "arguments" && e !== "caller").map((e) => Symbol[e]).filter(jn)
);
function __(e) {
  jn(e) || (e = String(e));
  const t = Je(this);
  return Gt(t, "has", e), t.hasOwnProperty(e);
}
class ov {
  constructor(t = !1, n = !1) {
    this._isReadonly = t, this._isShallow = n;
  }
  get(t, n, i) {
    if (n === "__v_skip") return t.__v_skip;
    const a = this._isReadonly, s = this._isShallow;
    if (n === "__v_isReactive")
      return !a;
    if (n === "__v_isReadonly")
      return a;
    if (n === "__v_isShallow")
      return s;
    if (n === "__v_raw")
      return i === (a ? s ? L_ : sv : s ? av : lv).get(t) || // receiver is not the reactive proxy, but has the same prototype
      // this means the receiver is a user proxy of the reactive proxy
      Object.getPrototypeOf(t) === Object.getPrototypeOf(i) ? t : void 0;
    const c = Ie(t);
    if (!a) {
      let d;
      if (c && (d = v_[n]))
        return d;
      if (n === "hasOwnProperty")
        return __;
    }
    const f = Reflect.get(
      t,
      n,
      // if this is a proxy wrapping a ref, return methods using the raw ref
      // as receiver so that we don't have to call `toRaw` on the ref in all
      // its class methods
      zt(t) ? t : i
    );
    return (jn(n) ? nv.has(n) : y_(n)) || (a || Gt(t, "get", n), s) ? f : zt(f) ? c && pf(n) ? f : f.value : ht(f) ? a ? yf(f) : fu(f) : f;
  }
}
class iv extends ov {
  constructor(t = !1) {
    super(!1, t);
  }
  set(t, n, i, a) {
    let s = t[n];
    if (!this._isShallow) {
      const d = Ko(s);
      if (!Br(i) && !Ko(i) && (s = Je(s), i = Je(i)), !Ie(t) && zt(s) && !zt(i))
        return d ? !1 : (s.value = i, !0);
    }
    const c = Ie(t) && pf(n) ? Number(n) < t.length : qe(t, n), f = Reflect.set(
      t,
      n,
      i,
      zt(t) ? t : a
    );
    return t === Je(a) && (c ? po(i, s) && Pn(t, "set", n, i) : Pn(t, "add", n, i)), f;
  }
  deleteProperty(t, n) {
    const i = qe(t, n);
    t[n];
    const a = Reflect.deleteProperty(t, n);
    return a && i && Pn(t, "delete", n, void 0), a;
  }
  has(t, n) {
    const i = Reflect.has(t, n);
    return (!jn(n) || !nv.has(n)) && Gt(t, "has", n), i;
  }
  ownKeys(t) {
    return Gt(
      t,
      "iterate",
      Ie(t) ? "length" : Wo
    ), Reflect.ownKeys(t);
  }
}
class k_ extends ov {
  constructor(t = !1) {
    super(!0, t);
  }
  set(t, n) {
    return !0;
  }
  deleteProperty(t, n) {
    return !0;
  }
}
const w_ = /* @__PURE__ */ new iv(), S_ = /* @__PURE__ */ new k_(), C_ = /* @__PURE__ */ new iv(!0);
const Dd = (e) => e, xs = (e) => Reflect.getPrototypeOf(e);
function x_(e, t, n) {
  return function(...i) {
    const a = this.__v_raw, s = Je(a), c = Pi(s), f = e === "entries" || e === Symbol.iterator && c, d = e === "keys" && c, h = a[e](...i), m = n ? Dd : t ? Md : Xt;
    return !t && Gt(
      s,
      "iterate",
      d ? Bd : Wo
    ), {
      // iterator protocol
      next() {
        const { value: b, done: v } = h.next();
        return v ? { value: b, done: v } : {
          value: f ? [m(b[0]), m(b[1])] : m(b),
          done: v
        };
      },
      // iterable protocol
      [Symbol.iterator]() {
        return this;
      }
    };
  };
}
function $s(e) {
  return function(...t) {
    return e === "delete" ? !1 : e === "clear" ? void 0 : this;
  };
}
function $_(e, t) {
  const n = {
    get(a) {
      const s = this.__v_raw, c = Je(s), f = Je(a);
      e || (po(a, f) && Gt(c, "get", a), Gt(c, "get", f));
      const { has: d } = xs(c), h = t ? Dd : e ? Md : Xt;
      if (d.call(c, a))
        return h(s.get(a));
      if (d.call(c, f))
        return h(s.get(f));
      s !== c && s.get(a);
    },
    get size() {
      const a = this.__v_raw;
      return !e && Gt(Je(a), "iterate", Wo), Reflect.get(a, "size", a);
    },
    has(a) {
      const s = this.__v_raw, c = Je(s), f = Je(a);
      return e || (po(a, f) && Gt(c, "has", a), Gt(c, "has", f)), a === f ? s.has(a) : s.has(a) || s.has(f);
    },
    forEach(a, s) {
      const c = this, f = c.__v_raw, d = Je(f), h = t ? Dd : e ? Md : Xt;
      return !e && Gt(d, "iterate", Wo), f.forEach((m, b) => a.call(s, h(m), h(b), c));
    }
  };
  return Jt(
    n,
    e ? {
      add: $s("add"),
      set: $s("set"),
      delete: $s("delete"),
      clear: $s("clear")
    } : {
      add(a) {
        !t && !Br(a) && !Ko(a) && (a = Je(a));
        const s = Je(this);
        return xs(s).has.call(s, a) || (s.add(a), Pn(s, "add", a, a)), this;
      },
      set(a, s) {
        !t && !Br(s) && !Ko(s) && (s = Je(s));
        const c = Je(this), { has: f, get: d } = xs(c);
        let h = f.call(c, a);
        h || (a = Je(a), h = f.call(c, a));
        const m = d.call(c, a);
        return c.set(a, s), h ? po(s, m) && Pn(c, "set", a, s) : Pn(c, "add", a, s), this;
      },
      delete(a) {
        const s = Je(this), { has: c, get: f } = xs(s);
        let d = c.call(s, a);
        d || (a = Je(a), d = c.call(s, a)), f && f.call(s, a);
        const h = s.delete(a);
        return d && Pn(s, "delete", a, void 0), h;
      },
      clear() {
        const a = Je(this), s = a.size !== 0, c = a.clear();
        return s && Pn(
          a,
          "clear",
          void 0,
          void 0
        ), c;
      }
    }
  ), [
    "keys",
    "values",
    "entries",
    Symbol.iterator
  ].forEach((a) => {
    n[a] = x_(a, e, t);
  }), n;
}
function bf(e, t) {
  const n = $_(e, t);
  return (i, a, s) => a === "__v_isReactive" ? !e : a === "__v_isReadonly" ? e : a === "__v_raw" ? i : Reflect.get(
    qe(n, a) && a in i ? n : i,
    a,
    s
  );
}
const E_ = {
  get: /* @__PURE__ */ bf(!1, !1)
}, T_ = {
  get: /* @__PURE__ */ bf(!1, !0)
}, O_ = {
  get: /* @__PURE__ */ bf(!0, !1)
};
const lv = /* @__PURE__ */ new WeakMap(), av = /* @__PURE__ */ new WeakMap(), sv = /* @__PURE__ */ new WeakMap(), L_ = /* @__PURE__ */ new WeakMap();
function P_(e) {
  switch (e) {
    case "Object":
    case "Array":
      return 1;
    case "Map":
    case "Set":
    case "WeakMap":
    case "WeakSet":
      return 2;
    default:
      return 0;
  }
}
function N_(e) {
  return e.__v_skip || !Object.isExtensible(e) ? 0 : P_(n_(e));
}
function fu(e) {
  return Ko(e) ? e : _f(
    e,
    !1,
    w_,
    E_,
    lv
  );
}
function R_(e) {
  return _f(
    e,
    !1,
    C_,
    T_,
    av
  );
}
function yf(e) {
  return _f(
    e,
    !0,
    S_,
    O_,
    sv
  );
}
function _f(e, t, n, i, a) {
  if (!ht(e) || e.__v_raw && !(t && e.__v_isReactive))
    return e;
  const s = a.get(e);
  if (s)
    return s;
  const c = N_(e);
  if (c === 0)
    return e;
  const f = new Proxy(
    e,
    c === 2 ? i : n
  );
  return a.set(e, f), f;
}
function Ni(e) {
  return Ko(e) ? Ni(e.__v_raw) : !!(e && e.__v_isReactive);
}
function Ko(e) {
  return !!(e && e.__v_isReadonly);
}
function Br(e) {
  return !!(e && e.__v_isShallow);
}
function kf(e) {
  return e ? !!e.__v_raw : !1;
}
function Je(e) {
  const t = e && e.__v_raw;
  return t ? Je(t) : e;
}
function I_(e) {
  return !qe(e, "__v_skip") && Object.isExtensible(e) && V0(e, "__v_skip", !0), e;
}
const Xt = (e) => ht(e) ? fu(e) : e, Md = (e) => ht(e) ? yf(e) : e;
function zt(e) {
  return e ? e.__v_isRef === !0 : !1;
}
function ot(e) {
  return uv(e, !1);
}
function wf(e) {
  return uv(e, !0);
}
function uv(e, t) {
  return zt(e) ? e : new A_(e, t);
}
class A_ {
  constructor(t, n) {
    this.dep = new vf(), this.__v_isRef = !0, this.__v_isShallow = !1, this._rawValue = n ? t : Je(t), this._value = n ? t : Xt(t), this.__v_isShallow = n;
  }
  get value() {
    return this.dep.track(), this._value;
  }
  set value(t) {
    const n = this._rawValue, i = this.__v_isShallow || Br(t) || Ko(t);
    t = i ? t : Je(t), po(t, n) && (this._rawValue = t, this._value = i ? t : Xt(t), this.dep.trigger());
  }
}
function xt(e) {
  return zt(e) ? e.value : e;
}
const B_ = {
  get: (e, t, n) => t === "__v_raw" ? e : xt(Reflect.get(e, t, n)),
  set: (e, t, n, i) => {
    const a = e[t];
    return zt(a) && !zt(n) ? (a.value = n, !0) : Reflect.set(e, t, n, i);
  }
};
function cv(e) {
  return Ni(e) ? e : new Proxy(e, B_);
}
class D_ {
  constructor(t, n, i) {
    this.fn = t, this.setter = n, this._value = void 0, this.dep = new vf(this), this.__v_isRef = !0, this.deps = void 0, this.depsTail = void 0, this.flags = 16, this.globalVersion = Vl - 1, this.next = void 0, this.effect = this, this.__v_isReadonly = !n, this.isSSR = i;
  }
  /**
   * @internal
   */
  notify() {
    if (this.flags |= 16, !(this.flags & 8) && // avoid infinite self recursion
    at !== this)
      return J0(this, !0), !0;
  }
  get value() {
    const t = this.dep.track();
    return ev(this), t && (t.version = this.dep.version), this._value;
  }
  set value(t) {
    this.setter && this.setter(t);
  }
}
function M_(e, t, n = !1) {
  let i, a;
  return Be(e) ? i = e : (i = e.get, a = e.set), new D_(i, a, n);
}
const Es = {}, Fs = /* @__PURE__ */ new WeakMap();
let zo;
function j_(e, t = !1, n = zo) {
  if (n) {
    let i = Fs.get(n);
    i || Fs.set(n, i = []), i.push(e);
  }
}
function F_(e, t, n = it) {
  const { immediate: i, deep: a, once: s, scheduler: c, augmentJob: f, call: d } = n, h = (S) => a ? S : Br(S) || a === !1 || a === 0 ? Nn(S, 1) : Nn(S);
  let m, b, v, _, x = !1, T = !1;
  if (zt(e) ? (b = () => e.value, x = Br(e)) : Ni(e) ? (b = () => h(e), x = !0) : Ie(e) ? (T = !0, x = e.some((S) => Ni(S) || Br(S)), b = () => e.map((S) => {
    if (zt(S))
      return S.value;
    if (Ni(S))
      return h(S);
    if (Be(S))
      return d ? d(S, 2) : S();
  })) : Be(e) ? t ? b = d ? () => d(e, 2) : e : b = () => {
    if (v) {
      yo();
      try {
        v();
      } finally {
        _o();
      }
    }
    const S = zo;
    zo = m;
    try {
      return d ? d(e, 3, [_]) : e(_);
    } finally {
      zo = S;
    }
  } : b = pn, t && a) {
    const S = b, B = a === !0 ? 1 / 0 : a;
    b = () => Nn(S(), B);
  }
  const R = g_(), D = () => {
    m.stop(), R && R.active && ff(R.effects, m);
  };
  if (s && t) {
    const S = t;
    t = (...B) => {
      S(...B), D();
    };
  }
  let K = T ? new Array(e.length).fill(Es) : Es;
  const L = (S) => {
    if (!(!(m.flags & 1) || !m.dirty && !S))
      if (t) {
        const B = m.run();
        if (a || x || (T ? B.some((I, F) => po(I, K[F])) : po(B, K))) {
          v && v();
          const I = zo;
          zo = m;
          try {
            const F = [
              B,
              // pass undefined as the old value when it's changed for the first time
              K === Es ? void 0 : T && K[0] === Es ? [] : K,
              _
            ];
            d ? d(t, 3, F) : (
              // @ts-expect-error
              t(...F)
            ), K = B;
          } finally {
            zo = I;
          }
        }
      } else
        m.run();
  };
  return f && f(L), m = new X0(b), m.scheduler = c ? () => c(L, !1) : L, _ = (S) => j_(S, !1, m), v = m.onStop = () => {
    const S = Fs.get(m);
    if (S) {
      if (d)
        d(S, 4);
      else
        for (const B of S) B();
      Fs.delete(m);
    }
  }, t ? i ? L(!0) : K = m.run() : c ? c(L.bind(null, !0), !0) : m.run(), D.pause = m.pause.bind(m), D.resume = m.resume.bind(m), D.stop = D, D;
}
function Nn(e, t = 1 / 0, n) {
  if (t <= 0 || !ht(e) || e.__v_skip || (n = n || /* @__PURE__ */ new Set(), n.has(e)))
    return e;
  if (n.add(e), t--, zt(e))
    Nn(e.value, t, n);
  else if (Ie(e))
    for (let i = 0; i < e.length; i++)
      Nn(e[i], t, n);
  else if (F0(e) || Pi(e))
    e.forEach((i) => {
      Nn(i, t, n);
    });
  else if (W0(e)) {
    for (const i in e)
      Nn(e[i], t, n);
    for (const i of Object.getOwnPropertySymbols(e))
      Object.prototype.propertyIsEnumerable.call(e, i) && Nn(e[i], t, n);
  }
  return e;
}
/**
* @vue/runtime-core v3.5.13
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
function fa(e, t, n, i) {
  try {
    return i ? e(...i) : e();
  } catch (a) {
    pu(a, t, n);
  }
}
function hn(e, t, n, i) {
  if (Be(e)) {
    const a = fa(e, t, n, i);
    return a && z0(a) && a.catch((s) => {
      pu(s, t, n);
    }), a;
  }
  if (Ie(e)) {
    const a = [];
    for (let s = 0; s < e.length; s++)
      a.push(hn(e[s], t, n, i));
    return a;
  }
}
function pu(e, t, n, i = !0) {
  const a = t ? t.vnode : null, { errorHandler: s, throwUnhandledErrorInProduction: c } = t && t.appContext.config || it;
  if (t) {
    let f = t.parent;
    const d = t.proxy, h = `https://vuejs.org/error-reference/#runtime-${n}`;
    for (; f; ) {
      const m = f.ec;
      if (m) {
        for (let b = 0; b < m.length; b++)
          if (m[b](e, d, h) === !1)
            return;
      }
      f = f.parent;
    }
    if (s) {
      yo(), fa(s, null, 10, [
        e,
        d,
        h
      ]), _o();
      return;
    }
  }
  z_(e, n, a, i, c);
}
function z_(e, t, n, i = !0, a = !1) {
  if (a)
    throw e;
  console.error(e);
}
const or = [];
let sn = -1;
const Ri = [];
let so = null, xi = 0;
const dv = /* @__PURE__ */ Promise.resolve();
let zs = null;
function Sf(e) {
  const t = zs || dv;
  return e ? t.then(this ? e.bind(this) : e) : t;
}
function U_(e) {
  let t = sn + 1, n = or.length;
  for (; t < n; ) {
    const i = t + n >>> 1, a = or[i], s = Kl(a);
    s < e || s === e && a.flags & 2 ? t = i + 1 : n = i;
  }
  return t;
}
function Cf(e) {
  if (!(e.flags & 1)) {
    const t = Kl(e), n = or[or.length - 1];
    !n || // fast path when the job id is larger than the tail
    !(e.flags & 2) && t >= Kl(n) ? or.push(e) : or.splice(U_(t), 0, e), e.flags |= 1, fv();
  }
}
function fv() {
  zs || (zs = dv.then(gv));
}
function W_(e) {
  Ie(e) ? Ri.push(...e) : so && e.id === -1 ? so.splice(xi + 1, 0, e) : e.flags & 1 || (Ri.push(e), e.flags |= 1), fv();
}
function Ph(e, t, n = sn + 1) {
  for (; n < or.length; n++) {
    const i = or[n];
    if (i && i.flags & 2) {
      if (e && i.id !== e.uid)
        continue;
      or.splice(n, 1), n--, i.flags & 4 && (i.flags &= -2), i(), i.flags & 4 || (i.flags &= -2);
    }
  }
}
function pv(e) {
  if (Ri.length) {
    const t = [...new Set(Ri)].sort(
      (n, i) => Kl(n) - Kl(i)
    );
    if (Ri.length = 0, so) {
      so.push(...t);
      return;
    }
    for (so = t, xi = 0; xi < so.length; xi++) {
      const n = so[xi];
      n.flags & 4 && (n.flags &= -2), n.flags & 8 || n(), n.flags &= -2;
    }
    so = null, xi = 0;
  }
}
const Kl = (e) => e.id == null ? e.flags & 2 ? -1 : 1 / 0 : e.id;
function gv(e) {
  try {
    for (sn = 0; sn < or.length; sn++) {
      const t = or[sn];
      t && !(t.flags & 8) && (t.flags & 4 && (t.flags &= -2), fa(
        t,
        t.i,
        t.i ? 15 : 14
      ), t.flags & 4 || (t.flags &= -2));
    }
  } finally {
    for (; sn < or.length; sn++) {
      const t = or[sn];
      t && (t.flags &= -2);
    }
    sn = -1, or.length = 0, pv(), zs = null, (or.length || Ri.length) && gv();
  }
}
let At = null, hv = null;
function Us(e) {
  const t = At;
  return At = e, hv = e && e.type.__scopeId || null, t;
}
function Bl(e, t = At, n) {
  if (!t || e._n)
    return e;
  const i = (...a) => {
    i._d && Uh(-1);
    const s = Us(t);
    let c;
    try {
      c = e(...a);
    } finally {
      Us(s), i._d && Uh(1);
    }
    return c;
  };
  return i._n = !0, i._c = !0, i._d = !0, i;
}
function mv(e, t) {
  if (At === null)
    return e;
  const n = mu(At), i = e.dirs || (e.dirs = []);
  for (let a = 0; a < t.length; a++) {
    let [s, c, f, d = it] = t[a];
    s && (Be(s) && (s = {
      mounted: s,
      updated: s
    }), s.deep && Nn(c), i.push({
      dir: s,
      instance: n,
      value: c,
      oldValue: void 0,
      arg: f,
      modifiers: d
    }));
  }
  return e;
}
function Do(e, t, n, i) {
  const a = e.dirs, s = t && t.dirs;
  for (let c = 0; c < a.length; c++) {
    const f = a[c];
    s && (f.oldValue = s[c].value);
    let d = f.dir[i];
    d && (yo(), hn(d, n, 8, [
      e.el,
      f,
      e,
      t
    ]), _o());
  }
}
const V_ = Symbol("_vte"), H_ = (e) => e.__isTeleport;
function xf(e, t) {
  e.shapeFlag & 6 && e.component ? (e.transition = t, xf(e.component.subTree, t)) : e.shapeFlag & 128 ? (e.ssContent.transition = t.clone(e.ssContent), e.ssFallback.transition = t.clone(e.ssFallback)) : e.transition = t;
}
/*! #__NO_SIDE_EFFECTS__ */
// @__NO_SIDE_EFFECTS__
function Go(e, t) {
  return Be(e) ? (
    // #8236: extend call and options.name access are considered side-effects
    // by Rollup, so we have to wrap it in a pure-annotated IIFE.
    Jt({ name: e.name }, t, { setup: e })
  ) : e;
}
function K_() {
  const e = vo();
  return e ? (e.appContext.config.idPrefix || "v") + "-" + e.ids[0] + e.ids[1]++ : "";
}
function vv(e) {
  e.ids = [e.ids[0] + e.ids[2]++ + "-", 0, 0];
}
function Ws(e, t, n, i, a = !1) {
  if (Ie(e)) {
    e.forEach(
      (x, T) => Ws(
        x,
        t && (Ie(t) ? t[T] : t),
        n,
        i,
        a
      )
    );
    return;
  }
  if (Ii(i) && !a) {
    i.shapeFlag & 512 && i.type.__asyncResolved && i.component.subTree.component && Ws(e, t, n, i.component.subTree);
    return;
  }
  const s = i.shapeFlag & 4 ? mu(i.component) : i.el, c = a ? null : s, { i: f, r: d } = e, h = t && t.r, m = f.refs === it ? f.refs = {} : f.refs, b = f.setupState, v = Je(b), _ = b === it ? () => !1 : (x) => qe(v, x);
  if (h != null && h !== d && (St(h) ? (m[h] = null, _(h) && (b[h] = null)) : zt(h) && (h.value = null)), Be(d))
    fa(d, f, 12, [c, m]);
  else {
    const x = St(d), T = zt(d);
    if (x || T) {
      const R = () => {
        if (e.f) {
          const D = x ? _(d) ? b[d] : m[d] : d.value;
          a ? Ie(D) && ff(D, s) : Ie(D) ? D.includes(s) || D.push(s) : x ? (m[d] = [s], _(d) && (b[d] = m[d])) : (d.value = [s], e.k && (m[e.k] = d.value));
        } else x ? (m[d] = c, _(d) && (b[d] = c)) : T && (d.value = c, e.k && (m[e.k] = c));
      };
      c ? (R.id = -1, wr(R, n)) : R();
    }
  }
}
uu().requestIdleCallback;
uu().cancelIdleCallback;
const Ii = (e) => !!e.type.__asyncLoader, bv = (e) => e.type.__isKeepAlive;
function Y_(e, t) {
  yv(e, "a", t);
}
function G_(e, t) {
  yv(e, "da", t);
}
function yv(e, t, n = Ft) {
  const i = e.__wdc || (e.__wdc = () => {
    let a = n;
    for (; a; ) {
      if (a.isDeactivated)
        return;
      a = a.parent;
    }
    return e();
  });
  if (gu(t, i, n), n) {
    let a = n.parent;
    for (; a && a.parent; )
      bv(a.parent.vnode) && X_(i, t, n, a), a = a.parent;
  }
}
function X_(e, t, n, i) {
  const a = gu(
    t,
    e,
    i,
    !0
    /* prepend */
  );
  $f(() => {
    ff(i[t], a);
  }, n);
}
function gu(e, t, n = Ft, i = !1) {
  if (n) {
    const a = n[e] || (n[e] = []), s = t.__weh || (t.__weh = (...c) => {
      yo();
      const f = ha(n), d = hn(t, n, e, c);
      return f(), _o(), d;
    });
    return i ? a.unshift(s) : a.push(s), s;
  }
}
const Fn = (e) => (t, n = Ft) => {
  (!Xl || e === "sp") && gu(e, (...i) => t(...i), n);
}, _v = Fn("bm"), pa = Fn("m"), Q_ = Fn(
  "bu"
), J_ = Fn("u"), kv = Fn(
  "bum"
), $f = Fn("um"), q_ = Fn(
  "sp"
), Z_ = Fn("rtg"), ek = Fn("rtc");
function tk(e, t = Ft) {
  gu("ec", e, t);
}
const Ef = "components", rk = "directives";
function Nh(e, t) {
  return Tf(Ef, e, !0, t) || e;
}
const wv = Symbol.for("v-ndc");
function nk(e) {
  return St(e) ? Tf(Ef, e, !1) || e : e || wv;
}
function Sv(e) {
  return Tf(rk, e);
}
function Tf(e, t, n = !0, i = !1) {
  const a = At || Ft;
  if (a) {
    const s = a.type;
    if (e === Ef) {
      const f = Vk(
        s,
        !1
      );
      if (f && (f === t || f === Dr(t) || f === su(Dr(t))))
        return s;
    }
    const c = (
      // local registration
      // check instance[type] first which is resolved for options API
      Rh(a[e] || s[e], t) || // global registration
      Rh(a.appContext[e], t)
    );
    return !c && i ? s : c;
  }
}
function Rh(e, t) {
  return e && (e[t] || e[Dr(t)] || e[su(Dr(t))]);
}
function ok(e, t, n, i) {
  let a;
  const s = n, c = Ie(e);
  if (c || St(e)) {
    const f = c && Ni(e);
    let d = !1;
    f && (d = !Br(e), e = du(e)), a = new Array(e.length);
    for (let h = 0, m = e.length; h < m; h++)
      a[h] = t(
        d ? Xt(e[h]) : e[h],
        h,
        void 0,
        s
      );
  } else if (typeof e == "number") {
    a = new Array(e);
    for (let f = 0; f < e; f++)
      a[f] = t(f + 1, f, void 0, s);
  } else if (ht(e))
    if (e[Symbol.iterator])
      a = Array.from(
        e,
        (f, d) => t(f, d, void 0, s)
      );
    else {
      const f = Object.keys(e);
      a = new Array(f.length);
      for (let d = 0, h = f.length; d < h; d++) {
        const m = f[d];
        a[d] = t(e[m], m, d, s);
      }
    }
  else
    a = [];
  return a;
}
function Ol(e, t, n = {}, i, a) {
  if (At.ce || At.parent && Ii(At.parent) && At.parent.ce)
    return t !== "default" && (n.name = t), It(), go(
      Qt,
      null,
      [Ot("slot", n, i && i())],
      64
    );
  let s = e[t];
  s && s._c && (s._d = !1), It();
  const c = s && Cv(s(n)), f = n.key || // slot content array of a dynamic conditional slot may have a branch
  // key attached in the `createSlots` helper, respect that
  c && c.key, d = go(
    Qt,
    {
      key: (f && !jn(f) ? f : `_${t}`) + // #7256 force differentiate fallback content from actual content
      (!c && i ? "_fb" : "")
    },
    c || (i ? i() : []),
    c && e._ === 1 ? 64 : -2
  );
  return d.scopeId && (d.slotScopeIds = [d.scopeId + "-s"]), s && s._c && (s._d = !0), d;
}
function Cv(e) {
  return e.some((t) => Gl(t) ? !(t.type === mo || t.type === Qt && !Cv(t.children)) : !0) ? e : null;
}
const jd = (e) => e ? Hv(e) ? mu(e) : jd(e.parent) : null, Dl = (
  // Move PURE marker to new line to workaround compiler discarding it
  // due to type annotation
  /* @__PURE__ */ Jt(/* @__PURE__ */ Object.create(null), {
    $: (e) => e,
    $el: (e) => e.vnode.el,
    $data: (e) => e.data,
    $props: (e) => e.props,
    $attrs: (e) => e.attrs,
    $slots: (e) => e.slots,
    $refs: (e) => e.refs,
    $parent: (e) => jd(e.parent),
    $root: (e) => jd(e.root),
    $host: (e) => e.ce,
    $emit: (e) => e.emit,
    $options: (e) => $v(e),
    $forceUpdate: (e) => e.f || (e.f = () => {
      Cf(e.update);
    }),
    $nextTick: (e) => e.n || (e.n = Sf.bind(e.proxy)),
    $watch: (e) => $k.bind(e)
  })
), hd = (e, t) => e !== it && !e.__isScriptSetup && qe(e, t), ik = {
  get({ _: e }, t) {
    if (t === "__v_skip")
      return !0;
    const { ctx: n, setupState: i, data: a, props: s, accessCache: c, type: f, appContext: d } = e;
    let h;
    if (t[0] !== "$") {
      const _ = c[t];
      if (_ !== void 0)
        switch (_) {
          case 1:
            return i[t];
          case 2:
            return a[t];
          case 4:
            return n[t];
          case 3:
            return s[t];
        }
      else {
        if (hd(i, t))
          return c[t] = 1, i[t];
        if (a !== it && qe(a, t))
          return c[t] = 2, a[t];
        if (
          // only cache other properties when instance has declared (thus stable)
          // props
          (h = e.propsOptions[0]) && qe(h, t)
        )
          return c[t] = 3, s[t];
        if (n !== it && qe(n, t))
          return c[t] = 4, n[t];
        Fd && (c[t] = 0);
      }
    }
    const m = Dl[t];
    let b, v;
    if (m)
      return t === "$attrs" && Gt(e.attrs, "get", ""), m(e);
    if (
      // css module (injected by vue-loader)
      (b = f.__cssModules) && (b = b[t])
    )
      return b;
    if (n !== it && qe(n, t))
      return c[t] = 4, n[t];
    if (
      // global properties
      v = d.config.globalProperties, qe(v, t)
    )
      return v[t];
  },
  set({ _: e }, t, n) {
    const { data: i, setupState: a, ctx: s } = e;
    return hd(a, t) ? (a[t] = n, !0) : i !== it && qe(i, t) ? (i[t] = n, !0) : qe(e.props, t) || t[0] === "$" && t.slice(1) in e ? !1 : (s[t] = n, !0);
  },
  has({
    _: { data: e, setupState: t, accessCache: n, ctx: i, appContext: a, propsOptions: s }
  }, c) {
    let f;
    return !!n[c] || e !== it && qe(e, c) || hd(t, c) || (f = s[0]) && qe(f, c) || qe(i, c) || qe(Dl, c) || qe(a.config.globalProperties, c);
  },
  defineProperty(e, t, n) {
    return n.get != null ? e._.accessCache[t] = 0 : qe(n, "value") && this.set(e, t, n.value, null), Reflect.defineProperty(e, t, n);
  }
};
function Ih(e) {
  return Ie(e) ? e.reduce(
    (t, n) => (t[n] = null, t),
    {}
  ) : e;
}
let Fd = !0;
function lk(e) {
  const t = $v(e), n = e.proxy, i = e.ctx;
  Fd = !1, t.beforeCreate && Ah(t.beforeCreate, e, "bc");
  const {
    // state
    data: a,
    computed: s,
    methods: c,
    watch: f,
    provide: d,
    inject: h,
    // lifecycle
    created: m,
    beforeMount: b,
    mounted: v,
    beforeUpdate: _,
    updated: x,
    activated: T,
    deactivated: R,
    beforeDestroy: D,
    beforeUnmount: K,
    destroyed: L,
    unmounted: S,
    render: B,
    renderTracked: I,
    renderTriggered: F,
    errorCaptured: te,
    serverPrefetch: re,
    // public API
    expose: Se,
    inheritAttrs: Pe,
    // assets
    components: be,
    directives: we,
    filters: De
  } = t;
  if (h && ak(h, i, null), c)
    for (const he in c) {
      const V = c[he];
      Be(V) && (i[he] = V.bind(n));
    }
  if (a) {
    const he = a.call(n, n);
    ht(he) && (e.data = fu(he));
  }
  if (Fd = !0, s)
    for (const he in s) {
      const V = s[he], oe = Be(V) ? V.bind(n, n) : Be(V.get) ? V.get.bind(n, n) : pn, q = !Be(V) && Be(V.set) ? V.set.bind(n) : pn, P = Gr({
        get: oe,
        set: q
      });
      Object.defineProperty(i, he, {
        enumerable: !0,
        configurable: !0,
        get: () => P.value,
        set: (X) => P.value = X
      });
    }
  if (f)
    for (const he in f)
      xv(f[he], i, n, he);
  if (d) {
    const he = Be(d) ? d.call(n) : d;
    Reflect.ownKeys(he).forEach((V) => {
      pk(V, he[V]);
    });
  }
  m && Ah(m, e, "c");
  function ge(he, V) {
    Ie(V) ? V.forEach((oe) => he(oe.bind(n))) : V && he(V.bind(n));
  }
  if (ge(_v, b), ge(pa, v), ge(Q_, _), ge(J_, x), ge(Y_, T), ge(G_, R), ge(tk, te), ge(ek, I), ge(Z_, F), ge(kv, K), ge($f, S), ge(q_, re), Ie(Se))
    if (Se.length) {
      const he = e.exposed || (e.exposed = {});
      Se.forEach((V) => {
        Object.defineProperty(he, V, {
          get: () => n[V],
          set: (oe) => n[V] = oe
        });
      });
    } else e.exposed || (e.exposed = {});
  B && e.render === pn && (e.render = B), Pe != null && (e.inheritAttrs = Pe), be && (e.components = be), we && (e.directives = we), re && vv(e);
}
function ak(e, t, n = pn) {
  Ie(e) && (e = zd(e));
  for (const i in e) {
    const a = e[i];
    let s;
    ht(a) ? "default" in a ? s = Ml(
      a.from || i,
      a.default,
      !0
    ) : s = Ml(a.from || i) : s = Ml(a), zt(s) ? Object.defineProperty(t, i, {
      enumerable: !0,
      configurable: !0,
      get: () => s.value,
      set: (c) => s.value = c
    }) : t[i] = s;
  }
}
function Ah(e, t, n) {
  hn(
    Ie(e) ? e.map((i) => i.bind(t.proxy)) : e.bind(t.proxy),
    t,
    n
  );
}
function xv(e, t, n, i) {
  let a = i.includes(".") ? Fv(n, i) : () => n[i];
  if (St(e)) {
    const s = t[e];
    Be(s) && Ir(a, s);
  } else if (Be(e))
    Ir(a, e.bind(n));
  else if (ht(e))
    if (Ie(e))
      e.forEach((s) => xv(s, t, n, i));
    else {
      const s = Be(e.handler) ? e.handler.bind(n) : t[e.handler];
      Be(s) && Ir(a, s, e);
    }
}
function $v(e) {
  const t = e.type, { mixins: n, extends: i } = t, {
    mixins: a,
    optionsCache: s,
    config: { optionMergeStrategies: c }
  } = e.appContext, f = s.get(t);
  let d;
  return f ? d = f : !a.length && !n && !i ? d = t : (d = {}, a.length && a.forEach(
    (h) => Vs(d, h, c, !0)
  ), Vs(d, t, c)), ht(t) && s.set(t, d), d;
}
function Vs(e, t, n, i = !1) {
  const { mixins: a, extends: s } = t;
  s && Vs(e, s, n, !0), a && a.forEach(
    (c) => Vs(e, c, n, !0)
  );
  for (const c in t)
    if (!(i && c === "expose")) {
      const f = sk[c] || n && n[c];
      e[c] = f ? f(e[c], t[c]) : t[c];
    }
  return e;
}
const sk = {
  data: Bh,
  props: Dh,
  emits: Dh,
  // objects
  methods: Ll,
  computed: Ll,
  // lifecycle
  beforeCreate: tr,
  created: tr,
  beforeMount: tr,
  mounted: tr,
  beforeUpdate: tr,
  updated: tr,
  beforeDestroy: tr,
  beforeUnmount: tr,
  destroyed: tr,
  unmounted: tr,
  activated: tr,
  deactivated: tr,
  errorCaptured: tr,
  serverPrefetch: tr,
  // assets
  components: Ll,
  directives: Ll,
  // watch
  watch: ck,
  // provide / inject
  provide: Bh,
  inject: uk
};
function Bh(e, t) {
  return t ? e ? function() {
    return Jt(
      Be(e) ? e.call(this, this) : e,
      Be(t) ? t.call(this, this) : t
    );
  } : t : e;
}
function uk(e, t) {
  return Ll(zd(e), zd(t));
}
function zd(e) {
  if (Ie(e)) {
    const t = {};
    for (let n = 0; n < e.length; n++)
      t[e[n]] = e[n];
    return t;
  }
  return e;
}
function tr(e, t) {
  return e ? [...new Set([].concat(e, t))] : t;
}
function Ll(e, t) {
  return e ? Jt(/* @__PURE__ */ Object.create(null), e, t) : t;
}
function Dh(e, t) {
  return e ? Ie(e) && Ie(t) ? [.../* @__PURE__ */ new Set([...e, ...t])] : Jt(
    /* @__PURE__ */ Object.create(null),
    Ih(e),
    Ih(t ?? {})
  ) : t;
}
function ck(e, t) {
  if (!e) return t;
  if (!t) return e;
  const n = Jt(/* @__PURE__ */ Object.create(null), e);
  for (const i in t)
    n[i] = tr(e[i], t[i]);
  return n;
}
function Ev() {
  return {
    app: null,
    config: {
      isNativeTag: t_,
      performance: !1,
      globalProperties: {},
      optionMergeStrategies: {},
      errorHandler: void 0,
      warnHandler: void 0,
      compilerOptions: {}
    },
    mixins: [],
    components: {},
    directives: {},
    provides: /* @__PURE__ */ Object.create(null),
    optionsCache: /* @__PURE__ */ new WeakMap(),
    propsCache: /* @__PURE__ */ new WeakMap(),
    emitsCache: /* @__PURE__ */ new WeakMap()
  };
}
let dk = 0;
function fk(e, t) {
  return function(i, a = null) {
    Be(i) || (i = Jt({}, i)), a != null && !ht(a) && (a = null);
    const s = Ev(), c = /* @__PURE__ */ new WeakSet(), f = [];
    let d = !1;
    const h = s.app = {
      _uid: dk++,
      _component: i,
      _props: a,
      _container: null,
      _context: s,
      _instance: null,
      version: Kk,
      get config() {
        return s.config;
      },
      set config(m) {
      },
      use(m, ...b) {
        return c.has(m) || (m && Be(m.install) ? (c.add(m), m.install(h, ...b)) : Be(m) && (c.add(m), m(h, ...b))), h;
      },
      mixin(m) {
        return s.mixins.includes(m) || s.mixins.push(m), h;
      },
      component(m, b) {
        return b ? (s.components[m] = b, h) : s.components[m];
      },
      directive(m, b) {
        return b ? (s.directives[m] = b, h) : s.directives[m];
      },
      mount(m, b, v) {
        if (!d) {
          const _ = h._ceVNode || Ot(i, a);
          return _.appContext = s, v === !0 ? v = "svg" : v === !1 && (v = void 0), e(_, m, v), d = !0, h._container = m, m.__vue_app__ = h, mu(_.component);
        }
      },
      onUnmount(m) {
        f.push(m);
      },
      unmount() {
        d && (hn(
          f,
          h._instance,
          16
        ), e(null, h._container), delete h._container.__vue_app__);
      },
      provide(m, b) {
        return s.provides[m] = b, h;
      },
      runWithContext(m) {
        const b = Ai;
        Ai = h;
        try {
          return m();
        } finally {
          Ai = b;
        }
      }
    };
    return h;
  };
}
let Ai = null;
function pk(e, t) {
  if (Ft) {
    let n = Ft.provides;
    const i = Ft.parent && Ft.parent.provides;
    i === n && (n = Ft.provides = Object.create(i)), n[e] = t;
  }
}
function Ml(e, t, n = !1) {
  const i = Ft || At;
  if (i || Ai) {
    const a = Ai ? Ai._context.provides : i ? i.parent == null ? i.vnode.appContext && i.vnode.appContext.provides : i.parent.provides : void 0;
    if (a && e in a)
      return a[e];
    if (arguments.length > 1)
      return n && Be(t) ? t.call(i && i.proxy) : t;
  }
}
const Tv = {}, Ov = () => Object.create(Tv), Lv = (e) => Object.getPrototypeOf(e) === Tv;
function gk(e, t, n, i = !1) {
  const a = {}, s = Ov();
  e.propsDefaults = /* @__PURE__ */ Object.create(null), Pv(e, t, a, s);
  for (const c in e.propsOptions[0])
    c in a || (a[c] = void 0);
  n ? e.props = i ? a : R_(a) : e.type.props ? e.props = a : e.props = s, e.attrs = s;
}
function hk(e, t, n, i) {
  const {
    props: a,
    attrs: s,
    vnode: { patchFlag: c }
  } = e, f = Je(a), [d] = e.propsOptions;
  let h = !1;
  if (
    // always force full diff in dev
    // - #1942 if hmr is enabled with sfc component
    // - vite#872 non-sfc component used by sfc component
    (i || c > 0) && !(c & 16)
  ) {
    if (c & 8) {
      const m = e.vnode.dynamicProps;
      for (let b = 0; b < m.length; b++) {
        let v = m[b];
        if (hu(e.emitsOptions, v))
          continue;
        const _ = t[v];
        if (d)
          if (qe(s, v))
            _ !== s[v] && (s[v] = _, h = !0);
          else {
            const x = Dr(v);
            a[x] = Ud(
              d,
              f,
              x,
              _,
              e,
              !1
            );
          }
        else
          _ !== s[v] && (s[v] = _, h = !0);
      }
    }
  } else {
    Pv(e, t, a, s) && (h = !0);
    let m;
    for (const b in f)
      (!t || // for camelCase
      !qe(t, b) && // it's possible the original props was passed in as kebab-case
      // and converted to camelCase (#955)
      ((m = Yo(b)) === b || !qe(t, m))) && (d ? n && // for camelCase
      (n[b] !== void 0 || // for kebab-case
      n[m] !== void 0) && (a[b] = Ud(
        d,
        f,
        b,
        void 0,
        e,
        !0
      )) : delete a[b]);
    if (s !== f)
      for (const b in s)
        (!t || !qe(t, b)) && (delete s[b], h = !0);
  }
  h && Pn(e.attrs, "set", "");
}
function Pv(e, t, n, i) {
  const [a, s] = e.propsOptions;
  let c = !1, f;
  if (t)
    for (let d in t) {
      if (Rl(d))
        continue;
      const h = t[d];
      let m;
      a && qe(a, m = Dr(d)) ? !s || !s.includes(m) ? n[m] = h : (f || (f = {}))[m] = h : hu(e.emitsOptions, d) || (!(d in i) || h !== i[d]) && (i[d] = h, c = !0);
    }
  if (s) {
    const d = Je(n), h = f || it;
    for (let m = 0; m < s.length; m++) {
      const b = s[m];
      n[b] = Ud(
        a,
        d,
        b,
        h[b],
        e,
        !qe(h, b)
      );
    }
  }
  return c;
}
function Ud(e, t, n, i, a, s) {
  const c = e[n];
  if (c != null) {
    const f = qe(c, "default");
    if (f && i === void 0) {
      const d = c.default;
      if (c.type !== Function && !c.skipFactory && Be(d)) {
        const { propsDefaults: h } = a;
        if (n in h)
          i = h[n];
        else {
          const m = ha(a);
          i = h[n] = d.call(
            null,
            t
          ), m();
        }
      } else
        i = d;
      a.ce && a.ce._setProp(n, i);
    }
    c[
      0
      /* shouldCast */
    ] && (s && !f ? i = !1 : c[
      1
      /* shouldCastTrue */
    ] && (i === "" || i === Yo(n)) && (i = !0));
  }
  return i;
}
const mk = /* @__PURE__ */ new WeakMap();
function Nv(e, t, n = !1) {
  const i = n ? mk : t.propsCache, a = i.get(e);
  if (a)
    return a;
  const s = e.props, c = {}, f = [];
  let d = !1;
  if (!Be(e)) {
    const m = (b) => {
      d = !0;
      const [v, _] = Nv(b, t, !0);
      Jt(c, v), _ && f.push(..._);
    };
    !n && t.mixins.length && t.mixins.forEach(m), e.extends && m(e.extends), e.mixins && e.mixins.forEach(m);
  }
  if (!s && !d)
    return ht(e) && i.set(e, Li), Li;
  if (Ie(s))
    for (let m = 0; m < s.length; m++) {
      const b = Dr(s[m]);
      Mh(b) && (c[b] = it);
    }
  else if (s)
    for (const m in s) {
      const b = Dr(m);
      if (Mh(b)) {
        const v = s[m], _ = c[b] = Ie(v) || Be(v) ? { type: v } : Jt({}, v), x = _.type;
        let T = !1, R = !0;
        if (Ie(x))
          for (let D = 0; D < x.length; ++D) {
            const K = x[D], L = Be(K) && K.name;
            if (L === "Boolean") {
              T = !0;
              break;
            } else L === "String" && (R = !1);
          }
        else
          T = Be(x) && x.name === "Boolean";
        _[
          0
          /* shouldCast */
        ] = T, _[
          1
          /* shouldCastTrue */
        ] = R, (T || qe(_, "default")) && f.push(b);
      }
    }
  const h = [c, f];
  return ht(e) && i.set(e, h), h;
}
function Mh(e) {
  return e[0] !== "$" && !Rl(e);
}
const Rv = (e) => e[0] === "_" || e === "$stable", Of = (e) => Ie(e) ? e.map(un) : [un(e)], vk = (e, t, n) => {
  if (t._n)
    return t;
  const i = Bl((...a) => Of(t(...a)), n);
  return i._c = !1, i;
}, Iv = (e, t, n) => {
  const i = e._ctx;
  for (const a in e) {
    if (Rv(a)) continue;
    const s = e[a];
    if (Be(s))
      t[a] = vk(a, s, i);
    else if (s != null) {
      const c = Of(s);
      t[a] = () => c;
    }
  }
}, Av = (e, t) => {
  const n = Of(t);
  e.slots.default = () => n;
}, Bv = (e, t, n) => {
  for (const i in t)
    (n || i !== "_") && (e[i] = t[i]);
}, bk = (e, t, n) => {
  const i = e.slots = Ov();
  if (e.vnode.shapeFlag & 32) {
    const a = t._;
    a ? (Bv(i, t, n), n && V0(i, "_", a, !0)) : Iv(t, i);
  } else t && Av(e, t);
}, yk = (e, t, n) => {
  const { vnode: i, slots: a } = e;
  let s = !0, c = it;
  if (i.shapeFlag & 32) {
    const f = t._;
    f ? n && f === 1 ? s = !1 : Bv(a, t, n) : (s = !t.$stable, Iv(t, a)), c = t;
  } else t && (Av(e, t), c = { default: 1 });
  if (s)
    for (const f in a)
      !Rv(f) && c[f] == null && delete a[f];
}, wr = Rk;
function _k(e) {
  return kk(e);
}
function kk(e, t) {
  const n = uu();
  n.__VUE__ = !0;
  const {
    insert: i,
    remove: a,
    patchProp: s,
    createElement: c,
    createText: f,
    createComment: d,
    setText: h,
    setElementText: m,
    parentNode: b,
    nextSibling: v,
    setScopeId: _ = pn,
    insertStaticContent: x
  } = e, T = ($, N, E, G = null, J = null, Z = null, ce = void 0, ue = null, k = !!N.dynamicChildren) => {
    if ($ === N)
      return;
    $ && !Cl($, N) && (G = ze($), X($, J, Z, !0), $ = null), N.patchFlag === -2 && (k = !1, N.dynamicChildren = null);
    const { type: w, ref: U, shapeFlag: Y } = N;
    switch (w) {
      case ga:
        R($, N, E, G);
        break;
      case mo:
        D($, N, E, G);
        break;
      case vd:
        $ == null && K(N, E, G, ce);
        break;
      case Qt:
        be(
          $,
          N,
          E,
          G,
          J,
          Z,
          ce,
          ue,
          k
        );
        break;
      default:
        Y & 1 ? B(
          $,
          N,
          E,
          G,
          J,
          Z,
          ce,
          ue,
          k
        ) : Y & 6 ? we(
          $,
          N,
          E,
          G,
          J,
          Z,
          ce,
          ue,
          k
        ) : (Y & 64 || Y & 128) && w.process(
          $,
          N,
          E,
          G,
          J,
          Z,
          ce,
          ue,
          k,
          tt
        );
    }
    U != null && J && Ws(U, $ && $.ref, Z, N || $, !N);
  }, R = ($, N, E, G) => {
    if ($ == null)
      i(
        N.el = f(N.children),
        E,
        G
      );
    else {
      const J = N.el = $.el;
      N.children !== $.children && h(J, N.children);
    }
  }, D = ($, N, E, G) => {
    $ == null ? i(
      N.el = d(N.children || ""),
      E,
      G
    ) : N.el = $.el;
  }, K = ($, N, E, G) => {
    [$.el, $.anchor] = x(
      $.children,
      N,
      E,
      G,
      $.el,
      $.anchor
    );
  }, L = ({ el: $, anchor: N }, E, G) => {
    let J;
    for (; $ && $ !== N; )
      J = v($), i($, E, G), $ = J;
    i(N, E, G);
  }, S = ({ el: $, anchor: N }) => {
    let E;
    for (; $ && $ !== N; )
      E = v($), a($), $ = E;
    a(N);
  }, B = ($, N, E, G, J, Z, ce, ue, k) => {
    N.type === "svg" ? ce = "svg" : N.type === "math" && (ce = "mathml"), $ == null ? I(
      N,
      E,
      G,
      J,
      Z,
      ce,
      ue,
      k
    ) : re(
      $,
      N,
      J,
      Z,
      ce,
      ue,
      k
    );
  }, I = ($, N, E, G, J, Z, ce, ue) => {
    let k, w;
    const { props: U, shapeFlag: Y, transition: de, dirs: le } = $;
    if (k = $.el = c(
      $.type,
      Z,
      U && U.is,
      U
    ), Y & 8 ? m(k, $.children) : Y & 16 && te(
      $.children,
      k,
      null,
      G,
      J,
      md($, Z),
      ce,
      ue
    ), le && Do($, null, G, "created"), F(k, $, $.scopeId, ce, G), U) {
      for (const Q in U)
        Q !== "value" && !Rl(Q) && s(k, Q, null, U[Q], Z, G);
      "value" in U && s(k, "value", null, U.value, Z), (w = U.onVnodeBeforeMount) && on(w, G, $);
    }
    le && Do($, null, G, "beforeMount");
    const z = wk(J, de);
    z && de.beforeEnter(k), i(k, N, E), ((w = U && U.onVnodeMounted) || z || le) && wr(() => {
      w && on(w, G, $), z && de.enter(k), le && Do($, null, G, "mounted");
    }, J);
  }, F = ($, N, E, G, J) => {
    if (E && _($, E), G)
      for (let Z = 0; Z < G.length; Z++)
        _($, G[Z]);
    if (J) {
      let Z = J.subTree;
      if (N === Z || Uv(Z.type) && (Z.ssContent === N || Z.ssFallback === N)) {
        const ce = J.vnode;
        F(
          $,
          ce,
          ce.scopeId,
          ce.slotScopeIds,
          J.parent
        );
      }
    }
  }, te = ($, N, E, G, J, Z, ce, ue, k = 0) => {
    for (let w = k; w < $.length; w++) {
      const U = $[w] = ue ? uo($[w]) : un($[w]);
      T(
        null,
        U,
        N,
        E,
        G,
        J,
        Z,
        ce,
        ue
      );
    }
  }, re = ($, N, E, G, J, Z, ce) => {
    const ue = N.el = $.el;
    let { patchFlag: k, dynamicChildren: w, dirs: U } = N;
    k |= $.patchFlag & 16;
    const Y = $.props || it, de = N.props || it;
    let le;
    if (E && Mo(E, !1), (le = de.onVnodeBeforeUpdate) && on(le, E, N, $), U && Do(N, $, E, "beforeUpdate"), E && Mo(E, !0), (Y.innerHTML && de.innerHTML == null || Y.textContent && de.textContent == null) && m(ue, ""), w ? Se(
      $.dynamicChildren,
      w,
      ue,
      E,
      G,
      md(N, J),
      Z
    ) : ce || V(
      $,
      N,
      ue,
      null,
      E,
      G,
      md(N, J),
      Z,
      !1
    ), k > 0) {
      if (k & 16)
        Pe(ue, Y, de, E, J);
      else if (k & 2 && Y.class !== de.class && s(ue, "class", null, de.class, J), k & 4 && s(ue, "style", Y.style, de.style, J), k & 8) {
        const z = N.dynamicProps;
        for (let Q = 0; Q < z.length; Q++) {
          const ye = z[Q], Ue = Y[ye], Ze = de[ye];
          (Ze !== Ue || ye === "value") && s(ue, ye, Ue, Ze, J, E);
        }
      }
      k & 1 && $.children !== N.children && m(ue, N.children);
    } else !ce && w == null && Pe(ue, Y, de, E, J);
    ((le = de.onVnodeUpdated) || U) && wr(() => {
      le && on(le, E, N, $), U && Do(N, $, E, "updated");
    }, G);
  }, Se = ($, N, E, G, J, Z, ce) => {
    for (let ue = 0; ue < N.length; ue++) {
      const k = $[ue], w = N[ue], U = (
        // oldVNode may be an errored async setup() component inside Suspense
        // which will not have a mounted element
        k.el && // - In the case of a Fragment, we need to provide the actual parent
        // of the Fragment itself so it can move its children.
        (k.type === Qt || // - In the case of different nodes, there is going to be a replacement
        // which also requires the correct parent container
        !Cl(k, w) || // - In the case of a component, it could contain anything.
        k.shapeFlag & 70) ? b(k.el) : (
          // In other cases, the parent container is not actually used so we
          // just pass the block element here to avoid a DOM parentNode call.
          E
        )
      );
      T(
        k,
        w,
        U,
        null,
        G,
        J,
        Z,
        ce,
        !0
      );
    }
  }, Pe = ($, N, E, G, J) => {
    if (N !== E) {
      if (N !== it)
        for (const Z in N)
          !Rl(Z) && !(Z in E) && s(
            $,
            Z,
            N[Z],
            null,
            J,
            G
          );
      for (const Z in E) {
        if (Rl(Z)) continue;
        const ce = E[Z], ue = N[Z];
        ce !== ue && Z !== "value" && s($, Z, ue, ce, J, G);
      }
      "value" in E && s($, "value", N.value, E.value, J);
    }
  }, be = ($, N, E, G, J, Z, ce, ue, k) => {
    const w = N.el = $ ? $.el : f(""), U = N.anchor = $ ? $.anchor : f("");
    let { patchFlag: Y, dynamicChildren: de, slotScopeIds: le } = N;
    le && (ue = ue ? ue.concat(le) : le), $ == null ? (i(w, E, G), i(U, E, G), te(
      // #10007
      // such fragment like `<></>` will be compiled into
      // a fragment which doesn't have a children.
      // In this case fallback to an empty array
      N.children || [],
      E,
      U,
      J,
      Z,
      ce,
      ue,
      k
    )) : Y > 0 && Y & 64 && de && // #2715 the previous fragment could've been a BAILed one as a result
    // of renderSlot() with no valid children
    $.dynamicChildren ? (Se(
      $.dynamicChildren,
      de,
      E,
      J,
      Z,
      ce,
      ue
    ), // #2080 if the stable fragment has a key, it's a <template v-for> that may
    //  get moved around. Make sure all root level vnodes inherit el.
    // #2134 or if it's a component root, it may also get moved around
    // as the component is being moved.
    (N.key != null || J && N === J.subTree) && Dv(
      $,
      N,
      !0
      /* shallow */
    )) : V(
      $,
      N,
      E,
      U,
      J,
      Z,
      ce,
      ue,
      k
    );
  }, we = ($, N, E, G, J, Z, ce, ue, k) => {
    N.slotScopeIds = ue, $ == null ? N.shapeFlag & 512 ? J.ctx.activate(
      N,
      E,
      G,
      ce,
      k
    ) : De(
      N,
      E,
      G,
      J,
      Z,
      ce,
      k
    ) : ae($, N, k);
  }, De = ($, N, E, G, J, Z, ce) => {
    const ue = $.component = jk(
      $,
      G,
      J
    );
    if (bv($) && (ue.ctx.renderer = tt), Fk(ue, !1, ce), ue.asyncDep) {
      if (J && J.registerDep(ue, ge, ce), !$.el) {
        const k = ue.subTree = Ot(mo);
        D(null, k, N, E);
      }
    } else
      ge(
        ue,
        $,
        N,
        E,
        J,
        Z,
        ce
      );
  }, ae = ($, N, E) => {
    const G = N.component = $.component;
    if (Pk($, N, E))
      if (G.asyncDep && !G.asyncResolved) {
        he(G, N, E);
        return;
      } else
        G.next = N, G.update();
    else
      N.el = $.el, G.vnode = N;
  }, ge = ($, N, E, G, J, Z, ce) => {
    const ue = () => {
      if ($.isMounted) {
        let { next: Y, bu: de, u: le, parent: z, vnode: Q } = $;
        {
          const $t = Mv($);
          if ($t) {
            Y && (Y.el = Q.el, he($, Y, ce)), $t.asyncDep.then(() => {
              $.isUnmounted || ue();
            });
            return;
          }
        }
        let ye = Y, Ue;
        Mo($, !1), Y ? (Y.el = Q.el, he($, Y, ce)) : Y = Q, de && cd(de), (Ue = Y.props && Y.props.onVnodeBeforeUpdate) && on(Ue, z, Y, Q), Mo($, !0);
        const Ze = Fh($), yt = $.subTree;
        $.subTree = Ze, T(
          yt,
          Ze,
          // parent may have changed if it's in a teleport
          b(yt.el),
          // anchor may have changed if it's in a fragment
          ze(yt),
          $,
          J,
          Z
        ), Y.el = Ze.el, ye === null && Nk($, Ze.el), le && wr(le, J), (Ue = Y.props && Y.props.onVnodeUpdated) && wr(
          () => on(Ue, z, Y, Q),
          J
        );
      } else {
        let Y;
        const { el: de, props: le } = N, { bm: z, m: Q, parent: ye, root: Ue, type: Ze } = $, yt = Ii(N);
        Mo($, !1), z && cd(z), !yt && (Y = le && le.onVnodeBeforeMount) && on(Y, ye, N), Mo($, !0);
        {
          Ue.ce && Ue.ce._injectChildStyle(Ze);
          const $t = $.subTree = Fh($);
          T(
            null,
            $t,
            E,
            G,
            $,
            J,
            Z
          ), N.el = $t.el;
        }
        if (Q && wr(Q, J), !yt && (Y = le && le.onVnodeMounted)) {
          const $t = N;
          wr(
            () => on(Y, ye, $t),
            J
          );
        }
        (N.shapeFlag & 256 || ye && Ii(ye.vnode) && ye.vnode.shapeFlag & 256) && $.a && wr($.a, J), $.isMounted = !0, N = E = G = null;
      }
    };
    $.scope.on();
    const k = $.effect = new X0(ue);
    $.scope.off();
    const w = $.update = k.run.bind(k), U = $.job = k.runIfDirty.bind(k);
    U.i = $, U.id = $.uid, k.scheduler = () => Cf(U), Mo($, !0), w();
  }, he = ($, N, E) => {
    N.component = $;
    const G = $.vnode.props;
    $.vnode = N, $.next = null, hk($, N.props, G, E), yk($, N.children, E), yo(), Ph($), _o();
  }, V = ($, N, E, G, J, Z, ce, ue, k = !1) => {
    const w = $ && $.children, U = $ ? $.shapeFlag : 0, Y = N.children, { patchFlag: de, shapeFlag: le } = N;
    if (de > 0) {
      if (de & 128) {
        q(
          w,
          Y,
          E,
          G,
          J,
          Z,
          ce,
          ue,
          k
        );
        return;
      } else if (de & 256) {
        oe(
          w,
          Y,
          E,
          G,
          J,
          Z,
          ce,
          ue,
          k
        );
        return;
      }
    }
    le & 8 ? (U & 16 && Oe(w, J, Z), Y !== w && m(E, Y)) : U & 16 ? le & 16 ? q(
      w,
      Y,
      E,
      G,
      J,
      Z,
      ce,
      ue,
      k
    ) : Oe(w, J, Z, !0) : (U & 8 && m(E, ""), le & 16 && te(
      Y,
      E,
      G,
      J,
      Z,
      ce,
      ue,
      k
    ));
  }, oe = ($, N, E, G, J, Z, ce, ue, k) => {
    $ = $ || Li, N = N || Li;
    const w = $.length, U = N.length, Y = Math.min(w, U);
    let de;
    for (de = 0; de < Y; de++) {
      const le = N[de] = k ? uo(N[de]) : un(N[de]);
      T(
        $[de],
        le,
        E,
        null,
        J,
        Z,
        ce,
        ue,
        k
      );
    }
    w > U ? Oe(
      $,
      J,
      Z,
      !0,
      !1,
      Y
    ) : te(
      N,
      E,
      G,
      J,
      Z,
      ce,
      ue,
      k,
      Y
    );
  }, q = ($, N, E, G, J, Z, ce, ue, k) => {
    let w = 0;
    const U = N.length;
    let Y = $.length - 1, de = U - 1;
    for (; w <= Y && w <= de; ) {
      const le = $[w], z = N[w] = k ? uo(N[w]) : un(N[w]);
      if (Cl(le, z))
        T(
          le,
          z,
          E,
          null,
          J,
          Z,
          ce,
          ue,
          k
        );
      else
        break;
      w++;
    }
    for (; w <= Y && w <= de; ) {
      const le = $[Y], z = N[de] = k ? uo(N[de]) : un(N[de]);
      if (Cl(le, z))
        T(
          le,
          z,
          E,
          null,
          J,
          Z,
          ce,
          ue,
          k
        );
      else
        break;
      Y--, de--;
    }
    if (w > Y) {
      if (w <= de) {
        const le = de + 1, z = le < U ? N[le].el : G;
        for (; w <= de; )
          T(
            null,
            N[w] = k ? uo(N[w]) : un(N[w]),
            E,
            z,
            J,
            Z,
            ce,
            ue,
            k
          ), w++;
      }
    } else if (w > de)
      for (; w <= Y; )
        X($[w], J, Z, !0), w++;
    else {
      const le = w, z = w, Q = /* @__PURE__ */ new Map();
      for (w = z; w <= de; w++) {
        const qt = N[w] = k ? uo(N[w]) : un(N[w]);
        qt.key != null && Q.set(qt.key, w);
      }
      let ye, Ue = 0;
      const Ze = de - z + 1;
      let yt = !1, $t = 0;
      const qr = new Array(Ze);
      for (w = 0; w < Ze; w++) qr[w] = 0;
      for (w = le; w <= Y; w++) {
        const qt = $[w];
        if (Ue >= Ze) {
          X(qt, J, Z, !0);
          continue;
        }
        let lr;
        if (qt.key != null)
          lr = Q.get(qt.key);
        else
          for (ye = z; ye <= de; ye++)
            if (qr[ye - z] === 0 && Cl(qt, N[ye])) {
              lr = ye;
              break;
            }
        lr === void 0 ? X(qt, J, Z, !0) : (qr[lr - z] = w + 1, lr >= $t ? $t = lr : yt = !0, T(
          qt,
          N[lr],
          E,
          null,
          J,
          Z,
          ce,
          ue,
          k
        ), Ue++);
      }
      const Xo = yt ? Sk(qr) : Li;
      for (ye = Xo.length - 1, w = Ze - 1; w >= 0; w--) {
        const qt = z + w, lr = N[qt], Qo = qt + 1 < U ? N[qt + 1].el : G;
        qr[w] === 0 ? T(
          null,
          lr,
          E,
          Qo,
          J,
          Z,
          ce,
          ue,
          k
        ) : yt && (ye < 0 || w !== Xo[ye] ? P(lr, E, Qo, 2) : ye--);
      }
    }
  }, P = ($, N, E, G, J = null) => {
    const { el: Z, type: ce, transition: ue, children: k, shapeFlag: w } = $;
    if (w & 6) {
      P($.component.subTree, N, E, G);
      return;
    }
    if (w & 128) {
      $.suspense.move(N, E, G);
      return;
    }
    if (w & 64) {
      ce.move($, N, E, tt);
      return;
    }
    if (ce === Qt) {
      i(Z, N, E);
      for (let Y = 0; Y < k.length; Y++)
        P(k[Y], N, E, G);
      i($.anchor, N, E);
      return;
    }
    if (ce === vd) {
      L($, N, E);
      return;
    }
    if (G !== 2 && w & 1 && ue)
      if (G === 0)
        ue.beforeEnter(Z), i(Z, N, E), wr(() => ue.enter(Z), J);
      else {
        const { leave: Y, delayLeave: de, afterLeave: le } = ue, z = () => i(Z, N, E), Q = () => {
          Y(Z, () => {
            z(), le && le();
          });
        };
        de ? de(Z, z, Q) : Q();
      }
    else
      i(Z, N, E);
  }, X = ($, N, E, G = !1, J = !1) => {
    const {
      type: Z,
      props: ce,
      ref: ue,
      children: k,
      dynamicChildren: w,
      shapeFlag: U,
      patchFlag: Y,
      dirs: de,
      cacheIndex: le
    } = $;
    if (Y === -2 && (J = !1), ue != null && Ws(ue, null, E, $, !0), le != null && (N.renderCache[le] = void 0), U & 256) {
      N.ctx.deactivate($);
      return;
    }
    const z = U & 1 && de, Q = !Ii($);
    let ye;
    if (Q && (ye = ce && ce.onVnodeBeforeUnmount) && on(ye, N, $), U & 6)
      Ae($.component, E, G);
    else {
      if (U & 128) {
        $.suspense.unmount(E, G);
        return;
      }
      z && Do($, null, N, "beforeUnmount"), U & 64 ? $.type.remove(
        $,
        N,
        E,
        tt,
        G
      ) : w && // #5154
      // when v-once is used inside a block, setBlockTracking(-1) marks the
      // parent block with hasOnce: true
      // so that it doesn't take the fast path during unmount - otherwise
      // components nested in v-once are never unmounted.
      !w.hasOnce && // #1153: fast path should not be taken for non-stable (v-for) fragments
      (Z !== Qt || Y > 0 && Y & 64) ? Oe(
        w,
        N,
        E,
        !1,
        !0
      ) : (Z === Qt && Y & 384 || !J && U & 16) && Oe(k, N, E), G && Ce($);
    }
    (Q && (ye = ce && ce.onVnodeUnmounted) || z) && wr(() => {
      ye && on(ye, N, $), z && Do($, null, N, "unmounted");
    }, E);
  }, Ce = ($) => {
    const { type: N, el: E, anchor: G, transition: J } = $;
    if (N === Qt) {
      xe(E, G);
      return;
    }
    if (N === vd) {
      S($);
      return;
    }
    const Z = () => {
      a(E), J && !J.persisted && J.afterLeave && J.afterLeave();
    };
    if ($.shapeFlag & 1 && J && !J.persisted) {
      const { leave: ce, delayLeave: ue } = J, k = () => ce(E, Z);
      ue ? ue($.el, Z, k) : k();
    } else
      Z();
  }, xe = ($, N) => {
    let E;
    for (; $ !== N; )
      E = v($), a($), $ = E;
    a(N);
  }, Ae = ($, N, E) => {
    const { bum: G, scope: J, job: Z, subTree: ce, um: ue, m: k, a: w } = $;
    jh(k), jh(w), G && cd(G), J.stop(), Z && (Z.flags |= 8, X(ce, $, N, E)), ue && wr(ue, N), wr(() => {
      $.isUnmounted = !0;
    }, N), N && N.pendingBranch && !N.isUnmounted && $.asyncDep && !$.asyncResolved && $.suspenseId === N.pendingId && (N.deps--, N.deps === 0 && N.resolve());
  }, Oe = ($, N, E, G = !1, J = !1, Z = 0) => {
    for (let ce = Z; ce < $.length; ce++)
      X($[ce], N, E, G, J);
  }, ze = ($) => {
    if ($.shapeFlag & 6)
      return ze($.component.subTree);
    if ($.shapeFlag & 128)
      return $.suspense.next();
    const N = v($.anchor || $.el), E = N && N[V_];
    return E ? v(E) : N;
  };
  let Me = !1;
  const Ke = ($, N, E) => {
    $ == null ? N._vnode && X(N._vnode, null, null, !0) : T(
      N._vnode || null,
      $,
      N,
      null,
      null,
      null,
      E
    ), N._vnode = $, Me || (Me = !0, Ph(), pv(), Me = !1);
  }, tt = {
    p: T,
    um: X,
    m: P,
    r: Ce,
    mt: De,
    mc: te,
    pc: V,
    pbc: Se,
    n: ze,
    o: e
  };
  return {
    render: Ke,
    hydrate: void 0,
    createApp: fk(Ke)
  };
}
function md({ type: e, props: t }, n) {
  return n === "svg" && e === "foreignObject" || n === "mathml" && e === "annotation-xml" && t && t.encoding && t.encoding.includes("html") ? void 0 : n;
}
function Mo({ effect: e, job: t }, n) {
  n ? (e.flags |= 32, t.flags |= 4) : (e.flags &= -33, t.flags &= -5);
}
function wk(e, t) {
  return (!e || e && !e.pendingBranch) && t && !t.persisted;
}
function Dv(e, t, n = !1) {
  const i = e.children, a = t.children;
  if (Ie(i) && Ie(a))
    for (let s = 0; s < i.length; s++) {
      const c = i[s];
      let f = a[s];
      f.shapeFlag & 1 && !f.dynamicChildren && ((f.patchFlag <= 0 || f.patchFlag === 32) && (f = a[s] = uo(a[s]), f.el = c.el), !n && f.patchFlag !== -2 && Dv(c, f)), f.type === ga && (f.el = c.el);
    }
}
function Sk(e) {
  const t = e.slice(), n = [0];
  let i, a, s, c, f;
  const d = e.length;
  for (i = 0; i < d; i++) {
    const h = e[i];
    if (h !== 0) {
      if (a = n[n.length - 1], e[a] < h) {
        t[i] = a, n.push(i);
        continue;
      }
      for (s = 0, c = n.length - 1; s < c; )
        f = s + c >> 1, e[n[f]] < h ? s = f + 1 : c = f;
      h < e[n[s]] && (s > 0 && (t[i] = n[s - 1]), n[s] = i);
    }
  }
  for (s = n.length, c = n[s - 1]; s-- > 0; )
    n[s] = c, c = t[c];
  return n;
}
function Mv(e) {
  const t = e.subTree.component;
  if (t)
    return t.asyncDep && !t.asyncResolved ? t : Mv(t);
}
function jh(e) {
  if (e)
    for (let t = 0; t < e.length; t++)
      e[t].flags |= 8;
}
const Ck = Symbol.for("v-scx"), xk = () => Ml(Ck);
function Ir(e, t, n) {
  return jv(e, t, n);
}
function jv(e, t, n = it) {
  const { immediate: i, deep: a, flush: s, once: c } = n, f = Jt({}, n), d = t && i || !t && s !== "post";
  let h;
  if (Xl) {
    if (s === "sync") {
      const _ = xk();
      h = _.__watcherHandles || (_.__watcherHandles = []);
    } else if (!d) {
      const _ = () => {
      };
      return _.stop = pn, _.resume = pn, _.pause = pn, _;
    }
  }
  const m = Ft;
  f.call = (_, x, T) => hn(_, m, x, T);
  let b = !1;
  s === "post" ? f.scheduler = (_) => {
    wr(_, m && m.suspense);
  } : s !== "sync" && (b = !0, f.scheduler = (_, x) => {
    x ? _() : Cf(_);
  }), f.augmentJob = (_) => {
    t && (_.flags |= 4), b && (_.flags |= 2, m && (_.id = m.uid, _.i = m));
  };
  const v = F_(e, t, f);
  return Xl && (h ? h.push(v) : d && v()), v;
}
function $k(e, t, n) {
  const i = this.proxy, a = St(e) ? e.includes(".") ? Fv(i, e) : () => i[e] : e.bind(i, i);
  let s;
  Be(t) ? s = t : (s = t.handler, n = t);
  const c = ha(this), f = jv(a, s.bind(i), n);
  return c(), f;
}
function Fv(e, t) {
  const n = t.split(".");
  return () => {
    let i = e;
    for (let a = 0; a < n.length && i; a++)
      i = i[n[a]];
    return i;
  };
}
const Ek = (e, t) => t === "modelValue" || t === "model-value" ? e.modelModifiers : e[`${t}Modifiers`] || e[`${Dr(t)}Modifiers`] || e[`${Yo(t)}Modifiers`];
function Tk(e, t, ...n) {
  if (e.isUnmounted) return;
  const i = e.vnode.props || it;
  let a = n;
  const s = t.startsWith("update:"), c = s && Ek(i, t.slice(7));
  c && (c.trim && (a = n.map((m) => St(m) ? m.trim() : m)), c.number && (a = n.map(l_)));
  let f, d = i[f = ud(t)] || // also try camelCase event handler (#2249)
  i[f = ud(Dr(t))];
  !d && s && (d = i[f = ud(Yo(t))]), d && hn(
    d,
    e,
    6,
    a
  );
  const h = i[f + "Once"];
  if (h) {
    if (!e.emitted)
      e.emitted = {};
    else if (e.emitted[f])
      return;
    e.emitted[f] = !0, hn(
      h,
      e,
      6,
      a
    );
  }
}
function zv(e, t, n = !1) {
  const i = t.emitsCache, a = i.get(e);
  if (a !== void 0)
    return a;
  const s = e.emits;
  let c = {}, f = !1;
  if (!Be(e)) {
    const d = (h) => {
      const m = zv(h, t, !0);
      m && (f = !0, Jt(c, m));
    };
    !n && t.mixins.length && t.mixins.forEach(d), e.extends && d(e.extends), e.mixins && e.mixins.forEach(d);
  }
  return !s && !f ? (ht(e) && i.set(e, null), null) : (Ie(s) ? s.forEach((d) => c[d] = null) : Jt(c, s), ht(e) && i.set(e, c), c);
}
function hu(e, t) {
  return !e || !iu(t) ? !1 : (t = t.slice(2).replace(/Once$/, ""), qe(e, t[0].toLowerCase() + t.slice(1)) || qe(e, Yo(t)) || qe(e, t));
}
function Fh(e) {
  const {
    type: t,
    vnode: n,
    proxy: i,
    withProxy: a,
    propsOptions: [s],
    slots: c,
    attrs: f,
    emit: d,
    render: h,
    renderCache: m,
    props: b,
    data: v,
    setupState: _,
    ctx: x,
    inheritAttrs: T
  } = e, R = Us(e);
  let D, K;
  try {
    if (n.shapeFlag & 4) {
      const S = a || i, B = S;
      D = un(
        h.call(
          B,
          S,
          m,
          b,
          _,
          v,
          x
        )
      ), K = f;
    } else {
      const S = t;
      D = un(
        S.length > 1 ? S(
          b,
          { attrs: f, slots: c, emit: d }
        ) : S(
          b,
          null
        )
      ), K = t.props ? f : Ok(f);
    }
  } catch (S) {
    jl.length = 0, pu(S, e, 1), D = Ot(mo);
  }
  let L = D;
  if (K && T !== !1) {
    const S = Object.keys(K), { shapeFlag: B } = L;
    S.length && B & 7 && (s && S.some(df) && (K = Lk(
      K,
      s
    )), L = Bi(L, K, !1, !0));
  }
  return n.dirs && (L = Bi(L, null, !1, !0), L.dirs = L.dirs ? L.dirs.concat(n.dirs) : n.dirs), n.transition && xf(L, n.transition), D = L, Us(R), D;
}
const Ok = (e) => {
  let t;
  for (const n in e)
    (n === "class" || n === "style" || iu(n)) && ((t || (t = {}))[n] = e[n]);
  return t;
}, Lk = (e, t) => {
  const n = {};
  for (const i in e)
    (!df(i) || !(i.slice(9) in t)) && (n[i] = e[i]);
  return n;
};
function Pk(e, t, n) {
  const { props: i, children: a, component: s } = e, { props: c, children: f, patchFlag: d } = t, h = s.emitsOptions;
  if (t.dirs || t.transition)
    return !0;
  if (n && d >= 0) {
    if (d & 1024)
      return !0;
    if (d & 16)
      return i ? zh(i, c, h) : !!c;
    if (d & 8) {
      const m = t.dynamicProps;
      for (let b = 0; b < m.length; b++) {
        const v = m[b];
        if (c[v] !== i[v] && !hu(h, v))
          return !0;
      }
    }
  } else
    return (a || f) && (!f || !f.$stable) ? !0 : i === c ? !1 : i ? c ? zh(i, c, h) : !0 : !!c;
  return !1;
}
function zh(e, t, n) {
  const i = Object.keys(t);
  if (i.length !== Object.keys(e).length)
    return !0;
  for (let a = 0; a < i.length; a++) {
    const s = i[a];
    if (t[s] !== e[s] && !hu(n, s))
      return !0;
  }
  return !1;
}
function Nk({ vnode: e, parent: t }, n) {
  for (; t; ) {
    const i = t.subTree;
    if (i.suspense && i.suspense.activeBranch === e && (i.el = e.el), i === e)
      (e = t.vnode).el = n, t = t.parent;
    else
      break;
  }
}
const Uv = (e) => e.__isSuspense;
function Rk(e, t) {
  t && t.pendingBranch ? Ie(e) ? t.effects.push(...e) : t.effects.push(e) : W_(e);
}
const Qt = Symbol.for("v-fgt"), ga = Symbol.for("v-txt"), mo = Symbol.for("v-cmt"), vd = Symbol.for("v-stc"), jl = [];
let Cr = null;
function It(e = !1) {
  jl.push(Cr = e ? null : []);
}
function Ik() {
  jl.pop(), Cr = jl[jl.length - 1] || null;
}
let Yl = 1;
function Uh(e, t = !1) {
  Yl += e, e < 0 && Cr && t && (Cr.hasOnce = !0);
}
function Wv(e) {
  return e.dynamicChildren = Yl > 0 ? Cr || Li : null, Ik(), Yl > 0 && Cr && Cr.push(e), e;
}
function mn(e, t, n, i, a, s) {
  return Wv(
    hr(
      e,
      t,
      n,
      i,
      a,
      s,
      !0
    )
  );
}
function go(e, t, n, i, a) {
  return Wv(
    Ot(
      e,
      t,
      n,
      i,
      a,
      !0
    )
  );
}
function Gl(e) {
  return e ? e.__v_isVNode === !0 : !1;
}
function Cl(e, t) {
  return e.type === t.type && e.key === t.key;
}
const Vv = ({ key: e }) => e ?? null, Is = ({
  ref: e,
  ref_key: t,
  ref_for: n
}) => (typeof e == "number" && (e = "" + e), e != null ? St(e) || zt(e) || Be(e) ? { i: At, r: e, k: t, f: !!n } : e : null);
function hr(e, t = null, n = null, i = 0, a = null, s = e === Qt ? 0 : 1, c = !1, f = !1) {
  const d = {
    __v_isVNode: !0,
    __v_skip: !0,
    type: e,
    props: t,
    key: t && Vv(t),
    ref: t && Is(t),
    scopeId: hv,
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
    shapeFlag: s,
    patchFlag: i,
    dynamicProps: a,
    dynamicChildren: null,
    appContext: null,
    ctx: At
  };
  return f ? (Lf(d, n), s & 128 && e.normalize(d)) : n && (d.shapeFlag |= St(n) ? 8 : 16), Yl > 0 && // avoid a block node from tracking itself
  !c && // has current parent block
  Cr && // presence of a patch flag indicates this node needs patching on updates.
  // component nodes also should always be patched, because even if the
  // component doesn't need to update, it needs to persist the instance on to
  // the next vnode so that it can be properly unmounted later.
  (d.patchFlag > 0 || s & 6) && // the EVENTS flag is only for hydration and if it is the only flag, the
  // vnode should not be considered dynamic due to handler caching.
  d.patchFlag !== 32 && Cr.push(d), d;
}
const Ot = Ak;
function Ak(e, t = null, n = null, i = 0, a = null, s = !1) {
  if ((!e || e === wv) && (e = mo), Gl(e)) {
    const f = Bi(
      e,
      t,
      !0
      /* mergeRef: true */
    );
    return n && Lf(f, n), Yl > 0 && !s && Cr && (f.shapeFlag & 6 ? Cr[Cr.indexOf(e)] = f : Cr.push(f)), f.patchFlag = -2, f;
  }
  if (Hk(e) && (e = e.__vccOpts), t) {
    t = Bk(t);
    let { class: f, style: d } = t;
    f && !St(f) && (t.class = Ho(f)), ht(d) && (kf(d) && !Ie(d) && (d = Jt({}, d)), t.style = cu(d));
  }
  const c = St(e) ? 1 : Uv(e) ? 128 : H_(e) ? 64 : ht(e) ? 4 : Be(e) ? 2 : 0;
  return hr(
    e,
    t,
    n,
    i,
    a,
    c,
    s,
    !0
  );
}
function Bk(e) {
  return e ? kf(e) || Lv(e) ? Jt({}, e) : e : null;
}
function Bi(e, t, n = !1, i = !1) {
  const { props: a, ref: s, patchFlag: c, children: f, transition: d } = e, h = t ? nr(a || {}, t) : a, m = {
    __v_isVNode: !0,
    __v_skip: !0,
    type: e.type,
    props: h,
    key: h && Vv(h),
    ref: t && t.ref ? (
      // #2078 in the case of <component :is="vnode" ref="extra"/>
      // if the vnode itself already has a ref, cloneVNode will need to merge
      // the refs so the single vnode can be set on multiple refs
      n && s ? Ie(s) ? s.concat(Is(t)) : [s, Is(t)] : Is(t)
    ) : s,
    scopeId: e.scopeId,
    slotScopeIds: e.slotScopeIds,
    children: f,
    target: e.target,
    targetStart: e.targetStart,
    targetAnchor: e.targetAnchor,
    staticCount: e.staticCount,
    shapeFlag: e.shapeFlag,
    // if the vnode is cloned with extra props, we can no longer assume its
    // existing patch flag to be reliable and need to add the FULL_PROPS flag.
    // note: preserve flag for fragments since they use the flag for children
    // fast paths only.
    patchFlag: t && e.type !== Qt ? c === -1 ? 16 : c | 16 : c,
    dynamicProps: e.dynamicProps,
    dynamicChildren: e.dynamicChildren,
    appContext: e.appContext,
    dirs: e.dirs,
    transition: d,
    // These should technically only be non-null on mounted VNodes. However,
    // they *should* be copied for kept-alive vnodes. So we just always copy
    // them since them being non-null during a mount doesn't affect the logic as
    // they will simply be overwritten.
    component: e.component,
    suspense: e.suspense,
    ssContent: e.ssContent && Bi(e.ssContent),
    ssFallback: e.ssFallback && Bi(e.ssFallback),
    el: e.el,
    anchor: e.anchor,
    ctx: e.ctx,
    ce: e.ce
  };
  return d && i && xf(
    m,
    d.clone(m)
  ), m;
}
function Hs(e = " ", t = 0) {
  return Ot(ga, null, e, t);
}
function Wd(e = "", t = !1) {
  return t ? (It(), go(mo, null, e)) : Ot(mo, null, e);
}
function un(e) {
  return e == null || typeof e == "boolean" ? Ot(mo) : Ie(e) ? Ot(
    Qt,
    null,
    // #3666, avoid reference pollution when reusing vnode
    e.slice()
  ) : Gl(e) ? uo(e) : Ot(ga, null, String(e));
}
function uo(e) {
  return e.el === null && e.patchFlag !== -1 || e.memo ? e : Bi(e);
}
function Lf(e, t) {
  let n = 0;
  const { shapeFlag: i } = e;
  if (t == null)
    t = null;
  else if (Ie(t))
    n = 16;
  else if (typeof t == "object")
    if (i & 65) {
      const a = t.default;
      a && (a._c && (a._d = !1), Lf(e, a()), a._c && (a._d = !0));
      return;
    } else {
      n = 32;
      const a = t._;
      !a && !Lv(t) ? t._ctx = At : a === 3 && At && (At.slots._ === 1 ? t._ = 1 : (t._ = 2, e.patchFlag |= 1024));
    }
  else Be(t) ? (t = { default: t, _ctx: At }, n = 32) : (t = String(t), i & 64 ? (n = 16, t = [Hs(t)]) : n = 8);
  e.children = t, e.shapeFlag |= n;
}
function nr(...e) {
  const t = {};
  for (let n = 0; n < e.length; n++) {
    const i = e[n];
    for (const a in i)
      if (a === "class")
        t.class !== i.class && (t.class = Ho([t.class, i.class]));
      else if (a === "style")
        t.style = cu([t.style, i.style]);
      else if (iu(a)) {
        const s = t[a], c = i[a];
        c && s !== c && !(Ie(s) && s.includes(c)) && (t[a] = s ? [].concat(s, c) : c);
      } else a !== "" && (t[a] = i[a]);
  }
  return t;
}
function on(e, t, n, i = null) {
  hn(e, t, 7, [
    n,
    i
  ]);
}
const Dk = Ev();
let Mk = 0;
function jk(e, t, n) {
  const i = e.type, a = (t ? t.appContext : e.appContext) || Dk, s = {
    uid: Mk++,
    vnode: e,
    type: i,
    parent: t,
    appContext: a,
    root: null,
    // to be immediately set
    next: null,
    subTree: null,
    // will be set synchronously right after creation
    effect: null,
    update: null,
    // will be set synchronously right after creation
    job: null,
    scope: new G0(
      !0
      /* detached */
    ),
    render: null,
    proxy: null,
    exposed: null,
    exposeProxy: null,
    withProxy: null,
    provides: t ? t.provides : Object.create(a.provides),
    ids: t ? t.ids : ["", 0, 0],
    accessCache: null,
    renderCache: [],
    // local resolved assets
    components: null,
    directives: null,
    // resolved props and emits options
    propsOptions: Nv(i, a),
    emitsOptions: zv(i, a),
    // emit
    emit: null,
    // to be set immediately
    emitted: null,
    // props default value
    propsDefaults: it,
    // inheritAttrs
    inheritAttrs: i.inheritAttrs,
    // state
    ctx: it,
    data: it,
    props: it,
    attrs: it,
    slots: it,
    refs: it,
    setupState: it,
    setupContext: null,
    // suspense related
    suspense: n,
    suspenseId: n ? n.pendingId : 0,
    asyncDep: null,
    asyncResolved: !1,
    // lifecycle hooks
    // not using enums here because it results in computed properties
    isMounted: !1,
    isUnmounted: !1,
    isDeactivated: !1,
    bc: null,
    c: null,
    bm: null,
    m: null,
    bu: null,
    u: null,
    um: null,
    bum: null,
    da: null,
    a: null,
    rtg: null,
    rtc: null,
    ec: null,
    sp: null
  };
  return s.ctx = { _: s }, s.root = t ? t.root : s, s.emit = Tk.bind(null, s), e.ce && e.ce(s), s;
}
let Ft = null;
const vo = () => Ft || At;
let Ks, Vd;
{
  const e = uu(), t = (n, i) => {
    let a;
    return (a = e[n]) || (a = e[n] = []), a.push(i), (s) => {
      a.length > 1 ? a.forEach((c) => c(s)) : a[0](s);
    };
  };
  Ks = t(
    "__VUE_INSTANCE_SETTERS__",
    (n) => Ft = n
  ), Vd = t(
    "__VUE_SSR_SETTERS__",
    (n) => Xl = n
  );
}
const ha = (e) => {
  const t = Ft;
  return Ks(e), e.scope.on(), () => {
    e.scope.off(), Ks(t);
  };
}, Wh = () => {
  Ft && Ft.scope.off(), Ks(null);
};
function Hv(e) {
  return e.vnode.shapeFlag & 4;
}
let Xl = !1;
function Fk(e, t = !1, n = !1) {
  t && Vd(t);
  const { props: i, children: a } = e.vnode, s = Hv(e);
  gk(e, i, s, t), bk(e, a, n);
  const c = s ? zk(e, t) : void 0;
  return t && Vd(!1), c;
}
function zk(e, t) {
  const n = e.type;
  e.accessCache = /* @__PURE__ */ Object.create(null), e.proxy = new Proxy(e.ctx, ik);
  const { setup: i } = n;
  if (i) {
    yo();
    const a = e.setupContext = i.length > 1 ? Wk(e) : null, s = ha(e), c = fa(
      i,
      e,
      0,
      [
        e.props,
        a
      ]
    ), f = z0(c);
    if (_o(), s(), (f || e.sp) && !Ii(e) && vv(e), f) {
      if (c.then(Wh, Wh), t)
        return c.then((d) => {
          Vh(e, d);
        }).catch((d) => {
          pu(d, e, 0);
        });
      e.asyncDep = c;
    } else
      Vh(e, c);
  } else
    Kv(e);
}
function Vh(e, t, n) {
  Be(t) ? e.type.__ssrInlineRender ? e.ssrRender = t : e.render = t : ht(t) && (e.setupState = cv(t)), Kv(e);
}
function Kv(e, t, n) {
  const i = e.type;
  e.render || (e.render = i.render || pn);
  {
    const a = ha(e);
    yo();
    try {
      lk(e);
    } finally {
      _o(), a();
    }
  }
}
const Uk = {
  get(e, t) {
    return Gt(e, "get", ""), e[t];
  }
};
function Wk(e) {
  const t = (n) => {
    e.exposed = n || {};
  };
  return {
    attrs: new Proxy(e.attrs, Uk),
    slots: e.slots,
    emit: e.emit,
    expose: t
  };
}
function mu(e) {
  return e.exposed ? e.exposeProxy || (e.exposeProxy = new Proxy(cv(I_(e.exposed)), {
    get(t, n) {
      if (n in t)
        return t[n];
      if (n in Dl)
        return Dl[n](e);
    },
    has(t, n) {
      return n in t || n in Dl;
    }
  })) : e.proxy;
}
function Vk(e, t = !0) {
  return Be(e) ? e.displayName || e.name : e.name || t && e.__name;
}
function Hk(e) {
  return Be(e) && "__vccOpts" in e;
}
const Gr = (e, t) => M_(e, t, Xl);
function Yv(e, t, n) {
  const i = arguments.length;
  return i === 2 ? ht(t) && !Ie(t) ? Gl(t) ? Ot(e, null, [t]) : Ot(e, t) : Ot(e, null, t) : (i > 3 ? n = Array.prototype.slice.call(arguments, 2) : i === 3 && Gl(n) && (n = [n]), Ot(e, t, n));
}
const Kk = "3.5.13";
/**
* @vue/runtime-dom v3.5.13
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
let Hd;
const Hh = typeof window < "u" && window.trustedTypes;
if (Hh)
  try {
    Hd = /* @__PURE__ */ Hh.createPolicy("vue", {
      createHTML: (e) => e
    });
  } catch {
  }
const Gv = Hd ? (e) => Hd.createHTML(e) : (e) => e, Yk = "http://www.w3.org/2000/svg", Gk = "http://www.w3.org/1998/Math/MathML", Ln = typeof document < "u" ? document : null, Kh = Ln && /* @__PURE__ */ Ln.createElement("template"), Xk = {
  insert: (e, t, n) => {
    t.insertBefore(e, n || null);
  },
  remove: (e) => {
    const t = e.parentNode;
    t && t.removeChild(e);
  },
  createElement: (e, t, n, i) => {
    const a = t === "svg" ? Ln.createElementNS(Yk, e) : t === "mathml" ? Ln.createElementNS(Gk, e) : n ? Ln.createElement(e, { is: n }) : Ln.createElement(e);
    return e === "select" && i && i.multiple != null && a.setAttribute("multiple", i.multiple), a;
  },
  createText: (e) => Ln.createTextNode(e),
  createComment: (e) => Ln.createComment(e),
  setText: (e, t) => {
    e.nodeValue = t;
  },
  setElementText: (e, t) => {
    e.textContent = t;
  },
  parentNode: (e) => e.parentNode,
  nextSibling: (e) => e.nextSibling,
  querySelector: (e) => Ln.querySelector(e),
  setScopeId(e, t) {
    e.setAttribute(t, "");
  },
  // __UNSAFE__
  // Reason: innerHTML.
  // Static content here can only come from compiled templates.
  // As long as the user only uses trusted templates, this is safe.
  insertStaticContent(e, t, n, i, a, s) {
    const c = n ? n.previousSibling : t.lastChild;
    if (a && (a === s || a.nextSibling))
      for (; t.insertBefore(a.cloneNode(!0), n), !(a === s || !(a = a.nextSibling)); )
        ;
    else {
      Kh.innerHTML = Gv(
        i === "svg" ? `<svg>${e}</svg>` : i === "mathml" ? `<math>${e}</math>` : e
      );
      const f = Kh.content;
      if (i === "svg" || i === "mathml") {
        const d = f.firstChild;
        for (; d.firstChild; )
          f.appendChild(d.firstChild);
        f.removeChild(d);
      }
      t.insertBefore(f, n);
    }
    return [
      // first
      c ? c.nextSibling : t.firstChild,
      // last
      n ? n.previousSibling : t.lastChild
    ];
  }
}, Qk = Symbol("_vtc");
function Jk(e, t, n) {
  const i = e[Qk];
  i && (t = (t ? [t, ...i] : [...i]).join(" ")), t == null ? e.removeAttribute("class") : n ? e.setAttribute("class", t) : e.className = t;
}
const Yh = Symbol("_vod"), qk = Symbol("_vsh"), Zk = Symbol(""), ew = /(^|;)\s*display\s*:/;
function tw(e, t, n) {
  const i = e.style, a = St(n);
  let s = !1;
  if (n && !a) {
    if (t)
      if (St(t))
        for (const c of t.split(";")) {
          const f = c.slice(0, c.indexOf(":")).trim();
          n[f] == null && As(i, f, "");
        }
      else
        for (const c in t)
          n[c] == null && As(i, c, "");
    for (const c in n)
      c === "display" && (s = !0), As(i, c, n[c]);
  } else if (a) {
    if (t !== n) {
      const c = i[Zk];
      c && (n += ";" + c), i.cssText = n, s = ew.test(n);
    }
  } else t && e.removeAttribute("style");
  Yh in e && (e[Yh] = s ? i.display : "", e[qk] && (i.display = "none"));
}
const Gh = /\s*!important$/;
function As(e, t, n) {
  if (Ie(n))
    n.forEach((i) => As(e, t, i));
  else if (n == null && (n = ""), t.startsWith("--"))
    e.setProperty(t, n);
  else {
    const i = rw(e, t);
    Gh.test(n) ? e.setProperty(
      Yo(i),
      n.replace(Gh, ""),
      "important"
    ) : e[i] = n;
  }
}
const Xh = ["Webkit", "Moz", "ms"], bd = {};
function rw(e, t) {
  const n = bd[t];
  if (n)
    return n;
  let i = Dr(t);
  if (i !== "filter" && i in e)
    return bd[t] = i;
  i = su(i);
  for (let a = 0; a < Xh.length; a++) {
    const s = Xh[a] + i;
    if (s in e)
      return bd[t] = s;
  }
  return t;
}
const Qh = "http://www.w3.org/1999/xlink";
function Jh(e, t, n, i, a, s = f_(t)) {
  i && t.startsWith("xlink:") ? n == null ? e.removeAttributeNS(Qh, t.slice(6, t.length)) : e.setAttributeNS(Qh, t, n) : n == null || s && !H0(n) ? e.removeAttribute(t) : e.setAttribute(
    t,
    s ? "" : jn(n) ? String(n) : n
  );
}
function qh(e, t, n, i, a) {
  if (t === "innerHTML" || t === "textContent") {
    n != null && (e[t] = t === "innerHTML" ? Gv(n) : n);
    return;
  }
  const s = e.tagName;
  if (t === "value" && s !== "PROGRESS" && // custom elements may use _value internally
  !s.includes("-")) {
    const f = s === "OPTION" ? e.getAttribute("value") || "" : e.value, d = n == null ? (
      // #11647: value should be set as empty string for null and undefined,
      // but <input type="checkbox"> should be set as 'on'.
      e.type === "checkbox" ? "on" : ""
    ) : String(n);
    (f !== d || !("_value" in e)) && (e.value = d), n == null && e.removeAttribute(t), e._value = n;
    return;
  }
  let c = !1;
  if (n === "" || n == null) {
    const f = typeof e[t];
    f === "boolean" ? n = H0(n) : n == null && f === "string" ? (n = "", c = !0) : f === "number" && (n = 0, c = !0);
  }
  try {
    e[t] = n;
  } catch {
  }
  c && e.removeAttribute(a || t);
}
function nw(e, t, n, i) {
  e.addEventListener(t, n, i);
}
function ow(e, t, n, i) {
  e.removeEventListener(t, n, i);
}
const Zh = Symbol("_vei");
function iw(e, t, n, i, a = null) {
  const s = e[Zh] || (e[Zh] = {}), c = s[t];
  if (i && c)
    c.value = i;
  else {
    const [f, d] = lw(t);
    if (i) {
      const h = s[t] = uw(
        i,
        a
      );
      nw(e, f, h, d);
    } else c && (ow(e, f, c, d), s[t] = void 0);
  }
}
const em = /(?:Once|Passive|Capture)$/;
function lw(e) {
  let t;
  if (em.test(e)) {
    t = {};
    let i;
    for (; i = e.match(em); )
      e = e.slice(0, e.length - i[0].length), t[i[0].toLowerCase()] = !0;
  }
  return [e[2] === ":" ? e.slice(3) : Yo(e.slice(2)), t];
}
let yd = 0;
const aw = /* @__PURE__ */ Promise.resolve(), sw = () => yd || (aw.then(() => yd = 0), yd = Date.now());
function uw(e, t) {
  const n = (i) => {
    if (!i._vts)
      i._vts = Date.now();
    else if (i._vts <= n.attached)
      return;
    hn(
      cw(i, n.value),
      t,
      5,
      [i]
    );
  };
  return n.value = e, n.attached = sw(), n;
}
function cw(e, t) {
  if (Ie(t)) {
    const n = e.stopImmediatePropagation;
    return e.stopImmediatePropagation = () => {
      n.call(e), e._stopped = !0;
    }, t.map(
      (i) => (a) => !a._stopped && i && i(a)
    );
  } else
    return t;
}
const tm = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && // lowercase letter
e.charCodeAt(2) > 96 && e.charCodeAt(2) < 123, dw = (e, t, n, i, a, s) => {
  const c = a === "svg";
  t === "class" ? Jk(e, i, c) : t === "style" ? tw(e, n, i) : iu(t) ? df(t) || iw(e, t, n, i, s) : (t[0] === "." ? (t = t.slice(1), !0) : t[0] === "^" ? (t = t.slice(1), !1) : fw(e, t, i, c)) ? (qh(e, t, i), !e.tagName.includes("-") && (t === "value" || t === "checked" || t === "selected") && Jh(e, t, i, c, s, t !== "value")) : /* #11081 force set props for possible async custom element */ e._isVueCE && (/[A-Z]/.test(t) || !St(i)) ? qh(e, Dr(t), i, s, t) : (t === "true-value" ? e._trueValue = i : t === "false-value" && (e._falseValue = i), Jh(e, t, i, c));
};
function fw(e, t, n, i) {
  if (i)
    return !!(t === "innerHTML" || t === "textContent" || t in e && tm(t) && Be(n));
  if (t === "spellcheck" || t === "draggable" || t === "translate" || t === "form" || t === "list" && e.tagName === "INPUT" || t === "type" && e.tagName === "TEXTAREA")
    return !1;
  if (t === "width" || t === "height") {
    const a = e.tagName;
    if (a === "IMG" || a === "VIDEO" || a === "CANVAS" || a === "SOURCE")
      return !1;
  }
  return tm(t) && St(n) ? !1 : t in e;
}
const pw = /* @__PURE__ */ Jt({ patchProp: dw }, Xk);
let rm;
function gw() {
  return rm || (rm = _k(pw));
}
const hw = (...e) => {
  const t = gw().createApp(...e), { mount: n } = t;
  return t.mount = (i) => {
    const a = vw(i);
    if (!a) return;
    const s = t._component;
    !Be(s) && !s.render && !s.template && (s.template = a.innerHTML), a.nodeType === 1 && (a.textContent = "");
    const c = n(a, !1, mw(a));
    return a instanceof Element && (a.removeAttribute("v-cloak"), a.setAttribute("data-v-app", "")), c;
  }, t;
};
function mw(e) {
  if (e instanceof SVGElement)
    return "svg";
  if (typeof MathMLElement == "function" && e instanceof MathMLElement)
    return "mathml";
}
function vw(e) {
  return St(e) ? document.querySelector(e) : e;
}
/*!
  * shared v9.14.4
  * (c) 2025 kazuya kawaguchi
  * Released under the MIT License.
  */
const Ys = typeof window < "u", ko = (e, t = !1) => t ? Symbol.for(e) : Symbol(e), bw = (e, t, n) => yw({ l: e, k: t, s: n }), yw = (e) => JSON.stringify(e).replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029").replace(/\u0027/g, "\\u0027"), wt = (e) => typeof e == "number" && isFinite(e), _w = (e) => Qv(e) === "[object Date]", bo = (e) => Qv(e) === "[object RegExp]", vu = (e) => Re(e) && Object.keys(e).length === 0, Ut = Object.assign, kw = Object.create, nt = (e = null) => kw(e);
let nm;
const Rn = () => nm || (nm = typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : nt());
function om(e) {
  return e.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}
const ww = Object.prototype.hasOwnProperty;
function Xr(e, t) {
  return ww.call(e, t);
}
const pt = Array.isArray, st = (e) => typeof e == "function", fe = (e) => typeof e == "string", Ve = (e) => typeof e == "boolean", Qe = (e) => e !== null && typeof e == "object", Sw = (e) => Qe(e) && st(e.then) && st(e.catch), Xv = Object.prototype.toString, Qv = (e) => Xv.call(e), Re = (e) => {
  if (!Qe(e))
    return !1;
  const t = Object.getPrototypeOf(e);
  return t === null || t.constructor === Object;
}, Cw = (e) => e == null ? "" : pt(e) || Re(e) && e.toString === Xv ? JSON.stringify(e, null, 2) : String(e);
function xw(e, t = "") {
  return e.reduce((n, i, a) => a === 0 ? n + i : n + t + i, "");
}
function bu(e) {
  let t = e;
  return () => ++t;
}
function $w(e, t) {
  typeof console < "u" && (console.warn("[intlify] " + e), t && console.warn(t.stack));
}
const Ts = (e) => !Qe(e) || pt(e);
function Bs(e, t) {
  if (Ts(e) || Ts(t))
    throw new Error("Invalid value");
  const n = [{ src: e, des: t }];
  for (; n.length; ) {
    const { src: i, des: a } = n.pop();
    Object.keys(i).forEach((s) => {
      s !== "__proto__" && (Qe(i[s]) && !Qe(a[s]) && (a[s] = Array.isArray(i[s]) ? [] : nt()), Ts(a[s]) || Ts(i[s]) ? a[s] = i[s] : n.push({ src: i[s], des: a[s] }));
    });
  }
}
/*!
  * message-compiler v9.14.4
  * (c) 2025 kazuya kawaguchi
  * Released under the MIT License.
  */
function Ew(e, t, n) {
  return { line: e, column: t, offset: n };
}
function Gs(e, t, n) {
  return { start: e, end: t };
}
const Tw = /\{([0-9a-zA-Z]+)\}/g;
function Jv(e, ...t) {
  return t.length === 1 && Ow(t[0]) && (t = t[0]), (!t || !t.hasOwnProperty) && (t = {}), e.replace(Tw, (n, i) => t.hasOwnProperty(i) ? t[i] : "");
}
const qv = Object.assign, im = (e) => typeof e == "string", Ow = (e) => e !== null && typeof e == "object";
function Zv(e, t = "") {
  return e.reduce((n, i, a) => a === 0 ? n + i : n + t + i, "");
}
const Pf = {
  USE_MODULO_SYNTAX: 1,
  __EXTEND_POINT__: 2
}, Lw = {
  [Pf.USE_MODULO_SYNTAX]: "Use modulo before '{{0}}'."
};
function Pw(e, t, ...n) {
  const i = Jv(Lw[e], ...n || []), a = { message: String(i), code: e };
  return t && (a.location = t), a;
}
const Te = {
  // tokenizer error codes
  EXPECTED_TOKEN: 1,
  INVALID_TOKEN_IN_PLACEHOLDER: 2,
  UNTERMINATED_SINGLE_QUOTE_IN_PLACEHOLDER: 3,
  UNKNOWN_ESCAPE_SEQUENCE: 4,
  INVALID_UNICODE_ESCAPE_SEQUENCE: 5,
  UNBALANCED_CLOSING_BRACE: 6,
  UNTERMINATED_CLOSING_BRACE: 7,
  EMPTY_PLACEHOLDER: 8,
  NOT_ALLOW_NEST_PLACEHOLDER: 9,
  INVALID_LINKED_FORMAT: 10,
  // parser error codes
  MUST_HAVE_MESSAGES_IN_PLURAL: 11,
  UNEXPECTED_EMPTY_LINKED_MODIFIER: 12,
  UNEXPECTED_EMPTY_LINKED_KEY: 13,
  UNEXPECTED_LEXICAL_ANALYSIS: 14,
  // generator error codes
  UNHANDLED_CODEGEN_NODE_TYPE: 15,
  // minifier error codes
  UNHANDLED_MINIFIER_NODE_TYPE: 16,
  // Special value for higher-order compilers to pick up the last code
  // to avoid collision of error codes. This should always be kept as the last
  // item.
  __EXTEND_POINT__: 17
}, Nw = {
  // tokenizer error messages
  [Te.EXPECTED_TOKEN]: "Expected token: '{0}'",
  [Te.INVALID_TOKEN_IN_PLACEHOLDER]: "Invalid token in placeholder: '{0}'",
  [Te.UNTERMINATED_SINGLE_QUOTE_IN_PLACEHOLDER]: "Unterminated single quote in placeholder",
  [Te.UNKNOWN_ESCAPE_SEQUENCE]: "Unknown escape sequence: \\{0}",
  [Te.INVALID_UNICODE_ESCAPE_SEQUENCE]: "Invalid unicode escape sequence: {0}",
  [Te.UNBALANCED_CLOSING_BRACE]: "Unbalanced closing brace",
  [Te.UNTERMINATED_CLOSING_BRACE]: "Unterminated closing brace",
  [Te.EMPTY_PLACEHOLDER]: "Empty placeholder",
  [Te.NOT_ALLOW_NEST_PLACEHOLDER]: "Not allowed nest placeholder",
  [Te.INVALID_LINKED_FORMAT]: "Invalid linked format",
  // parser error messages
  [Te.MUST_HAVE_MESSAGES_IN_PLURAL]: "Plural must have messages",
  [Te.UNEXPECTED_EMPTY_LINKED_MODIFIER]: "Unexpected empty linked modifier",
  [Te.UNEXPECTED_EMPTY_LINKED_KEY]: "Unexpected empty linked key",
  [Te.UNEXPECTED_LEXICAL_ANALYSIS]: "Unexpected lexical analysis in token: '{0}'",
  // generator error messages
  [Te.UNHANDLED_CODEGEN_NODE_TYPE]: "unhandled codegen node type: '{0}'",
  // minimizer error messages
  [Te.UNHANDLED_MINIFIER_NODE_TYPE]: "unhandled mimifier node type: '{0}'"
};
function ji(e, t, n = {}) {
  const { domain: i, messages: a, args: s } = n, c = Jv((a || Nw)[e] || "", ...s || []), f = new SyntaxError(String(c));
  return f.code = e, t && (f.location = t), f.domain = i, f;
}
function Rw(e) {
  throw e;
}
const En = " ", Iw = "\r", rr = `
`, Aw = "\u2028", Bw = "\u2029";
function Dw(e) {
  const t = e;
  let n = 0, i = 1, a = 1, s = 0;
  const c = (F) => t[F] === Iw && t[F + 1] === rr, f = (F) => t[F] === rr, d = (F) => t[F] === Bw, h = (F) => t[F] === Aw, m = (F) => c(F) || f(F) || d(F) || h(F), b = () => n, v = () => i, _ = () => a, x = () => s, T = (F) => c(F) || d(F) || h(F) ? rr : t[F], R = () => T(n), D = () => T(n + s);
  function K() {
    return s = 0, m(n) && (i++, a = 0), c(n) && n++, n++, a++, t[n];
  }
  function L() {
    return c(n + s) && s++, s++, t[n + s];
  }
  function S() {
    n = 0, i = 1, a = 1, s = 0;
  }
  function B(F = 0) {
    s = F;
  }
  function I() {
    const F = n + s;
    for (; F !== n; )
      K();
    s = 0;
  }
  return {
    index: b,
    line: v,
    column: _,
    peekOffset: x,
    charAt: T,
    currentChar: R,
    currentPeek: D,
    next: K,
    peek: L,
    reset: S,
    resetPeek: B,
    skipToPeek: I
  };
}
const lo = void 0, Mw = ".", lm = "'", jw = "tokenizer";
function Fw(e, t = {}) {
  const n = t.location !== !1, i = Dw(e), a = () => i.index(), s = () => Ew(i.line(), i.column(), i.index()), c = s(), f = a(), d = {
    currentType: 14,
    offset: f,
    startLoc: c,
    endLoc: c,
    lastType: 14,
    lastOffset: f,
    lastStartLoc: c,
    lastEndLoc: c,
    braceNest: 0,
    inLinked: !1,
    text: ""
  }, h = () => d, { onError: m } = t;
  function b(k, w, U, ...Y) {
    const de = h();
    if (w.column += U, w.offset += U, m) {
      const le = n ? Gs(de.startLoc, w) : null, z = ji(k, le, {
        domain: jw,
        args: Y
      });
      m(z);
    }
  }
  function v(k, w, U) {
    k.endLoc = s(), k.currentType = w;
    const Y = { type: w };
    return n && (Y.loc = Gs(k.startLoc, k.endLoc)), U != null && (Y.value = U), Y;
  }
  const _ = (k) => v(
    k,
    14
    /* TokenTypes.EOF */
  );
  function x(k, w) {
    return k.currentChar() === w ? (k.next(), w) : (b(Te.EXPECTED_TOKEN, s(), 0, w), "");
  }
  function T(k) {
    let w = "";
    for (; k.currentPeek() === En || k.currentPeek() === rr; )
      w += k.currentPeek(), k.peek();
    return w;
  }
  function R(k) {
    const w = T(k);
    return k.skipToPeek(), w;
  }
  function D(k) {
    if (k === lo)
      return !1;
    const w = k.charCodeAt(0);
    return w >= 97 && w <= 122 || // a-z
    w >= 65 && w <= 90 || // A-Z
    w === 95;
  }
  function K(k) {
    if (k === lo)
      return !1;
    const w = k.charCodeAt(0);
    return w >= 48 && w <= 57;
  }
  function L(k, w) {
    const { currentType: U } = w;
    if (U !== 2)
      return !1;
    T(k);
    const Y = D(k.currentPeek());
    return k.resetPeek(), Y;
  }
  function S(k, w) {
    const { currentType: U } = w;
    if (U !== 2)
      return !1;
    T(k);
    const Y = k.currentPeek() === "-" ? k.peek() : k.currentPeek(), de = K(Y);
    return k.resetPeek(), de;
  }
  function B(k, w) {
    const { currentType: U } = w;
    if (U !== 2)
      return !1;
    T(k);
    const Y = k.currentPeek() === lm;
    return k.resetPeek(), Y;
  }
  function I(k, w) {
    const { currentType: U } = w;
    if (U !== 8)
      return !1;
    T(k);
    const Y = k.currentPeek() === ".";
    return k.resetPeek(), Y;
  }
  function F(k, w) {
    const { currentType: U } = w;
    if (U !== 9)
      return !1;
    T(k);
    const Y = D(k.currentPeek());
    return k.resetPeek(), Y;
  }
  function te(k, w) {
    const { currentType: U } = w;
    if (!(U === 8 || U === 12))
      return !1;
    T(k);
    const Y = k.currentPeek() === ":";
    return k.resetPeek(), Y;
  }
  function re(k, w) {
    const { currentType: U } = w;
    if (U !== 10)
      return !1;
    const Y = () => {
      const le = k.currentPeek();
      return le === "{" ? D(k.peek()) : le === "@" || le === "%" || le === "|" || le === ":" || le === "." || le === En || !le ? !1 : le === rr ? (k.peek(), Y()) : be(k, !1);
    }, de = Y();
    return k.resetPeek(), de;
  }
  function Se(k) {
    T(k);
    const w = k.currentPeek() === "|";
    return k.resetPeek(), w;
  }
  function Pe(k) {
    const w = T(k), U = k.currentPeek() === "%" && k.peek() === "{";
    return k.resetPeek(), {
      isModulo: U,
      hasSpace: w.length > 0
    };
  }
  function be(k, w = !0) {
    const U = (de = !1, le = "", z = !1) => {
      const Q = k.currentPeek();
      return Q === "{" ? le === "%" ? !1 : de : Q === "@" || !Q ? le === "%" ? !0 : de : Q === "%" ? (k.peek(), U(de, "%", !0)) : Q === "|" ? le === "%" || z ? !0 : !(le === En || le === rr) : Q === En ? (k.peek(), U(!0, En, z)) : Q === rr ? (k.peek(), U(!0, rr, z)) : !0;
    }, Y = U();
    return w && k.resetPeek(), Y;
  }
  function we(k, w) {
    const U = k.currentChar();
    return U === lo ? lo : w(U) ? (k.next(), U) : null;
  }
  function De(k) {
    const w = k.charCodeAt(0);
    return w >= 97 && w <= 122 || // a-z
    w >= 65 && w <= 90 || // A-Z
    w >= 48 && w <= 57 || // 0-9
    w === 95 || // _
    w === 36;
  }
  function ae(k) {
    return we(k, De);
  }
  function ge(k) {
    const w = k.charCodeAt(0);
    return w >= 97 && w <= 122 || // a-z
    w >= 65 && w <= 90 || // A-Z
    w >= 48 && w <= 57 || // 0-9
    w === 95 || // _
    w === 36 || // $
    w === 45;
  }
  function he(k) {
    return we(k, ge);
  }
  function V(k) {
    const w = k.charCodeAt(0);
    return w >= 48 && w <= 57;
  }
  function oe(k) {
    return we(k, V);
  }
  function q(k) {
    const w = k.charCodeAt(0);
    return w >= 48 && w <= 57 || // 0-9
    w >= 65 && w <= 70 || // A-F
    w >= 97 && w <= 102;
  }
  function P(k) {
    return we(k, q);
  }
  function X(k) {
    let w = "", U = "";
    for (; w = oe(k); )
      U += w;
    return U;
  }
  function Ce(k) {
    R(k);
    const w = k.currentChar();
    return w !== "%" && b(Te.EXPECTED_TOKEN, s(), 0, w), k.next(), "%";
  }
  function xe(k) {
    let w = "";
    for (; ; ) {
      const U = k.currentChar();
      if (U === "{" || U === "}" || U === "@" || U === "|" || !U)
        break;
      if (U === "%")
        if (be(k))
          w += U, k.next();
        else
          break;
      else if (U === En || U === rr)
        if (be(k))
          w += U, k.next();
        else {
          if (Se(k))
            break;
          w += U, k.next();
        }
      else
        w += U, k.next();
    }
    return w;
  }
  function Ae(k) {
    R(k);
    let w = "", U = "";
    for (; w = he(k); )
      U += w;
    return k.currentChar() === lo && b(Te.UNTERMINATED_CLOSING_BRACE, s(), 0), U;
  }
  function Oe(k) {
    R(k);
    let w = "";
    return k.currentChar() === "-" ? (k.next(), w += `-${X(k)}`) : w += X(k), k.currentChar() === lo && b(Te.UNTERMINATED_CLOSING_BRACE, s(), 0), w;
  }
  function ze(k) {
    return k !== lm && k !== rr;
  }
  function Me(k) {
    R(k), x(k, "'");
    let w = "", U = "";
    for (; w = we(k, ze); )
      w === "\\" ? U += Ke(k) : U += w;
    const Y = k.currentChar();
    return Y === rr || Y === lo ? (b(Te.UNTERMINATED_SINGLE_QUOTE_IN_PLACEHOLDER, s(), 0), Y === rr && (k.next(), x(k, "'")), U) : (x(k, "'"), U);
  }
  function Ke(k) {
    const w = k.currentChar();
    switch (w) {
      case "\\":
      case "'":
        return k.next(), `\\${w}`;
      case "u":
        return tt(k, w, 4);
      case "U":
        return tt(k, w, 6);
      default:
        return b(Te.UNKNOWN_ESCAPE_SEQUENCE, s(), 0, w), "";
    }
  }
  function tt(k, w, U) {
    x(k, w);
    let Y = "";
    for (let de = 0; de < U; de++) {
      const le = P(k);
      if (!le) {
        b(Te.INVALID_UNICODE_ESCAPE_SEQUENCE, s(), 0, `\\${w}${Y}${k.currentChar()}`);
        break;
      }
      Y += le;
    }
    return `\\${w}${Y}`;
  }
  function vr(k) {
    return k !== "{" && k !== "}" && k !== En && k !== rr;
  }
  function $(k) {
    R(k);
    let w = "", U = "";
    for (; w = we(k, vr); )
      U += w;
    return U;
  }
  function N(k) {
    let w = "", U = "";
    for (; w = ae(k); )
      U += w;
    return U;
  }
  function E(k) {
    const w = (U) => {
      const Y = k.currentChar();
      return Y === "{" || Y === "%" || Y === "@" || Y === "|" || Y === "(" || Y === ")" || !Y || Y === En ? U : (U += Y, k.next(), w(U));
    };
    return w("");
  }
  function G(k) {
    R(k);
    const w = x(
      k,
      "|"
      /* TokenChars.Pipe */
    );
    return R(k), w;
  }
  function J(k, w) {
    let U = null;
    switch (k.currentChar()) {
      case "{":
        return w.braceNest >= 1 && b(Te.NOT_ALLOW_NEST_PLACEHOLDER, s(), 0), k.next(), U = v(
          w,
          2,
          "{"
          /* TokenChars.BraceLeft */
        ), R(k), w.braceNest++, U;
      case "}":
        return w.braceNest > 0 && w.currentType === 2 && b(Te.EMPTY_PLACEHOLDER, s(), 0), k.next(), U = v(
          w,
          3,
          "}"
          /* TokenChars.BraceRight */
        ), w.braceNest--, w.braceNest > 0 && R(k), w.inLinked && w.braceNest === 0 && (w.inLinked = !1), U;
      case "@":
        return w.braceNest > 0 && b(Te.UNTERMINATED_CLOSING_BRACE, s(), 0), U = Z(k, w) || _(w), w.braceNest = 0, U;
      default: {
        let de = !0, le = !0, z = !0;
        if (Se(k))
          return w.braceNest > 0 && b(Te.UNTERMINATED_CLOSING_BRACE, s(), 0), U = v(w, 1, G(k)), w.braceNest = 0, w.inLinked = !1, U;
        if (w.braceNest > 0 && (w.currentType === 5 || w.currentType === 6 || w.currentType === 7))
          return b(Te.UNTERMINATED_CLOSING_BRACE, s(), 0), w.braceNest = 0, ce(k, w);
        if (de = L(k, w))
          return U = v(w, 5, Ae(k)), R(k), U;
        if (le = S(k, w))
          return U = v(w, 6, Oe(k)), R(k), U;
        if (z = B(k, w))
          return U = v(w, 7, Me(k)), R(k), U;
        if (!de && !le && !z)
          return U = v(w, 13, $(k)), b(Te.INVALID_TOKEN_IN_PLACEHOLDER, s(), 0, U.value), R(k), U;
        break;
      }
    }
    return U;
  }
  function Z(k, w) {
    const { currentType: U } = w;
    let Y = null;
    const de = k.currentChar();
    switch ((U === 8 || U === 9 || U === 12 || U === 10) && (de === rr || de === En) && b(Te.INVALID_LINKED_FORMAT, s(), 0), de) {
      case "@":
        return k.next(), Y = v(
          w,
          8,
          "@"
          /* TokenChars.LinkedAlias */
        ), w.inLinked = !0, Y;
      case ".":
        return R(k), k.next(), v(
          w,
          9,
          "."
          /* TokenChars.LinkedDot */
        );
      case ":":
        return R(k), k.next(), v(
          w,
          10,
          ":"
          /* TokenChars.LinkedDelimiter */
        );
      default:
        return Se(k) ? (Y = v(w, 1, G(k)), w.braceNest = 0, w.inLinked = !1, Y) : I(k, w) || te(k, w) ? (R(k), Z(k, w)) : F(k, w) ? (R(k), v(w, 12, N(k))) : re(k, w) ? (R(k), de === "{" ? J(k, w) || Y : v(w, 11, E(k))) : (U === 8 && b(Te.INVALID_LINKED_FORMAT, s(), 0), w.braceNest = 0, w.inLinked = !1, ce(k, w));
    }
  }
  function ce(k, w) {
    let U = {
      type: 14
      /* TokenTypes.EOF */
    };
    if (w.braceNest > 0)
      return J(k, w) || _(w);
    if (w.inLinked)
      return Z(k, w) || _(w);
    switch (k.currentChar()) {
      case "{":
        return J(k, w) || _(w);
      case "}":
        return b(Te.UNBALANCED_CLOSING_BRACE, s(), 0), k.next(), v(
          w,
          3,
          "}"
          /* TokenChars.BraceRight */
        );
      case "@":
        return Z(k, w) || _(w);
      default: {
        if (Se(k))
          return U = v(w, 1, G(k)), w.braceNest = 0, w.inLinked = !1, U;
        const { isModulo: de, hasSpace: le } = Pe(k);
        if (de)
          return le ? v(w, 0, xe(k)) : v(w, 4, Ce(k));
        if (be(k))
          return v(w, 0, xe(k));
        break;
      }
    }
    return U;
  }
  function ue() {
    const { currentType: k, offset: w, startLoc: U, endLoc: Y } = d;
    return d.lastType = k, d.lastOffset = w, d.lastStartLoc = U, d.lastEndLoc = Y, d.offset = a(), d.startLoc = s(), i.currentChar() === lo ? v(
      d,
      14
      /* TokenTypes.EOF */
    ) : ce(i, d);
  }
  return {
    nextToken: ue,
    currentOffset: a,
    currentPosition: s,
    context: h
  };
}
const zw = "parser", Uw = /(?:\\\\|\\'|\\u([0-9a-fA-F]{4})|\\U([0-9a-fA-F]{6}))/g;
function Ww(e, t, n) {
  switch (e) {
    case "\\\\":
      return "\\";
    // eslint-disable-next-line no-useless-escape
    case "\\'":
      return "'";
    default: {
      const i = parseInt(t || n, 16);
      return i <= 55295 || i >= 57344 ? String.fromCodePoint(i) : "�";
    }
  }
}
function Vw(e = {}) {
  const t = e.location !== !1, { onError: n, onWarn: i } = e;
  function a(L, S, B, I, ...F) {
    const te = L.currentPosition();
    if (te.offset += I, te.column += I, n) {
      const re = t ? Gs(B, te) : null, Se = ji(S, re, {
        domain: zw,
        args: F
      });
      n(Se);
    }
  }
  function s(L, S, B, I, ...F) {
    const te = L.currentPosition();
    if (te.offset += I, te.column += I, i) {
      const re = t ? Gs(B, te) : null;
      i(Pw(S, re, F));
    }
  }
  function c(L, S, B) {
    const I = { type: L };
    return t && (I.start = S, I.end = S, I.loc = { start: B, end: B }), I;
  }
  function f(L, S, B, I) {
    t && (L.end = S, L.loc && (L.loc.end = B));
  }
  function d(L, S) {
    const B = L.context(), I = c(3, B.offset, B.startLoc);
    return I.value = S, f(I, L.currentOffset(), L.currentPosition()), I;
  }
  function h(L, S) {
    const B = L.context(), { lastOffset: I, lastStartLoc: F } = B, te = c(5, I, F);
    return te.index = parseInt(S, 10), L.nextToken(), f(te, L.currentOffset(), L.currentPosition()), te;
  }
  function m(L, S, B) {
    const I = L.context(), { lastOffset: F, lastStartLoc: te } = I, re = c(4, F, te);
    return re.key = S, B === !0 && (re.modulo = !0), L.nextToken(), f(re, L.currentOffset(), L.currentPosition()), re;
  }
  function b(L, S) {
    const B = L.context(), { lastOffset: I, lastStartLoc: F } = B, te = c(9, I, F);
    return te.value = S.replace(Uw, Ww), L.nextToken(), f(te, L.currentOffset(), L.currentPosition()), te;
  }
  function v(L) {
    const S = L.nextToken(), B = L.context(), { lastOffset: I, lastStartLoc: F } = B, te = c(8, I, F);
    return S.type !== 12 ? (a(L, Te.UNEXPECTED_EMPTY_LINKED_MODIFIER, B.lastStartLoc, 0), te.value = "", f(te, I, F), {
      nextConsumeToken: S,
      node: te
    }) : (S.value == null && a(L, Te.UNEXPECTED_LEXICAL_ANALYSIS, B.lastStartLoc, 0, Hr(S)), te.value = S.value || "", f(te, L.currentOffset(), L.currentPosition()), {
      node: te
    });
  }
  function _(L, S) {
    const B = L.context(), I = c(7, B.offset, B.startLoc);
    return I.value = S, f(I, L.currentOffset(), L.currentPosition()), I;
  }
  function x(L) {
    const S = L.context(), B = c(6, S.offset, S.startLoc);
    let I = L.nextToken();
    if (I.type === 9) {
      const F = v(L);
      B.modifier = F.node, I = F.nextConsumeToken || L.nextToken();
    }
    switch (I.type !== 10 && a(L, Te.UNEXPECTED_LEXICAL_ANALYSIS, S.lastStartLoc, 0, Hr(I)), I = L.nextToken(), I.type === 2 && (I = L.nextToken()), I.type) {
      case 11:
        I.value == null && a(L, Te.UNEXPECTED_LEXICAL_ANALYSIS, S.lastStartLoc, 0, Hr(I)), B.key = _(L, I.value || "");
        break;
      case 5:
        I.value == null && a(L, Te.UNEXPECTED_LEXICAL_ANALYSIS, S.lastStartLoc, 0, Hr(I)), B.key = m(L, I.value || "");
        break;
      case 6:
        I.value == null && a(L, Te.UNEXPECTED_LEXICAL_ANALYSIS, S.lastStartLoc, 0, Hr(I)), B.key = h(L, I.value || "");
        break;
      case 7:
        I.value == null && a(L, Te.UNEXPECTED_LEXICAL_ANALYSIS, S.lastStartLoc, 0, Hr(I)), B.key = b(L, I.value || "");
        break;
      default: {
        a(L, Te.UNEXPECTED_EMPTY_LINKED_KEY, S.lastStartLoc, 0);
        const F = L.context(), te = c(7, F.offset, F.startLoc);
        return te.value = "", f(te, F.offset, F.startLoc), B.key = te, f(B, F.offset, F.startLoc), {
          nextConsumeToken: I,
          node: B
        };
      }
    }
    return f(B, L.currentOffset(), L.currentPosition()), {
      node: B
    };
  }
  function T(L) {
    const S = L.context(), B = S.currentType === 1 ? L.currentOffset() : S.offset, I = S.currentType === 1 ? S.endLoc : S.startLoc, F = c(2, B, I);
    F.items = [];
    let te = null, re = null;
    do {
      const be = te || L.nextToken();
      switch (te = null, be.type) {
        case 0:
          be.value == null && a(L, Te.UNEXPECTED_LEXICAL_ANALYSIS, S.lastStartLoc, 0, Hr(be)), F.items.push(d(L, be.value || ""));
          break;
        case 6:
          be.value == null && a(L, Te.UNEXPECTED_LEXICAL_ANALYSIS, S.lastStartLoc, 0, Hr(be)), F.items.push(h(L, be.value || ""));
          break;
        case 4:
          re = !0;
          break;
        case 5:
          be.value == null && a(L, Te.UNEXPECTED_LEXICAL_ANALYSIS, S.lastStartLoc, 0, Hr(be)), F.items.push(m(L, be.value || "", !!re)), re && (s(L, Pf.USE_MODULO_SYNTAX, S.lastStartLoc, 0, Hr(be)), re = null);
          break;
        case 7:
          be.value == null && a(L, Te.UNEXPECTED_LEXICAL_ANALYSIS, S.lastStartLoc, 0, Hr(be)), F.items.push(b(L, be.value || ""));
          break;
        case 8: {
          const we = x(L);
          F.items.push(we.node), te = we.nextConsumeToken || null;
          break;
        }
      }
    } while (S.currentType !== 14 && S.currentType !== 1);
    const Se = S.currentType === 1 ? S.lastOffset : L.currentOffset(), Pe = S.currentType === 1 ? S.lastEndLoc : L.currentPosition();
    return f(F, Se, Pe), F;
  }
  function R(L, S, B, I) {
    const F = L.context();
    let te = I.items.length === 0;
    const re = c(1, S, B);
    re.cases = [], re.cases.push(I);
    do {
      const Se = T(L);
      te || (te = Se.items.length === 0), re.cases.push(Se);
    } while (F.currentType !== 14);
    return te && a(L, Te.MUST_HAVE_MESSAGES_IN_PLURAL, B, 0), f(re, L.currentOffset(), L.currentPosition()), re;
  }
  function D(L) {
    const S = L.context(), { offset: B, startLoc: I } = S, F = T(L);
    return S.currentType === 14 ? F : R(L, B, I, F);
  }
  function K(L) {
    const S = Fw(L, qv({}, e)), B = S.context(), I = c(0, B.offset, B.startLoc);
    return t && I.loc && (I.loc.source = L), I.body = D(S), e.onCacheKey && (I.cacheKey = e.onCacheKey(L)), B.currentType !== 14 && a(S, Te.UNEXPECTED_LEXICAL_ANALYSIS, B.lastStartLoc, 0, L[B.offset] || ""), f(I, S.currentOffset(), S.currentPosition()), I;
  }
  return { parse: K };
}
function Hr(e) {
  if (e.type === 14)
    return "EOF";
  const t = (e.value || "").replace(/\r?\n/gu, "\\n");
  return t.length > 10 ? t.slice(0, 9) + "…" : t;
}
function Hw(e, t = {}) {
  const n = {
    ast: e,
    helpers: /* @__PURE__ */ new Set()
  };
  return { context: () => n, helper: (s) => (n.helpers.add(s), s) };
}
function am(e, t) {
  for (let n = 0; n < e.length; n++)
    Nf(e[n], t);
}
function Nf(e, t) {
  switch (e.type) {
    case 1:
      am(e.cases, t), t.helper(
        "plural"
        /* HelperNameMap.PLURAL */
      );
      break;
    case 2:
      am(e.items, t);
      break;
    case 6: {
      Nf(e.key, t), t.helper(
        "linked"
        /* HelperNameMap.LINKED */
      ), t.helper(
        "type"
        /* HelperNameMap.TYPE */
      );
      break;
    }
    case 5:
      t.helper(
        "interpolate"
        /* HelperNameMap.INTERPOLATE */
      ), t.helper(
        "list"
        /* HelperNameMap.LIST */
      );
      break;
    case 4:
      t.helper(
        "interpolate"
        /* HelperNameMap.INTERPOLATE */
      ), t.helper(
        "named"
        /* HelperNameMap.NAMED */
      );
      break;
  }
}
function Kw(e, t = {}) {
  const n = Hw(e);
  n.helper(
    "normalize"
    /* HelperNameMap.NORMALIZE */
  ), e.body && Nf(e.body, n);
  const i = n.context();
  e.helpers = Array.from(i.helpers);
}
function Yw(e) {
  const t = e.body;
  return t.type === 2 ? sm(t) : t.cases.forEach((n) => sm(n)), e;
}
function sm(e) {
  if (e.items.length === 1) {
    const t = e.items[0];
    (t.type === 3 || t.type === 9) && (e.static = t.value, delete t.value);
  } else {
    const t = [];
    for (let n = 0; n < e.items.length; n++) {
      const i = e.items[n];
      if (!(i.type === 3 || i.type === 9) || i.value == null)
        break;
      t.push(i.value);
    }
    if (t.length === e.items.length) {
      e.static = Zv(t);
      for (let n = 0; n < e.items.length; n++) {
        const i = e.items[n];
        (i.type === 3 || i.type === 9) && delete i.value;
      }
    }
  }
}
const Gw = "minifier";
function $i(e) {
  switch (e.t = e.type, e.type) {
    case 0: {
      const t = e;
      $i(t.body), t.b = t.body, delete t.body;
      break;
    }
    case 1: {
      const t = e, n = t.cases;
      for (let i = 0; i < n.length; i++)
        $i(n[i]);
      t.c = n, delete t.cases;
      break;
    }
    case 2: {
      const t = e, n = t.items;
      for (let i = 0; i < n.length; i++)
        $i(n[i]);
      t.i = n, delete t.items, t.static && (t.s = t.static, delete t.static);
      break;
    }
    case 3:
    case 9:
    case 8:
    case 7: {
      const t = e;
      t.value && (t.v = t.value, delete t.value);
      break;
    }
    case 6: {
      const t = e;
      $i(t.key), t.k = t.key, delete t.key, t.modifier && ($i(t.modifier), t.m = t.modifier, delete t.modifier);
      break;
    }
    case 5: {
      const t = e;
      t.i = t.index, delete t.index;
      break;
    }
    case 4: {
      const t = e;
      t.k = t.key, delete t.key;
      break;
    }
    default:
      throw ji(Te.UNHANDLED_MINIFIER_NODE_TYPE, null, {
        domain: Gw,
        args: [e.type]
      });
  }
  delete e.type;
}
const Xw = "parser";
function Qw(e, t) {
  const { filename: n, breakLineCode: i, needIndent: a } = t, s = t.location !== !1, c = {
    filename: n,
    code: "",
    column: 1,
    line: 1,
    offset: 0,
    map: void 0,
    breakLineCode: i,
    needIndent: a,
    indentLevel: 0
  };
  s && e.loc && (c.source = e.loc.source);
  const f = () => c;
  function d(T, R) {
    c.code += T;
  }
  function h(T, R = !0) {
    const D = R ? i : "";
    d(a ? D + "  ".repeat(T) : D);
  }
  function m(T = !0) {
    const R = ++c.indentLevel;
    T && h(R);
  }
  function b(T = !0) {
    const R = --c.indentLevel;
    T && h(R);
  }
  function v() {
    h(c.indentLevel);
  }
  return {
    context: f,
    push: d,
    indent: m,
    deindent: b,
    newline: v,
    helper: (T) => `_${T}`,
    needIndent: () => c.needIndent
  };
}
function Jw(e, t) {
  const { helper: n } = e;
  e.push(`${n(
    "linked"
    /* HelperNameMap.LINKED */
  )}(`), Di(e, t.key), t.modifier ? (e.push(", "), Di(e, t.modifier), e.push(", _type")) : e.push(", undefined, _type"), e.push(")");
}
function qw(e, t) {
  const { helper: n, needIndent: i } = e;
  e.push(`${n(
    "normalize"
    /* HelperNameMap.NORMALIZE */
  )}([`), e.indent(i());
  const a = t.items.length;
  for (let s = 0; s < a && (Di(e, t.items[s]), s !== a - 1); s++)
    e.push(", ");
  e.deindent(i()), e.push("])");
}
function Zw(e, t) {
  const { helper: n, needIndent: i } = e;
  if (t.cases.length > 1) {
    e.push(`${n(
      "plural"
      /* HelperNameMap.PLURAL */
    )}([`), e.indent(i());
    const a = t.cases.length;
    for (let s = 0; s < a && (Di(e, t.cases[s]), s !== a - 1); s++)
      e.push(", ");
    e.deindent(i()), e.push("])");
  }
}
function eS(e, t) {
  t.body ? Di(e, t.body) : e.push("null");
}
function Di(e, t) {
  const { helper: n } = e;
  switch (t.type) {
    case 0:
      eS(e, t);
      break;
    case 1:
      Zw(e, t);
      break;
    case 2:
      qw(e, t);
      break;
    case 6:
      Jw(e, t);
      break;
    case 8:
      e.push(JSON.stringify(t.value), t);
      break;
    case 7:
      e.push(JSON.stringify(t.value), t);
      break;
    case 5:
      e.push(`${n(
        "interpolate"
        /* HelperNameMap.INTERPOLATE */
      )}(${n(
        "list"
        /* HelperNameMap.LIST */
      )}(${t.index}))`, t);
      break;
    case 4:
      e.push(`${n(
        "interpolate"
        /* HelperNameMap.INTERPOLATE */
      )}(${n(
        "named"
        /* HelperNameMap.NAMED */
      )}(${JSON.stringify(t.key)}))`, t);
      break;
    case 9:
      e.push(JSON.stringify(t.value), t);
      break;
    case 3:
      e.push(JSON.stringify(t.value), t);
      break;
    default:
      throw ji(Te.UNHANDLED_CODEGEN_NODE_TYPE, null, {
        domain: Xw,
        args: [t.type]
      });
  }
}
const tS = (e, t = {}) => {
  const n = im(t.mode) ? t.mode : "normal", i = im(t.filename) ? t.filename : "message.intl";
  t.sourceMap;
  const a = t.breakLineCode != null ? t.breakLineCode : n === "arrow" ? ";" : `
`, s = t.needIndent ? t.needIndent : n !== "arrow", c = e.helpers || [], f = Qw(e, {
    filename: i,
    breakLineCode: a,
    needIndent: s
  });
  f.push(n === "normal" ? "function __msg__ (ctx) {" : "(ctx) => {"), f.indent(s), c.length > 0 && (f.push(`const { ${Zv(c.map((m) => `${m}: _${m}`), ", ")} } = ctx`), f.newline()), f.push("return "), Di(f, e), f.deindent(s), f.push("}"), delete e.helpers;
  const { code: d, map: h } = f.context();
  return {
    ast: e,
    code: d,
    map: h ? h.toJSON() : void 0
    // eslint-disable-line @typescript-eslint/no-explicit-any
  };
};
function rS(e, t = {}) {
  const n = qv({}, t), i = !!n.jit, a = !!n.minify, s = n.optimize == null ? !0 : n.optimize, f = Vw(n).parse(e);
  return i ? (s && Yw(f), a && $i(f), { ast: f, code: "" }) : (Kw(f, n), tS(f, n));
}
/*!
  * core-base v9.14.4
  * (c) 2025 kazuya kawaguchi
  * Released under the MIT License.
  */
function nS() {
  typeof __INTLIFY_PROD_DEVTOOLS__ != "boolean" && (Rn().__INTLIFY_PROD_DEVTOOLS__ = !1), typeof __INTLIFY_JIT_COMPILATION__ != "boolean" && (Rn().__INTLIFY_JIT_COMPILATION__ = !1), typeof __INTLIFY_DROP_MESSAGE_COMPILER__ != "boolean" && (Rn().__INTLIFY_DROP_MESSAGE_COMPILER__ = !1);
}
function gn(e) {
  return Qe(e) && Rf(e) === 0 && (Xr(e, "b") || Xr(e, "body"));
}
const eb = ["b", "body"];
function oS(e) {
  return wo(e, eb);
}
const tb = ["c", "cases"];
function iS(e) {
  return wo(e, tb, []);
}
const rb = ["s", "static"];
function lS(e) {
  return wo(e, rb);
}
const nb = ["i", "items"];
function aS(e) {
  return wo(e, nb, []);
}
const ob = ["t", "type"];
function Rf(e) {
  return wo(e, ob);
}
const ib = ["v", "value"];
function Os(e, t) {
  const n = wo(e, ib);
  if (n != null)
    return n;
  throw Ql(t);
}
const lb = ["m", "modifier"];
function sS(e) {
  return wo(e, lb);
}
const ab = ["k", "key"];
function uS(e) {
  const t = wo(e, ab);
  if (t)
    return t;
  throw Ql(
    6
    /* NodeTypes.Linked */
  );
}
function wo(e, t, n) {
  for (let i = 0; i < t.length; i++) {
    const a = t[i];
    if (Xr(e, a) && e[a] != null)
      return e[a];
  }
  return n;
}
const sb = [
  ...eb,
  ...tb,
  ...rb,
  ...nb,
  ...ab,
  ...lb,
  ...ib,
  ...ob
];
function Ql(e) {
  return new Error(`unhandled node type: ${e}`);
}
const So = [];
So[
  0
  /* States.BEFORE_PATH */
] = {
  w: [
    0
    /* States.BEFORE_PATH */
  ],
  i: [
    3,
    0
    /* Actions.APPEND */
  ],
  "[": [
    4
    /* States.IN_SUB_PATH */
  ],
  o: [
    7
    /* States.AFTER_PATH */
  ]
};
So[
  1
  /* States.IN_PATH */
] = {
  w: [
    1
    /* States.IN_PATH */
  ],
  ".": [
    2
    /* States.BEFORE_IDENT */
  ],
  "[": [
    4
    /* States.IN_SUB_PATH */
  ],
  o: [
    7
    /* States.AFTER_PATH */
  ]
};
So[
  2
  /* States.BEFORE_IDENT */
] = {
  w: [
    2
    /* States.BEFORE_IDENT */
  ],
  i: [
    3,
    0
    /* Actions.APPEND */
  ],
  0: [
    3,
    0
    /* Actions.APPEND */
  ]
};
So[
  3
  /* States.IN_IDENT */
] = {
  i: [
    3,
    0
    /* Actions.APPEND */
  ],
  0: [
    3,
    0
    /* Actions.APPEND */
  ],
  w: [
    1,
    1
    /* Actions.PUSH */
  ],
  ".": [
    2,
    1
    /* Actions.PUSH */
  ],
  "[": [
    4,
    1
    /* Actions.PUSH */
  ],
  o: [
    7,
    1
    /* Actions.PUSH */
  ]
};
So[
  4
  /* States.IN_SUB_PATH */
] = {
  "'": [
    5,
    0
    /* Actions.APPEND */
  ],
  '"': [
    6,
    0
    /* Actions.APPEND */
  ],
  "[": [
    4,
    2
    /* Actions.INC_SUB_PATH_DEPTH */
  ],
  "]": [
    1,
    3
    /* Actions.PUSH_SUB_PATH */
  ],
  o: 8,
  l: [
    4,
    0
    /* Actions.APPEND */
  ]
};
So[
  5
  /* States.IN_SINGLE_QUOTE */
] = {
  "'": [
    4,
    0
    /* Actions.APPEND */
  ],
  o: 8,
  l: [
    5,
    0
    /* Actions.APPEND */
  ]
};
So[
  6
  /* States.IN_DOUBLE_QUOTE */
] = {
  '"': [
    4,
    0
    /* Actions.APPEND */
  ],
  o: 8,
  l: [
    6,
    0
    /* Actions.APPEND */
  ]
};
const cS = /^\s?(?:true|false|-?[\d.]+|'[^']*'|"[^"]*")\s?$/;
function dS(e) {
  return cS.test(e);
}
function fS(e) {
  const t = e.charCodeAt(0), n = e.charCodeAt(e.length - 1);
  return t === n && (t === 34 || t === 39) ? e.slice(1, -1) : e;
}
function pS(e) {
  if (e == null)
    return "o";
  switch (e.charCodeAt(0)) {
    case 91:
    // [
    case 93:
    // ]
    case 46:
    // .
    case 34:
    // "
    case 39:
      return e;
    case 95:
    // _
    case 36:
    // $
    case 45:
      return "i";
    case 9:
    // Tab (HT)
    case 10:
    // Newline (LF)
    case 13:
    // Return (CR)
    case 160:
    // No-break space (NBSP)
    case 65279:
    // Byte Order Mark (BOM)
    case 8232:
    // Line Separator (LS)
    case 8233:
      return "w";
  }
  return "i";
}
function gS(e) {
  const t = e.trim();
  return e.charAt(0) === "0" && isNaN(parseInt(e)) ? !1 : dS(t) ? fS(t) : "*" + t;
}
function hS(e) {
  const t = [];
  let n = -1, i = 0, a = 0, s, c, f, d, h, m, b;
  const v = [];
  v[
    0
    /* Actions.APPEND */
  ] = () => {
    c === void 0 ? c = f : c += f;
  }, v[
    1
    /* Actions.PUSH */
  ] = () => {
    c !== void 0 && (t.push(c), c = void 0);
  }, v[
    2
    /* Actions.INC_SUB_PATH_DEPTH */
  ] = () => {
    v[
      0
      /* Actions.APPEND */
    ](), a++;
  }, v[
    3
    /* Actions.PUSH_SUB_PATH */
  ] = () => {
    if (a > 0)
      a--, i = 4, v[
        0
        /* Actions.APPEND */
      ]();
    else {
      if (a = 0, c === void 0 || (c = gS(c), c === !1))
        return !1;
      v[
        1
        /* Actions.PUSH */
      ]();
    }
  };
  function _() {
    const x = e[n + 1];
    if (i === 5 && x === "'" || i === 6 && x === '"')
      return n++, f = "\\" + x, v[
        0
        /* Actions.APPEND */
      ](), !0;
  }
  for (; i !== null; )
    if (n++, s = e[n], !(s === "\\" && _())) {
      if (d = pS(s), b = So[i], h = b[d] || b.l || 8, h === 8 || (i = h[0], h[1] !== void 0 && (m = v[h[1]], m && (f = s, m() === !1))))
        return;
      if (i === 7)
        return t;
    }
}
const um = /* @__PURE__ */ new Map();
function mS(e, t) {
  return Qe(e) ? e[t] : null;
}
function vS(e, t) {
  if (!Qe(e))
    return null;
  let n = um.get(t);
  if (n || (n = hS(t), n && um.set(t, n)), !n)
    return null;
  const i = n.length;
  let a = e, s = 0;
  for (; s < i; ) {
    const c = n[s];
    if (sb.includes(c) && gn(a))
      return null;
    const f = a[c];
    if (f === void 0 || st(a))
      return null;
    a = f, s++;
  }
  return a;
}
const bS = (e) => e, yS = (e) => "", _S = "text", kS = (e) => e.length === 0 ? "" : xw(e), wS = Cw;
function cm(e, t) {
  return e = Math.abs(e), t === 2 ? e ? e > 1 ? 1 : 0 : 1 : e ? Math.min(e, 2) : 0;
}
function SS(e) {
  const t = wt(e.pluralIndex) ? e.pluralIndex : -1;
  return e.named && (wt(e.named.count) || wt(e.named.n)) ? wt(e.named.count) ? e.named.count : wt(e.named.n) ? e.named.n : t : t;
}
function CS(e, t) {
  t.count || (t.count = e), t.n || (t.n = e);
}
function xS(e = {}) {
  const t = e.locale, n = SS(e), i = Qe(e.pluralRules) && fe(t) && st(e.pluralRules[t]) ? e.pluralRules[t] : cm, a = Qe(e.pluralRules) && fe(t) && st(e.pluralRules[t]) ? cm : void 0, s = (D) => D[i(n, D.length, a)], c = e.list || [], f = (D) => c[D], d = e.named || nt();
  wt(e.pluralIndex) && CS(n, d);
  const h = (D) => d[D];
  function m(D) {
    const K = st(e.messages) ? e.messages(D) : Qe(e.messages) ? e.messages[D] : !1;
    return K || (e.parent ? e.parent.message(D) : yS);
  }
  const b = (D) => e.modifiers ? e.modifiers[D] : bS, v = Re(e.processor) && st(e.processor.normalize) ? e.processor.normalize : kS, _ = Re(e.processor) && st(e.processor.interpolate) ? e.processor.interpolate : wS, x = Re(e.processor) && fe(e.processor.type) ? e.processor.type : _S, R = {
    list: f,
    named: h,
    plural: s,
    linked: (D, ...K) => {
      const [L, S] = K;
      let B = "text", I = "";
      K.length === 1 ? Qe(L) ? (I = L.modifier || I, B = L.type || B) : fe(L) && (I = L || I) : K.length === 2 && (fe(L) && (I = L || I), fe(S) && (B = S || B));
      const F = m(D)(R), te = (
        // The message in vnode resolved with linked are returned as an array by processor.nomalize
        B === "vnode" && pt(F) && I ? F[0] : F
      );
      return I ? b(I)(te, B) : te;
    },
    message: m,
    type: x,
    interpolate: _,
    normalize: v,
    values: Ut(nt(), c, d)
  };
  return R;
}
let Jl = null;
function $S(e) {
  Jl = e;
}
function ES(e, t, n) {
  Jl && Jl.emit("i18n:init", {
    timestamp: Date.now(),
    i18n: e,
    version: t,
    meta: n
  });
}
const TS = /* @__PURE__ */ OS(
  "function:translate"
  /* IntlifyDevToolsHooks.FunctionTranslate */
);
function OS(e) {
  return (t) => Jl && Jl.emit(e, t);
}
const LS = Pf.__EXTEND_POINT__, jo = bu(LS), PS = {
  // 2
  FALLBACK_TO_TRANSLATE: jo(),
  // 3
  CANNOT_FORMAT_NUMBER: jo(),
  // 4
  FALLBACK_TO_NUMBER_FORMAT: jo(),
  // 5
  CANNOT_FORMAT_DATE: jo(),
  // 6
  FALLBACK_TO_DATE_FORMAT: jo(),
  // 7
  EXPERIMENTAL_CUSTOM_MESSAGE_COMPILER: jo(),
  // 8
  __EXTEND_POINT__: jo()
  // 9
}, ub = Te.__EXTEND_POINT__, Fo = bu(ub), Qr = {
  INVALID_ARGUMENT: ub,
  // 17
  INVALID_DATE_ARGUMENT: Fo(),
  // 18
  INVALID_ISO_DATE_ARGUMENT: Fo(),
  // 19
  NOT_SUPPORT_NON_STRING_MESSAGE: Fo(),
  // 20
  NOT_SUPPORT_LOCALE_PROMISE_VALUE: Fo(),
  // 21
  NOT_SUPPORT_LOCALE_ASYNC_FUNCTION: Fo(),
  // 22
  NOT_SUPPORT_LOCALE_TYPE: Fo(),
  // 23
  __EXTEND_POINT__: Fo()
  // 24
};
function dn(e) {
  return ji(e, null, void 0);
}
function If(e, t) {
  return t.locale != null ? dm(t.locale) : dm(e.locale);
}
let _d;
function dm(e) {
  if (fe(e))
    return e;
  if (st(e)) {
    if (e.resolvedOnce && _d != null)
      return _d;
    if (e.constructor.name === "Function") {
      const t = e();
      if (Sw(t))
        throw dn(Qr.NOT_SUPPORT_LOCALE_PROMISE_VALUE);
      return _d = t;
    } else
      throw dn(Qr.NOT_SUPPORT_LOCALE_ASYNC_FUNCTION);
  } else
    throw dn(Qr.NOT_SUPPORT_LOCALE_TYPE);
}
function NS(e, t, n) {
  return [.../* @__PURE__ */ new Set([
    n,
    ...pt(t) ? t : Qe(t) ? Object.keys(t) : fe(t) ? [t] : [n]
  ])];
}
function cb(e, t, n) {
  const i = fe(n) ? n : Mi, a = e;
  a.__localeChainCache || (a.__localeChainCache = /* @__PURE__ */ new Map());
  let s = a.__localeChainCache.get(i);
  if (!s) {
    s = [];
    let c = [n];
    for (; pt(c); )
      c = fm(s, c, t);
    const f = pt(t) || !Re(t) ? t : t.default ? t.default : null;
    c = fe(f) ? [f] : f, pt(c) && fm(s, c, !1), a.__localeChainCache.set(i, s);
  }
  return s;
}
function fm(e, t, n) {
  let i = !0;
  for (let a = 0; a < t.length && Ve(i); a++) {
    const s = t[a];
    fe(s) && (i = RS(e, t[a], n));
  }
  return i;
}
function RS(e, t, n) {
  let i;
  const a = t.split("-");
  do {
    const s = a.join("-");
    i = IS(e, s, n), a.splice(-1, 1);
  } while (a.length && i === !0);
  return i;
}
function IS(e, t, n) {
  let i = !1;
  if (!e.includes(t) && (i = !0, t)) {
    i = t[t.length - 1] !== "!";
    const a = t.replace(/!/g, "");
    e.push(a), (pt(n) || Re(n)) && n[a] && (i = n[a]);
  }
  return i;
}
const AS = "9.14.4", yu = -1, Mi = "en-US", pm = "", gm = (e) => `${e.charAt(0).toLocaleUpperCase()}${e.substr(1)}`;
function BS() {
  return {
    upper: (e, t) => t === "text" && fe(e) ? e.toUpperCase() : t === "vnode" && Qe(e) && "__v_isVNode" in e ? e.children.toUpperCase() : e,
    lower: (e, t) => t === "text" && fe(e) ? e.toLowerCase() : t === "vnode" && Qe(e) && "__v_isVNode" in e ? e.children.toLowerCase() : e,
    capitalize: (e, t) => t === "text" && fe(e) ? gm(e) : t === "vnode" && Qe(e) && "__v_isVNode" in e ? gm(e.children) : e
  };
}
let db;
function hm(e) {
  db = e;
}
let fb;
function DS(e) {
  fb = e;
}
let pb;
function MS(e) {
  pb = e;
}
let gb = null;
const jS = /* @__NO_SIDE_EFFECTS__ */ (e) => {
  gb = e;
}, FS = /* @__NO_SIDE_EFFECTS__ */ () => gb;
let hb = null;
const mm = (e) => {
  hb = e;
}, zS = () => hb;
let vm = 0;
function US(e = {}) {
  const t = st(e.onWarn) ? e.onWarn : $w, n = fe(e.version) ? e.version : AS, i = fe(e.locale) || st(e.locale) ? e.locale : Mi, a = st(i) ? Mi : i, s = pt(e.fallbackLocale) || Re(e.fallbackLocale) || fe(e.fallbackLocale) || e.fallbackLocale === !1 ? e.fallbackLocale : a, c = Re(e.messages) ? e.messages : kd(a), f = Re(e.datetimeFormats) ? e.datetimeFormats : kd(a), d = Re(e.numberFormats) ? e.numberFormats : kd(a), h = Ut(nt(), e.modifiers, BS()), m = e.pluralRules || nt(), b = st(e.missing) ? e.missing : null, v = Ve(e.missingWarn) || bo(e.missingWarn) ? e.missingWarn : !0, _ = Ve(e.fallbackWarn) || bo(e.fallbackWarn) ? e.fallbackWarn : !0, x = !!e.fallbackFormat, T = !!e.unresolving, R = st(e.postTranslation) ? e.postTranslation : null, D = Re(e.processor) ? e.processor : null, K = Ve(e.warnHtmlMessage) ? e.warnHtmlMessage : !0, L = !!e.escapeParameter, S = st(e.messageCompiler) ? e.messageCompiler : db, B = st(e.messageResolver) ? e.messageResolver : fb || mS, I = st(e.localeFallbacker) ? e.localeFallbacker : pb || NS, F = Qe(e.fallbackContext) ? e.fallbackContext : void 0, te = e, re = Qe(te.__datetimeFormatters) ? te.__datetimeFormatters : /* @__PURE__ */ new Map(), Se = Qe(te.__numberFormatters) ? te.__numberFormatters : /* @__PURE__ */ new Map(), Pe = Qe(te.__meta) ? te.__meta : {};
  vm++;
  const be = {
    version: n,
    cid: vm,
    locale: i,
    fallbackLocale: s,
    messages: c,
    modifiers: h,
    pluralRules: m,
    missing: b,
    missingWarn: v,
    fallbackWarn: _,
    fallbackFormat: x,
    unresolving: T,
    postTranslation: R,
    processor: D,
    warnHtmlMessage: K,
    escapeParameter: L,
    messageCompiler: S,
    messageResolver: B,
    localeFallbacker: I,
    fallbackContext: F,
    onWarn: t,
    __meta: Pe
  };
  return be.datetimeFormats = f, be.numberFormats = d, be.__datetimeFormatters = re, be.__numberFormatters = Se, __INTLIFY_PROD_DEVTOOLS__ && ES(be, n, Pe), be;
}
const kd = (e) => ({ [e]: nt() });
function Af(e, t, n, i, a) {
  const { missing: s, onWarn: c } = e;
  if (s !== null) {
    const f = s(e, n, t, a);
    return fe(f) ? f : t;
  } else
    return t;
}
function xl(e, t, n) {
  const i = e;
  i.__localeChainCache = /* @__PURE__ */ new Map(), e.localeFallbacker(e, n, t);
}
function WS(e, t) {
  return e === t ? !1 : e.split("-")[0] === t.split("-")[0];
}
function VS(e, t) {
  const n = t.indexOf(e);
  if (n === -1)
    return !1;
  for (let i = n + 1; i < t.length; i++)
    if (WS(e, t[i]))
      return !0;
  return !1;
}
function wd(e) {
  return (n) => HS(n, e);
}
function HS(e, t) {
  const n = oS(t);
  if (n == null)
    throw Ql(
      0
      /* NodeTypes.Resource */
    );
  if (Rf(n) === 1) {
    const s = iS(n);
    return e.plural(s.reduce((c, f) => [
      ...c,
      bm(e, f)
    ], []));
  } else
    return bm(e, n);
}
function bm(e, t) {
  const n = lS(t);
  if (n != null)
    return e.type === "text" ? n : e.normalize([n]);
  {
    const i = aS(t).reduce((a, s) => [...a, Kd(e, s)], []);
    return e.normalize(i);
  }
}
function Kd(e, t) {
  const n = Rf(t);
  switch (n) {
    case 3:
      return Os(t, n);
    case 9:
      return Os(t, n);
    case 4: {
      const i = t;
      if (Xr(i, "k") && i.k)
        return e.interpolate(e.named(i.k));
      if (Xr(i, "key") && i.key)
        return e.interpolate(e.named(i.key));
      throw Ql(n);
    }
    case 5: {
      const i = t;
      if (Xr(i, "i") && wt(i.i))
        return e.interpolate(e.list(i.i));
      if (Xr(i, "index") && wt(i.index))
        return e.interpolate(e.list(i.index));
      throw Ql(n);
    }
    case 6: {
      const i = t, a = sS(i), s = uS(i);
      return e.linked(Kd(e, s), a ? Kd(e, a) : void 0, e.type);
    }
    case 7:
      return Os(t, n);
    case 8:
      return Os(t, n);
    default:
      throw new Error(`unhandled node on format message part: ${n}`);
  }
}
const mb = (e) => e;
let Ti = nt();
function vb(e, t = {}) {
  let n = !1;
  const i = t.onError || Rw;
  return t.onError = (a) => {
    n = !0, i(a);
  }, { ...rS(e, t), detectError: n };
}
const KS = /* @__NO_SIDE_EFFECTS__ */ (e, t) => {
  if (!fe(e))
    throw dn(Qr.NOT_SUPPORT_NON_STRING_MESSAGE);
  {
    Ve(t.warnHtmlMessage) && t.warnHtmlMessage;
    const i = (t.onCacheKey || mb)(e), a = Ti[i];
    if (a)
      return a;
    const { code: s, detectError: c } = vb(e, t), f = new Function(`return ${s}`)();
    return c ? f : Ti[i] = f;
  }
};
function YS(e, t) {
  if (__INTLIFY_JIT_COMPILATION__ && !__INTLIFY_DROP_MESSAGE_COMPILER__ && fe(e)) {
    Ve(t.warnHtmlMessage) && t.warnHtmlMessage;
    const i = (t.onCacheKey || mb)(e), a = Ti[i];
    if (a)
      return a;
    const { ast: s, detectError: c } = vb(e, {
      ...t,
      location: !1,
      jit: !0
    }), f = wd(s);
    return c ? f : Ti[i] = f;
  } else {
    const n = e.cacheKey;
    if (n) {
      const i = Ti[n];
      return i || (Ti[n] = wd(e));
    } else
      return wd(e);
  }
}
const ym = () => "", Nr = (e) => st(e);
function _m(e, ...t) {
  const { fallbackFormat: n, postTranslation: i, unresolving: a, messageCompiler: s, fallbackLocale: c, messages: f } = e, [d, h] = Yd(...t), m = Ve(h.missingWarn) ? h.missingWarn : e.missingWarn, b = Ve(h.fallbackWarn) ? h.fallbackWarn : e.fallbackWarn, v = Ve(h.escapeParameter) ? h.escapeParameter : e.escapeParameter, _ = !!h.resolvedMessage, x = fe(h.default) || Ve(h.default) ? Ve(h.default) ? s ? d : () => d : h.default : n ? s ? d : () => d : "", T = n || x !== "", R = If(e, h);
  v && GS(h);
  let [D, K, L] = _ ? [
    d,
    R,
    f[R] || nt()
  ] : bb(e, d, R, c, b, m), S = D, B = d;
  if (!_ && !(fe(S) || gn(S) || Nr(S)) && T && (S = x, B = S), !_ && (!(fe(S) || gn(S) || Nr(S)) || !fe(K)))
    return a ? yu : d;
  let I = !1;
  const F = () => {
    I = !0;
  }, te = Nr(S) ? S : yb(e, d, K, S, B, F);
  if (I)
    return S;
  const re = JS(e, K, L, h), Se = xS(re), Pe = XS(e, te, Se), be = i ? i(Pe, d) : Pe;
  if (__INTLIFY_PROD_DEVTOOLS__) {
    const we = {
      timestamp: Date.now(),
      key: fe(d) ? d : Nr(S) ? S.key : "",
      locale: K || (Nr(S) ? S.locale : ""),
      format: fe(S) ? S : Nr(S) ? S.source : "",
      message: be
    };
    we.meta = Ut({}, e.__meta, /* @__PURE__ */ FS() || {}), TS(we);
  }
  return be;
}
function GS(e) {
  pt(e.list) ? e.list = e.list.map((t) => fe(t) ? om(t) : t) : Qe(e.named) && Object.keys(e.named).forEach((t) => {
    fe(e.named[t]) && (e.named[t] = om(e.named[t]));
  });
}
function bb(e, t, n, i, a, s) {
  const { messages: c, onWarn: f, messageResolver: d, localeFallbacker: h } = e, m = h(e, i, n);
  let b = nt(), v, _ = null;
  const x = "translate";
  for (let T = 0; T < m.length && (v = m[T], b = c[v] || nt(), (_ = d(b, t)) === null && (_ = b[t]), !(fe(_) || gn(_) || Nr(_))); T++)
    if (!VS(v, m)) {
      const R = Af(
        e,
        // eslint-disable-line @typescript-eslint/no-explicit-any
        t,
        v,
        s,
        x
      );
      R !== t && (_ = R);
    }
  return [_, v, b];
}
function yb(e, t, n, i, a, s) {
  const { messageCompiler: c, warnHtmlMessage: f } = e;
  if (Nr(i)) {
    const h = i;
    return h.locale = h.locale || n, h.key = h.key || t, h;
  }
  if (c == null) {
    const h = () => i;
    return h.locale = n, h.key = t, h;
  }
  const d = c(i, QS(e, n, a, i, f, s));
  return d.locale = n, d.key = t, d.source = i, d;
}
function XS(e, t, n) {
  return t(n);
}
function Yd(...e) {
  const [t, n, i] = e, a = nt();
  if (!fe(t) && !wt(t) && !Nr(t) && !gn(t))
    throw dn(Qr.INVALID_ARGUMENT);
  const s = wt(t) ? String(t) : (Nr(t), t);
  return wt(n) ? a.plural = n : fe(n) ? a.default = n : Re(n) && !vu(n) ? a.named = n : pt(n) && (a.list = n), wt(i) ? a.plural = i : fe(i) ? a.default = i : Re(i) && Ut(a, i), [s, a];
}
function QS(e, t, n, i, a, s) {
  return {
    locale: t,
    key: n,
    warnHtmlMessage: a,
    onError: (c) => {
      throw s && s(c), c;
    },
    onCacheKey: (c) => bw(t, n, c)
  };
}
function JS(e, t, n, i) {
  const { modifiers: a, pluralRules: s, messageResolver: c, fallbackLocale: f, fallbackWarn: d, missingWarn: h, fallbackContext: m } = e, v = {
    locale: t,
    modifiers: a,
    pluralRules: s,
    messages: (_) => {
      let x = c(n, _);
      if (x == null && m) {
        const [, , T] = bb(m, _, t, f, d, h);
        x = c(T, _);
      }
      if (fe(x) || gn(x)) {
        let T = !1;
        const D = yb(e, _, t, x, _, () => {
          T = !0;
        });
        return T ? ym : D;
      } else return Nr(x) ? x : ym;
    }
  };
  return e.processor && (v.processor = e.processor), i.list && (v.list = i.list), i.named && (v.named = i.named), wt(i.plural) && (v.pluralIndex = i.plural), v;
}
function km(e, ...t) {
  const { datetimeFormats: n, unresolving: i, fallbackLocale: a, onWarn: s, localeFallbacker: c } = e, { __datetimeFormatters: f } = e, [d, h, m, b] = Gd(...t), v = Ve(m.missingWarn) ? m.missingWarn : e.missingWarn;
  Ve(m.fallbackWarn) ? m.fallbackWarn : e.fallbackWarn;
  const _ = !!m.part, x = If(e, m), T = c(
    e,
    // eslint-disable-line @typescript-eslint/no-explicit-any
    a,
    x
  );
  if (!fe(d) || d === "")
    return new Intl.DateTimeFormat(x, b).format(h);
  let R = {}, D, K = null;
  const L = "datetime format";
  for (let I = 0; I < T.length && (D = T[I], R = n[D] || {}, K = R[d], !Re(K)); I++)
    Af(e, d, D, v, L);
  if (!Re(K) || !fe(D))
    return i ? yu : d;
  let S = `${D}__${d}`;
  vu(b) || (S = `${S}__${JSON.stringify(b)}`);
  let B = f.get(S);
  return B || (B = new Intl.DateTimeFormat(D, Ut({}, K, b)), f.set(S, B)), _ ? B.formatToParts(h) : B.format(h);
}
const _b = [
  "localeMatcher",
  "weekday",
  "era",
  "year",
  "month",
  "day",
  "hour",
  "minute",
  "second",
  "timeZoneName",
  "formatMatcher",
  "hour12",
  "timeZone",
  "dateStyle",
  "timeStyle",
  "calendar",
  "dayPeriod",
  "numberingSystem",
  "hourCycle",
  "fractionalSecondDigits"
];
function Gd(...e) {
  const [t, n, i, a] = e, s = nt();
  let c = nt(), f;
  if (fe(t)) {
    const d = t.match(/(\d{4}-\d{2}-\d{2})(T|\s)?(.*)/);
    if (!d)
      throw dn(Qr.INVALID_ISO_DATE_ARGUMENT);
    const h = d[3] ? d[3].trim().startsWith("T") ? `${d[1].trim()}${d[3].trim()}` : `${d[1].trim()}T${d[3].trim()}` : d[1].trim();
    f = new Date(h);
    try {
      f.toISOString();
    } catch {
      throw dn(Qr.INVALID_ISO_DATE_ARGUMENT);
    }
  } else if (_w(t)) {
    if (isNaN(t.getTime()))
      throw dn(Qr.INVALID_DATE_ARGUMENT);
    f = t;
  } else if (wt(t))
    f = t;
  else
    throw dn(Qr.INVALID_ARGUMENT);
  return fe(n) ? s.key = n : Re(n) && Object.keys(n).forEach((d) => {
    _b.includes(d) ? c[d] = n[d] : s[d] = n[d];
  }), fe(i) ? s.locale = i : Re(i) && (c = i), Re(a) && (c = a), [s.key || "", f, s, c];
}
function wm(e, t, n) {
  const i = e;
  for (const a in n) {
    const s = `${t}__${a}`;
    i.__datetimeFormatters.has(s) && i.__datetimeFormatters.delete(s);
  }
}
function Sm(e, ...t) {
  const { numberFormats: n, unresolving: i, fallbackLocale: a, onWarn: s, localeFallbacker: c } = e, { __numberFormatters: f } = e, [d, h, m, b] = Xd(...t), v = Ve(m.missingWarn) ? m.missingWarn : e.missingWarn;
  Ve(m.fallbackWarn) ? m.fallbackWarn : e.fallbackWarn;
  const _ = !!m.part, x = If(e, m), T = c(
    e,
    // eslint-disable-line @typescript-eslint/no-explicit-any
    a,
    x
  );
  if (!fe(d) || d === "")
    return new Intl.NumberFormat(x, b).format(h);
  let R = {}, D, K = null;
  const L = "number format";
  for (let I = 0; I < T.length && (D = T[I], R = n[D] || {}, K = R[d], !Re(K)); I++)
    Af(e, d, D, v, L);
  if (!Re(K) || !fe(D))
    return i ? yu : d;
  let S = `${D}__${d}`;
  vu(b) || (S = `${S}__${JSON.stringify(b)}`);
  let B = f.get(S);
  return B || (B = new Intl.NumberFormat(D, Ut({}, K, b)), f.set(S, B)), _ ? B.formatToParts(h) : B.format(h);
}
const kb = [
  "localeMatcher",
  "style",
  "currency",
  "currencyDisplay",
  "currencySign",
  "useGrouping",
  "minimumIntegerDigits",
  "minimumFractionDigits",
  "maximumFractionDigits",
  "minimumSignificantDigits",
  "maximumSignificantDigits",
  "compactDisplay",
  "notation",
  "signDisplay",
  "unit",
  "unitDisplay",
  "roundingMode",
  "roundingPriority",
  "roundingIncrement",
  "trailingZeroDisplay"
];
function Xd(...e) {
  const [t, n, i, a] = e, s = nt();
  let c = nt();
  if (!wt(t))
    throw dn(Qr.INVALID_ARGUMENT);
  const f = t;
  return fe(n) ? s.key = n : Re(n) && Object.keys(n).forEach((d) => {
    kb.includes(d) ? c[d] = n[d] : s[d] = n[d];
  }), fe(i) ? s.locale = i : Re(i) && (c = i), Re(a) && (c = a), [s.key || "", f, s, c];
}
function Cm(e, t, n) {
  const i = e;
  for (const a in n) {
    const s = `${t}__${a}`;
    i.__numberFormatters.has(s) && i.__numberFormatters.delete(s);
  }
}
nS();
/*!
  * vue-i18n v9.14.4
  * (c) 2025 kazuya kawaguchi
  * Released under the MIT License.
  */
const qS = "9.14.4";
function ZS() {
  typeof __VUE_I18N_FULL_INSTALL__ != "boolean" && (Rn().__VUE_I18N_FULL_INSTALL__ = !0), typeof __VUE_I18N_LEGACY_API__ != "boolean" && (Rn().__VUE_I18N_LEGACY_API__ = !0), typeof __INTLIFY_JIT_COMPILATION__ != "boolean" && (Rn().__INTLIFY_JIT_COMPILATION__ = !1), typeof __INTLIFY_DROP_MESSAGE_COMPILER__ != "boolean" && (Rn().__INTLIFY_DROP_MESSAGE_COMPILER__ = !1), typeof __INTLIFY_PROD_DEVTOOLS__ != "boolean" && (Rn().__INTLIFY_PROD_DEVTOOLS__ = !1);
}
const eC = PS.__EXTEND_POINT__, Tn = bu(eC);
Tn(), Tn(), Tn(), Tn(), Tn(), Tn(), Tn(), Tn(), Tn();
const wb = Qr.__EXTEND_POINT__, fr = bu(wb), Lt = {
  // composer module errors
  UNEXPECTED_RETURN_TYPE: wb,
  // 24
  // legacy module errors
  INVALID_ARGUMENT: fr(),
  // 25
  // i18n module errors
  MUST_BE_CALL_SETUP_TOP: fr(),
  // 26
  NOT_INSTALLED: fr(),
  // 27
  NOT_AVAILABLE_IN_LEGACY_MODE: fr(),
  // 28
  // directive module errors
  REQUIRED_VALUE: fr(),
  // 29
  INVALID_VALUE: fr(),
  // 30
  // vue-devtools errors
  CANNOT_SETUP_VUE_DEVTOOLS_PLUGIN: fr(),
  // 31
  NOT_INSTALLED_WITH_PROVIDE: fr(),
  // 32
  // unexpected error
  UNEXPECTED_ERROR: fr(),
  // 33
  // not compatible legacy vue-i18n constructor
  NOT_COMPATIBLE_LEGACY_VUE_I18N: fr(),
  // 34
  // bridge support vue 2.x only
  BRIDGE_SUPPORT_VUE_2_ONLY: fr(),
  // 35
  // need to define `i18n` option in `allowComposition: true` and `useScope: 'local' at `useI18n``
  MUST_DEFINE_I18N_OPTION_IN_ALLOW_COMPOSITION: fr(),
  // 36
  // Not available Compostion API in Legacy API mode. Please make sure that the legacy API mode is working properly
  NOT_AVAILABLE_COMPOSITION_IN_LEGACY: fr(),
  // 37
  // for enhancement
  __EXTEND_POINT__: fr()
  // 38
};
function Bt(e, ...t) {
  return ji(e, null, void 0);
}
const Qd = /* @__PURE__ */ ko("__translateVNode"), Jd = /* @__PURE__ */ ko("__datetimeParts"), qd = /* @__PURE__ */ ko("__numberParts"), Sb = ko("__setPluralRules"), Cb = /* @__PURE__ */ ko("__injectWithOption"), Zd = /* @__PURE__ */ ko("__dispose");
function ql(e) {
  if (!Qe(e) || gn(e))
    return e;
  for (const t in e)
    if (Xr(e, t))
      if (!t.includes("."))
        Qe(e[t]) && ql(e[t]);
      else {
        const n = t.split("."), i = n.length - 1;
        let a = e, s = !1;
        for (let c = 0; c < i; c++) {
          if (n[c] === "__proto__")
            throw new Error(`unsafe key: ${n[c]}`);
          if (n[c] in a || (a[n[c]] = nt()), !Qe(a[n[c]])) {
            s = !0;
            break;
          }
          a = a[n[c]];
        }
        if (s || (gn(a) ? sb.includes(n[i]) || delete e[t] : (a[n[i]] = e[t], delete e[t])), !gn(a)) {
          const c = a[n[i]];
          Qe(c) && ql(c);
        }
      }
  return e;
}
function _u(e, t) {
  const { messages: n, __i18n: i, messageResolver: a, flatJson: s } = t, c = Re(n) ? n : pt(i) ? nt() : { [e]: nt() };
  if (pt(i) && i.forEach((f) => {
    if ("locale" in f && "resource" in f) {
      const { locale: d, resource: h } = f;
      d ? (c[d] = c[d] || nt(), Bs(h, c[d])) : Bs(h, c);
    } else
      fe(f) && Bs(JSON.parse(f), c);
  }), a == null && s)
    for (const f in c)
      Xr(c, f) && ql(c[f]);
  return c;
}
function xb(e) {
  return e.type;
}
function $b(e, t, n) {
  let i = Qe(t.messages) ? t.messages : nt();
  "__i18nGlobal" in n && (i = _u(e.locale.value, {
    messages: i,
    __i18n: n.__i18nGlobal
  }));
  const a = Object.keys(i);
  a.length && a.forEach((s) => {
    e.mergeLocaleMessage(s, i[s]);
  });
  {
    if (Qe(t.datetimeFormats)) {
      const s = Object.keys(t.datetimeFormats);
      s.length && s.forEach((c) => {
        e.mergeDateTimeFormat(c, t.datetimeFormats[c]);
      });
    }
    if (Qe(t.numberFormats)) {
      const s = Object.keys(t.numberFormats);
      s.length && s.forEach((c) => {
        e.mergeNumberFormat(c, t.numberFormats[c]);
      });
    }
  }
}
function xm(e) {
  return Ot(ga, null, e, 0);
}
const $m = "__INTLIFY_META__", Em = () => [], tC = () => !1;
let Tm = 0;
function Om(e) {
  return (t, n, i, a) => e(n, i, vo() || void 0, a);
}
const rC = /* @__NO_SIDE_EFFECTS__ */ () => {
  const e = vo();
  let t = null;
  return e && (t = xb(e)[$m]) ? { [$m]: t } : null;
};
function Bf(e = {}, t) {
  const { __root: n, __injectWithOption: i } = e, a = n === void 0, s = e.flatJson, c = Ys ? ot : wf, f = !!e.translateExistCompatible;
  let d = Ve(e.inheritLocale) ? e.inheritLocale : !0;
  const h = c(
    // prettier-ignore
    n && d ? n.locale.value : fe(e.locale) ? e.locale : Mi
  ), m = c(
    // prettier-ignore
    n && d ? n.fallbackLocale.value : fe(e.fallbackLocale) || pt(e.fallbackLocale) || Re(e.fallbackLocale) || e.fallbackLocale === !1 ? e.fallbackLocale : h.value
  ), b = c(_u(h.value, e)), v = c(Re(e.datetimeFormats) ? e.datetimeFormats : { [h.value]: {} }), _ = c(Re(e.numberFormats) ? e.numberFormats : { [h.value]: {} });
  let x = n ? n.missingWarn : Ve(e.missingWarn) || bo(e.missingWarn) ? e.missingWarn : !0, T = n ? n.fallbackWarn : Ve(e.fallbackWarn) || bo(e.fallbackWarn) ? e.fallbackWarn : !0, R = n ? n.fallbackRoot : Ve(e.fallbackRoot) ? e.fallbackRoot : !0, D = !!e.fallbackFormat, K = st(e.missing) ? e.missing : null, L = st(e.missing) ? Om(e.missing) : null, S = st(e.postTranslation) ? e.postTranslation : null, B = n ? n.warnHtmlMessage : Ve(e.warnHtmlMessage) ? e.warnHtmlMessage : !0, I = !!e.escapeParameter;
  const F = n ? n.modifiers : Re(e.modifiers) ? e.modifiers : {};
  let te = e.pluralRules || n && n.pluralRules, re;
  re = (() => {
    a && mm(null);
    const z = {
      version: qS,
      locale: h.value,
      fallbackLocale: m.value,
      messages: b.value,
      modifiers: F,
      pluralRules: te,
      missing: L === null ? void 0 : L,
      missingWarn: x,
      fallbackWarn: T,
      fallbackFormat: D,
      unresolving: !0,
      postTranslation: S === null ? void 0 : S,
      warnHtmlMessage: B,
      escapeParameter: I,
      messageResolver: e.messageResolver,
      messageCompiler: e.messageCompiler,
      __meta: { framework: "vue" }
    };
    z.datetimeFormats = v.value, z.numberFormats = _.value, z.__datetimeFormatters = Re(re) ? re.__datetimeFormatters : void 0, z.__numberFormatters = Re(re) ? re.__numberFormatters : void 0;
    const Q = US(z);
    return a && mm(Q), Q;
  })(), xl(re, h.value, m.value);
  function Pe() {
    return [
      h.value,
      m.value,
      b.value,
      v.value,
      _.value
    ];
  }
  const be = Gr({
    get: () => h.value,
    set: (z) => {
      h.value = z, re.locale = h.value;
    }
  }), we = Gr({
    get: () => m.value,
    set: (z) => {
      m.value = z, re.fallbackLocale = m.value, xl(re, h.value, z);
    }
  }), De = Gr(() => b.value), ae = /* @__PURE__ */ Gr(() => v.value), ge = /* @__PURE__ */ Gr(() => _.value);
  function he() {
    return st(S) ? S : null;
  }
  function V(z) {
    S = z, re.postTranslation = z;
  }
  function oe() {
    return K;
  }
  function q(z) {
    z !== null && (L = Om(z)), K = z, re.missing = L;
  }
  const P = (z, Q, ye, Ue, Ze, yt) => {
    Pe();
    let $t;
    try {
      __INTLIFY_PROD_DEVTOOLS__, a || (re.fallbackContext = n ? zS() : void 0), $t = z(re);
    } finally {
      __INTLIFY_PROD_DEVTOOLS__, a || (re.fallbackContext = void 0);
    }
    if (ye !== "translate exists" && // for not `te` (e.g `t`)
    wt($t) && $t === yu || ye === "translate exists" && !$t) {
      const [qr, Xo] = Q();
      return n && R ? Ue(n) : Ze(qr);
    } else {
      if (yt($t))
        return $t;
      throw Bt(Lt.UNEXPECTED_RETURN_TYPE);
    }
  };
  function X(...z) {
    return P((Q) => Reflect.apply(_m, null, [Q, ...z]), () => Yd(...z), "translate", (Q) => Reflect.apply(Q.t, Q, [...z]), (Q) => Q, (Q) => fe(Q));
  }
  function Ce(...z) {
    const [Q, ye, Ue] = z;
    if (Ue && !Qe(Ue))
      throw Bt(Lt.INVALID_ARGUMENT);
    return X(Q, ye, Ut({ resolvedMessage: !0 }, Ue || {}));
  }
  function xe(...z) {
    return P((Q) => Reflect.apply(km, null, [Q, ...z]), () => Gd(...z), "datetime format", (Q) => Reflect.apply(Q.d, Q, [...z]), () => pm, (Q) => fe(Q));
  }
  function Ae(...z) {
    return P((Q) => Reflect.apply(Sm, null, [Q, ...z]), () => Xd(...z), "number format", (Q) => Reflect.apply(Q.n, Q, [...z]), () => pm, (Q) => fe(Q));
  }
  function Oe(z) {
    return z.map((Q) => fe(Q) || wt(Q) || Ve(Q) ? xm(String(Q)) : Q);
  }
  const Me = {
    normalize: Oe,
    interpolate: (z) => z,
    type: "vnode"
  };
  function Ke(...z) {
    return P(
      (Q) => {
        let ye;
        const Ue = Q;
        try {
          Ue.processor = Me, ye = Reflect.apply(_m, null, [Ue, ...z]);
        } finally {
          Ue.processor = null;
        }
        return ye;
      },
      () => Yd(...z),
      "translate",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (Q) => Q[Qd](...z),
      (Q) => [xm(Q)],
      (Q) => pt(Q)
    );
  }
  function tt(...z) {
    return P(
      (Q) => Reflect.apply(Sm, null, [Q, ...z]),
      () => Xd(...z),
      "number format",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (Q) => Q[qd](...z),
      Em,
      (Q) => fe(Q) || pt(Q)
    );
  }
  function vr(...z) {
    return P(
      (Q) => Reflect.apply(km, null, [Q, ...z]),
      () => Gd(...z),
      "datetime format",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (Q) => Q[Jd](...z),
      Em,
      (Q) => fe(Q) || pt(Q)
    );
  }
  function $(z) {
    te = z, re.pluralRules = te;
  }
  function N(z, Q) {
    return P(() => {
      if (!z)
        return !1;
      const ye = fe(Q) ? Q : h.value, Ue = J(ye), Ze = re.messageResolver(Ue, z);
      return f ? Ze != null : gn(Ze) || Nr(Ze) || fe(Ze);
    }, () => [z], "translate exists", (ye) => Reflect.apply(ye.te, ye, [z, Q]), tC, (ye) => Ve(ye));
  }
  function E(z) {
    let Q = null;
    const ye = cb(re, m.value, h.value);
    for (let Ue = 0; Ue < ye.length; Ue++) {
      const Ze = b.value[ye[Ue]] || {}, yt = re.messageResolver(Ze, z);
      if (yt != null) {
        Q = yt;
        break;
      }
    }
    return Q;
  }
  function G(z) {
    const Q = E(z);
    return Q ?? (n ? n.tm(z) || {} : {});
  }
  function J(z) {
    return b.value[z] || {};
  }
  function Z(z, Q) {
    if (s) {
      const ye = { [z]: Q };
      for (const Ue in ye)
        Xr(ye, Ue) && ql(ye[Ue]);
      Q = ye[z];
    }
    b.value[z] = Q, re.messages = b.value;
  }
  function ce(z, Q) {
    b.value[z] = b.value[z] || {};
    const ye = { [z]: Q };
    if (s)
      for (const Ue in ye)
        Xr(ye, Ue) && ql(ye[Ue]);
    Q = ye[z], Bs(Q, b.value[z]), re.messages = b.value;
  }
  function ue(z) {
    return v.value[z] || {};
  }
  function k(z, Q) {
    v.value[z] = Q, re.datetimeFormats = v.value, wm(re, z, Q);
  }
  function w(z, Q) {
    v.value[z] = Ut(v.value[z] || {}, Q), re.datetimeFormats = v.value, wm(re, z, Q);
  }
  function U(z) {
    return _.value[z] || {};
  }
  function Y(z, Q) {
    _.value[z] = Q, re.numberFormats = _.value, Cm(re, z, Q);
  }
  function de(z, Q) {
    _.value[z] = Ut(_.value[z] || {}, Q), re.numberFormats = _.value, Cm(re, z, Q);
  }
  Tm++, n && Ys && (Ir(n.locale, (z) => {
    d && (h.value = z, re.locale = z, xl(re, h.value, m.value));
  }), Ir(n.fallbackLocale, (z) => {
    d && (m.value = z, re.fallbackLocale = z, xl(re, h.value, m.value));
  }));
  const le = {
    id: Tm,
    locale: be,
    fallbackLocale: we,
    get inheritLocale() {
      return d;
    },
    set inheritLocale(z) {
      d = z, z && n && (h.value = n.locale.value, m.value = n.fallbackLocale.value, xl(re, h.value, m.value));
    },
    get availableLocales() {
      return Object.keys(b.value).sort();
    },
    messages: De,
    get modifiers() {
      return F;
    },
    get pluralRules() {
      return te || {};
    },
    get isGlobal() {
      return a;
    },
    get missingWarn() {
      return x;
    },
    set missingWarn(z) {
      x = z, re.missingWarn = x;
    },
    get fallbackWarn() {
      return T;
    },
    set fallbackWarn(z) {
      T = z, re.fallbackWarn = T;
    },
    get fallbackRoot() {
      return R;
    },
    set fallbackRoot(z) {
      R = z;
    },
    get fallbackFormat() {
      return D;
    },
    set fallbackFormat(z) {
      D = z, re.fallbackFormat = D;
    },
    get warnHtmlMessage() {
      return B;
    },
    set warnHtmlMessage(z) {
      B = z, re.warnHtmlMessage = z;
    },
    get escapeParameter() {
      return I;
    },
    set escapeParameter(z) {
      I = z, re.escapeParameter = z;
    },
    t: X,
    getLocaleMessage: J,
    setLocaleMessage: Z,
    mergeLocaleMessage: ce,
    getPostTranslationHandler: he,
    setPostTranslationHandler: V,
    getMissingHandler: oe,
    setMissingHandler: q,
    [Sb]: $
  };
  return le.datetimeFormats = ae, le.numberFormats = ge, le.rt = Ce, le.te = N, le.tm = G, le.d = xe, le.n = Ae, le.getDateTimeFormat = ue, le.setDateTimeFormat = k, le.mergeDateTimeFormat = w, le.getNumberFormat = U, le.setNumberFormat = Y, le.mergeNumberFormat = de, le[Cb] = i, le[Qd] = Ke, le[Jd] = vr, le[qd] = tt, le;
}
function nC(e) {
  const t = fe(e.locale) ? e.locale : Mi, n = fe(e.fallbackLocale) || pt(e.fallbackLocale) || Re(e.fallbackLocale) || e.fallbackLocale === !1 ? e.fallbackLocale : t, i = st(e.missing) ? e.missing : void 0, a = Ve(e.silentTranslationWarn) || bo(e.silentTranslationWarn) ? !e.silentTranslationWarn : !0, s = Ve(e.silentFallbackWarn) || bo(e.silentFallbackWarn) ? !e.silentFallbackWarn : !0, c = Ve(e.fallbackRoot) ? e.fallbackRoot : !0, f = !!e.formatFallbackMessages, d = Re(e.modifiers) ? e.modifiers : {}, h = e.pluralizationRules, m = st(e.postTranslation) ? e.postTranslation : void 0, b = fe(e.warnHtmlInMessage) ? e.warnHtmlInMessage !== "off" : !0, v = !!e.escapeParameterHtml, _ = Ve(e.sync) ? e.sync : !0;
  let x = e.messages;
  if (Re(e.sharedMessages)) {
    const I = e.sharedMessages;
    x = Object.keys(I).reduce((te, re) => {
      const Se = te[re] || (te[re] = {});
      return Ut(Se, I[re]), te;
    }, x || {});
  }
  const { __i18n: T, __root: R, __injectWithOption: D } = e, K = e.datetimeFormats, L = e.numberFormats, S = e.flatJson, B = e.translateExistCompatible;
  return {
    locale: t,
    fallbackLocale: n,
    messages: x,
    flatJson: S,
    datetimeFormats: K,
    numberFormats: L,
    missing: i,
    missingWarn: a,
    fallbackWarn: s,
    fallbackRoot: c,
    fallbackFormat: f,
    modifiers: d,
    pluralRules: h,
    postTranslation: m,
    warnHtmlMessage: b,
    escapeParameter: v,
    messageResolver: e.messageResolver,
    inheritLocale: _,
    translateExistCompatible: B,
    __i18n: T,
    __root: R,
    __injectWithOption: D
  };
}
function ef(e = {}, t) {
  {
    const n = Bf(nC(e)), { __extender: i } = e, a = {
      // id
      id: n.id,
      // locale
      get locale() {
        return n.locale.value;
      },
      set locale(s) {
        n.locale.value = s;
      },
      // fallbackLocale
      get fallbackLocale() {
        return n.fallbackLocale.value;
      },
      set fallbackLocale(s) {
        n.fallbackLocale.value = s;
      },
      // messages
      get messages() {
        return n.messages.value;
      },
      // datetimeFormats
      get datetimeFormats() {
        return n.datetimeFormats.value;
      },
      // numberFormats
      get numberFormats() {
        return n.numberFormats.value;
      },
      // availableLocales
      get availableLocales() {
        return n.availableLocales;
      },
      // formatter
      get formatter() {
        return {
          interpolate() {
            return [];
          }
        };
      },
      set formatter(s) {
      },
      // missing
      get missing() {
        return n.getMissingHandler();
      },
      set missing(s) {
        n.setMissingHandler(s);
      },
      // silentTranslationWarn
      get silentTranslationWarn() {
        return Ve(n.missingWarn) ? !n.missingWarn : n.missingWarn;
      },
      set silentTranslationWarn(s) {
        n.missingWarn = Ve(s) ? !s : s;
      },
      // silentFallbackWarn
      get silentFallbackWarn() {
        return Ve(n.fallbackWarn) ? !n.fallbackWarn : n.fallbackWarn;
      },
      set silentFallbackWarn(s) {
        n.fallbackWarn = Ve(s) ? !s : s;
      },
      // modifiers
      get modifiers() {
        return n.modifiers;
      },
      // formatFallbackMessages
      get formatFallbackMessages() {
        return n.fallbackFormat;
      },
      set formatFallbackMessages(s) {
        n.fallbackFormat = s;
      },
      // postTranslation
      get postTranslation() {
        return n.getPostTranslationHandler();
      },
      set postTranslation(s) {
        n.setPostTranslationHandler(s);
      },
      // sync
      get sync() {
        return n.inheritLocale;
      },
      set sync(s) {
        n.inheritLocale = s;
      },
      // warnInHtmlMessage
      get warnHtmlInMessage() {
        return n.warnHtmlMessage ? "warn" : "off";
      },
      set warnHtmlInMessage(s) {
        n.warnHtmlMessage = s !== "off";
      },
      // escapeParameterHtml
      get escapeParameterHtml() {
        return n.escapeParameter;
      },
      set escapeParameterHtml(s) {
        n.escapeParameter = s;
      },
      // preserveDirectiveContent
      get preserveDirectiveContent() {
        return !0;
      },
      set preserveDirectiveContent(s) {
      },
      // pluralizationRules
      get pluralizationRules() {
        return n.pluralRules || {};
      },
      // for internal
      __composer: n,
      // t
      t(...s) {
        const [c, f, d] = s, h = {};
        let m = null, b = null;
        if (!fe(c))
          throw Bt(Lt.INVALID_ARGUMENT);
        const v = c;
        return fe(f) ? h.locale = f : pt(f) ? m = f : Re(f) && (b = f), pt(d) ? m = d : Re(d) && (b = d), Reflect.apply(n.t, n, [
          v,
          m || b || {},
          h
        ]);
      },
      rt(...s) {
        return Reflect.apply(n.rt, n, [...s]);
      },
      // tc
      tc(...s) {
        const [c, f, d] = s, h = { plural: 1 };
        let m = null, b = null;
        if (!fe(c))
          throw Bt(Lt.INVALID_ARGUMENT);
        const v = c;
        return fe(f) ? h.locale = f : wt(f) ? h.plural = f : pt(f) ? m = f : Re(f) && (b = f), fe(d) ? h.locale = d : pt(d) ? m = d : Re(d) && (b = d), Reflect.apply(n.t, n, [
          v,
          m || b || {},
          h
        ]);
      },
      // te
      te(s, c) {
        return n.te(s, c);
      },
      // tm
      tm(s) {
        return n.tm(s);
      },
      // getLocaleMessage
      getLocaleMessage(s) {
        return n.getLocaleMessage(s);
      },
      // setLocaleMessage
      setLocaleMessage(s, c) {
        n.setLocaleMessage(s, c);
      },
      // mergeLocaleMessage
      mergeLocaleMessage(s, c) {
        n.mergeLocaleMessage(s, c);
      },
      // d
      d(...s) {
        return Reflect.apply(n.d, n, [...s]);
      },
      // getDateTimeFormat
      getDateTimeFormat(s) {
        return n.getDateTimeFormat(s);
      },
      // setDateTimeFormat
      setDateTimeFormat(s, c) {
        n.setDateTimeFormat(s, c);
      },
      // mergeDateTimeFormat
      mergeDateTimeFormat(s, c) {
        n.mergeDateTimeFormat(s, c);
      },
      // n
      n(...s) {
        return Reflect.apply(n.n, n, [...s]);
      },
      // getNumberFormat
      getNumberFormat(s) {
        return n.getNumberFormat(s);
      },
      // setNumberFormat
      setNumberFormat(s, c) {
        n.setNumberFormat(s, c);
      },
      // mergeNumberFormat
      mergeNumberFormat(s, c) {
        n.mergeNumberFormat(s, c);
      },
      // getChoiceIndex
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      getChoiceIndex(s, c) {
        return -1;
      }
    };
    return a.__extender = i, a;
  }
}
const Df = {
  tag: {
    type: [String, Object]
  },
  locale: {
    type: String
  },
  scope: {
    type: String,
    // NOTE: avoid https://github.com/microsoft/rushstack/issues/1050
    validator: (e) => e === "parent" || e === "global",
    default: "parent"
    /* ComponentI18nScope */
  },
  i18n: {
    type: Object
  }
};
function oC({ slots: e }, t) {
  return t.length === 1 && t[0] === "default" ? (e.default ? e.default() : []).reduce((i, a) => [
    ...i,
    // prettier-ignore
    ...a.type === Qt ? a.children : [a]
  ], []) : t.reduce((n, i) => {
    const a = e[i];
    return a && (n[i] = a()), n;
  }, nt());
}
function Eb(e) {
  return Qt;
}
const iC = /* @__PURE__ */ Go({
  /* eslint-disable */
  name: "i18n-t",
  props: Ut({
    keypath: {
      type: String,
      required: !0
    },
    plural: {
      type: [Number, String],
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      validator: (e) => wt(e) || !isNaN(e)
    }
  }, Df),
  /* eslint-enable */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setup(e, t) {
    const { slots: n, attrs: i } = t, a = e.i18n || ma({
      useScope: e.scope,
      __useComponent: !0
    });
    return () => {
      const s = Object.keys(n).filter((b) => b !== "_"), c = nt();
      e.locale && (c.locale = e.locale), e.plural !== void 0 && (c.plural = fe(e.plural) ? +e.plural : e.plural);
      const f = oC(t, s), d = a[Qd](e.keypath, f, c), h = Ut(nt(), i), m = fe(e.tag) || Qe(e.tag) ? e.tag : Eb();
      return Yv(m, h, d);
    };
  }
}), Lm = iC;
function lC(e) {
  return pt(e) && !fe(e[0]);
}
function Tb(e, t, n, i) {
  const { slots: a, attrs: s } = t;
  return () => {
    const c = { part: !0 };
    let f = nt();
    e.locale && (c.locale = e.locale), fe(e.format) ? c.key = e.format : Qe(e.format) && (fe(e.format.key) && (c.key = e.format.key), f = Object.keys(e.format).reduce((v, _) => n.includes(_) ? Ut(nt(), v, { [_]: e.format[_] }) : v, nt()));
    const d = i(e.value, c, f);
    let h = [c.key];
    pt(d) ? h = d.map((v, _) => {
      const x = a[v.type], T = x ? x({ [v.type]: v.value, index: _, parts: d }) : [v.value];
      return lC(T) && (T[0].key = `${v.type}-${_}`), T;
    }) : fe(d) && (h = [d]);
    const m = Ut(nt(), s), b = fe(e.tag) || Qe(e.tag) ? e.tag : Eb();
    return Yv(b, m, h);
  };
}
const aC = /* @__PURE__ */ Go({
  /* eslint-disable */
  name: "i18n-n",
  props: Ut({
    value: {
      type: Number,
      required: !0
    },
    format: {
      type: [String, Object]
    }
  }, Df),
  /* eslint-enable */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setup(e, t) {
    const n = e.i18n || ma({
      useScope: e.scope,
      __useComponent: !0
    });
    return Tb(e, t, kb, (...i) => (
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      n[qd](...i)
    ));
  }
}), Pm = aC, sC = /* @__PURE__ */ Go({
  /* eslint-disable */
  name: "i18n-d",
  props: Ut({
    value: {
      type: [Number, Date],
      required: !0
    },
    format: {
      type: [String, Object]
    }
  }, Df),
  /* eslint-enable */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setup(e, t) {
    const n = e.i18n || ma({
      useScope: e.scope,
      __useComponent: !0
    });
    return Tb(e, t, _b, (...i) => (
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      n[Jd](...i)
    ));
  }
}), Nm = sC;
function uC(e, t) {
  const n = e;
  if (e.mode === "composition")
    return n.__getInstance(t) || e.global;
  {
    const i = n.__getInstance(t);
    return i != null ? i.__composer : e.global.__composer;
  }
}
function cC(e) {
  const t = (c) => {
    const { instance: f, modifiers: d, value: h } = c;
    if (!f || !f.$)
      throw Bt(Lt.UNEXPECTED_ERROR);
    const m = uC(e, f.$), b = Rm(h);
    return [
      Reflect.apply(m.t, m, [...Im(b)]),
      m
    ];
  };
  return {
    created: (c, f) => {
      const [d, h] = t(f);
      Ys && e.global === h && (c.__i18nWatcher = Ir(h.locale, () => {
        f.instance && f.instance.$forceUpdate();
      })), c.__composer = h, c.textContent = d;
    },
    unmounted: (c) => {
      Ys && c.__i18nWatcher && (c.__i18nWatcher(), c.__i18nWatcher = void 0, delete c.__i18nWatcher), c.__composer && (c.__composer = void 0, delete c.__composer);
    },
    beforeUpdate: (c, { value: f }) => {
      if (c.__composer) {
        const d = c.__composer, h = Rm(f);
        c.textContent = Reflect.apply(d.t, d, [
          ...Im(h)
        ]);
      }
    },
    getSSRProps: (c) => {
      const [f] = t(c);
      return { textContent: f };
    }
  };
}
function Rm(e) {
  if (fe(e))
    return { path: e };
  if (Re(e)) {
    if (!("path" in e))
      throw Bt(Lt.REQUIRED_VALUE, "path");
    return e;
  } else
    throw Bt(Lt.INVALID_VALUE);
}
function Im(e) {
  const { path: t, locale: n, args: i, choice: a, plural: s } = e, c = {}, f = i || {};
  return fe(n) && (c.locale = n), wt(a) && (c.plural = a), wt(s) && (c.plural = s), [t, f, c];
}
function dC(e, t, ...n) {
  const i = Re(n[0]) ? n[0] : {}, a = !!i.useI18nComponentName;
  (Ve(i.globalInstall) ? i.globalInstall : !0) && ([a ? "i18n" : Lm.name, "I18nT"].forEach((c) => e.component(c, Lm)), [Pm.name, "I18nN"].forEach((c) => e.component(c, Pm)), [Nm.name, "I18nD"].forEach((c) => e.component(c, Nm))), e.directive("t", cC(t));
}
function fC(e, t, n) {
  return {
    beforeCreate() {
      const i = vo();
      if (!i)
        throw Bt(Lt.UNEXPECTED_ERROR);
      const a = this.$options;
      if (a.i18n) {
        const s = a.i18n;
        if (a.__i18n && (s.__i18n = a.__i18n), s.__root = t, this === this.$root)
          this.$i18n = Am(e, s);
        else {
          s.__injectWithOption = !0, s.__extender = n.__vueI18nExtend, this.$i18n = ef(s);
          const c = this.$i18n;
          c.__extender && (c.__disposer = c.__extender(this.$i18n));
        }
      } else if (a.__i18n)
        if (this === this.$root)
          this.$i18n = Am(e, a);
        else {
          this.$i18n = ef({
            __i18n: a.__i18n,
            __injectWithOption: !0,
            __extender: n.__vueI18nExtend,
            __root: t
          });
          const s = this.$i18n;
          s.__extender && (s.__disposer = s.__extender(this.$i18n));
        }
      else
        this.$i18n = e;
      a.__i18nGlobal && $b(t, a, a), this.$t = (...s) => this.$i18n.t(...s), this.$rt = (...s) => this.$i18n.rt(...s), this.$tc = (...s) => this.$i18n.tc(...s), this.$te = (s, c) => this.$i18n.te(s, c), this.$d = (...s) => this.$i18n.d(...s), this.$n = (...s) => this.$i18n.n(...s), this.$tm = (s) => this.$i18n.tm(s), n.__setInstance(i, this.$i18n);
    },
    mounted() {
    },
    unmounted() {
      const i = vo();
      if (!i)
        throw Bt(Lt.UNEXPECTED_ERROR);
      const a = this.$i18n;
      delete this.$t, delete this.$rt, delete this.$tc, delete this.$te, delete this.$d, delete this.$n, delete this.$tm, a.__disposer && (a.__disposer(), delete a.__disposer, delete a.__extender), n.__deleteInstance(i), delete this.$i18n;
    }
  };
}
function Am(e, t) {
  e.locale = t.locale || e.locale, e.fallbackLocale = t.fallbackLocale || e.fallbackLocale, e.missing = t.missing || e.missing, e.silentTranslationWarn = t.silentTranslationWarn || e.silentFallbackWarn, e.silentFallbackWarn = t.silentFallbackWarn || e.silentFallbackWarn, e.formatFallbackMessages = t.formatFallbackMessages || e.formatFallbackMessages, e.postTranslation = t.postTranslation || e.postTranslation, e.warnHtmlInMessage = t.warnHtmlInMessage || e.warnHtmlInMessage, e.escapeParameterHtml = t.escapeParameterHtml || e.escapeParameterHtml, e.sync = t.sync || e.sync, e.__composer[Sb](t.pluralizationRules || e.pluralizationRules);
  const n = _u(e.locale, {
    messages: t.messages,
    __i18n: t.__i18n
  });
  return Object.keys(n).forEach((i) => e.mergeLocaleMessage(i, n[i])), t.datetimeFormats && Object.keys(t.datetimeFormats).forEach((i) => e.mergeDateTimeFormat(i, t.datetimeFormats[i])), t.numberFormats && Object.keys(t.numberFormats).forEach((i) => e.mergeNumberFormat(i, t.numberFormats[i])), e;
}
const pC = /* @__PURE__ */ ko("global-vue-i18n");
function gC(e = {}, t) {
  const n = __VUE_I18N_LEGACY_API__ && Ve(e.legacy) ? e.legacy : __VUE_I18N_LEGACY_API__, i = Ve(e.globalInjection) ? e.globalInjection : !0, a = __VUE_I18N_LEGACY_API__ && n ? !!e.allowComposition : !0, s = /* @__PURE__ */ new Map(), [c, f] = hC(e, n), d = /* @__PURE__ */ ko("");
  function h(v) {
    return s.get(v) || null;
  }
  function m(v, _) {
    s.set(v, _);
  }
  function b(v) {
    s.delete(v);
  }
  {
    const v = {
      // mode
      get mode() {
        return __VUE_I18N_LEGACY_API__ && n ? "legacy" : "composition";
      },
      // allowComposition
      get allowComposition() {
        return a;
      },
      // install plugin
      async install(_, ...x) {
        if (_.__VUE_I18N_SYMBOL__ = d, _.provide(_.__VUE_I18N_SYMBOL__, v), Re(x[0])) {
          const D = x[0];
          v.__composerExtend = D.__composerExtend, v.__vueI18nExtend = D.__vueI18nExtend;
        }
        let T = null;
        !n && i && (T = CC(_, v.global)), __VUE_I18N_FULL_INSTALL__ && dC(_, v, ...x), __VUE_I18N_LEGACY_API__ && n && _.mixin(fC(f, f.__composer, v));
        const R = _.unmount;
        _.unmount = () => {
          T && T(), v.dispose(), R();
        };
      },
      // global accessor
      get global() {
        return f;
      },
      dispose() {
        c.stop();
      },
      // @internal
      __instances: s,
      // @internal
      __getInstance: h,
      // @internal
      __setInstance: m,
      // @internal
      __deleteInstance: b
    };
    return v;
  }
}
function ma(e = {}) {
  const t = vo();
  if (t == null)
    throw Bt(Lt.MUST_BE_CALL_SETUP_TOP);
  if (!t.isCE && t.appContext.app != null && !t.appContext.app.__VUE_I18N_SYMBOL__)
    throw Bt(Lt.NOT_INSTALLED);
  const n = mC(t), i = bC(n), a = xb(t), s = vC(e, a);
  if (__VUE_I18N_LEGACY_API__ && n.mode === "legacy" && !e.__useComponent) {
    if (!n.allowComposition)
      throw Bt(Lt.NOT_AVAILABLE_IN_LEGACY_MODE);
    return wC(t, s, i, e);
  }
  if (s === "global")
    return $b(i, e, a), i;
  if (s === "parent") {
    let d = yC(n, t, e.__useComponent);
    return d == null && (d = i), d;
  }
  const c = n;
  let f = c.__getInstance(t);
  if (f == null) {
    const d = Ut({}, e);
    "__i18n" in a && (d.__i18n = a.__i18n), i && (d.__root = i), f = Bf(d), c.__composerExtend && (f[Zd] = c.__composerExtend(f)), kC(c, t, f), c.__setInstance(t, f);
  }
  return f;
}
function hC(e, t, n) {
  const i = p_();
  {
    const a = __VUE_I18N_LEGACY_API__ && t ? i.run(() => ef(e)) : i.run(() => Bf(e));
    if (a == null)
      throw Bt(Lt.UNEXPECTED_ERROR);
    return [i, a];
  }
}
function mC(e) {
  {
    const t = Ml(e.isCE ? pC : e.appContext.app.__VUE_I18N_SYMBOL__);
    if (!t)
      throw Bt(e.isCE ? Lt.NOT_INSTALLED_WITH_PROVIDE : Lt.UNEXPECTED_ERROR);
    return t;
  }
}
function vC(e, t) {
  return vu(e) ? "__i18n" in t ? "local" : "global" : e.useScope ? e.useScope : "local";
}
function bC(e) {
  return e.mode === "composition" ? e.global : e.global.__composer;
}
function yC(e, t, n = !1) {
  let i = null;
  const a = t.root;
  let s = _C(t, n);
  for (; s != null; ) {
    const c = e;
    if (e.mode === "composition")
      i = c.__getInstance(s);
    else if (__VUE_I18N_LEGACY_API__) {
      const f = c.__getInstance(s);
      f != null && (i = f.__composer, n && i && !i[Cb] && (i = null));
    }
    if (i != null || a === s)
      break;
    s = s.parent;
  }
  return i;
}
function _C(e, t = !1) {
  return e == null ? null : t && e.vnode.ctx || e.parent;
}
function kC(e, t, n) {
  pa(() => {
  }, t), $f(() => {
    const i = n;
    e.__deleteInstance(t);
    const a = i[Zd];
    a && (a(), delete i[Zd]);
  }, t);
}
function wC(e, t, n, i = {}) {
  const a = t === "local", s = wf(null);
  if (a && e.proxy && !(e.proxy.$options.i18n || e.proxy.$options.__i18n))
    throw Bt(Lt.MUST_DEFINE_I18N_OPTION_IN_ALLOW_COMPOSITION);
  const c = Ve(i.inheritLocale) ? i.inheritLocale : !fe(i.locale), f = ot(
    // prettier-ignore
    !a || c ? n.locale.value : fe(i.locale) ? i.locale : Mi
  ), d = ot(
    // prettier-ignore
    !a || c ? n.fallbackLocale.value : fe(i.fallbackLocale) || pt(i.fallbackLocale) || Re(i.fallbackLocale) || i.fallbackLocale === !1 ? i.fallbackLocale : f.value
  ), h = ot(_u(f.value, i)), m = ot(Re(i.datetimeFormats) ? i.datetimeFormats : { [f.value]: {} }), b = ot(Re(i.numberFormats) ? i.numberFormats : { [f.value]: {} }), v = a ? n.missingWarn : Ve(i.missingWarn) || bo(i.missingWarn) ? i.missingWarn : !0, _ = a ? n.fallbackWarn : Ve(i.fallbackWarn) || bo(i.fallbackWarn) ? i.fallbackWarn : !0, x = a ? n.fallbackRoot : Ve(i.fallbackRoot) ? i.fallbackRoot : !0, T = !!i.fallbackFormat, R = st(i.missing) ? i.missing : null, D = st(i.postTranslation) ? i.postTranslation : null, K = a ? n.warnHtmlMessage : Ve(i.warnHtmlMessage) ? i.warnHtmlMessage : !0, L = !!i.escapeParameter, S = a ? n.modifiers : Re(i.modifiers) ? i.modifiers : {}, B = i.pluralRules || a && n.pluralRules;
  function I() {
    return [
      f.value,
      d.value,
      h.value,
      m.value,
      b.value
    ];
  }
  const F = Gr({
    get: () => s.value ? s.value.locale.value : f.value,
    set: (E) => {
      s.value && (s.value.locale.value = E), f.value = E;
    }
  }), te = Gr({
    get: () => s.value ? s.value.fallbackLocale.value : d.value,
    set: (E) => {
      s.value && (s.value.fallbackLocale.value = E), d.value = E;
    }
  }), re = Gr(() => s.value ? s.value.messages.value : h.value), Se = Gr(() => m.value), Pe = Gr(() => b.value);
  function be() {
    return s.value ? s.value.getPostTranslationHandler() : D;
  }
  function we(E) {
    s.value && s.value.setPostTranslationHandler(E);
  }
  function De() {
    return s.value ? s.value.getMissingHandler() : R;
  }
  function ae(E) {
    s.value && s.value.setMissingHandler(E);
  }
  function ge(E) {
    return I(), E();
  }
  function he(...E) {
    return s.value ? ge(() => Reflect.apply(s.value.t, null, [...E])) : ge(() => "");
  }
  function V(...E) {
    return s.value ? Reflect.apply(s.value.rt, null, [...E]) : "";
  }
  function oe(...E) {
    return s.value ? ge(() => Reflect.apply(s.value.d, null, [...E])) : ge(() => "");
  }
  function q(...E) {
    return s.value ? ge(() => Reflect.apply(s.value.n, null, [...E])) : ge(() => "");
  }
  function P(E) {
    return s.value ? s.value.tm(E) : {};
  }
  function X(E, G) {
    return s.value ? s.value.te(E, G) : !1;
  }
  function Ce(E) {
    return s.value ? s.value.getLocaleMessage(E) : {};
  }
  function xe(E, G) {
    s.value && (s.value.setLocaleMessage(E, G), h.value[E] = G);
  }
  function Ae(E, G) {
    s.value && s.value.mergeLocaleMessage(E, G);
  }
  function Oe(E) {
    return s.value ? s.value.getDateTimeFormat(E) : {};
  }
  function ze(E, G) {
    s.value && (s.value.setDateTimeFormat(E, G), m.value[E] = G);
  }
  function Me(E, G) {
    s.value && s.value.mergeDateTimeFormat(E, G);
  }
  function Ke(E) {
    return s.value ? s.value.getNumberFormat(E) : {};
  }
  function tt(E, G) {
    s.value && (s.value.setNumberFormat(E, G), b.value[E] = G);
  }
  function vr(E, G) {
    s.value && s.value.mergeNumberFormat(E, G);
  }
  const $ = {
    get id() {
      return s.value ? s.value.id : -1;
    },
    locale: F,
    fallbackLocale: te,
    messages: re,
    datetimeFormats: Se,
    numberFormats: Pe,
    get inheritLocale() {
      return s.value ? s.value.inheritLocale : c;
    },
    set inheritLocale(E) {
      s.value && (s.value.inheritLocale = E);
    },
    get availableLocales() {
      return s.value ? s.value.availableLocales : Object.keys(h.value);
    },
    get modifiers() {
      return s.value ? s.value.modifiers : S;
    },
    get pluralRules() {
      return s.value ? s.value.pluralRules : B;
    },
    get isGlobal() {
      return s.value ? s.value.isGlobal : !1;
    },
    get missingWarn() {
      return s.value ? s.value.missingWarn : v;
    },
    set missingWarn(E) {
      s.value && (s.value.missingWarn = E);
    },
    get fallbackWarn() {
      return s.value ? s.value.fallbackWarn : _;
    },
    set fallbackWarn(E) {
      s.value && (s.value.missingWarn = E);
    },
    get fallbackRoot() {
      return s.value ? s.value.fallbackRoot : x;
    },
    set fallbackRoot(E) {
      s.value && (s.value.fallbackRoot = E);
    },
    get fallbackFormat() {
      return s.value ? s.value.fallbackFormat : T;
    },
    set fallbackFormat(E) {
      s.value && (s.value.fallbackFormat = E);
    },
    get warnHtmlMessage() {
      return s.value ? s.value.warnHtmlMessage : K;
    },
    set warnHtmlMessage(E) {
      s.value && (s.value.warnHtmlMessage = E);
    },
    get escapeParameter() {
      return s.value ? s.value.escapeParameter : L;
    },
    set escapeParameter(E) {
      s.value && (s.value.escapeParameter = E);
    },
    t: he,
    getPostTranslationHandler: be,
    setPostTranslationHandler: we,
    getMissingHandler: De,
    setMissingHandler: ae,
    rt: V,
    d: oe,
    n: q,
    tm: P,
    te: X,
    getLocaleMessage: Ce,
    setLocaleMessage: xe,
    mergeLocaleMessage: Ae,
    getDateTimeFormat: Oe,
    setDateTimeFormat: ze,
    mergeDateTimeFormat: Me,
    getNumberFormat: Ke,
    setNumberFormat: tt,
    mergeNumberFormat: vr
  };
  function N(E) {
    E.locale.value = f.value, E.fallbackLocale.value = d.value, Object.keys(h.value).forEach((G) => {
      E.mergeLocaleMessage(G, h.value[G]);
    }), Object.keys(m.value).forEach((G) => {
      E.mergeDateTimeFormat(G, m.value[G]);
    }), Object.keys(b.value).forEach((G) => {
      E.mergeNumberFormat(G, b.value[G]);
    }), E.escapeParameter = L, E.fallbackFormat = T, E.fallbackRoot = x, E.fallbackWarn = _, E.missingWarn = v, E.warnHtmlMessage = K;
  }
  return _v(() => {
    if (e.proxy == null || e.proxy.$i18n == null)
      throw Bt(Lt.NOT_AVAILABLE_COMPOSITION_IN_LEGACY);
    const E = s.value = e.proxy.$i18n.__composer;
    t === "global" ? (f.value = E.locale.value, d.value = E.fallbackLocale.value, h.value = E.messages.value, m.value = E.datetimeFormats.value, b.value = E.numberFormats.value) : a && N(E);
  }), $;
}
const SC = [
  "locale",
  "fallbackLocale",
  "availableLocales"
], Bm = ["t", "rt", "d", "n", "tm", "te"];
function CC(e, t) {
  const n = /* @__PURE__ */ Object.create(null);
  return SC.forEach((a) => {
    const s = Object.getOwnPropertyDescriptor(t, a);
    if (!s)
      throw Bt(Lt.UNEXPECTED_ERROR);
    const c = zt(s.value) ? {
      get() {
        return s.value.value;
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      set(f) {
        s.value.value = f;
      }
    } : {
      get() {
        return s.get && s.get();
      }
    };
    Object.defineProperty(n, a, c);
  }), e.config.globalProperties.$i18n = n, Bm.forEach((a) => {
    const s = Object.getOwnPropertyDescriptor(t, a);
    if (!s || !s.value)
      throw Bt(Lt.UNEXPECTED_ERROR);
    Object.defineProperty(e.config.globalProperties, `$${a}`, s);
  }), () => {
    delete e.config.globalProperties.$i18n, Bm.forEach((a) => {
      delete e.config.globalProperties[`$${a}`];
    });
  };
}
ZS();
__INTLIFY_JIT_COMPILATION__ ? hm(YS) : hm(KS);
DS(vS);
MS(cb);
if (__INTLIFY_PROD_DEVTOOLS__) {
  const e = Rn();
  e.__INTLIFY__ = !0, $S(e.__INTLIFY_DEVTOOLS_GLOBAL_HOOK__);
}
var xC = Object.defineProperty, Dm = Object.getOwnPropertySymbols, $C = Object.prototype.hasOwnProperty, EC = Object.prototype.propertyIsEnumerable, Mm = (e, t, n) => t in e ? xC(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n, TC = (e, t) => {
  for (var n in t || (t = {}))
    $C.call(t, n) && Mm(e, n, t[n]);
  if (Dm)
    for (var n of Dm(t))
      EC.call(t, n) && Mm(e, n, t[n]);
  return e;
};
function Mn(e) {
  return e == null || e === "" || Array.isArray(e) && e.length === 0 || !(e instanceof Date) && typeof e == "object" && Object.keys(e).length === 0;
}
function Mf(e) {
  return typeof e == "function" && "call" in e && "apply" in e;
}
function dt(e) {
  return !Mn(e);
}
function vn(e, t = !0) {
  return e instanceof Object && e.constructor === Object && (t || Object.keys(e).length !== 0);
}
function Ob(e = {}, t = {}) {
  const n = TC({}, e);
  return Object.keys(t).forEach((i) => {
    const a = i;
    vn(t[a]) && a in e && vn(e[a]) ? n[a] = Ob(e[a], t[a]) : n[a] = t[a];
  }), n;
}
function OC(...e) {
  return e.reduce((t, n, i) => i === 0 ? n : Ob(t, n), {});
}
function Ar(e, ...t) {
  return Mf(e) ? e(...t) : e;
}
function mr(e, t = !0) {
  return typeof e == "string" && (t || e !== "");
}
function cn(e) {
  return mr(e) ? e.replace(/(-|_)/g, "").toLowerCase() : e;
}
function jf(e, t = "", n = {}) {
  const i = cn(t).split("."), a = i.shift();
  if (a) {
    if (vn(e)) {
      const s = Object.keys(e).find((c) => cn(c) === a) || "";
      return jf(Ar(e[s], n), i.join("."), n);
    }
    return;
  }
  return Ar(e, n);
}
function ku(e, t = !0) {
  return Array.isArray(e) && (t || e.length !== 0);
}
function LC(e) {
  return dt(e) && !isNaN(e);
}
function Bn(e, t) {
  if (t) {
    const n = t.test(e);
    return t.lastIndex = 0, n;
  }
  return !1;
}
function PC(...e) {
  return OC(...e);
}
function Fl(e) {
  return e && e.replace(/\/\*(?:(?!\*\/)[\s\S])*\*\/|[\r\n\t]+/g, "").replace(/ {2,}/g, " ").replace(/ ([{:}]) /g, "$1").replace(/([;,]) /g, "$1").replace(/ !/g, "!").replace(/: /g, ":");
}
function NC(e) {
  return mr(e, !1) ? e[0].toUpperCase() + e.slice(1) : e;
}
function Lb(e) {
  return mr(e) ? e.replace(/(_)/g, "-").replace(/[A-Z]/g, (t, n) => n === 0 ? t : "-" + t.toLowerCase()).toLowerCase() : e;
}
function jm(e) {
  return mr(e) ? e.replace(/[A-Z]/g, (t, n) => n === 0 ? t : "." + t.toLowerCase()).toLowerCase() : e;
}
function Pb() {
  const e = /* @__PURE__ */ new Map();
  return {
    on(t, n) {
      let i = e.get(t);
      return i ? i.push(n) : i = [n], e.set(t, i), this;
    },
    off(t, n) {
      const i = e.get(t);
      return i && i.splice(i.indexOf(n) >>> 0, 1), this;
    },
    emit(t, n) {
      const i = e.get(t);
      i && i.forEach((a) => {
        a(n);
      });
    },
    clear() {
      e.clear();
    }
  };
}
function zl(...e) {
  if (e) {
    let t = [];
    for (let n = 0; n < e.length; n++) {
      const i = e[n];
      if (!i)
        continue;
      const a = typeof i;
      if (a === "string" || a === "number")
        t.push(i);
      else if (a === "object") {
        const s = Array.isArray(i) ? [zl(...i)] : Object.entries(i).map(([c, f]) => f ? c : void 0);
        t = s.length ? t.concat(s.filter((c) => !!c)) : t;
      }
    }
    return t.join(" ").trim();
  }
}
function Nb(e, t) {
  return e ? e.classList ? e.classList.contains(t) : new RegExp("(^| )" + t + "( |$)", "gi").test(e.className) : !1;
}
function Rb(e, t) {
  if (e && t) {
    const n = (i) => {
      Nb(e, i) || (e.classList ? e.classList.add(i) : e.className += " " + i);
    };
    [t].flat().filter(Boolean).forEach((i) => i.split(" ").forEach(n));
  }
}
function Ds(e, t) {
  if (e && t) {
    const n = (i) => {
      e.classList ? e.classList.remove(i) : e.className = e.className.replace(new RegExp("(^|\\b)" + i.split(" ").join("|") + "(\\b|$)", "gi"), " ");
    };
    [t].flat().filter(Boolean).forEach((i) => i.split(" ").forEach(n));
  }
}
function Sd() {
  const e = window, t = document, n = t.documentElement, i = t.getElementsByTagName("body")[0], a = e.innerWidth || n.clientWidth || i.clientWidth, s = e.innerHeight || n.clientHeight || i.clientHeight;
  return { width: a, height: s };
}
function tf(e) {
  return e ? Math.abs(e.scrollLeft) : 0;
}
function RC() {
  const e = document.documentElement;
  return (window.pageXOffset || tf(e)) - (e.clientLeft || 0);
}
function IC() {
  const e = document.documentElement;
  return (window.pageYOffset || e.scrollTop) - (e.clientTop || 0);
}
function Pr(e, t) {
  return e instanceof HTMLElement ? e.offsetWidth : 0;
}
function Ib(e) {
  if (e) {
    let t = e.parentNode;
    return t && t instanceof ShadowRoot && t.host && (t = t.host), t;
  }
  return null;
}
function Ab(e) {
  return !!(e !== null && typeof e < "u" && e.nodeName && Ib(e));
}
function va(e) {
  return typeof Element < "u" ? e instanceof Element : e !== null && typeof e == "object" && e.nodeType === 1 && typeof e.nodeName == "string";
}
function Xs(e, t = {}) {
  if (va(e)) {
    const n = (i, a) => {
      var s, c;
      const f = (s = e == null ? void 0 : e.$attrs) != null && s[i] ? [(c = e == null ? void 0 : e.$attrs) == null ? void 0 : c[i]] : [];
      return [a].flat().reduce((d, h) => {
        if (h != null) {
          const m = typeof h;
          if (m === "string" || m === "number")
            d.push(h);
          else if (m === "object") {
            const b = Array.isArray(h) ? n(i, h) : Object.entries(h).map(([v, _]) => i === "style" && (_ || _ === 0) ? `${v.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase()}:${_}` : _ ? v : void 0);
            d = b.length ? d.concat(b.filter((v) => !!v)) : d;
          }
        }
        return d;
      }, f);
    };
    Object.entries(t).forEach(([i, a]) => {
      if (a != null) {
        const s = i.match(/^on(.+)/);
        s ? e.addEventListener(s[1].toLowerCase(), a) : i === "p-bind" || i === "pBind" ? Xs(e, a) : (a = i === "class" ? [...new Set(n("class", a))].join(" ").trim() : i === "style" ? n("style", a).join(";").trim() : a, (e.$attrs = e.$attrs || {}) && (e.$attrs[i] = a), e.setAttribute(i, a));
      }
    });
  }
}
function Ms(e, t = {}, ...n) {
  if (e) {
    const i = document.createElement(e);
    return Xs(i, t), i.append(...n), i;
  }
}
function AC(e, t) {
  if (e) {
    e.style.opacity = "0";
    let n = +/* @__PURE__ */ new Date(), i = "0";
    const a = function() {
      i = `${+e.style.opacity + ((/* @__PURE__ */ new Date()).getTime() - n) / t}`, e.style.opacity = i, n = +/* @__PURE__ */ new Date(), +i < 1 && ("requestAnimationFrame" in window ? requestAnimationFrame(a) : setTimeout(a, 16));
    };
    a();
  }
}
function Qs(e, t) {
  return va(e) ? e.matches(t) ? e : e.querySelector(t) : null;
}
function Uo(e, t) {
  if (va(e)) {
    const n = e.getAttribute(t);
    return isNaN(n) ? n === "true" || n === "false" ? n === "true" : n : +n;
  }
}
function Fm(e) {
  if (e) {
    let t = e.offsetHeight;
    const n = getComputedStyle(e);
    return t -= parseFloat(n.paddingTop) + parseFloat(n.paddingBottom) + parseFloat(n.borderTopWidth) + parseFloat(n.borderBottomWidth), t;
  }
  return 0;
}
function BC(e) {
  if (e) {
    const t = e.getBoundingClientRect();
    return {
      top: t.top + (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0),
      left: t.left + (window.pageXOffset || tf(document.documentElement) || tf(document.body) || 0)
    };
  }
  return {
    top: "auto",
    left: "auto"
  };
}
function ao(e, t) {
  return e ? e.offsetHeight : 0;
}
function Bb(e, t = []) {
  const n = Ib(e);
  return n === null ? t : Bb(n, t.concat([n]));
}
function DC(e) {
  const t = [];
  if (e) {
    const n = Bb(e), i = /(auto|scroll)/, a = (s) => {
      try {
        const c = window.getComputedStyle(s, null);
        return i.test(c.getPropertyValue("overflow")) || i.test(c.getPropertyValue("overflowX")) || i.test(c.getPropertyValue("overflowY"));
      } catch {
        return !1;
      }
    };
    for (const s of n) {
      const c = s.nodeType === 1 && s.dataset.scrollselectors;
      if (c) {
        const f = c.split(",");
        for (const d of f) {
          const h = Qs(s, d);
          h && a(h) && t.push(h);
        }
      }
      s.nodeType !== 9 && a(s) && t.push(s);
    }
  }
  return t;
}
function zm(e) {
  if (e) {
    let t = e.offsetWidth;
    const n = getComputedStyle(e);
    return t -= parseFloat(n.paddingLeft) + parseFloat(n.paddingRight) + parseFloat(n.borderLeftWidth) + parseFloat(n.borderRightWidth), t;
  }
  return 0;
}
function MC() {
  return !!(typeof window < "u" && window.document && window.document.createElement);
}
function jC() {
  return "ontouchstart" in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
}
function FC(e, t = "", n) {
  va(e) && n !== null && n !== void 0 && e.setAttribute(t, n);
}
var Ls = {};
function Pl(e = "pui_id_") {
  return Object.hasOwn(Ls, e) || (Ls[e] = 0), Ls[e]++, `${e}${Ls[e]}`;
}
function zC() {
  let e = [];
  const t = (c, f, d = 999) => {
    const h = a(c, f, d), m = h.value + (h.key === c ? 0 : d) + 1;
    return e.push({ key: c, value: m }), m;
  }, n = (c) => {
    e = e.filter((f) => f.value !== c);
  }, i = (c, f) => a(c).value, a = (c, f, d = 0) => [...e].reverse().find((h) => !0) || { key: c, value: d }, s = (c) => c && parseInt(c.style.zIndex, 10) || 0;
  return {
    get: s,
    set: (c, f, d) => {
      f && (f.style.zIndex = String(t(c, !0, d)));
    },
    clear: (c) => {
      c && (n(s(c)), c.style.zIndex = "");
    },
    getCurrent: (c) => i(c)
  };
}
var Um = zC(), UC = Object.defineProperty, WC = Object.defineProperties, VC = Object.getOwnPropertyDescriptors, Js = Object.getOwnPropertySymbols, Db = Object.prototype.hasOwnProperty, Mb = Object.prototype.propertyIsEnumerable, Wm = (e, t, n) => t in e ? UC(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n, Yr = (e, t) => {
  for (var n in t || (t = {}))
    Db.call(t, n) && Wm(e, n, t[n]);
  if (Js)
    for (var n of Js(t))
      Mb.call(t, n) && Wm(e, n, t[n]);
  return e;
}, Cd = (e, t) => WC(e, VC(t)), On = (e, t) => {
  var n = {};
  for (var i in e)
    Db.call(e, i) && t.indexOf(i) < 0 && (n[i] = e[i]);
  if (e != null && Js)
    for (var i of Js(e))
      t.indexOf(i) < 0 && Mb.call(e, i) && (n[i] = e[i]);
  return n;
}, HC = Pb(), jt = HC;
function Vm(e, t) {
  ku(e) ? e.push(...t || []) : vn(e) && Object.assign(e, t);
}
function KC(e) {
  return vn(e) && e.hasOwnProperty("$value") && e.hasOwnProperty("$type") ? e.$value : e;
}
function YC(e) {
  return e.replaceAll(/ /g, "").replace(/[^\w]/g, "-");
}
function rf(e = "", t = "") {
  return YC(`${mr(e, !1) && mr(t, !1) ? `${e}-` : e}${t}`);
}
function jb(e = "", t = "") {
  return `--${rf(e, t)}`;
}
function GC(e = "") {
  const t = (e.match(/{/g) || []).length, n = (e.match(/}/g) || []).length;
  return (t + n) % 2 !== 0;
}
function Fb(e, t = "", n = "", i = [], a) {
  if (mr(e)) {
    const s = /{([^}]*)}/g, c = e.trim();
    if (GC(c))
      return;
    if (Bn(c, s)) {
      const f = c.replaceAll(s, (m) => {
        const v = m.replace(/{|}/g, "").split(".").filter((_) => !i.some((x) => Bn(_, x)));
        return `var(${jb(n, Lb(v.join("-")))}${dt(a) ? `, ${a}` : ""})`;
      }), d = /(\d+\s+[\+\-\*\/]\s+\d+)/g, h = /var\([^)]+\)/g;
      return Bn(f.replace(h, "0"), d) ? `calc(${f})` : f;
    }
    return c;
  } else if (LC(e))
    return e;
}
function XC(e, t, n) {
  mr(t, !1) && e.push(`${t}:${n};`);
}
function Ei(e, t) {
  return e ? `${e}{${t}}` : "";
}
var Ul = (...e) => QC(rt.getTheme(), ...e), QC = (e = {}, t, n, i) => {
  if (t) {
    const { variable: a, options: s } = rt.defaults || {}, { prefix: c, transform: f } = (e == null ? void 0 : e.options) || s || {}, h = Bn(t, /{([^}]*)}/g) ? t : `{${t}}`;
    return i === "value" || Mn(i) && f === "strict" ? rt.getTokenValue(t) : Fb(h, void 0, c, [a.excludedKeyRegex], n);
  }
  return "";
};
function JC(e, t = {}) {
  const n = rt.defaults.variable, { prefix: i = n.prefix, selector: a = n.selector, excludedKeyRegex: s = n.excludedKeyRegex } = t, c = (h, m = "") => Object.entries(h).reduce(
    (b, [v, _]) => {
      const x = Bn(v, s) ? rf(m) : rf(m, Lb(v)), T = KC(_);
      if (vn(T)) {
        const { variables: R, tokens: D } = c(T, x);
        Vm(b.tokens, D), Vm(b.variables, R);
      } else
        b.tokens.push((i ? x.replace(`${i}-`, "") : x).replaceAll("-", ".")), XC(b.variables, jb(x), Fb(T, x, i, [s]));
      return b;
    },
    { variables: [], tokens: [] }
  ), { variables: f, tokens: d } = c(e, i);
  return {
    value: f,
    tokens: d,
    declarations: f.join(""),
    css: Ei(a, f.join(""))
  };
}
var Kr = {
  regex: {
    rules: {
      class: {
        pattern: /^\.([a-zA-Z][\w-]*)$/,
        resolve(e) {
          return { type: "class", selector: e, matched: this.pattern.test(e.trim()) };
        }
      },
      attr: {
        pattern: /^\[(.*)\]$/,
        resolve(e) {
          return { type: "attr", selector: `:root${e}`, matched: this.pattern.test(e.trim()) };
        }
      },
      media: {
        pattern: /^@media (.*)$/,
        resolve(e) {
          return { type: "media", selector: `${e}{:root{[CSS]}}`, matched: this.pattern.test(e.trim()) };
        }
      },
      system: {
        pattern: /^system$/,
        resolve(e) {
          return { type: "system", selector: "@media (prefers-color-scheme: dark){:root{[CSS]}}", matched: this.pattern.test(e.trim()) };
        }
      },
      custom: {
        resolve(e) {
          return { type: "custom", selector: e, matched: !0 };
        }
      }
    },
    resolve(e) {
      const t = Object.keys(this.rules).filter((n) => n !== "custom").map((n) => this.rules[n]);
      return [e].flat().map((n) => {
        var i;
        return (i = t.map((a) => a.resolve(n)).find((a) => a.matched)) != null ? i : this.rules.custom.resolve(n);
      });
    }
  },
  _toVariables(e, t) {
    return JC(e, { prefix: t == null ? void 0 : t.prefix });
  },
  getCommon({ name: e = "", theme: t = {}, params: n, set: i, defaults: a }) {
    var s, c, f, d, h, m, b;
    const { preset: v, options: _ } = t;
    let x, T, R, D, K, L, S;
    if (dt(v) && _.transform !== "strict") {
      const { primitive: B, semantic: I, extend: F } = v, te = I || {}, { colorScheme: re } = te, Se = On(te, ["colorScheme"]), Pe = F || {}, { colorScheme: be } = Pe, we = On(Pe, ["colorScheme"]), De = re || {}, { dark: ae } = De, ge = On(De, ["dark"]), he = be || {}, { dark: V } = he, oe = On(he, ["dark"]), q = dt(B) ? this._toVariables({ primitive: B }, _) : {}, P = dt(Se) ? this._toVariables({ semantic: Se }, _) : {}, X = dt(ge) ? this._toVariables({ light: ge }, _) : {}, Ce = dt(ae) ? this._toVariables({ dark: ae }, _) : {}, xe = dt(we) ? this._toVariables({ semantic: we }, _) : {}, Ae = dt(oe) ? this._toVariables({ light: oe }, _) : {}, Oe = dt(V) ? this._toVariables({ dark: V }, _) : {}, [ze, Me] = [(s = q.declarations) != null ? s : "", q.tokens], [Ke, tt] = [(c = P.declarations) != null ? c : "", P.tokens || []], [vr, $] = [(f = X.declarations) != null ? f : "", X.tokens || []], [N, E] = [(d = Ce.declarations) != null ? d : "", Ce.tokens || []], [G, J] = [(h = xe.declarations) != null ? h : "", xe.tokens || []], [Z, ce] = [(m = Ae.declarations) != null ? m : "", Ae.tokens || []], [ue, k] = [(b = Oe.declarations) != null ? b : "", Oe.tokens || []];
      x = this.transformCSS(e, ze, "light", "variable", _, i, a), T = Me;
      const w = this.transformCSS(e, `${Ke}${vr}`, "light", "variable", _, i, a), U = this.transformCSS(e, `${N}`, "dark", "variable", _, i, a);
      R = `${w}${U}`, D = [.../* @__PURE__ */ new Set([...tt, ...$, ...E])];
      const Y = this.transformCSS(e, `${G}${Z}color-scheme:light`, "light", "variable", _, i, a), de = this.transformCSS(e, `${ue}color-scheme:dark`, "dark", "variable", _, i, a);
      K = `${Y}${de}`, L = [.../* @__PURE__ */ new Set([...J, ...ce, ...k])], S = Ar(v.css, { dt: Ul });
    }
    return {
      primitive: {
        css: x,
        tokens: T
      },
      semantic: {
        css: R,
        tokens: D
      },
      global: {
        css: K,
        tokens: L
      },
      style: S
    };
  },
  getPreset({ name: e = "", preset: t = {}, options: n, params: i, set: a, defaults: s, selector: c }) {
    var f, d, h;
    let m, b, v;
    if (dt(t) && n.transform !== "strict") {
      const _ = e.replace("-directive", ""), x = t, { colorScheme: T, extend: R, css: D } = x, K = On(x, ["colorScheme", "extend", "css"]), L = R || {}, { colorScheme: S } = L, B = On(L, ["colorScheme"]), I = T || {}, { dark: F } = I, te = On(I, ["dark"]), re = S || {}, { dark: Se } = re, Pe = On(re, ["dark"]), be = dt(K) ? this._toVariables({ [_]: Yr(Yr({}, K), B) }, n) : {}, we = dt(te) ? this._toVariables({ [_]: Yr(Yr({}, te), Pe) }, n) : {}, De = dt(F) ? this._toVariables({ [_]: Yr(Yr({}, F), Se) }, n) : {}, [ae, ge] = [(f = be.declarations) != null ? f : "", be.tokens || []], [he, V] = [(d = we.declarations) != null ? d : "", we.tokens || []], [oe, q] = [(h = De.declarations) != null ? h : "", De.tokens || []], P = this.transformCSS(_, `${ae}${he}`, "light", "variable", n, a, s, c), X = this.transformCSS(_, oe, "dark", "variable", n, a, s, c);
      m = `${P}${X}`, b = [.../* @__PURE__ */ new Set([...ge, ...V, ...q])], v = Ar(D, { dt: Ul });
    }
    return {
      css: m,
      tokens: b,
      style: v
    };
  },
  getPresetC({ name: e = "", theme: t = {}, params: n, set: i, defaults: a }) {
    var s;
    const { preset: c, options: f } = t, d = (s = c == null ? void 0 : c.components) == null ? void 0 : s[e];
    return this.getPreset({ name: e, preset: d, options: f, params: n, set: i, defaults: a });
  },
  // @deprecated - use getPresetC instead
  getPresetD({ name: e = "", theme: t = {}, params: n, set: i, defaults: a }) {
    var s, c;
    const f = e.replace("-directive", ""), { preset: d, options: h } = t, m = ((s = d == null ? void 0 : d.components) == null ? void 0 : s[f]) || ((c = d == null ? void 0 : d.directives) == null ? void 0 : c[f]);
    return this.getPreset({ name: f, preset: m, options: h, params: n, set: i, defaults: a });
  },
  applyDarkColorScheme(e) {
    return !(e.darkModeSelector === "none" || e.darkModeSelector === !1);
  },
  getColorSchemeOption(e, t) {
    var n;
    return this.applyDarkColorScheme(e) ? this.regex.resolve(e.darkModeSelector === !0 ? t.options.darkModeSelector : (n = e.darkModeSelector) != null ? n : t.options.darkModeSelector) : [];
  },
  getLayerOrder(e, t = {}, n, i) {
    const { cssLayer: a } = t;
    return a ? `@layer ${Ar(a.order || "primeui", n)}` : "";
  },
  getCommonStyleSheet({ name: e = "", theme: t = {}, params: n, props: i = {}, set: a, defaults: s }) {
    const c = this.getCommon({ name: e, theme: t, params: n, set: a, defaults: s }), f = Object.entries(i).reduce((d, [h, m]) => d.push(`${h}="${m}"`) && d, []).join(" ");
    return Object.entries(c || {}).reduce((d, [h, m]) => {
      if (m != null && m.css) {
        const b = Fl(m == null ? void 0 : m.css), v = `${h}-variables`;
        d.push(`<style type="text/css" data-primevue-style-id="${v}" ${f}>${b}</style>`);
      }
      return d;
    }, []).join("");
  },
  getStyleSheet({ name: e = "", theme: t = {}, params: n, props: i = {}, set: a, defaults: s }) {
    var c;
    const f = { name: e, theme: t, params: n, set: a, defaults: s }, d = (c = e.includes("-directive") ? this.getPresetD(f) : this.getPresetC(f)) == null ? void 0 : c.css, h = Object.entries(i).reduce((m, [b, v]) => m.push(`${b}="${v}"`) && m, []).join(" ");
    return d ? `<style type="text/css" data-primevue-style-id="${e}-variables" ${h}>${Fl(d)}</style>` : "";
  },
  createTokens(e = {}, t, n = "", i = "", a = {}) {
    return Object.entries(e).forEach(([s, c]) => {
      const f = Bn(s, t.variable.excludedKeyRegex) ? n : n ? `${n}.${jm(s)}` : jm(s), d = i ? `${i}.${s}` : s;
      vn(c) ? this.createTokens(c, t, f, d, a) : (a[f] || (a[f] = {
        paths: [],
        computed(h, m = {}) {
          var b, v;
          return this.paths.length === 1 ? (b = this.paths[0]) == null ? void 0 : b.computed(this.paths[0].scheme, m.binding) : h && h !== "none" ? (v = this.paths.find((_) => _.scheme === h)) == null ? void 0 : v.computed(h, m.binding) : this.paths.map((_) => _.computed(_.scheme, m[_.scheme]));
        }
      }), a[f].paths.push({
        path: d,
        value: c,
        scheme: d.includes("colorScheme.light") ? "light" : d.includes("colorScheme.dark") ? "dark" : "none",
        computed(h, m = {}) {
          const b = /{([^}]*)}/g;
          let v = c;
          if (m.name = this.path, m.binding || (m.binding = {}), Bn(c, b)) {
            const x = c.trim().replaceAll(b, (D) => {
              var K;
              const L = D.replace(/{|}/g, ""), S = (K = a[L]) == null ? void 0 : K.computed(h, m);
              return ku(S) && S.length === 2 ? `light-dark(${S[0].value},${S[1].value})` : S == null ? void 0 : S.value;
            }), T = /(\d+\w*\s+[\+\-\*\/]\s+\d+\w*)/g, R = /var\([^)]+\)/g;
            v = Bn(x.replace(R, "0"), T) ? `calc(${x})` : x;
          }
          return Mn(m.binding) && delete m.binding, {
            colorScheme: h,
            path: this.path,
            paths: m,
            value: v.includes("undefined") ? void 0 : v
          };
        }
      }));
    }), a;
  },
  getTokenValue(e, t, n) {
    var i;
    const s = ((d) => d.split(".").filter((m) => !Bn(m.toLowerCase(), n.variable.excludedKeyRegex)).join("."))(t), c = t.includes("colorScheme.light") ? "light" : t.includes("colorScheme.dark") ? "dark" : void 0, f = [(i = e[s]) == null ? void 0 : i.computed(c)].flat().filter((d) => d);
    return f.length === 1 ? f[0].value : f.reduce((d = {}, h) => {
      const m = h, { colorScheme: b } = m, v = On(m, ["colorScheme"]);
      return d[b] = v, d;
    }, void 0);
  },
  getSelectorRule(e, t, n, i) {
    return n === "class" || n === "attr" ? Ei(dt(t) ? `${e}${t},${e} ${t}` : e, i) : Ei(e, dt(t) ? Ei(t, i) : i);
  },
  transformCSS(e, t, n, i, a = {}, s, c, f) {
    if (dt(t)) {
      const { cssLayer: d } = a;
      if (i !== "style") {
        const h = this.getColorSchemeOption(a, c);
        t = n === "dark" ? h.reduce((m, { type: b, selector: v }) => (dt(v) && (m += v.includes("[CSS]") ? v.replace("[CSS]", t) : this.getSelectorRule(v, f, b, t)), m), "") : Ei(f ?? ":root", t);
      }
      if (d) {
        const h = {
          name: "primeui"
        };
        vn(d) && (h.name = Ar(d.name, { name: e, type: i })), dt(h.name) && (t = Ei(`@layer ${h.name}`, t), s == null || s.layerNames(h.name));
      }
      return t;
    }
    return "";
  }
}, rt = {
  defaults: {
    variable: {
      prefix: "p",
      selector: ":root",
      excludedKeyRegex: /^(primitive|semantic|components|directives|variables|colorscheme|light|dark|common|root|states|extend|css)$/gi
    },
    options: {
      prefix: "p",
      darkModeSelector: "system",
      cssLayer: !1
    }
  },
  _theme: void 0,
  _layerNames: /* @__PURE__ */ new Set(),
  _loadedStyleNames: /* @__PURE__ */ new Set(),
  _loadingStyles: /* @__PURE__ */ new Set(),
  _tokens: {},
  update(e = {}) {
    const { theme: t } = e;
    t && (this._theme = Cd(Yr({}, t), {
      options: Yr(Yr({}, this.defaults.options), t.options)
    }), this._tokens = Kr.createTokens(this.preset, this.defaults), this.clearLoadedStyleNames());
  },
  get theme() {
    return this._theme;
  },
  get preset() {
    var e;
    return ((e = this.theme) == null ? void 0 : e.preset) || {};
  },
  get options() {
    var e;
    return ((e = this.theme) == null ? void 0 : e.options) || {};
  },
  get tokens() {
    return this._tokens;
  },
  getTheme() {
    return this.theme;
  },
  setTheme(e) {
    this.update({ theme: e }), jt.emit("theme:change", e);
  },
  getPreset() {
    return this.preset;
  },
  setPreset(e) {
    this._theme = Cd(Yr({}, this.theme), { preset: e }), this._tokens = Kr.createTokens(e, this.defaults), this.clearLoadedStyleNames(), jt.emit("preset:change", e), jt.emit("theme:change", this.theme);
  },
  getOptions() {
    return this.options;
  },
  setOptions(e) {
    this._theme = Cd(Yr({}, this.theme), { options: e }), this.clearLoadedStyleNames(), jt.emit("options:change", e), jt.emit("theme:change", this.theme);
  },
  getLayerNames() {
    return [...this._layerNames];
  },
  setLayerNames(e) {
    this._layerNames.add(e);
  },
  getLoadedStyleNames() {
    return this._loadedStyleNames;
  },
  isStyleNameLoaded(e) {
    return this._loadedStyleNames.has(e);
  },
  setLoadedStyleName(e) {
    this._loadedStyleNames.add(e);
  },
  deleteLoadedStyleName(e) {
    this._loadedStyleNames.delete(e);
  },
  clearLoadedStyleNames() {
    this._loadedStyleNames.clear();
  },
  getTokenValue(e) {
    return Kr.getTokenValue(this.tokens, e, this.defaults);
  },
  getCommon(e = "", t) {
    return Kr.getCommon({ name: e, theme: this.theme, params: t, defaults: this.defaults, set: { layerNames: this.setLayerNames.bind(this) } });
  },
  getComponent(e = "", t) {
    const n = { name: e, theme: this.theme, params: t, defaults: this.defaults, set: { layerNames: this.setLayerNames.bind(this) } };
    return Kr.getPresetC(n);
  },
  // @deprecated - use getComponent instead
  getDirective(e = "", t) {
    const n = { name: e, theme: this.theme, params: t, defaults: this.defaults, set: { layerNames: this.setLayerNames.bind(this) } };
    return Kr.getPresetD(n);
  },
  getCustomPreset(e = "", t, n, i) {
    const a = { name: e, preset: t, options: this.options, selector: n, params: i, defaults: this.defaults, set: { layerNames: this.setLayerNames.bind(this) } };
    return Kr.getPreset(a);
  },
  getLayerOrderCSS(e = "") {
    return Kr.getLayerOrder(e, this.options, { names: this.getLayerNames() }, this.defaults);
  },
  transformCSS(e = "", t, n = "style", i) {
    return Kr.transformCSS(e, t, i, n, this.options, { layerNames: this.setLayerNames.bind(this) }, this.defaults);
  },
  getCommonStyleSheet(e = "", t, n = {}) {
    return Kr.getCommonStyleSheet({ name: e, theme: this.theme, params: t, props: n, defaults: this.defaults, set: { layerNames: this.setLayerNames.bind(this) } });
  },
  getStyleSheet(e, t, n = {}) {
    return Kr.getStyleSheet({ name: e, theme: this.theme, params: t, props: n, defaults: this.defaults, set: { layerNames: this.setLayerNames.bind(this) } });
  },
  onStyleMounted(e) {
    this._loadingStyles.add(e);
  },
  onStyleUpdated(e) {
    this._loadingStyles.add(e);
  },
  onStyleLoaded(e, { name: t }) {
    this._loadingStyles.size && (this._loadingStyles.delete(t), jt.emit(`theme:${t}:load`, e), !this._loadingStyles.size && jt.emit("theme:load"));
  }
}, Yt = {
  STARTS_WITH: "startsWith",
  CONTAINS: "contains",
  NOT_CONTAINS: "notContains",
  ENDS_WITH: "endsWith",
  EQUALS: "equals",
  NOT_EQUALS: "notEquals",
  LESS_THAN: "lt",
  LESS_THAN_OR_EQUAL_TO: "lte",
  GREATER_THAN: "gt",
  GREATER_THAN_OR_EQUAL_TO: "gte",
  DATE_IS: "dateIs",
  DATE_IS_NOT: "dateIsNot",
  DATE_BEFORE: "dateBefore",
  DATE_AFTER: "dateAfter"
}, qC = ({ dt: e }) => `
*,
::before,
::after {
    box-sizing: border-box;
}

/* Non vue overlay animations */
.p-connected-overlay {
    opacity: 0;
    transform: scaleY(0.8);
    transition: transform 0.12s cubic-bezier(0, 0, 0.2, 1),
        opacity 0.12s cubic-bezier(0, 0, 0.2, 1);
}

.p-connected-overlay-visible {
    opacity: 1;
    transform: scaleY(1);
}

.p-connected-overlay-hidden {
    opacity: 0;
    transform: scaleY(1);
    transition: opacity 0.1s linear;
}

/* Vue based overlay animations */
.p-connected-overlay-enter-from {
    opacity: 0;
    transform: scaleY(0.8);
}

.p-connected-overlay-leave-to {
    opacity: 0;
}

.p-connected-overlay-enter-active {
    transition: transform 0.12s cubic-bezier(0, 0, 0.2, 1),
        opacity 0.12s cubic-bezier(0, 0, 0.2, 1);
}

.p-connected-overlay-leave-active {
    transition: opacity 0.1s linear;
}

/* Toggleable Content */
.p-toggleable-content-enter-from,
.p-toggleable-content-leave-to {
    max-height: 0;
}

.p-toggleable-content-enter-to,
.p-toggleable-content-leave-from {
    max-height: 1000px;
}

.p-toggleable-content-leave-active {
    overflow: hidden;
    transition: max-height 0.45s cubic-bezier(0, 1, 0, 1);
}

.p-toggleable-content-enter-active {
    overflow: hidden;
    transition: max-height 1s ease-in-out;
}

.p-disabled,
.p-disabled * {
    cursor: default;
    pointer-events: none;
    user-select: none;
}

.p-disabled,
.p-component:disabled {
    opacity: ${e("disabled.opacity")};
}

.pi {
    font-size: ${e("icon.size")};
}

.p-icon {
    width: ${e("icon.size")};
    height: ${e("icon.size")};
}

.p-overlay-mask {
    background: ${e("mask.background")};
    color: ${e("mask.color")};
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}

.p-overlay-mask-enter {
    animation: p-overlay-mask-enter-animation ${e("mask.transition.duration")} forwards;
}

.p-overlay-mask-leave {
    animation: p-overlay-mask-leave-animation ${e("mask.transition.duration")} forwards;
}

@keyframes p-overlay-mask-enter-animation {
    from {
        background: transparent;
    }
    to {
        background: ${e("mask.background")};
    }
}
@keyframes p-overlay-mask-leave-animation {
    from {
        background: ${e("mask.background")};
    }
    to {
        background: transparent;
    }
}
`;
function Zl(e) {
  "@babel/helpers - typeof";
  return Zl = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, Zl(e);
}
function Hm(e, t) {
  var n = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var i = Object.getOwnPropertySymbols(e);
    t && (i = i.filter(function(a) {
      return Object.getOwnPropertyDescriptor(e, a).enumerable;
    })), n.push.apply(n, i);
  }
  return n;
}
function Km(e) {
  for (var t = 1; t < arguments.length; t++) {
    var n = arguments[t] != null ? arguments[t] : {};
    t % 2 ? Hm(Object(n), !0).forEach(function(i) {
      ZC(e, i, n[i]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : Hm(Object(n)).forEach(function(i) {
      Object.defineProperty(e, i, Object.getOwnPropertyDescriptor(n, i));
    });
  }
  return e;
}
function ZC(e, t, n) {
  return (t = ex(t)) in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
function ex(e) {
  var t = tx(e, "string");
  return Zl(t) == "symbol" ? t : t + "";
}
function tx(e, t) {
  if (Zl(e) != "object" || !e) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var i = n.call(e, t);
    if (Zl(i) != "object") return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function rx(e) {
  var t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !0;
  vo() && vo().components ? pa(e) : t ? e() : Sf(e);
}
var nx = 0;
function ox(e) {
  var t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, n = ot(!1), i = ot(e), a = ot(null), s = MC() ? window.document : void 0, c = t.document, f = c === void 0 ? s : c, d = t.immediate, h = d === void 0 ? !0 : d, m = t.manual, b = m === void 0 ? !1 : m, v = t.name, _ = v === void 0 ? "style_".concat(++nx) : v, x = t.id, T = x === void 0 ? void 0 : x, R = t.media, D = R === void 0 ? void 0 : R, K = t.nonce, L = K === void 0 ? void 0 : K, S = t.first, B = S === void 0 ? !1 : S, I = t.onMounted, F = I === void 0 ? void 0 : I, te = t.onUpdated, re = te === void 0 ? void 0 : te, Se = t.onLoad, Pe = Se === void 0 ? void 0 : Se, be = t.props, we = be === void 0 ? {} : be, De = function() {
  }, ae = function(V) {
    var oe = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    if (f) {
      var q = Km(Km({}, we), oe), P = q.name || _, X = q.id || T, Ce = q.nonce || L;
      a.value = f.querySelector('style[data-primevue-style-id="'.concat(P, '"]')) || f.getElementById(X) || f.createElement("style"), a.value.isConnected || (i.value = V || e, Xs(a.value, {
        type: "text/css",
        id: X,
        media: D,
        nonce: Ce
      }), B ? f.head.prepend(a.value) : f.head.appendChild(a.value), FC(a.value, "data-primevue-style-id", P), Xs(a.value, q), a.value.onload = function(xe) {
        return Pe == null ? void 0 : Pe(xe, {
          name: P
        });
      }, F == null || F(P)), !n.value && (De = Ir(i, function(xe) {
        a.value.textContent = xe, re == null || re(P);
      }, {
        immediate: !0
      }), n.value = !0);
    }
  }, ge = function() {
    !f || !n.value || (De(), Ab(a.value) && f.head.removeChild(a.value), n.value = !1, a.value = null);
  };
  return h && !b && rx(ae), {
    id: T,
    name: _,
    el: a,
    css: i,
    unload: ge,
    load: ae,
    isLoaded: yf(n)
  };
}
function ea(e) {
  "@babel/helpers - typeof";
  return ea = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, ea(e);
}
function Ym(e, t) {
  return sx(e) || ax(e, t) || lx(e, t) || ix();
}
function ix() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function lx(e, t) {
  if (e) {
    if (typeof e == "string") return Gm(e, t);
    var n = {}.toString.call(e).slice(8, -1);
    return n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set" ? Array.from(e) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? Gm(e, t) : void 0;
  }
}
function Gm(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var n = 0, i = Array(t); n < t; n++) i[n] = e[n];
  return i;
}
function ax(e, t) {
  var n = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (n != null) {
    var i, a, s, c, f = [], d = !0, h = !1;
    try {
      if (s = (n = n.call(e)).next, t !== 0) for (; !(d = (i = s.call(n)).done) && (f.push(i.value), f.length !== t); d = !0) ;
    } catch (m) {
      h = !0, a = m;
    } finally {
      try {
        if (!d && n.return != null && (c = n.return(), Object(c) !== c)) return;
      } finally {
        if (h) throw a;
      }
    }
    return f;
  }
}
function sx(e) {
  if (Array.isArray(e)) return e;
}
function Xm(e, t) {
  var n = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var i = Object.getOwnPropertySymbols(e);
    t && (i = i.filter(function(a) {
      return Object.getOwnPropertyDescriptor(e, a).enumerable;
    })), n.push.apply(n, i);
  }
  return n;
}
function xd(e) {
  for (var t = 1; t < arguments.length; t++) {
    var n = arguments[t] != null ? arguments[t] : {};
    t % 2 ? Xm(Object(n), !0).forEach(function(i) {
      ux(e, i, n[i]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : Xm(Object(n)).forEach(function(i) {
      Object.defineProperty(e, i, Object.getOwnPropertyDescriptor(n, i));
    });
  }
  return e;
}
function ux(e, t, n) {
  return (t = cx(t)) in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
function cx(e) {
  var t = dx(e, "string");
  return ea(t) == "symbol" ? t : t + "";
}
function dx(e, t) {
  if (ea(e) != "object" || !e) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var i = n.call(e, t);
    if (ea(i) != "object") return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var fx = function(t) {
  var n = t.dt;
  return `
.p-hidden-accessible {
    border: 0;
    clip: rect(0 0 0 0);
    height: 1px;
    margin: -1px;
    opacity: 0;
    overflow: hidden;
    padding: 0;
    pointer-events: none;
    position: absolute;
    white-space: nowrap;
    width: 1px;
}

.p-overflow-hidden {
    overflow: hidden;
    padding-right: `.concat(n("scrollbar.width"), `;
}
`);
}, px = {}, gx = {}, ft = {
  name: "base",
  css: fx,
  style: qC,
  classes: px,
  inlineStyles: gx,
  load: function(t) {
    var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, i = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : function(s) {
      return s;
    }, a = i(Ar(t, {
      dt: Ul
    }));
    return dt(a) ? ox(Fl(a), xd({
      name: this.name
    }, n)) : {};
  },
  loadCSS: function() {
    var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    return this.load(this.css, t);
  },
  loadStyle: function() {
    var t = this, n = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, i = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "";
    return this.load(this.style, n, function() {
      var a = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "";
      return rt.transformCSS(n.name || t.name, "".concat(a).concat(i));
    });
  },
  getCommonTheme: function(t) {
    return rt.getCommon(this.name, t);
  },
  getComponentTheme: function(t) {
    return rt.getComponent(this.name, t);
  },
  getDirectiveTheme: function(t) {
    return rt.getDirective(this.name, t);
  },
  getPresetTheme: function(t, n, i) {
    return rt.getCustomPreset(this.name, t, n, i);
  },
  getLayerOrderThemeCSS: function() {
    return rt.getLayerOrderCSS(this.name);
  },
  getStyleSheet: function() {
    var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    if (this.css) {
      var i = Ar(this.css, {
        dt: Ul
      }) || "", a = Fl("".concat(i).concat(t)), s = Object.entries(n).reduce(function(c, f) {
        var d = Ym(f, 2), h = d[0], m = d[1];
        return c.push("".concat(h, '="').concat(m, '"')) && c;
      }, []).join(" ");
      return dt(a) ? '<style type="text/css" data-primevue-style-id="'.concat(this.name, '" ').concat(s, ">").concat(a, "</style>") : "";
    }
    return "";
  },
  getCommonThemeStyleSheet: function(t) {
    var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    return rt.getCommonStyleSheet(this.name, t, n);
  },
  getThemeStyleSheet: function(t) {
    var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, i = [rt.getStyleSheet(this.name, t, n)];
    if (this.style) {
      var a = this.name === "base" ? "global-style" : "".concat(this.name, "-style"), s = Ar(this.style, {
        dt: Ul
      }), c = Fl(rt.transformCSS(a, s)), f = Object.entries(n).reduce(function(d, h) {
        var m = Ym(h, 2), b = m[0], v = m[1];
        return d.push("".concat(b, '="').concat(v, '"')) && d;
      }, []).join(" ");
      dt(c) && i.push('<style type="text/css" data-primevue-style-id="'.concat(a, '" ').concat(f, ">").concat(c, "</style>"));
    }
    return i.join("");
  },
  extend: function(t) {
    return xd(xd({}, this), {}, {
      css: void 0,
      style: void 0
    }, t);
  }
}, fo = Pb();
function ta(e) {
  "@babel/helpers - typeof";
  return ta = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, ta(e);
}
function Qm(e, t) {
  var n = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var i = Object.getOwnPropertySymbols(e);
    t && (i = i.filter(function(a) {
      return Object.getOwnPropertyDescriptor(e, a).enumerable;
    })), n.push.apply(n, i);
  }
  return n;
}
function Ps(e) {
  for (var t = 1; t < arguments.length; t++) {
    var n = arguments[t] != null ? arguments[t] : {};
    t % 2 ? Qm(Object(n), !0).forEach(function(i) {
      hx(e, i, n[i]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : Qm(Object(n)).forEach(function(i) {
      Object.defineProperty(e, i, Object.getOwnPropertyDescriptor(n, i));
    });
  }
  return e;
}
function hx(e, t, n) {
  return (t = mx(t)) in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
function mx(e) {
  var t = vx(e, "string");
  return ta(t) == "symbol" ? t : t + "";
}
function vx(e, t) {
  if (ta(e) != "object" || !e) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var i = n.call(e, t);
    if (ta(i) != "object") return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var bx = {
  ripple: !1,
  inputStyle: null,
  inputVariant: null,
  locale: {
    startsWith: "Starts with",
    contains: "Contains",
    notContains: "Not contains",
    endsWith: "Ends with",
    equals: "Equals",
    notEquals: "Not equals",
    noFilter: "No Filter",
    lt: "Less than",
    lte: "Less than or equal to",
    gt: "Greater than",
    gte: "Greater than or equal to",
    dateIs: "Date is",
    dateIsNot: "Date is not",
    dateBefore: "Date is before",
    dateAfter: "Date is after",
    clear: "Clear",
    apply: "Apply",
    matchAll: "Match All",
    matchAny: "Match Any",
    addRule: "Add Rule",
    removeRule: "Remove Rule",
    accept: "Yes",
    reject: "No",
    choose: "Choose",
    upload: "Upload",
    cancel: "Cancel",
    completed: "Completed",
    pending: "Pending",
    fileSizeTypes: ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
    dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    dayNamesShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    dayNamesMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
    monthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    monthNamesShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    chooseYear: "Choose Year",
    chooseMonth: "Choose Month",
    chooseDate: "Choose Date",
    prevDecade: "Previous Decade",
    nextDecade: "Next Decade",
    prevYear: "Previous Year",
    nextYear: "Next Year",
    prevMonth: "Previous Month",
    nextMonth: "Next Month",
    prevHour: "Previous Hour",
    nextHour: "Next Hour",
    prevMinute: "Previous Minute",
    nextMinute: "Next Minute",
    prevSecond: "Previous Second",
    nextSecond: "Next Second",
    am: "am",
    pm: "pm",
    today: "Today",
    weekHeader: "Wk",
    firstDayOfWeek: 0,
    showMonthAfterYear: !1,
    dateFormat: "mm/dd/yy",
    weak: "Weak",
    medium: "Medium",
    strong: "Strong",
    passwordPrompt: "Enter a password",
    emptyFilterMessage: "No results found",
    searchMessage: "{0} results are available",
    selectionMessage: "{0} items selected",
    emptySelectionMessage: "No selected item",
    emptySearchMessage: "No results found",
    fileChosenMessage: "{0} files",
    noFileChosenMessage: "No file chosen",
    emptyMessage: "No available options",
    aria: {
      trueLabel: "True",
      falseLabel: "False",
      nullLabel: "Not Selected",
      star: "1 star",
      stars: "{star} stars",
      selectAll: "All items selected",
      unselectAll: "All items unselected",
      close: "Close",
      previous: "Previous",
      next: "Next",
      navigation: "Navigation",
      scrollTop: "Scroll Top",
      moveTop: "Move Top",
      moveUp: "Move Up",
      moveDown: "Move Down",
      moveBottom: "Move Bottom",
      moveToTarget: "Move to Target",
      moveToSource: "Move to Source",
      moveAllToTarget: "Move All to Target",
      moveAllToSource: "Move All to Source",
      pageLabel: "Page {page}",
      firstPageLabel: "First Page",
      lastPageLabel: "Last Page",
      nextPageLabel: "Next Page",
      prevPageLabel: "Previous Page",
      rowsPerPageLabel: "Rows per page",
      jumpToPageDropdownLabel: "Jump to Page Dropdown",
      jumpToPageInputLabel: "Jump to Page Input",
      selectRow: "Row Selected",
      unselectRow: "Row Unselected",
      expandRow: "Row Expanded",
      collapseRow: "Row Collapsed",
      showFilterMenu: "Show Filter Menu",
      hideFilterMenu: "Hide Filter Menu",
      filterOperator: "Filter Operator",
      filterConstraint: "Filter Constraint",
      editRow: "Row Edit",
      saveEdit: "Save Edit",
      cancelEdit: "Cancel Edit",
      listView: "List View",
      gridView: "Grid View",
      slide: "Slide",
      slideNumber: "{slideNumber}",
      zoomImage: "Zoom Image",
      zoomIn: "Zoom In",
      zoomOut: "Zoom Out",
      rotateRight: "Rotate Right",
      rotateLeft: "Rotate Left",
      listLabel: "Option List"
    }
  },
  filterMatchModeOptions: {
    text: [Yt.STARTS_WITH, Yt.CONTAINS, Yt.NOT_CONTAINS, Yt.ENDS_WITH, Yt.EQUALS, Yt.NOT_EQUALS],
    numeric: [Yt.EQUALS, Yt.NOT_EQUALS, Yt.LESS_THAN, Yt.LESS_THAN_OR_EQUAL_TO, Yt.GREATER_THAN, Yt.GREATER_THAN_OR_EQUAL_TO],
    date: [Yt.DATE_IS, Yt.DATE_IS_NOT, Yt.DATE_BEFORE, Yt.DATE_AFTER]
  },
  zIndex: {
    modal: 1100,
    overlay: 1e3,
    menu: 1e3,
    tooltip: 1100
  },
  theme: void 0,
  unstyled: !1,
  pt: void 0,
  ptOptions: {
    mergeSections: !0,
    mergeProps: !1
  },
  csp: {
    nonce: void 0
  }
}, yx = Symbol();
function _x(e, t) {
  var n = {
    config: fu(t)
  };
  return e.config.globalProperties.$primevue = n, e.provide(yx, n), kx(), wx(e, n), n;
}
var Oi = [];
function kx() {
  jt.clear(), Oi.forEach(function(e) {
    return e == null ? void 0 : e();
  }), Oi = [];
}
function wx(e, t) {
  var n = ot(!1), i = function() {
    var h;
    if (((h = t.config) === null || h === void 0 ? void 0 : h.theme) !== "none" && !rt.isStyleNameLoaded("common")) {
      var m, b, v = ((m = ft.getCommonTheme) === null || m === void 0 ? void 0 : m.call(ft)) || {}, _ = v.primitive, x = v.semantic, T = v.global, R = v.style, D = {
        nonce: (b = t.config) === null || b === void 0 || (b = b.csp) === null || b === void 0 ? void 0 : b.nonce
      };
      ft.load(_ == null ? void 0 : _.css, Ps({
        name: "primitive-variables"
      }, D)), ft.load(x == null ? void 0 : x.css, Ps({
        name: "semantic-variables"
      }, D)), ft.load(T == null ? void 0 : T.css, Ps({
        name: "global-variables"
      }, D)), ft.loadStyle(Ps({
        name: "global-style"
      }, D), R), rt.setLoadedStyleName("common");
    }
  };
  jt.on("theme:change", function(d) {
    n.value || (e.config.globalProperties.$primevue.config.theme = d, n.value = !0);
  });
  var a = Ir(t.config, function(d, h) {
    fo.emit("config:change", {
      newValue: d,
      oldValue: h
    });
  }, {
    immediate: !0,
    deep: !0
  }), s = Ir(function() {
    return t.config.ripple;
  }, function(d, h) {
    fo.emit("config:ripple:change", {
      newValue: d,
      oldValue: h
    });
  }, {
    immediate: !0,
    deep: !0
  }), c = Ir(function() {
    return t.config.theme;
  }, function(d, h) {
    n.value || rt.setTheme(d), t.config.unstyled || i(), n.value = !1, fo.emit("config:theme:change", {
      newValue: d,
      oldValue: h
    });
  }, {
    immediate: !0,
    deep: !1
  }), f = Ir(function() {
    return t.config.unstyled;
  }, function(d, h) {
    !d && t.config.theme && i(), fo.emit("config:unstyled:change", {
      newValue: d,
      oldValue: h
    });
  }, {
    immediate: !0,
    deep: !0
  });
  Oi.push(a), Oi.push(s), Oi.push(c), Oi.push(f);
}
var Sx = {
  install: function(t, n) {
    var i = PC(bx, n);
    _x(t, i);
  }
};
function ra(e) {
  "@babel/helpers - typeof";
  return ra = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, ra(e);
}
function Cx(e, t) {
  if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
}
function xx(e, t) {
  for (var n = 0; n < t.length; n++) {
    var i = t[n];
    i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(e, Ex(i.key), i);
  }
}
function $x(e, t, n) {
  return t && xx(e.prototype, t), Object.defineProperty(e, "prototype", { writable: !1 }), e;
}
function Ex(e) {
  var t = Tx(e, "string");
  return ra(t) == "symbol" ? t : t + "";
}
function Tx(e, t) {
  if (ra(e) != "object" || !e) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var i = n.call(e, t);
    if (ra(i) != "object") return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return String(e);
}
var Ox = /* @__PURE__ */ function() {
  function e(t) {
    var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : function() {
    };
    Cx(this, e), this.element = t, this.listener = n;
  }
  return $x(e, [{
    key: "bindScrollListener",
    value: function() {
      this.scrollableParents = DC(this.element);
      for (var n = 0; n < this.scrollableParents.length; n++)
        this.scrollableParents[n].addEventListener("scroll", this.listener);
    }
  }, {
    key: "unbindScrollListener",
    value: function() {
      if (this.scrollableParents)
        for (var n = 0; n < this.scrollableParents.length; n++)
          this.scrollableParents[n].removeEventListener("scroll", this.listener);
    }
  }, {
    key: "destroy",
    value: function() {
      this.unbindScrollListener(), this.element = null, this.listener = null, this.scrollableParents = null;
    }
  }]);
}(), co = {
  _loadedStyleNames: /* @__PURE__ */ new Set(),
  getLoadedStyleNames: function() {
    return this._loadedStyleNames;
  },
  isStyleNameLoaded: function(t) {
    return this._loadedStyleNames.has(t);
  },
  setLoadedStyleName: function(t) {
    this._loadedStyleNames.add(t);
  },
  deleteLoadedStyleName: function(t) {
    this._loadedStyleNames.delete(t);
  },
  clearLoadedStyleNames: function() {
    this._loadedStyleNames.clear();
  }
};
function na(e) {
  "@babel/helpers - typeof";
  return na = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, na(e);
}
function Jm(e, t) {
  return Rx(e) || Nx(e, t) || Px(e, t) || Lx();
}
function Lx() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function Px(e, t) {
  if (e) {
    if (typeof e == "string") return qm(e, t);
    var n = {}.toString.call(e).slice(8, -1);
    return n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set" ? Array.from(e) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? qm(e, t) : void 0;
  }
}
function qm(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var n = 0, i = Array(t); n < t; n++) i[n] = e[n];
  return i;
}
function Nx(e, t) {
  var n = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (n != null) {
    var i, a, s, c, f = [], d = !0, h = !1;
    try {
      if (s = (n = n.call(e)).next, t !== 0) for (; !(d = (i = s.call(n)).done) && (f.push(i.value), f.length !== t); d = !0) ;
    } catch (m) {
      h = !0, a = m;
    } finally {
      try {
        if (!d && n.return != null && (c = n.return(), Object(c) !== c)) return;
      } finally {
        if (h) throw a;
      }
    }
    return f;
  }
}
function Rx(e) {
  if (Array.isArray(e)) return e;
}
function Zm(e, t) {
  var n = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var i = Object.getOwnPropertySymbols(e);
    t && (i = i.filter(function(a) {
      return Object.getOwnPropertyDescriptor(e, a).enumerable;
    })), n.push.apply(n, i);
  }
  return n;
}
function Ge(e) {
  for (var t = 1; t < arguments.length; t++) {
    var n = arguments[t] != null ? arguments[t] : {};
    t % 2 ? Zm(Object(n), !0).forEach(function(i) {
      nf(e, i, n[i]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : Zm(Object(n)).forEach(function(i) {
      Object.defineProperty(e, i, Object.getOwnPropertyDescriptor(n, i));
    });
  }
  return e;
}
function nf(e, t, n) {
  return (t = Ix(t)) in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
function Ix(e) {
  var t = Ax(e, "string");
  return na(t) == "symbol" ? t : t + "";
}
function Ax(e, t) {
  if (na(e) != "object" || !e) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var i = n.call(e, t);
    if (na(i) != "object") return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var je = {
  _getMeta: function() {
    return [vn(arguments.length <= 0 ? void 0 : arguments[0]) || arguments.length <= 0 ? void 0 : arguments[0], Ar(vn(arguments.length <= 0 ? void 0 : arguments[0]) ? arguments.length <= 0 ? void 0 : arguments[0] : arguments.length <= 1 ? void 0 : arguments[1])];
  },
  _getConfig: function(t, n) {
    var i, a, s;
    return (i = (t == null || (a = t.instance) === null || a === void 0 ? void 0 : a.$primevue) || (n == null || (s = n.ctx) === null || s === void 0 || (s = s.appContext) === null || s === void 0 || (s = s.config) === null || s === void 0 || (s = s.globalProperties) === null || s === void 0 ? void 0 : s.$primevue)) === null || i === void 0 ? void 0 : i.config;
  },
  _getOptionValue: jf,
  _getPTValue: function() {
    var t, n, i = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, a = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, s = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : "", c = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : {}, f = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : !0, d = function() {
      var K = je._getOptionValue.apply(je, arguments);
      return mr(K) || ku(K) ? {
        class: K
      } : K;
    }, h = ((t = i.binding) === null || t === void 0 || (t = t.value) === null || t === void 0 ? void 0 : t.ptOptions) || ((n = i.$primevueConfig) === null || n === void 0 ? void 0 : n.ptOptions) || {}, m = h.mergeSections, b = m === void 0 ? !0 : m, v = h.mergeProps, _ = v === void 0 ? !1 : v, x = f ? je._useDefaultPT(i, i.defaultPT(), d, s, c) : void 0, T = je._usePT(i, je._getPT(a, i.$name), d, s, Ge(Ge({}, c), {}, {
      global: x || {}
    })), R = je._getPTDatasets(i, s);
    return b || !b && T ? _ ? je._mergeProps(i, _, x, T, R) : Ge(Ge(Ge({}, x), T), R) : Ge(Ge({}, T), R);
  },
  _getPTDatasets: function() {
    var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "", i = "data-pc-";
    return Ge(Ge({}, n === "root" && nf({}, "".concat(i, "name"), cn(t.$name))), {}, nf({}, "".concat(i, "section"), cn(n)));
  },
  _getPT: function(t) {
    var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "", i = arguments.length > 2 ? arguments[2] : void 0, a = function(c) {
      var f, d = i ? i(c) : c, h = cn(n);
      return (f = d == null ? void 0 : d[h]) !== null && f !== void 0 ? f : d;
    };
    return t && Object.hasOwn(t, "_usept") ? {
      _usept: t._usept,
      originalValue: a(t.originalValue),
      value: a(t.value)
    } : a(t);
  },
  _usePT: function() {
    var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, n = arguments.length > 1 ? arguments[1] : void 0, i = arguments.length > 2 ? arguments[2] : void 0, a = arguments.length > 3 ? arguments[3] : void 0, s = arguments.length > 4 ? arguments[4] : void 0, c = function(R) {
      return i(R, a, s);
    };
    if (n && Object.hasOwn(n, "_usept")) {
      var f, d = n._usept || ((f = t.$primevueConfig) === null || f === void 0 ? void 0 : f.ptOptions) || {}, h = d.mergeSections, m = h === void 0 ? !0 : h, b = d.mergeProps, v = b === void 0 ? !1 : b, _ = c(n.originalValue), x = c(n.value);
      return _ === void 0 && x === void 0 ? void 0 : mr(x) ? x : mr(_) ? _ : m || !m && x ? v ? je._mergeProps(t, v, _, x) : Ge(Ge({}, _), x) : x;
    }
    return c(n);
  },
  _useDefaultPT: function() {
    var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, i = arguments.length > 2 ? arguments[2] : void 0, a = arguments.length > 3 ? arguments[3] : void 0, s = arguments.length > 4 ? arguments[4] : void 0;
    return je._usePT(t, n, i, a, s);
  },
  _loadStyles: function() {
    var t, n = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, i = arguments.length > 1 ? arguments[1] : void 0, a = arguments.length > 2 ? arguments[2] : void 0, s = je._getConfig(i, a), c = {
      nonce: s == null || (t = s.csp) === null || t === void 0 ? void 0 : t.nonce
    };
    je._loadCoreStyles(n, c), je._loadThemeStyles(n, c), je._loadScopedThemeStyles(n, c), je._removeThemeListeners(n), n.$loadStyles = function() {
      return je._loadThemeStyles(n, c);
    }, je._themeChangeListener(n.$loadStyles);
  },
  _loadCoreStyles: function() {
    var t, n, i = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, a = arguments.length > 1 ? arguments[1] : void 0;
    if (!co.isStyleNameLoaded((t = i.$style) === null || t === void 0 ? void 0 : t.name) && (n = i.$style) !== null && n !== void 0 && n.name) {
      var s;
      ft.loadCSS(a), (s = i.$style) === null || s === void 0 || s.loadCSS(a), co.setLoadedStyleName(i.$style.name);
    }
  },
  _loadThemeStyles: function() {
    var t, n, i, a = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, s = arguments.length > 1 ? arguments[1] : void 0;
    if (!(a != null && a.isUnstyled() || (a == null || (t = a.theme) === null || t === void 0 ? void 0 : t.call(a)) === "none")) {
      if (!rt.isStyleNameLoaded("common")) {
        var c, f, d = ((c = a.$style) === null || c === void 0 || (f = c.getCommonTheme) === null || f === void 0 ? void 0 : f.call(c)) || {}, h = d.primitive, m = d.semantic, b = d.global, v = d.style;
        ft.load(h == null ? void 0 : h.css, Ge({
          name: "primitive-variables"
        }, s)), ft.load(m == null ? void 0 : m.css, Ge({
          name: "semantic-variables"
        }, s)), ft.load(b == null ? void 0 : b.css, Ge({
          name: "global-variables"
        }, s)), ft.loadStyle(Ge({
          name: "global-style"
        }, s), v), rt.setLoadedStyleName("common");
      }
      if (!rt.isStyleNameLoaded((n = a.$style) === null || n === void 0 ? void 0 : n.name) && (i = a.$style) !== null && i !== void 0 && i.name) {
        var _, x, T, R, D = ((_ = a.$style) === null || _ === void 0 || (x = _.getDirectiveTheme) === null || x === void 0 ? void 0 : x.call(_)) || {}, K = D.css, L = D.style;
        (T = a.$style) === null || T === void 0 || T.load(K, Ge({
          name: "".concat(a.$style.name, "-variables")
        }, s)), (R = a.$style) === null || R === void 0 || R.loadStyle(Ge({
          name: "".concat(a.$style.name, "-style")
        }, s), L), rt.setLoadedStyleName(a.$style.name);
      }
      if (!rt.isStyleNameLoaded("layer-order")) {
        var S, B, I = (S = a.$style) === null || S === void 0 || (B = S.getLayerOrderThemeCSS) === null || B === void 0 ? void 0 : B.call(S);
        ft.load(I, Ge({
          name: "layer-order",
          first: !0
        }, s)), rt.setLoadedStyleName("layer-order");
      }
    }
  },
  _loadScopedThemeStyles: function() {
    var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, n = arguments.length > 1 ? arguments[1] : void 0, i = t.preset();
    if (i && t.$attrSelector) {
      var a, s, c, f = ((a = t.$style) === null || a === void 0 || (s = a.getPresetTheme) === null || s === void 0 ? void 0 : s.call(a, i, "[".concat(t.$attrSelector, "]"))) || {}, d = f.css, h = (c = t.$style) === null || c === void 0 ? void 0 : c.load(d, Ge({
        name: "".concat(t.$attrSelector, "-").concat(t.$style.name)
      }, n));
      t.scopedStyleEl = h.el;
    }
  },
  _themeChangeListener: function() {
    var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : function() {
    };
    co.clearLoadedStyleNames(), jt.on("theme:change", t);
  },
  _removeThemeListeners: function() {
    var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    jt.off("theme:change", t.$loadStyles), t.$loadStyles = void 0;
  },
  _hook: function(t, n, i, a, s, c) {
    var f, d, h = "on".concat(NC(n)), m = je._getConfig(a, s), b = i == null ? void 0 : i.$instance, v = je._usePT(b, je._getPT(a == null || (f = a.value) === null || f === void 0 ? void 0 : f.pt, t), je._getOptionValue, "hooks.".concat(h)), _ = je._useDefaultPT(b, m == null || (d = m.pt) === null || d === void 0 || (d = d.directives) === null || d === void 0 ? void 0 : d[t], je._getOptionValue, "hooks.".concat(h)), x = {
      el: i,
      binding: a,
      vnode: s,
      prevVnode: c
    };
    v == null || v(b, x), _ == null || _(b, x);
  },
  /* eslint-disable-next-line no-unused-vars */
  _mergeProps: function() {
    for (var t = arguments.length > 1 ? arguments[1] : void 0, n = arguments.length, i = new Array(n > 2 ? n - 2 : 0), a = 2; a < n; a++)
      i[a - 2] = arguments[a];
    return Mf(t) ? t.apply(void 0, i) : nr.apply(void 0, i);
  },
  _extend: function(t) {
    var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, i = function(f, d, h, m, b) {
      var v, _, x, T;
      d._$instances = d._$instances || {};
      var R = je._getConfig(h, m), D = d._$instances[t] || {}, K = Mn(D) ? Ge(Ge({}, n), n == null ? void 0 : n.methods) : {};
      d._$instances[t] = Ge(Ge({}, D), {}, {
        /* new instance variables to pass in directive methods */
        $name: t,
        $host: d,
        $binding: h,
        $modifiers: h == null ? void 0 : h.modifiers,
        $value: h == null ? void 0 : h.value,
        $el: D.$el || d || void 0,
        $style: Ge({
          classes: void 0,
          inlineStyles: void 0,
          load: function() {
          },
          loadCSS: function() {
          },
          loadStyle: function() {
          }
        }, n == null ? void 0 : n.style),
        $primevueConfig: R,
        $attrSelector: (v = d.$pd) === null || v === void 0 || (v = v[t]) === null || v === void 0 ? void 0 : v.attrSelector,
        /* computed instance variables */
        defaultPT: function() {
          return je._getPT(R == null ? void 0 : R.pt, void 0, function(S) {
            var B;
            return S == null || (B = S.directives) === null || B === void 0 ? void 0 : B[t];
          });
        },
        isUnstyled: function() {
          var S, B;
          return ((S = d._$instances[t]) === null || S === void 0 || (S = S.$binding) === null || S === void 0 || (S = S.value) === null || S === void 0 ? void 0 : S.unstyled) !== void 0 ? (B = d._$instances[t]) === null || B === void 0 || (B = B.$binding) === null || B === void 0 || (B = B.value) === null || B === void 0 ? void 0 : B.unstyled : R == null ? void 0 : R.unstyled;
        },
        theme: function() {
          var S;
          return (S = d._$instances[t]) === null || S === void 0 || (S = S.$primevueConfig) === null || S === void 0 ? void 0 : S.theme;
        },
        preset: function() {
          var S;
          return (S = d._$instances[t]) === null || S === void 0 || (S = S.$binding) === null || S === void 0 || (S = S.value) === null || S === void 0 ? void 0 : S.dt;
        },
        /* instance's methods */
        ptm: function() {
          var S, B = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", I = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
          return je._getPTValue(d._$instances[t], (S = d._$instances[t]) === null || S === void 0 || (S = S.$binding) === null || S === void 0 || (S = S.value) === null || S === void 0 ? void 0 : S.pt, B, Ge({}, I));
        },
        ptmo: function() {
          var S = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, B = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "", I = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
          return je._getPTValue(d._$instances[t], S, B, I, !1);
        },
        cx: function() {
          var S, B, I = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", F = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
          return (S = d._$instances[t]) !== null && S !== void 0 && S.isUnstyled() ? void 0 : je._getOptionValue((B = d._$instances[t]) === null || B === void 0 || (B = B.$style) === null || B === void 0 ? void 0 : B.classes, I, Ge({}, F));
        },
        sx: function() {
          var S, B = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", I = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !0, F = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
          return I ? je._getOptionValue((S = d._$instances[t]) === null || S === void 0 || (S = S.$style) === null || S === void 0 ? void 0 : S.inlineStyles, B, Ge({}, F)) : void 0;
        }
      }, K), d.$instance = d._$instances[t], (_ = (x = d.$instance)[f]) === null || _ === void 0 || _.call(x, d, h, m, b), d["$".concat(t)] = d.$instance, je._hook(t, f, d, h, m, b), d.$pd || (d.$pd = {}), d.$pd[t] = Ge(Ge({}, (T = d.$pd) === null || T === void 0 ? void 0 : T[t]), {}, {
        name: t,
        instance: d._$instances[t]
      });
    }, a = function(f) {
      var d, h, m, b = f._$instances[t], v = b == null ? void 0 : b.watch, _ = function(R) {
        var D, K = R.newValue, L = R.oldValue;
        return v == null || (D = v.config) === null || D === void 0 ? void 0 : D.call(b, K, L);
      }, x = function(R) {
        var D, K = R.newValue, L = R.oldValue;
        return v == null || (D = v["config.ripple"]) === null || D === void 0 ? void 0 : D.call(b, K, L);
      };
      b.$watchersCallback = {
        config: _,
        "config.ripple": x
      }, v == null || (d = v.config) === null || d === void 0 || d.call(b, b == null ? void 0 : b.$primevueConfig), fo.on("config:change", _), v == null || (h = v["config.ripple"]) === null || h === void 0 || h.call(b, b == null || (m = b.$primevueConfig) === null || m === void 0 ? void 0 : m.ripple), fo.on("config:ripple:change", x);
    }, s = function(f) {
      var d = f._$instances[t].$watchersCallback;
      d && (fo.off("config:change", d.config), fo.off("config:ripple:change", d["config.ripple"]), f._$instances[t].$watchersCallback = void 0);
    };
    return {
      created: function(f, d, h, m) {
        f.$pd || (f.$pd = {}), f.$pd[t] = {
          name: t,
          attrSelector: Pl("pd")
        }, i("created", f, d, h, m);
      },
      beforeMount: function(f, d, h, m) {
        var b;
        je._loadStyles((b = f.$pd[t]) === null || b === void 0 ? void 0 : b.instance, d, h), i("beforeMount", f, d, h, m), a(f);
      },
      mounted: function(f, d, h, m) {
        var b;
        je._loadStyles((b = f.$pd[t]) === null || b === void 0 ? void 0 : b.instance, d, h), i("mounted", f, d, h, m);
      },
      beforeUpdate: function(f, d, h, m) {
        i("beforeUpdate", f, d, h, m);
      },
      updated: function(f, d, h, m) {
        var b;
        je._loadStyles((b = f.$pd[t]) === null || b === void 0 ? void 0 : b.instance, d, h), i("updated", f, d, h, m);
      },
      beforeUnmount: function(f, d, h, m) {
        var b;
        s(f), je._removeThemeListeners((b = f.$pd[t]) === null || b === void 0 ? void 0 : b.instance), i("beforeUnmount", f, d, h, m);
      },
      unmounted: function(f, d, h, m) {
        var b;
        (b = f.$pd[t]) === null || b === void 0 || (b = b.instance) === null || b === void 0 || (b = b.scopedStyleEl) === null || b === void 0 || (b = b.value) === null || b === void 0 || b.remove(), i("unmounted", f, d, h, m);
      }
    };
  },
  extend: function() {
    var t = je._getMeta.apply(je, arguments), n = Jm(t, 2), i = n[0], a = n[1];
    return Ge({
      extend: function() {
        var c = je._getMeta.apply(je, arguments), f = Jm(c, 2), d = f[0], h = f[1];
        return je.extend(d, Ge(Ge(Ge({}, a), a == null ? void 0 : a.methods), h));
      }
    }, je._extend(i, a));
  }
}, Bx = ({ dt: e }) => `
.p-tooltip {
    position: absolute;
    display: none;
    max-width: ${e("tooltip.max.width")};
}

.p-tooltip-right,
.p-tooltip-left {
    padding: 0 ${e("tooltip.gutter")};
}

.p-tooltip-top,
.p-tooltip-bottom {
    padding: ${e("tooltip.gutter")} 0;
}

.p-tooltip-text {
    white-space: pre-line;
    word-break: break-word;
    background: ${e("tooltip.background")};
    color: ${e("tooltip.color")};
    padding: ${e("tooltip.padding")};
    box-shadow: ${e("tooltip.shadow")};
    border-radius: ${e("tooltip.border.radius")};
}

.p-tooltip-arrow {
    position: absolute;
    width: 0;
    height: 0;
    border-color: transparent;
    border-style: solid;
}

.p-tooltip-right .p-tooltip-arrow {
    margin-top: calc(-1 * ${e("tooltip.gutter")});
    border-width: ${e("tooltip.gutter")} ${e("tooltip.gutter")} ${e("tooltip.gutter")} 0;
    border-right-color: ${e("tooltip.background")};
}

.p-tooltip-left .p-tooltip-arrow {
    margin-top: calc(-1 * ${e("tooltip.gutter")});
    border-width: ${e("tooltip.gutter")} 0 ${e("tooltip.gutter")} ${e("tooltip.gutter")};
    border-left-color: ${e("tooltip.background")};
}

.p-tooltip-top .p-tooltip-arrow {
    margin-left: calc(-1 * ${e("tooltip.gutter")});
    border-width: ${e("tooltip.gutter")} ${e("tooltip.gutter")} 0 ${e("tooltip.gutter")};
    border-top-color: ${e("tooltip.background")};
    border-bottom-color: ${e("tooltip.background")};
}

.p-tooltip-bottom .p-tooltip-arrow {
    margin-left: calc(-1 * ${e("tooltip.gutter")});
    border-width: 0 ${e("tooltip.gutter")} ${e("tooltip.gutter")} ${e("tooltip.gutter")};
    border-top-color: ${e("tooltip.background")};
    border-bottom-color: ${e("tooltip.background")};
}
`, Dx = {
  root: "p-tooltip p-component",
  arrow: "p-tooltip-arrow",
  text: "p-tooltip-text"
}, Mx = ft.extend({
  name: "tooltip-directive",
  style: Bx,
  classes: Dx
}), jx = je.extend({
  style: Mx
});
function Fx(e, t) {
  return Vx(e) || Wx(e, t) || Ux(e, t) || zx();
}
function zx() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function Ux(e, t) {
  if (e) {
    if (typeof e == "string") return e0(e, t);
    var n = {}.toString.call(e).slice(8, -1);
    return n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set" ? Array.from(e) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? e0(e, t) : void 0;
  }
}
function e0(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var n = 0, i = Array(t); n < t; n++) i[n] = e[n];
  return i;
}
function Wx(e, t) {
  var n = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (n != null) {
    var i, a, s, c, f = [], d = !0, h = !1;
    try {
      if (s = (n = n.call(e)).next, t !== 0) for (; !(d = (i = s.call(n)).done) && (f.push(i.value), f.length !== t); d = !0) ;
    } catch (m) {
      h = !0, a = m;
    } finally {
      try {
        if (!d && n.return != null && (c = n.return(), Object(c) !== c)) return;
      } finally {
        if (h) throw a;
      }
    }
    return f;
  }
}
function Vx(e) {
  if (Array.isArray(e)) return e;
}
function t0(e, t, n) {
  return (t = Hx(t)) in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
function Hx(e) {
  var t = Kx(e, "string");
  return ho(t) == "symbol" ? t : t + "";
}
function Kx(e, t) {
  if (ho(e) != "object" || !e) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var i = n.call(e, t);
    if (ho(i) != "object") return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function ho(e) {
  "@babel/helpers - typeof";
  return ho = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, ho(e);
}
var Yx = jx.extend("tooltip", {
  beforeMount: function(t, n) {
    var i, a = this.getTarget(t);
    if (a.$_ptooltipModifiers = this.getModifiers(n), n.value) {
      if (typeof n.value == "string")
        a.$_ptooltipValue = n.value, a.$_ptooltipDisabled = !1, a.$_ptooltipEscape = !0, a.$_ptooltipClass = null, a.$_ptooltipFitContent = !0, a.$_ptooltipIdAttr = Pl("pv_id") + "_tooltip", a.$_ptooltipShowDelay = 0, a.$_ptooltipHideDelay = 0, a.$_ptooltipAutoHide = !0;
      else if (ho(n.value) === "object" && n.value) {
        if (Mn(n.value.value) || n.value.value.trim() === "") return;
        a.$_ptooltipValue = n.value.value, a.$_ptooltipDisabled = !!n.value.disabled === n.value.disabled ? n.value.disabled : !1, a.$_ptooltipEscape = !!n.value.escape === n.value.escape ? n.value.escape : !0, a.$_ptooltipClass = n.value.class || "", a.$_ptooltipFitContent = !!n.value.fitContent === n.value.fitContent ? n.value.fitContent : !0, a.$_ptooltipIdAttr = n.value.id || Pl("pv_id") + "_tooltip", a.$_ptooltipShowDelay = n.value.showDelay || 0, a.$_ptooltipHideDelay = n.value.hideDelay || 0, a.$_ptooltipAutoHide = !!n.value.autoHide === n.value.autoHide ? n.value.autoHide : !0;
      }
    } else return;
    a.$_ptooltipZIndex = (i = n.instance.$primevue) === null || i === void 0 || (i = i.config) === null || i === void 0 || (i = i.zIndex) === null || i === void 0 ? void 0 : i.tooltip, this.bindEvents(a, n), t.setAttribute("data-pd-tooltip", !0);
  },
  updated: function(t, n) {
    var i = this.getTarget(t);
    if (i.$_ptooltipModifiers = this.getModifiers(n), this.unbindEvents(i), !!n.value) {
      if (typeof n.value == "string")
        i.$_ptooltipValue = n.value, i.$_ptooltipDisabled = !1, i.$_ptooltipEscape = !0, i.$_ptooltipClass = null, i.$_ptooltipIdAttr = i.$_ptooltipIdAttr || Pl("pv_id") + "_tooltip", i.$_ptooltipShowDelay = 0, i.$_ptooltipHideDelay = 0, i.$_ptooltipAutoHide = !0, this.bindEvents(i, n);
      else if (ho(n.value) === "object" && n.value)
        if (Mn(n.value.value) || n.value.value.trim() === "") {
          this.unbindEvents(i, n);
          return;
        } else
          i.$_ptooltipValue = n.value.value, i.$_ptooltipDisabled = !!n.value.disabled === n.value.disabled ? n.value.disabled : !1, i.$_ptooltipEscape = !!n.value.escape === n.value.escape ? n.value.escape : !0, i.$_ptooltipClass = n.value.class || "", i.$_ptooltipFitContent = !!n.value.fitContent === n.value.fitContent ? n.value.fitContent : !0, i.$_ptooltipIdAttr = n.value.id || i.$_ptooltipIdAttr || Pl("pv_id") + "_tooltip", i.$_ptooltipShowDelay = n.value.showDelay || 0, i.$_ptooltipHideDelay = n.value.hideDelay || 0, i.$_ptooltipAutoHide = !!n.value.autoHide === n.value.autoHide ? n.value.autoHide : !0, this.bindEvents(i, n);
    }
  },
  unmounted: function(t, n) {
    var i = this.getTarget(t);
    this.remove(i), this.unbindEvents(i, n), i.$_ptooltipScrollHandler && (i.$_ptooltipScrollHandler.destroy(), i.$_ptooltipScrollHandler = null);
  },
  timer: void 0,
  methods: {
    bindEvents: function(t, n) {
      var i = this, a = t.$_ptooltipModifiers;
      a.focus ? (t.$_ptooltipFocusEvent = function(s) {
        return i.onFocus(s, n);
      }, t.$_ptooltipBlurEvent = this.onBlur.bind(this), t.addEventListener("focus", t.$_ptooltipFocusEvent), t.addEventListener("blur", t.$_ptooltipBlurEvent)) : (t.$_ptooltipMouseEnterEvent = function(s) {
        return i.onMouseEnter(s, n);
      }, t.$_ptooltipMouseLeaveEvent = this.onMouseLeave.bind(this), t.$_ptooltipClickEvent = this.onClick.bind(this), t.addEventListener("mouseenter", t.$_ptooltipMouseEnterEvent), t.addEventListener("mouseleave", t.$_ptooltipMouseLeaveEvent), t.addEventListener("click", t.$_ptooltipClickEvent)), t.addEventListener("keydown", this.onKeydown.bind(this));
    },
    unbindEvents: function(t) {
      var n = t.$_ptooltipModifiers;
      n.focus ? (t.removeEventListener("focus", t.$_ptooltipFocusEvent), t.$_ptooltipFocusEvent = null, t.removeEventListener("blur", t.$_ptooltipBlurEvent), t.$_ptooltipBlurEvent = null) : (t.removeEventListener("mouseenter", t.$_ptooltipMouseEnterEvent), t.$_ptooltipMouseEnterEvent = null, t.removeEventListener("mouseleave", t.$_ptooltipMouseLeaveEvent), t.$_ptooltipMouseLeaveEvent = null, t.removeEventListener("click", t.$_ptooltipClickEvent), t.$_ptooltipClickEvent = null), t.removeEventListener("keydown", this.onKeydown.bind(this));
    },
    bindScrollListener: function(t) {
      var n = this;
      t.$_ptooltipScrollHandler || (t.$_ptooltipScrollHandler = new Ox(t, function() {
        n.hide(t);
      })), t.$_ptooltipScrollHandler.bindScrollListener();
    },
    unbindScrollListener: function(t) {
      t.$_ptooltipScrollHandler && t.$_ptooltipScrollHandler.unbindScrollListener();
    },
    onMouseEnter: function(t, n) {
      var i = t.currentTarget, a = i.$_ptooltipShowDelay;
      this.show(i, n, a);
    },
    onMouseLeave: function(t) {
      var n = t.currentTarget, i = n.$_ptooltipHideDelay, a = n.$_ptooltipAutoHide;
      if (a)
        this.hide(n, i);
      else {
        var s = Uo(t.target, "data-pc-name") === "tooltip" || Uo(t.target, "data-pc-section") === "arrow" || Uo(t.target, "data-pc-section") === "text" || Uo(t.relatedTarget, "data-pc-name") === "tooltip" || Uo(t.relatedTarget, "data-pc-section") === "arrow" || Uo(t.relatedTarget, "data-pc-section") === "text";
        !s && this.hide(n, i);
      }
    },
    onFocus: function(t, n) {
      var i = t.currentTarget, a = i.$_ptooltipShowDelay;
      this.show(i, n, a);
    },
    onBlur: function(t) {
      var n = t.currentTarget, i = n.$_ptooltipHideDelay;
      this.hide(n, i);
    },
    onClick: function(t) {
      var n = t.currentTarget, i = n.$_ptooltipHideDelay;
      this.hide(n, i);
    },
    onKeydown: function(t) {
      var n = t.currentTarget, i = n.$_ptooltipHideDelay;
      t.code === "Escape" && this.hide(t.currentTarget, i);
    },
    tooltipActions: function(t, n) {
      if (!(t.$_ptooltipDisabled || !Ab(t))) {
        var i = this.create(t, n);
        this.align(t), !this.isUnstyled() && AC(i, 250);
        var a = this;
        window.addEventListener("resize", function s() {
          jC() || a.hide(t), window.removeEventListener("resize", s);
        }), i.addEventListener("mouseleave", function s() {
          a.hide(t), i.removeEventListener("mouseleave", s), t.removeEventListener("mouseenter", t.$_ptooltipMouseEnterEvent), setTimeout(function() {
            return t.addEventListener("mouseenter", t.$_ptooltipMouseEnterEvent);
          }, 50);
        }), this.bindScrollListener(t), Um.set("tooltip", i, t.$_ptooltipZIndex);
      }
    },
    show: function(t, n, i) {
      var a = this;
      i !== void 0 ? this.timer = setTimeout(function() {
        return a.tooltipActions(t, n);
      }, i) : this.tooltipActions(t, n);
    },
    tooltipRemoval: function(t) {
      this.remove(t), this.unbindScrollListener(t);
    },
    hide: function(t, n) {
      var i = this;
      clearTimeout(this.timer), n !== void 0 ? setTimeout(function() {
        return i.tooltipRemoval(t);
      }, n) : this.tooltipRemoval(t);
    },
    getTooltipElement: function(t) {
      return document.getElementById(t.$_ptooltipId);
    },
    getArrowElement: function(t) {
      var n = this.getTooltipElement(t);
      return Qs(n, '[data-pc-section="arrow"]');
    },
    create: function(t) {
      var n = t.$_ptooltipModifiers, i = Ms("div", {
        class: !this.isUnstyled() && this.cx("arrow"),
        "p-bind": this.ptm("arrow", {
          context: n
        })
      }), a = Ms("div", {
        class: !this.isUnstyled() && this.cx("text"),
        "p-bind": this.ptm("text", {
          context: n
        })
      });
      t.$_ptooltipEscape ? (a.innerHTML = "", a.appendChild(document.createTextNode(t.$_ptooltipValue))) : a.innerHTML = t.$_ptooltipValue;
      var s = Ms("div", t0(t0({
        id: t.$_ptooltipIdAttr,
        role: "tooltip",
        style: {
          display: "inline-block",
          width: t.$_ptooltipFitContent ? "fit-content" : void 0,
          pointerEvents: !this.isUnstyled() && t.$_ptooltipAutoHide && "none"
        },
        class: [!this.isUnstyled() && this.cx("root"), t.$_ptooltipClass]
      }, this.$attrSelector, ""), "p-bind", this.ptm("root", {
        context: n
      })), i, a);
      return document.body.appendChild(s), t.$_ptooltipId = s.id, this.$el = s, s;
    },
    remove: function(t) {
      if (t) {
        var n = this.getTooltipElement(t);
        n && n.parentElement && (Um.clear(n), document.body.removeChild(n)), t.$_ptooltipId = null;
      }
    },
    align: function(t) {
      var n = t.$_ptooltipModifiers;
      n.top ? (this.alignTop(t), this.isOutOfBounds(t) && (this.alignBottom(t), this.isOutOfBounds(t) && this.alignTop(t))) : n.left ? (this.alignLeft(t), this.isOutOfBounds(t) && (this.alignRight(t), this.isOutOfBounds(t) && (this.alignTop(t), this.isOutOfBounds(t) && (this.alignBottom(t), this.isOutOfBounds(t) && this.alignLeft(t))))) : n.bottom ? (this.alignBottom(t), this.isOutOfBounds(t) && (this.alignTop(t), this.isOutOfBounds(t) && this.alignBottom(t))) : (this.alignRight(t), this.isOutOfBounds(t) && (this.alignLeft(t), this.isOutOfBounds(t) && (this.alignTop(t), this.isOutOfBounds(t) && (this.alignBottom(t), this.isOutOfBounds(t) && this.alignRight(t)))));
    },
    getHostOffset: function(t) {
      var n = t.getBoundingClientRect(), i = n.left + RC(), a = n.top + IC();
      return {
        left: i,
        top: a
      };
    },
    alignRight: function(t) {
      this.preAlign(t, "right");
      var n = this.getTooltipElement(t), i = this.getArrowElement(t), a = this.getHostOffset(t), s = a.left + Pr(t), c = a.top + (ao(t) - ao(n)) / 2;
      n.style.left = s + "px", n.style.top = c + "px", i.style.top = "50%", i.style.right = null, i.style.bottom = null, i.style.left = "0";
    },
    alignLeft: function(t) {
      this.preAlign(t, "left");
      var n = this.getTooltipElement(t), i = this.getArrowElement(t), a = this.getHostOffset(t), s = a.left - Pr(n), c = a.top + (ao(t) - ao(n)) / 2;
      n.style.left = s + "px", n.style.top = c + "px", i.style.top = "50%", i.style.right = "0", i.style.bottom = null, i.style.left = null;
    },
    alignTop: function(t) {
      this.preAlign(t, "top");
      var n = this.getTooltipElement(t), i = this.getArrowElement(t), a = Pr(n), s = Pr(t), c = Sd(), f = c.width, d = this.getHostOffset(t), h = d.left + (Pr(t) - Pr(n)) / 2, m = d.top - ao(n);
      d.left + a > f && (h = Math.floor(d.left + s - a)), n.style.left = h + "px", n.style.top = m + "px";
      var b = d.left - this.getHostOffset(n).left + s / 2;
      i.style.top = null, i.style.right = null, i.style.bottom = "0", i.style.left = b + "px";
    },
    alignBottom: function(t) {
      this.preAlign(t, "bottom");
      var n = this.getTooltipElement(t), i = this.getArrowElement(t), a = Pr(n), s = Pr(t), c = Sd(), f = c.width, d = this.getHostOffset(t), h = d.left + (Pr(t) - Pr(n)) / 2, m = d.top + ao(t);
      d.left + a > f && (h = Math.floor(d.left + s - a)), n.style.left = h + "px", n.style.top = m + "px";
      var b = d.left - this.getHostOffset(n).left + s / 2;
      i.style.top = "0", i.style.right = null, i.style.bottom = null, i.style.left = b + "px";
    },
    preAlign: function(t, n) {
      var i = this.getTooltipElement(t);
      i.style.left = "-999px", i.style.top = "-999px", Ds(i, "p-tooltip-".concat(i.$_ptooltipPosition)), !this.isUnstyled() && Rb(i, "p-tooltip-".concat(n)), i.$_ptooltipPosition = n, i.setAttribute("data-p-position", n);
    },
    isOutOfBounds: function(t) {
      var n = this.getTooltipElement(t), i = n.getBoundingClientRect(), a = i.top, s = i.left, c = Pr(n), f = ao(n), d = Sd();
      return s + c > d.width || s < 0 || a < 0 || a + f > d.height;
    },
    getTarget: function(t) {
      var n;
      return Nb(t, "p-inputwrapper") && (n = Qs(t, "input")) !== null && n !== void 0 ? n : t;
    },
    getModifiers: function(t) {
      return t.modifiers && Object.keys(t.modifiers).length ? t.modifiers : t.arg && ho(t.arg) === "object" ? Object.entries(t.arg).reduce(function(n, i) {
        var a = Fx(i, 2), s = a[0], c = a[1];
        return (s === "event" || s === "position") && (n[c] = !0), n;
      }, {}) : {};
    }
  }
}), Gx = { transitionDuration: "{transition.duration}" }, Xx = { borderWidth: "0 0 1px 0", borderColor: "{content.border.color}" }, Qx = { color: "{text.muted.color}", hoverColor: "{text.color}", activeColor: "{text.color}", activeHoverColor: "{text.color}", padding: "1.125rem", fontWeight: "600", borderRadius: "0", borderWidth: "0", borderColor: "{content.border.color}", background: "{content.background}", hoverBackground: "{content.background}", activeBackground: "{content.background}", activeHoverBackground: "{content.background}", focusRing: { width: "{focus.ring.width}", style: "{focus.ring.style}", color: "{focus.ring.color}", offset: "-1px", shadow: "{focus.ring.shadow}" }, toggleIcon: { color: "{text.muted.color}", hoverColor: "{text.color}", activeColor: "{text.color}", activeHoverColor: "{text.color}" }, first: { topBorderRadius: "{content.border.radius}", borderWidth: "0" }, last: { bottomBorderRadius: "{content.border.radius}", activeBottomBorderRadius: "0" } }, Jx = { borderWidth: "0", borderColor: "{content.border.color}", background: "{content.background}", color: "{text.color}", padding: "0 1.125rem 1.125rem 1.125rem" }, qx = { root: Gx, panel: Xx, header: Qx, content: Jx }, Zx = { background: "{form.field.background}", disabledBackground: "{form.field.disabled.background}", filledBackground: "{form.field.filled.background}", filledHoverBackground: "{form.field.filled.hover.background}", filledFocusBackground: "{form.field.filled.focus.background}", borderColor: "{form.field.border.color}", hoverBorderColor: "{form.field.hover.border.color}", focusBorderColor: "{form.field.focus.border.color}", invalidBorderColor: "{form.field.invalid.border.color}", color: "{form.field.color}", disabledColor: "{form.field.disabled.color}", placeholderColor: "{form.field.placeholder.color}", invalidPlaceholderColor: "{form.field.invalid.placeholder.color}", shadow: "{form.field.shadow}", paddingX: "{form.field.padding.x}", paddingY: "{form.field.padding.y}", borderRadius: "{form.field.border.radius}", focusRing: { width: "{form.field.focus.ring.width}", style: "{form.field.focus.ring.style}", color: "{form.field.focus.ring.color}", offset: "{form.field.focus.ring.offset}", shadow: "{form.field.focus.ring.shadow}" }, transitionDuration: "{form.field.transition.duration}" }, e$ = { background: "{overlay.select.background}", borderColor: "{overlay.select.border.color}", borderRadius: "{overlay.select.border.radius}", color: "{overlay.select.color}", shadow: "{overlay.select.shadow}" }, t$ = { padding: "{list.padding}", gap: "{list.gap}" }, r$ = { focusBackground: "{list.option.focus.background}", selectedBackground: "{list.option.selected.background}", selectedFocusBackground: "{list.option.selected.focus.background}", color: "{list.option.color}", focusColor: "{list.option.focus.color}", selectedColor: "{list.option.selected.color}", selectedFocusColor: "{list.option.selected.focus.color}", padding: "{list.option.padding}", borderRadius: "{list.option.border.radius}" }, n$ = { background: "{list.option.group.background}", color: "{list.option.group.color}", fontWeight: "{list.option.group.font.weight}", padding: "{list.option.group.padding}" }, o$ = { width: "2.5rem", sm: { width: "2rem" }, lg: { width: "3rem" }, borderColor: "{form.field.border.color}", hoverBorderColor: "{form.field.border.color}", activeBorderColor: "{form.field.border.color}", borderRadius: "{form.field.border.radius}", focusRing: { width: "{focus.ring.width}", style: "{focus.ring.style}", color: "{focus.ring.color}", offset: "{focus.ring.offset}", shadow: "{focus.ring.shadow}" } }, i$ = { borderRadius: "{border.radius.sm}" }, l$ = { padding: "{list.option.padding}" }, a$ = { light: { chip: { focusBackground: "{surface.200}", focusColor: "{surface.800}" }, dropdown: { background: "{surface.100}", hoverBackground: "{surface.200}", activeBackground: "{surface.300}", color: "{surface.600}", hoverColor: "{surface.700}", activeColor: "{surface.800}" } }, dark: { chip: { focusBackground: "{surface.700}", focusColor: "{surface.0}" }, dropdown: { background: "{surface.800}", hoverBackground: "{surface.700}", activeBackground: "{surface.600}", color: "{surface.300}", hoverColor: "{surface.200}", activeColor: "{surface.100}" } } }, s$ = { root: Zx, overlay: e$, list: t$, option: r$, optionGroup: n$, dropdown: o$, chip: i$, emptyMessage: l$, colorScheme: a$ }, u$ = { width: "2rem", height: "2rem", fontSize: "1rem", background: "{content.border.color}", color: "{content.color}", borderRadius: "{content.border.radius}" }, c$ = { size: "1rem" }, d$ = { borderColor: "{content.background}", offset: "-0.75rem" }, f$ = { width: "3rem", height: "3rem", fontSize: "1.5rem", icon: { size: "1.5rem" }, group: { offset: "-1rem" } }, p$ = { width: "4rem", height: "4rem", fontSize: "2rem", icon: { size: "2rem" }, group: { offset: "-1.5rem" } }, g$ = { root: u$, icon: c$, group: d$, lg: f$, xl: p$ }, h$ = { borderRadius: "{border.radius.md}", padding: "0 0.5rem", fontSize: "0.75rem", fontWeight: "700", minWidth: "1.5rem", height: "1.5rem" }, m$ = { size: "0.5rem" }, v$ = { fontSize: "0.625rem", minWidth: "1.25rem", height: "1.25rem" }, b$ = { fontSize: "0.875rem", minWidth: "1.75rem", height: "1.75rem" }, y$ = { fontSize: "1rem", minWidth: "2rem", height: "2rem" }, _$ = { light: { primary: { background: "{primary.color}", color: "{primary.contrast.color}" }, secondary: { background: "{surface.100}", color: "{surface.600}" }, success: { background: "{green.500}", color: "{surface.0}" }, info: { background: "{sky.500}", color: "{surface.0}" }, warn: { background: "{orange.500}", color: "{surface.0}" }, danger: { background: "{red.500}", color: "{surface.0}" }, contrast: { background: "{surface.950}", color: "{surface.0}" } }, dark: { primary: { background: "{primary.color}", color: "{primary.contrast.color}" }, secondary: { background: "{surface.800}", color: "{surface.300}" }, success: { background: "{green.400}", color: "{green.950}" }, info: { background: "{sky.400}", color: "{sky.950}" }, warn: { background: "{orange.400}", color: "{orange.950}" }, danger: { background: "{red.400}", color: "{red.950}" }, contrast: { background: "{surface.0}", color: "{surface.950}" } } }, k$ = { root: h$, dot: m$, sm: v$, lg: b$, xl: y$, colorScheme: _$ }, w$ = { borderRadius: { none: "0", xs: "2px", sm: "4px", md: "6px", lg: "8px", xl: "12px" }, emerald: { 50: "#ecfdf5", 100: "#d1fae5", 200: "#a7f3d0", 300: "#6ee7b7", 400: "#34d399", 500: "#10b981", 600: "#059669", 700: "#047857", 800: "#065f46", 900: "#064e3b", 950: "#022c22" }, green: { 50: "#f0fdf4", 100: "#dcfce7", 200: "#bbf7d0", 300: "#86efac", 400: "#4ade80", 500: "#22c55e", 600: "#16a34a", 700: "#15803d", 800: "#166534", 900: "#14532d", 950: "#052e16" }, lime: { 50: "#f7fee7", 100: "#ecfccb", 200: "#d9f99d", 300: "#bef264", 400: "#a3e635", 500: "#84cc16", 600: "#65a30d", 700: "#4d7c0f", 800: "#3f6212", 900: "#365314", 950: "#1a2e05" }, red: { 50: "#fef2f2", 100: "#fee2e2", 200: "#fecaca", 300: "#fca5a5", 400: "#f87171", 500: "#ef4444", 600: "#dc2626", 700: "#b91c1c", 800: "#991b1b", 900: "#7f1d1d", 950: "#450a0a" }, orange: { 50: "#fff7ed", 100: "#ffedd5", 200: "#fed7aa", 300: "#fdba74", 400: "#fb923c", 500: "#f97316", 600: "#ea580c", 700: "#c2410c", 800: "#9a3412", 900: "#7c2d12", 950: "#431407" }, amber: { 50: "#fffbeb", 100: "#fef3c7", 200: "#fde68a", 300: "#fcd34d", 400: "#fbbf24", 500: "#f59e0b", 600: "#d97706", 700: "#b45309", 800: "#92400e", 900: "#78350f", 950: "#451a03" }, yellow: { 50: "#fefce8", 100: "#fef9c3", 200: "#fef08a", 300: "#fde047", 400: "#facc15", 500: "#eab308", 600: "#ca8a04", 700: "#a16207", 800: "#854d0e", 900: "#713f12", 950: "#422006" }, teal: { 50: "#f0fdfa", 100: "#ccfbf1", 200: "#99f6e4", 300: "#5eead4", 400: "#2dd4bf", 500: "#14b8a6", 600: "#0d9488", 700: "#0f766e", 800: "#115e59", 900: "#134e4a", 950: "#042f2e" }, cyan: { 50: "#ecfeff", 100: "#cffafe", 200: "#a5f3fc", 300: "#67e8f9", 400: "#22d3ee", 500: "#06b6d4", 600: "#0891b2", 700: "#0e7490", 800: "#155e75", 900: "#164e63", 950: "#083344" }, sky: { 50: "#f0f9ff", 100: "#e0f2fe", 200: "#bae6fd", 300: "#7dd3fc", 400: "#38bdf8", 500: "#0ea5e9", 600: "#0284c7", 700: "#0369a1", 800: "#075985", 900: "#0c4a6e", 950: "#082f49" }, blue: { 50: "#eff6ff", 100: "#dbeafe", 200: "#bfdbfe", 300: "#93c5fd", 400: "#60a5fa", 500: "#3b82f6", 600: "#2563eb", 700: "#1d4ed8", 800: "#1e40af", 900: "#1e3a8a", 950: "#172554" }, indigo: { 50: "#eef2ff", 100: "#e0e7ff", 200: "#c7d2fe", 300: "#a5b4fc", 400: "#818cf8", 500: "#6366f1", 600: "#4f46e5", 700: "#4338ca", 800: "#3730a3", 900: "#312e81", 950: "#1e1b4b" }, violet: { 50: "#f5f3ff", 100: "#ede9fe", 200: "#ddd6fe", 300: "#c4b5fd", 400: "#a78bfa", 500: "#8b5cf6", 600: "#7c3aed", 700: "#6d28d9", 800: "#5b21b6", 900: "#4c1d95", 950: "#2e1065" }, purple: { 50: "#faf5ff", 100: "#f3e8ff", 200: "#e9d5ff", 300: "#d8b4fe", 400: "#c084fc", 500: "#a855f7", 600: "#9333ea", 700: "#7e22ce", 800: "#6b21a8", 900: "#581c87", 950: "#3b0764" }, fuchsia: { 50: "#fdf4ff", 100: "#fae8ff", 200: "#f5d0fe", 300: "#f0abfc", 400: "#e879f9", 500: "#d946ef", 600: "#c026d3", 700: "#a21caf", 800: "#86198f", 900: "#701a75", 950: "#4a044e" }, pink: { 50: "#fdf2f8", 100: "#fce7f3", 200: "#fbcfe8", 300: "#f9a8d4", 400: "#f472b6", 500: "#ec4899", 600: "#db2777", 700: "#be185d", 800: "#9d174d", 900: "#831843", 950: "#500724" }, rose: { 50: "#fff1f2", 100: "#ffe4e6", 200: "#fecdd3", 300: "#fda4af", 400: "#fb7185", 500: "#f43f5e", 600: "#e11d48", 700: "#be123c", 800: "#9f1239", 900: "#881337", 950: "#4c0519" }, slate: { 50: "#f8fafc", 100: "#f1f5f9", 200: "#e2e8f0", 300: "#cbd5e1", 400: "#94a3b8", 500: "#64748b", 600: "#475569", 700: "#334155", 800: "#1e293b", 900: "#0f172a", 950: "#020617" }, gray: { 50: "#f9fafb", 100: "#f3f4f6", 200: "#e5e7eb", 300: "#d1d5db", 400: "#9ca3af", 500: "#6b7280", 600: "#4b5563", 700: "#374151", 800: "#1f2937", 900: "#111827", 950: "#030712" }, zinc: { 50: "#fafafa", 100: "#f4f4f5", 200: "#e4e4e7", 300: "#d4d4d8", 400: "#a1a1aa", 500: "#71717a", 600: "#52525b", 700: "#3f3f46", 800: "#27272a", 900: "#18181b", 950: "#09090b" }, neutral: { 50: "#fafafa", 100: "#f5f5f5", 200: "#e5e5e5", 300: "#d4d4d4", 400: "#a3a3a3", 500: "#737373", 600: "#525252", 700: "#404040", 800: "#262626", 900: "#171717", 950: "#0a0a0a" }, stone: { 50: "#fafaf9", 100: "#f5f5f4", 200: "#e7e5e4", 300: "#d6d3d1", 400: "#a8a29e", 500: "#78716c", 600: "#57534e", 700: "#44403c", 800: "#292524", 900: "#1c1917", 950: "#0c0a09" } }, S$ = { transitionDuration: "0.2s", focusRing: { width: "1px", style: "solid", color: "{primary.color}", offset: "2px", shadow: "none" }, disabledOpacity: "0.6", iconSize: "1rem", anchorGutter: "2px", primary: { 50: "{emerald.50}", 100: "{emerald.100}", 200: "{emerald.200}", 300: "{emerald.300}", 400: "{emerald.400}", 500: "{emerald.500}", 600: "{emerald.600}", 700: "{emerald.700}", 800: "{emerald.800}", 900: "{emerald.900}", 950: "{emerald.950}" }, formField: { paddingX: "0.75rem", paddingY: "0.5rem", sm: { fontSize: "0.875rem", paddingX: "0.625rem", paddingY: "0.375rem" }, lg: { fontSize: "1.125rem", paddingX: "0.875rem", paddingY: "0.625rem" }, borderRadius: "{border.radius.md}", focusRing: { width: "0", style: "none", color: "transparent", offset: "0", shadow: "none" }, transitionDuration: "{transition.duration}" }, list: { padding: "0.25rem 0.25rem", gap: "2px", header: { padding: "0.5rem 1rem 0.25rem 1rem" }, option: { padding: "0.5rem 0.75rem", borderRadius: "{border.radius.sm}" }, optionGroup: { padding: "0.5rem 0.75rem", fontWeight: "600" } }, content: { borderRadius: "{border.radius.md}" }, mask: { transitionDuration: "0.15s" }, navigation: { list: { padding: "0.25rem 0.25rem", gap: "2px" }, item: { padding: "0.5rem 0.75rem", borderRadius: "{border.radius.sm}", gap: "0.5rem" }, submenuLabel: { padding: "0.5rem 0.75rem", fontWeight: "600" }, submenuIcon: { size: "0.875rem" } }, overlay: { select: { borderRadius: "{border.radius.md}", shadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)" }, popover: { borderRadius: "{border.radius.md}", padding: "0.75rem", shadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)" }, modal: { borderRadius: "{border.radius.xl}", padding: "1.25rem", shadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)" }, navigation: { shadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)" } }, colorScheme: { light: { surface: { 0: "#ffffff", 50: "{slate.50}", 100: "{slate.100}", 200: "{slate.200}", 300: "{slate.300}", 400: "{slate.400}", 500: "{slate.500}", 600: "{slate.600}", 700: "{slate.700}", 800: "{slate.800}", 900: "{slate.900}", 950: "{slate.950}" }, primary: { color: "{primary.500}", contrastColor: "#ffffff", hoverColor: "{primary.600}", activeColor: "{primary.700}" }, highlight: { background: "{primary.50}", focusBackground: "{primary.100}", color: "{primary.700}", focusColor: "{primary.800}" }, mask: { background: "rgba(0,0,0,0.4)", color: "{surface.200}" }, formField: { background: "{surface.0}", disabledBackground: "{surface.200}", filledBackground: "{surface.50}", filledHoverBackground: "{surface.50}", filledFocusBackground: "{surface.50}", borderColor: "{surface.300}", hoverBorderColor: "{surface.400}", focusBorderColor: "{primary.color}", invalidBorderColor: "{red.400}", color: "{surface.700}", disabledColor: "{surface.500}", placeholderColor: "{surface.500}", invalidPlaceholderColor: "{red.600}", floatLabelColor: "{surface.500}", floatLabelFocusColor: "{primary.600}", floatLabelActiveColor: "{surface.500}", floatLabelInvalidColor: "{form.field.invalid.placeholder.color}", iconColor: "{surface.400}", shadow: "0 0 #0000, 0 0 #0000, 0 1px 2px 0 rgba(18, 18, 23, 0.05)" }, text: { color: "{surface.700}", hoverColor: "{surface.800}", mutedColor: "{surface.500}", hoverMutedColor: "{surface.600}" }, content: { background: "{surface.0}", hoverBackground: "{surface.100}", borderColor: "{surface.200}", color: "{text.color}", hoverColor: "{text.hover.color}" }, overlay: { select: { background: "{surface.0}", borderColor: "{surface.200}", color: "{text.color}" }, popover: { background: "{surface.0}", borderColor: "{surface.200}", color: "{text.color}" }, modal: { background: "{surface.0}", borderColor: "{surface.200}", color: "{text.color}" } }, list: { option: { focusBackground: "{surface.100}", selectedBackground: "{highlight.background}", selectedFocusBackground: "{highlight.focus.background}", color: "{text.color}", focusColor: "{text.hover.color}", selectedColor: "{highlight.color}", selectedFocusColor: "{highlight.focus.color}", icon: { color: "{surface.400}", focusColor: "{surface.500}" } }, optionGroup: { background: "transparent", color: "{text.muted.color}" } }, navigation: { item: { focusBackground: "{surface.100}", activeBackground: "{surface.100}", color: "{text.color}", focusColor: "{text.hover.color}", activeColor: "{text.hover.color}", icon: { color: "{surface.400}", focusColor: "{surface.500}", activeColor: "{surface.500}" } }, submenuLabel: { background: "transparent", color: "{text.muted.color}" }, submenuIcon: { color: "{surface.400}", focusColor: "{surface.500}", activeColor: "{surface.500}" } } }, dark: { surface: { 0: "#ffffff", 50: "{zinc.50}", 100: "{zinc.100}", 200: "{zinc.200}", 300: "{zinc.300}", 400: "{zinc.400}", 500: "{zinc.500}", 600: "{zinc.600}", 700: "{zinc.700}", 800: "{zinc.800}", 900: "{zinc.900}", 950: "{zinc.950}" }, primary: { color: "{primary.400}", contrastColor: "{surface.900}", hoverColor: "{primary.300}", activeColor: "{primary.200}" }, highlight: { background: "color-mix(in srgb, {primary.400}, transparent 84%)", focusBackground: "color-mix(in srgb, {primary.400}, transparent 76%)", color: "rgba(255,255,255,.87)", focusColor: "rgba(255,255,255,.87)" }, mask: { background: "rgba(0,0,0,0.6)", color: "{surface.200}" }, formField: { background: "{surface.950}", disabledBackground: "{surface.700}", filledBackground: "{surface.800}", filledHoverBackground: "{surface.800}", filledFocusBackground: "{surface.800}", borderColor: "{surface.600}", hoverBorderColor: "{surface.500}", focusBorderColor: "{primary.color}", invalidBorderColor: "{red.300}", color: "{surface.0}", disabledColor: "{surface.400}", placeholderColor: "{surface.400}", invalidPlaceholderColor: "{red.400}", floatLabelColor: "{surface.400}", floatLabelFocusColor: "{primary.color}", floatLabelActiveColor: "{surface.400}", floatLabelInvalidColor: "{form.field.invalid.placeholder.color}", iconColor: "{surface.400}", shadow: "0 0 #0000, 0 0 #0000, 0 1px 2px 0 rgba(18, 18, 23, 0.05)" }, text: { color: "{surface.0}", hoverColor: "{surface.0}", mutedColor: "{surface.400}", hoverMutedColor: "{surface.300}" }, content: { background: "{surface.900}", hoverBackground: "{surface.800}", borderColor: "{surface.700}", color: "{text.color}", hoverColor: "{text.hover.color}" }, overlay: { select: { background: "{surface.900}", borderColor: "{surface.700}", color: "{text.color}" }, popover: { background: "{surface.900}", borderColor: "{surface.700}", color: "{text.color}" }, modal: { background: "{surface.900}", borderColor: "{surface.700}", color: "{text.color}" } }, list: { option: { focusBackground: "{surface.800}", selectedBackground: "{highlight.background}", selectedFocusBackground: "{highlight.focus.background}", color: "{text.color}", focusColor: "{text.hover.color}", selectedColor: "{highlight.color}", selectedFocusColor: "{highlight.focus.color}", icon: { color: "{surface.500}", focusColor: "{surface.400}" } }, optionGroup: { background: "transparent", color: "{text.muted.color}" } }, navigation: { item: { focusBackground: "{surface.800}", activeBackground: "{surface.800}", color: "{text.color}", focusColor: "{text.hover.color}", activeColor: "{text.hover.color}", icon: { color: "{surface.500}", focusColor: "{surface.400}", activeColor: "{surface.400}" } }, submenuLabel: { background: "transparent", color: "{text.muted.color}" }, submenuIcon: { color: "{surface.500}", focusColor: "{surface.400}", activeColor: "{surface.400}" } } } } }, C$ = { primitive: w$, semantic: S$ }, x$ = { borderRadius: "{content.border.radius}" }, $$ = { root: x$ }, E$ = { padding: "1rem", background: "{content.background}", gap: "0.5rem", transitionDuration: "{transition.duration}" }, T$ = { color: "{text.muted.color}", hoverColor: "{text.color}", borderRadius: "{content.border.radius}", gap: "{navigation.item.gap}", icon: { color: "{navigation.item.icon.color}", hoverColor: "{navigation.item.icon.focus.color}" }, focusRing: { width: "{focus.ring.width}", style: "{focus.ring.style}", color: "{focus.ring.color}", offset: "{focus.ring.offset}", shadow: "{focus.ring.shadow}" } }, O$ = { color: "{navigation.item.icon.color}" }, L$ = { root: E$, item: T$, separator: O$ }, P$ = { borderRadius: "{form.field.border.radius}", roundedBorderRadius: "2rem", gap: "0.5rem", paddingX: "{form.field.padding.x}", paddingY: "{form.field.padding.y}", iconOnlyWidth: "2.5rem", sm: { fontSize: "{form.field.sm.font.size}", paddingX: "{form.field.sm.padding.x}", paddingY: "{form.field.sm.padding.y}", iconOnlyWidth: "2rem" }, lg: { fontSize: "{form.field.lg.font.size}", paddingX: "{form.field.lg.padding.x}", paddingY: "{form.field.lg.padding.y}", iconOnlyWidth: "3rem" }, label: { fontWeight: "500" }, raisedShadow: "0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12)", focusRing: { width: "{focus.ring.width}", style: "{focus.ring.style}", offset: "{focus.ring.offset}" }, badgeSize: "1rem", transitionDuration: "{form.field.transition.duration}" }, N$ = { light: { root: { primary: { background: "{primary.color}", hoverBackground: "{primary.hover.color}", activeBackground: "{primary.active.color}", borderColor: "{primary.color}", hoverBorderColor: "{primary.hover.color}", activeBorderColor: "{primary.active.color}", color: "{primary.contrast.color}", hoverColor: "{primary.contrast.color}", activeColor: "{primary.contrast.color}", focusRing: { color: "{primary.color}", shadow: "none" } }, secondary: { background: "{surface.100}", hoverBackground: "{surface.200}", activeBackground: "{surface.300}", borderColor: "{surface.100}", hoverBorderColor: "{surface.200}", activeBorderColor: "{surface.300}", color: "{surface.600}", hoverColor: "{surface.700}", activeColor: "{surface.800}", focusRing: { color: "{surface.600}", shadow: "none" } }, info: { background: "{sky.500}", hoverBackground: "{sky.600}", activeBackground: "{sky.700}", borderColor: "{sky.500}", hoverBorderColor: "{sky.600}", activeBorderColor: "{sky.700}", color: "#ffffff", hoverColor: "#ffffff", activeColor: "#ffffff", focusRing: { color: "{sky.500}", shadow: "none" } }, success: { background: "{green.500}", hoverBackground: "{green.600}", activeBackground: "{green.700}", borderColor: "{green.500}", hoverBorderColor: "{green.600}", activeBorderColor: "{green.700}", color: "#ffffff", hoverColor: "#ffffff", activeColor: "#ffffff", focusRing: { color: "{green.500}", shadow: "none" } }, warn: { background: "{orange.500}", hoverBackground: "{orange.600}", activeBackground: "{orange.700}", borderColor: "{orange.500}", hoverBorderColor: "{orange.600}", activeBorderColor: "{orange.700}", color: "#ffffff", hoverColor: "#ffffff", activeColor: "#ffffff", focusRing: { color: "{orange.500}", shadow: "none" } }, help: { background: "{purple.500}", hoverBackground: "{purple.600}", activeBackground: "{purple.700}", borderColor: "{purple.500}", hoverBorderColor: "{purple.600}", activeBorderColor: "{purple.700}", color: "#ffffff", hoverColor: "#ffffff", activeColor: "#ffffff", focusRing: { color: "{purple.500}", shadow: "none" } }, danger: { background: "{red.500}", hoverBackground: "{red.600}", activeBackground: "{red.700}", borderColor: "{red.500}", hoverBorderColor: "{red.600}", activeBorderColor: "{red.700}", color: "#ffffff", hoverColor: "#ffffff", activeColor: "#ffffff", focusRing: { color: "{red.500}", shadow: "none" } }, contrast: { background: "{surface.950}", hoverBackground: "{surface.900}", activeBackground: "{surface.800}", borderColor: "{surface.950}", hoverBorderColor: "{surface.900}", activeBorderColor: "{surface.800}", color: "{surface.0}", hoverColor: "{surface.0}", activeColor: "{surface.0}", focusRing: { color: "{surface.950}", shadow: "none" } } }, outlined: { primary: { hoverBackground: "{primary.50}", activeBackground: "{primary.100}", borderColor: "{primary.200}", color: "{primary.color}" }, secondary: { hoverBackground: "{surface.50}", activeBackground: "{surface.100}", borderColor: "{surface.200}", color: "{surface.500}" }, success: { hoverBackground: "{green.50}", activeBackground: "{green.100}", borderColor: "{green.200}", color: "{green.500}" }, info: { hoverBackground: "{sky.50}", activeBackground: "{sky.100}", borderColor: "{sky.200}", color: "{sky.500}" }, warn: { hoverBackground: "{orange.50}", activeBackground: "{orange.100}", borderColor: "{orange.200}", color: "{orange.500}" }, help: { hoverBackground: "{purple.50}", activeBackground: "{purple.100}", borderColor: "{purple.200}", color: "{purple.500}" }, danger: { hoverBackground: "{red.50}", activeBackground: "{red.100}", borderColor: "{red.200}", color: "{red.500}" }, contrast: { hoverBackground: "{surface.50}", activeBackground: "{surface.100}", borderColor: "{surface.700}", color: "{surface.950}" }, plain: { hoverBackground: "{surface.50}", activeBackground: "{surface.100}", borderColor: "{surface.200}", color: "{surface.700}" } }, text: { primary: { hoverBackground: "{primary.50}", activeBackground: "{primary.100}", color: "{primary.color}" }, secondary: { hoverBackground: "{surface.50}", activeBackground: "{surface.100}", color: "{surface.500}" }, success: { hoverBackground: "{green.50}", activeBackground: "{green.100}", color: "{green.500}" }, info: { hoverBackground: "{sky.50}", activeBackground: "{sky.100}", color: "{sky.500}" }, warn: { hoverBackground: "{orange.50}", activeBackground: "{orange.100}", color: "{orange.500}" }, help: { hoverBackground: "{purple.50}", activeBackground: "{purple.100}", color: "{purple.500}" }, danger: { hoverBackground: "{red.50}", activeBackground: "{red.100}", color: "{red.500}" }, contrast: { hoverBackground: "{surface.50}", activeBackground: "{surface.100}", color: "{surface.950}" }, plain: { hoverBackground: "{surface.50}", activeBackground: "{surface.100}", color: "{surface.700}" } }, link: { color: "{primary.color}", hoverColor: "{primary.color}", activeColor: "{primary.color}" } }, dark: { root: { primary: { background: "{primary.color}", hoverBackground: "{primary.hover.color}", activeBackground: "{primary.active.color}", borderColor: "{primary.color}", hoverBorderColor: "{primary.hover.color}", activeBorderColor: "{primary.active.color}", color: "{primary.contrast.color}", hoverColor: "{primary.contrast.color}", activeColor: "{primary.contrast.color}", focusRing: { color: "{primary.color}", shadow: "none" } }, secondary: { background: "{surface.800}", hoverBackground: "{surface.700}", activeBackground: "{surface.600}", borderColor: "{surface.800}", hoverBorderColor: "{surface.700}", activeBorderColor: "{surface.600}", color: "{surface.300}", hoverColor: "{surface.200}", activeColor: "{surface.100}", focusRing: { color: "{surface.300}", shadow: "none" } }, info: { background: "{sky.400}", hoverBackground: "{sky.300}", activeBackground: "{sky.200}", borderColor: "{sky.400}", hoverBorderColor: "{sky.300}", activeBorderColor: "{sky.200}", color: "{sky.950}", hoverColor: "{sky.950}", activeColor: "{sky.950}", focusRing: { color: "{sky.400}", shadow: "none" } }, success: { background: "{green.400}", hoverBackground: "{green.300}", activeBackground: "{green.200}", borderColor: "{green.400}", hoverBorderColor: "{green.300}", activeBorderColor: "{green.200}", color: "{green.950}", hoverColor: "{green.950}", activeColor: "{green.950}", focusRing: { color: "{green.400}", shadow: "none" } }, warn: { background: "{orange.400}", hoverBackground: "{orange.300}", activeBackground: "{orange.200}", borderColor: "{orange.400}", hoverBorderColor: "{orange.300}", activeBorderColor: "{orange.200}", color: "{orange.950}", hoverColor: "{orange.950}", activeColor: "{orange.950}", focusRing: { color: "{orange.400}", shadow: "none" } }, help: { background: "{purple.400}", hoverBackground: "{purple.300}", activeBackground: "{purple.200}", borderColor: "{purple.400}", hoverBorderColor: "{purple.300}", activeBorderColor: "{purple.200}", color: "{purple.950}", hoverColor: "{purple.950}", activeColor: "{purple.950}", focusRing: { color: "{purple.400}", shadow: "none" } }, danger: { background: "{red.400}", hoverBackground: "{red.300}", activeBackground: "{red.200}", borderColor: "{red.400}", hoverBorderColor: "{red.300}", activeBorderColor: "{red.200}", color: "{red.950}", hoverColor: "{red.950}", activeColor: "{red.950}", focusRing: { color: "{red.400}", shadow: "none" } }, contrast: { background: "{surface.0}", hoverBackground: "{surface.100}", activeBackground: "{surface.200}", borderColor: "{surface.0}", hoverBorderColor: "{surface.100}", activeBorderColor: "{surface.200}", color: "{surface.950}", hoverColor: "{surface.950}", activeColor: "{surface.950}", focusRing: { color: "{surface.0}", shadow: "none" } } }, outlined: { primary: { hoverBackground: "color-mix(in srgb, {primary.color}, transparent 96%)", activeBackground: "color-mix(in srgb, {primary.color}, transparent 84%)", borderColor: "{primary.700}", color: "{primary.color}" }, secondary: { hoverBackground: "rgba(255,255,255,0.04)", activeBackground: "rgba(255,255,255,0.16)", borderColor: "{surface.700}", color: "{surface.400}" }, success: { hoverBackground: "color-mix(in srgb, {green.400}, transparent 96%)", activeBackground: "color-mix(in srgb, {green.400}, transparent 84%)", borderColor: "{green.700}", color: "{green.400}" }, info: { hoverBackground: "color-mix(in srgb, {sky.400}, transparent 96%)", activeBackground: "color-mix(in srgb, {sky.400}, transparent 84%)", borderColor: "{sky.700}", color: "{sky.400}" }, warn: { hoverBackground: "color-mix(in srgb, {orange.400}, transparent 96%)", activeBackground: "color-mix(in srgb, {orange.400}, transparent 84%)", borderColor: "{orange.700}", color: "{orange.400}" }, help: { hoverBackground: "color-mix(in srgb, {purple.400}, transparent 96%)", activeBackground: "color-mix(in srgb, {purple.400}, transparent 84%)", borderColor: "{purple.700}", color: "{purple.400}" }, danger: { hoverBackground: "color-mix(in srgb, {red.400}, transparent 96%)", activeBackground: "color-mix(in srgb, {red.400}, transparent 84%)", borderColor: "{red.700}", color: "{red.400}" }, contrast: { hoverBackground: "{surface.800}", activeBackground: "{surface.700}", borderColor: "{surface.500}", color: "{surface.0}" }, plain: { hoverBackground: "{surface.800}", activeBackground: "{surface.700}", borderColor: "{surface.600}", color: "{surface.0}" } }, text: { primary: { hoverBackground: "color-mix(in srgb, {primary.color}, transparent 96%)", activeBackground: "color-mix(in srgb, {primary.color}, transparent 84%)", color: "{primary.color}" }, secondary: { hoverBackground: "{surface.800}", activeBackground: "{surface.700}", color: "{surface.400}" }, success: { hoverBackground: "color-mix(in srgb, {green.400}, transparent 96%)", activeBackground: "color-mix(in srgb, {green.400}, transparent 84%)", color: "{green.400}" }, info: { hoverBackground: "color-mix(in srgb, {sky.400}, transparent 96%)", activeBackground: "color-mix(in srgb, {sky.400}, transparent 84%)", color: "{sky.400}" }, warn: { hoverBackground: "color-mix(in srgb, {orange.400}, transparent 96%)", activeBackground: "color-mix(in srgb, {orange.400}, transparent 84%)", color: "{orange.400}" }, help: { hoverBackground: "color-mix(in srgb, {purple.400}, transparent 96%)", activeBackground: "color-mix(in srgb, {purple.400}, transparent 84%)", color: "{purple.400}" }, danger: { hoverBackground: "color-mix(in srgb, {red.400}, transparent 96%)", activeBackground: "color-mix(in srgb, {red.400}, transparent 84%)", color: "{red.400}" }, contrast: { hoverBackground: "{surface.800}", activeBackground: "{surface.700}", color: "{surface.0}" }, plain: { hoverBackground: "{surface.800}", activeBackground: "{surface.700}", color: "{surface.0}" } }, link: { color: "{primary.color}", hoverColor: "{primary.color}", activeColor: "{primary.color}" } } }, R$ = { root: P$, colorScheme: N$ }, I$ = { background: "{content.background}", borderRadius: "{border.radius.xl}", color: "{content.color}", shadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)" }, A$ = { padding: "1.25rem", gap: "0.5rem" }, B$ = { gap: "0.5rem" }, D$ = { fontSize: "1.25rem", fontWeight: "500" }, M$ = { color: "{text.muted.color}" }, j$ = { root: I$, body: A$, caption: B$, title: D$, subtitle: M$ }, F$ = { transitionDuration: "{transition.duration}" }, z$ = { gap: "0.25rem" }, U$ = { padding: "1rem", gap: "0.5rem" }, W$ = { width: "2rem", height: "0.5rem", borderRadius: "{content.border.radius}", focusRing: { width: "{focus.ring.width}", style: "{focus.ring.style}", color: "{focus.ring.color}", offset: "{focus.ring.offset}", shadow: "{focus.ring.shadow}" } }, V$ = { light: { indicator: { background: "{surface.200}", hoverBackground: "{surface.300}", activeBackground: "{primary.color}" } }, dark: { indicator: { background: "{surface.700}", hoverBackground: "{surface.600}", activeBackground: "{primary.color}" } } }, H$ = { root: F$, content: z$, indicatorList: U$, indicator: W$, colorScheme: V$ }, K$ = { background: "{form.field.background}", disabledBackground: "{form.field.disabled.background}", filledBackground: "{form.field.filled.background}", filledHoverBackground: "{form.field.filled.hover.background}", filledFocusBackground: "{form.field.filled.focus.background}", borderColor: "{form.field.border.color}", hoverBorderColor: "{form.field.hover.border.color}", focusBorderColor: "{form.field.focus.border.color}", invalidBorderColor: "{form.field.invalid.border.color}", color: "{form.field.color}", disabledColor: "{form.field.disabled.color}", placeholderColor: "{form.field.placeholder.color}", invalidPlaceholderColor: "{form.field.invalid.placeholder.color}", shadow: "{form.field.shadow}", paddingX: "{form.field.padding.x}", paddingY: "{form.field.padding.y}", borderRadius: "{form.field.border.radius}", focusRing: { width: "{form.field.focus.ring.width}", style: "{form.field.focus.ring.style}", color: "{form.field.focus.ring.color}", offset: "{form.field.focus.ring.offset}", shadow: "{form.field.focus.ring.shadow}" }, transitionDuration: "{form.field.transition.duration}", sm: { fontSize: "{form.field.sm.font.size}", paddingX: "{form.field.sm.padding.x}", paddingY: "{form.field.sm.padding.y}" }, lg: { fontSize: "{form.field.lg.font.size}", paddingX: "{form.field.lg.padding.x}", paddingY: "{form.field.lg.padding.y}" } }, Y$ = { width: "2.5rem", color: "{form.field.icon.color}" }, G$ = { background: "{overlay.select.background}", borderColor: "{overlay.select.border.color}", borderRadius: "{overlay.select.border.radius}", color: "{overlay.select.color}", shadow: "{overlay.select.shadow}" }, X$ = { padding: "{list.padding}", gap: "{list.gap}", mobileIndent: "1rem" }, Q$ = { focusBackground: "{list.option.focus.background}", selectedBackground: "{list.option.selected.background}", selectedFocusBackground: "{list.option.selected.focus.background}", color: "{list.option.color}", focusColor: "{list.option.focus.color}", selectedColor: "{list.option.selected.color}", selectedFocusColor: "{list.option.selected.focus.color}", padding: "{list.option.padding}", borderRadius: "{list.option.border.radius}", icon: { color: "{list.option.icon.color}", focusColor: "{list.option.icon.focus.color}", size: "0.875rem" } }, J$ = { color: "{form.field.icon.color}" }, q$ = { root: K$, dropdown: Y$, overlay: G$, list: X$, option: Q$, clearIcon: J$ }, Z$ = { borderRadius: "{border.radius.sm}", width: "1.25rem", height: "1.25rem", background: "{form.field.background}", checkedBackground: "{primary.color}", checkedHoverBackground: "{primary.hover.color}", disabledBackground: "{form.field.disabled.background}", filledBackground: "{form.field.filled.background}", borderColor: "{form.field.border.color}", hoverBorderColor: "{form.field.hover.border.color}", focusBorderColor: "{form.field.border.color}", checkedBorderColor: "{primary.color}", checkedHoverBorderColor: "{primary.hover.color}", checkedFocusBorderColor: "{primary.color}", checkedDisabledBorderColor: "{form.field.border.color}", invalidBorderColor: "{form.field.invalid.border.color}", shadow: "{form.field.shadow}", focusRing: { width: "{focus.ring.width}", style: "{focus.ring.style}", color: "{focus.ring.color}", offset: "{focus.ring.offset}", shadow: "{focus.ring.shadow}" }, transitionDuration: "{form.field.transition.duration}", sm: { width: "1rem", height: "1rem" }, lg: { width: "1.5rem", height: "1.5rem" } }, eE = { size: "0.875rem", color: "{form.field.color}", checkedColor: "{primary.contrast.color}", checkedHoverColor: "{primary.contrast.color}", disabledColor: "{form.field.disabled.color}", sm: { size: "0.75rem" }, lg: { size: "1rem" } }, tE = { root: Z$, icon: eE }, rE = { borderRadius: "16px", paddingX: "0.75rem", paddingY: "0.5rem", gap: "0.5rem", transitionDuration: "{transition.duration}" }, nE = { width: "2rem", height: "2rem" }, oE = { size: "1rem" }, iE = { size: "1rem", focusRing: { width: "{focus.ring.width}", style: "{focus.ring.style}", color: "{focus.ring.color}", offset: "{focus.ring.offset}", shadow: "{form.field.focus.ring.shadow}" } }, lE = { light: { root: { background: "{surface.100}", color: "{surface.800}" }, icon: { color: "{surface.800}" }, removeIcon: { color: "{surface.800}" } }, dark: { root: { background: "{surface.800}", color: "{surface.0}" }, icon: { color: "{surface.0}" }, removeIcon: { color: "{surface.0}" } } }, aE = { root: rE, image: nE, icon: oE, removeIcon: iE, colorScheme: lE }, sE = { transitionDuration: "{transition.duration}" }, uE = { width: "1.5rem", height: "1.5rem", borderRadius: "{form.field.border.radius}", focusRing: { width: "{focus.ring.width}", style: "{focus.ring.style}", color: "{focus.ring.color}", offset: "{focus.ring.offset}", shadow: "{focus.ring.shadow}" } }, cE = { shadow: "{overlay.popover.shadow}", borderRadius: "{overlay.popover.borderRadius}" }, dE = { light: { panel: { background: "{surface.800}", borderColor: "{surface.900}" }, handle: { color: "{surface.0}" } }, dark: { panel: { background: "{surface.900}", borderColor: "{surface.700}" }, handle: { color: "{surface.0}" } } }, fE = { root: sE, preview: uE, panel: cE, colorScheme: dE }, pE = { size: "2rem", color: "{overlay.modal.color}" }, gE = { gap: "1rem" }, hE = { icon: pE, content: gE }, mE = { background: "{overlay.popover.background}", borderColor: "{overlay.popover.border.color}", color: "{overlay.popover.color}", borderRadius: "{overlay.popover.border.radius}", shadow: "{overlay.popover.shadow}", gutter: "10px", arrowOffset: "1.25rem" }, vE = { padding: "{overlay.popover.padding}", gap: "1rem" }, bE = { size: "1.5rem", color: "{overlay.popover.color}" }, yE = { gap: "0.5rem", padding: "0 {overlay.popover.padding} {overlay.popover.padding} {overlay.popover.padding}" }, _E = { root: mE, content: vE, icon: bE, footer: yE }, kE = { background: "{content.background}", borderColor: "{content.border.color}", color: "{content.color}", borderRadius: "{content.border.radius}", shadow: "{overlay.navigation.shadow}", transitionDuration: "{transition.duration}" }, wE = { padding: "{navigation.list.padding}", gap: "{navigation.list.gap}" }, SE = { focusBackground: "{navigation.item.focus.background}", activeBackground: "{navigation.item.active.background}", color: "{navigation.item.color}", focusColor: "{navigation.item.focus.color}", activeColor: "{navigation.item.active.color}", padding: "{navigation.item.padding}", borderRadius: "{navigation.item.border.radius}", gap: "{navigation.item.gap}", icon: { color: "{navigation.item.icon.color}", focusColor: "{navigation.item.icon.focus.color}", activeColor: "{navigation.item.icon.active.color}" } }, CE = { mobileIndent: "1rem" }, xE = { size: "{navigation.submenu.icon.size}", color: "{navigation.submenu.icon.color}", focusColor: "{navigation.submenu.icon.focus.color}", activeColor: "{navigation.submenu.icon.active.color}" }, $E = { borderColor: "{content.border.color}" }, EE = { root: kE, list: wE, item: SE, submenu: CE, submenuIcon: xE, separator: $E }, TE = { transitionDuration: "{transition.duration}" }, OE = { background: "{content.background}", borderColor: "{datatable.border.color}", color: "{content.color}", borderWidth: "0 0 1px 0", padding: "0.75rem 1rem", sm: { padding: "0.375rem 0.5rem" }, lg: { padding: "1rem 1.25rem" } }, LE = { background: "{content.background}", hoverBackground: "{content.hover.background}", selectedBackground: "{highlight.background}", borderColor: "{datatable.border.color}", color: "{content.color}", hoverColor: "{content.hover.color}", selectedColor: "{highlight.color}", gap: "0.5rem", padding: "0.75rem 1rem", focusRing: { width: "{focus.ring.width}", style: "{focus.ring.style}", color: "{focus.ring.color}", offset: "-1px", shadow: "{focus.ring.shadow}" }, sm: { padding: "0.375rem 0.5rem" }, lg: { padding: "1rem 1.25rem" } }, PE = { fontWeight: "600" }, NE = { background: "{content.background}", hoverBackground: "{content.hover.background}", selectedBackground: "{highlight.background}", color: "{content.color}", hoverColor: "{content.hover.color}", selectedColor: "{highlight.color}", focusRing: { width: "{focus.ring.width}", style: "{focus.ring.style}", color: "{focus.ring.color}", offset: "-1px", shadow: "{focus.ring.shadow}" } }, RE = { borderColor: "{datatable.border.color}", padding: "0.75rem 1rem", sm: { padding: "0.375rem 0.5rem" }, lg: { padding: "1rem 1.25rem" } }, IE = { background: "{content.background}", borderColor: "{datatable.border.color}", color: "{content.color}", padding: "0.75rem 1rem", sm: { padding: "0.375rem 0.5rem" }, lg: { padding: "1rem 1.25rem" } }, AE = { fontWeight: "600" }, BE = { background: "{content.background}", borderColor: "{datatable.border.color}", color: "{content.color}", borderWidth: "0 0 1px 0", padding: "0.75rem 1rem", sm: { padding: "0.375rem 0.5rem" }, lg: { padding: "1rem 1.25rem" } }, DE = { color: "{primary.color}" }, ME = { width: "0.5rem" }, jE = { width: "1px", color: "{primary.color}" }, FE = { color: "{text.muted.color}", hoverColor: "{text.hover.muted.color}", size: "0.875rem" }, zE = { size: "2rem" }, UE = { hoverBackground: "{content.hover.background}", selectedHoverBackground: "{content.background}", color: "{text.muted.color}", hoverColor: "{text.color}", selectedHoverColor: "{primary.color}", size: "1.75rem", borderRadius: "50%", focusRing: { width: "{focus.ring.width}", style: "{focus.ring.style}", color: "{focus.ring.color}", offset: "{focus.ring.offset}", shadow: "{focus.ring.shadow}" } }, WE = { inlineGap: "0.5rem", overlaySelect: { background: "{overlay.select.background}", borderColor: "{overlay.select.border.color}", borderRadius: "{overlay.select.border.radius}", color: "{overlay.select.color}", shadow: "{overlay.select.shadow}" }, overlayPopover: { background: "{overlay.popover.background}", borderColor: "{overlay.popover.border.color}", borderRadius: "{overlay.popover.border.radius}", color: "{overlay.popover.color}", shadow: "{overlay.popover.shadow}", padding: "{overlay.popover.padding}", gap: "0.5rem" }, rule: { borderColor: "{content.border.color}" }, constraintList: { padding: "{list.padding}", gap: "{list.gap}" }, constraint: { focusBackground: "{list.option.focus.background}", selectedBackground: "{list.option.selected.background}", selectedFocusBackground: "{list.option.selected.focus.background}", color: "{list.option.color}", focusColor: "{list.option.focus.color}", selectedColor: "{list.option.selected.color}", selectedFocusColor: "{list.option.selected.focus.color}", separator: { borderColor: "{content.border.color}" }, padding: "{list.option.padding}", borderRadius: "{list.option.border.radius}" } }, VE = { borderColor: "{datatable.border.color}", borderWidth: "0 0 1px 0" }, HE = { borderColor: "{datatable.border.color}", borderWidth: "0 0 1px 0" }, KE = { light: { root: { borderColor: "{content.border.color}" }, row: { stripedBackground: "{surface.50}" }, bodyCell: { selectedBorderColor: "{primary.100}" } }, dark: { root: { borderColor: "{surface.800}" }, row: { stripedBackground: "{surface.950}" }, bodyCell: { selectedBorderColor: "{primary.900}" } } }, YE = { root: TE, header: OE, headerCell: LE, columnTitle: PE, row: NE, bodyCell: RE, footerCell: IE, columnFooter: AE, footer: BE, dropPoint: DE, columnResizer: ME, resizeIndicator: jE, sortIcon: FE, loadingIcon: zE, rowToggleButton: UE, filter: WE, paginatorTop: VE, paginatorBottom: HE, colorScheme: KE }, GE = { borderColor: "transparent", borderWidth: "0", borderRadius: "0", padding: "0" }, XE = { background: "{content.background}", color: "{content.color}", borderColor: "{content.border.color}", borderWidth: "0 0 1px 0", padding: "0.75rem 1rem", borderRadius: "0" }, QE = { background: "{content.background}", color: "{content.color}", borderColor: "transparent", borderWidth: "0", padding: "0", borderRadius: "0" }, JE = { background: "{content.background}", color: "{content.color}", borderColor: "{content.border.color}", borderWidth: "1px 0 0 0", padding: "0.75rem 1rem", borderRadius: "0" }, qE = { borderColor: "{content.border.color}", borderWidth: "0 0 1px 0" }, ZE = { borderColor: "{content.border.color}", borderWidth: "1px 0 0 0" }, e5 = { root: GE, header: XE, content: QE, footer: JE, paginatorTop: qE, paginatorBottom: ZE }, t5 = { transitionDuration: "{transition.duration}" }, r5 = { background: "{content.background}", borderColor: "{content.border.color}", color: "{content.color}", borderRadius: "{content.border.radius}", shadow: "{overlay.popover.shadow}", padding: "{overlay.popover.padding}" }, n5 = { background: "{content.background}", borderColor: "{content.border.color}", color: "{content.color}", padding: "0 0 0.5rem 0" }, o5 = { gap: "0.5rem", fontWeight: "500" }, i5 = { width: "2.5rem", sm: { width: "2rem" }, lg: { width: "3rem" }, borderColor: "{form.field.border.color}", hoverBorderColor: "{form.field.border.color}", activeBorderColor: "{form.field.border.color}", borderRadius: "{form.field.border.radius}", focusRing: { width: "{focus.ring.width}", style: "{focus.ring.style}", color: "{focus.ring.color}", offset: "{focus.ring.offset}", shadow: "{focus.ring.shadow}" } }, l5 = { color: "{form.field.icon.color}" }, a5 = { hoverBackground: "{content.hover.background}", color: "{content.color}", hoverColor: "{content.hover.color}", padding: "0.25rem 0.5rem", borderRadius: "{content.border.radius}" }, s5 = { hoverBackground: "{content.hover.background}", color: "{content.color}", hoverColor: "{content.hover.color}", padding: "0.25rem 0.5rem", borderRadius: "{content.border.radius}" }, u5 = { borderColor: "{content.border.color}", gap: "{overlay.popover.padding}" }, c5 = { margin: "0.5rem 0 0 0" }, d5 = { padding: "0.25rem", fontWeight: "500", color: "{content.color}" }, f5 = { hoverBackground: "{content.hover.background}", selectedBackground: "{primary.color}", rangeSelectedBackground: "{highlight.background}", color: "{content.color}", hoverColor: "{content.hover.color}", selectedColor: "{primary.contrast.color}", rangeSelectedColor: "{highlight.color}", width: "2rem", height: "2rem", borderRadius: "50%", padding: "0.25rem", focusRing: { width: "{focus.ring.width}", style: "{focus.ring.style}", color: "{focus.ring.color}", offset: "{focus.ring.offset}", shadow: "{focus.ring.shadow}" } }, p5 = { margin: "0.5rem 0 0 0" }, g5 = { padding: "0.375rem", borderRadius: "{content.border.radius}" }, h5 = { margin: "0.5rem 0 0 0" }, m5 = { padding: "0.375rem", borderRadius: "{content.border.radius}" }, v5 = { padding: "0.5rem 0 0 0", borderColor: "{content.border.color}" }, b5 = { padding: "0.5rem 0 0 0", borderColor: "{content.border.color}", gap: "0.5rem", buttonGap: "0.25rem" }, y5 = { light: { dropdown: { background: "{surface.100}", hoverBackground: "{surface.200}", activeBackground: "{surface.300}", color: "{surface.600}", hoverColor: "{surface.700}", activeColor: "{surface.800}" }, today: { background: "{surface.200}", color: "{surface.900}" } }, dark: { dropdown: { background: "{surface.800}", hoverBackground: "{surface.700}", activeBackground: "{surface.600}", color: "{surface.300}", hoverColor: "{surface.200}", activeColor: "{surface.100}" }, today: { background: "{surface.700}", color: "{surface.0}" } } }, _5 = { root: t5, panel: r5, header: n5, title: o5, dropdown: i5, inputIcon: l5, selectMonth: a5, selectYear: s5, group: u5, dayView: c5, weekDay: d5, date: f5, monthView: p5, month: g5, yearView: h5, year: m5, buttonbar: v5, timePicker: b5, colorScheme: y5 }, k5 = { background: "{overlay.modal.background}", borderColor: "{overlay.modal.border.color}", color: "{overlay.modal.color}", borderRadius: "{overlay.modal.border.radius}", shadow: "{overlay.modal.shadow}" }, w5 = { padding: "{overlay.modal.padding}", gap: "0.5rem" }, S5 = { fontSize: "1.25rem", fontWeight: "600" }, C5 = { padding: "0 {overlay.modal.padding} {overlay.modal.padding} {overlay.modal.padding}" }, x5 = { padding: "0 {overlay.modal.padding} {overlay.modal.padding} {overlay.modal.padding}", gap: "0.5rem" }, $5 = { root: k5, header: w5, title: S5, content: C5, footer: x5 }, E5 = { borderColor: "{content.border.color}" }, T5 = { background: "{content.background}", color: "{text.color}" }, O5 = { margin: "1rem 0", padding: "0 1rem", content: { padding: "0 0.5rem" } }, L5 = { margin: "0 1rem", padding: "0.5rem 0", content: { padding: "0.5rem 0" } }, P5 = { root: E5, content: T5, horizontal: O5, vertical: L5 }, N5 = { background: "rgba(255, 255, 255, 0.1)", borderColor: "rgba(255, 255, 255, 0.2)", padding: "0.5rem", borderRadius: "{border.radius.xl}" }, R5 = { borderRadius: "{content.border.radius}", padding: "0.5rem", size: "3rem", focusRing: { width: "{focus.ring.width}", style: "{focus.ring.style}", color: "{focus.ring.color}", offset: "{focus.ring.offset}", shadow: "{focus.ring.shadow}" } }, I5 = { root: N5, item: R5 }, A5 = { background: "{overlay.modal.background}", borderColor: "{overlay.modal.border.color}", color: "{overlay.modal.color}", shadow: "{overlay.modal.shadow}" }, B5 = { padding: "{overlay.modal.padding}" }, D5 = { fontSize: "1.5rem", fontWeight: "600" }, M5 = { padding: "0 {overlay.modal.padding} {overlay.modal.padding} {overlay.modal.padding}" }, j5 = { padding: "{overlay.modal.padding}" }, F5 = { root: A5, header: B5, title: D5, content: M5, footer: j5 }, z5 = { background: "{content.background}", borderColor: "{content.border.color}", borderRadius: "{content.border.radius}" }, U5 = { color: "{text.muted.color}", hoverColor: "{text.color}", activeColor: "{primary.color}" }, W5 = { background: "{overlay.select.background}", borderColor: "{overlay.select.border.color}", borderRadius: "{overlay.select.border.radius}", color: "{overlay.select.color}", shadow: "{overlay.select.shadow}", padding: "{list.padding}" }, V5 = { focusBackground: "{list.option.focus.background}", color: "{list.option.color}", focusColor: "{list.option.focus.color}", padding: "{list.option.padding}", borderRadius: "{list.option.border.radius}" }, H5 = { background: "{content.background}", borderColor: "{content.border.color}", color: "{content.color}", borderRadius: "{content.border.radius}" }, K5 = { toolbar: z5, toolbarItem: U5, overlay: W5, overlayOption: V5, content: H5 }, Y5 = { background: "{content.background}", borderColor: "{content.border.color}", borderRadius: "{content.border.radius}", color: "{content.color}", padding: "0 1.125rem 1.125rem 1.125rem", transitionDuration: "{transition.duration}" }, G5 = { background: "{content.background}", hoverBackground: "{content.hover.background}", color: "{content.color}", hoverColor: "{content.hover.color}", borderRadius: "{content.border.radius}", borderWidth: "1px", borderColor: "transparent", padding: "0.5rem 0.75rem", gap: "0.5rem", fontWeight: "600", focusRing: { width: "{focus.ring.width}", style: "{focus.ring.style}", color: "{focus.ring.color}", offset: "{focus.ring.offset}", shadow: "{focus.ring.shadow}" } }, X5 = { color: "{text.muted.color}", hoverColor: "{text.hover.muted.color}" }, Q5 = { padding: "0" }, J5 = { root: Y5, legend: G5, toggleIcon: X5, content: Q5 }, q5 = { background: "{content.background}", borderColor: "{content.border.color}", color: "{content.color}", borderRadius: "{content.border.radius}", transitionDuration: "{transition.duration}" }, Z5 = { background: "transparent", color: "{text.color}", padding: "1.125rem", borderColor: "unset", borderWidth: "0", borderRadius: "0", gap: "0.5rem" }, e2 = { highlightBorderColor: "{primary.color}", padding: "0 1.125rem 1.125rem 1.125rem", gap: "1rem" }, t2 = { padding: "1rem", gap: "1rem", borderColor: "{content.border.color}", info: { gap: "0.5rem" } }, r2 = { gap: "0.5rem" }, n2 = { height: "0.25rem" }, o2 = { gap: "0.5rem" }, i2 = { root: q5, header: Z5, content: e2, file: t2, fileList: r2, progressbar: n2, basic: o2 }, l2 = { color: "{form.field.float.label.color}", focusColor: "{form.field.float.label.focus.color}", activeColor: "{form.field.float.label.active.color}", invalidColor: "{form.field.float.label.invalid.color}", transitionDuration: "0.2s", positionX: "{form.field.padding.x}", positionY: "{form.field.padding.y}", fontWeight: "500", active: { fontSize: "0.75rem", fontWeight: "400" } }, a2 = { active: { top: "-1.25rem" } }, s2 = { input: { paddingTop: "1.5rem", paddingBottom: "{form.field.padding.y}" }, active: { top: "{form.field.padding.y}" } }, u2 = { borderRadius: "{border.radius.xs}", active: { background: "{form.field.background}", padding: "0 0.125rem" } }, c2 = { root: l2, over: a2, in: s2, on: u2 }, d2 = { borderWidth: "1px", borderColor: "{content.border.color}", borderRadius: "{content.border.radius}", transitionDuration: "{transition.duration}" }, f2 = { background: "rgba(255, 255, 255, 0.1)", hoverBackground: "rgba(255, 255, 255, 0.2)", color: "{surface.100}", hoverColor: "{surface.0}", size: "3rem", gutter: "0.5rem", prev: { borderRadius: "50%" }, next: { borderRadius: "50%" }, focusRing: { width: "{focus.ring.width}", style: "{focus.ring.style}", color: "{focus.ring.color}", offset: "{focus.ring.offset}", shadow: "{focus.ring.shadow}" } }, p2 = { size: "1.5rem" }, g2 = { background: "{content.background}", padding: "1rem 0.25rem" }, h2 = { size: "2rem", borderRadius: "{content.border.radius}", gutter: "0.5rem", focusRing: { width: "{focus.ring.width}", style: "{focus.ring.style}", color: "{focus.ring.color}", offset: "{focus.ring.offset}", shadow: "{focus.ring.shadow}" } }, m2 = { size: "1rem" }, v2 = { background: "rgba(0, 0, 0, 0.5)", color: "{surface.100}", padding: "1rem" }, b2 = { gap: "0.5rem", padding: "1rem" }, y2 = { width: "1rem", height: "1rem", activeBackground: "{primary.color}", borderRadius: "50%", focusRing: { width: "{focus.ring.width}", style: "{focus.ring.style}", color: "{focus.ring.color}", offset: "{focus.ring.offset}", shadow: "{focus.ring.shadow}" } }, _2 = { background: "rgba(0, 0, 0, 0.5)" }, k2 = { background: "rgba(255, 255, 255, 0.4)", hoverBackground: "rgba(255, 255, 255, 0.6)", activeBackground: "rgba(255, 255, 255, 0.9)" }, w2 = { size: "3rem", gutter: "0.5rem", background: "rgba(255, 255, 255, 0.1)", hoverBackground: "rgba(255, 255, 255, 0.2)", color: "{surface.50}", hoverColor: "{surface.0}", borderRadius: "50%", focusRing: { width: "{focus.ring.width}", style: "{focus.ring.style}", color: "{focus.ring.color}", offset: "{focus.ring.offset}", shadow: "{focus.ring.shadow}" } }, S2 = { size: "1.5rem" }, C2 = { light: { thumbnailNavButton: { hoverBackground: "{surface.100}", color: "{surface.600}", hoverColor: "{surface.700}" }, indicatorButton: { background: "{surface.200}", hoverBackground: "{surface.300}" } }, dark: { thumbnailNavButton: { hoverBackground: "{surface.700}", color: "{surface.400}", hoverColor: "{surface.0}" }, indicatorButton: { background: "{surface.700}", hoverBackground: "{surface.600}" } } }, x2 = { root: d2, navButton: f2, navIcon: p2, thumbnailsContent: g2, thumbnailNavButton: h2, thumbnailNavButtonIcon: m2, caption: v2, indicatorList: b2, indicatorButton: y2, insetIndicatorList: _2, insetIndicatorButton: k2, closeButton: w2, closeButtonIcon: S2, colorScheme: C2 }, $2 = { color: "{form.field.icon.color}" }, E2 = { icon: $2 }, T2 = { color: "{form.field.float.label.color}", focusColor: "{form.field.float.label.focus.color}", invalidColor: "{form.field.float.label.invalid.color}", transitionDuration: "0.2s", positionX: "{form.field.padding.x}", top: "{form.field.padding.y}", fontSize: "0.75rem", fontWeight: "400" }, O2 = { paddingTop: "1.5rem", paddingBottom: "{form.field.padding.y}" }, L2 = { root: T2, input: O2 }, P2 = { transitionDuration: "{transition.duration}" }, N2 = { icon: { size: "1.5rem" }, mask: { background: "{mask.background}", color: "{mask.color}" } }, R2 = { position: { left: "auto", right: "1rem", top: "1rem", bottom: "auto" }, blur: "8px", background: "rgba(255,255,255,0.1)", borderColor: "rgba(255,255,255,0.2)", borderWidth: "1px", borderRadius: "30px", padding: ".5rem", gap: "0.5rem" }, I2 = { hoverBackground: "rgba(255,255,255,0.1)", color: "{surface.50}", hoverColor: "{surface.0}", size: "3rem", iconSize: "1.5rem", borderRadius: "50%", focusRing: { width: "{focus.ring.width}", style: "{focus.ring.style}", color: "{focus.ring.color}", offset: "{focus.ring.offset}", shadow: "{focus.ring.shadow}" } }, A2 = { root: P2, preview: N2, toolbar: R2, action: I2 }, B2 = { size: "15px", hoverSize: "30px", background: "rgba(255,255,255,0.3)", hoverBackground: "rgba(255,255,255,0.3)", borderColor: "unset", hoverBorderColor: "unset", borderWidth: "0", borderRadius: "50%", transitionDuration: "{transition.duration}", focusRing: { width: "{focus.ring.width}", style: "{focus.ring.style}", color: "rgba(255,255,255,0.3)", offset: "{focus.ring.offset}", shadow: "{focus.ring.shadow}" } }, D2 = { handle: B2 }, M2 = { padding: "{form.field.padding.y} {form.field.padding.x}", borderRadius: "{content.border.radius}", gap: "0.5rem" }, j2 = { fontWeight: "500" }, F2 = { size: "1rem" }, z2 = { light: { info: { background: "color-mix(in srgb, {blue.50}, transparent 5%)", borderColor: "{blue.200}", color: "{blue.600}", shadow: "0px 4px 8px 0px color-mix(in srgb, {blue.500}, transparent 96%)" }, success: { background: "color-mix(in srgb, {green.50}, transparent 5%)", borderColor: "{green.200}", color: "{green.600}", shadow: "0px 4px 8px 0px color-mix(in srgb, {green.500}, transparent 96%)" }, warn: { background: "color-mix(in srgb,{yellow.50}, transparent 5%)", borderColor: "{yellow.200}", color: "{yellow.600}", shadow: "0px 4px 8px 0px color-mix(in srgb, {yellow.500}, transparent 96%)" }, error: { background: "color-mix(in srgb, {red.50}, transparent 5%)", borderColor: "{red.200}", color: "{red.600}", shadow: "0px 4px 8px 0px color-mix(in srgb, {red.500}, transparent 96%)" }, secondary: { background: "{surface.100}", borderColor: "{surface.200}", color: "{surface.600}", shadow: "0px 4px 8px 0px color-mix(in srgb, {surface.500}, transparent 96%)" }, contrast: { background: "{surface.900}", borderColor: "{surface.950}", color: "{surface.50}", shadow: "0px 4px 8px 0px color-mix(in srgb, {surface.950}, transparent 96%)" } }, dark: { info: { background: "color-mix(in srgb, {blue.500}, transparent 84%)", borderColor: "color-mix(in srgb, {blue.700}, transparent 64%)", color: "{blue.500}", shadow: "0px 4px 8px 0px color-mix(in srgb, {blue.500}, transparent 96%)" }, success: { background: "color-mix(in srgb, {green.500}, transparent 84%)", borderColor: "color-mix(in srgb, {green.700}, transparent 64%)", color: "{green.500}", shadow: "0px 4px 8px 0px color-mix(in srgb, {green.500}, transparent 96%)" }, warn: { background: "color-mix(in srgb, {yellow.500}, transparent 84%)", borderColor: "color-mix(in srgb, {yellow.700}, transparent 64%)", color: "{yellow.500}", shadow: "0px 4px 8px 0px color-mix(in srgb, {yellow.500}, transparent 96%)" }, error: { background: "color-mix(in srgb, {red.500}, transparent 84%)", borderColor: "color-mix(in srgb, {red.700}, transparent 64%)", color: "{red.500}", shadow: "0px 4px 8px 0px color-mix(in srgb, {red.500}, transparent 96%)" }, secondary: { background: "{surface.800}", borderColor: "{surface.700}", color: "{surface.300}", shadow: "0px 4px 8px 0px color-mix(in srgb, {surface.500}, transparent 96%)" }, contrast: { background: "{surface.0}", borderColor: "{surface.100}", color: "{surface.950}", shadow: "0px 4px 8px 0px color-mix(in srgb, {surface.950}, transparent 96%)" } } }, U2 = { root: M2, text: j2, icon: F2, colorScheme: z2 }, W2 = { padding: "{form.field.padding.y} {form.field.padding.x}", borderRadius: "{content.border.radius}", focusRing: { width: "{focus.ring.width}", style: "{focus.ring.style}", color: "{focus.ring.color}", offset: "{focus.ring.offset}", shadow: "{focus.ring.shadow}" }, transitionDuration: "{transition.duration}" }, V2 = { hoverBackground: "{content.hover.background}", hoverColor: "{content.hover.color}" }, H2 = { root: W2, display: V2 }, K2 = { background: "{form.field.background}", disabledBackground: "{form.field.disabled.background}", filledBackground: "{form.field.filled.background}", filledFocusBackground: "{form.field.filled.focus.background}", borderColor: "{form.field.border.color}", hoverBorderColor: "{form.field.hover.border.color}", focusBorderColor: "{form.field.focus.border.color}", invalidBorderColor: "{form.field.invalid.border.color}", color: "{form.field.color}", disabledColor: "{form.field.disabled.color}", placeholderColor: "{form.field.placeholder.color}", shadow: "{form.field.shadow}", paddingX: "{form.field.padding.x}", paddingY: "{form.field.padding.y}", borderRadius: "{form.field.border.radius}", focusRing: { width: "{form.field.focus.ring.width}", style: "{form.field.focus.ring.style}", color: "{form.field.focus.ring.color}", offset: "{form.field.focus.ring.offset}", shadow: "{form.field.focus.ring.shadow}" }, transitionDuration: "{form.field.transition.duration}" }, Y2 = { borderRadius: "{border.radius.sm}" }, G2 = { light: { chip: { focusBackground: "{surface.200}", color: "{surface.800}" } }, dark: { chip: { focusBackground: "{surface.700}", color: "{surface.0}" } } }, X2 = { root: K2, chip: Y2, colorScheme: G2 }, Q2 = { background: "{form.field.background}", borderColor: "{form.field.border.color}", color: "{form.field.icon.color}", borderRadius: "{form.field.border.radius}", padding: "0.5rem", minWidth: "2.5rem" }, J2 = { addon: Q2 }, q2 = { transitionDuration: "{transition.duration}" }, Z2 = { width: "2.5rem", borderRadius: "{form.field.border.radius}", verticalPadding: "{form.field.padding.y}" }, eT = { light: { button: { background: "transparent", hoverBackground: "{surface.100}", activeBackground: "{surface.200}", borderColor: "{form.field.border.color}", hoverBorderColor: "{form.field.border.color}", activeBorderColor: "{form.field.border.color}", color: "{surface.400}", hoverColor: "{surface.500}", activeColor: "{surface.600}" } }, dark: { button: { background: "transparent", hoverBackground: "{surface.800}", activeBackground: "{surface.700}", borderColor: "{form.field.border.color}", hoverBorderColor: "{form.field.border.color}", activeBorderColor: "{form.field.border.color}", color: "{surface.400}", hoverColor: "{surface.300}", activeColor: "{surface.200}" } } }, tT = { root: q2, button: Z2, colorScheme: eT }, rT = { gap: "0.5rem" }, nT = { width: "2.5rem", sm: { width: "2rem" }, lg: { width: "3rem" } }, oT = { root: rT, input: nT }, iT = { background: "{form.field.background}", disabledBackground: "{form.field.disabled.background}", filledBackground: "{form.field.filled.background}", filledHoverBackground: "{form.field.filled.hover.background}", filledFocusBackground: "{form.field.filled.focus.background}", borderColor: "{form.field.border.color}", hoverBorderColor: "{form.field.hover.border.color}", focusBorderColor: "{form.field.focus.border.color}", invalidBorderColor: "{form.field.invalid.border.color}", color: "{form.field.color}", disabledColor: "{form.field.disabled.color}", placeholderColor: "{form.field.placeholder.color}", invalidPlaceholderColor: "{form.field.invalid.placeholder.color}", shadow: "{form.field.shadow}", paddingX: "{form.field.padding.x}", paddingY: "{form.field.padding.y}", borderRadius: "{form.field.border.radius}", focusRing: { width: "{form.field.focus.ring.width}", style: "{form.field.focus.ring.style}", color: "{form.field.focus.ring.color}", offset: "{form.field.focus.ring.offset}", shadow: "{form.field.focus.ring.shadow}" }, transitionDuration: "{form.field.transition.duration}", sm: { fontSize: "{form.field.sm.font.size}", paddingX: "{form.field.sm.padding.x}", paddingY: "{form.field.sm.padding.y}" }, lg: { fontSize: "{form.field.lg.font.size}", paddingX: "{form.field.lg.padding.x}", paddingY: "{form.field.lg.padding.y}" } }, lT = { root: iT }, aT = { transitionDuration: "{transition.duration}", focusRing: { width: "{focus.ring.width}", style: "{focus.ring.style}", color: "{focus.ring.color}", offset: "{focus.ring.offset}", shadow: "{focus.ring.shadow}" } }, sT = { background: "{primary.color}" }, uT = { background: "{content.border.color}" }, cT = { color: "{text.muted.color}" }, dT = { root: aT, value: sT, range: uT, text: cT }, fT = { background: "{form.field.background}", disabledBackground: "{form.field.disabled.background}", borderColor: "{form.field.border.color}", invalidBorderColor: "{form.field.invalid.border.color}", color: "{form.field.color}", disabledColor: "{form.field.disabled.color}", shadow: "{form.field.shadow}", borderRadius: "{form.field.border.radius}", transitionDuration: "{form.field.transition.duration}" }, pT = { padding: "{list.padding}", gap: "{list.gap}", header: { padding: "{list.header.padding}" } }, gT = { focusBackground: "{list.option.focus.background}", selectedBackground: "{list.option.selected.background}", selectedFocusBackground: "{list.option.selected.focus.background}", color: "{list.option.color}", focusColor: "{list.option.focus.color}", selectedColor: "{list.option.selected.color}", selectedFocusColor: "{list.option.selected.focus.color}", padding: "{list.option.padding}", borderRadius: "{list.option.border.radius}" }, hT = { background: "{list.option.group.background}", color: "{list.option.group.color}", fontWeight: "{list.option.group.font.weight}", padding: "{list.option.group.padding}" }, mT = { color: "{list.option.color}", gutterStart: "-0.375rem", gutterEnd: "0.375rem" }, vT = { padding: "{list.option.padding}" }, bT = { light: { option: { stripedBackground: "{surface.50}" } }, dark: { option: { stripedBackground: "{surface.900}" } } }, yT = { root: fT, list: pT, option: gT, optionGroup: hT, checkmark: mT, emptyMessage: vT, colorScheme: bT }, _T = { background: "{content.background}", borderColor: "{content.border.color}", borderRadius: "{content.border.radius}", color: "{content.color}", gap: "0.5rem", verticalOrientation: { padding: "{navigation.list.padding}", gap: "{navigation.list.gap}" }, horizontalOrientation: { padding: "0.5rem 0.75rem", gap: "0.5rem" }, transitionDuration: "{transition.duration}" }, kT = { borderRadius: "{content.border.radius}", padding: "{navigation.item.padding}" }, wT = { focusBackground: "{navigation.item.focus.background}", activeBackground: "{navigation.item.active.background}", color: "{navigation.item.color}", focusColor: "{navigation.item.focus.color}", activeColor: "{navigation.item.active.color}", padding: "{navigation.item.padding}", borderRadius: "{navigation.item.border.radius}", gap: "{navigation.item.gap}", icon: { color: "{navigation.item.icon.color}", focusColor: "{navigation.item.icon.focus.color}", activeColor: "{navigation.item.icon.active.color}" } }, ST = { padding: "0", background: "{content.background}", borderColor: "{content.border.color}", borderRadius: "{content.border.radius}", color: "{content.color}", shadow: "{overlay.navigation.shadow}", gap: "0.5rem" }, CT = { padding: "{navigation.list.padding}", gap: "{navigation.list.gap}" }, xT = { padding: "{navigation.submenu.label.padding}", fontWeight: "{navigation.submenu.label.font.weight}", background: "{navigation.submenu.label.background}", color: "{navigation.submenu.label.color}" }, $T = { size: "{navigation.submenu.icon.size}", color: "{navigation.submenu.icon.color}", focusColor: "{navigation.submenu.icon.focus.color}", activeColor: "{navigation.submenu.icon.active.color}" }, ET = { borderColor: "{content.border.color}" }, TT = { borderRadius: "50%", size: "1.75rem", color: "{text.muted.color}", hoverColor: "{text.hover.muted.color}", hoverBackground: "{content.hover.background}", focusRing: { width: "{focus.ring.width}", style: "{focus.ring.style}", color: "{focus.ring.color}", offset: "{focus.ring.offset}", shadow: "{focus.ring.shadow}" } }, OT = { root: _T, baseItem: kT, item: wT, overlay: ST, submenu: CT, submenuLabel: xT, submenuIcon: $T, separator: ET, mobileButton: TT }, LT = { background: "{content.background}", borderColor: "{content.border.color}", color: "{content.color}", borderRadius: "{content.border.radius}", shadow: "{overlay.navigation.shadow}", transitionDuration: "{transition.duration}" }, PT = { padding: "{navigation.list.padding}", gap: "{navigation.list.gap}" }, NT = { focusBackground: "{navigation.item.focus.background}", color: "{navigation.item.color}", focusColor: "{navigation.item.focus.color}", padding: "{navigation.item.padding}", borderRadius: "{navigation.item.border.radius}", gap: "{navigation.item.gap}", icon: { color: "{navigation.item.icon.color}", focusColor: "{navigation.item.icon.focus.color}" } }, RT = { padding: "{navigation.submenu.label.padding}", fontWeight: "{navigation.submenu.label.font.weight}", background: "{navigation.submenu.label.background}", color: "{navigation.submenu.label.color}" }, IT = { borderColor: "{content.border.color}" }, AT = { root: LT, list: PT, item: NT, submenuLabel: RT, separator: IT }, BT = { background: "{content.background}", borderColor: "{content.border.color}", borderRadius: "{content.border.radius}", color: "{content.color}", gap: "0.5rem", padding: "0.5rem 0.75rem", transitionDuration: "{transition.duration}" }, DT = { borderRadius: "{content.border.radius}", padding: "{navigation.item.padding}" }, MT = { focusBackground: "{navigation.item.focus.background}", activeBackground: "{navigation.item.active.background}", color: "{navigation.item.color}", focusColor: "{navigation.item.focus.color}", activeColor: "{navigation.item.active.color}", padding: "{navigation.item.padding}", borderRadius: "{navigation.item.border.radius}", gap: "{navigation.item.gap}", icon: { color: "{navigation.item.icon.color}", focusColor: "{navigation.item.icon.focus.color}", activeColor: "{navigation.item.icon.active.color}" } }, jT = { padding: "{navigation.list.padding}", gap: "{navigation.list.gap}", background: "{content.background}", borderColor: "{content.border.color}", borderRadius: "{content.border.radius}", shadow: "{overlay.navigation.shadow}", mobileIndent: "1rem", icon: { size: "{navigation.submenu.icon.size}", color: "{navigation.submenu.icon.color}", focusColor: "{navigation.submenu.icon.focus.color}", activeColor: "{navigation.submenu.icon.active.color}" } }, FT = { borderColor: "{content.border.color}" }, zT = { borderRadius: "50%", size: "1.75rem", color: "{text.muted.color}", hoverColor: "{text.hover.muted.color}", hoverBackground: "{content.hover.background}", focusRing: { width: "{focus.ring.width}", style: "{focus.ring.style}", color: "{focus.ring.color}", offset: "{focus.ring.offset}", shadow: "{focus.ring.shadow}" } }, UT = { root: BT, baseItem: DT, item: MT, submenu: jT, separator: FT, mobileButton: zT }, WT = { borderRadius: "{content.border.radius}", borderWidth: "1px", transitionDuration: "{transition.duration}" }, VT = { padding: "0.5rem 0.75rem", gap: "0.5rem", sm: { padding: "0.375rem 0.625rem" }, lg: { padding: "0.625rem 0.875rem" } }, HT = { fontSize: "1rem", fontWeight: "500", sm: { fontSize: "0.875rem" }, lg: { fontSize: "1.125rem" } }, KT = { size: "1.125rem", sm: { size: "1rem" }, lg: { size: "1.25rem" } }, YT = { width: "1.75rem", height: "1.75rem", borderRadius: "50%", focusRing: { width: "{focus.ring.width}", style: "{focus.ring.style}", offset: "{focus.ring.offset}" } }, GT = { size: "1rem", sm: { size: "0.875rem" }, lg: { size: "1.125rem" } }, XT = { root: { borderWidth: "1px" } }, QT = { content: { padding: "0" } }, JT = { light: { info: { background: "color-mix(in srgb, {blue.50}, transparent 5%)", borderColor: "{blue.200}", color: "{blue.600}", shadow: "0px 4px 8px 0px color-mix(in srgb, {blue.500}, transparent 96%)", closeButton: { hoverBackground: "{blue.100}", focusRing: { color: "{blue.600}", shadow: "none" } }, outlined: { color: "{blue.600}", borderColor: "{blue.600}" }, simple: { color: "{blue.600}" } }, success: { background: "color-mix(in srgb, {green.50}, transparent 5%)", borderColor: "{green.200}", color: "{green.600}", shadow: "0px 4px 8px 0px color-mix(in srgb, {green.500}, transparent 96%)", closeButton: { hoverBackground: "{green.100}", focusRing: { color: "{green.600}", shadow: "none" } }, outlined: { color: "{green.600}", borderColor: "{green.600}" }, simple: { color: "{green.600}" } }, warn: { background: "color-mix(in srgb,{yellow.50}, transparent 5%)", borderColor: "{yellow.200}", color: "{yellow.600}", shadow: "0px 4px 8px 0px color-mix(in srgb, {yellow.500}, transparent 96%)", closeButton: { hoverBackground: "{yellow.100}", focusRing: { color: "{yellow.600}", shadow: "none" } }, outlined: { color: "{yellow.600}", borderColor: "{yellow.600}" }, simple: { color: "{yellow.600}" } }, error: { background: "color-mix(in srgb, {red.50}, transparent 5%)", borderColor: "{red.200}", color: "{red.600}", shadow: "0px 4px 8px 0px color-mix(in srgb, {red.500}, transparent 96%)", closeButton: { hoverBackground: "{red.100}", focusRing: { color: "{red.600}", shadow: "none" } }, outlined: { color: "{red.600}", borderColor: "{red.600}" }, simple: { color: "{red.600}" } }, secondary: { background: "{surface.100}", borderColor: "{surface.200}", color: "{surface.600}", shadow: "0px 4px 8px 0px color-mix(in srgb, {surface.500}, transparent 96%)", closeButton: { hoverBackground: "{surface.200}", focusRing: { color: "{surface.600}", shadow: "none" } }, outlined: { color: "{surface.500}", borderColor: "{surface.500}" }, simple: { color: "{surface.500}" } }, contrast: { background: "{surface.900}", borderColor: "{surface.950}", color: "{surface.50}", shadow: "0px 4px 8px 0px color-mix(in srgb, {surface.950}, transparent 96%)", closeButton: { hoverBackground: "{surface.800}", focusRing: { color: "{surface.50}", shadow: "none" } }, outlined: { color: "{surface.950}", borderColor: "{surface.950}" }, simple: { color: "{surface.950}" } } }, dark: { info: { background: "color-mix(in srgb, {blue.500}, transparent 84%)", borderColor: "color-mix(in srgb, {blue.700}, transparent 64%)", color: "{blue.500}", shadow: "0px 4px 8px 0px color-mix(in srgb, {blue.500}, transparent 96%)", closeButton: { hoverBackground: "rgba(255, 255, 255, 0.05)", focusRing: { color: "{blue.500}", shadow: "none" } }, outlined: { color: "{blue.500}", borderColor: "{blue.500}" }, simple: { color: "{blue.500}" } }, success: { background: "color-mix(in srgb, {green.500}, transparent 84%)", borderColor: "color-mix(in srgb, {green.700}, transparent 64%)", color: "{green.500}", shadow: "0px 4px 8px 0px color-mix(in srgb, {green.500}, transparent 96%)", closeButton: { hoverBackground: "rgba(255, 255, 255, 0.05)", focusRing: { color: "{green.500}", shadow: "none" } }, outlined: { color: "{green.500}", borderColor: "{green.500}" }, simple: { color: "{green.500}" } }, warn: { background: "color-mix(in srgb, {yellow.500}, transparent 84%)", borderColor: "color-mix(in srgb, {yellow.700}, transparent 64%)", color: "{yellow.500}", shadow: "0px 4px 8px 0px color-mix(in srgb, {yellow.500}, transparent 96%)", closeButton: { hoverBackground: "rgba(255, 255, 255, 0.05)", focusRing: { color: "{yellow.500}", shadow: "none" } }, outlined: { color: "{yellow.500}", borderColor: "{yellow.500}" }, simple: { color: "{yellow.500}" } }, error: { background: "color-mix(in srgb, {red.500}, transparent 84%)", borderColor: "color-mix(in srgb, {red.700}, transparent 64%)", color: "{red.500}", shadow: "0px 4px 8px 0px color-mix(in srgb, {red.500}, transparent 96%)", closeButton: { hoverBackground: "rgba(255, 255, 255, 0.05)", focusRing: { color: "{red.500}", shadow: "none" } }, outlined: { color: "{red.500}", borderColor: "{red.500}" }, simple: { color: "{red.500}" } }, secondary: { background: "{surface.800}", borderColor: "{surface.700}", color: "{surface.300}", shadow: "0px 4px 8px 0px color-mix(in srgb, {surface.500}, transparent 96%)", closeButton: { hoverBackground: "{surface.700}", focusRing: { color: "{surface.300}", shadow: "none" } }, outlined: { color: "{surface.400}", borderColor: "{surface.400}" }, simple: { color: "{surface.400}" } }, contrast: { background: "{surface.0}", borderColor: "{surface.100}", color: "{surface.950}", shadow: "0px 4px 8px 0px color-mix(in srgb, {surface.950}, transparent 96%)", closeButton: { hoverBackground: "{surface.100}", focusRing: { color: "{surface.950}", shadow: "none" } }, outlined: { color: "{surface.0}", borderColor: "{surface.0}" }, simple: { color: "{surface.0}" } } } }, qT = { root: WT, content: VT, text: HT, icon: KT, closeButton: YT, closeIcon: GT, outlined: XT, simple: QT, colorScheme: JT }, ZT = { borderRadius: "{content.border.radius}", gap: "1rem" }, eO = { background: "{content.border.color}", size: "0.5rem" }, tO = { gap: "0.5rem" }, rO = { size: "0.5rem" }, nO = { size: "1rem" }, oO = { verticalGap: "0.5rem", horizontalGap: "1rem" }, iO = { root: ZT, meters: eO, label: tO, labelMarker: rO, labelIcon: nO, labelList: oO }, lO = { background: "{form.field.background}", disabledBackground: "{form.field.disabled.background}", filledBackground: "{form.field.filled.background}", filledHoverBackground: "{form.field.filled.hover.background}", filledFocusBackground: "{form.field.filled.focus.background}", borderColor: "{form.field.border.color}", hoverBorderColor: "{form.field.hover.border.color}", focusBorderColor: "{form.field.focus.border.color}", invalidBorderColor: "{form.field.invalid.border.color}", color: "{form.field.color}", disabledColor: "{form.field.disabled.color}", placeholderColor: "{form.field.placeholder.color}", invalidPlaceholderColor: "{form.field.invalid.placeholder.color}", shadow: "{form.field.shadow}", paddingX: "{form.field.padding.x}", paddingY: "{form.field.padding.y}", borderRadius: "{form.field.border.radius}", focusRing: { width: "{form.field.focus.ring.width}", style: "{form.field.focus.ring.style}", color: "{form.field.focus.ring.color}", offset: "{form.field.focus.ring.offset}", shadow: "{form.field.focus.ring.shadow}" }, transitionDuration: "{form.field.transition.duration}", sm: { fontSize: "{form.field.sm.font.size}", paddingX: "{form.field.sm.padding.x}", paddingY: "{form.field.sm.padding.y}" }, lg: { fontSize: "{form.field.lg.font.size}", paddingX: "{form.field.lg.padding.x}", paddingY: "{form.field.lg.padding.y}" } }, aO = { width: "2.5rem", color: "{form.field.icon.color}" }, sO = { background: "{overlay.select.background}", borderColor: "{overlay.select.border.color}", borderRadius: "{overlay.select.border.radius}", color: "{overlay.select.color}", shadow: "{overlay.select.shadow}" }, uO = { padding: "{list.padding}", gap: "{list.gap}", header: { padding: "{list.header.padding}" } }, cO = { focusBackground: "{list.option.focus.background}", selectedBackground: "{list.option.selected.background}", selectedFocusBackground: "{list.option.selected.focus.background}", color: "{list.option.color}", focusColor: "{list.option.focus.color}", selectedColor: "{list.option.selected.color}", selectedFocusColor: "{list.option.selected.focus.color}", padding: "{list.option.padding}", borderRadius: "{list.option.border.radius}", gap: "0.5rem" }, dO = { background: "{list.option.group.background}", color: "{list.option.group.color}", fontWeight: "{list.option.group.font.weight}", padding: "{list.option.group.padding}" }, fO = { color: "{form.field.icon.color}" }, pO = { borderRadius: "{border.radius.sm}" }, gO = { padding: "{list.option.padding}" }, hO = { root: lO, dropdown: aO, overlay: sO, list: uO, option: cO, optionGroup: dO, chip: pO, clearIcon: fO, emptyMessage: gO }, mO = { gap: "1.125rem" }, vO = { gap: "0.5rem" }, bO = { root: mO, controls: vO }, yO = { gutter: "0.75rem", transitionDuration: "{transition.duration}" }, _O = { background: "{content.background}", hoverBackground: "{content.hover.background}", selectedBackground: "{highlight.background}", borderColor: "{content.border.color}", color: "{content.color}", selectedColor: "{highlight.color}", hoverColor: "{content.hover.color}", padding: "0.75rem 1rem", toggleablePadding: "0.75rem 1rem 1.25rem 1rem", borderRadius: "{content.border.radius}" }, kO = { background: "{content.background}", hoverBackground: "{content.hover.background}", borderColor: "{content.border.color}", color: "{text.muted.color}", hoverColor: "{text.color}", size: "1.5rem", borderRadius: "50%", focusRing: { width: "{focus.ring.width}", style: "{focus.ring.style}", color: "{focus.ring.color}", offset: "{focus.ring.offset}", shadow: "{focus.ring.shadow}" } }, wO = { color: "{content.border.color}", borderRadius: "{content.border.radius}", height: "24px" }, SO = { root: yO, node: _O, nodeToggleButton: kO, connector: wO }, CO = { outline: { width: "2px", color: "{content.background}" } }, xO = { root: CO }, $O = { padding: "0.5rem 1rem", gap: "0.25rem", borderRadius: "{content.border.radius}", background: "{content.background}", color: "{content.color}", transitionDuration: "{transition.duration}" }, EO = { background: "transparent", hoverBackground: "{content.hover.background}", selectedBackground: "{highlight.background}", color: "{text.muted.color}", hoverColor: "{text.hover.muted.color}", selectedColor: "{highlight.color}", width: "2.5rem", height: "2.5rem", borderRadius: "50%", focusRing: { width: "{focus.ring.width}", style: "{focus.ring.style}", color: "{focus.ring.color}", offset: "{focus.ring.offset}", shadow: "{focus.ring.shadow}" } }, TO = { color: "{text.muted.color}" }, OO = { maxWidth: "2.5rem" }, LO = { root: $O, navButton: EO, currentPageReport: TO, jumpToPageInput: OO }, PO = { background: "{content.background}", borderColor: "{content.border.color}", color: "{content.color}", borderRadius: "{content.border.radius}" }, NO = { background: "transparent", color: "{text.color}", padding: "1.125rem", borderColor: "{content.border.color}", borderWidth: "0", borderRadius: "0" }, RO = { padding: "0.375rem 1.125rem" }, IO = { fontWeight: "600" }, AO = { padding: "0 1.125rem 1.125rem 1.125rem" }, BO = { padding: "0 1.125rem 1.125rem 1.125rem" }, DO = { root: PO, header: NO, toggleableHeader: RO, title: IO, content: AO, footer: BO }, MO = { gap: "0.5rem", transitionDuration: "{transition.duration}" }, jO = { background: "{content.background}", borderColor: "{content.border.color}", borderWidth: "1px", color: "{content.color}", padding: "0.25rem 0.25rem", borderRadius: "{content.border.radius}", first: { borderWidth: "1px", topBorderRadius: "{content.border.radius}" }, last: { borderWidth: "1px", bottomBorderRadius: "{content.border.radius}" } }, FO = { focusBackground: "{navigation.item.focus.background}", color: "{navigation.item.color}", focusColor: "{navigation.item.focus.color}", gap: "0.5rem", padding: "{navigation.item.padding}", borderRadius: "{content.border.radius}", icon: { color: "{navigation.item.icon.color}", focusColor: "{navigation.item.icon.focus.color}" } }, zO = { indent: "1rem" }, UO = { color: "{navigation.submenu.icon.color}", focusColor: "{navigation.submenu.icon.focus.color}" }, WO = { root: MO, panel: jO, item: FO, submenu: zO, submenuIcon: UO }, VO = { background: "{content.border.color}", borderRadius: "{content.border.radius}", height: ".75rem" }, HO = { color: "{form.field.icon.color}" }, KO = { background: "{overlay.popover.background}", borderColor: "{overlay.popover.border.color}", borderRadius: "{overlay.popover.border.radius}", color: "{overlay.popover.color}", padding: "{overlay.popover.padding}", shadow: "{overlay.popover.shadow}" }, YO = { gap: "0.5rem" }, GO = { light: { strength: { weakBackground: "{red.500}", mediumBackground: "{amber.500}", strongBackground: "{green.500}" } }, dark: { strength: { weakBackground: "{red.400}", mediumBackground: "{amber.400}", strongBackground: "{green.400}" } } }, XO = { meter: VO, icon: HO, overlay: KO, content: YO, colorScheme: GO }, QO = { gap: "1.125rem" }, JO = { gap: "0.5rem" }, qO = { root: QO, controls: JO }, ZO = { background: "{overlay.popover.background}", borderColor: "{overlay.popover.border.color}", color: "{overlay.popover.color}", borderRadius: "{overlay.popover.border.radius}", shadow: "{overlay.popover.shadow}", gutter: "10px", arrowOffset: "1.25rem" }, eL = { padding: "{overlay.popover.padding}" }, tL = { root: ZO, content: eL }, rL = { background: "{content.border.color}", borderRadius: "{content.border.radius}", height: "1.25rem" }, nL = { background: "{primary.color}" }, oL = { color: "{primary.contrast.color}", fontSize: "0.75rem", fontWeight: "600" }, iL = { root: rL, value: nL, label: oL }, lL = { light: { root: { colorOne: "{red.500}", colorTwo: "{blue.500}", colorThree: "{green.500}", colorFour: "{yellow.500}" } }, dark: { root: { colorOne: "{red.400}", colorTwo: "{blue.400}", colorThree: "{green.400}", colorFour: "{yellow.400}" } } }, aL = { colorScheme: lL }, sL = { width: "1.25rem", height: "1.25rem", background: "{form.field.background}", checkedBackground: "{primary.color}", checkedHoverBackground: "{primary.hover.color}", disabledBackground: "{form.field.disabled.background}", filledBackground: "{form.field.filled.background}", borderColor: "{form.field.border.color}", hoverBorderColor: "{form.field.hover.border.color}", focusBorderColor: "{form.field.border.color}", checkedBorderColor: "{primary.color}", checkedHoverBorderColor: "{primary.hover.color}", checkedFocusBorderColor: "{primary.color}", checkedDisabledBorderColor: "{form.field.border.color}", invalidBorderColor: "{form.field.invalid.border.color}", shadow: "{form.field.shadow}", focusRing: { width: "{focus.ring.width}", style: "{focus.ring.style}", color: "{focus.ring.color}", offset: "{focus.ring.offset}", shadow: "{focus.ring.shadow}" }, transitionDuration: "{form.field.transition.duration}", sm: { width: "1rem", height: "1rem" }, lg: { width: "1.5rem", height: "1.5rem" } }, uL = { size: "0.75rem", checkedColor: "{primary.contrast.color}", checkedHoverColor: "{primary.contrast.color}", disabledColor: "{form.field.disabled.color}", sm: { size: "0.5rem" }, lg: { size: "1rem" } }, cL = { root: sL, icon: uL }, dL = { gap: "0.25rem", transitionDuration: "{transition.duration}", focusRing: { width: "{focus.ring.width}", style: "{focus.ring.style}", color: "{focus.ring.color}", offset: "{focus.ring.offset}", shadow: "{focus.ring.shadow}" } }, fL = { size: "1rem", color: "{text.muted.color}", hoverColor: "{primary.color}", activeColor: "{primary.color}" }, pL = { root: dL, icon: fL }, gL = { light: { root: { background: "rgba(0,0,0,0.1)" } }, dark: { root: { background: "rgba(255,255,255,0.3)" } } }, hL = { colorScheme: gL }, mL = { transitionDuration: "{transition.duration}" }, vL = { size: "9px", borderRadius: "{border.radius.sm}", focusRing: { width: "{focus.ring.width}", style: "{focus.ring.style}", color: "{focus.ring.color}", offset: "{focus.ring.offset}", shadow: "{focus.ring.shadow}" } }, bL = { light: { bar: { background: "{surface.100}" } }, dark: { bar: { background: "{surface.800}" } } }, yL = { root: mL, bar: vL, colorScheme: bL }, _L = { background: "{form.field.background}", disabledBackground: "{form.field.disabled.background}", filledBackground: "{form.field.filled.background}", filledHoverBackground: "{form.field.filled.hover.background}", filledFocusBackground: "{form.field.filled.focus.background}", borderColor: "{form.field.border.color}", hoverBorderColor: "{form.field.hover.border.color}", focusBorderColor: "{form.field.focus.border.color}", invalidBorderColor: "{form.field.invalid.border.color}", color: "{form.field.color}", disabledColor: "{form.field.disabled.color}", placeholderColor: "{form.field.placeholder.color}", invalidPlaceholderColor: "{form.field.invalid.placeholder.color}", shadow: "{form.field.shadow}", paddingX: "{form.field.padding.x}", paddingY: "{form.field.padding.y}", borderRadius: "{form.field.border.radius}", focusRing: { width: "{form.field.focus.ring.width}", style: "{form.field.focus.ring.style}", color: "{form.field.focus.ring.color}", offset: "{form.field.focus.ring.offset}", shadow: "{form.field.focus.ring.shadow}" }, transitionDuration: "{form.field.transition.duration}", sm: { fontSize: "{form.field.sm.font.size}", paddingX: "{form.field.sm.padding.x}", paddingY: "{form.field.sm.padding.y}" }, lg: { fontSize: "{form.field.lg.font.size}", paddingX: "{form.field.lg.padding.x}", paddingY: "{form.field.lg.padding.y}" } }, kL = { width: "2.5rem", color: "{form.field.icon.color}" }, wL = { background: "{overlay.select.background}", borderColor: "{overlay.select.border.color}", borderRadius: "{overlay.select.border.radius}", color: "{overlay.select.color}", shadow: "{overlay.select.shadow}" }, SL = { padding: "{list.padding}", gap: "{list.gap}", header: { padding: "{list.header.padding}" } }, CL = { focusBackground: "{list.option.focus.background}", selectedBackground: "{list.option.selected.background}", selectedFocusBackground: "{list.option.selected.focus.background}", color: "{list.option.color}", focusColor: "{list.option.focus.color}", selectedColor: "{list.option.selected.color}", selectedFocusColor: "{list.option.selected.focus.color}", padding: "{list.option.padding}", borderRadius: "{list.option.border.radius}" }, xL = { background: "{list.option.group.background}", color: "{list.option.group.color}", fontWeight: "{list.option.group.font.weight}", padding: "{list.option.group.padding}" }, $L = { color: "{form.field.icon.color}" }, EL = { color: "{list.option.color}", gutterStart: "-0.375rem", gutterEnd: "0.375rem" }, TL = { padding: "{list.option.padding}" }, OL = { root: _L, dropdown: kL, overlay: wL, list: SL, option: CL, optionGroup: xL, clearIcon: $L, checkmark: EL, emptyMessage: TL }, LL = { borderRadius: "{form.field.border.radius}" }, PL = { light: { root: { invalidBorderColor: "{form.field.invalid.border.color}" } }, dark: { root: { invalidBorderColor: "{form.field.invalid.border.color}" } } }, NL = { root: LL, colorScheme: PL }, RL = { borderRadius: "{content.border.radius}" }, IL = { light: { root: { background: "{surface.200}", animationBackground: "rgba(255,255,255,0.4)" } }, dark: { root: { background: "rgba(255, 255, 255, 0.06)", animationBackground: "rgba(255, 255, 255, 0.04)" } } }, AL = { root: RL, colorScheme: IL }, BL = { transitionDuration: "{transition.duration}" }, DL = { background: "{content.border.color}", borderRadius: "{content.border.radius}", size: "3px" }, ML = { background: "{primary.color}" }, jL = { width: "20px", height: "20px", borderRadius: "50%", background: "{content.border.color}", hoverBackground: "{content.border.color}", content: { borderRadius: "50%", hoverBackground: "{content.background}", width: "16px", height: "16px", shadow: "0px 0.5px 0px 0px rgba(0, 0, 0, 0.08), 0px 1px 1px 0px rgba(0, 0, 0, 0.14)" }, focusRing: { width: "{focus.ring.width}", style: "{focus.ring.style}", color: "{focus.ring.color}", offset: "{focus.ring.offset}", shadow: "{focus.ring.shadow}" } }, FL = { light: { handle: { content: { background: "{surface.0}" } } }, dark: { handle: { content: { background: "{surface.950}" } } } }, zL = { root: BL, track: DL, range: ML, handle: jL, colorScheme: FL }, UL = { gap: "0.5rem", transitionDuration: "{transition.duration}" }, WL = { root: UL }, VL = { borderRadius: "{form.field.border.radius}", roundedBorderRadius: "2rem", raisedShadow: "0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12)" }, HL = { root: VL }, KL = { background: "{content.background}", borderColor: "{content.border.color}", color: "{content.color}", transitionDuration: "{transition.duration}" }, YL = { background: "{content.border.color}" }, GL = { size: "24px", background: "transparent", borderRadius: "{content.border.radius}", focusRing: { width: "{focus.ring.width}", style: "{focus.ring.style}", color: "{focus.ring.color}", offset: "{focus.ring.offset}", shadow: "{focus.ring.shadow}" } }, XL = { root: KL, gutter: YL, handle: GL }, QL = { transitionDuration: "{transition.duration}" }, JL = { background: "{content.border.color}", activeBackground: "{primary.color}", margin: "0 0 0 1.625rem", size: "2px" }, qL = { padding: "0.5rem", gap: "1rem" }, ZL = { padding: "0", borderRadius: "{content.border.radius}", focusRing: { width: "{focus.ring.width}", style: "{focus.ring.style}", color: "{focus.ring.color}", offset: "{focus.ring.offset}", shadow: "{focus.ring.shadow}" }, gap: "0.5rem" }, eP = { color: "{text.muted.color}", activeColor: "{primary.color}", fontWeight: "500" }, tP = { background: "{content.background}", activeBackground: "{content.background}", borderColor: "{content.border.color}", activeBorderColor: "{content.border.color}", color: "{text.muted.color}", activeColor: "{primary.color}", size: "2rem", fontSize: "1.143rem", fontWeight: "500", borderRadius: "50%", shadow: "0px 0.5px 0px 0px rgba(0, 0, 0, 0.06), 0px 1px 1px 0px rgba(0, 0, 0, 0.12)" }, rP = { padding: "0.875rem 0.5rem 1.125rem 0.5rem" }, nP = { background: "{content.background}", color: "{content.color}", padding: "0", indent: "1rem" }, oP = { root: QL, separator: JL, step: qL, stepHeader: ZL, stepTitle: eP, stepNumber: tP, steppanels: rP, steppanel: nP }, iP = { transitionDuration: "{transition.duration}" }, lP = { background: "{content.border.color}" }, aP = { borderRadius: "{content.border.radius}", focusRing: { width: "{focus.ring.width}", style: "{focus.ring.style}", color: "{focus.ring.color}", offset: "{focus.ring.offset}", shadow: "{focus.ring.shadow}" }, gap: "0.5rem" }, sP = { color: "{text.muted.color}", activeColor: "{primary.color}", fontWeight: "500" }, uP = { background: "{content.background}", activeBackground: "{content.background}", borderColor: "{content.border.color}", activeBorderColor: "{content.border.color}", color: "{text.muted.color}", activeColor: "{primary.color}", size: "2rem", fontSize: "1.143rem", fontWeight: "500", borderRadius: "50%", shadow: "0px 0.5px 0px 0px rgba(0, 0, 0, 0.06), 0px 1px 1px 0px rgba(0, 0, 0, 0.12)" }, cP = { root: iP, separator: lP, itemLink: aP, itemLabel: sP, itemNumber: uP }, dP = { transitionDuration: "{transition.duration}" }, fP = { borderWidth: "0 0 1px 0", background: "{content.background}", borderColor: "{content.border.color}" }, pP = { background: "transparent", hoverBackground: "transparent", activeBackground: "transparent", borderWidth: "0 0 1px 0", borderColor: "{content.border.color}", hoverBorderColor: "{content.border.color}", activeBorderColor: "{primary.color}", color: "{text.muted.color}", hoverColor: "{text.color}", activeColor: "{primary.color}", padding: "1rem 1.125rem", fontWeight: "600", margin: "0 0 -1px 0", gap: "0.5rem", focusRing: { width: "{focus.ring.width}", style: "{focus.ring.style}", color: "{focus.ring.color}", offset: "{focus.ring.offset}", shadow: "{focus.ring.shadow}" } }, gP = { color: "{text.muted.color}", hoverColor: "{text.color}", activeColor: "{primary.color}" }, hP = { height: "1px", bottom: "-1px", background: "{primary.color}" }, mP = { root: dP, tablist: fP, item: pP, itemIcon: gP, activeBar: hP }, vP = { transitionDuration: "{transition.duration}" }, bP = { borderWidth: "0 0 1px 0", background: "{content.background}", borderColor: "{content.border.color}" }, yP = { background: "transparent", hoverBackground: "transparent", activeBackground: "transparent", borderWidth: "0 0 1px 0", borderColor: "{content.border.color}", hoverBorderColor: "{content.border.color}", activeBorderColor: "{primary.color}", color: "{text.muted.color}", hoverColor: "{text.color}", activeColor: "{primary.color}", padding: "1rem 1.125rem", fontWeight: "600", margin: "0 0 -1px 0", gap: "0.5rem", focusRing: { width: "{focus.ring.width}", style: "{focus.ring.style}", color: "{focus.ring.color}", offset: "-1px", shadow: "{focus.ring.shadow}" } }, _P = { background: "{content.background}", color: "{content.color}", padding: "0.875rem 1.125rem 1.125rem 1.125rem", focusRing: { width: "{focus.ring.width}", style: "{focus.ring.style}", color: "{focus.ring.color}", offset: "{focus.ring.offset}", shadow: "inset {focus.ring.shadow}" } }, kP = { background: "{content.background}", color: "{text.muted.color}", hoverColor: "{text.color}", width: "2.5rem", focusRing: { width: "{focus.ring.width}", style: "{focus.ring.style}", color: "{focus.ring.color}", offset: "-1px", shadow: "{focus.ring.shadow}" } }, wP = { height: "1px", bottom: "-1px", background: "{primary.color}" }, SP = { light: { navButton: { shadow: "0px 0px 10px 50px rgba(255, 255, 255, 0.6)" } }, dark: { navButton: { shadow: "0px 0px 10px 50px color-mix(in srgb, {content.background}, transparent 50%)" } } }, CP = { root: vP, tablist: bP, tab: yP, tabpanel: _P, navButton: kP, activeBar: wP, colorScheme: SP }, xP = { transitionDuration: "{transition.duration}" }, $P = { background: "{content.background}", borderColor: "{content.border.color}" }, EP = { borderColor: "{content.border.color}", activeBorderColor: "{primary.color}", color: "{text.muted.color}", hoverColor: "{text.color}", activeColor: "{primary.color}" }, TP = { background: "{content.background}", color: "{content.color}" }, OP = { background: "{content.background}", color: "{text.muted.color}", hoverColor: "{text.color}" }, LP = { light: { navButton: { shadow: "0px 0px 10px 50px rgba(255, 255, 255, 0.6)" } }, dark: { navButton: { shadow: "0px 0px 10px 50px color-mix(in srgb, {content.background}, transparent 50%)" } } }, PP = { root: xP, tabList: $P, tab: EP, tabPanel: TP, navButton: OP, colorScheme: LP }, NP = { fontSize: "0.875rem", fontWeight: "700", padding: "0.25rem 0.5rem", gap: "0.25rem", borderRadius: "{content.border.radius}", roundedBorderRadius: "{border.radius.xl}" }, RP = { size: "0.75rem" }, IP = { light: { primary: { background: "{primary.100}", color: "{primary.700}" }, secondary: { background: "{surface.100}", color: "{surface.600}" }, success: { background: "{green.100}", color: "{green.700}" }, info: { background: "{sky.100}", color: "{sky.700}" }, warn: { background: "{orange.100}", color: "{orange.700}" }, danger: { background: "{red.100}", color: "{red.700}" }, contrast: { background: "{surface.950}", color: "{surface.0}" } }, dark: { primary: { background: "color-mix(in srgb, {primary.500}, transparent 84%)", color: "{primary.300}" }, secondary: { background: "{surface.800}", color: "{surface.300}" }, success: { background: "color-mix(in srgb, {green.500}, transparent 84%)", color: "{green.300}" }, info: { background: "color-mix(in srgb, {sky.500}, transparent 84%)", color: "{sky.300}" }, warn: { background: "color-mix(in srgb, {orange.500}, transparent 84%)", color: "{orange.300}" }, danger: { background: "color-mix(in srgb, {red.500}, transparent 84%)", color: "{red.300}" }, contrast: { background: "{surface.0}", color: "{surface.950}" } } }, AP = { root: NP, icon: RP, colorScheme: IP }, BP = { background: "{form.field.background}", borderColor: "{form.field.border.color}", color: "{form.field.color}", height: "18rem", padding: "{form.field.padding.y} {form.field.padding.x}", borderRadius: "{form.field.border.radius}" }, DP = { gap: "0.25rem" }, MP = { margin: "2px 0" }, jP = { root: BP, prompt: DP, commandResponse: MP }, FP = { background: "{form.field.background}", disabledBackground: "{form.field.disabled.background}", filledBackground: "{form.field.filled.background}", filledHoverBackground: "{form.field.filled.hover.background}", filledFocusBackground: "{form.field.filled.focus.background}", borderColor: "{form.field.border.color}", hoverBorderColor: "{form.field.hover.border.color}", focusBorderColor: "{form.field.focus.border.color}", invalidBorderColor: "{form.field.invalid.border.color}", color: "{form.field.color}", disabledColor: "{form.field.disabled.color}", placeholderColor: "{form.field.placeholder.color}", invalidPlaceholderColor: "{form.field.invalid.placeholder.color}", shadow: "{form.field.shadow}", paddingX: "{form.field.padding.x}", paddingY: "{form.field.padding.y}", borderRadius: "{form.field.border.radius}", focusRing: { width: "{form.field.focus.ring.width}", style: "{form.field.focus.ring.style}", color: "{form.field.focus.ring.color}", offset: "{form.field.focus.ring.offset}", shadow: "{form.field.focus.ring.shadow}" }, transitionDuration: "{form.field.transition.duration}", sm: { fontSize: "{form.field.sm.font.size}", paddingX: "{form.field.sm.padding.x}", paddingY: "{form.field.sm.padding.y}" }, lg: { fontSize: "{form.field.lg.font.size}", paddingX: "{form.field.lg.padding.x}", paddingY: "{form.field.lg.padding.y}" } }, zP = { root: FP }, UP = { background: "{content.background}", borderColor: "{content.border.color}", color: "{content.color}", borderRadius: "{content.border.radius}", shadow: "{overlay.navigation.shadow}", transitionDuration: "{transition.duration}" }, WP = { padding: "{navigation.list.padding}", gap: "{navigation.list.gap}" }, VP = { focusBackground: "{navigation.item.focus.background}", activeBackground: "{navigation.item.active.background}", color: "{navigation.item.color}", focusColor: "{navigation.item.focus.color}", activeColor: "{navigation.item.active.color}", padding: "{navigation.item.padding}", borderRadius: "{navigation.item.border.radius}", gap: "{navigation.item.gap}", icon: { color: "{navigation.item.icon.color}", focusColor: "{navigation.item.icon.focus.color}", activeColor: "{navigation.item.icon.active.color}" } }, HP = { mobileIndent: "1rem" }, KP = { size: "{navigation.submenu.icon.size}", color: "{navigation.submenu.icon.color}", focusColor: "{navigation.submenu.icon.focus.color}", activeColor: "{navigation.submenu.icon.active.color}" }, YP = { borderColor: "{content.border.color}" }, GP = { root: UP, list: WP, item: VP, submenu: HP, submenuIcon: KP, separator: YP }, XP = { minHeight: "5rem" }, QP = { eventContent: { padding: "1rem 0" } }, JP = { eventContent: { padding: "0 1rem" } }, qP = { size: "1.125rem", borderRadius: "50%", borderWidth: "2px", background: "{content.background}", borderColor: "{content.border.color}", content: { borderRadius: "50%", size: "0.375rem", background: "{primary.color}", insetShadow: "0px 0.5px 0px 0px rgba(0, 0, 0, 0.06), 0px 1px 1px 0px rgba(0, 0, 0, 0.12)" } }, ZP = { color: "{content.border.color}", size: "2px" }, eN = { event: XP, horizontal: QP, vertical: JP, eventMarker: qP, eventConnector: ZP }, tN = { width: "25rem", borderRadius: "{content.border.radius}", borderWidth: "1px", transitionDuration: "{transition.duration}" }, rN = { size: "1.125rem" }, nN = { padding: "{overlay.popover.padding}", gap: "0.5rem" }, oN = { gap: "0.5rem" }, iN = { fontWeight: "500", fontSize: "1rem" }, lN = { fontWeight: "500", fontSize: "0.875rem" }, aN = { width: "1.75rem", height: "1.75rem", borderRadius: "50%", focusRing: { width: "{focus.ring.width}", style: "{focus.ring.style}", offset: "{focus.ring.offset}" } }, sN = { size: "1rem" }, uN = { light: { root: { blur: "1.5px" }, info: { background: "color-mix(in srgb, {blue.50}, transparent 5%)", borderColor: "{blue.200}", color: "{blue.600}", detailColor: "{surface.700}", shadow: "0px 4px 8px 0px color-mix(in srgb, {blue.500}, transparent 96%)", closeButton: { hoverBackground: "{blue.100}", focusRing: { color: "{blue.600}", shadow: "none" } } }, success: { background: "color-mix(in srgb, {green.50}, transparent 5%)", borderColor: "{green.200}", color: "{green.600}", detailColor: "{surface.700}", shadow: "0px 4px 8px 0px color-mix(in srgb, {green.500}, transparent 96%)", closeButton: { hoverBackground: "{green.100}", focusRing: { color: "{green.600}", shadow: "none" } } }, warn: { background: "color-mix(in srgb,{yellow.50}, transparent 5%)", borderColor: "{yellow.200}", color: "{yellow.600}", detailColor: "{surface.700}", shadow: "0px 4px 8px 0px color-mix(in srgb, {yellow.500}, transparent 96%)", closeButton: { hoverBackground: "{yellow.100}", focusRing: { color: "{yellow.600}", shadow: "none" } } }, error: { background: "color-mix(in srgb, {red.50}, transparent 5%)", borderColor: "{red.200}", color: "{red.600}", detailColor: "{surface.700}", shadow: "0px 4px 8px 0px color-mix(in srgb, {red.500}, transparent 96%)", closeButton: { hoverBackground: "{red.100}", focusRing: { color: "{red.600}", shadow: "none" } } }, secondary: { background: "{surface.100}", borderColor: "{surface.200}", color: "{surface.600}", detailColor: "{surface.700}", shadow: "0px 4px 8px 0px color-mix(in srgb, {surface.500}, transparent 96%)", closeButton: { hoverBackground: "{surface.200}", focusRing: { color: "{surface.600}", shadow: "none" } } }, contrast: { background: "{surface.900}", borderColor: "{surface.950}", color: "{surface.50}", detailColor: "{surface.0}", shadow: "0px 4px 8px 0px color-mix(in srgb, {surface.950}, transparent 96%)", closeButton: { hoverBackground: "{surface.800}", focusRing: { color: "{surface.50}", shadow: "none" } } } }, dark: { root: { blur: "10px" }, info: { background: "color-mix(in srgb, {blue.500}, transparent 84%)", borderColor: "color-mix(in srgb, {blue.700}, transparent 64%)", color: "{blue.500}", detailColor: "{surface.0}", shadow: "0px 4px 8px 0px color-mix(in srgb, {blue.500}, transparent 96%)", closeButton: { hoverBackground: "rgba(255, 255, 255, 0.05)", focusRing: { color: "{blue.500}", shadow: "none" } } }, success: { background: "color-mix(in srgb, {green.500}, transparent 84%)", borderColor: "color-mix(in srgb, {green.700}, transparent 64%)", color: "{green.500}", detailColor: "{surface.0}", shadow: "0px 4px 8px 0px color-mix(in srgb, {green.500}, transparent 96%)", closeButton: { hoverBackground: "rgba(255, 255, 255, 0.05)", focusRing: { color: "{green.500}", shadow: "none" } } }, warn: { background: "color-mix(in srgb, {yellow.500}, transparent 84%)", borderColor: "color-mix(in srgb, {yellow.700}, transparent 64%)", color: "{yellow.500}", detailColor: "{surface.0}", shadow: "0px 4px 8px 0px color-mix(in srgb, {yellow.500}, transparent 96%)", closeButton: { hoverBackground: "rgba(255, 255, 255, 0.05)", focusRing: { color: "{yellow.500}", shadow: "none" } } }, error: { background: "color-mix(in srgb, {red.500}, transparent 84%)", borderColor: "color-mix(in srgb, {red.700}, transparent 64%)", color: "{red.500}", detailColor: "{surface.0}", shadow: "0px 4px 8px 0px color-mix(in srgb, {red.500}, transparent 96%)", closeButton: { hoverBackground: "rgba(255, 255, 255, 0.05)", focusRing: { color: "{red.500}", shadow: "none" } } }, secondary: { background: "{surface.800}", borderColor: "{surface.700}", color: "{surface.300}", detailColor: "{surface.0}", shadow: "0px 4px 8px 0px color-mix(in srgb, {surface.500}, transparent 96%)", closeButton: { hoverBackground: "{surface.700}", focusRing: { color: "{surface.300}", shadow: "none" } } }, contrast: { background: "{surface.0}", borderColor: "{surface.100}", color: "{surface.950}", detailColor: "{surface.950}", shadow: "0px 4px 8px 0px color-mix(in srgb, {surface.950}, transparent 96%)", closeButton: { hoverBackground: "{surface.100}", focusRing: { color: "{surface.950}", shadow: "none" } } } } }, cN = { root: tN, icon: rN, content: nN, text: oN, summary: iN, detail: lN, closeButton: aN, closeIcon: sN, colorScheme: uN }, dN = { padding: "0.25rem", borderRadius: "{content.border.radius}", gap: "0.5rem", fontWeight: "500", disabledBackground: "{form.field.disabled.background}", disabledBorderColor: "{form.field.disabled.background}", disabledColor: "{form.field.disabled.color}", invalidBorderColor: "{form.field.invalid.border.color}", focusRing: { width: "{focus.ring.width}", style: "{focus.ring.style}", color: "{focus.ring.color}", offset: "{focus.ring.offset}", shadow: "{focus.ring.shadow}" }, transitionDuration: "{form.field.transition.duration}", sm: { fontSize: "{form.field.sm.font.size}", padding: "0.25rem" }, lg: { fontSize: "{form.field.lg.font.size}", padding: "0.25rem" } }, fN = { disabledColor: "{form.field.disabled.color}" }, pN = { padding: "0.25rem 0.75rem", borderRadius: "{content.border.radius}", checkedShadow: "0px 1px 2px 0px rgba(0, 0, 0, 0.02), 0px 1px 2px 0px rgba(0, 0, 0, 0.04)", sm: { padding: "0.25rem 0.75rem" }, lg: { padding: "0.25rem 0.75rem" } }, gN = { light: { root: { background: "{surface.100}", checkedBackground: "{surface.100}", hoverBackground: "{surface.100}", borderColor: "{surface.100}", color: "{surface.500}", hoverColor: "{surface.700}", checkedColor: "{surface.900}", checkedBorderColor: "{surface.100}" }, content: { checkedBackground: "{surface.0}" }, icon: { color: "{surface.500}", hoverColor: "{surface.700}", checkedColor: "{surface.900}" } }, dark: { root: { background: "{surface.950}", checkedBackground: "{surface.950}", hoverBackground: "{surface.950}", borderColor: "{surface.950}", color: "{surface.400}", hoverColor: "{surface.300}", checkedColor: "{surface.0}", checkedBorderColor: "{surface.950}" }, content: { checkedBackground: "{surface.800}" }, icon: { color: "{surface.400}", hoverColor: "{surface.300}", checkedColor: "{surface.0}" } } }, hN = { root: dN, icon: fN, content: pN, colorScheme: gN }, mN = { width: "2.5rem", height: "1.5rem", borderRadius: "30px", gap: "0.25rem", shadow: "{form.field.shadow}", focusRing: { width: "{focus.ring.width}", style: "{focus.ring.style}", color: "{focus.ring.color}", offset: "{focus.ring.offset}", shadow: "{focus.ring.shadow}" }, borderWidth: "1px", borderColor: "transparent", hoverBorderColor: "transparent", checkedBorderColor: "transparent", checkedHoverBorderColor: "transparent", invalidBorderColor: "{form.field.invalid.border.color}", transitionDuration: "{form.field.transition.duration}", slideDuration: "0.2s" }, vN = { borderRadius: "50%", size: "1rem" }, bN = { light: { root: { background: "{surface.300}", disabledBackground: "{form.field.disabled.background}", hoverBackground: "{surface.400}", checkedBackground: "{primary.color}", checkedHoverBackground: "{primary.hover.color}" }, handle: { background: "{surface.0}", disabledBackground: "{form.field.disabled.color}", hoverBackground: "{surface.0}", checkedBackground: "{surface.0}", checkedHoverBackground: "{surface.0}", color: "{text.muted.color}", hoverColor: "{text.color}", checkedColor: "{primary.color}", checkedHoverColor: "{primary.hover.color}" } }, dark: { root: { background: "{surface.700}", disabledBackground: "{surface.600}", hoverBackground: "{surface.600}", checkedBackground: "{primary.color}", checkedHoverBackground: "{primary.hover.color}" }, handle: { background: "{surface.400}", disabledBackground: "{surface.900}", hoverBackground: "{surface.300}", checkedBackground: "{surface.900}", checkedHoverBackground: "{surface.900}", color: "{surface.900}", hoverColor: "{surface.800}", checkedColor: "{primary.color}", checkedHoverColor: "{primary.hover.color}" } } }, yN = { root: mN, handle: vN, colorScheme: bN }, _N = { background: "{content.background}", borderColor: "{content.border.color}", borderRadius: "{content.border.radius}", color: "{content.color}", gap: "0.5rem", padding: "0.75rem" }, kN = { root: _N }, wN = { maxWidth: "12.5rem", gutter: "0.25rem", shadow: "{overlay.popover.shadow}", padding: "0.5rem 0.75rem", borderRadius: "{overlay.popover.border.radius}" }, SN = { light: { root: { background: "{surface.700}", color: "{surface.0}" } }, dark: { root: { background: "{surface.700}", color: "{surface.0}" } } }, CN = { root: wN, colorScheme: SN }, xN = { background: "{content.background}", color: "{content.color}", padding: "1rem", gap: "2px", indent: "1rem", transitionDuration: "{transition.duration}" }, $N = { padding: "0.25rem 0.5rem", borderRadius: "{content.border.radius}", hoverBackground: "{content.hover.background}", selectedBackground: "{highlight.background}", color: "{text.color}", hoverColor: "{text.hover.color}", selectedColor: "{highlight.color}", focusRing: { width: "{focus.ring.width}", style: "{focus.ring.style}", color: "{focus.ring.color}", offset: "-1px", shadow: "{focus.ring.shadow}" }, gap: "0.25rem" }, EN = { color: "{text.muted.color}", hoverColor: "{text.hover.muted.color}", selectedColor: "{highlight.color}" }, TN = { borderRadius: "50%", size: "1.75rem", hoverBackground: "{content.hover.background}", selectedHoverBackground: "{content.background}", color: "{text.muted.color}", hoverColor: "{text.hover.muted.color}", selectedHoverColor: "{primary.color}", focusRing: { width: "{focus.ring.width}", style: "{focus.ring.style}", color: "{focus.ring.color}", offset: "{focus.ring.offset}", shadow: "{focus.ring.shadow}" } }, ON = { size: "2rem" }, LN = { margin: "0 0 0.5rem 0" }, PN = { root: xN, node: $N, nodeIcon: EN, nodeToggleButton: TN, loadingIcon: ON, filter: LN }, NN = { background: "{form.field.background}", disabledBackground: "{form.field.disabled.background}", filledBackground: "{form.field.filled.background}", filledHoverBackground: "{form.field.filled.hover.background}", filledFocusBackground: "{form.field.filled.focus.background}", borderColor: "{form.field.border.color}", hoverBorderColor: "{form.field.hover.border.color}", focusBorderColor: "{form.field.focus.border.color}", invalidBorderColor: "{form.field.invalid.border.color}", color: "{form.field.color}", disabledColor: "{form.field.disabled.color}", placeholderColor: "{form.field.placeholder.color}", invalidPlaceholderColor: "{form.field.invalid.placeholder.color}", shadow: "{form.field.shadow}", paddingX: "{form.field.padding.x}", paddingY: "{form.field.padding.y}", borderRadius: "{form.field.border.radius}", focusRing: { width: "{form.field.focus.ring.width}", style: "{form.field.focus.ring.style}", color: "{form.field.focus.ring.color}", offset: "{form.field.focus.ring.offset}", shadow: "{form.field.focus.ring.shadow}" }, transitionDuration: "{form.field.transition.duration}", sm: { fontSize: "{form.field.sm.font.size}", paddingX: "{form.field.sm.padding.x}", paddingY: "{form.field.sm.padding.y}" }, lg: { fontSize: "{form.field.lg.font.size}", paddingX: "{form.field.lg.padding.x}", paddingY: "{form.field.lg.padding.y}" } }, RN = { width: "2.5rem", color: "{form.field.icon.color}" }, IN = { background: "{overlay.select.background}", borderColor: "{overlay.select.border.color}", borderRadius: "{overlay.select.border.radius}", color: "{overlay.select.color}", shadow: "{overlay.select.shadow}" }, AN = { padding: "{list.padding}" }, BN = { padding: "{list.option.padding}" }, DN = { borderRadius: "{border.radius.sm}" }, MN = { color: "{form.field.icon.color}" }, jN = { root: NN, dropdown: RN, overlay: IN, tree: AN, emptyMessage: BN, chip: DN, clearIcon: MN }, FN = { transitionDuration: "{transition.duration}" }, zN = { background: "{content.background}", borderColor: "{treetable.border.color}", color: "{content.color}", borderWidth: "0 0 1px 0", padding: "0.75rem 1rem" }, UN = { background: "{content.background}", hoverBackground: "{content.hover.background}", selectedBackground: "{highlight.background}", borderColor: "{treetable.border.color}", color: "{content.color}", hoverColor: "{content.hover.color}", selectedColor: "{highlight.color}", gap: "0.5rem", padding: "0.75rem 1rem", focusRing: { width: "{focus.ring.width}", style: "{focus.ring.style}", color: "{focus.ring.color}", offset: "-1px", shadow: "{focus.ring.shadow}" } }, WN = { fontWeight: "600" }, VN = { background: "{content.background}", hoverBackground: "{content.hover.background}", selectedBackground: "{highlight.background}", color: "{content.color}", hoverColor: "{content.hover.color}", selectedColor: "{highlight.color}", focusRing: { width: "{focus.ring.width}", style: "{focus.ring.style}", color: "{focus.ring.color}", offset: "-1px", shadow: "{focus.ring.shadow}" } }, HN = { borderColor: "{treetable.border.color}", padding: "0.75rem 1rem", gap: "0.5rem" }, KN = { background: "{content.background}", borderColor: "{treetable.border.color}", color: "{content.color}", padding: "0.75rem 1rem" }, YN = { fontWeight: "600" }, GN = { background: "{content.background}", borderColor: "{treetable.border.color}", color: "{content.color}", borderWidth: "0 0 1px 0", padding: "0.75rem 1rem" }, XN = { width: "0.5rem" }, QN = { width: "1px", color: "{primary.color}" }, JN = { color: "{text.muted.color}", hoverColor: "{text.hover.muted.color}", size: "0.875rem" }, qN = { size: "2rem" }, ZN = { hoverBackground: "{content.hover.background}", selectedHoverBackground: "{content.background}", color: "{text.muted.color}", hoverColor: "{text.color}", selectedHoverColor: "{primary.color}", size: "1.75rem", borderRadius: "50%", focusRing: { width: "{focus.ring.width}", style: "{focus.ring.style}", color: "{focus.ring.color}", offset: "{focus.ring.offset}", shadow: "{focus.ring.shadow}" } }, eR = { borderColor: "{content.border.color}", borderWidth: "0 0 1px 0" }, tR = { borderColor: "{content.border.color}", borderWidth: "0 0 1px 0" }, rR = { light: { root: { borderColor: "{content.border.color}" }, bodyCell: { selectedBorderColor: "{primary.100}" } }, dark: { root: { borderColor: "{surface.800}" }, bodyCell: { selectedBorderColor: "{primary.900}" } } }, nR = { root: FN, header: zN, headerCell: UN, columnTitle: WN, row: VN, bodyCell: HN, footerCell: KN, columnFooter: YN, footer: GN, columnResizer: XN, resizeIndicator: QN, sortIcon: JN, loadingIcon: qN, nodeToggleButton: ZN, paginatorTop: eR, paginatorBottom: tR, colorScheme: rR }, oR = { mask: { background: "{content.background}", color: "{text.muted.color}" }, icon: { size: "2rem" } }, iR = { loader: oR };
function oa(e) {
  "@babel/helpers - typeof";
  return oa = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, oa(e);
}
function r0(e, t) {
  var n = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var i = Object.getOwnPropertySymbols(e);
    t && (i = i.filter(function(a) {
      return Object.getOwnPropertyDescriptor(e, a).enumerable;
    })), n.push.apply(n, i);
  }
  return n;
}
function n0(e) {
  for (var t = 1; t < arguments.length; t++) {
    var n = arguments[t] != null ? arguments[t] : {};
    t % 2 ? r0(Object(n), !0).forEach(function(i) {
      lR(e, i, n[i]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : r0(Object(n)).forEach(function(i) {
      Object.defineProperty(e, i, Object.getOwnPropertyDescriptor(n, i));
    });
  }
  return e;
}
function lR(e, t, n) {
  return (t = aR(t)) in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
function aR(e) {
  var t = sR(e, "string");
  return oa(t) == "symbol" ? t : t + "";
}
function sR(e, t) {
  if (oa(e) != "object" || !e) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var i = n.call(e, t);
    if (oa(i) != "object") return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var uR = n0(n0({}, C$), {}, {
  components: {
    accordion: qx,
    autocomplete: s$,
    avatar: g$,
    badge: k$,
    blockui: $$,
    breadcrumb: L$,
    button: R$,
    datepicker: _5,
    card: j$,
    carousel: H$,
    cascadeselect: q$,
    checkbox: tE,
    chip: aE,
    colorpicker: fE,
    confirmdialog: hE,
    confirmpopup: _E,
    contextmenu: EE,
    dataview: e5,
    datatable: YE,
    dialog: $5,
    divider: P5,
    dock: I5,
    drawer: F5,
    editor: K5,
    fieldset: J5,
    fileupload: i2,
    iftalabel: L2,
    floatlabel: c2,
    galleria: x2,
    iconfield: E2,
    image: A2,
    imagecompare: D2,
    inlinemessage: U2,
    inplace: H2,
    inputchips: X2,
    inputgroup: J2,
    inputnumber: tT,
    inputotp: oT,
    inputtext: lT,
    knob: dT,
    listbox: yT,
    megamenu: OT,
    menu: AT,
    menubar: UT,
    message: qT,
    metergroup: iO,
    multiselect: hO,
    orderlist: bO,
    organizationchart: SO,
    overlaybadge: xO,
    popover: tL,
    paginator: LO,
    password: XO,
    panel: DO,
    panelmenu: WO,
    picklist: qO,
    progressbar: iL,
    progressspinner: aL,
    radiobutton: cL,
    rating: pL,
    ripple: hL,
    scrollpanel: yL,
    select: OL,
    selectbutton: NL,
    skeleton: AL,
    slider: zL,
    speeddial: WL,
    splitter: XL,
    splitbutton: HL,
    stepper: oP,
    steps: cP,
    tabmenu: mP,
    tabs: CP,
    tabview: PP,
    textarea: zP,
    tieredmenu: GP,
    tag: AP,
    terminal: jP,
    timeline: eN,
    togglebutton: hN,
    toggleswitch: yN,
    tree: PN,
    treeselect: jN,
    treetable: nR,
    toast: cN,
    toolbar: kN,
    tooltip: CN,
    virtualscroller: iR
  }
});
function cR() {
  var e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "pc", t = K_();
  return "".concat(e).concat(t.replace("v-", "").replaceAll("-", "_"));
}
var o0 = ft.extend({
  name: "common"
});
function ia(e) {
  "@babel/helpers - typeof";
  return ia = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, ia(e);
}
function dR(e) {
  return Wb(e) || fR(e) || Ub(e) || zb();
}
function fR(e) {
  if (typeof Symbol < "u" && e[Symbol.iterator] != null || e["@@iterator"] != null) return Array.from(e);
}
function $l(e, t) {
  return Wb(e) || pR(e, t) || Ub(e, t) || zb();
}
function zb() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function Ub(e, t) {
  if (e) {
    if (typeof e == "string") return i0(e, t);
    var n = {}.toString.call(e).slice(8, -1);
    return n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set" ? Array.from(e) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? i0(e, t) : void 0;
  }
}
function i0(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var n = 0, i = Array(t); n < t; n++) i[n] = e[n];
  return i;
}
function pR(e, t) {
  var n = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (n != null) {
    var i, a, s, c, f = [], d = !0, h = !1;
    try {
      if (s = (n = n.call(e)).next, t === 0) {
        if (Object(n) !== n) return;
        d = !1;
      } else for (; !(d = (i = s.call(n)).done) && (f.push(i.value), f.length !== t); d = !0) ;
    } catch (m) {
      h = !0, a = m;
    } finally {
      try {
        if (!d && n.return != null && (c = n.return(), Object(c) !== c)) return;
      } finally {
        if (h) throw a;
      }
    }
    return f;
  }
}
function Wb(e) {
  if (Array.isArray(e)) return e;
}
function l0(e, t) {
  var n = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var i = Object.getOwnPropertySymbols(e);
    t && (i = i.filter(function(a) {
      return Object.getOwnPropertyDescriptor(e, a).enumerable;
    })), n.push.apply(n, i);
  }
  return n;
}
function He(e) {
  for (var t = 1; t < arguments.length; t++) {
    var n = arguments[t] != null ? arguments[t] : {};
    t % 2 ? l0(Object(n), !0).forEach(function(i) {
      Nl(e, i, n[i]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : l0(Object(n)).forEach(function(i) {
      Object.defineProperty(e, i, Object.getOwnPropertyDescriptor(n, i));
    });
  }
  return e;
}
function Nl(e, t, n) {
  return (t = gR(t)) in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
function gR(e) {
  var t = hR(e, "string");
  return ia(t) == "symbol" ? t : t + "";
}
function hR(e, t) {
  if (ia(e) != "object" || !e) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var i = n.call(e, t);
    if (ia(i) != "object") return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var Ff = {
  name: "BaseComponent",
  props: {
    pt: {
      type: Object,
      default: void 0
    },
    ptOptions: {
      type: Object,
      default: void 0
    },
    unstyled: {
      type: Boolean,
      default: void 0
    },
    dt: {
      type: Object,
      default: void 0
    }
  },
  inject: {
    $parentInstance: {
      default: void 0
    }
  },
  watch: {
    isUnstyled: {
      immediate: !0,
      handler: function(t) {
        jt.off("theme:change", this._loadCoreStyles), t || (this._loadCoreStyles(), this._themeChangeListener(this._loadCoreStyles));
      }
    },
    dt: {
      immediate: !0,
      handler: function(t, n) {
        var i = this;
        jt.off("theme:change", this._themeScopedListener), t ? (this._loadScopedThemeStyles(t), this._themeScopedListener = function() {
          return i._loadScopedThemeStyles(t);
        }, this._themeChangeListener(this._themeScopedListener)) : this._unloadScopedThemeStyles();
      }
    }
  },
  scopedStyleEl: void 0,
  rootEl: void 0,
  uid: void 0,
  $attrSelector: void 0,
  beforeCreate: function() {
    var t, n, i, a, s, c, f, d, h, m, b, v = (t = this.pt) === null || t === void 0 ? void 0 : t._usept, _ = v ? (n = this.pt) === null || n === void 0 || (n = n.originalValue) === null || n === void 0 ? void 0 : n[this.$.type.name] : void 0, x = v ? (i = this.pt) === null || i === void 0 || (i = i.value) === null || i === void 0 ? void 0 : i[this.$.type.name] : this.pt;
    (a = x || _) === null || a === void 0 || (a = a.hooks) === null || a === void 0 || (s = a.onBeforeCreate) === null || s === void 0 || s.call(a);
    var T = (c = this.$primevueConfig) === null || c === void 0 || (c = c.pt) === null || c === void 0 ? void 0 : c._usept, R = T ? (f = this.$primevue) === null || f === void 0 || (f = f.config) === null || f === void 0 || (f = f.pt) === null || f === void 0 ? void 0 : f.originalValue : void 0, D = T ? (d = this.$primevue) === null || d === void 0 || (d = d.config) === null || d === void 0 || (d = d.pt) === null || d === void 0 ? void 0 : d.value : (h = this.$primevue) === null || h === void 0 || (h = h.config) === null || h === void 0 ? void 0 : h.pt;
    (m = D || R) === null || m === void 0 || (m = m[this.$.type.name]) === null || m === void 0 || (m = m.hooks) === null || m === void 0 || (b = m.onBeforeCreate) === null || b === void 0 || b.call(m), this.$attrSelector = cR(), this.uid = this.$attrs.id || this.$attrSelector.replace("pc", "pv_id_");
  },
  created: function() {
    this._hook("onCreated");
  },
  beforeMount: function() {
    var t;
    this.rootEl = Qs(va(this.$el) ? this.$el : (t = this.$el) === null || t === void 0 ? void 0 : t.parentElement, "[".concat(this.$attrSelector, "]")), this.rootEl && (this.rootEl.$pc = He({
      name: this.$.type.name,
      attrSelector: this.$attrSelector
    }, this.$params)), this._loadStyles(), this._hook("onBeforeMount");
  },
  mounted: function() {
    this._hook("onMounted");
  },
  beforeUpdate: function() {
    this._hook("onBeforeUpdate");
  },
  updated: function() {
    this._hook("onUpdated");
  },
  beforeUnmount: function() {
    this._hook("onBeforeUnmount");
  },
  unmounted: function() {
    this._removeThemeListeners(), this._unloadScopedThemeStyles(), this._hook("onUnmounted");
  },
  methods: {
    _hook: function(t) {
      if (!this.$options.hostName) {
        var n = this._usePT(this._getPT(this.pt, this.$.type.name), this._getOptionValue, "hooks.".concat(t)), i = this._useDefaultPT(this._getOptionValue, "hooks.".concat(t));
        n == null || n(), i == null || i();
      }
    },
    _mergeProps: function(t) {
      for (var n = arguments.length, i = new Array(n > 1 ? n - 1 : 0), a = 1; a < n; a++)
        i[a - 1] = arguments[a];
      return Mf(t) ? t.apply(void 0, i) : nr.apply(void 0, i);
    },
    _load: function() {
      co.isStyleNameLoaded("base") || (ft.loadCSS(this.$styleOptions), this._loadGlobalStyles(), co.setLoadedStyleName("base")), this._loadThemeStyles();
    },
    _loadStyles: function() {
      this._load(), this._themeChangeListener(this._load);
    },
    _loadCoreStyles: function() {
      var t, n;
      !co.isStyleNameLoaded((t = this.$style) === null || t === void 0 ? void 0 : t.name) && (n = this.$style) !== null && n !== void 0 && n.name && (o0.loadCSS(this.$styleOptions), this.$options.style && this.$style.loadCSS(this.$styleOptions), co.setLoadedStyleName(this.$style.name));
    },
    _loadGlobalStyles: function() {
      var t = this._useGlobalPT(this._getOptionValue, "global.css", this.$params);
      dt(t) && ft.load(t, He({
        name: "global"
      }, this.$styleOptions));
    },
    _loadThemeStyles: function() {
      var t, n;
      if (!(this.isUnstyled || this.$theme === "none")) {
        if (!rt.isStyleNameLoaded("common")) {
          var i, a, s = ((i = this.$style) === null || i === void 0 || (a = i.getCommonTheme) === null || a === void 0 ? void 0 : a.call(i)) || {}, c = s.primitive, f = s.semantic, d = s.global, h = s.style;
          ft.load(c == null ? void 0 : c.css, He({
            name: "primitive-variables"
          }, this.$styleOptions)), ft.load(f == null ? void 0 : f.css, He({
            name: "semantic-variables"
          }, this.$styleOptions)), ft.load(d == null ? void 0 : d.css, He({
            name: "global-variables"
          }, this.$styleOptions)), ft.loadStyle(He({
            name: "global-style"
          }, this.$styleOptions), h), rt.setLoadedStyleName("common");
        }
        if (!rt.isStyleNameLoaded((t = this.$style) === null || t === void 0 ? void 0 : t.name) && (n = this.$style) !== null && n !== void 0 && n.name) {
          var m, b, v, _, x = ((m = this.$style) === null || m === void 0 || (b = m.getComponentTheme) === null || b === void 0 ? void 0 : b.call(m)) || {}, T = x.css, R = x.style;
          (v = this.$style) === null || v === void 0 || v.load(T, He({
            name: "".concat(this.$style.name, "-variables")
          }, this.$styleOptions)), (_ = this.$style) === null || _ === void 0 || _.loadStyle(He({
            name: "".concat(this.$style.name, "-style")
          }, this.$styleOptions), R), rt.setLoadedStyleName(this.$style.name);
        }
        if (!rt.isStyleNameLoaded("layer-order")) {
          var D, K, L = (D = this.$style) === null || D === void 0 || (K = D.getLayerOrderThemeCSS) === null || K === void 0 ? void 0 : K.call(D);
          ft.load(L, He({
            name: "layer-order",
            first: !0
          }, this.$styleOptions)), rt.setLoadedStyleName("layer-order");
        }
      }
    },
    _loadScopedThemeStyles: function(t) {
      var n, i, a, s = ((n = this.$style) === null || n === void 0 || (i = n.getPresetTheme) === null || i === void 0 ? void 0 : i.call(n, t, "[".concat(this.$attrSelector, "]"))) || {}, c = s.css, f = (a = this.$style) === null || a === void 0 ? void 0 : a.load(c, He({
        name: "".concat(this.$attrSelector, "-").concat(this.$style.name)
      }, this.$styleOptions));
      this.scopedStyleEl = f.el;
    },
    _unloadScopedThemeStyles: function() {
      var t;
      (t = this.scopedStyleEl) === null || t === void 0 || (t = t.value) === null || t === void 0 || t.remove();
    },
    _themeChangeListener: function() {
      var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : function() {
      };
      co.clearLoadedStyleNames(), jt.on("theme:change", t);
    },
    _removeThemeListeners: function() {
      jt.off("theme:change", this._loadCoreStyles), jt.off("theme:change", this._load), jt.off("theme:change", this._themeScopedListener);
    },
    _getHostInstance: function(t) {
      return t ? this.$options.hostName ? t.$.type.name === this.$options.hostName ? t : this._getHostInstance(t.$parentInstance) : t.$parentInstance : void 0;
    },
    _getPropValue: function(t) {
      var n;
      return this[t] || ((n = this._getHostInstance(this)) === null || n === void 0 ? void 0 : n[t]);
    },
    _getOptionValue: function(t) {
      var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "", i = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
      return jf(t, n, i);
    },
    _getPTValue: function() {
      var t, n = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, i = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "", a = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {}, s = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : !0, c = /./g.test(i) && !!a[i.split(".")[0]], f = this._getPropValue("ptOptions") || ((t = this.$primevueConfig) === null || t === void 0 ? void 0 : t.ptOptions) || {}, d = f.mergeSections, h = d === void 0 ? !0 : d, m = f.mergeProps, b = m === void 0 ? !1 : m, v = s ? c ? this._useGlobalPT(this._getPTClassValue, i, a) : this._useDefaultPT(this._getPTClassValue, i, a) : void 0, _ = c ? void 0 : this._getPTSelf(n, this._getPTClassValue, i, He(He({}, a), {}, {
        global: v || {}
      })), x = this._getPTDatasets(i);
      return h || !h && _ ? b ? this._mergeProps(b, v, _, x) : He(He(He({}, v), _), x) : He(He({}, _), x);
    },
    _getPTSelf: function() {
      for (var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, n = arguments.length, i = new Array(n > 1 ? n - 1 : 0), a = 1; a < n; a++)
        i[a - 1] = arguments[a];
      return nr(
        this._usePT.apply(this, [this._getPT(t, this.$name)].concat(i)),
        // Exp; <component :pt="{}"
        this._usePT.apply(this, [this.$_attrsPT].concat(i))
        // Exp; <component :pt:[passthrough_key]:[attribute]="{value}" or <component :pt:[passthrough_key]="() =>{value}"
      );
    },
    _getPTDatasets: function() {
      var t, n, i = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", a = "data-pc-", s = i === "root" && dt((t = this.pt) === null || t === void 0 ? void 0 : t["data-pc-section"]);
      return i !== "transition" && He(He({}, i === "root" && He(He(Nl({}, "".concat(a, "name"), cn(s ? (n = this.pt) === null || n === void 0 ? void 0 : n["data-pc-section"] : this.$.type.name)), s && Nl({}, "".concat(a, "extend"), cn(this.$.type.name))), {}, Nl({}, "".concat(this.$attrSelector), ""))), {}, Nl({}, "".concat(a, "section"), cn(i)));
    },
    _getPTClassValue: function() {
      var t = this._getOptionValue.apply(this, arguments);
      return mr(t) || ku(t) ? {
        class: t
      } : t;
    },
    _getPT: function(t) {
      var n = this, i = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "", a = arguments.length > 2 ? arguments[2] : void 0, s = function(f) {
        var d, h = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !1, m = a ? a(f) : f, b = cn(i), v = cn(n.$name);
        return (d = h ? b !== v ? m == null ? void 0 : m[b] : void 0 : m == null ? void 0 : m[b]) !== null && d !== void 0 ? d : m;
      };
      return t != null && t.hasOwnProperty("_usept") ? {
        _usept: t._usept,
        originalValue: s(t.originalValue),
        value: s(t.value)
      } : s(t, !0);
    },
    _usePT: function(t, n, i, a) {
      var s = function(T) {
        return n(T, i, a);
      };
      if (t != null && t.hasOwnProperty("_usept")) {
        var c, f = t._usept || ((c = this.$primevueConfig) === null || c === void 0 ? void 0 : c.ptOptions) || {}, d = f.mergeSections, h = d === void 0 ? !0 : d, m = f.mergeProps, b = m === void 0 ? !1 : m, v = s(t.originalValue), _ = s(t.value);
        return v === void 0 && _ === void 0 ? void 0 : mr(_) ? _ : mr(v) ? v : h || !h && _ ? b ? this._mergeProps(b, v, _) : He(He({}, v), _) : _;
      }
      return s(t);
    },
    _useGlobalPT: function(t, n, i) {
      return this._usePT(this.globalPT, t, n, i);
    },
    _useDefaultPT: function(t, n, i) {
      return this._usePT(this.defaultPT, t, n, i);
    },
    ptm: function() {
      var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
      return this._getPTValue(this.pt, t, He(He({}, this.$params), n));
    },
    ptmi: function() {
      var t, n = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", i = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, a = nr(this.$_attrsWithoutPT, this.ptm(n, i));
      return a != null && a.hasOwnProperty("id") && ((t = a.id) !== null && t !== void 0 || (a.id = this.$id)), a;
    },
    ptmo: function() {
      var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "", i = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
      return this._getPTValue(t, n, He({
        instance: this
      }, i), !1);
    },
    cx: function() {
      var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
      return this.isUnstyled ? void 0 : this._getOptionValue(this.$style.classes, t, He(He({}, this.$params), n));
    },
    sx: function() {
      var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !0, i = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
      if (n) {
        var a = this._getOptionValue(this.$style.inlineStyles, t, He(He({}, this.$params), i)), s = this._getOptionValue(o0.inlineStyles, t, He(He({}, this.$params), i));
        return [s, a];
      }
    }
  },
  computed: {
    globalPT: function() {
      var t, n = this;
      return this._getPT((t = this.$primevueConfig) === null || t === void 0 ? void 0 : t.pt, void 0, function(i) {
        return Ar(i, {
          instance: n
        });
      });
    },
    defaultPT: function() {
      var t, n = this;
      return this._getPT((t = this.$primevueConfig) === null || t === void 0 ? void 0 : t.pt, void 0, function(i) {
        return n._getOptionValue(i, n.$name, He({}, n.$params)) || Ar(i, He({}, n.$params));
      });
    },
    isUnstyled: function() {
      var t;
      return this.unstyled !== void 0 ? this.unstyled : (t = this.$primevueConfig) === null || t === void 0 ? void 0 : t.unstyled;
    },
    $id: function() {
      return this.$attrs.id || this.uid;
    },
    $inProps: function() {
      var t, n = Object.keys(((t = this.$.vnode) === null || t === void 0 ? void 0 : t.props) || {});
      return Object.fromEntries(Object.entries(this.$props).filter(function(i) {
        var a = $l(i, 1), s = a[0];
        return n == null ? void 0 : n.includes(s);
      }));
    },
    $theme: function() {
      var t;
      return (t = this.$primevueConfig) === null || t === void 0 ? void 0 : t.theme;
    },
    $style: function() {
      return He(He({
        classes: void 0,
        inlineStyles: void 0,
        load: function() {
        },
        loadCSS: function() {
        },
        loadStyle: function() {
        }
      }, (this._getHostInstance(this) || {}).$style), this.$options.style);
    },
    $styleOptions: function() {
      var t;
      return {
        nonce: (t = this.$primevueConfig) === null || t === void 0 || (t = t.csp) === null || t === void 0 ? void 0 : t.nonce
      };
    },
    $primevueConfig: function() {
      var t;
      return (t = this.$primevue) === null || t === void 0 ? void 0 : t.config;
    },
    $name: function() {
      return this.$options.hostName || this.$.type.name;
    },
    $params: function() {
      var t = this._getHostInstance(this) || this.$parent;
      return {
        instance: this,
        props: this.$props,
        state: this.$data,
        attrs: this.$attrs,
        parent: {
          instance: t,
          props: t == null ? void 0 : t.$props,
          state: t == null ? void 0 : t.$data,
          attrs: t == null ? void 0 : t.$attrs
        }
      };
    },
    $_attrsPT: function() {
      return Object.entries(this.$attrs || {}).filter(function(t) {
        var n = $l(t, 1), i = n[0];
        return i == null ? void 0 : i.startsWith("pt:");
      }).reduce(function(t, n) {
        var i = $l(n, 2), a = i[0], s = i[1], c = a.split(":"), f = dR(c), d = f.slice(1);
        return d == null || d.reduce(function(h, m, b, v) {
          return !h[m] && (h[m] = b === v.length - 1 ? s : {}), h[m];
        }, t), t;
      }, {});
    },
    $_attrsWithoutPT: function() {
      return Object.entries(this.$attrs || {}).filter(function(t) {
        var n = $l(t, 1), i = n[0];
        return !(i != null && i.startsWith("pt:"));
      }).reduce(function(t, n) {
        var i = $l(n, 2), a = i[0], s = i[1];
        return t[a] = s, t;
      }, {});
    }
  }
}, mR = `
.p-icon {
    display: inline-block;
    vertical-align: baseline;
}

.p-icon-spin {
    -webkit-animation: p-icon-spin 2s infinite linear;
    animation: p-icon-spin 2s infinite linear;
}

@-webkit-keyframes p-icon-spin {
    0% {
        -webkit-transform: rotate(0deg);
        transform: rotate(0deg);
    }
    100% {
        -webkit-transform: rotate(359deg);
        transform: rotate(359deg);
    }
}

@keyframes p-icon-spin {
    0% {
        -webkit-transform: rotate(0deg);
        transform: rotate(0deg);
    }
    100% {
        -webkit-transform: rotate(359deg);
        transform: rotate(359deg);
    }
}
`, vR = ft.extend({
  name: "baseicon",
  css: mR
});
function la(e) {
  "@babel/helpers - typeof";
  return la = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, la(e);
}
function a0(e, t) {
  var n = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var i = Object.getOwnPropertySymbols(e);
    t && (i = i.filter(function(a) {
      return Object.getOwnPropertyDescriptor(e, a).enumerable;
    })), n.push.apply(n, i);
  }
  return n;
}
function s0(e) {
  for (var t = 1; t < arguments.length; t++) {
    var n = arguments[t] != null ? arguments[t] : {};
    t % 2 ? a0(Object(n), !0).forEach(function(i) {
      bR(e, i, n[i]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : a0(Object(n)).forEach(function(i) {
      Object.defineProperty(e, i, Object.getOwnPropertyDescriptor(n, i));
    });
  }
  return e;
}
function bR(e, t, n) {
  return (t = yR(t)) in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
function yR(e) {
  var t = _R(e, "string");
  return la(t) == "symbol" ? t : t + "";
}
function _R(e, t) {
  if (la(e) != "object" || !e) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var i = n.call(e, t);
    if (la(i) != "object") return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var kR = {
  name: "BaseIcon",
  extends: Ff,
  props: {
    label: {
      type: String,
      default: void 0
    },
    spin: {
      type: Boolean,
      default: !1
    }
  },
  style: vR,
  provide: function() {
    return {
      $pcIcon: this,
      $parentInstance: this
    };
  },
  methods: {
    pti: function() {
      var t = Mn(this.label);
      return s0(s0({}, !this.isUnstyled && {
        class: ["p-icon", {
          "p-icon-spin": this.spin
        }]
      }), {}, {
        role: t ? void 0 : "img",
        "aria-label": t ? void 0 : this.label,
        "aria-hidden": t
      });
    }
  }
}, Vb = {
  name: "SpinnerIcon",
  extends: kR
};
function wR(e, t, n, i, a, s) {
  return It(), mn("svg", nr({
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, e.pti()), t[0] || (t[0] = [hr("path", {
    d: "M6.99701 14C5.85441 13.999 4.72939 13.7186 3.72012 13.1832C2.71084 12.6478 1.84795 11.8737 1.20673 10.9284C0.565504 9.98305 0.165424 8.89526 0.041387 7.75989C-0.0826496 6.62453 0.073125 5.47607 0.495122 4.4147C0.917119 3.35333 1.59252 2.4113 2.46241 1.67077C3.33229 0.930247 4.37024 0.413729 5.4857 0.166275C6.60117 -0.0811796 7.76026 -0.0520535 8.86188 0.251112C9.9635 0.554278 10.9742 1.12227 11.8057 1.90555C11.915 2.01493 11.9764 2.16319 11.9764 2.31778C11.9764 2.47236 11.915 2.62062 11.8057 2.73C11.7521 2.78503 11.688 2.82877 11.6171 2.85864C11.5463 2.8885 11.4702 2.90389 11.3933 2.90389C11.3165 2.90389 11.2404 2.8885 11.1695 2.85864C11.0987 2.82877 11.0346 2.78503 10.9809 2.73C9.9998 1.81273 8.73246 1.26138 7.39226 1.16876C6.05206 1.07615 4.72086 1.44794 3.62279 2.22152C2.52471 2.99511 1.72683 4.12325 1.36345 5.41602C1.00008 6.70879 1.09342 8.08723 1.62775 9.31926C2.16209 10.5513 3.10478 11.5617 4.29713 12.1803C5.48947 12.7989 6.85865 12.988 8.17414 12.7157C9.48963 12.4435 10.6711 11.7264 11.5196 10.6854C12.3681 9.64432 12.8319 8.34282 12.8328 7C12.8328 6.84529 12.8943 6.69692 13.0038 6.58752C13.1132 6.47812 13.2616 6.41667 13.4164 6.41667C13.5712 6.41667 13.7196 6.47812 13.8291 6.58752C13.9385 6.69692 14 6.84529 14 7C14 8.85651 13.2622 10.637 11.9489 11.9497C10.6356 13.2625 8.85432 14 6.99701 14Z",
    fill: "currentColor"
  }, null, -1)]), 16);
}
Vb.render = wR;
var SR = ({ dt: e }) => `
.p-badge {
    display: inline-flex;
    border-radius: ${e("badge.border.radius")};
    align-items: center;
    justify-content: center;
    padding: ${e("badge.padding")};
    background: ${e("badge.primary.background")};
    color: ${e("badge.primary.color")};
    font-size: ${e("badge.font.size")};
    font-weight: ${e("badge.font.weight")};
    min-width: ${e("badge.min.width")};
    height: ${e("badge.height")};
}

.p-badge-dot {
    width: ${e("badge.dot.size")};
    min-width: ${e("badge.dot.size")};
    height: ${e("badge.dot.size")};
    border-radius: 50%;
    padding: 0;
}

.p-badge-circle {
    padding: 0;
    border-radius: 50%;
}

.p-badge-secondary {
    background: ${e("badge.secondary.background")};
    color: ${e("badge.secondary.color")};
}

.p-badge-success {
    background: ${e("badge.success.background")};
    color: ${e("badge.success.color")};
}

.p-badge-info {
    background: ${e("badge.info.background")};
    color: ${e("badge.info.color")};
}

.p-badge-warn {
    background: ${e("badge.warn.background")};
    color: ${e("badge.warn.color")};
}

.p-badge-danger {
    background: ${e("badge.danger.background")};
    color: ${e("badge.danger.color")};
}

.p-badge-contrast {
    background: ${e("badge.contrast.background")};
    color: ${e("badge.contrast.color")};
}

.p-badge-sm {
    font-size: ${e("badge.sm.font.size")};
    min-width: ${e("badge.sm.min.width")};
    height: ${e("badge.sm.height")};
}

.p-badge-lg {
    font-size: ${e("badge.lg.font.size")};
    min-width: ${e("badge.lg.min.width")};
    height: ${e("badge.lg.height")};
}

.p-badge-xl {
    font-size: ${e("badge.xl.font.size")};
    min-width: ${e("badge.xl.min.width")};
    height: ${e("badge.xl.height")};
}
`, CR = {
  root: function(t) {
    var n = t.props, i = t.instance;
    return ["p-badge p-component", {
      "p-badge-circle": dt(n.value) && String(n.value).length === 1,
      "p-badge-dot": Mn(n.value) && !i.$slots.default,
      "p-badge-sm": n.size === "small",
      "p-badge-lg": n.size === "large",
      "p-badge-xl": n.size === "xlarge",
      "p-badge-info": n.severity === "info",
      "p-badge-success": n.severity === "success",
      "p-badge-warn": n.severity === "warn",
      "p-badge-danger": n.severity === "danger",
      "p-badge-secondary": n.severity === "secondary",
      "p-badge-contrast": n.severity === "contrast"
    }];
  }
}, xR = ft.extend({
  name: "badge",
  style: SR,
  classes: CR
}), $R = {
  name: "BaseBadge",
  extends: Ff,
  props: {
    value: {
      type: [String, Number],
      default: null
    },
    severity: {
      type: String,
      default: null
    },
    size: {
      type: String,
      default: null
    }
  },
  style: xR,
  provide: function() {
    return {
      $pcBadge: this,
      $parentInstance: this
    };
  }
};
function aa(e) {
  "@babel/helpers - typeof";
  return aa = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, aa(e);
}
function u0(e, t, n) {
  return (t = ER(t)) in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
function ER(e) {
  var t = TR(e, "string");
  return aa(t) == "symbol" ? t : t + "";
}
function TR(e, t) {
  if (aa(e) != "object" || !e) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var i = n.call(e, t);
    if (aa(i) != "object") return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var Hb = {
  name: "Badge",
  extends: $R,
  inheritAttrs: !1,
  computed: {
    dataP: function() {
      return zl(u0(u0({
        circle: this.value != null && String(this.value).length === 1,
        empty: this.value == null && !this.$slots.default
      }, this.severity, this.severity), this.size, this.size));
    }
  }
}, OR = ["data-p"];
function LR(e, t, n, i, a, s) {
  return It(), mn("span", nr({
    class: e.cx("root"),
    "data-p": s.dataP
  }, e.ptmi("root")), [Ol(e.$slots, "default", {}, function() {
    return [Hs(An(e.value), 1)];
  })], 16, OR);
}
Hb.render = LR;
var PR = ({ dt: e }) => `
.p-ink {
    display: block;
    position: absolute;
    background: ${e("ripple.background")};
    border-radius: 100%;
    transform: scale(0);
    pointer-events: none;
}

.p-ink-active {
    animation: ripple 0.4s linear;
}

@keyframes ripple {
    100% {
        opacity: 0;
        transform: scale(2.5);
    }
}
`, NR = {
  root: "p-ink"
}, RR = ft.extend({
  name: "ripple-directive",
  style: PR,
  classes: NR
}), IR = je.extend({
  style: RR
});
function sa(e) {
  "@babel/helpers - typeof";
  return sa = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, sa(e);
}
function AR(e) {
  return jR(e) || MR(e) || DR(e) || BR();
}
function BR() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function DR(e, t) {
  if (e) {
    if (typeof e == "string") return of(e, t);
    var n = {}.toString.call(e).slice(8, -1);
    return n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set" ? Array.from(e) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? of(e, t) : void 0;
  }
}
function MR(e) {
  if (typeof Symbol < "u" && e[Symbol.iterator] != null || e["@@iterator"] != null) return Array.from(e);
}
function jR(e) {
  if (Array.isArray(e)) return of(e);
}
function of(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var n = 0, i = Array(t); n < t; n++) i[n] = e[n];
  return i;
}
function c0(e, t, n) {
  return (t = FR(t)) in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
function FR(e) {
  var t = zR(e, "string");
  return sa(t) == "symbol" ? t : t + "";
}
function zR(e, t) {
  if (sa(e) != "object" || !e) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var i = n.call(e, t);
    if (sa(i) != "object") return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var UR = IR.extend("ripple", {
  watch: {
    "config.ripple": function(t) {
      t ? (this.createRipple(this.$host), this.bindEvents(this.$host), this.$host.setAttribute("data-pd-ripple", !0), this.$host.style.overflow = "hidden", this.$host.style.position = "relative") : (this.remove(this.$host), this.$host.removeAttribute("data-pd-ripple"));
    }
  },
  unmounted: function(t) {
    this.remove(t);
  },
  timeout: void 0,
  methods: {
    bindEvents: function(t) {
      t.addEventListener("mousedown", this.onMouseDown.bind(this));
    },
    unbindEvents: function(t) {
      t.removeEventListener("mousedown", this.onMouseDown.bind(this));
    },
    createRipple: function(t) {
      var n = this.getInk(t);
      n || (n = Ms("span", c0(c0({
        role: "presentation",
        "aria-hidden": !0,
        "data-p-ink": !0,
        "data-p-ink-active": !1,
        class: !this.isUnstyled() && this.cx("root"),
        onAnimationEnd: this.onAnimationEnd.bind(this)
      }, this.$attrSelector, ""), "p-bind", this.ptm("root"))), t.appendChild(n), this.$el = n);
    },
    remove: function(t) {
      var n = this.getInk(t);
      n && (this.$host.style.overflow = "", this.$host.style.position = "", this.unbindEvents(t), n.removeEventListener("animationend", this.onAnimationEnd), n.remove());
    },
    onMouseDown: function(t) {
      var n = this, i = t.currentTarget, a = this.getInk(i);
      if (!(!a || getComputedStyle(a, null).display === "none")) {
        if (!this.isUnstyled() && Ds(a, "p-ink-active"), a.setAttribute("data-p-ink-active", "false"), !Fm(a) && !zm(a)) {
          var s = Math.max(Pr(i), ao(i));
          a.style.height = s + "px", a.style.width = s + "px";
        }
        var c = BC(i), f = t.pageX - c.left + document.body.scrollTop - zm(a) / 2, d = t.pageY - c.top + document.body.scrollLeft - Fm(a) / 2;
        a.style.top = d + "px", a.style.left = f + "px", !this.isUnstyled() && Rb(a, "p-ink-active"), a.setAttribute("data-p-ink-active", "true"), this.timeout = setTimeout(function() {
          a && (!n.isUnstyled() && Ds(a, "p-ink-active"), a.setAttribute("data-p-ink-active", "false"));
        }, 401);
      }
    },
    onAnimationEnd: function(t) {
      this.timeout && clearTimeout(this.timeout), !this.isUnstyled() && Ds(t.currentTarget, "p-ink-active"), t.currentTarget.setAttribute("data-p-ink-active", "false");
    },
    getInk: function(t) {
      return t && t.children ? AR(t.children).find(function(n) {
        return Uo(n, "data-pc-name") === "ripple";
      }) : void 0;
    }
  }
}), WR = ({ dt: e }) => `
.p-button {
    display: inline-flex;
    cursor: pointer;
    user-select: none;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    position: relative;
    color: ${e("button.primary.color")};
    background: ${e("button.primary.background")};
    border: 1px solid ${e("button.primary.border.color")};
    padding: ${e("button.padding.y")} ${e("button.padding.x")};
    font-size: 1rem;
    font-family: inherit;
    font-feature-settings: inherit;
    transition: background ${e("button.transition.duration")}, color ${e("button.transition.duration")}, border-color ${e("button.transition.duration")},
            outline-color ${e("button.transition.duration")}, box-shadow ${e("button.transition.duration")};
    border-radius: ${e("button.border.radius")};
    outline-color: transparent;
    gap: ${e("button.gap")};
}

.p-button:disabled {
    cursor: default;
}

.p-button-icon-right {
    order: 1;
}

.p-button-icon-right:dir(rtl) {
    order: -1;
}

.p-button:not(.p-button-vertical) .p-button-icon:not(.p-button-icon-right):dir(rtl) {
    order: 1;
}

.p-button-icon-bottom {
    order: 2;
}

.p-button-icon-only {
    width: ${e("button.icon.only.width")};
    padding-inline-start: 0;
    padding-inline-end: 0;
    gap: 0;
}

.p-button-icon-only.p-button-rounded {
    border-radius: 50%;
    height: ${e("button.icon.only.width")};
}

.p-button-icon-only .p-button-label {
    visibility: hidden;
    width: 0;
}

.p-button-sm {
    font-size: ${e("button.sm.font.size")};
    padding: ${e("button.sm.padding.y")} ${e("button.sm.padding.x")};
}

.p-button-sm .p-button-icon {
    font-size: ${e("button.sm.font.size")};
}

.p-button-sm.p-button-icon-only {
    width: ${e("button.sm.icon.only.width")};
}

.p-button-sm.p-button-icon-only.p-button-rounded {
    height: ${e("button.sm.icon.only.width")};
}

.p-button-lg {
    font-size: ${e("button.lg.font.size")};
    padding: ${e("button.lg.padding.y")} ${e("button.lg.padding.x")};
}

.p-button-lg .p-button-icon {
    font-size: ${e("button.lg.font.size")};
}

.p-button-lg.p-button-icon-only {
    width: ${e("button.lg.icon.only.width")};
}

.p-button-lg.p-button-icon-only.p-button-rounded {
    height: ${e("button.lg.icon.only.width")};
}

.p-button-vertical {
    flex-direction: column;
}

.p-button-label {
    font-weight: ${e("button.label.font.weight")};
}

.p-button-fluid {
    width: 100%;
}

.p-button-fluid.p-button-icon-only {
    width: ${e("button.icon.only.width")};
}

.p-button:not(:disabled):hover {
    background: ${e("button.primary.hover.background")};
    border: 1px solid ${e("button.primary.hover.border.color")};
    color: ${e("button.primary.hover.color")};
}

.p-button:not(:disabled):active {
    background: ${e("button.primary.active.background")};
    border: 1px solid ${e("button.primary.active.border.color")};
    color: ${e("button.primary.active.color")};
}

.p-button:focus-visible {
    box-shadow: ${e("button.primary.focus.ring.shadow")};
    outline: ${e("button.focus.ring.width")} ${e("button.focus.ring.style")} ${e("button.primary.focus.ring.color")};
    outline-offset: ${e("button.focus.ring.offset")};
}

.p-button .p-badge {
    min-width: ${e("button.badge.size")};
    height: ${e("button.badge.size")};
    line-height: ${e("button.badge.size")};
}

.p-button-raised {
    box-shadow: ${e("button.raised.shadow")};
}

.p-button-rounded {
    border-radius: ${e("button.rounded.border.radius")};
}

.p-button-secondary {
    background: ${e("button.secondary.background")};
    border: 1px solid ${e("button.secondary.border.color")};
    color: ${e("button.secondary.color")};
}

.p-button-secondary:not(:disabled):hover {
    background: ${e("button.secondary.hover.background")};
    border: 1px solid ${e("button.secondary.hover.border.color")};
    color: ${e("button.secondary.hover.color")};
}

.p-button-secondary:not(:disabled):active {
    background: ${e("button.secondary.active.background")};
    border: 1px solid ${e("button.secondary.active.border.color")};
    color: ${e("button.secondary.active.color")};
}

.p-button-secondary:focus-visible {
    outline-color: ${e("button.secondary.focus.ring.color")};
    box-shadow: ${e("button.secondary.focus.ring.shadow")};
}

.p-button-success {
    background: ${e("button.success.background")};
    border: 1px solid ${e("button.success.border.color")};
    color: ${e("button.success.color")};
}

.p-button-success:not(:disabled):hover {
    background: ${e("button.success.hover.background")};
    border: 1px solid ${e("button.success.hover.border.color")};
    color: ${e("button.success.hover.color")};
}

.p-button-success:not(:disabled):active {
    background: ${e("button.success.active.background")};
    border: 1px solid ${e("button.success.active.border.color")};
    color: ${e("button.success.active.color")};
}

.p-button-success:focus-visible {
    outline-color: ${e("button.success.focus.ring.color")};
    box-shadow: ${e("button.success.focus.ring.shadow")};
}

.p-button-info {
    background: ${e("button.info.background")};
    border: 1px solid ${e("button.info.border.color")};
    color: ${e("button.info.color")};
}

.p-button-info:not(:disabled):hover {
    background: ${e("button.info.hover.background")};
    border: 1px solid ${e("button.info.hover.border.color")};
    color: ${e("button.info.hover.color")};
}

.p-button-info:not(:disabled):active {
    background: ${e("button.info.active.background")};
    border: 1px solid ${e("button.info.active.border.color")};
    color: ${e("button.info.active.color")};
}

.p-button-info:focus-visible {
    outline-color: ${e("button.info.focus.ring.color")};
    box-shadow: ${e("button.info.focus.ring.shadow")};
}

.p-button-warn {
    background: ${e("button.warn.background")};
    border: 1px solid ${e("button.warn.border.color")};
    color: ${e("button.warn.color")};
}

.p-button-warn:not(:disabled):hover {
    background: ${e("button.warn.hover.background")};
    border: 1px solid ${e("button.warn.hover.border.color")};
    color: ${e("button.warn.hover.color")};
}

.p-button-warn:not(:disabled):active {
    background: ${e("button.warn.active.background")};
    border: 1px solid ${e("button.warn.active.border.color")};
    color: ${e("button.warn.active.color")};
}

.p-button-warn:focus-visible {
    outline-color: ${e("button.warn.focus.ring.color")};
    box-shadow: ${e("button.warn.focus.ring.shadow")};
}

.p-button-help {
    background: ${e("button.help.background")};
    border: 1px solid ${e("button.help.border.color")};
    color: ${e("button.help.color")};
}

.p-button-help:not(:disabled):hover {
    background: ${e("button.help.hover.background")};
    border: 1px solid ${e("button.help.hover.border.color")};
    color: ${e("button.help.hover.color")};
}

.p-button-help:not(:disabled):active {
    background: ${e("button.help.active.background")};
    border: 1px solid ${e("button.help.active.border.color")};
    color: ${e("button.help.active.color")};
}

.p-button-help:focus-visible {
    outline-color: ${e("button.help.focus.ring.color")};
    box-shadow: ${e("button.help.focus.ring.shadow")};
}

.p-button-danger {
    background: ${e("button.danger.background")};
    border: 1px solid ${e("button.danger.border.color")};
    color: ${e("button.danger.color")};
}

.p-button-danger:not(:disabled):hover {
    background: ${e("button.danger.hover.background")};
    border: 1px solid ${e("button.danger.hover.border.color")};
    color: ${e("button.danger.hover.color")};
}

.p-button-danger:not(:disabled):active {
    background: ${e("button.danger.active.background")};
    border: 1px solid ${e("button.danger.active.border.color")};
    color: ${e("button.danger.active.color")};
}

.p-button-danger:focus-visible {
    outline-color: ${e("button.danger.focus.ring.color")};
    box-shadow: ${e("button.danger.focus.ring.shadow")};
}

.p-button-contrast {
    background: ${e("button.contrast.background")};
    border: 1px solid ${e("button.contrast.border.color")};
    color: ${e("button.contrast.color")};
}

.p-button-contrast:not(:disabled):hover {
    background: ${e("button.contrast.hover.background")};
    border: 1px solid ${e("button.contrast.hover.border.color")};
    color: ${e("button.contrast.hover.color")};
}

.p-button-contrast:not(:disabled):active {
    background: ${e("button.contrast.active.background")};
    border: 1px solid ${e("button.contrast.active.border.color")};
    color: ${e("button.contrast.active.color")};
}

.p-button-contrast:focus-visible {
    outline-color: ${e("button.contrast.focus.ring.color")};
    box-shadow: ${e("button.contrast.focus.ring.shadow")};
}

.p-button-outlined {
    background: transparent;
    border-color: ${e("button.outlined.primary.border.color")};
    color: ${e("button.outlined.primary.color")};
}

.p-button-outlined:not(:disabled):hover {
    background: ${e("button.outlined.primary.hover.background")};
    border-color: ${e("button.outlined.primary.border.color")};
    color: ${e("button.outlined.primary.color")};
}

.p-button-outlined:not(:disabled):active {
    background: ${e("button.outlined.primary.active.background")};
    border-color: ${e("button.outlined.primary.border.color")};
    color: ${e("button.outlined.primary.color")};
}

.p-button-outlined.p-button-secondary {
    border-color: ${e("button.outlined.secondary.border.color")};
    color: ${e("button.outlined.secondary.color")};
}

.p-button-outlined.p-button-secondary:not(:disabled):hover {
    background: ${e("button.outlined.secondary.hover.background")};
    border-color: ${e("button.outlined.secondary.border.color")};
    color: ${e("button.outlined.secondary.color")};
}

.p-button-outlined.p-button-secondary:not(:disabled):active {
    background: ${e("button.outlined.secondary.active.background")};
    border-color: ${e("button.outlined.secondary.border.color")};
    color: ${e("button.outlined.secondary.color")};
}

.p-button-outlined.p-button-success {
    border-color: ${e("button.outlined.success.border.color")};
    color: ${e("button.outlined.success.color")};
}

.p-button-outlined.p-button-success:not(:disabled):hover {
    background: ${e("button.outlined.success.hover.background")};
    border-color: ${e("button.outlined.success.border.color")};
    color: ${e("button.outlined.success.color")};
}

.p-button-outlined.p-button-success:not(:disabled):active {
    background: ${e("button.outlined.success.active.background")};
    border-color: ${e("button.outlined.success.border.color")};
    color: ${e("button.outlined.success.color")};
}

.p-button-outlined.p-button-info {
    border-color: ${e("button.outlined.info.border.color")};
    color: ${e("button.outlined.info.color")};
}

.p-button-outlined.p-button-info:not(:disabled):hover {
    background: ${e("button.outlined.info.hover.background")};
    border-color: ${e("button.outlined.info.border.color")};
    color: ${e("button.outlined.info.color")};
}

.p-button-outlined.p-button-info:not(:disabled):active {
    background: ${e("button.outlined.info.active.background")};
    border-color: ${e("button.outlined.info.border.color")};
    color: ${e("button.outlined.info.color")};
}

.p-button-outlined.p-button-warn {
    border-color: ${e("button.outlined.warn.border.color")};
    color: ${e("button.outlined.warn.color")};
}

.p-button-outlined.p-button-warn:not(:disabled):hover {
    background: ${e("button.outlined.warn.hover.background")};
    border-color: ${e("button.outlined.warn.border.color")};
    color: ${e("button.outlined.warn.color")};
}

.p-button-outlined.p-button-warn:not(:disabled):active {
    background: ${e("button.outlined.warn.active.background")};
    border-color: ${e("button.outlined.warn.border.color")};
    color: ${e("button.outlined.warn.color")};
}

.p-button-outlined.p-button-help {
    border-color: ${e("button.outlined.help.border.color")};
    color: ${e("button.outlined.help.color")};
}

.p-button-outlined.p-button-help:not(:disabled):hover {
    background: ${e("button.outlined.help.hover.background")};
    border-color: ${e("button.outlined.help.border.color")};
    color: ${e("button.outlined.help.color")};
}

.p-button-outlined.p-button-help:not(:disabled):active {
    background: ${e("button.outlined.help.active.background")};
    border-color: ${e("button.outlined.help.border.color")};
    color: ${e("button.outlined.help.color")};
}

.p-button-outlined.p-button-danger {
    border-color: ${e("button.outlined.danger.border.color")};
    color: ${e("button.outlined.danger.color")};
}

.p-button-outlined.p-button-danger:not(:disabled):hover {
    background: ${e("button.outlined.danger.hover.background")};
    border-color: ${e("button.outlined.danger.border.color")};
    color: ${e("button.outlined.danger.color")};
}

.p-button-outlined.p-button-danger:not(:disabled):active {
    background: ${e("button.outlined.danger.active.background")};
    border-color: ${e("button.outlined.danger.border.color")};
    color: ${e("button.outlined.danger.color")};
}

.p-button-outlined.p-button-contrast {
    border-color: ${e("button.outlined.contrast.border.color")};
    color: ${e("button.outlined.contrast.color")};
}

.p-button-outlined.p-button-contrast:not(:disabled):hover {
    background: ${e("button.outlined.contrast.hover.background")};
    border-color: ${e("button.outlined.contrast.border.color")};
    color: ${e("button.outlined.contrast.color")};
}

.p-button-outlined.p-button-contrast:not(:disabled):active {
    background: ${e("button.outlined.contrast.active.background")};
    border-color: ${e("button.outlined.contrast.border.color")};
    color: ${e("button.outlined.contrast.color")};
}

.p-button-outlined.p-button-plain {
    border-color: ${e("button.outlined.plain.border.color")};
    color: ${e("button.outlined.plain.color")};
}

.p-button-outlined.p-button-plain:not(:disabled):hover {
    background: ${e("button.outlined.plain.hover.background")};
    border-color: ${e("button.outlined.plain.border.color")};
    color: ${e("button.outlined.plain.color")};
}

.p-button-outlined.p-button-plain:not(:disabled):active {
    background: ${e("button.outlined.plain.active.background")};
    border-color: ${e("button.outlined.plain.border.color")};
    color: ${e("button.outlined.plain.color")};
}

.p-button-text {
    background: transparent;
    border-color: transparent;
    color: ${e("button.text.primary.color")};
}

.p-button-text:not(:disabled):hover {
    background: ${e("button.text.primary.hover.background")};
    border-color: transparent;
    color: ${e("button.text.primary.color")};
}

.p-button-text:not(:disabled):active {
    background: ${e("button.text.primary.active.background")};
    border-color: transparent;
    color: ${e("button.text.primary.color")};
}

.p-button-text.p-button-secondary {
    background: transparent;
    border-color: transparent;
    color: ${e("button.text.secondary.color")};
}

.p-button-text.p-button-secondary:not(:disabled):hover {
    background: ${e("button.text.secondary.hover.background")};
    border-color: transparent;
    color: ${e("button.text.secondary.color")};
}

.p-button-text.p-button-secondary:not(:disabled):active {
    background: ${e("button.text.secondary.active.background")};
    border-color: transparent;
    color: ${e("button.text.secondary.color")};
}

.p-button-text.p-button-success {
    background: transparent;
    border-color: transparent;
    color: ${e("button.text.success.color")};
}

.p-button-text.p-button-success:not(:disabled):hover {
    background: ${e("button.text.success.hover.background")};
    border-color: transparent;
    color: ${e("button.text.success.color")};
}

.p-button-text.p-button-success:not(:disabled):active {
    background: ${e("button.text.success.active.background")};
    border-color: transparent;
    color: ${e("button.text.success.color")};
}

.p-button-text.p-button-info {
    background: transparent;
    border-color: transparent;
    color: ${e("button.text.info.color")};
}

.p-button-text.p-button-info:not(:disabled):hover {
    background: ${e("button.text.info.hover.background")};
    border-color: transparent;
    color: ${e("button.text.info.color")};
}

.p-button-text.p-button-info:not(:disabled):active {
    background: ${e("button.text.info.active.background")};
    border-color: transparent;
    color: ${e("button.text.info.color")};
}

.p-button-text.p-button-warn {
    background: transparent;
    border-color: transparent;
    color: ${e("button.text.warn.color")};
}

.p-button-text.p-button-warn:not(:disabled):hover {
    background: ${e("button.text.warn.hover.background")};
    border-color: transparent;
    color: ${e("button.text.warn.color")};
}

.p-button-text.p-button-warn:not(:disabled):active {
    background: ${e("button.text.warn.active.background")};
    border-color: transparent;
    color: ${e("button.text.warn.color")};
}

.p-button-text.p-button-help {
    background: transparent;
    border-color: transparent;
    color: ${e("button.text.help.color")};
}

.p-button-text.p-button-help:not(:disabled):hover {
    background: ${e("button.text.help.hover.background")};
    border-color: transparent;
    color: ${e("button.text.help.color")};
}

.p-button-text.p-button-help:not(:disabled):active {
    background: ${e("button.text.help.active.background")};
    border-color: transparent;
    color: ${e("button.text.help.color")};
}

.p-button-text.p-button-danger {
    background: transparent;
    border-color: transparent;
    color: ${e("button.text.danger.color")};
}

.p-button-text.p-button-danger:not(:disabled):hover {
    background: ${e("button.text.danger.hover.background")};
    border-color: transparent;
    color: ${e("button.text.danger.color")};
}

.p-button-text.p-button-danger:not(:disabled):active {
    background: ${e("button.text.danger.active.background")};
    border-color: transparent;
    color: ${e("button.text.danger.color")};
}

.p-button-text.p-button-contrast {
    background: transparent;
    border-color: transparent;
    color: ${e("button.text.contrast.color")};
}

.p-button-text.p-button-contrast:not(:disabled):hover {
    background: ${e("button.text.contrast.hover.background")};
    border-color: transparent;
    color: ${e("button.text.contrast.color")};
}

.p-button-text.p-button-contrast:not(:disabled):active {
    background: ${e("button.text.contrast.active.background")};
    border-color: transparent;
    color: ${e("button.text.contrast.color")};
}

.p-button-text.p-button-plain {
    background: transparent;
    border-color: transparent;
    color: ${e("button.text.plain.color")};
}

.p-button-text.p-button-plain:not(:disabled):hover {
    background: ${e("button.text.plain.hover.background")};
    border-color: transparent;
    color: ${e("button.text.plain.color")};
}

.p-button-text.p-button-plain:not(:disabled):active {
    background: ${e("button.text.plain.active.background")};
    border-color: transparent;
    color: ${e("button.text.plain.color")};
}

.p-button-link {
    background: transparent;
    border-color: transparent;
    color: ${e("button.link.color")};
}

.p-button-link:not(:disabled):hover {
    background: transparent;
    border-color: transparent;
    color: ${e("button.link.hover.color")};
}

.p-button-link:not(:disabled):hover .p-button-label {
    text-decoration: underline;
}

.p-button-link:not(:disabled):active {
    background: transparent;
    border-color: transparent;
    color: ${e("button.link.active.color")};
}
`;
function ua(e) {
  "@babel/helpers - typeof";
  return ua = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, ua(e);
}
function ln(e, t, n) {
  return (t = VR(t)) in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
function VR(e) {
  var t = HR(e, "string");
  return ua(t) == "symbol" ? t : t + "";
}
function HR(e, t) {
  if (ua(e) != "object" || !e) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var i = n.call(e, t);
    if (ua(i) != "object") return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var KR = {
  root: function(t) {
    var n = t.instance, i = t.props;
    return ["p-button p-component", ln(ln(ln(ln(ln(ln(ln(ln(ln({
      "p-button-icon-only": n.hasIcon && !i.label && !i.badge,
      "p-button-vertical": (i.iconPos === "top" || i.iconPos === "bottom") && i.label,
      "p-button-loading": i.loading,
      "p-button-link": i.link || i.variant === "link"
    }, "p-button-".concat(i.severity), i.severity), "p-button-raised", i.raised), "p-button-rounded", i.rounded), "p-button-text", i.text || i.variant === "text"), "p-button-outlined", i.outlined || i.variant === "outlined"), "p-button-sm", i.size === "small"), "p-button-lg", i.size === "large"), "p-button-plain", i.plain), "p-button-fluid", n.hasFluid)];
  },
  loadingIcon: "p-button-loading-icon",
  icon: function(t) {
    var n = t.props;
    return ["p-button-icon", ln({}, "p-button-icon-".concat(n.iconPos), n.label)];
  },
  label: "p-button-label"
}, YR = ft.extend({
  name: "button",
  style: WR,
  classes: KR
}), GR = {
  name: "BaseButton",
  extends: Ff,
  props: {
    label: {
      type: String,
      default: null
    },
    icon: {
      type: String,
      default: null
    },
    iconPos: {
      type: String,
      default: "left"
    },
    iconClass: {
      type: [String, Object],
      default: null
    },
    badge: {
      type: String,
      default: null
    },
    badgeClass: {
      type: [String, Object],
      default: null
    },
    badgeSeverity: {
      type: String,
      default: "secondary"
    },
    loading: {
      type: Boolean,
      default: !1
    },
    loadingIcon: {
      type: String,
      default: void 0
    },
    as: {
      type: [String, Object],
      default: "BUTTON"
    },
    asChild: {
      type: Boolean,
      default: !1
    },
    link: {
      type: Boolean,
      default: !1
    },
    severity: {
      type: String,
      default: null
    },
    raised: {
      type: Boolean,
      default: !1
    },
    rounded: {
      type: Boolean,
      default: !1
    },
    text: {
      type: Boolean,
      default: !1
    },
    outlined: {
      type: Boolean,
      default: !1
    },
    size: {
      type: String,
      default: null
    },
    variant: {
      type: String,
      default: null
    },
    plain: {
      type: Boolean,
      default: !1
    },
    fluid: {
      type: Boolean,
      default: null
    }
  },
  style: YR,
  provide: function() {
    return {
      $pcButton: this,
      $parentInstance: this
    };
  }
};
function ca(e) {
  "@babel/helpers - typeof";
  return ca = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, ca(e);
}
function pr(e, t, n) {
  return (t = XR(t)) in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
function XR(e) {
  var t = QR(e, "string");
  return ca(t) == "symbol" ? t : t + "";
}
function QR(e, t) {
  if (ca(e) != "object" || !e) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var i = n.call(e, t);
    if (ca(i) != "object") return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var js = {
  name: "Button",
  extends: GR,
  inheritAttrs: !1,
  inject: {
    $pcFluid: {
      default: null
    }
  },
  methods: {
    getPTOptions: function(t) {
      var n = t === "root" ? this.ptmi : this.ptm;
      return n(t, {
        context: {
          disabled: this.disabled
        }
      });
    }
  },
  computed: {
    disabled: function() {
      return this.$attrs.disabled || this.$attrs.disabled === "" || this.loading;
    },
    defaultAriaLabel: function() {
      return this.label ? this.label + (this.badge ? " " + this.badge : "") : this.$attrs.ariaLabel;
    },
    hasIcon: function() {
      return this.icon || this.$slots.icon;
    },
    attrs: function() {
      return nr(this.asAttrs, this.a11yAttrs, this.getPTOptions("root"));
    },
    asAttrs: function() {
      return this.as === "BUTTON" ? {
        type: "button",
        disabled: this.disabled
      } : void 0;
    },
    a11yAttrs: function() {
      return {
        "aria-label": this.defaultAriaLabel,
        "data-pc-name": "button",
        "data-p-disabled": this.disabled,
        "data-p-severity": this.severity
      };
    },
    hasFluid: function() {
      return Mn(this.fluid) ? !!this.$pcFluid : this.fluid;
    },
    dataP: function() {
      return zl(pr(pr(pr(pr(pr(pr(pr(pr(pr(pr({}, this.size, this.size), "icon-only", this.hasIcon && !this.label && !this.badge), "loading", this.loading), "fluid", this.hasFluid), "rounded", this.rounded), "raised", this.raised), "outlined", this.outlined || this.variant === "outlined"), "text", this.text || this.variant === "text"), "link", this.link || this.variant === "link"), "vertical", (this.iconPos === "top" || this.iconPos === "bottom") && this.label));
    },
    dataIconP: function() {
      return zl(pr(pr({}, this.iconPos, this.iconPos), this.size, this.size));
    },
    dataLabelP: function() {
      return zl(pr(pr({}, this.size, this.size), "icon-only", this.hasIcon && !this.label && !this.badge));
    }
  },
  components: {
    SpinnerIcon: Vb,
    Badge: Hb
  },
  directives: {
    ripple: UR
  }
}, JR = ["data-p"], qR = ["data-p"];
function ZR(e, t, n, i, a, s) {
  var c = Nh("SpinnerIcon"), f = Nh("Badge"), d = Sv("ripple");
  return e.asChild ? Ol(e.$slots, "default", {
    key: 1,
    class: Ho(e.cx("root")),
    a11yAttrs: s.a11yAttrs
  }) : mv((It(), go(nk(e.as), nr({
    key: 0,
    class: e.cx("root"),
    "data-p": s.dataP
  }, s.attrs), {
    default: Bl(function() {
      return [Ol(e.$slots, "default", {}, function() {
        return [e.loading ? Ol(e.$slots, "loadingicon", nr({
          key: 0,
          class: [e.cx("loadingIcon"), e.cx("icon")]
        }, e.ptm("loadingIcon")), function() {
          return [e.loadingIcon ? (It(), mn("span", nr({
            key: 0,
            class: [e.cx("loadingIcon"), e.cx("icon"), e.loadingIcon]
          }, e.ptm("loadingIcon")), null, 16)) : (It(), go(c, nr({
            key: 1,
            class: [e.cx("loadingIcon"), e.cx("icon")],
            spin: ""
          }, e.ptm("loadingIcon")), null, 16, ["class"]))];
        }) : Ol(e.$slots, "icon", nr({
          key: 1,
          class: [e.cx("icon")]
        }, e.ptm("icon")), function() {
          return [e.icon ? (It(), mn("span", nr({
            key: 0,
            class: [e.cx("icon"), e.icon, e.iconClass],
            "data-p": s.dataIconP
          }, e.ptm("icon")), null, 16, JR)) : Wd("", !0)];
        }), hr("span", nr({
          class: e.cx("label")
        }, e.ptm("label"), {
          "data-p": s.dataLabelP
        }), An(e.label || " "), 17, qR), e.badge ? (It(), go(f, {
          key: 2,
          value: e.badge,
          class: Ho(e.badgeClass),
          severity: e.badgeSeverity,
          unstyled: e.unstyled,
          pt: e.ptm("pcBadge")
        }, null, 8, ["value", "class", "severity", "unstyled", "pt"])) : Wd("", !0)];
      })];
    }),
    _: 3
  }, 16, ["class", "data-p"])), [[d]]);
}
js.render = ZR;
const eI = { class: "toolbar" }, tI = { class: "color-picker" }, rI = { class: "size-slider" }, nI = ["value"], oI = /* @__PURE__ */ Go({
  __name: "ToolBar",
  props: {
    colors: {},
    initialColor: {},
    initialBrushSize: {},
    initialTool: {}
  },
  emits: ["tool-change", "color-change", "canvas-clear", "brush-size-change"],
  setup(e, { emit: t }) {
    const { t: n } = ma(), i = e, a = t, s = i.colors || ["#000000", "#ff0000", "#0000ff", "#69a869", "#ffff00", "#ff00ff", "#00ffff"], c = ot(i.initialColor || "#000000"), f = ot(i.initialBrushSize || 5), d = ot(i.initialTool || "pen");
    function h(_) {
      d.value = _, a("tool-change", _);
    }
    function m(_) {
      c.value = _, a("color-change", _);
    }
    function b() {
      a("canvas-clear");
    }
    function v(_) {
      const x = _.target;
      f.value = Number(x.value), a("brush-size-change", f.value);
    }
    return (_, x) => {
      const T = Sv("tooltip");
      return It(), mn(Qt, null, [
        hr("div", eI, [
          mv((It(), go(xt(js), {
            class: Ho({ active: d.value === "pen" }),
            onClick: x[0] || (x[0] = (R) => h("pen"))
          }, {
            default: Bl(() => [
              Hs(An(xt(n)("vue-basic.pen")), 1)
            ]),
            _: 1
          }, 8, ["class"])), [
            [T, { value: xt(n)("vue-basic.pen-tooltip"), showDelay: 300 }]
          ]),
          Ot(xt(js), { onClick: b }, {
            default: Bl(() => [
              Hs(An(xt(n)("vue-basic.clear-canvas")), 1)
            ]),
            _: 1
          })
        ]),
        hr("div", tI, [
          (It(!0), mn(Qt, null, ok(xt(s), (R, D) => (It(), go(xt(js), {
            key: D,
            class: Ho({ "color-button": !0, active: c.value === R }),
            onClick: (K) => m(R),
            type: "button",
            title: R
          }, {
            default: Bl(() => [
              hr("i", {
                class: "pi pi-circle-fill",
                style: cu({ color: R })
              }, null, 4)
            ]),
            _: 2
          }, 1032, ["class", "onClick", "title"]))), 128))
        ]),
        hr("div", rI, [
          hr("label", null, An(xt(n)("vue-basic.brush-size")) + ": " + An(f.value) + "px", 1),
          hr("input", {
            type: "range",
            min: "1",
            max: "50",
            value: f.value,
            onChange: x[1] || (x[1] = (R) => v(R))
          }, null, 40, nI)
        ])
      ], 64);
    };
  }
}), zf = (e, t) => {
  const n = e.__vccOpts || e;
  for (const [i, a] of t)
    n[i] = a;
  return n;
}, iI = /* @__PURE__ */ zf(oI, [["__scopeId", "data-v-cf7e8687"]]), lI = { class: "drawing-board" }, aI = { class: "canvas-container" }, sI = ["width", "height"], uI = /* @__PURE__ */ Go({
  __name: "DrawingBoard",
  props: {
    width: {},
    height: {},
    initialColor: {},
    initialBrushSize: {}
  },
  emits: ["mounted", "drawing-start", "drawing", "drawing-end", "state-save", "canvas-clear"],
  setup(e, { expose: t, emit: n }) {
    const i = e, a = i.width || 800, s = i.height || 500, c = i.initialColor || "#000000", f = i.initialBrushSize || 5, d = n, h = ot(!1), m = ot(0), b = ot(0), v = ot(null), _ = ot(!1), x = ot(f), T = ot(c), R = ot(null), D = ot(null);
    let K = 0;
    kv(() => {
      K++;
    }), pa(() => {
      D.value && (v.value = D.value.getContext("2d"), L(), Sf(() => {
        D.value && d("mounted", D.value);
      }));
    });
    function L() {
      v.value && (v.value.fillStyle = "#ffffff", v.value.fillRect(0, 0, a, s), S(), ae());
    }
    function S() {
      v.value && (_.value ? (v.value.globalCompositeOperation = "destination-out", v.value.strokeStyle = "rgba(0,0,0,1)") : (v.value.globalCompositeOperation = "source-over", v.value.strokeStyle = T.value), v.value.lineWidth = x.value, v.value.lineJoin = "round", v.value.lineCap = "round");
    }
    function B(V) {
      K++, h.value = !0;
      const { offsetX: oe, offsetY: q } = te(V);
      m.value = oe, b.value = q, v.value && (v.value.beginPath(), v.value.moveTo(m.value, b.value), v.value.arc(m.value, b.value, x.value / 2, 0, Math.PI * 2), v.value.fill(), d("drawing-start", {
        x: oe,
        y: q,
        tool: _.value ? "eraser" : "pen"
      }));
    }
    function I(V) {
      if (!h.value || !v.value) return;
      const { offsetX: oe, offsetY: q } = te(V);
      v.value.beginPath(), v.value.moveTo(m.value, b.value), v.value.lineTo(oe, q), v.value.stroke(), m.value = oe, b.value = q, d("drawing", {
        x: oe,
        y: q,
        tool: _.value ? "eraser" : "pen"
      });
    }
    function F() {
      h.value && (h.value = !1, ae(), d("drawing-end"));
    }
    function te(V) {
      let oe = 0, q = 0;
      if ("touches" in V) {
        if (V.preventDefault(), D.value) {
          const P = D.value.getBoundingClientRect();
          oe = V.touches[0].clientX - P.left, q = V.touches[0].clientY - P.top;
        }
      } else
        oe = V.offsetX, q = V.offsetY;
      return { offsetX: oe, offsetY: q };
    }
    function re(V) {
      V.preventDefault(), B(V);
    }
    function Se(V) {
      V.preventDefault(), h.value && I(V);
    }
    function Pe(V) {
      _.value = V === "eraser", S();
    }
    function be(V) {
      T.value = V, S();
    }
    function we(V) {
      x.value = V, S();
    }
    function De() {
      v.value && (v.value.fillStyle = "#ffffff", v.value.fillRect(0, 0, a, s), S(), ae(), d("canvas-clear"));
    }
    function ae() {
      K++, D.value && (R.value = D.value.toDataURL("image/png"), R.value && d("state-save", R.value));
    }
    async function ge() {
      if (!D.value)
        throw new Error("Canvas is unable to get current data");
      return R.value ? R.value : D.value.toDataURL("image/png");
    }
    async function he(V) {
      if (!V.startsWith("data:image/png;base64,")) throw new Error("Invalid saved PNG");
      const oe = ++K, q = new Image();
      if (q.src = V, await q.decode(), !(oe !== K || !v.value)) {
        if (q.width !== a || q.height !== s) throw new Error("Invalid saved canvas size");
        v.value.save(), v.value.globalCompositeOperation = "source-over", v.value.clearRect(0, 0, a, s), v.value.drawImage(q, 0, 0), v.value.restore(), ae();
      }
    }
    return t({
      restoreCanvas: he,
      setTool: Pe,
      setColor: be,
      setBrushSize: we,
      clearCanvas: De,
      getCurrentCanvasData: ge
    }), (V, oe) => (It(), mn("div", lI, [
      hr("div", aI, [
        hr("canvas", {
          ref_key: "canvas",
          ref: D,
          width: xt(a),
          height: xt(s),
          onMousedown: B,
          onMousemove: I,
          onMouseup: F,
          onMouseleave: F,
          onTouchstart: re,
          onTouchmove: Se,
          onTouchend: F
        }, null, 40, sI)
      ])
    ]));
  }
}), cI = /* @__PURE__ */ zf(uI, [["__scopeId", "data-v-6d72893f"]]), dI = { class: "drawing-app" }, fI = /* @__PURE__ */ Go({
  __name: "DrawingApp",
  props: {
    width: {},
    height: {},
    initialColor: {},
    initialBrushSize: {},
    availableColors: {}
  },
  emits: ["tool-change", "color-change", "brush-size-change", "drawing-start", "drawing", "drawing-end", "state-save", "mounted"],
  setup(e, { expose: t, emit: n }) {
    const i = e, a = i.width || 800, s = i.height || 500, c = i.initialColor || "#000000", f = i.initialBrushSize || 5, d = i.availableColors || ["#000000", "#ff0000", "#0000ff", "#00ff00", "#ffff00", "#ff00ff", "#00ffff"], h = n, m = ot(null), b = ot(null);
    function v(I) {
      var F;
      (F = m.value) == null || F.setTool(I), h("tool-change", I);
    }
    function _(I) {
      var F;
      (F = m.value) == null || F.setColor(I), h("color-change", I);
    }
    function x(I) {
      var F;
      (F = m.value) == null || F.setBrushSize(I), h("brush-size-change", I);
    }
    function T() {
      var I;
      (I = m.value) == null || I.clearCanvas();
    }
    function R(I) {
      h("drawing-start", I);
    }
    function D(I) {
      h("drawing", I);
    }
    function K() {
      h("drawing-end");
    }
    function L(I) {
      b.value = I, h("state-save", I);
    }
    function S(I) {
      h("mounted", I);
    }
    async function B() {
      if (b.value)
        return b.value;
      if (m.value)
        try {
          return await m.value.getCurrentCanvasData();
        } catch (I) {
          throw console.error("unable to get canvas data:", I), new Error("unable to get canvas data");
        }
      throw new Error("get canvas data failed");
    }
    return t({
      getCanvasData: B,
      restoreCanvas: (I) => m.value.restoreCanvas(I)
    }), (I, F) => (It(), mn("div", dI, [
      Ot(iI, {
        colors: xt(d),
        initialColor: xt(c),
        initialBrushSize: xt(f),
        onToolChange: v,
        onColorChange: _,
        onBrushSizeChange: x,
        onCanvasClear: T
      }, null, 8, ["colors", "initialColor", "initialBrushSize"]),
      Ot(cI, {
        ref_key: "drawingBoard",
        ref: m,
        width: xt(a),
        height: xt(s),
        initialColor: xt(c),
        initialBrushSize: xt(f),
        onDrawingStart: R,
        onDrawing: D,
        onDrawingEnd: K,
        onStateSave: L,
        onMounted: S
      }, null, 8, ["width", "height", "initialColor", "initialBrushSize"])
    ]));
  }
}), pI = /* @__PURE__ */ zf(fI, [["__scopeId", "data-v-8f9d427e"]]), gI = {
  key: 0,
  role: "alert"
}, hI = /* @__PURE__ */ Go({
  __name: "VueExampleComponent",
  props: {
    widget: {}
  },
  setup(e) {
    var b;
    const { t } = ma(), n = ot(null), i = ot(null), a = ot(!1), s = (v) => {
      if (!v || typeof v != "object") return { image: null };
      const _ = v;
      return {
        image: typeof _.image == "string" ? _.image : null,
        ...typeof _.canvasDataURL == "string" ? { canvasDataURL: _.canvasDataURL } : {}
      };
    }, c = wf(s(e.widget.value));
    (b = e.widget).options ?? (b.options = {}), e.widget.options.getValue = () => c.value, e.widget.options.setValue = (v) => {
      c.value = s(v);
    };
    let f = !1, d = Promise.resolve();
    function h(v) {
      i.value = v, f && (d = Promise.resolve(), c.value = { image: null, canvasDataURL: v }, a.value = !1);
    }
    async function m(v, _) {
      try {
        const x = await fetch(v).then((L) => L.blob()), T = `${_}_${Date.now()}.png`, R = new File([x], T), D = new FormData();
        return D.append("image", R), D.append("subfolder", "threed"), D.append("type", "temp"), (await e_.fetchApi("/upload/image", {
          method: "POST",
          body: D
        })).json();
      } catch (x) {
        throw console.error("Vue Component: Error uploading image:", x), x;
      }
    }
    return pa(() => {
      f = !0, !c.value.canvasDataURL && i.value && h(i.value), Ir(() => c.value.canvasDataURL, (v) => {
        !v || v === i.value || (d = n.value.restoreCanvas(v), d.catch(() => {
          a.value = !0;
        }));
      }, { immediate: !0, flush: "sync" }), e.widget.serializeValue = async (v, _) => {
        try {
          await d;
          const x = i.value;
          return x ? {
            image: `threed/${(await m(x, "test_vue_basic")).name} [temp]`
          } : (console.warn("Vue Component: No canvas data available"), { image: null });
        } catch (x) {
          return console.error("Vue Component: Error in serializeValue:", x), { image: null };
        }
      };
    }), (v, _) => (It(), mn("div", null, [
      hr("h1", null, An(xt(t)("vue-basic.title")), 1),
      hr("div", null, [
        Ot(pI, {
          ref_key: "drawingAppRef",
          ref: n,
          width: 300,
          height: 300,
          onStateSave: h
        }, null, 512)
      ]),
      a.value ? (It(), mn("p", gI, An(xt(t)("vue-basic.restore-error")), 1)) : Wd("", !0)
    ]));
  }
}), mI = {
  "vue-basic": { title: "Vue Basic Example", pen: "Pen", "restore-error": "Unable to restore the saved drawing. Check the image data in the workflow.", "clear-canvas": "Clear Canvas", "brush-size": "Brush Size", "pen-tooltip": "this is a pen" }
}, vI = {
  "vue-basic": { title: "Vue基础示例", pen: "铅笔", "pen-tooltip": "使用画笔绘图", "restore-error": "无法恢复保存的画板内容，请检查工作流中的图片数据。", "clear-canvas": "清除画布", "brush-size": "笔刷大小" }
}, Uf = document.createElement("link");
Uf.rel = "stylesheet";
Uf.href = new URL(
  /* @vite-ignore */
  "./assets/main.css",
  import.meta.url
).href;
document.head.appendChild(Uf);
Dn.registerExtension({
  name: "vue-basic",
  getCustomWidgets() {
    return {
      CUSTOM_VUE_COMPONENT_BASIC(e) {
        const t = document.createElement("div");
        t.className = "astrophoto-drawing-widget";
        const n = e.addDOMWidget(
          "custom_vue_component_basic",
          "vue-basic",
          t,
          { getMinHeight: () => 460, getHeight: () => 460 }
        ), i = String(Dn.extensionManager.setting.get("Comfy.Locale") || navigator.language), a = hw(hI, { widget: n });
        a.use(gC({ legacy: !1, locale: i.startsWith("zh") ? "zh" : "en", fallbackLocale: "en", messages: { en: mI, zh: vI } })), a.use(Sx, { theme: { preset: uR, options: { prefix: "astrophoto", darkModeSelector: ".astrophoto-dark" } } }), a.directive("tooltip", Yx), a.mount(t);
        const s = n.onRemove;
        return n.onRemove = () => {
          a.unmount(), s == null || s.call(n);
        }, { widget: n };
      }
    };
  },
  nodeCreated(e) {
    if (e.comfyClass !== "vue-basic") return;
    const [t, n] = e.size;
    e.setSize([Math.max(t, 300), Math.max(n, 520)]);
  }
});
var $d = { exports: {} }, El = {}, Ed = { exports: {} }, We = {};
/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var d0;
function bI() {
  if (d0) return We;
  d0 = 1;
  var e = Symbol.for("react.element"), t = Symbol.for("react.portal"), n = Symbol.for("react.fragment"), i = Symbol.for("react.strict_mode"), a = Symbol.for("react.profiler"), s = Symbol.for("react.provider"), c = Symbol.for("react.context"), f = Symbol.for("react.forward_ref"), d = Symbol.for("react.suspense"), h = Symbol.for("react.memo"), m = Symbol.for("react.lazy"), b = Symbol.iterator;
  function v(P) {
    return P === null || typeof P != "object" ? null : (P = b && P[b] || P["@@iterator"], typeof P == "function" ? P : null);
  }
  var _ = { isMounted: function() {
    return !1;
  }, enqueueForceUpdate: function() {
  }, enqueueReplaceState: function() {
  }, enqueueSetState: function() {
  } }, x = Object.assign, T = {};
  function R(P, X, Ce) {
    this.props = P, this.context = X, this.refs = T, this.updater = Ce || _;
  }
  R.prototype.isReactComponent = {}, R.prototype.setState = function(P, X) {
    if (typeof P != "object" && typeof P != "function" && P != null) throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
    this.updater.enqueueSetState(this, P, X, "setState");
  }, R.prototype.forceUpdate = function(P) {
    this.updater.enqueueForceUpdate(this, P, "forceUpdate");
  };
  function D() {
  }
  D.prototype = R.prototype;
  function K(P, X, Ce) {
    this.props = P, this.context = X, this.refs = T, this.updater = Ce || _;
  }
  var L = K.prototype = new D();
  L.constructor = K, x(L, R.prototype), L.isPureReactComponent = !0;
  var S = Array.isArray, B = Object.prototype.hasOwnProperty, I = { current: null }, F = { key: !0, ref: !0, __self: !0, __source: !0 };
  function te(P, X, Ce) {
    var xe, Ae = {}, Oe = null, ze = null;
    if (X != null) for (xe in X.ref !== void 0 && (ze = X.ref), X.key !== void 0 && (Oe = "" + X.key), X) B.call(X, xe) && !F.hasOwnProperty(xe) && (Ae[xe] = X[xe]);
    var Me = arguments.length - 2;
    if (Me === 1) Ae.children = Ce;
    else if (1 < Me) {
      for (var Ke = Array(Me), tt = 0; tt < Me; tt++) Ke[tt] = arguments[tt + 2];
      Ae.children = Ke;
    }
    if (P && P.defaultProps) for (xe in Me = P.defaultProps, Me) Ae[xe] === void 0 && (Ae[xe] = Me[xe]);
    return { $$typeof: e, type: P, key: Oe, ref: ze, props: Ae, _owner: I.current };
  }
  function re(P, X) {
    return { $$typeof: e, type: P.type, key: X, ref: P.ref, props: P.props, _owner: P._owner };
  }
  function Se(P) {
    return typeof P == "object" && P !== null && P.$$typeof === e;
  }
  function Pe(P) {
    var X = { "=": "=0", ":": "=2" };
    return "$" + P.replace(/[=:]/g, function(Ce) {
      return X[Ce];
    });
  }
  var be = /\/+/g;
  function we(P, X) {
    return typeof P == "object" && P !== null && P.key != null ? Pe("" + P.key) : X.toString(36);
  }
  function De(P, X, Ce, xe, Ae) {
    var Oe = typeof P;
    (Oe === "undefined" || Oe === "boolean") && (P = null);
    var ze = !1;
    if (P === null) ze = !0;
    else switch (Oe) {
      case "string":
      case "number":
        ze = !0;
        break;
      case "object":
        switch (P.$$typeof) {
          case e:
          case t:
            ze = !0;
        }
    }
    if (ze) return ze = P, Ae = Ae(ze), P = xe === "" ? "." + we(ze, 0) : xe, S(Ae) ? (Ce = "", P != null && (Ce = P.replace(be, "$&/") + "/"), De(Ae, X, Ce, "", function(tt) {
      return tt;
    })) : Ae != null && (Se(Ae) && (Ae = re(Ae, Ce + (!Ae.key || ze && ze.key === Ae.key ? "" : ("" + Ae.key).replace(be, "$&/") + "/") + P)), X.push(Ae)), 1;
    if (ze = 0, xe = xe === "" ? "." : xe + ":", S(P)) for (var Me = 0; Me < P.length; Me++) {
      Oe = P[Me];
      var Ke = xe + we(Oe, Me);
      ze += De(Oe, X, Ce, Ke, Ae);
    }
    else if (Ke = v(P), typeof Ke == "function") for (P = Ke.call(P), Me = 0; !(Oe = P.next()).done; ) Oe = Oe.value, Ke = xe + we(Oe, Me++), ze += De(Oe, X, Ce, Ke, Ae);
    else if (Oe === "object") throw X = String(P), Error("Objects are not valid as a React child (found: " + (X === "[object Object]" ? "object with keys {" + Object.keys(P).join(", ") + "}" : X) + "). If you meant to render a collection of children, use an array instead.");
    return ze;
  }
  function ae(P, X, Ce) {
    if (P == null) return P;
    var xe = [], Ae = 0;
    return De(P, xe, "", "", function(Oe) {
      return X.call(Ce, Oe, Ae++);
    }), xe;
  }
  function ge(P) {
    if (P._status === -1) {
      var X = P._result;
      X = X(), X.then(function(Ce) {
        (P._status === 0 || P._status === -1) && (P._status = 1, P._result = Ce);
      }, function(Ce) {
        (P._status === 0 || P._status === -1) && (P._status = 2, P._result = Ce);
      }), P._status === -1 && (P._status = 0, P._result = X);
    }
    if (P._status === 1) return P._result.default;
    throw P._result;
  }
  var he = { current: null }, V = { transition: null }, oe = { ReactCurrentDispatcher: he, ReactCurrentBatchConfig: V, ReactCurrentOwner: I };
  function q() {
    throw Error("act(...) is not supported in production builds of React.");
  }
  return We.Children = { map: ae, forEach: function(P, X, Ce) {
    ae(P, function() {
      X.apply(this, arguments);
    }, Ce);
  }, count: function(P) {
    var X = 0;
    return ae(P, function() {
      X++;
    }), X;
  }, toArray: function(P) {
    return ae(P, function(X) {
      return X;
    }) || [];
  }, only: function(P) {
    if (!Se(P)) throw Error("React.Children.only expected to receive a single React element child.");
    return P;
  } }, We.Component = R, We.Fragment = n, We.Profiler = a, We.PureComponent = K, We.StrictMode = i, We.Suspense = d, We.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = oe, We.act = q, We.cloneElement = function(P, X, Ce) {
    if (P == null) throw Error("React.cloneElement(...): The argument must be a React element, but you passed " + P + ".");
    var xe = x({}, P.props), Ae = P.key, Oe = P.ref, ze = P._owner;
    if (X != null) {
      if (X.ref !== void 0 && (Oe = X.ref, ze = I.current), X.key !== void 0 && (Ae = "" + X.key), P.type && P.type.defaultProps) var Me = P.type.defaultProps;
      for (Ke in X) B.call(X, Ke) && !F.hasOwnProperty(Ke) && (xe[Ke] = X[Ke] === void 0 && Me !== void 0 ? Me[Ke] : X[Ke]);
    }
    var Ke = arguments.length - 2;
    if (Ke === 1) xe.children = Ce;
    else if (1 < Ke) {
      Me = Array(Ke);
      for (var tt = 0; tt < Ke; tt++) Me[tt] = arguments[tt + 2];
      xe.children = Me;
    }
    return { $$typeof: e, type: P.type, key: Ae, ref: Oe, props: xe, _owner: ze };
  }, We.createContext = function(P) {
    return P = { $$typeof: c, _currentValue: P, _currentValue2: P, _threadCount: 0, Provider: null, Consumer: null, _defaultValue: null, _globalName: null }, P.Provider = { $$typeof: s, _context: P }, P.Consumer = P;
  }, We.createElement = te, We.createFactory = function(P) {
    var X = te.bind(null, P);
    return X.type = P, X;
  }, We.createRef = function() {
    return { current: null };
  }, We.forwardRef = function(P) {
    return { $$typeof: f, render: P };
  }, We.isValidElement = Se, We.lazy = function(P) {
    return { $$typeof: m, _payload: { _status: -1, _result: P }, _init: ge };
  }, We.memo = function(P, X) {
    return { $$typeof: h, type: P, compare: X === void 0 ? null : X };
  }, We.startTransition = function(P) {
    var X = V.transition;
    V.transition = {};
    try {
      P();
    } finally {
      V.transition = X;
    }
  }, We.unstable_act = q, We.useCallback = function(P, X) {
    return he.current.useCallback(P, X);
  }, We.useContext = function(P) {
    return he.current.useContext(P);
  }, We.useDebugValue = function() {
  }, We.useDeferredValue = function(P) {
    return he.current.useDeferredValue(P);
  }, We.useEffect = function(P, X) {
    return he.current.useEffect(P, X);
  }, We.useId = function() {
    return he.current.useId();
  }, We.useImperativeHandle = function(P, X, Ce) {
    return he.current.useImperativeHandle(P, X, Ce);
  }, We.useInsertionEffect = function(P, X) {
    return he.current.useInsertionEffect(P, X);
  }, We.useLayoutEffect = function(P, X) {
    return he.current.useLayoutEffect(P, X);
  }, We.useMemo = function(P, X) {
    return he.current.useMemo(P, X);
  }, We.useReducer = function(P, X, Ce) {
    return he.current.useReducer(P, X, Ce);
  }, We.useRef = function(P) {
    return he.current.useRef(P);
  }, We.useState = function(P) {
    return he.current.useState(P);
  }, We.useSyncExternalStore = function(P, X, Ce) {
    return he.current.useSyncExternalStore(P, X, Ce);
  }, We.useTransition = function() {
    return he.current.useTransition();
  }, We.version = "18.3.1", We;
}
var f0;
function Wf() {
  return f0 || (f0 = 1, Ed.exports = bI()), Ed.exports;
}
/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var p0;
function yI() {
  if (p0) return El;
  p0 = 1;
  var e = Wf(), t = Symbol.for("react.element"), n = Symbol.for("react.fragment"), i = Object.prototype.hasOwnProperty, a = e.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, s = { key: !0, ref: !0, __self: !0, __source: !0 };
  function c(f, d, h) {
    var m, b = {}, v = null, _ = null;
    h !== void 0 && (v = "" + h), d.key !== void 0 && (v = "" + d.key), d.ref !== void 0 && (_ = d.ref);
    for (m in d) i.call(d, m) && !s.hasOwnProperty(m) && (b[m] = d[m]);
    if (f && f.defaultProps) for (m in d = f.defaultProps, d) b[m] === void 0 && (b[m] = d[m]);
    return { $$typeof: t, type: f, key: v, ref: _, props: b, _owner: a.current };
  }
  return El.Fragment = n, El.jsx = c, El.jsxs = c, El;
}
var g0;
function _I() {
  return g0 || (g0 = 1, $d.exports = yI()), $d.exports;
}
var M = _I(), Ns = {}, Td = { exports: {} }, gr = {}, Od = { exports: {} }, Ld = {};
/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var h0;
function kI() {
  return h0 || (h0 = 1, function(e) {
    function t(V, oe) {
      var q = V.length;
      V.push(oe);
      e: for (; 0 < q; ) {
        var P = q - 1 >>> 1, X = V[P];
        if (0 < a(X, oe)) V[P] = oe, V[q] = X, q = P;
        else break e;
      }
    }
    function n(V) {
      return V.length === 0 ? null : V[0];
    }
    function i(V) {
      if (V.length === 0) return null;
      var oe = V[0], q = V.pop();
      if (q !== oe) {
        V[0] = q;
        e: for (var P = 0, X = V.length, Ce = X >>> 1; P < Ce; ) {
          var xe = 2 * (P + 1) - 1, Ae = V[xe], Oe = xe + 1, ze = V[Oe];
          if (0 > a(Ae, q)) Oe < X && 0 > a(ze, Ae) ? (V[P] = ze, V[Oe] = q, P = Oe) : (V[P] = Ae, V[xe] = q, P = xe);
          else if (Oe < X && 0 > a(ze, q)) V[P] = ze, V[Oe] = q, P = Oe;
          else break e;
        }
      }
      return oe;
    }
    function a(V, oe) {
      var q = V.sortIndex - oe.sortIndex;
      return q !== 0 ? q : V.id - oe.id;
    }
    if (typeof performance == "object" && typeof performance.now == "function") {
      var s = performance;
      e.unstable_now = function() {
        return s.now();
      };
    } else {
      var c = Date, f = c.now();
      e.unstable_now = function() {
        return c.now() - f;
      };
    }
    var d = [], h = [], m = 1, b = null, v = 3, _ = !1, x = !1, T = !1, R = typeof setTimeout == "function" ? setTimeout : null, D = typeof clearTimeout == "function" ? clearTimeout : null, K = typeof setImmediate < "u" ? setImmediate : null;
    typeof navigator < "u" && navigator.scheduling !== void 0 && navigator.scheduling.isInputPending !== void 0 && navigator.scheduling.isInputPending.bind(navigator.scheduling);
    function L(V) {
      for (var oe = n(h); oe !== null; ) {
        if (oe.callback === null) i(h);
        else if (oe.startTime <= V) i(h), oe.sortIndex = oe.expirationTime, t(d, oe);
        else break;
        oe = n(h);
      }
    }
    function S(V) {
      if (T = !1, L(V), !x) if (n(d) !== null) x = !0, ge(B);
      else {
        var oe = n(h);
        oe !== null && he(S, oe.startTime - V);
      }
    }
    function B(V, oe) {
      x = !1, T && (T = !1, D(te), te = -1), _ = !0;
      var q = v;
      try {
        for (L(oe), b = n(d); b !== null && (!(b.expirationTime > oe) || V && !Pe()); ) {
          var P = b.callback;
          if (typeof P == "function") {
            b.callback = null, v = b.priorityLevel;
            var X = P(b.expirationTime <= oe);
            oe = e.unstable_now(), typeof X == "function" ? b.callback = X : b === n(d) && i(d), L(oe);
          } else i(d);
          b = n(d);
        }
        if (b !== null) var Ce = !0;
        else {
          var xe = n(h);
          xe !== null && he(S, xe.startTime - oe), Ce = !1;
        }
        return Ce;
      } finally {
        b = null, v = q, _ = !1;
      }
    }
    var I = !1, F = null, te = -1, re = 5, Se = -1;
    function Pe() {
      return !(e.unstable_now() - Se < re);
    }
    function be() {
      if (F !== null) {
        var V = e.unstable_now();
        Se = V;
        var oe = !0;
        try {
          oe = F(!0, V);
        } finally {
          oe ? we() : (I = !1, F = null);
        }
      } else I = !1;
    }
    var we;
    if (typeof K == "function") we = function() {
      K(be);
    };
    else if (typeof MessageChannel < "u") {
      var De = new MessageChannel(), ae = De.port2;
      De.port1.onmessage = be, we = function() {
        ae.postMessage(null);
      };
    } else we = function() {
      R(be, 0);
    };
    function ge(V) {
      F = V, I || (I = !0, we());
    }
    function he(V, oe) {
      te = R(function() {
        V(e.unstable_now());
      }, oe);
    }
    e.unstable_IdlePriority = 5, e.unstable_ImmediatePriority = 1, e.unstable_LowPriority = 4, e.unstable_NormalPriority = 3, e.unstable_Profiling = null, e.unstable_UserBlockingPriority = 2, e.unstable_cancelCallback = function(V) {
      V.callback = null;
    }, e.unstable_continueExecution = function() {
      x || _ || (x = !0, ge(B));
    }, e.unstable_forceFrameRate = function(V) {
      0 > V || 125 < V ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : re = 0 < V ? Math.floor(1e3 / V) : 5;
    }, e.unstable_getCurrentPriorityLevel = function() {
      return v;
    }, e.unstable_getFirstCallbackNode = function() {
      return n(d);
    }, e.unstable_next = function(V) {
      switch (v) {
        case 1:
        case 2:
        case 3:
          var oe = 3;
          break;
        default:
          oe = v;
      }
      var q = v;
      v = oe;
      try {
        return V();
      } finally {
        v = q;
      }
    }, e.unstable_pauseExecution = function() {
    }, e.unstable_requestPaint = function() {
    }, e.unstable_runWithPriority = function(V, oe) {
      switch (V) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
          break;
        default:
          V = 3;
      }
      var q = v;
      v = V;
      try {
        return oe();
      } finally {
        v = q;
      }
    }, e.unstable_scheduleCallback = function(V, oe, q) {
      var P = e.unstable_now();
      switch (typeof q == "object" && q !== null ? (q = q.delay, q = typeof q == "number" && 0 < q ? P + q : P) : q = P, V) {
        case 1:
          var X = -1;
          break;
        case 2:
          X = 250;
          break;
        case 5:
          X = 1073741823;
          break;
        case 4:
          X = 1e4;
          break;
        default:
          X = 5e3;
      }
      return X = q + X, V = { id: m++, callback: oe, priorityLevel: V, startTime: q, expirationTime: X, sortIndex: -1 }, q > P ? (V.sortIndex = q, t(h, V), n(d) === null && V === n(h) && (T ? (D(te), te = -1) : T = !0, he(S, q - P))) : (V.sortIndex = X, t(d, V), x || _ || (x = !0, ge(B))), V;
    }, e.unstable_shouldYield = Pe, e.unstable_wrapCallback = function(V) {
      var oe = v;
      return function() {
        var q = v;
        v = oe;
        try {
          return V.apply(this, arguments);
        } finally {
          v = q;
        }
      };
    };
  }(Ld)), Ld;
}
var m0;
function wI() {
  return m0 || (m0 = 1, Od.exports = kI()), Od.exports;
}
/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var v0;
function SI() {
  if (v0) return gr;
  v0 = 1;
  var e = Wf(), t = wI();
  function n(r) {
    for (var o = "https://reactjs.org/docs/error-decoder.html?invariant=" + r, l = 1; l < arguments.length; l++) o += "&args[]=" + encodeURIComponent(arguments[l]);
    return "Minified React error #" + r + "; visit " + o + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  var i = /* @__PURE__ */ new Set(), a = {};
  function s(r, o) {
    c(r, o), c(r + "Capture", o);
  }
  function c(r, o) {
    for (a[r] = o, r = 0; r < o.length; r++) i.add(o[r]);
  }
  var f = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u"), d = Object.prototype.hasOwnProperty, h = /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/, m = {}, b = {};
  function v(r) {
    return d.call(b, r) ? !0 : d.call(m, r) ? !1 : h.test(r) ? b[r] = !0 : (m[r] = !0, !1);
  }
  function _(r, o, l, u) {
    if (l !== null && l.type === 0) return !1;
    switch (typeof o) {
      case "function":
      case "symbol":
        return !0;
      case "boolean":
        return u ? !1 : l !== null ? !l.acceptsBooleans : (r = r.toLowerCase().slice(0, 5), r !== "data-" && r !== "aria-");
      default:
        return !1;
    }
  }
  function x(r, o, l, u) {
    if (o === null || typeof o > "u" || _(r, o, l, u)) return !0;
    if (u) return !1;
    if (l !== null) switch (l.type) {
      case 3:
        return !o;
      case 4:
        return o === !1;
      case 5:
        return isNaN(o);
      case 6:
        return isNaN(o) || 1 > o;
    }
    return !1;
  }
  function T(r, o, l, u, p, g, y) {
    this.acceptsBooleans = o === 2 || o === 3 || o === 4, this.attributeName = u, this.attributeNamespace = p, this.mustUseProperty = l, this.propertyName = r, this.type = o, this.sanitizeURL = g, this.removeEmptyString = y;
  }
  var R = {};
  "children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(r) {
    R[r] = new T(r, 0, !1, r, null, !1, !1);
  }), [["acceptCharset", "accept-charset"], ["className", "class"], ["htmlFor", "for"], ["httpEquiv", "http-equiv"]].forEach(function(r) {
    var o = r[0];
    R[o] = new T(o, 1, !1, r[1], null, !1, !1);
  }), ["contentEditable", "draggable", "spellCheck", "value"].forEach(function(r) {
    R[r] = new T(r, 2, !1, r.toLowerCase(), null, !1, !1);
  }), ["autoReverse", "externalResourcesRequired", "focusable", "preserveAlpha"].forEach(function(r) {
    R[r] = new T(r, 2, !1, r, null, !1, !1);
  }), "allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(r) {
    R[r] = new T(r, 3, !1, r.toLowerCase(), null, !1, !1);
  }), ["checked", "multiple", "muted", "selected"].forEach(function(r) {
    R[r] = new T(r, 3, !0, r, null, !1, !1);
  }), ["capture", "download"].forEach(function(r) {
    R[r] = new T(r, 4, !1, r, null, !1, !1);
  }), ["cols", "rows", "size", "span"].forEach(function(r) {
    R[r] = new T(r, 6, !1, r, null, !1, !1);
  }), ["rowSpan", "start"].forEach(function(r) {
    R[r] = new T(r, 5, !1, r.toLowerCase(), null, !1, !1);
  });
  var D = /[\-:]([a-z])/g;
  function K(r) {
    return r[1].toUpperCase();
  }
  "accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(r) {
    var o = r.replace(
      D,
      K
    );
    R[o] = new T(o, 1, !1, r, null, !1, !1);
  }), "xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(r) {
    var o = r.replace(D, K);
    R[o] = new T(o, 1, !1, r, "http://www.w3.org/1999/xlink", !1, !1);
  }), ["xml:base", "xml:lang", "xml:space"].forEach(function(r) {
    var o = r.replace(D, K);
    R[o] = new T(o, 1, !1, r, "http://www.w3.org/XML/1998/namespace", !1, !1);
  }), ["tabIndex", "crossOrigin"].forEach(function(r) {
    R[r] = new T(r, 1, !1, r.toLowerCase(), null, !1, !1);
  }), R.xlinkHref = new T("xlinkHref", 1, !1, "xlink:href", "http://www.w3.org/1999/xlink", !0, !1), ["src", "href", "action", "formAction"].forEach(function(r) {
    R[r] = new T(r, 1, !1, r.toLowerCase(), null, !0, !0);
  });
  function L(r, o, l, u) {
    var p = R.hasOwnProperty(o) ? R[o] : null;
    (p !== null ? p.type !== 0 : u || !(2 < o.length) || o[0] !== "o" && o[0] !== "O" || o[1] !== "n" && o[1] !== "N") && (x(o, l, p, u) && (l = null), u || p === null ? v(o) && (l === null ? r.removeAttribute(o) : r.setAttribute(o, "" + l)) : p.mustUseProperty ? r[p.propertyName] = l === null ? p.type === 3 ? !1 : "" : l : (o = p.attributeName, u = p.attributeNamespace, l === null ? r.removeAttribute(o) : (p = p.type, l = p === 3 || p === 4 && l === !0 ? "" : "" + l, u ? r.setAttributeNS(u, o, l) : r.setAttribute(o, l))));
  }
  var S = e.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, B = Symbol.for("react.element"), I = Symbol.for("react.portal"), F = Symbol.for("react.fragment"), te = Symbol.for("react.strict_mode"), re = Symbol.for("react.profiler"), Se = Symbol.for("react.provider"), Pe = Symbol.for("react.context"), be = Symbol.for("react.forward_ref"), we = Symbol.for("react.suspense"), De = Symbol.for("react.suspense_list"), ae = Symbol.for("react.memo"), ge = Symbol.for("react.lazy"), he = Symbol.for("react.offscreen"), V = Symbol.iterator;
  function oe(r) {
    return r === null || typeof r != "object" ? null : (r = V && r[V] || r["@@iterator"], typeof r == "function" ? r : null);
  }
  var q = Object.assign, P;
  function X(r) {
    if (P === void 0) try {
      throw Error();
    } catch (l) {
      var o = l.stack.trim().match(/\n( *(at )?)/);
      P = o && o[1] || "";
    }
    return `
` + P + r;
  }
  var Ce = !1;
  function xe(r, o) {
    if (!r || Ce) return "";
    Ce = !0;
    var l = Error.prepareStackTrace;
    Error.prepareStackTrace = void 0;
    try {
      if (o) if (o = function() {
        throw Error();
      }, Object.defineProperty(o.prototype, "props", { set: function() {
        throw Error();
      } }), typeof Reflect == "object" && Reflect.construct) {
        try {
          Reflect.construct(o, []);
        } catch (H) {
          var u = H;
        }
        Reflect.construct(r, [], o);
      } else {
        try {
          o.call();
        } catch (H) {
          u = H;
        }
        r.call(o.prototype);
      }
      else {
        try {
          throw Error();
        } catch (H) {
          u = H;
        }
        r();
      }
    } catch (H) {
      if (H && u && typeof H.stack == "string") {
        for (var p = H.stack.split(`
`), g = u.stack.split(`
`), y = p.length - 1, C = g.length - 1; 1 <= y && 0 <= C && p[y] !== g[C]; ) C--;
        for (; 1 <= y && 0 <= C; y--, C--) if (p[y] !== g[C]) {
          if (y !== 1 || C !== 1)
            do
              if (y--, C--, 0 > C || p[y] !== g[C]) {
                var O = `
` + p[y].replace(" at new ", " at ");
                return r.displayName && O.includes("<anonymous>") && (O = O.replace("<anonymous>", r.displayName)), O;
              }
            while (1 <= y && 0 <= C);
          break;
        }
      }
    } finally {
      Ce = !1, Error.prepareStackTrace = l;
    }
    return (r = r ? r.displayName || r.name : "") ? X(r) : "";
  }
  function Ae(r) {
    switch (r.tag) {
      case 5:
        return X(r.type);
      case 16:
        return X("Lazy");
      case 13:
        return X("Suspense");
      case 19:
        return X("SuspenseList");
      case 0:
      case 2:
      case 15:
        return r = xe(r.type, !1), r;
      case 11:
        return r = xe(r.type.render, !1), r;
      case 1:
        return r = xe(r.type, !0), r;
      default:
        return "";
    }
  }
  function Oe(r) {
    if (r == null) return null;
    if (typeof r == "function") return r.displayName || r.name || null;
    if (typeof r == "string") return r;
    switch (r) {
      case F:
        return "Fragment";
      case I:
        return "Portal";
      case re:
        return "Profiler";
      case te:
        return "StrictMode";
      case we:
        return "Suspense";
      case De:
        return "SuspenseList";
    }
    if (typeof r == "object") switch (r.$$typeof) {
      case Pe:
        return (r.displayName || "Context") + ".Consumer";
      case Se:
        return (r._context.displayName || "Context") + ".Provider";
      case be:
        var o = r.render;
        return r = r.displayName, r || (r = o.displayName || o.name || "", r = r !== "" ? "ForwardRef(" + r + ")" : "ForwardRef"), r;
      case ae:
        return o = r.displayName || null, o !== null ? o : Oe(r.type) || "Memo";
      case ge:
        o = r._payload, r = r._init;
        try {
          return Oe(r(o));
        } catch {
        }
    }
    return null;
  }
  function ze(r) {
    var o = r.type;
    switch (r.tag) {
      case 24:
        return "Cache";
      case 9:
        return (o.displayName || "Context") + ".Consumer";
      case 10:
        return (o._context.displayName || "Context") + ".Provider";
      case 18:
        return "DehydratedFragment";
      case 11:
        return r = o.render, r = r.displayName || r.name || "", o.displayName || (r !== "" ? "ForwardRef(" + r + ")" : "ForwardRef");
      case 7:
        return "Fragment";
      case 5:
        return o;
      case 4:
        return "Portal";
      case 3:
        return "Root";
      case 6:
        return "Text";
      case 16:
        return Oe(o);
      case 8:
        return o === te ? "StrictMode" : "Mode";
      case 22:
        return "Offscreen";
      case 12:
        return "Profiler";
      case 21:
        return "Scope";
      case 13:
        return "Suspense";
      case 19:
        return "SuspenseList";
      case 25:
        return "TracingMarker";
      case 1:
      case 0:
      case 17:
      case 2:
      case 14:
      case 15:
        if (typeof o == "function") return o.displayName || o.name || null;
        if (typeof o == "string") return o;
    }
    return null;
  }
  function Me(r) {
    switch (typeof r) {
      case "boolean":
      case "number":
      case "string":
      case "undefined":
        return r;
      case "object":
        return r;
      default:
        return "";
    }
  }
  function Ke(r) {
    var o = r.type;
    return (r = r.nodeName) && r.toLowerCase() === "input" && (o === "checkbox" || o === "radio");
  }
  function tt(r) {
    var o = Ke(r) ? "checked" : "value", l = Object.getOwnPropertyDescriptor(r.constructor.prototype, o), u = "" + r[o];
    if (!r.hasOwnProperty(o) && typeof l < "u" && typeof l.get == "function" && typeof l.set == "function") {
      var p = l.get, g = l.set;
      return Object.defineProperty(r, o, { configurable: !0, get: function() {
        return p.call(this);
      }, set: function(y) {
        u = "" + y, g.call(this, y);
      } }), Object.defineProperty(r, o, { enumerable: l.enumerable }), { getValue: function() {
        return u;
      }, setValue: function(y) {
        u = "" + y;
      }, stopTracking: function() {
        r._valueTracker = null, delete r[o];
      } };
    }
  }
  function vr(r) {
    r._valueTracker || (r._valueTracker = tt(r));
  }
  function $(r) {
    if (!r) return !1;
    var o = r._valueTracker;
    if (!o) return !0;
    var l = o.getValue(), u = "";
    return r && (u = Ke(r) ? r.checked ? "true" : "false" : r.value), r = u, r !== l ? (o.setValue(r), !0) : !1;
  }
  function N(r) {
    if (r = r || (typeof document < "u" ? document : void 0), typeof r > "u") return null;
    try {
      return r.activeElement || r.body;
    } catch {
      return r.body;
    }
  }
  function E(r, o) {
    var l = o.checked;
    return q({}, o, { defaultChecked: void 0, defaultValue: void 0, value: void 0, checked: l ?? r._wrapperState.initialChecked });
  }
  function G(r, o) {
    var l = o.defaultValue == null ? "" : o.defaultValue, u = o.checked != null ? o.checked : o.defaultChecked;
    l = Me(o.value != null ? o.value : l), r._wrapperState = { initialChecked: u, initialValue: l, controlled: o.type === "checkbox" || o.type === "radio" ? o.checked != null : o.value != null };
  }
  function J(r, o) {
    o = o.checked, o != null && L(r, "checked", o, !1);
  }
  function Z(r, o) {
    J(r, o);
    var l = Me(o.value), u = o.type;
    if (l != null) u === "number" ? (l === 0 && r.value === "" || r.value != l) && (r.value = "" + l) : r.value !== "" + l && (r.value = "" + l);
    else if (u === "submit" || u === "reset") {
      r.removeAttribute("value");
      return;
    }
    o.hasOwnProperty("value") ? ue(r, o.type, l) : o.hasOwnProperty("defaultValue") && ue(r, o.type, Me(o.defaultValue)), o.checked == null && o.defaultChecked != null && (r.defaultChecked = !!o.defaultChecked);
  }
  function ce(r, o, l) {
    if (o.hasOwnProperty("value") || o.hasOwnProperty("defaultValue")) {
      var u = o.type;
      if (!(u !== "submit" && u !== "reset" || o.value !== void 0 && o.value !== null)) return;
      o = "" + r._wrapperState.initialValue, l || o === r.value || (r.value = o), r.defaultValue = o;
    }
    l = r.name, l !== "" && (r.name = ""), r.defaultChecked = !!r._wrapperState.initialChecked, l !== "" && (r.name = l);
  }
  function ue(r, o, l) {
    (o !== "number" || N(r.ownerDocument) !== r) && (l == null ? r.defaultValue = "" + r._wrapperState.initialValue : r.defaultValue !== "" + l && (r.defaultValue = "" + l));
  }
  var k = Array.isArray;
  function w(r, o, l, u) {
    if (r = r.options, o) {
      o = {};
      for (var p = 0; p < l.length; p++) o["$" + l[p]] = !0;
      for (l = 0; l < r.length; l++) p = o.hasOwnProperty("$" + r[l].value), r[l].selected !== p && (r[l].selected = p), p && u && (r[l].defaultSelected = !0);
    } else {
      for (l = "" + Me(l), o = null, p = 0; p < r.length; p++) {
        if (r[p].value === l) {
          r[p].selected = !0, u && (r[p].defaultSelected = !0);
          return;
        }
        o !== null || r[p].disabled || (o = r[p]);
      }
      o !== null && (o.selected = !0);
    }
  }
  function U(r, o) {
    if (o.dangerouslySetInnerHTML != null) throw Error(n(91));
    return q({}, o, { value: void 0, defaultValue: void 0, children: "" + r._wrapperState.initialValue });
  }
  function Y(r, o) {
    var l = o.value;
    if (l == null) {
      if (l = o.children, o = o.defaultValue, l != null) {
        if (o != null) throw Error(n(92));
        if (k(l)) {
          if (1 < l.length) throw Error(n(93));
          l = l[0];
        }
        o = l;
      }
      o == null && (o = ""), l = o;
    }
    r._wrapperState = { initialValue: Me(l) };
  }
  function de(r, o) {
    var l = Me(o.value), u = Me(o.defaultValue);
    l != null && (l = "" + l, l !== r.value && (r.value = l), o.defaultValue == null && r.defaultValue !== l && (r.defaultValue = l)), u != null && (r.defaultValue = "" + u);
  }
  function le(r) {
    var o = r.textContent;
    o === r._wrapperState.initialValue && o !== "" && o !== null && (r.value = o);
  }
  function z(r) {
    switch (r) {
      case "svg":
        return "http://www.w3.org/2000/svg";
      case "math":
        return "http://www.w3.org/1998/Math/MathML";
      default:
        return "http://www.w3.org/1999/xhtml";
    }
  }
  function Q(r, o) {
    return r == null || r === "http://www.w3.org/1999/xhtml" ? z(o) : r === "http://www.w3.org/2000/svg" && o === "foreignObject" ? "http://www.w3.org/1999/xhtml" : r;
  }
  var ye, Ue = function(r) {
    return typeof MSApp < "u" && MSApp.execUnsafeLocalFunction ? function(o, l, u, p) {
      MSApp.execUnsafeLocalFunction(function() {
        return r(o, l, u, p);
      });
    } : r;
  }(function(r, o) {
    if (r.namespaceURI !== "http://www.w3.org/2000/svg" || "innerHTML" in r) r.innerHTML = o;
    else {
      for (ye = ye || document.createElement("div"), ye.innerHTML = "<svg>" + o.valueOf().toString() + "</svg>", o = ye.firstChild; r.firstChild; ) r.removeChild(r.firstChild);
      for (; o.firstChild; ) r.appendChild(o.firstChild);
    }
  });
  function Ze(r, o) {
    if (o) {
      var l = r.firstChild;
      if (l && l === r.lastChild && l.nodeType === 3) {
        l.nodeValue = o;
        return;
      }
    }
    r.textContent = o;
  }
  var yt = {
    animationIterationCount: !0,
    aspectRatio: !0,
    borderImageOutset: !0,
    borderImageSlice: !0,
    borderImageWidth: !0,
    boxFlex: !0,
    boxFlexGroup: !0,
    boxOrdinalGroup: !0,
    columnCount: !0,
    columns: !0,
    flex: !0,
    flexGrow: !0,
    flexPositive: !0,
    flexShrink: !0,
    flexNegative: !0,
    flexOrder: !0,
    gridArea: !0,
    gridRow: !0,
    gridRowEnd: !0,
    gridRowSpan: !0,
    gridRowStart: !0,
    gridColumn: !0,
    gridColumnEnd: !0,
    gridColumnSpan: !0,
    gridColumnStart: !0,
    fontWeight: !0,
    lineClamp: !0,
    lineHeight: !0,
    opacity: !0,
    order: !0,
    orphans: !0,
    tabSize: !0,
    widows: !0,
    zIndex: !0,
    zoom: !0,
    fillOpacity: !0,
    floodOpacity: !0,
    stopOpacity: !0,
    strokeDasharray: !0,
    strokeDashoffset: !0,
    strokeMiterlimit: !0,
    strokeOpacity: !0,
    strokeWidth: !0
  }, $t = ["Webkit", "ms", "Moz", "O"];
  Object.keys(yt).forEach(function(r) {
    $t.forEach(function(o) {
      o = o + r.charAt(0).toUpperCase() + r.substring(1), yt[o] = yt[r];
    });
  });
  function qr(r, o, l) {
    return o == null || typeof o == "boolean" || o === "" ? "" : l || typeof o != "number" || o === 0 || yt.hasOwnProperty(r) && yt[r] ? ("" + o).trim() : o + "px";
  }
  function Xo(r, o) {
    r = r.style;
    for (var l in o) if (o.hasOwnProperty(l)) {
      var u = l.indexOf("--") === 0, p = qr(l, o[l], u);
      l === "float" && (l = "cssFloat"), u ? r.setProperty(l, p) : r[l] = p;
    }
  }
  var qt = q({ menuitem: !0 }, { area: !0, base: !0, br: !0, col: !0, embed: !0, hr: !0, img: !0, input: !0, keygen: !0, link: !0, meta: !0, param: !0, source: !0, track: !0, wbr: !0 });
  function lr(r, o) {
    if (o) {
      if (qt[r] && (o.children != null || o.dangerouslySetInnerHTML != null)) throw Error(n(137, r));
      if (o.dangerouslySetInnerHTML != null) {
        if (o.children != null) throw Error(n(60));
        if (typeof o.dangerouslySetInnerHTML != "object" || !("__html" in o.dangerouslySetInnerHTML)) throw Error(n(61));
      }
      if (o.style != null && typeof o.style != "object") throw Error(n(62));
    }
  }
  function Qo(r, o) {
    if (r.indexOf("-") === -1) return typeof o.is == "string";
    switch (r) {
      case "annotation-xml":
      case "color-profile":
      case "font-face":
      case "font-face-src":
      case "font-face-uri":
      case "font-face-format":
      case "font-face-name":
      case "missing-glyph":
        return !1;
      default:
        return !0;
    }
  }
  var Su = null;
  function Cu(r) {
    return r = r.target || r.srcElement || window, r.correspondingUseElement && (r = r.correspondingUseElement), r.nodeType === 3 ? r.parentNode : r;
  }
  var xu = null, Jo = null, qo = null;
  function Vf(r) {
    if (r = sl(r)) {
      if (typeof xu != "function") throw Error(n(280));
      var o = r.stateNode;
      o && (o = Fa(o), xu(r.stateNode, r.type, o));
    }
  }
  function Hf(r) {
    Jo ? qo ? qo.push(r) : qo = [r] : Jo = r;
  }
  function Kf() {
    if (Jo) {
      var r = Jo, o = qo;
      if (qo = Jo = null, Vf(r), o) for (r = 0; r < o.length; r++) Vf(o[r]);
    }
  }
  function Yf(r, o) {
    return r(o);
  }
  function Gf() {
  }
  var $u = !1;
  function Xf(r, o, l) {
    if ($u) return r(o, l);
    $u = !0;
    try {
      return Yf(r, o, l);
    } finally {
      $u = !1, (Jo !== null || qo !== null) && (Gf(), Kf());
    }
  }
  function zi(r, o) {
    var l = r.stateNode;
    if (l === null) return null;
    var u = Fa(l);
    if (u === null) return null;
    l = u[o];
    e: switch (o) {
      case "onClick":
      case "onClickCapture":
      case "onDoubleClick":
      case "onDoubleClickCapture":
      case "onMouseDown":
      case "onMouseDownCapture":
      case "onMouseMove":
      case "onMouseMoveCapture":
      case "onMouseUp":
      case "onMouseUpCapture":
      case "onMouseEnter":
        (u = !u.disabled) || (r = r.type, u = !(r === "button" || r === "input" || r === "select" || r === "textarea")), r = !u;
        break e;
      default:
        r = !1;
    }
    if (r) return null;
    if (l && typeof l != "function") throw Error(n(231, o, typeof l));
    return l;
  }
  var Eu = !1;
  if (f) try {
    var Ui = {};
    Object.defineProperty(Ui, "passive", { get: function() {
      Eu = !0;
    } }), window.addEventListener("test", Ui, Ui), window.removeEventListener("test", Ui, Ui);
  } catch {
    Eu = !1;
  }
  function oy(r, o, l, u, p, g, y, C, O) {
    var H = Array.prototype.slice.call(arguments, 3);
    try {
      o.apply(l, H);
    } catch (ne) {
      this.onError(ne);
    }
  }
  var Wi = !1, ba = null, ya = !1, Tu = null, iy = { onError: function(r) {
    Wi = !0, ba = r;
  } };
  function ly(r, o, l, u, p, g, y, C, O) {
    Wi = !1, ba = null, oy.apply(iy, arguments);
  }
  function ay(r, o, l, u, p, g, y, C, O) {
    if (ly.apply(this, arguments), Wi) {
      if (Wi) {
        var H = ba;
        Wi = !1, ba = null;
      } else throw Error(n(198));
      ya || (ya = !0, Tu = H);
    }
  }
  function Co(r) {
    var o = r, l = r;
    if (r.alternate) for (; o.return; ) o = o.return;
    else {
      r = o;
      do
        o = r, (o.flags & 4098) !== 0 && (l = o.return), r = o.return;
      while (r);
    }
    return o.tag === 3 ? l : null;
  }
  function Qf(r) {
    if (r.tag === 13) {
      var o = r.memoizedState;
      if (o === null && (r = r.alternate, r !== null && (o = r.memoizedState)), o !== null) return o.dehydrated;
    }
    return null;
  }
  function Jf(r) {
    if (Co(r) !== r) throw Error(n(188));
  }
  function sy(r) {
    var o = r.alternate;
    if (!o) {
      if (o = Co(r), o === null) throw Error(n(188));
      return o !== r ? null : r;
    }
    for (var l = r, u = o; ; ) {
      var p = l.return;
      if (p === null) break;
      var g = p.alternate;
      if (g === null) {
        if (u = p.return, u !== null) {
          l = u;
          continue;
        }
        break;
      }
      if (p.child === g.child) {
        for (g = p.child; g; ) {
          if (g === l) return Jf(p), r;
          if (g === u) return Jf(p), o;
          g = g.sibling;
        }
        throw Error(n(188));
      }
      if (l.return !== u.return) l = p, u = g;
      else {
        for (var y = !1, C = p.child; C; ) {
          if (C === l) {
            y = !0, l = p, u = g;
            break;
          }
          if (C === u) {
            y = !0, u = p, l = g;
            break;
          }
          C = C.sibling;
        }
        if (!y) {
          for (C = g.child; C; ) {
            if (C === l) {
              y = !0, l = g, u = p;
              break;
            }
            if (C === u) {
              y = !0, u = g, l = p;
              break;
            }
            C = C.sibling;
          }
          if (!y) throw Error(n(189));
        }
      }
      if (l.alternate !== u) throw Error(n(190));
    }
    if (l.tag !== 3) throw Error(n(188));
    return l.stateNode.current === l ? r : o;
  }
  function qf(r) {
    return r = sy(r), r !== null ? Zf(r) : null;
  }
  function Zf(r) {
    if (r.tag === 5 || r.tag === 6) return r;
    for (r = r.child; r !== null; ) {
      var o = Zf(r);
      if (o !== null) return o;
      r = r.sibling;
    }
    return null;
  }
  var ep = t.unstable_scheduleCallback, tp = t.unstable_cancelCallback, uy = t.unstable_shouldYield, cy = t.unstable_requestPaint, _t = t.unstable_now, dy = t.unstable_getCurrentPriorityLevel, Ou = t.unstable_ImmediatePriority, rp = t.unstable_UserBlockingPriority, _a = t.unstable_NormalPriority, fy = t.unstable_LowPriority, np = t.unstable_IdlePriority, ka = null, Zr = null;
  function py(r) {
    if (Zr && typeof Zr.onCommitFiberRoot == "function") try {
      Zr.onCommitFiberRoot(ka, r, void 0, (r.current.flags & 128) === 128);
    } catch {
    }
  }
  var Mr = Math.clz32 ? Math.clz32 : my, gy = Math.log, hy = Math.LN2;
  function my(r) {
    return r >>>= 0, r === 0 ? 32 : 31 - (gy(r) / hy | 0) | 0;
  }
  var wa = 64, Sa = 4194304;
  function Vi(r) {
    switch (r & -r) {
      case 1:
        return 1;
      case 2:
        return 2;
      case 4:
        return 4;
      case 8:
        return 8;
      case 16:
        return 16;
      case 32:
        return 32;
      case 64:
      case 128:
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return r & 4194240;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
      case 67108864:
        return r & 130023424;
      case 134217728:
        return 134217728;
      case 268435456:
        return 268435456;
      case 536870912:
        return 536870912;
      case 1073741824:
        return 1073741824;
      default:
        return r;
    }
  }
  function Ca(r, o) {
    var l = r.pendingLanes;
    if (l === 0) return 0;
    var u = 0, p = r.suspendedLanes, g = r.pingedLanes, y = l & 268435455;
    if (y !== 0) {
      var C = y & ~p;
      C !== 0 ? u = Vi(C) : (g &= y, g !== 0 && (u = Vi(g)));
    } else y = l & ~p, y !== 0 ? u = Vi(y) : g !== 0 && (u = Vi(g));
    if (u === 0) return 0;
    if (o !== 0 && o !== u && (o & p) === 0 && (p = u & -u, g = o & -o, p >= g || p === 16 && (g & 4194240) !== 0)) return o;
    if ((u & 4) !== 0 && (u |= l & 16), o = r.entangledLanes, o !== 0) for (r = r.entanglements, o &= u; 0 < o; ) l = 31 - Mr(o), p = 1 << l, u |= r[l], o &= ~p;
    return u;
  }
  function vy(r, o) {
    switch (r) {
      case 1:
      case 2:
      case 4:
        return o + 250;
      case 8:
      case 16:
      case 32:
      case 64:
      case 128:
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return o + 5e3;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
      case 67108864:
        return -1;
      case 134217728:
      case 268435456:
      case 536870912:
      case 1073741824:
        return -1;
      default:
        return -1;
    }
  }
  function by(r, o) {
    for (var l = r.suspendedLanes, u = r.pingedLanes, p = r.expirationTimes, g = r.pendingLanes; 0 < g; ) {
      var y = 31 - Mr(g), C = 1 << y, O = p[y];
      O === -1 ? ((C & l) === 0 || (C & u) !== 0) && (p[y] = vy(C, o)) : O <= o && (r.expiredLanes |= C), g &= ~C;
    }
  }
  function Lu(r) {
    return r = r.pendingLanes & -1073741825, r !== 0 ? r : r & 1073741824 ? 1073741824 : 0;
  }
  function op() {
    var r = wa;
    return wa <<= 1, (wa & 4194240) === 0 && (wa = 64), r;
  }
  function Pu(r) {
    for (var o = [], l = 0; 31 > l; l++) o.push(r);
    return o;
  }
  function Hi(r, o, l) {
    r.pendingLanes |= o, o !== 536870912 && (r.suspendedLanes = 0, r.pingedLanes = 0), r = r.eventTimes, o = 31 - Mr(o), r[o] = l;
  }
  function yy(r, o) {
    var l = r.pendingLanes & ~o;
    r.pendingLanes = o, r.suspendedLanes = 0, r.pingedLanes = 0, r.expiredLanes &= o, r.mutableReadLanes &= o, r.entangledLanes &= o, o = r.entanglements;
    var u = r.eventTimes;
    for (r = r.expirationTimes; 0 < l; ) {
      var p = 31 - Mr(l), g = 1 << p;
      o[p] = 0, u[p] = -1, r[p] = -1, l &= ~g;
    }
  }
  function Nu(r, o) {
    var l = r.entangledLanes |= o;
    for (r = r.entanglements; l; ) {
      var u = 31 - Mr(l), p = 1 << u;
      p & o | r[u] & o && (r[u] |= o), l &= ~p;
    }
  }
  var et = 0;
  function ip(r) {
    return r &= -r, 1 < r ? 4 < r ? (r & 268435455) !== 0 ? 16 : 536870912 : 4 : 1;
  }
  var lp, Ru, ap, sp, up, Iu = !1, xa = [], zn = null, Un = null, Wn = null, Ki = /* @__PURE__ */ new Map(), Yi = /* @__PURE__ */ new Map(), Vn = [], _y = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");
  function cp(r, o) {
    switch (r) {
      case "focusin":
      case "focusout":
        zn = null;
        break;
      case "dragenter":
      case "dragleave":
        Un = null;
        break;
      case "mouseover":
      case "mouseout":
        Wn = null;
        break;
      case "pointerover":
      case "pointerout":
        Ki.delete(o.pointerId);
        break;
      case "gotpointercapture":
      case "lostpointercapture":
        Yi.delete(o.pointerId);
    }
  }
  function Gi(r, o, l, u, p, g) {
    return r === null || r.nativeEvent !== g ? (r = { blockedOn: o, domEventName: l, eventSystemFlags: u, nativeEvent: g, targetContainers: [p] }, o !== null && (o = sl(o), o !== null && Ru(o)), r) : (r.eventSystemFlags |= u, o = r.targetContainers, p !== null && o.indexOf(p) === -1 && o.push(p), r);
  }
  function ky(r, o, l, u, p) {
    switch (o) {
      case "focusin":
        return zn = Gi(zn, r, o, l, u, p), !0;
      case "dragenter":
        return Un = Gi(Un, r, o, l, u, p), !0;
      case "mouseover":
        return Wn = Gi(Wn, r, o, l, u, p), !0;
      case "pointerover":
        var g = p.pointerId;
        return Ki.set(g, Gi(Ki.get(g) || null, r, o, l, u, p)), !0;
      case "gotpointercapture":
        return g = p.pointerId, Yi.set(g, Gi(Yi.get(g) || null, r, o, l, u, p)), !0;
    }
    return !1;
  }
  function dp(r) {
    var o = xo(r.target);
    if (o !== null) {
      var l = Co(o);
      if (l !== null) {
        if (o = l.tag, o === 13) {
          if (o = Qf(l), o !== null) {
            r.blockedOn = o, up(r.priority, function() {
              ap(l);
            });
            return;
          }
        } else if (o === 3 && l.stateNode.current.memoizedState.isDehydrated) {
          r.blockedOn = l.tag === 3 ? l.stateNode.containerInfo : null;
          return;
        }
      }
    }
    r.blockedOn = null;
  }
  function $a(r) {
    if (r.blockedOn !== null) return !1;
    for (var o = r.targetContainers; 0 < o.length; ) {
      var l = Bu(r.domEventName, r.eventSystemFlags, o[0], r.nativeEvent);
      if (l === null) {
        l = r.nativeEvent;
        var u = new l.constructor(l.type, l);
        Su = u, l.target.dispatchEvent(u), Su = null;
      } else return o = sl(l), o !== null && Ru(o), r.blockedOn = l, !1;
      o.shift();
    }
    return !0;
  }
  function fp(r, o, l) {
    $a(r) && l.delete(o);
  }
  function wy() {
    Iu = !1, zn !== null && $a(zn) && (zn = null), Un !== null && $a(Un) && (Un = null), Wn !== null && $a(Wn) && (Wn = null), Ki.forEach(fp), Yi.forEach(fp);
  }
  function Xi(r, o) {
    r.blockedOn === o && (r.blockedOn = null, Iu || (Iu = !0, t.unstable_scheduleCallback(t.unstable_NormalPriority, wy)));
  }
  function Qi(r) {
    function o(p) {
      return Xi(p, r);
    }
    if (0 < xa.length) {
      Xi(xa[0], r);
      for (var l = 1; l < xa.length; l++) {
        var u = xa[l];
        u.blockedOn === r && (u.blockedOn = null);
      }
    }
    for (zn !== null && Xi(zn, r), Un !== null && Xi(Un, r), Wn !== null && Xi(Wn, r), Ki.forEach(o), Yi.forEach(o), l = 0; l < Vn.length; l++) u = Vn[l], u.blockedOn === r && (u.blockedOn = null);
    for (; 0 < Vn.length && (l = Vn[0], l.blockedOn === null); ) dp(l), l.blockedOn === null && Vn.shift();
  }
  var Zo = S.ReactCurrentBatchConfig, Ea = !0;
  function Sy(r, o, l, u) {
    var p = et, g = Zo.transition;
    Zo.transition = null;
    try {
      et = 1, Au(r, o, l, u);
    } finally {
      et = p, Zo.transition = g;
    }
  }
  function Cy(r, o, l, u) {
    var p = et, g = Zo.transition;
    Zo.transition = null;
    try {
      et = 4, Au(r, o, l, u);
    } finally {
      et = p, Zo.transition = g;
    }
  }
  function Au(r, o, l, u) {
    if (Ea) {
      var p = Bu(r, o, l, u);
      if (p === null) Zu(r, o, u, Ta, l), cp(r, u);
      else if (ky(p, r, o, l, u)) u.stopPropagation();
      else if (cp(r, u), o & 4 && -1 < _y.indexOf(r)) {
        for (; p !== null; ) {
          var g = sl(p);
          if (g !== null && lp(g), g = Bu(r, o, l, u), g === null && Zu(r, o, u, Ta, l), g === p) break;
          p = g;
        }
        p !== null && u.stopPropagation();
      } else Zu(r, o, u, null, l);
    }
  }
  var Ta = null;
  function Bu(r, o, l, u) {
    if (Ta = null, r = Cu(u), r = xo(r), r !== null) if (o = Co(r), o === null) r = null;
    else if (l = o.tag, l === 13) {
      if (r = Qf(o), r !== null) return r;
      r = null;
    } else if (l === 3) {
      if (o.stateNode.current.memoizedState.isDehydrated) return o.tag === 3 ? o.stateNode.containerInfo : null;
      r = null;
    } else o !== r && (r = null);
    return Ta = r, null;
  }
  function pp(r) {
    switch (r) {
      case "cancel":
      case "click":
      case "close":
      case "contextmenu":
      case "copy":
      case "cut":
      case "auxclick":
      case "dblclick":
      case "dragend":
      case "dragstart":
      case "drop":
      case "focusin":
      case "focusout":
      case "input":
      case "invalid":
      case "keydown":
      case "keypress":
      case "keyup":
      case "mousedown":
      case "mouseup":
      case "paste":
      case "pause":
      case "play":
      case "pointercancel":
      case "pointerdown":
      case "pointerup":
      case "ratechange":
      case "reset":
      case "resize":
      case "seeked":
      case "submit":
      case "touchcancel":
      case "touchend":
      case "touchstart":
      case "volumechange":
      case "change":
      case "selectionchange":
      case "textInput":
      case "compositionstart":
      case "compositionend":
      case "compositionupdate":
      case "beforeblur":
      case "afterblur":
      case "beforeinput":
      case "blur":
      case "fullscreenchange":
      case "focus":
      case "hashchange":
      case "popstate":
      case "select":
      case "selectstart":
        return 1;
      case "drag":
      case "dragenter":
      case "dragexit":
      case "dragleave":
      case "dragover":
      case "mousemove":
      case "mouseout":
      case "mouseover":
      case "pointermove":
      case "pointerout":
      case "pointerover":
      case "scroll":
      case "toggle":
      case "touchmove":
      case "wheel":
      case "mouseenter":
      case "mouseleave":
      case "pointerenter":
      case "pointerleave":
        return 4;
      case "message":
        switch (dy()) {
          case Ou:
            return 1;
          case rp:
            return 4;
          case _a:
          case fy:
            return 16;
          case np:
            return 536870912;
          default:
            return 16;
        }
      default:
        return 16;
    }
  }
  var Hn = null, Du = null, Oa = null;
  function gp() {
    if (Oa) return Oa;
    var r, o = Du, l = o.length, u, p = "value" in Hn ? Hn.value : Hn.textContent, g = p.length;
    for (r = 0; r < l && o[r] === p[r]; r++) ;
    var y = l - r;
    for (u = 1; u <= y && o[l - u] === p[g - u]; u++) ;
    return Oa = p.slice(r, 1 < u ? 1 - u : void 0);
  }
  function La(r) {
    var o = r.keyCode;
    return "charCode" in r ? (r = r.charCode, r === 0 && o === 13 && (r = 13)) : r = o, r === 10 && (r = 13), 32 <= r || r === 13 ? r : 0;
  }
  function Pa() {
    return !0;
  }
  function hp() {
    return !1;
  }
  function br(r) {
    function o(l, u, p, g, y) {
      this._reactName = l, this._targetInst = p, this.type = u, this.nativeEvent = g, this.target = y, this.currentTarget = null;
      for (var C in r) r.hasOwnProperty(C) && (l = r[C], this[C] = l ? l(g) : g[C]);
      return this.isDefaultPrevented = (g.defaultPrevented != null ? g.defaultPrevented : g.returnValue === !1) ? Pa : hp, this.isPropagationStopped = hp, this;
    }
    return q(o.prototype, { preventDefault: function() {
      this.defaultPrevented = !0;
      var l = this.nativeEvent;
      l && (l.preventDefault ? l.preventDefault() : typeof l.returnValue != "unknown" && (l.returnValue = !1), this.isDefaultPrevented = Pa);
    }, stopPropagation: function() {
      var l = this.nativeEvent;
      l && (l.stopPropagation ? l.stopPropagation() : typeof l.cancelBubble != "unknown" && (l.cancelBubble = !0), this.isPropagationStopped = Pa);
    }, persist: function() {
    }, isPersistent: Pa }), o;
  }
  var ei = { eventPhase: 0, bubbles: 0, cancelable: 0, timeStamp: function(r) {
    return r.timeStamp || Date.now();
  }, defaultPrevented: 0, isTrusted: 0 }, Mu = br(ei), Ji = q({}, ei, { view: 0, detail: 0 }), xy = br(Ji), ju, Fu, qi, Na = q({}, Ji, { screenX: 0, screenY: 0, clientX: 0, clientY: 0, pageX: 0, pageY: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, getModifierState: Uu, button: 0, buttons: 0, relatedTarget: function(r) {
    return r.relatedTarget === void 0 ? r.fromElement === r.srcElement ? r.toElement : r.fromElement : r.relatedTarget;
  }, movementX: function(r) {
    return "movementX" in r ? r.movementX : (r !== qi && (qi && r.type === "mousemove" ? (ju = r.screenX - qi.screenX, Fu = r.screenY - qi.screenY) : Fu = ju = 0, qi = r), ju);
  }, movementY: function(r) {
    return "movementY" in r ? r.movementY : Fu;
  } }), mp = br(Na), $y = q({}, Na, { dataTransfer: 0 }), Ey = br($y), Ty = q({}, Ji, { relatedTarget: 0 }), zu = br(Ty), Oy = q({}, ei, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }), Ly = br(Oy), Py = q({}, ei, { clipboardData: function(r) {
    return "clipboardData" in r ? r.clipboardData : window.clipboardData;
  } }), Ny = br(Py), Ry = q({}, ei, { data: 0 }), vp = br(Ry), Iy = {
    Esc: "Escape",
    Spacebar: " ",
    Left: "ArrowLeft",
    Up: "ArrowUp",
    Right: "ArrowRight",
    Down: "ArrowDown",
    Del: "Delete",
    Win: "OS",
    Menu: "ContextMenu",
    Apps: "ContextMenu",
    Scroll: "ScrollLock",
    MozPrintableKey: "Unidentified"
  }, Ay = {
    8: "Backspace",
    9: "Tab",
    12: "Clear",
    13: "Enter",
    16: "Shift",
    17: "Control",
    18: "Alt",
    19: "Pause",
    20: "CapsLock",
    27: "Escape",
    32: " ",
    33: "PageUp",
    34: "PageDown",
    35: "End",
    36: "Home",
    37: "ArrowLeft",
    38: "ArrowUp",
    39: "ArrowRight",
    40: "ArrowDown",
    45: "Insert",
    46: "Delete",
    112: "F1",
    113: "F2",
    114: "F3",
    115: "F4",
    116: "F5",
    117: "F6",
    118: "F7",
    119: "F8",
    120: "F9",
    121: "F10",
    122: "F11",
    123: "F12",
    144: "NumLock",
    145: "ScrollLock",
    224: "Meta"
  }, By = { Alt: "altKey", Control: "ctrlKey", Meta: "metaKey", Shift: "shiftKey" };
  function Dy(r) {
    var o = this.nativeEvent;
    return o.getModifierState ? o.getModifierState(r) : (r = By[r]) ? !!o[r] : !1;
  }
  function Uu() {
    return Dy;
  }
  var My = q({}, Ji, { key: function(r) {
    if (r.key) {
      var o = Iy[r.key] || r.key;
      if (o !== "Unidentified") return o;
    }
    return r.type === "keypress" ? (r = La(r), r === 13 ? "Enter" : String.fromCharCode(r)) : r.type === "keydown" || r.type === "keyup" ? Ay[r.keyCode] || "Unidentified" : "";
  }, code: 0, location: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, repeat: 0, locale: 0, getModifierState: Uu, charCode: function(r) {
    return r.type === "keypress" ? La(r) : 0;
  }, keyCode: function(r) {
    return r.type === "keydown" || r.type === "keyup" ? r.keyCode : 0;
  }, which: function(r) {
    return r.type === "keypress" ? La(r) : r.type === "keydown" || r.type === "keyup" ? r.keyCode : 0;
  } }), jy = br(My), Fy = q({}, Na, { pointerId: 0, width: 0, height: 0, pressure: 0, tangentialPressure: 0, tiltX: 0, tiltY: 0, twist: 0, pointerType: 0, isPrimary: 0 }), bp = br(Fy), zy = q({}, Ji, { touches: 0, targetTouches: 0, changedTouches: 0, altKey: 0, metaKey: 0, ctrlKey: 0, shiftKey: 0, getModifierState: Uu }), Uy = br(zy), Wy = q({}, ei, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }), Vy = br(Wy), Hy = q({}, Na, {
    deltaX: function(r) {
      return "deltaX" in r ? r.deltaX : "wheelDeltaX" in r ? -r.wheelDeltaX : 0;
    },
    deltaY: function(r) {
      return "deltaY" in r ? r.deltaY : "wheelDeltaY" in r ? -r.wheelDeltaY : "wheelDelta" in r ? -r.wheelDelta : 0;
    },
    deltaZ: 0,
    deltaMode: 0
  }), Ky = br(Hy), Yy = [9, 13, 27, 32], Wu = f && "CompositionEvent" in window, Zi = null;
  f && "documentMode" in document && (Zi = document.documentMode);
  var Gy = f && "TextEvent" in window && !Zi, yp = f && (!Wu || Zi && 8 < Zi && 11 >= Zi), _p = " ", kp = !1;
  function wp(r, o) {
    switch (r) {
      case "keyup":
        return Yy.indexOf(o.keyCode) !== -1;
      case "keydown":
        return o.keyCode !== 229;
      case "keypress":
      case "mousedown":
      case "focusout":
        return !0;
      default:
        return !1;
    }
  }
  function Sp(r) {
    return r = r.detail, typeof r == "object" && "data" in r ? r.data : null;
  }
  var ti = !1;
  function Xy(r, o) {
    switch (r) {
      case "compositionend":
        return Sp(o);
      case "keypress":
        return o.which !== 32 ? null : (kp = !0, _p);
      case "textInput":
        return r = o.data, r === _p && kp ? null : r;
      default:
        return null;
    }
  }
  function Qy(r, o) {
    if (ti) return r === "compositionend" || !Wu && wp(r, o) ? (r = gp(), Oa = Du = Hn = null, ti = !1, r) : null;
    switch (r) {
      case "paste":
        return null;
      case "keypress":
        if (!(o.ctrlKey || o.altKey || o.metaKey) || o.ctrlKey && o.altKey) {
          if (o.char && 1 < o.char.length) return o.char;
          if (o.which) return String.fromCharCode(o.which);
        }
        return null;
      case "compositionend":
        return yp && o.locale !== "ko" ? null : o.data;
      default:
        return null;
    }
  }
  var Jy = { color: !0, date: !0, datetime: !0, "datetime-local": !0, email: !0, month: !0, number: !0, password: !0, range: !0, search: !0, tel: !0, text: !0, time: !0, url: !0, week: !0 };
  function Cp(r) {
    var o = r && r.nodeName && r.nodeName.toLowerCase();
    return o === "input" ? !!Jy[r.type] : o === "textarea";
  }
  function xp(r, o, l, u) {
    Hf(u), o = Da(o, "onChange"), 0 < o.length && (l = new Mu("onChange", "change", null, l, u), r.push({ event: l, listeners: o }));
  }
  var el = null, tl = null;
  function qy(r) {
    Wp(r, 0);
  }
  function Ra(r) {
    var o = li(r);
    if ($(o)) return r;
  }
  function Zy(r, o) {
    if (r === "change") return o;
  }
  var $p = !1;
  if (f) {
    var Vu;
    if (f) {
      var Hu = "oninput" in document;
      if (!Hu) {
        var Ep = document.createElement("div");
        Ep.setAttribute("oninput", "return;"), Hu = typeof Ep.oninput == "function";
      }
      Vu = Hu;
    } else Vu = !1;
    $p = Vu && (!document.documentMode || 9 < document.documentMode);
  }
  function Tp() {
    el && (el.detachEvent("onpropertychange", Op), tl = el = null);
  }
  function Op(r) {
    if (r.propertyName === "value" && Ra(tl)) {
      var o = [];
      xp(o, tl, r, Cu(r)), Xf(qy, o);
    }
  }
  function e1(r, o, l) {
    r === "focusin" ? (Tp(), el = o, tl = l, el.attachEvent("onpropertychange", Op)) : r === "focusout" && Tp();
  }
  function t1(r) {
    if (r === "selectionchange" || r === "keyup" || r === "keydown") return Ra(tl);
  }
  function r1(r, o) {
    if (r === "click") return Ra(o);
  }
  function n1(r, o) {
    if (r === "input" || r === "change") return Ra(o);
  }
  function o1(r, o) {
    return r === o && (r !== 0 || 1 / r === 1 / o) || r !== r && o !== o;
  }
  var jr = typeof Object.is == "function" ? Object.is : o1;
  function rl(r, o) {
    if (jr(r, o)) return !0;
    if (typeof r != "object" || r === null || typeof o != "object" || o === null) return !1;
    var l = Object.keys(r), u = Object.keys(o);
    if (l.length !== u.length) return !1;
    for (u = 0; u < l.length; u++) {
      var p = l[u];
      if (!d.call(o, p) || !jr(r[p], o[p])) return !1;
    }
    return !0;
  }
  function Lp(r) {
    for (; r && r.firstChild; ) r = r.firstChild;
    return r;
  }
  function Pp(r, o) {
    var l = Lp(r);
    r = 0;
    for (var u; l; ) {
      if (l.nodeType === 3) {
        if (u = r + l.textContent.length, r <= o && u >= o) return { node: l, offset: o - r };
        r = u;
      }
      e: {
        for (; l; ) {
          if (l.nextSibling) {
            l = l.nextSibling;
            break e;
          }
          l = l.parentNode;
        }
        l = void 0;
      }
      l = Lp(l);
    }
  }
  function Np(r, o) {
    return r && o ? r === o ? !0 : r && r.nodeType === 3 ? !1 : o && o.nodeType === 3 ? Np(r, o.parentNode) : "contains" in r ? r.contains(o) : r.compareDocumentPosition ? !!(r.compareDocumentPosition(o) & 16) : !1 : !1;
  }
  function Rp() {
    for (var r = window, o = N(); o instanceof r.HTMLIFrameElement; ) {
      try {
        var l = typeof o.contentWindow.location.href == "string";
      } catch {
        l = !1;
      }
      if (l) r = o.contentWindow;
      else break;
      o = N(r.document);
    }
    return o;
  }
  function Ku(r) {
    var o = r && r.nodeName && r.nodeName.toLowerCase();
    return o && (o === "input" && (r.type === "text" || r.type === "search" || r.type === "tel" || r.type === "url" || r.type === "password") || o === "textarea" || r.contentEditable === "true");
  }
  function i1(r) {
    var o = Rp(), l = r.focusedElem, u = r.selectionRange;
    if (o !== l && l && l.ownerDocument && Np(l.ownerDocument.documentElement, l)) {
      if (u !== null && Ku(l)) {
        if (o = u.start, r = u.end, r === void 0 && (r = o), "selectionStart" in l) l.selectionStart = o, l.selectionEnd = Math.min(r, l.value.length);
        else if (r = (o = l.ownerDocument || document) && o.defaultView || window, r.getSelection) {
          r = r.getSelection();
          var p = l.textContent.length, g = Math.min(u.start, p);
          u = u.end === void 0 ? g : Math.min(u.end, p), !r.extend && g > u && (p = u, u = g, g = p), p = Pp(l, g);
          var y = Pp(
            l,
            u
          );
          p && y && (r.rangeCount !== 1 || r.anchorNode !== p.node || r.anchorOffset !== p.offset || r.focusNode !== y.node || r.focusOffset !== y.offset) && (o = o.createRange(), o.setStart(p.node, p.offset), r.removeAllRanges(), g > u ? (r.addRange(o), r.extend(y.node, y.offset)) : (o.setEnd(y.node, y.offset), r.addRange(o)));
        }
      }
      for (o = [], r = l; r = r.parentNode; ) r.nodeType === 1 && o.push({ element: r, left: r.scrollLeft, top: r.scrollTop });
      for (typeof l.focus == "function" && l.focus(), l = 0; l < o.length; l++) r = o[l], r.element.scrollLeft = r.left, r.element.scrollTop = r.top;
    }
  }
  var l1 = f && "documentMode" in document && 11 >= document.documentMode, ri = null, Yu = null, nl = null, Gu = !1;
  function Ip(r, o, l) {
    var u = l.window === l ? l.document : l.nodeType === 9 ? l : l.ownerDocument;
    Gu || ri == null || ri !== N(u) || (u = ri, "selectionStart" in u && Ku(u) ? u = { start: u.selectionStart, end: u.selectionEnd } : (u = (u.ownerDocument && u.ownerDocument.defaultView || window).getSelection(), u = { anchorNode: u.anchorNode, anchorOffset: u.anchorOffset, focusNode: u.focusNode, focusOffset: u.focusOffset }), nl && rl(nl, u) || (nl = u, u = Da(Yu, "onSelect"), 0 < u.length && (o = new Mu("onSelect", "select", null, o, l), r.push({ event: o, listeners: u }), o.target = ri)));
  }
  function Ia(r, o) {
    var l = {};
    return l[r.toLowerCase()] = o.toLowerCase(), l["Webkit" + r] = "webkit" + o, l["Moz" + r] = "moz" + o, l;
  }
  var ni = { animationend: Ia("Animation", "AnimationEnd"), animationiteration: Ia("Animation", "AnimationIteration"), animationstart: Ia("Animation", "AnimationStart"), transitionend: Ia("Transition", "TransitionEnd") }, Xu = {}, Ap = {};
  f && (Ap = document.createElement("div").style, "AnimationEvent" in window || (delete ni.animationend.animation, delete ni.animationiteration.animation, delete ni.animationstart.animation), "TransitionEvent" in window || delete ni.transitionend.transition);
  function Aa(r) {
    if (Xu[r]) return Xu[r];
    if (!ni[r]) return r;
    var o = ni[r], l;
    for (l in o) if (o.hasOwnProperty(l) && l in Ap) return Xu[r] = o[l];
    return r;
  }
  var Bp = Aa("animationend"), Dp = Aa("animationiteration"), Mp = Aa("animationstart"), jp = Aa("transitionend"), Fp = /* @__PURE__ */ new Map(), zp = "abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
  function Kn(r, o) {
    Fp.set(r, o), s(o, [r]);
  }
  for (var Qu = 0; Qu < zp.length; Qu++) {
    var Ju = zp[Qu], a1 = Ju.toLowerCase(), s1 = Ju[0].toUpperCase() + Ju.slice(1);
    Kn(a1, "on" + s1);
  }
  Kn(Bp, "onAnimationEnd"), Kn(Dp, "onAnimationIteration"), Kn(Mp, "onAnimationStart"), Kn("dblclick", "onDoubleClick"), Kn("focusin", "onFocus"), Kn("focusout", "onBlur"), Kn(jp, "onTransitionEnd"), c("onMouseEnter", ["mouseout", "mouseover"]), c("onMouseLeave", ["mouseout", "mouseover"]), c("onPointerEnter", ["pointerout", "pointerover"]), c("onPointerLeave", ["pointerout", "pointerover"]), s("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" ")), s("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")), s("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]), s("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" ")), s("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" ")), s("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
  var ol = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "), u1 = new Set("cancel close invalid load scroll toggle".split(" ").concat(ol));
  function Up(r, o, l) {
    var u = r.type || "unknown-event";
    r.currentTarget = l, ay(u, o, void 0, r), r.currentTarget = null;
  }
  function Wp(r, o) {
    o = (o & 4) !== 0;
    for (var l = 0; l < r.length; l++) {
      var u = r[l], p = u.event;
      u = u.listeners;
      e: {
        var g = void 0;
        if (o) for (var y = u.length - 1; 0 <= y; y--) {
          var C = u[y], O = C.instance, H = C.currentTarget;
          if (C = C.listener, O !== g && p.isPropagationStopped()) break e;
          Up(p, C, H), g = O;
        }
        else for (y = 0; y < u.length; y++) {
          if (C = u[y], O = C.instance, H = C.currentTarget, C = C.listener, O !== g && p.isPropagationStopped()) break e;
          Up(p, C, H), g = O;
        }
      }
    }
    if (ya) throw r = Tu, ya = !1, Tu = null, r;
  }
  function ut(r, o) {
    var l = o[ic];
    l === void 0 && (l = o[ic] = /* @__PURE__ */ new Set());
    var u = r + "__bubble";
    l.has(u) || (Vp(o, r, 2, !1), l.add(u));
  }
  function qu(r, o, l) {
    var u = 0;
    o && (u |= 4), Vp(l, r, u, o);
  }
  var Ba = "_reactListening" + Math.random().toString(36).slice(2);
  function il(r) {
    if (!r[Ba]) {
      r[Ba] = !0, i.forEach(function(l) {
        l !== "selectionchange" && (u1.has(l) || qu(l, !1, r), qu(l, !0, r));
      });
      var o = r.nodeType === 9 ? r : r.ownerDocument;
      o === null || o[Ba] || (o[Ba] = !0, qu("selectionchange", !1, o));
    }
  }
  function Vp(r, o, l, u) {
    switch (pp(o)) {
      case 1:
        var p = Sy;
        break;
      case 4:
        p = Cy;
        break;
      default:
        p = Au;
    }
    l = p.bind(null, o, l, r), p = void 0, !Eu || o !== "touchstart" && o !== "touchmove" && o !== "wheel" || (p = !0), u ? p !== void 0 ? r.addEventListener(o, l, { capture: !0, passive: p }) : r.addEventListener(o, l, !0) : p !== void 0 ? r.addEventListener(o, l, { passive: p }) : r.addEventListener(o, l, !1);
  }
  function Zu(r, o, l, u, p) {
    var g = u;
    if ((o & 1) === 0 && (o & 2) === 0 && u !== null) e: for (; ; ) {
      if (u === null) return;
      var y = u.tag;
      if (y === 3 || y === 4) {
        var C = u.stateNode.containerInfo;
        if (C === p || C.nodeType === 8 && C.parentNode === p) break;
        if (y === 4) for (y = u.return; y !== null; ) {
          var O = y.tag;
          if ((O === 3 || O === 4) && (O = y.stateNode.containerInfo, O === p || O.nodeType === 8 && O.parentNode === p)) return;
          y = y.return;
        }
        for (; C !== null; ) {
          if (y = xo(C), y === null) return;
          if (O = y.tag, O === 5 || O === 6) {
            u = g = y;
            continue e;
          }
          C = C.parentNode;
        }
      }
      u = u.return;
    }
    Xf(function() {
      var H = g, ne = Cu(l), ie = [];
      e: {
        var ee = Fp.get(r);
        if (ee !== void 0) {
          var pe = Mu, ve = r;
          switch (r) {
            case "keypress":
              if (La(l) === 0) break e;
            case "keydown":
            case "keyup":
              pe = jy;
              break;
            case "focusin":
              ve = "focus", pe = zu;
              break;
            case "focusout":
              ve = "blur", pe = zu;
              break;
            case "beforeblur":
            case "afterblur":
              pe = zu;
              break;
            case "click":
              if (l.button === 2) break e;
            case "auxclick":
            case "dblclick":
            case "mousedown":
            case "mousemove":
            case "mouseup":
            case "mouseout":
            case "mouseover":
            case "contextmenu":
              pe = mp;
              break;
            case "drag":
            case "dragend":
            case "dragenter":
            case "dragexit":
            case "dragleave":
            case "dragover":
            case "dragstart":
            case "drop":
              pe = Ey;
              break;
            case "touchcancel":
            case "touchend":
            case "touchmove":
            case "touchstart":
              pe = Uy;
              break;
            case Bp:
            case Dp:
            case Mp:
              pe = Ly;
              break;
            case jp:
              pe = Vy;
              break;
            case "scroll":
              pe = xy;
              break;
            case "wheel":
              pe = Ky;
              break;
            case "copy":
            case "cut":
            case "paste":
              pe = Ny;
              break;
            case "gotpointercapture":
            case "lostpointercapture":
            case "pointercancel":
            case "pointerdown":
            case "pointermove":
            case "pointerout":
            case "pointerover":
            case "pointerup":
              pe = bp;
          }
          var _e = (o & 4) !== 0, kt = !_e && r === "scroll", j = _e ? ee !== null ? ee + "Capture" : null : ee;
          _e = [];
          for (var A = H, W; A !== null; ) {
            W = A;
            var se = W.stateNode;
            if (W.tag === 5 && se !== null && (W = se, j !== null && (se = zi(A, j), se != null && _e.push(ll(A, se, W)))), kt) break;
            A = A.return;
          }
          0 < _e.length && (ee = new pe(ee, ve, null, l, ne), ie.push({ event: ee, listeners: _e }));
        }
      }
      if ((o & 7) === 0) {
        e: {
          if (ee = r === "mouseover" || r === "pointerover", pe = r === "mouseout" || r === "pointerout", ee && l !== Su && (ve = l.relatedTarget || l.fromElement) && (xo(ve) || ve[bn])) break e;
          if ((pe || ee) && (ee = ne.window === ne ? ne : (ee = ne.ownerDocument) ? ee.defaultView || ee.parentWindow : window, pe ? (ve = l.relatedTarget || l.toElement, pe = H, ve = ve ? xo(ve) : null, ve !== null && (kt = Co(ve), ve !== kt || ve.tag !== 5 && ve.tag !== 6) && (ve = null)) : (pe = null, ve = H), pe !== ve)) {
            if (_e = mp, se = "onMouseLeave", j = "onMouseEnter", A = "mouse", (r === "pointerout" || r === "pointerover") && (_e = bp, se = "onPointerLeave", j = "onPointerEnter", A = "pointer"), kt = pe == null ? ee : li(pe), W = ve == null ? ee : li(ve), ee = new _e(se, A + "leave", pe, l, ne), ee.target = kt, ee.relatedTarget = W, se = null, xo(ne) === H && (_e = new _e(j, A + "enter", ve, l, ne), _e.target = W, _e.relatedTarget = kt, se = _e), kt = se, pe && ve) t: {
              for (_e = pe, j = ve, A = 0, W = _e; W; W = oi(W)) A++;
              for (W = 0, se = j; se; se = oi(se)) W++;
              for (; 0 < A - W; ) _e = oi(_e), A--;
              for (; 0 < W - A; ) j = oi(j), W--;
              for (; A--; ) {
                if (_e === j || j !== null && _e === j.alternate) break t;
                _e = oi(_e), j = oi(j);
              }
              _e = null;
            }
            else _e = null;
            pe !== null && Hp(ie, ee, pe, _e, !1), ve !== null && kt !== null && Hp(ie, kt, ve, _e, !0);
          }
        }
        e: {
          if (ee = H ? li(H) : window, pe = ee.nodeName && ee.nodeName.toLowerCase(), pe === "select" || pe === "input" && ee.type === "file") var ke = Zy;
          else if (Cp(ee)) if ($p) ke = n1;
          else {
            ke = t1;
            var $e = e1;
          }
          else (pe = ee.nodeName) && pe.toLowerCase() === "input" && (ee.type === "checkbox" || ee.type === "radio") && (ke = r1);
          if (ke && (ke = ke(r, H))) {
            xp(ie, ke, l, ne);
            break e;
          }
          $e && $e(r, ee, H), r === "focusout" && ($e = ee._wrapperState) && $e.controlled && ee.type === "number" && ue(ee, "number", ee.value);
        }
        switch ($e = H ? li(H) : window, r) {
          case "focusin":
            (Cp($e) || $e.contentEditable === "true") && (ri = $e, Yu = H, nl = null);
            break;
          case "focusout":
            nl = Yu = ri = null;
            break;
          case "mousedown":
            Gu = !0;
            break;
          case "contextmenu":
          case "mouseup":
          case "dragend":
            Gu = !1, Ip(ie, l, ne);
            break;
          case "selectionchange":
            if (l1) break;
          case "keydown":
          case "keyup":
            Ip(ie, l, ne);
        }
        var Ee;
        if (Wu) e: {
          switch (r) {
            case "compositionstart":
              var Le = "onCompositionStart";
              break e;
            case "compositionend":
              Le = "onCompositionEnd";
              break e;
            case "compositionupdate":
              Le = "onCompositionUpdate";
              break e;
          }
          Le = void 0;
        }
        else ti ? wp(r, l) && (Le = "onCompositionEnd") : r === "keydown" && l.keyCode === 229 && (Le = "onCompositionStart");
        Le && (yp && l.locale !== "ko" && (ti || Le !== "onCompositionStart" ? Le === "onCompositionEnd" && ti && (Ee = gp()) : (Hn = ne, Du = "value" in Hn ? Hn.value : Hn.textContent, ti = !0)), $e = Da(H, Le), 0 < $e.length && (Le = new vp(Le, r, null, l, ne), ie.push({ event: Le, listeners: $e }), Ee ? Le.data = Ee : (Ee = Sp(l), Ee !== null && (Le.data = Ee)))), (Ee = Gy ? Xy(r, l) : Qy(r, l)) && (H = Da(H, "onBeforeInput"), 0 < H.length && (ne = new vp("onBeforeInput", "beforeinput", null, l, ne), ie.push({ event: ne, listeners: H }), ne.data = Ee));
      }
      Wp(ie, o);
    });
  }
  function ll(r, o, l) {
    return { instance: r, listener: o, currentTarget: l };
  }
  function Da(r, o) {
    for (var l = o + "Capture", u = []; r !== null; ) {
      var p = r, g = p.stateNode;
      p.tag === 5 && g !== null && (p = g, g = zi(r, l), g != null && u.unshift(ll(r, g, p)), g = zi(r, o), g != null && u.push(ll(r, g, p))), r = r.return;
    }
    return u;
  }
  function oi(r) {
    if (r === null) return null;
    do
      r = r.return;
    while (r && r.tag !== 5);
    return r || null;
  }
  function Hp(r, o, l, u, p) {
    for (var g = o._reactName, y = []; l !== null && l !== u; ) {
      var C = l, O = C.alternate, H = C.stateNode;
      if (O !== null && O === u) break;
      C.tag === 5 && H !== null && (C = H, p ? (O = zi(l, g), O != null && y.unshift(ll(l, O, C))) : p || (O = zi(l, g), O != null && y.push(ll(l, O, C)))), l = l.return;
    }
    y.length !== 0 && r.push({ event: o, listeners: y });
  }
  var c1 = /\r\n?/g, d1 = /\u0000|\uFFFD/g;
  function Kp(r) {
    return (typeof r == "string" ? r : "" + r).replace(c1, `
`).replace(d1, "");
  }
  function Ma(r, o, l) {
    if (o = Kp(o), Kp(r) !== o && l) throw Error(n(425));
  }
  function ja() {
  }
  var ec = null, tc = null;
  function rc(r, o) {
    return r === "textarea" || r === "noscript" || typeof o.children == "string" || typeof o.children == "number" || typeof o.dangerouslySetInnerHTML == "object" && o.dangerouslySetInnerHTML !== null && o.dangerouslySetInnerHTML.__html != null;
  }
  var nc = typeof setTimeout == "function" ? setTimeout : void 0, f1 = typeof clearTimeout == "function" ? clearTimeout : void 0, Yp = typeof Promise == "function" ? Promise : void 0, p1 = typeof queueMicrotask == "function" ? queueMicrotask : typeof Yp < "u" ? function(r) {
    return Yp.resolve(null).then(r).catch(g1);
  } : nc;
  function g1(r) {
    setTimeout(function() {
      throw r;
    });
  }
  function oc(r, o) {
    var l = o, u = 0;
    do {
      var p = l.nextSibling;
      if (r.removeChild(l), p && p.nodeType === 8) if (l = p.data, l === "/$") {
        if (u === 0) {
          r.removeChild(p), Qi(o);
          return;
        }
        u--;
      } else l !== "$" && l !== "$?" && l !== "$!" || u++;
      l = p;
    } while (l);
    Qi(o);
  }
  function Yn(r) {
    for (; r != null; r = r.nextSibling) {
      var o = r.nodeType;
      if (o === 1 || o === 3) break;
      if (o === 8) {
        if (o = r.data, o === "$" || o === "$!" || o === "$?") break;
        if (o === "/$") return null;
      }
    }
    return r;
  }
  function Gp(r) {
    r = r.previousSibling;
    for (var o = 0; r; ) {
      if (r.nodeType === 8) {
        var l = r.data;
        if (l === "$" || l === "$!" || l === "$?") {
          if (o === 0) return r;
          o--;
        } else l === "/$" && o++;
      }
      r = r.previousSibling;
    }
    return null;
  }
  var ii = Math.random().toString(36).slice(2), en = "__reactFiber$" + ii, al = "__reactProps$" + ii, bn = "__reactContainer$" + ii, ic = "__reactEvents$" + ii, h1 = "__reactListeners$" + ii, m1 = "__reactHandles$" + ii;
  function xo(r) {
    var o = r[en];
    if (o) return o;
    for (var l = r.parentNode; l; ) {
      if (o = l[bn] || l[en]) {
        if (l = o.alternate, o.child !== null || l !== null && l.child !== null) for (r = Gp(r); r !== null; ) {
          if (l = r[en]) return l;
          r = Gp(r);
        }
        return o;
      }
      r = l, l = r.parentNode;
    }
    return null;
  }
  function sl(r) {
    return r = r[en] || r[bn], !r || r.tag !== 5 && r.tag !== 6 && r.tag !== 13 && r.tag !== 3 ? null : r;
  }
  function li(r) {
    if (r.tag === 5 || r.tag === 6) return r.stateNode;
    throw Error(n(33));
  }
  function Fa(r) {
    return r[al] || null;
  }
  var lc = [], ai = -1;
  function Gn(r) {
    return { current: r };
  }
  function ct(r) {
    0 > ai || (r.current = lc[ai], lc[ai] = null, ai--);
  }
  function lt(r, o) {
    ai++, lc[ai] = r.current, r.current = o;
  }
  var Xn = {}, Wt = Gn(Xn), ar = Gn(!1), $o = Xn;
  function si(r, o) {
    var l = r.type.contextTypes;
    if (!l) return Xn;
    var u = r.stateNode;
    if (u && u.__reactInternalMemoizedUnmaskedChildContext === o) return u.__reactInternalMemoizedMaskedChildContext;
    var p = {}, g;
    for (g in l) p[g] = o[g];
    return u && (r = r.stateNode, r.__reactInternalMemoizedUnmaskedChildContext = o, r.__reactInternalMemoizedMaskedChildContext = p), p;
  }
  function sr(r) {
    return r = r.childContextTypes, r != null;
  }
  function za() {
    ct(ar), ct(Wt);
  }
  function Xp(r, o, l) {
    if (Wt.current !== Xn) throw Error(n(168));
    lt(Wt, o), lt(ar, l);
  }
  function Qp(r, o, l) {
    var u = r.stateNode;
    if (o = o.childContextTypes, typeof u.getChildContext != "function") return l;
    u = u.getChildContext();
    for (var p in u) if (!(p in o)) throw Error(n(108, ze(r) || "Unknown", p));
    return q({}, l, u);
  }
  function Ua(r) {
    return r = (r = r.stateNode) && r.__reactInternalMemoizedMergedChildContext || Xn, $o = Wt.current, lt(Wt, r), lt(ar, ar.current), !0;
  }
  function Jp(r, o, l) {
    var u = r.stateNode;
    if (!u) throw Error(n(169));
    l ? (r = Qp(r, o, $o), u.__reactInternalMemoizedMergedChildContext = r, ct(ar), ct(Wt), lt(Wt, r)) : ct(ar), lt(ar, l);
  }
  var yn = null, Wa = !1, ac = !1;
  function qp(r) {
    yn === null ? yn = [r] : yn.push(r);
  }
  function v1(r) {
    Wa = !0, qp(r);
  }
  function Qn() {
    if (!ac && yn !== null) {
      ac = !0;
      var r = 0, o = et;
      try {
        var l = yn;
        for (et = 1; r < l.length; r++) {
          var u = l[r];
          do
            u = u(!0);
          while (u !== null);
        }
        yn = null, Wa = !1;
      } catch (p) {
        throw yn !== null && (yn = yn.slice(r + 1)), ep(Ou, Qn), p;
      } finally {
        et = o, ac = !1;
      }
    }
    return null;
  }
  var ui = [], ci = 0, Va = null, Ha = 0, xr = [], $r = 0, Eo = null, _n = 1, kn = "";
  function To(r, o) {
    ui[ci++] = Ha, ui[ci++] = Va, Va = r, Ha = o;
  }
  function Zp(r, o, l) {
    xr[$r++] = _n, xr[$r++] = kn, xr[$r++] = Eo, Eo = r;
    var u = _n;
    r = kn;
    var p = 32 - Mr(u) - 1;
    u &= ~(1 << p), l += 1;
    var g = 32 - Mr(o) + p;
    if (30 < g) {
      var y = p - p % 5;
      g = (u & (1 << y) - 1).toString(32), u >>= y, p -= y, _n = 1 << 32 - Mr(o) + p | l << p | u, kn = g + r;
    } else _n = 1 << g | l << p | u, kn = r;
  }
  function sc(r) {
    r.return !== null && (To(r, 1), Zp(r, 1, 0));
  }
  function uc(r) {
    for (; r === Va; ) Va = ui[--ci], ui[ci] = null, Ha = ui[--ci], ui[ci] = null;
    for (; r === Eo; ) Eo = xr[--$r], xr[$r] = null, kn = xr[--$r], xr[$r] = null, _n = xr[--$r], xr[$r] = null;
  }
  var yr = null, _r = null, gt = !1, Fr = null;
  function eg(r, o) {
    var l = Lr(5, null, null, 0);
    l.elementType = "DELETED", l.stateNode = o, l.return = r, o = r.deletions, o === null ? (r.deletions = [l], r.flags |= 16) : o.push(l);
  }
  function tg(r, o) {
    switch (r.tag) {
      case 5:
        var l = r.type;
        return o = o.nodeType !== 1 || l.toLowerCase() !== o.nodeName.toLowerCase() ? null : o, o !== null ? (r.stateNode = o, yr = r, _r = Yn(o.firstChild), !0) : !1;
      case 6:
        return o = r.pendingProps === "" || o.nodeType !== 3 ? null : o, o !== null ? (r.stateNode = o, yr = r, _r = null, !0) : !1;
      case 13:
        return o = o.nodeType !== 8 ? null : o, o !== null ? (l = Eo !== null ? { id: _n, overflow: kn } : null, r.memoizedState = { dehydrated: o, treeContext: l, retryLane: 1073741824 }, l = Lr(18, null, null, 0), l.stateNode = o, l.return = r, r.child = l, yr = r, _r = null, !0) : !1;
      default:
        return !1;
    }
  }
  function cc(r) {
    return (r.mode & 1) !== 0 && (r.flags & 128) === 0;
  }
  function dc(r) {
    if (gt) {
      var o = _r;
      if (o) {
        var l = o;
        if (!tg(r, o)) {
          if (cc(r)) throw Error(n(418));
          o = Yn(l.nextSibling);
          var u = yr;
          o && tg(r, o) ? eg(u, l) : (r.flags = r.flags & -4097 | 2, gt = !1, yr = r);
        }
      } else {
        if (cc(r)) throw Error(n(418));
        r.flags = r.flags & -4097 | 2, gt = !1, yr = r;
      }
    }
  }
  function rg(r) {
    for (r = r.return; r !== null && r.tag !== 5 && r.tag !== 3 && r.tag !== 13; ) r = r.return;
    yr = r;
  }
  function Ka(r) {
    if (r !== yr) return !1;
    if (!gt) return rg(r), gt = !0, !1;
    var o;
    if ((o = r.tag !== 3) && !(o = r.tag !== 5) && (o = r.type, o = o !== "head" && o !== "body" && !rc(r.type, r.memoizedProps)), o && (o = _r)) {
      if (cc(r)) throw ng(), Error(n(418));
      for (; o; ) eg(r, o), o = Yn(o.nextSibling);
    }
    if (rg(r), r.tag === 13) {
      if (r = r.memoizedState, r = r !== null ? r.dehydrated : null, !r) throw Error(n(317));
      e: {
        for (r = r.nextSibling, o = 0; r; ) {
          if (r.nodeType === 8) {
            var l = r.data;
            if (l === "/$") {
              if (o === 0) {
                _r = Yn(r.nextSibling);
                break e;
              }
              o--;
            } else l !== "$" && l !== "$!" && l !== "$?" || o++;
          }
          r = r.nextSibling;
        }
        _r = null;
      }
    } else _r = yr ? Yn(r.stateNode.nextSibling) : null;
    return !0;
  }
  function ng() {
    for (var r = _r; r; ) r = Yn(r.nextSibling);
  }
  function di() {
    _r = yr = null, gt = !1;
  }
  function fc(r) {
    Fr === null ? Fr = [r] : Fr.push(r);
  }
  var b1 = S.ReactCurrentBatchConfig;
  function ul(r, o, l) {
    if (r = l.ref, r !== null && typeof r != "function" && typeof r != "object") {
      if (l._owner) {
        if (l = l._owner, l) {
          if (l.tag !== 1) throw Error(n(309));
          var u = l.stateNode;
        }
        if (!u) throw Error(n(147, r));
        var p = u, g = "" + r;
        return o !== null && o.ref !== null && typeof o.ref == "function" && o.ref._stringRef === g ? o.ref : (o = function(y) {
          var C = p.refs;
          y === null ? delete C[g] : C[g] = y;
        }, o._stringRef = g, o);
      }
      if (typeof r != "string") throw Error(n(284));
      if (!l._owner) throw Error(n(290, r));
    }
    return r;
  }
  function Ya(r, o) {
    throw r = Object.prototype.toString.call(o), Error(n(31, r === "[object Object]" ? "object with keys {" + Object.keys(o).join(", ") + "}" : r));
  }
  function og(r) {
    var o = r._init;
    return o(r._payload);
  }
  function ig(r) {
    function o(j, A) {
      if (r) {
        var W = j.deletions;
        W === null ? (j.deletions = [A], j.flags |= 16) : W.push(A);
      }
    }
    function l(j, A) {
      if (!r) return null;
      for (; A !== null; ) o(j, A), A = A.sibling;
      return null;
    }
    function u(j, A) {
      for (j = /* @__PURE__ */ new Map(); A !== null; ) A.key !== null ? j.set(A.key, A) : j.set(A.index, A), A = A.sibling;
      return j;
    }
    function p(j, A) {
      return j = oo(j, A), j.index = 0, j.sibling = null, j;
    }
    function g(j, A, W) {
      return j.index = W, r ? (W = j.alternate, W !== null ? (W = W.index, W < A ? (j.flags |= 2, A) : W) : (j.flags |= 2, A)) : (j.flags |= 1048576, A);
    }
    function y(j) {
      return r && j.alternate === null && (j.flags |= 2), j;
    }
    function C(j, A, W, se) {
      return A === null || A.tag !== 6 ? (A = nd(W, j.mode, se), A.return = j, A) : (A = p(A, W), A.return = j, A);
    }
    function O(j, A, W, se) {
      var ke = W.type;
      return ke === F ? ne(j, A, W.props.children, se, W.key) : A !== null && (A.elementType === ke || typeof ke == "object" && ke !== null && ke.$$typeof === ge && og(ke) === A.type) ? (se = p(A, W.props), se.ref = ul(j, A, W), se.return = j, se) : (se = vs(W.type, W.key, W.props, null, j.mode, se), se.ref = ul(j, A, W), se.return = j, se);
    }
    function H(j, A, W, se) {
      return A === null || A.tag !== 4 || A.stateNode.containerInfo !== W.containerInfo || A.stateNode.implementation !== W.implementation ? (A = od(W, j.mode, se), A.return = j, A) : (A = p(A, W.children || []), A.return = j, A);
    }
    function ne(j, A, W, se, ke) {
      return A === null || A.tag !== 7 ? (A = Bo(W, j.mode, se, ke), A.return = j, A) : (A = p(A, W), A.return = j, A);
    }
    function ie(j, A, W) {
      if (typeof A == "string" && A !== "" || typeof A == "number") return A = nd("" + A, j.mode, W), A.return = j, A;
      if (typeof A == "object" && A !== null) {
        switch (A.$$typeof) {
          case B:
            return W = vs(A.type, A.key, A.props, null, j.mode, W), W.ref = ul(j, null, A), W.return = j, W;
          case I:
            return A = od(A, j.mode, W), A.return = j, A;
          case ge:
            var se = A._init;
            return ie(j, se(A._payload), W);
        }
        if (k(A) || oe(A)) return A = Bo(A, j.mode, W, null), A.return = j, A;
        Ya(j, A);
      }
      return null;
    }
    function ee(j, A, W, se) {
      var ke = A !== null ? A.key : null;
      if (typeof W == "string" && W !== "" || typeof W == "number") return ke !== null ? null : C(j, A, "" + W, se);
      if (typeof W == "object" && W !== null) {
        switch (W.$$typeof) {
          case B:
            return W.key === ke ? O(j, A, W, se) : null;
          case I:
            return W.key === ke ? H(j, A, W, se) : null;
          case ge:
            return ke = W._init, ee(
              j,
              A,
              ke(W._payload),
              se
            );
        }
        if (k(W) || oe(W)) return ke !== null ? null : ne(j, A, W, se, null);
        Ya(j, W);
      }
      return null;
    }
    function pe(j, A, W, se, ke) {
      if (typeof se == "string" && se !== "" || typeof se == "number") return j = j.get(W) || null, C(A, j, "" + se, ke);
      if (typeof se == "object" && se !== null) {
        switch (se.$$typeof) {
          case B:
            return j = j.get(se.key === null ? W : se.key) || null, O(A, j, se, ke);
          case I:
            return j = j.get(se.key === null ? W : se.key) || null, H(A, j, se, ke);
          case ge:
            var $e = se._init;
            return pe(j, A, W, $e(se._payload), ke);
        }
        if (k(se) || oe(se)) return j = j.get(W) || null, ne(A, j, se, ke, null);
        Ya(A, se);
      }
      return null;
    }
    function ve(j, A, W, se) {
      for (var ke = null, $e = null, Ee = A, Le = A = 0, Rt = null; Ee !== null && Le < W.length; Le++) {
        Ee.index > Le ? (Rt = Ee, Ee = null) : Rt = Ee.sibling;
        var Xe = ee(j, Ee, W[Le], se);
        if (Xe === null) {
          Ee === null && (Ee = Rt);
          break;
        }
        r && Ee && Xe.alternate === null && o(j, Ee), A = g(Xe, A, Le), $e === null ? ke = Xe : $e.sibling = Xe, $e = Xe, Ee = Rt;
      }
      if (Le === W.length) return l(j, Ee), gt && To(j, Le), ke;
      if (Ee === null) {
        for (; Le < W.length; Le++) Ee = ie(j, W[Le], se), Ee !== null && (A = g(Ee, A, Le), $e === null ? ke = Ee : $e.sibling = Ee, $e = Ee);
        return gt && To(j, Le), ke;
      }
      for (Ee = u(j, Ee); Le < W.length; Le++) Rt = pe(Ee, j, Le, W[Le], se), Rt !== null && (r && Rt.alternate !== null && Ee.delete(Rt.key === null ? Le : Rt.key), A = g(Rt, A, Le), $e === null ? ke = Rt : $e.sibling = Rt, $e = Rt);
      return r && Ee.forEach(function(io) {
        return o(j, io);
      }), gt && To(j, Le), ke;
    }
    function _e(j, A, W, se) {
      var ke = oe(W);
      if (typeof ke != "function") throw Error(n(150));
      if (W = ke.call(W), W == null) throw Error(n(151));
      for (var $e = ke = null, Ee = A, Le = A = 0, Rt = null, Xe = W.next(); Ee !== null && !Xe.done; Le++, Xe = W.next()) {
        Ee.index > Le ? (Rt = Ee, Ee = null) : Rt = Ee.sibling;
        var io = ee(j, Ee, Xe.value, se);
        if (io === null) {
          Ee === null && (Ee = Rt);
          break;
        }
        r && Ee && io.alternate === null && o(j, Ee), A = g(io, A, Le), $e === null ? ke = io : $e.sibling = io, $e = io, Ee = Rt;
      }
      if (Xe.done) return l(
        j,
        Ee
      ), gt && To(j, Le), ke;
      if (Ee === null) {
        for (; !Xe.done; Le++, Xe = W.next()) Xe = ie(j, Xe.value, se), Xe !== null && (A = g(Xe, A, Le), $e === null ? ke = Xe : $e.sibling = Xe, $e = Xe);
        return gt && To(j, Le), ke;
      }
      for (Ee = u(j, Ee); !Xe.done; Le++, Xe = W.next()) Xe = pe(Ee, j, Le, Xe.value, se), Xe !== null && (r && Xe.alternate !== null && Ee.delete(Xe.key === null ? Le : Xe.key), A = g(Xe, A, Le), $e === null ? ke = Xe : $e.sibling = Xe, $e = Xe);
      return r && Ee.forEach(function(J1) {
        return o(j, J1);
      }), gt && To(j, Le), ke;
    }
    function kt(j, A, W, se) {
      if (typeof W == "object" && W !== null && W.type === F && W.key === null && (W = W.props.children), typeof W == "object" && W !== null) {
        switch (W.$$typeof) {
          case B:
            e: {
              for (var ke = W.key, $e = A; $e !== null; ) {
                if ($e.key === ke) {
                  if (ke = W.type, ke === F) {
                    if ($e.tag === 7) {
                      l(j, $e.sibling), A = p($e, W.props.children), A.return = j, j = A;
                      break e;
                    }
                  } else if ($e.elementType === ke || typeof ke == "object" && ke !== null && ke.$$typeof === ge && og(ke) === $e.type) {
                    l(j, $e.sibling), A = p($e, W.props), A.ref = ul(j, $e, W), A.return = j, j = A;
                    break e;
                  }
                  l(j, $e);
                  break;
                } else o(j, $e);
                $e = $e.sibling;
              }
              W.type === F ? (A = Bo(W.props.children, j.mode, se, W.key), A.return = j, j = A) : (se = vs(W.type, W.key, W.props, null, j.mode, se), se.ref = ul(j, A, W), se.return = j, j = se);
            }
            return y(j);
          case I:
            e: {
              for ($e = W.key; A !== null; ) {
                if (A.key === $e) if (A.tag === 4 && A.stateNode.containerInfo === W.containerInfo && A.stateNode.implementation === W.implementation) {
                  l(j, A.sibling), A = p(A, W.children || []), A.return = j, j = A;
                  break e;
                } else {
                  l(j, A);
                  break;
                }
                else o(j, A);
                A = A.sibling;
              }
              A = od(W, j.mode, se), A.return = j, j = A;
            }
            return y(j);
          case ge:
            return $e = W._init, kt(j, A, $e(W._payload), se);
        }
        if (k(W)) return ve(j, A, W, se);
        if (oe(W)) return _e(j, A, W, se);
        Ya(j, W);
      }
      return typeof W == "string" && W !== "" || typeof W == "number" ? (W = "" + W, A !== null && A.tag === 6 ? (l(j, A.sibling), A = p(A, W), A.return = j, j = A) : (l(j, A), A = nd(W, j.mode, se), A.return = j, j = A), y(j)) : l(j, A);
    }
    return kt;
  }
  var fi = ig(!0), lg = ig(!1), Ga = Gn(null), Xa = null, pi = null, pc = null;
  function gc() {
    pc = pi = Xa = null;
  }
  function hc(r) {
    var o = Ga.current;
    ct(Ga), r._currentValue = o;
  }
  function mc(r, o, l) {
    for (; r !== null; ) {
      var u = r.alternate;
      if ((r.childLanes & o) !== o ? (r.childLanes |= o, u !== null && (u.childLanes |= o)) : u !== null && (u.childLanes & o) !== o && (u.childLanes |= o), r === l) break;
      r = r.return;
    }
  }
  function gi(r, o) {
    Xa = r, pc = pi = null, r = r.dependencies, r !== null && r.firstContext !== null && ((r.lanes & o) !== 0 && (ur = !0), r.firstContext = null);
  }
  function Er(r) {
    var o = r._currentValue;
    if (pc !== r) if (r = { context: r, memoizedValue: o, next: null }, pi === null) {
      if (Xa === null) throw Error(n(308));
      pi = r, Xa.dependencies = { lanes: 0, firstContext: r };
    } else pi = pi.next = r;
    return o;
  }
  var Oo = null;
  function vc(r) {
    Oo === null ? Oo = [r] : Oo.push(r);
  }
  function ag(r, o, l, u) {
    var p = o.interleaved;
    return p === null ? (l.next = l, vc(o)) : (l.next = p.next, p.next = l), o.interleaved = l, wn(r, u);
  }
  function wn(r, o) {
    r.lanes |= o;
    var l = r.alternate;
    for (l !== null && (l.lanes |= o), l = r, r = r.return; r !== null; ) r.childLanes |= o, l = r.alternate, l !== null && (l.childLanes |= o), l = r, r = r.return;
    return l.tag === 3 ? l.stateNode : null;
  }
  var Jn = !1;
  function bc(r) {
    r.updateQueue = { baseState: r.memoizedState, firstBaseUpdate: null, lastBaseUpdate: null, shared: { pending: null, interleaved: null, lanes: 0 }, effects: null };
  }
  function sg(r, o) {
    r = r.updateQueue, o.updateQueue === r && (o.updateQueue = { baseState: r.baseState, firstBaseUpdate: r.firstBaseUpdate, lastBaseUpdate: r.lastBaseUpdate, shared: r.shared, effects: r.effects });
  }
  function Sn(r, o) {
    return { eventTime: r, lane: o, tag: 0, payload: null, callback: null, next: null };
  }
  function qn(r, o, l) {
    var u = r.updateQueue;
    if (u === null) return null;
    if (u = u.shared, (Ye & 2) !== 0) {
      var p = u.pending;
      return p === null ? o.next = o : (o.next = p.next, p.next = o), u.pending = o, wn(r, l);
    }
    return p = u.interleaved, p === null ? (o.next = o, vc(u)) : (o.next = p.next, p.next = o), u.interleaved = o, wn(r, l);
  }
  function Qa(r, o, l) {
    if (o = o.updateQueue, o !== null && (o = o.shared, (l & 4194240) !== 0)) {
      var u = o.lanes;
      u &= r.pendingLanes, l |= u, o.lanes = l, Nu(r, l);
    }
  }
  function ug(r, o) {
    var l = r.updateQueue, u = r.alternate;
    if (u !== null && (u = u.updateQueue, l === u)) {
      var p = null, g = null;
      if (l = l.firstBaseUpdate, l !== null) {
        do {
          var y = { eventTime: l.eventTime, lane: l.lane, tag: l.tag, payload: l.payload, callback: l.callback, next: null };
          g === null ? p = g = y : g = g.next = y, l = l.next;
        } while (l !== null);
        g === null ? p = g = o : g = g.next = o;
      } else p = g = o;
      l = { baseState: u.baseState, firstBaseUpdate: p, lastBaseUpdate: g, shared: u.shared, effects: u.effects }, r.updateQueue = l;
      return;
    }
    r = l.lastBaseUpdate, r === null ? l.firstBaseUpdate = o : r.next = o, l.lastBaseUpdate = o;
  }
  function Ja(r, o, l, u) {
    var p = r.updateQueue;
    Jn = !1;
    var g = p.firstBaseUpdate, y = p.lastBaseUpdate, C = p.shared.pending;
    if (C !== null) {
      p.shared.pending = null;
      var O = C, H = O.next;
      O.next = null, y === null ? g = H : y.next = H, y = O;
      var ne = r.alternate;
      ne !== null && (ne = ne.updateQueue, C = ne.lastBaseUpdate, C !== y && (C === null ? ne.firstBaseUpdate = H : C.next = H, ne.lastBaseUpdate = O));
    }
    if (g !== null) {
      var ie = p.baseState;
      y = 0, ne = H = O = null, C = g;
      do {
        var ee = C.lane, pe = C.eventTime;
        if ((u & ee) === ee) {
          ne !== null && (ne = ne.next = {
            eventTime: pe,
            lane: 0,
            tag: C.tag,
            payload: C.payload,
            callback: C.callback,
            next: null
          });
          e: {
            var ve = r, _e = C;
            switch (ee = o, pe = l, _e.tag) {
              case 1:
                if (ve = _e.payload, typeof ve == "function") {
                  ie = ve.call(pe, ie, ee);
                  break e;
                }
                ie = ve;
                break e;
              case 3:
                ve.flags = ve.flags & -65537 | 128;
              case 0:
                if (ve = _e.payload, ee = typeof ve == "function" ? ve.call(pe, ie, ee) : ve, ee == null) break e;
                ie = q({}, ie, ee);
                break e;
              case 2:
                Jn = !0;
            }
          }
          C.callback !== null && C.lane !== 0 && (r.flags |= 64, ee = p.effects, ee === null ? p.effects = [C] : ee.push(C));
        } else pe = { eventTime: pe, lane: ee, tag: C.tag, payload: C.payload, callback: C.callback, next: null }, ne === null ? (H = ne = pe, O = ie) : ne = ne.next = pe, y |= ee;
        if (C = C.next, C === null) {
          if (C = p.shared.pending, C === null) break;
          ee = C, C = ee.next, ee.next = null, p.lastBaseUpdate = ee, p.shared.pending = null;
        }
      } while (!0);
      if (ne === null && (O = ie), p.baseState = O, p.firstBaseUpdate = H, p.lastBaseUpdate = ne, o = p.shared.interleaved, o !== null) {
        p = o;
        do
          y |= p.lane, p = p.next;
        while (p !== o);
      } else g === null && (p.shared.lanes = 0);
      No |= y, r.lanes = y, r.memoizedState = ie;
    }
  }
  function cg(r, o, l) {
    if (r = o.effects, o.effects = null, r !== null) for (o = 0; o < r.length; o++) {
      var u = r[o], p = u.callback;
      if (p !== null) {
        if (u.callback = null, u = l, typeof p != "function") throw Error(n(191, p));
        p.call(u);
      }
    }
  }
  var cl = {}, tn = Gn(cl), dl = Gn(cl), fl = Gn(cl);
  function Lo(r) {
    if (r === cl) throw Error(n(174));
    return r;
  }
  function yc(r, o) {
    switch (lt(fl, o), lt(dl, r), lt(tn, cl), r = o.nodeType, r) {
      case 9:
      case 11:
        o = (o = o.documentElement) ? o.namespaceURI : Q(null, "");
        break;
      default:
        r = r === 8 ? o.parentNode : o, o = r.namespaceURI || null, r = r.tagName, o = Q(o, r);
    }
    ct(tn), lt(tn, o);
  }
  function hi() {
    ct(tn), ct(dl), ct(fl);
  }
  function dg(r) {
    Lo(fl.current);
    var o = Lo(tn.current), l = Q(o, r.type);
    o !== l && (lt(dl, r), lt(tn, l));
  }
  function _c(r) {
    dl.current === r && (ct(tn), ct(dl));
  }
  var mt = Gn(0);
  function qa(r) {
    for (var o = r; o !== null; ) {
      if (o.tag === 13) {
        var l = o.memoizedState;
        if (l !== null && (l = l.dehydrated, l === null || l.data === "$?" || l.data === "$!")) return o;
      } else if (o.tag === 19 && o.memoizedProps.revealOrder !== void 0) {
        if ((o.flags & 128) !== 0) return o;
      } else if (o.child !== null) {
        o.child.return = o, o = o.child;
        continue;
      }
      if (o === r) break;
      for (; o.sibling === null; ) {
        if (o.return === null || o.return === r) return null;
        o = o.return;
      }
      o.sibling.return = o.return, o = o.sibling;
    }
    return null;
  }
  var kc = [];
  function wc() {
    for (var r = 0; r < kc.length; r++) kc[r]._workInProgressVersionPrimary = null;
    kc.length = 0;
  }
  var Za = S.ReactCurrentDispatcher, Sc = S.ReactCurrentBatchConfig, Po = 0, vt = null, Et = null, Pt = null, es = !1, pl = !1, gl = 0, y1 = 0;
  function Vt() {
    throw Error(n(321));
  }
  function Cc(r, o) {
    if (o === null) return !1;
    for (var l = 0; l < o.length && l < r.length; l++) if (!jr(r[l], o[l])) return !1;
    return !0;
  }
  function xc(r, o, l, u, p, g) {
    if (Po = g, vt = o, o.memoizedState = null, o.updateQueue = null, o.lanes = 0, Za.current = r === null || r.memoizedState === null ? S1 : C1, r = l(u, p), pl) {
      g = 0;
      do {
        if (pl = !1, gl = 0, 25 <= g) throw Error(n(301));
        g += 1, Pt = Et = null, o.updateQueue = null, Za.current = x1, r = l(u, p);
      } while (pl);
    }
    if (Za.current = ns, o = Et !== null && Et.next !== null, Po = 0, Pt = Et = vt = null, es = !1, o) throw Error(n(300));
    return r;
  }
  function $c() {
    var r = gl !== 0;
    return gl = 0, r;
  }
  function rn() {
    var r = { memoizedState: null, baseState: null, baseQueue: null, queue: null, next: null };
    return Pt === null ? vt.memoizedState = Pt = r : Pt = Pt.next = r, Pt;
  }
  function Tr() {
    if (Et === null) {
      var r = vt.alternate;
      r = r !== null ? r.memoizedState : null;
    } else r = Et.next;
    var o = Pt === null ? vt.memoizedState : Pt.next;
    if (o !== null) Pt = o, Et = r;
    else {
      if (r === null) throw Error(n(310));
      Et = r, r = { memoizedState: Et.memoizedState, baseState: Et.baseState, baseQueue: Et.baseQueue, queue: Et.queue, next: null }, Pt === null ? vt.memoizedState = Pt = r : Pt = Pt.next = r;
    }
    return Pt;
  }
  function hl(r, o) {
    return typeof o == "function" ? o(r) : o;
  }
  function Ec(r) {
    var o = Tr(), l = o.queue;
    if (l === null) throw Error(n(311));
    l.lastRenderedReducer = r;
    var u = Et, p = u.baseQueue, g = l.pending;
    if (g !== null) {
      if (p !== null) {
        var y = p.next;
        p.next = g.next, g.next = y;
      }
      u.baseQueue = p = g, l.pending = null;
    }
    if (p !== null) {
      g = p.next, u = u.baseState;
      var C = y = null, O = null, H = g;
      do {
        var ne = H.lane;
        if ((Po & ne) === ne) O !== null && (O = O.next = { lane: 0, action: H.action, hasEagerState: H.hasEagerState, eagerState: H.eagerState, next: null }), u = H.hasEagerState ? H.eagerState : r(u, H.action);
        else {
          var ie = {
            lane: ne,
            action: H.action,
            hasEagerState: H.hasEagerState,
            eagerState: H.eagerState,
            next: null
          };
          O === null ? (C = O = ie, y = u) : O = O.next = ie, vt.lanes |= ne, No |= ne;
        }
        H = H.next;
      } while (H !== null && H !== g);
      O === null ? y = u : O.next = C, jr(u, o.memoizedState) || (ur = !0), o.memoizedState = u, o.baseState = y, o.baseQueue = O, l.lastRenderedState = u;
    }
    if (r = l.interleaved, r !== null) {
      p = r;
      do
        g = p.lane, vt.lanes |= g, No |= g, p = p.next;
      while (p !== r);
    } else p === null && (l.lanes = 0);
    return [o.memoizedState, l.dispatch];
  }
  function Tc(r) {
    var o = Tr(), l = o.queue;
    if (l === null) throw Error(n(311));
    l.lastRenderedReducer = r;
    var u = l.dispatch, p = l.pending, g = o.memoizedState;
    if (p !== null) {
      l.pending = null;
      var y = p = p.next;
      do
        g = r(g, y.action), y = y.next;
      while (y !== p);
      jr(g, o.memoizedState) || (ur = !0), o.memoizedState = g, o.baseQueue === null && (o.baseState = g), l.lastRenderedState = g;
    }
    return [g, u];
  }
  function fg() {
  }
  function pg(r, o) {
    var l = vt, u = Tr(), p = o(), g = !jr(u.memoizedState, p);
    if (g && (u.memoizedState = p, ur = !0), u = u.queue, Oc(mg.bind(null, l, u, r), [r]), u.getSnapshot !== o || g || Pt !== null && Pt.memoizedState.tag & 1) {
      if (l.flags |= 2048, ml(9, hg.bind(null, l, u, p, o), void 0, null), Nt === null) throw Error(n(349));
      (Po & 30) !== 0 || gg(l, o, p);
    }
    return p;
  }
  function gg(r, o, l) {
    r.flags |= 16384, r = { getSnapshot: o, value: l }, o = vt.updateQueue, o === null ? (o = { lastEffect: null, stores: null }, vt.updateQueue = o, o.stores = [r]) : (l = o.stores, l === null ? o.stores = [r] : l.push(r));
  }
  function hg(r, o, l, u) {
    o.value = l, o.getSnapshot = u, vg(o) && bg(r);
  }
  function mg(r, o, l) {
    return l(function() {
      vg(o) && bg(r);
    });
  }
  function vg(r) {
    var o = r.getSnapshot;
    r = r.value;
    try {
      var l = o();
      return !jr(r, l);
    } catch {
      return !0;
    }
  }
  function bg(r) {
    var o = wn(r, 1);
    o !== null && Vr(o, r, 1, -1);
  }
  function yg(r) {
    var o = rn();
    return typeof r == "function" && (r = r()), o.memoizedState = o.baseState = r, r = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: hl, lastRenderedState: r }, o.queue = r, r = r.dispatch = w1.bind(null, vt, r), [o.memoizedState, r];
  }
  function ml(r, o, l, u) {
    return r = { tag: r, create: o, destroy: l, deps: u, next: null }, o = vt.updateQueue, o === null ? (o = { lastEffect: null, stores: null }, vt.updateQueue = o, o.lastEffect = r.next = r) : (l = o.lastEffect, l === null ? o.lastEffect = r.next = r : (u = l.next, l.next = r, r.next = u, o.lastEffect = r)), r;
  }
  function _g() {
    return Tr().memoizedState;
  }
  function ts(r, o, l, u) {
    var p = rn();
    vt.flags |= r, p.memoizedState = ml(1 | o, l, void 0, u === void 0 ? null : u);
  }
  function rs(r, o, l, u) {
    var p = Tr();
    u = u === void 0 ? null : u;
    var g = void 0;
    if (Et !== null) {
      var y = Et.memoizedState;
      if (g = y.destroy, u !== null && Cc(u, y.deps)) {
        p.memoizedState = ml(o, l, g, u);
        return;
      }
    }
    vt.flags |= r, p.memoizedState = ml(1 | o, l, g, u);
  }
  function kg(r, o) {
    return ts(8390656, 8, r, o);
  }
  function Oc(r, o) {
    return rs(2048, 8, r, o);
  }
  function wg(r, o) {
    return rs(4, 2, r, o);
  }
  function Sg(r, o) {
    return rs(4, 4, r, o);
  }
  function Cg(r, o) {
    if (typeof o == "function") return r = r(), o(r), function() {
      o(null);
    };
    if (o != null) return r = r(), o.current = r, function() {
      o.current = null;
    };
  }
  function xg(r, o, l) {
    return l = l != null ? l.concat([r]) : null, rs(4, 4, Cg.bind(null, o, r), l);
  }
  function Lc() {
  }
  function $g(r, o) {
    var l = Tr();
    o = o === void 0 ? null : o;
    var u = l.memoizedState;
    return u !== null && o !== null && Cc(o, u[1]) ? u[0] : (l.memoizedState = [r, o], r);
  }
  function Eg(r, o) {
    var l = Tr();
    o = o === void 0 ? null : o;
    var u = l.memoizedState;
    return u !== null && o !== null && Cc(o, u[1]) ? u[0] : (r = r(), l.memoizedState = [r, o], r);
  }
  function Tg(r, o, l) {
    return (Po & 21) === 0 ? (r.baseState && (r.baseState = !1, ur = !0), r.memoizedState = l) : (jr(l, o) || (l = op(), vt.lanes |= l, No |= l, r.baseState = !0), o);
  }
  function _1(r, o) {
    var l = et;
    et = l !== 0 && 4 > l ? l : 4, r(!0);
    var u = Sc.transition;
    Sc.transition = {};
    try {
      r(!1), o();
    } finally {
      et = l, Sc.transition = u;
    }
  }
  function Og() {
    return Tr().memoizedState;
  }
  function k1(r, o, l) {
    var u = ro(r);
    if (l = { lane: u, action: l, hasEagerState: !1, eagerState: null, next: null }, Lg(r)) Pg(o, l);
    else if (l = ag(r, o, l, u), l !== null) {
      var p = er();
      Vr(l, r, u, p), Ng(l, o, u);
    }
  }
  function w1(r, o, l) {
    var u = ro(r), p = { lane: u, action: l, hasEagerState: !1, eagerState: null, next: null };
    if (Lg(r)) Pg(o, p);
    else {
      var g = r.alternate;
      if (r.lanes === 0 && (g === null || g.lanes === 0) && (g = o.lastRenderedReducer, g !== null)) try {
        var y = o.lastRenderedState, C = g(y, l);
        if (p.hasEagerState = !0, p.eagerState = C, jr(C, y)) {
          var O = o.interleaved;
          O === null ? (p.next = p, vc(o)) : (p.next = O.next, O.next = p), o.interleaved = p;
          return;
        }
      } catch {
      } finally {
      }
      l = ag(r, o, p, u), l !== null && (p = er(), Vr(l, r, u, p), Ng(l, o, u));
    }
  }
  function Lg(r) {
    var o = r.alternate;
    return r === vt || o !== null && o === vt;
  }
  function Pg(r, o) {
    pl = es = !0;
    var l = r.pending;
    l === null ? o.next = o : (o.next = l.next, l.next = o), r.pending = o;
  }
  function Ng(r, o, l) {
    if ((l & 4194240) !== 0) {
      var u = o.lanes;
      u &= r.pendingLanes, l |= u, o.lanes = l, Nu(r, l);
    }
  }
  var ns = { readContext: Er, useCallback: Vt, useContext: Vt, useEffect: Vt, useImperativeHandle: Vt, useInsertionEffect: Vt, useLayoutEffect: Vt, useMemo: Vt, useReducer: Vt, useRef: Vt, useState: Vt, useDebugValue: Vt, useDeferredValue: Vt, useTransition: Vt, useMutableSource: Vt, useSyncExternalStore: Vt, useId: Vt, unstable_isNewReconciler: !1 }, S1 = { readContext: Er, useCallback: function(r, o) {
    return rn().memoizedState = [r, o === void 0 ? null : o], r;
  }, useContext: Er, useEffect: kg, useImperativeHandle: function(r, o, l) {
    return l = l != null ? l.concat([r]) : null, ts(
      4194308,
      4,
      Cg.bind(null, o, r),
      l
    );
  }, useLayoutEffect: function(r, o) {
    return ts(4194308, 4, r, o);
  }, useInsertionEffect: function(r, o) {
    return ts(4, 2, r, o);
  }, useMemo: function(r, o) {
    var l = rn();
    return o = o === void 0 ? null : o, r = r(), l.memoizedState = [r, o], r;
  }, useReducer: function(r, o, l) {
    var u = rn();
    return o = l !== void 0 ? l(o) : o, u.memoizedState = u.baseState = o, r = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: r, lastRenderedState: o }, u.queue = r, r = r.dispatch = k1.bind(null, vt, r), [u.memoizedState, r];
  }, useRef: function(r) {
    var o = rn();
    return r = { current: r }, o.memoizedState = r;
  }, useState: yg, useDebugValue: Lc, useDeferredValue: function(r) {
    return rn().memoizedState = r;
  }, useTransition: function() {
    var r = yg(!1), o = r[0];
    return r = _1.bind(null, r[1]), rn().memoizedState = r, [o, r];
  }, useMutableSource: function() {
  }, useSyncExternalStore: function(r, o, l) {
    var u = vt, p = rn();
    if (gt) {
      if (l === void 0) throw Error(n(407));
      l = l();
    } else {
      if (l = o(), Nt === null) throw Error(n(349));
      (Po & 30) !== 0 || gg(u, o, l);
    }
    p.memoizedState = l;
    var g = { value: l, getSnapshot: o };
    return p.queue = g, kg(mg.bind(
      null,
      u,
      g,
      r
    ), [r]), u.flags |= 2048, ml(9, hg.bind(null, u, g, l, o), void 0, null), l;
  }, useId: function() {
    var r = rn(), o = Nt.identifierPrefix;
    if (gt) {
      var l = kn, u = _n;
      l = (u & ~(1 << 32 - Mr(u) - 1)).toString(32) + l, o = ":" + o + "R" + l, l = gl++, 0 < l && (o += "H" + l.toString(32)), o += ":";
    } else l = y1++, o = ":" + o + "r" + l.toString(32) + ":";
    return r.memoizedState = o;
  }, unstable_isNewReconciler: !1 }, C1 = {
    readContext: Er,
    useCallback: $g,
    useContext: Er,
    useEffect: Oc,
    useImperativeHandle: xg,
    useInsertionEffect: wg,
    useLayoutEffect: Sg,
    useMemo: Eg,
    useReducer: Ec,
    useRef: _g,
    useState: function() {
      return Ec(hl);
    },
    useDebugValue: Lc,
    useDeferredValue: function(r) {
      var o = Tr();
      return Tg(o, Et.memoizedState, r);
    },
    useTransition: function() {
      var r = Ec(hl)[0], o = Tr().memoizedState;
      return [r, o];
    },
    useMutableSource: fg,
    useSyncExternalStore: pg,
    useId: Og,
    unstable_isNewReconciler: !1
  }, x1 = { readContext: Er, useCallback: $g, useContext: Er, useEffect: Oc, useImperativeHandle: xg, useInsertionEffect: wg, useLayoutEffect: Sg, useMemo: Eg, useReducer: Tc, useRef: _g, useState: function() {
    return Tc(hl);
  }, useDebugValue: Lc, useDeferredValue: function(r) {
    var o = Tr();
    return Et === null ? o.memoizedState = r : Tg(o, Et.memoizedState, r);
  }, useTransition: function() {
    var r = Tc(hl)[0], o = Tr().memoizedState;
    return [r, o];
  }, useMutableSource: fg, useSyncExternalStore: pg, useId: Og, unstable_isNewReconciler: !1 };
  function zr(r, o) {
    if (r && r.defaultProps) {
      o = q({}, o), r = r.defaultProps;
      for (var l in r) o[l] === void 0 && (o[l] = r[l]);
      return o;
    }
    return o;
  }
  function Pc(r, o, l, u) {
    o = r.memoizedState, l = l(u, o), l = l == null ? o : q({}, o, l), r.memoizedState = l, r.lanes === 0 && (r.updateQueue.baseState = l);
  }
  var os = { isMounted: function(r) {
    return (r = r._reactInternals) ? Co(r) === r : !1;
  }, enqueueSetState: function(r, o, l) {
    r = r._reactInternals;
    var u = er(), p = ro(r), g = Sn(u, p);
    g.payload = o, l != null && (g.callback = l), o = qn(r, g, p), o !== null && (Vr(o, r, p, u), Qa(o, r, p));
  }, enqueueReplaceState: function(r, o, l) {
    r = r._reactInternals;
    var u = er(), p = ro(r), g = Sn(u, p);
    g.tag = 1, g.payload = o, l != null && (g.callback = l), o = qn(r, g, p), o !== null && (Vr(o, r, p, u), Qa(o, r, p));
  }, enqueueForceUpdate: function(r, o) {
    r = r._reactInternals;
    var l = er(), u = ro(r), p = Sn(l, u);
    p.tag = 2, o != null && (p.callback = o), o = qn(r, p, u), o !== null && (Vr(o, r, u, l), Qa(o, r, u));
  } };
  function Rg(r, o, l, u, p, g, y) {
    return r = r.stateNode, typeof r.shouldComponentUpdate == "function" ? r.shouldComponentUpdate(u, g, y) : o.prototype && o.prototype.isPureReactComponent ? !rl(l, u) || !rl(p, g) : !0;
  }
  function Ig(r, o, l) {
    var u = !1, p = Xn, g = o.contextType;
    return typeof g == "object" && g !== null ? g = Er(g) : (p = sr(o) ? $o : Wt.current, u = o.contextTypes, g = (u = u != null) ? si(r, p) : Xn), o = new o(l, g), r.memoizedState = o.state !== null && o.state !== void 0 ? o.state : null, o.updater = os, r.stateNode = o, o._reactInternals = r, u && (r = r.stateNode, r.__reactInternalMemoizedUnmaskedChildContext = p, r.__reactInternalMemoizedMaskedChildContext = g), o;
  }
  function Ag(r, o, l, u) {
    r = o.state, typeof o.componentWillReceiveProps == "function" && o.componentWillReceiveProps(l, u), typeof o.UNSAFE_componentWillReceiveProps == "function" && o.UNSAFE_componentWillReceiveProps(l, u), o.state !== r && os.enqueueReplaceState(o, o.state, null);
  }
  function Nc(r, o, l, u) {
    var p = r.stateNode;
    p.props = l, p.state = r.memoizedState, p.refs = {}, bc(r);
    var g = o.contextType;
    typeof g == "object" && g !== null ? p.context = Er(g) : (g = sr(o) ? $o : Wt.current, p.context = si(r, g)), p.state = r.memoizedState, g = o.getDerivedStateFromProps, typeof g == "function" && (Pc(r, o, g, l), p.state = r.memoizedState), typeof o.getDerivedStateFromProps == "function" || typeof p.getSnapshotBeforeUpdate == "function" || typeof p.UNSAFE_componentWillMount != "function" && typeof p.componentWillMount != "function" || (o = p.state, typeof p.componentWillMount == "function" && p.componentWillMount(), typeof p.UNSAFE_componentWillMount == "function" && p.UNSAFE_componentWillMount(), o !== p.state && os.enqueueReplaceState(p, p.state, null), Ja(r, l, p, u), p.state = r.memoizedState), typeof p.componentDidMount == "function" && (r.flags |= 4194308);
  }
  function mi(r, o) {
    try {
      var l = "", u = o;
      do
        l += Ae(u), u = u.return;
      while (u);
      var p = l;
    } catch (g) {
      p = `
Error generating stack: ` + g.message + `
` + g.stack;
    }
    return { value: r, source: o, stack: p, digest: null };
  }
  function Rc(r, o, l) {
    return { value: r, source: null, stack: l ?? null, digest: o ?? null };
  }
  function Ic(r, o) {
    try {
      console.error(o.value);
    } catch (l) {
      setTimeout(function() {
        throw l;
      });
    }
  }
  var $1 = typeof WeakMap == "function" ? WeakMap : Map;
  function Bg(r, o, l) {
    l = Sn(-1, l), l.tag = 3, l.payload = { element: null };
    var u = o.value;
    return l.callback = function() {
      ds || (ds = !0, Xc = u), Ic(r, o);
    }, l;
  }
  function Dg(r, o, l) {
    l = Sn(-1, l), l.tag = 3;
    var u = r.type.getDerivedStateFromError;
    if (typeof u == "function") {
      var p = o.value;
      l.payload = function() {
        return u(p);
      }, l.callback = function() {
        Ic(r, o);
      };
    }
    var g = r.stateNode;
    return g !== null && typeof g.componentDidCatch == "function" && (l.callback = function() {
      Ic(r, o), typeof u != "function" && (eo === null ? eo = /* @__PURE__ */ new Set([this]) : eo.add(this));
      var y = o.stack;
      this.componentDidCatch(o.value, { componentStack: y !== null ? y : "" });
    }), l;
  }
  function Mg(r, o, l) {
    var u = r.pingCache;
    if (u === null) {
      u = r.pingCache = new $1();
      var p = /* @__PURE__ */ new Set();
      u.set(o, p);
    } else p = u.get(o), p === void 0 && (p = /* @__PURE__ */ new Set(), u.set(o, p));
    p.has(l) || (p.add(l), r = F1.bind(null, r, o, l), o.then(r, r));
  }
  function jg(r) {
    do {
      var o;
      if ((o = r.tag === 13) && (o = r.memoizedState, o = o !== null ? o.dehydrated !== null : !0), o) return r;
      r = r.return;
    } while (r !== null);
    return null;
  }
  function Fg(r, o, l, u, p) {
    return (r.mode & 1) === 0 ? (r === o ? r.flags |= 65536 : (r.flags |= 128, l.flags |= 131072, l.flags &= -52805, l.tag === 1 && (l.alternate === null ? l.tag = 17 : (o = Sn(-1, 1), o.tag = 2, qn(l, o, 1))), l.lanes |= 1), r) : (r.flags |= 65536, r.lanes = p, r);
  }
  var E1 = S.ReactCurrentOwner, ur = !1;
  function Zt(r, o, l, u) {
    o.child = r === null ? lg(o, null, l, u) : fi(o, r.child, l, u);
  }
  function zg(r, o, l, u, p) {
    l = l.render;
    var g = o.ref;
    return gi(o, p), u = xc(r, o, l, u, g, p), l = $c(), r !== null && !ur ? (o.updateQueue = r.updateQueue, o.flags &= -2053, r.lanes &= ~p, Cn(r, o, p)) : (gt && l && sc(o), o.flags |= 1, Zt(r, o, u, p), o.child);
  }
  function Ug(r, o, l, u, p) {
    if (r === null) {
      var g = l.type;
      return typeof g == "function" && !rd(g) && g.defaultProps === void 0 && l.compare === null && l.defaultProps === void 0 ? (o.tag = 15, o.type = g, Wg(r, o, g, u, p)) : (r = vs(l.type, null, u, o, o.mode, p), r.ref = o.ref, r.return = o, o.child = r);
    }
    if (g = r.child, (r.lanes & p) === 0) {
      var y = g.memoizedProps;
      if (l = l.compare, l = l !== null ? l : rl, l(y, u) && r.ref === o.ref) return Cn(r, o, p);
    }
    return o.flags |= 1, r = oo(g, u), r.ref = o.ref, r.return = o, o.child = r;
  }
  function Wg(r, o, l, u, p) {
    if (r !== null) {
      var g = r.memoizedProps;
      if (rl(g, u) && r.ref === o.ref) if (ur = !1, o.pendingProps = u = g, (r.lanes & p) !== 0) (r.flags & 131072) !== 0 && (ur = !0);
      else return o.lanes = r.lanes, Cn(r, o, p);
    }
    return Ac(r, o, l, u, p);
  }
  function Vg(r, o, l) {
    var u = o.pendingProps, p = u.children, g = r !== null ? r.memoizedState : null;
    if (u.mode === "hidden") if ((o.mode & 1) === 0) o.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, lt(bi, kr), kr |= l;
    else {
      if ((l & 1073741824) === 0) return r = g !== null ? g.baseLanes | l : l, o.lanes = o.childLanes = 1073741824, o.memoizedState = { baseLanes: r, cachePool: null, transitions: null }, o.updateQueue = null, lt(bi, kr), kr |= r, null;
      o.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, u = g !== null ? g.baseLanes : l, lt(bi, kr), kr |= u;
    }
    else g !== null ? (u = g.baseLanes | l, o.memoizedState = null) : u = l, lt(bi, kr), kr |= u;
    return Zt(r, o, p, l), o.child;
  }
  function Hg(r, o) {
    var l = o.ref;
    (r === null && l !== null || r !== null && r.ref !== l) && (o.flags |= 512, o.flags |= 2097152);
  }
  function Ac(r, o, l, u, p) {
    var g = sr(l) ? $o : Wt.current;
    return g = si(o, g), gi(o, p), l = xc(r, o, l, u, g, p), u = $c(), r !== null && !ur ? (o.updateQueue = r.updateQueue, o.flags &= -2053, r.lanes &= ~p, Cn(r, o, p)) : (gt && u && sc(o), o.flags |= 1, Zt(r, o, l, p), o.child);
  }
  function Kg(r, o, l, u, p) {
    if (sr(l)) {
      var g = !0;
      Ua(o);
    } else g = !1;
    if (gi(o, p), o.stateNode === null) ls(r, o), Ig(o, l, u), Nc(o, l, u, p), u = !0;
    else if (r === null) {
      var y = o.stateNode, C = o.memoizedProps;
      y.props = C;
      var O = y.context, H = l.contextType;
      typeof H == "object" && H !== null ? H = Er(H) : (H = sr(l) ? $o : Wt.current, H = si(o, H));
      var ne = l.getDerivedStateFromProps, ie = typeof ne == "function" || typeof y.getSnapshotBeforeUpdate == "function";
      ie || typeof y.UNSAFE_componentWillReceiveProps != "function" && typeof y.componentWillReceiveProps != "function" || (C !== u || O !== H) && Ag(o, y, u, H), Jn = !1;
      var ee = o.memoizedState;
      y.state = ee, Ja(o, u, y, p), O = o.memoizedState, C !== u || ee !== O || ar.current || Jn ? (typeof ne == "function" && (Pc(o, l, ne, u), O = o.memoizedState), (C = Jn || Rg(o, l, C, u, ee, O, H)) ? (ie || typeof y.UNSAFE_componentWillMount != "function" && typeof y.componentWillMount != "function" || (typeof y.componentWillMount == "function" && y.componentWillMount(), typeof y.UNSAFE_componentWillMount == "function" && y.UNSAFE_componentWillMount()), typeof y.componentDidMount == "function" && (o.flags |= 4194308)) : (typeof y.componentDidMount == "function" && (o.flags |= 4194308), o.memoizedProps = u, o.memoizedState = O), y.props = u, y.state = O, y.context = H, u = C) : (typeof y.componentDidMount == "function" && (o.flags |= 4194308), u = !1);
    } else {
      y = o.stateNode, sg(r, o), C = o.memoizedProps, H = o.type === o.elementType ? C : zr(o.type, C), y.props = H, ie = o.pendingProps, ee = y.context, O = l.contextType, typeof O == "object" && O !== null ? O = Er(O) : (O = sr(l) ? $o : Wt.current, O = si(o, O));
      var pe = l.getDerivedStateFromProps;
      (ne = typeof pe == "function" || typeof y.getSnapshotBeforeUpdate == "function") || typeof y.UNSAFE_componentWillReceiveProps != "function" && typeof y.componentWillReceiveProps != "function" || (C !== ie || ee !== O) && Ag(o, y, u, O), Jn = !1, ee = o.memoizedState, y.state = ee, Ja(o, u, y, p);
      var ve = o.memoizedState;
      C !== ie || ee !== ve || ar.current || Jn ? (typeof pe == "function" && (Pc(o, l, pe, u), ve = o.memoizedState), (H = Jn || Rg(o, l, H, u, ee, ve, O) || !1) ? (ne || typeof y.UNSAFE_componentWillUpdate != "function" && typeof y.componentWillUpdate != "function" || (typeof y.componentWillUpdate == "function" && y.componentWillUpdate(u, ve, O), typeof y.UNSAFE_componentWillUpdate == "function" && y.UNSAFE_componentWillUpdate(u, ve, O)), typeof y.componentDidUpdate == "function" && (o.flags |= 4), typeof y.getSnapshotBeforeUpdate == "function" && (o.flags |= 1024)) : (typeof y.componentDidUpdate != "function" || C === r.memoizedProps && ee === r.memoizedState || (o.flags |= 4), typeof y.getSnapshotBeforeUpdate != "function" || C === r.memoizedProps && ee === r.memoizedState || (o.flags |= 1024), o.memoizedProps = u, o.memoizedState = ve), y.props = u, y.state = ve, y.context = O, u = H) : (typeof y.componentDidUpdate != "function" || C === r.memoizedProps && ee === r.memoizedState || (o.flags |= 4), typeof y.getSnapshotBeforeUpdate != "function" || C === r.memoizedProps && ee === r.memoizedState || (o.flags |= 1024), u = !1);
    }
    return Bc(r, o, l, u, g, p);
  }
  function Bc(r, o, l, u, p, g) {
    Hg(r, o);
    var y = (o.flags & 128) !== 0;
    if (!u && !y) return p && Jp(o, l, !1), Cn(r, o, g);
    u = o.stateNode, E1.current = o;
    var C = y && typeof l.getDerivedStateFromError != "function" ? null : u.render();
    return o.flags |= 1, r !== null && y ? (o.child = fi(o, r.child, null, g), o.child = fi(o, null, C, g)) : Zt(r, o, C, g), o.memoizedState = u.state, p && Jp(o, l, !0), o.child;
  }
  function Yg(r) {
    var o = r.stateNode;
    o.pendingContext ? Xp(r, o.pendingContext, o.pendingContext !== o.context) : o.context && Xp(r, o.context, !1), yc(r, o.containerInfo);
  }
  function Gg(r, o, l, u, p) {
    return di(), fc(p), o.flags |= 256, Zt(r, o, l, u), o.child;
  }
  var Dc = { dehydrated: null, treeContext: null, retryLane: 0 };
  function Mc(r) {
    return { baseLanes: r, cachePool: null, transitions: null };
  }
  function Xg(r, o, l) {
    var u = o.pendingProps, p = mt.current, g = !1, y = (o.flags & 128) !== 0, C;
    if ((C = y) || (C = r !== null && r.memoizedState === null ? !1 : (p & 2) !== 0), C ? (g = !0, o.flags &= -129) : (r === null || r.memoizedState !== null) && (p |= 1), lt(mt, p & 1), r === null)
      return dc(o), r = o.memoizedState, r !== null && (r = r.dehydrated, r !== null) ? ((o.mode & 1) === 0 ? o.lanes = 1 : r.data === "$!" ? o.lanes = 8 : o.lanes = 1073741824, null) : (y = u.children, r = u.fallback, g ? (u = o.mode, g = o.child, y = { mode: "hidden", children: y }, (u & 1) === 0 && g !== null ? (g.childLanes = 0, g.pendingProps = y) : g = bs(y, u, 0, null), r = Bo(r, u, l, null), g.return = o, r.return = o, g.sibling = r, o.child = g, o.child.memoizedState = Mc(l), o.memoizedState = Dc, r) : jc(o, y));
    if (p = r.memoizedState, p !== null && (C = p.dehydrated, C !== null)) return T1(r, o, y, u, C, p, l);
    if (g) {
      g = u.fallback, y = o.mode, p = r.child, C = p.sibling;
      var O = { mode: "hidden", children: u.children };
      return (y & 1) === 0 && o.child !== p ? (u = o.child, u.childLanes = 0, u.pendingProps = O, o.deletions = null) : (u = oo(p, O), u.subtreeFlags = p.subtreeFlags & 14680064), C !== null ? g = oo(C, g) : (g = Bo(g, y, l, null), g.flags |= 2), g.return = o, u.return = o, u.sibling = g, o.child = u, u = g, g = o.child, y = r.child.memoizedState, y = y === null ? Mc(l) : { baseLanes: y.baseLanes | l, cachePool: null, transitions: y.transitions }, g.memoizedState = y, g.childLanes = r.childLanes & ~l, o.memoizedState = Dc, u;
    }
    return g = r.child, r = g.sibling, u = oo(g, { mode: "visible", children: u.children }), (o.mode & 1) === 0 && (u.lanes = l), u.return = o, u.sibling = null, r !== null && (l = o.deletions, l === null ? (o.deletions = [r], o.flags |= 16) : l.push(r)), o.child = u, o.memoizedState = null, u;
  }
  function jc(r, o) {
    return o = bs({ mode: "visible", children: o }, r.mode, 0, null), o.return = r, r.child = o;
  }
  function is(r, o, l, u) {
    return u !== null && fc(u), fi(o, r.child, null, l), r = jc(o, o.pendingProps.children), r.flags |= 2, o.memoizedState = null, r;
  }
  function T1(r, o, l, u, p, g, y) {
    if (l)
      return o.flags & 256 ? (o.flags &= -257, u = Rc(Error(n(422))), is(r, o, y, u)) : o.memoizedState !== null ? (o.child = r.child, o.flags |= 128, null) : (g = u.fallback, p = o.mode, u = bs({ mode: "visible", children: u.children }, p, 0, null), g = Bo(g, p, y, null), g.flags |= 2, u.return = o, g.return = o, u.sibling = g, o.child = u, (o.mode & 1) !== 0 && fi(o, r.child, null, y), o.child.memoizedState = Mc(y), o.memoizedState = Dc, g);
    if ((o.mode & 1) === 0) return is(r, o, y, null);
    if (p.data === "$!") {
      if (u = p.nextSibling && p.nextSibling.dataset, u) var C = u.dgst;
      return u = C, g = Error(n(419)), u = Rc(g, u, void 0), is(r, o, y, u);
    }
    if (C = (y & r.childLanes) !== 0, ur || C) {
      if (u = Nt, u !== null) {
        switch (y & -y) {
          case 4:
            p = 2;
            break;
          case 16:
            p = 8;
            break;
          case 64:
          case 128:
          case 256:
          case 512:
          case 1024:
          case 2048:
          case 4096:
          case 8192:
          case 16384:
          case 32768:
          case 65536:
          case 131072:
          case 262144:
          case 524288:
          case 1048576:
          case 2097152:
          case 4194304:
          case 8388608:
          case 16777216:
          case 33554432:
          case 67108864:
            p = 32;
            break;
          case 536870912:
            p = 268435456;
            break;
          default:
            p = 0;
        }
        p = (p & (u.suspendedLanes | y)) !== 0 ? 0 : p, p !== 0 && p !== g.retryLane && (g.retryLane = p, wn(r, p), Vr(u, r, p, -1));
      }
      return td(), u = Rc(Error(n(421))), is(r, o, y, u);
    }
    return p.data === "$?" ? (o.flags |= 128, o.child = r.child, o = z1.bind(null, r), p._reactRetry = o, null) : (r = g.treeContext, _r = Yn(p.nextSibling), yr = o, gt = !0, Fr = null, r !== null && (xr[$r++] = _n, xr[$r++] = kn, xr[$r++] = Eo, _n = r.id, kn = r.overflow, Eo = o), o = jc(o, u.children), o.flags |= 4096, o);
  }
  function Qg(r, o, l) {
    r.lanes |= o;
    var u = r.alternate;
    u !== null && (u.lanes |= o), mc(r.return, o, l);
  }
  function Fc(r, o, l, u, p) {
    var g = r.memoizedState;
    g === null ? r.memoizedState = { isBackwards: o, rendering: null, renderingStartTime: 0, last: u, tail: l, tailMode: p } : (g.isBackwards = o, g.rendering = null, g.renderingStartTime = 0, g.last = u, g.tail = l, g.tailMode = p);
  }
  function Jg(r, o, l) {
    var u = o.pendingProps, p = u.revealOrder, g = u.tail;
    if (Zt(r, o, u.children, l), u = mt.current, (u & 2) !== 0) u = u & 1 | 2, o.flags |= 128;
    else {
      if (r !== null && (r.flags & 128) !== 0) e: for (r = o.child; r !== null; ) {
        if (r.tag === 13) r.memoizedState !== null && Qg(r, l, o);
        else if (r.tag === 19) Qg(r, l, o);
        else if (r.child !== null) {
          r.child.return = r, r = r.child;
          continue;
        }
        if (r === o) break e;
        for (; r.sibling === null; ) {
          if (r.return === null || r.return === o) break e;
          r = r.return;
        }
        r.sibling.return = r.return, r = r.sibling;
      }
      u &= 1;
    }
    if (lt(mt, u), (o.mode & 1) === 0) o.memoizedState = null;
    else switch (p) {
      case "forwards":
        for (l = o.child, p = null; l !== null; ) r = l.alternate, r !== null && qa(r) === null && (p = l), l = l.sibling;
        l = p, l === null ? (p = o.child, o.child = null) : (p = l.sibling, l.sibling = null), Fc(o, !1, p, l, g);
        break;
      case "backwards":
        for (l = null, p = o.child, o.child = null; p !== null; ) {
          if (r = p.alternate, r !== null && qa(r) === null) {
            o.child = p;
            break;
          }
          r = p.sibling, p.sibling = l, l = p, p = r;
        }
        Fc(o, !0, l, null, g);
        break;
      case "together":
        Fc(o, !1, null, null, void 0);
        break;
      default:
        o.memoizedState = null;
    }
    return o.child;
  }
  function ls(r, o) {
    (o.mode & 1) === 0 && r !== null && (r.alternate = null, o.alternate = null, o.flags |= 2);
  }
  function Cn(r, o, l) {
    if (r !== null && (o.dependencies = r.dependencies), No |= o.lanes, (l & o.childLanes) === 0) return null;
    if (r !== null && o.child !== r.child) throw Error(n(153));
    if (o.child !== null) {
      for (r = o.child, l = oo(r, r.pendingProps), o.child = l, l.return = o; r.sibling !== null; ) r = r.sibling, l = l.sibling = oo(r, r.pendingProps), l.return = o;
      l.sibling = null;
    }
    return o.child;
  }
  function O1(r, o, l) {
    switch (o.tag) {
      case 3:
        Yg(o), di();
        break;
      case 5:
        dg(o);
        break;
      case 1:
        sr(o.type) && Ua(o);
        break;
      case 4:
        yc(o, o.stateNode.containerInfo);
        break;
      case 10:
        var u = o.type._context, p = o.memoizedProps.value;
        lt(Ga, u._currentValue), u._currentValue = p;
        break;
      case 13:
        if (u = o.memoizedState, u !== null)
          return u.dehydrated !== null ? (lt(mt, mt.current & 1), o.flags |= 128, null) : (l & o.child.childLanes) !== 0 ? Xg(r, o, l) : (lt(mt, mt.current & 1), r = Cn(r, o, l), r !== null ? r.sibling : null);
        lt(mt, mt.current & 1);
        break;
      case 19:
        if (u = (l & o.childLanes) !== 0, (r.flags & 128) !== 0) {
          if (u) return Jg(r, o, l);
          o.flags |= 128;
        }
        if (p = o.memoizedState, p !== null && (p.rendering = null, p.tail = null, p.lastEffect = null), lt(mt, mt.current), u) break;
        return null;
      case 22:
      case 23:
        return o.lanes = 0, Vg(r, o, l);
    }
    return Cn(r, o, l);
  }
  var qg, zc, Zg, eh;
  qg = function(r, o) {
    for (var l = o.child; l !== null; ) {
      if (l.tag === 5 || l.tag === 6) r.appendChild(l.stateNode);
      else if (l.tag !== 4 && l.child !== null) {
        l.child.return = l, l = l.child;
        continue;
      }
      if (l === o) break;
      for (; l.sibling === null; ) {
        if (l.return === null || l.return === o) return;
        l = l.return;
      }
      l.sibling.return = l.return, l = l.sibling;
    }
  }, zc = function() {
  }, Zg = function(r, o, l, u) {
    var p = r.memoizedProps;
    if (p !== u) {
      r = o.stateNode, Lo(tn.current);
      var g = null;
      switch (l) {
        case "input":
          p = E(r, p), u = E(r, u), g = [];
          break;
        case "select":
          p = q({}, p, { value: void 0 }), u = q({}, u, { value: void 0 }), g = [];
          break;
        case "textarea":
          p = U(r, p), u = U(r, u), g = [];
          break;
        default:
          typeof p.onClick != "function" && typeof u.onClick == "function" && (r.onclick = ja);
      }
      lr(l, u);
      var y;
      l = null;
      for (H in p) if (!u.hasOwnProperty(H) && p.hasOwnProperty(H) && p[H] != null) if (H === "style") {
        var C = p[H];
        for (y in C) C.hasOwnProperty(y) && (l || (l = {}), l[y] = "");
      } else H !== "dangerouslySetInnerHTML" && H !== "children" && H !== "suppressContentEditableWarning" && H !== "suppressHydrationWarning" && H !== "autoFocus" && (a.hasOwnProperty(H) ? g || (g = []) : (g = g || []).push(H, null));
      for (H in u) {
        var O = u[H];
        if (C = p != null ? p[H] : void 0, u.hasOwnProperty(H) && O !== C && (O != null || C != null)) if (H === "style") if (C) {
          for (y in C) !C.hasOwnProperty(y) || O && O.hasOwnProperty(y) || (l || (l = {}), l[y] = "");
          for (y in O) O.hasOwnProperty(y) && C[y] !== O[y] && (l || (l = {}), l[y] = O[y]);
        } else l || (g || (g = []), g.push(
          H,
          l
        )), l = O;
        else H === "dangerouslySetInnerHTML" ? (O = O ? O.__html : void 0, C = C ? C.__html : void 0, O != null && C !== O && (g = g || []).push(H, O)) : H === "children" ? typeof O != "string" && typeof O != "number" || (g = g || []).push(H, "" + O) : H !== "suppressContentEditableWarning" && H !== "suppressHydrationWarning" && (a.hasOwnProperty(H) ? (O != null && H === "onScroll" && ut("scroll", r), g || C === O || (g = [])) : (g = g || []).push(H, O));
      }
      l && (g = g || []).push("style", l);
      var H = g;
      (o.updateQueue = H) && (o.flags |= 4);
    }
  }, eh = function(r, o, l, u) {
    l !== u && (o.flags |= 4);
  };
  function vl(r, o) {
    if (!gt) switch (r.tailMode) {
      case "hidden":
        o = r.tail;
        for (var l = null; o !== null; ) o.alternate !== null && (l = o), o = o.sibling;
        l === null ? r.tail = null : l.sibling = null;
        break;
      case "collapsed":
        l = r.tail;
        for (var u = null; l !== null; ) l.alternate !== null && (u = l), l = l.sibling;
        u === null ? o || r.tail === null ? r.tail = null : r.tail.sibling = null : u.sibling = null;
    }
  }
  function Ht(r) {
    var o = r.alternate !== null && r.alternate.child === r.child, l = 0, u = 0;
    if (o) for (var p = r.child; p !== null; ) l |= p.lanes | p.childLanes, u |= p.subtreeFlags & 14680064, u |= p.flags & 14680064, p.return = r, p = p.sibling;
    else for (p = r.child; p !== null; ) l |= p.lanes | p.childLanes, u |= p.subtreeFlags, u |= p.flags, p.return = r, p = p.sibling;
    return r.subtreeFlags |= u, r.childLanes = l, o;
  }
  function L1(r, o, l) {
    var u = o.pendingProps;
    switch (uc(o), o.tag) {
      case 2:
      case 16:
      case 15:
      case 0:
      case 11:
      case 7:
      case 8:
      case 12:
      case 9:
      case 14:
        return Ht(o), null;
      case 1:
        return sr(o.type) && za(), Ht(o), null;
      case 3:
        return u = o.stateNode, hi(), ct(ar), ct(Wt), wc(), u.pendingContext && (u.context = u.pendingContext, u.pendingContext = null), (r === null || r.child === null) && (Ka(o) ? o.flags |= 4 : r === null || r.memoizedState.isDehydrated && (o.flags & 256) === 0 || (o.flags |= 1024, Fr !== null && (qc(Fr), Fr = null))), zc(r, o), Ht(o), null;
      case 5:
        _c(o);
        var p = Lo(fl.current);
        if (l = o.type, r !== null && o.stateNode != null) Zg(r, o, l, u, p), r.ref !== o.ref && (o.flags |= 512, o.flags |= 2097152);
        else {
          if (!u) {
            if (o.stateNode === null) throw Error(n(166));
            return Ht(o), null;
          }
          if (r = Lo(tn.current), Ka(o)) {
            u = o.stateNode, l = o.type;
            var g = o.memoizedProps;
            switch (u[en] = o, u[al] = g, r = (o.mode & 1) !== 0, l) {
              case "dialog":
                ut("cancel", u), ut("close", u);
                break;
              case "iframe":
              case "object":
              case "embed":
                ut("load", u);
                break;
              case "video":
              case "audio":
                for (p = 0; p < ol.length; p++) ut(ol[p], u);
                break;
              case "source":
                ut("error", u);
                break;
              case "img":
              case "image":
              case "link":
                ut(
                  "error",
                  u
                ), ut("load", u);
                break;
              case "details":
                ut("toggle", u);
                break;
              case "input":
                G(u, g), ut("invalid", u);
                break;
              case "select":
                u._wrapperState = { wasMultiple: !!g.multiple }, ut("invalid", u);
                break;
              case "textarea":
                Y(u, g), ut("invalid", u);
            }
            lr(l, g), p = null;
            for (var y in g) if (g.hasOwnProperty(y)) {
              var C = g[y];
              y === "children" ? typeof C == "string" ? u.textContent !== C && (g.suppressHydrationWarning !== !0 && Ma(u.textContent, C, r), p = ["children", C]) : typeof C == "number" && u.textContent !== "" + C && (g.suppressHydrationWarning !== !0 && Ma(
                u.textContent,
                C,
                r
              ), p = ["children", "" + C]) : a.hasOwnProperty(y) && C != null && y === "onScroll" && ut("scroll", u);
            }
            switch (l) {
              case "input":
                vr(u), ce(u, g, !0);
                break;
              case "textarea":
                vr(u), le(u);
                break;
              case "select":
              case "option":
                break;
              default:
                typeof g.onClick == "function" && (u.onclick = ja);
            }
            u = p, o.updateQueue = u, u !== null && (o.flags |= 4);
          } else {
            y = p.nodeType === 9 ? p : p.ownerDocument, r === "http://www.w3.org/1999/xhtml" && (r = z(l)), r === "http://www.w3.org/1999/xhtml" ? l === "script" ? (r = y.createElement("div"), r.innerHTML = "<script><\/script>", r = r.removeChild(r.firstChild)) : typeof u.is == "string" ? r = y.createElement(l, { is: u.is }) : (r = y.createElement(l), l === "select" && (y = r, u.multiple ? y.multiple = !0 : u.size && (y.size = u.size))) : r = y.createElementNS(r, l), r[en] = o, r[al] = u, qg(r, o, !1, !1), o.stateNode = r;
            e: {
              switch (y = Qo(l, u), l) {
                case "dialog":
                  ut("cancel", r), ut("close", r), p = u;
                  break;
                case "iframe":
                case "object":
                case "embed":
                  ut("load", r), p = u;
                  break;
                case "video":
                case "audio":
                  for (p = 0; p < ol.length; p++) ut(ol[p], r);
                  p = u;
                  break;
                case "source":
                  ut("error", r), p = u;
                  break;
                case "img":
                case "image":
                case "link":
                  ut(
                    "error",
                    r
                  ), ut("load", r), p = u;
                  break;
                case "details":
                  ut("toggle", r), p = u;
                  break;
                case "input":
                  G(r, u), p = E(r, u), ut("invalid", r);
                  break;
                case "option":
                  p = u;
                  break;
                case "select":
                  r._wrapperState = { wasMultiple: !!u.multiple }, p = q({}, u, { value: void 0 }), ut("invalid", r);
                  break;
                case "textarea":
                  Y(r, u), p = U(r, u), ut("invalid", r);
                  break;
                default:
                  p = u;
              }
              lr(l, p), C = p;
              for (g in C) if (C.hasOwnProperty(g)) {
                var O = C[g];
                g === "style" ? Xo(r, O) : g === "dangerouslySetInnerHTML" ? (O = O ? O.__html : void 0, O != null && Ue(r, O)) : g === "children" ? typeof O == "string" ? (l !== "textarea" || O !== "") && Ze(r, O) : typeof O == "number" && Ze(r, "" + O) : g !== "suppressContentEditableWarning" && g !== "suppressHydrationWarning" && g !== "autoFocus" && (a.hasOwnProperty(g) ? O != null && g === "onScroll" && ut("scroll", r) : O != null && L(r, g, O, y));
              }
              switch (l) {
                case "input":
                  vr(r), ce(r, u, !1);
                  break;
                case "textarea":
                  vr(r), le(r);
                  break;
                case "option":
                  u.value != null && r.setAttribute("value", "" + Me(u.value));
                  break;
                case "select":
                  r.multiple = !!u.multiple, g = u.value, g != null ? w(r, !!u.multiple, g, !1) : u.defaultValue != null && w(
                    r,
                    !!u.multiple,
                    u.defaultValue,
                    !0
                  );
                  break;
                default:
                  typeof p.onClick == "function" && (r.onclick = ja);
              }
              switch (l) {
                case "button":
                case "input":
                case "select":
                case "textarea":
                  u = !!u.autoFocus;
                  break e;
                case "img":
                  u = !0;
                  break e;
                default:
                  u = !1;
              }
            }
            u && (o.flags |= 4);
          }
          o.ref !== null && (o.flags |= 512, o.flags |= 2097152);
        }
        return Ht(o), null;
      case 6:
        if (r && o.stateNode != null) eh(r, o, r.memoizedProps, u);
        else {
          if (typeof u != "string" && o.stateNode === null) throw Error(n(166));
          if (l = Lo(fl.current), Lo(tn.current), Ka(o)) {
            if (u = o.stateNode, l = o.memoizedProps, u[en] = o, (g = u.nodeValue !== l) && (r = yr, r !== null)) switch (r.tag) {
              case 3:
                Ma(u.nodeValue, l, (r.mode & 1) !== 0);
                break;
              case 5:
                r.memoizedProps.suppressHydrationWarning !== !0 && Ma(u.nodeValue, l, (r.mode & 1) !== 0);
            }
            g && (o.flags |= 4);
          } else u = (l.nodeType === 9 ? l : l.ownerDocument).createTextNode(u), u[en] = o, o.stateNode = u;
        }
        return Ht(o), null;
      case 13:
        if (ct(mt), u = o.memoizedState, r === null || r.memoizedState !== null && r.memoizedState.dehydrated !== null) {
          if (gt && _r !== null && (o.mode & 1) !== 0 && (o.flags & 128) === 0) ng(), di(), o.flags |= 98560, g = !1;
          else if (g = Ka(o), u !== null && u.dehydrated !== null) {
            if (r === null) {
              if (!g) throw Error(n(318));
              if (g = o.memoizedState, g = g !== null ? g.dehydrated : null, !g) throw Error(n(317));
              g[en] = o;
            } else di(), (o.flags & 128) === 0 && (o.memoizedState = null), o.flags |= 4;
            Ht(o), g = !1;
          } else Fr !== null && (qc(Fr), Fr = null), g = !0;
          if (!g) return o.flags & 65536 ? o : null;
        }
        return (o.flags & 128) !== 0 ? (o.lanes = l, o) : (u = u !== null, u !== (r !== null && r.memoizedState !== null) && u && (o.child.flags |= 8192, (o.mode & 1) !== 0 && (r === null || (mt.current & 1) !== 0 ? Tt === 0 && (Tt = 3) : td())), o.updateQueue !== null && (o.flags |= 4), Ht(o), null);
      case 4:
        return hi(), zc(r, o), r === null && il(o.stateNode.containerInfo), Ht(o), null;
      case 10:
        return hc(o.type._context), Ht(o), null;
      case 17:
        return sr(o.type) && za(), Ht(o), null;
      case 19:
        if (ct(mt), g = o.memoizedState, g === null) return Ht(o), null;
        if (u = (o.flags & 128) !== 0, y = g.rendering, y === null) if (u) vl(g, !1);
        else {
          if (Tt !== 0 || r !== null && (r.flags & 128) !== 0) for (r = o.child; r !== null; ) {
            if (y = qa(r), y !== null) {
              for (o.flags |= 128, vl(g, !1), u = y.updateQueue, u !== null && (o.updateQueue = u, o.flags |= 4), o.subtreeFlags = 0, u = l, l = o.child; l !== null; ) g = l, r = u, g.flags &= 14680066, y = g.alternate, y === null ? (g.childLanes = 0, g.lanes = r, g.child = null, g.subtreeFlags = 0, g.memoizedProps = null, g.memoizedState = null, g.updateQueue = null, g.dependencies = null, g.stateNode = null) : (g.childLanes = y.childLanes, g.lanes = y.lanes, g.child = y.child, g.subtreeFlags = 0, g.deletions = null, g.memoizedProps = y.memoizedProps, g.memoizedState = y.memoizedState, g.updateQueue = y.updateQueue, g.type = y.type, r = y.dependencies, g.dependencies = r === null ? null : { lanes: r.lanes, firstContext: r.firstContext }), l = l.sibling;
              return lt(mt, mt.current & 1 | 2), o.child;
            }
            r = r.sibling;
          }
          g.tail !== null && _t() > yi && (o.flags |= 128, u = !0, vl(g, !1), o.lanes = 4194304);
        }
        else {
          if (!u) if (r = qa(y), r !== null) {
            if (o.flags |= 128, u = !0, l = r.updateQueue, l !== null && (o.updateQueue = l, o.flags |= 4), vl(g, !0), g.tail === null && g.tailMode === "hidden" && !y.alternate && !gt) return Ht(o), null;
          } else 2 * _t() - g.renderingStartTime > yi && l !== 1073741824 && (o.flags |= 128, u = !0, vl(g, !1), o.lanes = 4194304);
          g.isBackwards ? (y.sibling = o.child, o.child = y) : (l = g.last, l !== null ? l.sibling = y : o.child = y, g.last = y);
        }
        return g.tail !== null ? (o = g.tail, g.rendering = o, g.tail = o.sibling, g.renderingStartTime = _t(), o.sibling = null, l = mt.current, lt(mt, u ? l & 1 | 2 : l & 1), o) : (Ht(o), null);
      case 22:
      case 23:
        return ed(), u = o.memoizedState !== null, r !== null && r.memoizedState !== null !== u && (o.flags |= 8192), u && (o.mode & 1) !== 0 ? (kr & 1073741824) !== 0 && (Ht(o), o.subtreeFlags & 6 && (o.flags |= 8192)) : Ht(o), null;
      case 24:
        return null;
      case 25:
        return null;
    }
    throw Error(n(156, o.tag));
  }
  function P1(r, o) {
    switch (uc(o), o.tag) {
      case 1:
        return sr(o.type) && za(), r = o.flags, r & 65536 ? (o.flags = r & -65537 | 128, o) : null;
      case 3:
        return hi(), ct(ar), ct(Wt), wc(), r = o.flags, (r & 65536) !== 0 && (r & 128) === 0 ? (o.flags = r & -65537 | 128, o) : null;
      case 5:
        return _c(o), null;
      case 13:
        if (ct(mt), r = o.memoizedState, r !== null && r.dehydrated !== null) {
          if (o.alternate === null) throw Error(n(340));
          di();
        }
        return r = o.flags, r & 65536 ? (o.flags = r & -65537 | 128, o) : null;
      case 19:
        return ct(mt), null;
      case 4:
        return hi(), null;
      case 10:
        return hc(o.type._context), null;
      case 22:
      case 23:
        return ed(), null;
      case 24:
        return null;
      default:
        return null;
    }
  }
  var as = !1, Kt = !1, N1 = typeof WeakSet == "function" ? WeakSet : Set, me = null;
  function vi(r, o) {
    var l = r.ref;
    if (l !== null) if (typeof l == "function") try {
      l(null);
    } catch (u) {
      bt(r, o, u);
    }
    else l.current = null;
  }
  function Uc(r, o, l) {
    try {
      l();
    } catch (u) {
      bt(r, o, u);
    }
  }
  var th = !1;
  function R1(r, o) {
    if (ec = Ea, r = Rp(), Ku(r)) {
      if ("selectionStart" in r) var l = { start: r.selectionStart, end: r.selectionEnd };
      else e: {
        l = (l = r.ownerDocument) && l.defaultView || window;
        var u = l.getSelection && l.getSelection();
        if (u && u.rangeCount !== 0) {
          l = u.anchorNode;
          var p = u.anchorOffset, g = u.focusNode;
          u = u.focusOffset;
          try {
            l.nodeType, g.nodeType;
          } catch {
            l = null;
            break e;
          }
          var y = 0, C = -1, O = -1, H = 0, ne = 0, ie = r, ee = null;
          t: for (; ; ) {
            for (var pe; ie !== l || p !== 0 && ie.nodeType !== 3 || (C = y + p), ie !== g || u !== 0 && ie.nodeType !== 3 || (O = y + u), ie.nodeType === 3 && (y += ie.nodeValue.length), (pe = ie.firstChild) !== null; )
              ee = ie, ie = pe;
            for (; ; ) {
              if (ie === r) break t;
              if (ee === l && ++H === p && (C = y), ee === g && ++ne === u && (O = y), (pe = ie.nextSibling) !== null) break;
              ie = ee, ee = ie.parentNode;
            }
            ie = pe;
          }
          l = C === -1 || O === -1 ? null : { start: C, end: O };
        } else l = null;
      }
      l = l || { start: 0, end: 0 };
    } else l = null;
    for (tc = { focusedElem: r, selectionRange: l }, Ea = !1, me = o; me !== null; ) if (o = me, r = o.child, (o.subtreeFlags & 1028) !== 0 && r !== null) r.return = o, me = r;
    else for (; me !== null; ) {
      o = me;
      try {
        var ve = o.alternate;
        if ((o.flags & 1024) !== 0) switch (o.tag) {
          case 0:
          case 11:
          case 15:
            break;
          case 1:
            if (ve !== null) {
              var _e = ve.memoizedProps, kt = ve.memoizedState, j = o.stateNode, A = j.getSnapshotBeforeUpdate(o.elementType === o.type ? _e : zr(o.type, _e), kt);
              j.__reactInternalSnapshotBeforeUpdate = A;
            }
            break;
          case 3:
            var W = o.stateNode.containerInfo;
            W.nodeType === 1 ? W.textContent = "" : W.nodeType === 9 && W.documentElement && W.removeChild(W.documentElement);
            break;
          case 5:
          case 6:
          case 4:
          case 17:
            break;
          default:
            throw Error(n(163));
        }
      } catch (se) {
        bt(o, o.return, se);
      }
      if (r = o.sibling, r !== null) {
        r.return = o.return, me = r;
        break;
      }
      me = o.return;
    }
    return ve = th, th = !1, ve;
  }
  function bl(r, o, l) {
    var u = o.updateQueue;
    if (u = u !== null ? u.lastEffect : null, u !== null) {
      var p = u = u.next;
      do {
        if ((p.tag & r) === r) {
          var g = p.destroy;
          p.destroy = void 0, g !== void 0 && Uc(o, l, g);
        }
        p = p.next;
      } while (p !== u);
    }
  }
  function ss(r, o) {
    if (o = o.updateQueue, o = o !== null ? o.lastEffect : null, o !== null) {
      var l = o = o.next;
      do {
        if ((l.tag & r) === r) {
          var u = l.create;
          l.destroy = u();
        }
        l = l.next;
      } while (l !== o);
    }
  }
  function Wc(r) {
    var o = r.ref;
    if (o !== null) {
      var l = r.stateNode;
      switch (r.tag) {
        case 5:
          r = l;
          break;
        default:
          r = l;
      }
      typeof o == "function" ? o(r) : o.current = r;
    }
  }
  function rh(r) {
    var o = r.alternate;
    o !== null && (r.alternate = null, rh(o)), r.child = null, r.deletions = null, r.sibling = null, r.tag === 5 && (o = r.stateNode, o !== null && (delete o[en], delete o[al], delete o[ic], delete o[h1], delete o[m1])), r.stateNode = null, r.return = null, r.dependencies = null, r.memoizedProps = null, r.memoizedState = null, r.pendingProps = null, r.stateNode = null, r.updateQueue = null;
  }
  function nh(r) {
    return r.tag === 5 || r.tag === 3 || r.tag === 4;
  }
  function oh(r) {
    e: for (; ; ) {
      for (; r.sibling === null; ) {
        if (r.return === null || nh(r.return)) return null;
        r = r.return;
      }
      for (r.sibling.return = r.return, r = r.sibling; r.tag !== 5 && r.tag !== 6 && r.tag !== 18; ) {
        if (r.flags & 2 || r.child === null || r.tag === 4) continue e;
        r.child.return = r, r = r.child;
      }
      if (!(r.flags & 2)) return r.stateNode;
    }
  }
  function Vc(r, o, l) {
    var u = r.tag;
    if (u === 5 || u === 6) r = r.stateNode, o ? l.nodeType === 8 ? l.parentNode.insertBefore(r, o) : l.insertBefore(r, o) : (l.nodeType === 8 ? (o = l.parentNode, o.insertBefore(r, l)) : (o = l, o.appendChild(r)), l = l._reactRootContainer, l != null || o.onclick !== null || (o.onclick = ja));
    else if (u !== 4 && (r = r.child, r !== null)) for (Vc(r, o, l), r = r.sibling; r !== null; ) Vc(r, o, l), r = r.sibling;
  }
  function Hc(r, o, l) {
    var u = r.tag;
    if (u === 5 || u === 6) r = r.stateNode, o ? l.insertBefore(r, o) : l.appendChild(r);
    else if (u !== 4 && (r = r.child, r !== null)) for (Hc(r, o, l), r = r.sibling; r !== null; ) Hc(r, o, l), r = r.sibling;
  }
  var Dt = null, Ur = !1;
  function Zn(r, o, l) {
    for (l = l.child; l !== null; ) ih(r, o, l), l = l.sibling;
  }
  function ih(r, o, l) {
    if (Zr && typeof Zr.onCommitFiberUnmount == "function") try {
      Zr.onCommitFiberUnmount(ka, l);
    } catch {
    }
    switch (l.tag) {
      case 5:
        Kt || vi(l, o);
      case 6:
        var u = Dt, p = Ur;
        Dt = null, Zn(r, o, l), Dt = u, Ur = p, Dt !== null && (Ur ? (r = Dt, l = l.stateNode, r.nodeType === 8 ? r.parentNode.removeChild(l) : r.removeChild(l)) : Dt.removeChild(l.stateNode));
        break;
      case 18:
        Dt !== null && (Ur ? (r = Dt, l = l.stateNode, r.nodeType === 8 ? oc(r.parentNode, l) : r.nodeType === 1 && oc(r, l), Qi(r)) : oc(Dt, l.stateNode));
        break;
      case 4:
        u = Dt, p = Ur, Dt = l.stateNode.containerInfo, Ur = !0, Zn(r, o, l), Dt = u, Ur = p;
        break;
      case 0:
      case 11:
      case 14:
      case 15:
        if (!Kt && (u = l.updateQueue, u !== null && (u = u.lastEffect, u !== null))) {
          p = u = u.next;
          do {
            var g = p, y = g.destroy;
            g = g.tag, y !== void 0 && ((g & 2) !== 0 || (g & 4) !== 0) && Uc(l, o, y), p = p.next;
          } while (p !== u);
        }
        Zn(r, o, l);
        break;
      case 1:
        if (!Kt && (vi(l, o), u = l.stateNode, typeof u.componentWillUnmount == "function")) try {
          u.props = l.memoizedProps, u.state = l.memoizedState, u.componentWillUnmount();
        } catch (C) {
          bt(l, o, C);
        }
        Zn(r, o, l);
        break;
      case 21:
        Zn(r, o, l);
        break;
      case 22:
        l.mode & 1 ? (Kt = (u = Kt) || l.memoizedState !== null, Zn(r, o, l), Kt = u) : Zn(r, o, l);
        break;
      default:
        Zn(r, o, l);
    }
  }
  function lh(r) {
    var o = r.updateQueue;
    if (o !== null) {
      r.updateQueue = null;
      var l = r.stateNode;
      l === null && (l = r.stateNode = new N1()), o.forEach(function(u) {
        var p = U1.bind(null, r, u);
        l.has(u) || (l.add(u), u.then(p, p));
      });
    }
  }
  function Wr(r, o) {
    var l = o.deletions;
    if (l !== null) for (var u = 0; u < l.length; u++) {
      var p = l[u];
      try {
        var g = r, y = o, C = y;
        e: for (; C !== null; ) {
          switch (C.tag) {
            case 5:
              Dt = C.stateNode, Ur = !1;
              break e;
            case 3:
              Dt = C.stateNode.containerInfo, Ur = !0;
              break e;
            case 4:
              Dt = C.stateNode.containerInfo, Ur = !0;
              break e;
          }
          C = C.return;
        }
        if (Dt === null) throw Error(n(160));
        ih(g, y, p), Dt = null, Ur = !1;
        var O = p.alternate;
        O !== null && (O.return = null), p.return = null;
      } catch (H) {
        bt(p, o, H);
      }
    }
    if (o.subtreeFlags & 12854) for (o = o.child; o !== null; ) ah(o, r), o = o.sibling;
  }
  function ah(r, o) {
    var l = r.alternate, u = r.flags;
    switch (r.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        if (Wr(o, r), nn(r), u & 4) {
          try {
            bl(3, r, r.return), ss(3, r);
          } catch (_e) {
            bt(r, r.return, _e);
          }
          try {
            bl(5, r, r.return);
          } catch (_e) {
            bt(r, r.return, _e);
          }
        }
        break;
      case 1:
        Wr(o, r), nn(r), u & 512 && l !== null && vi(l, l.return);
        break;
      case 5:
        if (Wr(o, r), nn(r), u & 512 && l !== null && vi(l, l.return), r.flags & 32) {
          var p = r.stateNode;
          try {
            Ze(p, "");
          } catch (_e) {
            bt(r, r.return, _e);
          }
        }
        if (u & 4 && (p = r.stateNode, p != null)) {
          var g = r.memoizedProps, y = l !== null ? l.memoizedProps : g, C = r.type, O = r.updateQueue;
          if (r.updateQueue = null, O !== null) try {
            C === "input" && g.type === "radio" && g.name != null && J(p, g), Qo(C, y);
            var H = Qo(C, g);
            for (y = 0; y < O.length; y += 2) {
              var ne = O[y], ie = O[y + 1];
              ne === "style" ? Xo(p, ie) : ne === "dangerouslySetInnerHTML" ? Ue(p, ie) : ne === "children" ? Ze(p, ie) : L(p, ne, ie, H);
            }
            switch (C) {
              case "input":
                Z(p, g);
                break;
              case "textarea":
                de(p, g);
                break;
              case "select":
                var ee = p._wrapperState.wasMultiple;
                p._wrapperState.wasMultiple = !!g.multiple;
                var pe = g.value;
                pe != null ? w(p, !!g.multiple, pe, !1) : ee !== !!g.multiple && (g.defaultValue != null ? w(
                  p,
                  !!g.multiple,
                  g.defaultValue,
                  !0
                ) : w(p, !!g.multiple, g.multiple ? [] : "", !1));
            }
            p[al] = g;
          } catch (_e) {
            bt(r, r.return, _e);
          }
        }
        break;
      case 6:
        if (Wr(o, r), nn(r), u & 4) {
          if (r.stateNode === null) throw Error(n(162));
          p = r.stateNode, g = r.memoizedProps;
          try {
            p.nodeValue = g;
          } catch (_e) {
            bt(r, r.return, _e);
          }
        }
        break;
      case 3:
        if (Wr(o, r), nn(r), u & 4 && l !== null && l.memoizedState.isDehydrated) try {
          Qi(o.containerInfo);
        } catch (_e) {
          bt(r, r.return, _e);
        }
        break;
      case 4:
        Wr(o, r), nn(r);
        break;
      case 13:
        Wr(o, r), nn(r), p = r.child, p.flags & 8192 && (g = p.memoizedState !== null, p.stateNode.isHidden = g, !g || p.alternate !== null && p.alternate.memoizedState !== null || (Gc = _t())), u & 4 && lh(r);
        break;
      case 22:
        if (ne = l !== null && l.memoizedState !== null, r.mode & 1 ? (Kt = (H = Kt) || ne, Wr(o, r), Kt = H) : Wr(o, r), nn(r), u & 8192) {
          if (H = r.memoizedState !== null, (r.stateNode.isHidden = H) && !ne && (r.mode & 1) !== 0) for (me = r, ne = r.child; ne !== null; ) {
            for (ie = me = ne; me !== null; ) {
              switch (ee = me, pe = ee.child, ee.tag) {
                case 0:
                case 11:
                case 14:
                case 15:
                  bl(4, ee, ee.return);
                  break;
                case 1:
                  vi(ee, ee.return);
                  var ve = ee.stateNode;
                  if (typeof ve.componentWillUnmount == "function") {
                    u = ee, l = ee.return;
                    try {
                      o = u, ve.props = o.memoizedProps, ve.state = o.memoizedState, ve.componentWillUnmount();
                    } catch (_e) {
                      bt(u, l, _e);
                    }
                  }
                  break;
                case 5:
                  vi(ee, ee.return);
                  break;
                case 22:
                  if (ee.memoizedState !== null) {
                    ch(ie);
                    continue;
                  }
              }
              pe !== null ? (pe.return = ee, me = pe) : ch(ie);
            }
            ne = ne.sibling;
          }
          e: for (ne = null, ie = r; ; ) {
            if (ie.tag === 5) {
              if (ne === null) {
                ne = ie;
                try {
                  p = ie.stateNode, H ? (g = p.style, typeof g.setProperty == "function" ? g.setProperty("display", "none", "important") : g.display = "none") : (C = ie.stateNode, O = ie.memoizedProps.style, y = O != null && O.hasOwnProperty("display") ? O.display : null, C.style.display = qr("display", y));
                } catch (_e) {
                  bt(r, r.return, _e);
                }
              }
            } else if (ie.tag === 6) {
              if (ne === null) try {
                ie.stateNode.nodeValue = H ? "" : ie.memoizedProps;
              } catch (_e) {
                bt(r, r.return, _e);
              }
            } else if ((ie.tag !== 22 && ie.tag !== 23 || ie.memoizedState === null || ie === r) && ie.child !== null) {
              ie.child.return = ie, ie = ie.child;
              continue;
            }
            if (ie === r) break e;
            for (; ie.sibling === null; ) {
              if (ie.return === null || ie.return === r) break e;
              ne === ie && (ne = null), ie = ie.return;
            }
            ne === ie && (ne = null), ie.sibling.return = ie.return, ie = ie.sibling;
          }
        }
        break;
      case 19:
        Wr(o, r), nn(r), u & 4 && lh(r);
        break;
      case 21:
        break;
      default:
        Wr(
          o,
          r
        ), nn(r);
    }
  }
  function nn(r) {
    var o = r.flags;
    if (o & 2) {
      try {
        e: {
          for (var l = r.return; l !== null; ) {
            if (nh(l)) {
              var u = l;
              break e;
            }
            l = l.return;
          }
          throw Error(n(160));
        }
        switch (u.tag) {
          case 5:
            var p = u.stateNode;
            u.flags & 32 && (Ze(p, ""), u.flags &= -33);
            var g = oh(r);
            Hc(r, g, p);
            break;
          case 3:
          case 4:
            var y = u.stateNode.containerInfo, C = oh(r);
            Vc(r, C, y);
            break;
          default:
            throw Error(n(161));
        }
      } catch (O) {
        bt(r, r.return, O);
      }
      r.flags &= -3;
    }
    o & 4096 && (r.flags &= -4097);
  }
  function I1(r, o, l) {
    me = r, sh(r);
  }
  function sh(r, o, l) {
    for (var u = (r.mode & 1) !== 0; me !== null; ) {
      var p = me, g = p.child;
      if (p.tag === 22 && u) {
        var y = p.memoizedState !== null || as;
        if (!y) {
          var C = p.alternate, O = C !== null && C.memoizedState !== null || Kt;
          C = as;
          var H = Kt;
          if (as = y, (Kt = O) && !H) for (me = p; me !== null; ) y = me, O = y.child, y.tag === 22 && y.memoizedState !== null ? dh(p) : O !== null ? (O.return = y, me = O) : dh(p);
          for (; g !== null; ) me = g, sh(g), g = g.sibling;
          me = p, as = C, Kt = H;
        }
        uh(r);
      } else (p.subtreeFlags & 8772) !== 0 && g !== null ? (g.return = p, me = g) : uh(r);
    }
  }
  function uh(r) {
    for (; me !== null; ) {
      var o = me;
      if ((o.flags & 8772) !== 0) {
        var l = o.alternate;
        try {
          if ((o.flags & 8772) !== 0) switch (o.tag) {
            case 0:
            case 11:
            case 15:
              Kt || ss(5, o);
              break;
            case 1:
              var u = o.stateNode;
              if (o.flags & 4 && !Kt) if (l === null) u.componentDidMount();
              else {
                var p = o.elementType === o.type ? l.memoizedProps : zr(o.type, l.memoizedProps);
                u.componentDidUpdate(p, l.memoizedState, u.__reactInternalSnapshotBeforeUpdate);
              }
              var g = o.updateQueue;
              g !== null && cg(o, g, u);
              break;
            case 3:
              var y = o.updateQueue;
              if (y !== null) {
                if (l = null, o.child !== null) switch (o.child.tag) {
                  case 5:
                    l = o.child.stateNode;
                    break;
                  case 1:
                    l = o.child.stateNode;
                }
                cg(o, y, l);
              }
              break;
            case 5:
              var C = o.stateNode;
              if (l === null && o.flags & 4) {
                l = C;
                var O = o.memoizedProps;
                switch (o.type) {
                  case "button":
                  case "input":
                  case "select":
                  case "textarea":
                    O.autoFocus && l.focus();
                    break;
                  case "img":
                    O.src && (l.src = O.src);
                }
              }
              break;
            case 6:
              break;
            case 4:
              break;
            case 12:
              break;
            case 13:
              if (o.memoizedState === null) {
                var H = o.alternate;
                if (H !== null) {
                  var ne = H.memoizedState;
                  if (ne !== null) {
                    var ie = ne.dehydrated;
                    ie !== null && Qi(ie);
                  }
                }
              }
              break;
            case 19:
            case 17:
            case 21:
            case 22:
            case 23:
            case 25:
              break;
            default:
              throw Error(n(163));
          }
          Kt || o.flags & 512 && Wc(o);
        } catch (ee) {
          bt(o, o.return, ee);
        }
      }
      if (o === r) {
        me = null;
        break;
      }
      if (l = o.sibling, l !== null) {
        l.return = o.return, me = l;
        break;
      }
      me = o.return;
    }
  }
  function ch(r) {
    for (; me !== null; ) {
      var o = me;
      if (o === r) {
        me = null;
        break;
      }
      var l = o.sibling;
      if (l !== null) {
        l.return = o.return, me = l;
        break;
      }
      me = o.return;
    }
  }
  function dh(r) {
    for (; me !== null; ) {
      var o = me;
      try {
        switch (o.tag) {
          case 0:
          case 11:
          case 15:
            var l = o.return;
            try {
              ss(4, o);
            } catch (O) {
              bt(o, l, O);
            }
            break;
          case 1:
            var u = o.stateNode;
            if (typeof u.componentDidMount == "function") {
              var p = o.return;
              try {
                u.componentDidMount();
              } catch (O) {
                bt(o, p, O);
              }
            }
            var g = o.return;
            try {
              Wc(o);
            } catch (O) {
              bt(o, g, O);
            }
            break;
          case 5:
            var y = o.return;
            try {
              Wc(o);
            } catch (O) {
              bt(o, y, O);
            }
        }
      } catch (O) {
        bt(o, o.return, O);
      }
      if (o === r) {
        me = null;
        break;
      }
      var C = o.sibling;
      if (C !== null) {
        C.return = o.return, me = C;
        break;
      }
      me = o.return;
    }
  }
  var A1 = Math.ceil, us = S.ReactCurrentDispatcher, Kc = S.ReactCurrentOwner, Or = S.ReactCurrentBatchConfig, Ye = 0, Nt = null, Ct = null, Mt = 0, kr = 0, bi = Gn(0), Tt = 0, yl = null, No = 0, cs = 0, Yc = 0, _l = null, cr = null, Gc = 0, yi = 1 / 0, xn = null, ds = !1, Xc = null, eo = null, fs = !1, to = null, ps = 0, kl = 0, Qc = null, gs = -1, hs = 0;
  function er() {
    return (Ye & 6) !== 0 ? _t() : gs !== -1 ? gs : gs = _t();
  }
  function ro(r) {
    return (r.mode & 1) === 0 ? 1 : (Ye & 2) !== 0 && Mt !== 0 ? Mt & -Mt : b1.transition !== null ? (hs === 0 && (hs = op()), hs) : (r = et, r !== 0 || (r = window.event, r = r === void 0 ? 16 : pp(r.type)), r);
  }
  function Vr(r, o, l, u) {
    if (50 < kl) throw kl = 0, Qc = null, Error(n(185));
    Hi(r, l, u), ((Ye & 2) === 0 || r !== Nt) && (r === Nt && ((Ye & 2) === 0 && (cs |= l), Tt === 4 && no(r, Mt)), dr(r, u), l === 1 && Ye === 0 && (o.mode & 1) === 0 && (yi = _t() + 500, Wa && Qn()));
  }
  function dr(r, o) {
    var l = r.callbackNode;
    by(r, o);
    var u = Ca(r, r === Nt ? Mt : 0);
    if (u === 0) l !== null && tp(l), r.callbackNode = null, r.callbackPriority = 0;
    else if (o = u & -u, r.callbackPriority !== o) {
      if (l != null && tp(l), o === 1) r.tag === 0 ? v1(ph.bind(null, r)) : qp(ph.bind(null, r)), p1(function() {
        (Ye & 6) === 0 && Qn();
      }), l = null;
      else {
        switch (ip(u)) {
          case 1:
            l = Ou;
            break;
          case 4:
            l = rp;
            break;
          case 16:
            l = _a;
            break;
          case 536870912:
            l = np;
            break;
          default:
            l = _a;
        }
        l = kh(l, fh.bind(null, r));
      }
      r.callbackPriority = o, r.callbackNode = l;
    }
  }
  function fh(r, o) {
    if (gs = -1, hs = 0, (Ye & 6) !== 0) throw Error(n(327));
    var l = r.callbackNode;
    if (_i() && r.callbackNode !== l) return null;
    var u = Ca(r, r === Nt ? Mt : 0);
    if (u === 0) return null;
    if ((u & 30) !== 0 || (u & r.expiredLanes) !== 0 || o) o = ms(r, u);
    else {
      o = u;
      var p = Ye;
      Ye |= 2;
      var g = hh();
      (Nt !== r || Mt !== o) && (xn = null, yi = _t() + 500, Io(r, o));
      do
        try {
          M1();
          break;
        } catch (C) {
          gh(r, C);
        }
      while (!0);
      gc(), us.current = g, Ye = p, Ct !== null ? o = 0 : (Nt = null, Mt = 0, o = Tt);
    }
    if (o !== 0) {
      if (o === 2 && (p = Lu(r), p !== 0 && (u = p, o = Jc(r, p))), o === 1) throw l = yl, Io(r, 0), no(r, u), dr(r, _t()), l;
      if (o === 6) no(r, u);
      else {
        if (p = r.current.alternate, (u & 30) === 0 && !B1(p) && (o = ms(r, u), o === 2 && (g = Lu(r), g !== 0 && (u = g, o = Jc(r, g))), o === 1)) throw l = yl, Io(r, 0), no(r, u), dr(r, _t()), l;
        switch (r.finishedWork = p, r.finishedLanes = u, o) {
          case 0:
          case 1:
            throw Error(n(345));
          case 2:
            Ao(r, cr, xn);
            break;
          case 3:
            if (no(r, u), (u & 130023424) === u && (o = Gc + 500 - _t(), 10 < o)) {
              if (Ca(r, 0) !== 0) break;
              if (p = r.suspendedLanes, (p & u) !== u) {
                er(), r.pingedLanes |= r.suspendedLanes & p;
                break;
              }
              r.timeoutHandle = nc(Ao.bind(null, r, cr, xn), o);
              break;
            }
            Ao(r, cr, xn);
            break;
          case 4:
            if (no(r, u), (u & 4194240) === u) break;
            for (o = r.eventTimes, p = -1; 0 < u; ) {
              var y = 31 - Mr(u);
              g = 1 << y, y = o[y], y > p && (p = y), u &= ~g;
            }
            if (u = p, u = _t() - u, u = (120 > u ? 120 : 480 > u ? 480 : 1080 > u ? 1080 : 1920 > u ? 1920 : 3e3 > u ? 3e3 : 4320 > u ? 4320 : 1960 * A1(u / 1960)) - u, 10 < u) {
              r.timeoutHandle = nc(Ao.bind(null, r, cr, xn), u);
              break;
            }
            Ao(r, cr, xn);
            break;
          case 5:
            Ao(r, cr, xn);
            break;
          default:
            throw Error(n(329));
        }
      }
    }
    return dr(r, _t()), r.callbackNode === l ? fh.bind(null, r) : null;
  }
  function Jc(r, o) {
    var l = _l;
    return r.current.memoizedState.isDehydrated && (Io(r, o).flags |= 256), r = ms(r, o), r !== 2 && (o = cr, cr = l, o !== null && qc(o)), r;
  }
  function qc(r) {
    cr === null ? cr = r : cr.push.apply(cr, r);
  }
  function B1(r) {
    for (var o = r; ; ) {
      if (o.flags & 16384) {
        var l = o.updateQueue;
        if (l !== null && (l = l.stores, l !== null)) for (var u = 0; u < l.length; u++) {
          var p = l[u], g = p.getSnapshot;
          p = p.value;
          try {
            if (!jr(g(), p)) return !1;
          } catch {
            return !1;
          }
        }
      }
      if (l = o.child, o.subtreeFlags & 16384 && l !== null) l.return = o, o = l;
      else {
        if (o === r) break;
        for (; o.sibling === null; ) {
          if (o.return === null || o.return === r) return !0;
          o = o.return;
        }
        o.sibling.return = o.return, o = o.sibling;
      }
    }
    return !0;
  }
  function no(r, o) {
    for (o &= ~Yc, o &= ~cs, r.suspendedLanes |= o, r.pingedLanes &= ~o, r = r.expirationTimes; 0 < o; ) {
      var l = 31 - Mr(o), u = 1 << l;
      r[l] = -1, o &= ~u;
    }
  }
  function ph(r) {
    if ((Ye & 6) !== 0) throw Error(n(327));
    _i();
    var o = Ca(r, 0);
    if ((o & 1) === 0) return dr(r, _t()), null;
    var l = ms(r, o);
    if (r.tag !== 0 && l === 2) {
      var u = Lu(r);
      u !== 0 && (o = u, l = Jc(r, u));
    }
    if (l === 1) throw l = yl, Io(r, 0), no(r, o), dr(r, _t()), l;
    if (l === 6) throw Error(n(345));
    return r.finishedWork = r.current.alternate, r.finishedLanes = o, Ao(r, cr, xn), dr(r, _t()), null;
  }
  function Zc(r, o) {
    var l = Ye;
    Ye |= 1;
    try {
      return r(o);
    } finally {
      Ye = l, Ye === 0 && (yi = _t() + 500, Wa && Qn());
    }
  }
  function Ro(r) {
    to !== null && to.tag === 0 && (Ye & 6) === 0 && _i();
    var o = Ye;
    Ye |= 1;
    var l = Or.transition, u = et;
    try {
      if (Or.transition = null, et = 1, r) return r();
    } finally {
      et = u, Or.transition = l, Ye = o, (Ye & 6) === 0 && Qn();
    }
  }
  function ed() {
    kr = bi.current, ct(bi);
  }
  function Io(r, o) {
    r.finishedWork = null, r.finishedLanes = 0;
    var l = r.timeoutHandle;
    if (l !== -1 && (r.timeoutHandle = -1, f1(l)), Ct !== null) for (l = Ct.return; l !== null; ) {
      var u = l;
      switch (uc(u), u.tag) {
        case 1:
          u = u.type.childContextTypes, u != null && za();
          break;
        case 3:
          hi(), ct(ar), ct(Wt), wc();
          break;
        case 5:
          _c(u);
          break;
        case 4:
          hi();
          break;
        case 13:
          ct(mt);
          break;
        case 19:
          ct(mt);
          break;
        case 10:
          hc(u.type._context);
          break;
        case 22:
        case 23:
          ed();
      }
      l = l.return;
    }
    if (Nt = r, Ct = r = oo(r.current, null), Mt = kr = o, Tt = 0, yl = null, Yc = cs = No = 0, cr = _l = null, Oo !== null) {
      for (o = 0; o < Oo.length; o++) if (l = Oo[o], u = l.interleaved, u !== null) {
        l.interleaved = null;
        var p = u.next, g = l.pending;
        if (g !== null) {
          var y = g.next;
          g.next = p, u.next = y;
        }
        l.pending = u;
      }
      Oo = null;
    }
    return r;
  }
  function gh(r, o) {
    do {
      var l = Ct;
      try {
        if (gc(), Za.current = ns, es) {
          for (var u = vt.memoizedState; u !== null; ) {
            var p = u.queue;
            p !== null && (p.pending = null), u = u.next;
          }
          es = !1;
        }
        if (Po = 0, Pt = Et = vt = null, pl = !1, gl = 0, Kc.current = null, l === null || l.return === null) {
          Tt = 1, yl = o, Ct = null;
          break;
        }
        e: {
          var g = r, y = l.return, C = l, O = o;
          if (o = Mt, C.flags |= 32768, O !== null && typeof O == "object" && typeof O.then == "function") {
            var H = O, ne = C, ie = ne.tag;
            if ((ne.mode & 1) === 0 && (ie === 0 || ie === 11 || ie === 15)) {
              var ee = ne.alternate;
              ee ? (ne.updateQueue = ee.updateQueue, ne.memoizedState = ee.memoizedState, ne.lanes = ee.lanes) : (ne.updateQueue = null, ne.memoizedState = null);
            }
            var pe = jg(y);
            if (pe !== null) {
              pe.flags &= -257, Fg(pe, y, C, g, o), pe.mode & 1 && Mg(g, H, o), o = pe, O = H;
              var ve = o.updateQueue;
              if (ve === null) {
                var _e = /* @__PURE__ */ new Set();
                _e.add(O), o.updateQueue = _e;
              } else ve.add(O);
              break e;
            } else {
              if ((o & 1) === 0) {
                Mg(g, H, o), td();
                break e;
              }
              O = Error(n(426));
            }
          } else if (gt && C.mode & 1) {
            var kt = jg(y);
            if (kt !== null) {
              (kt.flags & 65536) === 0 && (kt.flags |= 256), Fg(kt, y, C, g, o), fc(mi(O, C));
              break e;
            }
          }
          g = O = mi(O, C), Tt !== 4 && (Tt = 2), _l === null ? _l = [g] : _l.push(g), g = y;
          do {
            switch (g.tag) {
              case 3:
                g.flags |= 65536, o &= -o, g.lanes |= o;
                var j = Bg(g, O, o);
                ug(g, j);
                break e;
              case 1:
                C = O;
                var A = g.type, W = g.stateNode;
                if ((g.flags & 128) === 0 && (typeof A.getDerivedStateFromError == "function" || W !== null && typeof W.componentDidCatch == "function" && (eo === null || !eo.has(W)))) {
                  g.flags |= 65536, o &= -o, g.lanes |= o;
                  var se = Dg(g, C, o);
                  ug(g, se);
                  break e;
                }
            }
            g = g.return;
          } while (g !== null);
        }
        vh(l);
      } catch (ke) {
        o = ke, Ct === l && l !== null && (Ct = l = l.return);
        continue;
      }
      break;
    } while (!0);
  }
  function hh() {
    var r = us.current;
    return us.current = ns, r === null ? ns : r;
  }
  function td() {
    (Tt === 0 || Tt === 3 || Tt === 2) && (Tt = 4), Nt === null || (No & 268435455) === 0 && (cs & 268435455) === 0 || no(Nt, Mt);
  }
  function ms(r, o) {
    var l = Ye;
    Ye |= 2;
    var u = hh();
    (Nt !== r || Mt !== o) && (xn = null, Io(r, o));
    do
      try {
        D1();
        break;
      } catch (p) {
        gh(r, p);
      }
    while (!0);
    if (gc(), Ye = l, us.current = u, Ct !== null) throw Error(n(261));
    return Nt = null, Mt = 0, Tt;
  }
  function D1() {
    for (; Ct !== null; ) mh(Ct);
  }
  function M1() {
    for (; Ct !== null && !uy(); ) mh(Ct);
  }
  function mh(r) {
    var o = _h(r.alternate, r, kr);
    r.memoizedProps = r.pendingProps, o === null ? vh(r) : Ct = o, Kc.current = null;
  }
  function vh(r) {
    var o = r;
    do {
      var l = o.alternate;
      if (r = o.return, (o.flags & 32768) === 0) {
        if (l = L1(l, o, kr), l !== null) {
          Ct = l;
          return;
        }
      } else {
        if (l = P1(l, o), l !== null) {
          l.flags &= 32767, Ct = l;
          return;
        }
        if (r !== null) r.flags |= 32768, r.subtreeFlags = 0, r.deletions = null;
        else {
          Tt = 6, Ct = null;
          return;
        }
      }
      if (o = o.sibling, o !== null) {
        Ct = o;
        return;
      }
      Ct = o = r;
    } while (o !== null);
    Tt === 0 && (Tt = 5);
  }
  function Ao(r, o, l) {
    var u = et, p = Or.transition;
    try {
      Or.transition = null, et = 1, j1(r, o, l, u);
    } finally {
      Or.transition = p, et = u;
    }
    return null;
  }
  function j1(r, o, l, u) {
    do
      _i();
    while (to !== null);
    if ((Ye & 6) !== 0) throw Error(n(327));
    l = r.finishedWork;
    var p = r.finishedLanes;
    if (l === null) return null;
    if (r.finishedWork = null, r.finishedLanes = 0, l === r.current) throw Error(n(177));
    r.callbackNode = null, r.callbackPriority = 0;
    var g = l.lanes | l.childLanes;
    if (yy(r, g), r === Nt && (Ct = Nt = null, Mt = 0), (l.subtreeFlags & 2064) === 0 && (l.flags & 2064) === 0 || fs || (fs = !0, kh(_a, function() {
      return _i(), null;
    })), g = (l.flags & 15990) !== 0, (l.subtreeFlags & 15990) !== 0 || g) {
      g = Or.transition, Or.transition = null;
      var y = et;
      et = 1;
      var C = Ye;
      Ye |= 4, Kc.current = null, R1(r, l), ah(l, r), i1(tc), Ea = !!ec, tc = ec = null, r.current = l, I1(l), cy(), Ye = C, et = y, Or.transition = g;
    } else r.current = l;
    if (fs && (fs = !1, to = r, ps = p), g = r.pendingLanes, g === 0 && (eo = null), py(l.stateNode), dr(r, _t()), o !== null) for (u = r.onRecoverableError, l = 0; l < o.length; l++) p = o[l], u(p.value, { componentStack: p.stack, digest: p.digest });
    if (ds) throw ds = !1, r = Xc, Xc = null, r;
    return (ps & 1) !== 0 && r.tag !== 0 && _i(), g = r.pendingLanes, (g & 1) !== 0 ? r === Qc ? kl++ : (kl = 0, Qc = r) : kl = 0, Qn(), null;
  }
  function _i() {
    if (to !== null) {
      var r = ip(ps), o = Or.transition, l = et;
      try {
        if (Or.transition = null, et = 16 > r ? 16 : r, to === null) var u = !1;
        else {
          if (r = to, to = null, ps = 0, (Ye & 6) !== 0) throw Error(n(331));
          var p = Ye;
          for (Ye |= 4, me = r.current; me !== null; ) {
            var g = me, y = g.child;
            if ((me.flags & 16) !== 0) {
              var C = g.deletions;
              if (C !== null) {
                for (var O = 0; O < C.length; O++) {
                  var H = C[O];
                  for (me = H; me !== null; ) {
                    var ne = me;
                    switch (ne.tag) {
                      case 0:
                      case 11:
                      case 15:
                        bl(8, ne, g);
                    }
                    var ie = ne.child;
                    if (ie !== null) ie.return = ne, me = ie;
                    else for (; me !== null; ) {
                      ne = me;
                      var ee = ne.sibling, pe = ne.return;
                      if (rh(ne), ne === H) {
                        me = null;
                        break;
                      }
                      if (ee !== null) {
                        ee.return = pe, me = ee;
                        break;
                      }
                      me = pe;
                    }
                  }
                }
                var ve = g.alternate;
                if (ve !== null) {
                  var _e = ve.child;
                  if (_e !== null) {
                    ve.child = null;
                    do {
                      var kt = _e.sibling;
                      _e.sibling = null, _e = kt;
                    } while (_e !== null);
                  }
                }
                me = g;
              }
            }
            if ((g.subtreeFlags & 2064) !== 0 && y !== null) y.return = g, me = y;
            else e: for (; me !== null; ) {
              if (g = me, (g.flags & 2048) !== 0) switch (g.tag) {
                case 0:
                case 11:
                case 15:
                  bl(9, g, g.return);
              }
              var j = g.sibling;
              if (j !== null) {
                j.return = g.return, me = j;
                break e;
              }
              me = g.return;
            }
          }
          var A = r.current;
          for (me = A; me !== null; ) {
            y = me;
            var W = y.child;
            if ((y.subtreeFlags & 2064) !== 0 && W !== null) W.return = y, me = W;
            else e: for (y = A; me !== null; ) {
              if (C = me, (C.flags & 2048) !== 0) try {
                switch (C.tag) {
                  case 0:
                  case 11:
                  case 15:
                    ss(9, C);
                }
              } catch (ke) {
                bt(C, C.return, ke);
              }
              if (C === y) {
                me = null;
                break e;
              }
              var se = C.sibling;
              if (se !== null) {
                se.return = C.return, me = se;
                break e;
              }
              me = C.return;
            }
          }
          if (Ye = p, Qn(), Zr && typeof Zr.onPostCommitFiberRoot == "function") try {
            Zr.onPostCommitFiberRoot(ka, r);
          } catch {
          }
          u = !0;
        }
        return u;
      } finally {
        et = l, Or.transition = o;
      }
    }
    return !1;
  }
  function bh(r, o, l) {
    o = mi(l, o), o = Bg(r, o, 1), r = qn(r, o, 1), o = er(), r !== null && (Hi(r, 1, o), dr(r, o));
  }
  function bt(r, o, l) {
    if (r.tag === 3) bh(r, r, l);
    else for (; o !== null; ) {
      if (o.tag === 3) {
        bh(o, r, l);
        break;
      } else if (o.tag === 1) {
        var u = o.stateNode;
        if (typeof o.type.getDerivedStateFromError == "function" || typeof u.componentDidCatch == "function" && (eo === null || !eo.has(u))) {
          r = mi(l, r), r = Dg(o, r, 1), o = qn(o, r, 1), r = er(), o !== null && (Hi(o, 1, r), dr(o, r));
          break;
        }
      }
      o = o.return;
    }
  }
  function F1(r, o, l) {
    var u = r.pingCache;
    u !== null && u.delete(o), o = er(), r.pingedLanes |= r.suspendedLanes & l, Nt === r && (Mt & l) === l && (Tt === 4 || Tt === 3 && (Mt & 130023424) === Mt && 500 > _t() - Gc ? Io(r, 0) : Yc |= l), dr(r, o);
  }
  function yh(r, o) {
    o === 0 && ((r.mode & 1) === 0 ? o = 1 : (o = Sa, Sa <<= 1, (Sa & 130023424) === 0 && (Sa = 4194304)));
    var l = er();
    r = wn(r, o), r !== null && (Hi(r, o, l), dr(r, l));
  }
  function z1(r) {
    var o = r.memoizedState, l = 0;
    o !== null && (l = o.retryLane), yh(r, l);
  }
  function U1(r, o) {
    var l = 0;
    switch (r.tag) {
      case 13:
        var u = r.stateNode, p = r.memoizedState;
        p !== null && (l = p.retryLane);
        break;
      case 19:
        u = r.stateNode;
        break;
      default:
        throw Error(n(314));
    }
    u !== null && u.delete(o), yh(r, l);
  }
  var _h;
  _h = function(r, o, l) {
    if (r !== null) if (r.memoizedProps !== o.pendingProps || ar.current) ur = !0;
    else {
      if ((r.lanes & l) === 0 && (o.flags & 128) === 0) return ur = !1, O1(r, o, l);
      ur = (r.flags & 131072) !== 0;
    }
    else ur = !1, gt && (o.flags & 1048576) !== 0 && Zp(o, Ha, o.index);
    switch (o.lanes = 0, o.tag) {
      case 2:
        var u = o.type;
        ls(r, o), r = o.pendingProps;
        var p = si(o, Wt.current);
        gi(o, l), p = xc(null, o, u, r, p, l);
        var g = $c();
        return o.flags |= 1, typeof p == "object" && p !== null && typeof p.render == "function" && p.$$typeof === void 0 ? (o.tag = 1, o.memoizedState = null, o.updateQueue = null, sr(u) ? (g = !0, Ua(o)) : g = !1, o.memoizedState = p.state !== null && p.state !== void 0 ? p.state : null, bc(o), p.updater = os, o.stateNode = p, p._reactInternals = o, Nc(o, u, r, l), o = Bc(null, o, u, !0, g, l)) : (o.tag = 0, gt && g && sc(o), Zt(null, o, p, l), o = o.child), o;
      case 16:
        u = o.elementType;
        e: {
          switch (ls(r, o), r = o.pendingProps, p = u._init, u = p(u._payload), o.type = u, p = o.tag = V1(u), r = zr(u, r), p) {
            case 0:
              o = Ac(null, o, u, r, l);
              break e;
            case 1:
              o = Kg(null, o, u, r, l);
              break e;
            case 11:
              o = zg(null, o, u, r, l);
              break e;
            case 14:
              o = Ug(null, o, u, zr(u.type, r), l);
              break e;
          }
          throw Error(n(
            306,
            u,
            ""
          ));
        }
        return o;
      case 0:
        return u = o.type, p = o.pendingProps, p = o.elementType === u ? p : zr(u, p), Ac(r, o, u, p, l);
      case 1:
        return u = o.type, p = o.pendingProps, p = o.elementType === u ? p : zr(u, p), Kg(r, o, u, p, l);
      case 3:
        e: {
          if (Yg(o), r === null) throw Error(n(387));
          u = o.pendingProps, g = o.memoizedState, p = g.element, sg(r, o), Ja(o, u, null, l);
          var y = o.memoizedState;
          if (u = y.element, g.isDehydrated) if (g = { element: u, isDehydrated: !1, cache: y.cache, pendingSuspenseBoundaries: y.pendingSuspenseBoundaries, transitions: y.transitions }, o.updateQueue.baseState = g, o.memoizedState = g, o.flags & 256) {
            p = mi(Error(n(423)), o), o = Gg(r, o, u, l, p);
            break e;
          } else if (u !== p) {
            p = mi(Error(n(424)), o), o = Gg(r, o, u, l, p);
            break e;
          } else for (_r = Yn(o.stateNode.containerInfo.firstChild), yr = o, gt = !0, Fr = null, l = lg(o, null, u, l), o.child = l; l; ) l.flags = l.flags & -3 | 4096, l = l.sibling;
          else {
            if (di(), u === p) {
              o = Cn(r, o, l);
              break e;
            }
            Zt(r, o, u, l);
          }
          o = o.child;
        }
        return o;
      case 5:
        return dg(o), r === null && dc(o), u = o.type, p = o.pendingProps, g = r !== null ? r.memoizedProps : null, y = p.children, rc(u, p) ? y = null : g !== null && rc(u, g) && (o.flags |= 32), Hg(r, o), Zt(r, o, y, l), o.child;
      case 6:
        return r === null && dc(o), null;
      case 13:
        return Xg(r, o, l);
      case 4:
        return yc(o, o.stateNode.containerInfo), u = o.pendingProps, r === null ? o.child = fi(o, null, u, l) : Zt(r, o, u, l), o.child;
      case 11:
        return u = o.type, p = o.pendingProps, p = o.elementType === u ? p : zr(u, p), zg(r, o, u, p, l);
      case 7:
        return Zt(r, o, o.pendingProps, l), o.child;
      case 8:
        return Zt(r, o, o.pendingProps.children, l), o.child;
      case 12:
        return Zt(r, o, o.pendingProps.children, l), o.child;
      case 10:
        e: {
          if (u = o.type._context, p = o.pendingProps, g = o.memoizedProps, y = p.value, lt(Ga, u._currentValue), u._currentValue = y, g !== null) if (jr(g.value, y)) {
            if (g.children === p.children && !ar.current) {
              o = Cn(r, o, l);
              break e;
            }
          } else for (g = o.child, g !== null && (g.return = o); g !== null; ) {
            var C = g.dependencies;
            if (C !== null) {
              y = g.child;
              for (var O = C.firstContext; O !== null; ) {
                if (O.context === u) {
                  if (g.tag === 1) {
                    O = Sn(-1, l & -l), O.tag = 2;
                    var H = g.updateQueue;
                    if (H !== null) {
                      H = H.shared;
                      var ne = H.pending;
                      ne === null ? O.next = O : (O.next = ne.next, ne.next = O), H.pending = O;
                    }
                  }
                  g.lanes |= l, O = g.alternate, O !== null && (O.lanes |= l), mc(
                    g.return,
                    l,
                    o
                  ), C.lanes |= l;
                  break;
                }
                O = O.next;
              }
            } else if (g.tag === 10) y = g.type === o.type ? null : g.child;
            else if (g.tag === 18) {
              if (y = g.return, y === null) throw Error(n(341));
              y.lanes |= l, C = y.alternate, C !== null && (C.lanes |= l), mc(y, l, o), y = g.sibling;
            } else y = g.child;
            if (y !== null) y.return = g;
            else for (y = g; y !== null; ) {
              if (y === o) {
                y = null;
                break;
              }
              if (g = y.sibling, g !== null) {
                g.return = y.return, y = g;
                break;
              }
              y = y.return;
            }
            g = y;
          }
          Zt(r, o, p.children, l), o = o.child;
        }
        return o;
      case 9:
        return p = o.type, u = o.pendingProps.children, gi(o, l), p = Er(p), u = u(p), o.flags |= 1, Zt(r, o, u, l), o.child;
      case 14:
        return u = o.type, p = zr(u, o.pendingProps), p = zr(u.type, p), Ug(r, o, u, p, l);
      case 15:
        return Wg(r, o, o.type, o.pendingProps, l);
      case 17:
        return u = o.type, p = o.pendingProps, p = o.elementType === u ? p : zr(u, p), ls(r, o), o.tag = 1, sr(u) ? (r = !0, Ua(o)) : r = !1, gi(o, l), Ig(o, u, p), Nc(o, u, p, l), Bc(null, o, u, !0, r, l);
      case 19:
        return Jg(r, o, l);
      case 22:
        return Vg(r, o, l);
    }
    throw Error(n(156, o.tag));
  };
  function kh(r, o) {
    return ep(r, o);
  }
  function W1(r, o, l, u) {
    this.tag = r, this.key = l, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.ref = null, this.pendingProps = o, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = u, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
  }
  function Lr(r, o, l, u) {
    return new W1(r, o, l, u);
  }
  function rd(r) {
    return r = r.prototype, !(!r || !r.isReactComponent);
  }
  function V1(r) {
    if (typeof r == "function") return rd(r) ? 1 : 0;
    if (r != null) {
      if (r = r.$$typeof, r === be) return 11;
      if (r === ae) return 14;
    }
    return 2;
  }
  function oo(r, o) {
    var l = r.alternate;
    return l === null ? (l = Lr(r.tag, o, r.key, r.mode), l.elementType = r.elementType, l.type = r.type, l.stateNode = r.stateNode, l.alternate = r, r.alternate = l) : (l.pendingProps = o, l.type = r.type, l.flags = 0, l.subtreeFlags = 0, l.deletions = null), l.flags = r.flags & 14680064, l.childLanes = r.childLanes, l.lanes = r.lanes, l.child = r.child, l.memoizedProps = r.memoizedProps, l.memoizedState = r.memoizedState, l.updateQueue = r.updateQueue, o = r.dependencies, l.dependencies = o === null ? null : { lanes: o.lanes, firstContext: o.firstContext }, l.sibling = r.sibling, l.index = r.index, l.ref = r.ref, l;
  }
  function vs(r, o, l, u, p, g) {
    var y = 2;
    if (u = r, typeof r == "function") rd(r) && (y = 1);
    else if (typeof r == "string") y = 5;
    else e: switch (r) {
      case F:
        return Bo(l.children, p, g, o);
      case te:
        y = 8, p |= 8;
        break;
      case re:
        return r = Lr(12, l, o, p | 2), r.elementType = re, r.lanes = g, r;
      case we:
        return r = Lr(13, l, o, p), r.elementType = we, r.lanes = g, r;
      case De:
        return r = Lr(19, l, o, p), r.elementType = De, r.lanes = g, r;
      case he:
        return bs(l, p, g, o);
      default:
        if (typeof r == "object" && r !== null) switch (r.$$typeof) {
          case Se:
            y = 10;
            break e;
          case Pe:
            y = 9;
            break e;
          case be:
            y = 11;
            break e;
          case ae:
            y = 14;
            break e;
          case ge:
            y = 16, u = null;
            break e;
        }
        throw Error(n(130, r == null ? r : typeof r, ""));
    }
    return o = Lr(y, l, o, p), o.elementType = r, o.type = u, o.lanes = g, o;
  }
  function Bo(r, o, l, u) {
    return r = Lr(7, r, u, o), r.lanes = l, r;
  }
  function bs(r, o, l, u) {
    return r = Lr(22, r, u, o), r.elementType = he, r.lanes = l, r.stateNode = { isHidden: !1 }, r;
  }
  function nd(r, o, l) {
    return r = Lr(6, r, null, o), r.lanes = l, r;
  }
  function od(r, o, l) {
    return o = Lr(4, r.children !== null ? r.children : [], r.key, o), o.lanes = l, o.stateNode = { containerInfo: r.containerInfo, pendingChildren: null, implementation: r.implementation }, o;
  }
  function H1(r, o, l, u, p) {
    this.tag = o, this.containerInfo = r, this.finishedWork = this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.pendingContext = this.context = null, this.callbackPriority = 0, this.eventTimes = Pu(0), this.expirationTimes = Pu(-1), this.entangledLanes = this.finishedLanes = this.mutableReadLanes = this.expiredLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = Pu(0), this.identifierPrefix = u, this.onRecoverableError = p, this.mutableSourceEagerHydrationData = null;
  }
  function id(r, o, l, u, p, g, y, C, O) {
    return r = new H1(r, o, l, C, O), o === 1 ? (o = 1, g === !0 && (o |= 8)) : o = 0, g = Lr(3, null, null, o), r.current = g, g.stateNode = r, g.memoizedState = { element: u, isDehydrated: l, cache: null, transitions: null, pendingSuspenseBoundaries: null }, bc(g), r;
  }
  function K1(r, o, l) {
    var u = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return { $$typeof: I, key: u == null ? null : "" + u, children: r, containerInfo: o, implementation: l };
  }
  function wh(r) {
    if (!r) return Xn;
    r = r._reactInternals;
    e: {
      if (Co(r) !== r || r.tag !== 1) throw Error(n(170));
      var o = r;
      do {
        switch (o.tag) {
          case 3:
            o = o.stateNode.context;
            break e;
          case 1:
            if (sr(o.type)) {
              o = o.stateNode.__reactInternalMemoizedMergedChildContext;
              break e;
            }
        }
        o = o.return;
      } while (o !== null);
      throw Error(n(171));
    }
    if (r.tag === 1) {
      var l = r.type;
      if (sr(l)) return Qp(r, l, o);
    }
    return o;
  }
  function Sh(r, o, l, u, p, g, y, C, O) {
    return r = id(l, u, !0, r, p, g, y, C, O), r.context = wh(null), l = r.current, u = er(), p = ro(l), g = Sn(u, p), g.callback = o ?? null, qn(l, g, p), r.current.lanes = p, Hi(r, p, u), dr(r, u), r;
  }
  function ys(r, o, l, u) {
    var p = o.current, g = er(), y = ro(p);
    return l = wh(l), o.context === null ? o.context = l : o.pendingContext = l, o = Sn(g, y), o.payload = { element: r }, u = u === void 0 ? null : u, u !== null && (o.callback = u), r = qn(p, o, y), r !== null && (Vr(r, p, y, g), Qa(r, p, y)), y;
  }
  function _s(r) {
    if (r = r.current, !r.child) return null;
    switch (r.child.tag) {
      case 5:
        return r.child.stateNode;
      default:
        return r.child.stateNode;
    }
  }
  function Ch(r, o) {
    if (r = r.memoizedState, r !== null && r.dehydrated !== null) {
      var l = r.retryLane;
      r.retryLane = l !== 0 && l < o ? l : o;
    }
  }
  function ld(r, o) {
    Ch(r, o), (r = r.alternate) && Ch(r, o);
  }
  function Y1() {
    return null;
  }
  var xh = typeof reportError == "function" ? reportError : function(r) {
    console.error(r);
  };
  function ad(r) {
    this._internalRoot = r;
  }
  ks.prototype.render = ad.prototype.render = function(r) {
    var o = this._internalRoot;
    if (o === null) throw Error(n(409));
    ys(r, o, null, null);
  }, ks.prototype.unmount = ad.prototype.unmount = function() {
    var r = this._internalRoot;
    if (r !== null) {
      this._internalRoot = null;
      var o = r.containerInfo;
      Ro(function() {
        ys(null, r, null, null);
      }), o[bn] = null;
    }
  };
  function ks(r) {
    this._internalRoot = r;
  }
  ks.prototype.unstable_scheduleHydration = function(r) {
    if (r) {
      var o = sp();
      r = { blockedOn: null, target: r, priority: o };
      for (var l = 0; l < Vn.length && o !== 0 && o < Vn[l].priority; l++) ;
      Vn.splice(l, 0, r), l === 0 && dp(r);
    }
  };
  function sd(r) {
    return !(!r || r.nodeType !== 1 && r.nodeType !== 9 && r.nodeType !== 11);
  }
  function ws(r) {
    return !(!r || r.nodeType !== 1 && r.nodeType !== 9 && r.nodeType !== 11 && (r.nodeType !== 8 || r.nodeValue !== " react-mount-point-unstable "));
  }
  function $h() {
  }
  function G1(r, o, l, u, p) {
    if (p) {
      if (typeof u == "function") {
        var g = u;
        u = function() {
          var H = _s(y);
          g.call(H);
        };
      }
      var y = Sh(o, u, r, 0, null, !1, !1, "", $h);
      return r._reactRootContainer = y, r[bn] = y.current, il(r.nodeType === 8 ? r.parentNode : r), Ro(), y;
    }
    for (; p = r.lastChild; ) r.removeChild(p);
    if (typeof u == "function") {
      var C = u;
      u = function() {
        var H = _s(O);
        C.call(H);
      };
    }
    var O = id(r, 0, !1, null, null, !1, !1, "", $h);
    return r._reactRootContainer = O, r[bn] = O.current, il(r.nodeType === 8 ? r.parentNode : r), Ro(function() {
      ys(o, O, l, u);
    }), O;
  }
  function Ss(r, o, l, u, p) {
    var g = l._reactRootContainer;
    if (g) {
      var y = g;
      if (typeof p == "function") {
        var C = p;
        p = function() {
          var O = _s(y);
          C.call(O);
        };
      }
      ys(o, y, r, p);
    } else y = G1(l, o, r, p, u);
    return _s(y);
  }
  lp = function(r) {
    switch (r.tag) {
      case 3:
        var o = r.stateNode;
        if (o.current.memoizedState.isDehydrated) {
          var l = Vi(o.pendingLanes);
          l !== 0 && (Nu(o, l | 1), dr(o, _t()), (Ye & 6) === 0 && (yi = _t() + 500, Qn()));
        }
        break;
      case 13:
        Ro(function() {
          var u = wn(r, 1);
          if (u !== null) {
            var p = er();
            Vr(u, r, 1, p);
          }
        }), ld(r, 1);
    }
  }, Ru = function(r) {
    if (r.tag === 13) {
      var o = wn(r, 134217728);
      if (o !== null) {
        var l = er();
        Vr(o, r, 134217728, l);
      }
      ld(r, 134217728);
    }
  }, ap = function(r) {
    if (r.tag === 13) {
      var o = ro(r), l = wn(r, o);
      if (l !== null) {
        var u = er();
        Vr(l, r, o, u);
      }
      ld(r, o);
    }
  }, sp = function() {
    return et;
  }, up = function(r, o) {
    var l = et;
    try {
      return et = r, o();
    } finally {
      et = l;
    }
  }, xu = function(r, o, l) {
    switch (o) {
      case "input":
        if (Z(r, l), o = l.name, l.type === "radio" && o != null) {
          for (l = r; l.parentNode; ) l = l.parentNode;
          for (l = l.querySelectorAll("input[name=" + JSON.stringify("" + o) + '][type="radio"]'), o = 0; o < l.length; o++) {
            var u = l[o];
            if (u !== r && u.form === r.form) {
              var p = Fa(u);
              if (!p) throw Error(n(90));
              $(u), Z(u, p);
            }
          }
        }
        break;
      case "textarea":
        de(r, l);
        break;
      case "select":
        o = l.value, o != null && w(r, !!l.multiple, o, !1);
    }
  }, Yf = Zc, Gf = Ro;
  var X1 = { usingClientEntryPoint: !1, Events: [sl, li, Fa, Hf, Kf, Zc] }, wl = { findFiberByHostInstance: xo, bundleType: 0, version: "18.3.1", rendererPackageName: "react-dom" }, Q1 = { bundleType: wl.bundleType, version: wl.version, rendererPackageName: wl.rendererPackageName, rendererConfig: wl.rendererConfig, overrideHookState: null, overrideHookStateDeletePath: null, overrideHookStateRenamePath: null, overrideProps: null, overridePropsDeletePath: null, overridePropsRenamePath: null, setErrorHandler: null, setSuspenseHandler: null, scheduleUpdate: null, currentDispatcherRef: S.ReactCurrentDispatcher, findHostInstanceByFiber: function(r) {
    return r = qf(r), r === null ? null : r.stateNode;
  }, findFiberByHostInstance: wl.findFiberByHostInstance || Y1, findHostInstancesForRefresh: null, scheduleRefresh: null, scheduleRoot: null, setRefreshHandler: null, getCurrentFiber: null, reconcilerVersion: "18.3.1-next-f1338f8080-20240426" };
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
    var Cs = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!Cs.isDisabled && Cs.supportsFiber) try {
      ka = Cs.inject(Q1), Zr = Cs;
    } catch {
    }
  }
  return gr.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = X1, gr.createPortal = function(r, o) {
    var l = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
    if (!sd(o)) throw Error(n(200));
    return K1(r, o, null, l);
  }, gr.createRoot = function(r, o) {
    if (!sd(r)) throw Error(n(299));
    var l = !1, u = "", p = xh;
    return o != null && (o.unstable_strictMode === !0 && (l = !0), o.identifierPrefix !== void 0 && (u = o.identifierPrefix), o.onRecoverableError !== void 0 && (p = o.onRecoverableError)), o = id(r, 1, !1, null, null, l, !1, u, p), r[bn] = o.current, il(r.nodeType === 8 ? r.parentNode : r), new ad(o);
  }, gr.findDOMNode = function(r) {
    if (r == null) return null;
    if (r.nodeType === 1) return r;
    var o = r._reactInternals;
    if (o === void 0)
      throw typeof r.render == "function" ? Error(n(188)) : (r = Object.keys(r).join(","), Error(n(268, r)));
    return r = qf(o), r = r === null ? null : r.stateNode, r;
  }, gr.flushSync = function(r) {
    return Ro(r);
  }, gr.hydrate = function(r, o, l) {
    if (!ws(o)) throw Error(n(200));
    return Ss(null, r, o, !0, l);
  }, gr.hydrateRoot = function(r, o, l) {
    if (!sd(r)) throw Error(n(405));
    var u = l != null && l.hydratedSources || null, p = !1, g = "", y = xh;
    if (l != null && (l.unstable_strictMode === !0 && (p = !0), l.identifierPrefix !== void 0 && (g = l.identifierPrefix), l.onRecoverableError !== void 0 && (y = l.onRecoverableError)), o = Sh(o, null, r, 1, l ?? null, p, !1, g, y), r[bn] = o.current, il(r), u) for (r = 0; r < u.length; r++) l = u[r], p = l._getVersion, p = p(l._source), o.mutableSourceEagerHydrationData == null ? o.mutableSourceEagerHydrationData = [l, p] : o.mutableSourceEagerHydrationData.push(
      l,
      p
    );
    return new ks(o);
  }, gr.render = function(r, o, l) {
    if (!ws(o)) throw Error(n(200));
    return Ss(null, r, o, !1, l);
  }, gr.unmountComponentAtNode = function(r) {
    if (!ws(r)) throw Error(n(40));
    return r._reactRootContainer ? (Ro(function() {
      Ss(null, null, r, !1, function() {
        r._reactRootContainer = null, r[bn] = null;
      });
    }), !0) : !1;
  }, gr.unstable_batchedUpdates = Zc, gr.unstable_renderSubtreeIntoContainer = function(r, o, l, u) {
    if (!ws(l)) throw Error(n(200));
    if (r == null || r._reactInternals === void 0) throw Error(n(38));
    return Ss(r, o, l, !1, u);
  }, gr.version = "18.3.1-next-f1338f8080-20240426", gr;
}
var b0;
function Kb() {
  if (b0) return Td.exports;
  b0 = 1;
  function e() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(e);
      } catch (t) {
        console.error(t);
      }
  }
  return e(), Td.exports = SI(), Td.exports;
}
var y0;
function CI() {
  if (y0) return Ns;
  y0 = 1;
  var e = Kb();
  return Ns.createRoot = e.createRoot, Ns.hydrateRoot = e.hydrateRoot, Ns;
}
var xI = CI(), Fe = Wf();
function $I() {
  if (console && console.warn) {
    for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++)
      t[n] = arguments[n];
    Vo(t[0]) && (t[0] = `react-i18next:: ${t[0]}`), console.warn(...t);
  }
}
const _0 = {};
function lf() {
  for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++)
    t[n] = arguments[n];
  Vo(t[0]) && _0[t[0]] || (Vo(t[0]) && (_0[t[0]] = /* @__PURE__ */ new Date()), $I(...t));
}
const Yb = (e, t) => () => {
  if (e.isInitialized)
    t();
  else {
    const n = () => {
      setTimeout(() => {
        e.off("initialized", n);
      }, 0), t();
    };
    e.on("initialized", n);
  }
}, k0 = (e, t, n) => {
  e.loadNamespaces(t, Yb(e, n));
}, w0 = (e, t, n, i) => {
  Vo(n) && (n = [n]), n.forEach((a) => {
    e.options.ns.indexOf(a) < 0 && e.options.ns.push(a);
  }), e.loadLanguages(t, Yb(e, i));
}, EI = function(e, t) {
  let n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
  const i = t.languages[0], a = t.options ? t.options.fallbackLng : !1, s = t.languages[t.languages.length - 1];
  if (i.toLowerCase() === "cimode") return !0;
  const c = (f, d) => {
    const h = t.services.backendConnector.state[`${f}|${d}`];
    return h === -1 || h === 2;
  };
  return n.bindI18n && n.bindI18n.indexOf("languageChanging") > -1 && t.services.backendConnector.backend && t.isLanguageChangingTo && !c(t.isLanguageChangingTo, e) ? !1 : !!(t.hasResourceBundle(i, e) || !t.services.backendConnector.backend || t.options.resources && !t.options.partialBundledLanguages || c(i, e) && (!a || c(s, e)));
}, TI = function(e, t) {
  let n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
  return !t.languages || !t.languages.length ? (lf("i18n.languages were undefined or empty", t.languages), !0) : t.options.ignoreJSONStructure !== void 0 ? t.hasLoadedNamespace(e, {
    lng: n.lng,
    precheck: (a, s) => {
      if (n.bindI18n && n.bindI18n.indexOf("languageChanging") > -1 && a.services.backendConnector.backend && a.isLanguageChangingTo && !s(a.isLanguageChangingTo, e)) return !1;
    }
  }) : EI(e, t, n);
}, Vo = (e) => typeof e == "string", OI = (e) => typeof e == "object" && e !== null, LI = /&(?:amp|#38|lt|#60|gt|#62|apos|#39|quot|#34|nbsp|#160|copy|#169|reg|#174|hellip|#8230|#x2F|#47);/g, PI = {
  "&amp;": "&",
  "&#38;": "&",
  "&lt;": "<",
  "&#60;": "<",
  "&gt;": ">",
  "&#62;": ">",
  "&apos;": "'",
  "&#39;": "'",
  "&quot;": '"',
  "&#34;": '"',
  "&nbsp;": " ",
  "&#160;": " ",
  "&copy;": "©",
  "&#169;": "©",
  "&reg;": "®",
  "&#174;": "®",
  "&hellip;": "…",
  "&#8230;": "…",
  "&#x2F;": "/",
  "&#47;": "/"
}, NI = (e) => PI[e], RI = (e) => e.replace(LI, NI);
let af = {
  bindI18n: "languageChanged",
  bindI18nStore: "",
  transEmptyNodeValue: "",
  transSupportBasicHtmlNodes: !0,
  transWrapTextNodes: "",
  transKeepBasicHtmlNodesFor: ["br", "strong", "i", "p"],
  useSuspense: !0,
  unescape: RI
};
const II = function() {
  let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
  af = {
    ...af,
    ...e
  };
}, AI = () => af;
let Gb;
const BI = (e) => {
  Gb = e;
}, DI = () => Gb, MI = {
  type: "3rdParty",
  init(e) {
    II(e.options.react), BI(e);
  }
}, Xb = Fe.createContext();
class jI {
  constructor() {
    Eh(this, "getUsedNamespaces", () => Object.keys(this.usedNamespaces));
    this.usedNamespaces = {};
  }
  addUsedNamespaces(t) {
    t.forEach((n) => {
      this.usedNamespaces[n] || (this.usedNamespaces[n] = !0);
    });
  }
}
const FI = (e, t) => {
  const n = Fe.useRef();
  return Fe.useEffect(() => {
    n.current = e;
  }, [e, t]), n.current;
}, Qb = (e, t, n, i) => e.getFixedT(t, n, i), zI = (e, t, n, i) => Fe.useCallback(Qb(e, t, n, i), [e, t, n, i]), Fi = function(e) {
  let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
  const {
    i18n: n
  } = t, {
    i18n: i,
    defaultNS: a
  } = Fe.useContext(Xb) || {}, s = n || i || DI();
  if (s && !s.reportNamespaces && (s.reportNamespaces = new jI()), !s) {
    lf("You will need to pass in an i18next instance by using initReactI18next");
    const S = (I, F) => Vo(F) ? F : OI(F) && Vo(F.defaultValue) ? F.defaultValue : Array.isArray(I) ? I[I.length - 1] : I, B = [S, {}, !1];
    return B.t = S, B.i18n = {}, B.ready = !1, B;
  }
  s.options.react && s.options.react.wait !== void 0 && lf("It seems you are still using the old wait option, you may migrate to the new useSuspense behaviour.");
  const c = {
    ...AI(),
    ...s.options.react,
    ...t
  }, {
    useSuspense: f,
    keyPrefix: d
  } = c;
  let h = a || s.options && s.options.defaultNS;
  h = Vo(h) ? [h] : h || ["translation"], s.reportNamespaces.addUsedNamespaces && s.reportNamespaces.addUsedNamespaces(h);
  const m = (s.isInitialized || s.initializedStoreOnce) && h.every((S) => TI(S, s, c)), b = zI(s, t.lng || null, c.nsMode === "fallback" ? h : h[0], d), v = () => b, _ = () => Qb(s, t.lng || null, c.nsMode === "fallback" ? h : h[0], d), [x, T] = Fe.useState(v);
  let R = h.join();
  t.lng && (R = `${t.lng}${R}`);
  const D = FI(R), K = Fe.useRef(!0);
  Fe.useEffect(() => {
    const {
      bindI18n: S,
      bindI18nStore: B
    } = c;
    K.current = !0, !m && !f && (t.lng ? w0(s, t.lng, h, () => {
      K.current && T(_);
    }) : k0(s, h, () => {
      K.current && T(_);
    })), m && D && D !== R && K.current && T(_);
    const I = () => {
      K.current && T(_);
    };
    return S && s && s.on(S, I), B && s && s.store.on(B, I), () => {
      K.current = !1, S && s && S.split(" ").forEach((F) => s.off(F, I)), B && s && B.split(" ").forEach((F) => s.store.off(F, I));
    };
  }, [s, R]), Fe.useEffect(() => {
    K.current && m && T(v);
  }, [s, d, m]);
  const L = [x, s, m];
  if (L.t = x, L.i18n = s, L.ready = m, m || !m && !f) return L;
  throw new Promise((S) => {
    t.lng ? w0(s, t.lng, h, () => S()) : k0(s, h, () => S());
  });
};
function UI(e) {
  let {
    i18n: t,
    defaultNS: n,
    children: i
  } = e;
  const a = Fe.useMemo(() => ({
    i18n: t,
    defaultNS: n
  }), [t, n]);
  return Fe.createElement(Xb.Provider, {
    value: a
  }, i);
}
function Jb({ label: e, clearLabel: t, onSearch: n }) {
  const i = Fe.useRef(null), [a, s] = Fe.useState(""), [c, f] = Fe.useState(!1);
  return Fe.useEffect(() => {
    if (c) return;
    const d = setTimeout(() => n(a), 180);
    return () => clearTimeout(d);
  }, [a, c, n]), /* @__PURE__ */ M.jsxs("div", { className: "ap-search-field", children: [
    a ? /* @__PURE__ */ M.jsx(
      "button",
      {
        type: "button",
        className: "ap-search-clear",
        "aria-label": t,
        title: t,
        onClick: () => {
          var d;
          s(""), (d = i.current) == null || d.focus();
        },
        children: /* @__PURE__ */ M.jsx(
          "svg",
          {
            width: "16",
            height: "16",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "2",
            strokeLinecap: "round",
            "aria-hidden": "true",
            children: /* @__PURE__ */ M.jsx("path", { d: "m18 6-12 12M6 6l12 12" })
          }
        )
      }
    ) : /* @__PURE__ */ M.jsxs(
      "svg",
      {
        className: "ap-search-icon",
        width: "16",
        height: "16",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        strokeLinecap: "round",
        "aria-hidden": "true",
        children: [
          /* @__PURE__ */ M.jsx("circle", { cx: "11", cy: "11", r: "8" }),
          /* @__PURE__ */ M.jsx("path", { d: "m21 21-4.35-4.35" })
        ]
      }
    ),
    /* @__PURE__ */ M.jsx(
      "input",
      {
        ref: i,
        type: "search",
        "aria-label": e,
        placeholder: e,
        value: a,
        onChange: (d) => s(d.target.value),
        onCompositionStart: () => f(!0),
        onCompositionEnd: (d) => {
          s(d.currentTarget.value), f(!1);
        }
      }
    )
  ] });
}
function qs({ icon: e, label: t, options: n, multiple: i = !1, disabled: a = !1 }) {
  const s = Fe.useId(), c = Fe.useRef(null), [f, d] = Fe.useState(!1), h = f && !a;
  return /* @__PURE__ */ M.jsxs("div", { className: "ap-search-options", onBlur: (m) => {
    m.currentTarget.contains(m.relatedTarget) || d(!1);
  }, onKeyDown: (m) => {
    var b;
    h && m.key === "Escape" && (m.preventDefault(), m.stopPropagation(), d(!1), (b = c.current) == null || b.focus());
  }, children: [
    /* @__PURE__ */ M.jsx(
      "button",
      {
        ref: c,
        type: "button",
        disabled: a,
        className: "ap-search-action",
        "aria-label": t,
        title: t,
        "aria-expanded": h,
        "aria-controls": s,
        onClick: () => d((m) => !m),
        children: /* @__PURE__ */ M.jsx(
          "svg",
          {
            width: "16",
            height: "16",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "2",
            strokeLinecap: "round",
            "aria-hidden": "true",
            children: e === "filter" ? /* @__PURE__ */ M.jsx("path", { d: "M3 6h18M6 12h12M9 18h6" }) : /* @__PURE__ */ M.jsxs(M.Fragment, { children: [
              /* @__PURE__ */ M.jsx("path", { d: "M20 7h-9m3 10H5" }),
              /* @__PURE__ */ M.jsx("circle", { cx: "7", cy: "7", r: "3" }),
              /* @__PURE__ */ M.jsx("circle", { cx: "17", cy: "17", r: "3" })
            ] })
          }
        )
      }
    ),
    /* @__PURE__ */ M.jsx("div", { id: s, className: "ap-search-menu", role: i ? "group" : "radiogroup", "aria-label": t, hidden: !h, children: n.map((m) => /* @__PURE__ */ M.jsxs("label", { onMouseDown: (b) => b.preventDefault(), children: [
      /* @__PURE__ */ M.jsx("input", { type: i ? "checkbox" : "radio", name: s, checked: m.checked, onChange: m.select }),
      /* @__PURE__ */ M.jsx("span", { children: m.label }),
      /* @__PURE__ */ M.jsx(
        "svg",
        {
          className: "ap-option-check",
          width: "16",
          height: "16",
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          strokeWidth: "2",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          "aria-hidden": "true",
          children: /* @__PURE__ */ M.jsx("path", { d: "m5 12 4 4L19 6" })
        }
      )
    ] }, m.id)) })
  ] });
}
function qb(e, t) {
  const [n, i] = Fe.useState(() => {
    try {
      const a = localStorage.getItem(e);
      return t.find((s) => s === a) ?? t[0];
    } catch {
      return t[0];
    }
  });
  return [n, (a) => {
    i(a);
    try {
      localStorage.setItem(e, a);
    } catch {
    }
  }];
}
class Rr extends Error {
  constructor(t, n) {
    super(t), this.code = t, this.status = n;
  }
}
function In(e) {
  return typeof e == "object" && e !== null && !Array.isArray(e);
}
async function Zb(e, t) {
  const n = new AbortController();
  let i = !1;
  const a = () => n.abort();
  t != null && t.aborted && a(), t == null || t.addEventListener("abort", a, { once: !0 });
  const s = setTimeout(() => {
    i = !0, n.abort();
  }, 1e4);
  try {
    const c = await Dn.api.fetchApi(e, { signal: n.signal });
    if (!c.ok) throw new Rr("http", c.status);
    try {
      return await c.json();
    } catch (f) {
      throw n.signal.aborted ? f : new Rr("json");
    }
  } catch (c) {
    throw t != null && t.aborted ? new DOMException("Aborted", "AbortError") : i ? new Rr("timeout") : c instanceof Rr ? c : new Rr("network");
  } finally {
    clearTimeout(s), t == null || t.removeEventListener("abort", a);
  }
}
function Zs({ error: e, retry: t }) {
  const { t: n } = Fi(), i = e instanceof Rr ? e.code : "canvas";
  return /* @__PURE__ */ M.jsxs("div", { role: "alert", children: [
    /* @__PURE__ */ M.jsx("p", { children: n(`errors.${i}`, { defaultValue: n("errors.unknown"), status: e instanceof Rr ? e.status : "" }) }),
    t && /* @__PURE__ */ M.jsx("button", { onClick: t, children: n("actions.retry") })
  ] });
}
function WI() {
  return window.LiteGraph;
}
function ey(e, t, n = Dn, i = WI()) {
  var h;
  const a = n.canvas, s = a == null ? void 0 : a.graph;
  if (!n.isGraphReady || !s || a.read_only || a.selectOnly || !a.allow_interaction)
    throw new Error("CANVAS_UNAVAILABLE");
  if (!(i != null && i.registered_node_types[e])) throw new Error("NODE_NOT_REGISTERED");
  const c = a.canvas.getBoundingClientRect(), f = n.clientPosToCanvasPos(t ?? [c.left + c.width / 2, c.top + c.height / 2]);
  if (!f.every(Number.isFinite)) throw new Error("INVALID_POSITION");
  s.beforeChange(), a.emitBeforeChange();
  let d;
  try {
    if (d = i.createNode(e), !d) throw new Error("NODE_NOT_REGISTERED");
    if (d.pos = f, !s.add(d)) throw new Error("GRAPH_ADD_FAILED");
    return s.change(), d;
  } catch (m) {
    throw (d == null ? void 0 : d.graph) === s ? s.remove(d) : (h = d == null ? void 0 : d.onRemoved) == null || h.call(d), m;
  } finally {
    try {
      s.afterChange();
    } finally {
      a.emitAfterChange();
    }
  }
}
const sf = "application/x-astrophoto-resource+json";
function VI(e, t) {
  e.effectAllowed = "copy", e.setData(sf, JSON.stringify({ v: 1, kind: "node", nodeId: t }));
}
function HI(e, t) {
  const n = JSON.parse(e);
  if (!n || typeof n != "object" || !("v" in n) || n.v !== 1 || !("kind" in n) || n.kind !== "node" || !("nodeId" in n) || typeof n.nodeId != "string" || !t.has(n.nodeId))
    throw new Error("INVALID_DRAG");
  return n.nodeId;
}
function KI(e, t) {
  var c;
  const n = (c = Dn.canvas) == null ? void 0 : c.canvas;
  if (!n) return () => {
  };
  const i = (f) => {
    var d;
    return f.target === n && ((d = f.dataTransfer) == null ? void 0 : d.types.includes(sf));
  }, a = (f) => {
    i(f) && (f.preventDefault(), f.stopImmediatePropagation(), f.dataTransfer && (f.dataTransfer.dropEffect = "copy"));
  }, s = (f) => {
    if (i(f)) {
      f.preventDefault(), f.stopImmediatePropagation();
      try {
        ey(HI(f.dataTransfer.getData(sf), e), [f.clientX, f.clientY]), t(null);
      } catch (d) {
        t(d);
      }
    }
  };
  return n.addEventListener("dragover", a, !0), n.addEventListener("drop", s, !0), () => {
    n.removeEventListener("dragover", a, !0), n.removeEventListener("drop", s, !0);
  };
}
var YI = Kb();
const an = 16, S0 = (e, t, n) => Math.max(t, Math.min(e, n));
function GI({ node: e, anchor: t }) {
  const { t: n } = Fi(), i = Fe.useRef(null);
  Fe.useLayoutEffect(() => {
    const s = i.current;
    if (!s) return;
    const c = t.closest(".astrophoto-ui") ?? t, f = t.closest(".ap-scroll"), d = () => {
      const m = t.getBoundingClientRect(), b = f == null ? void 0 : f.getBoundingClientRect();
      if (!m.width || !m.height || m.bottom <= 0 || m.top >= window.innerHeight || b && (m.bottom <= b.top || m.top >= b.bottom)) {
        s.style.visibility = "hidden";
        return;
      }
      const { width: v, height: _ } = s.getBoundingClientRect(), x = c.getBoundingClientRect(), T = x.left - an - v, R = x.right + an, D = Dn.extensionManager.setting.get("Comfy.Sidebar.Location") === "right";
      let K = D ? T : R;
      D && T < an && R + v <= window.innerWidth - an && (K = R), !D && R + v > window.innerWidth - an && T >= an && (K = T), s.style.left = `${S0(K, an, window.innerWidth - v - an)}px`;
      const L = m.top + m.height / 2 - _ * 0.3;
      s.style.top = `${S0(L, an, window.innerHeight - _ - an)}px`, s.style.visibility = "visible";
    };
    d();
    const h = new ResizeObserver(d);
    return h.observe(s), c !== t && h.observe(c), window.addEventListener("resize", d), window.addEventListener("scroll", d, !0), () => {
      h.disconnect(), window.removeEventListener("resize", d), window.removeEventListener("scroll", d, !0);
    };
  }, [t]);
  const a = [[n("nodes.inputs"), e.inputs], [n("nodes.outputs"), e.outputs]];
  return YI.createPortal(
    /* @__PURE__ */ M.jsxs("aside", { className: "astrophoto-node-preview", ref: i, "aria-hidden": "true", children: [
      /* @__PURE__ */ M.jsxs("div", { className: "ap-preview-miniature", children: [
        /* @__PURE__ */ M.jsx("div", { className: "ap-preview-node-title", children: e.title }),
        /* @__PURE__ */ M.jsxs("div", { className: "ap-preview-sockets", children: [
          /* @__PURE__ */ M.jsx("div", { children: e.inputs.map(([s], c) => /* @__PURE__ */ M.jsx("span", { children: s }, c)) }),
          /* @__PURE__ */ M.jsx("div", { children: e.outputs.map(([s], c) => /* @__PURE__ */ M.jsx("span", { children: s }, c)) })
        ] })
      ] }),
      /* @__PURE__ */ M.jsxs("div", { className: "ap-preview-content", children: [
        /* @__PURE__ */ M.jsx("h3", { children: e.title }),
        e.description && /* @__PURE__ */ M.jsx("p", { children: e.description }),
        a.map(([s, c]) => c.length > 0 && /* @__PURE__ */ M.jsxs("div", { className: "ap-preview-ports", children: [
          /* @__PURE__ */ M.jsx("h4", { children: s }),
          /* @__PURE__ */ M.jsx("dl", { children: c.map(([f, d], h) => /* @__PURE__ */ M.jsxs("div", { children: [
            /* @__PURE__ */ M.jsx("dt", { children: f }),
            /* @__PURE__ */ M.jsx("dd", { children: d })
          ] }, h)) })
        ] }, s))
      ] })
    ] }),
    document.body
  );
}
function XI(e, t) {
  const n = [], i = /* @__PURE__ */ new Map();
  for (const a of e) {
    let s = n, c = "";
    for (const f of a.category.split("/").filter(Boolean)) {
      c += `/${f}`;
      let d = i.get(c);
      d || (d = { kind: "folder", key: c, label: f, children: [] }, i.set(c, d), s.push(d)), s = d.children;
    }
    s.push({ kind: "node", key: a.id, label: a.title, node: a });
  }
  if (t) {
    const a = (s) => s.sort((c, f) => t(c.label, f.label));
    a(n);
    for (const s of i.values()) a(s.children);
  }
  return n;
}
function QI({ node: e, level: t, selectNode: n, addNode: i, addLabel: a, previewEnabled: s }) {
  const [c, f] = Fe.useState(null), d = Fe.useRef(!1);
  Fe.useEffect(() => {
    s || f(null);
  }, [s]);
  const h = a(e.title);
  return /* @__PURE__ */ M.jsxs("li", { children: [
    /* @__PURE__ */ M.jsxs(
      "div",
      {
        className: "ap-tree-row ap-tree-leaf",
        onPointerEnter: (m) => {
          m.pointerType === "mouse" && s && !d.current && f(m.currentTarget);
        },
        onPointerLeave: () => f(null),
        children: [
          /* @__PURE__ */ M.jsxs(
            "button",
            {
              type: "button",
              className: "ap-resource",
              style: { paddingInlineStart: 8 + t * 24 },
              draggable: !0,
              onDragStart: (m) => {
                d.current = !0, f(null), VI(m.dataTransfer, e.id);
              },
              onDragEnd: () => {
                d.current = !1;
              },
              onClick: () => {
                f(null), n(e.id);
              },
              children: [
                /* @__PURE__ */ M.jsx("svg", { width: "16", height: "16", viewBox: "0 0 16 16", fill: "none", "aria-hidden": "true", children: /* @__PURE__ */ M.jsx(
                  "path",
                  {
                    stroke: "currentColor",
                    strokeLinecap: "round",
                    strokeWidth: "1.3",
                    d: "m11.2667 10.45-.0842.3156c-.143.5363-.6286.9094-1.18362.9094H4.6945c-.80486 0-1.39102-.7629-1.18364-1.5406l1.30667-4.90002c.143-.53625.62865-.90937 1.18364-.90937h5.46393c.7243 0 1.2518.68663 1.0652 1.38652l-.0301.11275M15.35 8.00001h-4.9m-6.73748 0H.65002"
                  }
                ) }),
                /* @__PURE__ */ M.jsx("span", { children: e.title })
              ]
            }
          ),
          /* @__PURE__ */ M.jsx(
            "button",
            {
              type: "button",
              className: "ap-tree-add",
              "aria-label": h,
              title: h,
              onClick: () => {
                f(null), i(e.id);
              },
              children: /* @__PURE__ */ M.jsx(
                "svg",
                {
                  width: "16",
                  height: "16",
                  viewBox: "0 0 24 24",
                  fill: "none",
                  stroke: "currentColor",
                  strokeWidth: "2",
                  strokeLinecap: "round",
                  "aria-hidden": "true",
                  children: /* @__PURE__ */ M.jsx("path", { d: "M12 5v14M5 12h14" })
                }
              )
            }
          )
        ]
      }
    ),
    s && c && /* @__PURE__ */ M.jsx(GI, { anchor: c, node: e })
  ] });
}
function ty({ entries: e, level: t = 0, ...n }) {
  const i = { paddingInlineStart: 8 + t * 24 };
  return /* @__PURE__ */ M.jsx("ul", { className: "ap-node-tree", role: "list", children: e.map((a) => {
    if (a.kind === "folder") {
      const s = n.isExpanded(a.key);
      return /* @__PURE__ */ M.jsxs("li", { children: [
        /* @__PURE__ */ M.jsxs(
          "button",
          {
            type: "button",
            className: "ap-tree-row ap-tree-folder",
            style: i,
            "aria-expanded": s,
            title: a.label,
            onClick: () => n.setExpanded(a.key, !s),
            onKeyDown: (c) => {
              c.key !== "ArrowLeft" && c.key !== "ArrowRight" || (c.preventDefault(), c.stopPropagation(), n.setExpanded(a.key, c.key === "ArrowRight"));
            },
            children: [
              /* @__PURE__ */ M.jsx(
                "svg",
                {
                  className: "ap-tree-chevron",
                  width: "16",
                  height: "16",
                  viewBox: "0 0 24 24",
                  fill: "none",
                  stroke: "currentColor",
                  strokeWidth: "2",
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                  "aria-hidden": "true",
                  children: /* @__PURE__ */ M.jsx("path", { d: "m6 9 6 6 6-6" })
                }
              ),
              /* @__PURE__ */ M.jsx(
                "svg",
                {
                  width: "16",
                  height: "16",
                  viewBox: "0 0 24 24",
                  fill: "none",
                  stroke: "currentColor",
                  strokeWidth: "2",
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                  "aria-hidden": "true",
                  children: /* @__PURE__ */ M.jsx("path", { d: "M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-8a2 2 0 0 1-1.6-.8l-.8-1.1A2 2 0 0 0 8 3.3H4a2 2 0 0 0-2 2V18a2 2 0 0 0 2 2Z" })
                }
              ),
              /* @__PURE__ */ M.jsx("span", { children: a.label })
            ]
          }
        ),
        s && /* @__PURE__ */ M.jsx(ty, { entries: a.children, level: t + 1, ...n })
      ] }, `folder:${a.key}`);
    }
    return /* @__PURE__ */ M.jsx(QI, { node: a.node, level: t, ...n }, `node:${a.key}`);
  }) });
}
const C0 = ["original", "alphabetical"];
function JI({ active: e, resource: t, refresh: n }) {
  const { t: i, i18n: a } = Fi(), [s, c] = Fe.useState(""), [f, d] = Fe.useState(() => /* @__PURE__ */ new Set()), [h, m] = Fe.useState(() => /* @__PURE__ */ new Set()), b = Fe.useCallback((ae) => {
    c(ae), m(/* @__PURE__ */ new Set());
  }, []), [v, _] = Fe.useState([]), [x, T] = qb("AstroPhoto.Nodes.Sort", C0), [R, D] = Fe.useState(null), [K, L] = Fe.useState(null), S = Fe.useMemo(() => new Set(t.state === "ready" ? t.data.map((ae) => ae.id) : []), [t]);
  Fe.useEffect(() => KI(S, (ae) => L({ error: ae })), [S]);
  const B = t.state === "ready" ? t.data : [], I = [...new Set(B.map((ae) => ae.category))], F = I.filter((ae) => v.includes(ae)), te = (ae) => ae || i("nodes.uncategorized"), re = s.trim().toLocaleLowerCase(), Se = B.filter((ae) => (F.length === 0 || F.includes(ae.category)) && [ae.id, ae.title, ae.category, ...ae.aliases, ae.description].join(" ").toLocaleLowerCase().includes(re)), Pe = XI(Se, x === "alphabetical" ? (ae, ge) => ae.localeCompare(ge, a.resolvedLanguage) : void 0), be = (ae, ge) => {
    (re ? m : d)((V) => {
      const oe = new Set(V);
      return (re ? !ge : ge) ? oe.add(ae) : oe.delete(ae), oe;
    });
  }, we = B.find((ae) => ae.id === R), De = (ae) => {
    try {
      ey(ae), L({ error: null });
    } catch (ge) {
      L({ error: ge });
    }
  };
  return /* @__PURE__ */ M.jsxs(M.Fragment, { children: [
    /* @__PURE__ */ M.jsxs("div", { className: "ap-search-toolbar", children: [
      /* @__PURE__ */ M.jsx(Jb, { label: i("nodes.search"), clearLabel: i("browse.clear"), onSearch: b }),
      /* @__PURE__ */ M.jsx(qs, { icon: "filter", label: i("browse.filter"), multiple: !0, disabled: I.length === 0, options: [
        { id: "all", label: i("browse.allCategories"), checked: F.length === 0, select: () => _([]) },
        ...I.map((ae) => ({
          id: `category:${ae}`,
          label: te(ae),
          checked: F.includes(ae),
          select: () => _(F.includes(ae) ? F.filter((ge) => ge !== ae) : [...F, ae])
        }))
      ] }),
      /* @__PURE__ */ M.jsx(qs, { icon: "sort", label: i("browse.sort"), options: C0.map((ae) => ({
        id: ae,
        label: i(`browse.${ae}`),
        checked: x === ae,
        select: () => T(ae)
      })) })
    ] }),
    t.state === "loading" && /* @__PURE__ */ M.jsx("p", { role: "status", children: i("states.loading") }),
    t.state === "error" && /* @__PURE__ */ M.jsx(Zs, { error: t.error, retry: n }),
    t.state === "ready" && /* @__PURE__ */ M.jsxs(M.Fragment, { children: [
      /* @__PURE__ */ M.jsx("div", { hidden: !!we, className: "ap-scroll", children: B.length === 0 ? /* @__PURE__ */ M.jsx("p", { children: i("nodes.empty") }) : Se.length === 0 ? /* @__PURE__ */ M.jsx("p", { children: i("nodes.noResults") }) : /* @__PURE__ */ M.jsx(
        ty,
        {
          entries: Pe,
          isExpanded: (ae) => re ? !h.has(ae) : f.has(ae),
          setExpanded: be,
          selectNode: D,
          addNode: De,
          addLabel: (ae) => i("nodes.addNamed", { name: ae }),
          previewEnabled: e && !we
        }
      ) }),
      we && /* @__PURE__ */ M.jsxs("div", { className: "ap-scroll", children: [
        /* @__PURE__ */ M.jsx("button", { onClick: () => D(null), children: i("actions.back") }),
        /* @__PURE__ */ M.jsx("h2", { children: we.title }),
        /* @__PURE__ */ M.jsx("code", { children: we.id }),
        /* @__PURE__ */ M.jsx("p", { children: we.description || i("nodes.noDescription") }),
        /* @__PURE__ */ M.jsx("p", { children: i("nodes.registered") }),
        /* @__PURE__ */ M.jsx("h3", { children: i("nodes.inputs") }),
        /* @__PURE__ */ M.jsx("dl", { children: we.inputs.map(([ae, ge]) => /* @__PURE__ */ M.jsxs("div", { children: [
          /* @__PURE__ */ M.jsx("dt", { children: ae }),
          /* @__PURE__ */ M.jsx("dd", { children: ge })
        ] }, ae)) }),
        /* @__PURE__ */ M.jsx("h3", { children: i("nodes.outputs") }),
        /* @__PURE__ */ M.jsx("dl", { children: we.outputs.map(([ae, ge]) => /* @__PURE__ */ M.jsxs("div", { children: [
          /* @__PURE__ */ M.jsx("dt", { children: ae }),
          /* @__PURE__ */ M.jsx("dd", { children: ge })
        ] }, ae)) }),
        /* @__PURE__ */ M.jsx("p", { children: i("nodes.dependencies") }),
        /* @__PURE__ */ M.jsx("p", { children: i("nodes.helpUnavailable") }),
        /* @__PURE__ */ M.jsx("button", { onClick: () => De(we.id), children: i("nodes.add") })
      ] })
    ] }),
    K && (K.error ? /* @__PURE__ */ M.jsx(Zs, { error: K.error }) : /* @__PURE__ */ M.jsx("p", { role: "status", children: i("nodes.created") }))
  ] });
}
const qI = ["all", "light", "dark", "flat", "bias", "darkFlat"], x0 = ["newest", "oldest", "name"];
function ZI({ status: e, refresh: t }) {
  var h;
  const { t: n } = Fi(), [i, a] = Fe.useState(""), [s, c] = Fe.useState("all"), [f, d] = qb("AstroPhoto.Assets.Sort", x0);
  return /* @__PURE__ */ M.jsxs(M.Fragment, { children: [
    /* @__PURE__ */ M.jsxs("div", { className: "ap-search-toolbar", children: [
      /* @__PURE__ */ M.jsx(Jb, { label: n("assets.search"), clearLabel: n("browse.clear"), onSearch: a }),
      /* @__PURE__ */ M.jsx(qs, { icon: "filter", label: n("assets.frameType"), options: qI.map((m) => ({
        id: m,
        label: n(`assets.${m}`),
        checked: s === m,
        select: () => c(m)
      })) }),
      /* @__PURE__ */ M.jsx(qs, { icon: "sort", label: n("browse.sort"), options: x0.map((m) => ({
        id: m,
        label: n(`browse.${m}`),
        checked: f === m,
        select: () => d(m)
      })) })
    ] }),
    /* @__PURE__ */ M.jsxs("div", { className: "ap-scroll", children: [
      /* @__PURE__ */ M.jsx("button", { disabled: !0, "aria-describedby": "ap-asset-reason", children: n("assets.import") }),
      e.state === "loading" && /* @__PURE__ */ M.jsx("p", { role: "status", children: n("states.loading") }),
      e.state === "error" && /* @__PURE__ */ M.jsx(Zs, { error: e.error, retry: t }),
      /* @__PURE__ */ M.jsx("h2", { children: n("assets.sessions") }),
      /* @__PURE__ */ M.jsx("p", { children: n("assets.noSessions") }),
      /* @__PURE__ */ M.jsx("h2", { children: n("assets.library") }),
      /* @__PURE__ */ M.jsx("p", { id: "ap-asset-reason", children: n("assets.unavailable") }),
      e.state === "ready" && /* @__PURE__ */ M.jsx("p", { children: n((h = e.data.capabilities.assets) != null && h.available ? "assets.adapterMissing" : "assets.serviceMissing") }),
      i && /* @__PURE__ */ M.jsx("p", { children: n("assets.searchPending", { query: i }) })
    ] })
  ] });
}
const e4 = ["software", "equipment", "observing-site", "knowledge", "memory", "agent", "system"], Pd = {
  software: "software",
  equipment: "assets",
  "observing-site": "assets",
  knowledge: "knowledge",
  memory: "memory"
};
function t4({ status: e, refresh: t }) {
  var c;
  const { t: n } = Fi(), [i, a] = Fe.useState(null), s = (f) => f === "system" ? e.state === "ready" ? "partial" : e.state : "planned";
  return /* @__PURE__ */ M.jsxs(M.Fragment, { children: [
    /* @__PURE__ */ M.jsx("div", { hidden: i !== null, className: "ap-scroll", children: e4.map((f) => /* @__PURE__ */ M.jsxs("button", { className: "ap-module", onClick: () => a(f), children: [
      /* @__PURE__ */ M.jsx("strong", { children: n(`modules.${f}.title`) }),
      /* @__PURE__ */ M.jsx("small", { children: n(`modules.${f}.description`) }),
      /* @__PURE__ */ M.jsx("small", { children: n(`states.${s(f)}`) })
    ] }, f)) }),
    i && /* @__PURE__ */ M.jsxs("div", { className: "ap-scroll", children: [
      /* @__PURE__ */ M.jsx("button", { onClick: () => a(null), children: n("actions.back") }),
      /* @__PURE__ */ M.jsx("h2", { children: n(`modules.${i}.title`) }),
      /* @__PURE__ */ M.jsx("p", { children: n(`modules.${i}.description`) }),
      /* @__PURE__ */ M.jsx("p", { children: n(`states.${s(i)}`) }),
      i !== "system" && /* @__PURE__ */ M.jsx("p", { children: n(i === "agent" ? "settings.agentNote" : "settings.plannedNote") }),
      i !== "system" && Pd[i] && e.state === "ready" && /* @__PURE__ */ M.jsxs("p", { children: [
        n("settings.backendCapability"),
        ": ",
        Pd[i],
        " — ",
        n((c = e.data.capabilities[Pd[i]]) != null && c.available ? "states.available" : "states.unavailable")
      ] }),
      i === "system" && /* @__PURE__ */ M.jsxs(M.Fragment, { children: [
        /* @__PURE__ */ M.jsx("button", { onClick: t, children: n("actions.refresh") }),
        e.state === "error" && /* @__PURE__ */ M.jsx(Zs, { error: e.error, retry: t }),
        e.state === "loading" && /* @__PURE__ */ M.jsx("p", { role: "status", children: n("states.loading") }),
        e.state === "ready" && /* @__PURE__ */ M.jsxs(M.Fragment, { children: [
          /* @__PURE__ */ M.jsxs("dl", { children: [
            /* @__PURE__ */ M.jsxs("div", { children: [
              /* @__PURE__ */ M.jsx("dt", { children: n("settings.version") }),
              /* @__PURE__ */ M.jsx("dd", { children: e.data.extension.version })
            ] }),
            /* @__PURE__ */ M.jsxs("div", { children: [
              /* @__PURE__ */ M.jsx("dt", { children: n("settings.api") }),
              /* @__PURE__ */ M.jsx("dd", { children: e.data.api_version })
            ] }),
            /* @__PURE__ */ M.jsxs("div", { children: [
              /* @__PURE__ */ M.jsx("dt", { children: n("settings.status") }),
              /* @__PURE__ */ M.jsx("dd", { children: e.data.status })
            ] }),
            /* @__PURE__ */ M.jsxs("div", { children: [
              /* @__PURE__ */ M.jsx("dt", { children: n("settings.nodeRegistered") }),
              /* @__PURE__ */ M.jsx("dd", { children: n(e.data.runtime.node_registered ? "states.available" : "states.unavailable") })
            ] })
          ] }),
          /* @__PURE__ */ M.jsx("h3", { children: n("settings.capabilities") }),
          Object.entries(e.data.capabilities).map(([f, d]) => /* @__PURE__ */ M.jsxs("p", { children: [
            /* @__PURE__ */ M.jsx("code", { children: f }),
            " — ",
            n(d.available ? "states.available" : "states.unavailable"),
            d.reason && ` (${d.reason})`
          ] }, f)),
          /* @__PURE__ */ M.jsx("p", { children: n("settings.statusBoundary") })
        ] })
      ] })
    ] })
  ] });
}
function $0(e) {
  const [t, n] = Fe.useState({ state: "loading" }), [i, a] = Fe.useState(0);
  return Fe.useEffect(() => {
    const s = new AbortController();
    return n({ state: "loading" }), e(s.signal).then((c) => {
      s.signal.aborted || n({ state: "ready", data: c });
    }, (c) => {
      s.signal.aborted || n({ state: "error", error: c });
    }), () => s.abort();
  }, [e, i]), { resource: t, refresh: () => a((s) => s + 1) };
}
function r4(e) {
  if (!In(e)) throw new Rr("schema");
  return Object.entries(e).filter(([t, n]) => In(n) && (n.python_module === "custom_nodes.ComfyUI_AstroPhoto" || t === "vue-basic" && n.python_module === void 0)).map(([t, n]) => {
    const i = n;
    if (typeof i.name != "string" || !Array.isArray(i.output) || !i.output.every((s) => typeof s == "string") || !In(i.input)) throw new Rr("schema");
    const a = [];
    for (const s of ["required", "optional"]) {
      const c = i.input[s];
      if (c !== void 0) {
        if (!In(c)) throw new Rr("schema");
        for (const [f, d] of Object.entries(c)) {
          if (!Array.isArray(d) || !(typeof d[0] == "string" || Array.isArray(d[0]))) throw new Rr("schema");
          a.push([f, Array.isArray(d[0]) ? "COMBO" : d[0]]);
        }
      }
    }
    return {
      id: t,
      title: typeof i.display_name == "string" ? i.display_name : t,
      description: typeof i.description == "string" ? i.description : "",
      category: typeof i.category == "string" ? i.category : "",
      aliases: Array.isArray(i.search_aliases) ? i.search_aliases.filter((s) => typeof s == "string") : [],
      inputs: a,
      outputs: i.output.map((s, c) => [Array.isArray(i.output_name) && typeof i.output_name[c] == "string" ? i.output_name[c] : String(c), s])
    };
  });
}
async function n4(e) {
  return r4(await Zb("/object_info", e));
}
function o4(e) {
  if (!In(e) || !In(e.extension) || e.extension.id !== "ComfyUI_AstroPhoto" || typeof e.extension.version != "string" || e.api_version !== "v1" || !["ok", "degraded"].includes(String(e.status)) || !In(e.runtime) || typeof e.runtime.node_registered != "boolean" || typeof e.runtime.routes_registered != "boolean" || !In(e.capabilities) || !Object.values(e.capabilities).every((t) => In(t) && typeof t.available == "boolean" && (t.reason === null || typeof t.reason == "string")))
    throw new Rr("schema");
  return e;
}
async function i4(e) {
  return o4(await Zb("/astrophoto/v1/status", e));
}
const wi = ["nodes", "assets", "settings"];
function l4() {
  const { t: e } = Fi(), [t, n] = Fe.useState("assets"), { resource: i, refresh: a } = $0(n4), { resource: s, refresh: c } = $0(i4), f = e(t === "nodes" ? "nodes.refresh" : "assets.refreshStatus");
  return /* @__PURE__ */ M.jsxs(M.Fragment, { children: [
    /* @__PURE__ */ M.jsxs("header", { children: [
      /* @__PURE__ */ M.jsx("strong", { children: e("nav.title") }),
      t !== "settings" && /* @__PURE__ */ M.jsx(
        "button",
        {
          className: "ap-refresh-button",
          type: "button",
          onClick: t === "nodes" ? a : c,
          "aria-label": f,
          title: f,
          children: /* @__PURE__ */ M.jsxs(
            "svg",
            {
              width: "16",
              height: "16",
              viewBox: "0 0 24 24",
              fill: "none",
              stroke: "currentColor",
              strokeWidth: "2",
              strokeLinecap: "round",
              strokeLinejoin: "round",
              "aria-hidden": "true",
              children: [
                /* @__PURE__ */ M.jsx("path", { d: "M3 12a9 9 0 0 1 9-9a9.75 9.75 0 0 1 6.74 2.74L21 8" }),
                /* @__PURE__ */ M.jsx("path", { d: "M21 3v5h-5m5 4a9 9 0 0 1-9 9a9.75 9.75 0 0 1-6.74-2.74L3 16" }),
                /* @__PURE__ */ M.jsx("path", { d: "M8 16H3v5" })
              ]
            }
          )
        }
      )
    ] }),
    /* @__PURE__ */ M.jsx("div", { className: "ap-tab-scroll", children: /* @__PURE__ */ M.jsx("div", { className: "ap-tabs", role: "tablist", "aria-label": e("nav.label"), children: wi.map((d, h) => {
      const m = d === t;
      return /* @__PURE__ */ M.jsx(
        "button",
        {
          id: `ap-tab-${d}`,
          type: "button",
          role: "tab",
          "aria-selected": m,
          "aria-controls": `ap-panel-${d}`,
          "data-state": m ? "active" : "inactive",
          tabIndex: m ? 0 : -1,
          onClick: () => n(d),
          onKeyDown: (b) => {
            var _, x;
            let v;
            switch (b.key) {
              case "ArrowRight":
              case "ArrowDown":
                v = (h + 1) % wi.length;
                break;
              case "ArrowLeft":
              case "ArrowUp":
                v = (h - 1 + wi.length) % wi.length;
                break;
              case "Home":
                v = 0;
                break;
              case "End":
                v = wi.length - 1;
                break;
              default:
                return;
            }
            b.preventDefault(), (x = (_ = b.currentTarget.parentElement) == null ? void 0 : _.querySelectorAll('[role="tab"]')[v]) == null || x.focus();
          },
          children: e(`nav.${d}`)
        },
        d
      );
    }) }) }),
    wi.map((d) => /* @__PURE__ */ M.jsx("section", { id: `ap-panel-${d}`, role: "tabpanel", "aria-labelledby": `ap-tab-${d}`, hidden: t !== d, children: d === "nodes" ? /* @__PURE__ */ M.jsx(JI, { active: t === "nodes", resource: i, refresh: a }) : d === "assets" ? /* @__PURE__ */ M.jsx(ZI, { status: s, refresh: c }) : /* @__PURE__ */ M.jsx(t4, { status: s, refresh: c }) }, d))
  ] });
}
const Ne = (e) => typeof e == "string", Tl = () => {
  let e, t;
  const n = new Promise((i, a) => {
    e = i, t = a;
  });
  return n.resolve = e, n.reject = t, n;
}, E0 = (e) => e == null ? "" : "" + e, a4 = (e, t, n) => {
  e.forEach((i) => {
    t[i] && (n[i] = t[i]);
  });
}, s4 = /###/g, T0 = (e) => e && e.indexOf("###") > -1 ? e.replace(s4, ".") : e, O0 = (e) => !e || Ne(e), Wl = (e, t, n) => {
  const i = Ne(t) ? t.split(".") : t;
  let a = 0;
  for (; a < i.length - 1; ) {
    if (O0(e)) return {};
    const s = T0(i[a]);
    !e[s] && n && (e[s] = new n()), Object.prototype.hasOwnProperty.call(e, s) ? e = e[s] : e = {}, ++a;
  }
  return O0(e) ? {} : {
    obj: e,
    k: T0(i[a])
  };
}, L0 = (e, t, n) => {
  const {
    obj: i,
    k: a
  } = Wl(e, t, Object);
  if (i !== void 0 || t.length === 1) {
    i[a] = n;
    return;
  }
  let s = t[t.length - 1], c = t.slice(0, t.length - 1), f = Wl(e, c, Object);
  for (; f.obj === void 0 && c.length; )
    s = `${c[c.length - 1]}.${s}`, c = c.slice(0, c.length - 1), f = Wl(e, c, Object), f && f.obj && typeof f.obj[`${f.k}.${s}`] < "u" && (f.obj = void 0);
  f.obj[`${f.k}.${s}`] = n;
}, u4 = (e, t, n, i) => {
  const {
    obj: a,
    k: s
  } = Wl(e, t, Object);
  a[s] = a[s] || [], a[s].push(n);
}, eu = (e, t) => {
  const {
    obj: n,
    k: i
  } = Wl(e, t);
  if (n)
    return n[i];
}, c4 = (e, t, n) => {
  const i = eu(e, n);
  return i !== void 0 ? i : eu(t, n);
}, ry = (e, t, n) => {
  for (const i in t)
    i !== "__proto__" && i !== "constructor" && (i in e ? Ne(e[i]) || e[i] instanceof String || Ne(t[i]) || t[i] instanceof String ? n && (e[i] = t[i]) : ry(e[i], t[i], n) : e[i] = t[i]);
  return e;
}, Si = (e) => e.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
var d4 = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
  "/": "&#x2F;"
};
const f4 = (e) => Ne(e) ? e.replace(/[&<>"'\/]/g, (t) => d4[t]) : e;
class p4 {
  constructor(t) {
    this.capacity = t, this.regExpMap = /* @__PURE__ */ new Map(), this.regExpQueue = [];
  }
  getRegExp(t) {
    const n = this.regExpMap.get(t);
    if (n !== void 0)
      return n;
    const i = new RegExp(t);
    return this.regExpQueue.length === this.capacity && this.regExpMap.delete(this.regExpQueue.shift()), this.regExpMap.set(t, i), this.regExpQueue.push(t), i;
  }
}
const g4 = [" ", ",", "?", "!", ";"], h4 = new p4(20), m4 = (e, t, n) => {
  t = t || "", n = n || "";
  const i = g4.filter((c) => t.indexOf(c) < 0 && n.indexOf(c) < 0);
  if (i.length === 0) return !0;
  const a = h4.getRegExp(`(${i.map((c) => c === "?" ? "\\?" : c).join("|")})`);
  let s = !a.test(e);
  if (!s) {
    const c = e.indexOf(n);
    c > 0 && !a.test(e.substring(0, c)) && (s = !0);
  }
  return s;
}, uf = function(e, t) {
  let n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : ".";
  if (!e) return;
  if (e[t]) return e[t];
  const i = t.split(n);
  let a = e;
  for (let s = 0; s < i.length; ) {
    if (!a || typeof a != "object")
      return;
    let c, f = "";
    for (let d = s; d < i.length; ++d)
      if (d !== s && (f += n), f += i[d], c = a[f], c !== void 0) {
        if (["string", "number", "boolean"].indexOf(typeof c) > -1 && d < i.length - 1)
          continue;
        s += d - s + 1;
        break;
      }
    a = c;
  }
  return a;
}, tu = (e) => e && e.replace("_", "-"), v4 = {
  type: "logger",
  log(e) {
    this.output("log", e);
  },
  warn(e) {
    this.output("warn", e);
  },
  error(e) {
    this.output("error", e);
  },
  output(e, t) {
    console && console[e] && console[e].apply(console, t);
  }
};
class ru {
  constructor(t) {
    let n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    this.init(t, n);
  }
  init(t) {
    let n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    this.prefix = n.prefix || "i18next:", this.logger = t || v4, this.options = n, this.debug = n.debug;
  }
  log() {
    for (var t = arguments.length, n = new Array(t), i = 0; i < t; i++)
      n[i] = arguments[i];
    return this.forward(n, "log", "", !0);
  }
  warn() {
    for (var t = arguments.length, n = new Array(t), i = 0; i < t; i++)
      n[i] = arguments[i];
    return this.forward(n, "warn", "", !0);
  }
  error() {
    for (var t = arguments.length, n = new Array(t), i = 0; i < t; i++)
      n[i] = arguments[i];
    return this.forward(n, "error", "");
  }
  deprecate() {
    for (var t = arguments.length, n = new Array(t), i = 0; i < t; i++)
      n[i] = arguments[i];
    return this.forward(n, "warn", "WARNING DEPRECATED: ", !0);
  }
  forward(t, n, i, a) {
    return a && !this.debug ? null : (Ne(t[0]) && (t[0] = `${i}${this.prefix} ${t[0]}`), this.logger[n](t));
  }
  create(t) {
    return new ru(this.logger, {
      prefix: `${this.prefix}:${t}:`,
      ...this.options
    });
  }
  clone(t) {
    return t = t || this.options, t.prefix = t.prefix || this.prefix, new ru(this.logger, t);
  }
}
var fn = new ru();
class wu {
  constructor() {
    this.observers = {};
  }
  on(t, n) {
    return t.split(" ").forEach((i) => {
      this.observers[i] || (this.observers[i] = /* @__PURE__ */ new Map());
      const a = this.observers[i].get(n) || 0;
      this.observers[i].set(n, a + 1);
    }), this;
  }
  off(t, n) {
    if (this.observers[t]) {
      if (!n) {
        delete this.observers[t];
        return;
      }
      this.observers[t].delete(n);
    }
  }
  emit(t) {
    for (var n = arguments.length, i = new Array(n > 1 ? n - 1 : 0), a = 1; a < n; a++)
      i[a - 1] = arguments[a];
    this.observers[t] && Array.from(this.observers[t].entries()).forEach((c) => {
      let [f, d] = c;
      for (let h = 0; h < d; h++)
        f(...i);
    }), this.observers["*"] && Array.from(this.observers["*"].entries()).forEach((c) => {
      let [f, d] = c;
      for (let h = 0; h < d; h++)
        f.apply(f, [t, ...i]);
    });
  }
}
class P0 extends wu {
  constructor(t) {
    let n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {
      ns: ["translation"],
      defaultNS: "translation"
    };
    super(), this.data = t || {}, this.options = n, this.options.keySeparator === void 0 && (this.options.keySeparator = "."), this.options.ignoreJSONStructure === void 0 && (this.options.ignoreJSONStructure = !0);
  }
  addNamespaces(t) {
    this.options.ns.indexOf(t) < 0 && this.options.ns.push(t);
  }
  removeNamespaces(t) {
    const n = this.options.ns.indexOf(t);
    n > -1 && this.options.ns.splice(n, 1);
  }
  getResource(t, n, i) {
    let a = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : {};
    const s = a.keySeparator !== void 0 ? a.keySeparator : this.options.keySeparator, c = a.ignoreJSONStructure !== void 0 ? a.ignoreJSONStructure : this.options.ignoreJSONStructure;
    let f;
    t.indexOf(".") > -1 ? f = t.split(".") : (f = [t, n], i && (Array.isArray(i) ? f.push(...i) : Ne(i) && s ? f.push(...i.split(s)) : f.push(i)));
    const d = eu(this.data, f);
    return !d && !n && !i && t.indexOf(".") > -1 && (t = f[0], n = f[1], i = f.slice(2).join(".")), d || !c || !Ne(i) ? d : uf(this.data && this.data[t] && this.data[t][n], i, s);
  }
  addResource(t, n, i, a) {
    let s = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : {
      silent: !1
    };
    const c = s.keySeparator !== void 0 ? s.keySeparator : this.options.keySeparator;
    let f = [t, n];
    i && (f = f.concat(c ? i.split(c) : i)), t.indexOf(".") > -1 && (f = t.split("."), a = n, n = f[1]), this.addNamespaces(n), L0(this.data, f, a), s.silent || this.emit("added", t, n, i, a);
  }
  addResources(t, n, i) {
    let a = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : {
      silent: !1
    };
    for (const s in i)
      (Ne(i[s]) || Array.isArray(i[s])) && this.addResource(t, n, s, i[s], {
        silent: !0
      });
    a.silent || this.emit("added", t, n, i);
  }
  addResourceBundle(t, n, i, a, s) {
    let c = arguments.length > 5 && arguments[5] !== void 0 ? arguments[5] : {
      silent: !1,
      skipCopy: !1
    }, f = [t, n];
    t.indexOf(".") > -1 && (f = t.split("."), a = i, i = n, n = f[1]), this.addNamespaces(n);
    let d = eu(this.data, f) || {};
    c.skipCopy || (i = JSON.parse(JSON.stringify(i))), a ? ry(d, i, s) : d = {
      ...d,
      ...i
    }, L0(this.data, f, d), c.silent || this.emit("added", t, n, i);
  }
  removeResourceBundle(t, n) {
    this.hasResourceBundle(t, n) && delete this.data[t][n], this.removeNamespaces(n), this.emit("removed", t, n);
  }
  hasResourceBundle(t, n) {
    return this.getResource(t, n) !== void 0;
  }
  getResourceBundle(t, n) {
    return n || (n = this.options.defaultNS), this.options.compatibilityAPI === "v1" ? {
      ...this.getResource(t, n)
    } : this.getResource(t, n);
  }
  getDataByLanguage(t) {
    return this.data[t];
  }
  hasLanguageSomeTranslations(t) {
    const n = this.getDataByLanguage(t);
    return !!(n && Object.keys(n) || []).find((a) => n[a] && Object.keys(n[a]).length > 0);
  }
  toJSON() {
    return this.data;
  }
}
var ny = {
  processors: {},
  addPostProcessor(e) {
    this.processors[e.name] = e;
  },
  handle(e, t, n, i, a) {
    return e.forEach((s) => {
      this.processors[s] && (t = this.processors[s].process(t, n, i, a));
    }), t;
  }
};
const N0 = {};
class nu extends wu {
  constructor(t) {
    let n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    super(), a4(["resourceStore", "languageUtils", "pluralResolver", "interpolator", "backendConnector", "i18nFormat", "utils"], t, this), this.options = n, this.options.keySeparator === void 0 && (this.options.keySeparator = "."), this.logger = fn.create("translator");
  }
  changeLanguage(t) {
    t && (this.language = t);
  }
  exists(t) {
    let n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {
      interpolation: {}
    };
    if (t == null)
      return !1;
    const i = this.resolve(t, n);
    return i && i.res !== void 0;
  }
  extractFromKey(t, n) {
    let i = n.nsSeparator !== void 0 ? n.nsSeparator : this.options.nsSeparator;
    i === void 0 && (i = ":");
    const a = n.keySeparator !== void 0 ? n.keySeparator : this.options.keySeparator;
    let s = n.ns || this.options.defaultNS || [];
    const c = i && t.indexOf(i) > -1, f = !this.options.userDefinedKeySeparator && !n.keySeparator && !this.options.userDefinedNsSeparator && !n.nsSeparator && !m4(t, i, a);
    if (c && !f) {
      const d = t.match(this.interpolator.nestingRegexp);
      if (d && d.length > 0)
        return {
          key: t,
          namespaces: Ne(s) ? [s] : s
        };
      const h = t.split(i);
      (i !== a || i === a && this.options.ns.indexOf(h[0]) > -1) && (s = h.shift()), t = h.join(a);
    }
    return {
      key: t,
      namespaces: Ne(s) ? [s] : s
    };
  }
  translate(t, n, i) {
    if (typeof n != "object" && this.options.overloadTranslationOptionHandler && (n = this.options.overloadTranslationOptionHandler(arguments)), typeof n == "object" && (n = {
      ...n
    }), n || (n = {}), t == null) return "";
    Array.isArray(t) || (t = [String(t)]);
    const a = n.returnDetails !== void 0 ? n.returnDetails : this.options.returnDetails, s = n.keySeparator !== void 0 ? n.keySeparator : this.options.keySeparator, {
      key: c,
      namespaces: f
    } = this.extractFromKey(t[t.length - 1], n), d = f[f.length - 1], h = n.lng || this.language, m = n.appendNamespaceToCIMode || this.options.appendNamespaceToCIMode;
    if (h && h.toLowerCase() === "cimode") {
      if (m) {
        const S = n.nsSeparator || this.options.nsSeparator;
        return a ? {
          res: `${d}${S}${c}`,
          usedKey: c,
          exactUsedKey: c,
          usedLng: h,
          usedNS: d,
          usedParams: this.getUsedParamsDetails(n)
        } : `${d}${S}${c}`;
      }
      return a ? {
        res: c,
        usedKey: c,
        exactUsedKey: c,
        usedLng: h,
        usedNS: d,
        usedParams: this.getUsedParamsDetails(n)
      } : c;
    }
    const b = this.resolve(t, n);
    let v = b && b.res;
    const _ = b && b.usedKey || c, x = b && b.exactUsedKey || c, T = Object.prototype.toString.apply(v), R = ["[object Number]", "[object Function]", "[object RegExp]"], D = n.joinArrays !== void 0 ? n.joinArrays : this.options.joinArrays, K = !this.i18nFormat || this.i18nFormat.handleAsObject, L = !Ne(v) && typeof v != "boolean" && typeof v != "number";
    if (K && v && L && R.indexOf(T) < 0 && !(Ne(D) && Array.isArray(v))) {
      if (!n.returnObjects && !this.options.returnObjects) {
        this.options.returnedObjectHandler || this.logger.warn("accessing an object - but returnObjects options is not enabled!");
        const S = this.options.returnedObjectHandler ? this.options.returnedObjectHandler(_, v, {
          ...n,
          ns: f
        }) : `key '${c} (${this.language})' returned an object instead of string.`;
        return a ? (b.res = S, b.usedParams = this.getUsedParamsDetails(n), b) : S;
      }
      if (s) {
        const S = Array.isArray(v), B = S ? [] : {}, I = S ? x : _;
        for (const F in v)
          if (Object.prototype.hasOwnProperty.call(v, F)) {
            const te = `${I}${s}${F}`;
            B[F] = this.translate(te, {
              ...n,
              joinArrays: !1,
              ns: f
            }), B[F] === te && (B[F] = v[F]);
          }
        v = B;
      }
    } else if (K && Ne(D) && Array.isArray(v))
      v = v.join(D), v && (v = this.extendTranslation(v, t, n, i));
    else {
      let S = !1, B = !1;
      const I = n.count !== void 0 && !Ne(n.count), F = nu.hasDefaultValue(n), te = I ? this.pluralResolver.getSuffix(h, n.count, n) : "", re = n.ordinal && I ? this.pluralResolver.getSuffix(h, n.count, {
        ordinal: !1
      }) : "", Se = I && !n.ordinal && n.count === 0 && this.pluralResolver.shouldUseIntlApi(), Pe = Se && n[`defaultValue${this.options.pluralSeparator}zero`] || n[`defaultValue${te}`] || n[`defaultValue${re}`] || n.defaultValue;
      !this.isValidLookup(v) && F && (S = !0, v = Pe), this.isValidLookup(v) || (B = !0, v = c);
      const we = (n.missingKeyNoValueFallbackToKey || this.options.missingKeyNoValueFallbackToKey) && B ? void 0 : v, De = F && Pe !== v && this.options.updateMissing;
      if (B || S || De) {
        if (this.logger.log(De ? "updateKey" : "missingKey", h, d, c, De ? Pe : v), s) {
          const V = this.resolve(c, {
            ...n,
            keySeparator: !1
          });
          V && V.res && this.logger.warn("Seems the loaded translations were in flat JSON format instead of nested. Either set keySeparator: false on init or make sure your translations are published in nested format.");
        }
        let ae = [];
        const ge = this.languageUtils.getFallbackCodes(this.options.fallbackLng, n.lng || this.language);
        if (this.options.saveMissingTo === "fallback" && ge && ge[0])
          for (let V = 0; V < ge.length; V++)
            ae.push(ge[V]);
        else this.options.saveMissingTo === "all" ? ae = this.languageUtils.toResolveHierarchy(n.lng || this.language) : ae.push(n.lng || this.language);
        const he = (V, oe, q) => {
          const P = F && q !== v ? q : we;
          this.options.missingKeyHandler ? this.options.missingKeyHandler(V, d, oe, P, De, n) : this.backendConnector && this.backendConnector.saveMissing && this.backendConnector.saveMissing(V, d, oe, P, De, n), this.emit("missingKey", V, d, oe, v);
        };
        this.options.saveMissing && (this.options.saveMissingPlurals && I ? ae.forEach((V) => {
          const oe = this.pluralResolver.getSuffixes(V, n);
          Se && n[`defaultValue${this.options.pluralSeparator}zero`] && oe.indexOf(`${this.options.pluralSeparator}zero`) < 0 && oe.push(`${this.options.pluralSeparator}zero`), oe.forEach((q) => {
            he([V], c + q, n[`defaultValue${q}`] || Pe);
          });
        }) : he(ae, c, Pe));
      }
      v = this.extendTranslation(v, t, n, b, i), B && v === c && this.options.appendNamespaceToMissingKey && (v = `${d}:${c}`), (B || S) && this.options.parseMissingKeyHandler && (this.options.compatibilityAPI !== "v1" ? v = this.options.parseMissingKeyHandler(this.options.appendNamespaceToMissingKey ? `${d}:${c}` : c, S ? v : void 0) : v = this.options.parseMissingKeyHandler(v));
    }
    return a ? (b.res = v, b.usedParams = this.getUsedParamsDetails(n), b) : v;
  }
  extendTranslation(t, n, i, a, s) {
    var c = this;
    if (this.i18nFormat && this.i18nFormat.parse)
      t = this.i18nFormat.parse(t, {
        ...this.options.interpolation.defaultVariables,
        ...i
      }, i.lng || this.language || a.usedLng, a.usedNS, a.usedKey, {
        resolved: a
      });
    else if (!i.skipInterpolation) {
      i.interpolation && this.interpolator.init({
        ...i,
        interpolation: {
          ...this.options.interpolation,
          ...i.interpolation
        }
      });
      const h = Ne(t) && (i && i.interpolation && i.interpolation.skipOnVariables !== void 0 ? i.interpolation.skipOnVariables : this.options.interpolation.skipOnVariables);
      let m;
      if (h) {
        const v = t.match(this.interpolator.nestingRegexp);
        m = v && v.length;
      }
      let b = i.replace && !Ne(i.replace) ? i.replace : i;
      if (this.options.interpolation.defaultVariables && (b = {
        ...this.options.interpolation.defaultVariables,
        ...b
      }), t = this.interpolator.interpolate(t, b, i.lng || this.language || a.usedLng, i), h) {
        const v = t.match(this.interpolator.nestingRegexp), _ = v && v.length;
        m < _ && (i.nest = !1);
      }
      !i.lng && this.options.compatibilityAPI !== "v1" && a && a.res && (i.lng = this.language || a.usedLng), i.nest !== !1 && (t = this.interpolator.nest(t, function() {
        for (var v = arguments.length, _ = new Array(v), x = 0; x < v; x++)
          _[x] = arguments[x];
        return s && s[0] === _[0] && !i.context ? (c.logger.warn(`It seems you are nesting recursively key: ${_[0]} in key: ${n[0]}`), null) : c.translate(..._, n);
      }, i)), i.interpolation && this.interpolator.reset();
    }
    const f = i.postProcess || this.options.postProcess, d = Ne(f) ? [f] : f;
    return t != null && d && d.length && i.applyPostProcessor !== !1 && (t = ny.handle(d, t, n, this.options && this.options.postProcessPassResolved ? {
      i18nResolved: {
        ...a,
        usedParams: this.getUsedParamsDetails(i)
      },
      ...i
    } : i, this)), t;
  }
  resolve(t) {
    let n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, i, a, s, c, f;
    return Ne(t) && (t = [t]), t.forEach((d) => {
      if (this.isValidLookup(i)) return;
      const h = this.extractFromKey(d, n), m = h.key;
      a = m;
      let b = h.namespaces;
      this.options.fallbackNS && (b = b.concat(this.options.fallbackNS));
      const v = n.count !== void 0 && !Ne(n.count), _ = v && !n.ordinal && n.count === 0 && this.pluralResolver.shouldUseIntlApi(), x = n.context !== void 0 && (Ne(n.context) || typeof n.context == "number") && n.context !== "", T = n.lngs ? n.lngs : this.languageUtils.toResolveHierarchy(n.lng || this.language, n.fallbackLng);
      b.forEach((R) => {
        this.isValidLookup(i) || (f = R, !N0[`${T[0]}-${R}`] && this.utils && this.utils.hasLoadedNamespace && !this.utils.hasLoadedNamespace(f) && (N0[`${T[0]}-${R}`] = !0, this.logger.warn(`key "${a}" for languages "${T.join(", ")}" won't get resolved as namespace "${f}" was not yet loaded`, "This means something IS WRONG in your setup. You access the t function before i18next.init / i18next.loadNamespace / i18next.changeLanguage was done. Wait for the callback or Promise to resolve before accessing it!!!")), T.forEach((D) => {
          if (this.isValidLookup(i)) return;
          c = D;
          const K = [m];
          if (this.i18nFormat && this.i18nFormat.addLookupKeys)
            this.i18nFormat.addLookupKeys(K, m, D, R, n);
          else {
            let S;
            v && (S = this.pluralResolver.getSuffix(D, n.count, n));
            const B = `${this.options.pluralSeparator}zero`, I = `${this.options.pluralSeparator}ordinal${this.options.pluralSeparator}`;
            if (v && (K.push(m + S), n.ordinal && S.indexOf(I) === 0 && K.push(m + S.replace(I, this.options.pluralSeparator)), _ && K.push(m + B)), x) {
              const F = `${m}${this.options.contextSeparator}${n.context}`;
              K.push(F), v && (K.push(F + S), n.ordinal && S.indexOf(I) === 0 && K.push(F + S.replace(I, this.options.pluralSeparator)), _ && K.push(F + B));
            }
          }
          let L;
          for (; L = K.pop(); )
            this.isValidLookup(i) || (s = L, i = this.getResource(D, R, L, n));
        }));
      });
    }), {
      res: i,
      usedKey: a,
      exactUsedKey: s,
      usedLng: c,
      usedNS: f
    };
  }
  isValidLookup(t) {
    return t !== void 0 && !(!this.options.returnNull && t === null) && !(!this.options.returnEmptyString && t === "");
  }
  getResource(t, n, i) {
    let a = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : {};
    return this.i18nFormat && this.i18nFormat.getResource ? this.i18nFormat.getResource(t, n, i, a) : this.resourceStore.getResource(t, n, i, a);
  }
  getUsedParamsDetails() {
    let t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    const n = ["defaultValue", "ordinal", "context", "replace", "lng", "lngs", "fallbackLng", "ns", "keySeparator", "nsSeparator", "returnObjects", "returnDetails", "joinArrays", "postProcess", "interpolation"], i = t.replace && !Ne(t.replace);
    let a = i ? t.replace : t;
    if (i && typeof t.count < "u" && (a.count = t.count), this.options.interpolation.defaultVariables && (a = {
      ...this.options.interpolation.defaultVariables,
      ...a
    }), !i) {
      a = {
        ...a
      };
      for (const s of n)
        delete a[s];
    }
    return a;
  }
  static hasDefaultValue(t) {
    const n = "defaultValue";
    for (const i in t)
      if (Object.prototype.hasOwnProperty.call(t, i) && n === i.substring(0, n.length) && t[i] !== void 0)
        return !0;
    return !1;
  }
}
const Nd = (e) => e.charAt(0).toUpperCase() + e.slice(1);
class R0 {
  constructor(t) {
    this.options = t, this.supportedLngs = this.options.supportedLngs || !1, this.logger = fn.create("languageUtils");
  }
  getScriptPartFromCode(t) {
    if (t = tu(t), !t || t.indexOf("-") < 0) return null;
    const n = t.split("-");
    return n.length === 2 || (n.pop(), n[n.length - 1].toLowerCase() === "x") ? null : this.formatLanguageCode(n.join("-"));
  }
  getLanguagePartFromCode(t) {
    if (t = tu(t), !t || t.indexOf("-") < 0) return t;
    const n = t.split("-");
    return this.formatLanguageCode(n[0]);
  }
  formatLanguageCode(t) {
    if (Ne(t) && t.indexOf("-") > -1) {
      if (typeof Intl < "u" && typeof Intl.getCanonicalLocales < "u")
        try {
          let a = Intl.getCanonicalLocales(t)[0];
          if (a && this.options.lowerCaseLng && (a = a.toLowerCase()), a) return a;
        } catch {
        }
      const n = ["hans", "hant", "latn", "cyrl", "cans", "mong", "arab"];
      let i = t.split("-");
      return this.options.lowerCaseLng ? i = i.map((a) => a.toLowerCase()) : i.length === 2 ? (i[0] = i[0].toLowerCase(), i[1] = i[1].toUpperCase(), n.indexOf(i[1].toLowerCase()) > -1 && (i[1] = Nd(i[1].toLowerCase()))) : i.length === 3 && (i[0] = i[0].toLowerCase(), i[1].length === 2 && (i[1] = i[1].toUpperCase()), i[0] !== "sgn" && i[2].length === 2 && (i[2] = i[2].toUpperCase()), n.indexOf(i[1].toLowerCase()) > -1 && (i[1] = Nd(i[1].toLowerCase())), n.indexOf(i[2].toLowerCase()) > -1 && (i[2] = Nd(i[2].toLowerCase()))), i.join("-");
    }
    return this.options.cleanCode || this.options.lowerCaseLng ? t.toLowerCase() : t;
  }
  isSupportedCode(t) {
    return (this.options.load === "languageOnly" || this.options.nonExplicitSupportedLngs) && (t = this.getLanguagePartFromCode(t)), !this.supportedLngs || !this.supportedLngs.length || this.supportedLngs.indexOf(t) > -1;
  }
  getBestMatchFromCodes(t) {
    if (!t) return null;
    let n;
    return t.forEach((i) => {
      if (n) return;
      const a = this.formatLanguageCode(i);
      (!this.options.supportedLngs || this.isSupportedCode(a)) && (n = a);
    }), !n && this.options.supportedLngs && t.forEach((i) => {
      if (n) return;
      const a = this.getLanguagePartFromCode(i);
      if (this.isSupportedCode(a)) return n = a;
      n = this.options.supportedLngs.find((s) => {
        if (s === a) return s;
        if (!(s.indexOf("-") < 0 && a.indexOf("-") < 0) && (s.indexOf("-") > 0 && a.indexOf("-") < 0 && s.substring(0, s.indexOf("-")) === a || s.indexOf(a) === 0 && a.length > 1))
          return s;
      });
    }), n || (n = this.getFallbackCodes(this.options.fallbackLng)[0]), n;
  }
  getFallbackCodes(t, n) {
    if (!t) return [];
    if (typeof t == "function" && (t = t(n)), Ne(t) && (t = [t]), Array.isArray(t)) return t;
    if (!n) return t.default || [];
    let i = t[n];
    return i || (i = t[this.getScriptPartFromCode(n)]), i || (i = t[this.formatLanguageCode(n)]), i || (i = t[this.getLanguagePartFromCode(n)]), i || (i = t.default), i || [];
  }
  toResolveHierarchy(t, n) {
    const i = this.getFallbackCodes(n || this.options.fallbackLng || [], t), a = [], s = (c) => {
      c && (this.isSupportedCode(c) ? a.push(c) : this.logger.warn(`rejecting language code not found in supportedLngs: ${c}`));
    };
    return Ne(t) && (t.indexOf("-") > -1 || t.indexOf("_") > -1) ? (this.options.load !== "languageOnly" && s(this.formatLanguageCode(t)), this.options.load !== "languageOnly" && this.options.load !== "currentOnly" && s(this.getScriptPartFromCode(t)), this.options.load !== "currentOnly" && s(this.getLanguagePartFromCode(t))) : Ne(t) && s(this.formatLanguageCode(t)), i.forEach((c) => {
      a.indexOf(c) < 0 && s(this.formatLanguageCode(c));
    }), a;
  }
}
let b4 = [{
  lngs: ["ach", "ak", "am", "arn", "br", "fil", "gun", "ln", "mfe", "mg", "mi", "oc", "pt", "pt-BR", "tg", "tl", "ti", "tr", "uz", "wa"],
  nr: [1, 2],
  fc: 1
}, {
  lngs: ["af", "an", "ast", "az", "bg", "bn", "ca", "da", "de", "dev", "el", "en", "eo", "es", "et", "eu", "fi", "fo", "fur", "fy", "gl", "gu", "ha", "hi", "hu", "hy", "ia", "it", "kk", "kn", "ku", "lb", "mai", "ml", "mn", "mr", "nah", "nap", "nb", "ne", "nl", "nn", "no", "nso", "pa", "pap", "pms", "ps", "pt-PT", "rm", "sco", "se", "si", "so", "son", "sq", "sv", "sw", "ta", "te", "tk", "ur", "yo"],
  nr: [1, 2],
  fc: 2
}, {
  lngs: ["ay", "bo", "cgg", "fa", "ht", "id", "ja", "jbo", "ka", "km", "ko", "ky", "lo", "ms", "sah", "su", "th", "tt", "ug", "vi", "wo", "zh"],
  nr: [1],
  fc: 3
}, {
  lngs: ["be", "bs", "cnr", "dz", "hr", "ru", "sr", "uk"],
  nr: [1, 2, 5],
  fc: 4
}, {
  lngs: ["ar"],
  nr: [0, 1, 2, 3, 11, 100],
  fc: 5
}, {
  lngs: ["cs", "sk"],
  nr: [1, 2, 5],
  fc: 6
}, {
  lngs: ["csb", "pl"],
  nr: [1, 2, 5],
  fc: 7
}, {
  lngs: ["cy"],
  nr: [1, 2, 3, 8],
  fc: 8
}, {
  lngs: ["fr"],
  nr: [1, 2],
  fc: 9
}, {
  lngs: ["ga"],
  nr: [1, 2, 3, 7, 11],
  fc: 10
}, {
  lngs: ["gd"],
  nr: [1, 2, 3, 20],
  fc: 11
}, {
  lngs: ["is"],
  nr: [1, 2],
  fc: 12
}, {
  lngs: ["jv"],
  nr: [0, 1],
  fc: 13
}, {
  lngs: ["kw"],
  nr: [1, 2, 3, 4],
  fc: 14
}, {
  lngs: ["lt"],
  nr: [1, 2, 10],
  fc: 15
}, {
  lngs: ["lv"],
  nr: [1, 2, 0],
  fc: 16
}, {
  lngs: ["mk"],
  nr: [1, 2],
  fc: 17
}, {
  lngs: ["mnk"],
  nr: [0, 1, 2],
  fc: 18
}, {
  lngs: ["mt"],
  nr: [1, 2, 11, 20],
  fc: 19
}, {
  lngs: ["or"],
  nr: [2, 1],
  fc: 2
}, {
  lngs: ["ro"],
  nr: [1, 2, 20],
  fc: 20
}, {
  lngs: ["sl"],
  nr: [5, 1, 2, 3],
  fc: 21
}, {
  lngs: ["he", "iw"],
  nr: [1, 2, 20, 21],
  fc: 22
}], y4 = {
  1: (e) => +(e > 1),
  2: (e) => +(e != 1),
  3: (e) => 0,
  4: (e) => e % 10 == 1 && e % 100 != 11 ? 0 : e % 10 >= 2 && e % 10 <= 4 && (e % 100 < 10 || e % 100 >= 20) ? 1 : 2,
  5: (e) => e == 0 ? 0 : e == 1 ? 1 : e == 2 ? 2 : e % 100 >= 3 && e % 100 <= 10 ? 3 : e % 100 >= 11 ? 4 : 5,
  6: (e) => e == 1 ? 0 : e >= 2 && e <= 4 ? 1 : 2,
  7: (e) => e == 1 ? 0 : e % 10 >= 2 && e % 10 <= 4 && (e % 100 < 10 || e % 100 >= 20) ? 1 : 2,
  8: (e) => e == 1 ? 0 : e == 2 ? 1 : e != 8 && e != 11 ? 2 : 3,
  9: (e) => +(e >= 2),
  10: (e) => e == 1 ? 0 : e == 2 ? 1 : e < 7 ? 2 : e < 11 ? 3 : 4,
  11: (e) => e == 1 || e == 11 ? 0 : e == 2 || e == 12 ? 1 : e > 2 && e < 20 ? 2 : 3,
  12: (e) => +(e % 10 != 1 || e % 100 == 11),
  13: (e) => +(e !== 0),
  14: (e) => e == 1 ? 0 : e == 2 ? 1 : e == 3 ? 2 : 3,
  15: (e) => e % 10 == 1 && e % 100 != 11 ? 0 : e % 10 >= 2 && (e % 100 < 10 || e % 100 >= 20) ? 1 : 2,
  16: (e) => e % 10 == 1 && e % 100 != 11 ? 0 : e !== 0 ? 1 : 2,
  17: (e) => e == 1 || e % 10 == 1 && e % 100 != 11 ? 0 : 1,
  18: (e) => e == 0 ? 0 : e == 1 ? 1 : 2,
  19: (e) => e == 1 ? 0 : e == 0 || e % 100 > 1 && e % 100 < 11 ? 1 : e % 100 > 10 && e % 100 < 20 ? 2 : 3,
  20: (e) => e == 1 ? 0 : e == 0 || e % 100 > 0 && e % 100 < 20 ? 1 : 2,
  21: (e) => e % 100 == 1 ? 1 : e % 100 == 2 ? 2 : e % 100 == 3 || e % 100 == 4 ? 3 : 0,
  22: (e) => e == 1 ? 0 : e == 2 ? 1 : (e < 0 || e > 10) && e % 10 == 0 ? 2 : 3
};
const _4 = ["v1", "v2", "v3"], k4 = ["v4"], I0 = {
  zero: 0,
  one: 1,
  two: 2,
  few: 3,
  many: 4,
  other: 5
}, w4 = () => {
  const e = {};
  return b4.forEach((t) => {
    t.lngs.forEach((n) => {
      e[n] = {
        numbers: t.nr,
        plurals: y4[t.fc]
      };
    });
  }), e;
};
class S4 {
  constructor(t) {
    let n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    this.languageUtils = t, this.options = n, this.logger = fn.create("pluralResolver"), (!this.options.compatibilityJSON || k4.includes(this.options.compatibilityJSON)) && (typeof Intl > "u" || !Intl.PluralRules) && (this.options.compatibilityJSON = "v3", this.logger.error("Your environment seems not to be Intl API compatible, use an Intl.PluralRules polyfill. Will fallback to the compatibilityJSON v3 format handling.")), this.rules = w4(), this.pluralRulesCache = {};
  }
  addRule(t, n) {
    this.rules[t] = n;
  }
  clearCache() {
    this.pluralRulesCache = {};
  }
  getRule(t) {
    let n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    if (this.shouldUseIntlApi()) {
      const i = tu(t === "dev" ? "en" : t), a = n.ordinal ? "ordinal" : "cardinal", s = JSON.stringify({
        cleanedCode: i,
        type: a
      });
      if (s in this.pluralRulesCache)
        return this.pluralRulesCache[s];
      let c;
      try {
        c = new Intl.PluralRules(i, {
          type: a
        });
      } catch {
        if (!t.match(/-|_/)) return;
        const d = this.languageUtils.getLanguagePartFromCode(t);
        c = this.getRule(d, n);
      }
      return this.pluralRulesCache[s] = c, c;
    }
    return this.rules[t] || this.rules[this.languageUtils.getLanguagePartFromCode(t)];
  }
  needsPlural(t) {
    let n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    const i = this.getRule(t, n);
    return this.shouldUseIntlApi() ? i && i.resolvedOptions().pluralCategories.length > 1 : i && i.numbers.length > 1;
  }
  getPluralFormsOfKey(t, n) {
    let i = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    return this.getSuffixes(t, i).map((a) => `${n}${a}`);
  }
  getSuffixes(t) {
    let n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    const i = this.getRule(t, n);
    return i ? this.shouldUseIntlApi() ? i.resolvedOptions().pluralCategories.sort((a, s) => I0[a] - I0[s]).map((a) => `${this.options.prepend}${n.ordinal ? `ordinal${this.options.prepend}` : ""}${a}`) : i.numbers.map((a) => this.getSuffix(t, a, n)) : [];
  }
  getSuffix(t, n) {
    let i = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    const a = this.getRule(t, i);
    return a ? this.shouldUseIntlApi() ? `${this.options.prepend}${i.ordinal ? `ordinal${this.options.prepend}` : ""}${a.select(n)}` : this.getSuffixRetroCompatible(a, n) : (this.logger.warn(`no plural rule found for: ${t}`), "");
  }
  getSuffixRetroCompatible(t, n) {
    const i = t.noAbs ? t.plurals(n) : t.plurals(Math.abs(n));
    let a = t.numbers[i];
    this.options.simplifyPluralSuffix && t.numbers.length === 2 && t.numbers[0] === 1 && (a === 2 ? a = "plural" : a === 1 && (a = ""));
    const s = () => this.options.prepend && a.toString() ? this.options.prepend + a.toString() : a.toString();
    return this.options.compatibilityJSON === "v1" ? a === 1 ? "" : typeof a == "number" ? `_plural_${a.toString()}` : s() : this.options.compatibilityJSON === "v2" || this.options.simplifyPluralSuffix && t.numbers.length === 2 && t.numbers[0] === 1 ? s() : this.options.prepend && i.toString() ? this.options.prepend + i.toString() : i.toString();
  }
  shouldUseIntlApi() {
    return !_4.includes(this.options.compatibilityJSON);
  }
}
const A0 = function(e, t, n) {
  let i = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : ".", a = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : !0, s = c4(e, t, n);
  return !s && a && Ne(n) && (s = uf(e, n, i), s === void 0 && (s = uf(t, n, i))), s;
}, Rd = (e) => e.replace(/\$/g, "$$$$");
class C4 {
  constructor() {
    let t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    this.logger = fn.create("interpolator"), this.options = t, this.format = t.interpolation && t.interpolation.format || ((n) => n), this.init(t);
  }
  init() {
    let t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    t.interpolation || (t.interpolation = {
      escapeValue: !0
    });
    const {
      escape: n,
      escapeValue: i,
      useRawValueToEscape: a,
      prefix: s,
      prefixEscaped: c,
      suffix: f,
      suffixEscaped: d,
      formatSeparator: h,
      unescapeSuffix: m,
      unescapePrefix: b,
      nestingPrefix: v,
      nestingPrefixEscaped: _,
      nestingSuffix: x,
      nestingSuffixEscaped: T,
      nestingOptionsSeparator: R,
      maxReplaces: D,
      alwaysFormat: K
    } = t.interpolation;
    this.escape = n !== void 0 ? n : f4, this.escapeValue = i !== void 0 ? i : !0, this.useRawValueToEscape = a !== void 0 ? a : !1, this.prefix = s ? Si(s) : c || "{{", this.suffix = f ? Si(f) : d || "}}", this.formatSeparator = h || ",", this.unescapePrefix = m ? "" : b || "-", this.unescapeSuffix = this.unescapePrefix ? "" : m || "", this.nestingPrefix = v ? Si(v) : _ || Si("$t("), this.nestingSuffix = x ? Si(x) : T || Si(")"), this.nestingOptionsSeparator = R || ",", this.maxReplaces = D || 1e3, this.alwaysFormat = K !== void 0 ? K : !1, this.resetRegExp();
  }
  reset() {
    this.options && this.init(this.options);
  }
  resetRegExp() {
    const t = (n, i) => n && n.source === i ? (n.lastIndex = 0, n) : new RegExp(i, "g");
    this.regexp = t(this.regexp, `${this.prefix}(.+?)${this.suffix}`), this.regexpUnescape = t(this.regexpUnescape, `${this.prefix}${this.unescapePrefix}(.+?)${this.unescapeSuffix}${this.suffix}`), this.nestingRegexp = t(this.nestingRegexp, `${this.nestingPrefix}(.+?)${this.nestingSuffix}`);
  }
  interpolate(t, n, i, a) {
    let s, c, f;
    const d = this.options && this.options.interpolation && this.options.interpolation.defaultVariables || {}, h = (_) => {
      if (_.indexOf(this.formatSeparator) < 0) {
        const D = A0(n, d, _, this.options.keySeparator, this.options.ignoreJSONStructure);
        return this.alwaysFormat ? this.format(D, void 0, i, {
          ...a,
          ...n,
          interpolationkey: _
        }) : D;
      }
      const x = _.split(this.formatSeparator), T = x.shift().trim(), R = x.join(this.formatSeparator).trim();
      return this.format(A0(n, d, T, this.options.keySeparator, this.options.ignoreJSONStructure), R, i, {
        ...a,
        ...n,
        interpolationkey: T
      });
    };
    this.resetRegExp();
    const m = a && a.missingInterpolationHandler || this.options.missingInterpolationHandler, b = a && a.interpolation && a.interpolation.skipOnVariables !== void 0 ? a.interpolation.skipOnVariables : this.options.interpolation.skipOnVariables;
    return [{
      regex: this.regexpUnescape,
      safeValue: (_) => Rd(_)
    }, {
      regex: this.regexp,
      safeValue: (_) => this.escapeValue ? Rd(this.escape(_)) : Rd(_)
    }].forEach((_) => {
      for (f = 0; s = _.regex.exec(t); ) {
        const x = s[1].trim();
        if (c = h(x), c === void 0)
          if (typeof m == "function") {
            const R = m(t, s, a);
            c = Ne(R) ? R : "";
          } else if (a && Object.prototype.hasOwnProperty.call(a, x))
            c = "";
          else if (b) {
            c = s[0];
            continue;
          } else
            this.logger.warn(`missed to pass in variable ${x} for interpolating ${t}`), c = "";
        else !Ne(c) && !this.useRawValueToEscape && (c = E0(c));
        const T = _.safeValue(c);
        if (t = t.replace(s[0], T), b ? (_.regex.lastIndex += c.length, _.regex.lastIndex -= s[0].length) : _.regex.lastIndex = 0, f++, f >= this.maxReplaces)
          break;
      }
    }), t;
  }
  nest(t, n) {
    let i = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {}, a, s, c;
    const f = (d, h) => {
      const m = this.nestingOptionsSeparator;
      if (d.indexOf(m) < 0) return d;
      const b = d.split(new RegExp(`${m}[ ]*{`));
      let v = `{${b[1]}`;
      d = b[0], v = this.interpolate(v, c);
      const _ = v.match(/'/g), x = v.match(/"/g);
      (_ && _.length % 2 === 0 && !x || x.length % 2 !== 0) && (v = v.replace(/'/g, '"'));
      try {
        c = JSON.parse(v), h && (c = {
          ...h,
          ...c
        });
      } catch (T) {
        return this.logger.warn(`failed parsing options string in nesting for key ${d}`, T), `${d}${m}${v}`;
      }
      return c.defaultValue && c.defaultValue.indexOf(this.prefix) > -1 && delete c.defaultValue, d;
    };
    for (; a = this.nestingRegexp.exec(t); ) {
      let d = [];
      c = {
        ...i
      }, c = c.replace && !Ne(c.replace) ? c.replace : c, c.applyPostProcessor = !1, delete c.defaultValue;
      let h = !1;
      if (a[0].indexOf(this.formatSeparator) !== -1 && !/{.*}/.test(a[1])) {
        const m = a[1].split(this.formatSeparator).map((b) => b.trim());
        a[1] = m.shift(), d = m, h = !0;
      }
      if (s = n(f.call(this, a[1].trim(), c), c), s && a[0] === t && !Ne(s)) return s;
      Ne(s) || (s = E0(s)), s || (this.logger.warn(`missed to resolve ${a[1]} for nesting ${t}`), s = ""), h && (s = d.reduce((m, b) => this.format(m, b, i.lng, {
        ...i,
        interpolationkey: a[1].trim()
      }), s.trim())), t = t.replace(a[0], s), this.regexp.lastIndex = 0;
    }
    return t;
  }
}
const x4 = (e) => {
  let t = e.toLowerCase().trim();
  const n = {};
  if (e.indexOf("(") > -1) {
    const i = e.split("(");
    t = i[0].toLowerCase().trim();
    const a = i[1].substring(0, i[1].length - 1);
    t === "currency" && a.indexOf(":") < 0 ? n.currency || (n.currency = a.trim()) : t === "relativetime" && a.indexOf(":") < 0 ? n.range || (n.range = a.trim()) : a.split(";").forEach((c) => {
      if (c) {
        const [f, ...d] = c.split(":"), h = d.join(":").trim().replace(/^'+|'+$/g, ""), m = f.trim();
        n[m] || (n[m] = h), h === "false" && (n[m] = !1), h === "true" && (n[m] = !0), isNaN(h) || (n[m] = parseInt(h, 10));
      }
    });
  }
  return {
    formatName: t,
    formatOptions: n
  };
}, Ci = (e) => {
  const t = {};
  return (n, i, a) => {
    let s = a;
    a && a.interpolationkey && a.formatParams && a.formatParams[a.interpolationkey] && a[a.interpolationkey] && (s = {
      ...s,
      [a.interpolationkey]: void 0
    });
    const c = i + JSON.stringify(s);
    let f = t[c];
    return f || (f = e(tu(i), a), t[c] = f), f(n);
  };
};
class $4 {
  constructor() {
    let t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    this.logger = fn.create("formatter"), this.options = t, this.formats = {
      number: Ci((n, i) => {
        const a = new Intl.NumberFormat(n, {
          ...i
        });
        return (s) => a.format(s);
      }),
      currency: Ci((n, i) => {
        const a = new Intl.NumberFormat(n, {
          ...i,
          style: "currency"
        });
        return (s) => a.format(s);
      }),
      datetime: Ci((n, i) => {
        const a = new Intl.DateTimeFormat(n, {
          ...i
        });
        return (s) => a.format(s);
      }),
      relativetime: Ci((n, i) => {
        const a = new Intl.RelativeTimeFormat(n, {
          ...i
        });
        return (s) => a.format(s, i.range || "day");
      }),
      list: Ci((n, i) => {
        const a = new Intl.ListFormat(n, {
          ...i
        });
        return (s) => a.format(s);
      })
    }, this.init(t);
  }
  init(t) {
    let n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {
      interpolation: {}
    };
    this.formatSeparator = n.interpolation.formatSeparator || ",";
  }
  add(t, n) {
    this.formats[t.toLowerCase().trim()] = n;
  }
  addCached(t, n) {
    this.formats[t.toLowerCase().trim()] = Ci(n);
  }
  format(t, n, i) {
    let a = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : {};
    const s = n.split(this.formatSeparator);
    if (s.length > 1 && s[0].indexOf("(") > 1 && s[0].indexOf(")") < 0 && s.find((f) => f.indexOf(")") > -1)) {
      const f = s.findIndex((d) => d.indexOf(")") > -1);
      s[0] = [s[0], ...s.splice(1, f)].join(this.formatSeparator);
    }
    return s.reduce((f, d) => {
      const {
        formatName: h,
        formatOptions: m
      } = x4(d);
      if (this.formats[h]) {
        let b = f;
        try {
          const v = a && a.formatParams && a.formatParams[a.interpolationkey] || {}, _ = v.locale || v.lng || a.locale || a.lng || i;
          b = this.formats[h](f, _, {
            ...m,
            ...a,
            ...v
          });
        } catch (v) {
          this.logger.warn(v);
        }
        return b;
      } else
        this.logger.warn(`there was no format function for ${h}`);
      return f;
    }, t);
  }
}
const E4 = (e, t) => {
  e.pending[t] !== void 0 && (delete e.pending[t], e.pendingCount--);
};
class T4 extends wu {
  constructor(t, n, i) {
    let a = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : {};
    super(), this.backend = t, this.store = n, this.services = i, this.languageUtils = i.languageUtils, this.options = a, this.logger = fn.create("backendConnector"), this.waitingReads = [], this.maxParallelReads = a.maxParallelReads || 10, this.readingCalls = 0, this.maxRetries = a.maxRetries >= 0 ? a.maxRetries : 5, this.retryTimeout = a.retryTimeout >= 1 ? a.retryTimeout : 350, this.state = {}, this.queue = [], this.backend && this.backend.init && this.backend.init(i, a.backend, a);
  }
  queueLoad(t, n, i, a) {
    const s = {}, c = {}, f = {}, d = {};
    return t.forEach((h) => {
      let m = !0;
      n.forEach((b) => {
        const v = `${h}|${b}`;
        !i.reload && this.store.hasResourceBundle(h, b) ? this.state[v] = 2 : this.state[v] < 0 || (this.state[v] === 1 ? c[v] === void 0 && (c[v] = !0) : (this.state[v] = 1, m = !1, c[v] === void 0 && (c[v] = !0), s[v] === void 0 && (s[v] = !0), d[b] === void 0 && (d[b] = !0)));
      }), m || (f[h] = !0);
    }), (Object.keys(s).length || Object.keys(c).length) && this.queue.push({
      pending: c,
      pendingCount: Object.keys(c).length,
      loaded: {},
      errors: [],
      callback: a
    }), {
      toLoad: Object.keys(s),
      pending: Object.keys(c),
      toLoadLanguages: Object.keys(f),
      toLoadNamespaces: Object.keys(d)
    };
  }
  loaded(t, n, i) {
    const a = t.split("|"), s = a[0], c = a[1];
    n && this.emit("failedLoading", s, c, n), !n && i && this.store.addResourceBundle(s, c, i, void 0, void 0, {
      skipCopy: !0
    }), this.state[t] = n ? -1 : 2, n && i && (this.state[t] = 0);
    const f = {};
    this.queue.forEach((d) => {
      u4(d.loaded, [s], c), E4(d, t), n && d.errors.push(n), d.pendingCount === 0 && !d.done && (Object.keys(d.loaded).forEach((h) => {
        f[h] || (f[h] = {});
        const m = d.loaded[h];
        m.length && m.forEach((b) => {
          f[h][b] === void 0 && (f[h][b] = !0);
        });
      }), d.done = !0, d.errors.length ? d.callback(d.errors) : d.callback());
    }), this.emit("loaded", f), this.queue = this.queue.filter((d) => !d.done);
  }
  read(t, n, i) {
    let a = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : 0, s = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : this.retryTimeout, c = arguments.length > 5 ? arguments[5] : void 0;
    if (!t.length) return c(null, {});
    if (this.readingCalls >= this.maxParallelReads) {
      this.waitingReads.push({
        lng: t,
        ns: n,
        fcName: i,
        tried: a,
        wait: s,
        callback: c
      });
      return;
    }
    this.readingCalls++;
    const f = (h, m) => {
      if (this.readingCalls--, this.waitingReads.length > 0) {
        const b = this.waitingReads.shift();
        this.read(b.lng, b.ns, b.fcName, b.tried, b.wait, b.callback);
      }
      if (h && m && a < this.maxRetries) {
        setTimeout(() => {
          this.read.call(this, t, n, i, a + 1, s * 2, c);
        }, s);
        return;
      }
      c(h, m);
    }, d = this.backend[i].bind(this.backend);
    if (d.length === 2) {
      try {
        const h = d(t, n);
        h && typeof h.then == "function" ? h.then((m) => f(null, m)).catch(f) : f(null, h);
      } catch (h) {
        f(h);
      }
      return;
    }
    return d(t, n, f);
  }
  prepareLoading(t, n) {
    let i = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {}, a = arguments.length > 3 ? arguments[3] : void 0;
    if (!this.backend)
      return this.logger.warn("No backend was added via i18next.use. Will not load resources."), a && a();
    Ne(t) && (t = this.languageUtils.toResolveHierarchy(t)), Ne(n) && (n = [n]);
    const s = this.queueLoad(t, n, i, a);
    if (!s.toLoad.length)
      return s.pending.length || a(), null;
    s.toLoad.forEach((c) => {
      this.loadOne(c);
    });
  }
  load(t, n, i) {
    this.prepareLoading(t, n, {}, i);
  }
  reload(t, n, i) {
    this.prepareLoading(t, n, {
      reload: !0
    }, i);
  }
  loadOne(t) {
    let n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "";
    const i = t.split("|"), a = i[0], s = i[1];
    this.read(a, s, "read", void 0, void 0, (c, f) => {
      c && this.logger.warn(`${n}loading namespace ${s} for language ${a} failed`, c), !c && f && this.logger.log(`${n}loaded namespace ${s} for language ${a}`, f), this.loaded(t, c, f);
    });
  }
  saveMissing(t, n, i, a, s) {
    let c = arguments.length > 5 && arguments[5] !== void 0 ? arguments[5] : {}, f = arguments.length > 6 && arguments[6] !== void 0 ? arguments[6] : () => {
    };
    if (this.services.utils && this.services.utils.hasLoadedNamespace && !this.services.utils.hasLoadedNamespace(n)) {
      this.logger.warn(`did not save key "${i}" as the namespace "${n}" was not yet loaded`, "This means something IS WRONG in your setup. You access the t function before i18next.init / i18next.loadNamespace / i18next.changeLanguage was done. Wait for the callback or Promise to resolve before accessing it!!!");
      return;
    }
    if (!(i == null || i === "")) {
      if (this.backend && this.backend.create) {
        const d = {
          ...c,
          isUpdate: s
        }, h = this.backend.create.bind(this.backend);
        if (h.length < 6)
          try {
            let m;
            h.length === 5 ? m = h(t, n, i, a, d) : m = h(t, n, i, a), m && typeof m.then == "function" ? m.then((b) => f(null, b)).catch(f) : f(null, m);
          } catch (m) {
            f(m);
          }
        else
          h(t, n, i, a, f, d);
      }
      !t || !t[0] || this.store.addResource(t[0], n, i, a);
    }
  }
}
const B0 = () => ({
  debug: !1,
  initImmediate: !0,
  ns: ["translation"],
  defaultNS: ["translation"],
  fallbackLng: ["dev"],
  fallbackNS: !1,
  supportedLngs: !1,
  nonExplicitSupportedLngs: !1,
  load: "all",
  preload: !1,
  simplifyPluralSuffix: !0,
  keySeparator: ".",
  nsSeparator: ":",
  pluralSeparator: "_",
  contextSeparator: "_",
  partialBundledLanguages: !1,
  saveMissing: !1,
  updateMissing: !1,
  saveMissingTo: "fallback",
  saveMissingPlurals: !0,
  missingKeyHandler: !1,
  missingInterpolationHandler: !1,
  postProcess: !1,
  postProcessPassResolved: !1,
  returnNull: !1,
  returnEmptyString: !0,
  returnObjects: !1,
  joinArrays: !1,
  returnedObjectHandler: !1,
  parseMissingKeyHandler: !1,
  appendNamespaceToMissingKey: !1,
  appendNamespaceToCIMode: !1,
  overloadTranslationOptionHandler: (e) => {
    let t = {};
    if (typeof e[1] == "object" && (t = e[1]), Ne(e[1]) && (t.defaultValue = e[1]), Ne(e[2]) && (t.tDescription = e[2]), typeof e[2] == "object" || typeof e[3] == "object") {
      const n = e[3] || e[2];
      Object.keys(n).forEach((i) => {
        t[i] = n[i];
      });
    }
    return t;
  },
  interpolation: {
    escapeValue: !0,
    format: (e) => e,
    prefix: "{{",
    suffix: "}}",
    formatSeparator: ",",
    unescapePrefix: "-",
    nestingPrefix: "$t(",
    nestingSuffix: ")",
    nestingOptionsSeparator: ",",
    maxReplaces: 1e3,
    skipOnVariables: !0
  }
}), D0 = (e) => (Ne(e.ns) && (e.ns = [e.ns]), Ne(e.fallbackLng) && (e.fallbackLng = [e.fallbackLng]), Ne(e.fallbackNS) && (e.fallbackNS = [e.fallbackNS]), e.supportedLngs && e.supportedLngs.indexOf("cimode") < 0 && (e.supportedLngs = e.supportedLngs.concat(["cimode"])), e), Rs = () => {
}, O4 = (e) => {
  Object.getOwnPropertyNames(Object.getPrototypeOf(e)).forEach((n) => {
    typeof e[n] == "function" && (e[n] = e[n].bind(e));
  });
};
class da extends wu {
  constructor() {
    let t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, n = arguments.length > 1 ? arguments[1] : void 0;
    if (super(), this.options = D0(t), this.services = {}, this.logger = fn, this.modules = {
      external: []
    }, O4(this), n && !this.isInitialized && !t.isClone) {
      if (!this.options.initImmediate)
        return this.init(t, n), this;
      setTimeout(() => {
        this.init(t, n);
      }, 0);
    }
  }
  init() {
    var t = this;
    let n = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, i = arguments.length > 1 ? arguments[1] : void 0;
    this.isInitializing = !0, typeof n == "function" && (i = n, n = {}), !n.defaultNS && n.defaultNS !== !1 && n.ns && (Ne(n.ns) ? n.defaultNS = n.ns : n.ns.indexOf("translation") < 0 && (n.defaultNS = n.ns[0]));
    const a = B0();
    this.options = {
      ...a,
      ...this.options,
      ...D0(n)
    }, this.options.compatibilityAPI !== "v1" && (this.options.interpolation = {
      ...a.interpolation,
      ...this.options.interpolation
    }), n.keySeparator !== void 0 && (this.options.userDefinedKeySeparator = n.keySeparator), n.nsSeparator !== void 0 && (this.options.userDefinedNsSeparator = n.nsSeparator);
    const s = (m) => m ? typeof m == "function" ? new m() : m : null;
    if (!this.options.isClone) {
      this.modules.logger ? fn.init(s(this.modules.logger), this.options) : fn.init(null, this.options);
      let m;
      this.modules.formatter ? m = this.modules.formatter : typeof Intl < "u" && (m = $4);
      const b = new R0(this.options);
      this.store = new P0(this.options.resources, this.options);
      const v = this.services;
      v.logger = fn, v.resourceStore = this.store, v.languageUtils = b, v.pluralResolver = new S4(b, {
        prepend: this.options.pluralSeparator,
        compatibilityJSON: this.options.compatibilityJSON,
        simplifyPluralSuffix: this.options.simplifyPluralSuffix
      }), m && (!this.options.interpolation.format || this.options.interpolation.format === a.interpolation.format) && (v.formatter = s(m), v.formatter.init(v, this.options), this.options.interpolation.format = v.formatter.format.bind(v.formatter)), v.interpolator = new C4(this.options), v.utils = {
        hasLoadedNamespace: this.hasLoadedNamespace.bind(this)
      }, v.backendConnector = new T4(s(this.modules.backend), v.resourceStore, v, this.options), v.backendConnector.on("*", function(_) {
        for (var x = arguments.length, T = new Array(x > 1 ? x - 1 : 0), R = 1; R < x; R++)
          T[R - 1] = arguments[R];
        t.emit(_, ...T);
      }), this.modules.languageDetector && (v.languageDetector = s(this.modules.languageDetector), v.languageDetector.init && v.languageDetector.init(v, this.options.detection, this.options)), this.modules.i18nFormat && (v.i18nFormat = s(this.modules.i18nFormat), v.i18nFormat.init && v.i18nFormat.init(this)), this.translator = new nu(this.services, this.options), this.translator.on("*", function(_) {
        for (var x = arguments.length, T = new Array(x > 1 ? x - 1 : 0), R = 1; R < x; R++)
          T[R - 1] = arguments[R];
        t.emit(_, ...T);
      }), this.modules.external.forEach((_) => {
        _.init && _.init(this);
      });
    }
    if (this.format = this.options.interpolation.format, i || (i = Rs), this.options.fallbackLng && !this.services.languageDetector && !this.options.lng) {
      const m = this.services.languageUtils.getFallbackCodes(this.options.fallbackLng);
      m.length > 0 && m[0] !== "dev" && (this.options.lng = m[0]);
    }
    !this.services.languageDetector && !this.options.lng && this.logger.warn("init: no languageDetector is used and no lng is defined"), ["getResource", "hasResourceBundle", "getResourceBundle", "getDataByLanguage"].forEach((m) => {
      this[m] = function() {
        return t.store[m](...arguments);
      };
    }), ["addResource", "addResources", "addResourceBundle", "removeResourceBundle"].forEach((m) => {
      this[m] = function() {
        return t.store[m](...arguments), t;
      };
    });
    const d = Tl(), h = () => {
      const m = (b, v) => {
        this.isInitializing = !1, this.isInitialized && !this.initializedStoreOnce && this.logger.warn("init: i18next is already initialized. You should call init just once!"), this.isInitialized = !0, this.options.isClone || this.logger.log("initialized", this.options), this.emit("initialized", this.options), d.resolve(v), i(b, v);
      };
      if (this.languages && this.options.compatibilityAPI !== "v1" && !this.isInitialized) return m(null, this.t.bind(this));
      this.changeLanguage(this.options.lng, m);
    };
    return this.options.resources || !this.options.initImmediate ? h() : setTimeout(h, 0), d;
  }
  loadResources(t) {
    let i = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : Rs;
    const a = Ne(t) ? t : this.language;
    if (typeof t == "function" && (i = t), !this.options.resources || this.options.partialBundledLanguages) {
      if (a && a.toLowerCase() === "cimode" && (!this.options.preload || this.options.preload.length === 0)) return i();
      const s = [], c = (f) => {
        if (!f || f === "cimode") return;
        this.services.languageUtils.toResolveHierarchy(f).forEach((h) => {
          h !== "cimode" && s.indexOf(h) < 0 && s.push(h);
        });
      };
      a ? c(a) : this.services.languageUtils.getFallbackCodes(this.options.fallbackLng).forEach((d) => c(d)), this.options.preload && this.options.preload.forEach((f) => c(f)), this.services.backendConnector.load(s, this.options.ns, (f) => {
        !f && !this.resolvedLanguage && this.language && this.setResolvedLanguage(this.language), i(f);
      });
    } else
      i(null);
  }
  reloadResources(t, n, i) {
    const a = Tl();
    return typeof t == "function" && (i = t, t = void 0), typeof n == "function" && (i = n, n = void 0), t || (t = this.languages), n || (n = this.options.ns), i || (i = Rs), this.services.backendConnector.reload(t, n, (s) => {
      a.resolve(), i(s);
    }), a;
  }
  use(t) {
    if (!t) throw new Error("You are passing an undefined module! Please check the object you are passing to i18next.use()");
    if (!t.type) throw new Error("You are passing a wrong module! Please check the object you are passing to i18next.use()");
    return t.type === "backend" && (this.modules.backend = t), (t.type === "logger" || t.log && t.warn && t.error) && (this.modules.logger = t), t.type === "languageDetector" && (this.modules.languageDetector = t), t.type === "i18nFormat" && (this.modules.i18nFormat = t), t.type === "postProcessor" && ny.addPostProcessor(t), t.type === "formatter" && (this.modules.formatter = t), t.type === "3rdParty" && this.modules.external.push(t), this;
  }
  setResolvedLanguage(t) {
    if (!(!t || !this.languages) && !(["cimode", "dev"].indexOf(t) > -1))
      for (let n = 0; n < this.languages.length; n++) {
        const i = this.languages[n];
        if (!(["cimode", "dev"].indexOf(i) > -1) && this.store.hasLanguageSomeTranslations(i)) {
          this.resolvedLanguage = i;
          break;
        }
      }
  }
  changeLanguage(t, n) {
    var i = this;
    this.isLanguageChangingTo = t;
    const a = Tl();
    this.emit("languageChanging", t);
    const s = (d) => {
      this.language = d, this.languages = this.services.languageUtils.toResolveHierarchy(d), this.resolvedLanguage = void 0, this.setResolvedLanguage(d);
    }, c = (d, h) => {
      h ? (s(h), this.translator.changeLanguage(h), this.isLanguageChangingTo = void 0, this.emit("languageChanged", h), this.logger.log("languageChanged", h)) : this.isLanguageChangingTo = void 0, a.resolve(function() {
        return i.t(...arguments);
      }), n && n(d, function() {
        return i.t(...arguments);
      });
    }, f = (d) => {
      !t && !d && this.services.languageDetector && (d = []);
      const h = Ne(d) ? d : this.services.languageUtils.getBestMatchFromCodes(d);
      h && (this.language || s(h), this.translator.language || this.translator.changeLanguage(h), this.services.languageDetector && this.services.languageDetector.cacheUserLanguage && this.services.languageDetector.cacheUserLanguage(h)), this.loadResources(h, (m) => {
        c(m, h);
      });
    };
    return !t && this.services.languageDetector && !this.services.languageDetector.async ? f(this.services.languageDetector.detect()) : !t && this.services.languageDetector && this.services.languageDetector.async ? this.services.languageDetector.detect.length === 0 ? this.services.languageDetector.detect().then(f) : this.services.languageDetector.detect(f) : f(t), a;
  }
  getFixedT(t, n, i) {
    var a = this;
    const s = function(c, f) {
      let d;
      if (typeof f != "object") {
        for (var h = arguments.length, m = new Array(h > 2 ? h - 2 : 0), b = 2; b < h; b++)
          m[b - 2] = arguments[b];
        d = a.options.overloadTranslationOptionHandler([c, f].concat(m));
      } else
        d = {
          ...f
        };
      d.lng = d.lng || s.lng, d.lngs = d.lngs || s.lngs, d.ns = d.ns || s.ns, d.keyPrefix !== "" && (d.keyPrefix = d.keyPrefix || i || s.keyPrefix);
      const v = a.options.keySeparator || ".";
      let _;
      return d.keyPrefix && Array.isArray(c) ? _ = c.map((x) => `${d.keyPrefix}${v}${x}`) : _ = d.keyPrefix ? `${d.keyPrefix}${v}${c}` : c, a.t(_, d);
    };
    return Ne(t) ? s.lng = t : s.lngs = t, s.ns = n, s.keyPrefix = i, s;
  }
  t() {
    return this.translator && this.translator.translate(...arguments);
  }
  exists() {
    return this.translator && this.translator.exists(...arguments);
  }
  setDefaultNamespace(t) {
    this.options.defaultNS = t;
  }
  hasLoadedNamespace(t) {
    let n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    if (!this.isInitialized)
      return this.logger.warn("hasLoadedNamespace: i18next was not initialized", this.languages), !1;
    if (!this.languages || !this.languages.length)
      return this.logger.warn("hasLoadedNamespace: i18n.languages were undefined or empty", this.languages), !1;
    const i = n.lng || this.resolvedLanguage || this.languages[0], a = this.options ? this.options.fallbackLng : !1, s = this.languages[this.languages.length - 1];
    if (i.toLowerCase() === "cimode") return !0;
    const c = (f, d) => {
      const h = this.services.backendConnector.state[`${f}|${d}`];
      return h === -1 || h === 0 || h === 2;
    };
    if (n.precheck) {
      const f = n.precheck(this, c);
      if (f !== void 0) return f;
    }
    return !!(this.hasResourceBundle(i, t) || !this.services.backendConnector.backend || this.options.resources && !this.options.partialBundledLanguages || c(i, t) && (!a || c(s, t)));
  }
  loadNamespaces(t, n) {
    const i = Tl();
    return this.options.ns ? (Ne(t) && (t = [t]), t.forEach((a) => {
      this.options.ns.indexOf(a) < 0 && this.options.ns.push(a);
    }), this.loadResources((a) => {
      i.resolve(), n && n(a);
    }), i) : (n && n(), Promise.resolve());
  }
  loadLanguages(t, n) {
    const i = Tl();
    Ne(t) && (t = [t]);
    const a = this.options.preload || [], s = t.filter((c) => a.indexOf(c) < 0 && this.services.languageUtils.isSupportedCode(c));
    return s.length ? (this.options.preload = a.concat(s), this.loadResources((c) => {
      i.resolve(), n && n(c);
    }), i) : (n && n(), Promise.resolve());
  }
  dir(t) {
    if (t || (t = this.resolvedLanguage || (this.languages && this.languages.length > 0 ? this.languages[0] : this.language)), !t) return "rtl";
    const n = ["ar", "shu", "sqr", "ssh", "xaa", "yhd", "yud", "aao", "abh", "abv", "acm", "acq", "acw", "acx", "acy", "adf", "ads", "aeb", "aec", "afb", "ajp", "apc", "apd", "arb", "arq", "ars", "ary", "arz", "auz", "avl", "ayh", "ayl", "ayn", "ayp", "bbz", "pga", "he", "iw", "ps", "pbt", "pbu", "pst", "prp", "prd", "ug", "ur", "ydd", "yds", "yih", "ji", "yi", "hbo", "men", "xmn", "fa", "jpr", "peo", "pes", "prs", "dv", "sam", "ckb"], i = this.services && this.services.languageUtils || new R0(B0());
    return n.indexOf(i.getLanguagePartFromCode(t)) > -1 || t.toLowerCase().indexOf("-arab") > 1 ? "rtl" : "ltr";
  }
  static createInstance() {
    let t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, n = arguments.length > 1 ? arguments[1] : void 0;
    return new da(t, n);
  }
  cloneInstance() {
    let t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : Rs;
    const i = t.forkResourceStore;
    i && delete t.forkResourceStore;
    const a = {
      ...this.options,
      ...t,
      isClone: !0
    }, s = new da(a);
    return (t.debug !== void 0 || t.prefix !== void 0) && (s.logger = s.logger.clone(t)), ["store", "services", "language"].forEach((f) => {
      s[f] = this[f];
    }), s.services = {
      ...this.services
    }, s.services.utils = {
      hasLoadedNamespace: s.hasLoadedNamespace.bind(s)
    }, i && (s.store = new P0(this.store.data, a), s.services.resourceStore = s.store), s.translator = new nu(s.services, a), s.translator.on("*", function(f) {
      for (var d = arguments.length, h = new Array(d > 1 ? d - 1 : 0), m = 1; m < d; m++)
        h[m - 1] = arguments[m];
      s.emit(f, ...h);
    }), s.init(a, n), s.translator.options = a, s.translator.backendConnector.services.utils = {
      hasLoadedNamespace: s.hasLoadedNamespace.bind(s)
    }, s;
  }
  toJSON() {
    return {
      options: this.options,
      store: this.store,
      language: this.language,
      languages: this.languages,
      resolvedLanguage: this.resolvedLanguage
    };
  }
}
const ir = da.createInstance();
ir.createInstance = da.createInstance;
const L4 = ir.createInstance;
ir.dir;
ir.init;
ir.loadResources;
ir.reloadResources;
ir.use;
ir.changeLanguage;
ir.getFixedT;
ir.t;
ir.exists;
ir.setDefaultNamespace;
ir.hasLoadedNamespace;
ir.loadNamespaces;
ir.loadLanguages;
const P4 = { title: "AstroPhoto", label: "AstroPhoto views", nodes: "Nodes", assets: "Assets", settings: "Settings" }, N4 = { back: "← Back", retry: "Retry", refresh: "Refresh" }, R4 = { loading: "Loading…", error: "Unable to retrieve status", available: "Available", unavailable: "Unavailable", planned: "Planned", partial: "Partially implemented" }, I4 = { clear: "Clear search", filter: "Filter categories", sort: "Sort", allCategories: "All categories", original: "Original order", alphabetical: "Alphabetical", newest: "Newest first", oldest: "Oldest first", name: "Name (A–Z)" }, A4 = { search: "Search nodes…", refresh: "Refresh node definitions", empty: "No registered AstroPhoto nodes.", noResults: "No matching nodes.", uncategorized: "Uncategorized", noDescription: "No description provided by this node.", add: "Add to canvas", addNamed: "Add {{name}} to canvas", registered: "Registered in ComfyUI.", inputs: "Inputs", outputs: "Outputs", dependencies: "Registration does not confirm external software availability.", helpUnavailable: "Dedicated documentation is not available for this node.", created: "Node created. Save the workflow using ComfyUI." }, B4 = { search: "Search assets…", refreshStatus: "Refresh asset service status", frameType: "Frame type", all: "All frame types", light: "Light", dark: "Dark", flat: "Flat", bias: "Bias", darkFlat: "Dark Flat", import: "Import capture directory", sessions: "Capture Sessions", noSessions: "Session browsing requires the asset service.", library: "Asset library", unavailable: "Assets are not connected yet. Import, details and canvas placement require an asset service and a registered Asset Source node.", serviceMissing: "The backend reports that asset management is unavailable.", adapterMissing: "The asset UI contract is not connected in this version.", searchPending: "Search “{{query}}” will be available when the asset service is connected." }, D4 = { language: "Language", auto: "Follow ComfyUI", theme: "Theme follows ComfyUI Light / Dark.", plannedNote: "This module is planned. Configuration and operations are not available yet.", agentNote: "The independent MCP provides version and connection diagnostics only. Agent context integration is planned; this page does not verify an Agent connection.", backendCapability: "Related backend capability", version: "Extension version", api: "API version", status: "Runtime status", nodeRegistered: "Drawing node registration", capabilities: "Backend capabilities", statusBoundary: "This status does not verify canvas execution, upload, external software or Agent connectivity." }, M4 = { software: { title: "Software", description: "Discover Siril / PixInsight, validate program paths, versions and processing capabilities." }, equipment: { title: "Equipment & Optics", description: "Cameras, telescopes, filters and optical trains." }, "observing-site": { title: "Observing Sites", description: "Observing locations, time zones and light pollution sources." }, knowledge: { title: "Knowledge", description: "Documentation, tutorials, cited retrieval sources and knowledge indexes." }, memory: { title: "Memory & Privacy", description: "User-controlled preferences and consent, memory review, correction and deletion." }, agent: { title: "Agent Context & MCP", description: "Task context, tool capabilities and Agent connections." }, system: { title: "System Status", description: "Extension version, registration and actual backend capabilities." } }, j4 = { http: "Request failed (HTTP {{status}}).", json: "The server returned invalid JSON.", schema: "The server response does not match the supported contract.", timeout: "The request timed out.", network: "Unable to connect to ComfyUI.", canvas: "Could not create a node. Check that the canvas is editable and the node is registered.", unknown: "An unexpected error occurred.", preference: "Unable to update the language preference." }, F4 = {
  nav: P4,
  actions: N4,
  states: R4,
  browse: I4,
  nodes: A4,
  assets: B4,
  settings: D4,
  modules: M4,
  errors: j4
}, z4 = { title: "天文图形工作流", label: "AstroPhoto 主视图", nodes: "节点", assets: "素材", settings: "设置" }, U4 = { back: "← 返回", retry: "重试", refresh: "刷新" }, W4 = { loading: "加载中…", error: "无法获取状态", available: "可用", unavailable: "不可用", planned: "规划中", partial: "部分实现" }, V4 = { clear: "清除搜索", filter: "按分类筛选", sort: "排序", allCategories: "全部分类", original: "原始顺序", alphabetical: "按名称排序", newest: "最新优先", oldest: "最早优先", name: "按名称排序" }, H4 = { search: "搜索节点…", refresh: "刷新节点定义", empty: "没有已注册的 AstroPhoto 节点。", noResults: "没有匹配的节点。", uncategorized: "未分类", noDescription: "此节点未提供说明。", add: "添加到画布", addNamed: "将 {{name}} 添加到画布", registered: "已在 ComfyUI 中注册。", inputs: "输入", outputs: "输出", dependencies: "节点注册不代表外部软件可用。", helpUnavailable: "此节点暂未提供专用文档。", created: "节点已创建。请使用 ComfyUI 保存工作流。" }, K4 = { search: "搜索素材…", refreshStatus: "刷新素材服务状态", frameType: "帧类型", all: "全部帧类型", light: "亮场 Light", dark: "暗场 Dark", flat: "平场 Flat", bias: "偏置 Bias", darkFlat: "暗平场 Dark Flat", import: "导入拍摄目录", sessions: "拍摄会话", noSessions: "会话浏览需要素材服务。", library: "素材库", unavailable: "素材尚未接入。导入、详情和画布放置需要素材服务及已注册的 Asset Source 节点。", serviceMissing: "后端报告素材管理当前不可用。", adapterMissing: "当前版本尚未接入素材 UI 接口契约。", searchPending: "素材服务接入后可搜索“{{query}}”。" }, Y4 = { language: "语言", auto: "跟随 ComfyUI", theme: "主题跟随 ComfyUI 明亮 / 深色模式。", plannedNote: "该模块处于规划阶段，暂不提供配置或执行操作。", agentNote: "独立 MCP 目前仅提供版本和连接诊断。Agent 上下文集成仍在规划中；此页面不验证 Agent 连接。", backendCapability: "相关后端能力", version: "扩展版本", api: "API 版本", status: "运行状态", nodeRegistered: "画板节点注册", capabilities: "后端能力", statusBoundary: "此状态不验证画布执行、上传、外部软件或 Agent 连接。" }, G4 = { software: { title: "软件管理", description: "检测 Siril / PixInsight，验证程序路径、版本及处理能力。" }, equipment: { title: "设备与光学链路", description: "相机、望远镜、滤镜与光学链路。" }, "observing-site": { title: "观测地与光污染", description: "观测地点、时区和光污染来源。" }, knowledge: { title: "知识库", description: "官方文档、教程、可引用检索来源与知识索引。" }, memory: { title: "用户记忆与隐私", description: "用户可控的偏好与授权，记忆审阅、更正及删除。" }, agent: { title: "Agent 上下文与 MCP", description: "任务上下文、工具能力和 Agent 连接。" }, system: { title: "系统状态", description: "扩展版本、注册状态与真实后端能力。" } }, X4 = { http: "请求失败（HTTP {{status}}）。", json: "服务器返回的 JSON 无效。", schema: "服务器响应不符合当前支持的接口契约。", timeout: "请求超时。", network: "无法连接到 ComfyUI。", canvas: "无法创建节点。请检查画布是否可编辑及节点是否已注册。", unknown: "发生未知错误。", preference: "无法更新语言偏好。" }, Q4 = {
  nav: z4,
  actions: U4,
  states: W4,
  browse: V4,
  nodes: H4,
  assets: K4,
  settings: Y4,
  modules: G4,
  errors: X4
}, ou = L4();
ou.use(MI).init({
  lng: "en",
  fallbackLng: "en",
  supportedLngs: ["en", "zh"],
  resources: { en: { translation: F4 }, zh: { translation: Q4 } },
  interpolation: { escapeValue: !1 },
  react: { useSuspense: !1 },
  initImmediate: !1
});
function J4(e) {
  return typeof e == "string" && /^zh(?:-|_|$)/i.test(e) ? "zh" : "en";
}
function M0() {
  const e = Dn.extensionManager.setting.get("Comfy.Locale"), t = J4(e || navigator.language || "en");
  ou.language !== t && ou.changeLanguage(t);
}
function q4(e) {
  M0();
  const t = () => {
    e.getClientRects().length && !document.hidden && M0();
  }, n = window.setInterval(t, 500);
  return window.addEventListener("focus", t), () => {
    clearInterval(n), window.removeEventListener("focus", t);
  };
}
const j0 = "astrophoto.sidebar";
function Z4(e) {
  if (e.extensionManager.getSidebarTabs().some((c) => c.id === j0)) return;
  let t, n, i, a;
  const s = () => {
    a == null || a(), a = void 0, t == null || t.unmount(), t = void 0, n == null || n.remove(), n = void 0, i == null || i.classList.remove("astrophoto-host-container"), i = void 0;
  };
  e.extensionManager.registerSidebarTab({
    id: j0,
    title: "AstroPhoto",
    tooltip: "AstroPhoto",
    icon: "astrophoto-sidebar-icon",
    type: "custom",
    render(c) {
      t && (n == null ? void 0 : n.parentElement) === c || (s(), i = c, i.classList.add("astrophoto-host-container"), n = document.createElement("div"), n.className = "astrophoto-ui", c.appendChild(n), a = q4(n), t = xI.createRoot(n), t.render(/* @__PURE__ */ M.jsx(UI, { i18n: ou, children: /* @__PURE__ */ M.jsx(l4, {}) })));
    },
    destroy: s
  });
}
Dn.registerExtension({ name: "AstroPhoto.Sidebar", setup() {
  Z4(Dn);
} });
