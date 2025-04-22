(() => {
  var wt = Object.defineProperty,
    yt = (e, t) => {
      for (var r in t) wt(e, r, { get: t[r], enumerable: !0 });
    },
    Y;
  function le(e) {
    return [...e.v, (e.i ? "!" : "") + e.n].join(":");
  }
  function xt(e, t = ",") {
    return e.map(le).join(t);
  }
  var $e =
    (typeof CSS < "u" && CSS.escape) ||
    ((e) =>
      e
        .replace(/[!"'`*+.,;:\\/<=>?@#$%&^|~()[\]{}]/g, "\\$&")
        .replace(/^\d/, "\\3$& "));
  function te(e) {
    for (var t = 9, r = e.length; r--; )
      t = Math.imul(t ^ e.charCodeAt(r), 1597334677);
    return "#" + ((t ^ (t >>> 9)) >>> 0).toString(36);
  }
  function se(e, t = "@media ") {
    return (
      t +
      b(e)
        .map(
          (r) => (
            typeof r == "string" && (r = { min: r }),
            r.raw ||
              Object.keys(r)
                .map((o) => `(${o}-width:${r[o]})`)
                .join(" and ")
          )
        )
        .join(",")
    );
  }
  function b(e = []) {
    return Array.isArray(e) ? e : e == null ? [] : [e];
  }
  function Ae(e) {
    return e;
  }
  function _() {}
  var v = {
    d: 0,
    b: 134217728,
    c: 268435456,
    a: 671088640,
    u: 805306368,
    o: 939524096,
  };
  function ze(e) {
    return e.match(/[-=:;]/g)?.length || 0;
  }
  function ce(e) {
    return (
      (Math.min(
        /(?:^|width[^\d]+)(\d+(?:.\d+)?)(p)?/.test(e)
          ? Math.max(
              0,
              29.63 * (+RegExp.$1 / (RegExp.$2 ? 15 : 1)) ** 0.137 - 43
            )
          : 0,
        15
      ) <<
        22) |
      (Math.min(ze(e), 15) << 18)
    );
  }
  var vt = [
    "rst-c",
    "st-ch",
    "h-chi",
    "y-lin",
    "nk",
    "sited",
    "ecked",
    "pty",
    "ad-on",
    "cus-w",
    "ver",
    "cus",
    "cus-v",
    "tive",
    "sable",
    "tiona",
    "quire",
  ];
  function de({ n: e, i: t, v: r = [] }, o, n, i) {
    e && (e = le({ n: e, i: t, v: r })), (i = [...b(i)]);
    for (let a of r) {
      let s = o.theme("screens", a);
      for (let f of b((s && se(s)) || o.v(a))) {
        var l;
        i.push(f),
          (n |= s
            ? 67108864 | ce(f)
            : a == "dark"
            ? 1073741824
            : f[0] == "@"
            ? ce(f)
            : ((l = f),
              1 <<
                ~(
                  (/:([a-z-]+)/.test(l) &&
                    ~vt.indexOf(RegExp.$1.slice(2, 7))) ||
                  -18
                )));
      }
    }
    return { n: e, p: n, r: i, i: t };
  }
  var Fe = new Map();
  function fe(e) {
    if (e.d) {
      let t = [],
        r = pe(
          e.r.reduce(
            (o, n) =>
              n[0] == "@"
                ? (t.push(n), o)
                : n
                ? pe(o, (i) =>
                    pe(n, (l) => {
                      let a = /(:merge\(.+?\))(:[a-z-]+|\\[.+])/.exec(l);
                      if (a) {
                        let s = i.indexOf(a[1]);
                        return ~s
                          ? i.slice(0, s) + a[0] + i.slice(s + a[1].length)
                          : ue(i, l);
                      }
                      return ue(l, i);
                    })
                  )
                : o,
            "&"
          ),
          (o) => ue(o, e.n ? "." + $e(e.n) : "")
        );
      return (
        r && t.push(r.replace(/:merge\((.+?)\)/g, "$1")),
        t.reduceRight((o, n) => n + "{" + o + "}", e.d)
      );
    }
  }
  function pe(e, t) {
    return e.replace(
      / *((?:\(.+?\)|\[.+?\]|[^,])+) *(,|$)/g,
      (r, o, n) => t(o) + n
    );
  }
  function ue(e, t) {
    return e.replace(/&/g, t);
  }
  var Re = new Intl.Collator("en", { numeric: !0 });
  function Te(e, t) {
    for (var r = 0, o = e.length; r < o; ) {
      let n = (o + r) >> 1;
      0 >= je(e[n], t) ? (r = n + 1) : (o = n);
    }
    return o;
  }
  function je(e, t) {
    let r = e.p & v.o;
    return r == (t.p & v.o) && (r == v.b || r == v.o)
      ? 0
      : e.p - t.p ||
          e.o - t.o ||
          Re.compare(Oe(e.n), Oe(t.n)) ||
          Re.compare(Ee(e.n), Ee(t.n));
  }
  function Oe(e) {
    return (e || "").split(/:/).pop().split("/").pop() || "\0";
  }
  function Ee(e) {
    return (
      (e || "").replace(/\W/g, (t) =>
        String.fromCharCode(127 + t.charCodeAt(0))
      ) + "\0"
    );
  }
  function ge(e, t) {
    return Math.round(parseInt(e, 16) * t);
  }
  function L(e, t = {}) {
    if (typeof e == "function") return e(t);
    let { opacityValue: r = "1", opacityVariable: o } = t,
      n = o ? `var(${o})` : r;
    if (e.includes("<alpha-value>")) return e.replace("<alpha-value>", n);
    if (e[0] == "#" && (e.length == 4 || e.length == 7)) {
      let i = (e.length - 1) / 3,
        l = [17, 1, 0.062272][i - 1];
      return `rgba(${[
        ge(e.substr(1, i), l),
        ge(e.substr(1 + i, i), l),
        ge(e.substr(1 + 2 * i, i), l),
        n,
      ]})`;
    }
    return n == "1"
      ? e
      : n == "0"
      ? "#0000"
      : e.replace(/^(rgb|hsl)(\([^)]+)\)$/, `$1a$2,${n})`);
  }
  function De(e, t, r, o, n = []) {
    return (function i(l, { n: a, p: s, r: f = [], i: u }, p) {
      let m = [],
        y = "",
        x = 0,
        k = 0;
      for (let h in l || {}) {
        var A, B;
        let S = l[h];
        if (h[0] == "@") {
          if (!S) continue;
          if (h[1] == "a") {
            m.push(...be(a, s, oe("" + S), p, s, f, u, !0));
            continue;
          }
          if (h[1] == "l") {
            for (let z of b(S))
              m.push(
                ...i(
                  z,
                  {
                    n: a,
                    p: ((A = v[h[7]]), (s & ~v.o) | A),
                    r: h[7] == "d" ? [] : f,
                    i: u,
                  },
                  p
                )
              );
            continue;
          }
          if (h[1] == "i") {
            m.push(
              ...b(S).map((z) => ({ p: -1, o: 0, r: [], d: h + " " + z }))
            );
            continue;
          }
          if (h[1] == "k") {
            m.push({
              p: v.d,
              o: 0,
              r: [h],
              d: i(S, { p: v.d }, p).map(fe).join(""),
            });
            continue;
          }
          if (h[1] == "f") {
            m.push(
              ...b(S).map((z) => ({
                p: v.d,
                o: 0,
                r: [h],
                d: i(z, { p: v.d }, p).map(fe).join(""),
              }))
            );
            continue;
          }
        }
        if (typeof S != "object" || Array.isArray(S))
          h == "label" && S
            ? (a = S + te(JSON.stringify([s, u, l])))
            : (S || S === 0) &&
              ((h = h.replace(/[A-Z]/g, (z) => "-" + z.toLowerCase())),
              (k += 1),
              (x = Math.max(
                x,
                (B = h)[0] == "-"
                  ? 0
                  : ze(B) +
                      (/^(?:(border-(?!w|c|sty)|[tlbr].{2,4}m?$|c.{7,8}$)|([fl].{5}l|g.{8}$|pl))/.test(
                        B
                      )
                        ? +!!RegExp.$1 || -!!RegExp.$2
                        : 0) +
                      1
              )),
              (y +=
                (y ? ";" : "") +
                b(S)
                  .map((z) =>
                    p.s(h, me("" + z, p.theme) + (u ? " !important" : ""))
                  )
                  .join(";")));
        else if (h[0] == "@" || h.includes("&")) {
          let z = s;
          h[0] == "@" &&
            ((h = h.replace(/\bscreen\(([^)]+)\)/g, (Ce, G) => {
              let W = p.theme("screens", G);
              return W ? ((z |= 67108864), se(W, "")) : Ce;
            })),
            (z |= ce(h))),
            m.push(...i(S, { n: a, p: z, r: [...f, h], i: u }, p));
        } else m.push(...i(S, { p: s, r: [...f, h] }, p));
      }
      return (
        m.unshift({
          n: a,
          p: s,
          o: Math.max(0, 15 - k) + 1.5 * Math.min(x || 15, 15),
          r: f,
          d: y,
        }),
        m.sort(je)
      );
    })(e, de(t, r, o, n), r);
  }
  function me(e, t) {
    return e.replace(
      /theme\((["'`])?(.+?)\1(?:\s*,\s*(["'`])?(.+?)\3)?\)/g,
      (r, o, n, i, l = "") => {
        let a = t(n, l);
        return typeof a == "function" && /color|fill|stroke/i.test(n)
          ? L(a)
          : "" + b(a).filter((s) => Object(s) !== s);
      }
    );
  }
  function We(e, t) {
    let r,
      o = [];
    for (let n of e)
      n.d && n.n
        ? r?.p == n.p && "" + r.r == "" + n.r
          ? ((r.c = [r.c, n.c].filter(Boolean).join(" ")),
            (r.d = r.d + ";" + n.d))
          : o.push((r = { ...n, n: n.n && t }))
        : o.push({ ...n, n: n.n && t });
    return o;
  }
  function re(e, t, r = v.u, o, n) {
    let i = [];
    for (let l of e)
      for (let a of (function (s, f, u, p, m) {
        s = { ...s, i: s.i || m };
        let y = (function (x, k) {
          let A = Fe.get(x.n);
          return A ? A(x, k) : k.r(x.n, x.v[0] == "dark");
        })(s, f);
        return y
          ? typeof y == "string"
            ? (({ r: p, p: u } = de(s, f, u, p)),
              We(re(oe(y), f, u, p, s.i), s.n))
            : Array.isArray(y)
            ? y.map((x) => {
                var k, A;
                return {
                  o: 0,
                  ...x,
                  r: [...b(p), ...b(x.r)],
                  p: ((k = u), (A = x.p ?? u), (k & ~v.o) | A),
                };
              })
            : De(y, s, f, u, p)
          : [{ c: le(s), p: 0, o: 0, r: [] }];
      })(l, t, r, o, n))
        i.splice(Te(i, a), 0, a);
    return i;
  }
  function be(e, t, r, o, n, i, l, a) {
    return We(
      (a ? r.flatMap((s) => re([s], o, n, i, l)) : re(r, o, n, i, l)).map((s) =>
        s.p & v.o && (s.n || t == v.b) ? { ...s, p: (s.p & ~v.o) | t, o: 0 } : s
      ),
      e
    );
  }
  function kt(e, t, r, o) {
    var n;
    return (
      (n = (i, l) => {
        let { n: a, p: s, r: f, i: u } = de(i, l, t);
        return r && be(a, t, r, l, s, f, u, o);
      }),
      Fe.set(e, n),
      e
    );
  }
  function he(e, t, r) {
    if (e[e.length - 1] != "(") {
      let o = [],
        n = !1,
        i = !1,
        l = "";
      for (let a of e)
        if (!(a == "(" || /[~@]$/.test(a))) {
          if ((a[0] == "!" && ((a = a.slice(1)), (n = !n)), a.endsWith(":"))) {
            o[a == "dark:" ? "unshift" : "push"](a.slice(0, -1));
            continue;
          }
          a[0] == "-" && ((a = a.slice(1)), (i = !i)),
            a.endsWith("-") && (a = a.slice(0, -1)),
            a && a != "&" && (l += (l && "-") + a);
        }
      l && (i && (l = "-" + l), t[0].push({ n: l, v: o.filter(St), i: n }));
    }
  }
  function St(e, t, r) {
    return r.indexOf(e) == t;
  }
  var Me = new Map();
  function oe(e) {
    let t = Me.get(e);
    if (!t) {
      let r = [],
        o = [[]],
        n = 0,
        i = 0,
        l = null,
        a = 0,
        s = (f, u = 0) => {
          n != a && (r.push(e.slice(n, a + u)), f && he(r, o)), (n = a + 1);
        };
      for (; a < e.length; a++) {
        let f = e[a];
        if (i) e[a - 1] != "\\" && (i += +(f == "[") || -(f == "]"));
        else if (f == "[") i += 1;
        else if (l)
          e[a - 1] != "\\" &&
            l.test(e.slice(a)) &&
            ((l = null), (n = a + RegExp.lastMatch.length));
        else if (
          f == "/" &&
          e[a - 1] != "\\" &&
          (e[a + 1] == "*" || e[a + 1] == "/")
        )
          l = e[a + 1] == "*" ? /^\*\// : /^[\r\n]/;
        else if (f == "(") s(), r.push(f);
        else if (f == ":") e[a + 1] != ":" && s(!1, 1);
        else if (/[\s,)]/.test(f)) {
          s(!0);
          let u = r.lastIndexOf("(");
          if (f == ")") {
            let p = r[u - 1];
            if (/[~@]$/.test(p)) {
              let m = o.shift();
              (r.length = u), he([...r, "#"], o);
              let { v: y } = o[0].pop();
              for (let x of m)
                x.v.splice(+(x.v[0] == "dark") - +(y[0] == "dark"), y.length);
              he(
                [
                  ...r,
                  kt(
                    p.length > 1
                      ? p.slice(0, -1) + te(JSON.stringify([p, m]))
                      : p + "(" + xt(m) + ")",
                    v.a,
                    m,
                    /@$/.test(p)
                  ),
                ],
                o
              );
            }
            u = r.lastIndexOf("(", u - 1);
          }
          r.length = u + 1;
        } else /[~@]/.test(f) && e[a + 1] == "(" && o.unshift([]);
      }
      s(!0), Me.set(e, (t = o[0]));
    }
    return t;
  }
  function c(e, t, r) {
    return [e, we(t, r)];
  }
  function we(e, t) {
    return typeof e == "function"
      ? e
      : typeof e == "string" && /^[\w-]+$/.test(e)
      ? (r, o) => ({ [e]: t ? t(r, o) : ye(r, 1) })
      : (r) => e || { [r[1]]: ye(r, 2) };
  }
  function ye(e, t, r = e.slice(t).find(Boolean) || e.$$ || e.input) {
    return e.input[0] == "-" ? `calc(${r} * -1)` : r;
  }
  function d(e, t, r, o) {
    return [e, Ct(t, r, o)];
  }
  function Ct(e, t, r) {
    let o =
      typeof t == "string"
        ? (n, i) => ({ [t]: r ? r(n, i) : n._ })
        : t || (({ 1: n, _: i }, l, a) => ({ [n || a]: i }));
    return (n, i) => {
      let l = Ve(e || n[1]),
        a = i.theme(l, n.$$) ?? U(n.$$, l, i);
      if (a != null) return (n._ = ye(n, 0, a)), o(n, i, l);
    };
  }
  function C(e, t = {}, r) {
    return [e, $t(t, r)];
  }
  function $t(e = {}, t) {
    return (r, o) => {
      let { section: n = Ve(r[0]).replace("-", "") + "Color" } = e,
        [i, l] = At(r.$$);
      if (!i) return;
      let a = o.theme(n, i) || U(i, n, o);
      if (!a || typeof a == "object") return;
      let {
          opacityVariable: s = `--tw-${r[0].replace(/-$/, "")}-opacity`,
          opacitySection: f = n.replace("Color", "Opacity"),
          property: u = n,
          selector: p,
        } = e,
        m = o.theme(f, l || "DEFAULT") || (l && U(l, f, o)),
        y =
          t ||
          (({ _: k }) => {
            let A = ne(u, k);
            return p ? { [p]: A } : A;
          });
      r._ = {
        value: L(a, {
          opacityVariable: s || void 0,
          opacityValue: m || void 0,
        }),
        color: (k) => L(a, k),
        opacityVariable: s || void 0,
        opacityValue: m || void 0,
      };
      let x = y(r, o);
      if (!r.dark) {
        let k = o.d(n, i, a);
        k &&
          k !== a &&
          ((r._ = {
            value: L(k, {
              opacityVariable: s || void 0,
              opacityValue: m || "1",
            }),
            color: (A) => L(k, A),
            opacityVariable: s || void 0,
            opacityValue: m || void 0,
          }),
          (x = { "&": x, [o.v("dark")]: y(r, o) }));
      }
      return x;
    };
  }
  function At(e) {
    return (e.match(/^(\[[^\]]+]|[^/]+?)(?:\/(.+))?$/) || []).slice(1);
  }
  function ne(e, t) {
    let r = {};
    return (
      typeof t == "string"
        ? (r[e] = t)
        : (t.opacityVariable &&
            t.value.includes(t.opacityVariable) &&
            (r[t.opacityVariable] = t.opacityValue || "1"),
          (r[e] = t.value)),
      r
    );
  }
  function U(e, t, r) {
    if (e[0] == "[" && e.slice(-1) == "]") {
      if (((e = J(me(e.slice(1, -1), r.theme))), !t)) return e;
      if (
        !(
          (/color|fill|stroke/i.test(t) &&
            !(
              /^color:/.test(e) ||
              /^(#|((hsl|rgb)a?|hwb|lab|lch|color)\(|[a-z]+$)/.test(e)
            )) ||
          (/image/i.test(t) && !(/^image:/.test(e) || /^[a-z-]+\(/.test(e))) ||
          (/weight/i.test(t) &&
            !(/^(number|any):/.test(e) || /^\d+$/.test(e))) ||
          (/position/i.test(t) && /^(length|size):/.test(e))
        )
      )
        return e.replace(/^[a-z-]+:/, "");
    }
  }
  function Ve(e) {
    return e.replace(/-./g, (t) => t[1].toUpperCase());
  }
  function J(e) {
    return e.includes("url(")
      ? e.replace(
          /(.*?)(url\(.*?\))(.*?)/g,
          (t, r = "", o, n = "") => J(r) + o + J(n)
        )
      : e
          .replace(
            /(^|[^\\])_+/g,
            (t, r) => r + " ".repeat(t.length - r.length)
          )
          .replace(/\\_/g, "_")
          .replace(/(calc|min|max|clamp)\(.+\)/g, (t) =>
            t.replace(
              /(-?\d*\.?\d(?!\b-.+[,)](?![^+\-/*])\D)(?:%|[a-z]+)?|\))([+\-/*])/g,
              "$1 $2 "
            )
          );
  }
  function xe({ presets: e = [], ...t }) {
    let r = {
      darkMode: void 0,
      darkColor: void 0,
      preflight: t.preflight !== !1 && [],
      theme: {},
      variants: b(t.variants),
      rules: b(t.rules),
      ignorelist: b(t.ignorelist),
      hash: void 0,
      stringify: (o, n) => o + ":" + n,
      finalize: [],
    };
    for (let o of b([
      ...e,
      {
        darkMode: t.darkMode,
        darkColor: t.darkColor,
        preflight: t.preflight !== !1 && b(t.preflight),
        theme: t.theme,
        hash: t.hash,
        stringify: t.stringify,
        finalize: t.finalize,
      },
    ])) {
      let {
        preflight: n,
        darkMode: i = r.darkMode,
        darkColor: l = r.darkColor,
        theme: a,
        variants: s,
        rules: f,
        ignorelist: u,
        hash: p = r.hash,
        stringify: m = r.stringify,
        finalize: y,
      } = typeof o == "function" ? o(r) : o;
      r = {
        preflight: r.preflight !== !1 && n !== !1 && [...r.preflight, ...b(n)],
        darkMode: i,
        darkColor: l,
        theme: {
          ...r.theme,
          ...a,
          extend: { ...r.theme.extend, ...a?.extend },
        },
        variants: [...r.variants, ...b(s)],
        rules: [...r.rules, ...b(f)],
        ignorelist: [...r.ignorelist, ...b(u)],
        hash: p,
        stringify: m,
        finalize: [...r.finalize, ...b(y)],
      };
    }
    return r;
  }
  function Le(e, t, r, o, n, i) {
    for (let l of t) {
      let a = r.get(l);
      a || r.set(l, (a = o(l)));
      let s = a(e, n, i);
      if (s) return s;
    }
  }
  function zt(e) {
    var t;
    return ve(e[0], typeof (t = e[1]) == "function" ? t : () => t);
  }
  function Ft(e) {
    var t, r;
    return Array.isArray(e) ? ve(e[0], we(e[1], e[2])) : ve(e, we(t, r));
  }
  function ve(e, t) {
    return Ue(e, (r, o, n, i) => {
      let l = o.exec(r);
      if (l) return (l.$$ = r.slice(l[0].length)), (l.dark = i), t(l, n);
    });
  }
  function Ue(e, t) {
    let r = b(e).map(Rt);
    return (o, n, i) => {
      for (let l of r) {
        let a = t(o, l, n, i);
        if (a) return a;
      }
    };
  }
  function Rt(e) {
    return typeof e == "string"
      ? RegExp("^" + e + (e.includes("$") || e.slice(-1) == "-" ? "" : "$"))
      : e;
  }
  function Tt(e, t) {
    let r = xe(e),
      o = (function ({
        theme: s,
        darkMode: f,
        darkColor: u = _,
        variants: p,
        rules: m,
        hash: y,
        stringify: x,
        ignorelist: k,
        finalize: A,
      }) {
        let B = new Map(),
          h = new Map(),
          S = new Map(),
          z = new Map(),
          Ce = Ue(k, (w, F) => F.test(w));
        p.push([
          "dark",
          Array.isArray(f) || f == "class"
            ? `${b(f)[1] || ".dark"} &`
            : typeof f == "string" && f != "media"
            ? f
            : "@media (prefers-color-scheme:dark)",
        ]);
        let G = typeof y == "function" ? (w) => y(w, te) : y ? te : Ae;
        G !== Ae &&
          A.push((w) => ({
            ...w,
            n: w.n && G(w.n),
            d: w.d?.replace(
              /--(tw(?:-[\w-]+)?)\b/g,
              (F, E) => "--" + G(E).replace("#", "")
            ),
          }));
        let W = {
          theme: (function ({ extend: w = {}, ...F }) {
            let E = {},
              or = {
                get colors() {
                  return Z("colors");
                },
                theme: Z,
                negative() {
                  return {};
                },
                breakpoints($) {
                  let T = {};
                  for (let j in $)
                    typeof $[j] == "string" && (T["screen-" + j] = $[j]);
                  return T;
                },
              };
            return Z;
            function Z($, T, j, Q) {
              if ($) {
                if (
                  (({ 1: $, 2: Q } = /^(\S+?)(?:\s*\/\s*([^/]+))?$/.exec($) || [
                    ,
                    $,
                  ]),
                  /[.[]/.test($))
                ) {
                  let V = [];
                  $.replace(/\[([^\]]+)\]|([^.[]+)/g, (H, ee, nr = ee) =>
                    V.push(nr)
                  ),
                    ($ = V.shift()),
                    (j = T),
                    (T = V.join("-"));
                }
                let M =
                  E[$] ||
                  Object.assign(Object.assign((E[$] = {}), ht(F, $)), ht(w, $));
                if (T == null) return M;
                T || (T = "DEFAULT");
                let P = M[T] ?? T.split("-").reduce((V, H) => V?.[H], M) ?? j;
                return Q ? L(P, { opacityValue: me(Q, Z) }) : P;
              }
              let K = {};
              for (let M of [...Object.keys(F), ...Object.keys(w)]) K[M] = Z(M);
              return K;
            }
            function ht($, T) {
              let j = $[T];
              return (
                typeof j == "function" && (j = j(or)),
                j && /color|fill|stroke/i.test(T)
                  ? (function Q(K, M = []) {
                      let P = {};
                      for (let V in K) {
                        let H = K[V],
                          ee = [...M, V];
                        (P[ee.join("-")] = H),
                          V == "DEFAULT" && ((ee = M), (P[M.join("-")] = H)),
                          typeof H == "object" && Object.assign(P, Q(H, ee));
                      }
                      return P;
                    })(j)
                  : j
              );
            }
          })(s),
          e: $e,
          h: G,
          s(w, F) {
            return x(w, F, W);
          },
          d(w, F, E) {
            return u(w, F, W, E);
          },
          v(w) {
            return (
              B.has(w) || B.set(w, Le(w, p, h, zt, W) || "&:" + w), B.get(w)
            );
          },
          r(w, F) {
            let E = JSON.stringify([w, F]);
            return (
              S.has(E) || S.set(E, !Ce(w, W) && Le(w, m, z, Ft, W, F)), S.get(E)
            );
          },
          f(w) {
            return A.reduce((F, E) => E(F, W), w);
          },
        };
        return W;
      })(r),
      n = new Map(),
      i = [],
      l = new Set();
    t.resume(
      (s) => n.set(s, s),
      (s, f) => {
        t.insert(s, i.length, f), i.push(f), l.add(s);
      }
    );
    function a(s) {
      let f = o.f(s),
        u = fe(f);
      if (u && !l.has(u)) {
        l.add(u);
        let p = Te(i, s);
        t.insert(u, p, s), i.splice(p, 0, s);
      }
      return f.n;
    }
    return Object.defineProperties(
      function (f) {
        if (!n.size)
          for (let p of b(r.preflight))
            typeof p == "function" && (p = p(o)),
              p &&
                (typeof p == "string"
                  ? be("", v.b, oe(p), o, v.b, [], !1, !0)
                  : De(p, {}, o, v.b)
                ).forEach(a);
        f = "" + f;
        let u = n.get(f);
        if (!u) {
          let p = new Set();
          for (let m of re(oe(f), o)) p.add(m.c).add(a(m));
          (u = [...p].filter(Boolean).join(" ")), n.set(f, u).set(u, u);
        }
        return u;
      },
      Object.getOwnPropertyDescriptors({
        get target() {
          return t.target;
        },
        theme: o.theme,
        config: r,
        snapshot() {
          let s = t.snapshot(),
            f = new Set(l),
            u = new Map(n),
            p = [...i];
          return () => {
            s(), (l = f), (n = u), (i = p);
          };
        },
        clear() {
          t.clear(), (l = new Set()), (n = new Map()), (i = []);
        },
        destroy() {
          this.clear(), t.destroy();
        },
      })
    );
  }
  function jt(e, t) {
    return e != t && "" + e.split(" ").sort() != "" + t.split(" ").sort();
  }
  function Ot(e) {
    let t = new MutationObserver(r);
    return {
      observe(n) {
        t.observe(n, {
          attributeFilter: ["class"],
          subtree: !0,
          childList: !0,
        }),
          o(n),
          r([{ target: n, type: "" }]);
      },
      disconnect() {
        t.disconnect();
      },
    };
    function r(n) {
      for (let { type: i, target: l } of n)
        if (i[0] == "a") o(l);
        else for (let a of l.querySelectorAll("[class]")) o(a);
      t.takeRecords();
    }
    function o(n) {
      let i,
        l = n.getAttribute?.("class");
      l && jt(l, (i = e(l))) && n.setAttribute("class", i);
    }
  }
  function Et(e = It, t = typeof document < "u" && document.documentElement) {
    if (t) {
      let r = Ot(e);
      r.observe(t);
      let { destroy: o } = e;
      e.destroy = () => {
        r.disconnect(), o.call(e);
      };
    }
    return e;
  }
  function Ie(e) {
    let t = document.querySelector(e || 'style[data-twind=""]');
    return (
      (!t || t.tagName != "STYLE") &&
        ((t = document.createElement("style")), document.head.prepend(t)),
      (t.dataset.twind = "claimed"),
      t
    );
  }
  function Dt(e) {
    let t = e?.cssRules ? e : (e && typeof e != "string" ? e : Ie(e)).sheet;
    return {
      target: t,
      snapshot() {
        let r = Array.from(t.cssRules, (o) => o.cssText);
        return () => {
          this.clear(), r.forEach(this.insert);
        };
      },
      clear() {
        for (let r = t.cssRules.length; r--; ) t.deleteRule(r);
      },
      destroy() {
        t.ownerNode?.remove();
      },
      insert(r, o) {
        try {
          t.insertRule(r, o);
        } catch {
          t.insertRule(":root{}", o);
        }
      },
      resume: _,
    };
  }
  function Wt(e) {
    let t = e && typeof e != "string" ? e : Ie(e);
    return {
      target: t,
      snapshot() {
        let r = Array.from(t.childNodes, (o) => o.textContent);
        return () => {
          this.clear(), r.forEach(this.insert);
        };
      },
      clear() {
        t.textContent = "";
      },
      destroy() {
        t.remove();
      },
      insert(r, o) {
        t.insertBefore(document.createTextNode(r), t.childNodes[o] || null);
      },
      resume: _,
    };
  }
  function Mt(e) {
    let t = [];
    return {
      target: t,
      snapshot() {
        let r = [...t];
        return () => {
          t.splice(0, t.length, ...r);
        };
      },
      clear() {
        t.length = 0;
      },
      destroy() {
        this.clear();
      },
      insert(r, o, n) {
        t.splice(
          o,
          0,
          e
            ? `/*!${n.p.toString(36)},${(2 * n.o).toString(36)}${
                n.n ? "," + n.n : ""
              }*/${r}`
            : r
        );
      },
      resume: _,
    };
  }
  function Ne(e, t) {
    let r = typeof document > "u" ? Mt(!t) : e ? Wt() : Dt();
    return t || (r.resume = Lt), r;
  }
  function Vt(e) {
    return (
      (e.ownerNode || e).textContent ||
      (e.cssRules ? Array.from(e.cssRules, (t) => t.cssText) : b(e)).join("")
    );
  }
  function Lt(e, t) {
    let r = Vt(this.target),
      o = /\/\*!([\da-z]+),([\da-z]+)(?:,(.+?))?\*\//g;
    if (o.test(r)) {
      var n;
      let i;
      if (((o.lastIndex = 0), this.clear(), typeof document < "u"))
        for (let l of document.querySelectorAll("[class]"))
          e(l.getAttribute("class"));
      for (
        ;
        (n = o.exec(r)),
          i &&
            t(r.slice(i.index + i[0].length, n?.index), {
              p: parseInt(i[1], 36),
              o: parseInt(i[2], 36) / 2,
              n: i[3],
            }),
          (i = n);

      );
    }
  }
  function Ut(e) {
    if (typeof document < "u" && document.currentScript) {
      let t = () => r.disconnect(),
        r = new MutationObserver((o) => {
          for (let { target: n } of o) if (n === document.body) return e(), t();
        });
      return (
        r.observe(document.documentElement, { childList: !0, subtree: !0 }), t
      );
    }
    return _;
  }
  var It = new Proxy(_, {
    apply(e, t, r) {
      return Y(r[0]);
    },
    get(e, t) {
      let r = Y[t];
      return typeof r == "function"
        ? function () {
            return r.apply(Y, arguments);
          }
        : r;
    },
  });
  function Nt(e = {}, t = Ne, r) {
    return Y?.destroy(), (Y = Et(Tt(e, typeof t == "function" ? t() : t), r));
  }
  function Bt(e, t = !0) {
    let r = xe(e);
    return Nt({ ...r, hash: r.hash ?? t }, () => Ne(!t));
  }
  var Pt = new Map([
    ["align-self", "-ms-grid-row-align"],
    ["color-adjust", "-webkit-print-color-adjust"],
    ["column-gap", "grid-column-gap"],
    ["forced-color-adjust", "-ms-high-contrast-adjust"],
    ["gap", "grid-gap"],
    ["grid-template-columns", "-ms-grid-columns"],
    ["grid-template-rows", "-ms-grid-rows"],
    ["justify-self", "-ms-grid-column-align"],
    ["margin-inline-end", "-webkit-margin-end"],
    ["margin-inline-start", "-webkit-margin-start"],
    ["mask-border", "-webkit-mask-box-image"],
    ["mask-border-outset", "-webkit-mask-box-image-outset"],
    ["mask-border-slice", "-webkit-mask-box-image-slice"],
    ["mask-border-source", "-webkit-mask-box-image-source"],
    ["mask-border-repeat", "-webkit-mask-box-image-repeat"],
    ["mask-border-width", "-webkit-mask-box-image-width"],
    ["overflow-wrap", "word-wrap"],
    ["padding-inline-end", "-webkit-padding-end"],
    ["padding-inline-start", "-webkit-padding-start"],
    ["print-color-adjust", "color-adjust"],
    ["row-gap", "grid-row-gap"],
    ["scroll-margin-bottom", "scroll-snap-margin-bottom"],
    ["scroll-margin-left", "scroll-snap-margin-left"],
    ["scroll-margin-right", "scroll-snap-margin-right"],
    ["scroll-margin-top", "scroll-snap-margin-top"],
    ["scroll-margin", "scroll-snap-margin"],
    ["text-combine-upright", "-ms-text-combine-horizontal"],
  ]);
  function Ht(e) {
    return Pt.get(e);
  }
  function _t(e) {
    var t =
      /^(?:(text-(?:decoration$|e|or|si)|back(?:ground-cl|d|f)|box-d|mask(?:$|-[ispro]|-cl)|pr|hyphena|flex-d)|(tab-|column(?!-s)|text-align-l)|(ap)|u|hy)/i.exec(
        e
      );
    return t ? (t[1] ? 1 : t[2] ? 2 : t[3] ? 3 : 5) : 0;
  }
  function qt(e, t) {
    var r =
      /^(?:(pos)|(cli)|(background-i)|(flex(?:$|-b)|(?:max-|min-)?(?:block-s|inl|he|widt))|dis)/i.exec(
        e
      );
    return r
      ? r[1]
        ? /^sti/i.test(t)
          ? 1
          : 0
        : r[2]
        ? /^pat/i.test(t)
          ? 1
          : 0
        : r[3]
        ? /^image-/i.test(t)
          ? 1
          : 0
        : r[4]
        ? t[3] === "-"
          ? 2
          : 0
        : /^(?:inline-)?grid$/i.test(t)
        ? 4
        : 0
      : 0;
  }
  var Gt = [
    ["-webkit-", 1],
    ["-moz-", 2],
    ["-ms-", 4],
  ];
  function Yt() {
    return ({ stringify: e }) => ({
      stringify(t, r, o) {
        let n = "",
          i = Ht(t);
        i && (n += e(i, r, o) + ";");
        let l = _t(t),
          a = qt(t, r);
        for (let s of Gt)
          l & s[1] && (n += e(s[0] + t, r, o) + ";"),
            a & s[1] && (n += e(t, s[0] + r, o) + ";");
        return n + e(t, r, o);
      },
    });
  }
  var ie = {
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    columns: {
      auto: "auto",
      "3xs": "16rem",
      "2xs": "18rem",
      xs: "20rem",
      sm: "24rem",
      md: "28rem",
      lg: "32rem",
      xl: "36rem",
      "2xl": "42rem",
      "3xl": "48rem",
      "4xl": "56rem",
      "5xl": "64rem",
      "6xl": "72rem",
      "7xl": "80rem",
    },
    spacing: {
      px: "1px",
      0: "0px",
      ...R(4, "rem", 4, 0.5, 0.5),
      ...R(12, "rem", 4, 5),
      14: "3.5rem",
      ...R(64, "rem", 4, 16, 4),
      72: "18rem",
      80: "20rem",
      96: "24rem",
    },
    durations: {
      75: "75ms",
      100: "100ms",
      150: "150ms",
      200: "200ms",
      300: "300ms",
      500: "500ms",
      700: "700ms",
      1e3: "1000ms",
    },
    animation: {
      none: "none",
      spin: "spin 1s linear infinite",
      ping: "ping 1s cubic-bezier(0,0,0.2,1) infinite",
      pulse: "pulse 2s cubic-bezier(0.4,0,0.6,1) infinite",
      bounce: "bounce 1s infinite",
    },
    aspectRatio: { auto: "auto", square: "1/1", video: "16/9" },
    backdropBlur: g("blur"),
    backdropBrightness: g("brightness"),
    backdropContrast: g("contrast"),
    backdropGrayscale: g("grayscale"),
    backdropHueRotate: g("hueRotate"),
    backdropInvert: g("invert"),
    backdropOpacity: g("opacity"),
    backdropSaturate: g("saturate"),
    backdropSepia: g("sepia"),
    backgroundColor: g("colors"),
    backgroundImage: { none: "none" },
    backgroundOpacity: g("opacity"),
    backgroundSize: { auto: "auto", cover: "cover", contain: "contain" },
    blur: {
      none: "none",
      0: "0",
      sm: "4px",
      DEFAULT: "8px",
      md: "12px",
      lg: "16px",
      xl: "24px",
      "2xl": "40px",
      "3xl": "64px",
    },
    brightness: {
      ...R(200, "", 100, 0, 50),
      ...R(110, "", 100, 90, 5),
      75: "0.75",
      125: "1.25",
    },
    borderColor: ({ theme: e }) => ({
      DEFAULT: e("colors.gray.200", "currentColor"),
      ...e("colors"),
    }),
    borderOpacity: g("opacity"),
    borderRadius: {
      none: "0px",
      sm: "0.125rem",
      DEFAULT: "0.25rem",
      md: "0.375rem",
      lg: "0.5rem",
      xl: "0.75rem",
      "2xl": "1rem",
      "3xl": "1.5rem",
      "1/2": "50%",
      full: "9999px",
    },
    borderSpacing: g("spacing"),
    borderWidth: { DEFAULT: "1px", ...O(8, "px") },
    boxShadow: {
      sm: "0 1px 2px 0 rgba(0,0,0,0.05)",
      DEFAULT: "0 1px 3px 0 rgba(0,0,0,0.1), 0 1px 2px -1px rgba(0,0,0,0.1)",
      md: "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1)",
      lg: "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)",
      xl: "0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)",
      "2xl": "0 25px 50px -12px rgba(0,0,0,0.25)",
      inner: "inset 0 2px 4px 0 rgba(0,0,0,0.05)",
      none: "0 0 #0000",
    },
    boxShadowColor: g("colors"),
    caretColor: g("colors"),
    accentColor: ({ theme: e }) => ({ auto: "auto", ...e("colors") }),
    contrast: { ...R(200, "", 100, 0, 50), 75: "0.75", 125: "1.25" },
    content: { none: "none" },
    divideColor: g("borderColor"),
    divideOpacity: g("borderOpacity"),
    divideWidth: g("borderWidth"),
    dropShadow: {
      sm: "0 1px 1px rgba(0,0,0,0.05)",
      DEFAULT: ["0 1px 2px rgba(0,0,0,0.1)", "0 1px 1px rgba(0,0,0,0.06)"],
      md: ["0 4px 3px rgba(0,0,0,0.07)", "0 2px 2px rgba(0,0,0,0.06)"],
      lg: ["0 10px 8px rgba(0,0,0,0.04)", "0 4px 3px rgba(0,0,0,0.1)"],
      xl: ["0 20px 13px rgba(0,0,0,0.03)", "0 8px 5px rgba(0,0,0,0.08)"],
      "2xl": "0 25px 25px rgba(0,0,0,0.15)",
      none: "0 0 #0000",
    },
    fill: ({ theme: e }) => ({ ...e("colors"), none: "none" }),
    grayscale: { DEFAULT: "100%", 0: "0" },
    hueRotate: {
      0: "0deg",
      15: "15deg",
      30: "30deg",
      60: "60deg",
      90: "90deg",
      180: "180deg",
    },
    invert: { DEFAULT: "100%", 0: "0" },
    flex: { 1: "1 1 0%", auto: "1 1 auto", initial: "0 1 auto", none: "none" },
    flexBasis: ({ theme: e }) => ({
      ...e("spacing"),
      ...X(2, 6),
      ...X(12, 12),
      auto: "auto",
      full: "100%",
    }),
    flexGrow: { DEFAULT: 1, 0: 0 },
    flexShrink: { DEFAULT: 1, 0: 0 },
    fontFamily: {
      sans: 'ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji"'.split(
        ","
      ),
      serif: 'ui-serif,Georgia,Cambria,"Times New Roman",Times,serif'.split(
        ","
      ),
      mono: 'ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace'.split(
        ","
      ),
    },
    fontSize: {
      xs: ["0.75rem", "1rem"],
      sm: ["0.875rem", "1.25rem"],
      base: ["1rem", "1.5rem"],
      lg: ["1.125rem", "1.75rem"],
      xl: ["1.25rem", "1.75rem"],
      "2xl": ["1.5rem", "2rem"],
      "3xl": ["1.875rem", "2.25rem"],
      "4xl": ["2.25rem", "2.5rem"],
      "5xl": ["3rem", "1"],
      "6xl": ["3.75rem", "1"],
      "7xl": ["4.5rem", "1"],
      "8xl": ["6rem", "1"],
      "9xl": ["8rem", "1"],
    },
    fontWeight: {
      thin: "100",
      extralight: "200",
      light: "300",
      normal: "400",
      medium: "500",
      semibold: "600",
      bold: "700",
      extrabold: "800",
      black: "900",
    },
    gap: g("spacing"),
    gradientColorStops: g("colors"),
    gridAutoColumns: {
      auto: "auto",
      min: "min-content",
      max: "max-content",
      fr: "minmax(0,1fr)",
    },
    gridAutoRows: {
      auto: "auto",
      min: "min-content",
      max: "max-content",
      fr: "minmax(0,1fr)",
    },
    gridColumn: { auto: "auto", "span-full": "1 / -1" },
    gridRow: { auto: "auto", "span-full": "1 / -1" },
    gridTemplateColumns: { none: "none" },
    gridTemplateRows: { none: "none" },
    height: ({ theme: e }) => ({
      ...e("spacing"),
      ...X(2, 6),
      min: "min-content",
      max: "max-content",
      fit: "fit-content",
      auto: "auto",
      full: "100%",
      screen: "100vh",
    }),
    inset: ({ theme: e }) => ({
      ...e("spacing"),
      ...X(2, 4),
      auto: "auto",
      full: "100%",
    }),
    keyframes: {
      spin: {
        from: { transform: "rotate(0deg)" },
        to: { transform: "rotate(360deg)" },
      },
      ping: {
        "0%": { transform: "scale(1)", opacity: "1" },
        "75%,100%": { transform: "scale(2)", opacity: "0" },
      },
      pulse: { "0%,100%": { opacity: "1" }, "50%": { opacity: ".5" } },
      bounce: {
        "0%, 100%": {
          transform: "translateY(-25%)",
          animationTimingFunction: "cubic-bezier(0.8,0,1,1)",
        },
        "50%": {
          transform: "none",
          animationTimingFunction: "cubic-bezier(0,0,0.2,1)",
        },
      },
    },
    letterSpacing: {
      tighter: "-0.05em",
      tight: "-0.025em",
      normal: "0em",
      wide: "0.025em",
      wider: "0.05em",
      widest: "0.1em",
    },
    lineHeight: {
      ...R(10, "rem", 4, 3),
      none: "1",
      tight: "1.25",
      snug: "1.375",
      normal: "1.5",
      relaxed: "1.625",
      loose: "2",
    },
    margin: ({ theme: e }) => ({ auto: "auto", ...e("spacing") }),
    maxHeight: ({ theme: e }) => ({
      full: "100%",
      min: "min-content",
      max: "max-content",
      fit: "fit-content",
      screen: "100vh",
      ...e("spacing"),
    }),
    maxWidth: ({ theme: e, breakpoints: t }) => ({
      ...t(e("screens")),
      none: "none",
      0: "0rem",
      xs: "20rem",
      sm: "24rem",
      md: "28rem",
      lg: "32rem",
      xl: "36rem",
      "2xl": "42rem",
      "3xl": "48rem",
      "4xl": "56rem",
      "5xl": "64rem",
      "6xl": "72rem",
      "7xl": "80rem",
      full: "100%",
      min: "min-content",
      max: "max-content",
      fit: "fit-content",
      prose: "65ch",
    }),
    minHeight: {
      0: "0px",
      full: "100%",
      min: "min-content",
      max: "max-content",
      fit: "fit-content",
      screen: "100vh",
    },
    minWidth: {
      0: "0px",
      full: "100%",
      min: "min-content",
      max: "max-content",
      fit: "fit-content",
    },
    opacity: {
      ...R(100, "", 100, 0, 10),
      5: "0.05",
      25: "0.25",
      75: "0.75",
      95: "0.95",
    },
    order: { first: "-9999", last: "9999", none: "0" },
    padding: g("spacing"),
    placeholderColor: g("colors"),
    placeholderOpacity: g("opacity"),
    outlineColor: g("colors"),
    outlineOffset: O(8, "px"),
    outlineWidth: O(8, "px"),
    ringColor: ({ theme: e }) => ({ ...e("colors"), DEFAULT: "#3b82f6" }),
    ringOffsetColor: g("colors"),
    ringOffsetWidth: O(8, "px"),
    ringOpacity: ({ theme: e }) => ({ ...e("opacity"), DEFAULT: "0.5" }),
    ringWidth: { DEFAULT: "3px", ...O(8, "px") },
    rotate: { ...O(2, "deg"), ...O(12, "deg", 3), ...O(180, "deg", 45) },
    saturate: R(200, "", 100, 0, 50),
    scale: {
      ...R(150, "", 100, 0, 50),
      ...R(110, "", 100, 90, 5),
      75: "0.75",
      125: "1.25",
    },
    scrollMargin: g("spacing"),
    scrollPadding: g("spacing"),
    sepia: { 0: "0", DEFAULT: "100%" },
    skew: { ...O(2, "deg"), ...O(12, "deg", 3) },
    space: g("spacing"),
    stroke: ({ theme: e }) => ({ ...e("colors"), none: "none" }),
    strokeWidth: R(2),
    textColor: g("colors"),
    textDecorationColor: g("colors"),
    textDecorationThickness: {
      "from-font": "from-font",
      auto: "auto",
      ...O(8, "px"),
    },
    textUnderlineOffset: { auto: "auto", ...O(8, "px") },
    textIndent: g("spacing"),
    textOpacity: g("opacity"),
    transitionDuration: ({ theme: e }) => ({
      ...e("durations"),
      DEFAULT: "150ms",
    }),
    transitionDelay: g("durations"),
    transitionProperty: {
      none: "none",
      all: "all",
      DEFAULT:
        "color,background-color,border-color,text-decoration-color,fill,stroke,opacity,box-shadow,transform,filter,backdrop-filter",
      colors:
        "color,background-color,border-color,text-decoration-color,fill,stroke",
      opacity: "opacity",
      shadow: "box-shadow",
      transform: "transform",
    },
    transitionTimingFunction: {
      DEFAULT: "cubic-bezier(0.4,0,0.2,1)",
      linear: "linear",
      in: "cubic-bezier(0.4,0,1,1)",
      out: "cubic-bezier(0,0,0.2,1)",
      "in-out": "cubic-bezier(0.4,0,0.2,1)",
    },
    translate: ({ theme: e }) => ({
      ...e("spacing"),
      ...X(2, 4),
      full: "100%",
    }),
    width: ({ theme: e }) => ({
      min: "min-content",
      max: "max-content",
      fit: "fit-content",
      screen: "100vw",
      ...e("flexBasis"),
    }),
    willChange: { scroll: "scroll-position" },
    zIndex: { ...R(50, "", 1, 0, 10), auto: "auto" },
  };
  function X(e, t) {
    let r = {};
    do
      for (var o = 1; o < e; o++)
        r[`${o}/${e}`] = Number(((o / e) * 100).toFixed(6)) + "%";
    while (++e <= t);
    return r;
  }
  function O(e, t, r = 0) {
    let o = {};
    for (; r <= e; r = 2 * r || 1) o[r] = r + t;
    return o;
  }
  function R(e, t = "", r = 1, o = 0, n = 1, i = {}) {
    for (; o <= e; o += n) i[o] = o / r + t;
    return i;
  }
  function g(e) {
    return ({ theme: t }) => t(e);
  }
  var Jt = {
      "*,::before,::after": {
        boxSizing: "border-box",
        borderWidth: "0",
        borderStyle: "solid",
        borderColor: "theme(borderColor.DEFAULT, currentColor)",
      },
      "::before,::after": { "--tw-content": "''" },
      html: {
        lineHeight: 1.5,
        WebkitTextSizeAdjust: "100%",
        MozTabSize: "4",
        tabSize: 4,
        fontFamily: `theme(fontFamily.sans, ${ie.fontFamily.sans})`,
        fontFeatureSettings:
          "theme(fontFamily.sans[1].fontFeatureSettings, normal)",
      },
      body: { margin: "0", lineHeight: "inherit" },
      hr: { height: "0", color: "inherit", borderTopWidth: "1px" },
      "abbr:where([title])": { textDecoration: "underline dotted" },
      "h1,h2,h3,h4,h5,h6": { fontSize: "inherit", fontWeight: "inherit" },
      a: { color: "inherit", textDecoration: "inherit" },
      "b,strong": { fontWeight: "bolder" },
      "code,kbd,samp,pre": {
        fontFamily: `theme(fontFamily.mono, ${ie.fontFamily.mono})`,
        fontFeatureSettings:
          "theme(fontFamily.mono[1].fontFeatureSettings, normal)",
        fontSize: "1em",
      },
      small: { fontSize: "80%" },
      "sub,sup": {
        fontSize: "75%",
        lineHeight: 0,
        position: "relative",
        verticalAlign: "baseline",
      },
      sub: { bottom: "-0.25em" },
      sup: { top: "-0.5em" },
      table: {
        textIndent: "0",
        borderColor: "inherit",
        borderCollapse: "collapse",
      },
      "button,input,optgroup,select,textarea": {
        fontFamily: "inherit",
        fontSize: "100%",
        lineHeight: "inherit",
        color: "inherit",
        margin: "0",
        padding: "0",
      },
      "button,select": { textTransform: "none" },
      "button,[type='button'],[type='reset'],[type='submit']": {
        WebkitAppearance: "button",
        backgroundColor: "transparent",
        backgroundImage: "none",
      },
      ":-moz-focusring": { outline: "auto" },
      ":-moz-ui-invalid": { boxShadow: "none" },
      progress: { verticalAlign: "baseline" },
      "::-webkit-inner-spin-button,::-webkit-outer-spin-button": {
        height: "auto",
      },
      "[type='search']": {
        WebkitAppearance: "textfield",
        outlineOffset: "-2px",
      },
      "::-webkit-search-decoration": { WebkitAppearance: "none" },
      "::-webkit-file-upload-button": {
        WebkitAppearance: "button",
        font: "inherit",
      },
      summary: { display: "list-item" },
      "blockquote,dl,dd,h1,h2,h3,h4,h5,h6,hr,figure,p,pre": { margin: "0" },
      fieldset: { margin: "0", padding: "0" },
      legend: { padding: "0" },
      "ol,ul,menu": { listStyle: "none", margin: "0", padding: "0" },
      textarea: { resize: "vertical" },
      "input::placeholder,textarea::placeholder": {
        opacity: 1,
        color: "theme(colors.gray.400, #9ca3af)",
      },
      'button,[role="button"]': { cursor: "pointer" },
      ":disabled": { cursor: "default" },
      "img,svg,video,canvas,audio,iframe,embed,object": {
        display: "block",
        verticalAlign: "middle",
      },
      "img,video": { maxWidth: "100%", height: "auto" },
      "[hidden]": { display: "none" },
    },
    Xt = [
      c("\\[([-\\w]+):(.+)]", ({ 1: e, 2: t }, r) => ({
        "@layer overrides": { "&": { [e]: U(`[${t}]`, "", r) } },
      })),
      c("(group|peer)([~/][^-[]+)?", ({ input: e }, { h: t }) => [{ c: t(e) }]),
      d("aspect-", "aspectRatio"),
      c("container", (e, { theme: t }) => {
        let {
            screens: r = t("screens"),
            center: o,
            padding: n,
          } = t("container"),
          i = {
            width: "100%",
            marginRight: o && "auto",
            marginLeft: o && "auto",
            ...l("xs"),
          };
        for (let a in r) {
          let s = r[a];
          typeof s == "string" &&
            (i[se(s)] = { "&": { maxWidth: s, ...l(a) } });
        }
        return i;
        function l(a) {
          let s = n && (typeof n == "string" ? n : n[a] || n.DEFAULT);
          if (s) return { paddingRight: s, paddingLeft: s };
        }
      }),
      d("content-", "content", ({ _: e }) => ({
        "--tw-content": e,
        content: "var(--tw-content)",
      })),
      c("(?:box-)?decoration-(slice|clone)", "boxDecorationBreak"),
      c("box-(border|content)", "boxSizing", ({ 1: e }) => e + "-box"),
      c("hidden", { display: "none" }),
      c("table-(auto|fixed)", "tableLayout"),
      c(
        [
          "(block|flex|table|grid|inline|contents|flow-root|list-item)",
          "(inline-(block|flex|table|grid))",
          "(table-(caption|cell|column|row|(column|row|footer|header)-group))",
        ],
        "display"
      ),
      "(float)-(left|right|none)",
      "(clear)-(left|right|none|both)",
      "(overflow(?:-[xy])?)-(auto|hidden|clip|visible|scroll)",
      "(isolation)-(auto)",
      c("isolate", "isolation"),
      c("object-(contain|cover|fill|none|scale-down)", "objectFit"),
      d("object-", "objectPosition"),
      c(
        "object-(top|bottom|center|(left|right)(-(top|bottom))?)",
        "objectPosition",
        ae
      ),
      c("overscroll(-[xy])?-(auto|contain|none)", ({ 1: e = "", 2: t }) => ({
        ["overscroll-behavior" + e]: t,
      })),
      c("(static|fixed|absolute|relative|sticky)", "position"),
      d("-?inset(-[xy])?(?:$|-)", "inset", ({ 1: e, _: t }) => ({
        top: e != "-x" && t,
        right: e != "-y" && t,
        bottom: e != "-x" && t,
        left: e != "-y" && t,
      })),
      d("-?(top|bottom|left|right)(?:$|-)", "inset"),
      c("(visible|collapse)", "visibility"),
      c("invisible", { visibility: "hidden" }),
      d("-?z-", "zIndex"),
      c("flex-((row|col)(-reverse)?)", "flexDirection", Be),
      c("flex-(wrap|wrap-reverse|nowrap)", "flexWrap"),
      d("(flex-(?:grow|shrink))(?:$|-)"),
      d("(flex)-"),
      d("grow(?:$|-)", "flexGrow"),
      d("shrink(?:$|-)", "flexShrink"),
      d("basis-", "flexBasis"),
      d("-?(order)-"),
      "-?(order)-(\\d+)",
      d("grid-cols-", "gridTemplateColumns"),
      c("grid-cols-(\\d+)", "gridTemplateColumns", Ge),
      d("col-", "gridColumn"),
      c("col-(span)-(\\d+)", "gridColumn", qe),
      d("col-start-", "gridColumnStart"),
      c("col-start-(auto|\\d+)", "gridColumnStart"),
      d("col-end-", "gridColumnEnd"),
      c("col-end-(auto|\\d+)", "gridColumnEnd"),
      d("grid-rows-", "gridTemplateRows"),
      c("grid-rows-(\\d+)", "gridTemplateRows", Ge),
      d("row-", "gridRow"),
      c("row-(span)-(\\d+)", "gridRow", qe),
      d("row-start-", "gridRowStart"),
      c("row-start-(auto|\\d+)", "gridRowStart"),
      d("row-end-", "gridRowEnd"),
      c("row-end-(auto|\\d+)", "gridRowEnd"),
      c("grid-flow-((row|col)(-dense)?)", "gridAutoFlow", (e) => ae(Be(e))),
      c("grid-flow-(dense)", "gridAutoFlow"),
      d("auto-cols-", "gridAutoColumns"),
      d("auto-rows-", "gridAutoRows"),
      d("gap-x(?:$|-)", "gap", "columnGap"),
      d("gap-y(?:$|-)", "gap", "rowGap"),
      d("gap(?:$|-)", "gap"),
      "(justify-(?:items|self))-",
      c("justify-", "justifyContent", Pe),
      c("(content|items|self)-", (e) => ({ ["align-" + e[1]]: Pe(e) })),
      c("(place-(content|items|self))-", ({ 1: e, $$: t }) => ({
        [e]: ("wun".includes(t[3]) ? "space-" : "") + t,
      })),
      d("p([xytrbl])?(?:$|-)", "padding", q("padding")),
      d("-?m([xytrbl])?(?:$|-)", "margin", q("margin")),
      d("-?space-(x|y)(?:$|-)", "space", ({ 1: e, _: t }) => ({
        "&>:not([hidden])~:not([hidden])": {
          [`--tw-space-${e}-reverse`]: "0",
          ["margin-" +
          { y: "top", x: "left" }[
            e
          ]]: `calc(${t} * calc(1 - var(--tw-space-${e}-reverse)))`,
          ["margin-" +
          { y: "bottom", x: "right" }[
            e
          ]]: `calc(${t} * var(--tw-space-${e}-reverse))`,
        },
      })),
      c("space-(x|y)-reverse", ({ 1: e }) => ({
        "&>:not([hidden])~:not([hidden])": { [`--tw-space-${e}-reverse`]: "1" },
      })),
      d("w-", "width"),
      d("min-w-", "minWidth"),
      d("max-w-", "maxWidth"),
      d("h-", "height"),
      d("min-h-", "minHeight"),
      d("max-h-", "maxHeight"),
      d("font-", "fontWeight"),
      d("font-", "fontFamily", ({ _: e }) =>
        typeof (e = b(e))[1] == "string"
          ? { fontFamily: D(e) }
          : { fontFamily: D(e[0]), ...e[1] }
      ),
      c("antialiased", {
        WebkitFontSmoothing: "antialiased",
        MozOsxFontSmoothing: "grayscale",
      }),
      c("subpixel-antialiased", {
        WebkitFontSmoothing: "auto",
        MozOsxFontSmoothing: "auto",
      }),
      c("italic", "fontStyle"),
      c("not-italic", { fontStyle: "normal" }),
      c(
        "(ordinal|slashed-zero|(normal|lining|oldstyle|proportional|tabular)-nums|(diagonal|stacked)-fractions)",
        ({ 1: e, 2: t = "", 3: r }) =>
          t == "normal"
            ? { fontVariantNumeric: "normal" }
            : {
                ["--tw-" +
                (r
                  ? "numeric-fraction"
                  : "pt".includes(t[0])
                  ? "numeric-spacing"
                  : t
                  ? "numeric-figure"
                  : e)]: e,
                fontVariantNumeric:
                  "var(--tw-ordinal) var(--tw-slashed-zero) var(--tw-numeric-figure) var(--tw-numeric-spacing) var(--tw-numeric-fraction)",
                ...I({
                  "--tw-ordinal": "var(--tw-empty,/*!*/ /*!*/)",
                  "--tw-slashed-zero": "var(--tw-empty,/*!*/ /*!*/)",
                  "--tw-numeric-figure": "var(--tw-empty,/*!*/ /*!*/)",
                  "--tw-numeric-spacing": "var(--tw-empty,/*!*/ /*!*/)",
                  "--tw-numeric-fraction": "var(--tw-empty,/*!*/ /*!*/)",
                }),
              }
      ),
      d("tracking-", "letterSpacing"),
      d("leading-", "lineHeight"),
      c("list-(inside|outside)", "listStylePosition"),
      d("list-", "listStyleType"),
      c("list-", "listStyleType"),
      d("placeholder-opacity-", "placeholderOpacity", ({ _: e }) => ({
        "&::placeholder": { "--tw-placeholder-opacity": e },
      })),
      C("placeholder-", { property: "color", selector: "&::placeholder" }),
      c("text-(left|center|right|justify|start|end)", "textAlign"),
      c("text-(ellipsis|clip)", "textOverflow"),
      d("text-opacity-", "textOpacity", "--tw-text-opacity"),
      C("text-", { property: "color" }),
      d("text-", "fontSize", ({ _: e }) =>
        typeof e == "string"
          ? { fontSize: e }
          : {
              fontSize: e[0],
              ...(typeof e[1] == "string" ? { lineHeight: e[1] } : e[1]),
            }
      ),
      d("indent-", "textIndent"),
      c("(overline|underline|line-through)", "textDecorationLine"),
      c("no-underline", { textDecorationLine: "none" }),
      d("underline-offset-", "textUnderlineOffset"),
      C("decoration-", {
        section: "textDecorationColor",
        opacityVariable: !1,
        opacitySection: "opacity",
      }),
      d("decoration-", "textDecorationThickness"),
      c("decoration-", "textDecorationStyle"),
      c("(uppercase|lowercase|capitalize)", "textTransform"),
      c("normal-case", { textTransform: "none" }),
      c("truncate", {
        overflow: "hidden",
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
      }),
      c("align-", "verticalAlign"),
      c("whitespace-", "whiteSpace"),
      c("break-normal", { wordBreak: "normal", overflowWrap: "normal" }),
      c("break-words", { overflowWrap: "break-word" }),
      c("break-all", { wordBreak: "break-all" }),
      c("break-keep", { wordBreak: "keep-all" }),
      C("caret-", { opacityVariable: !1, opacitySection: "opacity" }),
      C("accent-", { opacityVariable: !1, opacitySection: "opacity" }),
      c(
        "bg-gradient-to-([trbl]|[tb][rl])",
        "backgroundImage",
        ({ 1: e }) =>
          `linear-gradient(to ${N(e, " ")},var(--tw-gradient-stops))`
      ),
      C(
        "from-",
        {
          section: "gradientColorStops",
          opacityVariable: !1,
          opacitySection: "opacity",
        },
        ({ _: e }) => ({
          "--tw-gradient-from": e.value,
          "--tw-gradient-to": e.color({ opacityValue: "0" }),
          "--tw-gradient-stops":
            "var(--tw-gradient-from),var(--tw-gradient-to)",
        })
      ),
      C(
        "via-",
        {
          section: "gradientColorStops",
          opacityVariable: !1,
          opacitySection: "opacity",
        },
        ({ _: e }) => ({
          "--tw-gradient-to": e.color({ opacityValue: "0" }),
          "--tw-gradient-stops": `var(--tw-gradient-from),${e.value},var(--tw-gradient-to)`,
        })
      ),
      C("to-", {
        section: "gradientColorStops",
        property: "--tw-gradient-to",
        opacityVariable: !1,
        opacitySection: "opacity",
      }),
      c("bg-(fixed|local|scroll)", "backgroundAttachment"),
      c(
        "bg-origin-(border|padding|content)",
        "backgroundOrigin",
        ({ 1: e }) => e + "-box"
      ),
      c(
        ["bg-(no-repeat|repeat(-[xy])?)", "bg-repeat-(round|space)"],
        "backgroundRepeat"
      ),
      c("bg-blend-", "backgroundBlendMode"),
      c(
        "bg-clip-(border|padding|content|text)",
        "backgroundClip",
        ({ 1: e }) => e + (e == "text" ? "" : "-box")
      ),
      d("bg-opacity-", "backgroundOpacity", "--tw-bg-opacity"),
      C("bg-", { section: "backgroundColor" }),
      d("bg-", "backgroundImage"),
      d("bg-", "backgroundPosition"),
      c(
        "bg-(top|bottom|center|(left|right)(-(top|bottom))?)",
        "backgroundPosition",
        ae
      ),
      d("bg-", "backgroundSize"),
      d("rounded(?:$|-)", "borderRadius"),
      d(
        "rounded-([trbl]|[tb][rl])(?:$|-)",
        "borderRadius",
        ({ 1: e, _: t }) => {
          let r = {
            t: ["tl", "tr"],
            r: ["tr", "br"],
            b: ["bl", "br"],
            l: ["bl", "tl"],
          }[e] || [e, e];
          return {
            [`border-${N(r[0])}-radius`]: t,
            [`border-${N(r[1])}-radius`]: t,
          };
        }
      ),
      c("border-(collapse|separate)", "borderCollapse"),
      d("border-opacity(?:$|-)", "borderOpacity", "--tw-border-opacity"),
      c("border-(solid|dashed|dotted|double|none)", "borderStyle"),
      d("border-spacing(-[xy])?(?:$|-)", "borderSpacing", ({ 1: e, _: t }) => ({
        ...I({ "--tw-border-spacing-x": "0", "--tw-border-spacing-y": "0" }),
        ["--tw-border-spacing" + (e || "-x")]: t,
        ["--tw-border-spacing" + (e || "-y")]: t,
        "border-spacing":
          "var(--tw-border-spacing-x) var(--tw-border-spacing-y)",
      })),
      C("border-([xytrbl])-", { section: "borderColor" }, q("border", "Color")),
      C("border-"),
      d("border-([xytrbl])(?:$|-)", "borderWidth", q("border", "Width")),
      d("border(?:$|-)", "borderWidth"),
      d("divide-opacity(?:$|-)", "divideOpacity", ({ _: e }) => ({
        "&>:not([hidden])~:not([hidden])": { "--tw-divide-opacity": e },
      })),
      c("divide-(solid|dashed|dotted|double|none)", ({ 1: e }) => ({
        "&>:not([hidden])~:not([hidden])": { borderStyle: e },
      })),
      c("divide-([xy]-reverse)", ({ 1: e }) => ({
        "&>:not([hidden])~:not([hidden])": { ["--tw-divide-" + e]: "1" },
      })),
      d("divide-([xy])(?:$|-)", "divideWidth", ({ 1: e, _: t }) => {
        let r = { x: "lr", y: "tb" }[e];
        return {
          "&>:not([hidden])~:not([hidden])": {
            [`--tw-divide-${e}-reverse`]: "0",
            [`border-${N(
              r[0]
            )}Width`]: `calc(${t} * calc(1 - var(--tw-divide-${e}-reverse)))`,
            [`border-${N(
              r[1]
            )}Width`]: `calc(${t} * var(--tw-divide-${e}-reverse))`,
          },
        };
      }),
      C("divide-", {
        property: "borderColor",
        selector: "&>:not([hidden])~:not([hidden])",
      }),
      d("ring-opacity(?:$|-)", "ringOpacity", "--tw-ring-opacity"),
      C("ring-offset-", {
        property: "--tw-ring-offset-color",
        opacityVariable: !1,
      }),
      d("ring-offset(?:$|-)", "ringOffsetWidth", "--tw-ring-offset-width"),
      c("ring-inset", { "--tw-ring-inset": "inset" }),
      C("ring-", { property: "--tw-ring-color" }),
      d("ring(?:$|-)", "ringWidth", ({ _: e }, { theme: t }) => ({
        ...I({
          "--tw-ring-offset-shadow": "0 0 #0000",
          "--tw-ring-shadow": "0 0 #0000",
          "--tw-shadow": "0 0 #0000",
          "--tw-shadow-colored": "0 0 #0000",
          "&": {
            "--tw-ring-inset": "var(--tw-empty,/*!*/ /*!*/)",
            "--tw-ring-offset-width": t("ringOffsetWidth", "", "0px"),
            "--tw-ring-offset-color": L(t("ringOffsetColor", "", "#fff")),
            "--tw-ring-color": L(t("ringColor", "", "#93c5fd"), {
              opacityVariable: "--tw-ring-opacity",
            }),
            "--tw-ring-opacity": t("ringOpacity", "", "0.5"),
          },
        }),
        "--tw-ring-offset-shadow":
          "var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color)",
        "--tw-ring-shadow": `var(--tw-ring-inset) 0 0 0 calc(${e} + var(--tw-ring-offset-width)) var(--tw-ring-color)`,
        boxShadow:
          "var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)",
      })),
      C(
        "shadow-",
        {
          section: "boxShadowColor",
          opacityVariable: !1,
          opacitySection: "opacity",
        },
        ({ _: e }) => ({
          "--tw-shadow-color": e.value,
          "--tw-shadow": "var(--tw-shadow-colored)",
        })
      ),
      d("shadow(?:$|-)", "boxShadow", ({ _: e }) => ({
        ...I({
          "--tw-ring-offset-shadow": "0 0 #0000",
          "--tw-ring-shadow": "0 0 #0000",
          "--tw-shadow": "0 0 #0000",
          "--tw-shadow-colored": "0 0 #0000",
        }),
        "--tw-shadow": D(e),
        "--tw-shadow-colored": D(e).replace(
          /([^,]\s+)(?:#[a-f\d]+|(?:(?:hsl|rgb)a?|hwb|lab|lch|color|var)\(.+?\)|[a-z]+)(,|$)/g,
          "$1var(--tw-shadow-color)$2"
        ),
        boxShadow:
          "var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)",
      })),
      d("(opacity)-"),
      c("mix-blend-", "mixBlendMode"),
      ...He(),
      ...He("backdrop-"),
      d("transition(?:$|-)", "transitionProperty", (e, { theme: t }) => ({
        transitionProperty: D(e),
        transitionTimingFunction:
          e._ == "none" ? void 0 : D(t("transitionTimingFunction", "")),
        transitionDuration:
          e._ == "none" ? void 0 : D(t("transitionDuration", "")),
      })),
      d("duration(?:$|-)", "transitionDuration", "transitionDuration", D),
      d(
        "ease(?:$|-)",
        "transitionTimingFunction",
        "transitionTimingFunction",
        D
      ),
      d("delay(?:$|-)", "transitionDelay", "transitionDelay", D),
      d("animate(?:$|-)", "animation", (e, { theme: t, h: r, e: o }) => {
        let n = D(e),
          i = n.split(" "),
          l = t("keyframes", i[0]);
        return l
          ? { ["@keyframes " + (i[0] = o(r(i[0])))]: l, animation: i.join(" ") }
          : { animation: n };
      }),
      "(transform)-(none)",
      c("transform", Se),
      c("transform-(cpu|gpu)", ({ 1: e }) => ({
        "--tw-transform": _e(e == "gpu"),
      })),
      d("scale(-[xy])?-", "scale", ({ 1: e, _: t }) => ({
        ["--tw-scale" + (e || "-x")]: t,
        ["--tw-scale" + (e || "-y")]: t,
        ...Se(),
      })),
      d("-?(rotate)-", "rotate", ke),
      d("-?(translate-[xy])-", "translate", ke),
      d("-?(skew-[xy])-", "skew", ke),
      c(
        "origin-(center|((top|bottom)(-(left|right))?)|left|right)",
        "transformOrigin",
        ae
      ),
      "(appearance)-",
      d("(columns)-"),
      "(columns)-(\\d+)",
      "(break-(?:before|after|inside))-",
      d("(cursor)-"),
      "(cursor)-",
      c("snap-(none)", "scroll-snap-type"),
      c("snap-(x|y|both)", ({ 1: e }) => ({
        ...I({ "--tw-scroll-snap-strictness": "proximity" }),
        "scroll-snap-type": e + " var(--tw-scroll-snap-strictness)",
      })),
      c("snap-(mandatory|proximity)", "--tw-scroll-snap-strictness"),
      c("snap-(?:(start|end|center)|align-(none))", "scroll-snap-align"),
      c("snap-(normal|always)", "scroll-snap-stop"),
      c("scroll-(auto|smooth)", "scroll-behavior"),
      d("scroll-p([xytrbl])?(?:$|-)", "padding", q("scroll-padding")),
      d("-?scroll-m([xytrbl])?(?:$|-)", "scroll-margin", q("scroll-margin")),
      c("touch-(auto|none|manipulation)", "touch-action"),
      c(
        "touch-(pinch-zoom|pan-(?:(x|left|right)|(y|up|down)))",
        ({ 1: e, 2: t, 3: r }) => ({
          ...I({
            "--tw-pan-x": "var(--tw-empty,/*!*/ /*!*/)",
            "--tw-pan-y": "var(--tw-empty,/*!*/ /*!*/)",
            "--tw-pinch-zoom": "var(--tw-empty,/*!*/ /*!*/)",
            "--tw-touch-action":
              "var(--tw-pan-x) var(--tw-pan-y) var(--tw-pinch-zoom)",
          }),
          [`--tw-${t ? "pan-x" : r ? "pan-y" : e}`]: e,
          "touch-action": "var(--tw-touch-action)",
        })
      ),
      c("outline-none", {
        outline: "2px solid transparent",
        "outline-offset": "2px",
      }),
      c("outline", { outlineStyle: "solid" }),
      c("outline-(dashed|dotted|double)", "outlineStyle"),
      d("-?(outline-offset)-"),
      C("outline-", { opacityVariable: !1, opacitySection: "opacity" }),
      d("outline-", "outlineWidth"),
      "(pointer-events)-",
      d("(will-change)-"),
      "(will-change)-",
      [
        "resize(?:-(none|x|y))?",
        "resize",
        ({ 1: e }) => ({ x: "horizontal", y: "vertical" }[e] || e || "both"),
      ],
      c("select-(none|text|all|auto)", "userSelect"),
      C("fill-", {
        section: "fill",
        opacityVariable: !1,
        opacitySection: "opacity",
      }),
      C("stroke-", {
        section: "stroke",
        opacityVariable: !1,
        opacitySection: "opacity",
      }),
      d("stroke-", "strokeWidth"),
      c("sr-only", {
        position: "absolute",
        width: "1px",
        height: "1px",
        padding: "0",
        margin: "-1px",
        overflow: "hidden",
        whiteSpace: "nowrap",
        clip: "rect(0,0,0,0)",
        borderWidth: "0",
      }),
      c("not-sr-only", {
        position: "static",
        width: "auto",
        height: "auto",
        padding: "0",
        margin: "0",
        overflow: "visible",
        whiteSpace: "normal",
        clip: "auto",
      }),
    ];
  function ae(e) {
    return (typeof e == "string" ? e : e[1]).replace(/-/g, " ").trim();
  }
  function Be(e) {
    return (typeof e == "string" ? e : e[1]).replace("col", "column");
  }
  function N(e, t = "-") {
    let r = [];
    for (let o of e)
      r.push({ t: "top", r: "right", b: "bottom", l: "left" }[o]);
    return r.join(t);
  }
  function D(e) {
    return e && "" + (e._ || e);
  }
  function Pe({ $$: e }) {
    return (
      ({ r: "flex-", "": "flex-", w: "space-", u: "space-", n: "space-" }[
        e[3] || ""
      ] || "") + e
    );
  }
  function q(e, t = "") {
    return ({ 1: r, _: o }) => {
      let n = { x: "lr", y: "tb" }[r] || r + r;
      return n
        ? { ...ne(e + "-" + N(n[0]) + t, o), ...ne(e + "-" + N(n[1]) + t, o) }
        : ne(e + t, o);
    };
  }
  function He(e = "") {
    let t = [
        "blur",
        "brightness",
        "contrast",
        "grayscale",
        "hue-rotate",
        "invert",
        e && "opacity",
        "saturate",
        "sepia",
        !e && "drop-shadow",
      ].filter(Boolean),
      r = {};
    for (let o of t) r[`--tw-${e}${o}`] = "var(--tw-empty,/*!*/ /*!*/)";
    return (
      (r = {
        ...I(r),
        [`${e}filter`]: t.map((o) => `var(--tw-${e}${o})`).join(" "),
      }),
      [
        `(${e}filter)-(none)`,
        c(`${e}filter`, r),
        ...t.map((o) =>
          d(
            `${o[0] == "h" ? "-?" : ""}(${e}${o})(?:$|-)`,
            o,
            ({ 1: n, _: i }) => ({
              [`--tw-${n}`]: b(i)
                .map((l) => `${o}(${l})`)
                .join(" "),
              ...r,
            })
          )
        ),
      ]
    );
  }
  function ke({ 1: e, _: t }) {
    return { ["--tw-" + e]: t, ...Se() };
  }
  function Se() {
    return {
      ...I({
        "--tw-translate-x": "0",
        "--tw-translate-y": "0",
        "--tw-rotate": "0",
        "--tw-skew-x": "0",
        "--tw-skew-y": "0",
        "--tw-scale-x": "1",
        "--tw-scale-y": "1",
        "--tw-transform": _e(),
      }),
      transform: "var(--tw-transform)",
    };
  }
  function _e(e) {
    return [
      e
        ? "translate3d(var(--tw-translate-x),var(--tw-translate-y),0)"
        : "translateX(var(--tw-translate-x)) translateY(var(--tw-translate-y))",
      "rotate(var(--tw-rotate))",
      "skewX(var(--tw-skew-x))",
      "skewY(var(--tw-skew-y))",
      "scaleX(var(--tw-scale-x))",
      "scaleY(var(--tw-scale-y))",
    ].join(" ");
  }
  function qe({ 1: e, 2: t }) {
    return `${e} ${t} / ${e} ${t}`;
  }
  function Ge({ 1: e }) {
    return `repeat(${e},minmax(0,1fr))`;
  }
  function I(e) {
    return { "@layer defaults": { "*,::before,::after": e, "::backdrop": e } };
  }
  var Zt = [
    ["sticky", "@supports ((position: -webkit-sticky) or (position:sticky))"],
    ["motion-reduce", "@media (prefers-reduced-motion:reduce)"],
    ["motion-safe", "@media (prefers-reduced-motion:no-preference)"],
    ["print", "@media print"],
    ["(portrait|landscape)", ({ 1: e }) => `@media (orientation:${e})`],
    ["contrast-(more|less)", ({ 1: e }) => `@media (prefers-contrast:${e})`],
    [
      "(first-(letter|line)|placeholder|backdrop|before|after)",
      ({ 1: e }) => `&::${e}`,
    ],
    ["(marker|selection)", ({ 1: e }) => `& *::${e},&::${e}`],
    ["file", "&::file-selector-button"],
    ["(first|last|only)", ({ 1: e }) => `&:${e}-child`],
    ["even", "&:nth-child(2n)"],
    ["odd", "&:nth-child(odd)"],
    ["open", "&[open]"],
    [
      "(aria|data)-",
      ({ 1: e, $$: t }, r) =>
        t && `&[${e}-${r.theme(e, t) || U(t, "", r) || `${t}="true"`}]`,
    ],
    [
      "((group|peer)(~[^-[]+)?)(-\\[(.+)]|[-[].+?)(\\/.+)?",
      (
        { 2: e, 3: t = "", 4: r, 5: o = "", 6: n = t },
        { e: i, h: l, v: a }
      ) => {
        let s = J(o) || (r[0] == "[" ? r : a(r.slice(1)));
        return `${(s.includes("&") ? s : "&" + s).replace(
          /&/g,
          `:merge(.${i(l(e + n))})`
        )}${e[0] == "p" ? "~" : " "}&`;
      },
    ],
    ["(ltr|rtl)", ({ 1: e }) => `[dir="${e}"] &`],
    [
      "supports-",
      ({ $$: e }, t) => {
        if ((e && (e = t.theme("supports", e) || U(e, "", t)), e))
          return (
            e.includes(":") || (e += ":var(--tw)"),
            /^\w*\s*\(/.test(e) || (e = `(${e})`),
            `@supports ${e.replace(/\b(and|or|not)\b/g, " $1 ").trim()}`
          );
      },
    ],
    [
      "max-",
      ({ $$: e }, t) => {
        if (
          (e && (e = t.theme("screens", e) || U(e, "", t)),
          typeof e == "string")
        )
          return `@media not all and (min-width:${e})`;
      },
    ],
    [
      "min-",
      ({ $$: e }, t) => (
        e && (e = U(e, "", t)), e && `@media (min-width:${e})`
      ),
    ],
    [
      /^\[(.+)]$/,
      ({ 1: e }) => /[&@]/.test(e) && J(e).replace(/[}]+$/, "").split("{"),
    ],
  ];
  function Qt({ colors: e, disablePreflight: t } = {}) {
    return {
      preflight: t ? void 0 : Jt,
      theme: {
        ...ie,
        colors: {
          inherit: "inherit",
          current: "currentColor",
          transparent: "transparent",
          black: "#000",
          white: "#fff",
          ...e,
        },
      },
      variants: Zt,
      rules: Xt,
      finalize(r) {
        return r.n &&
          r.d &&
          r.r.some((o) => /^&::(before|after)$/.test(o)) &&
          !/(^|;)content:/.test(r.d)
          ? { ...r, d: "content:var(--tw-content);" + r.d }
          : r;
      },
    };
  }
  var Ye = {
      50: "#f8fafc",
      100: "#f1f5f9",
      200: "#e2e8f0",
      300: "#cbd5e1",
      400: "#94a3b8",
      500: "#64748b",
      600: "#475569",
      700: "#334155",
      800: "#1e293b",
      900: "#0f172a",
    },
    Je = {
      50: "#f9fafb",
      100: "#f3f4f6",
      200: "#e5e7eb",
      300: "#d1d5db",
      400: "#9ca3af",
      500: "#6b7280",
      600: "#4b5563",
      700: "#374151",
      800: "#1f2937",
      900: "#111827",
    },
    Xe = {
      50: "#fafafa",
      100: "#f4f4f5",
      200: "#e4e4e7",
      300: "#d4d4d8",
      400: "#a1a1aa",
      500: "#71717a",
      600: "#52525b",
      700: "#3f3f46",
      800: "#27272a",
      900: "#18181b",
    },
    Ze = {
      50: "#fafafa",
      100: "#f5f5f5",
      200: "#e5e5e5",
      300: "#d4d4d4",
      400: "#a3a3a3",
      500: "#737373",
      600: "#525252",
      700: "#404040",
      800: "#262626",
      900: "#171717",
    },
    Qe = {
      50: "#fafaf9",
      100: "#f5f5f4",
      200: "#e7e5e4",
      300: "#d6d3d1",
      400: "#a8a29e",
      500: "#78716c",
      600: "#57534e",
      700: "#44403c",
      800: "#292524",
      900: "#1c1917",
    },
    Ke = {
      50: "#fef2f2",
      100: "#fee2e2",
      200: "#fecaca",
      300: "#fca5a5",
      400: "#f87171",
      500: "#ef4444",
      600: "#dc2626",
      700: "#b91c1c",
      800: "#991b1b",
      900: "#7f1d1d",
    },
    et = {
      50: "#fff7ed",
      100: "#ffedd5",
      200: "#fed7aa",
      300: "#fdba74",
      400: "#fb923c",
      500: "#f97316",
      600: "#ea580c",
      700: "#c2410c",
      800: "#9a3412",
      900: "#7c2d12",
    },
    tt = {
      50: "#fffbeb",
      100: "#fef3c7",
      200: "#fde68a",
      300: "#fcd34d",
      400: "#fbbf24",
      500: "#f59e0b",
      600: "#d97706",
      700: "#b45309",
      800: "#92400e",
      900: "#78350f",
    },
    rt = {
      50: "#fefce8",
      100: "#fef9c3",
      200: "#fef08a",
      300: "#fde047",
      400: "#facc15",
      500: "#eab308",
      600: "#ca8a04",
      700: "#a16207",
      800: "#854d0e",
      900: "#713f12",
    },
    ot = {
      50: "#f7fee7",
      100: "#ecfccb",
      200: "#d9f99d",
      300: "#bef264",
      400: "#a3e635",
      500: "#84cc16",
      600: "#65a30d",
      700: "#4d7c0f",
      800: "#3f6212",
      900: "#365314",
    },
    nt = {
      50: "#f0fdf4",
      100: "#dcfce7",
      200: "#bbf7d0",
      300: "#86efac",
      400: "#4ade80",
      500: "#22c55e",
      600: "#16a34a",
      700: "#15803d",
      800: "#166534",
      900: "#14532d",
    },
    it = {
      50: "#ecfdf5",
      100: "#d1fae5",
      200: "#a7f3d0",
      300: "#6ee7b7",
      400: "#34d399",
      500: "#10b981",
      600: "#059669",
      700: "#047857",
      800: "#065f46",
      900: "#064e3b",
    },
    at = {
      50: "#f0fdfa",
      100: "#ccfbf1",
      200: "#99f6e4",
      300: "#5eead4",
      400: "#2dd4bf",
      500: "#14b8a6",
      600: "#0d9488",
      700: "#0f766e",
      800: "#115e59",
      900: "#134e4a",
    },
    lt = {
      50: "#ecfeff",
      100: "#cffafe",
      200: "#a5f3fc",
      300: "#67e8f9",
      400: "#22d3ee",
      500: "#06b6d4",
      600: "#0891b2",
      700: "#0e7490",
      800: "#155e75",
      900: "#164e63",
    },
    st = {
      50: "#f0f9ff",
      100: "#e0f2fe",
      200: "#bae6fd",
      300: "#7dd3fc",
      400: "#38bdf8",
      500: "#0ea5e9",
      600: "#0284c7",
      700: "#0369a1",
      800: "#075985",
      900: "#0c4a6e",
    },
    ct = {
      50: "#eff6ff",
      100: "#dbeafe",
      200: "#bfdbfe",
      300: "#93c5fd",
      400: "#60a5fa",
      500: "#3b82f6",
      600: "#2563eb",
      700: "#1d4ed8",
      800: "#1e40af",
      900: "#1e3a8a",
    },
    dt = {
      50: "#eef2ff",
      100: "#e0e7ff",
      200: "#c7d2fe",
      300: "#a5b4fc",
      400: "#818cf8",
      500: "#6366f1",
      600: "#4f46e5",
      700: "#4338ca",
      800: "#3730a3",
      900: "#312e81",
    },
    ft = {
      50: "#f5f3ff",
      100: "#ede9fe",
      200: "#ddd6fe",
      300: "#c4b5fd",
      400: "#a78bfa",
      500: "#8b5cf6",
      600: "#7c3aed",
      700: "#6d28d9",
      800: "#5b21b6",
      900: "#4c1d95",
    },
    pt = {
      50: "#faf5ff",
      100: "#f3e8ff",
      200: "#e9d5ff",
      300: "#d8b4fe",
      400: "#c084fc",
      500: "#a855f7",
      600: "#9333ea",
      700: "#7e22ce",
      800: "#6b21a8",
      900: "#581c87",
    },
    ut = {
      50: "#fdf4ff",
      100: "#fae8ff",
      200: "#f5d0fe",
      300: "#f0abfc",
      400: "#e879f9",
      500: "#d946ef",
      600: "#c026d3",
      700: "#a21caf",
      800: "#86198f",
      900: "#701a75",
    },
    gt = {
      50: "#fdf2f8",
      100: "#fce7f3",
      200: "#fbcfe8",
      300: "#f9a8d4",
      400: "#f472b6",
      500: "#ec4899",
      600: "#db2777",
      700: "#be185d",
      800: "#9d174d",
      900: "#831843",
    },
    mt = {
      50: "#fff1f2",
      100: "#ffe4e6",
      200: "#fecdd3",
      300: "#fda4af",
      400: "#fb7185",
      500: "#f43f5e",
      600: "#e11d48",
      700: "#be123c",
      800: "#9f1239",
      900: "#881337",
    },
    bt = {
      __proto__: null,
      slate: Ye,
      gray: Je,
      zinc: Xe,
      neutral: Ze,
      stone: Qe,
      red: Ke,
      orange: et,
      amber: tt,
      yellow: rt,
      lime: ot,
      green: nt,
      emerald: it,
      teal: at,
      cyan: lt,
      sky: st,
      blue: ct,
      indigo: dt,
      violet: ft,
      purple: pt,
      fuchsia: ut,
      pink: gt,
      rose: mt,
    };
  function Kt({ disablePreflight: e } = {}) {
    return Qt({ colors: bt, disablePreflight: e });
  }
  var er = {};
  yt(er, {
    amber: () => tt,
    blue: () => ct,
    cyan: () => lt,
    emerald: () => it,
    fuchsia: () => ut,
    gray: () => Je,
    green: () => nt,
    indigo: () => dt,
    lime: () => ot,
    neutral: () => Ze,
    orange: () => et,
    pink: () => gt,
    purple: () => pt,
    red: () => Ke,
    rose: () => mt,
    sky: () => st,
    slate: () => Ye,
    stone: () => Qe,
    teal: () => at,
    violet: () => ft,
    yellow: () => rt,
    zinc: () => Xe,
  });
  var ir = { ...ie, colors: bt },
    tr = Ut(rr);
  function rr({ disablePreflight: e, ...t } = {}, r) {
    return (
      tr(),
      Bt(
        xe({
          ...t,
          hash: !1,
          presets: [Yt(), Kt({ disablePreflight: e }), ...b(t.presets)],
        }),
        r
      )
    );
  }
})();
