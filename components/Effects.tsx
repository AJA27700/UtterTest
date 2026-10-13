'use client'
// The static site's page effects (site.js), re-run after every page change. They work on the
// data-* attributes in the ported pages: data-reveal, data-speed, .stack__card, .route, data-scroller, data-yt.
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

export default function Effects() {
  const path = usePathname()

  // once: header shadow when the tab bar sticks; hero entrance after the fonts load
  useEffect(() => {
    const root = document.documentElement
    const strip = document.querySelector<HTMLElement>('.topstrip')
    const onScroll = () => root.classList.toggle('is-stuck', window.scrollY > (strip ? strip.offsetHeight : 0) + 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    let done = false
    const loaded = () => { if (!done) { done = true; root.classList.add('is-loaded') } }
    document.fonts?.ready.then(() => requestAnimationFrame(loaded))
    const t = setTimeout(loaded, 900)
    return () => { window.removeEventListener('scroll', onScroll); clearTimeout(t) }
  }, [])

  // per page
  useEffect(() => {
    const $$ = <T extends Element = HTMLElement>(s: string, c: ParentNode = document) => Array.from(c.querySelectorAll<T>(s) as NodeListOf<T>)
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const offs: (() => void)[] = []

    // sidebar starts at the current category
    const side = document.querySelector<HTMLElement>('.sidebar nav'), cur = side?.querySelector<HTMLElement>('[aria-current="page"]')
    if (side && cur && side.scrollHeight > side.clientHeight) side.scrollTop = Math.max(0, cur.offsetTop - side.clientHeight / 3)

    // reveal on scroll
    $$('[data-stagger]').forEach((g) => $$('[data-reveal]', g).forEach((el, i) => el.style.setProperty('--i', String(i % 8))))
    const reveal = $$('[data-reveal]:not(.is-in)')
    if ('IntersectionObserver' in window && !reduce) {
      const io = new IntersectionObserver((es) => es.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target) } }), { rootMargin: '0px 0px -8% 0px', threshold: 0.12 })
      reveal.forEach((el) => io.observe(el))
      offs.push(() => io.disconnect())
    } else reveal.forEach((el) => el.classList.add('is-in'))

    // parallax, stacking cards, the delivery-route truck
    const parallax = reduce ? [] : $$('[data-speed]')
    const stack = reduce ? [] : $$('.stack__card')
    const route = document.querySelector<HTMLElement>('.route')
    const routePath = route?.querySelector<SVGPathElement>('[data-route]') ?? null
    const routeFill = route?.querySelector<SVGPathElement>('[data-route-fill]') ?? null
    const truck = route?.querySelector<HTMLElement>('.route__truck') ?? null
    const len = routePath ? routePath.getTotalLength() : 0
    if (routeFill) { routeFill.style.strokeDasharray = String(len); routeFill.style.strokeDashoffset = String(reduce ? 0 : len) }
    const placeTruck = (p: number) => {
      if (!routePath || !truck) return
      const svg = routePath.ownerSVGElement!, vb = svg.viewBox.baseVal, r = svg.getBoundingClientRect()
      const t = 0.12 + p * 0.76, pt = routePath.getPointAtLength(len * t)
      const x = ((pt.x - vb.x) / vb.width) * r.width, y = ((pt.y - vb.y) / vb.height) * r.height
      const base = ((truck.offsetParent as HTMLElement) || route!).getBoundingClientRect()
      truck.style.transform = `translate(${(x + r.left - base.left - truck.offsetWidth / 2).toFixed(1)}px,${(y + r.top - base.top - truck.offsetHeight * 0.82).toFixed(1)}px)`
      if (routeFill) routeFill.style.strokeDashoffset = String(len * (1 - t))
    }
    let ticking = false
    const frame = () => {
      ticking = false
      const vh = window.innerHeight
      for (const el of parallax) {
        const sp = parseFloat(el.dataset.speed || '0') || 0, box = el.parentElement!.getBoundingClientRect()
        if (box.bottom < -200 || box.top > vh + 200) continue
        el.style.transform = `translate3d(0,${((box.top + box.height / 2 - vh / 2) * sp).toFixed(1)}px,0)`
      }
      for (let j = 0; j < stack.length - 1; j++) {
        const a = stack[j].getBoundingClientRect(), b = stack[j + 1].getBoundingClientRect()
        const p = Math.min(1, Math.max(0, (a.bottom - b.top) / a.height))
        stack[j].style.transform = `scale(${(1 - p * 0.06).toFixed(4)})`
        stack[j].style.filter = `brightness(${(1 - p * 0.08).toFixed(3)})`
      }
      if (route && routePath) {
        const rr = route.getBoundingClientRect()
        placeTruck(reduce ? 1 : Math.min(1, Math.max(0, (vh * 0.85 - rr.top) / (vh * 0.55))))
      }
    }
    const req = () => { if (!ticking) { ticking = true; requestAnimationFrame(frame) } }
    if (parallax.length || stack.length || route) {
      window.addEventListener('scroll', req, { passive: true })
      window.addEventListener('resize', req)
      req()
      offs.push(() => { window.removeEventListener('scroll', req); window.removeEventListener('resize', req) })
    }

    // horizontal scroller arrows (homepage picks)
    $$('[data-scroller]').forEach((wrap) => {
      const track = wrap.querySelector<HTMLElement>('.picks'), prev = wrap.querySelector<HTMLButtonElement>('[data-prev]'), next = wrap.querySelector<HTMLButtonElement>('[data-next]')
      if (!track) return
      const step = () => { const c = track.querySelector('.pick'); return c ? c.getBoundingClientRect().width + 18 : 300 }
      const update = () => {
        if (prev) prev.disabled = track.scrollLeft < 8
        if (next) next.disabled = track.scrollLeft + track.clientWidth > track.scrollWidth - 8
      }
      const back = () => track.scrollBy({ left: -step(), behavior: reduce ? 'auto' : 'smooth' })
      const fwd = () => track.scrollBy({ left: step(), behavior: reduce ? 'auto' : 'smooth' })
      prev?.addEventListener('click', back); next?.addEventListener('click', fwd); track.addEventListener('scroll', update, { passive: true })
      update()
      offs.push(() => { prev?.removeEventListener('click', back); next?.removeEventListener('click', fwd); track.removeEventListener('scroll', update) })
    })

    // YouTube: load the player only when someone presses play
    $$<HTMLButtonElement>('[data-yt]').forEach((btn) => {
      const play = () => {
        const f = document.createElement('iframe')
        f.src = `https://www.youtube-nocookie.com/embed/${btn.dataset.yt}?autoplay=1&rel=0`
        f.title = btn.getAttribute('aria-label') || 'Video'
        f.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
        f.allowFullscreen = true
        btn.parentElement!.appendChild(f)
        btn.remove()
      }
      btn.addEventListener('click', play, { once: true })
    })

    // little things
    $$('[data-year]').forEach((el) => { el.textContent = String(new Date().getFullYear()) })
    $$('[data-top]').forEach((a) => {
      const top = (e: Event) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }) }
      a.addEventListener('click', top)
      offs.push(() => a.removeEventListener('click', top))
    })

    return () => offs.forEach((off) => off())
  }, [path])

  return null
}
