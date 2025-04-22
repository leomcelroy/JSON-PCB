(() => {
  var __defProp = Object.defineProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };

  // node_modules/@twind/core/core.js
  var active;
  function toClassName(rule) {
    return [...rule.v, (rule.i ? "!" : "") + rule.n].join(":");
  }
  function format(rules2, seperator = ",") {
    return rules2.map(toClassName).join(seperator);
  }
  var escape =
    ("undefined" != typeof CSS && CSS.escape) || // Simplified: escaping only special characters
    // Needed for NodeJS and Edge <79 (https://caniuse.com/mdn-api_css_escape)
    ((className) =>
      className
        .replace(/[!"'`*+.,;:\\/<=>?@#$%&^|~()[\]{}]/g, "\\$&")
        .replace(/^\d/, "\\3$& "));
  function hash(value) {
    for (var h = 9, index = value.length; index--; )
      h = Math.imul(h ^ value.charCodeAt(index), 1597334677);
    return "#" + ((h ^ (h >>> 9)) >>> 0).toString(36);
  }
  function mql(screen, prefix = "@media ") {
    return (
      prefix +
      asArray(screen)
        .map((screen2) => {
          return (
            "string" == typeof screen2 &&
              (screen2 = {
                min: screen2,
              }),
            screen2.raw ||
              Object.keys(screen2)
                .map((feature) => `(${feature}-width:${screen2[feature]})`)
                .join(" and ")
          );
        })
        .join(",")
    );
  }
  function asArray(value = []) {
    return Array.isArray(value) ? value : null == value ? [] : [value];
  }
  function identity(value) {
    return value;
  }
  function noop() {}
  var Layer = {
    /**
     * 1. `default` (public)
     */
    d:
      /* efaults */
      0,
    /* Shifts.layer */
    /**
     * 2. `base` (public) — for things like reset rules or default styles applied to plain HTML elements.
     */
    b:
      /* ase */
      134217728,
    /* Shifts.layer */
    /**
     * 3. `components` (public, used by `style()`) — is for class-based styles that you want to be able to override with utilities.
     */
    c:
      /* omponents */
      268435456,
    /* Shifts.layer */
    // reserved for style():
    // - props: 0b011
    // - when: 0b100
    /**
     * 6. `aliases` (public, used by `apply()`) — `~(...)`
     */
    a:
      /* liases */
      671088640,
    /* Shifts.layer */
    /**
     * 6. `utilities` (public) — for small, single-purpose classes
     */
    u:
      /* tilities */
      805306368,
    /* Shifts.layer */
    /**
     * 7. `overrides` (public, used by `css()`)
     */
    o:
      /* verrides */
      939524096,
  };
  function seperatorPrecedence(string) {
    return string.match(/[-=:;]/g)?.length || 0;
  }
  function atRulePrecedence(css) {
    return (
      (Math.min(
        /(?:^|width[^\d]+)(\d+(?:.\d+)?)(p)?/.test(css)
          ? Math.max(
              0,
              29.63 * (+RegExp.$1 / (RegExp.$2 ? 15 : 1)) ** 0.137 - 43
            )
          : 0,
        15
      ) <<
        22) /* Shifts.responsive */ |
      (Math.min(seperatorPrecedence(css), 15) << 18)
    );
  }
  var PRECEDENCES_BY_PSEUDO_CLASS = [
    /* fi */
    "rst-c",
    /* hild: 0 */
    /* la */
    "st-ch",
    /* ild: 1 */
    // even and odd use: nth-child
    /* nt */
    "h-chi",
    /* ld: 2 */
    /* an */
    "y-lin",
    /* k: 3 */
    /* li */
    "nk",
    /* : 4 */
    /* vi */
    "sited",
    /* : 5 */
    /* ch */
    "ecked",
    /* : 6 */
    /* em */
    "pty",
    /* : 7 */
    /* re */
    "ad-on",
    /* ly: 8 */
    /* fo */
    "cus-w",
    /* ithin : 9 */
    /* ho */
    "ver",
    /* : 10 */
    /* fo */
    "cus",
    /* : 11 */
    /* fo */
    "cus-v",
    /* isible : 12 */
    /* ac */
    "tive",
    /* : 13 */
    /* di */
    "sable",
    /* d : 14 */
    /* op */
    "tiona",
    /* l: 15 */
    /* re */
    "quire",
  ];
  function convert(
    { n: name, i: important, v: variants2 = [] },
    context,
    precedence,
    conditions
  ) {
    name &&
      (name = toClassName({
        n: name,
        i: important,
        v: variants2,
      }));
    conditions = [...asArray(conditions)];
    for (let variant of variants2) {
      let screen = context.theme("screens", variant);
      for (let condition of asArray(
        (screen && mql(screen)) || context.v(variant)
      )) {
        var selector;
        conditions.push(condition);
        precedence |= screen
          ? 67108864 /* Shifts.screens */ | atRulePrecedence(condition)
          : "dark" == variant
          ? 1073741824
          : /* Shifts.darkMode */
          "@" == condition[0]
          ? atRulePrecedence(condition)
          : ((selector = condition), // use first found pseudo-class
            1 <<
              ~(
                (/:([a-z-]+)/.test(selector) &&
                  ~PRECEDENCES_BY_PSEUDO_CLASS.indexOf(
                    RegExp.$1.slice(2, 7)
                  )) ||
                -18
              ));
      }
    }
    return {
      n: name,
      p: precedence,
      r: conditions,
      i: important,
    };
  }
  var registry = /* @__PURE__ */ new Map();
  function stringify$1(rule) {
    if (rule.d) {
      let groups = [],
        selector = replaceEach(
          // merge all conditions into a selector string
          rule.r.reduce((selector2, condition) => {
            return "@" == condition[0]
              ? (groups.push(condition), selector2)
              : // Go over the selector and replace the matching multiple selectors if any
              condition
              ? replaceEach(selector2, (selectorPart) =>
                  replaceEach(
                    condition,
                    // If the current condition has a nested selector replace it
                    (conditionPart) => {
                      let mergeMatch = /(:merge\(.+?\))(:[a-z-]+|\\[.+])/.exec(
                        conditionPart
                      );
                      if (mergeMatch) {
                        let selectorIndex = selectorPart.indexOf(mergeMatch[1]);
                        return ~selectorIndex
                          ? // [':merge(.group):hover .rule', ':merge(.group):focus &'] -> ':merge(.group):focus:hover .rule'
                            // ':merge(.group)' + ':focus' + ':hover .rule'
                            selectorPart.slice(0, selectorIndex) +
                              mergeMatch[0] +
                              selectorPart.slice(
                                selectorIndex + mergeMatch[1].length
                              )
                          : // [':merge(.peer):focus~&', ':merge(.group):hover &'] -> ':merge(.peer):focus~:merge(.group):hover &'
                            replaceReference(selectorPart, conditionPart);
                      }
                      return replaceReference(conditionPart, selectorPart);
                    }
                  )
                )
              : selector2;
          }, "&"),
          // replace '&' with rule name or an empty string
          (selectorPart) =>
            replaceReference(selectorPart, rule.n ? "." + escape(rule.n) : "")
        );
      return (
        selector && groups.push(selector.replace(/:merge\((.+?)\)/g, "$1")),
        groups.reduceRight(
          (body, grouping) => grouping + "{" + body + "}",
          rule.d
        )
      );
    }
  }
  function replaceEach(selector, iteratee) {
    return selector.replace(
      / *((?:\(.+?\)|\[.+?\]|[^,])+) *(,|$)/g,
      (_, selectorPart, comma) => iteratee(selectorPart) + comma
    );
  }
  function replaceReference(selector, reference) {
    return selector.replace(/&/g, reference);
  }
  var collator = new Intl.Collator("en", {
    numeric: true,
  });
  function sortedInsertionIndex(array, element) {
    for (var low = 0, high = array.length; low < high; ) {
      let pivot = (high + low) >> 1;
      0 >= compareTwindRules(array[pivot], element)
        ? (low = pivot + 1)
        : (high = pivot);
    }
    return high;
  }
  function compareTwindRules(a2, b) {
    let layer = a2.p & Layer.o;
    return layer == (b.p & Layer.o) && (layer == Layer.b || layer == Layer.o)
      ? 0
      : a2.p - b.p ||
          a2.o - b.o ||
          collator.compare(byModifier(a2.n), byModifier(b.n)) ||
          collator.compare(byName(a2.n), byName(b.n));
  }
  function byModifier(s) {
    return (s || "").split(/:/).pop().split("/").pop() || "\0";
  }
  function byName(s) {
    return (
      (s || "").replace(/\W/g, (c) =>
        String.fromCharCode(127 + c.charCodeAt(0))
      ) + "\0"
    );
  }
  function parseColorComponent(chars, factor) {
    return Math.round(parseInt(chars, 16) * factor);
  }
  function toColorValue(color, options = {}) {
    if ("function" == typeof color) return color(options);
    let { opacityValue = "1", opacityVariable } = options,
      opacity = opacityVariable ? `var(${opacityVariable})` : opacityValue;
    if (color.includes("<alpha-value>"))
      return color.replace("<alpha-value>", opacity);
    if ("#" == color[0] && (4 == color.length || 7 == color.length)) {
      let size = (color.length - 1) / 3,
        factor = [17, 1, 0.062272][size - 1];
      return `rgba(${[
        parseColorComponent(color.substr(1, size), factor),
        parseColorComponent(color.substr(1 + size, size), factor),
        parseColorComponent(color.substr(1 + 2 * size, size), factor),
        opacity,
      ]})`;
    }
    return "1" == opacity
      ? color
      : "0" == opacity
      ? "#0000"
      : // convert rgb and hsl to alpha variant
        color.replace(/^(rgb|hsl)(\([^)]+)\)$/, `$1a$2,${opacity})`);
  }
  function serialize(style, rule, context, precedence, conditions = []) {
    return (function serialize$(
      style2,
      { n: name, p: precedence2, r: conditions2 = [], i: important },
      context2
    ) {
      let rules2 = [],
        declarations = "",
        maxPropertyPrecedence = 0,
        numberOfDeclarations = 0;
      for (let key in style2 || {}) {
        var layer, property;
        let value = style2[key];
        if ("@" == key[0]) {
          if (!value) continue;
          if ("a" == key[1]) {
            rules2.push(
              ...translateWith(
                name,
                precedence2,
                parse("" + value),
                context2,
                precedence2,
                conditions2,
                important,
                true
              )
            );
            continue;
          }
          if ("l" == key[1]) {
            for (let css of asArray(value))
              rules2.push(
                ...serialize$(
                  css,
                  {
                    n: name,
                    p:
                      ((layer = Layer[key[7]]), // Set layer (first reset, than set)
                      (precedence2 & ~Layer.o) | layer),
                    r: "d" == key[7] ? [] : conditions2,
                    i: important,
                  },
                  context2
                )
              );
            continue;
          }
          if ("i" == key[1]) {
            rules2.push(
              ...asArray(value).map((value2) => ({
                // before all layers
                p: -1,
                o: 0,
                r: [],
                d: key + " " + value2,
              }))
            );
            continue;
          }
          if ("k" == key[1]) {
            rules2.push({
              p: Layer.d,
              o: 0,
              r: [key],
              d: serialize$(
                value,
                {
                  p: Layer.d,
                },
                context2
              )
                .map(stringify$1)
                .join(""),
            });
            continue;
          }
          if ("f" == key[1]) {
            rules2.push(
              ...asArray(value).map((value2) => ({
                p: Layer.d,
                o: 0,
                r: [key],
                d: serialize$(
                  value2,
                  {
                    p: Layer.d,
                  },
                  context2
                )
                  .map(stringify$1)
                  .join(""),
              }))
            );
            continue;
          }
        }
        if ("object" != typeof value || Array.isArray(value)) {
          if ("label" == key && value)
            name =
              value + hash(JSON.stringify([precedence2, important, style2]));
          else if (value || 0 === value) {
            key = key.replace(/[A-Z]/g, (_) => "-" + _.toLowerCase());
            numberOfDeclarations += 1;
            maxPropertyPrecedence = Math.max(
              maxPropertyPrecedence,
              "-" == (property = key)[0]
                ? 0
                : seperatorPrecedence(property) +
                    (/^(?:(border-(?!w|c|sty)|[tlbr].{2,4}m?$|c.{7,8}$)|([fl].{5}l|g.{8}$|pl))/.test(
                      property
                    )
                      ? +!!RegExp.$1 /* +1 */ || -!!RegExp.$2
                      : /* -1 */
                        0) +
                    1
            );
            declarations +=
              (declarations ? ";" : "") +
              asArray(value)
                .map((value2) =>
                  context2.s(
                    key,
                    // support theme(...) function in values
                    // calc(100vh - theme('spacing.12'))
                    resolveThemeFunction("" + value2, context2.theme) +
                      (important ? " !important" : "")
                  )
                )
                .join(";");
          }
        } else if ("@" == key[0] || key.includes("&")) {
          let rulePrecedence = precedence2;
          if ("@" == key[0]) {
            key = key.replace(/\bscreen\(([^)]+)\)/g, (_, screenKey) => {
              let screen = context2.theme("screens", screenKey);
              return screen
                ? ((rulePrecedence |= 67108864) /* Shifts.screens */,
                  mql(screen, ""))
                : _;
            });
            rulePrecedence |= atRulePrecedence(key);
          }
          rules2.push(
            ...serialize$(
              value,
              {
                n: name,
                p: rulePrecedence,
                r: [...conditions2, key],
                i: important,
              },
              context2
            )
          );
        } else
          rules2.push(
            ...serialize$(
              value,
              {
                p: precedence2,
                r: [...conditions2, key],
              },
              context2
            )
          );
      }
      return (
        // PERF: prevent unshift using `rules = [{}]` above and then `rules[0] = {...}`
        rules2.unshift({
          n: name,
          p: precedence2,
          o:
            // number of declarations (descending)
            Math.max(0, 15 - numberOfDeclarations) + // greatest precedence of properties
            // if there is no property precedence this is most likely a custom property only declaration
            // these have the highest precedence
            1.5 * Math.min(maxPropertyPrecedence || 15, 15),
          r: conditions2,
          // stringified declarations
          d: declarations,
        }),
        rules2.sort(compareTwindRules)
      );
    })(style, convert(rule, context, precedence, conditions), context);
  }
  function resolveThemeFunction(value, theme3) {
    return value.replace(
      /theme\((["'`])?(.+?)\1(?:\s*,\s*(["'`])?(.+?)\3)?\)/g,
      (_, __, key, ___, defaultValue = "") => {
        let value2 = theme3(key, defaultValue);
        return "function" == typeof value2 && /color|fill|stroke/i.test(key)
          ? toColorValue(value2)
          : "" + asArray(value2).filter((v) => Object(v) !== v);
      }
    );
  }
  function merge(rules2, name) {
    let current;
    let result = [];
    for (let rule of rules2)
      if (rule.d && rule.n) {
        if (current?.p == rule.p && "" + current.r == "" + rule.r) {
          current.c = [current.c, rule.c].filter(Boolean).join(" ");
          current.d = current.d + ";" + rule.d;
        } else
          result.push(
            (current = {
              ...rule,
              n: rule.n && name,
            })
          );
      } else
        result.push({
          ...rule,
          n: rule.n && name,
        });
    return result;
  }
  function translate(
    rules2,
    context,
    precedence = Layer.u,
    conditions,
    important
  ) {
    let result = [];
    for (let rule of rules2)
      for (let cssRule of (function (
        rule2,
        context2,
        precedence2,
        conditions2,
        important2
      ) {
        rule2 = {
          ...rule2,
          i: rule2.i || important2,
        };
        let resolved = (function (rule3, context3) {
          let factory = registry.get(rule3.n);
          return factory
            ? factory(rule3, context3)
            : context3.r(rule3.n, "dark" == rule3.v[0]);
        })(rule2, context2);
        return resolved
          ? // a list of class names
            "string" == typeof resolved
            ? (({ r: conditions2, p: precedence2 } = convert(
                rule2,
                context2,
                precedence2,
                conditions2
              )),
              merge(
                translate(
                  parse(resolved),
                  context2,
                  precedence2,
                  conditions2,
                  rule2.i
                ),
                rule2.n
              ))
            : Array.isArray(resolved)
            ? resolved.map((rule3) => {
                var precedence1, layer;
                return {
                  o: 0,
                  ...rule3,
                  r: [...asArray(conditions2), ...asArray(rule3.r)],
                  p:
                    ((precedence1 = precedence2),
                    (layer = rule3.p ?? precedence2),
                    (precedence1 & ~Layer.o) | layer),
                };
              })
            : serialize(resolved, rule2, context2, precedence2, conditions2)
          : // propagate className as is
            [
              {
                c: toClassName(rule2),
                p: 0,
                o: 0,
                r: [],
              },
            ];
      })(rule, context, precedence, conditions, important))
        result.splice(sortedInsertionIndex(result, cssRule), 0, cssRule);
    return result;
  }
  function translateWith(
    name,
    layer,
    rules2,
    context,
    precedence,
    conditions,
    important,
    useOrderOfRules
  ) {
    return merge(
      (useOrderOfRules
        ? rules2.flatMap((rule) =>
            translate([rule], context, precedence, conditions, important)
          )
        : translate(rules2, context, precedence, conditions, important)
      ).map((rule) => {
        return (
          // do not move defaults
          // move only rules with a name unless they are in the base layer
          rule.p & Layer.o && (rule.n || layer == Layer.b)
            ? {
                ...rule,
                p: (rule.p & ~Layer.o) | layer,
                o: 0,
              }
            : rule
        );
      }),
      name
    );
  }
  function define(className, layer, rules2, useOrderOfRules) {
    var factory;
    return (
      (factory = (rule, context) => {
        let {
          n: name,
          p: precedence,
          r: conditions,
          i: important,
        } = convert(rule, context, layer);
        return (
          rules2 &&
          translateWith(
            name,
            layer,
            rules2,
            context,
            precedence,
            conditions,
            important,
            useOrderOfRules
          )
        );
      }),
      registry.set(className, factory),
      className
    );
  }
  function createRule(active2, current, loc) {
    if ("(" != active2[active2.length - 1]) {
      let variants2 = [],
        important = false,
        negated = false,
        name = "";
      for (let value of active2)
        if (!("(" == value || /[~@]$/.test(value))) {
          if ("!" == value[0]) {
            value = value.slice(1);
            important = !important;
          }
          if (value.endsWith(":")) {
            variants2["dark:" == value ? "unshift" : "push"](
              value.slice(0, -1)
            );
            continue;
          }
          if ("-" == value[0]) {
            value = value.slice(1);
            negated = !negated;
          }
          value.endsWith("-") && (value = value.slice(0, -1));
          value && "&" != value && (name += (name && "-") + value);
        }
      if (name) {
        negated && (name = "-" + name);
        current[0].push({
          n: name,
          v: variants2.filter(uniq),
          i: important,
        });
      }
    }
  }
  function uniq(value, index, values) {
    return values.indexOf(value) == index;
  }
  var cache = /* @__PURE__ */ new Map();
  function parse(token) {
    let parsed = cache.get(token);
    if (!parsed) {
      let active2 = [],
        current = [[]],
        startIndex = 0,
        skip = 0,
        comment = null,
        position2 = 0,
        commit = (isRule, endOffset = 0) => {
          if (startIndex != position2) {
            active2.push(token.slice(startIndex, position2 + endOffset));
            isRule && createRule(active2, current);
          }
          startIndex = position2 + 1;
        };
      for (; position2 < token.length; position2++) {
        let char = token[position2];
        if (skip)
          "\\" != token[position2 - 1] &&
            (skip += +("[" == char) || -("]" == char));
        else if ("[" == char) skip += 1;
        else if (comment) {
          if (
            "\\" != token[position2 - 1] &&
            comment.test(token.slice(position2))
          ) {
            comment = null;
            startIndex = position2 + RegExp.lastMatch.length;
          }
        } else if (
          "/" == char &&
          "\\" != token[position2 - 1] &&
          ("*" == token[position2 + 1] || "/" == token[position2 + 1])
        )
          comment = "*" == token[position2 + 1] ? /^\*\// : /^[\r\n]/;
        else if ("(" == char) {
          commit();
          active2.push(char);
        } else if (":" == char) ":" != token[position2 + 1] && commit(false, 1);
        else if (/[\s,)]/.test(char)) {
          commit(true);
          let lastGroup = active2.lastIndexOf("(");
          if (")" == char) {
            let nested = active2[lastGroup - 1];
            if (/[~@]$/.test(nested)) {
              let rules2 = current.shift();
              active2.length = lastGroup;
              createRule([...active2, "#"], current);
              let { v } = current[0].pop();
              for (let rule of rules2)
                rule.v.splice(
                  +("dark" == rule.v[0]) - +("dark" == v[0]),
                  v.length
                );
              createRule(
                [
                  ...active2,
                  define(
                    // named nested
                    nested.length > 1
                      ? nested.slice(0, -1) +
                          hash(JSON.stringify([nested, rules2]))
                      : nested + "(" + format(rules2) + ")",
                    Layer.a,
                    rules2,
                    /@$/.test(nested)
                  ),
                ],
                current
              );
            }
            lastGroup = active2.lastIndexOf("(", lastGroup - 1);
          }
          active2.length = lastGroup + 1;
        } else
          /[~@]/.test(char) &&
            "(" == token[position2 + 1] && // start nested block
            // ~(...) or button~(...)
            // @(...) or button@(...)
            current.unshift([]);
      }
      commit(true);
      cache.set(token, (parsed = current[0]));
    }
    return parsed;
  }
  function match(pattern, resolve, convert2) {
    return [pattern, fromMatch(resolve, convert2)];
  }
  function fromMatch(resolve, convert2) {
    return "function" == typeof resolve
      ? resolve
      : "string" == typeof resolve && /^[\w-]+$/.test(resolve)
      ? // a CSS property alias
        (match2, context) => ({
          [resolve]: convert2
            ? convert2(match2, context)
            : maybeNegate(match2, 1),
        })
      : (match2) =>
          // CSSObject, shortcut or apply
          resolve || {
            [match2[1]]: maybeNegate(match2, 2),
          };
  }
  function maybeNegate(
    match2,
    offset,
    value = match2.slice(offset).find(Boolean) || match2.$$ || match2.input
  ) {
    return "-" == match2.input[0] ? `calc(${value} * -1)` : value;
  }
  function matchTheme(pattern, section, resolve, convert2) {
    return [pattern, fromTheme(section, resolve, convert2)];
  }
  function fromTheme(section, resolve, convert2) {
    let factory =
      "string" == typeof resolve
        ? (match2, context) => ({
            [resolve]: convert2 ? convert2(match2, context) : match2._,
          })
        : resolve ||
          (({ 1: $1, _ }, context, section2) => ({
            [$1 || section2]: _,
          }));
    return (match2, context) => {
      let themeSection = camelize(section || match2[1]),
        value =
          context.theme(themeSection, match2.$$) ??
          arbitrary(match2.$$, themeSection, context);
      if (null != value)
        return (
          (match2._ = maybeNegate(match2, 0, value)),
          factory(match2, context, themeSection)
        );
    };
  }
  function matchColor(pattern, options = {}, resolve) {
    return [pattern, colorFromTheme(options, resolve)];
  }
  function colorFromTheme(options = {}, resolve) {
    return (match2, context) => {
      let { section = camelize(match2[0]).replace("-", "") + "Color" } =
          options,
        [colorMatch, opacityMatch] = parseValue(match2.$$);
      if (!colorMatch) return;
      let colorValue =
        context.theme(section, colorMatch) ||
        arbitrary(colorMatch, section, context);
      if (!colorValue || "object" == typeof colorValue) return;
      let {
          // text- -> --tw-text-opacity
          // ring-offset(?:-|$) -> --tw-ring-offset-opacity
          // TODO move this default into preset-tailwind?
          opacityVariable = `--tw-${match2[0].replace(/-$/, "")}-opacity`,
          opacitySection = section.replace("Color", "Opacity"),
          property = section,
          selector,
        } = options,
        opacityValue =
          context.theme(opacitySection, opacityMatch || "DEFAULT") ||
          (opacityMatch && arbitrary(opacityMatch, opacitySection, context)),
        create =
          resolve ||
          (({ _ }) => {
            let properties2 = toCSS(property, _);
            return selector
              ? {
                  [selector]: properties2,
                }
              : properties2;
          });
      match2._ = {
        value: toColorValue(colorValue, {
          opacityVariable: opacityVariable || void 0,
          opacityValue: opacityValue || void 0,
        }),
        color: (options2) => toColorValue(colorValue, options2),
        opacityVariable: opacityVariable || void 0,
        opacityValue: opacityValue || void 0,
      };
      let properties = create(match2, context);
      if (!match2.dark) {
        let darkColorValue = context.d(section, colorMatch, colorValue);
        if (darkColorValue && darkColorValue !== colorValue) {
          match2._ = {
            value: toColorValue(darkColorValue, {
              opacityVariable: opacityVariable || void 0,
              opacityValue: opacityValue || "1",
            }),
            color: (options2) => toColorValue(darkColorValue, options2),
            opacityVariable: opacityVariable || void 0,
            opacityValue: opacityValue || void 0,
          };
          properties = {
            "&": properties,
            [context.v("dark")]: create(match2, context),
          };
        }
      }
      return properties;
    };
  }
  function parseValue(input) {
    return (input.match(/^(\[[^\]]+]|[^/]+?)(?:\/(.+))?$/) || []).slice(1);
  }
  function toCSS(property, value) {
    let properties = {};
    if ("string" == typeof value) properties[property] = value;
    else {
      value.opacityVariable &&
        value.value.includes(value.opacityVariable) &&
        (properties[value.opacityVariable] = value.opacityValue || "1");
      properties[property] = value.value;
    }
    return properties;
  }
  function arbitrary(value, section, context) {
    if ("[" == value[0] && "]" == value.slice(-1)) {
      value = normalize(
        resolveThemeFunction(value.slice(1, -1), context.theme)
      );
      if (!section) return value;
      if (
        // Respect type hints from the user on ambiguous arbitrary values - https://tailwindcss.com/docs/adding-custom-styles#resolving-ambiguities
        !(
          // If this is a color section and the value is a hex color, color function or color name
          (
            (/color|fill|stroke/i.test(section) &&
              !(
                /^color:/.test(value) ||
                /^(#|((hsl|rgb)a?|hwb|lab|lch|color)\(|[a-z]+$)/.test(value)
              )) || // url(, [a-z]-gradient(, image(, cross-fade(, image-set(
            (/image/i.test(section) &&
              !(/^image:/.test(value) || /^[a-z-]+\(/.test(value))) || // font-*
            // - fontWeight (type: ['lookup', 'number', 'any'])
            // - fontFamily (type: ['lookup', 'generic-name', 'family-name'])
            (/weight/i.test(section) &&
              !(/^(number|any):/.test(value) || /^\d+$/.test(value))) || // bg-*
            // - backgroundPosition (type: ['lookup', ['position', { preferOnConflict: true }]])
            // - backgroundSize (type: ['lookup', 'length', 'percentage', 'size'])
            (/position/i.test(section) && /^(length|size):/.test(value))
          )
        )
      )
        return value.replace(/^[a-z-]+:/, "");
    }
  }
  function camelize(value) {
    return value.replace(/-./g, (x) => x[1].toUpperCase());
  }
  function normalize(value) {
    return (
      // Keep raw strings if it starts with `url(`
      value.includes("url(")
        ? value.replace(
            /(.*?)(url\(.*?\))(.*?)/g,
            (_, before = "", url, after = "") =>
              normalize(before) + url + normalize(after)
          )
        : value
            .replace(
              /(^|[^\\])_+/g,
              (fullMatch, characterBefore) =>
                characterBefore +
                " ".repeat(fullMatch.length - characterBefore.length)
            )
            .replace(/\\_/g, "_")
            .replace(/(calc|min|max|clamp)\(.+\)/g, (match2) =>
              match2.replace(
                /(-?\d*\.?\d(?!\b-.+[,)](?![^+\-/*])\D)(?:%|[a-z]+)?|\))([+\-/*])/g,
                "$1 $2 "
              )
            )
    );
  }
  function defineConfig({ presets = [], ...userConfig }) {
    let config = {
      darkMode: void 0,
      darkColor: void 0,
      preflight: false !== userConfig.preflight && [],
      theme: {},
      variants: asArray(userConfig.variants),
      rules: asArray(userConfig.rules),
      ignorelist: asArray(userConfig.ignorelist),
      hash: void 0,
      stringify: (property, value) => property + ":" + value,
      finalize: [],
    };
    for (let preset of asArray([
      ...presets,
      {
        darkMode: userConfig.darkMode,
        darkColor: userConfig.darkColor,
        preflight:
          false !== userConfig.preflight && asArray(userConfig.preflight),
        theme: userConfig.theme,
        hash: userConfig.hash,
        stringify: userConfig.stringify,
        finalize: userConfig.finalize,
      },
    ])) {
      let {
        preflight: preflight2,
        darkMode = config.darkMode,
        darkColor = config.darkColor,
        theme: theme3,
        variants: variants2,
        rules: rules2,
        ignorelist,
        hash: hash2 = config.hash,
        stringify: stringify2 = config.stringify,
        finalize,
      } = "function" == typeof preset ? preset(config) : preset;
      config = {
        // values defined by user or previous presets take precedence
        preflight: false !== config.preflight &&
          false !== preflight2 && [...config.preflight, ...asArray(preflight2)],
        darkMode,
        darkColor,
        theme: {
          ...config.theme,
          ...theme3,
          extend: {
            ...config.theme.extend,
            ...theme3?.extend,
          },
        },
        variants: [...config.variants, ...asArray(variants2)],
        rules: [...config.rules, ...asArray(rules2)],
        ignorelist: [...config.ignorelist, ...asArray(ignorelist)],
        hash: hash2,
        stringify: stringify2,
        finalize: [...config.finalize, ...asArray(finalize)],
      };
    }
    return config;
  }
  function find(value, list, cache2, getResolver, context, isDark) {
    for (let item of list) {
      let resolver = cache2.get(item);
      resolver || cache2.set(item, (resolver = getResolver(item)));
      let resolved = resolver(value, context, isDark);
      if (resolved) return resolved;
    }
  }
  function getVariantResolver(variant) {
    var resolve;
    return createResolve(
      variant[0],
      "function" == typeof (resolve = variant[1]) ? resolve : () => resolve
    );
  }
  function getRuleResolver(rule) {
    var resolve, convert2;
    return Array.isArray(rule)
      ? createResolve(rule[0], fromMatch(rule[1], rule[2]))
      : createResolve(rule, fromMatch(resolve, convert2));
  }
  function createResolve(patterns, resolve) {
    return createRegExpExecutor(
      patterns,
      (value, condition, context, isDark) => {
        let match2 = condition.exec(value);
        if (match2)
          return (
            // MATCH.$_ = value
            (match2.$$ = value.slice(match2[0].length)),
            (match2.dark = isDark),
            resolve(match2, context)
          );
      }
    );
  }
  function createRegExpExecutor(patterns, run) {
    let conditions = asArray(patterns).map(toCondition);
    return (value, context, isDark) => {
      for (let condition of conditions) {
        let result = run(value, condition, context, isDark);
        if (result) return result;
      }
    };
  }
  function toCondition(value) {
    return "string" == typeof value
      ? RegExp(
          "^" +
            value +
            (value.includes("$") || "-" == value.slice(-1) ? "" : "$")
        )
      : value;
  }
  function twind(userConfig, sheet) {
    let config = defineConfig(userConfig),
      context = (function ({
        theme: theme3,
        darkMode,
        darkColor = noop,
        variants: variants2,
        rules: rules2,
        hash: hash$1,
        stringify: stringify2,
        ignorelist,
        finalize,
      }) {
        let variantCache = /* @__PURE__ */ new Map(),
          variantResolvers = /* @__PURE__ */ new Map(),
          ruleCache = /* @__PURE__ */ new Map(),
          ruleResolvers = /* @__PURE__ */ new Map(),
          ignored = createRegExpExecutor(ignorelist, (value, condition) =>
            condition.test(value)
          );
        variants2.push([
          "dark",
          Array.isArray(darkMode) || "class" == darkMode
            ? `${asArray(darkMode)[1] || ".dark"} &`
            : "string" == typeof darkMode && "media" != darkMode
            ? darkMode
            : // a custom selector
              "@media (prefers-color-scheme:dark)",
        ]);
        let h =
          "function" == typeof hash$1
            ? (value) => hash$1(value, hash)
            : hash$1
            ? hash
            : identity;
        h !== identity &&
          finalize.push((rule) => ({
            ...rule,
            n: rule.n && h(rule.n),
            d: rule.d?.replace(
              /--(tw(?:-[\w-]+)?)\b/g,
              (_, property) => "--" + h(property).replace("#", "")
            ),
          }));
        let ctx = {
          theme: (function ({ extend = {}, ...base }) {
            let resolved = {},
              resolveContext = {
                get colors() {
                  return theme4("colors");
                },
                theme: theme4,
                // Stub implementation as negated values are automatically infered and do _not_ need to be in the theme
                negative() {
                  return {};
                },
                breakpoints(screens) {
                  let breakpoints = {};
                  for (let key in screens)
                    "string" == typeof screens[key] &&
                      (breakpoints["screen-" + key] = screens[key]);
                  return breakpoints;
                },
              };
            return theme4;
            function theme4(sectionKey, key, defaultValue, opacityValue) {
              if (sectionKey) {
                ({
                  1: sectionKey,
                  2: opacityValue,
                } = // eslint-disable-next-line no-sparse-arrays
                  /^(\S+?)(?:\s*\/\s*([^/]+))?$/.exec(sectionKey) || [
                    ,
                    sectionKey,
                  ]);
                if (/[.[]/.test(sectionKey)) {
                  let path = [];
                  sectionKey.replace(
                    /\[([^\]]+)\]|([^.[]+)/g,
                    (_, $1, $2 = $1) => path.push($2)
                  );
                  sectionKey = path.shift();
                  defaultValue = key;
                  key = path.join("-");
                }
                let section =
                  resolved[sectionKey] || // two-step deref to allow extend section to reference base section
                  Object.assign(
                    Object.assign(
                      // Make sure to not get into recursive calls
                      (resolved[sectionKey] = {}),
                      deref(base, sectionKey)
                    ),
                    deref(extend, sectionKey)
                  );
                if (null == key) return section;
                key || (key = "DEFAULT");
                let value =
                  section[key] ??
                  key.split("-").reduce((obj, prop) => obj?.[prop], section) ??
                  defaultValue;
                return opacityValue
                  ? toColorValue(value, {
                      opacityValue: resolveThemeFunction(opacityValue, theme4),
                    })
                  : value;
              }
              let result = {};
              for (let section1 of [
                ...Object.keys(base),
                ...Object.keys(extend),
              ])
                result[section1] = theme4(section1);
              return result;
            }
            function deref(source, section) {
              let value = source[section];
              return ("function" == typeof value &&
                (value = value(resolveContext)),
              value && /color|fill|stroke/i.test(section))
                ? (function flattenColorPalette(colors2, path = []) {
                    let flattend = {};
                    for (let key in colors2) {
                      let value2 = colors2[key],
                        keyPath = [...path, key];
                      flattend[keyPath.join("-")] = value2;
                      if ("DEFAULT" == key) {
                        keyPath = path;
                        flattend[path.join("-")] = value2;
                      }
                      "object" == typeof value2 &&
                        Object.assign(
                          flattend,
                          flattenColorPalette(value2, keyPath)
                        );
                    }
                    return flattend;
                  })(value)
                : value;
            }
          })(theme3),
          e: escape,
          h,
          s(property, value) {
            return stringify2(property, value, ctx);
          },
          d(section, key, color) {
            return darkColor(section, key, ctx, color);
          },
          v(value) {
            return (
              variantCache.has(value) ||
                variantCache.set(
                  value,
                  find(
                    value,
                    variants2,
                    variantResolvers,
                    getVariantResolver,
                    ctx
                  ) || "&:" + value
                ),
              variantCache.get(value)
            );
          },
          r(className, isDark) {
            let key = JSON.stringify([className, isDark]);
            return (
              ruleCache.has(key) ||
                ruleCache.set(
                  key,
                  !ignored(className, ctx) &&
                    find(
                      className,
                      rules2,
                      ruleResolvers,
                      getRuleResolver,
                      ctx,
                      isDark
                    )
                ),
              ruleCache.get(key)
            );
          },
          f(rule) {
            return finalize.reduce((rule2, p) => p(rule2, ctx), rule);
          },
        };
        return ctx;
      })(config),
      cache2 = /* @__PURE__ */ new Map(),
      sortedPrecedences = [],
      insertedRules = /* @__PURE__ */ new Set();
    sheet.resume(
      (className) => cache2.set(className, className),
      (cssText, rule) => {
        sheet.insert(cssText, sortedPrecedences.length, rule);
        sortedPrecedences.push(rule);
        insertedRules.add(cssText);
      }
    );
    function insert(rule) {
      let finalRule = context.f(rule),
        cssText = stringify$1(finalRule);
      if (cssText && !insertedRules.has(cssText)) {
        insertedRules.add(cssText);
        let index = sortedInsertionIndex(sortedPrecedences, rule);
        sheet.insert(cssText, index, rule);
        sortedPrecedences.splice(index, 0, rule);
      }
      return finalRule.n;
    }
    return Object.defineProperties(
      function tw2(tokens) {
        if (!cache2.size)
          for (let preflight2 of asArray(config.preflight)) {
            "function" == typeof preflight2 &&
              (preflight2 = preflight2(context));
            preflight2 &&
              ("string" == typeof preflight2
                ? translateWith(
                    "",
                    Layer.b,
                    parse(preflight2),
                    context,
                    Layer.b,
                    [],
                    false,
                    true
                  )
                : serialize(preflight2, {}, context, Layer.b)
              ).forEach(insert);
          }
        tokens = "" + tokens;
        let className = cache2.get(tokens);
        if (!className) {
          let classNames = /* @__PURE__ */ new Set();
          for (let rule of translate(parse(tokens), context))
            classNames.add(rule.c).add(insert(rule));
          className = [...classNames].filter(Boolean).join(" ");
          cache2.set(tokens, className).set(className, className);
        }
        return className;
      },
      Object.getOwnPropertyDescriptors({
        get target() {
          return sheet.target;
        },
        theme: context.theme,
        config,
        snapshot() {
          let restoreSheet = sheet.snapshot(),
            insertedRules$ = new Set(insertedRules),
            cache$ = new Map(cache2),
            sortedPrecedences$ = [...sortedPrecedences];
          return () => {
            restoreSheet();
            insertedRules = insertedRules$;
            cache2 = cache$;
            sortedPrecedences = sortedPrecedences$;
          };
        },
        clear() {
          sheet.clear();
          insertedRules = /* @__PURE__ */ new Set();
          cache2 = /* @__PURE__ */ new Map();
          sortedPrecedences = [];
        },
        destroy() {
          this.clear();
          sheet.destroy();
        },
      })
    );
  }
  function changed(a2, b) {
    return a2 != b && "" + a2.split(" ").sort() != "" + b.split(" ").sort();
  }
  function mo(tw2) {
    let observer = new MutationObserver(handleMutationRecords);
    return {
      observe(target) {
        observer.observe(target, {
          attributeFilter: ["class"],
          subtree: true,
          childList: true,
        });
        handleClassAttributeChange(target);
        handleMutationRecords([
          {
            target,
            type: "",
          },
        ]);
      },
      disconnect() {
        observer.disconnect();
      },
    };
    function handleMutationRecords(records) {
      for (let { type, target } of records)
        if ("a" == type[0]) handleClassAttributeChange(target);
        else
          for (let el of target.querySelectorAll("[class]"))
            handleClassAttributeChange(el);
      observer.takeRecords();
    }
    function handleClassAttributeChange(target) {
      let className;
      let tokens = target.getAttribute?.("class");
      tokens &&
        changed(tokens, (className = tw2(tokens))) && // Not using `target.className = ...` as that is read-only for SVGElements
        target.setAttribute("class", className);
    }
  }
  function observe(
    tw$1 = tw,
    target = "undefined" != typeof document && document.documentElement
  ) {
    if (target) {
      let observer = mo(tw$1);
      observer.observe(target);
      let { destroy } = tw$1;
      tw$1.destroy = () => {
        observer.disconnect();
        destroy.call(tw$1);
      };
    }
    return tw$1;
  }
  function getStyleElement(selector) {
    let style = document.querySelector(selector || 'style[data-twind=""]');
    if (!style || "STYLE" != style.tagName) {
      style = document.createElement("style");
      document.head.prepend(style);
    }
    return (style.dataset.twind = "claimed"), style;
  }
  function cssom(element) {
    let target = element?.cssRules
      ? element
      : (element && "string" != typeof element
          ? element
          : getStyleElement(element)
        ).sheet;
    return {
      target,
      snapshot() {
        let rules2 = Array.from(target.cssRules, (rule) => rule.cssText);
        return () => {
          this.clear();
          rules2.forEach(this.insert);
        };
      },
      clear() {
        for (let index = target.cssRules.length; index--; )
          target.deleteRule(index);
      },
      destroy() {
        target.ownerNode?.remove();
      },
      insert(cssText, index) {
        try {
          target.insertRule(cssText, index);
        } catch (error) {
          target.insertRule(":root{}", index);
        }
      },
      resume: noop,
    };
  }
  function dom(element) {
    let target =
      element && "string" != typeof element
        ? element
        : getStyleElement(element);
    return {
      target,
      snapshot() {
        let rules2 = Array.from(target.childNodes, (node) => node.textContent);
        return () => {
          this.clear();
          rules2.forEach(this.insert);
        };
      },
      clear() {
        target.textContent = "";
      },
      destroy() {
        target.remove();
      },
      insert(cssText, index) {
        target.insertBefore(
          document.createTextNode(cssText),
          target.childNodes[index] || null
        );
      },
      resume: noop,
    };
  }
  function virtual(includeResumeData) {
    let target = [];
    return {
      target,
      snapshot() {
        let rules2 = [...target];
        return () => {
          target.splice(0, target.length, ...rules2);
        };
      },
      clear() {
        target.length = 0;
      },
      destroy() {
        this.clear();
      },
      insert(css, index, rule) {
        target.splice(
          index,
          0,
          includeResumeData
            ? `/*!${rule.p.toString(36)},${(2 * rule.o).toString(36)}${
                rule.n ? "," + rule.n : ""
              }*/${css}`
            : css
        );
      },
      resume: noop,
    };
  }
  function getSheet(useDOMSheet, disableResume) {
    let sheet =
      "undefined" == typeof document
        ? virtual(!disableResume)
        : useDOMSheet
        ? dom()
        : cssom();
    return disableResume || (sheet.resume = resume), sheet;
  }
  function stringify(target) {
    return (
      // prefer the raw text content of a CSSStyleSheet as it may include the resume data
      (target.ownerNode || target).textContent ||
      (target.cssRules
        ? Array.from(target.cssRules, (rule) => rule.cssText)
        : asArray(target)
      ).join("")
    );
  }
  function resume(addClassName, insert) {
    let textContent = stringify(this.target),
      RE = /\/\*!([\da-z]+),([\da-z]+)(?:,(.+?))?\*\//g;
    if (RE.test(textContent)) {
      var match2;
      let lastMatch;
      RE.lastIndex = 0;
      this.clear();
      if ("undefined" != typeof document)
        for (let el of document.querySelectorAll("[class]"))
          addClassName(el.getAttribute("class"));
      for (
        ;
        (match2 = RE.exec(textContent)),
          lastMatch &&
            insert(
              // grep the cssText from the previous match end up to this match start
              textContent.slice(
                lastMatch.index + lastMatch[0].length,
                match2?.index
              ),
              {
                p: parseInt(lastMatch[1], 36),
                o: parseInt(lastMatch[2], 36) / 2,
                n: lastMatch[3],
              }
            ),
          (lastMatch = match2);

      );
    }
  }
  function auto(install3) {
    if ("undefined" != typeof document && document.currentScript) {
      let cancelAutoInstall2 = () => observer.disconnect(),
        observer = new MutationObserver((mutationsList) => {
          for (let { target } of mutationsList)
            if (target === document.body) {
              install3();
              return cancelAutoInstall2();
            }
        });
      return (
        observer.observe(document.documentElement, {
          childList: true,
          subtree: true,
        }),
        cancelAutoInstall2
      );
    }
    return noop;
  }
  var tw = /* @__PURE__ */ new Proxy(
    // just exposing the active as tw should work with most bundlers
    // as ES module export can be re-assigned BUT some bundlers to not honor this
    // -> using a delegation proxy here
    noop,
    {
      apply(_target, _thisArg, args) {
        return active(args[0]);
      },
      get(target, property) {
        let value = active[property];
        return "function" == typeof value
          ? function () {
              return value.apply(active, arguments);
            }
          : value;
      },
    }
  );
  function setup(config = {}, sheet = getSheet, target) {
    return (
      active?.destroy(),
      (active = observe(
        twind(config, "function" == typeof sheet ? sheet() : sheet),
        target
      ))
    );
  }
  function install(config, isProduction = true) {
    let config$ = defineConfig(config);
    return setup(
      {
        ...config$,
        // in production use short hashed class names
        hash: config$.hash ?? isProduction,
      },
      () => getSheet(!isProduction)
    );
  }

  // node_modules/style-vendorizer/dist/esm/bundle.min.mjs
  var i = /* @__PURE__ */ new Map([
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
  function r(r2) {
    return i.get(r2);
  }
  function a(i2) {
    var r2 =
      /^(?:(text-(?:decoration$|e|or|si)|back(?:ground-cl|d|f)|box-d|mask(?:$|-[ispro]|-cl)|pr|hyphena|flex-d)|(tab-|column(?!-s)|text-align-l)|(ap)|u|hy)/i.exec(
        i2
      );
    return r2 ? (r2[1] ? 1 : r2[2] ? 2 : r2[3] ? 3 : 5) : 0;
  }
  function t(i2, r2) {
    var a2 =
      /^(?:(pos)|(cli)|(background-i)|(flex(?:$|-b)|(?:max-|min-)?(?:block-s|inl|he|widt))|dis)/i.exec(
        i2
      );
    return a2
      ? a2[1]
        ? /^sti/i.test(r2)
          ? 1
          : 0
        : a2[2]
        ? /^pat/i.test(r2)
          ? 1
          : 0
        : a2[3]
        ? /^image-/i.test(r2)
          ? 1
          : 0
        : a2[4]
        ? "-" === r2[3]
          ? 2
          : 0
        : /^(?:inline-)?grid$/i.test(r2)
        ? 4
        : 0
      : 0;
  }

  // node_modules/@twind/preset-autoprefix/preset-autoprefix.js
  var CSSPrefixFlags = [
    ["-webkit-", 1],
    // 0b001
    ["-moz-", 2],
    // 0b010
    ["-ms-", 4],
  ];
  function presetAutoprefix() {
    return ({ stringify: stringify2 }) => ({
      stringify(property, value, context) {
        let cssText = "",
          propertyAlias = r(property);
        propertyAlias &&
          (cssText += stringify2(propertyAlias, value, context) + ";");
        let propertyFlags = a(property),
          valueFlags = t(property, value);
        for (let prefix of CSSPrefixFlags) {
          propertyFlags & prefix[1] &&
            (cssText += stringify2(prefix[0] + property, value, context) + ";");
          valueFlags & prefix[1] &&
            (cssText += stringify2(property, prefix[0] + value, context) + ";");
        }
        return cssText + stringify2(property, value, context);
      },
    });
  }

  // node_modules/@twind/preset-tailwind/baseTheme.js
  var theme = {
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    columns: {
      auto: "auto",
      // Handled by plugin,
      // 1: '1',
      // 2: '2',
      // 3: '3',
      // 4: '4',
      // 5: '5',
      // 6: '6',
      // 7: '7',
      // 8: '8',
      // 9: '9',
      // 10: '10',
      // 11: '11',
      // 12: '12',
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
      .../* @__PURE__ */ linear(4, "rem", 4, 0.5, 0.5),
      // 0.5: '0.125rem',
      // 1: '0.25rem',
      // 1.5: '0.375rem',
      // 2: '0.5rem',
      // 2.5: '0.625rem',
      // 3: '0.75rem',
      // 3.5: '0.875rem',
      // 4: '1rem',
      .../* @__PURE__ */ linear(12, "rem", 4, 5),
      // 5: '1.25rem',
      // 6: '1.5rem',
      // 7: '1.75rem',
      // 8: '2rem',
      // 9: '2.25rem',
      // 10: '2.5rem',
      // 11: '2.75rem',
      // 12: '3rem',
      14: "3.5rem",
      .../* @__PURE__ */ linear(64, "rem", 4, 16, 4),
      // 16: '4rem',
      // 20: '5rem',
      // 24: '6rem',
      // 28: '7rem',
      // 32: '8rem',
      // 36: '9rem',
      // 40: '10rem',
      // 44: '11rem',
      // 48: '12rem',
      // 52: '13rem',
      // 56: '14rem',
      // 60: '15rem',
      // 64: '16rem',
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
    aspectRatio: {
      auto: "auto",
      square: "1/1",
      video: "16/9",
    },
    backdropBlur: /* @__PURE__ */ alias("blur"),
    backdropBrightness: /* @__PURE__ */ alias("brightness"),
    backdropContrast: /* @__PURE__ */ alias("contrast"),
    backdropGrayscale: /* @__PURE__ */ alias("grayscale"),
    backdropHueRotate: /* @__PURE__ */ alias("hueRotate"),
    backdropInvert: /* @__PURE__ */ alias("invert"),
    backdropOpacity: /* @__PURE__ */ alias("opacity"),
    backdropSaturate: /* @__PURE__ */ alias("saturate"),
    backdropSepia: /* @__PURE__ */ alias("sepia"),
    backgroundColor: /* @__PURE__ */ alias("colors"),
    backgroundImage: {
      none: "none",
    },
    // These are built-in
    // 'gradient-to-t': 'linear-gradient(to top, var(--tw-gradient-stops))',
    // 'gradient-to-tr': 'linear-gradient(to top right, var(--tw-gradient-stops))',
    // 'gradient-to-r': 'linear-gradient(to right, var(--tw-gradient-stops))',
    // 'gradient-to-br': 'linear-gradient(to bottom right, var(--tw-gradient-stops))',
    // 'gradient-to-b': 'linear-gradient(to bottom, var(--tw-gradient-stops))',
    // 'gradient-to-bl': 'linear-gradient(to bottom left, var(--tw-gradient-stops))',
    // 'gradient-to-l': 'linear-gradient(to left, var(--tw-gradient-stops))',
    // 'gradient-to-tl': 'linear-gradient(to top left, var(--tw-gradient-stops))',
    backgroundOpacity: /* @__PURE__ */ alias("opacity"),
    // backgroundPosition: {
    //   // The following are already handled by the plugin:
    //   // center, right, left, bottom, top
    //   // 'bottom-10px-right-20px' -> bottom 10px right 20px
    // },
    backgroundSize: {
      auto: "auto",
      cover: "cover",
      contain: "contain",
    },
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
      .../* @__PURE__ */ linear(200, "", 100, 0, 50),
      // 0: '0',
      // 50: '.5',
      // 150: '1.5',
      // 200: '2',
      .../* @__PURE__ */ linear(110, "", 100, 90, 5),
      // 90: '.9',
      // 95: '.95',
      // 100: '1',
      // 105: '1.05',
      // 110: '1.1',
      75: "0.75",
      125: "1.25",
    },
    borderColor: ({ theme: theme3 }) => ({
      DEFAULT: theme3("colors.gray.200", "currentColor"),
      ...theme3("colors"),
    }),
    borderOpacity: /* @__PURE__ */ alias("opacity"),
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
    borderSpacing: /* @__PURE__ */ alias("spacing"),
    borderWidth: {
      DEFAULT: "1px",
      .../* @__PURE__ */ exponential(8, "px"),
    },
    // 0: '0px',
    // 2: '2px',
    // 4: '4px',
    // 8: '8px',
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
    boxShadowColor: alias("colors"),
    // container: {},
    // cursor: {
    //   // Default values are handled by plugin
    // },
    caretColor: /* @__PURE__ */ alias("colors"),
    accentColor: ({ theme: theme3 }) => ({
      auto: "auto",
      ...theme3("colors"),
    }),
    contrast: {
      .../* @__PURE__ */ linear(200, "", 100, 0, 50),
      // 0: '0',
      // 50: '.5',
      // 150: '1.5',
      // 200: '2',
      75: "0.75",
      125: "1.25",
    },
    content: {
      none: "none",
    },
    divideColor: /* @__PURE__ */ alias("borderColor"),
    divideOpacity: /* @__PURE__ */ alias("borderOpacity"),
    divideWidth: /* @__PURE__ */ alias("borderWidth"),
    dropShadow: {
      sm: "0 1px 1px rgba(0,0,0,0.05)",
      DEFAULT: ["0 1px 2px rgba(0,0,0,0.1)", "0 1px 1px rgba(0,0,0,0.06)"],
      md: ["0 4px 3px rgba(0,0,0,0.07)", "0 2px 2px rgba(0,0,0,0.06)"],
      lg: ["0 10px 8px rgba(0,0,0,0.04)", "0 4px 3px rgba(0,0,0,0.1)"],
      xl: ["0 20px 13px rgba(0,0,0,0.03)", "0 8px 5px rgba(0,0,0,0.08)"],
      "2xl": "0 25px 25px rgba(0,0,0,0.15)",
      none: "0 0 #0000",
    },
    fill: ({ theme: theme3 }) => ({
      ...theme3("colors"),
      none: "none",
    }),
    grayscale: {
      DEFAULT: "100%",
      0: "0",
    },
    hueRotate: {
      0: "0deg",
      15: "15deg",
      30: "30deg",
      60: "60deg",
      90: "90deg",
      180: "180deg",
    },
    invert: {
      DEFAULT: "100%",
      0: "0",
    },
    flex: {
      1: "1 1 0%",
      auto: "1 1 auto",
      initial: "0 1 auto",
      none: "none",
    },
    flexBasis: ({ theme: theme3 }) => ({
      ...theme3("spacing"),
      ...ratios(2, 6),
      // '1/2': '50%',
      // '1/3': '33.333333%',
      // '2/3': '66.666667%',
      // '1/4': '25%',
      // '2/4': '50%',
      // '3/4': '75%',
      // '1/5': '20%',
      // '2/5': '40%',
      // '3/5': '60%',
      // '4/5': '80%',
      // '1/6': '16.666667%',
      // '2/6': '33.333333%',
      // '3/6': '50%',
      // '4/6': '66.666667%',
      // '5/6': '83.333333%',
      ...ratios(12, 12),
      // '1/12': '8.333333%',
      // '2/12': '16.666667%',
      // '3/12': '25%',
      // '4/12': '33.333333%',
      // '5/12': '41.666667%',
      // '6/12': '50%',
      // '7/12': '58.333333%',
      // '8/12': '66.666667%',
      // '9/12': '75%',
      // '10/12': '83.333333%',
      // '11/12': '91.666667%',
      auto: "auto",
      full: "100%",
    }),
    flexGrow: {
      DEFAULT: 1,
      0: 0,
    },
    flexShrink: {
      DEFAULT: 1,
      0: 0,
    },
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
    gap: /* @__PURE__ */ alias("spacing"),
    gradientColorStops: /* @__PURE__ */ alias("colors"),
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
    gridColumn: {
      // span-X is handled by the plugin: span-1 -> span 1 / span 1
      auto: "auto",
      "span-full": "1 / -1",
    },
    // gridColumnEnd: {
    //   // Defaults handled by plugin
    // },
    // gridColumnStart: {
    //   // Defaults handled by plugin
    // },
    gridRow: {
      // span-X is handled by the plugin: span-1 -> span 1 / span 1
      auto: "auto",
      "span-full": "1 / -1",
    },
    // gridRowStart: {
    //   // Defaults handled by plugin
    // },
    // gridRowEnd: {
    //   // Defaults handled by plugin
    // },
    gridTemplateColumns: {
      // numbers are handled by the plugin: 1 -> repeat(1, minmax(0, 1fr))
      none: "none",
    },
    gridTemplateRows: {
      // numbers are handled by the plugin: 1 -> repeat(1, minmax(0, 1fr))
      none: "none",
    },
    height: ({ theme: theme3 }) => ({
      ...theme3("spacing"),
      ...ratios(2, 6),
      // '1/2': '50%',
      // '1/3': '33.333333%',
      // '2/3': '66.666667%',
      // '1/4': '25%',
      // '2/4': '50%',
      // '3/4': '75%',
      // '1/5': '20%',
      // '2/5': '40%',
      // '3/5': '60%',
      // '4/5': '80%',
      // '1/6': '16.666667%',
      // '2/6': '33.333333%',
      // '3/6': '50%',
      // '4/6': '66.666667%',
      // '5/6': '83.333333%',
      min: "min-content",
      max: "max-content",
      fit: "fit-content",
      auto: "auto",
      full: "100%",
      screen: "100vh",
    }),
    inset: ({ theme: theme3 }) => ({
      ...theme3("spacing"),
      ...ratios(2, 4),
      // '1/2': '50%',
      // '1/3': '33.333333%',
      // '2/3': '66.666667%',
      // '1/4': '25%',
      // '2/4': '50%',
      // '3/4': '75%',
      auto: "auto",
      full: "100%",
    }),
    keyframes: {
      spin: {
        from: {
          transform: "rotate(0deg)",
        },
        to: {
          transform: "rotate(360deg)",
        },
      },
      ping: {
        "0%": {
          transform: "scale(1)",
          opacity: "1",
        },
        "75%,100%": {
          transform: "scale(2)",
          opacity: "0",
        },
      },
      pulse: {
        "0%,100%": {
          opacity: "1",
        },
        "50%": {
          opacity: ".5",
        },
      },
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
      .../* @__PURE__ */ linear(10, "rem", 4, 3),
      // 3: '.75rem',
      // 4: '1rem',
      // 5: '1.25rem',
      // 6: '1.5rem',
      // 7: '1.75rem',
      // 8: '2rem',
      // 9: '2.25rem',
      // 10: '2.5rem',
      none: "1",
      tight: "1.25",
      snug: "1.375",
      normal: "1.5",
      relaxed: "1.625",
      loose: "2",
    },
    // listStyleType: {
    //   // Defaults handled by plugin
    // },
    margin: ({ theme: theme3 }) => ({
      auto: "auto",
      ...theme3("spacing"),
    }),
    maxHeight: ({ theme: theme3 }) => ({
      full: "100%",
      min: "min-content",
      max: "max-content",
      fit: "fit-content",
      screen: "100vh",
      ...theme3("spacing"),
    }),
    maxWidth: ({ theme: theme3, breakpoints }) => ({
      ...breakpoints(theme3("screens")),
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
    // objectPosition: {
    //   // The plugins joins all arguments by default
    // },
    opacity: {
      .../* @__PURE__ */ linear(100, "", 100, 0, 10),
      // 0: '0',
      // 10: '0.1',
      // 20: '0.2',
      // 30: '0.3',
      // 40: '0.4',
      // 60: '0.6',
      // 70: '0.7',
      // 80: '0.8',
      // 90: '0.9',
      // 100: '1',
      5: "0.05",
      25: "0.25",
      75: "0.75",
      95: "0.95",
    },
    order: {
      // Handled by plugin
      // 1: '1',
      // 2: '2',
      // 3: '3',
      // 4: '4',
      // 5: '5',
      // 6: '6',
      // 7: '7',
      // 8: '8',
      // 9: '9',
      // 10: '10',
      // 11: '11',
      // 12: '12',
      first: "-9999",
      last: "9999",
      none: "0",
    },
    padding: /* @__PURE__ */ alias("spacing"),
    placeholderColor: /* @__PURE__ */ alias("colors"),
    placeholderOpacity: /* @__PURE__ */ alias("opacity"),
    outlineColor: /* @__PURE__ */ alias("colors"),
    outlineOffset: /* @__PURE__ */ exponential(8, "px"),
    // 0: '0px',
    // 1: '1px',
    // 2: '2px',
    // 4: '4px',
    // 8: '8px',,
    outlineWidth: /* @__PURE__ */ exponential(8, "px"),
    // 0: '0px',
    // 1: '1px',
    // 2: '2px',
    // 4: '4px',
    // 8: '8px',,
    ringColor: ({ theme: theme3 }) => ({
      ...theme3("colors"),
      DEFAULT: "#3b82f6",
    }),
    ringOffsetColor: /* @__PURE__ */ alias("colors"),
    ringOffsetWidth: /* @__PURE__ */ exponential(8, "px"),
    // 0: '0px',
    // 1: '1px',
    // 2: '2px',
    // 4: '4px',
    // 8: '8px',,
    ringOpacity: ({ theme: theme3 }) => ({
      ...theme3("opacity"),
      DEFAULT: "0.5",
    }),
    ringWidth: {
      DEFAULT: "3px",
      .../* @__PURE__ */ exponential(8, "px"),
    },
    // 0: '0px',
    // 1: '1px',
    // 2: '2px',
    // 4: '4px',
    // 8: '8px',
    rotate: {
      .../* @__PURE__ */ exponential(2, "deg"),
      // 0: '0deg',
      // 1: '1deg',
      // 2: '2deg',
      .../* @__PURE__ */ exponential(12, "deg", 3),
      // 3: '3deg',
      // 6: '6deg',
      // 12: '12deg',
      .../* @__PURE__ */ exponential(180, "deg", 45),
    },
    // 45: '45deg',
    // 90: '90deg',
    // 180: '180deg',
    saturate: /* @__PURE__ */ linear(200, "", 100, 0, 50),
    // 0: '0',
    // 50: '.5',
    // 100: '1',
    // 150: '1.5',
    // 200: '2',
    scale: {
      .../* @__PURE__ */ linear(150, "", 100, 0, 50),
      // 0: '0',
      // 50: '.5',
      // 150: '1.5',
      .../* @__PURE__ */ linear(110, "", 100, 90, 5),
      // 90: '.9',
      // 95: '.95',
      // 100: '1',
      // 105: '1.05',
      // 110: '1.1',
      75: "0.75",
      125: "1.25",
    },
    scrollMargin: /* @__PURE__ */ alias("spacing"),
    scrollPadding: /* @__PURE__ */ alias("spacing"),
    sepia: {
      0: "0",
      DEFAULT: "100%",
    },
    skew: {
      .../* @__PURE__ */ exponential(2, "deg"),
      // 0: '0deg',
      // 1: '1deg',
      // 2: '2deg',
      .../* @__PURE__ */ exponential(12, "deg", 3),
    },
    // 3: '3deg',
    // 6: '6deg',
    // 12: '12deg',
    space: /* @__PURE__ */ alias("spacing"),
    stroke: ({ theme: theme3 }) => ({
      ...theme3("colors"),
      none: "none",
    }),
    strokeWidth: /* @__PURE__ */ linear(2),
    // 0: '0',
    // 1: '1',
    // 2: '2',,
    textColor: /* @__PURE__ */ alias("colors"),
    textDecorationColor: /* @__PURE__ */ alias("colors"),
    textDecorationThickness: {
      "from-font": "from-font",
      auto: "auto",
      .../* @__PURE__ */ exponential(8, "px"),
    },
    // 0: '0px',
    // 1: '1px',
    // 2: '2px',
    // 4: '4px',
    // 8: '8px',
    textUnderlineOffset: {
      auto: "auto",
      .../* @__PURE__ */ exponential(8, "px"),
    },
    // 0: '0px',
    // 1: '1px',
    // 2: '2px',
    // 4: '4px',
    // 8: '8px',
    textIndent: /* @__PURE__ */ alias("spacing"),
    textOpacity: /* @__PURE__ */ alias("opacity"),
    // transformOrigin: {
    //   // The following are already handled by the plugin:
    //   // center, right, left, bottom, top
    //   // 'bottom-10px-right-20px' -> bottom 10px right 20px
    // },
    transitionDuration: ({ theme: theme3 }) => ({
      ...theme3("durations"),
      DEFAULT: "150ms",
    }),
    transitionDelay: /* @__PURE__ */ alias("durations"),
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
    translate: ({ theme: theme3 }) => ({
      ...theme3("spacing"),
      ...ratios(2, 4),
      // '1/2': '50%',
      // '1/3': '33.333333%',
      // '2/3': '66.666667%',
      // '1/4': '25%',
      // '2/4': '50%',
      // '3/4': '75%',
      full: "100%",
    }),
    width: ({ theme: theme3 }) => ({
      min: "min-content",
      max: "max-content",
      fit: "fit-content",
      screen: "100vw",
      ...theme3("flexBasis"),
    }),
    willChange: {
      scroll: "scroll-position",
    },
    // other options handled by rules
    // auto: 'auto',
    // contents: 'contents',
    // transform: 'transform',
    zIndex: {
      .../* @__PURE__ */ linear(50, "", 1, 0, 10),
      // 0: '0',
      // 10: '10',
      // 20: '20',
      // 30: '30',
      // 40: '40',
      // 50: '50',
      auto: "auto",
    },
  };
  function ratios(start, end) {
    let result = {};
    do
      for (var dividend = 1; dividend < start; dividend++)
        result[`${dividend}/${start}`] =
          Number(((dividend / start) * 100).toFixed(6)) + "%";
    while (++start <= end);
    return result;
  }
  function exponential(stop, unit, start = 0) {
    let result = {};
    for (; start <= stop; start = 2 * start || 1) result[start] = start + unit;
    return result;
  }
  function linear(
    stop,
    unit = "",
    divideBy = 1,
    start = 0,
    step = 1,
    result = {}
  ) {
    for (; start <= stop; start += step)
      result[start] = start / divideBy + unit;
    return result;
  }
  function alias(section) {
    return ({ theme: theme3 }) => theme3(section);
  }

  // node_modules/@twind/preset-tailwind/preflight.js
  var preflight = {
    /*
    1. Prevent padding and border from affecting element width. (https://github.com/mozdevs/cssremedy/issues/4)
    2. Allow adding a border to an element by just adding a border-width. (https://github.com/tailwindcss/tailwindcss/pull/116)
    */
    "*,::before,::after": {
      boxSizing: "border-box",
      /* 1 */
      borderWidth: "0",
      /* 2 */
      borderStyle: "solid",
      /* 2 */
      borderColor: "theme(borderColor.DEFAULT, currentColor)",
    },
    /* 2 */
    "::before,::after": {
      "--tw-content": "''",
    },
    /*
    1. Use a consistent sensible line-height in all browsers.
    2. Prevent adjustments of font size after orientation changes in iOS.
    3. Use a more readable tab size.
    4. Use the user's configured `sans` font-family by default.
    5. Use the user's configured `sans` font-feature-settings by default.
    */
    html: {
      lineHeight: 1.5,
      /* 1 */
      WebkitTextSizeAdjust: "100%",
      /* 2 */
      MozTabSize: "4",
      /* 3 */
      tabSize: 4,
      /* 3 */
      fontFamily: `theme(fontFamily.sans, ${theme.fontFamily.sans})`,
      /* 4 */
      fontFeatureSettings:
        "theme(fontFamily.sans[1].fontFeatureSettings, normal)",
    },
    /* 5 */
    /*
    1. Remove the margin in all browsers.
    2. Inherit line-height from `html` so users can set them as a class directly on the `html` element.
    */
    body: {
      margin: "0",
      /* 1 */
      lineHeight: "inherit",
    },
    /* 2 */
    /*
    1. Add the correct height in Firefox.
    2. Correct the inheritance of border color in Firefox. (https://bugzilla.mozilla.org/show_bug.cgi?id=190655)
    3. Ensure horizontal rules are visible by default.
    */
    hr: {
      height: "0",
      /* 1 */
      color: "inherit",
      /* 2 */
      borderTopWidth: "1px",
    },
    /* 3 */
    /*
    Add the correct text decoration in Chrome, Edge, and Safari.
    */
    "abbr:where([title])": {
      textDecoration: "underline dotted",
    },
    /*
    Remove the default font size and weight for headings.
    */
    "h1,h2,h3,h4,h5,h6": {
      fontSize: "inherit",
      fontWeight: "inherit",
    },
    /*
    Reset links to optimize for opt-in styling instead of opt-out.
    */
    a: {
      color: "inherit",
      textDecoration: "inherit",
    },
    /*
    Add the correct font weight in Edge and Safari.
    */
    "b,strong": {
      fontWeight: "bolder",
    },
    /*
    1. Use the user's configured `mono` font family by default.
    2. Use the user's configured `mono` font-feature-settings by default.
    3. Correct the odd `em` font sizing in all browsers.
    */
    "code,kbd,samp,pre": {
      fontFamily: `theme(fontFamily.mono, ${theme.fontFamily.mono})`,
      fontFeatureSettings:
        "theme(fontFamily.mono[1].fontFeatureSettings, normal)",
      fontSize: "1em",
    },
    /*
    Add the correct font size in all browsers.
    */
    small: {
      fontSize: "80%",
    },
    /*
    Prevent `sub` and `sup` elements from affecting the line height in all browsers.
    */
    "sub,sup": {
      fontSize: "75%",
      lineHeight: 0,
      position: "relative",
      verticalAlign: "baseline",
    },
    sub: {
      bottom: "-0.25em",
    },
    sup: {
      top: "-0.5em",
    },
    /*
    1. Remove text indentation from table contents in Chrome and Safari. (https://bugs.chromium.org/p/chromium/issues/detail?id=999088, https://bugs.webkit.org/show_bug.cgi?id=201297)
    2. Correct table border color inheritance in all Chrome and Safari. (https://bugs.chromium.org/p/chromium/issues/detail?id=935729, https://bugs.webkit.org/show_bug.cgi?id=195016)
    3. Remove gaps between table borders by default.
    */
    table: {
      textIndent: "0",
      /* 1 */
      borderColor: "inherit",
      /* 2 */
      borderCollapse: "collapse",
    },
    /* 3 */
    /*
    1. Change the font styles in all browsers.
    2. Remove the margin in Firefox and Safari.
    3. Remove default padding in all browsers.
    */
    "button,input,optgroup,select,textarea": {
      fontFamily: "inherit",
      /* 1 */
      fontSize: "100%",
      /* 1 */
      lineHeight: "inherit",
      /* 1 */
      color: "inherit",
      /* 1 */
      margin: "0",
      /* 2 */
      padding: "0",
    },
    /* 3 */
    /*
    Remove the inheritance of text transform in Edge and Firefox.
    */
    "button,select": {
      textTransform: "none",
    },
    /*
    1. Correct the inability to style clickable types in iOS and Safari.
    2. Remove default button styles.
    */
    "button,[type='button'],[type='reset'],[type='submit']": {
      WebkitAppearance: "button",
      /* 1 */
      backgroundColor: "transparent",
      /* 2 */
      backgroundImage: "none",
    },
    /* 4 */
    /*
    Use the modern Firefox focus style for all focusable elements.
    */
    ":-moz-focusring": {
      outline: "auto",
    },
    /*
    Remove the additional `:invalid` styles in Firefox. (https://github.com/mozilla/gecko-dev/blob/2f9eacd9d3d995c937b4251a5557d95d494c9be1/layout/style/res/forms.css#L728-L737)
    */
    ":-moz-ui-invalid": {
      boxShadow: "none",
    },
    /*
    Add the correct vertical alignment in Chrome and Firefox.
    */
    progress: {
      verticalAlign: "baseline",
    },
    /*
    Correct the cursor style of increment and decrement buttons in Safari.
    */
    "::-webkit-inner-spin-button,::-webkit-outer-spin-button": {
      height: "auto",
    },
    /*
    1. Correct the odd appearance in Chrome and Safari.
    2. Correct the outline style in Safari.
    */
    "[type='search']": {
      WebkitAppearance: "textfield",
      /* 1 */
      outlineOffset: "-2px",
    },
    /* 2 */
    /*
    Remove the inner padding in Chrome and Safari on macOS.
    */
    "::-webkit-search-decoration": {
      WebkitAppearance: "none",
    },
    /*
    1. Correct the inability to style clickable types in iOS and Safari.
    2. Change font properties to `inherit` in Safari.
    */
    "::-webkit-file-upload-button": {
      WebkitAppearance: "button",
      /* 1 */
      font: "inherit",
    },
    /* 2 */
    /*
    Add the correct display in Chrome and Safari.
    */
    summary: {
      display: "list-item",
    },
    /*
    Removes the default spacing and border for appropriate elements.
    */
    "blockquote,dl,dd,h1,h2,h3,h4,h5,h6,hr,figure,p,pre": {
      margin: "0",
    },
    fieldset: {
      margin: "0",
      padding: "0",
    },
    legend: {
      padding: "0",
    },
    "ol,ul,menu": {
      listStyle: "none",
      margin: "0",
      padding: "0",
    },
    /*
    Prevent resizing textareas horizontally by default.
    */
    textarea: {
      resize: "vertical",
    },
    /*
    1. Reset the default placeholder opacity in Firefox. (https://github.com/tailwindlabs/tailwindcss/issues/3300)
    2. Set the default placeholder color to the user's configured gray 400 color.
    */
    "input::placeholder,textarea::placeholder": {
      opacity: 1,
      /* 1 */
      color: "theme(colors.gray.400, #9ca3af)",
    },
    /* 2 */
    /*
    Set the default cursor for buttons.
    */
    'button,[role="button"]': {
      cursor: "pointer",
    },
    /*
    Make sure disabled buttons don't get the pointer cursor.
    */
    ":disabled": {
      cursor: "default",
    },
    /*
    1. Make replaced elements `display: block` by default. (https://github.com/mozdevs/cssremedy/issues/14)
    2. Add `vertical-align: middle` to align replaced elements more sensibly by default. (https://github.com/jensimmons/cssremedy/issues/14#issuecomment-634934210)
      This can trigger a poorly considered lint error in some tools but is included by design.
    */
    "img,svg,video,canvas,audio,iframe,embed,object": {
      display: "block",
      /* 1 */
      verticalAlign: "middle",
    },
    /* 2 */
    /*
    Constrain images and videos to the parent width and preserve their intrinsic aspect ratio. (https://github.com/mozdevs/cssremedy/issues/14)
    */
    "img,video": {
      maxWidth: "100%",
      height: "auto",
    },
    /* Make elements with the HTML hidden attribute stay hidden by default */
    "[hidden]": {
      display: "none",
    },
  };

  // node_modules/@twind/preset-tailwind/rules.js
  var rules = [
    /* arbitrary properties: [paint-order:markers] */
    match("\\[([-\\w]+):(.+)]", ({ 1: $1, 2: $2 }, context) => ({
      "@layer overrides": {
        "&": {
          [$1]: arbitrary(`[${$2}]`, "", context),
        },
      },
    })),
    /* Styling based on parent and peer state */
    match("(group|peer)([~/][^-[]+)?", ({ input }, { h }) => [
      {
        c: h(input),
      },
    ]),
    /* LAYOUT */
    matchTheme("aspect-", "aspectRatio"),
    match("container", (_, { theme: theme3 }) => {
      let {
          screens = theme3("screens"),
          center,
          padding,
        } = theme3("container"),
        rules2 = {
          width: "100%",
          marginRight: center && "auto",
          marginLeft: center && "auto",
          ...paddingFor("xs"),
        };
      for (let screen in screens) {
        let value = screens[screen];
        "string" == typeof value &&
          (rules2[mql(value)] = {
            "&": {
              maxWidth: value,
              ...paddingFor(screen),
            },
          });
      }
      return rules2;
      function paddingFor(screen) {
        let value =
          padding &&
          ("string" == typeof padding
            ? padding
            : padding[screen] || padding.DEFAULT);
        if (value)
          return {
            paddingRight: value,
            paddingLeft: value,
          };
      }
    }),
    // Content
    matchTheme("content-", "content", ({ _ }) => ({
      "--tw-content": _,
      content: "var(--tw-content)",
    })),
    // Box Decoration Break
    match("(?:box-)?decoration-(slice|clone)", "boxDecorationBreak"),
    // Box Sizing
    match("box-(border|content)", "boxSizing", ({ 1: $1 }) => $1 + "-box"),
    // Display
    match("hidden", {
      display: "none",
    }),
    // Table Layout
    match("table-(auto|fixed)", "tableLayout"),
    match(
      [
        "(block|flex|table|grid|inline|contents|flow-root|list-item)",
        "(inline-(block|flex|table|grid))",
        "(table-(caption|cell|column|row|(column|row|footer|header)-group))",
      ],
      "display"
    ),
    // Floats
    "(float)-(left|right|none)",
    // Clear
    "(clear)-(left|right|none|both)",
    // Overflow
    "(overflow(?:-[xy])?)-(auto|hidden|clip|visible|scroll)",
    // Isolation
    "(isolation)-(auto)",
    // Isolation
    match("isolate", "isolation"),
    // Object Fit
    match("object-(contain|cover|fill|none|scale-down)", "objectFit"),
    // Object Position
    matchTheme("object-", "objectPosition"),
    match(
      "object-(top|bottom|center|(left|right)(-(top|bottom))?)",
      "objectPosition",
      spacify
    ),
    // Overscroll Behavior
    match(
      "overscroll(-[xy])?-(auto|contain|none)",
      ({ 1: $1 = "", 2: $2 }) => ({
        ["overscroll-behavior" + $1]: $2,
      })
    ),
    // Position
    match("(static|fixed|absolute|relative|sticky)", "position"),
    // Top / Right / Bottom / Left
    matchTheme("-?inset(-[xy])?(?:$|-)", "inset", ({ 1: $1, _ }) => ({
      top: "-x" != $1 && _,
      right: "-y" != $1 && _,
      bottom: "-x" != $1 && _,
      left: "-y" != $1 && _,
    })),
    matchTheme("-?(top|bottom|left|right)(?:$|-)", "inset"),
    // Visibility
    match("(visible|collapse)", "visibility"),
    match("invisible", {
      visibility: "hidden",
    }),
    // Z-Index
    matchTheme("-?z-", "zIndex"),
    /* FLEXBOX */
    // Flex Direction
    match("flex-((row|col)(-reverse)?)", "flexDirection", columnify),
    match("flex-(wrap|wrap-reverse|nowrap)", "flexWrap"),
    matchTheme("(flex-(?:grow|shrink))(?:$|-)"),
    /*, 'flex-grow' | flex-shrink */
    matchTheme("(flex)-"),
    /*, 'flex' */
    matchTheme("grow(?:$|-)", "flexGrow"),
    matchTheme("shrink(?:$|-)", "flexShrink"),
    matchTheme("basis-", "flexBasis"),
    matchTheme("-?(order)-"),
    /*, 'order' */
    "-?(order)-(\\d+)",
    /* GRID */
    // Grid Template Columns
    matchTheme("grid-cols-", "gridTemplateColumns"),
    match("grid-cols-(\\d+)", "gridTemplateColumns", gridTemplate),
    // Grid Column Start / End
    matchTheme("col-", "gridColumn"),
    match("col-(span)-(\\d+)", "gridColumn", span),
    matchTheme("col-start-", "gridColumnStart"),
    match("col-start-(auto|\\d+)", "gridColumnStart"),
    matchTheme("col-end-", "gridColumnEnd"),
    match("col-end-(auto|\\d+)", "gridColumnEnd"),
    // Grid Template Rows
    matchTheme("grid-rows-", "gridTemplateRows"),
    match("grid-rows-(\\d+)", "gridTemplateRows", gridTemplate),
    // Grid Row Start / End
    matchTheme("row-", "gridRow"),
    match("row-(span)-(\\d+)", "gridRow", span),
    matchTheme("row-start-", "gridRowStart"),
    match("row-start-(auto|\\d+)", "gridRowStart"),
    matchTheme("row-end-", "gridRowEnd"),
    match("row-end-(auto|\\d+)", "gridRowEnd"),
    // Grid Auto Flow
    match("grid-flow-((row|col)(-dense)?)", "gridAutoFlow", (match2) =>
      spacify(columnify(match2))
    ),
    match("grid-flow-(dense)", "gridAutoFlow"),
    // Grid Auto Columns
    matchTheme("auto-cols-", "gridAutoColumns"),
    // Grid Auto Rows
    matchTheme("auto-rows-", "gridAutoRows"),
    // Gap
    matchTheme("gap-x(?:$|-)", "gap", "columnGap"),
    matchTheme("gap-y(?:$|-)", "gap", "rowGap"),
    matchTheme("gap(?:$|-)", "gap"),
    /* BOX ALIGNMENT */
    // Justify Items
    // Justify Self
    "(justify-(?:items|self))-",
    // Justify Content
    match("justify-", "justifyContent", convertContentValue),
    // Align Content
    // Align Items
    // Align Self
    match("(content|items|self)-", (match2) => ({
      ["align-" + match2[1]]: convertContentValue(match2),
    })),
    // Place Content
    // Place Items
    // Place Self
    match("(place-(content|items|self))-", ({ 1: $1, $$ }) => ({
      [$1]: ("wun".includes($$[3]) ? "space-" : "") + $$,
    })),
    /* SPACING */
    // Padding
    matchTheme("p([xytrbl])?(?:$|-)", "padding", edge("padding")),
    // Margin
    matchTheme("-?m([xytrbl])?(?:$|-)", "margin", edge("margin")),
    // Space Between
    matchTheme("-?space-(x|y)(?:$|-)", "space", ({ 1: $1, _ }) => ({
      "&>:not([hidden])~:not([hidden])": {
        [`--tw-space-${$1}-reverse`]: "0",
        ["margin-" +
        {
          y: "top",
          x: "left",
        }[$1]]: `calc(${_} * calc(1 - var(--tw-space-${$1}-reverse)))`,
        ["margin-" +
        {
          y: "bottom",
          x: "right",
        }[$1]]: `calc(${_} * var(--tw-space-${$1}-reverse))`,
      },
    })),
    match("space-(x|y)-reverse", ({ 1: $1 }) => ({
      "&>:not([hidden])~:not([hidden])": {
        [`--tw-space-${$1}-reverse`]: "1",
      },
    })),
    /* SIZING */
    // Width
    matchTheme("w-", "width"),
    // Min-Width
    matchTheme("min-w-", "minWidth"),
    // Max-Width
    matchTheme("max-w-", "maxWidth"),
    // Height
    matchTheme("h-", "height"),
    // Min-Height
    matchTheme("min-h-", "minHeight"),
    // Max-Height
    matchTheme("max-h-", "maxHeight"),
    /* TYPOGRAPHY */
    // Font Weight
    matchTheme("font-", "fontWeight"),
    // Font Family
    matchTheme("font-", "fontFamily", ({ _ }) => {
      return "string" == typeof (_ = asArray(_))[1]
        ? {
            fontFamily: join(_),
          }
        : {
            fontFamily: join(_[0]),
            ..._[1],
          };
    }),
    // Font Smoothing
    match("antialiased", {
      WebkitFontSmoothing: "antialiased",
      MozOsxFontSmoothing: "grayscale",
    }),
    match("subpixel-antialiased", {
      WebkitFontSmoothing: "auto",
      MozOsxFontSmoothing: "auto",
    }),
    // Font Style
    match("italic", "fontStyle"),
    match("not-italic", {
      fontStyle: "normal",
    }),
    // Font Variant Numeric
    match(
      "(ordinal|slashed-zero|(normal|lining|oldstyle|proportional|tabular)-nums|(diagonal|stacked)-fractions)",
      ({ 1: $1, 2: $2 = "", 3: $3 }) =>
        // normal-nums
        "normal" == $2
          ? {
              fontVariantNumeric: "normal",
            }
          : {
              ["--tw-" +
              ($3
                ? // diagonal-fractions, stacked-fractions
                  "numeric-fraction"
                : "pt".includes($2[0])
                ? // proportional-nums, tabular-nums
                  "numeric-spacing"
                : $2
                ? // lining-nums, oldstyle-nums
                  "numeric-figure"
                : // ordinal, slashed-zero
                  $1)]: $1,
              fontVariantNumeric:
                "var(--tw-ordinal) var(--tw-slashed-zero) var(--tw-numeric-figure) var(--tw-numeric-spacing) var(--tw-numeric-fraction)",
              ...asDefaults({
                "--tw-ordinal": "var(--tw-empty,/*!*/ /*!*/)",
                "--tw-slashed-zero": "var(--tw-empty,/*!*/ /*!*/)",
                "--tw-numeric-figure": "var(--tw-empty,/*!*/ /*!*/)",
                "--tw-numeric-spacing": "var(--tw-empty,/*!*/ /*!*/)",
                "--tw-numeric-fraction": "var(--tw-empty,/*!*/ /*!*/)",
              }),
            }
    ),
    // Letter Spacing
    matchTheme("tracking-", "letterSpacing"),
    // Line Height
    matchTheme("leading-", "lineHeight"),
    // List Style Position
    match("list-(inside|outside)", "listStylePosition"),
    // List Style Type
    matchTheme("list-", "listStyleType"),
    match("list-", "listStyleType"),
    // Placeholder Opacity
    matchTheme("placeholder-opacity-", "placeholderOpacity", ({ _ }) => ({
      "&::placeholder": {
        "--tw-placeholder-opacity": _,
      },
    })),
    // Placeholder Color
    matchColor("placeholder-", {
      property: "color",
      selector: "&::placeholder",
    }),
    // Text Alignment
    match("text-(left|center|right|justify|start|end)", "textAlign"),
    match("text-(ellipsis|clip)", "textOverflow"),
    // Text Opacity
    matchTheme("text-opacity-", "textOpacity", "--tw-text-opacity"),
    // Text Color
    matchColor("text-", {
      property: "color",
    }),
    // Font Size
    matchTheme("text-", "fontSize", ({ _ }) =>
      "string" == typeof _
        ? {
            fontSize: _,
          }
        : {
            fontSize: _[0],
            ...("string" == typeof _[1]
              ? {
                  lineHeight: _[1],
                }
              : _[1]),
          }
    ),
    // Text Indent
    matchTheme("indent-", "textIndent"),
    // Text Decoration
    match("(overline|underline|line-through)", "textDecorationLine"),
    match("no-underline", {
      textDecorationLine: "none",
    }),
    // Text Underline offset
    matchTheme("underline-offset-", "textUnderlineOffset"),
    // Text Decoration Color
    matchColor("decoration-", {
      section: "textDecorationColor",
      opacityVariable: false,
      opacitySection: "opacity",
    }),
    // Text Decoration Thickness
    matchTheme("decoration-", "textDecorationThickness"),
    // Text Decoration Style
    match("decoration-", "textDecorationStyle"),
    // Text Transform
    match("(uppercase|lowercase|capitalize)", "textTransform"),
    match("normal-case", {
      textTransform: "none",
    }),
    // Text Overflow
    match("truncate", {
      overflow: "hidden",
      whiteSpace: "nowrap",
      textOverflow: "ellipsis",
    }),
    // Vertical Alignment
    match("align-", "verticalAlign"),
    // Whitespace
    match("whitespace-", "whiteSpace"),
    // Word Break
    match("break-normal", {
      wordBreak: "normal",
      overflowWrap: "normal",
    }),
    match("break-words", {
      overflowWrap: "break-word",
    }),
    match("break-all", {
      wordBreak: "break-all",
    }),
    match("break-keep", {
      wordBreak: "keep-all",
    }),
    // Caret Color
    matchColor("caret-", {
      // section: 'caretColor',
      opacityVariable: false,
      opacitySection: "opacity",
    }),
    // Accent Color
    matchColor("accent-", {
      // section: 'accentColor',
      opacityVariable: false,
      opacitySection: "opacity",
    }),
    // Gradient Color Stops
    match(
      "bg-gradient-to-([trbl]|[tb][rl])",
      "backgroundImage",
      ({ 1: $1 }) =>
        `linear-gradient(to ${position($1, " ")},var(--tw-gradient-stops))`
    ),
    matchColor(
      "from-",
      {
        section: "gradientColorStops",
        opacityVariable: false,
        opacitySection: "opacity",
      },
      ({ _ }) => ({
        "--tw-gradient-from": _.value,
        "--tw-gradient-to": _.color({
          opacityValue: "0",
        }),
        "--tw-gradient-stops": "var(--tw-gradient-from),var(--tw-gradient-to)",
      })
    ),
    matchColor(
      "via-",
      {
        section: "gradientColorStops",
        opacityVariable: false,
        opacitySection: "opacity",
      },
      ({ _ }) => ({
        "--tw-gradient-to": _.color({
          opacityValue: "0",
        }),
        "--tw-gradient-stops": `var(--tw-gradient-from),${_.value},var(--tw-gradient-to)`,
      })
    ),
    matchColor("to-", {
      section: "gradientColorStops",
      property: "--tw-gradient-to",
      opacityVariable: false,
      opacitySection: "opacity",
    }),
    /* BACKGROUNDS */
    // Background Attachment
    match("bg-(fixed|local|scroll)", "backgroundAttachment"),
    // Background Origin
    match(
      "bg-origin-(border|padding|content)",
      "backgroundOrigin",
      ({ 1: $1 }) => $1 + "-box"
    ),
    // Background Repeat
    match(
      ["bg-(no-repeat|repeat(-[xy])?)", "bg-repeat-(round|space)"],
      "backgroundRepeat"
    ),
    // Background Blend Mode
    match("bg-blend-", "backgroundBlendMode"),
    // Background Clip
    match(
      "bg-clip-(border|padding|content|text)",
      "backgroundClip",
      ({ 1: $1 }) => $1 + ("text" == $1 ? "" : "-box")
    ),
    // Background Opacity
    matchTheme("bg-opacity-", "backgroundOpacity", "--tw-bg-opacity"),
    // Background Color
    // bg-${backgroundColor}/${backgroundOpacity}
    matchColor("bg-", {
      section: "backgroundColor",
    }),
    // Background Image
    // supported arbitrary types are: length, color, angle, list
    matchTheme("bg-", "backgroundImage"),
    // Background Position
    matchTheme("bg-", "backgroundPosition"),
    match(
      "bg-(top|bottom|center|(left|right)(-(top|bottom))?)",
      "backgroundPosition",
      spacify
    ),
    // Background Size
    matchTheme("bg-", "backgroundSize"),
    /* BORDERS */
    // Border Radius
    matchTheme("rounded(?:$|-)", "borderRadius"),
    matchTheme(
      "rounded-([trbl]|[tb][rl])(?:$|-)",
      "borderRadius",
      ({ 1: $1, _ }) => {
        let corners = {
          t: ["tl", "tr"],
          r: ["tr", "br"],
          b: ["bl", "br"],
          l: ["bl", "tl"],
        }[$1] || [$1, $1];
        return {
          [`border-${position(corners[0])}-radius`]: _,
          [`border-${position(corners[1])}-radius`]: _,
        };
      }
    ),
    // Border Collapse
    match("border-(collapse|separate)", "borderCollapse"),
    // Border Opacity
    matchTheme("border-opacity(?:$|-)", "borderOpacity", "--tw-border-opacity"),
    // Border Style
    match("border-(solid|dashed|dotted|double|none)", "borderStyle"),
    // Border Spacing
    matchTheme(
      "border-spacing(-[xy])?(?:$|-)",
      "borderSpacing",
      ({ 1: $1, _ }) => ({
        ...asDefaults({
          "--tw-border-spacing-x": "0",
          "--tw-border-spacing-y": "0",
        }),
        ["--tw-border-spacing" + ($1 || "-x")]: _,
        ["--tw-border-spacing" + ($1 || "-y")]: _,
        "border-spacing":
          "var(--tw-border-spacing-x) var(--tw-border-spacing-y)",
      })
    ),
    // Border Color
    matchColor(
      "border-([xytrbl])-",
      {
        section: "borderColor",
      },
      edge("border", "Color")
    ),
    matchColor("border-"),
    // Border Width
    matchTheme(
      "border-([xytrbl])(?:$|-)",
      "borderWidth",
      edge("border", "Width")
    ),
    matchTheme("border(?:$|-)", "borderWidth"),
    // Divide Opacity
    matchTheme("divide-opacity(?:$|-)", "divideOpacity", ({ _ }) => ({
      "&>:not([hidden])~:not([hidden])": {
        "--tw-divide-opacity": _,
      },
    })),
    // Divide Style
    match("divide-(solid|dashed|dotted|double|none)", ({ 1: $1 }) => ({
      "&>:not([hidden])~:not([hidden])": {
        borderStyle: $1,
      },
    })),
    // Divide Width
    match("divide-([xy]-reverse)", ({ 1: $1 }) => ({
      "&>:not([hidden])~:not([hidden])": {
        ["--tw-divide-" + $1]: "1",
      },
    })),
    matchTheme("divide-([xy])(?:$|-)", "divideWidth", ({ 1: $1, _ }) => {
      let edges = {
        x: "lr",
        y: "tb",
      }[$1];
      return {
        "&>:not([hidden])~:not([hidden])": {
          [`--tw-divide-${$1}-reverse`]: "0",
          [`border-${position(
            edges[0]
          )}Width`]: `calc(${_} * calc(1 - var(--tw-divide-${$1}-reverse)))`,
          [`border-${position(
            edges[1]
          )}Width`]: `calc(${_} * var(--tw-divide-${$1}-reverse))`,
        },
      };
    }),
    // Divide Color
    matchColor("divide-", {
      // section: $0.replace('-', 'Color') -> 'divideColor'
      property: "borderColor",
      // opacityVariable: '--tw-border-opacity',
      // opacitySection: section.replace('Color', 'Opacity') -> 'divideOpacity'
      selector: "&>:not([hidden])~:not([hidden])",
    }),
    // Ring Offset Opacity
    matchTheme("ring-opacity(?:$|-)", "ringOpacity", "--tw-ring-opacity"),
    // Ring Offset Color
    matchColor("ring-offset-", {
      // section: 'ringOffsetColor',
      property: "--tw-ring-offset-color",
      opacityVariable: false,
    }),
    // opacitySection: section.replace('Color', 'Opacity') -> 'ringOffsetOpacity'
    // Ring Offset Width
    matchTheme(
      "ring-offset(?:$|-)",
      "ringOffsetWidth",
      "--tw-ring-offset-width"
    ),
    // Ring Inset
    match("ring-inset", {
      "--tw-ring-inset": "inset",
    }),
    // Ring Color
    matchColor("ring-", {
      // section: 'ringColor',
      property: "--tw-ring-color",
    }),
    // opacityVariable: '--tw-ring-opacity',
    // opacitySection: section.replace('Color', 'Opacity') -> 'ringOpacity'
    // Ring Width
    matchTheme("ring(?:$|-)", "ringWidth", ({ _ }, { theme: theme3 }) => ({
      ...asDefaults({
        "--tw-ring-offset-shadow": "0 0 #0000",
        "--tw-ring-shadow": "0 0 #0000",
        "--tw-shadow": "0 0 #0000",
        "--tw-shadow-colored": "0 0 #0000",
        // Within own declaration to have the defaults above to be merged with defaults from shadow
        "&": {
          "--tw-ring-inset": "var(--tw-empty,/*!*/ /*!*/)",
          "--tw-ring-offset-width": theme3("ringOffsetWidth", "", "0px"),
          "--tw-ring-offset-color": toColorValue(
            theme3("ringOffsetColor", "", "#fff")
          ),
          "--tw-ring-color": toColorValue(theme3("ringColor", "", "#93c5fd"), {
            opacityVariable: "--tw-ring-opacity",
          }),
          "--tw-ring-opacity": theme3("ringOpacity", "", "0.5"),
        },
      }),
      "--tw-ring-offset-shadow":
        "var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color)",
      "--tw-ring-shadow": `var(--tw-ring-inset) 0 0 0 calc(${_} + var(--tw-ring-offset-width)) var(--tw-ring-color)`,
      boxShadow:
        "var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)",
    })),
    /* EFFECTS */
    // Box Shadow Color
    matchColor(
      "shadow-",
      {
        section: "boxShadowColor",
        opacityVariable: false,
        opacitySection: "opacity",
      },
      ({ _ }) => ({
        "--tw-shadow-color": _.value,
        "--tw-shadow": "var(--tw-shadow-colored)",
      })
    ),
    // Box Shadow
    matchTheme("shadow(?:$|-)", "boxShadow", ({ _ }) => ({
      ...asDefaults({
        "--tw-ring-offset-shadow": "0 0 #0000",
        "--tw-ring-shadow": "0 0 #0000",
        "--tw-shadow": "0 0 #0000",
        "--tw-shadow-colored": "0 0 #0000",
      }),
      "--tw-shadow": join(_),
      // replace all colors with reference to --tw-shadow-colored
      // this matches colors after non-comma char (keyword, offset) before comma or the end
      "--tw-shadow-colored": join(_).replace(
        /([^,]\s+)(?:#[a-f\d]+|(?:(?:hsl|rgb)a?|hwb|lab|lch|color|var)\(.+?\)|[a-z]+)(,|$)/g,
        "$1var(--tw-shadow-color)$2"
      ),
      boxShadow:
        "var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)",
    })),
    // Opacity
    matchTheme("(opacity)-"),
    /*, 'opacity' */
    // Mix Blend Mode
    match("mix-blend-", "mixBlendMode"),
    /* FILTERS */
    ...filter(),
    ...filter("backdrop-"),
    /* TRANSITIONS AND ANIMATION */
    // Transition Property
    matchTheme(
      "transition(?:$|-)",
      "transitionProperty",
      (match2, { theme: theme3 }) => ({
        transitionProperty: join(match2),
        transitionTimingFunction:
          "none" == match2._
            ? void 0
            : join(theme3("transitionTimingFunction", "")),
        transitionDuration:
          "none" == match2._ ? void 0 : join(theme3("transitionDuration", "")),
      })
    ),
    // Transition Duration
    matchTheme(
      "duration(?:$|-)",
      "transitionDuration",
      "transitionDuration",
      join
    ),
    // Transition Timing Function
    matchTheme(
      "ease(?:$|-)",
      "transitionTimingFunction",
      "transitionTimingFunction",
      join
    ),
    // Transition Delay
    matchTheme("delay(?:$|-)", "transitionDelay", "transitionDelay", join),
    matchTheme(
      "animate(?:$|-)",
      "animation",
      (match2, { theme: theme3, h, e }) => {
        let animation = join(match2),
          parts = animation.split(" "),
          keyframeValues = theme3("keyframes", parts[0]);
        return keyframeValues
          ? {
              ["@keyframes " + (parts[0] = e(h(parts[0])))]: keyframeValues,
              animation: parts.join(" "),
            }
          : {
              animation,
            };
      }
    ),
    /* TRANSFORMS */
    // Transform
    "(transform)-(none)",
    match("transform", tranformDefaults),
    match("transform-(cpu|gpu)", ({ 1: $1 }) => ({
      "--tw-transform": transformValue("gpu" == $1),
    })),
    // Scale
    matchTheme("scale(-[xy])?-", "scale", ({ 1: $1, _ }) => ({
      ["--tw-scale" + ($1 || "-x")]: _,
      ["--tw-scale" + ($1 || "-y")]: _,
      ...tranformDefaults(),
    })),
    // Rotate
    matchTheme("-?(rotate)-", "rotate", transform),
    // Translate
    matchTheme("-?(translate-[xy])-", "translate", transform),
    // Skew
    matchTheme("-?(skew-[xy])-", "skew", transform),
    // Transform Origin
    match(
      "origin-(center|((top|bottom)(-(left|right))?)|left|right)",
      "transformOrigin",
      spacify
    ),
    /* INTERACTIVITY */
    // Appearance
    "(appearance)-",
    // Columns
    matchTheme("(columns)-"),
    /*, 'columns' */
    "(columns)-(\\d+)",
    // Break Before, After and Inside
    "(break-(?:before|after|inside))-",
    // Cursor
    matchTheme("(cursor)-"),
    /*, 'cursor' */
    "(cursor)-",
    // Scroll Snap Type
    match("snap-(none)", "scroll-snap-type"),
    match("snap-(x|y|both)", ({ 1: $1 }) => ({
      ...asDefaults({
        "--tw-scroll-snap-strictness": "proximity",
      }),
      "scroll-snap-type": $1 + " var(--tw-scroll-snap-strictness)",
    })),
    match("snap-(mandatory|proximity)", "--tw-scroll-snap-strictness"),
    // Scroll Snap Align
    match("snap-(?:(start|end|center)|align-(none))", "scroll-snap-align"),
    // Scroll Snap Stop
    match("snap-(normal|always)", "scroll-snap-stop"),
    match("scroll-(auto|smooth)", "scroll-behavior"),
    // Scroll Margin
    // Padding
    matchTheme("scroll-p([xytrbl])?(?:$|-)", "padding", edge("scroll-padding")),
    // Margin
    matchTheme(
      "-?scroll-m([xytrbl])?(?:$|-)",
      "scroll-margin",
      edge("scroll-margin")
    ),
    // Touch Action
    match("touch-(auto|none|manipulation)", "touch-action"),
    match(
      "touch-(pinch-zoom|pan-(?:(x|left|right)|(y|up|down)))",
      ({ 1: $1, 2: $2, 3: $3 }) => ({
        ...asDefaults({
          "--tw-pan-x": "var(--tw-empty,/*!*/ /*!*/)",
          "--tw-pan-y": "var(--tw-empty,/*!*/ /*!*/)",
          "--tw-pinch-zoom": "var(--tw-empty,/*!*/ /*!*/)",
          "--tw-touch-action":
            "var(--tw-pan-x) var(--tw-pan-y) var(--tw-pinch-zoom)",
        }),
        // x, left, right -> pan-x
        // y, up, down -> pan-y
        // -> pinch-zoom
        [`--tw-${$2 ? "pan-x" : $3 ? "pan-y" : $1}`]: $1,
        "touch-action": "var(--tw-touch-action)",
      })
    ),
    // Outline Style
    match("outline-none", {
      outline: "2px solid transparent",
      "outline-offset": "2px",
    }),
    match("outline", {
      outlineStyle: "solid",
    }),
    match("outline-(dashed|dotted|double)", "outlineStyle"),
    // Outline Offset
    matchTheme("-?(outline-offset)-"),
    /*, 'outlineOffset'*/
    // Outline Color
    matchColor("outline-", {
      opacityVariable: false,
      opacitySection: "opacity",
    }),
    // Outline Width
    matchTheme("outline-", "outlineWidth"),
    // Pointer Events
    "(pointer-events)-",
    // Will Change
    matchTheme("(will-change)-"),
    /*, 'willChange' */
    "(will-change)-",
    // Resize
    [
      "resize(?:-(none|x|y))?",
      "resize",
      ({ 1: $1 }) =>
        ({
          x: "horizontal",
          y: "vertical",
        }[$1] ||
        $1 ||
        "both"),
    ],
    // User Select
    match("select-(none|text|all|auto)", "userSelect"),
    /* SVG */
    // Fill, Stroke
    matchColor("fill-", {
      section: "fill",
      opacityVariable: false,
      opacitySection: "opacity",
    }),
    matchColor("stroke-", {
      section: "stroke",
      opacityVariable: false,
      opacitySection: "opacity",
    }),
    // Stroke Width
    matchTheme("stroke-", "strokeWidth"),
    /* ACCESSIBILITY */
    // Screen Readers
    match("sr-only", {
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
    match("not-sr-only", {
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
  function spacify(value) {
    return ("string" == typeof value ? value : value[1])
      .replace(/-/g, " ")
      .trim();
  }
  function columnify(value) {
    return ("string" == typeof value ? value : value[1]).replace(
      "col",
      "column"
    );
  }
  function position(shorthand, separator = "-") {
    let longhand = [];
    for (let short of shorthand)
      longhand.push(
        {
          t: "top",
          r: "right",
          b: "bottom",
          l: "left",
        }[short]
      );
    return longhand.join(separator);
  }
  function join(value) {
    return value && "" + (value._ || value);
  }
  function convertContentValue({ $$ }) {
    return (
      ({
        // /* aut*/ o: '',
        /* sta*/
        r:
          /*t*/
          "flex-",
        /* end*/
        "": "flex-",
        // /* cen*/ t /*er*/: '',
        /* bet*/
        w:
          /*een*/
          "space-",
        /* aro*/
        u:
          /*nd*/
          "space-",
        /* eve*/
        n:
          /*ly*/
          "space-",
      }[$$[3] || ""] || "") + $$
    );
  }
  function edge(propertyPrefix, propertySuffix = "") {
    return ({ 1: $1, _ }) => {
      let edges =
        {
          x: "lr",
          y: "tb",
        }[$1] || $1 + $1;
      return edges
        ? {
            ...toCSS(
              propertyPrefix + "-" + position(edges[0]) + propertySuffix,
              _
            ),
            ...toCSS(
              propertyPrefix + "-" + position(edges[1]) + propertySuffix,
              _
            ),
          }
        : toCSS(propertyPrefix + propertySuffix, _);
    };
  }
  function filter(prefix = "") {
    let filters = [
        "blur",
        "brightness",
        "contrast",
        "grayscale",
        "hue-rotate",
        "invert",
        prefix && "opacity",
        "saturate",
        "sepia",
        !prefix && "drop-shadow",
      ].filter(Boolean),
      defaults = {};
    for (let key of filters)
      defaults[`--tw-${prefix}${key}`] = "var(--tw-empty,/*!*/ /*!*/)";
    return (
      (defaults = {
        // move defaults
        ...asDefaults(defaults),
        // add default filter which allows standalone usage
        [`${prefix}filter`]: filters
          .map((key) => `var(--tw-${prefix}${key})`)
          .join(" "),
      }),
      [
        `(${prefix}filter)-(none)`,
        match(`${prefix}filter`, defaults),
        ...filters.map((key) =>
          matchTheme(
            // hue-rotate can be negated
            `${"h" == key[0] ? "-?" : ""}(${prefix}${key})(?:$|-)`,
            key,
            ({ 1: $1, _ }) => ({
              [`--tw-${$1}`]: asArray(_)
                .map((value) => `${key}(${value})`)
                .join(" "),
              ...defaults,
            })
          )
        ),
      ]
    );
  }
  function transform({ 1: $1, _ }) {
    return {
      ["--tw-" + $1]: _,
      ...tranformDefaults(),
    };
  }
  function tranformDefaults() {
    return {
      ...asDefaults({
        "--tw-translate-x": "0",
        "--tw-translate-y": "0",
        "--tw-rotate": "0",
        "--tw-skew-x": "0",
        "--tw-skew-y": "0",
        "--tw-scale-x": "1",
        "--tw-scale-y": "1",
        "--tw-transform": transformValue(),
      }),
      transform: "var(--tw-transform)",
    };
  }
  function transformValue(gpu) {
    return [
      gpu
        ? // -gpu
          "translate3d(var(--tw-translate-x),var(--tw-translate-y),0)"
        : "translateX(var(--tw-translate-x)) translateY(var(--tw-translate-y))",
      "rotate(var(--tw-rotate))",
      "skewX(var(--tw-skew-x))",
      "skewY(var(--tw-skew-y))",
      "scaleX(var(--tw-scale-x))",
      "scaleY(var(--tw-scale-y))",
    ].join(" ");
  }
  function span({ 1: $1, 2: $2 }) {
    return `${$1} ${$2} / ${$1} ${$2}`;
  }
  function gridTemplate({ 1: $1 }) {
    return `repeat(${$1},minmax(0,1fr))`;
  }
  function asDefaults(props) {
    return {
      "@layer defaults": {
        "*,::before,::after": props,
        "::backdrop": props,
      },
    };
  }

  // node_modules/@twind/preset-tailwind/variants.js
  var variants = [
    ["sticky", "@supports ((position: -webkit-sticky) or (position:sticky))"],
    ["motion-reduce", "@media (prefers-reduced-motion:reduce)"],
    ["motion-safe", "@media (prefers-reduced-motion:no-preference)"],
    ["print", "@media print"],
    ["(portrait|landscape)", ({ 1: $1 }) => `@media (orientation:${$1})`],
    ["contrast-(more|less)", ({ 1: $1 }) => `@media (prefers-contrast:${$1})`],
    [
      "(first-(letter|line)|placeholder|backdrop|before|after)",
      ({ 1: $1 }) => `&::${$1}`,
    ],
    ["(marker|selection)", ({ 1: $1 }) => `& *::${$1},&::${$1}`],
    ["file", "&::file-selector-button"],
    ["(first|last|only)", ({ 1: $1 }) => `&:${$1}-child`],
    ["even", "&:nth-child(2n)"],
    ["odd", "&:nth-child(odd)"],
    ["open", "&[open]"],
    // All other pseudo classes are already supported by twind
    [
      "(aria|data)-",
      (
        {
          1: $1,
          /* aria or data */
          $$,
        },
        context
      ) =>
        $$ &&
        `&[${$1}-${
          // aria-asc or data-checked -> from theme
          context.theme($1, $$) || // aria-[...] or data-[...]
          arbitrary($$, "", context) || // default handling
          `${$$}="true"`
        }]`,
    ],
    /* Styling based on parent and peer state */
    // Groups classes like: group-focus and group-hover
    // these need to add a marker selector with the pseudo class
    // => '.group:focus .group-focus:selector'
    [
      "((group|peer)(~[^-[]+)?)(-\\[(.+)]|[-[].+?)(\\/.+)?",
      (
        { 2: type, 3: name = "", 4: $4, 5: $5 = "", 6: label = name },
        { e, h, v }
      ) => {
        let selector = normalize($5) || ("[" == $4[0] ? $4 : v($4.slice(1)));
        return `${(selector.includes("&") ? selector : "&" + selector).replace(
          /&/g,
          `:merge(.${e(h(type + label))})`
        )}${"p" == type[0] ? "~" : " "}&`;
      },
    ],
    // direction variants
    ["(ltr|rtl)", ({ 1: $1 }) => `[dir="${$1}"] &`],
    [
      "supports-",
      ({ $$ }, context) => {
        $$ &&
          ($$ = context.theme("supports", $$) || arbitrary($$, "", context));
        if ($$)
          return (
            $$.includes(":") || ($$ += ":var(--tw)"),
            /^\w*\s*\(/.test($$) || ($$ = `(${$$})`), // Chrome has a bug where `(condtion1)or(condition2)` is not valid
            // But `(condition1) or (condition2)` is supported.
            `@supports ${$$.replace(/\b(and|or|not)\b/g, " $1 ").trim()}`
          );
      },
    ],
    [
      "max-",
      ({ $$ }, context) => {
        $$ && ($$ = context.theme("screens", $$) || arbitrary($$, "", context));
        if ("string" == typeof $$)
          return `@media not all and (min-width:${$$})`;
      },
    ],
    [
      "min-",
      ({ $$ }, context) => {
        return (
          $$ && ($$ = arbitrary($$, "", context)),
          $$ && `@media (min-width:${$$})`
        );
      },
    ],
    // Arbitrary variants
    [
      /^\[(.+)]$/,
      ({ 1: $1 }) =>
        /[&@]/.test($1) && normalize($1).replace(/[}]+$/, "").split("{"),
    ],
  ];

  // node_modules/@twind/preset-tailwind/base.js
  function presetTailwindBase({ colors: colors2, disablePreflight } = {}) {
    return {
      // allow other preflight to run
      preflight: disablePreflight ? void 0 : preflight,
      theme: {
        ...theme,
        colors: {
          inherit: "inherit",
          current: "currentColor",
          transparent: "transparent",
          black: "#000",
          white: "#fff",
          ...colors2,
        },
      },
      variants,
      rules,
      finalize(rule) {
        return (
          // automatically add `content: ''` to before and after so you don’t have to specify it unless you want a different value
          // ignore global, preflight, and auto added rules
          rule.n && // only if there are declarations
            rule.d && // and it has a ::before or ::after selector
            rule.r.some((r2) => /^&::(before|after)$/.test(r2)) && // there is no content property yet
            !/(^|;)content:/.test(rule.d)
            ? {
                ...rule,
                d: "content:var(--tw-content);" + rule.d,
              }
            : rule
        );
      },
    };
  }

  // node_modules/@twind/preset-tailwind/_/colors-16fd59b8.js
  var slate = {
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
  };
  var gray = {
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
  };
  var zinc = {
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
  };
  var neutral = {
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
  };
  var stone = {
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
  };
  var red = {
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
  };
  var orange = {
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
  };
  var amber = {
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
  };
  var yellow = {
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
  };
  var lime = {
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
  };
  var green = {
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
  };
  var emerald = {
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
  };
  var teal = {
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
  };
  var cyan = {
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
  };
  var sky = {
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
  };
  var blue = {
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
  };
  var indigo = {
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
  };
  var violet = {
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
  };
  var purple = {
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
  };
  var fuchsia = {
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
  };
  var pink = {
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
  };
  var rose = {
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
  };
  var colors = {
    __proto__: null,
    slate,
    gray,
    zinc,
    neutral,
    stone,
    red,
    orange,
    amber,
    yellow,
    lime,
    green,
    emerald,
    teal,
    cyan,
    sky,
    blue,
    indigo,
    violet,
    purple,
    fuchsia,
    pink,
    rose,
  };

  // node_modules/@twind/preset-tailwind/preset-tailwind.js
  function presetTailwind({ disablePreflight } = {}) {
    return presetTailwindBase({
      colors,
      disablePreflight,
    });
  }

  // node_modules/@twind/preset-tailwind/colors.js
  var colors_exports = {};
  __export(colors_exports, {
    amber: () => amber,
    blue: () => blue,
    cyan: () => cyan,
    emerald: () => emerald,
    fuchsia: () => fuchsia,
    gray: () => gray,
    green: () => green,
    indigo: () => indigo,
    lime: () => lime,
    neutral: () => neutral,
    orange: () => orange,
    pink: () => pink,
    purple: () => purple,
    red: () => red,
    rose: () => rose,
    sky: () => sky,
    slate: () => slate,
    stone: () => stone,
    teal: () => teal,
    violet: () => violet,
    yellow: () => yellow,
    zinc: () => zinc,
  });

  // node_modules/@twind/preset-tailwind/defaultTheme.js
  var theme2 = {
    ...theme,
    colors,
  };

  // src/index.ts
  var cancelAutoInstall = /* @__PURE__ */ auto(install2);
  function install2({ disablePreflight, ...config } = {}, isProduction) {
    cancelAutoInstall();
    return install(
      defineConfig({
        ...config,
        hash: false,
        presets: [
          presetAutoprefix(),
          presetTailwind({ disablePreflight }),
          ...asArray(config.presets),
        ],
      }),
      isProduction
    );
  }
})();
