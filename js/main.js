import { app as e, app as t } from "../../scripts/app.js";
import { api as n } from "../../scripts/api.js";
// node_modules/.pnpm/@vue+shared@3.5.42/node_modules/@vue/shared/dist/shared.esm-bundler.js
// @__NO_SIDE_EFFECTS__
function r(e) {
	let t = /* @__PURE__ */ Object.create(null);
	for (let n of e.split(",")) t[n] = 1;
	return (e) => e in t;
}
var i = {}, a = [], o = () => {}, s = () => !1, c = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && (e.charCodeAt(2) > 122 || e.charCodeAt(2) < 97), l = (e) => e.startsWith("onUpdate:"), u = Object.assign, d = (e, t) => {
	let n = e.indexOf(t);
	n > -1 && e.splice(n, 1);
}, f = Object.prototype.hasOwnProperty, p = (e, t) => f.call(e, t), m = Array.isArray, h = (e) => w(e) === "[object Map]", g = (e) => w(e) === "[object Set]", _ = (e) => w(e) === "[object Date]", v = (e) => typeof e == "function", y = (e) => typeof e == "string", b = (e) => typeof e == "symbol", x = (e) => typeof e == "object" && !!e, S = (e) => (x(e) || v(e)) && v(e.then) && v(e.catch), C = Object.prototype.toString, w = (e) => C.call(e), T = (e) => w(e).slice(8, -1), E = (e) => w(e) === "[object Object]", D = (e) => y(e) && e !== "NaN" && e[0] !== "-" && "" + parseInt(e, 10) === e, O = /* @__PURE__ */ r(",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"), k = (e) => {
	let t = /* @__PURE__ */ Object.create(null);
	return ((n) => t[n] || (t[n] = e(n)));
}, A = /-\w/g, j = k((e) => e.replace(A, (e) => e.slice(1).toUpperCase())), ee = /\B([A-Z])/g, te = k((e) => e.replace(ee, "-$1").toLowerCase()), M = k((e) => e.charAt(0).toUpperCase() + e.slice(1)), ne = k((e) => e ? `on${M(e)}` : ""), re = (e, t) => !Object.is(e, t), ie = (e, ...t) => {
	for (let n = 0; n < e.length; n++) e[n](...t);
}, ae = (e, t, n, r = !1) => {
	Object.defineProperty(e, t, {
		configurable: !0,
		enumerable: !1,
		writable: r,
		value: n
	});
}, oe = (e) => {
	let t = parseFloat(e);
	return isNaN(t) ? e : t;
}, se, ce = () => se ||= typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : {};
function le(e) {
	if (m(e)) {
		let t = {};
		for (let n = 0; n < e.length; n++) {
			let r = e[n], i = y(r) ? pe(r) : le(r);
			if (i) for (let e in i) t[e] = i[e];
		}
		return t;
	}
	if (y(e) || x(e)) return e;
}
var ue = /;(?![^(]*\))/g, de = /:([^]+)/, fe = /\/\*[^]*?\*\//g;
function pe(e) {
	let t = {};
	return e.replace(fe, "").split(ue).forEach((e) => {
		if (e) {
			let n = e.split(de);
			n.length > 1 && (t[n[0].trim()] = n[1].trim());
		}
	}), t;
}
function me(e) {
	let t = "";
	if (y(e)) t = e;
	else if (m(e)) for (let n = 0; n < e.length; n++) {
		let r = me(e[n]);
		r && (t += r + " ");
	}
	else if (x(e)) for (let n in e) e[n] && (t += n + " ");
	return t.trim();
}
function he(e) {
	if (!e) return null;
	let { class: t, style: n } = e;
	return t && !y(t) && (e.class = me(t)), n && (e.style = le(n)), e;
}
var ge = /* @__PURE__ */ r("itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly");
function _e(e) {
	return !!e || e === "";
}
function ve(e, t) {
	if (e.length !== t.length) return !1;
	let n = !0;
	for (let r = 0; n && r < e.length; r++) n = be(e[r], t[r]);
	return n;
}
function ye(e, t) {
	if (e.size !== t.size) return !1;
	let n = Array.from(t), r = new Uint8Array(n.length);
	for (let t of e) {
		let e = -1;
		for (let i = 0; i < n.length; i++) if (!r[i] && be(t, n[i])) {
			e = i;
			break;
		}
		if (e < 0) return !1;
		r[e] = 1;
	}
	return !0;
}
function be(e, t) {
	if (e === t) return !0;
	let n = _(e), r = _(t);
	if (n || r) return n && r ? e.getTime() === t.getTime() : !1;
	if (n = b(e), r = b(t), n || r) return e === t;
	if (n = m(e), r = m(t), n || r) return n && r ? ve(e, t) : !1;
	if (n = x(e), r = x(t), n || r) {
		if (!n || !r) return !1;
		if (n = h(e), r = h(t), n || r || (n = g(e), r = g(t), n || r)) return n && r ? ye(e, t) : !1;
		if (Object.keys(e).length !== Object.keys(t).length) return !1;
		for (let n in e) {
			let r = e.hasOwnProperty(n), i = t.hasOwnProperty(n);
			if (r && !i || !r && i || !be(e[n], t[n])) return !1;
		}
	}
	return String(e) === String(t);
}
function xe(e, t) {
	return e.findIndex((e) => be(e, t));
}
var Se = (e) => !!(e && e.__v_isRef === !0), N = (e) => y(e) ? e : e == null ? "" : m(e) || x(e) && (e.toString === C || !v(e.toString)) ? Se(e) ? N(e.value) : JSON.stringify(e, Ce, 2) : String(e), Ce = (e, t) => Se(t) ? Ce(e, t.value) : h(t) ? { [`Map(${t.size})`]: [...t.entries()].reduce((e, [t, n], r) => (e[we(t, r) + " =>"] = n, e), {}) } : g(t) ? { [`Set(${t.size})`]: [...t.values()].map((e) => we(e)) } : b(t) ? we(t) : x(t) && !m(t) && !E(t) ? String(t) : t, we = (e, t = "") => b(e) ? `Symbol(${e.description ?? t})` : e, Te, Ee = class {
	constructor(e = !1) {
		this.detached = e, this._active = !0, this._on = 0, this.effects = [], this.cleanups = [], this._isPaused = !1, this._warnOnRun = !0, this.__v_skip = !0, !e && Te && (Te.active ? (this.parent = Te, this.index = (Te.scopes || (Te.scopes = [])).push(this) - 1) : (this._active = !1, this._warnOnRun = !1));
	}
	get active() {
		return this._active;
	}
	pause() {
		if (this._active) {
			this._isPaused = !0;
			let e, t;
			if (this.scopes) {
				let n = this.scopes.slice();
				for (e = 0, t = n.length; e < t; e++) n[e].pause();
			}
			for (e = 0, t = this.effects.length; e < t; e++) this.effects[e].pause();
		}
	}
	resume() {
		if (this._active && this._isPaused) {
			this._isPaused = !1;
			let e, t;
			if (this.scopes) {
				let n = this.scopes.slice();
				for (e = 0, t = n.length; e < t; e++) n[e].resume();
			}
			let n = this.effects.slice();
			for (e = 0, t = n.length; e < t; e++) n[e].resume();
		}
	}
	run(e) {
		if (this._active) {
			let t = Te;
			try {
				return Te = this, e();
			} finally {
				Te = t;
			}
		}
	}
	on() {
		++this._on === 1 && (this.prevScope = Te, Te = this);
	}
	off() {
		if (this._on > 0 && --this._on === 0) {
			if (Te === this) Te = this.prevScope;
			else {
				let e = Te;
				for (; e;) {
					if (e.prevScope === this) {
						e.prevScope = this.prevScope;
						break;
					}
					e = e.prevScope;
				}
			}
			this.prevScope = void 0;
		}
	}
	stop(e) {
		if (this._active) {
			this._active = !1;
			let t, n;
			for (t = 0, n = this.effects.length; t < n; t++) this.effects[t].stop();
			for (this.effects.length = 0, t = 0, n = this.cleanups.length; t < n; t++) this.cleanups[t]();
			if (this.cleanups.length = 0, this.scopes) {
				let e = this.scopes.slice();
				for (t = 0, n = e.length; t < n; t++) e[t].stop(!0);
				this.scopes.length = 0;
			}
			if (!this.detached && this.parent && !e) {
				let e = this.parent.scopes.pop();
				e && e !== this && (this.parent.scopes[this.index] = e, e.index = this.index);
			}
			this.parent = void 0;
		}
	}
};
function De(e) {
	return new Ee(e);
}
function Oe() {
	return Te;
}
function ke(e, t = !1) {
	Te && Te.cleanups.push(e);
}
var Ae, je = /* @__PURE__ */ new WeakSet(), Me = class {
	constructor(e) {
		this.fn = e, this.deps = void 0, this.depsTail = void 0, this.flags = 5, this.next = void 0, this.cleanup = void 0, this.scheduler = void 0, Te && (Te.active ? Te.effects.push(this) : this.flags &= -2);
	}
	pause() {
		this.flags |= 64;
	}
	resume() {
		this.flags & 64 && (this.flags &= -65, je.has(this) && (je.delete(this), this.trigger()));
	}
	notify() {
		this.flags & 2 && !(this.flags & 32) || this.flags & 8 || Ie(this);
	}
	run() {
		if (!(this.flags & 1)) return this.fn();
		this.flags |= 2, Ye(this), ze(this);
		let e = Ae, t = Ge;
		Ae = this, Ge = !0;
		try {
			return this.fn();
		} finally {
			Be(this), Ae = e, Ge = t, this.flags &= -3;
		}
	}
	stop() {
		if (this.flags & 1) {
			for (let e = this.deps; e; e = e.nextDep) Ue(e);
			this.deps = this.depsTail = void 0, Ye(this), this.onStop && this.onStop(), this.flags &= -2;
		}
	}
	trigger() {
		this.flags & 64 ? je.add(this) : this.scheduler ? this.scheduler() : this.runIfDirty();
	}
	runIfDirty() {
		Ve(this) && this.run();
	}
	get dirty() {
		return Ve(this);
	}
}, Ne = 0, Pe, Fe;
function Ie(e, t = !1) {
	e.flags |= 8, t ? (e.next = Fe, Fe = e) : (e.next = Pe, Pe = e);
}
function Le() {
	Ne++;
}
function Re() {
	if (--Ne > 0) return;
	if (Fe) {
		let e = Fe;
		for (Fe = void 0; e;) {
			let t = e.next;
			e.next = void 0, e.flags &= -9, e = t;
		}
	}
	let e;
	for (; Pe;) {
		let t = Pe;
		for (Pe = void 0; t;) {
			let n = t.next;
			if (t.next = void 0, t.flags &= -9, t.flags & 1) try {
				t.trigger();
			} catch (t) {
				e ||= t;
			}
			t = n;
		}
	}
	if (e) throw e;
}
function ze(e) {
	for (let t = e.deps; t; t = t.nextDep) t.version = -1, t.prevActiveLink = t.dep.activeLink, t.dep.activeLink = t;
}
function Be(e) {
	let t, n = e.depsTail, r = n;
	for (; r;) {
		let e = r.prevDep;
		r.version === -1 ? (r === n && (n = e), Ue(r), We(r)) : t = r, r.dep.activeLink = r.prevActiveLink, r.prevActiveLink = void 0, r = e;
	}
	e.deps = t, e.depsTail = n;
}
function Ve(e) {
	for (let t = e.deps; t; t = t.nextDep) if (t.dep.version !== t.version || t.dep.computed && (He(t.dep.computed) || t.dep.version !== t.version)) return !0;
	return !!e._dirty;
}
function He(e) {
	if (e.flags & 4 && !(e.flags & 16) || (e.flags &= -17, e.globalVersion === Xe) || (e.globalVersion = Xe, !e.isSSR && e.flags & 128 && (!e.deps && !e._dirty || !Ve(e)))) return;
	e.flags |= 2;
	let t = e.dep, n = Ae, r = Ge;
	Ae = e, Ge = !0;
	try {
		ze(e);
		let n = e.fn(e._value);
		(t.version === 0 || re(n, e._value)) && (e.flags |= 128, e._value = n, t.version++);
	} catch (e) {
		throw t.version++, e;
	} finally {
		Ae = n, Ge = r, Be(e), e.flags &= -3;
	}
}
function Ue(e, t = !1) {
	let { dep: n, prevSub: r, nextSub: i } = e;
	if (r && (r.nextSub = i, e.prevSub = void 0), i && (i.prevSub = r, e.nextSub = void 0), n.subs === e && (n.subs = r, !r && n.computed)) {
		n.computed.flags &= -5;
		for (let e = n.computed.deps; e; e = e.nextDep) Ue(e, !0);
	}
	!t && !--n.sc && n.map && n.map.delete(n.key);
}
function We(e) {
	let { prevDep: t, nextDep: n } = e;
	t && (t.nextDep = n, e.prevDep = void 0), n && (n.prevDep = t, e.nextDep = void 0);
}
var Ge = !0, Ke = [];
function qe() {
	Ke.push(Ge), Ge = !1;
}
function Je() {
	let e = Ke.pop();
	Ge = e === void 0 || e;
}
function Ye(e) {
	let { cleanup: t } = e;
	if (e.cleanup = void 0, t) {
		let e = Ae;
		Ae = void 0;
		try {
			t();
		} finally {
			Ae = e;
		}
	}
}
var Xe = 0, Ze = class {
	constructor(e, t) {
		this.sub = e, this.dep = t, this.version = t.version, this.nextDep = this.prevDep = this.nextSub = this.prevSub = this.prevActiveLink = void 0;
	}
}, Qe = class {
	constructor(e) {
		this.computed = e, this.version = 0, this.activeLink = void 0, this.subs = void 0, this.map = void 0, this.key = void 0, this.sc = 0, this.__v_skip = !0;
	}
	track(e) {
		if (!Ae || !Ge || Ae === this.computed) return;
		let t = this.activeLink;
		if (t === void 0 || t.sub !== Ae) t = this.activeLink = new Ze(Ae, this), Ae.deps ? (t.prevDep = Ae.depsTail, Ae.depsTail.nextDep = t, Ae.depsTail = t) : Ae.deps = Ae.depsTail = t, $e(t);
		else if (t.version === -1 && (t.version = this.version, t.nextDep)) {
			let e = t.nextDep;
			e.prevDep = t.prevDep, t.prevDep && (t.prevDep.nextDep = e), t.prevDep = Ae.depsTail, t.nextDep = void 0, Ae.depsTail.nextDep = t, Ae.depsTail = t, Ae.deps === t && (Ae.deps = e);
		}
		return t;
	}
	trigger(e) {
		this.version++, Xe++, this.notify(e);
	}
	notify(e) {
		Le();
		try {
			for (let e = this.subs; e; e = e.prevSub) e.sub.notify() && e.sub.dep.notify();
		} finally {
			Re();
		}
	}
};
function $e(e) {
	if (e.dep.sc++, e.sub.flags & 4) {
		let t = e.dep.computed;
		if (t && !e.dep.subs) {
			t.flags |= 20;
			for (let e = t.deps; e; e = e.nextDep) $e(e);
		}
		let n = e.dep.subs;
		n !== e && (e.prevSub = n, n && (n.nextSub = e)), e.dep.subs = e;
	}
}
var et = /* @__PURE__ */ new WeakMap(), tt = /* @__PURE__ */ Symbol(""), nt = /* @__PURE__ */ Symbol(""), rt = /* @__PURE__ */ Symbol("");
function it(e, t, n) {
	if (Ge && Ae) {
		let t = et.get(e);
		t || et.set(e, t = /* @__PURE__ */ new Map());
		let r = t.get(n);
		r || (t.set(n, r = new Qe()), r.map = t, r.key = n), r.track();
	}
}
function at(e, t, n, r, i, a) {
	let o = et.get(e);
	if (!o) {
		Xe++;
		return;
	}
	let s = (e) => {
		e && e.trigger();
	};
	if (Le(), t === "clear") o.forEach(s);
	else {
		let i = m(e), a = i && D(n);
		if (i && n === "length") {
			let e = Number(r);
			o.forEach((t, n) => {
				(n === "length" || n === rt || !b(n) && n >= e) && s(t);
			});
		} else switch ((n !== void 0 || o.has(void 0)) && s(o.get(n)), a && s(o.get(rt)), t) {
			case "add":
				i ? a && s(o.get("length")) : (s(o.get(tt)), h(e) && s(o.get(nt)));
				break;
			case "delete":
				i || (s(o.get(tt)), h(e) && s(o.get(nt)));
				break;
			case "set": h(e) && s(o.get(tt));
		}
	}
	Re();
}
function ot(e, t) {
	let n = et.get(e);
	return n && n.get(t);
}
function st(e) {
	let t = /* @__PURE__ */ Zt(e);
	return t === e ? t : (it(t, "iterate", rt), /* @__PURE__ */ Yt(e) ? t : t.map($t));
}
function ct(e) {
	return it(e = /* @__PURE__ */ Zt(e), "iterate", rt), e;
}
function lt(e, t) {
	return /* @__PURE__ */ Jt(e) ? en(/* @__PURE__ */ qt(e) ? $t(t) : t) : $t(t);
}
var ut = {
	__proto__: null,
	[Symbol.iterator]() {
		return dt(this, Symbol.iterator, (e) => lt(this, e));
	},
	concat(...e) {
		return st(this).concat(...e.map((e) => m(e) ? st(e) : e));
	},
	entries() {
		return dt(this, "entries", (e) => (e[1] = lt(this, e[1]), e));
	},
	every(e, t) {
		return pt(this, "every", e, t, void 0, arguments);
	},
	filter(e, t) {
		return pt(this, "filter", e, t, (e) => e.map((e) => lt(this, e)), arguments);
	},
	find(e, t) {
		return pt(this, "find", e, t, (e) => lt(this, e), arguments);
	},
	findIndex(e, t) {
		return pt(this, "findIndex", e, t, void 0, arguments);
	},
	findLast(e, t) {
		return pt(this, "findLast", e, t, (e) => lt(this, e), arguments);
	},
	findLastIndex(e, t) {
		return pt(this, "findLastIndex", e, t, void 0, arguments);
	},
	forEach(e, t) {
		return pt(this, "forEach", e, t, void 0, arguments);
	},
	includes(...e) {
		return ht(this, "includes", e);
	},
	indexOf(...e) {
		return ht(this, "indexOf", e);
	},
	join(e) {
		return st(this).join(e);
	},
	lastIndexOf(...e) {
		return ht(this, "lastIndexOf", e);
	},
	map(e, t) {
		return pt(this, "map", e, t, void 0, arguments);
	},
	pop() {
		return gt(this, "pop");
	},
	push(...e) {
		return gt(this, "push", e);
	},
	reduce(e, ...t) {
		return mt(this, "reduce", e, t);
	},
	reduceRight(e, ...t) {
		return mt(this, "reduceRight", e, t);
	},
	shift() {
		return gt(this, "shift");
	},
	some(e, t) {
		return pt(this, "some", e, t, void 0, arguments);
	},
	splice(...e) {
		return gt(this, "splice", e);
	},
	toReversed() {
		return st(this).toReversed();
	},
	toSorted(e) {
		return st(this).toSorted(e);
	},
	toSpliced(...e) {
		return st(this).toSpliced(...e);
	},
	unshift(...e) {
		return gt(this, "unshift", e);
	},
	values() {
		return dt(this, "values", (e) => lt(this, e));
	}
};
function dt(e, t, n) {
	let r = ct(e), i = r[t]();
	return r !== e && !/* @__PURE__ */ Yt(e) && (i._next = i.next, i.next = () => {
		let e = i._next();
		return e.done || (e.value = n(e.value)), e;
	}), i;
}
var ft = Array.prototype;
function pt(e, t, n, r, i, a) {
	let o = ct(e), s = o !== e && !/* @__PURE__ */ Yt(e), c = o[t];
	if (c !== ft[t]) {
		let t = c.apply(e, a);
		return s ? $t(t) : t;
	}
	let l = n;
	o !== e && (s ? l = function(t, r) {
		return n.call(this, lt(e, t), r, e);
	} : n.length > 2 && (l = function(t, r) {
		return n.call(this, t, r, e);
	}));
	let u = c.call(o, l, r);
	return s && i ? i(u) : u;
}
function mt(e, t, n, r) {
	let i = ct(e), a = i !== e && !/* @__PURE__ */ Yt(e), o = n, s = !1;
	i !== e && (a ? (s = r.length === 0, o = function(t, r, i) {
		return s && (s = !1, t = lt(e, t)), n.call(this, t, lt(e, r), i, e);
	}) : n.length > 3 && (o = function(t, r, i) {
		return n.call(this, t, r, i, e);
	}));
	let c = i[t](o, ...r);
	return s ? lt(e, c) : c;
}
function ht(e, t, n) {
	let r = /* @__PURE__ */ Zt(e);
	it(r, "iterate", rt);
	let i = r[t](...n);
	return (i === -1 || i === !1) && /* @__PURE__ */ Xt(n[0]) ? (n[0] = /* @__PURE__ */ Zt(n[0]), r[t](...n)) : i;
}
function gt(e, t, n = []) {
	qe(), Le();
	let r = (/* @__PURE__ */ Zt(e))[t].apply(e, n);
	return Re(), Je(), r;
}
var _t = /* @__PURE__ */ r("__proto__,__v_isRef,__isVue"), vt = new Set(/* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((e) => e !== "arguments" && e !== "caller").map((e) => Symbol[e]).filter(b));
function yt(e) {
	b(e) || (e = String(e));
	let t = /* @__PURE__ */ Zt(this);
	return it(t, "has", e), t.hasOwnProperty(e);
}
var bt = class {
	constructor(e = !1, t = !1) {
		this._isReadonly = e, this._isShallow = t;
	}
	get(e, t, n) {
		if (t === "__v_skip") return e.__v_skip;
		let r = this._isReadonly, i = this._isShallow;
		if (t === "__v_isReactive") return !r;
		if (t === "__v_isReadonly") return r;
		if (t === "__v_isShallow") return i;
		if (t === "__v_raw") return n === (r ? i ? Bt : zt : i ? Rt : Lt).get(e) || Object.getPrototypeOf(e) === Object.getPrototypeOf(n) ? e : void 0;
		let a = m(e);
		if (!r) {
			let e;
			if (a && (e = ut[t])) return e;
			if (t === "hasOwnProperty") return yt;
		}
		let o = Reflect.get(e, t, /* @__PURE__ */ tn(e) ? e : n);
		if ((b(t) ? vt.has(t) : _t(t)) || (r || it(e, "get", t), i)) return o;
		if (/* @__PURE__ */ tn(o)) {
			let e = a && D(t) ? o : o.value;
			return r && x(e) ? /* @__PURE__ */ Wt(e) : e;
		}
		return x(o) ? r ? /* @__PURE__ */ Wt(o) : /* @__PURE__ */ Ht(o) : o;
	}
}, xt = class extends bt {
	constructor(e = !1) {
		super(!1, e);
	}
	set(e, t, n, r) {
		let i = e[t], a = m(e) && D(t);
		if (!this._isShallow) {
			let e = /* @__PURE__ */ Jt(i);
			if (!/* @__PURE__ */ Yt(n) && !/* @__PURE__ */ Jt(n) && (i = /* @__PURE__ */ Zt(i), n = /* @__PURE__ */ Zt(n)), !a && /* @__PURE__ */ tn(i) && !/* @__PURE__ */ tn(n)) return e || (i.value = n), !0;
		}
		let o = a ? Number(t) < e.length : p(e, t), s = Reflect.set(e, t, n, /* @__PURE__ */ tn(e) ? e : r);
		return e === /* @__PURE__ */ Zt(r) && s && (o ? re(n, i) && at(e, "set", t, n, i) : at(e, "add", t, n)), s;
	}
	deleteProperty(e, t) {
		let n = p(e, t), r = e[t], i = Reflect.deleteProperty(e, t);
		return i && n && at(e, "delete", t, void 0, r), i;
	}
	has(e, t) {
		let n = Reflect.has(e, t);
		return b(t) && vt.has(t) || it(e, "has", t), n;
	}
	ownKeys(e) {
		return it(e, "iterate", m(e) ? "length" : tt), Reflect.ownKeys(e);
	}
}, St = class extends bt {
	constructor(e = !1) {
		super(!0, e);
	}
	set(e, t) {
		return !0;
	}
	deleteProperty(e, t) {
		return !0;
	}
}, Ct = /* @__PURE__ */ new xt(), wt = /* @__PURE__ */ new St(), Tt = /* @__PURE__ */ new xt(!0), Et = /* @__PURE__ */ new St(!0), Dt = (e) => e, Ot = (e) => Reflect.getPrototypeOf(e);
function kt(e, t, n) {
	return function(...r) {
		let i = this.__v_raw, a = /* @__PURE__ */ Zt(i), o = h(a), s = e === "entries" || e === Symbol.iterator && o, c = e === "keys" && o, l = i[e](...r), d = n ? Dt : t ? en : $t;
		return !t && it(a, "iterate", c ? nt : tt), u(Object.create(l), { next() {
			let { value: e, done: t } = l.next();
			return t ? {
				value: e,
				done: t
			} : {
				value: s ? [d(e[0]), d(e[1])] : d(e),
				done: t
			};
		} });
	};
}
function At(e) {
	return function(...t) {
		return e === "delete" ? !1 : e === "clear" ? void 0 : this;
	};
}
function jt(e, t) {
	let n = {
		get(n) {
			let r = this.__v_raw, i = /* @__PURE__ */ Zt(r), a = /* @__PURE__ */ Zt(n);
			e || (re(n, a) && it(i, "get", n), it(i, "get", a));
			let { has: o } = Ot(i), s = t ? Dt : e ? en : $t;
			if (o.call(i, n)) return s(r.get(n));
			if (o.call(i, a)) return s(r.get(a));
			r !== i && r.get(n);
		},
		get size() {
			let t = this.__v_raw;
			return !e && it(/* @__PURE__ */ Zt(t), "iterate", tt), t.size;
		},
		has(t) {
			let n = this.__v_raw, r = /* @__PURE__ */ Zt(n), i = /* @__PURE__ */ Zt(t);
			return e || (re(t, i) && it(r, "has", t), it(r, "has", i)), t === i ? n.has(t) : n.has(t) || n.has(i);
		},
		forEach(n, r) {
			let i = this, a = i.__v_raw, o = /* @__PURE__ */ Zt(a), s = t ? Dt : e ? en : $t;
			return !e && it(o, "iterate", tt), a.forEach((e, t) => n.call(r, s(e), s(t), i));
		}
	};
	return u(n, e ? {
		add: At("add"),
		set: At("set"),
		delete: At("delete"),
		clear: At("clear")
	} : {
		add(e) {
			let n = /* @__PURE__ */ Zt(this), r = Ot(n), i = /* @__PURE__ */ Zt(e), a = !t && !/* @__PURE__ */ Yt(e) && !/* @__PURE__ */ Jt(e) ? i : e;
			return r.has.call(n, a) || re(e, a) && r.has.call(n, e) || re(i, a) && r.has.call(n, i) || (n.add(a), at(n, "add", a, a)), this;
		},
		set(e, n) {
			t || /* @__PURE__ */ Yt(n) || /* @__PURE__ */ Jt(n) || (n = /* @__PURE__ */ Zt(n));
			let r = /* @__PURE__ */ Zt(this), { has: i, get: a } = Ot(r), o = i.call(r, e);
			o ||= (e = /* @__PURE__ */ Zt(e), i.call(r, e));
			let s = a.call(r, e);
			return r.set(e, n), o ? re(n, s) && at(r, "set", e, n, s) : at(r, "add", e, n), this;
		},
		delete(e) {
			let t = /* @__PURE__ */ Zt(this), { has: n, get: r } = Ot(t), i = n.call(t, e);
			i ||= (e = /* @__PURE__ */ Zt(e), n.call(t, e));
			let a = r ? r.call(t, e) : void 0, o = t.delete(e);
			return i && at(t, "delete", e, void 0, a), o;
		},
		clear() {
			let e = /* @__PURE__ */ Zt(this), t = e.size !== 0, n = e.clear();
			return t && at(e, "clear", void 0, void 0, void 0), n;
		}
	}), [
		"keys",
		"values",
		"entries",
		Symbol.iterator
	].forEach((r) => {
		n[r] = kt(r, e, t);
	}), n;
}
function Mt(e, t) {
	let n = jt(e, t);
	return (t, r, i) => r === "__v_isReactive" ? !e : r === "__v_isReadonly" ? e : r === "__v_raw" ? t : Reflect.get(p(n, r) && r in t ? n : t, r, i);
}
var Nt = { get: /* @__PURE__ */ Mt(!1, !1) }, Pt = { get: /* @__PURE__ */ Mt(!1, !0) }, Ft = { get: /* @__PURE__ */ Mt(!0, !1) }, It = { get: /* @__PURE__ */ Mt(!0, !0) }, Lt = /* @__PURE__ */ new WeakMap(), Rt = /* @__PURE__ */ new WeakMap(), zt = /* @__PURE__ */ new WeakMap(), Bt = /* @__PURE__ */ new WeakMap();
function Vt(e) {
	switch (e) {
		case "Object":
		case "Array": return 1;
		case "Map":
		case "Set":
		case "WeakMap":
		case "WeakSet": return 2;
		default: return 0;
	}
}
// @__NO_SIDE_EFFECTS__
function Ht(e) {
	return /* @__PURE__ */ Jt(e) ? e : Kt(e, !1, Ct, Nt, Lt);
}
// @__NO_SIDE_EFFECTS__
function Ut(e) {
	return Kt(e, !1, Tt, Pt, Rt);
}
// @__NO_SIDE_EFFECTS__
function Wt(e) {
	return Kt(e, !0, wt, Ft, zt);
}
// @__NO_SIDE_EFFECTS__
function Gt(e) {
	return Kt(e, !0, Et, It, Bt);
}
function Kt(e, t, n, r, i) {
	if (!x(e) || e.__v_raw && !(t && e.__v_isReactive) || e.__v_skip || !Object.isExtensible(e)) return e;
	let a = i.get(e);
	if (a) return a;
	let o = Vt(T(e));
	if (o === 0) return e;
	let s = new Proxy(e, o === 2 ? r : n);
	return i.set(e, s), s;
}
// @__NO_SIDE_EFFECTS__
function qt(e) {
	return /* @__PURE__ */ Jt(e) ? /* @__PURE__ */ qt(e.__v_raw) : !!(e && e.__v_isReactive);
}
// @__NO_SIDE_EFFECTS__
function Jt(e) {
	return !!(e && e.__v_isReadonly);
}
// @__NO_SIDE_EFFECTS__
function Yt(e) {
	return !!(e && e.__v_isShallow);
}
// @__NO_SIDE_EFFECTS__
function Xt(e) {
	return e ? !!e.__v_raw : !1;
}
// @__NO_SIDE_EFFECTS__
function Zt(e) {
	let t = e && e.__v_raw;
	return t ? /* @__PURE__ */ Zt(t) : e;
}
function Qt(e) {
	return !p(e, "__v_skip") && Object.isExtensible(e) && ae(e, "__v_skip", !0), e;
}
var $t = (e) => x(e) ? /* @__PURE__ */ Ht(e) : e, en = (e) => x(e) ? /* @__PURE__ */ Wt(e) : e;
// @__NO_SIDE_EFFECTS__
function tn(e) {
	return e ? e.__v_isRef === !0 : !1;
}
// @__NO_SIDE_EFFECTS__
function P(e) {
	return nn(e, !1);
}
// @__NO_SIDE_EFFECTS__
function F(e) {
	return nn(e, !0);
}
function nn(e, t) {
	return /* @__PURE__ */ tn(e) ? e : new rn(e, t);
}
var rn = class {
	constructor(e, t) {
		this.dep = new Qe(), this.__v_isRef = !0, this.__v_isShallow = !1, this._rawValue = t ? e : /* @__PURE__ */ Zt(e), this._value = t ? e : $t(e), this.__v_isShallow = t;
	}
	get value() {
		return this.dep.track(), this._value;
	}
	set value(e) {
		let t = this._rawValue, n = this.__v_isShallow || /* @__PURE__ */ Yt(e) || /* @__PURE__ */ Jt(e);
		e = n ? e : /* @__PURE__ */ Zt(e), re(e, t) && (this._rawValue = e, this._value = n ? e : $t(e), this.dep.trigger());
	}
};
function an(e) {
	e.dep && e.dep.trigger();
}
function I(e) {
	return /* @__PURE__ */ tn(e) ? e.value : e;
}
function on(e) {
	return v(e) ? e() : I(e);
}
var sn = {
	get: (e, t, n) => t === "__v_raw" ? e : I(Reflect.get(e, t, n)),
	set: (e, t, n, r) => {
		let i = e[t];
		return /* @__PURE__ */ tn(i) && !/* @__PURE__ */ tn(n) ? (i.value = n, !0) : Reflect.set(e, t, n, r);
	}
};
function cn(e) {
	return /* @__PURE__ */ qt(e) ? e : new Proxy(e, sn);
}
var ln = class {
	constructor(e) {
		this.__v_isRef = !0, this._value = void 0;
		let t = this.dep = new Qe(), { get: n, set: r } = e(t.track.bind(t), t.trigger.bind(t));
		this._get = n, this._set = r;
	}
	get value() {
		return this._value = this._get();
	}
	set value(e) {
		this._set(e);
	}
};
function un(e) {
	return new ln(e);
}
// @__NO_SIDE_EFFECTS__
function dn(e) {
	let t = m(e) ? Array(e.length) : {};
	for (let n in e) t[n] = hn(e, n);
	return t;
}
var fn = class {
	constructor(e, t, n) {
		this._object = e, this._defaultValue = n, this.__v_isRef = !0, this._value = void 0, this._key = b(t) ? t : String(t), this._raw = /* @__PURE__ */ Zt(e);
		let r = !0, i = e;
		if (!m(e) || b(this._key) || !D(this._key)) do
			r = !/* @__PURE__ */ Xt(i) || /* @__PURE__ */ Yt(i);
		while (r && (i = i.__v_raw));
		this._shallow = r;
	}
	get value() {
		let e = this._object[this._key];
		return this._shallow && (e = I(e)), this._value = e === void 0 ? this._defaultValue : e;
	}
	set value(e) {
		if (this._shallow && /* @__PURE__ */ tn(this._raw[this._key])) {
			let t = this._object[this._key];
			if (/* @__PURE__ */ tn(t)) {
				t.value = e;
				return;
			}
		}
		this._object[this._key] = e;
	}
	get dep() {
		return ot(this._raw, this._key);
	}
}, pn = class {
	constructor(e) {
		this._getter = e, this.__v_isRef = !0, this.__v_isReadonly = !0, this._value = void 0;
	}
	get value() {
		return this._value = this._getter();
	}
};
// @__NO_SIDE_EFFECTS__
function mn(e, t, n) {
	return /* @__PURE__ */ tn(e) ? e : v(e) ? new pn(e) : x(e) && arguments.length > 1 ? hn(e, t, n) : /* @__PURE__ */ P(e);
}
function hn(e, t, n) {
	return new fn(e, t, n);
}
var gn = class {
	constructor(e, t, n) {
		this.fn = e, this.setter = t, this._value = void 0, this.dep = new Qe(this), this.__v_isRef = !0, this.deps = void 0, this.depsTail = void 0, this.flags = 16, this.globalVersion = Xe - 1, this.next = void 0, this.effect = this, this.__v_isReadonly = !t, this.isSSR = n;
	}
	notify() {
		if (this.flags |= 16, !(this.flags & 8) && Ae !== this) return Ie(this, !0), !0;
	}
	get value() {
		let e = this.dep.track();
		return He(this), e && (e.version = this.dep.version), this._value;
	}
	set value(e) {
		this.setter && this.setter(e);
	}
};
// @__NO_SIDE_EFFECTS__
function _n(e, t, n = !1) {
	let r, i;
	return v(e) ? r = e : (r = e.get, i = e.set), new gn(r, i, n);
}
var vn = {}, yn = /* @__PURE__ */ new WeakMap(), bn = void 0;
function xn(e, t = !1, n = bn) {
	if (n) {
		let t = yn.get(n);
		t || yn.set(n, t = []), t.push(e);
	}
}
function Sn(e, t, n = i) {
	let { immediate: r, deep: a, once: s, scheduler: c, augmentJob: l, call: u } = n, f = (e) => a ? e : /* @__PURE__ */ Yt(e) || a === !1 || a === 0 ? Cn(e, 1) : Cn(e), p, h, g, _, y = !1, b = !1;
	if (/* @__PURE__ */ tn(e) ? (h = () => e.value, y = /* @__PURE__ */ Yt(e)) : /* @__PURE__ */ qt(e) ? (h = () => f(e), y = !0) : m(e) ? (b = !0, y = e.some((e) => /* @__PURE__ */ qt(e) || /* @__PURE__ */ Yt(e)), h = () => e.map((e) => {
		if (/* @__PURE__ */ tn(e)) return e.value;
		if (/* @__PURE__ */ qt(e)) return f(e);
		if (v(e)) return u ? u(e, 2) : e();
	})) : h = v(e) ? t ? u ? () => u(e, 2) : e : () => {
		if (g) {
			qe();
			try {
				g();
			} finally {
				Je();
			}
		}
		let t = bn;
		bn = p;
		try {
			return u ? u(e, 3, [_]) : e(_);
		} finally {
			bn = t;
		}
	} : o, t && a) {
		let e = h, t = a === !0 ? Infinity : a;
		h = () => Cn(e(), t);
	}
	let x = Oe(), S = () => {
		p.stop(), x && x.active && d(x.effects, p);
	};
	if (s && t) {
		let e = t;
		t = (...t) => {
			let n = e(...t);
			return S(), n;
		};
	}
	let C = b ? Array(e.length).fill(vn) : vn, w = (e) => {
		if (p.flags & 1 && (p.dirty || e)) {
			if (t) {
				let n = p.run();
				if (e || a || y || (b ? n.some((e, t) => re(e, C[t])) : re(n, C))) {
					g && g();
					let e = bn;
					bn = p;
					try {
						let e = [
							n,
							C === vn ? void 0 : b && C[0] === vn ? [] : C,
							_
						];
						C = n, u ? u(t, 3, e) : t(...e);
					} finally {
						bn = e;
					}
				}
			} else p.run();
		}
	};
	return l && l(w), p = new Me(h), p.scheduler = c ? () => c(w, !1) : w, _ = (e) => xn(e, !1, p), g = p.onStop = () => {
		let e = yn.get(p);
		if (e) {
			if (u) u(e, 4);
			else for (let t of e) t();
			yn.delete(p);
		}
	}, t ? r ? w(!0) : C = p.run() : c ? c(w.bind(null, !0), !0) : p.run(), S.pause = p.pause.bind(p), S.resume = p.resume.bind(p), S.stop = S, S;
}
function Cn(e, t = Infinity, n) {
	if (t <= 0 || !x(e) || e.__v_skip || (n ||= /* @__PURE__ */ new Map(), (n.get(e) || 0) >= t)) return e;
	if (n.set(e, t), t--, /* @__PURE__ */ tn(e)) Cn(e.value, t, n);
	else if (m(e)) for (let r = 0; r < e.length; r++) Cn(e[r], t, n);
	else if (g(e) || h(e)) e.forEach((e) => {
		Cn(e, t, n);
	});
	else if (E(e)) {
		for (let r in e) Cn(e[r], t, n);
		for (let r of Object.getOwnPropertySymbols(e)) Object.prototype.propertyIsEnumerable.call(e, r) && Cn(e[r], t, n);
	}
	return e;
}
// node_modules/.pnpm/@vue+runtime-core@3.5.42/node_modules/@vue/runtime-core/dist/runtime-core.esm-bundler.js
function wn(e, t, n, r) {
	try {
		return r ? e(...r) : e();
	} catch (e) {
		En(e, t, n);
	}
}
function Tn(e, t, n, r) {
	if (v(e)) {
		let i = wn(e, t, n, r);
		return i && S(i) && i.catch((e) => {
			En(e, t, n);
		}), i;
	}
	if (m(e)) {
		let i = [];
		for (let a = 0; a < e.length; a++) i.push(Tn(e[a], t, n, r));
		return i;
	}
}
function En(e, t, n, r = !0) {
	let a = t ? t.vnode : null, { errorHandler: o, throwUnhandledErrorInProduction: s } = t && t.appContext.config || i;
	if (t) {
		let r = t.parent, i = t.proxy, a = `https://vuejs.org/error-reference/#runtime-${n}`;
		for (; r;) {
			let t = r.ec;
			if (t) {
				for (let n = 0; n < t.length; n++) if (t[n](e, i, a) === !1) return;
			}
			r = r.parent;
		}
		if (o) {
			qe(), wn(o, null, 10, [
				e,
				i,
				a
			]), Je();
			return;
		}
	}
	Dn(e, n, a, r, s);
}
function Dn(e, t, n, r = !0, i = !1) {
	if (i) throw e;
	console.error(e);
}
var On = [], kn = -1, An = [], jn = null, Mn = 0, Nn = /* @__PURE__ */ Promise.resolve(), Pn = null;
function Fn(e) {
	let t = Pn || Nn;
	return e ? t.then(this ? e.bind(this) : e) : t;
}
function In(e) {
	let t = kn + 1, n = On.length;
	for (; t < n;) {
		let r = t + n >>> 1, i = On[r], a = Hn(i);
		a < e || a === e && i.flags & 2 ? t = r + 1 : n = r;
	}
	return t;
}
function Ln(e) {
	if (!(e.flags & 1)) {
		let t = Hn(e), n = On[On.length - 1];
		!n || !(e.flags & 2) && t >= Hn(n) ? On.push(e) : On.splice(In(t), 0, e), e.flags |= 1, Rn();
	}
}
function Rn() {
	Pn ||= Nn.then(Un);
}
function zn(e) {
	if (!m(e)) jn && e.id === -1 ? jn.splice(Mn + 1, 0, e) : e.flags & 1 || (An.push(e), e.flags |= 1);
	else for (let t = 0; t < e.length; t++) An.push(e[t]);
	Rn();
}
function Bn(e, t, n = kn + 1) {
	for (; n < On.length; n++) {
		let t = On[n];
		if (t && t.flags & 2) {
			if (e && t.id !== e.uid) continue;
			On.splice(n, 1), n--, t.flags & 4 && (t.flags &= -2), t(), t.flags & 4 || (t.flags &= -2);
		}
	}
}
function Vn(e) {
	if (An.length) {
		let e = [...new Set(An)].sort((e, t) => Hn(e) - Hn(t));
		if (An.length = 0, jn) {
			for (let t = 0; t < e.length; t++) jn.push(e[t]);
			return;
		}
		for (jn = e, Mn = 0; Mn < jn.length; Mn++) {
			let e = jn[Mn];
			e.flags & 4 && (e.flags &= -2), e.flags & 8 || e(), e.flags &= -2;
		}
		jn = null, Mn = 0;
	}
}
var Hn = (e) => e.id == null ? e.flags & 2 ? -1 : Infinity : e.id;
function Un(e) {
	try {
		for (kn = 0; kn < On.length; kn++) {
			let e = On[kn];
			e && !(e.flags & 8) && (e.flags & 4 && (e.flags &= -2), wn(e, e.i, e.i ? 15 : 14), e.flags & 4 || (e.flags &= -2));
		}
	} finally {
		for (; kn < On.length; kn++) {
			let e = On[kn];
			e && (e.flags &= -2);
		}
		kn = -1, On.length = 0, Vn(e), Pn = null, (On.length || An.length) && Un(e);
	}
}
var Wn = null, Gn = null;
function Kn(e) {
	let t = Wn;
	return Wn = e, Gn = e && e.type.__scopeId || null, t;
}
function L(e, t = Wn, n) {
	if (!t || e._n) return e;
	let r = (...n) => {
		r._d && Da(-1);
		let i = Kn(t), a = Ca.length, o;
		try {
			o = e(...n);
		} finally {
			for (let e = Ca.length; e > a; e--) Ta();
			Kn(i), r._d && Da(1);
		}
		return o;
	};
	return r._n = !0, r._c = !0, r._d = !0, r;
}
function qn(e, t) {
	if (Wn === null) return e;
	let n = io(Wn), r = e.dirs ||= [];
	for (let e = 0; e < t.length; e++) {
		let [a, o, s, c = i] = t[e];
		a && (v(a) && (a = {
			mounted: a,
			updated: a
		}), a.deep && Cn(o), r.push({
			dir: a,
			instance: n,
			value: o,
			oldValue: void 0,
			arg: s,
			modifiers: c
		}));
	}
	return e;
}
function Jn(e, t, n, r) {
	let i = e.dirs, a = t && t.dirs;
	for (let o = 0; o < i.length; o++) {
		let s = i[o];
		a && (s.oldValue = a[o].value);
		let c = s.dir[r];
		c && (qe(), Tn(c, n, 8, [
			e.el,
			s,
			e,
			t
		]), Je());
	}
}
function Yn(e, t) {
	if (Wa) {
		let n = Wa.provides, r = Wa.parent && Wa.parent.provides;
		r === n && (n = Wa.provides = Object.create(r)), n[e] = t;
	}
}
function Xn(e, t, n = !1) {
	let r = Ga();
	if (r || ki) {
		let i = ki ? ki._context.provides : r ? r.parent == null || r.ce ? r.vnode.appContext && r.vnode.appContext.provides : r.parent.provides : void 0;
		if (i && e in i) return i[e];
		if (arguments.length > 1) return n && v(t) ? t.call(r && r.proxy) : t;
	}
}
var Zn = /* @__PURE__ */ Symbol.for("v-scx"), Qn = () => Xn(Zn);
function $n(e, t) {
	return nr(e, null, t);
}
function er(e, t) {
	return nr(e, null, { flush: "post" });
}
function tr(e, t) {
	return nr(e, null, { flush: "sync" });
}
function R(e, t, n) {
	return nr(e, t, n);
}
function nr(e, t, n = i) {
	let { immediate: r, deep: a, flush: s, once: c } = n, l = u({}, n), d = t && r || !t && s !== "post", f;
	if (Za) {
		if (s === "sync") {
			let e = Qn();
			f = e.__watcherHandles ||= [];
		} else if (!d) {
			let e = () => {};
			return e.stop = o, e.resume = o, e.pause = o, e;
		}
	}
	let p = Wa;
	l.call = (e, t, n) => Tn(e, p, t, n);
	let m = !1;
	s === "post" ? l.scheduler = (e) => {
		sa(e, p && p.suspense);
	} : s !== "sync" && (m = !0, l.scheduler = (e, t) => {
		t ? e() : Ln(e);
	}), l.augmentJob = (e) => {
		t && (e.flags |= 4), m && (e.flags |= 2, p && (e.id = p.uid, e.i = p));
	};
	let h = Sn(e, t, l);
	return Za && (f ? f.push(h) : d && h()), h;
}
function rr(e, t, n) {
	let r = this.proxy, i = y(e) ? e.includes(".") ? ir(r, e) : () => r[e] : e.bind(r, r), a;
	v(t) ? a = t : (a = t.handler, n = t);
	let o = Ja(this), s = nr(i, a.bind(r), n);
	return o(), s;
}
function ir(e, t) {
	let n = t.split(".");
	return () => {
		let t = e;
		for (let e = 0; e < n.length && t; e++) t = t[n[e]];
		return t;
	};
}
var ar = /* @__PURE__ */ new WeakMap(), or = /* @__PURE__ */ Symbol("_vte"), sr = (e) => e.__isTeleport, cr = (e) => e && (e.disabled || e.disabled === ""), lr = (e) => e && (e.defer || e.defer === ""), ur = (e) => typeof SVGElement < "u" && e instanceof SVGElement, dr = (e) => typeof MathMLElement == "function" && e instanceof MathMLElement, fr = (e, t) => {
	let n = e && e.to;
	return y(n) ? t ? t(n) : null : n;
}, pr = {
	name: "Teleport",
	__isTeleport: !0,
	process(e, t, n, r, i, a, o, s, c, l) {
		let { mc: u, pc: d, pbc: f, o: { insert: p, querySelector: m, createText: h, createComment: g, parentNode: _ } } = l, v = cr(t.props), { dynamicChildren: y } = t, b = (e, t, n) => {
			e.shapeFlag & 16 && u(e.children, t, n, i, a, o, s, c);
		}, x = (e = t) => {
			let n = cr(e.props), r = e.target = fr(e.props, m), a = vr(r, e, h, p);
			r && (o !== "svg" && ur(r) ? o = "svg" : o !== "mathml" && dr(r) && (o = "mathml"), i && i.isCE && (i.ce._teleportTargets || (i.ce._teleportTargets = /* @__PURE__ */ new Set())).add(r), n || (b(e, r, a), _r(e, !1)));
		}, S = (e) => {
			let t = () => {
				if (ar.get(e) === t) {
					if (ar.delete(e), cr(e.props)) {
						let t = _(e.el) || n;
						b(e, t, e.anchor), _r(e, !0);
					}
					x(e);
				}
			};
			ar.set(e, t), sa(t, a);
		};
		if (e == null) {
			let e = t.el = h(""), i = t.anchor = h("");
			if (p(e, n, r), p(i, n, r), lr(t.props) || a && a.pendingBranch) {
				S(t);
				return;
			}
			v && (b(t, n, i), _r(t, !0)), x();
		} else {
			t.el = e.el;
			let r = t.anchor = e.anchor, u = ar.get(e);
			if (u) {
				u.flags |= 8, ar.delete(e), S(t);
				return;
			}
			t.targetStart = e.targetStart;
			let p = t.target = e.target, h = t.targetAnchor = e.targetAnchor, g = cr(e.props), _ = g ? n : p, b = g ? r : h;
			if (o === "svg" || ur(p) ? o = "svg" : (o === "mathml" || dr(p)) && (o = "mathml"), y ? (f(e.dynamicChildren, y, _, i, a, o, s), pa(e, t, !0)) : c || d(e, t, _, b, i, a, o, s, !1), v) g ? t.props && e.props && t.props.to !== e.props.to && (t.props.to = e.props.to) : mr(t, n, r, l, 1);
			else if ((t.props && t.props.to) !== (e.props && e.props.to)) {
				let e = fr(t.props, m);
				e && (t.target = e, mr(t, e, null, l, 0));
			} else g && mr(t, p, h, l, 1);
			_r(t, v);
		}
	},
	remove(e, t, n, { um: r, o: { remove: i } }, a) {
		let { shapeFlag: o, children: s, anchor: c, targetStart: l, targetAnchor: u, target: d, props: f } = e, p = cr(f), m = a || !p, h = ar.get(e);
		if (h && (h.flags |= 8, ar.delete(e)), d && (i(l), i(u)), a && i(c), !h && (p || d) && o & 16) for (let e = 0; e < s.length; e++) {
			let i = s[e];
			r(i, t, n, m, !!i.dynamicChildren);
		}
	},
	move: mr,
	hydrate: hr
};
function mr(e, t, n, { o: { insert: r }, m: i }, a = 2) {
	a === 0 && r(e.targetAnchor, t, n);
	let { el: o, anchor: s, shapeFlag: c, children: l, props: u } = e, d = a === 2;
	if (d && r(o, t, n), !ar.has(e) && (!d || cr(u)) && c & 16) for (let e = 0; e < l.length; e++) i(l[e], t, n, 2);
	d && r(s, t, n);
}
function hr(e, t, n, r, i, a, { o: { nextSibling: o, parentNode: s, querySelector: c, insert: l, createText: u } }, d) {
	function f(e, n) {
		let r = n;
		for (; r;) {
			if (r && r.nodeType === 8) {
				if (r.data === "teleport start anchor") t.targetStart = r;
				else if (r.data === "teleport anchor") {
					t.targetAnchor = r, e._lpa = t.targetAnchor && o(t.targetAnchor);
					break;
				}
			}
			r = o(r);
		}
	}
	function p(e, t) {
		t.anchor = d(o(e), t, s(e), n, r, i, a);
	}
	let m = t.target = fr(t.props, c), h = cr(t.props);
	if (m) {
		let c = m._lpa || m.firstChild;
		t.shapeFlag & 16 && (h ? (p(e, t), f(m, c), t.targetAnchor || vr(m, t, u, l, s(e) === m ? e : null)) : (t.anchor = o(e), f(m, c), t.targetAnchor || vr(m, t, u, l), d(c && o(c), t, m, n, r, i, a))), _r(t, h);
	} else h && t.shapeFlag & 16 && (p(e, t), t.targetStart = e, t.targetAnchor = o(e));
	return t.anchor && o(t.anchor);
}
var gr = pr;
function _r(e, t) {
	let n = e.ctx;
	if (n && n.ut) {
		let r, i;
		for (t ? (r = e.el, i = e.anchor) : (r = e.targetStart, i = e.targetAnchor); r && r !== i;) r.nodeType === 1 && r.setAttribute("data-v-owner", n.uid), r = r.nextSibling;
		n.ut();
	}
}
function vr(e, t, n, r, i = null) {
	let a = t.targetStart = n(""), o = t.targetAnchor = n("");
	return a[or] = o, e && (r(a, e, i), r(o, e, i)), o;
}
var yr = /* @__PURE__ */ Symbol("_leaveCb");
function br(e) {
	let t = e[0];
	if (e.length > 1) {
		for (let n of e) if (n.type !== xa) {
			t = n;
			break;
		}
	}
	return t;
}
function xr(e) {
	if (!jr(e)) return sr(e.type) && e.children ? br(e.children) : e;
	if (e.component) return e.component.subTree;
	let { shapeFlag: t, children: n } = e;
	if (n) {
		if (t & 16) return n[0];
		if (t & 32 && v(n.default)) return n.default();
	}
}
function Sr(e, t) {
	if (e.shapeFlag & 6 && e.component) {
		e.transition = t;
		let n = e.component.subTree;
		Sr(sr(n.type) && xr(n) || n, t);
	} else e.shapeFlag & 128 ? (e.ssContent.transition = t.clone(e.ssContent), e.ssFallback.transition = t.clone(e.ssFallback)) : e.transition = t;
}
// @__NO_SIDE_EFFECTS__
function z(e, t) {
	return v(e) ? /* @__PURE__ */ u({ name: e.name }, t, { setup: e }) : e;
}
function Cr() {
	let e = Ga();
	return e ? (e.appContext.config.idPrefix || "v") + "-" + e.ids[0] + e.ids[1]++ : "";
}
function wr(e) {
	e.ids = [
		e.ids[0] + e.ids[2]++ + "-",
		0,
		0
	];
}
function Tr(e) {
	let t = Ga(), n = /* @__PURE__ */ F(null);
	if (t) {
		let r = t.refs === i ? t.refs = {} : t.refs;
		Object.defineProperty(r, e, {
			enumerable: !0,
			get: () => n.value,
			set: (e) => n.value = e
		});
	}
	return n;
}
function Er(e, t) {
	let n;
	return !!((n = Object.getOwnPropertyDescriptor(e, t)) && !n.configurable);
}
var Dr = /* @__PURE__ */ new WeakMap();
function Or(e, t, n, r, a = !1) {
	if (m(e)) {
		e.forEach((e, i) => Or(e, t && (m(t) ? t[i] : t), n, r, a));
		return;
	}
	if (Ar(r) && !a) {
		r.shapeFlag & 512 && r.type.__asyncResolved && r.component.subTree.component && Or(e, t, n, r.component.subTree);
		return;
	}
	let o = r.shapeFlag & 4 ? io(r.component) : r.el, c = a ? null : o, { i: l, r: u } = e, f = t && t.r, h = l.refs === i ? l.refs = {} : l.refs, g = l.setupState, _ = /* @__PURE__ */ Zt(g), b = g === i ? s : (e) => !Er(h, e) && p(_, e), x = (e, t) => !(t && Er(h, t));
	if (f != null && f !== u) {
		if (kr(t), y(f)) h[f] = null, b(f) && (g[f] = null);
		else if (/* @__PURE__ */ tn(f)) {
			let e = t;
			x(f, e.k) && (f.value = null), e.k && (h[e.k] = null);
		}
	}
	if (v(u)) wn(u, l, 12, [c, h]);
	else {
		let t = y(u), r = /* @__PURE__ */ tn(u);
		if (t || r) {
			let i = () => {
				if (e.f) {
					let n = t ? b(u) ? g[u] : h[u] : x(u) || !e.k ? u.value : h[e.k];
					if (a) m(n) && d(n, o);
					else if (m(n)) n.includes(o) || n.push(o);
					else if (t) h[u] = [o], b(u) && (g[u] = h[u]);
					else {
						let t = [o];
						x(u, e.k) && (u.value = t), e.k && (h[e.k] = t);
					}
				} else t ? (h[u] = c, b(u) && (g[u] = c)) : r && (x(u, e.k) && (u.value = c), e.k && (h[e.k] = c));
			};
			if (c) {
				let t = () => {
					i(), Dr.delete(e);
				};
				t.id = -1, Dr.set(e, t), sa(t, n);
			} else kr(e), i();
		}
	}
}
function kr(e) {
	let t = Dr.get(e);
	t && (t.flags |= 8, Dr.delete(e));
}
ce().requestIdleCallback, ce().cancelIdleCallback;
var Ar = (e) => !!e.type.__asyncLoader, jr = (e) => e.type.__isKeepAlive;
function Mr(e, t) {
	Pr(e, "a", t);
}
function Nr(e, t) {
	Pr(e, "da", t);
}
function Pr(e, t, n = Wa) {
	let r = e.__wdc ||= () => {
		let t = n;
		for (; t;) {
			if (t.isDeactivated) return;
			t = t.parent;
		}
		return e();
	};
	if (Ir(t, r, n), n) {
		let e = n.parent;
		for (; e && e.parent;) jr(e.parent.vnode) && Fr(r, t, n, e), e = e.parent;
	}
}
function Fr(e, t, n, r) {
	let i = Ir(t, e, r, !0);
	Ur(() => {
		d(r[t], i);
	}, n);
}
function Ir(e, t, n = Wa, r = !1) {
	if (n) {
		let i = n[e] || (n[e] = []), a = t.__weh ||= (...r) => {
			qe();
			let i = Ja(n), a = Tn(t, n, e, r);
			return i(), Je(), a;
		};
		return r ? i.unshift(a) : i.push(a), a;
	}
}
var Lr = (e) => (t, n = Wa) => {
	Za && e !== "sp" || Ir(e, (...e) => t(...e), n);
}, Rr = Lr("bm"), zr = Lr("m"), Br = Lr("bu"), Vr = Lr("u"), Hr = Lr("bum"), Ur = Lr("um"), Wr = Lr("sp"), Gr = Lr("rtg"), Kr = Lr("rtc");
function qr(e, t = Wa) {
	Ir("ec", e, t);
}
var Jr = "components", Yr = /* @__PURE__ */ Symbol.for("v-ndc");
function Xr(e) {
	return y(e) ? Zr(Jr, e, !1) || e : e || Yr;
}
function Zr(e, t, n = !0, r = !1) {
	let i = Wn || Wa;
	if (i) {
		let n = i.type;
		if (e === Jr) {
			let e = ao(n, !1);
			if (e && (e === t || e === j(t) || e === M(j(t)))) return n;
		}
		let a = Qr(i[e] || n[e], t) || Qr(i.appContext[e], t);
		return !a && r ? n : a;
	}
}
function Qr(e, t) {
	return e && (e[t] || e[j(t)] || e[M(j(t))]);
}
function B(e, t, n, r) {
	let i, a = n && n[r], o = m(e);
	if (o || y(e)) {
		let n = o && /* @__PURE__ */ qt(e), r = !1, s = !1;
		n && (r = !/* @__PURE__ */ Yt(e), s = /* @__PURE__ */ Jt(e), e = ct(e)), i = Array(e.length);
		for (let n = 0, o = e.length; n < o; n++) i[n] = t(r ? s ? en($t(e[n])) : $t(e[n]) : e[n], n, void 0, a && a[n]);
	} else if (typeof e == "number") {
		i = Array(e);
		for (let n = 0; n < e; n++) i[n] = t(n + 1, n, void 0, a && a[n]);
	} else if (x(e)) {
		if (e[Symbol.iterator]) i = Array.from(e, (e, n) => t(e, n, void 0, a && a[n]));
		else {
			let n = Object.keys(e);
			i = Array(n.length);
			for (let r = 0, o = n.length; r < o; r++) {
				let o = n[r];
				i[r] = t(e[o], o, r, a && a[r]);
			}
		}
	} else i = [];
	return n && (n[r] = i), i;
}
function $r(e, t) {
	for (let n = 0; n < t.length; n++) {
		let r = t[n];
		if (m(r)) for (let t = 0; t < r.length; t++) e[r[t].name] = r[t].fn;
		else r && (e[r.name] = r.key ? (...e) => {
			let t = r.fn(...e);
			return t && (t.key = r.key), t;
		} : r.fn);
	}
	return e;
}
function V(e, t, n, r, i, a) {
	if (n ??= {}, Wn.ce || Wn.parent && Ar(Wn.parent) && Wn.parent.ce) {
		let e = a != null && n.key == null ? u({}, n, { key: a }) : n, i = Object.keys(e).length > 0;
		return t !== "default" && (e.name = t), U(), G(H, null, [q("slot", e, r && r())], i ? -2 : 64);
	}
	let o = e[t];
	o && o._c && (o._d = !1);
	let s = Ca.length;
	U();
	let c;
	try {
		let i = o && ei(o(n)), s = n.key || a || i && i.key;
		c = G(H, { key: (s && !b(s) ? s : `_${t}`) + (!i && r ? "_fb" : "") }, i || (r ? r() : []), i && e._ === 1 ? 64 : -2);
	} catch (e) {
		for (let e = Ca.length; e > s; e--) Ta();
		throw e;
	} finally {
		o && o._c && (o._d = !0);
	}
	return !i && c.scopeId && (c.slotScopeIds = [c.scopeId + "-s"]), c;
}
function ei(e) {
	return e.some((e) => !ka(e) || !(e.type === xa || e.type === H && !ei(e.children))) ? e : null;
}
function ti(e, t) {
	let n = {};
	for (let r in e) n[t && /[A-Z]/.test(r) ? `on:${r}` : ne(r)] = e[r];
	return n;
}
var ni = (e) => e ? Xa(e) ? io(e) : ni(e.parent) : null, ri = /* @__PURE__ */ u(/* @__PURE__ */ Object.create(null), {
	$: (e) => e,
	$el: (e) => e.vnode.el,
	$data: (e) => e.data,
	$props: (e) => e.props,
	$attrs: (e) => e.attrs,
	$slots: (e) => e.slots,
	$refs: (e) => e.refs,
	$parent: (e) => ni(e.parent),
	$root: (e) => ni(e.root),
	$host: (e) => e.ce,
	$emit: (e) => e.emit,
	$options: (e) => gi(e),
	$forceUpdate: (e) => e.f ||= () => {
		Ln(e.update);
	},
	$nextTick: (e) => e.n ||= Fn.bind(e.proxy),
	$watch: (e) => rr.bind(e)
}), ii = (e, t) => e !== i && !e.__isScriptSetup && p(e, t), ai = {
	get({ _: e }, t) {
		if (t === "__v_skip") return !0;
		let { ctx: n, setupState: r, data: a, props: o, accessCache: s, type: c, appContext: l } = e;
		if (t[0] !== "$") {
			let e = s[t];
			if (e !== void 0) switch (e) {
				case 1: return r[t];
				case 2: return a[t];
				case 4: return n[t];
				case 3: return o[t];
			}
			else if (ii(r, t)) return s[t] = 1, r[t];
			else if (a !== i && p(a, t)) return s[t] = 2, a[t];
			else if (p(o, t)) return s[t] = 3, o[t];
			else if (n !== i && p(n, t)) return s[t] = 4, n[t];
			else di && (s[t] = 0);
		}
		let u = ri[t], d, f;
		if (u) return t === "$attrs" && it(e.attrs, "get", ""), u(e);
		if ((d = c.__cssModules) && (d = d[t])) return d;
		if (n !== i && p(n, t)) return s[t] = 4, n[t];
		if (f = l.config.globalProperties, p(f, t)) return f[t];
	},
	set({ _: e }, t, n) {
		let { data: r, setupState: a, ctx: o } = e;
		return ii(a, t) ? (a[t] = n, !0) : r !== i && p(r, t) ? (r[t] = n, !0) : p(e.props, t) || t[0] === "$" && t.slice(1) in e ? !1 : (o[t] = n, !0);
	},
	has({ _: { data: e, setupState: t, accessCache: n, ctx: r, appContext: a, props: o, type: s } }, c) {
		let l;
		return !!(n[c] || e !== i && c[0] !== "$" && p(e, c) || ii(t, c) || p(o, c) || p(r, c) || p(ri, c) || p(a.config.globalProperties, c) || (l = s.__cssModules) && l[c]);
	},
	defineProperty(e, t, n) {
		return n.get == null ? p(n, "value") && this.set(e, t, n.value, null) : e._.accessCache[t] = 0, Reflect.defineProperty(e, t, n);
	}
};
function oi() {
	return si("useAttrs").attrs;
}
function si(e) {
	let t = Ga();
	return t.setupContext ||= ro(t);
}
function ci(e) {
	return m(e) ? e.reduce((e, t) => (e[t] = null, e), {}) : e;
}
function li(e, t) {
	let n = ci(e);
	for (let e in t) {
		if (e.startsWith("__skip")) continue;
		let r = n[e];
		r ? m(r) || v(r) ? r = n[e] = {
			type: r,
			default: t[e]
		} : r.default = t[e] : r === null && (r = n[e] = { default: t[e] }), r && t[`__skip_${e}`] && (r.skipFactory = !0);
	}
	return n;
}
function ui(e, t) {
	return !e || !t ? e || t : m(e) && m(t) ? e.concat(t) : u({}, ci(e), ci(t));
}
var di = !0;
function fi(e) {
	let t = gi(e), n = e.proxy, r = e.ctx;
	di = !1, t.beforeCreate && mi(t.beforeCreate, e, "bc");
	let { data: i, computed: a, methods: s, watch: c, provide: l, inject: u, created: d, beforeMount: f, mounted: p, beforeUpdate: h, updated: g, activated: _, deactivated: y, beforeDestroy: b, beforeUnmount: S, destroyed: C, unmounted: w, render: T, renderTracked: E, renderTriggered: D, errorCaptured: O, serverPrefetch: k, expose: A, inheritAttrs: j, components: ee, directives: te, filters: M } = t;
	if (u && pi(u, r, null), s) for (let e in s) {
		let t = s[e];
		v(t) && (r[e] = t.bind(n));
	}
	if (i) {
		let t = i.call(n, n);
		x(t) && (e.data = /* @__PURE__ */ Ht(t));
	}
	if (di = !0, a) for (let e in a) {
		let t = a[e], i = X({
			get: v(t) ? t.bind(n, n) : v(t.get) ? t.get.bind(n, n) : o,
			set: !v(t) && v(t.set) ? t.set.bind(n) : o
		});
		Object.defineProperty(r, e, {
			enumerable: !0,
			configurable: !0,
			get: () => i.value,
			set: (e) => i.value = e
		});
	}
	if (c) for (let e in c) hi(c[e], r, n, e);
	if (l) {
		let e = v(l) ? l.call(n) : l;
		Reflect.ownKeys(e).forEach((t) => {
			Yn(t, e[t]);
		});
	}
	d && mi(d, e, "c");
	function ne(e, t) {
		m(t) ? t.forEach((t) => e(t.bind(n))) : t && e(t.bind(n));
	}
	if (ne(Rr, f), ne(zr, p), ne(Br, h), ne(Vr, g), ne(Mr, _), ne(Nr, y), ne(qr, O), ne(Kr, E), ne(Gr, D), ne(Hr, S), ne(Ur, w), ne(Wr, k), m(A)) {
		if (A.length) {
			let t = e.exposed ||= {};
			A.forEach((e) => {
				Object.defineProperty(t, e, {
					get: () => n[e],
					set: (t) => n[e] = t,
					enumerable: !0
				});
			});
		} else e.exposed ||= {};
	}
	T && e.render === o && (e.render = T), j != null && (e.inheritAttrs = j), ee && (e.components = ee), te && (e.directives = te), k && wr(e);
}
function pi(e, t, n = o) {
	m(e) && (e = xi(e));
	for (let n in e) {
		let r = e[n], i;
		i = x(r) ? "default" in r ? Xn(r.from || n, r.default, !0) : Xn(r.from || n) : Xn(r), /* @__PURE__ */ tn(i) ? Object.defineProperty(t, n, {
			enumerable: !0,
			configurable: !0,
			get: () => i.value,
			set: (e) => i.value = e
		}) : t[n] = i;
	}
}
function mi(e, t, n) {
	Tn(m(e) ? e.map((e) => e.bind(t.proxy)) : e.bind(t.proxy), t, n);
}
function hi(e, t, n, r) {
	let i = r.includes(".") ? ir(n, r) : () => n[r];
	if (y(e)) {
		let n = t[e];
		v(n) && R(i, n);
	} else if (v(e)) R(i, e.bind(n));
	else if (x(e)) {
		if (m(e)) e.forEach((e) => hi(e, t, n, r));
		else {
			let r = v(e.handler) ? e.handler.bind(n) : t[e.handler];
			v(r) && R(i, r, e);
		}
	}
}
function gi(e) {
	let t = e.type, { mixins: n, extends: r } = t, { mixins: i, optionsCache: a, config: { optionMergeStrategies: o } } = e.appContext, s = a.get(t), c;
	return s ? c = s : !i.length && !n && !r ? c = t : (c = {}, i.length && i.forEach((e) => _i(c, e, o, !0)), _i(c, t, o)), x(t) && a.set(t, c), c;
}
function _i(e, t, n, r = !1) {
	let { mixins: i, extends: a } = t;
	a && _i(e, a, n, !0), i && i.forEach((t) => _i(e, t, n, !0));
	for (let i in t) if (!(r && i === "expose")) {
		let r = vi[i] || n && n[i];
		e[i] = r ? r(e[i], t[i]) : t[i];
	}
	return e;
}
var vi = {
	data: yi,
	props: wi,
	emits: wi,
	methods: Ci,
	computed: Ci,
	beforeCreate: Si,
	created: Si,
	beforeMount: Si,
	mounted: Si,
	beforeUpdate: Si,
	updated: Si,
	beforeDestroy: Si,
	beforeUnmount: Si,
	destroyed: Si,
	unmounted: Si,
	activated: Si,
	deactivated: Si,
	errorCaptured: Si,
	serverPrefetch: Si,
	components: Ci,
	directives: Ci,
	watch: Ti,
	provide: yi,
	inject: bi
};
function yi(e, t) {
	return t ? e ? function() {
		return u(v(e) ? e.call(this, this) : e, v(t) ? t.call(this, this) : t);
	} : t : e;
}
function bi(e, t) {
	return Ci(xi(e), xi(t));
}
function xi(e) {
	if (m(e)) {
		let t = {};
		for (let n = 0; n < e.length; n++) t[e[n]] = e[n];
		return t;
	}
	return e;
}
function Si(e, t) {
	return e ? [...new Set([].concat(e, t))] : t;
}
function Ci(e, t) {
	return e ? u(/* @__PURE__ */ Object.create(null), e, t) : t;
}
function wi(e, t) {
	return e ? m(e) && m(t) ? [.../* @__PURE__ */ new Set([...e, ...t])] : u(/* @__PURE__ */ Object.create(null), ci(e), ci(t ?? {})) : t;
}
function Ti(e, t) {
	if (!e) return t;
	if (!t) return e;
	let n = u(/* @__PURE__ */ Object.create(null), e);
	for (let r in t) n[r] = Si(e[r], t[r]);
	return n;
}
function Ei() {
	return {
		app: null,
		config: {
			isNativeTag: s,
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
var Di = 0;
function Oi(e, t) {
	return function(n, r = null) {
		v(n) || (n = u({}, n)), r != null && !x(r) && (r = null);
		let i = Ei(), a = /* @__PURE__ */ new WeakSet(), o = [], s = !1, c = i.app = {
			_uid: Di++,
			_component: n,
			_props: r,
			_container: null,
			_context: i,
			_instance: null,
			version: uo,
			get config() {
				return i.config;
			},
			set config(e) {},
			use(e, ...t) {
				return a.has(e) || (e && v(e.install) ? (a.add(e), e.install(c, ...t)) : v(e) && (a.add(e), e(c, ...t))), c;
			},
			mixin(e) {
				return i.mixins.includes(e) || i.mixins.push(e), c;
			},
			component(e, t) {
				return t ? (i.components[e] = t, c) : i.components[e];
			},
			directive(e, t) {
				return t ? (i.directives[e] = t, c) : i.directives[e];
			},
			mount(a, o, l) {
				if (!s) {
					let u = c._ceVNode || q(n, r);
					return u.appContext = i, l === !0 ? l = "svg" : l === !1 && (l = void 0), o && t ? t(u, a) : e(u, a, l), s = !0, c._container = a, a.__vue_app__ = c, io(u.component);
				}
			},
			onUnmount(e) {
				o.push(e);
			},
			unmount() {
				s && (Tn(o, c._instance, 16), e(null, c._container), delete c._container.__vue_app__);
			},
			provide(e, t) {
				return i.provides[e] = t, c;
			},
			runWithContext(e) {
				let t = ki;
				ki = c;
				try {
					return e();
				} finally {
					ki = t;
				}
			}
		};
		return c;
	};
}
var ki = null;
function Ai(e, t, n = i) {
	let r = Ga(), a = j(t), o = te(t), s = ji(e, a), c = un((s, c) => {
		let l, u = i, d;
		return tr(() => {
			let t = e[a];
			re(l, t) && (l = t, c());
		}), {
			get() {
				return s(), n.get ? n.get(l) : l;
			},
			set(e) {
				let s = n.set ? n.set(e) : e;
				if (!re(s, l) && !(u !== i && re(e, u))) return;
				let f = r.vnode.props, p = !!(f && (t in f || a in f || o in f) && (`onUpdate:${t}` in f || `onUpdate:${a}` in f || `onUpdate:${o}` in f));
				p || (l = e, c()), r.emit(`update:${t}`, s), re(e, u) && (re(e, s) && !re(s, d) || p && u !== i && !re(s, l)) && c(), u = e, d = s;
			}
		};
	});
	return c[Symbol.iterator] = () => {
		let e = 0;
		return { next() {
			return e < 2 ? {
				value: e++ ? s || i : c,
				done: !1
			} : { done: !0 };
		} };
	}, c;
}
var ji = (e, t) => t === "modelValue" || t === "model-value" ? e.modelModifiers : e[`${t}Modifiers`] || e[`${j(t)}Modifiers`] || e[`${te(t)}Modifiers`];
function Mi(e, t, ...n) {
	if (e.isUnmounted) return;
	let r = e.vnode.props || i, a = n, o = t.startsWith("update:"), s = o && ji(r, t.slice(7));
	s && (s.trim && (a = n.map((e) => y(e) ? e.trim() : e)), s.number && (a = a.map(oe)));
	let c, l = r[c = ne(t)] || r[c = ne(j(t))];
	!l && o && (l = r[c = ne(te(t))]), l && Tn(l, e, 6, a);
	let u = r[c + "Once"];
	if (u) {
		if (!e.emitted) e.emitted = {};
		else if (e.emitted[c]) return;
		e.emitted[c] = !0, Tn(u, e, 6, a);
	}
}
var Ni = /* @__PURE__ */ new WeakMap();
function Pi(e, t, n = !1) {
	let r = n ? Ni : t.emitsCache, i = r.get(e);
	if (i !== void 0) return i;
	let a = e.emits, o = {}, s = !1;
	if (!v(e)) {
		let r = (e) => {
			let n = Pi(e, t, !0);
			n && (s = !0, u(o, n));
		};
		!n && t.mixins.length && t.mixins.forEach(r), e.extends && r(e.extends), e.mixins && e.mixins.forEach(r);
	}
	return !a && !s ? (x(e) && r.set(e, null), null) : (m(a) ? a.forEach((e) => o[e] = null) : u(o, a), x(e) && r.set(e, o), o);
}
function Fi(e, t) {
	return !e || !c(t) ? !1 : (t = t.slice(2), t = t === "Once" ? t : t.replace(/Once$/, ""), p(e, t[0].toLowerCase() + t.slice(1)) || p(e, te(t)) || p(e, t));
}
function Ii(e) {
	let { type: t, vnode: n, proxy: r, withProxy: i, propsOptions: [a], slots: o, attrs: s, emit: c, render: u, renderCache: d, props: f, data: p, setupState: m, ctx: h, inheritAttrs: g } = e, _ = Kn(e), v, y;
	try {
		if (n.shapeFlag & 4) {
			let e = i || r, t = e;
			v = Ia(u.call(t, e, d, f, m, p, h)), y = s;
		} else {
			let e = t;
			v = Ia(e.length > 1 ? e(f, {
				attrs: s,
				slots: o,
				emit: c
			}) : e(f, null)), y = t.props ? s : Li(s);
		}
	} catch (t) {
		Ca.length = 0, En(t, e, 1), v = q(xa);
	}
	let b = v;
	if (y && g !== !1) {
		let e = Object.keys(y), { shapeFlag: t } = b;
		e.length && t & 7 && (a && e.some(l) && (y = Ri(y, a)), b = Fa(b, y, !1, !0));
	}
	return n.dirs && (b = Fa(b, null, !1, !0), b.dirs = b.dirs ? b.dirs.concat(n.dirs) : n.dirs), n.transition && Sr(sr(b.type) && xr(b) || b, n.transition), v = b, Kn(_), v;
}
var Li = (e) => {
	let t;
	for (let n in e) (n === "class" || n === "style" || c(n)) && ((t ||= {})[n] = e[n]);
	return t;
}, Ri = (e, t) => {
	let n = {};
	for (let r in e) l(r) && r.slice(9) in t || (n[r] = e[r]);
	return n;
};
function zi(e, t, n) {
	let { props: r, children: i, component: a } = e, { props: o, children: s, patchFlag: c } = t, l = a.emitsOptions;
	if (t.dirs || t.transition) return !0;
	if (n && c >= 0) {
		if (c & 1024) return !0;
		if (c & 16) return r ? Bi(r, o, l) : !!o;
		if (c & 8) {
			let e = t.dynamicProps;
			for (let t = 0; t < e.length; t++) {
				let n = e[t];
				if (Vi(o, r, n) && !Fi(l, n)) return !0;
			}
		}
	} else return (i || s) && (!s || !s.$stable) ? !0 : r === o ? !1 : r ? !o || Bi(r, o, l) : !!o;
	return !1;
}
function Bi(e, t, n) {
	let r = Object.keys(t);
	if (r.length !== Object.keys(e).length) return !0;
	for (let i = 0; i < r.length; i++) {
		let a = r[i];
		if (Vi(t, e, a) && !Fi(n, a)) return !0;
	}
	return !1;
}
function Vi(e, t, n) {
	let r = e[n], i = t[n];
	return n === "style" && x(r) && x(i) ? !be(r, i) : r !== i;
}
function Hi({ vnode: e, parent: t, suspense: n }, r) {
	for (; t;) {
		let n = t.subTree;
		if (n.suspense && n.suspense.activeBranch === e && (n.suspense.vnode.el = n.el = r, e = n), n === e) (e = t.vnode).el = r, t = t.parent;
		else break;
	}
	n && n.activeBranch === e && (n.vnode.el = r);
}
var Ui = {}, Wi = () => Object.create(Ui), Gi = (e) => Object.getPrototypeOf(e) === Ui;
function Ki(e, t, n, r = !1) {
	let i = {}, a = Wi();
	e.propsDefaults = /* @__PURE__ */ Object.create(null), Ji(e, t, i, a);
	for (let t in e.propsOptions[0]) t in i || (i[t] = void 0);
	e.props = n ? r ? i : /* @__PURE__ */ Ut(i) : e.type.props ? i : a, e.attrs = a;
}
function qi(e, t, n, r) {
	let { props: i, attrs: a, vnode: { patchFlag: o } } = e, s = /* @__PURE__ */ Zt(i), [c] = e.propsOptions, l = !1;
	if ((r || o > 0) && !(o & 16)) {
		if (o & 8) {
			let n = e.vnode.dynamicProps;
			for (let r = 0; r < n.length; r++) {
				let o = n[r];
				if (Fi(e.emitsOptions, o)) continue;
				let u = t[o];
				if (c) {
					if (p(a, o)) u !== a[o] && (a[o] = u, l = !0);
					else {
						let t = j(o);
						i[t] = Yi(c, s, t, u, e, !1);
					}
				} else u !== a[o] && (a[o] = u, l = !0);
			}
		}
	} else {
		Ji(e, t, i, a) && (l = !0);
		let r;
		for (let a in s) t && (p(t, a) || (r = te(a)) !== a && p(t, r)) || (c ? n && (n[a] !== void 0 || n[r] !== void 0) && (i[a] = Yi(c, s, a, void 0, e, !0)) : delete i[a]);
		if (a !== s) for (let e in a) t && p(t, e) || (delete a[e], l = !0);
	}
	l && at(e.attrs, "set", "");
}
function Ji(e, t, n, r) {
	let [a, o] = e.propsOptions, s = !1, c;
	if (t) for (let i in t) {
		if (O(i)) continue;
		let l = t[i], u;
		a && p(a, u = j(i)) ? !o || !o.includes(u) ? n[u] = l : (c ||= {})[u] = l : Fi(e.emitsOptions, i) || i in r && l === r[i] || (r[i] = l, s = !0);
	}
	if (o) {
		let t = /* @__PURE__ */ Zt(n), r = c || i;
		for (let i = 0; i < o.length; i++) {
			let s = o[i];
			n[s] = Yi(a, t, s, r[s], e, !p(r, s));
		}
	}
	return s;
}
function Yi(e, t, n, r, i, a) {
	let o = e[n];
	if (o != null) {
		let e = p(o, "default");
		if (e && r === void 0) {
			let e = o.default;
			if (o.type !== Function && !o.skipFactory && v(e)) {
				let { propsDefaults: a } = i;
				if (n in a) r = a[n];
				else {
					let o = Ja(i);
					r = a[n] = e.call(null, t), o();
				}
			} else r = e;
			i.ce && i.ce._setProp(n, r);
		}
		o[0] && (a && !e ? r = !1 : o[1] && (r === "" || r === te(n)) && (r = !0));
	}
	return r;
}
var Xi = /* @__PURE__ */ new WeakMap();
function Zi(e, t, n = !1) {
	let r = n ? Xi : t.propsCache, o = r.get(e);
	if (o) return o;
	let s = e.props, c = {}, l = [], d = !1;
	if (!v(e)) {
		let r = (e) => {
			d = !0;
			let [n, r] = Zi(e, t, !0);
			u(c, n), r && l.push(...r);
		};
		!n && t.mixins.length && t.mixins.forEach(r), e.extends && r(e.extends), e.mixins && e.mixins.forEach(r);
	}
	if (!s && !d) return x(e) && r.set(e, a), a;
	if (m(s)) for (let e = 0; e < s.length; e++) {
		let t = j(s[e]);
		Qi(t) && (c[t] = i);
	}
	else if (s) for (let e in s) {
		let t = j(e);
		if (Qi(t)) {
			let n = s[e], r = c[t] = m(n) || v(n) ? { type: n } : u({}, n), i = r.type, a = !1, o = !0;
			if (m(i)) for (let e = 0; e < i.length; ++e) {
				let t = i[e], n = v(t) && t.name;
				if (n === "Boolean") {
					a = !0;
					break;
				}
				n === "String" && (o = !1);
			}
			else a = v(i) && i.name === "Boolean";
			r[0] = a, r[1] = o, (a || p(r, "default")) && l.push(t);
		}
	}
	let f = [c, l];
	return x(e) && r.set(e, f), f;
}
function Qi(e) {
	return e[0] !== "$" && !O(e);
}
var $i = (e) => e === "_" || e === "_ctx" || e === "$stable", ea = (e) => m(e) ? e.map(Ia) : [Ia(e)], ta = (e, t, n) => {
	if (t._n) return t;
	let r = L((...e) => ea(t(...e)), n);
	return r._c = !1, r;
}, na = (e, t, n) => {
	let r = e._ctx;
	for (let n in e) {
		if ($i(n)) continue;
		let i = e[n];
		if (v(i)) t[n] = ta(n, i, r);
		else if (i != null) {
			let e = ea(i);
			t[n] = () => e;
		}
	}
}, ra = (e, t) => {
	let n = ea(t);
	e.slots.default = () => n;
}, ia = (e, t, n) => {
	for (let r in t) (n || !$i(r)) && (e[r] = t[r]);
}, aa = (e, t, n) => {
	let r = e.slots = Wi();
	if (e.vnode.shapeFlag & 32) {
		let e = t._;
		e ? (ia(r, t, n), n && ae(r, "_", e, !0)) : na(t, r);
	} else t && ra(e, t);
}, oa = (e, t, n) => {
	let { vnode: r, slots: a } = e, o = !0, s = i;
	if (r.shapeFlag & 32) {
		let e = t._;
		e ? n && e === 1 ? o = !1 : ia(a, t, n) : (o = !t.$stable, na(t, a)), s = t;
	} else t && (ra(e, t), s = { default: 1 });
	if (o) for (let e in a) !$i(e) && s[e] == null && delete a[e];
}, sa = ya;
function ca(e) {
	return la(e);
}
function la(e, t) {
	let n = ce();
	n.__VUE__ = !0;
	let { insert: r, remove: s, patchProp: c, createElement: l, createText: u, createComment: d, setText: f, setElementText: p, parentNode: m, nextSibling: h, setScopeId: g = o, insertStaticContent: _ } = e, v = (e, t, n, r = null, i = null, a = null, o = void 0, s = null, c = !!t.dynamicChildren) => {
		if (e === t) return;
		e && !Aa(e, t) && (r = ge(e), de(e, i, a, !0), e = null), t.patchFlag === -2 && (c = !1, t.dynamicChildren = null);
		let { type: l, ref: u, shapeFlag: d } = t;
		switch (l) {
			case ba:
				y(e, t, n, r);
				break;
			case xa:
				b(e, t, n, r);
				break;
			case Sa:
				e ?? x(t, n, r, o);
				break;
			case H:
				ee(e, t, n, r, i, a, o, s, c);
				break;
			default: d & 1 ? w(e, t, n, r, i, a, o, s, c) : d & 6 ? te(e, t, n, r, i, a, o, s, c) : (d & 64 || d & 128) && l.process(e, t, n, r, i, a, o, s, c, ye);
		}
		u != null && i ? Or(u, e && e.ref, a, t || e, !t) : u == null && e && e.ref != null && Or(e.ref, null, a, e, !0);
	}, y = (e, t, n, i) => {
		if (e == null) r(t.el = u(t.children), n, i);
		else {
			let n = t.el = e.el;
			t.children !== e.children && f(n, t.children);
		}
	}, b = (e, t, n, i) => {
		e == null ? r(t.el = d(t.children || ""), n, i) : t.el = e.el;
	}, x = (e, t, n, r) => {
		[e.el, e.anchor] = _(e.children, t, n, r, e.el, e.anchor);
	}, S = ({ el: e, anchor: t }, n, i) => {
		let a;
		for (; e && e !== t;) a = h(e), r(e, n, i), e = a;
		r(t, n, i);
	}, C = ({ el: e, anchor: t }) => {
		let n;
		for (; e && e !== t;) n = h(e), s(e), e = n;
		s(t);
	}, w = (e, t, n, r, i, a, o, s, c) => {
		if (t.type === "svg" ? o = "svg" : t.type === "math" && (o = "mathml"), e == null) T(t, n, r, i, a, o, s, c);
		else {
			let n = e.el && e.el._isVueCE ? e.el : null;
			try {
				n && n._beginPatch(), k(e, t, i, a, o, s, c);
			} finally {
				n && n._endPatch();
			}
		}
	}, T = (e, t, n, i, a, o, s, u) => {
		let d, f, { props: m, shapeFlag: h, transition: g, dirs: _ } = e;
		if (d = e.el = l(e.type, o, m && m.is, m), h & 8 ? p(d, e.children) : h & 16 && D(e.children, d, null, i, a, ua(e, o), s, u), _ && Jn(e, null, i, "created"), E(d, e, e.scopeId, s, i), m) {
			for (let e in m) e !== "value" && !O(e) && c(d, e, null, m[e], o, i);
			"value" in m && c(d, "value", null, m.value, o), (f = m.onVnodeBeforeMount) && Ba(f, i, e);
		}
		_ && Jn(e, null, i, "beforeMount");
		let v = fa(a, g);
		v && g.beforeEnter(d), r(d, t, n), ((f = m && m.onVnodeMounted) || v || _) && sa(() => {
			try {
				f && Ba(f, i, e), v && g.enter(d), _ && Jn(e, null, i, "mounted");
			} finally {}
		}, a);
	}, E = (e, t, n, r, i) => {
		if (n && g(e, n), r) for (let t = 0; t < r.length; t++) g(e, r[t]);
		if (i) {
			let n = i.subTree;
			if (t === n || va(n.type) && (n.ssContent === t || n.ssFallback === t)) {
				let t = i.vnode;
				E(e, t, t.scopeId, t.slotScopeIds, i.parent);
			}
		}
	}, D = (e, t, n, r, i, a, o, s, c = 0) => {
		for (let l = c; l < e.length; l++) {
			let c = e[l] = s ? La(e[l]) : Ia(e[l]);
			v(null, c, t, n, r, i, a, o, s);
		}
	}, k = (e, t, n, r, a, o, s) => {
		let l = t.el = e.el, { patchFlag: u, dynamicChildren: d, dirs: f } = t;
		u |= e.patchFlag & 16;
		let m = e.props || i, h = t.props || i, g;
		if (n && da(n, !1), (g = h.onVnodeBeforeUpdate) && Ba(g, n, t, e), f && Jn(t, e, n, "beforeUpdate"), n && da(n, !0), d && (!e.dynamicChildren || e.dynamicChildren.length !== d.length) && (u = 0, s = !1, d = null), (m.innerHTML && h.innerHTML == null || m.textContent && h.textContent == null) && p(l, ""), d ? A(e.dynamicChildren, d, l, n, r, ua(t, a), o) : s || oe(e, t, l, null, n, r, ua(t, a), o, !1), u > 0) {
			if (u & 16) j(l, m, h, n, a);
			else if (u & 2 && m.class !== h.class && c(l, "class", null, h.class, a), u & 4 && c(l, "style", m.style, h.style, a), u & 8) {
				let e = t.dynamicProps;
				for (let t = 0; t < e.length; t++) {
					let r = e[t], i = m[r], o = h[r];
					(o !== i || r === "value") && c(l, r, i, o, a, n);
				}
			}
			u & 1 && e.children !== t.children && p(l, t.children);
		} else !s && d == null && j(l, m, h, n, a);
		((g = h.onVnodeUpdated) || f) && sa(() => {
			g && Ba(g, n, t, e), f && Jn(t, e, n, "updated");
		}, r);
	}, A = (e, t, n, r, i, a, o) => {
		for (let s = 0; s < t.length; s++) {
			let c = e[s], l = t[s], u = c.el && (c.type === H || !Aa(c, l) || c.shapeFlag & 198) ? m(c.el) : n;
			v(c, l, u, null, r, i, a, o, !0);
		}
	}, j = (e, t, n, r, a) => {
		if (t !== n) {
			if (t !== i) for (let i in t) !O(i) && !(i in n) && c(e, i, t[i], null, a, r);
			for (let i in n) {
				if (O(i)) continue;
				let o = n[i], s = t[i];
				o !== s && i !== "value" && c(e, i, s, o, a, r);
			}
			"value" in n && c(e, "value", t.value, n.value, a);
		}
	}, ee = (e, t, n, i, a, o, s, c, l) => {
		let d = t.el = e ? e.el : u(""), f = t.anchor = e ? e.anchor : u(""), { patchFlag: p, dynamicChildren: m, slotScopeIds: h } = t;
		h && (c = c ? c.concat(h) : h), e == null ? (r(d, n, i), r(f, n, i), D(t.children || [], n, f, a, o, s, c, l)) : p > 0 && p & 64 && m && e.dynamicChildren && e.dynamicChildren.length === m.length ? (A(e.dynamicChildren, m, n, a, o, s, c), (t.key != null || a && t === a.subTree) && pa(e, t, !0)) : oe(e, t, n, f, a, o, s, c, l);
	}, te = (e, t, n, r, i, a, o, s, c) => {
		t.slotScopeIds = s, e == null ? t.shapeFlag & 512 ? i.ctx.activate(t, n, r, o, c) : M(t, n, r, i, a, o, c) : ne(e, t, c);
	}, M = (e, t, n, r, i, a, o) => {
		let s = e.component = Ua(e, r, i);
		if (jr(e) && (s.ctx.renderer = ye), Qa(s, !1, o), s.asyncDep) {
			if (i && i.registerDep(s, re, o), !e.el) {
				let r = s.subTree = q(xa);
				b(null, r, t, n), e.placeholder = r.el;
			}
		} else re(s, e, t, n, i, a, o);
	}, ne = (e, t, n) => {
		let r = t.component = e.component;
		if (zi(e, t, n)) {
			if (r.asyncDep && !r.asyncResolved) {
				ae(r, t, n);
				return;
			}
			r.next = t, r.update();
		} else t.el = e.el, r.vnode = t;
	}, re = (e, t, n, r, i, a, o) => {
		let s = () => {
			if (e.isMounted) {
				let { next: t, bu: n, u: r, parent: s, vnode: c } = e;
				{
					let n = ha(e);
					if (n) {
						t && (t.el = c.el, ae(e, t, o)), n.asyncDep.then(() => {
							sa(() => {
								e.isUnmounted || l();
							}, i);
						});
						return;
					}
				}
				let u = t, d;
				da(e, !1), t ? (t.el = c.el, ae(e, t, o)) : t = c, n && ie(n), (d = t.props && t.props.onVnodeBeforeUpdate) && Ba(d, s, t, c), da(e, !0);
				let f = Ii(e), p = e.subTree;
				e.subTree = f, v(p, f, m(p.el), ge(p), e, i, a), t.el = f.el, u === null && Hi(e, f.el), r && sa(r, i), (d = t.props && t.props.onVnodeUpdated) && sa(() => Ba(d, s, t, c), i);
			} else {
				let o, { el: s, props: c } = t, { bm: l, m: u, parent: d, root: f, type: p } = e, m = Ar(t);
				if (da(e, !1), l && ie(l), !m && (o = c && c.onVnodeBeforeMount) && Ba(o, d, t), da(e, !0), s && xe) {
					let t = () => {
						e.subTree = Ii(e), xe(s, e.subTree, e, i, null);
					};
					m && p.__asyncHydrate ? p.__asyncHydrate(s, e, t) : t();
				} else {
					f.ce && f.ce._hasShadowRoot() && f.ce._injectChildStyle(p, e.parent ? e.parent.type : void 0);
					let o = e.subTree = Ii(e);
					v(null, o, n, r, e, i, a), t.el = o.el;
				}
				if (u && sa(u, i), !m && (o = c && c.onVnodeMounted)) {
					let e = t;
					sa(() => Ba(o, d, e), i);
				}
				(t.shapeFlag & 256 || d && Ar(d.vnode) && d.vnode.shapeFlag & 256) && e.a && sa(e.a, i), e.isMounted = !0, t = n = r = null;
			}
		};
		e.scope.on();
		let c = e.effect = new Me(s);
		e.scope.off();
		let l = e.update = c.run.bind(c), u = e.job = c.runIfDirty.bind(c);
		u.i = e, u.id = e.uid, c.scheduler = () => Ln(u), da(e, !0), l();
	}, ae = (e, t, n) => {
		t.component = e;
		let r = e.vnode.props;
		e.vnode = t, e.next = null, qi(e, t.props, r, n), oa(e, t.children, n), qe(), Bn(e), Je();
	}, oe = (e, t, n, r, i, a, o, s, c = !1) => {
		let l = e && e.children, u = e ? e.shapeFlag : 0, d = t.children, { patchFlag: f, shapeFlag: m } = t;
		if (f > 0) {
			if (f & 128) {
				le(l, d, n, r, i, a, o, s, c);
				return;
			}
			if (f & 256) {
				se(l, d, n, r, i, a, o, s, c);
				return;
			}
		}
		m & 8 ? (u & 16 && he(l, i, a), d !== l && p(n, d)) : u & 16 ? m & 16 ? le(l, d, n, r, i, a, o, s, c) : he(l, i, a, !0) : (u & 8 && p(n, ""), m & 16 && D(d, n, r, i, a, o, s, c));
	}, se = (e, t, n, r, i, o, s, c, l) => {
		e ||= a, t ||= a;
		let u = e.length, d = t.length, f = Math.min(u, d), p = 0;
		for (; p < f; p++) {
			let r = t[p] = l ? La(t[p]) : Ia(t[p]);
			v(e[p], r, n, null, i, o, s, c, l);
		}
		u > d ? he(e, i, o, !0, !1, f) : D(t, n, r, i, o, s, c, l, f);
	}, le = (e, t, n, r, i, o, s, c, l) => {
		let u = 0, d = t.length, f = e.length - 1, p = d - 1;
		for (; u <= f && u <= p;) {
			let r = e[u], a = t[u] = l ? La(t[u]) : Ia(t[u]);
			if (Aa(r, a)) v(r, a, n, null, i, o, s, c, l);
			else break;
			u++;
		}
		for (; u <= f && u <= p;) {
			let r = e[f], a = t[p] = l ? La(t[p]) : Ia(t[p]);
			if (Aa(r, a)) v(r, a, n, null, i, o, s, c, l);
			else break;
			f--, p--;
		}
		if (u > f) {
			if (u <= p) {
				let e = p + 1, a = e < d ? t[e].el : r;
				for (; u <= p;) v(null, t[u] = l ? La(t[u]) : Ia(t[u]), n, a, i, o, s, c, l), u++;
			}
		} else if (u > p) for (; u <= f;) de(e[u], i, o, !0), u++;
		else {
			let m = u, h = u, g = /* @__PURE__ */ new Map();
			for (u = h; u <= p; u++) {
				let e = t[u] = l ? La(t[u]) : Ia(t[u]);
				e.key != null && g.set(e.key, u);
			}
			let _, y = 0, b = p - h + 1, x = !1, S = 0, C = Array(b);
			for (u = 0; u < b; u++) C[u] = 0;
			for (u = m; u <= f; u++) {
				let r = e[u];
				if (y >= b) {
					de(r, i, o, !0);
					continue;
				}
				let a;
				if (r.key != null) a = g.get(r.key);
				else for (_ = h; _ <= p; _++) if (C[_ - h] === 0 && Aa(r, t[_])) {
					a = _;
					break;
				}
				a === void 0 ? de(r, i, o, !0) : (C[a - h] = u + 1, a >= S ? S = a : x = !0, v(r, t[a], n, null, i, o, s, c, l), y++);
			}
			let w = x ? ma(C) : a;
			for (_ = w.length - 1, u = b - 1; u >= 0; u--) {
				let e = h + u, a = t[e], f = t[e + 1], p = e + 1 < d ? f.el || _a(f) : r;
				C[u] === 0 ? v(null, a, n, p, i, o, s, c, l) : x && (_ < 0 || u !== w[_] ? ue(a, n, p, 2) : _--);
			}
		}
	}, ue = (e, t, n, i, a = null) => {
		let { el: o, type: c, transition: l, children: u, shapeFlag: d } = e;
		if (d & 6) ue(e.component.subTree, t, n, i);
		else if (d & 128) e.suspense.move(t, n, i);
		else if (d & 64) c.move(e, t, n, ye);
		else if (c === H) {
			r(o, t, n);
			for (let e = 0; e < u.length; e++) ue(u[e], t, n, i);
			r(e.anchor, t, n);
		} else if (c === Sa) S(e, t, n);
		else if (i !== 2 && d & 1 && l) {
			if (i === 0) l.persisted && !o[yr] ? r(o, t, n) : (l.beforeEnter(o), r(o, t, n), sa(() => l.enter(o), a));
			else {
				let { leave: i, delayLeave: a, afterLeave: c } = l, u = () => {
					e.ctx.isUnmounted ? s(o) : r(o, t, n);
				}, d = () => {
					let e = o._isLeaving || !!o[yr];
					o._isLeaving && o[yr](!0), l.persisted && !e ? u() : i(o, () => {
						u(), c && c();
					});
				};
				a ? a(o, u, d) : d();
			}
		} else r(o, t, n);
	}, de = (e, t, n, r = !1, i = !1) => {
		let { type: a, props: o, ref: s, children: c, dynamicChildren: l, shapeFlag: u, patchFlag: d, dirs: f, cacheIndex: p, memo: m } = e;
		if (d === -2 && (i = !1), s != null && (qe(), Or(s, null, n, e, !0), Je()), p != null && (t.renderCache[p] = void 0), u & 256) {
			t.ctx.deactivate(e);
			return;
		}
		let h = u & 1 && f, g = !Ar(e), _;
		if (g && (_ = o && o.onVnodeBeforeUnmount) && Ba(_, t, e), u & 6) me(e.component, n, r);
		else {
			if (u & 128) {
				e.suspense.unmount(n, r);
				return;
			}
			h && Jn(e, null, t, "beforeUnmount"), u & 64 ? e.type.remove(e, t, n, ye, r) : l && !l.hasOnce && (a !== H || d > 0 && d & 64) ? he(l, t, n, !1, !0) : (a === H && d & 384 || !i && u & 16) && he(c, t, n), r && fe(e);
		}
		let v = m != null && p == null;
		(g && (_ = o && o.onVnodeUnmounted) || h || v) && sa(() => {
			_ && Ba(_, t, e), h && Jn(e, null, t, "unmounted"), v && (e.el = null);
		}, n);
	}, fe = (e) => {
		let { type: t, el: n, anchor: r, transition: i } = e;
		if (t === H) {
			pe(n, r);
			return;
		}
		if (t === Sa) {
			C(e);
			return;
		}
		let a = () => {
			s(n), i && !i.persisted && i.afterLeave && i.afterLeave();
		};
		if (e.shapeFlag & 1 && i && !i.persisted) {
			let { leave: t, delayLeave: r } = i, o = () => t(n, a);
			r ? r(e.el, a, o) : o();
		} else a();
	}, pe = (e, t) => {
		let n;
		for (; e !== t;) n = h(e), s(e), e = n;
		s(t);
	}, me = (e, t, n) => {
		let { bum: r, scope: i, job: a, subTree: o, um: s, m: c, a: l } = e;
		ga(c), ga(l), r && ie(r), i.stop(), a && (a.flags |= 8, de(o, e, t, n)), s && sa(s, t), sa(() => {
			e.isUnmounted = !0;
		}, t);
	}, he = (e, t, n, r = !1, i = !1, a = 0) => {
		for (let o = a; o < e.length; o++) de(e[o], t, n, r, i);
	}, ge = (e) => {
		if (e.shapeFlag & 6) return ge(e.component.subTree);
		if (e.shapeFlag & 128) return e.suspense.next();
		let t = h(e.anchor || e.el), n = t && t[or];
		return n ? h(n) : t;
	}, _e = !1, ve = (e, t, n) => {
		let r;
		e == null ? t._vnode && (de(t._vnode, null, null, !0), r = t._vnode.component) : v(t._vnode || null, e, t, null, null, null, n), t._vnode = e, _e ||= (_e = !0, Bn(r), Vn(), !1);
	}, ye = {
		p: v,
		um: de,
		m: ue,
		r: fe,
		mt: M,
		mc: D,
		pc: oe,
		pbc: A,
		n: ge,
		o: e
	}, be, xe;
	return t && ([be, xe] = t(ye)), {
		render: ve,
		hydrate: be,
		createApp: Oi(ve, be)
	};
}
function ua({ type: e, props: t }, n) {
	return n === "svg" && e === "foreignObject" || n === "mathml" && e === "annotation-xml" && t && t.encoding && t.encoding.includes("html") ? void 0 : n;
}
function da({ effect: e, job: t }, n) {
	n ? (e.flags |= 32, t.flags |= 4) : (e.flags &= -33, t.flags &= -5);
}
function fa(e, t) {
	return (!e || e && !e.pendingBranch) && t && !t.persisted;
}
function pa(e, t, n = !1) {
	let r = e.children, i = t.children;
	if (m(r) && m(i)) for (let e = 0; e < r.length; e++) {
		let t = r[e], a = i[e];
		a.shapeFlag & 1 && !a.dynamicChildren && ((a.patchFlag <= 0 || a.patchFlag === 32) && (a = i[e] = La(i[e]), a.el = t.el), !n && a.patchFlag !== -2 && pa(t, a)), a.type === ba && (a.patchFlag === -1 && (a = i[e] = La(a)), a.el = t.el), a.type === xa && !a.el && (a.el = t.el);
	}
}
function ma(e) {
	let t = e.slice(), n = [0], r, i, a, o, s, c = e.length;
	for (r = 0; r < c; r++) {
		let c = e[r];
		if (c !== 0) {
			if (i = n[n.length - 1], e[i] < c) {
				t[r] = i, n.push(r);
				continue;
			}
			for (a = 0, o = n.length - 1; a < o;) s = a + o >> 1, e[n[s]] < c ? a = s + 1 : o = s;
			c < e[n[a]] && (a > 0 && (t[r] = n[a - 1]), n[a] = r);
		}
	}
	for (a = n.length, o = n[a - 1]; a-- > 0;) n[a] = o, o = t[o];
	return n;
}
function ha(e) {
	let t = e.subTree.component;
	if (t) return t.asyncDep && !t.asyncResolved ? t : ha(t);
}
function ga(e) {
	if (e) for (let t = 0; t < e.length; t++) e[t].flags |= 8;
}
function _a(e) {
	if (e.placeholder) return e.placeholder;
	let t = e.component;
	return t ? _a(t.subTree) : null;
}
var va = (e) => e.__isSuspense;
function ya(e, t) {
	t && t.pendingBranch ? m(e) ? t.effects.push(...e) : t.effects.push(e) : zn(e);
}
var H = /* @__PURE__ */ Symbol.for("v-fgt"), ba = /* @__PURE__ */ Symbol.for("v-txt"), xa = /* @__PURE__ */ Symbol.for("v-cmt"), Sa = /* @__PURE__ */ Symbol.for("v-stc"), Ca = [], wa = null;
function U(e = !1) {
	Ca.push(wa = e ? null : []);
}
function Ta() {
	Ca.pop(), wa = Ca[Ca.length - 1] || null;
}
var Ea = 1;
function Da(e, t = !1) {
	Ea += e, e < 0 && wa && t && (wa.hasOnce = !0);
}
function Oa(e) {
	return e.dynamicChildren = Ea > 0 ? wa || a : null, Ta(), Ea > 0 && wa && wa.push(e), e;
}
function W(e, t, n, r, i, a) {
	return Oa(K(e, t, n, r, i, a, !0));
}
function G(e, t, n, r, i) {
	return Oa(q(e, t, n, r, i, !0));
}
function ka(e) {
	return e ? e.__v_isVNode === !0 : !1;
}
function Aa(e, t) {
	return e.type === t.type && e.key === t.key;
}
var ja = ({ key: e }) => e ?? null, Ma = ({ ref: e, ref_key: t, ref_for: n }) => (typeof e == "number" && (e = "" + e), e == null ? null : y(e) || /* @__PURE__ */ tn(e) || v(e) ? {
	i: Wn,
	r: e,
	k: t,
	f: !!n
} : e);
function K(e, t = null, n = null, r = 0, i = null, a = e === H ? 0 : 1, o = !1, s = !1) {
	let c = {
		__v_isVNode: !0,
		__v_skip: !0,
		type: e,
		props: t,
		key: t && ja(t),
		ref: t && Ma(t),
		scopeId: Gn,
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
		shapeFlag: a,
		patchFlag: r,
		dynamicProps: i,
		dynamicChildren: null,
		appContext: null,
		ctx: Wn
	};
	return s ? (Ra(c, n), a & 128 && e.normalize(c)) : n && (c.shapeFlag |= y(n) ? 8 : 16), Ea > 0 && !o && wa && (c.patchFlag > 0 || a & 6) && c.patchFlag !== 32 && wa.push(c), c;
}
var q = Na;
function Na(e, t = null, n = null, r = 0, i = null, a = !1) {
	if (e && e !== Yr || (e = xa), ka(e)) {
		let r = Fa(e, t, !0);
		return n && Ra(r, n), Ea > 0 && !a && wa && (r.shapeFlag & 6 ? wa[wa.indexOf(e)] = r : wa.push(r)), r.patchFlag = -2, r;
	}
	if (oo(e) && (e = e.__vccOpts), t) {
		t = Pa(t);
		let { class: e, style: n } = t;
		e && !y(e) && (t.class = me(e)), x(n) && (/* @__PURE__ */ Xt(n) && !m(n) && (n = u({}, n)), t.style = le(n));
	}
	let o = y(e) ? 1 : va(e) ? 128 : sr(e) ? 64 : x(e) ? 4 : v(e) ? 2 : 0;
	return K(e, t, n, r, i, o, a, !0);
}
function Pa(e) {
	return e ? /* @__PURE__ */ Xt(e) || Gi(e) ? u({}, e) : e : null;
}
function Fa(e, t, n = !1, r = !1) {
	let { props: i, ref: a, patchFlag: o, children: s, transition: c } = e, l = t ? za(i || {}, t) : i, u = {
		__v_isVNode: !0,
		__v_skip: !0,
		type: e.type,
		props: l,
		key: l && ja(l),
		ref: t && t.ref ? n && a ? m(a) ? a.concat(Ma(t)) : [a, Ma(t)] : Ma(t) : a,
		scopeId: e.scopeId,
		slotScopeIds: e.slotScopeIds,
		children: s,
		target: e.target,
		targetStart: e.targetStart,
		targetAnchor: e.targetAnchor,
		staticCount: e.staticCount,
		shapeFlag: e.shapeFlag,
		patchFlag: t && e.type !== H ? o === -1 ? 16 : o | 16 : o,
		dynamicProps: e.dynamicProps,
		dynamicChildren: e.dynamicChildren,
		appContext: e.appContext,
		dirs: e.dirs,
		transition: c,
		component: e.component,
		suspense: e.suspense,
		ssContent: e.ssContent && Fa(e.ssContent),
		ssFallback: e.ssFallback && Fa(e.ssFallback),
		placeholder: e.placeholder,
		el: e.el,
		anchor: e.anchor,
		ctx: e.ctx,
		ce: e.ce
	};
	return c && r && Sr(u, c.clone(u)), u;
}
function J(e = " ", t = 0) {
	return q(ba, null, e, t);
}
function Y(e = "", t = !1) {
	return t ? (U(), G(xa, null, e)) : q(xa, null, e);
}
function Ia(e) {
	return e == null || typeof e == "boolean" ? q(xa) : m(e) ? q(H, null, e.slice()) : ka(e) ? La(e) : q(ba, null, String(e));
}
function La(e) {
	return e.el === null && e.patchFlag !== -1 || e.memo ? e : Fa(e);
}
function Ra(e, t) {
	let n = 0, { shapeFlag: r } = e;
	if (t == null) t = null;
	else if (m(t)) n = 16;
	else if (typeof t == "object") {
		if (r & 65) {
			let n = t.default;
			n && (n._c && (n._d = !1), Ra(e, n()), n._c && (n._d = !0));
			return;
		}
		{
			n = 32;
			let r = t._;
			!r && !Gi(t) ? t._ctx = Wn : r === 3 && Wn && (Wn.slots._ === 1 ? t._ = 1 : (t._ = 2, e.patchFlag |= 1024));
		}
	} else if (v(t)) {
		if (r & 65) {
			Ra(e, { default: t });
			return;
		}
		t = {
			default: t,
			_ctx: Wn
		}, n = 32;
	} else t = String(t), r & 64 ? (n = 16, t = [J(t)]) : n = 8;
	e.children = t, e.shapeFlag |= n;
}
function za(...e) {
	let t = {};
	for (let n = 0; n < e.length; n++) {
		let r = e[n];
		for (let e in r) if (e === "class") t.class !== r.class && (t.class = me([t.class, r.class]));
		else if (e === "style") t.style = le([t.style, r.style]);
		else if (c(e)) {
			let n = t[e], i = r[e];
			i && n !== i && !(m(n) && n.includes(i)) ? t[e] = n ? [].concat(n, i) : i : i == null && n == null && !l(e) && (t[e] = i);
		} else e !== "" && (t[e] = r[e]);
	}
	return t;
}
function Ba(e, t, n, r = null) {
	Tn(e, t, 7, [n, r]);
}
var Va = Ei(), Ha = 0;
function Ua(e, t, n) {
	let r = e.type, a = (t ? t.appContext : e.appContext) || Va, o = {
		uid: Ha++,
		vnode: e,
		type: r,
		parent: t,
		appContext: a,
		root: null,
		next: null,
		subTree: null,
		effect: null,
		update: null,
		job: null,
		scope: new Ee(!0),
		render: null,
		proxy: null,
		exposed: null,
		exposeProxy: null,
		withProxy: null,
		provides: t ? t.provides : Object.create(a.provides),
		ids: t ? t.ids : [
			"",
			0,
			0
		],
		accessCache: null,
		renderCache: [],
		components: null,
		directives: null,
		propsOptions: Zi(r, a),
		emitsOptions: Pi(r, a),
		emit: null,
		emitted: null,
		propsDefaults: i,
		inheritAttrs: r.inheritAttrs,
		ctx: i,
		data: i,
		props: i,
		attrs: i,
		slots: i,
		refs: i,
		setupState: i,
		setupContext: null,
		suspense: n,
		suspenseId: n ? n.pendingId : 0,
		asyncDep: null,
		asyncResolved: !1,
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
	return o.ctx = { _: o }, o.root = t ? t.root : o, o.emit = Mi.bind(null, o), e.ce && e.ce(o), o;
}
var Wa = null, Ga = () => Wa || Wn, Ka, qa;
{
	let e = ce(), t = (t, n) => {
		let r;
		return (r = e[t]) || (r = e[t] = []), r.push(n), (e) => {
			r.length > 1 ? r.forEach((t) => t(e)) : r[0](e);
		};
	};
	Ka = t("__VUE_INSTANCE_SETTERS__", (e) => Wa = e), qa = t("__VUE_SSR_SETTERS__", (e) => Za = e);
}
var Ja = (e) => {
	let t = Wa;
	return Ka(e), e.scope.on(), () => {
		e.scope.off(), Ka(t);
	};
}, Ya = () => {
	Wa && Wa.scope.off(), Ka(null);
};
function Xa(e) {
	return e.vnode.shapeFlag & 4;
}
var Za = !1;
function Qa(e, t = !1, n = !1) {
	t && qa(t);
	let { props: r, children: i } = e.vnode, a = Xa(e);
	Ki(e, r, a, t), aa(e, i, n || t);
	let o = a ? $a(e, t) : void 0;
	return t && qa(!1), o;
}
function $a(e, t) {
	let n = e.type;
	e.accessCache = /* @__PURE__ */ Object.create(null), e.proxy = new Proxy(e.ctx, ai);
	let { setup: r } = n;
	if (r) {
		qe();
		let n = e.setupContext = r.length > 1 ? ro(e) : null, i = Ja(e), a = wn(r, e, 0, [e.props, n]), o = S(a);
		if (Je(), i(), (o || e.sp) && !Ar(e) && wr(e), o) {
			if (a.then(Ya, Ya), t) return a.then((n) => {
				qa(!0);
				try {
					eo(e, n, t);
				} finally {
					qa(!1);
				}
			}).catch((t) => {
				En(t, e, 0);
			});
			e.asyncDep = a;
		} else eo(e, a, t);
	} else to(e, t);
}
function eo(e, t, n) {
	v(t) ? e.type.__ssrInlineRender ? e.ssrRender = t : e.render = t : x(t) && (e.setupState = cn(t)), to(e, n);
}
function to(e, t, n) {
	let r = e.type;
	e.render ||= r.render || o;
	{
		let t = Ja(e);
		qe();
		try {
			fi(e);
		} finally {
			Je(), t();
		}
	}
}
var no = { get(e, t) {
	return it(e, "get", ""), e[t];
} };
function ro(e) {
	return {
		attrs: new Proxy(e.attrs, no),
		slots: e.slots,
		emit: e.emit,
		expose: (t) => {
			e.exposed = t || {};
		}
	};
}
function io(e) {
	return e.exposed ? e.exposeProxy ||= new Proxy(cn(Qt(e.exposed)), {
		get(t, n) {
			if (n in t) return t[n];
			if (n in ri) return ri[n](e);
		},
		has(e, t) {
			return t in e || t in ri;
		}
	}) : e.proxy;
}
function ao(e, t = !0) {
	return v(e) ? e.displayName || e.name : e.name || t && e.__name;
}
function oo(e) {
	return v(e) && "__vccOpts" in e;
}
var X = (e, t) => /* @__PURE__ */ _n(e, t, Za);
function so(e, t, n) {
	try {
		Da(-1);
		let r = arguments.length;
		return r === 2 ? x(t) && !m(t) ? ka(t) ? q(e, null, [t]) : q(e, t) : q(e, null, t) : (r > 3 ? n = Array.prototype.slice.call(arguments, 2) : r === 3 && ka(n) && (n = [n]), q(e, t, n));
	} finally {
		Da(1);
	}
}
function co(e, t, n, r) {
	let i = n[r];
	if (i && lo(i, e)) return i;
	let a = t();
	return a.memo = e.slice(), a.cacheIndex = r, n[r] = a;
}
function lo(e, t) {
	let n = e.memo;
	if (n.length != t.length) return !1;
	for (let e = 0; e < n.length; e++) if (re(n[e], t[e])) return !1;
	return Ea > 0 && wa && wa.push(e), !0;
}
var uo = "3.5.42", fo = void 0, po = typeof window < "u" && window.trustedTypes;
if (po) try {
	fo = /* @__PURE__ */ po.createPolicy("vue", { createHTML: (e) => e });
} catch {}
var mo = fo ? (e) => fo.createHTML(e) : (e) => e, ho = "http://www.w3.org/2000/svg", go = "http://www.w3.org/1998/Math/MathML", _o = typeof document < "u" ? document : null, vo = _o && /* @__PURE__ */ _o.createElement("template"), yo = {
	insert: (e, t, n) => {
		t.insertBefore(e, n || null);
	},
	remove: (e) => {
		let t = e.parentNode;
		t && t.removeChild(e);
	},
	createElement: (e, t, n, r) => {
		let i = t === "svg" ? _o.createElementNS(ho, e) : t === "mathml" ? _o.createElementNS(go, e) : n ? _o.createElement(e, { is: n }) : _o.createElement(e);
		return e === "select" && r && r.multiple != null && i.setAttribute("multiple", r.multiple), i;
	},
	createText: (e) => _o.createTextNode(e),
	createComment: (e) => _o.createComment(e),
	setText: (e, t) => {
		e.nodeValue = t;
	},
	setElementText: (e, t) => {
		e.textContent = t;
	},
	parentNode: (e) => e.parentNode,
	nextSibling: (e) => e.nextSibling,
	querySelector: (e) => _o.querySelector(e),
	setScopeId(e, t) {
		e.setAttribute(t, "");
	},
	insertStaticContent(e, t, n, r, i, a) {
		let o = n ? n.previousSibling : t.lastChild;
		if (i && (i === a || i.nextSibling)) for (; t.insertBefore(i.cloneNode(!0), n), i !== a && (i = i.nextSibling););
		else {
			vo.innerHTML = mo(r === "svg" ? `<svg>${e}</svg>` : r === "mathml" ? `<math>${e}</math>` : e);
			let i = vo.content;
			if (r === "svg" || r === "mathml") {
				let e = i.firstChild;
				for (; e.firstChild;) i.appendChild(e.firstChild);
				i.removeChild(e);
			}
			t.insertBefore(i, n);
		}
		return [o ? o.nextSibling : t.firstChild, n ? n.previousSibling : t.lastChild];
	}
}, bo = /* @__PURE__ */ Symbol("_vtc");
function xo(e, t, n) {
	let r = e[bo];
	r && (t = (t ? [t, ...r] : [...r]).join(" ")), t == null ? e.removeAttribute("class") : n ? e.setAttribute("class", t) : e.className = t;
}
var So = /* @__PURE__ */ Symbol("_vod"), Co = /* @__PURE__ */ Symbol("_vsh"), wo = {
	name: "show",
	beforeMount(e, { value: t }, { transition: n }) {
		e[So] = e.style.display === "none" ? "" : e.style.display, n && t ? n.beforeEnter(e) : To(e, t);
	},
	mounted(e, { value: t }, { transition: n }) {
		n && t && n.enter(e);
	},
	updated(e, { value: t, oldValue: n }, { transition: r }) {
		!t != !n && (r ? t ? (r.beforeEnter(e), To(e, !0), r.enter(e)) : r.leave(e, () => {
			To(e, !1);
		}) : To(e, t));
	},
	beforeUnmount(e, { value: t }) {
		To(e, t);
	}
};
function To(e, t) {
	e.style.display = t ? e[So] : "none", e[Co] = !t;
}
var Eo = /* @__PURE__ */ Symbol(""), Do = /(?:^|;)\s*display\s*:/;
function Oo(e, t, n) {
	let r = e.style, i = y(n), a = !1;
	if (n && !i) {
		if (t) {
			if (y(t)) for (let e of t.split(";")) {
				let t = e.slice(0, e.indexOf(":")).trim();
				n[t] ?? Ao(r, t, "");
			}
			else for (let e in t) n[e] ?? Ao(r, e, "");
		}
		for (let i in n) {
			i === "display" && (a = !0);
			let o = n[i];
			o == null ? Ao(r, i, "") : Po(e, i, !y(t) && t ? t[i] : void 0, o) || Ao(r, i, o);
		}
	} else if (i) {
		if (t !== n) {
			let e = r[Eo];
			e && (n += ";" + e), r.cssText = n, a = Do.test(n);
		}
	} else t && e.removeAttribute("style");
	So in e && (e[So] = a ? r.display : "", e[Co] && (r.display = "none"));
}
var ko = /\s*!important$/;
function Ao(e, t, n) {
	if (m(n)) n.forEach((n) => Ao(e, t, n));
	else if (n ??= "", t.startsWith("--")) ko.test(n) ? e.setProperty(t, n.replace(ko, ""), "important") : e.setProperty(t, n);
	else {
		let r = No(e, t);
		ko.test(n) ? e.setProperty(te(r), n.replace(ko, ""), "important") : e[r] = n;
	}
}
var jo = [
	"Webkit",
	"Moz",
	"ms"
], Mo = {};
function No(e, t) {
	let n = Mo[t];
	if (n) return n;
	let r = j(t);
	if (r !== "filter" && r in e) return Mo[t] = r;
	r = M(r);
	for (let n = 0; n < jo.length; n++) {
		let i = jo[n] + r;
		if (i in e) return Mo[t] = i;
	}
	return t;
}
function Po(e, t, n, r) {
	return e.tagName === "TEXTAREA" && (t === "width" || t === "height") && y(r) && n === r;
}
var Fo = "http://www.w3.org/1999/xlink";
function Io(e, t, n, r, i, a = ge(t)) {
	r && t.startsWith("xlink:") ? n == null ? e.removeAttributeNS(Fo, t.slice(6, t.length)) : e.setAttributeNS(Fo, t, n) : n == null || a && !_e(n) ? e.removeAttribute(t) : e.setAttribute(t, a ? "" : b(n) ? String(n) : n);
}
function Lo(e, t, n, r, i) {
	if (t === "innerHTML" || t === "textContent") {
		n != null && (e[t] = t === "innerHTML" ? mo(n) : n);
		return;
	}
	let a = e.tagName;
	if (t === "value" && a !== "PROGRESS" && !a.includes("-")) {
		let r = a === "OPTION" ? e.getAttribute("value") || "" : e.value, i = n == null ? e.type === "checkbox" ? "on" : "" : String(n);
		r === i && "_value" in e || (e.value = i), n ?? e.removeAttribute(t), e._value = n;
		return;
	}
	let o = !1;
	if (n === "" || n == null) {
		let r = typeof e[t];
		r === "boolean" ? n = _e(n) : n == null && r === "string" ? (n = "", o = !0) : r === "number" && (n = 0, o = !0);
	}
	try {
		e[t] = n;
	} catch {}
	o && e.removeAttribute(i || t);
}
function Ro(e, t, n, r) {
	e.addEventListener(t, n, r);
}
function zo(e, t, n, r) {
	e.removeEventListener(t, n, r);
}
var Bo = /* @__PURE__ */ Symbol("_vei");
function Vo(e, t, n, r, i = null) {
	let a = e[Bo] || (e[Bo] = {}), o = a[t];
	if (r && o) o.value = r;
	else {
		let [n, s] = Wo(t);
		r ? Ro(e, n, a[t] = Jo(r, i), s) : o && (zo(e, n, o, s), a[t] = void 0);
	}
}
var Ho = /(Once|Passive|Capture)$/, Uo = /^on:?(?:Once|Passive|Capture)$/;
function Wo(e) {
	let t, n;
	for (; (n = e.match(Ho)) && !Uo.test(e);) t ||= {}, e = e.slice(0, e.length - n[1].length), t[n[1].toLowerCase()] = !0;
	return [e[2] === ":" ? e.slice(3) : te(e.slice(2)), t];
}
var Go = 0, Ko = /* @__PURE__ */ Promise.resolve(), qo = () => Go ||= (Ko.then(() => Go = 0), Date.now());
function Jo(e, t) {
	let n = (e) => {
		if (!e._vts) e._vts = Date.now();
		else if (e._vts <= n.attached) return;
		let r = n.value;
		if (m(r)) {
			let n = e.stopImmediatePropagation;
			e.stopImmediatePropagation = () => {
				n.call(e), e._stopped = !0;
			};
			let i = r.slice(), a = [e];
			for (let n = 0; n < i.length && !e._stopped; n++) {
				let e = i[n];
				e && Tn(e, t, 5, a);
			}
		} else Tn(r, t, 5, [e]);
	};
	return n.value = e, n.attached = qo(), n;
}
var Yo = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && e.charCodeAt(2) > 96 && e.charCodeAt(2) < 123, Xo = (e, t, n, r, i, a) => {
	let o = i === "svg";
	t === "class" ? xo(e, r, o) : t === "style" ? Oo(e, n, r) : c(t) ? l(t) || Vo(e, t, n, r, a) : (t[0] === "." ? (t = t.slice(1), 1) : t[0] === "^" ? (t = t.slice(1), 0) : Zo(e, t, r, o)) ? (Lo(e, t, r), e.tagName.includes("-") || t !== "value" && t !== "checked" && t !== "selected" || Io(e, t, r, o, a, t !== "value")) : e._isVueCE && (Qo(e, t) || e._def.__asyncLoader && (/[A-Z]/.test(t) || !y(r))) ? Lo(e, j(t), r, a, t) : (t === "true-value" ? e._trueValue = r : t === "false-value" && (e._falseValue = r), Io(e, t, r, o));
};
function Zo(e, t, n, r) {
	if (r) return !!(t === "innerHTML" || t === "textContent" || t in e && Yo(t) && v(n));
	if (t === "spellcheck" || t === "draggable" || t === "translate" || t === "autocorrect" || t === "sandbox" && e.tagName === "IFRAME" || t === "form" || t === "list" && e.tagName === "INPUT" || t === "type" && e.tagName === "TEXTAREA") return !1;
	if (t === "width" || t === "height") {
		let t = e.tagName;
		if (t === "IMG" || t === "VIDEO" || t === "CANVAS" || t === "SOURCE") return !1;
	}
	return Yo(t) && y(n) ? !1 : t in e;
}
function Qo(e, t) {
	let n = e._def.props;
	if (!n) return !1;
	let r = j(t);
	return Array.isArray(n) ? n.some((e) => j(e) === r) : Object.keys(n).some((e) => j(e) === r);
}
var $o = (e) => {
	let t = e.props["onUpdate:modelValue"] || !1;
	return m(t) ? (e) => ie(t, e) : t;
};
function es(e) {
	e.target.composing = !0;
}
function ts(e) {
	let t = e.target;
	t.composing && (t.composing = !1, t.dispatchEvent(new Event("input")));
}
var ns = /* @__PURE__ */ Symbol("_assign"), rs = /* @__PURE__ */ Symbol("_initialValue");
function is(e, t, n) {
	return t && (e = e.trim()), n && (e = oe(e)), e;
}
var as = {
	created(e, { modifiers: { lazy: t, trim: n, number: r } }, i) {
		e.parentNode && (e.type === "text" ? e[rs] = e.defaultValue.replace(/[\r\n]/g, "") : e.type === "textarea" && (e[rs] = e.defaultValue.replace(/\r\n?/g, "\n"))), e[ns] = $o(i);
		let a = r || i.props && i.props.type === "number";
		Ro(e, t ? "change" : "input", (t) => {
			t.target.composing || e[ns](is(e.value, n, a));
		}), (n || a) && Ro(e, "change", () => {
			e.value = is(e.value, n, a);
		}), t || (Ro(e, "compositionstart", es), Ro(e, "compositionend", ts), Ro(e, "change", ts));
	},
	mounted(e, { value: t, modifiers: { trim: n, number: r } }) {
		let i = t ?? "", a = e[rs];
		delete e[rs], a !== void 0 && (e.type === "text" || e.type === "textarea") && e.value !== a ? e[ns](is(e.value, n, r)) : e.value = i;
	},
	beforeUpdate(e, { value: t, oldValue: n, modifiers: { lazy: r, trim: i, number: a } }, o) {
		if (e[ns] = $o(o), e.composing) return;
		let s = (a || e.type === "number") && !/^0\d/.test(e.value) ? oe(e.value) : e.value, c = t ?? "";
		if (s === c) return;
		let l = e.getRootNode();
		(l instanceof Document || l instanceof ShadowRoot) && l.activeElement === e && e.type !== "range" && (r && t === n || i && e.value.trim() === c) || (e.value = c);
	}
}, os = {
	deep: !0,
	created(e, t, n) {
		e[ns] = $o(n), Ro(e, "change", () => {
			let t = e._modelValue, n = ds(e), r = e.checked, i = e[ns];
			if (m(t)) {
				let e = xe(t, n), a = e !== -1;
				if (r && !a) i(t.concat(n));
				else if (!r && a) {
					let n = [...t];
					n.splice(e, 1), i(n);
				}
			} else if (g(t)) {
				let e = new Set(t);
				r ? e.add(n) : e.delete(n), i(e);
			} else i(fs(e, r));
		});
	},
	mounted: ss,
	beforeUpdate(e, t, n) {
		e[ns] = $o(n), ss(e, t, n);
	}
};
function ss(e, { value: t, oldValue: n }, r) {
	e._modelValue = t;
	let i;
	if (m(t)) i = xe(t, r.props.value) > -1;
	else if (g(t)) i = t.has(r.props.value);
	else {
		if (t === n) return;
		i = be(t, fs(e, !0));
	}
	e.checked !== i && (e.checked = i);
}
var cs = {
	deep: !0,
	created(e, { value: t, modifiers: { number: n } }, r) {
		e._modelValue = t, Ro(e, "change", () => {
			let t = Array.prototype.filter.call(e.options, (e) => e.selected).map((e) => n ? oe(ds(e)) : ds(e)), r = e.multiple, i = r ? g(e._modelValue) ? new Set(t) : t : t[0], a = e._pendingValue = [r, r ? m(i) ? t.slice() : t : i];
			try {
				e[ns](i);
			} finally {
				Fn(() => {
					e._pendingValue === a && (e._pendingValue = void 0);
				});
			}
		}), e[ns] = $o(r);
	},
	mounted(e, { value: t }) {
		us(e, t);
	},
	beforeUpdate(e, { value: t }, n) {
		e._modelValue = t, e[ns] = $o(n);
	},
	updated(e, { value: t }) {
		let n = e._pendingValue;
		e._pendingValue = void 0, n && n[0] === e.multiple && ls(t, n[1], n[0]) || us(e, t);
	}
};
function ls(e, t, n) {
	if (!n || m(e)) return be(e, t);
	if (g(e)) {
		if (e.size !== t.length) return !1;
		for (let n of t) if (!e.has(n)) return !1;
		return !0;
	}
	return !1;
}
function us(e, t) {
	let n = e.multiple, r = m(t);
	if (!n || r || g(t)) {
		for (let i = 0, a = e.options.length; i < a; i++) {
			let a = e.options[i], o = ds(a);
			if (n) {
				if (r) {
					let e = typeof o;
					a.selected = e === "string" || e === "number" ? t.some((e) => String(e) === String(o)) : xe(t, o) > -1;
				} else a.selected = t.has(o);
			} else if (be(ds(a), t)) {
				e.selectedIndex !== i && (e.selectedIndex = i);
				return;
			}
		}
		!n && e.selectedIndex !== -1 && (e.selectedIndex = -1);
	}
}
function ds(e) {
	return "_value" in e ? e._value : e.value;
}
function fs(e, t) {
	let n = t ? "_trueValue" : "_falseValue";
	return n in e ? e[n] : t;
}
var ps = [
	"ctrl",
	"shift",
	"alt",
	"meta"
], ms = {
	stop: (e) => e.stopPropagation(),
	prevent: (e) => e.preventDefault(),
	self: (e) => e.target !== e.currentTarget,
	ctrl: (e) => !e.ctrlKey,
	shift: (e) => !e.shiftKey,
	alt: (e) => !e.altKey,
	meta: (e) => !e.metaKey,
	left: (e) => "button" in e && e.button !== 0,
	middle: (e) => "button" in e && e.button !== 1,
	right: (e) => "button" in e && e.button !== 2,
	exact: (e, t) => ps.some((n) => e[`${n}Key`] && !t.includes(n))
}, hs = (e, t) => {
	if (!e) return e;
	let n = e._withMods ||= {}, r = t.join(".");
	return n[r] || (n[r] = ((n, ...r) => {
		for (let e = 0; e < t.length; e++) {
			let r = ms[t[e]];
			if (r && r(n, t)) return;
		}
		return e(n, ...r);
	}));
}, gs = {
	esc: "escape",
	space: " ",
	up: "arrow-up",
	left: "arrow-left",
	right: "arrow-right",
	down: "arrow-down",
	delete: "backspace"
}, _s = (e, t) => {
	let n = e._withKeys ||= {}, r = t.join(".");
	return n[r] || (n[r] = ((n) => {
		if (!("key" in n)) return;
		let r = te(n.key);
		if (t.some((e) => e === r || gs[e] === r)) return e(n);
	}));
}, vs = /* @__PURE__ */ u({ patchProp: Xo }, yo), ys;
function bs() {
	return ys ||= ca(vs);
}
var xs = ((...e) => {
	let t = bs().createApp(...e), { mount: n } = t;
	return t.mount = (e) => {
		let r = Cs(e);
		if (!r) return;
		let i = t._component;
		v(i) || i.render || i.template || (i.template = r.innerHTML), r.nodeType === 1 && (r.textContent = "");
		let a = n(r, !1, Ss(r));
		return r instanceof Element && (r.removeAttribute("v-cloak"), r.setAttribute("data-v-app", "")), a;
	}, t;
});
function Ss(e) {
	if (e instanceof SVGElement) return "svg";
	if (typeof MathMLElement == "function" && e instanceof MathMLElement) return "mathml";
}
function Cs(e) {
	return y(e) ? document.querySelector(e) : e;
}
// node_modules/.pnpm/@intlify+shared@11.4.23/node_modules/@intlify/shared/dist/shared.mjs
var ws = typeof window < "u", Ts = (e, t = !1) => t ? Symbol.for(e) : Symbol(e), Es = (e, t, n) => Ds({
	l: e,
	k: t,
	s: n
}), Ds = (e) => JSON.stringify(e).replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029").replace(/\u0027/g, "\\u0027"), Os = (e) => typeof e == "number" && isFinite(e), ks = (e) => qs(e) === "[object Date]", As = (e) => qs(e) === "[object RegExp]", js = (e) => Js(e) && Object.keys(e).length === 0, Ms = Object.assign, Ns = Object.create, Ps = (e = null) => Ns(e), Fs, Is = () => Fs ||= typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : Ps(), Ls = Object.prototype.hasOwnProperty;
function Rs(e, t) {
	return Ls.call(e, t);
}
function zs(e, t) {
	let n = e[t];
	return Rs(e, t) ? n : void 0;
}
function Bs(e) {
	return Rs(Object.prototype, e);
}
var Vs = Array.isArray, Hs = (e) => typeof e == "function", Z = (e) => typeof e == "string", Us = (e) => typeof e == "boolean", Ws = (e) => typeof e == "object" && !!e, Gs = (e) => Ws(e) && Hs(e.then) && Hs(e.catch), Ks = Object.prototype.toString, qs = (e) => Ks.call(e), Js = (e) => qs(e) === "[object Object]", Ys = (e) => e == null ? "" : Vs(e) || Js(e) && e.toString === Ks ? JSON.stringify(e, null, 2) : String(e);
function Xs(e, t = "") {
	return e.reduce((e, n, r) => r === 0 ? e + n : e + t + n, "");
}
function Zs(e, t) {
	typeof console < "u" && (console.warn("[intlify] " + e), t && console.warn(t.stack));
}
function Qs(e) {
	return e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;").replace(/\//g, "&#x2F;").replace(/=/g, "&#x3D;");
}
function $s(e) {
	return e.replace(/&(?![a-z0-9#]{2,6};)/gi, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&apos;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
var ec = /^javascript:/i, tc = /^(?:href|xlink:href|src|action|formaction)$/i, nc = /&#(?:x([0-9a-f]+)|(\d+));?/gi, rc = /&(?:Tab|NewLine);/g, ic = /&colon;?/gi, ac = /[\u0000-\u0020\u007f-\u009f]/g, oc = /^on\w/i, sc = /^srcdoc$/i, cc = /^(?:base|animate|set|script|plaintext)$/i, lc = /^(?:iframe|noembed|noframes|noscript|style|textarea|title|xmp)$/i, uc = /<(\/?)([a-z][^\t\n\f\r />]*)/iy, dc = /([\t\n\f\r /]*)(?:(>)|([^\t\n\f\r />][^\t\n\f\r />=]*)(?:[\t\n\f\r ]*=[\t\n\f\r ]*(?:(["'])([\s\S]*?)(\4|$)|([^\t\n\f\r >]*)))?)/y, fc = /<!--(?:>|->|[\s\S]*?--!?>)/y;
function pc(e, t, n) {
	let r = t || n;
	if (!r) return e;
	let i = Number.parseInt(r, t ? 16 : 10);
	return i <= 127 ? String.fromCharCode(i) : e;
}
function mc(e) {
	let t = e.replace(nc, pc).replace(rc, "").replace(ic, ":").replace(ac, "");
	return ec.test(t);
}
function hc(e) {
	let t = /url\s*\(/gi, n = "", r = 0, i;
	for (; (i = t.exec(e)) !== null;) {
		let a = i.index, o = t.lastIndex - 1, s = o + 1, c = 1, l = null;
		for (; s < e.length; s++) {
			let t = e[s];
			if (l) t === l && (l = null);
			else if (t === "\"" || t === "'") l = t;
			else if (t === "(") c++;
			else if (t === ")" && (c--, c === 0)) break;
		}
		if (c !== 0) break;
		let u = e.slice(o + 1, s).trim(), d = u.startsWith("\"") && u.endsWith("\"") || u.startsWith("'") && u.endsWith("'") ? u.slice(1, -1).trim() : u;
		n += e.slice(r, a), n += mc(d) ? "url(about:blank)" : e.slice(a, s + 1), r = s + 1;
	}
	return n + e.slice(r);
}
function gc(e, t) {
	return tc.test(e) && mc(t) ? "about:blank" : $s(e.toLowerCase() === "style" ? hc(t) : t);
}
function _c(e) {
	return e.replace(/</g, "&lt;");
}
function vc(e, t, n, r) {
	let i = e;
	if (oc.test(e) ? (r.eventHandler = !0, i = `&#111;n${e.slice(2)}`) : sc.test(e) && (r.srcdoc = !0, i = `&#115;${e.slice(1)}`), t === void 0) return i;
	let a = n || "";
	return `${i}=${a}${gc(e, t)}${a}`;
}
var yc = 0, bc = 1, xc = 2, Sc = /^(?:area|base|basefont|bgsound|br|col|embed|frame|hr|image|img|input|keygen|link|meta|param|source|track|wbr|html|head|body|frameset)$/, Cc = /^(?:b|big|blockquote|body|br|center|code|dd|div|dl|dt|em|embed|h[1-6]|head|hr|i|img|li|listing|menu|meta|nobr|ol|p|pre|ruby|s|small|span|strong|strike|sub|sup|table|tt|u|ul|var)$/, wc = /^(?:address|article|aside|blockquote|center|details|dialog|dir|div|dl|fieldset|figcaption|figure|footer|header|hgroup|main|menu|nav|ol|p|search|section|summary|ul|h[1-6]|pre|listing|form|li|dd|dt|plaintext|table|hr|xmp)$/, Tc = /^(?:applet|caption|html|table|td|th|marquee|object|template|button)$/, Ec = /^(?:foreignobject|desc|title)$/, Dc = /^(?:foreignobject|desc|mi|mo|mn|ms|mtext|annotation-xml)$/, Oc = /^(?:mi|mo|mn|ms|mtext)$/, kc = /^(?:text\/html|application\/xhtml\+xml)$/i;
function Ac(e) {
	return e.replace(/[A-Z]+/g, (e) => e.toLowerCase());
}
function jc(e, t) {
	return !!e && e.namespace !== yc && (!e.integration || Oc.test(e.name) && (t === "mglyph" || t === "malignmark")) && (e.name !== "annotation-xml" || t !== "svg");
}
function Mc(e, t) {
	return Cc.test(e) || e === "font" && (t.has("color") || t.has("face") || t.has("size"));
}
function Nc(e, t, n) {
	let r = "";
	for (let i = e.length - 1; i >= t; i--) {
		let t = e[i];
		t.namespace === yc && t.name === "form" ? n[t.part] = _c(n[t.part]) : r += `</${t.name}>`;
	}
	return e.length = t, r;
}
function Pc(e, t) {
	let n = e.length;
	for (; n > 0 && e[n - 1].namespace !== yc && !e[n - 1].integration;) n--;
	return Nc(e, n, t);
}
function Fc(e, t, n, r, i) {
	let a = t.length + 1, o = "", s = e[e.length - 1];
	if (jc(s, n)) {
		if (!Mc(n, r)) return i || e.push({
			name: n,
			namespace: s.namespace,
			integration: s.namespace === bc ? Ec.test(n) : Oc.test(n) || n === "annotation-xml" && kc.test((r.get("encoding") || "").replace(nc, pc)),
			part: a
		}), o;
		o = Pc(e, t);
	}
	if (wc.test(n)) for (let n = e.length - 1; n >= 0; n--) {
		let r = e[n];
		if (r.namespace === yc ? Tc.test(r.name) : r.integration) break;
		if (r.namespace === yc && r.name === "p") {
			o += Nc(e, n, t);
			break;
		}
	}
	if (!Dc.test(n)) return n === "svg" || n === "math" ? i || e.push({
		name: n,
		namespace: n === "svg" ? bc : xc,
		integration: !1,
		part: a
	}) : Sc.test(n) || e.push({
		name: n,
		namespace: yc,
		integration: !1,
		part: a
	}), o;
}
function Ic(e, t, n) {
	let r = "";
	(n === "p" || n === "br") && (r = Pc(e, t));
	let i = e.length - 1;
	for (; i >= 0 && e[i].namespace !== yc && e[i].name !== n;) i--;
	if (!(i >= 0 && e[i].namespace !== yc)) for (; i >= 0 && (e[i].namespace !== yc || e[i].name !== n);) i--;
	return i < 0 ? n === "br" || n === "p" ? r : void 0 : (r += Nc(e, i + 1, t), e.length = i, r);
}
function Lc(e, t, n) {
	uc.lastIndex = t;
	let r = uc.exec(e);
	if (!r) return;
	let [, i, a] = r, o = r[0], s = /* @__PURE__ */ new Map(), c;
	for (dc.lastIndex = uc.lastIndex; c = dc.exec(e);) {
		let [r, l, u, d, f, p, m, h] = c;
		if (u) {
			let n = dc.lastIndex;
			return [
				i ? e.slice(t, n) : o + r,
				a,
				n,
				!i && l.endsWith("/"),
				s
			];
		}
		if (f && !m) break;
		if (!i) {
			let e = f ? p : h, t = Ac(d);
			s.has(t) || s.set(t, e || ""), o += l + vc(d, e, f, n);
		}
	}
	return [
		o,
		a,
		-1,
		!1,
		s
	];
}
function Rc(e, t, n) {
	for (let r = e.indexOf("</", t); r !== -1; r = e.indexOf("</", r + 2)) {
		let t = Lc(e, r, {});
		if (t && t[1].toLowerCase() === n.toLowerCase()) return t[2] === -1 ? -1 : r;
	}
	return -1;
}
function zc(e) {
	let t = {}, n = [], r = [], i = 0, a;
	for (; (a = e.indexOf("<", i)) !== -1;) {
		n.push(e.slice(i, a)), i = a + 1;
		let o = Lc(e, a, t);
		if (o) {
			let [s, c, l, u, d] = o;
			if (l === -1) {
				t.unclosed = !0, n.push(_c(e.slice(a))), i = e.length;
				break;
			}
			if (i = l, s[1] === "/") {
				let e = Ic(r, n, Ac(c));
				e === void 0 ? t.closed = !0 : (e && (t.closed = !0), n.push(e + s));
			} else if (cc.test(c)) t.element = !0, n.push(_c(s));
			else {
				let a = "";
				if (lc.test(c)) {
					let r = Rc(e, l, c);
					if (r === -1) {
						t.unclosed = !0, n.push(_c(s));
						continue;
					}
					a = _c(e.slice(l, r)), i = r;
				}
				let o = Fc(r, n, Ac(c), d, u);
				o === void 0 ? (t.closed = !0, n.push(_c(s) + a)) : n.push(o, s + a);
			}
		} else fc.lastIndex = a, fc.test(e) ? (n.push(e.slice(a, fc.lastIndex)), i = fc.lastIndex) : (e.startsWith("<!--", a) && (t.unclosed = !0), n.push("&lt;"));
	}
	n.push(e.slice(i));
	for (let e = r.length - 1; e >= 0; e--) {
		let i = r[e];
		t.closed = !0, i.namespace === yc && i.name === "form" ? n[i.part] = _c(n[i.part]) : n.push(`</${i.name}>`);
	}
	return n.join("");
}
var Bc = (e) => !Ws(e) || Vs(e);
function Vc(e, t) {
	if (Bc(e) || Bc(t) || t === Object.prototype) throw Error("Invalid value");
	let n = [{
		src: e,
		des: t
	}];
	for (; n.length;) {
		let { src: e, des: t } = n.pop();
		Object.keys(e).forEach((r) => {
			if (r === "__proto__") return;
			let i = e[r];
			if (Vs(i)) {
				let e = [];
				e.length = i.length, t[r] = e, n.push({
					src: i,
					des: e
				});
			} else Ws(i) ? ((!Ws(t[r]) || Vs(t[r])) && (t[r] = Ps()), n.push({
				src: i,
				des: t[r]
			})) : t[r] = i;
		});
	}
}
// node_modules/.pnpm/@intlify+message-compiler@11.4.23/node_modules/@intlify/message-compiler/dist/message-compiler.mjs
function Hc(e, t, n) {
	return {
		line: e,
		column: t,
		offset: n
	};
}
function Uc(e, t, n) {
	let r = {
		start: e,
		end: t
	};
	return n != null && (r.source = n), r;
}
var Wc = {
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
	MUST_HAVE_MESSAGES_IN_PLURAL: 11,
	UNEXPECTED_EMPTY_LINKED_MODIFIER: 12,
	UNEXPECTED_EMPTY_LINKED_KEY: 13,
	UNEXPECTED_LEXICAL_ANALYSIS: 14,
	UNHANDLED_CODEGEN_NODE_TYPE: 15,
	UNHANDLED_MINIFIER_NODE_TYPE: 16
};
Wc.EXPECTED_TOKEN, Wc.INVALID_TOKEN_IN_PLACEHOLDER, Wc.UNTERMINATED_SINGLE_QUOTE_IN_PLACEHOLDER, Wc.UNKNOWN_ESCAPE_SEQUENCE, Wc.INVALID_UNICODE_ESCAPE_SEQUENCE, Wc.UNBALANCED_CLOSING_BRACE, Wc.UNTERMINATED_CLOSING_BRACE, Wc.EMPTY_PLACEHOLDER, Wc.NOT_ALLOW_NEST_PLACEHOLDER, Wc.INVALID_LINKED_FORMAT, Wc.MUST_HAVE_MESSAGES_IN_PLURAL, Wc.UNEXPECTED_EMPTY_LINKED_MODIFIER, Wc.UNEXPECTED_EMPTY_LINKED_KEY, Wc.UNEXPECTED_LEXICAL_ANALYSIS, Wc.UNHANDLED_CODEGEN_NODE_TYPE, Wc.UNHANDLED_MINIFIER_NODE_TYPE;
function Gc(e, t, n = {}) {
	let { domain: r, messages: i, args: a } = n, o = SyntaxError(String(e));
	return o.code = e, t && (o.location = t), o.domain = r, o;
}
function Kc(e) {
	throw e;
}
var qc = " ", Jc = "\r", Yc = "\n", Xc = "\u2028", Zc = "\u2029";
function Qc(e) {
	let t = e, n = 0, r = 1, i = 1, a = 0, o = (e) => t[e] === Jc && t[e + 1] === Yc, s = (e) => t[e] === Yc, c = (e) => t[e] === Zc, l = (e) => t[e] === Xc, u = (e) => o(e) || s(e) || c(e) || l(e), d = () => n, f = () => r, p = () => i, m = () => a, h = (e) => o(e) || c(e) || l(e) ? Yc : t[e], g = () => h(n), _ = () => h(n + a);
	function v() {
		return a = 0, u(n) && (r++, i = 0), o(n) && n++, n++, i++, t[n];
	}
	function y() {
		return o(n + a) && a++, a++, t[n + a];
	}
	function b() {
		n = 0, r = 1, i = 1, a = 0;
	}
	function x(e = 0) {
		a = e;
	}
	function S() {
		let e = n + a;
		for (; e !== n;) v();
		a = 0;
	}
	return {
		index: d,
		line: f,
		column: p,
		peekOffset: m,
		charAt: h,
		currentChar: g,
		currentPeek: _,
		next: v,
		peek: y,
		reset: b,
		resetPeek: x,
		skipToPeek: S
	};
}
var $c = void 0, el = "	", tl = "'", nl = "tokenizer";
function rl(e, t = {}) {
	let n = t.location !== !1, r = Qc(e), i = () => r.index(), a = () => Hc(r.line(), r.column(), r.index()), o = a(), s = i(), c = {
		currentType: 13,
		offset: s,
		startLoc: o,
		endLoc: o,
		lastType: 13,
		lastOffset: s,
		lastStartLoc: o,
		lastEndLoc: o,
		braceNest: 0,
		inLinked: !1,
		text: ""
	}, l = () => c, { onError: u } = t;
	function d(e, t, r, ...i) {
		let a = l();
		if (t.column += r, t.offset += r, u) {
			let r = Gc(e, n ? Uc(a.startLoc, t) : null, {
				domain: nl,
				args: i
			});
			u(r);
		}
	}
	function f(e, t, r) {
		e.endLoc = a(), e.currentType = t;
		let i = { type: t };
		return n && (i.loc = Uc(e.startLoc, e.endLoc)), r != null && (i.value = r), i;
	}
	let p = (e) => f(e, 13);
	function m(e, t) {
		return e.currentChar() === t ? (e.next(), t) : (d(Wc.EXPECTED_TOKEN, a(), 0, t), "");
	}
	function h(e) {
		let t = "";
		for (; e.currentPeek() === qc || e.currentPeek() === Yc;) t += e.currentPeek(), e.peek();
		return t;
	}
	function g(e) {
		let t = h(e);
		return e.skipToPeek(), t;
	}
	function _(e) {
		if (e === $c) return !1;
		let t = e.charCodeAt(0);
		return t >= 97 && t <= 122 || t >= 65 && t <= 90 || t === 95;
	}
	function v(e) {
		if (e === $c) return !1;
		let t = e.charCodeAt(0);
		return t >= 48 && t <= 57;
	}
	function y(e, t) {
		let { currentType: n } = t;
		if (n !== 2) return !1;
		h(e);
		let r = _(e.currentPeek());
		return e.resetPeek(), r;
	}
	function b(e, t) {
		let { currentType: n } = t;
		if (n !== 2) return !1;
		h(e);
		let r = v(e.currentPeek() === "-" ? e.peek() : e.currentPeek());
		return e.resetPeek(), r;
	}
	function x(e, t) {
		let { currentType: n } = t;
		if (n !== 2) return !1;
		h(e);
		let r = e.currentPeek() === tl;
		return e.resetPeek(), r;
	}
	function S(e, t) {
		let { currentType: n } = t;
		if (n !== 7) return !1;
		h(e);
		let r = e.currentPeek() === ".";
		return e.resetPeek(), r;
	}
	function C(e, t) {
		let { currentType: n } = t;
		if (n !== 8) return !1;
		h(e);
		let r = _(e.currentPeek());
		return e.resetPeek(), r;
	}
	function w(e, t) {
		let { currentType: n } = t;
		if (n !== 7 && n !== 11) return !1;
		h(e);
		let r = e.currentPeek() === ":";
		return e.resetPeek(), r;
	}
	function T(e, t) {
		let { currentType: n } = t;
		if (n !== 9) return !1;
		let r = () => {
			let t = e.currentPeek();
			return t === "{" ? _(e.peek()) : t === "@" || t === "|" || t === ":" || t === "." || t === qc || !t ? !1 : t === Yc ? (e.peek(), r()) : D(e, !1);
		}, i = r();
		return e.resetPeek(), i;
	}
	function E(e) {
		h(e);
		let t = e.currentPeek() === "|";
		return e.resetPeek(), t;
	}
	function D(e, t = !0) {
		let n = (t = !1, r = "") => {
			let i = e.currentPeek();
			return i === "{" || i === "@" || !i ? t : i === "|" ? r !== qc && r !== Yc : i === qc ? (e.peek(), n(!0, qc)) : i !== Yc || (e.peek(), n(!0, Yc));
		}, r = n();
		return t && e.resetPeek(), r;
	}
	function O(e, t) {
		let n = e.currentChar();
		if (n !== $c) return t(n) ? (e.next(), n) : null;
	}
	function k(e) {
		let t = e.charCodeAt(0);
		return t >= 97 && t <= 122 || t >= 65 && t <= 90 || t >= 48 && t <= 57 || t === 95 || t === 36;
	}
	function A(e) {
		return O(e, k);
	}
	function j(e) {
		let t = e.charCodeAt(0);
		return t >= 97 && t <= 122 || t >= 65 && t <= 90 || t >= 48 && t <= 57 || t === 95 || t === 36 || t === 45;
	}
	function ee(e) {
		return O(e, j);
	}
	function te(e) {
		let t = e.charCodeAt(0);
		return t >= 48 && t <= 57;
	}
	function M(e) {
		return O(e, te);
	}
	function ne(e) {
		let t = e.charCodeAt(0);
		return t >= 48 && t <= 57 || t >= 65 && t <= 70 || t >= 97 && t <= 102;
	}
	function re(e) {
		return O(e, ne);
	}
	function ie(e) {
		let t = "", n = "";
		for (; t = M(e);) n += t;
		return n;
	}
	function ae(e) {
		let t = "";
		for (;;) {
			let n = e.currentChar();
			if (n === "\\") {
				let r = e.peek();
				r === "{" || r === "}" || r === "@" || r === "|" || r === "\\" ? (t += n + r, e.next(), e.next()) : (e.resetPeek(), t += n, e.next());
			} else if (n === "{" || n === "}" || n === "@" || n === "|" || !n) break;
			else if (n === qc || n === Yc) {
				if (D(e)) t += n, e.next();
				else if (E(e)) break;
				else t += n, e.next();
			} else t += n, e.next();
		}
		return t;
	}
	function oe(e) {
		g(e);
		let t = "", n = "";
		for (; t = ee(e);) n += t;
		let r = e.currentChar();
		if (r && r !== "}" && r !== $c && r !== qc && r !== Yc && r !== "　") {
			let t = pe(e);
			return d(Wc.INVALID_TOKEN_IN_PLACEHOLDER, a(), 0, n + t), n + t;
		}
		return e.currentChar() === $c && d(Wc.UNTERMINATED_CLOSING_BRACE, a(), 0), n;
	}
	function se(e) {
		g(e);
		let t = "";
		return e.currentChar() === "-" ? (e.next(), t += `-${ie(e)}`) : t += ie(e), e.currentChar() === $c && d(Wc.UNTERMINATED_CLOSING_BRACE, a(), 0), t;
	}
	function ce(e) {
		return e !== tl && e !== Yc;
	}
	function le(e) {
		g(e), m(e, "'");
		let t = "", n = "";
		for (; t = O(e, ce);) n += t === "\\" ? ue(e) : t;
		let r = e.currentChar();
		return r === Yc || r === $c ? (d(Wc.UNTERMINATED_SINGLE_QUOTE_IN_PLACEHOLDER, a(), 0), r === Yc && (e.next(), m(e, "'")), n) : (m(e, "'"), n);
	}
	function ue(e) {
		let t = e.currentChar();
		switch (t) {
			case "\\":
			case "'": return e.next(), `\\${t}`;
			case "u": return de(e, t, 4);
			case "U": return de(e, t, 6);
			default: return d(Wc.UNKNOWN_ESCAPE_SEQUENCE, a(), 0, t), "";
		}
	}
	function de(e, t, n) {
		m(e, t);
		let r = "";
		for (let i = 0; i < n; i++) {
			let n = re(e);
			if (!n) {
				d(Wc.INVALID_UNICODE_ESCAPE_SEQUENCE, a(), 0, `\\${t}${r}${e.currentChar()}`);
				break;
			}
			r += n;
		}
		return `\\${t}${r}`;
	}
	function fe(e) {
		return e !== "{" && e !== "}" && e !== qc && e !== Yc;
	}
	function pe(e) {
		g(e);
		let t = "", n = "";
		for (; t = O(e, fe);) n += t;
		return n;
	}
	function me(e) {
		let t = "", n = "";
		for (; t = A(e);) n += t;
		return n;
	}
	function he(e) {
		return e !== "{" && e !== "@" && e !== "|" && e !== "(" && e !== ")" && e !== qc && e !== el && e !== Yc;
	}
	function ge(e) {
		for (; e.currentChar() === el;) e.next();
		let t = "", n;
		for (; (n = e.currentChar()) && he(n);) t += n, e.next();
		return t;
	}
	function _e(e) {
		g(e);
		let t = m(e, "|");
		return g(e), t;
	}
	function ve(e, t) {
		let n = null;
		switch (e.currentChar()) {
			case "{": return t.braceNest >= 1 && d(Wc.NOT_ALLOW_NEST_PLACEHOLDER, a(), 0), e.next(), n = f(t, 2, "{"), g(e), t.braceNest++, n;
			case "}": return t.braceNest > 0 && t.currentType === 2 && d(Wc.EMPTY_PLACEHOLDER, a(), 0), e.next(), n = f(t, 3, "}"), t.braceNest--, t.braceNest > 0 && g(e), t.inLinked && t.braceNest === 0 && (t.inLinked = !1), n;
			case "@": return t.braceNest > 0 && d(Wc.UNTERMINATED_CLOSING_BRACE, a(), 0), n = ye(e, t) || p(t), t.braceNest = 0, n;
			default: {
				let r = !0, i = !0, o = !0;
				if (E(e)) return t.braceNest > 0 && d(Wc.UNTERMINATED_CLOSING_BRACE, a(), 0), n = f(t, 1, _e(e)), t.braceNest = 0, t.inLinked = !1, n;
				if (t.braceNest > 0 && (t.currentType === 4 || t.currentType === 5 || t.currentType === 6)) return d(Wc.UNTERMINATED_CLOSING_BRACE, a(), 0), t.braceNest = 0, be(e, t);
				if (r = y(e, t)) return n = f(t, 4, oe(e)), g(e), n;
				if (i = b(e, t)) return n = f(t, 5, se(e)), g(e), n;
				if (o = x(e, t)) return n = f(t, 6, le(e)), g(e), n;
				if (!r && !i && !o) return n = f(t, 12, pe(e)), d(Wc.INVALID_TOKEN_IN_PLACEHOLDER, a(), 0, n.value), g(e), n;
				break;
			}
		}
		return n;
	}
	function ye(e, t) {
		let { currentType: n } = t, r = null, i = e.currentChar();
		switch (n !== 7 && n !== 8 && n !== 11 && n !== 9 || i !== Yc && i !== qc || d(Wc.INVALID_LINKED_FORMAT, a(), 0), i) {
			case "@": return e.next(), r = f(t, 7, "@"), t.inLinked = !0, r;
			case ".": return g(e), e.next(), f(t, 8, ".");
			case ":": return g(e), e.next(), f(t, 9, ":");
			default: return E(e) ? (r = f(t, 1, _e(e)), t.braceNest = 0, t.inLinked = !1, r) : S(e, t) || w(e, t) ? (g(e), ye(e, t)) : C(e, t) ? (g(e), f(t, 11, me(e))) : T(e, t) ? (g(e), i === "{" ? ve(e, t) || r : f(t, 10, ge(e))) : (n === 7 && d(Wc.INVALID_LINKED_FORMAT, a(), 0), t.braceNest = 0, t.inLinked = !1, be(e, t));
		}
	}
	function be(e, t) {
		let n = { type: 13 };
		if (t.braceNest > 0) return ve(e, t) || p(t);
		if (t.inLinked) return ye(e, t) || p(t);
		switch (e.currentChar()) {
			case "{": return ve(e, t) || p(t);
			case "}": return d(Wc.UNBALANCED_CLOSING_BRACE, a(), 0), e.next(), f(t, 3, "}");
			case "@": return ye(e, t) || p(t);
			default:
				if (E(e)) return n = f(t, 1, _e(e)), t.braceNest = 0, t.inLinked = !1, n;
				if (D(e)) return f(t, 0, ae(e));
		}
		return n;
	}
	function xe() {
		let { currentType: e, offset: t, startLoc: n, endLoc: o } = c;
		return c.lastType = e, c.lastOffset = t, c.lastStartLoc = n, c.lastEndLoc = o, c.offset = i(), c.startLoc = a(), r.currentChar() === $c ? f(c, 13) : be(r, c);
	}
	return {
		nextToken: xe,
		currentOffset: i,
		currentPosition: a,
		context: l
	};
}
var il = "parser", al = /(?:\\\\|\\'|\\u([0-9a-fA-F]{4})|\\U([0-9a-fA-F]{6}))/g, ol = /\\([\\@{}|])/g;
function sl(e, t) {
	return t;
}
function cl(e, t, n) {
	switch (e) {
		case "\\\\": return "\\";
		case "\\'": return "'";
		default: {
			let e = parseInt(t || n, 16);
			return e <= 55295 || e >= 57344 ? String.fromCodePoint(e) : "�";
		}
	}
}
function ll(e = {}) {
	let t = e.location !== !1, { onError: n } = e;
	function r(e, r, i, a, ...o) {
		let s = e.currentPosition();
		if (s.offset += a, s.column += a, n) {
			let e = Gc(r, t ? Uc(i, s) : null, {
				domain: il,
				args: o
			});
			n(e);
		}
	}
	function i(e, n, r) {
		let i = { type: e };
		return t && (i.start = n, i.end = n, i.loc = {
			start: r,
			end: r
		}), i;
	}
	function a(e, n, r, i) {
		t && (e.end = n, e.loc && (e.loc.end = r));
	}
	function o(e, t) {
		let n = e.context(), r = i(3, n.offset, n.startLoc);
		return r.value = t.replace(ol, sl), a(r, e.currentOffset(), e.currentPosition()), r;
	}
	function s(e, t) {
		let { lastOffset: n, lastStartLoc: r } = e.context(), o = i(5, n, r);
		return o.index = parseInt(t, 10), e.nextToken(), a(o, e.currentOffset(), e.currentPosition()), o;
	}
	function c(e, t) {
		let { lastOffset: n, lastStartLoc: r } = e.context(), o = i(4, n, r);
		return o.key = t, e.nextToken(), a(o, e.currentOffset(), e.currentPosition()), o;
	}
	function l(e, t) {
		let { lastOffset: n, lastStartLoc: r } = e.context(), o = i(9, n, r);
		return o.value = t.replace(al, cl), e.nextToken(), a(o, e.currentOffset(), e.currentPosition()), o;
	}
	function u(e) {
		let t = e.nextToken(), n = e.context(), { lastOffset: o, lastStartLoc: s } = n, c = i(8, o, s);
		return t.type === 11 ? (t.value ?? r(e, Wc.UNEXPECTED_LEXICAL_ANALYSIS, n.lastStartLoc, 0, ul(t)), c.value = t.value || "", a(c, e.currentOffset(), e.currentPosition()), { node: c }) : (r(e, Wc.UNEXPECTED_EMPTY_LINKED_MODIFIER, n.lastStartLoc, 0), c.value = "", a(c, o, s), {
			nextConsumeToken: t,
			node: c
		});
	}
	function d(e, t) {
		let n = e.context(), r = i(7, n.offset, n.startLoc);
		return r.value = t, a(r, e.currentOffset(), e.currentPosition()), r;
	}
	function f(e) {
		let t = e.context(), n = i(6, t.offset, t.startLoc), o = e.nextToken();
		if (o.type === 8) {
			let t = u(e);
			n.modifier = t.node, o = t.nextConsumeToken || e.nextToken();
		}
		switch (o.type !== 9 && r(e, Wc.UNEXPECTED_LEXICAL_ANALYSIS, t.lastStartLoc, 0, ul(o)), o = e.nextToken(), o.type === 2 && (o = e.nextToken()), o.type) {
			case 10:
				o.value ?? r(e, Wc.UNEXPECTED_LEXICAL_ANALYSIS, t.lastStartLoc, 0, ul(o)), n.key = d(e, o.value || "");
				break;
			case 4:
				o.value ?? r(e, Wc.UNEXPECTED_LEXICAL_ANALYSIS, t.lastStartLoc, 0, ul(o)), n.key = c(e, o.value || "");
				break;
			case 5:
				o.value ?? r(e, Wc.UNEXPECTED_LEXICAL_ANALYSIS, t.lastStartLoc, 0, ul(o)), n.key = s(e, o.value || "");
				break;
			case 6:
				o.value ?? r(e, Wc.UNEXPECTED_LEXICAL_ANALYSIS, t.lastStartLoc, 0, ul(o)), n.key = l(e, o.value || "");
				break;
			default: {
				r(e, Wc.UNEXPECTED_EMPTY_LINKED_KEY, t.lastStartLoc, 0);
				let s = e.context(), c = i(7, s.offset, s.startLoc);
				return c.value = "", a(c, s.offset, s.startLoc), n.key = c, a(n, s.offset, s.startLoc), {
					nextConsumeToken: o,
					node: n
				};
			}
		}
		return a(n, e.currentOffset(), e.currentPosition()), { node: n };
	}
	function p(e) {
		let t = e.context(), n = i(2, t.currentType === 1 ? e.currentOffset() : t.offset, t.currentType === 1 ? t.endLoc : t.startLoc);
		n.items = [];
		let u = null;
		do {
			let i = u || e.nextToken();
			switch (u = null, i.type) {
				case 0:
					i.value ?? r(e, Wc.UNEXPECTED_LEXICAL_ANALYSIS, t.lastStartLoc, 0, ul(i)), n.items.push(o(e, i.value || ""));
					break;
				case 5:
					i.value ?? r(e, Wc.UNEXPECTED_LEXICAL_ANALYSIS, t.lastStartLoc, 0, ul(i)), n.items.push(s(e, i.value || ""));
					break;
				case 4:
					i.value ?? r(e, Wc.UNEXPECTED_LEXICAL_ANALYSIS, t.lastStartLoc, 0, ul(i)), n.items.push(c(e, i.value || ""));
					break;
				case 6:
					i.value ?? r(e, Wc.UNEXPECTED_LEXICAL_ANALYSIS, t.lastStartLoc, 0, ul(i)), n.items.push(l(e, i.value || ""));
					break;
				case 7: {
					let t = f(e);
					n.items.push(t.node), u = t.nextConsumeToken || null;
					break;
				}
			}
		} while (t.currentType !== 13 && t.currentType !== 1);
		return a(n, t.currentType === 1 ? t.lastOffset : e.currentOffset(), t.currentType === 1 ? t.lastEndLoc : e.currentPosition()), n;
	}
	function m(e, t, n, o) {
		let s = e.context(), c = o.items.length === 0, l = i(1, t, n);
		l.cases = [], l.cases.push(o);
		do {
			let t = p(e);
			c ||= t.items.length === 0, l.cases.push(t);
		} while (s.currentType !== 13);
		return c && r(e, Wc.MUST_HAVE_MESSAGES_IN_PLURAL, n, 0), a(l, e.currentOffset(), e.currentPosition()), l;
	}
	function h(e) {
		let t = e.context(), { offset: n, startLoc: r } = t, i = p(e);
		return t.currentType === 13 ? i : m(e, n, r, i);
	}
	function g(n) {
		let o = rl(n, Ms({}, e)), s = o.context(), c = i(0, s.offset, s.startLoc);
		return t && c.loc && (c.loc.source = n), c.body = h(o), e.onCacheKey && (c.cacheKey = e.onCacheKey(n)), s.currentType !== 13 && r(o, Wc.UNEXPECTED_LEXICAL_ANALYSIS, s.lastStartLoc, 0, n[s.offset] || ""), a(c, o.currentOffset(), o.currentPosition()), c;
	}
	return { parse: g };
}
function ul(e) {
	if (e.type === 13) return "EOF";
	let t = (e.value || "").replace(/\r?\n/gu, "\\n");
	return t.length > 10 ? t.slice(0, 9) + "…" : t;
}
function dl(e, t = {}) {
	let n = {
		ast: e,
		helpers: /* @__PURE__ */ new Set()
	};
	return {
		context: () => n,
		helper: (e) => (n.helpers.add(e), e)
	};
}
function fl(e, t) {
	for (let n = 0; n < e.length; n++) pl(e[n], t);
}
function pl(e, t) {
	switch (e.type) {
		case 1:
			fl(e.cases, t), t.helper("plural");
			break;
		case 2:
			fl(e.items, t);
			break;
		case 6:
			pl(e.key, t), t.helper("linked"), t.helper("type");
			break;
		case 5:
			t.helper("interpolate"), t.helper("list");
			break;
		case 4: t.helper("interpolate"), t.helper("named");
	}
}
function ml(e, t = {}) {
	let n = dl(e);
	n.helper("normalize"), e.body && pl(e.body, n);
	let r = n.context();
	e.helpers = Array.from(r.helpers);
}
function hl(e) {
	let t = e.body;
	return t.type === 2 ? gl(t) : t.cases.forEach((e) => gl(e)), e;
}
function gl(e) {
	if (e.items.length === 1) {
		let t = e.items[0];
		(t.type === 3 || t.type === 9) && (e.static = t.value, delete t.value);
	} else {
		let t = [];
		for (let n = 0; n < e.items.length; n++) {
			let r = e.items[n];
			if (r.type !== 3 && r.type !== 9 || r.value == null) break;
			t.push(r.value);
		}
		if (t.length === e.items.length) {
			e.static = Xs(t);
			for (let t = 0; t < e.items.length; t++) {
				let n = e.items[t];
				(n.type === 3 || n.type === 9) && delete n.value;
			}
		}
	}
}
function _l(e) {
	switch (e.t = e.type, e.type) {
		case 0: {
			let t = e;
			_l(t.body), t.b = t.body, delete t.body;
			break;
		}
		case 1: {
			let t = e, n = t.cases;
			for (let e = 0; e < n.length; e++) _l(n[e]);
			t.c = n, delete t.cases;
			break;
		}
		case 2: {
			let t = e, n = t.items;
			for (let e = 0; e < n.length; e++) _l(n[e]);
			t.i = n, delete t.items, t.static && (t.s = t.static, delete t.static);
			break;
		}
		case 3:
		case 9:
		case 8:
		case 7: {
			let t = e;
			t.value && (t.v = t.value, delete t.value);
			break;
		}
		case 6: {
			let t = e;
			_l(t.key), t.k = t.key, delete t.key, t.modifier && (_l(t.modifier), t.m = t.modifier, delete t.modifier);
			break;
		}
		case 5: {
			let t = e;
			t.i = t.index, delete t.index;
			break;
		}
		case 4: {
			let t = e;
			t.k = t.key, delete t.key;
			break;
		}
	}
	delete e.type;
}
function vl(e, t) {
	let { filename: n, breakLineCode: r, needIndent: i } = t, a = t.location !== !1, o = {
		filename: n,
		code: "",
		column: 1,
		line: 1,
		offset: 0,
		map: void 0,
		breakLineCode: r,
		needIndent: i,
		indentLevel: 0
	};
	a && e.loc && (o.source = e.loc.source);
	let s = () => o;
	function c(e, t) {
		o.code += e;
	}
	function l(e, t = !0) {
		let n = t ? r : "";
		c(i ? n + "  ".repeat(e) : n);
	}
	function u(e = !0) {
		let t = ++o.indentLevel;
		e && l(t);
	}
	function d(e = !0) {
		let t = --o.indentLevel;
		e && l(t);
	}
	function f() {
		l(o.indentLevel);
	}
	return {
		context: s,
		push: c,
		indent: u,
		deindent: d,
		newline: f,
		helper: (e) => `_${e}`,
		needIndent: () => o.needIndent
	};
}
function yl(e, t) {
	let { helper: n } = e;
	e.push(`${n("linked")}(`), Cl(e, t.key), t.modifier ? (e.push(", "), Cl(e, t.modifier), e.push(", _type")) : e.push(", undefined, _type"), e.push(")");
}
function bl(e, t) {
	let { helper: n, needIndent: r } = e;
	e.push(`${n("normalize")}([`), e.indent(r());
	let i = t.items.length;
	for (let n = 0; n < i && (Cl(e, t.items[n]), n !== i - 1); n++) e.push(", ");
	e.deindent(r()), e.push("])");
}
function xl(e, t) {
	let { helper: n, needIndent: r } = e;
	if (t.cases.length > 1) {
		e.push(`${n("plural")}([`), e.indent(r());
		let i = t.cases.length;
		for (let n = 0; n < i && (Cl(e, t.cases[n]), n !== i - 1); n++) e.push(", ");
		e.deindent(r()), e.push("])");
	}
}
function Sl(e, t) {
	t.body ? Cl(e, t.body) : e.push("null");
}
function Cl(e, t) {
	let { helper: n } = e;
	switch (t.type) {
		case 0:
			Sl(e, t);
			break;
		case 1:
			xl(e, t);
			break;
		case 2:
			bl(e, t);
			break;
		case 6:
			yl(e, t);
			break;
		case 8:
			e.push(JSON.stringify(t.value), t);
			break;
		case 7:
			e.push(JSON.stringify(t.value), t);
			break;
		case 5:
			e.push(`${n("interpolate")}(${n("list")}(${t.index}))`, t);
			break;
		case 4:
			e.push(`${n("interpolate")}(${n("named")}(${JSON.stringify(t.key)}))`, t);
			break;
		case 9:
			e.push(JSON.stringify(t.value), t);
			break;
		case 3: e.push(JSON.stringify(t.value), t);
	}
}
var wl = (e, t = {}) => {
	let n = Z(t.mode) ? t.mode : "normal", r = Z(t.filename) ? t.filename : "message.intl";
	t.sourceMap;
	let i = t.breakLineCode == null ? n === "arrow" ? ";" : "\n" : t.breakLineCode, a = t.needIndent ? t.needIndent : n !== "arrow", o = e.helpers || [], s = vl(e, {
		filename: r,
		breakLineCode: i,
		needIndent: a
	});
	s.push(n === "normal" ? "function __msg__ (ctx) {" : "(ctx) => {"), s.indent(a), o.length > 0 && (s.push(`const { ${Xs(o.map((e) => `${e}: _${e}`), ", ")} } = ctx`), s.newline()), s.push("return "), Cl(s, e), s.deindent(a), s.push("}"), delete e.helpers;
	let { code: c, map: l } = s.context();
	return {
		ast: e,
		code: c,
		map: l ? l.toJSON() : void 0
	};
};
function Tl(e, t = {}) {
	let n = Ms({}, t), r = !!n.jit, i = !!n.minify, a = n.optimize == null || n.optimize, o = ll(n).parse(e);
	return r ? (a && hl(o), i && _l(o), {
		ast: o,
		code: ""
	}) : (ml(o, n), wl(o, n));
}
// node_modules/.pnpm/@intlify+core-base@11.4.23/node_modules/@intlify/core-base/dist/core-base.mjs
function El() {
	typeof __INTLIFY_PROD_DEVTOOLS__ != "boolean" && (Is().__INTLIFY_PROD_DEVTOOLS__ = !1), typeof __INTLIFY_DROP_MESSAGE_COMPILER__ != "boolean" && (Is().__INTLIFY_DROP_MESSAGE_COMPILER__ = !1);
}
function Dl(e) {
	return Ws(e) && Ll(e) === 0 && (Rs(e, "b") || Rs(e, "body"));
}
var Ol = ["b", "body"];
function kl(e) {
	return Wl(e, Ol);
}
var Al = ["c", "cases"];
function jl(e) {
	return Wl(e, Al, []);
}
var Ml = ["s", "static"];
function Nl(e) {
	return Wl(e, Ml);
}
var Pl = ["i", "items"];
function Fl(e) {
	return Wl(e, Pl, []);
}
var Il = ["t", "type"];
function Ll(e) {
	return Wl(e, Il);
}
var Rl = ["v", "value"];
function zl(e, t) {
	let n = Wl(e, Rl);
	if (n != null) return n;
	throw Kl(t);
}
var Bl = ["m", "modifier"];
function Vl(e) {
	return Wl(e, Bl);
}
var Hl = ["k", "key"];
function Ul(e) {
	let t = Wl(e, Hl);
	if (t) return t;
	throw Kl(6);
}
function Wl(e, t, n) {
	for (let n = 0; n < t.length; n++) {
		let r = t[n];
		if (Rs(e, r) && e[r] != null) return e[r];
	}
	return n;
}
var Gl = [
	...Ol,
	...Al,
	...Ml,
	...Pl,
	...Hl,
	...Bl,
	...Rl,
	...Il
];
function Kl(e) {
	return /* @__PURE__ */ Error(`unhandled node type: ${e}`);
}
function ql(e) {
	return (t) => Jl(t, e);
}
function Jl(e, t) {
	let n = kl(t);
	if (n == null) throw Kl(0);
	if (Ll(n) === 1) {
		let t = jl(n);
		return e.plural(t.reduce((t, n) => [...t, Yl(e, n)], []));
	}
	return Yl(e, n);
}
function Yl(e, t) {
	let n = Nl(t);
	if (n != null) return e.type === "text" ? n : e.normalize([n]);
	{
		let n = Fl(t).reduce((t, n) => [...t, Xl(e, n)], []);
		return e.normalize(n);
	}
}
function Xl(e, t) {
	let n = Ll(t);
	switch (n) {
		case 3: return zl(t, n);
		case 9: return zl(t, n);
		case 4: {
			let r = t;
			if (Rs(r, "k") && r.k) return e.interpolate(e.named(r.k));
			if (Rs(r, "key") && r.key) return e.interpolate(e.named(r.key));
			throw Kl(n);
		}
		case 5: {
			let r = t;
			if (Rs(r, "i") && Os(r.i)) return e.interpolate(e.list(r.i));
			if (Rs(r, "index") && Os(r.index)) return e.interpolate(e.list(r.index));
			throw Kl(n);
		}
		case 6: {
			let n = t, r = Vl(n), i = Ul(n);
			return e.linked(Xl(e, i), r ? Xl(e, r) : void 0, e.type);
		}
		case 7: return zl(t, n);
		case 8: return zl(t, n);
		default: throw Error(`unhandled node on format message part: ${n}`);
	}
}
var Zl = (e) => e, Ql = Ps();
function $l(e, t = {}) {
	let n = !1, r = t.onError || Kc;
	return t.onError = (e) => {
		n = !0, r(e);
	}, {
		...Tl(e, t),
		detectError: n
	};
}
/* #__NO_SIDE_EFFECTS__ */
function eu(e, t) {
	if (!__INTLIFY_DROP_MESSAGE_COMPILER__ && Z(e)) {
		Us(t.warnHtmlMessage) && t.warnHtmlMessage;
		let n = (t.onCacheKey || Zl)(e), r = Ql[n];
		if (r) return r;
		let { ast: i, detectError: a } = $l(e, {
			...t,
			location: !1,
			jit: !0
		}), o = ql(i);
		return a ? o : Ql[n] = o;
	}
	{
		if (!Dl(e)) return (() => e);
		let t = e.cacheKey;
		return t ? Ql[t] || (Ql[t] = ql(e)) : ql(e);
	}
}
var tu = null;
function nu(e) {
	tu = e;
}
function ru(e, t, n) {
	tu && tu.emit("i18n:init", {
		timestamp: Date.now(),
		i18n: e,
		version: t,
		meta: n
	});
}
var iu = /* #__PURE__*/ au("function:translate");
function au(e) {
	return (t) => tu && tu.emit(e, t);
}
var ou = {
	INVALID_ARGUMENT: 17,
	INVALID_DATE_ARGUMENT: 18,
	INVALID_ISO_DATE_ARGUMENT: 19,
	NOT_SUPPORT_NON_STRING_MESSAGE: 20,
	NOT_SUPPORT_LOCALE_PROMISE_VALUE: 21,
	NOT_SUPPORT_LOCALE_ASYNC_FUNCTION: 22,
	NOT_SUPPORT_LOCALE_TYPE: 23
};
function su(e) {
	return Gc(e, null, void 0);
}
ou.INVALID_ARGUMENT, ou.INVALID_DATE_ARGUMENT, ou.INVALID_ISO_DATE_ARGUMENT, ou.NOT_SUPPORT_NON_STRING_MESSAGE, ou.NOT_SUPPORT_LOCALE_PROMISE_VALUE, ou.NOT_SUPPORT_LOCALE_ASYNC_FUNCTION, ou.NOT_SUPPORT_LOCALE_TYPE;
function cu(e, t) {
	return t.locale == null ? uu(e.locale) : uu(t.locale);
}
var lu;
function uu(e) {
	if (Z(e)) return e;
	if (Hs(e)) {
		if (e.resolvedOnce && lu != null) return lu;
		if (e.constructor.name === "Function") {
			let t = e();
			if (Gs(t)) throw su(ou.NOT_SUPPORT_LOCALE_PROMISE_VALUE);
			return lu = t;
		}
		throw su(ou.NOT_SUPPORT_LOCALE_ASYNC_FUNCTION);
	}
	throw su(ou.NOT_SUPPORT_LOCALE_TYPE);
}
function du(e, t, n) {
	return [.../* @__PURE__ */ new Set([n, ...Vs(t) ? t : Ws(t) ? Object.keys(t).filter((e) => e !== "default") : Z(t) ? [t] : [n]])];
}
function fu(e, t, n) {
	let r = Z(n) ? n : Ou, i = e, a;
	Ws(t) ? (i.__localeChainObjectCache ||= /* @__PURE__ */ new WeakMap(), a = i.__localeChainObjectCache.get(t), a || (a = /* @__PURE__ */ new Map(), i.__localeChainObjectCache.set(t, a))) : (i.__localeChainCache ||= /* @__PURE__ */ new Map(), a = i.__localeChainCache.get(t), a || (a = /* @__PURE__ */ new Map(), i.__localeChainCache.set(t, a)));
	let o = a.get(r);
	if (o) return o;
	let s = [], c = [n];
	for (; Vs(c);) c = pu(s, c, t);
	let l = Vs(t) || !Js(t) ? t : t.default ? t.default : null;
	return c = Z(l) ? [l] : l, Vs(c) && pu(s, c, !1), a.set(r, s), s;
}
function pu(e, t, n) {
	let r = !0;
	for (let i = 0; i < t.length && Us(r); i++) {
		let a = t[i];
		Z(a) && (r = mu(e, t[i], n));
	}
	return r;
}
function mu(e, t, n) {
	let r, i = t.split("-");
	do
		r = hu(e, i.join("-"), n), i.splice(-1, 1);
	while (i.length && r === !0);
	return r;
}
function hu(e, t, n) {
	let r = !1;
	if (!e.includes(t) && (r = !0, t)) {
		r = t[t.length - 1] !== "!";
		let i = t.replace(/!/g, "");
		e.push(i), (Vs(n) || Js(n)) && n[i] && (r = n[i]);
	}
	return r;
}
var gu = [];
gu[0] = {
	w: [0],
	i: [3, 0],
	"[": [4],
	o: [7]
}, gu[1] = {
	w: [1],
	".": [2],
	"[": [4],
	o: [7]
}, gu[2] = {
	w: [2],
	i: [3, 0],
	0: [3, 0]
}, gu[3] = {
	i: [3, 0],
	0: [3, 0],
	w: [1, 1],
	".": [2, 1],
	"[": [4, 1],
	o: [7, 1]
}, gu[4] = {
	"'": [5, 0],
	"\"": [6, 0],
	"[": [4, 2],
	"]": [1, 3],
	o: 8,
	l: [4, 0]
}, gu[5] = {
	"'": [4, 0],
	o: 8,
	l: [5, 0]
}, gu[6] = {
	"\"": [4, 0],
	o: 8,
	l: [6, 0]
};
var _u = /^\s?(?:true|false|-?[\d.]+|'[^']*'|"[^"]*")\s?$/;
function vu(e) {
	return _u.test(e);
}
function yu(e) {
	let t = e.charCodeAt(0);
	return t === e.charCodeAt(e.length - 1) && (t === 34 || t === 39) ? e.slice(1, -1) : e;
}
function bu(e) {
	if (e == null) return "o";
	switch (e.charCodeAt(0)) {
		case 91:
		case 93:
		case 46:
		case 34:
		case 39: return e;
		case 95:
		case 36:
		case 45: return "i";
		case 9:
		case 10:
		case 13:
		case 160:
		case 65279:
		case 8232:
		case 8233: return "w";
	}
	return "i";
}
function xu(e) {
	let t = e.trim();
	return e.charAt(0) === "0" && isNaN(parseInt(e)) ? !1 : vu(t) ? yu(t) : "*" + t;
}
function Su(e) {
	let t = [], n = -1, r = 0, i = 0, a, o, s, c, l, u, d, f = [];
	f[0] = () => {
		o === void 0 ? o = s : o += s;
	}, f[1] = () => {
		o !== void 0 && (t.push(o), o = void 0);
	}, f[2] = () => {
		f[0](), i++;
	}, f[3] = () => {
		if (i > 0) i--, r = 4, f[0]();
		else {
			if (i = 0, o === void 0 || (o = xu(o), o === !1)) return !1;
			f[1]();
		}
	};
	function p() {
		let t = e[n + 1];
		if (r === 5 && t === "'" || r === 6 && t === "\"") return n++, s = "\\" + t, f[0](), !0;
	}
	for (; r !== null;) if (n++, a = e[n], !(a === "\\" && p())) {
		if (c = bu(a), d = gu[r], l = d[c] || d.l || 8, l === 8 || (r = l[0], l[1] !== void 0 && (u = f[l[1]], u && (s = a, u() === !1)))) return;
		if (r === 7) return t;
	}
}
var Cu = /* @__PURE__ */ new Map();
function wu(e, t) {
	return Ws(e) ? zs(e, t) : null;
}
function Tu(e, t) {
	if (!Ws(e)) return null;
	let n = Cu.get(t);
	if (n || (n = Su(t), n && Cu.set(t, n)), !n) return null;
	let r = n.length, i = e, a = 0;
	for (; a < r;) {
		let e = n[a];
		if (Gl.includes(e) && Dl(i) || !Ws(i) || !Rs(i, e)) return null;
		let t = i[e];
		if (t === void 0 || Hs(i)) return null;
		i = t, a++;
	}
	return i;
}
var Eu = {
	NOT_FOUND_KEY: 1,
	FALLBACK_TO_TRANSLATE: 2,
	CANNOT_FORMAT_NUMBER: 3,
	FALLBACK_TO_NUMBER_FORMAT: 4,
	CANNOT_FORMAT_DATE: 5,
	FALLBACK_TO_DATE_FORMAT: 6,
	EXPERIMENTAL_CUSTOM_MESSAGE_COMPILER: 7,
	INVALID_NUMBER_ARGUMENT: 8,
	INVALID_DATE_ARGUMENT: 9
};
Eu.NOT_FOUND_KEY, Eu.FALLBACK_TO_TRANSLATE, Eu.CANNOT_FORMAT_NUMBER, Eu.FALLBACK_TO_NUMBER_FORMAT, Eu.CANNOT_FORMAT_DATE, Eu.FALLBACK_TO_DATE_FORMAT, Eu.EXPERIMENTAL_CUSTOM_MESSAGE_COMPILER, Eu.INVALID_NUMBER_ARGUMENT, Eu.INVALID_DATE_ARGUMENT;
var Du = "11.4.23", Ou = "en-US", ku = (e) => `${e.charAt(0).toLocaleUpperCase()}${e.substr(1)}`;
function Au() {
	return {
		upper: (e, t) => t === "text" && Z(e) ? e.toUpperCase() : t === "vnode" && Ws(e) && "__v_isVNode" in e ? e.children.toUpperCase() : e,
		lower: (e, t) => t === "text" && Z(e) ? e.toLowerCase() : t === "vnode" && Ws(e) && "__v_isVNode" in e ? e.children.toLowerCase() : e,
		capitalize: (e, t) => t === "text" && Z(e) ? ku(e) : t === "vnode" && Ws(e) && "__v_isVNode" in e ? ku(e.children) : e
	};
}
var ju;
function Mu(e) {
	ju = e;
}
var Nu;
function Pu(e) {
	Nu = e;
}
var Fu;
function Iu(e) {
	Fu = e;
}
var Lu = null, Ru = /* @__NO_SIDE_EFFECTS__ */ () => Lu, zu = null, Bu = (e) => {
	zu = e;
}, Vu = () => zu, Hu = 0;
function Uu(e = {}) {
	let t = Hs(e.onWarn) ? e.onWarn : Zs, n = Z(e.version) ? e.version : Du, r = Z(e.locale) || Hs(e.locale) ? e.locale : Ou, i = Hs(r) ? Ou : r, a = Vs(e.fallbackLocale) || Js(e.fallbackLocale) || Z(e.fallbackLocale) || e.fallbackLocale === !1 ? e.fallbackLocale : i, o = Js(e.messages) ? e.messages : Wu(i), s = Js(e.datetimeFormats) ? e.datetimeFormats : Wu(i), c = Js(e.numberFormats) ? e.numberFormats : Wu(i), l = Ms(Ps(), e.modifiers, Au()), u = e.pluralRules || Ps(), d = Hs(e.missing) ? e.missing : null, f = Us(e.missingWarn) || As(e.missingWarn) ? e.missingWarn : !0, p = Us(e.fallbackWarn) || As(e.fallbackWarn) ? e.fallbackWarn : !0, m = !!e.fallbackFormat, h = !!e.unresolving, g = Hs(e.postTranslation) ? e.postTranslation : null, _ = Js(e.processor) ? e.processor : null, v = !Us(e.warnHtmlMessage) || e.warnHtmlMessage, y = !!e.escapeParameter, b = Hs(e.messageCompiler) ? e.messageCompiler : ju, x = Hs(e.messageResolver) ? e.messageResolver : Nu || wu, S = Hs(e.localeFallbacker) ? e.localeFallbacker : Fu || du, C = Ws(e.fallbackContext) ? e.fallbackContext : void 0, w = e, T = Ws(w.__datetimeFormatters) ? w.__datetimeFormatters : /* @__PURE__ */ new Map(), E = Ws(w.__numberFormatters) ? w.__numberFormatters : /* @__PURE__ */ new Map(), D = Ws(w.__meta) ? w.__meta : {};
	Hu++;
	let O = {
		version: n,
		cid: Hu,
		locale: r,
		fallbackLocale: a,
		messages: o,
		modifiers: l,
		pluralRules: u,
		missing: d,
		missingWarn: f,
		fallbackWarn: p,
		fallbackFormat: m,
		unresolving: h,
		postTranslation: g,
		processor: _,
		warnHtmlMessage: v,
		escapeParameter: y,
		messageCompiler: b,
		messageResolver: x,
		localeFallbacker: S,
		fallbackContext: C,
		onWarn: t,
		__meta: D
	};
	return O.datetimeFormats = s, O.numberFormats = c, O.__datetimeFormatters = T, O.__numberFormatters = E, __INTLIFY_PROD_DEVTOOLS__ && ru(O, n, D), O;
}
var Wu = (e) => ({ [e]: Ps() });
function Gu(e, t, n, r, i) {
	let { missing: a, onWarn: o } = e;
	if (a !== null) {
		let r = a(e, n, t, i);
		return Z(r) ? r : t;
	}
	return t;
}
function Ku(e, t) {
	let n = e;
	Ws(t) ? n.__localeChainObjectCache?.delete(t) : n.__localeChainCache?.delete(t);
}
function qu(e, t, n) {
	Ku(e, n), e.fallbackContext && Ku(e.fallbackContext, n), e.localeFallbacker(e, n, t);
}
function Ju(e, t) {
	return e !== t && e.split("-")[0] === t.split("-")[0];
}
function Yu(e, t) {
	let n = t.indexOf(e);
	if (n === -1) return !1;
	for (let r = n + 1; r < t.length; r++) if (Ju(e, t[r])) return !0;
	return !1;
}
function Xu(e, t, n, r, i, a, o) {
	let { fallbackLocale: s, localeFallbacker: c, onWarn: l } = e, u = c(e, s, n);
	for (let n = 0; n < u.length; n++) {
		let a = u[n];
		if (Js(zs(zs(r, a) || {}, t)) && Z(a)) return a;
		Gu(e, t, a, i, o);
	}
	return null;
}
function Zu(e, t, n) {
	let r = `${e}__${t}`;
	return Js(n) && !js(n) && (r = `${r}__${JSON.stringify(n)}`), r;
}
function Qu(e, t, n) {
	for (let r in n) {
		let n = `${t}__${r}`;
		for (let t of e.keys()) (t === n || t.startsWith(`${n}__`)) && e.delete(t);
	}
}
function $u(e, t, n, r) {
	let [, i, a, o] = e, s = n;
	return Z(i) ? t.key = i : Js(i) && Object.keys(i).forEach((e) => {
		r.includes(e) ? s[e] = i[e] : t[e] = i[e];
	}), Z(a) ? t.locale = a : Js(a) && (s = a), Js(o) && (s = o), s;
}
var ed = typeof Intl < "u";
ed && Intl.DateTimeFormat, ed && Intl.NumberFormat;
function td(e, ...t) {
	let { datetimeFormats: n, unresolving: r, onWarn: i } = e, { __datetimeFormatters: a } = e;
	if (!Z(t[0]) && !ks(t[0]) && !Os(t[0])) return "";
	let [o, s, c, l] = rd(...t), u = Us(c.missingWarn) ? c.missingWarn : e.missingWarn, d = Us(c.fallbackWarn) ? c.fallbackWarn : e.fallbackWarn, f = !!c.part, p = cu(e, c);
	if (!Z(o) || o === "") {
		let e = new Intl.DateTimeFormat(p.replace(/!/g, ""), l);
		return f ? e.formatToParts(s) : e.format(s);
	}
	let m = Xu(e, o, p, n, u, d, "datetime format");
	if (!Z(m)) return r ? -1 : o;
	let h = n[m][o], g = Zu(m, o, l), _ = a.get(g);
	return _ || (_ = new Intl.DateTimeFormat(m, Ms({}, h, l)), a.set(g, _)), f ? _.formatToParts(s) : _.format(s);
}
var nd = [
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
function rd(...e) {
	let [t] = e, n = Ps(), r = Ps(), i;
	if (Z(t)) {
		let e = t.match(/(\d{4}-\d{2}-\d{2})(T|\s)?(.*)/);
		if (!e) throw su(ou.INVALID_ISO_DATE_ARGUMENT);
		let n = e[3] ? e[3].trim().startsWith("T") ? `${e[1].trim()}${e[3].trim()}` : `${e[1].trim()}T${e[3].trim()}` : e[1].trim();
		i = new Date(n);
		try {
			i.toISOString();
		} catch {
			throw su(ou.INVALID_ISO_DATE_ARGUMENT);
		}
	} else if (ks(t)) {
		if (isNaN(t.getTime())) throw su(ou.INVALID_DATE_ARGUMENT);
		i = t;
	} else if (Os(t)) i = t;
	else throw su(ou.INVALID_ARGUMENT);
	let a = $u(e, n, r, nd);
	return [
		n.key || "",
		i,
		n,
		a
	];
}
function id(e, t, n) {
	Qu(e.__datetimeFormatters, t, n);
}
function ad(e, ...t) {
	let { numberFormats: n, unresolving: r, onWarn: i } = e, { __numberFormatters: a } = e;
	if (!Os(t[0])) return "";
	let [o, s, c, l] = sd(...t), u = Us(c.missingWarn) ? c.missingWarn : e.missingWarn, d = Us(c.fallbackWarn) ? c.fallbackWarn : e.fallbackWarn, f = !!c.part, p = cu(e, c);
	if (!Z(o) || o === "") {
		let e = new Intl.NumberFormat(p.replace(/!/g, ""), l);
		return f ? e.formatToParts(s) : e.format(s);
	}
	let m = Xu(e, o, p, n, u, d, "number format");
	if (!Z(m)) return r ? -1 : o;
	let h = n[m][o], g = Zu(m, o, l), _ = a.get(g);
	return _ || (_ = new Intl.NumberFormat(m, Ms({}, h, l)), a.set(g, _)), f ? _.formatToParts(s) : _.format(s);
}
var od = [
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
function sd(...e) {
	let [t] = e, n = Ps(), r = Ps();
	if (!Os(t)) throw su(ou.INVALID_ARGUMENT);
	let i = t, a = $u(e, n, r, od);
	return [
		n.key || "",
		i,
		n,
		a
	];
}
function cd(e, t, n) {
	Qu(e.__numberFormatters, t, n);
}
var ld = (e) => e, ud = (e) => "", dd = "text", fd = (e) => e.length === 0 ? "" : Xs(e), pd = Ys;
function md(e, t) {
	return e = Math.abs(e), t === 2 ? e === 1 ? 0 : 1 : Math.min(e, 2);
}
function hd(e) {
	let t = Os(e.pluralIndex) ? e.pluralIndex : -1;
	return Os(e.named?.count) ? e.named.count : Os(e.named?.n) ? e.named.n : t;
}
function gd(e = {}) {
	let t = e.locale, n = hd(e), r = Z(t) && e.pluralRules && Hs(zs(e.pluralRules, t)) ? e.pluralRules[t] : md, i = r === md ? void 0 : md, a = (e) => e[r(n, e.length, i)], o = e.list || [], s = (e) => o[e], c = e.named || Ps(), l = Os(e.pluralIndex), u = (t) => {
		let n = Bs(t) ? zs(c, t) : c[t];
		return l && !n && (t === "count" || t === "n") ? e.pluralIndex : n;
	};
	function d(t, n) {
		return (Hs(e.messages) ? e.messages(t, !!n) : Ws(e.messages) ? e.messages[t] : !1) || (e.parent ? e.parent.message(t) : ud);
	}
	let f = (t) => e.modifiers ? zs(e.modifiers, t) : ld, p = Hs(e.processor?.normalize) ? e.processor.normalize : fd, m = Hs(e.processor?.interpolate) ? e.processor.interpolate : pd, h = {
		list: s,
		named: u,
		plural: a,
		linked: (e, ...t) => {
			let [n, r] = t, i = "text", a = "";
			t.length === 1 ? Ws(n) ? (a = n.modifier || a, i = n.type || i) : Z(n) && (a = n || a) : t.length === 2 && (Z(n) && (a = n || a), Z(r) && (i = r || i));
			let o = d(e, !0)(h), s = o === "" || o === void 0 ? e : o, c = i === "vnode" && Vs(s) && a ? s[0] : s;
			if (!a) return c;
			let l = f(a);
			return Hs(l) ? l(c, i) : c;
		},
		message: d,
		type: Z(e.processor?.type) ? e.processor.type : dd,
		interpolate: m,
		normalize: p,
		values: Ms(Ps(), o, c, l ? {
			count: u("count"),
			n: u("n")
		} : {})
	};
	return h;
}
var _d = () => "", vd = (e) => Hs(e), yd = (e) => Z(e) || Dl(e) || vd(e);
function bd(e, ...t) {
	let { fallbackFormat: n, postTranslation: r, unresolving: i, messageCompiler: a, fallbackLocale: o, messages: s } = e, [c, l] = Dd(...t), u = Us(l.missingWarn) ? l.missingWarn : e.missingWarn, d = Us(l.fallbackWarn) ? l.fallbackWarn : e.fallbackWarn, f = Us(l.escapeParameter) ? l.escapeParameter : e.escapeParameter, p = !!l.resolvedMessage, m = Z(l.default) || Us(l.default) ? Us(l.default) ? a ? c : () => c : l.default : n ? a ? c : () => c : null, h = n || m != null && (Z(m) || Hs(m)), g = cu(e, l);
	f && xd(l);
	let [_, v, y] = p ? [
		c,
		g,
		zs(s, g) || Ps()
	] : wd(e, c, g, o, d, u), b = _, x = c;
	if (!p && !yd(b) && h && (b = m, x = b), !p && (!yd(b) || !Z(v))) return i ? -1 : c;
	let S = !1, C = vd(b) ? b : Td(e, c, v, b, x, () => {
		S = !0;
	});
	if (S) return b;
	let w = Ed(e, C, gd(kd(e, v, y, l, f))), T = r ? r(w, c) : w;
	if (f && Z(T) && (T = zc(T)), __INTLIFY_PROD_DEVTOOLS__) {
		let t = {
			timestamp: Date.now(),
			key: Z(c) ? c : vd(b) ? b.key : "",
			locale: v || (vd(b) ? b.locale : ""),
			format: Z(b) ? b : vd(b) ? b.source : "",
			message: T
		};
		t.meta = Ms({}, e.__meta, /* @__PURE__ */ Ru() || {}), iu(t);
	}
	return T;
}
function xd(e) {
	if (Vs(e.list) && (e.list = e.list.map((e) => Z(e) ? Qs(e) : e)), Ws(e.named)) {
		let t = e.named, n = Ps();
		for (let e of Object.keys(t)) {
			let r = t[e];
			n[e] = Z(r) ? Qs(r) : r;
		}
		e.named = n;
	}
}
function Sd(e) {
	return Z(e) ? e : Qs(Ys(e));
}
function Cd(e, t) {
	return !t || Hs(e?.interpolate) ? e : Ms({}, e, { interpolate: Sd });
}
function wd(e, t, n, r, i, a) {
	let { messages: o, onWarn: s, messageResolver: c, localeFallbacker: l } = e, u = l(e, r, n), d = Ps(), f, p = null;
	for (let n = 0; n < u.length && (f = u[n], d = zs(o, f) || Ps(), (p = c(d, t)) === null && (p = zs(d, t)), !yd(p)); n++) if (!Yu(f, u)) {
		let n = Gu(e, t, f, a, "translate");
		n !== t && (p = n);
	}
	return [
		p,
		f,
		d
	];
}
function Td(e, t, n, r, i, a) {
	let { messageCompiler: o, warnHtmlMessage: s } = e;
	if (vd(r)) {
		let e = r;
		return e.locale = e.locale || n, e.key = e.key || t, e;
	}
	if (o == null) {
		let e = (() => r);
		return e.locale = n, e.key = t, e;
	}
	let c = o(r, Od(e, n, i, r, s, a));
	return c.locale = n, c.key = t, c.source = r, c;
}
function Ed(e, t, n) {
	return t(n);
}
function Dd(...e) {
	let [t, n, r] = e, i = Ps();
	if (!Z(t) && !Os(t) && !vd(t) && !Dl(t)) throw su(ou.INVALID_ARGUMENT);
	let a = Os(t) ? String(t) : (vd(t), t);
	return Os(n) ? i.plural = n : Z(n) ? i.default = n : Js(n) && !js(n) ? i.named = n : Vs(n) && (i.list = n), Os(r) ? i.plural = r : Z(r) ? i.default = r : Js(r) && Ms(i, r), [a, i];
}
function Od(e, t, n, r, i, a) {
	return {
		locale: t,
		key: n,
		warnHtmlMessage: i,
		onError: (e) => {
			throw a && a(e), e;
		},
		onCacheKey: (e) => Es(t, n, e)
	};
}
function kd(e, t, n, r, i) {
	let { modifiers: a, pluralRules: o, messageResolver: s, fallbackLocale: c, fallbackWarn: l, missingWarn: u, fallbackContext: d } = e, f = {
		locale: t,
		modifiers: a,
		pluralRules: o,
		messages: (r, i) => {
			let a = s(n, r);
			if (a == null && (d || i)) {
				let [n, , i] = wd(d || e, r, t, c, l, u);
				a = n ?? s(i, r);
			}
			if (Z(a) || Dl(a)) {
				let n = !1, i = Td(e, r, t, a, r, () => {
					n = !0;
				});
				return n ? _d : i;
			}
			return vd(a) ? a : _d;
		}
	}, p = Cd(e.processor, i);
	return p && (f.processor = p), r.list && (f.list = r.list), r.named && (f.named = r.named), Os(r.plural) && (f.pluralIndex = r.plural), f;
}
El();
// node_modules/.pnpm/vue-i18n@11.4.23_vue@3.5.42_typescript@6.0.3_/node_modules/vue-i18n/dist/vue-i18n.mjs
var Ad = "11.4.23";
function jd() {
	typeof __VUE_I18N_FULL_INSTALL__ != "boolean" && (Is().__VUE_I18N_FULL_INSTALL__ = !0), typeof __VUE_I18N_LEGACY_API__ != "boolean" && (Is().__VUE_I18N_LEGACY_API__ = !0), typeof __INTLIFY_DROP_MESSAGE_COMPILER__ != "boolean" && (Is().__INTLIFY_DROP_MESSAGE_COMPILER__ = !1), typeof __INTLIFY_PROD_DEVTOOLS__ != "boolean" && (Is().__INTLIFY_PROD_DEVTOOLS__ = !1);
}
var Md = {
	UNEXPECTED_RETURN_TYPE: 24,
	INVALID_ARGUMENT: 25,
	MUST_BE_CALL_SETUP_TOP: 26,
	NOT_INSTALLED: 27,
	REQUIRED_VALUE: 28,
	INVALID_VALUE: 29,
	CANNOT_SETUP_VUE_DEVTOOLS_PLUGIN: 30,
	NOT_INSTALLED_WITH_PROVIDE: 31,
	UNEXPECTED_ERROR: 32,
	NOT_COMPATIBLE_LEGACY_VUE_I18N: 33,
	NOT_AVAILABLE_COMPOSITION_IN_LEGACY: 34
};
function Nd(e, ...t) {
	return Gc(e, null, void 0);
}
Md.UNEXPECTED_RETURN_TYPE, Md.INVALID_ARGUMENT, Md.MUST_BE_CALL_SETUP_TOP, Md.NOT_INSTALLED, Md.UNEXPECTED_ERROR, Md.REQUIRED_VALUE, Md.INVALID_VALUE, Md.CANNOT_SETUP_VUE_DEVTOOLS_PLUGIN, Md.NOT_INSTALLED_WITH_PROVIDE, Md.NOT_COMPATIBLE_LEGACY_VUE_I18N, Md.NOT_AVAILABLE_COMPOSITION_IN_LEGACY;
var Pd = /* #__PURE__*/ Ts("__translateVNode"), Fd = /* #__PURE__*/ Ts("__datetimeParts"), Id = /* #__PURE__*/ Ts("__numberParts"), Ld = Ts("__setPluralRules");
Ts("__intlifyMeta");
var Rd = /* #__PURE__*/ Ts("__injectWithOption"), zd = /* #__PURE__*/ Ts("__dispose"), Bd = {
	FALLBACK_TO_ROOT: 10,
	NOT_FOUND_PARENT_SCOPE: 11,
	IGNORE_OBJ_FLATTEN: 12,
	DEPRECATE_LEGACY_MODE: 13,
	DEPRECATE_TRANSLATE_CUSTOME_DIRECTIVE: 14,
	DUPLICATE_USE_I18N_CALLING: 15,
	IGNORE_UNSAFE_LOCALE: 16
};
Bd.FALLBACK_TO_ROOT, Bd.NOT_FOUND_PARENT_SCOPE, Bd.IGNORE_OBJ_FLATTEN, Bd.DEPRECATE_LEGACY_MODE, Bd.DEPRECATE_TRANSLATE_CUSTOME_DIRECTIVE, Bd.DUPLICATE_USE_I18N_CALLING, Bd.IGNORE_UNSAFE_LOCALE;
var Vd = null;
{
	let e = Is().__VUE_INSTANCE_SETTERS__;
	Vs(e) && e.push((e) => {
		Vd = e;
	});
}
function Hd(e) {
	return !!Bs(e);
}
function Ud(e) {
	if (!Ws(e) || Dl(e)) return e;
	for (let t in e) if (Rs(e, t)) {
		if (!t.includes(".")) Ws(e[t]) && Ud(e[t]);
		else {
			let n = t.split("."), r = n.length - 1, i = e, a = !1;
			for (let e = 0; e < r; e++) {
				if (n[e] === "__proto__") throw Error(`unsafe key: ${n[e]}`);
				if (n[e] in i || (i[n[e]] = Ps()), !Ws(i[n[e]]) || Dl(i[n[e]]) && (Gl.includes(n[e + 1]) || n[e + 1] === "cacheKey")) {
					a = !0;
					break;
				}
				i = i[n[e]];
			}
			a || (i[n[r]] = e[t], delete e[t]);
			let o = i[n[r]];
			Ws(o) && Ud(o);
		}
	}
	return e;
}
function Wd(e, t) {
	let { messages: n, __i18n: r, messageResolver: i, flatJson: a } = t, o = Js(n) ? n : Vs(r) ? Ps() : { [e]: Ps() };
	if (Vs(r) && r.forEach((e) => {
		if ("locale" in e && "resource" in e) {
			let { locale: t, resource: n } = e;
			if (t) {
				if (Hd(t)) return;
				o[t] = zs(o, t) || Ps(), Vc(n, o[t]);
			} else Vc(n, o);
		} else Z(e) && Vc(JSON.parse(e), o);
	}), i == null && a) for (let e in o) Rs(o, e) && Ud(o[e]);
	return o;
}
function Gd(e) {
	return e.type;
}
function Kd(e, t, n) {
	let r = Ws(t.messages) ? t.messages : Ps();
	"__i18nGlobal" in n && (r = Wd(e.locale.value, {
		messages: r,
		__i18n: n.__i18nGlobal
	}));
	let i = Object.keys(r);
	if (i.length && i.forEach((t) => {
		e.mergeLocaleMessage(t, r[t]);
	}), Ws(t.datetimeFormats)) {
		let n = Object.keys(t.datetimeFormats);
		n.length && n.forEach((n) => {
			e.mergeDateTimeFormat(n, t.datetimeFormats[n]);
		});
	}
	if (Ws(t.numberFormats)) {
		let n = Object.keys(t.numberFormats);
		n.length && n.forEach((n) => {
			e.mergeNumberFormat(n, t.numberFormats[n]);
		});
	}
}
function qd(e) {
	return q(ba, null, e, 0);
}
function Jd() {
	return Vd ?? Ga();
}
function Yd(e) {
	return e.scope;
}
function Xd(e, t) {
	let n = Yd(e);
	n.active ? n.run(() => ke(t)) : t();
}
var Zd = () => [], Qd = () => !1, $d = 0;
function ef(e) {
	return ((t, n, r, i) => e(n, r, Jd() || void 0, i));
}
function tf(e = {}) {
	let { __root: t, __injectWithOption: n } = e, r = t === void 0, i = e.flatJson, a = ws ? P : F, o = !Us(e.inheritLocale) || e.inheritLocale, s = a(t && o ? t.locale.value : Z(e.locale) ? e.locale : Ou), c = a(t && o ? t.fallbackLocale.value : Z(e.fallbackLocale) || Vs(e.fallbackLocale) || Js(e.fallbackLocale) || e.fallbackLocale === !1 ? e.fallbackLocale : s.value), l = a(Wd(s.value, e)), u = a(Js(e.datetimeFormats) ? e.datetimeFormats : { [s.value]: {} }), d = a(Js(e.numberFormats) ? e.numberFormats : { [s.value]: {} }), f = t ? t.missingWarn : Us(e.missingWarn) || As(e.missingWarn) ? e.missingWarn : !0, p = t ? t.fallbackWarn : Us(e.fallbackWarn) || As(e.fallbackWarn) ? e.fallbackWarn : !0, m = t ? t.fallbackRoot : !Us(e.fallbackRoot) || e.fallbackRoot, h = !!e.fallbackFormat, g = Hs(e.missing) ? e.missing : null, _ = Hs(e.missing) ? ef(e.missing) : null, v = Hs(e.postTranslation) ? e.postTranslation : null, y = t ? t.warnHtmlMessage : !Us(e.warnHtmlMessage) || e.warnHtmlMessage, b = !!e.escapeParameter, x = t ? t.modifiers : Js(e.modifiers) ? e.modifiers : {}, S = e.pluralRules || t && t.pluralRules, C;
	C = (() => {
		r && Bu(null);
		let t = {
			version: Ad,
			locale: s.value,
			fallbackLocale: c.value,
			messages: l.value,
			modifiers: x,
			pluralRules: S,
			missing: _ === null ? void 0 : _,
			missingWarn: f,
			fallbackWarn: p,
			fallbackFormat: h,
			unresolving: !0,
			postTranslation: v === null ? void 0 : v,
			warnHtmlMessage: y,
			escapeParameter: b,
			messageResolver: e.messageResolver,
			messageCompiler: e.messageCompiler,
			__meta: { framework: "vue" }
		};
		t.datetimeFormats = u.value, t.numberFormats = d.value;
		let n = Uu(t);
		return r && Bu(n), n;
	})(), qu(C, s.value, c.value);
	function w() {
		return [
			s.value,
			c.value,
			l.value,
			u.value,
			d.value
		];
	}
	let T = X({
		get: () => s.value,
		set: (e) => {
			C.locale = e, s.value = e;
		}
	});
	function E(e) {
		r || (C.fallbackContext = Vu());
		try {
			return e();
		} finally {
			r || (C.fallbackContext = void 0);
		}
	}
	function D(e) {
		E(() => qu(C, s.value, e));
	}
	let O = X({
		get: () => c.value,
		set: (e) => {
			c.value = e, C.fallbackLocale = c.value, D(c.value);
		}
	}), k = X(() => l.value), A = /* #__PURE__*/ X(() => u.value), j = /* #__PURE__*/ X(() => d.value);
	function ee() {
		return Hs(v) ? v : null;
	}
	function te(e) {
		v = e, C.postTranslation = e;
	}
	function M() {
		return g;
	}
	function ne(e) {
		e !== null && (_ = ef(e)), g = e, C.missing = _;
	}
	let re = (e, n, r, i, a, o) => {
		w();
		let s;
		try {
			__INTLIFY_PROD_DEVTOOLS__, s = E(() => e(C));
		} finally {
			__INTLIFY_PROD_DEVTOOLS__;
		}
		if (r !== "translate exists" && Os(s) && s === -1 || r === "translate exists" && !s) {
			let [e, r] = n();
			return t && m ? i(t) : a(e);
		}
		if (o(s)) return s;
		/* istanbul ignore next */
		throw Nd(Md.UNEXPECTED_RETURN_TYPE);
	};
	function ie(...e) {
		return re((t) => Reflect.apply(bd, null, [t, ...e]), () => Dd(...e), "translate", (t) => Reflect.apply(t.t, t, [...e]), (e) => e, (e) => Z(e));
	}
	function ae(...e) {
		let [t, n, r] = e;
		if (r && !Ws(r)) throw Nd(Md.INVALID_ARGUMENT);
		return ie(t, n, Ms({ resolvedMessage: !0 }, r || {}));
	}
	function oe(...e) {
		return re((t) => Reflect.apply(td, null, [t, ...e]), () => rd(...e), "datetime format", (t) => Reflect.apply(t.d, t, [...e]), () => "", (e) => Z(e) || Vs(e));
	}
	function se(...e) {
		return re((t) => Reflect.apply(ad, null, [t, ...e]), () => sd(...e), "number format", (t) => Reflect.apply(t.n, t, [...e]), () => "", (e) => Z(e) || Vs(e));
	}
	function ce(e) {
		return e.map((e) => Z(e) || Os(e) || Us(e) ? qd(String(e)) : e);
	}
	let le = {
		normalize: ce,
		interpolate: (e) => e,
		type: "vnode"
	};
	function ue(...e) {
		return re((t) => {
			let n, r = t;
			try {
				r.processor = le, n = Reflect.apply(bd, null, [r, ...e]);
			} finally {
				r.processor = null;
			}
			return n;
		}, () => Dd(...e), "translate", (t) => t[Pd](...e), (e) => [qd(e)], (e) => Vs(e));
	}
	function de(...e) {
		return re((t) => Reflect.apply(ad, null, [t, ...e]), () => sd(...e), "number format", (t) => t[Id](...e), Zd, (e) => Z(e) || Vs(e));
	}
	function fe(...e) {
		return re((t) => Reflect.apply(td, null, [t, ...e]), () => rd(...e), "datetime format", (t) => t[Fd](...e), Zd, (e) => Z(e) || Vs(e));
	}
	function pe(e) {
		S = e, C.pluralRules = S;
	}
	function me(e, t) {
		let n = ve(e), r = C.messageResolver(n, t);
		return r === null ? zs(n, t) : r;
	}
	function he(e, t) {
		return re(() => {
			if (!e) return !1;
			let n = Z(t) ? t : s.value, r = Z(t) ? [n] : C.localeFallbacker(C, c.value, n);
			for (let t = 0; t < r.length; t++) if (yd(me(r[t], e))) return !0;
			return !1;
		}, () => [e], "translate exists", (n) => Reflect.apply(n.te, n, [e, t]), Qd, (e) => Us(e));
	}
	function ge(e) {
		let t = null, n = C.localeFallbacker(C, c.value, s.value);
		for (let r = 0; r < n.length; r++) {
			let i = me(n[r], e);
			if (i != null) {
				t = i;
				break;
			}
		}
		return t;
	}
	function _e(e) {
		return ge(e) ?? (t && t.tm(e) || {});
	}
	function ve(e) {
		return zs(l.value, e) || {};
	}
	function ye(e, t) {
		Hd(e) || (i && Ud(t), l.value[e] = t, C.messages = l.value);
	}
	function be(e, t) {
		Hd(e) || (l.value[e] = zs(l.value, e) || {}, i && Ud(t), Vc(t, l.value[e]), C.messages = l.value);
	}
	function xe(e) {
		return zs(u.value, e) || {};
	}
	function Se(e, t) {
		Hd(e) || (u.value[e] = t, C.datetimeFormats = u.value, id(C, e, t));
	}
	function N(e, t) {
		Hd(e) || (u.value[e] = Ms(zs(u.value, e) || {}, t), C.datetimeFormats = u.value, id(C, e, t));
	}
	function Ce(e) {
		return zs(d.value, e) || {};
	}
	function we(e, t) {
		Hd(e) || (d.value[e] = t, C.numberFormats = d.value, cd(C, e, t));
	}
	function Te(e, t) {
		Hd(e) || (d.value[e] = Ms(zs(d.value, e) || {}, t), C.numberFormats = d.value, cd(C, e, t));
	}
	$d++, R(c, () => D(c.value), {
		deep: !0,
		flush: "sync"
	}), t && ws && (R(t.locale, (e) => {
		o && (s.value = e, C.locale = e, qu(C, s.value, c.value));
	}), R(t.fallbackLocale, (e) => {
		o && (c.value = e, C.fallbackLocale = c.value, qu(C, s.value, c.value));
	}));
	let Ee = {
		id: $d,
		locale: T,
		fallbackLocale: O,
		get inheritLocale() {
			return o;
		},
		set inheritLocale(e) {
			o = e, e && t && (T.value = t.locale.value, O.value = t.fallbackLocale.value);
		},
		get availableLocales() {
			return Object.keys(l.value).sort();
		},
		messages: k,
		get modifiers() {
			return x;
		},
		get pluralRules() {
			return S || {};
		},
		get isGlobal() {
			return r;
		},
		get missingWarn() {
			return f;
		},
		set missingWarn(e) {
			f = e, C.missingWarn = f;
		},
		get fallbackWarn() {
			return p;
		},
		set fallbackWarn(e) {
			p = e, C.fallbackWarn = p;
		},
		get fallbackRoot() {
			return m;
		},
		set fallbackRoot(e) {
			m = e;
		},
		get fallbackFormat() {
			return h;
		},
		set fallbackFormat(e) {
			h = e, C.fallbackFormat = h;
		},
		get warnHtmlMessage() {
			return y;
		},
		set warnHtmlMessage(e) {
			y = e, C.warnHtmlMessage = e;
		},
		get escapeParameter() {
			return b;
		},
		set escapeParameter(e) {
			b = e, C.escapeParameter = e;
		},
		t: ie,
		getLocaleMessage: ve,
		setLocaleMessage: ye,
		mergeLocaleMessage: be,
		getPostTranslationHandler: ee,
		setPostTranslationHandler: te,
		getMissingHandler: M,
		setMissingHandler: ne,
		[Ld]: pe
	};
	return Ee.datetimeFormats = A, Ee.numberFormats = j, Ee.rt = ae, Ee.te = he, Ee.tm = _e, Ee.d = oe, Ee.n = se, Ee.getDateTimeFormat = xe, Ee.setDateTimeFormat = Se, Ee.mergeDateTimeFormat = N, Ee.getNumberFormat = Ce, Ee.setNumberFormat = we, Ee.mergeNumberFormat = Te, Ee[Rd] = n, Ee[Pd] = ue, Ee[Fd] = fe, Ee[Id] = de, Ee;
}
var nf = /* @__PURE__ */ new WeakMap();
function rf(e) {
	if (!As(e)) return !e;
	let t = nf.get(e);
	return t || (t = RegExp(`^(?![\\s\\S]*(?:${e.source}))`, e.flags.replace(/[gy]/g, "")), nf.set(e, t), nf.set(t, e)), t;
}
function af(e) {
	let t = Z(e.locale) ? e.locale : Ou, n = Z(e.fallbackLocale) || Vs(e.fallbackLocale) || Js(e.fallbackLocale) || e.fallbackLocale === !1 ? e.fallbackLocale : t, r = Hs(e.missing) ? e.missing : void 0, i = Us(e.silentTranslationWarn) || As(e.silentTranslationWarn) ? rf(e.silentTranslationWarn) : !0, a = Us(e.silentFallbackWarn) || As(e.silentFallbackWarn) ? rf(e.silentFallbackWarn) : !0, o = !Us(e.fallbackRoot) || e.fallbackRoot, s = !!e.formatFallbackMessages, c = Js(e.modifiers) ? e.modifiers : {}, l = e.pluralizationRules, u = Hs(e.postTranslation) ? e.postTranslation : void 0, d = !Z(e.warnHtmlInMessage) || e.warnHtmlInMessage !== "off", f = !!e.escapeParameterHtml, p = !Us(e.sync) || e.sync, m = e.messages;
	if (Js(e.sharedMessages)) {
		let t = e.sharedMessages;
		m = Object.keys(t).reduce((e, n) => (Hd(n) || Ms(zs(e, n) || (e[n] = {}), t[n]), e), m || {});
	}
	let { __i18n: h, __root: g, __injectWithOption: _ } = e, v = e.datetimeFormats, y = e.numberFormats, b = e.flatJson;
	return {
		locale: t,
		fallbackLocale: n,
		messages: m,
		flatJson: b,
		datetimeFormats: v,
		numberFormats: y,
		missing: r,
		missingWarn: i,
		fallbackWarn: a,
		fallbackRoot: o,
		fallbackFormat: s,
		modifiers: c,
		pluralRules: l,
		postTranslation: u,
		warnHtmlMessage: d,
		escapeParameter: f,
		messageResolver: e.messageResolver,
		inheritLocale: p,
		__i18n: h,
		__root: g,
		__injectWithOption: _
	};
}
function of(e = {}) {
	let t = tf(af(e)), { __extender: n } = e, r = {
		id: t.id,
		get locale() {
			return t.locale.value;
		},
		set locale(e) {
			t.locale.value = e;
		},
		get fallbackLocale() {
			return t.fallbackLocale.value;
		},
		set fallbackLocale(e) {
			t.fallbackLocale.value = e;
		},
		get messages() {
			return t.messages.value;
		},
		get datetimeFormats() {
			return t.datetimeFormats.value;
		},
		get numberFormats() {
			return t.numberFormats.value;
		},
		get availableLocales() {
			return t.availableLocales;
		},
		get missing() {
			return t.getMissingHandler();
		},
		set missing(e) {
			t.setMissingHandler(e);
		},
		get silentTranslationWarn() {
			return rf(t.missingWarn);
		},
		set silentTranslationWarn(e) {
			t.missingWarn = rf(e);
		},
		get silentFallbackWarn() {
			return rf(t.fallbackWarn);
		},
		set silentFallbackWarn(e) {
			t.fallbackWarn = rf(e);
		},
		get modifiers() {
			return t.modifiers;
		},
		get formatFallbackMessages() {
			return t.fallbackFormat;
		},
		set formatFallbackMessages(e) {
			t.fallbackFormat = e;
		},
		get postTranslation() {
			return t.getPostTranslationHandler();
		},
		set postTranslation(e) {
			t.setPostTranslationHandler(e);
		},
		get sync() {
			return t.inheritLocale;
		},
		set sync(e) {
			t.inheritLocale = e;
		},
		get warnHtmlInMessage() {
			return t.warnHtmlMessage ? "warn" : "off";
		},
		set warnHtmlInMessage(e) {
			t.warnHtmlMessage = e !== "off";
		},
		get escapeParameterHtml() {
			return t.escapeParameter;
		},
		set escapeParameterHtml(e) {
			t.escapeParameter = e;
		},
		get pluralizationRules() {
			return t.pluralRules || {};
		},
		__composer: t,
		t(...e) {
			return Reflect.apply(t.t, t, [...e]);
		},
		rt(...e) {
			return Reflect.apply(t.rt, t, [...e]);
		},
		te(e, n) {
			return t.te(e, n);
		},
		tm(e) {
			return t.tm(e);
		},
		getLocaleMessage(e) {
			return t.getLocaleMessage(e);
		},
		setLocaleMessage(e, n) {
			t.setLocaleMessage(e, n);
		},
		mergeLocaleMessage(e, n) {
			t.mergeLocaleMessage(e, n);
		},
		d(...e) {
			return Reflect.apply(t.d, t, [...e]);
		},
		getDateTimeFormat(e) {
			return t.getDateTimeFormat(e);
		},
		setDateTimeFormat(e, n) {
			t.setDateTimeFormat(e, n);
		},
		mergeDateTimeFormat(e, n) {
			t.mergeDateTimeFormat(e, n);
		},
		n(...e) {
			return Reflect.apply(t.n, t, [...e]);
		},
		getNumberFormat(e) {
			return t.getNumberFormat(e);
		},
		setNumberFormat(e, n) {
			t.setNumberFormat(e, n);
		},
		mergeNumberFormat(e, n) {
			t.mergeNumberFormat(e, n);
		}
	};
	return r.__extender = n, r;
}
function sf(e, t, n) {
	return {
		beforeCreate() {
			let r = Jd();
			/* istanbul ignore if */
			if (!r) throw Nd(Md.UNEXPECTED_ERROR);
			let i = this.$options;
			if (i.i18n) {
				let r = Ms({}, i.i18n);
				if (i.__i18n && (r.__i18n = i.__i18n), r.__root = t, this === this.$root) this.$i18n = cf(e, r);
				else {
					r.__injectWithOption = !0, r.__extender = n.__vueI18nExtend, this.$i18n = of(r);
					let e = this.$i18n;
					e.__extender && (e.__disposer = e.__extender(this.$i18n));
				}
			} else if (i.__i18n) {
				if (this === this.$root) this.$i18n = cf(e, i);
				else {
					this.$i18n = of({
						__i18n: i.__i18n,
						__injectWithOption: !0,
						__extender: n.__vueI18nExtend,
						__root: t
					});
					let e = this.$i18n;
					e.__extender && (e.__disposer = e.__extender(this.$i18n));
				}
			} else this.$i18n = e;
			i.__i18nGlobal && Kd(t, i, i), this.$t = (...e) => this.$i18n.t(...e), this.$rt = (...e) => this.$i18n.rt(...e), this.$te = (e, t) => this.$i18n.te(e, t), this.$d = (...e) => this.$i18n.d(...e), this.$n = (...e) => this.$i18n.n(...e), this.$tm = (e) => this.$i18n.tm(e), n.__setInstance(r, this.$i18n);
			let a = this.$i18n;
			Xd(r, () => {
				a.__disposer && (a.__disposer(), delete a.__disposer, delete a.__extender), n.__deleteInstance(r);
			});
		},
		mounted() {},
		unmounted() {
			let e = Jd();
			/* istanbul ignore if */
			if (!e) throw Nd(Md.UNEXPECTED_ERROR);
			let t = this.$i18n;
			t && (delete this.$t, delete this.$rt, delete this.$te, delete this.$d, delete this.$n, delete this.$tm, t?.__disposer && (t.__disposer(), delete t.__disposer, delete t.__extender), n.__deleteInstance(e), delete this.$i18n);
		}
	};
}
function cf(e, t) {
	e.locale = t.locale || e.locale, e.fallbackLocale = t.fallbackLocale || e.fallbackLocale, e.missing = t.missing || e.missing, e.silentTranslationWarn = t.silentTranslationWarn || e.silentFallbackWarn, e.silentFallbackWarn = t.silentFallbackWarn || e.silentFallbackWarn, e.formatFallbackMessages = t.formatFallbackMessages || e.formatFallbackMessages, e.postTranslation = t.postTranslation || e.postTranslation, e.warnHtmlInMessage = t.warnHtmlInMessage || e.warnHtmlInMessage, e.escapeParameterHtml = t.escapeParameterHtml || e.escapeParameterHtml, e.sync = t.sync || e.sync, e.__composer[Ld](t.pluralizationRules || e.pluralizationRules);
	let n = Wd(e.locale, {
		messages: t.messages,
		__i18n: t.__i18n
	});
	return Object.keys(n).forEach((t) => e.mergeLocaleMessage(t, n[t])), t.datetimeFormats && Object.keys(t.datetimeFormats).forEach((n) => e.mergeDateTimeFormat(n, t.datetimeFormats[n])), t.numberFormats && Object.keys(t.numberFormats).forEach((n) => e.mergeNumberFormat(n, t.numberFormats[n])), e;
}
var lf = {
	tag: { type: [String, Object] },
	locale: { type: String },
	scope: {
		type: String,
		validator: (e) => e === "parent" || e === "global",
		default: "parent"
	},
	i18n: { type: Object }
};
function uf({ slots: e }, t) {
	return t.length === 1 && t[0] === "default" ? (e.default ? e.default() : []).reduce((e, t) => [...e, ...t.type === H ? t.children : [t]], []) : t.reduce((t, n) => {
		let r = e[n];
		return r && (t[n] = r()), t;
	}, Ps());
}
function df() {
	return H;
}
var ff = /* @__PURE__ */ z({
	name: "i18n-t",
	props: Ms({
		keypath: {
			type: String,
			required: !0
		},
		plural: {
			type: [Number, String],
			validator: (e) => Os(e) || !isNaN(e)
		}
	}, lf),
	setup(e, t) {
		let { slots: n, attrs: r } = t, i = e.i18n || Cf({
			useScope: e.scope,
			__useComponent: !0
		});
		return () => {
			let a = () => {
				let r = Object.keys(n).filter((e) => e[0] !== "_"), a = Ps();
				e.locale && (a.locale = e.locale), e.plural !== void 0 && (a.plural = Z(e.plural) ? +e.plural : e.plural);
				let o = uf(t, r);
				return i[Pd](e.keypath, o, a);
			}, o = Ms(Ps(), r), s = Z(e.tag) || Ws(e.tag) ? e.tag : df();
			return Ws(s) ? so(s, o, { default: a }) : so(s, o, a());
		};
	}
});
function pf(e) {
	return Vs(e) && !Z(e[0]);
}
function mf(e, t, n, r) {
	let { slots: i, attrs: a } = t;
	return () => {
		let t = () => {
			let t = { part: !0 }, a = Ps();
			e.locale && (t.locale = e.locale), Z(e.format) ? t.key = e.format : Ws(e.format) && (Z(e.format.key) && (t.key = e.format.key), a = Object.keys(e.format).reduce((t, r) => n.includes(r) ? Ms(Ps(), t, { [r]: e.format[r] }) : t, Ps()));
			let o = r(e.value, t, a), s = [t.key];
			return Vs(o) ? s = o.map((e, t) => {
				let n = i[e.type], r = n ? n({
					[e.type]: e.value,
					index: t,
					parts: o
				}) : [e.value];
				return pf(r) && (r[0].key = `${e.type}-${t}`), r;
			}) : Z(o) && (s = [o]), s;
		}, o = Ms(Ps(), a), s = Z(e.tag) || Ws(e.tag) ? e.tag : df();
		return Ws(s) ? so(s, o, { default: t }) : so(s, o, t());
	};
}
var hf = /* @__PURE__ */ z({
	name: "i18n-n",
	props: Ms({
		value: {
			type: Number,
			required: !0
		},
		format: { type: [String, Object] }
	}, lf),
	setup(e, t) {
		let n = e.i18n || Cf({
			useScope: e.scope,
			__useComponent: !0
		});
		return mf(e, t, od, (...e) => n[Id](...e));
	}
});
function gf(e, t) {
	let n = e;
	if (e.mode === "composition") return n.__getInstance(t) || e.global;
	{
		let r = n.__getInstance(t);
		return r == null ? e.global.__composer : r.__composer;
	}
}
function _f(e) {
	let t = (t) => {
		let { instance: n, value: r } = t;
		/* istanbul ignore if */
		if (!n || !n.$) throw Nd(Md.UNEXPECTED_ERROR);
		let i = gf(e, n.$), a = vf(r);
		return [Reflect.apply(i.t, i, [...yf(a)]), i];
	};
	return {
		created: (e, n) => {
			let [r, i] = t(n);
			if (ws) {
				let t = Yd(n.instance.$);
				t.active && (e.__i18nWatcher = t.run(() => R(i.locale, () => {
					n.instance && n.instance.$forceUpdate();
				})));
			}
			e.__composer = i, e.textContent = r;
		},
		unmounted: (e) => {
			ws && e.__i18nWatcher && (e.__i18nWatcher(), e.__i18nWatcher = void 0, delete e.__i18nWatcher), e.__composer && (e.__composer = void 0, delete e.__composer);
		},
		beforeUpdate: (e, { value: t }) => {
			if (e.__composer) {
				let n = e.__composer, r = vf(t);
				e.textContent = Reflect.apply(n.t, n, [...yf(r)]);
			}
		},
		getSSRProps: (e) => {
			let [n] = t(e);
			return { textContent: n };
		}
	};
}
function vf(e) {
	if (Z(e)) return { path: e };
	if (Js(e)) {
		if (!("path" in e)) throw Nd(Md.REQUIRED_VALUE, "path");
		return e;
	}
	throw Nd(Md.INVALID_VALUE);
}
function yf(e) {
	let { path: t, locale: n, args: r, choice: i, plural: a } = e, o = {}, s = r || {};
	return Z(n) && (o.locale = n), Os(i) && (o.plural = i), Os(a) && (o.plural = a), [
		t,
		s,
		o
	];
}
function bf(e, t, ...n) {
	let r = Js(n[0]) ? n[0] : {};
	(!Us(r.globalInstall) || r.globalInstall) && ([ff.name, "I18nT"].forEach((t) => e.component(t, ff)), [hf.name, "I18nN"].forEach((t) => e.component(t, hf)), [Pf.name, "I18nD"].forEach((t) => e.component(t, Pf))), e.directive("t", _f(t));
}
var xf = /* #__PURE__*/ Ts("global-vue-i18n");
function Sf(e = {}) {
	let t = __VUE_I18N_LEGACY_API__ && Us(e.legacy) ? e.legacy : __VUE_I18N_LEGACY_API__, n = !Us(e.globalInjection) || e.globalInjection, r = /* @__PURE__ */ new Map(), [i, a] = wf(e, t), o = /* #__PURE__*/ Ts("");
	function s(e) {
		return r.get(e) || null;
	}
	function c(e, t) {
		r.set(e, t);
	}
	function l(e) {
		r.delete(e);
	}
	let u = {
		get mode() {
			return __VUE_I18N_LEGACY_API__ && t ? "legacy" : "composition";
		},
		install(e, ...r) {
			if (e.__VUE_I18N_SYMBOL__ = o, e.provide(e.__VUE_I18N_SYMBOL__, u), Js(r[0])) {
				let e = r[0];
				u.__composerExtend = e.__composerExtend, u.__vueI18nExtend = e.__vueI18nExtend;
			}
			let i = null;
			!t && n && (i = Nf(e, u.global)), __VUE_I18N_FULL_INSTALL__ && bf(e, u, ...r), __VUE_I18N_LEGACY_API__ && t && e.mixin(sf(a, a.__composer, u));
			let s = e.unmount;
			e.unmount = () => {
				i && i(), u.dispose(), s();
			};
		},
		get global() {
			return a;
		},
		dispose() {
			i.stop();
		},
		__instances: r,
		__getInstance: s,
		__setInstance: c,
		__deleteInstance: l
	};
	return u;
}
function Cf(e = {}) {
	let t = Jd();
	if (t == null) throw Nd(Md.MUST_BE_CALL_SETUP_TOP);
	if (!t.isCE && t.appContext.app != null && !t.appContext.app.__VUE_I18N_SYMBOL__) throw Nd(Md.NOT_INSTALLED);
	let n = Tf(t), r = Df(n), i = Gd(t), a = Ef(e, i);
	if (a === "global") return Kd(r, e, i), r;
	if (a === "parent") {
		let i = Of(n, t, e.__useComponent);
		return i ??= r, i;
	}
	if (a === "isolated") {
		if (n.mode !== "composition") throw Nd(Md.NOT_AVAILABLE_COMPOSITION_IN_LEGACY);
		let i = n, a = Ms({}, e);
		a.__root = Of(n, t) || r;
		let o = tf(a);
		return i.__composerExtend && (o[zd] = i.__composerExtend(o)), Oe() && ke(() => {
			let e = o[zd];
			e && (e(), delete o[zd]);
		}), o;
	}
	let o = n, s = o.__getInstance(t);
	if (s == null) {
		let n = Ms({}, e);
		"__i18n" in i && (n.__i18n = i.__i18n), r && (n.__root = r), s = tf(n), o.__composerExtend && (s[zd] = o.__composerExtend(s)), o.__setInstance(t, s), Af(o, t, s);
	}
	return s;
}
function wf(e, t) {
	let n = De(), r = __VUE_I18N_LEGACY_API__ && t ? n.run(() => of(e)) : n.run(() => tf(e));
	if (r == null) throw Nd(Md.UNEXPECTED_ERROR);
	return [n, r];
}
function Tf(e) {
	let t = Xn(e.isCE ? xf : e.appContext.app.__VUE_I18N_SYMBOL__);
	/* istanbul ignore if */
	if (!t) throw Nd(e.isCE ? Md.NOT_INSTALLED_WITH_PROVIDE : Md.UNEXPECTED_ERROR);
	return t;
}
function Ef(e, t) {
	return js(e) ? "__i18n" in t ? "local" : "global" : e.useScope ? e.useScope : "local";
}
function Df(e) {
	return e.mode === "composition" ? e.global : e.global.__composer;
}
function Of(e, t, n = !1) {
	let r = null, i = t.root, a = kf(t, n);
	for (; a != null;) {
		let t = e;
		if (e.mode === "composition") r = t.__getInstance(a);
		else if (__VUE_I18N_LEGACY_API__) {
			let e = t.__getInstance(a);
			e != null && (r = e.__composer, n && r && !r[Rd] && (r = null));
		}
		if (r != null || i === a) break;
		a = a.parent;
	}
	return r;
}
function kf(e, t = !1) {
	return e == null ? null : t && e.vnode.ctx || e.parent;
}
function Af(e, t, n) {
	zr(() => {}, t), Xd(t, () => {
		let r = n;
		e.__deleteInstance(t);
		let i = r[zd];
		i && (i(), delete r[zd]);
	});
}
var jf = [
	"locale",
	"fallbackLocale",
	"availableLocales"
], Mf = [
	"t",
	"rt",
	"d",
	"n",
	"tm",
	"te"
];
function Nf(e, t) {
	let n = Object.create(null);
	return jf.forEach((e) => {
		let r = Object.getOwnPropertyDescriptor(t, e);
		if (!r) throw Nd(Md.UNEXPECTED_ERROR);
		let i = /* @__PURE__ */ tn(r.value) ? {
			get() {
				return r.value.value;
			},
			set(e) {
				r.value.value = e;
			}
		} : { get() {
			return r.get && r.get();
		} };
		Object.defineProperty(n, e, i);
	}), e.config.globalProperties.$i18n = n, Mf.forEach((n) => {
		let r = Object.getOwnPropertyDescriptor(t, n);
		if (!r || !r.value) throw Nd(Md.UNEXPECTED_ERROR);
		Object.defineProperty(e.config.globalProperties, `$${n}`, r);
	}), () => {
		delete e.config.globalProperties.$i18n, Mf.forEach((t) => {
			delete e.config.globalProperties[`$${t}`];
		});
	};
}
var Pf = /* @__PURE__ */ z({
	name: "i18n-d",
	props: Ms({
		value: {
			type: [Number, Date],
			required: !0
		},
		format: { type: [String, Object] }
	}, lf),
	setup(e, t) {
		let n = e.i18n || Cf({
			useScope: e.scope,
			__useComponent: !0
		});
		return mf(e, t, nd, (...e) => n[Fd](...e));
	}
});
if (jd(), Mu(eu), Pu(Tu), Iu(fu), __INTLIFY_PROD_DEVTOOLS__) {
	let e = Is();
	e.__INTLIFY__ = !0, nu(e.__INTLIFY_DEVTOOLS_GLOBAL_HOOK__);
}
// src/api/client.ts
var Q = class extends Error {
	code;
	status;
	fields;
	requestId;
	details;
	constructor(e, t, n, r, i) {
		super(e), this.code = e, this.status = t, this.fields = n, this.requestId = r, this.details = i;
	}
};
function $(e) {
	return typeof e == "object" && !!e && !Array.isArray(e);
}
async function Ff(e, t, n) {
	return If(e, "GET", void 0, t, void 0, n);
}
async function If(e, n, r, i, a = 1e4, o) {
	let s = new AbortController(), c = !1, l = () => s.abort();
	i?.aborted && l(), i?.addEventListener("abort", l, { once: !0 });
	let u = a === null ? void 0 : setTimeout(() => {
		c = !0, s.abort();
	}, a);
	try {
		let i = await t.api.fetchApi(e, {
			method: n,
			signal: s.signal,
			cache: o,
			headers: e.startsWith("/astrophoto/v1/") ? {
				"X-AstroPhoto-Local": "1",
				...r ? { "Content-Type": "application/json" } : {}
			} : void 0,
			body: r ? JSON.stringify(r) : void 0
		});
		if (!i.ok) {
			let e = await i.json?.().catch(() => null), t = $(e) && $(e.error) ? e.error.code : $(e) ? e.reason : null, n = $(e) && $(e.error) && $(e.error.details) ? e.error.details : null;
			throw new Q(typeof t == "string" ? t : "http", i.status, $(n?.fields) ? n.fields : void 0, $(e) && typeof e.request_id == "string" ? e.request_id : void 0, n ?? void 0);
		}
		if (i.status === 204) return null;
		try {
			return await i.json();
		} catch (e) {
			throw s.signal.aborted ? e : new Q("json");
		}
	} catch (e) {
		throw i?.aborted ? new DOMException("Aborted", "AbortError") : c ? new Q("timeout") : e instanceof Q ? e : new Q("network");
	} finally {
		clearTimeout(u), i?.removeEventListener("abort", l);
	}
}
// node_modules/.pnpm/ohash@2.0.12/node_modules/ohash/dist/_chunks/is-equal.mjs
function Lf(e) {
	return typeof e == "string" ? `'${e}'` : new Vf().serialize(e);
}
var Rf = " _-,;:!?.'\"()[]{}@*/\\&#%`^+<=>|~$0123456789abcdefghijklmnopqrstuvwxyz", zf = /*@__PURE__*/ (function() {
	let e = /* @__PURE__ */ new Uint8Array(128);
	for (let t = 0; t < 69; t++) e[Rf.charCodeAt(t)] = t + 1;
	for (let t = 65; t <= 90; t++) e[t] = e[t + 32];
	return e;
})();
function Bf(e, t) {
	if (e === t) return 0;
	let n = Math.min(e.length, t.length), r = 0;
	for (let i = 0; i < n; i++) {
		let n = e.charCodeAt(i), a = t.charCodeAt(i);
		if (n === a) continue;
		let o = n < 128 && zf[n] ? zf[n] : n + 128, s = a < 128 && zf[a] ? zf[a] : a + 128;
		if (o !== s) return o < s ? -1 : 1;
		r === 0 && (r = n > a ? -1 : 1);
	}
	return e.length === t.length ? r : e.length < t.length ? -1 : 1;
}
var Vf = /*@__PURE__*/ (function() {
	class e {
		#e = /* @__PURE__ */ new Map();
		compare(e, t) {
			let n = typeof e, r = typeof t;
			return n === "string" && r === "string" ? Bf(e, t) : n === "number" && r === "number" ? e - t : Bf(this.serialize(e, !0), this.serialize(t, !0));
		}
		serialize(e, t) {
			if (e === null) return "null";
			switch (typeof e) {
				case "string": return t ? e : `'${e}'`;
				case "bigint": return `${e}n`;
				case "object": return this.$object(e);
				case "function": return this.$function(e);
			}
			return String(e);
		}
		serializeObject(e) {
			let t = Object.prototype.toString.call(e);
			if (t !== "[object Object]") return this.serializeBuiltInType(t.length < 10 ? `unknown:${t}` : t.slice(8, -1), e);
			let n = e.constructor, r = n === Object || n === void 0 ? "" : n.name;
			if (r !== "" && globalThis[r] === n) return this.serializeBuiltInType(r, e);
			if ("toJSON" in e && typeof e.toJSON == "function") {
				let t = e.toJSON();
				return r + (typeof t == "object" && t ? this.$object(t) : `(${this.serialize(t)})`);
			}
			let i = Object.keys(e).sort(Bf), a = `${r}{`;
			for (let t = 0; t < i.length; t++) {
				let n = i[t];
				a += `${n}:${this.serialize(e[n])}`, t < i.length - 1 && (a += ",");
			}
			return a + "}";
		}
		serializeBuiltInType(e, t) {
			let n = this["$" + e];
			if (n) return n.call(this, t);
			if (typeof t.entries == "function") return this.serializeObjectEntries(e, t.entries());
			throw Error(`Cannot serialize ${e}`);
		}
		serializeObjectEntries(e, t) {
			let n = Array.from(t).sort((e, t) => this.compare(e[0], t[0])), r = `${e}{`;
			for (let e = 0; e < n.length; e++) {
				let [t, i] = n[e];
				r += `${this.serialize(t, !0)}:${this.serialize(i)}`, e < n.length - 1 && (r += ",");
			}
			return r + "}";
		}
		$object(e) {
			let t = this.#e.get(e);
			return t === void 0 && (this.#e.set(e, `#${this.#e.size}`), t = this.serializeObject(e), this.#e.set(e, t)), t;
		}
		$function(e) {
			let t = Function.prototype.toString.call(e);
			return t.slice(-15) === "[native code] }" ? `${e.name || ""}()[native]` : `${e.name}(${e.length})${t.replace(/\s*\n\s*/g, "")}`;
		}
		$Array(e) {
			let t = "[";
			for (let n = 0; n < e.length; n++) t += this.serialize(e[n]), n < e.length - 1 && (t += ",");
			return t + "]";
		}
		$Date(e) {
			try {
				return `Date(${e.toISOString()})`;
			} catch {
				return "Date(null)";
			}
		}
		$ArrayBuffer(e) {
			return `ArrayBuffer[${new Uint8Array(e).join(",")}]`;
		}
		$Set(e) {
			return `Set${this.$Array(Array.from(e).sort((e, t) => this.compare(e, t)))}`;
		}
		$Map(e) {
			return this.serializeObjectEntries("Map", e.entries());
		}
	}
	for (let t of [
		"Error",
		"RegExp",
		"URL"
	]) e.prototype["$" + t] = function(e) {
		return `${t}(${e})`;
	};
	for (let t of [
		"Int8Array",
		"Uint8Array",
		"Uint8ClampedArray",
		"Int16Array",
		"Uint16Array",
		"Int32Array",
		"Uint32Array",
		"Float32Array",
		"Float64Array"
	]) e.prototype["$" + t] = function(e) {
		return `${t}[${e.join(",")}]`;
	};
	for (let t of ["BigInt64Array", "BigUint64Array"]) e.prototype["$" + t] = function(e) {
		return `${t}[${e.join("n,")}${e.length > 0 ? "n" : ""}]`;
	};
	return e;
})();
function Hf(e, t) {
	return e === t || Lf(e) === Lf(t);
}
// node_modules/.pnpm/reka-ui@2.11.0_vue@3.5.42_typescript@6.0.3_/node_modules/reka-ui/dist/shared/arrays.js
function Uf(e, t, n) {
	let r = e.findIndex((e) => Hf(e, t)), i = e.findIndex((e) => Hf(e, n));
	if (r === -1 || i === -1) return [];
	let [a, o] = [r, i].sort((e, t) => e - t);
	return e.slice(a, o + 1);
}
// node_modules/.pnpm/reka-ui@2.11.0_vue@3.5.42_typescript@6.0.3_/node_modules/reka-ui/dist/shared/clamp.js
function Wf(e, t = -Infinity, n = Infinity) {
	return Math.min(n, Math.max(t, e));
}
// node_modules/.pnpm/reka-ui@2.11.0_vue@3.5.42_typescript@6.0.3_/node_modules/reka-ui/dist/shared/createContext.js
function Gf(e, t) {
	let n = typeof e == "string" && !t ? `${e}Context` : t, r = Symbol(n);
	return [(t) => {
		let n = Xn(r, t);
		if (n || n === null) return n;
		throw Error(`Injection \`${r.toString()}\` not found. Component must be used within ${Array.isArray(e) ? `one of the following components: ${e.join(", ")}` : `\`${e}\``}`);
	}, (e) => (Yn(r, e), e)];
}
// node_modules/.pnpm/reka-ui@2.11.0_vue@3.5.42_typescript@6.0.3_/node_modules/reka-ui/dist/shared/getActiveElement.js
function Kf() {
	let e = document.activeElement;
	if (e == null) return null;
	for (; e != null && e.shadowRoot != null && e.shadowRoot.activeElement != null;) e = e.shadowRoot.activeElement;
	return e;
}
// node_modules/.pnpm/reka-ui@2.11.0_vue@3.5.42_typescript@6.0.3_/node_modules/reka-ui/dist/shared/handleAndDispatchCustomEvent.js
function qf(e, t, n) {
	let r = n.originalEvent.target, i = new CustomEvent(e, {
		bubbles: !1,
		cancelable: !0,
		detail: n
	});
	t && r.addEventListener(e, t, { once: !0 }), r.dispatchEvent(i);
}
// node_modules/.pnpm/reka-ui@2.11.0_vue@3.5.42_typescript@6.0.3_/node_modules/reka-ui/dist/shared/nullish.js
function Jf(e) {
	return e == null;
}
// node_modules/.pnpm/@vueuse+shared@14.4.0_vue@3.5.42_typescript@6.0.3_/node_modules/@vueuse/shared/dist/index.js
function Yf(e, t) {
	return Oe() ? (ke(e, t), !0) : !1;
}
function Xf() {
	let e = /* @__PURE__ */ new Set(), t = (t) => {
		e.delete(t);
	};
	return {
		on: (n) => {
			e.add(n);
			let r = () => t(n);
			return Yf(r), { off: r };
		},
		off: t,
		trigger: (...t) => Promise.all(Array.from(e).map((e) => e(...t))),
		clear: () => {
			e.clear();
		}
	};
}
function Zf(e) {
	let t = !1, n, r = De(!0);
	return ((...i) => (t ||= (n = r.run(() => e(...i)), !0), n));
}
var Qf = typeof window < "u" && typeof document < "u";
typeof WorkerGlobalScope < "u" && globalThis instanceof WorkerGlobalScope;
var $f = (e) => e !== void 0, ep = Object.prototype.toString, tp = (e) => ep.call(e) === "[object Object]", np = /* #__PURE__ */ rp();
function rp() {
	var e, t;
	return Qf && !!((e = window) != null && (e = e.navigator) != null && e.userAgent) && (/iP(?:ad|hone|od)/.test(window.navigator.userAgent) || ((t = window) == null || (t = t.navigator) == null ? void 0 : t.maxTouchPoints) > 2 && /iPad|Macintosh/.test(window?.navigator.userAgent));
}
function ip(e) {
	return Array.isArray(e) ? e : [e];
}
function ap(e) {
	return e || Ga();
}
function op(e) {
	if (!Qf) return e;
	let t = 0, n, r, i = () => {
		--t, r && t <= 0 && (r.stop(), n = void 0, r = void 0);
	};
	return ((...a) => (t += 1, r || (r = De(!0), n = r.run(() => e(...a))), Yf(i), n));
}
function sp(e) {
	return /* @__PURE__ */ Ht(/* @__PURE__ */ tn(e) ? new Proxy({}, {
		get(t, n, r) {
			return I(Reflect.get(e.value, n, r));
		},
		set(t, n, r) {
			return /* @__PURE__ */ tn(e.value[n]) && !/* @__PURE__ */ tn(r) ? e.value[n].value = r : e.value[n] = r, !0;
		},
		deleteProperty(t, n) {
			return Reflect.deleteProperty(e.value, n);
		},
		has(t, n) {
			return Reflect.has(e.value, n);
		},
		ownKeys() {
			return Object.keys(e.value);
		},
		getOwnPropertyDescriptor() {
			return {
				enumerable: !0,
				configurable: !0
			};
		}
	}) : e);
}
function cp(e) {
	return sp(X(e));
}
function lp(e, ...t) {
	let n = t.flat(), r = n[0];
	return cp(() => Object.fromEntries(typeof r == "function" ? Object.entries(/* @__PURE__ */ dn(e)).filter(([e, t]) => !r(on(t), e)) : Object.entries(/* @__PURE__ */ dn(e)).filter((e) => !n.includes(e[0]))));
}
function up(e, t = 1e4) {
	return un((n, r) => {
		let i = on(e), a, o = () => setTimeout(() => {
			i = on(e), r();
		}, on(t));
		return Yf(() => {
			clearTimeout(a);
		}), {
			get() {
				return n(), i;
			},
			set(e) {
				i = e, r(), clearTimeout(a), a = o();
			}
		};
	});
}
function dp(e, t) {
	ap(t) && Hr(e, t);
}
function fp(e, t, n) {
	return R(e, t, {
		...n,
		immediate: !0
	});
}
// node_modules/.pnpm/@vueuse+core@14.4.0_vue@3.5.42_typescript@6.0.3_/node_modules/@vueuse/core/dist/index.js
var pp = Qf ? window : void 0;
Qf && window.document, Qf && window.navigator, Qf && window.location;
function mp(e) {
	let t = on(e);
	return t?.$el ?? t;
}
function hp(...e) {
	let t = (e, t, n, r) => (e.addEventListener(t, n, r), () => e.removeEventListener(t, n, r)), n = X(() => {
		let t = ip(on(e[0])).filter((e) => e != null);
		return t.every((e) => typeof e != "string") ? t : void 0;
	});
	return fp(() => [
		n.value?.map((e) => mp(e)) ?? [pp].filter((e) => e != null),
		ip(on(n.value ? e[1] : e[0])),
		ip(I(n.value ? e[2] : e[1])),
		on(n.value ? e[3] : e[2])
	], ([e, n, r, i], a, o) => {
		if (!e?.length || !n?.length || !r?.length) return;
		let s = tp(i) ? { ...i } : i, c = e.flatMap((e) => n.flatMap((n) => r.map((r) => t(e, n, r, s))));
		o(() => {
			c.forEach((e) => e());
		});
	}, { flush: "post" });
}
function gp() {
	let e = /* @__PURE__ */ F(!1), t = Ga();
	return t && zr(() => {
		e.value = !0;
	}, t), e;
}
/* @__NO_SIDE_EFFECTS__ */
function _p(e) {
	let t = gp();
	return X(() => (t.value, !!e()));
}
function vp(e) {
	return typeof e == "function" ? e : typeof e == "string" ? (t) => t.key === e : Array.isArray(e) ? (t) => e.includes(t.key) : () => !0;
}
function yp(...e) {
	let t, n, r = {};
	e.length === 3 ? (t = e[0], n = e[1], r = e[2]) : e.length === 2 ? typeof e[1] == "object" ? (t = !0, n = e[0], r = e[1]) : (t = e[0], n = e[1]) : (t = !0, n = e[0]);
	let { target: i = pp, eventName: a = "keydown", passive: o = !1, dedupe: s = !1 } = r, c = vp(t);
	return hp(i, a, (e) => {
		e.repeat && on(s) || c(e) && n(e);
	}, o);
}
function bp(e) {
	return JSON.parse(JSON.stringify(e));
}
function xp(e, t, n = {}) {
	let { window: r = pp, ...i } = n, a, o = /* @__PURE__ */ _p(() => r && "ResizeObserver" in r), s = () => {
		a &&= (a.disconnect(), void 0);
	}, c = R(X(() => {
		let t = on(e);
		return Array.isArray(t) ? t.map((e) => mp(e)) : [mp(t)];
	}), (e) => {
		if (s(), o.value && r) {
			a = new ResizeObserver(t);
			for (let t of e) t && a.observe(t, i);
		}
	}, {
		immediate: !0,
		flush: "post"
	}), l = () => {
		s(), c();
	};
	return Yf(l), {
		isSupported: o,
		stop: l
	};
}
function Sp(e, t, n, r = {}) {
	var i, a;
	let { clone: o = !1, passive: s = !1, eventName: c, deep: l = !1, defaultValue: u, shouldEmit: d } = r, f = Ga(), p = n || f?.emit || (f == null || (i = f.$emit) == null ? void 0 : i.bind(f)) || (f == null || (a = f.proxy) == null || (a = a.$emit) == null ? void 0 : a.bind(f?.proxy)), m = c;
	t ||= "modelValue", m ||= `update:${t.toString()}`;
	let h = (e) => o ? typeof o == "function" ? o(e) : bp(e) : e, g = () => $f(e[t]) ? h(e[t]) : u, _ = (e) => {
		d ? d(e) && p(m, e) : p(m, e);
	};
	if (s) {
		let n = /* @__PURE__ */ P(g()), r = !1;
		return R(() => e[t], (e) => {
			r || (r = !0, n.value = h(e), Fn(() => r = !1));
		}), R(n, (n) => {
			!r && (n !== e[t] || l) && _(n);
		}, { deep: l }), n;
	}
	return X({
		get() {
			return g();
		},
		set(e) {
			_(e);
		}
	});
}
// node_modules/.pnpm/reka-ui@2.11.0_vue@3.5.42_typescript@6.0.3_/node_modules/reka-ui/dist/shared/renderSlotFragments.js
function Cp(e) {
	return e ? e.flatMap((e) => e.type === H ? Cp(e.children) : [e]) : [];
}
// node_modules/.pnpm/reka-ui@2.11.0_vue@3.5.42_typescript@6.0.3_/node_modules/reka-ui/dist/ConfigProvider/ConfigProvider.js
var [wp, Tp] = /*#__PURE__*/ Gf("ConfigProvider"), Ep = /* @__PURE__ */ new WeakMap();
function Dp(e, t) {
	let n = Ep.get(e);
	n || (n = {
		owners: /* @__PURE__ */ new Set(),
		original: e.body.style.pointerEvents
	}, Ep.set(e, n)), n.owners.add(t), e.body.style.pointerEvents = "none";
}
function Op(e, t) {
	let n = Ep.get(e);
	n?.owners.delete(t) && n.owners.size === 0 && (Ep.delete(e), e.body.style.pointerEvents = n.original);
}
// node_modules/.pnpm/defu@6.1.7/node_modules/defu/dist/defu.mjs
function kp(e) {
	if (typeof e != "object" || !e) return !1;
	let t = Object.getPrototypeOf(e);
	return t !== null && t !== Object.prototype && Object.getPrototypeOf(t) !== null || Symbol.iterator in e ? !1 : Symbol.toStringTag in e ? Object.prototype.toString.call(e) === "[object Module]" : !0;
}
function Ap(e, t, n = ".", r) {
	if (!kp(t)) return Ap(e, {}, n, r);
	let i = { ...t };
	for (let t of Object.keys(e)) {
		if (t === "__proto__" || t === "constructor") continue;
		let a = e[t];
		a != null && (r && r(i, t, a, n) || (i[t] = Array.isArray(a) && Array.isArray(i[t]) ? [...a, ...i[t]] : kp(a) && kp(i[t]) ? Ap(a, i[t], (n ? `${n}.` : "") + t.toString(), r) : a));
	}
	return i;
}
function jp(e) {
	return (...t) => t.reduce((t, n) => Ap(t, n, "", e), {});
}
var Mp = jp(), Np = Symbol("useBodyScrollLock"), Pp = op(() => {
	let e = /* @__PURE__ */ P(/* @__PURE__ */ new Map()), t = /* @__PURE__ */ P(), n = X(() => {
		for (let t of e.value.values()) if (t) return !0;
		return !1;
	}), r = wp({ scrollBody: /* @__PURE__ */ P(!0) }), i = null, a = () => {
		document.body.style.paddingRight = "", document.body.style.marginRight = "", Op(document, Np), document.documentElement.style.removeProperty("--scrollbar-width"), document.body.style.overflow = t.value ?? "", np && i?.(), t.value = void 0;
	};
	return R(n, (e, o) => {
		if (!Qf) return;
		if (!e) {
			o && a();
			return;
		}
		t.value === void 0 && (t.value = document.body.style.overflow);
		let s = window.innerWidth - document.documentElement.clientWidth, c = {
			padding: s,
			margin: 0
		}, l = r.scrollBody?.value ? typeof r.scrollBody.value == "object" ? Mp({
			padding: r.scrollBody.value.padding === !0 ? s : r.scrollBody.value.padding,
			margin: r.scrollBody.value.margin === !0 ? s : r.scrollBody.value.margin
		}, c) : c : {
			padding: 0,
			margin: 0
		};
		s > 0 && (document.body.style.paddingRight = typeof l.padding == "number" ? `${l.padding}px` : String(l.padding), document.body.style.marginRight = typeof l.margin == "number" ? `${l.margin}px` : String(l.margin), document.documentElement.style.setProperty("--scrollbar-width", `${s}px`), document.body.style.overflow = "hidden"), np && (i = hp(document, "touchmove", (e) => Lp(e), { passive: !1 })), Fn(() => {
			n.value && (Dp(document, Np), document.body.style.overflow = "hidden");
		});
	}, {
		immediate: !0,
		flush: "sync"
	}), e;
});
function Fp(e) {
	let t = Math.random().toString(36).substring(2, 7), n = Pp();
	n.value.set(t, e ?? !1);
	let r = X({
		get: () => n.value.get(t) ?? !1,
		set: (e) => n.value.set(t, e)
	});
	return dp(() => {
		n.value.delete(t);
	}), r;
}
function Ip(e) {
	let t = window.getComputedStyle(e);
	if (t.overflowX === "scroll" || t.overflowY === "scroll" || t.overflowX === "auto" && e.clientWidth < e.scrollWidth || t.overflowY === "auto" && e.clientHeight < e.scrollHeight) return !0;
	{
		let t = e.parentNode;
		return !(t instanceof Element) || t.tagName === "BODY" ? !1 : Ip(t);
	}
}
function Lp(e) {
	let t = e || window.event, n = t.target;
	return n instanceof Element && Ip(n) ? !1 : t.touches.length > 1 || (t.preventDefault && t.cancelable && t.preventDefault(), !1);
}
// node_modules/.pnpm/reka-ui@2.11.0_vue@3.5.42_typescript@6.0.3_/node_modules/reka-ui/dist/shared/useComposing.js
var Rp = /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}\p{Script=Bopomofo}]/u, zp = /android/i;
function Bp() {
	return typeof navigator < "u" && zp.test(navigator.userAgent);
}
function Vp(e) {
	let t = /* @__PURE__ */ P(!1), n = /* @__PURE__ */ P(!0), r = /* @__PURE__ */ P(!1), i = X(() => t.value && n.value);
	function a() {
		t.value = !0, n.value = !0, r.value = !1;
	}
	function o(e) {
		e.data && (Rp.test(e.data) ? (n.value = !0, r.value = !0) : Bp() && !r.value && (n.value = !1));
	}
	function s(n) {
		Fn(() => {
			t.value = !1, e?.(n);
		});
	}
	return {
		isComposing: t,
		shouldDeferInput: i,
		handleCompositionStart: a,
		handleCompositionUpdate: o,
		handleCompositionEnd: s
	};
}
// node_modules/.pnpm/reka-ui@2.11.0_vue@3.5.42_typescript@6.0.3_/node_modules/reka-ui/dist/shared/useDirection.js
function Hp(e) {
	let t = wp({ dir: /* @__PURE__ */ P("ltr") });
	return X(() => e?.value || t.dir?.value || "ltr");
}
// node_modules/.pnpm/reka-ui@2.11.0_vue@3.5.42_typescript@6.0.3_/node_modules/reka-ui/dist/shared/useEmitAsProps.js
function Up(e) {
	let t = Ga(), n = t?.type.emits, r = {};
	return n?.length || console.warn(`No emitted event found. Please check component: ${t?.type.__name}`), n?.forEach((t) => {
		r[ne(j(t))] = (...n) => e(t, ...n);
	}), r;
}
// node_modules/.pnpm/reka-ui@2.11.0_vue@3.5.42_typescript@6.0.3_/node_modules/reka-ui/dist/shared/useFilter.js
function Wp(e) {
	let t = X(() => I(e)), n = X(() => new Intl.Collator("en", {
		usage: "search",
		...t.value
	}));
	return {
		startsWith: (e, t) => t.length === 0 || (e = e.normalize("NFC"), t = t.normalize("NFC"), n.value.compare(e.slice(0, t.length), t) === 0),
		endsWith: (e, t) => t.length === 0 || (e = e.normalize("NFC"), t = t.normalize("NFC"), n.value.compare(e.slice(-t.length), t) === 0),
		contains: (e, t) => {
			if (t.length === 0) return !0;
			if (e = e.normalize("NFC"), t = t.normalize("NFC"), t.length > e.length) return !1;
			let r = n.value.compare;
			if (e.includes(t)) return !0;
			let i = t.length;
			for (let n = 0; n + i <= e.length; n++) if (r(t, e.slice(n, n + i)) === 0) return !0;
			return !1;
		}
	};
}
// node_modules/.pnpm/reka-ui@2.11.0_vue@3.5.42_typescript@6.0.3_/node_modules/reka-ui/dist/shared/useFocusGuards.js
var Gp = 0;
function Kp() {
	$n((e) => {
		if (!Qf) return;
		let t = document.querySelectorAll("[data-reka-focus-guard]");
		document.body.insertAdjacentElement("afterbegin", t[0] ?? qp()), document.body.insertAdjacentElement("beforeend", t[1] ?? qp()), Gp++, e(() => {
			Gp === 1 && document.querySelectorAll("[data-reka-focus-guard]").forEach((e) => e.remove()), Gp--;
		});
	});
}
function qp() {
	let e = document.createElement("span");
	return e.setAttribute("data-reka-focus-guard", ""), e.tabIndex = 0, e.style.outline = "none", e.style.opacity = "0", e.style.position = "fixed", e.style.pointerEvents = "none", e;
}
// node_modules/.pnpm/reka-ui@2.11.0_vue@3.5.42_typescript@6.0.3_/node_modules/reka-ui/dist/shared/useFormControl.js
function Jp(e) {
	return X(() => !on(e) || !!mp(e)?.closest("form"));
}
// node_modules/.pnpm/reka-ui@2.11.0_vue@3.5.42_typescript@6.0.3_/node_modules/reka-ui/dist/shared/useForwardExpose.js
function Yp() {
	let e = Ga(), t = /* @__PURE__ */ P(), n = X(() => r());
	Vr(() => {
		n.value !== r() && an(t);
	});
	function r() {
		return t.value && "$el" in t.value && ["#text", "#comment"].includes(t.value.$el.nodeName) ? t.value.$el.nextElementSibling : mp(t);
	}
	let i = Object.assign({}, e.exposed), a = {};
	for (let t in e.props) Object.defineProperty(a, t, {
		enumerable: !0,
		configurable: !0,
		get: () => e.props[t]
	});
	if (Object.keys(i).length > 0) for (let e in i) Object.defineProperty(a, e, {
		enumerable: !0,
		configurable: !0,
		get: () => i[e]
	});
	Object.defineProperty(a, "$el", {
		enumerable: !0,
		configurable: !0,
		get: () => e.vnode.el
	}), e.exposed = a;
	function o(n) {
		if (t.value = n, n && (Object.defineProperty(a, "$el", {
			enumerable: !0,
			configurable: !0,
			get: () => n instanceof Element ? n : n.$el
		}), !(n instanceof Element) && !Object.hasOwn(n, "$el"))) {
			let t = n.$.exposed, r = Object.assign({}, a);
			for (let e in t) Object.defineProperty(r, e, {
				enumerable: !0,
				configurable: !0,
				get: () => t[e]
			});
			e.exposed = r;
		}
	}
	return {
		forwardRef: o,
		currentRef: t,
		currentElement: n
	};
}
// node_modules/.pnpm/reka-ui@2.11.0_vue@3.5.42_typescript@6.0.3_/node_modules/reka-ui/dist/shared/useForwardProps.js
function Xp(e) {
	let t = Ga(), n = Object.keys(t?.type.props ?? {}).reduce((e, n) => {
		let r = (t?.type.props[n]).default;
		return r !== void 0 && (e[n] = r), e;
	}, {}), r = /* @__PURE__ */ mn(e);
	return X(() => {
		let e = {}, i = t?.vnode.props ?? {};
		return Object.keys(i).forEach((t) => {
			e[j(t)] = i[t];
		}), Object.keys({
			...n,
			...e
		}).reduce((e, t) => (r.value[t] !== void 0 && (e[t] = r.value[t]), e), {});
	});
}
// node_modules/.pnpm/reka-ui@2.11.0_vue@3.5.42_typescript@6.0.3_/node_modules/reka-ui/dist/shared/useForwardPropsEmits.js
function Zp(e, t) {
	let n = Xp(e), r = t ? Up(t) : {};
	return X(() => ({
		...n.value,
		...r
	}));
}
// node_modules/.pnpm/aria-hidden@1.2.6/node_modules/aria-hidden/dist/es2015/index.js
var Qp = function(e) {
	return typeof document > "u" ? null : (Array.isArray(e) ? e[0] : e).ownerDocument.body;
}, $p = /* @__PURE__ */ new WeakMap(), em = /* @__PURE__ */ new WeakMap(), tm = {}, nm = 0, rm = function(e) {
	return e && (e.host || rm(e.parentNode));
}, im = function(e, t) {
	return t.map(function(t) {
		if (e.contains(t)) return t;
		var n = rm(t);
		return n && e.contains(n) ? n : (console.error("aria-hidden", t, "in not contained inside", e, ". Doing nothing"), null);
	}).filter(function(e) {
		return !!e;
	});
}, am = function(e, t, n, r) {
	var i = im(t, Array.isArray(e) ? e : [e]);
	tm[n] || (tm[n] = /* @__PURE__ */ new WeakMap());
	var a = tm[n], o = [], s = /* @__PURE__ */ new Set(), c = new Set(i), l = function(e) {
		e && !s.has(e) && (s.add(e), l(e.parentNode));
	};
	i.forEach(l);
	var u = function(e) {
		e && !c.has(e) && Array.prototype.forEach.call(e.children, function(e) {
			if (s.has(e)) u(e);
			else try {
				var t = e.getAttribute(r), i = t !== null && t !== "false", c = ($p.get(e) || 0) + 1, l = (a.get(e) || 0) + 1;
				$p.set(e, c), a.set(e, l), o.push(e), c === 1 && i && em.set(e, !0), l === 1 && e.setAttribute(n, "true"), i || e.setAttribute(r, "true");
			} catch (t) {
				console.error("aria-hidden: cannot operate on ", e, t);
			}
		});
	};
	return u(t), s.clear(), nm++, function() {
		o.forEach(function(e) {
			var t = $p.get(e) - 1, i = a.get(e) - 1;
			$p.set(e, t), a.set(e, i), t || (em.has(e) || e.removeAttribute(r), em.delete(e)), i || e.removeAttribute(n);
		}), nm--, nm || ($p = /* @__PURE__ */ new WeakMap(), $p = /* @__PURE__ */ new WeakMap(), em = /* @__PURE__ */ new WeakMap(), tm = {});
	};
}, om = function(e, t, n) {
	n === void 0 && (n = "data-aria-hidden");
	var r = Array.from(Array.isArray(e) ? e : [e]), i = t || Qp(e);
	return i ? (r.push.apply(r, Array.from(i.querySelectorAll("[aria-live], script"))), am(r, i, n, "aria-hidden")) : function() {
		return null;
	};
};
// node_modules/.pnpm/reka-ui@2.11.0_vue@3.5.42_typescript@6.0.3_/node_modules/reka-ui/dist/shared/useHideOthers.js
function sm(e) {
	let t;
	R(() => mp(e), (e) => {
		let n = !1;
		try {
			n = !!e?.closest("[popover]:not(:popover-open)");
		} catch {}
		e && !n ? t = om(e) : t && t();
	}), Ur(() => {
		t && t();
	});
}
function cm(e, t = "reka") {
	if (e) return e;
	let n, r = wp({ useId: void 0 });
	return n = r.useId ? r.useId() : Cr?.(), t ? `${t}-${n}` : n;
}
// node_modules/.pnpm/reka-ui@2.11.0_vue@3.5.42_typescript@6.0.3_/node_modules/reka-ui/dist/shared/useKbd.js
function lm() {
	return {
		ALT: "Alt",
		ARROW_DOWN: "ArrowDown",
		ARROW_LEFT: "ArrowLeft",
		ARROW_RIGHT: "ArrowRight",
		ARROW_UP: "ArrowUp",
		BACKSPACE: "Backspace",
		CAPS_LOCK: "CapsLock",
		CONTROL: "Control",
		DELETE: "Delete",
		END: "End",
		ENTER: "Enter",
		ESCAPE: "Escape",
		F1: "F1",
		F10: "F10",
		F11: "F11",
		F12: "F12",
		F2: "F2",
		F3: "F3",
		F4: "F4",
		F5: "F5",
		F6: "F6",
		F7: "F7",
		F8: "F8",
		F9: "F9",
		HOME: "Home",
		META: "Meta",
		PAGE_DOWN: "PageDown",
		PAGE_UP: "PageUp",
		SHIFT: "Shift",
		SPACE: " ",
		TAB: "Tab",
		CTRL: "Control",
		ASTERISK: "*",
		SPACE_CODE: "Space"
	};
}
// node_modules/.pnpm/reka-ui@2.11.0_vue@3.5.42_typescript@6.0.3_/node_modules/reka-ui/dist/shared/useSize.js
function um(e) {
	let t = /* @__PURE__ */ P(), n = X(() => t.value?.width ?? 0), r = X(() => t.value?.height ?? 0), i;
	return zr(() => {
		let n = mp(e);
		n ? (t.value = {
			width: n.offsetWidth,
			height: n.offsetHeight
		}, i = new ResizeObserver((e) => {
			if (!Array.isArray(e) || !e.length) return;
			let r = e[0], i, a;
			if ("borderBoxSize" in r) {
				let e = r.borderBoxSize, t = Array.isArray(e) ? e[0] : e;
				i = t.inlineSize, a = t.blockSize;
			} else i = n.offsetWidth, a = n.offsetHeight;
			t.value = {
				width: i,
				height: a
			};
		}), i.observe(n, { box: "border-box" })) : t.value = void 0;
	}), Ur(() => {
		i?.disconnect(), i = void 0;
	}), {
		width: n,
		height: r
	};
}
// node_modules/.pnpm/reka-ui@2.11.0_vue@3.5.42_typescript@6.0.3_/node_modules/reka-ui/dist/shared/useStateMachine.js
function dm(e, t) {
	let n = /* @__PURE__ */ P(e);
	function r(e) {
		return t[n.value][e] ?? n.value;
	}
	return {
		state: n,
		dispatch: (e) => {
			n.value = r(e);
		}
	};
}
// node_modules/.pnpm/reka-ui@2.11.0_vue@3.5.42_typescript@6.0.3_/node_modules/reka-ui/dist/shared/useTypeahead.js
function fm(e) {
	let t = up("", 1e3);
	return {
		search: t,
		handleTypeaheadSearch: (n, r) => {
			if (t.value += n, e) e(n);
			else {
				let e = Kf(), n = r.map((e) => ({
					...e,
					textValue: e.value?.textValue ?? e.ref.textContent?.trim() ?? ""
				})), i = n.find((t) => t.ref === e), a = mm(n.map((e) => e.textValue), t.value, i?.textValue), o = n.find((e) => e.textValue === a);
				return o && o.ref.focus(), o?.ref;
			}
		},
		resetTypeahead: () => {
			t.value = "";
		}
	};
}
function pm(e, t) {
	return e.map((n, r) => e[(t + r) % e.length]);
}
function mm(e, t, n) {
	let r = t.length > 1 && Array.from(t).every((e) => e === t[0]) ? t[0] : t, i = n ? e.indexOf(n) : -1, a = pm(e, Math.max(i, 0));
	r.length === 1 && (a = a.filter((e) => e !== n));
	let o = a.find((e) => e.toLowerCase().startsWith(r.toLowerCase()));
	return o === n ? void 0 : o;
}
// node_modules/.pnpm/reka-ui@2.11.0_vue@3.5.42_typescript@6.0.3_/node_modules/reka-ui/dist/Presence/usePresence.js
function hm(e, t) {
	let n = /* @__PURE__ */ P({}), r = /* @__PURE__ */ P("none"), i = /* @__PURE__ */ P(e), a = e.value ? "mounted" : "unmounted", o, s = t.value?.ownerDocument.defaultView ?? pp, { state: c, dispatch: l } = dm(a, {
		mounted: {
			UNMOUNT: "unmounted",
			ANIMATION_OUT: "unmountSuspended"
		},
		unmountSuspended: {
			MOUNT: "mounted",
			ANIMATION_END: "unmounted"
		},
		unmounted: { MOUNT: "mounted" }
	}), u = (e) => {
		if (Qf) {
			let n = new CustomEvent(e, {
				bubbles: !1,
				cancelable: !1
			});
			t.value?.dispatchEvent(n);
		}
	};
	R(e, async (e, i) => {
		let a = i !== e;
		if (await Fn(), a) {
			let a = r.value, o = gm(t.value);
			e ? (l("MOUNT"), u("enter"), o === "none" && u("after-enter")) : o === "none" || o === "undefined" || n.value?.display === "none" ? (l("UNMOUNT"), u("leave"), u("after-leave")) : i && a !== o ? (l("ANIMATION_OUT"), u("leave")) : (l("UNMOUNT"), u("after-leave"));
		}
	}, { immediate: !0 });
	let d = (e) => {
		if (e.target !== t.value) return;
		let n = gm(t.value), r = n.includes(CSS.escape(e.animationName)), a = c.value === "mounted" ? "enter" : "leave";
		if (r && (u(`after-${a}`), l("ANIMATION_END"), !i.value)) {
			let e = t.value.style.animationFillMode;
			t.value.style.animationFillMode = "forwards", o = s?.setTimeout(() => {
				t.value?.style.animationFillMode === "forwards" && (t.value.style.animationFillMode = e);
			});
		}
		n === "none" && l("ANIMATION_END");
	}, f = (e) => {
		e.target === t.value && (r.value = gm(t.value));
	}, p = R(t, (e, t) => {
		e ? (n.value = getComputedStyle(e), e.addEventListener("animationstart", f), e.addEventListener("animationcancel", d), e.addEventListener("animationend", d)) : (l("ANIMATION_END"), o !== void 0 && s?.clearTimeout(o), t?.removeEventListener("animationstart", f), t?.removeEventListener("animationcancel", d), t?.removeEventListener("animationend", d));
	}, { immediate: !0 }), m = R(c, () => {
		let e = gm(t.value);
		r.value = c.value === "mounted" ? e : "none";
	});
	return Ur(() => {
		p(), m(), t.value && (t.value.removeEventListener("animationstart", f), t.value.removeEventListener("animationcancel", d), t.value.removeEventListener("animationend", d)), o !== void 0 && s?.clearTimeout(o);
	}), { isPresent: X(() => ["mounted", "unmountSuspended"].includes(c.value)) };
}
function gm(e) {
	return e && getComputedStyle(e).animationName || "none";
}
// node_modules/.pnpm/reka-ui@2.11.0_vue@3.5.42_typescript@6.0.3_/node_modules/reka-ui/dist/Presence/Presence.js
var _m = /*#__PURE__*/ z({
	name: "Presence",
	props: {
		present: {
			type: Boolean,
			required: !0
		},
		forceMount: { type: Boolean }
	},
	slots: {},
	setup(e, { slots: t, expose: n }) {
		let { present: r, forceMount: i } = /* @__PURE__ */ dn(e), a = /* @__PURE__ */ P(), { isPresent: o } = hm(r, a);
		n({ present: o });
		let s = t.default({ present: o.value });
		s = Cp(s || []);
		let c = Ga();
		if (s && s?.length > 1) {
			let e = c?.parent?.type.name ? `<${c.parent.type.name} />` : "component";
			throw Error([
				`Detected an invalid children for \`${e}\` for  \`Presence\` component.`,
				"",
				"Note: Presence works similarly to `v-if` directly, but it waits for animation/transition to finished before unmounting. So it expect only one direct child of valid VNode type.",
				"You can apply a few solutions:",
				["Provide a single child element so that `presence` directive attach correctly.", "Ensure the first child is an actual element instead of a raw text node or comment node."].map((e) => `  - ${e}`).join("\n")
			].join("\n"));
		}
		return () => i.value || r.value || o.value ? so(t.default({ present: o.value })[0], { ref: (e) => {
			let t = mp(e);
			return t?.hasAttribute === void 0 || (t?.hasAttribute("data-reka-popper-content-wrapper") ? a.value = t.firstElementChild : a.value = t), t;
		} }) : null;
	}
}), vm = /*#__PURE__*/ z({
	name: "PrimitiveSlot",
	inheritAttrs: !1,
	setup(e, { attrs: t, slots: n }) {
		return () => {
			if (!n.default) return null;
			let e = Cp(n.default()), r = e.findIndex((e) => e.type !== xa);
			if (r === -1) return e;
			let i = e[r];
			delete i.props?.ref;
			let a = i.props ? za(t, i.props) : t, o = Fa({
				...i,
				props: {}
			}, a);
			return e.length === 1 ? o : (e[r] = o, e);
		};
	}
}), ym = [
	"area",
	"img",
	"input"
], bm = /*#__PURE__*/ z({
	name: "Primitive",
	inheritAttrs: !1,
	props: {
		asChild: {
			type: Boolean,
			default: !1
		},
		as: {
			type: [String, Object],
			default: "div"
		}
	},
	setup(e, { attrs: t, slots: n }) {
		let r = e.asChild ? "template" : e.as;
		return typeof r == "string" && ym.includes(r) ? () => so(r, t) : r === "template" ? () => so(vm, t, { default: n.default }) : () => so(e.as, t, { default: n.default });
	}
});
// node_modules/.pnpm/reka-ui@2.11.0_vue@3.5.42_typescript@6.0.3_/node_modules/reka-ui/dist/Primitive/usePrimitiveElement.js
function xm() {
	let e = /* @__PURE__ */ P();
	return {
		primitiveElement: e,
		currentElement: X(() => ["#text", "#comment"].includes(e.value?.$el.nodeName) ? e.value?.$el.nextElementSibling : mp(e))
	};
}
// node_modules/.pnpm/reka-ui@2.11.0_vue@3.5.42_typescript@6.0.3_/node_modules/reka-ui/dist/DismissableLayer/utils.js
var Sm = "dismissableLayer.pointerDownOutside", Cm = "dismissableLayer.focusOutside";
function wm(e) {
	if (typeof e != "object" || !e) return !1;
	let t = e.ownerDocument?.defaultView;
	return typeof Element < "u" && e instanceof Element || !!t && e instanceof t.Element;
}
function Tm(e, t) {
	if (!wm(t)) return !1;
	if (e.contains(t)) return !0;
	let n = t.closest("[data-dismissable-layer]"), r = e.dataset.dismissableLayer === "" ? e : e.querySelector("[data-dismissable-layer]"), i = Array.from(e.ownerDocument.querySelectorAll("[data-dismissable-layer]"));
	return !!(n && (r === n || i.indexOf(r) < i.indexOf(n)));
}
function Em(e, t, n = !0) {
	let r = /* @__PURE__ */ P(!1), i = /* @__PURE__ */ P(() => {});
	return $n((a) => {
		if (!Qf || !on(n)) return;
		let o = t?.value?.ownerDocument ?? globalThis.document, s = async (n) => {
			let a = n.target;
			if (t?.value && a) {
				if (Tm(t.value, a)) o.removeEventListener("click", i.value), r.value = !1;
				else {
					if (n.target && !r.value) {
						let t = { originalEvent: n };
						function r() {
							qf(Sm, e, t);
						}
						n.pointerType === "touch" ? (o.removeEventListener("click", i.value), i.value = r, o.addEventListener("click", i.value, { once: !0 })) : r();
					} else o.removeEventListener("click", i.value);
					r.value = !1;
				}
			}
		}, c = window.setTimeout(() => {
			o.addEventListener("pointerdown", s);
		}, 0);
		a(() => {
			window.clearTimeout(c), o.removeEventListener("pointerdown", s), o.removeEventListener("click", i.value);
		});
	}), { onPointerDownCapture: () => {
		on(n) && (r.value = !0);
	} };
}
function Dm(e, t, n = !0) {
	let r = /* @__PURE__ */ P(!1);
	return $n((i) => {
		if (!Qf || !on(n)) return;
		let a = t?.value?.ownerDocument ?? globalThis.document, o = async (n) => {
			if (!t?.value) return;
			await Fn(), await Fn();
			let i = n.target;
			t.value && i && !Tm(t.value, i) && n.target && !r.value && qf(Cm, e, { originalEvent: n });
		};
		a.addEventListener("focusin", o), i(() => a.removeEventListener("focusin", o));
	}), {
		onFocusCapture: () => {
			on(n) && (r.value = !0);
		},
		onBlurCapture: () => {
			on(n) && (r.value = !1);
		}
	};
}
// node_modules/.pnpm/reka-ui@2.11.0_vue@3.5.42_typescript@6.0.3_/node_modules/reka-ui/dist/DismissableLayer/context.js
var Om = /*#__PURE__*/ Ht({
	layersRoot: /* @__PURE__ */ new Set(),
	layersWithOutsidePointerEventsDisabled: /* @__PURE__ */ new Set(),
	branches: /* @__PURE__ */ new Set()
}), km = /* @__PURE__ */ z({
	__name: "DismissableLayer",
	props: {
		disableOutsidePointerEvents: {
			type: Boolean,
			required: !1,
			default: !1
		},
		asChild: {
			type: Boolean,
			required: !1
		},
		as: {
			type: null,
			required: !1
		},
		present: {
			type: Boolean,
			required: !1,
			default: !0
		}
	},
	emits: [
		"escapeKeyDown",
		"pointerDownOutside",
		"focusOutside",
		"interactOutside",
		"dismiss"
	],
	setup(e, { emit: t }) {
		let n = e, r = t, { forwardRef: i, currentElement: a } = Yp(), o = X(() => a.value?.ownerDocument ?? globalThis.document), s = X(() => Om.layersRoot), c = X(() => a.value ? Array.from(s.value).indexOf(a.value) : -1), l = X(() => Om.layersWithOutsidePointerEventsDisabled.size > 0), u = X(() => {
			let e = Array.from(s.value), [t] = [...Om.layersWithOutsidePointerEventsDisabled].slice(-1), n = e.indexOf(t);
			return c.value >= n;
		}), d = Em(async (e) => {
			let t = [...Om.branches].some((t) => t?.contains(e.target));
			n.present && u.value && !t && (r("pointerDownOutside", e), r("interactOutside", e), await Fn(), e.defaultPrevented || r("dismiss"));
		}, a, () => n.present), f = Dm((e) => {
			let t = [...Om.branches].some((t) => t?.contains(e.target));
			n.present && !t && (r("focusOutside", e), r("interactOutside", e), e.defaultPrevented || r("dismiss"));
		}, a);
		return yp("Escape", (e) => {
			n.present && c.value === s.value.size - 1 && (r("escapeKeyDown", e), e.defaultPrevented || r("dismiss"));
		}, { target: () => o.value?.defaultView ?? globalThis.window }), R([
			a,
			() => n.disableOutsidePointerEvents,
			() => n.present
		], ([e, t, n], r, i) => {
			if (e && n && t) {
				let t = e.ownerDocument;
				Dp(t, e), Om.layersWithOutsidePointerEventsDisabled.add(e), i(() => {
					Om.layersWithOutsidePointerEventsDisabled.delete(e), Op(t, e);
				});
			}
		}, { immediate: !0 }), R([a, () => n.present], ([e, t], n, r) => {
			e && t && (s.value.add(e), r(() => {
				s.value.delete(e);
			}));
		}, { immediate: !0 }), $n((e) => {
			e(() => {
				a.value && (s.value.delete(a.value), Om.layersWithOutsidePointerEventsDisabled.delete(a.value));
			});
		}), (t, n) => (U(), G(I(bm), {
			ref: I(i),
			"as-child": e.asChild,
			as: e.as,
			"data-dismissable-layer": "",
			style: le({ pointerEvents: l.value ? u.value ? "auto" : "none" : void 0 }),
			onFocusCapture: I(f).onFocusCapture,
			onBlurCapture: I(f).onBlurCapture,
			onPointerdownCapture: I(d).onPointerDownCapture
		}, {
			default: L(() => [V(t.$slots, "default")]),
			_: 3
		}, 8, [
			"as-child",
			"as",
			"style",
			"onFocusCapture",
			"onBlurCapture",
			"onPointerdownCapture"
		]));
	}
}), Am = Zf(() => /* @__PURE__ */ P([]));
function jm() {
	let e = Am();
	return {
		add(t) {
			let n = e.value[0];
			t !== n && n?.pause(), e.value = Mm(e.value, t), e.value.unshift(t);
		},
		remove(t) {
			e.value = Mm(e.value, t), e.value[0]?.resume();
		}
	};
}
function Mm(e, t) {
	let n = [...e], r = n.indexOf(t);
	return r !== -1 && n.splice(r, 1), n;
}
// node_modules/.pnpm/reka-ui@2.11.0_vue@3.5.42_typescript@6.0.3_/node_modules/reka-ui/dist/FocusScope/utils.js
var Nm = "focusScope.autoFocusOnMount", Pm = "focusScope.autoFocusOnUnmount", Fm = {
	bubbles: !1,
	cancelable: !0
};
function Im(e, t) {
	let n = t;
	for (; n;) {
		if (e.contains(n)) return !0;
		n = n.getRootNode().host ?? null;
	}
	return !1;
}
function Lm(e, { select: t = !1 } = {}) {
	let n = Kf();
	for (let r of e) if (Um(r, { select: t }), Kf() !== n) return !0;
}
function Rm(e) {
	let t = zm(e);
	return [Bm(t, e), Bm(t.reverse(), e)];
}
function zm(e) {
	let t = [], n = document.createTreeWalker(e, NodeFilter.SHOW_ELEMENT, { acceptNode: (e) => {
		let t = e.tagName === "INPUT" && e.type === "hidden";
		return e.disabled || e.hidden || t ? NodeFilter.FILTER_SKIP : e.tabIndex >= 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
	} });
	for (; n.nextNode();) t.push(n.currentNode);
	return t.sort((e, t) => e.tabIndex === t.tabIndex ? 0 : e.tabIndex === 0 ? 1 : t.tabIndex === 0 ? -1 : e.tabIndex - t.tabIndex);
}
function Bm(e, t) {
	for (let n of e) if (!Vm(n, { upTo: t })) return n;
}
function Vm(e, { upTo: t }) {
	if (getComputedStyle(e).visibility === "hidden") return !0;
	for (; e;) {
		if (t !== void 0 && e === t) return !1;
		if (getComputedStyle(e).display === "none") return !0;
		e = e.parentElement;
	}
	return !1;
}
function Hm(e) {
	return e instanceof HTMLInputElement && "select" in e;
}
function Um(e, { select: t = !1 } = {}) {
	if (e && e.focus) {
		let n = Kf();
		e.focus({ preventScroll: !0 }), e !== n && Hm(e) && t && e.select();
	}
}
// node_modules/.pnpm/reka-ui@2.11.0_vue@3.5.42_typescript@6.0.3_/node_modules/reka-ui/dist/FocusScope/FocusScope.js
var Wm = /* @__PURE__ */ z({
	__name: "FocusScope",
	props: {
		loop: {
			type: Boolean,
			required: !1,
			default: !1
		},
		trapped: {
			type: Boolean,
			required: !1,
			default: !1
		},
		present: {
			type: Boolean,
			required: !1,
			default: !0
		},
		asChild: {
			type: Boolean,
			required: !1
		},
		as: {
			type: null,
			required: !1
		}
	},
	emits: ["mountAutoFocus", "unmountAutoFocus"],
	setup(e, { emit: t }) {
		let n = e, r = t, { currentRef: i, currentElement: a } = Yp(), o = /* @__PURE__ */ P(null), s = jm(), c = /*#__PURE__*/ Ht({
			paused: !1,
			pause() {
				this.paused = !0;
			},
			resume() {
				this.paused = !1;
			}
		});
		$n((e) => {
			if (!Qf) return;
			let t = a.value;
			if (!n.trapped) return;
			let r = t?.ownerDocument ?? document, i = t ? t.getRootNode() : r;
			function s(e) {
				if (c.paused || !t) return;
				let n = e.target;
				t.contains(n) ? o.value = n : Um(o.value, { select: !0 });
			}
			function l(e) {
				if (c.paused || !t) return;
				let n = e.relatedTarget;
				n !== null && (t.contains(n) || Um(o.value, { select: !0 }));
			}
			function u(e) {
				let n = o.value;
				if (n === null || !e.some((e) => e.removedNodes.length > 0)) return;
				let r = Kf();
				r && t.contains(r) || t.contains(n) || Um(t);
			}
			function d(e) {
				if (c.paused || !t) return;
				let n = e.composedPath()[0];
				Im(t, n) || Um(o.value, { select: !0 });
			}
			i.addEventListener("focusin", s), i.addEventListener("focusout", l), i !== r && r.addEventListener("focusin", d);
			let f = new MutationObserver(u);
			t && f.observe(t, {
				childList: !0,
				subtree: !0
			}), e(() => {
				i.removeEventListener("focusin", s), i.removeEventListener("focusout", l), i !== r && r.removeEventListener("focusin", d), f.disconnect();
			});
		});
		function l(e, t) {
			let n = new CustomEvent(Nm, Fm), i = (e) => r("mountAutoFocus", e);
			e.addEventListener(Nm, i), e.dispatchEvent(n), e.removeEventListener(Nm, i), n.defaultPrevented || (Lm(zm(e), { select: !0 }), Kf() === t && Um(e));
		}
		$n(async (e) => {
			let t = a.value;
			if (await Fn(), !t) return;
			n.present !== !1 && s.add(c);
			let i = Kf();
			!t.contains(i) && n.present !== !1 && l(t, i), e(() => {
				let e = new CustomEvent(Pm, Fm), n = (e) => {
					r("unmountAutoFocus", e);
				};
				t.addEventListener(Pm, n), t.dispatchEvent(e), t.setAttribute("data-focus-scope-unmounting", ""), setTimeout(() => {
					e.defaultPrevented || Um(i ?? document.body, { select: !0 }), t.removeEventListener(Pm, n), s.remove(c), t.removeAttribute("data-focus-scope-unmounting");
				}, 0);
			});
		}), R(() => n.present, async (e, t) => {
			if (!Qf) return;
			if (e === !1 && t === !0) {
				s.remove(c);
				return;
			}
			if (e !== !0 || t !== !1) return;
			s.add(c), await Fn();
			let n = a.value;
			if (!n) return;
			let r = Kf();
			n.contains(r) || l(n, r);
		});
		function u(e) {
			if (!n.loop && !n.trapped || c.paused) return;
			let t = e.key === "Tab" && !e.altKey && !e.ctrlKey && !e.metaKey, r = Kf();
			if (t && r) {
				let t = e.currentTarget, [i, a] = Rm(t);
				i && a ? !e.shiftKey && r === a ? (e.preventDefault(), n.loop && Um(i, { select: !0 })) : e.shiftKey && r === i && (e.preventDefault(), n.loop && Um(a, { select: !0 })) : r === t && e.preventDefault();
			}
		}
		return (t, n) => (U(), G(I(bm), {
			ref_key: "currentRef",
			ref: i,
			tabindex: "-1",
			"as-child": e.asChild,
			as: e.as,
			onKeydown: u
		}, {
			default: L(() => [V(t.$slots, "default")]),
			_: 3
		}, 8, ["as-child", "as"]));
	}
}), Gm = ["Enter", " "], Km = [
	"ArrowDown",
	"PageUp",
	"Home"
], qm = [
	"ArrowUp",
	"PageDown",
	"End"
];
[...Km, ...qm], [...Gm], [...Gm];
function Jm(e) {
	let t = Kf();
	for (let n of e) if (n === t || (n.focus(), Kf() !== t)) return;
}
// node_modules/.pnpm/reka-ui@2.11.0_vue@3.5.42_typescript@6.0.3_/node_modules/reka-ui/dist/Teleport/Teleport.js
var Ym = /* @__PURE__ */ z({
	__name: "Teleport",
	props: {
		to: {
			type: null,
			required: !1
		},
		disabled: {
			type: Boolean,
			required: !1
		},
		defer: {
			type: Boolean,
			required: !1
		},
		forceMount: {
			type: Boolean,
			required: !1
		}
	},
	setup(e) {
		let t = e, n = wp({}), r = X(() => t.to ?? n.teleportTo?.value ?? "body"), i = gp();
		return (t, n) => I(i) || e.forceMount ? (U(), G(gr, {
			key: 0,
			to: r.value,
			disabled: e.disabled,
			defer: e.defer
		}, [V(t.$slots, "default")], 8, [
			"to",
			"disabled",
			"defer"
		])) : Y("v-if", !0);
	}
}), Xm = "data-reka-collection-item";
function Zm(e = {}) {
	let { key: t = "", isProvider: n = !1 } = e, r = `${t}CollectionProvider`, i;
	n ? (i = {
		collectionRef: /* @__PURE__ */ P(),
		itemMap: /* @__PURE__ */ P(/* @__PURE__ */ new Map())
	}, Yn(r, i)) : i = Xn(r);
	let a = (e, t = !1) => {
		if (!i.collectionRef.value) return;
		let n = i.itemMap.value.get(e);
		return n && (t || n.ref.dataset.disabled !== "") ? n : void 0;
	}, o = (e = !1) => {
		let t = i.collectionRef.value;
		if (!t) return [];
		let n = Array.from(t.querySelectorAll(`[${Xm}]`)), r = new Map(n.map((e, t) => [e, t])), a = Array.from(i.itemMap.value.values()).sort((e, t) => (r.get(e.ref) ?? -1) - (r.get(t.ref) ?? -1));
		return e ? a : a.filter((e) => e.ref.dataset.disabled !== "");
	}, s = /*#__PURE__*/ z({
		name: "CollectionSlot",
		inheritAttrs: !1,
		setup(e, { slots: t, attrs: n }) {
			let { primitiveElement: r, currentElement: a } = xm();
			return R(a, () => {
				i.collectionRef.value = a.value;
			}), () => so(vm, {
				ref: r,
				...n
			}, t);
		}
	}), c = /*#__PURE__*/ z({
		name: "CollectionItem",
		inheritAttrs: !1,
		props: { value: { validator: () => !0 } },
		setup(e, { slots: t, attrs: n }) {
			let { primitiveElement: r, currentElement: a } = xm();
			return $n((t) => {
				if (a.value) {
					let n = Qt(a.value);
					i.itemMap.value.set(n, {
						ref: a.value,
						value: e.value
					}), t(() => i.itemMap.value.delete(n));
				}
			}), () => so(vm, {
				...n,
				[Xm]: "",
				ref: r
			}, t);
		}
	});
	return {
		getItems: o,
		getItem: a,
		reactiveItems: X(() => Array.from(i.itemMap.value.values())),
		itemMapSize: X(() => i.itemMap.value.size),
		CollectionSlot: s,
		CollectionItem: c
	};
}
// node_modules/.pnpm/reka-ui@2.11.0_vue@3.5.42_typescript@6.0.3_/node_modules/reka-ui/dist/VisuallyHidden/VisuallyHidden.js
var Qm = /* @__PURE__ */ z({
	__name: "VisuallyHidden",
	props: {
		feature: {
			type: String,
			required: !1,
			default: "focusable"
		},
		asChild: {
			type: Boolean,
			required: !1
		},
		as: {
			type: null,
			required: !1,
			default: "span"
		}
	},
	setup(e) {
		return (t, n) => (U(), G(I(bm), {
			as: e.as,
			"as-child": e.asChild,
			"aria-hidden": e.feature === "fully-hidden" ? "true" : void 0,
			"data-hidden": e.feature === "fully-hidden" ? "" : void 0,
			tabindex: e.feature === "fully-hidden" ? "-1" : void 0,
			style: {
				position: "absolute",
				border: 0,
				width: "1px",
				height: "1px",
				padding: 0,
				margin: "-1px",
				overflow: "hidden",
				clip: "rect(0, 0, 0, 0)",
				clipPath: "inset(50%)",
				whiteSpace: "nowrap",
				wordWrap: "normal",
				top: "-1px",
				left: "-1px"
			}
		}, {
			default: L(() => [V(t.$slots, "default")]),
			_: 3
		}, 8, [
			"as",
			"as-child",
			"aria-hidden",
			"data-hidden",
			"tabindex"
		]));
	}
}), $m = /* @__PURE__ */ z({
	inheritAttrs: !1,
	__name: "VisuallyHiddenInputBubble",
	props: {
		name: {
			type: String,
			required: !0
		},
		value: {
			type: null,
			required: !0
		},
		checked: {
			type: Boolean,
			required: !1,
			default: void 0
		},
		required: {
			type: Boolean,
			required: !1
		},
		disabled: {
			type: Boolean,
			required: !1
		},
		feature: {
			type: String,
			required: !1,
			default: "fully-hidden"
		}
	},
	setup(e) {
		let t = e, { primitiveElement: n, currentElement: r } = xm();
		return R(X(() => t.checked ?? t.value), (e, t) => {
			if (!r.value) return;
			let n = r.value, i = window.HTMLInputElement.prototype, a = Object.getOwnPropertyDescriptor(i, "value").set;
			if (a && e !== t) {
				let t = new Event("input", { bubbles: !0 }), r = new Event("change", { bubbles: !0 });
				a.call(n, e), n.dispatchEvent(t), n.dispatchEvent(r);
			}
		}), (e, r) => (U(), G(Qm, za({
			ref_key: "primitiveElement",
			ref: n
		}, {
			...t,
			...e.$attrs
		}, { as: "input" }), null, 16));
	}
}), eh = /* @__PURE__ */ z({
	inheritAttrs: !1,
	__name: "VisuallyHiddenInput",
	props: {
		name: {
			type: String,
			required: !0
		},
		value: {
			type: null,
			required: !0
		},
		checked: {
			type: Boolean,
			required: !1,
			default: void 0
		},
		required: {
			type: Boolean,
			required: !1
		},
		disabled: {
			type: Boolean,
			required: !1
		},
		feature: {
			type: String,
			required: !1,
			default: "fully-hidden"
		}
	},
	setup(e) {
		let t = e, n = X(() => typeof t.value == "object" && Array.isArray(t.value) && t.value.length === 0 && t.required), r = X(() => typeof t.value == "string" || typeof t.value == "number" || typeof t.value == "boolean" || t.value === null || t.value === void 0 ? [{
			name: t.name,
			value: t.value
		}] : typeof t.value == "object" && Array.isArray(t.value) ? t.value.flatMap((e, n) => typeof e == "object" ? Object.entries(e).map(([e, r]) => ({
			name: `${t.name}[${n}][${e}]`,
			value: r
		})) : {
			name: `${t.name}[${n}]`,
			value: e
		}) : t.value !== null && typeof t.value == "object" && !Array.isArray(t.value) ? Object.entries(t.value).map(([e, n]) => ({
			name: `${t.name}[${e}]`,
			value: n
		})) : []);
		return (i, a) => (U(), W(H, null, [Y(" We render single input if it's required "), n.value ? (U(), G($m, za({ key: e.name }, {
			...t,
			...i.$attrs
		}, {
			name: e.name,
			value: e.value
		}), null, 16, ["name", "value"])) : (U(!0), W(H, { key: 1 }, B(r.value, (e) => (U(), G($m, za({ key: e.name }, { ref_for: !0 }, {
			...t,
			...i.$attrs
		}, {
			name: e.name,
			value: e.value
		}), null, 16, ["name", "value"]))), 128))], 2112));
	}
});
// node_modules/.pnpm/reka-ui@2.11.0_vue@3.5.42_typescript@6.0.3_/node_modules/reka-ui/dist/Listbox/utils.js
function th(e, t, n) {
	return e === void 0 ? !1 : Array.isArray(e) ? e.some((e) => nh(e, t, n)) : nh(e, t, n);
}
function nh(e, t, n) {
	return e === void 0 || t === void 0 ? !1 : typeof e == "string" ? e === t : typeof n == "function" ? n(e, t) : typeof n == "string" ? e?.[n] === t?.[n] : Hf(e, t);
}
// node_modules/.pnpm/reka-ui@2.11.0_vue@3.5.42_typescript@6.0.3_/node_modules/reka-ui/dist/RovingFocus/utils.js
var rh = {
	ArrowLeft: "prev",
	ArrowUp: "prev",
	ArrowRight: "next",
	ArrowDown: "next",
	PageUp: "first",
	Home: "first",
	PageDown: "last",
	End: "last"
};
function ih(e, t) {
	return t === "rtl" ? e === "ArrowLeft" ? "ArrowRight" : e === "ArrowRight" ? "ArrowLeft" : e : e;
}
function ah(e, t, n) {
	let r = ih(e.key, n);
	if (!(t === "vertical" && ["ArrowLeft", "ArrowRight"].includes(r)) && !(t === "horizontal" && ["ArrowUp", "ArrowDown"].includes(r))) return rh[r];
}
// node_modules/.pnpm/reka-ui@2.11.0_vue@3.5.42_typescript@6.0.3_/node_modules/reka-ui/dist/Listbox/ListboxRoot.js
var [oh, sh] = /*#__PURE__*/ Gf("ListboxRoot"), [ch, lh] = /*#__PURE__*/ Gf("ListboxHighlightScroll"), uh = /* @__PURE__ */ z({
	__name: "ListboxRoot",
	props: {
		modelValue: {
			type: null,
			required: !1
		},
		defaultValue: {
			type: null,
			required: !1
		},
		multiple: {
			type: Boolean,
			required: !1
		},
		orientation: {
			type: String,
			required: !1,
			default: "vertical"
		},
		dir: {
			type: String,
			required: !1
		},
		disabled: {
			type: Boolean,
			required: !1
		},
		selectionBehavior: {
			type: String,
			required: !1,
			default: "toggle"
		},
		highlightOnHover: {
			type: Boolean,
			required: !1
		},
		loop: {
			type: Boolean,
			required: !1
		},
		by: {
			type: [String, Function],
			required: !1
		},
		asChild: {
			type: Boolean,
			required: !1
		},
		as: {
			type: null,
			required: !1
		},
		name: {
			type: String,
			required: !1
		},
		required: {
			type: Boolean,
			required: !1
		}
	},
	emits: [
		"update:modelValue",
		"highlight",
		"entryFocus",
		"leave"
	],
	setup(e, { expose: t, emit: n }) {
		let r = e, i = n, { multiple: a, highlightOnHover: o, loop: s, orientation: c, disabled: l, selectionBehavior: u, dir: d } = /* @__PURE__ */ dn(r), { getItems: f, getItem: p } = Zm({ isProvider: !0 }), { handleTypeaheadSearch: m } = fm(), { primitiveElement: h, currentElement: g } = xm(), _ = lm(), v = Hp(d), y = ch(null);
		lh({
			suppressHighlightScroll: /* @__PURE__ */ P(!1),
			onHighlightScrollRequest: () => {}
		});
		let b = Jp(g), x = /* @__PURE__ */ P(), S = /* @__PURE__ */ P(!1), C = /* @__PURE__ */ P(!0), w = Sp(r, "modelValue", i, {
			defaultValue: r.defaultValue ?? (a.value ? [] : void 0),
			passive: r.modelValue === void 0,
			deep: !0
		});
		function T(e) {
			if (S.value = !0, r.multiple) {
				let t = Array.isArray(w.value) ? [...w.value] : [], n = t.findIndex((t) => nh(t, e, r.by));
				r.selectionBehavior === "toggle" ? (n === -1 ? t.push(e) : t.splice(n, 1), w.value = t) : (w.value = [e], x.value = e);
			} else r.selectionBehavior === "toggle" && nh(w.value, e, r.by) ? w.value = void 0 : w.value = e;
			setTimeout(() => {
				S.value = !1;
			}, 1);
		}
		let E = /* @__PURE__ */ P(null), D = /* @__PURE__ */ P(null), O = /* @__PURE__ */ P(!1), k = /* @__PURE__ */ P(!1), A = Xf(), j = Xf(), ee = Xf();
		function te() {
			return f().map((e) => e.ref).filter((e) => e.dataset.disabled !== "");
		}
		function M(e, t = !0, n) {
			if (!e) return;
			E.value = e;
			let r = y?.suppressHighlightScroll.value ?? !1;
			(n ?? C.value) && (r ? E.value.focus({ preventScroll: !0 }) : E.value.focus()), r ? y?.onHighlightScrollRequest(t ? () => {
				let e = E.value;
				e?.isConnected && e.scrollIntoView({ block: "nearest" });
			} : void 0) : t && E.value.scrollIntoView({ block: "nearest" });
			let a = p(e);
			i("highlight", a);
		}
		function ne(e) {
			if (O.value) ee.trigger(e);
			else {
				let t = f().find((t) => nh(t.value, e, r.by));
				t && (E.value = t.ref, M(t.ref));
			}
		}
		function re(e) {
			if (E.value && E.value.isConnected) {
				if (e.ctrlKey || e.metaKey || e.altKey) return;
				e.preventDefault(), e.stopPropagation(), k.value || E.value.click();
			}
		}
		function ie(e) {
			if (C.value) {
				if (S.value = !0, O.value) j.trigger(e);
				else {
					let t = e.altKey || e.ctrlKey || e.metaKey;
					if (t && e.key === "a" && a.value) {
						let t = f(), n = t.map((e) => e.value);
						w.value = [...n], e.preventDefault();
						let r = t.at(-1);
						r && M(r.ref);
					} else if (!t) {
						let t = m(e.key, f());
						t && M(t);
					}
				}
				setTimeout(() => {
					S.value = !1;
				}, 1);
			}
		}
		function ae() {
			k.value = !0;
		}
		function oe() {
			Fn(() => {
				k.value = !1;
			});
		}
		function se() {
			Fn(() => {
				de(new KeyboardEvent("keydown", { key: "PageUp" }));
			});
		}
		function ce(e) {
			let t = E.value;
			t?.isConnected && (D.value = t), E.value = null, i("leave", e);
		}
		function le(e) {
			let t = new CustomEvent("listbox.entryFocus", {
				bubbles: !1,
				cancelable: !0
			});
			if (e.currentTarget?.dispatchEvent(t), i("entryFocus", t), !t.defaultPrevented) {
				if (D.value) M(D.value);
				else {
					let e = te()?.[0];
					M(e);
				}
			}
		}
		function ue(e) {
			let t = f(!0).map((e) => e.ref), n = e === "next" ? t.at(-1) : t[0];
			if (!n) return !1;
			let r = Number(n.getAttribute("aria-posinset")), i = Number(n.getAttribute("aria-setsize"));
			return e === "next" ? r === i : r === 1;
		}
		function de(e) {
			let t = ah(e, c.value, v.value);
			if (!t) return;
			let n = te();
			if (E.value) {
				if (t === "last") n.reverse();
				else if (t === "prev" || t === "next") {
					t === "prev" && n.reverse();
					let r = n.indexOf(E.value), i = s.value && r === n.length - 1;
					if (i && O.value) {
						if (ue(t)) {
							let n = t === "next" ? _.HOME : _.END;
							return j.trigger(new KeyboardEvent("keydown", {
								key: n,
								shiftKey: e.shiftKey
							}));
						}
						n = [];
					} else n = i ? n.slice(0, 1) : n.slice(r + 1);
				}
				fe(e, n[0]);
			}
			if (n.length) {
				let e = !E.value && t === "prev" ? n.length - 1 : 0;
				M(n[e]);
			}
			if (O.value) return j.trigger(e);
		}
		function fe(e, t) {
			if (!O.value && r.selectionBehavior === "replace" && a.value && Array.isArray(w.value) && (!e.altKey && !e.ctrlKey && !e.metaKey || e.shiftKey) && e.shiftKey) {
				let n = f().filter((e) => e.ref.dataset.disabled !== ""), r = n.find((e) => e.ref === t)?.value;
				if (e.key === _.END ? r = n.at(-1)?.value : e.key === _.HOME && (r = n[0]?.value), !r || !x.value) return;
				let i = Uf(n.map((e) => e.value), x.value, r);
				w.value = i;
			}
		}
		async function pe(e, t = !0) {
			if (Qf) {
				if (await Fn(), O.value) A.trigger({
					event: e,
					scroll: t
				});
				else {
					let e = te(), n = e.find((e) => e.dataset.state === "checked"), r = t ? void 0 : !1;
					n ? M(n, t, r) : e.length && M(e[0], t, r);
				}
			}
		}
		let me = !1;
		return R(w, () => {
			if (!S.value) {
				let e = me;
				me = !0, Fn(() => {
					pe(void 0, e);
				});
			}
		}, {
			immediate: !0,
			deep: !0
		}), t({
			highlightedElement: E,
			highlightItem: ne,
			highlightFirstItem: se,
			highlightSelected: pe,
			getItems: f
		}), sh({
			modelValue: w,
			onValueChange: T,
			multiple: a,
			orientation: c,
			dir: v,
			disabled: l,
			highlightOnHover: o,
			loop: s,
			highlightedElement: E,
			isVirtual: O,
			virtualFocusHook: A,
			virtualKeydownHook: j,
			virtualHighlightHook: ee,
			by: r.by,
			firstValue: x,
			selectionBehavior: u,
			focusable: C,
			onLeave: ce,
			onEnter: le,
			changeHighlight: M,
			onKeydownEnter: re,
			onKeydownNavigation: de,
			onKeydownTypeAhead: ie,
			onCompositionStart: ae,
			onCompositionEnd: oe,
			highlightFirstItem: se
		}), (t, n) => (U(), G(I(bm), {
			ref_key: "primitiveElement",
			ref: h,
			as: e.as,
			"as-child": e.asChild,
			dir: I(v),
			"data-disabled": I(l) ? "" : void 0,
			onPointerleave: ce,
			onFocusout: n[0] ||= async (e) => {
				let t = e.relatedTarget || e.target;
				await Fn(), E.value && I(g) && !I(g).contains(t) && ce(e);
			}
		}, {
			default: L(() => [V(t.$slots, "default", { modelValue: I(w) }), I(b) && e.name ? (U(), G(I(eh), {
				key: 0,
				name: e.name,
				value: I(w),
				disabled: I(l),
				required: e.required
			}, null, 8, [
				"name",
				"value",
				"disabled",
				"required"
			])) : Y("v-if", !0)]),
			_: 3
		}, 8, [
			"as",
			"as-child",
			"dir",
			"data-disabled"
		]));
	}
}), dh = /* @__PURE__ */ z({
	__name: "ListboxContent",
	props: {
		asChild: {
			type: Boolean,
			required: !1
		},
		as: {
			type: null,
			required: !1
		}
	},
	setup(e) {
		let { CollectionSlot: t } = Zm(), n = oh(), r = up(!1, 10);
		return (i, a) => (U(), G(I(t), null, {
			default: L(() => [q(I(bm), {
				role: "listbox",
				as: e.as,
				"as-child": e.asChild,
				tabindex: I(n).focusable.value ? I(n).highlightedElement.value ? "-1" : "0" : "-1",
				"aria-orientation": I(n).orientation.value,
				"aria-multiselectable": !!I(n).multiple.value,
				"data-orientation": I(n).orientation.value,
				onMousedown: a[0] ||= hs((e) => r.value = !0, ["left"]),
				onFocus: a[1] ||= (e) => {
					I(r) || I(n).onEnter(e);
				},
				onKeydown: [
					a[2] ||= _s((e) => {
						(I(n).orientation.value !== "vertical" || e.key !== "ArrowLeft" && e.key !== "ArrowRight") && (I(n).orientation.value !== "horizontal" || e.key !== "ArrowUp" && e.key !== "ArrowDown") && (e.preventDefault(), I(n).focusable.value && I(n).onKeydownNavigation(e));
					}, [
						"down",
						"up",
						"left",
						"right",
						"home",
						"end"
					]),
					_s(I(n).onKeydownEnter, ["enter"]),
					I(n).onKeydownTypeAhead
				]
			}, {
				default: L(() => [V(i.$slots, "default")]),
				_: 3
			}, 8, [
				"as",
				"as-child",
				"tabindex",
				"aria-orientation",
				"aria-multiselectable",
				"data-orientation",
				"onKeydown"
			])]),
			_: 3
		}));
	}
}), fh = /* @__PURE__ */ z({
	__name: "ListboxFilter",
	props: {
		modelValue: {
			type: String,
			required: !1
		},
		autoFocus: {
			type: Boolean,
			required: !1
		},
		disabled: {
			type: Boolean,
			required: !1
		},
		asChild: {
			type: Boolean,
			required: !1
		},
		as: {
			type: null,
			required: !1,
			default: "input"
		}
	},
	emits: ["update:modelValue"],
	setup(e, { emit: t }) {
		let n = e, r = Sp(n, "modelValue", t, {
			defaultValue: "",
			passive: n.modelValue === void 0
		}), i = oh(), { primitiveElement: a, currentElement: o } = xm(), s = X(() => n.disabled || i.disabled.value || !1), c = /* @__PURE__ */ P();
		tr(() => c.value = i.highlightedElement.value?.id), zr(() => {
			i.focusable.value = !1, setTimeout(() => {
				n.autoFocus && o.value?.focus();
			}, 1);
		}), Ur(() => {
			i.focusable.value = !0;
		});
		let { isComposing: l, shouldDeferInput: u, handleCompositionStart: d, handleCompositionUpdate: f, handleCompositionEnd: p } = Vp((e) => {
			r.value = e.target.value, i.onCompositionEnd(), i.highlightFirstItem();
		});
		function m() {
			i.onCompositionStart(), d();
		}
		function h(e) {
			u.value || (r.value = e.target.value, i.highlightFirstItem());
		}
		function g(e) {
			l.value || (e.preventDefault(), i.onKeydownNavigation(e));
		}
		function _(e) {
			l.value || i.onKeydownEnter(e);
		}
		return (t, n) => (U(), G(I(bm), {
			ref_key: "primitiveElement",
			ref: a,
			as: e.as,
			"as-child": e.asChild,
			value: I(r),
			disabled: s.value ? "" : void 0,
			"data-disabled": s.value ? "" : void 0,
			"aria-disabled": s.value ?? void 0,
			"aria-activedescendant": c.value,
			type: "text",
			onKeydown: [_s(g, [
				"down",
				"up",
				"home",
				"end"
			]), _s(_, ["enter"])],
			onInput: h,
			onCompositionstart: m,
			onCompositionupdate: I(f),
			onCompositionend: I(p)
		}, {
			default: L(() => [V(t.$slots, "default", { modelValue: I(r) })]),
			_: 3
		}, 8, [
			"as",
			"as-child",
			"value",
			"disabled",
			"data-disabled",
			"aria-disabled",
			"aria-activedescendant",
			"onCompositionupdate",
			"onCompositionend"
		]));
	}
}), ph = "listbox.select", [mh, hh] = /*#__PURE__*/ Gf("ListboxItem"), gh = /* @__PURE__ */ z({
	__name: "ListboxItem",
	props: {
		value: {
			type: null,
			required: !0
		},
		disabled: {
			type: Boolean,
			required: !1
		},
		asChild: {
			type: Boolean,
			required: !1
		},
		as: {
			type: null,
			required: !1,
			default: "div"
		}
	},
	emits: ["select"],
	setup(e, { emit: t }) {
		let n = e, r = t, i = cm(void 0, "reka-listbox-item"), { CollectionItem: a } = Zm(), { forwardRef: o, currentElement: s } = Yp(), c = oh(), l = X(() => s.value != null && s.value === c.highlightedElement.value), u = X(() => th(c.modelValue.value, n.value, c.by)), d = X(() => c.disabled.value || n.disabled);
		async function f(e) {
			r("select", e), e?.defaultPrevented || !d.value && e && (c.onValueChange(n.value), c.changeHighlight(s.value));
		}
		function p(e) {
			qf(ph, f, {
				originalEvent: e,
				value: n.value
			});
		}
		return hh({ isSelected: u }), (t, n) => (U(), G(I(a), { value: e.value }, {
			default: L(() => [co([
				l.value,
				u.value,
				d.value,
				I(c).focusable.value,
				...Object.entries(t.$attrs).flat()
			], () => q(I(bm), za({ id: I(i) }, t.$attrs, {
				ref: I(o),
				role: "option",
				tabindex: I(c).focusable.value ? l.value ? "0" : "-1" : -1,
				"aria-selected": u.value,
				as: e.as,
				"as-child": e.asChild,
				disabled: d.value ? "" : void 0,
				"data-disabled": d.value ? "" : void 0,
				"data-highlighted": l.value ? "" : void 0,
				"data-state": u.value ? "checked" : "unchecked",
				onClick: p,
				onKeydown: _s(hs(p, ["prevent"]), ["space"]),
				onPointermove: n[0] ||= () => {
					I(c).highlightedElement.value !== I(s) && I(c).highlightOnHover.value && I(c).changeHighlight(I(s), !1, !1);
				}
			}), {
				default: L(() => [V(t.$slots, "default", { selected: u.value })]),
				_: 3
			}, 16, [
				"id",
				"tabindex",
				"aria-selected",
				"as",
				"as-child",
				"disabled",
				"data-disabled",
				"data-highlighted",
				"data-state",
				"onKeydown"
			]), n, 1)]),
			_: 3
		}, 8, ["value"]));
	}
}), _h = /* @__PURE__ */ z({
	__name: "ListboxItemIndicator",
	props: {
		forceMount: {
			type: Boolean,
			required: !1
		},
		asChild: {
			type: Boolean,
			required: !1
		},
		as: {
			type: null,
			required: !1,
			default: "span"
		}
	},
	setup(e) {
		let { forwardRef: t } = Yp(), n = mh();
		return (r, i) => (U(), G(I(_m), { present: e.forceMount || I(n).isSelected.value }, {
			default: L(() => [q(I(bm), {
				ref: I(t),
				"aria-hidden": "true",
				"data-state": I(n).isSelected.value ? "checked" : "unchecked",
				as: e.as,
				"as-child": e.asChild
			}, {
				default: L(() => [V(r.$slots, "default")]),
				_: 3
			}, 8, [
				"data-state",
				"as",
				"as-child"
			])]),
			_: 3
		}, 8, ["present"]));
	}
}), [vh, yh] = /*#__PURE__*/ Gf("PopperRoot"), bh = /* @__PURE__ */ z({
	inheritAttrs: !1,
	__name: "PopperRoot",
	setup(e) {
		let t = /* @__PURE__ */ P();
		return yh({
			anchor: t,
			onAnchorChange: (e) => t.value = e
		}), (e, t) => V(e.$slots, "default");
	}
}), xh = /* @__PURE__ */ z({
	__name: "PopperAnchor",
	props: {
		reference: {
			type: null,
			required: !1
		},
		asChild: {
			type: Boolean,
			required: !1
		},
		as: {
			type: null,
			required: !1
		}
	},
	setup(e) {
		let t = e, { forwardRef: n, currentElement: r } = Yp(), i = vh();
		return er(() => {
			i.onAnchorChange(t.reference ?? r.value);
		}), (t, r) => (U(), G(I(bm), {
			ref: I(n),
			as: e.as,
			"as-child": e.asChild
		}, {
			default: L(() => [V(t.$slots, "default")]),
			_: 3
		}, 8, ["as", "as-child"]));
	}
});
// node_modules/.pnpm/reka-ui@2.11.0_vue@3.5.42_typescript@6.0.3_/node_modules/reka-ui/dist/Popper/utils.js
function Sh(e) {
	return e !== null;
}
function Ch(e) {
	return {
		name: "transformOrigin",
		options: e,
		fn(t) {
			let { placement: n, rects: r, middlewareData: i } = t, a = i.arrow?.centerOffset !== 0, o = a ? 0 : e.arrowWidth, s = a ? 0 : e.arrowHeight, [c, l] = wh(n), u = {
				start: e.dir === "rtl" ? "100%" : "0%",
				center: "50%",
				end: e.dir === "rtl" ? "0%" : "100%"
			}[l], d = {
				start: "0%",
				center: "50%",
				end: "100%"
			}[l], f = (i.arrow?.x ?? 0) + o / 2, p = (i.arrow?.y ?? 0) + s / 2, m = "", h = "";
			return c === "bottom" ? (m = a ? u : `${f}px`, h = `${-s}px`) : c === "top" ? (m = a ? u : `${f}px`, h = `${r.floating.height + s}px`) : c === "right" ? (m = `${-s}px`, h = a ? d : `${p}px`) : c === "left" && (m = `${r.floating.width + s}px`, h = a ? d : `${p}px`), { data: {
				x: m,
				y: h
			} };
		}
	};
}
function wh(e) {
	let [t, n = "center"] = e.split("-");
	return [t, n];
}
// node_modules/.pnpm/@floating-ui+utils@0.2.12/node_modules/@floating-ui/utils/dist/floating-ui.utils.mjs
var Th = [
	"top",
	"right",
	"bottom",
	"left"
], Eh = Math.min, Dh = Math.max, Oh = Math.round, kh = Math.floor, Ah = (e) => ({
	x: e,
	y: e
}), jh = {
	left: "right",
	right: "left",
	bottom: "top",
	top: "bottom"
};
function Mh(e, t, n) {
	return Dh(e, Eh(t, n));
}
function Nh(e, t) {
	return typeof e == "function" ? e(t) : e;
}
function Ph(e) {
	return e.split("-")[0];
}
function Fh(e) {
	return e.split("-")[1];
}
function Ih(e) {
	return e === "x" ? "y" : "x";
}
function Lh(e) {
	return e === "y" ? "height" : "width";
}
function Rh(e) {
	let t = e[0];
	return t === "t" || t === "b" ? "y" : "x";
}
function zh(e) {
	return Ih(Rh(e));
}
function Bh(e, t, n) {
	n === void 0 && (n = !1);
	let r = Fh(e), i = zh(e), a = Lh(i), o = i === "x" ? r === (n ? "end" : "start") ? "right" : "left" : r === "start" ? "bottom" : "top";
	return t.reference[a] > t.floating[a] && (o = Yh(o)), [o, Yh(o)];
}
function Vh(e) {
	let t = Yh(e);
	return [
		Hh(e),
		t,
		Hh(t)
	];
}
function Hh(e) {
	return e.includes("start") ? e.replace("start", "end") : e.replace("end", "start");
}
var Uh = ["left", "right"], Wh = ["right", "left"], Gh = ["top", "bottom"], Kh = ["bottom", "top"];
function qh(e, t, n) {
	switch (e) {
		case "top":
		case "bottom": return n ? t ? Wh : Uh : t ? Uh : Wh;
		case "left":
		case "right": return t ? Gh : Kh;
		default: return [];
	}
}
function Jh(e, t, n, r) {
	let i = Fh(e), a = qh(Ph(e), n === "start", r);
	return i && (a = a.map((e) => e + "-" + i), t && (a = a.concat(a.map(Hh)))), a;
}
function Yh(e) {
	let t = Ph(e);
	return jh[t] + e.slice(t.length);
}
function Xh(e) {
	return {
		top: e.top ?? 0,
		right: e.right ?? 0,
		bottom: e.bottom ?? 0,
		left: e.left ?? 0
	};
}
function Zh(e) {
	return typeof e == "number" ? {
		top: e,
		right: e,
		bottom: e,
		left: e
	} : Xh(e);
}
function Qh(e) {
	let { x: t, y: n, width: r, height: i } = e;
	return {
		width: r,
		height: i,
		top: n,
		left: t,
		right: t + r,
		bottom: n + i,
		x: t,
		y: n
	};
}
// node_modules/.pnpm/@floating-ui+core@1.8.0/node_modules/@floating-ui/core/dist/floating-ui.core.mjs
function $h(e, t, n) {
	let { reference: r, floating: i } = e, a = Rh(t), o = zh(t), s = Lh(o), c = Ph(t), l = a === "y", u = r.x + r.width / 2 - i.width / 2, d = r.y + r.height / 2 - i.height / 2, f = r[s] / 2 - i[s] / 2, p;
	switch (c) {
		case "top":
			p = {
				x: u,
				y: r.y - i.height
			};
			break;
		case "bottom":
			p = {
				x: u,
				y: r.y + r.height
			};
			break;
		case "right":
			p = {
				x: r.x + r.width,
				y: d
			};
			break;
		case "left":
			p = {
				x: r.x - i.width,
				y: d
			};
			break;
		default: p = {
			x: r.x,
			y: r.y
		};
	}
	let m = Fh(t);
	return m && (p[o] += f * (m === "end" ? 1 : -1) * (n && l ? -1 : 1)), p;
}
async function eg(e, t) {
	t === void 0 && (t = {});
	let { x: n, y: r, platform: i, rects: a, elements: o, strategy: s } = e, { boundary: c = "clippingAncestors", rootBoundary: l = "viewport", elementContext: u = "floating", altBoundary: d = !1, padding: f = 0 } = Nh(t, e), p = Zh(f), m = o[d ? u === "floating" ? "reference" : "floating" : u], h = Qh(await i.getClippingRect({
		element: await (i.isElement == null ? void 0 : i.isElement(m)) ?? !0 ? m : m.contextElement || await (i.getDocumentElement == null ? void 0 : i.getDocumentElement(o.floating)),
		boundary: c,
		rootBoundary: l,
		strategy: s
	})), g = u === "floating" ? {
		x: n,
		y: r,
		width: a.floating.width,
		height: a.floating.height
	} : a.reference, _ = await (i.getOffsetParent == null ? void 0 : i.getOffsetParent(o.floating)), v = await (i.isElement == null ? void 0 : i.isElement(_)) && await (i.getScale == null ? void 0 : i.getScale(_)) || {
		x: 1,
		y: 1
	}, y = Qh(i.convertOffsetParentRelativeRectToViewportRelativeRect ? await i.convertOffsetParentRelativeRectToViewportRelativeRect({
		elements: o,
		rect: g,
		offsetParent: _,
		strategy: s
	}) : g);
	return {
		top: (h.top - y.top + p.top) / v.y,
		bottom: (y.bottom - h.bottom + p.bottom) / v.y,
		left: (h.left - y.left + p.left) / v.x,
		right: (y.right - h.right + p.right) / v.x
	};
}
var tg = 50, ng = async (e, t, n) => {
	let { placement: r = "bottom", strategy: i = "absolute", middleware: a = [], platform: o } = n, s = o.detectOverflow ? o : {
		...o,
		detectOverflow: eg
	}, c = await (o.isRTL == null ? void 0 : o.isRTL(t)), l = await o.getElementRects({
		reference: e,
		floating: t,
		strategy: i
	}), { x: u, y: d } = $h(l, r, c), f = r, p = 0, m = {};
	for (let n = 0; n < a.length; n++) {
		let h = a[n];
		if (!h) continue;
		let { name: g, fn: _ } = h, { x: v, y, data: b, reset: x } = await _({
			x: u,
			y: d,
			initialPlacement: r,
			placement: f,
			strategy: i,
			middlewareData: m,
			rects: l,
			platform: s,
			elements: {
				reference: e,
				floating: t
			}
		});
		u = v ?? u, d = y ?? d, m[g] = {
			...m[g],
			...b
		}, x && p < tg && (p++, typeof x == "object" && (x.placement && (f = x.placement), x.rects && (l = x.rects === !0 ? await o.getElementRects({
			reference: e,
			floating: t,
			strategy: i
		}) : x.rects), {x: u, y: d} = $h(l, f, c)), n = -1);
	}
	return {
		x: u,
		y: d,
		placement: f,
		strategy: i,
		middlewareData: m
	};
}, rg = (e) => ({
	name: "arrow",
	options: e,
	async fn(t) {
		let { x: n, y: r, placement: i, rects: a, platform: o, elements: s, middlewareData: c } = t, { element: l, padding: u = 0 } = Nh(e, t) || {};
		if (l == null) return {};
		let d = Zh(u), f = {
			x: n,
			y: r
		}, p = zh(i), m = Lh(p), h = await o.getDimensions(l), g = p === "y", _ = g ? "top" : "left", v = g ? "bottom" : "right", y = g ? "clientHeight" : "clientWidth", b = a.reference[m] + a.reference[p] - f[p] - a.floating[m], x = f[p] - a.reference[p], S = await (o.getOffsetParent == null ? void 0 : o.getOffsetParent(l)), C = S ? S[y] : 0;
		C && await (o.isElement == null ? void 0 : o.isElement(S)) || (C = s.floating[y] || a.floating[m]);
		let w = b / 2 - x / 2, T = C / 2 - h[m] / 2 - 1, E = Eh(d[_], T), D = Eh(d[v], T), O = C - h[m] - D, k = C / 2 - h[m] / 2 + w, A = Mh(E, k, O), j = !c.arrow && Fh(i) != null && k !== A && a.reference[m] / 2 - (k < E ? E : D) - h[m] / 2 < 0, ee = j ? k < E ? k - E : k - O : 0;
		return {
			[p]: f[p] + ee,
			data: {
				[p]: A,
				centerOffset: k - A - ee,
				...j && { alignmentOffset: ee }
			},
			reset: j
		};
	}
}), ig = function(e) {
	return e === void 0 && (e = {}), {
		name: "flip",
		options: e,
		async fn(t) {
			var n;
			let { placement: r, middlewareData: i, rects: a, initialPlacement: o, platform: s, elements: c } = t, { mainAxis: l = !0, crossAxis: u = !0, fallbackPlacements: d, fallbackStrategy: f = "bestFit", fallbackAxisSideDirection: p = "none", flipAlignment: m = !0, ...h } = Nh(e, t);
			if ((n = i.arrow) != null && n.alignmentOffset) return {};
			let g = Ph(r), _ = Rh(o), v = Ph(o) === o, y = await (s.isRTL == null ? void 0 : s.isRTL(c.floating)), b = d || (v || !m ? [Yh(o)] : Vh(o)), x = p !== "none";
			!d && x && b.push(...Jh(o, m, p, y));
			let S = [o, ...b], C = await s.detectOverflow(t, h), w = [], T = i.flip?.overflows || [];
			if (l && w.push(C[g]), u) {
				let e = Bh(r, a, y);
				w.push(C[e[0]], C[e[1]]);
			}
			if (T = [...T, {
				placement: r,
				overflows: w
			}], !w.every((e) => e <= 0)) {
				let e = (i.flip?.index || 0) + 1, t = S[e];
				if (t && (u !== "alignment" || _ === Rh(t) || T.every((e) => Rh(e.placement) !== _ || e.overflows[0] > 0))) return {
					data: {
						index: e,
						overflows: T
					},
					reset: { placement: t }
				};
				let n = T.filter((e) => e.overflows[0] <= 0).sort((e, t) => e.overflows[1] - t.overflows[1])[0]?.placement;
				if (!n) switch (f) {
					case "bestFit": {
						let e = T.filter((e) => {
							if (x) {
								let t = Rh(e.placement);
								return t === _ || t === "y";
							}
							return !0;
						}).map((e) => [e.placement, e.overflows.filter((e) => e > 0).reduce((e, t) => e + t, 0)]).sort((e, t) => e[1] - t[1])[0]?.[0];
						e && (n = e);
						break;
					}
					case "initialPlacement": n = o;
				}
				if (r !== n) return { reset: { placement: n } };
			}
			return {};
		}
	};
};
function ag(e, t) {
	return {
		top: e.top - t.height,
		right: e.right - t.width,
		bottom: e.bottom - t.height,
		left: e.left - t.width
	};
}
function og(e) {
	return Th.some((t) => e[t] >= 0);
}
var sg = function(e) {
	return e === void 0 && (e = {}), {
		name: "hide",
		options: e,
		async fn(t) {
			let { rects: n, platform: r } = t, { strategy: i = "referenceHidden", ...a } = Nh(e, t);
			switch (i) {
				case "referenceHidden": {
					let e = ag(await r.detectOverflow(t, {
						...a,
						elementContext: "reference"
					}), n.reference);
					return { data: {
						referenceHiddenOffsets: e,
						referenceHidden: og(e)
					} };
				}
				case "escaped": {
					let e = ag(await r.detectOverflow(t, {
						...a,
						altBoundary: !0
					}), n.floating);
					return { data: {
						escapedOffsets: e,
						escaped: og(e)
					} };
				}
				default: return {};
			}
		}
	};
}, cg = /*#__PURE__*/ new Set(["left", "top"]);
async function lg(e, t) {
	let { placement: n, platform: r, elements: i } = e, a = await (r.isRTL == null ? void 0 : r.isRTL(i.floating)), o = Ph(n), s = Fh(n), c = Rh(n) === "y", l = cg.has(o) ? -1 : 1, u = a && c ? -1 : 1, d = Nh(t, e), { mainAxis: f, crossAxis: p, alignmentAxis: m } = typeof d == "number" ? {
		mainAxis: d,
		crossAxis: 0,
		alignmentAxis: null
	} : {
		mainAxis: d.mainAxis || 0,
		crossAxis: d.crossAxis || 0,
		alignmentAxis: d.alignmentAxis
	};
	return s && typeof m == "number" && (p = s === "end" ? m * -1 : m), c ? {
		x: p * u,
		y: f * l
	} : {
		x: f * l,
		y: p * u
	};
}
var ug = function(e) {
	return e === void 0 && (e = 0), {
		name: "offset",
		options: e,
		async fn(t) {
			var n;
			let { x: r, y: i, placement: a, middlewareData: o } = t, s = await lg(t, e);
			return a === o.offset?.placement && (n = o.arrow) != null && n.alignmentOffset ? {} : {
				x: r + s.x,
				y: i + s.y,
				data: {
					...s,
					placement: a
				}
			};
		}
	};
}, dg = function(e) {
	return e === void 0 && (e = {}), {
		name: "shift",
		options: e,
		async fn(t) {
			let { x: n, y: r, placement: i, platform: a } = t, { mainAxis: o = !0, crossAxis: s = !1, limiter: c = { fn: (e) => {
				let { x: t, y: n } = e;
				return {
					x: t,
					y: n
				};
			} }, ...l } = Nh(e, t), u = {
				x: n,
				y: r
			}, d = await a.detectOverflow(t, l), f = Rh(i), p = Ih(f), m = u[p], h = u[f], g = (e, t) => Mh(t + d[e === "y" ? "top" : "left"], t, t - d[e === "y" ? "bottom" : "right"]);
			o && (m = g(p, m)), s && (h = g(f, h));
			let _ = c.fn({
				...t,
				[p]: m,
				[f]: h
			});
			return {
				..._,
				data: {
					x: _.x - n,
					y: _.y - r,
					enabled: {
						[p]: o,
						[f]: s
					}
				}
			};
		}
	};
}, fg = function(e) {
	return e === void 0 && (e = {}), {
		options: e,
		fn(t) {
			let { x: n, y: r, placement: i, rects: a, middlewareData: o } = t, { offset: s = 0, mainAxis: c = !0, crossAxis: l = !0 } = Nh(e, t), u = {
				x: n,
				y: r
			}, d = Rh(i), f = Ih(d), p = u[f], m = u[d], h = Nh(s, t), g = typeof h == "number" ? {
				mainAxis: h,
				crossAxis: 0
			} : {
				mainAxis: h.mainAxis ?? 0,
				crossAxis: h.crossAxis ?? 0
			};
			if (c) {
				let e = f === "y" ? "height" : "width", t = a.reference[f] - a.floating[e] + g.mainAxis, n = a.reference[f] + a.reference[e] - g.mainAxis;
				p < t ? p = t : p > n && (p = n);
			}
			if (l) {
				let e = f === "y" ? "width" : "height", t = cg.has(Ph(i)), n = a.reference[d] - a.floating[e] + (t && o.offset?.[d] || 0) + (t ? 0 : g.crossAxis), r = a.reference[d] + a.reference[e] + (t ? 0 : o.offset?.[d] || 0) - (t ? g.crossAxis : 0);
				m < n ? m = n : m > r && (m = r);
			}
			return {
				[f]: p,
				[d]: m
			};
		}
	};
}, pg = function(e) {
	return e === void 0 && (e = {}), {
		name: "size",
		options: e,
		async fn(t) {
			let { placement: n, rects: r, platform: i, elements: a } = t, { apply: o = () => {}, ...s } = Nh(e, t), c = await i.detectOverflow(t, s), l = Ph(n), u = Fh(n), d = Rh(n) === "y", { width: f, height: p } = r.floating, m, h;
			l === "top" || l === "bottom" ? (m = l, h = u === (await (i.isRTL == null ? void 0 : i.isRTL(a.floating)) ? "start" : "end") ? "left" : "right") : (h = l, m = u === "end" ? "top" : "bottom");
			let g = p - c.top - c.bottom, _ = f - c.left - c.right, v = Eh(p - c[m], g), y = Eh(f - c[h], _), b = t.middlewareData.shift, x = !b, S = v, C = y;
			b != null && b.enabled.x && (C = _), b != null && b.enabled.y && (S = g), x && !u && (d ? C = f - 2 * Dh(c.left, c.right) : S = p - 2 * Dh(c.top, c.bottom)), await o({
				...t,
				availableWidth: C,
				availableHeight: S
			});
			let w = await i.getDimensions(a.floating);
			return f !== w.width || p !== w.height ? { reset: { rects: !0 } } : {};
		}
	};
};
// node_modules/.pnpm/@floating-ui+utils@0.2.12/node_modules/@floating-ui/utils/dist/floating-ui.utils.dom.mjs
function mg() {
	return typeof window < "u";
}
function hg(e) {
	return vg(e) ? (e.nodeName || "").toLowerCase() : "#document";
}
function gg(e) {
	var t;
	return (e == null || (t = e.ownerDocument) == null ? void 0 : t.defaultView) || window;
}
function _g(e) {
	return ((vg(e) ? e.ownerDocument : e.document) || window.document)?.documentElement;
}
function vg(e) {
	return mg() ? e instanceof Node || e instanceof gg(e).Node : !1;
}
function yg(e) {
	return mg() ? e instanceof Element || e instanceof gg(e).Element : !1;
}
function bg(e) {
	return mg() ? e instanceof HTMLElement || e instanceof gg(e).HTMLElement : !1;
}
function xg(e) {
	return !mg() || typeof ShadowRoot > "u" ? !1 : e instanceof ShadowRoot || e instanceof gg(e).ShadowRoot;
}
function Sg(e) {
	let { overflow: t, overflowX: n, overflowY: r, display: i } = Ng(e);
	return /auto|scroll|overlay|hidden|clip/.test(t + r + n) && i !== "inline" && i !== "contents";
}
function Cg(e) {
	return /^(table|td|th)$/.test(hg(e));
}
function wg(e) {
	try {
		if (e.matches(":popover-open")) return !0;
	} catch {}
	try {
		return e.matches(":modal");
	} catch {
		return !1;
	}
}
var Tg = /transform|translate|scale|rotate|perspective|filter/, Eg = /paint|layout|strict|content/, Dg = (e) => !!e && e !== "none", Og;
function kg(e) {
	let t = yg(e) ? Ng(e) : e;
	return Dg(t.transform) || Dg(t.translate) || Dg(t.scale) || Dg(t.rotate) || Dg(t.perspective) || !jg() && (Dg(t.backdropFilter) || Dg(t.filter)) || Tg.test(t.willChange || "") || Eg.test(t.contain || "");
}
function Ag(e) {
	let t = Fg(e);
	for (; bg(t) && !Mg(t);) {
		if (kg(t)) return t;
		if (wg(t)) return null;
		t = Fg(t);
	}
	return null;
}
function jg() {
	return Og ??= typeof CSS < "u" && CSS.supports && CSS.supports("-webkit-backdrop-filter", "none"), Og;
}
function Mg(e) {
	return /^(html|body|#document)$/.test(hg(e));
}
function Ng(e) {
	return gg(e).getComputedStyle(e);
}
function Pg(e) {
	return yg(e) ? {
		scrollLeft: e.scrollLeft,
		scrollTop: e.scrollTop
	} : {
		scrollLeft: e.scrollX,
		scrollTop: e.scrollY
	};
}
function Fg(e) {
	if (hg(e) === "html") return e;
	let t = e.assignedSlot || e.parentNode || xg(e) && e.host || _g(e);
	return xg(t) ? t.host : t;
}
function Ig(e) {
	let t = Fg(e);
	return Mg(t) ? (e.ownerDocument || e).body : bg(t) && Sg(t) ? t : Ig(t);
}
function Lg(e, t, n) {
	t === void 0 && (t = []), n === void 0 && (n = !0);
	let r = Ig(e), i = r === e.ownerDocument?.body, a = gg(r);
	if (i) {
		let e = Rg(a);
		return t.concat(a, a.visualViewport || [], Sg(r) ? r : [], e && n ? Lg(e) : []);
	}
	return t.concat(r, Lg(r, [], n));
}
function Rg(e) {
	return e.parent && Object.getPrototypeOf(e.parent) ? e.frameElement : null;
}
// node_modules/.pnpm/@floating-ui+dom@1.8.0/node_modules/@floating-ui/dom/dist/floating-ui.dom.mjs
function zg(e) {
	let t = Ng(e), n = parseFloat(t.width) || 0, r = parseFloat(t.height) || 0, i = bg(e), a = i ? e.offsetWidth : n, o = i ? e.offsetHeight : r, s = Oh(n) !== a || Oh(r) !== o;
	return s && (n = a, r = o), {
		width: n,
		height: r,
		$: s
	};
}
function Bg(e) {
	return yg(e) ? e : e.contextElement;
}
function Vg(e) {
	let t = Bg(e);
	if (!bg(t)) return Ah(1);
	let n = t.getBoundingClientRect(), { width: r, height: i, $: a } = zg(t), o = (a ? Oh(n.width) : n.width) / r, s = (a ? Oh(n.height) : n.height) / i;
	return o && Number.isFinite(o) || (o = 1), s && Number.isFinite(s) || (s = 1), {
		x: o,
		y: s
	};
}
var Hg = /*#__PURE__*/ Ah(0);
function Ug(e) {
	let t = gg(e);
	return !jg() || !t.visualViewport ? Hg : {
		x: t.visualViewport.offsetLeft,
		y: t.visualViewport.offsetTop
	};
}
function Wg(e, t, n) {
	return t === void 0 && (t = !1), !!n && t && n === gg(e);
}
function Gg(e, t, n, r) {
	t === void 0 && (t = !1), n === void 0 && (n = !1);
	let i = e.getBoundingClientRect(), a = Bg(e), o = Ah(1);
	t && (r ? yg(r) && (o = Vg(r)) : o = Vg(e));
	let s = Wg(a, n, r) ? Ug(a) : Ah(0), c = (i.left + s.x) / o.x, l = (i.top + s.y) / o.y, u = i.width / o.x, d = i.height / o.y;
	if (a && r) {
		let e = gg(a), t = yg(r) ? gg(r) : r, n = e, i = Rg(n);
		for (; i && t !== n;) {
			let e = Vg(i), t = i.getBoundingClientRect(), r = Ng(i), a = t.left + (i.clientLeft + parseFloat(r.paddingLeft)) * e.x, o = t.top + (i.clientTop + parseFloat(r.paddingTop)) * e.y;
			c *= e.x, l *= e.y, u *= e.x, d *= e.y, c += a, l += o, n = gg(i), i = Rg(n);
		}
	}
	return Qh({
		width: u,
		height: d,
		x: c,
		y: l
	});
}
function Kg(e, t) {
	let n = Pg(e).scrollLeft;
	return t ? t.left + n : Gg(_g(e)).left + n;
}
function qg(e, t) {
	let n = e.getBoundingClientRect();
	return {
		x: n.left + t.scrollLeft - Kg(e, n),
		y: n.top + t.scrollTop
	};
}
function Jg(e) {
	let { elements: t, rect: n, offsetParent: r, strategy: i } = e, a = i === "fixed", o = _g(r), s = t ? wg(t.floating) : !1;
	if (r === o || s && a) return n;
	let c = {
		scrollLeft: 0,
		scrollTop: 0
	}, l = Ah(1), u = Ah(0), d = bg(r);
	if ((d || !a) && ((hg(r) !== "body" || Sg(o)) && (c = Pg(r)), d)) {
		let e = Gg(r);
		l = Vg(r), u.x = e.x + r.clientLeft, u.y = e.y + r.clientTop;
	}
	let f = o && !d && !a ? qg(o, c) : Ah(0);
	return {
		width: n.width * l.x,
		height: n.height * l.y,
		x: n.x * l.x - c.scrollLeft * l.x + u.x + f.x,
		y: n.y * l.y - c.scrollTop * l.y + u.y + f.y
	};
}
function Yg(e) {
	return e.getClientRects ? Array.from(e.getClientRects()) : [];
}
function Xg(e) {
	let t = Pg(e), n = e.ownerDocument.body, r = Dh(e.scrollWidth, e.clientWidth, n.scrollWidth, n.clientWidth), i = Dh(e.scrollHeight, e.clientHeight, n.scrollHeight, n.clientHeight), a = -t.scrollLeft + Kg(e), o = -t.scrollTop;
	return Ng(n).direction === "rtl" && (a += Dh(e.clientWidth, n.clientWidth) - r), {
		width: r,
		height: i,
		x: a,
		y: o
	};
}
var Zg = 25;
function Qg(e, t, n) {
	n === void 0 && (n = "viewport");
	let r = n === "layoutViewport", i = gg(e), a = _g(e), o = i.visualViewport, s = a.clientWidth, c = a.clientHeight, l = 0, u = 0;
	if (o) {
		let e = !jg() || t === "fixed";
		r ? e || (l = -o.offsetLeft, u = -o.offsetTop) : (s = o.width, c = o.height, e && (l = o.offsetLeft, u = o.offsetTop));
	}
	if (Kg(a) <= 0) {
		let e = a.ownerDocument, t = e.body, n = getComputedStyle(t), r = e.compatMode === "CSS1Compat" && parseFloat(n.marginLeft) + parseFloat(n.marginRight) || 0, i = Math.abs(a.clientWidth - t.clientWidth - r), o = getComputedStyle(a).scrollbarGutter === "stable both-edges" ? i / 2 : i;
		o <= Zg && (s -= o);
	}
	return {
		width: s,
		height: c,
		x: l,
		y: u
	};
}
function $g(e, t) {
	let n = Gg(e, !0, t === "fixed"), r = n.top + e.clientTop, i = n.left + e.clientLeft, a = Vg(e);
	return {
		width: e.clientWidth * a.x,
		height: e.clientHeight * a.y,
		x: i * a.x,
		y: r * a.y
	};
}
function e_(e, t, n) {
	let r;
	if (t === "viewport" || t === "layoutViewport") r = Qg(e, n, t);
	else if (t === "document") r = Xg(_g(e));
	else if (yg(t)) r = $g(t, n);
	else {
		let n = Ug(e);
		r = {
			x: t.x - n.x,
			y: t.y - n.y,
			width: t.width,
			height: t.height
		};
	}
	return Qh(r);
}
function t_(e, t) {
	let n = t.get(e);
	if (n) return n;
	let r = Lg(e, [], !1).filter((e) => yg(e) && hg(e) !== "body"), i = null, a = Ng(e).position === "fixed", o = a ? Fg(e) : e;
	for (; yg(o) && !Mg(o);) {
		let e = Ng(o), t = kg(o), n = i ? i.position : a ? "fixed" : "";
		!t && (n === "fixed" || n === "absolute" && e.position === "static") ? r = r.filter((e) => e !== o) : i = e, o = Fg(o);
	}
	return t.set(e, r), r;
}
function n_(e) {
	let { element: t, boundary: n, rootBoundary: r, strategy: i } = e, a = [...n === "clippingAncestors" ? wg(t) ? [] : t_(t, this._c) : [].concat(n), r], o = e_(t, a[0], i), s = o.top, c = o.right, l = o.bottom, u = o.left;
	for (let e = 1; e < a.length; e++) {
		let n = e_(t, a[e], i);
		s = Dh(n.top, s), c = Eh(n.right, c), l = Eh(n.bottom, l), u = Dh(n.left, u);
	}
	return {
		width: c - u,
		height: l - s,
		x: u,
		y: s
	};
}
function r_(e) {
	let { width: t, height: n } = zg(e);
	return {
		width: t,
		height: n
	};
}
function i_(e, t, n) {
	let r = bg(t), i = _g(t), a = n === "fixed", o = Gg(e, !0, a, t), s = {
		scrollLeft: 0,
		scrollTop: 0
	}, c = Ah(0);
	if ((r || !a) && ((hg(t) !== "body" || Sg(i)) && (s = Pg(t)), r)) {
		let e = Gg(t, !0, a, t);
		c.x = e.x + t.clientLeft, c.y = e.y + t.clientTop;
	}
	!r && i && (c.x = Kg(i));
	let l = i && !r && !a ? qg(i, s) : Ah(0);
	return {
		x: o.left + s.scrollLeft - c.x - l.x,
		y: o.top + s.scrollTop - c.y - l.y,
		width: o.width,
		height: o.height
	};
}
function a_(e) {
	return Ng(e).position === "static";
}
function o_(e, t) {
	if (!bg(e) || Ng(e).position === "fixed") return null;
	if (t) return t(e);
	let n = e.offsetParent;
	return _g(e) === n && (n = n.ownerDocument.body), n;
}
function s_(e, t) {
	let n = gg(e);
	if (wg(e)) return n;
	if (!bg(e)) {
		let t = Fg(e);
		for (; t && !Mg(t);) {
			if (yg(t) && !a_(t)) return t;
			t = Fg(t);
		}
		return n;
	}
	let r = o_(e, t);
	for (; r && Cg(r) && a_(r);) r = o_(r, t);
	return r && Mg(r) && a_(r) && !kg(r) ? n : r || Ag(e) || n;
}
var c_ = async function(e) {
	let t = this.getOffsetParent || s_, n = this.getDimensions, r = await n(e.floating);
	return {
		reference: i_(e.reference, await t(e.floating), e.strategy),
		floating: {
			x: 0,
			y: 0,
			width: r.width,
			height: r.height
		}
	};
};
function l_(e) {
	return Ng(e).direction === "rtl";
}
var u_ = {
	convertOffsetParentRelativeRectToViewportRelativeRect: Jg,
	getDocumentElement: _g,
	getClippingRect: n_,
	getOffsetParent: s_,
	getElementRects: c_,
	getClientRects: Yg,
	getDimensions: r_,
	getScale: Vg,
	isElement: yg,
	isRTL: l_
};
function d_(e, t) {
	return e.x === t.x && e.y === t.y && e.width === t.width && e.height === t.height;
}
function f_(e, t, n) {
	let r = null, i, a = _g(e);
	function o() {
		var e;
		clearTimeout(i), (e = r) == null || e.disconnect(), r = null;
	}
	function s(n, c) {
		n === void 0 && (n = !1), c === void 0 && (c = 1), o();
		let l = e.getBoundingClientRect(), { left: u, top: d, width: f, height: p } = l;
		if (n || t(), !f || !p) return;
		let m = kh(d), h = kh(a.clientWidth - (u + f)), g = kh(a.clientHeight - (d + p)), _ = kh(u), v = {
			rootMargin: -m + "px " + -h + "px " + -g + "px " + -_ + "px",
			threshold: Dh(0, Eh(1, c)) || 1
		}, y = !0;
		function b(t) {
			let n = t[0].intersectionRatio;
			if (!d_(l, e.getBoundingClientRect())) return s();
			if (n !== c) {
				if (!y) return s();
				n ? s(!1, n) : i = setTimeout(() => {
					s(!1, 1e-7);
				}, 1e3);
			}
			y = !1;
		}
		try {
			r = new IntersectionObserver(b, {
				...v,
				root: a.ownerDocument
			});
		} catch {
			r = new IntersectionObserver(b, v);
		}
		r.observe(e);
	}
	let c = gg(e), l = () => s(n);
	return c.addEventListener("resize", l), s(!0), () => {
		c.removeEventListener("resize", l), o();
	};
}
function p_(e, t, n, r) {
	r === void 0 && (r = {});
	let { ancestorScroll: i = !0, ancestorResize: a = !0, elementResize: o = typeof ResizeObserver == "function", layoutShift: s = typeof IntersectionObserver == "function", animationFrame: c = !1 } = r, l = Bg(e), u = i || a ? [...l ? Lg(l) : [], ...t ? Lg(t) : []] : [];
	u.forEach((e) => {
		i && e.addEventListener("scroll", n), a && e.addEventListener("resize", n);
	});
	let d = l && s ? f_(l, n, a) : null, f = -1, p = null;
	o && (p = new ResizeObserver((e) => {
		let [r] = e;
		r && r.target === l && p && t && (p.unobserve(t), cancelAnimationFrame(f), f = requestAnimationFrame(() => {
			var e;
			(e = p) == null || e.observe(t);
		})), n();
	}), l && !c && p.observe(l), t && p.observe(t));
	let m, h = c ? Gg(e) : null;
	c && g();
	function g() {
		let t = Gg(e);
		h && !d_(h, t) && n(), h = t, m = requestAnimationFrame(g);
	}
	return n(), () => {
		var e;
		u.forEach((e) => {
			i && e.removeEventListener("scroll", n), a && e.removeEventListener("resize", n);
		}), d?.(), (e = p) == null || e.disconnect(), p = null, c && cancelAnimationFrame(m);
	};
}
var m_ = ug, h_ = dg, g_ = ig, __ = pg, v_ = sg, y_ = rg, b_ = fg, x_ = (e, t, n) => {
	let r = /* @__PURE__ */ new Map(), i = n ?? {}, a = {
		...u_,
		...i.platform,
		_c: r
	};
	return ng(e, t, {
		...i,
		platform: a
	});
};
// node_modules/.pnpm/@floating-ui+vue@2.0.1_vue@3.5.42_typescript@6.0.3_/node_modules/@floating-ui/vue/dist/floating-ui.vue.mjs
function S_(e) {
	return typeof e == "object" && !!e && "$el" in e;
}
function C_(e) {
	if (S_(e)) {
		let t = e.$el;
		return vg(t) && hg(t) === "#comment" ? null : t;
	}
	return e;
}
function w_(e) {
	return {
		name: "arrow",
		options: e,
		fn(t) {
			let n = C_(on(e.element));
			return n == null ? {} : y_({
				element: n,
				padding: e.padding
			}).fn(t);
		}
	};
}
function T_(e) {
	return typeof window > "u" ? 1 : (e.ownerDocument.defaultView || window).devicePixelRatio || 1;
}
function E_(e, t) {
	let n = T_(e);
	return Math.round(t * n) / n;
}
function D_(e, t, n) {
	n === void 0 && (n = {});
	let r = n.whileElementsMounted, i = X(() => on(n.open) ?? !0), a = X(() => on(n.middleware)), o = X(() => on(n.placement) ?? "bottom"), s = X(() => on(n.strategy) ?? "absolute"), c = X(() => on(n.transform) ?? !0), l = X(() => C_(e.value)), u = X(() => C_(t.value)), d = /* @__PURE__ */ P(0), f = /* @__PURE__ */ P(0), p = /* @__PURE__ */ P(s.value), m = /* @__PURE__ */ P(o.value), h = /* @__PURE__ */ F({}), g = /* @__PURE__ */ P(!1), _ = X(() => {
		let e = {
			position: p.value,
			left: "0",
			top: "0"
		};
		if (!u.value) return e;
		let t = E_(u.value, d.value), n = E_(u.value, f.value);
		return c.value ? {
			...e,
			transform: "translate(" + t + "px, " + n + "px)",
			...T_(u.value) >= 1.5 && { willChange: "transform" }
		} : {
			position: p.value,
			left: t + "px",
			top: n + "px"
		};
	}), v;
	function y() {
		if (l.value == null || u.value == null) return;
		let e = i.value;
		x_(l.value, u.value, {
			middleware: a.value,
			placement: o.value,
			strategy: s.value
		}).then((t) => {
			d.value = t.x, f.value = t.y, p.value = t.strategy, m.value = t.placement, h.value = t.middlewareData, g.value = e !== !1;
		});
	}
	function b() {
		typeof v == "function" && (v(), v = void 0);
	}
	function x() {
		b(), r === void 0 ? y() : l.value != null && u.value != null && (v = r(l.value, u.value, y));
	}
	function S() {
		i.value || (g.value = !1);
	}
	return R([
		a,
		o,
		s,
		i
	], y, { flush: "sync" }), R([l, u], x, { flush: "sync" }), R(i, S, { flush: "sync" }), Oe() && ke(b), {
		x: /* @__PURE__ */ Gt(d),
		y: /* @__PURE__ */ Gt(f),
		strategy: /* @__PURE__ */ Gt(p),
		placement: /* @__PURE__ */ Gt(m),
		middlewareData: /* @__PURE__ */ Gt(h),
		isPositioned: /* @__PURE__ */ Gt(g),
		floatingStyles: _,
		update: y
	};
}
// node_modules/.pnpm/reka-ui@2.11.0_vue@3.5.42_typescript@6.0.3_/node_modules/reka-ui/dist/Popper/PopperContent.js
var O_ = ["dir"], k_ = {
	side: "bottom",
	sideOffset: 0,
	sideFlip: !0,
	align: "center",
	alignOffset: 0,
	alignFlip: !0,
	arrowPadding: 0,
	hideShiftedArrow: !0,
	avoidCollisions: !0,
	collisionBoundary: () => [],
	collisionPadding: 0,
	sticky: "partial",
	hideWhenDetached: !1,
	positionStrategy: "fixed",
	updatePositionStrategy: "optimized",
	prioritizePosition: !1
}, [A_, j_] = /*#__PURE__*/ Gf("PopperContent"), M_ = /* @__PURE__ */ z({
	inheritAttrs: !1,
	__name: "PopperContent",
	props: /* @__PURE__ */ li({
		memoDependencies: {
			type: Array,
			required: !1
		},
		side: {
			type: null,
			required: !1
		},
		sideOffset: {
			type: Number,
			required: !1
		},
		sideFlip: {
			type: Boolean,
			required: !1
		},
		align: {
			type: null,
			required: !1
		},
		alignOffset: {
			type: Number,
			required: !1
		},
		alignFlip: {
			type: Boolean,
			required: !1
		},
		avoidCollisions: {
			type: Boolean,
			required: !1
		},
		collisionBoundary: {
			type: null,
			required: !1
		},
		collisionPadding: {
			type: [Number, Object],
			required: !1
		},
		arrowPadding: {
			type: Number,
			required: !1
		},
		hideShiftedArrow: {
			type: Boolean,
			required: !1
		},
		sticky: {
			type: String,
			required: !1
		},
		hideWhenDetached: {
			type: Boolean,
			required: !1
		},
		positionStrategy: {
			type: String,
			required: !1
		},
		updatePositionStrategy: {
			type: String,
			required: !1
		},
		disableUpdateOnLayoutShift: {
			type: Boolean,
			required: !1
		},
		prioritizePosition: {
			type: Boolean,
			required: !1
		},
		reference: {
			type: null,
			required: !1
		},
		dir: {
			type: String,
			required: !1
		},
		asChild: {
			type: Boolean,
			required: !1
		},
		as: {
			type: null,
			required: !1
		}
	}, { ...k_ }),
	emits: ["placed"],
	setup(e, { emit: t }) {
		let n = e, r = t, i = vh(), { forwardRef: a, currentElement: o } = Yp(), s = Hp(X(() => n.dir)), c = /* @__PURE__ */ P(), l = /* @__PURE__ */ P(), { width: u, height: d } = um(l), f = X(() => n.side + (n.align === "center" ? "" : `-${n.align}`)), p = X(() => typeof n.collisionPadding == "number" ? n.collisionPadding : {
			top: 0,
			right: 0,
			bottom: 0,
			left: 0,
			...n.collisionPadding
		}), m = X(() => Array.isArray(n.collisionBoundary) ? n.collisionBoundary : [n.collisionBoundary]), h = X(() => ({
			padding: p.value,
			boundary: m.value.filter(Sh),
			altBoundary: m.value.length > 0
		})), g = X(() => ({
			mainAxis: n.sideFlip,
			crossAxis: n.alignFlip
		})), _ = X(() => [
			m_({
				mainAxis: n.sideOffset + d.value,
				alignmentAxis: n.alignOffset
			}),
			n.prioritizePosition && n.avoidCollisions && g_({
				...h.value,
				...g.value
			}),
			n.avoidCollisions && h_({
				mainAxis: !0,
				crossAxis: !!n.prioritizePosition,
				limiter: n.sticky === "partial" ? b_() : void 0,
				...h.value
			}),
			!n.prioritizePosition && n.avoidCollisions && g_({
				...h.value,
				...g.value
			}),
			__({
				...h.value,
				apply: ({ elements: e, rects: t, availableWidth: n, availableHeight: r }) => {
					let { width: i, height: a } = t.reference, o = e.floating.style;
					o.setProperty("--reka-popper-available-width", `${n}px`), o.setProperty("--reka-popper-available-height", `${r}px`), o.setProperty("--reka-popper-anchor-width", `${i}px`), o.setProperty("--reka-popper-anchor-height", `${a}px`);
				}
			}),
			l.value && w_({
				element: l.value,
				padding: n.arrowPadding
			}),
			Ch({
				arrowWidth: u.value,
				arrowHeight: d.value,
				dir: s.value
			}),
			n.hideWhenDetached && v_({
				strategy: "referenceHidden",
				...h.value
			})
		]), { floatingStyles: v, placement: y, isPositioned: b, middlewareData: x, update: S } = D_(X(() => n.reference ?? i.anchor.value), c, {
			strategy: n.positionStrategy,
			placement: f,
			whileElementsMounted: (...e) => p_(...e, {
				layoutShift: !n.disableUpdateOnLayoutShift,
				animationFrame: n.updatePositionStrategy === "always"
			}),
			middleware: _
		}), C = X(() => wh(y.value)[0]), w = X(() => wh(y.value)[1]);
		er(() => {
			b.value && r("placed");
		});
		let T = X(() => {
			let e = x.value.arrow?.centerOffset !== 0;
			return n.hideShiftedArrow && e;
		}), E = /* @__PURE__ */ P("");
		return $n(() => {
			o.value && (E.value = window.getComputedStyle(o.value).zIndex);
		}), j_({
			placedSide: C,
			onArrowChange: (e) => l.value = e,
			arrowX: X(() => x.value.arrow?.x ?? 0),
			arrowY: X(() => x.value.arrow?.y ?? 0),
			shouldHideArrow: T
		}), (e, t) => (U(), W("div", {
			ref_key: "floatingRef",
			ref: c,
			"data-reka-popper-content-wrapper": "",
			dir: I(s),
			style: le({
				...I(v),
				transform: I(b) ? I(v).transform : "translate(0, -200%)",
				minWidth: "max-content",
				zIndex: E.value,
				"--reka-popper-transform-origin": [I(x).transformOrigin?.x, I(x).transformOrigin?.y].join(" "),
				...I(x).hide?.referenceHidden && {
					visibility: "hidden",
					pointerEvents: "none"
				}
			})
		}, [n.memoDependencies ? co([
			n.asChild,
			n.as,
			C.value,
			w.value,
			I(b),
			...Object.values(e.$attrs),
			...n.memoDependencies
		], () => (U(), G(I(bm), za({
			key: 0,
			ref: I(a)
		}, e.$attrs, {
			"as-child": n.asChild,
			as: n.as,
			"data-side": C.value,
			"data-align": w.value,
			style: { animation: I(b) ? void 0 : "none" }
		}), {
			default: L(() => [V(e.$slots, "default")]),
			_: 3
		}, 16, [
			"as-child",
			"as",
			"data-side",
			"data-align",
			"style"
		])), t, 0) : (U(), G(I(bm), za({
			key: 1,
			ref: I(a)
		}, e.$attrs, {
			"as-child": n.asChild,
			as: n.as,
			"data-side": C.value,
			"data-align": w.value,
			dir: I(s),
			style: { animation: I(b) ? void 0 : "none" }
		}), {
			default: L(() => [V(e.$slots, "default")]),
			_: 3
		}, 16, [
			"as-child",
			"as",
			"data-side",
			"data-align",
			"dir",
			"style"
		]))], 12, O_));
	}
});
// node_modules/.pnpm/reka-ui@2.11.0_vue@3.5.42_typescript@6.0.3_/node_modules/reka-ui/dist/Combobox/useComboboxContentPositioning.js
function N_(e) {
	let t = /* @__PURE__ */ P("inline"), n = /* @__PURE__ */ P(!1), r = /* @__PURE__ */ P(), i = X(() => t.value === "popper" && !n.value), a;
	lh({
		suppressHighlightScroll: i,
		onHighlightScrollRequest(e) {
			a = e;
		}
	});
	function o(e, i) {
		(r.value !== e || t.value !== i) && (n.value = !1, a = void 0), r.value = e, t.value = i;
	}
	function s(i) {
		if (r.value !== i || t.value !== "popper" || n.value) return;
		n.value = !0;
		let o = a;
		a = void 0, e.value && o?.();
	}
	function c(e) {
		r.value === e && (r.value = void 0, t.value = "inline", n.value = !1, a = void 0);
	}
	return {
		onContentPositionChange: o,
		onContentPlaced: s,
		onContentUnmount: c
	};
}
// node_modules/.pnpm/reka-ui@2.11.0_vue@3.5.42_typescript@6.0.3_/node_modules/reka-ui/dist/Combobox/ComboboxRoot.js
var [P_, F_] = /*#__PURE__*/ Gf("ComboboxRoot"), I_ = /* @__PURE__ */ z({
	__name: "ComboboxRoot",
	props: {
		open: {
			type: Boolean,
			required: !1,
			default: void 0
		},
		defaultOpen: {
			type: Boolean,
			required: !1
		},
		resetSearchTermOnBlur: {
			type: Boolean,
			required: !1,
			default: !0
		},
		resetSearchTermOnSelect: {
			type: Boolean,
			required: !1,
			default: !0
		},
		openOnFocus: {
			type: Boolean,
			required: !1,
			default: !1
		},
		openOnClick: {
			type: Boolean,
			required: !1,
			default: !1
		},
		ignoreFilter: {
			type: Boolean,
			required: !1
		},
		resetModelValueOnClear: {
			type: Boolean,
			required: !1,
			default: !1
		},
		unmountOnHide: {
			type: Boolean,
			required: !1,
			default: !0
		},
		modelValue: {
			type: null,
			required: !1
		},
		defaultValue: {
			type: null,
			required: !1
		},
		multiple: {
			type: Boolean,
			required: !1
		},
		dir: {
			type: String,
			required: !1
		},
		disabled: {
			type: Boolean,
			required: !1
		},
		highlightOnHover: {
			type: Boolean,
			required: !1,
			default: !0
		},
		loop: {
			type: Boolean,
			required: !1
		},
		by: {
			type: [String, Function],
			required: !1
		},
		asChild: {
			type: Boolean,
			required: !1
		},
		as: {
			type: null,
			required: !1
		},
		name: {
			type: String,
			required: !1
		},
		required: {
			type: Boolean,
			required: !1
		}
	},
	emits: [
		"update:modelValue",
		"highlight",
		"update:open"
	],
	setup(e, { expose: t, emit: n }) {
		let r = e, i = n, { primitiveElement: a, currentElement: o } = xm(), { multiple: s, disabled: c, ignoreFilter: l, resetSearchTermOnSelect: u, openOnFocus: d, openOnClick: f, dir: p, resetModelValueOnClear: m, highlightOnHover: h, loop: g, unmountOnHide: _ } = /* @__PURE__ */ dn(r), v = Hp(p), y = Sp(r, "modelValue", i, {
			defaultValue: r.defaultValue ?? (s.value ? [] : void 0),
			passive: r.modelValue === void 0,
			deep: !0
		}), b = Sp(r, "open", i, {
			defaultValue: r.defaultOpen,
			passive: r.open === void 0
		});
		async function x(e) {
			b.value = e, ee.value = "", e ? (await Fn(), a.value?.highlightSelected(), C.value = !0, T.value?.focus()) : (C.value = !1, setTimeout(() => {
				!e && r.resetSearchTermOnBlur && S.trigger();
			}, 1));
		}
		let S = Xf(), C = /* @__PURE__ */ P(!1), w = /* @__PURE__ */ P(!1), T = /* @__PURE__ */ P(), E = /* @__PURE__ */ P(), D = X(() => a.value?.highlightedElement ?? void 0), O = N_(b), k = /* @__PURE__ */ P(/* @__PURE__ */ new Map()), A = /* @__PURE__ */ P(/* @__PURE__ */ new Map()), { contains: j } = Wp({ sensitivity: "base" }), ee = /* @__PURE__ */ P(""), te = X((e) => {
			if (!ee.value || r.ignoreFilter || w.value) return {
				count: k.value.size,
				items: e?.items ?? /* @__PURE__ */ new Map(),
				groups: e?.groups ?? new Set(A.value.keys())
			};
			let t = 0, n = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Set();
			for (let [e, r] of k.value) {
				let i = j(r, ee.value);
				n.set(e, +!!i), i && t++;
			}
			for (let [e, t] of A.value) for (let r of t) if (n.get(r) > 0) {
				i.add(e);
				break;
			}
			return {
				count: t,
				items: n,
				groups: i
			};
		}), M = Ga();
		return zr(() => {
			M?.exposed && (M.exposed.highlightItem = a.value?.highlightItem, M.exposed.highlightFirstItem = a.value?.highlightFirstItem, M.exposed.highlightSelected = a.value?.highlightSelected);
		}), t({
			filtered: te,
			highlightedElement: D,
			highlightItem: a.value?.highlightItem,
			highlightFirstItem: a.value?.highlightFirstItem,
			highlightSelected: a.value?.highlightSelected
		}), F_({
			modelValue: y,
			multiple: s,
			disabled: c,
			open: b,
			onOpenChange: x,
			...O,
			contentId: "",
			isUserInputted: C,
			isVirtual: w,
			inputElement: T,
			highlightedElement: D,
			onInputElementChange: (e) => T.value = e,
			triggerElement: E,
			onTriggerElementChange: (e) => E.value = e,
			parentElement: o,
			resetSearchTermOnSelect: u,
			onResetSearchTerm: S.on,
			allItems: k,
			allGroups: A,
			filterSearch: ee,
			filterState: te,
			ignoreFilter: l,
			openOnFocus: d,
			openOnClick: f,
			resetModelValueOnClear: m,
			unmountOnHide: _
		}), (t, n) => (U(), G(I(bh), null, {
			default: L(() => [q(I(uh), za({
				ref_key: "primitiveElement",
				ref: a
			}, t.$attrs, {
				modelValue: I(y),
				"onUpdate:modelValue": n[0] ||= (e) => /* @__PURE__ */ tn(y) ? y.value = e : null,
				style: { pointerEvents: I(b) ? "auto" : void 0 },
				as: e.as,
				"as-child": e.asChild,
				dir: I(v),
				multiple: I(s),
				name: e.name,
				required: e.required,
				disabled: I(c),
				"highlight-on-hover": I(h),
				loop: I(g),
				by: r.by,
				onHighlight: n[1] ||= (e) => i("highlight", e)
			}), {
				default: L(() => [V(t.$slots, "default", {
					open: I(b),
					modelValue: I(y)
				})]),
				_: 3
			}, 16, [
				"modelValue",
				"style",
				"as",
				"as-child",
				"dir",
				"multiple",
				"name",
				"required",
				"disabled",
				"highlight-on-hover",
				"loop",
				"by"
			])]),
			_: 3
		}));
	}
}), L_ = /* @__PURE__ */ z({
	__name: "ComboboxAnchor",
	props: {
		reference: {
			type: null,
			required: !1
		},
		asChild: {
			type: Boolean,
			required: !1
		},
		as: {
			type: null,
			required: !1
		}
	},
	setup(e) {
		let { forwardRef: t } = Yp();
		return (n, r) => (U(), G(I(xh), {
			"as-child": "",
			reference: e.reference
		}, {
			default: L(() => [q(I(bm), za({
				ref: I(t),
				"as-child": e.asChild,
				as: e.as
			}, n.$attrs), {
				default: L(() => [V(n.$slots, "default")]),
				_: 3
			}, 16, ["as-child", "as"])]),
			_: 3
		}, 8, ["reference"]));
	}
}), [R_, z_] = /*#__PURE__*/ Gf("ComboboxContent"), B_ = /* @__PURE__ */ z({
	__name: "ComboboxContentImpl",
	props: {
		position: {
			type: String,
			required: !1,
			default: "inline"
		},
		bodyLock: {
			type: Boolean,
			required: !1
		},
		hideWhenEmpty: {
			type: Boolean,
			required: !1
		},
		memoDependencies: {
			type: Array,
			required: !1
		},
		side: {
			type: null,
			required: !1
		},
		sideOffset: {
			type: Number,
			required: !1
		},
		sideFlip: {
			type: Boolean,
			required: !1
		},
		align: {
			type: null,
			required: !1
		},
		alignOffset: {
			type: Number,
			required: !1
		},
		alignFlip: {
			type: Boolean,
			required: !1
		},
		avoidCollisions: {
			type: Boolean,
			required: !1
		},
		collisionBoundary: {
			type: null,
			required: !1
		},
		collisionPadding: {
			type: [Number, Object],
			required: !1
		},
		arrowPadding: {
			type: Number,
			required: !1
		},
		hideShiftedArrow: {
			type: Boolean,
			required: !1
		},
		sticky: {
			type: String,
			required: !1
		},
		hideWhenDetached: {
			type: Boolean,
			required: !1
		},
		positionStrategy: {
			type: String,
			required: !1
		},
		updatePositionStrategy: {
			type: String,
			required: !1
		},
		disableUpdateOnLayoutShift: {
			type: Boolean,
			required: !1
		},
		prioritizePosition: {
			type: Boolean,
			required: !1
		},
		reference: {
			type: null,
			required: !1
		},
		dir: {
			type: String,
			required: !1
		},
		asChild: {
			type: Boolean,
			required: !1
		},
		as: {
			type: null,
			required: !1
		},
		disableOutsidePointerEvents: {
			type: Boolean,
			required: !1
		},
		present: {
			type: Boolean,
			required: !1,
			default: !0
		}
	},
	emits: [
		"escapeKeyDown",
		"pointerDownOutside",
		"focusOutside",
		"interactOutside"
	],
	setup(e, { emit: t }) {
		let n = e, r = t, { position: i } = /* @__PURE__ */ dn(n), a = P_(), o = Symbol("ComboboxContent");
		R(i, (e) => a.onContentPositionChange(o, e), { immediate: !0 });
		let s = X(() => a.ignoreFilter.value ? a.allItems.value.size === 0 : a.filterState.value.count === 0), { forwardRef: c, currentElement: l } = Yp(), u = Fp(n.present && n.bodyLock);
		R([() => n.present, () => n.bodyLock], ([e, t]) => u.value = e && t), Kp(), sm(X(() => n.present ? a.parentElement.value : void 0));
		let d = Xp(X(() => {
			if (n.position === "popper") {
				let { present: e, ...t } = n;
				return t;
			}
			return {};
		})), f = {
			boxSizing: "border-box",
			"--reka-combobox-content-transform-origin": "var(--reka-popper-transform-origin)",
			"--reka-combobox-content-available-width": "var(--reka-popper-available-width)",
			"--reka-combobox-content-available-height": "var(--reka-popper-available-height)",
			"--reka-combobox-trigger-width": "var(--reka-popper-anchor-width)",
			"--reka-combobox-trigger-height": "var(--reka-popper-anchor-height)"
		};
		z_({ position: i });
		let p = /* @__PURE__ */ P(!1);
		zr(() => {
			a.inputElement.value && (p.value = l.value.contains(a.inputElement.value), n.present && p.value && a.inputElement.value.focus());
		}), R(() => n.present, async (e, t) => {
			if (e || !t) return;
			let n = Kf();
			n && l.value.contains(n) && (await Fn(), a.triggerElement.value?.focus());
		}), Ur(() => {
			a.onContentUnmount(o);
			let e = Kf();
			p.value && (!e || e === document.body) && a.triggerElement.value?.focus();
		});
		function m(e) {
			if (a.parentElement.value?.contains(e)) return !0;
			let t = (e instanceof Element ? e.closest("label") : null)?.control;
			return !!t && !!a.parentElement.value?.contains(t);
		}
		let h = { placed: () => a.onContentPlaced(o) };
		return (t, o) => (U(), G(I(dh), { "as-child": "" }, {
			default: L(() => [q(I(Wm), {
				"as-child": "",
				present: n.present,
				onMountAutoFocus: o[5] ||= hs(() => {}, ["prevent"]),
				onUnmountAutoFocus: o[6] ||= hs(() => {}, ["prevent"])
			}, {
				default: L(() => [q(I(km), {
					"as-child": "",
					present: n.present,
					"disable-outside-pointer-events": e.disableOutsidePointerEvents,
					onDismiss: o[0] ||= (e) => I(a).onOpenChange(!1),
					onFocusOutside: o[1] ||= (e) => {
						m(e.target) && e.preventDefault(), r("focusOutside", e);
					},
					onInteractOutside: o[2] ||= (e) => r("interactOutside", e),
					onEscapeKeyDown: o[3] ||= (e) => r("escapeKeyDown", e),
					onPointerDownOutside: o[4] ||= (e) => {
						m(e.target) && e.preventDefault(), r("pointerDownOutside", e);
					}
				}, {
					default: L(() => [(U(), G(Xr(I(i) === "popper" ? I(M_) : I(bm)), za({
						...t.$attrs,
						...I(d)
					}, {
						id: I(a).contentId,
						ref: I(c),
						"memo-dependencies": I(i) === "popper" ? [I(a).filterSearch.value, I(a).filterState.value] : void 0,
						"data-state": I(a).open.value ? "open" : "closed",
						"data-empty": s.value ? "" : void 0,
						style: {
							display: n.hideWhenEmpty && s.value ? "none" : "flex",
							flexDirection: "column",
							outline: "none",
							...I(i) === "popper" ? f : {}
						}
					}, ti(I(i) === "popper" ? h : {})), {
						default: L(() => [V(t.$slots, "default")]),
						_: 3
					}, 16, [
						"id",
						"memo-dependencies",
						"data-state",
						"data-empty",
						"style"
					]))]),
					_: 3
				}, 8, ["present", "disable-outside-pointer-events"])]),
				_: 3
			}, 8, ["present"])]),
			_: 3
		}));
	}
}), V_ = /* @__PURE__ */ z({
	__name: "ComboboxContent",
	props: {
		forceMount: {
			type: Boolean,
			required: !1
		},
		position: {
			type: String,
			required: !1
		},
		bodyLock: {
			type: Boolean,
			required: !1
		},
		hideWhenEmpty: {
			type: Boolean,
			required: !1
		},
		memoDependencies: {
			type: Array,
			required: !1
		},
		side: {
			type: null,
			required: !1
		},
		sideOffset: {
			type: Number,
			required: !1
		},
		sideFlip: {
			type: Boolean,
			required: !1
		},
		align: {
			type: null,
			required: !1
		},
		alignOffset: {
			type: Number,
			required: !1
		},
		alignFlip: {
			type: Boolean,
			required: !1
		},
		avoidCollisions: {
			type: Boolean,
			required: !1
		},
		collisionBoundary: {
			type: null,
			required: !1
		},
		collisionPadding: {
			type: [Number, Object],
			required: !1
		},
		arrowPadding: {
			type: Number,
			required: !1
		},
		hideShiftedArrow: {
			type: Boolean,
			required: !1
		},
		sticky: {
			type: String,
			required: !1
		},
		hideWhenDetached: {
			type: Boolean,
			required: !1
		},
		positionStrategy: {
			type: String,
			required: !1
		},
		updatePositionStrategy: {
			type: String,
			required: !1
		},
		disableUpdateOnLayoutShift: {
			type: Boolean,
			required: !1
		},
		prioritizePosition: {
			type: Boolean,
			required: !1
		},
		reference: {
			type: null,
			required: !1
		},
		dir: {
			type: String,
			required: !1
		},
		asChild: {
			type: Boolean,
			required: !1
		},
		as: {
			type: null,
			required: !1
		},
		disableOutsidePointerEvents: {
			type: Boolean,
			required: !1
		}
	},
	emits: [
		"escapeKeyDown",
		"pointerDownOutside",
		"focusOutside",
		"interactOutside"
	],
	setup(e, { emit: t }) {
		let n = Zp(e, t), { forwardRef: r } = Yp(), i = P_();
		return i.contentId ||= cm(void 0, "reka-combobox-content"), (t, a) => (U(), G(I(_m), {
			present: e.forceMount || I(i).open.value,
			"force-mount": e.forceMount || !I(i).unmountOnHide.value
		}, {
			default: L(({ present: e }) => [qn(q(B_, za({
				...I(n),
				...t.$attrs
			}, {
				ref: I(r),
				present: I(i).unmountOnHide.value || e
			}), {
				default: L(() => [V(t.$slots, "default")]),
				_: 3
			}, 16, ["present"]), [[wo, I(i).unmountOnHide.value || e]])]),
			_: 3
		}, 8, ["present", "force-mount"]));
	}
}), H_ = /* @__PURE__ */ z({
	__name: "ComboboxEmpty",
	props: {
		asChild: {
			type: Boolean,
			required: !1
		},
		as: {
			type: null,
			required: !1
		}
	},
	setup(e) {
		let t = e, n = P_(), r = X(() => n.ignoreFilter.value ? n.allItems.value.size === 0 : n.filterState.value.count === 0);
		return (e, n) => r.value ? (U(), G(I(bm), he(za({ key: 0 }, t)), {
			default: L(() => [V(e.$slots, "default", {}, () => [n[0] ||= J("No options", -1)])]),
			_: 3
		}, 16)) : Y("v-if", !0);
	}
}), [U_, W_] = /*#__PURE__*/ Gf("ComboboxGroup"), G_ = /* @__PURE__ */ z({
	__name: "ComboboxInput",
	props: {
		displayValue: {
			type: Function,
			required: !1
		},
		modelValue: {
			type: String,
			required: !1
		},
		autoFocus: {
			type: Boolean,
			required: !1
		},
		disabled: {
			type: Boolean,
			required: !1
		},
		asChild: {
			type: Boolean,
			required: !1
		},
		as: {
			type: null,
			required: !1,
			default: "input"
		}
	},
	emits: ["update:modelValue"],
	setup(e, { emit: t }) {
		let n = e, r = t, i = P_(), a = oh(), { primitiveElement: o, currentElement: s } = xm(), c = Sp(n, "modelValue", r, { passive: n.modelValue === void 0 });
		zr(() => {
			s.value && i.onInputElementChange(s.value);
		});
		let { isComposing: l, shouldDeferInput: u, handleCompositionStart: d, handleCompositionUpdate: f, handleCompositionEnd: p } = Vp((e) => {
			let t = e.target;
			t && h(t.value);
		});
		function m(e) {
			l.value || (e.preventDefault(), i.open.value || i.onOpenChange(!0));
		}
		function h(e) {
			i.open.value ? i.filterSearch.value = e : (i.onOpenChange(!0), Fn(() => {
				e && (i.filterSearch.value = e, a.highlightFirstItem());
			}));
		}
		function g(e) {
			u.value || h(e.target.value);
		}
		function _() {
			i.openOnFocus.value && !i.open.value && i.onOpenChange(!0);
		}
		function v(e) {
			if (!i.open.value) return;
			let t = e.relatedTarget;
			if (!t) return;
			let n = i.parentElement.value?.contains(t), r = document.getElementById(i.contentId)?.contains(t);
			!n && !r && requestAnimationFrame(() => {
				if (!i.open.value) return;
				let e = document.activeElement;
				!i.parentElement.value?.contains(e) && !document.getElementById(i.contentId)?.contains(e) && i.onOpenChange(!1);
			});
		}
		function y() {
			i.openOnClick.value && !i.open.value && i.onOpenChange(!0);
		}
		function b() {
			let e = i.modelValue.value;
			n.displayValue ? c.value = n.displayValue(e) : !i.multiple.value && e && !Array.isArray(e) ? typeof e == "object" ? c.value = "" : c.value = e.toString() : c.value = "", Fn(() => {
				c.value = c.value;
			});
		}
		return i.onResetSearchTerm(() => {
			b();
		}), R(i.modelValue, async () => {
			!i.isUserInputted.value && i.resetSearchTermOnSelect.value && b();
		}, {
			immediate: !0,
			deep: !0
		}), R(i.filterState, (e, t) => {
			!i.isVirtual.value && t.count === 0 && a.highlightFirstItem();
		}), (t, n) => (U(), G(I(fh), {
			ref_key: "primitiveElement",
			ref: o,
			modelValue: I(c),
			"onUpdate:modelValue": n[0] ||= (e) => /* @__PURE__ */ tn(c) ? c.value = e : null,
			as: e.as,
			"as-child": e.asChild,
			"auto-focus": e.autoFocus,
			disabled: e.disabled,
			"aria-expanded": I(i).open.value,
			"aria-controls": I(i).contentId,
			"aria-autocomplete": "list",
			role: "combobox",
			autocomplete: "off",
			onClick: y,
			onInput: g,
			onKeydown: _s(m, ["down", "up"]),
			onFocus: _,
			onBlur: v,
			onCompositionstart: I(d),
			onCompositionupdate: I(f),
			onCompositionend: I(p)
		}, {
			default: L(() => [V(t.$slots, "default")]),
			_: 3
		}, 8, [
			"modelValue",
			"as",
			"as-child",
			"auto-focus",
			"disabled",
			"aria-expanded",
			"aria-controls",
			"onCompositionstart",
			"onCompositionupdate",
			"onCompositionend"
		]));
	}
}), K_ = /* @__PURE__ */ z({
	__name: "ComboboxItem",
	props: {
		textValue: {
			type: String,
			required: !1
		},
		value: {
			type: null,
			required: !0
		},
		disabled: {
			type: Boolean,
			required: !1
		},
		asChild: {
			type: Boolean,
			required: !1
		},
		as: {
			type: null,
			required: !1
		}
	},
	emits: ["select"],
	setup(e, { emit: t }) {
		let n = e, r = t, i = cm(void 0, "reka-combobox-item"), a = P_(), o = U_(null), { primitiveElement: s, currentElement: c } = xm();
		if (n.value === "") throw Error("A <ComboboxItem /> must have a value prop that is not an empty string. This is because the Combobox value can be set to an empty string to clear the selection and show the placeholder.");
		let l = X(() => {
			if (a.isVirtual.value || a.ignoreFilter.value || !a.filterSearch.value) return !0;
			{
				let e = a.filterState.value.items.get(i);
				return e === void 0 || e > 0;
			}
		});
		return zr(() => {
			a.allItems.value.set(i, n.textValue || c.value.textContent || c.value.innerText);
			let e = o?.id;
			e && (a.allGroups.value.has(e) ? a.allGroups.value.get(e)?.add(i) : a.allGroups.value.set(e, /* @__PURE__ */ new Set([i])));
		}), Ur(() => {
			a.allItems.value.delete(i);
		}), (t, o) => l.value ? co([
			l.value,
			I(a).filterSearch.value,
			I(a).disabled.value,
			e.disabled,
			n.value,
			n.as,
			n.asChild,
			...Object.values(t.$attrs)
		], () => (U(), G(I(gh), za({ key: 0 }, n, {
			id: I(i),
			ref_key: "primitiveElement",
			ref: s,
			disabled: I(a).disabled.value || e.disabled,
			onSelect: o[0] ||= (t) => {
				r("select", t), t.defaultPrevented || (!I(a).multiple.value && !e.disabled && !I(a).disabled.value ? (t.preventDefault(), I(a).onOpenChange(!1), I(a).modelValue.value = n.value) : I(a).multiple.value && I(a).inputElement.value?.focus());
			}
		}), {
			default: L((n) => [V(t.$slots, "default", he(Pa(n)), () => [J(N(e.value), 1)])]),
			_: 3
		}, 16, ["id", "disabled"])), o, 1) : Y("v-if", !0);
	}
}), q_ = /* @__PURE__ */ z({
	__name: "ComboboxItemIndicator",
	props: {
		forceMount: {
			type: Boolean,
			required: !1
		},
		asChild: {
			type: Boolean,
			required: !1
		},
		as: {
			type: null,
			required: !1,
			default: "span"
		}
	},
	setup(e) {
		let t = e;
		return (e, n) => (U(), G(I(_h), he(Pa(t)), {
			default: L(() => [V(e.$slots, "default")]),
			_: 3
		}, 16));
	}
}), J_ = /* @__PURE__ */ z({
	__name: "ComboboxPortal",
	props: {
		to: {
			type: null,
			required: !1
		},
		disabled: {
			type: Boolean,
			required: !1
		},
		defer: {
			type: Boolean,
			required: !1
		},
		forceMount: {
			type: Boolean,
			required: !1
		}
	},
	setup(e) {
		let t = e;
		return (e, n) => (U(), G(I(Ym), he(Pa(t)), {
			default: L(() => [V(e.$slots, "default")]),
			_: 3
		}, 16));
	}
}), Y_ = /* @__PURE__ */ z({
	__name: "ComboboxTrigger",
	props: {
		disabled: {
			type: Boolean,
			required: !1
		},
		asChild: {
			type: Boolean,
			required: !1
		},
		as: {
			type: null,
			required: !1,
			default: "button"
		}
	},
	setup(e) {
		let t = e, { forwardRef: n, currentElement: r } = Yp(), i = P_(), a = X(() => t.disabled || i.disabled.value || !1);
		return zr(() => {
			r.value && i.onTriggerElementChange(r.value);
		}), (r, o) => (U(), G(I(bm), za(t, {
			ref: I(n),
			type: e.as === "button" ? "button" : void 0,
			tabindex: "-1",
			"aria-label": "Show popup",
			"aria-haspopup": "listbox",
			"aria-expanded": I(i).open.value,
			"aria-controls": I(i).contentId,
			"data-state": I(i).open.value ? "open" : "closed",
			disabled: a.value,
			"data-disabled": a.value ? "" : void 0,
			"aria-disabled": a.value ?? void 0,
			onClick: o[0] ||= (e) => I(i).onOpenChange(!I(i).open.value)
		}), {
			default: L(() => [V(r.$slots, "default")]),
			_: 3
		}, 16, [
			"type",
			"aria-expanded",
			"aria-controls",
			"data-state",
			"disabled",
			"data-disabled",
			"aria-disabled"
		]));
	}
});
// node_modules/.pnpm/reka-ui@2.11.0_vue@3.5.42_typescript@6.0.3_/node_modules/reka-ui/dist/shared/useNonce.js
function X_(e) {
	let t = wp({ nonce: /* @__PURE__ */ P() });
	return X(() => e?.value || t.nonce?.value);
}
// node_modules/.pnpm/reka-ui@2.11.0_vue@3.5.42_typescript@6.0.3_/node_modules/reka-ui/dist/Combobox/ComboboxViewport.js
var Z_ = /* @__PURE__ */ z({
	__name: "ComboboxViewport",
	props: {
		nonce: {
			type: String,
			required: !1
		},
		asChild: {
			type: Boolean,
			required: !1
		},
		as: {
			type: null,
			required: !1
		}
	},
	setup(e) {
		let t = e, { forwardRef: n } = Yp(), { nonce: r } = /* @__PURE__ */ dn(t), i = X_(r), a = P_();
		return (e, r) => (U(), W(H, null, [q(I(bm), za({
			...e.$attrs,
			...t
		}, {
			ref: I(n),
			"data-reka-combobox-viewport": "",
			role: "presentation",
			style: {
				position: "relative",
				flex: I(a).isVirtual.value ? void 0 : 1,
				overflow: "auto"
			}
		}), {
			default: L(() => [V(e.$slots, "default")]),
			_: 3
		}, 16, ["style"]), q(I(bm), {
			as: "style",
			nonce: I(i)
		}, {
			default: L(() => [...r[0] ||= [J(" /* Hide scrollbars cross-browser and enable momentum scroll for touch devices */ [data-reka-combobox-viewport] { scrollbar-width:none; -ms-overflow-style: none; -webkit-overflow-scrolling: touch; } [data-reka-combobox-viewport]::-webkit-scrollbar { display: none; } ", -1)]]),
			_: 1
		}, 8, ["nonce"])], 64));
	}
}), [Q_, $_] = /*#__PURE__*/ Gf("FieldRoot"), [ev, tv] = /*#__PURE__*/ Gf("PopoverRoot"), nv = /* @__PURE__ */ z({
	__name: "PopoverRoot",
	props: {
		defaultOpen: {
			type: Boolean,
			required: !1,
			default: !1
		},
		open: {
			type: Boolean,
			required: !1,
			default: void 0
		},
		modal: {
			type: Boolean,
			required: !1,
			default: !1
		}
	},
	emits: ["update:open"],
	setup(e, { emit: t }) {
		let n = e, r = t, { modal: i } = /* @__PURE__ */ dn(n), a = Sp(n, "open", r, {
			defaultValue: n.defaultOpen,
			passive: n.open === void 0
		});
		return tv({
			contentId: "",
			triggerId: "",
			modal: i,
			open: a,
			onOpenChange: (e) => {
				a.value = e;
			},
			onOpenToggle: () => {
				a.value = !a.value;
			},
			triggerElement: /* @__PURE__ */ P(),
			hasCustomAnchor: /* @__PURE__ */ P(!1)
		}), (e, t) => (U(), G(I(bh), null, {
			default: L(() => [V(e.$slots, "default", {
				open: I(a),
				close: () => a.value = !1
			})]),
			_: 3
		}));
	}
}), rv = /* @__PURE__ */ z({
	__name: "PopoverContentImpl",
	props: {
		trapFocus: {
			type: Boolean,
			required: !1
		},
		memoDependencies: {
			type: Array,
			required: !1
		},
		side: {
			type: null,
			required: !1
		},
		sideOffset: {
			type: Number,
			required: !1
		},
		sideFlip: {
			type: Boolean,
			required: !1
		},
		align: {
			type: null,
			required: !1
		},
		alignOffset: {
			type: Number,
			required: !1
		},
		alignFlip: {
			type: Boolean,
			required: !1
		},
		avoidCollisions: {
			type: Boolean,
			required: !1
		},
		collisionBoundary: {
			type: null,
			required: !1
		},
		collisionPadding: {
			type: [Number, Object],
			required: !1
		},
		arrowPadding: {
			type: Number,
			required: !1
		},
		hideShiftedArrow: {
			type: Boolean,
			required: !1
		},
		sticky: {
			type: String,
			required: !1
		},
		hideWhenDetached: {
			type: Boolean,
			required: !1
		},
		positionStrategy: {
			type: String,
			required: !1
		},
		updatePositionStrategy: {
			type: String,
			required: !1
		},
		disableUpdateOnLayoutShift: {
			type: Boolean,
			required: !1
		},
		prioritizePosition: {
			type: Boolean,
			required: !1
		},
		reference: {
			type: null,
			required: !1
		},
		dir: {
			type: String,
			required: !1
		},
		asChild: {
			type: Boolean,
			required: !1
		},
		as: {
			type: null,
			required: !1
		},
		disableOutsidePointerEvents: {
			type: Boolean,
			required: !1
		}
	},
	emits: [
		"escapeKeyDown",
		"pointerDownOutside",
		"focusOutside",
		"interactOutside",
		"openAutoFocus",
		"closeAutoFocus"
	],
	setup(e, { emit: t }) {
		let n = e, r = t, i = Xp(lp(n, "trapFocus", "disableOutsidePointerEvents")), { forwardRef: a } = Yp(), o = ev();
		return Kp(), (t, n) => (U(), G(I(Wm), {
			"as-child": "",
			loop: "",
			trapped: e.trapFocus,
			onMountAutoFocus: n[5] ||= (e) => r("openAutoFocus", e),
			onUnmountAutoFocus: n[6] ||= (e) => r("closeAutoFocus", e)
		}, {
			default: L(() => [q(I(km), {
				"as-child": "",
				"disable-outside-pointer-events": e.disableOutsidePointerEvents,
				onPointerDownOutside: n[0] ||= (e) => r("pointerDownOutside", e),
				onInteractOutside: n[1] ||= (e) => r("interactOutside", e),
				onEscapeKeyDown: n[2] ||= (e) => r("escapeKeyDown", e),
				onFocusOutside: n[3] ||= (e) => r("focusOutside", e),
				onDismiss: n[4] ||= (e) => I(o).onOpenChange(!1)
			}, {
				default: L(() => [q(I(M_), za(I(i), {
					id: I(o).contentId,
					ref: I(a),
					"data-state": I(o).open.value ? "open" : "closed",
					"aria-labelledby": I(o).triggerId,
					style: {
						"--reka-popover-content-transform-origin": "var(--reka-popper-transform-origin)",
						"--reka-popover-content-available-width": "var(--reka-popper-available-width)",
						"--reka-popover-content-available-height": "var(--reka-popper-available-height)",
						"--reka-popover-trigger-width": "var(--reka-popper-anchor-width)",
						"--reka-popover-trigger-height": "var(--reka-popper-anchor-height)"
					},
					role: "dialog"
				}), {
					default: L(() => [V(t.$slots, "default")]),
					_: 3
				}, 16, [
					"id",
					"data-state",
					"aria-labelledby"
				])]),
				_: 3
			}, 8, ["disable-outside-pointer-events"])]),
			_: 3
		}, 8, ["trapped"]));
	}
}), iv = /* @__PURE__ */ z({
	__name: "PopoverContentModal",
	props: {
		memoDependencies: {
			type: Array,
			required: !1
		},
		side: {
			type: null,
			required: !1
		},
		sideOffset: {
			type: Number,
			required: !1
		},
		sideFlip: {
			type: Boolean,
			required: !1
		},
		align: {
			type: null,
			required: !1
		},
		alignOffset: {
			type: Number,
			required: !1
		},
		alignFlip: {
			type: Boolean,
			required: !1
		},
		avoidCollisions: {
			type: Boolean,
			required: !1
		},
		collisionBoundary: {
			type: null,
			required: !1
		},
		collisionPadding: {
			type: [Number, Object],
			required: !1
		},
		arrowPadding: {
			type: Number,
			required: !1
		},
		hideShiftedArrow: {
			type: Boolean,
			required: !1
		},
		sticky: {
			type: String,
			required: !1
		},
		hideWhenDetached: {
			type: Boolean,
			required: !1
		},
		positionStrategy: {
			type: String,
			required: !1
		},
		updatePositionStrategy: {
			type: String,
			required: !1
		},
		disableUpdateOnLayoutShift: {
			type: Boolean,
			required: !1
		},
		prioritizePosition: {
			type: Boolean,
			required: !1
		},
		reference: {
			type: null,
			required: !1
		},
		dir: {
			type: String,
			required: !1
		},
		asChild: {
			type: Boolean,
			required: !1
		},
		as: {
			type: null,
			required: !1
		},
		disableOutsidePointerEvents: {
			type: Boolean,
			required: !1
		}
	},
	emits: [
		"escapeKeyDown",
		"pointerDownOutside",
		"focusOutside",
		"interactOutside",
		"openAutoFocus",
		"closeAutoFocus"
	],
	setup(e, { emit: t }) {
		let n = e, r = t, i = ev(), a = /* @__PURE__ */ P(!1);
		Fp(!0);
		let o = Zp(n, r), { forwardRef: s, currentElement: c } = Yp();
		return sm(c), (e, t) => (U(), G(rv, za(I(o), {
			ref: I(s),
			"trap-focus": I(i).open.value,
			"disable-outside-pointer-events": "",
			onCloseAutoFocus: t[0] ||= hs((e) => {
				r("closeAutoFocus", e), a.value || I(i).triggerElement.value?.focus();
			}, ["prevent"]),
			onPointerDownOutside: t[1] ||= (e) => {
				r("pointerDownOutside", e);
				let t = e.detail.originalEvent, n = t.button === 0 && t.ctrlKey === !0, i = t.button === 2 || n;
				a.value = i;
			},
			onFocusOutside: t[2] ||= hs(() => {}, ["prevent"])
		}), {
			default: L(() => [V(e.$slots, "default")]),
			_: 3
		}, 16, ["trap-focus"]));
	}
}), av = /* @__PURE__ */ z({
	__name: "PopoverContentNonModal",
	props: {
		memoDependencies: {
			type: Array,
			required: !1
		},
		side: {
			type: null,
			required: !1
		},
		sideOffset: {
			type: Number,
			required: !1
		},
		sideFlip: {
			type: Boolean,
			required: !1
		},
		align: {
			type: null,
			required: !1
		},
		alignOffset: {
			type: Number,
			required: !1
		},
		alignFlip: {
			type: Boolean,
			required: !1
		},
		avoidCollisions: {
			type: Boolean,
			required: !1
		},
		collisionBoundary: {
			type: null,
			required: !1
		},
		collisionPadding: {
			type: [Number, Object],
			required: !1
		},
		arrowPadding: {
			type: Number,
			required: !1
		},
		hideShiftedArrow: {
			type: Boolean,
			required: !1
		},
		sticky: {
			type: String,
			required: !1
		},
		hideWhenDetached: {
			type: Boolean,
			required: !1
		},
		positionStrategy: {
			type: String,
			required: !1
		},
		updatePositionStrategy: {
			type: String,
			required: !1
		},
		disableUpdateOnLayoutShift: {
			type: Boolean,
			required: !1
		},
		prioritizePosition: {
			type: Boolean,
			required: !1
		},
		reference: {
			type: null,
			required: !1
		},
		dir: {
			type: String,
			required: !1
		},
		asChild: {
			type: Boolean,
			required: !1
		},
		as: {
			type: null,
			required: !1
		},
		disableOutsidePointerEvents: {
			type: Boolean,
			required: !1
		}
	},
	emits: [
		"escapeKeyDown",
		"pointerDownOutside",
		"focusOutside",
		"interactOutside",
		"openAutoFocus",
		"closeAutoFocus"
	],
	setup(e, { emit: t }) {
		let n = e, r = t, i = ev(), a = /* @__PURE__ */ P(!1), o = /* @__PURE__ */ P(!1), s = Zp(n, r);
		return (e, t) => (U(), G(rv, za(I(s), {
			"trap-focus": !1,
			"disable-outside-pointer-events": !1,
			onCloseAutoFocus: t[0] ||= (e) => {
				r("closeAutoFocus", e), e.defaultPrevented || (a.value || I(i).triggerElement.value?.focus(), e.preventDefault()), a.value = !1, o.value = !1;
			},
			onInteractOutside: t[1] ||= async (e) => {
				r("interactOutside", e), e.defaultPrevented || (a.value = !0, e.detail.originalEvent.type === "pointerdown" && (o.value = !0));
				let t = e.target;
				I(i).triggerElement.value?.contains(t) && e.preventDefault(), e.detail.originalEvent.type === "focusin" && o.value && e.preventDefault();
			}
		}), {
			default: L(() => [V(e.$slots, "default")]),
			_: 3
		}, 16));
	}
}), ov = /* @__PURE__ */ z({
	__name: "PopoverContent",
	props: {
		forceMount: {
			type: Boolean,
			required: !1
		},
		memoDependencies: {
			type: Array,
			required: !1
		},
		side: {
			type: null,
			required: !1
		},
		sideOffset: {
			type: Number,
			required: !1
		},
		sideFlip: {
			type: Boolean,
			required: !1
		},
		align: {
			type: null,
			required: !1
		},
		alignOffset: {
			type: Number,
			required: !1
		},
		alignFlip: {
			type: Boolean,
			required: !1
		},
		avoidCollisions: {
			type: Boolean,
			required: !1
		},
		collisionBoundary: {
			type: null,
			required: !1
		},
		collisionPadding: {
			type: [Number, Object],
			required: !1
		},
		arrowPadding: {
			type: Number,
			required: !1
		},
		hideShiftedArrow: {
			type: Boolean,
			required: !1
		},
		sticky: {
			type: String,
			required: !1
		},
		hideWhenDetached: {
			type: Boolean,
			required: !1
		},
		positionStrategy: {
			type: String,
			required: !1
		},
		updatePositionStrategy: {
			type: String,
			required: !1
		},
		disableUpdateOnLayoutShift: {
			type: Boolean,
			required: !1
		},
		prioritizePosition: {
			type: Boolean,
			required: !1
		},
		reference: {
			type: null,
			required: !1
		},
		dir: {
			type: String,
			required: !1
		},
		asChild: {
			type: Boolean,
			required: !1
		},
		as: {
			type: null,
			required: !1
		},
		disableOutsidePointerEvents: {
			type: Boolean,
			required: !1
		}
	},
	emits: [
		"escapeKeyDown",
		"pointerDownOutside",
		"focusOutside",
		"interactOutside",
		"openAutoFocus",
		"closeAutoFocus"
	],
	setup(e, { emit: t }) {
		let n = e, r = t, i = ev(), a = Zp(n, r), { forwardRef: o } = Yp();
		return i.contentId ||= cm(void 0, "reka-popover-content"), (t, n) => (U(), G(I(_m), { present: e.forceMount || I(i).open.value }, {
			default: L(() => [I(i).modal.value ? (U(), G(iv, za({ key: 0 }, I(a), { ref: I(o) }), {
				default: L(() => [V(t.$slots, "default")]),
				_: 3
			}, 16)) : (U(), G(av, za({ key: 1 }, I(a), { ref: I(o) }), {
				default: L(() => [V(t.$slots, "default")]),
				_: 3
			}, 16))]),
			_: 3
		}, 8, ["present"]));
	}
}), sv = /* @__PURE__ */ z({
	__name: "PopoverPortal",
	props: {
		to: {
			type: null,
			required: !1
		},
		disabled: {
			type: Boolean,
			required: !1
		},
		defer: {
			type: Boolean,
			required: !1
		},
		forceMount: {
			type: Boolean,
			required: !1
		}
	},
	setup(e) {
		let t = e;
		return (e, n) => (U(), G(I(Ym), he(Pa(t)), {
			default: L(() => [V(e.$slots, "default")]),
			_: 3
		}, 16));
	}
}), cv = /* @__PURE__ */ z({
	__name: "PopoverTrigger",
	props: {
		asChild: {
			type: Boolean,
			required: !1
		},
		as: {
			type: null,
			required: !1,
			default: "button"
		}
	},
	setup(e) {
		let t = e, n = ev(), { forwardRef: r, currentElement: i } = Yp();
		return n.triggerId ||= cm(void 0, "reka-popover-trigger"), n.contentId ||= cm(void 0, "reka-popover-content"), zr(() => {
			n.triggerElement.value = i.value;
		}), (i, a) => (U(), G(Xr(I(n).hasCustomAnchor.value ? I(bm) : I(xh)), { "as-child": "" }, {
			default: L(() => [q(I(bm), {
				id: I(n).triggerId,
				ref: I(r),
				type: e.as === "button" ? "button" : void 0,
				"aria-haspopup": "dialog",
				"aria-expanded": I(n).open.value,
				"aria-controls": I(n).open.value ? I(n).contentId : void 0,
				"data-state": I(n).open.value ? "open" : "closed",
				as: e.as,
				"as-child": t.asChild,
				onClick: I(n).onOpenToggle
			}, {
				default: L(() => [V(i.$slots, "default")]),
				_: 3
			}, 8, [
				"id",
				"type",
				"aria-expanded",
				"aria-controls",
				"data-state",
				"as",
				"as-child",
				"onClick"
			])]),
			_: 3
		}));
	}
}), lv = [
	" ",
	"Enter",
	"ArrowUp",
	"ArrowDown"
], uv = [" ", "Enter"];
function dv(e, t, n) {
	return e === void 0 ? !1 : Array.isArray(e) ? e.some((e) => fv(e, t, n)) : fv(e, t, n);
}
function fv(e, t, n) {
	return e === void 0 || t === void 0 ? !1 : typeof e == "string" ? e === t : typeof n == "function" ? n(e, t) : typeof n == "string" ? e?.[n] === t?.[n] : Hf(e, t);
}
function pv(e) {
	return e == null || e === "" || Array.isArray(e) && e.length === 0;
}
// node_modules/.pnpm/reka-ui@2.11.0_vue@3.5.42_typescript@6.0.3_/node_modules/reka-ui/dist/Select/SelectRoot.js
var mv = ["value"], [hv, gv] = /*#__PURE__*/ Gf("SelectRoot"), _v = /* @__PURE__ */ z({
	inheritAttrs: !1,
	__name: "SelectRoot",
	props: {
		open: {
			type: Boolean,
			required: !1,
			default: void 0
		},
		defaultOpen: {
			type: Boolean,
			required: !1
		},
		defaultValue: {
			type: null,
			required: !1
		},
		modelValue: {
			type: null,
			required: !1,
			default: void 0
		},
		nullableValue: {
			type: String,
			required: !1,
			default: ""
		},
		by: {
			type: [String, Function],
			required: !1
		},
		dir: {
			type: String,
			required: !1
		},
		multiple: {
			type: Boolean,
			required: !1
		},
		autocomplete: {
			type: String,
			required: !1
		},
		disabled: {
			type: Boolean,
			required: !1
		},
		name: {
			type: String,
			required: !1
		},
		required: {
			type: Boolean,
			required: !1
		}
	},
	emits: ["update:modelValue", "update:open"],
	setup(e, { emit: t }) {
		let n = e, r = t, { multiple: i, dir: a } = /* @__PURE__ */ dn(n), o = Q_(null), s = X(() => n.name ?? o?.name.value), c = X(() => o ? n.required || o.required.value : n.required), l = X(() => !!(n.disabled || o?.disabled.value)), u = Sp(n, "modelValue", r, {
			defaultValue: n.defaultValue ?? (i.value ? [] : void 0),
			passive: n.modelValue === void 0,
			deep: !0
		}), d = Sp(n, "open", r, {
			defaultValue: n.defaultOpen,
			passive: n.open === void 0
		}), f = /* @__PURE__ */ P(), p = /* @__PURE__ */ P(), m = /* @__PURE__ */ P({
			x: 0,
			y: 0
		}), h = X(() => i.value && Array.isArray(u.value) ? u.value?.length === 0 : Jf(u.value));
		R(u, () => {
			o?.reportControlState({ filled: !h.value });
		}), Zm({ isProvider: !0 });
		let g = Hp(a), _ = Jp(f), v = /* @__PURE__ */ P(/* @__PURE__ */ new Set()), y = X(() => Array.from(v.value).map((e) => e.value).join(";"));
		function b(e) {
			let t;
			if (i.value) {
				let r = Array.isArray(u.value) ? [...u.value] : [], i = r.findIndex((t) => fv(t, e, n.by));
				i === -1 ? r.push(e) : r.splice(i, 1), t = [...r];
			} else t = e;
			u.value = t, o?.handleControlInput({ value: t });
		}
		function x(e) {
			return Array.from(v.value).find((t) => dv(e, t.value, n.by));
		}
		return gv({
			triggerElement: f,
			onTriggerChange: (e) => {
				f.value = e;
			},
			valueElement: p,
			onValueElementChange: (e) => {
				p.value = e;
			},
			contentId: "",
			modelValue: u,
			onValueChange: b,
			by: n.by,
			open: d,
			multiple: i,
			required: c,
			onOpenChange: (e) => {
				d.value = e;
			},
			dir: g,
			triggerPointerDownPosRef: m,
			disabled: l,
			isEmptyModelValue: h,
			optionsSet: v,
			onOptionAdd: (e) => {
				let t = x(e.value);
				t && v.value.delete(t), v.value.add(e);
			},
			onOptionRemove: (e) => {
				let t = x(e.value);
				t && v.value.delete(t);
			}
		}), (t, n) => (U(), G(I(bh), null, {
			default: L(() => [V(t.$slots, "default", {
				modelValue: I(u),
				open: I(d)
			}), I(_) && s.value ? (U(), G(vv, {
				key: y.value,
				"aria-hidden": "true",
				tabindex: "-1",
				multiple: I(i),
				required: c.value,
				name: s.value,
				autocomplete: e.autocomplete,
				disabled: l.value,
				value: I(u)
			}, {
				default: L(() => [I(Jf)(I(u)) ? (U(), W("option", {
					key: 0,
					value: e.nullableValue
				}, null, 8, mv)) : Y("v-if", !0), (U(!0), W(H, null, B(Array.from(v.value), (e) => (U(), W("option", za({ key: e.value ?? "" }, { ref_for: !0 }, e), null, 16))), 128))]),
				_: 1
			}, 8, [
				"multiple",
				"required",
				"name",
				"autocomplete",
				"disabled",
				"value"
			])) : Y("v-if", !0)]),
			_: 3
		}));
	}
}), vv = /* @__PURE__ */ z({
	__name: "BubbleSelect",
	props: {
		autocomplete: {
			type: String,
			required: !1
		},
		autofocus: {
			type: Boolean,
			required: !1
		},
		disabled: {
			type: Boolean,
			required: !1
		},
		form: {
			type: String,
			required: !1
		},
		multiple: {
			type: Boolean,
			required: !1
		},
		name: {
			type: String,
			required: !1
		},
		required: {
			type: Boolean,
			required: !1
		},
		size: {
			type: Number,
			required: !1
		},
		value: {
			type: null,
			required: !1
		}
	},
	setup(e) {
		let t = e, n = /* @__PURE__ */ P(), r = hv();
		R(() => t.value, (e, t) => {
			let r = window.HTMLSelectElement.prototype, i = Object.getOwnPropertyDescriptor(r, "value").set;
			if (e !== t && i && n.value) {
				let t = new Event("change", { bubbles: !0 });
				i.call(n.value, e), n.value.dispatchEvent(t);
			}
		});
		function i(e) {
			r.onValueChange(e.target.value);
		}
		return (e, r) => (U(), G(I(Qm), { "as-child": "" }, {
			default: L(() => [K("select", za({
				ref_key: "selectElement",
				ref: n
			}, t, { onInput: i }), [V(e.$slots, "default")], 16)]),
			_: 3
		}));
	}
}), yv = /* @__PURE__ */ z({
	__name: "SelectPopperPosition",
	props: {
		memoDependencies: {
			type: Array,
			required: !1
		},
		side: {
			type: null,
			required: !1
		},
		sideOffset: {
			type: Number,
			required: !1
		},
		sideFlip: {
			type: Boolean,
			required: !1
		},
		align: {
			type: null,
			required: !1,
			default: "start"
		},
		alignOffset: {
			type: Number,
			required: !1
		},
		alignFlip: {
			type: Boolean,
			required: !1
		},
		avoidCollisions: {
			type: Boolean,
			required: !1
		},
		collisionBoundary: {
			type: null,
			required: !1
		},
		collisionPadding: {
			type: [Number, Object],
			required: !1,
			default: 10
		},
		arrowPadding: {
			type: Number,
			required: !1
		},
		hideShiftedArrow: {
			type: Boolean,
			required: !1
		},
		sticky: {
			type: String,
			required: !1
		},
		hideWhenDetached: {
			type: Boolean,
			required: !1
		},
		positionStrategy: {
			type: String,
			required: !1
		},
		updatePositionStrategy: {
			type: String,
			required: !1
		},
		disableUpdateOnLayoutShift: {
			type: Boolean,
			required: !1
		},
		prioritizePosition: {
			type: Boolean,
			required: !1
		},
		reference: {
			type: null,
			required: !1
		},
		dir: {
			type: String,
			required: !1
		},
		asChild: {
			type: Boolean,
			required: !1
		},
		as: {
			type: null,
			required: !1
		}
	},
	setup(e) {
		let t = Xp(e);
		return (e, n) => (U(), G(I(M_), za(I(t), { style: {
			boxSizing: "border-box",
			"--reka-select-content-transform-origin": "var(--reka-popper-transform-origin)",
			"--reka-select-content-available-width": "var(--reka-popper-available-width)",
			"--reka-select-content-available-height": "var(--reka-popper-available-height)",
			"--reka-select-trigger-width": "var(--reka-popper-anchor-width)",
			"--reka-select-trigger-height": "var(--reka-popper-anchor-height)"
		} }), {
			default: L(() => [V(e.$slots, "default")]),
			_: 3
		}, 16));
	}
}), bv = {
	onViewportChange: () => {},
	itemTextRefCallback: () => {},
	itemRefCallback: () => {}
}, [xv, Sv] = /*#__PURE__*/ Gf("SelectContent"), Cv = /* @__PURE__ */ z({
	__name: "SelectContentImpl",
	props: {
		position: {
			type: String,
			required: !1,
			default: "item-aligned"
		},
		bodyLock: {
			type: Boolean,
			required: !1,
			default: !0
		},
		loop: {
			type: Boolean,
			required: !1
		},
		memoDependencies: {
			type: Array,
			required: !1
		},
		side: {
			type: null,
			required: !1
		},
		sideOffset: {
			type: Number,
			required: !1
		},
		sideFlip: {
			type: Boolean,
			required: !1
		},
		align: {
			type: null,
			required: !1,
			default: "start"
		},
		alignOffset: {
			type: Number,
			required: !1
		},
		alignFlip: {
			type: Boolean,
			required: !1
		},
		avoidCollisions: {
			type: Boolean,
			required: !1
		},
		collisionBoundary: {
			type: null,
			required: !1
		},
		collisionPadding: {
			type: [Number, Object],
			required: !1
		},
		arrowPadding: {
			type: Number,
			required: !1
		},
		hideShiftedArrow: {
			type: Boolean,
			required: !1
		},
		sticky: {
			type: String,
			required: !1
		},
		hideWhenDetached: {
			type: Boolean,
			required: !1
		},
		positionStrategy: {
			type: String,
			required: !1
		},
		updatePositionStrategy: {
			type: String,
			required: !1
		},
		disableUpdateOnLayoutShift: {
			type: Boolean,
			required: !1
		},
		prioritizePosition: {
			type: Boolean,
			required: !1
		},
		reference: {
			type: null,
			required: !1
		},
		dir: {
			type: String,
			required: !1
		},
		asChild: {
			type: Boolean,
			required: !1
		},
		as: {
			type: null,
			required: !1
		},
		disableOutsidePointerEvents: {
			type: Boolean,
			required: !1,
			default: !0
		}
	},
	emits: [
		"closeAutoFocus",
		"escapeKeyDown",
		"pointerDownOutside"
	],
	setup(e, { emit: t }) {
		let n = e, r = t, i = hv();
		Kp(), Fp(n.bodyLock);
		let { CollectionSlot: a, getItems: o } = Zm(), s = /* @__PURE__ */ P();
		sm(s);
		let { search: c, handleTypeaheadSearch: l } = fm(), u = /* @__PURE__ */ P(), d = /* @__PURE__ */ P(), f = /* @__PURE__ */ P(), p = /* @__PURE__ */ P(!1), m = /* @__PURE__ */ P(!1), h = /* @__PURE__ */ P(!1);
		function g() {
			d.value && s.value && Jm([d.value, s.value]);
		}
		R(p, () => {
			g();
		});
		let { onOpenChange: _, triggerPointerDownPosRef: v } = i;
		$n((e) => {
			if (!s.value) return;
			let t = {
				x: 0,
				y: 0
			}, n = (e) => {
				t = {
					x: Math.abs(Math.round(e.pageX) - (v.value?.x ?? 0)),
					y: Math.abs(Math.round(e.pageY) - (v.value?.y ?? 0))
				};
			}, r = (e) => {
				e.pointerType !== "touch" && (t.x <= 10 && t.y <= 10 ? e.preventDefault() : s.value?.contains(e.target) || _(!1), document.removeEventListener("pointermove", n), v.value = null);
			};
			v.value !== null && (document.addEventListener("pointermove", n), document.addEventListener("pointerup", r, {
				capture: !0,
				once: !0
			})), e(() => {
				document.removeEventListener("pointermove", n), document.removeEventListener("pointerup", r, { capture: !0 });
			});
		});
		function y(e) {
			let t = e.ctrlKey || e.altKey || e.metaKey;
			if (e.key === "Tab" && e.preventDefault(), e.code === "Space") {
				if (c.value === "") return;
				e.preventDefault();
			}
			if (!t && e.key.length === 1 && l(e.key, o()), [
				"ArrowUp",
				"ArrowDown",
				"Home",
				"End"
			].includes(e.key)) {
				let t = [...o().map((e) => e.ref)];
				if (["ArrowUp", "End"].includes(e.key) && (t = t.slice().reverse()), ["ArrowUp", "ArrowDown"].includes(e.key)) {
					let r = e.target, i = t.indexOf(r);
					t = n.loop ? pm(t, i + 1) : t.slice(i + 1);
				}
				setTimeout(() => Jm(t)), e.preventDefault();
			}
		}
		let b = lp(n, "loop"), x = Xp(X(() => n.position === "popper" ? b : {}).value);
		return Sv({
			content: s,
			viewport: u,
			onViewportChange: (e) => {
				u.value = e;
			},
			itemRefCallback: (e, t, n) => {
				let r = !m.value && !n, a = dv(i.modelValue.value, t, i.by);
				if (i.multiple.value) {
					if (h.value) return;
					(a || r) && (d.value = e, a && (h.value = !0));
				} else (a || r) && (d.value = e);
				r && (m.value = !0);
			},
			selectedItem: d,
			selectedItemText: f,
			onItemLeave: () => {
				s.value?.focus();
			},
			itemTextRefCallback: (e, t, n) => {
				let r = !m.value && !n;
				(dv(i.modelValue.value, t, i.by) || r) && (f.value = e);
			},
			focusSelectedItem: g,
			position: n.position,
			isPositioned: p,
			searchRef: c
		}), (t, n) => (U(), G(I(a), null, {
			default: L(() => [q(I(Wm), {
				"as-child": "",
				onMountAutoFocus: n[6] ||= hs(() => {}, ["prevent"]),
				onUnmountAutoFocus: n[7] ||= (e) => {
					r("closeAutoFocus", e), e.defaultPrevented || (I(i).triggerElement.value?.focus({ preventScroll: !0 }), e.preventDefault());
				}
			}, {
				default: L(() => [q(I(km), {
					"as-child": "",
					"disable-outside-pointer-events": e.disableOutsidePointerEvents,
					onFocusOutside: n[2] ||= hs(() => {}, ["prevent"]),
					onDismiss: n[3] ||= (e) => I(i).onOpenChange(!1),
					onEscapeKeyDown: n[4] ||= (e) => r("escapeKeyDown", e),
					onPointerDownOutside: n[5] ||= (e) => r("pointerDownOutside", e)
				}, {
					default: L(() => [(U(), G(Xr(e.position === "popper" ? yv : Ev), za({
						...t.$attrs,
						...I(x)
					}, {
						id: I(i).contentId,
						ref: (e) => {
							if (!e) return;
							let t = I(mp)(e);
							t?.hasAttribute("data-reka-popper-content-wrapper") ? s.value = t.firstElementChild : s.value = t;
						},
						role: "listbox",
						"data-state": I(i).open.value ? "open" : "closed",
						dir: I(i).dir.value,
						style: {
							display: "flex",
							flexDirection: "column",
							outline: "none"
						},
						onContextmenu: n[0] ||= hs(() => {}, ["prevent"]),
						onPlaced: n[1] ||= (e) => p.value = !0,
						onKeydown: y
					}), {
						default: L(() => [V(t.$slots, "default")]),
						_: 3
					}, 16, [
						"id",
						"data-state",
						"dir",
						"onKeydown"
					]))]),
					_: 3
				}, 8, ["disable-outside-pointer-events"])]),
				_: 3
			})]),
			_: 3
		}));
	}
}), [wv, Tv] = /*#__PURE__*/ Gf("SelectItemAlignedPosition"), Ev = /* @__PURE__ */ z({
	inheritAttrs: !1,
	__name: "SelectItemAlignedPosition",
	props: {
		asChild: {
			type: Boolean,
			required: !1
		},
		as: {
			type: null,
			required: !1
		}
	},
	emits: ["placed"],
	setup(e, { emit: t }) {
		let n = e, r = t, { getItems: i } = Zm(), a = hv(), o = xv(), s = /* @__PURE__ */ P(!1), c = /* @__PURE__ */ P(!0), l = /* @__PURE__ */ P(), { forwardRef: u, currentElement: d } = Yp(), { viewport: f, selectedItem: p, selectedItemText: m, focusSelectedItem: h } = o;
		function g() {
			if (a.triggerElement.value && a.valueElement.value && l.value && d.value && f?.value && p?.value && m?.value) {
				let e = a.triggerElement.value.getBoundingClientRect(), t = d.value.getBoundingClientRect(), n = a.valueElement.value.getBoundingClientRect(), o = m.value.getBoundingClientRect();
				if (a.dir.value !== "rtl") {
					let r = o.left - t.left, i = n.left - r, a = e.left - i, s = e.width + a, c = Math.max(s, t.width), u = window.innerWidth - 10, d = Wf(i, 10, Math.max(10, u - c));
					l.value.style.minWidth = `${s}px`, l.value.style.left = `${d}px`;
				} else {
					let r = t.right - o.right, i = window.innerWidth - n.right - r, a = window.innerWidth - e.right - i, s = e.width + a, c = Math.max(s, t.width), u = window.innerWidth - 10, d = Wf(i, 10, Math.max(10, u - c));
					l.value.style.minWidth = `${s}px`, l.value.style.right = `${d}px`;
				}
				let c = i().map((e) => e.ref), u = window.innerHeight - 20, h = f.value.scrollHeight, g = window.getComputedStyle(d.value), _ = Number.parseInt(g.borderTopWidth, 10), v = Number.parseInt(g.paddingTop, 10), y = Number.parseInt(g.borderBottomWidth, 10), b = Number.parseInt(g.paddingBottom, 10), x = _ + v + h + b + y, S = Math.min(p.value.offsetHeight * 5, x), C = window.getComputedStyle(f.value), w = Number.parseInt(C.paddingTop, 10), T = Number.parseInt(C.paddingBottom, 10), E = e.top + e.height / 2 - 10, D = u - E, O = p.value.offsetHeight / 2, k = p.value.offsetTop + O, A = _ + v + k, j = x - A;
				if (A <= E) {
					let e = p.value === c.at(-1);
					l.value.style.bottom = "0px";
					let t = d.value.clientHeight - f.value.offsetTop - f.value.offsetHeight, n = A + Math.max(D, O + (e ? T : 0) + t + y);
					l.value.style.height = `${n}px`;
				} else {
					let e = p.value === c[0];
					l.value.style.top = "0px";
					let t = Math.max(E, _ + f.value.offsetTop + (e ? w : 0) + O) + j;
					l.value.style.height = `${t}px`, f.value.scrollTop = A - E + f.value.offsetTop;
				}
				l.value.style.margin = "10px 0", l.value.style.minHeight = `${S}px`, l.value.style.maxHeight = `${u}px`, r("placed"), requestAnimationFrame(() => s.value = !0);
			}
		}
		let _ = /* @__PURE__ */ P("");
		zr(async () => {
			await Fn(), g(), d.value && (_.value = window.getComputedStyle(d.value).zIndex);
		});
		function v(e) {
			e && c.value === !0 && (g(), h?.(), c.value = !1);
		}
		return xp(a.triggerElement, () => {
			g();
		}), Tv({
			contentWrapper: l,
			shouldExpandOnScrollRef: s,
			onScrollButtonChange: v
		}), (e, t) => (U(), W("div", {
			ref_key: "contentWrapperElement",
			ref: l,
			style: le({
				display: "flex",
				flexDirection: "column",
				position: "fixed",
				zIndex: _.value
			})
		}, [q(I(bm), za({
			ref: I(u),
			style: {
				boxSizing: "border-box",
				maxHeight: "100%"
			}
		}, {
			...e.$attrs,
			...n
		}), {
			default: L(() => [V(e.$slots, "default")]),
			_: 3
		}, 16)], 4));
	}
}), Dv = /* @__PURE__ */ z({
	inheritAttrs: !1,
	__name: "SelectProvider",
	props: { context: {
		type: Object,
		required: !0
	} },
	setup(e) {
		return gv(e.context), Sv(bv), (e, t) => V(e.$slots, "default");
	}
}), Ov = { key: 1 }, kv = /* @__PURE__ */ z({
	inheritAttrs: !1,
	__name: "SelectContent",
	props: {
		forceMount: {
			type: Boolean,
			required: !1
		},
		position: {
			type: String,
			required: !1
		},
		bodyLock: {
			type: Boolean,
			required: !1
		},
		loop: {
			type: Boolean,
			required: !1
		},
		memoDependencies: {
			type: Array,
			required: !1
		},
		side: {
			type: null,
			required: !1
		},
		sideOffset: {
			type: Number,
			required: !1
		},
		sideFlip: {
			type: Boolean,
			required: !1
		},
		align: {
			type: null,
			required: !1
		},
		alignOffset: {
			type: Number,
			required: !1
		},
		alignFlip: {
			type: Boolean,
			required: !1
		},
		avoidCollisions: {
			type: Boolean,
			required: !1
		},
		collisionBoundary: {
			type: null,
			required: !1
		},
		collisionPadding: {
			type: [Number, Object],
			required: !1
		},
		arrowPadding: {
			type: Number,
			required: !1
		},
		hideShiftedArrow: {
			type: Boolean,
			required: !1
		},
		sticky: {
			type: String,
			required: !1
		},
		hideWhenDetached: {
			type: Boolean,
			required: !1
		},
		positionStrategy: {
			type: String,
			required: !1
		},
		updatePositionStrategy: {
			type: String,
			required: !1
		},
		disableUpdateOnLayoutShift: {
			type: Boolean,
			required: !1
		},
		prioritizePosition: {
			type: Boolean,
			required: !1
		},
		reference: {
			type: null,
			required: !1
		},
		dir: {
			type: String,
			required: !1
		},
		asChild: {
			type: Boolean,
			required: !1
		},
		as: {
			type: null,
			required: !1
		},
		disableOutsidePointerEvents: {
			type: Boolean,
			required: !1
		}
	},
	emits: [
		"closeAutoFocus",
		"escapeKeyDown",
		"pointerDownOutside"
	],
	setup(e, { emit: t }) {
		let n = e, r = Zp(n, t), i = hv(), a = /* @__PURE__ */ P();
		zr(() => {
			a.value = new DocumentFragment();
		});
		let o = /* @__PURE__ */ P(), s = X(() => n.forceMount || i.open.value), c = /* @__PURE__ */ P(s.value), l;
		function u() {
			l &&= (clearTimeout(l), void 0);
		}
		return R(s, (e, t, n) => {
			u(), l = setTimeout(() => {
				c.value = s.value, l = void 0;
			}), n(u);
		}), Ur(u), (e, t) => s.value || c.value || o.value?.present ? (U(), G(I(_m), {
			key: 0,
			ref_key: "presenceRef",
			ref: o,
			present: s.value
		}, {
			default: L(() => [q(Cv, he(Pa({
				...I(r),
				...e.$attrs
			})), {
				default: L(() => [V(e.$slots, "default")]),
				_: 3
			}, 16)]),
			_: 3
		}, 8, ["present"])) : a.value ? (U(), W("div", Ov, [(U(), G(gr, { to: a.value }, [q(Dv, { context: I(i) }, {
			default: L(() => [V(e.$slots, "default")]),
			_: 3
		}, 8, ["context"])], 8, ["to"]))])) : Y("v-if", !0);
	}
}), [Av, jv] = /*#__PURE__*/ Gf("SelectItem"), Mv = /* @__PURE__ */ z({
	__name: "SelectItem",
	props: {
		value: {
			type: null,
			required: !0
		},
		disabled: {
			type: Boolean,
			required: !1
		},
		textValue: {
			type: String,
			required: !1
		},
		asChild: {
			type: Boolean,
			required: !1
		},
		as: {
			type: null,
			required: !1
		}
	},
	emits: ["select"],
	setup(e, { emit: t }) {
		let n = e, r = t, { disabled: i } = /* @__PURE__ */ dn(n), a = hv(), o = xv(), { forwardRef: s, currentElement: c } = Yp(), { CollectionItem: l } = Zm(), u = X(() => dv(a.modelValue?.value, n.value, a.by)), d = /* @__PURE__ */ P(!1), f = /* @__PURE__ */ P(n.textValue ?? ""), p = cm(void 0, "reka-select-item-text");
		async function m(e) {
			e.defaultPrevented || qf("select.select", h, {
				originalEvent: e,
				value: n.value
			});
		}
		async function h(e) {
			await Fn(), r("select", e), e.defaultPrevented || i.value || (a.onValueChange(n.value), a.multiple.value || a.onOpenChange(!1));
		}
		async function g(e) {
			await Fn(), e.defaultPrevented || (i.value ? o.onItemLeave?.() : e.currentTarget?.focus({ preventScroll: !0 }));
		}
		async function _(e) {
			await Fn(), e.defaultPrevented || e.currentTarget === Kf() && o.onItemLeave?.();
		}
		async function v(e) {
			await Fn(), e.defaultPrevented || (o.searchRef?.value === "" || e.key !== " ") && (uv.includes(e.key) && m(e), e.key === " " && e.preventDefault());
		}
		if (n.value === "") throw Error("A <SelectItem /> must have a value prop that is not an empty string. This is because the Select value can be set to an empty string to clear the selection and show the placeholder.");
		return zr(() => {
			c.value && o.itemRefCallback(c.value, n.value, n.disabled);
		}), jv({
			value: n.value,
			disabled: i,
			textId: p,
			isSelected: u,
			onItemTextChange: (e) => {
				f.value = ((f.value || e?.textContent) ?? "").trim();
			}
		}), (t, n) => (U(), G(I(l), { value: { textValue: f.value } }, {
			default: L(() => [q(I(bm), {
				ref: I(s),
				role: "option",
				"aria-labelledby": I(p),
				"data-highlighted": d.value ? "" : void 0,
				"aria-selected": u.value,
				"data-state": u.value ? "checked" : "unchecked",
				"aria-disabled": I(i) || void 0,
				"data-disabled": I(i) ? "" : void 0,
				tabindex: I(i) ? void 0 : -1,
				as: e.as,
				"as-child": e.asChild,
				onFocus: n[0] ||= (e) => d.value = !0,
				onBlur: n[1] ||= (e) => d.value = !1,
				onPointerup: m,
				onPointerdown: n[2] ||= (e) => {
					e.currentTarget.focus({ preventScroll: !0 });
				},
				onTouchend: n[3] ||= hs(() => {}, ["prevent", "stop"]),
				onPointermove: g,
				onPointerleave: _,
				onKeydown: v
			}, {
				default: L(() => [V(t.$slots, "default", { selected: u.value })]),
				_: 3
			}, 8, [
				"aria-labelledby",
				"data-highlighted",
				"aria-selected",
				"data-state",
				"aria-disabled",
				"data-disabled",
				"tabindex",
				"as",
				"as-child"
			])]),
			_: 3
		}, 8, ["value"]));
	}
}), Nv = /* @__PURE__ */ z({
	__name: "SelectItemIndicator",
	props: {
		forceMount: {
			type: Boolean,
			required: !1
		},
		asChild: {
			type: Boolean,
			required: !1
		},
		as: {
			type: null,
			required: !1,
			default: "span"
		}
	},
	setup(e) {
		let { forwardRef: t } = Yp(), n = Av();
		return (r, i) => (U(), G(I(_m), { present: e.forceMount || I(n).isSelected.value }, {
			default: L(() => [q(I(bm), {
				ref: I(t),
				"aria-hidden": "true",
				"data-state": I(n).isSelected.value ? "checked" : "unchecked",
				as: e.as,
				"as-child": e.asChild
			}, {
				default: L(() => [V(r.$slots, "default")]),
				_: 3
			}, 8, [
				"data-state",
				"as",
				"as-child"
			])]),
			_: 3
		}, 8, ["present"]));
	}
}), Pv = /* @__PURE__ */ z({
	inheritAttrs: !1,
	__name: "SelectItemText",
	props: {
		asChild: {
			type: Boolean,
			required: !1
		},
		as: {
			type: null,
			required: !1,
			default: "span"
		}
	},
	setup(e) {
		let t = e, n = hv(), r = xv(), i = Av(), { forwardRef: a, currentElement: o } = Yp(), s = X(() => ({
			value: i.value,
			disabled: i.disabled.value,
			textContent: o.value?.textContent ?? i.value?.toString() ?? ""
		}));
		return zr(() => {
			o.value && (i.onItemTextChange(o.value), r.itemTextRefCallback(o.value, i.value, i.disabled.value), n.onOptionAdd(s.value));
		}), Ur(() => {
			n.onOptionRemove(s.value);
		}), (e, n) => (U(), G(I(bm), za({
			id: I(i).textId,
			ref: I(a)
		}, {
			...t,
			...e.$attrs
		}), {
			default: L(() => [V(e.$slots, "default")]),
			_: 3
		}, 16, ["id"]));
	}
}), Fv = /* @__PURE__ */ z({
	__name: "SelectPortal",
	props: {
		to: {
			type: null,
			required: !1
		},
		disabled: {
			type: Boolean,
			required: !1
		},
		defer: {
			type: Boolean,
			required: !1
		},
		forceMount: {
			type: Boolean,
			required: !1
		}
	},
	setup(e) {
		let t = e;
		return (e, n) => (U(), G(I(Ym), he(Pa(t)), {
			default: L(() => [V(e.$slots, "default")]),
			_: 3
		}, 16));
	}
}), Iv = /* @__PURE__ */ z({
	__name: "SelectTrigger",
	props: {
		disabled: {
			type: Boolean,
			required: !1
		},
		reference: {
			type: null,
			required: !1
		},
		asChild: {
			type: Boolean,
			required: !1
		},
		as: {
			type: null,
			required: !1,
			default: "button"
		}
	},
	setup(e) {
		let t = e, n = hv(), { forwardRef: r, currentElement: i } = Yp(), a = X(() => n.disabled?.value || t.disabled);
		n.contentId ||= cm(void 0, "reka-select-content"), zr(() => {
			n.onTriggerChange(i.value);
		});
		let o = Q_(null), s = oi();
		function c() {
			return s.id ?? o?.fieldId.value;
		}
		function l() {
			let e = (e, t) => [e, t].filter(Boolean).join(" ") || void 0;
			return {
				...o?.dataAttributes.value,
				id: c(),
				"aria-labelledby": e(s["aria-labelledby"], o?.labelId.value),
				"aria-describedby": e(s["aria-describedby"], o?.describedBy.value),
				"aria-invalid": s["aria-invalid"] ?? (o?.invalid.value || void 0)
			};
		}
		function u() {
			o?.handleControlFocus();
		}
		function d() {
			o?.handleControlBlur();
		}
		let f;
		zr(() => {
			f = o?.registerControl({
				id: c,
				element: () => i.value,
				getValue: () => n.modelValue.value,
				required: () => !!n.required?.value
			});
		}), Hr(() => f?.());
		let { getItems: p } = Zm(), { search: m, handleTypeaheadSearch: h, resetTypeahead: g } = fm();
		function _() {
			a.value || (n.onOpenChange(!0), g());
		}
		function v(e) {
			_(), n.triggerPointerDownPosRef.value = {
				x: Math.round(e.pageX),
				y: Math.round(e.pageY)
			};
		}
		function y(e) {
			return e.button === 0 && e.ctrlKey === !1;
		}
		let b = !1;
		function x(e) {
			if (e.defaultPrevented) return;
			if (e.pointerType === "touch") return e.preventDefault();
			let t = e.target;
			t.hasPointerCapture(e.pointerId) && t.releasePointerCapture(e.pointerId), y(e) && (v(e), b = !0);
		}
		function S(e) {
			e.defaultPrevented || y(e) && e.preventDefault();
		}
		function C(e) {
			e.defaultPrevented || b || e.currentTarget?.focus(), b = !1;
		}
		function w(e) {
			e.defaultPrevented || (e.preventDefault(), e.pointerType === "touch" && v(e));
		}
		function T(e) {
			if (e.defaultPrevented) return;
			let t = m.value !== "";
			!(e.ctrlKey || e.altKey || e.metaKey) && e.key.length === 1 && h(e.key, p()), t && e.key === " " || lv.includes(e.key) && (_(), e.preventDefault());
		}
		return (t, i) => (U(), G(I(xh), {
			"as-child": "",
			reference: e.reference
		}, {
			default: L(() => [q(I(bm), za(l(), {
				ref: I(r),
				role: "combobox",
				type: e.as === "button" ? "button" : void 0,
				"aria-controls": I(n).open.value ? I(n).contentId : void 0,
				"aria-expanded": I(n).open.value || !1,
				"aria-required": I(n).required?.value,
				"aria-autocomplete": "none",
				disabled: a.value,
				dir: I(n)?.dir.value,
				"data-state": I(n)?.open.value ? "open" : "closed",
				"data-disabled": a.value ? "" : void 0,
				"data-placeholder": I(pv)(I(n).modelValue?.value) ? "" : void 0,
				"as-child": e.asChild,
				as: e.as,
				onClick: C,
				onPointerdown: x,
				onMousedown: S,
				onFocus: u,
				onBlur: d,
				onPointerup: w,
				onKeydown: T
			}), {
				default: L(() => [V(t.$slots, "default")]),
				_: 3
			}, 16, [
				"type",
				"aria-controls",
				"aria-expanded",
				"aria-required",
				"disabled",
				"dir",
				"data-state",
				"data-disabled",
				"data-placeholder",
				"as-child",
				"as"
			])]),
			_: 3
		}, 8, ["reference"]));
	}
}), Lv = /* @__PURE__ */ z({
	__name: "SelectValue",
	props: {
		placeholder: {
			type: String,
			required: !1,
			default: ""
		},
		asChild: {
			type: Boolean,
			required: !1
		},
		as: {
			type: null,
			required: !1,
			default: "span"
		}
	},
	setup(e) {
		let t = e, { forwardRef: n, currentElement: r } = Yp(), i = hv();
		zr(() => {
			i.valueElement = r;
		});
		let a = X(() => {
			let e = [], t = Array.from(i.optionsSet.value), n = (e) => t.find((t) => dv(e, t.value, i.by));
			return e = Array.isArray(i.modelValue.value) ? i.modelValue.value.map((e) => n(e)?.textContent ?? "") : [n(i.modelValue.value)?.textContent ?? ""], e.filter(Boolean);
		}), o = X(() => a.value.length ? a.value.join(", ") : t.placeholder);
		return (r, s) => (U(), G(I(bm), {
			ref: I(n),
			as: e.as,
			"as-child": e.asChild,
			style: { pointerEvents: "none" },
			"data-placeholder": a.value.length ? void 0 : t.placeholder
		}, {
			default: L(() => [V(r.$slots, "default", {
				selectedLabel: a.value,
				modelValue: I(i).modelValue.value
			}, () => [J(N(o.value), 1)])]),
			_: 3
		}, 8, [
			"as",
			"as-child",
			"data-placeholder"
		]));
	}
}), Rv = /* @__PURE__ */ z({
	__name: "SelectViewport",
	props: {
		nonce: {
			type: String,
			required: !1
		},
		asChild: {
			type: Boolean,
			required: !1
		},
		as: {
			type: null,
			required: !1
		}
	},
	setup(e) {
		let t = e, { nonce: n } = /* @__PURE__ */ dn(t), r = X_(n), i = xv(), a = i.position === "item-aligned" ? wv() : void 0, { forwardRef: o, currentElement: s } = Yp();
		zr(() => {
			i?.onViewportChange(s.value);
		});
		let c = /* @__PURE__ */ P(0);
		function l(e) {
			let t = e.currentTarget, { shouldExpandOnScrollRef: n, contentWrapper: r } = a ?? {};
			if (n?.value && r?.value) {
				let e = Math.abs(c.value - t.scrollTop);
				if (e > 0) {
					let n = window.innerHeight - 20, i = Number.parseFloat(r.value.style.minHeight), a = Number.parseFloat(r.value.style.height), o = Math.max(i, a);
					if (o < n) {
						let i = o + e, a = Math.min(n, i), s = i - a;
						r.value.style.height = `${a}px`, r.value.style.bottom === "0px" && (t.scrollTop = s > 0 ? s : 0, r.value.style.justifyContent = "flex-end");
					}
				}
			}
			c.value = t.scrollTop;
		}
		return (e, n) => (U(), W(H, null, [q(I(bm), za({
			ref: I(o),
			"data-reka-select-viewport": "",
			role: "presentation"
		}, {
			...e.$attrs,
			...t
		}, {
			style: {
				position: "relative",
				flex: 1,
				overflow: "hidden auto"
			},
			onScroll: l
		}), {
			default: L(() => [V(e.$slots, "default")]),
			_: 3
		}, 16), q(I(bm), {
			as: "style",
			nonce: I(r)
		}, {
			default: L(() => [...n[0] ||= [J(" /* Hide scrollbars cross-browser and enable momentum scroll for touch devices */ [data-reka-select-viewport] { scrollbar-width:none; -ms-overflow-style: none; -webkit-overflow-scrolling: touch; } [data-reka-select-viewport]::-webkit-scrollbar { display: none; } ", -1)]]),
			_: 1
		}, 8, ["nonce"])], 64));
	}
}), zv = /* @__PURE__ */ z((e) => {
	let t = /* @__PURE__ */ P(null), n = /* @__PURE__ */ P(""), r = /* @__PURE__ */ P(!1), i = X({
		get: () => e.value ?? n.value,
		set: (t) => {
			e.onValueChange ? e.onValueChange(t) : n.value = t;
		}
	});
	return R([i, r], ([t, n], r, i) => {
		if (n) return;
		let a = window.setTimeout(() => e.onSearch(t), 180);
		i(() => window.clearTimeout(a));
	}, { immediate: !0 }), () => q(I_, {
		open: !1,
		ignoreFilter: !0,
		class: "ap-search-field"
	}, { default: () => [q(L_, za({ as: "div" }, {
		onClick: () => t.value?.$el.focus(),
		onCompositionstart: () => {
			r.value = !0;
		},
		onCompositionend: (e) => {
			i.value = e.target.value, r.value = !1;
		}
	}), { default: () => [i.value ? q("button", {
		type: "button",
		class: "ap-search-clear",
		"aria-label": e.clearLabel,
		title: e.clearLabel,
		onClick: () => {
			i.value = "", t.value?.$el.focus();
		}
	}, [q("svg", {
		width: "16",
		height: "16",
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		"stroke-width": "2",
		"stroke-linecap": "round",
		"aria-hidden": "true"
	}, [q("path", { d: "m18 6-12 12M6 6l12 12" }, null)])]) : q("svg", {
		class: "ap-search-icon",
		width: "16",
		height: "16",
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		"stroke-width": "2",
		"stroke-linecap": "round",
		"aria-hidden": "true"
	}, [q("circle", {
		cx: "11",
		cy: "11",
		r: "8"
	}, null), q("path", { d: "m21 21-4.35-4.35" }, null)]), q(G_, za({
		ref: t,
		"aria-label": e.label,
		modelValue: i.value
	}, {
		type: "search",
		placeholder: e.label,
		"onUpdate:modelValue": (e) => {
			i.value = e;
		}
	}), null)] })] });
}, { props: [
	"label",
	"clearLabel",
	"onSearch",
	"value",
	"onValueChange"
] }), Bv = /* @__PURE__ */ z((e) => {
	let t = Cr(), n = /* @__PURE__ */ P(null), r = /* @__PURE__ */ P(!1), i = X(() => r.value && !e.disabled);
	return () => {
		let { icon: a, label: o, options: s, multiple: c, disabled: l } = e;
		return q("div", {
			class: "ap-search-options",
			onFocusout: (e) => {
				e.currentTarget.contains(e.relatedTarget) || (r.value = !1);
			},
			onKeydown: (e) => {
				i.value && e.key === "Escape" && (e.preventDefault(), e.stopPropagation(), r.value = !1, n.value?.focus());
			}
		}, [q("button", {
			ref: n,
			type: "button",
			disabled: l,
			class: "ap-search-action",
			"aria-label": o,
			title: o,
			"aria-expanded": i.value,
			"aria-controls": t,
			onClick: () => r.value = !r.value
		}, [q("svg", {
			width: "16",
			height: "16",
			viewBox: "0 0 24 24",
			fill: "none",
			stroke: "currentColor",
			"stroke-width": "2",
			"stroke-linecap": "round",
			"aria-hidden": "true"
		}, [a === "filter" ? q("path", { d: "M3 6h18M6 12h12M9 18h6" }, null) : q(H, null, [
			q("path", { d: "M20 7h-9m3 10H5" }, null),
			q("circle", {
				cx: "7",
				cy: "7",
				r: "3"
			}, null),
			q("circle", {
				cx: "17",
				cy: "17",
				r: "3"
			}, null)
		])])]), q("div", {
			id: t,
			class: "ap-search-menu",
			role: c ? "group" : "radiogroup",
			"aria-label": o,
			hidden: !i.value
		}, [s.map((e) => q("label", {
			key: e.id,
			onMousedown: (e) => e.preventDefault()
		}, [
			q("input", {
				type: c ? "checkbox" : "radio",
				name: t,
				checked: e.checked,
				onChange: e.select
			}, null),
			q("span", null, [e.label]),
			q("svg", {
				class: "ap-option-check",
				width: "16",
				height: "16",
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				"stroke-width": "2",
				"stroke-linecap": "round",
				"stroke-linejoin": "round",
				"aria-hidden": "true"
			}, [q("path", { d: "m5 12 4 4L19 6" }, null)])
		]))])]);
	};
}, { props: [
	"icon",
	"label",
	"options",
	"multiple",
	"disabled"
] });
// src/shared/useStoredChoice.ts
function Vv(e, t) {
	let n = /* @__PURE__ */ F(t[0]);
	try {
		let r = localStorage.getItem(e);
		n.value = t.find((e) => e === r) ?? t[0];
	} catch {}
	return [n, (t) => {
		n.value = t;
		try {
			localStorage.setItem(e, t);
		} catch {}
	}];
}
// src/host/notify.ts
var Hv = /* @__PURE__ */ new Set();
function Uv(e, n) {
	try {
		let r = t.extensionManager?.toast;
		if (!r) return !1;
		let i = e + ":" + n;
		if (Hv.has(i)) return !0;
		let a = () => {
			Hv.add(i), queueMicrotask(() => Hv.delete(i));
		}, o = r[e];
		if (typeof o == "function") return o.call(r, n, {
			duration: e === "error" ? 8e3 : 4e3,
			closable: !0
		}), a(), !0;
		if (typeof r.add == "function") return r.add({
			severity: e === "warning" ? "warn" : e,
			summary: n,
			life: e === "error" ? 8e3 : 4e3,
			closable: !0
		}), a(), !0;
	} catch {}
	return !1;
}
// src/shared/Feedback.tsx
var Wv = /* @__PURE__ */ z((e) => {
	let { t } = Cf();
	return R(() => e.error, (e) => {
		if (!e) return;
		let n = e instanceof Q ? e.code : "canvas";
		Uv("error", t(`errors.${n}`, { status: e instanceof Q ? e.status : "" }, t("errors.unknown")));
	}, { immediate: !0 }), () => {
		let { error: n, retry: r } = e, i = n instanceof Q ? n.code : "canvas";
		return q("div", { role: "alert" }, [q("p", null, [t(`errors.${i}`, { status: n instanceof Q ? n.status : "" }, t("errors.unknown"))]), r && q("button", { onClick: r }, [t("actions.retry")])]);
	};
}, { props: ["error", "retry"] });
// src/host/canvas.ts
function Gv() {
	return window.LiteGraph;
}
function Kv(e, n, r = t, i = Gv(), a) {
	let o = r.canvas, s = o?.graph;
	if (!r.isGraphReady || !s || o.read_only || o.selectOnly || !o.allow_interaction) throw Error("CANVAS_UNAVAILABLE");
	if (!i?.registered_node_types || typeof i.createNode != "function") throw Error("CANVAS_UNSUPPORTED");
	if (!Object.hasOwn(i.registered_node_types, e)) throw Error("NODE_NOT_REGISTERED");
	let c = o.ds?.visible_area;
	if (!n && !c || n && typeof r.clientPosToCanvasPos != "function") throw Error("CANVAS_UNSUPPORTED");
	let l = n ? r.clientPosToCanvasPos(n) : [c[0] + c[2] / 2, c[1] + c[3] / 2];
	if (!l.every(Number.isFinite)) throw Error("INVALID_POSITION");
	if (typeof s.beforeChange != "function" || typeof s.afterChange != "function" || typeof o.emitBeforeChange != "function" || typeof o.emitAfterChange != "function") throw Error("CANVAS_UNSUPPORTED");
	let u, d = !1, f;
	try {
		if (s.beforeChange(), d = !0, o.emitBeforeChange(), u = i.createNode(e), !u) throw Error("NODE_NOT_REGISTERED");
		if (a?.(u), u.pos = l, f = s.state?.lastNodeId, !s.add(u) || u.graph !== s) throw Error("GRAPH_ADD_FAILED");
		return s.change(), u;
	} catch (e) {
		u?.graph === s ? s.remove(u) : u?.onRemoved?.();
		let t = Number(u?.id);
		throw u && u.graph !== s && f !== void 0 && s.state?.lastNodeId === t && t > f && (s.state.lastNodeId = f), e;
	} finally {
		if (d) try {
			s.afterChange();
		} finally {
			o.emitAfterChange();
		}
	}
}
// src/host/dragDrop.ts
var qv = "application/x-astrophoto-resource+json";
function Jv(e, t, n) {
	e.effectAllowed = "copy", e.setData(qv, JSON.stringify({
		v: 1,
		kind: "node",
		nodeId: t,
		token: n
	}));
}
function Yv(e, t, n) {
	let r = JSON.parse(e);
	if (!r || typeof r != "object" || !("v" in r) || r.v !== 1 || !("kind" in r) || r.kind !== "node" || !("nodeId" in r) || typeof r.nodeId != "string" || n !== void 0 && (!("token" in r) || r.token !== n) || !(typeof t == "function" ? t(r.nodeId) : t.has(r.nodeId))) throw Error("INVALID_DRAG");
	return r.nodeId;
}
var Xv = 0;
function Zv() {
	Xv += 1;
}
function Qv(e, n, r = Kv) {
	let i = () => {
		let e = t.canvas;
		return {
			canvas: e,
			graph: e?.graph,
			surface: e?.canvas,
			generation: Xv
		};
	}, a = t.ui?.settings, o;
	function s() {
		o?.surface?.removeEventListener("litegraph:set-graph", s), o = void 0;
	}
	function c(n, r) {
		s();
		let a = i();
		if (!e(r) || !a.graph || !a.surface || !t.isGraphReady) return !1;
		let c = crypto.getRandomValues(/* @__PURE__ */ new Uint32Array(4)).join("-");
		return Jv(n, r, c), o = {
			...a,
			id: r,
			token: c
		}, a.surface.addEventListener("litegraph:set-graph", s), !0;
	}
	function l(t) {
		if (!o || !t.dataTransfer?.types.includes("application/x-astrophoto-resource+json")) return !1;
		let { canvas: n, graph: r, surface: a, generation: c } = i();
		if (!a || n !== o.canvas || r !== o.graph || a !== o.surface || c !== o.generation || !e(o.id)) return s(), !1;
		let l = t.target;
		if (l !== a) {
			if (!(l instanceof Element) || l.closest("button, input, select, textarea, [contenteditable], [role=\"button\"]")) return !1;
			let e = l.closest("[data-testid=\"transform-pane\"]");
			if (!e || e.parentElement !== a.parentElement) return !1;
		}
		let u = a.getBoundingClientRect();
		return t.clientX >= u.left && t.clientX <= u.right && t.clientY >= u.top && t.clientY <= u.bottom;
	}
	let u = (e) => {
		l(e) && (e.preventDefault(), e.stopImmediatePropagation(), e.dataTransfer && (e.dataTransfer.dropEffect = "copy"));
	}, d = (t) => {
		if (!l(t) || !o || !t.dataTransfer) return;
		t.preventDefault(), t.stopImmediatePropagation();
		let i = o.token, a = o.id;
		s();
		try {
			let o = Yv(t.dataTransfer.getData(qv), e, i);
			if (o !== a) throw Error("INVALID_DRAG");
			r(o, [t.clientX, t.clientY]), n(null);
		} catch (e) {
			n(e);
		}
	};
	return document.addEventListener("dragover", u, !0), document.addEventListener("drop", d, !0), document.addEventListener("dragend", s, !0), a?.addEventListener("Comfy.VueNodes.Enabled.change", s), {
		start: c,
		cancel: s,
		dispose: () => {
			s(), document.removeEventListener("dragover", u, !0), document.removeEventListener("drop", d, !0), document.removeEventListener("dragend", s, !0), a?.removeEventListener("Comfy.VueNodes.Enabled.change", s);
		}
	};
}
// src/shared/DisclosureChevron.tsx
function $v() {
	return q("svg", {
		class: "ap-tree-chevron",
		width: "16",
		height: "16",
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		"stroke-width": "2",
		"stroke-linecap": "round",
		"stroke-linejoin": "round",
		"aria-hidden": "true"
	}, [q("path", { d: "m6 9 6 6 6-6" }, null)]);
}
// src/features/nodes/NodeHoverPreview.tsx
var ey = 16, ty = (e, t, n) => Math.max(t, Math.min(e, n)), ny = /* @__PURE__ */ z((e) => {
	let { t: n } = Cf(), r = /* @__PURE__ */ P(null);
	return er((n) => {
		let { anchor: i } = e, a = r.value;
		if (!a) return;
		let o = i.closest(".astrophoto-ui") ?? i, s = i.closest(".ap-scroll"), c = () => {
			let e = i.getBoundingClientRect(), n = s?.getBoundingClientRect();
			if (!e.width || !e.height || e.bottom <= 0 || e.top >= window.innerHeight || n && (e.bottom <= n.top || e.top >= n.bottom)) {
				a.style.visibility = "hidden";
				return;
			}
			let { width: r, height: c } = a.getBoundingClientRect(), l = o.getBoundingClientRect(), u = l.left - ey - r, d = l.right + ey, f = t.extensionManager.setting.get("Comfy.Sidebar.Location") === "right", p = f ? u : d;
			f && u < ey && d + r <= window.innerWidth - ey && (p = d), !f && d + r > window.innerWidth - ey && u >= ey && (p = u), a.style.left = `${ty(p, ey, window.innerWidth - r - ey)}px`;
			let m = e.top + e.height / 2 - c * .3;
			a.style.top = `${ty(m, ey, window.innerHeight - c - ey)}px`, a.style.visibility = "visible";
		};
		c();
		let l = new ResizeObserver(c);
		l.observe(a), o !== i && l.observe(o), window.addEventListener("resize", c), window.addEventListener("scroll", c, !0);
		let u = (t) => {
			t.key === "Escape" && e.dismiss();
		};
		window.addEventListener("keydown", u), n(() => {
			l.disconnect(), window.removeEventListener("resize", c), window.removeEventListener("scroll", c, !0), window.removeEventListener("keydown", u);
		});
	}), () => {
		let { node: t } = e, i = [[n("nodes.inputs"), t.inputs], [n("nodes.outputs"), t.outputs]];
		return q(gr, { to: "body" }, { default: () => [q("aside", {
			class: "astrophoto-node-preview",
			ref: r,
			"aria-hidden": "true"
		}, [q("div", { class: "ap-preview-miniature" }, [q("div", { class: "ap-preview-node-title" }, [t.title]), q("div", { class: "ap-preview-sockets" }, [q("div", null, [t.inputs.map(([e], t) => q("span", { key: t }, [e]))]), q("div", null, [t.outputs.map(([e], t) => q("span", { key: t }, [e]))])])]), q("div", { class: "ap-preview-content" }, [
			q("h3", null, [t.title]),
			t.description && q("p", null, [t.description]),
			i.map(([e, t]) => t.length > 0 && q("div", {
				class: "ap-preview-ports",
				key: e
			}, [q("h4", null, [e]), q("dl", null, [t.map(([e, t], n) => q("div", { key: n }, [q("dt", null, [e]), q("dd", null, [t])]))])]))
		])])] });
	};
}, { props: [
	"node",
	"anchor",
	"dismiss"
] });
// src/features/nodes/NodeTree.tsx
function ry(e, t, n = (e) => e) {
	let r = [], i = /* @__PURE__ */ new Map();
	for (let t of e) {
		let e = r, a = "", o = t.bookmarkPath === void 0 ? t.category.split("/").filter(Boolean) : t.bookmarkPath.split("/").slice(0, -1);
		t.bookmarkPath === void 0 && o[0] === "AstroPhoto" && o.shift();
		for (let t of o) {
			a += `/${t}`;
			let r = i.get(a);
			r || (r = {
				kind: "folder",
				key: a,
				label: n(t),
				children: []
			}, i.set(a, r), e.push(r)), e = r.children;
		}
		let s = t.bookmarkPath ?? t.id;
		e.push({
			kind: "node",
			key: s,
			label: t.title,
			node: t,
			bookmarkPath: s
		});
	}
	if (t) {
		let e = (e) => e.sort((e, n) => t(e.label, n.label));
		e(r);
		for (let t of i.values()) e(t.children);
	}
	return r;
}
var iy = /* @__PURE__ */ z((e) => {
	let t = /* @__PURE__ */ F(null), n = !1;
	return R(() => e.previewEnabled, (e) => {
		e || (t.value = null);
	}), () => {
		let { node: r, level: i, selectNode: a, startDrag: o, previewEnabled: s, isBookmarked: c, toggleBookmark: l, bookmarkLabel: u, bookmarkPath: d, bookmarkPending: f } = e;
		return q("li", null, [q("div", {
			class: "ap-tree-row ap-tree-leaf",
			onPointerenter: (e) => {
				e.pointerType === "mouse" && s && !n && (t.value = e.currentTarget);
			},
			onPointerleave: () => t.value = null
		}, [q("button", {
			type: "button",
			class: "ap-resource",
			style: { paddingInlineStart: `${8 + i * 24}px` },
			draggable: !0,
			onDragstart: (e) => {
				n = !!e.dataTransfer && o(e.dataTransfer, r.id), n || e.preventDefault(), t.value = null;
			},
			onDragend: () => {
				n = !1;
			},
			onClick: (e) => {
				t.value = null, a(r.id, e.currentTarget);
			}
		}, [q("svg", {
			width: "16",
			height: "16",
			viewBox: "0 0 16 16",
			fill: "none",
			"aria-hidden": "true"
		}, [q("path", {
			stroke: "currentColor",
			"stroke-linecap": "round",
			"stroke-width": "1.3",
			d: "m11.2667 10.45-.0842.3156c-.143.5363-.6286.9094-1.18362.9094H4.6945c-.80486 0-1.39102-.7629-1.18364-1.5406l1.30667-4.90002c.143-.53625.62865-.90937 1.18364-.90937h5.46393c.7243 0 1.2518.68663 1.0652 1.38652l-.0301.11275M15.35 8.00001h-4.9m-6.73748 0H.65002"
		}, null)]), q("span", null, [r.title])]), q("button", {
			type: "button",
			class: "ap-tree-bookmark",
			"aria-label": u(c(d)),
			title: u(c(d)),
			"aria-pressed": c(d),
			disabled: f,
			onClick: () => {
				t.value = null, l(r.id, d);
			}
		}, [q("svg", {
			width: "16",
			height: "16",
			viewBox: "0 0 24 24",
			fill: c(d) ? "currentColor" : "none",
			stroke: "currentColor",
			"stroke-width": "2",
			"stroke-linecap": "round",
			"stroke-linejoin": "round",
			"aria-hidden": "true"
		}, [q("path", { d: "M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16l-6-4-6 4Z" }, null)])])]), s && t.value && q(ny, {
			anchor: t.value,
			node: r,
			dismiss: () => t.value = null
		}, null)]);
	};
}, { props: [
	"node",
	"level",
	"selectNode",
	"startDrag",
	"previewEnabled",
	"isBookmarked",
	"toggleBookmark",
	"bookmarkLabel",
	"bookmarkPath",
	"bookmarkPending"
] });
function ay({ entries: e, level: t = 0, ...n }) {
	let r = { paddingInlineStart: `${8 + t * 24}px` };
	return q("ul", {
		class: "ap-node-tree",
		role: "list"
	}, [e.map((e) => {
		if (e.kind === "folder") {
			let i = n.isExpanded(e.key);
			return q("li", { key: `folder:${e.key}` }, [q("button", {
				type: "button",
				class: "ap-tree-row ap-tree-folder",
				style: r,
				"aria-expanded": i,
				title: e.label,
				onClick: () => n.setExpanded(e.key, !i),
				onKeydown: (t) => {
					(t.key === "ArrowLeft" || t.key === "ArrowRight") && (t.preventDefault(), t.stopPropagation(), n.setExpanded(e.key, t.key === "ArrowRight"));
				}
			}, [
				q($v, null, null),
				q("svg", {
					width: "16",
					height: "16",
					viewBox: "0 0 24 24",
					fill: "none",
					stroke: "currentColor",
					"stroke-width": "2",
					"stroke-linecap": "round",
					"stroke-linejoin": "round",
					"aria-hidden": "true"
				}, [q("path", { d: "M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-8a2 2 0 0 1-1.6-.8l-.8-1.1A2 2 0 0 0 8 3.3H4a2 2 0 0 0-2 2V18a2 2 0 0 0 2 2Z" }, null)]),
				q("span", null, [e.label])
			]), i && q(ay, za({
				entries: e.children,
				level: t + 1
			}, n), null)]);
		}
		return q(iy, za({
			key: `node:${e.key}`,
			node: e.node,
			bookmarkPath: e.bookmarkPath,
			level: t
		}, n), null);
	})]);
}
ay.inheritAttrs = !1;
// src/host/nodeBookmarks.ts
var oy = "Comfy.NodeLibrary.Bookmarks.V2", sy = `/settings/${encodeURIComponent(oy)}`;
function cy() {
	let e = t.extensionManager.setting.get(oy);
	return Array.isArray(e) ? e.filter((e) => typeof e == "string") : [];
}
async function ly() {
	let e = await Ff(sy, void 0, "no-store");
	if (e === null) return [];
	if (!Array.isArray(e) || !e.every((e) => typeof e == "string")) throw new Q("schema");
	return e;
}
async function uy(e, n, r) {
	let i = t.ui?.settings?.settingsValues;
	if (!i || typeof t.api.storeSetting != "function") throw new Q("bookmarkUnsupported");
	let a = await ly();
	if (!r()) return;
	if (a.includes(e) === n) {
		i[oy] = a;
		return;
	}
	let o = n ? [...a, e] : a.filter((t) => t !== e);
	try {
		let e = await t.api.storeSetting(oy, o);
		if (!e.ok) throw new Q("bookmark", e.status);
		i[oy] = o;
	} catch (e) {
		try {
			i[oy] = await ly();
		} catch {}
		throw e;
	}
}
var dy = {
	AstroPhotoImagePath: {
		display_name: "AstroPhoto 图像路径",
		description: "将图像路径传递给其他节点。",
		inputs: { image_path: { name: "图像路径" } },
		outputs: { 0: { name: "图像路径" } }
	},
	AstroPhotoFITSSource: {
		display_name: "AstroPhoto 加载图像",
		description: "提供本地单帧单色或 RGB FITS 文件路径。",
		inputs: { asset_id: { name: "FITS 素材" } },
		outputs: { 0: { name: "FITS 路径" } }
	},
	AstroPhotoAssetSource: {
		display_name: "AstroPhoto 素材源",
		description: "将已登记素材的文件路径传给兼容的读取或处理节点。",
		inputs: { asset_id: { name: "素材 ID" } },
		outputs: { 0: { name: "素材路径" } }
	},
	AstroPhotoCollectionSource: {
		display_name: "AstroPhoto 集合源",
		description: "按成员顺序提供集合的素材文件路径。",
		inputs: { collection_id: { name: "集合 ID" } },
		outputs: { 0: { name: "素材路径列表" } }
	},
	AstroPhotoSiril_addwcs: {
		display_name: "传递 WCS 坐标",
		description: "从参考文件复制 WCS 坐标，未指定文件时清除现有定位解。",
		inputs: {
			arguments: {
				name: "命令参数",
				tooltip: "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"
			},
			stage_only: {
				name: "仅暂存步骤",
				tooltip: "生成会话步骤供下游使用，本节点此时不运行 CLI。"
			},
			image_path: {
				name: "图像路径",
				tooltip: "命令执行前加载此文件。"
			},
			file_path: {
				name: "文件路径",
				tooltip: "暂存此文件，并用 {input} 在参数中引用。"
			},
			directory_path: {
				name: "输入目录",
				tooltip: "接入上游目录中的文件。"
			},
			source_directory: {
				name: "本地源目录",
				tooltip: "宿主上的绝对目录路径，例如 FITS 序列所在目录。"
			},
			previous_steps: {
				name: "上游会话步骤",
				tooltip: "连接前一节点暂存的会话步骤。"
			}
		},
		outputs: {
			0: { name: "结果图像路径" },
			1: { name: "结果目录" },
			2: { name: "CLI 日志" },
			3: { name: "会话步骤" }
		}
	},
	AstroPhotoSiril_asinh: {
		display_name: "反双曲正弦拉伸",
		description: "用反双曲正弦曲线提升暗弱信号的可见度。",
		inputs: {
			arguments: {
				name: "命令参数",
				tooltip: "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"
			},
			stage_only: {
				name: "仅暂存步骤",
				tooltip: "生成会话步骤供下游使用，本节点此时不运行 CLI。"
			},
			image_path: {
				name: "图像路径",
				tooltip: "命令执行前加载此文件。"
			},
			file_path: {
				name: "文件路径",
				tooltip: "暂存此文件，并用 {input} 在参数中引用。"
			},
			directory_path: {
				name: "输入目录",
				tooltip: "接入上游目录中的文件。"
			},
			source_directory: {
				name: "本地源目录",
				tooltip: "宿主上的绝对目录路径，例如 FITS 序列所在目录。"
			},
			previous_steps: {
				name: "上游会话步骤",
				tooltip: "连接前一节点暂存的会话步骤。"
			}
		},
		outputs: {
			0: { name: "结果图像路径" },
			1: { name: "结果目录" },
			2: { name: "CLI 日志" },
			3: { name: "会话步骤" }
		}
	},
	AstroPhotoSiril_autoghs: {
		display_name: "自动双曲拉伸",
		description: "根据背景统计估计对称点并应用广义双曲拉伸。",
		inputs: {
			arguments: {
				name: "命令参数",
				tooltip: "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"
			},
			stage_only: {
				name: "仅暂存步骤",
				tooltip: "生成会话步骤供下游使用，本节点此时不运行 CLI。"
			},
			image_path: {
				name: "图像路径",
				tooltip: "命令执行前加载此文件。"
			},
			file_path: {
				name: "文件路径",
				tooltip: "暂存此文件，并用 {input} 在参数中引用。"
			},
			directory_path: {
				name: "输入目录",
				tooltip: "接入上游目录中的文件。"
			},
			source_directory: {
				name: "本地源目录",
				tooltip: "宿主上的绝对目录路径，例如 FITS 序列所在目录。"
			},
			previous_steps: {
				name: "上游会话步骤",
				tooltip: "连接前一节点暂存的会话步骤。"
			}
		},
		outputs: {
			0: { name: "结果图像路径" },
			1: { name: "结果目录" },
			2: { name: "CLI 日志" },
			3: { name: "会话步骤" }
		}
	},
	AstroPhotoSirilAutoStretch: {
		display_name: "自动拉伸",
		description: "根据背景自动计算非线性拉伸，显示暗弱细节。",
		inputs: {
			image_path: { name: "FITS 路径" },
			shadowsclip: {
				name: "阴影裁剪 (σ)",
				tooltip: "用标准差表示阴影裁剪。"
			},
			targetbg: {
				name: "目标背景",
				tooltip: "0 到 1 的归一化目标背景。"
			},
			linked: {
				name: "联动 RGB 通道",
				tooltip: "关闭联动可能改变白平衡。单色输入忽略此值。"
			}
		},
		outputs: { 0: { name: "结果 FITS 路径" } }
	},
	AstroPhotoSiril_bg: {
		display_name: "测量背景",
		description: "输出当前图像的背景亮度。",
		inputs: {
			arguments: {
				name: "命令参数",
				tooltip: "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"
			},
			stage_only: {
				name: "仅暂存步骤",
				tooltip: "生成会话步骤供下游使用，本节点此时不运行 CLI。"
			},
			image_path: {
				name: "图像路径",
				tooltip: "命令执行前加载此文件。"
			},
			file_path: {
				name: "文件路径",
				tooltip: "暂存此文件，并用 {input} 在参数中引用。"
			},
			directory_path: {
				name: "输入目录",
				tooltip: "接入上游目录中的文件。"
			},
			source_directory: {
				name: "本地源目录",
				tooltip: "宿主上的绝对目录路径，例如 FITS 序列所在目录。"
			},
			previous_steps: {
				name: "上游会话步骤",
				tooltip: "连接前一节点暂存的会话步骤。"
			}
		},
		outputs: {
			0: { name: "结果图像路径" },
			1: { name: "结果目录" },
			2: { name: "CLI 日志" },
			3: { name: "会话步骤" }
		}
	},
	AstroPhotoSiril_bgnoise: {
		display_name: "测量背景噪声",
		description: "估计当前图像的背景噪声水平。",
		inputs: {
			arguments: {
				name: "命令参数",
				tooltip: "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"
			},
			stage_only: {
				name: "仅暂存步骤",
				tooltip: "生成会话步骤供下游使用，本节点此时不运行 CLI。"
			},
			image_path: {
				name: "图像路径",
				tooltip: "命令执行前加载此文件。"
			},
			file_path: {
				name: "文件路径",
				tooltip: "暂存此文件，并用 {input} 在参数中引用。"
			},
			directory_path: {
				name: "输入目录",
				tooltip: "接入上游目录中的文件。"
			},
			source_directory: {
				name: "本地源目录",
				tooltip: "宿主上的绝对目录路径，例如 FITS 序列所在目录。"
			},
			previous_steps: {
				name: "上游会话步骤",
				tooltip: "连接前一节点暂存的会话步骤。"
			}
		},
		outputs: {
			0: { name: "结果图像路径" },
			1: { name: "结果目录" },
			2: { name: "CLI 日志" },
			3: { name: "会话步骤" }
		}
	},
	AstroPhotoSiril_binxy: {
		display_name: "像素合并",
		description: "按方形块合并像素，可计算平均值或总和。",
		inputs: {
			arguments: {
				name: "命令参数",
				tooltip: "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"
			},
			stage_only: {
				name: "仅暂存步骤",
				tooltip: "生成会话步骤供下游使用，本节点此时不运行 CLI。"
			},
			image_path: {
				name: "图像路径",
				tooltip: "命令执行前加载此文件。"
			},
			file_path: {
				name: "文件路径",
				tooltip: "暂存此文件，并用 {input} 在参数中引用。"
			},
			directory_path: {
				name: "输入目录",
				tooltip: "接入上游目录中的文件。"
			},
			source_directory: {
				name: "本地源目录",
				tooltip: "宿主上的绝对目录路径，例如 FITS 序列所在目录。"
			},
			previous_steps: {
				name: "上游会话步骤",
				tooltip: "连接前一节点暂存的会话步骤。"
			}
		},
		outputs: {
			0: { name: "结果图像路径" },
			1: { name: "结果目录" },
			2: { name: "CLI 日志" },
			3: { name: "会话步骤" }
		}
	},
	AstroPhotoSiril_boxselect: {
		display_name: "选择图像区域",
		description: "设置、查看或清除供后续命令使用的矩形区域。",
		inputs: {
			arguments: {
				name: "命令参数",
				tooltip: "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"
			},
			stage_only: {
				name: "仅暂存步骤",
				tooltip: "生成会话步骤供下游使用，本节点此时不运行 CLI。"
			},
			image_path: {
				name: "图像路径",
				tooltip: "命令执行前加载此文件。"
			},
			file_path: {
				name: "文件路径",
				tooltip: "暂存此文件，并用 {input} 在参数中引用。"
			},
			directory_path: {
				name: "输入目录",
				tooltip: "接入上游目录中的文件。"
			},
			source_directory: {
				name: "本地源目录",
				tooltip: "宿主上的绝对目录路径，例如 FITS 序列所在目录。"
			},
			previous_steps: {
				name: "上游会话步骤",
				tooltip: "连接前一节点暂存的会话步骤。"
			}
		},
		outputs: {
			0: { name: "结果图像路径" },
			1: { name: "结果目录" },
			2: { name: "CLI 日志" },
			3: { name: "会话步骤" }
		}
	},
	AstroPhotoSiril_calibrate: {
		display_name: "校准序列",
		description: "使用偏置场、暗场和平场校准序列帧。",
		inputs: {
			arguments: {
				name: "命令参数",
				tooltip: "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"
			},
			stage_only: {
				name: "仅暂存步骤",
				tooltip: "生成会话步骤供下游使用，本节点此时不运行 CLI。"
			},
			file_path: {
				name: "文件路径",
				tooltip: "暂存此文件，并用 {input} 在参数中引用。"
			},
			directory_path: {
				name: "输入目录",
				tooltip: "接入上游目录中的文件。"
			},
			source_directory: {
				name: "本地源目录",
				tooltip: "宿主上的绝对目录路径，例如 FITS 序列所在目录。"
			},
			previous_steps: {
				name: "上游会话步骤",
				tooltip: "连接前一节点暂存的会话步骤。"
			}
		},
		outputs: {
			0: { name: "结果图像路径" },
			1: { name: "结果目录" },
			2: { name: "CLI 日志" },
			3: { name: "会话步骤" }
		}
	},
	AstroPhotoSiril_calibrate_single: {
		display_name: "校准单张图像",
		description: "使用偏置场、暗场和平场校准单张图像。",
		inputs: {
			arguments: {
				name: "命令参数",
				tooltip: "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"
			},
			stage_only: {
				name: "仅暂存步骤",
				tooltip: "生成会话步骤供下游使用，本节点此时不运行 CLI。"
			},
			file_path: {
				name: "文件路径",
				tooltip: "暂存此文件，并用 {input} 在参数中引用。"
			},
			directory_path: {
				name: "输入目录",
				tooltip: "接入上游目录中的文件。"
			},
			source_directory: {
				name: "本地源目录",
				tooltip: "宿主上的绝对目录路径，例如 FITS 序列所在目录。"
			},
			previous_steps: {
				name: "上游会话步骤",
				tooltip: "连接前一节点暂存的会话步骤。"
			}
		},
		outputs: {
			0: { name: "结果图像路径" },
			1: { name: "结果目录" },
			2: { name: "CLI 日志" },
			3: { name: "会话步骤" }
		}
	},
	AstroPhotoSiril_capabilities: {
		display_name: "查看 CLI 能力",
		description: "输出当前 Siril 可执行文件的编译功能和运行能力。",
		inputs: {
			arguments: {
				name: "命令参数",
				tooltip: "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"
			},
			stage_only: {
				name: "仅暂存步骤",
				tooltip: "生成会话步骤供下游使用，本节点此时不运行 CLI。"
			},
			file_path: {
				name: "文件路径",
				tooltip: "暂存此文件，并用 {input} 在参数中引用。"
			},
			directory_path: {
				name: "输入目录",
				tooltip: "接入上游目录中的文件。"
			},
			source_directory: {
				name: "本地源目录",
				tooltip: "宿主上的绝对目录路径，例如 FITS 序列所在目录。"
			},
			previous_steps: {
				name: "上游会话步骤",
				tooltip: "连接前一节点暂存的会话步骤。"
			}
		},
		outputs: {
			0: { name: "结果图像路径" },
			1: { name: "结果目录" },
			2: { name: "CLI 日志" },
			3: { name: "会话步骤" }
		}
	},
	AstroPhotoSiril_catquery: {
		display_name: "导出星表查询",
		description: "按天球坐标查询星表并将匹配星源导出为 CSV。",
		inputs: {
			arguments: {
				name: "命令参数",
				tooltip: "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"
			},
			stage_only: {
				name: "仅暂存步骤",
				tooltip: "生成会话步骤供下游使用，本节点此时不运行 CLI。"
			},
			file_path: {
				name: "文件路径",
				tooltip: "暂存此文件，并用 {input} 在参数中引用。"
			},
			directory_path: {
				name: "输入目录",
				tooltip: "接入上游目录中的文件。"
			},
			source_directory: {
				name: "本地源目录",
				tooltip: "宿主上的绝对目录路径，例如 FITS 序列所在目录。"
			},
			previous_steps: {
				name: "上游会话步骤",
				tooltip: "连接前一节点暂存的会话步骤。"
			}
		},
		outputs: {
			0: { name: "结果图像路径" },
			1: { name: "结果目录" },
			2: { name: "CLI 日志" },
			3: { name: "会话步骤" }
		}
	},
	AstroPhotoSiril_catsearch: {
		display_name: "查找星表天体",
		description: "在受支持的星表中按名称查找天体。",
		inputs: {
			arguments: {
				name: "命令参数",
				tooltip: "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"
			},
			stage_only: {
				name: "仅暂存步骤",
				tooltip: "生成会话步骤供下游使用，本节点此时不运行 CLI。"
			},
			file_path: {
				name: "文件路径",
				tooltip: "暂存此文件，并用 {input} 在参数中引用。"
			},
			directory_path: {
				name: "输入目录",
				tooltip: "接入上游目录中的文件。"
			},
			source_directory: {
				name: "本地源目录",
				tooltip: "宿主上的绝对目录路径，例如 FITS 序列所在目录。"
			},
			previous_steps: {
				name: "上游会话步骤",
				tooltip: "连接前一节点暂存的会话步骤。"
			}
		},
		outputs: {
			0: { name: "结果图像路径" },
			1: { name: "结果目录" },
			2: { name: "CLI 日志" },
			3: { name: "会话步骤" }
		}
	},
	AstroPhotoSiril_ccm: {
		display_name: "应用颜色校正矩阵",
		description: "用 3×3 颜色校正矩阵变换 RGB 数值。",
		inputs: {
			arguments: {
				name: "命令参数",
				tooltip: "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"
			},
			stage_only: {
				name: "仅暂存步骤",
				tooltip: "生成会话步骤供下游使用，本节点此时不运行 CLI。"
			},
			image_path: {
				name: "图像路径",
				tooltip: "命令执行前加载此文件。"
			},
			file_path: {
				name: "文件路径",
				tooltip: "暂存此文件，并用 {input} 在参数中引用。"
			},
			directory_path: {
				name: "输入目录",
				tooltip: "接入上游目录中的文件。"
			},
			source_directory: {
				name: "本地源目录",
				tooltip: "宿主上的绝对目录路径，例如 FITS 序列所在目录。"
			},
			previous_steps: {
				name: "上游会话步骤",
				tooltip: "连接前一节点暂存的会话步骤。"
			}
		},
		outputs: {
			0: { name: "结果图像路径" },
			1: { name: "结果目录" },
			2: { name: "CLI 日志" },
			3: { name: "会话步骤" }
		}
	},
	AstroPhotoSiril_cd: {
		display_name: "切换工作目录",
		description: "切换当前会话的工作目录。",
		inputs: {
			arguments: {
				name: "命令参数",
				tooltip: "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"
			},
			stage_only: {
				name: "仅暂存步骤",
				tooltip: "生成会话步骤供下游使用，本节点此时不运行 CLI。"
			},
			file_path: {
				name: "文件路径",
				tooltip: "暂存此文件，并用 {input} 在参数中引用。"
			},
			directory_path: {
				name: "输入目录",
				tooltip: "接入上游目录中的文件。"
			},
			source_directory: {
				name: "本地源目录",
				tooltip: "宿主上的绝对目录路径，例如 FITS 序列所在目录。"
			},
			previous_steps: {
				name: "上游会话步骤",
				tooltip: "连接前一节点暂存的会话步骤。"
			}
		},
		outputs: {
			0: { name: "结果图像路径" },
			1: { name: "结果目录" },
			2: { name: "CLI 日志" },
			3: { name: "会话步骤" }
		}
	},
	AstroPhotoSiril_cdg: {
		display_name: "测量图像重心",
		description: "根据亮度足够的相邻像素计算图像亮度重心。",
		inputs: {
			arguments: {
				name: "命令参数",
				tooltip: "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"
			},
			stage_only: {
				name: "仅暂存步骤",
				tooltip: "生成会话步骤供下游使用，本节点此时不运行 CLI。"
			},
			image_path: {
				name: "图像路径",
				tooltip: "命令执行前加载此文件。"
			},
			file_path: {
				name: "文件路径",
				tooltip: "暂存此文件，并用 {input} 在参数中引用。"
			},
			directory_path: {
				name: "输入目录",
				tooltip: "接入上游目录中的文件。"
			},
			source_directory: {
				name: "本地源目录",
				tooltip: "宿主上的绝对目录路径，例如 FITS 序列所在目录。"
			},
			previous_steps: {
				name: "上游会话步骤",
				tooltip: "连接前一节点暂存的会话步骤。"
			}
		},
		outputs: {
			0: { name: "结果图像路径" },
			1: { name: "结果目录" },
			2: { name: "CLI 日志" },
			3: { name: "会话步骤" }
		}
	},
	AstroPhotoSiril_clahe: {
		display_name: "局部对比度（CLAHE）",
		description: "用限制对比度的自适应直方图均衡增强局部对比度。",
		inputs: {
			arguments: {
				name: "命令参数",
				tooltip: "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"
			},
			stage_only: {
				name: "仅暂存步骤",
				tooltip: "生成会话步骤供下游使用，本节点此时不运行 CLI。"
			},
			image_path: {
				name: "图像路径",
				tooltip: "命令执行前加载此文件。"
			},
			file_path: {
				name: "文件路径",
				tooltip: "暂存此文件，并用 {input} 在参数中引用。"
			},
			directory_path: {
				name: "输入目录",
				tooltip: "接入上游目录中的文件。"
			},
			source_directory: {
				name: "本地源目录",
				tooltip: "宿主上的绝对目录路径，例如 FITS 序列所在目录。"
			},
			previous_steps: {
				name: "上游会话步骤",
				tooltip: "连接前一节点暂存的会话步骤。"
			}
		},
		outputs: {
			0: { name: "结果图像路径" },
			1: { name: "结果目录" },
			2: { name: "CLI 日志" },
			3: { name: "会话步骤" }
		}
	},
	AstroPhotoSiril_close: {
		display_name: "关闭图像",
		description: "关闭当前图像或序列并释放内存。",
		inputs: {
			arguments: {
				name: "命令参数",
				tooltip: "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"
			},
			stage_only: {
				name: "仅暂存步骤",
				tooltip: "生成会话步骤供下游使用，本节点此时不运行 CLI。"
			},
			file_path: {
				name: "文件路径",
				tooltip: "暂存此文件，并用 {input} 在参数中引用。"
			},
			directory_path: {
				name: "输入目录",
				tooltip: "接入上游目录中的文件。"
			},
			source_directory: {
				name: "本地源目录",
				tooltip: "宿主上的绝对目录路径，例如 FITS 序列所在目录。"
			},
			previous_steps: {
				name: "上游会话步骤",
				tooltip: "连接前一节点暂存的会话步骤。"
			}
		},
		outputs: {
			0: { name: "结果图像路径" },
			1: { name: "结果目录" },
			2: { name: "CLI 日志" },
			3: { name: "会话步骤" }
		}
	},
	AstroPhotoSiril_conesearch: {
		display_name: "搜索天区",
		description: "查询指定天球位置附近的星表源。",
		inputs: {
			arguments: {
				name: "命令参数",
				tooltip: "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"
			},
			stage_only: {
				name: "仅暂存步骤",
				tooltip: "生成会话步骤供下游使用，本节点此时不运行 CLI。"
			},
			image_path: {
				name: "图像路径",
				tooltip: "命令执行前加载此文件。"
			},
			file_path: {
				name: "文件路径",
				tooltip: "暂存此文件，并用 {input} 在参数中引用。"
			},
			directory_path: {
				name: "输入目录",
				tooltip: "接入上游目录中的文件。"
			},
			source_directory: {
				name: "本地源目录",
				tooltip: "宿主上的绝对目录路径，例如 FITS 序列所在目录。"
			},
			previous_steps: {
				name: "上游会话步骤",
				tooltip: "连接前一节点暂存的会话步骤。"
			}
		},
		outputs: {
			0: { name: "结果图像路径" },
			1: { name: "结果目录" },
			2: { name: "CLI 日志" },
			3: { name: "会话步骤" }
		}
	},
	AstroPhotoSiril_convert: {
		display_name: "转换为图像序列",
		description: "把支持的文件转换成 Siril 序列，可同时进行去马赛克。",
		inputs: {
			arguments: {
				name: "命令参数",
				tooltip: "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"
			},
			stage_only: {
				name: "仅暂存步骤",
				tooltip: "生成会话步骤供下游使用，本节点此时不运行 CLI。"
			},
			file_path: {
				name: "文件路径",
				tooltip: "暂存此文件，并用 {input} 在参数中引用。"
			},
			directory_path: {
				name: "输入目录",
				tooltip: "接入上游目录中的文件。"
			},
			source_directory: {
				name: "本地源目录",
				tooltip: "宿主上的绝对目录路径，例如 FITS 序列所在目录。"
			},
			previous_steps: {
				name: "上游会话步骤",
				tooltip: "连接前一节点暂存的会话步骤。"
			}
		},
		outputs: {
			0: { name: "结果图像路径" },
			1: { name: "结果目录" },
			2: { name: "CLI 日志" },
			3: { name: "会话步骤" }
		}
	},
	AstroPhotoSiril_convertraw: {
		display_name: "转换相机 RAW",
		description: "将支持的相机 RAW 文件转换成 Siril 序列。",
		inputs: {
			arguments: {
				name: "命令参数",
				tooltip: "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"
			},
			stage_only: {
				name: "仅暂存步骤",
				tooltip: "生成会话步骤供下游使用，本节点此时不运行 CLI。"
			},
			file_path: {
				name: "文件路径",
				tooltip: "暂存此文件，并用 {input} 在参数中引用。"
			},
			directory_path: {
				name: "输入目录",
				tooltip: "接入上游目录中的文件。"
			},
			source_directory: {
				name: "本地源目录",
				tooltip: "宿主上的绝对目录路径，例如 FITS 序列所在目录。"
			},
			previous_steps: {
				name: "上游会话步骤",
				tooltip: "连接前一节点暂存的会话步骤。"
			}
		},
		outputs: {
			0: { name: "结果图像路径" },
			1: { name: "结果目录" },
			2: { name: "CLI 日志" },
			3: { name: "会话步骤" }
		}
	},
	AstroPhotoSiril_cosme: {
		display_name: "修正坏像素",
		description: "按提供的坏像素映射表修正指定像素。",
		inputs: {
			arguments: {
				name: "命令参数",
				tooltip: "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"
			},
			stage_only: {
				name: "仅暂存步骤",
				tooltip: "生成会话步骤供下游使用，本节点此时不运行 CLI。"
			},
			image_path: {
				name: "图像路径",
				tooltip: "命令执行前加载此文件。"
			},
			file_path: {
				name: "文件路径",
				tooltip: "暂存此文件，并用 {input} 在参数中引用。"
			},
			directory_path: {
				name: "输入目录",
				tooltip: "接入上游目录中的文件。"
			},
			source_directory: {
				name: "本地源目录",
				tooltip: "宿主上的绝对目录路径，例如 FITS 序列所在目录。"
			},
			previous_steps: {
				name: "上游会话步骤",
				tooltip: "连接前一节点暂存的会话步骤。"
			}
		},
		outputs: {
			0: { name: "结果图像路径" },
			1: { name: "结果目录" },
			2: { name: "CLI 日志" },
			3: { name: "会话步骤" }
		}
	},
	AstroPhotoSiril_cosme_cfa: {
		display_name: "修正 CFA 坏像素",
		description: "依据传感器彩色滤光阵列修正表中坏像素。",
		inputs: {
			arguments: {
				name: "命令参数",
				tooltip: "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"
			},
			stage_only: {
				name: "仅暂存步骤",
				tooltip: "生成会话步骤供下游使用，本节点此时不运行 CLI。"
			},
			image_path: {
				name: "图像路径",
				tooltip: "命令执行前加载此文件。"
			},
			file_path: {
				name: "文件路径",
				tooltip: "暂存此文件，并用 {input} 在参数中引用。"
			},
			directory_path: {
				name: "输入目录",
				tooltip: "接入上游目录中的文件。"
			},
			source_directory: {
				name: "本地源目录",
				tooltip: "宿主上的绝对目录路径，例如 FITS 序列所在目录。"
			},
			previous_steps: {
				name: "上游会话步骤",
				tooltip: "连接前一节点暂存的会话步骤。"
			}
		},
		outputs: {
			0: { name: "结果图像路径" },
			1: { name: "结果目录" },
			2: { name: "CLI 日志" },
			3: { name: "会话步骤" }
		}
	},
	AstroPhotoSiril_crop: {
		display_name: "裁剪图像",
		description: "保留当前图像的指定矩形区域。",
		inputs: {
			arguments: {
				name: "命令参数",
				tooltip: "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"
			},
			stage_only: {
				name: "仅暂存步骤",
				tooltip: "生成会话步骤供下游使用，本节点此时不运行 CLI。"
			},
			image_path: {
				name: "图像路径",
				tooltip: "命令执行前加载此文件。"
			},
			file_path: {
				name: "文件路径",
				tooltip: "暂存此文件，并用 {input} 在参数中引用。"
			},
			directory_path: {
				name: "输入目录",
				tooltip: "接入上游目录中的文件。"
			},
			source_directory: {
				name: "本地源目录",
				tooltip: "宿主上的绝对目录路径，例如 FITS 序列所在目录。"
			},
			previous_steps: {
				name: "上游会话步骤",
				tooltip: "连接前一节点暂存的会话步骤。"
			}
		},
		outputs: {
			0: { name: "结果图像路径" },
			1: { name: "结果目录" },
			2: { name: "CLI 日志" },
			3: { name: "会话步骤" }
		}
	},
	AstroPhotoSiril_denoise: {
		display_name: "降噪",
		description: "应用非局部贝叶斯降噪，可启用额外增强步骤。",
		inputs: {
			arguments: {
				name: "命令参数",
				tooltip: "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"
			},
			stage_only: {
				name: "仅暂存步骤",
				tooltip: "生成会话步骤供下游使用，本节点此时不运行 CLI。"
			},
			image_path: {
				name: "图像路径",
				tooltip: "命令执行前加载此文件。"
			},
			file_path: {
				name: "文件路径",
				tooltip: "暂存此文件，并用 {input} 在参数中引用。"
			},
			directory_path: {
				name: "输入目录",
				tooltip: "接入上游目录中的文件。"
			},
			source_directory: {
				name: "本地源目录",
				tooltip: "宿主上的绝对目录路径，例如 FITS 序列所在目录。"
			},
			previous_steps: {
				name: "上游会话步骤",
				tooltip: "连接前一节点暂存的会话步骤。"
			}
		},
		outputs: {
			0: { name: "结果图像路径" },
			1: { name: "结果目录" },
			2: { name: "CLI 日志" },
			3: { name: "会话步骤" }
		}
	},
	AstroPhotoSiril_dumpheader: {
		display_name: "读取 FITS 头",
		description: "输出当前 FITS 图像的头关键字。",
		inputs: {
			arguments: {
				name: "命令参数",
				tooltip: "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"
			},
			stage_only: {
				name: "仅暂存步骤",
				tooltip: "生成会话步骤供下游使用，本节点此时不运行 CLI。"
			},
			image_path: {
				name: "图像路径",
				tooltip: "命令执行前加载此文件。"
			},
			file_path: {
				name: "文件路径",
				tooltip: "暂存此文件，并用 {input} 在参数中引用。"
			},
			directory_path: {
				name: "输入目录",
				tooltip: "接入上游目录中的文件。"
			},
			source_directory: {
				name: "本地源目录",
				tooltip: "宿主上的绝对目录路径，例如 FITS 序列所在目录。"
			},
			previous_steps: {
				name: "上游会话步骤",
				tooltip: "连接前一节点暂存的会话步骤。"
			}
		},
		outputs: {
			0: { name: "结果图像路径" },
			1: { name: "结果目录" },
			2: { name: "CLI 日志" },
			3: { name: "会话步骤" }
		}
	},
	AstroPhotoSiril_entropy: {
		display_name: "测量图像熵",
		description: "计算当前图像的信息熵。",
		inputs: {
			arguments: {
				name: "命令参数",
				tooltip: "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"
			},
			stage_only: {
				name: "仅暂存步骤",
				tooltip: "生成会话步骤供下游使用，本节点此时不运行 CLI。"
			},
			image_path: {
				name: "图像路径",
				tooltip: "命令执行前加载此文件。"
			},
			file_path: {
				name: "文件路径",
				tooltip: "暂存此文件，并用 {input} 在参数中引用。"
			},
			directory_path: {
				name: "输入目录",
				tooltip: "接入上游目录中的文件。"
			},
			source_directory: {
				name: "本地源目录",
				tooltip: "宿主上的绝对目录路径，例如 FITS 序列所在目录。"
			},
			previous_steps: {
				name: "上游会话步骤",
				tooltip: "连接前一节点暂存的会话步骤。"
			}
		},
		outputs: {
			0: { name: "结果图像路径" },
			1: { name: "结果目录" },
			2: { name: "CLI 日志" },
			3: { name: "会话步骤" }
		}
	},
	AstroPhotoSiril_epf: {
		display_name: "保边滤波",
		description: "平滑图像时保留边缘，可提供引导图像。",
		inputs: {
			arguments: {
				name: "命令参数",
				tooltip: "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"
			},
			stage_only: {
				name: "仅暂存步骤",
				tooltip: "生成会话步骤供下游使用，本节点此时不运行 CLI。"
			},
			image_path: {
				name: "图像路径",
				tooltip: "命令执行前加载此文件。"
			},
			file_path: {
				name: "文件路径",
				tooltip: "暂存此文件，并用 {input} 在参数中引用。"
			},
			directory_path: {
				name: "输入目录",
				tooltip: "接入上游目录中的文件。"
			},
			source_directory: {
				name: "本地源目录",
				tooltip: "宿主上的绝对目录路径，例如 FITS 序列所在目录。"
			},
			previous_steps: {
				name: "上游会话步骤",
				tooltip: "连接前一节点暂存的会话步骤。"
			}
		},
		outputs: {
			0: { name: "结果图像路径" },
			1: { name: "结果目录" },
			2: { name: "CLI 日志" },
			3: { name: "会话步骤" }
		}
	},
	AstroPhotoSiril_exit: {
		display_name: "结束会话",
		description: "在此前命令完成后结束 Siril 会话。",
		inputs: {
			arguments: {
				name: "命令参数",
				tooltip: "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"
			},
			stage_only: {
				name: "仅暂存步骤",
				tooltip: "生成会话步骤供下游使用，本节点此时不运行 CLI。"
			},
			file_path: {
				name: "文件路径",
				tooltip: "暂存此文件，并用 {input} 在参数中引用。"
			},
			directory_path: {
				name: "输入目录",
				tooltip: "接入上游目录中的文件。"
			},
			source_directory: {
				name: "本地源目录",
				tooltip: "宿主上的绝对目录路径，例如 FITS 序列所在目录。"
			},
			previous_steps: {
				name: "上游会话步骤",
				tooltip: "连接前一节点暂存的会话步骤。"
			}
		},
		outputs: {
			0: { name: "结果图像路径" },
			1: { name: "结果目录" },
			2: { name: "CLI 日志" },
			3: { name: "会话步骤" }
		}
	},
	AstroPhotoSiril_extract: {
		display_name: "提取小波层",
		description: "导出指定数量的小波分解层。",
		inputs: {
			arguments: {
				name: "命令参数",
				tooltip: "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"
			},
			stage_only: {
				name: "仅暂存步骤",
				tooltip: "生成会话步骤供下游使用，本节点此时不运行 CLI。"
			},
			image_path: {
				name: "图像路径",
				tooltip: "命令执行前加载此文件。"
			},
			file_path: {
				name: "文件路径",
				tooltip: "暂存此文件，并用 {input} 在参数中引用。"
			},
			directory_path: {
				name: "输入目录",
				tooltip: "接入上游目录中的文件。"
			},
			source_directory: {
				name: "本地源目录",
				tooltip: "宿主上的绝对目录路径，例如 FITS 序列所在目录。"
			},
			previous_steps: {
				name: "上游会话步骤",
				tooltip: "连接前一节点暂存的会话步骤。"
			}
		},
		outputs: {
			0: { name: "结果图像路径" },
			1: { name: "结果目录" },
			2: { name: "CLI 日志" },
			3: { name: "会话步骤" }
		}
	},
	AstroPhotoSiril_extract_Green: {
		display_name: "提取 CFA 绿色信号",
		description: "从彩色滤光阵列提取平均后的绿色信号。",
		inputs: {
			arguments: {
				name: "命令参数",
				tooltip: "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"
			},
			stage_only: {
				name: "仅暂存步骤",
				tooltip: "生成会话步骤供下游使用，本节点此时不运行 CLI。"
			},
			image_path: {
				name: "图像路径",
				tooltip: "命令执行前加载此文件。"
			},
			file_path: {
				name: "文件路径",
				tooltip: "暂存此文件，并用 {input} 在参数中引用。"
			},
			directory_path: {
				name: "输入目录",
				tooltip: "接入上游目录中的文件。"
			},
			source_directory: {
				name: "本地源目录",
				tooltip: "宿主上的绝对目录路径，例如 FITS 序列所在目录。"
			},
			previous_steps: {
				name: "上游会话步骤",
				tooltip: "连接前一节点暂存的会话步骤。"
			}
		},
		outputs: {
			0: { name: "结果图像路径" },
			1: { name: "结果目录" },
			2: { name: "CLI 日志" },
			3: { name: "会话步骤" }
		}
	},
	AstroPhotoSiril_extract_Ha: {
		display_name: "提取 Hα",
		description: "从适用的 CFA 图像中提取红色滤镜采集的 Hα 信号。",
		inputs: {
			arguments: {
				name: "命令参数",
				tooltip: "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"
			},
			stage_only: {
				name: "仅暂存步骤",
				tooltip: "生成会话步骤供下游使用，本节点此时不运行 CLI。"
			},
			image_path: {
				name: "图像路径",
				tooltip: "命令执行前加载此文件。"
			},
			file_path: {
				name: "文件路径",
				tooltip: "暂存此文件，并用 {input} 在参数中引用。"
			},
			directory_path: {
				name: "输入目录",
				tooltip: "接入上游目录中的文件。"
			},
			source_directory: {
				name: "本地源目录",
				tooltip: "宿主上的绝对目录路径，例如 FITS 序列所在目录。"
			},
			previous_steps: {
				name: "上游会话步骤",
				tooltip: "连接前一节点暂存的会话步骤。"
			}
		},
		outputs: {
			0: { name: "结果图像路径" },
			1: { name: "结果目录" },
			2: { name: "CLI 日志" },
			3: { name: "会话步骤" }
		}
	},
	AstroPhotoSiril_extract_HaOIII: {
		display_name: "提取 Hα 和 O III",
		description: "从适用的双窄带 CFA 图像中分离 Hα 和 O III 信号。",
		inputs: {
			arguments: {
				name: "命令参数",
				tooltip: "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"
			},
			stage_only: {
				name: "仅暂存步骤",
				tooltip: "生成会话步骤供下游使用，本节点此时不运行 CLI。"
			},
			image_path: {
				name: "图像路径",
				tooltip: "命令执行前加载此文件。"
			},
			file_path: {
				name: "文件路径",
				tooltip: "暂存此文件，并用 {input} 在参数中引用。"
			},
			directory_path: {
				name: "输入目录",
				tooltip: "接入上游目录中的文件。"
			},
			source_directory: {
				name: "本地源目录",
				tooltip: "宿主上的绝对目录路径，例如 FITS 序列所在目录。"
			},
			previous_steps: {
				name: "上游会话步骤",
				tooltip: "连接前一节点暂存的会话步骤。"
			}
		},
		outputs: {
			0: { name: "结果图像路径" },
			1: { name: "结果目录" },
			2: { name: "CLI 日志" },
			3: { name: "会话步骤" }
		}
	},
	AstroPhotoSiril_fdiv: {
		display_name: "除以参考图像",
		description: "除以提供的参考图像，再对结果乘以指定系数。",
		inputs: {
			arguments: {
				name: "命令参数",
				tooltip: "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"
			},
			stage_only: {
				name: "仅暂存步骤",
				tooltip: "生成会话步骤供下游使用，本节点此时不运行 CLI。"
			},
			image_path: {
				name: "图像路径",
				tooltip: "命令执行前加载此文件。"
			},
			file_path: {
				name: "文件路径",
				tooltip: "暂存此文件，并用 {input} 在参数中引用。"
			},
			directory_path: {
				name: "输入目录",
				tooltip: "接入上游目录中的文件。"
			},
			source_directory: {
				name: "本地源目录",
				tooltip: "宿主上的绝对目录路径，例如 FITS 序列所在目录。"
			},
			previous_steps: {
				name: "上游会话步骤",
				tooltip: "连接前一节点暂存的会话步骤。"
			}
		},
		outputs: {
			0: { name: "结果图像路径" },
			1: { name: "结果目录" },
			2: { name: "CLI 日志" },
			3: { name: "会话步骤" }
		}
	},
	AstroPhotoSiril_ffill: {
		display_name: "用浮点值填充",
		description: "用浮点亮度值填充图像或指定矩形。",
		inputs: {
			arguments: {
				name: "命令参数",
				tooltip: "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"
			},
			stage_only: {
				name: "仅暂存步骤",
				tooltip: "生成会话步骤供下游使用，本节点此时不运行 CLI。"
			},
			image_path: {
				name: "图像路径",
				tooltip: "命令执行前加载此文件。"
			},
			file_path: {
				name: "文件路径",
				tooltip: "暂存此文件，并用 {input} 在参数中引用。"
			},
			directory_path: {
				name: "输入目录",
				tooltip: "接入上游目录中的文件。"
			},
			source_directory: {
				name: "本地源目录",
				tooltip: "宿主上的绝对目录路径，例如 FITS 序列所在目录。"
			},
			previous_steps: {
				name: "上游会话步骤",
				tooltip: "连接前一节点暂存的会话步骤。"
			}
		},
		outputs: {
			0: { name: "结果图像路径" },
			1: { name: "结果目录" },
			2: { name: "CLI 日志" },
			3: { name: "会话步骤" }
		}
	},
	AstroPhotoSiril_fftd: {
		display_name: "正向傅里叶变换",
		description: "输出当前图像的傅里叶幅度和相位。",
		inputs: {
			arguments: {
				name: "命令参数",
				tooltip: "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"
			},
			stage_only: {
				name: "仅暂存步骤",
				tooltip: "生成会话步骤供下游使用，本节点此时不运行 CLI。"
			},
			image_path: {
				name: "图像路径",
				tooltip: "命令执行前加载此文件。"
			},
			file_path: {
				name: "文件路径",
				tooltip: "暂存此文件，并用 {input} 在参数中引用。"
			},
			directory_path: {
				name: "输入目录",
				tooltip: "接入上游目录中的文件。"
			},
			source_directory: {
				name: "本地源目录",
				tooltip: "宿主上的绝对目录路径，例如 FITS 序列所在目录。"
			},
			previous_steps: {
				name: "上游会话步骤",
				tooltip: "连接前一节点暂存的会话步骤。"
			}
		},
		outputs: {
			0: { name: "结果图像路径" },
			1: { name: "结果目录" },
			2: { name: "CLI 日志" },
			3: { name: "会话步骤" }
		}
	},
	AstroPhotoSiril_ffti: {
		display_name: "逆傅里叶变换",
		description: "从傅里叶幅度图和相位图重建空间图像。",
		inputs: {
			arguments: {
				name: "命令参数",
				tooltip: "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"
			},
			stage_only: {
				name: "仅暂存步骤",
				tooltip: "生成会话步骤供下游使用，本节点此时不运行 CLI。"
			},
			image_path: {
				name: "图像路径",
				tooltip: "命令执行前加载此文件。"
			},
			file_path: {
				name: "文件路径",
				tooltip: "暂存此文件，并用 {input} 在参数中引用。"
			},
			directory_path: {
				name: "输入目录",
				tooltip: "接入上游目录中的文件。"
			},
			source_directory: {
				name: "本地源目录",
				tooltip: "宿主上的绝对目录路径，例如 FITS 序列所在目录。"
			},
			previous_steps: {
				name: "上游会话步骤",
				tooltip: "连接前一节点暂存的会话步骤。"
			}
		},
		outputs: {
			0: { name: "结果图像路径" },
			1: { name: "结果目录" },
			2: { name: "CLI 日志" },
			3: { name: "会话步骤" }
		}
	},
	AstroPhotoSiril_fill: {
		display_name: "用 ADU 值填充",
		description: "用指定的 ADU 亮度填充图像或选区。",
		inputs: {
			arguments: {
				name: "命令参数",
				tooltip: "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"
			},
			stage_only: {
				name: "仅暂存步骤",
				tooltip: "生成会话步骤供下游使用，本节点此时不运行 CLI。"
			},
			image_path: {
				name: "图像路径",
				tooltip: "命令执行前加载此文件。"
			},
			file_path: {
				name: "文件路径",
				tooltip: "暂存此文件，并用 {input} 在参数中引用。"
			},
			directory_path: {
				name: "输入目录",
				tooltip: "接入上游目录中的文件。"
			},
			source_directory: {
				name: "本地源目录",
				tooltip: "宿主上的绝对目录路径，例如 FITS 序列所在目录。"
			},
			previous_steps: {
				name: "上游会话步骤",
				tooltip: "连接前一节点暂存的会话步骤。"
			}
		},
		outputs: {
			0: { name: "结果图像路径" },
			1: { name: "结果目录" },
			2: { name: "CLI 日志" },
			3: { name: "会话步骤" }
		}
	},
	AstroPhotoSiril_find_cosme: {
		display_name: "检测并修正坏像素",
		description: "用标准差阈值检测并修正过亮和过暗的坏像素。",
		inputs: {
			arguments: {
				name: "命令参数",
				tooltip: "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"
			},
			stage_only: {
				name: "仅暂存步骤",
				tooltip: "生成会话步骤供下游使用，本节点此时不运行 CLI。"
			},
			image_path: {
				name: "图像路径",
				tooltip: "命令执行前加载此文件。"
			},
			file_path: {
				name: "文件路径",
				tooltip: "暂存此文件，并用 {input} 在参数中引用。"
			},
			directory_path: {
				name: "输入目录",
				tooltip: "接入上游目录中的文件。"
			},
			source_directory: {
				name: "本地源目录",
				tooltip: "宿主上的绝对目录路径，例如 FITS 序列所在目录。"
			},
			previous_steps: {
				name: "上游会话步骤",
				tooltip: "连接前一节点暂存的会话步骤。"
			}
		},
		outputs: {
			0: { name: "结果图像路径" },
			1: { name: "结果目录" },
			2: { name: "CLI 日志" },
			3: { name: "会话步骤" }
		}
	},
	AstroPhotoSiril_find_cosme_cfa: {
		display_name: "检测并修正 CFA 坏像素",
		description: "检测并修正彩色滤光阵列图像中的过亮和过暗坏像素。",
		inputs: {
			arguments: {
				name: "命令参数",
				tooltip: "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"
			},
			stage_only: {
				name: "仅暂存步骤",
				tooltip: "生成会话步骤供下游使用，本节点此时不运行 CLI。"
			},
			image_path: {
				name: "图像路径",
				tooltip: "命令执行前加载此文件。"
			},
			file_path: {
				name: "文件路径",
				tooltip: "暂存此文件，并用 {input} 在参数中引用。"
			},
			directory_path: {
				name: "输入目录",
				tooltip: "接入上游目录中的文件。"
			},
			source_directory: {
				name: "本地源目录",
				tooltip: "宿主上的绝对目录路径，例如 FITS 序列所在目录。"
			},
			previous_steps: {
				name: "上游会话步骤",
				tooltip: "连接前一节点暂存的会话步骤。"
			}
		},
		outputs: {
			0: { name: "结果图像路径" },
			1: { name: "结果目录" },
			2: { name: "CLI 日志" },
			3: { name: "会话步骤" }
		}
	},
	AstroPhotoSiril_find_hot: {
		display_name: "导出坏像素图",
		description: "检测过亮和过暗的坏像素，保存其坐标供后续修正。",
		inputs: {
			arguments: {
				name: "命令参数",
				tooltip: "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"
			},
			stage_only: {
				name: "仅暂存步骤",
				tooltip: "生成会话步骤供下游使用，本节点此时不运行 CLI。"
			},
			image_path: {
				name: "图像路径",
				tooltip: "命令执行前加载此文件。"
			},
			file_path: {
				name: "文件路径",
				tooltip: "暂存此文件，并用 {input} 在参数中引用。"
			},
			directory_path: {
				name: "输入目录",
				tooltip: "接入上游目录中的文件。"
			},
			source_directory: {
				name: "本地源目录",
				tooltip: "宿主上的绝对目录路径，例如 FITS 序列所在目录。"
			},
			previous_steps: {
				name: "上游会话步骤",
				tooltip: "连接前一节点暂存的会话步骤。"
			}
		},
		outputs: {
			0: { name: "结果图像路径" },
			1: { name: "结果目录" },
			2: { name: "CLI 日志" },
			3: { name: "会话步骤" }
		}
	},
	AstroPhotoSiril_findcompstars: {
		display_name: "寻找比较星",
		description: "在星表中寻找适合测光的比较星，可导出结果。",
		inputs: {
			arguments: {
				name: "命令参数",
				tooltip: "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"
			},
			stage_only: {
				name: "仅暂存步骤",
				tooltip: "生成会话步骤供下游使用，本节点此时不运行 CLI。"
			},
			image_path: {
				name: "图像路径",
				tooltip: "命令执行前加载此文件。"
			},
			file_path: {
				name: "文件路径",
				tooltip: "暂存此文件，并用 {input} 在参数中引用。"
			},
			directory_path: {
				name: "输入目录",
				tooltip: "接入上游目录中的文件。"
			},
			source_directory: {
				name: "本地源目录",
				tooltip: "宿主上的绝对目录路径，例如 FITS 序列所在目录。"
			},
			previous_steps: {
				name: "上游会话步骤",
				tooltip: "连接前一节点暂存的会话步骤。"
			}
		},
		outputs: {
			0: { name: "结果图像路径" },
			1: { name: "结果目录" },
			2: { name: "CLI 日志" },
			3: { name: "会话步骤" }
		}
	},
	AstroPhotoSiril_findstar: {
		display_name: "检测星点",
		description: "检测当前图像中的星点，可导出检测结果。",
		inputs: {
			arguments: {
				name: "命令参数",
				tooltip: "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"
			},
			stage_only: {
				name: "仅暂存步骤",
				tooltip: "生成会话步骤供下游使用，本节点此时不运行 CLI。"
			},
			image_path: {
				name: "图像路径",
				tooltip: "命令执行前加载此文件。"
			},
			file_path: {
				name: "文件路径",
				tooltip: "暂存此文件，并用 {input} 在参数中引用。"
			},
			directory_path: {
				name: "输入目录",
				tooltip: "接入上游目录中的文件。"
			},
			source_directory: {
				name: "本地源目录",
				tooltip: "宿主上的绝对目录路径，例如 FITS 序列所在目录。"
			},
			previous_steps: {
				name: "上游会话步骤",
				tooltip: "连接前一节点暂存的会话步骤。"
			}
		},
		outputs: {
			0: { name: "结果图像路径" },
			1: { name: "结果目录" },
			2: { name: "CLI 日志" },
			3: { name: "会话步骤" }
		}
	},
	AstroPhotoSiril_fix_xtrans: {
		display_name: "修正 X-Trans 伪影",
		description: "修正 X-Trans 校准帧中的自动对焦区域伪影。",
		inputs: {
			arguments: {
				name: "命令参数",
				tooltip: "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"
			},
			stage_only: {
				name: "仅暂存步骤",
				tooltip: "生成会话步骤供下游使用，本节点此时不运行 CLI。"
			},
			image_path: {
				name: "图像路径",
				tooltip: "命令执行前加载此文件。"
			},
			file_path: {
				name: "文件路径",
				tooltip: "暂存此文件，并用 {input} 在参数中引用。"
			},
			directory_path: {
				name: "输入目录",
				tooltip: "接入上游目录中的文件。"
			},
			source_directory: {
				name: "本地源目录",
				tooltip: "宿主上的绝对目录路径，例如 FITS 序列所在目录。"
			},
			previous_steps: {
				name: "上游会话步骤",
				tooltip: "连接前一节点暂存的会话步骤。"
			}
		},
		outputs: {
			0: { name: "结果图像路径" },
			1: { name: "结果目录" },
			2: { name: "CLI 日志" },
			3: { name: "会话步骤" }
		}
	},
	AstroPhotoSiril_fixbanding: {
		display_name: "去除条带",
		description: "减弱图像中沿行或列的条带噪声。",
		inputs: {
			arguments: {
				name: "命令参数",
				tooltip: "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"
			},
			stage_only: {
				name: "仅暂存步骤",
				tooltip: "生成会话步骤供下游使用，本节点此时不运行 CLI。"
			},
			image_path: {
				name: "图像路径",
				tooltip: "命令执行前加载此文件。"
			},
			file_path: {
				name: "文件路径",
				tooltip: "暂存此文件，并用 {input} 在参数中引用。"
			},
			directory_path: {
				name: "输入目录",
				tooltip: "接入上游目录中的文件。"
			},
			source_directory: {
				name: "本地源目录",
				tooltip: "宿主上的绝对目录路径，例如 FITS 序列所在目录。"
			},
			previous_steps: {
				name: "上游会话步骤",
				tooltip: "连接前一节点暂存的会话步骤。"
			}
		},
		outputs: {
			0: { name: "结果图像路径" },
			1: { name: "结果目录" },
			2: { name: "CLI 日志" },
			3: { name: "会话步骤" }
		}
	},
	AstroPhotoSiril_fmedian: {
		display_name: "中值滤波",
		description: "用可调节的中值滤波器减少孤立噪点。",
		inputs: {
			arguments: {
				name: "命令参数",
				tooltip: "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"
			},
			stage_only: {
				name: "仅暂存步骤",
				tooltip: "生成会话步骤供下游使用，本节点此时不运行 CLI。"
			},
			image_path: {
				name: "图像路径",
				tooltip: "命令执行前加载此文件。"
			},
			file_path: {
				name: "文件路径",
				tooltip: "暂存此文件，并用 {input} 在参数中引用。"
			},
			directory_path: {
				name: "输入目录",
				tooltip: "接入上游目录中的文件。"
			},
			source_directory: {
				name: "本地源目录",
				tooltip: "宿主上的绝对目录路径，例如 FITS 序列所在目录。"
			},
			previous_steps: {
				name: "上游会话步骤",
				tooltip: "连接前一节点暂存的会话步骤。"
			}
		},
		outputs: {
			0: { name: "结果图像路径" },
			1: { name: "结果目录" },
			2: { name: "CLI 日志" },
			3: { name: "会话步骤" }
		}
	},
	AstroPhotoSiril_fmul: {
		display_name: "乘以常数",
		description: "将图像所有像素乘以一个常数。",
		inputs: {
			arguments: {
				name: "命令参数",
				tooltip: "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"
			},
			stage_only: {
				name: "仅暂存步骤",
				tooltip: "生成会话步骤供下游使用，本节点此时不运行 CLI。"
			},
			image_path: {
				name: "图像路径",
				tooltip: "命令执行前加载此文件。"
			},
			file_path: {
				name: "文件路径",
				tooltip: "暂存此文件，并用 {input} 在参数中引用。"
			},
			directory_path: {
				name: "输入目录",
				tooltip: "接入上游目录中的文件。"
			},
			source_directory: {
				name: "本地源目录",
				tooltip: "宿主上的绝对目录路径，例如 FITS 序列所在目录。"
			},
			previous_steps: {
				name: "上游会话步骤",
				tooltip: "连接前一节点暂存的会话步骤。"
			}
		},
		outputs: {
			0: { name: "结果图像路径" },
			1: { name: "结果目录" },
			2: { name: "CLI 日志" },
			3: { name: "会话步骤" }
		}
	},
	AstroPhotoSirilGaussianBlur: {
		display_name: "高斯模糊",
		description: "用高斯核平滑图像，核宽度由标准差决定。",
		inputs: {
			image_path: { name: "FITS 路径" },
			sigma: {
				name: "标准差",
				tooltip: "以像素为单位的正数。"
			}
		},
		outputs: { 0: { name: "结果 FITS 路径" } }
	},
	AstroPhotoSiril_get: {
		display_name: "读取设置",
		description: "读取单项首选设置，或列出可用设置与数值。",
		inputs: {
			arguments: {
				name: "命令参数",
				tooltip: "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"
			},
			stage_only: {
				name: "仅暂存步骤",
				tooltip: "生成会话步骤供下游使用，本节点此时不运行 CLI。"
			},
			file_path: {
				name: "文件路径",
				tooltip: "暂存此文件，并用 {input} 在参数中引用。"
			},
			directory_path: {
				name: "输入目录",
				tooltip: "接入上游目录中的文件。"
			},
			source_directory: {
				name: "本地源目录",
				tooltip: "宿主上的绝对目录路径，例如 FITS 序列所在目录。"
			},
			previous_steps: {
				name: "上游会话步骤",
				tooltip: "连接前一节点暂存的会话步骤。"
			}
		},
		outputs: {
			0: { name: "结果图像路径" },
			1: { name: "结果目录" },
			2: { name: "CLI 日志" },
			3: { name: "会话步骤" }
		}
	},
	AstroPhotoSiril_getref: {
		display_name: "查看参考帧",
		description: "输出指定序列当前参考帧的信息。",
		inputs: {
			arguments: {
				name: "命令参数",
				tooltip: "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"
			},
			stage_only: {
				name: "仅暂存步骤",
				tooltip: "生成会话步骤供下游使用，本节点此时不运行 CLI。"
			},
			file_path: {
				name: "文件路径",
				tooltip: "暂存此文件，并用 {input} 在参数中引用。"
			},
			directory_path: {
				name: "输入目录",
				tooltip: "接入上游目录中的文件。"
			},
			source_directory: {
				name: "本地源目录",
				tooltip: "宿主上的绝对目录路径，例如 FITS 序列所在目录。"
			},
			previous_steps: {
				name: "上游会话步骤",
				tooltip: "连接前一节点暂存的会话步骤。"
			}
		},
		outputs: {
			0: { name: "结果图像路径" },
			1: { name: "结果目录" },
			2: { name: "CLI 日志" },
			3: { name: "会话步骤" }
		}
	},
	AstroPhotoSiril_ght: {
		display_name: "广义双曲拉伸",
		description: "围绕可设置的对称点拉伸，可保护指定的阴影和高光。",
		inputs: {
			arguments: {
				name: "命令参数",
				tooltip: "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"
			},
			stage_only: {
				name: "仅暂存步骤",
				tooltip: "生成会话步骤供下游使用，本节点此时不运行 CLI。"
			},
			image_path: {
				name: "图像路径",
				tooltip: "命令执行前加载此文件。"
			},
			file_path: {
				name: "文件路径",
				tooltip: "暂存此文件，并用 {input} 在参数中引用。"
			},
			directory_path: {
				name: "输入目录",
				tooltip: "接入上游目录中的文件。"
			},
			source_directory: {
				name: "本地源目录",
				tooltip: "宿主上的绝对目录路径，例如 FITS 序列所在目录。"
			},
			previous_steps: {
				name: "上游会话步骤",
				tooltip: "连接前一节点暂存的会话步骤。"
			}
		},
		outputs: {
			0: { name: "结果图像路径" },
			1: { name: "结果目录" },
			2: { name: "CLI 日志" },
			3: { name: "会话步骤" }
		}
	},
	AstroPhotoSiril_grey_flat: {
		display_name: "均衡 CFA 平场通道",
		description: "均衡 CFA 平场各颜色通道的平均亮度。",
		inputs: {
			arguments: {
				name: "命令参数",
				tooltip: "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"
			},
			stage_only: {
				name: "仅暂存步骤",
				tooltip: "生成会话步骤供下游使用，本节点此时不运行 CLI。"
			},
			image_path: {
				name: "图像路径",
				tooltip: "命令执行前加载此文件。"
			},
			file_path: {
				name: "文件路径",
				tooltip: "暂存此文件，并用 {input} 在参数中引用。"
			},
			directory_path: {
				name: "输入目录",
				tooltip: "接入上游目录中的文件。"
			},
			source_directory: {
				name: "本地源目录",
				tooltip: "宿主上的绝对目录路径，例如 FITS 序列所在目录。"
			},
			previous_steps: {
				name: "上游会话步骤",
				tooltip: "连接前一节点暂存的会话步骤。"
			}
		},
		outputs: {
			0: { name: "结果图像路径" },
			1: { name: "结果目录" },
			2: { name: "CLI 日志" },
			3: { name: "会话步骤" }
		}
	},
	AstroPhotoSiril_help: {
		display_name: "查看命令帮助",
		description: "列出可用命令，或查看指定命令的语法。",
		inputs: {
			arguments: {
				name: "命令参数",
				tooltip: "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"
			},
			stage_only: {
				name: "仅暂存步骤",
				tooltip: "生成会话步骤供下游使用，本节点此时不运行 CLI。"
			},
			file_path: {
				name: "文件路径",
				tooltip: "暂存此文件，并用 {input} 在参数中引用。"
			},
			directory_path: {
				name: "输入目录",
				tooltip: "接入上游目录中的文件。"
			},
			source_directory: {
				name: "本地源目录",
				tooltip: "宿主上的绝对目录路径，例如 FITS 序列所在目录。"
			},
			previous_steps: {
				name: "上游会话步骤",
				tooltip: "连接前一节点暂存的会话步骤。"
			}
		},
		outputs: {
			0: { name: "结果图像路径" },
			1: { name: "结果目录" },
			2: { name: "CLI 日志" },
			3: { name: "会话步骤" }
		}
	},
	AstroPhotoSiril_histo: {
		display_name: "导出直方图",
		description: "计算并导出所选通道的直方图。",
		inputs: {
			arguments: {
				name: "命令参数",
				tooltip: "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"
			},
			stage_only: {
				name: "仅暂存步骤",
				tooltip: "生成会话步骤供下游使用，本节点此时不运行 CLI。"
			},
			image_path: {
				name: "图像路径",
				tooltip: "命令执行前加载此文件。"
			},
			file_path: {
				name: "文件路径",
				tooltip: "暂存此文件，并用 {input} 在参数中引用。"
			},
			directory_path: {
				name: "输入目录",
				tooltip: "接入上游目录中的文件。"
			},
			source_directory: {
				name: "本地源目录",
				tooltip: "宿主上的绝对目录路径，例如 FITS 序列所在目录。"
			},
			previous_steps: {
				name: "上游会话步骤",
				tooltip: "连接前一节点暂存的会话步骤。"
			}
		},
		outputs: {
			0: { name: "结果图像路径" },
			1: { name: "结果目录" },
			2: { name: "CLI 日志" },
			3: { name: "会话步骤" }
		}
	},
	AstroPhotoSiril_iadd: {
		display_name: "图像相加",
		description: "将第二张图像的对应像素相加。",
		inputs: {
			arguments: {
				name: "命令参数",
				tooltip: "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"
			},
			stage_only: {
				name: "仅暂存步骤",
				tooltip: "生成会话步骤供下游使用，本节点此时不运行 CLI。"
			},
			image_path: {
				name: "图像路径",
				tooltip: "命令执行前加载此文件。"
			},
			file_path: {
				name: "文件路径",
				tooltip: "暂存此文件，并用 {input} 在参数中引用。"
			},
			directory_path: {
				name: "输入目录",
				tooltip: "接入上游目录中的文件。"
			},
			source_directory: {
				name: "本地源目录",
				tooltip: "宿主上的绝对目录路径，例如 FITS 序列所在目录。"
			},
			previous_steps: {
				name: "上游会话步骤",
				tooltip: "连接前一节点暂存的会话步骤。"
			}
		},
		outputs: {
			0: { name: "结果图像路径" },
			1: { name: "结果目录" },
			2: { name: "CLI 日志" },
			3: { name: "会话步骤" }
		}
	},
	AstroPhotoSiril_icc_assign: {
		display_name: "指定 ICC 色彩配置",
		description: "指定 ICC 色彩配置文件，同时保留像素值。",
		inputs: {
			arguments: {
				name: "命令参数",
				tooltip: "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"
			},
			stage_only: {
				name: "仅暂存步骤",
				tooltip: "生成会话步骤供下游使用，本节点此时不运行 CLI。"
			},
			image_path: {
				name: "图像路径",
				tooltip: "命令执行前加载此文件。"
			},
			file_path: {
				name: "文件路径",
				tooltip: "暂存此文件，并用 {input} 在参数中引用。"
			},
			directory_path: {
				name: "输入目录",
				tooltip: "接入上游目录中的文件。"
			},
			source_directory: {
				name: "本地源目录",
				tooltip: "宿主上的绝对目录路径，例如 FITS 序列所在目录。"
			},
			previous_steps: {
				name: "上游会话步骤",
				tooltip: "连接前一节点暂存的会话步骤。"
			}
		},
		outputs: {
			0: { name: "结果图像路径" },
			1: { name: "结果目录" },
			2: { name: "CLI 日志" },
			3: { name: "会话步骤" }
		}
	},
	AstroPhotoSiril_icc_convert_to: {
		display_name: "转换 ICC 色彩配置",
		description: "将图像颜色转换到指定的 ICC 色彩空间。",
		inputs: {
			arguments: {
				name: "命令参数",
				tooltip: "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"
			},
			stage_only: {
				name: "仅暂存步骤",
				tooltip: "生成会话步骤供下游使用，本节点此时不运行 CLI。"
			},
			image_path: {
				name: "图像路径",
				tooltip: "命令执行前加载此文件。"
			},
			file_path: {
				name: "文件路径",
				tooltip: "暂存此文件，并用 {input} 在参数中引用。"
			},
			directory_path: {
				name: "输入目录",
				tooltip: "接入上游目录中的文件。"
			},
			source_directory: {
				name: "本地源目录",
				tooltip: "宿主上的绝对目录路径，例如 FITS 序列所在目录。"
			},
			previous_steps: {
				name: "上游会话步骤",
				tooltip: "连接前一节点暂存的会话步骤。"
			}
		},
		outputs: {
			0: { name: "结果图像路径" },
			1: { name: "结果目录" },
			2: { name: "CLI 日志" },
			3: { name: "会话步骤" }
		}
	},
	AstroPhotoSiril_icc_remove: {
		display_name: "移除 ICC 色彩配置",
		description: "移除图像嵌入的 ICC 色彩配置文件。",
		inputs: {
			arguments: {
				name: "命令参数",
				tooltip: "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"
			},
			stage_only: {
				name: "仅暂存步骤",
				tooltip: "生成会话步骤供下游使用，本节点此时不运行 CLI。"
			},
			image_path: {
				name: "图像路径",
				tooltip: "命令执行前加载此文件。"
			},
			file_path: {
				name: "文件路径",
				tooltip: "暂存此文件，并用 {input} 在参数中引用。"
			},
			directory_path: {
				name: "输入目录",
				tooltip: "接入上游目录中的文件。"
			},
			source_directory: {
				name: "本地源目录",
				tooltip: "宿主上的绝对目录路径，例如 FITS 序列所在目录。"
			},
			previous_steps: {
				name: "上游会话步骤",
				tooltip: "连接前一节点暂存的会话步骤。"
			}
		},
		outputs: {
			0: { name: "结果图像路径" },
			1: { name: "结果目录" },
			2: { name: "CLI 日志" },
			3: { name: "会话步骤" }
		}
	},
	AstroPhotoSiril_idiv: {
		display_name: "图像相除",
		description: "用第二张图像的对应像素做除法。",
		inputs: {
			arguments: {
				name: "命令参数",
				tooltip: "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"
			},
			stage_only: {
				name: "仅暂存步骤",
				tooltip: "生成会话步骤供下游使用，本节点此时不运行 CLI。"
			},
			image_path: {
				name: "图像路径",
				tooltip: "命令执行前加载此文件。"
			},
			file_path: {
				name: "文件路径",
				tooltip: "暂存此文件，并用 {input} 在参数中引用。"
			},
			directory_path: {
				name: "输入目录",
				tooltip: "接入上游目录中的文件。"
			},
			source_directory: {
				name: "本地源目录",
				tooltip: "宿主上的绝对目录路径，例如 FITS 序列所在目录。"
			},
			previous_steps: {
				name: "上游会话步骤",
				tooltip: "连接前一节点暂存的会话步骤。"
			}
		},
		outputs: {
			0: { name: "结果图像路径" },
			1: { name: "结果目录" },
			2: { name: "CLI 日志" },
			3: { name: "会话步骤" }
		}
	},
	AstroPhotoSiril_imul: {
		display_name: "图像相乘",
		description: "将两张图像的对应像素相乘。",
		inputs: {
			arguments: {
				name: "命令参数",
				tooltip: "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"
			},
			stage_only: {
				name: "仅暂存步骤",
				tooltip: "生成会话步骤供下游使用，本节点此时不运行 CLI。"
			},
			image_path: {
				name: "图像路径",
				tooltip: "命令执行前加载此文件。"
			},
			file_path: {
				name: "文件路径",
				tooltip: "暂存此文件，并用 {input} 在参数中引用。"
			},
			directory_path: {
				name: "输入目录",
				tooltip: "接入上游目录中的文件。"
			},
			source_directory: {
				name: "本地源目录",
				tooltip: "宿主上的绝对目录路径，例如 FITS 序列所在目录。"
			},
			previous_steps: {
				name: "上游会话步骤",
				tooltip: "连接前一节点暂存的会话步骤。"
			}
		},
		outputs: {
			0: { name: "结果图像路径" },
			1: { name: "结果目录" },
			2: { name: "CLI 日志" },
			3: { name: "会话步骤" }
		}
	},
	AstroPhotoSiril_invght: {
		display_name: "反向广义双曲拉伸",
		description: "应用广义双曲变换的逆变换。",
		inputs: {
			arguments: {
				name: "命令参数",
				tooltip: "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"
			},
			stage_only: {
				name: "仅暂存步骤",
				tooltip: "生成会话步骤供下游使用，本节点此时不运行 CLI。"
			},
			image_path: {
				name: "图像路径",
				tooltip: "命令执行前加载此文件。"
			},
			file_path: {
				name: "文件路径",
				tooltip: "暂存此文件，并用 {input} 在参数中引用。"
			},
			directory_path: {
				name: "输入目录",
				tooltip: "接入上游目录中的文件。"
			},
			source_directory: {
				name: "本地源目录",
				tooltip: "宿主上的绝对目录路径，例如 FITS 序列所在目录。"
			},
			previous_steps: {
				name: "上游会话步骤",
				tooltip: "连接前一节点暂存的会话步骤。"
			}
		},
		outputs: {
			0: { name: "结果图像路径" },
			1: { name: "结果目录" },
			2: { name: "CLI 日志" },
			3: { name: "会话步骤" }
		}
	},
	AstroPhotoSiril_invmodasinh: {
		display_name: "反向改进反双曲正弦拉伸",
		description: "应用改进反双曲正弦拉伸的逆变换。",
		inputs: {
			arguments: {
				name: "命令参数",
				tooltip: "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"
			},
			stage_only: {
				name: "仅暂存步骤",
				tooltip: "生成会话步骤供下游使用，本节点此时不运行 CLI。"
			},
			image_path: {
				name: "图像路径",
				tooltip: "命令执行前加载此文件。"
			},
			file_path: {
				name: "文件路径",
				tooltip: "暂存此文件，并用 {input} 在参数中引用。"
			},
			directory_path: {
				name: "输入目录",
				tooltip: "接入上游目录中的文件。"
			},
			source_directory: {
				name: "本地源目录",
				tooltip: "宿主上的绝对目录路径，例如 FITS 序列所在目录。"
			},
			previous_steps: {
				name: "上游会话步骤",
				tooltip: "连接前一节点暂存的会话步骤。"
			}
		},
		outputs: {
			0: { name: "结果图像路径" },
			1: { name: "结果目录" },
			2: { name: "CLI 日志" },
			3: { name: "会话步骤" }
		}
	},
	AstroPhotoSiril_invmtf: {
		display_name: "反向中间调变换",
		description: "应用中间调传递函数的逆变换。",
		inputs: {
			arguments: {
				name: "命令参数",
				tooltip: "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"
			},
			stage_only: {
				name: "仅暂存步骤",
				tooltip: "生成会话步骤供下游使用，本节点此时不运行 CLI。"
			},
			image_path: {
				name: "图像路径",
				tooltip: "命令执行前加载此文件。"
			},
			file_path: {
				name: "文件路径",
				tooltip: "暂存此文件，并用 {input} 在参数中引用。"
			},
			directory_path: {
				name: "输入目录",
				tooltip: "接入上游目录中的文件。"
			},
			source_directory: {
				name: "本地源目录",
				tooltip: "宿主上的绝对目录路径，例如 FITS 序列所在目录。"
			},
			previous_steps: {
				name: "上游会话步骤",
				tooltip: "连接前一节点暂存的会话步骤。"
			}
		},
		outputs: {
			0: { name: "结果图像路径" },
			1: { name: "结果目录" },
			2: { name: "CLI 日志" },
			3: { name: "会话步骤" }
		}
	},
	AstroPhotoSiril_isub: {
		display_name: "图像相减",
		description: "从当前图像中减去第二张图像的对应像素。",
		inputs: {
			arguments: {
				name: "命令参数",
				tooltip: "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"
			},
			stage_only: {
				name: "仅暂存步骤",
				tooltip: "生成会话步骤供下游使用，本节点此时不运行 CLI。"
			},
			image_path: {
				name: "图像路径",
				tooltip: "命令执行前加载此文件。"
			},
			file_path: {
				name: "文件路径",
				tooltip: "暂存此文件，并用 {input} 在参数中引用。"
			},
			directory_path: {
				name: "输入目录",
				tooltip: "接入上游目录中的文件。"
			},
			source_directory: {
				name: "本地源目录",
				tooltip: "宿主上的绝对目录路径，例如 FITS 序列所在目录。"
			},
			previous_steps: {
				name: "上游会话步骤",
				tooltip: "连接前一节点暂存的会话步骤。"
			}
		},
		outputs: {
			0: { name: "结果图像路径" },
			1: { name: "结果目录" },
			2: { name: "CLI 日志" },
			3: { name: "会话步骤" }
		}
	},
	AstroPhotoSiril_jsonmetadata: {
		display_name: "导出 JSON 元数据",
		description: "将 FITS 元数据和可选的图像统计量写入 JSON。",
		inputs: {
			arguments: {
				name: "命令参数",
				tooltip: "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"
			},
			stage_only: {
				name: "仅暂存步骤",
				tooltip: "生成会话步骤供下游使用，本节点此时不运行 CLI。"
			},
			file_path: {
				name: "文件路径",
				tooltip: "暂存此文件，并用 {input} 在参数中引用。"
			},
			directory_path: {
				name: "输入目录",
				tooltip: "接入上游目录中的文件。"
			},
			source_directory: {
				name: "本地源目录",
				tooltip: "宿主上的绝对目录路径，例如 FITS 序列所在目录。"
			},
			previous_steps: {
				name: "上游会话步骤",
				tooltip: "连接前一节点暂存的会话步骤。"
			}
		},
		outputs: {
			0: { name: "结果图像路径" },
			1: { name: "结果目录" },
			2: { name: "CLI 日志" },
			3: { name: "会话步骤" }
		}
	},
	AstroPhotoSiril_light_curve: {
		display_name: "生成光变曲线",
		description: "对序列中的目标和参考星进行测光，生成光变曲线。",
		inputs: {
			arguments: {
				name: "命令参数",
				tooltip: "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"
			},
			stage_only: {
				name: "仅暂存步骤",
				tooltip: "生成会话步骤供下游使用，本节点此时不运行 CLI。"
			},
			file_path: {
				name: "文件路径",
				tooltip: "暂存此文件，并用 {input} 在参数中引用。"
			},
			directory_path: {
				name: "输入目录",
				tooltip: "接入上游目录中的文件。"
			},
			source_directory: {
				name: "本地源目录",
				tooltip: "宿主上的绝对目录路径，例如 FITS 序列所在目录。"
			},
			previous_steps: {
				name: "上游会话步骤",
				tooltip: "连接前一节点暂存的会话步骤。"
			}
		},
		outputs: {
			0: { name: "结果图像路径" },
			1: { name: "结果目录" },
			2: { name: "CLI 日志" },
			3: { name: "会话步骤" }
		}
	},
	AstroPhotoSiril_limit: {
		display_name: "限制像素范围",
		description: "通过裁剪或重缩放将数值限制在支持的像素范围。",
		inputs: {
			arguments: {
				name: "命令参数",
				tooltip: "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"
			},
			stage_only: {
				name: "仅暂存步骤",
				tooltip: "生成会话步骤供下游使用，本节点此时不运行 CLI。"
			},
			image_path: {
				name: "图像路径",
				tooltip: "命令执行前加载此文件。"
			},
			file_path: {
				name: "文件路径",
				tooltip: "暂存此文件，并用 {input} 在参数中引用。"
			},
			directory_path: {
				name: "输入目录",
				tooltip: "接入上游目录中的文件。"
			},
			source_directory: {
				name: "本地源目录",
				tooltip: "宿主上的绝对目录路径，例如 FITS 序列所在目录。"
			},
			previous_steps: {
				name: "上游会话步骤",
				tooltip: "连接前一节点暂存的会话步骤。"
			}
		},
		outputs: {
			0: { name: "结果图像路径" },
			1: { name: "结果目录" },
			2: { name: "CLI 日志" },
			3: { name: "会话步骤" }
		}
	},
	AstroPhotoSiril_linear_match: {
		display_name: "匹配参考亮度",
		description: "在指定范围内拟合线性亮度校正以匹配参考图像。",
		inputs: {
			arguments: {
				name: "命令参数",
				tooltip: "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"
			},
			stage_only: {
				name: "仅暂存步骤",
				tooltip: "生成会话步骤供下游使用，本节点此时不运行 CLI。"
			},
			image_path: {
				name: "图像路径",
				tooltip: "命令执行前加载此文件。"
			},
			file_path: {
				name: "文件路径",
				tooltip: "暂存此文件，并用 {input} 在参数中引用。"
			},
			directory_path: {
				name: "输入目录",
				tooltip: "接入上游目录中的文件。"
			},
			source_directory: {
				name: "本地源目录",
				tooltip: "宿主上的绝对目录路径，例如 FITS 序列所在目录。"
			},
			previous_steps: {
				name: "上游会话步骤",
				tooltip: "连接前一节点暂存的会话步骤。"
			}
		},
		outputs: {
			0: { name: "结果图像路径" },
			1: { name: "结果目录" },
			2: { name: "CLI 日志" },
			3: { name: "会话步骤" }
		}
	},
	AstroPhotoSiril_link: {
		display_name: "链接文件为序列",
		description: "通过链接或复制已有文件建立序列。",
		inputs: {
			arguments: {
				name: "命令参数",
				tooltip: "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"
			},
			stage_only: {
				name: "仅暂存步骤",
				tooltip: "生成会话步骤供下游使用，本节点此时不运行 CLI。"
			},
			file_path: {
				name: "文件路径",
				tooltip: "暂存此文件，并用 {input} 在参数中引用。"
			},
			directory_path: {
				name: "输入目录",
				tooltip: "接入上游目录中的文件。"
			},
			source_directory: {
				name: "本地源目录",
				tooltip: "宿主上的绝对目录路径，例如 FITS 序列所在目录。"
			},
			previous_steps: {
				name: "上游会话步骤",
				tooltip: "连接前一节点暂存的会话步骤。"
			}
		},
		outputs: {
			0: { name: "结果图像路径" },
			1: { name: "结果目录" },
			2: { name: "CLI 日志" },
			3: { name: "会话步骤" }
		}
	},
	AstroPhotoSiril_linstretch: {
		display_name: "线性拉伸",
		description: "以指定黑点为基准线性调整色调范围。",
		inputs: {
			arguments: {
				name: "命令参数",
				tooltip: "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"
			},
			stage_only: {
				name: "仅暂存步骤",
				tooltip: "生成会话步骤供下游使用，本节点此时不运行 CLI。"
			},
			image_path: {
				name: "图像路径",
				tooltip: "命令执行前加载此文件。"
			},
			file_path: {
				name: "文件路径",
				tooltip: "暂存此文件，并用 {input} 在参数中引用。"
			},
			directory_path: {
				name: "输入目录",
				tooltip: "接入上游目录中的文件。"
			},
			source_directory: {
				name: "本地源目录",
				tooltip: "宿主上的绝对目录路径，例如 FITS 序列所在目录。"
			},
			previous_steps: {
				name: "上游会话步骤",
				tooltip: "连接前一节点暂存的会话步骤。"
			}
		},
		outputs: {
			0: { name: "结果图像路径" },
			1: { name: "结果目录" },
			2: { name: "CLI 日志" },
			3: { name: "会话步骤" }
		}
	},
	AstroPhotoSiril_livestack: {
		display_name: "加入实时叠加帧",
		description: "将指定文件加入正在进行的实时叠加。",
		inputs: {
			arguments: {
				name: "命令参数",
				tooltip: "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"
			},
			stage_only: {
				name: "仅暂存步骤",
				tooltip: "生成会话步骤供下游使用，本节点此时不运行 CLI。"
			},
			file_path: {
				name: "文件路径",
				tooltip: "暂存此文件，并用 {input} 在参数中引用。"
			},
			directory_path: {
				name: "输入目录",
				tooltip: "接入上游目录中的文件。"
			},
			source_directory: {
				name: "本地源目录",
				tooltip: "宿主上的绝对目录路径，例如 FITS 序列所在目录。"
			},
			previous_steps: {
				name: "上游会话步骤",
				tooltip: "连接前一节点暂存的会话步骤。"
			}
		},
		outputs: {
			0: { name: "结果图像路径" },
			1: { name: "结果目录" },
			2: { name: "CLI 日志" },
			3: { name: "会话步骤" }
		}
	},
	AstroPhotoSiril_load: {
		display_name: "加载图像",
		description: "打开文件，将其设为当前图像。",
		inputs: {
			arguments: {
				name: "命令参数",
				tooltip: "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"
			},
			stage_only: {
				name: "仅暂存步骤",
				tooltip: "生成会话步骤供下游使用，本节点此时不运行 CLI。"
			},
			file_path: {
				name: "文件路径",
				tooltip: "暂存此文件，并用 {input} 在参数中引用。"
			},
			directory_path: {
				name: "输入目录",
				tooltip: "接入上游目录中的文件。"
			},
			source_directory: {
				name: "本地源目录",
				tooltip: "宿主上的绝对目录路径，例如 FITS 序列所在目录。"
			},
			previous_steps: {
				name: "上游会话步骤",
				tooltip: "连接前一节点暂存的会话步骤。"
			}
		},
		outputs: {
			0: { name: "结果图像路径" },
			1: { name: "结果目录" },
			2: { name: "CLI 日志" },
			3: { name: "会话步骤" }
		}
	},
	AstroPhotoSiril_log: {
		display_name: "对数拉伸",
		description: "对当前图像应用对数色调变换。",
		inputs: {
			arguments: {
				name: "命令参数",
				tooltip: "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"
			},
			stage_only: {
				name: "仅暂存步骤",
				tooltip: "生成会话步骤供下游使用，本节点此时不运行 CLI。"
			},
			image_path: {
				name: "图像路径",
				tooltip: "命令执行前加载此文件。"
			},
			file_path: {
				name: "文件路径",
				tooltip: "暂存此文件，并用 {input} 在参数中引用。"
			},
			directory_path: {
				name: "输入目录",
				tooltip: "接入上游目录中的文件。"
			},
			source_directory: {
				name: "本地源目录",
				tooltip: "宿主上的绝对目录路径，例如 FITS 序列所在目录。"
			},
			previous_steps: {
				name: "上游会话步骤",
				tooltip: "连接前一节点暂存的会话步骤。"
			}
		},
		outputs: {
			0: { name: "结果图像路径" },
			1: { name: "结果目录" },
			2: { name: "CLI 日志" },
			3: { name: "会话步骤" }
		}
	},
	AstroPhotoSiril_makepsf: {
		display_name: "构建反卷积 PSF",
		description: "创建、加载、保存或清除用于反卷积的点扩散函数。",
		inputs: {
			arguments: {
				name: "命令参数",
				tooltip: "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"
			},
			stage_only: {
				name: "仅暂存步骤",
				tooltip: "生成会话步骤供下游使用，本节点此时不运行 CLI。"
			},
			file_path: {
				name: "文件路径",
				tooltip: "暂存此文件，并用 {input} 在参数中引用。"
			},
			directory_path: {
				name: "输入目录",
				tooltip: "接入上游目录中的文件。"
			},
			source_directory: {
				name: "本地源目录",
				tooltip: "宿主上的绝对目录路径，例如 FITS 序列所在目录。"
			},
			previous_steps: {
				name: "上游会话步骤",
				tooltip: "连接前一节点暂存的会话步骤。"
			}
		},
		outputs: {
			0: { name: "结果图像路径" },
			1: { name: "结果目录" },
			2: { name: "CLI 日志" },
			3: { name: "会话步骤" }
		}
	},
	AstroPhotoSiril_merge: {
		display_name: "合并序列",
		description: "将两个或更多序列合并成一个输出序列。",
		inputs: {
			arguments: {
				name: "命令参数",
				tooltip: "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"
			},
			stage_only: {
				name: "仅暂存步骤",
				tooltip: "生成会话步骤供下游使用，本节点此时不运行 CLI。"
			},
			file_path: {
				name: "文件路径",
				tooltip: "暂存此文件，并用 {input} 在参数中引用。"
			},
			directory_path: {
				name: "输入目录",
				tooltip: "接入上游目录中的文件。"
			},
			source_directory: {
				name: "本地源目录",
				tooltip: "宿主上的绝对目录路径，例如 FITS 序列所在目录。"
			},
			previous_steps: {
				name: "上游会话步骤",
				tooltip: "连接前一节点暂存的会话步骤。"
			}
		},
		outputs: {
			0: { name: "结果图像路径" },
			1: { name: "结果目录" },
			2: { name: "CLI 日志" },
			3: { name: "会话步骤" }
		}
	},
	AstroPhotoSiril_merge_cfa: {
		display_name: "合并 CFA 平面",
		description: "按所选拜耳模式将四个 CFA 平面重组为马赛克图像。",
		inputs: {
			arguments: {
				name: "命令参数",
				tooltip: "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"
			},
			stage_only: {
				name: "仅暂存步骤",
				tooltip: "生成会话步骤供下游使用，本节点此时不运行 CLI。"
			},
			file_path: {
				name: "文件路径",
				tooltip: "暂存此文件，并用 {input} 在参数中引用。"
			},
			directory_path: {
				name: "输入目录",
				tooltip: "接入上游目录中的文件。"
			},
			source_directory: {
				name: "本地源目录",
				tooltip: "宿主上的绝对目录路径，例如 FITS 序列所在目录。"
			},
			previous_steps: {
				name: "上游会话步骤",
				tooltip: "连接前一节点暂存的会话步骤。"
			}
		},
		outputs: {
			0: { name: "结果图像路径" },
			1: { name: "结果目录" },
			2: { name: "CLI 日志" },
			3: { name: "会话步骤" }
		}
	},
	AstroPhotoSiril_mirrorx: {
		display_name: "上下翻转",
		description: "上下翻转当前图像，可限定为需要调整到底行优先时才翻转。",
		inputs: {
			arguments: {
				name: "命令参数",
				tooltip: "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"
			},
			stage_only: {
				name: "仅暂存步骤",
				tooltip: "生成会话步骤供下游使用，本节点此时不运行 CLI。"
			},
			image_path: {
				name: "图像路径",
				tooltip: "命令执行前加载此文件。"
			},
			file_path: {
				name: "文件路径",
				tooltip: "暂存此文件，并用 {input} 在参数中引用。"
			},
			directory_path: {
				name: "输入目录",
				tooltip: "接入上游目录中的文件。"
			},
			source_directory: {
				name: "本地源目录",
				tooltip: "宿主上的绝对目录路径，例如 FITS 序列所在目录。"
			},
			previous_steps: {
				name: "上游会话步骤",
				tooltip: "连接前一节点暂存的会话步骤。"
			}
		},
		outputs: {
			0: { name: "结果图像路径" },
			1: { name: "结果目录" },
			2: { name: "CLI 日志" },
			3: { name: "会话步骤" }
		}
	},
	AstroPhotoSiril_mirrorx_single: {
		display_name: "规范 FITS 行序",
		description: "当指定图像文件的行序需要调整时上下翻转。",
		inputs: {
			arguments: {
				name: "命令参数",
				tooltip: "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"
			},
			stage_only: {
				name: "仅暂存步骤",
				tooltip: "生成会话步骤供下游使用，本节点此时不运行 CLI。"
			},
			file_path: {
				name: "文件路径",
				tooltip: "暂存此文件，并用 {input} 在参数中引用。"
			},
			directory_path: {
				name: "输入目录",
				tooltip: "接入上游目录中的文件。"
			},
			source_directory: {
				name: "本地源目录",
				tooltip: "宿主上的绝对目录路径，例如 FITS 序列所在目录。"
			},
			previous_steps: {
				name: "上游会话步骤",
				tooltip: "连接前一节点暂存的会话步骤。"
			}
		},
		outputs: {
			0: { name: "结果图像路径" },
			1: { name: "结果目录" },
			2: { name: "CLI 日志" },
			3: { name: "会话步骤" }
		}
	},
	AstroPhotoSiril_mirrory: {
		display_name: "左右翻转",
		description: "左右翻转当前图像。",
		inputs: {
			arguments: {
				name: "命令参数",
				tooltip: "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"
			},
			stage_only: {
				name: "仅暂存步骤",
				tooltip: "生成会话步骤供下游使用，本节点此时不运行 CLI。"
			},
			image_path: {
				name: "图像路径",
				tooltip: "命令执行前加载此文件。"
			},
			file_path: {
				name: "文件路径",
				tooltip: "暂存此文件，并用 {input} 在参数中引用。"
			},
			directory_path: {
				name: "输入目录",
				tooltip: "接入上游目录中的文件。"
			},
			source_directory: {
				name: "本地源目录",
				tooltip: "宿主上的绝对目录路径，例如 FITS 序列所在目录。"
			},
			previous_steps: {
				name: "上游会话步骤",
				tooltip: "连接前一节点暂存的会话步骤。"
			}
		},
		outputs: {
			0: { name: "结果图像路径" },
			1: { name: "结果目录" },
			2: { name: "CLI 日志" },
			3: { name: "会话步骤" }
		}
	},
	AstroPhotoSiril_modasinh: {
		display_name: "改进反双曲正弦拉伸",
		description: "应用可调节的反双曲正弦拉伸，并设置阴影和高光保护。",
		inputs: {
			arguments: {
				name: "命令参数",
				tooltip: "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"
			},
			stage_only: {
				name: "仅暂存步骤",
				tooltip: "生成会话步骤供下游使用，本节点此时不运行 CLI。"
			},
			image_path: {
				name: "图像路径",
				tooltip: "命令执行前加载此文件。"
			},
			file_path: {
				name: "文件路径",
				tooltip: "暂存此文件，并用 {input} 在参数中引用。"
			},
			directory_path: {
				name: "输入目录",
				tooltip: "接入上游目录中的文件。"
			},
			source_directory: {
				name: "本地源目录",
				tooltip: "宿主上的绝对目录路径，例如 FITS 序列所在目录。"
			},
			previous_steps: {
				name: "上游会话步骤",
				tooltip: "连接前一节点暂存的会话步骤。"
			}
		},
		outputs: {
			0: { name: "结果图像路径" },
			1: { name: "结果目录" },
			2: { name: "CLI 日志" },
			3: { name: "会话步骤" }
		}
	},
	AstroPhotoSiril_mtf: {
		display_name: "中间调变换",
		description: "用中间调传递曲线调整黑点、白点和中间调。",
		inputs: {
			arguments: {
				name: "命令参数",
				tooltip: "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"
			},
			stage_only: {
				name: "仅暂存步骤",
				tooltip: "生成会话步骤供下游使用，本节点此时不运行 CLI。"
			},
			image_path: {
				name: "图像路径",
				tooltip: "命令执行前加载此文件。"
			},
			file_path: {
				name: "文件路径",
				tooltip: "暂存此文件，并用 {input} 在参数中引用。"
			},
			directory_path: {
				name: "输入目录",
				tooltip: "接入上游目录中的文件。"
			},
			source_directory: {
				name: "本地源目录",
				tooltip: "宿主上的绝对目录路径，例如 FITS 序列所在目录。"
			},
			previous_steps: {
				name: "上游会话步骤",
				tooltip: "连接前一节点暂存的会话步骤。"
			}
		},
		outputs: {
			0: { name: "结果图像路径" },
			1: { name: "结果目录" },
			2: { name: "CLI 日志" },
			3: { name: "会话步骤" }
		}
	},
	AstroPhotoSirilNegative: {
		display_name: "反相",
		description: "反转当前图像的像素值。",
		inputs: { image_path: { name: "FITS 路径" } },
		outputs: { 0: { name: "结果 FITS 路径" } }
	},
	AstroPhotoSiril_nozero: {
		display_name: "替换零值像素",
		description: "用指定数值替换零值像素，便于后续执行除法等操作。",
		inputs: {
			arguments: {
				name: "命令参数",
				tooltip: "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"
			},
			stage_only: {
				name: "仅暂存步骤",
				tooltip: "生成会话步骤供下游使用，本节点此时不运行 CLI。"
			},
			image_path: {
				name: "图像路径",
				tooltip: "命令执行前加载此文件。"
			},
			file_path: {
				name: "文件路径",
				tooltip: "暂存此文件，并用 {input} 在参数中引用。"
			},
			directory_path: {
				name: "输入目录",
				tooltip: "接入上游目录中的文件。"
			},
			source_directory: {
				name: "本地源目录",
				tooltip: "宿主上的绝对目录路径，例如 FITS 序列所在目录。"
			},
			previous_steps: {
				name: "上游会话步骤",
				tooltip: "连接前一节点暂存的会话步骤。"
			}
		},
		outputs: {
			0: { name: "结果图像路径" },
			1: { name: "结果目录" },
			2: { name: "CLI 日志" },
			3: { name: "会话步骤" }
		}
	},
	AstroPhotoSiril_offline: {
		display_name: "禁用会话联网",
		description: "禁用当前会话中依赖网络的操作。",
		inputs: {
			arguments: {
				name: "命令参数",
				tooltip: "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"
			},
			stage_only: {
				name: "仅暂存步骤",
				tooltip: "生成会话步骤供下游使用，本节点此时不运行 CLI。"
			},
			file_path: {
				name: "文件路径",
				tooltip: "暂存此文件，并用 {input} 在参数中引用。"
			},
			directory_path: {
				name: "输入目录",
				tooltip: "接入上游目录中的文件。"
			},
			source_directory: {
				name: "本地源目录",
				tooltip: "宿主上的绝对目录路径，例如 FITS 序列所在目录。"
			},
			previous_steps: {
				name: "上游会话步骤",
				tooltip: "连接前一节点暂存的会话步骤。"
			}
		},
		outputs: {
			0: { name: "结果图像路径" },
			1: { name: "结果目录" },
			2: { name: "CLI 日志" },
			3: { name: "会话步骤" }
		}
	},
	AstroPhotoSiril_offset: {
		display_name: "添加像素偏移",
		description: "向各像素添加固定的 ADU 偏移值。",
		inputs: {
			arguments: {
				name: "命令参数",
				tooltip: "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"
			},
			stage_only: {
				name: "仅暂存步骤",
				tooltip: "生成会话步骤供下游使用，本节点此时不运行 CLI。"
			},
			image_path: {
				name: "图像路径",
				tooltip: "命令执行前加载此文件。"
			},
			file_path: {
				name: "文件路径",
				tooltip: "暂存此文件，并用 {input} 在参数中引用。"
			},
			directory_path: {
				name: "输入目录",
				tooltip: "接入上游目录中的文件。"
			},
			source_directory: {
				name: "本地源目录",
				tooltip: "宿主上的绝对目录路径，例如 FITS 序列所在目录。"
			},
			previous_steps: {
				name: "上游会话步骤",
				tooltip: "连接前一节点暂存的会话步骤。"
			}
		},
		outputs: {
			0: { name: "结果图像路径" },
			1: { name: "结果目录" },
			2: { name: "CLI 日志" },
			3: { name: "会话步骤" }
		}
	},
	AstroPhotoSiril_online: {
		display_name: "启用会话联网",
		description: "允许当前会话执行需要网络的操作。",
		inputs: {
			arguments: {
				name: "命令参数",
				tooltip: "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"
			},
			stage_only: {
				name: "仅暂存步骤",
				tooltip: "生成会话步骤供下游使用，本节点此时不运行 CLI。"
			},
			file_path: {
				name: "文件路径",
				tooltip: "暂存此文件，并用 {input} 在参数中引用。"
			},
			directory_path: {
				name: "输入目录",
				tooltip: "接入上游目录中的文件。"
			},
			source_directory: {
				name: "本地源目录",
				tooltip: "宿主上的绝对目录路径，例如 FITS 序列所在目录。"
			},
			previous_steps: {
				name: "上游会话步骤",
				tooltip: "连接前一节点暂存的会话步骤。"
			}
		},
		outputs: {
			0: { name: "结果图像路径" },
			1: { name: "结果目录" },
			2: { name: "CLI 日志" },
			3: { name: "会话步骤" }
		}
	},
	AstroPhotoSiril_parse: {
		display_name: "展开 Siril 字符串表达式",
		description: "查看 Siril 如何展开路径表达式或元数据模板。",
		inputs: {
			arguments: {
				name: "命令参数",
				tooltip: "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"
			},
			stage_only: {
				name: "仅暂存步骤",
				tooltip: "生成会话步骤供下游使用，本节点此时不运行 CLI。"
			},
			image_path: {
				name: "图像路径",
				tooltip: "命令执行前加载此文件。"
			},
			file_path: {
				name: "文件路径",
				tooltip: "暂存此文件，并用 {input} 在参数中引用。"
			},
			directory_path: {
				name: "输入目录",
				tooltip: "接入上游目录中的文件。"
			},
			source_directory: {
				name: "本地源目录",
				tooltip: "宿主上的绝对目录路径，例如 FITS 序列所在目录。"
			},
			previous_steps: {
				name: "上游会话步骤",
				tooltip: "连接前一节点暂存的会话步骤。"
			}
		},
		outputs: {
			0: { name: "结果图像路径" },
			1: { name: "结果目录" },
			2: { name: "CLI 日志" },
			3: { name: "会话步骤" }
		}
	},
	AstroPhotoSiril_pcc: {
		display_name: "测光色彩校准",
		description: "利用星表中的恒星校准已完成天文定位的图像色彩。",
		inputs: {
			arguments: {
				name: "命令参数",
				tooltip: "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"
			},
			stage_only: {
				name: "仅暂存步骤",
				tooltip: "生成会话步骤供下游使用，本节点此时不运行 CLI。"
			},
			image_path: {
				name: "图像路径",
				tooltip: "命令执行前加载此文件。"
			},
			file_path: {
				name: "文件路径",
				tooltip: "暂存此文件，并用 {input} 在参数中引用。"
			},
			directory_path: {
				name: "输入目录",
				tooltip: "接入上游目录中的文件。"
			},
			source_directory: {
				name: "本地源目录",
				tooltip: "宿主上的绝对目录路径，例如 FITS 序列所在目录。"
			},
			previous_steps: {
				name: "上游会话步骤",
				tooltip: "连接前一节点暂存的会话步骤。"
			}
		},
		outputs: {
			0: { name: "结果图像路径" },
			1: { name: "结果目录" },
			2: { name: "CLI 日志" },
			3: { name: "会话步骤" }
		}
	},
	AstroPhotoSiril_platesolve: {
		display_name: "图像天文定位",
		description: "将检测星点与星表匹配，为图像建立天球坐标。",
		inputs: {
			arguments: {
				name: "命令参数",
				tooltip: "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"
			},
			stage_only: {
				name: "仅暂存步骤",
				tooltip: "生成会话步骤供下游使用，本节点此时不运行 CLI。"
			},
			image_path: {
				name: "图像路径",
				tooltip: "命令执行前加载此文件。"
			},
			file_path: {
				name: "文件路径",
				tooltip: "暂存此文件，并用 {input} 在参数中引用。"
			},
			directory_path: {
				name: "输入目录",
				tooltip: "接入上游目录中的文件。"
			},
			source_directory: {
				name: "本地源目录",
				tooltip: "宿主上的绝对目录路径，例如 FITS 序列所在目录。"
			},
			previous_steps: {
				name: "上游会话步骤",
				tooltip: "连接前一节点暂存的会话步骤。"
			}
		},
		outputs: {
			0: { name: "结果图像路径" },
			1: { name: "结果目录" },
			2: { name: "CLI 日志" },
			3: { name: "会话步骤" }
		}
	},
	AstroPhotoSiril_pm: {
		display_name: "像素数学表达式",
		description: "对图像像素计算表达式并生成结果。",
		inputs: {
			arguments: {
				name: "命令参数",
				tooltip: "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"
			},
			stage_only: {
				name: "仅暂存步骤",
				tooltip: "生成会话步骤供下游使用，本节点此时不运行 CLI。"
			},
			file_path: {
				name: "文件路径",
				tooltip: "暂存此文件，并用 {input} 在参数中引用。"
			},
			directory_path: {
				name: "输入目录",
				tooltip: "接入上游目录中的文件。"
			},
			source_directory: {
				name: "本地源目录",
				tooltip: "宿主上的绝对目录路径，例如 FITS 序列所在目录。"
			},
			previous_steps: {
				name: "上游会话步骤",
				tooltip: "连接前一节点暂存的会话步骤。"
			}
		},
		outputs: {
			0: { name: "结果图像路径" },
			1: { name: "结果目录" },
			2: { name: "CLI 日志" },
			3: { name: "会话步骤" }
		}
	},
	AstroPhotoSiril_profile: {
		display_name: "测量线剖面",
		description: "按指定直线对当前图像的亮度采样，可导出剖面数据。",
		inputs: {
			arguments: {
				name: "命令参数",
				tooltip: "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"
			},
			stage_only: {
				name: "仅暂存步骤",
				tooltip: "生成会话步骤供下游使用，本节点此时不运行 CLI。"
			},
			image_path: {
				name: "图像路径",
				tooltip: "命令执行前加载此文件。"
			},
			file_path: {
				name: "文件路径",
				tooltip: "暂存此文件，并用 {input} 在参数中引用。"
			},
			directory_path: {
				name: "输入目录",
				tooltip: "接入上游目录中的文件。"
			},
			source_directory: {
				name: "本地源目录",
				tooltip: "宿主上的绝对目录路径，例如 FITS 序列所在目录。"
			},
			previous_steps: {
				name: "上游会话步骤",
				tooltip: "连接前一节点暂存的会话步骤。"
			}
		},
		outputs: {
			0: { name: "结果图像路径" },
			1: { name: "结果目录" },
			2: { name: "CLI 日志" },
			3: { name: "会话步骤" }
		}
	},
	AstroPhotoSiril_psf: {
		display_name: "测量恒星 PSF",
		description: "拟合选定恒星以测量其点扩散函数。",
		inputs: {
			arguments: {
				name: "命令参数",
				tooltip: "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"
			},
			stage_only: {
				name: "仅暂存步骤",
				tooltip: "生成会话步骤供下游使用，本节点此时不运行 CLI。"
			},
			image_path: {
				name: "图像路径",
				tooltip: "命令执行前加载此文件。"
			},
			file_path: {
				name: "文件路径",
				tooltip: "暂存此文件，并用 {input} 在参数中引用。"
			},
			directory_path: {
				name: "输入目录",
				tooltip: "接入上游目录中的文件。"
			},
			source_directory: {
				name: "本地源目录",
				tooltip: "宿主上的绝对目录路径，例如 FITS 序列所在目录。"
			},
			previous_steps: {
				name: "上游会话步骤",
				tooltip: "连接前一节点暂存的会话步骤。"
			}
		},
		outputs: {
			0: { name: "结果图像路径" },
			1: { name: "结果目录" },
			2: { name: "CLI 日志" },
			3: { name: "会话步骤" }
		}
	},
	AstroPhotoSiril_pwd: {
		display_name: "查看工作目录",
		description: "输出当前会话所在的工作目录。",
		inputs: {
			arguments: {
				name: "命令参数",
				tooltip: "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"
			},
			stage_only: {
				name: "仅暂存步骤",
				tooltip: "生成会话步骤供下游使用，本节点此时不运行 CLI。"
			},
			file_path: {
				name: "文件路径",
				tooltip: "暂存此文件，并用 {input} 在参数中引用。"
			},
			directory_path: {
				name: "输入目录",
				tooltip: "接入上游目录中的文件。"
			},
			source_directory: {
				name: "本地源目录",
				tooltip: "宿主上的绝对目录路径，例如 FITS 序列所在目录。"
			},
			previous_steps: {
				name: "上游会话步骤",
				tooltip: "连接前一节点暂存的会话步骤。"
			}
		},
		outputs: {
			0: { name: "结果图像路径" },
			1: { name: "结果目录" },
			2: { name: "CLI 日志" },
			3: { name: "会话步骤" }
		}
	},
	AstroPhotoSiril_pyscript: {
		display_name: "运行 Python 脚本",
		description: "使用给定参数运行宿主批准的 Python 脚本。",
		inputs: {
			arguments: {
				name: "命令参数",
				tooltip: "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"
			},
			stage_only: {
				name: "仅暂存步骤",
				tooltip: "生成会话步骤供下游使用，本节点此时不运行 CLI。"
			},
			file_path: {
				name: "文件路径",
				tooltip: "暂存此文件，并用 {input} 在参数中引用。"
			},
			directory_path: {
				name: "输入目录",
				tooltip: "接入上游目录中的文件。"
			},
			source_directory: {
				name: "本地源目录",
				tooltip: "宿主上的绝对目录路径，例如 FITS 序列所在目录。"
			},
			previous_steps: {
				name: "上游会话步骤",
				tooltip: "连接前一节点暂存的会话步骤。"
			}
		},
		outputs: {
			0: { name: "结果图像路径" },
			1: { name: "结果目录" },
			2: { name: "CLI 日志" },
			3: { name: "会话步骤" }
		}
	},
	AstroPhotoSiril_register: {
		display_name: "配准序列",
		description: "将序列各帧与参考帧对齐。",
		inputs: {
			arguments: {
				name: "命令参数",
				tooltip: "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"
			},
			stage_only: {
				name: "仅暂存步骤",
				tooltip: "生成会话步骤供下游使用，本节点此时不运行 CLI。"
			},
			file_path: {
				name: "文件路径",
				tooltip: "暂存此文件，并用 {input} 在参数中引用。"
			},
			directory_path: {
				name: "输入目录",
				tooltip: "接入上游目录中的文件。"
			},
			source_directory: {
				name: "本地源目录",
				tooltip: "宿主上的绝对目录路径，例如 FITS 序列所在目录。"
			},
			previous_steps: {
				name: "上游会话步骤",
				tooltip: "连接前一节点暂存的会话步骤。"
			}
		},
		outputs: {
			0: { name: "结果图像路径" },
			1: { name: "结果目录" },
			2: { name: "CLI 日志" },
			3: { name: "会话步骤" }
		}
	},
	AstroPhotoSiril_requires: {
		display_name: "检查版本要求",
		description: "检查 Siril 最低版本，并可设置适用版本上界。",
		inputs: {
			arguments: {
				name: "命令参数",
				tooltip: "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"
			},
			stage_only: {
				name: "仅暂存步骤",
				tooltip: "生成会话步骤供下游使用，本节点此时不运行 CLI。"
			},
			file_path: {
				name: "文件路径",
				tooltip: "暂存此文件，并用 {input} 在参数中引用。"
			},
			directory_path: {
				name: "输入目录",
				tooltip: "接入上游目录中的文件。"
			},
			source_directory: {
				name: "本地源目录",
				tooltip: "宿主上的绝对目录路径，例如 FITS 序列所在目录。"
			},
			previous_steps: {
				name: "上游会话步骤",
				tooltip: "连接前一节点暂存的会话步骤。"
			}
		},
		outputs: {
			0: { name: "结果图像路径" },
			1: { name: "结果目录" },
			2: { name: "CLI 日志" },
			3: { name: "会话步骤" }
		}
	},
	AstroPhotoSiril_resample: {
		display_name: "重采样图像",
		description: "按缩放倍率或目标尺寸插值重采样当前图像。",
		inputs: {
			arguments: {
				name: "命令参数",
				tooltip: "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"
			},
			stage_only: {
				name: "仅暂存步骤",
				tooltip: "生成会话步骤供下游使用，本节点此时不运行 CLI。"
			},
			image_path: {
				name: "图像路径",
				tooltip: "命令执行前加载此文件。"
			},
			file_path: {
				name: "文件路径",
				tooltip: "暂存此文件，并用 {input} 在参数中引用。"
			},
			directory_path: {
				name: "输入目录",
				tooltip: "接入上游目录中的文件。"
			},
			source_directory: {
				name: "本地源目录",
				tooltip: "宿主上的绝对目录路径，例如 FITS 序列所在目录。"
			},
			previous_steps: {
				name: "上游会话步骤",
				tooltip: "连接前一节点暂存的会话步骤。"
			}
		},
		outputs: {
			0: { name: "结果图像路径" },
			1: { name: "结果目录" },
			2: { name: "CLI 日志" },
			3: { name: "会话步骤" }
		}
	},
	AstroPhotoSiril_rgbcomp: {
		display_name: "合成 RGB 图像",
		description: "将分离的通道图像合成为彩色图像。",
		inputs: {
			arguments: {
				name: "命令参数",
				tooltip: "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"
			},
			stage_only: {
				name: "仅暂存步骤",
				tooltip: "生成会话步骤供下游使用，本节点此时不运行 CLI。"
			},
			file_path: {
				name: "文件路径",
				tooltip: "暂存此文件，并用 {input} 在参数中引用。"
			},
			directory_path: {
				name: "输入目录",
				tooltip: "接入上游目录中的文件。"
			},
			source_directory: {
				name: "本地源目录",
				tooltip: "宿主上的绝对目录路径，例如 FITS 序列所在目录。"
			},
			previous_steps: {
				name: "上游会话步骤",
				tooltip: "连接前一节点暂存的会话步骤。"
			}
		},
		outputs: {
			0: { name: "结果图像路径" },
			1: { name: "结果目录" },
			2: { name: "CLI 日志" },
			3: { name: "会话步骤" }
		}
	},
	AstroPhotoSiril_rgradient: {
		display_name: "径向梯度滤波",
		description: "围绕指定中心使用旋转梯度增强局部结构。",
		inputs: {
			arguments: {
				name: "命令参数",
				tooltip: "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"
			},
			stage_only: {
				name: "仅暂存步骤",
				tooltip: "生成会话步骤供下游使用，本节点此时不运行 CLI。"
			},
			image_path: {
				name: "图像路径",
				tooltip: "命令执行前加载此文件。"
			},
			file_path: {
				name: "文件路径",
				tooltip: "暂存此文件，并用 {input} 在参数中引用。"
			},
			directory_path: {
				name: "输入目录",
				tooltip: "接入上游目录中的文件。"
			},
			source_directory: {
				name: "本地源目录",
				tooltip: "宿主上的绝对目录路径，例如 FITS 序列所在目录。"
			},
			previous_steps: {
				name: "上游会话步骤",
				tooltip: "连接前一节点暂存的会话步骤。"
			}
		},
		outputs: {
			0: { name: "结果图像路径" },
			1: { name: "结果目录" },
			2: { name: "CLI 日志" },
			3: { name: "会话步骤" }
		}
	},
	AstroPhotoSiril_rl: {
		display_name: "Richardson–Lucy 反卷积",
		description: "用 Richardson–Lucy 迭代反卷积恢复细节。",
		inputs: {
			arguments: {
				name: "命令参数",
				tooltip: "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"
			},
			stage_only: {
				name: "仅暂存步骤",
				tooltip: "生成会话步骤供下游使用，本节点此时不运行 CLI。"
			},
			image_path: {
				name: "图像路径",
				tooltip: "命令执行前加载此文件。"
			},
			file_path: {
				name: "文件路径",
				tooltip: "暂存此文件，并用 {input} 在参数中引用。"
			},
			directory_path: {
				name: "输入目录",
				tooltip: "接入上游目录中的文件。"
			},
			source_directory: {
				name: "本地源目录",
				tooltip: "宿主上的绝对目录路径，例如 FITS 序列所在目录。"
			},
			previous_steps: {
				name: "上游会话步骤",
				tooltip: "连接前一节点暂存的会话步骤。"
			}
		},
		outputs: {
			0: { name: "结果图像路径" },
			1: { name: "结果目录" },
			2: { name: "CLI 日志" },
			3: { name: "会话步骤" }
		}
	},
	AstroPhotoSiril_rmgreen: {
		display_name: "抑制绿色偏色（SCNR）",
		description: "按所选中和方法减少多余的绿色成分。",
		inputs: {
			arguments: {
				name: "命令参数",
				tooltip: "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"
			},
			stage_only: {
				name: "仅暂存步骤",
				tooltip: "生成会话步骤供下游使用，本节点此时不运行 CLI。"
			},
			image_path: {
				name: "图像路径",
				tooltip: "命令执行前加载此文件。"
			},
			file_path: {
				name: "文件路径",
				tooltip: "暂存此文件，并用 {input} 在参数中引用。"
			},
			directory_path: {
				name: "输入目录",
				tooltip: "接入上游目录中的文件。"
			},
			source_directory: {
				name: "本地源目录",
				tooltip: "宿主上的绝对目录路径，例如 FITS 序列所在目录。"
			},
			previous_steps: {
				name: "上游会话步骤",
				tooltip: "连接前一节点暂存的会话步骤。"
			}
		},
		outputs: {
			0: { name: "结果图像路径" },
			1: { name: "结果目录" },
			2: { name: "CLI 日志" },
			3: { name: "会话步骤" }
		}
	},
	AstroPhotoSiril_rotate: {
		display_name: "旋转图像",
		description: "按指定角度和插值方式旋转当前图像。",
		inputs: {
			arguments: {
				name: "命令参数",
				tooltip: "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"
			},
			stage_only: {
				name: "仅暂存步骤",
				tooltip: "生成会话步骤供下游使用，本节点此时不运行 CLI。"
			},
			image_path: {
				name: "图像路径",
				tooltip: "命令执行前加载此文件。"
			},
			file_path: {
				name: "文件路径",
				tooltip: "暂存此文件，并用 {input} 在参数中引用。"
			},
			directory_path: {
				name: "输入目录",
				tooltip: "接入上游目录中的文件。"
			},
			source_directory: {
				name: "本地源目录",
				tooltip: "宿主上的绝对目录路径，例如 FITS 序列所在目录。"
			},
			previous_steps: {
				name: "上游会话步骤",
				tooltip: "连接前一节点暂存的会话步骤。"
			}
		},
		outputs: {
			0: { name: "结果图像路径" },
			1: { name: "结果目录" },
			2: { name: "CLI 日志" },
			3: { name: "会话步骤" }
		}
	},
	AstroPhotoSiril_rotatePi: {
		display_name: "旋转 180°",
		description: "将当前图像旋转半周。",
		inputs: {
			arguments: {
				name: "命令参数",
				tooltip: "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"
			},
			stage_only: {
				name: "仅暂存步骤",
				tooltip: "生成会话步骤供下游使用，本节点此时不运行 CLI。"
			},
			image_path: {
				name: "图像路径",
				tooltip: "命令执行前加载此文件。"
			},
			file_path: {
				name: "文件路径",
				tooltip: "暂存此文件，并用 {input} 在参数中引用。"
			},
			directory_path: {
				name: "输入目录",
				tooltip: "接入上游目录中的文件。"
			},
			source_directory: {
				name: "本地源目录",
				tooltip: "宿主上的绝对目录路径，例如 FITS 序列所在目录。"
			},
			previous_steps: {
				name: "上游会话步骤",
				tooltip: "连接前一节点暂存的会话步骤。"
			}
		},
		outputs: {
			0: { name: "结果图像路径" },
			1: { name: "结果目录" },
			2: { name: "CLI 日志" },
			3: { name: "会话步骤" }
		}
	},
	AstroPhotoSiril_satu: {
		display_name: "调整饱和度",
		description: "调整色彩饱和度，可指定背景参数和色相范围。",
		inputs: {
			arguments: {
				name: "命令参数",
				tooltip: "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"
			},
			stage_only: {
				name: "仅暂存步骤",
				tooltip: "生成会话步骤供下游使用，本节点此时不运行 CLI。"
			},
			image_path: {
				name: "图像路径",
				tooltip: "命令执行前加载此文件。"
			},
			file_path: {
				name: "文件路径",
				tooltip: "暂存此文件，并用 {input} 在参数中引用。"
			},
			directory_path: {
				name: "输入目录",
				tooltip: "接入上游目录中的文件。"
			},
			source_directory: {
				name: "本地源目录",
				tooltip: "宿主上的绝对目录路径，例如 FITS 序列所在目录。"
			},
			previous_steps: {
				name: "上游会话步骤",
				tooltip: "连接前一节点暂存的会话步骤。"
			}
		},
		outputs: {
			0: { name: "结果图像路径" },
			1: { name: "结果目录" },
			2: { name: "CLI 日志" },
			3: { name: "会话步骤" }
		}
	},
	AstroPhotoSiril_save: {
		display_name: "保存 FITS",
		description: "将当前图像写入 FITS，可同时写入校验和。",
		inputs: {
			arguments: {
				name: "命令参数",
				tooltip: "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"
			},
			stage_only: {
				name: "仅暂存步骤",
				tooltip: "生成会话步骤供下游使用，本节点此时不运行 CLI。"
			},
			image_path: {
				name: "图像路径",
				tooltip: "命令执行前加载此文件。"
			},
			file_path: {
				name: "文件路径",
				tooltip: "暂存此文件，并用 {input} 在参数中引用。"
			},
			directory_path: {
				name: "输入目录",
				tooltip: "接入上游目录中的文件。"
			},
			source_directory: {
				name: "本地源目录",
				tooltip: "宿主上的绝对目录路径，例如 FITS 序列所在目录。"
			},
			previous_steps: {
				name: "上游会话步骤",
				tooltip: "连接前一节点暂存的会话步骤。"
			}
		},
		outputs: {
			0: { name: "结果图像路径" },
			1: { name: "结果目录" },
			2: { name: "CLI 日志" },
			3: { name: "会话步骤" }
		}
	},
	AstroPhotoSiril_savebmp: {
		display_name: "导出 BMP",
		description: "将当前图像导出为 BMP。",
		inputs: {
			arguments: {
				name: "命令参数",
				tooltip: "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"
			},
			stage_only: {
				name: "仅暂存步骤",
				tooltip: "生成会话步骤供下游使用，本节点此时不运行 CLI。"
			},
			image_path: {
				name: "图像路径",
				tooltip: "命令执行前加载此文件。"
			},
			file_path: {
				name: "文件路径",
				tooltip: "暂存此文件，并用 {input} 在参数中引用。"
			},
			directory_path: {
				name: "输入目录",
				tooltip: "接入上游目录中的文件。"
			},
			source_directory: {
				name: "本地源目录",
				tooltip: "宿主上的绝对目录路径，例如 FITS 序列所在目录。"
			},
			previous_steps: {
				name: "上游会话步骤",
				tooltip: "连接前一节点暂存的会话步骤。"
			}
		},
		outputs: {
			0: { name: "结果图像路径" },
			1: { name: "结果目录" },
			2: { name: "CLI 日志" },
			3: { name: "会话步骤" }
		}
	},
	AstroPhotoSiril_savejpg: {
		display_name: "导出 JPEG",
		description: "导出 JPEG，可指定压缩质量。",
		inputs: {
			arguments: {
				name: "命令参数",
				tooltip: "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"
			},
			stage_only: {
				name: "仅暂存步骤",
				tooltip: "生成会话步骤供下游使用，本节点此时不运行 CLI。"
			},
			image_path: {
				name: "图像路径",
				tooltip: "命令执行前加载此文件。"
			},
			file_path: {
				name: "文件路径",
				tooltip: "暂存此文件，并用 {input} 在参数中引用。"
			},
			directory_path: {
				name: "输入目录",
				tooltip: "接入上游目录中的文件。"
			},
			source_directory: {
				name: "本地源目录",
				tooltip: "宿主上的绝对目录路径，例如 FITS 序列所在目录。"
			},
			previous_steps: {
				name: "上游会话步骤",
				tooltip: "连接前一节点暂存的会话步骤。"
			}
		},
		outputs: {
			0: { name: "结果图像路径" },
			1: { name: "结果目录" },
			2: { name: "CLI 日志" },
			3: { name: "会话步骤" }
		}
	},
	AstroPhotoSiril_savejxl: {
		display_name: "导出 JPEG XL",
		description: "导出 JPEG XL，可设置质量、压缩强度和位深。",
		inputs: {
			arguments: {
				name: "命令参数",
				tooltip: "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"
			},
			stage_only: {
				name: "仅暂存步骤",
				tooltip: "生成会话步骤供下游使用，本节点此时不运行 CLI。"
			},
			image_path: {
				name: "图像路径",
				tooltip: "命令执行前加载此文件。"
			},
			file_path: {
				name: "文件路径",
				tooltip: "暂存此文件，并用 {input} 在参数中引用。"
			},
			directory_path: {
				name: "输入目录",
				tooltip: "接入上游目录中的文件。"
			},
			source_directory: {
				name: "本地源目录",
				tooltip: "宿主上的绝对目录路径，例如 FITS 序列所在目录。"
			},
			previous_steps: {
				name: "上游会话步骤",
				tooltip: "连接前一节点暂存的会话步骤。"
			}
		},
		outputs: {
			0: { name: "结果图像路径" },
			1: { name: "结果目录" },
			2: { name: "CLI 日志" },
			3: { name: "会话步骤" }
		}
	},
	AstroPhotoSiril_savepng: {
		display_name: "导出 PNG",
		description: "将当前图像导出为 PNG。",
		inputs: {
			arguments: {
				name: "命令参数",
				tooltip: "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"
			},
			stage_only: {
				name: "仅暂存步骤",
				tooltip: "生成会话步骤供下游使用，本节点此时不运行 CLI。"
			},
			image_path: {
				name: "图像路径",
				tooltip: "命令执行前加载此文件。"
			},
			file_path: {
				name: "文件路径",
				tooltip: "暂存此文件，并用 {input} 在参数中引用。"
			},
			directory_path: {
				name: "输入目录",
				tooltip: "接入上游目录中的文件。"
			},
			source_directory: {
				name: "本地源目录",
				tooltip: "宿主上的绝对目录路径，例如 FITS 序列所在目录。"
			},
			previous_steps: {
				name: "上游会话步骤",
				tooltip: "连接前一节点暂存的会话步骤。"
			}
		},
		outputs: {
			0: { name: "结果图像路径" },
			1: { name: "结果目录" },
			2: { name: "CLI 日志" },
			3: { name: "会话步骤" }
		}
	},
	AstroPhotoSiril_savepnm: {
		display_name: "导出 PNM",
		description: "将当前图像导出为 PNM。",
		inputs: {
			arguments: {
				name: "命令参数",
				tooltip: "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"
			},
			stage_only: {
				name: "仅暂存步骤",
				tooltip: "生成会话步骤供下游使用，本节点此时不运行 CLI。"
			},
			image_path: {
				name: "图像路径",
				tooltip: "命令执行前加载此文件。"
			},
			file_path: {
				name: "文件路径",
				tooltip: "暂存此文件，并用 {input} 在参数中引用。"
			},
			directory_path: {
				name: "输入目录",
				tooltip: "接入上游目录中的文件。"
			},
			source_directory: {
				name: "本地源目录",
				tooltip: "宿主上的绝对目录路径，例如 FITS 序列所在目录。"
			},
			previous_steps: {
				name: "上游会话步骤",
				tooltip: "连接前一节点暂存的会话步骤。"
			}
		},
		outputs: {
			0: { name: "结果图像路径" },
			1: { name: "结果目录" },
			2: { name: "CLI 日志" },
			3: { name: "会话步骤" }
		}
	},
	AstroPhotoSiril_savetif: {
		display_name: "导出 16 位 TIFF",
		description: "导出 16 位 TIFF，可包含天文元数据并启用压缩。",
		inputs: {
			arguments: {
				name: "命令参数",
				tooltip: "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"
			},
			stage_only: {
				name: "仅暂存步骤",
				tooltip: "生成会话步骤供下游使用，本节点此时不运行 CLI。"
			},
			image_path: {
				name: "图像路径",
				tooltip: "命令执行前加载此文件。"
			},
			file_path: {
				name: "文件路径",
				tooltip: "暂存此文件，并用 {input} 在参数中引用。"
			},
			directory_path: {
				name: "输入目录",
				tooltip: "接入上游目录中的文件。"
			},
			source_directory: {
				name: "本地源目录",
				tooltip: "宿主上的绝对目录路径，例如 FITS 序列所在目录。"
			},
			previous_steps: {
				name: "上游会话步骤",
				tooltip: "连接前一节点暂存的会话步骤。"
			}
		},
		outputs: {
			0: { name: "结果图像路径" },
			1: { name: "结果目录" },
			2: { name: "CLI 日志" },
			3: { name: "会话步骤" }
		}
	},
	AstroPhotoSiril_savetif32: {
		display_name: "导出 32 位 TIFF",
		description: "以 32 位 TIFF 导出当前图像。",
		inputs: {
			arguments: {
				name: "命令参数",
				tooltip: "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"
			},
			stage_only: {
				name: "仅暂存步骤",
				tooltip: "生成会话步骤供下游使用，本节点此时不运行 CLI。"
			},
			image_path: {
				name: "图像路径",
				tooltip: "命令执行前加载此文件。"
			},
			file_path: {
				name: "文件路径",
				tooltip: "暂存此文件，并用 {input} 在参数中引用。"
			},
			directory_path: {
				name: "输入目录",
				tooltip: "接入上游目录中的文件。"
			},
			source_directory: {
				name: "本地源目录",
				tooltip: "宿主上的绝对目录路径，例如 FITS 序列所在目录。"
			},
			previous_steps: {
				name: "上游会话步骤",
				tooltip: "连接前一节点暂存的会话步骤。"
			}
		},
		outputs: {
			0: { name: "结果图像路径" },
			1: { name: "结果目录" },
			2: { name: "CLI 日志" },
			3: { name: "会话步骤" }
		}
	},
	AstroPhotoSiril_savetif8: {
		display_name: "导出 8 位 TIFF",
		description: "以 8 位 TIFF 导出当前图像。",
		inputs: {
			arguments: {
				name: "命令参数",
				tooltip: "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"
			},
			stage_only: {
				name: "仅暂存步骤",
				tooltip: "生成会话步骤供下游使用，本节点此时不运行 CLI。"
			},
			image_path: {
				name: "图像路径",
				tooltip: "命令执行前加载此文件。"
			},
			file_path: {
				name: "文件路径",
				tooltip: "暂存此文件，并用 {input} 在参数中引用。"
			},
			directory_path: {
				name: "输入目录",
				tooltip: "接入上游目录中的文件。"
			},
			source_directory: {
				name: "本地源目录",
				tooltip: "宿主上的绝对目录路径，例如 FITS 序列所在目录。"
			},
			previous_steps: {
				name: "上游会话步骤",
				tooltip: "连接前一节点暂存的会话步骤。"
			}
		},
		outputs: {
			0: { name: "结果图像路径" },
			1: { name: "结果目录" },
			2: { name: "CLI 日志" },
			3: { name: "会话步骤" }
		}
	},
	AstroPhotoSiril_sb: {
		display_name: "Split Bregman 反卷积",
		description: "用 Split Bregman 反卷积求解方法恢复细节。",
		inputs: {
			arguments: {
				name: "命令参数",
				tooltip: "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"
			},
			stage_only: {
				name: "仅暂存步骤",
				tooltip: "生成会话步骤供下游使用，本节点此时不运行 CLI。"
			},
			image_path: {
				name: "图像路径",
				tooltip: "命令执行前加载此文件。"
			},
			file_path: {
				name: "文件路径",
				tooltip: "暂存此文件，并用 {input} 在参数中引用。"
			},
			directory_path: {
				name: "输入目录",
				tooltip: "接入上游目录中的文件。"
			},
			source_directory: {
				name: "本地源目录",
				tooltip: "宿主上的绝对目录路径，例如 FITS 序列所在目录。"
			},
			previous_steps: {
				name: "上游会话步骤",
				tooltip: "连接前一节点暂存的会话步骤。"
			}
		},
		outputs: {
			0: { name: "结果图像路径" },
			1: { name: "结果目录" },
			2: { name: "CLI 日志" },
			3: { name: "会话步骤" }
		}
	},
	AstroPhotoSiril_select: {
		display_name: "纳入序列帧",
		description: "将指定范围内的序列帧标记为已选。",
		inputs: {
			arguments: {
				name: "命令参数",
				tooltip: "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"
			},
			stage_only: {
				name: "仅暂存步骤",
				tooltip: "生成会话步骤供下游使用，本节点此时不运行 CLI。"
			},
			file_path: {
				name: "文件路径",
				tooltip: "暂存此文件，并用 {input} 在参数中引用。"
			},
			directory_path: {
				name: "输入目录",
				tooltip: "接入上游目录中的文件。"
			},
			source_directory: {
				name: "本地源目录",
				tooltip: "宿主上的绝对目录路径，例如 FITS 序列所在目录。"
			},
			previous_steps: {
				name: "上游会话步骤",
				tooltip: "连接前一节点暂存的会话步骤。"
			}
		},
		outputs: {
			0: { name: "结果图像路径" },
			1: { name: "结果目录" },
			2: { name: "CLI 日志" },
			3: { name: "会话步骤" }
		}
	},
	AstroPhotoSiril_seqapplyreg: {
		display_name: "应用序列配准",
		description: "利用已有配准数据变换序列帧。",
		inputs: {
			arguments: {
				name: "命令参数",
				tooltip: "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"
			},
			stage_only: {
				name: "仅暂存步骤",
				tooltip: "生成会话步骤供下游使用，本节点此时不运行 CLI。"
			},
			file_path: {
				name: "文件路径",
				tooltip: "暂存此文件，并用 {input} 在参数中引用。"
			},
			directory_path: {
				name: "输入目录",
				tooltip: "接入上游目录中的文件。"
			},
			source_directory: {
				name: "本地源目录",
				tooltip: "宿主上的绝对目录路径，例如 FITS 序列所在目录。"
			},
			previous_steps: {
				name: "上游会话步骤",
				tooltip: "连接前一节点暂存的会话步骤。"
			}
		},
		outputs: {
			0: { name: "结果图像路径" },
			1: { name: "结果目录" },
			2: { name: "CLI 日志" },
			3: { name: "会话步骤" }
		}
	},
	AstroPhotoSiril_seqccm: {
		display_name: "序列 · 应用颜色校正矩阵",
		description: "用 3×3 颜色校正矩阵变换 RGB 数值。此命令用于序列处理。",
		inputs: {
			arguments: {
				name: "命令参数",
				tooltip: "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"
			},
			stage_only: {
				name: "仅暂存步骤",
				tooltip: "生成会话步骤供下游使用，本节点此时不运行 CLI。"
			},
			file_path: {
				name: "文件路径",
				tooltip: "暂存此文件，并用 {input} 在参数中引用。"
			},
			directory_path: {
				name: "输入目录",
				tooltip: "接入上游目录中的文件。"
			},
			source_directory: {
				name: "本地源目录",
				tooltip: "宿主上的绝对目录路径，例如 FITS 序列所在目录。"
			},
			previous_steps: {
				name: "上游会话步骤",
				tooltip: "连接前一节点暂存的会话步骤。"
			}
		},
		outputs: {
			0: { name: "结果图像路径" },
			1: { name: "结果目录" },
			2: { name: "CLI 日志" },
			3: { name: "会话步骤" }
		}
	},
	AstroPhotoSiril_seqclean: {
		display_name: "清理序列状态",
		description: "清除序列已保存的配准、统计或选帧数据。",
		inputs: {
			arguments: {
				name: "命令参数",
				tooltip: "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"
			},
			stage_only: {
				name: "仅暂存步骤",
				tooltip: "生成会话步骤供下游使用，本节点此时不运行 CLI。"
			},
			file_path: {
				name: "文件路径",
				tooltip: "暂存此文件，并用 {input} 在参数中引用。"
			},
			directory_path: {
				name: "输入目录",
				tooltip: "接入上游目录中的文件。"
			},
			source_directory: {
				name: "本地源目录",
				tooltip: "宿主上的绝对目录路径，例如 FITS 序列所在目录。"
			},
			previous_steps: {
				name: "上游会话步骤",
				tooltip: "连接前一节点暂存的会话步骤。"
			}
		},
		outputs: {
			0: { name: "结果图像路径" },
			1: { name: "结果目录" },
			2: { name: "CLI 日志" },
			3: { name: "会话步骤" }
		}
	},
	AstroPhotoSiril_seqcosme: {
		display_name: "序列 · 修正坏像素",
		description: "按提供的坏像素映射表修正指定像素。此命令用于序列处理。",
		inputs: {
			arguments: {
				name: "命令参数",
				tooltip: "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"
			},
			stage_only: {
				name: "仅暂存步骤",
				tooltip: "生成会话步骤供下游使用，本节点此时不运行 CLI。"
			},
			file_path: {
				name: "文件路径",
				tooltip: "暂存此文件，并用 {input} 在参数中引用。"
			},
			directory_path: {
				name: "输入目录",
				tooltip: "接入上游目录中的文件。"
			},
			source_directory: {
				name: "本地源目录",
				tooltip: "宿主上的绝对目录路径，例如 FITS 序列所在目录。"
			},
			previous_steps: {
				name: "上游会话步骤",
				tooltip: "连接前一节点暂存的会话步骤。"
			}
		},
		outputs: {
			0: { name: "结果图像路径" },
			1: { name: "结果目录" },
			2: { name: "CLI 日志" },
			3: { name: "会话步骤" }
		}
	},
	AstroPhotoSiril_seqcosme_cfa: {
		display_name: "序列 · 修正 CFA 坏像素",
		description: "依据传感器彩色滤光阵列修正表中坏像素。此命令用于序列处理。",
		inputs: {
			arguments: {
				name: "命令参数",
				tooltip: "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"
			},
			stage_only: {
				name: "仅暂存步骤",
				tooltip: "生成会话步骤供下游使用，本节点此时不运行 CLI。"
			},
			file_path: {
				name: "文件路径",
				tooltip: "暂存此文件，并用 {input} 在参数中引用。"
			},
			directory_path: {
				name: "输入目录",
				tooltip: "接入上游目录中的文件。"
			},
			source_directory: {
				name: "本地源目录",
				tooltip: "宿主上的绝对目录路径，例如 FITS 序列所在目录。"
			},
			previous_steps: {
				name: "上游会话步骤",
				tooltip: "连接前一节点暂存的会话步骤。"
			}
		},
		outputs: {
			0: { name: "结果图像路径" },
			1: { name: "结果目录" },
			2: { name: "CLI 日志" },
			3: { name: "会话步骤" }
		}
	},
	AstroPhotoSiril_seqcrop: {
		display_name: "序列 · 裁剪图像",
		description: "保留当前图像的指定矩形区域。此命令用于序列处理。",
		inputs: {
			arguments: {
				name: "命令参数",
				tooltip: "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"
			},
			stage_only: {
				name: "仅暂存步骤",
				tooltip: "生成会话步骤供下游使用，本节点此时不运行 CLI。"
			},
			file_path: {
				name: "文件路径",
				tooltip: "暂存此文件，并用 {input} 在参数中引用。"
			},
			directory_path: {
				name: "输入目录",
				tooltip: "接入上游目录中的文件。"
			},
			source_directory: {
				name: "本地源目录",
				tooltip: "宿主上的绝对目录路径，例如 FITS 序列所在目录。"
			},
			previous_steps: {
				name: "上游会话步骤",
				tooltip: "连接前一节点暂存的会话步骤。"
			}
		},
		outputs: {
			0: { name: "结果图像路径" },
			1: { name: "结果目录" },
			2: { name: "CLI 日志" },
			3: { name: "会话步骤" }
		}
	},
	AstroPhotoSiril_seqextract_Green: {
		display_name: "序列 · 提取 CFA 绿色信号",
		description: "从彩色滤光阵列提取平均后的绿色信号。此命令用于序列处理。",
		inputs: {
			arguments: {
				name: "命令参数",
				tooltip: "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"
			},
			stage_only: {
				name: "仅暂存步骤",
				tooltip: "生成会话步骤供下游使用，本节点此时不运行 CLI。"
			},
			file_path: {
				name: "文件路径",
				tooltip: "暂存此文件，并用 {input} 在参数中引用。"
			},
			directory_path: {
				name: "输入目录",
				tooltip: "接入上游目录中的文件。"
			},
			source_directory: {
				name: "本地源目录",
				tooltip: "宿主上的绝对目录路径，例如 FITS 序列所在目录。"
			},
			previous_steps: {
				name: "上游会话步骤",
				tooltip: "连接前一节点暂存的会话步骤。"
			}
		},
		outputs: {
			0: { name: "结果图像路径" },
			1: { name: "结果目录" },
			2: { name: "CLI 日志" },
			3: { name: "会话步骤" }
		}
	},
	AstroPhotoSiril_seqextract_Ha: {
		display_name: "序列 · 提取 Hα",
		description: "从适用的 CFA 图像中提取红色滤镜采集的 Hα 信号。此命令用于序列处理。",
		inputs: {
			arguments: {
				name: "命令参数",
				tooltip: "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"
			},
			stage_only: {
				name: "仅暂存步骤",
				tooltip: "生成会话步骤供下游使用，本节点此时不运行 CLI。"
			},
			file_path: {
				name: "文件路径",
				tooltip: "暂存此文件，并用 {input} 在参数中引用。"
			},
			directory_path: {
				name: "输入目录",
				tooltip: "接入上游目录中的文件。"
			},
			source_directory: {
				name: "本地源目录",
				tooltip: "宿主上的绝对目录路径，例如 FITS 序列所在目录。"
			},
			previous_steps: {
				name: "上游会话步骤",
				tooltip: "连接前一节点暂存的会话步骤。"
			}
		},
		outputs: {
			0: { name: "结果图像路径" },
			1: { name: "结果目录" },
			2: { name: "CLI 日志" },
			3: { name: "会话步骤" }
		}
	},
	AstroPhotoSiril_seqextract_HaOIII: {
		display_name: "序列 · 提取 Hα 和 O III",
		description: "从适用的双窄带 CFA 图像中分离 Hα 和 O III 信号。此命令用于序列处理。",
		inputs: {
			arguments: {
				name: "命令参数",
				tooltip: "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"
			},
			stage_only: {
				name: "仅暂存步骤",
				tooltip: "生成会话步骤供下游使用，本节点此时不运行 CLI。"
			},
			file_path: {
				name: "文件路径",
				tooltip: "暂存此文件，并用 {input} 在参数中引用。"
			},
			directory_path: {
				name: "输入目录",
				tooltip: "接入上游目录中的文件。"
			},
			source_directory: {
				name: "本地源目录",
				tooltip: "宿主上的绝对目录路径，例如 FITS 序列所在目录。"
			},
			previous_steps: {
				name: "上游会话步骤",
				tooltip: "连接前一节点暂存的会话步骤。"
			}
		},
		outputs: {
			0: { name: "结果图像路径" },
			1: { name: "结果目录" },
			2: { name: "CLI 日志" },
			3: { name: "会话步骤" }
		}
	},
	AstroPhotoSiril_seqfind_cosme: {
		display_name: "序列 · 检测并修正坏像素",
		description: "用标准差阈值检测并修正过亮和过暗的坏像素。此命令用于序列处理。",
		inputs: {
			arguments: {
				name: "命令参数",
				tooltip: "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"
			},
			stage_only: {
				name: "仅暂存步骤",
				tooltip: "生成会话步骤供下游使用，本节点此时不运行 CLI。"
			},
			file_path: {
				name: "文件路径",
				tooltip: "暂存此文件，并用 {input} 在参数中引用。"
			},
			directory_path: {
				name: "输入目录",
				tooltip: "接入上游目录中的文件。"
			},
			source_directory: {
				name: "本地源目录",
				tooltip: "宿主上的绝对目录路径，例如 FITS 序列所在目录。"
			},
			previous_steps: {
				name: "上游会话步骤",
				tooltip: "连接前一节点暂存的会话步骤。"
			}
		},
		outputs: {
			0: { name: "结果图像路径" },
			1: { name: "结果目录" },
			2: { name: "CLI 日志" },
			3: { name: "会话步骤" }
		}
	},
	AstroPhotoSiril_seqfind_cosme_cfa: {
		display_name: "序列 · 检测并修正 CFA 坏像素",
		description: "检测并修正彩色滤光阵列图像中的过亮和过暗坏像素。此命令用于序列处理。",
		inputs: {
			arguments: {
				name: "命令参数",
				tooltip: "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"
			},
			stage_only: {
				name: "仅暂存步骤",
				tooltip: "生成会话步骤供下游使用，本节点此时不运行 CLI。"
			},
			file_path: {
				name: "文件路径",
				tooltip: "暂存此文件，并用 {input} 在参数中引用。"
			},
			directory_path: {
				name: "输入目录",
				tooltip: "接入上游目录中的文件。"
			},
			source_directory: {
				name: "本地源目录",
				tooltip: "宿主上的绝对目录路径，例如 FITS 序列所在目录。"
			},
			previous_steps: {
				name: "上游会话步骤",
				tooltip: "连接前一节点暂存的会话步骤。"
			}
		},
		outputs: {
			0: { name: "结果图像路径" },
			1: { name: "结果目录" },
			2: { name: "CLI 日志" },
			3: { name: "会话步骤" }
		}
	},
	AstroPhotoSiril_seqfindstar: {
		display_name: "序列 · 检测星点",
		description: "检测当前图像中的星点，可导出检测结果。此命令用于序列处理。",
		inputs: {
			arguments: {
				name: "命令参数",
				tooltip: "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"
			},
			stage_only: {
				name: "仅暂存步骤",
				tooltip: "生成会话步骤供下游使用，本节点此时不运行 CLI。"
			},
			file_path: {
				name: "文件路径",
				tooltip: "暂存此文件，并用 {input} 在参数中引用。"
			},
			directory_path: {
				name: "输入目录",
				tooltip: "接入上游目录中的文件。"
			},
			source_directory: {
				name: "本地源目录",
				tooltip: "宿主上的绝对目录路径，例如 FITS 序列所在目录。"
			},
			previous_steps: {
				name: "上游会话步骤",
				tooltip: "连接前一节点暂存的会话步骤。"
			}
		},
		outputs: {
			0: { name: "结果图像路径" },
			1: { name: "结果目录" },
			2: { name: "CLI 日志" },
			3: { name: "会话步骤" }
		}
	},
	AstroPhotoSiril_seqfixbanding: {
		display_name: "序列 · 去除条带",
		description: "减弱图像中沿行或列的条带噪声。此命令用于序列处理。",
		inputs: {
			arguments: {
				name: "命令参数",
				tooltip: "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"
			},
			stage_only: {
				name: "仅暂存步骤",
				tooltip: "生成会话步骤供下游使用，本节点此时不运行 CLI。"
			},
			file_path: {
				name: "文件路径",
				tooltip: "暂存此文件，并用 {input} 在参数中引用。"
			},
			directory_path: {
				name: "输入目录",
				tooltip: "接入上游目录中的文件。"
			},
			source_directory: {
				name: "本地源目录",
				tooltip: "宿主上的绝对目录路径，例如 FITS 序列所在目录。"
			},
			previous_steps: {
				name: "上游会话步骤",
				tooltip: "连接前一节点暂存的会话步骤。"
			}
		},
		outputs: {
			0: { name: "结果图像路径" },
			1: { name: "结果目录" },
			2: { name: "CLI 日志" },
			3: { name: "会话步骤" }
		}
	},
	AstroPhotoSiril_seqght: {
		display_name: "序列 · 广义双曲拉伸",
		description: "围绕可设置的对称点拉伸，可保护指定的阴影和高光。此命令用于序列处理。",
		inputs: {
			arguments: {
				name: "命令参数",
				tooltip: "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"
			},
			stage_only: {
				name: "仅暂存步骤",
				tooltip: "生成会话步骤供下游使用，本节点此时不运行 CLI。"
			},
			file_path: {
				name: "文件路径",
				tooltip: "暂存此文件，并用 {input} 在参数中引用。"
			},
			directory_path: {
				name: "输入目录",
				tooltip: "接入上游目录中的文件。"
			},
			source_directory: {
				name: "本地源目录",
				tooltip: "宿主上的绝对目录路径，例如 FITS 序列所在目录。"
			},
			previous_steps: {
				name: "上游会话步骤",
				tooltip: "连接前一节点暂存的会话步骤。"
			}
		},
		outputs: {
			0: { name: "结果图像路径" },
			1: { name: "结果目录" },
			2: { name: "CLI 日志" },
			3: { name: "会话步骤" }
		}
	},
	AstroPhotoSiril_seqheader: {
		display_name: "导出序列头关键字",
		description: "读取序列各帧的指定 FITS 关键字，可导出 CSV。",
		inputs: {
			arguments: {
				name: "命令参数",
				tooltip: "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"
			},
			stage_only: {
				name: "仅暂存步骤",
				tooltip: "生成会话步骤供下游使用，本节点此时不运行 CLI。"
			},
			file_path: {
				name: "文件路径",
				tooltip: "暂存此文件，并用 {input} 在参数中引用。"
			},
			directory_path: {
				name: "输入目录",
				tooltip: "接入上游目录中的文件。"
			},
			source_directory: {
				name: "本地源目录",
				tooltip: "宿主上的绝对目录路径，例如 FITS 序列所在目录。"
			},
			previous_steps: {
				name: "上游会话步骤",
				tooltip: "连接前一节点暂存的会话步骤。"
			}
		},
		outputs: {
			0: { name: "结果图像路径" },
			1: { name: "结果目录" },
			2: { name: "CLI 日志" },
			3: { name: "会话步骤" }
		}
	},
	AstroPhotoSiril_seqinvght: {
		display_name: "序列 · 反向广义双曲拉伸",
		description: "应用广义双曲变换的逆变换。此命令用于序列处理。",
		inputs: {
			arguments: {
				name: "命令参数",
				tooltip: "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"
			},
			stage_only: {
				name: "仅暂存步骤",
				tooltip: "生成会话步骤供下游使用，本节点此时不运行 CLI。"
			},
			file_path: {
				name: "文件路径",
				tooltip: "暂存此文件，并用 {input} 在参数中引用。"
			},
			directory_path: {
				name: "输入目录",
				tooltip: "接入上游目录中的文件。"
			},
			source_directory: {
				name: "本地源目录",
				tooltip: "宿主上的绝对目录路径，例如 FITS 序列所在目录。"
			},
			previous_steps: {
				name: "上游会话步骤",
				tooltip: "连接前一节点暂存的会话步骤。"
			}
		},
		outputs: {
			0: { name: "结果图像路径" },
			1: { name: "结果目录" },
			2: { name: "CLI 日志" },
			3: { name: "会话步骤" }
		}
	},
	AstroPhotoSiril_seqinvmodasinh: {
		display_name: "序列 · 反向改进反双曲正弦拉伸",
		description: "应用改进反双曲正弦拉伸的逆变换。此命令用于序列处理。",
		inputs: {
			arguments: {
				name: "命令参数",
				tooltip: "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"
			},
			stage_only: {
				name: "仅暂存步骤",
				tooltip: "生成会话步骤供下游使用，本节点此时不运行 CLI。"
			},
			file_path: {
				name: "文件路径",
				tooltip: "暂存此文件，并用 {input} 在参数中引用。"
			},
			directory_path: {
				name: "输入目录",
				tooltip: "接入上游目录中的文件。"
			},
			source_directory: {
				name: "本地源目录",
				tooltip: "宿主上的绝对目录路径，例如 FITS 序列所在目录。"
			},
			previous_steps: {
				name: "上游会话步骤",
				tooltip: "连接前一节点暂存的会话步骤。"
			}
		},
		outputs: {
			0: { name: "结果图像路径" },
			1: { name: "结果目录" },
			2: { name: "CLI 日志" },
			3: { name: "会话步骤" }
		}
	},
	AstroPhotoSiril_seqlinstretch: {
		display_name: "序列 · 线性拉伸",
		description: "以指定黑点为基准线性调整色调范围。此命令用于序列处理。",
		inputs: {
			arguments: {
				name: "命令参数",
				tooltip: "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"
			},
			stage_only: {
				name: "仅暂存步骤",
				tooltip: "生成会话步骤供下游使用，本节点此时不运行 CLI。"
			},
			file_path: {
				name: "文件路径",
				tooltip: "暂存此文件，并用 {input} 在参数中引用。"
			},
			directory_path: {
				name: "输入目录",
				tooltip: "接入上游目录中的文件。"
			},
			source_directory: {
				name: "本地源目录",
				tooltip: "宿主上的绝对目录路径，例如 FITS 序列所在目录。"
			},
			previous_steps: {
				name: "上游会话步骤",
				tooltip: "连接前一节点暂存的会话步骤。"
			}
		},
		outputs: {
			0: { name: "结果图像路径" },
			1: { name: "结果目录" },
			2: { name: "CLI 日志" },
			3: { name: "会话步骤" }
		}
	},
	AstroPhotoSiril_seqmerge_cfa: {
		display_name: "合并 CFA 平面序列",
		description: "将四组对应的平面序列合并为一个 CFA 马赛克序列。",
		inputs: {
			arguments: {
				name: "命令参数",
				tooltip: "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"
			},
			stage_only: {
				name: "仅暂存步骤",
				tooltip: "生成会话步骤供下游使用，本节点此时不运行 CLI。"
			},
			file_path: {
				name: "文件路径",
				tooltip: "暂存此文件，并用 {input} 在参数中引用。"
			},
			directory_path: {
				name: "输入目录",
				tooltip: "接入上游目录中的文件。"
			},
			source_directory: {
				name: "本地源目录",
				tooltip: "宿主上的绝对目录路径，例如 FITS 序列所在目录。"
			},
			previous_steps: {
				name: "上游会话步骤",
				tooltip: "连接前一节点暂存的会话步骤。"
			}
		},
		outputs: {
			0: { name: "结果图像路径" },
			1: { name: "结果目录" },
			2: { name: "CLI 日志" },
			3: { name: "会话步骤" }
		}
	},
	AstroPhotoSiril_seqmodasinh: {
		display_name: "序列 · 改进反双曲正弦拉伸",
		description: "应用可调节的反双曲正弦拉伸，并设置阴影和高光保护。此命令用于序列处理。",
		inputs: {
			arguments: {
				name: "命令参数",
				tooltip: "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"
			},
			stage_only: {
				name: "仅暂存步骤",
				tooltip: "生成会话步骤供下游使用，本节点此时不运行 CLI。"
			},
			file_path: {
				name: "文件路径",
				tooltip: "暂存此文件，并用 {input} 在参数中引用。"
			},
			directory_path: {
				name: "输入目录",
				tooltip: "接入上游目录中的文件。"
			},
			source_directory: {
				name: "本地源目录",
				tooltip: "宿主上的绝对目录路径，例如 FITS 序列所在目录。"
			},
			previous_steps: {
				name: "上游会话步骤",
				tooltip: "连接前一节点暂存的会话步骤。"
			}
		},
		outputs: {
			0: { name: "结果图像路径" },
			1: { name: "结果目录" },
			2: { name: "CLI 日志" },
			3: { name: "会话步骤" }
		}
	},
	AstroPhotoSiril_seqmtf: {
		display_name: "序列 · 中间调变换",
		description: "用中间调传递曲线调整黑点、白点和中间调。此命令用于序列处理。",
		inputs: {
			arguments: {
				name: "命令参数",
				tooltip: "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"
			},
			stage_only: {
				name: "仅暂存步骤",
				tooltip: "生成会话步骤供下游使用，本节点此时不运行 CLI。"
			},
			file_path: {
				name: "文件路径",
				tooltip: "暂存此文件，并用 {input} 在参数中引用。"
			},
			directory_path: {
				name: "输入目录",
				tooltip: "接入上游目录中的文件。"
			},
			source_directory: {
				name: "本地源目录",
				tooltip: "宿主上的绝对目录路径，例如 FITS 序列所在目录。"
			},
			previous_steps: {
				name: "上游会话步骤",
				tooltip: "连接前一节点暂存的会话步骤。"
			}
		},
		outputs: {
			0: { name: "结果图像路径" },
			1: { name: "结果目录" },
			2: { name: "CLI 日志" },
			3: { name: "会话步骤" }
		}
	},
	AstroPhotoSiril_seqprofile: {
		display_name: "序列 · 测量线剖面",
		description: "按指定直线对当前图像的亮度采样，可导出剖面数据。此命令用于序列处理。",
		inputs: {
			arguments: {
				name: "命令参数",
				tooltip: "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"
			},
			stage_only: {
				name: "仅暂存步骤",
				tooltip: "生成会话步骤供下游使用，本节点此时不运行 CLI。"
			},
			file_path: {
				name: "文件路径",
				tooltip: "暂存此文件，并用 {input} 在参数中引用。"
			},
			directory_path: {
				name: "输入目录",
				tooltip: "接入上游目录中的文件。"
			},
			source_directory: {
				name: "本地源目录",
				tooltip: "宿主上的绝对目录路径，例如 FITS 序列所在目录。"
			},
			previous_steps: {
				name: "上游会话步骤",
				tooltip: "连接前一节点暂存的会话步骤。"
			}
		},
		outputs: {
			0: { name: "结果图像路径" },
			1: { name: "结果目录" },
			2: { name: "CLI 日志" },
			3: { name: "会话步骤" }
		}
	},
	AstroPhotoSiril_seqpsf: {
		display_name: "序列 · 测量恒星 PSF",
		description: "拟合选定恒星以测量其点扩散函数。此命令用于序列处理。",
		inputs: {
			arguments: {
				name: "命令参数",
				tooltip: "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"
			},
			stage_only: {
				name: "仅暂存步骤",
				tooltip: "生成会话步骤供下游使用，本节点此时不运行 CLI。"
			},
			file_path: {
				name: "文件路径",
				tooltip: "暂存此文件，并用 {input} 在参数中引用。"
			},
			directory_path: {
				name: "输入目录",
				tooltip: "接入上游目录中的文件。"
			},
			source_directory: {
				name: "本地源目录",
				tooltip: "宿主上的绝对目录路径，例如 FITS 序列所在目录。"
			},
			previous_steps: {
				name: "上游会话步骤",
				tooltip: "连接前一节点暂存的会话步骤。"
			}
		},
		outputs: {
			0: { name: "结果图像路径" },
			1: { name: "结果目录" },
			2: { name: "CLI 日志" },
			3: { name: "会话步骤" }
		}
	},
	AstroPhotoSiril_seqplatesolve: {
		display_name: "序列 · 图像天文定位",
		description: "将检测星点与星表匹配，为图像建立天球坐标。此命令用于序列处理。",
		inputs: {
			arguments: {
				name: "命令参数",
				tooltip: "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"
			},
			stage_only: {
				name: "仅暂存步骤",
				tooltip: "生成会话步骤供下游使用，本节点此时不运行 CLI。"
			},
			file_path: {
				name: "文件路径",
				tooltip: "暂存此文件，并用 {input} 在参数中引用。"
			},
			directory_path: {
				name: "输入目录",
				tooltip: "接入上游目录中的文件。"
			},
			source_directory: {
				name: "本地源目录",
				tooltip: "宿主上的绝对目录路径，例如 FITS 序列所在目录。"
			},
			previous_steps: {
				name: "上游会话步骤",
				tooltip: "连接前一节点暂存的会话步骤。"
			}
		},
		outputs: {
			0: { name: "结果图像路径" },
			1: { name: "结果目录" },
			2: { name: "CLI 日志" },
			3: { name: "会话步骤" }
		}
	},
	AstroPhotoSiril_seqresample: {
		display_name: "序列 · 重采样图像",
		description: "按缩放倍率或目标尺寸插值重采样当前图像。此命令用于序列处理。",
		inputs: {
			arguments: {
				name: "命令参数",
				tooltip: "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"
			},
			stage_only: {
				name: "仅暂存步骤",
				tooltip: "生成会话步骤供下游使用，本节点此时不运行 CLI。"
			},
			file_path: {
				name: "文件路径",
				tooltip: "暂存此文件，并用 {input} 在参数中引用。"
			},
			directory_path: {
				name: "输入目录",
				tooltip: "接入上游目录中的文件。"
			},
			source_directory: {
				name: "本地源目录",
				tooltip: "宿主上的绝对目录路径，例如 FITS 序列所在目录。"
			},
			previous_steps: {
				name: "上游会话步骤",
				tooltip: "连接前一节点暂存的会话步骤。"
			}
		},
		outputs: {
			0: { name: "结果图像路径" },
			1: { name: "结果目录" },
			2: { name: "CLI 日志" },
			3: { name: "会话步骤" }
		}
	},
	AstroPhotoSiril_seqrl: {
		display_name: "序列 · Richardson–Lucy 反卷积",
		description: "用 Richardson–Lucy 迭代反卷积恢复细节。此命令用于序列处理。",
		inputs: {
			arguments: {
				name: "命令参数",
				tooltip: "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"
			},
			stage_only: {
				name: "仅暂存步骤",
				tooltip: "生成会话步骤供下游使用，本节点此时不运行 CLI。"
			},
			file_path: {
				name: "文件路径",
				tooltip: "暂存此文件，并用 {input} 在参数中引用。"
			},
			directory_path: {
				name: "输入目录",
				tooltip: "接入上游目录中的文件。"
			},
			source_directory: {
				name: "本地源目录",
				tooltip: "宿主上的绝对目录路径，例如 FITS 序列所在目录。"
			},
			previous_steps: {
				name: "上游会话步骤",
				tooltip: "连接前一节点暂存的会话步骤。"
			}
		},
		outputs: {
			0: { name: "结果图像路径" },
			1: { name: "结果目录" },
			2: { name: "CLI 日志" },
			3: { name: "会话步骤" }
		}
	},
	AstroPhotoSiril_seqsb: {
		display_name: "序列 · Split Bregman 反卷积",
		description: "用 Split Bregman 反卷积求解方法恢复细节。此命令用于序列处理。",
		inputs: {
			arguments: {
				name: "命令参数",
				tooltip: "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"
			},
			stage_only: {
				name: "仅暂存步骤",
				tooltip: "生成会话步骤供下游使用，本节点此时不运行 CLI。"
			},
			file_path: {
				name: "文件路径",
				tooltip: "暂存此文件，并用 {input} 在参数中引用。"
			},
			directory_path: {
				name: "输入目录",
				tooltip: "接入上游目录中的文件。"
			},
			source_directory: {
				name: "本地源目录",
				tooltip: "宿主上的绝对目录路径，例如 FITS 序列所在目录。"
			},
			previous_steps: {
				name: "上游会话步骤",
				tooltip: "连接前一节点暂存的会话步骤。"
			}
		},
		outputs: {
			0: { name: "结果图像路径" },
			1: { name: "结果目录" },
			2: { name: "CLI 日志" },
			3: { name: "会话步骤" }
		}
	},
	AstroPhotoSiril_seqsplit_cfa: {
		display_name: "序列 · 拆分 CFA 平面",
		description: "把 CFA 马赛克的四种像素位置拆成独立图像。此命令用于序列处理。",
		inputs: {
			arguments: {
				name: "命令参数",
				tooltip: "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"
			},
			stage_only: {
				name: "仅暂存步骤",
				tooltip: "生成会话步骤供下游使用，本节点此时不运行 CLI。"
			},
			file_path: {
				name: "文件路径",
				tooltip: "暂存此文件，并用 {input} 在参数中引用。"
			},
			directory_path: {
				name: "输入目录",
				tooltip: "接入上游目录中的文件。"
			},
			source_directory: {
				name: "本地源目录",
				tooltip: "宿主上的绝对目录路径，例如 FITS 序列所在目录。"
			},
			previous_steps: {
				name: "上游会话步骤",
				tooltip: "连接前一节点暂存的会话步骤。"
			}
		},
		outputs: {
			0: { name: "结果图像路径" },
			1: { name: "结果目录" },
			2: { name: "CLI 日志" },
			3: { name: "会话步骤" }
		}
	},
	AstroPhotoSiril_seqstarnet: {
		display_name: "序列 · 移除星点（StarNet）",
		description: "使用已配置的 StarNet 将星点与背景结构分离。此命令用于序列处理。",
		inputs: {
			arguments: {
				name: "命令参数",
				tooltip: "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"
			},
			stage_only: {
				name: "仅暂存步骤",
				tooltip: "生成会话步骤供下游使用，本节点此时不运行 CLI。"
			},
			file_path: {
				name: "文件路径",
				tooltip: "暂存此文件，并用 {input} 在参数中引用。"
			},
			directory_path: {
				name: "输入目录",
				tooltip: "接入上游目录中的文件。"
			},
			source_directory: {
				name: "本地源目录",
				tooltip: "宿主上的绝对目录路径，例如 FITS 序列所在目录。"
			},
			previous_steps: {
				name: "上游会话步骤",
				tooltip: "连接前一节点暂存的会话步骤。"
			}
		},
		outputs: {
			0: { name: "结果图像路径" },
			1: { name: "结果目录" },
			2: { name: "CLI 日志" },
			3: { name: "会话步骤" }
		}
	},
	AstroPhotoSiril_seqstat: {
		display_name: "导出序列统计",
		description: "将序列各帧的统计量写入文件。",
		inputs: {
			arguments: {
				name: "命令参数",
				tooltip: "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"
			},
			stage_only: {
				name: "仅暂存步骤",
				tooltip: "生成会话步骤供下游使用，本节点此时不运行 CLI。"
			},
			file_path: {
				name: "文件路径",
				tooltip: "暂存此文件，并用 {input} 在参数中引用。"
			},
			directory_path: {
				name: "输入目录",
				tooltip: "接入上游目录中的文件。"
			},
			source_directory: {
				name: "本地源目录",
				tooltip: "宿主上的绝对目录路径，例如 FITS 序列所在目录。"
			},
			previous_steps: {
				name: "上游会话步骤",
				tooltip: "连接前一节点暂存的会话步骤。"
			}
		},
		outputs: {
			0: { name: "结果图像路径" },
			1: { name: "结果目录" },
			2: { name: "CLI 日志" },
			3: { name: "会话步骤" }
		}
	},
	AstroPhotoSiril_seqsubsky: {
		display_name: "序列 · 背景提取",
		description: "拟合并移除大尺度背景梯度。此命令用于序列处理。",
		inputs: {
			arguments: {
				name: "命令参数",
				tooltip: "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"
			},
			stage_only: {
				name: "仅暂存步骤",
				tooltip: "生成会话步骤供下游使用，本节点此时不运行 CLI。"
			},
			file_path: {
				name: "文件路径",
				tooltip: "暂存此文件，并用 {input} 在参数中引用。"
			},
			directory_path: {
				name: "输入目录",
				tooltip: "接入上游目录中的文件。"
			},
			source_directory: {
				name: "本地源目录",
				tooltip: "宿主上的绝对目录路径，例如 FITS 序列所在目录。"
			},
			previous_steps: {
				name: "上游会话步骤",
				tooltip: "连接前一节点暂存的会话步骤。"
			}
		},
		outputs: {
			0: { name: "结果图像路径" },
			1: { name: "结果目录" },
			2: { name: "CLI 日志" },
			3: { name: "会话步骤" }
		}
	},
	AstroPhotoSiril_seqtilt: {
		display_name: "序列 · 测量传感器倾斜",
		description: "比较视场各处的星点大小以估计传感器倾斜。此命令用于序列处理。",
		inputs: {
			arguments: {
				name: "命令参数",
				tooltip: "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"
			},
			stage_only: {
				name: "仅暂存步骤",
				tooltip: "生成会话步骤供下游使用，本节点此时不运行 CLI。"
			},
			file_path: {
				name: "文件路径",
				tooltip: "暂存此文件，并用 {input} 在参数中引用。"
			},
			directory_path: {
				name: "输入目录",
				tooltip: "接入上游目录中的文件。"
			},
			source_directory: {
				name: "本地源目录",
				tooltip: "宿主上的绝对目录路径，例如 FITS 序列所在目录。"
			},
			previous_steps: {
				name: "上游会话步骤",
				tooltip: "连接前一节点暂存的会话步骤。"
			}
		},
		outputs: {
			0: { name: "结果图像路径" },
			1: { name: "结果目录" },
			2: { name: "CLI 日志" },
			3: { name: "会话步骤" }
		}
	},
	AstroPhotoSiril_sequpdate_key: {
		display_name: "批量编辑序列关键字",
		description: "将 FITS 头修改应用于序列中的各帧。",
		inputs: {
			arguments: {
				name: "命令参数",
				tooltip: "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"
			},
			stage_only: {
				name: "仅暂存步骤",
				tooltip: "生成会话步骤供下游使用，本节点此时不运行 CLI。"
			},
			file_path: {
				name: "文件路径",
				tooltip: "暂存此文件，并用 {input} 在参数中引用。"
			},
			directory_path: {
				name: "输入目录",
				tooltip: "接入上游目录中的文件。"
			},
			source_directory: {
				name: "本地源目录",
				tooltip: "宿主上的绝对目录路径，例如 FITS 序列所在目录。"
			},
			previous_steps: {
				name: "上游会话步骤",
				tooltip: "连接前一节点暂存的会话步骤。"
			}
		},
		outputs: {
			0: { name: "结果图像路径" },
			1: { name: "结果目录" },
			2: { name: "CLI 日志" },
			3: { name: "会话步骤" }
		}
	},
	AstroPhotoSiril_seqwiener: {
		display_name: "序列 · 维纳反卷积",
		description: "根据点扩散函数用维纳反卷积减轻模糊。此命令用于序列处理。",
		inputs: {
			arguments: {
				name: "命令参数",
				tooltip: "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"
			},
			stage_only: {
				name: "仅暂存步骤",
				tooltip: "生成会话步骤供下游使用，本节点此时不运行 CLI。"
			},
			file_path: {
				name: "文件路径",
				tooltip: "暂存此文件，并用 {input} 在参数中引用。"
			},
			directory_path: {
				name: "输入目录",
				tooltip: "接入上游目录中的文件。"
			},
			source_directory: {
				name: "本地源目录",
				tooltip: "宿主上的绝对目录路径，例如 FITS 序列所在目录。"
			},
			previous_steps: {
				name: "上游会话步骤",
				tooltip: "连接前一节点暂存的会话步骤。"
			}
		},
		outputs: {
			0: { name: "结果图像路径" },
			1: { name: "结果目录" },
			2: { name: "CLI 日志" },
			3: { name: "会话步骤" }
		}
	},
	AstroPhotoSiril_set: {
		display_name: "设置会话首选项",
		description: "修改当前 AstroPhoto 会话中的标量首选项。",
		inputs: {
			arguments: {
				name: "命令参数",
				tooltip: "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"
			},
			stage_only: {
				name: "仅暂存步骤",
				tooltip: "生成会话步骤供下游使用，本节点此时不运行 CLI。"
			},
			file_path: {
				name: "文件路径",
				tooltip: "暂存此文件，并用 {input} 在参数中引用。"
			},
			directory_path: {
				name: "输入目录",
				tooltip: "接入上游目录中的文件。"
			},
			source_directory: {
				name: "本地源目录",
				tooltip: "宿主上的绝对目录路径，例如 FITS 序列所在目录。"
			},
			previous_steps: {
				name: "上游会话步骤",
				tooltip: "连接前一节点暂存的会话步骤。"
			}
		},
		outputs: {
			0: { name: "结果图像路径" },
			1: { name: "结果目录" },
			2: { name: "CLI 日志" },
			3: { name: "会话步骤" }
		}
	},
	AstroPhotoSiril_set16bits: {
		display_name: "使用 16 位处理",
		description: "切换为 16 位整数精度处理图像。",
		inputs: {
			arguments: {
				name: "命令参数",
				tooltip: "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"
			},
			stage_only: {
				name: "仅暂存步骤",
				tooltip: "生成会话步骤供下游使用，本节点此时不运行 CLI。"
			},
			file_path: {
				name: "文件路径",
				tooltip: "暂存此文件，并用 {input} 在参数中引用。"
			},
			directory_path: {
				name: "输入目录",
				tooltip: "接入上游目录中的文件。"
			},
			source_directory: {
				name: "本地源目录",
				tooltip: "宿主上的绝对目录路径，例如 FITS 序列所在目录。"
			},
			previous_steps: {
				name: "上游会话步骤",
				tooltip: "连接前一节点暂存的会话步骤。"
			}
		},
		outputs: {
			0: { name: "结果图像路径" },
			1: { name: "结果目录" },
			2: { name: "CLI 日志" },
			3: { name: "会话步骤" }
		}
	},
	AstroPhotoSiril_set32bits: {
		display_name: "使用 32 位处理",
		description: "切换为 32 位浮点精度处理图像。",
		inputs: {
			arguments: {
				name: "命令参数",
				tooltip: "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"
			},
			stage_only: {
				name: "仅暂存步骤",
				tooltip: "生成会话步骤供下游使用，本节点此时不运行 CLI。"
			},
			file_path: {
				name: "文件路径",
				tooltip: "暂存此文件，并用 {input} 在参数中引用。"
			},
			directory_path: {
				name: "输入目录",
				tooltip: "接入上游目录中的文件。"
			},
			source_directory: {
				name: "本地源目录",
				tooltip: "宿主上的绝对目录路径，例如 FITS 序列所在目录。"
			},
			previous_steps: {
				name: "上游会话步骤",
				tooltip: "连接前一节点暂存的会话步骤。"
			}
		},
		outputs: {
			0: { name: "结果图像路径" },
			1: { name: "结果目录" },
			2: { name: "CLI 日志" },
			3: { name: "会话步骤" }
		}
	},
	AstroPhotoSiril_setcompress: {
		display_name: "设置 FITS 压缩",
		description: "设置后续 FITS 文件是否压缩以及压缩方式。",
		inputs: {
			arguments: {
				name: "命令参数",
				tooltip: "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"
			},
			stage_only: {
				name: "仅暂存步骤",
				tooltip: "生成会话步骤供下游使用，本节点此时不运行 CLI。"
			},
			file_path: {
				name: "文件路径",
				tooltip: "暂存此文件，并用 {input} 在参数中引用。"
			},
			directory_path: {
				name: "输入目录",
				tooltip: "接入上游目录中的文件。"
			},
			source_directory: {
				name: "本地源目录",
				tooltip: "宿主上的绝对目录路径，例如 FITS 序列所在目录。"
			},
			previous_steps: {
				name: "上游会话步骤",
				tooltip: "连接前一节点暂存的会话步骤。"
			}
		},
		outputs: {
			0: { name: "结果图像路径" },
			1: { name: "结果目录" },
			2: { name: "CLI 日志" },
			3: { name: "会话步骤" }
		}
	},
	AstroPhotoSiril_setcpu: {
		display_name: "设置处理线程数",
		description: "设置 Siril 可使用的 CPU 线程数量。",
		inputs: {
			arguments: {
				name: "命令参数",
				tooltip: "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"
			},
			stage_only: {
				name: "仅暂存步骤",
				tooltip: "生成会话步骤供下游使用，本节点此时不运行 CLI。"
			},
			file_path: {
				name: "文件路径",
				tooltip: "暂存此文件，并用 {input} 在参数中引用。"
			},
			directory_path: {
				name: "输入目录",
				tooltip: "接入上游目录中的文件。"
			},
			source_directory: {
				name: "本地源目录",
				tooltip: "宿主上的绝对目录路径，例如 FITS 序列所在目录。"
			},
			previous_steps: {
				name: "上游会话步骤",
				tooltip: "连接前一节点暂存的会话步骤。"
			}
		},
		outputs: {
			0: { name: "结果图像路径" },
			1: { name: "结果目录" },
			2: { name: "CLI 日志" },
			3: { name: "会话步骤" }
		}
	},
	AstroPhotoSiril_setext: {
		display_name: "设置 FITS 扩展名",
		description: "设置当前会话所用的 FITS 文件扩展名。",
		inputs: {
			arguments: {
				name: "命令参数",
				tooltip: "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"
			},
			stage_only: {
				name: "仅暂存步骤",
				tooltip: "生成会话步骤供下游使用，本节点此时不运行 CLI。"
			},
			file_path: {
				name: "文件路径",
				tooltip: "暂存此文件，并用 {input} 在参数中引用。"
			},
			directory_path: {
				name: "输入目录",
				tooltip: "接入上游目录中的文件。"
			},
			source_directory: {
				name: "本地源目录",
				tooltip: "宿主上的绝对目录路径，例如 FITS 序列所在目录。"
			},
			previous_steps: {
				name: "上游会话步骤",
				tooltip: "连接前一节点暂存的会话步骤。"
			}
		},
		outputs: {
			0: { name: "结果图像路径" },
			1: { name: "结果目录" },
			2: { name: "CLI 日志" },
			3: { name: "会话步骤" }
		}
	},
	AstroPhotoSiril_setfindstar: {
		display_name: "设置星点检测",
		description: "调整星点检测所用的半径、阈值及其他条件。",
		inputs: {
			arguments: {
				name: "命令参数",
				tooltip: "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"
			},
			stage_only: {
				name: "仅暂存步骤",
				tooltip: "生成会话步骤供下游使用，本节点此时不运行 CLI。"
			},
			file_path: {
				name: "文件路径",
				tooltip: "暂存此文件，并用 {input} 在参数中引用。"
			},
			directory_path: {
				name: "输入目录",
				tooltip: "接入上游目录中的文件。"
			},
			source_directory: {
				name: "本地源目录",
				tooltip: "宿主上的绝对目录路径，例如 FITS 序列所在目录。"
			},
			previous_steps: {
				name: "上游会话步骤",
				tooltip: "连接前一节点暂存的会话步骤。"
			}
		},
		outputs: {
			0: { name: "结果图像路径" },
			1: { name: "结果目录" },
			2: { name: "CLI 日志" },
			3: { name: "会话步骤" }
		}
	},
	AstroPhotoSiril_setmem: {
		display_name: "设置内存比例",
		description: "设置 Siril 可使用的内存比例。",
		inputs: {
			arguments: {
				name: "命令参数",
				tooltip: "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"
			},
			stage_only: {
				name: "仅暂存步骤",
				tooltip: "生成会话步骤供下游使用，本节点此时不运行 CLI。"
			},
			file_path: {
				name: "文件路径",
				tooltip: "暂存此文件，并用 {input} 在参数中引用。"
			},
			directory_path: {
				name: "输入目录",
				tooltip: "接入上游目录中的文件。"
			},
			source_directory: {
				name: "本地源目录",
				tooltip: "宿主上的绝对目录路径，例如 FITS 序列所在目录。"
			},
			previous_steps: {
				name: "上游会话步骤",
				tooltip: "连接前一节点暂存的会话步骤。"
			}
		},
		outputs: {
			0: { name: "结果图像路径" },
			1: { name: "结果目录" },
			2: { name: "CLI 日志" },
			3: { name: "会话步骤" }
		}
	},
	AstroPhotoSiril_setphot: {
		display_name: "设置测光参数",
		description: "设置测光孔径、背景环和信号参数。",
		inputs: {
			arguments: {
				name: "命令参数",
				tooltip: "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"
			},
			stage_only: {
				name: "仅暂存步骤",
				tooltip: "生成会话步骤供下游使用，本节点此时不运行 CLI。"
			},
			file_path: {
				name: "文件路径",
				tooltip: "暂存此文件，并用 {input} 在参数中引用。"
			},
			directory_path: {
				name: "输入目录",
				tooltip: "接入上游目录中的文件。"
			},
			source_directory: {
				name: "本地源目录",
				tooltip: "宿主上的绝对目录路径，例如 FITS 序列所在目录。"
			},
			previous_steps: {
				name: "上游会话步骤",
				tooltip: "连接前一节点暂存的会话步骤。"
			}
		},
		outputs: {
			0: { name: "结果图像路径" },
			1: { name: "结果目录" },
			2: { name: "CLI 日志" },
			3: { name: "会话步骤" }
		}
	},
	AstroPhotoSiril_setref: {
		display_name: "指定参考帧",
		description: "指定序列应使用的参考帧。",
		inputs: {
			arguments: {
				name: "命令参数",
				tooltip: "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"
			},
			stage_only: {
				name: "仅暂存步骤",
				tooltip: "生成会话步骤供下游使用，本节点此时不运行 CLI。"
			},
			file_path: {
				name: "文件路径",
				tooltip: "暂存此文件，并用 {input} 在参数中引用。"
			},
			directory_path: {
				name: "输入目录",
				tooltip: "接入上游目录中的文件。"
			},
			source_directory: {
				name: "本地源目录",
				tooltip: "宿主上的绝对目录路径，例如 FITS 序列所在目录。"
			},
			previous_steps: {
				name: "上游会话步骤",
				tooltip: "连接前一节点暂存的会话步骤。"
			}
		},
		outputs: {
			0: { name: "结果图像路径" },
			1: { name: "结果目录" },
			2: { name: "CLI 日志" },
			3: { name: "会话步骤" }
		}
	},
	AstroPhotoSiril_spcc: {
		display_name: "分光测光色彩校准",
		description: "依据恒星光谱和相机或滤镜响应校准图像色彩。",
		inputs: {
			arguments: {
				name: "命令参数",
				tooltip: "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"
			},
			stage_only: {
				name: "仅暂存步骤",
				tooltip: "生成会话步骤供下游使用，本节点此时不运行 CLI。"
			},
			image_path: {
				name: "图像路径",
				tooltip: "命令执行前加载此文件。"
			},
			file_path: {
				name: "文件路径",
				tooltip: "暂存此文件，并用 {input} 在参数中引用。"
			},
			directory_path: {
				name: "输入目录",
				tooltip: "接入上游目录中的文件。"
			},
			source_directory: {
				name: "本地源目录",
				tooltip: "宿主上的绝对目录路径，例如 FITS 序列所在目录。"
			},
			previous_steps: {
				name: "上游会话步骤",
				tooltip: "连接前一节点暂存的会话步骤。"
			}
		},
		outputs: {
			0: { name: "结果图像路径" },
			1: { name: "结果目录" },
			2: { name: "CLI 日志" },
			3: { name: "会话步骤" }
		}
	},
	AstroPhotoSiril_spcc_list: {
		display_name: "列出 SPCC 参考项",
		description: "列出 SPCC 可用的传感器、滤镜或白参考。",
		inputs: {
			arguments: {
				name: "命令参数",
				tooltip: "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"
			},
			stage_only: {
				name: "仅暂存步骤",
				tooltip: "生成会话步骤供下游使用，本节点此时不运行 CLI。"
			},
			file_path: {
				name: "文件路径",
				tooltip: "暂存此文件，并用 {input} 在参数中引用。"
			},
			directory_path: {
				name: "输入目录",
				tooltip: "接入上游目录中的文件。"
			},
			source_directory: {
				name: "本地源目录",
				tooltip: "宿主上的绝对目录路径，例如 FITS 序列所在目录。"
			},
			previous_steps: {
				name: "上游会话步骤",
				tooltip: "连接前一节点暂存的会话步骤。"
			}
		},
		outputs: {
			0: { name: "结果图像路径" },
			1: { name: "结果目录" },
			2: { name: "CLI 日志" },
			3: { name: "会话步骤" }
		}
	},
	AstroPhotoSiril_split: {
		display_name: "拆分颜色通道",
		description: "按所选色彩模型导出图像的各个颜色分量。",
		inputs: {
			arguments: {
				name: "命令参数",
				tooltip: "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"
			},
			stage_only: {
				name: "仅暂存步骤",
				tooltip: "生成会话步骤供下游使用，本节点此时不运行 CLI。"
			},
			image_path: {
				name: "图像路径",
				tooltip: "命令执行前加载此文件。"
			},
			file_path: {
				name: "文件路径",
				tooltip: "暂存此文件，并用 {input} 在参数中引用。"
			},
			directory_path: {
				name: "输入目录",
				tooltip: "接入上游目录中的文件。"
			},
			source_directory: {
				name: "本地源目录",
				tooltip: "宿主上的绝对目录路径，例如 FITS 序列所在目录。"
			},
			previous_steps: {
				name: "上游会话步骤",
				tooltip: "连接前一节点暂存的会话步骤。"
			}
		},
		outputs: {
			0: { name: "结果图像路径" },
			1: { name: "结果目录" },
			2: { name: "CLI 日志" },
			3: { name: "会话步骤" }
		}
	},
	AstroPhotoSiril_split_cfa: {
		display_name: "拆分 CFA 平面",
		description: "把 CFA 马赛克的四种像素位置拆成独立图像。",
		inputs: {
			arguments: {
				name: "命令参数",
				tooltip: "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"
			},
			stage_only: {
				name: "仅暂存步骤",
				tooltip: "生成会话步骤供下游使用，本节点此时不运行 CLI。"
			},
			image_path: {
				name: "图像路径",
				tooltip: "命令执行前加载此文件。"
			},
			file_path: {
				name: "文件路径",
				tooltip: "暂存此文件，并用 {input} 在参数中引用。"
			},
			directory_path: {
				name: "输入目录",
				tooltip: "接入上游目录中的文件。"
			},
			source_directory: {
				name: "本地源目录",
				tooltip: "宿主上的绝对目录路径，例如 FITS 序列所在目录。"
			},
			previous_steps: {
				name: "上游会话步骤",
				tooltip: "连接前一节点暂存的会话步骤。"
			}
		},
		outputs: {
			0: { name: "结果图像路径" },
			1: { name: "结果目录" },
			2: { name: "CLI 日志" },
			3: { name: "会话步骤" }
		}
	},
	AstroPhotoSiril_stack: {
		display_name: "叠加序列",
		description: "按所选叠加方法将序列帧合成为一张图像。",
		inputs: {
			arguments: {
				name: "命令参数",
				tooltip: "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"
			},
			stage_only: {
				name: "仅暂存步骤",
				tooltip: "生成会话步骤供下游使用，本节点此时不运行 CLI。"
			},
			file_path: {
				name: "文件路径",
				tooltip: "暂存此文件，并用 {input} 在参数中引用。"
			},
			directory_path: {
				name: "输入目录",
				tooltip: "接入上游目录中的文件。"
			},
			source_directory: {
				name: "本地源目录",
				tooltip: "宿主上的绝对目录路径，例如 FITS 序列所在目录。"
			},
			previous_steps: {
				name: "上游会话步骤",
				tooltip: "连接前一节点暂存的会话步骤。"
			}
		},
		outputs: {
			0: { name: "结果图像路径" },
			1: { name: "结果目录" },
			2: { name: "CLI 日志" },
			3: { name: "会话步骤" }
		}
	},
	AstroPhotoSiril_stackall: {
		display_name: "叠加全部序列",
		description: "逐个叠加当前目录中的序列。",
		inputs: {
			arguments: {
				name: "命令参数",
				tooltip: "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"
			},
			stage_only: {
				name: "仅暂存步骤",
				tooltip: "生成会话步骤供下游使用，本节点此时不运行 CLI。"
			},
			file_path: {
				name: "文件路径",
				tooltip: "暂存此文件，并用 {input} 在参数中引用。"
			},
			directory_path: {
				name: "输入目录",
				tooltip: "接入上游目录中的文件。"
			},
			source_directory: {
				name: "本地源目录",
				tooltip: "宿主上的绝对目录路径，例如 FITS 序列所在目录。"
			},
			previous_steps: {
				name: "上游会话步骤",
				tooltip: "连接前一节点暂存的会话步骤。"
			}
		},
		outputs: {
			0: { name: "结果图像路径" },
			1: { name: "结果目录" },
			2: { name: "CLI 日志" },
			3: { name: "会话步骤" }
		}
	},
	AstroPhotoSiril_starnet: {
		display_name: "移除星点（StarNet）",
		description: "使用已配置的 StarNet 将星点与背景结构分离。",
		inputs: {
			arguments: {
				name: "命令参数",
				tooltip: "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"
			},
			stage_only: {
				name: "仅暂存步骤",
				tooltip: "生成会话步骤供下游使用，本节点此时不运行 CLI。"
			},
			image_path: {
				name: "图像路径",
				tooltip: "命令执行前加载此文件。"
			},
			file_path: {
				name: "文件路径",
				tooltip: "暂存此文件，并用 {input} 在参数中引用。"
			},
			directory_path: {
				name: "输入目录",
				tooltip: "接入上游目录中的文件。"
			},
			source_directory: {
				name: "本地源目录",
				tooltip: "宿主上的绝对目录路径，例如 FITS 序列所在目录。"
			},
			previous_steps: {
				name: "上游会话步骤",
				tooltip: "连接前一节点暂存的会话步骤。"
			}
		},
		outputs: {
			0: { name: "结果图像路径" },
			1: { name: "结果目录" },
			2: { name: "CLI 日志" },
			3: { name: "会话步骤" }
		}
	},
	AstroPhotoSiril_start_ls: {
		display_name: "启动实时叠加",
		description: "初始化实时叠加，可同时配置暗场和平场校准。",
		inputs: {
			arguments: {
				name: "命令参数",
				tooltip: "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"
			},
			stage_only: {
				name: "仅暂存步骤",
				tooltip: "生成会话步骤供下游使用，本节点此时不运行 CLI。"
			},
			file_path: {
				name: "文件路径",
				tooltip: "暂存此文件，并用 {input} 在参数中引用。"
			},
			directory_path: {
				name: "输入目录",
				tooltip: "接入上游目录中的文件。"
			},
			source_directory: {
				name: "本地源目录",
				tooltip: "宿主上的绝对目录路径，例如 FITS 序列所在目录。"
			},
			previous_steps: {
				name: "上游会话步骤",
				tooltip: "连接前一节点暂存的会话步骤。"
			}
		},
		outputs: {
			0: { name: "结果图像路径" },
			1: { name: "结果目录" },
			2: { name: "CLI 日志" },
			3: { name: "会话步骤" }
		}
	},
	AstroPhotoSiril_stat: {
		display_name: "读取图像统计",
		description: "输出图像或所选区域的统计量。",
		inputs: {
			arguments: {
				name: "命令参数",
				tooltip: "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"
			},
			stage_only: {
				name: "仅暂存步骤",
				tooltip: "生成会话步骤供下游使用，本节点此时不运行 CLI。"
			},
			image_path: {
				name: "图像路径",
				tooltip: "命令执行前加载此文件。"
			},
			file_path: {
				name: "文件路径",
				tooltip: "暂存此文件，并用 {input} 在参数中引用。"
			},
			directory_path: {
				name: "输入目录",
				tooltip: "接入上游目录中的文件。"
			},
			source_directory: {
				name: "本地源目录",
				tooltip: "宿主上的绝对目录路径，例如 FITS 序列所在目录。"
			},
			previous_steps: {
				name: "上游会话步骤",
				tooltip: "连接前一节点暂存的会话步骤。"
			}
		},
		outputs: {
			0: { name: "结果图像路径" },
			1: { name: "结果目录" },
			2: { name: "CLI 日志" },
			3: { name: "会话步骤" }
		}
	},
	AstroPhotoSiril_stop_ls: {
		display_name: "结束实时叠加",
		description: "结束当前实时叠加会话。",
		inputs: {
			arguments: {
				name: "命令参数",
				tooltip: "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"
			},
			stage_only: {
				name: "仅暂存步骤",
				tooltip: "生成会话步骤供下游使用，本节点此时不运行 CLI。"
			},
			file_path: {
				name: "文件路径",
				tooltip: "暂存此文件，并用 {input} 在参数中引用。"
			},
			directory_path: {
				name: "输入目录",
				tooltip: "接入上游目录中的文件。"
			},
			source_directory: {
				name: "本地源目录",
				tooltip: "宿主上的绝对目录路径，例如 FITS 序列所在目录。"
			},
			previous_steps: {
				name: "上游会话步骤",
				tooltip: "连接前一节点暂存的会话步骤。"
			}
		},
		outputs: {
			0: { name: "结果图像路径" },
			1: { name: "结果目录" },
			2: { name: "CLI 日志" },
			3: { name: "会话步骤" }
		}
	},
	AstroPhotoSiril_subsky: {
		display_name: "背景提取",
		description: "拟合并移除大尺度背景梯度。",
		inputs: {
			arguments: {
				name: "命令参数",
				tooltip: "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"
			},
			stage_only: {
				name: "仅暂存步骤",
				tooltip: "生成会话步骤供下游使用，本节点此时不运行 CLI。"
			},
			image_path: {
				name: "图像路径",
				tooltip: "命令执行前加载此文件。"
			},
			file_path: {
				name: "文件路径",
				tooltip: "暂存此文件，并用 {input} 在参数中引用。"
			},
			directory_path: {
				name: "输入目录",
				tooltip: "接入上游目录中的文件。"
			},
			source_directory: {
				name: "本地源目录",
				tooltip: "宿主上的绝对目录路径，例如 FITS 序列所在目录。"
			},
			previous_steps: {
				name: "上游会话步骤",
				tooltip: "连接前一节点暂存的会话步骤。"
			}
		},
		outputs: {
			0: { name: "结果图像路径" },
			1: { name: "结果目录" },
			2: { name: "CLI 日志" },
			3: { name: "会话步骤" }
		}
	},
	AstroPhotoSiril_synthstar: {
		display_name: "合成星点",
		description: "根据实测星点轮廓生成合成星点图像。",
		inputs: {
			arguments: {
				name: "命令参数",
				tooltip: "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"
			},
			stage_only: {
				name: "仅暂存步骤",
				tooltip: "生成会话步骤供下游使用，本节点此时不运行 CLI。"
			},
			image_path: {
				name: "图像路径",
				tooltip: "命令执行前加载此文件。"
			},
			file_path: {
				name: "文件路径",
				tooltip: "暂存此文件，并用 {input} 在参数中引用。"
			},
			directory_path: {
				name: "输入目录",
				tooltip: "接入上游目录中的文件。"
			},
			source_directory: {
				name: "本地源目录",
				tooltip: "宿主上的绝对目录路径，例如 FITS 序列所在目录。"
			},
			previous_steps: {
				name: "上游会话步骤",
				tooltip: "连接前一节点暂存的会话步骤。"
			}
		},
		outputs: {
			0: { name: "结果图像路径" },
			1: { name: "结果目录" },
			2: { name: "CLI 日志" },
			3: { name: "会话步骤" }
		}
	},
	AstroPhotoSiril_threshlo: {
		display_name: "限制下阈值",
		description: "将低于阈值的像素提高到该阈值。",
		inputs: {
			arguments: {
				name: "命令参数",
				tooltip: "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"
			},
			stage_only: {
				name: "仅暂存步骤",
				tooltip: "生成会话步骤供下游使用，本节点此时不运行 CLI。"
			},
			image_path: {
				name: "图像路径",
				tooltip: "命令执行前加载此文件。"
			},
			file_path: {
				name: "文件路径",
				tooltip: "暂存此文件，并用 {input} 在参数中引用。"
			},
			directory_path: {
				name: "输入目录",
				tooltip: "接入上游目录中的文件。"
			},
			source_directory: {
				name: "本地源目录",
				tooltip: "宿主上的绝对目录路径，例如 FITS 序列所在目录。"
			},
			previous_steps: {
				name: "上游会话步骤",
				tooltip: "连接前一节点暂存的会话步骤。"
			}
		},
		outputs: {
			0: { name: "结果图像路径" },
			1: { name: "结果目录" },
			2: { name: "CLI 日志" },
			3: { name: "会话步骤" }
		}
	},
	AstroPhotoSiril_threshhi: {
		display_name: "限制上阈值",
		description: "将高于阈值的像素降低到该阈值。",
		inputs: {
			arguments: {
				name: "命令参数",
				tooltip: "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"
			},
			stage_only: {
				name: "仅暂存步骤",
				tooltip: "生成会话步骤供下游使用，本节点此时不运行 CLI。"
			},
			image_path: {
				name: "图像路径",
				tooltip: "命令执行前加载此文件。"
			},
			file_path: {
				name: "文件路径",
				tooltip: "暂存此文件，并用 {input} 在参数中引用。"
			},
			directory_path: {
				name: "输入目录",
				tooltip: "接入上游目录中的文件。"
			},
			source_directory: {
				name: "本地源目录",
				tooltip: "宿主上的绝对目录路径，例如 FITS 序列所在目录。"
			},
			previous_steps: {
				name: "上游会话步骤",
				tooltip: "连接前一节点暂存的会话步骤。"
			}
		},
		outputs: {
			0: { name: "结果图像路径" },
			1: { name: "结果目录" },
			2: { name: "CLI 日志" },
			3: { name: "会话步骤" }
		}
	},
	AstroPhotoSiril_thresh: {
		display_name: "限制像素上下阈值",
		description: "同时对图像应用下限和上限阈值。",
		inputs: {
			arguments: {
				name: "命令参数",
				tooltip: "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"
			},
			stage_only: {
				name: "仅暂存步骤",
				tooltip: "生成会话步骤供下游使用，本节点此时不运行 CLI。"
			},
			image_path: {
				name: "图像路径",
				tooltip: "命令执行前加载此文件。"
			},
			file_path: {
				name: "文件路径",
				tooltip: "暂存此文件，并用 {input} 在参数中引用。"
			},
			directory_path: {
				name: "输入目录",
				tooltip: "接入上游目录中的文件。"
			},
			source_directory: {
				name: "本地源目录",
				tooltip: "宿主上的绝对目录路径，例如 FITS 序列所在目录。"
			},
			previous_steps: {
				name: "上游会话步骤",
				tooltip: "连接前一节点暂存的会话步骤。"
			}
		},
		outputs: {
			0: { name: "结果图像路径" },
			1: { name: "结果目录" },
			2: { name: "CLI 日志" },
			3: { name: "会话步骤" }
		}
	},
	AstroPhotoSiril_trixel: {
		display_name: "查看天区三角网格",
		description: "列出或导出星表索引使用的天区三角网格。",
		inputs: {
			arguments: {
				name: "命令参数",
				tooltip: "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"
			},
			stage_only: {
				name: "仅暂存步骤",
				tooltip: "生成会话步骤供下游使用，本节点此时不运行 CLI。"
			},
			file_path: {
				name: "文件路径",
				tooltip: "暂存此文件，并用 {input} 在参数中引用。"
			},
			directory_path: {
				name: "输入目录",
				tooltip: "接入上游目录中的文件。"
			},
			source_directory: {
				name: "本地源目录",
				tooltip: "宿主上的绝对目录路径，例如 FITS 序列所在目录。"
			},
			previous_steps: {
				name: "上游会话步骤",
				tooltip: "连接前一节点暂存的会话步骤。"
			}
		},
		outputs: {
			0: { name: "结果图像路径" },
			1: { name: "结果目录" },
			2: { name: "CLI 日志" },
			3: { name: "会话步骤" }
		}
	},
	AstroPhotoSiril_unclipstars: {
		display_name: "修复饱和星点",
		description: "重建饱和星点的轮廓，改善截断的星核。",
		inputs: {
			arguments: {
				name: "命令参数",
				tooltip: "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"
			},
			stage_only: {
				name: "仅暂存步骤",
				tooltip: "生成会话步骤供下游使用，本节点此时不运行 CLI。"
			},
			image_path: {
				name: "图像路径",
				tooltip: "命令执行前加载此文件。"
			},
			file_path: {
				name: "文件路径",
				tooltip: "暂存此文件，并用 {input} 在参数中引用。"
			},
			directory_path: {
				name: "输入目录",
				tooltip: "接入上游目录中的文件。"
			},
			source_directory: {
				name: "本地源目录",
				tooltip: "宿主上的绝对目录路径，例如 FITS 序列所在目录。"
			},
			previous_steps: {
				name: "上游会话步骤",
				tooltip: "连接前一节点暂存的会话步骤。"
			}
		},
		outputs: {
			0: { name: "结果图像路径" },
			1: { name: "结果目录" },
			2: { name: "CLI 日志" },
			3: { name: "会话步骤" }
		}
	},
	AstroPhotoSiril_unpurple: {
		display_name: "抑制紫边",
		description: "减少恒星周围的紫色边缘，可用掩膜限制作用范围。",
		inputs: {
			arguments: {
				name: "命令参数",
				tooltip: "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"
			},
			stage_only: {
				name: "仅暂存步骤",
				tooltip: "生成会话步骤供下游使用，本节点此时不运行 CLI。"
			},
			image_path: {
				name: "图像路径",
				tooltip: "命令执行前加载此文件。"
			},
			file_path: {
				name: "文件路径",
				tooltip: "暂存此文件，并用 {input} 在参数中引用。"
			},
			directory_path: {
				name: "输入目录",
				tooltip: "接入上游目录中的文件。"
			},
			source_directory: {
				name: "本地源目录",
				tooltip: "宿主上的绝对目录路径，例如 FITS 序列所在目录。"
			},
			previous_steps: {
				name: "上游会话步骤",
				tooltip: "连接前一节点暂存的会话步骤。"
			}
		},
		outputs: {
			0: { name: "结果图像路径" },
			1: { name: "结果目录" },
			2: { name: "CLI 日志" },
			3: { name: "会话步骤" }
		}
	},
	AstroPhotoSiril_unselect: {
		display_name: "排除序列帧",
		description: "取消选择指定范围内的序列帧。",
		inputs: {
			arguments: {
				name: "命令参数",
				tooltip: "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"
			},
			stage_only: {
				name: "仅暂存步骤",
				tooltip: "生成会话步骤供下游使用，本节点此时不运行 CLI。"
			},
			file_path: {
				name: "文件路径",
				tooltip: "暂存此文件，并用 {input} 在参数中引用。"
			},
			directory_path: {
				name: "输入目录",
				tooltip: "接入上游目录中的文件。"
			},
			source_directory: {
				name: "本地源目录",
				tooltip: "宿主上的绝对目录路径，例如 FITS 序列所在目录。"
			},
			previous_steps: {
				name: "上游会话步骤",
				tooltip: "连接前一节点暂存的会话步骤。"
			}
		},
		outputs: {
			0: { name: "结果图像路径" },
			1: { name: "结果目录" },
			2: { name: "CLI 日志" },
			3: { name: "会话步骤" }
		}
	},
	AstroPhotoSiril_unsharp: {
		display_name: "反锐化遮罩",
		description: "将图像与高斯模糊副本进行混合，以增强细节锐度。",
		inputs: {
			arguments: {
				name: "命令参数",
				tooltip: "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"
			},
			stage_only: {
				name: "仅暂存步骤",
				tooltip: "生成会话步骤供下游使用，本节点此时不运行 CLI。"
			},
			image_path: {
				name: "图像路径",
				tooltip: "命令执行前加载此文件。"
			},
			file_path: {
				name: "文件路径",
				tooltip: "暂存此文件，并用 {input} 在参数中引用。"
			},
			directory_path: {
				name: "输入目录",
				tooltip: "接入上游目录中的文件。"
			},
			source_directory: {
				name: "本地源目录",
				tooltip: "宿主上的绝对目录路径，例如 FITS 序列所在目录。"
			},
			previous_steps: {
				name: "上游会话步骤",
				tooltip: "连接前一节点暂存的会话步骤。"
			}
		},
		outputs: {
			0: { name: "结果图像路径" },
			1: { name: "结果目录" },
			2: { name: "CLI 日志" },
			3: { name: "会话步骤" }
		}
	},
	AstroPhotoSiril_update_key: {
		display_name: "编辑 FITS 关键字",
		description: "添加、重命名、删除或注释 FITS 头关键字。",
		inputs: {
			arguments: {
				name: "命令参数",
				tooltip: "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"
			},
			stage_only: {
				name: "仅暂存步骤",
				tooltip: "生成会话步骤供下游使用，本节点此时不运行 CLI。"
			},
			image_path: {
				name: "图像路径",
				tooltip: "命令执行前加载此文件。"
			},
			file_path: {
				name: "文件路径",
				tooltip: "暂存此文件，并用 {input} 在参数中引用。"
			},
			directory_path: {
				name: "输入目录",
				tooltip: "接入上游目录中的文件。"
			},
			source_directory: {
				name: "本地源目录",
				tooltip: "宿主上的绝对目录路径，例如 FITS 序列所在目录。"
			},
			previous_steps: {
				name: "上游会话步骤",
				tooltip: "连接前一节点暂存的会话步骤。"
			}
		},
		outputs: {
			0: { name: "结果图像路径" },
			1: { name: "结果目录" },
			2: { name: "CLI 日志" },
			3: { name: "会话步骤" }
		}
	},
	AstroPhotoSiril_wavelet: {
		display_name: "小波分解",
		description: "将图像分解为不同空间尺度的小波层。",
		inputs: {
			arguments: {
				name: "命令参数",
				tooltip: "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"
			},
			stage_only: {
				name: "仅暂存步骤",
				tooltip: "生成会话步骤供下游使用，本节点此时不运行 CLI。"
			},
			image_path: {
				name: "图像路径",
				tooltip: "命令执行前加载此文件。"
			},
			file_path: {
				name: "文件路径",
				tooltip: "暂存此文件，并用 {input} 在参数中引用。"
			},
			directory_path: {
				name: "输入目录",
				tooltip: "接入上游目录中的文件。"
			},
			source_directory: {
				name: "本地源目录",
				tooltip: "宿主上的绝对目录路径，例如 FITS 序列所在目录。"
			},
			previous_steps: {
				name: "上游会话步骤",
				tooltip: "连接前一节点暂存的会话步骤。"
			}
		},
		outputs: {
			0: { name: "结果图像路径" },
			1: { name: "结果目录" },
			2: { name: "CLI 日志" },
			3: { name: "会话步骤" }
		}
	},
	AstroPhotoSiril_wiener: {
		display_name: "维纳反卷积",
		description: "根据点扩散函数用维纳反卷积减轻模糊。",
		inputs: {
			arguments: {
				name: "命令参数",
				tooltip: "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"
			},
			stage_only: {
				name: "仅暂存步骤",
				tooltip: "生成会话步骤供下游使用，本节点此时不运行 CLI。"
			},
			image_path: {
				name: "图像路径",
				tooltip: "命令执行前加载此文件。"
			},
			file_path: {
				name: "文件路径",
				tooltip: "暂存此文件，并用 {input} 在参数中引用。"
			},
			directory_path: {
				name: "输入目录",
				tooltip: "接入上游目录中的文件。"
			},
			source_directory: {
				name: "本地源目录",
				tooltip: "宿主上的绝对目录路径，例如 FITS 序列所在目录。"
			},
			previous_steps: {
				name: "上游会话步骤",
				tooltip: "连接前一节点暂存的会话步骤。"
			}
		},
		outputs: {
			0: { name: "结果图像路径" },
			1: { name: "结果目录" },
			2: { name: "CLI 日志" },
			3: { name: "会话步骤" }
		}
	},
	AstroPhotoSiril_wrecons: {
		display_name: "重组小波层",
		description: "使用分层权重将小波层重新组合为图像。",
		inputs: {
			arguments: {
				name: "命令参数",
				tooltip: "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"
			},
			stage_only: {
				name: "仅暂存步骤",
				tooltip: "生成会话步骤供下游使用，本节点此时不运行 CLI。"
			},
			image_path: {
				name: "图像路径",
				tooltip: "命令执行前加载此文件。"
			},
			file_path: {
				name: "文件路径",
				tooltip: "暂存此文件，并用 {input} 在参数中引用。"
			},
			directory_path: {
				name: "输入目录",
				tooltip: "接入上游目录中的文件。"
			},
			source_directory: {
				name: "本地源目录",
				tooltip: "宿主上的绝对目录路径，例如 FITS 序列所在目录。"
			},
			previous_steps: {
				name: "上游会话步骤",
				tooltip: "连接前一节点暂存的会话步骤。"
			}
		},
		outputs: {
			0: { name: "结果图像路径" },
			1: { name: "结果目录" },
			2: { name: "CLI 日志" },
			3: { name: "会话步骤" }
		}
	}
}, fy = {
	"vue-basic": {
		title: "Vue基础示例",
		pen: "铅笔",
		"pen-tooltip": "使用画笔绘图",
		"restore-error": "无法恢复保存的画板内容，请检查工作流中的图片数据。",
		"clear-canvas": "清除画布",
		"brush-size": "笔刷大小"
	},
	nodeCategories: {
		Siril: "Siril",
		"Color and Channels": "色彩与通道",
		"Files, Sequences and Metadata": "文件、序列与元数据",
		"Sensor Correction": "传感器校正",
		"Geometry and Resampling": "几何变换与重采样",
		"Image Registration": "图像配准",
		"Image Stacking": "图像叠加",
		"Tone and Contrast": "亮度与对比度",
		"Color Calibration": "色彩校准",
		"Color Management": "色彩管理",
		"Color Adjustments": "色彩调整",
		"Channel Management": "通道管理",
		"Background Extraction and Gradient Correction": "背景提取与梯度校正",
		"Artifact Correction": "伪影校正",
		"Convolution and Sharpening": "卷积与锐化",
		Deconvolution: "反卷积",
		"Noise Reduction": "降噪",
		"Multiscale Processing": "多尺度处理",
		"Feature Detection and Processing": "特征检测与处理",
		"Pixel and Frequency-Domain Operations": "像素与频域运算",
		"Image Measurement and Analysis": "图像测量与分析",
		"Coordinate Calibration and Reference Data": "坐标标定与参考数据",
		"Runtime and Session": "运行与会话"
	}
}, py = dy, my = fy.nodeCategories;
function hy(e, t) {
	return t === "zh" ? my[e.replace(/\./g, "_")] ?? e : e;
}
function gy(e, t) {
	let n = t === "zh" ? py[e.id] : void 0, r = n?.display_name ?? e.title;
	return {
		...e,
		title: r,
		description: n?.description ?? e.description,
		aliases: r === e.title ? e.aliases : [...e.aliases, e.title],
		inputs: e.inputs.map(([t, r]) => [n?.inputs?.[t]?.name ?? e.inputLabels?.[t] ?? t, r]),
		outputs: e.outputs.map(([e, t], r) => [n?.outputs?.[r]?.name ?? e, t])
	};
}
// src/features/nodes/NodesPage.tsx
var _y = ["original", "alphabetical"], vy = /* @__PURE__ */ z((e) => {
	let { t, locale: n } = Cf(), r = /* @__PURE__ */ P(""), i = /* @__PURE__ */ F(/* @__PURE__ */ new Set()), a = /* @__PURE__ */ F(/* @__PURE__ */ new Set()), o = /* @__PURE__ */ F([]), [s, c] = Vv("AstroPhoto.Nodes.Sort", _y), l = /* @__PURE__ */ P(null), u = /* @__PURE__ */ F(cy()), d = /* @__PURE__ */ P(!1), f = /* @__PURE__ */ P(), p = /* @__PURE__ */ F(null), m = X(() => e.resource.state === "ready" ? e.resource.data.map((e) => gy(e, n.value)) : []), h = X(() => new Map(m.value.map((e) => [e.id, e]))), g = !1, _ = (t) => !g && e.active && h.value.has(t), v = (e) => {
		let n = e instanceof Error && e.message === "CANVAS_UNSUPPORTED" ? t("nodes.canvasUnsupported") : t(e ? "errors.unknown" : "nodes.created");
		p.value = Uv(e ? "error" : "success", n) ? null : { error: e };
	}, y = Qv(_, v);
	ke(() => {
		g = !0, y.dispose();
	});
	let b = /* @__PURE__ */ F(null), x = /* @__PURE__ */ F(null), S, C = 0;
	R(() => e.homeActivation, () => {
		l.value = null, S = void 0;
	});
	let w = (e) => {
		r.value = e, a.value = /* @__PURE__ */ new Set();
	};
	R(() => e.active, (e, t, n) => {
		if (!e) return;
		let r = () => {
			if (d.value) return;
			let e = cy(), t = u.value;
			t.length === e.length && t.every((t, n) => t === e[n]) || (u.value = e);
		};
		r();
		let i = window.setInterval(r, 500);
		n(() => window.clearInterval(i));
	}, { immediate: !0 }), R([() => e.active, () => e.resource], ([e, t]) => {
		y.cancel(), p.value = null, e && t.state === "ready" || (f.value = void 0), t.state === "ready" && l.value && !h.value.has(l.value) && (l.value = null, S = void 0);
	}, { flush: "sync" });
	async function T(e, t) {
		_(e) && (S = t, l.value = e, await Fn(), _(e) && l.value === e && b.value?.focus());
	}
	async function E() {
		l.value = null, await Fn(), g || !e.active || l.value || (S?.isConnected ? S.focus({ preventScroll: !0 }) : x.value?.querySelector("input[type=search]")?.focus(), S = void 0);
	}
	async function D(n, r) {
		if (!_(n) || d.value) return;
		f.value = void 0, d.value = !0;
		let i = e.resource;
		try {
			await uy(r, !u.value.includes(r), () => e.resource === i && _(n));
		} catch (e) {
			let n = e instanceof Q && e.code === "bookmarkUnsupported" ? "bookmarkUnsupported" : "bookmark";
			f.value = Uv("error", t(`errors.${n}`)) ? void 0 : n;
		} finally {
			u.value = cy(), d.value = !1;
		}
	}
	return () => {
		let { active: g, resource: S, refresh: O } = e, k = [...new Set(m.value.map((e) => e.category))], A = k.filter((e) => o.value.includes(e)), j = (e) => e === "Assets" ? t("nav.assets") : hy(e, n.value), ee = (e) => e.split("/").filter((e, t) => e && (t !== 0 || e !== "AstroPhoto")).map(j).join(" / ") || t("nodes.uncategorized"), te = r.value.trim().toLocaleLowerCase(), M = m.value.filter((e) => (A.length === 0 || A.includes(e.category)) && [
			e.id,
			e.title,
			e.category,
			ee(e.category),
			...e.aliases,
			e.description
		].join(" ").toLocaleLowerCase().includes(te)), ne = ry(M, s.value === "alphabetical" ? (e, t) => e.localeCompare(t, n.value) : void 0, j), re = new Set(M.map((e) => e.id)), ie = [...new Set(u.value)].flatMap((e) => {
			if (e.endsWith("/")) return [];
			let t = h.value.get(e.slice(e.lastIndexOf("/") + 1));
			return t && re.has(t.id) ? [{
				...t,
				bookmarkPath: e
			}] : [];
		}), ae = (e, t) => {
			let n = te ? a : i, r = new Set(n.value);
			(te ? !t : t) ? r.add(e) : r.delete(e), n.value = r;
		}, oe = l.value ? h.value.get(l.value) : void 0, se = (e) => {
			if (_(e)) try {
				Kv(e), v(null);
			} catch (e) {
				v(e);
			}
		}, ce = {
			isExpanded: (e) => te ? !a.value.has(e) : i.value.has(e),
			setExpanded: ae,
			selectNode: T,
			startDrag: y.start,
			previewEnabled: g && !oe,
			isBookmarked: (e) => u.value.includes(e),
			toggleBookmark: D,
			bookmarkPending: d.value,
			bookmarkLabel: (e) => t(e ? "nodes.removeBookmark" : "nodes.addBookmark")
		};
		return q(H, null, [
			q("div", {
				class: "ap-search-toolbar",
				ref: x,
				hidden: S.state !== "ready"
			}, [
				q(zv, {
					label: t("nodes.search"),
					clearLabel: t("browse.clear"),
					onSearch: w
				}, null),
				q(Bv, {
					icon: "filter",
					label: t("browse.filter"),
					multiple: !0,
					disabled: k.length === 0,
					options: [{
						id: "all",
						label: t("browse.allCategories"),
						checked: A.length === 0,
						select: () => o.value = []
					}, ...k.map((e) => ({
						id: `category:${e}`,
						label: ee(e),
						checked: A.includes(e),
						select: () => {
							o.value = A.includes(e) ? A.filter((t) => t !== e) : [...A, e];
						}
					}))]
				}, null),
				q(Bv, {
					icon: "sort",
					label: t("browse.sort"),
					options: _y.map((e) => ({
						id: e,
						label: t(`browse.${e}`),
						checked: s.value === e,
						select: () => c(e)
					}))
				}, null)
			]),
			S.state === "loading" && q("p", { role: "status" }, [t("states.loading")]),
			S.state === "error" && q(Wv, {
				error: S.error,
				retry: O
			}, null),
			S.state === "ready" && q(H, null, [q("div", {
				hidden: !!oe,
				class: "ap-scroll",
				ref: (e) => {
					e instanceof HTMLElement && !oe && g && (e.scrollTop = C);
				},
				onScroll: (e) => {
					g && !oe && (C = e.currentTarget.scrollTop);
				}
			}, [
				q("h3", { class: "ap-bookmarks-heading" }, [t("nodes.bookmarks")]),
				ie.length === 0 ? q("div", { class: "ap-bookmarks-empty" }, [t("nodes.noBookmarks")]) : q(ay, za({ entries: ry(ie) }, ce), null),
				m.value.length === 0 ? q("p", null, [t("nodes.empty")]) : M.length === 0 ? q("p", null, [t("nodes.noResults")]) : q(ay, za({ entries: ne }, ce), null)
			]), oe && q("div", { class: "ap-scroll" }, [
				q("button", {
					ref: b,
					onClick: E
				}, [t("actions.back")]),
				q("h2", null, [oe.title]),
				q("code", null, [oe.id]),
				q("p", null, [oe.description || t("nodes.noDescription")]),
				q("p", null, [t("nodes.registered")]),
				q("h3", null, [t("nodes.inputs")]),
				q("dl", null, [oe.inputs.map(([e, t]) => q("div", { key: e }, [q("dt", null, [e]), q("dd", null, [t])]))]),
				q("h3", null, [t("nodes.outputs")]),
				q("dl", null, [oe.outputs.map(([e, t]) => q("div", { key: e }, [q("dt", null, [e]), q("dd", null, [t])]))]),
				q("p", null, [t("nodes.dependencies")]),
				q("p", null, [t("nodes.helpUnavailable")]),
				q("button", { onClick: () => se(oe.id) }, [t("nodes.add")])
			])]),
			S.state === "ready" && f.value && q("p", { role: "alert" }, [t(`errors.${f.value}`)]),
			S.state === "ready" && p.value && (p.value.error instanceof Error && p.value.error.message === "CANVAS_UNSUPPORTED" ? q("p", { role: "alert" }, [t("nodes.canvasUnsupported")]) : p.value.error ? q(Wv, { error: p.value.error }, null) : q("p", { role: "status" }, [t("nodes.created")]))
		]);
	};
}, { props: [
	"active",
	"resource",
	"refresh",
	"homeActivation"
] }), yy = "/astrophoto/v1", by = (e, t) => `${yy}/library/${e}${t === void 0 ? "" : "/" + encodeURIComponent(t)}`, xy = (e) => e == null || typeof e == "string", Sy = (e) => Array.isArray(e) && e.every((e) => typeof e == "string"), Cy = (e) => $(e) && Object.values(e).every((e) => xy(e) || Sy(e) || typeof e == "number" && Number.isFinite(e)), wy = (e) => typeof e.asset_id == "string" || typeof e.collection_id == "string", Ty = {
	assets: (e) => typeof e.name == "string" && typeof e.size_bytes == "number" && (e.storage_mode === "external_reference" || e.storage_mode === "managed") && xy(e.workspace_id) && typeof e.available == "boolean" && Cy(e.attributes),
	projects: (e) => typeof e.name == "string" && xy(e.target) && xy(e.notes),
	"import-groups": (e) => typeof e.name == "string" && Number.isSafeInteger(e.count) && Array.isArray(e.workspaces) && e.workspaces.every((e) => $(e) && typeof e.id == "string" && typeof e.name == "string" && Number.isSafeInteger(e.count)),
	collections: (e) => typeof e.name == "string" && Sy(e.asset_ids) && xy(e.calibration_folder_id) && (e.calibration_eligible === void 0 || typeof e.calibration_eligible == "boolean"),
	folders: (e) => typeof e.name == "string" && xy(e.project_id) && xy(e.parent_id),
	sessions: (e) => typeof e.name == "string" && Sy(e.asset_ids) && xy(e.notes),
	masters: (e) => typeof e.asset_id == "string" && xy(e.folder_id) && xy(e.method) && xy(e.source_asset_id),
	assignments: (e) => wy(e) && typeof e.master_id == "string",
	placements: (e) => wy(e) && typeof e.project_id == "string" && xy(e.folder_id)
};
function Ey(e, t) {
	if (!$(t) || typeof t.id != "string" || !Number.isSafeInteger(t.revision) || !Ty[e](t)) throw new Q("schema");
	return t;
}
async function Dy(e, t, n) {
	let r = new URLSearchParams();
	for (let [e, n] of Object.entries(t)) n && r.set(e, n);
	let i = await Ff(by(e) + "?" + r, n, "no-store");
	if (!$(i) || !Array.isArray(i.items) || i.next !== null && typeof i.next != "string") throw new Q("schema");
	return {
		items: i.items.map((t) => Ey(e, t)),
		next: i.next
	};
}
async function Oy(e, t, n) {
	let r = [], i = /* @__PURE__ */ new Set(), a = null;
	do {
		let o = await Dy(e, {
			...t,
			after: a ?? void 0
		}, n);
		if (r.push(...o.items), a = o.next, a) {
			if (i.has(a)) throw new Q("schema");
			i.add(a);
		}
	} while (a);
	return r;
}
async function ky(e, t, n) {
	return Ey(e, await Ff(by(e, t), n, "no-store"));
}
async function Ay(e, t, n, r) {
	return Ey(e, await If(by(e, r?.id), r ? "PATCH" : "POST", r ? {
		...t,
		revision: r.revision
	} : t, n));
}
async function jy(e, t, n, r = {}) {
	await If(by(e, t.id), "DELETE", {
		...r,
		revision: t.revision
	}, n);
}
async function My(e, t) {
	await If(by("assignments", "batch"), "POST", e, t);
}
async function Ny(e, t) {
	let n = await If(yy + "/assets/import/preview", "POST", e, t, 6e4);
	if (!$(n) || typeof n.file_count != "number" || typeof n.failed != "number" || typeof n.size_bytes != "number" || typeof n.preview_id != "string") throw new Q("schema");
	return n;
}
async function Py(e, t, n) {
	await If(`${yy}/assets/${encodeURIComponent(e)}/relocate`, "POST", { new_path: t }, n);
}
async function Fy(e, t) {
	await If(by("assets", e.id) + "/delete-file", "POST", {
		revision: e.revision,
		confirmed: !0
	}, t);
}
async function Iy(e, t, n) {
	let r = await If(`${yy}/library/projects/${encodeURIComponent(e)}/assets`, "POST", { asset_ids: t }, n);
	if (!$(r) || !Number.isSafeInteger(r.added) || !Number.isSafeInteger(r.already_present)) throw new Q("schema");
	return r;
}
// src/api/storage.ts
var Ly = "/astrophoto/v1", Ry = (e) => e === "reference" || e === "copy", zy = (e) => typeof e == "number" && Number.isFinite(e) && e >= 0, By = (e) => e === null || zy(e), Vy = (e, t) => t.every((t) => typeof e[t] == "string");
function Hy(e) {
	return $(e) && Vy(e, ["operation_id", "phase"]) && (e.kind === "migration" || e.kind === "import");
}
async function Uy(e) {
	let t = await If(Ly + "/storage", "GET", void 0, e);
	if ($(t) && typeof t.reason == "string") throw new Q(t.reason);
	if (!$(t) || !["ready", "degraded"].includes(String(t.status)) || !$(t.data_root) || !Vy(t.data_root, ["path", "source"]) || !$(t.database) || !Vy(t.database, ["assets"]) || !$(t.imports) || !Ry(t.imports.default_mode) || !zy(t.imports.revision) || typeof t.default_workspace_id != "string" || !Array.isArray(t.workspaces) || !t.workspaces.every((e) => $(e) && Vy(e, [
		"id",
		"name",
		"root_path",
		"status"
	]) && typeof e.enabled == "boolean" && typeof e.is_default == "boolean" && zy(e.revision) && By(e.free_bytes)) || !$(t.cache) || !Vy(t.cache, ["path", "status"]) || !zy(t.cache.max_size_gb) || !By(t.cache.used_bytes) || !$(t.capabilities) || typeof t.capabilities.write != "boolean" || typeof t.capabilities.import != "boolean" || !Array.isArray(t.operations) || !t.operations.every(Hy)) throw new Q("schema");
	return t;
}
async function Wy(e, t, n, r = "POST", i) {
	let a = await If(Ly + e, r, t, n, i);
	if (!$(a) || typeof a.request_id != "string") throw new Q("schema");
	return a;
}
async function Gy(e, t, n) {
	let r = await Wy(e === "import" ? "/assets/import" : "/storage/migrations", t, n);
	if (typeof r.operation_id != "string") throw new Q("schema");
	return {
		operation_id: r.operation_id,
		kind: e,
		phase: "queued"
	};
}
function Ky(e) {
	return (e.kind === "import" ? "/assets/imports" : "/storage/migrations") + "/" + encodeURIComponent(e.operation_id);
}
function qy(e) {
	return !$(e) || ![
		"processed",
		"total",
		"registered",
		"copied",
		"failed",
		"skipped",
		"retryable"
	].every((t) => !(t in e) || zy(e[t])) ? !1 : e.errors === void 0 || Array.isArray(e.errors) && e.errors.every((e) => $(e) && zy(e.entry) && typeof e.code == "string");
}
async function Jy(e, t) {
	let n = await If(Ly + Ky(e), "GET", void 0, t);
	if (!$(n) || n.operation_id !== e.operation_id || n.kind !== e.kind || !qy(n.receipt) || n.error !== null && (!$(n.error) || typeof n.error.code != "string") || n.effective_import_mode !== null && !Ry(n.effective_import_mode) || !Hy(n)) throw new Q("schema");
	return n;
}
async function Yy(e) {
	let t = await If(Ly + "/storage/operations", "GET", void 0, e);
	if (!$(t) || !Array.isArray(t.operations) || !t.operations.every((e) => {
		if (!$(e)) return !1;
		let { receipt: t, error: n, effective_import_mode: r } = e;
		return Hy(e) && qy(t) && (n === null || $(n) && typeof n.code == "string") && (r === null || Ry(r));
	})) throw new Q("schema");
	return t.operations;
}
// src/shared/useResource.ts
function Xy(e, t = !1) {
	let n = /* @__PURE__ */ F({ state: "loading" }), r = /* @__PURE__ */ F(0), i;
	return R([() => I(e), r], ([e], r, a) => {
		let o = new AbortController();
		i = o, a(() => {
			o.abort(), i === o && (i = void 0);
		}), t && n.value.state === "ready" || (n.value = { state: "loading" }), e(o.signal).then((e) => {
			o.signal.aborted || (n.value = {
				state: "ready",
				data: e
			});
		}, (e) => {
			o.signal.aborted || (n.value = {
				state: "error",
				error: e
			});
		});
	}, { immediate: !0 }), {
		resource: n,
		refresh: () => {
			i?.abort(), t || (n.value = { state: "loading" }), r.value += 1;
		}
	};
}
// src/shared/SidebarTabs.tsx
function Zy({ items: e, active: t, prefix: n, label: r, title: i, select: a, dragOver: o }) {
	return q("div", { class: "ap-tab-scroll" }, [q("div", {
		class: "ap-tabs",
		role: "tablist",
		"aria-label": r
	}, [e.map((r, s) => q("button", {
		key: r,
		id: `${n}-tab-${r}`,
		type: "button",
		role: "tab",
		"aria-selected": r === t,
		"aria-controls": `${n}-panel-${r}`,
		"data-state": r === t ? "active" : "inactive",
		tabindex: r === t ? 0 : -1,
		onClick: () => a(r),
		onDragenter: (e) => o?.(r, e),
		onDragover: (e) => o?.(r, e),
		onKeydown: (t) => {
			let n = t.key === "Home" ? 0 : t.key === "End" ? e.length - 1 : (s + {
				ArrowRight: 1,
				ArrowDown: 1,
				ArrowLeft: -1,
				ArrowUp: -1
			}[t.key] + e.length) % e.length;
			Number.isNaN(n) || (t.preventDefault(), (t.currentTarget.parentElement?.querySelectorAll("[role=\"tab\"]"))?.item(n)?.focus());
		}
	}, [i(r)]))])]);
}
// node_modules/.pnpm/clsx@2.1.1/node_modules/clsx/dist/clsx.mjs
function Qy(e) {
	var t, n, r = "";
	if (typeof e == "string" || typeof e == "number") r += e;
	else if (typeof e == "object") {
		if (Array.isArray(e)) {
			var i = e.length;
			for (t = 0; t < i; t++) e[t] && (n = Qy(e[t])) && (r && (r += " "), r += n);
		} else for (n in e) e[n] && (r && (r += " "), r += n);
	}
	return r;
}
function $y() {
	for (var e, t, n = 0, r = "", i = arguments.length; n < i; n++) (e = arguments[n]) && (t = Qy(e)) && (r && (r += " "), r += t);
	return r;
}
// node_modules/.pnpm/cva@1.0.0-beta.4_typescript@6.0.3/node_modules/cva/dist/index.mjs
var eb = (e) => typeof e == "boolean" ? `${e}` : e === 0 ? "0" : e, { compose: tb, cva: nb, cx: rb } = ((e) => {
	let t = function() {
		var t = [...arguments];
		return e?.hooks?.["cx:done"] === void 0 ? e?.hooks?.onComplete === void 0 ? $y(t) : e?.hooks.onComplete($y(t)) : e?.hooks["cx:done"]($y(t));
	};
	return {
		compose: function() {
			var e = [...arguments];
			return (n) => {
				let r = Object.fromEntries(Object.entries(n || {}).filter((e) => {
					let [t] = e;
					return !["class", "className"].includes(t);
				}));
				return t(e.map((e) => e(r)), n?.class, n?.className);
			};
		},
		cva: (e) => (n) => {
			if (e?.variants == null) return t(e?.base, n?.class, n?.className);
			let { variants: r, defaultVariants: i } = e, a = Object.keys(r).map((e) => {
				let t = n?.[e], a = i?.[e], o = eb(t) || eb(a);
				return r[e][o];
			}), o = {
				...i,
				...n && Object.entries(n).reduce((e, t) => {
					let [n, r] = t;
					return r === void 0 ? e : {
						...e,
						[n]: r
					};
				}, {})
			}, s = e?.compoundVariants?.reduce((e, t) => {
				let { class: n, className: r, ...i } = t;
				return Object.entries(i).every((e) => {
					let [t, n] = e, r = o[t];
					return Array.isArray(n) ? n.includes(r) : r === n;
				}) ? [
					...e,
					n,
					r
				] : e;
			}, []);
			return t(e?.base, a, s, n?.class, n?.className);
		},
		cx: t
	};
})(), ib = nb({
	base: "relative inline-flex cursor-pointer items-center rounded-lg border-[2.5px] border-solid bg-secondary text-foreground transition-all duration-200 ease-in-out outline-none select-none hover:bg-accent disabled:cursor-default disabled:opacity-30 disabled:hover:bg-secondary",
	variants: {
		size: {
			md: "h-8",
			lg: "h-10"
		},
		border: {
			none: "border-transparent focus-visible:border-border data-[state=open]:border-border",
			active: "border-foreground",
			invalid: "border-destructive"
		}
	},
	defaultVariants: {
		size: "lg",
		border: "none"
	}
}), ab = nb({
	base: "flex cursor-pointer items-center px-2 outline-none hover:bg-accent",
	variants: { layout: {
		multi: "h-10 shrink-0 gap-2 rounded-lg data-highlighted:bg-muted data-highlighted:hover:bg-muted",
		single: "relative w-full justify-between gap-3 rounded-sm py-3 text-sm select-none focus:bg-accent data-[state=checked]:bg-muted data-[state=checked]:hover:bg-muted"
	} },
	defaultVariants: { layout: "multi" }
}), ob = "z-overlay overflow-hidden rounded-lg p-2 bg-background text-foreground border border-solid shadow-md data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2", sb = "flex shrink-0 cursor-pointer items-center justify-center pl-3", cb = "px-3 pb-4 text-sm text-muted-foreground", lb = "flex size-3.5 items-center justify-center rounded-full bg-foreground text-[9px] font-semibold text-background";
function ub(e) {
	e.key === "Escape" && (e.stopPropagation(), e.stopImmediatePropagation());
}
// src/vendor/comfyui/composables/useAttrsClass.ts
function db() {
	let e = oi();
	return {
		attrsClass: X(() => e.class),
		attrsWithoutClass: X(() => {
			let { class: t, ...n } = e;
			return n;
		})
	};
}
// src/vendor/comfyui/composables/usePopoverSizing.ts
function fb(e) {
	return X(() => {
		let { minWidth: t, maxWidth: n } = e, r = {};
		return t && (r.minWidth = t), n && (r.maxWidth = n), r;
	});
}
// node_modules/.pnpm/tailwind-merge@2.6.1/node_modules/tailwind-merge/dist/bundle-mjs.mjs
var pb = "-", mb = (e) => {
	let t = vb(e), { conflictingClassGroups: n, conflictingClassGroupModifiers: r } = e;
	return {
		getClassGroupId: (e) => {
			let n = e.split(pb);
			return n[0] === "" && n.length !== 1 && n.shift(), hb(n, t) || _b(e);
		},
		getConflictingClassGroupIds: (e, t) => {
			let i = n[e] || [];
			return t && r[e] ? [...i, ...r[e]] : i;
		}
	};
}, hb = (e, t) => {
	if (e.length === 0) return t.classGroupId;
	let n = e[0], r = t.nextPart.get(n), i = r ? hb(e.slice(1), r) : void 0;
	if (i) return i;
	if (t.validators.length === 0) return;
	let a = e.join(pb);
	return t.validators.find(({ validator: e }) => e(a))?.classGroupId;
}, gb = /^\[(.+)\]$/, _b = (e) => {
	if (gb.test(e)) {
		let t = gb.exec(e)[1], n = t?.substring(0, t.indexOf(":"));
		if (n) return "arbitrary.." + n;
	}
}, vb = (e) => {
	let { theme: t, prefix: n } = e, r = {
		nextPart: /* @__PURE__ */ new Map(),
		validators: []
	};
	return Sb(Object.entries(e.classGroups), n).forEach(([e, n]) => {
		yb(n, r, e, t);
	}), r;
}, yb = (e, t, n, r) => {
	e.forEach((e) => {
		if (typeof e == "string") {
			let r = e === "" ? t : bb(t, e);
			r.classGroupId = n;
		} else if (typeof e == "function") {
			if (xb(e)) {
				yb(e(r), t, n, r);
				return;
			}
			t.validators.push({
				validator: e,
				classGroupId: n
			});
		} else Object.entries(e).forEach(([e, i]) => {
			yb(i, bb(t, e), n, r);
		});
	});
}, bb = (e, t) => {
	let n = e;
	return t.split(pb).forEach((e) => {
		n.nextPart.has(e) || n.nextPart.set(e, {
			nextPart: /* @__PURE__ */ new Map(),
			validators: []
		}), n = n.nextPart.get(e);
	}), n;
}, xb = (e) => e.isThemeGetter, Sb = (e, t) => t ? e.map(([e, n]) => [e, n.map((e) => typeof e == "string" ? t + e : typeof e == "object" ? Object.fromEntries(Object.entries(e).map(([e, n]) => [t + e, n])) : e)]) : e, Cb = (e) => {
	if (e < 1) return {
		get: () => void 0,
		set: () => {}
	};
	let t = 0, n = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Map(), i = (i, a) => {
		n.set(i, a), t++, t > e && (t = 0, r = n, n = /* @__PURE__ */ new Map());
	};
	return {
		get(e) {
			let t = n.get(e);
			if (t !== void 0) return t;
			if ((t = r.get(e)) !== void 0) return i(e, t), t;
		},
		set(e, t) {
			n.has(e) ? n.set(e, t) : i(e, t);
		}
	};
}, wb = "!", Tb = (e) => {
	let { separator: t, experimentalParseClassName: n } = e, r = t.length === 1, i = t[0], a = t.length, o = (e) => {
		let n = [], o = 0, s = 0, c;
		for (let l = 0; l < e.length; l++) {
			let u = e[l];
			if (o === 0) {
				if (u === i && (r || e.slice(l, l + a) === t)) {
					n.push(e.slice(s, l)), s = l + a;
					continue;
				}
				if (u === "/") {
					c = l;
					continue;
				}
			}
			u === "[" ? o++ : u === "]" && o--;
		}
		let l = n.length === 0 ? e : e.substring(s), u = l.startsWith(wb);
		return {
			modifiers: n,
			hasImportantModifier: u,
			baseClassName: u ? l.substring(1) : l,
			maybePostfixModifierPosition: c && c > s ? c - s : void 0
		};
	};
	return n ? (e) => n({
		className: e,
		parseClassName: o
	}) : o;
}, Eb = (e) => {
	if (e.length <= 1) return e;
	let t = [], n = [];
	return e.forEach((e) => {
		e[0] === "[" ? (t.push(...n.sort(), e), n = []) : n.push(e);
	}), t.push(...n.sort()), t;
}, Db = (e) => ({
	cache: Cb(e.cacheSize),
	parseClassName: Tb(e),
	...mb(e)
}), Ob = /\s+/, kb = (e, t) => {
	let { parseClassName: n, getClassGroupId: r, getConflictingClassGroupIds: i } = t, a = [], o = e.trim().split(Ob), s = "";
	for (let e = o.length - 1; e >= 0; --e) {
		let t = o[e], { modifiers: c, hasImportantModifier: l, baseClassName: u, maybePostfixModifierPosition: d } = n(t), f = !!d, p = r(f ? u.substring(0, d) : u);
		if (!p) {
			if (!f || (p = r(u), !p)) {
				s = t + (s.length > 0 ? " " + s : s);
				continue;
			}
			f = !1;
		}
		let m = Eb(c).join(":"), h = l ? m + wb : m, g = h + p;
		if (a.includes(g)) continue;
		a.push(g);
		let _ = i(p, f);
		for (let e = 0; e < _.length; ++e) {
			let t = _[e];
			a.push(h + t);
		}
		s = t + (s.length > 0 ? " " + s : s);
	}
	return s;
};
function Ab() {
	let e = 0, t, n, r = "";
	for (; e < arguments.length;) (t = arguments[e++]) && (n = jb(t)) && (r && (r += " "), r += n);
	return r;
}
var jb = (e) => {
	if (typeof e == "string") return e;
	let t, n = "";
	for (let r = 0; r < e.length; r++) e[r] && (t = jb(e[r])) && (n && (n += " "), n += t);
	return n;
};
function Mb(e, ...t) {
	let n, r, i, a = o;
	function o(o) {
		return n = Db(t.reduce((e, t) => t(e), e())), r = n.cache.get, i = n.cache.set, a = s, s(o);
	}
	function s(e) {
		let t = r(e);
		if (t) return t;
		let a = kb(e, n);
		return i(e, a), a;
	}
	return function() {
		return a(Ab.apply(null, arguments));
	};
}
var Nb = (e) => {
	let t = (t) => t[e] || [];
	return t.isThemeGetter = !0, t;
}, Pb = /^\[(?:([a-z-]+):)?(.+)\]$/i, Fb = /^\d+\/\d+$/, Ib = /*#__PURE__*/ new Set([
	"px",
	"full",
	"screen"
]), Lb = /^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/, Rb = /\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/, zb = /^(rgba?|hsla?|hwb|(ok)?(lab|lch)|color-mix)\(.+\)$/, Bb = /^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/, Vb = /^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/, Hb = (e) => Wb(e) || Ib.has(e) || Fb.test(e), Ub = (e) => rx(e, "length", ix), Wb = (e) => !!e && !Number.isNaN(Number(e)), Gb = (e) => rx(e, "number", Wb), Kb = (e) => !!e && Number.isInteger(Number(e)), qb = (e) => e.endsWith("%") && Wb(e.slice(0, -1)), Jb = (e) => Pb.test(e), Yb = (e) => Lb.test(e), Xb = /*#__PURE__*/ new Set([
	"length",
	"size",
	"percentage"
]), Zb = (e) => rx(e, Xb, ax), Qb = (e) => rx(e, "position", ax), $b = /*#__PURE__*/ new Set(["image", "url"]), ex = (e) => rx(e, $b, sx), tx = (e) => rx(e, "", ox), nx = () => !0, rx = (e, t, n) => {
	let r = Pb.exec(e);
	return r ? r[1] ? typeof t == "string" ? r[1] === t : t.has(r[1]) : n(r[2]) : !1;
}, ix = (e) => Rb.test(e) && !zb.test(e), ax = () => !1, ox = (e) => Bb.test(e), sx = (e) => Vb.test(e), cx = () => {
	let e = Nb("colors"), t = Nb("spacing"), n = Nb("blur"), r = Nb("brightness"), i = Nb("borderColor"), a = Nb("borderRadius"), o = Nb("borderSpacing"), s = Nb("borderWidth"), c = Nb("contrast"), l = Nb("grayscale"), u = Nb("hueRotate"), d = Nb("invert"), f = Nb("gap"), p = Nb("gradientColorStops"), m = Nb("gradientColorStopPositions"), h = Nb("inset"), g = Nb("margin"), _ = Nb("opacity"), v = Nb("padding"), y = Nb("saturate"), b = Nb("scale"), x = Nb("sepia"), S = Nb("skew"), C = Nb("space"), w = Nb("translate"), T = () => [
		"auto",
		"contain",
		"none"
	], E = () => [
		"auto",
		"hidden",
		"clip",
		"visible",
		"scroll"
	], D = () => [
		"auto",
		Jb,
		t
	], O = () => [Jb, t], k = () => [
		"",
		Hb,
		Ub
	], A = () => [
		"auto",
		Wb,
		Jb
	], j = () => [
		"bottom",
		"center",
		"left",
		"left-bottom",
		"left-top",
		"right",
		"right-bottom",
		"right-top",
		"top"
	], ee = () => [
		"solid",
		"dashed",
		"dotted",
		"double",
		"none"
	], te = () => [
		"normal",
		"multiply",
		"screen",
		"overlay",
		"darken",
		"lighten",
		"color-dodge",
		"color-burn",
		"hard-light",
		"soft-light",
		"difference",
		"exclusion",
		"hue",
		"saturation",
		"color",
		"luminosity"
	], M = () => [
		"start",
		"end",
		"center",
		"between",
		"around",
		"evenly",
		"stretch"
	], ne = () => [
		"",
		"0",
		Jb
	], re = () => [
		"auto",
		"avoid",
		"all",
		"avoid-page",
		"page",
		"left",
		"right",
		"column"
	], ie = () => [Wb, Jb];
	return {
		cacheSize: 500,
		separator: ":",
		theme: {
			colors: [nx],
			spacing: [Hb, Ub],
			blur: [
				"none",
				"",
				Yb,
				Jb
			],
			brightness: ie(),
			borderColor: [e],
			borderRadius: [
				"none",
				"",
				"full",
				Yb,
				Jb
			],
			borderSpacing: O(),
			borderWidth: k(),
			contrast: ie(),
			grayscale: ne(),
			hueRotate: ie(),
			invert: ne(),
			gap: O(),
			gradientColorStops: [e],
			gradientColorStopPositions: [qb, Ub],
			inset: D(),
			margin: D(),
			opacity: ie(),
			padding: O(),
			saturate: ie(),
			scale: ie(),
			sepia: ne(),
			skew: ie(),
			space: O(),
			translate: O()
		},
		classGroups: {
			aspect: [{ aspect: [
				"auto",
				"square",
				"video",
				Jb
			] }],
			container: ["container"],
			columns: [{ columns: [Yb] }],
			"break-after": [{ "break-after": re() }],
			"break-before": [{ "break-before": re() }],
			"break-inside": [{ "break-inside": [
				"auto",
				"avoid",
				"avoid-page",
				"avoid-column"
			] }],
			"box-decoration": [{ "box-decoration": ["slice", "clone"] }],
			box: [{ box: ["border", "content"] }],
			display: [
				"block",
				"inline-block",
				"inline",
				"flex",
				"inline-flex",
				"table",
				"inline-table",
				"table-caption",
				"table-cell",
				"table-column",
				"table-column-group",
				"table-footer-group",
				"table-header-group",
				"table-row-group",
				"table-row",
				"flow-root",
				"grid",
				"inline-grid",
				"contents",
				"list-item",
				"hidden"
			],
			float: [{ float: [
				"right",
				"left",
				"none",
				"start",
				"end"
			] }],
			clear: [{ clear: [
				"left",
				"right",
				"both",
				"none",
				"start",
				"end"
			] }],
			isolation: ["isolate", "isolation-auto"],
			"object-fit": [{ object: [
				"contain",
				"cover",
				"fill",
				"none",
				"scale-down"
			] }],
			"object-position": [{ object: [...j(), Jb] }],
			overflow: [{ overflow: E() }],
			"overflow-x": [{ "overflow-x": E() }],
			"overflow-y": [{ "overflow-y": E() }],
			overscroll: [{ overscroll: T() }],
			"overscroll-x": [{ "overscroll-x": T() }],
			"overscroll-y": [{ "overscroll-y": T() }],
			position: [
				"static",
				"fixed",
				"absolute",
				"relative",
				"sticky"
			],
			inset: [{ inset: [h] }],
			"inset-x": [{ "inset-x": [h] }],
			"inset-y": [{ "inset-y": [h] }],
			start: [{ start: [h] }],
			end: [{ end: [h] }],
			top: [{ top: [h] }],
			right: [{ right: [h] }],
			bottom: [{ bottom: [h] }],
			left: [{ left: [h] }],
			visibility: [
				"visible",
				"invisible",
				"collapse"
			],
			z: [{ z: [
				"auto",
				Kb,
				Jb
			] }],
			basis: [{ basis: D() }],
			"flex-direction": [{ flex: [
				"row",
				"row-reverse",
				"col",
				"col-reverse"
			] }],
			"flex-wrap": [{ flex: [
				"wrap",
				"wrap-reverse",
				"nowrap"
			] }],
			flex: [{ flex: [
				"1",
				"auto",
				"initial",
				"none",
				Jb
			] }],
			grow: [{ grow: ne() }],
			shrink: [{ shrink: ne() }],
			order: [{ order: [
				"first",
				"last",
				"none",
				Kb,
				Jb
			] }],
			"grid-cols": [{ "grid-cols": [nx] }],
			"col-start-end": [{ col: [
				"auto",
				{ span: [
					"full",
					Kb,
					Jb
				] },
				Jb
			] }],
			"col-start": [{ "col-start": A() }],
			"col-end": [{ "col-end": A() }],
			"grid-rows": [{ "grid-rows": [nx] }],
			"row-start-end": [{ row: [
				"auto",
				{ span: [Kb, Jb] },
				Jb
			] }],
			"row-start": [{ "row-start": A() }],
			"row-end": [{ "row-end": A() }],
			"grid-flow": [{ "grid-flow": [
				"row",
				"col",
				"dense",
				"row-dense",
				"col-dense"
			] }],
			"auto-cols": [{ "auto-cols": [
				"auto",
				"min",
				"max",
				"fr",
				Jb
			] }],
			"auto-rows": [{ "auto-rows": [
				"auto",
				"min",
				"max",
				"fr",
				Jb
			] }],
			gap: [{ gap: [f] }],
			"gap-x": [{ "gap-x": [f] }],
			"gap-y": [{ "gap-y": [f] }],
			"justify-content": [{ justify: ["normal", ...M()] }],
			"justify-items": [{ "justify-items": [
				"start",
				"end",
				"center",
				"stretch"
			] }],
			"justify-self": [{ "justify-self": [
				"auto",
				"start",
				"end",
				"center",
				"stretch"
			] }],
			"align-content": [{ content: [
				"normal",
				...M(),
				"baseline"
			] }],
			"align-items": [{ items: [
				"start",
				"end",
				"center",
				"baseline",
				"stretch"
			] }],
			"align-self": [{ self: [
				"auto",
				"start",
				"end",
				"center",
				"stretch",
				"baseline"
			] }],
			"place-content": [{ "place-content": [...M(), "baseline"] }],
			"place-items": [{ "place-items": [
				"start",
				"end",
				"center",
				"baseline",
				"stretch"
			] }],
			"place-self": [{ "place-self": [
				"auto",
				"start",
				"end",
				"center",
				"stretch"
			] }],
			p: [{ p: [v] }],
			px: [{ px: [v] }],
			py: [{ py: [v] }],
			ps: [{ ps: [v] }],
			pe: [{ pe: [v] }],
			pt: [{ pt: [v] }],
			pr: [{ pr: [v] }],
			pb: [{ pb: [v] }],
			pl: [{ pl: [v] }],
			m: [{ m: [g] }],
			mx: [{ mx: [g] }],
			my: [{ my: [g] }],
			ms: [{ ms: [g] }],
			me: [{ me: [g] }],
			mt: [{ mt: [g] }],
			mr: [{ mr: [g] }],
			mb: [{ mb: [g] }],
			ml: [{ ml: [g] }],
			"space-x": [{ "space-x": [C] }],
			"space-x-reverse": ["space-x-reverse"],
			"space-y": [{ "space-y": [C] }],
			"space-y-reverse": ["space-y-reverse"],
			w: [{ w: [
				"auto",
				"min",
				"max",
				"fit",
				"svw",
				"lvw",
				"dvw",
				Jb,
				t
			] }],
			"min-w": [{ "min-w": [
				Jb,
				t,
				"min",
				"max",
				"fit"
			] }],
			"max-w": [{ "max-w": [
				Jb,
				t,
				"none",
				"full",
				"min",
				"max",
				"fit",
				"prose",
				{ screen: [Yb] },
				Yb
			] }],
			h: [{ h: [
				Jb,
				t,
				"auto",
				"min",
				"max",
				"fit",
				"svh",
				"lvh",
				"dvh"
			] }],
			"min-h": [{ "min-h": [
				Jb,
				t,
				"min",
				"max",
				"fit",
				"svh",
				"lvh",
				"dvh"
			] }],
			"max-h": [{ "max-h": [
				Jb,
				t,
				"min",
				"max",
				"fit",
				"svh",
				"lvh",
				"dvh"
			] }],
			size: [{ size: [
				Jb,
				t,
				"auto",
				"min",
				"max",
				"fit"
			] }],
			"font-size": [{ text: [
				"base",
				Yb,
				Ub
			] }],
			"font-smoothing": ["antialiased", "subpixel-antialiased"],
			"font-style": ["italic", "not-italic"],
			"font-weight": [{ font: [
				"thin",
				"extralight",
				"light",
				"normal",
				"medium",
				"semibold",
				"bold",
				"extrabold",
				"black",
				Gb
			] }],
			"font-family": [{ font: [nx] }],
			"fvn-normal": ["normal-nums"],
			"fvn-ordinal": ["ordinal"],
			"fvn-slashed-zero": ["slashed-zero"],
			"fvn-figure": ["lining-nums", "oldstyle-nums"],
			"fvn-spacing": ["proportional-nums", "tabular-nums"],
			"fvn-fraction": ["diagonal-fractions", "stacked-fractions"],
			tracking: [{ tracking: [
				"tighter",
				"tight",
				"normal",
				"wide",
				"wider",
				"widest",
				Jb
			] }],
			"line-clamp": [{ "line-clamp": [
				"none",
				Wb,
				Gb
			] }],
			leading: [{ leading: [
				"none",
				"tight",
				"snug",
				"normal",
				"relaxed",
				"loose",
				Hb,
				Jb
			] }],
			"list-image": [{ "list-image": ["none", Jb] }],
			"list-style-type": [{ list: [
				"none",
				"disc",
				"decimal",
				Jb
			] }],
			"list-style-position": [{ list: ["inside", "outside"] }],
			"placeholder-color": [{ placeholder: [e] }],
			"placeholder-opacity": [{ "placeholder-opacity": [_] }],
			"text-alignment": [{ text: [
				"left",
				"center",
				"right",
				"justify",
				"start",
				"end"
			] }],
			"text-color": [{ text: [e] }],
			"text-opacity": [{ "text-opacity": [_] }],
			"text-decoration": [
				"underline",
				"overline",
				"line-through",
				"no-underline"
			],
			"text-decoration-style": [{ decoration: [...ee(), "wavy"] }],
			"text-decoration-thickness": [{ decoration: [
				"auto",
				"from-font",
				Hb,
				Ub
			] }],
			"underline-offset": [{ "underline-offset": [
				"auto",
				Hb,
				Jb
			] }],
			"text-decoration-color": [{ decoration: [e] }],
			"text-transform": [
				"uppercase",
				"lowercase",
				"capitalize",
				"normal-case"
			],
			"text-overflow": [
				"truncate",
				"text-ellipsis",
				"text-clip"
			],
			"text-wrap": [{ text: [
				"wrap",
				"nowrap",
				"balance",
				"pretty"
			] }],
			indent: [{ indent: O() }],
			"vertical-align": [{ align: [
				"baseline",
				"top",
				"middle",
				"bottom",
				"text-top",
				"text-bottom",
				"sub",
				"super",
				Jb
			] }],
			whitespace: [{ whitespace: [
				"normal",
				"nowrap",
				"pre",
				"pre-line",
				"pre-wrap",
				"break-spaces"
			] }],
			break: [{ break: [
				"normal",
				"words",
				"all",
				"keep"
			] }],
			hyphens: [{ hyphens: [
				"none",
				"manual",
				"auto"
			] }],
			content: [{ content: ["none", Jb] }],
			"bg-attachment": [{ bg: [
				"fixed",
				"local",
				"scroll"
			] }],
			"bg-clip": [{ "bg-clip": [
				"border",
				"padding",
				"content",
				"text"
			] }],
			"bg-opacity": [{ "bg-opacity": [_] }],
			"bg-origin": [{ "bg-origin": [
				"border",
				"padding",
				"content"
			] }],
			"bg-position": [{ bg: [...j(), Qb] }],
			"bg-repeat": [{ bg: ["no-repeat", { repeat: [
				"",
				"x",
				"y",
				"round",
				"space"
			] }] }],
			"bg-size": [{ bg: [
				"auto",
				"cover",
				"contain",
				Zb
			] }],
			"bg-image": [{ bg: [
				"none",
				{ "gradient-to": [
					"t",
					"tr",
					"r",
					"br",
					"b",
					"bl",
					"l",
					"tl"
				] },
				ex
			] }],
			"bg-color": [{ bg: [e] }],
			"gradient-from-pos": [{ from: [m] }],
			"gradient-via-pos": [{ via: [m] }],
			"gradient-to-pos": [{ to: [m] }],
			"gradient-from": [{ from: [p] }],
			"gradient-via": [{ via: [p] }],
			"gradient-to": [{ to: [p] }],
			rounded: [{ rounded: [a] }],
			"rounded-s": [{ "rounded-s": [a] }],
			"rounded-e": [{ "rounded-e": [a] }],
			"rounded-t": [{ "rounded-t": [a] }],
			"rounded-r": [{ "rounded-r": [a] }],
			"rounded-b": [{ "rounded-b": [a] }],
			"rounded-l": [{ "rounded-l": [a] }],
			"rounded-ss": [{ "rounded-ss": [a] }],
			"rounded-se": [{ "rounded-se": [a] }],
			"rounded-ee": [{ "rounded-ee": [a] }],
			"rounded-es": [{ "rounded-es": [a] }],
			"rounded-tl": [{ "rounded-tl": [a] }],
			"rounded-tr": [{ "rounded-tr": [a] }],
			"rounded-br": [{ "rounded-br": [a] }],
			"rounded-bl": [{ "rounded-bl": [a] }],
			"border-w": [{ border: [s] }],
			"border-w-x": [{ "border-x": [s] }],
			"border-w-y": [{ "border-y": [s] }],
			"border-w-s": [{ "border-s": [s] }],
			"border-w-e": [{ "border-e": [s] }],
			"border-w-t": [{ "border-t": [s] }],
			"border-w-r": [{ "border-r": [s] }],
			"border-w-b": [{ "border-b": [s] }],
			"border-w-l": [{ "border-l": [s] }],
			"border-opacity": [{ "border-opacity": [_] }],
			"border-style": [{ border: [...ee(), "hidden"] }],
			"divide-x": [{ "divide-x": [s] }],
			"divide-x-reverse": ["divide-x-reverse"],
			"divide-y": [{ "divide-y": [s] }],
			"divide-y-reverse": ["divide-y-reverse"],
			"divide-opacity": [{ "divide-opacity": [_] }],
			"divide-style": [{ divide: ee() }],
			"border-color": [{ border: [i] }],
			"border-color-x": [{ "border-x": [i] }],
			"border-color-y": [{ "border-y": [i] }],
			"border-color-s": [{ "border-s": [i] }],
			"border-color-e": [{ "border-e": [i] }],
			"border-color-t": [{ "border-t": [i] }],
			"border-color-r": [{ "border-r": [i] }],
			"border-color-b": [{ "border-b": [i] }],
			"border-color-l": [{ "border-l": [i] }],
			"divide-color": [{ divide: [i] }],
			"outline-style": [{ outline: ["", ...ee()] }],
			"outline-offset": [{ "outline-offset": [Hb, Jb] }],
			"outline-w": [{ outline: [Hb, Ub] }],
			"outline-color": [{ outline: [e] }],
			"ring-w": [{ ring: k() }],
			"ring-w-inset": ["ring-inset"],
			"ring-color": [{ ring: [e] }],
			"ring-opacity": [{ "ring-opacity": [_] }],
			"ring-offset-w": [{ "ring-offset": [Hb, Ub] }],
			"ring-offset-color": [{ "ring-offset": [e] }],
			shadow: [{ shadow: [
				"",
				"inner",
				"none",
				Yb,
				tx
			] }],
			"shadow-color": [{ shadow: [nx] }],
			opacity: [{ opacity: [_] }],
			"mix-blend": [{ "mix-blend": [
				...te(),
				"plus-lighter",
				"plus-darker"
			] }],
			"bg-blend": [{ "bg-blend": te() }],
			filter: [{ filter: ["", "none"] }],
			blur: [{ blur: [n] }],
			brightness: [{ brightness: [r] }],
			contrast: [{ contrast: [c] }],
			"drop-shadow": [{ "drop-shadow": [
				"",
				"none",
				Yb,
				Jb
			] }],
			grayscale: [{ grayscale: [l] }],
			"hue-rotate": [{ "hue-rotate": [u] }],
			invert: [{ invert: [d] }],
			saturate: [{ saturate: [y] }],
			sepia: [{ sepia: [x] }],
			"backdrop-filter": [{ "backdrop-filter": ["", "none"] }],
			"backdrop-blur": [{ "backdrop-blur": [n] }],
			"backdrop-brightness": [{ "backdrop-brightness": [r] }],
			"backdrop-contrast": [{ "backdrop-contrast": [c] }],
			"backdrop-grayscale": [{ "backdrop-grayscale": [l] }],
			"backdrop-hue-rotate": [{ "backdrop-hue-rotate": [u] }],
			"backdrop-invert": [{ "backdrop-invert": [d] }],
			"backdrop-opacity": [{ "backdrop-opacity": [_] }],
			"backdrop-saturate": [{ "backdrop-saturate": [y] }],
			"backdrop-sepia": [{ "backdrop-sepia": [x] }],
			"border-collapse": [{ border: ["collapse", "separate"] }],
			"border-spacing": [{ "border-spacing": [o] }],
			"border-spacing-x": [{ "border-spacing-x": [o] }],
			"border-spacing-y": [{ "border-spacing-y": [o] }],
			"table-layout": [{ table: ["auto", "fixed"] }],
			caption: [{ caption: ["top", "bottom"] }],
			transition: [{ transition: [
				"none",
				"all",
				"",
				"colors",
				"opacity",
				"shadow",
				"transform",
				Jb
			] }],
			duration: [{ duration: ie() }],
			ease: [{ ease: [
				"linear",
				"in",
				"out",
				"in-out",
				Jb
			] }],
			delay: [{ delay: ie() }],
			animate: [{ animate: [
				"none",
				"spin",
				"ping",
				"pulse",
				"bounce",
				Jb
			] }],
			transform: [{ transform: [
				"",
				"gpu",
				"none"
			] }],
			scale: [{ scale: [b] }],
			"scale-x": [{ "scale-x": [b] }],
			"scale-y": [{ "scale-y": [b] }],
			rotate: [{ rotate: [Kb, Jb] }],
			"translate-x": [{ "translate-x": [w] }],
			"translate-y": [{ "translate-y": [w] }],
			"skew-x": [{ "skew-x": [S] }],
			"skew-y": [{ "skew-y": [S] }],
			"transform-origin": [{ origin: [
				"center",
				"top",
				"top-right",
				"right",
				"bottom-right",
				"bottom",
				"bottom-left",
				"left",
				"top-left",
				Jb
			] }],
			accent: [{ accent: ["auto", e] }],
			appearance: [{ appearance: ["none", "auto"] }],
			cursor: [{ cursor: [
				"auto",
				"default",
				"pointer",
				"wait",
				"text",
				"move",
				"help",
				"not-allowed",
				"none",
				"context-menu",
				"progress",
				"cell",
				"crosshair",
				"vertical-text",
				"alias",
				"copy",
				"no-drop",
				"grab",
				"grabbing",
				"all-scroll",
				"col-resize",
				"row-resize",
				"n-resize",
				"e-resize",
				"s-resize",
				"w-resize",
				"ne-resize",
				"nw-resize",
				"se-resize",
				"sw-resize",
				"ew-resize",
				"ns-resize",
				"nesw-resize",
				"nwse-resize",
				"zoom-in",
				"zoom-out",
				Jb
			] }],
			"caret-color": [{ caret: [e] }],
			"pointer-events": [{ "pointer-events": ["none", "auto"] }],
			resize: [{ resize: [
				"none",
				"y",
				"x",
				""
			] }],
			"scroll-behavior": [{ scroll: ["auto", "smooth"] }],
			"scroll-m": [{ "scroll-m": O() }],
			"scroll-mx": [{ "scroll-mx": O() }],
			"scroll-my": [{ "scroll-my": O() }],
			"scroll-ms": [{ "scroll-ms": O() }],
			"scroll-me": [{ "scroll-me": O() }],
			"scroll-mt": [{ "scroll-mt": O() }],
			"scroll-mr": [{ "scroll-mr": O() }],
			"scroll-mb": [{ "scroll-mb": O() }],
			"scroll-ml": [{ "scroll-ml": O() }],
			"scroll-p": [{ "scroll-p": O() }],
			"scroll-px": [{ "scroll-px": O() }],
			"scroll-py": [{ "scroll-py": O() }],
			"scroll-ps": [{ "scroll-ps": O() }],
			"scroll-pe": [{ "scroll-pe": O() }],
			"scroll-pt": [{ "scroll-pt": O() }],
			"scroll-pr": [{ "scroll-pr": O() }],
			"scroll-pb": [{ "scroll-pb": O() }],
			"scroll-pl": [{ "scroll-pl": O() }],
			"snap-align": [{ snap: [
				"start",
				"end",
				"center",
				"align-none"
			] }],
			"snap-stop": [{ snap: ["normal", "always"] }],
			"snap-type": [{ snap: [
				"none",
				"x",
				"y",
				"both"
			] }],
			"snap-strictness": [{ snap: ["mandatory", "proximity"] }],
			touch: [{ touch: [
				"auto",
				"none",
				"manipulation"
			] }],
			"touch-x": [{ "touch-pan": [
				"x",
				"left",
				"right"
			] }],
			"touch-y": [{ "touch-pan": [
				"y",
				"up",
				"down"
			] }],
			"touch-pz": ["touch-pinch-zoom"],
			select: [{ select: [
				"none",
				"text",
				"all",
				"auto"
			] }],
			"will-change": [{ "will-change": [
				"auto",
				"scroll",
				"contents",
				"transform",
				Jb
			] }],
			fill: [{ fill: [e, "none"] }],
			"stroke-w": [{ stroke: [
				Hb,
				Ub,
				Gb
			] }],
			stroke: [{ stroke: [e, "none"] }],
			sr: ["sr-only", "not-sr-only"],
			"forced-color-adjust": [{ "forced-color-adjust": ["auto", "none"] }]
		},
		conflictingClassGroups: {
			overflow: ["overflow-x", "overflow-y"],
			overscroll: ["overscroll-x", "overscroll-y"],
			inset: [
				"inset-x",
				"inset-y",
				"start",
				"end",
				"top",
				"right",
				"bottom",
				"left"
			],
			"inset-x": ["right", "left"],
			"inset-y": ["top", "bottom"],
			flex: [
				"basis",
				"grow",
				"shrink"
			],
			gap: ["gap-x", "gap-y"],
			p: [
				"px",
				"py",
				"ps",
				"pe",
				"pt",
				"pr",
				"pb",
				"pl"
			],
			px: ["pr", "pl"],
			py: ["pt", "pb"],
			m: [
				"mx",
				"my",
				"ms",
				"me",
				"mt",
				"mr",
				"mb",
				"ml"
			],
			mx: ["mr", "ml"],
			my: ["mt", "mb"],
			size: ["w", "h"],
			"font-size": ["leading"],
			"fvn-normal": [
				"fvn-ordinal",
				"fvn-slashed-zero",
				"fvn-figure",
				"fvn-spacing",
				"fvn-fraction"
			],
			"fvn-ordinal": ["fvn-normal"],
			"fvn-slashed-zero": ["fvn-normal"],
			"fvn-figure": ["fvn-normal"],
			"fvn-spacing": ["fvn-normal"],
			"fvn-fraction": ["fvn-normal"],
			"line-clamp": ["display", "overflow"],
			rounded: [
				"rounded-s",
				"rounded-e",
				"rounded-t",
				"rounded-r",
				"rounded-b",
				"rounded-l",
				"rounded-ss",
				"rounded-se",
				"rounded-ee",
				"rounded-es",
				"rounded-tl",
				"rounded-tr",
				"rounded-br",
				"rounded-bl"
			],
			"rounded-s": ["rounded-ss", "rounded-es"],
			"rounded-e": ["rounded-se", "rounded-ee"],
			"rounded-t": ["rounded-tl", "rounded-tr"],
			"rounded-r": ["rounded-tr", "rounded-br"],
			"rounded-b": ["rounded-br", "rounded-bl"],
			"rounded-l": ["rounded-tl", "rounded-bl"],
			"border-spacing": ["border-spacing-x", "border-spacing-y"],
			"border-w": [
				"border-w-s",
				"border-w-e",
				"border-w-t",
				"border-w-r",
				"border-w-b",
				"border-w-l"
			],
			"border-w-x": ["border-w-r", "border-w-l"],
			"border-w-y": ["border-w-t", "border-w-b"],
			"border-color": [
				"border-color-s",
				"border-color-e",
				"border-color-t",
				"border-color-r",
				"border-color-b",
				"border-color-l"
			],
			"border-color-x": ["border-color-r", "border-color-l"],
			"border-color-y": ["border-color-t", "border-color-b"],
			"scroll-m": [
				"scroll-mx",
				"scroll-my",
				"scroll-ms",
				"scroll-me",
				"scroll-mt",
				"scroll-mr",
				"scroll-mb",
				"scroll-ml"
			],
			"scroll-mx": ["scroll-mr", "scroll-ml"],
			"scroll-my": ["scroll-mt", "scroll-mb"],
			"scroll-p": [
				"scroll-px",
				"scroll-py",
				"scroll-ps",
				"scroll-pe",
				"scroll-pt",
				"scroll-pr",
				"scroll-pb",
				"scroll-pl"
			],
			"scroll-px": ["scroll-pr", "scroll-pl"],
			"scroll-py": ["scroll-pt", "scroll-pb"],
			touch: [
				"touch-x",
				"touch-y",
				"touch-pz"
			],
			"touch-x": ["touch"],
			"touch-y": ["touch"],
			"touch-pz": ["touch"]
		},
		conflictingClassGroupModifiers: { "font-size": ["leading"] }
	};
}, lx = (e, { cacheSize: t, prefix: n, separator: r, experimentalParseClassName: i, extend: a = {}, override: o = {} }) => {
	ux(e, "cacheSize", t), ux(e, "prefix", n), ux(e, "separator", r), ux(e, "experimentalParseClassName", i);
	for (let t in o) dx(e[t], o[t]);
	for (let t in a) fx(e[t], a[t]);
	return e;
}, ux = (e, t, n) => {
	n !== void 0 && (e[t] = n);
}, dx = (e, t) => {
	if (t) for (let n in t) ux(e, n, t[n]);
}, fx = (e, t) => {
	if (t) for (let n in t) {
		let r = t[n];
		r !== void 0 && (e[n] = (e[n] || []).concat(r));
	}
}, px = ((e, ...t) => typeof e == "function" ? Mb(cx, e, ...t) : Mb(() => lx(cx(), e), ...t))({ extend: { classGroups: {
	"font-size": ["text-xxs", "text-xxxs"],
	"max-h": [{ "max-h": ["none"] }]
} } });
function mx(...e) {
	return px($y(e));
}
// node_modules/.pnpm/fuse.js@7.0.0/node_modules/fuse.js/dist/fuse.mjs
function hx(e) {
	return Array.isArray ? Array.isArray(e) : Tx(e) === "[object Array]";
}
function gx(e) {
	if (typeof e == "string") return e;
	let t = e + "";
	return t == "0" && 1 / e == -Infinity ? "-0" : t;
}
function _x(e) {
	return e == null ? "" : gx(e);
}
function vx(e) {
	return typeof e == "string";
}
function yx(e) {
	return typeof e == "number";
}
function bx(e) {
	return e === !0 || e === !1 || Sx(e) && Tx(e) == "[object Boolean]";
}
function xx(e) {
	return typeof e == "object";
}
function Sx(e) {
	return xx(e) && e !== null;
}
function Cx(e) {
	return e != null;
}
function wx(e) {
	return !e.trim().length;
}
function Tx(e) {
	return e == null ? e === void 0 ? "[object Undefined]" : "[object Null]" : Object.prototype.toString.call(e);
}
var Ex = "Incorrect 'index' type", Dx = (e) => `Invalid value for key ${e}`, Ox = (e) => `Pattern length exceeds max of ${e}.`, kx = (e) => `Missing ${e} property in key`, Ax = (e) => `Property 'weight' in key '${e}' must be a positive integer`, jx = Object.prototype.hasOwnProperty, Mx = class {
	constructor(e) {
		this._keys = [], this._keyMap = {};
		let t = 0;
		e.forEach((e) => {
			let n = Nx(e);
			this._keys.push(n), this._keyMap[n.id] = n, t += n.weight;
		}), this._keys.forEach((e) => {
			e.weight /= t;
		});
	}
	get(e) {
		return this._keyMap[e];
	}
	keys() {
		return this._keys;
	}
	toJSON() {
		return JSON.stringify(this._keys);
	}
};
function Nx(e) {
	let t = null, n = null, r = null, i = 1, a = null;
	if (vx(e) || hx(e)) r = e, t = Px(e), n = Fx(e);
	else {
		if (!jx.call(e, "name")) throw Error(kx("name"));
		let o = e.name;
		if (r = o, jx.call(e, "weight") && (i = e.weight, i <= 0)) throw Error(Ax(o));
		t = Px(o), n = Fx(o), a = e.getFn;
	}
	return {
		path: t,
		id: n,
		weight: i,
		src: r,
		getFn: a
	};
}
function Px(e) {
	return hx(e) ? e : e.split(".");
}
function Fx(e) {
	return hx(e) ? e.join(".") : e;
}
function Ix(e, t) {
	let n = [], r = !1, i = (e, t, a) => {
		if (Cx(e)) {
			if (!t[a]) n.push(e);
			else {
				let o = e[t[a]];
				if (!Cx(o)) return;
				if (a === t.length - 1 && (vx(o) || yx(o) || bx(o))) n.push(_x(o));
				else if (hx(o)) {
					r = !0;
					for (let e = 0, n = o.length; e < n; e += 1) i(o[e], t, a + 1);
				} else t.length && i(o, t, a + 1);
			}
		}
	};
	return i(e, vx(t) ? t.split(".") : t, 0), r ? n : n[0];
}
var Lx = {
	includeMatches: !1,
	findAllMatches: !1,
	minMatchCharLength: 1
}, Rx = {
	isCaseSensitive: !1,
	includeScore: !1,
	keys: [],
	shouldSort: !0,
	sortFn: (e, t) => e.score === t.score ? e.idx < t.idx ? -1 : 1 : e.score < t.score ? -1 : 1
}, zx = {
	location: 0,
	threshold: .6,
	distance: 100
}, Bx = {
	useExtendedSearch: !1,
	getFn: Ix,
	ignoreLocation: !1,
	ignoreFieldNorm: !1,
	fieldNormWeight: 1
}, Vx = {
	...Rx,
	...Lx,
	...zx,
	...Bx
}, Hx = /[^ ]+/g;
function Ux(e = 1, t = 3) {
	let n = /* @__PURE__ */ new Map(), r = 10 ** t;
	return {
		get(t) {
			let i = t.match(Hx).length;
			if (n.has(i)) return n.get(i);
			let a = 1 / i ** (.5 * e), o = parseFloat(Math.round(a * r) / r);
			return n.set(i, o), o;
		},
		clear() {
			n.clear();
		}
	};
}
var Wx = class {
	constructor({ getFn: e = Vx.getFn, fieldNormWeight: t = Vx.fieldNormWeight } = {}) {
		this.norm = Ux(t, 3), this.getFn = e, this.isCreated = !1, this.setIndexRecords();
	}
	setSources(e = []) {
		this.docs = e;
	}
	setIndexRecords(e = []) {
		this.records = e;
	}
	setKeys(e = []) {
		this.keys = e, this._keysMap = {}, e.forEach((e, t) => {
			this._keysMap[e.id] = t;
		});
	}
	create() {
		!this.isCreated && this.docs.length && (this.isCreated = !0, vx(this.docs[0]) ? this.docs.forEach((e, t) => {
			this._addString(e, t);
		}) : this.docs.forEach((e, t) => {
			this._addObject(e, t);
		}), this.norm.clear());
	}
	add(e) {
		let t = this.size();
		vx(e) ? this._addString(e, t) : this._addObject(e, t);
	}
	removeAt(e) {
		this.records.splice(e, 1);
		for (let t = e, n = this.size(); t < n; t += 1) --this.records[t].i;
	}
	getValueForItemAtKeyId(e, t) {
		return e[this._keysMap[t]];
	}
	size() {
		return this.records.length;
	}
	_addString(e, t) {
		if (!Cx(e) || wx(e)) return;
		let n = {
			v: e,
			i: t,
			n: this.norm.get(e)
		};
		this.records.push(n);
	}
	_addObject(e, t) {
		let n = {
			i: t,
			$: {}
		};
		this.keys.forEach((t, r) => {
			let i = t.getFn ? t.getFn(e) : this.getFn(e, t.path);
			if (Cx(i)) {
				if (hx(i)) {
					let e = [], t = [{
						nestedArrIndex: -1,
						value: i
					}];
					for (; t.length;) {
						let { nestedArrIndex: n, value: r } = t.pop();
						if (Cx(r)) {
							if (vx(r) && !wx(r)) {
								let t = {
									v: r,
									i: n,
									n: this.norm.get(r)
								};
								e.push(t);
							} else hx(r) && r.forEach((e, n) => {
								t.push({
									nestedArrIndex: n,
									value: e
								});
							});
						}
					}
					n.$[r] = e;
				} else if (vx(i) && !wx(i)) {
					let e = {
						v: i,
						n: this.norm.get(i)
					};
					n.$[r] = e;
				}
			}
		}), this.records.push(n);
	}
	toJSON() {
		return {
			keys: this.keys,
			records: this.records
		};
	}
};
function Gx(e, t, { getFn: n = Vx.getFn, fieldNormWeight: r = Vx.fieldNormWeight } = {}) {
	let i = new Wx({
		getFn: n,
		fieldNormWeight: r
	});
	return i.setKeys(e.map(Nx)), i.setSources(t), i.create(), i;
}
function Kx(e, { getFn: t = Vx.getFn, fieldNormWeight: n = Vx.fieldNormWeight } = {}) {
	let { keys: r, records: i } = e, a = new Wx({
		getFn: t,
		fieldNormWeight: n
	});
	return a.setKeys(r), a.setIndexRecords(i), a;
}
function qx(e, { errors: t = 0, currentLocation: n = 0, expectedLocation: r = 0, distance: i = Vx.distance, ignoreLocation: a = Vx.ignoreLocation } = {}) {
	let o = t / e.length;
	if (a) return o;
	let s = Math.abs(r - n);
	return i ? o + s / i : s ? 1 : o;
}
function Jx(e = [], t = Vx.minMatchCharLength) {
	let n = [], r = -1, i = -1, a = 0;
	for (let o = e.length; a < o; a += 1) {
		let o = e[a];
		o && r === -1 ? r = a : !o && r !== -1 && (i = a - 1, i - r + 1 >= t && n.push([r, i]), r = -1);
	}
	return e[a - 1] && a - r >= t && n.push([r, a - 1]), n;
}
var Yx = 32;
function Xx(e, t, n, { location: r = Vx.location, distance: i = Vx.distance, threshold: a = Vx.threshold, findAllMatches: o = Vx.findAllMatches, minMatchCharLength: s = Vx.minMatchCharLength, includeMatches: c = Vx.includeMatches, ignoreLocation: l = Vx.ignoreLocation } = {}) {
	if (t.length > Yx) throw Error(Ox(Yx));
	let u = t.length, d = e.length, f = Math.max(0, Math.min(r, d)), p = a, m = f, h = s > 1 || c, g = h ? Array(d) : [], _;
	for (; (_ = e.indexOf(t, m)) > -1;) {
		let e = qx(t, {
			currentLocation: _,
			expectedLocation: f,
			distance: i,
			ignoreLocation: l
		});
		if (p = Math.min(e, p), m = _ + u, h) {
			let e = 0;
			for (; e < u;) g[_ + e] = 1, e += 1;
		}
	}
	m = -1;
	let v = [], y = 1, b = u + d, x = 1 << u - 1;
	for (let r = 0; r < u; r += 1) {
		let a = 0, s = b;
		for (; a < s;) qx(t, {
			errors: r,
			currentLocation: f + s,
			expectedLocation: f,
			distance: i,
			ignoreLocation: l
		}) <= p ? a = s : b = s, s = Math.floor((b - a) / 2 + a);
		b = s;
		let c = Math.max(1, f - s + 1), _ = o ? d : Math.min(f + s, d) + u, S = Array(_ + 2);
		S[_ + 1] = (1 << r) - 1;
		for (let a = _; a >= c; --a) {
			let o = a - 1, s = n[e.charAt(o)];
			if (h && (g[o] = +!!s), S[a] = (S[a + 1] << 1 | 1) & s, r && (S[a] |= (v[a + 1] | v[a]) << 1 | 1 | v[a + 1]), S[a] & x && (y = qx(t, {
				errors: r,
				currentLocation: o,
				expectedLocation: f,
				distance: i,
				ignoreLocation: l
			}), y <= p)) {
				if (p = y, m = o, m <= f) break;
				c = Math.max(1, 2 * f - m);
			}
		}
		if (qx(t, {
			errors: r + 1,
			currentLocation: f,
			expectedLocation: f,
			distance: i,
			ignoreLocation: l
		}) > p) break;
		v = S;
	}
	let S = {
		isMatch: m >= 0,
		score: Math.max(.001, y)
	};
	if (h) {
		let e = Jx(g, s);
		e.length ? c && (S.indices = e) : S.isMatch = !1;
	}
	return S;
}
function Zx(e) {
	let t = {};
	for (let n = 0, r = e.length; n < r; n += 1) {
		let i = e.charAt(n);
		t[i] = (t[i] || 0) | 1 << r - n - 1;
	}
	return t;
}
var Qx = class {
	constructor(e, { location: t = Vx.location, threshold: n = Vx.threshold, distance: r = Vx.distance, includeMatches: i = Vx.includeMatches, findAllMatches: a = Vx.findAllMatches, minMatchCharLength: o = Vx.minMatchCharLength, isCaseSensitive: s = Vx.isCaseSensitive, ignoreLocation: c = Vx.ignoreLocation } = {}) {
		if (this.options = {
			location: t,
			threshold: n,
			distance: r,
			includeMatches: i,
			findAllMatches: a,
			minMatchCharLength: o,
			isCaseSensitive: s,
			ignoreLocation: c
		}, this.pattern = s ? e : e.toLowerCase(), this.chunks = [], !this.pattern.length) return;
		let l = (e, t) => {
			this.chunks.push({
				pattern: e,
				alphabet: Zx(e),
				startIndex: t
			});
		}, u = this.pattern.length;
		if (u > Yx) {
			let e = 0, t = u % Yx, n = u - t;
			for (; e < n;) l(this.pattern.substr(e, Yx), e), e += Yx;
			if (t) {
				let e = u - Yx;
				l(this.pattern.substr(e), e);
			}
		} else l(this.pattern, 0);
	}
	searchIn(e) {
		let { isCaseSensitive: t, includeMatches: n } = this.options;
		if (t || (e = e.toLowerCase()), this.pattern === e) {
			let t = {
				isMatch: !0,
				score: 0
			};
			return n && (t.indices = [[0, e.length - 1]]), t;
		}
		let { location: r, distance: i, threshold: a, findAllMatches: o, minMatchCharLength: s, ignoreLocation: c } = this.options, l = [], u = 0, d = !1;
		this.chunks.forEach(({ pattern: t, alphabet: f, startIndex: p }) => {
			let { isMatch: m, score: h, indices: g } = Xx(e, t, f, {
				location: r + p,
				distance: i,
				threshold: a,
				findAllMatches: o,
				minMatchCharLength: s,
				includeMatches: n,
				ignoreLocation: c
			});
			m && (d = !0), u += h, m && g && (l = [...l, ...g]);
		});
		let f = {
			isMatch: d,
			score: d ? u / this.chunks.length : 1
		};
		return d && n && (f.indices = l), f;
	}
}, $x = class {
	constructor(e) {
		this.pattern = e;
	}
	static isMultiMatch(e) {
		return eS(e, this.multiRegex);
	}
	static isSingleMatch(e) {
		return eS(e, this.singleRegex);
	}
	search() {}
};
function eS(e, t) {
	let n = e.match(t);
	return n ? n[1] : null;
}
var tS = class extends $x {
	constructor(e) {
		super(e);
	}
	static get type() {
		return "exact";
	}
	static get multiRegex() {
		return /^="(.*)"$/;
	}
	static get singleRegex() {
		return /^=(.*)$/;
	}
	search(e) {
		let t = e === this.pattern;
		return {
			isMatch: t,
			score: +!t,
			indices: [0, this.pattern.length - 1]
		};
	}
}, nS = class extends $x {
	constructor(e) {
		super(e);
	}
	static get type() {
		return "inverse-exact";
	}
	static get multiRegex() {
		return /^!"(.*)"$/;
	}
	static get singleRegex() {
		return /^!(.*)$/;
	}
	search(e) {
		let t = e.indexOf(this.pattern) === -1;
		return {
			isMatch: t,
			score: +!t,
			indices: [0, e.length - 1]
		};
	}
}, rS = class extends $x {
	constructor(e) {
		super(e);
	}
	static get type() {
		return "prefix-exact";
	}
	static get multiRegex() {
		return /^\^"(.*)"$/;
	}
	static get singleRegex() {
		return /^\^(.*)$/;
	}
	search(e) {
		let t = e.startsWith(this.pattern);
		return {
			isMatch: t,
			score: +!t,
			indices: [0, this.pattern.length - 1]
		};
	}
}, iS = class extends $x {
	constructor(e) {
		super(e);
	}
	static get type() {
		return "inverse-prefix-exact";
	}
	static get multiRegex() {
		return /^!\^"(.*)"$/;
	}
	static get singleRegex() {
		return /^!\^(.*)$/;
	}
	search(e) {
		let t = !e.startsWith(this.pattern);
		return {
			isMatch: t,
			score: +!t,
			indices: [0, e.length - 1]
		};
	}
}, aS = class extends $x {
	constructor(e) {
		super(e);
	}
	static get type() {
		return "suffix-exact";
	}
	static get multiRegex() {
		return /^"(.*)"\$$/;
	}
	static get singleRegex() {
		return /^(.*)\$$/;
	}
	search(e) {
		let t = e.endsWith(this.pattern);
		return {
			isMatch: t,
			score: +!t,
			indices: [e.length - this.pattern.length, e.length - 1]
		};
	}
}, oS = class extends $x {
	constructor(e) {
		super(e);
	}
	static get type() {
		return "inverse-suffix-exact";
	}
	static get multiRegex() {
		return /^!"(.*)"\$$/;
	}
	static get singleRegex() {
		return /^!(.*)\$$/;
	}
	search(e) {
		let t = !e.endsWith(this.pattern);
		return {
			isMatch: t,
			score: +!t,
			indices: [0, e.length - 1]
		};
	}
}, sS = class extends $x {
	constructor(e, { location: t = Vx.location, threshold: n = Vx.threshold, distance: r = Vx.distance, includeMatches: i = Vx.includeMatches, findAllMatches: a = Vx.findAllMatches, minMatchCharLength: o = Vx.minMatchCharLength, isCaseSensitive: s = Vx.isCaseSensitive, ignoreLocation: c = Vx.ignoreLocation } = {}) {
		super(e), this._bitapSearch = new Qx(e, {
			location: t,
			threshold: n,
			distance: r,
			includeMatches: i,
			findAllMatches: a,
			minMatchCharLength: o,
			isCaseSensitive: s,
			ignoreLocation: c
		});
	}
	static get type() {
		return "fuzzy";
	}
	static get multiRegex() {
		return /^"(.*)"$/;
	}
	static get singleRegex() {
		return /^(.*)$/;
	}
	search(e) {
		return this._bitapSearch.searchIn(e);
	}
}, cS = class extends $x {
	constructor(e) {
		super(e);
	}
	static get type() {
		return "include";
	}
	static get multiRegex() {
		return /^'"(.*)"$/;
	}
	static get singleRegex() {
		return /^'(.*)$/;
	}
	search(e) {
		let t = 0, n, r = [], i = this.pattern.length;
		for (; (n = e.indexOf(this.pattern, t)) > -1;) t = n + i, r.push([n, t - 1]);
		let a = !!r.length;
		return {
			isMatch: a,
			score: +!a,
			indices: r
		};
	}
}, lS = [
	tS,
	cS,
	rS,
	iS,
	oS,
	aS,
	nS,
	sS
], uS = lS.length, dS = / +(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)/, fS = "|";
function pS(e, t = {}) {
	return e.split(fS).map((e) => {
		let n = e.trim().split(dS).filter((e) => e && !!e.trim()), r = [];
		for (let e = 0, i = n.length; e < i; e += 1) {
			let i = n[e], a = !1, o = -1;
			for (; !a && ++o < uS;) {
				let e = lS[o], n = e.isMultiMatch(i);
				n && (r.push(new e(n, t)), a = !0);
			}
			if (!a) for (o = -1; ++o < uS;) {
				let e = lS[o], n = e.isSingleMatch(i);
				if (n) {
					r.push(new e(n, t));
					break;
				}
			}
		}
		return r;
	});
}
var mS = /* @__PURE__ */ new Set([sS.type, cS.type]), hS = class {
	constructor(e, { isCaseSensitive: t = Vx.isCaseSensitive, includeMatches: n = Vx.includeMatches, minMatchCharLength: r = Vx.minMatchCharLength, ignoreLocation: i = Vx.ignoreLocation, findAllMatches: a = Vx.findAllMatches, location: o = Vx.location, threshold: s = Vx.threshold, distance: c = Vx.distance } = {}) {
		this.query = null, this.options = {
			isCaseSensitive: t,
			includeMatches: n,
			minMatchCharLength: r,
			findAllMatches: a,
			ignoreLocation: i,
			location: o,
			threshold: s,
			distance: c
		}, this.pattern = t ? e : e.toLowerCase(), this.query = pS(this.pattern, this.options);
	}
	static condition(e, t) {
		return t.useExtendedSearch;
	}
	searchIn(e) {
		let t = this.query;
		if (!t) return {
			isMatch: !1,
			score: 1
		};
		let { includeMatches: n, isCaseSensitive: r } = this.options;
		e = r ? e : e.toLowerCase();
		let i = 0, a = [], o = 0;
		for (let r = 0, s = t.length; r < s; r += 1) {
			let s = t[r];
			a.length = 0, i = 0;
			for (let t = 0, r = s.length; t < r; t += 1) {
				let r = s[t], { isMatch: c, indices: l, score: u } = r.search(e);
				if (c) {
					if (i += 1, o += u, n) {
						let e = r.constructor.type;
						mS.has(e) ? a = [...a, ...l] : a.push(l);
					}
				} else {
					o = 0, i = 0, a.length = 0;
					break;
				}
			}
			if (i) {
				let e = {
					isMatch: !0,
					score: o / i
				};
				return n && (e.indices = a), e;
			}
		}
		return {
			isMatch: !1,
			score: 1
		};
	}
}, gS = [];
function _S(...e) {
	gS.push(...e);
}
function vS(e, t) {
	for (let n = 0, r = gS.length; n < r; n += 1) {
		let r = gS[n];
		if (r.condition(e, t)) return new r(e, t);
	}
	return new Qx(e, t);
}
var yS = {
	AND: "$and",
	OR: "$or"
}, bS = {
	PATH: "$path",
	PATTERN: "$val"
}, xS = (e) => !!(e[yS.AND] || e[yS.OR]), SS = (e) => !!e[bS.PATH], CS = (e) => !hx(e) && xx(e) && !xS(e), wS = (e) => ({ [yS.AND]: Object.keys(e).map((t) => ({ [t]: e[t] })) });
function TS(e, t, { auto: n = !0 } = {}) {
	let r = (e) => {
		let i = Object.keys(e), a = SS(e);
		if (!a && i.length > 1 && !xS(e)) return r(wS(e));
		if (CS(e)) {
			let r = a ? e[bS.PATH] : i[0], o = a ? e[bS.PATTERN] : e[r];
			if (!vx(o)) throw Error(Dx(r));
			let s = {
				keyId: Fx(r),
				pattern: o
			};
			return n && (s.searcher = vS(o, t)), s;
		}
		let o = {
			children: [],
			operator: i[0]
		};
		return i.forEach((t) => {
			let n = e[t];
			hx(n) && n.forEach((e) => {
				o.children.push(r(e));
			});
		}), o;
	};
	return xS(e) || (e = wS(e)), r(e);
}
function ES(e, { ignoreFieldNorm: t = Vx.ignoreFieldNorm }) {
	e.forEach((e) => {
		let n = 1;
		e.matches.forEach(({ key: e, norm: r, score: i }) => {
			let a = e ? e.weight : null;
			n *= (i === 0 && a ? 2 ** -52 : i) ** +((a || 1) * (t ? 1 : r));
		}), e.score = n;
	});
}
function DS(e, t) {
	let n = e.matches;
	t.matches = [], Cx(n) && n.forEach((e) => {
		if (!Cx(e.indices) || !e.indices.length) return;
		let { indices: n, value: r } = e, i = {
			indices: n,
			value: r
		};
		e.key && (i.key = e.key.src), e.idx > -1 && (i.refIndex = e.idx), t.matches.push(i);
	});
}
function OS(e, t) {
	t.score = e.score;
}
function kS(e, t, { includeMatches: n = Vx.includeMatches, includeScore: r = Vx.includeScore } = {}) {
	let i = [];
	return n && i.push(DS), r && i.push(OS), e.map((e) => {
		let { idx: n } = e, r = {
			item: t[n],
			refIndex: n
		};
		return i.length && i.forEach((t) => {
			t(e, r);
		}), r;
	});
}
var AS = class {
	constructor(e, t = {}, n) {
		this.options = {
			...Vx,
			...t
		}, this.options.useExtendedSearch, this._keyStore = new Mx(this.options.keys), this.setCollection(e, n);
	}
	setCollection(e, t) {
		if (this._docs = e, t && !(t instanceof Wx)) throw Error(Ex);
		this._myIndex = t || Gx(this.options.keys, this._docs, {
			getFn: this.options.getFn,
			fieldNormWeight: this.options.fieldNormWeight
		});
	}
	add(e) {
		Cx(e) && (this._docs.push(e), this._myIndex.add(e));
	}
	remove(e = () => !1) {
		let t = [];
		for (let n = 0, r = this._docs.length; n < r; n += 1) {
			let i = this._docs[n];
			e(i, n) && (this.removeAt(n), --n, --r, t.push(i));
		}
		return t;
	}
	removeAt(e) {
		this._docs.splice(e, 1), this._myIndex.removeAt(e);
	}
	getIndex() {
		return this._myIndex;
	}
	search(e, { limit: t = -1 } = {}) {
		let { includeMatches: n, includeScore: r, shouldSort: i, sortFn: a, ignoreFieldNorm: o } = this.options, s = vx(e) ? vx(this._docs[0]) ? this._searchStringList(e) : this._searchObjectList(e) : this._searchLogical(e);
		return ES(s, { ignoreFieldNorm: o }), i && s.sort(a), yx(t) && t > -1 && (s = s.slice(0, t)), kS(s, this._docs, {
			includeMatches: n,
			includeScore: r
		});
	}
	_searchStringList(e) {
		let t = vS(e, this.options), { records: n } = this._myIndex, r = [];
		return n.forEach(({ v: e, i: n, n: i }) => {
			if (!Cx(e)) return;
			let { isMatch: a, score: o, indices: s } = t.searchIn(e);
			a && r.push({
				item: e,
				idx: n,
				matches: [{
					score: o,
					value: e,
					norm: i,
					indices: s
				}]
			});
		}), r;
	}
	_searchLogical(e) {
		let t = TS(e, this.options), n = (e, t, r) => {
			if (!e.children) {
				let { keyId: n, searcher: i } = e, a = this._findMatches({
					key: this._keyStore.get(n),
					value: this._myIndex.getValueForItemAtKeyId(t, n),
					searcher: i
				});
				return a && a.length ? [{
					idx: r,
					item: t,
					matches: a
				}] : [];
			}
			let i = [];
			for (let a = 0, o = e.children.length; a < o; a += 1) {
				let o = e.children[a], s = n(o, t, r);
				if (s.length) i.push(...s);
				else if (e.operator === yS.AND) return [];
			}
			return i;
		}, r = this._myIndex.records, i = {}, a = [];
		return r.forEach(({ $: e, i: r }) => {
			if (Cx(e)) {
				let o = n(t, e, r);
				o.length && (i[r] || (i[r] = {
					idx: r,
					item: e,
					matches: []
				}, a.push(i[r])), o.forEach(({ matches: e }) => {
					i[r].matches.push(...e);
				}));
			}
		}), a;
	}
	_searchObjectList(e) {
		let t = vS(e, this.options), { keys: n, records: r } = this._myIndex, i = [];
		return r.forEach(({ $: e, i: r }) => {
			if (!Cx(e)) return;
			let a = [];
			n.forEach((n, r) => {
				a.push(...this._findMatches({
					key: n,
					value: e[r],
					searcher: t
				}));
			}), a.length && i.push({
				idx: r,
				item: e,
				matches: a
			});
		}), i;
	}
	_findMatches({ key: e, value: t, searcher: n }) {
		if (!Cx(t)) return [];
		let r = [];
		if (hx(t)) t.forEach(({ v: t, i, n: a }) => {
			if (!Cx(t)) return;
			let { isMatch: o, score: s, indices: c } = n.searchIn(t);
			o && r.push({
				score: s,
				key: e,
				value: t,
				idx: i,
				norm: a,
				indices: c
			});
		});
		else {
			let { v: i, n: a } = t, { isMatch: o, score: s, indices: c } = n.searchIn(i);
			o && r.push({
				score: s,
				key: e,
				value: i,
				norm: a,
				indices: c
			});
		}
		return r;
	}
};
AS.version = "7.0.0", AS.createIndex = Gx, AS.parseIndex = Kx, AS.config = Vx, AS.parseQuery = TS, _S(hS);
// node_modules/.pnpm/@vueuse+integrations@14.4.0_e296e648d81c519b0c065d5abb502518/node_modules/@vueuse/integrations/dist/useFuse.js
function jS(e, t, n) {
	let r = () => new AS(on(t) ?? [], on(n)?.fuseOptions), i = /* @__PURE__ */ F(r());
	return R(() => on(n)?.fuseOptions, () => {
		i.value = r();
	}, { deep: !0 }), R(() => on(t), (e) => {
		i.value.setCollection(e), an(i);
	}, { deep: !0 }), {
		fuse: i,
		results: X(() => {
			let r = on(n);
			if (r?.matchAllWhenSearchEmpty && !on(e)) return on(t).map((e, t) => ({
				item: e,
				refIndex: t
			}));
			let a = r?.resultLimit;
			return i.value.search(on(e), a ? { limit: a } : void 0);
		})
	};
}
// src/vendor/comfyui/select/useSelectSearch.ts
function MS(e, t) {
	let { results: n } = jS(e, t, {
		fuseOptions: {
			keys: ["name", "value"],
			threshold: .3
		},
		matchAllWhenSearchEmpty: !0
	});
	return X(() => e.value.trim() ? n.value.map(({ item: e }) => e) : on(t));
}
// src/vendor/comfyui/single-select/SearchableSingleSelect.vue?vue&type=script&setup=true&lang.ts
var NS = {
	key: 0,
	class: "icon-[lucide--loader-circle] shrink-0 animate-spin text-muted-foreground"
}, PS = { class: "truncate" }, FS = { class: "px-2 pt-2" }, IS = { class: "flex items-center gap-2 rounded-lg border px-3 py-1.5" }, LS = { class: "truncate" }, RS = /* @__PURE__ */ z({
	inheritAttrs: !1,
	__name: "SearchableSingleSelect",
	props: /*@__PURE__*/ ui({
		label: {},
		accessibleLabel: {},
		searchLabel: {},
		emptyText: {},
		options: { default: () => [] },
		size: { default: "lg" },
		invalid: {
			type: Boolean,
			default: !1
		},
		loading: {
			type: Boolean,
			default: !1
		},
		disabled: {
			type: Boolean,
			default: !1
		},
		searchPlaceholder: {},
		listMaxHeight: { default: "28rem" },
		popoverMinWidth: {},
		popoverMaxWidth: {},
		contentStyle: { type: [
			Boolean,
			null,
			String,
			Object,
			Array
		] }
	}, {
		modelValue: { required: !0 },
		modelModifiers: {}
	}),
	emits: ["update:modelValue"],
	setup(e) {
		let { attrsClass: t, attrsWithoutClass: n } = db(), r = Ai(e, "modelValue"), i = Tr("trigger"), a = /* @__PURE__ */ P(!1), o = /* @__PURE__ */ P(""), s = MS(o, () => e.options), c = X({
			get: () => e.options.find(({ value: e }) => e === r.value),
			set: (e) => {
				r.value = e?.value;
			}
		});
		R(a, (e) => {
			e || (o.value = "");
		});
		function l(e) {
			e.key === "Tab" ? (mp(i)?.focus(), a.value = !1) : e.key === "Escape" && (ub(e), a.value = !1);
		}
		let u = fb({
			minWidth: e.popoverMinWidth,
			maxWidth: e.popoverMaxWidth
		});
		return (r, i) => (U(), G(I(I_), {
			modelValue: c.value,
			"onUpdate:modelValue": i[3] ||= (e) => c.value = e,
			open: a.value,
			"onUpdate:open": i[4] ||= (e) => a.value = e,
			by: "value",
			disabled: e.disabled,
			"ignore-filter": ""
		}, {
			default: L(() => [q(I(L_), { "as-child": "" }, {
				default: L(() => [q(I(Y_), za({ ref: "trigger" }, I(n), {
					tabindex: "0",
					"aria-label": e.accessibleLabel,
					"aria-busy": e.loading || void 0,
					"aria-invalid": e.invalid || void 0,
					class: I(mx)(I(ib)({
						size: e.size,
						border: e.invalid ? "invalid" : "none"
					}), I(t))
				}), {
					default: L(() => [K("div", { class: me(I(mx)("flex flex-1 items-center gap-2 overflow-hidden py-2 pl-2", e.size === "md" ? "text-xs" : "text-sm")) }, [e.loading ? (U(), W("i", NS)) : V(r.$slots, "icon", {}, void 0, void 0, 1), K("span", PS, N(c.value?.name ?? e.label), 1)], 2), K("div", { class: me(I(sb)) }, [...i[5] ||= [K("i", { class: "icon-[lucide--chevron-down] text-muted-foreground" }, null, -1)]], 2)]),
					_: 3
				}, 16, [
					"aria-label",
					"aria-busy",
					"aria-invalid",
					"class"
				])]),
				_: 3
			}), (U(), G(I(J_), { key: Number(a.value) }, {
				default: L(() => [q(I(V_), {
					position: "popper",
					"side-offset": 8,
					align: "start",
					style: le([I(u), e.contentStyle]),
					class: me(I(mx)(I(ob), "min-w-(--reka-combobox-trigger-width)")),
					onKeydown: l
				}, {
					default: L(() => [q(I(Wm), {
						class: "contents",
						onMountAutoFocus: i[1] ||= hs(() => {}, ["prevent"]),
						onUnmountAutoFocus: i[2] ||= hs(() => {}, ["prevent"])
					}, {
						default: L(() => [K("div", FS, [K("div", IS, [i[6] ||= K("i", { class: "icon-[lucide--search] text-muted-foreground" }, null, -1), q(I(G_), {
							modelValue: o.value,
							"onUpdate:modelValue": i[0] ||= (e) => o.value = e,
							"aria-label": e.searchLabel,
							placeholder: e.searchPlaceholder,
							class: "w-full border-none bg-transparent text-sm outline-none"
						}, null, 8, [
							"modelValue",
							"aria-label",
							"placeholder"
						])])]), q(I(Z_), {
							style: le({ maxHeight: `min(${e.listMaxHeight}, 50vh)` }),
							class: "scrollbar-custom w-full"
						}, {
							default: L(() => [(U(!0), W(H, null, B(I(s), (e) => (U(), G(I(K_), {
								key: e.value,
								value: e,
								class: me(I(ab)({ layout: "single" }))
							}, {
								default: L(() => [K("span", LS, N(e.name), 1), q(I(q_), { class: "flex shrink-0 items-center justify-center" }, {
									default: L(() => [...i[7] ||= [K("i", {
										class: "icon-[lucide--check] text-foreground",
										"aria-hidden": "true"
									}, null, -1)]]),
									_: 1
								})]),
								_: 2
							}, 1032, ["value", "class"]))), 128)), q(I(H_), { class: me(I(cb)) }, {
								default: L(() => [J(N(e.emptyText), 1)]),
								_: 1
							}, 8, ["class"])]),
							_: 1
						}, 8, ["style"])]),
						_: 1
					})]),
					_: 1
				}, 8, ["style", "class"])]),
				_: 1
			}))]),
			_: 3
		}, 8, [
			"modelValue",
			"open",
			"disabled"
		]));
	}
}), zS = {
	key: 0,
	class: "icon-[lucide--loader-circle] shrink-0 animate-spin text-muted-foreground"
}, BS = /* @__PURE__ */ z({
	inheritAttrs: !1,
	__name: "SingleSelect",
	props: /*@__PURE__*/ ui({
		label: {},
		accessibleLabel: {},
		options: { default: () => [] },
		size: { default: "lg" },
		invalid: {
			type: Boolean,
			default: !1
		},
		loading: {
			type: Boolean,
			default: !1
		},
		disabled: {
			type: Boolean,
			default: !1
		},
		searchPlaceholder: {},
		listMaxHeight: { default: "28rem" },
		popoverMinWidth: {},
		popoverMaxWidth: {},
		contentStyle: { type: [
			Boolean,
			null,
			String,
			Object,
			Array
		] },
		searchable: {
			type: Boolean,
			default: !1
		},
		searchLabel: {},
		emptyText: {}
	}, {
		modelValue: { required: !0 },
		modelModifiers: {}
	}),
	emits: ["update:modelValue"],
	setup(e) {
		let { attrsClass: t, attrsWithoutClass: n } = db(), r = Ai(e, "modelValue"), i = /* @__PURE__ */ P(!1);
		function a(e) {
			e.key === "Escape" && (ub(e), i.value = !1);
		}
		let o = fb({
			minWidth: e.popoverMinWidth,
			maxWidth: e.popoverMaxWidth
		});
		return (s, c) => e.searchable && e.searchLabel !== void 0 && e.emptyText !== void 0 ? (U(), G(RS, za({
			key: 0,
			modelValue: r.value,
			"onUpdate:modelValue": c[0] ||= (e) => r.value = e
		}, I(n), {
			class: I(t),
			label: e.label,
			"accessible-label": e.accessibleLabel,
			"search-label": e.searchLabel,
			"empty-text": e.emptyText,
			options: e.options,
			size: e.size,
			invalid: e.invalid,
			loading: e.loading,
			disabled: e.disabled,
			"search-placeholder": e.searchPlaceholder,
			"list-max-height": e.listMaxHeight,
			"popover-min-width": e.popoverMinWidth,
			"popover-max-width": e.popoverMaxWidth,
			"content-style": e.contentStyle
		}), {
			icon: L(() => [V(s.$slots, "icon")]),
			_: 3
		}, 16, [
			"modelValue",
			"class",
			"label",
			"accessible-label",
			"search-label",
			"empty-text",
			"options",
			"size",
			"invalid",
			"loading",
			"disabled",
			"search-placeholder",
			"list-max-height",
			"popover-min-width",
			"popover-max-width",
			"content-style"
		])) : (U(), G(I(_v), {
			key: 1,
			modelValue: r.value,
			"onUpdate:modelValue": c[1] ||= (e) => r.value = e,
			open: i.value,
			"onUpdate:open": c[2] ||= (e) => i.value = e,
			disabled: e.disabled
		}, {
			default: L(() => [q(I(Iv), za(I(n), {
				"aria-label": e.accessibleLabel,
				"aria-busy": e.loading || void 0,
				"aria-invalid": e.invalid || void 0,
				class: I(mx)(I(ib)({
					size: e.size,
					border: e.invalid ? "invalid" : "none"
				}), I(t))
			}), {
				default: L(() => [K("div", { class: me(I(mx)("flex flex-1 items-center gap-2 overflow-hidden py-2 pl-2", e.size === "md" ? "text-xs" : "text-sm")) }, [e.loading ? (U(), W("i", zS)) : V(s.$slots, "icon", {}, void 0, void 0, 1), q(I(Lv), {
					placeholder: e.label,
					class: "truncate"
				}, null, 8, ["placeholder"])], 2), K("div", { class: me(I(sb)) }, [...c[3] ||= [K("i", { class: "icon-[lucide--chevron-down] text-muted-foreground" }, null, -1)]], 2)]),
				_: 3
			}, 16, [
				"aria-label",
				"aria-busy",
				"aria-invalid",
				"class"
			]), q(I(Fv), null, {
				default: L(() => [q(I(kv), {
					position: "popper",
					"side-offset": 8,
					align: "start",
					style: le([I(o), e.contentStyle]),
					class: me(I(mx)(I(ob), "min-w-(--reka-select-trigger-width)")),
					onKeydown: a
				}, {
					default: L(() => [q(I(Rv), {
						style: le({ maxHeight: `min(${e.listMaxHeight}, 50vh)` }),
						class: "scrollbar-custom w-full"
					}, {
						default: L(() => [(U(!0), W(H, null, B(e.options, (e) => (U(), G(I(Mv), {
							key: e.value,
							value: e.value,
							disabled: e.disabled,
							class: me(I(ab)({ layout: "single" }))
						}, {
							default: L(() => [q(I(Pv), { class: "truncate" }, {
								default: L(() => [J(N(e.name), 1)]),
								_: 2
							}, 1024), q(I(Nv), { class: "flex shrink-0 items-center justify-center" }, {
								default: L(() => [...c[4] ||= [K("i", {
									class: "icon-[lucide--check] text-foreground",
									"aria-hidden": "true"
								}, null, -1)]]),
								_: 1
							})]),
							_: 2
						}, 1032, [
							"value",
							"disabled",
							"class"
						]))), 128))]),
						_: 1
					}, 8, ["style"])]),
					_: 1
				}, 8, ["style", "class"])]),
				_: 1
			})]),
			_: 3
		}, 8, [
			"modelValue",
			"open",
			"disabled"
		]));
	}
}), VS = "unspecified", HS = (e) => e === "" ? VS : "value:" + e, US = /* @__PURE__ */ z((e) => () => q(BS, za({
	class: "ap-comfy-select",
	accessibleLabel: e.label,
	"aria-describedby": e.invalid ? `${e.id}-error` : void 0,
	disabled: e.disabled,
	invalid: e.invalid,
	modelValue: e.options.some((t) => t.value === e.value) ? HS(e.value) : VS,
	options: e.options.map((e) => ({
		value: HS(e.value),
		name: e.label,
		disabled: e.disabled
	}))
}, {
	id: e.id,
	"onUpdate:modelValue": (t) => {
		typeof t == "string" && e.onChange(t === VS ? "" : t.slice(6));
	}
}), null), { props: [
	"id",
	"label",
	"value",
	"options",
	"disabled",
	"invalid",
	"onChange"
] });
// src/features/library/components/useMutation.ts
async function WS(e, n, r, i = "default") {
	let a = document.activeElement;
	try {
		return await t.extensionManager.dialog.confirm({
			key: "astrophoto.equipment." + crypto.randomUUID(),
			title: e,
			message: n,
			type: i,
			...r ? { itemList: [r] } : {}
		});
	} finally {
		a instanceof HTMLElement && a.isConnected && a.focus();
	}
}
function GS() {
	let e = new AbortController(), t = /* @__PURE__ */ P(!1), n = /* @__PURE__ */ F();
	ke(() => e.abort());
	async function r(r) {
		let { signal: i } = e;
		if (!(i.aborted || t.value)) {
			t.value = !0, n.value = void 0;
			try {
				await r(i);
			} catch (e) {
				i.aborted || (n.value = e instanceof Q ? e : new Q("network"));
			} finally {
				i.aborted || (t.value = !1);
			}
		}
	}
	return {
		run: r,
		pending: t,
		error: n
	};
}
// src/features/storage/format.ts
function KS(e) {
	return e == null ? "—" : e < 1024 ? `${e} B` : new Intl.NumberFormat(void 0, { maximumFractionDigits: 2 }).format(e / 1024 ** 3) + " GiB";
}
function qS(e) {
	return e == null ? "—" : e < 1e9 ? new Intl.NumberFormat().format(e) + " B" : new Intl.NumberFormat(void 0, { maximumFractionDigits: 3 }).format(e / 1e9) + " GB";
}
// src/api/equipment.ts
var JS = [
	"camera",
	"primary_optics",
	"optical_accessory",
	"filter"
], YS = "/astrophoto/v1", XS = (e) => e === null || typeof e == "string", ZS = (e) => e === null || typeof e == "number" && Number.isFinite(e), QS = (e) => typeof e == "string" && /^[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}$/.test(e), $S = (e) => typeof e == "number" && e > 0 && Number.isSafeInteger(e), eC = (e) => Array.isArray(e) && e.every(QS), tC = (e) => Array.isArray(e) && e.every((e) => typeof e == "string"), nC = (e) => JS.includes(e), rC = (e) => $(e) && Object.entries(e).every(([e, t]) => e === "passbands" ? Array.isArray(t) && t.every((e) => $(e) && QS(e.id) && typeof e.band_label == "string" && ZS(e.center_nm) && ZS(e.fwhm_nm)) : e === "readout_modes" ? Array.isArray(t) && t.every((e) => $(e) && typeof e.mode_key == "string" && typeof e.display_name == "string" && [
	"gain_min",
	"gain_max",
	"offset_min",
	"offset_max"
].every((t) => ZS(e[t]))) : XS(t) || typeof t == "boolean" || ZS(t));
function iC(e) {
	if (!$(e) || !QS(e.id) || !nC(e.equipment_type) || typeof e.name != "string" || !$S(e.row_version) || !XS(e.archived_at_utc) || !XS(e.notes) || !XS(e.manufacturer) || !XS(e.model) || !rC(e.specs) || e.usage_summary !== void 0 && (!Array.isArray(e.usage_summary) || !e.usage_summary.every((e) => $(e) && QS(e.train_id) && typeof e.name == "string" && typeof e.draft == "boolean" && Array.isArray(e.revisions) && e.revisions.every((e) => $(e) && QS(e.id) && $S(e.revision_number))))) throw new Q("schema");
	return e;
}
function aC(e) {
	return $(e) && ZS(e.rotation_deg) && XS(e.flat_validity_note) && XS(e.configuration_note);
}
function oC(e) {
	return $(e) && typeof e.name == "string" && XS(e.notes) && (e.change_summary === void 0 || XS(e.change_summary)) && [
		"camera_id",
		"primary_optics_id",
		"base_revision_id"
	].every((t) => e[t] === null || QS(e[t])) && eC(e.accessory_ids) && eC(e.filter_ids) && aC(e.optical_state);
}
function sC(e) {
	if (!$(e) || !$S(e.draft_version) || !oC(e.draft) || typeof e.updated_at_utc != "string") throw new Q("schema");
	return e;
}
function cC(e) {
	if (!$(e) || !QS(e.id) || !QS(e.train_id) || !$S(e.revision_number) || !XS(e.change_summary) || typeof e.published_at_utc != "string" || !(e.base_revision_id === null || QS(e.base_revision_id))) throw new Q("schema");
	return e;
}
function lC(e) {
	if (!$(e) || !QS(e.id) || typeof e.name != "string" || !XS(e.notes) || !$S(e.row_version) || ![
		"draft",
		"published",
		"archived",
		"deleted"
	].includes(String(e.status)) || typeof e.has_draft != "boolean" || !$(e.summary) || !XS(e.summary.camera) || !XS(e.summary.primary_optics) || !tC(e.summary.accessories) || !tC(e.summary.filters) || (e.latest_revision !== null && cC(e.latest_revision), e.default_revision !== null && cC(e.default_revision), e.draft !== null && e.draft !== void 0 && sC(e.draft), e.configuration != null && (!$(e.configuration) || !oC(e.configuration.draft) || e.configuration.draft_version !== null && !$S(e.configuration.draft_version)))) throw new Q("schema");
	if (e.components !== void 0) {
		if (!Array.isArray(e.components)) throw new Q("schema");
		e.components.forEach(iC);
	}
	return e;
}
function uC(e) {
	return new URLSearchParams(Object.entries(e).filter(([, e]) => e)).toString();
}
function dC(e, t) {
	if (!$(e) || !Array.isArray(e.items) || !(e.next === null || QS(e.next)) || e.total !== void 0 && (!Number.isSafeInteger(e.total) || Number(e.total) < 0)) throw new Q("schema");
	return {
		items: e.items.map(t),
		next: e.next,
		total: e.total
	};
}
var fC = (e) => `${YS}/equipment/${encodeURIComponent(e)}`, pC = (e) => `${YS}/optical-trains/${encodeURIComponent(e)}`;
async function mC(e, t) {
	return dC(await Ff(`${YS}/equipment?${uC(e)}`, t), iC);
}
async function hC(e, t) {
	return iC(await Ff(fC(e), t));
}
async function gC(e, t, n, r) {
	return iC(await If(n ? fC(n.id) : `${YS}/equipment`, n ? "PATCH" : "POST", n ? {
		...t,
		expected_version: n.row_version
	} : {
		...t,
		equipment_type: e
	}, r));
}
async function _C(e, t) {
	return iC(await If(fC(e.id) + (e.archived_at_utc ? "/restore" : "/archive"), "POST", { expected_version: e.row_version }, t));
}
async function vC(e, t) {
	await If(fC(e.id), "DELETE", { expected_version: e.row_version }, t);
}
async function yC(e, t) {
	return dC(await Ff(`${YS}/optical-trains?${uC(e)}`, t), lC);
}
async function bC(e, t) {
	return lC(await Ff(pC(e), t));
}
async function xC(e, t) {
	await If(pC(e.id), "DELETE", { expected_version: e.row_version }, t);
}
async function SC(e, t) {
	let n = lC(await If(`${YS}/optical-trains`, "POST", {
		name: e.name,
		notes: e.notes,
		draft: e
	}, t));
	if (!n.draft) throw new Q("schema");
	return {
		train: n,
		receipt: n.draft
	};
}
async function CC(e, t, n, r) {
	return sC(await If(pC(e) + "/draft", "PUT", {
		draft: t,
		expected_draft_version: n
	}, r));
}
async function wC(e, t) {
	return lC(await If(pC(e.id) + (e.status === "archived" ? "/restore" : "/archive"), "POST", { expected_version: e.row_version }, t));
}
async function TC(e) {
	let t = [], n = "";
	do {
		let r = await mC({
			archived: "all",
			after: n,
			limit: "100"
		}, e);
		if (t.push(...r.items), r.next && r.next <= n) throw new Q("schema");
		n = r.next ?? "";
	} while (n);
	return t;
}
// src/vendor/comfyui/multi-select/MultiSelectContent.vue?vue&type=script&setup=true&lang.ts
var EC = {
	key: 0,
	class: "px-2 pt-2 pb-0"
}, DC = { class: "flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm" }, OC = {
	key: 0,
	class: "px-1 text-sm text-muted-foreground"
}, kC = { class: "flex size-4 shrink-0 items-center justify-center rounded-sm transition-all duration-200 group-data-[state=checked]:bg-primary group-data-[state=unchecked]:bg-secondary [&>span]:flex" }, AC = {
	key: 0,
	class: "px-1 text-sm text-muted-foreground"
}, jC = /* @__PURE__ */ z({
	__name: "MultiSelectContent",
	props: /*@__PURE__*/ ui({
		searchLabel: {},
		emptyText: {},
		clearAllLabel: {},
		formatSelectedCount: { type: Function },
		options: {},
		showSearchBox: { type: Boolean },
		showClearButton: { type: Boolean },
		actionsPlacement: {},
		searchPlaceholder: {},
		listMaxHeight: {},
		popoverStyle: { type: [
			Boolean,
			null,
			String,
			Object,
			Array
		] },
		contentStyle: { type: [
			Boolean,
			null,
			String,
			Object,
			Array
		] }
	}, {
		modelValue: { required: !0 },
		modelModifiers: {},
		searchQuery: { required: !0 },
		searchQueryModifiers: {}
	}),
	emits: /*@__PURE__*/ ui(["escape"], ["update:modelValue", "update:searchQuery"]),
	setup(e, { emit: t }) {
		let { open: n } = P_(), r = t, i = Ai(e, "modelValue"), a = Ai(e, "searchQuery"), o = X(() => !!e.formatSelectedCount || e.showClearButton), s = X(() => mx("flex shrink-0 items-center justify-between", e.actionsPlacement === "header" ? "mt-2 border-b px-2 pb-4" : "-mx-2 mt-2 border-t px-4 pt-3 pb-1")), c = MS(a, () => e.options), l = X(() => a.value.trim() ? [...i.value.filter((e) => !c.value.some(({ value: t }) => t === e.value)), ...c.value] : e.options);
		function u(e) {
			e.key === "Escape" && (ub(e), r("escape"));
		}
		function d(e) {
			e.preventDefault();
		}
		return (t, r) => (U(), G(I(J_), { key: Number(I(n)) }, {
			default: L(() => [q(I(V_), {
				position: "popper",
				"side-offset": 8,
				align: "start",
				style: le([e.popoverStyle, e.contentStyle]),
				class: me(I(mx)(I(ob), "flex flex-col")),
				onKeydown: u,
				onFocusOutside: d
			}, {
				default: L(() => [q(I(Wm), {
					class: "contents",
					onMountAutoFocus: r[1] ||= hs(() => {}, ["prevent"])
				}, {
					default: L(() => [
						e.showSearchBox ? (U(), W("div", EC, [K("div", DC, [r[2] ||= K("i", { class: "icon-[lucide--search] shrink-0 text-muted-foreground" }, null, -1), q(I(G_), {
							modelValue: a.value,
							"onUpdate:modelValue": r[0] ||= (e) => a.value = e,
							placeholder: e.searchPlaceholder,
							"aria-label": e.searchLabel,
							class: "w-full border-none bg-transparent outline-none"
						}, null, 8, [
							"modelValue",
							"placeholder",
							"aria-label"
						])])])) : Y("", !0),
						o.value && e.actionsPlacement === "header" ? (U(), W("div", {
							key: 1,
							class: me(s.value)
						}, [e.formatSelectedCount ? (U(), W("span", OC, N(e.formatSelectedCount(i.value.length)), 1)) : Y("", !0)], 2)) : Y("", !0),
						q(I(Z_), {
							class: me(I(mx)("flex flex-col gap-0 p-0 text-sm", "scrollbar-custom overflow-y-auto", "min-w-(--reka-combobox-trigger-width)")),
							style: le({ maxHeight: `min(${e.listMaxHeight}, 50vh)` })
						}, {
							default: L(() => [(U(!0), W(H, null, B(l.value, (e) => (U(), G(I(K_), {
								key: e.value,
								value: e,
								class: me(I(mx)("group", I(ab)({ layout: "multi" })))
							}, {
								default: L(() => [K("div", kC, [q(I(q_), null, {
									default: L(() => [...r[3] ||= [K("i", { class: "icon-[lucide--check] text-xs font-bold text-foreground" }, null, -1)]]),
									_: 1
								})]), K("span", null, N(e.name), 1)]),
								_: 2
							}, 1032, ["value", "class"]))), 128)), q(I(H_), { class: me(I(cb)) }, {
								default: L(() => [J(N(e.emptyText), 1)]),
								_: 1
							}, 8, ["class"])]),
							_: 1
						}, 8, ["class", "style"]),
						o.value && e.actionsPlacement === "footer" ? (U(), W("div", {
							key: 2,
							class: me(s.value)
						}, [e.formatSelectedCount ? (U(), W("span", AC, N(e.formatSelectedCount(i.value.length)), 1)) : Y("", !0)], 2)) : Y("", !0)
					]),
					_: 1
				})]),
				_: 1
			}, 8, ["style", "class"])]),
			_: 1
		}));
	}
}), MC = { class: "flex flex-1 items-center overflow-hidden py-2 pl-2 whitespace-nowrap" }, NC = { class: "truncate text-sm" }, PC = /* @__PURE__ */ z({
	inheritAttrs: !1,
	__name: "MultiSelectTrigger",
	props: {
		class: { type: [
			Array,
			Object,
			String,
			Number,
			null,
			Boolean
		] },
		label: {},
		accessibleLabel: {},
		selectedItems: {},
		size: {}
	},
	setup(e) {
		return (t, n) => (U(), G(I(L_), { "as-child": "" }, {
			default: L(() => [q(I(Y_), za(t.$attrs, {
				"aria-label": e.accessibleLabel,
				class: I(mx)(I(ib)({
					size: e.size,
					border: e.selectedItems.length ? "active" : "none"
				}), e.class)
			}), {
				default: L(() => [K("div", MC, [e.selectedItems.length === 0 ? (U(), W("span", {
					key: 0,
					class: me(e.size === "md" ? "text-xs" : "text-sm")
				}, N(e.label), 3)) : V(t.$slots, "default", { selected: e.selectedItems }, () => [K("span", NC, N(e.selectedItems.map(({ name: e }) => e).join(", ")), 1)], void 0, 1), e.selectedItems.length ? (U(), W("span", {
					key: 2,
					class: me(I(mx)("pointer-events-none absolute -top-1.5 -right-1.5 z-10", I(lb)))
				}, N(e.selectedItems.length), 3)) : Y("", !0)]), K("div", { class: me(I(sb)) }, [...n[0] ||= [K("i", { class: "icon-[lucide--chevron-down] text-muted-foreground" }, null, -1)]], 2)]),
				_: 3
			}, 16, ["aria-label", "class"])]),
			_: 3
		}));
	}
}), FC = /* @__PURE__ */ z({
	inheritAttrs: !1,
	__name: "MultiSelect",
	props: /*@__PURE__*/ ui({
		accessibleLabel: {},
		emptyText: {},
		label: {},
		options: { default: () => [] },
		size: { default: "lg" },
		disabled: {
			type: Boolean,
			default: !1
		},
		actionsPlacement: { default: "header" },
		searchPlaceholder: {},
		listMaxHeight: { default: "28rem" },
		popoverMinWidth: {},
		popoverMaxWidth: {},
		contentStyle: { type: [
			Boolean,
			null,
			String,
			Object,
			Array
		] },
		showSearchBox: {
			type: Boolean,
			default: !1
		},
		searchLabel: {},
		showClearButton: {
			type: Boolean,
			default: !1
		},
		clearAllLabel: {},
		showSelectedCount: {
			type: Boolean,
			default: !1
		},
		formatSelectedCount: { type: Function }
	}, {
		modelValue: { required: !0 },
		modelModifiers: {},
		searchQuery: { default: "" },
		searchQueryModifiers: {}
	}),
	emits: ["update:modelValue", "update:searchQuery"],
	setup(e) {
		let { attrsClass: t, attrsWithoutClass: n } = db(), r = Ai(e, "modelValue"), i = Ai(e, "searchQuery"), a = /* @__PURE__ */ P(!1), o = fb({
			minWidth: e.popoverMinWidth,
			maxWidth: e.popoverMaxWidth
		});
		return (s, c) => (U(), G(I(I_), {
			modelValue: r.value,
			"onUpdate:modelValue": c[3] ||= (e) => r.value = e,
			open: a.value,
			"onUpdate:open": c[4] ||= (e) => a.value = e,
			multiple: "",
			by: "value",
			disabled: e.disabled,
			"ignore-filter": "",
			"reset-search-term-on-select": !1
		}, {
			default: L(() => [q(PC, za(I(n), {
				class: I(t),
				label: e.label,
				"accessible-label": e.accessibleLabel,
				"selected-items": r.value,
				size: e.size
			}), $r({ _: 2 }, [s.$slots.value ? {
				name: "default",
				fn: L(({ selected: e }) => [V(s.$slots, "value", { selected: e })]),
				key: "0"
			} : void 0]), 1040, [
				"class",
				"label",
				"accessible-label",
				"selected-items",
				"size"
			]), q(jC, {
				modelValue: r.value,
				"onUpdate:modelValue": c[0] ||= (e) => r.value = e,
				"search-query": i.value,
				"onUpdate:searchQuery": c[1] ||= (e) => i.value = e,
				options: e.options,
				"show-search-box": e.showSearchBox,
				"show-clear-button": e.showClearButton,
				"actions-placement": e.actionsPlacement,
				"search-placeholder": e.searchPlaceholder,
				"search-label": e.searchLabel,
				"empty-text": e.emptyText,
				"clear-all-label": e.clearAllLabel,
				"format-selected-count": e.showSelectedCount ? e.formatSelectedCount : void 0,
				"list-max-height": e.listMaxHeight,
				"popover-style": I(o),
				"content-style": e.contentStyle,
				onEscape: c[2] ||= (e) => a.value = !1
			}, null, 8, [
				"modelValue",
				"search-query",
				"options",
				"show-search-box",
				"show-clear-button",
				"actions-placement",
				"search-placeholder",
				"search-label",
				"empty-text",
				"clear-all-label",
				"format-selected-count",
				"list-max-height",
				"popover-style",
				"content-style"
			])]),
			_: 3
		}, 8, [
			"modelValue",
			"open",
			"disabled"
		]));
	}
}), IC = /* @__PURE__ */ z((e) => () => q(FC, za({
	class: "ap-comfy-select",
	accessibleLabel: e.label,
	label: e.placeholder,
	emptyText: e.emptyText,
	disabled: e.disabled,
	options: e.options,
	modelValue: e.value.map((t) => e.options.find((e) => e.value === t) ?? {
		value: t,
		name: t
	})
}, { "onUpdate:modelValue": (t) => e.onChange(t.map((e) => e.value)) }), null), { props: [
	"label",
	"placeholder",
	"emptyText",
	"options",
	"value",
	"disabled",
	"onChange"
] }), LC = {
	file_kind: [
		"image",
		"video",
		"other",
		"unknown"
	],
	usage: [
		"light",
		"dark",
		"flat",
		"bias",
		"dark_flat",
		"other",
		"unknown"
	],
	role: [
		"raw",
		"calibration_master",
		"master_frame",
		"processed"
	],
	calibration_state: [
		"uncalibrated",
		"calibrated",
		"unknown",
		"not_applicable"
	],
	stage: [
		"raw",
		"preprocessed",
		"registered",
		"stacked",
		"mosaiced",
		"postprocessed",
		"finished",
		"unknown"
	]
}, RC = [
	"exposure",
	"gain",
	"offset",
	"temperature",
	"order",
	"fwhm",
	"snr"
], zC = [
	"target",
	"target_type",
	"captured_at",
	"filter",
	"band",
	"binning",
	"panel",
	"region",
	"batch",
	"channel",
	"notes"
], BC = [
	"dark",
	"flat",
	"bias",
	"dark_flat"
], VC = [
	"usage",
	"camera_id",
	"optical_train_id",
	"filter",
	"band",
	"exposure",
	"gain",
	"offset",
	"binning",
	"temperature"
], HC = {
	role: "alert",
	class: "ap-assets-error"
}, UC = { key: 0 }, WC = { key: 1 }, GC = /* @__PURE__ */ z({
	__name: "LibraryError",
	props: {
		error: {},
		retry: {},
		notify: {
			type: Boolean,
			default: !0
		}
	},
	setup(e) {
		let t = e, { t: n } = Cf(), r = X(() => t.error instanceof Q ? t.error.code : t.error instanceof Error ? t.error.message : "network"), i = X(() => {
			let e = t.error instanceof Q ? t.error.details?.locations : void 0;
			return Array.isArray(e) ? e.filter($).filter((e) => typeof e.workspace_id == "string" && typeof e.code == "string") : [];
		}), a = X(() => {
			let e = t.error instanceof Q ? t.error.details : void 0;
			if (!e) return "";
			let r = e.fields ?? e.differences;
			return Array.isArray(r) ? r.map((e) => typeof e == "string" ? e : "").filter(Boolean).join(", ") : r && typeof r == "object" ? Object.keys(r).join(", ") : ["conflicts", "unknown"].map((t) => {
				let r = e[t];
				return Array.isArray(r) && r.length ? n("assetLibrary." + t) + " · " + r.map((e) => n("assetLibrary.fields." + e, String(e))).join(", ") : "";
			}).filter(Boolean).join(" · ");
		});
		return R(() => t.error, (e) => {
			e && t.notify !== !1 && Uv("error", n("assetLibrary.errors." + r.value, n("storage.errors." + r.value, n("errors." + r.value, n("errors.unknown")))) + " · " + r.value);
		}, { immediate: !0 }), (t, o) => (U(), W("div", HC, [
			K("p", null, [J(N(I(n)("assetLibrary.errors." + r.value, I(n)("storage.errors." + r.value, I(n)("errors." + r.value, I(n)("errors.unknown"))))) + " ", 1), K("code", null, N(r.value), 1)]),
			i.value.length ? (U(), W("ul", UC, [(U(!0), W(H, null, B(i.value, (e) => (U(), W("li", { key: String(e.workspace_id) }, N(e.workspace_id) + " · " + N(I(n)("storage.errors." + e.code, String(e.code))), 1))), 128))])) : Y("", !0),
			a.value ? (U(), W("p", WC, N(a.value), 1)) : Y("", !0),
			e.retry ? (U(), W("button", {
				key: 2,
				type: "button",
				onClick: o[0] ||= (...t) => e.retry && e.retry(...t)
			}, N(I(n)("actions.retry")), 1)) : Y("", !0)
		]));
	}
}), KC = {
	key: 0,
	role: "status"
}, qC = {
	key: 2,
	role: "status"
}, JC = {
	key: 3,
	class: "ap-assets-list ap-assets-picker-list"
}, YC = ["title", "onClick"], XC = { key: 4 }, ZC = /* @__PURE__ */ z({
	__name: "AssetPicker",
	props: {
		selected: {},
		excluded: {},
		usage: {}
	},
	emits: ["pick"],
	setup(e, { emit: t }) {
		let n = e, r = t, { t: i } = Cf(), a = /* @__PURE__ */ P(""), { resource: o, refresh: s } = Xy(X(() => {
			let e = a.value, t = n.usage;
			return (n) => Dy("assets", {
				q: e,
				usage: t,
				limit: "30"
			}, n);
		})), c = X(() => o.value.state === "ready" ? o.value.data.items.filter((e) => !n.selected?.includes(e.id) && !n.excluded?.includes(e.id)) : []);
		return (e, t) => (U(), W(H, null, [
			q(I(zv), {
				label: I(i)("assetLibrary.searchAssets"),
				"clear-label": I(i)("browse.clear"),
				onSearch: t[0] ||= (e) => a.value = e
			}, null, 8, ["label", "clear-label"]),
			I(o).state === "loading" ? (U(), W("p", KC, N(I(i)("states.loading")), 1)) : I(o).state === "error" ? (U(), G(GC, {
				key: 1,
				error: I(o).error,
				retry: I(s)
			}, null, 8, ["error", "retry"])) : c.value.length ? (U(), W("ul", JC, [(U(!0), W(H, null, B(c.value, (e) => (U(), W("li", { key: e.id }, [K("button", {
				type: "button",
				class: "ap-assets-truncate",
				title: e.name,
				onClick: (t) => r("pick", e)
			}, N(e.name), 9, YC)]))), 128))])) : (U(), W("p", qC, N(I(i)("assetLibrary.noMatches")), 1)),
			I(o).state === "ready" && I(o).data.next ? (U(), W("small", XC, N(I(i)("assetLibrary.narrowSearch")), 1)) : Y("", !0)
		], 64));
	}
}), QC = ["disabled"], $C = ["for"], ew = ["value", "onInput"], tw = ["value", "onInput"], nw = ["for"], rw = ["for"], iw = ["for"], aw = { key: 0 }, ow = /* @__PURE__ */ z({
	__name: "AssetAttributes",
	props: /*@__PURE__*/ ui({
		id: {},
		saving: { type: Boolean }
	}, {
		modelValue: { required: !0 },
		modelModifiers: {}
	}),
	emits: ["update:modelValue"],
	setup(e) {
		let t = Ai(e, "modelValue"), n = e, { t: r } = Cf(), { resource: i, refresh: a } = Xy(TC), { resource: o, refresh: s } = Xy(async (e) => {
			let t = "", n = [];
			do {
				let r = await yC({ after: t }, e);
				if (n.push(...r.items), !r.next || r.next <= t) return n;
				t = r.next;
			} while (t);
			return n;
		}), c = X(() => ({
			value: "",
			label: r("assetLibrary.values.unspecified")
		})), l = X(() => i.value.state === "ready" ? i.value.data.filter((e) => e.equipment_type === "camera") : []), u = X(() => i.value.state === "ready" ? i.value.data.map((e) => ({
			value: e.id,
			name: e.name
		})) : []), d = X(() => o.value.state === "ready" ? o.value.data : []), { resource: f } = Xy(X(() => {
			let e = t.value.optical_train_id, n = typeof e == "string" && o.value.state === "ready" && !o.value.data.some((t) => t.id === e);
			return (t) => n ? bC(e, t) : Promise.resolve(null);
		})), p = X(() => {
			let e = f.value.state === "ready" ? f.value.data : null;
			return !e || e.id !== t.value.optical_train_id ? null : {
				value: e.id,
				label: e.name + " · " + r("equipment.values." + e.status),
				disabled: e.status === "deleted"
			};
		});
		function m(e, n) {
			t.value = {
				...t.value,
				[e]: n
			};
		}
		function h(e, t) {
			let n = t.target;
			m(e, Number.isFinite(n.valueAsNumber) ? n.valueAsNumber : null);
		}
		function g(e, n) {
			let r = [c.value, ...e.map((e) => ({
				value: e.id,
				label: e.name
			}))], i = t.value[n];
			return typeof i == "string" && i && !r.some((e) => e.value === i) && r.push(n === "optical_train_id" && p.value || {
				value: i,
				label: i
			}), r;
		}
		return (f, _) => (U(), W("fieldset", {
			class: "ap-assets-form",
			disabled: e.saving
		}, [
			K("legend", null, N(I(r)("assetLibrary.attributes")), 1),
			(U(!0), W(H, null, B(I(LC), (i, a) => (U(), W("label", {
				key: a,
				class: "ap-assets-field",
				for: n.id + "-" + a
			}, [J(N(I(r)("assetLibrary.fields." + a)) + " ", 1), q(I(US), {
				id: n.id + "-" + a,
				value: String(t.value[a] ?? ""),
				label: I(r)("assetLibrary.fields." + a),
				disabled: e.saving,
				options: [c.value, ...i.map((e) => ({
					value: e,
					label: I(r)("assetLibrary.values." + e)
				}))],
				onChange: (e) => m(a, e || null)
			}, null, 8, [
				"id",
				"value",
				"label",
				"disabled",
				"options",
				"onChange"
			])], 8, $C))), 128)),
			(U(!0), W(H, null, B(I(zC), (e) => (U(), W("label", { key: e }, [J(N(I(r)("assetLibrary.fields." + e)) + " ", 1), K("input", {
				value: String(t.value[e] ?? ""),
				onInput: (t) => m(e, t.target.value || null)
			}, null, 40, ew)]))), 128)),
			(U(!0), W(H, null, B(I(RC), (e) => (U(), W("label", { key: e }, [J(N(I(r)("assetLibrary.fields." + e)) + " ", 1), K("input", {
				type: "number",
				step: "any",
				value: String(t.value[e] ?? ""),
				onInput: (t) => h(e, t)
			}, null, 40, tw)]))), 128)),
			K("label", { for: n.id + "-camera" }, N(I(r)("assetLibrary.fields.camera_id")), 9, nw),
			q(I(US), {
				id: n.id + "-camera",
				value: String(t.value.camera_id ?? ""),
				label: I(r)("assetLibrary.fields.camera_id"),
				disabled: e.saving,
				options: g(l.value, "camera_id"),
				onChange: _[0] ||= (e) => m("camera_id", e || null)
			}, null, 8, [
				"id",
				"value",
				"label",
				"disabled",
				"options"
			]),
			I(i).state === "error" ? (U(), G(GC, {
				key: 0,
				error: I(i).error,
				retry: I(a)
			}, null, 8, ["error", "retry"])) : Y("", !0),
			q(I(IC), {
				label: I(r)("assetLibrary.fields.equipment_ids"),
				placeholder: I(r)("assetLibrary.fields.equipment_ids"),
				"empty-text": I(r)("assetLibrary.noMatches"),
				options: u.value,
				value: Array.isArray(t.value.equipment_ids) ? t.value.equipment_ids : [],
				disabled: !!e.saving,
				onChange: _[1] ||= (e) => m("equipment_ids", e)
			}, null, 8, [
				"label",
				"placeholder",
				"empty-text",
				"options",
				"value",
				"disabled"
			]),
			K("label", { for: n.id + "-optical" }, N(I(r)("assetLibrary.fields.optical_train_id")), 9, rw),
			(U(), G(I(US), {
				key: p.value?.label,
				id: n.id + "-optical",
				value: String(t.value.optical_train_id ?? ""),
				label: I(r)("assetLibrary.fields.optical_train_id"),
				disabled: e.saving,
				options: g(d.value, "optical_train_id"),
				onChange: _[2] ||= (e) => m("optical_train_id", e || null)
			}, null, 8, [
				"id",
				"value",
				"label",
				"disabled",
				"options"
			])),
			I(o).state === "error" ? (U(), G(GC, {
				key: 1,
				error: I(o).error,
				retry: I(s)
			}, null, 8, ["error", "retry"])) : Y("", !0),
			t.value.usage === "flat" && t.value.calibration_state === "calibrated" ? (U(), W(H, { key: 2 }, [
				K("p", null, N(I(r)("assetLibrary.flatRequirements")), 1),
				K("label", { for: n.id + "-calibration-source" }, N(I(r)("assetLibrary.calibrationMethod")), 9, iw),
				q(I(US), {
					id: n.id + "-calibration-source",
					value: String(t.value.calibration_method ?? ""),
					label: I(r)("assetLibrary.calibrationMethod"),
					disabled: e.saving,
					options: [c.value, ...["bias", "dark_flat"].map((e) => ({
						value: e,
						label: I(r)("assetLibrary.values." + e)
					}))],
					onChange: _[3] ||= (e) => t.value = {
						...t.value,
						calibration_method: e || null,
						calibration_source_asset_id: null
					}
				}, null, 8, [
					"id",
					"value",
					"label",
					"disabled",
					"options"
				]),
				t.value.calibration_source_asset_id ? (U(), W("small", aw, N(I(r)("assetLibrary.fields.calibration_source_asset_id")) + " · " + N(t.value.calibration_source_asset_id), 1)) : Y("", !0),
				typeof t.value.calibration_method == "string" ? (U(), G(ZC, {
					usage: t.value.calibration_method,
					key: t.value.calibration_method,
					selected: typeof t.value.calibration_source_asset_id == "string" ? [t.value.calibration_source_asset_id] : [],
					onPick: _[4] ||= (e) => m("calibration_source_asset_id", e.id)
				}, null, 8, ["usage", "selected"])) : Y("", !0)
			], 64)) : Y("", !0)
		], 8, QC));
	}
}), sw = { class: "ap-assets-dialog-content" }, cw = {
	key: 0,
	class: "ap-assets-summary"
}, lw = { key: 0 }, uw = { class: "ap-assets-toolbar" }, dw = ["disabled"], fw = ["disabled"], pw = ["disabled"], mw = ["disabled"], hw = {
	key: 2,
	class: "ap-assets-toolbar"
}, gw = ["disabled"], _w = ["disabled"], vw = /* @__PURE__ */ z({
	__name: "AssetEditor",
	props: {
		asset: {},
		selected: {}
	},
	emits: [
		"changed",
		"close",
		"notice"
	],
	setup(e, { expose: t, emit: n }) {
		let r = e, i = n, { t: a } = Cf(), o = /* @__PURE__ */ F(r.asset), s = /* @__PURE__ */ P({ ...r.asset?.attributes }), c = /* @__PURE__ */ P(""), l = X(() => JSON.stringify(s.value) !== JSON.stringify(o.value?.attributes ?? {})), { pending: u, run: d, error: f } = GS(), p = () => {
			i("changed"), i("notice", a("assetLibrary.saved")), i("close");
		};
		function m() {
			d(async (e) => {
				if (r.selected) {
					if (!await WS(a("assetLibrary.bulkEdit"), a("assetLibrary.bulkConfirm", { count: r.selected.length }))) return;
					let t = 0, n;
					for (let i of r.selected) {
						if (e.aborted) return;
						try {
							await Ay("assets", { attributes: {
								...i.attributes,
								...s.value
							} }, e, i), t++;
						} catch (e) {
							n ??= e;
						}
					}
					if (i("changed"), i("notice", a("assetLibrary.batchResult", {
						count: t,
						failed: r.selected.length - t
					})), n) throw n;
					i("close");
					return;
				}
				if (!o.value) return;
				let t = await Ay("assets", { attributes: s.value }, e, o.value);
				e.aborted || (t.warnings?.length ? (i("changed"), i("notice", a("assetLibrary.collectionWarning", { fields: [...new Set(t.warnings.flatMap((e) => e.conflicts))].map((e) => a("assetLibrary.fields." + e, e)).join(", ") })), i("close")) : p());
			});
		}
		function h(e = !1) {
			d(async (t) => {
				o.value && await WS(a("assetLibrary." + (e ? "physicalDelete" : "unregister")), a("assetLibrary." + (e ? "physicalDeleteConfirm" : "unregisterConfirm")), o.value.name, "delete") && (e ? await Fy(o.value, t) : await jy("assets", o.value, t), t.aborted || p());
			});
		}
		function g() {
			d(async (e) => {
				if (!o.value || !c.value.trim()) return;
				await Py(o.value.id, c.value.trim(), e);
				let t = await ky("assets", o.value.id, e);
				e.aborted || (o.value = t, c.value = "", i("changed"), i("notice", a("assetLibrary.saved")));
			});
		}
		async function _() {
			u.value || (!l.value || await WS(a("assetLibrary.discard"), a("assetLibrary.discardConfirm"))) && i("close");
		}
		function v() {
			d(async (e) => {
				if (!o.value || !await WS(a("actions.refresh"), a("assetLibrary.discardConfirm"))) return;
				let t = await ky("assets", o.value.id, e);
				e.aborted || (o.value = t, s.value = { ...t.attributes });
			});
		}
		return t({ discardDraft: _ }), (t, n) => (U(), W("section", sw, [
			o.value ? (U(), W("dl", cw, [
				K("div", null, [K("dt", null, N(I(a)("assetLibrary.storage")), 1), K("dd", null, N(I(a)("assetLibrary.values." + o.value.storage_mode)), 1)]),
				K("div", null, [K("dt", null, N(I(a)("assetLibrary.fileSize")), 1), K("dd", null, N(I(KS)(o.value.size_bytes)), 1)]),
				K("div", null, [K("dt", null, N(I(a)("assetLibrary.availability")), 1), K("dd", null, N(I(a)("assetLibrary.values." + (o.value.available ? "online" : "offline"))), 1)])
			])) : Y("", !0),
			K("form", {
				class: "ap-assets-form",
				onSubmit: hs(m, ["prevent"])
			}, [
				e.selected ? (U(), W("p", lw, N(I(a)("assetLibrary.bulkConfirm", { count: e.selected.length })), 1)) : Y("", !0),
				q(ow, {
					id: "ap-edit-asset",
					modelValue: s.value,
					"onUpdate:modelValue": n[0] ||= (e) => s.value = e,
					saving: I(u)
				}, null, 8, ["modelValue", "saving"]),
				I(f) ? (U(), G(GC, {
					key: 1,
					error: I(f),
					retry: o.value && I(f) instanceof I(Q) && I(f).code === "REVISION_CONFLICT" ? v : void 0
				}, null, 8, ["error", "retry"])) : Y("", !0),
				K("div", uw, [K("button", {
					type: "submit",
					disabled: I(u) || (o.value || e.selected) && !l.value
				}, N(I(a)("assetLibrary.save")), 9, dw), K("button", {
					type: "button",
					disabled: I(u),
					onClick: _
				}, N(I(a)("storage.cancel")), 9, fw)])
			], 32),
			o.value && !o.value.available && o.value.storage_mode === "external_reference" ? (U(), W("form", {
				key: 1,
				class: "ap-assets-form",
				onSubmit: hs(g, ["prevent"])
			}, [K("label", null, [J(N(I(a)("assetLibrary.relocate")), 1), qn(K("input", {
				"onUpdate:modelValue": n[1] ||= (e) => c.value = e,
				disabled: I(u)
			}, null, 8, pw), [[as, c.value]])]), K("button", {
				type: "submit",
				disabled: I(u) || !c.value.trim()
			}, N(I(a)("assetLibrary.relocate")), 9, mw)], 32)) : Y("", !0),
			o.value ? (U(), W("div", hw, [K("button", {
				type: "button",
				class: "ap-assets-danger",
				disabled: I(u),
				onClick: n[2] ||= (e) => h()
			}, N(I(a)("assetLibrary.unregister")), 9, gw), o.value.storage_mode === "managed" ? (U(), W("button", {
				key: 0,
				type: "button",
				class: "ap-assets-danger",
				disabled: I(u) || !o.value.available,
				onClick: n[3] ||= (e) => h(!0)
			}, N(I(a)("assetLibrary.physicalDelete")), 9, _w)) : Y("", !0)])) : Y("", !0)
		]));
	}
}), yw = ["disabled"], bw = { key: 0 }, xw = { key: 1 }, Sw = { key: 2 }, Cw = {
	key: 3,
	class: "ap-assets-checkbox"
}, ww = { for: "ap-folder-parent" }, Tw = {
	key: 0,
	class: "ap-assets-facts"
}, Ew = { for: "ap-collection-calibration-folder" }, Dw = {
	key: 2,
	class: "ap-assets-list"
}, Ow = ["title"], kw = [
	"disabled",
	"aria-label",
	"onClick"
], Aw = [
	"disabled",
	"aria-label",
	"onClick"
], jw = ["aria-label", "onClick"], Mw = { key: 0 }, Nw = { for: "ap-master-method" }, Pw = { key: 0 }, Fw = { class: "ap-assets-checkbox" }, Iw = {
	key: 0,
	class: "ap-assets-facts"
}, Lw = { for: "ap-calibration-master" }, Rw = { key: 0 }, zw = ["for"], Bw = {
	key: 0,
	class: "ap-assets-facts"
}, Vw = { key: 0 }, Hw = { for: "ap-placement-project" }, Uw = { for: "ap-placement-folder" }, Ww = {
	key: 1,
	class: "ap-assets-approval",
	role: "status"
}, Gw = { class: "ap-assets-toolbar" }, Kw = ["disabled"], qw = ["disabled"], Jw = ["disabled"], Yw = /* @__PURE__ */ z({
	__name: "LibraryEditor",
	props: {
		kind: {},
		row: {},
		defaults: {},
		targetName: {},
		assets: {},
		projects: {},
		folders: {},
		collections: {},
		placements: {},
		masters: {},
		assignments: {}
	},
	emits: [
		"changed",
		"close",
		"notice"
	],
	setup(e, { expose: t, emit: n }) {
		let r = e, i = n, { t: a } = Cf(), o = /* @__PURE__ */ F(r.row), s = /* @__PURE__ */ F(), c = {
			...r.defaults,
			...r.row
		}, l = /* @__PURE__ */ P(c.name ?? ""), u = /* @__PURE__ */ P(c.target ?? ""), d = /* @__PURE__ */ P(c.notes ?? ""), f = /* @__PURE__ */ P(!1), p = /* @__PURE__ */ P(c.project_id ?? ""), m = /* @__PURE__ */ P(c.folder_id ?? ""), h = /* @__PURE__ */ P(c.calibration_folder_id ?? ""), g = /* @__PURE__ */ P(c.parent_id ?? ""), _ = /* @__PURE__ */ P(c.asset_id ?? ""), v = /* @__PURE__ */ P(c.collection_id ?? ""), y = /* @__PURE__ */ P(c.master_id ?? ""), b = r.masters.find((e) => e.id === y.value)?.usage, x = /* @__PURE__ */ P({}), S = [...BC, "other"], C = /* @__PURE__ */ P(c.method ?? ""), w = /* @__PURE__ */ P(c.source_asset_id ?? ""), T = /* @__PURE__ */ P(c.position ?? 0), E = /* @__PURE__ */ P([...c.asset_ids ?? []]), D = /* @__PURE__ */ P(!1), O = /* @__PURE__ */ F(new Map(r.assets.map((e) => [e.id, e]))), { pending: k, run: A, error: j } = GS(), ee = /* @__PURE__ */ P(""), te = X(() => j.value?.code === "CONFIRMATION_REQUIRED" && ee.value === JSON.stringify(ye(!1))), M = X(() => ({
			value: "",
			label: a("assetLibrary.values.unspecified")
		})), ne = X(() => ({
			value: "",
			label: a("assetLibrary.rootFolder")
		})), re = X(() => [M.value, ...r.projects.map((e) => ({
			value: e.id,
			label: e.name
		}))]);
		function ie(e) {
			let t = [e.name], n = /* @__PURE__ */ new Set([e.id]), i = r.folders.find((t) => t.id === e.parent_id);
			for (; i && !n.has(i.id);) t.unshift(i.name), n.add(i.id), i = r.folders.find((e) => e.id === i?.parent_id);
			return t.join(" / ");
		}
		function ae(e) {
			let t = /* @__PURE__ */ new Set([e]), n = [e];
			for (; n.length;) {
				n = r.folders.filter((e) => e.parent_id && n.includes(e.parent_id) && !t.has(e.id)).map((e) => e.id);
				for (let e of n) t.add(e);
			}
			return t;
		}
		let oe = X(() => {
			let e = r.kind === "folders" && o.value ? ae(o.value.id) : /* @__PURE__ */ new Set();
			return [ne.value, ...r.folders.filter((t) => (t.project_id ?? "") === p.value && !e.has(t.id)).map((e) => ({
				value: e.id,
				label: ie(e)
			}))];
		}), se = X(() => [ne.value, ...r.folders.filter((e) => !e.project_id).map((e) => ({
			value: e.id,
			label: ie(e)
		}))]), ce = X(() => r.collections.filter((e) => e.id !== o.value?.id).flatMap((e) => e.asset_ids)), le = X(() => O.value.get(_.value)), ue = X(() => new Set(r.assignments.filter((e) => _.value ? e.asset_id === _.value : e.collection_id === v.value).map((e) => e.usage ?? r.masters.find((t) => t.id === e.master_id)?.usage))), de = X(() => S.filter((e) => !ue.value.has(e))), fe = X(() => de.value.map((e) => x.value[e]).filter(Boolean)), pe = X(() => (o.value ? [y.value] : fe.value).map((e) => r.masters.find((t) => t.id === e)).filter((e) => e !== void 0).map((e) => ({
			master: e,
			asset: O.value.get(e.asset_id)
		})));
		function me(e) {
			return [M.value, ...r.masters.filter((t) => !e || t.usage === e).map((e) => ({
				value: e.id,
				label: O.value.get(e.asset_id)?.name ?? e.asset_id
			}))];
		}
		function he(e) {
			O.value = new Map(O.value).set(e.id, e);
		}
		function ge(e) {
			return O.value.get(e)?.name ?? e;
		}
		function _e(e, t) {
			he(e), t === "asset" && (_.value = e.id), t === "source" && (w.value = e.id), t === "member" && !E.value.includes(e.id) && E.value.push(e.id);
		}
		function ve(e, t) {
			let n = E.value[e];
			E.value.splice(e, 1), E.value.splice(e + t, 0, n);
		}
		zr(() => {
			let e = [.../* @__PURE__ */ new Set([
				_.value,
				w.value,
				...E.value,
				...r.kind === "assignments" ? r.masters.map((e) => e.asset_id) : []
			])].filter((e) => e && !O.value.has(e));
			e.length && A(async (t) => {
				for (let n of e) try {
					he(await ky("assets", n, t));
				} catch (e) {
					if (t.aborted || !(e instanceof Q) || e.status !== 404) throw e;
				}
			});
		});
		function ye(e) {
			switch (r.kind) {
				case "projects": return {
					name: l.value.trim(),
					target: u.value.trim() || null,
					notes: d.value.trim() || null,
					...!o.value && f.value ? { template: !0 } : {}
				};
				case "folders": return {
					name: l.value.trim(),
					project_id: p.value || null,
					parent_id: g.value || null
				};
				case "collections": return {
					name: l.value.trim(),
					asset_ids: E.value,
					calibration_folder_id: h.value || null,
					...e ? { confirmed: !0 } : {}
				};
				case "sessions": return {
					name: l.value.trim(),
					asset_ids: E.value,
					notes: d.value.trim() || null
				};
				case "masters": return {
					asset_id: _.value,
					folder_id: m.value || null,
					method: C.value || null,
					source_asset_id: w.value || null
				};
				case "assignments": return {
					..._.value ? { asset_id: _.value } : { collection_id: v.value },
					...o.value ? { master_id: y.value } : { master_ids: fe.value },
					...e ? { confirmed: !0 } : {}
				};
				case "placements": return {
					project_id: p.value,
					folder_id: m.value || null,
					..._.value ? { asset_id: _.value } : { collection_id: v.value },
					position: T.value
				};
			}
		}
		let be = X(() => [
			"projects",
			"folders",
			"collections",
			"sessions"
		].includes(r.kind)), xe = X(() => be.value ? !!l.value.trim() : r.kind === "masters" ? !!_.value && (le.value?.attributes.usage !== "flat" || D.value && !!C.value && !!w.value) : r.kind === "assignments" ? o.value ? !!y.value : fe.value.length > 0 : !!p.value && !!(_.value || v.value));
		function Se() {
			if (!xe.value) return;
			let e = te.value, t = JSON.stringify(ye(!1));
			A(async (n) => {
				if (e && !await WS(a("assetLibrary.confirm"), a("assetLibrary.confirmMismatch"))) return;
				let s = ye(e), c = r.kind === "placements" && r.placements.find((e) => e.project_id === p.value && (_.value ? e.asset_id === _.value : e.collection_id === v.value)), l;
				try {
					r.kind === "assignments" && !o.value ? await My(s, n) : l = await Ay(r.kind, s, n, o.value || c || void 0);
				} catch (e) {
					throw ee.value = e instanceof Q && e.code === "CONFIRMATION_REQUIRED" ? t : "", e;
				}
				n.aborted || (i("changed", l), i("notice", a("assetLibrary.saved")), i("close"));
			});
		}
		function Ce() {
			A(async (e) => {
				o.value && (s.value = await ky(r.kind, o.value.id, e));
			});
		}
		function we() {
			s.value &&= (o.value = s.value, void 0);
		}
		function Te() {
			A(async (e) => {
				let t = o.value;
				if (!t) return;
				let n = r.kind === "folders" ? ae(t.id) : /* @__PURE__ */ new Set(), s = r.placements.filter((e) => e.project_id === t.id || e.folder_id && n.has(e.folder_id)).length;
				await WS(a("assetLibrary.remove"), a("assetLibrary.removeRelations", { count: s }), c.name, "delete") && (await jy(r.kind, t, e, { confirmed: !0 }), e.aborted || (i("changed"), i("notice", a("assetLibrary.saved")), i("close")));
			});
		}
		async function Ee() {
			k.value || (JSON.stringify(ye(!1)) === De || await WS(a("assetLibrary.discard"), a("assetLibrary.discardConfirm"))) && i("close");
		}
		let De = JSON.stringify(ye(!1));
		return t({ discardDraft: Ee }), (t, n) => (U(), W("form", {
			class: "ap-assets-form ap-assets-dialog-content",
			onSubmit: hs(Se, ["prevent"])
		}, [
			K("fieldset", {
				disabled: I(k),
				class: "ap-assets-form"
			}, [
				be.value ? (U(), W("label", bw, [J(N(I(a)("assetLibrary.name")), 1), qn(K("input", {
					"onUpdate:modelValue": n[0] ||= (e) => l.value = e,
					maxlength: "120",
					required: ""
				}, null, 512), [[as, l.value]])])) : Y("", !0),
				e.kind === "projects" ? (U(), W("label", xw, [J(N(I(a)("assetLibrary.fields.target")), 1), qn(K("input", { "onUpdate:modelValue": n[1] ||= (e) => u.value = e }, null, 512), [[as, u.value]])])) : Y("", !0),
				e.kind === "projects" || e.kind === "sessions" ? (U(), W("label", Sw, [J(N(I(a)("assetLibrary.fields.notes")), 1), qn(K("textarea", { "onUpdate:modelValue": n[2] ||= (e) => d.value = e }, null, 512), [[as, d.value]])])) : Y("", !0),
				e.kind === "projects" && !e.row ? (U(), W("label", Cw, [qn(K("input", {
					"onUpdate:modelValue": n[3] ||= (e) => f.value = e,
					type: "checkbox"
				}, null, 512), [[os, f.value]]), J(" " + N(I(a)("assetLibrary.projectTemplate")), 1)])) : Y("", !0),
				e.kind === "folders" ? (U(), W(H, { key: 4 }, [K("label", ww, N(I(a)("assetLibrary.parentFolder")), 1), q(I(US), {
					id: "ap-folder-parent",
					value: g.value,
					options: oe.value,
					label: I(a)("assetLibrary.parentFolder"),
					disabled: I(k),
					onChange: n[4] ||= (e) => g.value = e
				}, null, 8, [
					"value",
					"options",
					"label",
					"disabled"
				])], 64)) : Y("", !0),
				e.kind === "collections" || e.kind === "sessions" ? (U(), W(H, { key: 5 }, [
					e.kind === "collections" ? (U(), W("div", Tw, [K("strong", null, N(I(a)("assetLibrary.processingConditions")), 1), (U(!0), W(H, null, B(I(VC), (e) => (U(), W("div", { key: e }, [K("small", null, N(I(a)("assetLibrary.fields." + e)) + " · " + N([...new Set(E.value.map((t) => O.value.get(t)?.attributes[e] ?? I(a)("assetLibrary.values.unknown")))].join(" / ")), 1)]))), 128))])) : Y("", !0),
					e.kind === "collections" ? (U(), W(H, { key: 1 }, [K("label", Ew, N(I(a)("assetLibrary.calibrationFolder")), 1), q(I(US), {
						id: "ap-collection-calibration-folder",
						value: h.value,
						label: I(a)("assetLibrary.calibrationFolder"),
						options: se.value,
						disabled: I(k),
						onChange: n[5] ||= (e) => h.value = e
					}, null, 8, [
						"value",
						"label",
						"options",
						"disabled"
					])], 64)) : Y("", !0),
					K("h3", null, N(I(a)("assetLibrary.members", { count: E.value.length })), 1),
					E.value.length ? (U(), W("ol", Dw, [(U(!0), W(H, null, B(E.value, (e, t) => (U(), W("li", {
						key: e,
						class: "ap-assets-row"
					}, [
						K("span", {
							class: "ap-assets-truncate",
							title: ge(e)
						}, N(ge(e)), 9, Ow),
						K("button", {
							type: "button",
							disabled: t === 0,
							"aria-label": I(a)("assetLibrary.moveUp"),
							onClick: (e) => ve(t, -1)
						}, "↑", 8, kw),
						K("button", {
							type: "button",
							disabled: t === E.value.length - 1,
							"aria-label": I(a)("assetLibrary.moveDown"),
							onClick: (e) => ve(t, 1)
						}, "↓", 8, Aw),
						K("button", {
							type: "button",
							"aria-label": I(a)("assetLibrary.removeEntry", { name: ge(e) }),
							onClick: (e) => E.value.splice(t, 1)
						}, N(I(a)("assetLibrary.remove")), 9, jw)
					]))), 128))])) : Y("", !0),
					K("h3", null, N(I(a)("assetLibrary.addMembers")), 1),
					q(ZC, {
						selected: E.value,
						excluded: e.kind === "collections" ? ce.value : void 0,
						onPick: n[6] ||= (e) => _e(e, "member")
					}, null, 8, ["selected", "excluded"])
				], 64)) : Y("", !0),
				e.kind === "masters" ? (U(), W(H, { key: 6 }, [
					_.value ? (U(), W("p", Mw, N(I(a)("assetLibrary.asset")) + " · " + N(ge(_.value)), 1)) : Y("", !0),
					e.row ? Y("", !0) : (U(), G(ZC, {
						key: 1,
						selected: _.value ? [_.value] : [],
						onPick: n[7] ||= (e) => _e(e, "asset")
					}, null, 8, ["selected"])),
					le.value?.attributes.usage === "flat" ? (U(), W(H, { key: 2 }, [
						K("p", null, N(I(a)("assetLibrary.flatRequirements")), 1),
						K("label", Nw, N(I(a)("assetLibrary.calibrationMethod")), 1),
						q(I(US), {
							id: "ap-master-method",
							value: C.value,
							disabled: I(k),
							label: I(a)("assetLibrary.calibrationMethod"),
							options: [M.value, ...["bias", "dark_flat"].map((e) => ({
								value: e,
								label: I(a)("assetLibrary.values." + e)
							}))],
							onChange: n[8] ||= (e) => {
								C.value = e, w.value = "";
							}
						}, null, 8, [
							"value",
							"disabled",
							"label",
							"options"
						]),
						w.value ? (U(), W("p", Pw, N(ge(w.value)), 1)) : Y("", !0),
						C.value ? (U(), G(ZC, {
							key: C.value,
							usage: C.value,
							excluded: [_.value],
							selected: w.value ? [w.value] : [],
							onPick: n[9] ||= (e) => _e(e, "source")
						}, null, 8, [
							"usage",
							"excluded",
							"selected"
						])) : Y("", !0),
						K("label", Fw, [qn(K("input", {
							"onUpdate:modelValue": n[10] ||= (e) => D.value = e,
							type: "checkbox"
						}, null, 512), [[os, D.value]]), J(N(I(a)("assetLibrary.flatConfirmed")), 1)])
					], 64)) : Y("", !0)
				], 64)) : Y("", !0),
				e.kind === "assignments" ? (U(), W(H, { key: 7 }, [
					K("p", null, [K("strong", null, N(r.targetName), 1)]),
					le.value ? (U(), W("div", Iw, [(U(!0), W(H, null, B(I(VC), (e) => (U(), W("small", { key: e }, N(I(a)("assetLibrary.fields." + e)) + " · " + N(le.value.attributes[e] ?? I(a)("assetLibrary.values.unknown")), 1))), 128))])) : Y("", !0),
					o.value ? (U(), W(H, { key: 1 }, [K("label", Lw, N(I(a)("assetLibrary.master")), 1), q(I(US), {
						id: "ap-calibration-master",
						value: y.value,
						options: me(I(b)),
						label: I(a)("assetLibrary.master"),
						disabled: I(k),
						onChange: n[11] ||= (e) => y.value = e
					}, null, 8, [
						"value",
						"options",
						"label",
						"disabled"
					])], 64)) : (U(), W(H, { key: 2 }, [ue.value.size ? (U(), W("p", Rw, N(I(a)("assetLibrary.assignedUsages")), 1)) : Y("", !0), (U(!0), W(H, null, B(de.value, (e) => (U(), W(H, { key: e }, [K("label", { for: "ap-calibration-" + e }, N(I(a)("assetLibrary.calibrationUse." + e)), 9, zw), q(I(US), {
						id: "ap-calibration-" + e,
						value: x.value[e] || "",
						options: me(e),
						label: I(a)("assetLibrary.calibrationUse." + e),
						disabled: I(k) || me(e).length === 1,
						onChange: (t) => x.value[e] = t
					}, null, 8, [
						"id",
						"value",
						"options",
						"label",
						"disabled",
						"onChange"
					])], 64))), 128))], 64)),
					(U(!0), W(H, null, B(pe.value, ({ master: e, asset: t }) => (U(), W(H, { key: e.id }, [t ? (U(), W("div", Bw, [K("strong", null, N(t.name), 1), (U(!0), W(H, null, B(I(VC), (e) => (U(), W("small", { key: e }, N(I(a)("assetLibrary.fields." + e)) + " · " + N(t.attributes[e] ?? I(a)("assetLibrary.values.unknown")), 1))), 128))])) : Y("", !0)], 64))), 128))
				], 64)) : Y("", !0),
				e.kind === "placements" ? (U(), W(H, { key: 8 }, [
					r.targetName ? (U(), W("p", Vw, [K("strong", null, N(r.targetName), 1)])) : Y("", !0),
					K("label", Hw, N(I(a)("assetLibrary.project")), 1),
					q(I(US), {
						id: "ap-placement-project",
						value: p.value,
						options: re.value,
						label: I(a)("assetLibrary.project"),
						disabled: I(k) || !!e.row,
						onChange: n[12] ||= (e) => {
							p.value = e, m.value = "";
						}
					}, null, 8, [
						"value",
						"options",
						"label",
						"disabled"
					]),
					K("label", null, [J(N(I(a)("assetLibrary.position")), 1), qn(K("input", {
						"onUpdate:modelValue": n[13] ||= (e) => T.value = e,
						type: "number",
						min: "0",
						step: "1"
					}, null, 512), [[
						as,
						T.value,
						void 0,
						{ number: !0 }
					]])])
				], 64)) : Y("", !0),
				e.kind === "masters" || e.kind === "placements" ? (U(), W(H, { key: 9 }, [K("label", Uw, N(I(a)("assetLibrary.folder")), 1), q(I(US), {
					id: "ap-placement-folder",
					value: m.value,
					options: oe.value,
					label: I(a)("assetLibrary.folder"),
					disabled: I(k),
					onChange: n[14] ||= (e) => m.value = e
				}, null, 8, [
					"value",
					"options",
					"label",
					"disabled"
				])], 64)) : Y("", !0)
			], 8, yw),
			I(j) ? (U(), G(GC, {
				key: 0,
				error: I(j),
				retry: I(j).code === "REVISION_CONFLICT" ? Ce : void 0
			}, null, 8, ["error", "retry"])) : Y("", !0),
			s.value ? (U(), W("div", Ww, [
				K("strong", null, N(I(a)("assetLibrary.latestVersion")), 1),
				K("pre", null, N(JSON.stringify(s.value, null, 2)), 1),
				K("button", {
					type: "button",
					onClick: we
				}, N(I(a)("assetLibrary.keepDraft")), 1)
			])) : Y("", !0),
			K("div", Gw, [
				K("button", {
					type: "submit",
					disabled: I(k) || !xe.value || !!s.value
				}, N(I(a)("assetLibrary." + (te.value ? "confirm" : "save"))), 9, Kw),
				K("button", {
					type: "button",
					disabled: I(k),
					onClick: Ee
				}, N(I(a)("storage.cancel")), 9, qw),
				o.value ? (U(), W("button", {
					key: 0,
					type: "button",
					class: "ap-assets-danger",
					disabled: I(k),
					onClick: Te
				}, N(I(a)("assetLibrary.remove")), 9, Jw)) : Y("", !0)
			])
		], 32));
	}
}), Xw = ["aria-label"], Zw = {
	key: 0,
	role: "none"
}, Qw = ["onKeydown"], $w = ["aria-label", "disabled"], eT = ["disabled"], tT = ["disabled"], nT = { class: "ap-folder-row" }, rT = [
	"aria-level",
	"aria-expanded",
	"aria-selected",
	"tabindex",
	"data-tree-id",
	"draggable",
	"onContextmenu",
	"onFocus",
	"onKeydown",
	"onClick",
	"onDragstart",
	"onDragover",
	"onDrop"
], iT = ["title"], aT = { key: 1 }, oT = { key: 2 }, sT = ["aria-label"], cT = { class: "ap-assets-row-menu" }, lT = ["disabled", "onClick"], uT = ["disabled", "onClick"], dT = ["disabled", "onClick"], fT = ["onKeydown"], pT = ["aria-label", "disabled"], mT = ["disabled"], hT = ["disabled"], gT = /* @__PURE__ */ z({
	__name: "LibraryTree",
	props: {
		entries: {},
		selected: {},
		query: {},
		canDrop: { type: Boolean },
		projectId: {},
		folders: {},
		placements: {},
		dropTarget: {}
	},
	emits: [
		"select",
		"over",
		"drop",
		"drag",
		"dragEnd",
		"changed"
	],
	setup(e, { expose: t, emit: n }) {
		let r = e, i = n, { t: a } = Cf(), o = /* @__PURE__ */ P(/* @__PURE__ */ new Set()), s = /* @__PURE__ */ P(""), c = /* @__PURE__ */ P();
		function l(e, t) {
			let n = new Set(o.value);
			t ? n.add(e) : n.delete(e), o.value = n;
		}
		let u = /* @__PURE__ */ P(), d = /* @__PURE__ */ P("");
		R(() => r.projectId, () => {
			u.value = void 0;
		});
		let { run: f, pending: p, error: m } = GS(), h = /* @__PURE__ */ P(!1);
		R(m, (e) => {
			if (!e || u.value || e.details || e.status === 409) {
				h.value = !1;
				return;
			}
			let t = e.code, n = a("assetLibrary.errors." + t, a("storage.errors." + t, a("errors." + t, a("errors.unknown"))));
			h.value = Uv("error", n + " · " + t);
		});
		async function g(e, t) {
			p.value || (e && l(e, !0), u.value = {
				parentId: e,
				folder: t
			}, d.value = t?.name ?? "", await Fn(), c.value?.querySelector("[data-folder-name]")?.focus());
		}
		function _() {
			p.value || (u.value = void 0);
		}
		function v() {
			let e = u.value, t = d.value.trim(), n = r.projectId;
			e && t && n && f(async (r) => {
				await Ay("folders", {
					name: t,
					project_id: n,
					parent_id: e.parentId
				}, r, e.folder), r.aborted || (u.value = void 0, i("changed"));
			});
		}
		function y(e) {
			f(async (t) => {
				let n = /* @__PURE__ */ new Set([e.id]), o = [e.id];
				for (; o.length;) o = (r.folders ?? []).filter((e) => e.parent_id && o.includes(e.parent_id)).filter((e) => !n.has(e.id)).map((e) => e.id), o.forEach((e) => n.add(e));
				let s = (r.placements ?? []).filter((e) => e.folder_id && n.has(e.folder_id)).length;
				await WS(a("assetLibrary.remove"), a("assetLibrary.removeFolderHelp", {
					folders: n.size,
					count: s
				}), e.name, "delete") && (await jy("folders", e, t, { confirmed: !0 }), t.aborted || (u.value = void 0, i("changed")));
			});
		}
		t({ startFolder: (e) => g(e) });
		function b(e, t) {
			if (!r.projectId || !t.folder) return;
			e.preventDefault(), s.value = t.id, i("select", t);
			let n = e.currentTarget.closest(".ap-folder-row")?.querySelector(".ap-folder-menu");
			c.value?.querySelectorAll(".ap-folder-menu[open]").forEach((e) => {
				e.open = !1;
			}), n && (n.open = !0);
		}
		let x = X(() => {
			let e = r.query?.trim().toLocaleLowerCase();
			if (!e) return r.entries;
			function t(n) {
				let r = [];
				for (let i of n) if (i.label.toLocaleLowerCase().includes(e)) r.push(i);
				else if (i.children) {
					let e = t(i.children);
					e.length && r.push({
						...i,
						children: e
					});
				}
				return r;
			}
			return t(r.entries);
		}), S = (e) => !!r.query?.trim() || o.value.has(e), C = X(() => {
			let e = [];
			function t(n, r, i) {
				for (let a of n) e.push({
					entry: a,
					level: r,
					parent: i
				}), a.children && S(a.id) && t(a.children, r + 1, a.id);
			}
			return t(x.value, 1), e;
		}), w = X(() => C.value.some((e) => e.entry.id === s.value) ? s.value : C.value[0]?.entry.id);
		async function T(e) {
			if (!e) return;
			s.value = e, await Fn();
			let t = c.value?.querySelectorAll("[data-tree-id]");
			Array.from(t ?? []).find((t) => t.dataset.treeId === e)?.focus();
		}
		function E(e, t) {
			let { entry: n, parent: i } = C.value[t], a;
			switch (e.key) {
				case "ArrowUp":
					a = C.value[t - 1]?.entry.id;
					break;
				case "ArrowDown":
					a = C.value[t + 1]?.entry.id;
					break;
				case "Home":
					a = C.value[0]?.entry.id;
					break;
				case "End":
					a = C.value.at(-1)?.entry.id;
					break;
				case "ArrowRight":
					n.children && !S(n.id) ? l(n.id, !0) : a = n.children?.[0]?.id;
					break;
				case "ArrowLeft":
					n.children && S(n.id) && !r.query ? l(n.id, !1) : a = i;
					break;
				default: return;
			}
			e.preventDefault(), T(a);
		}
		function D(e) {
			s.value = e.id, e.children && l(e.id, !S(e.id)), i("select", e);
		}
		return (t, n) => (U(), W(H, null, [K("ul", {
			ref_key: "tree",
			ref: c,
			class: "ap-assets-list",
			role: "tree",
			"aria-label": I(a)("assetLibrary.folderTree")
		}, [u.value && !u.value.folder && !u.value.parentId ? (U(), W("li", Zw, [K("form", {
			class: "ap-folder-inline",
			onSubmit: hs(v, ["prevent"]),
			onKeydown: _s(hs(_, ["stop", "prevent"]), ["esc"])
		}, [
			qn(K("input", {
				"onUpdate:modelValue": n[0] ||= (e) => d.value = e,
				"data-folder-name": "",
				"aria-label": I(a)("assetLibrary.folderName"),
				disabled: I(p),
				required: "",
				maxlength: "120"
			}, null, 8, $w), [[as, d.value]]),
			K("button", {
				type: "submit",
				disabled: I(p) || !d.value.trim()
			}, N(I(a)("assetLibrary.save")), 9, eT),
			K("button", {
				type: "button",
				disabled: I(p),
				onClick: _
			}, N(I(a)("storage.cancel")), 9, tT)
		], 40, Qw)])) : Y("", !0), (U(!0), W(H, null, B(C.value, ({ entry: t, level: r }, o) => (U(), W("li", {
			key: t.id,
			role: "none"
		}, [K("div", nT, [K("button", {
			type: "button",
			role: "treeitem",
			class: me(["ap-tree-row ap-assets-tree-row", { "ap-drop-active": e.dropTarget === t.id }]),
			"aria-level": r,
			"aria-expanded": t.children ? S(t.id) : void 0,
			"aria-selected": e.selected === t.id,
			style: le({ paddingInlineStart: Math.min(50, 6 + (r - 1) * 12) + "px" }),
			tabindex: w.value === t.id ? 0 : -1,
			"data-tree-id": t.id,
			draggable: !!t.placement || !!t.folder,
			onContextmenu: (e) => b(e, t),
			onFocus: (e) => s.value = t.id,
			onKeydown: (e) => E(e, o),
			onClick: (e) => D(t),
			onDragstart: (e) => i("drag", e, t),
			onDragend: n[1] ||= (e) => i("dragEnd"),
			onDragover: (n) => e.canDrop && t.folder && i("over", n, t),
			onDrop: (n) => e.canDrop && t.folder && i("drop", n, t)
		}, [
			t.children ? (U(), G(I($v), { key: 0 })) : Y("", !0),
			K("span", { title: t.label }, N(t.label), 9, iT),
			t.placement?.collection_id || t.collection ? (U(), W("small", aT, N(I(a)("assetLibrary.collection")), 1)) : t.master ? (U(), W("small", oT, N(I(a)("assetLibrary.master")), 1)) : Y("", !0)
		], 46, rT), e.projectId && t.folder ? (U(), W("details", {
			key: 0,
			class: "ap-folder-menu",
			onKeydown: n[2] ||= _s(hs((e) => e.currentTarget.open = !1, ["stop"]), ["esc"])
		}, [K("summary", { "aria-label": I(a)("assetLibrary.folderActions", { name: t.label }) }, "⋯", 8, sT), K("div", cT, [
			K("button", {
				type: "button",
				disabled: I(p),
				onClick: (e) => {
					g(t.folder.id), e.currentTarget.closest("details").open = !1;
				}
			}, N(I(a)("assetLibrary.newSubfolder")), 9, lT),
			K("button", {
				type: "button",
				disabled: I(p),
				onClick: (e) => {
					g(t.folder.parent_id, t.folder), e.currentTarget.closest("details").open = !1;
				}
			}, N(I(a)("assetLibrary.renameFolder")), 9, uT),
			K("button", {
				type: "button",
				disabled: I(p),
				onClick: (e) => {
					y(t.folder), e.currentTarget.closest("details").open = !1;
				}
			}, N(I(a)("assetLibrary.deleteFolder")), 9, dT)
		])], 32)) : Y("", !0)]), u.value && (u.value.folder?.id === t.folder?.id && u.value.folder || !u.value.folder && u.value.parentId === t.folder?.id) ? (U(), W("form", {
			key: 0,
			class: "ap-folder-inline",
			style: le({ paddingInlineStart: Math.min(50, 20 + r * 12) + "px" }),
			onSubmit: hs(v, ["prevent"]),
			onKeydown: _s(hs(_, ["stop", "prevent"]), ["esc"])
		}, [
			qn(K("input", {
				"onUpdate:modelValue": n[3] ||= (e) => d.value = e,
				"data-folder-name": "",
				"aria-label": I(a)("assetLibrary.folderName"),
				disabled: I(p),
				required: "",
				maxlength: "120"
			}, null, 8, pT), [[as, d.value]]),
			K("button", {
				type: "submit",
				disabled: I(p) || !d.value.trim()
			}, N(I(a)("assetLibrary.save")), 9, mT),
			K("button", {
				type: "button",
				disabled: I(p),
				onClick: _
			}, N(I(a)("storage.cancel")), 9, hT)
		], 44, fT)) : Y("", !0)]))), 128))], 8, Xw), I(m) && !h.value ? (U(), G(GC, {
			key: 0,
			error: I(m)
		}, null, 8, ["error"])) : Y("", !0)], 64));
	}
});
// src/api/nativePicker.ts
async function _T(e, t) {
	let n = await If("/astrophoto/v1/storage/native-picker", "POST", { kind: e }, t, 19e4);
	if (!$(n) || ![
		"selected",
		"cancelled",
		"unavailable",
		"busy"
	].includes(String(n.status)) || n.path !== null && typeof n.path != "string") throw new Q("schema");
	return n;
}
// src/features/storage/StorageError.vue?vue&type=script&setup=true&lang.ts
var vT = {
	role: "alert",
	class: "ap-storage-error"
}, yT = /* @__PURE__ */ z({
	__name: "StorageError",
	props: {
		code: {},
		notify: {
			type: Boolean,
			default: !0
		}
	},
	setup(e) {
		let t = e, { t: n } = Cf();
		return R(() => t.code, (e) => {
			e && t.notify !== !1 && Uv("error", n("storage.errors." + e, n("storage.error")) + " · " + e);
		}, { immediate: !0 }), (t, r) => (U(), W("p", vT, [J(N(I(n)("storage.errors." + e.code, I(n)("storage.error"))) + " ", 1), K("code", null, N(e.code), 1)]));
	}
});
// src/features/storage/useStorageAction.ts
function bT() {
	let e = new AbortController(), t = /* @__PURE__ */ P(!1), n = /* @__PURE__ */ P(""), r = /* @__PURE__ */ P();
	ke(() => e.abort());
	async function i(i) {
		let { signal: a } = e;
		if (!(a.aborted || t.value)) {
			t.value = !0, n.value = "", r.value = void 0;
			try {
				await i(a);
			} catch (e) {
				a.aborted || (n.value = e instanceof Q ? e.code : "network", r.value = e instanceof Q ? e.details : void 0);
			} finally {
				a.aborted || (t.value = !1);
			}
		}
	}
	return {
		pending: t,
		error: n,
		details: r,
		run: i
	};
}
// src/features/storage/OperationProgress.vue?vue&type=script&setup=true&lang.ts
var xT = ["aria-label"], ST = { role: "status" }, CT = ["data-state"], wT = [
	"aria-label",
	"value",
	"max"
], TT = { key: 0 }, ET = { key: 1 }, DT = {
	key: 2,
	class: "ap-storage-path"
}, OT = { key: 3 }, kT = ["disabled"], AT = ["disabled"], jT = ["disabled"], MT = ["disabled"], NT = /* @__PURE__ */ z({
	__name: "OperationProgress",
	props: {
		job: {},
		onTerminal: { type: Function },
		onRetryRemaining: { type: Function }
	},
	setup(e) {
		let n = e, { t: r } = Cf(), i = /* @__PURE__ */ F(), a = /* @__PURE__ */ P(""), o = /* @__PURE__ */ P(0), { pending: s, error: c, run: l } = bT(), u = [
			"completed",
			"failed",
			"cancelled"
		], d = [
			"registered",
			"copied",
			"skipped",
			"failed",
			"verification"
		];
		R([
			() => n.job.operation_id,
			() => n.job.kind,
			o
		], ([e, t], r, o) => {
			let s = new AbortController(), c;
			o(() => {
				s.abort(), clearTimeout(c);
			});
			async function l() {
				try {
					let r = await Jy({
						operation_id: e,
						kind: t,
						phase: "queued"
					}, s.signal);
					if (s.signal.aborted) return;
					i.value = r, a.value = "", u.includes(r.phase) ? n.onTerminal() : r.error || (c = setTimeout(() => void l(), 800));
				} catch (e) {
					s.signal.aborted || (a.value = e instanceof Q ? e.code : "network");
				}
			}
			l();
		}, { immediate: !0 });
		let f = X(() => i.value?.phase ?? "queued"), p = X(() => i.value?.receipt), m = X(() => f.value === "completed" && typeof p.value?.failed == "number" && p.value.failed > 0), h = X(() => a.value || c.value || i.value?.error?.code), g = X(() => typeof p.value?.retryable == "number" ? p.value.retryable : 0);
		function _(e) {
			l(async (t) => {
				await Wy(`${Ky(n.job)}/${e}`, {}, t), t.aborted || o.value++;
			});
		}
		function v() {
			l(async (e) => {
				let t = await Wy(`/library/imports/${encodeURIComponent(n.job.operation_id)}/retry-remaining`, {}, e);
				if (typeof t.operation_id != "string") throw new Q("schema");
				e.aborted || n.onRetryRemaining?.(t.operation_id);
			});
		}
		function y() {
			let e = Ky(n.job) + "/discard-target";
			l(async (n) => {
				let i = await Wy(e, {}, n);
				if (!Array.isArray(i.files) || !i.files.every((e) => typeof e == "string")) throw new Q("schema");
				let a = await t.extensionManager.dialog.confirm({
					key: "astrophoto.discard-migration-target",
					type: "delete",
					title: r("storage.discardTarget"),
					message: r("storage.discardTargetHelp"),
					itemList: i.files.slice(0, 50)
				});
				n.aborted || a !== !0 || (await Wy(e, { confirm: !0 }, n), n.aborted || o.value++);
			});
		}
		return (t, n) => (U(), W("section", {
			class: "ap-operation",
			"aria-label": I(r)("storage.operation")
		}, [
			K("div", ST, [
				K("strong", {
					class: "ap-storage-badge",
					"data-state": f.value
				}, N(I(r)("storage.phases." + (m.value ? "partial" : f.value), f.value)), 9, CT),
				K("p", null, [K("code", null, N(e.job.operation_id), 1)]),
				typeof p.value?.processed == "number" && typeof p.value.total == "number" ? (U(), W("progress", {
					key: 0,
					"aria-label": I(r)("storage.operation"),
					value: p.value.processed,
					max: Math.max(1, p.value.total)
				}, null, 8, wT)) : Y("", !0),
				(U(), W(H, null, B(d, (e) => (U(), W(H, { key: e }, [typeof p.value?.[e] == "number" || typeof p.value?.[e] == "string" ? (U(), W("p", TT, N(I(r)("storage." + e)) + " " + N(p.value[e]), 1)) : Y("", !0)], 64))), 64)),
				typeof p.value?.completed_bytes == "number" ? (U(), W("p", ET, N(I(r)("storage.movedBytes")) + " " + N(I(qS)(p.value.completed_bytes)), 1)) : Y("", !0),
				typeof p.value?.target_path == "string" ? (U(), W("p", DT, N(I(r)("storage.migrationTarget")) + " " + N(p.value.target_path), 1)) : Y("", !0),
				Array.isArray(p.value?.cleanup_remaining) && p.value.cleanup_remaining.length ? (U(), W("p", OT, N(I(r)("storage.cleanupCount")) + " " + N(p.value.cleanup_remaining.length), 1)) : Y("", !0)
			]),
			h.value ? (U(), G(yT, {
				key: 0,
				code: h.value,
				notify: !!a.value || !!I(c)
			}, null, 8, ["code", "notify"])) : Y("", !0),
			Array.isArray(p.value?.errors) ? (U(!0), W(H, { key: 1 }, B(p.value.errors, (e) => (U(), W("div", { key: e.entry }, [J("#" + N(e.entry) + " ", 1), q(yT, {
				code: e.code,
				notify: !1
			}, null, 8, ["code"])]))), 128)) : Y("", !0),
			f.value !== "committed" && !u.includes(f.value) ? (U(), W("button", {
				key: 2,
				type: "button",
				class: "ap-storage-button",
				disabled: I(s),
				onClick: n[0] ||= (e) => _("cancel")
			}, N(I(r)("storage.cancel")), 9, kT)) : Y("", !0),
			a.value ? (U(), W("button", {
				key: 3,
				type: "button",
				class: "ap-storage-button",
				onClick: n[1] ||= (e) => o.value++
			}, N(I(r)("actions.refresh")), 1)) : Y("", !0),
			i.value?.error && !u.includes(f.value) ? (U(), W("button", {
				key: 4,
				type: "button",
				class: "ap-storage-button",
				disabled: I(s),
				onClick: n[2] ||= (e) => _("retry")
			}, N(I(r)("storage.retry")), 9, AT)) : Y("", !0),
			e.job.kind === "import" && e.onRetryRemaining && u.includes(f.value) && g.value > 0 ? (U(), W("button", {
				key: 5,
				type: "button",
				class: "ap-storage-button",
				disabled: I(s),
				onClick: v
			}, N(I(r)("assetLibrary.retryRemaining", { count: g.value })), 9, jT)) : Y("", !0),
			e.job.kind === "migration" && p.value?.target_cleanup_available === !0 && !p.value?.target_cleanup ? (U(), W("button", {
				key: 6,
				type: "button",
				class: "ap-storage-button",
				disabled: I(s),
				onClick: y
			}, N(I(r)("storage.discardTarget")), 9, MT)) : Y("", !0)
		], 8, xT));
	}
}), PT = ["aria-label"], FT = { class: "ap-directory-dialog-body" }, IT = { class: "ap-directory-dialog-header" }, LT = ["aria-label"], RT = ["aria-label"], zT = ["disabled"], BT = ["disabled", "onClick"], VT = ["disabled"], HT = {
	key: 2,
	role: "status"
}, UT = {
	key: 3,
	class: "ap-directory-list"
}, WT = ["onClick"], GT = ["onClick"], KT = {
	key: 4,
	class: "ap-storage-path"
}, qT = { class: "ap-storage-actions" }, JT = ["disabled"], YT = /* @__PURE__ */ z({
	__name: "SourceBrowser",
	props: { allowDirectory: { type: Boolean } },
	emits: ["close", "choose"],
	setup(e, { emit: t }) {
		let n = e, r = t, { t: i } = Cf(), a = /* @__PURE__ */ P(), o = /* @__PURE__ */ P(null), s = /* @__PURE__ */ P(null), c = /* @__PURE__ */ P([]), l = /* @__PURE__ */ P([]), u = /* @__PURE__ */ P(!1), d = /* @__PURE__ */ P(""), f = new AbortController();
		ke(() => f.abort());
		let p = X(() => {
			if (!o.value) return [];
			let e = /^[A-Za-z]:[\\/]/.test(o.value), t = e ? "\\" : "/", n = o.value.split(/[\\/]+/).filter(Boolean), r = e ? n.shift() + t : t, i = [{
				name: r,
				path: r
			}];
			for (let e of n) r += (r.endsWith(t) ? "" : t) + e, i.push({
				name: e,
				path: r
			});
			return i;
		});
		async function m(e = null) {
			if (!u.value) {
				u.value = !0, d.value = "";
				try {
					let t = new URLSearchParams({ files: "1" });
					e !== null && t.set("path", e);
					let n = await If("/astrophoto/v1/storage/directories?" + t, "GET", void 0, f.signal), r = (e) => Array.isArray(e) && e.every((e) => $(e) && typeof e.name == "string" && typeof e.path == "string");
					if (!$(n) || n.path !== null && typeof n.path != "string" || n.parent !== null && typeof n.parent != "string" || !r(n.directories) || n.files !== void 0 && !r(n.files)) throw new Q("schema");
					o.value = n.path, s.value = n.parent, c.value = n.directories, l.value = n.files ?? [];
				} catch (e) {
					f.signal.aborted || (d.value = e instanceof Q ? e.code : "network");
				} finally {
					u.value = !1;
				}
			}
		}
		zr(() => {
			a.value?.showModal(), m();
		});
		function h(e) {
			r("choose", e), r("close");
		}
		return (e, t) => (U(), W("dialog", {
			ref_key: "dialog",
			ref: a,
			class: "ap-directory-dialog",
			"aria-label": I(i)("assetLibrary.browseSources"),
			onCancel: t[5] ||= hs((e) => r("close"), ["prevent"])
		}, [K("div", FT, [
			K("div", IT, [K("strong", null, N(I(i)("assetLibrary.browseSources")), 1), K("button", {
				type: "button",
				class: "ap-storage-button",
				"aria-label": I(i)("storage.closeDirectory"),
				onClick: t[0] ||= (e) => r("close")
			}, "×", 8, LT)]),
			K("nav", {
				class: "ap-directory-breadcrumbs",
				"aria-label": I(i)("storage.currentPath")
			}, [K("button", {
				type: "button",
				disabled: u.value,
				onClick: t[1] ||= (e) => m()
			}, N(I(i)("storage.directoryRoots")), 9, zT), (U(!0), W(H, null, B(p.value, (e) => (U(), W(H, { key: e.path }, [t[6] ||= K("span", { "aria-hidden": "true" }, "/", -1), K("button", {
				type: "button",
				disabled: u.value,
				onClick: (t) => m(e.path)
			}, N(e.name), 9, BT)], 64))), 128))], 8, RT),
			d.value ? (U(), G(yT, {
				key: 0,
				code: d.value
			}, null, 8, ["code"])) : Y("", !0),
			o.value === null ? Y("", !0) : (U(), W("button", {
				key: 1,
				type: "button",
				class: "ap-storage-button",
				disabled: u.value,
				onClick: t[2] ||= (e) => m(s.value)
			}, N(I(i)("storage.directoryUp")), 9, VT)),
			u.value ? (U(), W("p", HT, N(I(i)("states.loading")), 1)) : (U(), W("ul", UT, [(U(!0), W(H, null, B(c.value, (e) => (U(), W("li", { key: e.path }, [K("button", {
				type: "button",
				class: "ap-storage-button",
				onClick: (t) => m(e.path)
			}, "📁 " + N(e.name), 9, WT)]))), 128)), (U(!0), W(H, null, B(l.value, (e) => (U(), W("li", { key: e.path }, [K("button", {
				type: "button",
				class: "ap-storage-button",
				onClick: (t) => h(e.path)
			}, "📄 " + N(e.name), 9, GT)]))), 128))])),
			o.value ? (U(), W("p", KT, N(o.value), 1)) : Y("", !0),
			K("div", qT, [K("button", {
				type: "button",
				class: "ap-storage-button",
				onClick: t[3] ||= (e) => r("close")
			}, N(I(i)("storage.cancelDirectory")), 1), n.allowDirectory ? (U(), W("button", {
				key: 0,
				type: "button",
				class: "ap-storage-button",
				"data-variant": "primary",
				disabled: u.value || !o.value,
				onClick: t[4] ||= (e) => o.value && h(o.value)
			}, N(I(i)("storage.chooseDirectory")), 9, JT)) : Y("", !0)])
		])], 40, PT));
	}
}), XT = "/astrophoto/v1/library/direct-imports", ZT = (e) => Number.isSafeInteger(e) && Number(e) >= 0, QT = (e) => XT + "/" + encodeURIComponent(e);
async function $T(e, t) {
	let n = await If(XT + "/preview", "POST", e, t, 6e4);
	if (!$(n) || typeof n.preview_id != "string" || !ZT(n.file_count) || !ZT(n.failed) || !ZT(n.size_bytes) || !Array.isArray(n.workspaces) || !n.workspaces.every((e) => $(e) && typeof e.workspace_id == "string" && typeof e.lane == "string" && ZT(e.file_count) && ZT(e.size_bytes))) throw new Q("schema");
	return n;
}
function eE(e) {
	if (!$(e) || typeof e.id != "string" || ![
		"paused",
		"importing",
		"completed",
		"cancelled"
	].includes(String(e.phase)) || !Array.isArray(e.entries) || !e.entries.every((e) => $(e) && typeof e.id == "string" && ZT(e.index) && typeof e.name == "string" && ZT(e.size_bytes) && typeof e.workspace_id == "string" && typeof e.lane == "string" && [
		"copied",
		"failed",
		"pending"
	].includes(String(e.status)))) throw new Q("schema");
	return e;
}
async function tE(e, t) {
	return eE(await If(XT, "POST", e, t, 6e4));
}
async function nE(e, t) {
	return eE(await Ff(QT(e), t, "no-store"));
}
async function rE(e, t) {
	return eE(await If(QT(e), "DELETE", void 0, t, null));
}
async function iE(e, n, r, i, a) {
	let o = i === n.workspace_id ? "" : "?workspace_id=" + encodeURIComponent(i), s = QT(e) + "/files/" + encodeURIComponent(n.id) + o, c;
	try {
		c = await t.api.fetchApi(s, {
			method: "PUT",
			body: r,
			signal: a,
			headers: {
				"X-AstroPhoto-Local": "1",
				"Content-Type": "application/octet-stream"
			}
		});
	} catch (e) {
		throw a.aborted ? e : new Q("network");
	}
	let l = await c.json().catch(() => null);
	if (!c.ok) throw new Q($(l?.error) && typeof l.error.code == "string" ? l.error.code : "http", c.status);
	if (!$(l) || l.id !== n.id || l.status !== "copied" || typeof l.workspace_id != "string") throw new Q("schema");
	return l.workspace_id;
}
// src/features/assets/directTransfer.ts
var aE = "astrophoto.directImport.v1";
function oE() {
	try {
		let e = JSON.parse(sessionStorage.getItem(aE) || "null");
		if ($(e) && typeof e.preview_id == "string" && typeof e.idempotency_key == "string") return {
			preview_id: e.preview_id,
			idempotency_key: e.idempotency_key
		};
	} catch {}
}
function sE(e) {
	try {
		e ? sessionStorage.setItem(aE, JSON.stringify(e)) : sessionStorage.removeItem(aE);
	} catch {}
}
function cE(e, t) {
	return e.name === t.name && e.size_bytes === t.size && (e.last_modified_ms == null || e.last_modified_ms === t.lastModified);
}
async function lE(e, t, n, r) {
	let i = /* @__PURE__ */ new Map();
	for (let n of e.entries) {
		let e = i.get(n.lane);
		e || (e = {
			target: n.workspace_id,
			queue: []
		}, i.set(n.lane, e)), n.status !== "copied" && t.has(n.index) && e.queue.push(n);
	}
	let a = [...i.values()];
	for (let e of a) e.queue.reverse();
	let o = [], s = /* @__PURE__ */ new Set(), c;
	async function l(i, a, l) {
		try {
			let o = t.get(i.index);
			if (!cE(i, o)) throw new Q("SOURCE_CHANGED");
			let s = await iE(e.id, i, o, a, n);
			n.aborted || r(i, "copied", s);
		} catch (e) {
			if (n.aborted) return;
			if (e instanceof Q && [
				"WORKSPACE_OFFLINE",
				"WORKSPACE_DISABLED",
				"WORKSPACE_READ_ONLY",
				"WORKSPACE_IDENTITY_MISMATCH",
				"WORKSPACE_NOT_FOUND",
				"DIRECT_IMPORT_REPLAN_REQUIRED"
			].includes(e.code) && s.add(a), l && e instanceof Q && [
				404,
				409,
				423,
				507
			].includes(e.status || 0)) {
				o.push(i);
				return;
			}
			c ??= e, r(i, "failed", i.workspace_id, e instanceof Q ? e.code : "network");
		}
	}
	return await Promise.all(a.map(async (e) => {
		for (; !n.aborted;) {
			if (s.has(e.target)) return;
			let t = e.queue.pop(), n = t || a.find((e) => e.queue.length)?.queue.pop();
			if (!n) return;
			await l(n, t ? n.workspace_id : e.target, !t);
		}
	})), await Promise.all([...i.keys()].map(async (e) => {
		for (let t of o.filter((t) => t.lane === e)) {
			if (n.aborted) return;
			s.has(t.workspace_id) || await l(t, t.workspace_id, !1);
		}
	})), c;
}
// src/features/tasks/taskState.ts
var uE = /* @__PURE__ */ F([]), dE = /* @__PURE__ */ F(""), fE = /* @__PURE__ */ F({}), pE = /* @__PURE__ */ new Map(), mE = !1, hE, gE, _E = /* @__PURE__ */ new Set();
function vE(e) {
	let t = uE.value.find((t) => t.operation_id === e);
	t && gE && SE(t), pE.has(e) || pE.set(e, "queued");
}
function yE(e, t, n, r) {
	let i = `${e}:${t}`;
	return _E.has(i) ? !0 : Uv(n, r) ? (_E.add(i), !0) : !1;
}
function bE(e, t, n) {
	fE.value = {
		...fE.value,
		[e]: t
	}, yE(e, `error:${t}`, "error", n);
}
function xE(e) {
	let t = fE.value[e];
	t && _E.delete(`${e}:error:${t}`);
	let n = { ...fE.value };
	delete n[e], fE.value = n;
}
function SE(e) {
	if (!gE) return;
	let t = gE(e.kind === "import" ? "taskPanel.import" : "taskPanel.migration"), n = Array.isArray(e.receipt.errors) ? e.receipt.errors[0] : void 0;
	if (e.error || e.phase === "failed" || e.receipt.direct_import === !0 && n) {
		let r = e.error?.code || n?.code || "unknown";
		yE(e.operation_id, `error:${r}`, "error", gE("taskPanel.failed", { name: t }));
	} else e.phase === "completed" && typeof e.receipt.failed == "number" && e.receipt.failed > 0 ? yE(e.operation_id, "partial", "warning", gE("taskPanel.partial", { name: t })) : e.phase === "completed" && yE(e.operation_id, "completed", "success", gE("taskPanel.completed", { name: t }));
}
function CE(e) {
	if (gE = e, hE) return;
	hE = new AbortController();
	let t = hE.signal;
	async function n() {
		try {
			let e = await Yy(t);
			if (t.aborted) return;
			for (let t of e) {
				let e = t.phase === "completed" && typeof t.receipt.failed == "number" && t.receipt.failed > 0, n = t.receipt.direct_import === !0 && Array.isArray(t.receipt.errors) ? t.receipt.errors[0] : void 0, r = t.error || n ? `error:${t.error?.code || n.code}` : e ? "partial" : t.phase;
				(mE || pE.has(t.operation_id)) && pE.get(t.operation_id) !== r && SE(t), pE.set(t.operation_id, r);
			}
			mE = !0, uE.value = e, dE.value = "";
		} catch (e) {
			!t.aborted && uE.value.length && (dE.value = e instanceof Q ? e.code : "network");
		} finally {
			t.aborted || setTimeout(() => void n(), 1200);
		}
	}
	n();
}
// src/features/assets/DirectImportProgress.vue?vue&type=script&setup=true&lang.ts
var wE = ["aria-label"], TE = { role: "status" }, EE = [
	"value",
	"max",
	"aria-label"
], DE = { class: "ap-assets-list" }, OE = { key: 0 }, kE = ["onClick"], AE = { key: 2 }, jE = {
	key: 1,
	role: "status"
}, ME = { class: "ap-assets-toolbar" }, NE = ["disabled"], PE = ["disabled"], FE = /* @__PURE__ */ z({
	__name: "DirectImportProgress",
	props: {
		ticket: {},
		files: {},
		workspaces: {}
	},
	emits: ["changed", "close"],
	setup(e, { expose: t, emit: n }) {
		let r = e, i = n, { t: a } = Cf(), o = /* @__PURE__ */ P(), s = /* @__PURE__ */ Ut(new Map(r.files.map((e, t) => [t, e]))), c = /* @__PURE__ */ P(), l = /* @__PURE__ */ P(), u = /* @__PURE__ */ P(), d = /* @__PURE__ */ F(), f = /* @__PURE__ */ P(!1), p = /* @__PURE__ */ P(!1), m = /* @__PURE__ */ P(!1), h;
		ke(() => h?.abort());
		let g = X(() => o.value?.entries.filter((e) => e.status !== "copied") || []), _ = X(() => (o.value?.entries.length || 0) - g.value.length), v = X(() => g.value.filter((e) => !s.has(e.index))), y = X(() => {
			let e = /* @__PURE__ */ new Map();
			for (let t of o.value?.entries || []) {
				let n = e.get(t.workspace_id);
				if (!n) {
					let i = t.workspace_id;
					n = {
						id: i,
						name: r.workspaces.find((e) => e.id === i)?.name || i,
						copied: 0,
						count: 0
					}, e.set(i, n);
				}
				n.count++, t.status === "copied" && n.copied++;
			}
			return [...e.values()];
		}), b = X(() => o.value?.phase === "completed" || o.value?.phase === "cancelled");
		async function x(e) {
			if (o.value) return nE(o.value.id, e);
			if (!r.files.length) try {
				return await nE(r.ticket.preview_id, e);
			} catch (e) {
				if (!r.ticket.idempotency_key || !(e instanceof Q) || e.status !== 404) throw e;
			}
			return tE(r.ticket, e);
		}
		async function S(e) {
			if (p.value) return;
			h = new AbortController();
			let { signal: t } = h;
			d.value = void 0, f.value = !1, p.value = !0;
			try {
				let n = await x(t);
				if (t.throwIfAborted(), o.value = n, vE(n.id), e && !b.value && s.size) {
					xE(n.id);
					let e = new Map(o.value.entries.map((e) => [e.id, e])), r = await lE(n, s, t, (t, n, r, i) => {
						let a = e.get(t.id);
						a.status = n, a.workspace_id = r, a.error = i || null;
					});
					if (t.throwIfAborted(), o.value = await nE(n.id, t), t.throwIfAborted(), r && g.value.length) {
						let e = r instanceof Q ? r.code : "network";
						f.value = !0, d.value = r, bE(n.id, e, a("taskPanel.failed", { name: a("taskPanel.import") }));
					}
					i("changed");
				}
				b.value && (sE(), o.value?.phase === "completed" && e && yE(n.id, "completed", "success", a("assetLibrary.directProgress", {
					copied: _.value,
					total: n.entries.length
				})));
			} catch (e) {
				t.aborted || (d.value = e);
			} finally {
				h?.signal === t && (p.value = !1);
			}
		}
		function C(e) {
			let t = e.target, n = Array.from(t.files || []);
			if (t.value = "", !n.length) return;
			let r = /* @__PURE__ */ new Map();
			for (let e of v.value) {
				let t = r.get(e.name) || [];
				t.push(e), r.set(e.name, t);
			}
			let i = 0;
			for (let e of n) {
				let t = (r.get(e.name) || []).filter((t) => !s.has(t.index) && (u.value === void 0 || t.index === u.value) && cE(t, e));
				t.length === 1 && (s.set(t[0].index, e), i++);
			}
			u.value = void 0, i !== n.length && Uv("warning", a("assetLibrary.unmatchedFiles"));
		}
		function w(e) {
			u.value = e, c.value && (c.value.multiple = e === void 0, c.value.click());
		}
		async function T() {
			if (m.value) return;
			h?.abort(), h = new AbortController();
			let { signal: e } = h;
			m.value = p.value = !0;
			try {
				if (o.value) o.value = await rE(o.value.id, e);
				else try {
					await rE(r.ticket.preview_id, e);
				} catch (e) {
					if (!(e instanceof Q && e.status === 404)) throw e;
				}
				e.throwIfAborted(), sE(), i("changed"), i("close");
			} catch (t) {
				e.aborted || (d.value = t);
			} finally {
				p.value = m.value = !1;
			}
		}
		function E() {
			p.value || (b.value && sE(), i("close"));
		}
		return t({ leave: E }), zr(() => void S(!!r.files.length)), (e, t) => (U(), W("section", {
			class: "ap-operation",
			"aria-label": I(a)("storage.operation")
		}, [
			o.value ? (U(), W(H, { key: 0 }, [
				K("p", TE, N(I(a)("assetLibrary.directProgress", {
					copied: _.value,
					total: o.value.entries.length
				})), 1),
				K("progress", {
					value: _.value,
					max: o.value.entries.length || 1,
					"aria-label": I(a)("storage.operation")
				}, null, 8, EE),
				K("ul", DE, [(U(!0), W(H, null, B(y.value, (e) => (U(), W("li", { key: e.id }, N(e.name) + " · " + N(e.copied) + " / " + N(e.count), 1))), 128))]),
				o.value.phase === "cancelled" ? (U(), W("p", OE, N(I(a)("storage.phases.cancelled")), 1)) : Y("", !0),
				!b.value && v.value.length && !p.value ? (U(), W(H, { key: 1 }, [
					K("p", null, N(I(a)("assetLibrary.reselectFiles", { count: v.value.length })), 1),
					K("input", {
						ref_key: "recoveryPicker",
						ref: c,
						type: "file",
						multiple: "",
						hidden: "",
						onChange: C
					}, null, 544),
					K("input", {
						ref_key: "folderPicker",
						ref: l,
						type: "file",
						multiple: "",
						webkitdirectory: "",
						hidden: "",
						onChange: C
					}, null, 544),
					K("button", {
						type: "button",
						onClick: t[0] ||= (e) => w()
					}, N(I(a)("assetLibrary.pickFiles")), 1),
					K("button", {
						type: "button",
						onClick: t[1] ||= (e) => {
							u.value = void 0, l.value?.click();
						}
					}, N(I(a)("assetLibrary.pickDirectory")), 1),
					K("details", null, [K("summary", null, N(I(a)("assetLibrary.pendingCount", { count: v.value.length })), 1), (U(!0), W(H, null, B(v.value, (e) => (U(), W("button", {
						key: e.id,
						type: "button",
						onClick: (t) => w(e.index)
					}, " #" + N(e.index + 1) + " " + N(e.name), 9, kE))), 128))])
				], 64)) : Y("", !0),
				!p.value && g.value.some((e) => e.error) ? (U(), W("details", AE, [K("summary", null, N(I(a)("storage.failed")), 1), K("ul", null, [(U(!0), W(H, null, B(g.value.filter((e) => e.error), (e) => (U(), W("li", { key: e.id }, N(e.name) + " · " + N(I(a)("storage.errors." + e.error, e.error || "")), 1))), 128))])])) : Y("", !0)
			], 64)) : p.value ? (U(), W("p", jE, N(I(a)("states.loading")), 1)) : Y("", !0),
			d.value ? (U(), G(GC, {
				key: 2,
				error: d.value,
				notify: !f.value
			}, null, 8, ["error", "notify"])) : Y("", !0),
			K("div", ME, [
				!b.value && !p.value ? (U(), W("button", {
					key: 0,
					type: "button",
					disabled: !!o.value && g.value.length === v.value.length && g.value.length > 0,
					onClick: t[2] ||= (e) => S(!0)
				}, N(o.value ? I(a)("assetLibrary.retryRemaining", { count: g.value.length - v.value.length }) : I(a)("actions.retry")), 9, NE)) : Y("", !0),
				b.value ? Y("", !0) : (U(), W("button", {
					key: 1,
					type: "button",
					disabled: m.value,
					onClick: T
				}, N(I(a)("storage.cancel")), 9, PE)),
				p.value ? Y("", !0) : (U(), W("button", {
					key: 2,
					type: "button",
					onClick: E
				}, N(I(a)("assetLibrary.allAssets")), 1))
			])
		], 8, wE));
	}
}), IE = { class: "ap-assets-dialog-content" }, LE = ["multiple"], RE = {
	key: 1,
	role: "status"
}, zE = {
	key: 0,
	class: "ap-assets-toolbar"
}, BE = ["disabled"], VE = {
	key: 1,
	role: "alert"
}, HE = {
	key: 0,
	class: "ap-assets-toolbar"
}, UE = ["disabled", "onClick"], WE = { class: "ap-assets-toolbar" }, GE = ["disabled"], KE = ["disabled"], qE = ["disabled"], JE = ["disabled"], YE = ["disabled"], XE = ["disabled"], ZE = ["disabled"], QE = { class: "ap-assets-toolbar" }, $E = ["disabled"], eD = {
	key: 4,
	class: "ap-assets-list"
}, tD = ["title"], nD = { key: 0 }, rD = [
	"disabled",
	"aria-label",
	"onClick"
], iD = {
	key: 5,
	class: "ap-assets-toolbar"
}, aD = ["disabled"], oD = ["disabled"], sD = {
	key: 6,
	role: "alert"
}, cD = {
	key: 7,
	role: "alert"
}, lD = { class: "ap-assets-form" }, uD = { key: 0 }, dD = { for: "ap-import-class" }, fD = { for: "ap-import-project" }, pD = {
	key: 1,
	class: "ap-assets-checkbox"
}, mD = ["checked", "disabled"], hD = ["disabled"], gD = ["value"], _D = {
	key: 8,
	role: "status"
}, vD = {
	key: 9,
	role: "status"
}, yD = { key: 0 }, bD = {
	key: 1,
	class: "ap-assets-list"
}, xD = { key: 2 }, SD = { key: 3 }, CD = { class: "ap-assets-toolbar" }, wD = ["disabled"], TD = ["disabled"], ED = 30, DD = /* @__PURE__ */ z({
	__name: "ImportAssets",
	props: {
		active: { type: Boolean },
		projects: {},
		openStorage: { type: Function },
		importKind: {},
		resumeTaskId: {}
	},
	emits: ["changed", "close"],
	setup(e, { expose: t, emit: n }) {
		let r = e, i = n, { t: a } = Cf(), { resource: o, refresh: s } = Xy(Uy), c = /* @__PURE__ */ F([]), l = /* @__PURE__ */ P(), u = /* @__PURE__ */ P(), d = /* @__PURE__ */ P(0), f = /* @__PURE__ */ P(""), p = /* @__PURE__ */ P(!1), m = /* @__PURE__ */ P(""), h = /* @__PURE__ */ P(""), g = /* @__PURE__ */ P(!1), _ = /* @__PURE__ */ P([]), v = /* @__PURE__ */ F(r.resumeTaskId ? {
			preview_id: r.resumeTaskId,
			idempotency_key: ""
		} : oE());
		r.resumeTaskId && v.value && sE(v.value);
		let y = /* @__PURE__ */ P(), b = X(() => c.value.flatMap((e) => e.file ? [e.file] : [])), x = /* @__PURE__ */ F(), S = X(() => new Set(x.value?.workspaces.map((e) => e.lane)).size), C = X(() => uE.value.filter((e) => e.kind === "import" && (e.phase === "importing" || e.phase === "paused") && e.receipt.direct_import === !0));
		function w(e) {
			c.value.length || A.value || (v.value = {
				preview_id: e,
				idempotency_key: ""
			}, sE(v.value));
		}
		let T = /* @__PURE__ */ F(), E = /* @__PURE__ */ P(), D = /* @__PURE__ */ F(), O = /* @__PURE__ */ F(), k = /* @__PURE__ */ F(), A = /* @__PURE__ */ P(!1), j = /* @__PURE__ */ P(!1), ee, te = crypto.randomUUID(), M = /* @__PURE__ */ P(!1);
		ke(() => ee?.abort());
		let ne = X(() => o.value.state === "ready" ? o.value.data : void 0), re = X(() => ne.value?.imports.default_mode), ie = X(() => ne.value?.workspaces.filter((e) => e.enabled && e.status === "online") || []), ae = X(() => re.value === "copy" && r.importKind === "batch" && ie.value.length > 1);
		function oe(e) {
			g.value = e.target.checked, _.value = g.value ? ie.value.map((e) => e.id) : [];
		}
		let se = X(() => g.value && ae.value ? _.value.filter((e) => ie.value.some((t) => t.id === e)) : void 0), ce = X(() => ne.value?.capabilities.import && (re.value === "reference" || ne.value?.workspaces.some((e) => e.status === "online"))), le = X(() => c.value.slice(d.value * ED, (d.value + 1) * ED)), ue = X(() => c.value.some((e) => re.value === "reference" ? !e.source : !e.file));
		R(j, (e) => {
			e && Uv("error", a("assetLibrary.singleFileOnly"));
		}), R(ue, (e) => {
			e && Uv("warning", a("assetLibrary.selectionModeChanged"));
		}), R([ne, ce], ([e, t]) => {
			e && !t && Uv("error", a("assetLibrary.storageUnavailable"));
		});
		function de() {
			T.value = void 0, x.value = void 0, E.value = void 0, D.value = void 0, M.value || (te = crypto.randomUUID());
		}
		R([
			m,
			h,
			g,
			_
		], de), R(() => r.active, (e, t) => {
			e && t === !1 && s();
		}), R(() => ne.value?.imports.revision, (e) => {
			!M.value && E.value !== void 0 && e !== void 0 && e !== E.value && de();
		});
		function fe(e) {
			if (A.value || M.value || re.value && re.value !== "copy") return;
			let t = Array.from(e, (e) => ({
				id: crypto.randomUUID(),
				name: e.webkitRelativePath || e.name,
				file: e
			}));
			r.importKind === "single" && t.length > 1 ? (j.value = !0, de()) : t.length && (j.value = !1, r.importKind === "single" && ve(), c.value = [...c.value, ...t], de());
		}
		function pe(e) {
			let t = e.target;
			t.files && fe(t.files), t.value = "";
		}
		function me() {
			let e = f.value.trim();
			!e || A.value || M.value || re.value !== "reference" || (r.importKind === "single" && ve(), j.value = !1, c.value = [...c.value, {
				id: crypto.randomUUID(),
				name: e,
				source: e
			}], f.value = "", de());
		}
		function he(e) {
			f.value = e, me();
		}
		function ge(e) {
			xe(async (t) => {
				let n = await _T(e, t);
				if (n.status === "selected" && n.path) {
					let e = n.path;
					r.importKind === "single" && ve(), j.value = !1, c.value = [...c.value, {
						id: crypto.randomUUID(),
						name: e,
						source: e
					}], de();
				} else if (n.status === "unavailable") p.value = !0;
				else if (n.status === "busy") throw new Q("STORAGE_BUSY");
			});
		}
		function _e(e) {
			j.value = !1, c.value = c.value.filter((t) => t.id !== e), d.value = Math.min(d.value, Math.max(0, Math.ceil(c.value.length / ED) - 1)), de();
		}
		function ve() {
			c.value = [], j.value = !1, d.value = 0, de();
		}
		function ye(e) {
			re.value === "copy" && !O.value && !A.value && e.dataTransfer?.types.includes("Files") && e.preventDefault();
		}
		function be(e) {
			re.value !== "copy" || O.value || A.value || !e.dataTransfer?.files.length || (e.preventDefault(), fe(e.dataTransfer.files));
		}
		async function xe(e) {
			if (A.value) return;
			ee = new AbortController();
			let { signal: t } = ee;
			A.value = !0, k.value = void 0;
			try {
				await e(t);
			} catch (e) {
				t.aborted || (k.value = e);
			} finally {
				ee = void 0, A.value = !1;
			}
		}
		function Se() {
			if (A.value || !ne.value || !ce.value || !c.value.length || ue.value || j.value) return;
			let e = ne.value;
			de(), xe(async (t) => {
				let n = { settings_revision: e.imports.revision };
				m.value && (n.project_id = m.value), h.value && (n.attributes = h.value === "video" ? { file_kind: "video" } : { role: h.value });
				let i;
				e.imports.default_mode === "copy" ? (n.files = b.value.map((e) => ({
					name: e.name,
					size_bytes: e.size,
					last_modified_ms: e.lastModified
				})), n.parallel = !!se.value, se.value && (n.workspace_ids = se.value), x.value = await $T(n, t), i = x.value) : (n.allow_duplicate = !0, n.sources = c.value.map((e) => e.source), i = await Ny(n, t)), t.throwIfAborted(), T.value = i, r.importKind === "single" && i.file_count > 1 ? j.value = !0 : (D.value = {
					...n,
					preview_id: i.preview_id
				}, E.value = e.imports.revision);
			});
		}
		function Ce() {
			let e = D.value;
			!e || !T.value || T.value.file_count <= T.value.failed || r.importKind === "single" && T.value.file_count > 1 || xe(async (t) => {
				try {
					if (!M.value && (await Uy(t)).imports.revision !== e.settings_revision) throw new Q("SETTINGS_CHANGED");
					M.value = !0, x.value ? (v.value = {
						preview_id: x.value.preview_id,
						idempotency_key: te
					}, sE(v.value)) : (O.value = await Gy("import", {
						...e,
						idempotency_key: te
					}, t), vE(O.value.operation_id));
				} catch (e) {
					throw e instanceof Q && ["SETTINGS_CHANGED", "REVISION_CONFLICT"].includes(e.code) ? (M.value = !1, de(), s()) : e instanceof Q && e.status && e.status < 500 && (M.value = !1), e;
				}
			});
		}
		function we(e) {
			vE(e), O.value = {
				operation_id: e,
				kind: "import",
				phase: "queued"
			};
		}
		async function Te() {
			v.value ? y.value?.leave() : A.value || (O.value || !c.value.length || await WS(a("assetLibrary.discard"), a("assetLibrary.discardConfirm"))) && i("close");
		}
		return t({
			discardDraft: Te,
			hasTask: (e) => v.value?.preview_id === e,
			openFilePicker: () => {
				!v.value && !C.value.length && l.value?.click();
			}
		}), (t, n) => (U(), W("section", IE, [
			K("input", {
				ref_key: "filePicker",
				ref: l,
				type: "file",
				multiple: e.importKind === "batch",
				hidden: "",
				onChange: pe
			}, null, 40, LE),
			I(o).state === "error" ? (U(), G(GC, {
				key: 0,
				error: I(o).error,
				retry: I(s)
			}, null, 8, ["error", "retry"])) : ne.value ? (U(), W(H, { key: 2 }, [v.value ? Y("", !0) : (U(), W("div", zE, [K("button", {
				type: "button",
				disabled: A.value,
				onClick: n[0] ||= (...t) => e.openStorage && e.openStorage(...t)
			}, N(I(a)("assetLibrary.openStorage")), 9, BE)])), ce.value ? Y("", !0) : (U(), W("p", VE, N(I(a)("assetLibrary.storageUnavailable")), 1))], 64)) : (U(), W("p", RE, N(I(a)("states.loading")), 1)),
			v.value ? (U(), G(FE, {
				key: 3,
				ref_key: "directProgress",
				ref: y,
				ticket: v.value,
				files: b.value,
				workspaces: ne.value?.workspaces || [],
				onChanged: n[1] ||= (e) => i("changed"),
				onClose: n[2] ||= (e) => i("close")
			}, null, 8, [
				"ticket",
				"files",
				"workspaces"
			])) : O.value ? (U(), G(NT, {
				key: O.value.operation_id,
				job: O.value,
				"on-terminal": () => i("changed"),
				"on-retry-remaining": we
			}, null, 8, ["job", "on-terminal"])) : (U(), W(H, { key: 5 }, [
				!c.value.length && C.value.length ? (U(), W("div", HE, [(U(!0), W(H, null, B(C.value, (e) => (U(), W("button", {
					key: e.operation_id,
					type: "button",
					disabled: A.value,
					onClick: (t) => w(e.operation_id)
				}, N(I(a)("assetLibrary.resumeDirect", {
					id: e.operation_id.slice(0, 8),
					copied: e.receipt.copied || 0,
					total: e.receipt.total
				})), 9, UE))), 128))])) : Y("", !0),
				re.value === "copy" ? (U(), W("div", {
					key: 1,
					class: "ap-assets-picker",
					onDragover: ye,
					onDrop: be
				}, [e.importKind === "batch" ? (U(), W("input", {
					key: 0,
					ref_key: "directoryPicker",
					ref: u,
					type: "file",
					multiple: "",
					webkitdirectory: "",
					hidden: "",
					onChange: pe
				}, null, 544)) : Y("", !0), K("div", WE, [K("button", {
					type: "button",
					disabled: A.value || M.value || !ce.value,
					onClick: n[3] ||= (e) => l.value?.click()
				}, N(I(a)(e.importKind === "single" ? "assetLibrary.pickFile" : "assetLibrary.pickFiles")), 9, GE), e.importKind === "batch" ? (U(), W("button", {
					key: 0,
					type: "button",
					disabled: A.value || M.value || !ce.value,
					onClick: n[4] ||= (e) => u.value?.click()
				}, N(I(a)("assetLibrary.pickDirectory")), 9, KE)) : Y("", !0)])], 32)) : re.value === "reference" ? (U(), W("form", {
					key: 2,
					class: "ap-assets-form",
					onSubmit: hs(me, ["prevent"])
				}, [
					K("p", null, N(I(a)(e.importKind === "single" ? "assetLibrary.referencePickerSingle" : "assetLibrary.referencePicker")), 1),
					K("label", null, [J(N(I(a)("assetLibrary.authorizedPath")), 1), qn(K("input", {
						"onUpdate:modelValue": n[5] ||= (e) => f.value = e,
						disabled: A.value
					}, null, 8, qE), [[as, f.value]])]),
					K("button", {
						type: "button",
						disabled: A.value || M.value || !ce.value,
						onClick: n[6] ||= (e) => ge("file")
					}, N(I(a)("assetLibrary.nativeFile")), 9, JE),
					e.importKind === "batch" ? (U(), W("button", {
						key: 0,
						type: "button",
						disabled: A.value || M.value || !ce.value,
						onClick: n[7] ||= (e) => ge("folder")
					}, N(I(a)("assetLibrary.nativeFolder")), 9, YE)) : Y("", !0),
					K("button", {
						type: "button",
						disabled: A.value || M.value || !ce.value,
						onClick: n[8] ||= (e) => p.value = !0
					}, N(I(a)("assetLibrary.browseSources")), 9, XE),
					K("button", {
						type: "submit",
						disabled: A.value || M.value || !ce.value || !f.value.trim()
					}, N(I(a)("assetLibrary.addPath")), 9, ZE)
				], 32)) : Y("", !0),
				p.value ? (U(), G(YT, {
					key: 3,
					"allow-directory": e.importKind === "batch",
					onChoose: he,
					onClose: n[9] ||= (e) => p.value = !1
				}, null, 8, ["allow-directory"])) : Y("", !0),
				K("div", QE, [K("strong", null, N(I(a)("assetLibrary.pendingCount", { count: c.value.length })), 1), K("button", {
					type: "button",
					disabled: A.value || M.value || !c.value.length,
					onClick: ve
				}, N(I(a)("assetLibrary.clearSelection")), 9, $E)]),
				le.value.length ? (U(), W("ul", eD, [(U(!0), W(H, null, B(le.value, (e) => (U(), W("li", {
					key: e.id,
					class: "ap-assets-row"
				}, [K("span", {
					class: "ap-assets-truncate",
					title: e.name
				}, [J(N(e.name), 1), e.file ? (U(), W("small", nD, N(I(KS)(e.file.size)), 1)) : Y("", !0)], 8, tD), K("button", {
					type: "button",
					disabled: A.value || M.value,
					"aria-label": I(a)("assetLibrary.removeEntry", { name: e.name }),
					onClick: (t) => _e(e.id)
				}, N(I(a)("assetLibrary.remove")), 9, rD)]))), 128))])) : Y("", !0),
				c.value.length > ED ? (U(), W("div", iD, [
					K("button", {
						type: "button",
						disabled: d.value === 0,
						onClick: n[10] ||= (e) => d.value--
					}, N(I(a)("assetLibrary.previous")), 9, aD),
					K("span", null, N(d.value + 1) + " / " + N(Math.ceil(c.value.length / ED)), 1),
					K("button", {
						type: "button",
						disabled: (d.value + 1) * ED >= c.value.length,
						onClick: n[11] ||= (e) => d.value++
					}, N(I(a)("assetLibrary.next")), 9, oD)
				])) : Y("", !0),
				j.value ? (U(), W("p", sD, N(I(a)("assetLibrary.singleFileOnly")), 1)) : Y("", !0),
				ue.value ? (U(), W("p", cD, N(I(a)("assetLibrary.selectionModeChanged")), 1)) : Y("", !0),
				K("div", lD, [
					e.importKind === "batch" ? (U(), W("p", uD, N(I(a)("assetLibrary.batchAttributes")), 1)) : Y("", !0),
					K("label", dD, N(I(a)("assetLibrary.classification")), 1),
					q(I(US), {
						id: "ap-import-class",
						label: I(a)("assetLibrary.classification"),
						value: h.value,
						disabled: A.value || M.value,
						options: [
							"",
							"raw",
							"master_frame",
							"video"
						].map((e) => ({
							value: e,
							label: I(a)(e === "raw" ? "assetLibrary.subframes" : "assetLibrary.values." + (e || "unspecified"))
						})),
						onChange: n[12] ||= (e) => h.value = e
					}, null, 8, [
						"label",
						"value",
						"disabled",
						"options"
					]),
					K("label", fD, N(I(a)("assetLibrary.project")), 1),
					q(I(US), {
						id: "ap-import-project",
						label: I(a)("assetLibrary.project"),
						value: m.value,
						disabled: A.value || M.value,
						options: [{
							value: "",
							label: I(a)("assetLibrary.values.unspecified")
						}, ...e.projects.map((e) => ({
							value: e.id,
							label: e.name
						}))],
						onChange: n[13] ||= (e) => m.value = e
					}, null, 8, [
						"label",
						"value",
						"disabled",
						"options"
					]),
					ae.value ? (U(), W("label", pD, [K("input", {
						type: "checkbox",
						checked: g.value,
						disabled: A.value || M.value,
						onChange: oe
					}, null, 40, mD), J(" " + N(I(a)("assetLibrary.parallelImport")), 1)])) : Y("", !0),
					se.value ? (U(), W("fieldset", {
						key: 2,
						class: "ap-assets-form",
						disabled: A.value || M.value
					}, [K("legend", null, N(I(a)("assetLibrary.importLocations")), 1), (U(!0), W(H, null, B(ie.value, (e) => (U(), W("label", {
						key: e.id,
						class: "ap-assets-checkbox"
					}, [qn(K("input", {
						"onUpdate:modelValue": n[14] ||= (e) => _.value = e,
						type: "checkbox",
						value: e.id
					}, null, 8, gD), [[os, _.value]]), J(" " + N(e.name), 1)]))), 128))], 8, hD)) : Y("", !0)
				]),
				A.value ? (U(), W("p", _D, N(I(a)("states.loading")), 1)) : Y("", !0),
				T.value ? (U(), W("div", vD, [
					K("p", null, N(I(a)("assetLibrary.previewResult", {
						passed: T.value.file_count - T.value.failed - (T.value.skipped || 0),
						failed: T.value.failed,
						skipped: T.value.skipped || 0,
						size: I(KS)(T.value.size_bytes)
					})), 1),
					T.value.workspace_id ? (U(), W("p", yD, N(I(a)("assetLibrary.actualLocation", { name: ne.value?.workspaces.find((e) => e.id === T.value?.workspace_id)?.name || T.value.workspace_id })), 1)) : Y("", !0),
					x.value ? (U(), W("ul", bD, [(U(!0), W(H, null, B(x.value.workspaces, (e) => (U(), W("li", { key: e.workspace_id }, N(ne.value?.workspaces.find((t) => t.id === e.workspace_id)?.name || e.workspace_id) + " · " + N(I(a)("assetLibrary.plannedFiles", {
						count: e.file_count,
						size: I(KS)(e.size_bytes)
					})), 1))), 128))])) : Y("", !0),
					se.value && x.value ? (U(), W("p", xD, N(I(a)("assetLibrary.plannedLanes", { count: S.value })), 1)) : Y("", !0),
					T.value.errors?.length ? (U(), W("ul", SD, [(U(!0), W(H, null, B(T.value.errors, (e) => (U(), W("li", { key: e.entry }, N(e.entry) + " · " + N(I(a)("assetLibrary.errors." + e.code, e.code)), 1))), 128))])) : Y("", !0)
				])) : Y("", !0),
				k.value ? (U(), G(GC, {
					key: 10,
					error: k.value
				}, null, 8, ["error"])) : Y("", !0),
				K("div", CD, [
					K("button", {
						type: "button",
						disabled: A.value || M.value || !ce.value || ue.value || j.value || !c.value.length || se.value && se.value.length < 2,
						onClick: Se
					}, N(I(a)("assetLibrary.previewImport")), 9, wD),
					K("button", {
						type: "button",
						disabled: A.value || !D.value || !T.value || T.value.file_count <= T.value.failed,
						onClick: Ce
					}, N(I(a)("assetLibrary.confirmImport")), 9, TD),
					A.value ? (U(), W("button", {
						key: 0,
						type: "button",
						onClick: n[15] ||= (e) => I(ee)?.abort()
					}, N(I(a)("storage.cancel")), 1)) : Y("", !0)
				])
			], 64)),
			O.value ? (U(), W("button", {
				key: 6,
				type: "button",
				onClick: n[16] ||= (e) => i("close")
			}, N(I(a)("assetLibrary.allAssets")), 1)) : Y("", !0)
		]));
	}
}), OD = { class: "ap-assets-dialog-content ap-assets-form" }, kD = {
	key: 0,
	role: "status"
}, AD = {
	key: 2,
	role: "status"
}, jD = {
	key: 3,
	class: "ap-assets-list"
}, MD = { class: "ap-assets-checkbox ap-assets-truncate" }, ND = [
	"checked",
	"disabled",
	"onChange"
], PD = ["title"], FD = { key: 0 }, ID = ["disabled"], LD = { class: "ap-assets-toolbar" }, RD = ["disabled"], zD = ["disabled"], BD = /* @__PURE__ */ z({
	__name: "ProjectAssetsPicker",
	props: {
		projectId: {},
		existing: {}
	},
	emits: ["changed", "close"],
	setup(e, { expose: t, emit: n }) {
		let r = e, i = n, { t: a } = Cf(), o = /* @__PURE__ */ P(""), s = /* @__PURE__ */ F(/* @__PURE__ */ new Map()), c = /* @__PURE__ */ F([]), l = /* @__PURE__ */ P(null), { resource: u, refresh: d } = Xy(X(() => {
			let e = o.value;
			return (t) => Dy("assets", {
				q: e,
				limit: "30"
			}, t);
		})), { run: f, pending: p, error: m } = GS(), { run: h, pending: g, error: _ } = GS();
		R(u, (e) => {
			e.state === "ready" && (c.value = e.data.items, l.value = e.data.next);
		}, { immediate: !0 });
		function v(e) {
			let t = new Map(s.value);
			t.has(e.id) ? t.delete(e.id) : t.set(e.id, e), s.value = t;
		}
		function y() {
			let e = l.value;
			if (!e) return;
			let t = o.value;
			h(async (n) => {
				let r = await Dy("assets", {
					q: t,
					after: e,
					limit: "30"
				}, n);
				if (!(n.aborted || o.value !== t || l.value !== e || u.value.state !== "ready")) {
					if (r.next === e) throw new Q("schema");
					c.value = [...c.value, ...r.items], l.value = r.next;
				}
			});
		}
		function b() {
			s.value.size && !p.value && f(async (e) => {
				let t = await Iy(r.projectId, [...s.value.keys()], e);
				e.aborted || i("changed", t.added, t.already_present);
			});
		}
		async function x() {
			p.value || (!s.value.size || await WS(a("assetLibrary.discard"), a("assetLibrary.discardConfirm"))) && i("close");
		}
		return t({ discardDraft: x }), (t, n) => (U(), W("section", OD, [
			q(I(zv), {
				label: I(a)("assetLibrary.searchAssets"),
				"clear-label": I(a)("browse.clear"),
				onSearch: n[0] ||= (e) => o.value = e
			}, null, 8, ["label", "clear-label"]),
			I(u).state === "loading" ? (U(), W("p", kD, N(I(a)("states.loading")), 1)) : I(u).state === "error" ? (U(), G(GC, {
				key: 1,
				error: I(u).error,
				retry: I(d)
			}, null, 8, ["error", "retry"])) : c.value.length ? (U(), W("ul", jD, [(U(!0), W(H, null, B(c.value, (t) => (U(), W("li", {
				key: t.id,
				class: "ap-assets-row"
			}, [K("label", MD, [K("input", {
				type: "checkbox",
				checked: s.value.has(t.id) || e.existing.includes(t.id),
				disabled: I(p) || e.existing.includes(t.id) || !s.value.has(t.id) && s.value.size >= 1e3,
				onChange: (e) => v(t)
			}, null, 40, ND), K("span", { title: t.name }, N(t.name), 9, PD)]), e.existing.includes(t.id) ? (U(), W("small", FD, N(I(a)("assetLibrary.alreadyInProject")), 1)) : Y("", !0)]))), 128))])) : (U(), W("p", AD, N(I(a)("assetLibrary.noMatches")), 1)),
			I(_) ? (U(), G(GC, {
				key: 4,
				error: I(_),
				retry: y
			}, null, 8, ["error"])) : Y("", !0),
			l.value ? (U(), W("button", {
				key: 5,
				type: "button",
				disabled: I(g) || I(p),
				onClick: y
			}, N(I(a)("assetLibrary.loadMore")), 9, ID)) : Y("", !0),
			K("p", null, N(I(a)("assetLibrary.selectedCount", { count: s.value.size })), 1),
			I(m) ? (U(), G(GC, {
				key: 6,
				error: I(m)
			}, null, 8, ["error"])) : Y("", !0),
			K("div", LD, [K("button", {
				type: "button",
				disabled: I(p) || !s.value.size,
				onClick: b
			}, N(I(a)("assetLibrary.addSelectedAssets")), 9, RD), K("button", {
				type: "button",
				disabled: I(p),
				onClick: x
			}, N(I(a)("storage.cancel")), 9, zD)])
		]));
	}
});
// src/features/assets/tree.ts
function VD(e, t, n, r, i, a = []) {
	let o = [], s = /* @__PURE__ */ new Map();
	for (let t of e) s.set(t.id, {
		id: t.id,
		label: t.name,
		children: [],
		folder: t
	});
	for (let e of s.values()) {
		let t = e.folder.parent_id && s.get(e.folder.parent_id);
		t ? t.children.push(e) : o.push(e);
	}
	function c(e, t) {
		((t ? s.get(t)?.children : o) ?? o).push(e);
	}
	for (let e of t) {
		let t = e.asset_id ? r.get(e.asset_id)?.name ?? e.asset_id : e.collection_id ? i.get(e.collection_id)?.name ?? e.collection_id : e.id;
		c({
			id: e.id,
			label: t,
			placement: e
		}, e.folder_id);
	}
	for (let e of n) c({
		id: e.id,
		label: r.get(e.asset_id)?.name ?? e.asset_id,
		master: e
	}, e.folder_id);
	for (let e of a) c({
		id: e.id,
		label: e.name,
		collection: e
	}, e.calibration_folder_id ?? null);
	return o;
}
// src/features/assets/AssetsPanel.vue?vue&type=script&setup=true&lang.ts
var HD = {
	key: 0,
	class: "ap-assets-editor ap-scroll",
	role: "region",
	"aria-labelledby": "ap-assets-editor-title"
}, UD = { class: "ap-assets-toolbar" }, WD = {
	key: 1,
	class: "ap-assets-notice",
	role: "status"
}, GD = {
	id: "ap-asset-panel-projects",
	class: "ap-assets-view ap-scroll",
	role: "tabpanel",
	"aria-labelledby": "ap-asset-tab-projects"
}, KD = { class: "ap-assets-toolbar" }, qD = {
	key: 0,
	role: "status"
}, JD = {
	key: 1,
	role: "status"
}, YD = {
	key: 2,
	class: "ap-assets-list"
}, XD = { class: "ap-folder-row" }, ZD = [
	"aria-expanded",
	"title",
	"onClick",
	"onContextmenu",
	"onDragover",
	"onDrop"
], QD = { key: 0 }, $D = ["aria-label"], eO = { class: "ap-assets-row-menu" }, tO = ["onClick"], nO = ["onClick"], rO = ["onClick"], iO = {
	key: 0,
	class: "ap-project-children"
}, aO = {
	key: 0,
	class: "ap-assets-toolbar"
}, oO = {
	id: "ap-asset-panel-allAssets",
	class: "ap-assets-view ap-scroll",
	role: "tabpanel",
	"aria-labelledby": "ap-asset-tab-allAssets"
}, sO = { class: "ap-assets-toolbar" }, cO = ["disabled"], lO = ["disabled"], uO = { class: "ap-assets-search-row" }, dO = ["aria-label", "title"], fO = {
	key: 0,
	class: "ap-assets-filter-indicator",
	"aria-hidden": "true"
}, pO = {
	key: 0,
	role: "status"
}, mO = {
	key: 0,
	role: "status"
}, hO = ["for"], gO = ["aria-label", "title"], _O = { for: "ap-asset-order" }, vO = ["aria-pressed"], yO = { for: "ap-asset-group" }, bO = { class: "ap-assets-toolbar" }, xO = ["aria-label"], SO = ["aria-pressed", "onClick"], CO = {
	key: 0,
	class: "ap-assets-toolbar"
}, wO = ["aria-label"], TO = ["onClick"], EO = {
	key: 3,
	class: "ap-assets-toolbar"
}, DO = {
	key: 4,
	role: "status"
}, OO = {
	key: 0,
	class: "ap-assets-empty",
	role: "status"
}, kO = {
	key: 1,
	class: "ap-assets-list"
}, AO = ["data-dragging"], jO = ["onToggle"], MO = ["title", "onDragstart"], NO = { class: "ap-assets-list" }, PO = [
	"title",
	"onDragstart",
	"onClick"
], FO = {
	key: 1,
	class: "ap-assets-truncate"
}, IO = { class: "ap-asset-actions" }, LO = [
	"aria-label",
	"aria-expanded",
	"onClick"
], RO = {
	key: 0,
	class: "ap-assets-row-menu"
}, zO = ["onClick"], BO = ["onClick"], VO = ["onClick"], HO = ["onClick"], UO = ["onClick"], WO = { key: 0 }, GO = { class: "ap-assets-list" }, KO = ["data-dragging"], qO = [
	"aria-label",
	"checked",
	"onChange"
], JO = [
	"title",
	"onDragstart",
	"onContextmenu",
	"onClick"
], YO = { class: "ap-asset-actions" }, XO = [
	"aria-label",
	"aria-expanded",
	"onClick"
], ZO = {
	key: 0,
	class: "ap-assets-row-menu"
}, QO = ["onClick"], $O = ["onClick"], ek = ["onClick"], tk = ["onClick"], nk = ["onClick"], rk = ["onClick"], ik = ["disabled", "onClick"], ak = ["disabled"], ok = {
	class: "ap-assets-view ap-scroll",
	"aria-labelledby": "ap-calibration-title"
}, sk = { class: "ap-assets-toolbar" }, ck = { id: "ap-calibration-title" }, lk = { class: "ap-assets-toolbar" }, uk = {
	key: 0,
	role: "status"
}, dk = {
	key: 1,
	class: "ap-assets-toolbar"
}, fk = "application/x-astrophoto-library", pk = /* @__PURE__ */ z({
	__name: "AssetsPanel",
	props: {
		active: { type: Boolean },
		openStorage: { type: Function }
	},
	setup(e, { expose: n }) {
		let r = e, { t: i } = Cf(), a = ["allAssets", "projects"], o = /* @__PURE__ */ P("projects"), s = /* @__PURE__ */ P(!1), c = /* @__PURE__ */ P(""), l = /* @__PURE__ */ F(), u = /* @__PURE__ */ F(), d = /* @__PURE__ */ P(""), f = /* @__PURE__ */ P(""), p = /* @__PURE__ */ P(""), m = /* @__PURE__ */ P(""), h = /* @__PURE__ */ P(""), g = /* @__PURE__ */ P("name"), _ = /* @__PURE__ */ P(!1), v = /* @__PURE__ */ P(""), y = /* @__PURE__ */ P(""), b = /* @__PURE__ */ P({}), { resource: x, refresh: S } = Xy(Uy), C = /* @__PURE__ */ F(), w = /* @__PURE__ */ P(), T = /* @__PURE__ */ P(), E = /* @__PURE__ */ P(), D = /* @__PURE__ */ P(), O = /* @__PURE__ */ P(), k = /* @__PURE__ */ new Map();
		function A(e) {
			let t = e.target;
			document.querySelectorAll(".ap-assets-panel .ap-folder-menu[open]").forEach((e) => {
				t instanceof Node && e.contains(t) || (e.open = !1);
			}), t instanceof Element && t.closest(".ap-asset-actions") || (ue.value = "");
		}
		function j(e) {
			e.key === "Escape" && (ue.value = "", document.querySelectorAll(".ap-assets-panel .ap-folder-menu[open]").forEach((e) => {
				e.open = !1;
			}));
		}
		zr(() => {
			document.addEventListener("pointerdown", A, !0), document.addEventListener("contextmenu", A, !0), document.addEventListener("keydown", j, !0);
		}), ke(() => {
			document.removeEventListener("pointerdown", A, !0), document.removeEventListener("contextmenu", A, !0), document.removeEventListener("keydown", j, !0);
		});
		let ee = /* @__PURE__ */ P(/* @__PURE__ */ new Set());
		function te(e, t) {
			t ? k.set(e, t) : k.delete(e);
		}
		function M(e) {
			ee.value = /* @__PURE__ */ new Set([...ee.value, e]);
		}
		function ne(e) {
			let t = new Set(ee.value);
			t.has(e) ? t.delete(e) : t.add(e), ee.value = t, Ht(e);
		}
		async function re(e) {
			Ht(e), M(e), await Fn(), k.get(e)?.startFolder(null);
		}
		function ie(e, t) {
			e.preventDefault(), Ht(t);
			let n = e.currentTarget.closest(".ap-folder-row")?.querySelector("details");
			n && (n.open = !0);
		}
		let ae = /* @__PURE__ */ P("");
		function oe(e) {
			(e === i("assetLibrary.saved") || e === i("assetLibrary.canvasBound")) && Uv("success", e) ? ae.value = "" : (Uv("info", e), ae.value = e);
		}
		let se = /* @__PURE__ */ P(!1), ce = /* @__PURE__ */ P(!1);
		function le(e) {
			let t = e instanceof Q ? e.code : e instanceof Error ? e.message : "network";
			return i("assetLibrary.errors." + t, i("storage.errors." + t, i("errors." + t, i("errors.unknown"))));
		}
		let ue = /* @__PURE__ */ P(""), de = /* @__PURE__ */ P(/* @__PURE__ */ new Set()), fe = null, pe, he = /* @__PURE__ */ P(""), ge = /* @__PURE__ */ P(""), _e = /* @__PURE__ */ F(/* @__PURE__ */ new Map()), { resource: ve, refresh: ye } = Xy(async (e) => {
			let [t, n, r, i, a, o, s] = await Promise.all([
				Oy("projects", {}, e),
				Oy("collections", {}, e),
				Oy("folders", {}, e),
				Oy("masters", {}, e),
				Oy("placements", {}, e),
				Oy("sessions", {}, e),
				Oy("assignments", {}, e)
			]), c = [.../* @__PURE__ */ new Set([...i.map((e) => e.asset_id), ...a.flatMap((e) => e.asset_id ? [e.asset_id] : [])])];
			for (let t = 0; t < c.length; t += 100) {
				let n = await Dy("assets", { asset_ids: c.slice(t, t + 100).join(",") }, e);
				if (e.aborted) break;
				Ke(n.items);
			}
			return {
				projects: t,
				collections: n,
				folders: r,
				masters: i,
				placements: a,
				sessions: o,
				assignments: s
			};
		}, !0), { resource: be, refresh: xe } = Xy((e) => Oy("import-groups", {}, e), !0), Se = X(() => !y.value && !v.value && (!h.value || h.value === "raw") && !f.value.trim() && !Object.values(b.value).some(Boolean)), Ce = X(() => be.value.state === "ready" ? be.value.data : []), we = X(() => Ce.value.find((e) => e.id === y.value));
		R(be, (e) => {
			e.state === "ready" && y.value && !we.value && (y.value = "");
		}), R(h, () => {
			y.value = "";
		});
		let Te = /* @__PURE__ */ P("import_index"), Ee = X({
			get: () => y.value ? Te.value : g.value,
			set(e) {
				y.value ? Te.value = e : g.value = e;
			}
		}), De = X(() => ({
			...b.value,
			q: f.value.trim(),
			import_group_id: y.value || (Se.value && Ce.value.length ? "ungrouped" : void 0),
			...h.value === "video" ? { file_kind: "video" } : h.value ? { role: h.value } : {},
			sort: (_.value ? "-" : "") + Ee.value
		})), { resource: Oe, refresh: Ae } = Xy(X(() => {
			let e = De.value;
			return (t) => Dy("assets", e, t);
		})), je = /* @__PURE__ */ F([]), Me = /* @__PURE__ */ P(null), { run: Ne, error: Pe, pending: Fe } = GS(), { run: Ie, error: Le, pending: Re } = GS(), { run: ze, error: Be } = GS(), { run: Ve, error: He, pending: Ue } = GS(), We = /* @__PURE__ */ F([]), Ge = /* @__PURE__ */ F();
		R(Le, (e) => {
			se.value = !!e && !e.details && e.status !== 409 && Uv("error", le(e));
		}), R(Ge, (e) => {
			ce.value = !!e && Uv("error", le(e));
		});
		function Ke(e) {
			if (!e.length) return;
			let t = new Map(_e.value);
			for (let n of e) t.set(n.id, n);
			_e.value = t;
		}
		R(Oe, (e) => {
			e.state === "ready" && (je.value = e.data.items, Me.value = e.data.next, Ke(e.data.items));
		});
		function qe() {
			let e = Me.value, t = De.value;
			e && Ne(async (n) => {
				let r = await Dy("assets", {
					...t,
					after: e
				}, n);
				if (!(n.aborted || t !== De.value)) {
					if (r.next === e) throw new Q("schema");
					je.value = [...je.value, ...r.items], Me.value = r.next, Ke(r.items);
				}
			});
		}
		let Je = X(() => ve.value.state === "ready" ? ve.value.data : null), Ye = X(() => Je.value?.projects ?? []), Xe = X(() => Je.value?.collections ?? []), Ze = X(() => Je.value?.folders ?? []), Qe = X(() => Je.value?.placements ?? []), $e = X(() => Je.value?.masters ?? []), et = X(() => Je.value?.assignments ?? []), tt = X(() => Je.value?.sessions ?? []), nt = X(() => new Map(Xe.value.map((e) => [e.id, e]))), rt = X(() => new Set(Xe.value.flatMap((e) => e.asset_ids)));
		R(Ye, (e) => {
			e.some((e) => e.id === c.value) || (c.value = e[0]?.id ?? "", l.value = void 0);
		});
		function it(e) {
			return VD(Ze.value.filter((t) => t.project_id === e), Qe.value.filter((t) => t.project_id === e).sort((e, t) => (e.position ?? 0) - (t.position ?? 0)), [], _e.value, nt.value);
		}
		function at(e) {
			let t = p.value.trim().toLocaleLowerCase();
			return !t || [e.name, e.target ?? ""].some((e) => e.toLocaleLowerCase().includes(t));
		}
		function ot(e, t) {
			return e.some((e) => e.label.toLocaleLowerCase().includes(t) || e.children && ot(e.children, t));
		}
		let st = X(() => VD(Ze.value.filter((e) => !e.project_id), [], $e.value, _e.value, nt.value, Xe.value.filter((e) => e.calibration_eligible))), ct = X(() => {
			let e = /* @__PURE__ */ new Set();
			for (let t of Qe.value.filter((e) => e.project_id === c.value)) t.asset_id && e.add(t.asset_id), t.collection_id && nt.value.get(t.collection_id)?.asset_ids.forEach((t) => e.add(t));
			return [...e];
		}), lt = X(() => Ye.value.filter((e) => at(e) || ot(it(e.id), p.value.trim().toLocaleLowerCase()))), ut = X(() => y.value ? [] : Xe.value.filter((e) => (!h.value || h.value === "raw" || h.value === "video") && (!f.value.trim() || e.name.toLocaleLowerCase().includes(f.value.trim().toLocaleLowerCase()) || je.value.some((t) => e.asset_ids.includes(t.id))) && (!h.value || e.asset_ids.some((e) => je.value.some((t) => t.id === e))))), dt = X(() => {
			let e = je.value.filter((e) => h.value !== "raw" || !rt.value.has(e.id) || !ut.value.some((t) => t.asset_ids.includes(e.id))), t = /* @__PURE__ */ new Map();
			for (let n of e) {
				let e = v.value ? String(n.attributes[v.value] ?? "") : "", r = t.get(e) || [];
				r.push(n), t.set(e, r);
			}
			return [...t];
		}), ft = X(() => [...de.value].map((e) => _e.value.get(e)).filter((e) => !!e));
		function pt(e) {
			let t = new Set(de.value);
			t.has(e.id) ? t.delete(e.id) : t.add(e.id), de.value = t;
		}
		function mt() {
			d.value = "", f.value = "", b.value = {}, y.value = "", h.value = "", v.value = "";
		}
		function ht(e, t) {
			b.value = {
				...b.value,
				[e]: t
			};
		}
		function gt(e) {
			s.value = !1, o.value = e;
		}
		R(() => r.active, (e) => {
			e ? S() : Lt();
		});
		function _t() {
			Ae(), xe(), ye();
		}
		function vt(e, t) {
			e.currentTarget instanceof HTMLDetailsElement && e.currentTarget.open && !t.asset_ids.every((e) => _e.value.has(e)) && ze(async (e) => Ke(await Oy("assets", { collection_id: t.id }, e)));
		}
		async function yt(e) {
			C.value || (fe = document.activeElement instanceof HTMLElement ? document.activeElement : null, C.value = e, ue.value = "", await Fn(), w.value?.focus());
		}
		async function bt(e) {
			let t = x.value, n = t.state === "ready" && t.data.imports.default_mode === "copy";
			await yt({
				kind: "import",
				importKind: e
			}), n && D.value?.openFilePicker();
		}
		async function xt() {
			let e = w.value?.closest("[role=\"region\"]")?.contains(document.activeElement);
			C.value = void 0, await Fn(), e && fe?.isConnected && fe.focus(), fe = null;
		}
		async function St() {
			T.value ? await T.value.discardDraft() : E.value ? await E.value.discardDraft() : D.value ? await D.value.discardDraft() : O.value ? await O.value.discardDraft() : await xt();
		}
		function Ct() {
			return !C.value && (gt("projects"), !0);
		}
		function wt() {
			return C.value ? St().then(Ct) : Ct();
		}
		async function Tt(e) {
			C.value?.kind === "import" && D.value?.hasTask(e) || (C.value && await St(), C.value || await yt({
				kind: "import",
				importKind: "batch",
				resumeTaskId: e
			}));
		}
		n({
			goHome: wt,
			openTaskImport: Tt
		});
		let Et = X(() => {
			let e = C.value;
			return e ? e.kind === "asset" ? e.asset.name : e.kind === "projectAssets" ? i("assetLibrary.addExistingAssets") : e.kind === "import" ? i("assetLibrary." + (e.importKind === "single" ? "importSingle" : "importBatch")) : i("assetLibrary.forms." + e.kind) : "";
		}), Dt = X(() => {
			let e = C.value;
			if (!e || e.kind === "import" || e.kind === "projectAssets" || e.kind === "asset" || e.kind === "batch") return null;
			switch (e.kind) {
				case "folders": return {
					kind: e.kind,
					row: e.row,
					defaults: {
						project_id: e.projectId ?? null,
						parent_id: e.parentId ?? null
					}
				};
				case "collections":
				case "sessions": return {
					kind: e.kind,
					row: e.row,
					defaults: { asset_ids: e.assetIds }
				};
				case "placements":
				case "assignments": return {
					kind: e.kind,
					row: e.row,
					defaults: At(e.resource),
					targetName: kt(e.resource)
				};
				default: return {
					kind: e.kind,
					row: e.row
				};
			}
		}), Ot = (e) => "asset" in e ? e.asset.id : e.collection.id, kt = (e) => "asset" in e ? e.asset.name : e.collection.name, At = (e) => "asset" in e ? { asset_id: e.asset.id } : { collection_id: e.collection.id }, jt = (e) => "asset" in e ? "AstroPhotoAssetSource" : "AstroPhotoCollectionSource";
		function Mt(e) {
			let t = e?.placement, n = t?.asset_id ?? e?.master?.asset_id, r = n && _e.value.get(n);
			if (r) return { asset: r };
			let i = t?.collection_id && nt.value.get(t.collection_id);
			if (i) return { collection: i };
		}
		let Nt = Qv((e) => !!pe?.resource && r.active && !C.value && jt(pe.resource) === e, (e) => {
			Ge.value = e, e || oe(i("assetLibrary.canvasBound"));
		}, (e, t) => {
			pe?.resource && Pt(pe.resource, t);
		});
		ke(Nt.dispose);
		function Pt(e, n) {
			let r = "asset" in e ? "asset_id" : "collection_id";
			if ("asset" in e && !e.asset.available) throw new Q("ASSET_OFFLINE");
			if ("collection" in e && !e.collection.asset_ids.length) throw new Q("COLLECTION_EMPTY");
			if ("collection" in e && e.collection.asset_ids.some((e) => _e.value.get(e)?.available === !1)) throw new Q("ASSET_OFFLINE");
			Kv(jt(e), n, t, void 0, (t) => {
				let n = t.widgets?.find((e) => e.name === r);
				if (!n) throw new Q("CANVAS_UNSUPPORTED");
				n.value = Ot(e);
			});
		}
		function Ft(e) {
			Ge.value = void 0, ue.value = "";
			try {
				Pt(e), oe(i("assetLibrary.canvasBound"));
			} catch (e) {
				Ge.value = e;
			}
		}
		function It(e, t, n) {
			if (!e.dataTransfer || !t && !n || C.value) {
				e.preventDefault();
				return;
			}
			Lt();
			let r = crypto.randomUUID();
			pe = {
				token: r,
				resource: t,
				folder: n
			}, he.value = t ? Ot(t) : n.id, t && Nt.start(e.dataTransfer, jt(t)), e.dataTransfer.effectAllowed = "copyMove", e.dataTransfer.setData(fk, r);
		}
		function Lt() {
			Nt.cancel(), pe = void 0, he.value = "", ge.value = "";
		}
		function Rt(e, t, n) {
			if (e.project_id !== n || e.parent_id === t) return !1;
			let r = t, i = /* @__PURE__ */ new Set();
			for (; r;) {
				if (r === e.id || i.has(r)) return !1;
				i.add(r), r = Ze.value.find((e) => e.id === r)?.parent_id ?? null;
			}
			return !0;
		}
		function zt(e, t, n = c.value) {
			pe && !C.value && !Re.value && e.dataTransfer?.types.includes(fk) && (e.preventDefault(), e.stopPropagation(), pe.folder && !Rt(pe.folder, t?.folder?.id ?? null, n) ? (e.dataTransfer.dropEffect = "none", ge.value = "") : (e.dataTransfer.dropEffect = pe.folder ? "move" : "copy", ge.value = t?.id ?? n));
		}
		function Bt(e, t) {
			e === "projects" && pe?.resource && t.dataTransfer?.types.includes(fk) && (t.preventDefault(), gt("projects"));
		}
		function Vt(e, t, n = c.value) {
			if (!pe || !Ye.value.some((e) => e.id === n) || !e.dataTransfer || e.dataTransfer.getData(fk) !== pe.token) return;
			e.preventDefault(), e.stopPropagation();
			let r = pe, i = t?.folder?.id ?? null;
			r.folder && !Rt(r.folder, i, n) ? Lt() : (Lt(), Ie(async (e) => {
				if (r.folder) {
					if (r.folder.project_id !== n || r.folder.id === i) throw new Q("INVALID_REQUEST");
					await Ay("folders", {
						name: r.folder.name,
						parent_id: i,
						project_id: n
					}, e, r.folder);
				} else if (r.resource) {
					let t = r.resource, a = Qe.value.find((e) => e.project_id === n && ("asset" in t ? e.asset_id === t.asset.id : e.collection_id === t.collection.id));
					await Ay("placements", {
						project_id: n,
						folder_id: i,
						...At(t)
					}, e, a);
				}
				e.aborted || ye();
			}));
		}
		function Ht(e) {
			l.value = void 0, c.value = e;
		}
		function Ut(e) {
			C.value?.kind === "projects" && e && (Ht(e.id), M(e.id)), l.value = void 0, u.value = void 0, _t();
		}
		function Wt(e) {
			return et.value.filter((t) => "asset" in e ? t.asset_id === e.asset.id : t.collection_id === e.collection.id);
		}
		function Gt(e) {
			return tt.value.filter((t) => t.asset_ids.includes(e.id));
		}
		function Kt(e) {
			return tt.value.filter((t) => !t.asset_ids.includes(e.id));
		}
		let qt = X(() => ({
			value: "",
			label: i("assetLibrary.values.unspecified")
		})), Jt = [
			"target",
			"target_type",
			"filter",
			"band",
			"panel",
			"region",
			"batch",
			"channel",
			"camera_id",
			"optical_train_id",
			"captured_at",
			"extension",
			"project_id",
			"folder_id",
			"collection_id",
			"session_id",
			"workspace_id",
			...RC,
			...Object.keys(LC),
			"storage_mode",
			"available"
		], Yt = X(() => {
			let e = /* @__PURE__ */ new Map();
			function t(t, n, r) {
				if (typeof n != "string" && typeof n != "number" && typeof n != "boolean" || n === "") return;
				let a = String(n), o = e.get(t) ?? /* @__PURE__ */ new Map();
				o.set(a, r ?? (t in LC || t === "available" || t === "storage_mode" ? i("assetLibrary.values." + (a === "true" ? "online" : a === "false" ? "offline" : a), a) : a)), e.set(t, o);
			}
			let n = new Set(We.value.map((e) => e.id));
			for (let e of We.value) {
				for (let n of Jt) {
					let r = n === "storage_mode" || n === "available" || n === "workspace_id" ? e[n] : e.attributes[n];
					Array.isArray(r) ? r.forEach((e) => t(n, e)) : t(n, r);
				}
				let n = e.name.lastIndexOf(".");
				n > 0 && n < e.name.length - 1 && t("extension", e.name.slice(n + 1).toLocaleLowerCase());
			}
			for (let e of Xe.value) e.asset_ids.some((e) => n.has(e)) && t("collection_id", e.id, e.name);
			for (let e of tt.value) e.asset_ids.some((e) => n.has(e)) && t("session_id", e.id, e.name);
			for (let e of Qe.value) {
				let r = e.collection_id ? nt.value.get(e.collection_id) : void 0;
				(e.asset_id && n.has(e.asset_id) || r?.asset_ids.some((e) => n.has(e))) && (t("project_id", e.project_id, Ye.value.find((t) => t.id === e.project_id)?.name), e.folder_id && t("folder_id", e.folder_id, Ze.value.find((t) => t.id === e.folder_id)?.name));
			}
			return Jt.flatMap((t) => {
				let n = e.get(t);
				return n?.size ? [{
					key: t,
					options: [...n].map(([e, t]) => ({
						value: e,
						label: t
					})).sort((e, t) => e.label.localeCompare(t.label))
				}] : [];
			});
		});
		function Xt(e) {
			e && Ve(async (e) => {
				We.value = await Oy("assets", {}, e);
			});
		}
		let Zt = (e) => [
			KS(e.size_bytes),
			e.attributes.usage && i("assetLibrary.values." + e.attributes.usage, String(e.attributes.usage)),
			i("assetLibrary.values." + (e.available ? "online" : "offline"))
		].filter(Boolean).join(" · ");
		return (t, n) => (U(), W("div", {
			class: "ap-assets-panel",
			onKeydown: n[32] ||= _s(hs((e) => C.value && St(), ["stop"]), ["esc"])
		}, [
			C.value ? (U(), W("div", HD, [K("div", UD, [K("button", {
				type: "button",
				onClick: St
			}, N(I(i)("actions.back")), 1), K("h2", {
				id: "ap-assets-editor-title",
				ref_key: "heading",
				ref: w,
				tabindex: "-1"
			}, N(Et.value), 513)]), C.value.kind === "import" ? (U(), G(DD, {
				key: 0,
				ref_key: "importEditor",
				ref: D,
				active: e.active,
				projects: Ye.value,
				"open-storage": e.openStorage,
				"import-kind": C.value.importKind,
				"resume-task-id": C.value.resumeTaskId,
				onChanged: _t,
				onClose: xt
			}, null, 8, [
				"active",
				"projects",
				"open-storage",
				"import-kind",
				"resume-task-id"
			])) : C.value.kind === "projectAssets" ? (U(), G(BD, {
				key: 1,
				ref_key: "projectAssetsEditor",
				ref: O,
				"project-id": C.value.projectId,
				existing: ct.value,
				onClose: xt,
				onChanged: n[0] ||= (e, t) => {
					oe(I(i)("assetLibrary.addAssetsResult", {
						added: e,
						existing: t
					})), _t(), xt();
				}
			}, null, 8, ["project-id", "existing"])) : C.value.kind === "asset" || C.value.kind === "batch" ? (U(), G(vw, {
				key: 2,
				ref_key: "assetEditor",
				ref: T,
				asset: C.value.kind === "asset" ? C.value.asset : void 0,
				selected: C.value.kind === "batch" ? C.value.assets : void 0,
				onChanged: _t,
				onNotice: n[1] ||= (e) => oe(e),
				onClose: xt
			}, null, 8, ["asset", "selected"])) : Dt.value ? (U(), G(Yw, za({ key: 3 }, Dt.value, {
				ref_key: "libraryEditor",
				ref: E,
				assets: [..._e.value.values()],
				projects: Ye.value,
				folders: Ze.value,
				collections: Xe.value,
				placements: Qe.value,
				masters: $e.value,
				assignments: et.value,
				onChanged: Ut,
				onNotice: n[2] ||= (e) => oe(e),
				onClose: xt
			}), null, 16, [
				"assets",
				"projects",
				"folders",
				"collections",
				"placements",
				"masters",
				"assignments"
			])) : Y("", !0)])) : Y("", !0),
			qn(q(I(Zy), {
				items: a,
				active: o.value,
				prefix: "ap-asset",
				label: I(i)("nav.assets"),
				title: (e) => I(i)("assetLibrary." + e),
				select: gt,
				dragOver: Bt
			}, null, 8, [
				"active",
				"label",
				"title"
			]), [[wo, !C.value && !s.value]]),
			ae.value ? (U(), W("p", WD, N(ae.value), 1)) : Y("", !0),
			I(Le) && !se.value ? (U(), G(GC, {
				key: 2,
				error: I(Le)
			}, null, 8, ["error"])) : Y("", !0),
			Ge.value && !ce.value ? (U(), G(GC, {
				key: 3,
				error: Ge.value
			}, null, 8, ["error"])) : Y("", !0),
			I(ve).state === "error" && !C.value ? (U(), G(GC, {
				key: 4,
				error: I(ve).error,
				retry: I(ye)
			}, null, 8, ["error", "retry"])) : Y("", !0),
			qn(K("section", GD, [
				K("div", KD, [K("h2", null, N(I(i)("assetLibrary.projects")), 1), K("button", {
					type: "button",
					onClick: n[3] ||= (e) => yt({ kind: "projects" })
				}, N(I(i)("assetLibrary.newProject")), 1)]),
				q(I(zv), {
					label: I(i)("assetLibrary.searchProjects"),
					"clear-label": I(i)("browse.clear"),
					onSearch: n[4] ||= (e) => p.value = e
				}, null, 8, ["label", "clear-label"]),
				I(ve).state === "loading" ? (U(), W("p", qD, N(I(i)("states.loading")), 1)) : I(ve).state === "ready" && !lt.value.length ? (U(), W("p", JD, N(I(i)(p.value.trim() ? "assetLibrary.noMatches" : "assetLibrary.noProjects")), 1)) : (U(), W("ul", YD, [(U(!0), W(H, null, B(lt.value, (e) => (U(), W("li", { key: e.id }, [K("div", XD, [K("button", {
					type: "button",
					class: me(["ap-tree-row ap-assets-tree-row ap-assets-project", { "ap-drop-active": ge.value === e.id }]),
					"aria-expanded": ee.value.has(e.id) || !!p.value.trim(),
					title: e.name,
					onClick: (t) => ne(e.id),
					onContextmenu: (t) => ie(t, e.id),
					onDragover: (t) => zt(t, void 0, e.id),
					onDrop: (t) => Vt(t, void 0, e.id),
					onDragleave: n[5] ||= (e) => ge.value = ""
				}, [
					q(I($v)),
					K("strong", null, N(e.name), 1),
					e.target ? (U(), W("small", QD, N(e.target), 1)) : Y("", !0)
				], 42, ZD), K("details", {
					class: "ap-folder-menu",
					onKeydown: n[6] ||= _s(hs((e) => e.currentTarget.open = !1, ["stop"]), ["esc"])
				}, [K("summary", { "aria-label": I(i)("assetLibrary.projectActions", { name: e.name }) }, "⋯", 8, $D), K("div", eO, [
					K("button", {
						type: "button",
						onClick: (t) => {
							Ht(e.id), yt({
								kind: "projectAssets",
								projectId: e.id
							}), t.currentTarget.closest("details").open = !1;
						}
					}, N(I(i)("assetLibrary.addExistingAssets")), 9, tO),
					K("button", {
						type: "button",
						onClick: (t) => {
							re(e.id), t.currentTarget.closest("details").open = !1;
						}
					}, N(I(i)("assetLibrary.newFolder")), 9, nO),
					K("button", {
						type: "button",
						onClick: (t) => {
							Ht(e.id), yt({
								kind: "projects",
								row: e
							}), t.currentTarget.closest("details").open = !1;
						}
					}, N(I(i)("assetLibrary.editProject")), 9, rO)
				])], 32)]), ee.value.has(e.id) || p.value.trim() ? (U(), W("div", iO, [q(gT, {
					ref_for: !0,
					ref: (t) => te(e.id, t),
					entries: it(e.id),
					"can-drop": "",
					query: at(e) ? "" : p.value,
					selected: e.id === c.value ? l.value?.id : void 0,
					"project-id": e.id,
					folders: Ze.value,
					placements: Qe.value,
					"drop-target": ge.value,
					onChanged: I(ye),
					onSelect: (t) => {
						c.value = e.id, l.value = t;
					},
					onOver: (t, n) => zt(t, n, e.id),
					onDrop: (t, n) => Vt(t, n, e.id),
					onDrag: n[7] ||= (e, t) => It(e, Mt(t), t.folder),
					onDragEnd: Lt
				}, null, 8, [
					"entries",
					"query",
					"selected",
					"project-id",
					"folders",
					"placements",
					"drop-target",
					"onChanged",
					"onSelect",
					"onOver",
					"onDrop"
				]), e.id === c.value && l.value?.placement && Mt(l.value) ? (U(), W("div", aO, [K("button", {
					type: "button",
					onClick: n[8] ||= (e) => yt({
						kind: "placements",
						resource: Mt(l.value),
						row: l.value.placement
					})
				}, N(I(i)("assetLibrary.editReference")), 1), K("button", {
					type: "button",
					onClick: n[9] ||= (e) => yt({
						kind: "assignments",
						resource: Mt(l.value)
					})
				}, N(I(i)("assetLibrary.forms.assignments")), 1)])) : Y("", !0)])) : Y("", !0)]))), 128))]))
			], 512), [[wo, !C.value && o.value === "projects" && !s.value]]),
			qn(K("section", oO, [
				K("div", sO, [
					K("h2", null, N(I(i)("assetLibrary.allAssets")), 1),
					K("button", {
						type: "button",
						disabled: I(x).state === "loading",
						onClick: n[10] ||= (e) => bt("single")
					}, N(I(i)("assetLibrary.importSingle")), 9, cO),
					K("button", {
						type: "button",
						disabled: I(x).state === "loading",
						onClick: n[11] ||= (e) => bt("batch")
					}, N(I(i)("assetLibrary.importBatch")), 9, lO)
				]),
				K("div", uO, [
					q(I(zv), {
						label: I(i)("assetLibrary.searchAssets"),
						"clear-label": I(i)("browse.clear"),
						value: d.value,
						onValueChange: n[12] ||= (e) => d.value = e,
						onSearch: n[13] ||= (e) => f.value = e
					}, null, 8, [
						"label",
						"clear-label",
						"value"
					]),
					q(I(nv), { "onUpdate:open": Xt }, {
						default: L(() => [q(I(cv), { "as-child": "" }, {
							default: L(() => [K("button", {
								type: "button",
								class: "ap-search-action ap-assets-filter-trigger",
								"aria-label": I(i)("assetLibrary.filters"),
								title: I(i)("assetLibrary.filters")
							}, [n[33] ||= K("svg", {
								width: "16",
								height: "16",
								viewBox: "0 0 24 24",
								fill: "none",
								stroke: "currentColor",
								"stroke-width": "2",
								"stroke-linecap": "round",
								"aria-hidden": "true"
							}, [K("path", { d: "M3 5h18M6 12h12M10 19h4" })], -1), Object.values(b.value).some(Boolean) ? (U(), W("span", fO)) : Y("", !0)], 8, dO)]),
							_: 1
						}), q(I(sv), null, {
							default: L(() => [q(I(ov), {
								class: "ap-assets-settings-popover ap-assets-filter-popover",
								side: "bottom",
								align: "end",
								"side-offset": 5,
								"collision-padding": 10
							}, {
								default: L(() => [
									K("strong", null, N(I(i)("assetLibrary.filters")), 1),
									I(Ue) ? (U(), W("p", pO, N(I(i)("states.loading")), 1)) : I(He) ? (U(), G(GC, {
										key: 1,
										error: I(He),
										retry: () => Xt(!0)
									}, null, 8, ["error", "retry"])) : (U(), W(H, { key: 2 }, [Yt.value.length ? Y("", !0) : (U(), W("p", mO, N(I(i)("assetLibrary.noFilterOptions")), 1)), (U(!0), W(H, null, B(Yt.value, (e) => (U(), W("div", {
										key: e.key,
										class: "ap-assets-filter-option"
									}, [K("label", { for: "ap-filter-" + e.key }, N(I(i)("assetLibrary.fields." + e.key)), 9, hO), q(I(US), {
										id: "ap-filter-" + e.key,
										label: I(i)("assetLibrary.fields." + e.key),
										value: b.value[e.key] ?? "",
										options: [{
											value: "",
											label: I(i)("assetLibrary.values.all")
										}, ...e.options],
										onChange: (t) => ht(e.key, t)
									}, null, 8, [
										"id",
										"label",
										"value",
										"options",
										"onChange"
									])]))), 128))], 64)),
									Object.values(b.value).some(Boolean) ? (U(), W("button", {
										key: 3,
										type: "button",
										onClick: n[14] ||= (e) => b.value = {}
									}, N(I(i)("assetLibrary.clearFilters")), 1)) : Y("", !0)
								]),
								_: 1
							})]),
							_: 1
						})]),
						_: 1
					}),
					q(I(nv), null, {
						default: L(() => [q(I(cv), { "as-child": "" }, {
							default: L(() => [K("button", {
								type: "button",
								class: "ap-search-action",
								"aria-label": I(i)("assetLibrary.viewSettings"),
								title: I(i)("assetLibrary.viewSettings")
							}, [...n[34] ||= [K("svg", {
								width: "16",
								height: "16",
								viewBox: "0 0 24 24",
								fill: "none",
								stroke: "currentColor",
								"stroke-width": "2",
								"stroke-linecap": "round",
								"aria-hidden": "true"
							}, [
								K("path", { d: "M4 7h10M18 7h2M4 17h2M10 17h10" }),
								K("circle", {
									cx: "16",
									cy: "7",
									r: "2"
								}),
								K("circle", {
									cx: "8",
									cy: "17",
									r: "2"
								})
							], -1)]], 8, gO)]),
							_: 1
						}), q(I(sv), null, {
							default: L(() => [q(I(ov), {
								class: "ap-assets-settings-popover",
								side: "bottom",
								align: "end",
								"side-offset": 5,
								"collision-padding": 10
							}, {
								default: L(() => [
									K("label", _O, N(I(i)("assetLibrary.sort")), 1),
									q(I(US), {
										id: "ap-asset-order",
										label: I(i)("assetLibrary.sort"),
										value: Ee.value,
										options: [
											...y.value ? ["import_index"] : [],
											"name",
											"size_bytes",
											"captured_at",
											"panel",
											"order",
											"exposure",
											"mtime_ns"
										].map((e) => ({
											value: e,
											label: I(i)("assetLibrary.fields." + e)
										})),
										onChange: n[15] ||= (e) => Ee.value = e
									}, null, 8, [
										"label",
										"value",
										"options"
									]),
									K("button", {
										type: "button",
										"aria-pressed": _.value,
										onClick: n[16] ||= (e) => _.value = !_.value
									}, N(I(i)("assetLibrary." + (_.value ? "descending" : "ascending"))), 9, vO),
									K("label", yO, N(I(i)("assetLibrary.group")), 1),
									q(I(US), {
										id: "ap-asset-group",
										label: I(i)("assetLibrary.group"),
										value: v.value,
										options: [{
											...qt.value,
											label: I(i)("assetLibrary.group")
										}, ...[
											"target",
											"panel",
											"usage",
											"filter",
											"band",
											"stage"
										].map((e) => ({
											value: e,
											label: I(i)("assetLibrary.fields." + e)
										}))],
										onChange: n[17] ||= (e) => v.value = e
									}, null, 8, [
										"label",
										"value",
										"options"
									])
								]),
								_: 1
							})]),
							_: 1
						})]),
						_: 1
					})
				]),
				K("div", bO, [K("div", {
					role: "group",
					"aria-label": I(i)("assetLibrary.classification"),
					class: "ap-assets-quick-filter"
				}, [(U(), W(H, null, B([
					"",
					"raw",
					"master_frame",
					"video"
				], (e) => K("button", {
					key: e,
					type: "button",
					"aria-pressed": h.value === e,
					onClick: (t) => h.value = e
				}, N(I(i)(e === "raw" ? "assetLibrary.subframes" : "assetLibrary.values." + (e || "all"))), 9, SO)), 64))], 8, xO), K("button", {
					type: "button",
					class: "ap-assets-calibration-link",
					onClick: n[18] ||= (e) => s.value = !0
				}, N(I(i)("assetLibrary.calibration")), 1)]),
				y.value ? (U(), W("div", CO, [K("button", {
					type: "button",
					onClick: n[19] ||= (e) => y.value = ""
				}, N(I(i)("actions.back")), 1), K("strong", null, N(we.value?.name), 1)])) : Y("", !0),
				I(be).state === "error" ? (U(), G(GC, {
					key: 1,
					error: I(be).error,
					retry: I(xe)
				}, null, 8, ["error", "retry"])) : Y("", !0),
				Se.value && Ce.value.length ? (U(), W("ul", {
					key: 2,
					class: "ap-assets-list",
					"aria-label": I(i)("assetLibrary.importGroups")
				}, [(U(!0), W(H, null, B(Ce.value, (e) => (U(), W("li", {
					key: e.id,
					class: "ap-assets-row"
				}, [K("button", {
					class: "ap-assets-truncate ap-asset-main",
					type: "button",
					onClick: (t) => y.value = e.id
				}, [K("strong", null, N(e.name) + " · " + N(I(i)("assetLibrary.frameCount", { count: e.count })), 1), K("small", null, N(e.workspaces.map((e) => e.name + " (" + e.count + ")").join(" · ")), 1)], 8, TO)]))), 128))], 8, wO)) : Y("", !0),
				ft.value.length ? (U(), W("div", EO, [
					K("button", {
						type: "button",
						onClick: n[20] ||= (e) => yt({
							kind: "batch",
							assets: ft.value
						})
					}, N(I(i)("assetLibrary.bulkEdit")) + " (" + N(ft.value.length) + ")", 1),
					K("button", {
						type: "button",
						onClick: n[21] ||= (e) => yt({
							kind: "collections",
							assetIds: [...de.value]
						})
					}, N(I(i)("assetLibrary.newCollection")), 1),
					K("button", {
						type: "button",
						onClick: n[22] ||= (e) => de.value = /* @__PURE__ */ new Set()
					}, N(I(i)("assetLibrary.clearSelection")), 1)
				])) : Y("", !0),
				I(Oe).state === "loading" ? (U(), W("p", DO, N(I(i)("states.loading")), 1)) : I(Oe).state === "error" ? (U(), G(GC, {
					key: 5,
					error: I(Oe).error,
					retry: I(Ae)
				}, null, 8, ["error", "retry"])) : (U(), W(H, { key: 6 }, [
					!je.value.length && !ut.value.length && !(Se.value && Ce.value.length) ? (U(), W("div", OO, [
						n[35] ||= K("svg", {
							width: "48",
							height: "48",
							viewBox: "0 0 24 24",
							fill: "none",
							stroke: "currentColor",
							"stroke-width": "2",
							"stroke-linecap": "round",
							"aria-hidden": "true"
						}, [K("circle", {
							cx: "12",
							cy: "12",
							r: "10"
						}), K("path", { d: "M12 11v6M12 7h.01" })], -1),
						K("p", null, N(I(i)(f.value || h.value || Object.values(b.value).some(Boolean) ? "assetLibrary.noMatches" : "assetLibrary.noAssets")), 1),
						f.value || h.value || Object.values(b.value).some(Boolean) ? (U(), W("button", {
							key: 0,
							type: "button",
							onClick: mt
						}, N(I(i)("assetLibrary.clearFilters")), 1)) : Y("", !0)
					])) : Y("", !0),
					ut.value.length ? (U(), W("ul", kO, [(U(!0), W(H, null, B(ut.value, (e) => (U(), W("li", {
						key: e.id,
						class: "ap-assets-row",
						"data-dragging": he.value === e.id
					}, [K("details", {
						class: "ap-assets-collection",
						onToggle: (t) => vt(t, e)
					}, [
						K("summary", {
							draggable: "true",
							class: "ap-assets-truncate",
							title: e.name,
							onDragstart: (t) => It(t, { collection: e }),
							onDragend: Lt
						}, [J(N(e.name) + " ", 1), K("small", null, N(I(i)("assetLibrary.members", { count: e.asset_ids.length })), 1)], 40, MO),
						K("ul", NO, [(U(!0), W(H, null, B(e.asset_ids, (e) => (U(), W("li", { key: e }, [_e.value.has(e) ? (U(), W("button", {
							key: 0,
							type: "button",
							class: "ap-assets-truncate",
							title: _e.value.get(e).name,
							draggable: "true",
							onDragstart: (t) => It(t, { asset: _e.value.get(e) }),
							onDragend: Lt,
							onClick: (t) => yt({
								kind: "asset",
								asset: _e.value.get(e)
							})
						}, N(_e.value.get(e).name), 41, PO)) : (U(), W("span", FO, N(e), 1))]))), 128))]),
						I(Be) ? (U(), G(GC, {
							key: 0,
							error: I(Be)
						}, null, 8, ["error"])) : Y("", !0)
					], 40, jO), K("div", IO, [K("button", {
						type: "button",
						"aria-label": I(i)("assetLibrary.more"),
						"aria-expanded": ue.value === e.id,
						onClick: (t) => ue.value = ue.value === e.id ? "" : e.id
					}, "⋯", 8, LO), ue.value === e.id ? (U(), W("div", RO, [
						K("button", {
							type: "button",
							onClick: (t) => yt({
								kind: "collections",
								row: e
							})
						}, N(I(i)("assetLibrary.forms.collections")), 9, zO),
						K("button", {
							type: "button",
							onClick: (t) => yt({
								kind: "placements",
								resource: { collection: e }
							})
						}, N(I(i)("assetLibrary.forms.placements")), 9, BO),
						K("button", {
							type: "button",
							onClick: (t) => yt({
								kind: "assignments",
								resource: { collection: e }
							})
						}, N(I(i)("assetLibrary.forms.assignments")), 9, VO),
						(U(!0), W(H, null, B(Wt({ collection: e }), (t) => (U(), W("button", {
							key: t.id,
							type: "button",
							onClick: (n) => yt({
								kind: "assignments",
								resource: { collection: e },
								row: t
							})
						}, N(I(i)("assetLibrary.editAssignment")) + " · " + N(_e.value.get($e.value.find((e) => e.id === t.master_id)?.asset_id || "")?.name ?? t.master_id), 9, HO))), 128)),
						K("button", {
							type: "button",
							onClick: (t) => Ft({ collection: e })
						}, N(I(i)("assetLibrary.createSource")), 9, UO)
					])) : Y("", !0)])], 8, AO))), 128))])) : Y("", !0),
					(U(!0), W(H, null, B(dt.value, ([e, t]) => (U(), W("div", { key: e }, [v.value ? (U(), W("h3", WO, N(e || I(i)("assetLibrary.values.unknown")), 1)) : Y("", !0), K("ul", GO, [(U(!0), W(H, null, B(t, (e) => (U(), W("li", {
						key: e.id,
						class: "ap-assets-row",
						"data-dragging": he.value === e.id
					}, [
						K("input", {
							type: "checkbox",
							"aria-label": I(i)("assetLibrary.selectAsset", { name: e.name }),
							checked: de.value.has(e.id),
							onChange: (t) => pt(e)
						}, null, 40, qO),
						K("button", {
							type: "button",
							class: "ap-assets-truncate ap-asset-main",
							title: e.name,
							draggable: "true",
							onDragstart: (t) => It(t, { asset: e }),
							onDragend: Lt,
							onContextmenu: hs((t) => ue.value = e.id, ["prevent"]),
							onClick: (t) => yt({
								kind: "asset",
								asset: e
							})
						}, [K("strong", null, N(e.name), 1), K("small", null, N(Zt(e)), 1)], 40, JO),
						K("div", YO, [K("button", {
							type: "button",
							"aria-label": I(i)("assetLibrary.more"),
							"aria-expanded": ue.value === e.id,
							onClick: (t) => ue.value = ue.value === e.id ? "" : e.id
						}, "⋯", 8, XO), ue.value === e.id ? (U(), W("div", ZO, [
							K("button", {
								type: "button",
								onClick: (t) => yt({
									kind: "placements",
									resource: { asset: e }
								})
							}, N(I(i)("assetLibrary.forms.placements")), 9, QO),
							K("button", {
								type: "button",
								onClick: (t) => yt({
									kind: "sessions",
									assetIds: [e.id]
								})
							}, N(I(i)("assetLibrary.forms.sessions")), 9, $O),
							(U(!0), W(H, null, B(Gt(e), (e) => (U(), W("button", {
								key: e.id,
								type: "button",
								onClick: (t) => yt({
									kind: "sessions",
									row: e
								})
							}, N(e.name), 9, ek))), 128)),
							(U(!0), W(H, null, B(Kt(e), (t) => (U(), W("button", {
								key: "attach-" + t.id,
								type: "button",
								onClick: (n) => yt({
									kind: "sessions",
									row: {
										...t,
										asset_ids: [...t.asset_ids, e.id]
									}
								})
							}, N(I(i)("assetLibrary.attachToSession", { name: t.name })), 9, tk))), 128)),
							e.attributes.usage === "light" && !rt.value.has(e.id) ? (U(), W("button", {
								key: 0,
								type: "button",
								onClick: (t) => yt({
									kind: "assignments",
									resource: { asset: e }
								})
							}, N(I(i)("assetLibrary.forms.assignments")), 9, nk)) : Y("", !0),
							(U(!0), W(H, null, B(Wt({ asset: e }), (t) => (U(), W("button", {
								key: t.id,
								type: "button",
								onClick: (n) => yt({
									kind: "assignments",
									resource: { asset: e },
									row: t
								})
							}, N(I(i)("assetLibrary.editAssignment")) + " · " + N(_e.value.get($e.value.find((e) => e.id === t.master_id)?.asset_id || "")?.name ?? t.master_id), 9, rk))), 128)),
							K("button", {
								type: "button",
								disabled: !e.available,
								onClick: (t) => Ft({ asset: e })
							}, N(I(i)("assetLibrary.createSource")), 9, ik)
						])) : Y("", !0)])
					], 8, KO))), 128))])]))), 128)),
					I(Pe) ? (U(), G(GC, {
						key: 2,
						error: I(Pe),
						retry: qe
					}, null, 8, ["error"])) : Y("", !0),
					Me.value ? (U(), W("button", {
						key: 3,
						type: "button",
						disabled: I(Fe),
						onClick: qe
					}, N(I(i)("assetLibrary.loadMore")), 9, ak)) : Y("", !0)
				], 64))
			], 512), [[wo, !C.value && o.value === "allAssets" && !s.value]]),
			qn(K("section", ok, [
				K("div", sk, [
					K("button", {
						type: "button",
						onClick: n[23] ||= (e) => s.value = !1
					}, N(I(i)("actions.back")), 1),
					K("h2", ck, N(I(i)("assetLibrary.calibration")), 1),
					K("button", {
						type: "button",
						onClick: n[24] ||= (e) => yt({ kind: "masters" })
					}, N(I(i)("assetLibrary.registerMaster")), 1)
				]),
				q(I(zv), {
					label: I(i)("assetLibrary.calibration"),
					"clear-label": I(i)("browse.clear"),
					onSearch: n[25] ||= (e) => m.value = e
				}, null, 8, ["label", "clear-label"]),
				K("div", lk, [K("button", {
					type: "button",
					onClick: n[26] ||= (e) => yt({ kind: "folders" })
				}, N(I(i)("assetLibrary.newFolder")), 1)]),
				q(gT, {
					entries: st.value,
					query: m.value,
					selected: u.value?.id,
					onSelect: n[27] ||= (e) => u.value = e
				}, null, 8, [
					"entries",
					"query",
					"selected"
				]),
				st.value.length ? Y("", !0) : (U(), W("p", uk, N(I(i)("assetLibrary.noCalibration")), 1)),
				u.value?.folder ? (U(), W("div", dk, [K("button", {
					type: "button",
					onClick: n[28] ||= (e) => yt({
						kind: "folders",
						parentId: u.value.folder.id
					})
				}, N(I(i)("assetLibrary.newFolder")), 1), K("button", {
					type: "button",
					onClick: n[29] ||= (e) => yt({
						kind: "folders",
						row: u.value.folder
					})
				}, N(I(i)("assetLibrary.editFolder")), 1)])) : Y("", !0),
				u.value?.master ? (U(), W("button", {
					key: 2,
					type: "button",
					onClick: n[30] ||= (e) => yt({
						kind: "masters",
						row: u.value.master
					})
				}, N(I(i)("assetLibrary.forms.masters")), 1)) : Y("", !0),
				u.value?.collection ? (U(), W("button", {
					key: 3,
					type: "button",
					onClick: n[31] ||= (e) => yt({
						kind: "collections",
						row: u.value.collection
					})
				}, N(I(i)("assetLibrary.forms.collections")), 1)) : Y("", !0)
			], 512), [[wo, !C.value && s.value]])
		], 32));
	}
}), mk = [
	"equipment",
	"software",
	"storage"
], hk = {
	software: "software",
	equipment: "equipment",
	knowledge: "knowledge",
	memory: "memory"
}, gk = {
	key: 1,
	role: "status"
}, _k = {
	key: 2,
	class: "ap-storage"
}, vk = { class: "ap-storage-group" }, yk = ["disabled"], bk = ["checked", "onClick"], xk = { class: "ap-storage-group" }, Sk = { class: "ap-storage-group-heading" }, Ck = [
	"aria-expanded",
	"aria-controls",
	"disabled"
], wk = { "aria-hidden": "true" }, Tk = ["id", "hidden"], Ek = ["disabled"], Dk = { class: "ap-storage-actions ap-location-form-actions" }, Ok = ["disabled"], kk = ["aria-label"], Ak = { class: "ap-directory-dialog-body" }, jk = { class: "ap-directory-dialog-header" }, Mk = ["aria-label"], Nk = ["aria-label"], Pk = ["onClick"], Fk = ["disabled"], Ik = {
	key: 2,
	role: "status"
}, Lk = {
	key: 3,
	class: "ap-directory-list"
}, Rk = ["onClick"], zk = {
	key: 4,
	class: "ap-storage-path"
}, Bk = { class: "ap-storage-actions" }, Vk = ["disabled"], Hk = ["aria-label"], Uk = {
	key: 0,
	class: "ap-directory-dialog-body ap-storage-fields"
}, Wk = { key: 0 }, Gk = ["disabled"], Kk = {
	disabled: "",
	value: ""
}, qk = ["value"], Jk = {
	key: 1,
	role: "status"
}, Yk = { class: "ap-storage-actions" }, Xk = ["disabled"], Zk = {
	key: 0,
	role: "status"
}, Qk = { class: "ap-workspace-list" }, $k = ["onDragover", "onDrop"], eA = { class: "ap-storage-meta" }, tA = [
	"draggable",
	"aria-label",
	"title",
	"onDragstart"
], nA = {
	key: 0,
	class: "ap-storage-badge"
}, rA = { class: "ap-location-menu" }, iA = ["aria-label"], aA = { class: "ap-location-path" }, oA = { class: "ap-storage-path" }, sA = ["disabled", "onClick"], cA = [
	"disabled",
	"title",
	"onClick"
], lA = ["disabled", "onClick"], uA = ["disabled", "onClick"], dA = ["disabled", "onClick"], fA = { class: "ap-storage-meta" }, pA = ["data-state"], mA = { key: 0 }, hA = { key: 1 }, gA = {
	key: 0,
	role: "status"
}, _A = {
	key: 3,
	class: "ap-storage-group"
}, vA = /* @__PURE__ */ z({
	__name: "StoragePage",
	props: {
		resource: {},
		refresh: { type: Function }
	},
	setup(e) {
		let n = e;
		function r(e) {
			let t = e.target;
			document.querySelectorAll(".ap-storage .ap-location-menu[open]").forEach((e) => {
				t instanceof Node && e.contains(t) || (e.open = !1);
			});
		}
		function i(e) {
			e.key === "Escape" && document.querySelectorAll(".ap-storage .ap-location-menu[open]").forEach((e) => {
				e.open = !1;
			});
		}
		zr(() => {
			document.addEventListener("pointerdown", r, !0), document.addEventListener("contextmenu", r, !0), document.addEventListener("keydown", i, !0);
		}), ke(() => {
			document.removeEventListener("pointerdown", r, !0), document.removeEventListener("contextmenu", r, !0), document.removeEventListener("keydown", i, !0);
		});
		let { t: a } = Cf(), o = /* @__PURE__ */ P(""), s = /* @__PURE__ */ P(""), c = /* @__PURE__ */ P(!1), l = /* @__PURE__ */ P(!1), u = /* @__PURE__ */ P(), d = /* @__PURE__ */ P(), f = /* @__PURE__ */ P(), p = /* @__PURE__ */ P(""), m = /* @__PURE__ */ P(""), h = /* @__PURE__ */ P(""), g = /* @__PURE__ */ P(null), _ = /* @__PURE__ */ P(null), v = /* @__PURE__ */ P([]), y = /* @__PURE__ */ P(null), b = /* @__PURE__ */ P(null), x = Cr(), { pending: S, error: C, details: w, run: T } = bT(), E = X(() => n.resource.state === "ready" ? n.resource.data : void 0), D = X(() => S.value || !E.value?.capabilities.write), O = X(() => {
			let e = f.value;
			return E.value?.workspaces.filter((t) => t.id === e?.id || !t.enabled ? !1 : e?.removal_target_id ? t.id === e.removal_target_id && ["online", "migrating"].includes(t.status) : t.status === "online") ?? [];
		}), k = X(() => E.value?.volumes?.filter((e) => e.quota_bytes !== null) ?? []), A = ["reference", "copy"], j = X(() => {
			let e = g.value;
			if (!e) return [];
			let t = /^[A-Za-z]:[\\/]/.test(e), n = t ? "\\" : "/", r = e.split(/[\\/]+/).filter(Boolean), i = t ? r.shift() + n : n, a = [{
				name: i,
				path: i
			}];
			for (let e of r) i = i.endsWith(n) ? i + e : i + n + e, a.push({
				name: e,
				path: i
			});
			return a;
		});
		R([l, u], ([e, t]) => {
			t && (e && !t.open && t.showModal(), !e && t.open && t.close());
		}, { flush: "post" });
		function ee(e) {
			let t = E.value;
			!D.value && t && e !== t.imports.default_mode && T(async (r) => {
				await Wy("/storage/settings", {
					expected_revision: t.imports.revision,
					imports: { default_mode: e }
				}, r, "PATCH"), r.aborted || n.refresh();
			});
		}
		function te() {
			let e = {
				path: s.value.trim(),
				name: o.value.trim()
			};
			!D.value && c.value && e.name && e.path && T(async (t) => {
				await Wy("/storage/locations", e, t), t.aborted || (o.value = "", s.value = "", c.value = !1, n.refresh());
			});
		}
		function M(e = null) {
			l.value = !0, T(async (t) => {
				let n = await If("/astrophoto/v1/storage/directories" + (e === null ? "" : "?path=" + encodeURIComponent(e)), "GET", void 0, t);
				if (!$(n) || n.path !== null && typeof n.path != "string" || n.parent !== null && typeof n.parent != "string" || !Array.isArray(n.directories) || !n.directories.every((e) => $(e) && typeof e.name == "string" && typeof e.path == "string")) throw new Q("schema");
				t.aborted || (g.value = n.path, _.value = n.parent, v.value = n.directories);
			});
		}
		function ne() {
			T(async (e) => {
				let t = await _T("folder", e);
				if (t.status === "selected" && t.path) s.value = t.path;
				else if (t.status === "unavailable") re.value = !0;
				else if (t.status === "busy") throw new Q("STORAGE_BUSY");
			}).then(() => {
				re.value && (re.value = !1, M());
			});
		}
		let re = /* @__PURE__ */ P(!1);
		function ie() {
			g.value !== null && (s.value = g.value, l.value = !1);
		}
		async function ae(e) {
			let r = await t.extensionManager.dialog.prompt({
				title: a("storage.rename"),
				message: a("storage.name"),
				defaultValue: e.name
			});
			r != null && r.trim() && r.trim() !== e.name && T(async (t) => {
				await Wy("/storage/locations/" + encodeURIComponent(e.id), {
					expected_revision: e.revision,
					name: r.trim()
				}, t, "PATCH"), t.aborted || n.refresh();
			});
		}
		async function oe(e) {
			D.value || (E.value?.workspaces.length ?? 0) < 2 || (f.value = e, p.value = e.removal_target_id ?? "", h.value = "", await Fn(), d.value?.showModal());
		}
		function se() {
			let e = f.value, t = O.value.find((e) => e.id === p.value);
			!D.value && e && t && (d.value?.close(), m.value = e.id, T(async (r) => {
				try {
					let n = await Wy("/storage/locations/" + encodeURIComponent(e.id), {
						expected_revision: e.revision,
						target_workspace_id: t.id
					}, r, "DELETE", null);
					if (!r.aborted) {
						let r = a("storage.removedLocation", {
							source: e.name,
							target: t.name
						});
						(typeof n.operation_id == "string" ? yE(n.operation_id, "completed", "success", r) : Uv("success", r)) || (h.value = r);
					}
				} finally {
					m.value = "", r.aborted || n.refresh();
				}
			}));
		}
		async function ce(e, t) {
			let r = E.value;
			r && !D.value && await T(async (i) => {
				await Wy("/storage/location-policy", {
					expected_revision: r.imports.revision,
					order: e.map((e) => e.id),
					quotas: t
				}, i, "PUT"), i.aborted || n.refresh();
			});
		}
		function le() {
			return Object.fromEntries((E.value?.workspaces ?? []).map((e) => [e.id, e.quota_bytes ?? null]));
		}
		function ue(e, t) {
			let n = [...E.value?.workspaces ?? []], r = e + t;
			r < 0 || r >= n.length || ([n[e], n[r]] = [n[r], n[e]], ce(n, le()));
		}
		function de(e, t) {
			D.value || !e.dataTransfer || (E.value?.workspaces.length ?? 0) < 2 ? e.preventDefault() : (y.value = t.id, e.dataTransfer.effectAllowed = "move", e.dataTransfer.setData("text/plain", t.id));
		}
		function fe() {
			y.value = null, b.value = null;
		}
		function pe(e, t) {
			y.value && y.value !== t.id && !D.value && (e.preventDefault(), e.dataTransfer && (e.dataTransfer.dropEffect = "move"), b.value = t.id);
		}
		function he(e, t) {
			if (!y.value || D.value) return;
			e.preventDefault();
			let n = [...E.value?.workspaces ?? []], r = n.findIndex((e) => e.id === y.value), i = n.findIndex((e) => e.id === t.id);
			if (fe(), r < 0 || i < 0 || r === i) return;
			let [a] = n.splice(r, 1);
			n.splice(i, 0, a), ce(n, le());
		}
		async function ge(e) {
			let n = await t.extensionManager.dialog.prompt({
				title: a("storage.locationLimit"),
				message: a("storage.locationLimitHelp"),
				defaultValue: e.quota_bytes == null ? "" : String(e.quota_bytes / 1073741824)
			});
			if (n == null) return;
			let r = n.trim() ? Number(n) * 1073741824 : null;
			r !== null && (!Number.isSafeInteger(r) || r < 0) || await ce(E.value?.workspaces ?? [], {
				...le(),
				[e.id]: r
			});
		}
		return (t, n) => e.resource.state === "error" ? (U(), W(H, { key: 0 }, [q(yT, { code: e.resource.error instanceof I(Q) ? e.resource.error.code : "network" }, null, 8, ["code"]), K("button", {
			type: "button",
			class: "ap-storage-button",
			onClick: n[0] ||= (t) => e.refresh()
		}, N(I(a)("actions.refresh")), 1)], 64)) : E.value ? (U(), W("div", _k, [
			E.value.capabilities.write ? Y("", !0) : (U(), G(yT, {
				key: 0,
				code: "UNAUTHORIZED_STORAGE_OPERATION"
			})),
			I(C) ? (U(), G(yT, {
				key: 1,
				code: I(C),
				notify: typeof I(w)?.operation_id != "string"
			}, null, 8, ["code", "notify"])) : Y("", !0),
			I(C) === "REVISION_CONFLICT" ? (U(), W("button", {
				key: 2,
				type: "button",
				class: "ap-storage-button",
				onClick: n[1] ||= (t) => e.refresh()
			}, N(I(a)("actions.refresh")), 1)) : Y("", !0),
			K("section", vk, [K("fieldset", {
				class: "ap-storage-radio-group",
				disabled: D.value
			}, [K("legend", null, N(I(a)("storage.importMode")), 1), (U(), W(H, null, B(A, (e) => K("label", { key: e }, [K("input", {
				type: "radio",
				name: "astrophoto-import-mode",
				checked: E.value.imports.default_mode === e,
				onClick: hs((t) => ee(e), ["prevent"])
			}, null, 8, bk), K("span", null, [J(N(I(a)("storage." + e)), 1), K("small", null, N(I(a)("storage." + e + "Help")), 1)])])), 64))], 8, yk)]),
			K("section", xk, [
				K("div", Sk, [K("h3", null, N(I(a)("storage.workspaces")), 1), K("button", {
					type: "button",
					class: "ap-storage-button ap-workspace-add",
					"aria-expanded": c.value,
					"aria-controls": I(x),
					disabled: D.value,
					onClick: n[2] ||= (e) => c.value = !c.value
				}, [K("span", wk, N(c.value ? "−" : "+"), 1), J(" " + N(I(a)("storage.add")), 1)], 8, Ck)]),
				K("form", {
					id: I(x),
					hidden: !c.value,
					onSubmit: hs(te, ["prevent"])
				}, [K("fieldset", {
					class: "ap-storage-fields",
					disabled: D.value
				}, [
					K("label", null, [J(N(I(a)("storage.name")), 1), qn(K("input", {
						"onUpdate:modelValue": n[3] ||= (e) => o.value = e,
						required: ""
					}, null, 512), [[as, o.value]])]),
					K("label", null, [J(N(I(a)("storage.path")), 1), qn(K("input", {
						"onUpdate:modelValue": n[4] ||= (e) => s.value = e,
						required: ""
					}, null, 512), [[as, s.value]])]),
					K("div", Dk, [K("button", {
						type: "button",
						class: "ap-storage-button",
						onClick: ne
					}, N(I(a)("storage.browseDirectories")), 1), K("button", {
						type: "submit",
						class: "ap-storage-button",
						"data-variant": "primary",
						disabled: !o.value.trim() || !s.value.trim()
					}, N(I(a)("storage.save")), 9, Ok)])
				], 8, Ek)], 40, Tk),
				K("dialog", {
					ref_key: "directoryDialog",
					ref: u,
					class: "ap-directory-dialog",
					"aria-label": I(a)("storage.browseDirectories"),
					onCancel: n[9] ||= hs((e) => l.value = !1, ["prevent"]),
					onClose: n[10] ||= (e) => l.value = !1
				}, [K("div", Ak, [
					K("div", jk, [K("strong", null, N(I(a)("storage.browseDirectories")), 1), K("button", {
						type: "button",
						class: "ap-storage-button",
						"aria-label": I(a)("storage.closeDirectory"),
						onClick: n[5] ||= (e) => l.value = !1
					}, "×", 8, Mk)]),
					K("nav", {
						class: "ap-directory-breadcrumbs",
						"aria-label": I(a)("storage.currentPath")
					}, [K("button", {
						type: "button",
						onClick: n[6] ||= (e) => M()
					}, N(I(a)("storage.directoryRoots")), 1), (U(!0), W(H, null, B(j.value, (e) => (U(), W(H, { key: e.path }, [n[15] ||= K("span", { "aria-hidden": "true" }, "/", -1), K("button", {
						type: "button",
						onClick: (t) => M(e.path)
					}, N(e.name), 9, Pk)], 64))), 128))], 8, Nk),
					I(C) ? (U(), G(yT, {
						key: 0,
						code: I(C)
					}, null, 8, ["code"])) : Y("", !0),
					g.value === null ? Y("", !0) : (U(), W("button", {
						key: 1,
						type: "button",
						class: "ap-storage-button",
						disabled: I(S),
						onClick: n[7] ||= (e) => M(_.value)
					}, N(I(a)("storage.directoryUp")), 9, Fk)),
					I(S) ? (U(), W("p", Ik, N(I(a)("states.loading")), 1)) : (U(), W("ul", Lk, [(U(!0), W(H, null, B(v.value, (e) => (U(), W("li", { key: e.path }, [K("button", {
						type: "button",
						class: "ap-storage-button",
						onClick: (t) => M(e.path)
					}, N(e.name), 9, Rk)]))), 128))])),
					g.value ? (U(), W("p", zk, N(g.value), 1)) : Y("", !0),
					K("div", Bk, [K("button", {
						type: "button",
						class: "ap-storage-button",
						onClick: n[8] ||= (e) => l.value = !1
					}, N(I(a)("storage.cancelDirectory")), 1), K("button", {
						type: "button",
						class: "ap-storage-button",
						"data-variant": "primary",
						disabled: I(S) || g.value === null,
						onClick: ie
					}, N(I(a)("storage.chooseDirectory")), 9, Vk)])
				])], 40, kk),
				K("dialog", {
					ref_key: "removalDialog",
					ref: d,
					class: "ap-directory-dialog",
					"aria-label": I(a)("storage.removeLocationTitle"),
					onClose: n[13] ||= (e) => f.value = void 0
				}, [f.value ? (U(), W("div", Uk, [
					K("strong", null, N(I(a)("storage.removeLocationTitle")), 1),
					K("p", null, N(I(a)(f.value.removal_target_id ? "storage.resumeRemoveHelp" : "storage.removeHelp", { name: f.value.name })), 1),
					O.value.length ? (U(), W("label", Wk, [J(N(I(a)("storage.removalTarget")) + " ", 1), qn(K("select", {
						"onUpdate:modelValue": n[11] ||= (e) => p.value = e,
						disabled: !!f.value.removal_target_id
					}, [K("option", Kk, N(I(a)("storage.chooseTarget")), 1), (U(!0), W(H, null, B(O.value, (e) => (U(), W("option", {
						key: e.id,
						value: e.id
					}, N(e.name) + " · " + N(e.root_path), 9, qk))), 128))], 8, Gk), [[cs, p.value]])])) : (U(), W("p", Jk, N(I(a)(f.value.removal_target_id ? "storage.reconnectTarget" : "storage.noRemovalTarget")), 1)),
					K("div", Yk, [K("button", {
						type: "button",
						class: "ap-storage-button",
						onClick: n[12] ||= (e) => d.value?.close()
					}, N(I(a)("storage.cancelDirectory")), 1), K("button", {
						type: "button",
						class: "ap-storage-button",
						"data-variant": "primary",
						disabled: D.value || !O.value.some((e) => e.id === p.value),
						onClick: se
					}, N(I(a)(f.value.removal_target_id ? "storage.resumeRemove" : "storage.confirmRemove")), 9, Xk)])
				])) : Y("", !0)], 40, Hk),
				h.value ? (U(), W("p", Zk, N(h.value), 1)) : Y("", !0),
				K("ul", Qk, [(U(!0), W(H, null, B(E.value.workspaces, (e, t) => (U(), W("li", {
					key: e.id,
					class: me(["ap-workspace-row", { "ap-location-drop-target": b.value === e.id }]),
					onDragover: (t) => pe(t, e),
					onDrop: (t) => he(t, e),
					onDragend: fe
				}, [
					K("div", eA, [
						K("span", {
							class: "ap-location-drag",
							draggable: !D.value && E.value.workspaces.length > 1,
							"aria-label": I(a)("storage.dragLocation", { name: e.name }),
							title: I(a)("storage.dragLocation", { name: e.name }),
							onDragstart: (t) => de(t, e),
							onDragend: fe
						}, "⠿", 40, tA),
						K("strong", null, N(e.name), 1),
						t === 0 ? (U(), W("span", nA, N(I(a)("storage.preferred")), 1)) : Y("", !0),
						K("details", rA, [K("summary", { "aria-label": I(a)("storage.workspaceActions", { name: e.name }) }, "⋯", 8, iA), K("div", {
							class: "ap-location-menu-items",
							onClick: n[14] ||= (e) => e.target.closest("button") && (e.currentTarget.closest("details").open = !1)
						}, [
							K("details", aA, [K("summary", null, N(I(a)("storage.showPath")), 1), K("p", oA, N(e.root_path), 1)]),
							K("button", {
								type: "button",
								class: "ap-storage-button",
								disabled: D.value,
								onClick: (t) => ae(e)
							}, N(I(a)("storage.rename")), 9, sA),
							K("button", {
								type: "button",
								class: "ap-storage-button",
								disabled: D.value || E.value.workspaces.length <= 1,
								title: E.value.workspaces.length <= 1 ? I(a)("storage.lastLocation") : void 0,
								onClick: (t) => oe(e)
							}, N(I(a)(e.removal_target_id ? "storage.resumeRemove" : "storage.remove")), 9, cA),
							K("button", {
								type: "button",
								class: "ap-storage-button",
								disabled: D.value || t === 0,
								onClick: (e) => ue(t, -1)
							}, N(I(a)("storage.moveUp")), 9, lA),
							K("button", {
								type: "button",
								class: "ap-storage-button",
								disabled: D.value || t === E.value.workspaces.length - 1,
								onClick: (e) => ue(t, 1)
							}, N(I(a)("storage.moveDown")), 9, uA),
							K("button", {
								type: "button",
								class: "ap-storage-button",
								disabled: D.value,
								onClick: (t) => ge(e)
							}, N(I(a)("storage.locationLimit")), 9, dA)
						])])
					]),
					K("p", fA, [
						K("span", {
							class: "ap-storage-badge",
							"data-state": e.status
						}, N(I(a)("storage.states." + e.status)), 9, pA),
						e.status === "migrating" && e.underlying_status && e.underlying_status !== "online" ? (U(), W("small", mA, N(I(a)("storage.states." + e.underlying_status)), 1)) : Y("", !0),
						K("small", null, N(I(a)("storage.free")) + " " + N(I(KS)(e.free_bytes)), 1),
						K("small", null, N(I(a)("storage.locationUsage", {
							used: I(KS)(e.used_bytes ?? 0),
							limit: e.quota_bytes == null ? I(a)("storage.unlimited") : I(KS)(e.quota_bytes)
						})), 1),
						e.missing_count ? (U(), W("small", hA, N(I(a)("storage.missingFiles", { count: e.missing_count })), 1)) : Y("", !0)
					]),
					m.value === e.id ? (U(), W("p", gA, N(I(a)("storage.removalPending")), 1)) : Y("", !0)
				], 42, $k))), 128))])
			]),
			k.value.length ? (U(), W("section", _A, [K("h3", null, N(I(a)("storage.volumeQuota")), 1), (U(!0), W(H, null, B(k.value, (e) => (U(), W("div", {
				key: e.id,
				class: "ap-storage-fields"
			}, [K("p", null, N(E.value.workspaces.filter((t) => e.workspace_ids.includes(t.id)).map((e) => e.name).join(" · ")), 1), K("p", null, N(I(a)("storage.quotaBalance", {
				quota: I(qS)(e.quota_bytes),
				remaining: I(qS)(e.remaining_quota_bytes)
			})), 1)]))), 128))])) : Y("", !0)
		])) : (U(), W("p", gk, N(I(a)("states.loading")), 1));
	}
}), yA = /* @__PURE__ */ z((e) => {
	let { t } = Cf(), n = /* @__PURE__ */ P();
	return () => {
		let r = e.bundles.find((e) => e.id === n.value);
		return n.value ? q("div", { class: "ap-software" }, [q("button", {
			type: "button",
			class: "ap-settings-back",
			onClick: () => {
				n.value = void 0;
			}
		}, [t("actions.back")]), r ? so(r.settings) : q("section", { class: "ap-software-section" }, [q("h3", null, [J("PixInsight")]), q("p", null, [t("software.plannedDetails")])])]) : q("div", { class: "ap-software-list" }, [e.bundles.map((e) => so(e.summary, {
			key: e.id,
			onOpen: () => {
				n.value = e.id;
			}
		})), q("div", { class: "ap-software-item" }, [q("button", {
			type: "button",
			class: "ap-software-open",
			onClick: () => {
				n.value = "pixinsight";
			}
		}, [q("span", {
			class: "ap-software-item-icon",
			"aria-hidden": "true"
		}, [J("▣")]), q("span", { class: "ap-software-item-copy" }, [
			q("strong", null, [J("PixInsight")]),
			q("small", null, [t("software.pixinsightPurpose")]),
			q("small", { class: "ap-software-status" }, [q("span", {
				class: "ap-software-dot",
				"data-state": "planned"
			}, null), t("states.planned")])
		])]), q("label", { class: "ap-software-switch" }, [
			q("span", { class: "ap-software-switch-label" }, [t("software.enabled")]),
			q("input", {
				type: "checkbox",
				role: "switch",
				"aria-label": t("software.enableNamed", { name: "PixInsight" }),
				disabled: !0
			}, null),
			q("span", {
				class: "ap-software-switch-track",
				"aria-hidden": "true"
			}, [q("span", null, null)])
		])])]);
	};
}, { props: ["bundles"] }), bA = "/astrophoto/v1/previews/settings", xA = new EventTarget(), SA;
function CA() {
	return SA?.canvas.width ?? 480;
}
function wA(e) {
	return typeof e == "number" && Number.isSafeInteger(e) && e > 0;
}
function TA(e) {
	if (!$(e) || typeof e.revision != "number" || !Number.isSafeInteger(e.revision) || e.revision < 0 || typeof e.longest_edge != "number" || !Number.isSafeInteger(e.longest_edge) || e.longest_edge < 0 || !Array.isArray(e.options) || !e.options.every((e) => e === 0 || wA(e)) || !e.options.includes(e.longest_edge) || !$(e.canvas) || !wA(e.canvas.width) || !wA(e.canvas.max_height) || !wA(e.canvas_min) || !wA(e.canvas_max)) throw new Q("schema");
	let t = {
		longest_edge: e.longest_edge,
		options: e.options,
		revision: e.revision,
		canvas: {
			width: e.canvas.width,
			max_height: e.canvas.max_height
		},
		canvas_min: e.canvas_min,
		canvas_max: e.canvas_max
	};
	if (SA && SA.revision > t.revision) return SA;
	let n = SA && SA.longest_edge !== t.longest_edge;
	return SA = t, document.documentElement.style.setProperty("--astrophoto-canvas-preview-width", t.canvas.width + "px"), document.documentElement.style.setProperty("--astrophoto-canvas-preview-max-height", t.canvas.max_height + "px"), n && xA.dispatchEvent(new Event("change")), t;
}
async function EA(e) {
	return TA(await Ff(bA, e));
}
async function DA(e, t, n) {
	return TA(await If(bA, "PUT", {
		longest_edge: e,
		canvas: t,
		expected_revision: n
	}));
}
// src/features/storage/EnvironmentPage.vue?vue&type=script&setup=true&lang.ts
var OA = {
	key: 0,
	role: "status"
}, kA = { class: "ap-environment-controls" }, AA = ["for"], jA = {
	key: 0,
	role: "alert"
}, MA = /* @__PURE__ */ z({
	__name: "EnvironmentPage",
	props: {
		settingsRevision: {},
		onSaved: { type: Function }
	},
	setup(e) {
		let t = e, { t: n } = Cf(), r = Cr(), { resource: i, refresh: a } = Xy(EA), o = /* @__PURE__ */ F(), s = /* @__PURE__ */ P(), c = /* @__PURE__ */ P(!1), l = /* @__PURE__ */ F(), u = X(() => i.value.state === "ready" ? o.value ?? i.value.data : void 0), d = X(() => s.value ?? u.value?.longest_edge), f = X(() => d.value !== u.value?.longest_edge), p = X(() => n("environment.previewResolution")), m = X(() => l.value instanceof Q && l.value.status === 409);
		R(m, (e) => {
			e && Uv("error", n("environment.conflict"));
		});
		let h = X(() => u.value?.options.map((e) => ({
			value: String(e),
			label: e === 0 ? n("environment.fullResolution") : n("environment.pixels", { value: e })
		})) ?? []), g = !1;
		ke(() => {
			g = !0;
		});
		function _(e) {
			s.value = Number(e), m.value || (l.value = void 0), y();
		}
		function v() {
			o.value = void 0, s.value = void 0, l.value = void 0, a();
		}
		R(() => t.settingsRevision, (e) => {
			e !== void 0 && e > (u.value?.revision ?? -1) && v();
		});
		async function y() {
			let e = u.value, n = d.value;
			if (e && n !== void 0 && f.value && !c.value && !m.value) {
				l.value = void 0, c.value = !0;
				try {
					let r = await DA(n, e.canvas, e.revision);
					if (g) return;
					o.value = r, s.value = void 0, t.onSaved();
				} catch (e) {
					g || (s.value = void 0, l.value = e);
				} finally {
					g || (c.value = !1);
				}
			}
		}
		return (e, t) => I(i).state === "loading" ? (U(), W("p", OA, N(I(n)("states.loading")), 1)) : I(i).state === "error" ? (U(), G(I(Wv), {
			key: 1,
			error: I(i).error,
			retry: I(a)
		}, null, 8, ["error", "retry"])) : (U(), W("form", {
			key: 2,
			class: "ap-environment",
			onSubmit: t[0] ||= hs(() => {}, ["prevent"])
		}, [K("div", kA, [K("label", { for: I(r) }, N(p.value), 9, AA), q(I(US), {
			id: I(r),
			label: p.value,
			value: String(d.value),
			disabled: c.value,
			options: h.value,
			"on-change": _
		}, null, 8, [
			"id",
			"label",
			"value",
			"disabled",
			"options"
		])]), m.value ? (U(), W("div", jA, [K("p", null, N(I(n)("environment.conflict")), 1), K("button", {
			class: "ap-storage-button",
			type: "button",
			onClick: v
		}, N(I(n)("actions.refresh")), 1)])) : l.value === void 0 ? Y("", !0) : (U(), G(I(Wv), {
			key: 1,
			error: l.value
		}, null, 8, ["error"]))], 32));
	}
}), NA = /* @__PURE__ */ z((e) => {
	let { t, te: n } = Cf(), r = (e, r) => n(e) ? t(e) : r, i = /* @__PURE__ */ P(!1);
	return R(() => e.error, (r) => {
		let a = r instanceof Q ? r : new Q("network"), o = ["equipment.errors." + a.code, "errors." + a.code].find((e) => n(e)), s = !!r && Uv("error", [
			t(o ?? "errors.unknown"),
			a.code,
			a.requestId
		].filter(Boolean).join(" · "));
		i.value = s && !!e.transient && !e.retry && !a.fields && a.status !== 409;
	}, { immediate: !0 }), () => {
		let { error: a, retry: o } = e;
		if (!a || i.value) return null;
		let s = a instanceof Q ? a : new Q("network"), c = ["equipment.errors." + s.code, "errors." + s.code].find((e) => n(e));
		return q("div", {
			role: "alert",
			class: "ap-equipment-error"
		}, [
			q("p", null, [t(c ?? "errors.unknown")]),
			s.fields && Object.entries(s.fields).map(([e, t]) => q("small", { key: e }, [
				r("equipment.fields." + e.split(".").at(-1), e),
				J(" · "),
				r("equipment.validation." + String(t), String(t))
			])),
			q("small", null, [s.code, s.requestId ? " · " + s.requestId : ""]),
			o && q("button", {
				type: "button",
				onClick: o
			}, [t("actions.retry")])
		]);
	};
}, { props: [
	"error",
	"retry",
	"transient"
] });
function PA(e, t) {
	return q(NA, {
		error: e,
		retry: t
	}, null);
}
var FA = /* @__PURE__ */ z((e) => {
	let { t } = Cf(), n = Cr();
	return () => {
		let { label: r, name: i, value: a, onChange: o, options: s, control: c, type: l = "text", required: u = !1, min: d, max: f, step: p, error: m } = e, h = m?.fields?.[i], g = {
			id: n,
			name: i,
			required: u,
			value: a ?? "",
			"aria-invalid": h ? !0 : void 0,
			"aria-describedby": h ? n + "-error" : void 0
		}, _ = (e) => o?.(e.currentTarget.value);
		return q("div", { class: "ap-equipment-field" }, [
			q("label", { for: n }, [r, u ? " *" : ""]),
			c ? c(n, !!h) : s ? q("select", za(g, { onChange: _ }), [s.map((e) => q("option", {
				key: e.value,
				value: e.value,
				disabled: e.disabled
			}, [e.label]))]) : l === "textarea" ? q("textarea", za(g, {
				maxlength: 4e3,
				rows: 2,
				onInput: _
			}), null) : q("input", za(g, {
				type: l,
				min: d,
				max: f,
				step: p,
				maxlength: 120,
				onInput: _
			}), null),
			!!h && q("small", {
				id: n + "-error",
				class: "ap-equipment-error"
			}, [t("equipment.validation." + String(h))])
		]);
	};
}, { props: [
	"label",
	"name",
	"type",
	"required",
	"min",
	"max",
	"step",
	"error",
	"control",
	"options",
	"value",
	"onChange"
] }), IA = (e) => e === "" ? null : Number(e);
function LA(e) {
	return e === "mono" ? "mono" : e === "color" || e === "osc" ? "color" : null;
}
var RA = (e) => e === null ? null : new Intl.NumberFormat(void 0, { maximumFractionDigits: 4 }).format(e), zA = {
	name: "",
	notes: null,
	manufacturer: null,
	model: null,
	specs: {}
}, BA = {
	sensor_kind: ["mono", "color"],
	optics_kind: ["telescope", "lens"],
	accessory_kind: [
		"reducer",
		"flattener",
		"barlow"
	],
	filter_kind: [
		"l",
		"r",
		"g",
		"b",
		"ha",
		"oiii",
		"sii",
		"broadband",
		"uv_ir_cut",
		"solar",
		"dual_band",
		"multi_band",
		"other"
	]
}, VA = {
	sensor_width_px: 1e6,
	sensor_height_px: 1e6,
	adc_bit_depth: 64,
	max_bin_x: 1024,
	max_bin_y: 1024
}, HA = /* @__PURE__ */ new Set([
	"pixel_size_x_um",
	"pixel_size_y_um",
	"aperture_mm",
	"native_focal_length_mm",
	"native_f_ratio",
	"image_circle_mm",
	"nominal_factor",
	"design_backfocus_mm",
	"clear_aperture_mm",
	"physical_size_mm"
]), UA = {
	camera: [
		"sensor_kind",
		"sensor_width_px",
		"sensor_height_px",
		"pixel_size_x_um",
		"pixel_size_y_um"
	],
	primary_optics: ["aperture_mm", "native_focal_length_mm"],
	optical_accessory: ["accessory_kind", "nominal_factor"],
	filter: ["filter_kind"]
}, WA = {
	camera: [
		"sensor_name",
		"cooling_supported",
		"bayer_pattern",
		"adc_bit_depth",
		"max_bin_x",
		"max_bin_y"
	],
	primary_optics: [
		"optics_kind",
		"optical_design",
		"native_f_ratio",
		"image_circle_mm",
		"optical_notes"
	],
	optical_accessory: [
		"design_backfocus_mm",
		"clear_aperture_mm",
		"optical_notes"
	],
	filter: ["physical_size_mm", "filter_format"]
}, GA = [
	"gain_min",
	"gain_max",
	"offset_min",
	"offset_max"
];
function KA(e) {
	return e.passbands ?? [];
}
function qA(e) {
	return e.readout_modes ?? [];
}
var JA = {
	band_label: "",
	center_nm: null,
	fwhm_nm: null
}, YA = {
	mode_key: "",
	display_name: "",
	gain_min: null,
	gain_max: null,
	offset_min: null,
	offset_max: null
}, XA = /* @__PURE__ */ z((e) => {
	let { t } = Cf(), n = GS();
	return () => {
		let { kind: r, original: i, input: a, change: o, saved: s, back: c, reload: l } = e, u = n.pending.value, d = n.error.value;
		return q("form", {
			"aria-busy": u,
			onSubmit: (e) => {
				e.preventDefault(), n.run(async (e) => {
					let t = await gC(r, a, i, e);
					e.aborted || s(t);
				});
			}
		}, [
			q("h2", null, [
				t("equipment." + (i ? "editDevice" : "addDevice")),
				J(" · "),
				t("equipment.values." + r)
			]),
			q("fieldset", { disabled: u }, [
				q("legend", null, [t("equipment.basics")]),
				q("div", { class: "ap-equipment-grid" }, [q(FA, {
					label: t("equipment.fields.name"),
					name: "name",
					value: a.name,
					required: !0,
					error: d,
					onChange: (e) => o({
						...a,
						name: e
					})
				}, null)]),
				q(ZA, {
					kind: r,
					input: a,
					change: o,
					error: d,
					disabled: u
				}, null)
			]),
			q(NA, {
				error: d,
				retry: d?.status === 409 && i ? () => l(i) : void 0
			}, null),
			q("div", { class: "ap-equipment-actions" }, [q("button", {
				type: "button",
				disabled: u,
				onClick: c
			}, [t("equipment.cancel")]), q("button", {
				class: "ap-equipment-primary",
				disabled: u,
				type: "submit"
			}, [t(u ? "equipment.saving" : "equipment.save")])])
		]);
	};
}, { props: [
	"kind",
	"original",
	"input",
	"change",
	"saved",
	"back",
	"reload"
] }), ZA = /* @__PURE__ */ z((e) => {
	let { t } = Cf();
	return () => {
		let { kind: n, input: r, error: i, disabled: a } = e, o = r.specs, s = (t) => e.change({
			...r,
			specs: t
		});
		function c(e) {
			let n = e in VA || HA.has(e), r = e === "cooling_supported" ? ["true", "false"] : BA[e], c = r && [{
				value: "",
				label: t("equipment.unspecified")
			}, ...r.map((e) => ({
				value: e,
				label: t("equipment.values." + e)
			}))], l = e === "sensor_kind" ? LA(o[e]) : o[e], u = t("equipment.fields." + e), d = "specs." + e;
			return c ? q(FA, {
				key: e,
				label: u,
				name: d,
				error: i,
				control: (t, n) => q(US, {
					id: t,
					label: u,
					value: l == null ? "" : String(l),
					options: c,
					disabled: a,
					invalid: n,
					onChange: (t) => s({
						...o,
						[e]: t === "" ? null : e === "cooling_supported" ? t === "true" : t
					})
				}, null)
			}, null) : q(FA, {
				key: e,
				label: u,
				name: d,
				value: l == null ? null : String(l),
				error: i,
				type: n ? "number" : e === "optical_notes" ? "textarea" : "text",
				min: e === "design_backfocus_mm" ? 0 : n ? e in VA ? 1 : 1e-9 : void 0,
				max: n ? VA[e] ?? 1e6 : void 0,
				step: e in VA ? 1 : "any",
				onChange: (t) => s({
					...o,
					[e]: n ? IA(t) : t || null
				})
			}, null);
		}
		return q(H, null, [q("div", { class: "ap-equipment-grid" }, [UA[n].map(c)]), q("details", za({
			class: "ap-equipment-advanced",
			open: Object.keys(i?.fields ?? {}).some((e) => [
				"manufacturer",
				"model",
				"notes"
			].includes(e) || WA[n].includes(e.replace(/^specs\./, "")) || e.startsWith("specs.readout_modes") || e.startsWith("specs.passbands")) || void 0
		}, { onInvalidCapture: (e) => {
			e.currentTarget.open = !0;
		} }), [
			q("summary", {
				class: "ap-tree-row ap-tree-folder",
				onKeydown: (e) => {
					if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
					let t = e.currentTarget.closest("details");
					t && (e.preventDefault(), e.stopPropagation(), t.open = e.key === "ArrowRight");
				}
			}, [q($v, null, null), q("span", null, [t("equipment.advancedFields")])]),
			q("div", { class: "ap-equipment-grid" }, [[
				"manufacturer",
				"model",
				"notes"
			].map((n) => q(FA, {
				key: n,
				label: t("equipment.fields." + n),
				name: n,
				value: r[n],
				type: n === "notes" ? "textarea" : "text",
				error: i,
				onChange: (t) => e.change({
					...r,
					[n]: t
				})
			}, null)), WA[n].map(c)]),
			n === "camera" && q(H, null, [
				q("h3", null, [t("equipment.fields.readout_modes")]),
				qA(o).map((e, n) => q("fieldset", { key: n }, [
					q("legend", null, [n + 1]),
					q("div", { class: "ap-equipment-grid" }, [[
						"mode_key",
						"display_name",
						...GA
					].map((r) => {
						let a = r !== "mode_key" && r !== "display_name";
						return q(FA, {
							key: r,
							label: t("equipment.fields." + r),
							name: `specs.readout_modes.${n}.${r}`,
							value: e[r],
							required: !a,
							type: a ? "number" : "text",
							min: a ? -1e6 : void 0,
							max: a ? 1e6 : void 0,
							step: "any",
							error: i,
							onChange: (e) => s({
								...o,
								readout_modes: qA(o).map((t, i) => i === n ? {
									...t,
									[r]: a ? IA(e) : e
								} : t)
							})
						}, null);
					})]),
					q("button", {
						type: "button",
						onClick: () => s({
							...o,
							readout_modes: qA(o).filter((e, t) => t !== n)
						})
					}, [t("equipment.remove")])
				])),
				q("button", {
					type: "button",
					disabled: qA(o).length >= 32,
					onClick: () => s({
						...o,
						readout_modes: [...qA(o), YA]
					})
				}, [t("equipment.addMode")])
			]),
			n === "filter" && q(H, null, [
				q("h3", null, [t("equipment.fields.passbands")]),
				KA(o).map((e, n) => q("fieldset", { key: e.id ?? n }, [
					q("legend", null, [n + 1]),
					q("div", { class: "ap-equipment-grid" }, [[
						"band_label",
						"center_nm",
						"fwhm_nm"
					].map((r) => q(FA, {
						key: r,
						label: t("equipment.fields." + r),
						name: `specs.passbands.${n}.${r}`,
						value: e[r],
						required: r === "band_label",
						type: r === "band_label" ? "text" : "number",
						min: r === "band_label" ? void 0 : 1e-9,
						max: r === "band_label" ? void 0 : 1e6,
						step: "any",
						error: i,
						onChange: (e) => s({
							...o,
							passbands: KA(o).map((t, i) => i === n ? {
								...t,
								[r]: r === "band_label" ? e : IA(e)
							} : t)
						})
					}, null))]),
					q("button", {
						type: "button",
						onClick: () => s({
							...o,
							passbands: KA(o).filter((e, t) => t !== n)
						})
					}, [t("equipment.remove")])
				])),
				q("button", {
					type: "button",
					disabled: KA(o).length >= 32,
					onClick: () => s({
						...o,
						passbands: [...KA(o), JA]
					})
				}, [t("equipment.addBand")])
			])
		])]);
	};
}, { props: [
	"kind",
	"input",
	"change",
	"error",
	"disabled"
] }), QA = /* @__PURE__ */ z((e) => {
	let { t } = Cf();
	return () => {
		let { specs: n, kind: r } = e, i = (e) => {
			let r = e === "sensor_kind" ? LA(n[e]) : n[e];
			return r == null ? t("equipment.unspecified") : e === "cooling_supported" || e in BA ? t("equipment.values." + r) : String(r);
		}, a = KA(n);
		return q(H, null, [
			q("dl", { class: "ap-equipment-definitions" }, [[...UA[r], ...WA[r]].map((e) => q("div", { key: e }, [q("dt", null, [t("equipment.fields." + e)]), q("dd", null, [i(e)])]))]),
			r === "filter" && q(H, null, [
				q("h4", null, [t("equipment.fields.passbands")]),
				(!a.length || n.filter_kind === "dual_band" && a.length < 2 || a.some((e) => e.center_nm === null || e.fwhm_nm === null)) && q("small", null, [t("equipment.incompleteBands")]),
				q("ul", null, [a.map((e, n) => q("li", { key: e.id ?? n }, [
					e.band_label,
					J(" · "),
					e.center_nm === null ? t("equipment.unspecified") : e.center_nm + " nm",
					J(" ·"),
					" ",
					t("equipment.fields.fwhm_nm"),
					J(" "),
					e.fwhm_nm ?? t("equipment.unspecified")
				]))])
			]),
			r === "camera" && qA(n).length > 0 && q(H, null, [q("h4", null, [t("equipment.fields.readout_modes")]), qA(n).map((e) => q("details", { key: e.mode_key }, [q("summary", null, [
				e.display_name,
				J(" ("),
				e.mode_key,
				J(")")
			]), q("dl", null, [GA.map((n) => q("div", { key: n }, [q("dt", null, [t("equipment.fields." + n)]), q("dd", null, [e[n] ?? t("equipment.unspecified")])]))])]))])
		]);
	};
}, { props: ["specs", "kind"] }), $A = /* @__PURE__ */ z((e, { slots: t }) => {
	let n = /* @__PURE__ */ P(e.initiallyOpen ?? !1), r = Cr();
	return () => q("section", { class: "ap-detail-section" }, [q("button", {
		type: "button",
		class: "ap-detail-toggle ap-tree-row ap-tree-folder",
		"aria-expanded": n.value,
		"aria-controls": r,
		onClick: () => {
			n.value = !n.value;
		}
	}, [
		q($v, null, null),
		q("span", null, [e.title]),
		e.count && q("small", null, [e.count])
	]), q("div", {
		id: r,
		hidden: !n.value,
		class: "ap-detail-content"
	}, [t.default?.()])]);
}, { props: [
	"title",
	"count",
	"initiallyOpen"
] }), ej = /* @__PURE__ */ z((e) => {
	let { t } = Cf();
	return () => {
		let { editLabel: n, archived: r, pending: i, onEdit: a, onArchive: o, onDelete: s } = e;
		return q("div", { class: "ap-equipment-actions ap-equipment-detail-actions" }, [
			a && q("button", {
				class: "ap-equipment-primary",
				type: "button",
				disabled: i,
				onClick: a
			}, [n]),
			q("button", {
				type: "button",
				disabled: i,
				onClick: o
			}, [t("equipment." + (r ? "restore" : "archive"))]),
			q("button", {
				class: "ap-equipment-delete",
				type: "button",
				disabled: i,
				onClick: s
			}, [t("equipment.deleteAction")])
		]);
	};
}, { props: [
	"editLabel",
	"archived",
	"pending",
	"onEdit",
	"onArchive",
	"onDelete"
] });
// src/features/library/components/ResourceContent.tsx
function tj({ resource: e, loadingLabel: t, retry: n, renderContent: r, renderError: i }) {
	return e.state === "loading" ? q("p", { role: "status" }, [t]) : e.state === "error" ? i ? q(H, null, [i(e.error, n)]) : q(Wv, {
		error: e.error,
		retry: n
	}, null) : q(H, null, [r(e.data)]);
}
tj.props = [
	"resource",
	"loadingLabel",
	"retry",
	"renderContent",
	"renderError"
];
// src/features/library/pages/EquipmentDetails.tsx
var nj = /* @__PURE__ */ z((e) => {
	let { t } = Cf(), { resource: n, refresh: r } = Xy(X(() => {
		let t = e.id;
		return (e) => hC(t, e);
	})), i = GS(), a = /* @__PURE__ */ P(!1);
	return () => {
		let { edit: o, openTrain: s, changed: c, deleted: l } = e;
		return q(tj, {
			resource: n.value,
			loadingLabel: t("states.loading"),
			retry: r,
			renderError: PA,
			renderContent: (e) => {
				let n = e.usage_summary ?? [], u = [...UA[e.equipment_type], ...WA[e.equipment_type]], d = u.filter((t) => e.specs[t] !== null && e.specs[t] !== void 0 && e.specs[t] !== ""), f = [
					"manufacturer",
					"model",
					"notes"
				].filter((t) => !!e[t]?.trim());
				return q(H, null, [
					q("div", { class: "ap-detail-card" }, [
						q("h2", null, [e.name]),
						q("small", null, [
							t("equipment.values." + e.equipment_type),
							J(" · "),
							t(e.archived_at_utc ? "equipment.values.archived" : "equipment.inUse")
						]),
						q("dl", { class: "ap-equipment-definitions" }, [d.slice(0, 4).map((n) => q("div", { key: n }, [q("dt", null, [t("equipment.fields." + n)]), q("dd", null, [typeof e.specs[n] == "boolean" || [
							"sensor_kind",
							"optics_kind",
							"accessory_kind",
							"filter_kind"
						].includes(n) ? t("equipment.values." + e.specs[n]) : String(e.specs[n])])]))])
					]),
					q($A, {
						title: t("equipment.basics"),
						initiallyOpen: !0
					}, { default: () => f.length ? q("dl", { class: "ap-equipment-definitions" }, [f.map((n) => q("div", { key: n }, [q("dt", null, [t("equipment.fields." + n)]), q("dd", null, [e[n]])]))]) : q("p", null, [t("equipment.noBasicInformation")]) }),
					q($A, {
						title: t("equipment.specs"),
						count: d.length + " / " + u.length
					}, { default: () => q(QA, {
						specs: e.specs,
						kind: e.equipment_type
					}, null) }),
					q($A, {
						title: t("equipment.usage"),
						count: String(n.length)
					}, { default: () => n.length ? q("ul", null, [n.map((e) => q("li", { key: e.train_id }, [q("button", {
						type: "button",
						onClick: () => s(e.train_id)
					}, [e.name])]))]) : q("p", null, [t("equipment.noUsage")]) }),
					q(NA, {
						transient: !0,
						error: i.error.value,
						retry: i.error.value?.status === 409 ? r : void 0
					}, null),
					q(ej, {
						editLabel: t("equipment.editAction"),
						archived: !!e.archived_at_utc,
						pending: i.pending.value,
						onEdit: () => o(e),
						onArchive: () => void i.run(async (n) => {
							if (!e.archived_at_utc && !await WS(t("equipment.archive"), t("equipment.archiveDeviceConfirm"), e.name) || n.aborted) return;
							let i = await _C(e, n);
							n.aborted || (c(i.archived_at_utc ? "archivedReceipt" : "restoredReceipt"), r());
						}),
						onDelete: () => void i.run(async (r) => {
							n.length ? (a.value = !0, Uv("warning", t("equipment.deleteReferenced"))) : await WS(t("equipment.deleteDevice"), t("equipment.deleteDeviceConfirm"), e.name, "delete") && !r.aborted && (await vC(e, r), r.aborted || l());
						})
					}, null),
					a.value && n.length > 0 && q("div", {
						role: "alert",
						class: "ap-equipment-error"
					}, [q("p", null, [t("equipment.deleteReferenced")]), q("ul", null, [n.map((e) => q("li", { key: e.train_id }, [q("button", {
						type: "button",
						onClick: () => s(e.train_id)
					}, [e.name])]))])])
				]);
			}
		}, null);
	};
}, { props: [
	"id",
	"edit",
	"openTrain",
	"changed",
	"deleted"
] });
// src/features/library/components/RecordRows.tsx
function rj({ records: e, recordKey: t, renderRecord: n, renderEmpty: r }) {
	return e.length > 0 ? q("ul", { class: "ap-equipment-list" }, [e.map((e) => q("li", { key: t(e) }, [n(e)]))]) : q(H, null, [r()]);
}
rj.props = [
	"records",
	"recordKey",
	"renderRecord",
	"renderEmpty"
];
// src/features/library/pages/EquipmentList.tsx
var ij = /* @__PURE__ */ z((e) => {
	let { t } = Cf(), n = /* @__PURE__ */ P(e.search.q.trim()), r = (e) => {
		n.value = e.trim();
	}, i = /* @__PURE__ */ F(), a = GS(), o = X(() => ({
		mode: e.mode,
		filter: e.search.filter,
		q: n.value,
		epoch: e.epoch
	})), s = X(() => {
		let { mode: e, filter: t, q: n } = o.value;
		return (r, i = "") => {
			let a = {
				q: n,
				after: i,
				archived: t === "archived" ? "true" : "false"
			};
			return e === "devices" ? mC({
				...a,
				type: JS.includes(t) ? t : void 0
			}, r) : yC({
				...a,
				status: t || void 0
			}, r);
		};
	}), { resource: c, refresh: l } = Xy(s);
	return () => {
		let { search: o, setSearch: u, mode: d, open: f, add: p } = e, m = [
			"",
			...d === "devices" ? JS : ["draft", "published"],
			"archived"
		], h = c.value;
		return q(H, null, [
			q("div", { class: "ap-equipment-actions" }, [q("h2", null, [t("equipment." + d), h.state === "ready" && h.data.total !== void 0 && q(H, null, [J(" · "), h.data.total])]), q("button", {
				type: "button",
				class: "ap-equipment-primary",
				onClick: p
			}, [t("equipment." + (d === "devices" ? "addDevice" : "addTrain"))])]),
			q("div", { class: "ap-search-toolbar ap-equipment-search" }, [q(zv, {
				label: t("equipment." + (d === "devices" ? "searchDevice" : "searchTrain")),
				clearLabel: t("browse.clear"),
				value: o.q,
				onValueChange: (e) => u({
					...o,
					q: e
				}),
				onSearch: r
			}, null), q(Bv, {
				icon: "filter",
				label: t("equipment.filterList"),
				options: m.map((e) => ({
					id: e || "active",
					label: t(e === "published" ? "equipment.configured" : e ? "equipment.values." + e : "equipment.active"),
					checked: o.filter === e,
					select: () => u({
						...o,
						filter: e
					})
				}))
			}, null)]),
			q(tj, {
				resource: h,
				loadingLabel: t("states.loading"),
				retry: () => {
					i.value = void 0, l();
				},
				renderError: PA,
				renderContent: (e) => {
					let r = s.value, c = i.value?.request === r ? i.value : void 0, l = e.items.concat(c?.items ?? []), p = c ? c.next : e.next;
					return q(H, null, [
						q(rj, {
							records: l,
							recordKey: (e) => e.id,
							renderRecord: (e) => q("button", {
								type: "button",
								onClick: () => f(e.id),
								class: "ap-equipment-row"
							}, [q("strong", { title: e.name }, [e.name]), "equipment_type" in e ? q(aj, { device: e }, null) : q(oj, { train: e }, null)]),
							renderEmpty: () => q(H, null, [q("p", null, [t("equipment." + (n.value || o.filter ? "noMatches" : d === "devices" ? "emptyDevices" : "emptyTrains"))]), (o.q || o.filter) && q("button", {
								type: "button",
								onClick: () => u({
									q: "",
									filter: ""
								})
							}, [t("equipment.resetSearch")])])
						}, null),
						q(NA, { error: a.error.value }, null),
						p && q("button", {
							type: "button",
							disabled: a.pending.value,
							onClick: () => void a.run(async (e) => {
								let t = await r(e, p);
								!e.aborted && s.value === r && (i.value = {
									request: r,
									items: (c?.items ?? []).concat(t.items),
									next: t.next
								});
							})
						}, [t("equipment.more")])
					]);
				}
			}, null)
		]);
	};
}, { props: [
	"search",
	"setSearch",
	"mode",
	"open",
	"add",
	"epoch"
] }), aj = /* @__PURE__ */ z((e) => {
	let { t } = Cf();
	return () => {
		let { device: n } = e, r = n.specs, i = LA(r.sensor_kind), a = n.equipment_type === "camera" ? i && t("equipment.values." + i) : n.equipment_type === "primary_optics" ? r.native_focal_length_mm && r.native_focal_length_mm + " mm" : n.equipment_type === "optical_accessory" ? r.nominal_factor && r.nominal_factor + "×" : r.filter_kind && t("equipment.values." + r.filter_kind);
		return q("small", null, [[
			t("equipment.values." + n.equipment_type),
			n.manufacturer,
			n.model,
			a,
			n.archived_at_utc && t("equipment.values.archived")
		].filter(Boolean).join(" · ")]);
	};
}, { props: ["device"] }), oj = /* @__PURE__ */ z((e) => {
	let { t } = Cf();
	return () => {
		let { train: n } = e, { camera: r, primary_optics: i, accessories: a, filters: o } = n.summary;
		return q(H, null, [
			q("small", null, [t(n.status === "published" ? "equipment.configured" : "equipment.values." + n.status)]),
			q("small", null, [[
				r,
				i,
				...a
			].filter(Boolean).join(" + ")]),
			o.length > 0 && q("small", null, [
				t("equipment.fields.filter_ids"),
				J(" · "),
				o.join(", ")
			])
		]);
	};
}, { props: ["train"] }), sj = {
	name: "",
	notes: null,
	base_revision_id: null,
	change_summary: null,
	camera_id: null,
	primary_optics_id: null,
	accessory_ids: [],
	filter_ids: [],
	optical_state: {
		rotation_deg: null,
		flat_validity_note: null,
		configuration_note: null
	}
}, cj = /* @__PURE__ */ z((e) => {
	let { t } = Cf(), n = Xy(TC), r = GS();
	return () => {
		let { edit: i, change: a, addDevice: o, cancel: s, saved: c } = e, { data: l } = i, u = n.resource.value.state === "ready" ? n.resource.value.data : [], d = (e) => a({
			...i,
			data: e
		}), f = r.pending.value, p = r.error.value, m = [
			l.camera_id,
			l.primary_optics_id,
			...l.accessory_ids,
			...l.filter_ids
		].filter((e) => e && !u.some((t) => t.id === e && !t.archived_at_utc));
		async function h(e) {
			let t = i.id;
			if (t) await CC(t, l, i.expected, e), e.aborted || c(t);
			else {
				let t = await SC(l, e);
				e.aborted || c(t.train.id);
			}
		}
		function g(e, t) {
			let n = [...l.accessory_ids];
			[n[e], n[e + t]] = [n[e + t], n[e]], d({
				...l,
				accessory_ids: n
			});
		}
		let _ = (e) => u.filter((t) => t.equipment_type === e && !t.archived_at_utc), v = (e) => u.find((t) => t.id === e)?.name ?? e, y = (e) => m.includes(e) ? " · " + t("equipment.invalidDevice") : "", b = (e) => q("button", {
			type: "button",
			onClick: () => o(e)
		}, [t("equipment.quickAdd", { type: t("equipment.values." + e) })]), x = (e, n = null, r = []) => {
			let i = _(e).filter((e) => !r.includes(e.id));
			return [
				{
					value: "",
					label: t("equipment.pickDevice")
				},
				...i.map((e) => ({
					value: e.id,
					label: e.name
				})),
				...n && !i.some((e) => e.id === n) ? [{
					value: n,
					label: v(n) + y(n),
					disabled: !0
				}] : []
			];
		}, S = l.accessory_ids.map((e) => u.find((t) => t.id === e)?.specs.nominal_factor), C = u.find((e) => e.id === l.primary_optics_id), w = C?.specs.native_focal_length_mm, T = C?.specs.aperture_mm, E = typeof w == "number" && S.every((e) => typeof e == "number") && !m.length ? S.reduce((e, t) => e * Number(t), w) : null;
		return q("form", {
			"aria-busy": f,
			onSubmit: (e) => {
				e.preventDefault(), r.run(h);
			}
		}, [
			q("h2", null, [t("equipment." + (i.id ? "editTrain" : "addTrain"))]),
			q("fieldset", { disabled: f }, [q("legend", null, [t("equipment.basics")]), q("div", { class: "ap-equipment-grid" }, [q(FA, {
				label: t("equipment.fields.name"),
				name: "name",
				value: l.name,
				required: !0,
				error: p,
				onChange: (e) => d({
					...l,
					name: e
				})
			}, null), q(FA, {
				label: t("equipment.fields.notes"),
				name: "notes",
				type: "textarea",
				value: l.notes,
				error: p,
				onChange: (e) => d({
					...l,
					notes: e || null
				})
			}, null)])]),
			q(tj, {
				resource: n.resource.value,
				loadingLabel: t("states.loading"),
				retry: n.refresh,
				renderError: PA,
				renderContent: () => q(H, null, [
					q("fieldset", { disabled: f }, [
						q("legend", null, [t("equipment.components")]),
						["camera_id", "primary_optics_id"].map((e) => {
							let n = e === "camera_id" ? "camera" : "primary_optics";
							return q("div", {
								class: "ap-equipment-picker",
								key: e
							}, [q(FA, {
								label: t("equipment.fields." + e),
								name: e,
								error: p,
								control: (r, i) => q(US, {
									id: r,
									label: t("equipment.fields." + e),
									value: l[e] ?? "",
									options: x(n, l[e]),
									disabled: f,
									invalid: i,
									onChange: (t) => d({
										...l,
										[e]: t || null
									})
								}, null)
							}, null), b(n)]);
						}),
						q("h3", null, [t("equipment.fields.accessory_ids")]),
						q("ol", { class: "ap-equipment-list" }, [l.accessory_ids.map((e, n) => q("li", { key: e }, [q("span", null, [
							n + 1,
							J(". "),
							v(e),
							y(e)
						]), q("div", { class: "ap-equipment-actions" }, [
							q("button", {
								type: "button",
								disabled: n === 0,
								onClick: () => g(n, -1)
							}, [t("equipment.moveUp")]),
							q("button", {
								type: "button",
								disabled: n + 1 === l.accessory_ids.length,
								onClick: () => g(n, 1)
							}, [t("equipment.moveDown")]),
							q("button", {
								type: "button",
								onClick: () => d({
									...l,
									accessory_ids: l.accessory_ids.filter((t) => t !== e)
								})
							}, [t("equipment.remove")])
						])]))]),
						q("div", { class: "ap-equipment-picker" }, [q(FA, {
							label: t("equipment.addAccessory"),
							name: "accessory_ids",
							error: p,
							control: (e, n) => q(US, {
								id: e,
								label: t("equipment.addAccessory"),
								value: "",
								options: x("optical_accessory", null, l.accessory_ids),
								disabled: f,
								invalid: n,
								onChange: (e) => {
									e && l.accessory_ids.length < 50 && d({
										...l,
										accessory_ids: [...l.accessory_ids, e]
									});
								}
							}, null)
						}, null), b("optical_accessory")])
					]),
					q("fieldset", { disabled: f }, [q("legend", null, [t("equipment.fields.filter_ids")]), q("div", { class: "ap-equipment-picker" }, [q("div", { class: "ap-equipment-field" }, [q(IC, {
						label: t("equipment.fields.filter_ids"),
						placeholder: t("equipment.pickDevice"),
						emptyText: t("equipment.unspecified"),
						disabled: f,
						value: l.filter_ids,
						options: [.../* @__PURE__ */ new Set([..._("filter").map((e) => e.id), ...l.filter_ids])].map((e) => ({
							value: e,
							name: v(e) + y(e)
						})),
						onChange: (e) => {
							e.length <= 50 && d({
								...l,
								filter_ids: e
							});
						}
					}, null)]), b("filter")])]),
					q("small", null, [
						t("equipment.estimate"),
						J(" · "),
						RA(E) ?? t("equipment.unspecified"),
						E !== null && " mm",
						J(" · ƒ/"),
						E !== null && typeof T == "number" ? RA(E / T) : t("equipment.unspecified")
					])
				])
			}, null),
			n.resource.value.state === "ready" && m.length > 0 && q("small", null, [t("equipment.invalidDevice")]),
			q(NA, {
				error: p,
				retry: p?.status === 409 && i.id ? () => void r.run(async (e) => {
					let n = await bC(i.id, e);
					if (n.status === "archived") throw new Q("TRAIN_ARCHIVED");
					if (n.status === "deleted") throw new Q("TRAIN_NOT_FOUND");
					!e.aborted && await WS(t("equipment.reload"), t("equipment.rebaseTrainConfirm")) && !e.aborted && a({
						...i,
						expected: n.configuration?.draft_version ?? null,
						saved: n.configuration?.draft ?? null
					});
				}) : void 0
			}, null),
			q("div", { class: "ap-equipment-actions" }, [q("button", {
				type: "button",
				disabled: f,
				onClick: s
			}, [t("equipment.cancel")]), q("button", {
				type: "submit",
				class: "ap-equipment-primary",
				disabled: f
			}, [t("equipment.save")])]),
			f && q("small", { role: "status" }, [t("equipment.saving")])
		]);
	};
}, { props: [
	"edit",
	"change",
	"addDevice",
	"cancel",
	"saved"
] });
function lj(e, t) {
	let n = { ...e.data };
	switch (t.equipment_type) {
		case "camera":
			n.camera_id = t.id;
			break;
		case "primary_optics":
			n.primary_optics_id = t.id;
			break;
		case "optical_accessory":
			n.accessory_ids = [...n.accessory_ids, t.id].slice(0, 50);
			break;
		case "filter": n.filter_ids = [...n.filter_ids, t.id].slice(0, 50);
	}
	return {
		...e,
		data: n
	};
}
// src/features/library/pages/OpticalTrainDetails.tsx
var uj = /* @__PURE__ */ z((e) => {
	let { t } = Cf(), n = Xy(X(() => {
		let t = e.id;
		return (e) => bC(t, e);
	})), r = GS();
	return () => {
		let { edit: i, changed: a, openDevice: o, deleted: s } = e;
		return q(tj, {
			resource: n.resource.value,
			loadingLabel: t("states.loading"),
			retry: n.refresh,
			renderError: PA,
			renderContent: (e) => {
				let c = e.status === "archived", l = e.status === "deleted";
				return q(H, null, [
					q("div", { class: "ap-detail-card" }, [
						q("h2", null, [e.name]),
						q("small", null, [t(e.status === "published" ? "equipment.configured" : "equipment.values." + e.status)]),
						q(dj, { train: e }, null)
					]),
					q(fj, {
						train: e,
						openDevice: o
					}, null),
					q(NA, {
						transient: !0,
						error: r.error.value,
						retry: r.error.value?.status === 409 ? n.refresh : void 0
					}, null),
					!l && q(ej, {
						editLabel: t("equipment.editTrain"),
						archived: c,
						pending: r.pending.value,
						onEdit: c ? void 0 : () => i(e),
						onArchive: () => void r.run(async (r) => {
							if (!c && !await WS(t("equipment.archive"), t("equipment.archiveTrainConfirm"), e.name) || r.aborted) return;
							let i = await wC(e, r);
							r.aborted || (a(i.status === "archived" ? "archivedReceipt" : "restoredReceipt"), n.refresh());
						}),
						onDelete: () => void r.run(async (n) => {
							await WS(t("equipment.deleteTrain"), t("equipment.deleteTrainConfirm"), e.name, "delete") && !n.aborted && (await xC(e, n), n.aborted || s());
						})
					}, null)
				]);
			}
		}, null);
	};
}, { props: [
	"id",
	"edit",
	"changed",
	"openDevice",
	"deleted"
] }), dj = /* @__PURE__ */ z((e) => {
	let { t } = Cf();
	return () => {
		let { train: n } = e, r = n.configuration?.draft;
		if (!r) return null;
		let i = new Map(n.components?.map((e) => [e.id, e])), a = r.primary_optics_id ? i.get(r.primary_optics_id) : void 0, o = a?.specs.native_focal_length_mm, s = a?.specs.aperture_mm, c = r.accessory_ids.map((e) => i.get(e)?.specs.nominal_factor);
		if (typeof o != "number" || o <= 0 || !c.every((e) => typeof e == "number" && e > 0)) return null;
		let l = c.reduce((e, t) => e * Number(t), o);
		return !Number.isFinite(l) || l <= 0 ? null : q("p", null, [
			t("equipment.estimate"),
			J(" · "),
			RA(l),
			J(" mm"),
			typeof s == "number" && s > 0 && Number.isFinite(l / s) && " · ƒ/" + RA(l / s)
		]);
	};
}, { props: ["train"] }), fj = /* @__PURE__ */ z((e) => {
	let { t } = Cf();
	return () => {
		let { train: n, openDevice: r } = e, i = n.configuration?.draft;
		if (!i) return q("p", null, [t("equipment.noConfiguration")]);
		let a = new Map(n.components?.map((e) => [e.id, e])), o = (e) => e ? a.get(e)?.name ?? e : t("equipment.unspecified"), s = (e) => q(pj, {
			id: e,
			device: a.get(e),
			openDevice: r
		}, null);
		return q(H, null, [
			q($A, {
				title: t("equipment.currentConfiguration"),
				initiallyOpen: !0
			}, { default: () => q(H, null, [i.notes && q("p", null, [i.notes]), q("dl", { class: "ap-equipment-definitions" }, [
				q("div", null, [q("dt", null, [t("equipment.fields.camera_id")]), q("dd", null, [o(i.camera_id)])]),
				q("div", null, [q("dt", null, [t("equipment.fields.primary_optics_id")]), q("dd", null, [o(i.primary_optics_id)])]),
				q("div", null, [q("dt", null, [
					t("equipment.fields.accessory_ids"),
					J(" · "),
					i.accessory_ids.length
				]), q("dd", null, [i.accessory_ids.map(o).join(", ") || t("equipment.unspecified")])]),
				q("div", null, [q("dt", null, [
					t("equipment.fields.filter_ids"),
					J(" · "),
					i.filter_ids.length
				]), q("dd", null, [i.filter_ids.map(o).join(", ") || t("equipment.unspecified")])])
			])]) }),
			q($A, {
				title: t("equipment.componentDetails"),
				count: String([
					i.camera_id,
					i.primary_optics_id,
					...i.accessory_ids
				].filter(Boolean).length)
			}, { default: () => q(H, null, [[
				i.camera_id,
				i.primary_optics_id,
				...i.accessory_ids
			].map((e) => e && q("div", { key: e }, [s(e)]))]) }),
			q($A, {
				title: t("equipment.fields.filter_ids"),
				count: String(i.filter_ids.length)
			}, { default: () => q(H, null, [i.filter_ids.length ? i.filter_ids.map((e) => q("div", { key: e }, [s(e)])) : q("p", null, [t("equipment.unspecified")])]) })
		]);
	};
}, { props: ["train", "openDevice"] }), pj = /* @__PURE__ */ z((e) => {
	let { t } = Cf();
	return () => {
		let { id: n, device: r, openDevice: i } = e;
		return r ? q("details", null, [
			q("summary", null, [
				r.name,
				J(" · "),
				t("equipment.values." + r.equipment_type),
				r.archived_at_utc && " · " + t("equipment.values.archived")
			]),
			q("button", {
				type: "button",
				onClick: () => i(n)
			}, [r.name]),
			q("small", null, [[r.manufacturer, r.model].filter(Boolean).join(" · ")]),
			r.notes && q("p", null, [r.notes]),
			q(QA, {
				specs: r.specs,
				kind: r.equipment_type
			}, null)
		]) : q("p", null, [
			t("equipment.invalidDevice"),
			J(" · "),
			n
		]);
	};
}, { props: [
	"id",
	"device",
	"openDevice"
] }), mj = ["devices", "trains"], hj = () => ({
	id: null,
	expected: null,
	data: sj,
	saved: null
}), gj = /* @__PURE__ */ z((e) => {
	let { t } = Cf(), n = e.session.current, r = /* @__PURE__ */ F(n?.page ?? { name: "equipment-list" }), i = /* @__PURE__ */ F(n?.deviceInput ?? zA), a = /* @__PURE__ */ P(n?.deviceDirty ?? !1), o = /* @__PURE__ */ F(n?.train ?? hj()), s = /* @__PURE__ */ F({
		q: "",
		filter: ""
	}), c = /* @__PURE__ */ F({
		q: "",
		filter: ""
	}), l = /* @__PURE__ */ P(0), u = /* @__PURE__ */ P(""), d = /* @__PURE__ */ P(!!n), f = /* @__PURE__ */ P(null), p = X(() => r.value.name.startsWith("train-") ? "trains" : "devices"), m = X(() => r.value.name === "equipment-form" && r.value.quick), h = X(() => a.value || (r.value.name === "train-form" || m.value) && JSON.stringify(o.value.data) !== JSON.stringify(o.value.saved ?? sj)), g = GS(), _ = /* @__PURE__ */ P(p.value === "trains");
	R([
		h,
		r,
		i,
		a,
		o
	], () => {
		e.session.current = h.value ? {
			page: r.value,
			deviceInput: i.value,
			deviceDirty: a.value,
			train: o.value
		} : void 0;
	}, {
		immediate: !0,
		flush: "sync"
	});
	function v() {
		return !!f.value?.querySelector("form[aria-busy=\"true\"]");
	}
	async function y() {
		return !v() && (!h.value || await WS(t("equipment.unsaved"), t("equipment.discardConfirm")));
	}
	async function b() {
		return await y() ? (a.value = !1, o.value = hj(), r.value = { name: "equipment-list" }, e.session.current = void 0, !0) : !1;
	}
	zr(() => {
		e.guard.value = b;
	}), ke(() => {
		e.guard.value === b && (e.guard.value = null);
	}), R(h, (e, t, n) => {
		if (!e) return;
		let r = (e) => {
			e.preventDefault(), e.returnValue = "";
		};
		window.addEventListener("beforeunload", r), n(() => window.removeEventListener("beforeunload", r));
	}, { immediate: !0 });
	function x() {
		f.value?.querySelector("[data-current=\"true\"]")?.focus({ preventScroll: !0 });
	}
	zr(x), R(() => r.value.name, x, { flush: "post" });
	function S(e) {
		u.value = Uv("success", t("equipment." + e)) ? "" : e, l.value += 1;
	}
	function C(e) {
		u.value = "", d.value = !1, r.value = e;
	}
	async function w(e) {
		let t = e === "devices" ? "equipment-list" : "train-list";
		r.value.name !== t && await y() && (a.value = !1, o.value = hj(), e === "trains" && (_.value = !0), C({ name: t }));
	}
	function T(e) {
		_.value = !0, C({
			name: "train-detail",
			id: e
		});
	}
	function E(e, t, n = !1) {
		i.value = t ? {
			name: t.name,
			manufacturer: t.manufacturer,
			model: t.model,
			notes: t.notes,
			specs: t.specs
		} : zA, a.value = !1, C({
			name: "equipment-form",
			kind: e,
			original: t,
			quick: n
		});
	}
	function D(e) {
		let t = e?.configuration?.draft ?? null;
		o.value = {
			id: e?.id ?? null,
			expected: e?.configuration?.draft_version ?? null,
			data: t ?? (e ? {
				...sj,
				name: e.name,
				notes: e.notes
			} : sj),
			saved: t
		}, C({ name: "train-form" });
	}
	async function O() {
		if (v()) return;
		let n = r.value;
		if (n.name === "equipment-form" && n.quick) {
			if (a.value && !await WS(t("equipment.unsaved"), t("equipment.discardConfirm"))) return;
			a.value = !1, C({ name: "train-form" });
			return;
		}
		if (!await y()) return;
		let i = o.value.id;
		switch (a.value = !1, o.value = hj(), e.session.current = void 0, n.name) {
			case "equipment-list":
			case "train-list":
				e.onBack();
				break;
			case "equipment-type":
			case "equipment-detail":
				C({ name: "equipment-list" });
				break;
			case "equipment-form":
				C(n.original ? {
					name: "equipment-detail",
					id: n.original.id
				} : { name: "equipment-type" });
				break;
			case "train-form":
				i ? T(i) : C({ name: "train-list" });
				break;
			case "train-detail": C({ name: "train-list" });
		}
	}
	function k(e) {
		i.value = e, a.value = !0;
	}
	function A(e) {
		a.value = !1, m.value ? (o.value = lj(o.value, e), C({ name: "train-form" })) : C({
			name: "equipment-detail",
			id: e.id
		}), S("deviceReceipt");
	}
	function j(e) {
		let n = r.value;
		n.name === "equipment-form" && g.run(async (i) => {
			let a = await hC(e.id, i);
			!i.aborted && r.value === n && await WS(t("equipment.reload"), t("equipment.rebaseDeviceConfirm")) && !i.aborted && r.value === n && (r.value = {
				...n,
				original: a
			});
		});
	}
	return () => {
		let n = r.value;
		return q("div", {
			class: "ap-equipment",
			ref: f
		}, [
			q("div", { class: "ap-equipment-heading" }, [q("button", {
				type: "button",
				class: "ap-settings-back",
				onClick: () => void O()
			}, [t("actions.back")]), q("h2", null, [t("modules.equipment.title")])]),
			q(Zy, {
				items: mj,
				active: p.value,
				prefix: "ap-equipment",
				label: t("modules.equipment.title"),
				title: (e) => t("equipment." + e),
				select: (e) => void w(e)
			}, null),
			d.value && q("small", { role: "status" }, [t("equipment.sessionRestored")]),
			u.value && q("small", { role: "status" }, [t("equipment." + u.value)]),
			h.value && q("small", null, [t("equipment.unsaved")]),
			mj.map((r) => {
				let a = n.name === (r === "devices" ? "equipment-list" : "train-list");
				return q("div", {
					key: r,
					role: "tabpanel",
					id: "ap-equipment-panel-" + r,
					"aria-labelledby": "ap-equipment-tab-" + r,
					class: "ap-equipment-panel",
					hidden: r !== p.value
				}, [q("div", {
					class: "ap-scroll",
					"data-current": r === p.value && a,
					tabindex: -1,
					hidden: !a
				}, [r === "devices" ? q(ij, {
					search: s.value,
					setSearch: (e) => {
						s.value = e;
					},
					mode: "devices",
					epoch: l.value,
					open: (e) => C({
						name: "equipment-detail",
						id: e
					}),
					add: () => C({ name: "equipment-type" })
				}, null) : e.trainAvailable ? _.value && q(ij, {
					search: c.value,
					setSearch: (e) => {
						c.value = e;
					},
					mode: "trains",
					epoch: l.value,
					open: T,
					add: () => D()
				}, null) : q("p", { role: "status" }, [t("equipment.unavailable")])]), r === p.value && !a && q("div", {
					class: "ap-scroll",
					"data-current": "true",
					tabindex: -1,
					key: n.name
				}, [
					n.name === "equipment-type" && q(H, null, [q("h2", null, [t("equipment.chooseType")]), q("ul", { class: "ap-equipment-list" }, [JS.map((e) => q("li", { key: e }, [q("button", {
						class: "ap-equipment-row",
						type: "button",
						onClick: () => E(e, null)
					}, [q("strong", null, [t("equipment.values." + e)]), q("small", null, [t("equipment.typeHint." + e)])])]))])]),
					n.name === "equipment-form" && q(H, null, [q(XA, {
						kind: n.kind,
						original: n.original,
						input: i.value,
						change: k,
						saved: A,
						back: () => void O(),
						reload: j
					}, null), q(NA, { error: g.error.value }, null)]),
					n.name === "equipment-detail" && q(nj, {
						key: n.id,
						id: n.id,
						edit: (e) => E(e.equipment_type, e),
						openTrain: T,
						changed: S,
						deleted: () => {
							C({ name: "equipment-list" }), S("deletedReceipt");
						}
					}, null),
					n.name === "train-form" && q(cj, {
						edit: o.value,
						change: (e) => {
							o.value = e;
						},
						addDevice: (e) => E(e, null, !0),
						cancel: () => void O(),
						saved: (e) => {
							o.value = hj(), T(e), S("trainReceipt");
						}
					}, null),
					n.name === "train-detail" && q(uj, {
						key: n.id,
						id: n.id,
						edit: D,
						changed: S,
						openDevice: (e) => C({
							name: "equipment-detail",
							id: e
						}),
						deleted: () => {
							C({ name: "train-list" }), S("deletedReceipt");
						}
					}, null)
				])]);
			})
		]);
	};
}, { props: [
	"guard",
	"session",
	"trainAvailable",
	"onBack"
] }), _j = /* @__PURE__ */ z((e) => {
	let { t } = Cf();
	return () => {
		let { status: n, refresh: r, storage: i, refreshStorage: a, equipmentGuard: o, equipmentSession: s, bundles: c, selectedModule: l, selectModule: u } = e, d = (e) => e === "storage" ? i.state === "ready" ? "available" : i.state : (e === "equipment" || e === "software" && c.length > 0) && n.state !== "ready" ? n.state : e === "software" ? c.length > 0 && n.state === "ready" && n.data.capabilities.software?.available ? "available" : "unavailable" : e === "equipment" ? n.state === "ready" && n.data.capabilities.equipment?.available ? "available" : "unavailable" : e === "system" ? n.state === "ready" ? "partial" : n.state : "planned";
		return q(H, null, [
			q("div", {
				hidden: l !== null,
				class: "ap-scroll"
			}, [mk.map((e) => q("button", {
				class: "ap-module",
				key: e,
				onClick: () => u(e)
			}, [
				q("strong", null, [t(`modules.${e}.title`)]),
				q("small", null, [t(`modules.${e}.description`)]),
				q("small", null, [t(`states.${d(e)}`)])
			]))]),
			l === "equipment" && (n.state === "ready" && n.data.capabilities.equipment?.available ? q(gj, {
				guard: o,
				session: s,
				trainAvailable: !!n.data.capabilities.optical_trains?.available,
				onBack: () => u(null)
			}, null) : q("div", { class: "ap-scroll" }, [
				q("button", {
					type: "button",
					onClick: () => u(null)
				}, [t("actions.back")]),
				q("h2", null, [t("modules.equipment.title")]),
				n.state === "error" ? q(Wv, {
					error: n.error,
					retry: r
				}, null) : q("p", { role: "status" }, [t(n.state === "loading" ? "states.loading" : "equipment.unavailable"), n.state === "ready" && n.data.capabilities.equipment?.reason && q(H, null, [
					" ",
					J("· "),
					q("code", null, [n.data.capabilities.equipment.reason])
				])]),
				q("button", {
					type: "button",
					onClick: r
				}, [t("actions.refresh")])
			])),
			l && l !== "equipment" && q("div", { class: l === "storage" ? "ap-scroll ap-storage-detail" : "ap-scroll" }, [
				q("div", { class: "ap-equipment-heading ap-settings-heading" }, [q("button", {
					type: "button",
					class: "ap-settings-back",
					onClick: () => u(null)
				}, [t("actions.back")]), q("h2", null, [t(`modules.${l}.title`)])]),
				l !== "storage" && l !== "software" && q(H, null, [q("p", null, [t(`modules.${l}.description`)]), q("p", null, [t(`states.${d(l)}`)])]),
				l === "storage" && q(H, null, [q(vA, {
					resource: i,
					refresh: a
				}, null), q(MA, {
					settingsRevision: i.state === "ready" ? i.data.imports.revision : void 0,
					onSaved: a
				}, null)]),
				l === "software" && q(yA, { bundles: c }, null),
				l !== "system" && l !== "storage" && l !== "software" && q("p", null, [t(l === "agent" ? "settings.agentNote" : "settings.plannedNote")]),
				l !== "system" && l !== "software" && hk[l] && n.state === "ready" && q("p", null, [
					t("settings.backendCapability"),
					J(": "),
					hk[l],
					J(" —"),
					" ",
					t(n.data.capabilities[hk[l]]?.available ? "states.available" : "states.unavailable")
				]),
				l === "system" && q(H, null, [
					q("button", { onClick: r }, [t("actions.refresh")]),
					n.state === "error" && q(Wv, {
						error: n.error,
						retry: r
					}, null),
					n.state === "loading" && q("p", { role: "status" }, [t("states.loading")]),
					n.state === "ready" && q(H, null, [
						q("dl", null, [
							q("div", null, [q("dt", null, [t("settings.version")]), q("dd", null, [n.data.extension.version])]),
							q("div", null, [q("dt", null, [t("settings.api")]), q("dd", null, [n.data.api_version])]),
							q("div", null, [q("dt", null, [t("settings.status")]), q("dd", null, [n.data.status])]),
							q("div", null, [q("dt", null, [t("settings.nodeRegistered")]), q("dd", null, [t(n.data.runtime.node_registered ? "states.available" : "states.unavailable")])])
						]),
						q("h3", null, [t("settings.capabilities")]),
						Object.entries(n.data.capabilities).map(([e, n]) => q("p", { key: e }, [
							q("code", null, [e]),
							J(" —"),
							" ",
							t(n.available ? "states.available" : "states.unavailable"),
							n.reason && ` (${n.reason})`
						])),
						q("p", null, [t("settings.statusBoundary")])
					])
				])
			])
		]);
	};
}, { props: [
	"status",
	"refresh",
	"storage",
	"refreshStorage",
	"equipmentGuard",
	"equipmentSession",
	"bundles",
	"selectedModule",
	"selectModule"
] });
// src/api/nodes.ts
function vj(e, t = "custom_nodes.ComfyUI_AstroPhoto") {
	if (!$(e)) throw new Q("schema");
	let n = [];
	for (let [r, i] of Object.entries(e)) {
		if (!$(i) || !r || i.name !== r) continue;
		let e = typeof i.category == "string" ? i.category : "";
		if (r === "vue-basic" || e.split("/")[0] === "examples" || i.python_module !== t) continue;
		let a = [], o = {};
		for (let e of ["required", "optional"]) {
			let t = $(i.input) ? i.input[e] : void 0;
			if ($(t)) for (let [e, n] of Object.entries(t)) {
				if (!Array.isArray(n)) continue;
				let t = n[0];
				$(n[1]) && typeof n[1].display_name == "string" && (o[e] = n[1].display_name), Array.isArray(t) ? a.push([e, "COMBO"]) : typeof t == "string" && a.push([e, t]);
			}
		}
		let s = [];
		Array.isArray(i.output) && i.output.forEach((e, t) => {
			if (typeof e != "string") return;
			let n = Array.isArray(i.output_name) ? i.output_name[t] : void 0;
			s.push([typeof n == "string" ? n : String(t), e]);
		}), n.push({
			id: r,
			title: typeof i.display_name == "string" && i.display_name.trim() ? i.display_name : r,
			description: typeof i.description == "string" ? i.description : "",
			category: e,
			aliases: Array.isArray(i.search_aliases) ? i.search_aliases.filter((e) => typeof e == "string") : [],
			...Object.keys(o).length > 0 ? { inputLabels: o } : {},
			inputs: a,
			outputs: s
		});
	}
	return n;
}
async function yj(e) {
	let t = new URL(import.meta.url).pathname.match(/\/extensions\/([^/]+)\/main\.js$/)?.[1], n = t ? `custom_nodes.${decodeURIComponent(t)}` : void 0;
	return vj(await Ff("/object_info", e, "no-store"), n);
}
// src/api/status.ts
function bj(e) {
	if (!$(e) || !$(e.extension) || e.extension.id !== "ComfyUI_AstroPhoto" || typeof e.extension.version != "string" || e.api_version !== "v1" || !["ok", "degraded"].includes(String(e.status)) || !$(e.runtime) || typeof e.runtime.node_registered != "boolean" || typeof e.runtime.routes_registered != "boolean" || !$(e.capabilities) || !Object.values(e.capabilities).every((e) => $(e) && typeof e.available == "boolean" && (e.reason === null || typeof e.reason == "string"))) throw new Q("schema");
	return e;
}
async function xj(e) {
	return bj(await Ff("/astrophoto/v1/status", e));
}
// src/features/tasks/TaskPanel.vue?vue&type=script&setup=true&lang.ts
var Sj = ["aria-label"], Cj = ["aria-expanded"], wj = { class: "ap-task-summary" }, Tj = {
	id: "ap-task-list",
	class: "ap-task-list"
}, Ej = {
	key: 0,
	class: "ap-task-error",
	role: "alert"
}, Dj = {
	key: 1,
	class: "ap-task-error",
	role: "status"
}, Oj = { class: "ap-task-row" }, kj = ["aria-label", "onClick"], Aj = [
	"value",
	"max",
	"aria-label"
], jj = {
	key: 1,
	class: "ap-task-error"
}, Mj = {
	key: 2,
	class: "ap-task-error"
}, Nj = {
	key: 3,
	class: "ap-task-error"
}, Pj = ["disabled", "onClick"], Fj = ["onClick"], Ij = /* @__PURE__ */ z({
	__name: "TaskPanel",
	emits: ["resume"],
	setup(e, { emit: t }) {
		let { t: n } = Cf(), r = t, i = /* @__PURE__ */ new Set([
			"completed",
			"failed",
			"cancelled"
		]), a = (e) => i.has(e.phase) || e.phase === "paused", o = /* @__PURE__ */ P(""), s = /* @__PURE__ */ P(""), c = /* @__PURE__ */ P(p()), l = /* @__PURE__ */ P(d("astrophoto.tasks.expanded") === "true"), u = new AbortController();
		function d(e) {
			try {
				return sessionStorage.getItem(e);
			} catch {
				return null;
			}
		}
		function f(e, t) {
			try {
				sessionStorage.setItem(e, t);
			} catch {}
		}
		function p() {
			try {
				let e = JSON.parse(d("astrophoto.tasks.dismissed") || "[]");
				return Array.isArray(e) ? e.filter((e) => typeof e == "string") : [];
			} catch {
				return [];
			}
		}
		let m = X(() => uE.value.filter((e) => !a(e) || !c.value.includes(e.operation_id)).map((e) => {
			let t = fE.value[e.operation_id];
			return t && !i.has(e.phase) ? {
				...e,
				error: { code: t }
			} : e;
		})), h = X(() => m.value.filter((e) => !a(e)).length), g = X(() => m.value.length > 0), _ = X(() => {
			if (!h.value) return m.value.some((e) => e.phase === "paused") ? n("storage.phases.paused") : n("taskPanel.finished", { count: m.value.length });
			if (h.value > 1) return n("taskPanel.active", { count: h.value });
			let e = m.value.find((e) => !a(e));
			return e?.error || e?.receipt.direct_import === !0 && Array.isArray(e.receipt.errors) && e.receipt.errors.length ? n("taskPanel.attention") : e && typeof e.receipt.processed == "number" && typeof e.receipt.total == "number" && e.receipt.total > 0 ? n("taskPanel.count", {
				processed: e.receipt.processed,
				total: e.receipt.total
			}) : n("taskPanel.active", { count: h.value });
		});
		function v(e) {
			return n(e.kind === "import" ? "taskPanel.import" : "taskPanel.migration");
		}
		function y(e) {
			return e.phase === "completed" && typeof e.receipt.failed == "number" && e.receipt.failed > 0;
		}
		zr(() => CE((e, t) => n(e, t || {}))), ke(() => u.abort());
		function b() {
			l.value = !l.value, f("astrophoto.tasks.expanded", String(l.value));
		}
		function x(e) {
			a(e) && (c.value = [...c.value, e.operation_id], f("astrophoto.tasks.dismissed", JSON.stringify(c.value)));
		}
		async function S(e) {
			if (!o.value) {
				o.value = e.operation_id, s.value = "";
				try {
					let t = e.kind === "import" && i.has(e.phase), n = await Wy(t ? `/library/imports/${encodeURIComponent(e.operation_id)}/retry-remaining` : `${Ky(e)}/retry`, {}, u.signal);
					t && typeof n.operation_id == "string" && vE(n.operation_id);
				} catch (t) {
					u.signal.aborted || (s.value = t instanceof Q ? t.code : "network", yE(e.operation_id, `retry:${s.value}`, "error", n("taskPanel.retryFailed")));
				} finally {
					o.value = "";
				}
			}
		}
		function C(e) {
			return e.receipt.direct_import !== !0 && (!!e.error && !i.has(e.phase) || e.kind === "import" && i.has(e.phase) && typeof e.receipt.retryable == "number" && e.receipt.retryable > 0);
		}
		return (e, t) => g.value ? (U(), W("aside", {
			key: 0,
			class: "ap-task-panel",
			"aria-label": I(n)("taskPanel.title")
		}, [K("button", {
			class: "ap-task-toggle",
			type: "button",
			"aria-expanded": l.value,
			"aria-controls": "ap-task-list",
			onClick: b
		}, [
			q(I($v)),
			K("strong", null, N(I(n)("taskPanel.title")), 1),
			K("span", wj, N(_.value), 1)
		], 8, Cj), qn(K("div", Tj, [s.value ? (U(), W("p", Ej, N(I(n)("taskPanel.retryFailed")) + " · " + N(s.value), 1)) : I(dE) ? (U(), W("p", Dj, N(I(n)("taskPanel.updateFailed")), 1)) : Y("", !0), (U(!0), W(H, null, B(m.value, (e) => (U(), W("article", {
			key: e.operation_id,
			class: "ap-task-item"
		}, [
			K("div", Oj, [K("strong", null, N(v(e)), 1), a(e) ? (U(), W("button", {
				key: 0,
				type: "button",
				class: "ap-task-dismiss",
				"aria-label": I(n)("taskPanel.dismiss", { name: v(e) }),
				onClick: (t) => x(e)
			}, "×", 8, kj)) : Y("", !0)]),
			K("span", null, N(I(n)("storage.phases." + (y(e) ? "partial" : e.phase), e.phase)), 1),
			typeof e.receipt.processed == "number" && typeof e.receipt.total == "number" && e.receipt.total > 0 ? (U(), W(H, { key: 0 }, [K("progress", {
				value: e.receipt.processed,
				max: e.receipt.total,
				"aria-label": v(e)
			}, null, 8, Aj), K("span", null, N(I(n)("taskPanel.count", {
				processed: e.receipt.processed,
				total: e.receipt.total
			})), 1)], 64)) : Y("", !0),
			e.error ? (U(), W("p", jj, N(I(n)("storage.errors." + e.error.code, I(n)("storage.error"))) + " · " + N(e.error.code), 1)) : Y("", !0),
			y(e) ? (U(), W("p", Mj, N(I(n)("taskPanel.failedCount", { count: e.receipt.failed })), 1)) : Y("", !0),
			Array.isArray(e.receipt.errors) && e.receipt.errors.length ? (U(), W("ul", Nj, [(U(!0), W(H, null, B(e.receipt.errors, (e) => (U(), W("li", { key: e.entry }, "#" + N(e.entry) + " · " + N(I(n)("storage.errors." + e.code, e.code)), 1))), 128))])) : Y("", !0),
			C(e) ? (U(), W("button", {
				key: 4,
				type: "button",
				class: "ap-task-retry",
				disabled: !!o.value,
				onClick: (t) => S(e)
			}, N(I(n)("storage.retry")), 9, Pj)) : Y("", !0),
			e.receipt.direct_import === !0 && !I(i).has(e.phase) ? (U(), W("button", {
				key: 5,
				type: "button",
				class: "ap-task-retry",
				onClick: (t) => r("resume", e.operation_id)
			}, N(I(n)("taskPanel.openImport")), 9, Fj)) : Y("", !0)
		]))), 128))], 512), [[wo, l.value]])], 8, Sj)) : Y("", !0);
	}
}), Lj = [
	"nodes",
	"assets",
	"settings"
], Rj = /* @__PURE__ */ z((e) => {
	let { t } = Cf(), n = /* @__PURE__ */ F(e.equipmentSession.current ? "settings" : "assets"), r = /* @__PURE__ */ F(null), i = !1, a = !1;
	ke(() => {
		a = !0;
	});
	let o = /* @__PURE__ */ F(!1), s = /* @__PURE__ */ F(n.value === "assets"), c = /* @__PURE__ */ F(n.value === "settings"), l = /* @__PURE__ */ F(e.equipmentSession.current ? "equipment" : null), u = /* @__PURE__ */ F(0), d = /* @__PURE__ */ F(null), f = /* @__PURE__ */ z(() => {
		let { resource: e, refresh: t } = Xy(yj);
		return p.value = t, () => q(vy, {
			active: n.value === "nodes",
			resource: e.value,
			refresh: t,
			homeActivation: u.value
		}, null);
	}), p = /* @__PURE__ */ F(), m = /* @__PURE__ */ z(() => {
		let { resource: t, refresh: n } = Xy(xj), { resource: i, refresh: a } = Xy(Uy, !0);
		return () => q(_j, {
			equipmentGuard: r,
			equipmentSession: e.equipmentSession,
			bundles: e.bundles,
			status: t.value,
			refresh: n,
			storage: i.value,
			refreshStorage: a,
			selectedModule: l.value,
			selectModule: (e) => {
				l.value = e;
			}
		}, null);
	});
	async function h(e, t = null, f = !1) {
		let p = n.value;
		if (i) return;
		let m = p === "settings" ? r.value : null;
		i = !0;
		try {
			if (m && !await m() || a) return;
			if (e === "assets" && d.value && !f) {
				let e = d.value.goHome();
				if (e !== !0 && !await e) return;
			}
			if (a) return;
			e === "nodes" && (o.value = !0, u.value += 1), e === "assets" && (s.value = !0), e === "settings" && (c.value = !0, l.value = t), n.value = e;
		} finally {
			i = !1;
		}
	}
	return () => {
		let e = n.value, r = t("nodes.refresh");
		return q(H, null, [
			q("header", null, [q("strong", null, [t("nav.title")]), e === "nodes" && q("button", {
				class: "ap-refresh-button",
				type: "button",
				onClick: () => p.value?.(),
				"aria-label": r,
				title: r
			}, [q("svg", {
				width: "16",
				height: "16",
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				"stroke-width": "2",
				"stroke-linecap": "round",
				"stroke-linejoin": "round",
				"aria-hidden": "true"
			}, [
				q("path", { d: "M3 12a9 9 0 0 1 9-9a9.75 9.75 0 0 1 6.74 2.74L21 8" }, null),
				q("path", { d: "M21 3v5h-5m5 4a9 9 0 0 1-9 9a9.75 9.75 0 0 1-6.74-2.74L3 16" }, null),
				q("path", { d: "M8 16H3v5" }, null)
			])])]),
			q(Zy, {
				items: Lj,
				active: e,
				prefix: "ap",
				label: t("nav.label"),
				title: (e) => t("nav." + e),
				select: h
			}, null),
			Lj.map((t) => q("section", {
				key: t,
				id: `ap-panel-${t}`,
				role: "tabpanel",
				"aria-labelledby": `ap-tab-${t}`,
				hidden: e !== t
			}, [t === "nodes" ? o.value && q(f, null, null) : t === "assets" ? s.value && q(pk, {
				ref: d,
				active: e === "assets",
				openStorage: () => {
					h("settings", "storage");
				}
			}, null) : c.value && q(m, null, null)])),
			q(Ij, { onResume: async (e) => {
				await h("assets", null, !0), await Fn(), !a && n.value === "assets" && await d.value?.openTaskImport(e);
			} }, null)
		]);
	};
}, { props: ["equipmentSession", "bundles"] }), zj = {
	"vue-basic": {
		title: "Vue Basic Example",
		pen: "Pen",
		"restore-error": "Unable to restore the saved drawing. Check the image data in the workflow.",
		"clear-canvas": "Clear Canvas",
		"brush-size": "Brush Size",
		"pen-tooltip": "this is a pen"
	},
	nodeCategories: {
		Siril: "Siril",
		"Color and Channels": "Color and Channels",
		"Files, Sequences and Metadata": "Files, Sequences and Metadata",
		"Sensor Correction": "Sensor Correction",
		"Geometry and Resampling": "Geometry and Resampling",
		"Image Registration": "Image Registration",
		"Image Stacking": "Image Stacking",
		"Tone and Contrast": "Tone and Contrast",
		"Color Calibration": "Color Calibration",
		"Color Management": "Color Management",
		"Color Adjustments": "Color Adjustments",
		"Channel Management": "Channel Management",
		"Background Extraction and Gradient Correction": "Background Extraction and Gradient Correction",
		"Artifact Correction": "Artifact Correction",
		"Convolution and Sharpening": "Convolution and Sharpening",
		Deconvolution: "Deconvolution",
		"Noise Reduction": "Noise Reduction",
		"Multiscale Processing": "Multiscale Processing",
		"Feature Detection and Processing": "Feature Detection and Processing",
		"Pixel and Frequency-Domain Operations": "Pixel and Frequency-Domain Operations",
		"Image Measurement and Analysis": "Image Measurement and Analysis",
		"Coordinate Calibration and Reference Data": "Coordinate Calibration and Reference Data",
		"Runtime and Session": "Runtime and Session"
	}
}, Bj = {
	nav: {
		title: "AstroPhoto",
		label: "AstroPhoto views",
		nodes: "Nodes",
		assets: "Assets",
		settings: "Settings"
	},
	actions: {
		back: "← Back",
		retry: "Retry",
		refresh: "Refresh"
	},
	states: {
		loading: "Loading…",
		error: "Unable to retrieve status",
		available: "Available",
		unavailable: "Unavailable",
		planned: "Planned",
		partial: "Partially implemented"
	},
	browse: {
		clear: "Clear search",
		filter: "Filter categories",
		sort: "Sort",
		allCategories: "All categories",
		original: "Original order",
		alphabetical: "Alphabetical",
		newest: "Newest first",
		oldest: "Oldest first",
		name: "Name (A–Z)"
	},
	nodes: {
		bookmarks: "Bookmarked",
		noBookmarks: "No bookmarked nodes",
		addBookmark: "Bookmark node",
		removeBookmark: "Remove bookmark",
		search: "Search nodes…",
		refresh: "Refresh node definitions",
		empty: "No registered AstroPhoto nodes.",
		noResults: "No matching nodes.",
		uncategorized: "Uncategorized",
		noDescription: "No description provided by this node.",
		add: "Add to canvas",
		canvasUnsupported: "Add this node from ComfyUI’s built-in Node Library.",
		addNamed: "Add {name} to canvas",
		registered: "Registered in ComfyUI.",
		inputs: "Inputs",
		outputs: "Outputs",
		dependencies: "Registration does not confirm external software availability.",
		helpUnavailable: "Dedicated documentation is not available for this node.",
		created: "Node created. Save the workflow using ComfyUI."
	},
	settings: {
		plannedNote: "This module is planned. Configuration and operations are not available yet.",
		agentNote: "The independent MCP provides version and connection diagnostics only. Agent context integration is planned; this page does not verify an Agent connection.",
		backendCapability: "Related backend capability",
		version: "Extension version",
		api: "API version",
		status: "Runtime status",
		nodeRegistered: "Drawing node registration",
		capabilities: "Backend capabilities",
		statusBoundary: "This status does not verify canvas execution, upload, external software or Agent connectivity."
	},
	modules: {
		environment: {
			title: "Environment",
			description: "Preview resolution"
		},
		storage: {
			title: "Configuration",
			description: "Storage locations, import mode and preview resolution"
		},
		software: {
			title: "Software",
			description: "Discover processing software and validate program paths, versions and capabilities."
		},
		equipment: {
			title: "Equipment",
			description: "Manage cameras, telescopes, filters and equipment groups."
		},
		"observing-site": {
			title: "Observing Sites",
			description: "Observing locations, time zones and light pollution sources."
		},
		knowledge: {
			title: "Knowledge",
			description: "Documentation, tutorials, cited retrieval sources and knowledge indexes."
		},
		memory: {
			title: "Memory & Privacy",
			description: "User-controlled preferences and consent, memory review, correction and deletion."
		},
		agent: {
			title: "Agent Context & MCP",
			description: "Task context, tool capabilities and Agent connections."
		},
		system: {
			title: "System Status",
			description: "Extension version, registration and actual backend capabilities."
		}
	},
	errors: {
		http: "Request failed (HTTP {status}).",
		json: "The server returned invalid JSON.",
		schema: "The server response does not match the supported contract.",
		timeout: "The request timed out.",
		network: "Unable to connect to ComfyUI.",
		canvas: "Could not create a node. Check that the canvas is editable and the node is registered.",
		bookmark: "Could not save node bookmarks. Try again.",
		bookmarkUnsupported: "Manage this bookmark in ComfyUI’s built-in Node Library.",
		unknown: "An unexpected error occurred."
	},
	taskPanel: {
		title: "Tasks",
		active: "{count} active",
		finished: "{count} finished",
		attention: "Needs attention",
		import: "Asset import",
		migration: "Data migration",
		count: "Processed {processed} / {total}",
		dismiss: "Clear {name} from the list",
		completed: "{name} completed.",
		failed: "{name} encountered an error. Check task details.",
		partial: "{name} completed with failures.",
		failedCount: "{count} failed",
		updateFailed: "Unable to update task status. Retrying.",
		retryFailed: "Unable to retry the task.",
		openImport: "View and resume import"
	},
	storage: {
		dataRoot: "Data Root",
		db: "Asset database",
		importMode: "Default import mode",
		reference: "Index original files",
		copy: "Copy to storage",
		referenceHelp: "Keep original locations without copying.",
		copyHelp: "Keep originals and use additional space.",
		workspaces: "Storage locations",
		moveUp: "Move up",
		dragLocation: "Drag {name} to reorder",
		showPath: "Show path",
		preferred: "Preferred",
		moveDown: "Move down",
		locationLimit: "Capacity limit",
		locationLimitHelp: "Enter a limit in GiB, or leave empty for unlimited.",
		locationUsage: "Used {used} / {limit}",
		unlimited: "Unlimited",
		workspaceActions: "Actions for {name}",
		default: "Default",
		free: "Free space",
		validate: "Validate",
		setDefault: "Set as default",
		disable: "Disable",
		enable: "Enable",
		rename: "Rename",
		relocate: "Relocate",
		missingFiles: "Missing registered files: {count}",
		partialRebind: "{count} registered files are missing. Rebind and use the available files?",
		moveRoot: "Move AstroPhoto data",
		moveRootInstructions: "Stop ComfyUI. From the AstroPhoto checkout, run this command. Then start ComfyUI as usual.",
		volumeQuota: "Shared volume quota",
		volumeQuotaHelp: "Enter a quota in decimal GB. Leave empty to use all available space.",
		volumeBalance: "Free space {free} · Managed {used} · Reserved {reserved}",
		noQuota: "No quota · all available disk space",
		quotaBalance: "Quota {quota} · Remaining quota {remaining}",
		editQuota: "Edit quota",
		partialMigration: "Move by amount",
		migrationSource: "Source workspace",
		migrationTarget: "Target workspace",
		selectWorkspace: "Select a workspace",
		migrationAmount: "Amount to move",
		migrationUnit: "Size unit",
		migrationPreview: "Preview move",
		migrationBasis: "Source managed data {base} · Requested {volume}",
		sameVolume: "A move within the same volume does not free space on that volume.",
		migrationOptions: {
			complete: "Move the workspace ({volume})",
			exact: "Move {volume}",
			under: "Move {volume} ({difference} below requested)",
			over: "Move {volume} ({difference} above requested)"
		},
		migrationConfirm: "Move {volume}? AstroPhoto clears verified, migrated source copies after committing their new location.",
		migrationFiles: "{count} managed files in the cleanup scope.",
		movedBytes: "Moved",
		discardTarget: "Clear failed move files",
		discardTargetHelp: "Only verified files belonging to this failed job will be removed.",
		cleanupCount: "Source files pending cleanup",
		migrate: "Migrate workspace",
		remove: "Remove",
		removeLocationTitle: "Remove storage location",
		removeHelp: "Where should the managed files from {name} move? Their library paths will be updated before the location is removed.",
		removalTarget: "Move files to",
		chooseTarget: "Choose a storage location",
		noRemovalTarget: "Bring another storage location online to move these files.",
		resumeRemove: "Resume removal",
		resumeRemoveHelp: "Finish moving the managed files from {name} to the selected location.",
		reconnectTarget: "Reconnect the original destination to resume this move.",
		lastLocation: "Keep at least one storage location.",
		confirmRemove: "Move and remove",
		removalPending: "Moving files and updating the library…",
		removedLocation: "{source} removed. Its managed files are now in {target}.",
		path: "Local absolute path",
		browseDirectories: "Choose folder",
		directoryRoots: "Available locations",
		currentPath: "Current path",
		selectedCount: "{count} storage locations added",
		doneSelecting: "Done selecting",
		directoryUp: "Up one level",
		chooseDirectory: "Select this folder",
		addToBatch: "Add to batch",
		batchLocations: "Locations to register",
		batchLocationHelp: "Select empty folders. Each folder will be registered as a separate storage location.",
		registerBatch: "Register selected locations ({count})",
		removeBatchLocation: "Remove {name} from batch",
		cancelDirectory: "Cancel",
		closeDirectory: "Close folder picker",
		name: "Location name",
		close: "Close",
		cache: "Cache",
		used: "Used",
		limit: "Cache limit (GB)",
		save: "Save",
		clear: "Clear cache",
		confirmClear: "Remove rebuildable files from the active cache?",
		clearResult: "Removed {count} ({size}). Skipped {skipped}. Failed {failed}.",
		add: "Add storage location",
		sources: "Authorized server paths, one file or folder per line",
		useDefault: "Use the default",
		session: "Session label (optional)",
		target: "Target workspace",
		previewResult: "{count} candidates. {failed} unavailable.",
		copySize: "Bytes to copy",
		startImport: "Start import",
		preview: "Check files and capacity",
		operation: "Storage operation",
		registered: "Registered",
		copied: "Copied",
		skipped: "Skipped",
		failed: "Failed",
		verification: "Verification",
		cancel: "Cancel operation",
		retry: "Retry operation",
		emptyAssets: "No matching assets.",
		external_reference: "External reference",
		managed: "Managed copy",
		error: "The storage request failed.",
		source: {
			default: "Default path",
			ASTROPHOTO_HOME: "Environment override"
		},
		states: {
			online: "Online",
			offline: "Offline",
			disabled: "Disabled",
			migrating: "Migrating",
			identity_mismatch: "Identity mismatch",
			read_only: "Read only",
			partial: "Partially available",
			error: "Error"
		},
		phases: {
			partial: "Completed with failures",
			queued: "Queued",
			preparing: "Preparing",
			copying: "Copying",
			verifying: "Verifying",
			publishing: "Publishing",
			importing: "Importing",
			paused: "Waiting to resume",
			committed: "Rebinding workspace",
			completed: "Completed",
			failed: "Failed",
			cancelled: "Cancelled"
		},
		errors: {
			UNAUTHORIZED_STORAGE_OPERATION: "Storage requires an explicitly enabled, direct local ComfyUI session.",
			SOURCE_NOT_AUTHORIZED: "Select a path in a configured import root on the ComfyUI server.",
			REVISION_CONFLICT: "Settings changed. Refresh and try again.",
			STORAGE_BUSY: "Another storage operation is active.",
			VOLUME_QUOTA_EXCEEDED: "This volume has insufficient AstroPhoto quota.",
			WORKSPACE_QUOTA_EXCEEDED: "The storage location has insufficient capacity.",
			NO_AVAILABLE_WORKSPACE: "All storage locations are unavailable or lack capacity.",
			MIGRATION_PLAN_STALE: "The migration plan has changed. Run preflight again.",
			NO_MIGRATION_GROUPS: "No complete asset group can be moved to this destination.",
			SOURCE_CLEANUP_PENDING: "The destination is active. Retry cleanup of the remaining source files.",
			COPY_VERIFY_FAILED: "The copied file failed verification. Check the storage locations and retry.",
			OBJECT_CONFLICT: "A conflicting file exists at the destination.",
			WORKSPACE_FILES_MISSING: "Registered files required for this move are missing.",
			INSUFFICIENT_DISK_SPACE: "The target volume has insufficient space.",
			WORKSPACE_OFFLINE: "The storage location is offline.",
			DIRECT_IMPORT_REPLAN_REQUIRED: "The planned storage location was removed. Cancel this task and start a new import for the remaining files.",
			WORKSPACE_READ_ONLY: "The storage location is read only.",
			WORKSPACE_IDENTITY_MISMATCH: "The storage location identity does not match.",
			SOURCE_CHANGED: "The source file changed during this operation.",
			NO_RETRYABLE_FILES: "No unchanged, unregistered files remain to retry. Check a new selection to continue.",
			RECOVERY_REQUIRED: "Storage needs recovery. Check the service diagnostics.",
			OPERATION_CANCELLED: "The operation was cancelled.",
			TARGET_NOT_EMPTY: "The destination is already occupied.",
			INVALID_STORAGE_PATH: "Enter a safe absolute local path.",
			SOURCE_NOT_FOUND: "The source file is missing.",
			DATABASE_INVALID: "The asset database could not be opened."
		},
		nativeBrowse: "Choose in system dialog"
	},
	equipment: {
		devices: "My Equipment",
		trains: "Equipment Groups",
		addDevice: "Add equipment",
		editDevice: "Edit equipment",
		addTrain: "Create equipment group",
		editTrain: "Edit equipment group",
		searchDevice: "Search name, manufacturer or model",
		searchTrain: "Search group or equipment",
		filterList: "Filter records",
		active: "All active",
		noMatches: "No matching records.",
		emptyDevices: "No equipment yet. Add a device to build an equipment group.",
		emptyTrains: "Combine a camera and primary optics into a reusable imaging configuration.",
		resetSearch: "Clear search and filters",
		more: "Load more",
		chooseType: "Choose equipment type",
		basics: "Basic information",
		specs: "Specifications",
		advancedFields: "Advanced",
		advanced: "Advanced camera capabilities",
		unspecified: "Not specified",
		addMode: "Add readout mode",
		addBand: "Add passband",
		incompleteBands: "Passband information is incomplete.",
		cancel: "Cancel",
		save: "Save",
		saving: "Saving…",
		remove: "Remove",
		archive: "Archive",
		restore: "Restore",
		usage: "Used in equipment groups",
		noUsage: "No equipment group references.",
		editAction: "Edit",
		deleteAction: "Delete permanently",
		deleteDevice: "Permanently delete equipment",
		deleteDeviceConfirm: "Delete this equipment record permanently? This action cannot be undone.",
		archiveDeviceConfirm: "Archive this equipment? Existing equipment groups keep their links.",
		archiveTrainConfirm: "Archive this equipment group? Its saved configuration will be preserved.",
		deviceReceipt: "Equipment saved.",
		archivedReceipt: "Archived.",
		restoredReceipt: "Restored.",
		deletedReceipt: "Equipment deleted.",
		unavailable: "Equipment is unavailable.",
		unsaved: "Unsaved changes",
		discardConfirm: "Discard the unsaved edits and leave this page? Cancel to continue editing.",
		sessionRestored: "Unsaved edits recovered from this sidebar session.",
		components: "Optical components",
		quickAdd: "Add {type}",
		pickDevice: "Select equipment",
		invalidDevice: "Missing or archived equipment",
		addAccessory: "Select an accessory to add",
		moveUp: "Move up",
		moveDown: "Move down",
		opticalState: "Optical state",
		opticalStateHelp: "Rotation, configuration and flat applicability",
		changeSummary: "Configuration notes",
		estimate: "Nominal effective focal length and f-ratio",
		reload: "Reload saved data",
		rebaseDeviceConfirm: "Keep your edits and apply them to the latest saved equipment details? Review the current record before saving again.",
		rebaseTrainConfirm: "Keep your edits and use the current saved configuration as the baseline? Review your changes before saving again.",
		fields: {
			name: "Name",
			manufacturer: "Manufacturer",
			model: "Model",
			notes: "Notes",
			sensor_name: "Sensor model",
			sensor_kind: "Imaging type",
			sensor_width_px: "Sensor width (px)",
			sensor_height_px: "Sensor height (px)",
			pixel_size_x_um: "Pixel size X (µm)",
			pixel_size_y_um: "Pixel size Y (µm)",
			bayer_pattern: "Bayer pattern",
			adc_bit_depth: "ADC bit depth",
			cooling_supported: "Cooling capability",
			max_bin_x: "Max binning X",
			max_bin_y: "Max binning Y",
			readout_modes: "Readout modes",
			mode_key: "Mode key",
			display_name: "Mode name",
			gain_min: "Minimum gain",
			gain_max: "Maximum gain",
			offset_min: "Minimum offset",
			offset_max: "Maximum offset",
			optics_kind: "Optical type",
			optical_design: "Optical design",
			aperture_mm: "Aperture (mm)",
			native_focal_length_mm: "Native focal length (mm)",
			native_f_ratio: "Native f-ratio",
			image_circle_mm: "Image circle (mm)",
			optical_notes: "Optical notes",
			accessory_kind: "Accessory kind",
			nominal_factor: "Nominal factor (×)",
			design_backfocus_mm: "Design backfocus (mm)",
			clear_aperture_mm: "Clear aperture (mm)",
			filter_kind: "Filter kind",
			physical_size_mm: "Physical size (mm)",
			filter_format: "Filter format",
			passbands: "Passbands",
			band_label: "Band name",
			center_nm: "Center wavelength (nm)",
			fwhm_nm: "FWHM (nm)",
			camera_id: "Imaging camera",
			primary_optics_id: "Primary optics",
			accessory_ids: "Optical accessories",
			filter_ids: "Available filters",
			rotation_deg: "Camera rotation (°)",
			flat_validity_note: "Flat applicability note",
			configuration_note: "Configuration changes",
			summary: "Revision notes",
			change_summary: "Configuration notes"
		},
		values: {
			camera: "Camera",
			primary_optics: "Telescope / lens",
			optical_accessory: "Optical accessory",
			filter: "Filter",
			mono: "Monochrome",
			color: "Color",
			other: "Other",
			unknown: "Unknown",
			telescope: "Telescope",
			lens: "Camera lens",
			reducer: "Reducer",
			flattener: "Flattener",
			barlow: "Barlow",
			l: "L",
			r: "R",
			g: "G",
			b: "B",
			ha: "Hα",
			oiii: "OIII",
			sii: "SII",
			broadband: "Broadband",
			uv_ir_cut: "UV/IR Cut",
			solar: "Solar",
			dual_band: "Dual-band",
			multi_band: "Multi-band",
			true: "Supported",
			false: "Unsupported",
			draft: "Draft",
			published: "Published",
			archived: "Archived",
			deleted: "Deleted"
		},
		typeHint: {
			camera: "Sensor, pixels and readout capabilities",
			primary_optics: "Aperture, native focal length and optical design",
			optical_accessory: "Reducer, flattener or Barlow",
			filter: "Physical format and one or more passbands"
		},
		validation: {
			invalid_value: "Enter a valid value in the indicated unit and range.",
			unknown_field: "This field is not supported for this record.",
			required: "This field is required.",
			duplicate: "Use a distinct value.",
			invalid_reference: "The equipment reference is invalid.",
			missing_equipment: "The selected equipment no longer exists.",
			type_mismatch: "Select equipment of the correct type.",
			archived_equipment: "Replace or restore the archived device."
		},
		errors: {
			INVALID_REQUEST: "The request could not be read.",
			EQUIPMENT_VALIDATION_FAILED: "Check the highlighted equipment or equipment group fields.",
			EQUIPMENT_VERSION_CONFLICT: "This equipment changed in another window. Your edits are preserved.",
			DRAFT_VERSION_CONFLICT: "Saved configuration changed. Your edits are preserved.",
			REVISION_CONFLICT: "This equipment group changed in another window.",
			IDEMPOTENCY_CONFLICT: "This publication request was already used with different values.",
			TRAIN_INCOMPLETE: "The equipment group needs a camera and primary optics before publishing.",
			EQUIPMENT_TYPE_MISMATCH: "An optical component has an incompatible equipment type.",
			EQUIPMENT_REFERENCED: "This device is used by an equipment group and cannot be permanently deleted. Archive it instead.",
			TRAIN_ARCHIVED: "Restore this equipment group before saving changes.",
			EQUIPMENT_NOT_FOUND: "This equipment record was not found.",
			TRAIN_NOT_FOUND: "This equipment group was not found.",
			REVISION_NOT_FOUND: "This revision was not found.",
			UNAUTHORIZED_EQUIPMENT_OPERATION: "This deployment or request is not authorized to use the equipment API.",
			STORAGE_BUSY: "The database is busy. Retry shortly.",
			DATABASE_INVALID: "Equipment data is unavailable because the database could not be read.",
			DEV_SCHEMA_RESET_REQUIRED: "The database uses an incompatible development schema.",
			EQUIPMENT_UNAVAILABLE: "The equipment service is unavailable."
		},
		trainReceipt: "Equipment group saved.",
		currentConfiguration: "Current configuration",
		noConfiguration: "No configuration saved.",
		configured: "Configured",
		noBasicInformation: "No basic information provided",
		componentDetails: "Component details",
		history: "Revision history",
		noHistory: "No revisions",
		revisionLabel: "Revision v{number}",
		readOnly: "Read-only snapshot",
		inUse: "Active",
		deleteTrain: "Permanently delete equipment group",
		deleteTrainConfirm: "Remove this equipment group and release its name? Existing assets retain their history. Archive the group if you may restore it later.",
		deleteReferenced: "This equipment is used by an equipment group. Remove the reference first."
	},
	nodePreview: {
		openImage: "Open image",
		parameters: "Node parameters",
		adjustWidth: "Adjust image and sidebar widths",
		adjustHeight: "Adjust analysis and parameter panel heights",
		preview: "Preview",
		compare: "Image comparison",
		reset: "Reset parameters",
		close: "Close",
		side: "Side by side",
		wipe: "Sliding divider",
		single: "Single image",
		fit: "Fit",
		zoomOut: "Zoom out",
		zoomIn: "Zoom in",
		before: "Before",
		after: "After",
		noImage: "No image available",
		unaligned: "Wipe requires aligned images with matching coordinates.",
		analysis: "Image analysis",
		analysisEmpty: "Image analysis is pending.",
		readonly: "Node parameters · read only",
		status: "Status"
	},
	environment: {
		fullResolution: "Full resolution",
		canvasPreview: "Canvas node preview",
		canvasWidth: "Preview width (px)",
		canvasMaxHeight: "Maximum height (px)",
		canvasHelp: "Applies to AstroPhoto canvas previews. Images scale to fit narrower nodes.",
		previewResolution: "Preview resolution",
		previewResolutionHelp: "Maximum length of the longest edge in the node preview and Inspector. Smaller images keep their original size.",
		pixels: "{value} px",
		saving: "Saving…",
		saved: "Preview settings saved.",
		conflict: "Settings changed. Reload the current value before saving."
	},
	fits: {
		fitsAsset: "Select FITS asset",
		unavailableAsset: "Stored asset unavailable",
		serverFitsPath: "FITS path on the ComfyUI server",
		serverFitsPathHint: "Absolute path on the ComfyUI server",
		refreshAssets: "Refresh FITS assets"
	},
	software: {
		ready: "Ready",
		enabled: "Enabled",
		enableNamed: "Enable {name}",
		pixinsightPurpose: "Astronomical image processing",
		plannedDetails: "PixInsight support is planned.",
		noCandidates: "No candidates found. You can enter a path manually."
	}
}, Vj = {
	nav: {
		title: "天文图形工作流",
		label: "AstroPhoto 主视图",
		nodes: "节点",
		assets: "素材",
		settings: "设置"
	},
	actions: {
		back: "← 返回",
		retry: "重试",
		refresh: "刷新"
	},
	states: {
		loading: "加载中…",
		error: "无法获取状态",
		available: "可用",
		unavailable: "不可用",
		planned: "规划中",
		partial: "部分实现"
	},
	browse: {
		clear: "清除搜索",
		filter: "按分类筛选",
		sort: "排序",
		allCategories: "全部分类",
		original: "原始顺序",
		alphabetical: "按名称排序",
		newest: "最新优先",
		oldest: "最早优先",
		name: "按名称排序"
	},
	nodes: {
		bookmarks: "已收藏",
		noBookmarks: "暂无收藏",
		addBookmark: "收藏节点",
		removeBookmark: "取消收藏",
		search: "搜索节点…",
		refresh: "刷新节点定义",
		empty: "没有已注册的 AstroPhoto 节点。",
		noResults: "没有匹配的节点。",
		uncategorized: "未分类",
		noDescription: "此节点未提供说明。",
		add: "添加到画布",
		canvasUnsupported: "请使用 ComfyUI 自带的节点库添加此节点。",
		addNamed: "将 {name} 添加到画布",
		registered: "已在 ComfyUI 中注册。",
		inputs: "输入",
		outputs: "输出",
		dependencies: "节点注册不代表外部软件可用。",
		helpUnavailable: "此节点暂未提供专用文档。",
		created: "节点已创建。请使用 ComfyUI 保存工作流。"
	},
	settings: {
		plannedNote: "该模块处于规划阶段，暂不提供配置或执行操作。",
		agentNote: "独立 MCP 目前仅提供版本和连接诊断。Agent 上下文集成仍在规划中；此页面不验证 Agent 连接。",
		backendCapability: "相关后端能力",
		version: "扩展版本",
		api: "API 版本",
		status: "运行状态",
		nodeRegistered: "画板节点注册",
		capabilities: "后端能力",
		statusBoundary: "此状态不验证画布执行、上传、外部软件或 Agent 连接。"
	},
	modules: {
		environment: {
			title: "环境配置",
			description: "预览分辨率"
		},
		storage: {
			title: "配置",
			description: "存储位置、导入方式与预览分辨率"
		},
		software: {
			title: "软件管理",
			description: "检测处理软件，并验证程序路径、版本及处理能力。"
		},
		equipment: {
			title: "设备",
			description: "管理相机、望远镜、滤镜和设备组合。"
		},
		"observing-site": {
			title: "观测地与光污染",
			description: "观测地点、时区和光污染来源。"
		},
		knowledge: {
			title: "知识库",
			description: "官方文档、教程、可引用检索来源与知识索引。"
		},
		memory: {
			title: "用户记忆与隐私",
			description: "用户可控的偏好与授权，记忆审阅、更正及删除。"
		},
		agent: {
			title: "Agent 上下文与 MCP",
			description: "任务上下文、工具能力和 Agent 连接。"
		},
		system: {
			title: "系统状态",
			description: "扩展版本、注册状态与真实后端能力。"
		}
	},
	errors: {
		http: "请求失败（HTTP {status}）。",
		json: "服务器返回的 JSON 无效。",
		schema: "服务器响应不符合当前支持的接口契约。",
		timeout: "请求超时。",
		network: "无法连接到 ComfyUI。",
		canvas: "无法创建节点。请检查画布是否可编辑及节点是否已注册。",
		bookmark: "无法保存节点收藏，请重试。",
		bookmarkUnsupported: "请使用 ComfyUI 自带的节点库管理此收藏。",
		unknown: "发生未知错误。"
	},
	taskPanel: {
		title: "任务",
		active: "{count} 项进行中",
		finished: "{count} 项已结束",
		attention: "需要处理",
		import: "素材导入",
		migration: "数据迁移",
		count: "已处理 {processed} / {total}",
		dismiss: "清除{name}记录",
		completed: "{name}已完成。",
		failed: "{name}遇到错误，请查看任务详情。",
		partial: "{name}已完成，部分条目失败。",
		failedCount: "失败 {count} 项",
		updateFailed: "无法更新任务状态，正在重试。",
		retryFailed: "无法重试任务。",
		openImport: "查看并继续导入"
	},
	storage: {
		dataRoot: "数据根目录",
		db: "资产数据库",
		importMode: "默认素材导入方式",
		reference: "仅登记原文件",
		copy: "复制到存储位置",
		referenceHelp: "保留原位置，不复制。",
		copyHelp: "保留原文件，占用额外空间。",
		workspaces: "存储位置",
		moveUp: "上移",
		dragLocation: "拖动 {name} 调整顺序",
		showPath: "查看路径",
		preferred: "首选",
		moveDown: "下移",
		locationLimit: "容量上限",
		locationLimitHelp: "输入容量上限（GiB），留空表示不限额。",
		locationUsage: "已使用 {used} / {limit}",
		unlimited: "不限额",
		workspaceActions: "{name} 的存储位置操作",
		default: "默认",
		free: "可用空间",
		validate: "验证",
		setDefault: "设为默认",
		disable: "禁用",
		enable: "启用",
		rename: "重命名",
		relocate: "重新定位",
		missingFiles: "缺失的登记文件：{count} 个",
		partialRebind: "缺少 {count} 个已登记文件。是否重绑并使用可用文件？",
		moveRoot: "搬家 AstroPhoto 数据",
		moveRootInstructions: "先停止 ComfyUI，在 AstroPhoto 项目目录运行此命令，再按原方式启动 ComfyUI。",
		volumeQuota: "同卷共享配额",
		volumeQuotaHelp: "输入十进制 GB。留空使用全部实际可用空间。",
		volumeBalance: "实际可用 {free} · 受管已用 {used} · 在途预留 {reserved}",
		noQuota: "未设配额 · 使用全部实际可用空间",
		quotaBalance: "配额 {quota} · 剩余额度 {remaining}",
		editQuota: "编辑配额",
		partialMigration: "按量迁移",
		migrationSource: "来源工作区",
		migrationTarget: "目标工作区",
		selectWorkspace: "选择工作区",
		migrationAmount: "迁移数量",
		migrationUnit: "容量单位",
		migrationPreview: "预检迁移",
		migrationBasis: "来源已登记受管数据 {base} · 请求 {volume}",
		sameVolume: "同卷迁移无法腾出该卷的物理空间。",
		migrationOptions: {
			complete: "迁移整个工作区（{volume}）",
			exact: "迁移 {volume}",
			under: "迁移 {volume}（少于请求 {difference}）",
			over: "迁移 {volume}（超出请求 {difference}）"
		},
		migrationConfirm: "迁移 {volume}？验证并提交目标后，AstroPhoto 自动清理已迁走的受管源副本。",
		migrationFiles: "计划清源范围共 {count} 个受管文件。",
		movedBytes: "已迁移",
		discardTarget: "清理失败迁移残留",
		discardTargetHelp: "仅删除已核对且属于本次失败作业的文件。",
		cleanupCount: "待清理源文件",
		migrate: "迁移工作区",
		remove: "移除",
		removeLocationTitle: "移除存储位置",
		removeHelp: "将「{name}」的受管文件迁移到哪里？迁移并更新素材库路径后，将移除此位置。",
		removalTarget: "迁移到",
		chooseTarget: "选择存储位置",
		noRemovalTarget: "请先让另一个存储位置上线，再迁移文件。",
		resumeRemove: "继续迁移并移除",
		resumeRemoveHelp: "将「{name}」剩余的受管文件迁移至已选位置，完成后移除源位置。",
		reconnectTarget: "请重新连接原目标位置，再继续此次迁移。",
		lastLocation: "至少需要保留一个存储位置。",
		confirmRemove: "迁移并移除",
		removalPending: "正在迁移文件并更新素材库…",
		removedLocation: "已移除「{source}」，受管文件已迁至「{target}」。",
		path: "本机绝对路径",
		browseDirectories: "选择文件夹",
		directoryRoots: "可用位置",
		currentPath: "当前路径",
		selectedCount: "已加入 {count} 个存储位置",
		doneSelecting: "完成选择",
		directoryUp: "上一级",
		chooseDirectory: "选择此文件夹",
		addToBatch: "加入批量列表",
		batchLocations: "待登记的存储位置",
		batchLocationHelp: "请选择空文件夹。每个文件夹将登记为独立的存储位置。",
		registerBatch: "登记所选位置（{count}）",
		removeBatchLocation: "从列表移除 {name}",
		cancelDirectory: "取消",
		closeDirectory: "关闭文件夹选择",
		name: "位置名称",
		close: "关闭",
		cache: "缓存",
		used: "已用空间",
		limit: "缓存限额（GB）",
		save: "保存",
		clear: "清理缓存",
		confirmClear: "清除当前缓存中可重新生成的文件？",
		clearResult: "已移除 {count} 项（{size}）。跳过 {skipped} 项，失败 {failed} 项。",
		add: "新增存储位置",
		sources: "已授权的服务端路径，每行填写一个文件或目录",
		useDefault: "使用默认设置",
		session: "会话标签（可选）",
		target: "目标工作区",
		previewResult: "共 {count} 项，{failed} 项不可用。",
		copySize: "预计复制容量",
		startImport: "开始导入",
		preview: "检查文件与容量",
		operation: "存储操作",
		registered: "已登记",
		copied: "已复制",
		skipped: "已跳过",
		failed: "失败",
		verification: "校验等级",
		cancel: "取消操作",
		retry: "重试操作",
		emptyAssets: "没有匹配的素材。",
		external_reference: "外部引用",
		managed: "受管副本",
		error: "存储请求失败。",
		source: {
			default: "默认路径",
			ASTROPHOTO_HOME: "环境变量覆盖"
		},
		states: {
			online: "在线",
			offline: "离线",
			disabled: "已禁用",
			migrating: "迁移中",
			identity_mismatch: "身份不匹配",
			read_only: "只读",
			partial: "部分可用",
			error: "错误"
		},
		phases: {
			partial: "已完成，部分条目失败",
			queued: "已排队",
			preparing: "准备中",
			copying: "复制中",
			verifying: "校验中",
			publishing: "发布中",
			importing: "导入中",
			paused: "等待继续导入",
			committed: "重新绑定工作区",
			completed: "已完成",
			failed: "失败",
			cancelled: "已取消"
		},
		errors: {
			UNAUTHORIZED_STORAGE_OPERATION: "存储功能需要显式启用，并通过本机直连访问 ComfyUI。",
			SOURCE_NOT_AUTHORIZED: "请选择 ComfyUI 服务端已配置的导入根目录内的路径。",
			REVISION_CONFLICT: "设置已更改，请刷新后重试。",
			STORAGE_BUSY: "另一个存储操作正在运行。",
			VOLUME_QUOTA_EXCEEDED: "目标卷的 AstroPhoto 配额不足。",
			WORKSPACE_QUOTA_EXCEEDED: "存储位置的容量上限不足。",
			NO_AVAILABLE_WORKSPACE: "所有存储位置均不可用或空间不足。",
			MIGRATION_PLAN_STALE: "迁移计划已变更，请重新预检。",
			NO_MIGRATION_GROUPS: "没有可迁移到该目标的完整资产组。",
			SOURCE_CLEANUP_PENDING: "目标已生效。可重试清理剩余源文件。",
			COPY_VERIFY_FAILED: "复制的文件未通过校验，请检查存储位置后重试。",
			OBJECT_CONFLICT: "目标位置存在冲突文件。",
			WORKSPACE_FILES_MISSING: "缺少本次迁移所需的已登记文件。",
			INSUFFICIENT_DISK_SPACE: "目标卷可用空间不足。",
			WORKSPACE_OFFLINE: "存储位置已离线。",
			DIRECT_IMPORT_REPLAN_REQUIRED: "计划中的存储位置已移除。请取消此任务，再为剩余文件发起新的导入。",
			WORKSPACE_READ_ONLY: "存储位置为只读状态。",
			WORKSPACE_IDENTITY_MISMATCH: "存储位置身份不匹配。",
			SOURCE_CHANGED: "操作过程中源文件发生了变化。",
			NO_RETRYABLE_FILES: "没有可重试的未变更、未登记文件。请重新选择并预检。",
			RECOVERY_REQUIRED: "存储需要恢复，请检查服务诊断信息。",
			OPERATION_CANCELLED: "操作已取消。",
			TARGET_NOT_EMPTY: "目标目录已被占用。",
			INVALID_STORAGE_PATH: "请输入安全的本地绝对路径。",
			SOURCE_NOT_FOUND: "源文件不存在。",
			DATABASE_INVALID: "无法打开资产数据库。"
		},
		nativeBrowse: "系统窗口选择"
	},
	equipment: {
		devices: "我的设备",
		trains: "设备组合",
		addDevice: "添加设备",
		editDevice: "编辑设备",
		addTrain: "创建设备组合",
		editTrain: "编辑设备组合",
		searchDevice: "搜索设备名称、品牌或型号",
		searchTrain: "搜索设备组合名称或设备",
		filterList: "筛选记录",
		active: "全部在用",
		noMatches: "没有匹配的记录。",
		emptyDevices: "尚未添加设备。登记设备后即可创建设备组合。",
		emptyTrains: "可将相机和主光学设备添加到可复用的设备组合中。",
		resetSearch: "清除搜索与筛选",
		more: "加载更多",
		chooseType: "选择设备类型",
		basics: "基础信息",
		specs: "专业规格",
		advancedFields: "高级",
		advanced: "高级相机能力",
		unspecified: "未填写",
		addMode: "新增读出模式",
		addBand: "新增通带",
		incompleteBands: "通带资料尚未填写完整。",
		cancel: "取消",
		save: "保存",
		saving: "保存中…",
		remove: "移除",
		archive: "归档",
		restore: "恢复使用",
		usage: "设备组合引用",
		noUsage: "暂无设备组合引用。",
		editAction: "编辑设备",
		deleteAction: "永久删除",
		deleteDevice: "永久删除设备",
		deleteDeviceConfirm: "确定永久删除此设备档案？该操作无法撤销。",
		archiveDeviceConfirm: "确定归档此设备？现有设备组合仍会保留设备引用。",
		archiveTrainConfirm: "确定归档此设备组合？已保存的配置会保留。",
		deviceReceipt: "设备已保存。",
		archivedReceipt: "已归档。",
		restoredReceipt: "已恢复使用。",
		deletedReceipt: "设备已删除。",
		unavailable: "设备管理暂不可用。",
		unsaved: "未保存的修改",
		discardConfirm: "确定丢弃未保存的修改并离开？取消可继续编辑。",
		sessionRestored: "已恢复本次侧栏会话暂存的修改。",
		components: "光学组件",
		quickAdd: "新增{type}",
		pickDevice: "选择已有设备",
		invalidDevice: "设备缺失或已归档",
		addAccessory: "选择要添加的光学配件",
		moveUp: "上移",
		moveDown: "下移",
		opticalState: "设备组合状态",
		opticalStateHelp: "旋转、变更记录与平场适用性",
		changeSummary: "配置备注",
		estimate: "标称估算有效焦距与焦比",
		reload: "重新读取已保存资料",
		rebaseDeviceConfirm: "保留你的修改并以刚读取的设备资料为基准？再次保存前请核对现有资料。",
		rebaseTrainConfirm: "保留当前编辑并以最新保存的配置为基准？再次保存前请检查修改。",
		fields: {
			name: "名称",
			manufacturer: "制造商",
			model: "型号",
			notes: "备注",
			sensor_name: "传感器型号",
			sensor_kind: "成像类型",
			sensor_width_px: "传感器宽度（px）",
			sensor_height_px: "传感器高度（px）",
			pixel_size_x_um: "像素宽度（µm）",
			pixel_size_y_um: "像素高度（µm）",
			bayer_pattern: "拜耳排列",
			adc_bit_depth: "ADC 位深",
			cooling_supported: "制冷能力",
			max_bin_x: "最大横向合并",
			max_bin_y: "最大纵向合并",
			readout_modes: "读出模式",
			mode_key: "模式标识",
			display_name: "模式名称",
			gain_min: "最小增益",
			gain_max: "最大增益",
			offset_min: "最小偏置",
			offset_max: "最大偏置",
			optics_kind: "光学类型",
			optical_design: "光学设计",
			aperture_mm: "口径（mm）",
			native_focal_length_mm: "原始焦距（mm）",
			native_f_ratio: "原始焦比",
			image_circle_mm: "像圈（mm）",
			optical_notes: "光学规格备注",
			accessory_kind: "配件类别",
			nominal_factor: "标称倍率（×）",
			design_backfocus_mm: "设计后截距（mm）",
			clear_aperture_mm: "通光口径（mm）",
			filter_kind: "滤镜类别",
			physical_size_mm: "物理尺寸（mm）",
			filter_format: "滤镜规格",
			passbands: "通带",
			band_label: "通带名称",
			center_nm: "中心波长（nm）",
			fwhm_nm: "半高全宽（nm）",
			camera_id: "成像相机",
			primary_optics_id: "主光学设备",
			accessory_ids: "光学配件",
			filter_ids: "可用滤镜",
			rotation_deg: "相机旋转角度（°）",
			flat_validity_note: "平场适用性备注",
			configuration_note: "拆装、清洁或其他变更",
			summary: "版本说明",
			change_summary: "配置备注"
		},
		values: {
			camera: "相机",
			primary_optics: "望远镜 / 摄影镜头",
			optical_accessory: "光学配件",
			filter: "滤镜",
			mono: "单色",
			color: "彩色",
			other: "其他",
			unknown: "未知",
			telescope: "望远镜",
			lens: "摄影镜头",
			reducer: "减焦镜",
			flattener: "平场镜",
			barlow: "巴洛镜",
			l: "L",
			r: "R",
			g: "G",
			b: "B",
			ha: "Hα",
			oiii: "OIII",
			sii: "SII",
			broadband: "宽带",
			uv_ir_cut: "UV/IR 截止",
			solar: "太阳",
			dual_band: "双通带",
			multi_band: "多通带",
			true: "支持",
			false: "不支持",
			draft: "草稿",
			published: "已发布",
			archived: "已归档",
			deleted: "已删除"
		},
		typeHint: {
			camera: "传感器、像素和读出能力",
			primary_optics: "口径、原始焦距和光学设计",
			optical_accessory: "减焦镜、平场镜或巴洛镜",
			filter: "物理规格和一个或多个通带"
		},
		validation: {
			invalid_value: "请按所示单位与范围输入有效值。",
			unknown_field: "该记录不支持此字段。",
			required: "此字段必填。",
			duplicate: "请使用不同的值。",
			invalid_reference: "设备引用无效。",
			missing_equipment: "所选设备已不存在。",
			type_mismatch: "请选择正确类别的设备。",
			archived_equipment: "请更换或恢复已归档的设备。"
		},
		errors: {
			INVALID_REQUEST: "无法读取请求。",
			EQUIPMENT_VALIDATION_FAILED: "请检查标出的设备或设备组合字段。",
			EQUIPMENT_VERSION_CONFLICT: "此设备已在另一窗口修改，当前输入已保留。",
			DRAFT_VERSION_CONFLICT: "已保存的配置有变动。当前编辑仍保留。",
			REVISION_CONFLICT: "此设备组合已在另一窗口修改。",
			IDEMPOTENCY_CONFLICT: "同一个发布请求已用于其他内容。",
			TRAIN_INCOMPLETE: "发布前必须选择相机和主光学设备。",
			EQUIPMENT_TYPE_MISMATCH: "有设备类型不符合对应设备组合角色。",
			EQUIPMENT_REFERENCED: "此设备有设备组合引用，无法永久删除，可选择归档。",
			TRAIN_ARCHIVED: "请恢复使用此设备组合后再保存更改。",
			EQUIPMENT_NOT_FOUND: "找不到此设备记录。",
			TRAIN_NOT_FOUND: "找不到此设备组合。",
			REVISION_NOT_FOUND: "找不到此历史版本。",
			UNAUTHORIZED_EQUIPMENT_OPERATION: "此部署或请求未获设备 API 授权。",
			STORAGE_BUSY: "数据库繁忙，请稍后重试。",
			DATABASE_INVALID: "数据库无法读取，设备资料暂不可用。",
			DEV_SCHEMA_RESET_REQUIRED: "数据库使用不兼容的开发架构。",
			EQUIPMENT_UNAVAILABLE: "设备服务暂不可用。"
		},
		trainReceipt: "设备组合已保存。",
		currentConfiguration: "当前配置",
		noConfiguration: "尚未保存配置。",
		configured: "已配置",
		noBasicInformation: "尚未填写基础信息",
		componentDetails: "组件详情",
		history: "历史版本",
		noHistory: "暂无历史版本",
		revisionLabel: "版本 v{number}",
		readOnly: "只读快照",
		inUse: "在用",
		deleteTrain: "永久删除设备组合",
		deleteTrainConfirm: "移除此设备组合并释放名称？已有素材会保留历史关联。如需日后恢复，请使用归档。",
		deleteReferenced: "此设备被设备组合引用，请先解除引用。"
	},
	nodePreview: {
		openImage: "打开大图",
		parameters: "节点参数",
		adjustWidth: "调整图像区和侧栏宽度",
		adjustHeight: "调整分析区和参数区高度",
		preview: "预览",
		compare: "图像对比",
		reset: "恢复默认参数",
		close: "关闭",
		side: "左右并排",
		wipe: "滑动分割",
		single: "单图切换",
		fit: "适应窗口",
		zoomOut: "缩小",
		zoomIn: "放大",
		before: "处理前",
		after: "处理后",
		noImage: "暂无可显示图像",
		unaligned: "滑动分割要求两图坐标一致。",
		analysis: "图像分析",
		analysisEmpty: "图像分析功能待定。",
		readonly: "节点参数 · 只读",
		status: "状态"
	},
	environment: {
		fullResolution: "全分辨率",
		canvasPreview: "画布节点预览",
		canvasWidth: "预览宽度（像素）",
		canvasMaxHeight: "最大高度（像素）",
		canvasHelp: "应用于 AstroPhoto 的画布预览。节点较窄时，图片会等比缩小并完整显示。",
		previewResolution: "预览分辨率",
		previewResolutionHelp: "设置节点预览和检查器中图像的最长边上限。小于上限的图像保持原尺寸。",
		pixels: "{value} 像素",
		saving: "保存中…",
		saved: "已保存预览设置。",
		conflict: "设置已变更。请刷新当前值后再保存。"
	},
	fits: {
		fitsAsset: "选择 FITS 素材",
		unavailableAsset: "已保存素材不可用",
		serverFitsPath: "ComfyUI 服务器上的 FITS 路径",
		serverFitsPathHint: "ComfyUI 服务器上的绝对路径",
		refreshAssets: "刷新 FITS 素材"
	},
	software: {
		ready: "就绪",
		enabled: "启用",
		enableNamed: "启用 {name}",
		pixinsightPurpose: "天文图像处理",
		plannedDetails: "PixInsight 支持规划中。",
		noCandidates: "自动检测未找到候选程序，可手动填写路径。"
	}
}, Hj = { assetLibrary: {
	projects: "Projects",
	allAssets: "All Assets",
	calibration: "Calibration Library",
	searchAssets: "Search assets",
	searchProjects: "Search projects, folders and assets",
	projectActions: "Project actions for {name}",
	newProject: "New project",
	editProject: "Edit project",
	folderName: "Folder name",
	folderActions: "Folder actions for {name}",
	deleteFolder: "Delete folder",
	newSubfolder: "New subfolder",
	renameFolder: "Rename",
	removeFolderHelp: "Remove {folders} folders and detach {count} project references. Files in storage will be kept.",
	newFolder: "New folder",
	editFolder: "Edit folder",
	newCollection: "New collection",
	more: "More actions",
	editReference: "Edit virtual reference",
	editAssignment: "Edit assignment",
	attachToSession: "Add to session {name}",
	createSource: "Create Source node",
	registerMaster: "Register calibration master",
	filters: "Filters",
	noFilterOptions: "No filter options available yet.",
	sort: "Sort by",
	viewSettings: "View settings",
	group: "Group by",
	ascending: "Ascending",
	descending: "Descending",
	loadMore: "Load more",
	noMatches: "No matching results.",
	noProjects: "No projects yet. Create a project to organize assets.",
	noAssets: "No assets registered. Import files to get started.",
	noCalibration: "No calibration resources registered.",
	narrowSearch: "Search by name to find more results.",
	clearFilters: "Clear filters",
	clearSelection: "Clear selection",
	subframes: "Subframes",
	importGroups: "Subframe groups",
	frameCount: "{count} frames",
	members: "Members ({count})",
	addMembers: "Add members",
	processingConditions: "Processing conditions",
	moveUp: "Move up",
	moveDown: "Move down",
	folderTree: "Virtual folder tree",
	rootFolder: "Root",
	position: "Order",
	classification: "Classification",
	project: "Project",
	collection: "Collection",
	folder: "Folder",
	parentFolder: "Parent folder",
	master: "Calibration master",
	asset: "Asset",
	attributes: "Attributes",
	name: "Name",
	selectAsset: "Select {name}",
	removeEntry: "Remove {name}",
	storage: "Storage",
	fileSize: "Size",
	availability: "Availability",
	outputId: "Formal output receipt ID",
	bulkEdit: "Bulk edit",
	bulkConfirm: "Apply the specified attributes to {count} assets.",
	batchResult: "Updated {count}, failed {failed}.",
	save: "Save",
	saved: "Changes saved.",
	unregister: "Unregister asset",
	unregisterConfirm: "Remove this registration and its links. The file will be kept.",
	physicalDelete: "Permanently delete file",
	physicalDeleteConfirm: "Permanently delete this managed file and unregister the asset.",
	relocate: "Relocate reference",
	discard: "Discard changes",
	discardConfirm: "Discard unsaved values?",
	latestVersion: "Latest saved version",
	keepDraft: "Use this version as the baseline and keep my draft",
	remove: "Remove",
	removeRelations: "This detaches {count} project references. Files in storage will be kept.",
	projectTemplate: "Create Raw / Intermediate / Results folders",
	confirm: "Confirm",
	conflicts: "Conflicting attributes",
	unknown: "Unknown attributes",
	collectionWarning: "Saved. Processing conditions now differ within a collection: {fields}.",
	confirmMismatch: "The processing conditions include different or unknown values. Confirm that you want to continue.",
	calibrationMethod: "Calibration method",
	assignedUsages: "Existing bindings can be edited from the asset or collection menu.",
	calibrationUse: {
		dark: "Master Dark",
		dark_flat: "Master Dark Flat",
		flat: "Master Flat",
		bias: "Master Bias",
		other: "Other calibration master"
	},
	calibrationFolder: "Calibration Library folder",
	flatRequirements: "A calibration Flat requires a camera, equipment group, and recorded Bias or Dark Flat source.",
	flatConfirmed: "I confirm this Flat was calibrated with the selected source.",
	canvasBound: "Source node added to the canvas.",
	linked: "Virtual location saved.",
	currentPolicy: "Import policy from Storage: {mode}",
	reference: "Reference",
	copy: "Storage location copy",
	workspace: "Preferred storage location: {name}",
	actualLocation: "Import location: {name}",
	openStorage: "Open Storage settings",
	storageUnavailable: "This import policy is unavailable. Check Storage settings and storage location access.",
	addExistingAssets: "Add existing assets",
	alreadyInProject: "Already in project",
	selectedCount: "Selected {count}",
	addSelectedAssets: "Add to project",
	addAssetsResult: "Added {added}, already present {existing}.",
	importSingle: "Import single file",
	importBatch: "Import batch",
	singleFileOnly: "Select one file for single-file import.",
	batchAttributes: "Classification and project apply to all selected assets.",
	pickFile: "Choose file",
	referencePickerSingle: "The browser does not provide the full source path. Add a server file in an authorized location.",
	referencePicker: "The browser does not provide the full source path. Add a server file or folder in an authorized location.",
	authorizedPath: "Authorized server path",
	addPath: "Add path",
	pickFiles: "Choose files",
	pickDirectory: "Choose folder",
	pendingCount: "Selected files and folders ({count})",
	previous: "Previous",
	next: "Next",
	selectionModeChanged: "The import policy changed. Remove entries incompatible with the current policy.",
	previewImport: "Check selection",
	parallelImport: "Import across multiple disks",
	importLocations: "Participating storage locations",
	plannedFiles: "{count} files · {size}",
	plannedLanes: "Concurrent disk writers for this batch: {count}",
	directProgress: "Imported {copied} of {total} files",
	resumeDirect: "Resume import {id} ({copied}/{total})",
	reselectFiles: "Select the original files to resume the {count} remaining transfers.",
	unmatchedFiles: "Some files could not be matched. Select the corresponding entry and choose its original file.",
	retryRemaining: "Retry remaining files ({count})",
	confirmImport: "Confirm import",
	working: "Checking selection ({count}/{total})",
	previewResult: "Passed {passed}, skipped {skipped}, failed {failed} · {size}",
	noApprovals: "No requests awaiting approval.",
	approve: "Approve",
	deny: "Deny",
	approveConfirm: "Approve the displayed Agent request with the listed values?",
	forms: {
		import: "Import Assets",
		output: "Add formal output",
		approvals: "Pending Agent approvals",
		batch: "Bulk edit",
		projects: "Project editor",
		folders: "Virtual folder editor",
		collections: "Collection editor",
		sessions: "Capture session",
		masters: "Calibration master",
		assignments: "Assign calibration master",
		placements: "Place in project"
	},
	fields: {
		file_kind: "File kind",
		usage: "Usage",
		role: "Role",
		calibration_state: "Calibration state",
		stage: "Processing stage",
		target: "Target",
		capture_time: "Capture time",
		captured_at: "Capture time",
		filter: "Filter",
		band: "Spectral band",
		binning: "Binning",
		panel: "Panel",
		notes: "Notes",
		exposure: "Exposure",
		gain: "Gain",
		offset: "Offset",
		temperature: "Temperature",
		sequence: "Sequence",
		camera_id: "Camera",
		optical_train_id: "Equipment group",
		calibration_source_asset_id: "Calibration source asset",
		equipment_ids: "Equipment",
		target_type: "Target type",
		region: "Region",
		batch: "Capture batch",
		channel: "Channel",
		order: "Manual order",
		import_index: "Import order",
		fwhm: "FWHM",
		snr: "SNR",
		mtime_ns: "File modification time",
		extension: "File extension",
		source_asset_id: "Source asset ID",
		source_collection_id: "Source collection ID",
		node: "Source node",
		workflow: "Source workflow",
		session_id: "Capture session",
		workspace_id: "Storage location",
		storage_mode: "Storage mode",
		available: "File availability",
		name: "Name",
		size_bytes: "Size",
		collection_id: "Collection",
		project_id: "Project",
		folder_id: "Virtual folder"
	},
	values: {
		all: "All",
		unspecified: "Unspecified",
		image: "Image",
		video: "Video",
		other: "Other",
		unknown: "Unknown",
		light: "Light",
		dark: "Dark",
		flat: "Flat",
		bias: "Bias",
		dark_flat: "Dark Flat",
		raw: "Raw",
		master_frame: "MasterFrame",
		calibration_master: "Calibration Master",
		processed: "Processed result",
		uncalibrated: "Uncalibrated",
		calibrated: "Calibrated",
		not_applicable: "Not applicable",
		preprocessed: "Preprocessed",
		registered: "Registered",
		stacked: "Stacked",
		mosaiced: "Mosaiced",
		postprocessed: "Postprocessed",
		finished: "Finished",
		external_reference: "Reference",
		managed: "Managed",
		online: "Online",
		offline: "Offline"
	},
	errors: {
		REVISION_CONFLICT: "This entry changed. Reload and compare before saving.",
		COLLECTION_CONFLICT: "Some members have incompatible processing conditions. Split them into separate collections.",
		CONFIRMATION_REQUIRED: "Review the different or unknown conditions before confirming.",
		INVALID_CALIBRATION_MASTER: "The asset does not meet calibration master requirements.",
		SETTINGS_CHANGED: "Storage settings changed. Check the selection again.",
		ASSET_OFFLINE: "The selected file is offline or inaccessible.",
		CANVAS_UNAVAILABLE: "The active ComfyUI canvas is read-only or unavailable.",
		CANVAS_UNSUPPORTED: "This ComfyUI canvas could not bind the source node.",
		COLLECTION_EMPTY: "This collection has no source files.",
		NODE_NOT_REGISTERED: "The source node is unavailable in the active ComfyUI.",
		UNAUTHORIZED_STORAGE_OPERATION: "Assets require a trusted local ComfyUI session.",
		SOURCE_CHANGED: "The source changed after selection. Check it again.",
		SOURCE_NOT_ALLOWED: "The selected path is outside an authorized import root."
	},
	browseSources: "Browse files and folders",
	nativeFile: "Choose file in system dialog",
	nativeFolder: "Choose folder in system dialog"
} }, Uj = { assetLibrary: {
	projects: "项目",
	allAssets: "全部素材",
	calibration: "校准库",
	searchAssets: "搜索素材",
	searchProjects: "搜索项目、文件夹和素材",
	projectActions: "{name}的项目操作",
	newProject: "新建项目",
	editProject: "编辑项目",
	folderName: "文件夹名称",
	folderActions: "{name}的文件夹操作",
	deleteFolder: "删除文件夹",
	newSubfolder: "新建子文件夹",
	renameFolder: "重命名",
	removeFolderHelp: "将删除 {folders} 个文件夹并解除 {count} 项项目关联，存储中的文件会保留。",
	newFolder: "新建文件夹",
	editFolder: "编辑文件夹",
	newCollection: "新建集合",
	more: "更多操作",
	editReference: "编辑虚拟引用",
	editAssignment: "编辑校准关联",
	attachToSession: "加入会话 {name}",
	createSource: "创建源节点",
	registerMaster: "登记校准 Master",
	filters: "筛选",
	noFilterOptions: "暂无可用的筛选选项。",
	sort: "排序字段",
	viewSettings: "查看设置",
	group: "分组方式",
	ascending: "升序",
	descending: "降序",
	loadMore: "加载更多",
	noMatches: "没有匹配的结果。",
	noProjects: "还没有项目。创建项目来组织素材。",
	noAssets: "还没有素材登记。可以从导入文件开始。",
	noCalibration: "还没有校准资源。",
	narrowSearch: "输入文件名以查找更多结果。",
	clearFilters: "清除筛选",
	clearSelection: "清空选择",
	subframes: "子帧",
	importGroups: "子帧组",
	frameCount: "{count} 张",
	members: "成员（{count} 项）",
	addMembers: "添加成员",
	processingConditions: "处理条件",
	moveUp: "上移",
	moveDown: "下移",
	folderTree: "虚拟文件夹树",
	rootFolder: "根目录",
	position: "顺序",
	classification: "分类",
	project: "项目",
	collection: "集合",
	folder: "文件夹",
	parentFolder: "上级文件夹",
	master: "校准 Master",
	asset: "素材",
	attributes: "素材属性",
	name: "名称",
	selectAsset: "选择 {name}",
	removeEntry: "移除 {name}",
	storage: "存储",
	fileSize: "大小",
	availability: "可用性",
	outputId: "正式产物回执 ID",
	bulkEdit: "批量编辑",
	bulkConfirm: "将已填写的属性应用到 {count} 项素材。",
	batchResult: "更新 {count} 项，失败 {failed} 项。",
	save: "保存",
	saved: "已保存。",
	unregister: "取消登记",
	unregisterConfirm: "移除此登记及关联，保留实际文件。",
	physicalDelete: "永久删除文件",
	physicalDeleteConfirm: "永久删除此受管文件并取消登记。",
	relocate: "重新定位引用",
	discard: "放弃修改",
	discardConfirm: "放弃未保存的内容？",
	latestVersion: "服务器当前版本",
	keepDraft: "以当前版本为基线并保留我的草稿",
	remove: "移除",
	removeRelations: "将解除 {count} 个项目引用，保留磁盘文件。",
	projectTemplate: "创建 Raw / Intermediate / Results 文件夹",
	confirm: "确认",
	conflicts: "冲突属性",
	unknown: "未知属性",
	collectionWarning: "已保存。所在集合的处理条件出现差异：{fields}。",
	confirmMismatch: "处理条件包含差异或未知值。请确认是否继续。",
	calibrationMethod: "校准方法",
	assignedUsages: "可从素材或集合的操作菜单编辑现有校准关联。",
	calibrationUse: {
		dark: "Master Dark 主暗场",
		dark_flat: "Master Dark Flat 平场主暗场",
		flat: "Master Flat 主平场",
		bias: "Master Bias 主偏置场",
		other: "其他校准 Master"
	},
	calibrationFolder: "校准库文件夹",
	flatRequirements: "校准 Flat 需要相机、设备组合和已登记的 Bias 或 Dark Flat 来源。",
	flatConfirmed: "我确认此 Flat 已使用所选来源完成校准。",
	canvasBound: "已将源节点添加到画布。",
	linked: "已保存虚拟位置。",
	currentPolicy: "继承存储设置的导入策略：{mode}",
	reference: "引用原址",
	copy: "复制到存储位置",
	workspace: "首选存储位置：{name}",
	actualLocation: "本次导入位置：{name}",
	openStorage: "查看存储设置",
	storageUnavailable: "当前导入策略不可用，请检查存储设置和存储位置访问状态。",
	addExistingAssets: "添加已有素材",
	alreadyInProject: "已在项目中",
	selectedCount: "已选择 {count} 项",
	addSelectedAssets: "添加到项目",
	addAssetsResult: "已添加 {added} 项，已有 {existing} 项。",
	importSingle: "导入单张",
	importBatch: "批量导入",
	singleFileOnly: "单张导入只能选择一个文件，请重新选择。",
	batchAttributes: "分类和项目应用于本次选择的所有素材。",
	pickFile: "选择文件",
	referencePickerSingle: "浏览器不提供完整源路径。请添加授权目录下的服务端文件路径。",
	referencePicker: "浏览器不提供完整源路径。请添加授权目录下的服务端文件或文件夹路径。",
	authorizedPath: "授权服务端路径",
	addPath: "添加路径",
	pickFiles: "选择文件",
	pickDirectory: "选择文件夹",
	pendingCount: "待导入文件与文件夹（{count} 项）",
	previous: "上一页",
	next: "下一页",
	selectionModeChanged: "导入策略已变更，请移除与当前策略不兼容的条目。",
	previewImport: "预检导入",
	parallelImport: "多盘并行导入",
	importLocations: "参与导入的存储位置",
	plannedFiles: "{count} 个文件 · {size}",
	plannedLanes: "本批次并行写入队列数：{count}",
	directProgress: "已导入 {copied}/{total} 个文件",
	resumeDirect: "继续导入 {id}（{copied}/{total}）",
	reselectFiles: "重新选择原文件，即可继续剩余 {count} 个文件的导入。",
	unmatchedFiles: "部分文件未能匹配。请在待导入列表中选中对应条目，再选择原文件。",
	retryRemaining: "重试剩余文件（{count} 项）",
	confirmImport: "确认导入",
	working: "正在检查选择（{count}/{total}）",
	previewResult: "通过 {passed} 项，跳过 {skipped} 项，失败 {failed} 项 · {size}",
	noApprovals: "没有待审批的请求。",
	approve: "批准",
	deny: "拒绝",
	approveConfirm: "批准此 Agent 请求及其显示的参数？",
	forms: {
		import: "导入素材",
		output: "收录正式产物",
		approvals: "Agent 待审批请求",
		batch: "批量编辑",
		projects: "项目编辑器",
		folders: "虚拟文件夹编辑器",
		collections: "集合编辑器",
		sessions: "拍摄会话",
		masters: "校准 Master",
		assignments: "关联校准 Master",
		placements: "放入项目"
	},
	fields: {
		file_kind: "文件形态",
		usage: "用途",
		role: "产物角色",
		calibration_state: "校准状态",
		stage: "处理阶段",
		target: "目标",
		capture_time: "采集时间",
		captured_at: "采集时间",
		filter: "滤镜",
		band: "波段",
		binning: "像素合并",
		panel: "拼接区块",
		notes: "备注",
		exposure: "曝光",
		gain: "增益",
		offset: "偏置",
		temperature: "温度",
		sequence: "顺序",
		camera_id: "相机",
		optical_train_id: "设备组合",
		calibration_source_asset_id: "校准来源素材",
		equipment_ids: "设备",
		target_type: "目标类型",
		region: "区域",
		batch: "采集批次",
		channel: "通道",
		order: "手动顺序",
		import_index: "导入顺序",
		fwhm: "FWHM",
		snr: "信噪比",
		mtime_ns: "文件修改时间",
		extension: "文件扩展名",
		source_asset_id: "来源素材 ID",
		source_collection_id: "来源集合 ID",
		node: "来源节点",
		workflow: "来源工作流",
		session_id: "拍摄会话",
		workspace_id: "存储位置",
		storage_mode: "存储模式",
		available: "文件可用性",
		name: "名称",
		size_bytes: "大小",
		collection_id: "集合",
		project_id: "项目",
		folder_id: "虚拟文件夹"
	},
	values: {
		all: "全部",
		unspecified: "未指定",
		image: "图片",
		video: "视频",
		other: "其他",
		unknown: "未知",
		light: "Light 亮场",
		dark: "Dark 暗场",
		flat: "Flat 平场",
		bias: "Bias 偏置场",
		dark_flat: "Dark Flat 平场暗场",
		raw: "原始",
		master_frame: "主帧",
		calibration_master: "校准 Master",
		processed: "处理结果",
		uncalibrated: "未校准",
		calibrated: "已校准",
		not_applicable: "不适用",
		preprocessed: "预处理",
		registered: "配准",
		stacked: "叠加",
		mosaiced: "拼接",
		postprocessed: "后期处理",
		finished: "完成",
		external_reference: "引用",
		managed: "存储位置副本",
		online: "在线",
		offline: "离线"
	},
	errors: {
		REVISION_CONFLICT: "此条目已变更。请重新加载并核对后保存。",
		COLLECTION_CONFLICT: "部分成员的处理条件冲突，请拆分成不同集合。",
		CONFIRMATION_REQUIRED: "请核对存在差异或未知的条件，再确认操作。",
		INVALID_CALIBRATION_MASTER: "素材不符合校准 Master 的登记条件。",
		SETTINGS_CHANGED: "存储设置已变更，请重新预检。",
		ASSET_OFFLINE: "所选文件离线或不可访问。",
		CANVAS_UNAVAILABLE: "当前 ComfyUI 画布只读或不可用。",
		CANVAS_UNSUPPORTED: "当前 ComfyUI 画布无法绑定源节点。",
		COLLECTION_EMPTY: "当前集合没有源文件。",
		NODE_NOT_REGISTERED: "当前 ComfyUI 未注册所需源节点。",
		UNAUTHORIZED_STORAGE_OPERATION: "素材库需要受信的本机 ComfyUI 会话。",
		SOURCE_CHANGED: "来源在选取后发生变化，请重新预检。",
		SOURCE_NOT_ALLOWED: "所选路径超出已授权的导入根。"
	},
	browseSources: "选择文件或文件夹",
	nativeFile: "系统窗口选择文件",
	nativeFolder: "系统窗口选择文件夹"
} };
// src/i18n/index.ts
function Wj(e) {
	return typeof e == "string" && /^zh(?:-|_|$)/i.test(e) ? "zh" : "en";
}
function Gj(e = []) {
	return Sf({
		legacy: !1,
		locale: "en",
		fallbackLocale: "en",
		messages: {
			en: Object.assign({}, zj, Bj, Hj, ...e.map((e) => e.messages.en)),
			zh: Object.assign({}, fy, Vj, Uj, ...e.map((e) => e.messages.zh))
		}
	});
}
// src/host/locale.ts
function Kj(e, t, n) {
	let r = () => n(Wj(e.extensionManager.setting.get("Comfy.Locale") || navigator.language)), i = () => {
		t.getClientRects().length && !document.hidden && r();
	};
	r();
	let a = window.setInterval(i, 500);
	return window.addEventListener("focus", i), () => {
		window.clearInterval(a), window.removeEventListener("focus", i);
	};
}
// src/host/sidebar.ts
var qj = "astrophoto.sidebar";
function Jj(e, t) {
	if (e.extensionManager.getSidebarTabs().some((e) => e.id === "astrophoto.sidebar")) return;
	let n = {}, r, i, a, o, s = () => {
		o?.(), r?.unmount(), i?.remove(), a?.classList.remove("astrophoto-host-container"), o = r = i = a = void 0;
	};
	e.extensionManager.registerSidebarTab({
		id: qj,
		title: "AstroPhoto",
		tooltip: "AstroPhoto",
		icon: "astrophoto-sidebar-icon",
		type: "custom",
		render(c) {
			if (r && i?.parentElement === c) return;
			s(), a = c, c.classList.add("astrophoto-host-container"), i = document.createElement("div"), i.className = "astrophoto-ui", c.appendChild(i);
			let l = Gj(t);
			o = Kj(e, i, (e) => {
				l.global.locale.value = e;
			}), r = xs(Rj, {
				equipmentSession: n,
				bundles: t
			}), r.use(l).mount(i);
		},
		destroy: s
	});
}
// src/features/drawing/ToolBar.vue?vue&type=script&setup=true&lang.ts
var Yj = { class: "toolbar" }, Xj = ["title", "aria-pressed"], Zj = { class: "color-picker" }, Qj = [
	"onClick",
	"title",
	"aria-label",
	"aria-pressed"
], $j = { class: "size-slider" }, eM = ["value"], tM = /*@__PURE__*/ z({
	__name: "ToolBar",
	props: {
		colors: {},
		initialColor: {},
		initialBrushSize: {},
		initialTool: {}
	},
	emits: [
		"tool-change",
		"color-change",
		"canvas-clear",
		"brush-size-change"
	],
	setup(e, { emit: t }) {
		let { t: n } = Cf(), r = e, i = t, a = r.colors || [
			"#000000",
			"#ff0000",
			"#0000ff",
			"#69a869",
			"#ffff00",
			"#ff00ff",
			"#00ffff"
		], o = /* @__PURE__ */ P(r.initialColor || "#000000"), s = /* @__PURE__ */ P(r.initialBrushSize || 5), c = /* @__PURE__ */ P(r.initialTool || "pen");
		function l(e) {
			c.value = e, i("tool-change", e);
		}
		function u(e) {
			o.value = e, i("color-change", e);
		}
		function d() {
			i("canvas-clear");
		}
		function f(e) {
			let t = e.target;
			s.value = Number(t.value), i("brush-size-change", s.value);
		}
		return (e, t) => (U(), W(H, null, [
			K("div", Yj, [K("button", {
				type: "button",
				title: I(n)("vue-basic.pen-tooltip"),
				"aria-pressed": c.value === "pen",
				class: me({ active: c.value === "pen" }),
				onClick: t[0] ||= (e) => l("pen")
			}, N(I(n)("vue-basic.pen")), 11, Xj), K("button", {
				type: "button",
				onClick: d
			}, N(I(n)("vue-basic.clear-canvas")), 1)]),
			K("div", Zj, [(U(!0), W(H, null, B(I(a), (e, t) => (U(), W("button", {
				key: t,
				class: me({
					"color-button": !0,
					active: o.value === e
				}),
				onClick: (t) => u(e),
				type: "button",
				title: e,
				"aria-label": e,
				"aria-pressed": o.value === e
			}, [K("span", {
				class: "color-swatch",
				style: le({ backgroundColor: e }),
				"aria-hidden": "true"
			}, null, 4)], 10, Qj))), 128))]),
			K("div", $j, [K("label", null, N(I(n)("vue-basic.brush-size")) + ": " + N(s.value) + "px", 1), K("input", {
				type: "range",
				min: "1",
				max: "50",
				value: s.value,
				onChange: t[1] ||= (e) => f(e)
			}, null, 40, eM)])
		], 64));
	}
}), nM = (e, t) => {
	let n = e.__vccOpts || e;
	for (let [e, r] of t) n[e] = r;
	return n;
}, rM = /*#__PURE__*/ nM(tM, [["__scopeId", "data-v-9605a2a8"]]), iM = { class: "drawing-board" }, aM = { class: "canvas-container" }, oM = ["width", "height"], sM = /*#__PURE__*/ nM(/* @__PURE__ */ z({
	__name: "DrawingBoard",
	props: {
		width: {},
		height: {},
		initialColor: {},
		initialBrushSize: {}
	},
	emits: [
		"mounted",
		"drawing-start",
		"drawing",
		"drawing-end",
		"state-save",
		"canvas-clear"
	],
	setup(e, { expose: t, emit: n }) {
		let r = e, i = r.width || 800, a = r.height || 500, o = r.initialColor || "#000000", s = r.initialBrushSize || 5, c = n, l = /* @__PURE__ */ P(!1), u = /* @__PURE__ */ P(0), d = /* @__PURE__ */ P(0), f = /* @__PURE__ */ P(null), p = /* @__PURE__ */ P(!1), m = /* @__PURE__ */ P(s), h = /* @__PURE__ */ P(o), g = /* @__PURE__ */ P(null), _ = /* @__PURE__ */ P(null), v = 0;
		Hr(() => {
			v++;
		}), zr(() => {
			_.value && (f.value = _.value.getContext("2d"), y(), Fn(() => {
				_.value && c("mounted", _.value);
			}));
		});
		function y() {
			f.value && (f.value.fillStyle = "#ffffff", f.value.fillRect(0, 0, i, a), b(), j());
		}
		function b() {
			f.value && (p.value ? (f.value.globalCompositeOperation = "destination-out", f.value.strokeStyle = "rgba(0,0,0,1)") : (f.value.globalCompositeOperation = "source-over", f.value.strokeStyle = h.value), f.value.lineWidth = m.value, f.value.lineJoin = "round", f.value.lineCap = "round");
		}
		function x(e) {
			v++, l.value = !0;
			let { offsetX: t, offsetY: n } = w(e);
			u.value = t, d.value = n, f.value && (f.value.beginPath(), f.value.moveTo(u.value, d.value), f.value.arc(u.value, d.value, m.value / 2, 0, Math.PI * 2), f.value.fill(), c("drawing-start", {
				x: t,
				y: n,
				tool: p.value ? "eraser" : "pen"
			}));
		}
		function S(e) {
			if (!l.value || !f.value) return;
			let { offsetX: t, offsetY: n } = w(e);
			f.value.beginPath(), f.value.moveTo(u.value, d.value), f.value.lineTo(t, n), f.value.stroke(), u.value = t, d.value = n, c("drawing", {
				x: t,
				y: n,
				tool: p.value ? "eraser" : "pen"
			});
		}
		function C() {
			l.value && (l.value = !1, j(!0), c("drawing-end"));
		}
		function w(e) {
			let t = 0, n = 0;
			if ("touches" in e) {
				if (e.preventDefault(), _.value) {
					let r = _.value.getBoundingClientRect();
					t = e.touches[0].clientX - r.left, n = e.touches[0].clientY - r.top;
				}
			} else t = e.offsetX, n = e.offsetY;
			return {
				offsetX: t,
				offsetY: n
			};
		}
		function T(e) {
			e.preventDefault(), x(e);
		}
		function E(e) {
			e.preventDefault(), l.value && S(e);
		}
		function D(e) {
			p.value = e === "eraser", b();
		}
		function O(e) {
			h.value = e, b();
		}
		function k(e) {
			m.value = e, b();
		}
		function A() {
			f.value && (f.value.fillStyle = "#ffffff", f.value.fillRect(0, 0, i, a), b(), j(!0), c("canvas-clear"));
		}
		function j(e = !1) {
			v++, _.value && (g.value = _.value.toDataURL("image/png"), g.value && c("state-save", g.value, e));
		}
		async function ee() {
			if (!_.value) throw Error("Canvas is unable to get current data");
			return g.value ? g.value : _.value.toDataURL("image/png");
		}
		async function te(e) {
			if (!e.startsWith("data:image/png;base64,")) throw Error("Invalid saved PNG");
			let t = ++v, n = new Image();
			if (n.src = e, await n.decode(), t === v && f.value) {
				if (n.width !== i || n.height !== a) throw Error("Invalid saved canvas size");
				f.value.save(), f.value.globalCompositeOperation = "source-over", f.value.clearRect(0, 0, i, a), f.value.drawImage(n, 0, 0), f.value.restore(), j();
			}
		}
		return t({
			restoreCanvas: te,
			setTool: D,
			setColor: O,
			setBrushSize: k,
			clearCanvas: A,
			getCurrentCanvasData: ee
		}), (e, t) => (U(), W("div", iM, [K("div", aM, [K("canvas", {
			ref_key: "canvas",
			ref: _,
			width: I(i),
			height: I(a),
			onMousedown: x,
			onMousemove: S,
			onMouseup: C,
			onMouseleave: C,
			onTouchstart: T,
			onTouchmove: E,
			onTouchend: C
		}, null, 40, oM)])]));
	}
}), [["__scopeId", "data-v-1fba2252"]]), cM = { class: "drawing-app" }, lM = /*#__PURE__*/ nM(/* @__PURE__ */ z({
	__name: "DrawingApp",
	props: {
		width: {},
		height: {},
		initialColor: {},
		initialBrushSize: {},
		availableColors: {}
	},
	emits: [
		"tool-change",
		"color-change",
		"brush-size-change",
		"drawing-start",
		"drawing",
		"drawing-end",
		"state-save",
		"mounted"
	],
	setup(e, { expose: t, emit: n }) {
		let r = e, i = r.width || 800, a = r.height || 500, o = r.initialColor || "#000000", s = r.initialBrushSize || 5, c = r.availableColors || [
			"#000000",
			"#ff0000",
			"#0000ff",
			"#00ff00",
			"#ffff00",
			"#ff00ff",
			"#00ffff"
		], l = n, u = /* @__PURE__ */ P(null), d = /* @__PURE__ */ P(null);
		function f(e) {
			u.value?.setTool(e), l("tool-change", e);
		}
		function p(e) {
			u.value?.setColor(e), l("color-change", e);
		}
		function m(e) {
			u.value?.setBrushSize(e), l("brush-size-change", e);
		}
		function h() {
			u.value?.clearCanvas();
		}
		function g(e) {
			l("drawing-start", e);
		}
		function _(e) {
			l("drawing", e);
		}
		function v() {
			l("drawing-end");
		}
		function y(e, t) {
			d.value = e, l("state-save", e, t);
		}
		function b(e) {
			l("mounted", e);
		}
		async function x() {
			if (d.value) return d.value;
			if (u.value) try {
				return await u.value.getCurrentCanvasData();
			} catch (e) {
				throw console.error("unable to get canvas data:", e), Error("unable to get canvas data");
			}
			throw Error("get canvas data failed");
		}
		return t({
			getCanvasData: x,
			restoreCanvas: (e) => u.value.restoreCanvas(e)
		}), (e, t) => (U(), W("div", cM, [q(rM, {
			colors: I(c),
			initialColor: I(o),
			initialBrushSize: I(s),
			onToolChange: f,
			onColorChange: p,
			onBrushSizeChange: m,
			onCanvasClear: h
		}, null, 8, [
			"colors",
			"initialColor",
			"initialBrushSize"
		]), q(sM, {
			ref_key: "drawingBoard",
			ref: u,
			width: I(i),
			height: I(a),
			initialColor: I(o),
			initialBrushSize: I(s),
			onDrawingStart: g,
			onDrawing: _,
			onDrawingEnd: v,
			onStateSave: y,
			onMounted: b
		}, null, 8, [
			"width",
			"height",
			"initialColor",
			"initialBrushSize"
		])]));
	}
}), [["__scopeId", "data-v-d8cc17f7"]]), uM = {
	key: 0,
	role: "alert"
}, dM = /* @__PURE__ */ z({
	__name: "VueExampleComponent",
	props: { widget: {} },
	setup(t) {
		let { t: r } = Cf(), i = /* @__PURE__ */ P(null), a = /* @__PURE__ */ P(null), o = t.widget, s = /* @__PURE__ */ P(!1);
		R(s, (e) => {
			e && Uv("error", r("vue-basic.restore-error"));
		});
		let c = (e) => {
			if (!e || typeof e != "object") return { image: null };
			let t = e;
			return {
				image: typeof t.image == "string" ? t.image : null,
				...typeof t.canvasDataURL == "string" ? { canvasDataURL: t.canvasDataURL } : {}
			};
		}, l = /* @__PURE__ */ F(c(o.value));
		o.options ??= {}, o.options.getValue = () => l.value, o.options.setValue = (e) => {
			l.value = c(e);
		};
		let u = !1, d = Promise.resolve();
		function f(t, n = !1) {
			if (a.value = t, !u) return;
			let r = () => {
				d = Promise.resolve(), l.value = {
					image: null,
					canvasDataURL: t
				}, s.value = !1;
			}, i = o.node, c = i.graph;
			if (!n || !c || t === l.value.canvasDataURL) {
				r();
				return;
			}
			let f = e.canvas;
			c.beforeChange(i), f?.emitBeforeChange();
			try {
				r(), c.change();
			} finally {
				try {
					c.afterChange(i);
				} finally {
					f?.emitAfterChange();
				}
			}
		}
		async function p(e, t) {
			try {
				let r = await fetch(e).then((e) => e.blob()), i = `${t}_${Date.now()}.png`, a = new File([r], i), o = new FormData();
				return o.append("image", a), o.append("subfolder", "threed"), o.append("type", "temp"), (await n.fetchApi("/upload/image", {
					method: "POST",
					body: o
				})).json();
			} catch (e) {
				throw console.error("Vue Component: Error uploading image:", e), e;
			}
		}
		return zr(() => {
			u = !0, !l.value.canvasDataURL && a.value && f(a.value), R(() => l.value.canvasDataURL, (e) => {
				e && e !== a.value && (d = i.value.restoreCanvas(e), d.catch(() => {
					s.value = !0;
				}));
			}, {
				immediate: !0,
				flush: "sync"
			}), o.serializeValue = async () => {
				try {
					await d;
					let e = a.value;
					return e ? { image: `threed/${(await p(e, "test_vue_basic")).name} [temp]` } : (console.warn("Vue Component: No canvas data available"), { image: null });
				} catch (e) {
					return console.error("Vue Component: Error in serializeValue:", e), { image: null };
				}
			};
		}), (e, t) => (U(), W("div", null, [
			K("h1", null, N(I(r)("vue-basic.title")), 1),
			K("div", null, [q(lM, {
				ref_key: "drawingAppRef",
				ref: i,
				width: 300,
				height: 300,
				onStateSave: f
			}, null, 512)]),
			s.value ? (U(), W("p", uM, N(I(r)("vue-basic.restore-error")), 1)) : Y("", !0)
		]));
	}
}), fM = /* @__PURE__ */ new WeakMap(), pM = /* @__PURE__ */ new WeakSet();
function mM(e, t) {
	return JSON.stringify([
		e.graph?.id,
		e.id,
		t
	]);
}
function hM(e) {
	let { node: t, element: n, name: r } = e;
	fM.set(e, n), pM.add(n);
	let i = () => {
		n.dataset.astrophotoWidgetOwner = mM(t, r);
	};
	t.graph && i();
	let a = t.onAdded;
	t.onAdded = function(e) {
		a?.call(this, e), i();
	};
}
function gM(e) {
	requestAnimationFrame(() => {
		let t = e.canvas?.graph;
		if (!t) return;
		let n = /* @__PURE__ */ new Map();
		for (let e of document.querySelectorAll("[data-astrophoto-widget-owner]")) pM.has(e) && n.set(e.dataset.astrophotoWidgetOwner, e);
		for (let e of t.nodes) for (let t of e.widgets ?? []) {
			let r = fM.get(t);
			if (!r || r.isConnected) continue;
			let i = mM(e, t.name), a = n.get(i);
			if (a?.isConnected) {
				r.dataset.astrophotoWidgetOwner = i;
				for (let e of a.classList) r.classList.add(e);
				a.replaceWith(r);
			}
		}
	});
}
// src/host/drawing.ts
function _M(e) {
	e.registerExtension({
		name: "vue-basic",
		getCustomWidgets() {
			return { CUSTOM_VUE_COMPONENT_BASIC(t) {
				let n = document.createElement("div");
				n.className = "astrophoto-drawing-widget";
				let r = t.addDOMWidget("custom_vue_component_basic", "vue-basic", n, {
					getMinHeight: () => 460,
					getHeight: () => 460
				});
				hM(r);
				let i = Gj(), a = Kj(e, n, (e) => {
					i.global.locale.value = e;
				}), o = xs(dM, { widget: r });
				o.use(i).mount(n);
				let s = r.onRemove;
				return r.onRemove = () => {
					a(), o.unmount(), s?.call(r);
				}, { widget: r };
			} };
		},
		nodeCreated(e) {
			if (e.comfyClass !== "vue-basic") return;
			let [t, n] = e.size;
			e.setSize([Math.max(t, 300), Math.max(n, 520)]);
		}
	});
}
// src/api/fits.ts
var vM = /^[a-f0-9]{8}-(?:[a-f0-9]{4}-){3}[a-f0-9]{12}$/;
async function yM(e) {
	let t = [], n = "";
	do {
		let r = await Ff("/astrophoto/v1/fits/assets?after=" + n, e);
		if (!$(r) || !Array.isArray(r.assets) || r.assets.some((e) => !$(e) || typeof e.id != "string" || !vM.test(e.id) || typeof e.name != "string") || r.next !== null && (typeof r.next != "string" || !vM.test(r.next) || r.next <= n)) throw new Q("schema");
		t.push(...r.assets), n = r.next ?? "";
	} while (n);
	return t;
}
// src/host/mountWidget.ts
function bM(e, t, n, r, i = []) {
	let a = Gj(i), o = Kj(e, t, (e) => {
		a.global.locale.value = e;
	}), s = xs(n, r);
	return s.use(a).mount(t), () => {
		o(), s.unmount();
	};
}
// src/host/fitsSource.tsx
var xM = /* @__PURE__ */ z((e) => {
	let { t } = Cf(), n = /* @__PURE__ */ F([]), r = /* @__PURE__ */ P("loading"), i = /* @__PURE__ */ P(0);
	R(i, (e, t, i) => {
		let a = new AbortController();
		i(() => a.abort()), r.value = "loading", yM(a.signal).then((e) => {
			a.signal.aborted || (n.value = e, r.value = "ready");
		}, (e) => {
			a.signal.aborted || (r.value = e instanceof Q ? e.code : "network");
		});
	}, { immediate: !0 }), R(r, (e) => {
		e !== "loading" && e !== "ready" && Uv("error", t("errors." + e, e));
	});
	let a = (t) => e.select(t.currentTarget.value);
	return () => q(H, null, [
		q("select", {
			"aria-label": t("fits.fitsAsset"),
			value: e.source,
			onChange: a
		}, [
			q("option", { value: "" }, [t(r.value === "loading" ? "states.loading" : "fits.fitsAsset")]),
			e.source && !n.value.some((t) => t.id === e.source) && q("option", { value: e.source }, [/^[a-f0-9-]{36}$/.test(e.source) ? `${t("fits.unavailableAsset")} · ${e.source}` : e.source]),
			n.value.map((e) => q("option", {
				key: e.id,
				value: e.id
			}, [
				e.name,
				J(" · "),
				e.id.slice(0, 8)
			]))
		]),
		q("label", null, [t("fits.serverFitsPath"), q("input", {
			type: "text",
			value: e.source,
			placeholder: t("fits.serverFitsPathHint"),
			onInput: a
		}, null)]),
		r.value !== "loading" && r.value !== "ready" && q("small", { role: "alert" }, [t("errors." + r.value, r.value)]),
		q("button", {
			type: "button",
			onClick: () => {
				i.value += 1;
			}
		}, [t("fits.refreshAssets")])
	]);
}, { props: ["source", "select"] });
function SM(e) {
	e.registerExtension({
		name: "AstroPhoto.ScientificNodes",
		getCustomWidgets() {
			return { ASTRO_FITS_ASSET(t, n) {
				let r = /* @__PURE__ */ P(""), i = document.createElement("div");
				i.className = "astrophoto-ui ap-fits-source-widget";
				let a = t.addDOMWidget(n, "astrophoto-fits-asset", i, {
					getMinHeight: () => 145,
					getHeight: () => 145,
					getValue: () => r.value,
					setValue: (e) => {
						r.value = e;
					}
				});
				hM(a);
				let o = bM(e, i, /* @__PURE__ */ z(() => () => q(xM, {
					source: r.value,
					select: (n) => {
						e.canvas?.read_only || e.canvas?.selectOnly || (a.value = n, t.graph?.change());
					}
				}, null)), {}), s = a.onRemove;
				return a.onRemove = () => {
					o(), s?.call(a);
				}, { widget: a };
			} };
		}
	});
}
// src/styles/load.ts
function CM(e) {
	if (Array.from(document.querySelectorAll("link[rel=\"stylesheet\"]")).some((t) => t.href === e.href)) return;
	let t = document.createElement("link");
	t.rel = "stylesheet", t.href = e.href, document.head.appendChild(t);
}
// src/main.ts
function wM(e, t) {
	CM(new URL(
		/* @vite-ignore */
		"./assets/main.css",
		import.meta.url
	)), _M(e), SM(e), e.registerExtension({
		name: "AstroPhoto.Sidebar",
		setup() {
			Jj(e, t), EA().catch(() => {});
		},
		beforeConfigureGraph() {
			Zv();
		},
		afterConfigureGraph() {
			gM(e);
		}
	});
	for (let n of t) n.registerNodes(e, t);
}
// ../extension/siril/frontend/SirilCommandDetails.tsx
function TM(e, t) {
	return t === "zh" ? e.title_zh ?? e.title : e.title;
}
function EM(e, t) {
	return t === "zh" ? e.description_zh ?? e.description : e.description;
}
var DM = /* @__PURE__ */ z((e) => {
	let { locale: t, t: n } = Cf();
	return () => {
		let { command: r, disclose: i } = e, a = q(H, null, [
			q("pre", null, [r.usage]),
			r.requires.length > 0 && q("p", { class: "ap-siril-requirements" }, [
				n("siril.catalogue.requirements"),
				" ",
				r.requires.map((e) => n("siril.requirements." + e.replace(/[^A-Za-z0-9]+/g, "_"), e)).join(" · ")
			]),
			r.build_feature && q("p", null, [n("siril.catalogue.build", { feature: r.build_feature })])
		]);
		return q("div", { class: "ap-siril-command-details" }, [q("p", { class: "ap-siril-description" }, [EM(r, t.value)]), i ? q("details", { class: "ap-siril-command-usage" }, [q("summary", null, [n("siril.catalogue.usage")]), a]) : a]);
	};
}, { props: ["command", "disclose"] }), OM = "/astrophoto/v1/software/siril", kM = /^[a-f0-9]{8}-(?:[a-f0-9]{4}-){3}[a-f0-9]{12}$/, AM = "/astrophoto/v1/previews", jM;
function MM() {
	return jM ??= Ff(OM + "/commands").then((e) => {
		if (!$(e) || e.version !== "1.4.5" || !Array.isArray(e.commands) || e.commands.some((e) => !$(e) || typeof e.id != "string" || typeof e.title != "string" || typeof e.usage != "string" || typeof e.description != "string" || typeof e.preview != "boolean" || typeof e.scriptable != "boolean" || [
			"category",
			"category_zh",
			"title_zh",
			"description_zh"
		].some((t) => e[t] !== void 0 && typeof e[t] != "string") || e.search_aliases !== void 0 && (!Array.isArray(e.search_aliases) || e.search_aliases.some((e) => typeof e != "string")) || e.node_id !== null && typeof e.node_id != "string" || e.build_feature !== null && typeof e.build_feature != "string" || !Array.isArray(e.requires) || e.requires.some((e) => typeof e != "string") || !Array.isArray(e.parameters) || e.parameters.some((e) => !$(e) || typeof e.name != "string" || typeof e.label != "string" || typeof e.help != "string" || typeof e.rgb_only != "boolean" || !["number", "boolean"].includes(typeof e.default) || e.min !== null && typeof e.min != "number" || e.max !== null && typeof e.max != "number"))) throw new Q("schema");
		return e.commands;
	}).catch((e) => {
		throw jM = void 0, e;
	}), jM;
}
var NM = (e, t) => Ff(AM + "/jobs/" + e + "/validate", t);
async function PM(e, t) {
	if (!kM.test(e)) throw new Q("schema");
	return If("/astrophoto/v1/library/assets", "POST", { output_id: e }, t);
}
function FM(e) {
	if (!$(e) || typeof e.os != "string" || typeof e.state != "string" || typeof e.enabled != "boolean" || e.target_version !== "1.4.5" || e.state === "ready" && (typeof e.path != "string" || e.version !== "1.4.5" || typeof e.verified_at != "string")) throw new Q("schema");
	return e;
}
var IM = async (e) => FM(await Ff(OM, e)), LM = async (e, t) => FM(await If(OM, "PUT", { path: e }, t, 3e4)), RM = async (e) => FM(await If(OM, "DELETE", void 0, e)), zM = async (e, t) => FM(await If(OM + "/enabled", "PUT", { enabled: e }, t));
async function BM(e) {
	let t = await If(OM + "/discover", "POST", void 0, e, 195e3);
	if (!$(t) || !Array.isArray(t.candidates) || t.candidates.some((e) => !$(e) || typeof e.path != "string" || typeof e.origin != "string" || typeof e.state != "string")) throw new Q("schema");
	return t.candidates;
}
function VM(e) {
	return new Promise((t, n) => {
		let r = () => {
			clearTimeout(i), n(new DOMException("Aborted", "AbortError"));
		}, i = setTimeout(() => {
			e.removeEventListener("abort", r), t();
		}, 350);
		e.aborted ? r() : e.addEventListener("abort", r, { once: !0 });
	});
}
async function HM(e, n, r) {
	let i = await t.api.fetchApi(e + "/" + n, {
		signal: r,
		headers: { "X-AstroPhoto-Local": "1" }
	});
	if (!i.ok || i.headers.get("content-type")?.split(";")[0] !== "image/png") throw new Q("PREVIEW_STALE");
	let a = await i.blob();
	return URL.createObjectURL(a);
}
async function UM(e, t, n, r, i, a) {
	let o = await If(AM + "/siril/" + encodeURIComponent(e), "POST", {
		...kM.test(t) ? { asset_id: t } : { image_path: t },
		owner: n,
		parameters: r,
		...a ? { formal_id: a } : {}
	});
	if (!$(o) || typeof o.job_id != "string" || !kM.test(o.job_id)) throw new Q("schema");
	let s = AM + "/jobs/" + o.job_id, c = () => {
		If(s + "/cancel", "POST").catch(() => {});
	}, l, u;
	if (i.aborted) throw c(), new DOMException("Aborted", "AbortError");
	i.addEventListener("abort", c, { once: !0 });
	try {
		for (; !i.aborted;) {
			let e = await Ff(s, i);
			if (!$(e)) throw new Q("schema");
			if (e.state === "queued" || e.state === "running") await VM(i);
			else {
				if (![
					"ready",
					"failed",
					"cancelled"
				].includes(String(e.state))) throw new Q("schema");
				if (e.before === !0 && (l = await HM(s, "before", i)), e.after === !0 && (u = await HM(s, "after", i)), i.aborted) break;
				return {
					state: String(e.state),
					before: l,
					after: u,
					aligned: e.aligned === !0,
					formal: e.formal === !0,
					jobId: o.job_id,
					width: typeof e.width == "number" ? e.width : void 0,
					height: typeof e.height == "number" ? e.height : void 0,
					channels: typeof e.channels == "number" ? e.channels : void 0,
					version: typeof e.version == "string" ? e.version : void 0,
					error: typeof e.error == "string" ? e.error : void 0
				};
			}
		}
		throw new DOMException("Aborted", "AbortError");
	} catch (e) {
		throw l && URL.revokeObjectURL(l), u && URL.revokeObjectURL(u), c(), e;
	} finally {
		i.removeEventListener("abort", c);
	}
}
// src/features/nodes/preview/PanelDivider.tsx
var WM = /* @__PURE__ */ z((e) => {
	let t;
	return () => {
		let { axis: n, value: r, min: i, max: a, label: o, controls: s, onChange: c } = e, l = n === "x", u = (e) => c(Math.max(i, Math.min(a, e)));
		return q("div", za({
			class: "ap-inspector-splitter",
			"data-axis": n,
			role: "separator",
			tabindex: 0,
			"aria-label": o,
			"aria-controls": s,
			"aria-orientation": l ? "vertical" : "horizontal",
			"aria-valuemin": i,
			"aria-valuemax": a,
			"aria-valuenow": Math.round(r),
			onPointerdown: (e) => {
				if (e.button !== 0) return;
				let n = e.currentTarget.parentElement?.getBoundingClientRect(), i = l ? n?.width : n?.height;
				i && (e.currentTarget.focus(), e.currentTarget.setPointerCapture(e.pointerId), t = {
					id: e.pointerId,
					start: l ? e.clientX : e.clientY,
					size: i,
					value: r
				});
			},
			onPointermove: (e) => {
				let n = t;
				if (n?.id !== e.pointerId) return;
				let r = l ? e.clientX : e.clientY;
				u(n.value + (r - n.start) * 100 / n.size);
			}
		}, { onLostpointercapture: () => {
			t = void 0;
		} }, { onKeydown: (e) => {
			let t = {
				Home: i,
				End: a,
				[l ? "ArrowLeft" : "ArrowUp"]: r - 3,
				[l ? "ArrowRight" : "ArrowDown"]: r + 3
			}[e.key];
			typeof t == "number" && (e.preventDefault(), u(t));
		} }), null);
	};
}, { props: [
	"axis",
	"value",
	"min",
	"max",
	"label",
	"controls",
	"onChange"
] }), GM = [
	"side",
	"wipe",
	"single"
], KM = {
	side: "M3 5h18v14H3z M12 5v14",
	wipe: "M3 5h18v14H3z M12 2v20 M8 12h8",
	single: "M3 5h18v14H3z M7 9h10v6H7z"
}, qM = (e, t, n) => Math.max(t, Math.min(n, e)), JM = /* @__PURE__ */ z((e) => {
	let { t } = Cf(), n = /* @__PURE__ */ P(null), r = /* @__PURE__ */ P(null), i = Cr(), a = /* @__PURE__ */ P(73), o = (e) => {
		a.value = e;
	}, s = /* @__PURE__ */ P(50), c = (e) => {
		s.value = e;
	}, l = /* @__PURE__ */ P("side"), u = (e) => {
		l.value = e;
	}, d = /* @__PURE__ */ P("after"), f = (e) => {
		d.value = e;
	}, p = /* @__PURE__ */ P(50), m = (e) => {
		p.value = e;
	}, h = /* @__PURE__ */ P(1), g = (e) => {
		h.value = e;
	}, _ = /* @__PURE__ */ P(!1), v = (e) => {
		_.value = e;
	}, y = /* @__PURE__ */ P({
		x: 0,
		y: 0
	}), b = (e) => {
		y.value = e;
	}, x, S;
	return zr(() => {
		S = document.activeElement;
		let e = n.value;
		e && !e.open && (typeof e.show == "function" ? e.show() : e.setAttribute("open", "")), r.value?.focus();
	}), Ur(() => {
		S?.isConnected && S.focus();
	}), () => {
		let { preview: S, title: C, description: w, details: T, parameters: E, status: D, onRefresh: O, onReset: k, onClose: A } = e, j = !!(S?.before && S.after && S.aligned), ee = l.value === "wipe" && !j ? "side" : l.value;
		function te(e) {
			e.button === 0 && e.isPrimary && (e.preventDefault(), e.currentTarget.setPointerCapture(e.pointerId), x = {
				id: e.pointerId,
				x: e.clientX,
				y: e.clientY,
				ox: y.value.x,
				oy: y.value.y
			});
		}
		function M(e) {
			let t = x;
			t?.id === e.pointerId && b({
				x: t.ox + e.clientX - t.x,
				y: t.oy + e.clientY - t.y
			});
		}
		function ne(e) {
			let t = e.currentTarget.parentElement?.getBoundingClientRect();
			t?.width && m(qM((e.clientX - t.left) * 100 / t.width, 0, 100));
		}
		let re = () => {
			v(!1), b({
				x: 0,
				y: 0
			}), g(1);
		}, ie = () => {
			re(), v(!0);
		}, ae = (e) => g(qM(h.value * e, .1, 16));
		function oe(e, n) {
			let r = S?.[e];
			return q("div", {
				class: "ap-inspector-layer",
				style: {
					"--ap-img-zoom": h.value,
					"--ap-img-x": y.value.x + "px",
					"--ap-img-y": y.value.y + "px",
					"--ap-native-width": S?.width + "px",
					"--ap-native-height": S?.height + "px",
					clipPath: n
				},
				"data-native": _.value
			}, [r ? q("img", {
				src: r,
				alt: t("nodePreview." + e),
				draggable: !1
			}, null) : q("span", null, [t("nodePreview.noImage")])]);
		}
		function se(e) {
			return q("div", za({
				class: "ap-inspector-pane",
				key: e,
				onPointerdown: te,
				onPointermove: M
			}, { onLostpointercapture: () => {
				x = void 0;
			} }), [oe(e), q("span", { class: "ap-inspector-label" }, [t("nodePreview." + e)])]);
		}
		return q(gr, { to: "body" }, { default: () => [q("dialog", za({
			ref: n,
			class: "astrophoto-ui ap-inspector",
			"aria-label": t("nodePreview.compare")
		}, { onCancel: A }, { onKeydown: (e) => {
			e.stopPropagation(), e.key === "Escape" && (e.preventDefault(), A());
		} }), [q("header", null, [q("div", { class: "ap-inspector-title" }, [q("strong", null, [C]), w && q(YM, { text: w }, null)]), q("button", {
			ref: r,
			type: "button",
			title: t("nodePreview.close"),
			"aria-label": t("nodePreview.close"),
			onClick: A
		}, [q("svg", {
			width: "16",
			height: "16",
			viewBox: "0 0 24 24",
			fill: "none",
			stroke: "currentColor",
			"aria-hidden": "true"
		}, [q("path", { d: "m6 6 12 12M18 6 6 18" }, null)])])]), q("div", {
			class: "ap-inspector-layout",
			style: { "--ap-view-share": a.value + "%" }
		}, [
			q("section", {
				id: i + "-view",
				class: "ap-inspector-view"
			}, [
				q("div", { class: "ap-inspector-toolbar" }, [q("div", { class: "ap-inspector-modes" }, [GM.map((e) => q("button", {
					key: e,
					type: "button",
					title: t("nodePreview." + e),
					"aria-label": t("nodePreview." + e),
					"aria-pressed": ee === e,
					disabled: e === "wipe" && !j,
					onClick: () => u(e)
				}, [q("svg", {
					width: "16",
					height: "16",
					viewBox: "0 0 24 24",
					fill: "none",
					stroke: "currentColor",
					"aria-hidden": "true"
				}, [q("path", { d: KM[e] }, null)])]))]), q("div", { class: "ap-inspector-zoom" }, [
					O && q("button", {
						type: "button",
						"aria-label": t("actions.refresh"),
						title: t("actions.refresh"),
						onClick: O
					}, [q("span", { "aria-hidden": "true" }, [J("↻")])]),
					ee === "single" && q("button", {
						type: "button",
						onClick: () => f(d.value === "before" ? "after" : "before")
					}, [t(d.value === "before" ? "nodePreview.after" : "nodePreview.before")]),
					q("button", {
						type: "button",
						title: t("nodePreview.zoomOut"),
						"aria-label": t("nodePreview.zoomOut"),
						onClick: () => ae(.8)
					}, [J("−")]),
					q("button", {
						type: "button",
						onClick: ie,
						"aria-pressed": _.value
					}, [_.value ? Math.round(h.value * 100) + "%" : "100%"]),
					q("button", {
						type: "button",
						title: t("nodePreview.zoomIn"),
						"aria-label": t("nodePreview.zoomIn"),
						onClick: () => ae(1.25)
					}, [J("+")]),
					q("button", {
						type: "button",
						onClick: re
					}, [t("nodePreview.fit")])
				])]),
				q("div", {
					class: "ap-inspector-images",
					"data-mode": ee,
					onDragstart: (e) => e.preventDefault(),
					onWheel: (e) => {
						e.stopPropagation(), ae(e.deltaY < 0 ? 1.12 : 1 / 1.12);
					}
				}, [
					ee === "side" && q(H, null, [se("before"), se("after")]),
					ee === "single" && se(d.value),
					ee === "wipe" && q("div", za({
						class: "ap-inspector-pane",
						onPointerdown: te,
						onPointermove: M
					}, { onLostpointercapture: () => {
						x = void 0;
					} }), [
						oe("after"),
						oe("before", `inset(0 ${100 - p.value}% 0 0)`),
						q("span", { class: "ap-inspector-label" }, [t("nodePreview.before")]),
						q("span", { class: "ap-inspector-label ap-inspector-end" }, [t("nodePreview.after")]),
						q("div", {
							class: "ap-inspector-divider",
							style: { left: p.value + "%" },
							tabindex: 0,
							role: "slider",
							"aria-label": t("nodePreview.wipe"),
							"aria-valuemin": 0,
							"aria-valuemax": 100,
							"aria-valuenow": Math.round(p.value),
							onPointerdown: (e) => {
								e.stopPropagation(), e.button === 0 && e.isPrimary && (e.preventDefault(), e.currentTarget.focus(), e.currentTarget.setPointerCapture(e.pointerId), ne(e));
							},
							onPointermove: (e) => {
								e.stopPropagation(), e.currentTarget.hasPointerCapture(e.pointerId) && ne(e);
							},
							onPointerup: (e) => {
								e.currentTarget.hasPointerCapture(e.pointerId) && e.currentTarget.releasePointerCapture(e.pointerId);
							},
							onKeydown: (e) => {
								let t = {
									ArrowLeft: p.value - 2,
									ArrowRight: p.value + 2,
									Home: 0,
									End: 100
								};
								e.key in t && (e.preventDefault(), e.stopPropagation(), m(qM(t[e.key], 0, 100)));
							}
						}, null)
					])
				]),
				!j && S?.before && S.after && q("small", null, [t("nodePreview.unaligned")])
			]),
			q(WM, {
				axis: "x",
				label: t("nodePreview.adjustWidth"),
				controls: i + "-view",
				value: a.value,
				min: 40,
				max: 80,
				onChange: o
			}, null),
			q("aside", {
				class: "ap-inspector-info",
				style: { "--ap-analysis-share": s.value + "%" }
			}, [
				q("section", { id: i + "-analysis" }, [q("h3", null, [t("nodePreview.analysis")]), q("p", null, [t("nodePreview.analysisEmpty")])]),
				q(WM, {
					axis: "y",
					label: t("nodePreview.adjustHeight"),
					controls: i + "-analysis",
					value: s.value,
					min: 15,
					max: 75,
					onChange: c
				}, null),
				q("section", null, [
					q("div", { class: "ap-inspector-parameters-header" }, [q("h3", null, [t(E ? "nodePreview.parameters" : "nodePreview.readonly")]), k && q("button", {
						type: "button",
						title: t("nodePreview.reset"),
						"aria-label": t("nodePreview.reset"),
						onClick: k
					}, [q("span", { "aria-hidden": "true" }, [J("↶")])])]),
					E,
					(!!T?.length || D) && q("dl", null, [T?.map(({ label: e, value: t }) => q("div", {
						class: "ap-inspector-value",
						key: e
					}, [q("dt", null, [e]), q("dd", null, [t])])), D && q(H, null, [q("dt", null, [t("nodePreview.status")]), q("dd", { role: "status" }, [D])])])
				])
			])
		])])] });
	};
}, { props: [
	"preview",
	"title",
	"description",
	"details",
	"parameters",
	"status",
	"onRefresh",
	"onReset",
	"onClose"
] });
function YM({ text: e }) {
	return q("span", {
		class: "ap-inspector-help",
		role: "img",
		tabindex: 0,
		"aria-label": e,
		title: e
	}, [q("span", { "aria-hidden": "true" }, [J("ⓘ")])]);
}
// src/features/nodes/preview/NodePreview.tsx
var XM = /* @__PURE__ */ z((e) => {
	let { t } = Cf(), n = Cr();
	return () => {
		let { expanded: r, images: i, status: a, badge: o, imageClassName: s = "", onToggle: c, onCompare: l, onRefresh: u, onReset: d } = e, f = t("actions.refresh"), p = t("nodePreview.reset");
		return q(H, null, [q("div", { class: "ap-node-preview-toolbar" }, [
			q("button", {
				type: "button",
				"aria-controls": n,
				"aria-expanded": r,
				onClick: c
			}, [q("svg", {
				viewBox: "0 0 24 24",
				"aria-hidden": "true"
			}, [q("path", { d: "m9 6 6 6-6 6" }, null)]), t("nodePreview.preview")]),
			q("button", {
				class: "ap-node-compare",
				type: "button",
				"aria-haspopup": "dialog",
				"aria-label": t("nodePreview.openImage"),
				title: t("nodePreview.openImage"),
				onClick: l
			}, [q("svg", {
				viewBox: "0 0 24 24",
				"aria-hidden": "true"
			}, [q("path", { d: "M3 4h18v16H3z M3 16l5-5 4 4 3-3 6 5" }, null)])]),
			u && q("button", {
				type: "button",
				title: f,
				"aria-label": f,
				onClick: u
			}, [q("svg", {
				viewBox: "0 0 24 24",
				"aria-hidden": "true"
			}, [q("path", { d: "M20 7v5h-5M4 17v-5h5M5.5 8a7 7 0 0 1 11-2l3.5 6m-16 0 3.5 6a7 7 0 0 0 11-2" }, null)])]),
			d && q("button", {
				type: "button",
				title: p,
				"aria-label": p,
				onClick: d
			}, [q("svg", {
				viewBox: "0 0 24 24",
				"aria-hidden": "true"
			}, [q("path", { d: "M3 11h5M3 11V6m0 5 4-4a7 7 0 1 1-1 10" }, null)])])
		]), q("div", {
			id: n,
			class: `ap-canvas-preview ${s}`,
			hidden: !r
		}, [r && (i?.after ? q(H, null, [q("img", {
			src: i.after,
			width: i.width,
			height: i.height,
			alt: t("nodePreview.after"),
			draggable: !1
		}, null), o && q("small", { class: "ap-node-preview-badge" }, [o])]) : q("span", { role: "status" }, [a]))])]);
	};
}, { props: [
	"expanded",
	"images",
	"status",
	"badge",
	"imageClassName",
	"onToggle",
	"onCompare",
	"onRefresh",
	"onReset"
] }), ZM = "AstroPhotoFITSSource", QM = "AstroPhotoAssetSource", $M = "AstroPhotoImagePath", eN = /* @__PURE__ */ new WeakMap(), tN = /* @__PURE__ */ new WeakMap(), nN = /* @__PURE__ */ new WeakMap(), rN = /* @__PURE__ */ new WeakMap();
function iN(e) {
	return {
		widgetKey: JSON.stringify(e.widgets?.filter((e) => !e.name.startsWith("astrophoto_")).map((e) => [e.name, e.value])),
		inputs: (e.inputs ?? []).map((t, n) => e.getInputNode(n))
	};
}
function aN() {
	let e = crypto.getRandomValues(/* @__PURE__ */ new Uint8Array(16));
	e[6] = e[6] & 15 | 64, e[8] = e[8] & 63 | 128;
	let t = Array.from(e, (e) => e.toString(16).padStart(2, "0")).join("");
	return [
		t.slice(0, 8),
		t.slice(8, 12),
		t.slice(12, 16),
		t.slice(16, 20),
		t.slice(20)
	].join("-");
}
function oN(e, t) {
	return Object.fromEntries(t.parameters.map((t) => {
		let n = e.widgets?.find((e) => e.name === t.name)?.value, r = typeof t.default == "boolean" ? typeof n == "boolean" ? n : t.default : typeof n == "number" ? n : t.default;
		return [t.name, r];
	}));
}
function sN(e, t, n = !1) {
	return JSON.stringify(Object.fromEntries(e.parameters.map((e) => [e.name, n && e.rgb_only ? !1 : t[e.name]])));
}
function cN(e, t = /* @__PURE__ */ new Set()) {
	if (t.has(e)) return "";
	t.add(e);
	let n = e.getInputNode(0);
	if (n && (n.comfyClass === ZM || n.comfyClass === QM)) return String(n.widgets?.find((e) => e.name === "asset_id")?.value || "");
	if (n?.comfyClass === $M) return String(n.widgets?.find((e) => e.name === "image_path")?.value || "");
	let r = n && rN.get(n);
	if (r) {
		let e = iN(n);
		if (e.widgetKey === r.widgetKey && e.inputs.length === r.inputs.length && e.inputs.every((e, t) => e === r.inputs[t])) return r.path;
	}
	let i = n && nN.get(n);
	if (n && i?.preview) {
		let e = eN.get(n);
		if (e?.verifiedSource && e.key === sN(i, oN(n, i), e.mono) && e.verifiedSource === cN(n, t)) return e.asset;
	}
	return "";
}
function lN(e) {
	e?.before && URL.revokeObjectURL(e.before), e?.after && URL.revokeObjectURL(e.after);
}
var uN = /* @__PURE__ */ z((e) => {
	let { locale: t, t: n } = Cf(), { node: r, command: i, execution: a, canvas: o } = e, s = Object.fromEntries(i.parameters.map((e) => [e.name, e.default])), c = i.parameters.length ? () => T(s) : void 0, l = aN(), u = /* @__PURE__ */ P(!0), d = /* @__PURE__ */ P(!1), f = /* @__PURE__ */ P(0), p = /* @__PURE__ */ F({
		asset: "",
		key: sN(i, oN(r, i)),
		formal: "",
		connected: !1
	}), m = /* @__PURE__ */ F();
	R(() => m.value?.error, (e) => {
		e && Uv("error", n("siril.states." + e, e));
	});
	let h = /* @__PURE__ */ F(), g = /* @__PURE__ */ P(""), _ = /* @__PURE__ */ P(!1), v = /* @__PURE__ */ F(), y = /* @__PURE__ */ F(/* @__PURE__ */ new Set()), b = bT();
	R(b.error, (e) => {
		e && Uv("error", n("siril.states." + e, e));
	});
	let x = () => {
		f.value += 1;
	};
	R(() => e.node, (e, t, n) => {
		let o = () => {
			if (!r.graph) return;
			let e = cN(r);
			v.value = tN.get(r);
			let t = sN(i, oN(r, i)), n = eN.get(r), a = h.value?.asset === e && h.value?.channels === 1 ? sN(i, oN(r, i), !0) : t, o = e && (n?.key === t || n?.key === a) && (n.receiptSource === e || n.observedSource === e) ? n.asset : "", s = r.isInputConnected(0), c = p.value;
			(c.asset !== e || c.key !== t || c.formal !== o || c.connected !== s) && (p.value = {
				asset: e,
				key: t,
				formal: o,
				connected: s
			});
		}, s = window.setInterval(o, 200);
		xA.addEventListener("change", x), a.addEventListener("changed", o), o(), n(() => {
			clearInterval(s), xA.removeEventListener("change", x), a.removeEventListener("changed", o);
		});
	}, { immediate: !0 });
	let S = X(() => {
		let { asset: e, key: t, formal: n } = p.value;
		return JSON.stringify([
			e,
			t,
			n,
			f.value
		]);
	}), C = X(() => g.value === S.value ? m.value : void 0);
	R(S, (e, t, n) => {
		let { asset: o, key: s, formal: c } = p.value;
		if (m.value = void 0, _.value = !!o, !o) return;
		let u = new AbortController(), d, f = window.setTimeout(() => {
			UM(i.id, o, l, JSON.parse(s), u.signal, c || void 0).then((t) => {
				if (u.signal.aborted) {
					lN(t);
					return;
				}
				let n = eN.get(r);
				if (c && n?.asset === c) {
					if (t.formal) n.verifiedSource = o, n.mono = t.channels === 1, n.key = sN(i, JSON.parse(s), n.mono);
					else if (t.error === "PREVIEW_STALE") {
						lN(t), eN.delete(r), a.dispatchEvent(new Event("changed"));
						return;
					}
				}
				d = t, m.value = t, g.value = e, _.value = !1, h.value = {
					asset: o,
					channels: t.channels
				};
			}, (t) => {
				u.signal.aborted || (m.value = {
					state: "failed",
					error: t instanceof Q ? t.code : "network"
				}, g.value = e, _.value = !1);
			});
		}, 400);
		n(() => {
			clearTimeout(f), u.abort(), lN(d);
		});
	}, { immediate: !0 }), R([C, () => u.value || d.value], ([e, t], n, r) => {
		if (!e?.jobId || !e.before || !t) return;
		let i = e.jobId, a = new AbortController(), o = window.setInterval(() => {
			document.hidden || NM(i, a.signal).catch((t) => {
				a.signal.aborted || m.value?.jobId !== i || (lN(e), m.value = {
					state: "failed",
					error: t instanceof Q ? t.code : "PREVIEW_STALE"
				});
			});
		}, 8e3);
		r(() => {
			clearInterval(o), a.abort();
		});
	});
	let w = X(() => h.value?.asset === p.value.asset && h.value?.channels === 1);
	R(w, (e, t, n) => {
		let a = i.parameters.find((e) => e.rgb_only), o = a && r.widgets?.find((e) => e.name === a.name);
		if (!o) return;
		let s = o.disabled;
		o.disabled = e, r.graph && r.setDirtyCanvas(!0, !0), n(() => {
			o.disabled = s;
		});
	}, { immediate: !0 });
	function T(e) {
		let t = r.graph, n = o();
		if (!t || n?.read_only || n?.selectOnly) return;
		let i = Object.entries(e).flatMap(([e, t]) => {
			let n = r.widgets?.find((t) => t.name === e);
			return n && n.value !== t ? [{
				name: e,
				value: t,
				widget: n
			}] : [];
		});
		if (i.length) {
			t.beforeChange(r), n?.emitBeforeChange();
			try {
				for (let { name: e, value: t, widget: n } of i) {
					let i = n.value;
					n.value = t, r.onWidgetChanged?.(e, t, i, n);
				}
				t.change(), r.setDirtyCanvas(!0, !0);
			} finally {
				t.afterChange(r), n?.emitAfterChange();
			}
		}
	}
	function E(e) {
		b.run(async (t) => {
			await PM(e, t), t.aborted || (y.value = /* @__PURE__ */ new Set([...y.value, e]));
		});
	}
	return () => {
		let { asset: e, key: a, connected: o } = p.value, s = v.value ?? [], l = C.value, f = e ? _.value || !l ? n("siril.rendering") : l.error ? n("siril.states." + l.error, l.error) : n(l.formal ? "siril.formal" : "siril.candidate") : n(o ? "siril.upstream" : "siril.noInput"), m = JSON.parse(a);
		return q(H, null, [
			q(DM, {
				command: i,
				disclose: !0
			}, null),
			q(XM, {
				expanded: u.value,
				images: l,
				status: f,
				imageClassName: "ap-siril-main",
				badge: l ? n(l.formal ? "siril.formal" : "siril.candidate") : void 0,
				onToggle: () => {
					u.value = !u.value;
				},
				onCompare: () => {
					d.value = !0;
				},
				onRefresh: e ? x : void 0,
				onReset: c
			}, null),
			d.value && q(JM, {
				preview: l,
				title: r.title || i.title,
				description: EM(i, t.value),
				onRefresh: e ? x : void 0,
				onReset: c,
				parameters: q("div", { class: "ap-inspector-fields" }, [
					i.parameters.map((e) => {
						let t = "siril.commands." + i.id + "." + e.name, r = n(t, e.label), a = n(t + "Help", e.help), o = e.rgb_only && w.value;
						return typeof e.default == "number" ? q(dN, {
							key: e.name,
							label: r,
							help: a,
							value: Number(m[e.name]),
							min: e.min ?? void 0,
							max: e.max ?? void 0,
							onChange: (t) => T({ [e.name]: t })
						}, null) : q("label", {
							key: e.name,
							class: "ap-inspector-toggle"
						}, [q("span", null, [
							r,
							J(" "),
							q(YM, { text: a }, null)
						]), q("input", {
							type: "checkbox",
							role: "switch",
							checked: !!m[e.name] && !o,
							disabled: o,
							title: o ? n("siril.mono") : a,
							onChange: (t) => T({ [e.name]: t.currentTarget.checked })
						}, null)]);
					}),
					s.map((e) => q("button", {
						type: "button",
						key: e,
						class: "ap-storage-button",
						title: e,
						disabled: b.pending.value || y.value.has(e),
						onClick: () => E(e)
					}, [y.value.has(e) ? n("siril.addedToAssets") : n("siril.addToAssets"), s.length > 1 && " · " + e.slice(0, 8)])),
					b.error.value && q("small", { role: "alert" }, [n("siril.states." + b.error.value, b.error.value)])
				]),
				onClose: () => {
					d.value = !1;
				}
			}, null)
		]);
	};
}, { props: [
	"node",
	"command",
	"execution",
	"canvas"
] }), dN = /* @__PURE__ */ z((e) => {
	let t = /* @__PURE__ */ P();
	return () => q("label", null, [q("span", null, [
		e.label,
		J(" "),
		q(YM, { text: e.help }, null)
	]), q("input", {
		type: "number",
		value: t.value ?? e.value,
		min: e.min,
		max: e.max,
		step: .01,
		onBlur: () => {
			t.value = void 0;
		},
		onInput: (n) => {
			let r = n.currentTarget, i = r.valueAsNumber;
			t.value = r.value, Number.isFinite(i) && (e.min === void 0 || i >= e.min) && (e.max === void 0 || i <= e.max) && e.onChange(i);
		}
	}, null)]);
}, { props: [
	"label",
	"help",
	"value",
	"min",
	"max",
	"onChange"
] });
function fN(e, t, n, r) {
	let i = document.createElement("div");
	i.className = "astrophoto-ui ap-siril-widget ap-siril-preview-widget";
	let a = document.createElement("div");
	a.className = "ap-siril-preview-content", i.append(a);
	let o = 264, s = n.addDOMWidget("astrophoto_preview", "astrophoto-scientific-preview", i, {
		serialize: !1,
		hideOnZoom: !1,
		getMinHeight: () => o,
		getMaxHeight: () => o
	});
	s.serialize = !1, hM(s);
	let c = new ResizeObserver(() => {
		if (!n.graph) return;
		let e = a.offsetHeight;
		e && e !== o && (o = e, n.setSize([n.size[0], n.computeSize()[1]]), n.setDirtyCanvas(!0, !0));
	}), l = new EventTarget(), u = n.onExecuted, d = function(e) {
		u?.call(this, e);
		let t = e;
		t.astrophoto_output?.length && tN.set(n, t.astrophoto_output);
		let i = t.astrophoto_output ?? t.astrophoto_asset;
		eN.delete(n), i?.length === 1 && i[0] && t.astrophoto_source?.[0] && t.astrophoto_parameters?.[0] && eN.set(n, {
			asset: i[0],
			receiptSource: t.astrophoto_source[0],
			observedSource: cN(n),
			key: sN(r, t.astrophoto_parameters[0])
		}), l.dispatchEvent(new Event("changed"));
	};
	n.onExecuted = d;
	let f = bM(e, a, uN, {
		node: n,
		command: r,
		execution: l,
		canvas: () => e.canvas
	}, t);
	c.observe(a, { box: "border-box" });
	let p = s.onRemove;
	s.onRemove = () => {
		c.disconnect(), n.onExecuted === d && (n.onExecuted = u), f(), eN.delete(n), tN.delete(n), p?.call(s);
	};
	let m = CA() + 8 + 2 * s.margin;
	n.setSize([Math.max(n.size[0], m), Math.max(n.size[1], 395)]);
}
function pN(e, t, n, r) {
	let i = document.createElement("div");
	i.className = "astrophoto-ui ap-siril-widget";
	let a = document.createElement("div");
	i.append(a);
	let o = 52, s = n.addDOMWidget("astrophoto_command_details", "astrophoto-siril-details", i, {
		serialize: !1,
		hideOnZoom: !1,
		getMinHeight: () => o,
		getMaxHeight: () => o
	});
	s.serialize = !1, hM(s);
	let c = bM(e, a, DM, {
		command: r,
		disclose: !0
	}, t), l = new ResizeObserver(() => {
		let e = a.offsetHeight;
		n.graph && e && o !== e && (o = e, n.setSize([n.size[0], n.computeSize()[1]]), n.setDirtyCanvas(!0, !0));
	});
	l.observe(a, { box: "border-box" });
	let u = s.onRemove;
	s.onRemove = () => {
		l.disconnect(), c(), u?.call(s);
	}, n.setSize([n.size[0], n.computeSize()[1]]);
}
function mN(e, t) {
	let n = t.onExecuted, r, i = document.createElement("textarea");
	i.readOnly = !0, i.className = "astrophoto-ui ap-siril-log", t.onExecuted = function(a) {
		n?.call(this, a);
		let o = a, s = o.astrophoto_siril_path?.[0];
		if (s ? rN.set(t, {
			path: s,
			...iN(t)
		}) : rN.delete(t), o.astrophoto_siril_log?.[0]) {
			if (i.value = o.astrophoto_siril_log[0], !r) {
				r = t.addDOMWidget("astrophoto_siril_log", "astrophoto-siril-log", i, {
					serialize: !1,
					getMinHeight: () => 120,
					getMaxHeight: () => 120
				}), r.serialize = !1, hM(r);
				let n = Kj(e, i, (e) => {
					i.setAttribute("aria-label", e === "zh" ? "CLI 日志" : "CLI log");
				}), a = r.onRemove;
				r.onRemove = () => {
					n(), a?.call(r);
				}, t.setSize(t.computeSize());
			}
			t.setDirtyCanvas(!0, !0);
		}
	};
}
function hN(e, t) {
	e.registerExtension({
		name: "AstroPhoto.Siril",
		async nodeCreated(n) {
			if (!n.comfyClass?.startsWith("AstroPhotoSiril")) return;
			let r = n.onRemoved, i = !1, a = function() {
				i = !0, r?.call(this);
			};
			n.onRemoved = a;
			let o = await MM().then((e) => e.find((e) => e.node_id === n.comfyClass), () => void 0);
			n.onRemoved === a && (n.onRemoved = r), o && !i && (nN.set(n, o), [
				o.id,
				o.title,
				o.title_zh
			].map((e) => "Siril · " + e).includes(n.title) && (n.title = TM(o, Wj(e.extensionManager.setting.get("Comfy.Locale")))), o.preview ? fN(e, t, n, o) : (pN(e, t, n, o), mN(e, n)));
		}
	});
}
// ../extension/siril/frontend/SirilCommands.tsx
var gN = /* @__PURE__ */ z(() => {
	let { locale: e, t } = Cf(), { resource: n, refresh: r } = Xy(MM, !0);
	R(n, (e) => {
		e.state === "error" && Uv("error", t("siril.catalogue.unavailable"));
	});
	let i = /* @__PURE__ */ P(""), a = X(() => {
		let t = /* @__PURE__ */ new Map();
		if (n.value.state !== "ready") return t;
		let r = i.value.toLowerCase().trim();
		for (let i of n.value.data) {
			if (![
				i.id,
				i.title,
				i.title_zh,
				i.usage,
				i.node_id,
				i.category,
				i.category_zh,
				...i.search_aliases ?? []
			].some((e) => e?.toLowerCase().includes(r))) continue;
			let n = i.category?.replace(/^AstroPhoto\/Siril\//, "").split("/") ?? ["Siril"], a = e.value === "zh" ? i.category_zh?.split("/") : void 0, o = t;
			n.forEach((t, r) => {
				let s = o.get(t);
				s || (s = {
					label: a?.[r] ?? hy(t, e.value),
					commands: [],
					children: /* @__PURE__ */ new Map()
				}, o.set(t, s)), r === n.length - 1 && s.commands.push(i), o = s.children;
			});
		}
		return t;
	});
	function o(n, r = !1) {
		let i = r ? "h5" : "h4";
		return [...n].map(([n, r]) => q("section", {
			key: n,
			class: "ap-siril-command-group"
		}, [
			q(i, null, { default: () => [r.label] }),
			r.commands.length > 0 && q("ul", null, [r.commands.map((n) => q("li", { key: n.id }, [q("details", null, [q("summary", null, [
				TM(n, e.value),
				" ",
				q("code", null, [n.id]),
				q("small", null, [t(n.scriptable ? "siril.catalogue.node" : "siril.catalogue.gui")])
			]), q(DM, { command: n }, null)])]))]),
			o(r.children, !0)
		]));
	}
	return () => q("section", { class: "ap-software-section ap-siril-commands" }, [
		q(zv, {
			label: t("siril.catalogue.search"),
			clearLabel: t("actions.clear"),
			onSearch: (e) => {
				i.value = e;
			}
		}, null),
		n.value.state === "loading" && q("p", { role: "status" }, [t("states.loading")]),
		n.value.state === "error" && q("p", { role: "alert" }, [
			t("siril.catalogue.unavailable"),
			" ",
			q("button", {
				type: "button",
				class: "ap-storage-button",
				onClick: r
			}, [t("actions.refresh")])
		]),
		n.value.state === "ready" && (a.value.size ? o(a.value) : q("p", { role: "status" }, [t("siril.catalogue.empty")]))
	]);
});
// ../extension/frontend-entry.ts
wM(e, [{
	id: "siril",
	summary: /* @__PURE__ */ z((e) => {
		let { t } = Cf(), { resource: n } = Xy(IM, !0);
		R(n, (e) => {
			e.state === "error" && Uv("error", t("siril.states.network"));
		});
		let r = /* @__PURE__ */ F(), i = /* @__PURE__ */ P();
		R(i, (e) => {
			e && Uv("error", t("siril.states." + e, t("errors.unknown")));
		});
		let a, o = /* @__PURE__ */ P(!1);
		Ur(() => a?.abort());
		async function s(e) {
			if (o.value) return;
			let t = new AbortController();
			a = t, o.value = !0, i.value = void 0;
			try {
				let n = await zM(e, t.signal);
				t.signal.aborted || (r.value = n);
			} catch (e) {
				t.signal.aborted || (i.value = e instanceof Q ? e.code : "network");
			} finally {
				t.signal.aborted || (o.value = !1, a = void 0);
			}
		}
		return () => {
			let a = r.value ?? (n.value.state === "ready" ? n.value.data : void 0);
			return q(H, null, [q("div", { class: "ap-software-item" }, [q("button", {
				type: "button",
				class: "ap-software-open",
				onClick: e.onOpen
			}, [q("span", {
				class: "ap-software-item-icon",
				"aria-hidden": "true"
			}, [J("▣")]), q("span", { class: "ap-software-item-copy" }, [
				q("strong", null, [J("Siril")]),
				q("small", null, [t("siril.purpose")]),
				q("small", { class: "ap-software-status" }, [q("span", {
					class: "ap-software-dot",
					"data-state": a ? a.state === "ready" ? "ready" : "error" : "unknown"
				}, null), a ? a.state === "ready" ? t("software.ready") : t("siril.states." + a.state, a.state) : t(n.value.state === "error" ? "siril.states.network" : "states.loading")])
			])]), q("label", { class: "ap-software-switch" }, [
				q("span", { class: "ap-software-switch-label" }, [t("software.enabled")]),
				q("input", {
					type: "checkbox",
					role: "switch",
					"aria-label": t("software.enableNamed", { name: "Siril" }),
					checked: !!a?.enabled,
					disabled: o.value || !a || a.state !== "ready" && !a.enabled,
					onChange: (e) => void s(e.currentTarget.checked)
				}, null),
				q("span", {
					class: "ap-software-switch-track",
					"aria-hidden": "true"
				}, [q("span", null, null)])
			])]), i.value && q("p", { role: "alert" }, [t("siril.states." + i.value, t("errors.unknown"))])]);
		};
	}, { props: ["onOpen"] }),
	settings: /* @__PURE__ */ z(() => {
		let { t: e } = Cf(), { resource: t, refresh: n } = Xy(IM, !0);
		R(t, (t) => {
			t.state === "error" && Uv("error", e("siril.states.network"));
		});
		let r = /* @__PURE__ */ F(), i = /* @__PURE__ */ P(!1), a = /* @__PURE__ */ P(""), o = /* @__PURE__ */ F(), s = /* @__PURE__ */ P(!1), c = /* @__PURE__ */ F(), l;
		Ur(() => l?.abort());
		let u = (t) => e("siril.states." + t, t);
		R(c, (e) => {
			e && Uv("error", u(e.code));
		});
		async function d(e) {
			l?.abort();
			let t = new AbortController();
			l = t, c.value = void 0, s.value = !0;
			try {
				await e(t.signal);
			} catch (e) {
				if (!t.signal.aborted) {
					let t = e instanceof Q ? e.details?.detected : void 0;
					c.value = {
						code: e instanceof Q ? e.code : "network",
						detected: typeof t == "string" ? t : void 0
					};
				}
			} finally {
				l === t && (l = void 0, s.value = !1);
			}
		}
		return () => {
			let l = r.value ?? (t.value.state === "ready" ? t.value.data : void 0);
			return q(H, null, [
				q("div", { class: "ap-software-title" }, [q("div", null, [q("h3", null, [J("Siril")]), q("small", null, [e("siril.purpose")])]), q("span", { class: "ap-software-version" }, [J("1.4.5")])]),
				q("section", { class: "ap-software-section" }, [q("p", {
					class: "ap-software-status",
					role: "status"
				}, [q("span", {
					class: "ap-software-dot",
					"data-ready": l?.state === "ready"
				}, null), l ? u(l.state) : e(t.value.state === "error" ? "siril.states.network" : "states.loading")]), l?.path && q("dl", { class: "ap-software-metadata" }, [
					q("dt", null, [e("siril.activePath")]),
					q("dd", null, [l.path]),
					q("dt", null, [e("siril.version")]),
					q("dd", null, [l.version]),
					q("dt", null, [e("siril.verified")]),
					q("dd", null, [l.verified_at ? new Date(l.verified_at).toLocaleString() : "—"])
				])]),
				q("section", { class: "ap-software-section" }, [q("button", {
					type: "button",
					class: "ap-storage-button",
					"aria-expanded": i.value,
					onClick: () => {
						i.value = !i.value;
					}
				}, [e("siril.catalogue.title")]), i.value && q(gN, null, null)]),
				q("section", { class: "ap-software-section ap-software-guide" }, [
					q("h3", null, [e("siril.install")]),
					q("p", null, [e("siril.install" + (l?.os === "Windows" ? "Windows" : l?.os === "Darwin" ? "Mac" : "Linux"))]),
					q("a", {
						href: "https://siril.org/download/",
						target: "_blank",
						rel: "noreferrer"
					}, [e("siril.download")]),
					" · ",
					q("a", {
						href: "https://siril.org/download/2026-10-28-siril-1-4-5/",
						target: "_blank",
						rel: "noreferrer"
					}, [e("siril.release")])
				]),
				q("section", { class: "ap-software-section" }, [q("div", { class: "ap-siril-actions" }, [q("button", {
					class: "ap-storage-button",
					type: "button",
					disabled: s.value,
					onClick: () => void d(async (e) => {
						o.value = await BM(e);
					})
				}, [e("siril.detect")]), q("button", {
					class: "ap-storage-button",
					type: "button",
					disabled: s.value,
					onClick: () => {
						r.value = void 0, o.value = void 0, n();
					}
				}, [e("actions.refresh")])]), o.value && (o.value.length ? q("ul", { class: "ap-software-candidates" }, [o.value.map((t) => q("li", { key: t.path }, [
					q("button", {
						class: "ap-storage-button",
						type: "button",
						disabled: s.value || t.state !== "ready",
						onClick: () => {
							a.value = t.path;
						}
					}, [e("siril.select")]),
					" ",
					q("code", null, [t.path]),
					J(" · "),
					t.origin,
					J(" · "),
					t.version ?? t.detected,
					" ",
					J("· "),
					u(t.state)
				]))]) : q("p", { class: "ap-software-muted" }, [e("software.noCandidates")]))]),
				q("section", { class: "ap-software-section" }, [
					q("form", { onSubmit: (e) => {
						e.preventDefault(), d(async (e) => {
							r.value = await LM(a.value.trim() || l?.path || "", e);
						});
					} }, [
						q("label", null, [e("siril.path"), q("input", {
							value: a.value,
							onInput: (e) => {
								a.value = e.currentTarget.value;
							},
							placeholder: l?.path,
							disabled: s.value
						}, null)]),
						q("small", null, [e("siril.pathHelp")]),
						q("div", { class: "ap-siril-actions" }, [q("button", {
							class: "ap-storage-button",
							"data-variant": "primary",
							disabled: s.value || !(a.value.trim() || l?.path)
						}, [e("siril.save")]), l?.path && q("button", {
							class: "ap-storage-button",
							type: "button",
							disabled: s.value,
							onClick: () => void d(async (e) => {
								r.value = await RM(e), a.value = "";
							})
						}, [e("siril.clear")])])
					]),
					s.value && q("p", { role: "status" }, [e("siril.verifying")]),
					c.value && q("p", { role: "alert" }, [u(c.value.code), c.value.detected && ` · ${e("siril.version")} ${c.value.detected}`])
				])
			]);
		};
	}),
	messages: {
		en: { siril: {
			shadowsHelp: "Set shadow clipping in units of background noise standard deviation.",
			targetHelp: "Set the target background brightness after stretching, from 0 to 1.",
			linkedHelp: "Link RGB channels to preserve their relative balance. Unlinked stretching can change white balance. Not applicable to monochrome images.",
			purpose: "Astronomical image processing · Siril CLI",
			activePath: "Active CLI path",
			version: "Detected version",
			verified: "Last checked",
			install: "Installation guide",
			installWindows: "Download the Windows UCRT64 installer or portable 1.4.5 archive. For the portable version, keep the complete extracted folder together and locate bin/siril-cli.exe.",
			installMac: "Choose the 1.4.5 Intel or Apple Silicon package for macOS Ventura 13 or later. Find and verify its CLI. Homebrew may install a different version.",
			installLinux: "Select an official 1.4.5 AppImage or a package that exposes a local CLI. Distribution packages may be older. Flatpak may restrict host CLI access.",
			download: "Official downloads",
			release: "1.4.5 release notes",
			detect: "Detect installed Siril",
			select: "Select",
			path: "Siril CLI executable path",
			pathHelp: "Enter the full executable path on the ComfyUI server, such as siril-cli.exe. Preserve the installation folder and use a trusted official binary.",
			save: "Verify and save",
			clear: "Clear configuration",
			verifying: "Checking Siril and running the AutoStretch capability probe…",
			inspector: "Inspector",
			close: "Close",
			compare: "Before and after",
			side: "Side by side",
			wipe: "Sliding divider",
			single: "Single image",
			fit: "Fit",
			zoomOut: "Zoom out",
			zoomIn: "Zoom in",
			before: "Before",
			after: "After",
			noImage: "No image available",
			linearPreview: "Linear display proxy",
			unaligned: "Wipe requires aligned images with matching coordinates.",
			analysis: "Image analysis",
			analysisEmpty: "Image analysis is pending.",
			readonly: "Node parameters · read only",
			shadows: "Shadows clip",
			target: "Target background",
			linked: "Link RGB channels",
			mono: "Not applicable to monochrome input.",
			on: "On",
			off: "Off",
			status: "Status",
			canvasParameters: "Change parameters on the Canvas Node.",
			help: "AutoStretch help",
			nodeHelp: "AutoStretch changes the scientific pixels with a nonlinear stretch. Shadows clip is in standard deviations. Target background is a normalized value from 0 to 1.",
			rgbRisk: "Unlinked RGB stretching can alter white balance.",
			reset: "Reset parameters",
			preview: "Stretched Image preview",
			upstream: "Select a FITS asset or execute the upstream node.",
			noInput: "Connect a science frame.",
			rendering: "Rendering candidate…",
			formal: "Formal result",
			addToAssets: "Add to Assets",
			addedToAssets: "Added to Assets",
			candidate: "Candidate preview",
			running: "Formal processing…",
			stale: "Formal result needs updating",
			needsRun: "Queue the workflow for a formal FITS result.",
			states: {
				SIRIL_DISABLED: "Siril is disabled.",
				ready: "Siril 1.4.5 · CLI and AutoStretch verified",
				network: "Cannot reach the Siril service.",
				timeout: "The request timed out.",
				schema: "Unexpected response from the Siril service.",
				cancelled: "Processing cancelled.",
				SIRIL_NOT_CONFIGURED: "Siril has not been configured.",
				SIRIL_NOT_FOUND: "Siril CLI was not found.",
				SIRIL_GUI_ONLY: "A Siril GUI was found. The CLI executable is required.",
				SIRIL_EXECUTABLE_INVALID: "Use a valid, accessible Siril CLI executable.",
				SIRIL_VERSION_MISMATCH: "This release requires Siril 1.4.5.",
				SIRIL_OPERATION_UNSUPPORTED: "The CLI did not pass the AutoStretch capability probe.",
				SIRIL_REVALIDATION_REQUIRED: "The Siril executable changed. Verify it again.",
				SIRIL_RUN_FAILED: "Siril processing failed.",
				SIRIL_RUN_TIMEOUT: "Siril exceeded its processing timeout.",
				SIRIL_BUSY: "Siril is busy. Retry when the running request finishes.",
				SOURCE_NOT_FOUND: "The input or result file is missing.",
				SOURCE_CHANGED: "The input changed during processing.",
				ASSET_NOT_FOUND: "The registered asset could not be found.",
				WORKSPACE_OFFLINE: "The Workspace is offline.",
				PREVIEW_STALE: "The display result expired or its input changed.",
				PREVIEW_CANCELLED: "Candidate preview cancelled.",
				PREVIEW_FAILED: "Candidate preview failed.",
				PREVIEW_SIZE_LIMIT: "The FITS exceeds the candidate preview size limit.",
				CACHE_LIMIT_EXCEEDED: "The configured cache limit was reached.",
				CACHE_IDENTITY_MISMATCH: "The active cache cannot be verified.",
				STORAGE_BUSY: "Storage is busy. Try again.",
				STORAGE_UNAVAILABLE: "AstroPhoto storage is unavailable.",
				UNAUTHORIZED_STORAGE_OPERATION: "This operation requires direct, trusted local access.",
				FITS_INVALID: "The asset is not a valid single-frame FITS.",
				FITS_SIZE_LIMIT: "The FITS exceeds the supported pixel limit.",
				FITS_UNSUPPORTED_PRECISION: "This FITS encoding is not supported by the Siril pipeline.",
				FITS_DEPENDENCY_UNAVAILABLE: "FITS decoding dependencies are unavailable.",
				INSUFFICIENT_DISK_SPACE: "There is insufficient disk space.",
				SIRIL_OUTPUT_INVALID: "Siril returned an invalid scientific output."
			},
			catalogue: {
				title: "Siril commands",
				search: "Search Siril commands",
				node: "ComfyUI node",
				gui: "Not scriptable",
				build: "Requires a Siril build with {feature}",
				empty: "No matching commands.",
				unavailable: "The command catalogue could not be loaded.",
				usage: "Command syntax",
				requirements: "Requires",
				log: "CLI log"
			},
			commands: {
				autostretch: {
					help: "AutoStretch changes the scientific pixels with a nonlinear stretch. Shadows clip is in standard deviations. Target background is a normalized value from 0 to 1.",
					shadowsclip: "Shadows clip (σ)",
					shadowsclipHelp: "Set shadow clipping in units of background noise standard deviation.",
					targetbg: "Target background",
					targetbgHelp: "Set the target background brightness after stretching, from 0 to 1.",
					linked: "Link RGB channels",
					linkedHelp: "Link RGB channels to preserve their relative balance. Unlinked stretching can change white balance. Not applicable to monochrome images."
				},
				gauss: {
					help: "Apply Gaussian blur to the current image.",
					sigma: "Sigma",
					sigmaHelp: "Positive Gaussian radius in pixels."
				},
				neg: { help: "Invert the current image's pixel values." }
			},
			requirements: {
				current_image: "Current image",
				current_sequence: "Current sequence",
				RGB: "RGB",
				monochrome: "Monochrome image",
				CFA: "CFA image",
				sequence_files: "Sequence files",
				input_file_path: "Input file path",
				configured_StarNet_executable: "Configured StarNet executable",
				catalogue_access: "Catalogue access",
				host_configured_Python_script_file: "Host-configured Python script"
			}
		} },
		zh: { siril: {
			shadowsHelp: "以背景噪声的标准差为单位设置阴影裁剪。",
			targetHelp: "设置自动拉伸后的目标背景亮度，范围为 0 至 1。",
			linkedHelp: "联动 RGB 通道可保持通道间的相对关系。关闭联动可能改变白平衡。单色图像不适用。",
			purpose: "天文影像处理 · Siril CLI",
			activePath: "生效的 CLI 路径",
			version: "检测到的版本",
			verified: "最近验证时间",
			install: "安装指引",
			installWindows: "下载 Windows UCRT64 1.4.5 安装版或便携版。便携版请保留完整解压目录，并找到 bin/siril-cli.exe。",
			installMac: "macOS Ventura 13 或更高版本请选择适合 Intel 或 Apple Silicon 的 1.4.5 安装包，并验证 CLI。Homebrew 可能安装其他版本。",
			installLinux: "选择官方 1.4.5 AppImage 或提供本地 CLI 的安装包。发行版软件源可能使用旧版，Flatpak 的沙箱可能限制从宿主调用 CLI。",
			download: "官方下载",
			release: "1.4.5 发行说明",
			detect: "检测已安装的 Siril",
			select: "选择",
			path: "Siril CLI 可执行文件路径",
			pathHelp: "输入 ComfyUI 服务器上的完整程序路径，例如 siril-cli.exe。请保留完整安装目录并使用可信的官方程序。",
			save: "验证并保存",
			clear: "清除配置",
			verifying: "正在检查 Siril 并验证自动拉伸能力…",
			inspector: "检查器",
			close: "关闭",
			compare: "处理前后对比",
			side: "左右并排",
			wipe: "滑动分割",
			single: "单图切换",
			fit: "适应窗口",
			zoomOut: "缩小",
			zoomIn: "放大",
			before: "处理前",
			after: "处理后",
			noImage: "暂无可显示图像",
			linearPreview: "线性显示预览",
			unaligned: "滑动分割要求两图坐标一致。",
			analysis: "图像分析",
			analysisEmpty: "图像分析功能待定。",
			readonly: "节点参数 · 只读",
			shadows: "阴影裁剪",
			target: "目标背景",
			linked: "联动 RGB 通道",
			mono: "单色输入无需联动。",
			on: "开启",
			off: "关闭",
			status: "状态",
			canvasParameters: "请在画布节点上调整参数。",
			help: "自动拉伸说明",
			nodeHelp: "自动拉伸使用非线性映射改变科学图像像素。阴影裁剪以标准差为单位，目标背景为 0 到 1 的归一化数值。",
			rgbRisk: "关闭 RGB 联动可能改变白平衡。",
			reset: "恢复默认参数",
			preview: "拉伸图像预览",
			upstream: "请选择 FITS 素材或先执行上游节点。",
			noInput: "请连接科学图像。",
			rendering: "正在计算候选预览…",
			formal: "正式结果",
			addToAssets: "收录到素材库",
			addedToAssets: "已收录到素材库",
			candidate: "候选预览",
			running: "正在正式处理…",
			stale: "正式结果待更新",
			needsRun: "请运行工作流以生成正式 FITS 结果。",
			states: {
				SIRIL_DISABLED: "Siril 已停用。",
				ready: "Siril 1.4.5 · CLI 与自动拉伸已验证",
				network: "无法连接 Siril 服务。",
				timeout: "请求已超时。",
				schema: "Siril 服务返回了异常响应。",
				cancelled: "已取消处理。",
				SIRIL_NOT_CONFIGURED: "尚未配置 Siril。",
				SIRIL_NOT_FOUND: "未找到 Siril CLI。",
				SIRIL_GUI_ONLY: "发现了 Siril 图形界面程序。请指定 CLI。",
				SIRIL_EXECUTABLE_INVALID: "请指定有效且可访问的 Siril CLI 程序。",
				SIRIL_VERSION_MISMATCH: "此版本要求 Siril 1.4.5。",
				SIRIL_OPERATION_UNSUPPORTED: "CLI 未通过自动拉伸能力探测。",
				SIRIL_REVALIDATION_REQUIRED: "Siril 程序已变化，请重新验证。",
				SIRIL_RUN_FAILED: "Siril 处理失败。",
				SIRIL_RUN_TIMEOUT: "Siril 处理超时。",
				SIRIL_BUSY: "Siril 正在处理，请稍后重试。",
				SOURCE_NOT_FOUND: "输入或结果文件已失联。",
				SOURCE_CHANGED: "处理期间输入发生变化。",
				ASSET_NOT_FOUND: "找不到已登记素材。",
				WORKSPACE_OFFLINE: "工作区离线。",
				PREVIEW_STALE: "预览已失效或输入发生变化。",
				PREVIEW_CANCELLED: "已取消候选预览。",
				PREVIEW_FAILED: "候选预览失败。",
				PREVIEW_SIZE_LIMIT: "FITS 超出候选预览大小限制。",
				CACHE_LIMIT_EXCEEDED: "已达到缓存限额。",
				CACHE_IDENTITY_MISMATCH: "无法验证当前缓存目录的归属。",
				STORAGE_BUSY: "存储繁忙，请重试。",
				STORAGE_UNAVAILABLE: "AstroPhoto 存储不可用。",
				UNAUTHORIZED_STORAGE_OPERATION: "此操作需要受信任的本机直连访问。",
				FITS_INVALID: "素材不是有效的单帧 FITS。",
				FITS_SIZE_LIMIT: "FITS 超出支持的像素数。",
				FITS_UNSUPPORTED_PRECISION: "此 FITS 编码超出当前 Siril 处理支持范围。",
				FITS_DEPENDENCY_UNAVAILABLE: "FITS 解码依赖不可用。",
				INSUFFICIENT_DISK_SPACE: "磁盘空间不足。",
				SIRIL_OUTPUT_INVALID: "Siril 返回的科学图像无效。"
			},
			catalogue: {
				title: "Siril 命令",
				search: "搜索 Siril 命令",
				node: "ComfyUI 节点",
				gui: "不可在脚本中执行",
				build: "需要包含 {feature} 的 Siril 构建",
				empty: "没有匹配的命令。",
				unavailable: "无法加载命令目录。",
				usage: "命令用法",
				requirements: "前置条件",
				log: "CLI 日志"
			},
			commands: {
				autostretch: {
					help: "自动拉伸使用非线性映射改变科学图像像素。阴影裁剪以标准差为单位，目标背景为 0 到 1 的归一化数值。",
					shadowsclip: "阴影裁剪 (σ)",
					shadowsclipHelp: "以背景噪声的标准差为单位设置阴影裁剪。",
					targetbg: "目标背景",
					targetbgHelp: "设置自动拉伸后的目标背景亮度，范围为 0 至 1。",
					linked: "联动 RGB 通道",
					linkedHelp: "联动 RGB 通道可保持通道间的相对关系。关闭联动可能改变白平衡。单色图像不适用。"
				},
				gauss: {
					help: "对当前图像施加高斯模糊。",
					sigma: "标准差",
					sigmaHelp: "以像素为单位的正数。"
				},
				neg: { help: "反转当前图像的像素值。" }
			},
			requirements: {
				current_image: "当前图像",
				current_sequence: "当前序列",
				RGB: "RGB 彩色图像",
				monochrome: "单色图像",
				CFA: "CFA 马赛克图像",
				sequence_files: "序列文件",
				input_file_path: "输入文件路径",
				configured_StarNet_executable: "已配置的 StarNet 程序",
				catalogue_access: "可用星表",
				host_configured_Python_script_file: "宿主已配置的 Python 脚本"
			}
		} }
	},
	registerNodes: hN
}]);
