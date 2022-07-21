const H = function () {
  const t = document.createElement('link').relList
  if (t && t.supports && t.supports('modulepreload')) return
  for (const s of document.querySelectorAll('link[rel="modulepreload"]')) i(s)
  new MutationObserver((s) => {
    for (const o of s)
      if (o.type === 'childList')
        for (const l of o.addedNodes) l.tagName === 'LINK' && l.rel === 'modulepreload' && i(l)
  }).observe(document, { childList: !0, subtree: !0 })
  function n(s) {
    const o = {}
    return (
      s.integrity && (o.integrity = s.integrity),
      s.referrerpolicy && (o.referrerPolicy = s.referrerpolicy),
      s.crossorigin === 'use-credentials'
        ? (o.credentials = 'include')
        : s.crossorigin === 'anonymous'
        ? (o.credentials = 'omit')
        : (o.credentials = 'same-origin'),
      o
    )
  }
  function i(s) {
    if (s.ep) return
    s.ep = !0
    const o = n(s)
    fetch(s.href, o)
  }
}
H()
const y = {}
let $ = _
const A = {},
  m = 1,
  x = 2,
  M = { owned: null, cleanups: null, context: null, owner: null }
var u = null
let N = null,
  w = null,
  r = null,
  a = null,
  B = 0
