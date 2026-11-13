import { useEffect, useRef, useState } from 'react'
import { Play, X, ChevronLeft, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { GalleryItem } from '../lib/types'

export function VideoTile({ src, poster, title, className = '' }: { src: string; poster?: string | null; title: string; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(false)
  const toggle = () => {
    const v = ref.current; if (!v) return
    if (v.paused) { v.play(); setPlaying(true) } else { v.pause(); setPlaying(false) }
  }
  return (
    <div className={`group relative overflow-hidden rounded-2xl bg-navy-900 ${className}`}>
      <video ref={ref} src={src} poster={poster || undefined} muted loop playsInline preload="none" onEnded={() => setPlaying(false)} className="h-full w-full object-cover" aria-label={title} />
      <button onClick={toggle} aria-label={`${playing ? 'Pause' : 'Play'} video: ${title}`} className="absolute inset-0 flex items-end bg-gradient-to-t from-navy-900/70 via-transparent p-4 text-left">
        {!playing && <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand p-4 text-white shadow-lg transition group-hover:scale-110"><Play fill="currentColor" size={22} /></span>}
        <span className="text-sm font-semibold text-white">{title}</span>
      </button>
    </div>
  )
}

export function Lightbox({ items, index, onClose, onIndex }: { items: GalleryItem[]; index: number; onClose: () => void; onIndex: (i: number) => void }) {
  const it = items[index]
  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') onIndex((index + 1) % items.length)
      if (e.key === 'ArrowLeft') onIndex((index - 1 + items.length) % items.length)
    }
    window.addEventListener('keydown', k)
    document.body.style.overflow = 'hidden'
    return () => { window.removeEventListener('keydown', k); document.body.style.overflow = '' }
  }, [index, items.length, onClose, onIndex])
  if (!it) return null
  return (
    <div role="dialog" aria-modal="true" aria-label={it.title} className="fixed inset-0 z-50 flex items-center justify-center bg-navy-900/95 p-4" onClick={onClose}>
      <button className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white" aria-label="Close" onClick={onClose}><X /></button>
      <button className="absolute left-3 rounded-full bg-white/10 p-2 text-white" aria-label="Previous" onClick={(e) => { e.stopPropagation(); onIndex((index - 1 + items.length) % items.length) }}><ChevronLeft /></button>
      <button className="absolute right-3 rounded-full bg-white/10 p-2 text-white" aria-label="Next" onClick={(e) => { e.stopPropagation(); onIndex((index + 1) % items.length) }}><ChevronRight /></button>
      <figure className="max-h-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
        {it.kind === 'video'
          ? <video key={it.url} src={it.url} controls autoPlay playsInline className="max-h-[80vh] rounded-lg" />
          : <img src={it.url} alt={it.title} className="max-h-[80vh] rounded-lg object-contain" />}
        <figcaption className="mt-3 text-center text-sm text-white/85">{it.title}</figcaption>
      </figure>
    </div>
  )
}

type Leader = { name: string; title: string; photo: string; message: string[] }
export function LeaderCard({ l, full }: { l: Leader; full?: boolean }) {
  const body = full ? l.message : l.message.slice(1, 3)
  return (
    <article className="grid overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm sm:grid-cols-5">
      <img src={l.photo} alt={`${l.name}, ${l.title}`} loading="lazy" className="h-72 w-full object-cover object-top sm:col-span-2 sm:h-full" />
      <div className="p-6 sm:col-span-3 sm:p-8">
        <h3 className="text-2xl font-bold">{l.name}</h3>
        <p className="mt-1 text-sm font-semibold text-brand-dark">{l.title}</p>
        <div className="mt-4 space-y-3 leading-relaxed text-slate-600">
          {body.map((p, i) => <p key={i} className={!full && i === 1 ? 'line-clamp-3' : ''}>{p}</p>)}
        </div>
        {!full && <Link to="/about#leadership" className="mt-4 inline-block text-sm font-semibold text-navy-700 underline underline-offset-4">Read the full message</Link>}
        {full && <p className="mt-5 font-semibold text-navy-800">{l.name}<br /><span className="font-normal text-slate-500">{l.title}, The Champions Matriculation Hr. Sec. School</span></p>}
      </div>
    </article>
  )
}
