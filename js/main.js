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
}, f = Object.prototype.hasOwnProperty, p = (e, t) => f.call(e, t), m = Array.isArray, h = (e) => w(e) === "[object Map]", g = (e) => w(e) === "[object Set]", _ = (e) => w(e) === "[object Date]", v = (e) => typeof e == "function", y = (e) => typeof e == "string", b = (e) => typeof e == "symbol", x = (e) => typeof e == "object" && !!e, S = (e) => (x(e) || v(e)) && v(e.then) && v(e.catch), C = Object.prototype.toString, w = (e) => C.call(e), T = (e) => w(e).slice(8, -1), E = (e) => w(e) === "[object Object]", D = (e) => y(e) && e !== "NaN" && e[0] !== "-" && "" + parseInt(e, 10) === e, O = /* @__PURE__ */ r(",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"), ee = (e) => {
	let t = /* @__PURE__ */ Object.create(null);
	return ((n) => t[n] || (t[n] = e(n)));
}, te = /-\w/g, k = ee((e) => e.replace(te, (e) => e.slice(1).toUpperCase())), ne = /\B([A-Z])/g, re = ee((e) => e.replace(ne, "-$1").toLowerCase()), ie = ee((e) => e.charAt(0).toUpperCase() + e.slice(1)), ae = ee((e) => e ? `on${ie(e)}` : ""), oe = (e, t) => !Object.is(e, t), se = (e, ...t) => {
	for (let n = 0; n < e.length; n++) e[n](...t);
}, ce = (e, t, n, r = !1) => {
	Object.defineProperty(e, t, {
		configurable: !0,
		enumerable: !1,
		writable: r,
		value: n
	});
}, le = (e) => {
	let t = parseFloat(e);
	return isNaN(t) ? e : t;
}, ue, de = () => ue ||= typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : {};
function fe(e) {
	if (m(e)) {
		let t = {};
		for (let n = 0; n < e.length; n++) {
			let r = e[n], i = y(r) ? ge(r) : fe(r);
			if (i) for (let e in i) t[e] = i[e];
		}
		return t;
	}
	if (y(e) || x(e)) return e;
}
var pe = /;(?![^(]*\))/g, me = /:([^]+)/, he = /\/\*[^]*?\*\//g;
function ge(e) {
	let t = {};
	return e.replace(he, "").split(pe).forEach((e) => {
		if (e) {
			let n = e.split(me);
			n.length > 1 && (t[n[0].trim()] = n[1].trim());
		}
	}), t;
}
function _e(e) {
	let t = "";
	if (y(e)) t = e;
	else if (m(e)) for (let n = 0; n < e.length; n++) {
		let r = _e(e[n]);
		r && (t += r + " ");
	}
	else if (x(e)) for (let n in e) e[n] && (t += n + " ");
	return t.trim();
}
function ve(e) {
	if (!e) return null;
	let { class: t, style: n } = e;
	return t && !y(t) && (e.class = _e(t)), n && (e.style = fe(n)), e;
}
var ye = /* @__PURE__ */ r("itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly");
function be(e) {
	return !!e || e === "";
}
function xe(e, t) {
	if (e.length !== t.length) return !1;
	let n = !0;
	for (let r = 0; n && r < e.length; r++) n = Ce(e[r], t[r]);
	return n;
}
function Se(e, t) {
	if (e.size !== t.size) return !1;
	let n = Array.from(t), r = new Uint8Array(n.length);
	for (let t of e) {
		let e = -1;
		for (let i = 0; i < n.length; i++) if (!r[i] && Ce(t, n[i])) {
			e = i;
			break;
		}
		if (e < 0) return !1;
		r[e] = 1;
	}
	return !0;
}
function Ce(e, t) {
	if (e === t) return !0;
	let n = _(e), r = _(t);
	if (n || r) return n && r ? e.getTime() === t.getTime() : !1;
	if (n = b(e), r = b(t), n || r) return e === t;
	if (n = m(e), r = m(t), n || r) return n && r ? xe(e, t) : !1;
	if (n = x(e), r = x(t), n || r) {
		if (!n || !r) return !1;
		if (n = h(e), r = h(t), n || r || (n = g(e), r = g(t), n || r)) return n && r ? Se(e, t) : !1;
		if (Object.keys(e).length !== Object.keys(t).length) return !1;
		for (let n in e) {
			let r = e.hasOwnProperty(n), i = t.hasOwnProperty(n);
			if (r && !i || !r && i || !Ce(e[n], t[n])) return !1;
		}
	}
	return String(e) === String(t);
}
var we = (e) => !!(e && e.__v_isRef === !0), A = (e) => y(e) ? e : e == null ? "" : m(e) || x(e) && (e.toString === C || !v(e.toString)) ? we(e) ? A(e.value) : JSON.stringify(e, Te, 2) : String(e), Te = (e, t) => we(t) ? Te(e, t.value) : h(t) ? { [`Map(${t.size})`]: [...t.entries()].reduce((e, [t, n], r) => (e[Ee(t, r) + " =>"] = n, e), {}) } : g(t) ? { [`Set(${t.size})`]: [...t.values()].map((e) => Ee(e)) } : b(t) ? Ee(t) : x(t) && !m(t) && !E(t) ? String(t) : t, Ee = (e, t = "") => b(e) ? `Symbol(${e.description ?? t})` : e, De, Oe = class {
	constructor(e = !1) {
		this.detached = e, this._active = !0, this._on = 0, this.effects = [], this.cleanups = [], this._isPaused = !1, this._warnOnRun = !0, this.__v_skip = !0, !e && De && (De.active ? (this.parent = De, this.index = (De.scopes || (De.scopes = [])).push(this) - 1) : (this._active = !1, this._warnOnRun = !1));
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
			let t = De;
			try {
				return De = this, e();
			} finally {
				De = t;
			}
		}
	}
	on() {
		++this._on === 1 && (this.prevScope = De, De = this);
	}
	off() {
		if (this._on > 0 && --this._on === 0) {
			if (De === this) De = this.prevScope;
			else {
				let e = De;
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
function ke(e) {
	return new Oe(e);
}
function Ae() {
	return De;
}
function je(e, t = !1) {
	De && De.cleanups.push(e);
}
var Me, Ne = /* @__PURE__ */ new WeakSet(), Pe = class {
	constructor(e) {
		this.fn = e, this.deps = void 0, this.depsTail = void 0, this.flags = 5, this.next = void 0, this.cleanup = void 0, this.scheduler = void 0, De && (De.active ? De.effects.push(this) : this.flags &= -2);
	}
	pause() {
		this.flags |= 64;
	}
	resume() {
		this.flags & 64 && (this.flags &= -65, Ne.has(this) && (Ne.delete(this), this.trigger()));
	}
	notify() {
		this.flags & 2 && !(this.flags & 32) || this.flags & 8 || Re(this);
	}
	run() {
		if (!(this.flags & 1)) return this.fn();
		this.flags |= 2, Ze(this), Ve(this);
		let e = Me, t = qe;
		Me = this, qe = !0;
		try {
			return this.fn();
		} finally {
			He(this), Me = e, qe = t, this.flags &= -3;
		}
	}
	stop() {
		if (this.flags & 1) {
			for (let e = this.deps; e; e = e.nextDep) Ge(e);
			this.deps = this.depsTail = void 0, Ze(this), this.onStop && this.onStop(), this.flags &= -2;
		}
	}
	trigger() {
		this.flags & 64 ? Ne.add(this) : this.scheduler ? this.scheduler() : this.runIfDirty();
	}
	runIfDirty() {
		Ue(this) && this.run();
	}
	get dirty() {
		return Ue(this);
	}
}, Fe = 0, Ie, Le;
function Re(e, t = !1) {
	e.flags |= 8, t ? (e.next = Le, Le = e) : (e.next = Ie, Ie = e);
}
function ze() {
	Fe++;
}
function Be() {
	if (--Fe > 0) return;
	if (Le) {
		let e = Le;
		for (Le = void 0; e;) {
			let t = e.next;
			e.next = void 0, e.flags &= -9, e = t;
		}
	}
	let e;
	for (; Ie;) {
		let t = Ie;
		for (Ie = void 0; t;) {
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
function Ve(e) {
	for (let t = e.deps; t; t = t.nextDep) t.version = -1, t.prevActiveLink = t.dep.activeLink, t.dep.activeLink = t;
}
function He(e) {
	let t, n = e.depsTail, r = n;
	for (; r;) {
		let e = r.prevDep;
		r.version === -1 ? (r === n && (n = e), Ge(r), Ke(r)) : t = r, r.dep.activeLink = r.prevActiveLink, r.prevActiveLink = void 0, r = e;
	}
	e.deps = t, e.depsTail = n;
}
function Ue(e) {
	for (let t = e.deps; t; t = t.nextDep) if (t.dep.version !== t.version || t.dep.computed && (We(t.dep.computed) || t.dep.version !== t.version)) return !0;
	return !!e._dirty;
}
function We(e) {
	if (e.flags & 4 && !(e.flags & 16) || (e.flags &= -17, e.globalVersion === Qe) || (e.globalVersion = Qe, !e.isSSR && e.flags & 128 && (!e.deps && !e._dirty || !Ue(e)))) return;
	e.flags |= 2;
	let t = e.dep, n = Me, r = qe;
	Me = e, qe = !0;
	try {
		Ve(e);
		let n = e.fn(e._value);
		(t.version === 0 || oe(n, e._value)) && (e.flags |= 128, e._value = n, t.version++);
	} catch (e) {
		throw t.version++, e;
	} finally {
		Me = n, qe = r, He(e), e.flags &= -3;
	}
}
function Ge(e, t = !1) {
	let { dep: n, prevSub: r, nextSub: i } = e;
	if (r && (r.nextSub = i, e.prevSub = void 0), i && (i.prevSub = r, e.nextSub = void 0), n.subs === e && (n.subs = r, !r && n.computed)) {
		n.computed.flags &= -5;
		for (let e = n.computed.deps; e; e = e.nextDep) Ge(e, !0);
	}
	!t && !--n.sc && n.map && n.map.delete(n.key);
}
function Ke(e) {
	let { prevDep: t, nextDep: n } = e;
	t && (t.nextDep = n, e.prevDep = void 0), n && (n.prevDep = t, e.nextDep = void 0);
}
var qe = !0, Je = [];
function Ye() {
	Je.push(qe), qe = !1;
}
function Xe() {
	let e = Je.pop();
	qe = e === void 0 || e;
}
function Ze(e) {
	let { cleanup: t } = e;
	if (e.cleanup = void 0, t) {
		let e = Me;
		Me = void 0;
		try {
			t();
		} finally {
			Me = e;
		}
	}
}
var Qe = 0, $e = class {
	constructor(e, t) {
		this.sub = e, this.dep = t, this.version = t.version, this.nextDep = this.prevDep = this.nextSub = this.prevSub = this.prevActiveLink = void 0;
	}
}, et = class {
	constructor(e) {
		this.computed = e, this.version = 0, this.activeLink = void 0, this.subs = void 0, this.map = void 0, this.key = void 0, this.sc = 0, this.__v_skip = !0;
	}
	track(e) {
		if (!Me || !qe || Me === this.computed) return;
		let t = this.activeLink;
		if (t === void 0 || t.sub !== Me) t = this.activeLink = new $e(Me, this), Me.deps ? (t.prevDep = Me.depsTail, Me.depsTail.nextDep = t, Me.depsTail = t) : Me.deps = Me.depsTail = t, tt(t);
		else if (t.version === -1 && (t.version = this.version, t.nextDep)) {
			let e = t.nextDep;
			e.prevDep = t.prevDep, t.prevDep && (t.prevDep.nextDep = e), t.prevDep = Me.depsTail, t.nextDep = void 0, Me.depsTail.nextDep = t, Me.depsTail = t, Me.deps === t && (Me.deps = e);
		}
		return t;
	}
	trigger(e) {
		this.version++, Qe++, this.notify(e);
	}
	notify(e) {
		ze();
		try {
			for (let e = this.subs; e; e = e.prevSub) e.sub.notify() && e.sub.dep.notify();
		} finally {
			Be();
		}
	}
};
function tt(e) {
	if (e.dep.sc++, e.sub.flags & 4) {
		let t = e.dep.computed;
		if (t && !e.dep.subs) {
			t.flags |= 20;
			for (let e = t.deps; e; e = e.nextDep) tt(e);
		}
		let n = e.dep.subs;
		n !== e && (e.prevSub = n, n && (n.nextSub = e)), e.dep.subs = e;
	}
}
var nt = /* @__PURE__ */ new WeakMap(), rt = /* @__PURE__ */ Symbol(""), it = /* @__PURE__ */ Symbol(""), at = /* @__PURE__ */ Symbol("");
function ot(e, t, n) {
	if (qe && Me) {
		let t = nt.get(e);
		t || nt.set(e, t = /* @__PURE__ */ new Map());
		let r = t.get(n);
		r || (t.set(n, r = new et()), r.map = t, r.key = n), r.track();
	}
}
function st(e, t, n, r, i, a) {
	let o = nt.get(e);
	if (!o) {
		Qe++;
		return;
	}
	let s = (e) => {
		e && e.trigger();
	};
	if (ze(), t === "clear") o.forEach(s);
	else {
		let i = m(e), a = i && D(n);
		if (i && n === "length") {
			let e = Number(r);
			o.forEach((t, n) => {
				(n === "length" || n === at || !b(n) && n >= e) && s(t);
			});
		} else switch ((n !== void 0 || o.has(void 0)) && s(o.get(n)), a && s(o.get(at)), t) {
			case "add":
				i ? a && s(o.get("length")) : (s(o.get(rt)), h(e) && s(o.get(it)));
				break;
			case "delete":
				i || (s(o.get(rt)), h(e) && s(o.get(it)));
				break;
			case "set": h(e) && s(o.get(rt));
		}
	}
	Be();
}
function ct(e, t) {
	let n = nt.get(e);
	return n && n.get(t);
}
function lt(e) {
	let t = /* @__PURE__ */ $t(e);
	return t === e ? t : (ot(t, "iterate", at), /* @__PURE__ */ Zt(e) ? t : t.map(tn));
}
function ut(e) {
	return ot(e = /* @__PURE__ */ $t(e), "iterate", at), e;
}
function dt(e, t) {
	return /* @__PURE__ */ Xt(e) ? nn(/* @__PURE__ */ Yt(e) ? tn(t) : t) : tn(t);
}
var ft = {
	__proto__: null,
	[Symbol.iterator]() {
		return pt(this, Symbol.iterator, (e) => dt(this, e));
	},
	concat(...e) {
		return lt(this).concat(...e.map((e) => m(e) ? lt(e) : e));
	},
	entries() {
		return pt(this, "entries", (e) => (e[1] = dt(this, e[1]), e));
	},
	every(e, t) {
		return ht(this, "every", e, t, void 0, arguments);
	},
	filter(e, t) {
		return ht(this, "filter", e, t, (e) => e.map((e) => dt(this, e)), arguments);
	},
	find(e, t) {
		return ht(this, "find", e, t, (e) => dt(this, e), arguments);
	},
	findIndex(e, t) {
		return ht(this, "findIndex", e, t, void 0, arguments);
	},
	findLast(e, t) {
		return ht(this, "findLast", e, t, (e) => dt(this, e), arguments);
	},
	findLastIndex(e, t) {
		return ht(this, "findLastIndex", e, t, void 0, arguments);
	},
	forEach(e, t) {
		return ht(this, "forEach", e, t, void 0, arguments);
	},
	includes(...e) {
		return _t(this, "includes", e);
	},
	indexOf(...e) {
		return _t(this, "indexOf", e);
	},
	join(e) {
		return lt(this).join(e);
	},
	lastIndexOf(...e) {
		return _t(this, "lastIndexOf", e);
	},
	map(e, t) {
		return ht(this, "map", e, t, void 0, arguments);
	},
	pop() {
		return vt(this, "pop");
	},
	push(...e) {
		return vt(this, "push", e);
	},
	reduce(e, ...t) {
		return gt(this, "reduce", e, t);
	},
	reduceRight(e, ...t) {
		return gt(this, "reduceRight", e, t);
	},
	shift() {
		return vt(this, "shift");
	},
	some(e, t) {
		return ht(this, "some", e, t, void 0, arguments);
	},
	splice(...e) {
		return vt(this, "splice", e);
	},
	toReversed() {
		return lt(this).toReversed();
	},
	toSorted(e) {
		return lt(this).toSorted(e);
	},
	toSpliced(...e) {
		return lt(this).toSpliced(...e);
	},
	unshift(...e) {
		return vt(this, "unshift", e);
	},
	values() {
		return pt(this, "values", (e) => dt(this, e));
	}
};
function pt(e, t, n) {
	let r = ut(e), i = r[t]();
	return r !== e && !/* @__PURE__ */ Zt(e) && (i._next = i.next, i.next = () => {
		let e = i._next();
		return e.done || (e.value = n(e.value)), e;
	}), i;
}
var mt = Array.prototype;
function ht(e, t, n, r, i, a) {
	let o = ut(e), s = o !== e && !/* @__PURE__ */ Zt(e), c = o[t];
	if (c !== mt[t]) {
		let t = c.apply(e, a);
		return s ? tn(t) : t;
	}
	let l = n;
	o !== e && (s ? l = function(t, r) {
		return n.call(this, dt(e, t), r, e);
	} : n.length > 2 && (l = function(t, r) {
		return n.call(this, t, r, e);
	}));
	let u = c.call(o, l, r);
	return s && i ? i(u) : u;
}
function gt(e, t, n, r) {
	let i = ut(e), a = i !== e && !/* @__PURE__ */ Zt(e), o = n, s = !1;
	i !== e && (a ? (s = r.length === 0, o = function(t, r, i) {
		return s && (s = !1, t = dt(e, t)), n.call(this, t, dt(e, r), i, e);
	}) : n.length > 3 && (o = function(t, r, i) {
		return n.call(this, t, r, i, e);
	}));
	let c = i[t](o, ...r);
	return s ? dt(e, c) : c;
}
function _t(e, t, n) {
	let r = /* @__PURE__ */ $t(e);
	ot(r, "iterate", at);
	let i = r[t](...n);
	return (i === -1 || i === !1) && /* @__PURE__ */ Qt(n[0]) ? (n[0] = /* @__PURE__ */ $t(n[0]), r[t](...n)) : i;
}
function vt(e, t, n = []) {
	Ye(), ze();
	let r = (/* @__PURE__ */ $t(e))[t].apply(e, n);
	return Be(), Xe(), r;
}
var yt = /* @__PURE__ */ r("__proto__,__v_isRef,__isVue"), bt = new Set(/* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((e) => e !== "arguments" && e !== "caller").map((e) => Symbol[e]).filter(b));
function xt(e) {
	b(e) || (e = String(e));
	let t = /* @__PURE__ */ $t(this);
	return ot(t, "has", e), t.hasOwnProperty(e);
}
var St = class {
	constructor(e = !1, t = !1) {
		this._isReadonly = e, this._isShallow = t;
	}
	get(e, t, n) {
		if (t === "__v_skip") return e.__v_skip;
		let r = this._isReadonly, i = this._isShallow;
		if (t === "__v_isReactive") return !r;
		if (t === "__v_isReadonly") return r;
		if (t === "__v_isShallow") return i;
		if (t === "__v_raw") return n === (r ? i ? Ht : Vt : i ? Bt : zt).get(e) || Object.getPrototypeOf(e) === Object.getPrototypeOf(n) ? e : void 0;
		let a = m(e);
		if (!r) {
			let e;
			if (a && (e = ft[t])) return e;
			if (t === "hasOwnProperty") return xt;
		}
		let o = Reflect.get(e, t, /* @__PURE__ */ rn(e) ? e : n);
		if ((b(t) ? bt.has(t) : yt(t)) || (r || ot(e, "get", t), i)) return o;
		if (/* @__PURE__ */ rn(o)) {
			let e = a && D(t) ? o : o.value;
			return r && x(e) ? /* @__PURE__ */ Kt(e) : e;
		}
		return x(o) ? r ? /* @__PURE__ */ Kt(o) : /* @__PURE__ */ Wt(o) : o;
	}
}, Ct = class extends St {
	constructor(e = !1) {
		super(!1, e);
	}
	set(e, t, n, r) {
		let i = e[t], a = m(e) && D(t);
		if (!this._isShallow) {
			let e = /* @__PURE__ */ Xt(i);
			if (!/* @__PURE__ */ Zt(n) && !/* @__PURE__ */ Xt(n) && (i = /* @__PURE__ */ $t(i), n = /* @__PURE__ */ $t(n)), !a && /* @__PURE__ */ rn(i) && !/* @__PURE__ */ rn(n)) return e || (i.value = n), !0;
		}
		let o = a ? Number(t) < e.length : p(e, t), s = Reflect.set(e, t, n, /* @__PURE__ */ rn(e) ? e : r);
		return e === /* @__PURE__ */ $t(r) && s && (o ? oe(n, i) && st(e, "set", t, n, i) : st(e, "add", t, n)), s;
	}
	deleteProperty(e, t) {
		let n = p(e, t), r = e[t], i = Reflect.deleteProperty(e, t);
		return i && n && st(e, "delete", t, void 0, r), i;
	}
	has(e, t) {
		let n = Reflect.has(e, t);
		return b(t) && bt.has(t) || ot(e, "has", t), n;
	}
	ownKeys(e) {
		return ot(e, "iterate", m(e) ? "length" : rt), Reflect.ownKeys(e);
	}
}, wt = class extends St {
	constructor(e = !1) {
		super(!0, e);
	}
	set(e, t) {
		return !0;
	}
	deleteProperty(e, t) {
		return !0;
	}
}, Tt = /* @__PURE__ */ new Ct(), Et = /* @__PURE__ */ new wt(), Dt = /* @__PURE__ */ new Ct(!0), Ot = /* @__PURE__ */ new wt(!0), kt = (e) => e, At = (e) => Reflect.getPrototypeOf(e);
function jt(e, t, n) {
	return function(...r) {
		let i = this.__v_raw, a = /* @__PURE__ */ $t(i), o = h(a), s = e === "entries" || e === Symbol.iterator && o, c = e === "keys" && o, l = i[e](...r), d = n ? kt : t ? nn : tn;
		return !t && ot(a, "iterate", c ? it : rt), u(Object.create(l), { next() {
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
function Mt(e) {
	return function(...t) {
		return e === "delete" ? !1 : e === "clear" ? void 0 : this;
	};
}
function Nt(e, t) {
	let n = {
		get(n) {
			let r = this.__v_raw, i = /* @__PURE__ */ $t(r), a = /* @__PURE__ */ $t(n);
			e || (oe(n, a) && ot(i, "get", n), ot(i, "get", a));
			let { has: o } = At(i), s = t ? kt : e ? nn : tn;
			if (o.call(i, n)) return s(r.get(n));
			if (o.call(i, a)) return s(r.get(a));
			r !== i && r.get(n);
		},
		get size() {
			let t = this.__v_raw;
			return !e && ot(/* @__PURE__ */ $t(t), "iterate", rt), t.size;
		},
		has(t) {
			let n = this.__v_raw, r = /* @__PURE__ */ $t(n), i = /* @__PURE__ */ $t(t);
			return e || (oe(t, i) && ot(r, "has", t), ot(r, "has", i)), t === i ? n.has(t) : n.has(t) || n.has(i);
		},
		forEach(n, r) {
			let i = this, a = i.__v_raw, o = /* @__PURE__ */ $t(a), s = t ? kt : e ? nn : tn;
			return !e && ot(o, "iterate", rt), a.forEach((e, t) => n.call(r, s(e), s(t), i));
		}
	};
	return u(n, e ? {
		add: Mt("add"),
		set: Mt("set"),
		delete: Mt("delete"),
		clear: Mt("clear")
	} : {
		add(e) {
			let n = /* @__PURE__ */ $t(this), r = At(n), i = /* @__PURE__ */ $t(e), a = !t && !/* @__PURE__ */ Zt(e) && !/* @__PURE__ */ Xt(e) ? i : e;
			return r.has.call(n, a) || oe(e, a) && r.has.call(n, e) || oe(i, a) && r.has.call(n, i) || (n.add(a), st(n, "add", a, a)), this;
		},
		set(e, n) {
			t || /* @__PURE__ */ Zt(n) || /* @__PURE__ */ Xt(n) || (n = /* @__PURE__ */ $t(n));
			let r = /* @__PURE__ */ $t(this), { has: i, get: a } = At(r), o = i.call(r, e);
			o ||= (e = /* @__PURE__ */ $t(e), i.call(r, e));
			let s = a.call(r, e);
			return r.set(e, n), o ? oe(n, s) && st(r, "set", e, n, s) : st(r, "add", e, n), this;
		},
		delete(e) {
			let t = /* @__PURE__ */ $t(this), { has: n, get: r } = At(t), i = n.call(t, e);
			i ||= (e = /* @__PURE__ */ $t(e), n.call(t, e));
			let a = r ? r.call(t, e) : void 0, o = t.delete(e);
			return i && st(t, "delete", e, void 0, a), o;
		},
		clear() {
			let e = /* @__PURE__ */ $t(this), t = e.size !== 0, n = e.clear();
			return t && st(e, "clear", void 0, void 0, void 0), n;
		}
	}), [
		"keys",
		"values",
		"entries",
		Symbol.iterator
	].forEach((r) => {
		n[r] = jt(r, e, t);
	}), n;
}
function Pt(e, t) {
	let n = Nt(e, t);
	return (t, r, i) => r === "__v_isReactive" ? !e : r === "__v_isReadonly" ? e : r === "__v_raw" ? t : Reflect.get(p(n, r) && r in t ? n : t, r, i);
}
var Ft = { get: /* @__PURE__ */ Pt(!1, !1) }, It = { get: /* @__PURE__ */ Pt(!1, !0) }, Lt = { get: /* @__PURE__ */ Pt(!0, !1) }, Rt = { get: /* @__PURE__ */ Pt(!0, !0) }, zt = /* @__PURE__ */ new WeakMap(), Bt = /* @__PURE__ */ new WeakMap(), Vt = /* @__PURE__ */ new WeakMap(), Ht = /* @__PURE__ */ new WeakMap();
function Ut(e) {
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
function Wt(e) {
	return /* @__PURE__ */ Xt(e) ? e : Jt(e, !1, Tt, Ft, zt);
}
// @__NO_SIDE_EFFECTS__
function Gt(e) {
	return Jt(e, !1, Dt, It, Bt);
}
// @__NO_SIDE_EFFECTS__
function Kt(e) {
	return Jt(e, !0, Et, Lt, Vt);
}
// @__NO_SIDE_EFFECTS__
function qt(e) {
	return Jt(e, !0, Ot, Rt, Ht);
}
function Jt(e, t, n, r, i) {
	if (!x(e) || e.__v_raw && !(t && e.__v_isReactive) || e.__v_skip || !Object.isExtensible(e)) return e;
	let a = i.get(e);
	if (a) return a;
	let o = Ut(T(e));
	if (o === 0) return e;
	let s = new Proxy(e, o === 2 ? r : n);
	return i.set(e, s), s;
}
// @__NO_SIDE_EFFECTS__
function Yt(e) {
	return /* @__PURE__ */ Xt(e) ? /* @__PURE__ */ Yt(e.__v_raw) : !!(e && e.__v_isReactive);
}
// @__NO_SIDE_EFFECTS__
function Xt(e) {
	return !!(e && e.__v_isReadonly);
}
// @__NO_SIDE_EFFECTS__
function Zt(e) {
	return !!(e && e.__v_isShallow);
}
// @__NO_SIDE_EFFECTS__
function Qt(e) {
	return e ? !!e.__v_raw : !1;
}
// @__NO_SIDE_EFFECTS__
function $t(e) {
	let t = e && e.__v_raw;
	return t ? /* @__PURE__ */ $t(t) : e;
}
function en(e) {
	return !p(e, "__v_skip") && Object.isExtensible(e) && ce(e, "__v_skip", !0), e;
}
var tn = (e) => x(e) ? /* @__PURE__ */ Wt(e) : e, nn = (e) => x(e) ? /* @__PURE__ */ Kt(e) : e;
// @__NO_SIDE_EFFECTS__
function rn(e) {
	return e ? e.__v_isRef === !0 : !1;
}
// @__NO_SIDE_EFFECTS__
function j(e) {
	return an(e, !1);
}
// @__NO_SIDE_EFFECTS__
function M(e) {
	return an(e, !0);
}
function an(e, t) {
	return /* @__PURE__ */ rn(e) ? e : new on(e, t);
}
var on = class {
	constructor(e, t) {
		this.dep = new et(), this.__v_isRef = !0, this.__v_isShallow = !1, this._rawValue = t ? e : /* @__PURE__ */ $t(e), this._value = t ? e : tn(e), this.__v_isShallow = t;
	}
	get value() {
		return this.dep.track(), this._value;
	}
	set value(e) {
		let t = this._rawValue, n = this.__v_isShallow || /* @__PURE__ */ Zt(e) || /* @__PURE__ */ Xt(e);
		e = n ? e : /* @__PURE__ */ $t(e), oe(e, t) && (this._rawValue = e, this._value = n ? e : tn(e), this.dep.trigger());
	}
};
function sn(e) {
	e.dep && e.dep.trigger();
}
function N(e) {
	return /* @__PURE__ */ rn(e) ? e.value : e;
}
function cn(e) {
	return v(e) ? e() : N(e);
}
var ln = {
	get: (e, t, n) => t === "__v_raw" ? e : N(Reflect.get(e, t, n)),
	set: (e, t, n, r) => {
		let i = e[t];
		return /* @__PURE__ */ rn(i) && !/* @__PURE__ */ rn(n) ? (i.value = n, !0) : Reflect.set(e, t, n, r);
	}
};
function un(e) {
	return /* @__PURE__ */ Yt(e) ? e : new Proxy(e, ln);
}
var dn = class {
	constructor(e) {
		this.__v_isRef = !0, this._value = void 0;
		let t = this.dep = new et(), { get: n, set: r } = e(t.track.bind(t), t.trigger.bind(t));
		this._get = n, this._set = r;
	}
	get value() {
		return this._value = this._get();
	}
	set value(e) {
		this._set(e);
	}
};
function fn(e) {
	return new dn(e);
}
// @__NO_SIDE_EFFECTS__
function pn(e) {
	let t = m(e) ? Array(e.length) : {};
	for (let n in e) t[n] = _n(e, n);
	return t;
}
var mn = class {
	constructor(e, t, n) {
		this._object = e, this._defaultValue = n, this.__v_isRef = !0, this._value = void 0, this._key = b(t) ? t : String(t), this._raw = /* @__PURE__ */ $t(e);
		let r = !0, i = e;
		if (!m(e) || b(this._key) || !D(this._key)) do
			r = !/* @__PURE__ */ Qt(i) || /* @__PURE__ */ Zt(i);
		while (r && (i = i.__v_raw));
		this._shallow = r;
	}
	get value() {
		let e = this._object[this._key];
		return this._shallow && (e = N(e)), this._value = e === void 0 ? this._defaultValue : e;
	}
	set value(e) {
		if (this._shallow && /* @__PURE__ */ rn(this._raw[this._key])) {
			let t = this._object[this._key];
			if (/* @__PURE__ */ rn(t)) {
				t.value = e;
				return;
			}
		}
		this._object[this._key] = e;
	}
	get dep() {
		return ct(this._raw, this._key);
	}
}, hn = class {
	constructor(e) {
		this._getter = e, this.__v_isRef = !0, this.__v_isReadonly = !0, this._value = void 0;
	}
	get value() {
		return this._value = this._getter();
	}
};
// @__NO_SIDE_EFFECTS__
function gn(e, t, n) {
	return /* @__PURE__ */ rn(e) ? e : v(e) ? new hn(e) : x(e) && arguments.length > 1 ? _n(e, t, n) : /* @__PURE__ */ j(e);
}
function _n(e, t, n) {
	return new mn(e, t, n);
}
var vn = class {
	constructor(e, t, n) {
		this.fn = e, this.setter = t, this._value = void 0, this.dep = new et(this), this.__v_isRef = !0, this.deps = void 0, this.depsTail = void 0, this.flags = 16, this.globalVersion = Qe - 1, this.next = void 0, this.effect = this, this.__v_isReadonly = !t, this.isSSR = n;
	}
	notify() {
		if (this.flags |= 16, !(this.flags & 8) && Me !== this) return Re(this, !0), !0;
	}
	get value() {
		let e = this.dep.track();
		return We(this), e && (e.version = this.dep.version), this._value;
	}
	set value(e) {
		this.setter && this.setter(e);
	}
};
// @__NO_SIDE_EFFECTS__
function yn(e, t, n = !1) {
	let r, i;
	return v(e) ? r = e : (r = e.get, i = e.set), new vn(r, i, n);
}
var bn = {}, xn = /* @__PURE__ */ new WeakMap(), Sn = void 0;
function Cn(e, t = !1, n = Sn) {
	if (n) {
		let t = xn.get(n);
		t || xn.set(n, t = []), t.push(e);
	}
}
function wn(e, t, n = i) {
	let { immediate: r, deep: a, once: s, scheduler: c, augmentJob: l, call: u } = n, f = (e) => a ? e : /* @__PURE__ */ Zt(e) || a === !1 || a === 0 ? Tn(e, 1) : Tn(e), p, h, g, _, y = !1, b = !1;
	if (/* @__PURE__ */ rn(e) ? (h = () => e.value, y = /* @__PURE__ */ Zt(e)) : /* @__PURE__ */ Yt(e) ? (h = () => f(e), y = !0) : m(e) ? (b = !0, y = e.some((e) => /* @__PURE__ */ Yt(e) || /* @__PURE__ */ Zt(e)), h = () => e.map((e) => {
		if (/* @__PURE__ */ rn(e)) return e.value;
		if (/* @__PURE__ */ Yt(e)) return f(e);
		if (v(e)) return u ? u(e, 2) : e();
	})) : h = v(e) ? t ? u ? () => u(e, 2) : e : () => {
		if (g) {
			Ye();
			try {
				g();
			} finally {
				Xe();
			}
		}
		let t = Sn;
		Sn = p;
		try {
			return u ? u(e, 3, [_]) : e(_);
		} finally {
			Sn = t;
		}
	} : o, t && a) {
		let e = h, t = a === !0 ? Infinity : a;
		h = () => Tn(e(), t);
	}
	let x = Ae(), S = () => {
		p.stop(), x && x.active && d(x.effects, p);
	};
	if (s && t) {
		let e = t;
		t = (...t) => {
			let n = e(...t);
			return S(), n;
		};
	}
	let C = b ? Array(e.length).fill(bn) : bn, w = (e) => {
		if (p.flags & 1 && (p.dirty || e)) {
			if (t) {
				let n = p.run();
				if (e || a || y || (b ? n.some((e, t) => oe(e, C[t])) : oe(n, C))) {
					g && g();
					let e = Sn;
					Sn = p;
					try {
						let e = [
							n,
							C === bn ? void 0 : b && C[0] === bn ? [] : C,
							_
						];
						C = n, u ? u(t, 3, e) : t(...e);
					} finally {
						Sn = e;
					}
				}
			} else p.run();
		}
	};
	return l && l(w), p = new Pe(h), p.scheduler = c ? () => c(w, !1) : w, _ = (e) => Cn(e, !1, p), g = p.onStop = () => {
		let e = xn.get(p);
		if (e) {
			if (u) u(e, 4);
			else for (let t of e) t();
			xn.delete(p);
		}
	}, t ? r ? w(!0) : C = p.run() : c ? c(w.bind(null, !0), !0) : p.run(), S.pause = p.pause.bind(p), S.resume = p.resume.bind(p), S.stop = S, S;
}
function Tn(e, t = Infinity, n) {
	if (t <= 0 || !x(e) || e.__v_skip || (n ||= /* @__PURE__ */ new Map(), (n.get(e) || 0) >= t)) return e;
	if (n.set(e, t), t--, /* @__PURE__ */ rn(e)) Tn(e.value, t, n);
	else if (m(e)) for (let r = 0; r < e.length; r++) Tn(e[r], t, n);
	else if (g(e) || h(e)) e.forEach((e) => {
		Tn(e, t, n);
	});
	else if (E(e)) {
		for (let r in e) Tn(e[r], t, n);
		for (let r of Object.getOwnPropertySymbols(e)) Object.prototype.propertyIsEnumerable.call(e, r) && Tn(e[r], t, n);
	}
	return e;
}
// node_modules/.pnpm/@vue+runtime-core@3.5.42/node_modules/@vue/runtime-core/dist/runtime-core.esm-bundler.js
function En(e, t, n, r) {
	try {
		return r ? e(...r) : e();
	} catch (e) {
		On(e, t, n);
	}
}
function Dn(e, t, n, r) {
	if (v(e)) {
		let i = En(e, t, n, r);
		return i && S(i) && i.catch((e) => {
			On(e, t, n);
		}), i;
	}
	if (m(e)) {
		let i = [];
		for (let a = 0; a < e.length; a++) i.push(Dn(e[a], t, n, r));
		return i;
	}
}
function On(e, t, n, r = !0) {
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
			Ye(), En(o, null, 10, [
				e,
				i,
				a
			]), Xe();
			return;
		}
	}
	kn(e, n, a, r, s);
}
function kn(e, t, n, r = !0, i = !1) {
	if (i) throw e;
	console.error(e);
}
var An = [], jn = -1, Mn = [], Nn = null, Pn = 0, Fn = /* @__PURE__ */ Promise.resolve(), In = null;
function Ln(e) {
	let t = In || Fn;
	return e ? t.then(this ? e.bind(this) : e) : t;
}
function Rn(e) {
	let t = jn + 1, n = An.length;
	for (; t < n;) {
		let r = t + n >>> 1, i = An[r], a = Wn(i);
		a < e || a === e && i.flags & 2 ? t = r + 1 : n = r;
	}
	return t;
}
function zn(e) {
	if (!(e.flags & 1)) {
		let t = Wn(e), n = An[An.length - 1];
		!n || !(e.flags & 2) && t >= Wn(n) ? An.push(e) : An.splice(Rn(t), 0, e), e.flags |= 1, Bn();
	}
}
function Bn() {
	In ||= Fn.then(Gn);
}
function Vn(e) {
	if (!m(e)) Nn && e.id === -1 ? Nn.splice(Pn + 1, 0, e) : e.flags & 1 || (Mn.push(e), e.flags |= 1);
	else for (let t = 0; t < e.length; t++) Mn.push(e[t]);
	Bn();
}
function Hn(e, t, n = jn + 1) {
	for (; n < An.length; n++) {
		let t = An[n];
		if (t && t.flags & 2) {
			if (e && t.id !== e.uid) continue;
			An.splice(n, 1), n--, t.flags & 4 && (t.flags &= -2), t(), t.flags & 4 || (t.flags &= -2);
		}
	}
}
function Un(e) {
	if (Mn.length) {
		let e = [...new Set(Mn)].sort((e, t) => Wn(e) - Wn(t));
		if (Mn.length = 0, Nn) {
			for (let t = 0; t < e.length; t++) Nn.push(e[t]);
			return;
		}
		for (Nn = e, Pn = 0; Pn < Nn.length; Pn++) {
			let e = Nn[Pn];
			e.flags & 4 && (e.flags &= -2), e.flags & 8 || e(), e.flags &= -2;
		}
		Nn = null, Pn = 0;
	}
}
var Wn = (e) => e.id == null ? e.flags & 2 ? -1 : Infinity : e.id;
function Gn(e) {
	try {
		for (jn = 0; jn < An.length; jn++) {
			let e = An[jn];
			e && !(e.flags & 8) && (e.flags & 4 && (e.flags &= -2), En(e, e.i, e.i ? 15 : 14), e.flags & 4 || (e.flags &= -2));
		}
	} finally {
		for (; jn < An.length; jn++) {
			let e = An[jn];
			e && (e.flags &= -2);
		}
		jn = -1, An.length = 0, Un(e), In = null, (An.length || Mn.length) && Gn(e);
	}
}
var Kn = null, qn = null;
function Jn(e) {
	let t = Kn;
	return Kn = e, qn = e && e.type.__scopeId || null, t;
}
function P(e, t = Kn, n) {
	if (!t || e._n) return e;
	let r = (...n) => {
		r._d && Aa(-1);
		let i = Jn(t), a = Ea.length, o;
		try {
			o = e(...n);
		} finally {
			for (let e = Ea.length; e > a; e--) Oa();
			Jn(i), r._d && Aa(1);
		}
		return o;
	};
	return r._n = !0, r._c = !0, r._d = !0, r;
}
function Yn(e, t) {
	if (Kn === null) return e;
	let n = so(Kn), r = e.dirs ||= [];
	for (let e = 0; e < t.length; e++) {
		let [a, o, s, c = i] = t[e];
		a && (v(a) && (a = {
			mounted: a,
			updated: a
		}), a.deep && Tn(o), r.push({
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
function Xn(e, t, n, r) {
	let i = e.dirs, a = t && t.dirs;
	for (let o = 0; o < i.length; o++) {
		let s = i[o];
		a && (s.oldValue = a[o].value);
		let c = s.dir[r];
		c && (Ye(), Dn(c, n, 8, [
			e.el,
			s,
			e,
			t
		]), Xe());
	}
}
function Zn(e, t) {
	if (qa) {
		let n = qa.provides, r = qa.parent && qa.parent.provides;
		r === n && (n = qa.provides = Object.create(r)), n[e] = t;
	}
}
function Qn(e, t, n = !1) {
	let r = Ja();
	if (r || Mi) {
		let i = Mi ? Mi._context.provides : r ? r.parent == null || r.ce ? r.vnode.appContext && r.vnode.appContext.provides : r.parent.provides : void 0;
		if (i && e in i) return i[e];
		if (arguments.length > 1) return n && v(t) ? t.call(r && r.proxy) : t;
	}
}
var $n = /* @__PURE__ */ Symbol.for("v-scx"), er = () => Qn($n);
function tr(e, t) {
	return ir(e, null, t);
}
function nr(e, t) {
	return ir(e, null, { flush: "post" });
}
function rr(e, t) {
	return ir(e, null, { flush: "sync" });
}
function F(e, t, n) {
	return ir(e, t, n);
}
function ir(e, t, n = i) {
	let { immediate: r, deep: a, flush: s, once: c } = n, l = u({}, n), d = t && r || !t && s !== "post", f;
	if (eo) {
		if (s === "sync") {
			let e = er();
			f = e.__watcherHandles ||= [];
		} else if (!d) {
			let e = () => {};
			return e.stop = o, e.resume = o, e.pause = o, e;
		}
	}
	let p = qa;
	l.call = (e, t, n) => Dn(e, p, t, n);
	let m = !1;
	s === "post" ? l.scheduler = (e) => {
		ua(e, p && p.suspense);
	} : s !== "sync" && (m = !0, l.scheduler = (e, t) => {
		t ? e() : zn(e);
	}), l.augmentJob = (e) => {
		t && (e.flags |= 4), m && (e.flags |= 2, p && (e.id = p.uid, e.i = p));
	};
	let h = wn(e, t, l);
	return eo && (f ? f.push(h) : d && h()), h;
}
function ar(e, t, n) {
	let r = this.proxy, i = y(e) ? e.includes(".") ? or(r, e) : () => r[e] : e.bind(r, r), a;
	v(t) ? a = t : (a = t.handler, n = t);
	let o = Za(this), s = ir(i, a.bind(r), n);
	return o(), s;
}
function or(e, t) {
	let n = t.split(".");
	return () => {
		let t = e;
		for (let e = 0; e < n.length && t; e++) t = t[n[e]];
		return t;
	};
}
var sr = /* @__PURE__ */ new WeakMap(), cr = /* @__PURE__ */ Symbol("_vte"), lr = (e) => e.__isTeleport, ur = (e) => e && (e.disabled || e.disabled === ""), dr = (e) => e && (e.defer || e.defer === ""), fr = (e) => typeof SVGElement < "u" && e instanceof SVGElement, pr = (e) => typeof MathMLElement == "function" && e instanceof MathMLElement, mr = (e, t) => {
	let n = e && e.to;
	return y(n) ? t ? t(n) : null : n;
}, hr = {
	name: "Teleport",
	__isTeleport: !0,
	process(e, t, n, r, i, a, o, s, c, l) {
		let { mc: u, pc: d, pbc: f, o: { insert: p, querySelector: m, createText: h, createComment: g, parentNode: _ } } = l, v = ur(t.props), { dynamicChildren: y } = t, b = (e, t, n) => {
			e.shapeFlag & 16 && u(e.children, t, n, i, a, o, s, c);
		}, x = (e = t) => {
			let n = ur(e.props), r = e.target = mr(e.props, m), a = br(r, e, h, p);
			r && (o !== "svg" && fr(r) ? o = "svg" : o !== "mathml" && pr(r) && (o = "mathml"), i && i.isCE && (i.ce._teleportTargets || (i.ce._teleportTargets = /* @__PURE__ */ new Set())).add(r), n || (b(e, r, a), yr(e, !1)));
		}, S = (e) => {
			let t = () => {
				if (sr.get(e) === t) {
					if (sr.delete(e), ur(e.props)) {
						let t = _(e.el) || n;
						b(e, t, e.anchor), yr(e, !0);
					}
					x(e);
				}
			};
			sr.set(e, t), ua(t, a);
		};
		if (e == null) {
			let e = t.el = h(""), i = t.anchor = h("");
			if (p(e, n, r), p(i, n, r), dr(t.props) || a && a.pendingBranch) {
				S(t);
				return;
			}
			v && (b(t, n, i), yr(t, !0)), x();
		} else {
			t.el = e.el;
			let r = t.anchor = e.anchor, u = sr.get(e);
			if (u) {
				u.flags |= 8, sr.delete(e), S(t);
				return;
			}
			t.targetStart = e.targetStart;
			let p = t.target = e.target, h = t.targetAnchor = e.targetAnchor, g = ur(e.props), _ = g ? n : p, b = g ? r : h;
			if (o === "svg" || fr(p) ? o = "svg" : (o === "mathml" || pr(p)) && (o = "mathml"), y ? (f(e.dynamicChildren, y, _, i, a, o, s), ga(e, t, !0)) : c || d(e, t, _, b, i, a, o, s, !1), v) g ? t.props && e.props && t.props.to !== e.props.to && (t.props.to = e.props.to) : gr(t, n, r, l, 1);
			else if ((t.props && t.props.to) !== (e.props && e.props.to)) {
				let e = mr(t.props, m);
				e && (t.target = e, gr(t, e, null, l, 0));
			} else g && gr(t, p, h, l, 1);
			yr(t, v);
		}
	},
	remove(e, t, n, { um: r, o: { remove: i } }, a) {
		let { shapeFlag: o, children: s, anchor: c, targetStart: l, targetAnchor: u, target: d, props: f } = e, p = ur(f), m = a || !p, h = sr.get(e);
		if (h && (h.flags |= 8, sr.delete(e)), d && (i(l), i(u)), a && i(c), !h && (p || d) && o & 16) for (let e = 0; e < s.length; e++) {
			let i = s[e];
			r(i, t, n, m, !!i.dynamicChildren);
		}
	},
	move: gr,
	hydrate: _r
};
function gr(e, t, n, { o: { insert: r }, m: i }, a = 2) {
	a === 0 && r(e.targetAnchor, t, n);
	let { el: o, anchor: s, shapeFlag: c, children: l, props: u } = e, d = a === 2;
	if (d && r(o, t, n), !sr.has(e) && (!d || ur(u)) && c & 16) for (let e = 0; e < l.length; e++) i(l[e], t, n, 2);
	d && r(s, t, n);
}
function _r(e, t, n, r, i, a, { o: { nextSibling: o, parentNode: s, querySelector: c, insert: l, createText: u } }, d) {
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
	let m = t.target = mr(t.props, c), h = ur(t.props);
	if (m) {
		let c = m._lpa || m.firstChild;
		t.shapeFlag & 16 && (h ? (p(e, t), f(m, c), t.targetAnchor || br(m, t, u, l, s(e) === m ? e : null)) : (t.anchor = o(e), f(m, c), t.targetAnchor || br(m, t, u, l), d(c && o(c), t, m, n, r, i, a))), yr(t, h);
	} else h && t.shapeFlag & 16 && (p(e, t), t.targetStart = e, t.targetAnchor = o(e));
	return t.anchor && o(t.anchor);
}
var vr = hr;
function yr(e, t) {
	let n = e.ctx;
	if (n && n.ut) {
		let r, i;
		for (t ? (r = e.el, i = e.anchor) : (r = e.targetStart, i = e.targetAnchor); r && r !== i;) r.nodeType === 1 && r.setAttribute("data-v-owner", n.uid), r = r.nextSibling;
		n.ut();
	}
}
function br(e, t, n, r, i = null) {
	let a = t.targetStart = n(""), o = t.targetAnchor = n("");
	return a[cr] = o, e && (r(a, e, i), r(o, e, i)), o;
}
var xr = /* @__PURE__ */ Symbol("_leaveCb");
function Sr(e) {
	let t = e[0];
	if (e.length > 1) {
		for (let n of e) if (n.type !== wa) {
			t = n;
			break;
		}
	}
	return t;
}
function Cr(e) {
	if (!Nr(e)) return lr(e.type) && e.children ? Sr(e.children) : e;
	if (e.component) return e.component.subTree;
	let { shapeFlag: t, children: n } = e;
	if (n) {
		if (t & 16) return n[0];
		if (t & 32 && v(n.default)) return n.default();
	}
}
function wr(e, t) {
	if (e.shapeFlag & 6 && e.component) {
		e.transition = t;
		let n = e.component.subTree;
		wr(lr(n.type) && Cr(n) || n, t);
	} else e.shapeFlag & 128 ? (e.ssContent.transition = t.clone(e.ssContent), e.ssFallback.transition = t.clone(e.ssFallback)) : e.transition = t;
}
// @__NO_SIDE_EFFECTS__
function I(e, t) {
	return v(e) ? /* @__PURE__ */ u({ name: e.name }, t, { setup: e }) : e;
}
function Tr() {
	let e = Ja();
	return e ? (e.appContext.config.idPrefix || "v") + "-" + e.ids[0] + e.ids[1]++ : "";
}
function Er(e) {
	e.ids = [
		e.ids[0] + e.ids[2]++ + "-",
		0,
		0
	];
}
function Dr(e) {
	let t = Ja(), n = /* @__PURE__ */ M(null);
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
function Or(e, t) {
	let n;
	return !!((n = Object.getOwnPropertyDescriptor(e, t)) && !n.configurable);
}
var kr = /* @__PURE__ */ new WeakMap();
function Ar(e, t, n, r, a = !1) {
	if (m(e)) {
		e.forEach((e, i) => Ar(e, t && (m(t) ? t[i] : t), n, r, a));
		return;
	}
	if (Mr(r) && !a) {
		r.shapeFlag & 512 && r.type.__asyncResolved && r.component.subTree.component && Ar(e, t, n, r.component.subTree);
		return;
	}
	let o = r.shapeFlag & 4 ? so(r.component) : r.el, c = a ? null : o, { i: l, r: u } = e, f = t && t.r, h = l.refs === i ? l.refs = {} : l.refs, g = l.setupState, _ = /* @__PURE__ */ $t(g), b = g === i ? s : (e) => !Or(h, e) && p(_, e), x = (e, t) => !(t && Or(h, t));
	if (f != null && f !== u) {
		if (jr(t), y(f)) h[f] = null, b(f) && (g[f] = null);
		else if (/* @__PURE__ */ rn(f)) {
			let e = t;
			x(f, e.k) && (f.value = null), e.k && (h[e.k] = null);
		}
	}
	if (v(u)) En(u, l, 12, [c, h]);
	else {
		let t = y(u), r = /* @__PURE__ */ rn(u);
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
					i(), kr.delete(e);
				};
				t.id = -1, kr.set(e, t), ua(t, n);
			} else jr(e), i();
		}
	}
}
function jr(e) {
	let t = kr.get(e);
	t && (t.flags |= 8, kr.delete(e));
}
de().requestIdleCallback, de().cancelIdleCallback;
var Mr = (e) => !!e.type.__asyncLoader, Nr = (e) => e.type.__isKeepAlive;
function Pr(e, t) {
	Ir(e, "a", t);
}
function Fr(e, t) {
	Ir(e, "da", t);
}
function Ir(e, t, n = qa) {
	let r = e.__wdc ||= () => {
		let t = n;
		for (; t;) {
			if (t.isDeactivated) return;
			t = t.parent;
		}
		return e();
	};
	if (Rr(t, r, n), n) {
		let e = n.parent;
		for (; e && e.parent;) Nr(e.parent.vnode) && Lr(r, t, n, e), e = e.parent;
	}
}
function Lr(e, t, n, r) {
	let i = Rr(t, e, r, !0);
	Gr(() => {
		d(r[t], i);
	}, n);
}
function Rr(e, t, n = qa, r = !1) {
	if (n) {
		let i = n[e] || (n[e] = []), a = t.__weh ||= (...r) => {
			Ye();
			let i = Za(n), a = Dn(t, n, e, r);
			return i(), Xe(), a;
		};
		return r ? i.unshift(a) : i.push(a), a;
	}
}
var zr = (e) => (t, n = qa) => {
	eo && e !== "sp" || Rr(e, (...e) => t(...e), n);
}, Br = zr("bm"), Vr = zr("m"), Hr = zr("bu"), Ur = zr("u"), Wr = zr("bum"), Gr = zr("um"), Kr = zr("sp"), qr = zr("rtg"), Jr = zr("rtc");
function Yr(e, t = qa) {
	Rr("ec", e, t);
}
var Xr = "components", Zr = /* @__PURE__ */ Symbol.for("v-ndc");
function Qr(e) {
	return y(e) ? $r(Xr, e, !1) || e : e || Zr;
}
function $r(e, t, n = !0, r = !1) {
	let i = Kn || qa;
	if (i) {
		let n = i.type;
		if (e === Xr) {
			let e = co(n, !1);
			if (e && (e === t || e === k(t) || e === ie(k(t)))) return n;
		}
		let a = ei(i[e] || n[e], t) || ei(i.appContext[e], t);
		return !a && r ? n : a;
	}
}
function ei(e, t) {
	return e && (e[t] || e[k(t)] || e[ie(k(t))]);
}
function ti(e, t, n, r) {
	let i, a = n && n[r], o = m(e);
	if (o || y(e)) {
		let n = o && /* @__PURE__ */ Yt(e), r = !1, s = !1;
		n && (r = !/* @__PURE__ */ Zt(e), s = /* @__PURE__ */ Xt(e), e = ut(e)), i = Array(e.length);
		for (let n = 0, o = e.length; n < o; n++) i[n] = t(r ? s ? nn(tn(e[n])) : tn(e[n]) : e[n], n, void 0, a && a[n]);
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
function ni(e, t) {
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
function L(e, t, n, r, i, a) {
	if (n ??= {}, Kn.ce || Kn.parent && Mr(Kn.parent) && Kn.parent.ce) {
		let e = a != null && n.key == null ? u({}, n, { key: a }) : n, i = Object.keys(e).length > 0;
		return t !== "default" && (e.name = t), z(), V(R, null, [U("slot", e, r && r())], i ? -2 : 64);
	}
	let o = e[t];
	o && o._c && (o._d = !1);
	let s = Ea.length;
	z();
	let c;
	try {
		let i = o && ri(o(n)), s = n.key || a || i && i.key;
		c = V(R, { key: (s && !b(s) ? s : `_${t}`) + (!i && r ? "_fb" : "") }, i || (r ? r() : []), i && e._ === 1 ? 64 : -2);
	} catch (e) {
		for (let e = Ea.length; e > s; e--) Oa();
		throw e;
	} finally {
		o && o._c && (o._d = !0);
	}
	return !i && c.scopeId && (c.slotScopeIds = [c.scopeId + "-s"]), c;
}
function ri(e) {
	return e.some((e) => !Ma(e) || !(e.type === wa || e.type === R && !ri(e.children))) ? e : null;
}
function ii(e, t) {
	let n = {};
	for (let r in e) n[t && /[A-Z]/.test(r) ? `on:${r}` : ae(r)] = e[r];
	return n;
}
var ai = (e) => e ? $a(e) ? so(e) : ai(e.parent) : null, oi = /* @__PURE__ */ u(/* @__PURE__ */ Object.create(null), {
	$: (e) => e,
	$el: (e) => e.vnode.el,
	$data: (e) => e.data,
	$props: (e) => e.props,
	$attrs: (e) => e.attrs,
	$slots: (e) => e.slots,
	$refs: (e) => e.refs,
	$parent: (e) => ai(e.parent),
	$root: (e) => ai(e.root),
	$host: (e) => e.ce,
	$emit: (e) => e.emit,
	$options: (e) => yi(e),
	$forceUpdate: (e) => e.f ||= () => {
		zn(e.update);
	},
	$nextTick: (e) => e.n ||= Ln.bind(e.proxy),
	$watch: (e) => ar.bind(e)
}), si = (e, t) => e !== i && !e.__isScriptSetup && p(e, t), ci = {
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
			else if (si(r, t)) return s[t] = 1, r[t];
			else if (a !== i && p(a, t)) return s[t] = 2, a[t];
			else if (p(o, t)) return s[t] = 3, o[t];
			else if (n !== i && p(n, t)) return s[t] = 4, n[t];
			else mi && (s[t] = 0);
		}
		let u = oi[t], d, f;
		if (u) return t === "$attrs" && ot(e.attrs, "get", ""), u(e);
		if ((d = c.__cssModules) && (d = d[t])) return d;
		if (n !== i && p(n, t)) return s[t] = 4, n[t];
		if (f = l.config.globalProperties, p(f, t)) return f[t];
	},
	set({ _: e }, t, n) {
		let { data: r, setupState: a, ctx: o } = e;
		return si(a, t) ? (a[t] = n, !0) : r !== i && p(r, t) ? (r[t] = n, !0) : p(e.props, t) || t[0] === "$" && t.slice(1) in e ? !1 : (o[t] = n, !0);
	},
	has({ _: { data: e, setupState: t, accessCache: n, ctx: r, appContext: a, props: o, type: s } }, c) {
		let l;
		return !!(n[c] || e !== i && c[0] !== "$" && p(e, c) || si(t, c) || p(o, c) || p(r, c) || p(oi, c) || p(a.config.globalProperties, c) || (l = s.__cssModules) && l[c]);
	},
	defineProperty(e, t, n) {
		return n.get == null ? p(n, "value") && this.set(e, t, n.value, null) : e._.accessCache[t] = 0, Reflect.defineProperty(e, t, n);
	}
};
function li() {
	return ui("useAttrs").attrs;
}
function ui(e) {
	let t = Ja();
	return t.setupContext ||= oo(t);
}
function di(e) {
	return m(e) ? e.reduce((e, t) => (e[t] = null, e), {}) : e;
}
function fi(e, t) {
	let n = di(e);
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
function pi(e, t) {
	return !e || !t ? e || t : m(e) && m(t) ? e.concat(t) : u({}, di(e), di(t));
}
var mi = !0;
function hi(e) {
	let t = yi(e), n = e.proxy, r = e.ctx;
	mi = !1, t.beforeCreate && _i(t.beforeCreate, e, "bc");
	let { data: i, computed: a, methods: s, watch: c, provide: l, inject: u, created: d, beforeMount: f, mounted: p, beforeUpdate: h, updated: g, activated: _, deactivated: y, beforeDestroy: b, beforeUnmount: S, destroyed: C, unmounted: w, render: T, renderTracked: E, renderTriggered: D, errorCaptured: O, serverPrefetch: ee, expose: te, inheritAttrs: k, components: ne, directives: re, filters: ie } = t;
	if (u && gi(u, r, null), s) for (let e in s) {
		let t = s[e];
		v(t) && (r[e] = t.bind(n));
	}
	if (i) {
		let t = i.call(n, n);
		x(t) && (e.data = /* @__PURE__ */ Wt(t));
	}
	if (mi = !0, a) for (let e in a) {
		let t = a[e], i = K({
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
	if (c) for (let e in c) vi(c[e], r, n, e);
	if (l) {
		let e = v(l) ? l.call(n) : l;
		Reflect.ownKeys(e).forEach((t) => {
			Zn(t, e[t]);
		});
	}
	d && _i(d, e, "c");
	function ae(e, t) {
		m(t) ? t.forEach((t) => e(t.bind(n))) : t && e(t.bind(n));
	}
	if (ae(Br, f), ae(Vr, p), ae(Hr, h), ae(Ur, g), ae(Pr, _), ae(Fr, y), ae(Yr, O), ae(Jr, E), ae(qr, D), ae(Wr, S), ae(Gr, w), ae(Kr, ee), m(te)) {
		if (te.length) {
			let t = e.exposed ||= {};
			te.forEach((e) => {
				Object.defineProperty(t, e, {
					get: () => n[e],
					set: (t) => n[e] = t,
					enumerable: !0
				});
			});
		} else e.exposed ||= {};
	}
	T && e.render === o && (e.render = T), k != null && (e.inheritAttrs = k), ne && (e.components = ne), re && (e.directives = re), ee && Er(e);
}
function gi(e, t, n = o) {
	m(e) && (e = wi(e));
	for (let n in e) {
		let r = e[n], i;
		i = x(r) ? "default" in r ? Qn(r.from || n, r.default, !0) : Qn(r.from || n) : Qn(r), /* @__PURE__ */ rn(i) ? Object.defineProperty(t, n, {
			enumerable: !0,
			configurable: !0,
			get: () => i.value,
			set: (e) => i.value = e
		}) : t[n] = i;
	}
}
function _i(e, t, n) {
	Dn(m(e) ? e.map((e) => e.bind(t.proxy)) : e.bind(t.proxy), t, n);
}
function vi(e, t, n, r) {
	let i = r.includes(".") ? or(n, r) : () => n[r];
	if (y(e)) {
		let n = t[e];
		v(n) && F(i, n);
	} else if (v(e)) F(i, e.bind(n));
	else if (x(e)) {
		if (m(e)) e.forEach((e) => vi(e, t, n, r));
		else {
			let r = v(e.handler) ? e.handler.bind(n) : t[e.handler];
			v(r) && F(i, r, e);
		}
	}
}
function yi(e) {
	let t = e.type, { mixins: n, extends: r } = t, { mixins: i, optionsCache: a, config: { optionMergeStrategies: o } } = e.appContext, s = a.get(t), c;
	return s ? c = s : !i.length && !n && !r ? c = t : (c = {}, i.length && i.forEach((e) => bi(c, e, o, !0)), bi(c, t, o)), x(t) && a.set(t, c), c;
}
function bi(e, t, n, r = !1) {
	let { mixins: i, extends: a } = t;
	a && bi(e, a, n, !0), i && i.forEach((t) => bi(e, t, n, !0));
	for (let i in t) if (!(r && i === "expose")) {
		let r = xi[i] || n && n[i];
		e[i] = r ? r(e[i], t[i]) : t[i];
	}
	return e;
}
var xi = {
	data: Si,
	props: Di,
	emits: Di,
	methods: Ei,
	computed: Ei,
	beforeCreate: Ti,
	created: Ti,
	beforeMount: Ti,
	mounted: Ti,
	beforeUpdate: Ti,
	updated: Ti,
	beforeDestroy: Ti,
	beforeUnmount: Ti,
	destroyed: Ti,
	unmounted: Ti,
	activated: Ti,
	deactivated: Ti,
	errorCaptured: Ti,
	serverPrefetch: Ti,
	components: Ei,
	directives: Ei,
	watch: Oi,
	provide: Si,
	inject: Ci
};
function Si(e, t) {
	return t ? e ? function() {
		return u(v(e) ? e.call(this, this) : e, v(t) ? t.call(this, this) : t);
	} : t : e;
}
function Ci(e, t) {
	return Ei(wi(e), wi(t));
}
function wi(e) {
	if (m(e)) {
		let t = {};
		for (let n = 0; n < e.length; n++) t[e[n]] = e[n];
		return t;
	}
	return e;
}
function Ti(e, t) {
	return e ? [...new Set([].concat(e, t))] : t;
}
function Ei(e, t) {
	return e ? u(/* @__PURE__ */ Object.create(null), e, t) : t;
}
function Di(e, t) {
	return e ? m(e) && m(t) ? [.../* @__PURE__ */ new Set([...e, ...t])] : u(/* @__PURE__ */ Object.create(null), di(e), di(t ?? {})) : t;
}
function Oi(e, t) {
	if (!e) return t;
	if (!t) return e;
	let n = u(/* @__PURE__ */ Object.create(null), e);
	for (let r in t) n[r] = Ti(e[r], t[r]);
	return n;
}
function ki() {
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
var Ai = 0;
function ji(e, t) {
	return function(n, r = null) {
		v(n) || (n = u({}, n)), r != null && !x(r) && (r = null);
		let i = ki(), a = /* @__PURE__ */ new WeakSet(), o = [], s = !1, c = i.app = {
			_uid: Ai++,
			_component: n,
			_props: r,
			_container: null,
			_context: i,
			_instance: null,
			version: mo,
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
					let u = c._ceVNode || U(n, r);
					return u.appContext = i, l === !0 ? l = "svg" : l === !1 && (l = void 0), o && t ? t(u, a) : e(u, a, l), s = !0, c._container = a, a.__vue_app__ = c, so(u.component);
				}
			},
			onUnmount(e) {
				o.push(e);
			},
			unmount() {
				s && (Dn(o, c._instance, 16), e(null, c._container), delete c._container.__vue_app__);
			},
			provide(e, t) {
				return i.provides[e] = t, c;
			},
			runWithContext(e) {
				let t = Mi;
				Mi = c;
				try {
					return e();
				} finally {
					Mi = t;
				}
			}
		};
		return c;
	};
}
var Mi = null;
function Ni(e, t, n = i) {
	let r = Ja(), a = k(t), o = re(t), s = Pi(e, a), c = fn((s, c) => {
		let l, u = i, d;
		return rr(() => {
			let t = e[a];
			oe(l, t) && (l = t, c());
		}), {
			get() {
				return s(), n.get ? n.get(l) : l;
			},
			set(e) {
				let s = n.set ? n.set(e) : e;
				if (!oe(s, l) && !(u !== i && oe(e, u))) return;
				let f = r.vnode.props, p = !!(f && (t in f || a in f || o in f) && (`onUpdate:${t}` in f || `onUpdate:${a}` in f || `onUpdate:${o}` in f));
				p || (l = e, c()), r.emit(`update:${t}`, s), oe(e, u) && (oe(e, s) && !oe(s, d) || p && u !== i && !oe(s, l)) && c(), u = e, d = s;
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
var Pi = (e, t) => t === "modelValue" || t === "model-value" ? e.modelModifiers : e[`${t}Modifiers`] || e[`${k(t)}Modifiers`] || e[`${re(t)}Modifiers`];
function Fi(e, t, ...n) {
	if (e.isUnmounted) return;
	let r = e.vnode.props || i, a = n, o = t.startsWith("update:"), s = o && Pi(r, t.slice(7));
	s && (s.trim && (a = n.map((e) => y(e) ? e.trim() : e)), s.number && (a = a.map(le)));
	let c, l = r[c = ae(t)] || r[c = ae(k(t))];
	!l && o && (l = r[c = ae(re(t))]), l && Dn(l, e, 6, a);
	let u = r[c + "Once"];
	if (u) {
		if (!e.emitted) e.emitted = {};
		else if (e.emitted[c]) return;
		e.emitted[c] = !0, Dn(u, e, 6, a);
	}
}
var Ii = /* @__PURE__ */ new WeakMap();
function Li(e, t, n = !1) {
	let r = n ? Ii : t.emitsCache, i = r.get(e);
	if (i !== void 0) return i;
	let a = e.emits, o = {}, s = !1;
	if (!v(e)) {
		let r = (e) => {
			let n = Li(e, t, !0);
			n && (s = !0, u(o, n));
		};
		!n && t.mixins.length && t.mixins.forEach(r), e.extends && r(e.extends), e.mixins && e.mixins.forEach(r);
	}
	return !a && !s ? (x(e) && r.set(e, null), null) : (m(a) ? a.forEach((e) => o[e] = null) : u(o, a), x(e) && r.set(e, o), o);
}
function Ri(e, t) {
	return !e || !c(t) ? !1 : (t = t.slice(2), t = t === "Once" ? t : t.replace(/Once$/, ""), p(e, t[0].toLowerCase() + t.slice(1)) || p(e, re(t)) || p(e, t));
}
function zi(e) {
	let { type: t, vnode: n, proxy: r, withProxy: i, propsOptions: [a], slots: o, attrs: s, emit: c, render: u, renderCache: d, props: f, data: p, setupState: m, ctx: h, inheritAttrs: g } = e, _ = Jn(e), v, y;
	try {
		if (n.shapeFlag & 4) {
			let e = i || r, t = e;
			v = Ba(u.call(t, e, d, f, m, p, h)), y = s;
		} else {
			let e = t;
			v = Ba(e.length > 1 ? e(f, {
				attrs: s,
				slots: o,
				emit: c
			}) : e(f, null)), y = t.props ? s : Bi(s);
		}
	} catch (t) {
		Ea.length = 0, On(t, e, 1), v = U(wa);
	}
	let b = v;
	if (y && g !== !1) {
		let e = Object.keys(y), { shapeFlag: t } = b;
		e.length && t & 7 && (a && e.some(l) && (y = Vi(y, a)), b = Ra(b, y, !1, !0));
	}
	return n.dirs && (b = Ra(b, null, !1, !0), b.dirs = b.dirs ? b.dirs.concat(n.dirs) : n.dirs), n.transition && wr(lr(b.type) && Cr(b) || b, n.transition), v = b, Jn(_), v;
}
var Bi = (e) => {
	let t;
	for (let n in e) (n === "class" || n === "style" || c(n)) && ((t ||= {})[n] = e[n]);
	return t;
}, Vi = (e, t) => {
	let n = {};
	for (let r in e) l(r) && r.slice(9) in t || (n[r] = e[r]);
	return n;
};
function Hi(e, t, n) {
	let { props: r, children: i, component: a } = e, { props: o, children: s, patchFlag: c } = t, l = a.emitsOptions;
	if (t.dirs || t.transition) return !0;
	if (n && c >= 0) {
		if (c & 1024) return !0;
		if (c & 16) return r ? Ui(r, o, l) : !!o;
		if (c & 8) {
			let e = t.dynamicProps;
			for (let t = 0; t < e.length; t++) {
				let n = e[t];
				if (Wi(o, r, n) && !Ri(l, n)) return !0;
			}
		}
	} else return (i || s) && (!s || !s.$stable) ? !0 : r === o ? !1 : r ? !o || Ui(r, o, l) : !!o;
	return !1;
}
function Ui(e, t, n) {
	let r = Object.keys(t);
	if (r.length !== Object.keys(e).length) return !0;
	for (let i = 0; i < r.length; i++) {
		let a = r[i];
		if (Wi(t, e, a) && !Ri(n, a)) return !0;
	}
	return !1;
}
function Wi(e, t, n) {
	let r = e[n], i = t[n];
	return n === "style" && x(r) && x(i) ? !Ce(r, i) : r !== i;
}
function Gi({ vnode: e, parent: t, suspense: n }, r) {
	for (; t;) {
		let n = t.subTree;
		if (n.suspense && n.suspense.activeBranch === e && (n.suspense.vnode.el = n.el = r, e = n), n === e) (e = t.vnode).el = r, t = t.parent;
		else break;
	}
	n && n.activeBranch === e && (n.vnode.el = r);
}
var Ki = {}, qi = () => Object.create(Ki), Ji = (e) => Object.getPrototypeOf(e) === Ki;
function Yi(e, t, n, r = !1) {
	let i = {}, a = qi();
	e.propsDefaults = /* @__PURE__ */ Object.create(null), Zi(e, t, i, a);
	for (let t in e.propsOptions[0]) t in i || (i[t] = void 0);
	e.props = n ? r ? i : /* @__PURE__ */ Gt(i) : e.type.props ? i : a, e.attrs = a;
}
function Xi(e, t, n, r) {
	let { props: i, attrs: a, vnode: { patchFlag: o } } = e, s = /* @__PURE__ */ $t(i), [c] = e.propsOptions, l = !1;
	if ((r || o > 0) && !(o & 16)) {
		if (o & 8) {
			let n = e.vnode.dynamicProps;
			for (let r = 0; r < n.length; r++) {
				let o = n[r];
				if (Ri(e.emitsOptions, o)) continue;
				let u = t[o];
				if (c) {
					if (p(a, o)) u !== a[o] && (a[o] = u, l = !0);
					else {
						let t = k(o);
						i[t] = Qi(c, s, t, u, e, !1);
					}
				} else u !== a[o] && (a[o] = u, l = !0);
			}
		}
	} else {
		Zi(e, t, i, a) && (l = !0);
		let r;
		for (let a in s) t && (p(t, a) || (r = re(a)) !== a && p(t, r)) || (c ? n && (n[a] !== void 0 || n[r] !== void 0) && (i[a] = Qi(c, s, a, void 0, e, !0)) : delete i[a]);
		if (a !== s) for (let e in a) t && p(t, e) || (delete a[e], l = !0);
	}
	l && st(e.attrs, "set", "");
}
function Zi(e, t, n, r) {
	let [a, o] = e.propsOptions, s = !1, c;
	if (t) for (let i in t) {
		if (O(i)) continue;
		let l = t[i], u;
		a && p(a, u = k(i)) ? !o || !o.includes(u) ? n[u] = l : (c ||= {})[u] = l : Ri(e.emitsOptions, i) || i in r && l === r[i] || (r[i] = l, s = !0);
	}
	if (o) {
		let t = /* @__PURE__ */ $t(n), r = c || i;
		for (let i = 0; i < o.length; i++) {
			let s = o[i];
			n[s] = Qi(a, t, s, r[s], e, !p(r, s));
		}
	}
	return s;
}
function Qi(e, t, n, r, i, a) {
	let o = e[n];
	if (o != null) {
		let e = p(o, "default");
		if (e && r === void 0) {
			let e = o.default;
			if (o.type !== Function && !o.skipFactory && v(e)) {
				let { propsDefaults: a } = i;
				if (n in a) r = a[n];
				else {
					let o = Za(i);
					r = a[n] = e.call(null, t), o();
				}
			} else r = e;
			i.ce && i.ce._setProp(n, r);
		}
		o[0] && (a && !e ? r = !1 : o[1] && (r === "" || r === re(n)) && (r = !0));
	}
	return r;
}
var $i = /* @__PURE__ */ new WeakMap();
function ea(e, t, n = !1) {
	let r = n ? $i : t.propsCache, o = r.get(e);
	if (o) return o;
	let s = e.props, c = {}, l = [], d = !1;
	if (!v(e)) {
		let r = (e) => {
			d = !0;
			let [n, r] = ea(e, t, !0);
			u(c, n), r && l.push(...r);
		};
		!n && t.mixins.length && t.mixins.forEach(r), e.extends && r(e.extends), e.mixins && e.mixins.forEach(r);
	}
	if (!s && !d) return x(e) && r.set(e, a), a;
	if (m(s)) for (let e = 0; e < s.length; e++) {
		let t = k(s[e]);
		ta(t) && (c[t] = i);
	}
	else if (s) for (let e in s) {
		let t = k(e);
		if (ta(t)) {
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
function ta(e) {
	return e[0] !== "$" && !O(e);
}
var na = (e) => e === "_" || e === "_ctx" || e === "$stable", ra = (e) => m(e) ? e.map(Ba) : [Ba(e)], ia = (e, t, n) => {
	if (t._n) return t;
	let r = P((...e) => ra(t(...e)), n);
	return r._c = !1, r;
}, aa = (e, t, n) => {
	let r = e._ctx;
	for (let n in e) {
		if (na(n)) continue;
		let i = e[n];
		if (v(i)) t[n] = ia(n, i, r);
		else if (i != null) {
			let e = ra(i);
			t[n] = () => e;
		}
	}
}, oa = (e, t) => {
	let n = ra(t);
	e.slots.default = () => n;
}, sa = (e, t, n) => {
	for (let r in t) (n || !na(r)) && (e[r] = t[r]);
}, ca = (e, t, n) => {
	let r = e.slots = qi();
	if (e.vnode.shapeFlag & 32) {
		let e = t._;
		e ? (sa(r, t, n), n && ce(r, "_", e, !0)) : aa(t, r);
	} else t && oa(e, t);
}, la = (e, t, n) => {
	let { vnode: r, slots: a } = e, o = !0, s = i;
	if (r.shapeFlag & 32) {
		let e = t._;
		e ? n && e === 1 ? o = !1 : sa(a, t, n) : (o = !t.$stable, aa(t, a)), s = t;
	} else t && (oa(e, t), s = { default: 1 });
	if (o) for (let e in a) !na(e) && s[e] == null && delete a[e];
}, ua = Sa;
function da(e) {
	return fa(e);
}
function fa(e, t) {
	let n = de();
	n.__VUE__ = !0;
	let { insert: r, remove: s, patchProp: c, createElement: l, createText: u, createComment: d, setText: f, setElementText: p, parentNode: m, nextSibling: h, setScopeId: g = o, insertStaticContent: _ } = e, v = (e, t, n, r = null, i = null, a = null, o = void 0, s = null, c = !!t.dynamicChildren) => {
		if (e === t) return;
		e && !Na(e, t) && (r = ye(e), me(e, i, a, !0), e = null), t.patchFlag === -2 && (c = !1, t.dynamicChildren = null);
		let { type: l, ref: u, shapeFlag: d } = t;
		switch (l) {
			case Ca:
				y(e, t, n, r);
				break;
			case wa:
				b(e, t, n, r);
				break;
			case Ta:
				e ?? x(t, n, r, o);
				break;
			case R:
				ne(e, t, n, r, i, a, o, s, c);
				break;
			default: d & 1 ? w(e, t, n, r, i, a, o, s, c) : d & 6 ? re(e, t, n, r, i, a, o, s, c) : (d & 64 || d & 128) && l.process(e, t, n, r, i, a, o, s, c, Se);
		}
		u != null && i ? Ar(u, e && e.ref, a, t || e, !t) : u == null && e && e.ref != null && Ar(e.ref, null, a, e, !0);
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
				n && n._beginPatch(), ee(e, t, i, a, o, s, c);
			} finally {
				n && n._endPatch();
			}
		}
	}, T = (e, t, n, i, a, o, s, u) => {
		let d, f, { props: m, shapeFlag: h, transition: g, dirs: _ } = e;
		if (d = e.el = l(e.type, o, m && m.is, m), h & 8 ? p(d, e.children) : h & 16 && D(e.children, d, null, i, a, pa(e, o), s, u), _ && Xn(e, null, i, "created"), E(d, e, e.scopeId, s, i), m) {
			for (let e in m) e !== "value" && !O(e) && c(d, e, null, m[e], o, i);
			"value" in m && c(d, "value", null, m.value, o), (f = m.onVnodeBeforeMount) && Ua(f, i, e);
		}
		_ && Xn(e, null, i, "beforeMount");
		let v = ha(a, g);
		v && g.beforeEnter(d), r(d, t, n), ((f = m && m.onVnodeMounted) || v || _) && ua(() => {
			try {
				f && Ua(f, i, e), v && g.enter(d), _ && Xn(e, null, i, "mounted");
			} finally {}
		}, a);
	}, E = (e, t, n, r, i) => {
		if (n && g(e, n), r) for (let t = 0; t < r.length; t++) g(e, r[t]);
		if (i) {
			let n = i.subTree;
			if (t === n || xa(n.type) && (n.ssContent === t || n.ssFallback === t)) {
				let t = i.vnode;
				E(e, t, t.scopeId, t.slotScopeIds, i.parent);
			}
		}
	}, D = (e, t, n, r, i, a, o, s, c = 0) => {
		for (let l = c; l < e.length; l++) {
			let c = e[l] = s ? Va(e[l]) : Ba(e[l]);
			v(null, c, t, n, r, i, a, o, s);
		}
	}, ee = (e, t, n, r, a, o, s) => {
		let l = t.el = e.el, { patchFlag: u, dynamicChildren: d, dirs: f } = t;
		u |= e.patchFlag & 16;
		let m = e.props || i, h = t.props || i, g;
		if (n && ma(n, !1), (g = h.onVnodeBeforeUpdate) && Ua(g, n, t, e), f && Xn(t, e, n, "beforeUpdate"), n && ma(n, !0), d && (!e.dynamicChildren || e.dynamicChildren.length !== d.length) && (u = 0, s = !1, d = null), (m.innerHTML && h.innerHTML == null || m.textContent && h.textContent == null) && p(l, ""), d ? te(e.dynamicChildren, d, l, n, r, pa(t, a), o) : s || le(e, t, l, null, n, r, pa(t, a), o, !1), u > 0) {
			if (u & 16) k(l, m, h, n, a);
			else if (u & 2 && m.class !== h.class && c(l, "class", null, h.class, a), u & 4 && c(l, "style", m.style, h.style, a), u & 8) {
				let e = t.dynamicProps;
				for (let t = 0; t < e.length; t++) {
					let r = e[t], i = m[r], o = h[r];
					(o !== i || r === "value") && c(l, r, i, o, a, n);
				}
			}
			u & 1 && e.children !== t.children && p(l, t.children);
		} else !s && d == null && k(l, m, h, n, a);
		((g = h.onVnodeUpdated) || f) && ua(() => {
			g && Ua(g, n, t, e), f && Xn(t, e, n, "updated");
		}, r);
	}, te = (e, t, n, r, i, a, o) => {
		for (let s = 0; s < t.length; s++) {
			let c = e[s], l = t[s], u = c.el && (c.type === R || !Na(c, l) || c.shapeFlag & 198) ? m(c.el) : n;
			v(c, l, u, null, r, i, a, o, !0);
		}
	}, k = (e, t, n, r, a) => {
		if (t !== n) {
			if (t !== i) for (let i in t) !O(i) && !(i in n) && c(e, i, t[i], null, a, r);
			for (let i in n) {
				if (O(i)) continue;
				let o = n[i], s = t[i];
				o !== s && i !== "value" && c(e, i, s, o, a, r);
			}
			"value" in n && c(e, "value", t.value, n.value, a);
		}
	}, ne = (e, t, n, i, a, o, s, c, l) => {
		let d = t.el = e ? e.el : u(""), f = t.anchor = e ? e.anchor : u(""), { patchFlag: p, dynamicChildren: m, slotScopeIds: h } = t;
		h && (c = c ? c.concat(h) : h), e == null ? (r(d, n, i), r(f, n, i), D(t.children || [], n, f, a, o, s, c, l)) : p > 0 && p & 64 && m && e.dynamicChildren && e.dynamicChildren.length === m.length ? (te(e.dynamicChildren, m, n, a, o, s, c), (t.key != null || a && t === a.subTree) && ga(e, t, !0)) : le(e, t, n, f, a, o, s, c, l);
	}, re = (e, t, n, r, i, a, o, s, c) => {
		t.slotScopeIds = s, e == null ? t.shapeFlag & 512 ? i.ctx.activate(t, n, r, o, c) : ie(t, n, r, i, a, o, c) : ae(e, t, c);
	}, ie = (e, t, n, r, i, a, o) => {
		let s = e.component = Ka(e, r, i);
		if (Nr(e) && (s.ctx.renderer = Se), to(s, !1, o), s.asyncDep) {
			if (i && i.registerDep(s, oe, o), !e.el) {
				let r = s.subTree = U(wa);
				b(null, r, t, n), e.placeholder = r.el;
			}
		} else oe(s, e, t, n, i, a, o);
	}, ae = (e, t, n) => {
		let r = t.component = e.component;
		if (Hi(e, t, n)) {
			if (r.asyncDep && !r.asyncResolved) {
				ce(r, t, n);
				return;
			}
			r.next = t, r.update();
		} else t.el = e.el, r.vnode = t;
	}, oe = (e, t, n, r, i, a, o) => {
		let s = () => {
			if (e.isMounted) {
				let { next: t, bu: n, u: r, parent: s, vnode: c } = e;
				{
					let n = va(e);
					if (n) {
						t && (t.el = c.el, ce(e, t, o)), n.asyncDep.then(() => {
							ua(() => {
								e.isUnmounted || l();
							}, i);
						});
						return;
					}
				}
				let u = t, d;
				ma(e, !1), t ? (t.el = c.el, ce(e, t, o)) : t = c, n && se(n), (d = t.props && t.props.onVnodeBeforeUpdate) && Ua(d, s, t, c), ma(e, !0);
				let f = zi(e), p = e.subTree;
				e.subTree = f, v(p, f, m(p.el), ye(p), e, i, a), t.el = f.el, u === null && Gi(e, f.el), r && ua(r, i), (d = t.props && t.props.onVnodeUpdated) && ua(() => Ua(d, s, t, c), i);
			} else {
				let o, { el: s, props: c } = t, { bm: l, m: u, parent: d, root: f, type: p } = e, m = Mr(t);
				if (ma(e, !1), l && se(l), !m && (o = c && c.onVnodeBeforeMount) && Ua(o, d, t), ma(e, !0), s && we) {
					let t = () => {
						e.subTree = zi(e), we(s, e.subTree, e, i, null);
					};
					m && p.__asyncHydrate ? p.__asyncHydrate(s, e, t) : t();
				} else {
					f.ce && f.ce._hasShadowRoot() && f.ce._injectChildStyle(p, e.parent ? e.parent.type : void 0);
					let o = e.subTree = zi(e);
					v(null, o, n, r, e, i, a), t.el = o.el;
				}
				if (u && ua(u, i), !m && (o = c && c.onVnodeMounted)) {
					let e = t;
					ua(() => Ua(o, d, e), i);
				}
				(t.shapeFlag & 256 || d && Mr(d.vnode) && d.vnode.shapeFlag & 256) && e.a && ua(e.a, i), e.isMounted = !0, t = n = r = null;
			}
		};
		e.scope.on();
		let c = e.effect = new Pe(s);
		e.scope.off();
		let l = e.update = c.run.bind(c), u = e.job = c.runIfDirty.bind(c);
		u.i = e, u.id = e.uid, c.scheduler = () => zn(u), ma(e, !0), l();
	}, ce = (e, t, n) => {
		t.component = e;
		let r = e.vnode.props;
		e.vnode = t, e.next = null, Xi(e, t.props, r, n), la(e, t.children, n), Ye(), Hn(e), Xe();
	}, le = (e, t, n, r, i, a, o, s, c = !1) => {
		let l = e && e.children, u = e ? e.shapeFlag : 0, d = t.children, { patchFlag: f, shapeFlag: m } = t;
		if (f > 0) {
			if (f & 128) {
				fe(l, d, n, r, i, a, o, s, c);
				return;
			}
			if (f & 256) {
				ue(l, d, n, r, i, a, o, s, c);
				return;
			}
		}
		m & 8 ? (u & 16 && ve(l, i, a), d !== l && p(n, d)) : u & 16 ? m & 16 ? fe(l, d, n, r, i, a, o, s, c) : ve(l, i, a, !0) : (u & 8 && p(n, ""), m & 16 && D(d, n, r, i, a, o, s, c));
	}, ue = (e, t, n, r, i, o, s, c, l) => {
		e ||= a, t ||= a;
		let u = e.length, d = t.length, f = Math.min(u, d), p = 0;
		for (; p < f; p++) {
			let r = t[p] = l ? Va(t[p]) : Ba(t[p]);
			v(e[p], r, n, null, i, o, s, c, l);
		}
		u > d ? ve(e, i, o, !0, !1, f) : D(t, n, r, i, o, s, c, l, f);
	}, fe = (e, t, n, r, i, o, s, c, l) => {
		let u = 0, d = t.length, f = e.length - 1, p = d - 1;
		for (; u <= f && u <= p;) {
			let r = e[u], a = t[u] = l ? Va(t[u]) : Ba(t[u]);
			if (Na(r, a)) v(r, a, n, null, i, o, s, c, l);
			else break;
			u++;
		}
		for (; u <= f && u <= p;) {
			let r = e[f], a = t[p] = l ? Va(t[p]) : Ba(t[p]);
			if (Na(r, a)) v(r, a, n, null, i, o, s, c, l);
			else break;
			f--, p--;
		}
		if (u > f) {
			if (u <= p) {
				let e = p + 1, a = e < d ? t[e].el : r;
				for (; u <= p;) v(null, t[u] = l ? Va(t[u]) : Ba(t[u]), n, a, i, o, s, c, l), u++;
			}
		} else if (u > p) for (; u <= f;) me(e[u], i, o, !0), u++;
		else {
			let m = u, h = u, g = /* @__PURE__ */ new Map();
			for (u = h; u <= p; u++) {
				let e = t[u] = l ? Va(t[u]) : Ba(t[u]);
				e.key != null && g.set(e.key, u);
			}
			let _, y = 0, b = p - h + 1, x = !1, S = 0, C = Array(b);
			for (u = 0; u < b; u++) C[u] = 0;
			for (u = m; u <= f; u++) {
				let r = e[u];
				if (y >= b) {
					me(r, i, o, !0);
					continue;
				}
				let a;
				if (r.key != null) a = g.get(r.key);
				else for (_ = h; _ <= p; _++) if (C[_ - h] === 0 && Na(r, t[_])) {
					a = _;
					break;
				}
				a === void 0 ? me(r, i, o, !0) : (C[a - h] = u + 1, a >= S ? S = a : x = !0, v(r, t[a], n, null, i, o, s, c, l), y++);
			}
			let w = x ? _a(C) : a;
			for (_ = w.length - 1, u = b - 1; u >= 0; u--) {
				let e = h + u, a = t[e], f = t[e + 1], p = e + 1 < d ? f.el || ba(f) : r;
				C[u] === 0 ? v(null, a, n, p, i, o, s, c, l) : x && (_ < 0 || u !== w[_] ? pe(a, n, p, 2) : _--);
			}
		}
	}, pe = (e, t, n, i, a = null) => {
		let { el: o, type: c, transition: l, children: u, shapeFlag: d } = e;
		if (d & 6) pe(e.component.subTree, t, n, i);
		else if (d & 128) e.suspense.move(t, n, i);
		else if (d & 64) c.move(e, t, n, Se);
		else if (c === R) {
			r(o, t, n);
			for (let e = 0; e < u.length; e++) pe(u[e], t, n, i);
			r(e.anchor, t, n);
		} else if (c === Ta) S(e, t, n);
		else if (i !== 2 && d & 1 && l) {
			if (i === 0) l.persisted && !o[xr] ? r(o, t, n) : (l.beforeEnter(o), r(o, t, n), ua(() => l.enter(o), a));
			else {
				let { leave: i, delayLeave: a, afterLeave: c } = l, u = () => {
					e.ctx.isUnmounted ? s(o) : r(o, t, n);
				}, d = () => {
					let e = o._isLeaving || !!o[xr];
					o._isLeaving && o[xr](!0), l.persisted && !e ? u() : i(o, () => {
						u(), c && c();
					});
				};
				a ? a(o, u, d) : d();
			}
		} else r(o, t, n);
	}, me = (e, t, n, r = !1, i = !1) => {
		let { type: a, props: o, ref: s, children: c, dynamicChildren: l, shapeFlag: u, patchFlag: d, dirs: f, cacheIndex: p, memo: m } = e;
		if (d === -2 && (i = !1), s != null && (Ye(), Ar(s, null, n, e, !0), Xe()), p != null && (t.renderCache[p] = void 0), u & 256) {
			t.ctx.deactivate(e);
			return;
		}
		let h = u & 1 && f, g = !Mr(e), _;
		if (g && (_ = o && o.onVnodeBeforeUnmount) && Ua(_, t, e), u & 6) _e(e.component, n, r);
		else {
			if (u & 128) {
				e.suspense.unmount(n, r);
				return;
			}
			h && Xn(e, null, t, "beforeUnmount"), u & 64 ? e.type.remove(e, t, n, Se, r) : l && !l.hasOnce && (a !== R || d > 0 && d & 64) ? ve(l, t, n, !1, !0) : (a === R && d & 384 || !i && u & 16) && ve(c, t, n), r && he(e);
		}
		let v = m != null && p == null;
		(g && (_ = o && o.onVnodeUnmounted) || h || v) && ua(() => {
			_ && Ua(_, t, e), h && Xn(e, null, t, "unmounted"), v && (e.el = null);
		}, n);
	}, he = (e) => {
		let { type: t, el: n, anchor: r, transition: i } = e;
		if (t === R) {
			ge(n, r);
			return;
		}
		if (t === Ta) {
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
	}, ge = (e, t) => {
		let n;
		for (; e !== t;) n = h(e), s(e), e = n;
		s(t);
	}, _e = (e, t, n) => {
		let { bum: r, scope: i, job: a, subTree: o, um: s, m: c, a: l } = e;
		ya(c), ya(l), r && se(r), i.stop(), a && (a.flags |= 8, me(o, e, t, n)), s && ua(s, t), ua(() => {
			e.isUnmounted = !0;
		}, t);
	}, ve = (e, t, n, r = !1, i = !1, a = 0) => {
		for (let o = a; o < e.length; o++) me(e[o], t, n, r, i);
	}, ye = (e) => {
		if (e.shapeFlag & 6) return ye(e.component.subTree);
		if (e.shapeFlag & 128) return e.suspense.next();
		let t = h(e.anchor || e.el), n = t && t[cr];
		return n ? h(n) : t;
	}, be = !1, xe = (e, t, n) => {
		let r;
		e == null ? t._vnode && (me(t._vnode, null, null, !0), r = t._vnode.component) : v(t._vnode || null, e, t, null, null, null, n), t._vnode = e, be ||= (be = !0, Hn(r), Un(), !1);
	}, Se = {
		p: v,
		um: me,
		m: pe,
		r: he,
		mt: ie,
		mc: D,
		pc: le,
		pbc: te,
		n: ye,
		o: e
	}, Ce, we;
	return t && ([Ce, we] = t(Se)), {
		render: xe,
		hydrate: Ce,
		createApp: ji(xe, Ce)
	};
}
function pa({ type: e, props: t }, n) {
	return n === "svg" && e === "foreignObject" || n === "mathml" && e === "annotation-xml" && t && t.encoding && t.encoding.includes("html") ? void 0 : n;
}
function ma({ effect: e, job: t }, n) {
	n ? (e.flags |= 32, t.flags |= 4) : (e.flags &= -33, t.flags &= -5);
}
function ha(e, t) {
	return (!e || e && !e.pendingBranch) && t && !t.persisted;
}
function ga(e, t, n = !1) {
	let r = e.children, i = t.children;
	if (m(r) && m(i)) for (let e = 0; e < r.length; e++) {
		let t = r[e], a = i[e];
		a.shapeFlag & 1 && !a.dynamicChildren && ((a.patchFlag <= 0 || a.patchFlag === 32) && (a = i[e] = Va(i[e]), a.el = t.el), !n && a.patchFlag !== -2 && ga(t, a)), a.type === Ca && (a.patchFlag === -1 && (a = i[e] = Va(a)), a.el = t.el), a.type === wa && !a.el && (a.el = t.el);
	}
}
function _a(e) {
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
function va(e) {
	let t = e.subTree.component;
	if (t) return t.asyncDep && !t.asyncResolved ? t : va(t);
}
function ya(e) {
	if (e) for (let t = 0; t < e.length; t++) e[t].flags |= 8;
}
function ba(e) {
	if (e.placeholder) return e.placeholder;
	let t = e.component;
	return t ? ba(t.subTree) : null;
}
var xa = (e) => e.__isSuspense;
function Sa(e, t) {
	t && t.pendingBranch ? m(e) ? t.effects.push(...e) : t.effects.push(e) : Vn(e);
}
var R = /* @__PURE__ */ Symbol.for("v-fgt"), Ca = /* @__PURE__ */ Symbol.for("v-txt"), wa = /* @__PURE__ */ Symbol.for("v-cmt"), Ta = /* @__PURE__ */ Symbol.for("v-stc"), Ea = [], Da = null;
function z(e = !1) {
	Ea.push(Da = e ? null : []);
}
function Oa() {
	Ea.pop(), Da = Ea[Ea.length - 1] || null;
}
var ka = 1;
function Aa(e, t = !1) {
	ka += e, e < 0 && Da && t && (Da.hasOnce = !0);
}
function ja(e) {
	return e.dynamicChildren = ka > 0 ? Da || a : null, Oa(), ka > 0 && Da && Da.push(e), e;
}
function B(e, t, n, r, i, a) {
	return ja(H(e, t, n, r, i, a, !0));
}
function V(e, t, n, r, i) {
	return ja(U(e, t, n, r, i, !0));
}
function Ma(e) {
	return e ? e.__v_isVNode === !0 : !1;
}
function Na(e, t) {
	return e.type === t.type && e.key === t.key;
}
var Pa = ({ key: e }) => e ?? null, Fa = ({ ref: e, ref_key: t, ref_for: n }) => (typeof e == "number" && (e = "" + e), e == null ? null : y(e) || /* @__PURE__ */ rn(e) || v(e) ? {
	i: Kn,
	r: e,
	k: t,
	f: !!n
} : e);
function H(e, t = null, n = null, r = 0, i = null, a = e === R ? 0 : 1, o = !1, s = !1) {
	let c = {
		__v_isVNode: !0,
		__v_skip: !0,
		type: e,
		props: t,
		key: t && Pa(t),
		ref: t && Fa(t),
		scopeId: qn,
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
		ctx: Kn
	};
	return s ? (Ha(c, n), a & 128 && e.normalize(c)) : n && (c.shapeFlag |= y(n) ? 8 : 16), ka > 0 && !o && Da && (c.patchFlag > 0 || a & 6) && c.patchFlag !== 32 && Da.push(c), c;
}
var U = Ia;
function Ia(e, t = null, n = null, r = 0, i = null, a = !1) {
	if (e && e !== Zr || (e = wa), Ma(e)) {
		let r = Ra(e, t, !0);
		return n && Ha(r, n), ka > 0 && !a && Da && (r.shapeFlag & 6 ? Da[Da.indexOf(e)] = r : Da.push(r)), r.patchFlag = -2, r;
	}
	if (lo(e) && (e = e.__vccOpts), t) {
		t = La(t);
		let { class: e, style: n } = t;
		e && !y(e) && (t.class = _e(e)), x(n) && (/* @__PURE__ */ Qt(n) && !m(n) && (n = u({}, n)), t.style = fe(n));
	}
	let o = y(e) ? 1 : xa(e) ? 128 : lr(e) ? 64 : x(e) ? 4 : v(e) ? 2 : 0;
	return H(e, t, n, r, i, o, a, !0);
}
function La(e) {
	return e ? /* @__PURE__ */ Qt(e) || Ji(e) ? u({}, e) : e : null;
}
function Ra(e, t, n = !1, r = !1) {
	let { props: i, ref: a, patchFlag: o, children: s, transition: c } = e, l = t ? G(i || {}, t) : i, u = {
		__v_isVNode: !0,
		__v_skip: !0,
		type: e.type,
		props: l,
		key: l && Pa(l),
		ref: t && t.ref ? n && a ? m(a) ? a.concat(Fa(t)) : [a, Fa(t)] : Fa(t) : a,
		scopeId: e.scopeId,
		slotScopeIds: e.slotScopeIds,
		children: s,
		target: e.target,
		targetStart: e.targetStart,
		targetAnchor: e.targetAnchor,
		staticCount: e.staticCount,
		shapeFlag: e.shapeFlag,
		patchFlag: t && e.type !== R ? o === -1 ? 16 : o | 16 : o,
		dynamicProps: e.dynamicProps,
		dynamicChildren: e.dynamicChildren,
		appContext: e.appContext,
		dirs: e.dirs,
		transition: c,
		component: e.component,
		suspense: e.suspense,
		ssContent: e.ssContent && Ra(e.ssContent),
		ssFallback: e.ssFallback && Ra(e.ssFallback),
		placeholder: e.placeholder,
		el: e.el,
		anchor: e.anchor,
		ctx: e.ctx,
		ce: e.ce
	};
	return c && r && wr(u, c.clone(u)), u;
}
function W(e = " ", t = 0) {
	return U(Ca, null, e, t);
}
function za(e = "", t = !1) {
	return t ? (z(), V(wa, null, e)) : U(wa, null, e);
}
function Ba(e) {
	return e == null || typeof e == "boolean" ? U(wa) : m(e) ? U(R, null, e.slice()) : Ma(e) ? Va(e) : U(Ca, null, String(e));
}
function Va(e) {
	return e.el === null && e.patchFlag !== -1 || e.memo ? e : Ra(e);
}
function Ha(e, t) {
	let n = 0, { shapeFlag: r } = e;
	if (t == null) t = null;
	else if (m(t)) n = 16;
	else if (typeof t == "object") {
		if (r & 65) {
			let n = t.default;
			n && (n._c && (n._d = !1), Ha(e, n()), n._c && (n._d = !0));
			return;
		}
		{
			n = 32;
			let r = t._;
			!r && !Ji(t) ? t._ctx = Kn : r === 3 && Kn && (Kn.slots._ === 1 ? t._ = 1 : (t._ = 2, e.patchFlag |= 1024));
		}
	} else if (v(t)) {
		if (r & 65) {
			Ha(e, { default: t });
			return;
		}
		t = {
			default: t,
			_ctx: Kn
		}, n = 32;
	} else t = String(t), r & 64 ? (n = 16, t = [W(t)]) : n = 8;
	e.children = t, e.shapeFlag |= n;
}
function G(...e) {
	let t = {};
	for (let n = 0; n < e.length; n++) {
		let r = e[n];
		for (let e in r) if (e === "class") t.class !== r.class && (t.class = _e([t.class, r.class]));
		else if (e === "style") t.style = fe([t.style, r.style]);
		else if (c(e)) {
			let n = t[e], i = r[e];
			i && n !== i && !(m(n) && n.includes(i)) ? t[e] = n ? [].concat(n, i) : i : i == null && n == null && !l(e) && (t[e] = i);
		} else e !== "" && (t[e] = r[e]);
	}
	return t;
}
function Ua(e, t, n, r = null) {
	Dn(e, t, 7, [n, r]);
}
var Wa = ki(), Ga = 0;
function Ka(e, t, n) {
	let r = e.type, a = (t ? t.appContext : e.appContext) || Wa, o = {
		uid: Ga++,
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
		scope: new Oe(!0),
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
		propsOptions: ea(r, a),
		emitsOptions: Li(r, a),
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
	return o.ctx = { _: o }, o.root = t ? t.root : o, o.emit = Fi.bind(null, o), e.ce && e.ce(o), o;
}
var qa = null, Ja = () => qa || Kn, Ya, Xa;
{
	let e = de(), t = (t, n) => {
		let r;
		return (r = e[t]) || (r = e[t] = []), r.push(n), (e) => {
			r.length > 1 ? r.forEach((t) => t(e)) : r[0](e);
		};
	};
	Ya = t("__VUE_INSTANCE_SETTERS__", (e) => qa = e), Xa = t("__VUE_SSR_SETTERS__", (e) => eo = e);
}
var Za = (e) => {
	let t = qa;
	return Ya(e), e.scope.on(), () => {
		e.scope.off(), Ya(t);
	};
}, Qa = () => {
	qa && qa.scope.off(), Ya(null);
};
function $a(e) {
	return e.vnode.shapeFlag & 4;
}
var eo = !1;
function to(e, t = !1, n = !1) {
	t && Xa(t);
	let { props: r, children: i } = e.vnode, a = $a(e);
	Yi(e, r, a, t), ca(e, i, n || t);
	let o = a ? no(e, t) : void 0;
	return t && Xa(!1), o;
}
function no(e, t) {
	let n = e.type;
	e.accessCache = /* @__PURE__ */ Object.create(null), e.proxy = new Proxy(e.ctx, ci);
	let { setup: r } = n;
	if (r) {
		Ye();
		let n = e.setupContext = r.length > 1 ? oo(e) : null, i = Za(e), a = En(r, e, 0, [e.props, n]), o = S(a);
		if (Xe(), i(), (o || e.sp) && !Mr(e) && Er(e), o) {
			if (a.then(Qa, Qa), t) return a.then((n) => {
				Xa(!0);
				try {
					ro(e, n, t);
				} finally {
					Xa(!1);
				}
			}).catch((t) => {
				On(t, e, 0);
			});
			e.asyncDep = a;
		} else ro(e, a, t);
	} else io(e, t);
}
function ro(e, t, n) {
	v(t) ? e.type.__ssrInlineRender ? e.ssrRender = t : e.render = t : x(t) && (e.setupState = un(t)), io(e, n);
}
function io(e, t, n) {
	let r = e.type;
	e.render ||= r.render || o;
	{
		let t = Za(e);
		Ye();
		try {
			hi(e);
		} finally {
			Xe(), t();
		}
	}
}
var ao = { get(e, t) {
	return ot(e, "get", ""), e[t];
} };
function oo(e) {
	return {
		attrs: new Proxy(e.attrs, ao),
		slots: e.slots,
		emit: e.emit,
		expose: (t) => {
			e.exposed = t || {};
		}
	};
}
function so(e) {
	return e.exposed ? e.exposeProxy ||= new Proxy(un(en(e.exposed)), {
		get(t, n) {
			if (n in t) return t[n];
			if (n in oi) return oi[n](e);
		},
		has(e, t) {
			return t in e || t in oi;
		}
	}) : e.proxy;
}
function co(e, t = !0) {
	return v(e) ? e.displayName || e.name : e.name || t && e.__name;
}
function lo(e) {
	return v(e) && "__vccOpts" in e;
}
var K = (e, t) => /* @__PURE__ */ yn(e, t, eo);
function uo(e, t, n) {
	try {
		Aa(-1);
		let r = arguments.length;
		return r === 2 ? x(t) && !m(t) ? Ma(t) ? U(e, null, [t]) : U(e, t) : U(e, null, t) : (r > 3 ? n = Array.prototype.slice.call(arguments, 2) : r === 3 && Ma(n) && (n = [n]), U(e, t, n));
	} finally {
		Aa(1);
	}
}
function fo(e, t, n, r) {
	let i = n[r];
	if (i && po(i, e)) return i;
	let a = t();
	return a.memo = e.slice(), a.cacheIndex = r, n[r] = a;
}
function po(e, t) {
	let n = e.memo;
	if (n.length != t.length) return !1;
	for (let e = 0; e < n.length; e++) if (oe(n[e], t[e])) return !1;
	return ka > 0 && Da && Da.push(e), !0;
}
var mo = "3.5.42", ho = void 0, go = typeof window < "u" && window.trustedTypes;
if (go) try {
	ho = /* @__PURE__ */ go.createPolicy("vue", { createHTML: (e) => e });
} catch {}
var _o = ho ? (e) => ho.createHTML(e) : (e) => e, vo = "http://www.w3.org/2000/svg", yo = "http://www.w3.org/1998/Math/MathML", bo = typeof document < "u" ? document : null, xo = bo && /* @__PURE__ */ bo.createElement("template"), So = {
	insert: (e, t, n) => {
		t.insertBefore(e, n || null);
	},
	remove: (e) => {
		let t = e.parentNode;
		t && t.removeChild(e);
	},
	createElement: (e, t, n, r) => {
		let i = t === "svg" ? bo.createElementNS(vo, e) : t === "mathml" ? bo.createElementNS(yo, e) : n ? bo.createElement(e, { is: n }) : bo.createElement(e);
		return e === "select" && r && r.multiple != null && i.setAttribute("multiple", r.multiple), i;
	},
	createText: (e) => bo.createTextNode(e),
	createComment: (e) => bo.createComment(e),
	setText: (e, t) => {
		e.nodeValue = t;
	},
	setElementText: (e, t) => {
		e.textContent = t;
	},
	parentNode: (e) => e.parentNode,
	nextSibling: (e) => e.nextSibling,
	querySelector: (e) => bo.querySelector(e),
	setScopeId(e, t) {
		e.setAttribute(t, "");
	},
	insertStaticContent(e, t, n, r, i, a) {
		let o = n ? n.previousSibling : t.lastChild;
		if (i && (i === a || i.nextSibling)) for (; t.insertBefore(i.cloneNode(!0), n), i !== a && (i = i.nextSibling););
		else {
			xo.innerHTML = _o(r === "svg" ? `<svg>${e}</svg>` : r === "mathml" ? `<math>${e}</math>` : e);
			let i = xo.content;
			if (r === "svg" || r === "mathml") {
				let e = i.firstChild;
				for (; e.firstChild;) i.appendChild(e.firstChild);
				i.removeChild(e);
			}
			t.insertBefore(i, n);
		}
		return [o ? o.nextSibling : t.firstChild, n ? n.previousSibling : t.lastChild];
	}
}, Co = /* @__PURE__ */ Symbol("_vtc");
function wo(e, t, n) {
	let r = e[Co];
	r && (t = (t ? [t, ...r] : [...r]).join(" ")), t == null ? e.removeAttribute("class") : n ? e.setAttribute("class", t) : e.className = t;
}
var To = /* @__PURE__ */ Symbol("_vod"), Eo = /* @__PURE__ */ Symbol("_vsh"), Do = {
	name: "show",
	beforeMount(e, { value: t }, { transition: n }) {
		e[To] = e.style.display === "none" ? "" : e.style.display, n && t ? n.beforeEnter(e) : Oo(e, t);
	},
	mounted(e, { value: t }, { transition: n }) {
		n && t && n.enter(e);
	},
	updated(e, { value: t, oldValue: n }, { transition: r }) {
		!t != !n && (r ? t ? (r.beforeEnter(e), Oo(e, !0), r.enter(e)) : r.leave(e, () => {
			Oo(e, !1);
		}) : Oo(e, t));
	},
	beforeUnmount(e, { value: t }) {
		Oo(e, t);
	}
};
function Oo(e, t) {
	e.style.display = t ? e[To] : "none", e[Eo] = !t;
}
var ko = /* @__PURE__ */ Symbol(""), Ao = /(?:^|;)\s*display\s*:/;
function jo(e, t, n) {
	let r = e.style, i = y(n), a = !1;
	if (n && !i) {
		if (t) {
			if (y(t)) for (let e of t.split(";")) {
				let t = e.slice(0, e.indexOf(":")).trim();
				n[t] ?? No(r, t, "");
			}
			else for (let e in t) n[e] ?? No(r, e, "");
		}
		for (let i in n) {
			i === "display" && (a = !0);
			let o = n[i];
			o == null ? No(r, i, "") : Lo(e, i, !y(t) && t ? t[i] : void 0, o) || No(r, i, o);
		}
	} else if (i) {
		if (t !== n) {
			let e = r[ko];
			e && (n += ";" + e), r.cssText = n, a = Ao.test(n);
		}
	} else t && e.removeAttribute("style");
	To in e && (e[To] = a ? r.display : "", e[Eo] && (r.display = "none"));
}
var Mo = /\s*!important$/;
function No(e, t, n) {
	if (m(n)) n.forEach((n) => No(e, t, n));
	else if (n ??= "", t.startsWith("--")) Mo.test(n) ? e.setProperty(t, n.replace(Mo, ""), "important") : e.setProperty(t, n);
	else {
		let r = Io(e, t);
		Mo.test(n) ? e.setProperty(re(r), n.replace(Mo, ""), "important") : e[r] = n;
	}
}
var Po = [
	"Webkit",
	"Moz",
	"ms"
], Fo = {};
function Io(e, t) {
	let n = Fo[t];
	if (n) return n;
	let r = k(t);
	if (r !== "filter" && r in e) return Fo[t] = r;
	r = ie(r);
	for (let n = 0; n < Po.length; n++) {
		let i = Po[n] + r;
		if (i in e) return Fo[t] = i;
	}
	return t;
}
function Lo(e, t, n, r) {
	return e.tagName === "TEXTAREA" && (t === "width" || t === "height") && y(r) && n === r;
}
var Ro = "http://www.w3.org/1999/xlink";
function zo(e, t, n, r, i, a = ye(t)) {
	r && t.startsWith("xlink:") ? n == null ? e.removeAttributeNS(Ro, t.slice(6, t.length)) : e.setAttributeNS(Ro, t, n) : n == null || a && !be(n) ? e.removeAttribute(t) : e.setAttribute(t, a ? "" : b(n) ? String(n) : n);
}
function Bo(e, t, n, r, i) {
	if (t === "innerHTML" || t === "textContent") {
		n != null && (e[t] = t === "innerHTML" ? _o(n) : n);
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
		r === "boolean" ? n = be(n) : n == null && r === "string" ? (n = "", o = !0) : r === "number" && (n = 0, o = !0);
	}
	try {
		e[t] = n;
	} catch {}
	o && e.removeAttribute(i || t);
}
function Vo(e, t, n, r) {
	e.addEventListener(t, n, r);
}
function Ho(e, t, n, r) {
	e.removeEventListener(t, n, r);
}
var Uo = /* @__PURE__ */ Symbol("_vei");
function Wo(e, t, n, r, i = null) {
	let a = e[Uo] || (e[Uo] = {}), o = a[t];
	if (r && o) o.value = r;
	else {
		let [n, s] = qo(t);
		r ? Vo(e, n, a[t] = Zo(r, i), s) : o && (Ho(e, n, o, s), a[t] = void 0);
	}
}
var Go = /(Once|Passive|Capture)$/, Ko = /^on:?(?:Once|Passive|Capture)$/;
function qo(e) {
	let t, n;
	for (; (n = e.match(Go)) && !Ko.test(e);) t ||= {}, e = e.slice(0, e.length - n[1].length), t[n[1].toLowerCase()] = !0;
	return [e[2] === ":" ? e.slice(3) : re(e.slice(2)), t];
}
var Jo = 0, Yo = /* @__PURE__ */ Promise.resolve(), Xo = () => Jo ||= (Yo.then(() => Jo = 0), Date.now());
function Zo(e, t) {
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
				e && Dn(e, t, 5, a);
			}
		} else Dn(r, t, 5, [e]);
	};
	return n.value = e, n.attached = Xo(), n;
}
var Qo = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && e.charCodeAt(2) > 96 && e.charCodeAt(2) < 123, $o = (e, t, n, r, i, a) => {
	let o = i === "svg";
	t === "class" ? wo(e, r, o) : t === "style" ? jo(e, n, r) : c(t) ? l(t) || Wo(e, t, n, r, a) : (t[0] === "." ? (t = t.slice(1), 1) : t[0] === "^" ? (t = t.slice(1), 0) : es(e, t, r, o)) ? (Bo(e, t, r), e.tagName.includes("-") || t !== "value" && t !== "checked" && t !== "selected" || zo(e, t, r, o, a, t !== "value")) : e._isVueCE && (ts(e, t) || e._def.__asyncLoader && (/[A-Z]/.test(t) || !y(r))) ? Bo(e, k(t), r, a, t) : (t === "true-value" ? e._trueValue = r : t === "false-value" && (e._falseValue = r), zo(e, t, r, o));
};
function es(e, t, n, r) {
	if (r) return !!(t === "innerHTML" || t === "textContent" || t in e && Qo(t) && v(n));
	if (t === "spellcheck" || t === "draggable" || t === "translate" || t === "autocorrect" || t === "sandbox" && e.tagName === "IFRAME" || t === "form" || t === "list" && e.tagName === "INPUT" || t === "type" && e.tagName === "TEXTAREA") return !1;
	if (t === "width" || t === "height") {
		let t = e.tagName;
		if (t === "IMG" || t === "VIDEO" || t === "CANVAS" || t === "SOURCE") return !1;
	}
	return Qo(t) && y(n) ? !1 : t in e;
}
function ts(e, t) {
	let n = e._def.props;
	if (!n) return !1;
	let r = k(t);
	return Array.isArray(n) ? n.some((e) => k(e) === r) : Object.keys(n).some((e) => k(e) === r);
}
var ns = (e) => {
	let t = e.props["onUpdate:modelValue"] || !1;
	return m(t) ? (e) => se(t, e) : t;
};
function rs(e) {
	e.target.composing = !0;
}
function is(e) {
	let t = e.target;
	t.composing && (t.composing = !1, t.dispatchEvent(new Event("input")));
}
var as = /* @__PURE__ */ Symbol("_assign"), os = /* @__PURE__ */ Symbol("_initialValue");
function ss(e, t, n) {
	return t && (e = e.trim()), n && (e = le(e)), e;
}
var cs = {
	created(e, { modifiers: { lazy: t, trim: n, number: r } }, i) {
		e.parentNode && (e.type === "text" ? e[os] = e.defaultValue.replace(/[\r\n]/g, "") : e.type === "textarea" && (e[os] = e.defaultValue.replace(/\r\n?/g, "\n"))), e[as] = ns(i);
		let a = r || i.props && i.props.type === "number";
		Vo(e, t ? "change" : "input", (t) => {
			t.target.composing || e[as](ss(e.value, n, a));
		}), (n || a) && Vo(e, "change", () => {
			e.value = ss(e.value, n, a);
		}), t || (Vo(e, "compositionstart", rs), Vo(e, "compositionend", is), Vo(e, "change", is));
	},
	mounted(e, { value: t, modifiers: { trim: n, number: r } }) {
		let i = t ?? "", a = e[os];
		delete e[os], a !== void 0 && (e.type === "text" || e.type === "textarea") && e.value !== a ? e[as](ss(e.value, n, r)) : e.value = i;
	},
	beforeUpdate(e, { value: t, oldValue: n, modifiers: { lazy: r, trim: i, number: a } }, o) {
		if (e[as] = ns(o), e.composing) return;
		let s = (a || e.type === "number") && !/^0\d/.test(e.value) ? le(e.value) : e.value, c = t ?? "";
		if (s === c) return;
		let l = e.getRootNode();
		(l instanceof Document || l instanceof ShadowRoot) && l.activeElement === e && e.type !== "range" && (r && t === n || i && e.value.trim() === c) || (e.value = c);
	}
}, ls = [
	"ctrl",
	"shift",
	"alt",
	"meta"
], us = {
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
	exact: (e, t) => ls.some((n) => e[`${n}Key`] && !t.includes(n))
}, ds = (e, t) => {
	if (!e) return e;
	let n = e._withMods ||= {}, r = t.join(".");
	return n[r] || (n[r] = ((n, ...r) => {
		for (let e = 0; e < t.length; e++) {
			let r = us[t[e]];
			if (r && r(n, t)) return;
		}
		return e(n, ...r);
	}));
}, fs = {
	esc: "escape",
	space: " ",
	up: "arrow-up",
	left: "arrow-left",
	right: "arrow-right",
	down: "arrow-down",
	delete: "backspace"
}, ps = (e, t) => {
	let n = e._withKeys ||= {}, r = t.join(".");
	return n[r] || (n[r] = ((n) => {
		if (!("key" in n)) return;
		let r = re(n.key);
		if (t.some((e) => e === r || fs[e] === r)) return e(n);
	}));
}, ms = /* @__PURE__ */ u({ patchProp: $o }, So), hs;
function gs() {
	return hs ||= da(ms);
}
var _s = ((...e) => {
	let t = gs().createApp(...e), { mount: n } = t;
	return t.mount = (e) => {
		let r = ys(e);
		if (!r) return;
		let i = t._component;
		v(i) || i.render || i.template || (i.template = r.innerHTML), r.nodeType === 1 && (r.textContent = "");
		let a = n(r, !1, vs(r));
		return r instanceof Element && (r.removeAttribute("v-cloak"), r.setAttribute("data-v-app", "")), a;
	}, t;
});
function vs(e) {
	if (e instanceof SVGElement) return "svg";
	if (typeof MathMLElement == "function" && e instanceof MathMLElement) return "mathml";
}
function ys(e) {
	return y(e) ? document.querySelector(e) : e;
}
// node_modules/.pnpm/@intlify+shared@11.4.23/node_modules/@intlify/shared/dist/shared.mjs
var bs = typeof window < "u", xs = (e, t = !1) => t ? Symbol.for(e) : Symbol(e), Ss = (e, t, n) => Cs({
	l: e,
	k: t,
	s: n
}), Cs = (e) => JSON.stringify(e).replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029").replace(/\u0027/g, "\\u0027"), ws = (e) => typeof e == "number" && isFinite(e), Ts = (e) => Us(e) === "[object Date]", Es = (e) => Us(e) === "[object RegExp]", Ds = (e) => Ws(e) && Object.keys(e).length === 0, Os = Object.assign, ks = Object.create, As = (e = null) => ks(e), js, Ms = () => js ||= typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : As(), Ns = Object.prototype.hasOwnProperty;
function Ps(e, t) {
	return Ns.call(e, t);
}
function Fs(e, t) {
	let n = e[t];
	return Ps(e, t) ? n : void 0;
}
function Is(e) {
	return Ps(Object.prototype, e);
}
var Ls = Array.isArray, Rs = (e) => typeof e == "function", q = (e) => typeof e == "string", zs = (e) => typeof e == "boolean", Bs = (e) => typeof e == "object" && !!e, Vs = (e) => Bs(e) && Rs(e.then) && Rs(e.catch), Hs = Object.prototype.toString, Us = (e) => Hs.call(e), Ws = (e) => Us(e) === "[object Object]", Gs = (e) => e == null ? "" : Ls(e) || Ws(e) && e.toString === Hs ? JSON.stringify(e, null, 2) : String(e);
function Ks(e, t = "") {
	return e.reduce((e, n, r) => r === 0 ? e + n : e + t + n, "");
}
function qs(e, t) {
	typeof console < "u" && (console.warn("[intlify] " + e), t && console.warn(t.stack));
}
function Js(e) {
	return e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;").replace(/\//g, "&#x2F;").replace(/=/g, "&#x3D;");
}
function Ys(e) {
	return e.replace(/&(?![a-z0-9#]{2,6};)/gi, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&apos;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
var Xs = /^javascript:/i, Zs = /^(?:href|xlink:href|src|action|formaction)$/i, Qs = /&#(?:x([0-9a-f]+)|(\d+));?/gi, $s = /&(?:Tab|NewLine);/g, ec = /&colon;?/gi, tc = /[\u0000-\u0020\u007f-\u009f]/g, nc = /^on\w/i, rc = /^srcdoc$/i, ic = /^(?:base|animate|set|script|plaintext)$/i, ac = /^(?:iframe|noembed|noframes|noscript|style|textarea|title|xmp)$/i, oc = /<(\/?)([a-z][^\t\n\f\r />]*)/iy, sc = /([\t\n\f\r /]*)(?:(>)|([^\t\n\f\r />][^\t\n\f\r />=]*)(?:[\t\n\f\r ]*=[\t\n\f\r ]*(?:(["'])([\s\S]*?)(\4|$)|([^\t\n\f\r >]*)))?)/y, cc = /<!--(?:>|->|[\s\S]*?--!?>)/y;
function lc(e, t, n) {
	let r = t || n;
	if (!r) return e;
	let i = Number.parseInt(r, t ? 16 : 10);
	return i <= 127 ? String.fromCharCode(i) : e;
}
function uc(e) {
	let t = e.replace(Qs, lc).replace($s, "").replace(ec, ":").replace(tc, "");
	return Xs.test(t);
}
function dc(e) {
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
		n += e.slice(r, a), n += uc(d) ? "url(about:blank)" : e.slice(a, s + 1), r = s + 1;
	}
	return n + e.slice(r);
}
function fc(e, t) {
	return Zs.test(e) && uc(t) ? "about:blank" : Ys(e.toLowerCase() === "style" ? dc(t) : t);
}
function pc(e) {
	return e.replace(/</g, "&lt;");
}
function mc(e, t, n, r) {
	let i = e;
	if (nc.test(e) ? (r.eventHandler = !0, i = `&#111;n${e.slice(2)}`) : rc.test(e) && (r.srcdoc = !0, i = `&#115;${e.slice(1)}`), t === void 0) return i;
	let a = n || "";
	return `${i}=${a}${fc(e, t)}${a}`;
}
var hc = 0, gc = 1, _c = 2, vc = /^(?:area|base|basefont|bgsound|br|col|embed|frame|hr|image|img|input|keygen|link|meta|param|source|track|wbr|html|head|body|frameset)$/, yc = /^(?:b|big|blockquote|body|br|center|code|dd|div|dl|dt|em|embed|h[1-6]|head|hr|i|img|li|listing|menu|meta|nobr|ol|p|pre|ruby|s|small|span|strong|strike|sub|sup|table|tt|u|ul|var)$/, bc = /^(?:address|article|aside|blockquote|center|details|dialog|dir|div|dl|fieldset|figcaption|figure|footer|header|hgroup|main|menu|nav|ol|p|search|section|summary|ul|h[1-6]|pre|listing|form|li|dd|dt|plaintext|table|hr|xmp)$/, xc = /^(?:applet|caption|html|table|td|th|marquee|object|template|button)$/, Sc = /^(?:foreignobject|desc|title)$/, Cc = /^(?:foreignobject|desc|mi|mo|mn|ms|mtext|annotation-xml)$/, wc = /^(?:mi|mo|mn|ms|mtext)$/, Tc = /^(?:text\/html|application\/xhtml\+xml)$/i;
function Ec(e) {
	return e.replace(/[A-Z]+/g, (e) => e.toLowerCase());
}
function Dc(e, t) {
	return !!e && e.namespace !== hc && (!e.integration || wc.test(e.name) && (t === "mglyph" || t === "malignmark")) && (e.name !== "annotation-xml" || t !== "svg");
}
function Oc(e, t) {
	return yc.test(e) || e === "font" && (t.has("color") || t.has("face") || t.has("size"));
}
function kc(e, t, n) {
	let r = "";
	for (let i = e.length - 1; i >= t; i--) {
		let t = e[i];
		t.namespace === hc && t.name === "form" ? n[t.part] = pc(n[t.part]) : r += `</${t.name}>`;
	}
	return e.length = t, r;
}
function Ac(e, t) {
	let n = e.length;
	for (; n > 0 && e[n - 1].namespace !== hc && !e[n - 1].integration;) n--;
	return kc(e, n, t);
}
function jc(e, t, n, r, i) {
	let a = t.length + 1, o = "", s = e[e.length - 1];
	if (Dc(s, n)) {
		if (!Oc(n, r)) return i || e.push({
			name: n,
			namespace: s.namespace,
			integration: s.namespace === gc ? Sc.test(n) : wc.test(n) || n === "annotation-xml" && Tc.test((r.get("encoding") || "").replace(Qs, lc)),
			part: a
		}), o;
		o = Ac(e, t);
	}
	if (bc.test(n)) for (let n = e.length - 1; n >= 0; n--) {
		let r = e[n];
		if (r.namespace === hc ? xc.test(r.name) : r.integration) break;
		if (r.namespace === hc && r.name === "p") {
			o += kc(e, n, t);
			break;
		}
	}
	if (!Cc.test(n)) return n === "svg" || n === "math" ? i || e.push({
		name: n,
		namespace: n === "svg" ? gc : _c,
		integration: !1,
		part: a
	}) : vc.test(n) || e.push({
		name: n,
		namespace: hc,
		integration: !1,
		part: a
	}), o;
}
function Mc(e, t, n) {
	let r = "";
	(n === "p" || n === "br") && (r = Ac(e, t));
	let i = e.length - 1;
	for (; i >= 0 && e[i].namespace !== hc && e[i].name !== n;) i--;
	if (!(i >= 0 && e[i].namespace !== hc)) for (; i >= 0 && (e[i].namespace !== hc || e[i].name !== n);) i--;
	return i < 0 ? n === "br" || n === "p" ? r : void 0 : (r += kc(e, i + 1, t), e.length = i, r);
}
function Nc(e, t, n) {
	oc.lastIndex = t;
	let r = oc.exec(e);
	if (!r) return;
	let [, i, a] = r, o = r[0], s = /* @__PURE__ */ new Map(), c;
	for (sc.lastIndex = oc.lastIndex; c = sc.exec(e);) {
		let [r, l, u, d, f, p, m, h] = c;
		if (u) {
			let n = sc.lastIndex;
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
			let e = f ? p : h, t = Ec(d);
			s.has(t) || s.set(t, e || ""), o += l + mc(d, e, f, n);
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
function Pc(e, t, n) {
	for (let r = e.indexOf("</", t); r !== -1; r = e.indexOf("</", r + 2)) {
		let t = Nc(e, r, {});
		if (t && t[1].toLowerCase() === n.toLowerCase()) return t[2] === -1 ? -1 : r;
	}
	return -1;
}
function Fc(e) {
	let t = {}, n = [], r = [], i = 0, a;
	for (; (a = e.indexOf("<", i)) !== -1;) {
		n.push(e.slice(i, a)), i = a + 1;
		let o = Nc(e, a, t);
		if (o) {
			let [s, c, l, u, d] = o;
			if (l === -1) {
				t.unclosed = !0, n.push(pc(e.slice(a))), i = e.length;
				break;
			}
			if (i = l, s[1] === "/") {
				let e = Mc(r, n, Ec(c));
				e === void 0 ? t.closed = !0 : (e && (t.closed = !0), n.push(e + s));
			} else if (ic.test(c)) t.element = !0, n.push(pc(s));
			else {
				let a = "";
				if (ac.test(c)) {
					let r = Pc(e, l, c);
					if (r === -1) {
						t.unclosed = !0, n.push(pc(s));
						continue;
					}
					a = pc(e.slice(l, r)), i = r;
				}
				let o = jc(r, n, Ec(c), d, u);
				o === void 0 ? (t.closed = !0, n.push(pc(s) + a)) : n.push(o, s + a);
			}
		} else cc.lastIndex = a, cc.test(e) ? (n.push(e.slice(a, cc.lastIndex)), i = cc.lastIndex) : (e.startsWith("<!--", a) && (t.unclosed = !0), n.push("&lt;"));
	}
	n.push(e.slice(i));
	for (let e = r.length - 1; e >= 0; e--) {
		let i = r[e];
		t.closed = !0, i.namespace === hc && i.name === "form" ? n[i.part] = pc(n[i.part]) : n.push(`</${i.name}>`);
	}
	return n.join("");
}
var Ic = (e) => !Bs(e) || Ls(e);
function Lc(e, t) {
	if (Ic(e) || Ic(t) || t === Object.prototype) throw Error("Invalid value");
	let n = [{
		src: e,
		des: t
	}];
	for (; n.length;) {
		let { src: e, des: t } = n.pop();
		Object.keys(e).forEach((r) => {
			if (r === "__proto__") return;
			let i = e[r];
			if (Ls(i)) {
				let e = [];
				e.length = i.length, t[r] = e, n.push({
					src: i,
					des: e
				});
			} else Bs(i) ? ((!Bs(t[r]) || Ls(t[r])) && (t[r] = As()), n.push({
				src: i,
				des: t[r]
			})) : t[r] = i;
		});
	}
}
// node_modules/.pnpm/@intlify+message-compiler@11.4.23/node_modules/@intlify/message-compiler/dist/message-compiler.mjs
function Rc(e, t, n) {
	return {
		line: e,
		column: t,
		offset: n
	};
}
function zc(e, t, n) {
	let r = {
		start: e,
		end: t
	};
	return n != null && (r.source = n), r;
}
var J = {
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
J.EXPECTED_TOKEN, J.INVALID_TOKEN_IN_PLACEHOLDER, J.UNTERMINATED_SINGLE_QUOTE_IN_PLACEHOLDER, J.UNKNOWN_ESCAPE_SEQUENCE, J.INVALID_UNICODE_ESCAPE_SEQUENCE, J.UNBALANCED_CLOSING_BRACE, J.UNTERMINATED_CLOSING_BRACE, J.EMPTY_PLACEHOLDER, J.NOT_ALLOW_NEST_PLACEHOLDER, J.INVALID_LINKED_FORMAT, J.MUST_HAVE_MESSAGES_IN_PLURAL, J.UNEXPECTED_EMPTY_LINKED_MODIFIER, J.UNEXPECTED_EMPTY_LINKED_KEY, J.UNEXPECTED_LEXICAL_ANALYSIS, J.UNHANDLED_CODEGEN_NODE_TYPE, J.UNHANDLED_MINIFIER_NODE_TYPE;
function Bc(e, t, n = {}) {
	let { domain: r, messages: i, args: a } = n, o = SyntaxError(String(e));
	return o.code = e, t && (o.location = t), o.domain = r, o;
}
function Vc(e) {
	throw e;
}
var Hc = " ", Uc = "\r", Wc = "\n", Gc = "\u2028", Kc = "\u2029";
function qc(e) {
	let t = e, n = 0, r = 1, i = 1, a = 0, o = (e) => t[e] === Uc && t[e + 1] === Wc, s = (e) => t[e] === Wc, c = (e) => t[e] === Kc, l = (e) => t[e] === Gc, u = (e) => o(e) || s(e) || c(e) || l(e), d = () => n, f = () => r, p = () => i, m = () => a, h = (e) => o(e) || c(e) || l(e) ? Wc : t[e], g = () => h(n), _ = () => h(n + a);
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
var Jc = void 0, Yc = "	", Xc = "'", Zc = "tokenizer";
function Qc(e, t = {}) {
	let n = t.location !== !1, r = qc(e), i = () => r.index(), a = () => Rc(r.line(), r.column(), r.index()), o = a(), s = i(), c = {
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
			let r = Bc(e, n ? zc(a.startLoc, t) : null, {
				domain: Zc,
				args: i
			});
			u(r);
		}
	}
	function f(e, t, r) {
		e.endLoc = a(), e.currentType = t;
		let i = { type: t };
		return n && (i.loc = zc(e.startLoc, e.endLoc)), r != null && (i.value = r), i;
	}
	let p = (e) => f(e, 13);
	function m(e, t) {
		return e.currentChar() === t ? (e.next(), t) : (d(J.EXPECTED_TOKEN, a(), 0, t), "");
	}
	function h(e) {
		let t = "";
		for (; e.currentPeek() === Hc || e.currentPeek() === Wc;) t += e.currentPeek(), e.peek();
		return t;
	}
	function g(e) {
		let t = h(e);
		return e.skipToPeek(), t;
	}
	function _(e) {
		if (e === Jc) return !1;
		let t = e.charCodeAt(0);
		return t >= 97 && t <= 122 || t >= 65 && t <= 90 || t === 95;
	}
	function v(e) {
		if (e === Jc) return !1;
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
		let r = e.currentPeek() === Xc;
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
			return t === "{" ? _(e.peek()) : t === "@" || t === "|" || t === ":" || t === "." || t === Hc || !t ? !1 : t === Wc ? (e.peek(), r()) : D(e, !1);
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
			return i === "{" || i === "@" || !i ? t : i === "|" ? r !== Hc && r !== Wc : i === Hc ? (e.peek(), n(!0, Hc)) : i !== Wc || (e.peek(), n(!0, Wc));
		}, r = n();
		return t && e.resetPeek(), r;
	}
	function O(e, t) {
		let n = e.currentChar();
		if (n !== Jc) return t(n) ? (e.next(), n) : null;
	}
	function ee(e) {
		let t = e.charCodeAt(0);
		return t >= 97 && t <= 122 || t >= 65 && t <= 90 || t >= 48 && t <= 57 || t === 95 || t === 36;
	}
	function te(e) {
		return O(e, ee);
	}
	function k(e) {
		let t = e.charCodeAt(0);
		return t >= 97 && t <= 122 || t >= 65 && t <= 90 || t >= 48 && t <= 57 || t === 95 || t === 36 || t === 45;
	}
	function ne(e) {
		return O(e, k);
	}
	function re(e) {
		let t = e.charCodeAt(0);
		return t >= 48 && t <= 57;
	}
	function ie(e) {
		return O(e, re);
	}
	function ae(e) {
		let t = e.charCodeAt(0);
		return t >= 48 && t <= 57 || t >= 65 && t <= 70 || t >= 97 && t <= 102;
	}
	function oe(e) {
		return O(e, ae);
	}
	function se(e) {
		let t = "", n = "";
		for (; t = ie(e);) n += t;
		return n;
	}
	function ce(e) {
		let t = "";
		for (;;) {
			let n = e.currentChar();
			if (n === "\\") {
				let r = e.peek();
				r === "{" || r === "}" || r === "@" || r === "|" || r === "\\" ? (t += n + r, e.next(), e.next()) : (e.resetPeek(), t += n, e.next());
			} else if (n === "{" || n === "}" || n === "@" || n === "|" || !n) break;
			else if (n === Hc || n === Wc) {
				if (D(e)) t += n, e.next();
				else if (E(e)) break;
				else t += n, e.next();
			} else t += n, e.next();
		}
		return t;
	}
	function le(e) {
		g(e);
		let t = "", n = "";
		for (; t = ne(e);) n += t;
		let r = e.currentChar();
		if (r && r !== "}" && r !== Jc && r !== Hc && r !== Wc && r !== "　") {
			let t = ge(e);
			return d(J.INVALID_TOKEN_IN_PLACEHOLDER, a(), 0, n + t), n + t;
		}
		return e.currentChar() === Jc && d(J.UNTERMINATED_CLOSING_BRACE, a(), 0), n;
	}
	function ue(e) {
		g(e);
		let t = "";
		return e.currentChar() === "-" ? (e.next(), t += `-${se(e)}`) : t += se(e), e.currentChar() === Jc && d(J.UNTERMINATED_CLOSING_BRACE, a(), 0), t;
	}
	function de(e) {
		return e !== Xc && e !== Wc;
	}
	function fe(e) {
		g(e), m(e, "'");
		let t = "", n = "";
		for (; t = O(e, de);) n += t === "\\" ? pe(e) : t;
		let r = e.currentChar();
		return r === Wc || r === Jc ? (d(J.UNTERMINATED_SINGLE_QUOTE_IN_PLACEHOLDER, a(), 0), r === Wc && (e.next(), m(e, "'")), n) : (m(e, "'"), n);
	}
	function pe(e) {
		let t = e.currentChar();
		switch (t) {
			case "\\":
			case "'": return e.next(), `\\${t}`;
			case "u": return me(e, t, 4);
			case "U": return me(e, t, 6);
			default: return d(J.UNKNOWN_ESCAPE_SEQUENCE, a(), 0, t), "";
		}
	}
	function me(e, t, n) {
		m(e, t);
		let r = "";
		for (let i = 0; i < n; i++) {
			let n = oe(e);
			if (!n) {
				d(J.INVALID_UNICODE_ESCAPE_SEQUENCE, a(), 0, `\\${t}${r}${e.currentChar()}`);
				break;
			}
			r += n;
		}
		return `\\${t}${r}`;
	}
	function he(e) {
		return e !== "{" && e !== "}" && e !== Hc && e !== Wc;
	}
	function ge(e) {
		g(e);
		let t = "", n = "";
		for (; t = O(e, he);) n += t;
		return n;
	}
	function _e(e) {
		let t = "", n = "";
		for (; t = te(e);) n += t;
		return n;
	}
	function ve(e) {
		return e !== "{" && e !== "@" && e !== "|" && e !== "(" && e !== ")" && e !== Hc && e !== Yc && e !== Wc;
	}
	function ye(e) {
		for (; e.currentChar() === Yc;) e.next();
		let t = "", n;
		for (; (n = e.currentChar()) && ve(n);) t += n, e.next();
		return t;
	}
	function be(e) {
		g(e);
		let t = m(e, "|");
		return g(e), t;
	}
	function xe(e, t) {
		let n = null;
		switch (e.currentChar()) {
			case "{": return t.braceNest >= 1 && d(J.NOT_ALLOW_NEST_PLACEHOLDER, a(), 0), e.next(), n = f(t, 2, "{"), g(e), t.braceNest++, n;
			case "}": return t.braceNest > 0 && t.currentType === 2 && d(J.EMPTY_PLACEHOLDER, a(), 0), e.next(), n = f(t, 3, "}"), t.braceNest--, t.braceNest > 0 && g(e), t.inLinked && t.braceNest === 0 && (t.inLinked = !1), n;
			case "@": return t.braceNest > 0 && d(J.UNTERMINATED_CLOSING_BRACE, a(), 0), n = Se(e, t) || p(t), t.braceNest = 0, n;
			default: {
				let r = !0, i = !0, o = !0;
				if (E(e)) return t.braceNest > 0 && d(J.UNTERMINATED_CLOSING_BRACE, a(), 0), n = f(t, 1, be(e)), t.braceNest = 0, t.inLinked = !1, n;
				if (t.braceNest > 0 && (t.currentType === 4 || t.currentType === 5 || t.currentType === 6)) return d(J.UNTERMINATED_CLOSING_BRACE, a(), 0), t.braceNest = 0, Ce(e, t);
				if (r = y(e, t)) return n = f(t, 4, le(e)), g(e), n;
				if (i = b(e, t)) return n = f(t, 5, ue(e)), g(e), n;
				if (o = x(e, t)) return n = f(t, 6, fe(e)), g(e), n;
				if (!r && !i && !o) return n = f(t, 12, ge(e)), d(J.INVALID_TOKEN_IN_PLACEHOLDER, a(), 0, n.value), g(e), n;
				break;
			}
		}
		return n;
	}
	function Se(e, t) {
		let { currentType: n } = t, r = null, i = e.currentChar();
		switch (n !== 7 && n !== 8 && n !== 11 && n !== 9 || i !== Wc && i !== Hc || d(J.INVALID_LINKED_FORMAT, a(), 0), i) {
			case "@": return e.next(), r = f(t, 7, "@"), t.inLinked = !0, r;
			case ".": return g(e), e.next(), f(t, 8, ".");
			case ":": return g(e), e.next(), f(t, 9, ":");
			default: return E(e) ? (r = f(t, 1, be(e)), t.braceNest = 0, t.inLinked = !1, r) : S(e, t) || w(e, t) ? (g(e), Se(e, t)) : C(e, t) ? (g(e), f(t, 11, _e(e))) : T(e, t) ? (g(e), i === "{" ? xe(e, t) || r : f(t, 10, ye(e))) : (n === 7 && d(J.INVALID_LINKED_FORMAT, a(), 0), t.braceNest = 0, t.inLinked = !1, Ce(e, t));
		}
	}
	function Ce(e, t) {
		let n = { type: 13 };
		if (t.braceNest > 0) return xe(e, t) || p(t);
		if (t.inLinked) return Se(e, t) || p(t);
		switch (e.currentChar()) {
			case "{": return xe(e, t) || p(t);
			case "}": return d(J.UNBALANCED_CLOSING_BRACE, a(), 0), e.next(), f(t, 3, "}");
			case "@": return Se(e, t) || p(t);
			default:
				if (E(e)) return n = f(t, 1, be(e)), t.braceNest = 0, t.inLinked = !1, n;
				if (D(e)) return f(t, 0, ce(e));
		}
		return n;
	}
	function we() {
		let { currentType: e, offset: t, startLoc: n, endLoc: o } = c;
		return c.lastType = e, c.lastOffset = t, c.lastStartLoc = n, c.lastEndLoc = o, c.offset = i(), c.startLoc = a(), r.currentChar() === Jc ? f(c, 13) : Ce(r, c);
	}
	return {
		nextToken: we,
		currentOffset: i,
		currentPosition: a,
		context: l
	};
}
var $c = "parser", el = /(?:\\\\|\\'|\\u([0-9a-fA-F]{4})|\\U([0-9a-fA-F]{6}))/g, tl = /\\([\\@{}|])/g;
function nl(e, t) {
	return t;
}
function rl(e, t, n) {
	switch (e) {
		case "\\\\": return "\\";
		case "\\'": return "'";
		default: {
			let e = parseInt(t || n, 16);
			return e <= 55295 || e >= 57344 ? String.fromCodePoint(e) : "�";
		}
	}
}
function il(e = {}) {
	let t = e.location !== !1, { onError: n } = e;
	function r(e, r, i, a, ...o) {
		let s = e.currentPosition();
		if (s.offset += a, s.column += a, n) {
			let e = Bc(r, t ? zc(i, s) : null, {
				domain: $c,
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
		return r.value = t.replace(tl, nl), a(r, e.currentOffset(), e.currentPosition()), r;
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
		return o.value = t.replace(el, rl), e.nextToken(), a(o, e.currentOffset(), e.currentPosition()), o;
	}
	function u(e) {
		let t = e.nextToken(), n = e.context(), { lastOffset: o, lastStartLoc: s } = n, c = i(8, o, s);
		return t.type === 11 ? (t.value ?? r(e, J.UNEXPECTED_LEXICAL_ANALYSIS, n.lastStartLoc, 0, al(t)), c.value = t.value || "", a(c, e.currentOffset(), e.currentPosition()), { node: c }) : (r(e, J.UNEXPECTED_EMPTY_LINKED_MODIFIER, n.lastStartLoc, 0), c.value = "", a(c, o, s), {
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
		switch (o.type !== 9 && r(e, J.UNEXPECTED_LEXICAL_ANALYSIS, t.lastStartLoc, 0, al(o)), o = e.nextToken(), o.type === 2 && (o = e.nextToken()), o.type) {
			case 10:
				o.value ?? r(e, J.UNEXPECTED_LEXICAL_ANALYSIS, t.lastStartLoc, 0, al(o)), n.key = d(e, o.value || "");
				break;
			case 4:
				o.value ?? r(e, J.UNEXPECTED_LEXICAL_ANALYSIS, t.lastStartLoc, 0, al(o)), n.key = c(e, o.value || "");
				break;
			case 5:
				o.value ?? r(e, J.UNEXPECTED_LEXICAL_ANALYSIS, t.lastStartLoc, 0, al(o)), n.key = s(e, o.value || "");
				break;
			case 6:
				o.value ?? r(e, J.UNEXPECTED_LEXICAL_ANALYSIS, t.lastStartLoc, 0, al(o)), n.key = l(e, o.value || "");
				break;
			default: {
				r(e, J.UNEXPECTED_EMPTY_LINKED_KEY, t.lastStartLoc, 0);
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
					i.value ?? r(e, J.UNEXPECTED_LEXICAL_ANALYSIS, t.lastStartLoc, 0, al(i)), n.items.push(o(e, i.value || ""));
					break;
				case 5:
					i.value ?? r(e, J.UNEXPECTED_LEXICAL_ANALYSIS, t.lastStartLoc, 0, al(i)), n.items.push(s(e, i.value || ""));
					break;
				case 4:
					i.value ?? r(e, J.UNEXPECTED_LEXICAL_ANALYSIS, t.lastStartLoc, 0, al(i)), n.items.push(c(e, i.value || ""));
					break;
				case 6:
					i.value ?? r(e, J.UNEXPECTED_LEXICAL_ANALYSIS, t.lastStartLoc, 0, al(i)), n.items.push(l(e, i.value || ""));
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
		return c && r(e, J.MUST_HAVE_MESSAGES_IN_PLURAL, n, 0), a(l, e.currentOffset(), e.currentPosition()), l;
	}
	function h(e) {
		let t = e.context(), { offset: n, startLoc: r } = t, i = p(e);
		return t.currentType === 13 ? i : m(e, n, r, i);
	}
	function g(n) {
		let o = Qc(n, Os({}, e)), s = o.context(), c = i(0, s.offset, s.startLoc);
		return t && c.loc && (c.loc.source = n), c.body = h(o), e.onCacheKey && (c.cacheKey = e.onCacheKey(n)), s.currentType !== 13 && r(o, J.UNEXPECTED_LEXICAL_ANALYSIS, s.lastStartLoc, 0, n[s.offset] || ""), a(c, o.currentOffset(), o.currentPosition()), c;
	}
	return { parse: g };
}
function al(e) {
	if (e.type === 13) return "EOF";
	let t = (e.value || "").replace(/\r?\n/gu, "\\n");
	return t.length > 10 ? t.slice(0, 9) + "…" : t;
}
function ol(e, t = {}) {
	let n = {
		ast: e,
		helpers: /* @__PURE__ */ new Set()
	};
	return {
		context: () => n,
		helper: (e) => (n.helpers.add(e), e)
	};
}
function sl(e, t) {
	for (let n = 0; n < e.length; n++) cl(e[n], t);
}
function cl(e, t) {
	switch (e.type) {
		case 1:
			sl(e.cases, t), t.helper("plural");
			break;
		case 2:
			sl(e.items, t);
			break;
		case 6:
			cl(e.key, t), t.helper("linked"), t.helper("type");
			break;
		case 5:
			t.helper("interpolate"), t.helper("list");
			break;
		case 4: t.helper("interpolate"), t.helper("named");
	}
}
function ll(e, t = {}) {
	let n = ol(e);
	n.helper("normalize"), e.body && cl(e.body, n);
	let r = n.context();
	e.helpers = Array.from(r.helpers);
}
function ul(e) {
	let t = e.body;
	return t.type === 2 ? dl(t) : t.cases.forEach((e) => dl(e)), e;
}
function dl(e) {
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
			e.static = Ks(t);
			for (let t = 0; t < e.items.length; t++) {
				let n = e.items[t];
				(n.type === 3 || n.type === 9) && delete n.value;
			}
		}
	}
}
function fl(e) {
	switch (e.t = e.type, e.type) {
		case 0: {
			let t = e;
			fl(t.body), t.b = t.body, delete t.body;
			break;
		}
		case 1: {
			let t = e, n = t.cases;
			for (let e = 0; e < n.length; e++) fl(n[e]);
			t.c = n, delete t.cases;
			break;
		}
		case 2: {
			let t = e, n = t.items;
			for (let e = 0; e < n.length; e++) fl(n[e]);
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
			fl(t.key), t.k = t.key, delete t.key, t.modifier && (fl(t.modifier), t.m = t.modifier, delete t.modifier);
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
function pl(e, t) {
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
function ml(e, t) {
	let { helper: n } = e;
	e.push(`${n("linked")}(`), vl(e, t.key), t.modifier ? (e.push(", "), vl(e, t.modifier), e.push(", _type")) : e.push(", undefined, _type"), e.push(")");
}
function hl(e, t) {
	let { helper: n, needIndent: r } = e;
	e.push(`${n("normalize")}([`), e.indent(r());
	let i = t.items.length;
	for (let n = 0; n < i && (vl(e, t.items[n]), n !== i - 1); n++) e.push(", ");
	e.deindent(r()), e.push("])");
}
function gl(e, t) {
	let { helper: n, needIndent: r } = e;
	if (t.cases.length > 1) {
		e.push(`${n("plural")}([`), e.indent(r());
		let i = t.cases.length;
		for (let n = 0; n < i && (vl(e, t.cases[n]), n !== i - 1); n++) e.push(", ");
		e.deindent(r()), e.push("])");
	}
}
function _l(e, t) {
	t.body ? vl(e, t.body) : e.push("null");
}
function vl(e, t) {
	let { helper: n } = e;
	switch (t.type) {
		case 0:
			_l(e, t);
			break;
		case 1:
			gl(e, t);
			break;
		case 2:
			hl(e, t);
			break;
		case 6:
			ml(e, t);
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
var yl = (e, t = {}) => {
	let n = q(t.mode) ? t.mode : "normal", r = q(t.filename) ? t.filename : "message.intl";
	t.sourceMap;
	let i = t.breakLineCode == null ? n === "arrow" ? ";" : "\n" : t.breakLineCode, a = t.needIndent ? t.needIndent : n !== "arrow", o = e.helpers || [], s = pl(e, {
		filename: r,
		breakLineCode: i,
		needIndent: a
	});
	s.push(n === "normal" ? "function __msg__ (ctx) {" : "(ctx) => {"), s.indent(a), o.length > 0 && (s.push(`const { ${Ks(o.map((e) => `${e}: _${e}`), ", ")} } = ctx`), s.newline()), s.push("return "), vl(s, e), s.deindent(a), s.push("}"), delete e.helpers;
	let { code: c, map: l } = s.context();
	return {
		ast: e,
		code: c,
		map: l ? l.toJSON() : void 0
	};
};
function bl(e, t = {}) {
	let n = Os({}, t), r = !!n.jit, i = !!n.minify, a = n.optimize == null || n.optimize, o = il(n).parse(e);
	return r ? (a && ul(o), i && fl(o), {
		ast: o,
		code: ""
	}) : (ll(o, n), yl(o, n));
}
// node_modules/.pnpm/@intlify+core-base@11.4.23/node_modules/@intlify/core-base/dist/core-base.mjs
function xl() {
	typeof __INTLIFY_PROD_DEVTOOLS__ != "boolean" && (Ms().__INTLIFY_PROD_DEVTOOLS__ = !1), typeof __INTLIFY_DROP_MESSAGE_COMPILER__ != "boolean" && (Ms().__INTLIFY_DROP_MESSAGE_COMPILER__ = !1);
}
function Sl(e) {
	return Bs(e) && Ml(e) === 0 && (Ps(e, "b") || Ps(e, "body"));
}
var Cl = ["b", "body"];
function wl(e) {
	return zl(e, Cl);
}
var Tl = ["c", "cases"];
function El(e) {
	return zl(e, Tl, []);
}
var Dl = ["s", "static"];
function Ol(e) {
	return zl(e, Dl);
}
var kl = ["i", "items"];
function Al(e) {
	return zl(e, kl, []);
}
var jl = ["t", "type"];
function Ml(e) {
	return zl(e, jl);
}
var Nl = ["v", "value"];
function Pl(e, t) {
	let n = zl(e, Nl);
	if (n != null) return n;
	throw Vl(t);
}
var Fl = ["m", "modifier"];
function Il(e) {
	return zl(e, Fl);
}
var Ll = ["k", "key"];
function Rl(e) {
	let t = zl(e, Ll);
	if (t) return t;
	throw Vl(6);
}
function zl(e, t, n) {
	for (let n = 0; n < t.length; n++) {
		let r = t[n];
		if (Ps(e, r) && e[r] != null) return e[r];
	}
	return n;
}
var Bl = [
	...Cl,
	...Tl,
	...Dl,
	...kl,
	...Ll,
	...Fl,
	...Nl,
	...jl
];
function Vl(e) {
	return /* @__PURE__ */ Error(`unhandled node type: ${e}`);
}
function Hl(e) {
	return (t) => Ul(t, e);
}
function Ul(e, t) {
	let n = wl(t);
	if (n == null) throw Vl(0);
	if (Ml(n) === 1) {
		let t = El(n);
		return e.plural(t.reduce((t, n) => [...t, Wl(e, n)], []));
	}
	return Wl(e, n);
}
function Wl(e, t) {
	let n = Ol(t);
	if (n != null) return e.type === "text" ? n : e.normalize([n]);
	{
		let n = Al(t).reduce((t, n) => [...t, Gl(e, n)], []);
		return e.normalize(n);
	}
}
function Gl(e, t) {
	let n = Ml(t);
	switch (n) {
		case 3: return Pl(t, n);
		case 9: return Pl(t, n);
		case 4: {
			let r = t;
			if (Ps(r, "k") && r.k) return e.interpolate(e.named(r.k));
			if (Ps(r, "key") && r.key) return e.interpolate(e.named(r.key));
			throw Vl(n);
		}
		case 5: {
			let r = t;
			if (Ps(r, "i") && ws(r.i)) return e.interpolate(e.list(r.i));
			if (Ps(r, "index") && ws(r.index)) return e.interpolate(e.list(r.index));
			throw Vl(n);
		}
		case 6: {
			let n = t, r = Il(n), i = Rl(n);
			return e.linked(Gl(e, i), r ? Gl(e, r) : void 0, e.type);
		}
		case 7: return Pl(t, n);
		case 8: return Pl(t, n);
		default: throw Error(`unhandled node on format message part: ${n}`);
	}
}
var Kl = (e) => e, ql = As();
function Jl(e, t = {}) {
	let n = !1, r = t.onError || Vc;
	return t.onError = (e) => {
		n = !0, r(e);
	}, {
		...bl(e, t),
		detectError: n
	};
}
/* #__NO_SIDE_EFFECTS__ */
function Yl(e, t) {
	if (!__INTLIFY_DROP_MESSAGE_COMPILER__ && q(e)) {
		zs(t.warnHtmlMessage) && t.warnHtmlMessage;
		let n = (t.onCacheKey || Kl)(e), r = ql[n];
		if (r) return r;
		let { ast: i, detectError: a } = Jl(e, {
			...t,
			location: !1,
			jit: !0
		}), o = Hl(i);
		return a ? o : ql[n] = o;
	}
	{
		if (!Sl(e)) return (() => e);
		let t = e.cacheKey;
		return t ? ql[t] || (ql[t] = Hl(e)) : Hl(e);
	}
}
var Xl = null;
function Zl(e) {
	Xl = e;
}
function Ql(e, t, n) {
	Xl && Xl.emit("i18n:init", {
		timestamp: Date.now(),
		i18n: e,
		version: t,
		meta: n
	});
}
var $l = /* #__PURE__*/ eu("function:translate");
function eu(e) {
	return (t) => Xl && Xl.emit(e, t);
}
var tu = {
	INVALID_ARGUMENT: 17,
	INVALID_DATE_ARGUMENT: 18,
	INVALID_ISO_DATE_ARGUMENT: 19,
	NOT_SUPPORT_NON_STRING_MESSAGE: 20,
	NOT_SUPPORT_LOCALE_PROMISE_VALUE: 21,
	NOT_SUPPORT_LOCALE_ASYNC_FUNCTION: 22,
	NOT_SUPPORT_LOCALE_TYPE: 23
};
function nu(e) {
	return Bc(e, null, void 0);
}
tu.INVALID_ARGUMENT, tu.INVALID_DATE_ARGUMENT, tu.INVALID_ISO_DATE_ARGUMENT, tu.NOT_SUPPORT_NON_STRING_MESSAGE, tu.NOT_SUPPORT_LOCALE_PROMISE_VALUE, tu.NOT_SUPPORT_LOCALE_ASYNC_FUNCTION, tu.NOT_SUPPORT_LOCALE_TYPE;
function ru(e, t) {
	return t.locale == null ? au(e.locale) : au(t.locale);
}
var iu;
function au(e) {
	if (q(e)) return e;
	if (Rs(e)) {
		if (e.resolvedOnce && iu != null) return iu;
		if (e.constructor.name === "Function") {
			let t = e();
			if (Vs(t)) throw nu(tu.NOT_SUPPORT_LOCALE_PROMISE_VALUE);
			return iu = t;
		}
		throw nu(tu.NOT_SUPPORT_LOCALE_ASYNC_FUNCTION);
	}
	throw nu(tu.NOT_SUPPORT_LOCALE_TYPE);
}
function ou(e, t, n) {
	return [.../* @__PURE__ */ new Set([n, ...Ls(t) ? t : Bs(t) ? Object.keys(t).filter((e) => e !== "default") : q(t) ? [t] : [n]])];
}
function su(e, t, n) {
	let r = q(n) ? n : Cu, i = e, a;
	Bs(t) ? (i.__localeChainObjectCache ||= /* @__PURE__ */ new WeakMap(), a = i.__localeChainObjectCache.get(t), a || (a = /* @__PURE__ */ new Map(), i.__localeChainObjectCache.set(t, a))) : (i.__localeChainCache ||= /* @__PURE__ */ new Map(), a = i.__localeChainCache.get(t), a || (a = /* @__PURE__ */ new Map(), i.__localeChainCache.set(t, a)));
	let o = a.get(r);
	if (o) return o;
	let s = [], c = [n];
	for (; Ls(c);) c = cu(s, c, t);
	let l = Ls(t) || !Ws(t) ? t : t.default ? t.default : null;
	return c = q(l) ? [l] : l, Ls(c) && cu(s, c, !1), a.set(r, s), s;
}
function cu(e, t, n) {
	let r = !0;
	for (let i = 0; i < t.length && zs(r); i++) {
		let a = t[i];
		q(a) && (r = lu(e, t[i], n));
	}
	return r;
}
function lu(e, t, n) {
	let r, i = t.split("-");
	do
		r = uu(e, i.join("-"), n), i.splice(-1, 1);
	while (i.length && r === !0);
	return r;
}
function uu(e, t, n) {
	let r = !1;
	if (!e.includes(t) && (r = !0, t)) {
		r = t[t.length - 1] !== "!";
		let i = t.replace(/!/g, "");
		e.push(i), (Ls(n) || Ws(n)) && n[i] && (r = n[i]);
	}
	return r;
}
var du = [];
du[0] = {
	w: [0],
	i: [3, 0],
	"[": [4],
	o: [7]
}, du[1] = {
	w: [1],
	".": [2],
	"[": [4],
	o: [7]
}, du[2] = {
	w: [2],
	i: [3, 0],
	0: [3, 0]
}, du[3] = {
	i: [3, 0],
	0: [3, 0],
	w: [1, 1],
	".": [2, 1],
	"[": [4, 1],
	o: [7, 1]
}, du[4] = {
	"'": [5, 0],
	"\"": [6, 0],
	"[": [4, 2],
	"]": [1, 3],
	o: 8,
	l: [4, 0]
}, du[5] = {
	"'": [4, 0],
	o: 8,
	l: [5, 0]
}, du[6] = {
	"\"": [4, 0],
	o: 8,
	l: [6, 0]
};
var fu = /^\s?(?:true|false|-?[\d.]+|'[^']*'|"[^"]*")\s?$/;
function pu(e) {
	return fu.test(e);
}
function mu(e) {
	let t = e.charCodeAt(0);
	return t === e.charCodeAt(e.length - 1) && (t === 34 || t === 39) ? e.slice(1, -1) : e;
}
function hu(e) {
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
function gu(e) {
	let t = e.trim();
	return e.charAt(0) === "0" && isNaN(parseInt(e)) ? !1 : pu(t) ? mu(t) : "*" + t;
}
function _u(e) {
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
			if (i = 0, o === void 0 || (o = gu(o), o === !1)) return !1;
			f[1]();
		}
	};
	function p() {
		let t = e[n + 1];
		if (r === 5 && t === "'" || r === 6 && t === "\"") return n++, s = "\\" + t, f[0](), !0;
	}
	for (; r !== null;) if (n++, a = e[n], !(a === "\\" && p())) {
		if (c = hu(a), d = du[r], l = d[c] || d.l || 8, l === 8 || (r = l[0], l[1] !== void 0 && (u = f[l[1]], u && (s = a, u() === !1)))) return;
		if (r === 7) return t;
	}
}
var vu = /* @__PURE__ */ new Map();
function yu(e, t) {
	return Bs(e) ? Fs(e, t) : null;
}
function bu(e, t) {
	if (!Bs(e)) return null;
	let n = vu.get(t);
	if (n || (n = _u(t), n && vu.set(t, n)), !n) return null;
	let r = n.length, i = e, a = 0;
	for (; a < r;) {
		let e = n[a];
		if (Bl.includes(e) && Sl(i) || !Bs(i) || !Ps(i, e)) return null;
		let t = i[e];
		if (t === void 0 || Rs(i)) return null;
		i = t, a++;
	}
	return i;
}
var xu = {
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
xu.NOT_FOUND_KEY, xu.FALLBACK_TO_TRANSLATE, xu.CANNOT_FORMAT_NUMBER, xu.FALLBACK_TO_NUMBER_FORMAT, xu.CANNOT_FORMAT_DATE, xu.FALLBACK_TO_DATE_FORMAT, xu.EXPERIMENTAL_CUSTOM_MESSAGE_COMPILER, xu.INVALID_NUMBER_ARGUMENT, xu.INVALID_DATE_ARGUMENT;
var Su = "11.4.23", Cu = "en-US", wu = (e) => `${e.charAt(0).toLocaleUpperCase()}${e.substr(1)}`;
function Tu() {
	return {
		upper: (e, t) => t === "text" && q(e) ? e.toUpperCase() : t === "vnode" && Bs(e) && "__v_isVNode" in e ? e.children.toUpperCase() : e,
		lower: (e, t) => t === "text" && q(e) ? e.toLowerCase() : t === "vnode" && Bs(e) && "__v_isVNode" in e ? e.children.toLowerCase() : e,
		capitalize: (e, t) => t === "text" && q(e) ? wu(e) : t === "vnode" && Bs(e) && "__v_isVNode" in e ? wu(e.children) : e
	};
}
var Eu;
function Du(e) {
	Eu = e;
}
var Ou;
function ku(e) {
	Ou = e;
}
var Au;
function ju(e) {
	Au = e;
}
var Mu = null, Nu = /* @__NO_SIDE_EFFECTS__ */ () => Mu, Pu = null, Fu = (e) => {
	Pu = e;
}, Iu = () => Pu, Lu = 0;
function Ru(e = {}) {
	let t = Rs(e.onWarn) ? e.onWarn : qs, n = q(e.version) ? e.version : Su, r = q(e.locale) || Rs(e.locale) ? e.locale : Cu, i = Rs(r) ? Cu : r, a = Ls(e.fallbackLocale) || Ws(e.fallbackLocale) || q(e.fallbackLocale) || e.fallbackLocale === !1 ? e.fallbackLocale : i, o = Ws(e.messages) ? e.messages : zu(i), s = Ws(e.datetimeFormats) ? e.datetimeFormats : zu(i), c = Ws(e.numberFormats) ? e.numberFormats : zu(i), l = Os(As(), e.modifiers, Tu()), u = e.pluralRules || As(), d = Rs(e.missing) ? e.missing : null, f = zs(e.missingWarn) || Es(e.missingWarn) ? e.missingWarn : !0, p = zs(e.fallbackWarn) || Es(e.fallbackWarn) ? e.fallbackWarn : !0, m = !!e.fallbackFormat, h = !!e.unresolving, g = Rs(e.postTranslation) ? e.postTranslation : null, _ = Ws(e.processor) ? e.processor : null, v = !zs(e.warnHtmlMessage) || e.warnHtmlMessage, y = !!e.escapeParameter, b = Rs(e.messageCompiler) ? e.messageCompiler : Eu, x = Rs(e.messageResolver) ? e.messageResolver : Ou || yu, S = Rs(e.localeFallbacker) ? e.localeFallbacker : Au || ou, C = Bs(e.fallbackContext) ? e.fallbackContext : void 0, w = e, T = Bs(w.__datetimeFormatters) ? w.__datetimeFormatters : /* @__PURE__ */ new Map(), E = Bs(w.__numberFormatters) ? w.__numberFormatters : /* @__PURE__ */ new Map(), D = Bs(w.__meta) ? w.__meta : {};
	Lu++;
	let O = {
		version: n,
		cid: Lu,
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
	return O.datetimeFormats = s, O.numberFormats = c, O.__datetimeFormatters = T, O.__numberFormatters = E, __INTLIFY_PROD_DEVTOOLS__ && Ql(O, n, D), O;
}
var zu = (e) => ({ [e]: As() });
function Bu(e, t, n, r, i) {
	let { missing: a, onWarn: o } = e;
	if (a !== null) {
		let r = a(e, n, t, i);
		return q(r) ? r : t;
	}
	return t;
}
function Vu(e, t) {
	let n = e;
	Bs(t) ? n.__localeChainObjectCache?.delete(t) : n.__localeChainCache?.delete(t);
}
function Hu(e, t, n) {
	Vu(e, n), e.fallbackContext && Vu(e.fallbackContext, n), e.localeFallbacker(e, n, t);
}
function Uu(e, t) {
	return e !== t && e.split("-")[0] === t.split("-")[0];
}
function Wu(e, t) {
	let n = t.indexOf(e);
	if (n === -1) return !1;
	for (let r = n + 1; r < t.length; r++) if (Uu(e, t[r])) return !0;
	return !1;
}
function Gu(e, t, n, r, i, a, o) {
	let { fallbackLocale: s, localeFallbacker: c, onWarn: l } = e, u = c(e, s, n);
	for (let n = 0; n < u.length; n++) {
		let a = u[n];
		if (Ws(Fs(Fs(r, a) || {}, t)) && q(a)) return a;
		Bu(e, t, a, i, o);
	}
	return null;
}
function Ku(e, t, n) {
	let r = `${e}__${t}`;
	return Ws(n) && !Ds(n) && (r = `${r}__${JSON.stringify(n)}`), r;
}
function qu(e, t, n) {
	for (let r in n) {
		let n = `${t}__${r}`;
		for (let t of e.keys()) (t === n || t.startsWith(`${n}__`)) && e.delete(t);
	}
}
function Ju(e, t, n, r) {
	let [, i, a, o] = e, s = n;
	return q(i) ? t.key = i : Ws(i) && Object.keys(i).forEach((e) => {
		r.includes(e) ? s[e] = i[e] : t[e] = i[e];
	}), q(a) ? t.locale = a : Ws(a) && (s = a), Ws(o) && (s = o), s;
}
var Yu = typeof Intl < "u";
Yu && Intl.DateTimeFormat, Yu && Intl.NumberFormat;
function Xu(e, ...t) {
	let { datetimeFormats: n, unresolving: r, onWarn: i } = e, { __datetimeFormatters: a } = e;
	if (!q(t[0]) && !Ts(t[0]) && !ws(t[0])) return "";
	let [o, s, c, l] = Qu(...t), u = zs(c.missingWarn) ? c.missingWarn : e.missingWarn, d = zs(c.fallbackWarn) ? c.fallbackWarn : e.fallbackWarn, f = !!c.part, p = ru(e, c);
	if (!q(o) || o === "") {
		let e = new Intl.DateTimeFormat(p.replace(/!/g, ""), l);
		return f ? e.formatToParts(s) : e.format(s);
	}
	let m = Gu(e, o, p, n, u, d, "datetime format");
	if (!q(m)) return r ? -1 : o;
	let h = n[m][o], g = Ku(m, o, l), _ = a.get(g);
	return _ || (_ = new Intl.DateTimeFormat(m, Os({}, h, l)), a.set(g, _)), f ? _.formatToParts(s) : _.format(s);
}
var Zu = [
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
function Qu(...e) {
	let [t] = e, n = As(), r = As(), i;
	if (q(t)) {
		let e = t.match(/(\d{4}-\d{2}-\d{2})(T|\s)?(.*)/);
		if (!e) throw nu(tu.INVALID_ISO_DATE_ARGUMENT);
		let n = e[3] ? e[3].trim().startsWith("T") ? `${e[1].trim()}${e[3].trim()}` : `${e[1].trim()}T${e[3].trim()}` : e[1].trim();
		i = new Date(n);
		try {
			i.toISOString();
		} catch {
			throw nu(tu.INVALID_ISO_DATE_ARGUMENT);
		}
	} else if (Ts(t)) {
		if (isNaN(t.getTime())) throw nu(tu.INVALID_DATE_ARGUMENT);
		i = t;
	} else if (ws(t)) i = t;
	else throw nu(tu.INVALID_ARGUMENT);
	let a = Ju(e, n, r, Zu);
	return [
		n.key || "",
		i,
		n,
		a
	];
}
function $u(e, t, n) {
	qu(e.__datetimeFormatters, t, n);
}
function ed(e, ...t) {
	let { numberFormats: n, unresolving: r, onWarn: i } = e, { __numberFormatters: a } = e;
	if (!ws(t[0])) return "";
	let [o, s, c, l] = nd(...t), u = zs(c.missingWarn) ? c.missingWarn : e.missingWarn, d = zs(c.fallbackWarn) ? c.fallbackWarn : e.fallbackWarn, f = !!c.part, p = ru(e, c);
	if (!q(o) || o === "") {
		let e = new Intl.NumberFormat(p.replace(/!/g, ""), l);
		return f ? e.formatToParts(s) : e.format(s);
	}
	let m = Gu(e, o, p, n, u, d, "number format");
	if (!q(m)) return r ? -1 : o;
	let h = n[m][o], g = Ku(m, o, l), _ = a.get(g);
	return _ || (_ = new Intl.NumberFormat(m, Os({}, h, l)), a.set(g, _)), f ? _.formatToParts(s) : _.format(s);
}
var td = [
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
function nd(...e) {
	let [t] = e, n = As(), r = As();
	if (!ws(t)) throw nu(tu.INVALID_ARGUMENT);
	let i = t, a = Ju(e, n, r, td);
	return [
		n.key || "",
		i,
		n,
		a
	];
}
function rd(e, t, n) {
	qu(e.__numberFormatters, t, n);
}
var id = (e) => e, ad = (e) => "", od = "text", sd = (e) => e.length === 0 ? "" : Ks(e), cd = Gs;
function ld(e, t) {
	return e = Math.abs(e), t === 2 ? e === 1 ? 0 : 1 : Math.min(e, 2);
}
function ud(e) {
	let t = ws(e.pluralIndex) ? e.pluralIndex : -1;
	return ws(e.named?.count) ? e.named.count : ws(e.named?.n) ? e.named.n : t;
}
function dd(e = {}) {
	let t = e.locale, n = ud(e), r = q(t) && e.pluralRules && Rs(Fs(e.pluralRules, t)) ? e.pluralRules[t] : ld, i = r === ld ? void 0 : ld, a = (e) => e[r(n, e.length, i)], o = e.list || [], s = (e) => o[e], c = e.named || As(), l = ws(e.pluralIndex), u = (t) => {
		let n = Is(t) ? Fs(c, t) : c[t];
		return l && !n && (t === "count" || t === "n") ? e.pluralIndex : n;
	};
	function d(t, n) {
		return (Rs(e.messages) ? e.messages(t, !!n) : Bs(e.messages) ? e.messages[t] : !1) || (e.parent ? e.parent.message(t) : ad);
	}
	let f = (t) => e.modifiers ? Fs(e.modifiers, t) : id, p = Rs(e.processor?.normalize) ? e.processor.normalize : sd, m = Rs(e.processor?.interpolate) ? e.processor.interpolate : cd, h = {
		list: s,
		named: u,
		plural: a,
		linked: (e, ...t) => {
			let [n, r] = t, i = "text", a = "";
			t.length === 1 ? Bs(n) ? (a = n.modifier || a, i = n.type || i) : q(n) && (a = n || a) : t.length === 2 && (q(n) && (a = n || a), q(r) && (i = r || i));
			let o = d(e, !0)(h), s = o === "" || o === void 0 ? e : o, c = i === "vnode" && Ls(s) && a ? s[0] : s;
			if (!a) return c;
			let l = f(a);
			return Rs(l) ? l(c, i) : c;
		},
		message: d,
		type: q(e.processor?.type) ? e.processor.type : od,
		interpolate: m,
		normalize: p,
		values: Os(As(), o, c, l ? {
			count: u("count"),
			n: u("n")
		} : {})
	};
	return h;
}
var fd = () => "", pd = (e) => Rs(e), md = (e) => q(e) || Sl(e) || pd(e);
function hd(e, ...t) {
	let { fallbackFormat: n, postTranslation: r, unresolving: i, messageCompiler: a, fallbackLocale: o, messages: s } = e, [c, l] = Sd(...t), u = zs(l.missingWarn) ? l.missingWarn : e.missingWarn, d = zs(l.fallbackWarn) ? l.fallbackWarn : e.fallbackWarn, f = zs(l.escapeParameter) ? l.escapeParameter : e.escapeParameter, p = !!l.resolvedMessage, m = q(l.default) || zs(l.default) ? zs(l.default) ? a ? c : () => c : l.default : n ? a ? c : () => c : null, h = n || m != null && (q(m) || Rs(m)), g = ru(e, l);
	f && gd(l);
	let [_, v, y] = p ? [
		c,
		g,
		Fs(s, g) || As()
	] : yd(e, c, g, o, d, u), b = _, x = c;
	if (!p && !md(b) && h && (b = m, x = b), !p && (!md(b) || !q(v))) return i ? -1 : c;
	let S = !1, C = pd(b) ? b : bd(e, c, v, b, x, () => {
		S = !0;
	});
	if (S) return b;
	let w = xd(e, C, dd(wd(e, v, y, l, f))), T = r ? r(w, c) : w;
	if (f && q(T) && (T = Fc(T)), __INTLIFY_PROD_DEVTOOLS__) {
		let t = {
			timestamp: Date.now(),
			key: q(c) ? c : pd(b) ? b.key : "",
			locale: v || (pd(b) ? b.locale : ""),
			format: q(b) ? b : pd(b) ? b.source : "",
			message: T
		};
		t.meta = Os({}, e.__meta, /* @__PURE__ */ Nu() || {}), $l(t);
	}
	return T;
}
function gd(e) {
	if (Ls(e.list) && (e.list = e.list.map((e) => q(e) ? Js(e) : e)), Bs(e.named)) {
		let t = e.named, n = As();
		for (let e of Object.keys(t)) {
			let r = t[e];
			n[e] = q(r) ? Js(r) : r;
		}
		e.named = n;
	}
}
function _d(e) {
	return q(e) ? e : Js(Gs(e));
}
function vd(e, t) {
	return !t || Rs(e?.interpolate) ? e : Os({}, e, { interpolate: _d });
}
function yd(e, t, n, r, i, a) {
	let { messages: o, onWarn: s, messageResolver: c, localeFallbacker: l } = e, u = l(e, r, n), d = As(), f, p = null;
	for (let n = 0; n < u.length && (f = u[n], d = Fs(o, f) || As(), (p = c(d, t)) === null && (p = Fs(d, t)), !md(p)); n++) if (!Wu(f, u)) {
		let n = Bu(e, t, f, a, "translate");
		n !== t && (p = n);
	}
	return [
		p,
		f,
		d
	];
}
function bd(e, t, n, r, i, a) {
	let { messageCompiler: o, warnHtmlMessage: s } = e;
	if (pd(r)) {
		let e = r;
		return e.locale = e.locale || n, e.key = e.key || t, e;
	}
	if (o == null) {
		let e = (() => r);
		return e.locale = n, e.key = t, e;
	}
	let c = o(r, Cd(e, n, i, r, s, a));
	return c.locale = n, c.key = t, c.source = r, c;
}
function xd(e, t, n) {
	return t(n);
}
function Sd(...e) {
	let [t, n, r] = e, i = As();
	if (!q(t) && !ws(t) && !pd(t) && !Sl(t)) throw nu(tu.INVALID_ARGUMENT);
	let a = ws(t) ? String(t) : (pd(t), t);
	return ws(n) ? i.plural = n : q(n) ? i.default = n : Ws(n) && !Ds(n) ? i.named = n : Ls(n) && (i.list = n), ws(r) ? i.plural = r : q(r) ? i.default = r : Ws(r) && Os(i, r), [a, i];
}
function Cd(e, t, n, r, i, a) {
	return {
		locale: t,
		key: n,
		warnHtmlMessage: i,
		onError: (e) => {
			throw a && a(e), e;
		},
		onCacheKey: (e) => Ss(t, n, e)
	};
}
function wd(e, t, n, r, i) {
	let { modifiers: a, pluralRules: o, messageResolver: s, fallbackLocale: c, fallbackWarn: l, missingWarn: u, fallbackContext: d } = e, f = {
		locale: t,
		modifiers: a,
		pluralRules: o,
		messages: (r, i) => {
			let a = s(n, r);
			if (a == null && (d || i)) {
				let [n, , i] = yd(d || e, r, t, c, l, u);
				a = n ?? s(i, r);
			}
			if (q(a) || Sl(a)) {
				let n = !1, i = bd(e, r, t, a, r, () => {
					n = !0;
				});
				return n ? fd : i;
			}
			return pd(a) ? a : fd;
		}
	}, p = vd(e.processor, i);
	return p && (f.processor = p), r.list && (f.list = r.list), r.named && (f.named = r.named), ws(r.plural) && (f.pluralIndex = r.plural), f;
}
xl();
// node_modules/.pnpm/vue-i18n@11.4.23_vue@3.5.42_typescript@6.0.3_/node_modules/vue-i18n/dist/vue-i18n.mjs
var Td = "11.4.23";
function Ed() {
	typeof __VUE_I18N_FULL_INSTALL__ != "boolean" && (Ms().__VUE_I18N_FULL_INSTALL__ = !0), typeof __VUE_I18N_LEGACY_API__ != "boolean" && (Ms().__VUE_I18N_LEGACY_API__ = !0), typeof __INTLIFY_DROP_MESSAGE_COMPILER__ != "boolean" && (Ms().__INTLIFY_DROP_MESSAGE_COMPILER__ = !1), typeof __INTLIFY_PROD_DEVTOOLS__ != "boolean" && (Ms().__INTLIFY_PROD_DEVTOOLS__ = !1);
}
var Dd = {
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
function Od(e, ...t) {
	return Bc(e, null, void 0);
}
Dd.UNEXPECTED_RETURN_TYPE, Dd.INVALID_ARGUMENT, Dd.MUST_BE_CALL_SETUP_TOP, Dd.NOT_INSTALLED, Dd.UNEXPECTED_ERROR, Dd.REQUIRED_VALUE, Dd.INVALID_VALUE, Dd.CANNOT_SETUP_VUE_DEVTOOLS_PLUGIN, Dd.NOT_INSTALLED_WITH_PROVIDE, Dd.NOT_COMPATIBLE_LEGACY_VUE_I18N, Dd.NOT_AVAILABLE_COMPOSITION_IN_LEGACY;
var kd = /* #__PURE__*/ xs("__translateVNode"), Ad = /* #__PURE__*/ xs("__datetimeParts"), jd = /* #__PURE__*/ xs("__numberParts"), Md = xs("__setPluralRules");
xs("__intlifyMeta");
var Nd = /* #__PURE__*/ xs("__injectWithOption"), Pd = /* #__PURE__*/ xs("__dispose"), Fd = {
	FALLBACK_TO_ROOT: 10,
	NOT_FOUND_PARENT_SCOPE: 11,
	IGNORE_OBJ_FLATTEN: 12,
	DEPRECATE_LEGACY_MODE: 13,
	DEPRECATE_TRANSLATE_CUSTOME_DIRECTIVE: 14,
	DUPLICATE_USE_I18N_CALLING: 15,
	IGNORE_UNSAFE_LOCALE: 16
};
Fd.FALLBACK_TO_ROOT, Fd.NOT_FOUND_PARENT_SCOPE, Fd.IGNORE_OBJ_FLATTEN, Fd.DEPRECATE_LEGACY_MODE, Fd.DEPRECATE_TRANSLATE_CUSTOME_DIRECTIVE, Fd.DUPLICATE_USE_I18N_CALLING, Fd.IGNORE_UNSAFE_LOCALE;
var Id = null;
{
	let e = Ms().__VUE_INSTANCE_SETTERS__;
	Ls(e) && e.push((e) => {
		Id = e;
	});
}
function Ld(e) {
	return !!Is(e);
}
function Rd(e) {
	if (!Bs(e) || Sl(e)) return e;
	for (let t in e) if (Ps(e, t)) {
		if (!t.includes(".")) Bs(e[t]) && Rd(e[t]);
		else {
			let n = t.split("."), r = n.length - 1, i = e, a = !1;
			for (let e = 0; e < r; e++) {
				if (n[e] === "__proto__") throw Error(`unsafe key: ${n[e]}`);
				if (n[e] in i || (i[n[e]] = As()), !Bs(i[n[e]]) || Sl(i[n[e]]) && (Bl.includes(n[e + 1]) || n[e + 1] === "cacheKey")) {
					a = !0;
					break;
				}
				i = i[n[e]];
			}
			a || (i[n[r]] = e[t], delete e[t]);
			let o = i[n[r]];
			Bs(o) && Rd(o);
		}
	}
	return e;
}
function zd(e, t) {
	let { messages: n, __i18n: r, messageResolver: i, flatJson: a } = t, o = Ws(n) ? n : Ls(r) ? As() : { [e]: As() };
	if (Ls(r) && r.forEach((e) => {
		if ("locale" in e && "resource" in e) {
			let { locale: t, resource: n } = e;
			if (t) {
				if (Ld(t)) return;
				o[t] = Fs(o, t) || As(), Lc(n, o[t]);
			} else Lc(n, o);
		} else q(e) && Lc(JSON.parse(e), o);
	}), i == null && a) for (let e in o) Ps(o, e) && Rd(o[e]);
	return o;
}
function Bd(e) {
	return e.type;
}
function Vd(e, t, n) {
	let r = Bs(t.messages) ? t.messages : As();
	"__i18nGlobal" in n && (r = zd(e.locale.value, {
		messages: r,
		__i18n: n.__i18nGlobal
	}));
	let i = Object.keys(r);
	if (i.length && i.forEach((t) => {
		e.mergeLocaleMessage(t, r[t]);
	}), Bs(t.datetimeFormats)) {
		let n = Object.keys(t.datetimeFormats);
		n.length && n.forEach((n) => {
			e.mergeDateTimeFormat(n, t.datetimeFormats[n]);
		});
	}
	if (Bs(t.numberFormats)) {
		let n = Object.keys(t.numberFormats);
		n.length && n.forEach((n) => {
			e.mergeNumberFormat(n, t.numberFormats[n]);
		});
	}
}
function Hd(e) {
	return U(Ca, null, e, 0);
}
function Ud() {
	return Id ?? Ja();
}
function Wd(e) {
	return e.scope;
}
function Gd(e, t) {
	let n = Wd(e);
	n.active ? n.run(() => je(t)) : t();
}
var Kd = () => [], qd = () => !1, Jd = 0;
function Yd(e) {
	return ((t, n, r, i) => e(n, r, Ud() || void 0, i));
}
function Xd(e = {}) {
	let { __root: t, __injectWithOption: n } = e, r = t === void 0, i = e.flatJson, a = bs ? j : M, o = !zs(e.inheritLocale) || e.inheritLocale, s = a(t && o ? t.locale.value : q(e.locale) ? e.locale : Cu), c = a(t && o ? t.fallbackLocale.value : q(e.fallbackLocale) || Ls(e.fallbackLocale) || Ws(e.fallbackLocale) || e.fallbackLocale === !1 ? e.fallbackLocale : s.value), l = a(zd(s.value, e)), u = a(Ws(e.datetimeFormats) ? e.datetimeFormats : { [s.value]: {} }), d = a(Ws(e.numberFormats) ? e.numberFormats : { [s.value]: {} }), f = t ? t.missingWarn : zs(e.missingWarn) || Es(e.missingWarn) ? e.missingWarn : !0, p = t ? t.fallbackWarn : zs(e.fallbackWarn) || Es(e.fallbackWarn) ? e.fallbackWarn : !0, m = t ? t.fallbackRoot : !zs(e.fallbackRoot) || e.fallbackRoot, h = !!e.fallbackFormat, g = Rs(e.missing) ? e.missing : null, _ = Rs(e.missing) ? Yd(e.missing) : null, v = Rs(e.postTranslation) ? e.postTranslation : null, y = t ? t.warnHtmlMessage : !zs(e.warnHtmlMessage) || e.warnHtmlMessage, b = !!e.escapeParameter, x = t ? t.modifiers : Ws(e.modifiers) ? e.modifiers : {}, S = e.pluralRules || t && t.pluralRules, C;
	C = (() => {
		r && Fu(null);
		let t = {
			version: Td,
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
		let n = Ru(t);
		return r && Fu(n), n;
	})(), Hu(C, s.value, c.value);
	function w() {
		return [
			s.value,
			c.value,
			l.value,
			u.value,
			d.value
		];
	}
	let T = K({
		get: () => s.value,
		set: (e) => {
			C.locale = e, s.value = e;
		}
	});
	function E(e) {
		r || (C.fallbackContext = Iu());
		try {
			return e();
		} finally {
			r || (C.fallbackContext = void 0);
		}
	}
	function D(e) {
		E(() => Hu(C, s.value, e));
	}
	let O = K({
		get: () => c.value,
		set: (e) => {
			c.value = e, C.fallbackLocale = c.value, D(c.value);
		}
	}), ee = K(() => l.value), te = /* #__PURE__*/ K(() => u.value), k = /* #__PURE__*/ K(() => d.value);
	function ne() {
		return Rs(v) ? v : null;
	}
	function re(e) {
		v = e, C.postTranslation = e;
	}
	function ie() {
		return g;
	}
	function ae(e) {
		e !== null && (_ = Yd(e)), g = e, C.missing = _;
	}
	let oe = (e, n, r, i, a, o) => {
		w();
		let s;
		try {
			__INTLIFY_PROD_DEVTOOLS__, s = E(() => e(C));
		} finally {
			__INTLIFY_PROD_DEVTOOLS__;
		}
		if (r !== "translate exists" && ws(s) && s === -1 || r === "translate exists" && !s) {
			let [e, r] = n();
			return t && m ? i(t) : a(e);
		}
		if (o(s)) return s;
		/* istanbul ignore next */
		throw Od(Dd.UNEXPECTED_RETURN_TYPE);
	};
	function se(...e) {
		return oe((t) => Reflect.apply(hd, null, [t, ...e]), () => Sd(...e), "translate", (t) => Reflect.apply(t.t, t, [...e]), (e) => e, (e) => q(e));
	}
	function ce(...e) {
		let [t, n, r] = e;
		if (r && !Bs(r)) throw Od(Dd.INVALID_ARGUMENT);
		return se(t, n, Os({ resolvedMessage: !0 }, r || {}));
	}
	function le(...e) {
		return oe((t) => Reflect.apply(Xu, null, [t, ...e]), () => Qu(...e), "datetime format", (t) => Reflect.apply(t.d, t, [...e]), () => "", (e) => q(e) || Ls(e));
	}
	function ue(...e) {
		return oe((t) => Reflect.apply(ed, null, [t, ...e]), () => nd(...e), "number format", (t) => Reflect.apply(t.n, t, [...e]), () => "", (e) => q(e) || Ls(e));
	}
	function de(e) {
		return e.map((e) => q(e) || ws(e) || zs(e) ? Hd(String(e)) : e);
	}
	let fe = {
		normalize: de,
		interpolate: (e) => e,
		type: "vnode"
	};
	function pe(...e) {
		return oe((t) => {
			let n, r = t;
			try {
				r.processor = fe, n = Reflect.apply(hd, null, [r, ...e]);
			} finally {
				r.processor = null;
			}
			return n;
		}, () => Sd(...e), "translate", (t) => t[kd](...e), (e) => [Hd(e)], (e) => Ls(e));
	}
	function me(...e) {
		return oe((t) => Reflect.apply(ed, null, [t, ...e]), () => nd(...e), "number format", (t) => t[jd](...e), Kd, (e) => q(e) || Ls(e));
	}
	function he(...e) {
		return oe((t) => Reflect.apply(Xu, null, [t, ...e]), () => Qu(...e), "datetime format", (t) => t[Ad](...e), Kd, (e) => q(e) || Ls(e));
	}
	function ge(e) {
		S = e, C.pluralRules = S;
	}
	function _e(e, t) {
		let n = xe(e), r = C.messageResolver(n, t);
		return r === null ? Fs(n, t) : r;
	}
	function ve(e, t) {
		return oe(() => {
			if (!e) return !1;
			let n = q(t) ? t : s.value, r = q(t) ? [n] : C.localeFallbacker(C, c.value, n);
			for (let t = 0; t < r.length; t++) if (md(_e(r[t], e))) return !0;
			return !1;
		}, () => [e], "translate exists", (n) => Reflect.apply(n.te, n, [e, t]), qd, (e) => zs(e));
	}
	function ye(e) {
		let t = null, n = C.localeFallbacker(C, c.value, s.value);
		for (let r = 0; r < n.length; r++) {
			let i = _e(n[r], e);
			if (i != null) {
				t = i;
				break;
			}
		}
		return t;
	}
	function be(e) {
		return ye(e) ?? (t && t.tm(e) || {});
	}
	function xe(e) {
		return Fs(l.value, e) || {};
	}
	function Se(e, t) {
		Ld(e) || (i && Rd(t), l.value[e] = t, C.messages = l.value);
	}
	function Ce(e, t) {
		Ld(e) || (l.value[e] = Fs(l.value, e) || {}, i && Rd(t), Lc(t, l.value[e]), C.messages = l.value);
	}
	function we(e) {
		return Fs(u.value, e) || {};
	}
	function A(e, t) {
		Ld(e) || (u.value[e] = t, C.datetimeFormats = u.value, $u(C, e, t));
	}
	function Te(e, t) {
		Ld(e) || (u.value[e] = Os(Fs(u.value, e) || {}, t), C.datetimeFormats = u.value, $u(C, e, t));
	}
	function Ee(e) {
		return Fs(d.value, e) || {};
	}
	function De(e, t) {
		Ld(e) || (d.value[e] = t, C.numberFormats = d.value, rd(C, e, t));
	}
	function Oe(e, t) {
		Ld(e) || (d.value[e] = Os(Fs(d.value, e) || {}, t), C.numberFormats = d.value, rd(C, e, t));
	}
	Jd++, F(c, () => D(c.value), {
		deep: !0,
		flush: "sync"
	}), t && bs && (F(t.locale, (e) => {
		o && (s.value = e, C.locale = e, Hu(C, s.value, c.value));
	}), F(t.fallbackLocale, (e) => {
		o && (c.value = e, C.fallbackLocale = c.value, Hu(C, s.value, c.value));
	}));
	let ke = {
		id: Jd,
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
		messages: ee,
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
		t: se,
		getLocaleMessage: xe,
		setLocaleMessage: Se,
		mergeLocaleMessage: Ce,
		getPostTranslationHandler: ne,
		setPostTranslationHandler: re,
		getMissingHandler: ie,
		setMissingHandler: ae,
		[Md]: ge
	};
	return ke.datetimeFormats = te, ke.numberFormats = k, ke.rt = ce, ke.te = ve, ke.tm = be, ke.d = le, ke.n = ue, ke.getDateTimeFormat = we, ke.setDateTimeFormat = A, ke.mergeDateTimeFormat = Te, ke.getNumberFormat = Ee, ke.setNumberFormat = De, ke.mergeNumberFormat = Oe, ke[Nd] = n, ke[kd] = pe, ke[Ad] = he, ke[jd] = me, ke;
}
var Zd = /* @__PURE__ */ new WeakMap();
function Qd(e) {
	if (!Es(e)) return !e;
	let t = Zd.get(e);
	return t || (t = RegExp(`^(?![\\s\\S]*(?:${e.source}))`, e.flags.replace(/[gy]/g, "")), Zd.set(e, t), Zd.set(t, e)), t;
}
function $d(e) {
	let t = q(e.locale) ? e.locale : Cu, n = q(e.fallbackLocale) || Ls(e.fallbackLocale) || Ws(e.fallbackLocale) || e.fallbackLocale === !1 ? e.fallbackLocale : t, r = Rs(e.missing) ? e.missing : void 0, i = zs(e.silentTranslationWarn) || Es(e.silentTranslationWarn) ? Qd(e.silentTranslationWarn) : !0, a = zs(e.silentFallbackWarn) || Es(e.silentFallbackWarn) ? Qd(e.silentFallbackWarn) : !0, o = !zs(e.fallbackRoot) || e.fallbackRoot, s = !!e.formatFallbackMessages, c = Ws(e.modifiers) ? e.modifiers : {}, l = e.pluralizationRules, u = Rs(e.postTranslation) ? e.postTranslation : void 0, d = !q(e.warnHtmlInMessage) || e.warnHtmlInMessage !== "off", f = !!e.escapeParameterHtml, p = !zs(e.sync) || e.sync, m = e.messages;
	if (Ws(e.sharedMessages)) {
		let t = e.sharedMessages;
		m = Object.keys(t).reduce((e, n) => (Ld(n) || Os(Fs(e, n) || (e[n] = {}), t[n]), e), m || {});
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
function ef(e = {}) {
	let t = Xd($d(e)), { __extender: n } = e, r = {
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
			return Qd(t.missingWarn);
		},
		set silentTranslationWarn(e) {
			t.missingWarn = Qd(e);
		},
		get silentFallbackWarn() {
			return Qd(t.fallbackWarn);
		},
		set silentFallbackWarn(e) {
			t.fallbackWarn = Qd(e);
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
function tf(e, t, n) {
	return {
		beforeCreate() {
			let r = Ud();
			/* istanbul ignore if */
			if (!r) throw Od(Dd.UNEXPECTED_ERROR);
			let i = this.$options;
			if (i.i18n) {
				let r = Os({}, i.i18n);
				if (i.__i18n && (r.__i18n = i.__i18n), r.__root = t, this === this.$root) this.$i18n = nf(e, r);
				else {
					r.__injectWithOption = !0, r.__extender = n.__vueI18nExtend, this.$i18n = ef(r);
					let e = this.$i18n;
					e.__extender && (e.__disposer = e.__extender(this.$i18n));
				}
			} else if (i.__i18n) {
				if (this === this.$root) this.$i18n = nf(e, i);
				else {
					this.$i18n = ef({
						__i18n: i.__i18n,
						__injectWithOption: !0,
						__extender: n.__vueI18nExtend,
						__root: t
					});
					let e = this.$i18n;
					e.__extender && (e.__disposer = e.__extender(this.$i18n));
				}
			} else this.$i18n = e;
			i.__i18nGlobal && Vd(t, i, i), this.$t = (...e) => this.$i18n.t(...e), this.$rt = (...e) => this.$i18n.rt(...e), this.$te = (e, t) => this.$i18n.te(e, t), this.$d = (...e) => this.$i18n.d(...e), this.$n = (...e) => this.$i18n.n(...e), this.$tm = (e) => this.$i18n.tm(e), n.__setInstance(r, this.$i18n);
			let a = this.$i18n;
			Gd(r, () => {
				a.__disposer && (a.__disposer(), delete a.__disposer, delete a.__extender), n.__deleteInstance(r);
			});
		},
		mounted() {},
		unmounted() {
			let e = Ud();
			/* istanbul ignore if */
			if (!e) throw Od(Dd.UNEXPECTED_ERROR);
			let t = this.$i18n;
			t && (delete this.$t, delete this.$rt, delete this.$te, delete this.$d, delete this.$n, delete this.$tm, t?.__disposer && (t.__disposer(), delete t.__disposer, delete t.__extender), n.__deleteInstance(e), delete this.$i18n);
		}
	};
}
function nf(e, t) {
	e.locale = t.locale || e.locale, e.fallbackLocale = t.fallbackLocale || e.fallbackLocale, e.missing = t.missing || e.missing, e.silentTranslationWarn = t.silentTranslationWarn || e.silentFallbackWarn, e.silentFallbackWarn = t.silentFallbackWarn || e.silentFallbackWarn, e.formatFallbackMessages = t.formatFallbackMessages || e.formatFallbackMessages, e.postTranslation = t.postTranslation || e.postTranslation, e.warnHtmlInMessage = t.warnHtmlInMessage || e.warnHtmlInMessage, e.escapeParameterHtml = t.escapeParameterHtml || e.escapeParameterHtml, e.sync = t.sync || e.sync, e.__composer[Md](t.pluralizationRules || e.pluralizationRules);
	let n = zd(e.locale, {
		messages: t.messages,
		__i18n: t.__i18n
	});
	return Object.keys(n).forEach((t) => e.mergeLocaleMessage(t, n[t])), t.datetimeFormats && Object.keys(t.datetimeFormats).forEach((n) => e.mergeDateTimeFormat(n, t.datetimeFormats[n])), t.numberFormats && Object.keys(t.numberFormats).forEach((n) => e.mergeNumberFormat(n, t.numberFormats[n])), e;
}
var rf = {
	tag: { type: [String, Object] },
	locale: { type: String },
	scope: {
		type: String,
		validator: (e) => e === "parent" || e === "global",
		default: "parent"
	},
	i18n: { type: Object }
};
function af({ slots: e }, t) {
	return t.length === 1 && t[0] === "default" ? (e.default ? e.default() : []).reduce((e, t) => [...e, ...t.type === R ? t.children : [t]], []) : t.reduce((t, n) => {
		let r = e[n];
		return r && (t[n] = r()), t;
	}, As());
}
function of() {
	return R;
}
var sf = /* @__PURE__ */ I({
	name: "i18n-t",
	props: Os({
		keypath: {
			type: String,
			required: !0
		},
		plural: {
			type: [Number, String],
			validator: (e) => ws(e) || !isNaN(e)
		}
	}, rf),
	setup(e, t) {
		let { slots: n, attrs: r } = t, i = e.i18n || Y({
			useScope: e.scope,
			__useComponent: !0
		});
		return () => {
			let a = () => {
				let r = Object.keys(n).filter((e) => e[0] !== "_"), a = As();
				e.locale && (a.locale = e.locale), e.plural !== void 0 && (a.plural = q(e.plural) ? +e.plural : e.plural);
				let o = af(t, r);
				return i[kd](e.keypath, o, a);
			}, o = Os(As(), r), s = q(e.tag) || Bs(e.tag) ? e.tag : of();
			return Bs(s) ? uo(s, o, { default: a }) : uo(s, o, a());
		};
	}
});
function cf(e) {
	return Ls(e) && !q(e[0]);
}
function lf(e, t, n, r) {
	let { slots: i, attrs: a } = t;
	return () => {
		let t = () => {
			let t = { part: !0 }, a = As();
			e.locale && (t.locale = e.locale), q(e.format) ? t.key = e.format : Bs(e.format) && (q(e.format.key) && (t.key = e.format.key), a = Object.keys(e.format).reduce((t, r) => n.includes(r) ? Os(As(), t, { [r]: e.format[r] }) : t, As()));
			let o = r(e.value, t, a), s = [t.key];
			return Ls(o) ? s = o.map((e, t) => {
				let n = i[e.type], r = n ? n({
					[e.type]: e.value,
					index: t,
					parts: o
				}) : [e.value];
				return cf(r) && (r[0].key = `${e.type}-${t}`), r;
			}) : q(o) && (s = [o]), s;
		}, o = Os(As(), a), s = q(e.tag) || Bs(e.tag) ? e.tag : of();
		return Bs(s) ? uo(s, o, { default: t }) : uo(s, o, t());
	};
}
var uf = /* @__PURE__ */ I({
	name: "i18n-n",
	props: Os({
		value: {
			type: Number,
			required: !0
		},
		format: { type: [String, Object] }
	}, rf),
	setup(e, t) {
		let n = e.i18n || Y({
			useScope: e.scope,
			__useComponent: !0
		});
		return lf(e, t, td, (...e) => n[jd](...e));
	}
});
function df(e, t) {
	let n = e;
	if (e.mode === "composition") return n.__getInstance(t) || e.global;
	{
		let r = n.__getInstance(t);
		return r == null ? e.global.__composer : r.__composer;
	}
}
function ff(e) {
	let t = (t) => {
		let { instance: n, value: r } = t;
		/* istanbul ignore if */
		if (!n || !n.$) throw Od(Dd.UNEXPECTED_ERROR);
		let i = df(e, n.$), a = pf(r);
		return [Reflect.apply(i.t, i, [...mf(a)]), i];
	};
	return {
		created: (e, n) => {
			let [r, i] = t(n);
			if (bs) {
				let t = Wd(n.instance.$);
				t.active && (e.__i18nWatcher = t.run(() => F(i.locale, () => {
					n.instance && n.instance.$forceUpdate();
				})));
			}
			e.__composer = i, e.textContent = r;
		},
		unmounted: (e) => {
			bs && e.__i18nWatcher && (e.__i18nWatcher(), e.__i18nWatcher = void 0, delete e.__i18nWatcher), e.__composer && (e.__composer = void 0, delete e.__composer);
		},
		beforeUpdate: (e, { value: t }) => {
			if (e.__composer) {
				let n = e.__composer, r = pf(t);
				e.textContent = Reflect.apply(n.t, n, [...mf(r)]);
			}
		},
		getSSRProps: (e) => {
			let [n] = t(e);
			return { textContent: n };
		}
	};
}
function pf(e) {
	if (q(e)) return { path: e };
	if (Ws(e)) {
		if (!("path" in e)) throw Od(Dd.REQUIRED_VALUE, "path");
		return e;
	}
	throw Od(Dd.INVALID_VALUE);
}
function mf(e) {
	let { path: t, locale: n, args: r, choice: i, plural: a } = e, o = {}, s = r || {};
	return q(n) && (o.locale = n), ws(i) && (o.plural = i), ws(a) && (o.plural = a), [
		t,
		s,
		o
	];
}
function hf(e, t, ...n) {
	let r = Ws(n[0]) ? n[0] : {};
	(!zs(r.globalInstall) || r.globalInstall) && ([sf.name, "I18nT"].forEach((t) => e.component(t, sf)), [uf.name, "I18nN"].forEach((t) => e.component(t, uf)), [Of.name, "I18nD"].forEach((t) => e.component(t, Of))), e.directive("t", ff(t));
}
var gf = /* #__PURE__*/ xs("global-vue-i18n");
function _f(e = {}) {
	let t = __VUE_I18N_LEGACY_API__ && zs(e.legacy) ? e.legacy : __VUE_I18N_LEGACY_API__, n = !zs(e.globalInjection) || e.globalInjection, r = /* @__PURE__ */ new Map(), [i, a] = vf(e, t), o = /* #__PURE__*/ xs("");
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
			if (e.__VUE_I18N_SYMBOL__ = o, e.provide(e.__VUE_I18N_SYMBOL__, u), Ws(r[0])) {
				let e = r[0];
				u.__composerExtend = e.__composerExtend, u.__vueI18nExtend = e.__vueI18nExtend;
			}
			let i = null;
			!t && n && (i = Df(e, u.global)), __VUE_I18N_FULL_INSTALL__ && hf(e, u, ...r), __VUE_I18N_LEGACY_API__ && t && e.mixin(tf(a, a.__composer, u));
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
function Y(e = {}) {
	let t = Ud();
	if (t == null) throw Od(Dd.MUST_BE_CALL_SETUP_TOP);
	if (!t.isCE && t.appContext.app != null && !t.appContext.app.__VUE_I18N_SYMBOL__) throw Od(Dd.NOT_INSTALLED);
	let n = yf(t), r = xf(n), i = Bd(t), a = bf(e, i);
	if (a === "global") return Vd(r, e, i), r;
	if (a === "parent") {
		let i = Sf(n, t, e.__useComponent);
		return i ??= r, i;
	}
	if (a === "isolated") {
		if (n.mode !== "composition") throw Od(Dd.NOT_AVAILABLE_COMPOSITION_IN_LEGACY);
		let i = n, a = Os({}, e);
		a.__root = Sf(n, t) || r;
		let o = Xd(a);
		return i.__composerExtend && (o[Pd] = i.__composerExtend(o)), Ae() && je(() => {
			let e = o[Pd];
			e && (e(), delete o[Pd]);
		}), o;
	}
	let o = n, s = o.__getInstance(t);
	if (s == null) {
		let n = Os({}, e);
		"__i18n" in i && (n.__i18n = i.__i18n), r && (n.__root = r), s = Xd(n), o.__composerExtend && (s[Pd] = o.__composerExtend(s)), o.__setInstance(t, s), wf(o, t, s);
	}
	return s;
}
function vf(e, t) {
	let n = ke(), r = __VUE_I18N_LEGACY_API__ && t ? n.run(() => ef(e)) : n.run(() => Xd(e));
	if (r == null) throw Od(Dd.UNEXPECTED_ERROR);
	return [n, r];
}
function yf(e) {
	let t = Qn(e.isCE ? gf : e.appContext.app.__VUE_I18N_SYMBOL__);
	/* istanbul ignore if */
	if (!t) throw Od(e.isCE ? Dd.NOT_INSTALLED_WITH_PROVIDE : Dd.UNEXPECTED_ERROR);
	return t;
}
function bf(e, t) {
	return Ds(e) ? "__i18n" in t ? "local" : "global" : e.useScope ? e.useScope : "local";
}
function xf(e) {
	return e.mode === "composition" ? e.global : e.global.__composer;
}
function Sf(e, t, n = !1) {
	let r = null, i = t.root, a = Cf(t, n);
	for (; a != null;) {
		let t = e;
		if (e.mode === "composition") r = t.__getInstance(a);
		else if (__VUE_I18N_LEGACY_API__) {
			let e = t.__getInstance(a);
			e != null && (r = e.__composer, n && r && !r[Nd] && (r = null));
		}
		if (r != null || i === a) break;
		a = a.parent;
	}
	return r;
}
function Cf(e, t = !1) {
	return e == null ? null : t && e.vnode.ctx || e.parent;
}
function wf(e, t, n) {
	Vr(() => {}, t), Gd(t, () => {
		let r = n;
		e.__deleteInstance(t);
		let i = r[Pd];
		i && (i(), delete r[Pd]);
	});
}
var Tf = [
	"locale",
	"fallbackLocale",
	"availableLocales"
], Ef = [
	"t",
	"rt",
	"d",
	"n",
	"tm",
	"te"
];
function Df(e, t) {
	let n = Object.create(null);
	return Tf.forEach((e) => {
		let r = Object.getOwnPropertyDescriptor(t, e);
		if (!r) throw Od(Dd.UNEXPECTED_ERROR);
		let i = /* @__PURE__ */ rn(r.value) ? {
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
	}), e.config.globalProperties.$i18n = n, Ef.forEach((n) => {
		let r = Object.getOwnPropertyDescriptor(t, n);
		if (!r || !r.value) throw Od(Dd.UNEXPECTED_ERROR);
		Object.defineProperty(e.config.globalProperties, `$${n}`, r);
	}), () => {
		delete e.config.globalProperties.$i18n, Ef.forEach((t) => {
			delete e.config.globalProperties[`$${t}`];
		});
	};
}
var Of = /* @__PURE__ */ I({
	name: "i18n-d",
	props: Os({
		value: {
			type: [Number, Date],
			required: !0
		},
		format: { type: [String, Object] }
	}, rf),
	setup(e, t) {
		let n = e.i18n || Y({
			useScope: e.scope,
			__useComponent: !0
		});
		return lf(e, t, Zu, (...e) => n[Ad](...e));
	}
});
if (Ed(), Du(Yl), ku(bu), ju(su), __INTLIFY_PROD_DEVTOOLS__) {
	let e = Ms();
	e.__INTLIFY__ = !0, Zl(e.__INTLIFY_DEVTOOLS_GLOBAL_HOOK__);
}
// node_modules/.pnpm/ohash@2.0.12/node_modules/ohash/dist/_chunks/is-equal.mjs
function kf(e) {
	return typeof e == "string" ? `'${e}'` : new Nf().serialize(e);
}
var Af = " _-,;:!?.'\"()[]{}@*/\\&#%`^+<=>|~$0123456789abcdefghijklmnopqrstuvwxyz", jf = /*@__PURE__*/ (function() {
	let e = /* @__PURE__ */ new Uint8Array(128);
	for (let t = 0; t < 69; t++) e[Af.charCodeAt(t)] = t + 1;
	for (let t = 65; t <= 90; t++) e[t] = e[t + 32];
	return e;
})();
function Mf(e, t) {
	if (e === t) return 0;
	let n = Math.min(e.length, t.length), r = 0;
	for (let i = 0; i < n; i++) {
		let n = e.charCodeAt(i), a = t.charCodeAt(i);
		if (n === a) continue;
		let o = n < 128 && jf[n] ? jf[n] : n + 128, s = a < 128 && jf[a] ? jf[a] : a + 128;
		if (o !== s) return o < s ? -1 : 1;
		r === 0 && (r = n > a ? -1 : 1);
	}
	return e.length === t.length ? r : e.length < t.length ? -1 : 1;
}
var Nf = /*@__PURE__*/ (function() {
	class e {
		#e = /* @__PURE__ */ new Map();
		compare(e, t) {
			let n = typeof e, r = typeof t;
			return n === "string" && r === "string" ? Mf(e, t) : n === "number" && r === "number" ? e - t : Mf(this.serialize(e, !0), this.serialize(t, !0));
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
			let i = Object.keys(e).sort(Mf), a = `${r}{`;
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
function Pf(e, t) {
	return e === t || kf(e) === kf(t);
}
// node_modules/.pnpm/reka-ui@2.11.0_vue@3.5.42_typescript@6.0.3_/node_modules/reka-ui/dist/shared/arrays.js
function Ff(e, t, n) {
	let r = e.findIndex((e) => Pf(e, t)), i = e.findIndex((e) => Pf(e, n));
	if (r === -1 || i === -1) return [];
	let [a, o] = [r, i].sort((e, t) => e - t);
	return e.slice(a, o + 1);
}
// node_modules/.pnpm/reka-ui@2.11.0_vue@3.5.42_typescript@6.0.3_/node_modules/reka-ui/dist/shared/clamp.js
function If(e, t = -Infinity, n = Infinity) {
	return Math.min(n, Math.max(t, e));
}
// node_modules/.pnpm/reka-ui@2.11.0_vue@3.5.42_typescript@6.0.3_/node_modules/reka-ui/dist/shared/createContext.js
function Lf(e, t) {
	let n = typeof e == "string" && !t ? `${e}Context` : t, r = Symbol(n);
	return [(t) => {
		let n = Qn(r, t);
		if (n || n === null) return n;
		throw Error(`Injection \`${r.toString()}\` not found. Component must be used within ${Array.isArray(e) ? `one of the following components: ${e.join(", ")}` : `\`${e}\``}`);
	}, (e) => (Zn(r, e), e)];
}
// node_modules/.pnpm/reka-ui@2.11.0_vue@3.5.42_typescript@6.0.3_/node_modules/reka-ui/dist/shared/getActiveElement.js
function Rf() {
	let e = document.activeElement;
	if (e == null) return null;
	for (; e != null && e.shadowRoot != null && e.shadowRoot.activeElement != null;) e = e.shadowRoot.activeElement;
	return e;
}
// node_modules/.pnpm/reka-ui@2.11.0_vue@3.5.42_typescript@6.0.3_/node_modules/reka-ui/dist/shared/handleAndDispatchCustomEvent.js
function zf(e, t, n) {
	let r = n.originalEvent.target, i = new CustomEvent(e, {
		bubbles: !1,
		cancelable: !0,
		detail: n
	});
	t && r.addEventListener(e, t, { once: !0 }), r.dispatchEvent(i);
}
// node_modules/.pnpm/reka-ui@2.11.0_vue@3.5.42_typescript@6.0.3_/node_modules/reka-ui/dist/shared/nullish.js
function Bf(e) {
	return e == null;
}
// node_modules/.pnpm/@vueuse+shared@14.4.0_vue@3.5.42_typescript@6.0.3_/node_modules/@vueuse/shared/dist/index.js
function Vf(e, t) {
	return Ae() ? (je(e, t), !0) : !1;
}
function Hf() {
	let e = /* @__PURE__ */ new Set(), t = (t) => {
		e.delete(t);
	};
	return {
		on: (n) => {
			e.add(n);
			let r = () => t(n);
			return Vf(r), { off: r };
		},
		off: t,
		trigger: (...t) => Promise.all(Array.from(e).map((e) => e(...t))),
		clear: () => {
			e.clear();
		}
	};
}
function Uf(e) {
	let t = !1, n, r = ke(!0);
	return ((...i) => (t ||= (n = r.run(() => e(...i)), !0), n));
}
var Wf = typeof window < "u" && typeof document < "u";
typeof WorkerGlobalScope < "u" && globalThis instanceof WorkerGlobalScope;
var Gf = (e) => e !== void 0, Kf = Object.prototype.toString, qf = (e) => Kf.call(e) === "[object Object]", Jf = /* #__PURE__ */ Yf();
function Yf() {
	var e, t;
	return Wf && !!((e = window) != null && (e = e.navigator) != null && e.userAgent) && (/iP(?:ad|hone|od)/.test(window.navigator.userAgent) || ((t = window) == null || (t = t.navigator) == null ? void 0 : t.maxTouchPoints) > 2 && /iPad|Macintosh/.test(window?.navigator.userAgent));
}
function Xf(e) {
	return Array.isArray(e) ? e : [e];
}
function Zf(e) {
	return e || Ja();
}
function Qf(e) {
	if (!Wf) return e;
	let t = 0, n, r, i = () => {
		--t, r && t <= 0 && (r.stop(), n = void 0, r = void 0);
	};
	return ((...a) => (t += 1, r || (r = ke(!0), n = r.run(() => e(...a))), Vf(i), n));
}
function $f(e) {
	return /* @__PURE__ */ Wt(/* @__PURE__ */ rn(e) ? new Proxy({}, {
		get(t, n, r) {
			return N(Reflect.get(e.value, n, r));
		},
		set(t, n, r) {
			return /* @__PURE__ */ rn(e.value[n]) && !/* @__PURE__ */ rn(r) ? e.value[n].value = r : e.value[n] = r, !0;
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
function ep(e) {
	return $f(K(e));
}
function tp(e, ...t) {
	let n = t.flat(), r = n[0];
	return ep(() => Object.fromEntries(typeof r == "function" ? Object.entries(/* @__PURE__ */ pn(e)).filter(([e, t]) => !r(cn(t), e)) : Object.entries(/* @__PURE__ */ pn(e)).filter((e) => !n.includes(e[0]))));
}
function np(e, t = 1e4) {
	return fn((n, r) => {
		let i = cn(e), a, o = () => setTimeout(() => {
			i = cn(e), r();
		}, cn(t));
		return Vf(() => {
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
function rp(e, t) {
	Zf(t) && Wr(e, t);
}
function ip(e, t, n) {
	return F(e, t, {
		...n,
		immediate: !0
	});
}
// node_modules/.pnpm/@vueuse+core@14.4.0_vue@3.5.42_typescript@6.0.3_/node_modules/@vueuse/core/dist/index.js
var ap = Wf ? window : void 0;
Wf && window.document, Wf && window.navigator, Wf && window.location;
function op(e) {
	let t = cn(e);
	return t?.$el ?? t;
}
function sp(...e) {
	let t = (e, t, n, r) => (e.addEventListener(t, n, r), () => e.removeEventListener(t, n, r)), n = K(() => {
		let t = Xf(cn(e[0])).filter((e) => e != null);
		return t.every((e) => typeof e != "string") ? t : void 0;
	});
	return ip(() => [
		n.value?.map((e) => op(e)) ?? [ap].filter((e) => e != null),
		Xf(cn(n.value ? e[1] : e[0])),
		Xf(N(n.value ? e[2] : e[1])),
		cn(n.value ? e[3] : e[2])
	], ([e, n, r, i], a, o) => {
		if (!e?.length || !n?.length || !r?.length) return;
		let s = qf(i) ? { ...i } : i, c = e.flatMap((e) => n.flatMap((n) => r.map((r) => t(e, n, r, s))));
		o(() => {
			c.forEach((e) => e());
		});
	}, { flush: "post" });
}
function cp() {
	let e = /* @__PURE__ */ M(!1), t = Ja();
	return t && Vr(() => {
		e.value = !0;
	}, t), e;
}
/* @__NO_SIDE_EFFECTS__ */
function lp(e) {
	let t = cp();
	return K(() => (t.value, !!e()));
}
function up(e) {
	return typeof e == "function" ? e : typeof e == "string" ? (t) => t.key === e : Array.isArray(e) ? (t) => e.includes(t.key) : () => !0;
}
function dp(...e) {
	let t, n, r = {};
	e.length === 3 ? (t = e[0], n = e[1], r = e[2]) : e.length === 2 ? typeof e[1] == "object" ? (t = !0, n = e[0], r = e[1]) : (t = e[0], n = e[1]) : (t = !0, n = e[0]);
	let { target: i = ap, eventName: a = "keydown", passive: o = !1, dedupe: s = !1 } = r, c = up(t);
	return sp(i, a, (e) => {
		e.repeat && cn(s) || c(e) && n(e);
	}, o);
}
function fp(e) {
	return JSON.parse(JSON.stringify(e));
}
function pp(e, t, n = {}) {
	let { window: r = ap, ...i } = n, a, o = /* @__PURE__ */ lp(() => r && "ResizeObserver" in r), s = () => {
		a &&= (a.disconnect(), void 0);
	}, c = F(K(() => {
		let t = cn(e);
		return Array.isArray(t) ? t.map((e) => op(e)) : [op(t)];
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
	return Vf(l), {
		isSupported: o,
		stop: l
	};
}
function mp(e, t, n, r = {}) {
	var i, a;
	let { clone: o = !1, passive: s = !1, eventName: c, deep: l = !1, defaultValue: u, shouldEmit: d } = r, f = Ja(), p = n || f?.emit || (f == null || (i = f.$emit) == null ? void 0 : i.bind(f)) || (f == null || (a = f.proxy) == null || (a = a.$emit) == null ? void 0 : a.bind(f?.proxy)), m = c;
	t ||= "modelValue", m ||= `update:${t.toString()}`;
	let h = (e) => o ? typeof o == "function" ? o(e) : fp(e) : e, g = () => Gf(e[t]) ? h(e[t]) : u, _ = (e) => {
		d ? d(e) && p(m, e) : p(m, e);
	};
	if (s) {
		let n = /* @__PURE__ */ j(g()), r = !1;
		return F(() => e[t], (e) => {
			r || (r = !0, n.value = h(e), Ln(() => r = !1));
		}), F(n, (n) => {
			!r && (n !== e[t] || l) && _(n);
		}, { deep: l }), n;
	}
	return K({
		get() {
			return g();
		},
		set(e) {
			_(e);
		}
	});
}
// node_modules/.pnpm/reka-ui@2.11.0_vue@3.5.42_typescript@6.0.3_/node_modules/reka-ui/dist/shared/renderSlotFragments.js
function hp(e) {
	return e ? e.flatMap((e) => e.type === R ? hp(e.children) : [e]) : [];
}
// node_modules/.pnpm/reka-ui@2.11.0_vue@3.5.42_typescript@6.0.3_/node_modules/reka-ui/dist/ConfigProvider/ConfigProvider.js
var [gp, _p] = /*#__PURE__*/ Lf("ConfigProvider"), vp = /* @__PURE__ */ new WeakMap();
function yp(e, t) {
	let n = vp.get(e);
	n || (n = {
		owners: /* @__PURE__ */ new Set(),
		original: e.body.style.pointerEvents
	}, vp.set(e, n)), n.owners.add(t), e.body.style.pointerEvents = "none";
}
function bp(e, t) {
	let n = vp.get(e);
	n?.owners.delete(t) && n.owners.size === 0 && (vp.delete(e), e.body.style.pointerEvents = n.original);
}
// node_modules/.pnpm/defu@6.1.7/node_modules/defu/dist/defu.mjs
function xp(e) {
	if (typeof e != "object" || !e) return !1;
	let t = Object.getPrototypeOf(e);
	return t !== null && t !== Object.prototype && Object.getPrototypeOf(t) !== null || Symbol.iterator in e ? !1 : Symbol.toStringTag in e ? Object.prototype.toString.call(e) === "[object Module]" : !0;
}
function Sp(e, t, n = ".", r) {
	if (!xp(t)) return Sp(e, {}, n, r);
	let i = { ...t };
	for (let t of Object.keys(e)) {
		if (t === "__proto__" || t === "constructor") continue;
		let a = e[t];
		a != null && (r && r(i, t, a, n) || (i[t] = Array.isArray(a) && Array.isArray(i[t]) ? [...a, ...i[t]] : xp(a) && xp(i[t]) ? Sp(a, i[t], (n ? `${n}.` : "") + t.toString(), r) : a));
	}
	return i;
}
function Cp(e) {
	return (...t) => t.reduce((t, n) => Sp(t, n, "", e), {});
}
var wp = Cp(), Tp = Symbol("useBodyScrollLock"), Ep = Qf(() => {
	let e = /* @__PURE__ */ j(/* @__PURE__ */ new Map()), t = /* @__PURE__ */ j(), n = K(() => {
		for (let t of e.value.values()) if (t) return !0;
		return !1;
	}), r = gp({ scrollBody: /* @__PURE__ */ j(!0) }), i = null, a = () => {
		document.body.style.paddingRight = "", document.body.style.marginRight = "", bp(document, Tp), document.documentElement.style.removeProperty("--scrollbar-width"), document.body.style.overflow = t.value ?? "", Jf && i?.(), t.value = void 0;
	};
	return F(n, (e, o) => {
		if (!Wf) return;
		if (!e) {
			o && a();
			return;
		}
		t.value === void 0 && (t.value = document.body.style.overflow);
		let s = window.innerWidth - document.documentElement.clientWidth, c = {
			padding: s,
			margin: 0
		}, l = r.scrollBody?.value ? typeof r.scrollBody.value == "object" ? wp({
			padding: r.scrollBody.value.padding === !0 ? s : r.scrollBody.value.padding,
			margin: r.scrollBody.value.margin === !0 ? s : r.scrollBody.value.margin
		}, c) : c : {
			padding: 0,
			margin: 0
		};
		s > 0 && (document.body.style.paddingRight = typeof l.padding == "number" ? `${l.padding}px` : String(l.padding), document.body.style.marginRight = typeof l.margin == "number" ? `${l.margin}px` : String(l.margin), document.documentElement.style.setProperty("--scrollbar-width", `${s}px`), document.body.style.overflow = "hidden"), Jf && (i = sp(document, "touchmove", (e) => kp(e), { passive: !1 })), Ln(() => {
			n.value && (yp(document, Tp), document.body.style.overflow = "hidden");
		});
	}, {
		immediate: !0,
		flush: "sync"
	}), e;
});
function Dp(e) {
	let t = Math.random().toString(36).substring(2, 7), n = Ep();
	n.value.set(t, e ?? !1);
	let r = K({
		get: () => n.value.get(t) ?? !1,
		set: (e) => n.value.set(t, e)
	});
	return rp(() => {
		n.value.delete(t);
	}), r;
}
function Op(e) {
	let t = window.getComputedStyle(e);
	if (t.overflowX === "scroll" || t.overflowY === "scroll" || t.overflowX === "auto" && e.clientWidth < e.scrollWidth || t.overflowY === "auto" && e.clientHeight < e.scrollHeight) return !0;
	{
		let t = e.parentNode;
		return !(t instanceof Element) || t.tagName === "BODY" ? !1 : Op(t);
	}
}
function kp(e) {
	let t = e || window.event, n = t.target;
	return n instanceof Element && Op(n) ? !1 : t.touches.length > 1 || (t.preventDefault && t.cancelable && t.preventDefault(), !1);
}
// node_modules/.pnpm/reka-ui@2.11.0_vue@3.5.42_typescript@6.0.3_/node_modules/reka-ui/dist/shared/useComposing.js
var Ap = /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}\p{Script=Bopomofo}]/u, jp = /android/i;
function Mp() {
	return typeof navigator < "u" && jp.test(navigator.userAgent);
}
function Np(e) {
	let t = /* @__PURE__ */ j(!1), n = /* @__PURE__ */ j(!0), r = /* @__PURE__ */ j(!1), i = K(() => t.value && n.value);
	function a() {
		t.value = !0, n.value = !0, r.value = !1;
	}
	function o(e) {
		e.data && (Ap.test(e.data) ? (n.value = !0, r.value = !0) : Mp() && !r.value && (n.value = !1));
	}
	function s(n) {
		Ln(() => {
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
function Pp(e) {
	let t = gp({ dir: /* @__PURE__ */ j("ltr") });
	return K(() => e?.value || t.dir?.value || "ltr");
}
// node_modules/.pnpm/reka-ui@2.11.0_vue@3.5.42_typescript@6.0.3_/node_modules/reka-ui/dist/shared/useEmitAsProps.js
function Fp(e) {
	let t = Ja(), n = t?.type.emits, r = {};
	return n?.length || console.warn(`No emitted event found. Please check component: ${t?.type.__name}`), n?.forEach((t) => {
		r[ae(k(t))] = (...n) => e(t, ...n);
	}), r;
}
// node_modules/.pnpm/reka-ui@2.11.0_vue@3.5.42_typescript@6.0.3_/node_modules/reka-ui/dist/shared/useFilter.js
function Ip(e) {
	let t = K(() => N(e)), n = K(() => new Intl.Collator("en", {
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
var Lp = 0;
function Rp() {
	tr((e) => {
		if (!Wf) return;
		let t = document.querySelectorAll("[data-reka-focus-guard]");
		document.body.insertAdjacentElement("afterbegin", t[0] ?? zp()), document.body.insertAdjacentElement("beforeend", t[1] ?? zp()), Lp++, e(() => {
			Lp === 1 && document.querySelectorAll("[data-reka-focus-guard]").forEach((e) => e.remove()), Lp--;
		});
	});
}
function zp() {
	let e = document.createElement("span");
	return e.setAttribute("data-reka-focus-guard", ""), e.tabIndex = 0, e.style.outline = "none", e.style.opacity = "0", e.style.position = "fixed", e.style.pointerEvents = "none", e;
}
// node_modules/.pnpm/reka-ui@2.11.0_vue@3.5.42_typescript@6.0.3_/node_modules/reka-ui/dist/shared/useFormControl.js
function Bp(e) {
	return K(() => !cn(e) || !!op(e)?.closest("form"));
}
// node_modules/.pnpm/reka-ui@2.11.0_vue@3.5.42_typescript@6.0.3_/node_modules/reka-ui/dist/shared/useForwardExpose.js
function Vp() {
	let e = Ja(), t = /* @__PURE__ */ j(), n = K(() => r());
	Ur(() => {
		n.value !== r() && sn(t);
	});
	function r() {
		return t.value && "$el" in t.value && ["#text", "#comment"].includes(t.value.$el.nodeName) ? t.value.$el.nextElementSibling : op(t);
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
function Hp(e) {
	let t = Ja(), n = Object.keys(t?.type.props ?? {}).reduce((e, n) => {
		let r = (t?.type.props[n]).default;
		return r !== void 0 && (e[n] = r), e;
	}, {}), r = /* @__PURE__ */ gn(e);
	return K(() => {
		let e = {}, i = t?.vnode.props ?? {};
		return Object.keys(i).forEach((t) => {
			e[k(t)] = i[t];
		}), Object.keys({
			...n,
			...e
		}).reduce((e, t) => (r.value[t] !== void 0 && (e[t] = r.value[t]), e), {});
	});
}
// node_modules/.pnpm/reka-ui@2.11.0_vue@3.5.42_typescript@6.0.3_/node_modules/reka-ui/dist/shared/useForwardPropsEmits.js
function Up(e, t) {
	let n = Hp(e), r = t ? Fp(t) : {};
	return K(() => ({
		...n.value,
		...r
	}));
}
// node_modules/.pnpm/aria-hidden@1.2.6/node_modules/aria-hidden/dist/es2015/index.js
var Wp = function(e) {
	return typeof document > "u" ? null : (Array.isArray(e) ? e[0] : e).ownerDocument.body;
}, Gp = /* @__PURE__ */ new WeakMap(), Kp = /* @__PURE__ */ new WeakMap(), qp = {}, Jp = 0, Yp = function(e) {
	return e && (e.host || Yp(e.parentNode));
}, Xp = function(e, t) {
	return t.map(function(t) {
		if (e.contains(t)) return t;
		var n = Yp(t);
		return n && e.contains(n) ? n : (console.error("aria-hidden", t, "in not contained inside", e, ". Doing nothing"), null);
	}).filter(function(e) {
		return !!e;
	});
}, Zp = function(e, t, n, r) {
	var i = Xp(t, Array.isArray(e) ? e : [e]);
	qp[n] || (qp[n] = /* @__PURE__ */ new WeakMap());
	var a = qp[n], o = [], s = /* @__PURE__ */ new Set(), c = new Set(i), l = function(e) {
		e && !s.has(e) && (s.add(e), l(e.parentNode));
	};
	i.forEach(l);
	var u = function(e) {
		e && !c.has(e) && Array.prototype.forEach.call(e.children, function(e) {
			if (s.has(e)) u(e);
			else try {
				var t = e.getAttribute(r), i = t !== null && t !== "false", c = (Gp.get(e) || 0) + 1, l = (a.get(e) || 0) + 1;
				Gp.set(e, c), a.set(e, l), o.push(e), c === 1 && i && Kp.set(e, !0), l === 1 && e.setAttribute(n, "true"), i || e.setAttribute(r, "true");
			} catch (t) {
				console.error("aria-hidden: cannot operate on ", e, t);
			}
		});
	};
	return u(t), s.clear(), Jp++, function() {
		o.forEach(function(e) {
			var t = Gp.get(e) - 1, i = a.get(e) - 1;
			Gp.set(e, t), a.set(e, i), t || (Kp.has(e) || e.removeAttribute(r), Kp.delete(e)), i || e.removeAttribute(n);
		}), Jp--, Jp || (Gp = /* @__PURE__ */ new WeakMap(), Gp = /* @__PURE__ */ new WeakMap(), Kp = /* @__PURE__ */ new WeakMap(), qp = {});
	};
}, Qp = function(e, t, n) {
	n === void 0 && (n = "data-aria-hidden");
	var r = Array.from(Array.isArray(e) ? e : [e]), i = t || Wp(e);
	return i ? (r.push.apply(r, Array.from(i.querySelectorAll("[aria-live], script"))), Zp(r, i, n, "aria-hidden")) : function() {
		return null;
	};
};
// node_modules/.pnpm/reka-ui@2.11.0_vue@3.5.42_typescript@6.0.3_/node_modules/reka-ui/dist/shared/useHideOthers.js
function $p(e) {
	let t;
	F(() => op(e), (e) => {
		let n = !1;
		try {
			n = !!e?.closest("[popover]:not(:popover-open)");
		} catch {}
		e && !n ? t = Qp(e) : t && t();
	}), Gr(() => {
		t && t();
	});
}
function em(e, t = "reka") {
	if (e) return e;
	let n, r = gp({ useId: void 0 });
	return n = r.useId ? r.useId() : Tr?.(), t ? `${t}-${n}` : n;
}
// node_modules/.pnpm/reka-ui@2.11.0_vue@3.5.42_typescript@6.0.3_/node_modules/reka-ui/dist/shared/useKbd.js
function tm() {
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
function nm(e) {
	let t = /* @__PURE__ */ j(), n = K(() => t.value?.width ?? 0), r = K(() => t.value?.height ?? 0), i;
	return Vr(() => {
		let n = op(e);
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
	}), Gr(() => {
		i?.disconnect(), i = void 0;
	}), {
		width: n,
		height: r
	};
}
// node_modules/.pnpm/reka-ui@2.11.0_vue@3.5.42_typescript@6.0.3_/node_modules/reka-ui/dist/shared/useStateMachine.js
function rm(e, t) {
	let n = /* @__PURE__ */ j(e);
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
function im(e) {
	let t = np("", 1e3);
	return {
		search: t,
		handleTypeaheadSearch: (n, r) => {
			if (t.value += n, e) e(n);
			else {
				let e = Rf(), n = r.map((e) => ({
					...e,
					textValue: e.value?.textValue ?? e.ref.textContent?.trim() ?? ""
				})), i = n.find((t) => t.ref === e), a = om(n.map((e) => e.textValue), t.value, i?.textValue), o = n.find((e) => e.textValue === a);
				return o && o.ref.focus(), o?.ref;
			}
		},
		resetTypeahead: () => {
			t.value = "";
		}
	};
}
function am(e, t) {
	return e.map((n, r) => e[(t + r) % e.length]);
}
function om(e, t, n) {
	let r = t.length > 1 && Array.from(t).every((e) => e === t[0]) ? t[0] : t, i = n ? e.indexOf(n) : -1, a = am(e, Math.max(i, 0));
	r.length === 1 && (a = a.filter((e) => e !== n));
	let o = a.find((e) => e.toLowerCase().startsWith(r.toLowerCase()));
	return o === n ? void 0 : o;
}
// node_modules/.pnpm/reka-ui@2.11.0_vue@3.5.42_typescript@6.0.3_/node_modules/reka-ui/dist/Presence/usePresence.js
function sm(e, t) {
	let n = /* @__PURE__ */ j({}), r = /* @__PURE__ */ j("none"), i = /* @__PURE__ */ j(e), a = e.value ? "mounted" : "unmounted", o, s = t.value?.ownerDocument.defaultView ?? ap, { state: c, dispatch: l } = rm(a, {
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
		if (Wf) {
			let n = new CustomEvent(e, {
				bubbles: !1,
				cancelable: !1
			});
			t.value?.dispatchEvent(n);
		}
	};
	F(e, async (e, i) => {
		let a = i !== e;
		if (await Ln(), a) {
			let a = r.value, o = cm(t.value);
			e ? (l("MOUNT"), u("enter"), o === "none" && u("after-enter")) : o === "none" || o === "undefined" || n.value?.display === "none" ? (l("UNMOUNT"), u("leave"), u("after-leave")) : i && a !== o ? (l("ANIMATION_OUT"), u("leave")) : (l("UNMOUNT"), u("after-leave"));
		}
	}, { immediate: !0 });
	let d = (e) => {
		if (e.target !== t.value) return;
		let n = cm(t.value), r = n.includes(CSS.escape(e.animationName)), a = c.value === "mounted" ? "enter" : "leave";
		if (r && (u(`after-${a}`), l("ANIMATION_END"), !i.value)) {
			let e = t.value.style.animationFillMode;
			t.value.style.animationFillMode = "forwards", o = s?.setTimeout(() => {
				t.value?.style.animationFillMode === "forwards" && (t.value.style.animationFillMode = e);
			});
		}
		n === "none" && l("ANIMATION_END");
	}, f = (e) => {
		e.target === t.value && (r.value = cm(t.value));
	}, p = F(t, (e, t) => {
		e ? (n.value = getComputedStyle(e), e.addEventListener("animationstart", f), e.addEventListener("animationcancel", d), e.addEventListener("animationend", d)) : (l("ANIMATION_END"), o !== void 0 && s?.clearTimeout(o), t?.removeEventListener("animationstart", f), t?.removeEventListener("animationcancel", d), t?.removeEventListener("animationend", d));
	}, { immediate: !0 }), m = F(c, () => {
		let e = cm(t.value);
		r.value = c.value === "mounted" ? e : "none";
	});
	return Gr(() => {
		p(), m(), t.value && (t.value.removeEventListener("animationstart", f), t.value.removeEventListener("animationcancel", d), t.value.removeEventListener("animationend", d)), o !== void 0 && s?.clearTimeout(o);
	}), { isPresent: K(() => ["mounted", "unmountSuspended"].includes(c.value)) };
}
function cm(e) {
	return e && getComputedStyle(e).animationName || "none";
}
// node_modules/.pnpm/reka-ui@2.11.0_vue@3.5.42_typescript@6.0.3_/node_modules/reka-ui/dist/Presence/Presence.js
var lm = /*#__PURE__*/ I({
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
		let { present: r, forceMount: i } = /* @__PURE__ */ pn(e), a = /* @__PURE__ */ j(), { isPresent: o } = sm(r, a);
		n({ present: o });
		let s = t.default({ present: o.value });
		s = hp(s || []);
		let c = Ja();
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
		return () => i.value || r.value || o.value ? uo(t.default({ present: o.value })[0], { ref: (e) => {
			let t = op(e);
			return t?.hasAttribute === void 0 || (t?.hasAttribute("data-reka-popper-content-wrapper") ? a.value = t.firstElementChild : a.value = t), t;
		} }) : null;
	}
}), um = /*#__PURE__*/ I({
	name: "PrimitiveSlot",
	inheritAttrs: !1,
	setup(e, { attrs: t, slots: n }) {
		return () => {
			if (!n.default) return null;
			let e = hp(n.default()), r = e.findIndex((e) => e.type !== wa);
			if (r === -1) return e;
			let i = e[r];
			delete i.props?.ref;
			let a = i.props ? G(t, i.props) : t, o = Ra({
				...i,
				props: {}
			}, a);
			return e.length === 1 ? o : (e[r] = o, e);
		};
	}
}), dm = [
	"area",
	"img",
	"input"
], fm = /*#__PURE__*/ I({
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
		return typeof r == "string" && dm.includes(r) ? () => uo(r, t) : r === "template" ? () => uo(um, t, { default: n.default }) : () => uo(e.as, t, { default: n.default });
	}
});
// node_modules/.pnpm/reka-ui@2.11.0_vue@3.5.42_typescript@6.0.3_/node_modules/reka-ui/dist/Primitive/usePrimitiveElement.js
function pm() {
	let e = /* @__PURE__ */ j();
	return {
		primitiveElement: e,
		currentElement: K(() => ["#text", "#comment"].includes(e.value?.$el.nodeName) ? e.value?.$el.nextElementSibling : op(e))
	};
}
// node_modules/.pnpm/reka-ui@2.11.0_vue@3.5.42_typescript@6.0.3_/node_modules/reka-ui/dist/DismissableLayer/utils.js
var mm = "dismissableLayer.pointerDownOutside", hm = "dismissableLayer.focusOutside";
function gm(e) {
	if (typeof e != "object" || !e) return !1;
	let t = e.ownerDocument?.defaultView;
	return typeof Element < "u" && e instanceof Element || !!t && e instanceof t.Element;
}
function _m(e, t) {
	if (!gm(t)) return !1;
	if (e.contains(t)) return !0;
	let n = t.closest("[data-dismissable-layer]"), r = e.dataset.dismissableLayer === "" ? e : e.querySelector("[data-dismissable-layer]"), i = Array.from(e.ownerDocument.querySelectorAll("[data-dismissable-layer]"));
	return !!(n && (r === n || i.indexOf(r) < i.indexOf(n)));
}
function vm(e, t, n = !0) {
	let r = /* @__PURE__ */ j(!1), i = /* @__PURE__ */ j(() => {});
	return tr((a) => {
		if (!Wf || !cn(n)) return;
		let o = t?.value?.ownerDocument ?? globalThis.document, s = async (n) => {
			let a = n.target;
			if (t?.value && a) {
				if (_m(t.value, a)) o.removeEventListener("click", i.value), r.value = !1;
				else {
					if (n.target && !r.value) {
						let t = { originalEvent: n };
						function r() {
							zf(mm, e, t);
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
		cn(n) && (r.value = !0);
	} };
}
function ym(e, t, n = !0) {
	let r = /* @__PURE__ */ j(!1);
	return tr((i) => {
		if (!Wf || !cn(n)) return;
		let a = t?.value?.ownerDocument ?? globalThis.document, o = async (n) => {
			if (!t?.value) return;
			await Ln(), await Ln();
			let i = n.target;
			t.value && i && !_m(t.value, i) && n.target && !r.value && zf(hm, e, { originalEvent: n });
		};
		a.addEventListener("focusin", o), i(() => a.removeEventListener("focusin", o));
	}), {
		onFocusCapture: () => {
			cn(n) && (r.value = !0);
		},
		onBlurCapture: () => {
			cn(n) && (r.value = !1);
		}
	};
}
// node_modules/.pnpm/reka-ui@2.11.0_vue@3.5.42_typescript@6.0.3_/node_modules/reka-ui/dist/DismissableLayer/context.js
var bm = /*#__PURE__*/ Wt({
	layersRoot: /* @__PURE__ */ new Set(),
	layersWithOutsidePointerEventsDisabled: /* @__PURE__ */ new Set(),
	branches: /* @__PURE__ */ new Set()
}), xm = /* @__PURE__ */ I({
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
		let n = e, r = t, { forwardRef: i, currentElement: a } = Vp(), o = K(() => a.value?.ownerDocument ?? globalThis.document), s = K(() => bm.layersRoot), c = K(() => a.value ? Array.from(s.value).indexOf(a.value) : -1), l = K(() => bm.layersWithOutsidePointerEventsDisabled.size > 0), u = K(() => {
			let e = Array.from(s.value), [t] = [...bm.layersWithOutsidePointerEventsDisabled].slice(-1), n = e.indexOf(t);
			return c.value >= n;
		}), d = vm(async (e) => {
			let t = [...bm.branches].some((t) => t?.contains(e.target));
			n.present && u.value && !t && (r("pointerDownOutside", e), r("interactOutside", e), await Ln(), e.defaultPrevented || r("dismiss"));
		}, a, () => n.present), f = ym((e) => {
			let t = [...bm.branches].some((t) => t?.contains(e.target));
			n.present && !t && (r("focusOutside", e), r("interactOutside", e), e.defaultPrevented || r("dismiss"));
		}, a);
		return dp("Escape", (e) => {
			n.present && c.value === s.value.size - 1 && (r("escapeKeyDown", e), e.defaultPrevented || r("dismiss"));
		}, { target: () => o.value?.defaultView ?? globalThis.window }), F([
			a,
			() => n.disableOutsidePointerEvents,
			() => n.present
		], ([e, t, n], r, i) => {
			if (e && n && t) {
				let t = e.ownerDocument;
				yp(t, e), bm.layersWithOutsidePointerEventsDisabled.add(e), i(() => {
					bm.layersWithOutsidePointerEventsDisabled.delete(e), bp(t, e);
				});
			}
		}, { immediate: !0 }), F([a, () => n.present], ([e, t], n, r) => {
			e && t && (s.value.add(e), r(() => {
				s.value.delete(e);
			}));
		}, { immediate: !0 }), tr((e) => {
			e(() => {
				a.value && (s.value.delete(a.value), bm.layersWithOutsidePointerEventsDisabled.delete(a.value));
			});
		}), (t, n) => (z(), V(N(fm), {
			ref: N(i),
			"as-child": e.asChild,
			as: e.as,
			"data-dismissable-layer": "",
			style: fe({ pointerEvents: l.value ? u.value ? "auto" : "none" : void 0 }),
			onFocusCapture: N(f).onFocusCapture,
			onBlurCapture: N(f).onBlurCapture,
			onPointerdownCapture: N(d).onPointerDownCapture
		}, {
			default: P(() => [L(t.$slots, "default")]),
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
}), Sm = Uf(() => /* @__PURE__ */ j([]));
function Cm() {
	let e = Sm();
	return {
		add(t) {
			let n = e.value[0];
			t !== n && n?.pause(), e.value = wm(e.value, t), e.value.unshift(t);
		},
		remove(t) {
			e.value = wm(e.value, t), e.value[0]?.resume();
		}
	};
}
function wm(e, t) {
	let n = [...e], r = n.indexOf(t);
	return r !== -1 && n.splice(r, 1), n;
}
// node_modules/.pnpm/reka-ui@2.11.0_vue@3.5.42_typescript@6.0.3_/node_modules/reka-ui/dist/FocusScope/utils.js
var Tm = "focusScope.autoFocusOnMount", Em = "focusScope.autoFocusOnUnmount", Dm = {
	bubbles: !1,
	cancelable: !0
};
function Om(e, t) {
	let n = t;
	for (; n;) {
		if (e.contains(n)) return !0;
		n = n.getRootNode().host ?? null;
	}
	return !1;
}
function km(e, { select: t = !1 } = {}) {
	let n = Rf();
	for (let r of e) if (Fm(r, { select: t }), Rf() !== n) return !0;
}
function Am(e) {
	let t = jm(e);
	return [Mm(t, e), Mm(t.reverse(), e)];
}
function jm(e) {
	let t = [], n = document.createTreeWalker(e, NodeFilter.SHOW_ELEMENT, { acceptNode: (e) => {
		let t = e.tagName === "INPUT" && e.type === "hidden";
		return e.disabled || e.hidden || t ? NodeFilter.FILTER_SKIP : e.tabIndex >= 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
	} });
	for (; n.nextNode();) t.push(n.currentNode);
	return t.sort((e, t) => e.tabIndex === t.tabIndex ? 0 : e.tabIndex === 0 ? 1 : t.tabIndex === 0 ? -1 : e.tabIndex - t.tabIndex);
}
function Mm(e, t) {
	for (let n of e) if (!Nm(n, { upTo: t })) return n;
}
function Nm(e, { upTo: t }) {
	if (getComputedStyle(e).visibility === "hidden") return !0;
	for (; e;) {
		if (t !== void 0 && e === t) return !1;
		if (getComputedStyle(e).display === "none") return !0;
		e = e.parentElement;
	}
	return !1;
}
function Pm(e) {
	return e instanceof HTMLInputElement && "select" in e;
}
function Fm(e, { select: t = !1 } = {}) {
	if (e && e.focus) {
		let n = Rf();
		e.focus({ preventScroll: !0 }), e !== n && Pm(e) && t && e.select();
	}
}
// node_modules/.pnpm/reka-ui@2.11.0_vue@3.5.42_typescript@6.0.3_/node_modules/reka-ui/dist/FocusScope/FocusScope.js
var Im = /* @__PURE__ */ I({
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
		let n = e, r = t, { currentRef: i, currentElement: a } = Vp(), o = /* @__PURE__ */ j(null), s = Cm(), c = /*#__PURE__*/ Wt({
			paused: !1,
			pause() {
				this.paused = !0;
			},
			resume() {
				this.paused = !1;
			}
		});
		tr((e) => {
			if (!Wf) return;
			let t = a.value;
			if (!n.trapped) return;
			let r = t?.ownerDocument ?? document, i = t ? t.getRootNode() : r;
			function s(e) {
				if (c.paused || !t) return;
				let n = e.target;
				t.contains(n) ? o.value = n : Fm(o.value, { select: !0 });
			}
			function l(e) {
				if (c.paused || !t) return;
				let n = e.relatedTarget;
				n !== null && (t.contains(n) || Fm(o.value, { select: !0 }));
			}
			function u(e) {
				let n = o.value;
				if (n === null || !e.some((e) => e.removedNodes.length > 0)) return;
				let r = Rf();
				r && t.contains(r) || t.contains(n) || Fm(t);
			}
			function d(e) {
				if (c.paused || !t) return;
				let n = e.composedPath()[0];
				Om(t, n) || Fm(o.value, { select: !0 });
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
			let n = new CustomEvent(Tm, Dm), i = (e) => r("mountAutoFocus", e);
			e.addEventListener(Tm, i), e.dispatchEvent(n), e.removeEventListener(Tm, i), n.defaultPrevented || (km(jm(e), { select: !0 }), Rf() === t && Fm(e));
		}
		tr(async (e) => {
			let t = a.value;
			if (await Ln(), !t) return;
			n.present !== !1 && s.add(c);
			let i = Rf();
			!t.contains(i) && n.present !== !1 && l(t, i), e(() => {
				let e = new CustomEvent(Em, Dm), n = (e) => {
					r("unmountAutoFocus", e);
				};
				t.addEventListener(Em, n), t.dispatchEvent(e), t.setAttribute("data-focus-scope-unmounting", ""), setTimeout(() => {
					e.defaultPrevented || Fm(i ?? document.body, { select: !0 }), t.removeEventListener(Em, n), s.remove(c), t.removeAttribute("data-focus-scope-unmounting");
				}, 0);
			});
		}), F(() => n.present, async (e, t) => {
			if (!Wf) return;
			if (e === !1 && t === !0) {
				s.remove(c);
				return;
			}
			if (e !== !0 || t !== !1) return;
			s.add(c), await Ln();
			let n = a.value;
			if (!n) return;
			let r = Rf();
			n.contains(r) || l(n, r);
		});
		function u(e) {
			if (!n.loop && !n.trapped || c.paused) return;
			let t = e.key === "Tab" && !e.altKey && !e.ctrlKey && !e.metaKey, r = Rf();
			if (t && r) {
				let t = e.currentTarget, [i, a] = Am(t);
				i && a ? !e.shiftKey && r === a ? (e.preventDefault(), n.loop && Fm(i, { select: !0 })) : e.shiftKey && r === i && (e.preventDefault(), n.loop && Fm(a, { select: !0 })) : r === t && e.preventDefault();
			}
		}
		return (t, n) => (z(), V(N(fm), {
			ref_key: "currentRef",
			ref: i,
			tabindex: "-1",
			"as-child": e.asChild,
			as: e.as,
			onKeydown: u
		}, {
			default: P(() => [L(t.$slots, "default")]),
			_: 3
		}, 8, ["as-child", "as"]));
	}
}), Lm = ["Enter", " "], Rm = [
	"ArrowDown",
	"PageUp",
	"Home"
], zm = [
	"ArrowUp",
	"PageDown",
	"End"
];
[...Rm, ...zm], [...Lm], [...Lm];
function Bm(e) {
	let t = Rf();
	for (let n of e) if (n === t || (n.focus(), Rf() !== t)) return;
}
// node_modules/.pnpm/reka-ui@2.11.0_vue@3.5.42_typescript@6.0.3_/node_modules/reka-ui/dist/Teleport/Teleport.js
var Vm = /* @__PURE__ */ I({
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
		let t = e, n = gp({}), r = K(() => t.to ?? n.teleportTo?.value ?? "body"), i = cp();
		return (t, n) => N(i) || e.forceMount ? (z(), V(vr, {
			key: 0,
			to: r.value,
			disabled: e.disabled,
			defer: e.defer
		}, [L(t.$slots, "default")], 8, [
			"to",
			"disabled",
			"defer"
		])) : za("v-if", !0);
	}
}), Hm = "data-reka-collection-item";
function Um(e = {}) {
	let { key: t = "", isProvider: n = !1 } = e, r = `${t}CollectionProvider`, i;
	n ? (i = {
		collectionRef: /* @__PURE__ */ j(),
		itemMap: /* @__PURE__ */ j(/* @__PURE__ */ new Map())
	}, Zn(r, i)) : i = Qn(r);
	let a = (e, t = !1) => {
		if (!i.collectionRef.value) return;
		let n = i.itemMap.value.get(e);
		return n && (t || n.ref.dataset.disabled !== "") ? n : void 0;
	}, o = (e = !1) => {
		let t = i.collectionRef.value;
		if (!t) return [];
		let n = Array.from(t.querySelectorAll(`[${Hm}]`)), r = new Map(n.map((e, t) => [e, t])), a = Array.from(i.itemMap.value.values()).sort((e, t) => (r.get(e.ref) ?? -1) - (r.get(t.ref) ?? -1));
		return e ? a : a.filter((e) => e.ref.dataset.disabled !== "");
	}, s = /*#__PURE__*/ I({
		name: "CollectionSlot",
		inheritAttrs: !1,
		setup(e, { slots: t, attrs: n }) {
			let { primitiveElement: r, currentElement: a } = pm();
			return F(a, () => {
				i.collectionRef.value = a.value;
			}), () => uo(um, {
				ref: r,
				...n
			}, t);
		}
	}), c = /*#__PURE__*/ I({
		name: "CollectionItem",
		inheritAttrs: !1,
		props: { value: { validator: () => !0 } },
		setup(e, { slots: t, attrs: n }) {
			let { primitiveElement: r, currentElement: a } = pm();
			return tr((t) => {
				if (a.value) {
					let n = en(a.value);
					i.itemMap.value.set(n, {
						ref: a.value,
						value: e.value
					}), t(() => i.itemMap.value.delete(n));
				}
			}), () => uo(um, {
				...n,
				[Hm]: "",
				ref: r
			}, t);
		}
	});
	return {
		getItems: o,
		getItem: a,
		reactiveItems: K(() => Array.from(i.itemMap.value.values())),
		itemMapSize: K(() => i.itemMap.value.size),
		CollectionSlot: s,
		CollectionItem: c
	};
}
// node_modules/.pnpm/reka-ui@2.11.0_vue@3.5.42_typescript@6.0.3_/node_modules/reka-ui/dist/VisuallyHidden/VisuallyHidden.js
var Wm = /* @__PURE__ */ I({
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
		return (t, n) => (z(), V(N(fm), {
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
			default: P(() => [L(t.$slots, "default")]),
			_: 3
		}, 8, [
			"as",
			"as-child",
			"aria-hidden",
			"data-hidden",
			"tabindex"
		]));
	}
}), Gm = /* @__PURE__ */ I({
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
		let t = e, { primitiveElement: n, currentElement: r } = pm();
		return F(K(() => t.checked ?? t.value), (e, t) => {
			if (!r.value) return;
			let n = r.value, i = window.HTMLInputElement.prototype, a = Object.getOwnPropertyDescriptor(i, "value").set;
			if (a && e !== t) {
				let t = new Event("input", { bubbles: !0 }), r = new Event("change", { bubbles: !0 });
				a.call(n, e), n.dispatchEvent(t), n.dispatchEvent(r);
			}
		}), (e, r) => (z(), V(Wm, G({
			ref_key: "primitiveElement",
			ref: n
		}, {
			...t,
			...e.$attrs
		}, { as: "input" }), null, 16));
	}
}), Km = /* @__PURE__ */ I({
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
		let t = e, n = K(() => typeof t.value == "object" && Array.isArray(t.value) && t.value.length === 0 && t.required), r = K(() => typeof t.value == "string" || typeof t.value == "number" || typeof t.value == "boolean" || t.value === null || t.value === void 0 ? [{
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
		return (i, a) => (z(), B(R, null, [za(" We render single input if it's required "), n.value ? (z(), V(Gm, G({ key: e.name }, {
			...t,
			...i.$attrs
		}, {
			name: e.name,
			value: e.value
		}), null, 16, ["name", "value"])) : (z(!0), B(R, { key: 1 }, ti(r.value, (e) => (z(), V(Gm, G({ key: e.name }, { ref_for: !0 }, {
			...t,
			...i.$attrs
		}, {
			name: e.name,
			value: e.value
		}), null, 16, ["name", "value"]))), 128))], 2112));
	}
});
// node_modules/.pnpm/reka-ui@2.11.0_vue@3.5.42_typescript@6.0.3_/node_modules/reka-ui/dist/Listbox/utils.js
function qm(e, t, n) {
	return e === void 0 ? !1 : Array.isArray(e) ? e.some((e) => Jm(e, t, n)) : Jm(e, t, n);
}
function Jm(e, t, n) {
	return e === void 0 || t === void 0 ? !1 : typeof e == "string" ? e === t : typeof n == "function" ? n(e, t) : typeof n == "string" ? e?.[n] === t?.[n] : Pf(e, t);
}
// node_modules/.pnpm/reka-ui@2.11.0_vue@3.5.42_typescript@6.0.3_/node_modules/reka-ui/dist/RovingFocus/utils.js
var Ym = {
	ArrowLeft: "prev",
	ArrowUp: "prev",
	ArrowRight: "next",
	ArrowDown: "next",
	PageUp: "first",
	Home: "first",
	PageDown: "last",
	End: "last"
};
function Xm(e, t) {
	return t === "rtl" ? e === "ArrowLeft" ? "ArrowRight" : e === "ArrowRight" ? "ArrowLeft" : e : e;
}
function Zm(e, t, n) {
	let r = Xm(e.key, n);
	if (!(t === "vertical" && ["ArrowLeft", "ArrowRight"].includes(r)) && !(t === "horizontal" && ["ArrowUp", "ArrowDown"].includes(r))) return Ym[r];
}
// node_modules/.pnpm/reka-ui@2.11.0_vue@3.5.42_typescript@6.0.3_/node_modules/reka-ui/dist/Listbox/ListboxRoot.js
var [Qm, $m] = /*#__PURE__*/ Lf("ListboxRoot"), [eh, th] = /*#__PURE__*/ Lf("ListboxHighlightScroll"), nh = /* @__PURE__ */ I({
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
		let r = e, i = n, { multiple: a, highlightOnHover: o, loop: s, orientation: c, disabled: l, selectionBehavior: u, dir: d } = /* @__PURE__ */ pn(r), { getItems: f, getItem: p } = Um({ isProvider: !0 }), { handleTypeaheadSearch: m } = im(), { primitiveElement: h, currentElement: g } = pm(), _ = tm(), v = Pp(d), y = eh(null);
		th({
			suppressHighlightScroll: /* @__PURE__ */ j(!1),
			onHighlightScrollRequest: () => {}
		});
		let b = Bp(g), x = /* @__PURE__ */ j(), S = /* @__PURE__ */ j(!1), C = /* @__PURE__ */ j(!0), w = mp(r, "modelValue", i, {
			defaultValue: r.defaultValue ?? (a.value ? [] : void 0),
			passive: r.modelValue === void 0,
			deep: !0
		});
		function T(e) {
			if (S.value = !0, r.multiple) {
				let t = Array.isArray(w.value) ? [...w.value] : [], n = t.findIndex((t) => Jm(t, e, r.by));
				r.selectionBehavior === "toggle" ? (n === -1 ? t.push(e) : t.splice(n, 1), w.value = t) : (w.value = [e], x.value = e);
			} else r.selectionBehavior === "toggle" && Jm(w.value, e, r.by) ? w.value = void 0 : w.value = e;
			setTimeout(() => {
				S.value = !1;
			}, 1);
		}
		let E = /* @__PURE__ */ j(null), D = /* @__PURE__ */ j(null), O = /* @__PURE__ */ j(!1), ee = /* @__PURE__ */ j(!1), te = Hf(), k = Hf(), ne = Hf();
		function re() {
			return f().map((e) => e.ref).filter((e) => e.dataset.disabled !== "");
		}
		function ie(e, t = !0, n) {
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
		function ae(e) {
			if (O.value) ne.trigger(e);
			else {
				let t = f().find((t) => Jm(t.value, e, r.by));
				t && (E.value = t.ref, ie(t.ref));
			}
		}
		function oe(e) {
			if (E.value && E.value.isConnected) {
				if (e.ctrlKey || e.metaKey || e.altKey) return;
				e.preventDefault(), e.stopPropagation(), ee.value || E.value.click();
			}
		}
		function se(e) {
			if (C.value) {
				if (S.value = !0, O.value) k.trigger(e);
				else {
					let t = e.altKey || e.ctrlKey || e.metaKey;
					if (t && e.key === "a" && a.value) {
						let t = f(), n = t.map((e) => e.value);
						w.value = [...n], e.preventDefault();
						let r = t.at(-1);
						r && ie(r.ref);
					} else if (!t) {
						let t = m(e.key, f());
						t && ie(t);
					}
				}
				setTimeout(() => {
					S.value = !1;
				}, 1);
			}
		}
		function ce() {
			ee.value = !0;
		}
		function le() {
			Ln(() => {
				ee.value = !1;
			});
		}
		function ue() {
			Ln(() => {
				me(new KeyboardEvent("keydown", { key: "PageUp" }));
			});
		}
		function de(e) {
			let t = E.value;
			t?.isConnected && (D.value = t), E.value = null, i("leave", e);
		}
		function fe(e) {
			let t = new CustomEvent("listbox.entryFocus", {
				bubbles: !1,
				cancelable: !0
			});
			if (e.currentTarget?.dispatchEvent(t), i("entryFocus", t), !t.defaultPrevented) {
				if (D.value) ie(D.value);
				else {
					let e = re()?.[0];
					ie(e);
				}
			}
		}
		function pe(e) {
			let t = f(!0).map((e) => e.ref), n = e === "next" ? t.at(-1) : t[0];
			if (!n) return !1;
			let r = Number(n.getAttribute("aria-posinset")), i = Number(n.getAttribute("aria-setsize"));
			return e === "next" ? r === i : r === 1;
		}
		function me(e) {
			let t = Zm(e, c.value, v.value);
			if (!t) return;
			let n = re();
			if (E.value) {
				if (t === "last") n.reverse();
				else if (t === "prev" || t === "next") {
					t === "prev" && n.reverse();
					let r = n.indexOf(E.value), i = s.value && r === n.length - 1;
					if (i && O.value) {
						if (pe(t)) {
							let n = t === "next" ? _.HOME : _.END;
							return k.trigger(new KeyboardEvent("keydown", {
								key: n,
								shiftKey: e.shiftKey
							}));
						}
						n = [];
					} else n = i ? n.slice(0, 1) : n.slice(r + 1);
				}
				he(e, n[0]);
			}
			if (n.length) {
				let e = !E.value && t === "prev" ? n.length - 1 : 0;
				ie(n[e]);
			}
			if (O.value) return k.trigger(e);
		}
		function he(e, t) {
			if (!O.value && r.selectionBehavior === "replace" && a.value && Array.isArray(w.value) && (!e.altKey && !e.ctrlKey && !e.metaKey || e.shiftKey) && e.shiftKey) {
				let n = f().filter((e) => e.ref.dataset.disabled !== ""), r = n.find((e) => e.ref === t)?.value;
				if (e.key === _.END ? r = n.at(-1)?.value : e.key === _.HOME && (r = n[0]?.value), !r || !x.value) return;
				let i = Ff(n.map((e) => e.value), x.value, r);
				w.value = i;
			}
		}
		async function ge(e, t = !0) {
			if (Wf) {
				if (await Ln(), O.value) te.trigger({
					event: e,
					scroll: t
				});
				else {
					let e = re(), n = e.find((e) => e.dataset.state === "checked"), r = t ? void 0 : !1;
					n ? ie(n, t, r) : e.length && ie(e[0], t, r);
				}
			}
		}
		let _e = !1;
		return F(w, () => {
			if (!S.value) {
				let e = _e;
				_e = !0, Ln(() => {
					ge(void 0, e);
				});
			}
		}, {
			immediate: !0,
			deep: !0
		}), t({
			highlightedElement: E,
			highlightItem: ae,
			highlightFirstItem: ue,
			highlightSelected: ge,
			getItems: f
		}), $m({
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
			virtualFocusHook: te,
			virtualKeydownHook: k,
			virtualHighlightHook: ne,
			by: r.by,
			firstValue: x,
			selectionBehavior: u,
			focusable: C,
			onLeave: de,
			onEnter: fe,
			changeHighlight: ie,
			onKeydownEnter: oe,
			onKeydownNavigation: me,
			onKeydownTypeAhead: se,
			onCompositionStart: ce,
			onCompositionEnd: le,
			highlightFirstItem: ue
		}), (t, n) => (z(), V(N(fm), {
			ref_key: "primitiveElement",
			ref: h,
			as: e.as,
			"as-child": e.asChild,
			dir: N(v),
			"data-disabled": N(l) ? "" : void 0,
			onPointerleave: de,
			onFocusout: n[0] ||= async (e) => {
				let t = e.relatedTarget || e.target;
				await Ln(), E.value && N(g) && !N(g).contains(t) && de(e);
			}
		}, {
			default: P(() => [L(t.$slots, "default", { modelValue: N(w) }), N(b) && e.name ? (z(), V(N(Km), {
				key: 0,
				name: e.name,
				value: N(w),
				disabled: N(l),
				required: e.required
			}, null, 8, [
				"name",
				"value",
				"disabled",
				"required"
			])) : za("v-if", !0)]),
			_: 3
		}, 8, [
			"as",
			"as-child",
			"dir",
			"data-disabled"
		]));
	}
}), rh = /* @__PURE__ */ I({
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
		let { CollectionSlot: t } = Um(), n = Qm(), r = np(!1, 10);
		return (i, a) => (z(), V(N(t), null, {
			default: P(() => [U(N(fm), {
				role: "listbox",
				as: e.as,
				"as-child": e.asChild,
				tabindex: N(n).focusable.value ? N(n).highlightedElement.value ? "-1" : "0" : "-1",
				"aria-orientation": N(n).orientation.value,
				"aria-multiselectable": !!N(n).multiple.value,
				"data-orientation": N(n).orientation.value,
				onMousedown: a[0] ||= ds((e) => r.value = !0, ["left"]),
				onFocus: a[1] ||= (e) => {
					N(r) || N(n).onEnter(e);
				},
				onKeydown: [
					a[2] ||= ps((e) => {
						(N(n).orientation.value !== "vertical" || e.key !== "ArrowLeft" && e.key !== "ArrowRight") && (N(n).orientation.value !== "horizontal" || e.key !== "ArrowUp" && e.key !== "ArrowDown") && (e.preventDefault(), N(n).focusable.value && N(n).onKeydownNavigation(e));
					}, [
						"down",
						"up",
						"left",
						"right",
						"home",
						"end"
					]),
					ps(N(n).onKeydownEnter, ["enter"]),
					N(n).onKeydownTypeAhead
				]
			}, {
				default: P(() => [L(i.$slots, "default")]),
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
}), ih = /* @__PURE__ */ I({
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
		let n = e, r = mp(n, "modelValue", t, {
			defaultValue: "",
			passive: n.modelValue === void 0
		}), i = Qm(), { primitiveElement: a, currentElement: o } = pm(), s = K(() => n.disabled || i.disabled.value || !1), c = /* @__PURE__ */ j();
		rr(() => c.value = i.highlightedElement.value?.id), Vr(() => {
			i.focusable.value = !1, setTimeout(() => {
				n.autoFocus && o.value?.focus();
			}, 1);
		}), Gr(() => {
			i.focusable.value = !0;
		});
		let { isComposing: l, shouldDeferInput: u, handleCompositionStart: d, handleCompositionUpdate: f, handleCompositionEnd: p } = Np((e) => {
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
		return (t, n) => (z(), V(N(fm), {
			ref_key: "primitiveElement",
			ref: a,
			as: e.as,
			"as-child": e.asChild,
			value: N(r),
			disabled: s.value ? "" : void 0,
			"data-disabled": s.value ? "" : void 0,
			"aria-disabled": s.value ?? void 0,
			"aria-activedescendant": c.value,
			type: "text",
			onKeydown: [ps(g, [
				"down",
				"up",
				"home",
				"end"
			]), ps(_, ["enter"])],
			onInput: h,
			onCompositionstart: m,
			onCompositionupdate: N(f),
			onCompositionend: N(p)
		}, {
			default: P(() => [L(t.$slots, "default", { modelValue: N(r) })]),
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
}), ah = "listbox.select", [oh, sh] = /*#__PURE__*/ Lf("ListboxItem"), ch = /* @__PURE__ */ I({
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
		let n = e, r = t, i = em(void 0, "reka-listbox-item"), { CollectionItem: a } = Um(), { forwardRef: o, currentElement: s } = Vp(), c = Qm(), l = K(() => s.value != null && s.value === c.highlightedElement.value), u = K(() => qm(c.modelValue.value, n.value, c.by)), d = K(() => c.disabled.value || n.disabled);
		async function f(e) {
			r("select", e), e?.defaultPrevented || !d.value && e && (c.onValueChange(n.value), c.changeHighlight(s.value));
		}
		function p(e) {
			zf(ah, f, {
				originalEvent: e,
				value: n.value
			});
		}
		return sh({ isSelected: u }), (t, n) => (z(), V(N(a), { value: e.value }, {
			default: P(() => [fo([
				l.value,
				u.value,
				d.value,
				N(c).focusable.value,
				...Object.entries(t.$attrs).flat()
			], () => U(N(fm), G({ id: N(i) }, t.$attrs, {
				ref: N(o),
				role: "option",
				tabindex: N(c).focusable.value ? l.value ? "0" : "-1" : -1,
				"aria-selected": u.value,
				as: e.as,
				"as-child": e.asChild,
				disabled: d.value ? "" : void 0,
				"data-disabled": d.value ? "" : void 0,
				"data-highlighted": l.value ? "" : void 0,
				"data-state": u.value ? "checked" : "unchecked",
				onClick: p,
				onKeydown: ps(ds(p, ["prevent"]), ["space"]),
				onPointermove: n[0] ||= () => {
					N(c).highlightedElement.value !== N(s) && N(c).highlightOnHover.value && N(c).changeHighlight(N(s), !1, !1);
				}
			}), {
				default: P(() => [L(t.$slots, "default", { selected: u.value })]),
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
}), lh = /* @__PURE__ */ I({
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
		let { forwardRef: t } = Vp(), n = oh();
		return (r, i) => (z(), V(N(lm), { present: e.forceMount || N(n).isSelected.value }, {
			default: P(() => [U(N(fm), {
				ref: N(t),
				"aria-hidden": "true",
				"data-state": N(n).isSelected.value ? "checked" : "unchecked",
				as: e.as,
				"as-child": e.asChild
			}, {
				default: P(() => [L(r.$slots, "default")]),
				_: 3
			}, 8, [
				"data-state",
				"as",
				"as-child"
			])]),
			_: 3
		}, 8, ["present"]));
	}
}), [uh, dh] = /*#__PURE__*/ Lf("PopperRoot"), fh = /* @__PURE__ */ I({
	inheritAttrs: !1,
	__name: "PopperRoot",
	setup(e) {
		let t = /* @__PURE__ */ j();
		return dh({
			anchor: t,
			onAnchorChange: (e) => t.value = e
		}), (e, t) => L(e.$slots, "default");
	}
}), ph = /* @__PURE__ */ I({
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
		let t = e, { forwardRef: n, currentElement: r } = Vp(), i = uh();
		return nr(() => {
			i.onAnchorChange(t.reference ?? r.value);
		}), (t, r) => (z(), V(N(fm), {
			ref: N(n),
			as: e.as,
			"as-child": e.asChild
		}, {
			default: P(() => [L(t.$slots, "default")]),
			_: 3
		}, 8, ["as", "as-child"]));
	}
});
// node_modules/.pnpm/reka-ui@2.11.0_vue@3.5.42_typescript@6.0.3_/node_modules/reka-ui/dist/Popper/utils.js
function mh(e) {
	return e !== null;
}
function hh(e) {
	return {
		name: "transformOrigin",
		options: e,
		fn(t) {
			let { placement: n, rects: r, middlewareData: i } = t, a = i.arrow?.centerOffset !== 0, o = a ? 0 : e.arrowWidth, s = a ? 0 : e.arrowHeight, [c, l] = gh(n), u = {
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
function gh(e) {
	let [t, n = "center"] = e.split("-");
	return [t, n];
}
// node_modules/.pnpm/@floating-ui+utils@0.2.12/node_modules/@floating-ui/utils/dist/floating-ui.utils.mjs
var _h = [
	"top",
	"right",
	"bottom",
	"left"
], vh = Math.min, yh = Math.max, bh = Math.round, xh = Math.floor, Sh = (e) => ({
	x: e,
	y: e
}), Ch = {
	left: "right",
	right: "left",
	bottom: "top",
	top: "bottom"
};
function wh(e, t, n) {
	return yh(e, vh(t, n));
}
function Th(e, t) {
	return typeof e == "function" ? e(t) : e;
}
function Eh(e) {
	return e.split("-")[0];
}
function Dh(e) {
	return e.split("-")[1];
}
function Oh(e) {
	return e === "x" ? "y" : "x";
}
function kh(e) {
	return e === "y" ? "height" : "width";
}
function Ah(e) {
	let t = e[0];
	return t === "t" || t === "b" ? "y" : "x";
}
function jh(e) {
	return Oh(Ah(e));
}
function Mh(e, t, n) {
	n === void 0 && (n = !1);
	let r = Dh(e), i = jh(e), a = kh(i), o = i === "x" ? r === (n ? "end" : "start") ? "right" : "left" : r === "start" ? "bottom" : "top";
	return t.reference[a] > t.floating[a] && (o = Vh(o)), [o, Vh(o)];
}
function Nh(e) {
	let t = Vh(e);
	return [
		Ph(e),
		t,
		Ph(t)
	];
}
function Ph(e) {
	return e.includes("start") ? e.replace("start", "end") : e.replace("end", "start");
}
var Fh = ["left", "right"], Ih = ["right", "left"], Lh = ["top", "bottom"], Rh = ["bottom", "top"];
function zh(e, t, n) {
	switch (e) {
		case "top":
		case "bottom": return n ? t ? Ih : Fh : t ? Fh : Ih;
		case "left":
		case "right": return t ? Lh : Rh;
		default: return [];
	}
}
function Bh(e, t, n, r) {
	let i = Dh(e), a = zh(Eh(e), n === "start", r);
	return i && (a = a.map((e) => e + "-" + i), t && (a = a.concat(a.map(Ph)))), a;
}
function Vh(e) {
	let t = Eh(e);
	return Ch[t] + e.slice(t.length);
}
function Hh(e) {
	return {
		top: e.top ?? 0,
		right: e.right ?? 0,
		bottom: e.bottom ?? 0,
		left: e.left ?? 0
	};
}
function Uh(e) {
	return typeof e == "number" ? {
		top: e,
		right: e,
		bottom: e,
		left: e
	} : Hh(e);
}
function Wh(e) {
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
function Gh(e, t, n) {
	let { reference: r, floating: i } = e, a = Ah(t), o = jh(t), s = kh(o), c = Eh(t), l = a === "y", u = r.x + r.width / 2 - i.width / 2, d = r.y + r.height / 2 - i.height / 2, f = r[s] / 2 - i[s] / 2, p;
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
	let m = Dh(t);
	return m && (p[o] += f * (m === "end" ? 1 : -1) * (n && l ? -1 : 1)), p;
}
async function Kh(e, t) {
	t === void 0 && (t = {});
	let { x: n, y: r, platform: i, rects: a, elements: o, strategy: s } = e, { boundary: c = "clippingAncestors", rootBoundary: l = "viewport", elementContext: u = "floating", altBoundary: d = !1, padding: f = 0 } = Th(t, e), p = Uh(f), m = o[d ? u === "floating" ? "reference" : "floating" : u], h = Wh(await i.getClippingRect({
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
	}, y = Wh(i.convertOffsetParentRelativeRectToViewportRelativeRect ? await i.convertOffsetParentRelativeRectToViewportRelativeRect({
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
var qh = 50, Jh = async (e, t, n) => {
	let { placement: r = "bottom", strategy: i = "absolute", middleware: a = [], platform: o } = n, s = o.detectOverflow ? o : {
		...o,
		detectOverflow: Kh
	}, c = await (o.isRTL == null ? void 0 : o.isRTL(t)), l = await o.getElementRects({
		reference: e,
		floating: t,
		strategy: i
	}), { x: u, y: d } = Gh(l, r, c), f = r, p = 0, m = {};
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
		}, x && p < qh && (p++, typeof x == "object" && (x.placement && (f = x.placement), x.rects && (l = x.rects === !0 ? await o.getElementRects({
			reference: e,
			floating: t,
			strategy: i
		}) : x.rects), {x: u, y: d} = Gh(l, f, c)), n = -1);
	}
	return {
		x: u,
		y: d,
		placement: f,
		strategy: i,
		middlewareData: m
	};
}, Yh = (e) => ({
	name: "arrow",
	options: e,
	async fn(t) {
		let { x: n, y: r, placement: i, rects: a, platform: o, elements: s, middlewareData: c } = t, { element: l, padding: u = 0 } = Th(e, t) || {};
		if (l == null) return {};
		let d = Uh(u), f = {
			x: n,
			y: r
		}, p = jh(i), m = kh(p), h = await o.getDimensions(l), g = p === "y", _ = g ? "top" : "left", v = g ? "bottom" : "right", y = g ? "clientHeight" : "clientWidth", b = a.reference[m] + a.reference[p] - f[p] - a.floating[m], x = f[p] - a.reference[p], S = await (o.getOffsetParent == null ? void 0 : o.getOffsetParent(l)), C = S ? S[y] : 0;
		C && await (o.isElement == null ? void 0 : o.isElement(S)) || (C = s.floating[y] || a.floating[m]);
		let w = b / 2 - x / 2, T = C / 2 - h[m] / 2 - 1, E = vh(d[_], T), D = vh(d[v], T), O = C - h[m] - D, ee = C / 2 - h[m] / 2 + w, te = wh(E, ee, O), k = !c.arrow && Dh(i) != null && ee !== te && a.reference[m] / 2 - (ee < E ? E : D) - h[m] / 2 < 0, ne = k ? ee < E ? ee - E : ee - O : 0;
		return {
			[p]: f[p] + ne,
			data: {
				[p]: te,
				centerOffset: ee - te - ne,
				...k && { alignmentOffset: ne }
			},
			reset: k
		};
	}
}), Xh = function(e) {
	return e === void 0 && (e = {}), {
		name: "flip",
		options: e,
		async fn(t) {
			var n;
			let { placement: r, middlewareData: i, rects: a, initialPlacement: o, platform: s, elements: c } = t, { mainAxis: l = !0, crossAxis: u = !0, fallbackPlacements: d, fallbackStrategy: f = "bestFit", fallbackAxisSideDirection: p = "none", flipAlignment: m = !0, ...h } = Th(e, t);
			if ((n = i.arrow) != null && n.alignmentOffset) return {};
			let g = Eh(r), _ = Ah(o), v = Eh(o) === o, y = await (s.isRTL == null ? void 0 : s.isRTL(c.floating)), b = d || (v || !m ? [Vh(o)] : Nh(o)), x = p !== "none";
			!d && x && b.push(...Bh(o, m, p, y));
			let S = [o, ...b], C = await s.detectOverflow(t, h), w = [], T = i.flip?.overflows || [];
			if (l && w.push(C[g]), u) {
				let e = Mh(r, a, y);
				w.push(C[e[0]], C[e[1]]);
			}
			if (T = [...T, {
				placement: r,
				overflows: w
			}], !w.every((e) => e <= 0)) {
				let e = (i.flip?.index || 0) + 1, t = S[e];
				if (t && (u !== "alignment" || _ === Ah(t) || T.every((e) => Ah(e.placement) !== _ || e.overflows[0] > 0))) return {
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
								let t = Ah(e.placement);
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
function Zh(e, t) {
	return {
		top: e.top - t.height,
		right: e.right - t.width,
		bottom: e.bottom - t.height,
		left: e.left - t.width
	};
}
function Qh(e) {
	return _h.some((t) => e[t] >= 0);
}
var $h = function(e) {
	return e === void 0 && (e = {}), {
		name: "hide",
		options: e,
		async fn(t) {
			let { rects: n, platform: r } = t, { strategy: i = "referenceHidden", ...a } = Th(e, t);
			switch (i) {
				case "referenceHidden": {
					let e = Zh(await r.detectOverflow(t, {
						...a,
						elementContext: "reference"
					}), n.reference);
					return { data: {
						referenceHiddenOffsets: e,
						referenceHidden: Qh(e)
					} };
				}
				case "escaped": {
					let e = Zh(await r.detectOverflow(t, {
						...a,
						altBoundary: !0
					}), n.floating);
					return { data: {
						escapedOffsets: e,
						escaped: Qh(e)
					} };
				}
				default: return {};
			}
		}
	};
}, eg = /*#__PURE__*/ new Set(["left", "top"]);
async function tg(e, t) {
	let { placement: n, platform: r, elements: i } = e, a = await (r.isRTL == null ? void 0 : r.isRTL(i.floating)), o = Eh(n), s = Dh(n), c = Ah(n) === "y", l = eg.has(o) ? -1 : 1, u = a && c ? -1 : 1, d = Th(t, e), { mainAxis: f, crossAxis: p, alignmentAxis: m } = typeof d == "number" ? {
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
var ng = function(e) {
	return e === void 0 && (e = 0), {
		name: "offset",
		options: e,
		async fn(t) {
			var n;
			let { x: r, y: i, placement: a, middlewareData: o } = t, s = await tg(t, e);
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
}, rg = function(e) {
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
			} }, ...l } = Th(e, t), u = {
				x: n,
				y: r
			}, d = await a.detectOverflow(t, l), f = Ah(i), p = Oh(f), m = u[p], h = u[f], g = (e, t) => wh(t + d[e === "y" ? "top" : "left"], t, t - d[e === "y" ? "bottom" : "right"]);
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
}, ig = function(e) {
	return e === void 0 && (e = {}), {
		options: e,
		fn(t) {
			let { x: n, y: r, placement: i, rects: a, middlewareData: o } = t, { offset: s = 0, mainAxis: c = !0, crossAxis: l = !0 } = Th(e, t), u = {
				x: n,
				y: r
			}, d = Ah(i), f = Oh(d), p = u[f], m = u[d], h = Th(s, t), g = typeof h == "number" ? {
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
				let e = f === "y" ? "width" : "height", t = eg.has(Eh(i)), n = a.reference[d] - a.floating[e] + (t && o.offset?.[d] || 0) + (t ? 0 : g.crossAxis), r = a.reference[d] + a.reference[e] + (t ? 0 : o.offset?.[d] || 0) - (t ? g.crossAxis : 0);
				m < n ? m = n : m > r && (m = r);
			}
			return {
				[f]: p,
				[d]: m
			};
		}
	};
}, ag = function(e) {
	return e === void 0 && (e = {}), {
		name: "size",
		options: e,
		async fn(t) {
			let { placement: n, rects: r, platform: i, elements: a } = t, { apply: o = () => {}, ...s } = Th(e, t), c = await i.detectOverflow(t, s), l = Eh(n), u = Dh(n), d = Ah(n) === "y", { width: f, height: p } = r.floating, m, h;
			l === "top" || l === "bottom" ? (m = l, h = u === (await (i.isRTL == null ? void 0 : i.isRTL(a.floating)) ? "start" : "end") ? "left" : "right") : (h = l, m = u === "end" ? "top" : "bottom");
			let g = p - c.top - c.bottom, _ = f - c.left - c.right, v = vh(p - c[m], g), y = vh(f - c[h], _), b = t.middlewareData.shift, x = !b, S = v, C = y;
			b != null && b.enabled.x && (C = _), b != null && b.enabled.y && (S = g), x && !u && (d ? C = f - 2 * yh(c.left, c.right) : S = p - 2 * yh(c.top, c.bottom)), await o({
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
function og() {
	return typeof window < "u";
}
function sg(e) {
	return ug(e) ? (e.nodeName || "").toLowerCase() : "#document";
}
function cg(e) {
	var t;
	return (e == null || (t = e.ownerDocument) == null ? void 0 : t.defaultView) || window;
}
function lg(e) {
	return ((ug(e) ? e.ownerDocument : e.document) || window.document)?.documentElement;
}
function ug(e) {
	return og() ? e instanceof Node || e instanceof cg(e).Node : !1;
}
function dg(e) {
	return og() ? e instanceof Element || e instanceof cg(e).Element : !1;
}
function fg(e) {
	return og() ? e instanceof HTMLElement || e instanceof cg(e).HTMLElement : !1;
}
function pg(e) {
	return !og() || typeof ShadowRoot > "u" ? !1 : e instanceof ShadowRoot || e instanceof cg(e).ShadowRoot;
}
function mg(e) {
	let { overflow: t, overflowX: n, overflowY: r, display: i } = Tg(e);
	return /auto|scroll|overlay|hidden|clip/.test(t + r + n) && i !== "inline" && i !== "contents";
}
function hg(e) {
	return /^(table|td|th)$/.test(sg(e));
}
function gg(e) {
	try {
		if (e.matches(":popover-open")) return !0;
	} catch {}
	try {
		return e.matches(":modal");
	} catch {
		return !1;
	}
}
var _g = /transform|translate|scale|rotate|perspective|filter/, vg = /paint|layout|strict|content/, yg = (e) => !!e && e !== "none", bg;
function xg(e) {
	let t = dg(e) ? Tg(e) : e;
	return yg(t.transform) || yg(t.translate) || yg(t.scale) || yg(t.rotate) || yg(t.perspective) || !Cg() && (yg(t.backdropFilter) || yg(t.filter)) || _g.test(t.willChange || "") || vg.test(t.contain || "");
}
function Sg(e) {
	let t = Dg(e);
	for (; fg(t) && !wg(t);) {
		if (xg(t)) return t;
		if (gg(t)) return null;
		t = Dg(t);
	}
	return null;
}
function Cg() {
	return bg ??= typeof CSS < "u" && CSS.supports && CSS.supports("-webkit-backdrop-filter", "none"), bg;
}
function wg(e) {
	return /^(html|body|#document)$/.test(sg(e));
}
function Tg(e) {
	return cg(e).getComputedStyle(e);
}
function Eg(e) {
	return dg(e) ? {
		scrollLeft: e.scrollLeft,
		scrollTop: e.scrollTop
	} : {
		scrollLeft: e.scrollX,
		scrollTop: e.scrollY
	};
}
function Dg(e) {
	if (sg(e) === "html") return e;
	let t = e.assignedSlot || e.parentNode || pg(e) && e.host || lg(e);
	return pg(t) ? t.host : t;
}
function Og(e) {
	let t = Dg(e);
	return wg(t) ? (e.ownerDocument || e).body : fg(t) && mg(t) ? t : Og(t);
}
function kg(e, t, n) {
	t === void 0 && (t = []), n === void 0 && (n = !0);
	let r = Og(e), i = r === e.ownerDocument?.body, a = cg(r);
	if (i) {
		let e = Ag(a);
		return t.concat(a, a.visualViewport || [], mg(r) ? r : [], e && n ? kg(e) : []);
	}
	return t.concat(r, kg(r, [], n));
}
function Ag(e) {
	return e.parent && Object.getPrototypeOf(e.parent) ? e.frameElement : null;
}
// node_modules/.pnpm/@floating-ui+dom@1.8.0/node_modules/@floating-ui/dom/dist/floating-ui.dom.mjs
function jg(e) {
	let t = Tg(e), n = parseFloat(t.width) || 0, r = parseFloat(t.height) || 0, i = fg(e), a = i ? e.offsetWidth : n, o = i ? e.offsetHeight : r, s = bh(n) !== a || bh(r) !== o;
	return s && (n = a, r = o), {
		width: n,
		height: r,
		$: s
	};
}
function Mg(e) {
	return dg(e) ? e : e.contextElement;
}
function Ng(e) {
	let t = Mg(e);
	if (!fg(t)) return Sh(1);
	let n = t.getBoundingClientRect(), { width: r, height: i, $: a } = jg(t), o = (a ? bh(n.width) : n.width) / r, s = (a ? bh(n.height) : n.height) / i;
	return o && Number.isFinite(o) || (o = 1), s && Number.isFinite(s) || (s = 1), {
		x: o,
		y: s
	};
}
var Pg = /*#__PURE__*/ Sh(0);
function Fg(e) {
	let t = cg(e);
	return !Cg() || !t.visualViewport ? Pg : {
		x: t.visualViewport.offsetLeft,
		y: t.visualViewport.offsetTop
	};
}
function Ig(e, t, n) {
	return t === void 0 && (t = !1), !!n && t && n === cg(e);
}
function Lg(e, t, n, r) {
	t === void 0 && (t = !1), n === void 0 && (n = !1);
	let i = e.getBoundingClientRect(), a = Mg(e), o = Sh(1);
	t && (r ? dg(r) && (o = Ng(r)) : o = Ng(e));
	let s = Ig(a, n, r) ? Fg(a) : Sh(0), c = (i.left + s.x) / o.x, l = (i.top + s.y) / o.y, u = i.width / o.x, d = i.height / o.y;
	if (a && r) {
		let e = cg(a), t = dg(r) ? cg(r) : r, n = e, i = Ag(n);
		for (; i && t !== n;) {
			let e = Ng(i), t = i.getBoundingClientRect(), r = Tg(i), a = t.left + (i.clientLeft + parseFloat(r.paddingLeft)) * e.x, o = t.top + (i.clientTop + parseFloat(r.paddingTop)) * e.y;
			c *= e.x, l *= e.y, u *= e.x, d *= e.y, c += a, l += o, n = cg(i), i = Ag(n);
		}
	}
	return Wh({
		width: u,
		height: d,
		x: c,
		y: l
	});
}
function Rg(e, t) {
	let n = Eg(e).scrollLeft;
	return t ? t.left + n : Lg(lg(e)).left + n;
}
function zg(e, t) {
	let n = e.getBoundingClientRect();
	return {
		x: n.left + t.scrollLeft - Rg(e, n),
		y: n.top + t.scrollTop
	};
}
function Bg(e) {
	let { elements: t, rect: n, offsetParent: r, strategy: i } = e, a = i === "fixed", o = lg(r), s = t ? gg(t.floating) : !1;
	if (r === o || s && a) return n;
	let c = {
		scrollLeft: 0,
		scrollTop: 0
	}, l = Sh(1), u = Sh(0), d = fg(r);
	if ((d || !a) && ((sg(r) !== "body" || mg(o)) && (c = Eg(r)), d)) {
		let e = Lg(r);
		l = Ng(r), u.x = e.x + r.clientLeft, u.y = e.y + r.clientTop;
	}
	let f = o && !d && !a ? zg(o, c) : Sh(0);
	return {
		width: n.width * l.x,
		height: n.height * l.y,
		x: n.x * l.x - c.scrollLeft * l.x + u.x + f.x,
		y: n.y * l.y - c.scrollTop * l.y + u.y + f.y
	};
}
function Vg(e) {
	return e.getClientRects ? Array.from(e.getClientRects()) : [];
}
function Hg(e) {
	let t = Eg(e), n = e.ownerDocument.body, r = yh(e.scrollWidth, e.clientWidth, n.scrollWidth, n.clientWidth), i = yh(e.scrollHeight, e.clientHeight, n.scrollHeight, n.clientHeight), a = -t.scrollLeft + Rg(e), o = -t.scrollTop;
	return Tg(n).direction === "rtl" && (a += yh(e.clientWidth, n.clientWidth) - r), {
		width: r,
		height: i,
		x: a,
		y: o
	};
}
var Ug = 25;
function Wg(e, t, n) {
	n === void 0 && (n = "viewport");
	let r = n === "layoutViewport", i = cg(e), a = lg(e), o = i.visualViewport, s = a.clientWidth, c = a.clientHeight, l = 0, u = 0;
	if (o) {
		let e = !Cg() || t === "fixed";
		r ? e || (l = -o.offsetLeft, u = -o.offsetTop) : (s = o.width, c = o.height, e && (l = o.offsetLeft, u = o.offsetTop));
	}
	if (Rg(a) <= 0) {
		let e = a.ownerDocument, t = e.body, n = getComputedStyle(t), r = e.compatMode === "CSS1Compat" && parseFloat(n.marginLeft) + parseFloat(n.marginRight) || 0, i = Math.abs(a.clientWidth - t.clientWidth - r), o = getComputedStyle(a).scrollbarGutter === "stable both-edges" ? i / 2 : i;
		o <= Ug && (s -= o);
	}
	return {
		width: s,
		height: c,
		x: l,
		y: u
	};
}
function Gg(e, t) {
	let n = Lg(e, !0, t === "fixed"), r = n.top + e.clientTop, i = n.left + e.clientLeft, a = Ng(e);
	return {
		width: e.clientWidth * a.x,
		height: e.clientHeight * a.y,
		x: i * a.x,
		y: r * a.y
	};
}
function Kg(e, t, n) {
	let r;
	if (t === "viewport" || t === "layoutViewport") r = Wg(e, n, t);
	else if (t === "document") r = Hg(lg(e));
	else if (dg(t)) r = Gg(t, n);
	else {
		let n = Fg(e);
		r = {
			x: t.x - n.x,
			y: t.y - n.y,
			width: t.width,
			height: t.height
		};
	}
	return Wh(r);
}
function qg(e, t) {
	let n = t.get(e);
	if (n) return n;
	let r = kg(e, [], !1).filter((e) => dg(e) && sg(e) !== "body"), i = null, a = Tg(e).position === "fixed", o = a ? Dg(e) : e;
	for (; dg(o) && !wg(o);) {
		let e = Tg(o), t = xg(o), n = i ? i.position : a ? "fixed" : "";
		!t && (n === "fixed" || n === "absolute" && e.position === "static") ? r = r.filter((e) => e !== o) : i = e, o = Dg(o);
	}
	return t.set(e, r), r;
}
function Jg(e) {
	let { element: t, boundary: n, rootBoundary: r, strategy: i } = e, a = [...n === "clippingAncestors" ? gg(t) ? [] : qg(t, this._c) : [].concat(n), r], o = Kg(t, a[0], i), s = o.top, c = o.right, l = o.bottom, u = o.left;
	for (let e = 1; e < a.length; e++) {
		let n = Kg(t, a[e], i);
		s = yh(n.top, s), c = vh(n.right, c), l = vh(n.bottom, l), u = yh(n.left, u);
	}
	return {
		width: c - u,
		height: l - s,
		x: u,
		y: s
	};
}
function Yg(e) {
	let { width: t, height: n } = jg(e);
	return {
		width: t,
		height: n
	};
}
function Xg(e, t, n) {
	let r = fg(t), i = lg(t), a = n === "fixed", o = Lg(e, !0, a, t), s = {
		scrollLeft: 0,
		scrollTop: 0
	}, c = Sh(0);
	if ((r || !a) && ((sg(t) !== "body" || mg(i)) && (s = Eg(t)), r)) {
		let e = Lg(t, !0, a, t);
		c.x = e.x + t.clientLeft, c.y = e.y + t.clientTop;
	}
	!r && i && (c.x = Rg(i));
	let l = i && !r && !a ? zg(i, s) : Sh(0);
	return {
		x: o.left + s.scrollLeft - c.x - l.x,
		y: o.top + s.scrollTop - c.y - l.y,
		width: o.width,
		height: o.height
	};
}
function Zg(e) {
	return Tg(e).position === "static";
}
function Qg(e, t) {
	if (!fg(e) || Tg(e).position === "fixed") return null;
	if (t) return t(e);
	let n = e.offsetParent;
	return lg(e) === n && (n = n.ownerDocument.body), n;
}
function $g(e, t) {
	let n = cg(e);
	if (gg(e)) return n;
	if (!fg(e)) {
		let t = Dg(e);
		for (; t && !wg(t);) {
			if (dg(t) && !Zg(t)) return t;
			t = Dg(t);
		}
		return n;
	}
	let r = Qg(e, t);
	for (; r && hg(r) && Zg(r);) r = Qg(r, t);
	return r && wg(r) && Zg(r) && !xg(r) ? n : r || Sg(e) || n;
}
var e_ = async function(e) {
	let t = this.getOffsetParent || $g, n = this.getDimensions, r = await n(e.floating);
	return {
		reference: Xg(e.reference, await t(e.floating), e.strategy),
		floating: {
			x: 0,
			y: 0,
			width: r.width,
			height: r.height
		}
	};
};
function t_(e) {
	return Tg(e).direction === "rtl";
}
var n_ = {
	convertOffsetParentRelativeRectToViewportRelativeRect: Bg,
	getDocumentElement: lg,
	getClippingRect: Jg,
	getOffsetParent: $g,
	getElementRects: e_,
	getClientRects: Vg,
	getDimensions: Yg,
	getScale: Ng,
	isElement: dg,
	isRTL: t_
};
function r_(e, t) {
	return e.x === t.x && e.y === t.y && e.width === t.width && e.height === t.height;
}
function i_(e, t, n) {
	let r = null, i, a = lg(e);
	function o() {
		var e;
		clearTimeout(i), (e = r) == null || e.disconnect(), r = null;
	}
	function s(n, c) {
		n === void 0 && (n = !1), c === void 0 && (c = 1), o();
		let l = e.getBoundingClientRect(), { left: u, top: d, width: f, height: p } = l;
		if (n || t(), !f || !p) return;
		let m = xh(d), h = xh(a.clientWidth - (u + f)), g = xh(a.clientHeight - (d + p)), _ = xh(u), v = {
			rootMargin: -m + "px " + -h + "px " + -g + "px " + -_ + "px",
			threshold: yh(0, vh(1, c)) || 1
		}, y = !0;
		function b(t) {
			let n = t[0].intersectionRatio;
			if (!r_(l, e.getBoundingClientRect())) return s();
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
	let c = cg(e), l = () => s(n);
	return c.addEventListener("resize", l), s(!0), () => {
		c.removeEventListener("resize", l), o();
	};
}
function a_(e, t, n, r) {
	r === void 0 && (r = {});
	let { ancestorScroll: i = !0, ancestorResize: a = !0, elementResize: o = typeof ResizeObserver == "function", layoutShift: s = typeof IntersectionObserver == "function", animationFrame: c = !1 } = r, l = Mg(e), u = i || a ? [...l ? kg(l) : [], ...t ? kg(t) : []] : [];
	u.forEach((e) => {
		i && e.addEventListener("scroll", n), a && e.addEventListener("resize", n);
	});
	let d = l && s ? i_(l, n, a) : null, f = -1, p = null;
	o && (p = new ResizeObserver((e) => {
		let [r] = e;
		r && r.target === l && p && t && (p.unobserve(t), cancelAnimationFrame(f), f = requestAnimationFrame(() => {
			var e;
			(e = p) == null || e.observe(t);
		})), n();
	}), l && !c && p.observe(l), t && p.observe(t));
	let m, h = c ? Lg(e) : null;
	c && g();
	function g() {
		let t = Lg(e);
		h && !r_(h, t) && n(), h = t, m = requestAnimationFrame(g);
	}
	return n(), () => {
		var e;
		u.forEach((e) => {
			i && e.removeEventListener("scroll", n), a && e.removeEventListener("resize", n);
		}), d?.(), (e = p) == null || e.disconnect(), p = null, c && cancelAnimationFrame(m);
	};
}
var o_ = ng, s_ = rg, c_ = Xh, l_ = ag, u_ = $h, d_ = Yh, f_ = ig, p_ = (e, t, n) => {
	let r = /* @__PURE__ */ new Map(), i = n ?? {}, a = {
		...n_,
		...i.platform,
		_c: r
	};
	return Jh(e, t, {
		...i,
		platform: a
	});
};
// node_modules/.pnpm/@floating-ui+vue@2.0.1_vue@3.5.42_typescript@6.0.3_/node_modules/@floating-ui/vue/dist/floating-ui.vue.mjs
function m_(e) {
	return typeof e == "object" && !!e && "$el" in e;
}
function h_(e) {
	if (m_(e)) {
		let t = e.$el;
		return ug(t) && sg(t) === "#comment" ? null : t;
	}
	return e;
}
function g_(e) {
	return {
		name: "arrow",
		options: e,
		fn(t) {
			let n = h_(cn(e.element));
			return n == null ? {} : d_({
				element: n,
				padding: e.padding
			}).fn(t);
		}
	};
}
function __(e) {
	return typeof window > "u" ? 1 : (e.ownerDocument.defaultView || window).devicePixelRatio || 1;
}
function v_(e, t) {
	let n = __(e);
	return Math.round(t * n) / n;
}
function y_(e, t, n) {
	n === void 0 && (n = {});
	let r = n.whileElementsMounted, i = K(() => cn(n.open) ?? !0), a = K(() => cn(n.middleware)), o = K(() => cn(n.placement) ?? "bottom"), s = K(() => cn(n.strategy) ?? "absolute"), c = K(() => cn(n.transform) ?? !0), l = K(() => h_(e.value)), u = K(() => h_(t.value)), d = /* @__PURE__ */ j(0), f = /* @__PURE__ */ j(0), p = /* @__PURE__ */ j(s.value), m = /* @__PURE__ */ j(o.value), h = /* @__PURE__ */ M({}), g = /* @__PURE__ */ j(!1), _ = K(() => {
		let e = {
			position: p.value,
			left: "0",
			top: "0"
		};
		if (!u.value) return e;
		let t = v_(u.value, d.value), n = v_(u.value, f.value);
		return c.value ? {
			...e,
			transform: "translate(" + t + "px, " + n + "px)",
			...__(u.value) >= 1.5 && { willChange: "transform" }
		} : {
			position: p.value,
			left: t + "px",
			top: n + "px"
		};
	}), v;
	function y() {
		if (l.value == null || u.value == null) return;
		let e = i.value;
		p_(l.value, u.value, {
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
	return F([
		a,
		o,
		s,
		i
	], y, { flush: "sync" }), F([l, u], x, { flush: "sync" }), F(i, S, { flush: "sync" }), Ae() && je(b), {
		x: /* @__PURE__ */ qt(d),
		y: /* @__PURE__ */ qt(f),
		strategy: /* @__PURE__ */ qt(p),
		placement: /* @__PURE__ */ qt(m),
		middlewareData: /* @__PURE__ */ qt(h),
		isPositioned: /* @__PURE__ */ qt(g),
		floatingStyles: _,
		update: y
	};
}
// node_modules/.pnpm/reka-ui@2.11.0_vue@3.5.42_typescript@6.0.3_/node_modules/reka-ui/dist/Popper/PopperContent.js
var b_ = ["dir"], x_ = {
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
}, [S_, C_] = /*#__PURE__*/ Lf("PopperContent"), w_ = /* @__PURE__ */ I({
	inheritAttrs: !1,
	__name: "PopperContent",
	props: /* @__PURE__ */ fi({
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
	}, { ...x_ }),
	emits: ["placed"],
	setup(e, { emit: t }) {
		let n = e, r = t, i = uh(), { forwardRef: a, currentElement: o } = Vp(), s = Pp(K(() => n.dir)), c = /* @__PURE__ */ j(), l = /* @__PURE__ */ j(), { width: u, height: d } = nm(l), f = K(() => n.side + (n.align === "center" ? "" : `-${n.align}`)), p = K(() => typeof n.collisionPadding == "number" ? n.collisionPadding : {
			top: 0,
			right: 0,
			bottom: 0,
			left: 0,
			...n.collisionPadding
		}), m = K(() => Array.isArray(n.collisionBoundary) ? n.collisionBoundary : [n.collisionBoundary]), h = K(() => ({
			padding: p.value,
			boundary: m.value.filter(mh),
			altBoundary: m.value.length > 0
		})), g = K(() => ({
			mainAxis: n.sideFlip,
			crossAxis: n.alignFlip
		})), _ = K(() => [
			o_({
				mainAxis: n.sideOffset + d.value,
				alignmentAxis: n.alignOffset
			}),
			n.prioritizePosition && n.avoidCollisions && c_({
				...h.value,
				...g.value
			}),
			n.avoidCollisions && s_({
				mainAxis: !0,
				crossAxis: !!n.prioritizePosition,
				limiter: n.sticky === "partial" ? f_() : void 0,
				...h.value
			}),
			!n.prioritizePosition && n.avoidCollisions && c_({
				...h.value,
				...g.value
			}),
			l_({
				...h.value,
				apply: ({ elements: e, rects: t, availableWidth: n, availableHeight: r }) => {
					let { width: i, height: a } = t.reference, o = e.floating.style;
					o.setProperty("--reka-popper-available-width", `${n}px`), o.setProperty("--reka-popper-available-height", `${r}px`), o.setProperty("--reka-popper-anchor-width", `${i}px`), o.setProperty("--reka-popper-anchor-height", `${a}px`);
				}
			}),
			l.value && g_({
				element: l.value,
				padding: n.arrowPadding
			}),
			hh({
				arrowWidth: u.value,
				arrowHeight: d.value,
				dir: s.value
			}),
			n.hideWhenDetached && u_({
				strategy: "referenceHidden",
				...h.value
			})
		]), { floatingStyles: v, placement: y, isPositioned: b, middlewareData: x, update: S } = y_(K(() => n.reference ?? i.anchor.value), c, {
			strategy: n.positionStrategy,
			placement: f,
			whileElementsMounted: (...e) => a_(...e, {
				layoutShift: !n.disableUpdateOnLayoutShift,
				animationFrame: n.updatePositionStrategy === "always"
			}),
			middleware: _
		}), C = K(() => gh(y.value)[0]), w = K(() => gh(y.value)[1]);
		nr(() => {
			b.value && r("placed");
		});
		let T = K(() => {
			let e = x.value.arrow?.centerOffset !== 0;
			return n.hideShiftedArrow && e;
		}), E = /* @__PURE__ */ j("");
		return tr(() => {
			o.value && (E.value = window.getComputedStyle(o.value).zIndex);
		}), C_({
			placedSide: C,
			onArrowChange: (e) => l.value = e,
			arrowX: K(() => x.value.arrow?.x ?? 0),
			arrowY: K(() => x.value.arrow?.y ?? 0),
			shouldHideArrow: T
		}), (e, t) => (z(), B("div", {
			ref_key: "floatingRef",
			ref: c,
			"data-reka-popper-content-wrapper": "",
			dir: N(s),
			style: fe({
				...N(v),
				transform: N(b) ? N(v).transform : "translate(0, -200%)",
				minWidth: "max-content",
				zIndex: E.value,
				"--reka-popper-transform-origin": [N(x).transformOrigin?.x, N(x).transformOrigin?.y].join(" "),
				...N(x).hide?.referenceHidden && {
					visibility: "hidden",
					pointerEvents: "none"
				}
			})
		}, [n.memoDependencies ? fo([
			n.asChild,
			n.as,
			C.value,
			w.value,
			N(b),
			...Object.values(e.$attrs),
			...n.memoDependencies
		], () => (z(), V(N(fm), G({
			key: 0,
			ref: N(a)
		}, e.$attrs, {
			"as-child": n.asChild,
			as: n.as,
			"data-side": C.value,
			"data-align": w.value,
			style: { animation: N(b) ? void 0 : "none" }
		}), {
			default: P(() => [L(e.$slots, "default")]),
			_: 3
		}, 16, [
			"as-child",
			"as",
			"data-side",
			"data-align",
			"style"
		])), t, 0) : (z(), V(N(fm), G({
			key: 1,
			ref: N(a)
		}, e.$attrs, {
			"as-child": n.asChild,
			as: n.as,
			"data-side": C.value,
			"data-align": w.value,
			dir: N(s),
			style: { animation: N(b) ? void 0 : "none" }
		}), {
			default: P(() => [L(e.$slots, "default")]),
			_: 3
		}, 16, [
			"as-child",
			"as",
			"data-side",
			"data-align",
			"dir",
			"style"
		]))], 12, b_));
	}
});
// node_modules/.pnpm/reka-ui@2.11.0_vue@3.5.42_typescript@6.0.3_/node_modules/reka-ui/dist/Combobox/useComboboxContentPositioning.js
function T_(e) {
	let t = /* @__PURE__ */ j("inline"), n = /* @__PURE__ */ j(!1), r = /* @__PURE__ */ j(), i = K(() => t.value === "popper" && !n.value), a;
	th({
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
var [E_, D_] = /*#__PURE__*/ Lf("ComboboxRoot"), O_ = /* @__PURE__ */ I({
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
		let r = e, i = n, { primitiveElement: a, currentElement: o } = pm(), { multiple: s, disabled: c, ignoreFilter: l, resetSearchTermOnSelect: u, openOnFocus: d, openOnClick: f, dir: p, resetModelValueOnClear: m, highlightOnHover: h, loop: g, unmountOnHide: _ } = /* @__PURE__ */ pn(r), v = Pp(p), y = mp(r, "modelValue", i, {
			defaultValue: r.defaultValue ?? (s.value ? [] : void 0),
			passive: r.modelValue === void 0,
			deep: !0
		}), b = mp(r, "open", i, {
			defaultValue: r.defaultOpen,
			passive: r.open === void 0
		});
		async function x(e) {
			b.value = e, ne.value = "", e ? (await Ln(), a.value?.highlightSelected(), C.value = !0, T.value?.focus()) : (C.value = !1, setTimeout(() => {
				!e && r.resetSearchTermOnBlur && S.trigger();
			}, 1));
		}
		let S = Hf(), C = /* @__PURE__ */ j(!1), w = /* @__PURE__ */ j(!1), T = /* @__PURE__ */ j(), E = /* @__PURE__ */ j(), D = K(() => a.value?.highlightedElement ?? void 0), O = T_(b), ee = /* @__PURE__ */ j(/* @__PURE__ */ new Map()), te = /* @__PURE__ */ j(/* @__PURE__ */ new Map()), { contains: k } = Ip({ sensitivity: "base" }), ne = /* @__PURE__ */ j(""), re = K((e) => {
			if (!ne.value || r.ignoreFilter || w.value) return {
				count: ee.value.size,
				items: e?.items ?? /* @__PURE__ */ new Map(),
				groups: e?.groups ?? new Set(te.value.keys())
			};
			let t = 0, n = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Set();
			for (let [e, r] of ee.value) {
				let i = k(r, ne.value);
				n.set(e, +!!i), i && t++;
			}
			for (let [e, t] of te.value) for (let r of t) if (n.get(r) > 0) {
				i.add(e);
				break;
			}
			return {
				count: t,
				items: n,
				groups: i
			};
		}), ie = Ja();
		return Vr(() => {
			ie?.exposed && (ie.exposed.highlightItem = a.value?.highlightItem, ie.exposed.highlightFirstItem = a.value?.highlightFirstItem, ie.exposed.highlightSelected = a.value?.highlightSelected);
		}), t({
			filtered: re,
			highlightedElement: D,
			highlightItem: a.value?.highlightItem,
			highlightFirstItem: a.value?.highlightFirstItem,
			highlightSelected: a.value?.highlightSelected
		}), D_({
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
			allItems: ee,
			allGroups: te,
			filterSearch: ne,
			filterState: re,
			ignoreFilter: l,
			openOnFocus: d,
			openOnClick: f,
			resetModelValueOnClear: m,
			unmountOnHide: _
		}), (t, n) => (z(), V(N(fh), null, {
			default: P(() => [U(N(nh), G({
				ref_key: "primitiveElement",
				ref: a
			}, t.$attrs, {
				modelValue: N(y),
				"onUpdate:modelValue": n[0] ||= (e) => /* @__PURE__ */ rn(y) ? y.value = e : null,
				style: { pointerEvents: N(b) ? "auto" : void 0 },
				as: e.as,
				"as-child": e.asChild,
				dir: N(v),
				multiple: N(s),
				name: e.name,
				required: e.required,
				disabled: N(c),
				"highlight-on-hover": N(h),
				loop: N(g),
				by: r.by,
				onHighlight: n[1] ||= (e) => i("highlight", e)
			}), {
				default: P(() => [L(t.$slots, "default", {
					open: N(b),
					modelValue: N(y)
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
}), k_ = /* @__PURE__ */ I({
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
		let { forwardRef: t } = Vp();
		return (n, r) => (z(), V(N(ph), {
			"as-child": "",
			reference: e.reference
		}, {
			default: P(() => [U(N(fm), G({
				ref: N(t),
				"as-child": e.asChild,
				as: e.as
			}, n.$attrs), {
				default: P(() => [L(n.$slots, "default")]),
				_: 3
			}, 16, ["as-child", "as"])]),
			_: 3
		}, 8, ["reference"]));
	}
}), [A_, j_] = /*#__PURE__*/ Lf("ComboboxContent"), M_ = /* @__PURE__ */ I({
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
		let n = e, r = t, { position: i } = /* @__PURE__ */ pn(n), a = E_(), o = Symbol("ComboboxContent");
		F(i, (e) => a.onContentPositionChange(o, e), { immediate: !0 });
		let s = K(() => a.ignoreFilter.value ? a.allItems.value.size === 0 : a.filterState.value.count === 0), { forwardRef: c, currentElement: l } = Vp(), u = Dp(n.present && n.bodyLock);
		F([() => n.present, () => n.bodyLock], ([e, t]) => u.value = e && t), Rp(), $p(K(() => n.present ? a.parentElement.value : void 0));
		let d = Hp(K(() => {
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
		j_({ position: i });
		let p = /* @__PURE__ */ j(!1);
		Vr(() => {
			a.inputElement.value && (p.value = l.value.contains(a.inputElement.value), n.present && p.value && a.inputElement.value.focus());
		}), F(() => n.present, async (e, t) => {
			if (e || !t) return;
			let n = Rf();
			n && l.value.contains(n) && (await Ln(), a.triggerElement.value?.focus());
		}), Gr(() => {
			a.onContentUnmount(o);
			let e = Rf();
			p.value && (!e || e === document.body) && a.triggerElement.value?.focus();
		});
		function m(e) {
			if (a.parentElement.value?.contains(e)) return !0;
			let t = (e instanceof Element ? e.closest("label") : null)?.control;
			return !!t && !!a.parentElement.value?.contains(t);
		}
		let h = { placed: () => a.onContentPlaced(o) };
		return (t, o) => (z(), V(N(rh), { "as-child": "" }, {
			default: P(() => [U(N(Im), {
				"as-child": "",
				present: n.present,
				onMountAutoFocus: o[5] ||= ds(() => {}, ["prevent"]),
				onUnmountAutoFocus: o[6] ||= ds(() => {}, ["prevent"])
			}, {
				default: P(() => [U(N(xm), {
					"as-child": "",
					present: n.present,
					"disable-outside-pointer-events": e.disableOutsidePointerEvents,
					onDismiss: o[0] ||= (e) => N(a).onOpenChange(!1),
					onFocusOutside: o[1] ||= (e) => {
						m(e.target) && e.preventDefault(), r("focusOutside", e);
					},
					onInteractOutside: o[2] ||= (e) => r("interactOutside", e),
					onEscapeKeyDown: o[3] ||= (e) => r("escapeKeyDown", e),
					onPointerDownOutside: o[4] ||= (e) => {
						m(e.target) && e.preventDefault(), r("pointerDownOutside", e);
					}
				}, {
					default: P(() => [(z(), V(Qr(N(i) === "popper" ? N(w_) : N(fm)), G({
						...t.$attrs,
						...N(d)
					}, {
						id: N(a).contentId,
						ref: N(c),
						"memo-dependencies": N(i) === "popper" ? [N(a).filterSearch.value, N(a).filterState.value] : void 0,
						"data-state": N(a).open.value ? "open" : "closed",
						"data-empty": s.value ? "" : void 0,
						style: {
							display: n.hideWhenEmpty && s.value ? "none" : "flex",
							flexDirection: "column",
							outline: "none",
							...N(i) === "popper" ? f : {}
						}
					}, ii(N(i) === "popper" ? h : {})), {
						default: P(() => [L(t.$slots, "default")]),
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
}), N_ = /* @__PURE__ */ I({
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
		let n = Up(e, t), { forwardRef: r } = Vp(), i = E_();
		return i.contentId ||= em(void 0, "reka-combobox-content"), (t, a) => (z(), V(N(lm), {
			present: e.forceMount || N(i).open.value,
			"force-mount": e.forceMount || !N(i).unmountOnHide.value
		}, {
			default: P(({ present: e }) => [Yn(U(M_, G({
				...N(n),
				...t.$attrs
			}, {
				ref: N(r),
				present: N(i).unmountOnHide.value || e
			}), {
				default: P(() => [L(t.$slots, "default")]),
				_: 3
			}, 16, ["present"]), [[Do, N(i).unmountOnHide.value || e]])]),
			_: 3
		}, 8, ["present", "force-mount"]));
	}
}), P_ = /* @__PURE__ */ I({
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
		let t = e, n = E_(), r = K(() => n.ignoreFilter.value ? n.allItems.value.size === 0 : n.filterState.value.count === 0);
		return (e, n) => r.value ? (z(), V(N(fm), ve(G({ key: 0 }, t)), {
			default: P(() => [L(e.$slots, "default", {}, () => [n[0] ||= W("No options", -1)])]),
			_: 3
		}, 16)) : za("v-if", !0);
	}
}), [F_, I_] = /*#__PURE__*/ Lf("ComboboxGroup"), L_ = /* @__PURE__ */ I({
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
		let n = e, r = t, i = E_(), a = Qm(), { primitiveElement: o, currentElement: s } = pm(), c = mp(n, "modelValue", r, { passive: n.modelValue === void 0 });
		Vr(() => {
			s.value && i.onInputElementChange(s.value);
		});
		let { isComposing: l, shouldDeferInput: u, handleCompositionStart: d, handleCompositionUpdate: f, handleCompositionEnd: p } = Np((e) => {
			let t = e.target;
			t && h(t.value);
		});
		function m(e) {
			l.value || (e.preventDefault(), i.open.value || i.onOpenChange(!0));
		}
		function h(e) {
			i.open.value ? i.filterSearch.value = e : (i.onOpenChange(!0), Ln(() => {
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
			n.displayValue ? c.value = n.displayValue(e) : !i.multiple.value && e && !Array.isArray(e) ? typeof e == "object" ? c.value = "" : c.value = e.toString() : c.value = "", Ln(() => {
				c.value = c.value;
			});
		}
		return i.onResetSearchTerm(() => {
			b();
		}), F(i.modelValue, async () => {
			!i.isUserInputted.value && i.resetSearchTermOnSelect.value && b();
		}, {
			immediate: !0,
			deep: !0
		}), F(i.filterState, (e, t) => {
			!i.isVirtual.value && t.count === 0 && a.highlightFirstItem();
		}), (t, n) => (z(), V(N(ih), {
			ref_key: "primitiveElement",
			ref: o,
			modelValue: N(c),
			"onUpdate:modelValue": n[0] ||= (e) => /* @__PURE__ */ rn(c) ? c.value = e : null,
			as: e.as,
			"as-child": e.asChild,
			"auto-focus": e.autoFocus,
			disabled: e.disabled,
			"aria-expanded": N(i).open.value,
			"aria-controls": N(i).contentId,
			"aria-autocomplete": "list",
			role: "combobox",
			autocomplete: "off",
			onClick: y,
			onInput: g,
			onKeydown: ps(m, ["down", "up"]),
			onFocus: _,
			onBlur: v,
			onCompositionstart: N(d),
			onCompositionupdate: N(f),
			onCompositionend: N(p)
		}, {
			default: P(() => [L(t.$slots, "default")]),
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
}), R_ = /* @__PURE__ */ I({
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
		let n = e, r = t, i = em(void 0, "reka-combobox-item"), a = E_(), o = F_(null), { primitiveElement: s, currentElement: c } = pm();
		if (n.value === "") throw Error("A <ComboboxItem /> must have a value prop that is not an empty string. This is because the Combobox value can be set to an empty string to clear the selection and show the placeholder.");
		let l = K(() => {
			if (a.isVirtual.value || a.ignoreFilter.value || !a.filterSearch.value) return !0;
			{
				let e = a.filterState.value.items.get(i);
				return e === void 0 || e > 0;
			}
		});
		return Vr(() => {
			a.allItems.value.set(i, n.textValue || c.value.textContent || c.value.innerText);
			let e = o?.id;
			e && (a.allGroups.value.has(e) ? a.allGroups.value.get(e)?.add(i) : a.allGroups.value.set(e, /* @__PURE__ */ new Set([i])));
		}), Gr(() => {
			a.allItems.value.delete(i);
		}), (t, o) => l.value ? fo([
			l.value,
			N(a).filterSearch.value,
			N(a).disabled.value,
			e.disabled,
			n.value,
			n.as,
			n.asChild,
			...Object.values(t.$attrs)
		], () => (z(), V(N(ch), G({ key: 0 }, n, {
			id: N(i),
			ref_key: "primitiveElement",
			ref: s,
			disabled: N(a).disabled.value || e.disabled,
			onSelect: o[0] ||= (t) => {
				r("select", t), t.defaultPrevented || (!N(a).multiple.value && !e.disabled && !N(a).disabled.value ? (t.preventDefault(), N(a).onOpenChange(!1), N(a).modelValue.value = n.value) : N(a).multiple.value && N(a).inputElement.value?.focus());
			}
		}), {
			default: P((n) => [L(t.$slots, "default", ve(La(n)), () => [W(A(e.value), 1)])]),
			_: 3
		}, 16, ["id", "disabled"])), o, 1) : za("v-if", !0);
	}
}), z_ = /* @__PURE__ */ I({
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
		return (e, n) => (z(), V(N(lh), ve(La(t)), {
			default: P(() => [L(e.$slots, "default")]),
			_: 3
		}, 16));
	}
}), B_ = /* @__PURE__ */ I({
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
		return (e, n) => (z(), V(N(Vm), ve(La(t)), {
			default: P(() => [L(e.$slots, "default")]),
			_: 3
		}, 16));
	}
}), V_ = /* @__PURE__ */ I({
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
		let t = e, { forwardRef: n, currentElement: r } = Vp(), i = E_(), a = K(() => t.disabled || i.disabled.value || !1);
		return Vr(() => {
			r.value && i.onTriggerElementChange(r.value);
		}), (r, o) => (z(), V(N(fm), G(t, {
			ref: N(n),
			type: e.as === "button" ? "button" : void 0,
			tabindex: "-1",
			"aria-label": "Show popup",
			"aria-haspopup": "listbox",
			"aria-expanded": N(i).open.value,
			"aria-controls": N(i).contentId,
			"data-state": N(i).open.value ? "open" : "closed",
			disabled: a.value,
			"data-disabled": a.value ? "" : void 0,
			"aria-disabled": a.value ?? void 0,
			onClick: o[0] ||= (e) => N(i).onOpenChange(!N(i).open.value)
		}), {
			default: P(() => [L(r.$slots, "default")]),
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
function H_(e) {
	let t = gp({ nonce: /* @__PURE__ */ j() });
	return K(() => e?.value || t.nonce?.value);
}
// node_modules/.pnpm/reka-ui@2.11.0_vue@3.5.42_typescript@6.0.3_/node_modules/reka-ui/dist/Combobox/ComboboxViewport.js
var U_ = /* @__PURE__ */ I({
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
		let t = e, { forwardRef: n } = Vp(), { nonce: r } = /* @__PURE__ */ pn(t), i = H_(r), a = E_();
		return (e, r) => (z(), B(R, null, [U(N(fm), G({
			...e.$attrs,
			...t
		}, {
			ref: N(n),
			"data-reka-combobox-viewport": "",
			role: "presentation",
			style: {
				position: "relative",
				flex: N(a).isVirtual.value ? void 0 : 1,
				overflow: "auto"
			}
		}), {
			default: P(() => [L(e.$slots, "default")]),
			_: 3
		}, 16, ["style"]), U(N(fm), {
			as: "style",
			nonce: N(i)
		}, {
			default: P(() => [...r[0] ||= [W(" /* Hide scrollbars cross-browser and enable momentum scroll for touch devices */ [data-reka-combobox-viewport] { scrollbar-width:none; -ms-overflow-style: none; -webkit-overflow-scrolling: touch; } [data-reka-combobox-viewport]::-webkit-scrollbar { display: none; } ", -1)]]),
			_: 1
		}, 8, ["nonce"])], 64));
	}
}), [W_, G_] = /*#__PURE__*/ Lf("FieldRoot"), K_ = [
	" ",
	"Enter",
	"ArrowUp",
	"ArrowDown"
], q_ = [" ", "Enter"];
function J_(e, t, n) {
	return e === void 0 ? !1 : Array.isArray(e) ? e.some((e) => Y_(e, t, n)) : Y_(e, t, n);
}
function Y_(e, t, n) {
	return e === void 0 || t === void 0 ? !1 : typeof e == "string" ? e === t : typeof n == "function" ? n(e, t) : typeof n == "string" ? e?.[n] === t?.[n] : Pf(e, t);
}
function X_(e) {
	return e == null || e === "" || Array.isArray(e) && e.length === 0;
}
// node_modules/.pnpm/reka-ui@2.11.0_vue@3.5.42_typescript@6.0.3_/node_modules/reka-ui/dist/Select/SelectRoot.js
var Z_ = ["value"], [Q_, $_] = /*#__PURE__*/ Lf("SelectRoot"), ev = /* @__PURE__ */ I({
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
		let n = e, r = t, { multiple: i, dir: a } = /* @__PURE__ */ pn(n), o = W_(null), s = K(() => n.name ?? o?.name.value), c = K(() => o ? n.required || o.required.value : n.required), l = K(() => !!(n.disabled || o?.disabled.value)), u = mp(n, "modelValue", r, {
			defaultValue: n.defaultValue ?? (i.value ? [] : void 0),
			passive: n.modelValue === void 0,
			deep: !0
		}), d = mp(n, "open", r, {
			defaultValue: n.defaultOpen,
			passive: n.open === void 0
		}), f = /* @__PURE__ */ j(), p = /* @__PURE__ */ j(), m = /* @__PURE__ */ j({
			x: 0,
			y: 0
		}), h = K(() => i.value && Array.isArray(u.value) ? u.value?.length === 0 : Bf(u.value));
		F(u, () => {
			o?.reportControlState({ filled: !h.value });
		}), Um({ isProvider: !0 });
		let g = Pp(a), _ = Bp(f), v = /* @__PURE__ */ j(/* @__PURE__ */ new Set()), y = K(() => Array.from(v.value).map((e) => e.value).join(";"));
		function b(e) {
			let t;
			if (i.value) {
				let r = Array.isArray(u.value) ? [...u.value] : [], i = r.findIndex((t) => Y_(t, e, n.by));
				i === -1 ? r.push(e) : r.splice(i, 1), t = [...r];
			} else t = e;
			u.value = t, o?.handleControlInput({ value: t });
		}
		function x(e) {
			return Array.from(v.value).find((t) => J_(e, t.value, n.by));
		}
		return $_({
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
		}), (t, n) => (z(), V(N(fh), null, {
			default: P(() => [L(t.$slots, "default", {
				modelValue: N(u),
				open: N(d)
			}), N(_) && s.value ? (z(), V(tv, {
				key: y.value,
				"aria-hidden": "true",
				tabindex: "-1",
				multiple: N(i),
				required: c.value,
				name: s.value,
				autocomplete: e.autocomplete,
				disabled: l.value,
				value: N(u)
			}, {
				default: P(() => [N(Bf)(N(u)) ? (z(), B("option", {
					key: 0,
					value: e.nullableValue
				}, null, 8, Z_)) : za("v-if", !0), (z(!0), B(R, null, ti(Array.from(v.value), (e) => (z(), B("option", G({ key: e.value ?? "" }, { ref_for: !0 }, e), null, 16))), 128))]),
				_: 1
			}, 8, [
				"multiple",
				"required",
				"name",
				"autocomplete",
				"disabled",
				"value"
			])) : za("v-if", !0)]),
			_: 3
		}));
	}
}), tv = /* @__PURE__ */ I({
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
		let t = e, n = /* @__PURE__ */ j(), r = Q_();
		F(() => t.value, (e, t) => {
			let r = window.HTMLSelectElement.prototype, i = Object.getOwnPropertyDescriptor(r, "value").set;
			if (e !== t && i && n.value) {
				let t = new Event("change", { bubbles: !0 });
				i.call(n.value, e), n.value.dispatchEvent(t);
			}
		});
		function i(e) {
			r.onValueChange(e.target.value);
		}
		return (e, r) => (z(), V(N(Wm), { "as-child": "" }, {
			default: P(() => [H("select", G({
				ref_key: "selectElement",
				ref: n
			}, t, { onInput: i }), [L(e.$slots, "default")], 16)]),
			_: 3
		}));
	}
}), nv = /* @__PURE__ */ I({
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
		let t = Hp(e);
		return (e, n) => (z(), V(N(w_), G(N(t), { style: {
			boxSizing: "border-box",
			"--reka-select-content-transform-origin": "var(--reka-popper-transform-origin)",
			"--reka-select-content-available-width": "var(--reka-popper-available-width)",
			"--reka-select-content-available-height": "var(--reka-popper-available-height)",
			"--reka-select-trigger-width": "var(--reka-popper-anchor-width)",
			"--reka-select-trigger-height": "var(--reka-popper-anchor-height)"
		} }), {
			default: P(() => [L(e.$slots, "default")]),
			_: 3
		}, 16));
	}
}), rv = {
	onViewportChange: () => {},
	itemTextRefCallback: () => {},
	itemRefCallback: () => {}
}, [iv, av] = /*#__PURE__*/ Lf("SelectContent"), ov = /* @__PURE__ */ I({
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
		let n = e, r = t, i = Q_();
		Rp(), Dp(n.bodyLock);
		let { CollectionSlot: a, getItems: o } = Um(), s = /* @__PURE__ */ j();
		$p(s);
		let { search: c, handleTypeaheadSearch: l } = im(), u = /* @__PURE__ */ j(), d = /* @__PURE__ */ j(), f = /* @__PURE__ */ j(), p = /* @__PURE__ */ j(!1), m = /* @__PURE__ */ j(!1), h = /* @__PURE__ */ j(!1);
		function g() {
			d.value && s.value && Bm([d.value, s.value]);
		}
		F(p, () => {
			g();
		});
		let { onOpenChange: _, triggerPointerDownPosRef: v } = i;
		tr((e) => {
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
					t = n.loop ? am(t, i + 1) : t.slice(i + 1);
				}
				setTimeout(() => Bm(t)), e.preventDefault();
			}
		}
		let b = tp(n, "loop"), x = Hp(K(() => n.position === "popper" ? b : {}).value);
		return av({
			content: s,
			viewport: u,
			onViewportChange: (e) => {
				u.value = e;
			},
			itemRefCallback: (e, t, n) => {
				let r = !m.value && !n, a = J_(i.modelValue.value, t, i.by);
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
				(J_(i.modelValue.value, t, i.by) || r) && (f.value = e);
			},
			focusSelectedItem: g,
			position: n.position,
			isPositioned: p,
			searchRef: c
		}), (t, n) => (z(), V(N(a), null, {
			default: P(() => [U(N(Im), {
				"as-child": "",
				onMountAutoFocus: n[6] ||= ds(() => {}, ["prevent"]),
				onUnmountAutoFocus: n[7] ||= (e) => {
					r("closeAutoFocus", e), e.defaultPrevented || (N(i).triggerElement.value?.focus({ preventScroll: !0 }), e.preventDefault());
				}
			}, {
				default: P(() => [U(N(xm), {
					"as-child": "",
					"disable-outside-pointer-events": e.disableOutsidePointerEvents,
					onFocusOutside: n[2] ||= ds(() => {}, ["prevent"]),
					onDismiss: n[3] ||= (e) => N(i).onOpenChange(!1),
					onEscapeKeyDown: n[4] ||= (e) => r("escapeKeyDown", e),
					onPointerDownOutside: n[5] ||= (e) => r("pointerDownOutside", e)
				}, {
					default: P(() => [(z(), V(Qr(e.position === "popper" ? nv : lv), G({
						...t.$attrs,
						...N(x)
					}, {
						id: N(i).contentId,
						ref: (e) => {
							if (!e) return;
							let t = N(op)(e);
							t?.hasAttribute("data-reka-popper-content-wrapper") ? s.value = t.firstElementChild : s.value = t;
						},
						role: "listbox",
						"data-state": N(i).open.value ? "open" : "closed",
						dir: N(i).dir.value,
						style: {
							display: "flex",
							flexDirection: "column",
							outline: "none"
						},
						onContextmenu: n[0] ||= ds(() => {}, ["prevent"]),
						onPlaced: n[1] ||= (e) => p.value = !0,
						onKeydown: y
					}), {
						default: P(() => [L(t.$slots, "default")]),
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
}), [sv, cv] = /*#__PURE__*/ Lf("SelectItemAlignedPosition"), lv = /* @__PURE__ */ I({
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
		let n = e, r = t, { getItems: i } = Um(), a = Q_(), o = iv(), s = /* @__PURE__ */ j(!1), c = /* @__PURE__ */ j(!0), l = /* @__PURE__ */ j(), { forwardRef: u, currentElement: d } = Vp(), { viewport: f, selectedItem: p, selectedItemText: m, focusSelectedItem: h } = o;
		function g() {
			if (a.triggerElement.value && a.valueElement.value && l.value && d.value && f?.value && p?.value && m?.value) {
				let e = a.triggerElement.value.getBoundingClientRect(), t = d.value.getBoundingClientRect(), n = a.valueElement.value.getBoundingClientRect(), o = m.value.getBoundingClientRect();
				if (a.dir.value !== "rtl") {
					let r = o.left - t.left, i = n.left - r, a = e.left - i, s = e.width + a, c = Math.max(s, t.width), u = window.innerWidth - 10, d = If(i, 10, Math.max(10, u - c));
					l.value.style.minWidth = `${s}px`, l.value.style.left = `${d}px`;
				} else {
					let r = t.right - o.right, i = window.innerWidth - n.right - r, a = window.innerWidth - e.right - i, s = e.width + a, c = Math.max(s, t.width), u = window.innerWidth - 10, d = If(i, 10, Math.max(10, u - c));
					l.value.style.minWidth = `${s}px`, l.value.style.right = `${d}px`;
				}
				let c = i().map((e) => e.ref), u = window.innerHeight - 20, h = f.value.scrollHeight, g = window.getComputedStyle(d.value), _ = Number.parseInt(g.borderTopWidth, 10), v = Number.parseInt(g.paddingTop, 10), y = Number.parseInt(g.borderBottomWidth, 10), b = Number.parseInt(g.paddingBottom, 10), x = _ + v + h + b + y, S = Math.min(p.value.offsetHeight * 5, x), C = window.getComputedStyle(f.value), w = Number.parseInt(C.paddingTop, 10), T = Number.parseInt(C.paddingBottom, 10), E = e.top + e.height / 2 - 10, D = u - E, O = p.value.offsetHeight / 2, ee = p.value.offsetTop + O, te = _ + v + ee, k = x - te;
				if (te <= E) {
					let e = p.value === c.at(-1);
					l.value.style.bottom = "0px";
					let t = d.value.clientHeight - f.value.offsetTop - f.value.offsetHeight, n = te + Math.max(D, O + (e ? T : 0) + t + y);
					l.value.style.height = `${n}px`;
				} else {
					let e = p.value === c[0];
					l.value.style.top = "0px";
					let t = Math.max(E, _ + f.value.offsetTop + (e ? w : 0) + O) + k;
					l.value.style.height = `${t}px`, f.value.scrollTop = te - E + f.value.offsetTop;
				}
				l.value.style.margin = "10px 0", l.value.style.minHeight = `${S}px`, l.value.style.maxHeight = `${u}px`, r("placed"), requestAnimationFrame(() => s.value = !0);
			}
		}
		let _ = /* @__PURE__ */ j("");
		Vr(async () => {
			await Ln(), g(), d.value && (_.value = window.getComputedStyle(d.value).zIndex);
		});
		function v(e) {
			e && c.value === !0 && (g(), h?.(), c.value = !1);
		}
		return pp(a.triggerElement, () => {
			g();
		}), cv({
			contentWrapper: l,
			shouldExpandOnScrollRef: s,
			onScrollButtonChange: v
		}), (e, t) => (z(), B("div", {
			ref_key: "contentWrapperElement",
			ref: l,
			style: fe({
				display: "flex",
				flexDirection: "column",
				position: "fixed",
				zIndex: _.value
			})
		}, [U(N(fm), G({
			ref: N(u),
			style: {
				boxSizing: "border-box",
				maxHeight: "100%"
			}
		}, {
			...e.$attrs,
			...n
		}), {
			default: P(() => [L(e.$slots, "default")]),
			_: 3
		}, 16)], 4));
	}
}), uv = /* @__PURE__ */ I({
	inheritAttrs: !1,
	__name: "SelectProvider",
	props: { context: {
		type: Object,
		required: !0
	} },
	setup(e) {
		return $_(e.context), av(rv), (e, t) => L(e.$slots, "default");
	}
}), dv = { key: 1 }, fv = /* @__PURE__ */ I({
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
		let n = e, r = Up(n, t), i = Q_(), a = /* @__PURE__ */ j();
		Vr(() => {
			a.value = new DocumentFragment();
		});
		let o = /* @__PURE__ */ j(), s = K(() => n.forceMount || i.open.value), c = /* @__PURE__ */ j(s.value), l;
		function u() {
			l &&= (clearTimeout(l), void 0);
		}
		return F(s, (e, t, n) => {
			u(), l = setTimeout(() => {
				c.value = s.value, l = void 0;
			}), n(u);
		}), Gr(u), (e, t) => s.value || c.value || o.value?.present ? (z(), V(N(lm), {
			key: 0,
			ref_key: "presenceRef",
			ref: o,
			present: s.value
		}, {
			default: P(() => [U(ov, ve(La({
				...N(r),
				...e.$attrs
			})), {
				default: P(() => [L(e.$slots, "default")]),
				_: 3
			}, 16)]),
			_: 3
		}, 8, ["present"])) : a.value ? (z(), B("div", dv, [(z(), V(vr, { to: a.value }, [U(uv, { context: N(i) }, {
			default: P(() => [L(e.$slots, "default")]),
			_: 3
		}, 8, ["context"])], 8, ["to"]))])) : za("v-if", !0);
	}
}), [pv, mv] = /*#__PURE__*/ Lf("SelectItem"), hv = /* @__PURE__ */ I({
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
		let n = e, r = t, { disabled: i } = /* @__PURE__ */ pn(n), a = Q_(), o = iv(), { forwardRef: s, currentElement: c } = Vp(), { CollectionItem: l } = Um(), u = K(() => J_(a.modelValue?.value, n.value, a.by)), d = /* @__PURE__ */ j(!1), f = /* @__PURE__ */ j(n.textValue ?? ""), p = em(void 0, "reka-select-item-text");
		async function m(e) {
			e.defaultPrevented || zf("select.select", h, {
				originalEvent: e,
				value: n.value
			});
		}
		async function h(e) {
			await Ln(), r("select", e), e.defaultPrevented || i.value || (a.onValueChange(n.value), a.multiple.value || a.onOpenChange(!1));
		}
		async function g(e) {
			await Ln(), e.defaultPrevented || (i.value ? o.onItemLeave?.() : e.currentTarget?.focus({ preventScroll: !0 }));
		}
		async function _(e) {
			await Ln(), e.defaultPrevented || e.currentTarget === Rf() && o.onItemLeave?.();
		}
		async function v(e) {
			await Ln(), e.defaultPrevented || (o.searchRef?.value === "" || e.key !== " ") && (q_.includes(e.key) && m(e), e.key === " " && e.preventDefault());
		}
		if (n.value === "") throw Error("A <SelectItem /> must have a value prop that is not an empty string. This is because the Select value can be set to an empty string to clear the selection and show the placeholder.");
		return Vr(() => {
			c.value && o.itemRefCallback(c.value, n.value, n.disabled);
		}), mv({
			value: n.value,
			disabled: i,
			textId: p,
			isSelected: u,
			onItemTextChange: (e) => {
				f.value = ((f.value || e?.textContent) ?? "").trim();
			}
		}), (t, n) => (z(), V(N(l), { value: { textValue: f.value } }, {
			default: P(() => [U(N(fm), {
				ref: N(s),
				role: "option",
				"aria-labelledby": N(p),
				"data-highlighted": d.value ? "" : void 0,
				"aria-selected": u.value,
				"data-state": u.value ? "checked" : "unchecked",
				"aria-disabled": N(i) || void 0,
				"data-disabled": N(i) ? "" : void 0,
				tabindex: N(i) ? void 0 : -1,
				as: e.as,
				"as-child": e.asChild,
				onFocus: n[0] ||= (e) => d.value = !0,
				onBlur: n[1] ||= (e) => d.value = !1,
				onPointerup: m,
				onPointerdown: n[2] ||= (e) => {
					e.currentTarget.focus({ preventScroll: !0 });
				},
				onTouchend: n[3] ||= ds(() => {}, ["prevent", "stop"]),
				onPointermove: g,
				onPointerleave: _,
				onKeydown: v
			}, {
				default: P(() => [L(t.$slots, "default", { selected: u.value })]),
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
}), gv = /* @__PURE__ */ I({
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
		let { forwardRef: t } = Vp(), n = pv();
		return (r, i) => (z(), V(N(lm), { present: e.forceMount || N(n).isSelected.value }, {
			default: P(() => [U(N(fm), {
				ref: N(t),
				"aria-hidden": "true",
				"data-state": N(n).isSelected.value ? "checked" : "unchecked",
				as: e.as,
				"as-child": e.asChild
			}, {
				default: P(() => [L(r.$slots, "default")]),
				_: 3
			}, 8, [
				"data-state",
				"as",
				"as-child"
			])]),
			_: 3
		}, 8, ["present"]));
	}
}), _v = /* @__PURE__ */ I({
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
		let t = e, n = Q_(), r = iv(), i = pv(), { forwardRef: a, currentElement: o } = Vp(), s = K(() => ({
			value: i.value,
			disabled: i.disabled.value,
			textContent: o.value?.textContent ?? i.value?.toString() ?? ""
		}));
		return Vr(() => {
			o.value && (i.onItemTextChange(o.value), r.itemTextRefCallback(o.value, i.value, i.disabled.value), n.onOptionAdd(s.value));
		}), Gr(() => {
			n.onOptionRemove(s.value);
		}), (e, n) => (z(), V(N(fm), G({
			id: N(i).textId,
			ref: N(a)
		}, {
			...t,
			...e.$attrs
		}), {
			default: P(() => [L(e.$slots, "default")]),
			_: 3
		}, 16, ["id"]));
	}
}), vv = /* @__PURE__ */ I({
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
		return (e, n) => (z(), V(N(Vm), ve(La(t)), {
			default: P(() => [L(e.$slots, "default")]),
			_: 3
		}, 16));
	}
}), yv = /* @__PURE__ */ I({
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
		let t = e, n = Q_(), { forwardRef: r, currentElement: i } = Vp(), a = K(() => n.disabled?.value || t.disabled);
		n.contentId ||= em(void 0, "reka-select-content"), Vr(() => {
			n.onTriggerChange(i.value);
		});
		let o = W_(null), s = li();
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
		Vr(() => {
			f = o?.registerControl({
				id: c,
				element: () => i.value,
				getValue: () => n.modelValue.value,
				required: () => !!n.required?.value
			});
		}), Wr(() => f?.());
		let { getItems: p } = Um(), { search: m, handleTypeaheadSearch: h, resetTypeahead: g } = im();
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
			!(e.ctrlKey || e.altKey || e.metaKey) && e.key.length === 1 && h(e.key, p()), t && e.key === " " || K_.includes(e.key) && (_(), e.preventDefault());
		}
		return (t, i) => (z(), V(N(ph), {
			"as-child": "",
			reference: e.reference
		}, {
			default: P(() => [U(N(fm), G(l(), {
				ref: N(r),
				role: "combobox",
				type: e.as === "button" ? "button" : void 0,
				"aria-controls": N(n).open.value ? N(n).contentId : void 0,
				"aria-expanded": N(n).open.value || !1,
				"aria-required": N(n).required?.value,
				"aria-autocomplete": "none",
				disabled: a.value,
				dir: N(n)?.dir.value,
				"data-state": N(n)?.open.value ? "open" : "closed",
				"data-disabled": a.value ? "" : void 0,
				"data-placeholder": N(X_)(N(n).modelValue?.value) ? "" : void 0,
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
				default: P(() => [L(t.$slots, "default")]),
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
}), bv = /* @__PURE__ */ I({
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
		let t = e, { forwardRef: n, currentElement: r } = Vp(), i = Q_();
		Vr(() => {
			i.valueElement = r;
		});
		let a = K(() => {
			let e = [], t = Array.from(i.optionsSet.value), n = (e) => t.find((t) => J_(e, t.value, i.by));
			return e = Array.isArray(i.modelValue.value) ? i.modelValue.value.map((e) => n(e)?.textContent ?? "") : [n(i.modelValue.value)?.textContent ?? ""], e.filter(Boolean);
		}), o = K(() => a.value.length ? a.value.join(", ") : t.placeholder);
		return (r, s) => (z(), V(N(fm), {
			ref: N(n),
			as: e.as,
			"as-child": e.asChild,
			style: { pointerEvents: "none" },
			"data-placeholder": a.value.length ? void 0 : t.placeholder
		}, {
			default: P(() => [L(r.$slots, "default", {
				selectedLabel: a.value,
				modelValue: N(i).modelValue.value
			}, () => [W(A(o.value), 1)])]),
			_: 3
		}, 8, [
			"as",
			"as-child",
			"data-placeholder"
		]));
	}
}), xv = /* @__PURE__ */ I({
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
		let t = e, { nonce: n } = /* @__PURE__ */ pn(t), r = H_(n), i = iv(), a = i.position === "item-aligned" ? sv() : void 0, { forwardRef: o, currentElement: s } = Vp();
		Vr(() => {
			i?.onViewportChange(s.value);
		});
		let c = /* @__PURE__ */ j(0);
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
		return (e, n) => (z(), B(R, null, [U(N(fm), G({
			ref: N(o),
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
			default: P(() => [L(e.$slots, "default")]),
			_: 3
		}, 16), U(N(fm), {
			as: "style",
			nonce: N(r)
		}, {
			default: P(() => [...n[0] ||= [W(" /* Hide scrollbars cross-browser and enable momentum scroll for touch devices */ [data-reka-select-viewport] { scrollbar-width:none; -ms-overflow-style: none; -webkit-overflow-scrolling: touch; } [data-reka-select-viewport]::-webkit-scrollbar { display: none; } ", -1)]]),
			_: 1
		}, 8, ["nonce"])], 64));
	}
}), Sv = /* @__PURE__ */ I((e) => {
	let t = /* @__PURE__ */ j(null), n = /* @__PURE__ */ j(""), r = /* @__PURE__ */ j(!1), i = K({
		get: () => e.value ?? n.value,
		set: (t) => {
			e.onValueChange ? e.onValueChange(t) : n.value = t;
		}
	});
	return F([i, r], ([t, n], r, i) => {
		if (n) return;
		let a = window.setTimeout(() => e.onSearch(t), 180);
		i(() => window.clearTimeout(a));
	}, { immediate: !0 }), () => U(O_, {
		open: !1,
		ignoreFilter: !0,
		class: "ap-search-field"
	}, { default: () => [U(k_, G({ as: "div" }, {
		onClick: () => t.value?.$el.focus(),
		onCompositionstart: () => {
			r.value = !0;
		},
		onCompositionend: (e) => {
			i.value = e.target.value, r.value = !1;
		}
	}), { default: () => [i.value ? U("button", {
		type: "button",
		class: "ap-search-clear",
		"aria-label": e.clearLabel,
		title: e.clearLabel,
		onClick: () => {
			i.value = "", t.value?.$el.focus();
		}
	}, [U("svg", {
		width: "16",
		height: "16",
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		"stroke-width": "2",
		"stroke-linecap": "round",
		"aria-hidden": "true"
	}, [U("path", { d: "m18 6-12 12M6 6l12 12" }, null)])]) : U("svg", {
		class: "ap-search-icon",
		width: "16",
		height: "16",
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		"stroke-width": "2",
		"stroke-linecap": "round",
		"aria-hidden": "true"
	}, [U("circle", {
		cx: "11",
		cy: "11",
		r: "8"
	}, null), U("path", { d: "m21 21-4.35-4.35" }, null)]), U(L_, G({
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
] }), Cv = /* @__PURE__ */ I((e) => {
	let t = Tr(), n = /* @__PURE__ */ j(null), r = /* @__PURE__ */ j(!1), i = K(() => r.value && !e.disabled);
	return () => {
		let { icon: a, label: o, options: s, multiple: c, disabled: l } = e;
		return U("div", {
			class: "ap-search-options",
			onFocusout: (e) => {
				e.currentTarget.contains(e.relatedTarget) || (r.value = !1);
			},
			onKeydown: (e) => {
				i.value && e.key === "Escape" && (e.preventDefault(), e.stopPropagation(), r.value = !1, n.value?.focus());
			}
		}, [U("button", {
			ref: n,
			type: "button",
			disabled: l,
			class: "ap-search-action",
			"aria-label": o,
			title: o,
			"aria-expanded": i.value,
			"aria-controls": t,
			onClick: () => r.value = !r.value
		}, [U("svg", {
			width: "16",
			height: "16",
			viewBox: "0 0 24 24",
			fill: "none",
			stroke: "currentColor",
			"stroke-width": "2",
			"stroke-linecap": "round",
			"aria-hidden": "true"
		}, [a === "filter" ? U("path", { d: "M3 6h18M6 12h12M9 18h6" }, null) : U(R, null, [
			U("path", { d: "M20 7h-9m3 10H5" }, null),
			U("circle", {
				cx: "7",
				cy: "7",
				r: "3"
			}, null),
			U("circle", {
				cx: "17",
				cy: "17",
				r: "3"
			}, null)
		])])]), U("div", {
			id: t,
			class: "ap-search-menu",
			role: c ? "group" : "radiogroup",
			"aria-label": o,
			hidden: !i.value
		}, [s.map((e) => U("label", {
			key: e.id,
			onMousedown: (e) => e.preventDefault()
		}, [
			U("input", {
				type: c ? "checkbox" : "radio",
				name: t,
				checked: e.checked,
				onChange: e.select
			}, null),
			U("span", null, [e.label]),
			U("svg", {
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
			}, [U("path", { d: "m5 12 4 4L19 6" }, null)])
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
function wv(e, t) {
	let n = /* @__PURE__ */ M(t[0]);
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
// src/api/client.ts
var X = class extends Error {
	code;
	status;
	fields;
	requestId;
	details;
	constructor(e, t, n, r, i) {
		super(e), this.code = e, this.status = t, this.fields = n, this.requestId = r, this.details = i;
	}
};
function Z(e) {
	return typeof e == "object" && !!e && !Array.isArray(e);
}
async function Tv(e, t) {
	return Ev(e, "GET", void 0, t);
}
async function Ev(e, n, r, i, a = 1e4) {
	let o = new AbortController(), s = !1, c = () => o.abort();
	i?.aborted && c(), i?.addEventListener("abort", c, { once: !0 });
	let l = setTimeout(() => {
		s = !0, o.abort();
	}, a);
	try {
		let i = await t.api.fetchApi(e, {
			method: n,
			signal: o.signal,
			headers: e.startsWith("/astrophoto/v1/") ? {
				"X-AstroPhoto-Local": "1",
				...r ? { "Content-Type": "application/json" } : {}
			} : void 0,
			body: r ? JSON.stringify(r) : void 0
		});
		if (!i.ok) {
			let e = await i.json?.().catch(() => null), t = Z(e) && Z(e.error) ? e.error.code : Z(e) ? e.reason : null, n = Z(e) && Z(e.error) && Z(e.error.details) ? e.error.details : null;
			throw new X(typeof t == "string" ? t : "http", i.status, Z(n?.fields) ? n.fields : void 0, Z(e) && typeof e.request_id == "string" ? e.request_id : void 0, n ?? void 0);
		}
		if (i.status === 204) return null;
		try {
			return await i.json();
		} catch (e) {
			throw o.signal.aborted ? e : new X("json");
		}
	} catch (e) {
		throw i?.aborted ? new DOMException("Aborted", "AbortError") : s ? new X("timeout") : e instanceof X ? e : new X("network");
	} finally {
		clearTimeout(l), i?.removeEventListener("abort", c);
	}
}
// src/shared/Feedback.tsx
var Dv = /* @__PURE__ */ I((e) => {
	let { t } = Y();
	return () => {
		let { error: n, retry: r } = e, i = n instanceof X ? n.code : "canvas";
		return U("div", { role: "alert" }, [U("p", null, [t(`errors.${i}`, { status: n instanceof X ? n.status : "" }, t("errors.unknown"))]), r && U("button", { onClick: r }, [t("actions.retry")])]);
	};
}, { props: ["error", "retry"] });
// src/host/canvas.ts
function Ov() {
	return window.LiteGraph;
}
function kv(e, n, r = t, i = Ov()) {
	let a = r.canvas, o = a?.graph;
	if (!r.isGraphReady || !o || a.read_only || a.selectOnly || !a.allow_interaction) throw Error("CANVAS_UNAVAILABLE");
	if (!i?.registered_node_types[e]) throw Error("NODE_NOT_REGISTERED");
	let s = a.canvas.getBoundingClientRect(), c = r.clientPosToCanvasPos(n ?? [s.left + s.width / 2, s.top + s.height / 2]);
	if (!c.every(Number.isFinite)) throw Error("INVALID_POSITION");
	o.beforeChange(), a.emitBeforeChange();
	let l;
	try {
		if (l = i.createNode(e), !l) throw Error("NODE_NOT_REGISTERED");
		if (l.pos = c, !o.add(l)) throw Error("GRAPH_ADD_FAILED");
		return o.change(), l;
	} catch (e) {
		throw l?.graph === o ? o.remove(l) : l?.onRemoved?.(), e;
	} finally {
		try {
			o.afterChange();
		} finally {
			a.emitAfterChange();
		}
	}
}
// src/host/dragDrop.ts
var Av = "application/x-astrophoto-resource+json";
function jv(e, t) {
	e.effectAllowed = "copy", e.setData(Av, JSON.stringify({
		v: 1,
		kind: "node",
		nodeId: t
	}));
}
function Mv(e, t) {
	let n = JSON.parse(e);
	if (!n || typeof n != "object" || !("v" in n) || n.v !== 1 || !("kind" in n) || n.kind !== "node" || !("nodeId" in n) || typeof n.nodeId != "string" || !t.has(n.nodeId)) throw Error("INVALID_DRAG");
	return n.nodeId;
}
function Nv(e, n) {
	let r = (e) => e.target === t.canvas?.canvas && e.dataTransfer?.types.includes("application/x-astrophoto-resource+json"), i = (e) => {
		r(e) && (e.preventDefault(), e.stopImmediatePropagation(), e.dataTransfer && (e.dataTransfer.dropEffect = "copy"));
	}, a = (t) => {
		if (r(t)) {
			t.preventDefault(), t.stopImmediatePropagation();
			try {
				kv(Mv(t.dataTransfer.getData(Av), e), [t.clientX, t.clientY]), n(null);
			} catch (e) {
				n(e);
			}
		}
	};
	return document.addEventListener("dragover", i, !0), document.addEventListener("drop", a, !0), () => {
		document.removeEventListener("dragover", i, !0), document.removeEventListener("drop", a, !0);
	};
}
// src/shared/DisclosureChevron.tsx
function Pv() {
	return U("svg", {
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
	}, [U("path", { d: "m6 9 6 6 6-6" }, null)]);
}
// src/features/nodes/NodeHoverPreview.tsx
var Fv = 16, Iv = (e, t, n) => Math.max(t, Math.min(e, n)), Lv = /* @__PURE__ */ I((e) => {
	let { t: n } = Y(), r = /* @__PURE__ */ j(null);
	return nr((n) => {
		let { anchor: i } = e, a = r.value;
		if (!a) return;
		let o = i.closest(".astrophoto-ui") ?? i, s = i.closest(".ap-scroll"), c = () => {
			let e = i.getBoundingClientRect(), n = s?.getBoundingClientRect();
			if (!e.width || !e.height || e.bottom <= 0 || e.top >= window.innerHeight || n && (e.bottom <= n.top || e.top >= n.bottom)) {
				a.style.visibility = "hidden";
				return;
			}
			let { width: r, height: c } = a.getBoundingClientRect(), l = o.getBoundingClientRect(), u = l.left - Fv - r, d = l.right + Fv, f = t.extensionManager.setting.get("Comfy.Sidebar.Location") === "right", p = f ? u : d;
			f && u < Fv && d + r <= window.innerWidth - Fv && (p = d), !f && d + r > window.innerWidth - Fv && u >= Fv && (p = u), a.style.left = `${Iv(p, Fv, window.innerWidth - r - Fv)}px`;
			let m = e.top + e.height / 2 - c * .3;
			a.style.top = `${Iv(m, Fv, window.innerHeight - c - Fv)}px`, a.style.visibility = "visible";
		};
		c();
		let l = new ResizeObserver(c);
		l.observe(a), o !== i && l.observe(o), window.addEventListener("resize", c), window.addEventListener("scroll", c, !0), n(() => {
			l.disconnect(), window.removeEventListener("resize", c), window.removeEventListener("scroll", c, !0);
		});
	}), () => {
		let { node: t } = e, i = [[n("nodes.inputs"), t.inputs], [n("nodes.outputs"), t.outputs]];
		return U(vr, { to: "body" }, { default: () => [U("aside", {
			class: "astrophoto-node-preview",
			ref: r,
			"aria-hidden": "true"
		}, [U("div", { class: "ap-preview-miniature" }, [U("div", { class: "ap-preview-node-title" }, [t.title]), U("div", { class: "ap-preview-sockets" }, [U("div", null, [t.inputs.map(([e], t) => U("span", { key: t }, [e]))]), U("div", null, [t.outputs.map(([e], t) => U("span", { key: t }, [e]))])])]), U("div", { class: "ap-preview-content" }, [
			U("h3", null, [t.title]),
			t.description && U("p", null, [t.description]),
			i.map(([e, t]) => t.length > 0 && U("div", {
				class: "ap-preview-ports",
				key: e
			}, [U("h4", null, [e]), U("dl", null, [t.map(([e, t], n) => U("div", { key: n }, [U("dt", null, [e]), U("dd", null, [t])]))])]))
		])])] });
	};
}, { props: ["node", "anchor"] });
// src/features/nodes/NodeTree.tsx
function Rv(e, t, n = (e) => e) {
	let r = [], i = /* @__PURE__ */ new Map();
	for (let t of e) {
		let e = r, a = "", o = t.category.split("/").filter(Boolean);
		o[0] === "AstroPhoto" && o.shift();
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
		e.push({
			kind: "node",
			key: t.id,
			label: t.title,
			node: t
		});
	}
	if (t) {
		let e = (e) => e.sort((e, n) => t(e.label, n.label));
		e(r);
		for (let t of i.values()) e(t.children);
	}
	return r;
}
var zv = /* @__PURE__ */ I((e) => {
	let t = /* @__PURE__ */ M(null), n = !1;
	return F(() => e.previewEnabled, (e) => {
		e || (t.value = null);
	}), () => {
		let { node: r, level: i, selectNode: a, previewEnabled: o, isBookmarked: s, toggleBookmark: c, bookmarkLabel: l } = e;
		return U("li", null, [U("div", {
			class: "ap-tree-row ap-tree-leaf",
			onPointerenter: (e) => {
				e.pointerType === "mouse" && o && !n && (t.value = e.currentTarget);
			},
			onPointerleave: () => t.value = null
		}, [U("button", {
			type: "button",
			class: "ap-resource",
			style: { paddingInlineStart: `${8 + i * 24}px` },
			draggable: !0,
			onDragstart: (e) => {
				n = !0, t.value = null, e.dataTransfer && jv(e.dataTransfer, r.id);
			},
			onDragend: () => {
				n = !1;
			},
			onClick: () => {
				t.value = null, a(r.id);
			}
		}, [U("svg", {
			width: "16",
			height: "16",
			viewBox: "0 0 16 16",
			fill: "none",
			"aria-hidden": "true"
		}, [U("path", {
			stroke: "currentColor",
			"stroke-linecap": "round",
			"stroke-width": "1.3",
			d: "m11.2667 10.45-.0842.3156c-.143.5363-.6286.9094-1.18362.9094H4.6945c-.80486 0-1.39102-.7629-1.18364-1.5406l1.30667-4.90002c.143-.53625.62865-.90937 1.18364-.90937h5.46393c.7243 0 1.2518.68663 1.0652 1.38652l-.0301.11275M15.35 8.00001h-4.9m-6.73748 0H.65002"
		}, null)]), U("span", null, [r.title])]), U("button", {
			type: "button",
			class: "ap-tree-bookmark",
			"aria-label": l(s(r)),
			title: l(s(r)),
			"aria-pressed": s(r),
			onClick: () => {
				t.value = null, c(r);
			}
		}, [U("svg", {
			width: "16",
			height: "16",
			viewBox: "0 0 24 24",
			fill: s(r) ? "currentColor" : "none",
			stroke: "currentColor",
			"stroke-width": "2",
			"stroke-linecap": "round",
			"stroke-linejoin": "round",
			"aria-hidden": "true"
		}, [U("path", { d: "M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16l-6-4-6 4Z" }, null)])])]), o && t.value && U(Lv, {
			anchor: t.value,
			node: r
		}, null)]);
	};
}, { props: [
	"node",
	"level",
	"selectNode",
	"previewEnabled",
	"isBookmarked",
	"toggleBookmark",
	"bookmarkLabel"
] });
function Bv({ entries: e, level: t = 0, ...n }) {
	let r = { paddingInlineStart: `${8 + t * 24}px` };
	return U("ul", {
		class: "ap-node-tree",
		role: "list"
	}, [e.map((e) => {
		if (e.kind === "folder") {
			let i = n.isExpanded(e.key);
			return U("li", { key: `folder:${e.key}` }, [U("button", {
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
				U(Pv, null, null),
				U("svg", {
					width: "16",
					height: "16",
					viewBox: "0 0 24 24",
					fill: "none",
					stroke: "currentColor",
					"stroke-width": "2",
					"stroke-linecap": "round",
					"stroke-linejoin": "round",
					"aria-hidden": "true"
				}, [U("path", { d: "M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-8a2 2 0 0 1-1.6-.8l-.8-1.1A2 2 0 0 0 8 3.3H4a2 2 0 0 0-2 2V18a2 2 0 0 0 2 2Z" }, null)]),
				U("span", null, [e.label])
			]), i && U(Bv, G({
				entries: e.children,
				level: t + 1
			}, n), null)]);
		}
		return U(zv, G({
			key: `node:${e.key}`,
			node: e.node,
			level: t
		}, n), null);
	})]);
}
Bv.inheritAttrs = !1;
// src/features/nodes/NodesPage.tsx
var Vv = ["original", "alphabetical"], Hv = "Comfy.NodeLibrary.Bookmarks.V2";
function Uv() {
	let e = t.extensionManager.setting.get(Hv);
	return Array.isArray(e) ? e.filter((e) => typeof e == "string") : [];
}
var Wv = /* @__PURE__ */ I((e) => {
	let { t: n, locale: r } = Y(), i = /* @__PURE__ */ j(""), a = /* @__PURE__ */ M(/* @__PURE__ */ new Set()), o = /* @__PURE__ */ M(/* @__PURE__ */ new Set()), s = /* @__PURE__ */ M([]), [c, l] = wv("AstroPhoto.Nodes.Sort", Vv), u = /* @__PURE__ */ j(null), d = /* @__PURE__ */ M(Uv()), f = /* @__PURE__ */ j(!1), p = /* @__PURE__ */ M(null), m = (e) => {
		i.value = e, o.value = /* @__PURE__ */ new Set();
	};
	F(() => e.active, (e, t, n) => {
		if (!e) return;
		let r = () => {
			let e = Uv(), t = d.value;
			t.length === e.length && t.every((t, n) => t === e[n]) || (d.value = e);
		};
		r();
		let i = window.setInterval(r, 500);
		n(() => window.clearInterval(i));
	}, { immediate: !0 }), F(() => e.resource, (e, t, n) => {
		n(Nv(new Set(e.state === "ready" ? e.data.map((e) => e.id) : []), (e) => {
			p.value = { error: e };
		}));
	}, { immediate: !0 });
	let h = (e) => {
		u.value = e;
	};
	return () => {
		let { active: g, resource: _, refresh: v } = e, y = _.state === "ready" ? _.data.filter((e) => e.category.split("/")[0] !== "examples") : [], b = [...new Set(y.map((e) => e.category))], x = b.filter((e) => s.value.includes(e)), S = (e) => e === "Assets" ? n("nav.assets") : e, C = (e) => e.split("/").filter((e, t) => e && (t !== 0 || e !== "AstroPhoto")).map(S).join(" / ") || n("nodes.uncategorized"), w = i.value.trim().toLocaleLowerCase(), T = y.filter((e) => (x.length === 0 || x.includes(e.category)) && [
			e.id,
			e.title,
			e.category,
			C(e.category),
			...e.aliases,
			e.description
		].join(" ").toLocaleLowerCase().includes(w)), E = Rv(T, c.value === "alphabetical" ? (e, t) => e.localeCompare(t, r.value) : void 0, S), D = (e) => d.value.includes(e.id) || d.value.includes(`${e.category}/${e.id}`), O = (e) => {
			f.value = !1;
			let n = Uv(), r = `${e.category}/${e.id}`, i = n.includes(e.id) || n.includes(r) ? n.filter((t) => t !== e.id && t !== r) : [...n, e.id];
			try {
				let e = t.extensionManager.setting.set(Hv, i);
				d.value = i, Promise.resolve(e).catch(() => {
					d.value = Uv(), f.value = !0;
				});
			} catch {
				f.value = !0;
			}
		}, ee = d.value.flatMap((e) => {
			if (e.endsWith("/")) return [];
			let t = e.split("/"), n = T.find((e) => e.id === t[t.length - 1]);
			return n ? [{
				...n,
				category: t.slice(0, -1).join("/")
			}] : [];
		}), te = (e, t) => {
			let n = w ? o : a, r = new Set(n.value);
			(w ? !t : t) ? r.add(e) : r.delete(e), n.value = r;
		}, k = y.find((e) => e.id === u.value), ne = (e) => {
			try {
				kv(e), p.value = { error: null };
			} catch (e) {
				p.value = { error: e };
			}
		};
		return U(R, null, [
			U("div", { class: "ap-search-toolbar" }, [
				U(Sv, {
					label: n("nodes.search"),
					clearLabel: n("browse.clear"),
					onSearch: m
				}, null),
				U(Cv, {
					icon: "filter",
					label: n("browse.filter"),
					multiple: !0,
					disabled: b.length === 0,
					options: [{
						id: "all",
						label: n("browse.allCategories"),
						checked: x.length === 0,
						select: () => s.value = []
					}, ...b.map((e) => ({
						id: `category:${e}`,
						label: C(e),
						checked: x.includes(e),
						select: () => {
							s.value = x.includes(e) ? x.filter((t) => t !== e) : [...x, e];
						}
					}))]
				}, null),
				U(Cv, {
					icon: "sort",
					label: n("browse.sort"),
					options: Vv.map((e) => ({
						id: e,
						label: n(`browse.${e}`),
						checked: c.value === e,
						select: () => l(e)
					}))
				}, null)
			]),
			_.state === "loading" && U("p", { role: "status" }, [n("states.loading")]),
			_.state === "error" && U(Dv, {
				error: _.error,
				retry: v
			}, null),
			_.state === "ready" && U(R, null, [U("div", {
				hidden: !!k,
				class: "ap-scroll"
			}, [
				U("h3", { class: "ap-bookmarks-heading" }, [n("nodes.bookmarks")]),
				ee.length === 0 ? U("div", { class: "ap-bookmarks-empty" }, [n("nodes.noBookmarks")]) : U(Bv, {
					entries: Rv(ee),
					isExpanded: (e) => w ? !o.value.has(e) : a.value.has(e),
					setExpanded: te,
					selectNode: h,
					previewEnabled: g && !k,
					isBookmarked: D,
					toggleBookmark: O,
					bookmarkLabel: (e) => n(e ? "nodes.removeBookmark" : "nodes.addBookmark")
				}, null),
				y.length === 0 ? U("p", null, [n("nodes.empty")]) : T.length === 0 ? U("p", null, [n("nodes.noResults")]) : U(Bv, {
					entries: E,
					isExpanded: (e) => w ? !o.value.has(e) : a.value.has(e),
					setExpanded: te,
					selectNode: h,
					previewEnabled: g && !k,
					isBookmarked: D,
					toggleBookmark: O,
					bookmarkLabel: (e) => n(e ? "nodes.removeBookmark" : "nodes.addBookmark")
				}, null)
			]), k && U("div", { class: "ap-scroll" }, [
				U("button", { onClick: () => h(null) }, [n("actions.back")]),
				U("h2", null, [k.title]),
				U("code", null, [k.id]),
				U("p", null, [k.description || n("nodes.noDescription")]),
				U("p", null, [n("nodes.registered")]),
				U("h3", null, [n("nodes.inputs")]),
				U("dl", null, [k.inputs.map(([e, t]) => U("div", { key: e }, [U("dt", null, [e]), U("dd", null, [t])]))]),
				U("h3", null, [n("nodes.outputs")]),
				U("dl", null, [k.outputs.map(([e, t]) => U("div", { key: e }, [U("dt", null, [e]), U("dd", null, [t])]))]),
				U("p", null, [n("nodes.dependencies")]),
				U("p", null, [n("nodes.helpUnavailable")]),
				U("button", { onClick: () => ne(k.id) }, [n("nodes.add")])
			])]),
			f.value && U("p", { role: "alert" }, [n("errors.bookmark")]),
			p.value && (p.value.error ? U(Dv, { error: p.value.error }, null) : U("p", { role: "status" }, [n("nodes.created")]))
		]);
	};
}, { props: [
	"active",
	"resource",
	"refresh"
] }), Gv = /* @__PURE__ */ I(() => {
	let { t: e } = Y();
	return () => U("p", { class: "ap-scroll" }, [e("assets.placeholder")]);
}), Kv = [
	"storage",
	"environment",
	"software",
	"equipment",
	"knowledge",
	"memory",
	"agent",
	"system"
], qv = {
	software: "software",
	equipment: "equipment",
	knowledge: "knowledge",
	memory: "memory"
}, Jv = "/astrophoto/v1", Yv = (e) => e === "reference" || e === "copy", Xv = (e) => typeof e == "number" && Number.isFinite(e) && e >= 0, Zv = (e) => e === null || Xv(e), Qv = (e, t) => t.every((t) => typeof e[t] == "string");
function $v(e) {
	return Z(e) && Qv(e, ["operation_id", "phase"]) && (e.kind === "migration" || e.kind === "import");
}
async function ey(e) {
	let t = await Ev(Jv + "/storage", "GET", void 0, e);
	if (Z(t) && typeof t.reason == "string") throw new X(t.reason);
	if (!Z(t) || !["ready", "degraded"].includes(String(t.status)) || !Z(t.data_root) || !Qv(t.data_root, ["path", "source"]) || !Z(t.database) || !Qv(t.database, ["assets"]) || !Z(t.imports) || !Yv(t.imports.default_mode) || !Xv(t.imports.revision) || typeof t.default_workspace_id != "string" || !Array.isArray(t.workspaces) || !t.workspaces.every((e) => Z(e) && Qv(e, [
		"id",
		"name",
		"root_path",
		"status"
	]) && typeof e.enabled == "boolean" && typeof e.is_default == "boolean" && Xv(e.revision) && Zv(e.free_bytes)) || !Z(t.cache) || !Qv(t.cache, ["path", "status"]) || !Xv(t.cache.max_size_gb) || !Zv(t.cache.used_bytes) || !Z(t.capabilities) || typeof t.capabilities.write != "boolean" || typeof t.capabilities.import != "boolean" || !Array.isArray(t.operations) || !t.operations.every($v)) throw new X("schema");
	return t;
}
async function ty(e, t, n, r = "POST") {
	let i = await Ev(Jv + e, r, t, n);
	if (!Z(i) || typeof i.request_id != "string") throw new X("schema");
	return i;
}
async function ny(e, t, n) {
	let r = await ty(e === "import" ? "/assets/import" : "/storage/migrations", t, n);
	if (typeof r.operation_id != "string") throw new X("schema");
	return {
		operation_id: r.operation_id,
		kind: e,
		phase: "queued"
	};
}
function ry(e) {
	return (e.kind === "import" ? "/assets/imports" : "/storage/migrations") + "/" + encodeURIComponent(e.operation_id);
}
function iy(e) {
	return !Z(e) || ![
		"processed",
		"total",
		"registered",
		"copied",
		"failed",
		"skipped"
	].every((t) => !(t in e) || Xv(e[t])) ? !1 : e.errors === void 0 || Array.isArray(e.errors) && e.errors.every((e) => Z(e) && Xv(e.entry) && typeof e.code == "string");
}
async function ay(e, t) {
	let n = await Ev(Jv + ry(e), "GET", void 0, t);
	if (!Z(n) || n.operation_id !== e.operation_id || n.kind !== e.kind || !iy(n.receipt) || n.error !== null && (!Z(n.error) || typeof n.error.code != "string") || n.effective_import_mode !== null && !Yv(n.effective_import_mode) || !$v(n)) throw new X("schema");
	return n;
}
// src/features/storage/format.ts
function oy(e) {
	return e == null ? "—" : e < 1024 ? `${e} B` : new Intl.NumberFormat(void 0, { maximumFractionDigits: 2 }).format(e / 1024 ** 3) + " GiB";
}
// src/features/storage/CacheSettings.vue?vue&type=script&setup=true&lang.ts
var sy = { class: "ap-storage-group" }, cy = { class: "ap-storage-group-heading" }, ly = ["data-state"], uy = ["disabled"], dy = { class: "ap-storage-actions" }, fy = ["disabled"], py = ["disabled"], my = /* @__PURE__ */ I({
	__name: "CacheSettings",
	props: {
		storage: {},
		disabled: { type: Boolean }
	},
	emits: ["change", "clear"],
	setup(e, { emit: n }) {
		let r = e, i = n, { t: a } = Y(), o = /* @__PURE__ */ j(), s = /* @__PURE__ */ j(), c = K({
			get: () => o.value ?? r.storage.cache.path,
			set: (e) => {
				o.value = e.trim() === r.storage.cache.path ? void 0 : e;
			}
		}), l = K({
			get: () => s.value ?? r.storage.cache.max_size_gb,
			set: (e) => {
				s.value = Number(e) === r.storage.cache.max_size_gb ? void 0 : e;
			}
		}), u = K(() => c.value.trim() !== r.storage.cache.path || Number(l.value) !== r.storage.cache.max_size_gb);
		F(() => r.storage.cache.path, (e) => {
			o.value?.trim() === e && (o.value = void 0);
		}), F(() => r.storage.cache.max_size_gb, (e) => {
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
		return (t, n) => (z(), B("section", sy, [H("div", cy, [
			H("h3", null, A(N(a)("storage.cache")), 1),
			H("span", {
				class: "ap-storage-badge",
				"data-state": e.storage.cache.status
			}, A(N(a)("storage.states." + e.storage.cache.status)), 9, ly),
			H("small", null, A(N(a)("storage.used")) + " " + A(N(oy)(e.storage.cache.used_bytes)), 1)
		]), H("form", { onSubmit: ds(d, ["prevent"]) }, [H("fieldset", {
			class: "ap-storage-fields",
			disabled: e.disabled
		}, [
			H("label", null, [W(A(N(a)("storage.path")), 1), Yn(H("input", {
				"onUpdate:modelValue": n[0] ||= (e) => c.value = e,
				required: ""
			}, null, 512), [[cs, c.value]])]),
			H("label", null, [W(A(N(a)("storage.limit")), 1), Yn(H("input", {
				"onUpdate:modelValue": n[1] ||= (e) => l.value = e,
				required: "",
				type: "number",
				step: "any",
				min: "0.001",
				max: "100000"
			}, null, 512), [[cs, l.value]])]),
			H("div", dy, [H("button", {
				type: "submit",
				class: "ap-storage-button",
				"data-variant": "primary",
				disabled: !u.value
			}, A(N(a)("storage.save")), 9, fy), H("button", {
				type: "button",
				class: "ap-storage-button",
				disabled: e.storage.cache.status !== "online",
				onClick: f
			}, A(N(a)("storage.clear")), 9, py)])
		], 8, uy)], 32)]));
	}
}), hy = {
	role: "alert",
	class: "ap-storage-error"
}, gy = /* @__PURE__ */ I({
	__name: "StorageError",
	props: { code: {} },
	setup(e) {
		let { t } = Y();
		return (n, r) => (z(), B("p", hy, [W(A(N(t)("storage.errors." + e.code, N(t)("storage.error"))) + " ", 1), H("code", null, A(e.code), 1)]));
	}
});
// src/features/storage/useStorageAction.ts
function _y() {
	let e = new AbortController(), t = /* @__PURE__ */ j(!1), n = /* @__PURE__ */ j("");
	je(() => e.abort());
	async function r(r) {
		let { signal: i } = e;
		if (!(i.aborted || t.value)) {
			t.value = !0, n.value = "";
			try {
				await r(i);
			} catch (e) {
				i.aborted || (n.value = e instanceof X ? e.code : "network");
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
var vy = ["aria-label"], yy = { role: "status" }, by = ["data-state"], xy = [
	"aria-label",
	"value",
	"max"
], Sy = { key: 0 }, Cy = ["disabled"], wy = ["disabled"], Ty = /* @__PURE__ */ I({
	__name: "OperationProgress",
	props: {
		job: {},
		onTerminal: { type: Function }
	},
	setup(e) {
		let t = e, { t: n } = Y(), r = /* @__PURE__ */ M(), i = /* @__PURE__ */ j(""), a = /* @__PURE__ */ j(0), { pending: o, error: s, run: c } = _y(), l = [
			"completed",
			"failed",
			"cancelled"
		], u = [
			"registered",
			"copied",
			"skipped",
			"failed",
			"verification"
		];
		F([
			() => t.job.operation_id,
			() => t.job.kind,
			a
		], ([e, n], a, o) => {
			let s = new AbortController(), c;
			o(() => {
				s.abort(), clearTimeout(c);
			});
			async function u() {
				try {
					let a = await ay({
						operation_id: e,
						kind: n,
						phase: "queued"
					}, s.signal);
					if (s.signal.aborted) return;
					r.value = a, i.value = "", l.includes(a.phase) ? t.onTerminal() : a.error || (c = setTimeout(() => void u(), 800));
				} catch (e) {
					s.signal.aborted || (i.value = e instanceof X ? e.code : "network");
				}
			}
			u();
		}, { immediate: !0 });
		let d = K(() => r.value?.phase ?? "queued"), f = K(() => r.value?.receipt), p = K(() => d.value === "completed" && typeof f.value?.failed == "number" && f.value.failed > 0), m = K(() => i.value || s.value || r.value?.error?.code);
		function h(e) {
			c(async (n) => {
				await ty(`${ry(t.job)}/${e}`, {}, n), n.aborted || a.value++;
			});
		}
		return (t, s) => (z(), B("section", {
			class: "ap-operation",
			"aria-label": N(n)("storage.operation")
		}, [
			H("div", yy, [
				H("strong", {
					class: "ap-storage-badge",
					"data-state": d.value
				}, A(N(n)("storage.phases." + (p.value ? "partial" : d.value), d.value)), 9, by),
				H("p", null, [H("code", null, A(e.job.operation_id), 1)]),
				typeof f.value?.processed == "number" && typeof f.value.total == "number" ? (z(), B("progress", {
					key: 0,
					"aria-label": N(n)("storage.operation"),
					value: f.value.processed,
					max: Math.max(1, f.value.total)
				}, null, 8, xy)) : za("", !0),
				(z(), B(R, null, ti(u, (e) => (z(), B(R, { key: e }, [typeof f.value?.[e] == "number" || typeof f.value?.[e] == "string" ? (z(), B("p", Sy, A(N(n)("storage." + e)) + " " + A(f.value[e]), 1)) : za("", !0)], 64))), 64))
			]),
			m.value ? (z(), V(gy, {
				key: 0,
				code: m.value
			}, null, 8, ["code"])) : za("", !0),
			Array.isArray(f.value?.errors) ? (z(!0), B(R, { key: 1 }, ti(f.value.errors, (e) => (z(), B("div", { key: e.entry }, [W("#" + A(e.entry) + " ", 1), U(gy, { code: e.code }, null, 8, ["code"])]))), 128)) : za("", !0),
			l.includes(d.value) ? za("", !0) : (z(), B("button", {
				key: 2,
				type: "button",
				class: "ap-storage-button",
				disabled: N(o),
				onClick: s[0] ||= (e) => h("cancel")
			}, A(N(n)("storage.cancel")), 9, Cy)),
			i.value ? (z(), B("button", {
				key: 3,
				type: "button",
				class: "ap-storage-button",
				onClick: s[1] ||= (e) => a.value++
			}, A(N(n)("actions.refresh")), 1)) : za("", !0),
			r.value?.error && !l.includes(d.value) ? (z(), B("button", {
				key: 4,
				type: "button",
				class: "ap-storage-button",
				disabled: N(o),
				onClick: s[2] ||= (e) => h("retry")
			}, A(N(n)("storage.retry")), 9, wy)) : za("", !0)
		], 8, vy));
	}
}), Ey = { class: "ap-workspace-summary" }, Dy = { class: "ap-workspace-info" }, Oy = { class: "ap-storage-meta" }, ky = {
	key: 0,
	class: "ap-storage-badge"
}, Ay = { class: "ap-storage-path" }, jy = { class: "ap-storage-meta" }, My = ["data-state"], Ny = [
	"aria-expanded",
	"aria-controls",
	"aria-label",
	"title"
], Py = ["id", "hidden"], Fy = ["disabled"], Iy = ["disabled"], Ly = ["disabled"], Ry = ["disabled"], zy = ["disabled"], By = ["disabled"], Vy = ["disabled"], Hy = /* @__PURE__ */ I({
	__name: "WorkspaceActions",
	props: {
		workspace: {},
		busy: { type: Boolean },
		settingsRevision: {}
	},
	emits: ["change", "migration"],
	setup(e, { emit: n }) {
		let r = e, i = n, { t: a } = Y(), o = /* @__PURE__ */ j(!1), s = Tr(), c = Dr("workspace-more"), l;
		function u(e) {
			return `/storage/locations/${encodeURIComponent(e)}`;
		}
		function d(e) {
			o.value && (e.stopPropagation(), o.value = !1, c.value?.focus());
		}
		function f() {
			let { id: e, revision: t, enabled: n } = r.workspace;
			i("change", u(e), {
				expected_revision: t,
				enabled: !n
			}, "PATCH");
		}
		async function p(e) {
			let { id: n, name: o, revision: s } = r.workspace, c = (await t.extensionManager.dialog.prompt({
				title: a("storage." + e),
				message: a(e === "rename" ? "storage.name" : "storage.path"),
				defaultValue: e === "rename" ? o : void 0
			}))?.trim();
			if (!c) return;
			let d = u(n);
			switch (e) {
				case "rename":
					i("change", d, {
						expected_revision: s,
						name: c
					}, "PATCH");
					break;
				case "relocate":
					i("change", d + "/relocate", { new_path: c });
					break;
				case "migrate": l?.path !== c && (l = {
					path: c,
					key: crypto.randomUUID()
				}), i("migration", n, c, l.key);
			}
		}
		async function m() {
			let { id: e, name: n, revision: o } = r.workspace;
			await t.extensionManager.dialog.confirm({
				key: "astrophoto.remove-workspace",
				type: "delete",
				title: a("storage.remove"),
				message: a("storage.removeHelp"),
				itemList: [n]
			}) === !0 && i("change", u(e), { expected_revision: o }, "DELETE");
		}
		return (t, n) => (z(), B("li", {
			class: "ap-workspace-row",
			onKeydown: ps(d, ["esc"])
		}, [H("div", Ey, [H("div", Dy, [
			H("div", Oy, [H("strong", null, A(e.workspace.name), 1), e.workspace.is_default ? (z(), B("span", ky, A(N(a)("storage.default")), 1)) : za("", !0)]),
			H("p", Ay, A(e.workspace.root_path), 1),
			H("p", jy, [H("span", {
				class: "ap-storage-badge",
				"data-state": e.workspace.status
			}, A(N(a)("storage.states." + e.workspace.status)), 9, My), H("small", null, A(N(a)("storage.free")) + " " + A(N(oy)(e.workspace.free_bytes)), 1)])
		]), H("button", {
			ref: "workspace-more",
			type: "button",
			class: "ap-workspace-more",
			"aria-expanded": o.value,
			"aria-controls": N(s),
			"aria-label": N(a)("storage.workspaceActions", { name: e.workspace.name }),
			title: N(a)("storage.workspaceActions", { name: e.workspace.name }),
			onClick: n[0] ||= (e) => o.value = !o.value
		}, [...n[6] ||= [H("svg", {
			width: "16",
			height: "16",
			viewBox: "0 0 24 24",
			fill: "currentColor",
			"aria-hidden": "true"
		}, [
			H("circle", {
				cx: "5",
				cy: "12",
				r: "1.8"
			}),
			H("circle", {
				cx: "12",
				cy: "12",
				r: "1.8"
			}),
			H("circle", {
				cx: "19",
				cy: "12",
				r: "1.8"
			})
		], -1)]], 8, Ny)]), H("div", {
			id: N(s),
			class: "ap-storage-actions",
			hidden: !o.value
		}, [
			H("button", {
				type: "button",
				class: "ap-storage-button",
				disabled: e.busy || e.workspace.status === "migrating",
				onClick: n[1] ||= (t) => i("change", u(e.workspace.id) + "/validate", {})
			}, A(N(a)("storage.validate")), 9, Fy),
			H("button", {
				type: "button",
				class: "ap-storage-button",
				disabled: e.busy || e.workspace.is_default || e.workspace.status !== "online",
				onClick: n[2] ||= (t) => i("change", u(e.workspace.id), {
					expected_revision: e.settingsRevision,
					default: !0
				}, "PATCH")
			}, A(N(a)("storage.setDefault")), 9, Iy),
			H("button", {
				type: "button",
				class: "ap-storage-button",
				disabled: e.busy || e.workspace.enabled && e.workspace.is_default || e.workspace.status === "migrating",
				onClick: f
			}, A(N(a)(e.workspace.enabled ? "storage.disable" : "storage.enable")), 9, Ly),
			H("button", {
				type: "button",
				class: "ap-storage-button",
				disabled: e.busy || e.workspace.status === "migrating",
				onClick: n[3] ||= (e) => p("rename")
			}, A(N(a)("storage.rename")), 9, Ry),
			H("button", {
				type: "button",
				class: "ap-storage-button",
				disabled: e.busy || ![
					"offline",
					"identity_mismatch",
					"disabled"
				].includes(e.workspace.status),
				onClick: n[4] ||= (e) => p("relocate")
			}, A(N(a)("storage.relocate")), 9, zy),
			H("button", {
				type: "button",
				class: "ap-storage-button",
				disabled: e.busy || e.workspace.status !== "online",
				onClick: n[5] ||= (e) => p("migrate")
			}, A(N(a)("storage.migrate")), 9, By),
			H("button", {
				type: "button",
				class: "ap-storage-button",
				disabled: e.busy || e.workspace.is_default || e.workspace.status === "migrating",
				onClick: m
			}, A(N(a)("storage.remove")), 9, Vy)
		], 8, Py)], 32));
	}
}), Uy = {
	key: 1,
	role: "status"
}, Wy = {
	key: 2,
	class: "ap-storage"
}, Gy = { class: "ap-storage-group" }, Ky = { class: "ap-storage-path" }, qy = { class: "ap-storage-group" }, Jy = ["disabled"], Yy = ["checked", "onClick"], Xy = { class: "ap-storage-group" }, Zy = { class: "ap-storage-group-heading" }, Qy = [
	"aria-expanded",
	"aria-controls",
	"disabled"
], $y = { "aria-hidden": "true" }, eb = ["id", "hidden"], tb = ["disabled"], nb = { class: "ap-storage-actions" }, rb = {
	type: "submit",
	class: "ap-storage-button",
	"data-variant": "primary"
}, ib = { class: "ap-workspace-list" }, ab = {
	key: 0,
	role: "status",
	class: "ap-storage-result"
}, ob = {
	key: 3,
	role: "status",
	class: "ap-storage-result"
}, sb = /* @__PURE__ */ I({
	__name: "StoragePage",
	props: {
		resource: {},
		refresh: { type: Function }
	},
	setup(e) {
		let t = e, { t: n } = Y(), r = /* @__PURE__ */ j(""), i = /* @__PURE__ */ j(""), a = /* @__PURE__ */ j(!1), o = Tr(), s = /* @__PURE__ */ j(""), c = /* @__PURE__ */ j(""), { pending: l, error: u, run: d } = _y(), f = K(() => t.resource.state === "ready" ? t.resource.data : void 0), p = K(() => l.value || !f.value?.capabilities.write), m = /* @__PURE__ */ M(), h = K(() => m.value ?? f.value?.operations.find((e) => e.kind === "migration")), g = ["reference", "copy"];
		function _(e, r, i) {
			p.value || d(async (a) => {
				let o = await ty(e, r, a, i);
				if (!a.aborted) {
					if (e.endsWith("/validate")) {
						if (typeof o.status != "string" || typeof o.name != "string") throw new X("schema");
						c.value = o.name + " · " + n("storage.states." + o.status);
					}
					t.refresh();
				}
			});
		}
		function v(e) {
			let t = f.value;
			t && e !== t.imports.default_mode && _("/storage/settings", {
				expected_revision: t.imports.revision,
				imports: { default_mode: e }
			}, "PATCH");
		}
		function y() {
			!p.value && a.value && d(async (e) => {
				await ty("/storage/locations", {
					path: i.value.trim(),
					name: r.value.trim()
				}, e), e.aborted || (r.value = "", i.value = "", a.value = !1, t.refresh());
			});
		}
		function b(e, n, r) {
			p.value || d(async (i) => {
				let a = await ny("migration", {
					workspace_id: e,
					target_path: n,
					idempotency_key: r
				}, i);
				i.aborted || (m.value = a, t.refresh());
			});
		}
		function x() {
			let e = h.value?.phase;
			e && ![
				"completed",
				"failed",
				"cancelled"
			].includes(e) && t.refresh();
		}
		function S() {
			p.value || d(async (e) => {
				let r = await ty("/storage/cache/clear", { scope: "all" }, e);
				if (!e.aborted) {
					if (typeof r.removed_bytes != "number" || typeof r.removed != "number" || typeof r.skipped != "number" || typeof r.failed != "number") throw new X("schema");
					s.value = n("storage.clearResult", {
						size: oy(r.removed_bytes),
						count: r.removed,
						skipped: r.skipped,
						failed: r.failed
					}), t.refresh();
				}
			});
		}
		return (t, l) => e.resource.state === "error" ? (z(), B(R, { key: 0 }, [U(gy, { code: e.resource.error instanceof N(X) ? e.resource.error.code : "network" }, null, 8, ["code"]), H("button", {
			type: "button",
			class: "ap-storage-button",
			onClick: l[0] ||= (t) => e.refresh()
		}, A(N(n)("actions.refresh")), 1)], 64)) : f.value ? (z(), B("div", Wy, [
			H("section", Gy, [
				H("h3", null, A(N(n)("storage.dataRoot")), 1),
				H("p", Ky, A(f.value.data_root.path), 1),
				H("small", null, A(N(n)("storage.source." + f.value.data_root.source)) + " · " + A(N(n)("storage.db")) + " " + A(f.value.database.assets), 1)
			]),
			f.value.capabilities.write ? za("", !0) : (z(), V(gy, {
				key: 0,
				code: "UNAUTHORIZED_STORAGE_OPERATION"
			})),
			N(u) ? (z(), V(gy, {
				key: 1,
				code: N(u)
			}, null, 8, ["code"])) : za("", !0),
			N(u) === "REVISION_CONFLICT" ? (z(), B("button", {
				key: 2,
				type: "button",
				class: "ap-storage-button",
				onClick: l[1] ||= (t) => e.refresh()
			}, A(N(n)("actions.refresh")), 1)) : za("", !0),
			H("section", qy, [H("fieldset", {
				class: "ap-storage-radio-group",
				disabled: p.value
			}, [H("legend", null, A(N(n)("storage.importMode")), 1), (z(), B(R, null, ti(g, (e) => H("label", { key: e }, [H("input", {
				type: "radio",
				name: "astrophoto-import-mode",
				checked: f.value.imports.default_mode === e,
				onClick: ds((t) => v(e), ["prevent"])
			}, null, 8, Yy), H("span", null, [W(A(N(n)("storage." + e)), 1), H("small", null, A(N(n)("storage." + e + "Help")), 1)])])), 64))], 8, Jy)]),
			H("section", Xy, [
				H("div", Zy, [H("h3", null, A(N(n)("storage.workspaces")), 1), H("button", {
					type: "button",
					class: "ap-storage-button ap-workspace-add",
					"aria-expanded": a.value,
					"aria-controls": N(o),
					disabled: p.value,
					onClick: l[2] ||= (e) => a.value = !a.value
				}, [H("span", $y, A(a.value ? "−" : "+"), 1), W(" " + A(N(n)("storage.add")), 1)], 8, Qy)]),
				H("form", {
					id: N(o),
					hidden: !a.value,
					onSubmit: ds(y, ["prevent"])
				}, [H("fieldset", {
					class: "ap-storage-fields",
					disabled: p.value
				}, [
					H("label", null, [W(A(N(n)("storage.name")), 1), Yn(H("input", {
						"onUpdate:modelValue": l[3] ||= (e) => r.value = e,
						required: ""
					}, null, 512), [[cs, r.value]])]),
					H("label", null, [W(A(N(n)("storage.path")), 1), Yn(H("input", {
						"onUpdate:modelValue": l[4] ||= (e) => i.value = e,
						required: ""
					}, null, 512), [[cs, i.value]])]),
					H("div", nb, [H("button", rb, A(N(n)("storage.save")), 1)])
				], 8, tb)], 40, eb),
				H("ul", ib, [(z(!0), B(R, null, ti(f.value.workspaces, (e) => (z(), V(Hy, {
					key: e.id,
					workspace: e,
					busy: p.value,
					"settings-revision": f.value.imports.revision,
					onChange: _,
					onMigration: b
				}, null, 8, [
					"workspace",
					"busy",
					"settings-revision"
				]))), 128))]),
				c.value ? (z(), B("p", ab, A(c.value), 1)) : za("", !0),
				h.value ? (z(), V(Ty, {
					key: h.value.operation_id,
					job: h.value,
					"on-terminal": x
				}, null, 8, ["job"])) : za("", !0)
			]),
			U(my, {
				storage: f.value,
				disabled: p.value,
				onChange: _,
				onClear: S
			}, null, 8, ["storage", "disabled"]),
			s.value ? (z(), B("p", ob, A(s.value), 1)) : za("", !0)
		])) : (z(), B("p", Uy, A(N(n)("states.loading")), 1));
	}
}), cb = /* @__PURE__ */ I((e) => {
	let { t } = Y(), n = /* @__PURE__ */ j();
	return () => {
		let r = e.bundles.find((e) => e.id === n.value);
		return n.value ? U("div", { class: "ap-software" }, [U("button", {
			type: "button",
			class: "ap-settings-back",
			onClick: () => {
				n.value = void 0;
			}
		}, [t("actions.back")]), r ? uo(r.settings) : U("section", { class: "ap-software-section" }, [U("h3", null, [W("PixInsight")]), U("p", null, [t("software.plannedDetails")])])]) : U("div", { class: "ap-software-list" }, [e.bundles.map((e) => uo(e.summary, {
			key: e.id,
			onOpen: () => {
				n.value = e.id;
			}
		})), U("div", { class: "ap-software-item" }, [U("button", {
			type: "button",
			class: "ap-software-open",
			onClick: () => {
				n.value = "pixinsight";
			}
		}, [U("span", {
			class: "ap-software-item-icon",
			"aria-hidden": "true"
		}, [W("▣")]), U("span", { class: "ap-software-item-copy" }, [
			U("strong", null, [W("PixInsight")]),
			U("small", null, [t("software.pixinsightPurpose")]),
			U("small", { class: "ap-software-status" }, [U("span", {
				class: "ap-software-dot",
				"data-state": "planned"
			}, null), t("states.planned")])
		])]), U("label", { class: "ap-software-switch" }, [
			U("span", { class: "ap-software-switch-label" }, [t("software.enabled")]),
			U("input", {
				type: "checkbox",
				role: "switch",
				"aria-label": t("software.enableNamed", { name: "PixInsight" }),
				disabled: !0
			}, null),
			U("span", {
				class: "ap-software-switch-track",
				"aria-hidden": "true"
			}, [U("span", null, null)])
		])])]);
	};
}, { props: ["bundles"] }), lb = "/astrophoto/v1/previews/settings", ub = new EventTarget(), db;
function fb() {
	return db?.canvas.width ?? 480;
}
function pb(e) {
	return typeof e == "number" && Number.isSafeInteger(e) && e > 0;
}
function mb(e) {
	if (!Z(e) || typeof e.revision != "number" || !Number.isSafeInteger(e.revision) || e.revision < 0 || typeof e.longest_edge != "number" || !Number.isSafeInteger(e.longest_edge) || e.longest_edge < 0 || !Array.isArray(e.options) || !e.options.every((e) => e === 0 || pb(e)) || !e.options.includes(e.longest_edge) || !Z(e.canvas) || !pb(e.canvas.width) || !pb(e.canvas.max_height) || !pb(e.canvas_min) || !pb(e.canvas_max)) throw new X("schema");
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
	if (db && db.revision > t.revision) return db;
	let n = db && db.longest_edge !== t.longest_edge;
	return db = t, document.documentElement.style.setProperty("--astrophoto-canvas-preview-width", t.canvas.width + "px"), document.documentElement.style.setProperty("--astrophoto-canvas-preview-max-height", t.canvas.max_height + "px"), n && ub.dispatchEvent(new Event("change")), t;
}
async function hb(e) {
	return mb(await Tv(lb, e));
}
async function gb(e, t, n) {
	return mb(await Ev(lb, "PUT", {
		longest_edge: e,
		canvas: t,
		expected_revision: n
	}));
}
// node_modules/.pnpm/clsx@2.1.1/node_modules/clsx/dist/clsx.mjs
function _b(e) {
	var t, n, r = "";
	if (typeof e == "string" || typeof e == "number") r += e;
	else if (typeof e == "object") {
		if (Array.isArray(e)) {
			var i = e.length;
			for (t = 0; t < i; t++) e[t] && (n = _b(e[t])) && (r && (r += " "), r += n);
		} else for (n in e) e[n] && (r && (r += " "), r += n);
	}
	return r;
}
function vb() {
	for (var e, t, n = 0, r = "", i = arguments.length; n < i; n++) (e = arguments[n]) && (t = _b(e)) && (r && (r += " "), r += t);
	return r;
}
// node_modules/.pnpm/cva@1.0.0-beta.4_typescript@6.0.3/node_modules/cva/dist/index.mjs
var yb = (e) => typeof e == "boolean" ? `${e}` : e === 0 ? "0" : e, { compose: bb, cva: xb, cx: Sb } = ((e) => {
	let t = function() {
		var t = [...arguments];
		return e?.hooks?.["cx:done"] === void 0 ? e?.hooks?.onComplete === void 0 ? vb(t) : e?.hooks.onComplete(vb(t)) : e?.hooks["cx:done"](vb(t));
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
				let t = n?.[e], a = i?.[e], o = yb(t) || yb(a);
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
})(), Cb = xb({
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
}), wb = xb({
	base: "flex cursor-pointer items-center px-2 outline-none hover:bg-accent",
	variants: { layout: {
		multi: "h-10 shrink-0 gap-2 rounded-lg data-highlighted:bg-muted data-highlighted:hover:bg-muted",
		single: "relative w-full justify-between gap-3 rounded-sm py-3 text-sm select-none focus:bg-accent data-[state=checked]:bg-muted data-[state=checked]:hover:bg-muted"
	} },
	defaultVariants: { layout: "multi" }
}), Tb = "z-overlay overflow-hidden rounded-lg p-2 bg-background text-foreground border border-solid shadow-md data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2", Eb = "flex shrink-0 cursor-pointer items-center justify-center pl-3", Db = "px-3 pb-4 text-sm text-muted-foreground", Ob = "flex size-3.5 items-center justify-center rounded-full bg-foreground text-[9px] font-semibold text-background";
function kb(e) {
	e.key === "Escape" && (e.stopPropagation(), e.stopImmediatePropagation());
}
// src/vendor/comfyui/composables/useAttrsClass.ts
function Ab() {
	let e = li();
	return {
		attrsClass: K(() => e.class),
		attrsWithoutClass: K(() => {
			let { class: t, ...n } = e;
			return n;
		})
	};
}
// src/vendor/comfyui/composables/usePopoverSizing.ts
function jb(e) {
	return K(() => {
		let { minWidth: t, maxWidth: n } = e, r = {};
		return t && (r.minWidth = t), n && (r.maxWidth = n), r;
	});
}
// node_modules/.pnpm/tailwind-merge@2.6.1/node_modules/tailwind-merge/dist/bundle-mjs.mjs
var Mb = "-", Nb = (e) => {
	let t = Lb(e), { conflictingClassGroups: n, conflictingClassGroupModifiers: r } = e;
	return {
		getClassGroupId: (e) => {
			let n = e.split(Mb);
			return n[0] === "" && n.length !== 1 && n.shift(), Pb(n, t) || Ib(e);
		},
		getConflictingClassGroupIds: (e, t) => {
			let i = n[e] || [];
			return t && r[e] ? [...i, ...r[e]] : i;
		}
	};
}, Pb = (e, t) => {
	if (e.length === 0) return t.classGroupId;
	let n = e[0], r = t.nextPart.get(n), i = r ? Pb(e.slice(1), r) : void 0;
	if (i) return i;
	if (t.validators.length === 0) return;
	let a = e.join(Mb);
	return t.validators.find(({ validator: e }) => e(a))?.classGroupId;
}, Fb = /^\[(.+)\]$/, Ib = (e) => {
	if (Fb.test(e)) {
		let t = Fb.exec(e)[1], n = t?.substring(0, t.indexOf(":"));
		if (n) return "arbitrary.." + n;
	}
}, Lb = (e) => {
	let { theme: t, prefix: n } = e, r = {
		nextPart: /* @__PURE__ */ new Map(),
		validators: []
	};
	return Vb(Object.entries(e.classGroups), n).forEach(([e, n]) => {
		Rb(n, r, e, t);
	}), r;
}, Rb = (e, t, n, r) => {
	e.forEach((e) => {
		if (typeof e == "string") {
			let r = e === "" ? t : zb(t, e);
			r.classGroupId = n;
		} else if (typeof e == "function") {
			if (Bb(e)) {
				Rb(e(r), t, n, r);
				return;
			}
			t.validators.push({
				validator: e,
				classGroupId: n
			});
		} else Object.entries(e).forEach(([e, i]) => {
			Rb(i, zb(t, e), n, r);
		});
	});
}, zb = (e, t) => {
	let n = e;
	return t.split(Mb).forEach((e) => {
		n.nextPart.has(e) || n.nextPart.set(e, {
			nextPart: /* @__PURE__ */ new Map(),
			validators: []
		}), n = n.nextPart.get(e);
	}), n;
}, Bb = (e) => e.isThemeGetter, Vb = (e, t) => t ? e.map(([e, n]) => [e, n.map((e) => typeof e == "string" ? t + e : typeof e == "object" ? Object.fromEntries(Object.entries(e).map(([e, n]) => [t + e, n])) : e)]) : e, Hb = (e) => {
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
}, Ub = "!", Wb = (e) => {
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
		let l = n.length === 0 ? e : e.substring(s), u = l.startsWith(Ub);
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
}, Gb = (e) => {
	if (e.length <= 1) return e;
	let t = [], n = [];
	return e.forEach((e) => {
		e[0] === "[" ? (t.push(...n.sort(), e), n = []) : n.push(e);
	}), t.push(...n.sort()), t;
}, Kb = (e) => ({
	cache: Hb(e.cacheSize),
	parseClassName: Wb(e),
	...Nb(e)
}), qb = /\s+/, Jb = (e, t) => {
	let { parseClassName: n, getClassGroupId: r, getConflictingClassGroupIds: i } = t, a = [], o = e.trim().split(qb), s = "";
	for (let e = o.length - 1; e >= 0; --e) {
		let t = o[e], { modifiers: c, hasImportantModifier: l, baseClassName: u, maybePostfixModifierPosition: d } = n(t), f = !!d, p = r(f ? u.substring(0, d) : u);
		if (!p) {
			if (!f || (p = r(u), !p)) {
				s = t + (s.length > 0 ? " " + s : s);
				continue;
			}
			f = !1;
		}
		let m = Gb(c).join(":"), h = l ? m + Ub : m, g = h + p;
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
function Yb() {
	let e = 0, t, n, r = "";
	for (; e < arguments.length;) (t = arguments[e++]) && (n = Xb(t)) && (r && (r += " "), r += n);
	return r;
}
var Xb = (e) => {
	if (typeof e == "string") return e;
	let t, n = "";
	for (let r = 0; r < e.length; r++) e[r] && (t = Xb(e[r])) && (n && (n += " "), n += t);
	return n;
};
function Zb(e, ...t) {
	let n, r, i, a = o;
	function o(o) {
		return n = Kb(t.reduce((e, t) => t(e), e())), r = n.cache.get, i = n.cache.set, a = s, s(o);
	}
	function s(e) {
		let t = r(e);
		if (t) return t;
		let a = Jb(e, n);
		return i(e, a), a;
	}
	return function() {
		return a(Yb.apply(null, arguments));
	};
}
var Qb = (e) => {
	let t = (t) => t[e] || [];
	return t.isThemeGetter = !0, t;
}, $b = /^\[(?:([a-z-]+):)?(.+)\]$/i, ex = /^\d+\/\d+$/, tx = /*#__PURE__*/ new Set([
	"px",
	"full",
	"screen"
]), nx = /^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/, rx = /\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/, ix = /^(rgba?|hsla?|hwb|(ok)?(lab|lch)|color-mix)\(.+\)$/, ax = /^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/, ox = /^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/, sx = (e) => lx(e) || tx.has(e) || ex.test(e), cx = (e) => xx(e, "length", Sx), lx = (e) => !!e && !Number.isNaN(Number(e)), ux = (e) => xx(e, "number", lx), dx = (e) => !!e && Number.isInteger(Number(e)), fx = (e) => e.endsWith("%") && lx(e.slice(0, -1)), Q = (e) => $b.test(e), px = (e) => nx.test(e), mx = /*#__PURE__*/ new Set([
	"length",
	"size",
	"percentage"
]), hx = (e) => xx(e, mx, Cx), gx = (e) => xx(e, "position", Cx), _x = /*#__PURE__*/ new Set(["image", "url"]), vx = (e) => xx(e, _x, Tx), yx = (e) => xx(e, "", wx), bx = () => !0, xx = (e, t, n) => {
	let r = $b.exec(e);
	return r ? r[1] ? typeof t == "string" ? r[1] === t : t.has(r[1]) : n(r[2]) : !1;
}, Sx = (e) => rx.test(e) && !ix.test(e), Cx = () => !1, wx = (e) => ax.test(e), Tx = (e) => ox.test(e), Ex = () => {
	let e = Qb("colors"), t = Qb("spacing"), n = Qb("blur"), r = Qb("brightness"), i = Qb("borderColor"), a = Qb("borderRadius"), o = Qb("borderSpacing"), s = Qb("borderWidth"), c = Qb("contrast"), l = Qb("grayscale"), u = Qb("hueRotate"), d = Qb("invert"), f = Qb("gap"), p = Qb("gradientColorStops"), m = Qb("gradientColorStopPositions"), h = Qb("inset"), g = Qb("margin"), _ = Qb("opacity"), v = Qb("padding"), y = Qb("saturate"), b = Qb("scale"), x = Qb("sepia"), S = Qb("skew"), C = Qb("space"), w = Qb("translate"), T = () => [
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
		Q,
		t
	], O = () => [Q, t], ee = () => [
		"",
		sx,
		cx
	], te = () => [
		"auto",
		lx,
		Q
	], k = () => [
		"bottom",
		"center",
		"left",
		"left-bottom",
		"left-top",
		"right",
		"right-bottom",
		"right-top",
		"top"
	], ne = () => [
		"solid",
		"dashed",
		"dotted",
		"double",
		"none"
	], re = () => [
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
	], ie = () => [
		"start",
		"end",
		"center",
		"between",
		"around",
		"evenly",
		"stretch"
	], ae = () => [
		"",
		"0",
		Q
	], oe = () => [
		"auto",
		"avoid",
		"all",
		"avoid-page",
		"page",
		"left",
		"right",
		"column"
	], se = () => [lx, Q];
	return {
		cacheSize: 500,
		separator: ":",
		theme: {
			colors: [bx],
			spacing: [sx, cx],
			blur: [
				"none",
				"",
				px,
				Q
			],
			brightness: se(),
			borderColor: [e],
			borderRadius: [
				"none",
				"",
				"full",
				px,
				Q
			],
			borderSpacing: O(),
			borderWidth: ee(),
			contrast: se(),
			grayscale: ae(),
			hueRotate: se(),
			invert: ae(),
			gap: O(),
			gradientColorStops: [e],
			gradientColorStopPositions: [fx, cx],
			inset: D(),
			margin: D(),
			opacity: se(),
			padding: O(),
			saturate: se(),
			scale: se(),
			sepia: ae(),
			skew: se(),
			space: O(),
			translate: O()
		},
		classGroups: {
			aspect: [{ aspect: [
				"auto",
				"square",
				"video",
				Q
			] }],
			container: ["container"],
			columns: [{ columns: [px] }],
			"break-after": [{ "break-after": oe() }],
			"break-before": [{ "break-before": oe() }],
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
			"object-position": [{ object: [...k(), Q] }],
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
				dx,
				Q
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
				Q
			] }],
			grow: [{ grow: ae() }],
			shrink: [{ shrink: ae() }],
			order: [{ order: [
				"first",
				"last",
				"none",
				dx,
				Q
			] }],
			"grid-cols": [{ "grid-cols": [bx] }],
			"col-start-end": [{ col: [
				"auto",
				{ span: [
					"full",
					dx,
					Q
				] },
				Q
			] }],
			"col-start": [{ "col-start": te() }],
			"col-end": [{ "col-end": te() }],
			"grid-rows": [{ "grid-rows": [bx] }],
			"row-start-end": [{ row: [
				"auto",
				{ span: [dx, Q] },
				Q
			] }],
			"row-start": [{ "row-start": te() }],
			"row-end": [{ "row-end": te() }],
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
				Q
			] }],
			"auto-rows": [{ "auto-rows": [
				"auto",
				"min",
				"max",
				"fr",
				Q
			] }],
			gap: [{ gap: [f] }],
			"gap-x": [{ "gap-x": [f] }],
			"gap-y": [{ "gap-y": [f] }],
			"justify-content": [{ justify: ["normal", ...ie()] }],
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
				...ie(),
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
			"place-content": [{ "place-content": [...ie(), "baseline"] }],
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
				Q,
				t
			] }],
			"min-w": [{ "min-w": [
				Q,
				t,
				"min",
				"max",
				"fit"
			] }],
			"max-w": [{ "max-w": [
				Q,
				t,
				"none",
				"full",
				"min",
				"max",
				"fit",
				"prose",
				{ screen: [px] },
				px
			] }],
			h: [{ h: [
				Q,
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
				Q,
				t,
				"min",
				"max",
				"fit",
				"svh",
				"lvh",
				"dvh"
			] }],
			"max-h": [{ "max-h": [
				Q,
				t,
				"min",
				"max",
				"fit",
				"svh",
				"lvh",
				"dvh"
			] }],
			size: [{ size: [
				Q,
				t,
				"auto",
				"min",
				"max",
				"fit"
			] }],
			"font-size": [{ text: [
				"base",
				px,
				cx
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
				ux
			] }],
			"font-family": [{ font: [bx] }],
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
				Q
			] }],
			"line-clamp": [{ "line-clamp": [
				"none",
				lx,
				ux
			] }],
			leading: [{ leading: [
				"none",
				"tight",
				"snug",
				"normal",
				"relaxed",
				"loose",
				sx,
				Q
			] }],
			"list-image": [{ "list-image": ["none", Q] }],
			"list-style-type": [{ list: [
				"none",
				"disc",
				"decimal",
				Q
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
			"text-decoration-style": [{ decoration: [...ne(), "wavy"] }],
			"text-decoration-thickness": [{ decoration: [
				"auto",
				"from-font",
				sx,
				cx
			] }],
			"underline-offset": [{ "underline-offset": [
				"auto",
				sx,
				Q
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
				Q
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
			content: [{ content: ["none", Q] }],
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
			"bg-position": [{ bg: [...k(), gx] }],
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
				hx
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
				vx
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
			"border-style": [{ border: [...ne(), "hidden"] }],
			"divide-x": [{ "divide-x": [s] }],
			"divide-x-reverse": ["divide-x-reverse"],
			"divide-y": [{ "divide-y": [s] }],
			"divide-y-reverse": ["divide-y-reverse"],
			"divide-opacity": [{ "divide-opacity": [_] }],
			"divide-style": [{ divide: ne() }],
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
			"outline-style": [{ outline: ["", ...ne()] }],
			"outline-offset": [{ "outline-offset": [sx, Q] }],
			"outline-w": [{ outline: [sx, cx] }],
			"outline-color": [{ outline: [e] }],
			"ring-w": [{ ring: ee() }],
			"ring-w-inset": ["ring-inset"],
			"ring-color": [{ ring: [e] }],
			"ring-opacity": [{ "ring-opacity": [_] }],
			"ring-offset-w": [{ "ring-offset": [sx, cx] }],
			"ring-offset-color": [{ "ring-offset": [e] }],
			shadow: [{ shadow: [
				"",
				"inner",
				"none",
				px,
				yx
			] }],
			"shadow-color": [{ shadow: [bx] }],
			opacity: [{ opacity: [_] }],
			"mix-blend": [{ "mix-blend": [
				...re(),
				"plus-lighter",
				"plus-darker"
			] }],
			"bg-blend": [{ "bg-blend": re() }],
			filter: [{ filter: ["", "none"] }],
			blur: [{ blur: [n] }],
			brightness: [{ brightness: [r] }],
			contrast: [{ contrast: [c] }],
			"drop-shadow": [{ "drop-shadow": [
				"",
				"none",
				px,
				Q
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
				Q
			] }],
			duration: [{ duration: se() }],
			ease: [{ ease: [
				"linear",
				"in",
				"out",
				"in-out",
				Q
			] }],
			delay: [{ delay: se() }],
			animate: [{ animate: [
				"none",
				"spin",
				"ping",
				"pulse",
				"bounce",
				Q
			] }],
			transform: [{ transform: [
				"",
				"gpu",
				"none"
			] }],
			scale: [{ scale: [b] }],
			"scale-x": [{ "scale-x": [b] }],
			"scale-y": [{ "scale-y": [b] }],
			rotate: [{ rotate: [dx, Q] }],
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
				Q
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
				Q
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
				Q
			] }],
			fill: [{ fill: [e, "none"] }],
			"stroke-w": [{ stroke: [
				sx,
				cx,
				ux
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
}, Dx = (e, { cacheSize: t, prefix: n, separator: r, experimentalParseClassName: i, extend: a = {}, override: o = {} }) => {
	Ox(e, "cacheSize", t), Ox(e, "prefix", n), Ox(e, "separator", r), Ox(e, "experimentalParseClassName", i);
	for (let t in o) kx(e[t], o[t]);
	for (let t in a) Ax(e[t], a[t]);
	return e;
}, Ox = (e, t, n) => {
	n !== void 0 && (e[t] = n);
}, kx = (e, t) => {
	if (t) for (let n in t) Ox(e, n, t[n]);
}, Ax = (e, t) => {
	if (t) for (let n in t) {
		let r = t[n];
		r !== void 0 && (e[n] = (e[n] || []).concat(r));
	}
}, jx = ((e, ...t) => typeof e == "function" ? Zb(Ex, e, ...t) : Zb(() => Dx(Ex(), e), ...t))({ extend: { classGroups: {
	"font-size": ["text-xxs", "text-xxxs"],
	"max-h": [{ "max-h": ["none"] }]
} } });
function Mx(...e) {
	return jx(vb(e));
}
// node_modules/.pnpm/fuse.js@7.0.0/node_modules/fuse.js/dist/fuse.mjs
function Nx(e) {
	return Array.isArray ? Array.isArray(e) : Ux(e) === "[object Array]";
}
function Px(e) {
	if (typeof e == "string") return e;
	let t = e + "";
	return t == "0" && 1 / e == -Infinity ? "-0" : t;
}
function Fx(e) {
	return e == null ? "" : Px(e);
}
function Ix(e) {
	return typeof e == "string";
}
function Lx(e) {
	return typeof e == "number";
}
function Rx(e) {
	return e === !0 || e === !1 || Bx(e) && Ux(e) == "[object Boolean]";
}
function zx(e) {
	return typeof e == "object";
}
function Bx(e) {
	return zx(e) && e !== null;
}
function Vx(e) {
	return e != null;
}
function Hx(e) {
	return !e.trim().length;
}
function Ux(e) {
	return e == null ? e === void 0 ? "[object Undefined]" : "[object Null]" : Object.prototype.toString.call(e);
}
var Wx = "Incorrect 'index' type", Gx = (e) => `Invalid value for key ${e}`, Kx = (e) => `Pattern length exceeds max of ${e}.`, qx = (e) => `Missing ${e} property in key`, Jx = (e) => `Property 'weight' in key '${e}' must be a positive integer`, Yx = Object.prototype.hasOwnProperty, Xx = class {
	constructor(e) {
		this._keys = [], this._keyMap = {};
		let t = 0;
		e.forEach((e) => {
			let n = Zx(e);
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
function Zx(e) {
	let t = null, n = null, r = null, i = 1, a = null;
	if (Ix(e) || Nx(e)) r = e, t = Qx(e), n = $x(e);
	else {
		if (!Yx.call(e, "name")) throw Error(qx("name"));
		let o = e.name;
		if (r = o, Yx.call(e, "weight") && (i = e.weight, i <= 0)) throw Error(Jx(o));
		t = Qx(o), n = $x(o), a = e.getFn;
	}
	return {
		path: t,
		id: n,
		weight: i,
		src: r,
		getFn: a
	};
}
function Qx(e) {
	return Nx(e) ? e : e.split(".");
}
function $x(e) {
	return Nx(e) ? e.join(".") : e;
}
function eS(e, t) {
	let n = [], r = !1, i = (e, t, a) => {
		if (Vx(e)) {
			if (!t[a]) n.push(e);
			else {
				let o = e[t[a]];
				if (!Vx(o)) return;
				if (a === t.length - 1 && (Ix(o) || Lx(o) || Rx(o))) n.push(Fx(o));
				else if (Nx(o)) {
					r = !0;
					for (let e = 0, n = o.length; e < n; e += 1) i(o[e], t, a + 1);
				} else t.length && i(o, t, a + 1);
			}
		}
	};
	return i(e, Ix(t) ? t.split(".") : t, 0), r ? n : n[0];
}
var tS = {
	includeMatches: !1,
	findAllMatches: !1,
	minMatchCharLength: 1
}, nS = {
	isCaseSensitive: !1,
	includeScore: !1,
	keys: [],
	shouldSort: !0,
	sortFn: (e, t) => e.score === t.score ? e.idx < t.idx ? -1 : 1 : e.score < t.score ? -1 : 1
}, rS = {
	location: 0,
	threshold: .6,
	distance: 100
}, iS = {
	useExtendedSearch: !1,
	getFn: eS,
	ignoreLocation: !1,
	ignoreFieldNorm: !1,
	fieldNormWeight: 1
}, $ = {
	...nS,
	...tS,
	...rS,
	...iS
}, aS = /[^ ]+/g;
function oS(e = 1, t = 3) {
	let n = /* @__PURE__ */ new Map(), r = 10 ** t;
	return {
		get(t) {
			let i = t.match(aS).length;
			if (n.has(i)) return n.get(i);
			let a = 1 / i ** (.5 * e), o = parseFloat(Math.round(a * r) / r);
			return n.set(i, o), o;
		},
		clear() {
			n.clear();
		}
	};
}
var sS = class {
	constructor({ getFn: e = $.getFn, fieldNormWeight: t = $.fieldNormWeight } = {}) {
		this.norm = oS(t, 3), this.getFn = e, this.isCreated = !1, this.setIndexRecords();
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
		!this.isCreated && this.docs.length && (this.isCreated = !0, Ix(this.docs[0]) ? this.docs.forEach((e, t) => {
			this._addString(e, t);
		}) : this.docs.forEach((e, t) => {
			this._addObject(e, t);
		}), this.norm.clear());
	}
	add(e) {
		let t = this.size();
		Ix(e) ? this._addString(e, t) : this._addObject(e, t);
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
		if (!Vx(e) || Hx(e)) return;
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
			if (Vx(i)) {
				if (Nx(i)) {
					let e = [], t = [{
						nestedArrIndex: -1,
						value: i
					}];
					for (; t.length;) {
						let { nestedArrIndex: n, value: r } = t.pop();
						if (Vx(r)) {
							if (Ix(r) && !Hx(r)) {
								let t = {
									v: r,
									i: n,
									n: this.norm.get(r)
								};
								e.push(t);
							} else Nx(r) && r.forEach((e, n) => {
								t.push({
									nestedArrIndex: n,
									value: e
								});
							});
						}
					}
					n.$[r] = e;
				} else if (Ix(i) && !Hx(i)) {
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
function cS(e, t, { getFn: n = $.getFn, fieldNormWeight: r = $.fieldNormWeight } = {}) {
	let i = new sS({
		getFn: n,
		fieldNormWeight: r
	});
	return i.setKeys(e.map(Zx)), i.setSources(t), i.create(), i;
}
function lS(e, { getFn: t = $.getFn, fieldNormWeight: n = $.fieldNormWeight } = {}) {
	let { keys: r, records: i } = e, a = new sS({
		getFn: t,
		fieldNormWeight: n
	});
	return a.setKeys(r), a.setIndexRecords(i), a;
}
function uS(e, { errors: t = 0, currentLocation: n = 0, expectedLocation: r = 0, distance: i = $.distance, ignoreLocation: a = $.ignoreLocation } = {}) {
	let o = t / e.length;
	if (a) return o;
	let s = Math.abs(r - n);
	return i ? o + s / i : s ? 1 : o;
}
function dS(e = [], t = $.minMatchCharLength) {
	let n = [], r = -1, i = -1, a = 0;
	for (let o = e.length; a < o; a += 1) {
		let o = e[a];
		o && r === -1 ? r = a : !o && r !== -1 && (i = a - 1, i - r + 1 >= t && n.push([r, i]), r = -1);
	}
	return e[a - 1] && a - r >= t && n.push([r, a - 1]), n;
}
var fS = 32;
function pS(e, t, n, { location: r = $.location, distance: i = $.distance, threshold: a = $.threshold, findAllMatches: o = $.findAllMatches, minMatchCharLength: s = $.minMatchCharLength, includeMatches: c = $.includeMatches, ignoreLocation: l = $.ignoreLocation } = {}) {
	if (t.length > fS) throw Error(Kx(fS));
	let u = t.length, d = e.length, f = Math.max(0, Math.min(r, d)), p = a, m = f, h = s > 1 || c, g = h ? Array(d) : [], _;
	for (; (_ = e.indexOf(t, m)) > -1;) {
		let e = uS(t, {
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
		for (; a < s;) uS(t, {
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
			if (h && (g[o] = +!!s), S[a] = (S[a + 1] << 1 | 1) & s, r && (S[a] |= (v[a + 1] | v[a]) << 1 | 1 | v[a + 1]), S[a] & x && (y = uS(t, {
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
		if (uS(t, {
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
		let e = dS(g, s);
		e.length ? c && (S.indices = e) : S.isMatch = !1;
	}
	return S;
}
function mS(e) {
	let t = {};
	for (let n = 0, r = e.length; n < r; n += 1) {
		let i = e.charAt(n);
		t[i] = (t[i] || 0) | 1 << r - n - 1;
	}
	return t;
}
var hS = class {
	constructor(e, { location: t = $.location, threshold: n = $.threshold, distance: r = $.distance, includeMatches: i = $.includeMatches, findAllMatches: a = $.findAllMatches, minMatchCharLength: o = $.minMatchCharLength, isCaseSensitive: s = $.isCaseSensitive, ignoreLocation: c = $.ignoreLocation } = {}) {
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
				alphabet: mS(e),
				startIndex: t
			});
		}, u = this.pattern.length;
		if (u > fS) {
			let e = 0, t = u % fS, n = u - t;
			for (; e < n;) l(this.pattern.substr(e, fS), e), e += fS;
			if (t) {
				let e = u - fS;
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
			let { isMatch: m, score: h, indices: g } = pS(e, t, f, {
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
}, gS = class {
	constructor(e) {
		this.pattern = e;
	}
	static isMultiMatch(e) {
		return _S(e, this.multiRegex);
	}
	static isSingleMatch(e) {
		return _S(e, this.singleRegex);
	}
	search() {}
};
function _S(e, t) {
	let n = e.match(t);
	return n ? n[1] : null;
}
var vS = class extends gS {
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
}, yS = class extends gS {
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
}, bS = class extends gS {
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
}, xS = class extends gS {
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
}, SS = class extends gS {
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
}, CS = class extends gS {
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
}, wS = class extends gS {
	constructor(e, { location: t = $.location, threshold: n = $.threshold, distance: r = $.distance, includeMatches: i = $.includeMatches, findAllMatches: a = $.findAllMatches, minMatchCharLength: o = $.minMatchCharLength, isCaseSensitive: s = $.isCaseSensitive, ignoreLocation: c = $.ignoreLocation } = {}) {
		super(e), this._bitapSearch = new hS(e, {
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
}, TS = class extends gS {
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
}, ES = [
	vS,
	TS,
	bS,
	xS,
	CS,
	SS,
	yS,
	wS
], DS = ES.length, OS = / +(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)/, kS = "|";
function AS(e, t = {}) {
	return e.split(kS).map((e) => {
		let n = e.trim().split(OS).filter((e) => e && !!e.trim()), r = [];
		for (let e = 0, i = n.length; e < i; e += 1) {
			let i = n[e], a = !1, o = -1;
			for (; !a && ++o < DS;) {
				let e = ES[o], n = e.isMultiMatch(i);
				n && (r.push(new e(n, t)), a = !0);
			}
			if (!a) for (o = -1; ++o < DS;) {
				let e = ES[o], n = e.isSingleMatch(i);
				if (n) {
					r.push(new e(n, t));
					break;
				}
			}
		}
		return r;
	});
}
var jS = /* @__PURE__ */ new Set([wS.type, TS.type]), MS = class {
	constructor(e, { isCaseSensitive: t = $.isCaseSensitive, includeMatches: n = $.includeMatches, minMatchCharLength: r = $.minMatchCharLength, ignoreLocation: i = $.ignoreLocation, findAllMatches: a = $.findAllMatches, location: o = $.location, threshold: s = $.threshold, distance: c = $.distance } = {}) {
		this.query = null, this.options = {
			isCaseSensitive: t,
			includeMatches: n,
			minMatchCharLength: r,
			findAllMatches: a,
			ignoreLocation: i,
			location: o,
			threshold: s,
			distance: c
		}, this.pattern = t ? e : e.toLowerCase(), this.query = AS(this.pattern, this.options);
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
						jS.has(e) ? a = [...a, ...l] : a.push(l);
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
}, NS = [];
function PS(...e) {
	NS.push(...e);
}
function FS(e, t) {
	for (let n = 0, r = NS.length; n < r; n += 1) {
		let r = NS[n];
		if (r.condition(e, t)) return new r(e, t);
	}
	return new hS(e, t);
}
var IS = {
	AND: "$and",
	OR: "$or"
}, LS = {
	PATH: "$path",
	PATTERN: "$val"
}, RS = (e) => !!(e[IS.AND] || e[IS.OR]), zS = (e) => !!e[LS.PATH], BS = (e) => !Nx(e) && zx(e) && !RS(e), VS = (e) => ({ [IS.AND]: Object.keys(e).map((t) => ({ [t]: e[t] })) });
function HS(e, t, { auto: n = !0 } = {}) {
	let r = (e) => {
		let i = Object.keys(e), a = zS(e);
		if (!a && i.length > 1 && !RS(e)) return r(VS(e));
		if (BS(e)) {
			let r = a ? e[LS.PATH] : i[0], o = a ? e[LS.PATTERN] : e[r];
			if (!Ix(o)) throw Error(Gx(r));
			let s = {
				keyId: $x(r),
				pattern: o
			};
			return n && (s.searcher = FS(o, t)), s;
		}
		let o = {
			children: [],
			operator: i[0]
		};
		return i.forEach((t) => {
			let n = e[t];
			Nx(n) && n.forEach((e) => {
				o.children.push(r(e));
			});
		}), o;
	};
	return RS(e) || (e = VS(e)), r(e);
}
function US(e, { ignoreFieldNorm: t = $.ignoreFieldNorm }) {
	e.forEach((e) => {
		let n = 1;
		e.matches.forEach(({ key: e, norm: r, score: i }) => {
			let a = e ? e.weight : null;
			n *= (i === 0 && a ? 2 ** -52 : i) ** +((a || 1) * (t ? 1 : r));
		}), e.score = n;
	});
}
function WS(e, t) {
	let n = e.matches;
	t.matches = [], Vx(n) && n.forEach((e) => {
		if (!Vx(e.indices) || !e.indices.length) return;
		let { indices: n, value: r } = e, i = {
			indices: n,
			value: r
		};
		e.key && (i.key = e.key.src), e.idx > -1 && (i.refIndex = e.idx), t.matches.push(i);
	});
}
function GS(e, t) {
	t.score = e.score;
}
function KS(e, t, { includeMatches: n = $.includeMatches, includeScore: r = $.includeScore } = {}) {
	let i = [];
	return n && i.push(WS), r && i.push(GS), e.map((e) => {
		let { idx: n } = e, r = {
			item: t[n],
			refIndex: n
		};
		return i.length && i.forEach((t) => {
			t(e, r);
		}), r;
	});
}
var qS = class {
	constructor(e, t = {}, n) {
		this.options = {
			...$,
			...t
		}, this.options.useExtendedSearch, this._keyStore = new Xx(this.options.keys), this.setCollection(e, n);
	}
	setCollection(e, t) {
		if (this._docs = e, t && !(t instanceof sS)) throw Error(Wx);
		this._myIndex = t || cS(this.options.keys, this._docs, {
			getFn: this.options.getFn,
			fieldNormWeight: this.options.fieldNormWeight
		});
	}
	add(e) {
		Vx(e) && (this._docs.push(e), this._myIndex.add(e));
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
		let { includeMatches: n, includeScore: r, shouldSort: i, sortFn: a, ignoreFieldNorm: o } = this.options, s = Ix(e) ? Ix(this._docs[0]) ? this._searchStringList(e) : this._searchObjectList(e) : this._searchLogical(e);
		return US(s, { ignoreFieldNorm: o }), i && s.sort(a), Lx(t) && t > -1 && (s = s.slice(0, t)), KS(s, this._docs, {
			includeMatches: n,
			includeScore: r
		});
	}
	_searchStringList(e) {
		let t = FS(e, this.options), { records: n } = this._myIndex, r = [];
		return n.forEach(({ v: e, i: n, n: i }) => {
			if (!Vx(e)) return;
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
		let t = HS(e, this.options), n = (e, t, r) => {
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
				else if (e.operator === IS.AND) return [];
			}
			return i;
		}, r = this._myIndex.records, i = {}, a = [];
		return r.forEach(({ $: e, i: r }) => {
			if (Vx(e)) {
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
		let t = FS(e, this.options), { keys: n, records: r } = this._myIndex, i = [];
		return r.forEach(({ $: e, i: r }) => {
			if (!Vx(e)) return;
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
		if (!Vx(t)) return [];
		let r = [];
		if (Nx(t)) t.forEach(({ v: t, i, n: a }) => {
			if (!Vx(t)) return;
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
qS.version = "7.0.0", qS.createIndex = cS, qS.parseIndex = lS, qS.config = $, qS.parseQuery = HS, PS(MS);
// node_modules/.pnpm/@vueuse+integrations@14.4.0_e296e648d81c519b0c065d5abb502518/node_modules/@vueuse/integrations/dist/useFuse.js
function JS(e, t, n) {
	let r = () => new qS(cn(t) ?? [], cn(n)?.fuseOptions), i = /* @__PURE__ */ M(r());
	return F(() => cn(n)?.fuseOptions, () => {
		i.value = r();
	}, { deep: !0 }), F(() => cn(t), (e) => {
		i.value.setCollection(e), sn(i);
	}, { deep: !0 }), {
		fuse: i,
		results: K(() => {
			let r = cn(n);
			if (r?.matchAllWhenSearchEmpty && !cn(e)) return cn(t).map((e, t) => ({
				item: e,
				refIndex: t
			}));
			let a = r?.resultLimit;
			return i.value.search(cn(e), a ? { limit: a } : void 0);
		})
	};
}
// src/vendor/comfyui/select/useSelectSearch.ts
function YS(e, t) {
	let { results: n } = JS(e, t, {
		fuseOptions: {
			keys: ["name", "value"],
			threshold: .3
		},
		matchAllWhenSearchEmpty: !0
	});
	return K(() => e.value.trim() ? n.value.map(({ item: e }) => e) : cn(t));
}
// src/vendor/comfyui/single-select/SearchableSingleSelect.vue?vue&type=script&setup=true&lang.ts
var XS = {
	key: 0,
	class: "icon-[lucide--loader-circle] shrink-0 animate-spin text-muted-foreground"
}, ZS = { class: "truncate" }, QS = { class: "px-2 pt-2" }, $S = { class: "flex items-center gap-2 rounded-lg border px-3 py-1.5" }, eC = { class: "truncate" }, tC = /* @__PURE__ */ I({
	inheritAttrs: !1,
	__name: "SearchableSingleSelect",
	props: /*@__PURE__*/ pi({
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
		let { attrsClass: t, attrsWithoutClass: n } = Ab(), r = Ni(e, "modelValue"), i = Dr("trigger"), a = /* @__PURE__ */ j(!1), o = /* @__PURE__ */ j(""), s = YS(o, () => e.options), c = K({
			get: () => e.options.find(({ value: e }) => e === r.value),
			set: (e) => {
				r.value = e?.value;
			}
		});
		F(a, (e) => {
			e || (o.value = "");
		});
		function l(e) {
			e.key === "Tab" ? (op(i)?.focus(), a.value = !1) : e.key === "Escape" && (kb(e), a.value = !1);
		}
		let u = jb({
			minWidth: e.popoverMinWidth,
			maxWidth: e.popoverMaxWidth
		});
		return (r, i) => (z(), V(N(O_), {
			modelValue: c.value,
			"onUpdate:modelValue": i[3] ||= (e) => c.value = e,
			open: a.value,
			"onUpdate:open": i[4] ||= (e) => a.value = e,
			by: "value",
			disabled: e.disabled,
			"ignore-filter": ""
		}, {
			default: P(() => [U(N(k_), { "as-child": "" }, {
				default: P(() => [U(N(V_), G({ ref: "trigger" }, N(n), {
					tabindex: "0",
					"aria-label": e.accessibleLabel,
					"aria-busy": e.loading || void 0,
					"aria-invalid": e.invalid || void 0,
					class: N(Mx)(N(Cb)({
						size: e.size,
						border: e.invalid ? "invalid" : "none"
					}), N(t))
				}), {
					default: P(() => [H("div", { class: _e(N(Mx)("flex flex-1 items-center gap-2 overflow-hidden py-2 pl-2", e.size === "md" ? "text-xs" : "text-sm")) }, [e.loading ? (z(), B("i", XS)) : L(r.$slots, "icon", {}, void 0, void 0, 1), H("span", ZS, A(c.value?.name ?? e.label), 1)], 2), H("div", { class: _e(N(Eb)) }, [...i[5] ||= [H("i", { class: "icon-[lucide--chevron-down] text-muted-foreground" }, null, -1)]], 2)]),
					_: 3
				}, 16, [
					"aria-label",
					"aria-busy",
					"aria-invalid",
					"class"
				])]),
				_: 3
			}), (z(), V(N(B_), { key: Number(a.value) }, {
				default: P(() => [U(N(N_), {
					position: "popper",
					"side-offset": 8,
					align: "start",
					style: fe([N(u), e.contentStyle]),
					class: _e(N(Mx)(N(Tb), "min-w-(--reka-combobox-trigger-width)")),
					onKeydown: l
				}, {
					default: P(() => [U(N(Im), {
						class: "contents",
						onMountAutoFocus: i[1] ||= ds(() => {}, ["prevent"]),
						onUnmountAutoFocus: i[2] ||= ds(() => {}, ["prevent"])
					}, {
						default: P(() => [H("div", QS, [H("div", $S, [i[6] ||= H("i", { class: "icon-[lucide--search] text-muted-foreground" }, null, -1), U(N(L_), {
							modelValue: o.value,
							"onUpdate:modelValue": i[0] ||= (e) => o.value = e,
							"aria-label": e.searchLabel,
							placeholder: e.searchPlaceholder,
							class: "w-full border-none bg-transparent text-sm outline-none"
						}, null, 8, [
							"modelValue",
							"aria-label",
							"placeholder"
						])])]), U(N(U_), {
							style: fe({ maxHeight: `min(${e.listMaxHeight}, 50vh)` }),
							class: "scrollbar-custom w-full"
						}, {
							default: P(() => [(z(!0), B(R, null, ti(N(s), (e) => (z(), V(N(R_), {
								key: e.value,
								value: e,
								class: _e(N(wb)({ layout: "single" }))
							}, {
								default: P(() => [H("span", eC, A(e.name), 1), U(N(z_), { class: "flex shrink-0 items-center justify-center" }, {
									default: P(() => [...i[7] ||= [H("i", {
										class: "icon-[lucide--check] text-foreground",
										"aria-hidden": "true"
									}, null, -1)]]),
									_: 1
								})]),
								_: 2
							}, 1032, ["value", "class"]))), 128)), U(N(P_), { class: _e(N(Db)) }, {
								default: P(() => [W(A(e.emptyText), 1)]),
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
}), nC = {
	key: 0,
	class: "icon-[lucide--loader-circle] shrink-0 animate-spin text-muted-foreground"
}, rC = /* @__PURE__ */ I({
	inheritAttrs: !1,
	__name: "SingleSelect",
	props: /*@__PURE__*/ pi({
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
		let { attrsClass: t, attrsWithoutClass: n } = Ab(), r = Ni(e, "modelValue"), i = /* @__PURE__ */ j(!1);
		function a(e) {
			e.key === "Escape" && (kb(e), i.value = !1);
		}
		let o = jb({
			minWidth: e.popoverMinWidth,
			maxWidth: e.popoverMaxWidth
		});
		return (s, c) => e.searchable && e.searchLabel !== void 0 && e.emptyText !== void 0 ? (z(), V(tC, G({
			key: 0,
			modelValue: r.value,
			"onUpdate:modelValue": c[0] ||= (e) => r.value = e
		}, N(n), {
			class: N(t),
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
			icon: P(() => [L(s.$slots, "icon")]),
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
		])) : (z(), V(N(ev), {
			key: 1,
			modelValue: r.value,
			"onUpdate:modelValue": c[1] ||= (e) => r.value = e,
			open: i.value,
			"onUpdate:open": c[2] ||= (e) => i.value = e,
			disabled: e.disabled
		}, {
			default: P(() => [U(N(yv), G(N(n), {
				"aria-label": e.accessibleLabel,
				"aria-busy": e.loading || void 0,
				"aria-invalid": e.invalid || void 0,
				class: N(Mx)(N(Cb)({
					size: e.size,
					border: e.invalid ? "invalid" : "none"
				}), N(t))
			}), {
				default: P(() => [H("div", { class: _e(N(Mx)("flex flex-1 items-center gap-2 overflow-hidden py-2 pl-2", e.size === "md" ? "text-xs" : "text-sm")) }, [e.loading ? (z(), B("i", nC)) : L(s.$slots, "icon", {}, void 0, void 0, 1), U(N(bv), {
					placeholder: e.label,
					class: "truncate"
				}, null, 8, ["placeholder"])], 2), H("div", { class: _e(N(Eb)) }, [...c[3] ||= [H("i", { class: "icon-[lucide--chevron-down] text-muted-foreground" }, null, -1)]], 2)]),
				_: 3
			}, 16, [
				"aria-label",
				"aria-busy",
				"aria-invalid",
				"class"
			]), U(N(vv), null, {
				default: P(() => [U(N(fv), {
					position: "popper",
					"side-offset": 8,
					align: "start",
					style: fe([N(o), e.contentStyle]),
					class: _e(N(Mx)(N(Tb), "min-w-(--reka-select-trigger-width)")),
					onKeydown: a
				}, {
					default: P(() => [U(N(xv), {
						style: fe({ maxHeight: `min(${e.listMaxHeight}, 50vh)` }),
						class: "scrollbar-custom w-full"
					}, {
						default: P(() => [(z(!0), B(R, null, ti(e.options, (e) => (z(), V(N(hv), {
							key: e.value,
							value: e.value,
							disabled: e.disabled,
							class: _e(N(wb)({ layout: "single" }))
						}, {
							default: P(() => [U(N(_v), { class: "truncate" }, {
								default: P(() => [W(A(e.name), 1)]),
								_: 2
							}, 1024), U(N(gv), { class: "flex shrink-0 items-center justify-center" }, {
								default: P(() => [...c[4] ||= [H("i", {
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
}), iC = "unspecified", aC = (e) => e === "" ? iC : "value:" + e, oC = /* @__PURE__ */ I((e) => () => U(rC, G({
	class: "ap-comfy-select",
	accessibleLabel: e.label,
	"aria-describedby": e.invalid ? `${e.id}-error` : void 0,
	disabled: e.disabled,
	invalid: e.invalid,
	modelValue: e.options.some((t) => t.value === e.value) ? aC(e.value) : iC,
	options: e.options.map((e) => ({
		value: aC(e.value),
		name: e.label,
		disabled: e.disabled
	}))
}, {
	id: e.id,
	"onUpdate:modelValue": (t) => {
		typeof t == "string" && e.onChange(t === iC ? "" : t.slice(6));
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
// src/shared/useResource.ts
function sC(e, t = !1) {
	let n = /* @__PURE__ */ M({ state: "loading" }), r = /* @__PURE__ */ M(0);
	return F([() => N(e), r], ([e], r, i) => {
		let a = new AbortController();
		i(() => a.abort()), t && n.value.state === "ready" || (n.value = { state: "loading" }), e(a.signal).then((e) => {
			a.signal.aborted || (n.value = {
				state: "ready",
				data: e
			});
		}, (e) => {
			a.signal.aborted || (n.value = {
				state: "error",
				error: e
			});
		});
	}, { immediate: !0 }), {
		resource: n,
		refresh: () => {
			r.value += 1;
		}
	};
}
// src/features/storage/EnvironmentPage.vue?vue&type=script&setup=true&lang.ts
var cC = {
	key: 0,
	role: "status"
}, lC = ["for"], uC = { class: "ap-storage-actions" }, dC = ["disabled"], fC = {
	key: 0,
	role: "alert"
}, pC = {
	key: 2,
	role: "status"
}, mC = /* @__PURE__ */ I({
	__name: "EnvironmentPage",
	props: { onSaved: { type: Function } },
	setup(e) {
		let t = e, { t: n } = Y(), r = Tr(), { resource: i, refresh: a } = sC(hb), o = /* @__PURE__ */ M(), s = /* @__PURE__ */ j(), c = /* @__PURE__ */ j(!1), l = /* @__PURE__ */ M(), u = K(() => i.value.state === "ready" ? o.value ?? i.value.data : void 0), d = K(() => s.value ?? u.value?.longest_edge), f = K(() => d.value !== u.value?.longest_edge), p = K(() => n("environment.previewResolution")), m = K(() => l.value instanceof X && l.value.status === 409), h = K(() => u.value?.options.map((e) => ({
			value: String(e),
			label: e === 0 ? n("environment.fullResolution") : n("environment.pixels", { value: e })
		})) ?? []), g = !1;
		je(() => {
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
					let r = await gb(n, e.canvas, e.revision);
					if (g) return;
					o.value = r, s.value = void 0, t.onSaved();
				} catch (e) {
					g || (l.value = e);
				} finally {
					g || (c.value = !1);
				}
			}
		}
		return (e, t) => N(i).state === "loading" ? (z(), B("p", cC, A(N(n)("states.loading")), 1)) : N(i).state === "error" ? (z(), V(N(Dv), {
			key: 1,
			error: N(i).error,
			retry: N(a)
		}, null, 8, ["error", "retry"])) : (z(), B("form", {
			key: 2,
			class: "ap-environment",
			onSubmit: ds(y, ["prevent"])
		}, [
			H("label", { for: N(r) }, A(p.value), 9, lC),
			U(N(oC), {
				id: N(r),
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
			H("small", null, A(N(n)("environment.previewResolutionHelp")), 1),
			H("div", uC, [H("button", {
				class: "ap-storage-button",
				type: "submit",
				disabled: c.value || m.value || !f.value
			}, A(N(n)(c.value ? "environment.saving" : "storage.save")), 9, dC)]),
			m.value ? (z(), B("div", fC, [H("p", null, A(N(n)("environment.conflict")), 1), H("button", {
				class: "ap-storage-button",
				type: "button",
				onClick: v
			}, A(N(n)("actions.refresh")), 1)])) : l.value === void 0 ? za("", !0) : (z(), V(N(Dv), {
				key: 1,
				error: l.value
			}, null, 8, ["error"])),
			o.value && !f.value && !c.value && l.value === void 0 ? (z(), B("p", pC, A(N(n)("environment.saved")), 1)) : za("", !0)
		], 32));
	}
}), hC = [
	"camera",
	"primary_optics",
	"optical_accessory",
	"filter"
], gC = "/astrophoto/v1", _C = (e) => e === null || typeof e == "string", vC = (e) => e === null || typeof e == "number" && Number.isFinite(e), yC = (e) => typeof e == "string" && /^[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}$/.test(e), bC = (e) => typeof e == "number" && e > 0 && Number.isSafeInteger(e), xC = (e) => Array.isArray(e) && e.every(yC), SC = (e) => Array.isArray(e) && e.every((e) => typeof e == "string"), CC = (e) => hC.includes(e), wC = (e) => Z(e) && Object.entries(e).every(([e, t]) => e === "passbands" ? Array.isArray(t) && t.every((e) => Z(e) && yC(e.id) && typeof e.band_label == "string" && vC(e.center_nm) && vC(e.fwhm_nm)) : e === "readout_modes" ? Array.isArray(t) && t.every((e) => Z(e) && typeof e.mode_key == "string" && typeof e.display_name == "string" && [
	"gain_min",
	"gain_max",
	"offset_min",
	"offset_max"
].every((t) => vC(e[t]))) : _C(t) || typeof t == "boolean" || vC(t));
function TC(e) {
	if (!Z(e) || !yC(e.id) || !CC(e.equipment_type) || typeof e.name != "string" || !bC(e.row_version) || !_C(e.archived_at_utc) || !_C(e.notes) || !_C(e.manufacturer) || !_C(e.model) || !wC(e.specs) || e.usage_summary !== void 0 && (!Array.isArray(e.usage_summary) || !e.usage_summary.every((e) => Z(e) && yC(e.train_id) && typeof e.name == "string" && typeof e.draft == "boolean" && Array.isArray(e.revisions) && e.revisions.every((e) => Z(e) && yC(e.id) && bC(e.revision_number))))) throw new X("schema");
	return e;
}
function EC(e) {
	return Z(e) && vC(e.rotation_deg) && _C(e.flat_validity_note) && _C(e.configuration_note);
}
function DC(e) {
	return Z(e) && typeof e.name == "string" && _C(e.notes) && (e.change_summary === void 0 || _C(e.change_summary)) && [
		"camera_id",
		"primary_optics_id",
		"base_revision_id"
	].every((t) => e[t] === null || yC(e[t])) && xC(e.accessory_ids) && xC(e.filter_ids) && EC(e.optical_state);
}
function OC(e) {
	if (!Z(e) || !bC(e.draft_version) || !DC(e.draft) || typeof e.updated_at_utc != "string") throw new X("schema");
	return e;
}
function kC(e) {
	if (!Z(e) || !yC(e.id) || !yC(e.train_id) || !bC(e.revision_number) || !_C(e.change_summary) || typeof e.published_at_utc != "string" || !(e.base_revision_id === null || yC(e.base_revision_id))) throw new X("schema");
	return e;
}
function AC(e) {
	if (!Z(e) || !yC(e.id) || typeof e.name != "string" || !_C(e.notes) || !bC(e.row_version) || ![
		"draft",
		"published",
		"archived"
	].includes(String(e.status)) || typeof e.has_draft != "boolean" || !Z(e.summary) || !_C(e.summary.camera) || !_C(e.summary.primary_optics) || !SC(e.summary.accessories) || !SC(e.summary.filters) || (e.latest_revision !== null && kC(e.latest_revision), e.default_revision !== null && kC(e.default_revision), e.draft !== null && e.draft !== void 0 && OC(e.draft), e.configuration != null && (!Z(e.configuration) || !DC(e.configuration.draft) || e.configuration.draft_version !== null && !bC(e.configuration.draft_version)))) throw new X("schema");
	if (e.components !== void 0) {
		if (!Array.isArray(e.components)) throw new X("schema");
		e.components.forEach(TC);
	}
	return e;
}
function jC(e) {
	return new URLSearchParams(Object.entries(e).filter(([, e]) => e)).toString();
}
function MC(e, t) {
	if (!Z(e) || !Array.isArray(e.items) || !(e.next === null || yC(e.next)) || e.total !== void 0 && (!Number.isSafeInteger(e.total) || Number(e.total) < 0)) throw new X("schema");
	return {
		items: e.items.map(t),
		next: e.next,
		total: e.total
	};
}
var NC = (e) => `${gC}/equipment/${encodeURIComponent(e)}`, PC = (e) => `${gC}/optical-trains/${encodeURIComponent(e)}`;
async function FC(e, t) {
	return MC(await Tv(`${gC}/equipment?${jC(e)}`, t), TC);
}
async function IC(e, t) {
	return TC(await Tv(NC(e), t));
}
async function LC(e, t, n, r) {
	return TC(await Ev(n ? NC(n.id) : `${gC}/equipment`, n ? "PATCH" : "POST", n ? {
		...t,
		expected_version: n.row_version
	} : {
		...t,
		equipment_type: e
	}, r));
}
async function RC(e, t) {
	return TC(await Ev(NC(e.id) + (e.archived_at_utc ? "/restore" : "/archive"), "POST", { expected_version: e.row_version }, t));
}
async function zC(e, t) {
	await Ev(NC(e.id), "DELETE", { expected_version: e.row_version }, t);
}
async function BC(e, t) {
	return MC(await Tv(`${gC}/optical-trains?${jC(e)}`, t), AC);
}
async function VC(e, t) {
	return AC(await Tv(PC(e), t));
}
async function HC(e, t) {
	await Ev(PC(e.id), "DELETE", { expected_version: e.row_version }, t);
}
async function UC(e, t) {
	let n = AC(await Ev(`${gC}/optical-trains`, "POST", {
		name: e.name,
		notes: e.notes,
		draft: e
	}, t));
	if (!n.draft) throw new X("schema");
	return {
		train: n,
		receipt: n.draft
	};
}
async function WC(e, t, n, r) {
	return OC(await Ev(PC(e) + "/draft", "PUT", {
		draft: t,
		expected_draft_version: n
	}, r));
}
async function GC(e, t) {
	return AC(await Ev(PC(e.id) + (e.status === "archived" ? "/restore" : "/archive"), "POST", { expected_version: e.row_version }, t));
}
async function KC(e) {
	let t = [], n = "";
	do {
		let r = await FC({
			archived: "all",
			after: n,
			limit: "100"
		}, e);
		if (t.push(...r.items), r.next && r.next <= n) throw new X("schema");
		n = r.next ?? "";
	} while (n);
	return t;
}
// src/shared/SidebarTabs.tsx
function qC({ items: e, active: t, prefix: n, label: r, title: i, select: a }) {
	return U("div", { class: "ap-tab-scroll" }, [U("div", {
		class: "ap-tabs",
		role: "tablist",
		"aria-label": r
	}, [e.map((r, o) => U("button", {
		key: r,
		id: `${n}-tab-${r}`,
		type: "button",
		role: "tab",
		"aria-selected": r === t,
		"aria-controls": `${n}-panel-${r}`,
		"data-state": r === t ? "active" : "inactive",
		tabindex: r === t ? 0 : -1,
		onClick: () => a(r),
		onKeydown: (t) => {
			let n = t.key === "Home" ? 0 : t.key === "End" ? e.length - 1 : (o + {
				ArrowRight: 1,
				ArrowDown: 1,
				ArrowLeft: -1,
				ArrowUp: -1
			}[t.key] + e.length) % e.length;
			Number.isNaN(n) || (t.preventDefault(), (t.currentTarget.parentElement?.querySelectorAll("[role=\"tab\"]"))?.item(n)?.focus());
		}
	}, [i(r)]))])]);
}
// src/features/library/components/equipmentFields.tsx
var JC = /* @__PURE__ */ I((e) => {
	let { t, te: n } = Y(), r = (e, r) => n(e) ? t(e) : r;
	return () => {
		let { error: i, retry: a } = e;
		if (!i) return null;
		let o = i instanceof X ? i : new X("network"), s = ["equipment.errors." + o.code, "errors." + o.code].find((e) => n(e));
		return U("div", {
			role: "alert",
			class: "ap-equipment-error"
		}, [
			U("p", null, [t(s ?? "errors.unknown")]),
			o.fields && Object.entries(o.fields).map(([e, t]) => U("small", { key: e }, [
				r("equipment.fields." + e.split(".").at(-1), e),
				W(" · "),
				r("equipment.validation." + String(t), String(t))
			])),
			U("small", null, [o.code, o.requestId ? " · " + o.requestId : ""]),
			a && U("button", {
				type: "button",
				onClick: a
			}, [t("actions.retry")])
		]);
	};
}, { props: ["error", "retry"] });
function YC(e, t) {
	return U(JC, {
		error: e,
		retry: t
	}, null);
}
var XC = /* @__PURE__ */ I((e) => {
	let { t } = Y(), n = Tr();
	return () => {
		let { label: r, name: i, value: a, onChange: o, options: s, control: c, type: l = "text", required: u = !1, min: d, max: f, step: p, error: m } = e, h = m?.fields?.[i], g = {
			id: n,
			name: i,
			required: u,
			value: a ?? "",
			"aria-invalid": h ? !0 : void 0,
			"aria-describedby": h ? n + "-error" : void 0
		}, _ = (e) => o?.(e.currentTarget.value);
		return U("div", { class: "ap-equipment-field" }, [
			U("label", { for: n }, [r, u ? " *" : ""]),
			c ? c(n, !!h) : s ? U("select", G(g, { onChange: _ }), [s.map((e) => U("option", {
				key: e.value,
				value: e.value,
				disabled: e.disabled
			}, [e.label]))]) : l === "textarea" ? U("textarea", G(g, {
				maxlength: 4e3,
				rows: 2,
				onInput: _
			}), null) : U("input", G(g, {
				type: l,
				min: d,
				max: f,
				step: p,
				maxlength: 120,
				onInput: _
			}), null),
			!!h && U("small", {
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
] }), ZC = (e) => e === "" ? null : Number(e);
function QC(e) {
	return e === "mono" ? "mono" : e === "color" || e === "osc" ? "color" : null;
}
var $C = (e) => e === null ? null : new Intl.NumberFormat(void 0, { maximumFractionDigits: 4 }).format(e);
// src/features/library/components/useMutation.ts
async function ew(e, n, r, i = "default") {
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
function tw() {
	let e = new AbortController(), t = /* @__PURE__ */ j(!1), n = /* @__PURE__ */ M();
	je(() => e.abort());
	async function r(r) {
		let { signal: i } = e;
		if (!(i.aborted || t.value)) {
			t.value = !0, n.value = void 0;
			try {
				await r(i);
			} catch (e) {
				i.aborted || (n.value = e instanceof X ? e : new X("network"));
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
// src/features/library/pages/EquipmentForm.tsx
var nw = {
	name: "",
	notes: null,
	manufacturer: null,
	model: null,
	specs: {}
}, rw = {
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
}, iw = {
	sensor_width_px: 1e6,
	sensor_height_px: 1e6,
	adc_bit_depth: 64,
	max_bin_x: 1024,
	max_bin_y: 1024
}, aw = /* @__PURE__ */ new Set([
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
]), ow = {
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
}, sw = [
	"bayer_pattern",
	"adc_bit_depth",
	"max_bin_x",
	"max_bin_y"
], cw = [
	"gain_min",
	"gain_max",
	"offset_min",
	"offset_max"
];
function lw(e) {
	return e.passbands ?? [];
}
function uw(e) {
	return e.readout_modes ?? [];
}
var dw = {
	band_label: "",
	center_nm: null,
	fwhm_nm: null
}, fw = {
	mode_key: "",
	display_name: "",
	gain_min: null,
	gain_max: null,
	offset_min: null,
	offset_max: null
}, pw = /* @__PURE__ */ I((e) => {
	let { t } = Y(), n = tw();
	return () => {
		let { kind: r, original: i, input: a, change: o, saved: s, back: c, reload: l } = e, u = n.pending.value, d = n.error.value;
		return U("form", {
			"aria-busy": u,
			onSubmit: (e) => {
				e.preventDefault(), n.run(async (e) => {
					let t = await LC(r, a, i, e);
					e.aborted || s(t);
				});
			}
		}, [
			U("h2", null, [
				t("equipment." + (i ? "editDevice" : "addDevice")),
				W(" · "),
				t("equipment.values." + r)
			]),
			U("fieldset", { disabled: u }, [U("legend", null, [t("equipment.basics")]), U("div", { class: "ap-equipment-grid" }, [[
				"name",
				"manufacturer",
				"model",
				"notes"
			].map((e) => U(XC, {
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
			U("fieldset", { disabled: u }, [U("legend", null, [t("equipment.specs")]), U(mw, {
				kind: r,
				specs: a.specs,
				change: (e) => o({
					...a,
					specs: e
				}),
				error: d,
				disabled: u
			}, null)]),
			U(JC, {
				error: d,
				retry: d?.status === 409 && i ? () => l(i) : void 0
			}, null),
			U("div", { class: "ap-equipment-actions" }, [U("button", {
				type: "button",
				disabled: u,
				onClick: c
			}, [t("equipment.cancel")]), U("button", {
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
] }), mw = /* @__PURE__ */ I((e) => {
	let { t } = Y();
	return () => {
		let { kind: n, specs: r, change: i, error: a, disabled: o } = e;
		function s(e) {
			let n = e in iw || aw.has(e), s = e === "cooling_supported" ? ["true", "false"] : rw[e], c = s && [{
				value: "",
				label: t("equipment.unspecified")
			}, ...s.map((e) => ({
				value: e,
				label: t("equipment.values." + e)
			}))], l = e === "sensor_kind" ? QC(r[e]) : r[e], u = t("equipment.fields." + e), d = "specs." + e;
			return c ? U(XC, {
				key: e,
				label: u,
				name: d,
				error: a,
				control: (t, n) => U(oC, {
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
			}, null) : U(XC, {
				key: e,
				label: u,
				name: d,
				value: l == null ? null : String(l),
				error: a,
				type: n ? "number" : e === "optical_notes" ? "textarea" : "text",
				min: e === "design_backfocus_mm" ? 0 : n ? e in iw ? 1 : 1e-9 : void 0,
				max: n ? iw[e] ?? 1e6 : void 0,
				step: e in iw ? 1 : "any",
				onChange: (t) => i({
					...r,
					[e]: n ? ZC(t) : t || null
				})
			}, null);
		}
		return U(R, null, [
			U("div", { class: "ap-equipment-grid" }, [ow[n].map(s)]),
			n === "camera" && U("details", {
				class: "ap-equipment-advanced",
				open: Object.keys(a?.fields ?? {}).some((e) => sw.includes(e.slice(6)) || e.startsWith("specs.readout_modes")) || void 0
			}, [
				U("summary", {
					class: "ap-tree-row ap-tree-folder",
					onKeydown: (e) => {
						if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
						let t = e.currentTarget.closest("details");
						t && (e.preventDefault(), e.stopPropagation(), t.open = e.key === "ArrowRight");
					}
				}, [U(Pv, null, null), U("span", null, [t("equipment.advanced")])]),
				U("div", { class: "ap-equipment-grid" }, [sw.map(s)]),
				U("h3", null, [t("equipment.fields.readout_modes")]),
				uw(r).map((e, n) => U("fieldset", { key: n }, [
					U("legend", null, [n + 1]),
					U("div", { class: "ap-equipment-grid" }, [[
						"mode_key",
						"display_name",
						...cw
					].map((o) => {
						let s = o !== "mode_key" && o !== "display_name";
						return U(XC, {
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
								readout_modes: uw(r).map((t, r) => r === n ? {
									...t,
									[o]: s ? ZC(e) : e
								} : t)
							})
						}, null);
					})]),
					U("button", {
						type: "button",
						onClick: () => i({
							...r,
							readout_modes: uw(r).filter((e, t) => t !== n)
						})
					}, [t("equipment.remove")])
				])),
				U("button", {
					type: "button",
					disabled: uw(r).length >= 32,
					onClick: () => i({
						...r,
						readout_modes: [...uw(r), fw]
					})
				}, [t("equipment.addMode")])
			]),
			n === "filter" && U(R, null, [
				U("h3", null, [t("equipment.fields.passbands")]),
				lw(r).map((e, n) => U("fieldset", { key: e.id ?? n }, [
					U("legend", null, [n + 1]),
					U("div", { class: "ap-equipment-grid" }, [[
						"band_label",
						"center_nm",
						"fwhm_nm"
					].map((o) => U(XC, {
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
							passbands: lw(r).map((t, r) => r === n ? {
								...t,
								[o]: o === "band_label" ? e : ZC(e)
							} : t)
						})
					}, null))]),
					U("button", {
						type: "button",
						onClick: () => i({
							...r,
							passbands: lw(r).filter((e, t) => t !== n)
						})
					}, [t("equipment.remove")])
				])),
				U("button", {
					type: "button",
					disabled: lw(r).length >= 32,
					onClick: () => i({
						...r,
						passbands: [...lw(r), dw]
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
] }), hw = /* @__PURE__ */ I((e) => {
	let { t } = Y();
	return () => {
		let { specs: n, kind: r } = e, i = (e) => {
			let r = e === "sensor_kind" ? QC(n[e]) : n[e];
			return r == null ? t("equipment.unspecified") : e === "cooling_supported" || e in rw ? t("equipment.values." + r) : String(r);
		}, a = lw(n);
		return U(R, null, [
			U("dl", { class: "ap-equipment-definitions" }, [[...ow[r], ...r === "camera" ? sw : []].map((e) => U("div", { key: e }, [U("dt", null, [t("equipment.fields." + e)]), U("dd", null, [i(e)])]))]),
			r === "filter" && U(R, null, [
				U("h4", null, [t("equipment.fields.passbands")]),
				(!a.length || n.filter_kind === "dual_band" && a.length < 2 || a.some((e) => e.center_nm === null || e.fwhm_nm === null)) && U("small", null, [t("equipment.incompleteBands")]),
				U("ul", null, [a.map((e, n) => U("li", { key: e.id ?? n }, [
					e.band_label,
					W(" · "),
					e.center_nm === null ? t("equipment.unspecified") : e.center_nm + " nm",
					W(" ·"),
					" ",
					t("equipment.fields.fwhm_nm"),
					W(" "),
					e.fwhm_nm ?? t("equipment.unspecified")
				]))])
			]),
			r === "camera" && uw(n).length > 0 && U(R, null, [U("h4", null, [t("equipment.fields.readout_modes")]), uw(n).map((e) => U("details", { key: e.mode_key }, [U("summary", null, [
				e.display_name,
				W(" ("),
				e.mode_key,
				W(")")
			]), U("dl", null, [cw.map((n) => U("div", { key: n }, [U("dt", null, [t("equipment.fields." + n)]), U("dd", null, [e[n] ?? t("equipment.unspecified")])]))])]))])
		]);
	};
}, { props: ["specs", "kind"] }), gw = /* @__PURE__ */ I((e, { slots: t }) => {
	let n = /* @__PURE__ */ j(e.initiallyOpen ?? !1), r = Tr();
	return () => U("section", { class: "ap-detail-section" }, [U("button", {
		type: "button",
		class: "ap-detail-toggle ap-tree-row ap-tree-folder",
		"aria-expanded": n.value,
		"aria-controls": r,
		onClick: () => {
			n.value = !n.value;
		}
	}, [
		U(Pv, null, null),
		U("span", null, [e.title]),
		e.count && U("small", null, [e.count])
	]), U("div", {
		id: r,
		hidden: !n.value,
		class: "ap-detail-content"
	}, [t.default?.()])]);
}, { props: [
	"title",
	"count",
	"initiallyOpen"
] }), _w = /* @__PURE__ */ I((e) => {
	let { t } = Y();
	return () => {
		let { editLabel: n, archived: r, pending: i, onEdit: a, onArchive: o, onDelete: s } = e;
		return U("div", { class: "ap-equipment-actions ap-equipment-detail-actions" }, [
			a && U("button", {
				class: "ap-equipment-primary",
				type: "button",
				disabled: i,
				onClick: a
			}, [n]),
			U("button", {
				type: "button",
				disabled: i,
				onClick: o
			}, [t("equipment." + (r ? "restore" : "archive"))]),
			U("button", {
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
function vw({ resource: e, loadingLabel: t, retry: n, renderContent: r, renderError: i }) {
	return e.state === "loading" ? U("p", { role: "status" }, [t]) : e.state === "error" ? i ? U(R, null, [i(e.error, n)]) : U(Dv, {
		error: e.error,
		retry: n
	}, null) : U(R, null, [r(e.data)]);
}
vw.props = [
	"resource",
	"loadingLabel",
	"retry",
	"renderContent",
	"renderError"
];
// src/features/library/pages/EquipmentDetails.tsx
var yw = /* @__PURE__ */ I((e) => {
	let { t } = Y(), { resource: n, refresh: r } = sC(K(() => {
		let t = e.id;
		return (e) => IC(t, e);
	})), i = tw(), a = /* @__PURE__ */ j(!1);
	return () => {
		let { edit: o, openTrain: s, changed: c, deleted: l } = e;
		return U(vw, {
			resource: n.value,
			loadingLabel: t("states.loading"),
			retry: r,
			renderError: YC,
			renderContent: (e) => {
				let n = e.usage_summary ?? [], u = [...ow[e.equipment_type], ...e.equipment_type === "camera" ? sw : []], d = u.filter((t) => e.specs[t] !== null && e.specs[t] !== void 0 && e.specs[t] !== ""), f = [
					"manufacturer",
					"model",
					"notes"
				].filter((t) => !!e[t]?.trim());
				return U(R, null, [
					U("div", { class: "ap-detail-card" }, [
						U("h2", null, [e.name]),
						U("small", null, [
							t("equipment.values." + e.equipment_type),
							W(" · "),
							t(e.archived_at_utc ? "equipment.values.archived" : "equipment.inUse")
						]),
						U("dl", { class: "ap-equipment-definitions" }, [d.slice(0, 4).map((n) => U("div", { key: n }, [U("dt", null, [t("equipment.fields." + n)]), U("dd", null, [typeof e.specs[n] == "boolean" || [
							"sensor_kind",
							"optics_kind",
							"accessory_kind",
							"filter_kind"
						].includes(n) ? t("equipment.values." + e.specs[n]) : String(e.specs[n])])]))])
					]),
					U(gw, {
						title: t("equipment.basics"),
						initiallyOpen: !0
					}, { default: () => f.length ? U("dl", { class: "ap-equipment-definitions" }, [f.map((n) => U("div", { key: n }, [U("dt", null, [t("equipment.fields." + n)]), U("dd", null, [e[n]])]))]) : U("p", null, [t("equipment.noBasicInformation")]) }),
					U(gw, {
						title: t("equipment.specs"),
						count: d.length + " / " + u.length
					}, { default: () => U(hw, {
						specs: e.specs,
						kind: e.equipment_type
					}, null) }),
					U(gw, {
						title: t("equipment.usage"),
						count: String(n.length)
					}, { default: () => n.length ? U("ul", null, [n.map((e) => U("li", { key: e.train_id }, [U("button", {
						type: "button",
						onClick: () => s(e.train_id)
					}, [e.name])]))]) : U("p", null, [t("equipment.noUsage")]) }),
					U(JC, {
						error: i.error.value,
						retry: i.error.value?.status === 409 ? r : void 0
					}, null),
					U(_w, {
						editLabel: t("equipment.editAction"),
						archived: !!e.archived_at_utc,
						pending: i.pending.value,
						onEdit: () => o(e),
						onArchive: () => void i.run(async (n) => {
							if (!e.archived_at_utc && !await ew(t("equipment.archive"), t("equipment.archiveDeviceConfirm"), e.name) || n.aborted) return;
							let i = await RC(e, n);
							n.aborted || (c(i.archived_at_utc ? "archivedReceipt" : "restoredReceipt"), r());
						}),
						onDelete: () => void i.run(async (r) => {
							n.length ? a.value = !0 : await ew(t("equipment.deleteDevice"), t("equipment.deleteDeviceConfirm"), e.name, "delete") && !r.aborted && (await zC(e, r), r.aborted || l());
						})
					}, null),
					a.value && n.length > 0 && U("div", {
						role: "alert",
						class: "ap-equipment-error"
					}, [U("p", null, [t("equipment.deleteReferenced")]), U("ul", null, [n.map((e) => U("li", { key: e.train_id }, [U("button", {
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
function bw({ records: e, recordKey: t, renderRecord: n, renderEmpty: r }) {
	return e.length > 0 ? U("ul", { class: "ap-equipment-list" }, [e.map((e) => U("li", { key: t(e) }, [n(e)]))]) : U(R, null, [r()]);
}
bw.props = [
	"records",
	"recordKey",
	"renderRecord",
	"renderEmpty"
];
// src/features/library/pages/EquipmentList.tsx
var xw = /* @__PURE__ */ I((e) => {
	let { t } = Y(), n = /* @__PURE__ */ j(e.search.q.trim()), r = (e) => {
		n.value = e.trim();
	}, i = /* @__PURE__ */ M(), a = tw(), o = K(() => ({
		mode: e.mode,
		filter: e.search.filter,
		q: n.value,
		epoch: e.epoch
	})), s = K(() => {
		let { mode: e, filter: t, q: n } = o.value;
		return (r, i = "") => {
			let a = {
				q: n,
				after: i,
				archived: t === "archived" ? "true" : "false"
			};
			return e === "devices" ? FC({
				...a,
				type: hC.includes(t) ? t : void 0
			}, r) : BC({
				...a,
				status: t || void 0
			}, r);
		};
	}), { resource: c, refresh: l } = sC(s);
	return () => {
		let { search: o, setSearch: u, mode: d, open: f, add: p } = e, m = [
			"",
			...d === "devices" ? hC : ["draft", "published"],
			"archived"
		], h = c.value;
		return U(R, null, [
			U("div", { class: "ap-equipment-actions" }, [U("h2", null, [t("equipment." + d), h.state === "ready" && h.data.total !== void 0 && U(R, null, [W(" · "), h.data.total])]), U("button", {
				type: "button",
				class: "ap-equipment-primary",
				onClick: p
			}, [t("equipment." + (d === "devices" ? "addDevice" : "addTrain"))])]),
			U("div", { class: "ap-search-toolbar ap-equipment-search" }, [U(Sv, {
				label: t("equipment." + (d === "devices" ? "searchDevice" : "searchTrain")),
				clearLabel: t("browse.clear"),
				value: o.q,
				onValueChange: (e) => u({
					...o,
					q: e
				}),
				onSearch: r
			}, null), U(Cv, {
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
			U(vw, {
				resource: h,
				loadingLabel: t("states.loading"),
				retry: () => {
					i.value = void 0, l();
				},
				renderError: YC,
				renderContent: (e) => {
					let r = s.value, c = i.value?.request === r ? i.value : void 0, l = e.items.concat(c?.items ?? []), p = c ? c.next : e.next;
					return U(R, null, [
						U(bw, {
							records: l,
							recordKey: (e) => e.id,
							renderRecord: (e) => U("button", {
								type: "button",
								onClick: () => f(e.id),
								class: "ap-equipment-row"
							}, [U("strong", { title: e.name }, [e.name]), "equipment_type" in e ? U(Sw, { device: e }, null) : U(Cw, { train: e }, null)]),
							renderEmpty: () => U(R, null, [U("p", null, [t("equipment." + (n.value || o.filter ? "noMatches" : d === "devices" ? "emptyDevices" : "emptyTrains"))]), (o.q || o.filter) && U("button", {
								type: "button",
								onClick: () => u({
									q: "",
									filter: ""
								})
							}, [t("equipment.resetSearch")])])
						}, null),
						U(JC, { error: a.error.value }, null),
						p && U("button", {
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
] }), Sw = /* @__PURE__ */ I((e) => {
	let { t } = Y();
	return () => {
		let { device: n } = e, r = n.specs, i = QC(r.sensor_kind), a = n.equipment_type === "camera" ? i && t("equipment.values." + i) : n.equipment_type === "primary_optics" ? r.native_focal_length_mm && r.native_focal_length_mm + " mm" : n.equipment_type === "optical_accessory" ? r.nominal_factor && r.nominal_factor + "×" : r.filter_kind && t("equipment.values." + r.filter_kind);
		return U("small", null, [[
			t("equipment.values." + n.equipment_type),
			n.manufacturer,
			n.model,
			a,
			n.archived_at_utc && t("equipment.values.archived")
		].filter(Boolean).join(" · ")]);
	};
}, { props: ["device"] }), Cw = /* @__PURE__ */ I((e) => {
	let { t } = Y();
	return () => {
		let { train: n } = e, { camera: r, primary_optics: i, accessories: a, filters: o } = n.summary;
		return U(R, null, [
			U("small", null, [t(n.status === "published" ? "equipment.configured" : "equipment.values." + n.status)]),
			U("small", null, [[
				r,
				i,
				...a
			].filter(Boolean).join(" + ")]),
			o.length > 0 && U("small", null, [
				t("equipment.fields.filter_ids"),
				W(" · "),
				o.join(", ")
			])
		]);
	};
}, { props: ["train"] }), ww = {
	key: 0,
	class: "px-2 pt-2 pb-0"
}, Tw = { class: "flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm" }, Ew = {
	key: 0,
	class: "px-1 text-sm text-muted-foreground"
}, Dw = { class: "flex size-4 shrink-0 items-center justify-center rounded-sm transition-all duration-200 group-data-[state=checked]:bg-primary group-data-[state=unchecked]:bg-secondary [&>span]:flex" }, Ow = {
	key: 0,
	class: "px-1 text-sm text-muted-foreground"
}, kw = /* @__PURE__ */ I({
	__name: "MultiSelectContent",
	props: /*@__PURE__*/ pi({
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
	emits: /*@__PURE__*/ pi(["escape"], ["update:modelValue", "update:searchQuery"]),
	setup(e, { emit: t }) {
		let { open: n } = E_(), r = t, i = Ni(e, "modelValue"), a = Ni(e, "searchQuery"), o = K(() => !!e.formatSelectedCount || e.showClearButton), s = K(() => Mx("flex shrink-0 items-center justify-between", e.actionsPlacement === "header" ? "mt-2 border-b px-2 pb-4" : "-mx-2 mt-2 border-t px-4 pt-3 pb-1")), c = YS(a, () => e.options), l = K(() => a.value.trim() ? [...i.value.filter((e) => !c.value.some(({ value: t }) => t === e.value)), ...c.value] : e.options);
		function u(e) {
			e.key === "Escape" && (kb(e), r("escape"));
		}
		function d(e) {
			e.preventDefault();
		}
		return (t, r) => (z(), V(N(B_), { key: Number(N(n)) }, {
			default: P(() => [U(N(N_), {
				position: "popper",
				"side-offset": 8,
				align: "start",
				style: fe([e.popoverStyle, e.contentStyle]),
				class: _e(N(Mx)(N(Tb), "flex flex-col")),
				onKeydown: u,
				onFocusOutside: d
			}, {
				default: P(() => [U(N(Im), {
					class: "contents",
					onMountAutoFocus: r[1] ||= ds(() => {}, ["prevent"])
				}, {
					default: P(() => [
						e.showSearchBox ? (z(), B("div", ww, [H("div", Tw, [r[2] ||= H("i", { class: "icon-[lucide--search] shrink-0 text-muted-foreground" }, null, -1), U(N(L_), {
							modelValue: a.value,
							"onUpdate:modelValue": r[0] ||= (e) => a.value = e,
							placeholder: e.searchPlaceholder,
							"aria-label": e.searchLabel,
							class: "w-full border-none bg-transparent outline-none"
						}, null, 8, [
							"modelValue",
							"placeholder",
							"aria-label"
						])])])) : za("", !0),
						o.value && e.actionsPlacement === "header" ? (z(), B("div", {
							key: 1,
							class: _e(s.value)
						}, [e.formatSelectedCount ? (z(), B("span", Ew, A(e.formatSelectedCount(i.value.length)), 1)) : za("", !0)], 2)) : za("", !0),
						U(N(U_), {
							class: _e(N(Mx)("flex flex-col gap-0 p-0 text-sm", "scrollbar-custom overflow-y-auto", "min-w-(--reka-combobox-trigger-width)")),
							style: fe({ maxHeight: `min(${e.listMaxHeight}, 50vh)` })
						}, {
							default: P(() => [(z(!0), B(R, null, ti(l.value, (e) => (z(), V(N(R_), {
								key: e.value,
								value: e,
								class: _e(N(Mx)("group", N(wb)({ layout: "multi" })))
							}, {
								default: P(() => [H("div", Dw, [U(N(z_), null, {
									default: P(() => [...r[3] ||= [H("i", { class: "icon-[lucide--check] text-xs font-bold text-foreground" }, null, -1)]]),
									_: 1
								})]), H("span", null, A(e.name), 1)]),
								_: 2
							}, 1032, ["value", "class"]))), 128)), U(N(P_), { class: _e(N(Db)) }, {
								default: P(() => [W(A(e.emptyText), 1)]),
								_: 1
							}, 8, ["class"])]),
							_: 1
						}, 8, ["class", "style"]),
						o.value && e.actionsPlacement === "footer" ? (z(), B("div", {
							key: 2,
							class: _e(s.value)
						}, [e.formatSelectedCount ? (z(), B("span", Ow, A(e.formatSelectedCount(i.value.length)), 1)) : za("", !0)], 2)) : za("", !0)
					]),
					_: 1
				})]),
				_: 1
			}, 8, ["style", "class"])]),
			_: 1
		}));
	}
}), Aw = { class: "flex flex-1 items-center overflow-hidden py-2 pl-2 whitespace-nowrap" }, jw = { class: "truncate text-sm" }, Mw = /* @__PURE__ */ I({
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
		return (t, n) => (z(), V(N(k_), { "as-child": "" }, {
			default: P(() => [U(N(V_), G(t.$attrs, {
				"aria-label": e.accessibleLabel,
				class: N(Mx)(N(Cb)({
					size: e.size,
					border: e.selectedItems.length ? "active" : "none"
				}), e.class)
			}), {
				default: P(() => [H("div", Aw, [e.selectedItems.length === 0 ? (z(), B("span", {
					key: 0,
					class: _e(e.size === "md" ? "text-xs" : "text-sm")
				}, A(e.label), 3)) : L(t.$slots, "default", { selected: e.selectedItems }, () => [H("span", jw, A(e.selectedItems.map(({ name: e }) => e).join(", ")), 1)], void 0, 1), e.selectedItems.length ? (z(), B("span", {
					key: 2,
					class: _e(N(Mx)("pointer-events-none absolute -top-1.5 -right-1.5 z-10", N(Ob)))
				}, A(e.selectedItems.length), 3)) : za("", !0)]), H("div", { class: _e(N(Eb)) }, [...n[0] ||= [H("i", { class: "icon-[lucide--chevron-down] text-muted-foreground" }, null, -1)]], 2)]),
				_: 3
			}, 16, ["aria-label", "class"])]),
			_: 3
		}));
	}
}), Nw = /* @__PURE__ */ I({
	inheritAttrs: !1,
	__name: "MultiSelect",
	props: /*@__PURE__*/ pi({
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
		let { attrsClass: t, attrsWithoutClass: n } = Ab(), r = Ni(e, "modelValue"), i = Ni(e, "searchQuery"), a = /* @__PURE__ */ j(!1), o = jb({
			minWidth: e.popoverMinWidth,
			maxWidth: e.popoverMaxWidth
		});
		return (s, c) => (z(), V(N(O_), {
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
			default: P(() => [U(Mw, G(N(n), {
				class: N(t),
				label: e.label,
				"accessible-label": e.accessibleLabel,
				"selected-items": r.value,
				size: e.size
			}), ni({ _: 2 }, [s.$slots.value ? {
				name: "default",
				fn: P(({ selected: e }) => [L(s.$slots, "value", { selected: e })]),
				key: "0"
			} : void 0]), 1040, [
				"class",
				"label",
				"accessible-label",
				"selected-items",
				"size"
			]), U(kw, {
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
				"popover-style": N(o),
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
}), Pw = /* @__PURE__ */ I((e) => () => U(Nw, G({
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
] }), Fw = {
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
}, Iw = /* @__PURE__ */ I((e) => {
	let { t } = Y(), n = sC(KC), r = tw();
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
			if (t) await WC(t, l, i.expected, e), e.aborted || c(t);
			else {
				let t = await UC(l, e);
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
		let _ = (e) => u.filter((t) => t.equipment_type === e && !t.archived_at_utc), v = (e) => u.find((t) => t.id === e)?.name ?? e, y = (e) => m.includes(e) ? " · " + t("equipment.invalidDevice") : "", b = (e) => U("button", {
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
		return U("form", {
			"aria-busy": f,
			onSubmit: (e) => {
				e.preventDefault(), r.run(h);
			}
		}, [
			U("h2", null, [t("equipment." + (i.id ? "editTrain" : "addTrain"))]),
			U("fieldset", { disabled: f }, [U("legend", null, [t("equipment.basics")]), U("div", { class: "ap-equipment-grid" }, [U(XC, {
				label: t("equipment.fields.name"),
				name: "name",
				value: l.name,
				required: !0,
				error: p,
				onChange: (e) => d({
					...l,
					name: e
				})
			}, null), U(XC, {
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
			U(vw, {
				resource: n.resource.value,
				loadingLabel: t("states.loading"),
				retry: n.refresh,
				renderError: YC,
				renderContent: () => U(R, null, [
					U("fieldset", { disabled: f }, [
						U("legend", null, [t("equipment.components")]),
						["camera_id", "primary_optics_id"].map((e) => {
							let n = e === "camera_id" ? "camera" : "primary_optics";
							return U("div", {
								class: "ap-equipment-picker",
								key: e
							}, [U(XC, {
								label: t("equipment.fields." + e),
								name: e,
								error: p,
								control: (r, i) => U(oC, {
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
						U("h3", null, [t("equipment.fields.accessory_ids")]),
						U("ol", { class: "ap-equipment-list" }, [l.accessory_ids.map((e, n) => U("li", { key: e }, [U("span", null, [
							n + 1,
							W(". "),
							v(e),
							y(e)
						]), U("div", { class: "ap-equipment-actions" }, [
							U("button", {
								type: "button",
								disabled: n === 0,
								onClick: () => g(n, -1)
							}, [t("equipment.moveUp")]),
							U("button", {
								type: "button",
								disabled: n + 1 === l.accessory_ids.length,
								onClick: () => g(n, 1)
							}, [t("equipment.moveDown")]),
							U("button", {
								type: "button",
								onClick: () => d({
									...l,
									accessory_ids: l.accessory_ids.filter((t) => t !== e)
								})
							}, [t("equipment.remove")])
						])]))]),
						U("div", { class: "ap-equipment-picker" }, [U(XC, {
							label: t("equipment.addAccessory"),
							name: "accessory_ids",
							error: p,
							control: (e, n) => U(oC, {
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
					U("fieldset", { disabled: f }, [U("legend", null, [t("equipment.fields.filter_ids")]), U("div", { class: "ap-equipment-picker" }, [U("div", { class: "ap-equipment-field" }, [U(Pw, {
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
					U("small", null, [
						t("equipment.estimate"),
						W(" · "),
						$C(E) ?? t("equipment.unspecified"),
						E !== null && " mm",
						W(" · ƒ/"),
						E !== null && typeof T == "number" ? $C(E / T) : t("equipment.unspecified")
					])
				])
			}, null),
			n.resource.value.state === "ready" && m.length > 0 && U("small", null, [t("equipment.invalidDevice")]),
			U(JC, {
				error: p,
				retry: p?.status === 409 && i.id ? () => void r.run(async (e) => {
					let n = await VC(i.id, e);
					if (n.status === "archived") throw new X("TRAIN_ARCHIVED");
					!e.aborted && await ew(t("equipment.reload"), t("equipment.rebaseTrainConfirm")) && !e.aborted && a({
						...i,
						expected: n.configuration?.draft_version ?? null,
						saved: n.configuration?.draft ?? null
					});
				}) : void 0
			}, null),
			U("div", { class: "ap-equipment-actions" }, [U("button", {
				type: "button",
				disabled: f,
				onClick: s
			}, [t("equipment.cancel")]), U("button", {
				type: "submit",
				class: "ap-equipment-primary",
				disabled: f
			}, [t("equipment.save")])]),
			f && U("small", { role: "status" }, [t("equipment.saving")])
		]);
	};
}, { props: [
	"edit",
	"change",
	"addDevice",
	"cancel",
	"saved"
] });
function Lw(e, t) {
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
var Rw = /* @__PURE__ */ I((e) => {
	let { t } = Y(), n = sC(K(() => {
		let t = e.id;
		return (e) => VC(t, e);
	})), r = tw();
	return () => {
		let { edit: i, changed: a, openDevice: o, deleted: s } = e;
		return U(vw, {
			resource: n.resource.value,
			loadingLabel: t("states.loading"),
			retry: n.refresh,
			renderError: YC,
			renderContent: (e) => {
				let c = e.status === "archived";
				return U(R, null, [
					U("div", { class: "ap-detail-card" }, [
						U("h2", null, [e.name]),
						U("small", null, [t(e.status === "published" ? "equipment.configured" : "equipment.values." + e.status)]),
						U(zw, { train: e }, null)
					]),
					U(Bw, {
						train: e,
						openDevice: o
					}, null),
					U(JC, {
						error: r.error.value,
						retry: r.error.value?.status === 409 ? n.refresh : void 0
					}, null),
					U(_w, {
						editLabel: t("equipment.editTrain"),
						archived: c,
						pending: r.pending.value,
						onEdit: c ? void 0 : () => i(e),
						onArchive: () => void r.run(async (r) => {
							if (!c && !await ew(t("equipment.archive"), t("equipment.archiveTrainConfirm"), e.name) || r.aborted) return;
							let i = await GC(e, r);
							r.aborted || (a(i.status === "archived" ? "archivedReceipt" : "restoredReceipt"), n.refresh());
						}),
						onDelete: () => void r.run(async (n) => {
							await ew(t("equipment.deleteTrain"), t("equipment.deleteTrainConfirm"), e.name, "delete") && !n.aborted && (await HC(e, n), n.aborted || s());
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
] }), zw = /* @__PURE__ */ I((e) => {
	let { t } = Y();
	return () => {
		let { train: n } = e, r = n.configuration?.draft;
		if (!r) return null;
		let i = new Map(n.components?.map((e) => [e.id, e])), a = r.primary_optics_id ? i.get(r.primary_optics_id) : void 0, o = a?.specs.native_focal_length_mm, s = a?.specs.aperture_mm, c = r.accessory_ids.map((e) => i.get(e)?.specs.nominal_factor);
		if (typeof o != "number" || o <= 0 || !c.every((e) => typeof e == "number" && e > 0)) return null;
		let l = c.reduce((e, t) => e * Number(t), o);
		return !Number.isFinite(l) || l <= 0 ? null : U("p", null, [
			t("equipment.estimate"),
			W(" · "),
			$C(l),
			W(" mm"),
			typeof s == "number" && s > 0 && Number.isFinite(l / s) && " · ƒ/" + $C(l / s)
		]);
	};
}, { props: ["train"] }), Bw = /* @__PURE__ */ I((e) => {
	let { t } = Y();
	return () => {
		let { train: n, openDevice: r } = e, i = n.configuration?.draft;
		if (!i) return U("p", null, [t("equipment.noConfiguration")]);
		let a = new Map(n.components?.map((e) => [e.id, e])), o = (e) => e ? a.get(e)?.name ?? e : t("equipment.unspecified"), s = (e) => U(Vw, {
			id: e,
			device: a.get(e),
			openDevice: r
		}, null);
		return U(R, null, [
			U(gw, {
				title: t("equipment.currentConfiguration"),
				initiallyOpen: !0
			}, { default: () => U(R, null, [i.notes && U("p", null, [i.notes]), U("dl", { class: "ap-equipment-definitions" }, [
				U("div", null, [U("dt", null, [t("equipment.fields.camera_id")]), U("dd", null, [o(i.camera_id)])]),
				U("div", null, [U("dt", null, [t("equipment.fields.primary_optics_id")]), U("dd", null, [o(i.primary_optics_id)])]),
				U("div", null, [U("dt", null, [
					t("equipment.fields.accessory_ids"),
					W(" · "),
					i.accessory_ids.length
				]), U("dd", null, [i.accessory_ids.map(o).join(", ") || t("equipment.unspecified")])]),
				U("div", null, [U("dt", null, [
					t("equipment.fields.filter_ids"),
					W(" · "),
					i.filter_ids.length
				]), U("dd", null, [i.filter_ids.map(o).join(", ") || t("equipment.unspecified")])])
			])]) }),
			U(gw, {
				title: t("equipment.componentDetails"),
				count: String([
					i.camera_id,
					i.primary_optics_id,
					...i.accessory_ids
				].filter(Boolean).length)
			}, { default: () => U(R, null, [[
				i.camera_id,
				i.primary_optics_id,
				...i.accessory_ids
			].map((e) => e && U("div", { key: e }, [s(e)]))]) }),
			U(gw, {
				title: t("equipment.fields.filter_ids"),
				count: String(i.filter_ids.length)
			}, { default: () => U(R, null, [i.filter_ids.length ? i.filter_ids.map((e) => U("div", { key: e }, [s(e)])) : U("p", null, [t("equipment.unspecified")])]) })
		]);
	};
}, { props: ["train", "openDevice"] }), Vw = /* @__PURE__ */ I((e) => {
	let { t } = Y();
	return () => {
		let { id: n, device: r, openDevice: i } = e;
		return r ? U("details", null, [
			U("summary", null, [
				r.name,
				W(" · "),
				t("equipment.values." + r.equipment_type),
				r.archived_at_utc && " · " + t("equipment.values.archived")
			]),
			U("button", {
				type: "button",
				onClick: () => i(n)
			}, [r.name]),
			U("small", null, [[r.manufacturer, r.model].filter(Boolean).join(" · ")]),
			r.notes && U("p", null, [r.notes]),
			U(hw, {
				specs: r.specs,
				kind: r.equipment_type
			}, null)
		]) : U("p", null, [
			t("equipment.invalidDevice"),
			W(" · "),
			n
		]);
	};
}, { props: [
	"id",
	"device",
	"openDevice"
] }), Hw = ["devices", "trains"], Uw = () => ({
	id: null,
	expected: null,
	data: Fw,
	saved: null
}), Ww = /* @__PURE__ */ I((e) => {
	let { t } = Y(), n = e.session.current, r = /* @__PURE__ */ M(n?.page ?? { name: "equipment-list" }), i = /* @__PURE__ */ M(n?.deviceInput ?? nw), a = /* @__PURE__ */ j(n?.deviceDirty ?? !1), o = /* @__PURE__ */ M(n?.train ?? Uw()), s = /* @__PURE__ */ M({
		q: "",
		filter: ""
	}), c = /* @__PURE__ */ M({
		q: "",
		filter: ""
	}), l = /* @__PURE__ */ j(0), u = /* @__PURE__ */ j(""), d = /* @__PURE__ */ j(!!n), f = /* @__PURE__ */ j(null), p = K(() => r.value.name.startsWith("train-") ? "trains" : "devices"), m = K(() => r.value.name === "equipment-form" && r.value.quick), h = K(() => a.value || (r.value.name === "train-form" || m.value) && JSON.stringify(o.value.data) !== JSON.stringify(o.value.saved ?? Fw)), g = tw(), _ = /* @__PURE__ */ j(p.value === "trains");
	F([
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
		return !v() && (!h.value || await ew(t("equipment.unsaved"), t("equipment.discardConfirm")));
	}
	async function b() {
		return await y() ? (a.value = !1, o.value = Uw(), r.value = { name: "equipment-list" }, e.session.current = void 0, !0) : !1;
	}
	Vr(() => {
		e.guard.value = b;
	}), je(() => {
		e.guard.value === b && (e.guard.value = null);
	}), F(h, (e, t, n) => {
		if (!e) return;
		let r = (e) => {
			e.preventDefault(), e.returnValue = "";
		};
		window.addEventListener("beforeunload", r), n(() => window.removeEventListener("beforeunload", r));
	}, { immediate: !0 });
	function x() {
		f.value?.querySelector("[data-current=\"true\"]")?.focus({ preventScroll: !0 });
	}
	Vr(x), F(() => r.value.name, x, { flush: "post" });
	function S(e) {
		u.value = e, l.value += 1;
	}
	function C(e) {
		u.value = "", d.value = !1, r.value = e;
	}
	async function w(e) {
		let t = e === "devices" ? "equipment-list" : "train-list";
		r.value.name !== t && await y() && (a.value = !1, o.value = Uw(), e === "trains" && (_.value = !0), C({ name: t }));
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
		} : nw, a.value = !1, C({
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
				...Fw,
				name: e.name,
				notes: e.notes
			} : Fw),
			saved: t
		}, C({ name: "train-form" });
	}
	async function O() {
		if (v()) return;
		let n = r.value;
		if (n.name === "equipment-form" && n.quick) {
			if (a.value && !await ew(t("equipment.unsaved"), t("equipment.discardConfirm"))) return;
			a.value = !1, C({ name: "train-form" });
			return;
		}
		if (!await y()) return;
		let i = o.value.id;
		switch (a.value = !1, o.value = Uw(), e.session.current = void 0, n.name) {
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
	function ee(e) {
		i.value = e, a.value = !0;
	}
	function te(e) {
		a.value = !1, m.value ? (o.value = Lw(o.value, e), C({ name: "train-form" })) : C({
			name: "equipment-detail",
			id: e.id
		}), S("deviceReceipt");
	}
	function k(e) {
		let n = r.value;
		n.name === "equipment-form" && g.run(async (i) => {
			let a = await IC(e.id, i);
			!i.aborted && r.value === n && await ew(t("equipment.reload"), t("equipment.rebaseDeviceConfirm")) && !i.aborted && r.value === n && (r.value = {
				...n,
				original: a
			});
		});
	}
	return () => {
		let n = r.value;
		return U("div", {
			class: "ap-equipment",
			ref: f
		}, [
			U("div", { class: "ap-equipment-heading" }, [U("button", {
				type: "button",
				class: "ap-settings-back",
				onClick: () => void O()
			}, [t("actions.back")]), U("h2", null, [t("modules.equipment.title")])]),
			U(qC, {
				items: Hw,
				active: p.value,
				prefix: "ap-equipment",
				label: t("modules.equipment.title"),
				title: (e) => t("equipment." + e),
				select: (e) => void w(e)
			}, null),
			d.value && U("small", { role: "status" }, [t("equipment.sessionRestored")]),
			u.value && U("small", { role: "status" }, [t("equipment." + u.value)]),
			h.value && U("small", null, [t("equipment.unsaved")]),
			Hw.map((r) => {
				let a = n.name === (r === "devices" ? "equipment-list" : "train-list");
				return U("div", {
					key: r,
					role: "tabpanel",
					id: "ap-equipment-panel-" + r,
					"aria-labelledby": "ap-equipment-tab-" + r,
					class: "ap-equipment-panel",
					hidden: r !== p.value
				}, [U("div", {
					class: "ap-scroll",
					"data-current": r === p.value && a,
					tabindex: -1,
					hidden: !a
				}, [r === "devices" ? U(xw, {
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
				}, null) : e.trainAvailable ? _.value && U(xw, {
					search: c.value,
					setSearch: (e) => {
						c.value = e;
					},
					mode: "trains",
					epoch: l.value,
					open: T,
					add: () => D()
				}, null) : U("p", { role: "status" }, [t("equipment.unavailable")])]), r === p.value && !a && U("div", {
					class: "ap-scroll",
					"data-current": "true",
					tabindex: -1,
					key: n.name
				}, [
					n.name === "equipment-type" && U(R, null, [U("h2", null, [t("equipment.chooseType")]), U("ul", { class: "ap-equipment-list" }, [hC.map((e) => U("li", { key: e }, [U("button", {
						class: "ap-equipment-row",
						type: "button",
						onClick: () => E(e, null)
					}, [U("strong", null, [t("equipment.values." + e)]), U("small", null, [t("equipment.typeHint." + e)])])]))])]),
					n.name === "equipment-form" && U(R, null, [U(pw, {
						kind: n.kind,
						original: n.original,
						input: i.value,
						change: ee,
						saved: te,
						back: () => void O(),
						reload: k
					}, null), U(JC, { error: g.error.value }, null)]),
					n.name === "equipment-detail" && U(yw, {
						key: n.id,
						id: n.id,
						edit: (e) => E(e.equipment_type, e),
						openTrain: T,
						changed: S,
						deleted: () => {
							C({ name: "equipment-list" }), S("deletedReceipt");
						}
					}, null),
					n.name === "train-form" && U(Iw, {
						edit: o.value,
						change: (e) => {
							o.value = e;
						},
						addDevice: (e) => E(e, null, !0),
						cancel: () => void O(),
						saved: (e) => {
							o.value = Uw(), T(e), S("trainReceipt");
						}
					}, null),
					n.name === "train-detail" && U(Rw, {
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
] }), Gw = /* @__PURE__ */ I((e) => {
	let { t } = Y(), n = /* @__PURE__ */ M(e.equipmentSession.current ? "equipment" : null), r = (e) => {
		n.value = e;
	};
	return () => {
		let { status: i, refresh: a, storage: o, refreshStorage: s, equipmentGuard: c, equipmentSession: l, bundles: u } = e, d = n.value, f = (e) => e === "storage" || e === "environment" ? o.state === "ready" ? "available" : "unavailable" : e === "software" ? u.length > 0 && i.state === "ready" && i.data.capabilities.software?.available ? "available" : "unavailable" : e === "equipment" ? i.state === "ready" && i.data.capabilities.equipment?.available ? "available" : "unavailable" : e === "system" ? i.state === "ready" ? "partial" : i.state : "planned";
		return U(R, null, [
			U("div", {
				hidden: d !== null,
				class: "ap-scroll"
			}, [Kv.map((e) => U("button", {
				class: "ap-module",
				key: e,
				onClick: () => r(e)
			}, [
				U("strong", null, [t(`modules.${e}.title`)]),
				U("small", null, [t(`modules.${e}.description`)]),
				U("small", null, [t(`states.${f(e)}`)])
			]))]),
			d === "equipment" && (i.state === "ready" && i.data.capabilities.equipment?.available ? U(Ww, {
				guard: c,
				session: l,
				trainAvailable: !!i.data.capabilities.optical_trains?.available,
				onBack: () => r(null)
			}, null) : U("div", { class: "ap-scroll" }, [
				U("button", {
					type: "button",
					onClick: () => r(null)
				}, [t("actions.back")]),
				U("h2", null, [t("modules.equipment.title")]),
				i.state === "error" ? U(Dv, {
					error: i.error,
					retry: a
				}, null) : U("p", { role: "status" }, [t(i.state === "loading" ? "states.loading" : "equipment.unavailable"), i.state === "ready" && i.data.capabilities.equipment?.reason && U(R, null, [
					" ",
					W("· "),
					U("code", null, [i.data.capabilities.equipment.reason])
				])]),
				U("button", {
					type: "button",
					onClick: a
				}, [t("actions.refresh")])
			])),
			d && d !== "equipment" && U("div", { class: d === "storage" ? "ap-scroll ap-storage-detail" : "ap-scroll" }, [
				U("button", {
					type: "button",
					class: "ap-settings-back",
					onClick: () => r(null)
				}, [t("actions.back")]),
				U("h2", null, [t(`modules.${d}.title`)]),
				d !== "storage" && d !== "software" && d !== "environment" && U(R, null, [U("p", null, [t(`modules.${d}.description`)]), U("p", null, [t(`states.${f(d)}`)])]),
				d === "storage" && U(sb, {
					resource: o,
					refresh: s
				}, null),
				d === "software" && U(cb, { bundles: u }, null),
				d === "environment" && U(mC, { onSaved: s }, null),
				d !== "system" && d !== "storage" && d !== "software" && d !== "environment" && U("p", null, [t(d === "agent" ? "settings.agentNote" : "settings.plannedNote")]),
				d !== "system" && d !== "software" && qv[d] && i.state === "ready" && U("p", null, [
					t("settings.backendCapability"),
					W(": "),
					qv[d],
					W(" —"),
					" ",
					t(i.data.capabilities[qv[d]]?.available ? "states.available" : "states.unavailable")
				]),
				d === "system" && U(R, null, [
					U("button", { onClick: a }, [t("actions.refresh")]),
					i.state === "error" && U(Dv, {
						error: i.error,
						retry: a
					}, null),
					i.state === "loading" && U("p", { role: "status" }, [t("states.loading")]),
					i.state === "ready" && U(R, null, [
						U("dl", null, [
							U("div", null, [U("dt", null, [t("settings.version")]), U("dd", null, [i.data.extension.version])]),
							U("div", null, [U("dt", null, [t("settings.api")]), U("dd", null, [i.data.api_version])]),
							U("div", null, [U("dt", null, [t("settings.status")]), U("dd", null, [i.data.status])]),
							U("div", null, [U("dt", null, [t("settings.nodeRegistered")]), U("dd", null, [t(i.data.runtime.node_registered ? "states.available" : "states.unavailable")])])
						]),
						U("h3", null, [t("settings.capabilities")]),
						Object.entries(i.data.capabilities).map(([e, n]) => U("p", { key: e }, [
							U("code", null, [e]),
							W(" —"),
							" ",
							t(n.available ? "states.available" : "states.unavailable"),
							n.reason && ` (${n.reason})`
						])),
						U("p", null, [t("settings.statusBoundary")])
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
	"bundles"
] });
// src/api/nodes.ts
function Kw(e) {
	if (!Z(e)) throw new X("schema");
	return Object.entries(e).filter(([e, t]) => Z(t) && (t.python_module === "custom_nodes.ComfyUI_AstroPhoto" || e === "vue-basic" && t.python_module === void 0)).map(([e, t]) => {
		let n = t;
		if (typeof n.name != "string" || !Array.isArray(n.output) || !n.output.every((e) => typeof e == "string") || !Z(n.input)) throw new X("schema");
		let r = [];
		for (let e of ["required", "optional"]) {
			let t = n.input[e];
			if (t !== void 0) {
				if (!Z(t)) throw new X("schema");
				for (let [e, n] of Object.entries(t)) {
					if (!Array.isArray(n) || !(typeof n[0] == "string" || Array.isArray(n[0]))) throw new X("schema");
					r.push([e, Array.isArray(n[0]) ? "COMBO" : n[0]]);
				}
			}
		}
		return {
			id: e,
			title: typeof n.display_name == "string" ? n.display_name : e,
			description: typeof n.description == "string" ? n.description : "",
			category: typeof n.category == "string" ? n.category : "",
			aliases: Array.isArray(n.search_aliases) ? n.search_aliases.filter((e) => typeof e == "string") : [],
			inputs: r,
			outputs: n.output.map((e, t) => [Array.isArray(n.output_name) && typeof n.output_name[t] == "string" ? n.output_name[t] : String(t), e])
		};
	});
}
async function qw(e) {
	return Kw(await Tv("/object_info", e));
}
// src/api/status.ts
function Jw(e) {
	if (!Z(e) || !Z(e.extension) || e.extension.id !== "ComfyUI_AstroPhoto" || typeof e.extension.version != "string" || e.api_version !== "v1" || !["ok", "degraded"].includes(String(e.status)) || !Z(e.runtime) || typeof e.runtime.node_registered != "boolean" || typeof e.runtime.routes_registered != "boolean" || !Z(e.capabilities) || !Object.values(e.capabilities).every((e) => Z(e) && typeof e.available == "boolean" && (e.reason === null || typeof e.reason == "string"))) throw new X("schema");
	return e;
}
async function Yw(e) {
	return Jw(await Tv("/astrophoto/v1/status", e));
}
// src/features/sidebar/Sidebar.tsx
var Xw = [
	"nodes",
	"assets",
	"settings"
], Zw = /* @__PURE__ */ I((e) => {
	let { t } = Y(), n = /* @__PURE__ */ M(e.equipmentSession.current ? "settings" : "assets"), r = /* @__PURE__ */ M(null), i = /* @__PURE__ */ M(!1), a = /* @__PURE__ */ M(n.value === "settings"), o = /* @__PURE__ */ I(() => {
		let { resource: e, refresh: t } = sC(qw);
		return s.value = t, () => U(Wv, {
			active: n.value === "nodes",
			resource: e.value,
			refresh: t
		}, null);
	}), s = /* @__PURE__ */ M(), c = /* @__PURE__ */ I(() => {
		let { resource: t, refresh: n } = sC(Yw), { resource: i, refresh: a } = sC(ey, !0);
		return () => U(Gw, {
			equipmentGuard: r,
			equipmentSession: e.equipmentSession,
			bundles: e.bundles,
			status: t.value,
			refresh: n,
			storage: i.value,
			refreshStorage: a
		}, null);
	});
	return () => {
		let e = n.value, l = t("nodes.refresh");
		return U(R, null, [
			U("header", null, [U("strong", null, [t("nav.title")]), e === "nodes" && U("button", {
				class: "ap-refresh-button",
				type: "button",
				onClick: () => s.value?.(),
				"aria-label": l,
				title: l
			}, [U("svg", {
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
				U("path", { d: "M3 12a9 9 0 0 1 9-9a9.75 9.75 0 0 1 6.74 2.74L21 8" }, null),
				U("path", { d: "M21 3v5h-5m5 4a9 9 0 0 1-9 9a9.75 9.75 0 0 1-6.74-2.74L3 16" }, null),
				U("path", { d: "M8 16H3v5" }, null)
			])])]),
			U(qC, {
				items: Xw,
				active: e,
				prefix: "ap",
				label: t("nav.label"),
				title: (e) => t("nav." + e),
				select: (t) => {
					(async () => {
						t === e || e === "settings" && r.value && !await r.value() || (t === "nodes" && (i.value = !0), t === "settings" && (a.value = !0), n.value = t);
					})();
				}
			}, null),
			Xw.map((t) => U("section", {
				key: t,
				id: `ap-panel-${t}`,
				role: "tabpanel",
				"aria-labelledby": `ap-tab-${t}`,
				hidden: e !== t
			}, [t === "nodes" ? i.value && U(o, null, null) : t === "assets" ? U(Gv, null, null) : a.value && U(c, null, null)]))
		]);
	};
}, { props: ["equipmentSession", "bundles"] }), Qw = { "vue-basic": {
	title: "Vue Basic Example",
	pen: "Pen",
	"restore-error": "Unable to restore the saved drawing. Check the image data in the workflow.",
	"clear-canvas": "Clear Canvas",
	"brush-size": "Brush Size",
	"pen-tooltip": "this is a pen"
} }, $w = { "vue-basic": {
	title: "Vue基础示例",
	pen: "铅笔",
	"pen-tooltip": "使用画笔绘图",
	"restore-error": "无法恢复保存的画板内容，请检查工作流中的图片数据。",
	"clear-canvas": "清除画布",
	"brush-size": "笔刷大小"
} }, eT = {
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
		addNamed: "Add {name} to canvas",
		registered: "Registered in ComfyUI.",
		inputs: "Inputs",
		outputs: "Outputs",
		dependencies: "Registration does not confirm external software availability.",
		helpUnavailable: "Dedicated documentation is not available for this node.",
		created: "Node created. Save the workflow using ComfyUI."
	},
	assets: { placeholder: "The assets page will be available in a future release." },
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
			INSUFFICIENT_DISK_SPACE: "The target volume has insufficient space.",
			WORKSPACE_OFFLINE: "The workspace is offline.",
			WORKSPACE_READ_ONLY: "The workspace is read only.",
			WORKSPACE_IDENTITY_MISMATCH: "The workspace identity does not match.",
			SOURCE_CHANGED: "The source file changed during this operation.",
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
}, tT = {
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
		addNamed: "将 {name} 添加到画布",
		registered: "已在 ComfyUI 中注册。",
		inputs: "输入",
		outputs: "输出",
		dependencies: "节点注册不代表外部软件可用。",
		helpUnavailable: "此节点暂未提供专用文档。",
		created: "节点已创建。请使用 ComfyUI 保存工作流。"
	},
	assets: { placeholder: "素材页将在后续版本提供。" },
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
			INSUFFICIENT_DISK_SPACE: "目标卷可用空间不足。",
			WORKSPACE_OFFLINE: "工作区已离线。",
			WORKSPACE_READ_ONLY: "工作区为只读状态。",
			WORKSPACE_IDENTITY_MISMATCH: "工作区身份不匹配。",
			SOURCE_CHANGED: "操作过程中源文件发生了变化。",
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
};
// src/i18n/index.ts
function nT(e) {
	return typeof e == "string" && /^zh(?:-|_|$)/i.test(e) ? "zh" : "en";
}
function rT(e = []) {
	return _f({
		legacy: !1,
		locale: "en",
		fallbackLocale: "en",
		messages: {
			en: Object.assign({}, Qw, eT, ...e.map((e) => e.messages.en)),
			zh: Object.assign({}, $w, tT, ...e.map((e) => e.messages.zh))
		}
	});
}
// src/host/locale.ts
function iT(e, t, n) {
	let r = () => n(nT(e.extensionManager.setting.get("Comfy.Locale") || navigator.language)), i = () => {
		t.getClientRects().length && !document.hidden && r();
	};
	r();
	let a = window.setInterval(i, 500);
	return window.addEventListener("focus", i), () => {
		window.clearInterval(a), window.removeEventListener("focus", i);
	};
}
// src/host/sidebar.ts
var aT = "astrophoto.sidebar";
function oT(e, t) {
	if (e.extensionManager.getSidebarTabs().some((e) => e.id === "astrophoto.sidebar")) return;
	let n = {}, r, i, a, o, s = () => {
		o?.(), r?.unmount(), i?.remove(), a?.classList.remove("astrophoto-host-container"), o = r = i = a = void 0;
	};
	e.extensionManager.registerSidebarTab({
		id: aT,
		title: "AstroPhoto",
		tooltip: "AstroPhoto",
		icon: "astrophoto-sidebar-icon",
		type: "custom",
		render(c) {
			if (r && i?.parentElement === c) return;
			s(), a = c, c.classList.add("astrophoto-host-container"), i = document.createElement("div"), i.className = "astrophoto-ui", c.appendChild(i);
			let l = rT(t);
			o = iT(e, i, (e) => {
				l.global.locale.value = e;
			}), r = _s(Zw, {
				equipmentSession: n,
				bundles: t
			}), r.use(l).mount(i);
		},
		destroy: s
	});
}
// src/features/drawing/ToolBar.vue?vue&type=script&setup=true&lang.ts
var sT = { class: "toolbar" }, cT = ["title", "aria-pressed"], lT = { class: "color-picker" }, uT = [
	"onClick",
	"title",
	"aria-label",
	"aria-pressed"
], dT = { class: "size-slider" }, fT = ["value"], pT = /*@__PURE__*/ I({
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
		let { t: n } = Y(), r = e, i = t, a = r.colors || [
			"#000000",
			"#ff0000",
			"#0000ff",
			"#69a869",
			"#ffff00",
			"#ff00ff",
			"#00ffff"
		], o = /* @__PURE__ */ j(r.initialColor || "#000000"), s = /* @__PURE__ */ j(r.initialBrushSize || 5), c = /* @__PURE__ */ j(r.initialTool || "pen");
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
		return (e, t) => (z(), B(R, null, [
			H("div", sT, [H("button", {
				type: "button",
				title: N(n)("vue-basic.pen-tooltip"),
				"aria-pressed": c.value === "pen",
				class: _e({ active: c.value === "pen" }),
				onClick: t[0] ||= (e) => l("pen")
			}, A(N(n)("vue-basic.pen")), 11, cT), H("button", {
				type: "button",
				onClick: d
			}, A(N(n)("vue-basic.clear-canvas")), 1)]),
			H("div", lT, [(z(!0), B(R, null, ti(N(a), (e, t) => (z(), B("button", {
				key: t,
				class: _e({
					"color-button": !0,
					active: o.value === e
				}),
				onClick: (t) => u(e),
				type: "button",
				title: e,
				"aria-label": e,
				"aria-pressed": o.value === e
			}, [H("span", {
				class: "color-swatch",
				style: fe({ backgroundColor: e }),
				"aria-hidden": "true"
			}, null, 4)], 10, uT))), 128))]),
			H("div", dT, [H("label", null, A(N(n)("vue-basic.brush-size")) + ": " + A(s.value) + "px", 1), H("input", {
				type: "range",
				min: "1",
				max: "50",
				value: s.value,
				onChange: t[1] ||= (e) => f(e)
			}, null, 40, fT)])
		], 64));
	}
}), mT = (e, t) => {
	let n = e.__vccOpts || e;
	for (let [e, r] of t) n[e] = r;
	return n;
}, hT = /*#__PURE__*/ mT(pT, [["__scopeId", "data-v-9605a2a8"]]), gT = { class: "drawing-board" }, _T = { class: "canvas-container" }, vT = ["width", "height"], yT = /*#__PURE__*/ mT(/* @__PURE__ */ I({
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
		let r = e, i = r.width || 800, a = r.height || 500, o = r.initialColor || "#000000", s = r.initialBrushSize || 5, c = n, l = /* @__PURE__ */ j(!1), u = /* @__PURE__ */ j(0), d = /* @__PURE__ */ j(0), f = /* @__PURE__ */ j(null), p = /* @__PURE__ */ j(!1), m = /* @__PURE__ */ j(s), h = /* @__PURE__ */ j(o), g = /* @__PURE__ */ j(null), _ = /* @__PURE__ */ j(null), v = 0;
		Wr(() => {
			v++;
		}), Vr(() => {
			_.value && (f.value = _.value.getContext("2d"), y(), Ln(() => {
				_.value && c("mounted", _.value);
			}));
		});
		function y() {
			f.value && (f.value.fillStyle = "#ffffff", f.value.fillRect(0, 0, i, a), b(), k());
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
			l.value && (l.value = !1, k(!0), c("drawing-end"));
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
		function ee(e) {
			m.value = e, b();
		}
		function te() {
			f.value && (f.value.fillStyle = "#ffffff", f.value.fillRect(0, 0, i, a), b(), k(!0), c("canvas-clear"));
		}
		function k(e = !1) {
			v++, _.value && (g.value = _.value.toDataURL("image/png"), g.value && c("state-save", g.value, e));
		}
		async function ne() {
			if (!_.value) throw Error("Canvas is unable to get current data");
			return g.value ? g.value : _.value.toDataURL("image/png");
		}
		async function re(e) {
			if (!e.startsWith("data:image/png;base64,")) throw Error("Invalid saved PNG");
			let t = ++v, n = new Image();
			if (n.src = e, await n.decode(), t === v && f.value) {
				if (n.width !== i || n.height !== a) throw Error("Invalid saved canvas size");
				f.value.save(), f.value.globalCompositeOperation = "source-over", f.value.clearRect(0, 0, i, a), f.value.drawImage(n, 0, 0), f.value.restore(), k();
			}
		}
		return t({
			restoreCanvas: re,
			setTool: D,
			setColor: O,
			setBrushSize: ee,
			clearCanvas: te,
			getCurrentCanvasData: ne
		}), (e, t) => (z(), B("div", gT, [H("div", _T, [H("canvas", {
			ref_key: "canvas",
			ref: _,
			width: N(i),
			height: N(a),
			onMousedown: x,
			onMousemove: S,
			onMouseup: C,
			onMouseleave: C,
			onTouchstart: T,
			onTouchmove: E,
			onTouchend: C
		}, null, 40, vT)])]));
	}
}), [["__scopeId", "data-v-1fba2252"]]), bT = { class: "drawing-app" }, xT = /*#__PURE__*/ mT(/* @__PURE__ */ I({
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
		], l = n, u = /* @__PURE__ */ j(null), d = /* @__PURE__ */ j(null);
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
		}), (e, t) => (z(), B("div", bT, [U(hT, {
			colors: N(c),
			initialColor: N(o),
			initialBrushSize: N(s),
			onToolChange: f,
			onColorChange: p,
			onBrushSizeChange: m,
			onCanvasClear: h
		}, null, 8, [
			"colors",
			"initialColor",
			"initialBrushSize"
		]), U(yT, {
			ref_key: "drawingBoard",
			ref: u,
			width: N(i),
			height: N(a),
			initialColor: N(o),
			initialBrushSize: N(s),
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
}), [["__scopeId", "data-v-d8cc17f7"]]), ST = {
	key: 0,
	role: "alert"
}, CT = /* @__PURE__ */ I({
	__name: "VueExampleComponent",
	props: { widget: {} },
	setup(t) {
		let { t: r } = Y(), i = /* @__PURE__ */ j(null), a = /* @__PURE__ */ j(null), o = t.widget, s = /* @__PURE__ */ j(!1), c = (e) => {
			if (!e || typeof e != "object") return { image: null };
			let t = e;
			return {
				image: typeof t.image == "string" ? t.image : null,
				...typeof t.canvasDataURL == "string" ? { canvasDataURL: t.canvasDataURL } : {}
			};
		}, l = /* @__PURE__ */ M(c(o.value));
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
		return Vr(() => {
			u = !0, !l.value.canvasDataURL && a.value && f(a.value), F(() => l.value.canvasDataURL, (e) => {
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
		}), (e, t) => (z(), B("div", null, [
			H("h1", null, A(N(r)("vue-basic.title")), 1),
			H("div", null, [U(xT, {
				ref_key: "drawingAppRef",
				ref: i,
				width: 300,
				height: 300,
				onStateSave: f
			}, null, 512)]),
			s.value ? (z(), B("p", ST, A(N(r)("vue-basic.restore-error")), 1)) : za("", !0)
		]));
	}
}), wT = /* @__PURE__ */ new WeakMap(), TT = /* @__PURE__ */ new WeakSet();
function ET(e, t) {
	return JSON.stringify([
		e.graph?.id,
		e.id,
		t
	]);
}
function DT(e) {
	let { node: t, element: n, name: r } = e;
	wT.set(e, n), TT.add(n);
	let i = () => {
		n.dataset.astrophotoWidgetOwner = ET(t, r);
	};
	t.graph && i();
	let a = t.onAdded;
	t.onAdded = function(e) {
		a?.call(this, e), i();
	};
}
function OT(e) {
	requestAnimationFrame(() => {
		let t = e.canvas?.graph;
		if (!t) return;
		let n = /* @__PURE__ */ new Map();
		for (let e of document.querySelectorAll("[data-astrophoto-widget-owner]")) TT.has(e) && n.set(e.dataset.astrophotoWidgetOwner, e);
		for (let e of t.nodes) for (let t of e.widgets ?? []) {
			let r = wT.get(t);
			if (!r || r.isConnected) continue;
			let i = ET(e, t.name), a = n.get(i);
			if (a?.isConnected) {
				r.dataset.astrophotoWidgetOwner = i;
				for (let e of a.classList) r.classList.add(e);
				a.replaceWith(r);
			}
		}
	});
}
// src/host/drawing.ts
function kT(e) {
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
				DT(r);
				let i = rT(), a = iT(e, n, (e) => {
					i.global.locale.value = e;
				}), o = _s(CT, { widget: r });
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
var AT = /^[a-f0-9]{8}-(?:[a-f0-9]{4}-){3}[a-f0-9]{12}$/;
async function jT(e) {
	let t = [], n = "";
	do {
		let r = await Tv("/astrophoto/v1/fits/assets?after=" + n, e);
		if (!Z(r) || !Array.isArray(r.assets) || r.assets.some((e) => !Z(e) || typeof e.id != "string" || !AT.test(e.id) || typeof e.name != "string") || r.next !== null && (typeof r.next != "string" || !AT.test(r.next) || r.next <= n)) throw new X("schema");
		t.push(...r.assets), n = r.next ?? "";
	} while (n);
	return t;
}
// src/host/mountWidget.ts
function MT(e, t, n, r, i = []) {
	let a = rT(i), o = iT(e, t, (e) => {
		a.global.locale.value = e;
	}), s = _s(n, r);
	return s.use(a).mount(t), () => {
		o(), s.unmount();
	};
}
// src/host/fitsSource.tsx
var NT = /* @__PURE__ */ I((e) => {
	let { t } = Y(), n = /* @__PURE__ */ M([]), r = /* @__PURE__ */ j("loading"), i = /* @__PURE__ */ j(0);
	F(i, (e, t, i) => {
		let a = new AbortController();
		i(() => a.abort()), r.value = "loading", jT(a.signal).then((e) => {
			a.signal.aborted || (n.value = e, r.value = "ready");
		}, (e) => {
			a.signal.aborted || (r.value = e instanceof X ? e.code : "network");
		});
	}, { immediate: !0 });
	let a = (t) => e.select(t.currentTarget.value);
	return () => U(R, null, [
		U("select", {
			"aria-label": t("fits.fitsAsset"),
			value: e.source,
			onChange: a
		}, [
			U("option", { value: "" }, [t(r.value === "loading" ? "states.loading" : "fits.fitsAsset")]),
			e.source && !n.value.some((t) => t.id === e.source) && U("option", { value: e.source }, [/^[a-f0-9-]{36}$/.test(e.source) ? `${t("fits.unavailableAsset")} · ${e.source}` : e.source]),
			n.value.map((e) => U("option", {
				key: e.id,
				value: e.id
			}, [
				e.name,
				W(" · "),
				e.id.slice(0, 8)
			]))
		]),
		U("label", null, [t("fits.serverFitsPath"), U("input", {
			type: "text",
			value: e.source,
			placeholder: t("fits.serverFitsPathHint"),
			onInput: a
		}, null)]),
		r.value !== "loading" && r.value !== "ready" && U("small", { role: "alert" }, [t("errors." + r.value, r.value)]),
		U("button", {
			type: "button",
			onClick: () => {
				i.value += 1;
			}
		}, [t("fits.refreshAssets")])
	]);
}, { props: ["source", "select"] });
function PT(e) {
	e.registerExtension({
		name: "AstroPhoto.ScientificNodes",
		getCustomWidgets() {
			return { ASTRO_FITS_ASSET(t, n) {
				let r = /* @__PURE__ */ j(""), i = document.createElement("div");
				i.className = "astrophoto-ui ap-fits-source-widget";
				let a = t.addDOMWidget(n, "astrophoto-fits-asset", i, {
					getMinHeight: () => 145,
					getHeight: () => 145,
					getValue: () => r.value,
					setValue: (e) => {
						r.value = e;
					}
				});
				DT(a);
				let o = MT(e, i, /* @__PURE__ */ I(() => () => U(NT, {
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
function FT(e) {
	if (Array.from(document.querySelectorAll("link[rel=\"stylesheet\"]")).some((t) => t.href === e.href)) return;
	let t = document.createElement("link");
	t.rel = "stylesheet", t.href = e.href, document.head.appendChild(t);
}
// src/main.ts
function IT(e, t) {
	FT(new URL(
		/* @vite-ignore */
		"./assets/main.css",
		import.meta.url
	)), kT(e), PT(e), e.registerExtension({
		name: "AstroPhoto.Sidebar",
		setup() {
			oT(e, t), hb().catch(() => {});
		},
		afterConfigureGraph() {
			OT(e);
		}
	});
	for (let n of t) n.registerNodes(e, t);
}
// ../extension/siril/frontend/api.ts
var LT = "/astrophoto/v1/software/siril", RT = /^[a-f0-9]{8}-(?:[a-f0-9]{4}-){3}[a-f0-9]{12}$/, zT = "/astrophoto/v1/previews", BT = {
	shadowsclip: -2.8,
	targetbg: .25,
	linked: !0
}, VT = (e, t) => Tv(zT + "/jobs/" + e + "/validate", t);
function HT(e) {
	if (!Z(e) || typeof e.os != "string" || typeof e.state != "string" || typeof e.enabled != "boolean" || e.target_version !== "1.4.5" || e.state === "ready" && (typeof e.path != "string" || e.version !== "1.4.5" || typeof e.verified_at != "string")) throw new X("schema");
	return e;
}
var UT = async (e) => HT(await Tv(LT, e)), WT = async (e, t) => HT(await Ev(LT, "PUT", { path: e }, t, 3e4)), GT = async (e) => HT(await Ev(LT, "DELETE", void 0, e)), KT = async (e, t) => HT(await Ev(LT + "/enabled", "PUT", { enabled: e }, t));
async function qT(e) {
	let t = await Ev(LT + "/discover", "POST", void 0, e, 195e3);
	if (!Z(t) || !Array.isArray(t.candidates) || t.candidates.some((e) => !Z(e) || typeof e.path != "string" || typeof e.origin != "string" || typeof e.state != "string")) throw new X("schema");
	return t.candidates;
}
function JT(e) {
	return new Promise((t, n) => {
		let r = () => {
			clearTimeout(i), n(new DOMException("Aborted", "AbortError"));
		}, i = setTimeout(() => {
			e.removeEventListener("abort", r), t();
		}, 350);
		e.aborted ? r() : e.addEventListener("abort", r, { once: !0 });
	});
}
async function YT(e, n, r) {
	let i = await t.api.fetchApi(e + "/" + n, {
		signal: r,
		headers: { "X-AstroPhoto-Local": "1" }
	});
	if (!i.ok || i.headers.get("content-type")?.split(";")[0] !== "image/png") throw new X("PREVIEW_STALE");
	let a = await i.blob();
	return URL.createObjectURL(a);
}
async function XT(e, t, n, r, i) {
	let a = await Ev(zT + "/autostretch", "POST", {
		...RT.test(e) ? { asset_id: e } : { image_path: e },
		owner: t,
		parameters: n,
		...i ? { formal_id: i } : {}
	});
	if (!Z(a) || typeof a.job_id != "string" || !RT.test(a.job_id)) throw new X("schema");
	let o = zT + "/jobs/" + a.job_id, s = () => {
		Ev(o + "/cancel", "POST").catch(() => {});
	}, c, l;
	if (r.aborted) throw s(), new DOMException("Aborted", "AbortError");
	r.addEventListener("abort", s, { once: !0 });
	try {
		for (; !r.aborted;) {
			let e = await Tv(o, r);
			if (!Z(e)) throw new X("schema");
			if (e.state === "queued" || e.state === "running") await JT(r);
			else {
				if (![
					"ready",
					"failed",
					"cancelled"
				].includes(String(e.state))) throw new X("schema");
				if (e.before === !0 && (c = await YT(o, "before", r)), e.after === !0 && (l = await YT(o, "after", r)), r.aborted) break;
				return {
					state: String(e.state),
					before: c,
					after: l,
					aligned: e.aligned === !0,
					formal: e.formal === !0,
					jobId: a.job_id,
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
		throw c && URL.revokeObjectURL(c), l && URL.revokeObjectURL(l), s(), e;
	} finally {
		r.removeEventListener("abort", s);
	}
}
// src/features/nodes/preview/PanelDivider.tsx
var ZT = /* @__PURE__ */ I((e) => {
	let t;
	return () => {
		let { axis: n, value: r, min: i, max: a, label: o, controls: s, onChange: c } = e, l = n === "x", u = (e) => c(Math.max(i, Math.min(a, e)));
		return U("div", G({
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
] }), QT = [
	"side",
	"wipe",
	"single"
], $T = {
	side: "M3 5h18v14H3z M12 5v14",
	wipe: "M3 5h18v14H3z M12 2v20 M8 12h8",
	single: "M3 5h18v14H3z M7 9h10v6H7z"
}, eE = (e, t, n) => Math.max(t, Math.min(n, e)), tE = /* @__PURE__ */ I((e) => {
	let { t } = Y(), n = /* @__PURE__ */ j(null), r = /* @__PURE__ */ j(null), i = Tr(), a = /* @__PURE__ */ j(73), o = (e) => {
		a.value = e;
	}, s = /* @__PURE__ */ j(50), c = (e) => {
		s.value = e;
	}, l = /* @__PURE__ */ j("side"), u = (e) => {
		l.value = e;
	}, d = /* @__PURE__ */ j("after"), f = (e) => {
		d.value = e;
	}, p = /* @__PURE__ */ j(50), m = (e) => {
		p.value = e;
	}, h = /* @__PURE__ */ j(1), g = (e) => {
		h.value = e;
	}, _ = /* @__PURE__ */ j(!1), v = (e) => {
		_.value = e;
	}, y = /* @__PURE__ */ j({
		x: 0,
		y: 0
	}), b = (e) => {
		y.value = e;
	}, x, S;
	return Vr(() => {
		S = document.activeElement;
		let e = n.value;
		e && !e.open && (typeof e.show == "function" ? e.show() : e.setAttribute("open", "")), r.value?.focus();
	}), Gr(() => {
		S?.isConnected && S.focus();
	}), () => {
		let { preview: S, title: C, description: w, details: T, parameters: E, status: D, onRefresh: O, onReset: ee, onClose: te } = e, k = !!(S?.before && S.after && S.aligned), ne = l.value === "wipe" && !k ? "side" : l.value;
		function re(e) {
			e.button === 0 && e.isPrimary && (e.preventDefault(), e.currentTarget.setPointerCapture(e.pointerId), x = {
				id: e.pointerId,
				x: e.clientX,
				y: e.clientY,
				ox: y.value.x,
				oy: y.value.y
			});
		}
		function ie(e) {
			let t = x;
			t?.id === e.pointerId && b({
				x: t.ox + e.clientX - t.x,
				y: t.oy + e.clientY - t.y
			});
		}
		function ae(e) {
			let t = e.currentTarget.parentElement?.getBoundingClientRect();
			t?.width && m(eE((e.clientX - t.left) * 100 / t.width, 0, 100));
		}
		let oe = () => {
			v(!1), b({
				x: 0,
				y: 0
			}), g(1);
		}, se = () => {
			oe(), v(!0);
		}, ce = (e) => g(eE(h.value * e, .1, 16));
		function le(e, n) {
			let r = S?.[e];
			return U("div", {
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
			}, [r ? U("img", {
				src: r,
				alt: t("nodePreview." + e),
				draggable: !1
			}, null) : U("span", null, [t("nodePreview.noImage")])]);
		}
		function ue(e) {
			return U("div", G({
				class: "ap-inspector-pane",
				key: e,
				onPointerdown: re,
				onPointermove: ie
			}, { onLostpointercapture: () => {
				x = void 0;
			} }), [le(e), U("span", { class: "ap-inspector-label" }, [t("nodePreview." + e)])]);
		}
		return U(vr, { to: "body" }, { default: () => [U("dialog", G({
			ref: n,
			class: "astrophoto-ui ap-inspector",
			"aria-label": t("nodePreview.compare")
		}, { onCancel: te }, { onKeydown: (e) => {
			e.stopPropagation(), e.key === "Escape" && (e.preventDefault(), te());
		} }), [U("header", null, [U("div", { class: "ap-inspector-title" }, [U("strong", null, [C]), w && U(nE, { text: w }, null)]), U("button", {
			ref: r,
			type: "button",
			title: t("nodePreview.close"),
			"aria-label": t("nodePreview.close"),
			onClick: te
		}, [U("svg", {
			width: "16",
			height: "16",
			viewBox: "0 0 24 24",
			fill: "none",
			stroke: "currentColor",
			"aria-hidden": "true"
		}, [U("path", { d: "m6 6 12 12M18 6 6 18" }, null)])])]), U("div", {
			class: "ap-inspector-layout",
			style: { "--ap-view-share": a.value + "%" }
		}, [
			U("section", {
				id: i + "-view",
				class: "ap-inspector-view"
			}, [
				U("div", { class: "ap-inspector-toolbar" }, [U("div", { class: "ap-inspector-modes" }, [QT.map((e) => U("button", {
					key: e,
					type: "button",
					title: t("nodePreview." + e),
					"aria-label": t("nodePreview." + e),
					"aria-pressed": ne === e,
					disabled: e === "wipe" && !k,
					onClick: () => u(e)
				}, [U("svg", {
					width: "16",
					height: "16",
					viewBox: "0 0 24 24",
					fill: "none",
					stroke: "currentColor",
					"aria-hidden": "true"
				}, [U("path", { d: $T[e] }, null)])]))]), U("div", { class: "ap-inspector-zoom" }, [
					O && U("button", {
						type: "button",
						"aria-label": t("actions.refresh"),
						title: t("actions.refresh"),
						onClick: O
					}, [U("span", { "aria-hidden": "true" }, [W("↻")])]),
					ne === "single" && U("button", {
						type: "button",
						onClick: () => f(d.value === "before" ? "after" : "before")
					}, [t(d.value === "before" ? "nodePreview.after" : "nodePreview.before")]),
					U("button", {
						type: "button",
						title: t("nodePreview.zoomOut"),
						"aria-label": t("nodePreview.zoomOut"),
						onClick: () => ce(.8)
					}, [W("−")]),
					U("button", {
						type: "button",
						onClick: se,
						"aria-pressed": _.value
					}, [_.value ? Math.round(h.value * 100) + "%" : "100%"]),
					U("button", {
						type: "button",
						title: t("nodePreview.zoomIn"),
						"aria-label": t("nodePreview.zoomIn"),
						onClick: () => ce(1.25)
					}, [W("+")]),
					U("button", {
						type: "button",
						onClick: oe
					}, [t("nodePreview.fit")])
				])]),
				U("div", {
					class: "ap-inspector-images",
					"data-mode": ne,
					onDragstart: (e) => e.preventDefault(),
					onWheel: (e) => {
						e.stopPropagation(), ce(e.deltaY < 0 ? 1.12 : 1 / 1.12);
					}
				}, [
					ne === "side" && U(R, null, [ue("before"), ue("after")]),
					ne === "single" && ue(d.value),
					ne === "wipe" && U("div", G({
						class: "ap-inspector-pane",
						onPointerdown: re,
						onPointermove: ie
					}, { onLostpointercapture: () => {
						x = void 0;
					} }), [
						le("after"),
						le("before", `inset(0 ${100 - p.value}% 0 0)`),
						U("span", { class: "ap-inspector-label" }, [t("nodePreview.before")]),
						U("span", { class: "ap-inspector-label ap-inspector-end" }, [t("nodePreview.after")]),
						U("div", {
							class: "ap-inspector-divider",
							style: { left: p.value + "%" },
							tabindex: 0,
							role: "slider",
							"aria-label": t("nodePreview.wipe"),
							"aria-valuemin": 0,
							"aria-valuemax": 100,
							"aria-valuenow": Math.round(p.value),
							onPointerdown: (e) => {
								e.stopPropagation(), e.button === 0 && e.isPrimary && (e.preventDefault(), e.currentTarget.focus(), e.currentTarget.setPointerCapture(e.pointerId), ae(e));
							},
							onPointermove: (e) => {
								e.stopPropagation(), e.currentTarget.hasPointerCapture(e.pointerId) && ae(e);
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
								e.key in t && (e.preventDefault(), e.stopPropagation(), m(eE(t[e.key], 0, 100)));
							}
						}, null)
					])
				]),
				!k && S?.before && S.after && U("small", null, [t("nodePreview.unaligned")])
			]),
			U(ZT, {
				axis: "x",
				label: t("nodePreview.adjustWidth"),
				controls: i + "-view",
				value: a.value,
				min: 40,
				max: 80,
				onChange: o
			}, null),
			U("aside", {
				class: "ap-inspector-info",
				style: { "--ap-analysis-share": s.value + "%" }
			}, [
				U("section", { id: i + "-analysis" }, [U("h3", null, [t("nodePreview.analysis")]), U("p", null, [t("nodePreview.analysisEmpty")])]),
				U(ZT, {
					axis: "y",
					label: t("nodePreview.adjustHeight"),
					controls: i + "-analysis",
					value: s.value,
					min: 15,
					max: 75,
					onChange: c
				}, null),
				U("section", null, [
					U("div", { class: "ap-inspector-parameters-header" }, [U("h3", null, [t(E ? "nodePreview.parameters" : "nodePreview.readonly")]), ee && U("button", {
						type: "button",
						title: t("nodePreview.reset"),
						"aria-label": t("nodePreview.reset"),
						onClick: ee
					}, [U("span", { "aria-hidden": "true" }, [W("↶")])])]),
					E,
					(!!T?.length || D) && U("dl", null, [T?.map(({ label: e, value: t }) => U("div", {
						class: "ap-inspector-value",
						key: e
					}, [U("dt", null, [e]), U("dd", null, [t])])), D && U(R, null, [U("dt", null, [t("nodePreview.status")]), U("dd", { role: "status" }, [D])])])
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
function nE({ text: e }) {
	return U("span", {
		class: "ap-inspector-help",
		role: "img",
		tabindex: 0,
		"aria-label": e,
		title: e
	}, [U("span", { "aria-hidden": "true" }, [W("ⓘ")])]);
}
// src/features/nodes/preview/NodePreview.tsx
var rE = /* @__PURE__ */ I((e) => {
	let { t } = Y(), n = Tr();
	return () => {
		let { expanded: r, images: i, status: a, badge: o, imageClassName: s = "", onToggle: c, onCompare: l, onRefresh: u, onReset: d } = e, f = t("actions.refresh"), p = t("nodePreview.reset");
		return U(R, null, [U("div", { class: "ap-node-preview-toolbar" }, [
			U("button", {
				type: "button",
				"aria-controls": n,
				"aria-expanded": r,
				onClick: c
			}, [U("svg", {
				viewBox: "0 0 24 24",
				"aria-hidden": "true"
			}, [U("path", { d: "m9 6 6 6-6 6" }, null)]), t("nodePreview.preview")]),
			U("button", {
				class: "ap-node-compare",
				type: "button",
				"aria-haspopup": "dialog",
				"aria-label": t("nodePreview.openImage"),
				title: t("nodePreview.openImage"),
				onClick: l
			}, [U("svg", {
				viewBox: "0 0 24 24",
				"aria-hidden": "true"
			}, [U("path", { d: "M3 4h18v16H3z M3 16l5-5 4 4 3-3 6 5" }, null)])]),
			u && U("button", {
				type: "button",
				title: f,
				"aria-label": f,
				onClick: u
			}, [U("svg", {
				viewBox: "0 0 24 24",
				"aria-hidden": "true"
			}, [U("path", { d: "M20 7v5h-5M4 17v-5h5M5.5 8a7 7 0 0 1 11-2l3.5 6m-16 0 3.5 6a7 7 0 0 0 11-2" }, null)])]),
			d && U("button", {
				type: "button",
				title: p,
				"aria-label": p,
				onClick: d
			}, [U("svg", {
				viewBox: "0 0 24 24",
				"aria-hidden": "true"
			}, [U("path", { d: "M3 11h5M3 11V6m0 5 4-4a7 7 0 1 1-1 10" }, null)])])
		]), U("div", {
			id: n,
			class: `ap-canvas-preview ${s}`,
			hidden: !r
		}, [r && (i?.after ? U(R, null, [U("img", {
			src: i.after,
			width: i.width,
			height: i.height,
			alt: t("nodePreview.after"),
			draggable: !1
		}, null), o && U("small", { class: "ap-node-preview-badge" }, [o])]) : U("span", { role: "status" }, [a]))])]);
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
] }), iE = "AstroPhotoFITSSource", aE = "AstroPhotoImagePath", oE = "AstroPhotoSirilAutoStretch", sE = /* @__PURE__ */ new WeakMap();
function cE() {
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
function lE(e) {
	let t = (t) => e.widgets?.find((e) => e.name === t);
	return {
		shadowsclip: Number(t("shadowsclip")?.value ?? BT.shadowsclip),
		targetbg: Number(t("targetbg")?.value ?? BT.targetbg),
		linked: t("linked")?.value !== !1
	};
}
function uE(e, t = /* @__PURE__ */ new Set()) {
	if (t.has(e)) return "";
	t.add(e);
	let n = e.getInputNode(0);
	if (n?.comfyClass === iE) return String(n.widgets?.find((e) => e.name === "asset_id")?.value || "");
	if (n?.comfyClass === aE) return String(n.widgets?.find((e) => e.name === "image_path")?.value || "");
	if (n?.comfyClass === oE) {
		let e = sE.get(n);
		if (e?.verifiedSource && e.key === JSON.stringify(lE(n)) && e.verifiedSource === uE(n, t)) return e.asset;
	}
	return "";
}
function dE(e) {
	e?.before && URL.revokeObjectURL(e.before), e?.after && URL.revokeObjectURL(e.after);
}
var fE = /* @__PURE__ */ I((e) => {
	let { t } = Y(), { node: n, execution: r, canvas: i } = e, a = cE(), o = /* @__PURE__ */ j(!0), s = /* @__PURE__ */ j(!1), c = /* @__PURE__ */ j(0), l = /* @__PURE__ */ M({
		asset: "",
		key: JSON.stringify(lE(n)),
		formal: "",
		connected: !1
	}), u = /* @__PURE__ */ M(), d = /* @__PURE__ */ M(), f = /* @__PURE__ */ j(""), p = /* @__PURE__ */ j(!1), m = () => {
		c.value += 1;
	};
	F(() => e.node, (e, t, i) => {
		let a = () => {
			if (!n.graph) return;
			let e = uE(n), t = JSON.stringify(lE(n)), r = sE.get(n), i = e && r?.key === t && (r.receiptSource === e || r.observedSource === e) ? r.asset : "", a = n.isInputConnected(0), o = l.value;
			(o.asset !== e || o.key !== t || o.formal !== i || o.connected !== a) && (l.value = {
				asset: e,
				key: t,
				formal: i,
				connected: a
			});
		}, o = window.setInterval(a, 200);
		ub.addEventListener("change", m), r.addEventListener("changed", a), a(), i(() => {
			clearInterval(o), ub.removeEventListener("change", m), r.removeEventListener("changed", a);
		});
	}, { immediate: !0 });
	let h = K(() => {
		let { asset: e, key: t, formal: n } = l.value;
		return JSON.stringify([
			e,
			t,
			n,
			c.value
		]);
	}), g = K(() => f.value === h.value ? u.value : void 0);
	F(h, (e, t, i) => {
		let { asset: o, key: s, formal: c } = l.value;
		if (u.value = void 0, p.value = !!o, !o) return;
		let m = new AbortController(), h, g = window.setTimeout(() => {
			XT(o, a, JSON.parse(s), m.signal, c || void 0).then((t) => {
				if (m.signal.aborted) {
					dE(t);
					return;
				}
				let i = sE.get(n);
				if (c && i?.asset === c) {
					if (t.formal) i.verifiedSource = o;
					else if (t.error === "PREVIEW_STALE") {
						dE(t), sE.delete(n), r.dispatchEvent(new Event("changed"));
						return;
					}
				}
				h = t, u.value = t, f.value = e, p.value = !1, d.value = {
					asset: o,
					channels: t.channels
				};
			}, (t) => {
				m.signal.aborted || (u.value = {
					state: "failed",
					error: t instanceof X ? t.code : "network"
				}, f.value = e, p.value = !1);
			});
		}, 400);
		i(() => {
			clearTimeout(g), m.abort(), dE(h);
		});
	}, { immediate: !0 }), F([g, () => o.value || s.value], ([e, t], n, r) => {
		if (!e?.jobId || !e.before || !t) return;
		let i = e.jobId, a = new AbortController(), o = window.setInterval(() => {
			document.hidden || VT(i, a.signal).catch((t) => {
				a.signal.aborted || u.value?.jobId !== i || (dE(e), u.value = {
					state: "failed",
					error: t instanceof X ? t.code : "PREVIEW_STALE"
				});
			});
		}, 8e3);
		r(() => {
			clearInterval(o), a.abort();
		});
	});
	let _ = K(() => d.value?.asset === l.value.asset && d.value?.channels === 1);
	F(_, (e, t, r) => {
		let i = n.widgets?.find((e) => e.name === "linked");
		if (!i) return;
		let a = i.disabled;
		i.disabled = e, n.graph && n.setDirtyCanvas(!0, !0), r(() => {
			i.disabled = a;
		});
	}, { immediate: !0 });
	function v(e) {
		let t = n.graph, r = i();
		if (!t || r?.read_only || r?.selectOnly) return;
		let a = Object.entries(e).flatMap(([e, t]) => {
			let r = n.widgets?.find((t) => t.name === e);
			return r && r.value !== t ? [{
				name: e,
				value: t,
				widget: r
			}] : [];
		});
		if (a.length) {
			t.beforeChange(n), r?.emitBeforeChange();
			try {
				for (let { name: e, value: t, widget: r } of a) {
					let i = r.value;
					r.value = t, n.onWidgetChanged?.(e, t, i, r);
				}
				t.change(), n.setDirtyCanvas(!0, !0);
			} finally {
				t.afterChange(n), r?.emitAfterChange();
			}
		}
	}
	return () => {
		let { asset: e, key: r, connected: i } = l.value, a = g.value, c = e ? p.value || !a ? t("siril.rendering") : a.error ? t("siril.states." + a.error, a.error) : t(a.formal ? "siril.formal" : "siril.candidate") : t(i ? "siril.upstream" : "siril.noInput"), u = JSON.parse(r);
		return U(R, null, [U(rE, {
			expanded: o.value,
			images: a,
			status: c,
			imageClassName: "ap-siril-main",
			badge: a ? t(a.formal ? "siril.formal" : "siril.candidate") : void 0,
			onToggle: () => {
				o.value = !o.value;
			},
			onCompare: () => {
				s.value = !0;
			},
			onRefresh: e ? m : void 0,
			onReset: () => v(BT)
		}, null), s.value && U(tE, {
			preview: a,
			title: n.title || "Siril · AutoStretch",
			description: t("siril.nodeHelp"),
			onRefresh: e ? m : void 0,
			onReset: () => v(BT),
			parameters: U("div", { class: "ap-inspector-fields" }, [
				U(pE, {
					label: t("siril.shadows") + " (σ)",
					help: t("siril.shadowsHelp"),
					value: u.shadowsclip,
					onChange: (e) => v({ shadowsclip: e })
				}, null),
				U(pE, {
					label: t("siril.target"),
					help: t("siril.targetHelp"),
					value: u.targetbg,
					min: 0,
					max: 1,
					onChange: (e) => v({ targetbg: e })
				}, null),
				U("label", { class: "ap-inspector-toggle" }, [U("span", null, [
					t("siril.linked"),
					W(" "),
					U(nE, { text: t("siril.linkedHelp") }, null)
				]), U("input", {
					type: "checkbox",
					role: "switch",
					checked: u.linked && !_.value,
					disabled: _.value,
					title: t(_.value ? "siril.mono" : "siril.rgbRisk"),
					onChange: (e) => v({ linked: e.currentTarget.checked })
				}, null)])
			]),
			onClose: () => {
				s.value = !1;
			}
		}, null)]);
	};
}, { props: [
	"node",
	"execution",
	"canvas"
] }), pE = /* @__PURE__ */ I((e) => {
	let t = /* @__PURE__ */ j();
	return () => U("label", null, [U("span", null, [
		e.label,
		W(" "),
		U(nE, { text: e.help }, null)
	]), U("input", {
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
function mE(e, t) {
	e.registerExtension({
		name: "AstroPhoto.Siril",
		nodeCreated(n) {
			if (n.comfyClass !== oE) return;
			let r = document.createElement("div");
			r.className = "astrophoto-ui ap-siril-widget ap-siril-preview-widget";
			let i = document.createElement("div");
			i.className = "ap-siril-preview-content", r.append(i);
			let a = 264, o = n.addDOMWidget("astrophoto_preview", "astrophoto-scientific-preview", r, {
				serialize: !1,
				getMinHeight: () => a,
				getMaxHeight: () => a
			});
			o.serialize = !1, DT(o);
			let s = new ResizeObserver(() => {
				if (!n.graph) return;
				let e = i.offsetHeight;
				e && e !== a && (a = e, n.setSize([n.size[0], n.computeSize()[1]]), n.setDirtyCanvas(!0, !0));
			}), c = new EventTarget(), l = n.onExecuted, u = function(e) {
				l?.call(this, e);
				let t = e;
				t.astrophoto_asset?.[0] && t.astrophoto_source?.[0] && t.astrophoto_parameters?.[0] && (sE.set(n, {
					asset: t.astrophoto_asset[0],
					receiptSource: t.astrophoto_source[0],
					observedSource: uE(n),
					key: JSON.stringify(t.astrophoto_parameters[0])
				}), c.dispatchEvent(new Event("changed")));
			};
			n.onExecuted = u;
			let d = MT(e, i, fE, {
				node: n,
				execution: c,
				canvas: () => e.canvas
			}, t);
			s.observe(i, { box: "border-box" });
			let f = o.onRemove;
			o.onRemove = () => {
				s.disconnect(), n.onExecuted === u && (n.onExecuted = l), d(), sE.delete(n), f?.call(o);
			};
			let p = fb() + 8 + 2 * o.margin;
			n.setSize([Math.max(n.size[0], p), Math.max(n.size[1], 395)]);
		}
	});
}
// ../extension/frontend-entry.ts
IT(e, [{
	id: "siril",
	summary: /* @__PURE__ */ I((e) => {
		let { t } = Y(), { resource: n } = sC(UT, !0), r = /* @__PURE__ */ M(), i = /* @__PURE__ */ j(), a, o = /* @__PURE__ */ j(!1);
		Gr(() => a?.abort());
		async function s(e) {
			if (o.value) return;
			let t = new AbortController();
			a = t, o.value = !0, i.value = void 0;
			try {
				let n = await KT(e, t.signal);
				t.signal.aborted || (r.value = n);
			} catch (e) {
				t.signal.aborted || (i.value = e instanceof X ? e.code : "network");
			} finally {
				t.signal.aborted || (o.value = !1, a = void 0);
			}
		}
		return () => {
			let a = r.value ?? (n.value.state === "ready" ? n.value.data : void 0);
			return U(R, null, [U("div", { class: "ap-software-item" }, [U("button", {
				type: "button",
				class: "ap-software-open",
				onClick: e.onOpen
			}, [U("span", {
				class: "ap-software-item-icon",
				"aria-hidden": "true"
			}, [W("▣")]), U("span", { class: "ap-software-item-copy" }, [
				U("strong", null, [W("Siril")]),
				U("small", null, [t("siril.purpose")]),
				U("small", { class: "ap-software-status" }, [U("span", {
					class: "ap-software-dot",
					"data-state": a ? a.state === "ready" ? "ready" : "error" : "unknown"
				}, null), a ? a.state === "ready" ? t("software.ready") : t("siril.states." + a.state, a.state) : t(n.value.state === "error" ? "siril.states.network" : "states.loading")])
			])]), U("label", { class: "ap-software-switch" }, [
				U("span", { class: "ap-software-switch-label" }, [t("software.enabled")]),
				U("input", {
					type: "checkbox",
					role: "switch",
					"aria-label": t("software.enableNamed", { name: "Siril" }),
					checked: !!a?.enabled,
					disabled: o.value || !a || a.state !== "ready" && !a.enabled,
					onChange: (e) => void s(e.currentTarget.checked)
				}, null),
				U("span", {
					class: "ap-software-switch-track",
					"aria-hidden": "true"
				}, [U("span", null, null)])
			])]), i.value && U("p", { role: "alert" }, [t("siril.states." + i.value, t("errors.unknown"))])]);
		};
	}, { props: ["onOpen"] }),
	settings: /* @__PURE__ */ I(() => {
		let { t: e } = Y(), { resource: t, refresh: n } = sC(UT, !0), r = /* @__PURE__ */ M(), i = /* @__PURE__ */ j(""), a = /* @__PURE__ */ M(), o = /* @__PURE__ */ j(!1), s = /* @__PURE__ */ M(), c;
		Gr(() => c?.abort());
		let l = (t) => e("siril.states." + t, t);
		async function u(e) {
			c?.abort();
			let t = new AbortController();
			c = t, s.value = void 0, o.value = !0;
			try {
				await e(t.signal);
			} catch (e) {
				if (!t.signal.aborted) {
					let t = e instanceof X ? e.details?.detected : void 0;
					s.value = {
						code: e instanceof X ? e.code : "network",
						detected: typeof t == "string" ? t : void 0
					};
				}
			} finally {
				c === t && (c = void 0, o.value = !1);
			}
		}
		return () => {
			let c = r.value ?? (t.value.state === "ready" ? t.value.data : void 0);
			return U(R, null, [
				U("div", { class: "ap-software-title" }, [U("div", null, [U("h3", null, [W("Siril")]), U("small", null, [e("siril.purpose")])]), U("span", { class: "ap-software-version" }, [W("1.4.5")])]),
				U("section", { class: "ap-software-section" }, [U("p", {
					class: "ap-software-status",
					role: "status"
				}, [U("span", {
					class: "ap-software-dot",
					"data-ready": c?.state === "ready"
				}, null), c ? l(c.state) : e(t.value.state === "error" ? "siril.states.network" : "states.loading")]), c?.path && U("dl", { class: "ap-software-metadata" }, [
					U("dt", null, [e("siril.activePath")]),
					U("dd", null, [c.path]),
					U("dt", null, [e("siril.version")]),
					U("dd", null, [c.version]),
					U("dt", null, [e("siril.verified")]),
					U("dd", null, [c.verified_at ? new Date(c.verified_at).toLocaleString() : "—"])
				])]),
				U("section", { class: "ap-software-section ap-software-guide" }, [
					U("h3", null, [e("siril.install")]),
					U("p", null, [e("siril.install" + (c?.os === "Windows" ? "Windows" : c?.os === "Darwin" ? "Mac" : "Linux"))]),
					U("a", {
						href: "https://siril.org/download/",
						target: "_blank",
						rel: "noreferrer"
					}, [e("siril.download")]),
					" · ",
					U("a", {
						href: "https://siril.org/download/2026-10-28-siril-1-4-5/",
						target: "_blank",
						rel: "noreferrer"
					}, [e("siril.release")])
				]),
				U("section", { class: "ap-software-section" }, [U("div", { class: "ap-siril-actions" }, [U("button", {
					class: "ap-storage-button",
					type: "button",
					disabled: o.value,
					onClick: () => void u(async (e) => {
						a.value = await qT(e);
					})
				}, [e("siril.detect")]), U("button", {
					class: "ap-storage-button",
					type: "button",
					disabled: o.value,
					onClick: () => {
						r.value = void 0, a.value = void 0, n();
					}
				}, [e("actions.refresh")])]), a.value && (a.value.length ? U("ul", { class: "ap-software-candidates" }, [a.value.map((t) => U("li", { key: t.path }, [
					U("button", {
						class: "ap-storage-button",
						type: "button",
						disabled: o.value || t.state !== "ready",
						onClick: () => {
							i.value = t.path;
						}
					}, [e("siril.select")]),
					" ",
					U("code", null, [t.path]),
					W(" · "),
					t.origin,
					W(" · "),
					t.version ?? t.detected,
					" ",
					W("· "),
					l(t.state)
				]))]) : U("p", { class: "ap-software-muted" }, [e("software.noCandidates")]))]),
				U("section", { class: "ap-software-section" }, [
					U("form", { onSubmit: (e) => {
						e.preventDefault(), u(async (e) => {
							r.value = await WT(i.value.trim() || c?.path || "", e);
						});
					} }, [
						U("label", null, [e("siril.path"), U("input", {
							value: i.value,
							onInput: (e) => {
								i.value = e.currentTarget.value;
							},
							placeholder: c?.path,
							disabled: o.value
						}, null)]),
						U("small", null, [e("siril.pathHelp")]),
						U("div", { class: "ap-siril-actions" }, [U("button", {
							class: "ap-storage-button",
							"data-variant": "primary",
							disabled: o.value || !(i.value.trim() || c?.path)
						}, [e("siril.save")]), c?.path && U("button", {
							class: "ap-storage-button",
							type: "button",
							disabled: o.value,
							onClick: () => void u(async (e) => {
								r.value = await GT(e), i.value = "";
							})
						}, [e("siril.clear")])])
					]),
					o.value && U("p", { role: "status" }, [e("siril.verifying")]),
					s.value && U("p", { role: "alert" }, [l(s.value.code), s.value.detected && ` · ${e("siril.version")} ${s.value.detected}`])
				])
			]);
		};
	}),
	messages: {
		en: { siril: {
			shadowsHelp: "Set shadow clipping in units of background noise standard deviation.",
			targetHelp: "Set the target background brightness after stretching, from 0 to 1.",
			linkedHelp: "Link RGB channels to preserve their relative balance. Unlinked stretching can change white balance. Not applicable to monochrome images.",
			purpose: "Astronomical image processing · AutoStretch",
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
			}
		} },
		zh: { siril: {
			shadowsHelp: "以背景噪声的标准差为单位设置阴影裁剪。",
			targetHelp: "设置自动拉伸后的目标背景亮度，范围为 0 至 1。",
			linkedHelp: "联动 RGB 通道可保持通道间的相对关系。关闭联动可能改变白平衡。单色图像不适用。",
			purpose: "天文图像处理 · 自动拉伸",
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
			}
		} }
	},
	registerNodes: mE
}]);
