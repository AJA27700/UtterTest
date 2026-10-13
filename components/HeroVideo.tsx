'use client'
import { useEffect, useRef } from 'react'

// The cow film: starts by itself, muted, plays once and stops on the last frame.
// No autoplay attribute on purpose (Safari Low Power Mode forces controls onto videos that have one).
export default function HeroVideo() {
  const v = useRef<HTMLVideoElement>(null)
  useEffect(() => {
    const el = v.current
    if (!el) return
    el.controls = false
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { el.poster = '/assets/video/hero-last.jpg'; return }
    el.muted = true
    el.play().catch(() => { el.poster = '/assets/video/hero-last.jpg' })
  }, [])
  return (
    <video ref={v} className="hero__video" muted playsInline preload="auto" poster="/assets/video/hero-first.jpg" aria-hidden="true" tabIndex={-1} disablePictureInPicture disableRemotePlayback>
      <source src="/assets/video/hero.mp4" type="video/mp4" />
      <source src="/assets/video/hero.webm" type="video/webm" />
    </video>
  )
}
