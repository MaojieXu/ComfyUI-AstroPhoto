import { app as Z } from "../../../scripts/app.js";
import { ComponentWidgetImpl as ee, addWidget as te } from "../../../scripts/domWidget.js";
import { defineComponent as I, ref as v, resolveDirective as ae, createElementBlock as k, openBlock as D, Fragment as U, createElementVNode as y, withDirectives as ne, createVNode as $, createBlock as X, unref as r, normalizeClass as Y, withCtx as N, createTextVNode as W, toDisplayString as x, renderList as oe, normalizeStyle as ie, onMounted as F, nextTick as le } from "vue";
import O from "primevue/button";
import { useI18n as L } from "vue-i18n";
const re = { class: "toolbar" }, se = { class: "color-picker" }, ue = { class: "size-slider" }, ce = ["value"], ve = /* @__PURE__ */ I({
  __name: "ToolBar",
  props: {
    colors: {},
    initialColor: {},
    initialBrushSize: {},
    initialTool: {}
  },
  emits: ["tool-change", "color-change", "canvas-clear", "brush-size-change"],
  setup(u, { emit: p }) {
    const { t: l } = L(), a = u, g = p, z = a.colors || ["#000000", "#ff0000", "#0000ff", "#69a869", "#ffff00", "#ff00ff", "#00ffff"], f = v(a.initialColor || "#000000"), m = v(a.initialBrushSize || 5), i = v(a.initialTool || "pen");
    function o(c) {
      i.value = c, g("tool-change", c);
    }
    function s(c) {
      f.value = c, g("color-change", c);
    }
    function _() {
      g("canvas-clear");
    }
    function e(c) {
      const w = c.target;
      m.value = Number(w.value), g("brush-size-change", m.value);
    }
    return (c, w) => {
      const T = ae("tooltip");
      return D(), k(U, null, [
        y("div", re, [
          ne((D(), X(r(O), {
            class: Y({ active: i.value === "pen" }),
            onClick: w[0] || (w[0] = (h) => o("pen"))
          }, {
            default: N(() => [
              W(x(r(l)("vue-basic.pen")), 1)
            ]),
            _: 1
          }, 8, ["class"])), [
            [T, { value: r(l)("vue-basic.pen-tooltip"), showDelay: 300 }]
          ]),
          $(r(O), { onClick: _ }, {
            default: N(() => [
              W(x(r(l)("vue-basic.clear-canvas")), 1)
            ]),
            _: 1
          })
        ]),
        y("div", se, [
          (D(!0), k(U, null, oe(r(z), (h, d) => (D(), X(r(O), {
            key: d,
            class: Y({ "color-button": !0, active: f.value === h }),
            onClick: (E) => s(h),
            type: "button",
            title: h
          }, {
            default: N(() => [
              y("i", {
                class: "pi pi-circle-fill",
                style: ie({ color: h })
              }, null, 4)
            ]),
            _: 2
          }, 1032, ["class", "onClick", "title"]))), 128))
        ]),
        y("div", ue, [
          y("label", null, x(r(l)("vue-basic.brush-size")) + ": " + x(m.value) + "px", 1),
          y("input", {
            type: "range",
            min: "1",
            max: "50",
            value: m.value,
            onChange: w[1] || (w[1] = (h) => e(h))
          }, null, 40, ce)
        ])
      ], 64);
    };
  }
}), R = (u, p) => {
  const l = u.__vccOpts || u;
  for (const [a, g] of p)
    l[a] = g;
  return l;
}, fe = /* @__PURE__ */ R(ve, [["__scopeId", "data-v-cf7e8687"]]), he = { class: "drawing-board" }, de = { class: "canvas-container" }, pe = ["width", "height"], ge = /* @__PURE__ */ I({
  __name: "DrawingBoard",
  props: {
    width: {},
    height: {},
    initialColor: {},
    initialBrushSize: {}
  },
  emits: ["mounted", "drawing-start", "drawing", "drawing-end", "state-save", "canvas-clear"],
  setup(u, { expose: p, emit: l }) {
    const a = u, g = a.width || 800, z = a.height || 500, f = a.initialColor || "#000000", m = a.initialBrushSize || 5, i = l, o = v(!1), s = v(0), _ = v(0), e = v(null), c = v(!1), w = v(m), T = v(f), h = v(null), d = v(null);
    F(() => {
      d.value && (e.value = d.value.getContext("2d"), E(), le(() => {
        d.value && i("mounted", d.value);
      }));
    });
    function E() {
      e.value && (e.value.fillStyle = "#ffffff", e.value.fillRect(0, 0, g, z), B(), A());
    }
    function B() {
      e.value && (c.value ? (e.value.globalCompositeOperation = "destination-out", e.value.strokeStyle = "rgba(0,0,0,1)") : (e.value.globalCompositeOperation = "source-over", e.value.strokeStyle = T.value), e.value.lineWidth = w.value, e.value.lineJoin = "round", e.value.lineCap = "round");
    }
    function M(n) {
      o.value = !0;
      const { offsetX: b, offsetY: C } = S(n);
      s.value = b, _.value = C, e.value && (e.value.beginPath(), e.value.moveTo(s.value, _.value), e.value.arc(s.value, _.value, w.value / 2, 0, Math.PI * 2), e.value.fill(), i("drawing-start", {
        x: b,
        y: C,
        tool: c.value ? "eraser" : "pen"
      }));
    }
    function V(n) {
      if (!o.value || !e.value) return;
      const { offsetX: b, offsetY: C } = S(n);
      e.value.beginPath(), e.value.moveTo(s.value, _.value), e.value.lineTo(b, C), e.value.stroke(), s.value = b, _.value = C, i("drawing", {
        x: b,
        y: C,
        tool: c.value ? "eraser" : "pen"
      });
    }
    function t() {
      o.value && (o.value = !1, A(), i("drawing-end"));
    }
    function S(n) {
      let b = 0, C = 0;
      if ("touches" in n) {
        if (n.preventDefault(), d.value) {
          const P = d.value.getBoundingClientRect();
          b = n.touches[0].clientX - P.left, C = n.touches[0].clientY - P.top;
        }
      } else
        b = n.offsetX, C = n.offsetY;
      return { offsetX: b, offsetY: C };
    }
    function j(n) {
      n.preventDefault();
      const C = {
        touches: [n.touches[0]]
      };
      M(C);
    }
    function H(n) {
      if (n.preventDefault(), !o.value) return;
      const C = {
        touches: [n.touches[0]]
      };
      V(C);
    }
    function J(n) {
      c.value = n === "eraser", B();
    }
    function q(n) {
      T.value = n, B();
    }
    function G(n) {
      w.value = n, B();
    }
    function K() {
      e.value && (e.value.fillStyle = "#ffffff", e.value.fillRect(0, 0, g, z), B(), A(), i("canvas-clear"));
    }
    function A() {
      d.value && (h.value = d.value.toDataURL("image/png"), h.value && i("state-save", h.value));
    }
    async function Q() {
      if (!d.value)
        throw new Error("Canvas is unable to get current data");
      return h.value ? h.value : d.value.toDataURL("image/png");
    }
    return p({
      setTool: J,
      setColor: q,
      setBrushSize: G,
      clearCanvas: K,
      getCurrentCanvasData: Q
    }), (n, b) => (D(), k("div", he, [
      y("div", de, [
        y("canvas", {
          ref_key: "canvas",
          ref: d,
          width: r(g),
          height: r(z),
          onMousedown: M,
          onMousemove: V,
          onMouseup: t,
          onMouseleave: t,
          onTouchstart: j,
          onTouchmove: H,
          onTouchend: t
        }, null, 40, pe)
      ])
    ]));
  }
}), me = /* @__PURE__ */ R(ge, [["__scopeId", "data-v-0441e83f"]]), we = { class: "drawing-app" }, Ce = /* @__PURE__ */ I({
  __name: "DrawingApp",
  props: {
    width: {},
    height: {},
    initialColor: {},
    initialBrushSize: {},
    availableColors: {}
  },
  emits: ["tool-change", "color-change", "brush-size-change", "drawing-start", "drawing", "drawing-end", "state-save", "mounted"],
  setup(u, { expose: p, emit: l }) {
    const a = u, g = a.width || 800, z = a.height || 500, f = a.initialColor || "#000000", m = a.initialBrushSize || 5, i = a.availableColors || ["#000000", "#ff0000", "#0000ff", "#00ff00", "#ffff00", "#ff00ff", "#00ffff"], o = l, s = v(null), _ = v(null);
    function e(t) {
      var S;
      (S = s.value) == null || S.setTool(t), o("tool-change", t);
    }
    function c(t) {
      var S;
      (S = s.value) == null || S.setColor(t), o("color-change", t);
    }
    function w(t) {
      var S;
      (S = s.value) == null || S.setBrushSize(t), o("brush-size-change", t);
    }
    function T() {
      var t;
      (t = s.value) == null || t.clearCanvas();
    }
    function h(t) {
      o("drawing-start", t);
    }
    function d(t) {
      o("drawing", t);
    }
    function E() {
      o("drawing-end");
    }
    function B(t) {
      _.value = t, o("state-save", t);
    }
    function M(t) {
      o("mounted", t);
    }
    async function V() {
      if (_.value)
        return _.value;
      if (s.value)
        try {
          return await s.value.getCurrentCanvasData();
        } catch (t) {
          throw console.error("unable to get canvas data:", t), new Error("unable to get canvas data");
        }
      throw new Error("get canvas data failed");
    }
    return p({
      getCanvasData: V
    }), (t, S) => (D(), k("div", we, [
      $(fe, {
        colors: r(i),
        initialColor: r(f),
        initialBrushSize: r(m),
        onToolChange: e,
        onColorChange: c,
        onBrushSizeChange: w,
        onCanvasClear: T
      }, null, 8, ["colors", "initialColor", "initialBrushSize"]),
      $(me, {
        ref_key: "drawingBoard",
        ref: s,
        width: r(g),
        height: r(z),
        initialColor: r(f),
        initialBrushSize: r(m),
        onDrawingStart: h,
        onDrawing: d,
        onDrawingEnd: E,
        onStateSave: B,
        onMounted: M
      }, null, 8, ["width", "height", "initialColor", "initialBrushSize"])
    ]));
  }
}), _e = /* @__PURE__ */ R(Ce, [["__scopeId", "data-v-4e895e42"]]), be = /* @__PURE__ */ I({
  __name: "VueExampleComponent",
  props: {
    widget: {}
  },
  setup(u) {
    const { t: p } = L(), l = v(null), a = v(null);
    u.widget.node;
    function g(f) {
      a.value = f, console.log("canvas state saved:", f.substring(0, 50) + "...");
    }
    async function z(f, m) {
      var i;
      try {
        if (!((i = window.app) != null && i.api))
          throw new Error("ComfyUI API not available");
        const o = await fetch(f).then((w) => w.blob()), s = `${m}_${Date.now()}.png`, _ = new File([o], s), e = new FormData();
        return e.append("image", _), e.append("subfolder", "threed"), e.append("type", "temp"), console.log("Vue Component: Using window.app.api.fetchApi"), (await window.app.api.fetchApi("/upload/image", {
          method: "POST",
          body: e
        })).json();
      } catch (o) {
        throw console.error("Vue Component: Error uploading image:", o), o;
      }
    }
    return F(() => {
      u.widget.serializeValue = async (f, m) => {
        try {
          console.log("Vue Component: inside vue serializeValue"), console.log("node", f), console.log("index", m);
          const i = a.value;
          return i ? {
            image: `threed/${(await z(i, "test_vue_basic")).name} [temp]`
          } : (console.warn("Vue Component: No canvas data available"), { image: null });
        } catch (i) {
          return console.error("Vue Component: Error in serializeValue:", i), { image: null };
        }
      };
    }), (f, m) => (D(), k("div", null, [
      y("h1", null, x(r(p)("vue-basic.title")), 1),
      y("div", null, [
        $(_e, {
          ref_key: "drawingAppRef",
          ref: l,
          width: 300,
          height: 300,
          onStateSave: g
        }, null, 512)
      ])
    ]));
  }
}), Se = Z;
Se.registerExtension({
  name: "vue-basic",
  getCustomWidgets(u) {
    return {
      CUSTOM_VUE_COMPONENT_BASIC(p) {
        const l = {
          name: "custom_vue_component_basic",
          type: "vue-basic"
        }, a = new ee({
          node: p,
          name: l.name,
          component: be,
          inputSpec: l,
          options: {}
        });
        return te(p, a), { widget: a };
      }
    };
  },
  nodeCreated(u) {
    if (u.constructor.comfyClass !== "vue-basic") return;
    const [p, l] = u.size;
    u.setSize([Math.max(p, 300), Math.max(l, 520)]);
  }
});
