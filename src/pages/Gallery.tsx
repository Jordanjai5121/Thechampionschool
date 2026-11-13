import { useState } from 'react'
import { Play } from 'lucide-react'
import { useGallery } from '../lib/data'
import { CATEGORIES } from '../lib/seed'
import { PageHeader, useSeo } from '../components/ui'
import { Lightbox } from '../components/Media'

export default function Gallery() {
  const { data: items } = useGallery()
  const [cat, setCat] = useState<string>('All')
  const [kind, setKind] = useState<'all' | 'image' | 'video'>('all')
  const [open, setOpen] = useState<number | null>(null)
  useSeo('Gallery', 'Photos and videos of the campus, classrooms, activities and programmes at The Champions Matriculation Hr. Sec. School.')
  const cats = ['All', ...CATEGORIES.filter((c) => items.some((i) => i.category === c)), ...Array.from(new Set(items.map((i) => i.category))).filter((c) => !(CATEGORIES as readonly string[]).includes(c))]
  const shown = items.filter((i) => (cat === 'All' || i.category === cat) && (kind === 'all' || i.kind === kind))
  const pill = (on: boolean) => `rounded-full px-4 py-2 text-sm font-semibold transition ${on ? 'bg-navy-800 text-white' : 'bg-ash text-navy-800 hover:bg-navy-50'}`
  return (
    <>
      <PageHeader title="Gallery" sub="Campus, classrooms, programmes and students at work." image="/media/img/campus-courtyard.webp" />
      <section className="section"><div className="wrap">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">{cats.map((c) => <button key={c} className={pill(cat === c)} aria-pressed={cat === c} onClick={() => setCat(c)}>{c}</button>)}</div>
        <div className="mt-3 flex gap-2" role="group" aria-label="Filter by type">{(['all', 'image', 'video'] as const).map((k) => <button key={k} className={pill(kind === k)} aria-pressed={kind === k} onClick={() => setKind(k)}>{k === 'all' ? 'Photos & videos' : k === 'image' ? 'Photos' : 'Videos'}</button>)}</div>
        {shown.length === 0 && <p className="mt-10 text-slate-600">Nothing in this category yet.</p>}
        <ul className="mt-8 columns-2 gap-4 lg:columns-3 xl:columns-4">
          {shown.map((it, i) => (
            <li key={`${it.url}-${i}`} className="mb-4 break-inside-avoid">
              <button onClick={() => setOpen(i)} className="group relative block w-full overflow-hidden rounded-xl bg-navy-50" aria-label={`Open ${it.kind}: ${it.title}`}>
                {it.kind === 'video'
                  ? <>{it.poster_url ? <img src={it.poster_url} alt="" loading="lazy" className="w-full" /> : <div className="aspect-[9/14] bg-navy-800" />}<span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand p-3 text-white"><Play size={20} fill="currentColor" /></span></>
                  : <img src={it.url} alt={it.title} loading="lazy" className="w-full transition duration-500 group-hover:scale-105" />}
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy-900/80 to-transparent p-3 text-left text-sm font-medium text-white">{it.title}</span>
              </button>
            </li>
          ))}
        </ul>
      </div></section>
      {open !== null && <Lightbox items={shown} index={open} onClose={() => setOpen(null)} onIndex={setOpen} />}
    </>
  )
}
