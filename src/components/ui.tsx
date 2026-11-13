import { useEffect, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Compass, Cpu, Heart, Lightbulb, Mic, Wallet, type LucideIcon } from 'lucide-react'

export const ICONS: Record<string, LucideIcon> = { cpu: Cpu, wallet: Wallet, lightbulb: Lightbulb, mic: Mic, compass: Compass, heart: Heart }

export function useSeo(title: string, description: string) {
  useEffect(() => {
    document.title = `${title} | The Champions Matriculation Hr. Sec. School, Madurai`
    let meta = document.querySelector('meta[name="description"]')
    if (!meta) { meta = document.createElement('meta'); meta.setAttribute('name', 'description'); document.head.appendChild(meta) }
    meta.setAttribute('content', description)
    window.scrollTo(0, 0)
  }, [title, description])
}

export function PageHeader({ title, sub, image }: { title: string; sub?: string; image: string }) {
  return (
    <header className="relative isolate overflow-hidden bg-navy-900 text-white">
      <img src={image} alt="" className="absolute inset-0 -z-10 h-full w-full object-cover opacity-35" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-navy-900 via-navy-900/80 to-navy-900/30" />
      <div className="wrap py-16 sm:py-24">
        <h1 className="rise max-w-3xl text-4xl font-bold !text-white sm:text-5xl">{title}</h1>
        {sub && <p className="rise rise-2 mt-4 max-w-2xl text-lg text-white/80">{sub}</p>}
        <div className="mt-6 h-1 w-20 rounded bg-brand" />
      </div>
    </header>
  )
}

export function Heading({ title, sub, center }: { title: string; sub?: string; center?: boolean }) {
  return (
    <div className={center ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}>
      <h2 className="h2">{title}</h2>
      <div className={`mt-3 h-1 w-14 rounded bg-brand ${center ? 'mx-auto' : ''}`} />
      {sub && <p className="mt-4 text-lg leading-relaxed text-slate-600">{sub}</p>}
    </div>
  )
}

export function Pending({ children }: { children: ReactNode }) {
  return <div className="rounded-xl border border-dashed border-slate-300 bg-ash p-6 text-sm text-slate-600">{children}</div>
}

export function CtaBand() {
  return (
    <section className="bg-navy-800 text-white">
      <div className="wrap flex flex-col items-start justify-between gap-6 py-12 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-3xl font-bold !text-white">Every Champion Starts Somewhere.</h2>
          <p className="mt-2 text-white/75">Tell us about your child and we will get back to you.</p>
        </div>
        <Link to="/admissions#enquiry" className="btn-brand shrink-0">Admission enquiry</Link>
      </div>
    </section>
  )
}

export function toCsv(rows: Record<string, unknown>[]) {
  if (!rows.length) return ''
  const cols = Object.keys(rows[0])
  const esc = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""')}"`
  return [cols.join(','), ...rows.map((r) => cols.map((c) => esc(r[c])).join(','))].join('\n')
}