function j(e, t) {
  const n = u,
    i = e.length === 0,
    s = i ? M : { owned: null, cleanups: null, context: null, owner: t || n },
    o = i ? e : () => e(() => O(s))
  u = s
  try {
    return L(o, !0)
  } finally {
    u = n
  }
}
function C(e, t, n) {
  const i = Q(e, t, !1, m)
  D(i)
}
function J(e) {
  if (w) return e()
  let t
  const n = (w = [])
  try {
    t = e()
  } finally {
    w = null
  }
  return (
    L(() => {
      for (let i = 0; i < n.length; i += 1) {
        const s = n[i]
        if (s.pending !== A) {
          const o = s.pending
          ;(s.pending = A), v(s, o)
        }
      }
    }, !1),
    t
  )
}
function P(e) {
  let t
  return (t = e()), t
}
function v(e, t, n) {
  if (w) return e.pending === A && w.push(e), (e.pending = t), t
  if (e.comparator && e.comparator(e.value, t)) return t
  let i = !1
  return (
    (e.value = t),
    e.observers &&
      e.observers.length &&
      L(() => {
        for (let s = 0; s < e.observers.length; s += 1) {
          const o = e.observers[s]
          i && N.disposed.has(o),
            ((i && !o.tState) || (!i && !o.state)) && (o.pure ? r.push(o) : a.push(o), o.observers && R(o)),
            i || (o.state = m)
        }
        if (r.length > 1e6) throw ((r = []), new Error())
      }, !1),
    t
  )
}
function D(e) {
  if (!e.fn) return
  O(e)
  const t = u,
    n = B
  ;(u = e), K(e, e.value, n), (u = t)
}
function K(e, t, n) {
  let i
  try {
    i = e.fn(t)
  } catch (s) {
    q(s)
  }
  ;(!e.updatedAt || e.updatedAt <= n) &&
    (e.observers && e.observers.length ? v(e, i) : (e.value = i), (e.updatedAt = n))
}
function Q(e, t, n, i = m, s) {
  const o = {
    fn: e,
    state: i,
    updatedAt: null,
    owned: null,
    sources: null,
    sourceSlots: null,
    cleanups: null,
    value: t,
    owner: u,
    context: null,
    pure: n,
  }
  return u === null || (u !== M && (u.owned ? u.owned.push(o) : (u.owned = [o]))), o
}
function F(e) {
  const t = N
  if (e.state === 0 || t) return
  if (e.state === x || t) return E(e)
  if (e.suspense && P(e.suspense.inFallback)) return e.suspense.effects.push(e)
  const n = [e]
  for (; (e = e.owner) && (!e.updatedAt || e.updatedAt < B); ) (e.state || t) && n.push(e)
  for (let i = n.length - 1; i >= 0; i--)
    if (((e = n[i]), e.state === m || t)) D(e)
    else if (e.state === x || t) {
      const s = r
      ;(r = null), E(e, n[0]), (r = s)
    }
}
function L(e, t) {
  if (r) return e()
  let n = !1
  t || (r = []), a ? (n = !0) : (a = []), B++
  try {
    const i = e()
    return V(n), i
  } catch (i) {
    q(i)
  } finally {
    ;(r = null), n || (a = null)
  }
}
function V(e) {
  r && (_(r), (r = null)),
    !e &&
      (a.length
        ? J(() => {
            $(a), (a = null)
          })
        : (a = null))
}
function _(e) {
  for (let t = 0; t < e.length; t++) F(e[t])
}
function E(e, t) {
  const n = N
  e.state = 0
  for (let i = 0; i < e.sources.length; i += 1) {
    const s = e.sources[i]
    s.sources && (s.state === m || n ? s !== t && F(s) : (s.state === x || n) && E(s, t))
  }
}
function R(e) {
  const t = N
  for (let n = 0; n < e.observers.length; n += 1) {
    const i = e.observers[n]
    ;(!i.state || t) && ((i.state = x), i.pure ? r.push(i) : a.push(i), i.observers && R(i))
  }
}
function O(e) {
  let t
  if (e.sources)
    for (; e.sources.length; ) {
      const n = e.sources.pop(),
        i = e.sourceSlots.pop(),
        s = n.observers
      if (s && s.length) {
        const o = s.pop(),
          l = n.observerSlots.pop()
        i < s.length && ((o.sourceSlots[l] = i), (s[i] = o), (n.observerSlots[i] = l))
      }
    }
  if (e.owned) {
    for (t = 0; t < e.owned.length; t++) O(e.owned[t])
    e.owned = null
  }
  if (e.cleanups) {
    for (t = 0; t < e.cleanups.length; t++) e.cleanups[t]()
    e.cleanups = null
  }
  ;(e.state = 0), (e.context = null)
}
function q(e) {
  throw e
}
function W(e, t) {
  return P(() => e(t || {}))
}
function X(e, t, n) {
  let i = n.length,
    s = t.length,
    o = i,
    l = 0,
    f = 0,
    h = t[s - 1].nextSibling,
    p = null
  for (; l < s || f < o; ) {
    if (t[l] === n[f]) {
      l++, f++
      continue
    }
    for (; t[s - 1] === n[o - 1]; ) s--, o--
    if (s === l) {
      const c = o < i ? (f ? n[f - 1].nextSibling : n[o - f]) : h
      for (; f < o; ) e.insertBefore(n[f++], c)
    } else if (o === f) for (; l < s; ) (!p || !p.has(t[l])) && t[l].remove(), l++
    else if (t[l] === n[o - 1] && n[f] === t[s - 1]) {
      const c = t[--s].nextSibling
      e.insertBefore(n[f++], t[l++].nextSibling), e.insertBefore(n[--o], c), (t[s] = n[o])
    } else {
      if (!p) {
        p = new Map()
        let d = f
        for (; d < o; ) p.set(n[d], d++)
      }
      const c = p.get(t[l])
      if (c != null)
        if (f < c && c < o) {
          let d = l,
            b = 1,
            U
          for (; ++d < s && d < o && !((U = p.get(t[d])) == null || U !== c + b); ) b++
          if (b > c - f) {
            const G = t[l]
            for (; f < c; ) e.insertBefore(n[f++], G)
          } else e.replaceChild(n[f++], t[l++])
        } else l++
      else t[l++].remove()
    }
  }
}
function Y(e, t, n) {
  let i
  return (
    j((s) => {
      ;(i = s), t === document ? e() : k(t, e(), t.firstChild ? null : void 0, n)
    }),
    () => {
      i(), (t.textContent = '')
    }
  )
}
function Z(e, t, n) {
  const i = document.createElement('template')
  i.innerHTML = e
  let s = i.content.firstChild
  return n && (s = s.firstChild), s
}
function k(e, t, n, i) {
  if ((n !== void 0 && !i && (i = []), typeof t != 'function')) return S(e, t, i, n)
  C((s) => S(e, t(), s, n), i)
}
function S(e, t, n, i, s) {
  for (y.context && !n && (n = [...e.childNodes]); typeof n == 'function'; ) n = n()
  if (t === n) return n
  const o = typeof t,
    l = i !== void 0
  if (((e = (l && n[0] && n[0].parentNode) || e), o === 'string' || o === 'number')) {
    if (y.context) return n
    if ((o === 'number' && (t = t.toString()), l)) {
      let f = n[0]
      f && f.nodeType === 3 ? (f.data = t) : (f = document.createTextNode(t)), (n = g(e, n, i, f))
    } else n !== '' && typeof n == 'string' ? (n = e.firstChild.data = t) : (n = e.textContent = t)
  } else if (t == null || o === 'boolean') {
    if (y.context) return n
    n = g(e, n, i)
  } else {
    if (o === 'function')
      return (
        C(() => {
          let f = t()
          for (; typeof f == 'function'; ) f = f()
          n = S(e, f, n, i)
        }),
        () => n
      )
    if (Array.isArray(t)) {
      const f = []
      if (T(f, t, s)) return C(() => (n = S(e, f, n, i, !0))), () => n
      if (y.context) {
        for (let h = 0; h < f.length; h++) if (f[h].parentNode) return (n = f)
      }
      if (f.length === 0) {
        if (((n = g(e, n, i)), l)) return n
      } else Array.isArray(n) ? (n.length === 0 ? I(e, f, i) : X(e, n, f)) : (n && g(e), I(e, f))
      n = f
    } else if (t instanceof Node) {
      if (y.context && t.parentNode) return (n = l ? [t] : t)
      if (Array.isArray(n)) {
        if (l) return (n = g(e, n, i, t))
        g(e, n, null, t)
      } else n == null || n === '' || !e.firstChild ? e.appendChild(t) : e.replaceChild(t, e.firstChild)
      n = t
    }
  }
  return n
}
function T(e, t, n) {
  let i = !1
  for (let s = 0, o = t.length; s < o; s++) {
    let l = t[s],
      f
    if (l instanceof Node) e.push(l)
    else if (!(l == null || l === !0 || l === !1))
      if (Array.isArray(l)) i = T(e, l) || i
      else if ((f = typeof l) == 'string') e.push(document.createTextNode(l))
      else if (f === 'function')
        if (n) {
          for (; typeof l == 'function'; ) l = l()
          i = T(e, Array.isArray(l) ? l : [l]) || i
        } else e.push(l), (i = !0)
      else e.push(document.createTextNode(l.toString()))
  }
  return i
}
function I(e, t, n) {
  for (let i = 0, s = t.length; i < s; i++) e.insertBefore(t[i], n)
}
function g(e, t, n, i) {
  if (n === void 0) return (e.textContent = '')
  const s = i || document.createTextNode('')
  if (t.length) {
    let o = !1
    for (let l = t.length - 1; l >= 0; l--) {
      const f = t[l]
      if (s !== f) {
        const h = f.parentNode === e
        !o && !l ? (h ? e.replaceChild(s, f) : e.insertBefore(s, n)) : h && f.remove()
      } else o = !0
    }
  } else e.insertBefore(s, n)
  return [s]
}
const z = '_root_1kn1c_1'
var ee = { root: z }
const te = Z('<div>Some cool SolidJS project</div>'),
  ne = () =>
    (() => {
      const e = te.cloneNode(!0)
      return C(() => (e.className = ee.root)), e
    })()
Y(() => W(ne, {}), document.getElementById('root'))
