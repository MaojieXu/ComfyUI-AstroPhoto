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
}, ee = /-\w/g, A = k((e) => e.replace(ee, (e) => e.slice(1).toUpperCase())), j = /\B([A-Z])/g, te = k((e) => e.replace(j, "-$1").toLowerCase()), ne = k((e) => e.charAt(0).toUpperCase() + e.slice(1)), re = k((e) => e ? `on${ne(e)}` : ""), ie = (e, t) => !Object.is(e, t), ae = (e, ...t) => {
	for (let n = 0; n < e.length; n++) e[n](...t);
}, oe = (e, t, n, r = !1) => {
	Object.defineProperty(e, t, {
		configurable: !0,
		enumerable: !1,
		writable: r,
		value: n
	});
}, se = (e) => {
	let t = parseFloat(e);
	return isNaN(t) ? e : t;
}, ce, le = () => ce ||= typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : {};
function ue(e) {
	if (m(e)) {
		let t = {};
		for (let n = 0; n < e.length; n++) {
			let r = e[n], i = y(r) ? me(r) : ue(r);
			if (i) for (let e in i) t[e] = i[e];
		}
		return t;
	}
	if (y(e) || x(e)) return e;
}
var de = /;(?![^(]*\))/g, fe = /:([^]+)/, pe = /\/\*[^]*?\*\//g;
function me(e) {
	let t = {};
	return e.replace(pe, "").split(de).forEach((e) => {
		if (e) {
			let n = e.split(fe);
			n.length > 1 && (t[n[0].trim()] = n[1].trim());
		}
	}), t;
}
function he(e) {
	let t = "";
	if (y(e)) t = e;
	else if (m(e)) for (let n = 0; n < e.length; n++) {
		let r = he(e[n]);
		r && (t += r + " ");
	}
	else if (x(e)) for (let n in e) e[n] && (t += n + " ");
	return t.trim();
}
function ge(e) {
	if (!e) return null;
	let { class: t, style: n } = e;
	return t && !y(t) && (e.class = he(t)), n && (e.style = ue(n)), e;
}
var _e = /* @__PURE__ */ r("itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly");
function ve(e) {
	return !!e || e === "";
}
function ye(e, t) {
	if (e.length !== t.length) return !1;
	let n = !0;
	for (let r = 0; n && r < e.length; r++) n = xe(e[r], t[r]);
	return n;
}
function be(e, t) {
	if (e.size !== t.size) return !1;
	let n = Array.from(t), r = new Uint8Array(n.length);
	for (let t of e) {
		let e = -1;
		for (let i = 0; i < n.length; i++) if (!r[i] && xe(t, n[i])) {
			e = i;
			break;
		}
		if (e < 0) return !1;
		r[e] = 1;
	}
	return !0;
}
function xe(e, t) {
	if (e === t) return !0;
	let n = _(e), r = _(t);
	if (n || r) return n && r ? e.getTime() === t.getTime() : !1;
	if (n = b(e), r = b(t), n || r) return e === t;
	if (n = m(e), r = m(t), n || r) return n && r ? ye(e, t) : !1;
	if (n = x(e), r = x(t), n || r) {
		if (!n || !r) return !1;
		if (n = h(e), r = h(t), n || r || (n = g(e), r = g(t), n || r)) return n && r ? be(e, t) : !1;
		if (Object.keys(e).length !== Object.keys(t).length) return !1;
		for (let n in e) {
			let r = e.hasOwnProperty(n), i = t.hasOwnProperty(n);
			if (r && !i || !r && i || !xe(e[n], t[n])) return !1;
		}
	}
	return String(e) === String(t);
}
function Se(e, t) {
	return e.findIndex((e) => xe(e, t));
}
var Ce = (e) => !!(e && e.__v_isRef === !0), M = (e) => y(e) ? e : e == null ? "" : m(e) || x(e) && (e.toString === C || !v(e.toString)) ? Ce(e) ? M(e.value) : JSON.stringify(e, we, 2) : String(e), we = (e, t) => Ce(t) ? we(e, t.value) : h(t) ? { [`Map(${t.size})`]: [...t.entries()].reduce((e, [t, n], r) => (e[Te(t, r) + " =>"] = n, e), {}) } : g(t) ? { [`Set(${t.size})`]: [...t.values()].map((e) => Te(e)) } : b(t) ? Te(t) : x(t) && !m(t) && !E(t) ? String(t) : t, Te = (e, t = "") => b(e) ? `Symbol(${e.description ?? t})` : e, Ee, De = class {
	constructor(e = !1) {
		this.detached = e, this._active = !0, this._on = 0, this.effects = [], this.cleanups = [], this._isPaused = !1, this._warnOnRun = !0, this.__v_skip = !0, !e && Ee && (Ee.active ? (this.parent = Ee, this.index = (Ee.scopes || (Ee.scopes = [])).push(this) - 1) : (this._active = !1, this._warnOnRun = !1));
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
			let t = Ee;
			try {
				return Ee = this, e();
			} finally {
				Ee = t;
			}
		}
	}
	on() {
		++this._on === 1 && (this.prevScope = Ee, Ee = this);
	}
	off() {
		if (this._on > 0 && --this._on === 0) {
			if (Ee === this) Ee = this.prevScope;
			else {
				let e = Ee;
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
function Oe(e) {
	return new De(e);
}
function ke() {
	return Ee;
}
function Ae(e, t = !1) {
	Ee && Ee.cleanups.push(e);
}
var je, Me = /* @__PURE__ */ new WeakSet(), Ne = class {
	constructor(e) {
		this.fn = e, this.deps = void 0, this.depsTail = void 0, this.flags = 5, this.next = void 0, this.cleanup = void 0, this.scheduler = void 0, Ee && (Ee.active ? Ee.effects.push(this) : this.flags &= -2);
	}
	pause() {
		this.flags |= 64;
	}
	resume() {
		this.flags & 64 && (this.flags &= -65, Me.has(this) && (Me.delete(this), this.trigger()));
	}
	notify() {
		this.flags & 2 && !(this.flags & 32) || this.flags & 8 || Le(this);
	}
	run() {
		if (!(this.flags & 1)) return this.fn();
		this.flags |= 2, Xe(this), Be(this);
		let e = je, t = Ke;
		je = this, Ke = !0;
		try {
			return this.fn();
		} finally {
			Ve(this), je = e, Ke = t, this.flags &= -3;
		}
	}
	stop() {
		if (this.flags & 1) {
			for (let e = this.deps; e; e = e.nextDep) We(e);
			this.deps = this.depsTail = void 0, Xe(this), this.onStop && this.onStop(), this.flags &= -2;
		}
	}
	trigger() {
		this.flags & 64 ? Me.add(this) : this.scheduler ? this.scheduler() : this.runIfDirty();
	}
	runIfDirty() {
		He(this) && this.run();
	}
	get dirty() {
		return He(this);
	}
}, Pe = 0, Fe, Ie;
function Le(e, t = !1) {
	e.flags |= 8, t ? (e.next = Ie, Ie = e) : (e.next = Fe, Fe = e);
}
function Re() {
	Pe++;
}
function ze() {
	if (--Pe > 0) return;
	if (Ie) {
		let e = Ie;
		for (Ie = void 0; e;) {
			let t = e.next;
			e.next = void 0, e.flags &= -9, e = t;
		}
	}
	let e;
	for (; Fe;) {
		let t = Fe;
		for (Fe = void 0; t;) {
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
function Be(e) {
	for (let t = e.deps; t; t = t.nextDep) t.version = -1, t.prevActiveLink = t.dep.activeLink, t.dep.activeLink = t;
}
function Ve(e) {
	let t, n = e.depsTail, r = n;
	for (; r;) {
		let e = r.prevDep;
		r.version === -1 ? (r === n && (n = e), We(r), Ge(r)) : t = r, r.dep.activeLink = r.prevActiveLink, r.prevActiveLink = void 0, r = e;
	}
	e.deps = t, e.depsTail = n;
}
function He(e) {
	for (let t = e.deps; t; t = t.nextDep) if (t.dep.version !== t.version || t.dep.computed && (Ue(t.dep.computed) || t.dep.version !== t.version)) return !0;
	return !!e._dirty;
}
function Ue(e) {
	if (e.flags & 4 && !(e.flags & 16) || (e.flags &= -17, e.globalVersion === Ze) || (e.globalVersion = Ze, !e.isSSR && e.flags & 128 && (!e.deps && !e._dirty || !He(e)))) return;
	e.flags |= 2;
	let t = e.dep, n = je, r = Ke;
	je = e, Ke = !0;
	try {
		Be(e);
		let n = e.fn(e._value);
		(t.version === 0 || ie(n, e._value)) && (e.flags |= 128, e._value = n, t.version++);
	} catch (e) {
		throw t.version++, e;
	} finally {
		je = n, Ke = r, Ve(e), e.flags &= -3;
	}
}
function We(e, t = !1) {
	let { dep: n, prevSub: r, nextSub: i } = e;
	if (r && (r.nextSub = i, e.prevSub = void 0), i && (i.prevSub = r, e.nextSub = void 0), n.subs === e && (n.subs = r, !r && n.computed)) {
		n.computed.flags &= -5;
		for (let e = n.computed.deps; e; e = e.nextDep) We(e, !0);
	}
	!t && !--n.sc && n.map && n.map.delete(n.key);
}
function Ge(e) {
	let { prevDep: t, nextDep: n } = e;
	t && (t.nextDep = n, e.prevDep = void 0), n && (n.prevDep = t, e.nextDep = void 0);
}
var Ke = !0, qe = [];
function Je() {
	qe.push(Ke), Ke = !1;
}
function Ye() {
	let e = qe.pop();
	Ke = e === void 0 || e;
}
function Xe(e) {
	let { cleanup: t } = e;
	if (e.cleanup = void 0, t) {
		let e = je;
		je = void 0;
		try {
			t();
		} finally {
			je = e;
		}
	}
}
var Ze = 0, Qe = class {
	constructor(e, t) {
		this.sub = e, this.dep = t, this.version = t.version, this.nextDep = this.prevDep = this.nextSub = this.prevSub = this.prevActiveLink = void 0;
	}
}, $e = class {
	constructor(e) {
		this.computed = e, this.version = 0, this.activeLink = void 0, this.subs = void 0, this.map = void 0, this.key = void 0, this.sc = 0, this.__v_skip = !0;
	}
	track(e) {
		if (!je || !Ke || je === this.computed) return;
		let t = this.activeLink;
		if (t === void 0 || t.sub !== je) t = this.activeLink = new Qe(je, this), je.deps ? (t.prevDep = je.depsTail, je.depsTail.nextDep = t, je.depsTail = t) : je.deps = je.depsTail = t, et(t);
		else if (t.version === -1 && (t.version = this.version, t.nextDep)) {
			let e = t.nextDep;
			e.prevDep = t.prevDep, t.prevDep && (t.prevDep.nextDep = e), t.prevDep = je.depsTail, t.nextDep = void 0, je.depsTail.nextDep = t, je.depsTail = t, je.deps === t && (je.deps = e);
		}
		return t;
	}
	trigger(e) {
		this.version++, Ze++, this.notify(e);
	}
	notify(e) {
		Re();
		try {
			for (let e = this.subs; e; e = e.prevSub) e.sub.notify() && e.sub.dep.notify();
		} finally {
			ze();
		}
	}
};
function et(e) {
	if (e.dep.sc++, e.sub.flags & 4) {
		let t = e.dep.computed;
		if (t && !e.dep.subs) {
			t.flags |= 20;
			for (let e = t.deps; e; e = e.nextDep) et(e);
		}
		let n = e.dep.subs;
		n !== e && (e.prevSub = n, n && (n.nextSub = e)), e.dep.subs = e;
	}
}
var tt = /* @__PURE__ */ new WeakMap(), nt = /* @__PURE__ */ Symbol(""), rt = /* @__PURE__ */ Symbol(""), it = /* @__PURE__ */ Symbol("");
function at(e, t, n) {
	if (Ke && je) {
		let t = tt.get(e);
		t || tt.set(e, t = /* @__PURE__ */ new Map());
		let r = t.get(n);
		r || (t.set(n, r = new $e()), r.map = t, r.key = n), r.track();
	}
}
function ot(e, t, n, r, i, a) {
	let o = tt.get(e);
	if (!o) {
		Ze++;
		return;
	}
	let s = (e) => {
		e && e.trigger();
	};
	if (Re(), t === "clear") o.forEach(s);
	else {
		let i = m(e), a = i && D(n);
		if (i && n === "length") {
			let e = Number(r);
			o.forEach((t, n) => {
				(n === "length" || n === it || !b(n) && n >= e) && s(t);
			});
		} else switch ((n !== void 0 || o.has(void 0)) && s(o.get(n)), a && s(o.get(it)), t) {
			case "add":
				i ? a && s(o.get("length")) : (s(o.get(nt)), h(e) && s(o.get(rt)));
				break;
			case "delete":
				i || (s(o.get(nt)), h(e) && s(o.get(rt)));
				break;
			case "set": h(e) && s(o.get(nt));
		}
	}
	ze();
}
function st(e, t) {
	let n = tt.get(e);
	return n && n.get(t);
}
function ct(e) {
	let t = /* @__PURE__ */ Qt(e);
	return t === e ? t : (at(t, "iterate", it), /* @__PURE__ */ Xt(e) ? t : t.map(en));
}
function lt(e) {
	return at(e = /* @__PURE__ */ Qt(e), "iterate", it), e;
}
function ut(e, t) {
	return /* @__PURE__ */ Yt(e) ? tn(/* @__PURE__ */ Jt(e) ? en(t) : t) : en(t);
}
var dt = {
	__proto__: null,
	[Symbol.iterator]() {
		return ft(this, Symbol.iterator, (e) => ut(this, e));
	},
	concat(...e) {
		return ct(this).concat(...e.map((e) => m(e) ? ct(e) : e));
	},
	entries() {
		return ft(this, "entries", (e) => (e[1] = ut(this, e[1]), e));
	},
	every(e, t) {
		return mt(this, "every", e, t, void 0, arguments);
	},
	filter(e, t) {
		return mt(this, "filter", e, t, (e) => e.map((e) => ut(this, e)), arguments);
	},
	find(e, t) {
		return mt(this, "find", e, t, (e) => ut(this, e), arguments);
	},
	findIndex(e, t) {
		return mt(this, "findIndex", e, t, void 0, arguments);
	},
	findLast(e, t) {
		return mt(this, "findLast", e, t, (e) => ut(this, e), arguments);
	},
	findLastIndex(e, t) {
		return mt(this, "findLastIndex", e, t, void 0, arguments);
	},
	forEach(e, t) {
		return mt(this, "forEach", e, t, void 0, arguments);
	},
	includes(...e) {
		return gt(this, "includes", e);
	},
	indexOf(...e) {
		return gt(this, "indexOf", e);
	},
	join(e) {
		return ct(this).join(e);
	},
	lastIndexOf(...e) {
		return gt(this, "lastIndexOf", e);
	},
	map(e, t) {
		return mt(this, "map", e, t, void 0, arguments);
	},
	pop() {
		return _t(this, "pop");
	},
	push(...e) {
		return _t(this, "push", e);
	},
	reduce(e, ...t) {
		return ht(this, "reduce", e, t);
	},
	reduceRight(e, ...t) {
		return ht(this, "reduceRight", e, t);
	},
	shift() {
		return _t(this, "shift");
	},
	some(e, t) {
		return mt(this, "some", e, t, void 0, arguments);
	},
	splice(...e) {
		return _t(this, "splice", e);
	},
	toReversed() {
		return ct(this).toReversed();
	},
	toSorted(e) {
		return ct(this).toSorted(e);
	},
	toSpliced(...e) {
		return ct(this).toSpliced(...e);
	},
	unshift(...e) {
		return _t(this, "unshift", e);
	},
	values() {
		return ft(this, "values", (e) => ut(this, e));
	}
};
function ft(e, t, n) {
	let r = lt(e), i = r[t]();
	return r !== e && !/* @__PURE__ */ Xt(e) && (i._next = i.next, i.next = () => {
		let e = i._next();
		return e.done || (e.value = n(e.value)), e;
	}), i;
}
var pt = Array.prototype;
function mt(e, t, n, r, i, a) {
	let o = lt(e), s = o !== e && !/* @__PURE__ */ Xt(e), c = o[t];
	if (c !== pt[t]) {
		let t = c.apply(e, a);
		return s ? en(t) : t;
	}
	let l = n;
	o !== e && (s ? l = function(t, r) {
		return n.call(this, ut(e, t), r, e);
	} : n.length > 2 && (l = function(t, r) {
		return n.call(this, t, r, e);
	}));
	let u = c.call(o, l, r);
	return s && i ? i(u) : u;
}
function ht(e, t, n, r) {
	let i = lt(e), a = i !== e && !/* @__PURE__ */ Xt(e), o = n, s = !1;
	i !== e && (a ? (s = r.length === 0, o = function(t, r, i) {
		return s && (s = !1, t = ut(e, t)), n.call(this, t, ut(e, r), i, e);
	}) : n.length > 3 && (o = function(t, r, i) {
		return n.call(this, t, r, i, e);
	}));
	let c = i[t](o, ...r);
	return s ? ut(e, c) : c;
}
function gt(e, t, n) {
	let r = /* @__PURE__ */ Qt(e);
	at(r, "iterate", it);
	let i = r[t](...n);
	return (i === -1 || i === !1) && /* @__PURE__ */ Zt(n[0]) ? (n[0] = /* @__PURE__ */ Qt(n[0]), r[t](...n)) : i;
}
function _t(e, t, n = []) {
	Je(), Re();
	let r = (/* @__PURE__ */ Qt(e))[t].apply(e, n);
	return ze(), Ye(), r;
}
var vt = /* @__PURE__ */ r("__proto__,__v_isRef,__isVue"), yt = new Set(/* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((e) => e !== "arguments" && e !== "caller").map((e) => Symbol[e]).filter(b));
function bt(e) {
	b(e) || (e = String(e));
	let t = /* @__PURE__ */ Qt(this);
	return at(t, "has", e), t.hasOwnProperty(e);
}
var xt = class {
	constructor(e = !1, t = !1) {
		this._isReadonly = e, this._isShallow = t;
	}
	get(e, t, n) {
		if (t === "__v_skip") return e.__v_skip;
		let r = this._isReadonly, i = this._isShallow;
		if (t === "__v_isReactive") return !r;
		if (t === "__v_isReadonly") return r;
		if (t === "__v_isShallow") return i;
		if (t === "__v_raw") return n === (r ? i ? Vt : Bt : i ? zt : Rt).get(e) || Object.getPrototypeOf(e) === Object.getPrototypeOf(n) ? e : void 0;
		let a = m(e);
		if (!r) {
			let e;
			if (a && (e = dt[t])) return e;
			if (t === "hasOwnProperty") return bt;
		}
		let o = Reflect.get(e, t, /* @__PURE__ */ nn(e) ? e : n);
		if ((b(t) ? yt.has(t) : vt(t)) || (r || at(e, "get", t), i)) return o;
		if (/* @__PURE__ */ nn(o)) {
			let e = a && D(t) ? o : o.value;
			return r && x(e) ? /* @__PURE__ */ Gt(e) : e;
		}
		return x(o) ? r ? /* @__PURE__ */ Gt(o) : /* @__PURE__ */ Ut(o) : o;
	}
}, St = class extends xt {
	constructor(e = !1) {
		super(!1, e);
	}
	set(e, t, n, r) {
		let i = e[t], a = m(e) && D(t);
		if (!this._isShallow) {
			let e = /* @__PURE__ */ Yt(i);
			if (!/* @__PURE__ */ Xt(n) && !/* @__PURE__ */ Yt(n) && (i = /* @__PURE__ */ Qt(i), n = /* @__PURE__ */ Qt(n)), !a && /* @__PURE__ */ nn(i) && !/* @__PURE__ */ nn(n)) return e || (i.value = n), !0;
		}
		let o = a ? Number(t) < e.length : p(e, t), s = Reflect.set(e, t, n, /* @__PURE__ */ nn(e) ? e : r);
		return e === /* @__PURE__ */ Qt(r) && s && (o ? ie(n, i) && ot(e, "set", t, n, i) : ot(e, "add", t, n)), s;
	}
	deleteProperty(e, t) {
		let n = p(e, t), r = e[t], i = Reflect.deleteProperty(e, t);
		return i && n && ot(e, "delete", t, void 0, r), i;
	}
	has(e, t) {
		let n = Reflect.has(e, t);
		return b(t) && yt.has(t) || at(e, "has", t), n;
	}
	ownKeys(e) {
		return at(e, "iterate", m(e) ? "length" : nt), Reflect.ownKeys(e);
	}
}, Ct = class extends xt {
	constructor(e = !1) {
		super(!0, e);
	}
	set(e, t) {
		return !0;
	}
	deleteProperty(e, t) {
		return !0;
	}
}, wt = /* @__PURE__ */ new St(), Tt = /* @__PURE__ */ new Ct(), Et = /* @__PURE__ */ new St(!0), Dt = /* @__PURE__ */ new Ct(!0), Ot = (e) => e, kt = (e) => Reflect.getPrototypeOf(e);
function At(e, t, n) {
	return function(...r) {
		let i = this.__v_raw, a = /* @__PURE__ */ Qt(i), o = h(a), s = e === "entries" || e === Symbol.iterator && o, c = e === "keys" && o, l = i[e](...r), d = n ? Ot : t ? tn : en;
		return !t && at(a, "iterate", c ? rt : nt), u(Object.create(l), { next() {
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
function jt(e) {
	return function(...t) {
		return e === "delete" ? !1 : e === "clear" ? void 0 : this;
	};
}
function Mt(e, t) {
	let n = {
		get(n) {
			let r = this.__v_raw, i = /* @__PURE__ */ Qt(r), a = /* @__PURE__ */ Qt(n);
			e || (ie(n, a) && at(i, "get", n), at(i, "get", a));
			let { has: o } = kt(i), s = t ? Ot : e ? tn : en;
			if (o.call(i, n)) return s(r.get(n));
			if (o.call(i, a)) return s(r.get(a));
			r !== i && r.get(n);
		},
		get size() {
			let t = this.__v_raw;
			return !e && at(/* @__PURE__ */ Qt(t), "iterate", nt), t.size;
		},
		has(t) {
			let n = this.__v_raw, r = /* @__PURE__ */ Qt(n), i = /* @__PURE__ */ Qt(t);
			return e || (ie(t, i) && at(r, "has", t), at(r, "has", i)), t === i ? n.has(t) : n.has(t) || n.has(i);
		},
		forEach(n, r) {
			let i = this, a = i.__v_raw, o = /* @__PURE__ */ Qt(a), s = t ? Ot : e ? tn : en;
			return !e && at(o, "iterate", nt), a.forEach((e, t) => n.call(r, s(e), s(t), i));
		}
	};
	return u(n, e ? {
		add: jt("add"),
		set: jt("set"),
		delete: jt("delete"),
		clear: jt("clear")
	} : {
		add(e) {
			let n = /* @__PURE__ */ Qt(this), r = kt(n), i = /* @__PURE__ */ Qt(e), a = !t && !/* @__PURE__ */ Xt(e) && !/* @__PURE__ */ Yt(e) ? i : e;
			return r.has.call(n, a) || ie(e, a) && r.has.call(n, e) || ie(i, a) && r.has.call(n, i) || (n.add(a), ot(n, "add", a, a)), this;
		},
		set(e, n) {
			t || /* @__PURE__ */ Xt(n) || /* @__PURE__ */ Yt(n) || (n = /* @__PURE__ */ Qt(n));
			let r = /* @__PURE__ */ Qt(this), { has: i, get: a } = kt(r), o = i.call(r, e);
			o ||= (e = /* @__PURE__ */ Qt(e), i.call(r, e));
			let s = a.call(r, e);
			return r.set(e, n), o ? ie(n, s) && ot(r, "set", e, n, s) : ot(r, "add", e, n), this;
		},
		delete(e) {
			let t = /* @__PURE__ */ Qt(this), { has: n, get: r } = kt(t), i = n.call(t, e);
			i ||= (e = /* @__PURE__ */ Qt(e), n.call(t, e));
			let a = r ? r.call(t, e) : void 0, o = t.delete(e);
			return i && ot(t, "delete", e, void 0, a), o;
		},
		clear() {
			let e = /* @__PURE__ */ Qt(this), t = e.size !== 0, n = e.clear();
			return t && ot(e, "clear", void 0, void 0, void 0), n;
		}
	}), [
		"keys",
		"values",
		"entries",
		Symbol.iterator
	].forEach((r) => {
		n[r] = At(r, e, t);
	}), n;
}
function Nt(e, t) {
	let n = Mt(e, t);
	return (t, r, i) => r === "__v_isReactive" ? !e : r === "__v_isReadonly" ? e : r === "__v_raw" ? t : Reflect.get(p(n, r) && r in t ? n : t, r, i);
}
var Pt = { get: /* @__PURE__ */ Nt(!1, !1) }, Ft = { get: /* @__PURE__ */ Nt(!1, !0) }, It = { get: /* @__PURE__ */ Nt(!0, !1) }, Lt = { get: /* @__PURE__ */ Nt(!0, !0) }, Rt = /* @__PURE__ */ new WeakMap(), zt = /* @__PURE__ */ new WeakMap(), Bt = /* @__PURE__ */ new WeakMap(), Vt = /* @__PURE__ */ new WeakMap();
function Ht(e) {
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
function Ut(e) {
	return /* @__PURE__ */ Yt(e) ? e : qt(e, !1, wt, Pt, Rt);
}
// @__NO_SIDE_EFFECTS__
function Wt(e) {
	return qt(e, !1, Et, Ft, zt);
}
// @__NO_SIDE_EFFECTS__
function Gt(e) {
	return qt(e, !0, Tt, It, Bt);
}
// @__NO_SIDE_EFFECTS__
function Kt(e) {
	return qt(e, !0, Dt, Lt, Vt);
}
function qt(e, t, n, r, i) {
	if (!x(e) || e.__v_raw && !(t && e.__v_isReactive) || e.__v_skip || !Object.isExtensible(e)) return e;
	let a = i.get(e);
	if (a) return a;
	let o = Ht(T(e));
	if (o === 0) return e;
	let s = new Proxy(e, o === 2 ? r : n);
	return i.set(e, s), s;
}
// @__NO_SIDE_EFFECTS__
function Jt(e) {
	return /* @__PURE__ */ Yt(e) ? /* @__PURE__ */ Jt(e.__v_raw) : !!(e && e.__v_isReactive);
}
// @__NO_SIDE_EFFECTS__
function Yt(e) {
	return !!(e && e.__v_isReadonly);
}
// @__NO_SIDE_EFFECTS__
function Xt(e) {
	return !!(e && e.__v_isShallow);
}
// @__NO_SIDE_EFFECTS__
function Zt(e) {
	return e ? !!e.__v_raw : !1;
}
// @__NO_SIDE_EFFECTS__
function Qt(e) {
	let t = e && e.__v_raw;
	return t ? /* @__PURE__ */ Qt(t) : e;
}
function $t(e) {
	return !p(e, "__v_skip") && Object.isExtensible(e) && oe(e, "__v_skip", !0), e;
}
var en = (e) => x(e) ? /* @__PURE__ */ Ut(e) : e, tn = (e) => x(e) ? /* @__PURE__ */ Gt(e) : e;
// @__NO_SIDE_EFFECTS__
function nn(e) {
	return e ? e.__v_isRef === !0 : !1;
}
// @__NO_SIDE_EFFECTS__
function N(e) {
	return rn(e, !1);
}
// @__NO_SIDE_EFFECTS__
function P(e) {
	return rn(e, !0);
}
function rn(e, t) {
	return /* @__PURE__ */ nn(e) ? e : new an(e, t);
}
var an = class {
	constructor(e, t) {
		this.dep = new $e(), this.__v_isRef = !0, this.__v_isShallow = !1, this._rawValue = t ? e : /* @__PURE__ */ Qt(e), this._value = t ? e : en(e), this.__v_isShallow = t;
	}
	get value() {
		return this.dep.track(), this._value;
	}
	set value(e) {
		let t = this._rawValue, n = this.__v_isShallow || /* @__PURE__ */ Xt(e) || /* @__PURE__ */ Yt(e);
		e = n ? e : /* @__PURE__ */ Qt(e), ie(e, t) && (this._rawValue = e, this._value = n ? e : en(e), this.dep.trigger());
	}
};
function on(e) {
	e.dep && e.dep.trigger();
}
function F(e) {
	return /* @__PURE__ */ nn(e) ? e.value : e;
}
function sn(e) {
	return v(e) ? e() : F(e);
}
var cn = {
	get: (e, t, n) => t === "__v_raw" ? e : F(Reflect.get(e, t, n)),
	set: (e, t, n, r) => {
		let i = e[t];
		return /* @__PURE__ */ nn(i) && !/* @__PURE__ */ nn(n) ? (i.value = n, !0) : Reflect.set(e, t, n, r);
	}
};
function ln(e) {
	return /* @__PURE__ */ Jt(e) ? e : new Proxy(e, cn);
}
var un = class {
	constructor(e) {
		this.__v_isRef = !0, this._value = void 0;
		let t = this.dep = new $e(), { get: n, set: r } = e(t.track.bind(t), t.trigger.bind(t));
		this._get = n, this._set = r;
	}
	get value() {
		return this._value = this._get();
	}
	set value(e) {
		this._set(e);
	}
};
function dn(e) {
	return new un(e);
}
// @__NO_SIDE_EFFECTS__
function fn(e) {
	let t = m(e) ? Array(e.length) : {};
	for (let n in e) t[n] = gn(e, n);
	return t;
}
var pn = class {
	constructor(e, t, n) {
		this._object = e, this._defaultValue = n, this.__v_isRef = !0, this._value = void 0, this._key = b(t) ? t : String(t), this._raw = /* @__PURE__ */ Qt(e);
		let r = !0, i = e;
		if (!m(e) || b(this._key) || !D(this._key)) do
			r = !/* @__PURE__ */ Zt(i) || /* @__PURE__ */ Xt(i);
		while (r && (i = i.__v_raw));
		this._shallow = r;
	}
	get value() {
		let e = this._object[this._key];
		return this._shallow && (e = F(e)), this._value = e === void 0 ? this._defaultValue : e;
	}
	set value(e) {
		if (this._shallow && /* @__PURE__ */ nn(this._raw[this._key])) {
			let t = this._object[this._key];
			if (/* @__PURE__ */ nn(t)) {
				t.value = e;
				return;
			}
		}
		this._object[this._key] = e;
	}
	get dep() {
		return st(this._raw, this._key);
	}
}, mn = class {
	constructor(e) {
		this._getter = e, this.__v_isRef = !0, this.__v_isReadonly = !0, this._value = void 0;
	}
	get value() {
		return this._value = this._getter();
	}
};
// @__NO_SIDE_EFFECTS__
function hn(e, t, n) {
	return /* @__PURE__ */ nn(e) ? e : v(e) ? new mn(e) : x(e) && arguments.length > 1 ? gn(e, t, n) : /* @__PURE__ */ N(e);
}
function gn(e, t, n) {
	return new pn(e, t, n);
}
var _n = class {
	constructor(e, t, n) {
		this.fn = e, this.setter = t, this._value = void 0, this.dep = new $e(this), this.__v_isRef = !0, this.deps = void 0, this.depsTail = void 0, this.flags = 16, this.globalVersion = Ze - 1, this.next = void 0, this.effect = this, this.__v_isReadonly = !t, this.isSSR = n;
	}
	notify() {
		if (this.flags |= 16, !(this.flags & 8) && je !== this) return Le(this, !0), !0;
	}
	get value() {
		let e = this.dep.track();
		return Ue(this), e && (e.version = this.dep.version), this._value;
	}
	set value(e) {
		this.setter && this.setter(e);
	}
};
// @__NO_SIDE_EFFECTS__
function vn(e, t, n = !1) {
	let r, i;
	return v(e) ? r = e : (r = e.get, i = e.set), new _n(r, i, n);
}
var yn = {}, bn = /* @__PURE__ */ new WeakMap(), xn = void 0;
function Sn(e, t = !1, n = xn) {
	if (n) {
		let t = bn.get(n);
		t || bn.set(n, t = []), t.push(e);
	}
}
function Cn(e, t, n = i) {
	let { immediate: r, deep: a, once: s, scheduler: c, augmentJob: l, call: u } = n, f = (e) => a ? e : /* @__PURE__ */ Xt(e) || a === !1 || a === 0 ? wn(e, 1) : wn(e), p, h, g, _, y = !1, b = !1;
	if (/* @__PURE__ */ nn(e) ? (h = () => e.value, y = /* @__PURE__ */ Xt(e)) : /* @__PURE__ */ Jt(e) ? (h = () => f(e), y = !0) : m(e) ? (b = !0, y = e.some((e) => /* @__PURE__ */ Jt(e) || /* @__PURE__ */ Xt(e)), h = () => e.map((e) => {
		if (/* @__PURE__ */ nn(e)) return e.value;
		if (/* @__PURE__ */ Jt(e)) return f(e);
		if (v(e)) return u ? u(e, 2) : e();
	})) : h = v(e) ? t ? u ? () => u(e, 2) : e : () => {
		if (g) {
			Je();
			try {
				g();
			} finally {
				Ye();
			}
		}
		let t = xn;
		xn = p;
		try {
			return u ? u(e, 3, [_]) : e(_);
		} finally {
			xn = t;
		}
	} : o, t && a) {
		let e = h, t = a === !0 ? Infinity : a;
		h = () => wn(e(), t);
	}
	let x = ke(), S = () => {
		p.stop(), x && x.active && d(x.effects, p);
	};
	if (s && t) {
		let e = t;
		t = (...t) => {
			let n = e(...t);
			return S(), n;
		};
	}
	let C = b ? Array(e.length).fill(yn) : yn, w = (e) => {
		if (p.flags & 1 && (p.dirty || e)) {
			if (t) {
				let n = p.run();
				if (e || a || y || (b ? n.some((e, t) => ie(e, C[t])) : ie(n, C))) {
					g && g();
					let e = xn;
					xn = p;
					try {
						let e = [
							n,
							C === yn ? void 0 : b && C[0] === yn ? [] : C,
							_
						];
						C = n, u ? u(t, 3, e) : t(...e);
					} finally {
						xn = e;
					}
				}
			} else p.run();
		}
	};
	return l && l(w), p = new Ne(h), p.scheduler = c ? () => c(w, !1) : w, _ = (e) => Sn(e, !1, p), g = p.onStop = () => {
		let e = bn.get(p);
		if (e) {
			if (u) u(e, 4);
			else for (let t of e) t();
			bn.delete(p);
		}
	}, t ? r ? w(!0) : C = p.run() : c ? c(w.bind(null, !0), !0) : p.run(), S.pause = p.pause.bind(p), S.resume = p.resume.bind(p), S.stop = S, S;
}
function wn(e, t = Infinity, n) {
	if (t <= 0 || !x(e) || e.__v_skip || (n ||= /* @__PURE__ */ new Map(), (n.get(e) || 0) >= t)) return e;
	if (n.set(e, t), t--, /* @__PURE__ */ nn(e)) wn(e.value, t, n);
	else if (m(e)) for (let r = 0; r < e.length; r++) wn(e[r], t, n);
	else if (g(e) || h(e)) e.forEach((e) => {
		wn(e, t, n);
	});
	else if (E(e)) {
		for (let r in e) wn(e[r], t, n);
		for (let r of Object.getOwnPropertySymbols(e)) Object.prototype.propertyIsEnumerable.call(e, r) && wn(e[r], t, n);
	}
	return e;
}
// node_modules/.pnpm/@vue+runtime-core@3.5.42/node_modules/@vue/runtime-core/dist/runtime-core.esm-bundler.js
function Tn(e, t, n, r) {
	try {
		return r ? e(...r) : e();
	} catch (e) {
		Dn(e, t, n);
	}
}
function En(e, t, n, r) {
	if (v(e)) {
		let i = Tn(e, t, n, r);
		return i && S(i) && i.catch((e) => {
			Dn(e, t, n);
		}), i;
	}
	if (m(e)) {
		let i = [];
		for (let a = 0; a < e.length; a++) i.push(En(e[a], t, n, r));
		return i;
	}
}
function Dn(e, t, n, r = !0) {
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
			Je(), Tn(o, null, 10, [
				e,
				i,
				a
			]), Ye();
			return;
		}
	}
	On(e, n, a, r, s);
}
function On(e, t, n, r = !0, i = !1) {
	if (i) throw e;
	console.error(e);
}
var kn = [], An = -1, jn = [], Mn = null, Nn = 0, Pn = /* @__PURE__ */ Promise.resolve(), Fn = null;
function In(e) {
	let t = Fn || Pn;
	return e ? t.then(this ? e.bind(this) : e) : t;
}
function Ln(e) {
	let t = An + 1, n = kn.length;
	for (; t < n;) {
		let r = t + n >>> 1, i = kn[r], a = Un(i);
		a < e || a === e && i.flags & 2 ? t = r + 1 : n = r;
	}
	return t;
}
function Rn(e) {
	if (!(e.flags & 1)) {
		let t = Un(e), n = kn[kn.length - 1];
		!n || !(e.flags & 2) && t >= Un(n) ? kn.push(e) : kn.splice(Ln(t), 0, e), e.flags |= 1, zn();
	}
}
function zn() {
	Fn ||= Pn.then(Wn);
}
function Bn(e) {
	if (!m(e)) Mn && e.id === -1 ? Mn.splice(Nn + 1, 0, e) : e.flags & 1 || (jn.push(e), e.flags |= 1);
	else for (let t = 0; t < e.length; t++) jn.push(e[t]);
	zn();
}
function Vn(e, t, n = An + 1) {
	for (; n < kn.length; n++) {
		let t = kn[n];
		if (t && t.flags & 2) {
			if (e && t.id !== e.uid) continue;
			kn.splice(n, 1), n--, t.flags & 4 && (t.flags &= -2), t(), t.flags & 4 || (t.flags &= -2);
		}
	}
}
function Hn(e) {
	if (jn.length) {
		let e = [...new Set(jn)].sort((e, t) => Un(e) - Un(t));
		if (jn.length = 0, Mn) {
			for (let t = 0; t < e.length; t++) Mn.push(e[t]);
			return;
		}
		for (Mn = e, Nn = 0; Nn < Mn.length; Nn++) {
			let e = Mn[Nn];
			e.flags & 4 && (e.flags &= -2), e.flags & 8 || e(), e.flags &= -2;
		}
		Mn = null, Nn = 0;
	}
}
var Un = (e) => e.id == null ? e.flags & 2 ? -1 : Infinity : e.id;
function Wn(e) {
	try {
		for (An = 0; An < kn.length; An++) {
			let e = kn[An];
			e && !(e.flags & 8) && (e.flags & 4 && (e.flags &= -2), Tn(e, e.i, e.i ? 15 : 14), e.flags & 4 || (e.flags &= -2));
		}
	} finally {
		for (; An < kn.length; An++) {
			let e = kn[An];
			e && (e.flags &= -2);
		}
		An = -1, kn.length = 0, Hn(e), Fn = null, (kn.length || jn.length) && Wn(e);
	}
}
var Gn = null, Kn = null;
function qn(e) {
	let t = Gn;
	return Gn = e, Kn = e && e.type.__scopeId || null, t;
}
function I(e, t = Gn, n) {
	if (!t || e._n) return e;
	let r = (...n) => {
		r._d && ka(-1);
		let i = qn(t), a = Ta.length, o;
		try {
			o = e(...n);
		} finally {
			for (let e = Ta.length; e > a; e--) Da();
			qn(i), r._d && ka(1);
		}
		return o;
	};
	return r._n = !0, r._c = !0, r._d = !0, r;
}
function Jn(e, t) {
	if (Gn === null) return e;
	let n = ao(Gn), r = e.dirs ||= [];
	for (let e = 0; e < t.length; e++) {
		let [a, o, s, c = i] = t[e];
		a && (v(a) && (a = {
			mounted: a,
			updated: a
		}), a.deep && wn(o), r.push({
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
function Yn(e, t, n, r) {
	let i = e.dirs, a = t && t.dirs;
	for (let o = 0; o < i.length; o++) {
		let s = i[o];
		a && (s.oldValue = a[o].value);
		let c = s.dir[r];
		c && (Je(), En(c, n, 8, [
			e.el,
			s,
			e,
			t
		]), Ye());
	}
}
function Xn(e, t) {
	if (Ga) {
		let n = Ga.provides, r = Ga.parent && Ga.parent.provides;
		r === n && (n = Ga.provides = Object.create(r)), n[e] = t;
	}
}
function Zn(e, t, n = !1) {
	let r = Ka();
	if (r || ji) {
		let i = ji ? ji._context.provides : r ? r.parent == null || r.ce ? r.vnode.appContext && r.vnode.appContext.provides : r.parent.provides : void 0;
		if (i && e in i) return i[e];
		if (arguments.length > 1) return n && v(t) ? t.call(r && r.proxy) : t;
	}
}
var Qn = /* @__PURE__ */ Symbol.for("v-scx"), $n = () => Zn(Qn);
function er(e, t) {
	return rr(e, null, t);
}
function tr(e, t) {
	return rr(e, null, { flush: "post" });
}
function nr(e, t) {
	return rr(e, null, { flush: "sync" });
}
function L(e, t, n) {
	return rr(e, t, n);
}
function rr(e, t, n = i) {
	let { immediate: r, deep: a, flush: s, once: c } = n, l = u({}, n), d = t && r || !t && s !== "post", f;
	if (Qa) {
		if (s === "sync") {
			let e = $n();
			f = e.__watcherHandles ||= [];
		} else if (!d) {
			let e = () => {};
			return e.stop = o, e.resume = o, e.pause = o, e;
		}
	}
	let p = Ga;
	l.call = (e, t, n) => En(e, p, t, n);
	let m = !1;
	s === "post" ? l.scheduler = (e) => {
		la(e, p && p.suspense);
	} : s !== "sync" && (m = !0, l.scheduler = (e, t) => {
		t ? e() : Rn(e);
	}), l.augmentJob = (e) => {
		t && (e.flags |= 4), m && (e.flags |= 2, p && (e.id = p.uid, e.i = p));
	};
	let h = Cn(e, t, l);
	return Qa && (f ? f.push(h) : d && h()), h;
}
function ir(e, t, n) {
	let r = this.proxy, i = y(e) ? e.includes(".") ? ar(r, e) : () => r[e] : e.bind(r, r), a;
	v(t) ? a = t : (a = t.handler, n = t);
	let o = Ya(this), s = rr(i, a.bind(r), n);
	return o(), s;
}
function ar(e, t) {
	let n = t.split(".");
	return () => {
		let t = e;
		for (let e = 0; e < n.length && t; e++) t = t[n[e]];
		return t;
	};
}
var or = /* @__PURE__ */ new WeakMap(), sr = /* @__PURE__ */ Symbol("_vte"), cr = (e) => e.__isTeleport, lr = (e) => e && (e.disabled || e.disabled === ""), ur = (e) => e && (e.defer || e.defer === ""), dr = (e) => typeof SVGElement < "u" && e instanceof SVGElement, fr = (e) => typeof MathMLElement == "function" && e instanceof MathMLElement, pr = (e, t) => {
	let n = e && e.to;
	return y(n) ? t ? t(n) : null : n;
}, mr = {
	name: "Teleport",
	__isTeleport: !0,
	process(e, t, n, r, i, a, o, s, c, l) {
		let { mc: u, pc: d, pbc: f, o: { insert: p, querySelector: m, createText: h, createComment: g, parentNode: _ } } = l, v = lr(t.props), { dynamicChildren: y } = t, b = (e, t, n) => {
			e.shapeFlag & 16 && u(e.children, t, n, i, a, o, s, c);
		}, x = (e = t) => {
			let n = lr(e.props), r = e.target = pr(e.props, m), a = yr(r, e, h, p);
			r && (o !== "svg" && dr(r) ? o = "svg" : o !== "mathml" && fr(r) && (o = "mathml"), i && i.isCE && (i.ce._teleportTargets || (i.ce._teleportTargets = /* @__PURE__ */ new Set())).add(r), n || (b(e, r, a), vr(e, !1)));
		}, S = (e) => {
			let t = () => {
				if (or.get(e) === t) {
					if (or.delete(e), lr(e.props)) {
						let t = _(e.el) || n;
						b(e, t, e.anchor), vr(e, !0);
					}
					x(e);
				}
			};
			or.set(e, t), la(t, a);
		};
		if (e == null) {
			let e = t.el = h(""), i = t.anchor = h("");
			if (p(e, n, r), p(i, n, r), ur(t.props) || a && a.pendingBranch) {
				S(t);
				return;
			}
			v && (b(t, n, i), vr(t, !0)), x();
		} else {
			t.el = e.el;
			let r = t.anchor = e.anchor, u = or.get(e);
			if (u) {
				u.flags |= 8, or.delete(e), S(t);
				return;
			}
			t.targetStart = e.targetStart;
			let p = t.target = e.target, h = t.targetAnchor = e.targetAnchor, g = lr(e.props), _ = g ? n : p, b = g ? r : h;
			if (o === "svg" || dr(p) ? o = "svg" : (o === "mathml" || fr(p)) && (o = "mathml"), y ? (f(e.dynamicChildren, y, _, i, a, o, s), ha(e, t, !0)) : c || d(e, t, _, b, i, a, o, s, !1), v) g ? t.props && e.props && t.props.to !== e.props.to && (t.props.to = e.props.to) : hr(t, n, r, l, 1);
			else if ((t.props && t.props.to) !== (e.props && e.props.to)) {
				let e = pr(t.props, m);
				e && (t.target = e, hr(t, e, null, l, 0));
			} else g && hr(t, p, h, l, 1);
			vr(t, v);
		}
	},
	remove(e, t, n, { um: r, o: { remove: i } }, a) {
		let { shapeFlag: o, children: s, anchor: c, targetStart: l, targetAnchor: u, target: d, props: f } = e, p = lr(f), m = a || !p, h = or.get(e);
		if (h && (h.flags |= 8, or.delete(e)), d && (i(l), i(u)), a && i(c), !h && (p || d) && o & 16) for (let e = 0; e < s.length; e++) {
			let i = s[e];
			r(i, t, n, m, !!i.dynamicChildren);
		}
	},
	move: hr,
	hydrate: gr
};
function hr(e, t, n, { o: { insert: r }, m: i }, a = 2) {
	a === 0 && r(e.targetAnchor, t, n);
	let { el: o, anchor: s, shapeFlag: c, children: l, props: u } = e, d = a === 2;
	if (d && r(o, t, n), !or.has(e) && (!d || lr(u)) && c & 16) for (let e = 0; e < l.length; e++) i(l[e], t, n, 2);
	d && r(s, t, n);
}
function gr(e, t, n, r, i, a, { o: { nextSibling: o, parentNode: s, querySelector: c, insert: l, createText: u } }, d) {
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
	let m = t.target = pr(t.props, c), h = lr(t.props);
	if (m) {
		let c = m._lpa || m.firstChild;
		t.shapeFlag & 16 && (h ? (p(e, t), f(m, c), t.targetAnchor || yr(m, t, u, l, s(e) === m ? e : null)) : (t.anchor = o(e), f(m, c), t.targetAnchor || yr(m, t, u, l), d(c && o(c), t, m, n, r, i, a))), vr(t, h);
	} else h && t.shapeFlag & 16 && (p(e, t), t.targetStart = e, t.targetAnchor = o(e));
	return t.anchor && o(t.anchor);
}
var _r = mr;
function vr(e, t) {
	let n = e.ctx;
	if (n && n.ut) {
		let r, i;
		for (t ? (r = e.el, i = e.anchor) : (r = e.targetStart, i = e.targetAnchor); r && r !== i;) r.nodeType === 1 && r.setAttribute("data-v-owner", n.uid), r = r.nextSibling;
		n.ut();
	}
}
function yr(e, t, n, r, i = null) {
	let a = t.targetStart = n(""), o = t.targetAnchor = n("");
	return a[sr] = o, e && (r(a, e, i), r(o, e, i)), o;
}
var br = /* @__PURE__ */ Symbol("_leaveCb");
function xr(e) {
	let t = e[0];
	if (e.length > 1) {
		for (let n of e) if (n.type !== Ca) {
			t = n;
			break;
		}
	}
	return t;
}
function Sr(e) {
	if (!Mr(e)) return cr(e.type) && e.children ? xr(e.children) : e;
	if (e.component) return e.component.subTree;
	let { shapeFlag: t, children: n } = e;
	if (n) {
		if (t & 16) return n[0];
		if (t & 32 && v(n.default)) return n.default();
	}
}
function Cr(e, t) {
	if (e.shapeFlag & 6 && e.component) {
		e.transition = t;
		let n = e.component.subTree;
		Cr(cr(n.type) && Sr(n) || n, t);
	} else e.shapeFlag & 128 ? (e.ssContent.transition = t.clone(e.ssContent), e.ssFallback.transition = t.clone(e.ssFallback)) : e.transition = t;
}
// @__NO_SIDE_EFFECTS__
function R(e, t) {
	return v(e) ? /* @__PURE__ */ u({ name: e.name }, t, { setup: e }) : e;
}
function wr() {
	let e = Ka();
	return e ? (e.appContext.config.idPrefix || "v") + "-" + e.ids[0] + e.ids[1]++ : "";
}
function Tr(e) {
	e.ids = [
		e.ids[0] + e.ids[2]++ + "-",
		0,
		0
	];
}
function Er(e) {
	let t = Ka(), n = /* @__PURE__ */ P(null);
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
function Dr(e, t) {
	let n;
	return !!((n = Object.getOwnPropertyDescriptor(e, t)) && !n.configurable);
}
var Or = /* @__PURE__ */ new WeakMap();
function kr(e, t, n, r, a = !1) {
	if (m(e)) {
		e.forEach((e, i) => kr(e, t && (m(t) ? t[i] : t), n, r, a));
		return;
	}
	if (jr(r) && !a) {
		r.shapeFlag & 512 && r.type.__asyncResolved && r.component.subTree.component && kr(e, t, n, r.component.subTree);
		return;
	}
	let o = r.shapeFlag & 4 ? ao(r.component) : r.el, c = a ? null : o, { i: l, r: u } = e, f = t && t.r, h = l.refs === i ? l.refs = {} : l.refs, g = l.setupState, _ = /* @__PURE__ */ Qt(g), b = g === i ? s : (e) => !Dr(h, e) && p(_, e), x = (e, t) => !(t && Dr(h, t));
	if (f != null && f !== u) {
		if (Ar(t), y(f)) h[f] = null, b(f) && (g[f] = null);
		else if (/* @__PURE__ */ nn(f)) {
			let e = t;
			x(f, e.k) && (f.value = null), e.k && (h[e.k] = null);
		}
	}
	if (v(u)) Tn(u, l, 12, [c, h]);
	else {
		let t = y(u), r = /* @__PURE__ */ nn(u);
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
					i(), Or.delete(e);
				};
				t.id = -1, Or.set(e, t), la(t, n);
			} else Ar(e), i();
		}
	}
}
function Ar(e) {
	let t = Or.get(e);
	t && (t.flags |= 8, Or.delete(e));
}
le().requestIdleCallback, le().cancelIdleCallback;
var jr = (e) => !!e.type.__asyncLoader, Mr = (e) => e.type.__isKeepAlive;
function Nr(e, t) {
	Fr(e, "a", t);
}
function Pr(e, t) {
	Fr(e, "da", t);
}
function Fr(e, t, n = Ga) {
	let r = e.__wdc ||= () => {
		let t = n;
		for (; t;) {
			if (t.isDeactivated) return;
			t = t.parent;
		}
		return e();
	};
	if (Lr(t, r, n), n) {
		let e = n.parent;
		for (; e && e.parent;) Mr(e.parent.vnode) && Ir(r, t, n, e), e = e.parent;
	}
}
function Ir(e, t, n, r) {
	let i = Lr(t, e, r, !0);
	Wr(() => {
		d(r[t], i);
	}, n);
}
function Lr(e, t, n = Ga, r = !1) {
	if (n) {
		let i = n[e] || (n[e] = []), a = t.__weh ||= (...r) => {
			Je();
			let i = Ya(n), a = En(t, n, e, r);
			return i(), Ye(), a;
		};
		return r ? i.unshift(a) : i.push(a), a;
	}
}
var Rr = (e) => (t, n = Ga) => {
	Qa && e !== "sp" || Lr(e, (...e) => t(...e), n);
}, zr = Rr("bm"), Br = Rr("m"), Vr = Rr("bu"), Hr = Rr("u"), Ur = Rr("bum"), Wr = Rr("um"), Gr = Rr("sp"), Kr = Rr("rtg"), qr = Rr("rtc");
function Jr(e, t = Ga) {
	Lr("ec", e, t);
}
var Yr = "components", Xr = /* @__PURE__ */ Symbol.for("v-ndc");
function Zr(e) {
	return y(e) ? Qr(Yr, e, !1) || e : e || Xr;
}
function Qr(e, t, n = !0, r = !1) {
	let i = Gn || Ga;
	if (i) {
		let n = i.type;
		if (e === Yr) {
			let e = oo(n, !1);
			if (e && (e === t || e === A(t) || e === ne(A(t)))) return n;
		}
		let a = $r(i[e] || n[e], t) || $r(i.appContext[e], t);
		return !a && r ? n : a;
	}
}
function $r(e, t) {
	return e && (e[t] || e[A(t)] || e[ne(A(t))]);
}
function ei(e, t, n, r) {
	let i, a = n && n[r], o = m(e);
	if (o || y(e)) {
		let n = o && /* @__PURE__ */ Jt(e), r = !1, s = !1;
		n && (r = !/* @__PURE__ */ Xt(e), s = /* @__PURE__ */ Yt(e), e = lt(e)), i = Array(e.length);
		for (let n = 0, o = e.length; n < o; n++) i[n] = t(r ? s ? tn(en(e[n])) : en(e[n]) : e[n], n, void 0, a && a[n]);
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
function ti(e, t) {
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
function z(e, t, n, r, i, a) {
	if (n ??= {}, Gn.ce || Gn.parent && jr(Gn.parent) && Gn.parent.ce) {
		let e = a != null && n.key == null ? u({}, n, { key: a }) : n, i = Object.keys(e).length > 0;
		return t !== "default" && (e.name = t), V(), U(B, null, [G("slot", e, r && r())], i ? -2 : 64);
	}
	let o = e[t];
	o && o._c && (o._d = !1);
	let s = Ta.length;
	V();
	let c;
	try {
		let i = o && ni(o(n)), s = n.key || a || i && i.key;
		c = U(B, { key: (s && !b(s) ? s : `_${t}`) + (!i && r ? "_fb" : "") }, i || (r ? r() : []), i && e._ === 1 ? 64 : -2);
	} catch (e) {
		for (let e = Ta.length; e > s; e--) Da();
		throw e;
	} finally {
		o && o._c && (o._d = !0);
	}
	return !i && c.scopeId && (c.slotScopeIds = [c.scopeId + "-s"]), c;
}
function ni(e) {
	return e.some((e) => !ja(e) || !(e.type === Ca || e.type === B && !ni(e.children))) ? e : null;
}
function ri(e, t) {
	let n = {};
	for (let r in e) n[t && /[A-Z]/.test(r) ? `on:${r}` : re(r)] = e[r];
	return n;
}
var ii = (e) => e ? Za(e) ? ao(e) : ii(e.parent) : null, ai = /* @__PURE__ */ u(/* @__PURE__ */ Object.create(null), {
	$: (e) => e,
	$el: (e) => e.vnode.el,
	$data: (e) => e.data,
	$props: (e) => e.props,
	$attrs: (e) => e.attrs,
	$slots: (e) => e.slots,
	$refs: (e) => e.refs,
	$parent: (e) => ii(e.parent),
	$root: (e) => ii(e.root),
	$host: (e) => e.ce,
	$emit: (e) => e.emit,
	$options: (e) => vi(e),
	$forceUpdate: (e) => e.f ||= () => {
		Rn(e.update);
	},
	$nextTick: (e) => e.n ||= In.bind(e.proxy),
	$watch: (e) => ir.bind(e)
}), oi = (e, t) => e !== i && !e.__isScriptSetup && p(e, t), si = {
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
			else if (oi(r, t)) return s[t] = 1, r[t];
			else if (a !== i && p(a, t)) return s[t] = 2, a[t];
			else if (p(o, t)) return s[t] = 3, o[t];
			else if (n !== i && p(n, t)) return s[t] = 4, n[t];
			else pi && (s[t] = 0);
		}
		let u = ai[t], d, f;
		if (u) return t === "$attrs" && at(e.attrs, "get", ""), u(e);
		if ((d = c.__cssModules) && (d = d[t])) return d;
		if (n !== i && p(n, t)) return s[t] = 4, n[t];
		if (f = l.config.globalProperties, p(f, t)) return f[t];
	},
	set({ _: e }, t, n) {
		let { data: r, setupState: a, ctx: o } = e;
		return oi(a, t) ? (a[t] = n, !0) : r !== i && p(r, t) ? (r[t] = n, !0) : p(e.props, t) || t[0] === "$" && t.slice(1) in e ? !1 : (o[t] = n, !0);
	},
	has({ _: { data: e, setupState: t, accessCache: n, ctx: r, appContext: a, props: o, type: s } }, c) {
		let l;
		return !!(n[c] || e !== i && c[0] !== "$" && p(e, c) || oi(t, c) || p(o, c) || p(r, c) || p(ai, c) || p(a.config.globalProperties, c) || (l = s.__cssModules) && l[c]);
	},
	defineProperty(e, t, n) {
		return n.get == null ? p(n, "value") && this.set(e, t, n.value, null) : e._.accessCache[t] = 0, Reflect.defineProperty(e, t, n);
	}
};
function ci() {
	return li("useAttrs").attrs;
}
function li(e) {
	let t = Ka();
	return t.setupContext ||= io(t);
}
function ui(e) {
	return m(e) ? e.reduce((e, t) => (e[t] = null, e), {}) : e;
}
function di(e, t) {
	let n = ui(e);
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
function fi(e, t) {
	return !e || !t ? e || t : m(e) && m(t) ? e.concat(t) : u({}, ui(e), ui(t));
}
var pi = !0;
function mi(e) {
	let t = vi(e), n = e.proxy, r = e.ctx;
	pi = !1, t.beforeCreate && gi(t.beforeCreate, e, "bc");
	let { data: i, computed: a, methods: s, watch: c, provide: l, inject: u, created: d, beforeMount: f, mounted: p, beforeUpdate: h, updated: g, activated: _, deactivated: y, beforeDestroy: b, beforeUnmount: S, destroyed: C, unmounted: w, render: T, renderTracked: E, renderTriggered: D, errorCaptured: O, serverPrefetch: k, expose: ee, inheritAttrs: A, components: j, directives: te, filters: ne } = t;
	if (u && hi(u, r, null), s) for (let e in s) {
		let t = s[e];
		v(t) && (r[e] = t.bind(n));
	}
	if (i) {
		let t = i.call(n, n);
		x(t) && (e.data = /* @__PURE__ */ Ut(t));
	}
	if (pi = !0, a) for (let e in a) {
		let t = a[e], i = Y({
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
	if (c) for (let e in c) _i(c[e], r, n, e);
	if (l) {
		let e = v(l) ? l.call(n) : l;
		Reflect.ownKeys(e).forEach((t) => {
			Xn(t, e[t]);
		});
	}
	d && gi(d, e, "c");
	function re(e, t) {
		m(t) ? t.forEach((t) => e(t.bind(n))) : t && e(t.bind(n));
	}
	if (re(zr, f), re(Br, p), re(Vr, h), re(Hr, g), re(Nr, _), re(Pr, y), re(Jr, O), re(qr, E), re(Kr, D), re(Ur, S), re(Wr, w), re(Gr, k), m(ee)) {
		if (ee.length) {
			let t = e.exposed ||= {};
			ee.forEach((e) => {
				Object.defineProperty(t, e, {
					get: () => n[e],
					set: (t) => n[e] = t,
					enumerable: !0
				});
			});
		} else e.exposed ||= {};
	}
	T && e.render === o && (e.render = T), A != null && (e.inheritAttrs = A), j && (e.components = j), te && (e.directives = te), k && Tr(e);
}
function hi(e, t, n = o) {
	m(e) && (e = Ci(e));
	for (let n in e) {
		let r = e[n], i;
		i = x(r) ? "default" in r ? Zn(r.from || n, r.default, !0) : Zn(r.from || n) : Zn(r), /* @__PURE__ */ nn(i) ? Object.defineProperty(t, n, {
			enumerable: !0,
			configurable: !0,
			get: () => i.value,
			set: (e) => i.value = e
		}) : t[n] = i;
	}
}
function gi(e, t, n) {
	En(m(e) ? e.map((e) => e.bind(t.proxy)) : e.bind(t.proxy), t, n);
}
function _i(e, t, n, r) {
	let i = r.includes(".") ? ar(n, r) : () => n[r];
	if (y(e)) {
		let n = t[e];
		v(n) && L(i, n);
	} else if (v(e)) L(i, e.bind(n));
	else if (x(e)) {
		if (m(e)) e.forEach((e) => _i(e, t, n, r));
		else {
			let r = v(e.handler) ? e.handler.bind(n) : t[e.handler];
			v(r) && L(i, r, e);
		}
	}
}
function vi(e) {
	let t = e.type, { mixins: n, extends: r } = t, { mixins: i, optionsCache: a, config: { optionMergeStrategies: o } } = e.appContext, s = a.get(t), c;
	return s ? c = s : !i.length && !n && !r ? c = t : (c = {}, i.length && i.forEach((e) => yi(c, e, o, !0)), yi(c, t, o)), x(t) && a.set(t, c), c;
}
function yi(e, t, n, r = !1) {
	let { mixins: i, extends: a } = t;
	a && yi(e, a, n, !0), i && i.forEach((t) => yi(e, t, n, !0));
	for (let i in t) if (!(r && i === "expose")) {
		let r = bi[i] || n && n[i];
		e[i] = r ? r(e[i], t[i]) : t[i];
	}
	return e;
}
var bi = {
	data: xi,
	props: Ei,
	emits: Ei,
	methods: Ti,
	computed: Ti,
	beforeCreate: wi,
	created: wi,
	beforeMount: wi,
	mounted: wi,
	beforeUpdate: wi,
	updated: wi,
	beforeDestroy: wi,
	beforeUnmount: wi,
	destroyed: wi,
	unmounted: wi,
	activated: wi,
	deactivated: wi,
	errorCaptured: wi,
	serverPrefetch: wi,
	components: Ti,
	directives: Ti,
	watch: Di,
	provide: xi,
	inject: Si
};
function xi(e, t) {
	return t ? e ? function() {
		return u(v(e) ? e.call(this, this) : e, v(t) ? t.call(this, this) : t);
	} : t : e;
}
function Si(e, t) {
	return Ti(Ci(e), Ci(t));
}
function Ci(e) {
	if (m(e)) {
		let t = {};
		for (let n = 0; n < e.length; n++) t[e[n]] = e[n];
		return t;
	}
	return e;
}
function wi(e, t) {
	return e ? [...new Set([].concat(e, t))] : t;
}
function Ti(e, t) {
	return e ? u(/* @__PURE__ */ Object.create(null), e, t) : t;
}
function Ei(e, t) {
	return e ? m(e) && m(t) ? [.../* @__PURE__ */ new Set([...e, ...t])] : u(/* @__PURE__ */ Object.create(null), ui(e), ui(t ?? {})) : t;
}
function Di(e, t) {
	if (!e) return t;
	if (!t) return e;
	let n = u(/* @__PURE__ */ Object.create(null), e);
	for (let r in t) n[r] = wi(e[r], t[r]);
	return n;
}
function Oi() {
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
var ki = 0;
function Ai(e, t) {
	return function(n, r = null) {
		v(n) || (n = u({}, n)), r != null && !x(r) && (r = null);
		let i = Oi(), a = /* @__PURE__ */ new WeakSet(), o = [], s = !1, c = i.app = {
			_uid: ki++,
			_component: n,
			_props: r,
			_container: null,
			_context: i,
			_instance: null,
			version: fo,
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
					let u = c._ceVNode || G(n, r);
					return u.appContext = i, l === !0 ? l = "svg" : l === !1 && (l = void 0), o && t ? t(u, a) : e(u, a, l), s = !0, c._container = a, a.__vue_app__ = c, ao(u.component);
				}
			},
			onUnmount(e) {
				o.push(e);
			},
			unmount() {
				s && (En(o, c._instance, 16), e(null, c._container), delete c._container.__vue_app__);
			},
			provide(e, t) {
				return i.provides[e] = t, c;
			},
			runWithContext(e) {
				let t = ji;
				ji = c;
				try {
					return e();
				} finally {
					ji = t;
				}
			}
		};
		return c;
	};
}
var ji = null;
function Mi(e, t, n = i) {
	let r = Ka(), a = A(t), o = te(t), s = Ni(e, a), c = dn((s, c) => {
		let l, u = i, d;
		return nr(() => {
			let t = e[a];
			ie(l, t) && (l = t, c());
		}), {
			get() {
				return s(), n.get ? n.get(l) : l;
			},
			set(e) {
				let s = n.set ? n.set(e) : e;
				if (!ie(s, l) && !(u !== i && ie(e, u))) return;
				let f = r.vnode.props, p = !!(f && (t in f || a in f || o in f) && (`onUpdate:${t}` in f || `onUpdate:${a}` in f || `onUpdate:${o}` in f));
				p || (l = e, c()), r.emit(`update:${t}`, s), ie(e, u) && (ie(e, s) && !ie(s, d) || p && u !== i && !ie(s, l)) && c(), u = e, d = s;
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
var Ni = (e, t) => t === "modelValue" || t === "model-value" ? e.modelModifiers : e[`${t}Modifiers`] || e[`${A(t)}Modifiers`] || e[`${te(t)}Modifiers`];
function Pi(e, t, ...n) {
	if (e.isUnmounted) return;
	let r = e.vnode.props || i, a = n, o = t.startsWith("update:"), s = o && Ni(r, t.slice(7));
	s && (s.trim && (a = n.map((e) => y(e) ? e.trim() : e)), s.number && (a = a.map(se)));
	let c, l = r[c = re(t)] || r[c = re(A(t))];
	!l && o && (l = r[c = re(te(t))]), l && En(l, e, 6, a);
	let u = r[c + "Once"];
	if (u) {
		if (!e.emitted) e.emitted = {};
		else if (e.emitted[c]) return;
		e.emitted[c] = !0, En(u, e, 6, a);
	}
}
var Fi = /* @__PURE__ */ new WeakMap();
function Ii(e, t, n = !1) {
	let r = n ? Fi : t.emitsCache, i = r.get(e);
	if (i !== void 0) return i;
	let a = e.emits, o = {}, s = !1;
	if (!v(e)) {
		let r = (e) => {
			let n = Ii(e, t, !0);
			n && (s = !0, u(o, n));
		};
		!n && t.mixins.length && t.mixins.forEach(r), e.extends && r(e.extends), e.mixins && e.mixins.forEach(r);
	}
	return !a && !s ? (x(e) && r.set(e, null), null) : (m(a) ? a.forEach((e) => o[e] = null) : u(o, a), x(e) && r.set(e, o), o);
}
function Li(e, t) {
	return !e || !c(t) ? !1 : (t = t.slice(2), t = t === "Once" ? t : t.replace(/Once$/, ""), p(e, t[0].toLowerCase() + t.slice(1)) || p(e, te(t)) || p(e, t));
}
function Ri(e) {
	let { type: t, vnode: n, proxy: r, withProxy: i, propsOptions: [a], slots: o, attrs: s, emit: c, render: u, renderCache: d, props: f, data: p, setupState: m, ctx: h, inheritAttrs: g } = e, _ = qn(e), v, y;
	try {
		if (n.shapeFlag & 4) {
			let e = i || r, t = e;
			v = Ra(u.call(t, e, d, f, m, p, h)), y = s;
		} else {
			let e = t;
			v = Ra(e.length > 1 ? e(f, {
				attrs: s,
				slots: o,
				emit: c
			}) : e(f, null)), y = t.props ? s : zi(s);
		}
	} catch (t) {
		Ta.length = 0, Dn(t, e, 1), v = G(Ca);
	}
	let b = v;
	if (y && g !== !1) {
		let e = Object.keys(y), { shapeFlag: t } = b;
		e.length && t & 7 && (a && e.some(l) && (y = Bi(y, a)), b = La(b, y, !1, !0));
	}
	return n.dirs && (b = La(b, null, !1, !0), b.dirs = b.dirs ? b.dirs.concat(n.dirs) : n.dirs), n.transition && Cr(cr(b.type) && Sr(b) || b, n.transition), v = b, qn(_), v;
}
var zi = (e) => {
	let t;
	for (let n in e) (n === "class" || n === "style" || c(n)) && ((t ||= {})[n] = e[n]);
	return t;
}, Bi = (e, t) => {
	let n = {};
	for (let r in e) l(r) && r.slice(9) in t || (n[r] = e[r]);
	return n;
};
function Vi(e, t, n) {
	let { props: r, children: i, component: a } = e, { props: o, children: s, patchFlag: c } = t, l = a.emitsOptions;
	if (t.dirs || t.transition) return !0;
	if (n && c >= 0) {
		if (c & 1024) return !0;
		if (c & 16) return r ? Hi(r, o, l) : !!o;
		if (c & 8) {
			let e = t.dynamicProps;
			for (let t = 0; t < e.length; t++) {
				let n = e[t];
				if (Ui(o, r, n) && !Li(l, n)) return !0;
			}
		}
	} else return (i || s) && (!s || !s.$stable) ? !0 : r === o ? !1 : r ? !o || Hi(r, o, l) : !!o;
	return !1;
}
function Hi(e, t, n) {
	let r = Object.keys(t);
	if (r.length !== Object.keys(e).length) return !0;
	for (let i = 0; i < r.length; i++) {
		let a = r[i];
		if (Ui(t, e, a) && !Li(n, a)) return !0;
	}
	return !1;
}
function Ui(e, t, n) {
	let r = e[n], i = t[n];
	return n === "style" && x(r) && x(i) ? !xe(r, i) : r !== i;
}
function Wi({ vnode: e, parent: t, suspense: n }, r) {
	for (; t;) {
		let n = t.subTree;
		if (n.suspense && n.suspense.activeBranch === e && (n.suspense.vnode.el = n.el = r, e = n), n === e) (e = t.vnode).el = r, t = t.parent;
		else break;
	}
	n && n.activeBranch === e && (n.vnode.el = r);
}
var Gi = {}, Ki = () => Object.create(Gi), qi = (e) => Object.getPrototypeOf(e) === Gi;
function Ji(e, t, n, r = !1) {
	let i = {}, a = Ki();
	e.propsDefaults = /* @__PURE__ */ Object.create(null), Xi(e, t, i, a);
	for (let t in e.propsOptions[0]) t in i || (i[t] = void 0);
	e.props = n ? r ? i : /* @__PURE__ */ Wt(i) : e.type.props ? i : a, e.attrs = a;
}
function Yi(e, t, n, r) {
	let { props: i, attrs: a, vnode: { patchFlag: o } } = e, s = /* @__PURE__ */ Qt(i), [c] = e.propsOptions, l = !1;
	if ((r || o > 0) && !(o & 16)) {
		if (o & 8) {
			let n = e.vnode.dynamicProps;
			for (let r = 0; r < n.length; r++) {
				let o = n[r];
				if (Li(e.emitsOptions, o)) continue;
				let u = t[o];
				if (c) {
					if (p(a, o)) u !== a[o] && (a[o] = u, l = !0);
					else {
						let t = A(o);
						i[t] = Zi(c, s, t, u, e, !1);
					}
				} else u !== a[o] && (a[o] = u, l = !0);
			}
		}
	} else {
		Xi(e, t, i, a) && (l = !0);
		let r;
		for (let a in s) t && (p(t, a) || (r = te(a)) !== a && p(t, r)) || (c ? n && (n[a] !== void 0 || n[r] !== void 0) && (i[a] = Zi(c, s, a, void 0, e, !0)) : delete i[a]);
		if (a !== s) for (let e in a) t && p(t, e) || (delete a[e], l = !0);
	}
	l && ot(e.attrs, "set", "");
}
function Xi(e, t, n, r) {
	let [a, o] = e.propsOptions, s = !1, c;
	if (t) for (let i in t) {
		if (O(i)) continue;
		let l = t[i], u;
		a && p(a, u = A(i)) ? !o || !o.includes(u) ? n[u] = l : (c ||= {})[u] = l : Li(e.emitsOptions, i) || i in r && l === r[i] || (r[i] = l, s = !0);
	}
	if (o) {
		let t = /* @__PURE__ */ Qt(n), r = c || i;
		for (let i = 0; i < o.length; i++) {
			let s = o[i];
			n[s] = Zi(a, t, s, r[s], e, !p(r, s));
		}
	}
	return s;
}
function Zi(e, t, n, r, i, a) {
	let o = e[n];
	if (o != null) {
		let e = p(o, "default");
		if (e && r === void 0) {
			let e = o.default;
			if (o.type !== Function && !o.skipFactory && v(e)) {
				let { propsDefaults: a } = i;
				if (n in a) r = a[n];
				else {
					let o = Ya(i);
					r = a[n] = e.call(null, t), o();
				}
			} else r = e;
			i.ce && i.ce._setProp(n, r);
		}
		o[0] && (a && !e ? r = !1 : o[1] && (r === "" || r === te(n)) && (r = !0));
	}
	return r;
}
var Qi = /* @__PURE__ */ new WeakMap();
function $i(e, t, n = !1) {
	let r = n ? Qi : t.propsCache, o = r.get(e);
	if (o) return o;
	let s = e.props, c = {}, l = [], d = !1;
	if (!v(e)) {
		let r = (e) => {
			d = !0;
			let [n, r] = $i(e, t, !0);
			u(c, n), r && l.push(...r);
		};
		!n && t.mixins.length && t.mixins.forEach(r), e.extends && r(e.extends), e.mixins && e.mixins.forEach(r);
	}
	if (!s && !d) return x(e) && r.set(e, a), a;
	if (m(s)) for (let e = 0; e < s.length; e++) {
		let t = A(s[e]);
		ea(t) && (c[t] = i);
	}
	else if (s) for (let e in s) {
		let t = A(e);
		if (ea(t)) {
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
function ea(e) {
	return e[0] !== "$" && !O(e);
}
var ta = (e) => e === "_" || e === "_ctx" || e === "$stable", na = (e) => m(e) ? e.map(Ra) : [Ra(e)], ra = (e, t, n) => {
	if (t._n) return t;
	let r = I((...e) => na(t(...e)), n);
	return r._c = !1, r;
}, ia = (e, t, n) => {
	let r = e._ctx;
	for (let n in e) {
		if (ta(n)) continue;
		let i = e[n];
		if (v(i)) t[n] = ra(n, i, r);
		else if (i != null) {
			let e = na(i);
			t[n] = () => e;
		}
	}
}, aa = (e, t) => {
	let n = na(t);
	e.slots.default = () => n;
}, oa = (e, t, n) => {
	for (let r in t) (n || !ta(r)) && (e[r] = t[r]);
}, sa = (e, t, n) => {
	let r = e.slots = Ki();
	if (e.vnode.shapeFlag & 32) {
		let e = t._;
		e ? (oa(r, t, n), n && oe(r, "_", e, !0)) : ia(t, r);
	} else t && aa(e, t);
}, ca = (e, t, n) => {
	let { vnode: r, slots: a } = e, o = !0, s = i;
	if (r.shapeFlag & 32) {
		let e = t._;
		e ? n && e === 1 ? o = !1 : oa(a, t, n) : (o = !t.$stable, ia(t, a)), s = t;
	} else t && (aa(e, t), s = { default: 1 });
	if (o) for (let e in a) !ta(e) && s[e] == null && delete a[e];
}, la = xa;
function ua(e) {
	return da(e);
}
function da(e, t) {
	let n = le();
	n.__VUE__ = !0;
	let { insert: r, remove: s, patchProp: c, createElement: l, createText: u, createComment: d, setText: f, setElementText: p, parentNode: m, nextSibling: h, setScopeId: g = o, insertStaticContent: _ } = e, v = (e, t, n, r = null, i = null, a = null, o = void 0, s = null, c = !!t.dynamicChildren) => {
		if (e === t) return;
		e && !Ma(e, t) && (r = _e(e), fe(e, i, a, !0), e = null), t.patchFlag === -2 && (c = !1, t.dynamicChildren = null);
		let { type: l, ref: u, shapeFlag: d } = t;
		switch (l) {
			case Sa:
				y(e, t, n, r);
				break;
			case Ca:
				b(e, t, n, r);
				break;
			case wa:
				e ?? x(t, n, r, o);
				break;
			case B:
				j(e, t, n, r, i, a, o, s, c);
				break;
			default: d & 1 ? w(e, t, n, r, i, a, o, s, c) : d & 6 ? te(e, t, n, r, i, a, o, s, c) : (d & 64 || d & 128) && l.process(e, t, n, r, i, a, o, s, c, be);
		}
		u != null && i ? kr(u, e && e.ref, a, t || e, !t) : u == null && e && e.ref != null && kr(e.ref, null, a, e, !0);
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
		if (d = e.el = l(e.type, o, m && m.is, m), h & 8 ? p(d, e.children) : h & 16 && D(e.children, d, null, i, a, fa(e, o), s, u), _ && Yn(e, null, i, "created"), E(d, e, e.scopeId, s, i), m) {
			for (let e in m) e !== "value" && !O(e) && c(d, e, null, m[e], o, i);
			"value" in m && c(d, "value", null, m.value, o), (f = m.onVnodeBeforeMount) && Va(f, i, e);
		}
		_ && Yn(e, null, i, "beforeMount");
		let v = ma(a, g);
		v && g.beforeEnter(d), r(d, t, n), ((f = m && m.onVnodeMounted) || v || _) && la(() => {
			try {
				f && Va(f, i, e), v && g.enter(d), _ && Yn(e, null, i, "mounted");
			} finally {}
		}, a);
	}, E = (e, t, n, r, i) => {
		if (n && g(e, n), r) for (let t = 0; t < r.length; t++) g(e, r[t]);
		if (i) {
			let n = i.subTree;
			if (t === n || ba(n.type) && (n.ssContent === t || n.ssFallback === t)) {
				let t = i.vnode;
				E(e, t, t.scopeId, t.slotScopeIds, i.parent);
			}
		}
	}, D = (e, t, n, r, i, a, o, s, c = 0) => {
		for (let l = c; l < e.length; l++) {
			let c = e[l] = s ? za(e[l]) : Ra(e[l]);
			v(null, c, t, n, r, i, a, o, s);
		}
	}, k = (e, t, n, r, a, o, s) => {
		let l = t.el = e.el, { patchFlag: u, dynamicChildren: d, dirs: f } = t;
		u |= e.patchFlag & 16;
		let m = e.props || i, h = t.props || i, g;
		if (n && pa(n, !1), (g = h.onVnodeBeforeUpdate) && Va(g, n, t, e), f && Yn(t, e, n, "beforeUpdate"), n && pa(n, !0), d && (!e.dynamicChildren || e.dynamicChildren.length !== d.length) && (u = 0, s = !1, d = null), (m.innerHTML && h.innerHTML == null || m.textContent && h.textContent == null) && p(l, ""), d ? ee(e.dynamicChildren, d, l, n, r, fa(t, a), o) : s || se(e, t, l, null, n, r, fa(t, a), o, !1), u > 0) {
			if (u & 16) A(l, m, h, n, a);
			else if (u & 2 && m.class !== h.class && c(l, "class", null, h.class, a), u & 4 && c(l, "style", m.style, h.style, a), u & 8) {
				let e = t.dynamicProps;
				for (let t = 0; t < e.length; t++) {
					let r = e[t], i = m[r], o = h[r];
					(o !== i || r === "value") && c(l, r, i, o, a, n);
				}
			}
			u & 1 && e.children !== t.children && p(l, t.children);
		} else !s && d == null && A(l, m, h, n, a);
		((g = h.onVnodeUpdated) || f) && la(() => {
			g && Va(g, n, t, e), f && Yn(t, e, n, "updated");
		}, r);
	}, ee = (e, t, n, r, i, a, o) => {
		for (let s = 0; s < t.length; s++) {
			let c = e[s], l = t[s], u = c.el && (c.type === B || !Ma(c, l) || c.shapeFlag & 198) ? m(c.el) : n;
			v(c, l, u, null, r, i, a, o, !0);
		}
	}, A = (e, t, n, r, a) => {
		if (t !== n) {
			if (t !== i) for (let i in t) !O(i) && !(i in n) && c(e, i, t[i], null, a, r);
			for (let i in n) {
				if (O(i)) continue;
				let o = n[i], s = t[i];
				o !== s && i !== "value" && c(e, i, s, o, a, r);
			}
			"value" in n && c(e, "value", t.value, n.value, a);
		}
	}, j = (e, t, n, i, a, o, s, c, l) => {
		let d = t.el = e ? e.el : u(""), f = t.anchor = e ? e.anchor : u(""), { patchFlag: p, dynamicChildren: m, slotScopeIds: h } = t;
		h && (c = c ? c.concat(h) : h), e == null ? (r(d, n, i), r(f, n, i), D(t.children || [], n, f, a, o, s, c, l)) : p > 0 && p & 64 && m && e.dynamicChildren && e.dynamicChildren.length === m.length ? (ee(e.dynamicChildren, m, n, a, o, s, c), (t.key != null || a && t === a.subTree) && ha(e, t, !0)) : se(e, t, n, f, a, o, s, c, l);
	}, te = (e, t, n, r, i, a, o, s, c) => {
		t.slotScopeIds = s, e == null ? t.shapeFlag & 512 ? i.ctx.activate(t, n, r, o, c) : ne(t, n, r, i, a, o, c) : re(e, t, c);
	}, ne = (e, t, n, r, i, a, o) => {
		let s = e.component = Wa(e, r, i);
		if (Mr(e) && (s.ctx.renderer = be), $a(s, !1, o), s.asyncDep) {
			if (i && i.registerDep(s, ie, o), !e.el) {
				let r = s.subTree = G(Ca);
				b(null, r, t, n), e.placeholder = r.el;
			}
		} else ie(s, e, t, n, i, a, o);
	}, re = (e, t, n) => {
		let r = t.component = e.component;
		if (Vi(e, t, n)) {
			if (r.asyncDep && !r.asyncResolved) {
				oe(r, t, n);
				return;
			}
			r.next = t, r.update();
		} else t.el = e.el, r.vnode = t;
	}, ie = (e, t, n, r, i, a, o) => {
		let s = () => {
			if (e.isMounted) {
				let { next: t, bu: n, u: r, parent: s, vnode: c } = e;
				{
					let n = _a(e);
					if (n) {
						t && (t.el = c.el, oe(e, t, o)), n.asyncDep.then(() => {
							la(() => {
								e.isUnmounted || l();
							}, i);
						});
						return;
					}
				}
				let u = t, d;
				pa(e, !1), t ? (t.el = c.el, oe(e, t, o)) : t = c, n && ae(n), (d = t.props && t.props.onVnodeBeforeUpdate) && Va(d, s, t, c), pa(e, !0);
				let f = Ri(e), p = e.subTree;
				e.subTree = f, v(p, f, m(p.el), _e(p), e, i, a), t.el = f.el, u === null && Wi(e, f.el), r && la(r, i), (d = t.props && t.props.onVnodeUpdated) && la(() => Va(d, s, t, c), i);
			} else {
				let o, { el: s, props: c } = t, { bm: l, m: u, parent: d, root: f, type: p } = e, m = jr(t);
				if (pa(e, !1), l && ae(l), !m && (o = c && c.onVnodeBeforeMount) && Va(o, d, t), pa(e, !0), s && Se) {
					let t = () => {
						e.subTree = Ri(e), Se(s, e.subTree, e, i, null);
					};
					m && p.__asyncHydrate ? p.__asyncHydrate(s, e, t) : t();
				} else {
					f.ce && f.ce._hasShadowRoot() && f.ce._injectChildStyle(p, e.parent ? e.parent.type : void 0);
					let o = e.subTree = Ri(e);
					v(null, o, n, r, e, i, a), t.el = o.el;
				}
				if (u && la(u, i), !m && (o = c && c.onVnodeMounted)) {
					let e = t;
					la(() => Va(o, d, e), i);
				}
				(t.shapeFlag & 256 || d && jr(d.vnode) && d.vnode.shapeFlag & 256) && e.a && la(e.a, i), e.isMounted = !0, t = n = r = null;
			}
		};
		e.scope.on();
		let c = e.effect = new Ne(s);
		e.scope.off();
		let l = e.update = c.run.bind(c), u = e.job = c.runIfDirty.bind(c);
		u.i = e, u.id = e.uid, c.scheduler = () => Rn(u), pa(e, !0), l();
	}, oe = (e, t, n) => {
		t.component = e;
		let r = e.vnode.props;
		e.vnode = t, e.next = null, Yi(e, t.props, r, n), ca(e, t.children, n), Je(), Vn(e), Ye();
	}, se = (e, t, n, r, i, a, o, s, c = !1) => {
		let l = e && e.children, u = e ? e.shapeFlag : 0, d = t.children, { patchFlag: f, shapeFlag: m } = t;
		if (f > 0) {
			if (f & 128) {
				ue(l, d, n, r, i, a, o, s, c);
				return;
			}
			if (f & 256) {
				ce(l, d, n, r, i, a, o, s, c);
				return;
			}
		}
		m & 8 ? (u & 16 && ge(l, i, a), d !== l && p(n, d)) : u & 16 ? m & 16 ? ue(l, d, n, r, i, a, o, s, c) : ge(l, i, a, !0) : (u & 8 && p(n, ""), m & 16 && D(d, n, r, i, a, o, s, c));
	}, ce = (e, t, n, r, i, o, s, c, l) => {
		e ||= a, t ||= a;
		let u = e.length, d = t.length, f = Math.min(u, d), p = 0;
		for (; p < f; p++) {
			let r = t[p] = l ? za(t[p]) : Ra(t[p]);
			v(e[p], r, n, null, i, o, s, c, l);
		}
		u > d ? ge(e, i, o, !0, !1, f) : D(t, n, r, i, o, s, c, l, f);
	}, ue = (e, t, n, r, i, o, s, c, l) => {
		let u = 0, d = t.length, f = e.length - 1, p = d - 1;
		for (; u <= f && u <= p;) {
			let r = e[u], a = t[u] = l ? za(t[u]) : Ra(t[u]);
			if (Ma(r, a)) v(r, a, n, null, i, o, s, c, l);
			else break;
			u++;
		}
		for (; u <= f && u <= p;) {
			let r = e[f], a = t[p] = l ? za(t[p]) : Ra(t[p]);
			if (Ma(r, a)) v(r, a, n, null, i, o, s, c, l);
			else break;
			f--, p--;
		}
		if (u > f) {
			if (u <= p) {
				let e = p + 1, a = e < d ? t[e].el : r;
				for (; u <= p;) v(null, t[u] = l ? za(t[u]) : Ra(t[u]), n, a, i, o, s, c, l), u++;
			}
		} else if (u > p) for (; u <= f;) fe(e[u], i, o, !0), u++;
		else {
			let m = u, h = u, g = /* @__PURE__ */ new Map();
			for (u = h; u <= p; u++) {
				let e = t[u] = l ? za(t[u]) : Ra(t[u]);
				e.key != null && g.set(e.key, u);
			}
			let _, y = 0, b = p - h + 1, x = !1, S = 0, C = Array(b);
			for (u = 0; u < b; u++) C[u] = 0;
			for (u = m; u <= f; u++) {
				let r = e[u];
				if (y >= b) {
					fe(r, i, o, !0);
					continue;
				}
				let a;
				if (r.key != null) a = g.get(r.key);
				else for (_ = h; _ <= p; _++) if (C[_ - h] === 0 && Ma(r, t[_])) {
					a = _;
					break;
				}
				a === void 0 ? fe(r, i, o, !0) : (C[a - h] = u + 1, a >= S ? S = a : x = !0, v(r, t[a], n, null, i, o, s, c, l), y++);
			}
			let w = x ? ga(C) : a;
			for (_ = w.length - 1, u = b - 1; u >= 0; u--) {
				let e = h + u, a = t[e], f = t[e + 1], p = e + 1 < d ? f.el || ya(f) : r;
				C[u] === 0 ? v(null, a, n, p, i, o, s, c, l) : x && (_ < 0 || u !== w[_] ? de(a, n, p, 2) : _--);
			}
		}
	}, de = (e, t, n, i, a = null) => {
		let { el: o, type: c, transition: l, children: u, shapeFlag: d } = e;
		if (d & 6) de(e.component.subTree, t, n, i);
		else if (d & 128) e.suspense.move(t, n, i);
		else if (d & 64) c.move(e, t, n, be);
		else if (c === B) {
			r(o, t, n);
			for (let e = 0; e < u.length; e++) de(u[e], t, n, i);
			r(e.anchor, t, n);
		} else if (c === wa) S(e, t, n);
		else if (i !== 2 && d & 1 && l) {
			if (i === 0) l.persisted && !o[br] ? r(o, t, n) : (l.beforeEnter(o), r(o, t, n), la(() => l.enter(o), a));
			else {
				let { leave: i, delayLeave: a, afterLeave: c } = l, u = () => {
					e.ctx.isUnmounted ? s(o) : r(o, t, n);
				}, d = () => {
					let e = o._isLeaving || !!o[br];
					o._isLeaving && o[br](!0), l.persisted && !e ? u() : i(o, () => {
						u(), c && c();
					});
				};
				a ? a(o, u, d) : d();
			}
		} else r(o, t, n);
	}, fe = (e, t, n, r = !1, i = !1) => {
		let { type: a, props: o, ref: s, children: c, dynamicChildren: l, shapeFlag: u, patchFlag: d, dirs: f, cacheIndex: p, memo: m } = e;
		if (d === -2 && (i = !1), s != null && (Je(), kr(s, null, n, e, !0), Ye()), p != null && (t.renderCache[p] = void 0), u & 256) {
			t.ctx.deactivate(e);
			return;
		}
		let h = u & 1 && f, g = !jr(e), _;
		if (g && (_ = o && o.onVnodeBeforeUnmount) && Va(_, t, e), u & 6) he(e.component, n, r);
		else {
			if (u & 128) {
				e.suspense.unmount(n, r);
				return;
			}
			h && Yn(e, null, t, "beforeUnmount"), u & 64 ? e.type.remove(e, t, n, be, r) : l && !l.hasOnce && (a !== B || d > 0 && d & 64) ? ge(l, t, n, !1, !0) : (a === B && d & 384 || !i && u & 16) && ge(c, t, n), r && pe(e);
		}
		let v = m != null && p == null;
		(g && (_ = o && o.onVnodeUnmounted) || h || v) && la(() => {
			_ && Va(_, t, e), h && Yn(e, null, t, "unmounted"), v && (e.el = null);
		}, n);
	}, pe = (e) => {
		let { type: t, el: n, anchor: r, transition: i } = e;
		if (t === B) {
			me(n, r);
			return;
		}
		if (t === wa) {
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
	}, me = (e, t) => {
		let n;
		for (; e !== t;) n = h(e), s(e), e = n;
		s(t);
	}, he = (e, t, n) => {
		let { bum: r, scope: i, job: a, subTree: o, um: s, m: c, a: l } = e;
		va(c), va(l), r && ae(r), i.stop(), a && (a.flags |= 8, fe(o, e, t, n)), s && la(s, t), la(() => {
			e.isUnmounted = !0;
		}, t);
	}, ge = (e, t, n, r = !1, i = !1, a = 0) => {
		for (let o = a; o < e.length; o++) fe(e[o], t, n, r, i);
	}, _e = (e) => {
		if (e.shapeFlag & 6) return _e(e.component.subTree);
		if (e.shapeFlag & 128) return e.suspense.next();
		let t = h(e.anchor || e.el), n = t && t[sr];
		return n ? h(n) : t;
	}, ve = !1, ye = (e, t, n) => {
		let r;
		e == null ? t._vnode && (fe(t._vnode, null, null, !0), r = t._vnode.component) : v(t._vnode || null, e, t, null, null, null, n), t._vnode = e, ve ||= (ve = !0, Vn(r), Hn(), !1);
	}, be = {
		p: v,
		um: fe,
		m: de,
		r: pe,
		mt: ne,
		mc: D,
		pc: se,
		pbc: ee,
		n: _e,
		o: e
	}, xe, Se;
	return t && ([xe, Se] = t(be)), {
		render: ye,
		hydrate: xe,
		createApp: Ai(ye, xe)
	};
}
function fa({ type: e, props: t }, n) {
	return n === "svg" && e === "foreignObject" || n === "mathml" && e === "annotation-xml" && t && t.encoding && t.encoding.includes("html") ? void 0 : n;
}
function pa({ effect: e, job: t }, n) {
	n ? (e.flags |= 32, t.flags |= 4) : (e.flags &= -33, t.flags &= -5);
}
function ma(e, t) {
	return (!e || e && !e.pendingBranch) && t && !t.persisted;
}
function ha(e, t, n = !1) {
	let r = e.children, i = t.children;
	if (m(r) && m(i)) for (let e = 0; e < r.length; e++) {
		let t = r[e], a = i[e];
		a.shapeFlag & 1 && !a.dynamicChildren && ((a.patchFlag <= 0 || a.patchFlag === 32) && (a = i[e] = za(i[e]), a.el = t.el), !n && a.patchFlag !== -2 && ha(t, a)), a.type === Sa && (a.patchFlag === -1 && (a = i[e] = za(a)), a.el = t.el), a.type === Ca && !a.el && (a.el = t.el);
	}
}
function ga(e) {
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
function _a(e) {
	let t = e.subTree.component;
	if (t) return t.asyncDep && !t.asyncResolved ? t : _a(t);
}
function va(e) {
	if (e) for (let t = 0; t < e.length; t++) e[t].flags |= 8;
}
function ya(e) {
	if (e.placeholder) return e.placeholder;
	let t = e.component;
	return t ? ya(t.subTree) : null;
}
var ba = (e) => e.__isSuspense;
function xa(e, t) {
	t && t.pendingBranch ? m(e) ? t.effects.push(...e) : t.effects.push(e) : Bn(e);
}
var B = /* @__PURE__ */ Symbol.for("v-fgt"), Sa = /* @__PURE__ */ Symbol.for("v-txt"), Ca = /* @__PURE__ */ Symbol.for("v-cmt"), wa = /* @__PURE__ */ Symbol.for("v-stc"), Ta = [], Ea = null;
function V(e = !1) {
	Ta.push(Ea = e ? null : []);
}
function Da() {
	Ta.pop(), Ea = Ta[Ta.length - 1] || null;
}
var Oa = 1;
function ka(e, t = !1) {
	Oa += e, e < 0 && Ea && t && (Ea.hasOnce = !0);
}
function Aa(e) {
	return e.dynamicChildren = Oa > 0 ? Ea || a : null, Da(), Oa > 0 && Ea && Ea.push(e), e;
}
function H(e, t, n, r, i, a) {
	return Aa(W(e, t, n, r, i, a, !0));
}
function U(e, t, n, r, i) {
	return Aa(G(e, t, n, r, i, !0));
}
function ja(e) {
	return e ? e.__v_isVNode === !0 : !1;
}
function Ma(e, t) {
	return e.type === t.type && e.key === t.key;
}
var Na = ({ key: e }) => e ?? null, Pa = ({ ref: e, ref_key: t, ref_for: n }) => (typeof e == "number" && (e = "" + e), e == null ? null : y(e) || /* @__PURE__ */ nn(e) || v(e) ? {
	i: Gn,
	r: e,
	k: t,
	f: !!n
} : e);
function W(e, t = null, n = null, r = 0, i = null, a = e === B ? 0 : 1, o = !1, s = !1) {
	let c = {
		__v_isVNode: !0,
		__v_skip: !0,
		type: e,
		props: t,
		key: t && Na(t),
		ref: t && Pa(t),
		scopeId: Kn,
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
		ctx: Gn
	};
	return s ? (Ba(c, n), a & 128 && e.normalize(c)) : n && (c.shapeFlag |= y(n) ? 8 : 16), Oa > 0 && !o && Ea && (c.patchFlag > 0 || a & 6) && c.patchFlag !== 32 && Ea.push(c), c;
}
var G = Fa;
function Fa(e, t = null, n = null, r = 0, i = null, a = !1) {
	if (e && e !== Xr || (e = Ca), ja(e)) {
		let r = La(e, t, !0);
		return n && Ba(r, n), Oa > 0 && !a && Ea && (r.shapeFlag & 6 ? Ea[Ea.indexOf(e)] = r : Ea.push(r)), r.patchFlag = -2, r;
	}
	if (so(e) && (e = e.__vccOpts), t) {
		t = Ia(t);
		let { class: e, style: n } = t;
		e && !y(e) && (t.class = he(e)), x(n) && (/* @__PURE__ */ Zt(n) && !m(n) && (n = u({}, n)), t.style = ue(n));
	}
	let o = y(e) ? 1 : ba(e) ? 128 : cr(e) ? 64 : x(e) ? 4 : v(e) ? 2 : 0;
	return W(e, t, n, r, i, o, a, !0);
}
function Ia(e) {
	return e ? /* @__PURE__ */ Zt(e) || qi(e) ? u({}, e) : e : null;
}
function La(e, t, n = !1, r = !1) {
	let { props: i, ref: a, patchFlag: o, children: s, transition: c } = e, l = t ? J(i || {}, t) : i, u = {
		__v_isVNode: !0,
		__v_skip: !0,
		type: e.type,
		props: l,
		key: l && Na(l),
		ref: t && t.ref ? n && a ? m(a) ? a.concat(Pa(t)) : [a, Pa(t)] : Pa(t) : a,
		scopeId: e.scopeId,
		slotScopeIds: e.slotScopeIds,
		children: s,
		target: e.target,
		targetStart: e.targetStart,
		targetAnchor: e.targetAnchor,
		staticCount: e.staticCount,
		shapeFlag: e.shapeFlag,
		patchFlag: t && e.type !== B ? o === -1 ? 16 : o | 16 : o,
		dynamicProps: e.dynamicProps,
		dynamicChildren: e.dynamicChildren,
		appContext: e.appContext,
		dirs: e.dirs,
		transition: c,
		component: e.component,
		suspense: e.suspense,
		ssContent: e.ssContent && La(e.ssContent),
		ssFallback: e.ssFallback && La(e.ssFallback),
		placeholder: e.placeholder,
		el: e.el,
		anchor: e.anchor,
		ctx: e.ctx,
		ce: e.ce
	};
	return c && r && Cr(u, c.clone(u)), u;
}
function K(e = " ", t = 0) {
	return G(Sa, null, e, t);
}
function q(e = "", t = !1) {
	return t ? (V(), U(Ca, null, e)) : G(Ca, null, e);
}
function Ra(e) {
	return e == null || typeof e == "boolean" ? G(Ca) : m(e) ? G(B, null, e.slice()) : ja(e) ? za(e) : G(Sa, null, String(e));
}
function za(e) {
	return e.el === null && e.patchFlag !== -1 || e.memo ? e : La(e);
}
function Ba(e, t) {
	let n = 0, { shapeFlag: r } = e;
	if (t == null) t = null;
	else if (m(t)) n = 16;
	else if (typeof t == "object") {
		if (r & 65) {
			let n = t.default;
			n && (n._c && (n._d = !1), Ba(e, n()), n._c && (n._d = !0));
			return;
		}
		{
			n = 32;
			let r = t._;
			!r && !qi(t) ? t._ctx = Gn : r === 3 && Gn && (Gn.slots._ === 1 ? t._ = 1 : (t._ = 2, e.patchFlag |= 1024));
		}
	} else if (v(t)) {
		if (r & 65) {
			Ba(e, { default: t });
			return;
		}
		t = {
			default: t,
			_ctx: Gn
		}, n = 32;
	} else t = String(t), r & 64 ? (n = 16, t = [K(t)]) : n = 8;
	e.children = t, e.shapeFlag |= n;
}
function J(...e) {
	let t = {};
	for (let n = 0; n < e.length; n++) {
		let r = e[n];
		for (let e in r) if (e === "class") t.class !== r.class && (t.class = he([t.class, r.class]));
		else if (e === "style") t.style = ue([t.style, r.style]);
		else if (c(e)) {
			let n = t[e], i = r[e];
			i && n !== i && !(m(n) && n.includes(i)) ? t[e] = n ? [].concat(n, i) : i : i == null && n == null && !l(e) && (t[e] = i);
		} else e !== "" && (t[e] = r[e]);
	}
	return t;
}
function Va(e, t, n, r = null) {
	En(e, t, 7, [n, r]);
}
var Ha = Oi(), Ua = 0;
function Wa(e, t, n) {
	let r = e.type, a = (t ? t.appContext : e.appContext) || Ha, o = {
		uid: Ua++,
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
		scope: new De(!0),
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
		propsOptions: $i(r, a),
		emitsOptions: Ii(r, a),
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
	return o.ctx = { _: o }, o.root = t ? t.root : o, o.emit = Pi.bind(null, o), e.ce && e.ce(o), o;
}
var Ga = null, Ka = () => Ga || Gn, qa, Ja;
{
	let e = le(), t = (t, n) => {
		let r;
		return (r = e[t]) || (r = e[t] = []), r.push(n), (e) => {
			r.length > 1 ? r.forEach((t) => t(e)) : r[0](e);
		};
	};
	qa = t("__VUE_INSTANCE_SETTERS__", (e) => Ga = e), Ja = t("__VUE_SSR_SETTERS__", (e) => Qa = e);
}
var Ya = (e) => {
	let t = Ga;
	return qa(e), e.scope.on(), () => {
		e.scope.off(), qa(t);
	};
}, Xa = () => {
	Ga && Ga.scope.off(), qa(null);
};
function Za(e) {
	return e.vnode.shapeFlag & 4;
}
var Qa = !1;
function $a(e, t = !1, n = !1) {
	t && Ja(t);
	let { props: r, children: i } = e.vnode, a = Za(e);
	Ji(e, r, a, t), sa(e, i, n || t);
	let o = a ? eo(e, t) : void 0;
	return t && Ja(!1), o;
}
function eo(e, t) {
	let n = e.type;
	e.accessCache = /* @__PURE__ */ Object.create(null), e.proxy = new Proxy(e.ctx, si);
	let { setup: r } = n;
	if (r) {
		Je();
		let n = e.setupContext = r.length > 1 ? io(e) : null, i = Ya(e), a = Tn(r, e, 0, [e.props, n]), o = S(a);
		if (Ye(), i(), (o || e.sp) && !jr(e) && Tr(e), o) {
			if (a.then(Xa, Xa), t) return a.then((n) => {
				Ja(!0);
				try {
					to(e, n, t);
				} finally {
					Ja(!1);
				}
			}).catch((t) => {
				Dn(t, e, 0);
			});
			e.asyncDep = a;
		} else to(e, a, t);
	} else no(e, t);
}
function to(e, t, n) {
	v(t) ? e.type.__ssrInlineRender ? e.ssrRender = t : e.render = t : x(t) && (e.setupState = ln(t)), no(e, n);
}
function no(e, t, n) {
	let r = e.type;
	e.render ||= r.render || o;
	{
		let t = Ya(e);
		Je();
		try {
			mi(e);
		} finally {
			Ye(), t();
		}
	}
}
var ro = { get(e, t) {
	return at(e, "get", ""), e[t];
} };
function io(e) {
	return {
		attrs: new Proxy(e.attrs, ro),
		slots: e.slots,
		emit: e.emit,
		expose: (t) => {
			e.exposed = t || {};
		}
	};
}
function ao(e) {
	return e.exposed ? e.exposeProxy ||= new Proxy(ln($t(e.exposed)), {
		get(t, n) {
			if (n in t) return t[n];
			if (n in ai) return ai[n](e);
		},
		has(e, t) {
			return t in e || t in ai;
		}
	}) : e.proxy;
}
function oo(e, t = !0) {
	return v(e) ? e.displayName || e.name : e.name || t && e.__name;
}
function so(e) {
	return v(e) && "__vccOpts" in e;
}
var Y = (e, t) => /* @__PURE__ */ vn(e, t, Qa);
function co(e, t, n) {
	try {
		ka(-1);
		let r = arguments.length;
		return r === 2 ? x(t) && !m(t) ? ja(t) ? G(e, null, [t]) : G(e, t) : G(e, null, t) : (r > 3 ? n = Array.prototype.slice.call(arguments, 2) : r === 3 && ja(n) && (n = [n]), G(e, t, n));
	} finally {
		ka(1);
	}
}
function lo(e, t, n, r) {
	let i = n[r];
	if (i && uo(i, e)) return i;
	let a = t();
	return a.memo = e.slice(), a.cacheIndex = r, n[r] = a;
}
function uo(e, t) {
	let n = e.memo;
	if (n.length != t.length) return !1;
	for (let e = 0; e < n.length; e++) if (ie(n[e], t[e])) return !1;
	return Oa > 0 && Ea && Ea.push(e), !0;
}
var fo = "3.5.42", po = void 0, mo = typeof window < "u" && window.trustedTypes;
if (mo) try {
	po = /* @__PURE__ */ mo.createPolicy("vue", { createHTML: (e) => e });
} catch {}
var ho = po ? (e) => po.createHTML(e) : (e) => e, go = "http://www.w3.org/2000/svg", _o = "http://www.w3.org/1998/Math/MathML", vo = typeof document < "u" ? document : null, yo = vo && /* @__PURE__ */ vo.createElement("template"), bo = {
	insert: (e, t, n) => {
		t.insertBefore(e, n || null);
	},
	remove: (e) => {
		let t = e.parentNode;
		t && t.removeChild(e);
	},
	createElement: (e, t, n, r) => {
		let i = t === "svg" ? vo.createElementNS(go, e) : t === "mathml" ? vo.createElementNS(_o, e) : n ? vo.createElement(e, { is: n }) : vo.createElement(e);
		return e === "select" && r && r.multiple != null && i.setAttribute("multiple", r.multiple), i;
	},
	createText: (e) => vo.createTextNode(e),
	createComment: (e) => vo.createComment(e),
	setText: (e, t) => {
		e.nodeValue = t;
	},
	setElementText: (e, t) => {
		e.textContent = t;
	},
	parentNode: (e) => e.parentNode,
	nextSibling: (e) => e.nextSibling,
	querySelector: (e) => vo.querySelector(e),
	setScopeId(e, t) {
		e.setAttribute(t, "");
	},
	insertStaticContent(e, t, n, r, i, a) {
		let o = n ? n.previousSibling : t.lastChild;
		if (i && (i === a || i.nextSibling)) for (; t.insertBefore(i.cloneNode(!0), n), i !== a && (i = i.nextSibling););
		else {
			yo.innerHTML = ho(r === "svg" ? `<svg>${e}</svg>` : r === "mathml" ? `<math>${e}</math>` : e);
			let i = yo.content;
			if (r === "svg" || r === "mathml") {
				let e = i.firstChild;
				for (; e.firstChild;) i.appendChild(e.firstChild);
				i.removeChild(e);
			}
			t.insertBefore(i, n);
		}
		return [o ? o.nextSibling : t.firstChild, n ? n.previousSibling : t.lastChild];
	}
}, xo = /* @__PURE__ */ Symbol("_vtc");
function So(e, t, n) {
	let r = e[xo];
	r && (t = (t ? [t, ...r] : [...r]).join(" ")), t == null ? e.removeAttribute("class") : n ? e.setAttribute("class", t) : e.className = t;
}
var Co = /* @__PURE__ */ Symbol("_vod"), wo = /* @__PURE__ */ Symbol("_vsh"), To = {
	name: "show",
	beforeMount(e, { value: t }, { transition: n }) {
		e[Co] = e.style.display === "none" ? "" : e.style.display, n && t ? n.beforeEnter(e) : Eo(e, t);
	},
	mounted(e, { value: t }, { transition: n }) {
		n && t && n.enter(e);
	},
	updated(e, { value: t, oldValue: n }, { transition: r }) {
		!t != !n && (r ? t ? (r.beforeEnter(e), Eo(e, !0), r.enter(e)) : r.leave(e, () => {
			Eo(e, !1);
		}) : Eo(e, t));
	},
	beforeUnmount(e, { value: t }) {
		Eo(e, t);
	}
};
function Eo(e, t) {
	e.style.display = t ? e[Co] : "none", e[wo] = !t;
}
var Do = /* @__PURE__ */ Symbol(""), Oo = /(?:^|;)\s*display\s*:/;
function ko(e, t, n) {
	let r = e.style, i = y(n), a = !1;
	if (n && !i) {
		if (t) {
			if (y(t)) for (let e of t.split(";")) {
				let t = e.slice(0, e.indexOf(":")).trim();
				n[t] ?? jo(r, t, "");
			}
			else for (let e in t) n[e] ?? jo(r, e, "");
		}
		for (let i in n) {
			i === "display" && (a = !0);
			let o = n[i];
			o == null ? jo(r, i, "") : Fo(e, i, !y(t) && t ? t[i] : void 0, o) || jo(r, i, o);
		}
	} else if (i) {
		if (t !== n) {
			let e = r[Do];
			e && (n += ";" + e), r.cssText = n, a = Oo.test(n);
		}
	} else t && e.removeAttribute("style");
	Co in e && (e[Co] = a ? r.display : "", e[wo] && (r.display = "none"));
}
var Ao = /\s*!important$/;
function jo(e, t, n) {
	if (m(n)) n.forEach((n) => jo(e, t, n));
	else if (n ??= "", t.startsWith("--")) Ao.test(n) ? e.setProperty(t, n.replace(Ao, ""), "important") : e.setProperty(t, n);
	else {
		let r = Po(e, t);
		Ao.test(n) ? e.setProperty(te(r), n.replace(Ao, ""), "important") : e[r] = n;
	}
}
var Mo = [
	"Webkit",
	"Moz",
	"ms"
], No = {};
function Po(e, t) {
	let n = No[t];
	if (n) return n;
	let r = A(t);
	if (r !== "filter" && r in e) return No[t] = r;
	r = ne(r);
	for (let n = 0; n < Mo.length; n++) {
		let i = Mo[n] + r;
		if (i in e) return No[t] = i;
	}
	return t;
}
function Fo(e, t, n, r) {
	return e.tagName === "TEXTAREA" && (t === "width" || t === "height") && y(r) && n === r;
}
var Io = "http://www.w3.org/1999/xlink";
function Lo(e, t, n, r, i, a = _e(t)) {
	r && t.startsWith("xlink:") ? n == null ? e.removeAttributeNS(Io, t.slice(6, t.length)) : e.setAttributeNS(Io, t, n) : n == null || a && !ve(n) ? e.removeAttribute(t) : e.setAttribute(t, a ? "" : b(n) ? String(n) : n);
}
function Ro(e, t, n, r, i) {
	if (t === "innerHTML" || t === "textContent") {
		n != null && (e[t] = t === "innerHTML" ? ho(n) : n);
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
		r === "boolean" ? n = ve(n) : n == null && r === "string" ? (n = "", o = !0) : r === "number" && (n = 0, o = !0);
	}
	try {
		e[t] = n;
	} catch {}
	o && e.removeAttribute(i || t);
}
function zo(e, t, n, r) {
	e.addEventListener(t, n, r);
}
function Bo(e, t, n, r) {
	e.removeEventListener(t, n, r);
}
var Vo = /* @__PURE__ */ Symbol("_vei");
function Ho(e, t, n, r, i = null) {
	let a = e[Vo] || (e[Vo] = {}), o = a[t];
	if (r && o) o.value = r;
	else {
		let [n, s] = Go(t);
		r ? zo(e, n, a[t] = Yo(r, i), s) : o && (Bo(e, n, o, s), a[t] = void 0);
	}
}
var Uo = /(Once|Passive|Capture)$/, Wo = /^on:?(?:Once|Passive|Capture)$/;
function Go(e) {
	let t, n;
	for (; (n = e.match(Uo)) && !Wo.test(e);) t ||= {}, e = e.slice(0, e.length - n[1].length), t[n[1].toLowerCase()] = !0;
	return [e[2] === ":" ? e.slice(3) : te(e.slice(2)), t];
}
var Ko = 0, qo = /* @__PURE__ */ Promise.resolve(), Jo = () => Ko ||= (qo.then(() => Ko = 0), Date.now());
function Yo(e, t) {
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
				e && En(e, t, 5, a);
			}
		} else En(r, t, 5, [e]);
	};
	return n.value = e, n.attached = Jo(), n;
}
var Xo = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && e.charCodeAt(2) > 96 && e.charCodeAt(2) < 123, Zo = (e, t, n, r, i, a) => {
	let o = i === "svg";
	t === "class" ? So(e, r, o) : t === "style" ? ko(e, n, r) : c(t) ? l(t) || Ho(e, t, n, r, a) : (t[0] === "." ? (t = t.slice(1), 1) : t[0] === "^" ? (t = t.slice(1), 0) : Qo(e, t, r, o)) ? (Ro(e, t, r), e.tagName.includes("-") || t !== "value" && t !== "checked" && t !== "selected" || Lo(e, t, r, o, a, t !== "value")) : e._isVueCE && ($o(e, t) || e._def.__asyncLoader && (/[A-Z]/.test(t) || !y(r))) ? Ro(e, A(t), r, a, t) : (t === "true-value" ? e._trueValue = r : t === "false-value" && (e._falseValue = r), Lo(e, t, r, o));
};
function Qo(e, t, n, r) {
	if (r) return !!(t === "innerHTML" || t === "textContent" || t in e && Xo(t) && v(n));
	if (t === "spellcheck" || t === "draggable" || t === "translate" || t === "autocorrect" || t === "sandbox" && e.tagName === "IFRAME" || t === "form" || t === "list" && e.tagName === "INPUT" || t === "type" && e.tagName === "TEXTAREA") return !1;
	if (t === "width" || t === "height") {
		let t = e.tagName;
		if (t === "IMG" || t === "VIDEO" || t === "CANVAS" || t === "SOURCE") return !1;
	}
	return Xo(t) && y(n) ? !1 : t in e;
}
function $o(e, t) {
	let n = e._def.props;
	if (!n) return !1;
	let r = A(t);
	return Array.isArray(n) ? n.some((e) => A(e) === r) : Object.keys(n).some((e) => A(e) === r);
}
var es = (e) => {
	let t = e.props["onUpdate:modelValue"] || !1;
	return m(t) ? (e) => ae(t, e) : t;
};
function ts(e) {
	e.target.composing = !0;
}
function ns(e) {
	let t = e.target;
	t.composing && (t.composing = !1, t.dispatchEvent(new Event("input")));
}
var rs = /* @__PURE__ */ Symbol("_assign"), is = /* @__PURE__ */ Symbol("_initialValue");
function as(e, t, n) {
	return t && (e = e.trim()), n && (e = se(e)), e;
}
var os = {
	created(e, { modifiers: { lazy: t, trim: n, number: r } }, i) {
		e.parentNode && (e.type === "text" ? e[is] = e.defaultValue.replace(/[\r\n]/g, "") : e.type === "textarea" && (e[is] = e.defaultValue.replace(/\r\n?/g, "\n"))), e[rs] = es(i);
		let a = r || i.props && i.props.type === "number";
		zo(e, t ? "change" : "input", (t) => {
			t.target.composing || e[rs](as(e.value, n, a));
		}), (n || a) && zo(e, "change", () => {
			e.value = as(e.value, n, a);
		}), t || (zo(e, "compositionstart", ts), zo(e, "compositionend", ns), zo(e, "change", ns));
	},
	mounted(e, { value: t, modifiers: { trim: n, number: r } }) {
		let i = t ?? "", a = e[is];
		delete e[is], a !== void 0 && (e.type === "text" || e.type === "textarea") && e.value !== a ? e[rs](as(e.value, n, r)) : e.value = i;
	},
	beforeUpdate(e, { value: t, oldValue: n, modifiers: { lazy: r, trim: i, number: a } }, o) {
		if (e[rs] = es(o), e.composing) return;
		let s = (a || e.type === "number") && !/^0\d/.test(e.value) ? se(e.value) : e.value, c = t ?? "";
		if (s === c) return;
		let l = e.getRootNode();
		(l instanceof Document || l instanceof ShadowRoot) && l.activeElement === e && e.type !== "range" && (r && t === n || i && e.value.trim() === c) || (e.value = c);
	}
}, ss = {
	deep: !0,
	created(e, t, n) {
		e[rs] = es(n), zo(e, "change", () => {
			let t = e._modelValue, n = fs(e), r = e.checked, i = e[rs];
			if (m(t)) {
				let e = Se(t, n), a = e !== -1;
				if (r && !a) i(t.concat(n));
				else if (!r && a) {
					let n = [...t];
					n.splice(e, 1), i(n);
				}
			} else if (g(t)) {
				let e = new Set(t);
				r ? e.add(n) : e.delete(n), i(e);
			} else i(ps(e, r));
		});
	},
	mounted: cs,
	beforeUpdate(e, t, n) {
		e[rs] = es(n), cs(e, t, n);
	}
};
function cs(e, { value: t, oldValue: n }, r) {
	e._modelValue = t;
	let i;
	if (m(t)) i = Se(t, r.props.value) > -1;
	else if (g(t)) i = t.has(r.props.value);
	else {
		if (t === n) return;
		i = xe(t, ps(e, !0));
	}
	e.checked !== i && (e.checked = i);
}
var ls = {
	deep: !0,
	created(e, { value: t, modifiers: { number: n } }, r) {
		e._modelValue = t, zo(e, "change", () => {
			let t = Array.prototype.filter.call(e.options, (e) => e.selected).map((e) => n ? se(fs(e)) : fs(e)), r = e.multiple, i = r ? g(e._modelValue) ? new Set(t) : t : t[0], a = e._pendingValue = [r, r ? m(i) ? t.slice() : t : i];
			try {
				e[rs](i);
			} finally {
				In(() => {
					e._pendingValue === a && (e._pendingValue = void 0);
				});
			}
		}), e[rs] = es(r);
	},
	mounted(e, { value: t }) {
		ds(e, t);
	},
	beforeUpdate(e, { value: t }, n) {
		e._modelValue = t, e[rs] = es(n);
	},
	updated(e, { value: t }) {
		let n = e._pendingValue;
		e._pendingValue = void 0, n && n[0] === e.multiple && us(t, n[1], n[0]) || ds(e, t);
	}
};
function us(e, t, n) {
	if (!n || m(e)) return xe(e, t);
	if (g(e)) {
		if (e.size !== t.length) return !1;
		for (let n of t) if (!e.has(n)) return !1;
		return !0;
	}
	return !1;
}
function ds(e, t) {
	let n = e.multiple, r = m(t);
	if (!n || r || g(t)) {
		for (let i = 0, a = e.options.length; i < a; i++) {
			let a = e.options[i], o = fs(a);
			if (n) {
				if (r) {
					let e = typeof o;
					a.selected = e === "string" || e === "number" ? t.some((e) => String(e) === String(o)) : Se(t, o) > -1;
				} else a.selected = t.has(o);
			} else if (xe(fs(a), t)) {
				e.selectedIndex !== i && (e.selectedIndex = i);
				return;
			}
		}
		!n && e.selectedIndex !== -1 && (e.selectedIndex = -1);
	}
}
function fs(e) {
	return "_value" in e ? e._value : e.value;
}
function ps(e, t) {
	let n = t ? "_trueValue" : "_falseValue";
	return n in e ? e[n] : t;
}
var ms = [
	"ctrl",
	"shift",
	"alt",
	"meta"
], hs = {
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
	exact: (e, t) => ms.some((n) => e[`${n}Key`] && !t.includes(n))
}, gs = (e, t) => {
	if (!e) return e;
	let n = e._withMods ||= {}, r = t.join(".");
	return n[r] || (n[r] = ((n, ...r) => {
		for (let e = 0; e < t.length; e++) {
			let r = hs[t[e]];
			if (r && r(n, t)) return;
		}
		return e(n, ...r);
	}));
}, _s = {
	esc: "escape",
	space: " ",
	up: "arrow-up",
	left: "arrow-left",
	right: "arrow-right",
	down: "arrow-down",
	delete: "backspace"
}, vs = (e, t) => {
	let n = e._withKeys ||= {}, r = t.join(".");
	return n[r] || (n[r] = ((n) => {
		if (!("key" in n)) return;
		let r = te(n.key);
		if (t.some((e) => e === r || _s[e] === r)) return e(n);
	}));
}, ys = /* @__PURE__ */ u({ patchProp: Zo }, bo), bs;
function xs() {
	return bs ||= ua(ys);
}
var Ss = ((...e) => {
	let t = xs().createApp(...e), { mount: n } = t;
	return t.mount = (e) => {
		let r = ws(e);
		if (!r) return;
		let i = t._component;
		v(i) || i.render || i.template || (i.template = r.innerHTML), r.nodeType === 1 && (r.textContent = "");
		let a = n(r, !1, Cs(r));
		return r instanceof Element && (r.removeAttribute("v-cloak"), r.setAttribute("data-v-app", "")), a;
	}, t;
});
function Cs(e) {
	if (e instanceof SVGElement) return "svg";
	if (typeof MathMLElement == "function" && e instanceof MathMLElement) return "mathml";
}
function ws(e) {
	return y(e) ? document.querySelector(e) : e;
}
// node_modules/.pnpm/@intlify+shared@11.4.23/node_modules/@intlify/shared/dist/shared.mjs
var Ts = typeof window < "u", Es = (e, t = !1) => t ? Symbol.for(e) : Symbol(e), Ds = (e, t, n) => Os({
	l: e,
	k: t,
	s: n
}), Os = (e) => JSON.stringify(e).replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029").replace(/\u0027/g, "\\u0027"), ks = (e) => typeof e == "number" && isFinite(e), As = (e) => Js(e) === "[object Date]", js = (e) => Js(e) === "[object RegExp]", Ms = (e) => Ys(e) && Object.keys(e).length === 0, Ns = Object.assign, Ps = Object.create, Fs = (e = null) => Ps(e), Is, Ls = () => Is ||= typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : Fs(), Rs = Object.prototype.hasOwnProperty;
function zs(e, t) {
	return Rs.call(e, t);
}
function Bs(e, t) {
	let n = e[t];
	return zs(e, t) ? n : void 0;
}
function Vs(e) {
	return zs(Object.prototype, e);
}
var Hs = Array.isArray, Us = (e) => typeof e == "function", X = (e) => typeof e == "string", Ws = (e) => typeof e == "boolean", Gs = (e) => typeof e == "object" && !!e, Ks = (e) => Gs(e) && Us(e.then) && Us(e.catch), qs = Object.prototype.toString, Js = (e) => qs.call(e), Ys = (e) => Js(e) === "[object Object]", Xs = (e) => e == null ? "" : Hs(e) || Ys(e) && e.toString === qs ? JSON.stringify(e, null, 2) : String(e);
function Zs(e, t = "") {
	return e.reduce((e, n, r) => r === 0 ? e + n : e + t + n, "");
}
function Qs(e, t) {
	typeof console < "u" && (console.warn("[intlify] " + e), t && console.warn(t.stack));
}
function $s(e) {
	return e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;").replace(/\//g, "&#x2F;").replace(/=/g, "&#x3D;");
}
function ec(e) {
	return e.replace(/&(?![a-z0-9#]{2,6};)/gi, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&apos;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
var tc = /^javascript:/i, nc = /^(?:href|xlink:href|src|action|formaction)$/i, rc = /&#(?:x([0-9a-f]+)|(\d+));?/gi, ic = /&(?:Tab|NewLine);/g, ac = /&colon;?/gi, oc = /[\u0000-\u0020\u007f-\u009f]/g, sc = /^on\w/i, cc = /^srcdoc$/i, lc = /^(?:base|animate|set|script|plaintext)$/i, uc = /^(?:iframe|noembed|noframes|noscript|style|textarea|title|xmp)$/i, dc = /<(\/?)([a-z][^\t\n\f\r />]*)/iy, fc = /([\t\n\f\r /]*)(?:(>)|([^\t\n\f\r />][^\t\n\f\r />=]*)(?:[\t\n\f\r ]*=[\t\n\f\r ]*(?:(["'])([\s\S]*?)(\4|$)|([^\t\n\f\r >]*)))?)/y, pc = /<!--(?:>|->|[\s\S]*?--!?>)/y;
function mc(e, t, n) {
	let r = t || n;
	if (!r) return e;
	let i = Number.parseInt(r, t ? 16 : 10);
	return i <= 127 ? String.fromCharCode(i) : e;
}
function hc(e) {
	let t = e.replace(rc, mc).replace(ic, "").replace(ac, ":").replace(oc, "");
	return tc.test(t);
}
function gc(e) {
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
		n += e.slice(r, a), n += hc(d) ? "url(about:blank)" : e.slice(a, s + 1), r = s + 1;
	}
	return n + e.slice(r);
}
function _c(e, t) {
	return nc.test(e) && hc(t) ? "about:blank" : ec(e.toLowerCase() === "style" ? gc(t) : t);
}
function vc(e) {
	return e.replace(/</g, "&lt;");
}
function yc(e, t, n, r) {
	let i = e;
	if (sc.test(e) ? (r.eventHandler = !0, i = `&#111;n${e.slice(2)}`) : cc.test(e) && (r.srcdoc = !0, i = `&#115;${e.slice(1)}`), t === void 0) return i;
	let a = n || "";
	return `${i}=${a}${_c(e, t)}${a}`;
}
var bc = 0, xc = 1, Sc = 2, Cc = /^(?:area|base|basefont|bgsound|br|col|embed|frame|hr|image|img|input|keygen|link|meta|param|source|track|wbr|html|head|body|frameset)$/, wc = /^(?:b|big|blockquote|body|br|center|code|dd|div|dl|dt|em|embed|h[1-6]|head|hr|i|img|li|listing|menu|meta|nobr|ol|p|pre|ruby|s|small|span|strong|strike|sub|sup|table|tt|u|ul|var)$/, Tc = /^(?:address|article|aside|blockquote|center|details|dialog|dir|div|dl|fieldset|figcaption|figure|footer|header|hgroup|main|menu|nav|ol|p|search|section|summary|ul|h[1-6]|pre|listing|form|li|dd|dt|plaintext|table|hr|xmp)$/, Ec = /^(?:applet|caption|html|table|td|th|marquee|object|template|button)$/, Dc = /^(?:foreignobject|desc|title)$/, Oc = /^(?:foreignobject|desc|mi|mo|mn|ms|mtext|annotation-xml)$/, kc = /^(?:mi|mo|mn|ms|mtext)$/, Ac = /^(?:text\/html|application\/xhtml\+xml)$/i;
function jc(e) {
	return e.replace(/[A-Z]+/g, (e) => e.toLowerCase());
}
function Mc(e, t) {
	return !!e && e.namespace !== bc && (!e.integration || kc.test(e.name) && (t === "mglyph" || t === "malignmark")) && (e.name !== "annotation-xml" || t !== "svg");
}
function Nc(e, t) {
	return wc.test(e) || e === "font" && (t.has("color") || t.has("face") || t.has("size"));
}
function Pc(e, t, n) {
	let r = "";
	for (let i = e.length - 1; i >= t; i--) {
		let t = e[i];
		t.namespace === bc && t.name === "form" ? n[t.part] = vc(n[t.part]) : r += `</${t.name}>`;
	}
	return e.length = t, r;
}
function Fc(e, t) {
	let n = e.length;
	for (; n > 0 && e[n - 1].namespace !== bc && !e[n - 1].integration;) n--;
	return Pc(e, n, t);
}
function Ic(e, t, n, r, i) {
	let a = t.length + 1, o = "", s = e[e.length - 1];
	if (Mc(s, n)) {
		if (!Nc(n, r)) return i || e.push({
			name: n,
			namespace: s.namespace,
			integration: s.namespace === xc ? Dc.test(n) : kc.test(n) || n === "annotation-xml" && Ac.test((r.get("encoding") || "").replace(rc, mc)),
			part: a
		}), o;
		o = Fc(e, t);
	}
	if (Tc.test(n)) for (let n = e.length - 1; n >= 0; n--) {
		let r = e[n];
		if (r.namespace === bc ? Ec.test(r.name) : r.integration) break;
		if (r.namespace === bc && r.name === "p") {
			o += Pc(e, n, t);
			break;
		}
	}
	if (!Oc.test(n)) return n === "svg" || n === "math" ? i || e.push({
		name: n,
		namespace: n === "svg" ? xc : Sc,
		integration: !1,
		part: a
	}) : Cc.test(n) || e.push({
		name: n,
		namespace: bc,
		integration: !1,
		part: a
	}), o;
}
function Lc(e, t, n) {
	let r = "";
	(n === "p" || n === "br") && (r = Fc(e, t));
	let i = e.length - 1;
	for (; i >= 0 && e[i].namespace !== bc && e[i].name !== n;) i--;
	if (!(i >= 0 && e[i].namespace !== bc)) for (; i >= 0 && (e[i].namespace !== bc || e[i].name !== n);) i--;
	return i < 0 ? n === "br" || n === "p" ? r : void 0 : (r += Pc(e, i + 1, t), e.length = i, r);
}
function Rc(e, t, n) {
	dc.lastIndex = t;
	let r = dc.exec(e);
	if (!r) return;
	let [, i, a] = r, o = r[0], s = /* @__PURE__ */ new Map(), c;
	for (fc.lastIndex = dc.lastIndex; c = fc.exec(e);) {
		let [r, l, u, d, f, p, m, h] = c;
		if (u) {
			let n = fc.lastIndex;
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
			let e = f ? p : h, t = jc(d);
			s.has(t) || s.set(t, e || ""), o += l + yc(d, e, f, n);
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
function zc(e, t, n) {
	for (let r = e.indexOf("</", t); r !== -1; r = e.indexOf("</", r + 2)) {
		let t = Rc(e, r, {});
		if (t && t[1].toLowerCase() === n.toLowerCase()) return t[2] === -1 ? -1 : r;
	}
	return -1;
}
function Bc(e) {
	let t = {}, n = [], r = [], i = 0, a;
	for (; (a = e.indexOf("<", i)) !== -1;) {
		n.push(e.slice(i, a)), i = a + 1;
		let o = Rc(e, a, t);
		if (o) {
			let [s, c, l, u, d] = o;
			if (l === -1) {
				t.unclosed = !0, n.push(vc(e.slice(a))), i = e.length;
				break;
			}
			if (i = l, s[1] === "/") {
				let e = Lc(r, n, jc(c));
				e === void 0 ? t.closed = !0 : (e && (t.closed = !0), n.push(e + s));
			} else if (lc.test(c)) t.element = !0, n.push(vc(s));
			else {
				let a = "";
				if (uc.test(c)) {
					let r = zc(e, l, c);
					if (r === -1) {
						t.unclosed = !0, n.push(vc(s));
						continue;
					}
					a = vc(e.slice(l, r)), i = r;
				}
				let o = Ic(r, n, jc(c), d, u);
				o === void 0 ? (t.closed = !0, n.push(vc(s) + a)) : n.push(o, s + a);
			}
		} else pc.lastIndex = a, pc.test(e) ? (n.push(e.slice(a, pc.lastIndex)), i = pc.lastIndex) : (e.startsWith("<!--", a) && (t.unclosed = !0), n.push("&lt;"));
	}
	n.push(e.slice(i));
	for (let e = r.length - 1; e >= 0; e--) {
		let i = r[e];
		t.closed = !0, i.namespace === bc && i.name === "form" ? n[i.part] = vc(n[i.part]) : n.push(`</${i.name}>`);
	}
	return n.join("");
}
var Vc = (e) => !Gs(e) || Hs(e);
function Hc(e, t) {
	if (Vc(e) || Vc(t) || t === Object.prototype) throw Error("Invalid value");
	let n = [{
		src: e,
		des: t
	}];
	for (; n.length;) {
		let { src: e, des: t } = n.pop();
		Object.keys(e).forEach((r) => {
			if (r === "__proto__") return;
			let i = e[r];
			if (Hs(i)) {
				let e = [];
				e.length = i.length, t[r] = e, n.push({
					src: i,
					des: e
				});
			} else Gs(i) ? ((!Gs(t[r]) || Hs(t[r])) && (t[r] = Fs()), n.push({
				src: i,
				des: t[r]
			})) : t[r] = i;
		});
	}
}
// node_modules/.pnpm/@intlify+message-compiler@11.4.23/node_modules/@intlify/message-compiler/dist/message-compiler.mjs
function Uc(e, t, n) {
	return {
		line: e,
		column: t,
		offset: n
	};
}
function Wc(e, t, n) {
	let r = {
		start: e,
		end: t
	};
	return n != null && (r.source = n), r;
}
var Gc = {
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
Gc.EXPECTED_TOKEN, Gc.INVALID_TOKEN_IN_PLACEHOLDER, Gc.UNTERMINATED_SINGLE_QUOTE_IN_PLACEHOLDER, Gc.UNKNOWN_ESCAPE_SEQUENCE, Gc.INVALID_UNICODE_ESCAPE_SEQUENCE, Gc.UNBALANCED_CLOSING_BRACE, Gc.UNTERMINATED_CLOSING_BRACE, Gc.EMPTY_PLACEHOLDER, Gc.NOT_ALLOW_NEST_PLACEHOLDER, Gc.INVALID_LINKED_FORMAT, Gc.MUST_HAVE_MESSAGES_IN_PLURAL, Gc.UNEXPECTED_EMPTY_LINKED_MODIFIER, Gc.UNEXPECTED_EMPTY_LINKED_KEY, Gc.UNEXPECTED_LEXICAL_ANALYSIS, Gc.UNHANDLED_CODEGEN_NODE_TYPE, Gc.UNHANDLED_MINIFIER_NODE_TYPE;
function Kc(e, t, n = {}) {
	let { domain: r, messages: i, args: a } = n, o = SyntaxError(String(e));
	return o.code = e, t && (o.location = t), o.domain = r, o;
}
function qc(e) {
	throw e;
}
var Jc = " ", Yc = "\r", Xc = "\n", Zc = "\u2028", Qc = "\u2029";
function $c(e) {
	let t = e, n = 0, r = 1, i = 1, a = 0, o = (e) => t[e] === Yc && t[e + 1] === Xc, s = (e) => t[e] === Xc, c = (e) => t[e] === Qc, l = (e) => t[e] === Zc, u = (e) => o(e) || s(e) || c(e) || l(e), d = () => n, f = () => r, p = () => i, m = () => a, h = (e) => o(e) || c(e) || l(e) ? Xc : t[e], g = () => h(n), _ = () => h(n + a);
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
var el = void 0, tl = "	", nl = "'", rl = "tokenizer";
function il(e, t = {}) {
	let n = t.location !== !1, r = $c(e), i = () => r.index(), a = () => Uc(r.line(), r.column(), r.index()), o = a(), s = i(), c = {
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
			let r = Kc(e, n ? Wc(a.startLoc, t) : null, {
				domain: rl,
				args: i
			});
			u(r);
		}
	}
	function f(e, t, r) {
		e.endLoc = a(), e.currentType = t;
		let i = { type: t };
		return n && (i.loc = Wc(e.startLoc, e.endLoc)), r != null && (i.value = r), i;
	}
	let p = (e) => f(e, 13);
	function m(e, t) {
		return e.currentChar() === t ? (e.next(), t) : (d(Gc.EXPECTED_TOKEN, a(), 0, t), "");
	}
	function h(e) {
		let t = "";
		for (; e.currentPeek() === Jc || e.currentPeek() === Xc;) t += e.currentPeek(), e.peek();
		return t;
	}
	function g(e) {
		let t = h(e);
		return e.skipToPeek(), t;
	}
	function _(e) {
		if (e === el) return !1;
		let t = e.charCodeAt(0);
		return t >= 97 && t <= 122 || t >= 65 && t <= 90 || t === 95;
	}
	function v(e) {
		if (e === el) return !1;
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
		let r = e.currentPeek() === nl;
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
			return t === "{" ? _(e.peek()) : t === "@" || t === "|" || t === ":" || t === "." || t === Jc || !t ? !1 : t === Xc ? (e.peek(), r()) : D(e, !1);
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
			return i === "{" || i === "@" || !i ? t : i === "|" ? r !== Jc && r !== Xc : i === Jc ? (e.peek(), n(!0, Jc)) : i !== Xc || (e.peek(), n(!0, Xc));
		}, r = n();
		return t && e.resetPeek(), r;
	}
	function O(e, t) {
		let n = e.currentChar();
		if (n !== el) return t(n) ? (e.next(), n) : null;
	}
	function k(e) {
		let t = e.charCodeAt(0);
		return t >= 97 && t <= 122 || t >= 65 && t <= 90 || t >= 48 && t <= 57 || t === 95 || t === 36;
	}
	function ee(e) {
		return O(e, k);
	}
	function A(e) {
		let t = e.charCodeAt(0);
		return t >= 97 && t <= 122 || t >= 65 && t <= 90 || t >= 48 && t <= 57 || t === 95 || t === 36 || t === 45;
	}
	function j(e) {
		return O(e, A);
	}
	function te(e) {
		let t = e.charCodeAt(0);
		return t >= 48 && t <= 57;
	}
	function ne(e) {
		return O(e, te);
	}
	function re(e) {
		let t = e.charCodeAt(0);
		return t >= 48 && t <= 57 || t >= 65 && t <= 70 || t >= 97 && t <= 102;
	}
	function ie(e) {
		return O(e, re);
	}
	function ae(e) {
		let t = "", n = "";
		for (; t = ne(e);) n += t;
		return n;
	}
	function oe(e) {
		let t = "";
		for (;;) {
			let n = e.currentChar();
			if (n === "\\") {
				let r = e.peek();
				r === "{" || r === "}" || r === "@" || r === "|" || r === "\\" ? (t += n + r, e.next(), e.next()) : (e.resetPeek(), t += n, e.next());
			} else if (n === "{" || n === "}" || n === "@" || n === "|" || !n) break;
			else if (n === Jc || n === Xc) {
				if (D(e)) t += n, e.next();
				else if (E(e)) break;
				else t += n, e.next();
			} else t += n, e.next();
		}
		return t;
	}
	function se(e) {
		g(e);
		let t = "", n = "";
		for (; t = j(e);) n += t;
		let r = e.currentChar();
		if (r && r !== "}" && r !== el && r !== Jc && r !== Xc && r !== "　") {
			let t = me(e);
			return d(Gc.INVALID_TOKEN_IN_PLACEHOLDER, a(), 0, n + t), n + t;
		}
		return e.currentChar() === el && d(Gc.UNTERMINATED_CLOSING_BRACE, a(), 0), n;
	}
	function ce(e) {
		g(e);
		let t = "";
		return e.currentChar() === "-" ? (e.next(), t += `-${ae(e)}`) : t += ae(e), e.currentChar() === el && d(Gc.UNTERMINATED_CLOSING_BRACE, a(), 0), t;
	}
	function le(e) {
		return e !== nl && e !== Xc;
	}
	function ue(e) {
		g(e), m(e, "'");
		let t = "", n = "";
		for (; t = O(e, le);) n += t === "\\" ? de(e) : t;
		let r = e.currentChar();
		return r === Xc || r === el ? (d(Gc.UNTERMINATED_SINGLE_QUOTE_IN_PLACEHOLDER, a(), 0), r === Xc && (e.next(), m(e, "'")), n) : (m(e, "'"), n);
	}
	function de(e) {
		let t = e.currentChar();
		switch (t) {
			case "\\":
			case "'": return e.next(), `\\${t}`;
			case "u": return fe(e, t, 4);
			case "U": return fe(e, t, 6);
			default: return d(Gc.UNKNOWN_ESCAPE_SEQUENCE, a(), 0, t), "";
		}
	}
	function fe(e, t, n) {
		m(e, t);
		let r = "";
		for (let i = 0; i < n; i++) {
			let n = ie(e);
			if (!n) {
				d(Gc.INVALID_UNICODE_ESCAPE_SEQUENCE, a(), 0, `\\${t}${r}${e.currentChar()}`);
				break;
			}
			r += n;
		}
		return `\\${t}${r}`;
	}
	function pe(e) {
		return e !== "{" && e !== "}" && e !== Jc && e !== Xc;
	}
	function me(e) {
		g(e);
		let t = "", n = "";
		for (; t = O(e, pe);) n += t;
		return n;
	}
	function he(e) {
		let t = "", n = "";
		for (; t = ee(e);) n += t;
		return n;
	}
	function ge(e) {
		return e !== "{" && e !== "@" && e !== "|" && e !== "(" && e !== ")" && e !== Jc && e !== tl && e !== Xc;
	}
	function _e(e) {
		for (; e.currentChar() === tl;) e.next();
		let t = "", n;
		for (; (n = e.currentChar()) && ge(n);) t += n, e.next();
		return t;
	}
	function ve(e) {
		g(e);
		let t = m(e, "|");
		return g(e), t;
	}
	function ye(e, t) {
		let n = null;
		switch (e.currentChar()) {
			case "{": return t.braceNest >= 1 && d(Gc.NOT_ALLOW_NEST_PLACEHOLDER, a(), 0), e.next(), n = f(t, 2, "{"), g(e), t.braceNest++, n;
			case "}": return t.braceNest > 0 && t.currentType === 2 && d(Gc.EMPTY_PLACEHOLDER, a(), 0), e.next(), n = f(t, 3, "}"), t.braceNest--, t.braceNest > 0 && g(e), t.inLinked && t.braceNest === 0 && (t.inLinked = !1), n;
			case "@": return t.braceNest > 0 && d(Gc.UNTERMINATED_CLOSING_BRACE, a(), 0), n = be(e, t) || p(t), t.braceNest = 0, n;
			default: {
				let r = !0, i = !0, o = !0;
				if (E(e)) return t.braceNest > 0 && d(Gc.UNTERMINATED_CLOSING_BRACE, a(), 0), n = f(t, 1, ve(e)), t.braceNest = 0, t.inLinked = !1, n;
				if (t.braceNest > 0 && (t.currentType === 4 || t.currentType === 5 || t.currentType === 6)) return d(Gc.UNTERMINATED_CLOSING_BRACE, a(), 0), t.braceNest = 0, xe(e, t);
				if (r = y(e, t)) return n = f(t, 4, se(e)), g(e), n;
				if (i = b(e, t)) return n = f(t, 5, ce(e)), g(e), n;
				if (o = x(e, t)) return n = f(t, 6, ue(e)), g(e), n;
				if (!r && !i && !o) return n = f(t, 12, me(e)), d(Gc.INVALID_TOKEN_IN_PLACEHOLDER, a(), 0, n.value), g(e), n;
				break;
			}
		}
		return n;
	}
	function be(e, t) {
		let { currentType: n } = t, r = null, i = e.currentChar();
		switch (n !== 7 && n !== 8 && n !== 11 && n !== 9 || i !== Xc && i !== Jc || d(Gc.INVALID_LINKED_FORMAT, a(), 0), i) {
			case "@": return e.next(), r = f(t, 7, "@"), t.inLinked = !0, r;
			case ".": return g(e), e.next(), f(t, 8, ".");
			case ":": return g(e), e.next(), f(t, 9, ":");
			default: return E(e) ? (r = f(t, 1, ve(e)), t.braceNest = 0, t.inLinked = !1, r) : S(e, t) || w(e, t) ? (g(e), be(e, t)) : C(e, t) ? (g(e), f(t, 11, he(e))) : T(e, t) ? (g(e), i === "{" ? ye(e, t) || r : f(t, 10, _e(e))) : (n === 7 && d(Gc.INVALID_LINKED_FORMAT, a(), 0), t.braceNest = 0, t.inLinked = !1, xe(e, t));
		}
	}
	function xe(e, t) {
		let n = { type: 13 };
		if (t.braceNest > 0) return ye(e, t) || p(t);
		if (t.inLinked) return be(e, t) || p(t);
		switch (e.currentChar()) {
			case "{": return ye(e, t) || p(t);
			case "}": return d(Gc.UNBALANCED_CLOSING_BRACE, a(), 0), e.next(), f(t, 3, "}");
			case "@": return be(e, t) || p(t);
			default:
				if (E(e)) return n = f(t, 1, ve(e)), t.braceNest = 0, t.inLinked = !1, n;
				if (D(e)) return f(t, 0, oe(e));
		}
		return n;
	}
	function Se() {
		let { currentType: e, offset: t, startLoc: n, endLoc: o } = c;
		return c.lastType = e, c.lastOffset = t, c.lastStartLoc = n, c.lastEndLoc = o, c.offset = i(), c.startLoc = a(), r.currentChar() === el ? f(c, 13) : xe(r, c);
	}
	return {
		nextToken: Se,
		currentOffset: i,
		currentPosition: a,
		context: l
	};
}
var al = "parser", ol = /(?:\\\\|\\'|\\u([0-9a-fA-F]{4})|\\U([0-9a-fA-F]{6}))/g, sl = /\\([\\@{}|])/g;
function cl(e, t) {
	return t;
}
function ll(e, t, n) {
	switch (e) {
		case "\\\\": return "\\";
		case "\\'": return "'";
		default: {
			let e = parseInt(t || n, 16);
			return e <= 55295 || e >= 57344 ? String.fromCodePoint(e) : "�";
		}
	}
}
function ul(e = {}) {
	let t = e.location !== !1, { onError: n } = e;
	function r(e, r, i, a, ...o) {
		let s = e.currentPosition();
		if (s.offset += a, s.column += a, n) {
			let e = Kc(r, t ? Wc(i, s) : null, {
				domain: al,
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
		return r.value = t.replace(sl, cl), a(r, e.currentOffset(), e.currentPosition()), r;
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
		return o.value = t.replace(ol, ll), e.nextToken(), a(o, e.currentOffset(), e.currentPosition()), o;
	}
	function u(e) {
		let t = e.nextToken(), n = e.context(), { lastOffset: o, lastStartLoc: s } = n, c = i(8, o, s);
		return t.type === 11 ? (t.value ?? r(e, Gc.UNEXPECTED_LEXICAL_ANALYSIS, n.lastStartLoc, 0, dl(t)), c.value = t.value || "", a(c, e.currentOffset(), e.currentPosition()), { node: c }) : (r(e, Gc.UNEXPECTED_EMPTY_LINKED_MODIFIER, n.lastStartLoc, 0), c.value = "", a(c, o, s), {
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
		switch (o.type !== 9 && r(e, Gc.UNEXPECTED_LEXICAL_ANALYSIS, t.lastStartLoc, 0, dl(o)), o = e.nextToken(), o.type === 2 && (o = e.nextToken()), o.type) {
			case 10:
				o.value ?? r(e, Gc.UNEXPECTED_LEXICAL_ANALYSIS, t.lastStartLoc, 0, dl(o)), n.key = d(e, o.value || "");
				break;
			case 4:
				o.value ?? r(e, Gc.UNEXPECTED_LEXICAL_ANALYSIS, t.lastStartLoc, 0, dl(o)), n.key = c(e, o.value || "");
				break;
			case 5:
				o.value ?? r(e, Gc.UNEXPECTED_LEXICAL_ANALYSIS, t.lastStartLoc, 0, dl(o)), n.key = s(e, o.value || "");
				break;
			case 6:
				o.value ?? r(e, Gc.UNEXPECTED_LEXICAL_ANALYSIS, t.lastStartLoc, 0, dl(o)), n.key = l(e, o.value || "");
				break;
			default: {
				r(e, Gc.UNEXPECTED_EMPTY_LINKED_KEY, t.lastStartLoc, 0);
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
					i.value ?? r(e, Gc.UNEXPECTED_LEXICAL_ANALYSIS, t.lastStartLoc, 0, dl(i)), n.items.push(o(e, i.value || ""));
					break;
				case 5:
					i.value ?? r(e, Gc.UNEXPECTED_LEXICAL_ANALYSIS, t.lastStartLoc, 0, dl(i)), n.items.push(s(e, i.value || ""));
					break;
				case 4:
					i.value ?? r(e, Gc.UNEXPECTED_LEXICAL_ANALYSIS, t.lastStartLoc, 0, dl(i)), n.items.push(c(e, i.value || ""));
					break;
				case 6:
					i.value ?? r(e, Gc.UNEXPECTED_LEXICAL_ANALYSIS, t.lastStartLoc, 0, dl(i)), n.items.push(l(e, i.value || ""));
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
		return c && r(e, Gc.MUST_HAVE_MESSAGES_IN_PLURAL, n, 0), a(l, e.currentOffset(), e.currentPosition()), l;
	}
	function h(e) {
		let t = e.context(), { offset: n, startLoc: r } = t, i = p(e);
		return t.currentType === 13 ? i : m(e, n, r, i);
	}
	function g(n) {
		let o = il(n, Ns({}, e)), s = o.context(), c = i(0, s.offset, s.startLoc);
		return t && c.loc && (c.loc.source = n), c.body = h(o), e.onCacheKey && (c.cacheKey = e.onCacheKey(n)), s.currentType !== 13 && r(o, Gc.UNEXPECTED_LEXICAL_ANALYSIS, s.lastStartLoc, 0, n[s.offset] || ""), a(c, o.currentOffset(), o.currentPosition()), c;
	}
	return { parse: g };
}
function dl(e) {
	if (e.type === 13) return "EOF";
	let t = (e.value || "").replace(/\r?\n/gu, "\\n");
	return t.length > 10 ? t.slice(0, 9) + "…" : t;
}
function fl(e, t = {}) {
	let n = {
		ast: e,
		helpers: /* @__PURE__ */ new Set()
	};
	return {
		context: () => n,
		helper: (e) => (n.helpers.add(e), e)
	};
}
function pl(e, t) {
	for (let n = 0; n < e.length; n++) ml(e[n], t);
}
function ml(e, t) {
	switch (e.type) {
		case 1:
			pl(e.cases, t), t.helper("plural");
			break;
		case 2:
			pl(e.items, t);
			break;
		case 6:
			ml(e.key, t), t.helper("linked"), t.helper("type");
			break;
		case 5:
			t.helper("interpolate"), t.helper("list");
			break;
		case 4: t.helper("interpolate"), t.helper("named");
	}
}
function hl(e, t = {}) {
	let n = fl(e);
	n.helper("normalize"), e.body && ml(e.body, n);
	let r = n.context();
	e.helpers = Array.from(r.helpers);
}
function gl(e) {
	let t = e.body;
	return t.type === 2 ? _l(t) : t.cases.forEach((e) => _l(e)), e;
}
function _l(e) {
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
			e.static = Zs(t);
			for (let t = 0; t < e.items.length; t++) {
				let n = e.items[t];
				(n.type === 3 || n.type === 9) && delete n.value;
			}
		}
	}
}
function vl(e) {
	switch (e.t = e.type, e.type) {
		case 0: {
			let t = e;
			vl(t.body), t.b = t.body, delete t.body;
			break;
		}
		case 1: {
			let t = e, n = t.cases;
			for (let e = 0; e < n.length; e++) vl(n[e]);
			t.c = n, delete t.cases;
			break;
		}
		case 2: {
			let t = e, n = t.items;
			for (let e = 0; e < n.length; e++) vl(n[e]);
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
			vl(t.key), t.k = t.key, delete t.key, t.modifier && (vl(t.modifier), t.m = t.modifier, delete t.modifier);
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
function yl(e, t) {
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
function bl(e, t) {
	let { helper: n } = e;
	e.push(`${n("linked")}(`), wl(e, t.key), t.modifier ? (e.push(", "), wl(e, t.modifier), e.push(", _type")) : e.push(", undefined, _type"), e.push(")");
}
function xl(e, t) {
	let { helper: n, needIndent: r } = e;
	e.push(`${n("normalize")}([`), e.indent(r());
	let i = t.items.length;
	for (let n = 0; n < i && (wl(e, t.items[n]), n !== i - 1); n++) e.push(", ");
	e.deindent(r()), e.push("])");
}
function Sl(e, t) {
	let { helper: n, needIndent: r } = e;
	if (t.cases.length > 1) {
		e.push(`${n("plural")}([`), e.indent(r());
		let i = t.cases.length;
		for (let n = 0; n < i && (wl(e, t.cases[n]), n !== i - 1); n++) e.push(", ");
		e.deindent(r()), e.push("])");
	}
}
function Cl(e, t) {
	t.body ? wl(e, t.body) : e.push("null");
}
function wl(e, t) {
	let { helper: n } = e;
	switch (t.type) {
		case 0:
			Cl(e, t);
			break;
		case 1:
			Sl(e, t);
			break;
		case 2:
			xl(e, t);
			break;
		case 6:
			bl(e, t);
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
var Tl = (e, t = {}) => {
	let n = X(t.mode) ? t.mode : "normal", r = X(t.filename) ? t.filename : "message.intl";
	t.sourceMap;
	let i = t.breakLineCode == null ? n === "arrow" ? ";" : "\n" : t.breakLineCode, a = t.needIndent ? t.needIndent : n !== "arrow", o = e.helpers || [], s = yl(e, {
		filename: r,
		breakLineCode: i,
		needIndent: a
	});
	s.push(n === "normal" ? "function __msg__ (ctx) {" : "(ctx) => {"), s.indent(a), o.length > 0 && (s.push(`const { ${Zs(o.map((e) => `${e}: _${e}`), ", ")} } = ctx`), s.newline()), s.push("return "), wl(s, e), s.deindent(a), s.push("}"), delete e.helpers;
	let { code: c, map: l } = s.context();
	return {
		ast: e,
		code: c,
		map: l ? l.toJSON() : void 0
	};
};
function El(e, t = {}) {
	let n = Ns({}, t), r = !!n.jit, i = !!n.minify, a = n.optimize == null || n.optimize, o = ul(n).parse(e);
	return r ? (a && gl(o), i && vl(o), {
		ast: o,
		code: ""
	}) : (hl(o, n), Tl(o, n));
}
// node_modules/.pnpm/@intlify+core-base@11.4.23/node_modules/@intlify/core-base/dist/core-base.mjs
function Dl() {
	typeof __INTLIFY_PROD_DEVTOOLS__ != "boolean" && (Ls().__INTLIFY_PROD_DEVTOOLS__ = !1), typeof __INTLIFY_DROP_MESSAGE_COMPILER__ != "boolean" && (Ls().__INTLIFY_DROP_MESSAGE_COMPILER__ = !1);
}
function Ol(e) {
	return Gs(e) && Rl(e) === 0 && (zs(e, "b") || zs(e, "body"));
}
var kl = ["b", "body"];
function Al(e) {
	return Gl(e, kl);
}
var jl = ["c", "cases"];
function Ml(e) {
	return Gl(e, jl, []);
}
var Nl = ["s", "static"];
function Pl(e) {
	return Gl(e, Nl);
}
var Fl = ["i", "items"];
function Il(e) {
	return Gl(e, Fl, []);
}
var Ll = ["t", "type"];
function Rl(e) {
	return Gl(e, Ll);
}
var zl = ["v", "value"];
function Bl(e, t) {
	let n = Gl(e, zl);
	if (n != null) return n;
	throw ql(t);
}
var Vl = ["m", "modifier"];
function Hl(e) {
	return Gl(e, Vl);
}
var Ul = ["k", "key"];
function Wl(e) {
	let t = Gl(e, Ul);
	if (t) return t;
	throw ql(6);
}
function Gl(e, t, n) {
	for (let n = 0; n < t.length; n++) {
		let r = t[n];
		if (zs(e, r) && e[r] != null) return e[r];
	}
	return n;
}
var Kl = [
	...kl,
	...jl,
	...Nl,
	...Fl,
	...Ul,
	...Vl,
	...zl,
	...Ll
];
function ql(e) {
	return /* @__PURE__ */ Error(`unhandled node type: ${e}`);
}
function Jl(e) {
	return (t) => Yl(t, e);
}
function Yl(e, t) {
	let n = Al(t);
	if (n == null) throw ql(0);
	if (Rl(n) === 1) {
		let t = Ml(n);
		return e.plural(t.reduce((t, n) => [...t, Xl(e, n)], []));
	}
	return Xl(e, n);
}
function Xl(e, t) {
	let n = Pl(t);
	if (n != null) return e.type === "text" ? n : e.normalize([n]);
	{
		let n = Il(t).reduce((t, n) => [...t, Zl(e, n)], []);
		return e.normalize(n);
	}
}
function Zl(e, t) {
	let n = Rl(t);
	switch (n) {
		case 3: return Bl(t, n);
		case 9: return Bl(t, n);
		case 4: {
			let r = t;
			if (zs(r, "k") && r.k) return e.interpolate(e.named(r.k));
			if (zs(r, "key") && r.key) return e.interpolate(e.named(r.key));
			throw ql(n);
		}
		case 5: {
			let r = t;
			if (zs(r, "i") && ks(r.i)) return e.interpolate(e.list(r.i));
			if (zs(r, "index") && ks(r.index)) return e.interpolate(e.list(r.index));
			throw ql(n);
		}
		case 6: {
			let n = t, r = Hl(n), i = Wl(n);
			return e.linked(Zl(e, i), r ? Zl(e, r) : void 0, e.type);
		}
		case 7: return Bl(t, n);
		case 8: return Bl(t, n);
		default: throw Error(`unhandled node on format message part: ${n}`);
	}
}
var Ql = (e) => e, $l = Fs();
function eu(e, t = {}) {
	let n = !1, r = t.onError || qc;
	return t.onError = (e) => {
		n = !0, r(e);
	}, {
		...El(e, t),
		detectError: n
	};
}
/* #__NO_SIDE_EFFECTS__ */
function tu(e, t) {
	if (!__INTLIFY_DROP_MESSAGE_COMPILER__ && X(e)) {
		Ws(t.warnHtmlMessage) && t.warnHtmlMessage;
		let n = (t.onCacheKey || Ql)(e), r = $l[n];
		if (r) return r;
		let { ast: i, detectError: a } = eu(e, {
			...t,
			location: !1,
			jit: !0
		}), o = Jl(i);
		return a ? o : $l[n] = o;
	}
	{
		if (!Ol(e)) return (() => e);
		let t = e.cacheKey;
		return t ? $l[t] || ($l[t] = Jl(e)) : Jl(e);
	}
}
var nu = null;
function ru(e) {
	nu = e;
}
function iu(e, t, n) {
	nu && nu.emit("i18n:init", {
		timestamp: Date.now(),
		i18n: e,
		version: t,
		meta: n
	});
}
var au = /* #__PURE__*/ ou("function:translate");
function ou(e) {
	return (t) => nu && nu.emit(e, t);
}
var su = {
	INVALID_ARGUMENT: 17,
	INVALID_DATE_ARGUMENT: 18,
	INVALID_ISO_DATE_ARGUMENT: 19,
	NOT_SUPPORT_NON_STRING_MESSAGE: 20,
	NOT_SUPPORT_LOCALE_PROMISE_VALUE: 21,
	NOT_SUPPORT_LOCALE_ASYNC_FUNCTION: 22,
	NOT_SUPPORT_LOCALE_TYPE: 23
};
function cu(e) {
	return Kc(e, null, void 0);
}
su.INVALID_ARGUMENT, su.INVALID_DATE_ARGUMENT, su.INVALID_ISO_DATE_ARGUMENT, su.NOT_SUPPORT_NON_STRING_MESSAGE, su.NOT_SUPPORT_LOCALE_PROMISE_VALUE, su.NOT_SUPPORT_LOCALE_ASYNC_FUNCTION, su.NOT_SUPPORT_LOCALE_TYPE;
function lu(e, t) {
	return t.locale == null ? du(e.locale) : du(t.locale);
}
var uu;
function du(e) {
	if (X(e)) return e;
	if (Us(e)) {
		if (e.resolvedOnce && uu != null) return uu;
		if (e.constructor.name === "Function") {
			let t = e();
			if (Ks(t)) throw cu(su.NOT_SUPPORT_LOCALE_PROMISE_VALUE);
			return uu = t;
		}
		throw cu(su.NOT_SUPPORT_LOCALE_ASYNC_FUNCTION);
	}
	throw cu(su.NOT_SUPPORT_LOCALE_TYPE);
}
function fu(e, t, n) {
	return [.../* @__PURE__ */ new Set([n, ...Hs(t) ? t : Gs(t) ? Object.keys(t).filter((e) => e !== "default") : X(t) ? [t] : [n]])];
}
function pu(e, t, n) {
	let r = X(n) ? n : ku, i = e, a;
	Gs(t) ? (i.__localeChainObjectCache ||= /* @__PURE__ */ new WeakMap(), a = i.__localeChainObjectCache.get(t), a || (a = /* @__PURE__ */ new Map(), i.__localeChainObjectCache.set(t, a))) : (i.__localeChainCache ||= /* @__PURE__ */ new Map(), a = i.__localeChainCache.get(t), a || (a = /* @__PURE__ */ new Map(), i.__localeChainCache.set(t, a)));
	let o = a.get(r);
	if (o) return o;
	let s = [], c = [n];
	for (; Hs(c);) c = mu(s, c, t);
	let l = Hs(t) || !Ys(t) ? t : t.default ? t.default : null;
	return c = X(l) ? [l] : l, Hs(c) && mu(s, c, !1), a.set(r, s), s;
}
function mu(e, t, n) {
	let r = !0;
	for (let i = 0; i < t.length && Ws(r); i++) {
		let a = t[i];
		X(a) && (r = hu(e, t[i], n));
	}
	return r;
}
function hu(e, t, n) {
	let r, i = t.split("-");
	do
		r = gu(e, i.join("-"), n), i.splice(-1, 1);
	while (i.length && r === !0);
	return r;
}
function gu(e, t, n) {
	let r = !1;
	if (!e.includes(t) && (r = !0, t)) {
		r = t[t.length - 1] !== "!";
		let i = t.replace(/!/g, "");
		e.push(i), (Hs(n) || Ys(n)) && n[i] && (r = n[i]);
	}
	return r;
}
var _u = [];
_u[0] = {
	w: [0],
	i: [3, 0],
	"[": [4],
	o: [7]
}, _u[1] = {
	w: [1],
	".": [2],
	"[": [4],
	o: [7]
}, _u[2] = {
	w: [2],
	i: [3, 0],
	0: [3, 0]
}, _u[3] = {
	i: [3, 0],
	0: [3, 0],
	w: [1, 1],
	".": [2, 1],
	"[": [4, 1],
	o: [7, 1]
}, _u[4] = {
	"'": [5, 0],
	"\"": [6, 0],
	"[": [4, 2],
	"]": [1, 3],
	o: 8,
	l: [4, 0]
}, _u[5] = {
	"'": [4, 0],
	o: 8,
	l: [5, 0]
}, _u[6] = {
	"\"": [4, 0],
	o: 8,
	l: [6, 0]
};
var vu = /^\s?(?:true|false|-?[\d.]+|'[^']*'|"[^"]*")\s?$/;
function yu(e) {
	return vu.test(e);
}
function bu(e) {
	let t = e.charCodeAt(0);
	return t === e.charCodeAt(e.length - 1) && (t === 34 || t === 39) ? e.slice(1, -1) : e;
}
function xu(e) {
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
function Su(e) {
	let t = e.trim();
	return e.charAt(0) === "0" && isNaN(parseInt(e)) ? !1 : yu(t) ? bu(t) : "*" + t;
}
function Cu(e) {
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
			if (i = 0, o === void 0 || (o = Su(o), o === !1)) return !1;
			f[1]();
		}
	};
	function p() {
		let t = e[n + 1];
		if (r === 5 && t === "'" || r === 6 && t === "\"") return n++, s = "\\" + t, f[0](), !0;
	}
	for (; r !== null;) if (n++, a = e[n], !(a === "\\" && p())) {
		if (c = xu(a), d = _u[r], l = d[c] || d.l || 8, l === 8 || (r = l[0], l[1] !== void 0 && (u = f[l[1]], u && (s = a, u() === !1)))) return;
		if (r === 7) return t;
	}
}
var wu = /* @__PURE__ */ new Map();
function Tu(e, t) {
	return Gs(e) ? Bs(e, t) : null;
}
function Eu(e, t) {
	if (!Gs(e)) return null;
	let n = wu.get(t);
	if (n || (n = Cu(t), n && wu.set(t, n)), !n) return null;
	let r = n.length, i = e, a = 0;
	for (; a < r;) {
		let e = n[a];
		if (Kl.includes(e) && Ol(i) || !Gs(i) || !zs(i, e)) return null;
		let t = i[e];
		if (t === void 0 || Us(i)) return null;
		i = t, a++;
	}
	return i;
}
var Du = {
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
Du.NOT_FOUND_KEY, Du.FALLBACK_TO_TRANSLATE, Du.CANNOT_FORMAT_NUMBER, Du.FALLBACK_TO_NUMBER_FORMAT, Du.CANNOT_FORMAT_DATE, Du.FALLBACK_TO_DATE_FORMAT, Du.EXPERIMENTAL_CUSTOM_MESSAGE_COMPILER, Du.INVALID_NUMBER_ARGUMENT, Du.INVALID_DATE_ARGUMENT;
var Ou = "11.4.23", ku = "en-US", Au = (e) => `${e.charAt(0).toLocaleUpperCase()}${e.substr(1)}`;
function ju() {
	return {
		upper: (e, t) => t === "text" && X(e) ? e.toUpperCase() : t === "vnode" && Gs(e) && "__v_isVNode" in e ? e.children.toUpperCase() : e,
		lower: (e, t) => t === "text" && X(e) ? e.toLowerCase() : t === "vnode" && Gs(e) && "__v_isVNode" in e ? e.children.toLowerCase() : e,
		capitalize: (e, t) => t === "text" && X(e) ? Au(e) : t === "vnode" && Gs(e) && "__v_isVNode" in e ? Au(e.children) : e
	};
}
var Mu;
function Nu(e) {
	Mu = e;
}
var Pu;
function Fu(e) {
	Pu = e;
}
var Iu;
function Lu(e) {
	Iu = e;
}
var Ru = null, zu = /* @__NO_SIDE_EFFECTS__ */ () => Ru, Bu = null, Vu = (e) => {
	Bu = e;
}, Hu = () => Bu, Uu = 0;
function Wu(e = {}) {
	let t = Us(e.onWarn) ? e.onWarn : Qs, n = X(e.version) ? e.version : Ou, r = X(e.locale) || Us(e.locale) ? e.locale : ku, i = Us(r) ? ku : r, a = Hs(e.fallbackLocale) || Ys(e.fallbackLocale) || X(e.fallbackLocale) || e.fallbackLocale === !1 ? e.fallbackLocale : i, o = Ys(e.messages) ? e.messages : Gu(i), s = Ys(e.datetimeFormats) ? e.datetimeFormats : Gu(i), c = Ys(e.numberFormats) ? e.numberFormats : Gu(i), l = Ns(Fs(), e.modifiers, ju()), u = e.pluralRules || Fs(), d = Us(e.missing) ? e.missing : null, f = Ws(e.missingWarn) || js(e.missingWarn) ? e.missingWarn : !0, p = Ws(e.fallbackWarn) || js(e.fallbackWarn) ? e.fallbackWarn : !0, m = !!e.fallbackFormat, h = !!e.unresolving, g = Us(e.postTranslation) ? e.postTranslation : null, _ = Ys(e.processor) ? e.processor : null, v = !Ws(e.warnHtmlMessage) || e.warnHtmlMessage, y = !!e.escapeParameter, b = Us(e.messageCompiler) ? e.messageCompiler : Mu, x = Us(e.messageResolver) ? e.messageResolver : Pu || Tu, S = Us(e.localeFallbacker) ? e.localeFallbacker : Iu || fu, C = Gs(e.fallbackContext) ? e.fallbackContext : void 0, w = e, T = Gs(w.__datetimeFormatters) ? w.__datetimeFormatters : /* @__PURE__ */ new Map(), E = Gs(w.__numberFormatters) ? w.__numberFormatters : /* @__PURE__ */ new Map(), D = Gs(w.__meta) ? w.__meta : {};
	Uu++;
	let O = {
		version: n,
		cid: Uu,
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
	return O.datetimeFormats = s, O.numberFormats = c, O.__datetimeFormatters = T, O.__numberFormatters = E, __INTLIFY_PROD_DEVTOOLS__ && iu(O, n, D), O;
}
var Gu = (e) => ({ [e]: Fs() });
function Ku(e, t, n, r, i) {
	let { missing: a, onWarn: o } = e;
	if (a !== null) {
		let r = a(e, n, t, i);
		return X(r) ? r : t;
	}
	return t;
}
function qu(e, t) {
	let n = e;
	Gs(t) ? n.__localeChainObjectCache?.delete(t) : n.__localeChainCache?.delete(t);
}
function Ju(e, t, n) {
	qu(e, n), e.fallbackContext && qu(e.fallbackContext, n), e.localeFallbacker(e, n, t);
}
function Yu(e, t) {
	return e !== t && e.split("-")[0] === t.split("-")[0];
}
function Xu(e, t) {
	let n = t.indexOf(e);
	if (n === -1) return !1;
	for (let r = n + 1; r < t.length; r++) if (Yu(e, t[r])) return !0;
	return !1;
}
function Zu(e, t, n, r, i, a, o) {
	let { fallbackLocale: s, localeFallbacker: c, onWarn: l } = e, u = c(e, s, n);
	for (let n = 0; n < u.length; n++) {
		let a = u[n];
		if (Ys(Bs(Bs(r, a) || {}, t)) && X(a)) return a;
		Ku(e, t, a, i, o);
	}
	return null;
}
function Qu(e, t, n) {
	let r = `${e}__${t}`;
	return Ys(n) && !Ms(n) && (r = `${r}__${JSON.stringify(n)}`), r;
}
function $u(e, t, n) {
	for (let r in n) {
		let n = `${t}__${r}`;
		for (let t of e.keys()) (t === n || t.startsWith(`${n}__`)) && e.delete(t);
	}
}
function ed(e, t, n, r) {
	let [, i, a, o] = e, s = n;
	return X(i) ? t.key = i : Ys(i) && Object.keys(i).forEach((e) => {
		r.includes(e) ? s[e] = i[e] : t[e] = i[e];
	}), X(a) ? t.locale = a : Ys(a) && (s = a), Ys(o) && (s = o), s;
}
var td = typeof Intl < "u";
td && Intl.DateTimeFormat, td && Intl.NumberFormat;
function nd(e, ...t) {
	let { datetimeFormats: n, unresolving: r, onWarn: i } = e, { __datetimeFormatters: a } = e;
	if (!X(t[0]) && !As(t[0]) && !ks(t[0])) return "";
	let [o, s, c, l] = id(...t), u = Ws(c.missingWarn) ? c.missingWarn : e.missingWarn, d = Ws(c.fallbackWarn) ? c.fallbackWarn : e.fallbackWarn, f = !!c.part, p = lu(e, c);
	if (!X(o) || o === "") {
		let e = new Intl.DateTimeFormat(p.replace(/!/g, ""), l);
		return f ? e.formatToParts(s) : e.format(s);
	}
	let m = Zu(e, o, p, n, u, d, "datetime format");
	if (!X(m)) return r ? -1 : o;
	let h = n[m][o], g = Qu(m, o, l), _ = a.get(g);
	return _ || (_ = new Intl.DateTimeFormat(m, Ns({}, h, l)), a.set(g, _)), f ? _.formatToParts(s) : _.format(s);
}
var rd = [
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
function id(...e) {
	let [t] = e, n = Fs(), r = Fs(), i;
	if (X(t)) {
		let e = t.match(/(\d{4}-\d{2}-\d{2})(T|\s)?(.*)/);
		if (!e) throw cu(su.INVALID_ISO_DATE_ARGUMENT);
		let n = e[3] ? e[3].trim().startsWith("T") ? `${e[1].trim()}${e[3].trim()}` : `${e[1].trim()}T${e[3].trim()}` : e[1].trim();
		i = new Date(n);
		try {
			i.toISOString();
		} catch {
			throw cu(su.INVALID_ISO_DATE_ARGUMENT);
		}
	} else if (As(t)) {
		if (isNaN(t.getTime())) throw cu(su.INVALID_DATE_ARGUMENT);
		i = t;
	} else if (ks(t)) i = t;
	else throw cu(su.INVALID_ARGUMENT);
	let a = ed(e, n, r, rd);
	return [
		n.key || "",
		i,
		n,
		a
	];
}
function ad(e, t, n) {
	$u(e.__datetimeFormatters, t, n);
}
function od(e, ...t) {
	let { numberFormats: n, unresolving: r, onWarn: i } = e, { __numberFormatters: a } = e;
	if (!ks(t[0])) return "";
	let [o, s, c, l] = cd(...t), u = Ws(c.missingWarn) ? c.missingWarn : e.missingWarn, d = Ws(c.fallbackWarn) ? c.fallbackWarn : e.fallbackWarn, f = !!c.part, p = lu(e, c);
	if (!X(o) || o === "") {
		let e = new Intl.NumberFormat(p.replace(/!/g, ""), l);
		return f ? e.formatToParts(s) : e.format(s);
	}
	let m = Zu(e, o, p, n, u, d, "number format");
	if (!X(m)) return r ? -1 : o;
	let h = n[m][o], g = Qu(m, o, l), _ = a.get(g);
	return _ || (_ = new Intl.NumberFormat(m, Ns({}, h, l)), a.set(g, _)), f ? _.formatToParts(s) : _.format(s);
}
var sd = [
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
function cd(...e) {
	let [t] = e, n = Fs(), r = Fs();
	if (!ks(t)) throw cu(su.INVALID_ARGUMENT);
	let i = t, a = ed(e, n, r, sd);
	return [
		n.key || "",
		i,
		n,
		a
	];
}
function ld(e, t, n) {
	$u(e.__numberFormatters, t, n);
}
var ud = (e) => e, dd = (e) => "", fd = "text", pd = (e) => e.length === 0 ? "" : Zs(e), md = Xs;
function hd(e, t) {
	return e = Math.abs(e), t === 2 ? e === 1 ? 0 : 1 : Math.min(e, 2);
}
function gd(e) {
	let t = ks(e.pluralIndex) ? e.pluralIndex : -1;
	return ks(e.named?.count) ? e.named.count : ks(e.named?.n) ? e.named.n : t;
}
function _d(e = {}) {
	let t = e.locale, n = gd(e), r = X(t) && e.pluralRules && Us(Bs(e.pluralRules, t)) ? e.pluralRules[t] : hd, i = r === hd ? void 0 : hd, a = (e) => e[r(n, e.length, i)], o = e.list || [], s = (e) => o[e], c = e.named || Fs(), l = ks(e.pluralIndex), u = (t) => {
		let n = Vs(t) ? Bs(c, t) : c[t];
		return l && !n && (t === "count" || t === "n") ? e.pluralIndex : n;
	};
	function d(t, n) {
		return (Us(e.messages) ? e.messages(t, !!n) : Gs(e.messages) ? e.messages[t] : !1) || (e.parent ? e.parent.message(t) : dd);
	}
	let f = (t) => e.modifiers ? Bs(e.modifiers, t) : ud, p = Us(e.processor?.normalize) ? e.processor.normalize : pd, m = Us(e.processor?.interpolate) ? e.processor.interpolate : md, h = {
		list: s,
		named: u,
		plural: a,
		linked: (e, ...t) => {
			let [n, r] = t, i = "text", a = "";
			t.length === 1 ? Gs(n) ? (a = n.modifier || a, i = n.type || i) : X(n) && (a = n || a) : t.length === 2 && (X(n) && (a = n || a), X(r) && (i = r || i));
			let o = d(e, !0)(h), s = o === "" || o === void 0 ? e : o, c = i === "vnode" && Hs(s) && a ? s[0] : s;
			if (!a) return c;
			let l = f(a);
			return Us(l) ? l(c, i) : c;
		},
		message: d,
		type: X(e.processor?.type) ? e.processor.type : fd,
		interpolate: m,
		normalize: p,
		values: Ns(Fs(), o, c, l ? {
			count: u("count"),
			n: u("n")
		} : {})
	};
	return h;
}
var vd = () => "", yd = (e) => Us(e), bd = (e) => X(e) || Ol(e) || yd(e);
function xd(e, ...t) {
	let { fallbackFormat: n, postTranslation: r, unresolving: i, messageCompiler: a, fallbackLocale: o, messages: s } = e, [c, l] = Od(...t), u = Ws(l.missingWarn) ? l.missingWarn : e.missingWarn, d = Ws(l.fallbackWarn) ? l.fallbackWarn : e.fallbackWarn, f = Ws(l.escapeParameter) ? l.escapeParameter : e.escapeParameter, p = !!l.resolvedMessage, m = X(l.default) || Ws(l.default) ? Ws(l.default) ? a ? c : () => c : l.default : n ? a ? c : () => c : null, h = n || m != null && (X(m) || Us(m)), g = lu(e, l);
	f && Sd(l);
	let [_, v, y] = p ? [
		c,
		g,
		Bs(s, g) || Fs()
	] : Td(e, c, g, o, d, u), b = _, x = c;
	if (!p && !bd(b) && h && (b = m, x = b), !p && (!bd(b) || !X(v))) return i ? -1 : c;
	let S = !1, C = yd(b) ? b : Ed(e, c, v, b, x, () => {
		S = !0;
	});
	if (S) return b;
	let w = Dd(e, C, _d(Ad(e, v, y, l, f))), T = r ? r(w, c) : w;
	if (f && X(T) && (T = Bc(T)), __INTLIFY_PROD_DEVTOOLS__) {
		let t = {
			timestamp: Date.now(),
			key: X(c) ? c : yd(b) ? b.key : "",
			locale: v || (yd(b) ? b.locale : ""),
			format: X(b) ? b : yd(b) ? b.source : "",
			message: T
		};
		t.meta = Ns({}, e.__meta, /* @__PURE__ */ zu() || {}), au(t);
	}
	return T;
}
function Sd(e) {
	if (Hs(e.list) && (e.list = e.list.map((e) => X(e) ? $s(e) : e)), Gs(e.named)) {
		let t = e.named, n = Fs();
		for (let e of Object.keys(t)) {
			let r = t[e];
			n[e] = X(r) ? $s(r) : r;
		}
		e.named = n;
	}
}
function Cd(e) {
	return X(e) ? e : $s(Xs(e));
}
function wd(e, t) {
	return !t || Us(e?.interpolate) ? e : Ns({}, e, { interpolate: Cd });
}
function Td(e, t, n, r, i, a) {
	let { messages: o, onWarn: s, messageResolver: c, localeFallbacker: l } = e, u = l(e, r, n), d = Fs(), f, p = null;
	for (let n = 0; n < u.length && (f = u[n], d = Bs(o, f) || Fs(), (p = c(d, t)) === null && (p = Bs(d, t)), !bd(p)); n++) if (!Xu(f, u)) {
		let n = Ku(e, t, f, a, "translate");
		n !== t && (p = n);
	}
	return [
		p,
		f,
		d
	];
}
function Ed(e, t, n, r, i, a) {
	let { messageCompiler: o, warnHtmlMessage: s } = e;
	if (yd(r)) {
		let e = r;
		return e.locale = e.locale || n, e.key = e.key || t, e;
	}
	if (o == null) {
		let e = (() => r);
		return e.locale = n, e.key = t, e;
	}
	let c = o(r, kd(e, n, i, r, s, a));
	return c.locale = n, c.key = t, c.source = r, c;
}
function Dd(e, t, n) {
	return t(n);
}
function Od(...e) {
	let [t, n, r] = e, i = Fs();
	if (!X(t) && !ks(t) && !yd(t) && !Ol(t)) throw cu(su.INVALID_ARGUMENT);
	let a = ks(t) ? String(t) : (yd(t), t);
	return ks(n) ? i.plural = n : X(n) ? i.default = n : Ys(n) && !Ms(n) ? i.named = n : Hs(n) && (i.list = n), ks(r) ? i.plural = r : X(r) ? i.default = r : Ys(r) && Ns(i, r), [a, i];
}
function kd(e, t, n, r, i, a) {
	return {
		locale: t,
		key: n,
		warnHtmlMessage: i,
		onError: (e) => {
			throw a && a(e), e;
		},
		onCacheKey: (e) => Ds(t, n, e)
	};
}
function Ad(e, t, n, r, i) {
	let { modifiers: a, pluralRules: o, messageResolver: s, fallbackLocale: c, fallbackWarn: l, missingWarn: u, fallbackContext: d } = e, f = {
		locale: t,
		modifiers: a,
		pluralRules: o,
		messages: (r, i) => {
			let a = s(n, r);
			if (a == null && (d || i)) {
				let [n, , i] = Td(d || e, r, t, c, l, u);
				a = n ?? s(i, r);
			}
			if (X(a) || Ol(a)) {
				let n = !1, i = Ed(e, r, t, a, r, () => {
					n = !0;
				});
				return n ? vd : i;
			}
			return yd(a) ? a : vd;
		}
	}, p = wd(e.processor, i);
	return p && (f.processor = p), r.list && (f.list = r.list), r.named && (f.named = r.named), ks(r.plural) && (f.pluralIndex = r.plural), f;
}
Dl();
// node_modules/.pnpm/vue-i18n@11.4.23_vue@3.5.42_typescript@6.0.3_/node_modules/vue-i18n/dist/vue-i18n.mjs
var jd = "11.4.23";
function Md() {
	typeof __VUE_I18N_FULL_INSTALL__ != "boolean" && (Ls().__VUE_I18N_FULL_INSTALL__ = !0), typeof __VUE_I18N_LEGACY_API__ != "boolean" && (Ls().__VUE_I18N_LEGACY_API__ = !0), typeof __INTLIFY_DROP_MESSAGE_COMPILER__ != "boolean" && (Ls().__INTLIFY_DROP_MESSAGE_COMPILER__ = !1), typeof __INTLIFY_PROD_DEVTOOLS__ != "boolean" && (Ls().__INTLIFY_PROD_DEVTOOLS__ = !1);
}
var Nd = {
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
function Pd(e, ...t) {
	return Kc(e, null, void 0);
}
Nd.UNEXPECTED_RETURN_TYPE, Nd.INVALID_ARGUMENT, Nd.MUST_BE_CALL_SETUP_TOP, Nd.NOT_INSTALLED, Nd.UNEXPECTED_ERROR, Nd.REQUIRED_VALUE, Nd.INVALID_VALUE, Nd.CANNOT_SETUP_VUE_DEVTOOLS_PLUGIN, Nd.NOT_INSTALLED_WITH_PROVIDE, Nd.NOT_COMPATIBLE_LEGACY_VUE_I18N, Nd.NOT_AVAILABLE_COMPOSITION_IN_LEGACY;
var Fd = /* #__PURE__*/ Es("__translateVNode"), Id = /* #__PURE__*/ Es("__datetimeParts"), Ld = /* #__PURE__*/ Es("__numberParts"), Rd = Es("__setPluralRules");
Es("__intlifyMeta");
var zd = /* #__PURE__*/ Es("__injectWithOption"), Bd = /* #__PURE__*/ Es("__dispose"), Vd = {
	FALLBACK_TO_ROOT: 10,
	NOT_FOUND_PARENT_SCOPE: 11,
	IGNORE_OBJ_FLATTEN: 12,
	DEPRECATE_LEGACY_MODE: 13,
	DEPRECATE_TRANSLATE_CUSTOME_DIRECTIVE: 14,
	DUPLICATE_USE_I18N_CALLING: 15,
	IGNORE_UNSAFE_LOCALE: 16
};
Vd.FALLBACK_TO_ROOT, Vd.NOT_FOUND_PARENT_SCOPE, Vd.IGNORE_OBJ_FLATTEN, Vd.DEPRECATE_LEGACY_MODE, Vd.DEPRECATE_TRANSLATE_CUSTOME_DIRECTIVE, Vd.DUPLICATE_USE_I18N_CALLING, Vd.IGNORE_UNSAFE_LOCALE;
var Hd = null;
{
	let e = Ls().__VUE_INSTANCE_SETTERS__;
	Hs(e) && e.push((e) => {
		Hd = e;
	});
}
function Ud(e) {
	return !!Vs(e);
}
function Wd(e) {
	if (!Gs(e) || Ol(e)) return e;
	for (let t in e) if (zs(e, t)) {
		if (!t.includes(".")) Gs(e[t]) && Wd(e[t]);
		else {
			let n = t.split("."), r = n.length - 1, i = e, a = !1;
			for (let e = 0; e < r; e++) {
				if (n[e] === "__proto__") throw Error(`unsafe key: ${n[e]}`);
				if (n[e] in i || (i[n[e]] = Fs()), !Gs(i[n[e]]) || Ol(i[n[e]]) && (Kl.includes(n[e + 1]) || n[e + 1] === "cacheKey")) {
					a = !0;
					break;
				}
				i = i[n[e]];
			}
			a || (i[n[r]] = e[t], delete e[t]);
			let o = i[n[r]];
			Gs(o) && Wd(o);
		}
	}
	return e;
}
function Gd(e, t) {
	let { messages: n, __i18n: r, messageResolver: i, flatJson: a } = t, o = Ys(n) ? n : Hs(r) ? Fs() : { [e]: Fs() };
	if (Hs(r) && r.forEach((e) => {
		if ("locale" in e && "resource" in e) {
			let { locale: t, resource: n } = e;
			if (t) {
				if (Ud(t)) return;
				o[t] = Bs(o, t) || Fs(), Hc(n, o[t]);
			} else Hc(n, o);
		} else X(e) && Hc(JSON.parse(e), o);
	}), i == null && a) for (let e in o) zs(o, e) && Wd(o[e]);
	return o;
}
function Kd(e) {
	return e.type;
}
function qd(e, t, n) {
	let r = Gs(t.messages) ? t.messages : Fs();
	"__i18nGlobal" in n && (r = Gd(e.locale.value, {
		messages: r,
		__i18n: n.__i18nGlobal
	}));
	let i = Object.keys(r);
	if (i.length && i.forEach((t) => {
		e.mergeLocaleMessage(t, r[t]);
	}), Gs(t.datetimeFormats)) {
		let n = Object.keys(t.datetimeFormats);
		n.length && n.forEach((n) => {
			e.mergeDateTimeFormat(n, t.datetimeFormats[n]);
		});
	}
	if (Gs(t.numberFormats)) {
		let n = Object.keys(t.numberFormats);
		n.length && n.forEach((n) => {
			e.mergeNumberFormat(n, t.numberFormats[n]);
		});
	}
}
function Jd(e) {
	return G(Sa, null, e, 0);
}
function Yd() {
	return Hd ?? Ka();
}
function Xd(e) {
	return e.scope;
}
function Zd(e, t) {
	let n = Xd(e);
	n.active ? n.run(() => Ae(t)) : t();
}
var Qd = () => [], $d = () => !1, ef = 0;
function tf(e) {
	return ((t, n, r, i) => e(n, r, Yd() || void 0, i));
}
function nf(e = {}) {
	let { __root: t, __injectWithOption: n } = e, r = t === void 0, i = e.flatJson, a = Ts ? N : P, o = !Ws(e.inheritLocale) || e.inheritLocale, s = a(t && o ? t.locale.value : X(e.locale) ? e.locale : ku), c = a(t && o ? t.fallbackLocale.value : X(e.fallbackLocale) || Hs(e.fallbackLocale) || Ys(e.fallbackLocale) || e.fallbackLocale === !1 ? e.fallbackLocale : s.value), l = a(Gd(s.value, e)), u = a(Ys(e.datetimeFormats) ? e.datetimeFormats : { [s.value]: {} }), d = a(Ys(e.numberFormats) ? e.numberFormats : { [s.value]: {} }), f = t ? t.missingWarn : Ws(e.missingWarn) || js(e.missingWarn) ? e.missingWarn : !0, p = t ? t.fallbackWarn : Ws(e.fallbackWarn) || js(e.fallbackWarn) ? e.fallbackWarn : !0, m = t ? t.fallbackRoot : !Ws(e.fallbackRoot) || e.fallbackRoot, h = !!e.fallbackFormat, g = Us(e.missing) ? e.missing : null, _ = Us(e.missing) ? tf(e.missing) : null, v = Us(e.postTranslation) ? e.postTranslation : null, y = t ? t.warnHtmlMessage : !Ws(e.warnHtmlMessage) || e.warnHtmlMessage, b = !!e.escapeParameter, x = t ? t.modifiers : Ys(e.modifiers) ? e.modifiers : {}, S = e.pluralRules || t && t.pluralRules, C;
	C = (() => {
		r && Vu(null);
		let t = {
			version: jd,
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
		let n = Wu(t);
		return r && Vu(n), n;
	})(), Ju(C, s.value, c.value);
	function w() {
		return [
			s.value,
			c.value,
			l.value,
			u.value,
			d.value
		];
	}
	let T = Y({
		get: () => s.value,
		set: (e) => {
			C.locale = e, s.value = e;
		}
	});
	function E(e) {
		r || (C.fallbackContext = Hu());
		try {
			return e();
		} finally {
			r || (C.fallbackContext = void 0);
		}
	}
	function D(e) {
		E(() => Ju(C, s.value, e));
	}
	let O = Y({
		get: () => c.value,
		set: (e) => {
			c.value = e, C.fallbackLocale = c.value, D(c.value);
		}
	}), k = Y(() => l.value), ee = /* #__PURE__*/ Y(() => u.value), A = /* #__PURE__*/ Y(() => d.value);
	function j() {
		return Us(v) ? v : null;
	}
	function te(e) {
		v = e, C.postTranslation = e;
	}
	function ne() {
		return g;
	}
	function re(e) {
		e !== null && (_ = tf(e)), g = e, C.missing = _;
	}
	let ie = (e, n, r, i, a, o) => {
		w();
		let s;
		try {
			__INTLIFY_PROD_DEVTOOLS__, s = E(() => e(C));
		} finally {
			__INTLIFY_PROD_DEVTOOLS__;
		}
		if (r !== "translate exists" && ks(s) && s === -1 || r === "translate exists" && !s) {
			let [e, r] = n();
			return t && m ? i(t) : a(e);
		}
		if (o(s)) return s;
		/* istanbul ignore next */
		throw Pd(Nd.UNEXPECTED_RETURN_TYPE);
	};
	function ae(...e) {
		return ie((t) => Reflect.apply(xd, null, [t, ...e]), () => Od(...e), "translate", (t) => Reflect.apply(t.t, t, [...e]), (e) => e, (e) => X(e));
	}
	function oe(...e) {
		let [t, n, r] = e;
		if (r && !Gs(r)) throw Pd(Nd.INVALID_ARGUMENT);
		return ae(t, n, Ns({ resolvedMessage: !0 }, r || {}));
	}
	function se(...e) {
		return ie((t) => Reflect.apply(nd, null, [t, ...e]), () => id(...e), "datetime format", (t) => Reflect.apply(t.d, t, [...e]), () => "", (e) => X(e) || Hs(e));
	}
	function ce(...e) {
		return ie((t) => Reflect.apply(od, null, [t, ...e]), () => cd(...e), "number format", (t) => Reflect.apply(t.n, t, [...e]), () => "", (e) => X(e) || Hs(e));
	}
	function le(e) {
		return e.map((e) => X(e) || ks(e) || Ws(e) ? Jd(String(e)) : e);
	}
	let ue = {
		normalize: le,
		interpolate: (e) => e,
		type: "vnode"
	};
	function de(...e) {
		return ie((t) => {
			let n, r = t;
			try {
				r.processor = ue, n = Reflect.apply(xd, null, [r, ...e]);
			} finally {
				r.processor = null;
			}
			return n;
		}, () => Od(...e), "translate", (t) => t[Fd](...e), (e) => [Jd(e)], (e) => Hs(e));
	}
	function fe(...e) {
		return ie((t) => Reflect.apply(od, null, [t, ...e]), () => cd(...e), "number format", (t) => t[Ld](...e), Qd, (e) => X(e) || Hs(e));
	}
	function pe(...e) {
		return ie((t) => Reflect.apply(nd, null, [t, ...e]), () => id(...e), "datetime format", (t) => t[Id](...e), Qd, (e) => X(e) || Hs(e));
	}
	function me(e) {
		S = e, C.pluralRules = S;
	}
	function he(e, t) {
		let n = ye(e), r = C.messageResolver(n, t);
		return r === null ? Bs(n, t) : r;
	}
	function ge(e, t) {
		return ie(() => {
			if (!e) return !1;
			let n = X(t) ? t : s.value, r = X(t) ? [n] : C.localeFallbacker(C, c.value, n);
			for (let t = 0; t < r.length; t++) if (bd(he(r[t], e))) return !0;
			return !1;
		}, () => [e], "translate exists", (n) => Reflect.apply(n.te, n, [e, t]), $d, (e) => Ws(e));
	}
	function _e(e) {
		let t = null, n = C.localeFallbacker(C, c.value, s.value);
		for (let r = 0; r < n.length; r++) {
			let i = he(n[r], e);
			if (i != null) {
				t = i;
				break;
			}
		}
		return t;
	}
	function ve(e) {
		return _e(e) ?? (t && t.tm(e) || {});
	}
	function ye(e) {
		return Bs(l.value, e) || {};
	}
	function be(e, t) {
		Ud(e) || (i && Wd(t), l.value[e] = t, C.messages = l.value);
	}
	function xe(e, t) {
		Ud(e) || (l.value[e] = Bs(l.value, e) || {}, i && Wd(t), Hc(t, l.value[e]), C.messages = l.value);
	}
	function Se(e) {
		return Bs(u.value, e) || {};
	}
	function Ce(e, t) {
		Ud(e) || (u.value[e] = t, C.datetimeFormats = u.value, ad(C, e, t));
	}
	function M(e, t) {
		Ud(e) || (u.value[e] = Ns(Bs(u.value, e) || {}, t), C.datetimeFormats = u.value, ad(C, e, t));
	}
	function we(e) {
		return Bs(d.value, e) || {};
	}
	function Te(e, t) {
		Ud(e) || (d.value[e] = t, C.numberFormats = d.value, ld(C, e, t));
	}
	function Ee(e, t) {
		Ud(e) || (d.value[e] = Ns(Bs(d.value, e) || {}, t), C.numberFormats = d.value, ld(C, e, t));
	}
	ef++, L(c, () => D(c.value), {
		deep: !0,
		flush: "sync"
	}), t && Ts && (L(t.locale, (e) => {
		o && (s.value = e, C.locale = e, Ju(C, s.value, c.value));
	}), L(t.fallbackLocale, (e) => {
		o && (c.value = e, C.fallbackLocale = c.value, Ju(C, s.value, c.value));
	}));
	let De = {
		id: ef,
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
		t: ae,
		getLocaleMessage: ye,
		setLocaleMessage: be,
		mergeLocaleMessage: xe,
		getPostTranslationHandler: j,
		setPostTranslationHandler: te,
		getMissingHandler: ne,
		setMissingHandler: re,
		[Rd]: me
	};
	return De.datetimeFormats = ee, De.numberFormats = A, De.rt = oe, De.te = ge, De.tm = ve, De.d = se, De.n = ce, De.getDateTimeFormat = Se, De.setDateTimeFormat = Ce, De.mergeDateTimeFormat = M, De.getNumberFormat = we, De.setNumberFormat = Te, De.mergeNumberFormat = Ee, De[zd] = n, De[Fd] = de, De[Id] = pe, De[Ld] = fe, De;
}
var rf = /* @__PURE__ */ new WeakMap();
function af(e) {
	if (!js(e)) return !e;
	let t = rf.get(e);
	return t || (t = RegExp(`^(?![\\s\\S]*(?:${e.source}))`, e.flags.replace(/[gy]/g, "")), rf.set(e, t), rf.set(t, e)), t;
}
function of(e) {
	let t = X(e.locale) ? e.locale : ku, n = X(e.fallbackLocale) || Hs(e.fallbackLocale) || Ys(e.fallbackLocale) || e.fallbackLocale === !1 ? e.fallbackLocale : t, r = Us(e.missing) ? e.missing : void 0, i = Ws(e.silentTranslationWarn) || js(e.silentTranslationWarn) ? af(e.silentTranslationWarn) : !0, a = Ws(e.silentFallbackWarn) || js(e.silentFallbackWarn) ? af(e.silentFallbackWarn) : !0, o = !Ws(e.fallbackRoot) || e.fallbackRoot, s = !!e.formatFallbackMessages, c = Ys(e.modifiers) ? e.modifiers : {}, l = e.pluralizationRules, u = Us(e.postTranslation) ? e.postTranslation : void 0, d = !X(e.warnHtmlInMessage) || e.warnHtmlInMessage !== "off", f = !!e.escapeParameterHtml, p = !Ws(e.sync) || e.sync, m = e.messages;
	if (Ys(e.sharedMessages)) {
		let t = e.sharedMessages;
		m = Object.keys(t).reduce((e, n) => (Ud(n) || Ns(Bs(e, n) || (e[n] = {}), t[n]), e), m || {});
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
function sf(e = {}) {
	let t = nf(of(e)), { __extender: n } = e, r = {
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
			return af(t.missingWarn);
		},
		set silentTranslationWarn(e) {
			t.missingWarn = af(e);
		},
		get silentFallbackWarn() {
			return af(t.fallbackWarn);
		},
		set silentFallbackWarn(e) {
			t.fallbackWarn = af(e);
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
function cf(e, t, n) {
	return {
		beforeCreate() {
			let r = Yd();
			/* istanbul ignore if */
			if (!r) throw Pd(Nd.UNEXPECTED_ERROR);
			let i = this.$options;
			if (i.i18n) {
				let r = Ns({}, i.i18n);
				if (i.__i18n && (r.__i18n = i.__i18n), r.__root = t, this === this.$root) this.$i18n = lf(e, r);
				else {
					r.__injectWithOption = !0, r.__extender = n.__vueI18nExtend, this.$i18n = sf(r);
					let e = this.$i18n;
					e.__extender && (e.__disposer = e.__extender(this.$i18n));
				}
			} else if (i.__i18n) {
				if (this === this.$root) this.$i18n = lf(e, i);
				else {
					this.$i18n = sf({
						__i18n: i.__i18n,
						__injectWithOption: !0,
						__extender: n.__vueI18nExtend,
						__root: t
					});
					let e = this.$i18n;
					e.__extender && (e.__disposer = e.__extender(this.$i18n));
				}
			} else this.$i18n = e;
			i.__i18nGlobal && qd(t, i, i), this.$t = (...e) => this.$i18n.t(...e), this.$rt = (...e) => this.$i18n.rt(...e), this.$te = (e, t) => this.$i18n.te(e, t), this.$d = (...e) => this.$i18n.d(...e), this.$n = (...e) => this.$i18n.n(...e), this.$tm = (e) => this.$i18n.tm(e), n.__setInstance(r, this.$i18n);
			let a = this.$i18n;
			Zd(r, () => {
				a.__disposer && (a.__disposer(), delete a.__disposer, delete a.__extender), n.__deleteInstance(r);
			});
		},
		mounted() {},
		unmounted() {
			let e = Yd();
			/* istanbul ignore if */
			if (!e) throw Pd(Nd.UNEXPECTED_ERROR);
			let t = this.$i18n;
			t && (delete this.$t, delete this.$rt, delete this.$te, delete this.$d, delete this.$n, delete this.$tm, t?.__disposer && (t.__disposer(), delete t.__disposer, delete t.__extender), n.__deleteInstance(e), delete this.$i18n);
		}
	};
}
function lf(e, t) {
	e.locale = t.locale || e.locale, e.fallbackLocale = t.fallbackLocale || e.fallbackLocale, e.missing = t.missing || e.missing, e.silentTranslationWarn = t.silentTranslationWarn || e.silentFallbackWarn, e.silentFallbackWarn = t.silentFallbackWarn || e.silentFallbackWarn, e.formatFallbackMessages = t.formatFallbackMessages || e.formatFallbackMessages, e.postTranslation = t.postTranslation || e.postTranslation, e.warnHtmlInMessage = t.warnHtmlInMessage || e.warnHtmlInMessage, e.escapeParameterHtml = t.escapeParameterHtml || e.escapeParameterHtml, e.sync = t.sync || e.sync, e.__composer[Rd](t.pluralizationRules || e.pluralizationRules);
	let n = Gd(e.locale, {
		messages: t.messages,
		__i18n: t.__i18n
	});
	return Object.keys(n).forEach((t) => e.mergeLocaleMessage(t, n[t])), t.datetimeFormats && Object.keys(t.datetimeFormats).forEach((n) => e.mergeDateTimeFormat(n, t.datetimeFormats[n])), t.numberFormats && Object.keys(t.numberFormats).forEach((n) => e.mergeNumberFormat(n, t.numberFormats[n])), e;
}
var uf = {
	tag: { type: [String, Object] },
	locale: { type: String },
	scope: {
		type: String,
		validator: (e) => e === "parent" || e === "global",
		default: "parent"
	},
	i18n: { type: Object }
};
function df({ slots: e }, t) {
	return t.length === 1 && t[0] === "default" ? (e.default ? e.default() : []).reduce((e, t) => [...e, ...t.type === B ? t.children : [t]], []) : t.reduce((t, n) => {
		let r = e[n];
		return r && (t[n] = r()), t;
	}, Fs());
}
function ff() {
	return B;
}
var pf = /* @__PURE__ */ R({
	name: "i18n-t",
	props: Ns({
		keypath: {
			type: String,
			required: !0
		},
		plural: {
			type: [Number, String],
			validator: (e) => ks(e) || !isNaN(e)
		}
	}, uf),
	setup(e, t) {
		let { slots: n, attrs: r } = t, i = e.i18n || Z({
			useScope: e.scope,
			__useComponent: !0
		});
		return () => {
			let a = () => {
				let r = Object.keys(n).filter((e) => e[0] !== "_"), a = Fs();
				e.locale && (a.locale = e.locale), e.plural !== void 0 && (a.plural = X(e.plural) ? +e.plural : e.plural);
				let o = df(t, r);
				return i[Fd](e.keypath, o, a);
			}, o = Ns(Fs(), r), s = X(e.tag) || Gs(e.tag) ? e.tag : ff();
			return Gs(s) ? co(s, o, { default: a }) : co(s, o, a());
		};
	}
});
function mf(e) {
	return Hs(e) && !X(e[0]);
}
function hf(e, t, n, r) {
	let { slots: i, attrs: a } = t;
	return () => {
		let t = () => {
			let t = { part: !0 }, a = Fs();
			e.locale && (t.locale = e.locale), X(e.format) ? t.key = e.format : Gs(e.format) && (X(e.format.key) && (t.key = e.format.key), a = Object.keys(e.format).reduce((t, r) => n.includes(r) ? Ns(Fs(), t, { [r]: e.format[r] }) : t, Fs()));
			let o = r(e.value, t, a), s = [t.key];
			return Hs(o) ? s = o.map((e, t) => {
				let n = i[e.type], r = n ? n({
					[e.type]: e.value,
					index: t,
					parts: o
				}) : [e.value];
				return mf(r) && (r[0].key = `${e.type}-${t}`), r;
			}) : X(o) && (s = [o]), s;
		}, o = Ns(Fs(), a), s = X(e.tag) || Gs(e.tag) ? e.tag : ff();
		return Gs(s) ? co(s, o, { default: t }) : co(s, o, t());
	};
}
var gf = /* @__PURE__ */ R({
	name: "i18n-n",
	props: Ns({
		value: {
			type: Number,
			required: !0
		},
		format: { type: [String, Object] }
	}, uf),
	setup(e, t) {
		let n = e.i18n || Z({
			useScope: e.scope,
			__useComponent: !0
		});
		return hf(e, t, sd, (...e) => n[Ld](...e));
	}
});
function _f(e, t) {
	let n = e;
	if (e.mode === "composition") return n.__getInstance(t) || e.global;
	{
		let r = n.__getInstance(t);
		return r == null ? e.global.__composer : r.__composer;
	}
}
function vf(e) {
	let t = (t) => {
		let { instance: n, value: r } = t;
		/* istanbul ignore if */
		if (!n || !n.$) throw Pd(Nd.UNEXPECTED_ERROR);
		let i = _f(e, n.$), a = yf(r);
		return [Reflect.apply(i.t, i, [...bf(a)]), i];
	};
	return {
		created: (e, n) => {
			let [r, i] = t(n);
			if (Ts) {
				let t = Xd(n.instance.$);
				t.active && (e.__i18nWatcher = t.run(() => L(i.locale, () => {
					n.instance && n.instance.$forceUpdate();
				})));
			}
			e.__composer = i, e.textContent = r;
		},
		unmounted: (e) => {
			Ts && e.__i18nWatcher && (e.__i18nWatcher(), e.__i18nWatcher = void 0, delete e.__i18nWatcher), e.__composer && (e.__composer = void 0, delete e.__composer);
		},
		beforeUpdate: (e, { value: t }) => {
			if (e.__composer) {
				let n = e.__composer, r = yf(t);
				e.textContent = Reflect.apply(n.t, n, [...bf(r)]);
			}
		},
		getSSRProps: (e) => {
			let [n] = t(e);
			return { textContent: n };
		}
	};
}
function yf(e) {
	if (X(e)) return { path: e };
	if (Ys(e)) {
		if (!("path" in e)) throw Pd(Nd.REQUIRED_VALUE, "path");
		return e;
	}
	throw Pd(Nd.INVALID_VALUE);
}
function bf(e) {
	let { path: t, locale: n, args: r, choice: i, plural: a } = e, o = {}, s = r || {};
	return X(n) && (o.locale = n), ks(i) && (o.plural = i), ks(a) && (o.plural = a), [
		t,
		s,
		o
	];
}
function xf(e, t, ...n) {
	let r = Ys(n[0]) ? n[0] : {};
	(!Ws(r.globalInstall) || r.globalInstall) && ([pf.name, "I18nT"].forEach((t) => e.component(t, pf)), [gf.name, "I18nN"].forEach((t) => e.component(t, gf)), [Pf.name, "I18nD"].forEach((t) => e.component(t, Pf))), e.directive("t", vf(t));
}
var Sf = /* #__PURE__*/ Es("global-vue-i18n");
function Cf(e = {}) {
	let t = __VUE_I18N_LEGACY_API__ && Ws(e.legacy) ? e.legacy : __VUE_I18N_LEGACY_API__, n = !Ws(e.globalInjection) || e.globalInjection, r = /* @__PURE__ */ new Map(), [i, a] = wf(e, t), o = /* #__PURE__*/ Es("");
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
			if (e.__VUE_I18N_SYMBOL__ = o, e.provide(e.__VUE_I18N_SYMBOL__, u), Ys(r[0])) {
				let e = r[0];
				u.__composerExtend = e.__composerExtend, u.__vueI18nExtend = e.__vueI18nExtend;
			}
			let i = null;
			!t && n && (i = Nf(e, u.global)), __VUE_I18N_FULL_INSTALL__ && xf(e, u, ...r), __VUE_I18N_LEGACY_API__ && t && e.mixin(cf(a, a.__composer, u));
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
function Z(e = {}) {
	let t = Yd();
	if (t == null) throw Pd(Nd.MUST_BE_CALL_SETUP_TOP);
	if (!t.isCE && t.appContext.app != null && !t.appContext.app.__VUE_I18N_SYMBOL__) throw Pd(Nd.NOT_INSTALLED);
	let n = Tf(t), r = Df(n), i = Kd(t), a = Ef(e, i);
	if (a === "global") return qd(r, e, i), r;
	if (a === "parent") {
		let i = Of(n, t, e.__useComponent);
		return i ??= r, i;
	}
	if (a === "isolated") {
		if (n.mode !== "composition") throw Pd(Nd.NOT_AVAILABLE_COMPOSITION_IN_LEGACY);
		let i = n, a = Ns({}, e);
		a.__root = Of(n, t) || r;
		let o = nf(a);
		return i.__composerExtend && (o[Bd] = i.__composerExtend(o)), ke() && Ae(() => {
			let e = o[Bd];
			e && (e(), delete o[Bd]);
		}), o;
	}
	let o = n, s = o.__getInstance(t);
	if (s == null) {
		let n = Ns({}, e);
		"__i18n" in i && (n.__i18n = i.__i18n), r && (n.__root = r), s = nf(n), o.__composerExtend && (s[Bd] = o.__composerExtend(s)), o.__setInstance(t, s), Af(o, t, s);
	}
	return s;
}
function wf(e, t) {
	let n = Oe(), r = __VUE_I18N_LEGACY_API__ && t ? n.run(() => sf(e)) : n.run(() => nf(e));
	if (r == null) throw Pd(Nd.UNEXPECTED_ERROR);
	return [n, r];
}
function Tf(e) {
	let t = Zn(e.isCE ? Sf : e.appContext.app.__VUE_I18N_SYMBOL__);
	/* istanbul ignore if */
	if (!t) throw Pd(e.isCE ? Nd.NOT_INSTALLED_WITH_PROVIDE : Nd.UNEXPECTED_ERROR);
	return t;
}
function Ef(e, t) {
	return Ms(e) ? "__i18n" in t ? "local" : "global" : e.useScope ? e.useScope : "local";
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
			e != null && (r = e.__composer, n && r && !r[zd] && (r = null));
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
	Br(() => {}, t), Zd(t, () => {
		let r = n;
		e.__deleteInstance(t);
		let i = r[Bd];
		i && (i(), delete r[Bd]);
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
		if (!r) throw Pd(Nd.UNEXPECTED_ERROR);
		let i = /* @__PURE__ */ nn(r.value) ? {
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
		if (!r || !r.value) throw Pd(Nd.UNEXPECTED_ERROR);
		Object.defineProperty(e.config.globalProperties, `$${n}`, r);
	}), () => {
		delete e.config.globalProperties.$i18n, Mf.forEach((t) => {
			delete e.config.globalProperties[`$${t}`];
		});
	};
}
var Pf = /* @__PURE__ */ R({
	name: "i18n-d",
	props: Ns({
		value: {
			type: [Number, Date],
			required: !0
		},
		format: { type: [String, Object] }
	}, uf),
	setup(e, t) {
		let n = e.i18n || Z({
			useScope: e.scope,
			__useComponent: !0
		});
		return hf(e, t, rd, (...e) => n[Id](...e));
	}
});
if (Md(), Nu(tu), Fu(Eu), Lu(pu), __INTLIFY_PROD_DEVTOOLS__) {
	let e = Ls();
	e.__INTLIFY__ = !0, ru(e.__INTLIFY_DEVTOOLS_GLOBAL_HOOK__);
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
	let u = setTimeout(() => {
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
		let n = Zn(r, t);
		if (n || n === null) return n;
		throw Error(`Injection \`${r.toString()}\` not found. Component must be used within ${Array.isArray(e) ? `one of the following components: ${e.join(", ")}` : `\`${e}\``}`);
	}, (e) => (Xn(r, e), e)];
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
	return ke() ? (Ae(e, t), !0) : !1;
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
	let t = !1, n, r = Oe(!0);
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
	return e || Ka();
}
function op(e) {
	if (!Qf) return e;
	let t = 0, n, r, i = () => {
		--t, r && t <= 0 && (r.stop(), n = void 0, r = void 0);
	};
	return ((...a) => (t += 1, r || (r = Oe(!0), n = r.run(() => e(...a))), Yf(i), n));
}
function sp(e) {
	return /* @__PURE__ */ Ut(/* @__PURE__ */ nn(e) ? new Proxy({}, {
		get(t, n, r) {
			return F(Reflect.get(e.value, n, r));
		},
		set(t, n, r) {
			return /* @__PURE__ */ nn(e.value[n]) && !/* @__PURE__ */ nn(r) ? e.value[n].value = r : e.value[n] = r, !0;
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
	return sp(Y(e));
}
function lp(e, ...t) {
	let n = t.flat(), r = n[0];
	return cp(() => Object.fromEntries(typeof r == "function" ? Object.entries(/* @__PURE__ */ fn(e)).filter(([e, t]) => !r(sn(t), e)) : Object.entries(/* @__PURE__ */ fn(e)).filter((e) => !n.includes(e[0]))));
}
function up(e, t = 1e4) {
	return dn((n, r) => {
		let i = sn(e), a, o = () => setTimeout(() => {
			i = sn(e), r();
		}, sn(t));
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
	ap(t) && Ur(e, t);
}
function fp(e, t, n) {
	return L(e, t, {
		...n,
		immediate: !0
	});
}
// node_modules/.pnpm/@vueuse+core@14.4.0_vue@3.5.42_typescript@6.0.3_/node_modules/@vueuse/core/dist/index.js
var pp = Qf ? window : void 0;
Qf && window.document, Qf && window.navigator, Qf && window.location;
function mp(e) {
	let t = sn(e);
	return t?.$el ?? t;
}
function hp(...e) {
	let t = (e, t, n, r) => (e.addEventListener(t, n, r), () => e.removeEventListener(t, n, r)), n = Y(() => {
		let t = ip(sn(e[0])).filter((e) => e != null);
		return t.every((e) => typeof e != "string") ? t : void 0;
	});
	return fp(() => [
		n.value?.map((e) => mp(e)) ?? [pp].filter((e) => e != null),
		ip(sn(n.value ? e[1] : e[0])),
		ip(F(n.value ? e[2] : e[1])),
		sn(n.value ? e[3] : e[2])
	], ([e, n, r, i], a, o) => {
		if (!e?.length || !n?.length || !r?.length) return;
		let s = tp(i) ? { ...i } : i, c = e.flatMap((e) => n.flatMap((n) => r.map((r) => t(e, n, r, s))));
		o(() => {
			c.forEach((e) => e());
		});
	}, { flush: "post" });
}
function gp() {
	let e = /* @__PURE__ */ P(!1), t = Ka();
	return t && Br(() => {
		e.value = !0;
	}, t), e;
}
/* @__NO_SIDE_EFFECTS__ */
function _p(e) {
	let t = gp();
	return Y(() => (t.value, !!e()));
}
function vp(e) {
	return typeof e == "function" ? e : typeof e == "string" ? (t) => t.key === e : Array.isArray(e) ? (t) => e.includes(t.key) : () => !0;
}
function yp(...e) {
	let t, n, r = {};
	e.length === 3 ? (t = e[0], n = e[1], r = e[2]) : e.length === 2 ? typeof e[1] == "object" ? (t = !0, n = e[0], r = e[1]) : (t = e[0], n = e[1]) : (t = !0, n = e[0]);
	let { target: i = pp, eventName: a = "keydown", passive: o = !1, dedupe: s = !1 } = r, c = vp(t);
	return hp(i, a, (e) => {
		e.repeat && sn(s) || c(e) && n(e);
	}, o);
}
function bp(e) {
	return JSON.parse(JSON.stringify(e));
}
function xp(e, t, n = {}) {
	let { window: r = pp, ...i } = n, a, o = /* @__PURE__ */ _p(() => r && "ResizeObserver" in r), s = () => {
		a &&= (a.disconnect(), void 0);
	}, c = L(Y(() => {
		let t = sn(e);
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
	let { clone: o = !1, passive: s = !1, eventName: c, deep: l = !1, defaultValue: u, shouldEmit: d } = r, f = Ka(), p = n || f?.emit || (f == null || (i = f.$emit) == null ? void 0 : i.bind(f)) || (f == null || (a = f.proxy) == null || (a = a.$emit) == null ? void 0 : a.bind(f?.proxy)), m = c;
	t ||= "modelValue", m ||= `update:${t.toString()}`;
	let h = (e) => o ? typeof o == "function" ? o(e) : bp(e) : e, g = () => $f(e[t]) ? h(e[t]) : u, _ = (e) => {
		d ? d(e) && p(m, e) : p(m, e);
	};
	if (s) {
		let n = /* @__PURE__ */ N(g()), r = !1;
		return L(() => e[t], (e) => {
			r || (r = !0, n.value = h(e), In(() => r = !1));
		}), L(n, (n) => {
			!r && (n !== e[t] || l) && _(n);
		}, { deep: l }), n;
	}
	return Y({
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
	return e ? e.flatMap((e) => e.type === B ? Cp(e.children) : [e]) : [];
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
	let e = /* @__PURE__ */ N(/* @__PURE__ */ new Map()), t = /* @__PURE__ */ N(), n = Y(() => {
		for (let t of e.value.values()) if (t) return !0;
		return !1;
	}), r = wp({ scrollBody: /* @__PURE__ */ N(!0) }), i = null, a = () => {
		document.body.style.paddingRight = "", document.body.style.marginRight = "", Op(document, Np), document.documentElement.style.removeProperty("--scrollbar-width"), document.body.style.overflow = t.value ?? "", np && i?.(), t.value = void 0;
	};
	return L(n, (e, o) => {
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
		s > 0 && (document.body.style.paddingRight = typeof l.padding == "number" ? `${l.padding}px` : String(l.padding), document.body.style.marginRight = typeof l.margin == "number" ? `${l.margin}px` : String(l.margin), document.documentElement.style.setProperty("--scrollbar-width", `${s}px`), document.body.style.overflow = "hidden"), np && (i = hp(document, "touchmove", (e) => Lp(e), { passive: !1 })), In(() => {
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
	let r = Y({
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
	let t = /* @__PURE__ */ N(!1), n = /* @__PURE__ */ N(!0), r = /* @__PURE__ */ N(!1), i = Y(() => t.value && n.value);
	function a() {
		t.value = !0, n.value = !0, r.value = !1;
	}
	function o(e) {
		e.data && (Rp.test(e.data) ? (n.value = !0, r.value = !0) : Bp() && !r.value && (n.value = !1));
	}
	function s(n) {
		In(() => {
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
	let t = wp({ dir: /* @__PURE__ */ N("ltr") });
	return Y(() => e?.value || t.dir?.value || "ltr");
}
// node_modules/.pnpm/reka-ui@2.11.0_vue@3.5.42_typescript@6.0.3_/node_modules/reka-ui/dist/shared/useEmitAsProps.js
function Up(e) {
	let t = Ka(), n = t?.type.emits, r = {};
	return n?.length || console.warn(`No emitted event found. Please check component: ${t?.type.__name}`), n?.forEach((t) => {
		r[re(A(t))] = (...n) => e(t, ...n);
	}), r;
}
// node_modules/.pnpm/reka-ui@2.11.0_vue@3.5.42_typescript@6.0.3_/node_modules/reka-ui/dist/shared/useFilter.js
function Wp(e) {
	let t = Y(() => F(e)), n = Y(() => new Intl.Collator("en", {
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
	er((e) => {
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
	return Y(() => !sn(e) || !!mp(e)?.closest("form"));
}
// node_modules/.pnpm/reka-ui@2.11.0_vue@3.5.42_typescript@6.0.3_/node_modules/reka-ui/dist/shared/useForwardExpose.js
function Yp() {
	let e = Ka(), t = /* @__PURE__ */ N(), n = Y(() => r());
	Hr(() => {
		n.value !== r() && on(t);
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
	let t = Ka(), n = Object.keys(t?.type.props ?? {}).reduce((e, n) => {
		let r = (t?.type.props[n]).default;
		return r !== void 0 && (e[n] = r), e;
	}, {}), r = /* @__PURE__ */ hn(e);
	return Y(() => {
		let e = {}, i = t?.vnode.props ?? {};
		return Object.keys(i).forEach((t) => {
			e[A(t)] = i[t];
		}), Object.keys({
			...n,
			...e
		}).reduce((e, t) => (r.value[t] !== void 0 && (e[t] = r.value[t]), e), {});
	});
}
// node_modules/.pnpm/reka-ui@2.11.0_vue@3.5.42_typescript@6.0.3_/node_modules/reka-ui/dist/shared/useForwardPropsEmits.js
function Zp(e, t) {
	let n = Xp(e), r = t ? Up(t) : {};
	return Y(() => ({
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
	L(() => mp(e), (e) => {
		let n = !1;
		try {
			n = !!e?.closest("[popover]:not(:popover-open)");
		} catch {}
		e && !n ? t = om(e) : t && t();
	}), Wr(() => {
		t && t();
	});
}
function cm(e, t = "reka") {
	if (e) return e;
	let n, r = wp({ useId: void 0 });
	return n = r.useId ? r.useId() : wr?.(), t ? `${t}-${n}` : n;
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
	let t = /* @__PURE__ */ N(), n = Y(() => t.value?.width ?? 0), r = Y(() => t.value?.height ?? 0), i;
	return Br(() => {
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
	}), Wr(() => {
		i?.disconnect(), i = void 0;
	}), {
		width: n,
		height: r
	};
}
// node_modules/.pnpm/reka-ui@2.11.0_vue@3.5.42_typescript@6.0.3_/node_modules/reka-ui/dist/shared/useStateMachine.js
function dm(e, t) {
	let n = /* @__PURE__ */ N(e);
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
	let n = /* @__PURE__ */ N({}), r = /* @__PURE__ */ N("none"), i = /* @__PURE__ */ N(e), a = e.value ? "mounted" : "unmounted", o, s = t.value?.ownerDocument.defaultView ?? pp, { state: c, dispatch: l } = dm(a, {
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
	L(e, async (e, i) => {
		let a = i !== e;
		if (await In(), a) {
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
	}, p = L(t, (e, t) => {
		e ? (n.value = getComputedStyle(e), e.addEventListener("animationstart", f), e.addEventListener("animationcancel", d), e.addEventListener("animationend", d)) : (l("ANIMATION_END"), o !== void 0 && s?.clearTimeout(o), t?.removeEventListener("animationstart", f), t?.removeEventListener("animationcancel", d), t?.removeEventListener("animationend", d));
	}, { immediate: !0 }), m = L(c, () => {
		let e = gm(t.value);
		r.value = c.value === "mounted" ? e : "none";
	});
	return Wr(() => {
		p(), m(), t.value && (t.value.removeEventListener("animationstart", f), t.value.removeEventListener("animationcancel", d), t.value.removeEventListener("animationend", d)), o !== void 0 && s?.clearTimeout(o);
	}), { isPresent: Y(() => ["mounted", "unmountSuspended"].includes(c.value)) };
}
function gm(e) {
	return e && getComputedStyle(e).animationName || "none";
}
// node_modules/.pnpm/reka-ui@2.11.0_vue@3.5.42_typescript@6.0.3_/node_modules/reka-ui/dist/Presence/Presence.js
var _m = /*#__PURE__*/ R({
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
		let { present: r, forceMount: i } = /* @__PURE__ */ fn(e), a = /* @__PURE__ */ N(), { isPresent: o } = hm(r, a);
		n({ present: o });
		let s = t.default({ present: o.value });
		s = Cp(s || []);
		let c = Ka();
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
		return () => i.value || r.value || o.value ? co(t.default({ present: o.value })[0], { ref: (e) => {
			let t = mp(e);
			return t?.hasAttribute === void 0 || (t?.hasAttribute("data-reka-popper-content-wrapper") ? a.value = t.firstElementChild : a.value = t), t;
		} }) : null;
	}
}), vm = /*#__PURE__*/ R({
	name: "PrimitiveSlot",
	inheritAttrs: !1,
	setup(e, { attrs: t, slots: n }) {
		return () => {
			if (!n.default) return null;
			let e = Cp(n.default()), r = e.findIndex((e) => e.type !== Ca);
			if (r === -1) return e;
			let i = e[r];
			delete i.props?.ref;
			let a = i.props ? J(t, i.props) : t, o = La({
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
], bm = /*#__PURE__*/ R({
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
		return typeof r == "string" && ym.includes(r) ? () => co(r, t) : r === "template" ? () => co(vm, t, { default: n.default }) : () => co(e.as, t, { default: n.default });
	}
});
// node_modules/.pnpm/reka-ui@2.11.0_vue@3.5.42_typescript@6.0.3_/node_modules/reka-ui/dist/Primitive/usePrimitiveElement.js
function xm() {
	let e = /* @__PURE__ */ N();
	return {
		primitiveElement: e,
		currentElement: Y(() => ["#text", "#comment"].includes(e.value?.$el.nodeName) ? e.value?.$el.nextElementSibling : mp(e))
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
	let r = /* @__PURE__ */ N(!1), i = /* @__PURE__ */ N(() => {});
	return er((a) => {
		if (!Qf || !sn(n)) return;
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
		sn(n) && (r.value = !0);
	} };
}
function Dm(e, t, n = !0) {
	let r = /* @__PURE__ */ N(!1);
	return er((i) => {
		if (!Qf || !sn(n)) return;
		let a = t?.value?.ownerDocument ?? globalThis.document, o = async (n) => {
			if (!t?.value) return;
			await In(), await In();
			let i = n.target;
			t.value && i && !Tm(t.value, i) && n.target && !r.value && qf(Cm, e, { originalEvent: n });
		};
		a.addEventListener("focusin", o), i(() => a.removeEventListener("focusin", o));
	}), {
		onFocusCapture: () => {
			sn(n) && (r.value = !0);
		},
		onBlurCapture: () => {
			sn(n) && (r.value = !1);
		}
	};
}
// node_modules/.pnpm/reka-ui@2.11.0_vue@3.5.42_typescript@6.0.3_/node_modules/reka-ui/dist/DismissableLayer/context.js
var Om = /*#__PURE__*/ Ut({
	layersRoot: /* @__PURE__ */ new Set(),
	layersWithOutsidePointerEventsDisabled: /* @__PURE__ */ new Set(),
	branches: /* @__PURE__ */ new Set()
}), km = /* @__PURE__ */ R({
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
		let n = e, r = t, { forwardRef: i, currentElement: a } = Yp(), o = Y(() => a.value?.ownerDocument ?? globalThis.document), s = Y(() => Om.layersRoot), c = Y(() => a.value ? Array.from(s.value).indexOf(a.value) : -1), l = Y(() => Om.layersWithOutsidePointerEventsDisabled.size > 0), u = Y(() => {
			let e = Array.from(s.value), [t] = [...Om.layersWithOutsidePointerEventsDisabled].slice(-1), n = e.indexOf(t);
			return c.value >= n;
		}), d = Em(async (e) => {
			let t = [...Om.branches].some((t) => t?.contains(e.target));
			n.present && u.value && !t && (r("pointerDownOutside", e), r("interactOutside", e), await In(), e.defaultPrevented || r("dismiss"));
		}, a, () => n.present), f = Dm((e) => {
			let t = [...Om.branches].some((t) => t?.contains(e.target));
			n.present && !t && (r("focusOutside", e), r("interactOutside", e), e.defaultPrevented || r("dismiss"));
		}, a);
		return yp("Escape", (e) => {
			n.present && c.value === s.value.size - 1 && (r("escapeKeyDown", e), e.defaultPrevented || r("dismiss"));
		}, { target: () => o.value?.defaultView ?? globalThis.window }), L([
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
		}, { immediate: !0 }), L([a, () => n.present], ([e, t], n, r) => {
			e && t && (s.value.add(e), r(() => {
				s.value.delete(e);
			}));
		}, { immediate: !0 }), er((e) => {
			e(() => {
				a.value && (s.value.delete(a.value), Om.layersWithOutsidePointerEventsDisabled.delete(a.value));
			});
		}), (t, n) => (V(), U(F(bm), {
			ref: F(i),
			"as-child": e.asChild,
			as: e.as,
			"data-dismissable-layer": "",
			style: ue({ pointerEvents: l.value ? u.value ? "auto" : "none" : void 0 }),
			onFocusCapture: F(f).onFocusCapture,
			onBlurCapture: F(f).onBlurCapture,
			onPointerdownCapture: F(d).onPointerDownCapture
		}, {
			default: I(() => [z(t.$slots, "default")]),
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
}), Am = Zf(() => /* @__PURE__ */ N([]));
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
var Wm = /* @__PURE__ */ R({
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
		let n = e, r = t, { currentRef: i, currentElement: a } = Yp(), o = /* @__PURE__ */ N(null), s = jm(), c = /*#__PURE__*/ Ut({
			paused: !1,
			pause() {
				this.paused = !0;
			},
			resume() {
				this.paused = !1;
			}
		});
		er((e) => {
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
		er(async (e) => {
			let t = a.value;
			if (await In(), !t) return;
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
		}), L(() => n.present, async (e, t) => {
			if (!Qf) return;
			if (e === !1 && t === !0) {
				s.remove(c);
				return;
			}
			if (e !== !0 || t !== !1) return;
			s.add(c), await In();
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
		return (t, n) => (V(), U(F(bm), {
			ref_key: "currentRef",
			ref: i,
			tabindex: "-1",
			"as-child": e.asChild,
			as: e.as,
			onKeydown: u
		}, {
			default: I(() => [z(t.$slots, "default")]),
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
var Ym = /* @__PURE__ */ R({
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
		let t = e, n = wp({}), r = Y(() => t.to ?? n.teleportTo?.value ?? "body"), i = gp();
		return (t, n) => F(i) || e.forceMount ? (V(), U(_r, {
			key: 0,
			to: r.value,
			disabled: e.disabled,
			defer: e.defer
		}, [z(t.$slots, "default")], 8, [
			"to",
			"disabled",
			"defer"
		])) : q("v-if", !0);
	}
}), Xm = "data-reka-collection-item";
function Zm(e = {}) {
	let { key: t = "", isProvider: n = !1 } = e, r = `${t}CollectionProvider`, i;
	n ? (i = {
		collectionRef: /* @__PURE__ */ N(),
		itemMap: /* @__PURE__ */ N(/* @__PURE__ */ new Map())
	}, Xn(r, i)) : i = Zn(r);
	let a = (e, t = !1) => {
		if (!i.collectionRef.value) return;
		let n = i.itemMap.value.get(e);
		return n && (t || n.ref.dataset.disabled !== "") ? n : void 0;
	}, o = (e = !1) => {
		let t = i.collectionRef.value;
		if (!t) return [];
		let n = Array.from(t.querySelectorAll(`[${Xm}]`)), r = new Map(n.map((e, t) => [e, t])), a = Array.from(i.itemMap.value.values()).sort((e, t) => (r.get(e.ref) ?? -1) - (r.get(t.ref) ?? -1));
		return e ? a : a.filter((e) => e.ref.dataset.disabled !== "");
	}, s = /*#__PURE__*/ R({
		name: "CollectionSlot",
		inheritAttrs: !1,
		setup(e, { slots: t, attrs: n }) {
			let { primitiveElement: r, currentElement: a } = xm();
			return L(a, () => {
				i.collectionRef.value = a.value;
			}), () => co(vm, {
				ref: r,
				...n
			}, t);
		}
	}), c = /*#__PURE__*/ R({
		name: "CollectionItem",
		inheritAttrs: !1,
		props: { value: { validator: () => !0 } },
		setup(e, { slots: t, attrs: n }) {
			let { primitiveElement: r, currentElement: a } = xm();
			return er((t) => {
				if (a.value) {
					let n = $t(a.value);
					i.itemMap.value.set(n, {
						ref: a.value,
						value: e.value
					}), t(() => i.itemMap.value.delete(n));
				}
			}), () => co(vm, {
				...n,
				[Xm]: "",
				ref: r
			}, t);
		}
	});
	return {
		getItems: o,
		getItem: a,
		reactiveItems: Y(() => Array.from(i.itemMap.value.values())),
		itemMapSize: Y(() => i.itemMap.value.size),
		CollectionSlot: s,
		CollectionItem: c
	};
}
// node_modules/.pnpm/reka-ui@2.11.0_vue@3.5.42_typescript@6.0.3_/node_modules/reka-ui/dist/VisuallyHidden/VisuallyHidden.js
var Qm = /* @__PURE__ */ R({
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
		return (t, n) => (V(), U(F(bm), {
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
			default: I(() => [z(t.$slots, "default")]),
			_: 3
		}, 8, [
			"as",
			"as-child",
			"aria-hidden",
			"data-hidden",
			"tabindex"
		]));
	}
}), $m = /* @__PURE__ */ R({
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
		return L(Y(() => t.checked ?? t.value), (e, t) => {
			if (!r.value) return;
			let n = r.value, i = window.HTMLInputElement.prototype, a = Object.getOwnPropertyDescriptor(i, "value").set;
			if (a && e !== t) {
				let t = new Event("input", { bubbles: !0 }), r = new Event("change", { bubbles: !0 });
				a.call(n, e), n.dispatchEvent(t), n.dispatchEvent(r);
			}
		}), (e, r) => (V(), U(Qm, J({
			ref_key: "primitiveElement",
			ref: n
		}, {
			...t,
			...e.$attrs
		}, { as: "input" }), null, 16));
	}
}), eh = /* @__PURE__ */ R({
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
		let t = e, n = Y(() => typeof t.value == "object" && Array.isArray(t.value) && t.value.length === 0 && t.required), r = Y(() => typeof t.value == "string" || typeof t.value == "number" || typeof t.value == "boolean" || t.value === null || t.value === void 0 ? [{
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
		return (i, a) => (V(), H(B, null, [q(" We render single input if it's required "), n.value ? (V(), U($m, J({ key: e.name }, {
			...t,
			...i.$attrs
		}, {
			name: e.name,
			value: e.value
		}), null, 16, ["name", "value"])) : (V(!0), H(B, { key: 1 }, ei(r.value, (e) => (V(), U($m, J({ key: e.name }, { ref_for: !0 }, {
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
var [oh, sh] = /*#__PURE__*/ Gf("ListboxRoot"), [ch, lh] = /*#__PURE__*/ Gf("ListboxHighlightScroll"), uh = /* @__PURE__ */ R({
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
		let r = e, i = n, { multiple: a, highlightOnHover: o, loop: s, orientation: c, disabled: l, selectionBehavior: u, dir: d } = /* @__PURE__ */ fn(r), { getItems: f, getItem: p } = Zm({ isProvider: !0 }), { handleTypeaheadSearch: m } = fm(), { primitiveElement: h, currentElement: g } = xm(), _ = lm(), v = Hp(d), y = ch(null);
		lh({
			suppressHighlightScroll: /* @__PURE__ */ N(!1),
			onHighlightScrollRequest: () => {}
		});
		let b = Jp(g), x = /* @__PURE__ */ N(), S = /* @__PURE__ */ N(!1), C = /* @__PURE__ */ N(!0), w = Sp(r, "modelValue", i, {
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
		let E = /* @__PURE__ */ N(null), D = /* @__PURE__ */ N(null), O = /* @__PURE__ */ N(!1), k = /* @__PURE__ */ N(!1), ee = Xf(), A = Xf(), j = Xf();
		function te() {
			return f().map((e) => e.ref).filter((e) => e.dataset.disabled !== "");
		}
		function ne(e, t = !0, n) {
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
		function re(e) {
			if (O.value) j.trigger(e);
			else {
				let t = f().find((t) => nh(t.value, e, r.by));
				t && (E.value = t.ref, ne(t.ref));
			}
		}
		function ie(e) {
			if (E.value && E.value.isConnected) {
				if (e.ctrlKey || e.metaKey || e.altKey) return;
				e.preventDefault(), e.stopPropagation(), k.value || E.value.click();
			}
		}
		function ae(e) {
			if (C.value) {
				if (S.value = !0, O.value) A.trigger(e);
				else {
					let t = e.altKey || e.ctrlKey || e.metaKey;
					if (t && e.key === "a" && a.value) {
						let t = f(), n = t.map((e) => e.value);
						w.value = [...n], e.preventDefault();
						let r = t.at(-1);
						r && ne(r.ref);
					} else if (!t) {
						let t = m(e.key, f());
						t && ne(t);
					}
				}
				setTimeout(() => {
					S.value = !1;
				}, 1);
			}
		}
		function oe() {
			k.value = !0;
		}
		function se() {
			In(() => {
				k.value = !1;
			});
		}
		function ce() {
			In(() => {
				fe(new KeyboardEvent("keydown", { key: "PageUp" }));
			});
		}
		function le(e) {
			let t = E.value;
			t?.isConnected && (D.value = t), E.value = null, i("leave", e);
		}
		function ue(e) {
			let t = new CustomEvent("listbox.entryFocus", {
				bubbles: !1,
				cancelable: !0
			});
			if (e.currentTarget?.dispatchEvent(t), i("entryFocus", t), !t.defaultPrevented) {
				if (D.value) ne(D.value);
				else {
					let e = te()?.[0];
					ne(e);
				}
			}
		}
		function de(e) {
			let t = f(!0).map((e) => e.ref), n = e === "next" ? t.at(-1) : t[0];
			if (!n) return !1;
			let r = Number(n.getAttribute("aria-posinset")), i = Number(n.getAttribute("aria-setsize"));
			return e === "next" ? r === i : r === 1;
		}
		function fe(e) {
			let t = ah(e, c.value, v.value);
			if (!t) return;
			let n = te();
			if (E.value) {
				if (t === "last") n.reverse();
				else if (t === "prev" || t === "next") {
					t === "prev" && n.reverse();
					let r = n.indexOf(E.value), i = s.value && r === n.length - 1;
					if (i && O.value) {
						if (de(t)) {
							let n = t === "next" ? _.HOME : _.END;
							return A.trigger(new KeyboardEvent("keydown", {
								key: n,
								shiftKey: e.shiftKey
							}));
						}
						n = [];
					} else n = i ? n.slice(0, 1) : n.slice(r + 1);
				}
				pe(e, n[0]);
			}
			if (n.length) {
				let e = !E.value && t === "prev" ? n.length - 1 : 0;
				ne(n[e]);
			}
			if (O.value) return A.trigger(e);
		}
		function pe(e, t) {
			if (!O.value && r.selectionBehavior === "replace" && a.value && Array.isArray(w.value) && (!e.altKey && !e.ctrlKey && !e.metaKey || e.shiftKey) && e.shiftKey) {
				let n = f().filter((e) => e.ref.dataset.disabled !== ""), r = n.find((e) => e.ref === t)?.value;
				if (e.key === _.END ? r = n.at(-1)?.value : e.key === _.HOME && (r = n[0]?.value), !r || !x.value) return;
				let i = Uf(n.map((e) => e.value), x.value, r);
				w.value = i;
			}
		}
		async function me(e, t = !0) {
			if (Qf) {
				if (await In(), O.value) ee.trigger({
					event: e,
					scroll: t
				});
				else {
					let e = te(), n = e.find((e) => e.dataset.state === "checked"), r = t ? void 0 : !1;
					n ? ne(n, t, r) : e.length && ne(e[0], t, r);
				}
			}
		}
		let he = !1;
		return L(w, () => {
			if (!S.value) {
				let e = he;
				he = !0, In(() => {
					me(void 0, e);
				});
			}
		}, {
			immediate: !0,
			deep: !0
		}), t({
			highlightedElement: E,
			highlightItem: re,
			highlightFirstItem: ce,
			highlightSelected: me,
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
			virtualFocusHook: ee,
			virtualKeydownHook: A,
			virtualHighlightHook: j,
			by: r.by,
			firstValue: x,
			selectionBehavior: u,
			focusable: C,
			onLeave: le,
			onEnter: ue,
			changeHighlight: ne,
			onKeydownEnter: ie,
			onKeydownNavigation: fe,
			onKeydownTypeAhead: ae,
			onCompositionStart: oe,
			onCompositionEnd: se,
			highlightFirstItem: ce
		}), (t, n) => (V(), U(F(bm), {
			ref_key: "primitiveElement",
			ref: h,
			as: e.as,
			"as-child": e.asChild,
			dir: F(v),
			"data-disabled": F(l) ? "" : void 0,
			onPointerleave: le,
			onFocusout: n[0] ||= async (e) => {
				let t = e.relatedTarget || e.target;
				await In(), E.value && F(g) && !F(g).contains(t) && le(e);
			}
		}, {
			default: I(() => [z(t.$slots, "default", { modelValue: F(w) }), F(b) && e.name ? (V(), U(F(eh), {
				key: 0,
				name: e.name,
				value: F(w),
				disabled: F(l),
				required: e.required
			}, null, 8, [
				"name",
				"value",
				"disabled",
				"required"
			])) : q("v-if", !0)]),
			_: 3
		}, 8, [
			"as",
			"as-child",
			"dir",
			"data-disabled"
		]));
	}
}), dh = /* @__PURE__ */ R({
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
		return (i, a) => (V(), U(F(t), null, {
			default: I(() => [G(F(bm), {
				role: "listbox",
				as: e.as,
				"as-child": e.asChild,
				tabindex: F(n).focusable.value ? F(n).highlightedElement.value ? "-1" : "0" : "-1",
				"aria-orientation": F(n).orientation.value,
				"aria-multiselectable": !!F(n).multiple.value,
				"data-orientation": F(n).orientation.value,
				onMousedown: a[0] ||= gs((e) => r.value = !0, ["left"]),
				onFocus: a[1] ||= (e) => {
					F(r) || F(n).onEnter(e);
				},
				onKeydown: [
					a[2] ||= vs((e) => {
						(F(n).orientation.value !== "vertical" || e.key !== "ArrowLeft" && e.key !== "ArrowRight") && (F(n).orientation.value !== "horizontal" || e.key !== "ArrowUp" && e.key !== "ArrowDown") && (e.preventDefault(), F(n).focusable.value && F(n).onKeydownNavigation(e));
					}, [
						"down",
						"up",
						"left",
						"right",
						"home",
						"end"
					]),
					vs(F(n).onKeydownEnter, ["enter"]),
					F(n).onKeydownTypeAhead
				]
			}, {
				default: I(() => [z(i.$slots, "default")]),
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
}), fh = /* @__PURE__ */ R({
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
		}), i = oh(), { primitiveElement: a, currentElement: o } = xm(), s = Y(() => n.disabled || i.disabled.value || !1), c = /* @__PURE__ */ N();
		nr(() => c.value = i.highlightedElement.value?.id), Br(() => {
			i.focusable.value = !1, setTimeout(() => {
				n.autoFocus && o.value?.focus();
			}, 1);
		}), Wr(() => {
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
		return (t, n) => (V(), U(F(bm), {
			ref_key: "primitiveElement",
			ref: a,
			as: e.as,
			"as-child": e.asChild,
			value: F(r),
			disabled: s.value ? "" : void 0,
			"data-disabled": s.value ? "" : void 0,
			"aria-disabled": s.value ?? void 0,
			"aria-activedescendant": c.value,
			type: "text",
			onKeydown: [vs(g, [
				"down",
				"up",
				"home",
				"end"
			]), vs(_, ["enter"])],
			onInput: h,
			onCompositionstart: m,
			onCompositionupdate: F(f),
			onCompositionend: F(p)
		}, {
			default: I(() => [z(t.$slots, "default", { modelValue: F(r) })]),
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
}), ph = "listbox.select", [mh, hh] = /*#__PURE__*/ Gf("ListboxItem"), gh = /* @__PURE__ */ R({
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
		let n = e, r = t, i = cm(void 0, "reka-listbox-item"), { CollectionItem: a } = Zm(), { forwardRef: o, currentElement: s } = Yp(), c = oh(), l = Y(() => s.value != null && s.value === c.highlightedElement.value), u = Y(() => th(c.modelValue.value, n.value, c.by)), d = Y(() => c.disabled.value || n.disabled);
		async function f(e) {
			r("select", e), e?.defaultPrevented || !d.value && e && (c.onValueChange(n.value), c.changeHighlight(s.value));
		}
		function p(e) {
			qf(ph, f, {
				originalEvent: e,
				value: n.value
			});
		}
		return hh({ isSelected: u }), (t, n) => (V(), U(F(a), { value: e.value }, {
			default: I(() => [lo([
				l.value,
				u.value,
				d.value,
				F(c).focusable.value,
				...Object.entries(t.$attrs).flat()
			], () => G(F(bm), J({ id: F(i) }, t.$attrs, {
				ref: F(o),
				role: "option",
				tabindex: F(c).focusable.value ? l.value ? "0" : "-1" : -1,
				"aria-selected": u.value,
				as: e.as,
				"as-child": e.asChild,
				disabled: d.value ? "" : void 0,
				"data-disabled": d.value ? "" : void 0,
				"data-highlighted": l.value ? "" : void 0,
				"data-state": u.value ? "checked" : "unchecked",
				onClick: p,
				onKeydown: vs(gs(p, ["prevent"]), ["space"]),
				onPointermove: n[0] ||= () => {
					F(c).highlightedElement.value !== F(s) && F(c).highlightOnHover.value && F(c).changeHighlight(F(s), !1, !1);
				}
			}), {
				default: I(() => [z(t.$slots, "default", { selected: u.value })]),
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
}), _h = /* @__PURE__ */ R({
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
		return (r, i) => (V(), U(F(_m), { present: e.forceMount || F(n).isSelected.value }, {
			default: I(() => [G(F(bm), {
				ref: F(t),
				"aria-hidden": "true",
				"data-state": F(n).isSelected.value ? "checked" : "unchecked",
				as: e.as,
				"as-child": e.asChild
			}, {
				default: I(() => [z(r.$slots, "default")]),
				_: 3
			}, 8, [
				"data-state",
				"as",
				"as-child"
			])]),
			_: 3
		}, 8, ["present"]));
	}
}), [vh, yh] = /*#__PURE__*/ Gf("PopperRoot"), bh = /* @__PURE__ */ R({
	inheritAttrs: !1,
	__name: "PopperRoot",
	setup(e) {
		let t = /* @__PURE__ */ N();
		return yh({
			anchor: t,
			onAnchorChange: (e) => t.value = e
		}), (e, t) => z(e.$slots, "default");
	}
}), xh = /* @__PURE__ */ R({
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
		return tr(() => {
			i.onAnchorChange(t.reference ?? r.value);
		}), (t, r) => (V(), U(F(bm), {
			ref: F(n),
			as: e.as,
			"as-child": e.asChild
		}, {
			default: I(() => [z(t.$slots, "default")]),
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
		let w = b / 2 - x / 2, T = C / 2 - h[m] / 2 - 1, E = Eh(d[_], T), D = Eh(d[v], T), O = C - h[m] - D, k = C / 2 - h[m] / 2 + w, ee = Mh(E, k, O), A = !c.arrow && Fh(i) != null && k !== ee && a.reference[m] / 2 - (k < E ? E : D) - h[m] / 2 < 0, j = A ? k < E ? k - E : k - O : 0;
		return {
			[p]: f[p] + j,
			data: {
				[p]: ee,
				centerOffset: k - ee - j,
				...A && { alignmentOffset: j }
			},
			reset: A
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
			let n = C_(sn(e.element));
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
	let r = n.whileElementsMounted, i = Y(() => sn(n.open) ?? !0), a = Y(() => sn(n.middleware)), o = Y(() => sn(n.placement) ?? "bottom"), s = Y(() => sn(n.strategy) ?? "absolute"), c = Y(() => sn(n.transform) ?? !0), l = Y(() => C_(e.value)), u = Y(() => C_(t.value)), d = /* @__PURE__ */ N(0), f = /* @__PURE__ */ N(0), p = /* @__PURE__ */ N(s.value), m = /* @__PURE__ */ N(o.value), h = /* @__PURE__ */ P({}), g = /* @__PURE__ */ N(!1), _ = Y(() => {
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
	return L([
		a,
		o,
		s,
		i
	], y, { flush: "sync" }), L([l, u], x, { flush: "sync" }), L(i, S, { flush: "sync" }), ke() && Ae(b), {
		x: /* @__PURE__ */ Kt(d),
		y: /* @__PURE__ */ Kt(f),
		strategy: /* @__PURE__ */ Kt(p),
		placement: /* @__PURE__ */ Kt(m),
		middlewareData: /* @__PURE__ */ Kt(h),
		isPositioned: /* @__PURE__ */ Kt(g),
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
}, [A_, j_] = /*#__PURE__*/ Gf("PopperContent"), M_ = /* @__PURE__ */ R({
	inheritAttrs: !1,
	__name: "PopperContent",
	props: /* @__PURE__ */ di({
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
		let n = e, r = t, i = vh(), { forwardRef: a, currentElement: o } = Yp(), s = Hp(Y(() => n.dir)), c = /* @__PURE__ */ N(), l = /* @__PURE__ */ N(), { width: u, height: d } = um(l), f = Y(() => n.side + (n.align === "center" ? "" : `-${n.align}`)), p = Y(() => typeof n.collisionPadding == "number" ? n.collisionPadding : {
			top: 0,
			right: 0,
			bottom: 0,
			left: 0,
			...n.collisionPadding
		}), m = Y(() => Array.isArray(n.collisionBoundary) ? n.collisionBoundary : [n.collisionBoundary]), h = Y(() => ({
			padding: p.value,
			boundary: m.value.filter(Sh),
			altBoundary: m.value.length > 0
		})), g = Y(() => ({
			mainAxis: n.sideFlip,
			crossAxis: n.alignFlip
		})), _ = Y(() => [
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
		]), { floatingStyles: v, placement: y, isPositioned: b, middlewareData: x, update: S } = D_(Y(() => n.reference ?? i.anchor.value), c, {
			strategy: n.positionStrategy,
			placement: f,
			whileElementsMounted: (...e) => p_(...e, {
				layoutShift: !n.disableUpdateOnLayoutShift,
				animationFrame: n.updatePositionStrategy === "always"
			}),
			middleware: _
		}), C = Y(() => wh(y.value)[0]), w = Y(() => wh(y.value)[1]);
		tr(() => {
			b.value && r("placed");
		});
		let T = Y(() => {
			let e = x.value.arrow?.centerOffset !== 0;
			return n.hideShiftedArrow && e;
		}), E = /* @__PURE__ */ N("");
		return er(() => {
			o.value && (E.value = window.getComputedStyle(o.value).zIndex);
		}), j_({
			placedSide: C,
			onArrowChange: (e) => l.value = e,
			arrowX: Y(() => x.value.arrow?.x ?? 0),
			arrowY: Y(() => x.value.arrow?.y ?? 0),
			shouldHideArrow: T
		}), (e, t) => (V(), H("div", {
			ref_key: "floatingRef",
			ref: c,
			"data-reka-popper-content-wrapper": "",
			dir: F(s),
			style: ue({
				...F(v),
				transform: F(b) ? F(v).transform : "translate(0, -200%)",
				minWidth: "max-content",
				zIndex: E.value,
				"--reka-popper-transform-origin": [F(x).transformOrigin?.x, F(x).transformOrigin?.y].join(" "),
				...F(x).hide?.referenceHidden && {
					visibility: "hidden",
					pointerEvents: "none"
				}
			})
		}, [n.memoDependencies ? lo([
			n.asChild,
			n.as,
			C.value,
			w.value,
			F(b),
			...Object.values(e.$attrs),
			...n.memoDependencies
		], () => (V(), U(F(bm), J({
			key: 0,
			ref: F(a)
		}, e.$attrs, {
			"as-child": n.asChild,
			as: n.as,
			"data-side": C.value,
			"data-align": w.value,
			style: { animation: F(b) ? void 0 : "none" }
		}), {
			default: I(() => [z(e.$slots, "default")]),
			_: 3
		}, 16, [
			"as-child",
			"as",
			"data-side",
			"data-align",
			"style"
		])), t, 0) : (V(), U(F(bm), J({
			key: 1,
			ref: F(a)
		}, e.$attrs, {
			"as-child": n.asChild,
			as: n.as,
			"data-side": C.value,
			"data-align": w.value,
			dir: F(s),
			style: { animation: F(b) ? void 0 : "none" }
		}), {
			default: I(() => [z(e.$slots, "default")]),
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
	let t = /* @__PURE__ */ N("inline"), n = /* @__PURE__ */ N(!1), r = /* @__PURE__ */ N(), i = Y(() => t.value === "popper" && !n.value), a;
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
var [P_, F_] = /*#__PURE__*/ Gf("ComboboxRoot"), I_ = /* @__PURE__ */ R({
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
		let r = e, i = n, { primitiveElement: a, currentElement: o } = xm(), { multiple: s, disabled: c, ignoreFilter: l, resetSearchTermOnSelect: u, openOnFocus: d, openOnClick: f, dir: p, resetModelValueOnClear: m, highlightOnHover: h, loop: g, unmountOnHide: _ } = /* @__PURE__ */ fn(r), v = Hp(p), y = Sp(r, "modelValue", i, {
			defaultValue: r.defaultValue ?? (s.value ? [] : void 0),
			passive: r.modelValue === void 0,
			deep: !0
		}), b = Sp(r, "open", i, {
			defaultValue: r.defaultOpen,
			passive: r.open === void 0
		});
		async function x(e) {
			b.value = e, j.value = "", e ? (await In(), a.value?.highlightSelected(), C.value = !0, T.value?.focus()) : (C.value = !1, setTimeout(() => {
				!e && r.resetSearchTermOnBlur && S.trigger();
			}, 1));
		}
		let S = Xf(), C = /* @__PURE__ */ N(!1), w = /* @__PURE__ */ N(!1), T = /* @__PURE__ */ N(), E = /* @__PURE__ */ N(), D = Y(() => a.value?.highlightedElement ?? void 0), O = N_(b), k = /* @__PURE__ */ N(/* @__PURE__ */ new Map()), ee = /* @__PURE__ */ N(/* @__PURE__ */ new Map()), { contains: A } = Wp({ sensitivity: "base" }), j = /* @__PURE__ */ N(""), te = Y((e) => {
			if (!j.value || r.ignoreFilter || w.value) return {
				count: k.value.size,
				items: e?.items ?? /* @__PURE__ */ new Map(),
				groups: e?.groups ?? new Set(ee.value.keys())
			};
			let t = 0, n = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Set();
			for (let [e, r] of k.value) {
				let i = A(r, j.value);
				n.set(e, +!!i), i && t++;
			}
			for (let [e, t] of ee.value) for (let r of t) if (n.get(r) > 0) {
				i.add(e);
				break;
			}
			return {
				count: t,
				items: n,
				groups: i
			};
		}), ne = Ka();
		return Br(() => {
			ne?.exposed && (ne.exposed.highlightItem = a.value?.highlightItem, ne.exposed.highlightFirstItem = a.value?.highlightFirstItem, ne.exposed.highlightSelected = a.value?.highlightSelected);
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
			allGroups: ee,
			filterSearch: j,
			filterState: te,
			ignoreFilter: l,
			openOnFocus: d,
			openOnClick: f,
			resetModelValueOnClear: m,
			unmountOnHide: _
		}), (t, n) => (V(), U(F(bh), null, {
			default: I(() => [G(F(uh), J({
				ref_key: "primitiveElement",
				ref: a
			}, t.$attrs, {
				modelValue: F(y),
				"onUpdate:modelValue": n[0] ||= (e) => /* @__PURE__ */ nn(y) ? y.value = e : null,
				style: { pointerEvents: F(b) ? "auto" : void 0 },
				as: e.as,
				"as-child": e.asChild,
				dir: F(v),
				multiple: F(s),
				name: e.name,
				required: e.required,
				disabled: F(c),
				"highlight-on-hover": F(h),
				loop: F(g),
				by: r.by,
				onHighlight: n[1] ||= (e) => i("highlight", e)
			}), {
				default: I(() => [z(t.$slots, "default", {
					open: F(b),
					modelValue: F(y)
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
}), L_ = /* @__PURE__ */ R({
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
		return (n, r) => (V(), U(F(xh), {
			"as-child": "",
			reference: e.reference
		}, {
			default: I(() => [G(F(bm), J({
				ref: F(t),
				"as-child": e.asChild,
				as: e.as
			}, n.$attrs), {
				default: I(() => [z(n.$slots, "default")]),
				_: 3
			}, 16, ["as-child", "as"])]),
			_: 3
		}, 8, ["reference"]));
	}
}), [R_, z_] = /*#__PURE__*/ Gf("ComboboxContent"), B_ = /* @__PURE__ */ R({
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
		let n = e, r = t, { position: i } = /* @__PURE__ */ fn(n), a = P_(), o = Symbol("ComboboxContent");
		L(i, (e) => a.onContentPositionChange(o, e), { immediate: !0 });
		let s = Y(() => a.ignoreFilter.value ? a.allItems.value.size === 0 : a.filterState.value.count === 0), { forwardRef: c, currentElement: l } = Yp(), u = Fp(n.present && n.bodyLock);
		L([() => n.present, () => n.bodyLock], ([e, t]) => u.value = e && t), Kp(), sm(Y(() => n.present ? a.parentElement.value : void 0));
		let d = Xp(Y(() => {
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
		let p = /* @__PURE__ */ N(!1);
		Br(() => {
			a.inputElement.value && (p.value = l.value.contains(a.inputElement.value), n.present && p.value && a.inputElement.value.focus());
		}), L(() => n.present, async (e, t) => {
			if (e || !t) return;
			let n = Kf();
			n && l.value.contains(n) && (await In(), a.triggerElement.value?.focus());
		}), Wr(() => {
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
		return (t, o) => (V(), U(F(dh), { "as-child": "" }, {
			default: I(() => [G(F(Wm), {
				"as-child": "",
				present: n.present,
				onMountAutoFocus: o[5] ||= gs(() => {}, ["prevent"]),
				onUnmountAutoFocus: o[6] ||= gs(() => {}, ["prevent"])
			}, {
				default: I(() => [G(F(km), {
					"as-child": "",
					present: n.present,
					"disable-outside-pointer-events": e.disableOutsidePointerEvents,
					onDismiss: o[0] ||= (e) => F(a).onOpenChange(!1),
					onFocusOutside: o[1] ||= (e) => {
						m(e.target) && e.preventDefault(), r("focusOutside", e);
					},
					onInteractOutside: o[2] ||= (e) => r("interactOutside", e),
					onEscapeKeyDown: o[3] ||= (e) => r("escapeKeyDown", e),
					onPointerDownOutside: o[4] ||= (e) => {
						m(e.target) && e.preventDefault(), r("pointerDownOutside", e);
					}
				}, {
					default: I(() => [(V(), U(Zr(F(i) === "popper" ? F(M_) : F(bm)), J({
						...t.$attrs,
						...F(d)
					}, {
						id: F(a).contentId,
						ref: F(c),
						"memo-dependencies": F(i) === "popper" ? [F(a).filterSearch.value, F(a).filterState.value] : void 0,
						"data-state": F(a).open.value ? "open" : "closed",
						"data-empty": s.value ? "" : void 0,
						style: {
							display: n.hideWhenEmpty && s.value ? "none" : "flex",
							flexDirection: "column",
							outline: "none",
							...F(i) === "popper" ? f : {}
						}
					}, ri(F(i) === "popper" ? h : {})), {
						default: I(() => [z(t.$slots, "default")]),
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
}), V_ = /* @__PURE__ */ R({
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
		return i.contentId ||= cm(void 0, "reka-combobox-content"), (t, a) => (V(), U(F(_m), {
			present: e.forceMount || F(i).open.value,
			"force-mount": e.forceMount || !F(i).unmountOnHide.value
		}, {
			default: I(({ present: e }) => [Jn(G(B_, J({
				...F(n),
				...t.$attrs
			}, {
				ref: F(r),
				present: F(i).unmountOnHide.value || e
			}), {
				default: I(() => [z(t.$slots, "default")]),
				_: 3
			}, 16, ["present"]), [[To, F(i).unmountOnHide.value || e]])]),
			_: 3
		}, 8, ["present", "force-mount"]));
	}
}), H_ = /* @__PURE__ */ R({
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
		let t = e, n = P_(), r = Y(() => n.ignoreFilter.value ? n.allItems.value.size === 0 : n.filterState.value.count === 0);
		return (e, n) => r.value ? (V(), U(F(bm), ge(J({ key: 0 }, t)), {
			default: I(() => [z(e.$slots, "default", {}, () => [n[0] ||= K("No options", -1)])]),
			_: 3
		}, 16)) : q("v-if", !0);
	}
}), [U_, W_] = /*#__PURE__*/ Gf("ComboboxGroup"), G_ = /* @__PURE__ */ R({
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
		Br(() => {
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
			i.open.value ? i.filterSearch.value = e : (i.onOpenChange(!0), In(() => {
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
			n.displayValue ? c.value = n.displayValue(e) : !i.multiple.value && e && !Array.isArray(e) ? typeof e == "object" ? c.value = "" : c.value = e.toString() : c.value = "", In(() => {
				c.value = c.value;
			});
		}
		return i.onResetSearchTerm(() => {
			b();
		}), L(i.modelValue, async () => {
			!i.isUserInputted.value && i.resetSearchTermOnSelect.value && b();
		}, {
			immediate: !0,
			deep: !0
		}), L(i.filterState, (e, t) => {
			!i.isVirtual.value && t.count === 0 && a.highlightFirstItem();
		}), (t, n) => (V(), U(F(fh), {
			ref_key: "primitiveElement",
			ref: o,
			modelValue: F(c),
			"onUpdate:modelValue": n[0] ||= (e) => /* @__PURE__ */ nn(c) ? c.value = e : null,
			as: e.as,
			"as-child": e.asChild,
			"auto-focus": e.autoFocus,
			disabled: e.disabled,
			"aria-expanded": F(i).open.value,
			"aria-controls": F(i).contentId,
			"aria-autocomplete": "list",
			role: "combobox",
			autocomplete: "off",
			onClick: y,
			onInput: g,
			onKeydown: vs(m, ["down", "up"]),
			onFocus: _,
			onBlur: v,
			onCompositionstart: F(d),
			onCompositionupdate: F(f),
			onCompositionend: F(p)
		}, {
			default: I(() => [z(t.$slots, "default")]),
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
}), K_ = /* @__PURE__ */ R({
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
		let l = Y(() => {
			if (a.isVirtual.value || a.ignoreFilter.value || !a.filterSearch.value) return !0;
			{
				let e = a.filterState.value.items.get(i);
				return e === void 0 || e > 0;
			}
		});
		return Br(() => {
			a.allItems.value.set(i, n.textValue || c.value.textContent || c.value.innerText);
			let e = o?.id;
			e && (a.allGroups.value.has(e) ? a.allGroups.value.get(e)?.add(i) : a.allGroups.value.set(e, /* @__PURE__ */ new Set([i])));
		}), Wr(() => {
			a.allItems.value.delete(i);
		}), (t, o) => l.value ? lo([
			l.value,
			F(a).filterSearch.value,
			F(a).disabled.value,
			e.disabled,
			n.value,
			n.as,
			n.asChild,
			...Object.values(t.$attrs)
		], () => (V(), U(F(gh), J({ key: 0 }, n, {
			id: F(i),
			ref_key: "primitiveElement",
			ref: s,
			disabled: F(a).disabled.value || e.disabled,
			onSelect: o[0] ||= (t) => {
				r("select", t), t.defaultPrevented || (!F(a).multiple.value && !e.disabled && !F(a).disabled.value ? (t.preventDefault(), F(a).onOpenChange(!1), F(a).modelValue.value = n.value) : F(a).multiple.value && F(a).inputElement.value?.focus());
			}
		}), {
			default: I((n) => [z(t.$slots, "default", ge(Ia(n)), () => [K(M(e.value), 1)])]),
			_: 3
		}, 16, ["id", "disabled"])), o, 1) : q("v-if", !0);
	}
}), q_ = /* @__PURE__ */ R({
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
		return (e, n) => (V(), U(F(_h), ge(Ia(t)), {
			default: I(() => [z(e.$slots, "default")]),
			_: 3
		}, 16));
	}
}), J_ = /* @__PURE__ */ R({
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
		return (e, n) => (V(), U(F(Ym), ge(Ia(t)), {
			default: I(() => [z(e.$slots, "default")]),
			_: 3
		}, 16));
	}
}), Y_ = /* @__PURE__ */ R({
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
		let t = e, { forwardRef: n, currentElement: r } = Yp(), i = P_(), a = Y(() => t.disabled || i.disabled.value || !1);
		return Br(() => {
			r.value && i.onTriggerElementChange(r.value);
		}), (r, o) => (V(), U(F(bm), J(t, {
			ref: F(n),
			type: e.as === "button" ? "button" : void 0,
			tabindex: "-1",
			"aria-label": "Show popup",
			"aria-haspopup": "listbox",
			"aria-expanded": F(i).open.value,
			"aria-controls": F(i).contentId,
			"data-state": F(i).open.value ? "open" : "closed",
			disabled: a.value,
			"data-disabled": a.value ? "" : void 0,
			"aria-disabled": a.value ?? void 0,
			onClick: o[0] ||= (e) => F(i).onOpenChange(!F(i).open.value)
		}), {
			default: I(() => [z(r.$slots, "default")]),
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
	let t = wp({ nonce: /* @__PURE__ */ N() });
	return Y(() => e?.value || t.nonce?.value);
}
// node_modules/.pnpm/reka-ui@2.11.0_vue@3.5.42_typescript@6.0.3_/node_modules/reka-ui/dist/Combobox/ComboboxViewport.js
var Z_ = /* @__PURE__ */ R({
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
		let t = e, { forwardRef: n } = Yp(), { nonce: r } = /* @__PURE__ */ fn(t), i = X_(r), a = P_();
		return (e, r) => (V(), H(B, null, [G(F(bm), J({
			...e.$attrs,
			...t
		}, {
			ref: F(n),
			"data-reka-combobox-viewport": "",
			role: "presentation",
			style: {
				position: "relative",
				flex: F(a).isVirtual.value ? void 0 : 1,
				overflow: "auto"
			}
		}), {
			default: I(() => [z(e.$slots, "default")]),
			_: 3
		}, 16, ["style"]), G(F(bm), {
			as: "style",
			nonce: F(i)
		}, {
			default: I(() => [...r[0] ||= [K(" /* Hide scrollbars cross-browser and enable momentum scroll for touch devices */ [data-reka-combobox-viewport] { scrollbar-width:none; -ms-overflow-style: none; -webkit-overflow-scrolling: touch; } [data-reka-combobox-viewport]::-webkit-scrollbar { display: none; } ", -1)]]),
			_: 1
		}, 8, ["nonce"])], 64));
	}
}), [Q_, $_] = /*#__PURE__*/ Gf("FieldRoot"), [ev, tv] = /*#__PURE__*/ Gf("PopoverRoot"), nv = /* @__PURE__ */ R({
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
		let n = e, r = t, { modal: i } = /* @__PURE__ */ fn(n), a = Sp(n, "open", r, {
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
			triggerElement: /* @__PURE__ */ N(),
			hasCustomAnchor: /* @__PURE__ */ N(!1)
		}), (e, t) => (V(), U(F(bh), null, {
			default: I(() => [z(e.$slots, "default", {
				open: F(a),
				close: () => a.value = !1
			})]),
			_: 3
		}));
	}
}), rv = /* @__PURE__ */ R({
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
		return Kp(), (t, n) => (V(), U(F(Wm), {
			"as-child": "",
			loop: "",
			trapped: e.trapFocus,
			onMountAutoFocus: n[5] ||= (e) => r("openAutoFocus", e),
			onUnmountAutoFocus: n[6] ||= (e) => r("closeAutoFocus", e)
		}, {
			default: I(() => [G(F(km), {
				"as-child": "",
				"disable-outside-pointer-events": e.disableOutsidePointerEvents,
				onPointerDownOutside: n[0] ||= (e) => r("pointerDownOutside", e),
				onInteractOutside: n[1] ||= (e) => r("interactOutside", e),
				onEscapeKeyDown: n[2] ||= (e) => r("escapeKeyDown", e),
				onFocusOutside: n[3] ||= (e) => r("focusOutside", e),
				onDismiss: n[4] ||= (e) => F(o).onOpenChange(!1)
			}, {
				default: I(() => [G(F(M_), J(F(i), {
					id: F(o).contentId,
					ref: F(a),
					"data-state": F(o).open.value ? "open" : "closed",
					"aria-labelledby": F(o).triggerId,
					style: {
						"--reka-popover-content-transform-origin": "var(--reka-popper-transform-origin)",
						"--reka-popover-content-available-width": "var(--reka-popper-available-width)",
						"--reka-popover-content-available-height": "var(--reka-popper-available-height)",
						"--reka-popover-trigger-width": "var(--reka-popper-anchor-width)",
						"--reka-popover-trigger-height": "var(--reka-popper-anchor-height)"
					},
					role: "dialog"
				}), {
					default: I(() => [z(t.$slots, "default")]),
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
}), iv = /* @__PURE__ */ R({
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
		let n = e, r = t, i = ev(), a = /* @__PURE__ */ N(!1);
		Fp(!0);
		let o = Zp(n, r), { forwardRef: s, currentElement: c } = Yp();
		return sm(c), (e, t) => (V(), U(rv, J(F(o), {
			ref: F(s),
			"trap-focus": F(i).open.value,
			"disable-outside-pointer-events": "",
			onCloseAutoFocus: t[0] ||= gs((e) => {
				r("closeAutoFocus", e), a.value || F(i).triggerElement.value?.focus();
			}, ["prevent"]),
			onPointerDownOutside: t[1] ||= (e) => {
				r("pointerDownOutside", e);
				let t = e.detail.originalEvent, n = t.button === 0 && t.ctrlKey === !0, i = t.button === 2 || n;
				a.value = i;
			},
			onFocusOutside: t[2] ||= gs(() => {}, ["prevent"])
		}), {
			default: I(() => [z(e.$slots, "default")]),
			_: 3
		}, 16, ["trap-focus"]));
	}
}), av = /* @__PURE__ */ R({
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
		let n = e, r = t, i = ev(), a = /* @__PURE__ */ N(!1), o = /* @__PURE__ */ N(!1), s = Zp(n, r);
		return (e, t) => (V(), U(rv, J(F(s), {
			"trap-focus": !1,
			"disable-outside-pointer-events": !1,
			onCloseAutoFocus: t[0] ||= (e) => {
				r("closeAutoFocus", e), e.defaultPrevented || (a.value || F(i).triggerElement.value?.focus(), e.preventDefault()), a.value = !1, o.value = !1;
			},
			onInteractOutside: t[1] ||= async (e) => {
				r("interactOutside", e), e.defaultPrevented || (a.value = !0, e.detail.originalEvent.type === "pointerdown" && (o.value = !0));
				let t = e.target;
				F(i).triggerElement.value?.contains(t) && e.preventDefault(), e.detail.originalEvent.type === "focusin" && o.value && e.preventDefault();
			}
		}), {
			default: I(() => [z(e.$slots, "default")]),
			_: 3
		}, 16));
	}
}), ov = /* @__PURE__ */ R({
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
		return i.contentId ||= cm(void 0, "reka-popover-content"), (t, n) => (V(), U(F(_m), { present: e.forceMount || F(i).open.value }, {
			default: I(() => [F(i).modal.value ? (V(), U(iv, J({ key: 0 }, F(a), { ref: F(o) }), {
				default: I(() => [z(t.$slots, "default")]),
				_: 3
			}, 16)) : (V(), U(av, J({ key: 1 }, F(a), { ref: F(o) }), {
				default: I(() => [z(t.$slots, "default")]),
				_: 3
			}, 16))]),
			_: 3
		}, 8, ["present"]));
	}
}), sv = /* @__PURE__ */ R({
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
		return (e, n) => (V(), U(F(Ym), ge(Ia(t)), {
			default: I(() => [z(e.$slots, "default")]),
			_: 3
		}, 16));
	}
}), cv = /* @__PURE__ */ R({
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
		return n.triggerId ||= cm(void 0, "reka-popover-trigger"), n.contentId ||= cm(void 0, "reka-popover-content"), Br(() => {
			n.triggerElement.value = i.value;
		}), (i, a) => (V(), U(Zr(F(n).hasCustomAnchor.value ? F(bm) : F(xh)), { "as-child": "" }, {
			default: I(() => [G(F(bm), {
				id: F(n).triggerId,
				ref: F(r),
				type: e.as === "button" ? "button" : void 0,
				"aria-haspopup": "dialog",
				"aria-expanded": F(n).open.value,
				"aria-controls": F(n).open.value ? F(n).contentId : void 0,
				"data-state": F(n).open.value ? "open" : "closed",
				as: e.as,
				"as-child": t.asChild,
				onClick: F(n).onOpenToggle
			}, {
				default: I(() => [z(i.$slots, "default")]),
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
var mv = ["value"], [hv, gv] = /*#__PURE__*/ Gf("SelectRoot"), _v = /* @__PURE__ */ R({
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
		let n = e, r = t, { multiple: i, dir: a } = /* @__PURE__ */ fn(n), o = Q_(null), s = Y(() => n.name ?? o?.name.value), c = Y(() => o ? n.required || o.required.value : n.required), l = Y(() => !!(n.disabled || o?.disabled.value)), u = Sp(n, "modelValue", r, {
			defaultValue: n.defaultValue ?? (i.value ? [] : void 0),
			passive: n.modelValue === void 0,
			deep: !0
		}), d = Sp(n, "open", r, {
			defaultValue: n.defaultOpen,
			passive: n.open === void 0
		}), f = /* @__PURE__ */ N(), p = /* @__PURE__ */ N(), m = /* @__PURE__ */ N({
			x: 0,
			y: 0
		}), h = Y(() => i.value && Array.isArray(u.value) ? u.value?.length === 0 : Jf(u.value));
		L(u, () => {
			o?.reportControlState({ filled: !h.value });
		}), Zm({ isProvider: !0 });
		let g = Hp(a), _ = Jp(f), v = /* @__PURE__ */ N(/* @__PURE__ */ new Set()), y = Y(() => Array.from(v.value).map((e) => e.value).join(";"));
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
		}), (t, n) => (V(), U(F(bh), null, {
			default: I(() => [z(t.$slots, "default", {
				modelValue: F(u),
				open: F(d)
			}), F(_) && s.value ? (V(), U(vv, {
				key: y.value,
				"aria-hidden": "true",
				tabindex: "-1",
				multiple: F(i),
				required: c.value,
				name: s.value,
				autocomplete: e.autocomplete,
				disabled: l.value,
				value: F(u)
			}, {
				default: I(() => [F(Jf)(F(u)) ? (V(), H("option", {
					key: 0,
					value: e.nullableValue
				}, null, 8, mv)) : q("v-if", !0), (V(!0), H(B, null, ei(Array.from(v.value), (e) => (V(), H("option", J({ key: e.value ?? "" }, { ref_for: !0 }, e), null, 16))), 128))]),
				_: 1
			}, 8, [
				"multiple",
				"required",
				"name",
				"autocomplete",
				"disabled",
				"value"
			])) : q("v-if", !0)]),
			_: 3
		}));
	}
}), vv = /* @__PURE__ */ R({
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
		let t = e, n = /* @__PURE__ */ N(), r = hv();
		L(() => t.value, (e, t) => {
			let r = window.HTMLSelectElement.prototype, i = Object.getOwnPropertyDescriptor(r, "value").set;
			if (e !== t && i && n.value) {
				let t = new Event("change", { bubbles: !0 });
				i.call(n.value, e), n.value.dispatchEvent(t);
			}
		});
		function i(e) {
			r.onValueChange(e.target.value);
		}
		return (e, r) => (V(), U(F(Qm), { "as-child": "" }, {
			default: I(() => [W("select", J({
				ref_key: "selectElement",
				ref: n
			}, t, { onInput: i }), [z(e.$slots, "default")], 16)]),
			_: 3
		}));
	}
}), yv = /* @__PURE__ */ R({
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
		return (e, n) => (V(), U(F(M_), J(F(t), { style: {
			boxSizing: "border-box",
			"--reka-select-content-transform-origin": "var(--reka-popper-transform-origin)",
			"--reka-select-content-available-width": "var(--reka-popper-available-width)",
			"--reka-select-content-available-height": "var(--reka-popper-available-height)",
			"--reka-select-trigger-width": "var(--reka-popper-anchor-width)",
			"--reka-select-trigger-height": "var(--reka-popper-anchor-height)"
		} }), {
			default: I(() => [z(e.$slots, "default")]),
			_: 3
		}, 16));
	}
}), bv = {
	onViewportChange: () => {},
	itemTextRefCallback: () => {},
	itemRefCallback: () => {}
}, [xv, Sv] = /*#__PURE__*/ Gf("SelectContent"), Cv = /* @__PURE__ */ R({
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
		let { CollectionSlot: a, getItems: o } = Zm(), s = /* @__PURE__ */ N();
		sm(s);
		let { search: c, handleTypeaheadSearch: l } = fm(), u = /* @__PURE__ */ N(), d = /* @__PURE__ */ N(), f = /* @__PURE__ */ N(), p = /* @__PURE__ */ N(!1), m = /* @__PURE__ */ N(!1), h = /* @__PURE__ */ N(!1);
		function g() {
			d.value && s.value && Jm([d.value, s.value]);
		}
		L(p, () => {
			g();
		});
		let { onOpenChange: _, triggerPointerDownPosRef: v } = i;
		er((e) => {
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
		let b = lp(n, "loop"), x = Xp(Y(() => n.position === "popper" ? b : {}).value);
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
		}), (t, n) => (V(), U(F(a), null, {
			default: I(() => [G(F(Wm), {
				"as-child": "",
				onMountAutoFocus: n[6] ||= gs(() => {}, ["prevent"]),
				onUnmountAutoFocus: n[7] ||= (e) => {
					r("closeAutoFocus", e), e.defaultPrevented || (F(i).triggerElement.value?.focus({ preventScroll: !0 }), e.preventDefault());
				}
			}, {
				default: I(() => [G(F(km), {
					"as-child": "",
					"disable-outside-pointer-events": e.disableOutsidePointerEvents,
					onFocusOutside: n[2] ||= gs(() => {}, ["prevent"]),
					onDismiss: n[3] ||= (e) => F(i).onOpenChange(!1),
					onEscapeKeyDown: n[4] ||= (e) => r("escapeKeyDown", e),
					onPointerDownOutside: n[5] ||= (e) => r("pointerDownOutside", e)
				}, {
					default: I(() => [(V(), U(Zr(e.position === "popper" ? yv : Ev), J({
						...t.$attrs,
						...F(x)
					}, {
						id: F(i).contentId,
						ref: (e) => {
							if (!e) return;
							let t = F(mp)(e);
							t?.hasAttribute("data-reka-popper-content-wrapper") ? s.value = t.firstElementChild : s.value = t;
						},
						role: "listbox",
						"data-state": F(i).open.value ? "open" : "closed",
						dir: F(i).dir.value,
						style: {
							display: "flex",
							flexDirection: "column",
							outline: "none"
						},
						onContextmenu: n[0] ||= gs(() => {}, ["prevent"]),
						onPlaced: n[1] ||= (e) => p.value = !0,
						onKeydown: y
					}), {
						default: I(() => [z(t.$slots, "default")]),
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
}), [wv, Tv] = /*#__PURE__*/ Gf("SelectItemAlignedPosition"), Ev = /* @__PURE__ */ R({
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
		let n = e, r = t, { getItems: i } = Zm(), a = hv(), o = xv(), s = /* @__PURE__ */ N(!1), c = /* @__PURE__ */ N(!0), l = /* @__PURE__ */ N(), { forwardRef: u, currentElement: d } = Yp(), { viewport: f, selectedItem: p, selectedItemText: m, focusSelectedItem: h } = o;
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
				let c = i().map((e) => e.ref), u = window.innerHeight - 20, h = f.value.scrollHeight, g = window.getComputedStyle(d.value), _ = Number.parseInt(g.borderTopWidth, 10), v = Number.parseInt(g.paddingTop, 10), y = Number.parseInt(g.borderBottomWidth, 10), b = Number.parseInt(g.paddingBottom, 10), x = _ + v + h + b + y, S = Math.min(p.value.offsetHeight * 5, x), C = window.getComputedStyle(f.value), w = Number.parseInt(C.paddingTop, 10), T = Number.parseInt(C.paddingBottom, 10), E = e.top + e.height / 2 - 10, D = u - E, O = p.value.offsetHeight / 2, k = p.value.offsetTop + O, ee = _ + v + k, A = x - ee;
				if (ee <= E) {
					let e = p.value === c.at(-1);
					l.value.style.bottom = "0px";
					let t = d.value.clientHeight - f.value.offsetTop - f.value.offsetHeight, n = ee + Math.max(D, O + (e ? T : 0) + t + y);
					l.value.style.height = `${n}px`;
				} else {
					let e = p.value === c[0];
					l.value.style.top = "0px";
					let t = Math.max(E, _ + f.value.offsetTop + (e ? w : 0) + O) + A;
					l.value.style.height = `${t}px`, f.value.scrollTop = ee - E + f.value.offsetTop;
				}
				l.value.style.margin = "10px 0", l.value.style.minHeight = `${S}px`, l.value.style.maxHeight = `${u}px`, r("placed"), requestAnimationFrame(() => s.value = !0);
			}
		}
		let _ = /* @__PURE__ */ N("");
		Br(async () => {
			await In(), g(), d.value && (_.value = window.getComputedStyle(d.value).zIndex);
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
		}), (e, t) => (V(), H("div", {
			ref_key: "contentWrapperElement",
			ref: l,
			style: ue({
				display: "flex",
				flexDirection: "column",
				position: "fixed",
				zIndex: _.value
			})
		}, [G(F(bm), J({
			ref: F(u),
			style: {
				boxSizing: "border-box",
				maxHeight: "100%"
			}
		}, {
			...e.$attrs,
			...n
		}), {
			default: I(() => [z(e.$slots, "default")]),
			_: 3
		}, 16)], 4));
	}
}), Dv = /* @__PURE__ */ R({
	inheritAttrs: !1,
	__name: "SelectProvider",
	props: { context: {
		type: Object,
		required: !0
	} },
	setup(e) {
		return gv(e.context), Sv(bv), (e, t) => z(e.$slots, "default");
	}
}), Ov = { key: 1 }, kv = /* @__PURE__ */ R({
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
		let n = e, r = Zp(n, t), i = hv(), a = /* @__PURE__ */ N();
		Br(() => {
			a.value = new DocumentFragment();
		});
		let o = /* @__PURE__ */ N(), s = Y(() => n.forceMount || i.open.value), c = /* @__PURE__ */ N(s.value), l;
		function u() {
			l &&= (clearTimeout(l), void 0);
		}
		return L(s, (e, t, n) => {
			u(), l = setTimeout(() => {
				c.value = s.value, l = void 0;
			}), n(u);
		}), Wr(u), (e, t) => s.value || c.value || o.value?.present ? (V(), U(F(_m), {
			key: 0,
			ref_key: "presenceRef",
			ref: o,
			present: s.value
		}, {
			default: I(() => [G(Cv, ge(Ia({
				...F(r),
				...e.$attrs
			})), {
				default: I(() => [z(e.$slots, "default")]),
				_: 3
			}, 16)]),
			_: 3
		}, 8, ["present"])) : a.value ? (V(), H("div", Ov, [(V(), U(_r, { to: a.value }, [G(Dv, { context: F(i) }, {
			default: I(() => [z(e.$slots, "default")]),
			_: 3
		}, 8, ["context"])], 8, ["to"]))])) : q("v-if", !0);
	}
}), [Av, jv] = /*#__PURE__*/ Gf("SelectItem"), Mv = /* @__PURE__ */ R({
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
		let n = e, r = t, { disabled: i } = /* @__PURE__ */ fn(n), a = hv(), o = xv(), { forwardRef: s, currentElement: c } = Yp(), { CollectionItem: l } = Zm(), u = Y(() => dv(a.modelValue?.value, n.value, a.by)), d = /* @__PURE__ */ N(!1), f = /* @__PURE__ */ N(n.textValue ?? ""), p = cm(void 0, "reka-select-item-text");
		async function m(e) {
			e.defaultPrevented || qf("select.select", h, {
				originalEvent: e,
				value: n.value
			});
		}
		async function h(e) {
			await In(), r("select", e), e.defaultPrevented || i.value || (a.onValueChange(n.value), a.multiple.value || a.onOpenChange(!1));
		}
		async function g(e) {
			await In(), e.defaultPrevented || (i.value ? o.onItemLeave?.() : e.currentTarget?.focus({ preventScroll: !0 }));
		}
		async function _(e) {
			await In(), e.defaultPrevented || e.currentTarget === Kf() && o.onItemLeave?.();
		}
		async function v(e) {
			await In(), e.defaultPrevented || (o.searchRef?.value === "" || e.key !== " ") && (uv.includes(e.key) && m(e), e.key === " " && e.preventDefault());
		}
		if (n.value === "") throw Error("A <SelectItem /> must have a value prop that is not an empty string. This is because the Select value can be set to an empty string to clear the selection and show the placeholder.");
		return Br(() => {
			c.value && o.itemRefCallback(c.value, n.value, n.disabled);
		}), jv({
			value: n.value,
			disabled: i,
			textId: p,
			isSelected: u,
			onItemTextChange: (e) => {
				f.value = ((f.value || e?.textContent) ?? "").trim();
			}
		}), (t, n) => (V(), U(F(l), { value: { textValue: f.value } }, {
			default: I(() => [G(F(bm), {
				ref: F(s),
				role: "option",
				"aria-labelledby": F(p),
				"data-highlighted": d.value ? "" : void 0,
				"aria-selected": u.value,
				"data-state": u.value ? "checked" : "unchecked",
				"aria-disabled": F(i) || void 0,
				"data-disabled": F(i) ? "" : void 0,
				tabindex: F(i) ? void 0 : -1,
				as: e.as,
				"as-child": e.asChild,
				onFocus: n[0] ||= (e) => d.value = !0,
				onBlur: n[1] ||= (e) => d.value = !1,
				onPointerup: m,
				onPointerdown: n[2] ||= (e) => {
					e.currentTarget.focus({ preventScroll: !0 });
				},
				onTouchend: n[3] ||= gs(() => {}, ["prevent", "stop"]),
				onPointermove: g,
				onPointerleave: _,
				onKeydown: v
			}, {
				default: I(() => [z(t.$slots, "default", { selected: u.value })]),
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
}), Nv = /* @__PURE__ */ R({
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
		return (r, i) => (V(), U(F(_m), { present: e.forceMount || F(n).isSelected.value }, {
			default: I(() => [G(F(bm), {
				ref: F(t),
				"aria-hidden": "true",
				"data-state": F(n).isSelected.value ? "checked" : "unchecked",
				as: e.as,
				"as-child": e.asChild
			}, {
				default: I(() => [z(r.$slots, "default")]),
				_: 3
			}, 8, [
				"data-state",
				"as",
				"as-child"
			])]),
			_: 3
		}, 8, ["present"]));
	}
}), Pv = /* @__PURE__ */ R({
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
		let t = e, n = hv(), r = xv(), i = Av(), { forwardRef: a, currentElement: o } = Yp(), s = Y(() => ({
			value: i.value,
			disabled: i.disabled.value,
			textContent: o.value?.textContent ?? i.value?.toString() ?? ""
		}));
		return Br(() => {
			o.value && (i.onItemTextChange(o.value), r.itemTextRefCallback(o.value, i.value, i.disabled.value), n.onOptionAdd(s.value));
		}), Wr(() => {
			n.onOptionRemove(s.value);
		}), (e, n) => (V(), U(F(bm), J({
			id: F(i).textId,
			ref: F(a)
		}, {
			...t,
			...e.$attrs
		}), {
			default: I(() => [z(e.$slots, "default")]),
			_: 3
		}, 16, ["id"]));
	}
}), Fv = /* @__PURE__ */ R({
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
		return (e, n) => (V(), U(F(Ym), ge(Ia(t)), {
			default: I(() => [z(e.$slots, "default")]),
			_: 3
		}, 16));
	}
}), Iv = /* @__PURE__ */ R({
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
		let t = e, n = hv(), { forwardRef: r, currentElement: i } = Yp(), a = Y(() => n.disabled?.value || t.disabled);
		n.contentId ||= cm(void 0, "reka-select-content"), Br(() => {
			n.onTriggerChange(i.value);
		});
		let o = Q_(null), s = ci();
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
		Br(() => {
			f = o?.registerControl({
				id: c,
				element: () => i.value,
				getValue: () => n.modelValue.value,
				required: () => !!n.required?.value
			});
		}), Ur(() => f?.());
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
		return (t, i) => (V(), U(F(xh), {
			"as-child": "",
			reference: e.reference
		}, {
			default: I(() => [G(F(bm), J(l(), {
				ref: F(r),
				role: "combobox",
				type: e.as === "button" ? "button" : void 0,
				"aria-controls": F(n).open.value ? F(n).contentId : void 0,
				"aria-expanded": F(n).open.value || !1,
				"aria-required": F(n).required?.value,
				"aria-autocomplete": "none",
				disabled: a.value,
				dir: F(n)?.dir.value,
				"data-state": F(n)?.open.value ? "open" : "closed",
				"data-disabled": a.value ? "" : void 0,
				"data-placeholder": F(pv)(F(n).modelValue?.value) ? "" : void 0,
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
				default: I(() => [z(t.$slots, "default")]),
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
}), Lv = /* @__PURE__ */ R({
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
		Br(() => {
			i.valueElement = r;
		});
		let a = Y(() => {
			let e = [], t = Array.from(i.optionsSet.value), n = (e) => t.find((t) => dv(e, t.value, i.by));
			return e = Array.isArray(i.modelValue.value) ? i.modelValue.value.map((e) => n(e)?.textContent ?? "") : [n(i.modelValue.value)?.textContent ?? ""], e.filter(Boolean);
		}), o = Y(() => a.value.length ? a.value.join(", ") : t.placeholder);
		return (r, s) => (V(), U(F(bm), {
			ref: F(n),
			as: e.as,
			"as-child": e.asChild,
			style: { pointerEvents: "none" },
			"data-placeholder": a.value.length ? void 0 : t.placeholder
		}, {
			default: I(() => [z(r.$slots, "default", {
				selectedLabel: a.value,
				modelValue: F(i).modelValue.value
			}, () => [K(M(o.value), 1)])]),
			_: 3
		}, 8, [
			"as",
			"as-child",
			"data-placeholder"
		]));
	}
}), Rv = /* @__PURE__ */ R({
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
		let t = e, { nonce: n } = /* @__PURE__ */ fn(t), r = X_(n), i = xv(), a = i.position === "item-aligned" ? wv() : void 0, { forwardRef: o, currentElement: s } = Yp();
		Br(() => {
			i?.onViewportChange(s.value);
		});
		let c = /* @__PURE__ */ N(0);
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
		return (e, n) => (V(), H(B, null, [G(F(bm), J({
			ref: F(o),
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
			default: I(() => [z(e.$slots, "default")]),
			_: 3
		}, 16), G(F(bm), {
			as: "style",
			nonce: F(r)
		}, {
			default: I(() => [...n[0] ||= [K(" /* Hide scrollbars cross-browser and enable momentum scroll for touch devices */ [data-reka-select-viewport] { scrollbar-width:none; -ms-overflow-style: none; -webkit-overflow-scrolling: touch; } [data-reka-select-viewport]::-webkit-scrollbar { display: none; } ", -1)]]),
			_: 1
		}, 8, ["nonce"])], 64));
	}
}), zv = /* @__PURE__ */ R((e) => {
	let t = /* @__PURE__ */ N(null), n = /* @__PURE__ */ N(""), r = /* @__PURE__ */ N(!1), i = Y({
		get: () => e.value ?? n.value,
		set: (t) => {
			e.onValueChange ? e.onValueChange(t) : n.value = t;
		}
	});
	return L([i, r], ([t, n], r, i) => {
		if (n) return;
		let a = window.setTimeout(() => e.onSearch(t), 180);
		i(() => window.clearTimeout(a));
	}, { immediate: !0 }), () => G(I_, {
		open: !1,
		ignoreFilter: !0,
		class: "ap-search-field"
	}, { default: () => [G(L_, J({ as: "div" }, {
		onClick: () => t.value?.$el.focus(),
		onCompositionstart: () => {
			r.value = !0;
		},
		onCompositionend: (e) => {
			i.value = e.target.value, r.value = !1;
		}
	}), { default: () => [i.value ? G("button", {
		type: "button",
		class: "ap-search-clear",
		"aria-label": e.clearLabel,
		title: e.clearLabel,
		onClick: () => {
			i.value = "", t.value?.$el.focus();
		}
	}, [G("svg", {
		width: "16",
		height: "16",
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		"stroke-width": "2",
		"stroke-linecap": "round",
		"aria-hidden": "true"
	}, [G("path", { d: "m18 6-12 12M6 6l12 12" }, null)])]) : G("svg", {
		class: "ap-search-icon",
		width: "16",
		height: "16",
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		"stroke-width": "2",
		"stroke-linecap": "round",
		"aria-hidden": "true"
	}, [G("circle", {
		cx: "11",
		cy: "11",
		r: "8"
	}, null), G("path", { d: "m21 21-4.35-4.35" }, null)]), G(G_, J({
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
] }), Bv = /* @__PURE__ */ R((e) => {
	let t = wr(), n = /* @__PURE__ */ N(null), r = /* @__PURE__ */ N(!1), i = Y(() => r.value && !e.disabled);
	return () => {
		let { icon: a, label: o, options: s, multiple: c, disabled: l } = e;
		return G("div", {
			class: "ap-search-options",
			onFocusout: (e) => {
				e.currentTarget.contains(e.relatedTarget) || (r.value = !1);
			},
			onKeydown: (e) => {
				i.value && e.key === "Escape" && (e.preventDefault(), e.stopPropagation(), r.value = !1, n.value?.focus());
			}
		}, [G("button", {
			ref: n,
			type: "button",
			disabled: l,
			class: "ap-search-action",
			"aria-label": o,
			title: o,
			"aria-expanded": i.value,
			"aria-controls": t,
			onClick: () => r.value = !r.value
		}, [G("svg", {
			width: "16",
			height: "16",
			viewBox: "0 0 24 24",
			fill: "none",
			stroke: "currentColor",
			"stroke-width": "2",
			"stroke-linecap": "round",
			"aria-hidden": "true"
		}, [a === "filter" ? G("path", { d: "M3 6h18M6 12h12M9 18h6" }, null) : G(B, null, [
			G("path", { d: "M20 7h-9m3 10H5" }, null),
			G("circle", {
				cx: "7",
				cy: "7",
				r: "3"
			}, null),
			G("circle", {
				cx: "17",
				cy: "17",
				r: "3"
			}, null)
		])])]), G("div", {
			id: t,
			class: "ap-search-menu",
			role: c ? "group" : "radiogroup",
			"aria-label": o,
			hidden: !i.value
		}, [s.map((e) => G("label", {
			key: e.id,
			onMousedown: (e) => e.preventDefault()
		}, [
			G("input", {
				type: c ? "checkbox" : "radio",
				name: t,
				checked: e.checked,
				onChange: e.select
			}, null),
			G("span", null, [e.label]),
			G("svg", {
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
			}, [G("path", { d: "m5 12 4 4L19 6" }, null)])
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
	let n = /* @__PURE__ */ P(t[0]);
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
// src/shared/Feedback.tsx
var Hv = /* @__PURE__ */ R((e) => {
	let { t } = Z();
	return () => {
		let { error: n, retry: r } = e, i = n instanceof Q ? n.code : "canvas";
		return G("div", { role: "alert" }, [G("p", null, [t(`errors.${i}`, { status: n instanceof Q ? n.status : "" }, t("errors.unknown"))]), r && G("button", { onClick: r }, [t("actions.retry")])]);
	};
}, { props: ["error", "retry"] });
// src/host/canvas.ts
function Uv() {
	return window.LiteGraph;
}
function Wv(e, n, r = t, i = Uv(), a) {
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
var Gv = "application/x-astrophoto-resource+json";
function Kv(e, t, n) {
	e.effectAllowed = "copy", e.setData(Gv, JSON.stringify({
		v: 1,
		kind: "node",
		nodeId: t,
		token: n
	}));
}
function qv(e, t, n) {
	let r = JSON.parse(e);
	if (!r || typeof r != "object" || !("v" in r) || r.v !== 1 || !("kind" in r) || r.kind !== "node" || !("nodeId" in r) || typeof r.nodeId != "string" || n !== void 0 && (!("token" in r) || r.token !== n) || !(typeof t == "function" ? t(r.nodeId) : t.has(r.nodeId))) throw Error("INVALID_DRAG");
	return r.nodeId;
}
var Jv = 0;
function Yv() {
	Jv += 1;
}
function Xv(e, n, r = Wv) {
	let i = () => {
		let e = t.canvas;
		return {
			canvas: e,
			graph: e?.graph,
			surface: e?.canvas,
			generation: Jv
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
		return Kv(n, r, c), o = {
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
			let o = qv(t.dataTransfer.getData(Gv), e, i);
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
function Zv() {
	return G("svg", {
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
	}, [G("path", { d: "m6 9 6 6 6-6" }, null)]);
}
// src/features/nodes/NodeHoverPreview.tsx
var Qv = 16, $v = (e, t, n) => Math.max(t, Math.min(e, n)), ey = /* @__PURE__ */ R((e) => {
	let { t: n } = Z(), r = /* @__PURE__ */ N(null);
	return tr((n) => {
		let { anchor: i } = e, a = r.value;
		if (!a) return;
		let o = i.closest(".astrophoto-ui") ?? i, s = i.closest(".ap-scroll"), c = () => {
			let e = i.getBoundingClientRect(), n = s?.getBoundingClientRect();
			if (!e.width || !e.height || e.bottom <= 0 || e.top >= window.innerHeight || n && (e.bottom <= n.top || e.top >= n.bottom)) {
				a.style.visibility = "hidden";
				return;
			}
			let { width: r, height: c } = a.getBoundingClientRect(), l = o.getBoundingClientRect(), u = l.left - Qv - r, d = l.right + Qv, f = t.extensionManager.setting.get("Comfy.Sidebar.Location") === "right", p = f ? u : d;
			f && u < Qv && d + r <= window.innerWidth - Qv && (p = d), !f && d + r > window.innerWidth - Qv && u >= Qv && (p = u), a.style.left = `${$v(p, Qv, window.innerWidth - r - Qv)}px`;
			let m = e.top + e.height / 2 - c * .3;
			a.style.top = `${$v(m, Qv, window.innerHeight - c - Qv)}px`, a.style.visibility = "visible";
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
		return G(_r, { to: "body" }, { default: () => [G("aside", {
			class: "astrophoto-node-preview",
			ref: r,
			"aria-hidden": "true"
		}, [G("div", { class: "ap-preview-miniature" }, [G("div", { class: "ap-preview-node-title" }, [t.title]), G("div", { class: "ap-preview-sockets" }, [G("div", null, [t.inputs.map(([e], t) => G("span", { key: t }, [e]))]), G("div", null, [t.outputs.map(([e], t) => G("span", { key: t }, [e]))])])]), G("div", { class: "ap-preview-content" }, [
			G("h3", null, [t.title]),
			t.description && G("p", null, [t.description]),
			i.map(([e, t]) => t.length > 0 && G("div", {
				class: "ap-preview-ports",
				key: e
			}, [G("h4", null, [e]), G("dl", null, [t.map(([e, t], n) => G("div", { key: n }, [G("dt", null, [e]), G("dd", null, [t])]))])]))
		])])] });
	};
}, { props: [
	"node",
	"anchor",
	"dismiss"
] });
// src/features/nodes/NodeTree.tsx
function ty(e, t, n = (e) => e) {
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
var ny = /* @__PURE__ */ R((e) => {
	let t = /* @__PURE__ */ P(null), n = !1;
	return L(() => e.previewEnabled, (e) => {
		e || (t.value = null);
	}), () => {
		let { node: r, level: i, selectNode: a, startDrag: o, previewEnabled: s, isBookmarked: c, toggleBookmark: l, bookmarkLabel: u, bookmarkPath: d, bookmarkPending: f } = e;
		return G("li", null, [G("div", {
			class: "ap-tree-row ap-tree-leaf",
			onPointerenter: (e) => {
				e.pointerType === "mouse" && s && !n && (t.value = e.currentTarget);
			},
			onPointerleave: () => t.value = null
		}, [G("button", {
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
		}, [G("svg", {
			width: "16",
			height: "16",
			viewBox: "0 0 16 16",
			fill: "none",
			"aria-hidden": "true"
		}, [G("path", {
			stroke: "currentColor",
			"stroke-linecap": "round",
			"stroke-width": "1.3",
			d: "m11.2667 10.45-.0842.3156c-.143.5363-.6286.9094-1.18362.9094H4.6945c-.80486 0-1.39102-.7629-1.18364-1.5406l1.30667-4.90002c.143-.53625.62865-.90937 1.18364-.90937h5.46393c.7243 0 1.2518.68663 1.0652 1.38652l-.0301.11275M15.35 8.00001h-4.9m-6.73748 0H.65002"
		}, null)]), G("span", null, [r.title])]), G("button", {
			type: "button",
			class: "ap-tree-bookmark",
			"aria-label": u(c(d)),
			title: u(c(d)),
			"aria-pressed": c(d),
			disabled: f,
			onClick: () => {
				t.value = null, l(r.id, d);
			}
		}, [G("svg", {
			width: "16",
			height: "16",
			viewBox: "0 0 24 24",
			fill: c(d) ? "currentColor" : "none",
			stroke: "currentColor",
			"stroke-width": "2",
			"stroke-linecap": "round",
			"stroke-linejoin": "round",
			"aria-hidden": "true"
		}, [G("path", { d: "M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16l-6-4-6 4Z" }, null)])])]), s && t.value && G(ey, {
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
function ry({ entries: e, level: t = 0, ...n }) {
	let r = { paddingInlineStart: `${8 + t * 24}px` };
	return G("ul", {
		class: "ap-node-tree",
		role: "list"
	}, [e.map((e) => {
		if (e.kind === "folder") {
			let i = n.isExpanded(e.key);
			return G("li", { key: `folder:${e.key}` }, [G("button", {
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
				G(Zv, null, null),
				G("svg", {
					width: "16",
					height: "16",
					viewBox: "0 0 24 24",
					fill: "none",
					stroke: "currentColor",
					"stroke-width": "2",
					"stroke-linecap": "round",
					"stroke-linejoin": "round",
					"aria-hidden": "true"
				}, [G("path", { d: "M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-8a2 2 0 0 1-1.6-.8l-.8-1.1A2 2 0 0 0 8 3.3H4a2 2 0 0 0-2 2V18a2 2 0 0 0 2 2Z" }, null)]),
				G("span", null, [e.label])
			]), i && G(ry, J({
				entries: e.children,
				level: t + 1
			}, n), null)]);
		}
		return G(ny, J({
			key: `node:${e.key}`,
			node: e.node,
			bookmarkPath: e.bookmarkPath,
			level: t
		}, n), null);
	})]);
}
ry.inheritAttrs = !1;
// src/host/nodeBookmarks.ts
var iy = "Comfy.NodeLibrary.Bookmarks.V2", ay = `/settings/${encodeURIComponent(iy)}`;
function oy() {
	let e = t.extensionManager.setting.get(iy);
	return Array.isArray(e) ? e.filter((e) => typeof e == "string") : [];
}
async function sy() {
	let e = await Ff(ay, void 0, "no-store");
	if (e === null) return [];
	if (!Array.isArray(e) || !e.every((e) => typeof e == "string")) throw new Q("schema");
	return e;
}
async function cy(e, n, r) {
	let i = t.ui?.settings?.settingsValues;
	if (!i || typeof t.api.storeSetting != "function") throw new Q("bookmarkUnsupported");
	let a = await sy();
	if (!r()) return;
	if (a.includes(e) === n) {
		i[iy] = a;
		return;
	}
	let o = n ? [...a, e] : a.filter((t) => t !== e);
	try {
		let e = await t.api.storeSetting(iy, o);
		if (!e.ok) throw new Q("bookmark", e.status);
		i[iy] = o;
	} catch (e) {
		try {
			i[iy] = await sy();
		} catch {}
		throw e;
	}
}
var ly = {
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
}, uy = {
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
}, dy = ly, fy = uy.nodeCategories;
function py(e, t) {
	return t === "zh" ? fy[e.replace(/\./g, "_")] ?? e : e;
}
function my(e, t) {
	let n = t === "zh" ? dy[e.id] : void 0, r = n?.display_name ?? e.title;
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
var hy = ["original", "alphabetical"], gy = /* @__PURE__ */ R((e) => {
	let { t, locale: n } = Z(), r = /* @__PURE__ */ N(""), i = /* @__PURE__ */ P(/* @__PURE__ */ new Set()), a = /* @__PURE__ */ P(/* @__PURE__ */ new Set()), o = /* @__PURE__ */ P([]), [s, c] = Vv("AstroPhoto.Nodes.Sort", hy), l = /* @__PURE__ */ N(null), u = /* @__PURE__ */ P(oy()), d = /* @__PURE__ */ N(!1), f = /* @__PURE__ */ N(), p = /* @__PURE__ */ P(null), m = Y(() => e.resource.state === "ready" ? e.resource.data.map((e) => my(e, n.value)) : []), h = Y(() => new Map(m.value.map((e) => [e.id, e]))), g = !1, _ = (t) => !g && e.active && h.value.has(t), v = Xv(_, (e) => {
		p.value = { error: e };
	});
	Ae(() => {
		g = !0, v.dispose();
	});
	let y = /* @__PURE__ */ P(null), b = /* @__PURE__ */ P(null), x, S = 0;
	L(() => e.homeActivation, () => {
		l.value = null, x = void 0;
	});
	let C = (e) => {
		r.value = e, a.value = /* @__PURE__ */ new Set();
	};
	L(() => e.active, (e, t, n) => {
		if (!e) return;
		let r = () => {
			if (d.value) return;
			let e = oy(), t = u.value;
			t.length === e.length && t.every((t, n) => t === e[n]) || (u.value = e);
		};
		r();
		let i = window.setInterval(r, 500);
		n(() => window.clearInterval(i));
	}, { immediate: !0 }), L([() => e.active, () => e.resource], ([e, t]) => {
		v.cancel(), p.value = null, e && t.state === "ready" || (f.value = void 0), t.state === "ready" && l.value && !h.value.has(l.value) && (l.value = null, x = void 0);
	}, { flush: "sync" });
	async function w(e, t) {
		_(e) && (x = t, l.value = e, await In(), _(e) && l.value === e && y.value?.focus());
	}
	async function T() {
		l.value = null, await In(), g || !e.active || l.value || (x?.isConnected ? x.focus({ preventScroll: !0 }) : b.value?.querySelector("input[type=search]")?.focus(), x = void 0);
	}
	async function E(t, n) {
		if (!_(t) || d.value) return;
		f.value = void 0, d.value = !0;
		let r = e.resource;
		try {
			await cy(n, !u.value.includes(n), () => e.resource === r && _(t));
		} catch (e) {
			f.value = e instanceof Q && e.code === "bookmarkUnsupported" ? "bookmarkUnsupported" : "bookmark";
		} finally {
			u.value = oy(), d.value = !1;
		}
	}
	return () => {
		let { active: g, resource: x, refresh: D } = e, O = [...new Set(m.value.map((e) => e.category))], k = O.filter((e) => o.value.includes(e)), ee = (e) => e === "Assets" ? t("nav.assets") : py(e, n.value), A = (e) => e.split("/").filter((e, t) => e && (t !== 0 || e !== "AstroPhoto")).map(ee).join(" / ") || t("nodes.uncategorized"), j = r.value.trim().toLocaleLowerCase(), te = m.value.filter((e) => (k.length === 0 || k.includes(e.category)) && [
			e.id,
			e.title,
			e.category,
			A(e.category),
			...e.aliases,
			e.description
		].join(" ").toLocaleLowerCase().includes(j)), ne = ty(te, s.value === "alphabetical" ? (e, t) => e.localeCompare(t, n.value) : void 0, ee), re = new Set(te.map((e) => e.id)), ie = [...new Set(u.value)].flatMap((e) => {
			if (e.endsWith("/")) return [];
			let t = h.value.get(e.slice(e.lastIndexOf("/") + 1));
			return t && re.has(t.id) ? [{
				...t,
				bookmarkPath: e
			}] : [];
		}), ae = (e, t) => {
			let n = j ? a : i, r = new Set(n.value);
			(j ? !t : t) ? r.add(e) : r.delete(e), n.value = r;
		}, oe = l.value ? h.value.get(l.value) : void 0, se = (e) => {
			if (_(e)) try {
				Wv(e), p.value = { error: null };
			} catch (e) {
				p.value = { error: e };
			}
		}, ce = {
			isExpanded: (e) => j ? !a.value.has(e) : i.value.has(e),
			setExpanded: ae,
			selectNode: w,
			startDrag: v.start,
			previewEnabled: g && !oe,
			isBookmarked: (e) => u.value.includes(e),
			toggleBookmark: E,
			bookmarkPending: d.value,
			bookmarkLabel: (e) => t(e ? "nodes.removeBookmark" : "nodes.addBookmark")
		};
		return G(B, null, [
			G("div", {
				class: "ap-search-toolbar",
				ref: b,
				hidden: x.state !== "ready"
			}, [
				G(zv, {
					label: t("nodes.search"),
					clearLabel: t("browse.clear"),
					onSearch: C
				}, null),
				G(Bv, {
					icon: "filter",
					label: t("browse.filter"),
					multiple: !0,
					disabled: O.length === 0,
					options: [{
						id: "all",
						label: t("browse.allCategories"),
						checked: k.length === 0,
						select: () => o.value = []
					}, ...O.map((e) => ({
						id: `category:${e}`,
						label: A(e),
						checked: k.includes(e),
						select: () => {
							o.value = k.includes(e) ? k.filter((t) => t !== e) : [...k, e];
						}
					}))]
				}, null),
				G(Bv, {
					icon: "sort",
					label: t("browse.sort"),
					options: hy.map((e) => ({
						id: e,
						label: t(`browse.${e}`),
						checked: s.value === e,
						select: () => c(e)
					}))
				}, null)
			]),
			x.state === "loading" && G("p", { role: "status" }, [t("states.loading")]),
			x.state === "error" && G(Hv, {
				error: x.error,
				retry: D
			}, null),
			x.state === "ready" && G(B, null, [G("div", {
				hidden: !!oe,
				class: "ap-scroll",
				ref: (e) => {
					e instanceof HTMLElement && !oe && g && (e.scrollTop = S);
				},
				onScroll: (e) => {
					g && !oe && (S = e.currentTarget.scrollTop);
				}
			}, [
				G("h3", { class: "ap-bookmarks-heading" }, [t("nodes.bookmarks")]),
				ie.length === 0 ? G("div", { class: "ap-bookmarks-empty" }, [t("nodes.noBookmarks")]) : G(ry, J({ entries: ty(ie) }, ce), null),
				m.value.length === 0 ? G("p", null, [t("nodes.empty")]) : te.length === 0 ? G("p", null, [t("nodes.noResults")]) : G(ry, J({ entries: ne }, ce), null)
			]), oe && G("div", { class: "ap-scroll" }, [
				G("button", {
					ref: y,
					onClick: T
				}, [t("actions.back")]),
				G("h2", null, [oe.title]),
				G("code", null, [oe.id]),
				G("p", null, [oe.description || t("nodes.noDescription")]),
				G("p", null, [t("nodes.registered")]),
				G("h3", null, [t("nodes.inputs")]),
				G("dl", null, [oe.inputs.map(([e, t]) => G("div", { key: e }, [G("dt", null, [e]), G("dd", null, [t])]))]),
				G("h3", null, [t("nodes.outputs")]),
				G("dl", null, [oe.outputs.map(([e, t]) => G("div", { key: e }, [G("dt", null, [e]), G("dd", null, [t])]))]),
				G("p", null, [t("nodes.dependencies")]),
				G("p", null, [t("nodes.helpUnavailable")]),
				G("button", { onClick: () => se(oe.id) }, [t("nodes.add")])
			])]),
			x.state === "ready" && f.value && G("p", { role: "alert" }, [t(`errors.${f.value}`)]),
			x.state === "ready" && p.value && (p.value.error instanceof Error && p.value.error.message === "CANVAS_UNSUPPORTED" ? G("p", { role: "alert" }, [t("nodes.canvasUnsupported")]) : p.value.error ? G(Hv, { error: p.value.error }, null) : G("p", { role: "status" }, [t("nodes.created")]))
		]);
	};
}, { props: [
	"active",
	"resource",
	"refresh",
	"homeActivation"
] }), _y = "/astrophoto/v1", vy = (e, t) => `${_y}/library/${e}${t === void 0 ? "" : "/" + encodeURIComponent(t)}`, yy = (e) => e == null || typeof e == "string", by = (e) => Array.isArray(e) && e.every((e) => typeof e == "string"), xy = (e) => $(e) && Object.values(e).every((e) => yy(e) || by(e) || typeof e == "number" && Number.isFinite(e)), Sy = (e) => typeof e.asset_id == "string" || typeof e.collection_id == "string", Cy = {
	assets: (e) => typeof e.name == "string" && typeof e.size_bytes == "number" && (e.storage_mode === "external_reference" || e.storage_mode === "managed") && yy(e.workspace_id) && typeof e.available == "boolean" && xy(e.attributes),
	projects: (e) => typeof e.name == "string" && yy(e.target) && yy(e.notes),
	collections: (e) => typeof e.name == "string" && by(e.asset_ids) && yy(e.calibration_folder_id) && (e.calibration_eligible === void 0 || typeof e.calibration_eligible == "boolean"),
	folders: (e) => typeof e.name == "string" && yy(e.project_id) && yy(e.parent_id),
	sessions: (e) => typeof e.name == "string" && by(e.asset_ids) && yy(e.notes),
	masters: (e) => typeof e.asset_id == "string" && yy(e.folder_id) && yy(e.method) && yy(e.source_asset_id),
	assignments: (e) => Sy(e) && typeof e.master_id == "string",
	placements: (e) => Sy(e) && typeof e.project_id == "string" && yy(e.folder_id)
};
function wy(e, t) {
	if (!$(t) || typeof t.id != "string" || !Number.isSafeInteger(t.revision) || !Cy[e](t)) throw new Q("schema");
	return t;
}
async function Ty(e, t, n) {
	let r = new URLSearchParams();
	for (let [e, n] of Object.entries(t)) n && r.set(e, n);
	let i = await Ff(vy(e) + "?" + r, n, "no-store");
	if (!$(i) || !Array.isArray(i.items) || i.next !== null && typeof i.next != "string") throw new Q("schema");
	return {
		items: i.items.map((t) => wy(e, t)),
		next: i.next
	};
}
async function Ey(e, t, n) {
	let r = [], i = /* @__PURE__ */ new Set(), a = null;
	do {
		let o = await Ty(e, {
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
async function Dy(e, t, n) {
	return wy(e, await Ff(vy(e, t), n, "no-store"));
}
async function Oy(e, t, n, r) {
	return wy(e, await If(vy(e, r?.id), r ? "PATCH" : "POST", r ? {
		...t,
		revision: r.revision
	} : t, n));
}
async function ky(e, t, n, r = {}) {
	await If(vy(e, t.id), "DELETE", {
		...r,
		revision: t.revision
	}, n);
}
async function Ay(e, t) {
	await If(vy("assignments", "batch"), "POST", e, t);
}
async function jy(e, t) {
	let n = await If(_y + "/assets/import/preview", "POST", e, t, 6e4);
	if (!$(n) || typeof n.file_count != "number" || typeof n.failed != "number" || typeof n.size_bytes != "number" || typeof n.preview_id != "string") throw new Q("schema");
	return n;
}
async function My(e, n, r) {
	let i;
	try {
		i = await t.api.fetchApi(_y + "/library/uploads/" + e, {
			method: "PUT",
			signal: r,
			body: n,
			headers: {
				"X-AstroPhoto-Local": "1",
				"X-AstroPhoto-Filename": encodeURIComponent(n.name)
			}
		});
	} catch (e) {
		throw r.aborted ? e : new Q("network");
	}
	let a = await i.json().catch(() => null);
	if (!i.ok) throw new Q($(a?.error) && typeof a.error.code == "string" ? a.error.code : "http", i.status);
	if (!$(a) || a.upload_id !== e) throw new Q("schema");
	return e;
}
function Ny(e) {
	return If(_y + "/library/uploads/" + encodeURIComponent(e), "DELETE");
}
async function Py(e, t, n) {
	await If(`${_y}/assets/${encodeURIComponent(e)}/relocate`, "POST", { new_path: t }, n);
}
async function Fy(e, t) {
	await If(vy("assets", e.id) + "/delete-file", "POST", {
		revision: e.revision,
		confirmed: !0
	}, t);
}
async function Iy(e) {
	let t = await Ff(_y + "/library/approvals", e, "no-store");
	if (!$(t) || !Array.isArray(t.items) || !t.items.every((e) => $(e) && typeof e.id == "string" && typeof e.status == "string" && typeof e.method == "string" && typeof e.kind == "string" && yy(e.record_id) && $(e.payload))) throw new Q("schema");
	return t.items;
}
async function Ly(e, t, n) {
	await If(_y + "/library/approvals/" + encodeURIComponent(e), "POST", { approved: t }, n);
}
// src/shared/useResource.ts
function Ry(e, t = !1) {
	let n = /* @__PURE__ */ P({ state: "loading" }), r = /* @__PURE__ */ P(0), i;
	return L([() => F(e), r], ([e], r, a) => {
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
function zy({ items: e, active: t, prefix: n, label: r, title: i, select: a, dragOver: o }) {
	return G("div", { class: "ap-tab-scroll" }, [G("div", {
		class: "ap-tabs",
		role: "tablist",
		"aria-label": r
	}, [e.map((r, s) => G("button", {
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
function By(e) {
	var t, n, r = "";
	if (typeof e == "string" || typeof e == "number") r += e;
	else if (typeof e == "object") {
		if (Array.isArray(e)) {
			var i = e.length;
			for (t = 0; t < i; t++) e[t] && (n = By(e[t])) && (r && (r += " "), r += n);
		} else for (n in e) e[n] && (r && (r += " "), r += n);
	}
	return r;
}
function Vy() {
	for (var e, t, n = 0, r = "", i = arguments.length; n < i; n++) (e = arguments[n]) && (t = By(e)) && (r && (r += " "), r += t);
	return r;
}
// node_modules/.pnpm/cva@1.0.0-beta.4_typescript@6.0.3/node_modules/cva/dist/index.mjs
var Hy = (e) => typeof e == "boolean" ? `${e}` : e === 0 ? "0" : e, { compose: Uy, cva: Wy, cx: Gy } = ((e) => {
	let t = function() {
		var t = [...arguments];
		return e?.hooks?.["cx:done"] === void 0 ? e?.hooks?.onComplete === void 0 ? Vy(t) : e?.hooks.onComplete(Vy(t)) : e?.hooks["cx:done"](Vy(t));
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
				let t = n?.[e], a = i?.[e], o = Hy(t) || Hy(a);
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
})(), Ky = Wy({
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
}), qy = Wy({
	base: "flex cursor-pointer items-center px-2 outline-none hover:bg-accent",
	variants: { layout: {
		multi: "h-10 shrink-0 gap-2 rounded-lg data-highlighted:bg-muted data-highlighted:hover:bg-muted",
		single: "relative w-full justify-between gap-3 rounded-sm py-3 text-sm select-none focus:bg-accent data-[state=checked]:bg-muted data-[state=checked]:hover:bg-muted"
	} },
	defaultVariants: { layout: "multi" }
}), Jy = "z-overlay overflow-hidden rounded-lg p-2 bg-background text-foreground border border-solid shadow-md data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2", Yy = "flex shrink-0 cursor-pointer items-center justify-center pl-3", Xy = "px-3 pb-4 text-sm text-muted-foreground", Zy = "flex size-3.5 items-center justify-center rounded-full bg-foreground text-[9px] font-semibold text-background";
function Qy(e) {
	e.key === "Escape" && (e.stopPropagation(), e.stopImmediatePropagation());
}
// src/vendor/comfyui/composables/useAttrsClass.ts
function $y() {
	let e = ci();
	return {
		attrsClass: Y(() => e.class),
		attrsWithoutClass: Y(() => {
			let { class: t, ...n } = e;
			return n;
		})
	};
}
// src/vendor/comfyui/composables/usePopoverSizing.ts
function eb(e) {
	return Y(() => {
		let { minWidth: t, maxWidth: n } = e, r = {};
		return t && (r.minWidth = t), n && (r.maxWidth = n), r;
	});
}
// node_modules/.pnpm/tailwind-merge@2.6.1/node_modules/tailwind-merge/dist/bundle-mjs.mjs
var tb = "-", nb = (e) => {
	let t = ob(e), { conflictingClassGroups: n, conflictingClassGroupModifiers: r } = e;
	return {
		getClassGroupId: (e) => {
			let n = e.split(tb);
			return n[0] === "" && n.length !== 1 && n.shift(), rb(n, t) || ab(e);
		},
		getConflictingClassGroupIds: (e, t) => {
			let i = n[e] || [];
			return t && r[e] ? [...i, ...r[e]] : i;
		}
	};
}, rb = (e, t) => {
	if (e.length === 0) return t.classGroupId;
	let n = e[0], r = t.nextPart.get(n), i = r ? rb(e.slice(1), r) : void 0;
	if (i) return i;
	if (t.validators.length === 0) return;
	let a = e.join(tb);
	return t.validators.find(({ validator: e }) => e(a))?.classGroupId;
}, ib = /^\[(.+)\]$/, ab = (e) => {
	if (ib.test(e)) {
		let t = ib.exec(e)[1], n = t?.substring(0, t.indexOf(":"));
		if (n) return "arbitrary.." + n;
	}
}, ob = (e) => {
	let { theme: t, prefix: n } = e, r = {
		nextPart: /* @__PURE__ */ new Map(),
		validators: []
	};
	return ub(Object.entries(e.classGroups), n).forEach(([e, n]) => {
		sb(n, r, e, t);
	}), r;
}, sb = (e, t, n, r) => {
	e.forEach((e) => {
		if (typeof e == "string") {
			let r = e === "" ? t : cb(t, e);
			r.classGroupId = n;
		} else if (typeof e == "function") {
			if (lb(e)) {
				sb(e(r), t, n, r);
				return;
			}
			t.validators.push({
				validator: e,
				classGroupId: n
			});
		} else Object.entries(e).forEach(([e, i]) => {
			sb(i, cb(t, e), n, r);
		});
	});
}, cb = (e, t) => {
	let n = e;
	return t.split(tb).forEach((e) => {
		n.nextPart.has(e) || n.nextPart.set(e, {
			nextPart: /* @__PURE__ */ new Map(),
			validators: []
		}), n = n.nextPart.get(e);
	}), n;
}, lb = (e) => e.isThemeGetter, ub = (e, t) => t ? e.map(([e, n]) => [e, n.map((e) => typeof e == "string" ? t + e : typeof e == "object" ? Object.fromEntries(Object.entries(e).map(([e, n]) => [t + e, n])) : e)]) : e, db = (e) => {
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
}, fb = "!", pb = (e) => {
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
		let l = n.length === 0 ? e : e.substring(s), u = l.startsWith(fb);
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
}, mb = (e) => {
	if (e.length <= 1) return e;
	let t = [], n = [];
	return e.forEach((e) => {
		e[0] === "[" ? (t.push(...n.sort(), e), n = []) : n.push(e);
	}), t.push(...n.sort()), t;
}, hb = (e) => ({
	cache: db(e.cacheSize),
	parseClassName: pb(e),
	...nb(e)
}), gb = /\s+/, _b = (e, t) => {
	let { parseClassName: n, getClassGroupId: r, getConflictingClassGroupIds: i } = t, a = [], o = e.trim().split(gb), s = "";
	for (let e = o.length - 1; e >= 0; --e) {
		let t = o[e], { modifiers: c, hasImportantModifier: l, baseClassName: u, maybePostfixModifierPosition: d } = n(t), f = !!d, p = r(f ? u.substring(0, d) : u);
		if (!p) {
			if (!f || (p = r(u), !p)) {
				s = t + (s.length > 0 ? " " + s : s);
				continue;
			}
			f = !1;
		}
		let m = mb(c).join(":"), h = l ? m + fb : m, g = h + p;
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
function vb() {
	let e = 0, t, n, r = "";
	for (; e < arguments.length;) (t = arguments[e++]) && (n = yb(t)) && (r && (r += " "), r += n);
	return r;
}
var yb = (e) => {
	if (typeof e == "string") return e;
	let t, n = "";
	for (let r = 0; r < e.length; r++) e[r] && (t = yb(e[r])) && (n && (n += " "), n += t);
	return n;
};
function bb(e, ...t) {
	let n, r, i, a = o;
	function o(o) {
		return n = hb(t.reduce((e, t) => t(e), e())), r = n.cache.get, i = n.cache.set, a = s, s(o);
	}
	function s(e) {
		let t = r(e);
		if (t) return t;
		let a = _b(e, n);
		return i(e, a), a;
	}
	return function() {
		return a(vb.apply(null, arguments));
	};
}
var xb = (e) => {
	let t = (t) => t[e] || [];
	return t.isThemeGetter = !0, t;
}, Sb = /^\[(?:([a-z-]+):)?(.+)\]$/i, Cb = /^\d+\/\d+$/, wb = /*#__PURE__*/ new Set([
	"px",
	"full",
	"screen"
]), Tb = /^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/, Eb = /\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/, Db = /^(rgba?|hsla?|hwb|(ok)?(lab|lch)|color-mix)\(.+\)$/, Ob = /^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/, kb = /^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/, Ab = (e) => Mb(e) || wb.has(e) || Cb.test(e), jb = (e) => Gb(e, "length", Kb), Mb = (e) => !!e && !Number.isNaN(Number(e)), Nb = (e) => Gb(e, "number", Mb), Pb = (e) => !!e && Number.isInteger(Number(e)), Fb = (e) => e.endsWith("%") && Mb(e.slice(0, -1)), Ib = (e) => Sb.test(e), Lb = (e) => Tb.test(e), Rb = /*#__PURE__*/ new Set([
	"length",
	"size",
	"percentage"
]), zb = (e) => Gb(e, Rb, qb), Bb = (e) => Gb(e, "position", qb), Vb = /*#__PURE__*/ new Set(["image", "url"]), Hb = (e) => Gb(e, Vb, Yb), Ub = (e) => Gb(e, "", Jb), Wb = () => !0, Gb = (e, t, n) => {
	let r = Sb.exec(e);
	return r ? r[1] ? typeof t == "string" ? r[1] === t : t.has(r[1]) : n(r[2]) : !1;
}, Kb = (e) => Eb.test(e) && !Db.test(e), qb = () => !1, Jb = (e) => Ob.test(e), Yb = (e) => kb.test(e), Xb = () => {
	let e = xb("colors"), t = xb("spacing"), n = xb("blur"), r = xb("brightness"), i = xb("borderColor"), a = xb("borderRadius"), o = xb("borderSpacing"), s = xb("borderWidth"), c = xb("contrast"), l = xb("grayscale"), u = xb("hueRotate"), d = xb("invert"), f = xb("gap"), p = xb("gradientColorStops"), m = xb("gradientColorStopPositions"), h = xb("inset"), g = xb("margin"), _ = xb("opacity"), v = xb("padding"), y = xb("saturate"), b = xb("scale"), x = xb("sepia"), S = xb("skew"), C = xb("space"), w = xb("translate"), T = () => [
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
		Ib,
		t
	], O = () => [Ib, t], k = () => [
		"",
		Ab,
		jb
	], ee = () => [
		"auto",
		Mb,
		Ib
	], A = () => [
		"bottom",
		"center",
		"left",
		"left-bottom",
		"left-top",
		"right",
		"right-bottom",
		"right-top",
		"top"
	], j = () => [
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
	], ne = () => [
		"start",
		"end",
		"center",
		"between",
		"around",
		"evenly",
		"stretch"
	], re = () => [
		"",
		"0",
		Ib
	], ie = () => [
		"auto",
		"avoid",
		"all",
		"avoid-page",
		"page",
		"left",
		"right",
		"column"
	], ae = () => [Mb, Ib];
	return {
		cacheSize: 500,
		separator: ":",
		theme: {
			colors: [Wb],
			spacing: [Ab, jb],
			blur: [
				"none",
				"",
				Lb,
				Ib
			],
			brightness: ae(),
			borderColor: [e],
			borderRadius: [
				"none",
				"",
				"full",
				Lb,
				Ib
			],
			borderSpacing: O(),
			borderWidth: k(),
			contrast: ae(),
			grayscale: re(),
			hueRotate: ae(),
			invert: re(),
			gap: O(),
			gradientColorStops: [e],
			gradientColorStopPositions: [Fb, jb],
			inset: D(),
			margin: D(),
			opacity: ae(),
			padding: O(),
			saturate: ae(),
			scale: ae(),
			sepia: re(),
			skew: ae(),
			space: O(),
			translate: O()
		},
		classGroups: {
			aspect: [{ aspect: [
				"auto",
				"square",
				"video",
				Ib
			] }],
			container: ["container"],
			columns: [{ columns: [Lb] }],
			"break-after": [{ "break-after": ie() }],
			"break-before": [{ "break-before": ie() }],
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
			"object-position": [{ object: [...A(), Ib] }],
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
				Pb,
				Ib
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
				Ib
			] }],
			grow: [{ grow: re() }],
			shrink: [{ shrink: re() }],
			order: [{ order: [
				"first",
				"last",
				"none",
				Pb,
				Ib
			] }],
			"grid-cols": [{ "grid-cols": [Wb] }],
			"col-start-end": [{ col: [
				"auto",
				{ span: [
					"full",
					Pb,
					Ib
				] },
				Ib
			] }],
			"col-start": [{ "col-start": ee() }],
			"col-end": [{ "col-end": ee() }],
			"grid-rows": [{ "grid-rows": [Wb] }],
			"row-start-end": [{ row: [
				"auto",
				{ span: [Pb, Ib] },
				Ib
			] }],
			"row-start": [{ "row-start": ee() }],
			"row-end": [{ "row-end": ee() }],
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
				Ib
			] }],
			"auto-rows": [{ "auto-rows": [
				"auto",
				"min",
				"max",
				"fr",
				Ib
			] }],
			gap: [{ gap: [f] }],
			"gap-x": [{ "gap-x": [f] }],
			"gap-y": [{ "gap-y": [f] }],
			"justify-content": [{ justify: ["normal", ...ne()] }],
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
				...ne(),
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
			"place-content": [{ "place-content": [...ne(), "baseline"] }],
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
				Ib,
				t
			] }],
			"min-w": [{ "min-w": [
				Ib,
				t,
				"min",
				"max",
				"fit"
			] }],
			"max-w": [{ "max-w": [
				Ib,
				t,
				"none",
				"full",
				"min",
				"max",
				"fit",
				"prose",
				{ screen: [Lb] },
				Lb
			] }],
			h: [{ h: [
				Ib,
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
				Ib,
				t,
				"min",
				"max",
				"fit",
				"svh",
				"lvh",
				"dvh"
			] }],
			"max-h": [{ "max-h": [
				Ib,
				t,
				"min",
				"max",
				"fit",
				"svh",
				"lvh",
				"dvh"
			] }],
			size: [{ size: [
				Ib,
				t,
				"auto",
				"min",
				"max",
				"fit"
			] }],
			"font-size": [{ text: [
				"base",
				Lb,
				jb
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
				Nb
			] }],
			"font-family": [{ font: [Wb] }],
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
				Ib
			] }],
			"line-clamp": [{ "line-clamp": [
				"none",
				Mb,
				Nb
			] }],
			leading: [{ leading: [
				"none",
				"tight",
				"snug",
				"normal",
				"relaxed",
				"loose",
				Ab,
				Ib
			] }],
			"list-image": [{ "list-image": ["none", Ib] }],
			"list-style-type": [{ list: [
				"none",
				"disc",
				"decimal",
				Ib
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
			"text-decoration-style": [{ decoration: [...j(), "wavy"] }],
			"text-decoration-thickness": [{ decoration: [
				"auto",
				"from-font",
				Ab,
				jb
			] }],
			"underline-offset": [{ "underline-offset": [
				"auto",
				Ab,
				Ib
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
				Ib
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
			content: [{ content: ["none", Ib] }],
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
			"bg-position": [{ bg: [...A(), Bb] }],
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
				zb
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
				Hb
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
			"border-style": [{ border: [...j(), "hidden"] }],
			"divide-x": [{ "divide-x": [s] }],
			"divide-x-reverse": ["divide-x-reverse"],
			"divide-y": [{ "divide-y": [s] }],
			"divide-y-reverse": ["divide-y-reverse"],
			"divide-opacity": [{ "divide-opacity": [_] }],
			"divide-style": [{ divide: j() }],
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
			"outline-style": [{ outline: ["", ...j()] }],
			"outline-offset": [{ "outline-offset": [Ab, Ib] }],
			"outline-w": [{ outline: [Ab, jb] }],
			"outline-color": [{ outline: [e] }],
			"ring-w": [{ ring: k() }],
			"ring-w-inset": ["ring-inset"],
			"ring-color": [{ ring: [e] }],
			"ring-opacity": [{ "ring-opacity": [_] }],
			"ring-offset-w": [{ "ring-offset": [Ab, jb] }],
			"ring-offset-color": [{ "ring-offset": [e] }],
			shadow: [{ shadow: [
				"",
				"inner",
				"none",
				Lb,
				Ub
			] }],
			"shadow-color": [{ shadow: [Wb] }],
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
				Lb,
				Ib
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
				Ib
			] }],
			duration: [{ duration: ae() }],
			ease: [{ ease: [
				"linear",
				"in",
				"out",
				"in-out",
				Ib
			] }],
			delay: [{ delay: ae() }],
			animate: [{ animate: [
				"none",
				"spin",
				"ping",
				"pulse",
				"bounce",
				Ib
			] }],
			transform: [{ transform: [
				"",
				"gpu",
				"none"
			] }],
			scale: [{ scale: [b] }],
			"scale-x": [{ "scale-x": [b] }],
			"scale-y": [{ "scale-y": [b] }],
			rotate: [{ rotate: [Pb, Ib] }],
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
				Ib
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
				Ib
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
				Ib
			] }],
			fill: [{ fill: [e, "none"] }],
			"stroke-w": [{ stroke: [
				Ab,
				jb,
				Nb
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
}, Zb = (e, { cacheSize: t, prefix: n, separator: r, experimentalParseClassName: i, extend: a = {}, override: o = {} }) => {
	Qb(e, "cacheSize", t), Qb(e, "prefix", n), Qb(e, "separator", r), Qb(e, "experimentalParseClassName", i);
	for (let t in o) $b(e[t], o[t]);
	for (let t in a) ex(e[t], a[t]);
	return e;
}, Qb = (e, t, n) => {
	n !== void 0 && (e[t] = n);
}, $b = (e, t) => {
	if (t) for (let n in t) Qb(e, n, t[n]);
}, ex = (e, t) => {
	if (t) for (let n in t) {
		let r = t[n];
		r !== void 0 && (e[n] = (e[n] || []).concat(r));
	}
}, tx = ((e, ...t) => typeof e == "function" ? bb(Xb, e, ...t) : bb(() => Zb(Xb(), e), ...t))({ extend: { classGroups: {
	"font-size": ["text-xxs", "text-xxxs"],
	"max-h": [{ "max-h": ["none"] }]
} } });
function nx(...e) {
	return tx(Vy(e));
}
// node_modules/.pnpm/fuse.js@7.0.0/node_modules/fuse.js/dist/fuse.mjs
function rx(e) {
	return Array.isArray ? Array.isArray(e) : px(e) === "[object Array]";
}
function ix(e) {
	if (typeof e == "string") return e;
	let t = e + "";
	return t == "0" && 1 / e == -Infinity ? "-0" : t;
}
function ax(e) {
	return e == null ? "" : ix(e);
}
function ox(e) {
	return typeof e == "string";
}
function sx(e) {
	return typeof e == "number";
}
function cx(e) {
	return e === !0 || e === !1 || ux(e) && px(e) == "[object Boolean]";
}
function lx(e) {
	return typeof e == "object";
}
function ux(e) {
	return lx(e) && e !== null;
}
function dx(e) {
	return e != null;
}
function fx(e) {
	return !e.trim().length;
}
function px(e) {
	return e == null ? e === void 0 ? "[object Undefined]" : "[object Null]" : Object.prototype.toString.call(e);
}
var mx = "Incorrect 'index' type", hx = (e) => `Invalid value for key ${e}`, gx = (e) => `Pattern length exceeds max of ${e}.`, _x = (e) => `Missing ${e} property in key`, vx = (e) => `Property 'weight' in key '${e}' must be a positive integer`, yx = Object.prototype.hasOwnProperty, bx = class {
	constructor(e) {
		this._keys = [], this._keyMap = {};
		let t = 0;
		e.forEach((e) => {
			let n = xx(e);
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
function xx(e) {
	let t = null, n = null, r = null, i = 1, a = null;
	if (ox(e) || rx(e)) r = e, t = Sx(e), n = Cx(e);
	else {
		if (!yx.call(e, "name")) throw Error(_x("name"));
		let o = e.name;
		if (r = o, yx.call(e, "weight") && (i = e.weight, i <= 0)) throw Error(vx(o));
		t = Sx(o), n = Cx(o), a = e.getFn;
	}
	return {
		path: t,
		id: n,
		weight: i,
		src: r,
		getFn: a
	};
}
function Sx(e) {
	return rx(e) ? e : e.split(".");
}
function Cx(e) {
	return rx(e) ? e.join(".") : e;
}
function wx(e, t) {
	let n = [], r = !1, i = (e, t, a) => {
		if (dx(e)) {
			if (!t[a]) n.push(e);
			else {
				let o = e[t[a]];
				if (!dx(o)) return;
				if (a === t.length - 1 && (ox(o) || sx(o) || cx(o))) n.push(ax(o));
				else if (rx(o)) {
					r = !0;
					for (let e = 0, n = o.length; e < n; e += 1) i(o[e], t, a + 1);
				} else t.length && i(o, t, a + 1);
			}
		}
	};
	return i(e, ox(t) ? t.split(".") : t, 0), r ? n : n[0];
}
var Tx = {
	includeMatches: !1,
	findAllMatches: !1,
	minMatchCharLength: 1
}, Ex = {
	isCaseSensitive: !1,
	includeScore: !1,
	keys: [],
	shouldSort: !0,
	sortFn: (e, t) => e.score === t.score ? e.idx < t.idx ? -1 : 1 : e.score < t.score ? -1 : 1
}, Dx = {
	location: 0,
	threshold: .6,
	distance: 100
}, Ox = {
	useExtendedSearch: !1,
	getFn: wx,
	ignoreLocation: !1,
	ignoreFieldNorm: !1,
	fieldNormWeight: 1
}, kx = {
	...Ex,
	...Tx,
	...Dx,
	...Ox
}, Ax = /[^ ]+/g;
function jx(e = 1, t = 3) {
	let n = /* @__PURE__ */ new Map(), r = 10 ** t;
	return {
		get(t) {
			let i = t.match(Ax).length;
			if (n.has(i)) return n.get(i);
			let a = 1 / i ** (.5 * e), o = parseFloat(Math.round(a * r) / r);
			return n.set(i, o), o;
		},
		clear() {
			n.clear();
		}
	};
}
var Mx = class {
	constructor({ getFn: e = kx.getFn, fieldNormWeight: t = kx.fieldNormWeight } = {}) {
		this.norm = jx(t, 3), this.getFn = e, this.isCreated = !1, this.setIndexRecords();
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
		!this.isCreated && this.docs.length && (this.isCreated = !0, ox(this.docs[0]) ? this.docs.forEach((e, t) => {
			this._addString(e, t);
		}) : this.docs.forEach((e, t) => {
			this._addObject(e, t);
		}), this.norm.clear());
	}
	add(e) {
		let t = this.size();
		ox(e) ? this._addString(e, t) : this._addObject(e, t);
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
		if (!dx(e) || fx(e)) return;
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
			if (dx(i)) {
				if (rx(i)) {
					let e = [], t = [{
						nestedArrIndex: -1,
						value: i
					}];
					for (; t.length;) {
						let { nestedArrIndex: n, value: r } = t.pop();
						if (dx(r)) {
							if (ox(r) && !fx(r)) {
								let t = {
									v: r,
									i: n,
									n: this.norm.get(r)
								};
								e.push(t);
							} else rx(r) && r.forEach((e, n) => {
								t.push({
									nestedArrIndex: n,
									value: e
								});
							});
						}
					}
					n.$[r] = e;
				} else if (ox(i) && !fx(i)) {
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
function Nx(e, t, { getFn: n = kx.getFn, fieldNormWeight: r = kx.fieldNormWeight } = {}) {
	let i = new Mx({
		getFn: n,
		fieldNormWeight: r
	});
	return i.setKeys(e.map(xx)), i.setSources(t), i.create(), i;
}
function Px(e, { getFn: t = kx.getFn, fieldNormWeight: n = kx.fieldNormWeight } = {}) {
	let { keys: r, records: i } = e, a = new Mx({
		getFn: t,
		fieldNormWeight: n
	});
	return a.setKeys(r), a.setIndexRecords(i), a;
}
function Fx(e, { errors: t = 0, currentLocation: n = 0, expectedLocation: r = 0, distance: i = kx.distance, ignoreLocation: a = kx.ignoreLocation } = {}) {
	let o = t / e.length;
	if (a) return o;
	let s = Math.abs(r - n);
	return i ? o + s / i : s ? 1 : o;
}
function Ix(e = [], t = kx.minMatchCharLength) {
	let n = [], r = -1, i = -1, a = 0;
	for (let o = e.length; a < o; a += 1) {
		let o = e[a];
		o && r === -1 ? r = a : !o && r !== -1 && (i = a - 1, i - r + 1 >= t && n.push([r, i]), r = -1);
	}
	return e[a - 1] && a - r >= t && n.push([r, a - 1]), n;
}
var Lx = 32;
function Rx(e, t, n, { location: r = kx.location, distance: i = kx.distance, threshold: a = kx.threshold, findAllMatches: o = kx.findAllMatches, minMatchCharLength: s = kx.minMatchCharLength, includeMatches: c = kx.includeMatches, ignoreLocation: l = kx.ignoreLocation } = {}) {
	if (t.length > Lx) throw Error(gx(Lx));
	let u = t.length, d = e.length, f = Math.max(0, Math.min(r, d)), p = a, m = f, h = s > 1 || c, g = h ? Array(d) : [], _;
	for (; (_ = e.indexOf(t, m)) > -1;) {
		let e = Fx(t, {
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
		for (; a < s;) Fx(t, {
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
			if (h && (g[o] = +!!s), S[a] = (S[a + 1] << 1 | 1) & s, r && (S[a] |= (v[a + 1] | v[a]) << 1 | 1 | v[a + 1]), S[a] & x && (y = Fx(t, {
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
		if (Fx(t, {
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
		let e = Ix(g, s);
		e.length ? c && (S.indices = e) : S.isMatch = !1;
	}
	return S;
}
function zx(e) {
	let t = {};
	for (let n = 0, r = e.length; n < r; n += 1) {
		let i = e.charAt(n);
		t[i] = (t[i] || 0) | 1 << r - n - 1;
	}
	return t;
}
var Bx = class {
	constructor(e, { location: t = kx.location, threshold: n = kx.threshold, distance: r = kx.distance, includeMatches: i = kx.includeMatches, findAllMatches: a = kx.findAllMatches, minMatchCharLength: o = kx.minMatchCharLength, isCaseSensitive: s = kx.isCaseSensitive, ignoreLocation: c = kx.ignoreLocation } = {}) {
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
				alphabet: zx(e),
				startIndex: t
			});
		}, u = this.pattern.length;
		if (u > Lx) {
			let e = 0, t = u % Lx, n = u - t;
			for (; e < n;) l(this.pattern.substr(e, Lx), e), e += Lx;
			if (t) {
				let e = u - Lx;
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
			let { isMatch: m, score: h, indices: g } = Rx(e, t, f, {
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
}, Vx = class {
	constructor(e) {
		this.pattern = e;
	}
	static isMultiMatch(e) {
		return Hx(e, this.multiRegex);
	}
	static isSingleMatch(e) {
		return Hx(e, this.singleRegex);
	}
	search() {}
};
function Hx(e, t) {
	let n = e.match(t);
	return n ? n[1] : null;
}
var Ux = class extends Vx {
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
}, Wx = class extends Vx {
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
}, Gx = class extends Vx {
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
}, Kx = class extends Vx {
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
}, qx = class extends Vx {
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
}, Jx = class extends Vx {
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
}, Yx = class extends Vx {
	constructor(e, { location: t = kx.location, threshold: n = kx.threshold, distance: r = kx.distance, includeMatches: i = kx.includeMatches, findAllMatches: a = kx.findAllMatches, minMatchCharLength: o = kx.minMatchCharLength, isCaseSensitive: s = kx.isCaseSensitive, ignoreLocation: c = kx.ignoreLocation } = {}) {
		super(e), this._bitapSearch = new Bx(e, {
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
}, Xx = class extends Vx {
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
}, Zx = [
	Ux,
	Xx,
	Gx,
	Kx,
	Jx,
	qx,
	Wx,
	Yx
], Qx = Zx.length, $x = / +(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)/, eS = "|";
function tS(e, t = {}) {
	return e.split(eS).map((e) => {
		let n = e.trim().split($x).filter((e) => e && !!e.trim()), r = [];
		for (let e = 0, i = n.length; e < i; e += 1) {
			let i = n[e], a = !1, o = -1;
			for (; !a && ++o < Qx;) {
				let e = Zx[o], n = e.isMultiMatch(i);
				n && (r.push(new e(n, t)), a = !0);
			}
			if (!a) for (o = -1; ++o < Qx;) {
				let e = Zx[o], n = e.isSingleMatch(i);
				if (n) {
					r.push(new e(n, t));
					break;
				}
			}
		}
		return r;
	});
}
var nS = /* @__PURE__ */ new Set([Yx.type, Xx.type]), rS = class {
	constructor(e, { isCaseSensitive: t = kx.isCaseSensitive, includeMatches: n = kx.includeMatches, minMatchCharLength: r = kx.minMatchCharLength, ignoreLocation: i = kx.ignoreLocation, findAllMatches: a = kx.findAllMatches, location: o = kx.location, threshold: s = kx.threshold, distance: c = kx.distance } = {}) {
		this.query = null, this.options = {
			isCaseSensitive: t,
			includeMatches: n,
			minMatchCharLength: r,
			findAllMatches: a,
			ignoreLocation: i,
			location: o,
			threshold: s,
			distance: c
		}, this.pattern = t ? e : e.toLowerCase(), this.query = tS(this.pattern, this.options);
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
						nS.has(e) ? a = [...a, ...l] : a.push(l);
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
}, iS = [];
function aS(...e) {
	iS.push(...e);
}
function oS(e, t) {
	for (let n = 0, r = iS.length; n < r; n += 1) {
		let r = iS[n];
		if (r.condition(e, t)) return new r(e, t);
	}
	return new Bx(e, t);
}
var sS = {
	AND: "$and",
	OR: "$or"
}, cS = {
	PATH: "$path",
	PATTERN: "$val"
}, lS = (e) => !!(e[sS.AND] || e[sS.OR]), uS = (e) => !!e[cS.PATH], dS = (e) => !rx(e) && lx(e) && !lS(e), fS = (e) => ({ [sS.AND]: Object.keys(e).map((t) => ({ [t]: e[t] })) });
function pS(e, t, { auto: n = !0 } = {}) {
	let r = (e) => {
		let i = Object.keys(e), a = uS(e);
		if (!a && i.length > 1 && !lS(e)) return r(fS(e));
		if (dS(e)) {
			let r = a ? e[cS.PATH] : i[0], o = a ? e[cS.PATTERN] : e[r];
			if (!ox(o)) throw Error(hx(r));
			let s = {
				keyId: Cx(r),
				pattern: o
			};
			return n && (s.searcher = oS(o, t)), s;
		}
		let o = {
			children: [],
			operator: i[0]
		};
		return i.forEach((t) => {
			let n = e[t];
			rx(n) && n.forEach((e) => {
				o.children.push(r(e));
			});
		}), o;
	};
	return lS(e) || (e = fS(e)), r(e);
}
function mS(e, { ignoreFieldNorm: t = kx.ignoreFieldNorm }) {
	e.forEach((e) => {
		let n = 1;
		e.matches.forEach(({ key: e, norm: r, score: i }) => {
			let a = e ? e.weight : null;
			n *= (i === 0 && a ? 2 ** -52 : i) ** +((a || 1) * (t ? 1 : r));
		}), e.score = n;
	});
}
function hS(e, t) {
	let n = e.matches;
	t.matches = [], dx(n) && n.forEach((e) => {
		if (!dx(e.indices) || !e.indices.length) return;
		let { indices: n, value: r } = e, i = {
			indices: n,
			value: r
		};
		e.key && (i.key = e.key.src), e.idx > -1 && (i.refIndex = e.idx), t.matches.push(i);
	});
}
function gS(e, t) {
	t.score = e.score;
}
function _S(e, t, { includeMatches: n = kx.includeMatches, includeScore: r = kx.includeScore } = {}) {
	let i = [];
	return n && i.push(hS), r && i.push(gS), e.map((e) => {
		let { idx: n } = e, r = {
			item: t[n],
			refIndex: n
		};
		return i.length && i.forEach((t) => {
			t(e, r);
		}), r;
	});
}
var vS = class {
	constructor(e, t = {}, n) {
		this.options = {
			...kx,
			...t
		}, this.options.useExtendedSearch, this._keyStore = new bx(this.options.keys), this.setCollection(e, n);
	}
	setCollection(e, t) {
		if (this._docs = e, t && !(t instanceof Mx)) throw Error(mx);
		this._myIndex = t || Nx(this.options.keys, this._docs, {
			getFn: this.options.getFn,
			fieldNormWeight: this.options.fieldNormWeight
		});
	}
	add(e) {
		dx(e) && (this._docs.push(e), this._myIndex.add(e));
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
		let { includeMatches: n, includeScore: r, shouldSort: i, sortFn: a, ignoreFieldNorm: o } = this.options, s = ox(e) ? ox(this._docs[0]) ? this._searchStringList(e) : this._searchObjectList(e) : this._searchLogical(e);
		return mS(s, { ignoreFieldNorm: o }), i && s.sort(a), sx(t) && t > -1 && (s = s.slice(0, t)), _S(s, this._docs, {
			includeMatches: n,
			includeScore: r
		});
	}
	_searchStringList(e) {
		let t = oS(e, this.options), { records: n } = this._myIndex, r = [];
		return n.forEach(({ v: e, i: n, n: i }) => {
			if (!dx(e)) return;
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
		let t = pS(e, this.options), n = (e, t, r) => {
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
				else if (e.operator === sS.AND) return [];
			}
			return i;
		}, r = this._myIndex.records, i = {}, a = [];
		return r.forEach(({ $: e, i: r }) => {
			if (dx(e)) {
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
		let t = oS(e, this.options), { keys: n, records: r } = this._myIndex, i = [];
		return r.forEach(({ $: e, i: r }) => {
			if (!dx(e)) return;
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
		if (!dx(t)) return [];
		let r = [];
		if (rx(t)) t.forEach(({ v: t, i, n: a }) => {
			if (!dx(t)) return;
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
vS.version = "7.0.0", vS.createIndex = Nx, vS.parseIndex = Px, vS.config = kx, vS.parseQuery = pS, aS(rS);
// node_modules/.pnpm/@vueuse+integrations@14.4.0_e296e648d81c519b0c065d5abb502518/node_modules/@vueuse/integrations/dist/useFuse.js
function yS(e, t, n) {
	let r = () => new vS(sn(t) ?? [], sn(n)?.fuseOptions), i = /* @__PURE__ */ P(r());
	return L(() => sn(n)?.fuseOptions, () => {
		i.value = r();
	}, { deep: !0 }), L(() => sn(t), (e) => {
		i.value.setCollection(e), on(i);
	}, { deep: !0 }), {
		fuse: i,
		results: Y(() => {
			let r = sn(n);
			if (r?.matchAllWhenSearchEmpty && !sn(e)) return sn(t).map((e, t) => ({
				item: e,
				refIndex: t
			}));
			let a = r?.resultLimit;
			return i.value.search(sn(e), a ? { limit: a } : void 0);
		})
	};
}
// src/vendor/comfyui/select/useSelectSearch.ts
function bS(e, t) {
	let { results: n } = yS(e, t, {
		fuseOptions: {
			keys: ["name", "value"],
			threshold: .3
		},
		matchAllWhenSearchEmpty: !0
	});
	return Y(() => e.value.trim() ? n.value.map(({ item: e }) => e) : sn(t));
}
// src/vendor/comfyui/single-select/SearchableSingleSelect.vue?vue&type=script&setup=true&lang.ts
var xS = {
	key: 0,
	class: "icon-[lucide--loader-circle] shrink-0 animate-spin text-muted-foreground"
}, SS = { class: "truncate" }, CS = { class: "px-2 pt-2" }, wS = { class: "flex items-center gap-2 rounded-lg border px-3 py-1.5" }, TS = { class: "truncate" }, ES = /* @__PURE__ */ R({
	inheritAttrs: !1,
	__name: "SearchableSingleSelect",
	props: /*@__PURE__*/ fi({
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
		let { attrsClass: t, attrsWithoutClass: n } = $y(), r = Mi(e, "modelValue"), i = Er("trigger"), a = /* @__PURE__ */ N(!1), o = /* @__PURE__ */ N(""), s = bS(o, () => e.options), c = Y({
			get: () => e.options.find(({ value: e }) => e === r.value),
			set: (e) => {
				r.value = e?.value;
			}
		});
		L(a, (e) => {
			e || (o.value = "");
		});
		function l(e) {
			e.key === "Tab" ? (mp(i)?.focus(), a.value = !1) : e.key === "Escape" && (Qy(e), a.value = !1);
		}
		let u = eb({
			minWidth: e.popoverMinWidth,
			maxWidth: e.popoverMaxWidth
		});
		return (r, i) => (V(), U(F(I_), {
			modelValue: c.value,
			"onUpdate:modelValue": i[3] ||= (e) => c.value = e,
			open: a.value,
			"onUpdate:open": i[4] ||= (e) => a.value = e,
			by: "value",
			disabled: e.disabled,
			"ignore-filter": ""
		}, {
			default: I(() => [G(F(L_), { "as-child": "" }, {
				default: I(() => [G(F(Y_), J({ ref: "trigger" }, F(n), {
					tabindex: "0",
					"aria-label": e.accessibleLabel,
					"aria-busy": e.loading || void 0,
					"aria-invalid": e.invalid || void 0,
					class: F(nx)(F(Ky)({
						size: e.size,
						border: e.invalid ? "invalid" : "none"
					}), F(t))
				}), {
					default: I(() => [W("div", { class: he(F(nx)("flex flex-1 items-center gap-2 overflow-hidden py-2 pl-2", e.size === "md" ? "text-xs" : "text-sm")) }, [e.loading ? (V(), H("i", xS)) : z(r.$slots, "icon", {}, void 0, void 0, 1), W("span", SS, M(c.value?.name ?? e.label), 1)], 2), W("div", { class: he(F(Yy)) }, [...i[5] ||= [W("i", { class: "icon-[lucide--chevron-down] text-muted-foreground" }, null, -1)]], 2)]),
					_: 3
				}, 16, [
					"aria-label",
					"aria-busy",
					"aria-invalid",
					"class"
				])]),
				_: 3
			}), (V(), U(F(J_), { key: Number(a.value) }, {
				default: I(() => [G(F(V_), {
					position: "popper",
					"side-offset": 8,
					align: "start",
					style: ue([F(u), e.contentStyle]),
					class: he(F(nx)(F(Jy), "min-w-(--reka-combobox-trigger-width)")),
					onKeydown: l
				}, {
					default: I(() => [G(F(Wm), {
						class: "contents",
						onMountAutoFocus: i[1] ||= gs(() => {}, ["prevent"]),
						onUnmountAutoFocus: i[2] ||= gs(() => {}, ["prevent"])
					}, {
						default: I(() => [W("div", CS, [W("div", wS, [i[6] ||= W("i", { class: "icon-[lucide--search] text-muted-foreground" }, null, -1), G(F(G_), {
							modelValue: o.value,
							"onUpdate:modelValue": i[0] ||= (e) => o.value = e,
							"aria-label": e.searchLabel,
							placeholder: e.searchPlaceholder,
							class: "w-full border-none bg-transparent text-sm outline-none"
						}, null, 8, [
							"modelValue",
							"aria-label",
							"placeholder"
						])])]), G(F(Z_), {
							style: ue({ maxHeight: `min(${e.listMaxHeight}, 50vh)` }),
							class: "scrollbar-custom w-full"
						}, {
							default: I(() => [(V(!0), H(B, null, ei(F(s), (e) => (V(), U(F(K_), {
								key: e.value,
								value: e,
								class: he(F(qy)({ layout: "single" }))
							}, {
								default: I(() => [W("span", TS, M(e.name), 1), G(F(q_), { class: "flex shrink-0 items-center justify-center" }, {
									default: I(() => [...i[7] ||= [W("i", {
										class: "icon-[lucide--check] text-foreground",
										"aria-hidden": "true"
									}, null, -1)]]),
									_: 1
								})]),
								_: 2
							}, 1032, ["value", "class"]))), 128)), G(F(H_), { class: he(F(Xy)) }, {
								default: I(() => [K(M(e.emptyText), 1)]),
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
}), DS = {
	key: 0,
	class: "icon-[lucide--loader-circle] shrink-0 animate-spin text-muted-foreground"
}, OS = /* @__PURE__ */ R({
	inheritAttrs: !1,
	__name: "SingleSelect",
	props: /*@__PURE__*/ fi({
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
		let { attrsClass: t, attrsWithoutClass: n } = $y(), r = Mi(e, "modelValue"), i = /* @__PURE__ */ N(!1);
		function a(e) {
			e.key === "Escape" && (Qy(e), i.value = !1);
		}
		let o = eb({
			minWidth: e.popoverMinWidth,
			maxWidth: e.popoverMaxWidth
		});
		return (s, c) => e.searchable && e.searchLabel !== void 0 && e.emptyText !== void 0 ? (V(), U(ES, J({
			key: 0,
			modelValue: r.value,
			"onUpdate:modelValue": c[0] ||= (e) => r.value = e
		}, F(n), {
			class: F(t),
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
			icon: I(() => [z(s.$slots, "icon")]),
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
		])) : (V(), U(F(_v), {
			key: 1,
			modelValue: r.value,
			"onUpdate:modelValue": c[1] ||= (e) => r.value = e,
			open: i.value,
			"onUpdate:open": c[2] ||= (e) => i.value = e,
			disabled: e.disabled
		}, {
			default: I(() => [G(F(Iv), J(F(n), {
				"aria-label": e.accessibleLabel,
				"aria-busy": e.loading || void 0,
				"aria-invalid": e.invalid || void 0,
				class: F(nx)(F(Ky)({
					size: e.size,
					border: e.invalid ? "invalid" : "none"
				}), F(t))
			}), {
				default: I(() => [W("div", { class: he(F(nx)("flex flex-1 items-center gap-2 overflow-hidden py-2 pl-2", e.size === "md" ? "text-xs" : "text-sm")) }, [e.loading ? (V(), H("i", DS)) : z(s.$slots, "icon", {}, void 0, void 0, 1), G(F(Lv), {
					placeholder: e.label,
					class: "truncate"
				}, null, 8, ["placeholder"])], 2), W("div", { class: he(F(Yy)) }, [...c[3] ||= [W("i", { class: "icon-[lucide--chevron-down] text-muted-foreground" }, null, -1)]], 2)]),
				_: 3
			}, 16, [
				"aria-label",
				"aria-busy",
				"aria-invalid",
				"class"
			]), G(F(Fv), null, {
				default: I(() => [G(F(kv), {
					position: "popper",
					"side-offset": 8,
					align: "start",
					style: ue([F(o), e.contentStyle]),
					class: he(F(nx)(F(Jy), "min-w-(--reka-select-trigger-width)")),
					onKeydown: a
				}, {
					default: I(() => [G(F(Rv), {
						style: ue({ maxHeight: `min(${e.listMaxHeight}, 50vh)` }),
						class: "scrollbar-custom w-full"
					}, {
						default: I(() => [(V(!0), H(B, null, ei(e.options, (e) => (V(), U(F(Mv), {
							key: e.value,
							value: e.value,
							disabled: e.disabled,
							class: he(F(qy)({ layout: "single" }))
						}, {
							default: I(() => [G(F(Pv), { class: "truncate" }, {
								default: I(() => [K(M(e.name), 1)]),
								_: 2
							}, 1024), G(F(Nv), { class: "flex shrink-0 items-center justify-center" }, {
								default: I(() => [...c[4] ||= [W("i", {
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
}), kS = "unspecified", AS = (e) => e === "" ? kS : "value:" + e, jS = /* @__PURE__ */ R((e) => () => G(OS, J({
	class: "ap-comfy-select",
	accessibleLabel: e.label,
	"aria-describedby": e.invalid ? `${e.id}-error` : void 0,
	disabled: e.disabled,
	invalid: e.invalid,
	modelValue: e.options.some((t) => t.value === e.value) ? AS(e.value) : kS,
	options: e.options.map((e) => ({
		value: AS(e.value),
		name: e.label,
		disabled: e.disabled
	}))
}, {
	id: e.id,
	"onUpdate:modelValue": (t) => {
		typeof t == "string" && e.onChange(t === kS ? "" : t.slice(6));
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
async function MS(e, n, r, i = "default") {
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
function NS() {
	let e = new AbortController(), t = /* @__PURE__ */ N(!1), n = /* @__PURE__ */ P();
	Ae(() => e.abort());
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
function PS(e) {
	return e == null ? "—" : e < 1024 ? `${e} B` : new Intl.NumberFormat(void 0, { maximumFractionDigits: 2 }).format(e / 1024 ** 3) + " GiB";
}
function FS(e) {
	return e == null ? "—" : e < 1e9 ? new Intl.NumberFormat().format(e) + " B" : new Intl.NumberFormat(void 0, { maximumFractionDigits: 3 }).format(e / 1e9) + " GB";
}
// src/api/equipment.ts
var IS = [
	"camera",
	"primary_optics",
	"optical_accessory",
	"filter"
], LS = "/astrophoto/v1", RS = (e) => e === null || typeof e == "string", zS = (e) => e === null || typeof e == "number" && Number.isFinite(e), BS = (e) => typeof e == "string" && /^[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}$/.test(e), VS = (e) => typeof e == "number" && e > 0 && Number.isSafeInteger(e), HS = (e) => Array.isArray(e) && e.every(BS), US = (e) => Array.isArray(e) && e.every((e) => typeof e == "string"), WS = (e) => IS.includes(e), GS = (e) => $(e) && Object.entries(e).every(([e, t]) => e === "passbands" ? Array.isArray(t) && t.every((e) => $(e) && BS(e.id) && typeof e.band_label == "string" && zS(e.center_nm) && zS(e.fwhm_nm)) : e === "readout_modes" ? Array.isArray(t) && t.every((e) => $(e) && typeof e.mode_key == "string" && typeof e.display_name == "string" && [
	"gain_min",
	"gain_max",
	"offset_min",
	"offset_max"
].every((t) => zS(e[t]))) : RS(t) || typeof t == "boolean" || zS(t));
function KS(e) {
	if (!$(e) || !BS(e.id) || !WS(e.equipment_type) || typeof e.name != "string" || !VS(e.row_version) || !RS(e.archived_at_utc) || !RS(e.notes) || !RS(e.manufacturer) || !RS(e.model) || !GS(e.specs) || e.usage_summary !== void 0 && (!Array.isArray(e.usage_summary) || !e.usage_summary.every((e) => $(e) && BS(e.train_id) && typeof e.name == "string" && typeof e.draft == "boolean" && Array.isArray(e.revisions) && e.revisions.every((e) => $(e) && BS(e.id) && VS(e.revision_number))))) throw new Q("schema");
	return e;
}
function qS(e) {
	return $(e) && zS(e.rotation_deg) && RS(e.flat_validity_note) && RS(e.configuration_note);
}
function JS(e) {
	return $(e) && typeof e.name == "string" && RS(e.notes) && (e.change_summary === void 0 || RS(e.change_summary)) && [
		"camera_id",
		"primary_optics_id",
		"base_revision_id"
	].every((t) => e[t] === null || BS(e[t])) && HS(e.accessory_ids) && HS(e.filter_ids) && qS(e.optical_state);
}
function YS(e) {
	if (!$(e) || !VS(e.draft_version) || !JS(e.draft) || typeof e.updated_at_utc != "string") throw new Q("schema");
	return e;
}
function XS(e) {
	if (!$(e) || !BS(e.id) || !BS(e.train_id) || !VS(e.revision_number) || !RS(e.change_summary) || typeof e.published_at_utc != "string" || !(e.base_revision_id === null || BS(e.base_revision_id))) throw new Q("schema");
	return e;
}
function ZS(e) {
	if (!$(e) || !BS(e.id) || typeof e.name != "string" || !RS(e.notes) || !VS(e.row_version) || ![
		"draft",
		"published",
		"archived"
	].includes(String(e.status)) || typeof e.has_draft != "boolean" || !$(e.summary) || !RS(e.summary.camera) || !RS(e.summary.primary_optics) || !US(e.summary.accessories) || !US(e.summary.filters) || (e.latest_revision !== null && XS(e.latest_revision), e.default_revision !== null && XS(e.default_revision), e.draft !== null && e.draft !== void 0 && YS(e.draft), e.configuration != null && (!$(e.configuration) || !JS(e.configuration.draft) || e.configuration.draft_version !== null && !VS(e.configuration.draft_version)))) throw new Q("schema");
	if (e.components !== void 0) {
		if (!Array.isArray(e.components)) throw new Q("schema");
		e.components.forEach(KS);
	}
	return e;
}
function QS(e) {
	return new URLSearchParams(Object.entries(e).filter(([, e]) => e)).toString();
}
function $S(e, t) {
	if (!$(e) || !Array.isArray(e.items) || !(e.next === null || BS(e.next)) || e.total !== void 0 && (!Number.isSafeInteger(e.total) || Number(e.total) < 0)) throw new Q("schema");
	return {
		items: e.items.map(t),
		next: e.next,
		total: e.total
	};
}
var eC = (e) => `${LS}/equipment/${encodeURIComponent(e)}`, tC = (e) => `${LS}/optical-trains/${encodeURIComponent(e)}`;
async function nC(e, t) {
	return $S(await Ff(`${LS}/equipment?${QS(e)}`, t), KS);
}
async function rC(e, t) {
	return KS(await Ff(eC(e), t));
}
async function iC(e, t, n, r) {
	return KS(await If(n ? eC(n.id) : `${LS}/equipment`, n ? "PATCH" : "POST", n ? {
		...t,
		expected_version: n.row_version
	} : {
		...t,
		equipment_type: e
	}, r));
}
async function aC(e, t) {
	return KS(await If(eC(e.id) + (e.archived_at_utc ? "/restore" : "/archive"), "POST", { expected_version: e.row_version }, t));
}
async function oC(e, t) {
	await If(eC(e.id), "DELETE", { expected_version: e.row_version }, t);
}
async function sC(e, t) {
	return $S(await Ff(`${LS}/optical-trains?${QS(e)}`, t), ZS);
}
async function cC(e, t) {
	return ZS(await Ff(tC(e), t));
}
async function lC(e, t) {
	await If(tC(e.id), "DELETE", { expected_version: e.row_version }, t);
}
async function uC(e, t) {
	let n = ZS(await If(`${LS}/optical-trains`, "POST", {
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
async function dC(e, t, n, r) {
	return YS(await If(tC(e) + "/draft", "PUT", {
		draft: t,
		expected_draft_version: n
	}, r));
}
async function fC(e, t) {
	return ZS(await If(tC(e.id) + (e.status === "archived" ? "/restore" : "/archive"), "POST", { expected_version: e.row_version }, t));
}
async function pC(e) {
	let t = [], n = "";
	do {
		let r = await nC({
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
var mC = {
	key: 0,
	class: "px-2 pt-2 pb-0"
}, hC = { class: "flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm" }, gC = {
	key: 0,
	class: "px-1 text-sm text-muted-foreground"
}, _C = { class: "flex size-4 shrink-0 items-center justify-center rounded-sm transition-all duration-200 group-data-[state=checked]:bg-primary group-data-[state=unchecked]:bg-secondary [&>span]:flex" }, vC = {
	key: 0,
	class: "px-1 text-sm text-muted-foreground"
}, yC = /* @__PURE__ */ R({
	__name: "MultiSelectContent",
	props: /*@__PURE__*/ fi({
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
	emits: /*@__PURE__*/ fi(["escape"], ["update:modelValue", "update:searchQuery"]),
	setup(e, { emit: t }) {
		let { open: n } = P_(), r = t, i = Mi(e, "modelValue"), a = Mi(e, "searchQuery"), o = Y(() => !!e.formatSelectedCount || e.showClearButton), s = Y(() => nx("flex shrink-0 items-center justify-between", e.actionsPlacement === "header" ? "mt-2 border-b px-2 pb-4" : "-mx-2 mt-2 border-t px-4 pt-3 pb-1")), c = bS(a, () => e.options), l = Y(() => a.value.trim() ? [...i.value.filter((e) => !c.value.some(({ value: t }) => t === e.value)), ...c.value] : e.options);
		function u(e) {
			e.key === "Escape" && (Qy(e), r("escape"));
		}
		function d(e) {
			e.preventDefault();
		}
		return (t, r) => (V(), U(F(J_), { key: Number(F(n)) }, {
			default: I(() => [G(F(V_), {
				position: "popper",
				"side-offset": 8,
				align: "start",
				style: ue([e.popoverStyle, e.contentStyle]),
				class: he(F(nx)(F(Jy), "flex flex-col")),
				onKeydown: u,
				onFocusOutside: d
			}, {
				default: I(() => [G(F(Wm), {
					class: "contents",
					onMountAutoFocus: r[1] ||= gs(() => {}, ["prevent"])
				}, {
					default: I(() => [
						e.showSearchBox ? (V(), H("div", mC, [W("div", hC, [r[2] ||= W("i", { class: "icon-[lucide--search] shrink-0 text-muted-foreground" }, null, -1), G(F(G_), {
							modelValue: a.value,
							"onUpdate:modelValue": r[0] ||= (e) => a.value = e,
							placeholder: e.searchPlaceholder,
							"aria-label": e.searchLabel,
							class: "w-full border-none bg-transparent outline-none"
						}, null, 8, [
							"modelValue",
							"placeholder",
							"aria-label"
						])])])) : q("", !0),
						o.value && e.actionsPlacement === "header" ? (V(), H("div", {
							key: 1,
							class: he(s.value)
						}, [e.formatSelectedCount ? (V(), H("span", gC, M(e.formatSelectedCount(i.value.length)), 1)) : q("", !0)], 2)) : q("", !0),
						G(F(Z_), {
							class: he(F(nx)("flex flex-col gap-0 p-0 text-sm", "scrollbar-custom overflow-y-auto", "min-w-(--reka-combobox-trigger-width)")),
							style: ue({ maxHeight: `min(${e.listMaxHeight}, 50vh)` })
						}, {
							default: I(() => [(V(!0), H(B, null, ei(l.value, (e) => (V(), U(F(K_), {
								key: e.value,
								value: e,
								class: he(F(nx)("group", F(qy)({ layout: "multi" })))
							}, {
								default: I(() => [W("div", _C, [G(F(q_), null, {
									default: I(() => [...r[3] ||= [W("i", { class: "icon-[lucide--check] text-xs font-bold text-foreground" }, null, -1)]]),
									_: 1
								})]), W("span", null, M(e.name), 1)]),
								_: 2
							}, 1032, ["value", "class"]))), 128)), G(F(H_), { class: he(F(Xy)) }, {
								default: I(() => [K(M(e.emptyText), 1)]),
								_: 1
							}, 8, ["class"])]),
							_: 1
						}, 8, ["class", "style"]),
						o.value && e.actionsPlacement === "footer" ? (V(), H("div", {
							key: 2,
							class: he(s.value)
						}, [e.formatSelectedCount ? (V(), H("span", vC, M(e.formatSelectedCount(i.value.length)), 1)) : q("", !0)], 2)) : q("", !0)
					]),
					_: 1
				})]),
				_: 1
			}, 8, ["style", "class"])]),
			_: 1
		}));
	}
}), bC = { class: "flex flex-1 items-center overflow-hidden py-2 pl-2 whitespace-nowrap" }, xC = { class: "truncate text-sm" }, SC = /* @__PURE__ */ R({
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
		return (t, n) => (V(), U(F(L_), { "as-child": "" }, {
			default: I(() => [G(F(Y_), J(t.$attrs, {
				"aria-label": e.accessibleLabel,
				class: F(nx)(F(Ky)({
					size: e.size,
					border: e.selectedItems.length ? "active" : "none"
				}), e.class)
			}), {
				default: I(() => [W("div", bC, [e.selectedItems.length === 0 ? (V(), H("span", {
					key: 0,
					class: he(e.size === "md" ? "text-xs" : "text-sm")
				}, M(e.label), 3)) : z(t.$slots, "default", { selected: e.selectedItems }, () => [W("span", xC, M(e.selectedItems.map(({ name: e }) => e).join(", ")), 1)], void 0, 1), e.selectedItems.length ? (V(), H("span", {
					key: 2,
					class: he(F(nx)("pointer-events-none absolute -top-1.5 -right-1.5 z-10", F(Zy)))
				}, M(e.selectedItems.length), 3)) : q("", !0)]), W("div", { class: he(F(Yy)) }, [...n[0] ||= [W("i", { class: "icon-[lucide--chevron-down] text-muted-foreground" }, null, -1)]], 2)]),
				_: 3
			}, 16, ["aria-label", "class"])]),
			_: 3
		}));
	}
}), CC = /* @__PURE__ */ R({
	inheritAttrs: !1,
	__name: "MultiSelect",
	props: /*@__PURE__*/ fi({
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
		let { attrsClass: t, attrsWithoutClass: n } = $y(), r = Mi(e, "modelValue"), i = Mi(e, "searchQuery"), a = /* @__PURE__ */ N(!1), o = eb({
			minWidth: e.popoverMinWidth,
			maxWidth: e.popoverMaxWidth
		});
		return (s, c) => (V(), U(F(I_), {
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
			default: I(() => [G(SC, J(F(n), {
				class: F(t),
				label: e.label,
				"accessible-label": e.accessibleLabel,
				"selected-items": r.value,
				size: e.size
			}), ti({ _: 2 }, [s.$slots.value ? {
				name: "default",
				fn: I(({ selected: e }) => [z(s.$slots, "value", { selected: e })]),
				key: "0"
			} : void 0]), 1040, [
				"class",
				"label",
				"accessible-label",
				"selected-items",
				"size"
			]), G(yC, {
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
				"popover-style": F(o),
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
}), wC = /* @__PURE__ */ R((e) => () => G(CC, J({
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
] }), TC = {
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
}, EC = [
	"exposure",
	"gain",
	"offset",
	"temperature",
	"order",
	"fwhm",
	"snr"
], DC = [
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
], OC = [
	"dark",
	"flat",
	"bias",
	"dark_flat"
], kC = [
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
], AC = {
	role: "alert",
	class: "ap-assets-error"
}, jC = { key: 0 }, MC = /* @__PURE__ */ R({
	__name: "LibraryError",
	props: {
		error: {},
		retry: { type: Function }
	},
	setup(e) {
		let t = e, { t: n } = Z(), r = Y(() => t.error instanceof Q ? t.error.code : t.error instanceof Error ? t.error.message : "network"), i = Y(() => {
			let e = t.error instanceof Q ? t.error.details : void 0;
			if (!e) return "";
			let r = e.fields ?? e.differences;
			return Array.isArray(r) ? r.map((e) => typeof e == "string" ? e : "").filter(Boolean).join(", ") : r && typeof r == "object" ? Object.keys(r).join(", ") : ["conflicts", "unknown"].map((t) => {
				let r = e[t];
				return Array.isArray(r) && r.length ? n("assetLibrary." + t) + " · " + r.map((e) => n("assetLibrary.fields." + e, String(e))).join(", ") : "";
			}).filter(Boolean).join(" · ");
		});
		return (t, a) => (V(), H("div", AC, [
			W("p", null, [K(M(F(n)("assetLibrary.errors." + r.value, F(n)("errors." + r.value, F(n)("errors.unknown")))) + " ", 1), W("code", null, M(r.value), 1)]),
			i.value ? (V(), H("p", jC, M(i.value), 1)) : q("", !0),
			e.retry ? (V(), H("button", {
				key: 1,
				type: "button",
				onClick: a[0] ||= (...t) => e.retry && e.retry(...t)
			}, M(F(n)("actions.retry")), 1)) : q("", !0)
		]));
	}
}), NC = {
	key: 0,
	role: "status"
}, PC = {
	key: 2,
	role: "status"
}, FC = {
	key: 3,
	class: "ap-assets-list ap-assets-picker-list"
}, IC = ["title", "onClick"], LC = { key: 4 }, RC = /* @__PURE__ */ R({
	__name: "AssetPicker",
	props: {
		selected: {},
		excluded: {},
		usage: {}
	},
	emits: ["pick"],
	setup(e, { emit: t }) {
		let n = e, r = t, { t: i } = Z(), a = /* @__PURE__ */ N(""), { resource: o, refresh: s } = Ry(Y(() => {
			let e = a.value, t = n.usage;
			return (n) => Ty("assets", {
				q: e,
				usage: t,
				limit: "30"
			}, n);
		})), c = Y(() => o.value.state === "ready" ? o.value.data.items.filter((e) => !n.selected?.includes(e.id) && !n.excluded?.includes(e.id)) : []);
		return (e, t) => (V(), H(B, null, [
			G(F(zv), {
				label: F(i)("assetLibrary.searchAssets"),
				"clear-label": F(i)("browse.clear"),
				onSearch: t[0] ||= (e) => a.value = e
			}, null, 8, ["label", "clear-label"]),
			F(o).state === "loading" ? (V(), H("p", NC, M(F(i)("states.loading")), 1)) : F(o).state === "error" ? (V(), U(MC, {
				key: 1,
				error: F(o).error,
				retry: F(s)
			}, null, 8, ["error", "retry"])) : c.value.length ? (V(), H("ul", FC, [(V(!0), H(B, null, ei(c.value, (e) => (V(), H("li", { key: e.id }, [W("button", {
				type: "button",
				class: "ap-assets-truncate",
				title: e.name,
				onClick: (t) => r("pick", e)
			}, M(e.name), 9, IC)]))), 128))])) : (V(), H("p", PC, M(F(i)("assetLibrary.noMatches")), 1)),
			F(o).state === "ready" && F(o).data.next ? (V(), H("small", LC, M(F(i)("assetLibrary.narrowSearch")), 1)) : q("", !0)
		], 64));
	}
}), zC = ["disabled"], BC = ["for"], VC = ["value", "onInput"], HC = ["value", "onInput"], UC = ["for"], WC = ["for"], GC = ["for"], KC = { key: 0 }, qC = /* @__PURE__ */ R({
	__name: "AssetAttributes",
	props: /*@__PURE__*/ fi({
		id: {},
		saving: { type: Boolean }
	}, {
		modelValue: { required: !0 },
		modelModifiers: {}
	}),
	emits: ["update:modelValue"],
	setup(e) {
		let t = Mi(e, "modelValue"), n = e, { t: r } = Z(), { resource: i, refresh: a } = Ry(pC), { resource: o, refresh: s } = Ry(async (e) => {
			let t = "", n = [];
			do {
				let r = await sC({ after: t }, e);
				if (n.push(...r.items), !r.next || r.next <= t) return n;
				t = r.next;
			} while (t);
			return n;
		}), c = Y(() => ({
			value: "",
			label: r("assetLibrary.values.unspecified")
		})), l = Y(() => i.value.state === "ready" ? i.value.data.filter((e) => e.equipment_type === "camera") : []), u = Y(() => i.value.state === "ready" ? i.value.data.map((e) => ({
			value: e.id,
			name: e.name
		})) : []), d = Y(() => o.value.state === "ready" ? o.value.data : []);
		function f(e, n) {
			t.value = {
				...t.value,
				[e]: n
			};
		}
		function p(e, t) {
			let n = t.target;
			f(e, Number.isFinite(n.valueAsNumber) ? n.valueAsNumber : null);
		}
		function m(e, n) {
			let r = [c.value, ...e.map((e) => ({
				value: e.id,
				label: e.name
			}))], i = t.value[n];
			return typeof i == "string" && i && !r.some((e) => e.value === i) && r.push({
				value: i,
				label: i
			}), r;
		}
		return (h, g) => (V(), H("fieldset", {
			class: "ap-assets-form",
			disabled: e.saving
		}, [
			W("legend", null, M(F(r)("assetLibrary.attributes")), 1),
			(V(!0), H(B, null, ei(F(TC), (i, a) => (V(), H("label", {
				key: a,
				class: "ap-assets-field",
				for: n.id + "-" + a
			}, [K(M(F(r)("assetLibrary.fields." + a)) + " ", 1), G(F(jS), {
				id: n.id + "-" + a,
				value: String(t.value[a] ?? ""),
				label: F(r)("assetLibrary.fields." + a),
				disabled: e.saving,
				options: [c.value, ...i.map((e) => ({
					value: e,
					label: F(r)("assetLibrary.values." + e)
				}))],
				onChange: (e) => f(a, e || null)
			}, null, 8, [
				"id",
				"value",
				"label",
				"disabled",
				"options",
				"onChange"
			])], 8, BC))), 128)),
			(V(!0), H(B, null, ei(F(DC), (e) => (V(), H("label", { key: e }, [K(M(F(r)("assetLibrary.fields." + e)) + " ", 1), W("input", {
				value: String(t.value[e] ?? ""),
				onInput: (t) => f(e, t.target.value || null)
			}, null, 40, VC)]))), 128)),
			(V(!0), H(B, null, ei(F(EC), (e) => (V(), H("label", { key: e }, [K(M(F(r)("assetLibrary.fields." + e)) + " ", 1), W("input", {
				type: "number",
				step: "any",
				value: String(t.value[e] ?? ""),
				onInput: (t) => p(e, t)
			}, null, 40, HC)]))), 128)),
			W("label", { for: n.id + "-camera" }, M(F(r)("assetLibrary.fields.camera_id")), 9, UC),
			G(F(jS), {
				id: n.id + "-camera",
				value: String(t.value.camera_id ?? ""),
				label: F(r)("assetLibrary.fields.camera_id"),
				disabled: e.saving,
				options: m(l.value, "camera_id"),
				onChange: g[0] ||= (e) => f("camera_id", e || null)
			}, null, 8, [
				"id",
				"value",
				"label",
				"disabled",
				"options"
			]),
			F(i).state === "error" ? (V(), U(MC, {
				key: 0,
				error: F(i).error,
				retry: F(a)
			}, null, 8, ["error", "retry"])) : q("", !0),
			G(F(wC), {
				label: F(r)("assetLibrary.fields.equipment_ids"),
				placeholder: F(r)("assetLibrary.fields.equipment_ids"),
				"empty-text": F(r)("assetLibrary.noMatches"),
				options: u.value,
				value: Array.isArray(t.value.equipment_ids) ? t.value.equipment_ids : [],
				disabled: !!e.saving,
				onChange: g[1] ||= (e) => f("equipment_ids", e)
			}, null, 8, [
				"label",
				"placeholder",
				"empty-text",
				"options",
				"value",
				"disabled"
			]),
			W("label", { for: n.id + "-optical" }, M(F(r)("assetLibrary.fields.optical_train_id")), 9, WC),
			G(F(jS), {
				id: n.id + "-optical",
				value: String(t.value.optical_train_id ?? ""),
				label: F(r)("assetLibrary.fields.optical_train_id"),
				disabled: e.saving,
				options: m(d.value, "optical_train_id"),
				onChange: g[2] ||= (e) => f("optical_train_id", e || null)
			}, null, 8, [
				"id",
				"value",
				"label",
				"disabled",
				"options"
			]),
			F(o).state === "error" ? (V(), U(MC, {
				key: 1,
				error: F(o).error,
				retry: F(s)
			}, null, 8, ["error", "retry"])) : q("", !0),
			t.value.usage === "flat" && t.value.calibration_state === "calibrated" ? (V(), H(B, { key: 2 }, [
				W("p", null, M(F(r)("assetLibrary.flatRequirements")), 1),
				W("label", { for: n.id + "-calibration-source" }, M(F(r)("assetLibrary.calibrationMethod")), 9, GC),
				G(F(jS), {
					id: n.id + "-calibration-source",
					value: String(t.value.calibration_method ?? ""),
					label: F(r)("assetLibrary.calibrationMethod"),
					disabled: e.saving,
					options: [c.value, ...["bias", "dark_flat"].map((e) => ({
						value: e,
						label: F(r)("assetLibrary.values." + e)
					}))],
					onChange: g[3] ||= (e) => t.value = {
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
				t.value.calibration_source_asset_id ? (V(), H("small", KC, M(F(r)("assetLibrary.fields.calibration_source_asset_id")) + " · " + M(t.value.calibration_source_asset_id), 1)) : q("", !0),
				typeof t.value.calibration_method == "string" ? (V(), U(RC, {
					usage: t.value.calibration_method,
					key: t.value.calibration_method,
					selected: typeof t.value.calibration_source_asset_id == "string" ? [t.value.calibration_source_asset_id] : [],
					onPick: g[4] ||= (e) => f("calibration_source_asset_id", e.id)
				}, null, 8, ["usage", "selected"])) : q("", !0)
			], 64)) : q("", !0)
		], 8, zC));
	}
}), JC = { class: "ap-assets-dialog-content" }, YC = {
	key: 0,
	class: "ap-assets-summary"
}, XC = ["disabled"], ZC = { for: "ap-output-project" }, QC = [
	"value",
	"disabled",
	"onInput"
], $C = { key: 1 }, ew = { class: "ap-assets-toolbar" }, tw = ["disabled"], nw = ["disabled"], rw = ["disabled"], iw = ["disabled"], aw = {
	key: 2,
	class: "ap-assets-toolbar"
}, ow = ["disabled"], sw = ["disabled"], cw = /* @__PURE__ */ R({
	__name: "AssetEditor",
	props: {
		asset: {},
		selected: {},
		projects: {}
	},
	emits: [
		"changed",
		"close",
		"notice"
	],
	setup(e, { expose: t, emit: n }) {
		let r = e, i = n, { t: a } = Z(), o = /* @__PURE__ */ P(r.asset), s = /* @__PURE__ */ N({ ...r.asset?.attributes }), c = /* @__PURE__ */ N(""), l = /* @__PURE__ */ N(""), u = /* @__PURE__ */ N(""), d = [
			"source_asset_id",
			"source_collection_id",
			"node",
			"workflow"
		], f = Y(() => JSON.stringify(s.value) !== JSON.stringify(o.value?.attributes ?? {})), { pending: p, run: m, error: h } = NS(), g = () => {
			i("changed"), i("notice", a("assetLibrary.saved")), i("close");
		};
		function _() {
			m(async (e) => {
				if (r.selected) {
					if (!await MS(a("assetLibrary.bulkEdit"), a("assetLibrary.bulkConfirm", { count: r.selected.length }))) return;
					let t = 0, n;
					for (let i of r.selected) {
						if (e.aborted) return;
						try {
							await Oy("assets", { attributes: {
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
				let t = { attributes: s.value };
				o.value || (t.output_id = l.value.trim(), u.value && (t.project_id = u.value));
				let n = await Oy("assets", t, e, o.value);
				e.aborted || (n.warnings?.length ? (i("changed"), i("notice", a("assetLibrary.collectionWarning", { fields: [...new Set(n.warnings.flatMap((e) => e.conflicts))].map((e) => a("assetLibrary.fields." + e, e)).join(", ") })), i("close")) : g());
			});
		}
		function v(e = !1) {
			m(async (t) => {
				o.value && await MS(a("assetLibrary." + (e ? "physicalDelete" : "unregister")), a("assetLibrary." + (e ? "physicalDeleteConfirm" : "unregisterConfirm")), o.value.name, "delete") && (e ? await Fy(o.value, t) : await ky("assets", o.value, t), t.aborted || g());
			});
		}
		function y() {
			m(async (e) => {
				if (!o.value || !c.value.trim()) return;
				await Py(o.value.id, c.value.trim(), e);
				let t = await Dy("assets", o.value.id, e);
				e.aborted || (o.value = t, c.value = "", i("changed"), i("notice", a("assetLibrary.saved")));
			});
		}
		async function b() {
			p.value || (!f.value || await MS(a("assetLibrary.discard"), a("assetLibrary.discardConfirm"))) && i("close");
		}
		function x() {
			m(async (e) => {
				if (!o.value || !await MS(a("actions.refresh"), a("assetLibrary.discardConfirm"))) return;
				let t = await Dy("assets", o.value.id, e);
				e.aborted || (o.value = t, s.value = { ...t.attributes });
			});
		}
		return t({ discardDraft: b }), (t, n) => (V(), H("section", JC, [
			o.value ? (V(), H("dl", YC, [
				W("div", null, [W("dt", null, M(F(a)("assetLibrary.storage")), 1), W("dd", null, M(F(a)("assetLibrary.values." + o.value.storage_mode)), 1)]),
				W("div", null, [W("dt", null, M(F(a)("assetLibrary.fileSize")), 1), W("dd", null, M(F(PS)(o.value.size_bytes)), 1)]),
				W("div", null, [W("dt", null, M(F(a)("assetLibrary.availability")), 1), W("dd", null, M(F(a)("assetLibrary.values." + (o.value.available ? "online" : "offline"))), 1)])
			])) : q("", !0),
			W("form", {
				class: "ap-assets-form",
				onSubmit: gs(_, ["prevent"])
			}, [
				!o.value && !e.selected ? (V(), H(B, { key: 0 }, [
					W("label", null, [K(M(F(a)("assetLibrary.outputId")), 1), Jn(W("input", {
						"onUpdate:modelValue": n[0] ||= (e) => l.value = e,
						disabled: F(p),
						required: ""
					}, null, 8, XC), [[
						os,
						l.value,
						void 0,
						{ trim: !0 }
					]])]),
					W("label", ZC, M(F(a)("assetLibrary.project")), 1),
					G(F(jS), {
						id: "ap-output-project",
						value: u.value,
						disabled: F(p),
						label: F(a)("assetLibrary.project"),
						options: [{
							value: "",
							label: F(a)("assetLibrary.values.unspecified")
						}, ...e.projects.map((e) => ({
							value: e.id,
							label: e.name
						}))],
						onChange: n[1] ||= (e) => u.value = e
					}, null, 8, [
						"value",
						"disabled",
						"label",
						"options"
					]),
					(V(), H(B, null, ei(d, (e) => W("label", { key: e }, [K(M(F(a)("assetLibrary.fields." + e)) + " ", 1), W("input", {
						value: String(s.value[e] ?? ""),
						disabled: F(p),
						onInput: (t) => s.value[e] = t.target.value.trim() || null
					}, null, 40, QC)])), 64))
				], 64)) : q("", !0),
				e.selected ? (V(), H("p", $C, M(F(a)("assetLibrary.bulkConfirm", { count: e.selected.length })), 1)) : q("", !0),
				G(qC, {
					id: "ap-edit-asset",
					modelValue: s.value,
					"onUpdate:modelValue": n[2] ||= (e) => s.value = e,
					saving: F(p)
				}, null, 8, ["modelValue", "saving"]),
				F(h) ? (V(), U(MC, {
					key: 2,
					error: F(h),
					retry: o.value && F(h) instanceof F(Q) && F(h).code === "REVISION_CONFLICT" ? x : void 0
				}, null, 8, ["error", "retry"])) : q("", !0),
				W("div", ew, [W("button", {
					type: "submit",
					disabled: F(p) || (o.value || e.selected) && !f.value
				}, M(F(a)("assetLibrary.save")), 9, tw), W("button", {
					type: "button",
					disabled: F(p),
					onClick: b
				}, M(F(a)("storage.cancel")), 9, nw)])
			], 32),
			o.value && !o.value.available && o.value.storage_mode === "external_reference" ? (V(), H("form", {
				key: 1,
				class: "ap-assets-form",
				onSubmit: gs(y, ["prevent"])
			}, [W("label", null, [K(M(F(a)("assetLibrary.relocate")), 1), Jn(W("input", {
				"onUpdate:modelValue": n[3] ||= (e) => c.value = e,
				disabled: F(p)
			}, null, 8, rw), [[os, c.value]])]), W("button", {
				type: "submit",
				disabled: F(p) || !c.value.trim()
			}, M(F(a)("assetLibrary.relocate")), 9, iw)], 32)) : q("", !0),
			o.value ? (V(), H("div", aw, [W("button", {
				type: "button",
				class: "ap-assets-danger",
				disabled: F(p),
				onClick: n[4] ||= (e) => v()
			}, M(F(a)("assetLibrary.unregister")), 9, ow), o.value.storage_mode === "managed" ? (V(), H("button", {
				key: 0,
				type: "button",
				class: "ap-assets-danger",
				disabled: F(p) || !o.value.available,
				onClick: n[5] ||= (e) => v(!0)
			}, M(F(a)("assetLibrary.physicalDelete")), 9, sw)) : q("", !0)])) : q("", !0)
		]));
	}
}), lw = ["disabled"], uw = { key: 0 }, dw = { key: 1 }, fw = { key: 2 }, pw = {
	key: 3,
	class: "ap-assets-checkbox"
}, mw = { for: "ap-folder-parent" }, hw = {
	key: 0,
	class: "ap-assets-facts"
}, gw = { for: "ap-collection-calibration-folder" }, _w = {
	key: 2,
	class: "ap-assets-list"
}, vw = ["title"], yw = [
	"disabled",
	"aria-label",
	"onClick"
], bw = [
	"disabled",
	"aria-label",
	"onClick"
], xw = ["aria-label", "onClick"], Sw = { key: 0 }, Cw = { for: "ap-master-method" }, ww = { key: 0 }, Tw = { class: "ap-assets-checkbox" }, Ew = {
	key: 0,
	class: "ap-assets-facts"
}, Dw = { for: "ap-calibration-master" }, Ow = { key: 0 }, kw = ["for"], Aw = {
	key: 0,
	class: "ap-assets-facts"
}, jw = { key: 0 }, Mw = { for: "ap-placement-project" }, Nw = { for: "ap-placement-folder" }, Pw = {
	key: 1,
	class: "ap-assets-approval",
	role: "status"
}, Fw = { class: "ap-assets-toolbar" }, Iw = ["disabled"], Lw = ["disabled"], Rw = ["disabled"], zw = /* @__PURE__ */ R({
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
		let r = e, i = n, { t: a } = Z(), o = /* @__PURE__ */ P(r.row), s = /* @__PURE__ */ P(), c = {
			...r.defaults,
			...r.row
		}, l = /* @__PURE__ */ N(c.name ?? ""), u = /* @__PURE__ */ N(c.target ?? ""), d = /* @__PURE__ */ N(c.notes ?? ""), f = /* @__PURE__ */ N(!1), p = /* @__PURE__ */ N(c.project_id ?? ""), m = /* @__PURE__ */ N(c.folder_id ?? ""), h = /* @__PURE__ */ N(c.calibration_folder_id ?? ""), g = /* @__PURE__ */ N(c.parent_id ?? ""), _ = /* @__PURE__ */ N(c.asset_id ?? ""), v = /* @__PURE__ */ N(c.collection_id ?? ""), y = /* @__PURE__ */ N(c.master_id ?? ""), b = r.masters.find((e) => e.id === y.value)?.usage, x = /* @__PURE__ */ N({}), S = [...OC, "other"], C = /* @__PURE__ */ N(c.method ?? ""), w = /* @__PURE__ */ N(c.source_asset_id ?? ""), T = /* @__PURE__ */ N(c.position ?? 0), E = /* @__PURE__ */ N([...c.asset_ids ?? []]), D = /* @__PURE__ */ N(!1), O = /* @__PURE__ */ P(new Map(r.assets.map((e) => [e.id, e]))), { pending: k, run: ee, error: A } = NS(), j = /* @__PURE__ */ N(""), te = Y(() => A.value?.code === "CONFIRMATION_REQUIRED" && j.value === JSON.stringify(be(!1))), ne = Y(() => ({
			value: "",
			label: a("assetLibrary.values.unspecified")
		})), re = Y(() => ({
			value: "",
			label: a("assetLibrary.rootFolder")
		})), ie = Y(() => [ne.value, ...r.projects.map((e) => ({
			value: e.id,
			label: e.name
		}))]);
		function ae(e) {
			let t = [e.name], n = /* @__PURE__ */ new Set([e.id]), i = r.folders.find((t) => t.id === e.parent_id);
			for (; i && !n.has(i.id);) t.unshift(i.name), n.add(i.id), i = r.folders.find((e) => e.id === i?.parent_id);
			return t.join(" / ");
		}
		function oe(e) {
			let t = /* @__PURE__ */ new Set([e]), n = [e];
			for (; n.length;) {
				n = r.folders.filter((e) => e.parent_id && n.includes(e.parent_id) && !t.has(e.id)).map((e) => e.id);
				for (let e of n) t.add(e);
			}
			return t;
		}
		let se = Y(() => {
			let e = r.kind === "folders" && o.value ? oe(o.value.id) : /* @__PURE__ */ new Set();
			return [re.value, ...r.folders.filter((t) => (t.project_id ?? "") === p.value && !e.has(t.id)).map((e) => ({
				value: e.id,
				label: ae(e)
			}))];
		}), ce = Y(() => [re.value, ...r.folders.filter((e) => !e.project_id).map((e) => ({
			value: e.id,
			label: ae(e)
		}))]), le = Y(() => r.collections.filter((e) => e.id !== o.value?.id).flatMap((e) => e.asset_ids)), ue = Y(() => O.value.get(_.value)), de = Y(() => new Set(r.assignments.filter((e) => _.value ? e.asset_id === _.value : e.collection_id === v.value).map((e) => e.usage ?? r.masters.find((t) => t.id === e.master_id)?.usage))), fe = Y(() => S.filter((e) => !de.value.has(e))), pe = Y(() => fe.value.map((e) => x.value[e]).filter(Boolean)), me = Y(() => (o.value ? [y.value] : pe.value).map((e) => r.masters.find((t) => t.id === e)).filter((e) => e !== void 0).map((e) => ({
			master: e,
			asset: O.value.get(e.asset_id)
		})));
		function he(e) {
			return [ne.value, ...r.masters.filter((t) => !e || t.usage === e).map((e) => ({
				value: e.id,
				label: O.value.get(e.asset_id)?.name ?? e.asset_id
			}))];
		}
		function ge(e) {
			O.value = new Map(O.value).set(e.id, e);
		}
		function _e(e) {
			return O.value.get(e)?.name ?? e;
		}
		function ve(e, t) {
			ge(e), t === "asset" && (_.value = e.id), t === "source" && (w.value = e.id), t === "member" && !E.value.includes(e.id) && E.value.push(e.id);
		}
		function ye(e, t) {
			let n = E.value[e];
			E.value.splice(e, 1), E.value.splice(e + t, 0, n);
		}
		Br(() => {
			let e = [.../* @__PURE__ */ new Set([
				_.value,
				w.value,
				...E.value,
				...r.kind === "assignments" ? r.masters.map((e) => e.asset_id) : []
			])].filter((e) => e && !O.value.has(e));
			e.length && ee(async (t) => {
				for (let n of e) try {
					ge(await Dy("assets", n, t));
				} catch (e) {
					if (t.aborted || !(e instanceof Q) || e.status !== 404) throw e;
				}
			});
		});
		function be(e) {
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
					...o.value ? { master_id: y.value } : { master_ids: pe.value },
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
		let xe = Y(() => [
			"projects",
			"folders",
			"collections",
			"sessions"
		].includes(r.kind)), Se = Y(() => xe.value ? !!l.value.trim() : r.kind === "masters" ? !!_.value && (ue.value?.attributes.usage !== "flat" || D.value && !!C.value && !!w.value) : r.kind === "assignments" ? o.value ? !!y.value : pe.value.length > 0 : !!p.value && !!(_.value || v.value));
		function Ce() {
			if (!Se.value) return;
			let e = te.value, t = JSON.stringify(be(!1));
			ee(async (n) => {
				if (e && !await MS(a("assetLibrary.confirm"), a("assetLibrary.confirmMismatch"))) return;
				let s = be(e), c = r.kind === "placements" && r.placements.find((e) => e.project_id === p.value && (_.value ? e.asset_id === _.value : e.collection_id === v.value)), l;
				try {
					r.kind === "assignments" && !o.value ? await Ay(s, n) : l = await Oy(r.kind, s, n, o.value || c || void 0);
				} catch (e) {
					throw j.value = e instanceof Q && e.code === "CONFIRMATION_REQUIRED" ? t : "", e;
				}
				n.aborted || (i("changed", l), i("notice", a("assetLibrary.saved")), i("close"));
			});
		}
		function we() {
			ee(async (e) => {
				o.value && (s.value = await Dy(r.kind, o.value.id, e));
			});
		}
		function Te() {
			s.value &&= (o.value = s.value, void 0);
		}
		function Ee() {
			ee(async (e) => {
				let t = o.value;
				if (!t) return;
				let n = r.kind === "folders" ? oe(t.id) : /* @__PURE__ */ new Set(), s = r.placements.filter((e) => e.project_id === t.id || e.folder_id && n.has(e.folder_id)).length;
				await MS(a("assetLibrary.remove"), a("assetLibrary.removeRelations", { count: s }), c.name, "delete") && (await ky(r.kind, t, e, { confirmed: !0 }), e.aborted || (i("changed"), i("notice", a("assetLibrary.saved")), i("close")));
			});
		}
		async function De() {
			k.value || (JSON.stringify(be(!1)) === Oe || await MS(a("assetLibrary.discard"), a("assetLibrary.discardConfirm"))) && i("close");
		}
		let Oe = JSON.stringify(be(!1));
		return t({ discardDraft: De }), (t, n) => (V(), H("form", {
			class: "ap-assets-form ap-assets-dialog-content",
			onSubmit: gs(Ce, ["prevent"])
		}, [
			W("fieldset", {
				disabled: F(k),
				class: "ap-assets-form"
			}, [
				xe.value ? (V(), H("label", uw, [K(M(F(a)("assetLibrary.name")), 1), Jn(W("input", {
					"onUpdate:modelValue": n[0] ||= (e) => l.value = e,
					maxlength: "120",
					required: ""
				}, null, 512), [[os, l.value]])])) : q("", !0),
				e.kind === "projects" ? (V(), H("label", dw, [K(M(F(a)("assetLibrary.fields.target")), 1), Jn(W("input", { "onUpdate:modelValue": n[1] ||= (e) => u.value = e }, null, 512), [[os, u.value]])])) : q("", !0),
				e.kind === "projects" || e.kind === "sessions" ? (V(), H("label", fw, [K(M(F(a)("assetLibrary.fields.notes")), 1), Jn(W("textarea", { "onUpdate:modelValue": n[2] ||= (e) => d.value = e }, null, 512), [[os, d.value]])])) : q("", !0),
				e.kind === "projects" && !e.row ? (V(), H("label", pw, [Jn(W("input", {
					"onUpdate:modelValue": n[3] ||= (e) => f.value = e,
					type: "checkbox"
				}, null, 512), [[ss, f.value]]), K(" " + M(F(a)("assetLibrary.projectTemplate")), 1)])) : q("", !0),
				e.kind === "folders" ? (V(), H(B, { key: 4 }, [W("label", mw, M(F(a)("assetLibrary.parentFolder")), 1), G(F(jS), {
					id: "ap-folder-parent",
					value: g.value,
					options: se.value,
					label: F(a)("assetLibrary.parentFolder"),
					disabled: F(k),
					onChange: n[4] ||= (e) => g.value = e
				}, null, 8, [
					"value",
					"options",
					"label",
					"disabled"
				])], 64)) : q("", !0),
				e.kind === "collections" || e.kind === "sessions" ? (V(), H(B, { key: 5 }, [
					e.kind === "collections" ? (V(), H("div", hw, [W("strong", null, M(F(a)("assetLibrary.processingConditions")), 1), (V(!0), H(B, null, ei(F(kC), (e) => (V(), H("div", { key: e }, [W("small", null, M(F(a)("assetLibrary.fields." + e)) + " · " + M([...new Set(E.value.map((t) => O.value.get(t)?.attributes[e] ?? F(a)("assetLibrary.values.unknown")))].join(" / ")), 1)]))), 128))])) : q("", !0),
					e.kind === "collections" ? (V(), H(B, { key: 1 }, [W("label", gw, M(F(a)("assetLibrary.calibrationFolder")), 1), G(F(jS), {
						id: "ap-collection-calibration-folder",
						value: h.value,
						label: F(a)("assetLibrary.calibrationFolder"),
						options: ce.value,
						disabled: F(k),
						onChange: n[5] ||= (e) => h.value = e
					}, null, 8, [
						"value",
						"label",
						"options",
						"disabled"
					])], 64)) : q("", !0),
					W("h3", null, M(F(a)("assetLibrary.members", { count: E.value.length })), 1),
					E.value.length ? (V(), H("ol", _w, [(V(!0), H(B, null, ei(E.value, (e, t) => (V(), H("li", {
						key: e,
						class: "ap-assets-row"
					}, [
						W("span", {
							class: "ap-assets-truncate",
							title: _e(e)
						}, M(_e(e)), 9, vw),
						W("button", {
							type: "button",
							disabled: t === 0,
							"aria-label": F(a)("assetLibrary.moveUp"),
							onClick: (e) => ye(t, -1)
						}, "↑", 8, yw),
						W("button", {
							type: "button",
							disabled: t === E.value.length - 1,
							"aria-label": F(a)("assetLibrary.moveDown"),
							onClick: (e) => ye(t, 1)
						}, "↓", 8, bw),
						W("button", {
							type: "button",
							"aria-label": F(a)("assetLibrary.removeEntry", { name: _e(e) }),
							onClick: (e) => E.value.splice(t, 1)
						}, M(F(a)("assetLibrary.remove")), 9, xw)
					]))), 128))])) : q("", !0),
					W("h3", null, M(F(a)("assetLibrary.addMembers")), 1),
					G(RC, {
						selected: E.value,
						excluded: e.kind === "collections" ? le.value : void 0,
						onPick: n[6] ||= (e) => ve(e, "member")
					}, null, 8, ["selected", "excluded"])
				], 64)) : q("", !0),
				e.kind === "masters" ? (V(), H(B, { key: 6 }, [
					_.value ? (V(), H("p", Sw, M(F(a)("assetLibrary.asset")) + " · " + M(_e(_.value)), 1)) : q("", !0),
					e.row ? q("", !0) : (V(), U(RC, {
						key: 1,
						selected: _.value ? [_.value] : [],
						onPick: n[7] ||= (e) => ve(e, "asset")
					}, null, 8, ["selected"])),
					ue.value?.attributes.usage === "flat" ? (V(), H(B, { key: 2 }, [
						W("p", null, M(F(a)("assetLibrary.flatRequirements")), 1),
						W("label", Cw, M(F(a)("assetLibrary.calibrationMethod")), 1),
						G(F(jS), {
							id: "ap-master-method",
							value: C.value,
							disabled: F(k),
							label: F(a)("assetLibrary.calibrationMethod"),
							options: [ne.value, ...["bias", "dark_flat"].map((e) => ({
								value: e,
								label: F(a)("assetLibrary.values." + e)
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
						w.value ? (V(), H("p", ww, M(_e(w.value)), 1)) : q("", !0),
						C.value ? (V(), U(RC, {
							key: C.value,
							usage: C.value,
							excluded: [_.value],
							selected: w.value ? [w.value] : [],
							onPick: n[9] ||= (e) => ve(e, "source")
						}, null, 8, [
							"usage",
							"excluded",
							"selected"
						])) : q("", !0),
						W("label", Tw, [Jn(W("input", {
							"onUpdate:modelValue": n[10] ||= (e) => D.value = e,
							type: "checkbox"
						}, null, 512), [[ss, D.value]]), K(M(F(a)("assetLibrary.flatConfirmed")), 1)])
					], 64)) : q("", !0)
				], 64)) : q("", !0),
				e.kind === "assignments" ? (V(), H(B, { key: 7 }, [
					W("p", null, [W("strong", null, M(r.targetName), 1)]),
					ue.value ? (V(), H("div", Ew, [(V(!0), H(B, null, ei(F(kC), (e) => (V(), H("small", { key: e }, M(F(a)("assetLibrary.fields." + e)) + " · " + M(ue.value.attributes[e] ?? F(a)("assetLibrary.values.unknown")), 1))), 128))])) : q("", !0),
					o.value ? (V(), H(B, { key: 1 }, [W("label", Dw, M(F(a)("assetLibrary.master")), 1), G(F(jS), {
						id: "ap-calibration-master",
						value: y.value,
						options: he(F(b)),
						label: F(a)("assetLibrary.master"),
						disabled: F(k),
						onChange: n[11] ||= (e) => y.value = e
					}, null, 8, [
						"value",
						"options",
						"label",
						"disabled"
					])], 64)) : (V(), H(B, { key: 2 }, [de.value.size ? (V(), H("p", Ow, M(F(a)("assetLibrary.assignedUsages")), 1)) : q("", !0), (V(!0), H(B, null, ei(fe.value, (e) => (V(), H(B, { key: e }, [W("label", { for: "ap-calibration-" + e }, M(F(a)("assetLibrary.calibrationUse." + e)), 9, kw), G(F(jS), {
						id: "ap-calibration-" + e,
						value: x.value[e] || "",
						options: he(e),
						label: F(a)("assetLibrary.calibrationUse." + e),
						disabled: F(k) || he(e).length === 1,
						onChange: (t) => x.value[e] = t
					}, null, 8, [
						"id",
						"value",
						"options",
						"label",
						"disabled",
						"onChange"
					])], 64))), 128))], 64)),
					(V(!0), H(B, null, ei(me.value, ({ master: e, asset: t }) => (V(), H(B, { key: e.id }, [t ? (V(), H("div", Aw, [W("strong", null, M(t.name), 1), (V(!0), H(B, null, ei(F(kC), (e) => (V(), H("small", { key: e }, M(F(a)("assetLibrary.fields." + e)) + " · " + M(t.attributes[e] ?? F(a)("assetLibrary.values.unknown")), 1))), 128))])) : q("", !0)], 64))), 128))
				], 64)) : q("", !0),
				e.kind === "placements" ? (V(), H(B, { key: 8 }, [
					r.targetName ? (V(), H("p", jw, [W("strong", null, M(r.targetName), 1)])) : q("", !0),
					W("label", Mw, M(F(a)("assetLibrary.project")), 1),
					G(F(jS), {
						id: "ap-placement-project",
						value: p.value,
						options: ie.value,
						label: F(a)("assetLibrary.project"),
						disabled: F(k) || !!e.row,
						onChange: n[12] ||= (e) => {
							p.value = e, m.value = "";
						}
					}, null, 8, [
						"value",
						"options",
						"label",
						"disabled"
					]),
					W("label", null, [K(M(F(a)("assetLibrary.position")), 1), Jn(W("input", {
						"onUpdate:modelValue": n[13] ||= (e) => T.value = e,
						type: "number",
						min: "0",
						step: "1"
					}, null, 512), [[
						os,
						T.value,
						void 0,
						{ number: !0 }
					]])])
				], 64)) : q("", !0),
				e.kind === "masters" || e.kind === "placements" ? (V(), H(B, { key: 9 }, [W("label", Nw, M(F(a)("assetLibrary.folder")), 1), G(F(jS), {
					id: "ap-placement-folder",
					value: m.value,
					options: se.value,
					label: F(a)("assetLibrary.folder"),
					disabled: F(k),
					onChange: n[14] ||= (e) => m.value = e
				}, null, 8, [
					"value",
					"options",
					"label",
					"disabled"
				])], 64)) : q("", !0)
			], 8, lw),
			F(A) ? (V(), U(MC, {
				key: 0,
				error: F(A),
				retry: F(A).code === "REVISION_CONFLICT" ? we : void 0
			}, null, 8, ["error", "retry"])) : q("", !0),
			s.value ? (V(), H("div", Pw, [
				W("strong", null, M(F(a)("assetLibrary.latestVersion")), 1),
				W("pre", null, M(JSON.stringify(s.value, null, 2)), 1),
				W("button", {
					type: "button",
					onClick: Te
				}, M(F(a)("assetLibrary.keepDraft")), 1)
			])) : q("", !0),
			W("div", Fw, [
				W("button", {
					type: "submit",
					disabled: F(k) || !Se.value || !!s.value
				}, M(F(a)("assetLibrary." + (te.value ? "confirm" : "save"))), 9, Iw),
				W("button", {
					type: "button",
					disabled: F(k),
					onClick: De
				}, M(F(a)("storage.cancel")), 9, Lw),
				o.value ? (V(), H("button", {
					key: 0,
					type: "button",
					class: "ap-assets-danger",
					disabled: F(k),
					onClick: Ee
				}, M(F(a)("assetLibrary.remove")), 9, Rw)) : q("", !0)
			])
		], 32));
	}
}), Bw = ["aria-label"], Vw = [
	"aria-level",
	"aria-expanded",
	"aria-selected",
	"tabindex",
	"data-tree-id",
	"draggable",
	"onFocus",
	"onKeydown",
	"onClick",
	"onDragstart",
	"onDragover",
	"onDrop"
], Hw = ["title"], Uw = { key: 1 }, Ww = { key: 2 }, Gw = /* @__PURE__ */ R({
	__name: "LibraryTree",
	props: {
		entries: {},
		selected: {},
		query: {},
		canDrop: { type: Boolean }
	},
	emits: [
		"select",
		"over",
		"drop",
		"drag",
		"dragEnd"
	],
	setup(e, { emit: t }) {
		let n = e, r = t, { t: i } = Z(), a = /* @__PURE__ */ N(/* @__PURE__ */ new Set()), o = /* @__PURE__ */ N(""), s = /* @__PURE__ */ N();
		function c(e, t) {
			let n = new Set(a.value);
			t ? n.add(e) : n.delete(e), a.value = n;
		}
		let l = Y(() => {
			let e = n.query?.trim().toLocaleLowerCase();
			if (!e) return n.entries;
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
			return t(n.entries);
		}), u = (e) => !!n.query?.trim() || a.value.has(e), d = Y(() => {
			let e = [];
			function t(n, r, i) {
				for (let a of n) e.push({
					entry: a,
					level: r,
					parent: i
				}), a.children && u(a.id) && t(a.children, r + 1, a.id);
			}
			return t(l.value, 1), e;
		}), f = Y(() => d.value.some((e) => e.entry.id === o.value) ? o.value : d.value[0]?.entry.id);
		async function p(e) {
			if (!e) return;
			o.value = e, await In();
			let t = s.value?.querySelectorAll("[data-tree-id]");
			Array.from(t ?? []).find((t) => t.dataset.treeId === e)?.focus();
		}
		function m(e, t) {
			let { entry: r, parent: i } = d.value[t], a;
			switch (e.key) {
				case "ArrowUp":
					a = d.value[t - 1]?.entry.id;
					break;
				case "ArrowDown":
					a = d.value[t + 1]?.entry.id;
					break;
				case "Home":
					a = d.value[0]?.entry.id;
					break;
				case "End":
					a = d.value.at(-1)?.entry.id;
					break;
				case "ArrowRight":
					r.children && !u(r.id) ? c(r.id, !0) : a = r.children?.[0]?.id;
					break;
				case "ArrowLeft":
					r.children && u(r.id) && !n.query ? c(r.id, !1) : a = i;
					break;
				default: return;
			}
			e.preventDefault(), p(a);
		}
		function h(e) {
			o.value = e.id, e.children && c(e.id, !u(e.id)), r("select", e);
		}
		return (t, n) => (V(), H("ul", {
			ref_key: "tree",
			ref: s,
			class: "ap-assets-list",
			role: "tree",
			"aria-label": F(i)("assetLibrary.folderTree")
		}, [(V(!0), H(B, null, ei(d.value, ({ entry: t, level: a }, s) => (V(), H("li", {
			key: t.id,
			role: "none"
		}, [W("button", {
			type: "button",
			role: "treeitem",
			class: "ap-tree-row ap-assets-tree-row",
			"aria-level": a,
			"aria-expanded": t.children ? u(t.id) : void 0,
			"aria-selected": e.selected === t.id,
			style: ue({ paddingInlineStart: Math.min(50, 6 + (a - 1) * 12) + "px" }),
			tabindex: f.value === t.id ? 0 : -1,
			"data-tree-id": t.id,
			draggable: !!t.placement || !!t.folder,
			onFocus: (e) => o.value = t.id,
			onKeydown: (e) => m(e, s),
			onClick: (e) => h(t),
			onDragstart: (e) => r("drag", e, t),
			onDragend: n[0] ||= (e) => r("dragEnd"),
			onDragover: (n) => e.canDrop && t.folder && r("over", n, t),
			onDrop: (n) => e.canDrop && t.folder && r("drop", n, t)
		}, [
			t.children ? (V(), U(F(Zv), { key: 0 })) : q("", !0),
			W("span", { title: t.label }, M(t.label), 9, Hw),
			t.placement?.collection_id || t.collection ? (V(), H("small", Uw, M(F(i)("assetLibrary.collection")), 1)) : t.master ? (V(), H("small", Ww, M(F(i)("assetLibrary.master")), 1)) : q("", !0)
		], 44, Vw)]))), 128))], 8, Bw));
	}
}), Kw = "/astrophoto/v1", qw = (e) => e === "reference" || e === "copy", Jw = (e) => typeof e == "number" && Number.isFinite(e) && e >= 0, Yw = (e) => e === null || Jw(e), Xw = (e, t) => t.every((t) => typeof e[t] == "string");
function Zw(e) {
	return $(e) && Xw(e, ["operation_id", "phase"]) && (e.kind === "migration" || e.kind === "import");
}
async function Qw(e) {
	let t = await If(Kw + "/storage", "GET", void 0, e);
	if ($(t) && typeof t.reason == "string") throw new Q(t.reason);
	if (!$(t) || !["ready", "degraded"].includes(String(t.status)) || !$(t.data_root) || !Xw(t.data_root, ["path", "source"]) || !$(t.database) || !Xw(t.database, ["assets"]) || !$(t.imports) || !qw(t.imports.default_mode) || !Jw(t.imports.revision) || typeof t.default_workspace_id != "string" || !Array.isArray(t.workspaces) || !t.workspaces.every((e) => $(e) && Xw(e, [
		"id",
		"name",
		"root_path",
		"status"
	]) && typeof e.enabled == "boolean" && typeof e.is_default == "boolean" && Jw(e.revision) && Yw(e.free_bytes)) || !$(t.cache) || !Xw(t.cache, ["path", "status"]) || !Jw(t.cache.max_size_gb) || !Yw(t.cache.used_bytes) || !$(t.capabilities) || typeof t.capabilities.write != "boolean" || typeof t.capabilities.import != "boolean" || !Array.isArray(t.operations) || !t.operations.every(Zw)) throw new Q("schema");
	return t;
}
async function $w(e, t, n, r = "POST") {
	let i = await If(Kw + e, r, t, n);
	if (!$(i) || typeof i.request_id != "string") throw new Q("schema");
	return i;
}
async function eT(e, t) {
	let n = await $w("/storage/migrations/preflight", e, t);
	if (typeof n.plan_id != "string" || !Array.isArray(n.options) || !Array.isArray(n.groups) || !Array.isArray(n.cleanup_files)) throw new Q("schema");
	return n;
}
async function tT(e, t, n) {
	let r = await $w(e === "import" ? "/assets/import" : "/storage/migrations", t, n);
	if (typeof r.operation_id != "string") throw new Q("schema");
	return {
		operation_id: r.operation_id,
		kind: e,
		phase: "queued"
	};
}
function nT(e) {
	return (e.kind === "import" ? "/assets/imports" : "/storage/migrations") + "/" + encodeURIComponent(e.operation_id);
}
function rT(e) {
	return !$(e) || ![
		"processed",
		"total",
		"registered",
		"copied",
		"failed",
		"skipped",
		"retryable"
	].every((t) => !(t in e) || Jw(e[t])) ? !1 : e.errors === void 0 || Array.isArray(e.errors) && e.errors.every((e) => $(e) && Jw(e.entry) && typeof e.code == "string");
}
async function iT(e, t) {
	let n = await If(Kw + nT(e), "GET", void 0, t);
	if (!$(n) || n.operation_id !== e.operation_id || n.kind !== e.kind || !rT(n.receipt) || n.error !== null && (!$(n.error) || typeof n.error.code != "string") || n.effective_import_mode !== null && !qw(n.effective_import_mode) || !Zw(n)) throw new Q("schema");
	return n;
}
// src/features/storage/StorageError.vue?vue&type=script&setup=true&lang.ts
var aT = {
	role: "alert",
	class: "ap-storage-error"
}, oT = /* @__PURE__ */ R({
	__name: "StorageError",
	props: { code: {} },
	setup(e) {
		let { t } = Z();
		return (n, r) => (V(), H("p", aT, [K(M(F(t)("storage.errors." + e.code, F(t)("storage.error"))) + " ", 1), W("code", null, M(e.code), 1)]));
	}
});
// src/features/storage/useStorageAction.ts
function sT() {
	let e = new AbortController(), t = /* @__PURE__ */ N(!1), n = /* @__PURE__ */ N("");
	Ae(() => e.abort());
	async function r(r) {
		let { signal: i } = e;
		if (!(i.aborted || t.value)) {
			t.value = !0, n.value = "";
			try {
				await r(i);
			} catch (e) {
				i.aborted || (n.value = e instanceof Q ? e.code : "network");
			} finally {
				i.aborted || (t.value = !1);
			}
		}
	}
	return {
		pending: t,
		error: n,
		run: r
	};
}
// src/features/storage/OperationProgress.vue?vue&type=script&setup=true&lang.ts
var cT = ["aria-label"], lT = { role: "status" }, uT = ["data-state"], dT = [
	"aria-label",
	"value",
	"max"
], fT = { key: 0 }, pT = { key: 1 }, mT = {
	key: 2,
	class: "ap-storage-path"
}, hT = { key: 3 }, gT = ["disabled"], _T = ["disabled"], vT = ["disabled"], yT = ["disabled"], bT = /* @__PURE__ */ R({
	__name: "OperationProgress",
	props: {
		job: {},
		onTerminal: { type: Function },
		onRetryRemaining: { type: Function }
	},
	setup(e) {
		let n = e, { t: r } = Z(), i = /* @__PURE__ */ P(), a = /* @__PURE__ */ N(""), o = /* @__PURE__ */ N(0), { pending: s, error: c, run: l } = sT(), u = [
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
		L([
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
					let r = await iT({
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
		let f = Y(() => i.value?.phase ?? "queued"), p = Y(() => i.value?.receipt), m = Y(() => f.value === "completed" && typeof p.value?.failed == "number" && p.value.failed > 0), h = Y(() => a.value || c.value || i.value?.error?.code), g = Y(() => typeof p.value?.retryable == "number" ? p.value.retryable : 0);
		function _(e) {
			l(async (t) => {
				await $w(`${nT(n.job)}/${e}`, {}, t), t.aborted || o.value++;
			});
		}
		function v() {
			l(async (e) => {
				let t = await $w(`/library/imports/${encodeURIComponent(n.job.operation_id)}/retry-remaining`, {}, e);
				if (typeof t.operation_id != "string") throw new Q("schema");
				e.aborted || n.onRetryRemaining?.(t.operation_id);
			});
		}
		function y() {
			let e = nT(n.job) + "/discard-target";
			l(async (n) => {
				let i = await $w(e, {}, n);
				if (!Array.isArray(i.files) || !i.files.every((e) => typeof e == "string")) throw new Q("schema");
				let a = await t.extensionManager.dialog.confirm({
					key: "astrophoto.discard-migration-target",
					type: "delete",
					title: r("storage.discardTarget"),
					message: r("storage.discardTargetHelp"),
					itemList: i.files.slice(0, 50)
				});
				n.aborted || a !== !0 || (await $w(e, { confirm: !0 }, n), n.aborted || o.value++);
			});
		}
		return (t, n) => (V(), H("section", {
			class: "ap-operation",
			"aria-label": F(r)("storage.operation")
		}, [
			W("div", lT, [
				W("strong", {
					class: "ap-storage-badge",
					"data-state": f.value
				}, M(F(r)("storage.phases." + (m.value ? "partial" : f.value), f.value)), 9, uT),
				W("p", null, [W("code", null, M(e.job.operation_id), 1)]),
				typeof p.value?.processed == "number" && typeof p.value.total == "number" ? (V(), H("progress", {
					key: 0,
					"aria-label": F(r)("storage.operation"),
					value: p.value.processed,
					max: Math.max(1, p.value.total)
				}, null, 8, dT)) : q("", !0),
				(V(), H(B, null, ei(d, (e) => (V(), H(B, { key: e }, [typeof p.value?.[e] == "number" || typeof p.value?.[e] == "string" ? (V(), H("p", fT, M(F(r)("storage." + e)) + " " + M(p.value[e]), 1)) : q("", !0)], 64))), 64)),
				typeof p.value?.completed_bytes == "number" ? (V(), H("p", pT, M(F(r)("storage.movedBytes")) + " " + M(F(FS)(p.value.completed_bytes)), 1)) : q("", !0),
				typeof p.value?.target_path == "string" ? (V(), H("p", mT, M(F(r)("storage.migrationTarget")) + " " + M(p.value.target_path), 1)) : q("", !0),
				Array.isArray(p.value?.cleanup_remaining) && p.value.cleanup_remaining.length ? (V(), H("p", hT, M(F(r)("storage.cleanupCount")) + " " + M(p.value.cleanup_remaining.length), 1)) : q("", !0)
			]),
			h.value ? (V(), U(oT, {
				key: 0,
				code: h.value
			}, null, 8, ["code"])) : q("", !0),
			Array.isArray(p.value?.errors) ? (V(!0), H(B, { key: 1 }, ei(p.value.errors, (e) => (V(), H("div", { key: e.entry }, [K("#" + M(e.entry) + " ", 1), G(oT, { code: e.code }, null, 8, ["code"])]))), 128)) : q("", !0),
			f.value !== "committed" && !u.includes(f.value) ? (V(), H("button", {
				key: 2,
				type: "button",
				class: "ap-storage-button",
				disabled: F(s),
				onClick: n[0] ||= (e) => _("cancel")
			}, M(F(r)("storage.cancel")), 9, gT)) : q("", !0),
			a.value ? (V(), H("button", {
				key: 3,
				type: "button",
				class: "ap-storage-button",
				onClick: n[1] ||= (e) => o.value++
			}, M(F(r)("actions.refresh")), 1)) : q("", !0),
			i.value?.error && !u.includes(f.value) ? (V(), H("button", {
				key: 4,
				type: "button",
				class: "ap-storage-button",
				disabled: F(s),
				onClick: n[2] ||= (e) => _("retry")
			}, M(F(r)("storage.retry")), 9, _T)) : q("", !0),
			e.job.kind === "import" && e.onRetryRemaining && u.includes(f.value) && g.value > 0 ? (V(), H("button", {
				key: 5,
				type: "button",
				class: "ap-storage-button",
				disabled: F(s),
				onClick: v
			}, M(F(r)("assetLibrary.retryRemaining", { count: g.value })), 9, vT)) : q("", !0),
			e.job.kind === "migration" && p.value?.target_cleanup_available === !0 && !p.value?.target_cleanup ? (V(), H("button", {
				key: 6,
				type: "button",
				class: "ap-storage-button",
				disabled: F(s),
				onClick: y
			}, M(F(r)("storage.discardTarget")), 9, yT)) : q("", !0)
		], 8, cT));
	}
}), xT = { class: "ap-assets-dialog-content" }, ST = {
	key: 1,
	role: "status"
}, CT = { class: "ap-assets-toolbar" }, wT = { key: 0 }, TT = ["disabled"], ET = {
	key: 0,
	role: "alert"
}, DT = { class: "ap-assets-toolbar" }, OT = ["disabled"], kT = ["disabled"], AT = ["disabled"], jT = ["disabled"], MT = { class: "ap-assets-toolbar" }, NT = ["disabled"], PT = {
	key: 2,
	class: "ap-assets-list"
}, FT = ["title"], IT = { key: 0 }, LT = [
	"disabled",
	"aria-label",
	"onClick"
], RT = {
	key: 3,
	class: "ap-assets-toolbar"
}, zT = ["disabled"], BT = ["disabled"], VT = {
	key: 4,
	role: "alert"
}, HT = { class: "ap-assets-form" }, UT = { for: "ap-import-class" }, WT = { for: "ap-import-project" }, GT = {
	key: 5,
	role: "status"
}, KT = {
	key: 6,
	role: "status"
}, qT = { key: 0 }, JT = { class: "ap-assets-toolbar" }, YT = ["disabled"], XT = ["disabled"], ZT = 30, QT = /* @__PURE__ */ R({
	__name: "ImportAssets",
	props: {
		active: { type: Boolean },
		projects: {},
		openStorage: { type: Function }
	},
	emits: ["changed", "close"],
	setup(e, { expose: t, emit: n }) {
		let r = e, i = n, { t: a } = Z(), { resource: o, refresh: s } = Ry(Qw), c = /* @__PURE__ */ P([]), l = /* @__PURE__ */ N(), u = /* @__PURE__ */ N(), d = /* @__PURE__ */ N(0), f = /* @__PURE__ */ N(""), p = /* @__PURE__ */ N(""), m = /* @__PURE__ */ N(""), h = /* @__PURE__ */ P(), g = /* @__PURE__ */ N(), _ = /* @__PURE__ */ P(), v = /* @__PURE__ */ P(), y = /* @__PURE__ */ P(), b = /* @__PURE__ */ N(!1), x = /* @__PURE__ */ N(0), S, C = crypto.randomUUID(), w = /* @__PURE__ */ N(!1);
		Ae(() => {
			S?.abort();
			for (let e of c.value) ae(e);
		});
		let T = Y(() => o.value.state === "ready" ? o.value.data : void 0), E = Y(() => T.value?.imports.default_mode), D = Y(() => T.value?.workspaces.find((e) => e.is_default)), O = Y(() => T.value?.capabilities.import && (E.value === "reference" || D.value?.status === "online" || D.value?.status === "partial")), k = Y(() => c.value.slice(d.value * ZT, (d.value + 1) * ZT)), ee = Y(() => c.value.some((e) => E.value === "reference" ? !e.source : !e.file));
		function A() {
			h.value = void 0, g.value = void 0, _.value = void 0, w.value || (C = crypto.randomUUID());
		}
		L([p, m], A), L(() => r.active, (e, t) => {
			e && t === !1 && s();
		}), L(() => T.value?.imports.revision, (e) => {
			!w.value && g.value !== void 0 && e !== void 0 && e !== g.value && A();
		});
		function j(e) {
			b.value || w.value || E.value !== "copy" || (c.value = [...c.value, ...Array.from(e, (e) => ({
				id: crypto.randomUUID(),
				name: e.webkitRelativePath || e.name,
				file: e
			}))], A());
		}
		function te(e) {
			let t = e.target;
			t.files && j(t.files), t.value = "";
		}
		function ne() {
			let e = f.value.trim();
			!e || b.value || w.value || E.value !== "reference" || (c.value = [...c.value, {
				id: crypto.randomUUID(),
				name: e,
				source: e
			}], f.value = "", A());
		}
		function re(e) {
			let t = c.value.find((t) => t.id === e);
			t && ae(t), c.value = c.value.filter((t) => t.id !== e), d.value = Math.min(d.value, Math.max(0, Math.ceil(c.value.length / ZT) - 1)), A();
		}
		function ie() {
			for (let e of c.value) ae(e);
			c.value = [], d.value = 0, A();
		}
		function ae(e) {
			!w.value && e.uploadId && Ny(e.uploadId).catch(() => {});
		}
		function oe(e) {
			E.value === "copy" && !v.value && !b.value && e.dataTransfer?.types.includes("Files") && e.preventDefault();
		}
		function se(e) {
			E.value !== "copy" || v.value || b.value || !e.dataTransfer?.files.length || (e.preventDefault(), j(e.dataTransfer.files));
		}
		async function ce(e) {
			if (b.value) return;
			S = new AbortController();
			let { signal: t } = S;
			b.value = !0, y.value = void 0;
			try {
				await e(t);
			} catch (e) {
				t.aborted || (y.value = e);
			} finally {
				S = void 0, b.value = !1;
			}
		}
		function le() {
			if (!T.value || !O.value || !c.value.length || ee.value) return;
			let e = T.value;
			A(), x.value = 0, ce(async (t) => {
				let n = {
					settings_revision: e.imports.revision,
					allow_duplicate: !0
				};
				if (p.value && (n.project_id = p.value), m.value && (n.attributes = m.value === "video" ? { file_kind: "video" } : { role: m.value }), e.imports.default_mode === "copy") {
					let e = [];
					for (let n of c.value) {
						if (t.throwIfAborted(), !n.uploadId) {
							let e = crypto.randomUUID();
							try {
								n.uploadId = await My(e, n.file, t);
							} catch (t) {
								throw Ny(e).catch(() => {}), t;
							}
						}
						e.push(n.uploadId), x.value++;
					}
					n.uploads = e;
				} else n.sources = c.value.map((e) => e.source);
				let r = await jy(n, t);
				t.throwIfAborted(), h.value = r, _.value = {
					...n,
					preview_id: r.preview_id
				}, g.value = e.imports.revision;
			});
		}
		function ue() {
			let e = _.value;
			!e || !h.value || h.value.file_count <= h.value.failed || ce(async (t) => {
				try {
					if (!w.value && (await Qw(t)).imports.revision !== e.settings_revision) throw new Q("SETTINGS_CHANGED");
					w.value = !0, v.value = await tT("import", {
						...e,
						idempotency_key: C
					}, t);
				} catch (e) {
					throw e instanceof Q && ["SETTINGS_CHANGED", "REVISION_CONFLICT"].includes(e.code) ? (w.value = !1, A(), s()) : e instanceof Q && e.status && e.status < 500 && (w.value = !1), e;
				}
			});
		}
		function de(e) {
			v.value = {
				operation_id: e,
				kind: "import",
				phase: "queued"
			};
		}
		async function fe() {
			b.value || (v.value || !c.value.length || await MS(a("assetLibrary.discard"), a("assetLibrary.discardConfirm"))) && i("close");
		}
		return t({ discardDraft: fe }), (t, n) => (V(), H("section", xT, [
			F(o).state === "error" ? (V(), U(MC, {
				key: 0,
				error: F(o).error,
				retry: F(s)
			}, null, 8, ["error", "retry"])) : T.value ? (V(), H(B, { key: 2 }, [W("div", CT, [W("div", null, [W("strong", null, M(F(a)("assetLibrary.currentPolicy", { mode: F(a)("assetLibrary." + E.value) })), 1), E.value === "copy" ? (V(), H("small", wT, M(F(a)("assetLibrary.workspace", { name: D.value?.name || "—" })), 1)) : q("", !0)]), W("button", {
				type: "button",
				disabled: b.value,
				onClick: n[0] ||= (...t) => e.openStorage && e.openStorage(...t)
			}, M(F(a)("assetLibrary.openStorage")), 9, TT)]), O.value ? q("", !0) : (V(), H("p", ET, M(F(a)("assetLibrary.storageUnavailable")), 1))], 64)) : (V(), H("p", ST, M(F(a)("states.loading")), 1)),
			v.value ? (V(), U(bT, {
				key: v.value.operation_id,
				job: v.value,
				"on-terminal": () => i("changed"),
				"on-retry-remaining": de
			}, null, 8, ["job", "on-terminal"])) : (V(), H(B, { key: 4 }, [
				E.value === "copy" ? (V(), H("div", {
					key: 0,
					class: "ap-assets-picker",
					onDragover: oe,
					onDrop: se
				}, [
					W("input", {
						ref_key: "filePicker",
						ref: l,
						type: "file",
						multiple: "",
						hidden: "",
						onChange: te
					}, null, 544),
					W("input", {
						ref_key: "directoryPicker",
						ref: u,
						type: "file",
						multiple: "",
						webkitdirectory: "",
						hidden: "",
						onChange: te
					}, null, 544),
					W("div", DT, [W("button", {
						type: "button",
						disabled: b.value || w.value || !O.value,
						onClick: n[1] ||= (e) => l.value?.click()
					}, M(F(a)("assetLibrary.pickFiles")), 9, OT), W("button", {
						type: "button",
						disabled: b.value || w.value || !O.value,
						onClick: n[2] ||= (e) => u.value?.click()
					}, M(F(a)("assetLibrary.pickDirectory")), 9, kT)])
				], 32)) : E.value === "reference" ? (V(), H("form", {
					key: 1,
					class: "ap-assets-form",
					onSubmit: gs(ne, ["prevent"])
				}, [
					W("p", null, M(F(a)("assetLibrary.referencePicker")), 1),
					W("label", null, [K(M(F(a)("assetLibrary.authorizedPath")), 1), Jn(W("input", {
						"onUpdate:modelValue": n[3] ||= (e) => f.value = e,
						disabled: b.value
					}, null, 8, AT), [[os, f.value]])]),
					W("button", {
						type: "submit",
						disabled: b.value || w.value || !O.value || !f.value.trim()
					}, M(F(a)("assetLibrary.addPath")), 9, jT)
				], 32)) : q("", !0),
				W("div", MT, [W("strong", null, M(F(a)("assetLibrary.pendingCount", { count: c.value.length })), 1), W("button", {
					type: "button",
					disabled: b.value || w.value || !c.value.length,
					onClick: ie
				}, M(F(a)("assetLibrary.clearSelection")), 9, NT)]),
				k.value.length ? (V(), H("ul", PT, [(V(!0), H(B, null, ei(k.value, (e) => (V(), H("li", {
					key: e.id,
					class: "ap-assets-row"
				}, [W("span", {
					class: "ap-assets-truncate",
					title: e.name
				}, [K(M(e.name), 1), e.file ? (V(), H("small", IT, M(F(PS)(e.file.size)), 1)) : q("", !0)], 8, FT), W("button", {
					type: "button",
					disabled: b.value || w.value,
					"aria-label": F(a)("assetLibrary.removeEntry", { name: e.name }),
					onClick: (t) => re(e.id)
				}, M(F(a)("assetLibrary.remove")), 9, LT)]))), 128))])) : q("", !0),
				c.value.length > ZT ? (V(), H("div", RT, [
					W("button", {
						type: "button",
						disabled: d.value === 0,
						onClick: n[4] ||= (e) => d.value--
					}, M(F(a)("assetLibrary.previous")), 9, zT),
					W("span", null, M(d.value + 1) + " / " + M(Math.ceil(c.value.length / ZT)), 1),
					W("button", {
						type: "button",
						disabled: (d.value + 1) * ZT >= c.value.length,
						onClick: n[5] ||= (e) => d.value++
					}, M(F(a)("assetLibrary.next")), 9, BT)
				])) : q("", !0),
				ee.value ? (V(), H("p", VT, M(F(a)("assetLibrary.selectionModeChanged")), 1)) : q("", !0),
				W("div", HT, [
					W("label", UT, M(F(a)("assetLibrary.classification")), 1),
					G(F(jS), {
						id: "ap-import-class",
						label: F(a)("assetLibrary.classification"),
						value: m.value,
						disabled: b.value || w.value,
						options: [
							"",
							"raw",
							"master_frame",
							"video"
						].map((e) => ({
							value: e,
							label: F(a)(e === "raw" ? "assetLibrary.subframes" : "assetLibrary.values." + (e || "unspecified"))
						})),
						onChange: n[6] ||= (e) => m.value = e
					}, null, 8, [
						"label",
						"value",
						"disabled",
						"options"
					]),
					W("label", WT, M(F(a)("assetLibrary.project")), 1),
					G(F(jS), {
						id: "ap-import-project",
						label: F(a)("assetLibrary.project"),
						value: p.value,
						disabled: b.value || w.value,
						options: [{
							value: "",
							label: F(a)("assetLibrary.values.unspecified")
						}, ...e.projects.map((e) => ({
							value: e.id,
							label: e.name
						}))],
						onChange: n[7] ||= (e) => p.value = e
					}, null, 8, [
						"label",
						"value",
						"disabled",
						"options"
					])
				]),
				b.value ? (V(), H("p", GT, M(F(a)("assetLibrary.working", {
					count: x.value,
					total: c.value.length
				})), 1)) : q("", !0),
				h.value ? (V(), H("div", KT, [W("p", null, M(F(a)("assetLibrary.previewResult", {
					passed: h.value.file_count - h.value.failed - (h.value.skipped || 0),
					failed: h.value.failed,
					skipped: h.value.skipped || 0,
					size: F(PS)(h.value.size_bytes)
				})), 1), h.value.errors?.length ? (V(), H("ul", qT, [(V(!0), H(B, null, ei(h.value.errors, (e) => (V(), H("li", { key: e.entry }, M(e.entry) + " · " + M(F(a)("assetLibrary.errors." + e.code, e.code)), 1))), 128))])) : q("", !0)])) : q("", !0),
				y.value ? (V(), U(MC, {
					key: 7,
					error: y.value
				}, null, 8, ["error"])) : q("", !0),
				W("div", JT, [
					W("button", {
						type: "button",
						disabled: b.value || w.value || !O.value || ee.value || !c.value.length,
						onClick: le
					}, M(F(a)("assetLibrary.previewImport")), 9, YT),
					W("button", {
						type: "button",
						disabled: b.value || !h.value || h.value.file_count <= h.value.failed,
						onClick: ue
					}, M(F(a)("assetLibrary.confirmImport")), 9, XT),
					b.value ? (V(), H("button", {
						key: 0,
						type: "button",
						onClick: n[8] ||= (e) => F(S)?.abort()
					}, M(F(a)("storage.cancel")), 1)) : q("", !0)
				])
			], 64)),
			v.value ? (V(), H("button", {
				key: 5,
				type: "button",
				onClick: n[9] ||= (e) => i("close")
			}, M(F(a)("assetLibrary.allAssets")), 1)) : q("", !0)
		]));
	}
}), $T = { class: "ap-assets-dialog-content" }, eE = ["disabled"], tE = {
	key: 0,
	role: "status"
}, nE = {
	key: 2,
	role: "status"
}, rE = { class: "ap-assets-list" }, iE = { key: 0 }, aE = { class: "ap-assets-toolbar" }, oE = ["disabled", "onClick"], sE = ["disabled", "onClick"], cE = /* @__PURE__ */ R({
	__name: "LibraryApprovals",
	emits: ["applied"],
	setup(e, { emit: t }) {
		let n = t, { t: r } = Z(), { resource: i, refresh: a } = Ry(Iy), { pending: o, run: s, error: c } = NS(), l = Y(() => i.value.state === "ready" ? i.value.data.filter((e) => e.status === "pending") : []);
		function u(e, t) {
			s(async (i) => {
				(!t || await MS(r("assetLibrary.approve"), r("assetLibrary.approveConfirm"), e.kind + " · " + e.method)) && (await Ly(e.id, t, i), i.aborted || (a(), t && n("applied")));
			});
		}
		return (e, t) => (V(), H("div", $T, [
			W("button", {
				type: "button",
				disabled: F(o),
				onClick: t[0] ||= (...e) => F(a) && F(a)(...e)
			}, M(F(r)("actions.refresh")), 9, eE),
			F(i).state === "loading" ? (V(), H("p", tE, M(F(r)("states.loading")), 1)) : F(i).state === "error" ? (V(), U(MC, {
				key: 1,
				error: F(i).error,
				retry: F(a)
			}, null, 8, ["error", "retry"])) : l.value.length ? q("", !0) : (V(), H("p", nE, M(F(r)("assetLibrary.noApprovals")), 1)),
			F(c) ? (V(), U(MC, {
				key: 3,
				error: F(c)
			}, null, 8, ["error"])) : q("", !0),
			W("ul", rE, [(V(!0), H(B, null, ei(l.value, (e) => (V(), H("li", {
				key: e.id,
				class: "ap-assets-approval"
			}, [
				W("strong", null, M(e.kind) + " · " + M(e.method), 1),
				e.record_id ? (V(), H("p", iE, M(e.record_id), 1)) : q("", !0),
				W("pre", null, M(JSON.stringify(e.payload, null, 2)), 1),
				W("div", aE, [W("button", {
					type: "button",
					disabled: F(o),
					onClick: (t) => u(e, !0)
				}, M(F(r)("assetLibrary.approve")), 9, oE), W("button", {
					type: "button",
					disabled: F(o),
					onClick: (t) => u(e, !1)
				}, M(F(r)("assetLibrary.deny")), 9, sE)])
			]))), 128))])
		]));
	}
});
// src/features/assets/tree.ts
function lE(e, t, n, r, i, a = []) {
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
var uE = {
	key: 0,
	class: "ap-assets-editor ap-scroll",
	role: "region",
	"aria-labelledby": "ap-assets-editor-title"
}, dE = { class: "ap-assets-toolbar" }, fE = {
	key: 1,
	class: "ap-assets-notice",
	role: "status"
}, pE = {
	id: "ap-asset-panel-projects",
	class: "ap-assets-view ap-scroll",
	role: "tabpanel",
	"aria-labelledby": "ap-asset-tab-projects"
}, mE = { class: "ap-assets-toolbar" }, hE = {
	key: 0,
	role: "status"
}, gE = {
	key: 1,
	role: "status"
}, _E = {
	key: 2,
	class: "ap-assets-list"
}, vE = [
	"aria-pressed",
	"title",
	"onClick"
], yE = { key: 0 }, bE = { class: "ap-assets-toolbar" }, xE = ["title"], SE = { key: 0 }, CE = { key: 0 }, wE = {
	key: 1,
	class: "ap-assets-toolbar"
}, TE = {
	key: 2,
	class: "ap-assets-toolbar"
}, EE = {
	id: "ap-asset-panel-allAssets",
	class: "ap-assets-view ap-scroll",
	role: "tabpanel",
	"aria-labelledby": "ap-asset-tab-allAssets"
}, DE = { class: "ap-assets-toolbar" }, OE = { class: "ap-assets-menu" }, kE = ["aria-label"], AE = { class: "ap-assets-search-row" }, jE = ["aria-label", "title"], ME = {
	key: 0,
	class: "ap-assets-filter-indicator",
	"aria-hidden": "true"
}, NE = {
	key: 0,
	role: "status"
}, PE = {
	key: 0,
	role: "status"
}, FE = ["for"], IE = ["aria-label", "title"], LE = { for: "ap-asset-order" }, RE = ["aria-pressed"], zE = { for: "ap-asset-group" }, BE = { class: "ap-assets-toolbar" }, VE = ["aria-label"], HE = ["aria-pressed", "onClick"], UE = {
	key: 0,
	class: "ap-assets-toolbar"
}, WE = {
	key: 1,
	role: "status"
}, GE = {
	key: 0,
	class: "ap-assets-empty",
	role: "status"
}, KE = {
	key: 1,
	class: "ap-assets-list"
}, qE = ["data-dragging"], JE = ["onToggle"], YE = ["title", "onDragstart"], XE = { class: "ap-assets-list" }, ZE = [
	"title",
	"onDragstart",
	"onClick"
], QE = {
	key: 1,
	class: "ap-assets-truncate"
}, $E = [
	"aria-label",
	"aria-expanded",
	"onClick"
], eD = {
	key: 0,
	class: "ap-assets-row-menu"
}, tD = ["onClick"], nD = ["onClick"], rD = ["onClick"], iD = ["onClick"], aD = ["onClick"], oD = { key: 0 }, sD = { class: "ap-assets-list" }, cD = ["data-dragging"], lD = [
	"aria-label",
	"checked",
	"onChange"
], uD = [
	"title",
	"onDragstart",
	"onContextmenu",
	"onClick"
], dD = [
	"aria-label",
	"aria-expanded",
	"onClick"
], fD = {
	key: 0,
	class: "ap-assets-row-menu"
}, pD = ["onClick"], mD = ["onClick"], hD = ["onClick"], gD = ["onClick"], _D = ["onClick"], vD = ["onClick"], yD = ["disabled", "onClick"], bD = ["disabled"], xD = {
	class: "ap-assets-view ap-scroll",
	"aria-labelledby": "ap-calibration-title"
}, SD = { class: "ap-assets-toolbar" }, CD = { id: "ap-calibration-title" }, wD = { class: "ap-assets-toolbar" }, TD = {
	key: 0,
	role: "status"
}, ED = {
	key: 1,
	class: "ap-assets-toolbar"
}, DD = "application/x-astrophoto-library", OD = /* @__PURE__ */ R({
	__name: "AssetsPanel",
	props: {
		active: { type: Boolean },
		openStorage: { type: Function }
	},
	setup(e, { expose: n }) {
		let r = e, { t: i } = Z(), a = ["projects", "allAssets"], o = /* @__PURE__ */ N("projects"), s = /* @__PURE__ */ N(!1), c = /* @__PURE__ */ N(""), l = /* @__PURE__ */ P(), u = /* @__PURE__ */ P(), d = /* @__PURE__ */ N(""), f = /* @__PURE__ */ N(""), p = /* @__PURE__ */ N(""), m = /* @__PURE__ */ N(""), h = /* @__PURE__ */ N(""), g = /* @__PURE__ */ N("name"), _ = /* @__PURE__ */ N(!1), v = /* @__PURE__ */ N(""), y = /* @__PURE__ */ N({}), b = /* @__PURE__ */ P(), x = /* @__PURE__ */ N(), S = /* @__PURE__ */ N(), C = /* @__PURE__ */ N(), w = /* @__PURE__ */ N(), T = /* @__PURE__ */ N(""), E = /* @__PURE__ */ N(""), D = /* @__PURE__ */ N(/* @__PURE__ */ new Set()), O = null, k, ee = /* @__PURE__ */ N(""), A = /* @__PURE__ */ N(""), j = /* @__PURE__ */ P(/* @__PURE__ */ new Map()), { resource: te, refresh: ne } = Ry(async (e) => {
			let [t, n, r, i, a, o, s] = await Promise.all([
				Ey("projects", {}, e),
				Ey("collections", {}, e),
				Ey("folders", {}, e),
				Ey("masters", {}, e),
				Ey("placements", {}, e),
				Ey("sessions", {}, e),
				Ey("assignments", {}, e)
			]), c = /* @__PURE__ */ new Set([...i.map((e) => e.asset_id), ...a.flatMap((e) => e.asset_id ? [e.asset_id] : [])]);
			return Se((await Promise.all([...c].map((t) => Dy("assets", t, e).catch((e) => {
				if (e instanceof Q && e.status === 404) return null;
				throw e;
			})))).filter((e) => e !== null)), {
				projects: t,
				collections: n,
				folders: r,
				masters: i,
				placements: a,
				sessions: o,
				assignments: s
			};
		}, !0), re = Y(() => ({
			...y.value,
			q: f.value.trim(),
			...h.value === "video" ? { file_kind: "video" } : h.value ? { role: h.value } : {},
			sort: (_.value ? "-" : "") + g.value
		})), { resource: ie, refresh: ae } = Ry(Y(() => {
			let e = re.value;
			return (t) => Ty("assets", e, t);
		})), oe = /* @__PURE__ */ P([]), se = /* @__PURE__ */ N(null), { run: ce, error: le, pending: ue } = NS(), { run: de, error: fe, pending: pe } = NS(), { run: me, error: ge } = NS(), { run: _e, error: ve, pending: ye } = NS(), be = /* @__PURE__ */ P([]), xe = /* @__PURE__ */ P();
		function Se(e) {
			if (!e.length) return;
			let t = new Map(j.value);
			for (let n of e) t.set(n.id, n);
			j.value = t;
		}
		L(ie, (e) => {
			e.state === "ready" && (oe.value = e.data.items, se.value = e.data.next, Se(e.data.items));
		});
		function Ce() {
			let e = se.value, t = re.value;
			e && ce(async (n) => {
				let r = await Ty("assets", {
					...t,
					after: e
				}, n);
				if (!(n.aborted || t !== re.value)) {
					if (r.next === e) throw new Q("schema");
					oe.value = [...oe.value, ...r.items], se.value = r.next, Se(r.items);
				}
			});
		}
		let we = Y(() => te.value.state === "ready" ? te.value.data : null), Te = Y(() => we.value?.projects ?? []), Ee = Y(() => we.value?.collections ?? []), De = Y(() => we.value?.folders ?? []), Oe = Y(() => we.value?.placements ?? []), ke = Y(() => we.value?.masters ?? []), je = Y(() => we.value?.assignments ?? []), Me = Y(() => we.value?.sessions ?? []), Ne = Y(() => Te.value.find((e) => e.id === c.value)), Pe = Y(() => new Map(Ee.value.map((e) => [e.id, e]))), Fe = Y(() => new Set(Ee.value.flatMap((e) => e.asset_ids)));
		L(Te, (e) => {
			e.some((e) => e.id === c.value) || (c.value = e[0]?.id ?? "", l.value = void 0);
		});
		let Ie = Y(() => Ne.value ? lE(De.value.filter((e) => e.project_id === c.value), Oe.value.filter((e) => e.project_id === c.value).sort((e, t) => (e.position ?? 0) - (t.position ?? 0)), [], j.value, Pe.value) : []), Le = Y(() => lE(De.value.filter((e) => !e.project_id), [], ke.value, j.value, Pe.value, Ee.value.filter((e) => e.calibration_eligible))), Re = Y(() => Te.value.filter((e) => !p.value.trim() || [e.name, e.target ?? ""].some((e) => e.toLocaleLowerCase().includes(p.value.trim().toLocaleLowerCase())))), ze = Y(() => Ee.value.filter((e) => (!h.value || h.value === "raw" || h.value === "video") && (!f.value.trim() || e.name.toLocaleLowerCase().includes(f.value.trim().toLocaleLowerCase()) || oe.value.some((t) => e.asset_ids.includes(t.id))) && (!h.value || e.asset_ids.some((e) => oe.value.some((t) => t.id === e))))), Be = Y(() => {
			let e = oe.value.filter((e) => h.value !== "raw" || !Fe.value.has(e.id) || !ze.value.some((t) => t.asset_ids.includes(e.id))), t = /* @__PURE__ */ new Map();
			for (let n of e) {
				let e = v.value ? String(n.attributes[v.value] ?? "") : "", r = t.get(e) || [];
				r.push(n), t.set(e, r);
			}
			return [...t];
		}), Ve = Y(() => [...D.value].map((e) => j.value.get(e)).filter((e) => !!e));
		function He(e) {
			let t = new Set(D.value);
			t.has(e.id) ? t.delete(e.id) : t.add(e.id), D.value = t;
		}
		function Ue() {
			d.value = "", f.value = "", y.value = {}, h.value = "", v.value = "";
		}
		function We(e, t) {
			y.value = {
				...y.value,
				[e]: t
			};
		}
		function Ge(e) {
			s.value = !1, o.value = e;
		}
		L(() => r.active, (e) => {
			e || ut();
		});
		function Ke() {
			ae(), ne();
		}
		function qe(e, t) {
			e.currentTarget instanceof HTMLDetailsElement && e.currentTarget.open && !t.asset_ids.every((e) => j.value.has(e)) && me(async (e) => Se(await Ey("assets", { collection_id: t.id }, e)));
		}
		async function Je(e) {
			b.value || (O = document.activeElement instanceof HTMLElement ? document.activeElement : null, b.value = e, E.value = "", await In(), x.value?.focus());
		}
		async function Ye() {
			let e = x.value?.closest("[role=\"region\"]")?.contains(document.activeElement);
			b.value = void 0, await In(), e && O?.isConnected && O.focus(), O = null;
		}
		async function Xe() {
			S.value ? await S.value.discardDraft() : C.value ? await C.value.discardDraft() : w.value ? await w.value.discardDraft() : await Ye();
		}
		function Ze() {
			return !b.value && (Ge("projects"), !0);
		}
		function Qe() {
			return b.value ? Xe().then(Ze) : Ze();
		}
		n({ goHome: Qe });
		let $e = Y(() => {
			let e = b.value;
			return e ? e.kind === "asset" ? e.asset.name : i("assetLibrary.forms." + e.kind) : "";
		}), et = Y(() => {
			let e = b.value;
			if (!e || e.kind === "import" || e.kind === "output" || e.kind === "approvals" || e.kind === "asset" || e.kind === "batch") return null;
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
					defaults: rt(e.resource),
					targetName: nt(e.resource)
				};
				default: return {
					kind: e.kind,
					row: e.row
				};
			}
		}), tt = (e) => "asset" in e ? e.asset.id : e.collection.id, nt = (e) => "asset" in e ? e.asset.name : e.collection.name, rt = (e) => "asset" in e ? { asset_id: e.asset.id } : { collection_id: e.collection.id }, it = (e) => "asset" in e ? "AstroPhotoAssetSource" : "AstroPhotoCollectionSource";
		function at(e) {
			let t = e?.placement, n = t?.asset_id ?? e?.master?.asset_id, r = n && j.value.get(n);
			if (r) return { asset: r };
			let i = t?.collection_id && Pe.value.get(t.collection_id);
			if (i) return { collection: i };
		}
		let ot = Xv((e) => !!k?.resource && r.active && !b.value && it(k.resource) === e, (e) => {
			xe.value = e, e || (T.value = i("assetLibrary.canvasBound"));
		}, (e, t) => {
			k?.resource && st(k.resource, t);
		});
		Ae(ot.dispose);
		function st(e, n) {
			let r = "asset" in e ? "asset_id" : "collection_id";
			if ("asset" in e && !e.asset.available) throw new Q("ASSET_OFFLINE");
			if ("collection" in e && !e.collection.asset_ids.length) throw new Q("COLLECTION_EMPTY");
			if ("collection" in e && e.collection.asset_ids.some((e) => j.value.get(e)?.available === !1)) throw new Q("ASSET_OFFLINE");
			Wv(it(e), n, t, void 0, (t) => {
				let n = t.widgets?.find((e) => e.name === r);
				if (!n) throw new Q("CANVAS_UNSUPPORTED");
				n.value = tt(e);
			});
		}
		function ct(e) {
			xe.value = void 0, E.value = "";
			try {
				st(e), T.value = i("assetLibrary.canvasBound");
			} catch (e) {
				xe.value = e;
			}
		}
		function lt(e, t, n) {
			if (!e.dataTransfer || !t && !n || b.value) {
				e.preventDefault();
				return;
			}
			ut();
			let r = crypto.randomUUID();
			k = {
				token: r,
				resource: t,
				folder: n
			}, ee.value = t ? tt(t) : n.id, t && ot.start(e.dataTransfer, it(t)), e.dataTransfer.effectAllowed = "copyMove", e.dataTransfer.setData(DD, r);
		}
		function ut() {
			ot.cancel(), k = void 0, ee.value = "", A.value = "";
		}
		function dt(e, t) {
			k && !b.value && !pe.value && e.dataTransfer?.types.includes(DD) && (e.preventDefault(), e.stopPropagation(), e.dataTransfer.dropEffect = k.folder ? "move" : "copy", A.value = t?.id ?? "root");
		}
		function ft(e, t) {
			e === "projects" && k?.resource && t.dataTransfer?.types.includes(DD) && (t.preventDefault(), Ge("projects"));
		}
		function pt(e, t) {
			if (!k || !Ne.value || !e.dataTransfer || e.dataTransfer.getData(DD) !== k.token) return;
			e.preventDefault(), e.stopPropagation();
			let n = Ne.value, r = k, a = t?.folder?.id ?? null;
			ut(), de(async (e) => {
				if (r.folder) {
					if (r.folder.project_id !== n.id || r.folder.id === a) throw new Q("INVALID_REQUEST");
					await Oy("folders", {
						name: r.folder.name,
						parent_id: a,
						project_id: n.id
					}, e, r.folder);
				} else if (r.resource) {
					let t = r.resource, i = Oe.value.find((e) => e.project_id === n.id && ("asset" in t ? e.asset_id === t.asset.id : e.collection_id === t.collection.id));
					await Oy("placements", {
						project_id: n.id,
						folder_id: a,
						...rt(t)
					}, e, i);
				}
				e.aborted || (T.value = i("assetLibrary.linked"), ne());
			});
		}
		function mt(e) {
			l.value = void 0, c.value = e;
		}
		function ht(e) {
			b.value?.kind === "projects" && e && mt(e.id), l.value = void 0, u.value = void 0, Ke();
		}
		function gt(e) {
			return je.value.filter((t) => "asset" in e ? t.asset_id === e.asset.id : t.collection_id === e.collection.id);
		}
		function _t(e) {
			return Me.value.filter((t) => t.asset_ids.includes(e.id));
		}
		function vt(e) {
			return Me.value.filter((t) => !t.asset_ids.includes(e.id));
		}
		let yt = Y(() => ({
			value: "",
			label: i("assetLibrary.values.unspecified")
		})), bt = [
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
			...EC,
			...Object.keys(TC),
			"storage_mode",
			"available"
		], xt = Y(() => {
			let e = /* @__PURE__ */ new Map();
			function t(t, n, r) {
				if (typeof n != "string" && typeof n != "number" && typeof n != "boolean" || n === "") return;
				let a = String(n), o = e.get(t) ?? /* @__PURE__ */ new Map();
				o.set(a, r ?? (t in TC || t === "available" || t === "storage_mode" ? i("assetLibrary.values." + (a === "true" ? "online" : a === "false" ? "offline" : a), a) : a)), e.set(t, o);
			}
			let n = new Set(be.value.map((e) => e.id));
			for (let e of be.value) {
				for (let n of bt) {
					let r = n === "storage_mode" || n === "available" || n === "workspace_id" ? e[n] : e.attributes[n];
					Array.isArray(r) ? r.forEach((e) => t(n, e)) : t(n, r);
				}
				let n = e.name.lastIndexOf(".");
				n > 0 && n < e.name.length - 1 && t("extension", e.name.slice(n + 1).toLocaleLowerCase());
			}
			for (let e of Ee.value) e.asset_ids.some((e) => n.has(e)) && t("collection_id", e.id, e.name);
			for (let e of Me.value) e.asset_ids.some((e) => n.has(e)) && t("session_id", e.id, e.name);
			for (let e of Oe.value) {
				let r = e.collection_id ? Pe.value.get(e.collection_id) : void 0;
				(e.asset_id && n.has(e.asset_id) || r?.asset_ids.some((e) => n.has(e))) && (t("project_id", e.project_id, Te.value.find((t) => t.id === e.project_id)?.name), e.folder_id && t("folder_id", e.folder_id, De.value.find((t) => t.id === e.folder_id)?.name));
			}
			return bt.flatMap((t) => {
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
		function St(e) {
			e && _e(async (e) => {
				be.value = await Ey("assets", {}, e);
			});
		}
		let Ct = (e) => [
			PS(e.size_bytes),
			e.attributes.usage && i("assetLibrary.values." + e.attributes.usage, String(e.attributes.usage)),
			i("assetLibrary.values." + (e.available ? "online" : "offline"))
		].filter(Boolean).join(" · ");
		return (t, n) => (V(), H("div", {
			class: "ap-assets-panel",
			onKeydown: n[38] ||= vs(gs((e) => b.value && Xe(), ["stop"]), ["esc"])
		}, [
			b.value ? (V(), H("div", uE, [W("div", dE, [W("button", {
				type: "button",
				onClick: Xe
			}, M(F(i)("actions.back")), 1), W("h2", {
				id: "ap-assets-editor-title",
				ref_key: "heading",
				ref: x,
				tabindex: "-1"
			}, M($e.value), 513)]), b.value.kind === "import" ? (V(), U(QT, {
				key: 0,
				ref_key: "importEditor",
				ref: w,
				active: e.active,
				projects: Te.value,
				"open-storage": e.openStorage,
				onChanged: Ke,
				onClose: Ye
			}, null, 8, [
				"active",
				"projects",
				"open-storage"
			])) : b.value.kind === "approvals" ? (V(), U(cE, {
				key: 1,
				onApplied: Ke
			})) : b.value.kind === "asset" || b.value.kind === "output" || b.value.kind === "batch" ? (V(), U(cw, {
				key: 2,
				ref_key: "assetEditor",
				ref: S,
				asset: b.value.kind === "asset" ? b.value.asset : void 0,
				selected: b.value.kind === "batch" ? b.value.assets : void 0,
				projects: Te.value,
				onChanged: Ke,
				onNotice: n[0] ||= (e) => T.value = e,
				onClose: Ye
			}, null, 8, [
				"asset",
				"selected",
				"projects"
			])) : et.value ? (V(), U(zw, J({ key: 3 }, et.value, {
				ref_key: "libraryEditor",
				ref: C,
				assets: [...j.value.values()],
				projects: Te.value,
				folders: De.value,
				collections: Ee.value,
				placements: Oe.value,
				masters: ke.value,
				assignments: je.value,
				onChanged: ht,
				onNotice: n[1] ||= (e) => T.value = e,
				onClose: Ye
			}), null, 16, [
				"assets",
				"projects",
				"folders",
				"collections",
				"placements",
				"masters",
				"assignments"
			])) : q("", !0)])) : q("", !0),
			Jn(G(F(zy), {
				items: a,
				active: o.value,
				prefix: "ap-asset",
				label: F(i)("nav.assets"),
				title: (e) => F(i)("assetLibrary." + e),
				select: Ge,
				dragOver: ft
			}, null, 8, [
				"active",
				"label",
				"title"
			]), [[To, !b.value && !s.value]]),
			T.value ? (V(), H("p", fE, M(T.value), 1)) : q("", !0),
			F(fe) ? (V(), U(MC, {
				key: 2,
				error: F(fe)
			}, null, 8, ["error"])) : q("", !0),
			xe.value ? (V(), U(MC, {
				key: 3,
				error: xe.value
			}, null, 8, ["error"])) : q("", !0),
			F(te).state === "error" && !b.value ? (V(), U(MC, {
				key: 4,
				error: F(te).error,
				retry: F(ne)
			}, null, 8, ["error", "retry"])) : q("", !0),
			Jn(W("section", pE, [
				W("div", mE, [W("h2", null, M(F(i)("assetLibrary.projects")), 1), W("button", {
					type: "button",
					onClick: n[2] ||= (e) => Je({ kind: "projects" })
				}, M(F(i)("assetLibrary.newProject")), 1)]),
				G(F(zv), {
					label: F(i)("assetLibrary.searchProjects"),
					"clear-label": F(i)("browse.clear"),
					onSearch: n[3] ||= (e) => p.value = e
				}, null, 8, ["label", "clear-label"]),
				F(te).state === "loading" ? (V(), H("p", hE, M(F(i)("states.loading")), 1)) : F(te).state === "ready" && !Re.value.length ? (V(), H("p", gE, M(F(i)(p.value.trim() ? "assetLibrary.noMatches" : "assetLibrary.noProjects")), 1)) : (V(), H("ul", _E, [(V(!0), H(B, null, ei(Re.value, (e) => (V(), H("li", { key: e.id }, [W("button", {
					type: "button",
					class: "ap-assets-truncate ap-assets-project",
					"aria-pressed": e.id === c.value,
					title: e.name,
					onClick: (t) => mt(e.id)
				}, [W("strong", null, M(e.name), 1), e.target ? (V(), H("small", yE, M(e.target), 1)) : q("", !0)], 8, vE)]))), 128))])),
				Ne.value ? (V(), H(B, { key: 3 }, [
					W("div", bE, [
						W("h3", { title: Ne.value.name }, M(Ne.value.name), 9, xE),
						W("button", {
							type: "button",
							onClick: n[4] ||= (e) => Je({
								kind: "projects",
								row: Ne.value
							})
						}, M(F(i)("assetLibrary.editProject")), 1),
						W("button", {
							type: "button",
							onClick: n[5] ||= (e) => Je({
								kind: "folders",
								projectId: c.value
							})
						}, M(F(i)("assetLibrary.newFolder")), 1)
					]),
					Ne.value.notes ? (V(), H("p", SE, M(Ne.value.notes), 1)) : q("", !0),
					W("div", {
						class: he(["ap-assets-drop", { "ap-drop-active": A.value === "root" }]),
						onDragover: n[8] ||= (e) => dt(e),
						onDrop: n[9] ||= (e) => pt(e),
						onDragleave: n[10] ||= (e) => !e.currentTarget.contains(e.relatedTarget) && (A.value = "")
					}, [ee.value ? (V(), H("span", CE, M(F(i)("assetLibrary.rootFolder")), 1)) : q("", !0), G(Gw, {
						entries: Ie.value,
						"can-drop": "",
						query: p.value,
						selected: l.value?.id,
						onSelect: n[6] ||= (e) => l.value = e,
						onOver: dt,
						onDrop: pt,
						onDrag: n[7] ||= (e, t) => lt(e, at(t), t.folder),
						onDragEnd: ut
					}, null, 8, [
						"entries",
						"query",
						"selected"
					])], 34),
					l.value?.folder ? (V(), H("div", wE, [W("button", {
						type: "button",
						onClick: n[11] ||= (e) => Je({
							kind: "folders",
							projectId: c.value,
							parentId: l.value.folder.id
						})
					}, M(F(i)("assetLibrary.newFolder")), 1), W("button", {
						type: "button",
						onClick: n[12] ||= (e) => Je({
							kind: "folders",
							row: l.value.folder
						})
					}, M(F(i)("assetLibrary.editFolder")), 1)])) : q("", !0),
					l.value?.placement && at(l.value) ? (V(), H("div", TE, [W("button", {
						type: "button",
						onClick: n[13] ||= (e) => Je({
							kind: "placements",
							resource: at(l.value),
							row: l.value.placement
						})
					}, M(F(i)("assetLibrary.editReference")), 1), W("button", {
						type: "button",
						onClick: n[14] ||= (e) => Je({
							kind: "assignments",
							resource: at(l.value)
						})
					}, M(F(i)("assetLibrary.forms.assignments")), 1)])) : q("", !0)
				], 64)) : q("", !0)
			], 512), [[To, !b.value && o.value === "projects" && !s.value]]),
			Jn(W("section", EE, [
				W("div", DE, [
					W("h2", null, M(F(i)("assetLibrary.allAssets")), 1),
					W("button", {
						type: "button",
						onClick: n[15] ||= (e) => Je({ kind: "import" })
					}, M(F(i)("assetLibrary.forms.import")), 1),
					W("details", OE, [
						W("summary", { "aria-label": F(i)("assetLibrary.more") }, "⋯", 8, kE),
						W("button", {
							type: "button",
							onClick: n[16] ||= (e) => Je({ kind: "collections" })
						}, M(F(i)("assetLibrary.newCollection")), 1),
						W("button", {
							type: "button",
							onClick: n[17] ||= (e) => Je({ kind: "output" })
						}, M(F(i)("assetLibrary.forms.output")), 1),
						W("button", {
							type: "button",
							onClick: n[18] ||= (e) => Je({ kind: "approvals" })
						}, M(F(i)("assetLibrary.forms.approvals")), 1),
						W("button", {
							type: "button",
							onClick: Ke
						}, M(F(i)("actions.refresh")), 1)
					])
				]),
				W("div", AE, [
					G(F(zv), {
						label: F(i)("assetLibrary.searchAssets"),
						"clear-label": F(i)("browse.clear"),
						value: d.value,
						onValueChange: n[19] ||= (e) => d.value = e,
						onSearch: n[20] ||= (e) => f.value = e
					}, null, 8, [
						"label",
						"clear-label",
						"value"
					]),
					G(F(nv), { "onUpdate:open": St }, {
						default: I(() => [G(F(cv), { "as-child": "" }, {
							default: I(() => [W("button", {
								type: "button",
								class: "ap-search-action ap-assets-filter-trigger",
								"aria-label": F(i)("assetLibrary.filters"),
								title: F(i)("assetLibrary.filters")
							}, [n[39] ||= W("svg", {
								width: "16",
								height: "16",
								viewBox: "0 0 24 24",
								fill: "none",
								stroke: "currentColor",
								"stroke-width": "2",
								"stroke-linecap": "round",
								"aria-hidden": "true"
							}, [W("path", { d: "M3 5h18M6 12h12M10 19h4" })], -1), Object.values(y.value).some(Boolean) ? (V(), H("span", ME)) : q("", !0)], 8, jE)]),
							_: 1
						}), G(F(sv), null, {
							default: I(() => [G(F(ov), {
								class: "ap-assets-settings-popover ap-assets-filter-popover",
								side: "bottom",
								align: "end",
								"side-offset": 5,
								"collision-padding": 10
							}, {
								default: I(() => [
									W("strong", null, M(F(i)("assetLibrary.filters")), 1),
									F(ye) ? (V(), H("p", NE, M(F(i)("states.loading")), 1)) : F(ve) ? (V(), U(MC, {
										key: 1,
										error: F(ve),
										retry: () => St(!0)
									}, null, 8, ["error", "retry"])) : (V(), H(B, { key: 2 }, [xt.value.length ? q("", !0) : (V(), H("p", PE, M(F(i)("assetLibrary.noFilterOptions")), 1)), (V(!0), H(B, null, ei(xt.value, (e) => (V(), H("div", {
										key: e.key,
										class: "ap-assets-filter-option"
									}, [W("label", { for: "ap-filter-" + e.key }, M(F(i)("assetLibrary.fields." + e.key)), 9, FE), G(F(jS), {
										id: "ap-filter-" + e.key,
										label: F(i)("assetLibrary.fields." + e.key),
										value: y.value[e.key] ?? "",
										options: [{
											value: "",
											label: F(i)("assetLibrary.values.all")
										}, ...e.options],
										onChange: (t) => We(e.key, t)
									}, null, 8, [
										"id",
										"label",
										"value",
										"options",
										"onChange"
									])]))), 128))], 64)),
									Object.values(y.value).some(Boolean) ? (V(), H("button", {
										key: 3,
										type: "button",
										onClick: n[21] ||= (e) => y.value = {}
									}, M(F(i)("assetLibrary.clearFilters")), 1)) : q("", !0)
								]),
								_: 1
							})]),
							_: 1
						})]),
						_: 1
					}),
					G(F(nv), null, {
						default: I(() => [G(F(cv), { "as-child": "" }, {
							default: I(() => [W("button", {
								type: "button",
								class: "ap-search-action",
								"aria-label": F(i)("assetLibrary.viewSettings"),
								title: F(i)("assetLibrary.viewSettings")
							}, [...n[40] ||= [W("svg", {
								width: "16",
								height: "16",
								viewBox: "0 0 24 24",
								fill: "none",
								stroke: "currentColor",
								"stroke-width": "2",
								"stroke-linecap": "round",
								"aria-hidden": "true"
							}, [
								W("path", { d: "M4 7h10M18 7h2M4 17h2M10 17h10" }),
								W("circle", {
									cx: "16",
									cy: "7",
									r: "2"
								}),
								W("circle", {
									cx: "8",
									cy: "17",
									r: "2"
								})
							], -1)]], 8, IE)]),
							_: 1
						}), G(F(sv), null, {
							default: I(() => [G(F(ov), {
								class: "ap-assets-settings-popover",
								side: "bottom",
								align: "end",
								"side-offset": 5,
								"collision-padding": 10
							}, {
								default: I(() => [
									W("label", LE, M(F(i)("assetLibrary.sort")), 1),
									G(F(jS), {
										id: "ap-asset-order",
										label: F(i)("assetLibrary.sort"),
										value: g.value,
										options: [
											"name",
											"size_bytes",
											"captured_at",
											"panel",
											"order",
											"exposure",
											"mtime_ns"
										].map((e) => ({
											value: e,
											label: F(i)("assetLibrary.fields." + e)
										})),
										onChange: n[22] ||= (e) => g.value = e
									}, null, 8, [
										"label",
										"value",
										"options"
									]),
									W("button", {
										type: "button",
										"aria-pressed": _.value,
										onClick: n[23] ||= (e) => _.value = !_.value
									}, M(F(i)("assetLibrary." + (_.value ? "descending" : "ascending"))), 9, RE),
									W("label", zE, M(F(i)("assetLibrary.group")), 1),
									G(F(jS), {
										id: "ap-asset-group",
										label: F(i)("assetLibrary.group"),
										value: v.value,
										options: [{
											...yt.value,
											label: F(i)("assetLibrary.group")
										}, ...[
											"target",
											"panel",
											"usage",
											"filter",
											"band",
											"stage"
										].map((e) => ({
											value: e,
											label: F(i)("assetLibrary.fields." + e)
										}))],
										onChange: n[24] ||= (e) => v.value = e
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
				W("div", BE, [W("div", {
					role: "group",
					"aria-label": F(i)("assetLibrary.classification"),
					class: "ap-assets-quick-filter"
				}, [(V(), H(B, null, ei([
					"",
					"raw",
					"master_frame",
					"video"
				], (e) => W("button", {
					key: e,
					type: "button",
					"aria-pressed": h.value === e,
					onClick: (t) => h.value = e
				}, M(F(i)(e === "raw" ? "assetLibrary.subframes" : "assetLibrary.values." + (e || "all"))), 9, HE)), 64))], 8, VE), W("button", {
					type: "button",
					class: "ap-assets-calibration-link",
					onClick: n[25] ||= (e) => s.value = !0
				}, M(F(i)("assetLibrary.calibration")), 1)]),
				Ve.value.length ? (V(), H("div", UE, [
					W("button", {
						type: "button",
						onClick: n[26] ||= (e) => Je({
							kind: "batch",
							assets: Ve.value
						})
					}, M(F(i)("assetLibrary.bulkEdit")) + " (" + M(Ve.value.length) + ")", 1),
					W("button", {
						type: "button",
						onClick: n[27] ||= (e) => Je({
							kind: "collections",
							assetIds: [...D.value]
						})
					}, M(F(i)("assetLibrary.newCollection")), 1),
					W("button", {
						type: "button",
						onClick: n[28] ||= (e) => D.value = /* @__PURE__ */ new Set()
					}, M(F(i)("assetLibrary.clearSelection")), 1)
				])) : q("", !0),
				F(ie).state === "loading" ? (V(), H("p", WE, M(F(i)("states.loading")), 1)) : F(ie).state === "error" ? (V(), U(MC, {
					key: 2,
					error: F(ie).error,
					retry: F(ae)
				}, null, 8, ["error", "retry"])) : (V(), H(B, { key: 3 }, [
					!oe.value.length && !ze.value.length ? (V(), H("div", GE, [
						n[41] ||= W("svg", {
							width: "48",
							height: "48",
							viewBox: "0 0 24 24",
							fill: "none",
							stroke: "currentColor",
							"stroke-width": "2",
							"stroke-linecap": "round",
							"aria-hidden": "true"
						}, [W("circle", {
							cx: "12",
							cy: "12",
							r: "10"
						}), W("path", { d: "M12 11v6M12 7h.01" })], -1),
						W("p", null, M(F(i)(f.value || h.value || Object.values(y.value).some(Boolean) ? "assetLibrary.noMatches" : "assetLibrary.noAssets")), 1),
						f.value || h.value || Object.values(y.value).some(Boolean) ? (V(), H("button", {
							key: 0,
							type: "button",
							onClick: Ue
						}, M(F(i)("assetLibrary.clearFilters")), 1)) : q("", !0)
					])) : q("", !0),
					ze.value.length ? (V(), H("ul", KE, [(V(!0), H(B, null, ei(ze.value, (e) => (V(), H("li", {
						key: e.id,
						class: "ap-assets-row",
						"data-dragging": ee.value === e.id
					}, [
						W("details", {
							class: "ap-assets-collection",
							onToggle: (t) => qe(t, e)
						}, [
							W("summary", {
								draggable: "true",
								class: "ap-assets-truncate",
								title: e.name,
								onDragstart: (t) => lt(t, { collection: e }),
								onDragend: ut
							}, [K(M(e.name) + " ", 1), W("small", null, M(F(i)("assetLibrary.members", { count: e.asset_ids.length })), 1)], 40, YE),
							W("ul", XE, [(V(!0), H(B, null, ei(e.asset_ids, (e) => (V(), H("li", { key: e }, [j.value.has(e) ? (V(), H("button", {
								key: 0,
								type: "button",
								class: "ap-assets-truncate",
								title: j.value.get(e).name,
								draggable: "true",
								onDragstart: (t) => lt(t, { asset: j.value.get(e) }),
								onDragend: ut,
								onClick: (t) => Je({
									kind: "asset",
									asset: j.value.get(e)
								})
							}, M(j.value.get(e).name), 41, ZE)) : (V(), H("span", QE, M(e), 1))]))), 128))]),
							F(ge) ? (V(), U(MC, {
								key: 0,
								error: F(ge)
							}, null, 8, ["error"])) : q("", !0)
						], 40, JE),
						W("button", {
							type: "button",
							"aria-label": F(i)("assetLibrary.more"),
							"aria-expanded": E.value === e.id,
							onClick: (t) => E.value = E.value === e.id ? "" : e.id
						}, "⋯", 8, $E),
						E.value === e.id ? (V(), H("div", eD, [
							W("button", {
								type: "button",
								onClick: (t) => Je({
									kind: "collections",
									row: e
								})
							}, M(F(i)("assetLibrary.forms.collections")), 9, tD),
							W("button", {
								type: "button",
								onClick: (t) => Je({
									kind: "placements",
									resource: { collection: e }
								})
							}, M(F(i)("assetLibrary.forms.placements")), 9, nD),
							W("button", {
								type: "button",
								onClick: (t) => Je({
									kind: "assignments",
									resource: { collection: e }
								})
							}, M(F(i)("assetLibrary.forms.assignments")), 9, rD),
							(V(!0), H(B, null, ei(gt({ collection: e }), (t) => (V(), H("button", {
								key: t.id,
								type: "button",
								onClick: (n) => Je({
									kind: "assignments",
									resource: { collection: e },
									row: t
								})
							}, M(F(i)("assetLibrary.editAssignment")) + " · " + M(j.value.get(ke.value.find((e) => e.id === t.master_id)?.asset_id || "")?.name ?? t.master_id), 9, iD))), 128)),
							W("button", {
								type: "button",
								onClick: (t) => ct({ collection: e })
							}, M(F(i)("assetLibrary.createSource")), 9, aD)
						])) : q("", !0)
					], 8, qE))), 128))])) : q("", !0),
					(V(!0), H(B, null, ei(Be.value, ([e, t]) => (V(), H("div", { key: e }, [v.value ? (V(), H("h3", oD, M(e || F(i)("assetLibrary.values.unknown")), 1)) : q("", !0), W("ul", sD, [(V(!0), H(B, null, ei(t, (e) => (V(), H("li", {
						key: e.id,
						class: "ap-assets-row",
						"data-dragging": ee.value === e.id
					}, [
						W("input", {
							type: "checkbox",
							"aria-label": F(i)("assetLibrary.selectAsset", { name: e.name }),
							checked: D.value.has(e.id),
							onChange: (t) => He(e)
						}, null, 40, lD),
						W("button", {
							type: "button",
							class: "ap-assets-truncate ap-asset-main",
							title: e.name,
							draggable: "true",
							onDragstart: (t) => lt(t, { asset: e }),
							onDragend: ut,
							onContextmenu: gs((t) => E.value = e.id, ["prevent"]),
							onClick: (t) => Je({
								kind: "asset",
								asset: e
							})
						}, [W("strong", null, M(e.name), 1), W("small", null, M(Ct(e)), 1)], 40, uD),
						W("button", {
							type: "button",
							"aria-label": F(i)("assetLibrary.more"),
							"aria-expanded": E.value === e.id,
							onClick: (t) => E.value = E.value === e.id ? "" : e.id
						}, "⋯", 8, dD),
						E.value === e.id ? (V(), H("div", fD, [
							W("button", {
								type: "button",
								onClick: (t) => Je({
									kind: "placements",
									resource: { asset: e }
								})
							}, M(F(i)("assetLibrary.forms.placements")), 9, pD),
							W("button", {
								type: "button",
								onClick: (t) => Je({
									kind: "sessions",
									assetIds: [e.id]
								})
							}, M(F(i)("assetLibrary.forms.sessions")), 9, mD),
							(V(!0), H(B, null, ei(_t(e), (e) => (V(), H("button", {
								key: e.id,
								type: "button",
								onClick: (t) => Je({
									kind: "sessions",
									row: e
								})
							}, M(e.name), 9, hD))), 128)),
							(V(!0), H(B, null, ei(vt(e), (t) => (V(), H("button", {
								key: "attach-" + t.id,
								type: "button",
								onClick: (n) => Je({
									kind: "sessions",
									row: {
										...t,
										asset_ids: [...t.asset_ids, e.id]
									}
								})
							}, M(F(i)("assetLibrary.attachToSession", { name: t.name })), 9, gD))), 128)),
							e.attributes.usage === "light" && !Fe.value.has(e.id) ? (V(), H("button", {
								key: 0,
								type: "button",
								onClick: (t) => Je({
									kind: "assignments",
									resource: { asset: e }
								})
							}, M(F(i)("assetLibrary.forms.assignments")), 9, _D)) : q("", !0),
							(V(!0), H(B, null, ei(gt({ asset: e }), (t) => (V(), H("button", {
								key: t.id,
								type: "button",
								onClick: (n) => Je({
									kind: "assignments",
									resource: { asset: e },
									row: t
								})
							}, M(F(i)("assetLibrary.editAssignment")) + " · " + M(j.value.get(ke.value.find((e) => e.id === t.master_id)?.asset_id || "")?.name ?? t.master_id), 9, vD))), 128)),
							W("button", {
								type: "button",
								disabled: !e.available,
								onClick: (t) => ct({ asset: e })
							}, M(F(i)("assetLibrary.createSource")), 9, yD)
						])) : q("", !0)
					], 8, cD))), 128))])]))), 128)),
					F(le) ? (V(), U(MC, {
						key: 2,
						error: F(le),
						retry: Ce
					}, null, 8, ["error"])) : q("", !0),
					se.value ? (V(), H("button", {
						key: 3,
						type: "button",
						disabled: F(ue),
						onClick: Ce
					}, M(F(i)("assetLibrary.loadMore")), 9, bD)) : q("", !0)
				], 64))
			], 512), [[To, !b.value && o.value === "allAssets" && !s.value]]),
			Jn(W("section", xD, [
				W("div", SD, [
					W("button", {
						type: "button",
						onClick: n[29] ||= (e) => s.value = !1
					}, M(F(i)("actions.back")), 1),
					W("h2", CD, M(F(i)("assetLibrary.calibration")), 1),
					W("button", {
						type: "button",
						onClick: n[30] ||= (e) => Je({ kind: "masters" })
					}, M(F(i)("assetLibrary.registerMaster")), 1)
				]),
				G(F(zv), {
					label: F(i)("assetLibrary.calibration"),
					"clear-label": F(i)("browse.clear"),
					onSearch: n[31] ||= (e) => m.value = e
				}, null, 8, ["label", "clear-label"]),
				W("div", wD, [W("button", {
					type: "button",
					onClick: n[32] ||= (e) => Je({ kind: "folders" })
				}, M(F(i)("assetLibrary.newFolder")), 1)]),
				G(Gw, {
					entries: Le.value,
					query: m.value,
					selected: u.value?.id,
					onSelect: n[33] ||= (e) => u.value = e
				}, null, 8, [
					"entries",
					"query",
					"selected"
				]),
				Le.value.length ? q("", !0) : (V(), H("p", TD, M(F(i)("assetLibrary.noCalibration")), 1)),
				u.value?.folder ? (V(), H("div", ED, [W("button", {
					type: "button",
					onClick: n[34] ||= (e) => Je({
						kind: "folders",
						parentId: u.value.folder.id
					})
				}, M(F(i)("assetLibrary.newFolder")), 1), W("button", {
					type: "button",
					onClick: n[35] ||= (e) => Je({
						kind: "folders",
						row: u.value.folder
					})
				}, M(F(i)("assetLibrary.editFolder")), 1)])) : q("", !0),
				u.value?.master ? (V(), H("button", {
					key: 2,
					type: "button",
					onClick: n[36] ||= (e) => Je({
						kind: "masters",
						row: u.value.master
					})
				}, M(F(i)("assetLibrary.forms.masters")), 1)) : q("", !0),
				u.value?.collection ? (V(), H("button", {
					key: 3,
					type: "button",
					onClick: n[37] ||= (e) => Je({
						kind: "collections",
						row: u.value.collection
					})
				}, M(F(i)("assetLibrary.forms.collections")), 1)) : q("", !0)
			], 512), [[To, !b.value && s.value]])
		], 32));
	}
}), kD = [
	"storage",
	"environment",
	"software",
	"equipment",
	"knowledge",
	"memory",
	"agent",
	"system"
], AD = {
	software: "software",
	equipment: "equipment",
	knowledge: "knowledge",
	memory: "memory"
}, jD = { class: "ap-storage-group" }, MD = { class: "ap-storage-group-heading" }, ND = ["data-state"], PD = ["disabled"], FD = ["readonly"], ID = { class: "ap-storage-actions" }, LD = ["disabled"], RD = ["disabled"], zD = /* @__PURE__ */ R({
	__name: "CacheSettings",
	props: {
		storage: {},
		disabled: { type: Boolean }
	},
	emits: ["change", "clear"],
	setup(e, { emit: n }) {
		let r = e, i = n, { t: a } = Z(), o = /* @__PURE__ */ N(), s = /* @__PURE__ */ N(), c = Y({
			get: () => o.value ?? r.storage.cache.path,
			set: (e) => {
				o.value = e.trim() === r.storage.cache.path ? void 0 : e;
			}
		}), l = Y({
			get: () => s.value ?? r.storage.cache.max_size_gb,
			set: (e) => {
				s.value = Number(e) === r.storage.cache.max_size_gb ? void 0 : e;
			}
		}), u = Y(() => c.value.trim() !== r.storage.cache.path || Number(l.value) !== r.storage.cache.max_size_gb);
		L(() => r.storage.cache.path, (e) => {
			o.value?.trim() === e && (o.value = void 0);
		}), L(() => r.storage.cache.max_size_gb, (e) => {
			Number(s.value) === e && (s.value = void 0);
		});
		function d() {
			!r.disabled && u.value && i("change", "/storage/cache/configure", {
				path: c.value.trim(),
				max_size_gb: Number(l.value),
				expected_revision: r.storage.imports.revision
			});
		}
		async function f() {
			await t.extensionManager.dialog.confirm({
				key: "astrophoto.clear-cache",
				type: "delete",
				title: a("storage.clear"),
				message: a("storage.confirmClear"),
				itemList: [r.storage.cache.path]
			}) === !0 && i("clear");
		}
		return (t, n) => (V(), H("section", jD, [W("div", MD, [
			W("h3", null, M(F(a)("storage.cache")), 1),
			W("span", {
				class: "ap-storage-badge",
				"data-state": e.storage.cache.status
			}, M(F(a)("storage.states." + e.storage.cache.status)), 9, ND),
			W("small", null, M(F(a)("storage.used")) + " " + M(F(PS)(e.storage.cache.used_bytes)), 1)
		]), W("form", { onSubmit: gs(d, ["prevent"]) }, [W("fieldset", {
			class: "ap-storage-fields",
			disabled: e.disabled
		}, [
			W("label", null, [K(M(F(a)("storage.path")), 1), Jn(W("input", {
				"onUpdate:modelValue": n[0] ||= (e) => c.value = e,
				readonly: e.storage.cache.session_managed,
				required: ""
			}, null, 8, FD), [[os, c.value]])]),
			W("label", null, [K(M(F(a)("storage.limit")), 1), Jn(W("input", {
				"onUpdate:modelValue": n[1] ||= (e) => l.value = e,
				required: "",
				type: "number",
				step: "any",
				min: "0.001",
				max: "100000"
			}, null, 512), [[os, l.value]])]),
			W("div", ID, [W("button", {
				type: "submit",
				class: "ap-storage-button",
				"data-variant": "primary",
				disabled: !u.value
			}, M(F(a)("storage.save")), 9, LD), W("button", {
				type: "button",
				class: "ap-storage-button",
				disabled: e.storage.cache.status !== "online",
				onClick: f
			}, M(F(a)("storage.clear")), 9, RD)])
		], 8, PD)], 32)]));
	}
}), BD = { class: "ap-workspace-summary" }, VD = { class: "ap-workspace-info" }, HD = { class: "ap-storage-meta" }, UD = {
	key: 0,
	class: "ap-storage-badge"
}, WD = { class: "ap-storage-path" }, GD = { class: "ap-storage-meta" }, KD = ["data-state"], qD = { key: 0 }, JD = { key: 1 }, YD = [
	"aria-expanded",
	"aria-controls",
	"aria-label",
	"title"
], XD = ["id", "hidden"], ZD = ["disabled"], QD = ["disabled"], $D = ["disabled"], eO = ["disabled"], tO = ["disabled"], nO = ["disabled"], rO = ["disabled"], iO = /* @__PURE__ */ R({
	__name: "WorkspaceActions",
	props: {
		workspace: {},
		busy: { type: Boolean },
		settingsRevision: {}
	},
	emits: [
		"change",
		"migration",
		"relocate"
	],
	setup(e, { emit: n }) {
		let r = e, i = n, { t: a } = Z(), o = /* @__PURE__ */ N(!1), s = wr(), c = Er("workspace-more");
		function l(e) {
			return `/storage/locations/${encodeURIComponent(e)}`;
		}
		function u(e) {
			o.value && (e.stopPropagation(), o.value = !1, c.value?.focus());
		}
		function d() {
			let { id: e, revision: t, enabled: n } = r.workspace;
			i("change", l(e), {
				expected_revision: t,
				enabled: !n
			}, "PATCH");
		}
		async function f(e) {
			let { id: n, name: o, revision: s } = r.workspace, c = (await t.extensionManager.dialog.prompt({
				title: a("storage." + e),
				message: a(e === "rename" ? "storage.name" : "storage.path"),
				defaultValue: e === "rename" ? o : void 0
			}))?.trim();
			if (!c) return;
			let u = l(n);
			switch (e) {
				case "rename":
					i("change", u, {
						expected_revision: s,
						name: c
					}, "PATCH");
					break;
				case "relocate":
					i("relocate", n, c);
					break;
				case "migrate": i("migration", n, c);
			}
		}
		async function p() {
			let { id: e, name: n, revision: o } = r.workspace;
			await t.extensionManager.dialog.confirm({
				key: "astrophoto.remove-workspace",
				type: "delete",
				title: a("storage.remove"),
				message: a("storage.removeHelp"),
				itemList: [n]
			}) === !0 && i("change", l(e), { expected_revision: o }, "DELETE");
		}
		return (t, n) => (V(), H("li", {
			class: "ap-workspace-row",
			onKeydown: vs(u, ["esc"])
		}, [W("div", BD, [W("div", VD, [
			W("div", HD, [W("strong", null, M(e.workspace.name), 1), e.workspace.is_default ? (V(), H("span", UD, M(F(a)("storage.default")), 1)) : q("", !0)]),
			W("p", WD, M(e.workspace.root_path), 1),
			W("p", GD, [
				W("span", {
					class: "ap-storage-badge",
					"data-state": e.workspace.status
				}, M(F(a)("storage.states." + e.workspace.status)), 9, KD),
				e.workspace.status === "migrating" && e.workspace.underlying_status && e.workspace.underlying_status !== "online" ? (V(), H("small", qD, M(F(a)("storage.states." + e.workspace.underlying_status)), 1)) : q("", !0),
				W("small", null, M(F(a)("storage.free")) + " " + M(F(PS)(e.workspace.free_bytes)), 1),
				e.workspace.missing_count ? (V(), H("small", JD, M(F(a)("storage.missingFiles", { count: e.workspace.missing_count })), 1)) : q("", !0)
			])
		]), W("button", {
			ref: "workspace-more",
			type: "button",
			class: "ap-workspace-more",
			"aria-expanded": o.value,
			"aria-controls": F(s),
			"aria-label": F(a)("storage.workspaceActions", { name: e.workspace.name }),
			title: F(a)("storage.workspaceActions", { name: e.workspace.name }),
			onClick: n[0] ||= (e) => o.value = !o.value
		}, [...n[6] ||= [W("svg", {
			width: "16",
			height: "16",
			viewBox: "0 0 24 24",
			fill: "currentColor",
			"aria-hidden": "true"
		}, [
			W("circle", {
				cx: "5",
				cy: "12",
				r: "1.8"
			}),
			W("circle", {
				cx: "12",
				cy: "12",
				r: "1.8"
			}),
			W("circle", {
				cx: "19",
				cy: "12",
				r: "1.8"
			})
		], -1)]], 8, YD)]), W("div", {
			id: F(s),
			class: "ap-storage-actions",
			hidden: !o.value
		}, [
			W("button", {
				type: "button",
				class: "ap-storage-button",
				disabled: e.busy || e.workspace.status === "migrating",
				onClick: n[1] ||= (t) => i("change", l(e.workspace.id) + "/validate", {})
			}, M(F(a)("storage.validate")), 9, ZD),
			W("button", {
				type: "button",
				class: "ap-storage-button",
				disabled: e.busy || e.workspace.is_default || !["online", "partial"].includes(e.workspace.status),
				onClick: n[2] ||= (t) => i("change", l(e.workspace.id), {
					expected_revision: e.settingsRevision,
					default: !0
				}, "PATCH")
			}, M(F(a)("storage.setDefault")), 9, QD),
			W("button", {
				type: "button",
				class: "ap-storage-button",
				disabled: e.busy || e.workspace.enabled && e.workspace.is_default || e.workspace.status === "migrating",
				onClick: d
			}, M(F(a)(e.workspace.enabled ? "storage.disable" : "storage.enable")), 9, $D),
			W("button", {
				type: "button",
				class: "ap-storage-button",
				disabled: e.busy || e.workspace.status === "migrating",
				onClick: n[3] ||= (e) => f("rename")
			}, M(F(a)("storage.rename")), 9, eO),
			W("button", {
				type: "button",
				class: "ap-storage-button",
				disabled: e.busy || ![
					"offline",
					"identity_mismatch",
					"disabled"
				].includes(e.workspace.status),
				onClick: n[4] ||= (e) => f("relocate")
			}, M(F(a)("storage.relocate")), 9, tO),
			W("button", {
				type: "button",
				class: "ap-storage-button",
				disabled: e.busy || e.workspace.status !== "online",
				onClick: n[5] ||= (e) => f("migrate")
			}, M(F(a)("storage.migrate")), 9, nO),
			W("button", {
				type: "button",
				class: "ap-storage-button",
				disabled: e.busy || e.workspace.is_default || e.workspace.status === "migrating",
				onClick: p
			}, M(F(a)("storage.remove")), 9, rO)
		], 8, XD)], 32));
	}
}), aO = {
	key: 1,
	role: "status"
}, oO = {
	key: 2,
	class: "ap-storage"
}, sO = { class: "ap-storage-group" }, cO = { class: "ap-storage-path" }, lO = ["disabled"], uO = {
	key: 0,
	role: "status"
}, dO = { class: "ap-storage-path" }, fO = {
	key: 1,
	role: "status",
	class: "ap-storage-path"
}, pO = { class: "ap-storage-group" }, mO = ["disabled"], hO = ["checked", "onClick"], gO = { class: "ap-storage-group" }, _O = { class: "ap-storage-group-heading" }, vO = [
	"aria-expanded",
	"aria-controls",
	"disabled"
], yO = { "aria-hidden": "true" }, bO = ["id", "hidden"], xO = ["disabled"], SO = { class: "ap-storage-actions" }, CO = {
	type: "submit",
	class: "ap-storage-button",
	"data-variant": "primary"
}, wO = { class: "ap-workspace-list" }, TO = {
	key: 0,
	role: "status",
	class: "ap-storage-result"
}, EO = ["aria-label"], DO = {
	key: 3,
	class: "ap-storage-group"
}, OO = ["disabled", "onClick"], kO = {
	key: 4,
	class: "ap-storage-group"
}, AO = ["disabled"], jO = {
	disabled: "",
	value: ""
}, MO = ["value"], NO = {
	disabled: "",
	value: ""
}, PO = ["value"], FO = ["max"], IO = ["aria-label"], LO = ["disabled"], RO = {
	key: 1,
	role: "status"
}, zO = { class: "ap-storage-path" }, BO = { key: 0 }, VO = ["disabled", "onClick"], HO = {
	key: 5,
	role: "status",
	class: "ap-storage-result"
}, UO = /* @__PURE__ */ R({
	__name: "StoragePage",
	props: {
		resource: {},
		refresh: { type: Function }
	},
	setup(e) {
		let n = e, { t: r } = Z(), i = /* @__PURE__ */ N(""), a = /* @__PURE__ */ N(""), o = /* @__PURE__ */ N(!1), s = wr(), c = /* @__PURE__ */ N(""), l = /* @__PURE__ */ N(""), u = /* @__PURE__ */ N([]), { pending: d, error: f, run: p } = sT(), m = Y(() => n.resource.state === "ready" ? n.resource.data : void 0), h = Y(() => d.value || !m.value?.capabilities.write), g = /* @__PURE__ */ P(), _ = Y(() => g.value ?? m.value?.operations.find((e) => e.kind === "migration")), v = ["reference", "copy"], y = /* @__PURE__ */ P(), b = /* @__PURE__ */ P(), x = Y(() => m.value?.workspaces.filter((e) => ["online", "partial"].includes(e.status)) ?? []), S = Y(() => x.value.filter((e) => e.status === "online")), C = /* @__PURE__ */ N(""), w = /* @__PURE__ */ N(""), T = /* @__PURE__ */ N(""), E = /* @__PURE__ */ N("GB"), D = "", O = 0;
		L([
			C,
			w,
			T,
			E
		], () => {
			O++, y.value = void 0;
		});
		function k(e, t, i) {
			h.value || p(async (a) => {
				let o = await $w(e, t, a, i);
				if (!a.aborted) {
					if (e.endsWith("/validate")) {
						if (typeof o.status != "string" || typeof o.name != "string") throw new Q("schema");
						l.value = o.name + " · " + r("storage.states." + o.status), u.value = Array.isArray(o.missing) ? o.missing.filter($).map((e) => String(e.relative_key)) : [];
					}
					n.refresh();
				}
			});
		}
		function ee(e, i) {
			if (h.value) return;
			let a = "/storage/locations/" + encodeURIComponent(e) + "/relocate";
			p(async (e) => {
				try {
					await $w(a, { new_path: i }, e);
				} catch (n) {
					if (!(n instanceof Q) || n.code !== "WORKSPACE_REBIND_PARTIAL") throw n;
					let o = n.details?.missing, s = await t.extensionManager.dialog.confirm({
						key: "astrophoto.partial-workspace-rebind",
						title: r("storage.relocate"),
						message: r("storage.partialRebind", { count: n.details?.missing_count }),
						itemList: Array.isArray(o) ? o.filter($).map((e) => String(e.relative_key)) : []
					});
					if (e.aborted || s !== !0) return;
					await $w(a, {
						new_path: i,
						allow_partial: !0
					}, e);
				}
				e.aborted || n.refresh();
			});
		}
		function A(e) {
			let t = m.value;
			t && e !== t.imports.default_mode && k("/storage/settings", {
				expected_revision: t.imports.revision,
				imports: { default_mode: e }
			}, "PATCH");
		}
		function j() {
			!h.value && o.value && p(async (e) => {
				await $w("/storage/locations", {
					path: a.value.trim(),
					name: i.value.trim()
				}, e), e.aborted || (i.value = "", a.value = "", o.value = !1, n.refresh());
			});
		}
		function te(e) {
			if (h.value) return;
			let t = ++O;
			y.value = void 0, p(async (n) => {
				let r = await eT(e, n);
				n.aborted || t !== O || (y.value = r, D = crypto.randomUUID());
			});
		}
		function ne(e, t) {
			te({
				workspace_id: e,
				target_path: t
			});
		}
		function re(e) {
			return "'" + e.replaceAll("'", "''") + "'";
		}
		async function ie(e) {
			let i = y.value;
			if (!i || h.value) return;
			let a = e.id === "complete" ? i.cleanup_files : i.groups.filter((t) => e.groups.includes(t.id)).flatMap((e) => e.members);
			await t.extensionManager.dialog.confirm({
				key: "astrophoto.confirm-migration",
				title: r("storage.migrate"),
				message: r("storage.migrationConfirm", { volume: FS(e.bytes) }),
				itemList: a.slice(0, 50),
				hint: r("storage.migrationFiles", { count: a.length })
			}) !== !0 || y.value !== i || h.value || p(async (t) => {
				let r = await tT("migration", {
					plan_id: i.plan_id,
					option_id: e.id,
					idempotency_key: D
				}, t);
				t.aborted || (y.value = void 0, g.value = r, n.refresh());
			});
		}
		async function ae() {
			if (h.value) return;
			let e = (await t.extensionManager.dialog.prompt({
				title: r("storage.moveRoot"),
				message: r("storage.path")
			}))?.trim();
			e && !h.value && p(async (t) => {
				let n = await $w("/storage/data-root/preflight", { target_path: e }, t);
				if (typeof n.source != "string" || typeof n.target != "string" || typeof n.copy_bytes != "number") throw new Q("schema");
				t.aborted || (b.value = {
					source: n.source,
					target: n.target,
					size: n.copy_bytes
				});
			});
		}
		async function oe(e) {
			let n = m.value?.imports.revision, i = m.value?.workspaces.find((t) => e.workspace_ids.includes(t.id) && [
				"online",
				"partial",
				"read_only"
			].includes(t.status))?.id;
			if (h.value || n === void 0 || !i) return;
			let a = await t.extensionManager.dialog.prompt({
				title: r("storage.volumeQuota"),
				message: r("storage.volumeQuotaHelp"),
				defaultValue: e.quota_bytes === null ? "" : String(e.quota_bytes / 1e9)
			});
			if (a == null) return;
			let o = a.trim() ? Math.round(Number(a) * 1e9) : null;
			o !== null && (!Number.isSafeInteger(o) || o < 0) ? p(async () => {
				throw new Q("INVALID_REQUEST");
			}) : k("/storage/locations/" + encodeURIComponent(i) + "/volume", {
				expected_revision: n,
				quota_bytes: o
			}, "PATCH");
		}
		function se() {
			let e = _.value?.phase;
			e && ![
				"completed",
				"failed",
				"cancelled"
			].includes(e) && n.refresh();
		}
		function ce() {
			h.value || p(async (e) => {
				let t = await $w("/storage/cache/clear", { scope: "all" }, e);
				if (!e.aborted) {
					if (typeof t.removed_bytes != "number" || typeof t.removed != "number" || typeof t.skipped != "number" || typeof t.failed != "number") throw new Q("schema");
					c.value = r("storage.clearResult", {
						size: PS(t.removed_bytes),
						count: t.removed,
						skipped: t.skipped,
						failed: t.failed
					}), n.refresh();
				}
			});
		}
		return (t, n) => e.resource.state === "error" ? (V(), H(B, { key: 0 }, [G(oT, { code: e.resource.error instanceof F(Q) ? e.resource.error.code : "network" }, null, 8, ["code"]), W("button", {
			type: "button",
			class: "ap-storage-button",
			onClick: n[0] ||= (t) => e.refresh()
		}, M(F(r)("actions.refresh")), 1)], 64)) : m.value ? (V(), H("div", oO, [
			W("section", sO, [
				W("h3", null, M(F(r)("storage.dataRoot")), 1),
				W("p", cO, M(m.value.data_root.path), 1),
				W("small", null, M(F(r)("storage.source." + m.value.data_root.source)) + " · " + M(F(r)("storage.db")) + " " + M(m.value.database.assets), 1),
				W("button", {
					type: "button",
					class: "ap-storage-button",
					disabled: h.value,
					onClick: ae
				}, M(F(r)("storage.moveRoot")), 9, lO),
				b.value ? (V(), H("div", uO, [
					W("p", dO, M(b.value.source) + " → " + M(b.value.target) + " · " + M(F(FS)(b.value.size)), 1),
					W("p", null, M(F(r)("storage.moveRootInstructions")), 1),
					W("code", null, "uv run python -m astrophoto.storage.data_root move " + M(re(b.value.source)) + " " + M(re(b.value.target)), 1)
				])) : m.value.data_root_receipt ? (V(), H("p", fO, M(m.value.data_root_receipt.source) + " → " + M(m.value.data_root_receipt.target), 1)) : q("", !0)
			]),
			m.value.capabilities.write ? q("", !0) : (V(), U(oT, {
				key: 0,
				code: "UNAUTHORIZED_STORAGE_OPERATION"
			})),
			F(f) ? (V(), U(oT, {
				key: 1,
				code: F(f)
			}, null, 8, ["code"])) : q("", !0),
			F(f) === "REVISION_CONFLICT" ? (V(), H("button", {
				key: 2,
				type: "button",
				class: "ap-storage-button",
				onClick: n[1] ||= (t) => e.refresh()
			}, M(F(r)("actions.refresh")), 1)) : q("", !0),
			W("section", pO, [W("fieldset", {
				class: "ap-storage-radio-group",
				disabled: h.value
			}, [W("legend", null, M(F(r)("storage.importMode")), 1), (V(), H(B, null, ei(v, (e) => W("label", { key: e }, [W("input", {
				type: "radio",
				name: "astrophoto-import-mode",
				checked: m.value.imports.default_mode === e,
				onClick: gs((t) => A(e), ["prevent"])
			}, null, 8, hO), W("span", null, [K(M(F(r)("storage." + e)), 1), W("small", null, M(F(r)("storage." + e + "Help")), 1)])])), 64))], 8, mO)]),
			W("section", gO, [
				W("div", _O, [W("h3", null, M(F(r)("storage.workspaces")), 1), W("button", {
					type: "button",
					class: "ap-storage-button ap-workspace-add",
					"aria-expanded": o.value,
					"aria-controls": F(s),
					disabled: h.value,
					onClick: n[2] ||= (e) => o.value = !o.value
				}, [W("span", yO, M(o.value ? "−" : "+"), 1), K(" " + M(F(r)("storage.add")), 1)], 8, vO)]),
				W("form", {
					id: F(s),
					hidden: !o.value,
					onSubmit: gs(j, ["prevent"])
				}, [W("fieldset", {
					class: "ap-storage-fields",
					disabled: h.value
				}, [
					W("label", null, [K(M(F(r)("storage.name")), 1), Jn(W("input", {
						"onUpdate:modelValue": n[3] ||= (e) => i.value = e,
						required: ""
					}, null, 512), [[os, i.value]])]),
					W("label", null, [K(M(F(r)("storage.path")), 1), Jn(W("input", {
						"onUpdate:modelValue": n[4] ||= (e) => a.value = e,
						required: ""
					}, null, 512), [[os, a.value]])]),
					W("div", SO, [W("button", CO, M(F(r)("storage.save")), 1)])
				], 8, xO)], 40, bO),
				W("ul", wO, [(V(!0), H(B, null, ei(m.value.workspaces, (e) => (V(), U(iO, {
					key: e.id,
					workspace: e,
					busy: h.value,
					"settings-revision": m.value.imports.revision,
					onChange: k,
					onMigration: ne,
					onRelocate: ee
				}, null, 8, [
					"workspace",
					"busy",
					"settings-revision"
				]))), 128))]),
				l.value ? (V(), H("p", TO, M(l.value), 1)) : q("", !0),
				u.value.length ? (V(), H("ul", {
					key: 1,
					class: "ap-workspace-list",
					"aria-label": F(r)("storage.missingFiles", { count: u.value.length })
				}, [(V(!0), H(B, null, ei(u.value, (e) => (V(), H("li", {
					key: e,
					class: "ap-storage-path"
				}, M(e), 1))), 128))], 8, EO)) : q("", !0),
				_.value ? (V(), U(bT, {
					key: _.value.operation_id,
					job: _.value,
					"on-terminal": se
				}, null, 8, ["job"])) : q("", !0)
			]),
			m.value.volumes?.length ? (V(), H("section", DO, [W("h3", null, M(F(r)("storage.volumeQuota")), 1), (V(!0), H(B, null, ei(m.value.volumes, (e) => (V(), H("div", {
				key: e.id,
				class: "ap-storage-fields"
			}, [
				W("p", null, M(m.value.workspaces.filter((t) => e.workspace_ids.includes(t.id)).map((e) => e.name).join(" · ")), 1),
				W("p", null, M(F(r)("storage.volumeBalance", {
					free: F(FS)(e.free_bytes),
					used: F(FS)(e.used_bytes),
					reserved: F(FS)(e.reserved_bytes)
				})), 1),
				W("p", null, M(e.quota_bytes === null ? F(r)("storage.noQuota") : F(r)("storage.quotaBalance", {
					quota: F(FS)(e.quota_bytes),
					remaining: F(FS)(e.remaining_quota_bytes)
				})), 1),
				W("div", null, [W("button", {
					type: "button",
					class: "ap-storage-button",
					disabled: h.value,
					onClick: (t) => oe(e)
				}, M(F(r)("storage.editQuota")), 9, OO)])
			]))), 128))])) : q("", !0),
			x.value.length > 1 || y.value ? (V(), H("section", kO, [x.value.length > 1 && S.value.length ? (V(), H("form", {
				key: 0,
				onSubmit: n[9] ||= gs((e) => te({
					workspace_id: C.value,
					target_workspace_id: w.value,
					amount: T.value,
					unit: E.value
				}), ["prevent"])
			}, [W("fieldset", {
				class: "ap-storage-fields",
				disabled: h.value
			}, [
				W("legend", null, M(F(r)("storage.partialMigration")), 1),
				W("label", null, [K(M(F(r)("storage.migrationSource")) + " ", 1), Jn(W("select", {
					"onUpdate:modelValue": n[5] ||= (e) => C.value = e,
					required: ""
				}, [W("option", jO, M(F(r)("storage.selectWorkspace")), 1), (V(!0), H(B, null, ei(S.value, (e) => (V(), H("option", {
					key: e.id,
					value: e.id
				}, M(e.name), 9, MO))), 128))], 512), [[ls, C.value]])]),
				W("label", null, [K(M(F(r)("storage.migrationTarget")) + " ", 1), Jn(W("select", {
					"onUpdate:modelValue": n[6] ||= (e) => w.value = e,
					required: ""
				}, [W("option", NO, M(F(r)("storage.selectWorkspace")), 1), (V(!0), H(B, null, ei(x.value.filter((e) => e.id !== C.value), (e) => (V(), H("option", {
					key: e.id,
					value: e.id
				}, M(e.name), 9, PO))), 128))], 512), [[ls, w.value]])]),
				W("label", null, [K(M(F(r)("storage.migrationAmount")) + " ", 1), Jn(W("input", {
					"onUpdate:modelValue": n[7] ||= (e) => T.value = e,
					type: "number",
					min: "0.000000001",
					step: "any",
					max: E.value === "%" ? 100 : void 0,
					required: ""
				}, null, 8, FO), [[
					os,
					T.value,
					void 0,
					{ number: !0 }
				]])]),
				Jn(W("select", {
					"onUpdate:modelValue": n[8] ||= (e) => E.value = e,
					"aria-label": F(r)("storage.migrationUnit")
				}, [...n[10] ||= [W("option", null, "GB", -1), W("option", null, "%", -1)]], 8, IO), [[ls, E.value]]),
				W("div", null, [W("button", {
					class: "ap-storage-button",
					type: "submit",
					disabled: C.value === w.value
				}, M(F(r)("storage.migrationPreview")), 9, LO)])
			], 8, AO)], 32)) : q("", !0), y.value ? (V(), H("div", RO, [
				W("p", zO, M(y.value.source) + " → " + M(y.value.target), 1),
				W("p", null, M(F(r)("storage.migrationBasis", {
					base: F(FS)(y.value.base_bytes),
					volume: F(FS)(y.value.requested_bytes)
				})), 1),
				y.value.same_volume ? (V(), H("p", BO, M(F(r)("storage.sameVolume")), 1)) : q("", !0),
				y.value.reason ? (V(), U(oT, {
					key: 1,
					code: y.value.reason
				}, null, 8, ["code"])) : q("", !0),
				(V(!0), H(B, null, ei(y.value.options, (e) => (V(), H("div", { key: e.id }, [W("button", {
					class: "ap-storage-button",
					type: "button",
					disabled: h.value,
					onClick: (t) => ie(e)
				}, M(F(r)("storage.migrationOptions." + e.id, {
					volume: F(FS)(e.bytes),
					difference: F(FS)(Math.abs(e.difference_bytes))
				})), 9, VO)]))), 128))
			])) : q("", !0)])) : q("", !0),
			G(zD, {
				storage: m.value,
				disabled: h.value,
				onChange: k,
				onClear: ce
			}, null, 8, ["storage", "disabled"]),
			W("p", null, M(F(r)("storage.exitClearsCache")), 1),
			c.value ? (V(), H("p", HO, M(c.value), 1)) : q("", !0)
		])) : (V(), H("p", aO, M(F(r)("states.loading")), 1));
	}
}), WO = /* @__PURE__ */ R((e) => {
	let { t } = Z(), n = /* @__PURE__ */ N();
	return () => {
		let r = e.bundles.find((e) => e.id === n.value);
		return n.value ? G("div", { class: "ap-software" }, [G("button", {
			type: "button",
			class: "ap-settings-back",
			onClick: () => {
				n.value = void 0;
			}
		}, [t("actions.back")]), r ? co(r.settings) : G("section", { class: "ap-software-section" }, [G("h3", null, [K("PixInsight")]), G("p", null, [t("software.plannedDetails")])])]) : G("div", { class: "ap-software-list" }, [e.bundles.map((e) => co(e.summary, {
			key: e.id,
			onOpen: () => {
				n.value = e.id;
			}
		})), G("div", { class: "ap-software-item" }, [G("button", {
			type: "button",
			class: "ap-software-open",
			onClick: () => {
				n.value = "pixinsight";
			}
		}, [G("span", {
			class: "ap-software-item-icon",
			"aria-hidden": "true"
		}, [K("▣")]), G("span", { class: "ap-software-item-copy" }, [
			G("strong", null, [K("PixInsight")]),
			G("small", null, [t("software.pixinsightPurpose")]),
			G("small", { class: "ap-software-status" }, [G("span", {
				class: "ap-software-dot",
				"data-state": "planned"
			}, null), t("states.planned")])
		])]), G("label", { class: "ap-software-switch" }, [
			G("span", { class: "ap-software-switch-label" }, [t("software.enabled")]),
			G("input", {
				type: "checkbox",
				role: "switch",
				"aria-label": t("software.enableNamed", { name: "PixInsight" }),
				disabled: !0
			}, null),
			G("span", {
				class: "ap-software-switch-track",
				"aria-hidden": "true"
			}, [G("span", null, null)])
		])])]);
	};
}, { props: ["bundles"] }), GO = "/astrophoto/v1/previews/settings", KO = new EventTarget(), qO;
function JO() {
	return qO?.canvas.width ?? 480;
}
function YO(e) {
	return typeof e == "number" && Number.isSafeInteger(e) && e > 0;
}
function XO(e) {
	if (!$(e) || typeof e.revision != "number" || !Number.isSafeInteger(e.revision) || e.revision < 0 || typeof e.longest_edge != "number" || !Number.isSafeInteger(e.longest_edge) || e.longest_edge < 0 || !Array.isArray(e.options) || !e.options.every((e) => e === 0 || YO(e)) || !e.options.includes(e.longest_edge) || !$(e.canvas) || !YO(e.canvas.width) || !YO(e.canvas.max_height) || !YO(e.canvas_min) || !YO(e.canvas_max)) throw new Q("schema");
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
	if (qO && qO.revision > t.revision) return qO;
	let n = qO && qO.longest_edge !== t.longest_edge;
	return qO = t, document.documentElement.style.setProperty("--astrophoto-canvas-preview-width", t.canvas.width + "px"), document.documentElement.style.setProperty("--astrophoto-canvas-preview-max-height", t.canvas.max_height + "px"), n && KO.dispatchEvent(new Event("change")), t;
}
async function ZO(e) {
	return XO(await Ff(GO, e));
}
async function QO(e, t, n) {
	return XO(await If(GO, "PUT", {
		longest_edge: e,
		canvas: t,
		expected_revision: n
	}));
}
// src/features/storage/EnvironmentPage.vue?vue&type=script&setup=true&lang.ts
var $O = {
	key: 0,
	role: "status"
}, ek = ["for"], tk = { class: "ap-storage-actions" }, nk = ["disabled"], rk = {
	key: 0,
	role: "alert"
}, ik = {
	key: 2,
	role: "status"
}, ak = /* @__PURE__ */ R({
	__name: "EnvironmentPage",
	props: { onSaved: { type: Function } },
	setup(e) {
		let t = e, { t: n } = Z(), r = wr(), { resource: i, refresh: a } = Ry(ZO), o = /* @__PURE__ */ P(), s = /* @__PURE__ */ N(), c = /* @__PURE__ */ N(!1), l = /* @__PURE__ */ P(), u = Y(() => i.value.state === "ready" ? o.value ?? i.value.data : void 0), d = Y(() => s.value ?? u.value?.longest_edge), f = Y(() => d.value !== u.value?.longest_edge), p = Y(() => n("environment.previewResolution")), m = Y(() => l.value instanceof Q && l.value.status === 409), h = Y(() => u.value?.options.map((e) => ({
			value: String(e),
			label: e === 0 ? n("environment.fullResolution") : n("environment.pixels", { value: e })
		})) ?? []), g = !1;
		Ae(() => {
			g = !0;
		});
		function _(e) {
			s.value = Number(e), m.value || (l.value = void 0);
		}
		function v() {
			o.value = void 0, l.value = void 0, a();
		}
		async function y() {
			let e = u.value, n = d.value;
			if (e && n !== void 0 && f.value && !c.value && !m.value) {
				l.value = void 0, c.value = !0;
				try {
					let r = await QO(n, e.canvas, e.revision);
					if (g) return;
					o.value = r, s.value = void 0, t.onSaved();
				} catch (e) {
					g || (l.value = e);
				} finally {
					g || (c.value = !1);
				}
			}
		}
		return (e, t) => F(i).state === "loading" ? (V(), H("p", $O, M(F(n)("states.loading")), 1)) : F(i).state === "error" ? (V(), U(F(Hv), {
			key: 1,
			error: F(i).error,
			retry: F(a)
		}, null, 8, ["error", "retry"])) : (V(), H("form", {
			key: 2,
			class: "ap-environment",
			onSubmit: gs(y, ["prevent"])
		}, [
			W("label", { for: F(r) }, M(p.value), 9, ek),
			G(F(jS), {
				id: F(r),
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
			]),
			W("small", null, M(F(n)("environment.previewResolutionHelp")), 1),
			W("div", tk, [W("button", {
				class: "ap-storage-button",
				type: "submit",
				disabled: c.value || m.value || !f.value
			}, M(F(n)(c.value ? "environment.saving" : "storage.save")), 9, nk)]),
			m.value ? (V(), H("div", rk, [W("p", null, M(F(n)("environment.conflict")), 1), W("button", {
				class: "ap-storage-button",
				type: "button",
				onClick: v
			}, M(F(n)("actions.refresh")), 1)])) : l.value === void 0 ? q("", !0) : (V(), U(F(Hv), {
				key: 1,
				error: l.value
			}, null, 8, ["error"])),
			o.value && !f.value && !c.value && l.value === void 0 ? (V(), H("p", ik, M(F(n)("environment.saved")), 1)) : q("", !0)
		], 32));
	}
}), ok = /* @__PURE__ */ R((e) => {
	let { t, te: n } = Z(), r = (e, r) => n(e) ? t(e) : r;
	return () => {
		let { error: i, retry: a } = e;
		if (!i) return null;
		let o = i instanceof Q ? i : new Q("network"), s = ["equipment.errors." + o.code, "errors." + o.code].find((e) => n(e));
		return G("div", {
			role: "alert",
			class: "ap-equipment-error"
		}, [
			G("p", null, [t(s ?? "errors.unknown")]),
			o.fields && Object.entries(o.fields).map(([e, t]) => G("small", { key: e }, [
				r("equipment.fields." + e.split(".").at(-1), e),
				K(" · "),
				r("equipment.validation." + String(t), String(t))
			])),
			G("small", null, [o.code, o.requestId ? " · " + o.requestId : ""]),
			a && G("button", {
				type: "button",
				onClick: a
			}, [t("actions.retry")])
		]);
	};
}, { props: ["error", "retry"] });
function sk(e, t) {
	return G(ok, {
		error: e,
		retry: t
	}, null);
}
var ck = /* @__PURE__ */ R((e) => {
	let { t } = Z(), n = wr();
	return () => {
		let { label: r, name: i, value: a, onChange: o, options: s, control: c, type: l = "text", required: u = !1, min: d, max: f, step: p, error: m } = e, h = m?.fields?.[i], g = {
			id: n,
			name: i,
			required: u,
			value: a ?? "",
			"aria-invalid": h ? !0 : void 0,
			"aria-describedby": h ? n + "-error" : void 0
		}, _ = (e) => o?.(e.currentTarget.value);
		return G("div", { class: "ap-equipment-field" }, [
			G("label", { for: n }, [r, u ? " *" : ""]),
			c ? c(n, !!h) : s ? G("select", J(g, { onChange: _ }), [s.map((e) => G("option", {
				key: e.value,
				value: e.value,
				disabled: e.disabled
			}, [e.label]))]) : l === "textarea" ? G("textarea", J(g, {
				maxlength: 4e3,
				rows: 2,
				onInput: _
			}), null) : G("input", J(g, {
				type: l,
				min: d,
				max: f,
				step: p,
				maxlength: 120,
				onInput: _
			}), null),
			!!h && G("small", {
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
] }), lk = (e) => e === "" ? null : Number(e);
function uk(e) {
	return e === "mono" ? "mono" : e === "color" || e === "osc" ? "color" : null;
}
var dk = (e) => e === null ? null : new Intl.NumberFormat(void 0, { maximumFractionDigits: 4 }).format(e), fk = {
	name: "",
	notes: null,
	manufacturer: null,
	model: null,
	specs: {}
}, pk = {
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
}, mk = {
	sensor_width_px: 1e6,
	sensor_height_px: 1e6,
	adc_bit_depth: 64,
	max_bin_x: 1024,
	max_bin_y: 1024
}, hk = /* @__PURE__ */ new Set([
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
]), gk = {
	camera: [
		"sensor_kind",
		"sensor_name",
		"sensor_width_px",
		"sensor_height_px",
		"pixel_size_x_um",
		"pixel_size_y_um",
		"cooling_supported"
	],
	primary_optics: [
		"optics_kind",
		"optical_design",
		"aperture_mm",
		"native_focal_length_mm",
		"native_f_ratio",
		"image_circle_mm",
		"optical_notes"
	],
	optical_accessory: [
		"accessory_kind",
		"nominal_factor",
		"design_backfocus_mm",
		"clear_aperture_mm",
		"optical_notes"
	],
	filter: [
		"filter_kind",
		"physical_size_mm",
		"filter_format"
	]
}, _k = [
	"bayer_pattern",
	"adc_bit_depth",
	"max_bin_x",
	"max_bin_y"
], vk = [
	"gain_min",
	"gain_max",
	"offset_min",
	"offset_max"
];
function yk(e) {
	return e.passbands ?? [];
}
function bk(e) {
	return e.readout_modes ?? [];
}
var xk = {
	band_label: "",
	center_nm: null,
	fwhm_nm: null
}, Sk = {
	mode_key: "",
	display_name: "",
	gain_min: null,
	gain_max: null,
	offset_min: null,
	offset_max: null
}, Ck = /* @__PURE__ */ R((e) => {
	let { t } = Z(), n = NS();
	return () => {
		let { kind: r, original: i, input: a, change: o, saved: s, back: c, reload: l } = e, u = n.pending.value, d = n.error.value;
		return G("form", {
			"aria-busy": u,
			onSubmit: (e) => {
				e.preventDefault(), n.run(async (e) => {
					let t = await iC(r, a, i, e);
					e.aborted || s(t);
				});
			}
		}, [
			G("h2", null, [
				t("equipment." + (i ? "editDevice" : "addDevice")),
				K(" · "),
				t("equipment.values." + r)
			]),
			G("fieldset", { disabled: u }, [G("legend", null, [t("equipment.basics")]), G("div", { class: "ap-equipment-grid" }, [[
				"name",
				"manufacturer",
				"model",
				"notes"
			].map((e) => G(ck, {
				key: e,
				label: t("equipment.fields." + e),
				name: e,
				value: a[e],
				required: e === "name",
				type: e === "notes" ? "textarea" : "text",
				error: d,
				onChange: (t) => o({
					...a,
					[e]: t
				})
			}, null))])]),
			G("fieldset", { disabled: u }, [G("legend", null, [t("equipment.specs")]), G(wk, {
				kind: r,
				specs: a.specs,
				change: (e) => o({
					...a,
					specs: e
				}),
				error: d,
				disabled: u
			}, null)]),
			G(ok, {
				error: d,
				retry: d?.status === 409 && i ? () => l(i) : void 0
			}, null),
			G("div", { class: "ap-equipment-actions" }, [G("button", {
				type: "button",
				disabled: u,
				onClick: c
			}, [t("equipment.cancel")]), G("button", {
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
] }), wk = /* @__PURE__ */ R((e) => {
	let { t } = Z();
	return () => {
		let { kind: n, specs: r, change: i, error: a, disabled: o } = e;
		function s(e) {
			let n = e in mk || hk.has(e), s = e === "cooling_supported" ? ["true", "false"] : pk[e], c = s && [{
				value: "",
				label: t("equipment.unspecified")
			}, ...s.map((e) => ({
				value: e,
				label: t("equipment.values." + e)
			}))], l = e === "sensor_kind" ? uk(r[e]) : r[e], u = t("equipment.fields." + e), d = "specs." + e;
			return c ? G(ck, {
				key: e,
				label: u,
				name: d,
				error: a,
				control: (t, n) => G(jS, {
					id: t,
					label: u,
					value: l == null ? "" : String(l),
					options: c,
					disabled: o,
					invalid: n,
					onChange: (t) => i({
						...r,
						[e]: t === "" ? null : e === "cooling_supported" ? t === "true" : t
					})
				}, null)
			}, null) : G(ck, {
				key: e,
				label: u,
				name: d,
				value: l == null ? null : String(l),
				error: a,
				type: n ? "number" : e === "optical_notes" ? "textarea" : "text",
				min: e === "design_backfocus_mm" ? 0 : n ? e in mk ? 1 : 1e-9 : void 0,
				max: n ? mk[e] ?? 1e6 : void 0,
				step: e in mk ? 1 : "any",
				onChange: (t) => i({
					...r,
					[e]: n ? lk(t) : t || null
				})
			}, null);
		}
		return G(B, null, [
			G("div", { class: "ap-equipment-grid" }, [gk[n].map(s)]),
			n === "camera" && G("details", {
				class: "ap-equipment-advanced",
				open: Object.keys(a?.fields ?? {}).some((e) => _k.includes(e.slice(6)) || e.startsWith("specs.readout_modes")) || void 0
			}, [
				G("summary", {
					class: "ap-tree-row ap-tree-folder",
					onKeydown: (e) => {
						if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
						let t = e.currentTarget.closest("details");
						t && (e.preventDefault(), e.stopPropagation(), t.open = e.key === "ArrowRight");
					}
				}, [G(Zv, null, null), G("span", null, [t("equipment.advanced")])]),
				G("div", { class: "ap-equipment-grid" }, [_k.map(s)]),
				G("h3", null, [t("equipment.fields.readout_modes")]),
				bk(r).map((e, n) => G("fieldset", { key: n }, [
					G("legend", null, [n + 1]),
					G("div", { class: "ap-equipment-grid" }, [[
						"mode_key",
						"display_name",
						...vk
					].map((o) => {
						let s = o !== "mode_key" && o !== "display_name";
						return G(ck, {
							key: o,
							label: t("equipment.fields." + o),
							name: `specs.readout_modes.${n}.${o}`,
							value: e[o],
							required: !s,
							type: s ? "number" : "text",
							min: s ? -1e6 : void 0,
							max: s ? 1e6 : void 0,
							step: "any",
							error: a,
							onChange: (e) => i({
								...r,
								readout_modes: bk(r).map((t, r) => r === n ? {
									...t,
									[o]: s ? lk(e) : e
								} : t)
							})
						}, null);
					})]),
					G("button", {
						type: "button",
						onClick: () => i({
							...r,
							readout_modes: bk(r).filter((e, t) => t !== n)
						})
					}, [t("equipment.remove")])
				])),
				G("button", {
					type: "button",
					disabled: bk(r).length >= 32,
					onClick: () => i({
						...r,
						readout_modes: [...bk(r), Sk]
					})
				}, [t("equipment.addMode")])
			]),
			n === "filter" && G(B, null, [
				G("h3", null, [t("equipment.fields.passbands")]),
				yk(r).map((e, n) => G("fieldset", { key: e.id ?? n }, [
					G("legend", null, [n + 1]),
					G("div", { class: "ap-equipment-grid" }, [[
						"band_label",
						"center_nm",
						"fwhm_nm"
					].map((o) => G(ck, {
						key: o,
						label: t("equipment.fields." + o),
						name: `specs.passbands.${n}.${o}`,
						value: e[o],
						required: o === "band_label",
						type: o === "band_label" ? "text" : "number",
						min: o === "band_label" ? void 0 : 1e-9,
						max: o === "band_label" ? void 0 : 1e6,
						step: "any",
						error: a,
						onChange: (e) => i({
							...r,
							passbands: yk(r).map((t, r) => r === n ? {
								...t,
								[o]: o === "band_label" ? e : lk(e)
							} : t)
						})
					}, null))]),
					G("button", {
						type: "button",
						onClick: () => i({
							...r,
							passbands: yk(r).filter((e, t) => t !== n)
						})
					}, [t("equipment.remove")])
				])),
				G("button", {
					type: "button",
					disabled: yk(r).length >= 32,
					onClick: () => i({
						...r,
						passbands: [...yk(r), xk]
					})
				}, [t("equipment.addBand")])
			])
		]);
	};
}, { props: [
	"kind",
	"specs",
	"change",
	"error",
	"disabled"
] }), Tk = /* @__PURE__ */ R((e) => {
	let { t } = Z();
	return () => {
		let { specs: n, kind: r } = e, i = (e) => {
			let r = e === "sensor_kind" ? uk(n[e]) : n[e];
			return r == null ? t("equipment.unspecified") : e === "cooling_supported" || e in pk ? t("equipment.values." + r) : String(r);
		}, a = yk(n);
		return G(B, null, [
			G("dl", { class: "ap-equipment-definitions" }, [[...gk[r], ...r === "camera" ? _k : []].map((e) => G("div", { key: e }, [G("dt", null, [t("equipment.fields." + e)]), G("dd", null, [i(e)])]))]),
			r === "filter" && G(B, null, [
				G("h4", null, [t("equipment.fields.passbands")]),
				(!a.length || n.filter_kind === "dual_band" && a.length < 2 || a.some((e) => e.center_nm === null || e.fwhm_nm === null)) && G("small", null, [t("equipment.incompleteBands")]),
				G("ul", null, [a.map((e, n) => G("li", { key: e.id ?? n }, [
					e.band_label,
					K(" · "),
					e.center_nm === null ? t("equipment.unspecified") : e.center_nm + " nm",
					K(" ·"),
					" ",
					t("equipment.fields.fwhm_nm"),
					K(" "),
					e.fwhm_nm ?? t("equipment.unspecified")
				]))])
			]),
			r === "camera" && bk(n).length > 0 && G(B, null, [G("h4", null, [t("equipment.fields.readout_modes")]), bk(n).map((e) => G("details", { key: e.mode_key }, [G("summary", null, [
				e.display_name,
				K(" ("),
				e.mode_key,
				K(")")
			]), G("dl", null, [vk.map((n) => G("div", { key: n }, [G("dt", null, [t("equipment.fields." + n)]), G("dd", null, [e[n] ?? t("equipment.unspecified")])]))])]))])
		]);
	};
}, { props: ["specs", "kind"] }), Ek = /* @__PURE__ */ R((e, { slots: t }) => {
	let n = /* @__PURE__ */ N(e.initiallyOpen ?? !1), r = wr();
	return () => G("section", { class: "ap-detail-section" }, [G("button", {
		type: "button",
		class: "ap-detail-toggle ap-tree-row ap-tree-folder",
		"aria-expanded": n.value,
		"aria-controls": r,
		onClick: () => {
			n.value = !n.value;
		}
	}, [
		G(Zv, null, null),
		G("span", null, [e.title]),
		e.count && G("small", null, [e.count])
	]), G("div", {
		id: r,
		hidden: !n.value,
		class: "ap-detail-content"
	}, [t.default?.()])]);
}, { props: [
	"title",
	"count",
	"initiallyOpen"
] }), Dk = /* @__PURE__ */ R((e) => {
	let { t } = Z();
	return () => {
		let { editLabel: n, archived: r, pending: i, onEdit: a, onArchive: o, onDelete: s } = e;
		return G("div", { class: "ap-equipment-actions ap-equipment-detail-actions" }, [
			a && G("button", {
				class: "ap-equipment-primary",
				type: "button",
				disabled: i,
				onClick: a
			}, [n]),
			G("button", {
				type: "button",
				disabled: i,
				onClick: o
			}, [t("equipment." + (r ? "restore" : "archive"))]),
			G("button", {
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
function Ok({ resource: e, loadingLabel: t, retry: n, renderContent: r, renderError: i }) {
	return e.state === "loading" ? G("p", { role: "status" }, [t]) : e.state === "error" ? i ? G(B, null, [i(e.error, n)]) : G(Hv, {
		error: e.error,
		retry: n
	}, null) : G(B, null, [r(e.data)]);
}
Ok.props = [
	"resource",
	"loadingLabel",
	"retry",
	"renderContent",
	"renderError"
];
// src/features/library/pages/EquipmentDetails.tsx
var kk = /* @__PURE__ */ R((e) => {
	let { t } = Z(), { resource: n, refresh: r } = Ry(Y(() => {
		let t = e.id;
		return (e) => rC(t, e);
	})), i = NS(), a = /* @__PURE__ */ N(!1);
	return () => {
		let { edit: o, openTrain: s, changed: c, deleted: l } = e;
		return G(Ok, {
			resource: n.value,
			loadingLabel: t("states.loading"),
			retry: r,
			renderError: sk,
			renderContent: (e) => {
				let n = e.usage_summary ?? [], u = [...gk[e.equipment_type], ...e.equipment_type === "camera" ? _k : []], d = u.filter((t) => e.specs[t] !== null && e.specs[t] !== void 0 && e.specs[t] !== ""), f = [
					"manufacturer",
					"model",
					"notes"
				].filter((t) => !!e[t]?.trim());
				return G(B, null, [
					G("div", { class: "ap-detail-card" }, [
						G("h2", null, [e.name]),
						G("small", null, [
							t("equipment.values." + e.equipment_type),
							K(" · "),
							t(e.archived_at_utc ? "equipment.values.archived" : "equipment.inUse")
						]),
						G("dl", { class: "ap-equipment-definitions" }, [d.slice(0, 4).map((n) => G("div", { key: n }, [G("dt", null, [t("equipment.fields." + n)]), G("dd", null, [typeof e.specs[n] == "boolean" || [
							"sensor_kind",
							"optics_kind",
							"accessory_kind",
							"filter_kind"
						].includes(n) ? t("equipment.values." + e.specs[n]) : String(e.specs[n])])]))])
					]),
					G(Ek, {
						title: t("equipment.basics"),
						initiallyOpen: !0
					}, { default: () => f.length ? G("dl", { class: "ap-equipment-definitions" }, [f.map((n) => G("div", { key: n }, [G("dt", null, [t("equipment.fields." + n)]), G("dd", null, [e[n]])]))]) : G("p", null, [t("equipment.noBasicInformation")]) }),
					G(Ek, {
						title: t("equipment.specs"),
						count: d.length + " / " + u.length
					}, { default: () => G(Tk, {
						specs: e.specs,
						kind: e.equipment_type
					}, null) }),
					G(Ek, {
						title: t("equipment.usage"),
						count: String(n.length)
					}, { default: () => n.length ? G("ul", null, [n.map((e) => G("li", { key: e.train_id }, [G("button", {
						type: "button",
						onClick: () => s(e.train_id)
					}, [e.name])]))]) : G("p", null, [t("equipment.noUsage")]) }),
					G(ok, {
						error: i.error.value,
						retry: i.error.value?.status === 409 ? r : void 0
					}, null),
					G(Dk, {
						editLabel: t("equipment.editAction"),
						archived: !!e.archived_at_utc,
						pending: i.pending.value,
						onEdit: () => o(e),
						onArchive: () => void i.run(async (n) => {
							if (!e.archived_at_utc && !await MS(t("equipment.archive"), t("equipment.archiveDeviceConfirm"), e.name) || n.aborted) return;
							let i = await aC(e, n);
							n.aborted || (c(i.archived_at_utc ? "archivedReceipt" : "restoredReceipt"), r());
						}),
						onDelete: () => void i.run(async (r) => {
							n.length ? a.value = !0 : await MS(t("equipment.deleteDevice"), t("equipment.deleteDeviceConfirm"), e.name, "delete") && !r.aborted && (await oC(e, r), r.aborted || l());
						})
					}, null),
					a.value && n.length > 0 && G("div", {
						role: "alert",
						class: "ap-equipment-error"
					}, [G("p", null, [t("equipment.deleteReferenced")]), G("ul", null, [n.map((e) => G("li", { key: e.train_id }, [G("button", {
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
function Ak({ records: e, recordKey: t, renderRecord: n, renderEmpty: r }) {
	return e.length > 0 ? G("ul", { class: "ap-equipment-list" }, [e.map((e) => G("li", { key: t(e) }, [n(e)]))]) : G(B, null, [r()]);
}
Ak.props = [
	"records",
	"recordKey",
	"renderRecord",
	"renderEmpty"
];
// src/features/library/pages/EquipmentList.tsx
var jk = /* @__PURE__ */ R((e) => {
	let { t } = Z(), n = /* @__PURE__ */ N(e.search.q.trim()), r = (e) => {
		n.value = e.trim();
	}, i = /* @__PURE__ */ P(), a = NS(), o = Y(() => ({
		mode: e.mode,
		filter: e.search.filter,
		q: n.value,
		epoch: e.epoch
	})), s = Y(() => {
		let { mode: e, filter: t, q: n } = o.value;
		return (r, i = "") => {
			let a = {
				q: n,
				after: i,
				archived: t === "archived" ? "true" : "false"
			};
			return e === "devices" ? nC({
				...a,
				type: IS.includes(t) ? t : void 0
			}, r) : sC({
				...a,
				status: t || void 0
			}, r);
		};
	}), { resource: c, refresh: l } = Ry(s);
	return () => {
		let { search: o, setSearch: u, mode: d, open: f, add: p } = e, m = [
			"",
			...d === "devices" ? IS : ["draft", "published"],
			"archived"
		], h = c.value;
		return G(B, null, [
			G("div", { class: "ap-equipment-actions" }, [G("h2", null, [t("equipment." + d), h.state === "ready" && h.data.total !== void 0 && G(B, null, [K(" · "), h.data.total])]), G("button", {
				type: "button",
				class: "ap-equipment-primary",
				onClick: p
			}, [t("equipment." + (d === "devices" ? "addDevice" : "addTrain"))])]),
			G("div", { class: "ap-search-toolbar ap-equipment-search" }, [G(zv, {
				label: t("equipment." + (d === "devices" ? "searchDevice" : "searchTrain")),
				clearLabel: t("browse.clear"),
				value: o.q,
				onValueChange: (e) => u({
					...o,
					q: e
				}),
				onSearch: r
			}, null), G(Bv, {
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
			G(Ok, {
				resource: h,
				loadingLabel: t("states.loading"),
				retry: () => {
					i.value = void 0, l();
				},
				renderError: sk,
				renderContent: (e) => {
					let r = s.value, c = i.value?.request === r ? i.value : void 0, l = e.items.concat(c?.items ?? []), p = c ? c.next : e.next;
					return G(B, null, [
						G(Ak, {
							records: l,
							recordKey: (e) => e.id,
							renderRecord: (e) => G("button", {
								type: "button",
								onClick: () => f(e.id),
								class: "ap-equipment-row"
							}, [G("strong", { title: e.name }, [e.name]), "equipment_type" in e ? G(Mk, { device: e }, null) : G(Nk, { train: e }, null)]),
							renderEmpty: () => G(B, null, [G("p", null, [t("equipment." + (n.value || o.filter ? "noMatches" : d === "devices" ? "emptyDevices" : "emptyTrains"))]), (o.q || o.filter) && G("button", {
								type: "button",
								onClick: () => u({
									q: "",
									filter: ""
								})
							}, [t("equipment.resetSearch")])])
						}, null),
						G(ok, { error: a.error.value }, null),
						p && G("button", {
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
] }), Mk = /* @__PURE__ */ R((e) => {
	let { t } = Z();
	return () => {
		let { device: n } = e, r = n.specs, i = uk(r.sensor_kind), a = n.equipment_type === "camera" ? i && t("equipment.values." + i) : n.equipment_type === "primary_optics" ? r.native_focal_length_mm && r.native_focal_length_mm + " mm" : n.equipment_type === "optical_accessory" ? r.nominal_factor && r.nominal_factor + "×" : r.filter_kind && t("equipment.values." + r.filter_kind);
		return G("small", null, [[
			t("equipment.values." + n.equipment_type),
			n.manufacturer,
			n.model,
			a,
			n.archived_at_utc && t("equipment.values.archived")
		].filter(Boolean).join(" · ")]);
	};
}, { props: ["device"] }), Nk = /* @__PURE__ */ R((e) => {
	let { t } = Z();
	return () => {
		let { train: n } = e, { camera: r, primary_optics: i, accessories: a, filters: o } = n.summary;
		return G(B, null, [
			G("small", null, [t(n.status === "published" ? "equipment.configured" : "equipment.values." + n.status)]),
			G("small", null, [[
				r,
				i,
				...a
			].filter(Boolean).join(" + ")]),
			o.length > 0 && G("small", null, [
				t("equipment.fields.filter_ids"),
				K(" · "),
				o.join(", ")
			])
		]);
	};
}, { props: ["train"] }), Pk = {
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
}, Fk = /* @__PURE__ */ R((e) => {
	let { t } = Z(), n = Ry(pC), r = NS();
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
			if (t) await dC(t, l, i.expected, e), e.aborted || c(t);
			else {
				let t = await uC(l, e);
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
		let _ = (e) => u.filter((t) => t.equipment_type === e && !t.archived_at_utc), v = (e) => u.find((t) => t.id === e)?.name ?? e, y = (e) => m.includes(e) ? " · " + t("equipment.invalidDevice") : "", b = (e) => G("button", {
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
		return G("form", {
			"aria-busy": f,
			onSubmit: (e) => {
				e.preventDefault(), r.run(h);
			}
		}, [
			G("h2", null, [t("equipment." + (i.id ? "editTrain" : "addTrain"))]),
			G("fieldset", { disabled: f }, [G("legend", null, [t("equipment.basics")]), G("div", { class: "ap-equipment-grid" }, [G(ck, {
				label: t("equipment.fields.name"),
				name: "name",
				value: l.name,
				required: !0,
				error: p,
				onChange: (e) => d({
					...l,
					name: e
				})
			}, null), G(ck, {
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
			G(Ok, {
				resource: n.resource.value,
				loadingLabel: t("states.loading"),
				retry: n.refresh,
				renderError: sk,
				renderContent: () => G(B, null, [
					G("fieldset", { disabled: f }, [
						G("legend", null, [t("equipment.components")]),
						["camera_id", "primary_optics_id"].map((e) => {
							let n = e === "camera_id" ? "camera" : "primary_optics";
							return G("div", {
								class: "ap-equipment-picker",
								key: e
							}, [G(ck, {
								label: t("equipment.fields." + e),
								name: e,
								error: p,
								control: (r, i) => G(jS, {
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
						G("h3", null, [t("equipment.fields.accessory_ids")]),
						G("ol", { class: "ap-equipment-list" }, [l.accessory_ids.map((e, n) => G("li", { key: e }, [G("span", null, [
							n + 1,
							K(". "),
							v(e),
							y(e)
						]), G("div", { class: "ap-equipment-actions" }, [
							G("button", {
								type: "button",
								disabled: n === 0,
								onClick: () => g(n, -1)
							}, [t("equipment.moveUp")]),
							G("button", {
								type: "button",
								disabled: n + 1 === l.accessory_ids.length,
								onClick: () => g(n, 1)
							}, [t("equipment.moveDown")]),
							G("button", {
								type: "button",
								onClick: () => d({
									...l,
									accessory_ids: l.accessory_ids.filter((t) => t !== e)
								})
							}, [t("equipment.remove")])
						])]))]),
						G("div", { class: "ap-equipment-picker" }, [G(ck, {
							label: t("equipment.addAccessory"),
							name: "accessory_ids",
							error: p,
							control: (e, n) => G(jS, {
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
					G("fieldset", { disabled: f }, [G("legend", null, [t("equipment.fields.filter_ids")]), G("div", { class: "ap-equipment-picker" }, [G("div", { class: "ap-equipment-field" }, [G(wC, {
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
					G("small", null, [
						t("equipment.estimate"),
						K(" · "),
						dk(E) ?? t("equipment.unspecified"),
						E !== null && " mm",
						K(" · ƒ/"),
						E !== null && typeof T == "number" ? dk(E / T) : t("equipment.unspecified")
					])
				])
			}, null),
			n.resource.value.state === "ready" && m.length > 0 && G("small", null, [t("equipment.invalidDevice")]),
			G(ok, {
				error: p,
				retry: p?.status === 409 && i.id ? () => void r.run(async (e) => {
					let n = await cC(i.id, e);
					if (n.status === "archived") throw new Q("TRAIN_ARCHIVED");
					!e.aborted && await MS(t("equipment.reload"), t("equipment.rebaseTrainConfirm")) && !e.aborted && a({
						...i,
						expected: n.configuration?.draft_version ?? null,
						saved: n.configuration?.draft ?? null
					});
				}) : void 0
			}, null),
			G("div", { class: "ap-equipment-actions" }, [G("button", {
				type: "button",
				disabled: f,
				onClick: s
			}, [t("equipment.cancel")]), G("button", {
				type: "submit",
				class: "ap-equipment-primary",
				disabled: f
			}, [t("equipment.save")])]),
			f && G("small", { role: "status" }, [t("equipment.saving")])
		]);
	};
}, { props: [
	"edit",
	"change",
	"addDevice",
	"cancel",
	"saved"
] });
function Ik(e, t) {
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
var Lk = /* @__PURE__ */ R((e) => {
	let { t } = Z(), n = Ry(Y(() => {
		let t = e.id;
		return (e) => cC(t, e);
	})), r = NS();
	return () => {
		let { edit: i, changed: a, openDevice: o, deleted: s } = e;
		return G(Ok, {
			resource: n.resource.value,
			loadingLabel: t("states.loading"),
			retry: n.refresh,
			renderError: sk,
			renderContent: (e) => {
				let c = e.status === "archived";
				return G(B, null, [
					G("div", { class: "ap-detail-card" }, [
						G("h2", null, [e.name]),
						G("small", null, [t(e.status === "published" ? "equipment.configured" : "equipment.values." + e.status)]),
						G(Rk, { train: e }, null)
					]),
					G(zk, {
						train: e,
						openDevice: o
					}, null),
					G(ok, {
						error: r.error.value,
						retry: r.error.value?.status === 409 ? n.refresh : void 0
					}, null),
					G(Dk, {
						editLabel: t("equipment.editTrain"),
						archived: c,
						pending: r.pending.value,
						onEdit: c ? void 0 : () => i(e),
						onArchive: () => void r.run(async (r) => {
							if (!c && !await MS(t("equipment.archive"), t("equipment.archiveTrainConfirm"), e.name) || r.aborted) return;
							let i = await fC(e, r);
							r.aborted || (a(i.status === "archived" ? "archivedReceipt" : "restoredReceipt"), n.refresh());
						}),
						onDelete: () => void r.run(async (n) => {
							await MS(t("equipment.deleteTrain"), t("equipment.deleteTrainConfirm"), e.name, "delete") && !n.aborted && (await lC(e, n), n.aborted || s());
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
] }), Rk = /* @__PURE__ */ R((e) => {
	let { t } = Z();
	return () => {
		let { train: n } = e, r = n.configuration?.draft;
		if (!r) return null;
		let i = new Map(n.components?.map((e) => [e.id, e])), a = r.primary_optics_id ? i.get(r.primary_optics_id) : void 0, o = a?.specs.native_focal_length_mm, s = a?.specs.aperture_mm, c = r.accessory_ids.map((e) => i.get(e)?.specs.nominal_factor);
		if (typeof o != "number" || o <= 0 || !c.every((e) => typeof e == "number" && e > 0)) return null;
		let l = c.reduce((e, t) => e * Number(t), o);
		return !Number.isFinite(l) || l <= 0 ? null : G("p", null, [
			t("equipment.estimate"),
			K(" · "),
			dk(l),
			K(" mm"),
			typeof s == "number" && s > 0 && Number.isFinite(l / s) && " · ƒ/" + dk(l / s)
		]);
	};
}, { props: ["train"] }), zk = /* @__PURE__ */ R((e) => {
	let { t } = Z();
	return () => {
		let { train: n, openDevice: r } = e, i = n.configuration?.draft;
		if (!i) return G("p", null, [t("equipment.noConfiguration")]);
		let a = new Map(n.components?.map((e) => [e.id, e])), o = (e) => e ? a.get(e)?.name ?? e : t("equipment.unspecified"), s = (e) => G(Bk, {
			id: e,
			device: a.get(e),
			openDevice: r
		}, null);
		return G(B, null, [
			G(Ek, {
				title: t("equipment.currentConfiguration"),
				initiallyOpen: !0
			}, { default: () => G(B, null, [i.notes && G("p", null, [i.notes]), G("dl", { class: "ap-equipment-definitions" }, [
				G("div", null, [G("dt", null, [t("equipment.fields.camera_id")]), G("dd", null, [o(i.camera_id)])]),
				G("div", null, [G("dt", null, [t("equipment.fields.primary_optics_id")]), G("dd", null, [o(i.primary_optics_id)])]),
				G("div", null, [G("dt", null, [
					t("equipment.fields.accessory_ids"),
					K(" · "),
					i.accessory_ids.length
				]), G("dd", null, [i.accessory_ids.map(o).join(", ") || t("equipment.unspecified")])]),
				G("div", null, [G("dt", null, [
					t("equipment.fields.filter_ids"),
					K(" · "),
					i.filter_ids.length
				]), G("dd", null, [i.filter_ids.map(o).join(", ") || t("equipment.unspecified")])])
			])]) }),
			G(Ek, {
				title: t("equipment.componentDetails"),
				count: String([
					i.camera_id,
					i.primary_optics_id,
					...i.accessory_ids
				].filter(Boolean).length)
			}, { default: () => G(B, null, [[
				i.camera_id,
				i.primary_optics_id,
				...i.accessory_ids
			].map((e) => e && G("div", { key: e }, [s(e)]))]) }),
			G(Ek, {
				title: t("equipment.fields.filter_ids"),
				count: String(i.filter_ids.length)
			}, { default: () => G(B, null, [i.filter_ids.length ? i.filter_ids.map((e) => G("div", { key: e }, [s(e)])) : G("p", null, [t("equipment.unspecified")])]) })
		]);
	};
}, { props: ["train", "openDevice"] }), Bk = /* @__PURE__ */ R((e) => {
	let { t } = Z();
	return () => {
		let { id: n, device: r, openDevice: i } = e;
		return r ? G("details", null, [
			G("summary", null, [
				r.name,
				K(" · "),
				t("equipment.values." + r.equipment_type),
				r.archived_at_utc && " · " + t("equipment.values.archived")
			]),
			G("button", {
				type: "button",
				onClick: () => i(n)
			}, [r.name]),
			G("small", null, [[r.manufacturer, r.model].filter(Boolean).join(" · ")]),
			r.notes && G("p", null, [r.notes]),
			G(Tk, {
				specs: r.specs,
				kind: r.equipment_type
			}, null)
		]) : G("p", null, [
			t("equipment.invalidDevice"),
			K(" · "),
			n
		]);
	};
}, { props: [
	"id",
	"device",
	"openDevice"
] }), Vk = ["devices", "trains"], Hk = () => ({
	id: null,
	expected: null,
	data: Pk,
	saved: null
}), Uk = /* @__PURE__ */ R((e) => {
	let { t } = Z(), n = e.session.current, r = /* @__PURE__ */ P(n?.page ?? { name: "equipment-list" }), i = /* @__PURE__ */ P(n?.deviceInput ?? fk), a = /* @__PURE__ */ N(n?.deviceDirty ?? !1), o = /* @__PURE__ */ P(n?.train ?? Hk()), s = /* @__PURE__ */ P({
		q: "",
		filter: ""
	}), c = /* @__PURE__ */ P({
		q: "",
		filter: ""
	}), l = /* @__PURE__ */ N(0), u = /* @__PURE__ */ N(""), d = /* @__PURE__ */ N(!!n), f = /* @__PURE__ */ N(null), p = Y(() => r.value.name.startsWith("train-") ? "trains" : "devices"), m = Y(() => r.value.name === "equipment-form" && r.value.quick), h = Y(() => a.value || (r.value.name === "train-form" || m.value) && JSON.stringify(o.value.data) !== JSON.stringify(o.value.saved ?? Pk)), g = NS(), _ = /* @__PURE__ */ N(p.value === "trains");
	L([
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
		return !v() && (!h.value || await MS(t("equipment.unsaved"), t("equipment.discardConfirm")));
	}
	async function b() {
		return await y() ? (a.value = !1, o.value = Hk(), r.value = { name: "equipment-list" }, e.session.current = void 0, !0) : !1;
	}
	Br(() => {
		e.guard.value = b;
	}), Ae(() => {
		e.guard.value === b && (e.guard.value = null);
	}), L(h, (e, t, n) => {
		if (!e) return;
		let r = (e) => {
			e.preventDefault(), e.returnValue = "";
		};
		window.addEventListener("beforeunload", r), n(() => window.removeEventListener("beforeunload", r));
	}, { immediate: !0 });
	function x() {
		f.value?.querySelector("[data-current=\"true\"]")?.focus({ preventScroll: !0 });
	}
	Br(x), L(() => r.value.name, x, { flush: "post" });
	function S(e) {
		u.value = e, l.value += 1;
	}
	function C(e) {
		u.value = "", d.value = !1, r.value = e;
	}
	async function w(e) {
		let t = e === "devices" ? "equipment-list" : "train-list";
		r.value.name !== t && await y() && (a.value = !1, o.value = Hk(), e === "trains" && (_.value = !0), C({ name: t }));
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
		} : fk, a.value = !1, C({
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
				...Pk,
				name: e.name,
				notes: e.notes
			} : Pk),
			saved: t
		}, C({ name: "train-form" });
	}
	async function O() {
		if (v()) return;
		let n = r.value;
		if (n.name === "equipment-form" && n.quick) {
			if (a.value && !await MS(t("equipment.unsaved"), t("equipment.discardConfirm"))) return;
			a.value = !1, C({ name: "train-form" });
			return;
		}
		if (!await y()) return;
		let i = o.value.id;
		switch (a.value = !1, o.value = Hk(), e.session.current = void 0, n.name) {
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
	function ee(e) {
		a.value = !1, m.value ? (o.value = Ik(o.value, e), C({ name: "train-form" })) : C({
			name: "equipment-detail",
			id: e.id
		}), S("deviceReceipt");
	}
	function A(e) {
		let n = r.value;
		n.name === "equipment-form" && g.run(async (i) => {
			let a = await rC(e.id, i);
			!i.aborted && r.value === n && await MS(t("equipment.reload"), t("equipment.rebaseDeviceConfirm")) && !i.aborted && r.value === n && (r.value = {
				...n,
				original: a
			});
		});
	}
	return () => {
		let n = r.value;
		return G("div", {
			class: "ap-equipment",
			ref: f
		}, [
			G("div", { class: "ap-equipment-heading" }, [G("button", {
				type: "button",
				class: "ap-settings-back",
				onClick: () => void O()
			}, [t("actions.back")]), G("h2", null, [t("modules.equipment.title")])]),
			G(zy, {
				items: Vk,
				active: p.value,
				prefix: "ap-equipment",
				label: t("modules.equipment.title"),
				title: (e) => t("equipment." + e),
				select: (e) => void w(e)
			}, null),
			d.value && G("small", { role: "status" }, [t("equipment.sessionRestored")]),
			u.value && G("small", { role: "status" }, [t("equipment." + u.value)]),
			h.value && G("small", null, [t("equipment.unsaved")]),
			Vk.map((r) => {
				let a = n.name === (r === "devices" ? "equipment-list" : "train-list");
				return G("div", {
					key: r,
					role: "tabpanel",
					id: "ap-equipment-panel-" + r,
					"aria-labelledby": "ap-equipment-tab-" + r,
					class: "ap-equipment-panel",
					hidden: r !== p.value
				}, [G("div", {
					class: "ap-scroll",
					"data-current": r === p.value && a,
					tabindex: -1,
					hidden: !a
				}, [r === "devices" ? G(jk, {
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
				}, null) : e.trainAvailable ? _.value && G(jk, {
					search: c.value,
					setSearch: (e) => {
						c.value = e;
					},
					mode: "trains",
					epoch: l.value,
					open: T,
					add: () => D()
				}, null) : G("p", { role: "status" }, [t("equipment.unavailable")])]), r === p.value && !a && G("div", {
					class: "ap-scroll",
					"data-current": "true",
					tabindex: -1,
					key: n.name
				}, [
					n.name === "equipment-type" && G(B, null, [G("h2", null, [t("equipment.chooseType")]), G("ul", { class: "ap-equipment-list" }, [IS.map((e) => G("li", { key: e }, [G("button", {
						class: "ap-equipment-row",
						type: "button",
						onClick: () => E(e, null)
					}, [G("strong", null, [t("equipment.values." + e)]), G("small", null, [t("equipment.typeHint." + e)])])]))])]),
					n.name === "equipment-form" && G(B, null, [G(Ck, {
						kind: n.kind,
						original: n.original,
						input: i.value,
						change: k,
						saved: ee,
						back: () => void O(),
						reload: A
					}, null), G(ok, { error: g.error.value }, null)]),
					n.name === "equipment-detail" && G(kk, {
						key: n.id,
						id: n.id,
						edit: (e) => E(e.equipment_type, e),
						openTrain: T,
						changed: S,
						deleted: () => {
							C({ name: "equipment-list" }), S("deletedReceipt");
						}
					}, null),
					n.name === "train-form" && G(Fk, {
						edit: o.value,
						change: (e) => {
							o.value = e;
						},
						addDevice: (e) => E(e, null, !0),
						cancel: () => void O(),
						saved: (e) => {
							o.value = Hk(), T(e), S("trainReceipt");
						}
					}, null),
					n.name === "train-detail" && G(Lk, {
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
] }), Wk = /* @__PURE__ */ R((e) => {
	let { t } = Z();
	return () => {
		let { status: n, refresh: r, storage: i, refreshStorage: a, equipmentGuard: o, equipmentSession: s, bundles: c, selectedModule: l, selectModule: u } = e, d = (e) => e === "storage" || e === "environment" ? i.state === "ready" ? "available" : i.state : (e === "equipment" || e === "software" && c.length > 0) && n.state !== "ready" ? n.state : e === "software" ? c.length > 0 && n.state === "ready" && n.data.capabilities.software?.available ? "available" : "unavailable" : e === "equipment" ? n.state === "ready" && n.data.capabilities.equipment?.available ? "available" : "unavailable" : e === "system" ? n.state === "ready" ? "partial" : n.state : "planned";
		return G(B, null, [
			G("div", {
				hidden: l !== null,
				class: "ap-scroll"
			}, [kD.map((e) => G("button", {
				class: "ap-module",
				key: e,
				onClick: () => u(e)
			}, [
				G("strong", null, [t(`modules.${e}.title`)]),
				G("small", null, [t(`modules.${e}.description`)]),
				G("small", null, [t(`states.${d(e)}`)])
			]))]),
			l === "equipment" && (n.state === "ready" && n.data.capabilities.equipment?.available ? G(Uk, {
				guard: o,
				session: s,
				trainAvailable: !!n.data.capabilities.optical_trains?.available,
				onBack: () => u(null)
			}, null) : G("div", { class: "ap-scroll" }, [
				G("button", {
					type: "button",
					onClick: () => u(null)
				}, [t("actions.back")]),
				G("h2", null, [t("modules.equipment.title")]),
				n.state === "error" ? G(Hv, {
					error: n.error,
					retry: r
				}, null) : G("p", { role: "status" }, [t(n.state === "loading" ? "states.loading" : "equipment.unavailable"), n.state === "ready" && n.data.capabilities.equipment?.reason && G(B, null, [
					" ",
					K("· "),
					G("code", null, [n.data.capabilities.equipment.reason])
				])]),
				G("button", {
					type: "button",
					onClick: r
				}, [t("actions.refresh")])
			])),
			l && l !== "equipment" && G("div", { class: l === "storage" ? "ap-scroll ap-storage-detail" : "ap-scroll" }, [
				G("button", {
					type: "button",
					class: "ap-settings-back",
					onClick: () => u(null)
				}, [t("actions.back")]),
				G("h2", null, [t(`modules.${l}.title`)]),
				l !== "storage" && l !== "software" && l !== "environment" && G(B, null, [G("p", null, [t(`modules.${l}.description`)]), G("p", null, [t(`states.${d(l)}`)])]),
				l === "storage" && G(UO, {
					resource: i,
					refresh: a
				}, null),
				l === "software" && G(WO, { bundles: c }, null),
				l === "environment" && G(ak, { onSaved: a }, null),
				l !== "system" && l !== "storage" && l !== "software" && l !== "environment" && G("p", null, [t(l === "agent" ? "settings.agentNote" : "settings.plannedNote")]),
				l !== "system" && l !== "software" && AD[l] && n.state === "ready" && G("p", null, [
					t("settings.backendCapability"),
					K(": "),
					AD[l],
					K(" —"),
					" ",
					t(n.data.capabilities[AD[l]]?.available ? "states.available" : "states.unavailable")
				]),
				l === "system" && G(B, null, [
					G("button", { onClick: r }, [t("actions.refresh")]),
					n.state === "error" && G(Hv, {
						error: n.error,
						retry: r
					}, null),
					n.state === "loading" && G("p", { role: "status" }, [t("states.loading")]),
					n.state === "ready" && G(B, null, [
						G("dl", null, [
							G("div", null, [G("dt", null, [t("settings.version")]), G("dd", null, [n.data.extension.version])]),
							G("div", null, [G("dt", null, [t("settings.api")]), G("dd", null, [n.data.api_version])]),
							G("div", null, [G("dt", null, [t("settings.status")]), G("dd", null, [n.data.status])]),
							G("div", null, [G("dt", null, [t("settings.nodeRegistered")]), G("dd", null, [t(n.data.runtime.node_registered ? "states.available" : "states.unavailable")])])
						]),
						G("h3", null, [t("settings.capabilities")]),
						Object.entries(n.data.capabilities).map(([e, n]) => G("p", { key: e }, [
							G("code", null, [e]),
							K(" —"),
							" ",
							t(n.available ? "states.available" : "states.unavailable"),
							n.reason && ` (${n.reason})`
						])),
						G("p", null, [t("settings.statusBoundary")])
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
function Gk(e, t = "custom_nodes.ComfyUI_AstroPhoto") {
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
async function Kk(e) {
	let t = new URL(import.meta.url).pathname.match(/\/extensions\/([^/]+)\/main\.js$/)?.[1], n = t ? `custom_nodes.${decodeURIComponent(t)}` : void 0;
	return Gk(await Ff("/object_info", e, "no-store"), n);
}
// src/api/status.ts
function qk(e) {
	if (!$(e) || !$(e.extension) || e.extension.id !== "ComfyUI_AstroPhoto" || typeof e.extension.version != "string" || e.api_version !== "v1" || !["ok", "degraded"].includes(String(e.status)) || !$(e.runtime) || typeof e.runtime.node_registered != "boolean" || typeof e.runtime.routes_registered != "boolean" || !$(e.capabilities) || !Object.values(e.capabilities).every((e) => $(e) && typeof e.available == "boolean" && (e.reason === null || typeof e.reason == "string"))) throw new Q("schema");
	return e;
}
async function Jk(e) {
	return qk(await Ff("/astrophoto/v1/status", e));
}
// src/features/sidebar/Sidebar.tsx
var Yk = [
	"nodes",
	"assets",
	"settings"
], Xk = /* @__PURE__ */ R((e) => {
	let { t } = Z(), n = /* @__PURE__ */ P(e.equipmentSession.current ? "settings" : "assets"), r = /* @__PURE__ */ P(null), i = !1, a = !1;
	Ae(() => {
		a = !0;
	});
	let o = /* @__PURE__ */ P(!1), s = /* @__PURE__ */ P(n.value === "assets"), c = /* @__PURE__ */ P(n.value === "settings"), l = /* @__PURE__ */ P(e.equipmentSession.current ? "equipment" : null), u = /* @__PURE__ */ P(0), d = /* @__PURE__ */ P(null), f = /* @__PURE__ */ R(() => {
		let { resource: e, refresh: t } = Ry(Kk);
		return p.value = t, () => G(gy, {
			active: n.value === "nodes",
			resource: e.value,
			refresh: t,
			homeActivation: u.value
		}, null);
	}), p = /* @__PURE__ */ P(), m = /* @__PURE__ */ R(() => {
		let { resource: t, refresh: n } = Ry(Jk), { resource: i, refresh: a } = Ry(Qw, !0);
		return () => G(Wk, {
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
	async function h(e, t = null) {
		let f = n.value;
		if (i) return;
		let p = f === "settings" ? r.value : null;
		i = !0;
		try {
			if (p && !await p() || a) return;
			if (e === "assets" && d.value) {
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
		return G(B, null, [
			G("header", null, [G("strong", null, [t("nav.title")]), e === "nodes" && G("button", {
				class: "ap-refresh-button",
				type: "button",
				onClick: () => p.value?.(),
				"aria-label": r,
				title: r
			}, [G("svg", {
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
				G("path", { d: "M3 12a9 9 0 0 1 9-9a9.75 9.75 0 0 1 6.74 2.74L21 8" }, null),
				G("path", { d: "M21 3v5h-5m5 4a9 9 0 0 1-9 9a9.75 9.75 0 0 1-6.74-2.74L3 16" }, null),
				G("path", { d: "M8 16H3v5" }, null)
			])])]),
			G(zy, {
				items: Yk,
				active: e,
				prefix: "ap",
				label: t("nav.label"),
				title: (e) => t("nav." + e),
				select: h
			}, null),
			Yk.map((t) => G("section", {
				key: t,
				id: `ap-panel-${t}`,
				role: "tabpanel",
				"aria-labelledby": `ap-tab-${t}`,
				hidden: e !== t
			}, [t === "nodes" ? o.value && G(f, null, null) : t === "assets" ? s.value && G(OD, {
				ref: d,
				active: e === "assets",
				openStorage: () => {
					h("settings", "storage");
				}
			}, null) : c.value && G(m, null, null)]))
		]);
	};
}, { props: ["equipmentSession", "bundles"] }), Zk = {
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
}, Qk = {
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
			title: "Storage",
			description: "Data directory, workspaces, cache and imports"
		},
		software: {
			title: "Software",
			description: "Discover processing software and validate program paths, versions and capabilities."
		},
		equipment: {
			title: "Equipment & Optics",
			description: "Cameras, telescopes, filters and optical trains."
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
	storage: {
		dataRoot: "Data Root",
		db: "Asset database",
		importMode: "Default import mode",
		reference: "Index in database only",
		copy: "Copy into managed workspace",
		referenceHelp: "Originals stay in their current locations. No copies are made.",
		copyHelp: "Managed copies use additional disk space. Originals are retained.",
		workspaces: "Workspaces",
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
		exitClearsCache: "ComfyUI clears AstroPhoto Cache on exit, including failed processing diagnostics.",
		movedBytes: "Moved",
		discardTarget: "Clear failed move files",
		discardTargetHelp: "Only verified files belonging to this failed job will be removed.",
		cleanupCount: "Source files pending cleanup",
		migrate: "Migrate workspace",
		remove: "Remove",
		removeHelp: "Remove this workspace registration. Its directory and files stay on disk.",
		path: "Absolute path on the ComfyUI server",
		name: "Workspace name",
		close: "Close",
		cache: "Cache",
		used: "Used",
		limit: "Cache limit (GB)",
		save: "Save",
		clear: "Clear cache",
		confirmClear: "Remove rebuildable files from the active cache?",
		clearResult: "Removed {count} ({size}). Skipped {skipped}. Failed {failed}.",
		add: "Add workspace",
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
			MIGRATION_PLAN_STALE: "The migration plan has changed. Run preflight again.",
			NO_MIGRATION_GROUPS: "No complete asset group can be moved to this destination.",
			SOURCE_CLEANUP_PENDING: "The destination is active. Retry cleanup of the remaining source files.",
			WORKSPACE_FILES_MISSING: "Registered files required for this move are missing.",
			INSUFFICIENT_DISK_SPACE: "The target volume has insufficient space.",
			WORKSPACE_OFFLINE: "The workspace is offline.",
			WORKSPACE_READ_ONLY: "The workspace is read only.",
			WORKSPACE_IDENTITY_MISMATCH: "The workspace identity does not match.",
			SOURCE_CHANGED: "The source file changed during this operation.",
			NO_RETRYABLE_FILES: "No unchanged, unregistered files remain to retry. Check a new selection to continue.",
			RECOVERY_REQUIRED: "Storage needs recovery. Check the service diagnostics.",
			OPERATION_CANCELLED: "The operation was cancelled.",
			TARGET_NOT_EMPTY: "The destination is already occupied.",
			INVALID_STORAGE_PATH: "Enter a safe absolute local path.",
			SOURCE_NOT_FOUND: "The source file is missing.",
			DATABASE_INVALID: "The asset database could not be opened."
		}
	},
	equipment: {
		devices: "My Equipment",
		trains: "Optical Trains",
		addDevice: "Add equipment",
		editDevice: "Edit equipment",
		addTrain: "Create optical train",
		editTrain: "Edit optical train",
		searchDevice: "Search name, manufacturer or model",
		searchTrain: "Search train or equipment",
		filterList: "Filter records",
		active: "All active",
		noMatches: "No matching records.",
		emptyDevices: "No equipment yet. Add a device to build an optical train.",
		emptyTrains: "Combine a camera and primary optics into a reusable imaging configuration.",
		resetSearch: "Clear search and filters",
		more: "Load more",
		chooseType: "Choose equipment type",
		basics: "Basic information",
		specs: "Specifications",
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
		usage: "Used in optical trains",
		noUsage: "No optical train references.",
		editAction: "Edit",
		deleteAction: "Delete permanently",
		deleteDevice: "Permanently delete equipment",
		deleteDeviceConfirm: "Delete this equipment record permanently? This action cannot be undone.",
		archiveDeviceConfirm: "Archive this equipment? Existing optical trains keep their links.",
		archiveTrainConfirm: "Archive this optical train? Its saved configuration will be preserved.",
		deviceReceipt: "Equipment saved.",
		archivedReceipt: "Archived.",
		restoredReceipt: "Restored.",
		deletedReceipt: "Equipment deleted.",
		unavailable: "Equipment and optics is unavailable.",
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
			archived: "Archived"
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
			EQUIPMENT_VALIDATION_FAILED: "Check the highlighted equipment or optical train fields.",
			EQUIPMENT_VERSION_CONFLICT: "This equipment changed in another window. Your edits are preserved.",
			DRAFT_VERSION_CONFLICT: "Saved configuration changed. Your edits are preserved.",
			REVISION_CONFLICT: "This optical train changed in another window.",
			IDEMPOTENCY_CONFLICT: "This publication request was already used with different values.",
			TRAIN_INCOMPLETE: "The optical train needs a camera and primary optics before publishing.",
			EQUIPMENT_TYPE_MISMATCH: "An optical component has an incompatible equipment type.",
			EQUIPMENT_REFERENCED: "This device is used by an optical train and cannot be permanently deleted. Archive it instead.",
			TRAIN_ARCHIVED: "Restore this train before saving changes.",
			EQUIPMENT_NOT_FOUND: "This equipment record was not found.",
			TRAIN_NOT_FOUND: "This optical train was not found.",
			REVISION_NOT_FOUND: "This revision was not found.",
			UNAUTHORIZED_EQUIPMENT_OPERATION: "This deployment or request is not authorized to use the equipment API.",
			STORAGE_BUSY: "The database is busy. Retry shortly.",
			DATABASE_INVALID: "Equipment data is unavailable because the database could not be read.",
			DEV_SCHEMA_RESET_REQUIRED: "The database uses an incompatible development schema.",
			EQUIPMENT_UNAVAILABLE: "The equipment service is unavailable."
		},
		trainReceipt: "Optical train saved.",
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
		deleteTrain: "Permanently delete optical train",
		deleteTrainConfirm: "Permanently delete this optical train and its configuration? This cannot be undone.",
		deleteReferenced: "This equipment is used by an optical train. Remove the reference first."
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
}, $k = {
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
			title: "存储",
			description: "数据目录、工作区、缓存与导入"
		},
		software: {
			title: "软件管理",
			description: "检测处理软件，并验证程序路径、版本及处理能力。"
		},
		equipment: {
			title: "设备与光学链路",
			description: "相机、望远镜、滤镜与光学链路。"
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
	storage: {
		dataRoot: "数据根目录",
		db: "资产数据库",
		importMode: "默认素材导入方式",
		reference: "仅登记到数据库（不复制文件）",
		copy: "复制到 Workspace 统一管理",
		referenceHelp: "原始文件留在当前位置，不会创建副本。",
		copyHelp: "受管副本会额外占用磁盘空间，原始文件保留。",
		workspaces: "工作区",
		workspaceActions: "{name} 的工作区操作",
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
		exitClearsCache: "ComfyUI 退出时自动清空 AstroPhoto Cache，包括失败处理的诊断文件。",
		movedBytes: "已迁移",
		discardTarget: "清理失败迁移残留",
		discardTargetHelp: "仅删除已核对且属于本次失败作业的文件。",
		cleanupCount: "待清理源文件",
		migrate: "迁移工作区",
		remove: "移除",
		removeHelp: "移除此工作区的登记，目录与文件将保留在磁盘上。",
		path: "ComfyUI 服务端绝对路径",
		name: "工作区名称",
		close: "关闭",
		cache: "缓存",
		used: "已用空间",
		limit: "缓存限额（GB）",
		save: "保存",
		clear: "清理缓存",
		confirmClear: "清除当前缓存中可重新生成的文件？",
		clearResult: "已移除 {count} 项（{size}）。跳过 {skipped} 项，失败 {failed} 项。",
		add: "新增工作区",
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
			MIGRATION_PLAN_STALE: "迁移计划已变更，请重新预检。",
			NO_MIGRATION_GROUPS: "没有可迁移到该目标的完整资产组。",
			SOURCE_CLEANUP_PENDING: "目标已生效。可重试清理剩余源文件。",
			WORKSPACE_FILES_MISSING: "缺少本次迁移所需的已登记文件。",
			INSUFFICIENT_DISK_SPACE: "目标卷可用空间不足。",
			WORKSPACE_OFFLINE: "工作区已离线。",
			WORKSPACE_READ_ONLY: "工作区为只读状态。",
			WORKSPACE_IDENTITY_MISMATCH: "工作区身份不匹配。",
			SOURCE_CHANGED: "操作过程中源文件发生了变化。",
			NO_RETRYABLE_FILES: "没有可重试的未变更、未登记文件。请重新选择并预检。",
			RECOVERY_REQUIRED: "存储需要恢复，请检查服务诊断信息。",
			OPERATION_CANCELLED: "操作已取消。",
			TARGET_NOT_EMPTY: "目标目录已被占用。",
			INVALID_STORAGE_PATH: "请输入安全的本地绝对路径。",
			SOURCE_NOT_FOUND: "源文件不存在。",
			DATABASE_INVALID: "无法打开资产数据库。"
		}
	},
	equipment: {
		devices: "我的设备",
		trains: "光学链路",
		addDevice: "添加设备",
		editDevice: "编辑设备",
		addTrain: "创建光路",
		editTrain: "编辑光路",
		searchDevice: "搜索设备名称、品牌或型号",
		searchTrain: "搜索光路名称或设备",
		filterList: "筛选记录",
		active: "全部在用",
		noMatches: "没有匹配的记录。",
		emptyDevices: "尚未添加设备。登记设备后即可组合光路。",
		emptyTrains: "可将相机和主光学设备组合为可复用的拍摄光路。",
		resetSearch: "清除搜索与筛选",
		more: "加载更多",
		chooseType: "选择设备类型",
		basics: "基础信息",
		specs: "专业规格",
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
		usage: "光路引用",
		noUsage: "暂无光路引用。",
		editAction: "编辑设备",
		deleteAction: "永久删除",
		deleteDevice: "永久删除设备",
		deleteDeviceConfirm: "确定永久删除此设备档案？该操作无法撤销。",
		archiveDeviceConfirm: "确定归档此设备？现有光路仍会保留设备引用。",
		archiveTrainConfirm: "确定归档此光路？已保存的配置会保留。",
		deviceReceipt: "设备已保存。",
		archivedReceipt: "已归档。",
		restoredReceipt: "已恢复使用。",
		deletedReceipt: "设备已删除。",
		unavailable: "设备管理与光学链路暂不可用。",
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
		opticalState: "光路状态",
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
			archived: "已归档"
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
			EQUIPMENT_VALIDATION_FAILED: "请检查标出的设备或光路字段。",
			EQUIPMENT_VERSION_CONFLICT: "此设备已在另一窗口修改，当前输入已保留。",
			DRAFT_VERSION_CONFLICT: "已保存的配置有变动。当前编辑仍保留。",
			REVISION_CONFLICT: "此光路已在另一窗口修改。",
			IDEMPOTENCY_CONFLICT: "同一个发布请求已用于其他内容。",
			TRAIN_INCOMPLETE: "发布前必须选择相机和主光学设备。",
			EQUIPMENT_TYPE_MISMATCH: "有设备类型不符合对应光路角色。",
			EQUIPMENT_REFERENCED: "此设备有光路引用，无法永久删除，可选择归档。",
			TRAIN_ARCHIVED: "请恢复使用此光路后再保存更改。",
			EQUIPMENT_NOT_FOUND: "找不到此设备记录。",
			TRAIN_NOT_FOUND: "找不到此光路。",
			REVISION_NOT_FOUND: "找不到此历史版本。",
			UNAUTHORIZED_EQUIPMENT_OPERATION: "此部署或请求未获设备 API 授权。",
			STORAGE_BUSY: "数据库繁忙，请稍后重试。",
			DATABASE_INVALID: "数据库无法读取，设备资料暂不可用。",
			DEV_SCHEMA_RESET_REQUIRED: "数据库使用不兼容的开发架构。",
			EQUIPMENT_UNAVAILABLE: "设备服务暂不可用。"
		},
		trainReceipt: "光路已保存。",
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
		deleteTrain: "永久删除光路",
		deleteTrainConfirm: "确定永久删除此光路及其配置？该操作无法撤销。",
		deleteReferenced: "此设备被光路引用，请先解除引用。"
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
}, eA = { assetLibrary: {
	projects: "Projects",
	allAssets: "All Assets",
	calibration: "Calibration Library",
	searchAssets: "Search assets",
	searchProjects: "Search projects, folders and collections",
	newProject: "New project",
	editProject: "Edit project",
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
	flatRequirements: "A calibration Flat requires a camera, optical train, and recorded Bias or Dark Flat source.",
	flatConfirmed: "I confirm this Flat was calibrated with the selected source.",
	canvasBound: "Source node added to the canvas.",
	linked: "Virtual location saved.",
	currentPolicy: "Import policy from Storage: {mode}",
	reference: "Reference",
	copy: "Workspace copy",
	workspace: "Default workspace: {name}",
	openStorage: "Open Storage settings",
	storageUnavailable: "This import policy is unavailable. Check Storage settings and workspace access.",
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
		optical_train_id: "Optical train",
		calibration_source_asset_id: "Calibration source asset",
		equipment_ids: "Equipment",
		target_type: "Target type",
		region: "Region",
		batch: "Capture batch",
		channel: "Channel",
		order: "Manual order",
		fwhm: "FWHM",
		snr: "SNR",
		mtime_ns: "File modification time",
		extension: "File extension",
		source_asset_id: "Source asset ID",
		source_collection_id: "Source collection ID",
		node: "Source node",
		workflow: "Source workflow",
		session_id: "Capture session",
		workspace_id: "Workspace",
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
	}
} }, tA = { assetLibrary: {
	projects: "项目",
	allAssets: "全部素材",
	calibration: "校准库",
	searchAssets: "搜索素材",
	searchProjects: "搜索项目、文件夹和集合",
	newProject: "新建项目",
	editProject: "编辑项目",
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
	flatRequirements: "校准 Flat 需要相机、光路和已登记的 Bias 或 Dark Flat 来源。",
	flatConfirmed: "我确认此 Flat 已使用所选来源完成校准。",
	canvasBound: "已将源节点添加到画布。",
	linked: "已保存虚拟位置。",
	currentPolicy: "继承存储设置的导入策略：{mode}",
	reference: "引用原址",
	copy: "复制到工作区",
	workspace: "默认工作区：{name}",
	openStorage: "查看存储设置",
	storageUnavailable: "当前导入策略不可用，请检查存储设置和工作区访问状态。",
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
		optical_train_id: "光路",
		calibration_source_asset_id: "校准来源素材",
		equipment_ids: "设备",
		target_type: "目标类型",
		region: "区域",
		batch: "采集批次",
		channel: "通道",
		order: "手动顺序",
		fwhm: "FWHM",
		snr: "信噪比",
		mtime_ns: "文件修改时间",
		extension: "文件扩展名",
		source_asset_id: "来源素材 ID",
		source_collection_id: "来源集合 ID",
		node: "来源节点",
		workflow: "来源工作流",
		session_id: "拍摄会话",
		workspace_id: "工作区",
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
		managed: "工作区副本",
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
	}
} };
// src/i18n/index.ts
function nA(e) {
	return typeof e == "string" && /^zh(?:-|_|$)/i.test(e) ? "zh" : "en";
}
function rA(e = []) {
	return Cf({
		legacy: !1,
		locale: "en",
		fallbackLocale: "en",
		messages: {
			en: Object.assign({}, Zk, Qk, eA, ...e.map((e) => e.messages.en)),
			zh: Object.assign({}, uy, $k, tA, ...e.map((e) => e.messages.zh))
		}
	});
}
// src/host/locale.ts
function iA(e, t, n) {
	let r = () => n(nA(e.extensionManager.setting.get("Comfy.Locale") || navigator.language)), i = () => {
		t.getClientRects().length && !document.hidden && r();
	};
	r();
	let a = window.setInterval(i, 500);
	return window.addEventListener("focus", i), () => {
		window.clearInterval(a), window.removeEventListener("focus", i);
	};
}
// src/host/sidebar.ts
var aA = "astrophoto.sidebar";
function oA(e, t) {
	if (e.extensionManager.getSidebarTabs().some((e) => e.id === "astrophoto.sidebar")) return;
	let n = {}, r, i, a, o, s = () => {
		o?.(), r?.unmount(), i?.remove(), a?.classList.remove("astrophoto-host-container"), o = r = i = a = void 0;
	};
	e.extensionManager.registerSidebarTab({
		id: aA,
		title: "AstroPhoto",
		tooltip: "AstroPhoto",
		icon: "astrophoto-sidebar-icon",
		type: "custom",
		render(c) {
			if (r && i?.parentElement === c) return;
			s(), a = c, c.classList.add("astrophoto-host-container"), i = document.createElement("div"), i.className = "astrophoto-ui", c.appendChild(i);
			let l = rA(t);
			o = iA(e, i, (e) => {
				l.global.locale.value = e;
			}), r = Ss(Xk, {
				equipmentSession: n,
				bundles: t
			}), r.use(l).mount(i);
		},
		destroy: s
	});
}
// src/features/drawing/ToolBar.vue?vue&type=script&setup=true&lang.ts
var sA = { class: "toolbar" }, cA = ["title", "aria-pressed"], lA = { class: "color-picker" }, uA = [
	"onClick",
	"title",
	"aria-label",
	"aria-pressed"
], dA = { class: "size-slider" }, fA = ["value"], pA = /*@__PURE__*/ R({
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
		let { t: n } = Z(), r = e, i = t, a = r.colors || [
			"#000000",
			"#ff0000",
			"#0000ff",
			"#69a869",
			"#ffff00",
			"#ff00ff",
			"#00ffff"
		], o = /* @__PURE__ */ N(r.initialColor || "#000000"), s = /* @__PURE__ */ N(r.initialBrushSize || 5), c = /* @__PURE__ */ N(r.initialTool || "pen");
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
		return (e, t) => (V(), H(B, null, [
			W("div", sA, [W("button", {
				type: "button",
				title: F(n)("vue-basic.pen-tooltip"),
				"aria-pressed": c.value === "pen",
				class: he({ active: c.value === "pen" }),
				onClick: t[0] ||= (e) => l("pen")
			}, M(F(n)("vue-basic.pen")), 11, cA), W("button", {
				type: "button",
				onClick: d
			}, M(F(n)("vue-basic.clear-canvas")), 1)]),
			W("div", lA, [(V(!0), H(B, null, ei(F(a), (e, t) => (V(), H("button", {
				key: t,
				class: he({
					"color-button": !0,
					active: o.value === e
				}),
				onClick: (t) => u(e),
				type: "button",
				title: e,
				"aria-label": e,
				"aria-pressed": o.value === e
			}, [W("span", {
				class: "color-swatch",
				style: ue({ backgroundColor: e }),
				"aria-hidden": "true"
			}, null, 4)], 10, uA))), 128))]),
			W("div", dA, [W("label", null, M(F(n)("vue-basic.brush-size")) + ": " + M(s.value) + "px", 1), W("input", {
				type: "range",
				min: "1",
				max: "50",
				value: s.value,
				onChange: t[1] ||= (e) => f(e)
			}, null, 40, fA)])
		], 64));
	}
}), mA = (e, t) => {
	let n = e.__vccOpts || e;
	for (let [e, r] of t) n[e] = r;
	return n;
}, hA = /*#__PURE__*/ mA(pA, [["__scopeId", "data-v-9605a2a8"]]), gA = { class: "drawing-board" }, _A = { class: "canvas-container" }, vA = ["width", "height"], yA = /*#__PURE__*/ mA(/* @__PURE__ */ R({
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
		let r = e, i = r.width || 800, a = r.height || 500, o = r.initialColor || "#000000", s = r.initialBrushSize || 5, c = n, l = /* @__PURE__ */ N(!1), u = /* @__PURE__ */ N(0), d = /* @__PURE__ */ N(0), f = /* @__PURE__ */ N(null), p = /* @__PURE__ */ N(!1), m = /* @__PURE__ */ N(s), h = /* @__PURE__ */ N(o), g = /* @__PURE__ */ N(null), _ = /* @__PURE__ */ N(null), v = 0;
		Ur(() => {
			v++;
		}), Br(() => {
			_.value && (f.value = _.value.getContext("2d"), y(), In(() => {
				_.value && c("mounted", _.value);
			}));
		});
		function y() {
			f.value && (f.value.fillStyle = "#ffffff", f.value.fillRect(0, 0, i, a), b(), A());
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
			l.value && (l.value = !1, A(!0), c("drawing-end"));
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
		function ee() {
			f.value && (f.value.fillStyle = "#ffffff", f.value.fillRect(0, 0, i, a), b(), A(!0), c("canvas-clear"));
		}
		function A(e = !1) {
			v++, _.value && (g.value = _.value.toDataURL("image/png"), g.value && c("state-save", g.value, e));
		}
		async function j() {
			if (!_.value) throw Error("Canvas is unable to get current data");
			return g.value ? g.value : _.value.toDataURL("image/png");
		}
		async function te(e) {
			if (!e.startsWith("data:image/png;base64,")) throw Error("Invalid saved PNG");
			let t = ++v, n = new Image();
			if (n.src = e, await n.decode(), t === v && f.value) {
				if (n.width !== i || n.height !== a) throw Error("Invalid saved canvas size");
				f.value.save(), f.value.globalCompositeOperation = "source-over", f.value.clearRect(0, 0, i, a), f.value.drawImage(n, 0, 0), f.value.restore(), A();
			}
		}
		return t({
			restoreCanvas: te,
			setTool: D,
			setColor: O,
			setBrushSize: k,
			clearCanvas: ee,
			getCurrentCanvasData: j
		}), (e, t) => (V(), H("div", gA, [W("div", _A, [W("canvas", {
			ref_key: "canvas",
			ref: _,
			width: F(i),
			height: F(a),
			onMousedown: x,
			onMousemove: S,
			onMouseup: C,
			onMouseleave: C,
			onTouchstart: T,
			onTouchmove: E,
			onTouchend: C
		}, null, 40, vA)])]));
	}
}), [["__scopeId", "data-v-1fba2252"]]), bA = { class: "drawing-app" }, xA = /*#__PURE__*/ mA(/* @__PURE__ */ R({
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
		], l = n, u = /* @__PURE__ */ N(null), d = /* @__PURE__ */ N(null);
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
		}), (e, t) => (V(), H("div", bA, [G(hA, {
			colors: F(c),
			initialColor: F(o),
			initialBrushSize: F(s),
			onToolChange: f,
			onColorChange: p,
			onBrushSizeChange: m,
			onCanvasClear: h
		}, null, 8, [
			"colors",
			"initialColor",
			"initialBrushSize"
		]), G(yA, {
			ref_key: "drawingBoard",
			ref: u,
			width: F(i),
			height: F(a),
			initialColor: F(o),
			initialBrushSize: F(s),
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
}), [["__scopeId", "data-v-d8cc17f7"]]), SA = {
	key: 0,
	role: "alert"
}, CA = /* @__PURE__ */ R({
	__name: "VueExampleComponent",
	props: { widget: {} },
	setup(t) {
		let { t: r } = Z(), i = /* @__PURE__ */ N(null), a = /* @__PURE__ */ N(null), o = t.widget, s = /* @__PURE__ */ N(!1), c = (e) => {
			if (!e || typeof e != "object") return { image: null };
			let t = e;
			return {
				image: typeof t.image == "string" ? t.image : null,
				...typeof t.canvasDataURL == "string" ? { canvasDataURL: t.canvasDataURL } : {}
			};
		}, l = /* @__PURE__ */ P(c(o.value));
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
		return Br(() => {
			u = !0, !l.value.canvasDataURL && a.value && f(a.value), L(() => l.value.canvasDataURL, (e) => {
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
		}), (e, t) => (V(), H("div", null, [
			W("h1", null, M(F(r)("vue-basic.title")), 1),
			W("div", null, [G(xA, {
				ref_key: "drawingAppRef",
				ref: i,
				width: 300,
				height: 300,
				onStateSave: f
			}, null, 512)]),
			s.value ? (V(), H("p", SA, M(F(r)("vue-basic.restore-error")), 1)) : q("", !0)
		]));
	}
}), wA = /* @__PURE__ */ new WeakMap(), TA = /* @__PURE__ */ new WeakSet();
function EA(e, t) {
	return JSON.stringify([
		e.graph?.id,
		e.id,
		t
	]);
}
function DA(e) {
	let { node: t, element: n, name: r } = e;
	wA.set(e, n), TA.add(n);
	let i = () => {
		n.dataset.astrophotoWidgetOwner = EA(t, r);
	};
	t.graph && i();
	let a = t.onAdded;
	t.onAdded = function(e) {
		a?.call(this, e), i();
	};
}
function OA(e) {
	requestAnimationFrame(() => {
		let t = e.canvas?.graph;
		if (!t) return;
		let n = /* @__PURE__ */ new Map();
		for (let e of document.querySelectorAll("[data-astrophoto-widget-owner]")) TA.has(e) && n.set(e.dataset.astrophotoWidgetOwner, e);
		for (let e of t.nodes) for (let t of e.widgets ?? []) {
			let r = wA.get(t);
			if (!r || r.isConnected) continue;
			let i = EA(e, t.name), a = n.get(i);
			if (a?.isConnected) {
				r.dataset.astrophotoWidgetOwner = i;
				for (let e of a.classList) r.classList.add(e);
				a.replaceWith(r);
			}
		}
	});
}
// src/host/drawing.ts
function kA(e) {
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
				DA(r);
				let i = rA(), a = iA(e, n, (e) => {
					i.global.locale.value = e;
				}), o = Ss(CA, { widget: r });
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
var AA = /^[a-f0-9]{8}-(?:[a-f0-9]{4}-){3}[a-f0-9]{12}$/;
async function jA(e) {
	let t = [], n = "";
	do {
		let r = await Ff("/astrophoto/v1/fits/assets?after=" + n, e);
		if (!$(r) || !Array.isArray(r.assets) || r.assets.some((e) => !$(e) || typeof e.id != "string" || !AA.test(e.id) || typeof e.name != "string") || r.next !== null && (typeof r.next != "string" || !AA.test(r.next) || r.next <= n)) throw new Q("schema");
		t.push(...r.assets), n = r.next ?? "";
	} while (n);
	return t;
}
// src/host/mountWidget.ts
function MA(e, t, n, r, i = []) {
	let a = rA(i), o = iA(e, t, (e) => {
		a.global.locale.value = e;
	}), s = Ss(n, r);
	return s.use(a).mount(t), () => {
		o(), s.unmount();
	};
}
// src/host/fitsSource.tsx
var NA = /* @__PURE__ */ R((e) => {
	let { t } = Z(), n = /* @__PURE__ */ P([]), r = /* @__PURE__ */ N("loading"), i = /* @__PURE__ */ N(0);
	L(i, (e, t, i) => {
		let a = new AbortController();
		i(() => a.abort()), r.value = "loading", jA(a.signal).then((e) => {
			a.signal.aborted || (n.value = e, r.value = "ready");
		}, (e) => {
			a.signal.aborted || (r.value = e instanceof Q ? e.code : "network");
		});
	}, { immediate: !0 });
	let a = (t) => e.select(t.currentTarget.value);
	return () => G(B, null, [
		G("select", {
			"aria-label": t("fits.fitsAsset"),
			value: e.source,
			onChange: a
		}, [
			G("option", { value: "" }, [t(r.value === "loading" ? "states.loading" : "fits.fitsAsset")]),
			e.source && !n.value.some((t) => t.id === e.source) && G("option", { value: e.source }, [/^[a-f0-9-]{36}$/.test(e.source) ? `${t("fits.unavailableAsset")} · ${e.source}` : e.source]),
			n.value.map((e) => G("option", {
				key: e.id,
				value: e.id
			}, [
				e.name,
				K(" · "),
				e.id.slice(0, 8)
			]))
		]),
		G("label", null, [t("fits.serverFitsPath"), G("input", {
			type: "text",
			value: e.source,
			placeholder: t("fits.serverFitsPathHint"),
			onInput: a
		}, null)]),
		r.value !== "loading" && r.value !== "ready" && G("small", { role: "alert" }, [t("errors." + r.value, r.value)]),
		G("button", {
			type: "button",
			onClick: () => {
				i.value += 1;
			}
		}, [t("fits.refreshAssets")])
	]);
}, { props: ["source", "select"] });
function PA(e) {
	e.registerExtension({
		name: "AstroPhoto.ScientificNodes",
		getCustomWidgets() {
			return { ASTRO_FITS_ASSET(t, n) {
				let r = /* @__PURE__ */ N(""), i = document.createElement("div");
				i.className = "astrophoto-ui ap-fits-source-widget";
				let a = t.addDOMWidget(n, "astrophoto-fits-asset", i, {
					getMinHeight: () => 145,
					getHeight: () => 145,
					getValue: () => r.value,
					setValue: (e) => {
						r.value = e;
					}
				});
				DA(a);
				let o = MA(e, i, /* @__PURE__ */ R(() => () => G(NA, {
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
function FA(e) {
	if (Array.from(document.querySelectorAll("link[rel=\"stylesheet\"]")).some((t) => t.href === e.href)) return;
	let t = document.createElement("link");
	t.rel = "stylesheet", t.href = e.href, document.head.appendChild(t);
}
// src/main.ts
function IA(e, t) {
	FA(new URL(
		/* @vite-ignore */
		"./assets/main.css",
		import.meta.url
	)), kA(e), PA(e), e.registerExtension({
		name: "AstroPhoto.Sidebar",
		setup() {
			oA(e, t), ZO().catch(() => {});
		},
		beforeConfigureGraph() {
			Yv();
		},
		afterConfigureGraph() {
			OA(e);
		}
	});
	for (let n of t) n.registerNodes(e, t);
}
// ../extension/siril/frontend/SirilCommandDetails.tsx
function LA(e, t) {
	return t === "zh" ? e.title_zh ?? e.title : e.title;
}
function RA(e, t) {
	return t === "zh" ? e.description_zh ?? e.description : e.description;
}
var zA = /* @__PURE__ */ R((e) => {
	let { locale: t, t: n } = Z();
	return () => {
		let { command: r, disclose: i } = e, a = G(B, null, [
			G("pre", null, [r.usage]),
			r.requires.length > 0 && G("p", { class: "ap-siril-requirements" }, [
				n("siril.catalogue.requirements"),
				" ",
				r.requires.map((e) => n("siril.requirements." + e.replace(/[^A-Za-z0-9]+/g, "_"), e)).join(" · ")
			]),
			r.build_feature && G("p", null, [n("siril.catalogue.build", { feature: r.build_feature })])
		]);
		return G("div", { class: "ap-siril-command-details" }, [G("p", { class: "ap-siril-description" }, [RA(r, t.value)]), i ? G("details", { class: "ap-siril-command-usage" }, [G("summary", null, [n("siril.catalogue.usage")]), a]) : a]);
	};
}, { props: ["command", "disclose"] }), BA = "/astrophoto/v1/software/siril", VA = /^[a-f0-9]{8}-(?:[a-f0-9]{4}-){3}[a-f0-9]{12}$/, HA = "/astrophoto/v1/previews", UA;
function WA() {
	return UA ??= Ff(BA + "/commands").then((e) => {
		if (!$(e) || e.version !== "1.4.5" || !Array.isArray(e.commands) || e.commands.some((e) => !$(e) || typeof e.id != "string" || typeof e.title != "string" || typeof e.usage != "string" || typeof e.description != "string" || typeof e.preview != "boolean" || typeof e.scriptable != "boolean" || [
			"category",
			"category_zh",
			"title_zh",
			"description_zh"
		].some((t) => e[t] !== void 0 && typeof e[t] != "string") || e.search_aliases !== void 0 && (!Array.isArray(e.search_aliases) || e.search_aliases.some((e) => typeof e != "string")) || e.node_id !== null && typeof e.node_id != "string" || e.build_feature !== null && typeof e.build_feature != "string" || !Array.isArray(e.requires) || e.requires.some((e) => typeof e != "string") || !Array.isArray(e.parameters) || e.parameters.some((e) => !$(e) || typeof e.name != "string" || typeof e.label != "string" || typeof e.help != "string" || typeof e.rgb_only != "boolean" || !["number", "boolean"].includes(typeof e.default) || e.min !== null && typeof e.min != "number" || e.max !== null && typeof e.max != "number"))) throw new Q("schema");
		return e.commands;
	}).catch((e) => {
		throw UA = void 0, e;
	}), UA;
}
var GA = (e, t) => Ff(HA + "/jobs/" + e + "/validate", t);
async function KA(e, t) {
	if (!VA.test(e)) throw new Q("schema");
	return If("/astrophoto/v1/library/assets", "POST", { output_id: e }, t);
}
function qA(e) {
	if (!$(e) || typeof e.os != "string" || typeof e.state != "string" || typeof e.enabled != "boolean" || e.target_version !== "1.4.5" || e.state === "ready" && (typeof e.path != "string" || e.version !== "1.4.5" || typeof e.verified_at != "string")) throw new Q("schema");
	return e;
}
var JA = async (e) => qA(await Ff(BA, e)), YA = async (e, t) => qA(await If(BA, "PUT", { path: e }, t, 3e4)), XA = async (e) => qA(await If(BA, "DELETE", void 0, e)), ZA = async (e, t) => qA(await If(BA + "/enabled", "PUT", { enabled: e }, t));
async function QA(e) {
	let t = await If(BA + "/discover", "POST", void 0, e, 195e3);
	if (!$(t) || !Array.isArray(t.candidates) || t.candidates.some((e) => !$(e) || typeof e.path != "string" || typeof e.origin != "string" || typeof e.state != "string")) throw new Q("schema");
	return t.candidates;
}
function $A(e) {
	return new Promise((t, n) => {
		let r = () => {
			clearTimeout(i), n(new DOMException("Aborted", "AbortError"));
		}, i = setTimeout(() => {
			e.removeEventListener("abort", r), t();
		}, 350);
		e.aborted ? r() : e.addEventListener("abort", r, { once: !0 });
	});
}
async function ej(e, n, r) {
	let i = await t.api.fetchApi(e + "/" + n, {
		signal: r,
		headers: { "X-AstroPhoto-Local": "1" }
	});
	if (!i.ok || i.headers.get("content-type")?.split(";")[0] !== "image/png") throw new Q("PREVIEW_STALE");
	let a = await i.blob();
	return URL.createObjectURL(a);
}
async function tj(e, t, n, r, i, a) {
	let o = await If(HA + "/siril/" + encodeURIComponent(e), "POST", {
		...VA.test(t) ? { asset_id: t } : { image_path: t },
		owner: n,
		parameters: r,
		...a ? { formal_id: a } : {}
	});
	if (!$(o) || typeof o.job_id != "string" || !VA.test(o.job_id)) throw new Q("schema");
	let s = HA + "/jobs/" + o.job_id, c = () => {
		If(s + "/cancel", "POST").catch(() => {});
	}, l, u;
	if (i.aborted) throw c(), new DOMException("Aborted", "AbortError");
	i.addEventListener("abort", c, { once: !0 });
	try {
		for (; !i.aborted;) {
			let e = await Ff(s, i);
			if (!$(e)) throw new Q("schema");
			if (e.state === "queued" || e.state === "running") await $A(i);
			else {
				if (![
					"ready",
					"failed",
					"cancelled"
				].includes(String(e.state))) throw new Q("schema");
				if (e.before === !0 && (l = await ej(s, "before", i)), e.after === !0 && (u = await ej(s, "after", i)), i.aborted) break;
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
var nj = /* @__PURE__ */ R((e) => {
	let t;
	return () => {
		let { axis: n, value: r, min: i, max: a, label: o, controls: s, onChange: c } = e, l = n === "x", u = (e) => c(Math.max(i, Math.min(a, e)));
		return G("div", J({
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
] }), rj = [
	"side",
	"wipe",
	"single"
], ij = {
	side: "M3 5h18v14H3z M12 5v14",
	wipe: "M3 5h18v14H3z M12 2v20 M8 12h8",
	single: "M3 5h18v14H3z M7 9h10v6H7z"
}, aj = (e, t, n) => Math.max(t, Math.min(n, e)), oj = /* @__PURE__ */ R((e) => {
	let { t } = Z(), n = /* @__PURE__ */ N(null), r = /* @__PURE__ */ N(null), i = wr(), a = /* @__PURE__ */ N(73), o = (e) => {
		a.value = e;
	}, s = /* @__PURE__ */ N(50), c = (e) => {
		s.value = e;
	}, l = /* @__PURE__ */ N("side"), u = (e) => {
		l.value = e;
	}, d = /* @__PURE__ */ N("after"), f = (e) => {
		d.value = e;
	}, p = /* @__PURE__ */ N(50), m = (e) => {
		p.value = e;
	}, h = /* @__PURE__ */ N(1), g = (e) => {
		h.value = e;
	}, _ = /* @__PURE__ */ N(!1), v = (e) => {
		_.value = e;
	}, y = /* @__PURE__ */ N({
		x: 0,
		y: 0
	}), b = (e) => {
		y.value = e;
	}, x, S;
	return Br(() => {
		S = document.activeElement;
		let e = n.value;
		e && !e.open && (typeof e.show == "function" ? e.show() : e.setAttribute("open", "")), r.value?.focus();
	}), Wr(() => {
		S?.isConnected && S.focus();
	}), () => {
		let { preview: S, title: C, description: w, details: T, parameters: E, status: D, onRefresh: O, onReset: k, onClose: ee } = e, A = !!(S?.before && S.after && S.aligned), j = l.value === "wipe" && !A ? "side" : l.value;
		function te(e) {
			e.button === 0 && e.isPrimary && (e.preventDefault(), e.currentTarget.setPointerCapture(e.pointerId), x = {
				id: e.pointerId,
				x: e.clientX,
				y: e.clientY,
				ox: y.value.x,
				oy: y.value.y
			});
		}
		function ne(e) {
			let t = x;
			t?.id === e.pointerId && b({
				x: t.ox + e.clientX - t.x,
				y: t.oy + e.clientY - t.y
			});
		}
		function re(e) {
			let t = e.currentTarget.parentElement?.getBoundingClientRect();
			t?.width && m(aj((e.clientX - t.left) * 100 / t.width, 0, 100));
		}
		let ie = () => {
			v(!1), b({
				x: 0,
				y: 0
			}), g(1);
		}, ae = () => {
			ie(), v(!0);
		}, oe = (e) => g(aj(h.value * e, .1, 16));
		function se(e, n) {
			let r = S?.[e];
			return G("div", {
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
			}, [r ? G("img", {
				src: r,
				alt: t("nodePreview." + e),
				draggable: !1
			}, null) : G("span", null, [t("nodePreview.noImage")])]);
		}
		function ce(e) {
			return G("div", J({
				class: "ap-inspector-pane",
				key: e,
				onPointerdown: te,
				onPointermove: ne
			}, { onLostpointercapture: () => {
				x = void 0;
			} }), [se(e), G("span", { class: "ap-inspector-label" }, [t("nodePreview." + e)])]);
		}
		return G(_r, { to: "body" }, { default: () => [G("dialog", J({
			ref: n,
			class: "astrophoto-ui ap-inspector",
			"aria-label": t("nodePreview.compare")
		}, { onCancel: ee }, { onKeydown: (e) => {
			e.stopPropagation(), e.key === "Escape" && (e.preventDefault(), ee());
		} }), [G("header", null, [G("div", { class: "ap-inspector-title" }, [G("strong", null, [C]), w && G(sj, { text: w }, null)]), G("button", {
			ref: r,
			type: "button",
			title: t("nodePreview.close"),
			"aria-label": t("nodePreview.close"),
			onClick: ee
		}, [G("svg", {
			width: "16",
			height: "16",
			viewBox: "0 0 24 24",
			fill: "none",
			stroke: "currentColor",
			"aria-hidden": "true"
		}, [G("path", { d: "m6 6 12 12M18 6 6 18" }, null)])])]), G("div", {
			class: "ap-inspector-layout",
			style: { "--ap-view-share": a.value + "%" }
		}, [
			G("section", {
				id: i + "-view",
				class: "ap-inspector-view"
			}, [
				G("div", { class: "ap-inspector-toolbar" }, [G("div", { class: "ap-inspector-modes" }, [rj.map((e) => G("button", {
					key: e,
					type: "button",
					title: t("nodePreview." + e),
					"aria-label": t("nodePreview." + e),
					"aria-pressed": j === e,
					disabled: e === "wipe" && !A,
					onClick: () => u(e)
				}, [G("svg", {
					width: "16",
					height: "16",
					viewBox: "0 0 24 24",
					fill: "none",
					stroke: "currentColor",
					"aria-hidden": "true"
				}, [G("path", { d: ij[e] }, null)])]))]), G("div", { class: "ap-inspector-zoom" }, [
					O && G("button", {
						type: "button",
						"aria-label": t("actions.refresh"),
						title: t("actions.refresh"),
						onClick: O
					}, [G("span", { "aria-hidden": "true" }, [K("↻")])]),
					j === "single" && G("button", {
						type: "button",
						onClick: () => f(d.value === "before" ? "after" : "before")
					}, [t(d.value === "before" ? "nodePreview.after" : "nodePreview.before")]),
					G("button", {
						type: "button",
						title: t("nodePreview.zoomOut"),
						"aria-label": t("nodePreview.zoomOut"),
						onClick: () => oe(.8)
					}, [K("−")]),
					G("button", {
						type: "button",
						onClick: ae,
						"aria-pressed": _.value
					}, [_.value ? Math.round(h.value * 100) + "%" : "100%"]),
					G("button", {
						type: "button",
						title: t("nodePreview.zoomIn"),
						"aria-label": t("nodePreview.zoomIn"),
						onClick: () => oe(1.25)
					}, [K("+")]),
					G("button", {
						type: "button",
						onClick: ie
					}, [t("nodePreview.fit")])
				])]),
				G("div", {
					class: "ap-inspector-images",
					"data-mode": j,
					onDragstart: (e) => e.preventDefault(),
					onWheel: (e) => {
						e.stopPropagation(), oe(e.deltaY < 0 ? 1.12 : 1 / 1.12);
					}
				}, [
					j === "side" && G(B, null, [ce("before"), ce("after")]),
					j === "single" && ce(d.value),
					j === "wipe" && G("div", J({
						class: "ap-inspector-pane",
						onPointerdown: te,
						onPointermove: ne
					}, { onLostpointercapture: () => {
						x = void 0;
					} }), [
						se("after"),
						se("before", `inset(0 ${100 - p.value}% 0 0)`),
						G("span", { class: "ap-inspector-label" }, [t("nodePreview.before")]),
						G("span", { class: "ap-inspector-label ap-inspector-end" }, [t("nodePreview.after")]),
						G("div", {
							class: "ap-inspector-divider",
							style: { left: p.value + "%" },
							tabindex: 0,
							role: "slider",
							"aria-label": t("nodePreview.wipe"),
							"aria-valuemin": 0,
							"aria-valuemax": 100,
							"aria-valuenow": Math.round(p.value),
							onPointerdown: (e) => {
								e.stopPropagation(), e.button === 0 && e.isPrimary && (e.preventDefault(), e.currentTarget.focus(), e.currentTarget.setPointerCapture(e.pointerId), re(e));
							},
							onPointermove: (e) => {
								e.stopPropagation(), e.currentTarget.hasPointerCapture(e.pointerId) && re(e);
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
								e.key in t && (e.preventDefault(), e.stopPropagation(), m(aj(t[e.key], 0, 100)));
							}
						}, null)
					])
				]),
				!A && S?.before && S.after && G("small", null, [t("nodePreview.unaligned")])
			]),
			G(nj, {
				axis: "x",
				label: t("nodePreview.adjustWidth"),
				controls: i + "-view",
				value: a.value,
				min: 40,
				max: 80,
				onChange: o
			}, null),
			G("aside", {
				class: "ap-inspector-info",
				style: { "--ap-analysis-share": s.value + "%" }
			}, [
				G("section", { id: i + "-analysis" }, [G("h3", null, [t("nodePreview.analysis")]), G("p", null, [t("nodePreview.analysisEmpty")])]),
				G(nj, {
					axis: "y",
					label: t("nodePreview.adjustHeight"),
					controls: i + "-analysis",
					value: s.value,
					min: 15,
					max: 75,
					onChange: c
				}, null),
				G("section", null, [
					G("div", { class: "ap-inspector-parameters-header" }, [G("h3", null, [t(E ? "nodePreview.parameters" : "nodePreview.readonly")]), k && G("button", {
						type: "button",
						title: t("nodePreview.reset"),
						"aria-label": t("nodePreview.reset"),
						onClick: k
					}, [G("span", { "aria-hidden": "true" }, [K("↶")])])]),
					E,
					(!!T?.length || D) && G("dl", null, [T?.map(({ label: e, value: t }) => G("div", {
						class: "ap-inspector-value",
						key: e
					}, [G("dt", null, [e]), G("dd", null, [t])])), D && G(B, null, [G("dt", null, [t("nodePreview.status")]), G("dd", { role: "status" }, [D])])])
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
function sj({ text: e }) {
	return G("span", {
		class: "ap-inspector-help",
		role: "img",
		tabindex: 0,
		"aria-label": e,
		title: e
	}, [G("span", { "aria-hidden": "true" }, [K("ⓘ")])]);
}
// src/features/nodes/preview/NodePreview.tsx
var cj = /* @__PURE__ */ R((e) => {
	let { t } = Z(), n = wr();
	return () => {
		let { expanded: r, images: i, status: a, badge: o, imageClassName: s = "", onToggle: c, onCompare: l, onRefresh: u, onReset: d } = e, f = t("actions.refresh"), p = t("nodePreview.reset");
		return G(B, null, [G("div", { class: "ap-node-preview-toolbar" }, [
			G("button", {
				type: "button",
				"aria-controls": n,
				"aria-expanded": r,
				onClick: c
			}, [G("svg", {
				viewBox: "0 0 24 24",
				"aria-hidden": "true"
			}, [G("path", { d: "m9 6 6 6-6 6" }, null)]), t("nodePreview.preview")]),
			G("button", {
				class: "ap-node-compare",
				type: "button",
				"aria-haspopup": "dialog",
				"aria-label": t("nodePreview.openImage"),
				title: t("nodePreview.openImage"),
				onClick: l
			}, [G("svg", {
				viewBox: "0 0 24 24",
				"aria-hidden": "true"
			}, [G("path", { d: "M3 4h18v16H3z M3 16l5-5 4 4 3-3 6 5" }, null)])]),
			u && G("button", {
				type: "button",
				title: f,
				"aria-label": f,
				onClick: u
			}, [G("svg", {
				viewBox: "0 0 24 24",
				"aria-hidden": "true"
			}, [G("path", { d: "M20 7v5h-5M4 17v-5h5M5.5 8a7 7 0 0 1 11-2l3.5 6m-16 0 3.5 6a7 7 0 0 0 11-2" }, null)])]),
			d && G("button", {
				type: "button",
				title: p,
				"aria-label": p,
				onClick: d
			}, [G("svg", {
				viewBox: "0 0 24 24",
				"aria-hidden": "true"
			}, [G("path", { d: "M3 11h5M3 11V6m0 5 4-4a7 7 0 1 1-1 10" }, null)])])
		]), G("div", {
			id: n,
			class: `ap-canvas-preview ${s}`,
			hidden: !r
		}, [r && (i?.after ? G(B, null, [G("img", {
			src: i.after,
			width: i.width,
			height: i.height,
			alt: t("nodePreview.after"),
			draggable: !1
		}, null), o && G("small", { class: "ap-node-preview-badge" }, [o])]) : G("span", { role: "status" }, [a]))])]);
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
] }), lj = "AstroPhotoFITSSource", uj = "AstroPhotoAssetSource", dj = "AstroPhotoImagePath", fj = /* @__PURE__ */ new WeakMap(), pj = /* @__PURE__ */ new WeakMap(), mj = /* @__PURE__ */ new WeakMap(), hj = /* @__PURE__ */ new WeakMap();
function gj(e) {
	return {
		widgetKey: JSON.stringify(e.widgets?.filter((e) => !e.name.startsWith("astrophoto_")).map((e) => [e.name, e.value])),
		inputs: (e.inputs ?? []).map((t, n) => e.getInputNode(n))
	};
}
function _j() {
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
function vj(e, t) {
	return Object.fromEntries(t.parameters.map((t) => {
		let n = e.widgets?.find((e) => e.name === t.name)?.value, r = typeof t.default == "boolean" ? typeof n == "boolean" ? n : t.default : typeof n == "number" ? n : t.default;
		return [t.name, r];
	}));
}
function yj(e, t, n = !1) {
	return JSON.stringify(Object.fromEntries(e.parameters.map((e) => [e.name, n && e.rgb_only ? !1 : t[e.name]])));
}
function bj(e, t = /* @__PURE__ */ new Set()) {
	if (t.has(e)) return "";
	t.add(e);
	let n = e.getInputNode(0);
	if (n && (n.comfyClass === lj || n.comfyClass === uj)) return String(n.widgets?.find((e) => e.name === "asset_id")?.value || "");
	if (n?.comfyClass === dj) return String(n.widgets?.find((e) => e.name === "image_path")?.value || "");
	let r = n && hj.get(n);
	if (r) {
		let e = gj(n);
		if (e.widgetKey === r.widgetKey && e.inputs.length === r.inputs.length && e.inputs.every((e, t) => e === r.inputs[t])) return r.path;
	}
	let i = n && mj.get(n);
	if (n && i?.preview) {
		let e = fj.get(n);
		if (e?.verifiedSource && e.key === yj(i, vj(n, i), e.mono) && e.verifiedSource === bj(n, t)) return e.asset;
	}
	return "";
}
function xj(e) {
	e?.before && URL.revokeObjectURL(e.before), e?.after && URL.revokeObjectURL(e.after);
}
var Sj = /* @__PURE__ */ R((e) => {
	let { locale: t, t: n } = Z(), { node: r, command: i, execution: a, canvas: o } = e, s = Object.fromEntries(i.parameters.map((e) => [e.name, e.default])), c = i.parameters.length ? () => T(s) : void 0, l = _j(), u = /* @__PURE__ */ N(!0), d = /* @__PURE__ */ N(!1), f = /* @__PURE__ */ N(0), p = /* @__PURE__ */ P({
		asset: "",
		key: yj(i, vj(r, i)),
		formal: "",
		connected: !1
	}), m = /* @__PURE__ */ P(), h = /* @__PURE__ */ P(), g = /* @__PURE__ */ N(""), _ = /* @__PURE__ */ N(!1), v = /* @__PURE__ */ P(), y = /* @__PURE__ */ P(/* @__PURE__ */ new Set()), b = sT(), x = () => {
		f.value += 1;
	};
	L(() => e.node, (e, t, n) => {
		let o = () => {
			if (!r.graph) return;
			let e = bj(r);
			v.value = pj.get(r);
			let t = yj(i, vj(r, i)), n = fj.get(r), a = h.value?.asset === e && h.value?.channels === 1 ? yj(i, vj(r, i), !0) : t, o = e && (n?.key === t || n?.key === a) && (n.receiptSource === e || n.observedSource === e) ? n.asset : "", s = r.isInputConnected(0), c = p.value;
			(c.asset !== e || c.key !== t || c.formal !== o || c.connected !== s) && (p.value = {
				asset: e,
				key: t,
				formal: o,
				connected: s
			});
		}, s = window.setInterval(o, 200);
		KO.addEventListener("change", x), a.addEventListener("changed", o), o(), n(() => {
			clearInterval(s), KO.removeEventListener("change", x), a.removeEventListener("changed", o);
		});
	}, { immediate: !0 });
	let S = Y(() => {
		let { asset: e, key: t, formal: n } = p.value;
		return JSON.stringify([
			e,
			t,
			n,
			f.value
		]);
	}), C = Y(() => g.value === S.value ? m.value : void 0);
	L(S, (e, t, n) => {
		let { asset: o, key: s, formal: c } = p.value;
		if (m.value = void 0, _.value = !!o, !o) return;
		let u = new AbortController(), d, f = window.setTimeout(() => {
			tj(i.id, o, l, JSON.parse(s), u.signal, c || void 0).then((t) => {
				if (u.signal.aborted) {
					xj(t);
					return;
				}
				let n = fj.get(r);
				if (c && n?.asset === c) {
					if (t.formal) n.verifiedSource = o, n.mono = t.channels === 1, n.key = yj(i, JSON.parse(s), n.mono);
					else if (t.error === "PREVIEW_STALE") {
						xj(t), fj.delete(r), a.dispatchEvent(new Event("changed"));
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
			clearTimeout(f), u.abort(), xj(d);
		});
	}, { immediate: !0 }), L([C, () => u.value || d.value], ([e, t], n, r) => {
		if (!e?.jobId || !e.before || !t) return;
		let i = e.jobId, a = new AbortController(), o = window.setInterval(() => {
			document.hidden || GA(i, a.signal).catch((t) => {
				a.signal.aborted || m.value?.jobId !== i || (xj(e), m.value = {
					state: "failed",
					error: t instanceof Q ? t.code : "PREVIEW_STALE"
				});
			});
		}, 8e3);
		r(() => {
			clearInterval(o), a.abort();
		});
	});
	let w = Y(() => h.value?.asset === p.value.asset && h.value?.channels === 1);
	L(w, (e, t, n) => {
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
			await KA(e, t), t.aborted || (y.value = /* @__PURE__ */ new Set([...y.value, e]));
		});
	}
	return () => {
		let { asset: e, key: a, connected: o } = p.value, s = v.value ?? [], l = C.value, f = e ? _.value || !l ? n("siril.rendering") : l.error ? n("siril.states." + l.error, l.error) : n(l.formal ? "siril.formal" : "siril.candidate") : n(o ? "siril.upstream" : "siril.noInput"), m = JSON.parse(a);
		return G(B, null, [
			G(zA, {
				command: i,
				disclose: !0
			}, null),
			G(cj, {
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
			d.value && G(oj, {
				preview: l,
				title: r.title || i.title,
				description: RA(i, t.value),
				onRefresh: e ? x : void 0,
				onReset: c,
				parameters: G("div", { class: "ap-inspector-fields" }, [
					i.parameters.map((e) => {
						let t = "siril.commands." + i.id + "." + e.name, r = n(t, e.label), a = n(t + "Help", e.help), o = e.rgb_only && w.value;
						return typeof e.default == "number" ? G(Cj, {
							key: e.name,
							label: r,
							help: a,
							value: Number(m[e.name]),
							min: e.min ?? void 0,
							max: e.max ?? void 0,
							onChange: (t) => T({ [e.name]: t })
						}, null) : G("label", {
							key: e.name,
							class: "ap-inspector-toggle"
						}, [G("span", null, [
							r,
							K(" "),
							G(sj, { text: a }, null)
						]), G("input", {
							type: "checkbox",
							role: "switch",
							checked: !!m[e.name] && !o,
							disabled: o,
							title: o ? n("siril.mono") : a,
							onChange: (t) => T({ [e.name]: t.currentTarget.checked })
						}, null)]);
					}),
					s.map((e) => G("button", {
						type: "button",
						key: e,
						class: "ap-storage-button",
						title: e,
						disabled: b.pending.value || y.value.has(e),
						onClick: () => E(e)
					}, [y.value.has(e) ? n("siril.addedToAssets") : n("siril.addToAssets"), s.length > 1 && " · " + e.slice(0, 8)])),
					b.error.value && G("small", { role: "alert" }, [n("siril.states." + b.error.value, b.error.value)])
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
] }), Cj = /* @__PURE__ */ R((e) => {
	let t = /* @__PURE__ */ N();
	return () => G("label", null, [G("span", null, [
		e.label,
		K(" "),
		G(sj, { text: e.help }, null)
	]), G("input", {
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
function wj(e, t, n, r) {
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
	s.serialize = !1, DA(s);
	let c = new ResizeObserver(() => {
		if (!n.graph) return;
		let e = a.offsetHeight;
		e && e !== o && (o = e, n.setSize([n.size[0], n.computeSize()[1]]), n.setDirtyCanvas(!0, !0));
	}), l = new EventTarget(), u = n.onExecuted, d = function(e) {
		u?.call(this, e);
		let t = e;
		t.astrophoto_output?.length && pj.set(n, t.astrophoto_output);
		let i = t.astrophoto_output ?? t.astrophoto_asset;
		fj.delete(n), i?.length === 1 && i[0] && t.astrophoto_source?.[0] && t.astrophoto_parameters?.[0] && fj.set(n, {
			asset: i[0],
			receiptSource: t.astrophoto_source[0],
			observedSource: bj(n),
			key: yj(r, t.astrophoto_parameters[0])
		}), l.dispatchEvent(new Event("changed"));
	};
	n.onExecuted = d;
	let f = MA(e, a, Sj, {
		node: n,
		command: r,
		execution: l,
		canvas: () => e.canvas
	}, t);
	c.observe(a, { box: "border-box" });
	let p = s.onRemove;
	s.onRemove = () => {
		c.disconnect(), n.onExecuted === d && (n.onExecuted = u), f(), fj.delete(n), pj.delete(n), p?.call(s);
	};
	let m = JO() + 8 + 2 * s.margin;
	n.setSize([Math.max(n.size[0], m), Math.max(n.size[1], 395)]);
}
function Tj(e, t, n, r) {
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
	s.serialize = !1, DA(s);
	let c = MA(e, a, zA, {
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
function Ej(e, t) {
	let n = t.onExecuted, r, i = document.createElement("textarea");
	i.readOnly = !0, i.className = "astrophoto-ui ap-siril-log", t.onExecuted = function(a) {
		n?.call(this, a);
		let o = a, s = o.astrophoto_siril_path?.[0];
		if (s ? hj.set(t, {
			path: s,
			...gj(t)
		}) : hj.delete(t), o.astrophoto_siril_log?.[0]) {
			if (i.value = o.astrophoto_siril_log[0], !r) {
				r = t.addDOMWidget("astrophoto_siril_log", "astrophoto-siril-log", i, {
					serialize: !1,
					getMinHeight: () => 120,
					getMaxHeight: () => 120
				}), r.serialize = !1, DA(r);
				let n = iA(e, i, (e) => {
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
function Dj(e, t) {
	e.registerExtension({
		name: "AstroPhoto.Siril",
		async nodeCreated(n) {
			if (!n.comfyClass?.startsWith("AstroPhotoSiril")) return;
			let r = n.onRemoved, i = !1, a = function() {
				i = !0, r?.call(this);
			};
			n.onRemoved = a;
			let o = await WA().then((e) => e.find((e) => e.node_id === n.comfyClass), () => void 0);
			n.onRemoved === a && (n.onRemoved = r), o && !i && (mj.set(n, o), [
				o.id,
				o.title,
				o.title_zh
			].map((e) => "Siril · " + e).includes(n.title) && (n.title = LA(o, nA(e.extensionManager.setting.get("Comfy.Locale")))), o.preview ? wj(e, t, n, o) : (Tj(e, t, n, o), Ej(e, n)));
		}
	});
}
// ../extension/siril/frontend/SirilCommands.tsx
var Oj = /* @__PURE__ */ R(() => {
	let { locale: e, t } = Z(), { resource: n, refresh: r } = Ry(WA, !0), i = /* @__PURE__ */ N(""), a = Y(() => {
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
					label: a?.[r] ?? py(t, e.value),
					commands: [],
					children: /* @__PURE__ */ new Map()
				}, o.set(t, s)), r === n.length - 1 && s.commands.push(i), o = s.children;
			});
		}
		return t;
	});
	function o(n, r = !1) {
		let i = r ? "h5" : "h4";
		return [...n].map(([n, r]) => G("section", {
			key: n,
			class: "ap-siril-command-group"
		}, [
			G(i, null, { default: () => [r.label] }),
			r.commands.length > 0 && G("ul", null, [r.commands.map((n) => G("li", { key: n.id }, [G("details", null, [G("summary", null, [
				LA(n, e.value),
				" ",
				G("code", null, [n.id]),
				G("small", null, [t(n.scriptable ? "siril.catalogue.node" : "siril.catalogue.gui")])
			]), G(zA, { command: n }, null)])]))]),
			o(r.children, !0)
		]));
	}
	return () => G("section", { class: "ap-software-section ap-siril-commands" }, [
		G(zv, {
			label: t("siril.catalogue.search"),
			clearLabel: t("actions.clear"),
			onSearch: (e) => {
				i.value = e;
			}
		}, null),
		n.value.state === "loading" && G("p", { role: "status" }, [t("states.loading")]),
		n.value.state === "error" && G("p", { role: "alert" }, [
			t("siril.catalogue.unavailable"),
			" ",
			G("button", {
				type: "button",
				class: "ap-storage-button",
				onClick: r
			}, [t("actions.refresh")])
		]),
		n.value.state === "ready" && (a.value.size ? o(a.value) : G("p", { role: "status" }, [t("siril.catalogue.empty")]))
	]);
});
// ../extension/frontend-entry.ts
IA(e, [{
	id: "siril",
	summary: /* @__PURE__ */ R((e) => {
		let { t } = Z(), { resource: n } = Ry(JA, !0), r = /* @__PURE__ */ P(), i = /* @__PURE__ */ N(), a, o = /* @__PURE__ */ N(!1);
		Wr(() => a?.abort());
		async function s(e) {
			if (o.value) return;
			let t = new AbortController();
			a = t, o.value = !0, i.value = void 0;
			try {
				let n = await ZA(e, t.signal);
				t.signal.aborted || (r.value = n);
			} catch (e) {
				t.signal.aborted || (i.value = e instanceof Q ? e.code : "network");
			} finally {
				t.signal.aborted || (o.value = !1, a = void 0);
			}
		}
		return () => {
			let a = r.value ?? (n.value.state === "ready" ? n.value.data : void 0);
			return G(B, null, [G("div", { class: "ap-software-item" }, [G("button", {
				type: "button",
				class: "ap-software-open",
				onClick: e.onOpen
			}, [G("span", {
				class: "ap-software-item-icon",
				"aria-hidden": "true"
			}, [K("▣")]), G("span", { class: "ap-software-item-copy" }, [
				G("strong", null, [K("Siril")]),
				G("small", null, [t("siril.purpose")]),
				G("small", { class: "ap-software-status" }, [G("span", {
					class: "ap-software-dot",
					"data-state": a ? a.state === "ready" ? "ready" : "error" : "unknown"
				}, null), a ? a.state === "ready" ? t("software.ready") : t("siril.states." + a.state, a.state) : t(n.value.state === "error" ? "siril.states.network" : "states.loading")])
			])]), G("label", { class: "ap-software-switch" }, [
				G("span", { class: "ap-software-switch-label" }, [t("software.enabled")]),
				G("input", {
					type: "checkbox",
					role: "switch",
					"aria-label": t("software.enableNamed", { name: "Siril" }),
					checked: !!a?.enabled,
					disabled: o.value || !a || a.state !== "ready" && !a.enabled,
					onChange: (e) => void s(e.currentTarget.checked)
				}, null),
				G("span", {
					class: "ap-software-switch-track",
					"aria-hidden": "true"
				}, [G("span", null, null)])
			])]), i.value && G("p", { role: "alert" }, [t("siril.states." + i.value, t("errors.unknown"))])]);
		};
	}, { props: ["onOpen"] }),
	settings: /* @__PURE__ */ R(() => {
		let { t: e } = Z(), { resource: t, refresh: n } = Ry(JA, !0), r = /* @__PURE__ */ P(), i = /* @__PURE__ */ N(!1), a = /* @__PURE__ */ N(""), o = /* @__PURE__ */ P(), s = /* @__PURE__ */ N(!1), c = /* @__PURE__ */ P(), l;
		Wr(() => l?.abort());
		let u = (t) => e("siril.states." + t, t);
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
			return G(B, null, [
				G("div", { class: "ap-software-title" }, [G("div", null, [G("h3", null, [K("Siril")]), G("small", null, [e("siril.purpose")])]), G("span", { class: "ap-software-version" }, [K("1.4.5")])]),
				G("section", { class: "ap-software-section" }, [G("p", {
					class: "ap-software-status",
					role: "status"
				}, [G("span", {
					class: "ap-software-dot",
					"data-ready": l?.state === "ready"
				}, null), l ? u(l.state) : e(t.value.state === "error" ? "siril.states.network" : "states.loading")]), l?.path && G("dl", { class: "ap-software-metadata" }, [
					G("dt", null, [e("siril.activePath")]),
					G("dd", null, [l.path]),
					G("dt", null, [e("siril.version")]),
					G("dd", null, [l.version]),
					G("dt", null, [e("siril.verified")]),
					G("dd", null, [l.verified_at ? new Date(l.verified_at).toLocaleString() : "—"])
				])]),
				G("section", { class: "ap-software-section" }, [G("button", {
					type: "button",
					class: "ap-storage-button",
					"aria-expanded": i.value,
					onClick: () => {
						i.value = !i.value;
					}
				}, [e("siril.catalogue.title")]), i.value && G(Oj, null, null)]),
				G("section", { class: "ap-software-section ap-software-guide" }, [
					G("h3", null, [e("siril.install")]),
					G("p", null, [e("siril.install" + (l?.os === "Windows" ? "Windows" : l?.os === "Darwin" ? "Mac" : "Linux"))]),
					G("a", {
						href: "https://siril.org/download/",
						target: "_blank",
						rel: "noreferrer"
					}, [e("siril.download")]),
					" · ",
					G("a", {
						href: "https://siril.org/download/2026-10-28-siril-1-4-5/",
						target: "_blank",
						rel: "noreferrer"
					}, [e("siril.release")])
				]),
				G("section", { class: "ap-software-section" }, [G("div", { class: "ap-siril-actions" }, [G("button", {
					class: "ap-storage-button",
					type: "button",
					disabled: s.value,
					onClick: () => void d(async (e) => {
						o.value = await QA(e);
					})
				}, [e("siril.detect")]), G("button", {
					class: "ap-storage-button",
					type: "button",
					disabled: s.value,
					onClick: () => {
						r.value = void 0, o.value = void 0, n();
					}
				}, [e("actions.refresh")])]), o.value && (o.value.length ? G("ul", { class: "ap-software-candidates" }, [o.value.map((t) => G("li", { key: t.path }, [
					G("button", {
						class: "ap-storage-button",
						type: "button",
						disabled: s.value || t.state !== "ready",
						onClick: () => {
							a.value = t.path;
						}
					}, [e("siril.select")]),
					" ",
					G("code", null, [t.path]),
					K(" · "),
					t.origin,
					K(" · "),
					t.version ?? t.detected,
					" ",
					K("· "),
					u(t.state)
				]))]) : G("p", { class: "ap-software-muted" }, [e("software.noCandidates")]))]),
				G("section", { class: "ap-software-section" }, [
					G("form", { onSubmit: (e) => {
						e.preventDefault(), d(async (e) => {
							r.value = await YA(a.value.trim() || l?.path || "", e);
						});
					} }, [
						G("label", null, [e("siril.path"), G("input", {
							value: a.value,
							onInput: (e) => {
								a.value = e.currentTarget.value;
							},
							placeholder: l?.path,
							disabled: s.value
						}, null)]),
						G("small", null, [e("siril.pathHelp")]),
						G("div", { class: "ap-siril-actions" }, [G("button", {
							class: "ap-storage-button",
							"data-variant": "primary",
							disabled: s.value || !(a.value.trim() || l?.path)
						}, [e("siril.save")]), l?.path && G("button", {
							class: "ap-storage-button",
							type: "button",
							disabled: s.value,
							onClick: () => void d(async (e) => {
								r.value = await XA(e), a.value = "";
							})
						}, [e("siril.clear")])])
					]),
					s.value && G("p", { role: "status" }, [e("siril.verifying")]),
					c.value && G("p", { role: "alert" }, [u(c.value.code), c.value.detected && ` · ${e("siril.version")} ${c.value.detected}`])
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
	registerNodes: Dj
}]);
